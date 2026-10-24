import { eq, max } from 'drizzle-orm'
import { db } from '@/lib/db'
import { certAccessLogs, certGrants, certInvites, ieltsAccessLogs, ieltsInvites } from '@/db/schema'
import { emailSubject } from '@/lib/certs/visibility'
import { deleteLearner, listLearners } from '@/lib/learner/admin'
import { LEGACY_LEARNER_ID } from '@/lib/learner/identity'

// Tự dọn người lâu không hoạt động — chạy mỗi tuần (04:00 sáng thứ Hai giờ VN) bằng Vercel Cron (/api/cron/cleanup-inactive, lịch trong
// vercel.json). Quá INACTIVE_DAYS ngày không hoạt động thì XOÁ HẲN:
// - Email được mời xem IELTS: hoạt động = lần vào IELTS gần nhất (ielts_access_logs), chưa vào lần nào thì tính
//   từ lúc được mời. Xoá dòng mời — muốn vào lại phải được mời/duyệt lại.
// - Email được mời xem Certs: như trên với cert_access_logs; xoá luôn quyền xem cert riêng của email đó.
// - Hồ sơ học (Chinese/Korean/Certs dùng chung): hoạt động = lần mở app / ôn thẻ / làm đề gần nhất, chưa có thì
//   tính từ ngày tạo. Xoá toàn bộ tiến độ ở cả 3 app (deleteLearner). Bỏ qua 'legacy' (dữ liệu học cũ của chủ)
//   và hồ sơ cũ không rõ mốc thời gian nào.
// Bản ghi đã thu hồi cũng tính như thường. Log lượt vào cũ giữ nguyên (chỉ dùng để thống kê).
export const INACTIVE_DAYS = 30

export interface InactiveItem {
  id: string // email hoặc mã hồ sơ
  label: string
  lastActiveAt: string
}

export interface InactiveReport {
  cutoff: string
  ielts: InactiveItem[]
  certs: InactiveItem[]
  learners: InactiveItem[]
}

const latest = (...dates: (Date | null | undefined)[]) =>
  dates.reduce<Date | null>((a, d) => (d && (!a || d > a) ? d : a), null)

export async function findInactive(now = new Date()): Promise<InactiveReport> {
  const cutoff = new Date(now.getTime() - INACTIVE_DAYS * 24 * 60 * 60 * 1000)

  const [ieltsRows, ieltsLogs, certRows, certLogs, { learners }] = await Promise.all([
    db.select().from(ieltsInvites),
    db.select({ email: ieltsAccessLogs.email, last: max(ieltsAccessLogs.createdAt) }).from(ieltsAccessLogs).groupBy(ieltsAccessLogs.email),
    db.select().from(certInvites),
    db.select({ email: certAccessLogs.email, last: max(certAccessLogs.createdAt) }).from(certAccessLogs).groupBy(certAccessLogs.email),
    listLearners(),
  ])

  const stale = (invites: { email: string; invitedAt: Date }[], logs: { email: string; last: Date | null }[]) => {
    const lastSeen = new Map(logs.map((l) => [l.email, l.last]))
    return invites.flatMap((v) => {
      const last = latest(v.invitedAt, lastSeen.get(v.email))!
      return last < cutoff ? [{ id: v.email, label: v.email, lastActiveAt: last.toISOString() }] : []
    })
  }

  const staleLearners = learners.flatMap((l) => {
    if (l.id === LEGACY_LEARNER_ID) return []
    const last = latest(l.lastActiveAt ? new Date(l.lastActiveAt) : null, l.createdAt ? new Date(l.createdAt) : null)
    return last && last < cutoff ? [{ id: l.id, label: l.displayName || l.id, lastActiveAt: last.toISOString() }] : []
  })

  return { cutoff: cutoff.toISOString(), ielts: stale(ieltsRows, ieltsLogs), certs: stale(certRows, certLogs), learners: staleLearners }
}

export async function purgeInactive(now = new Date()): Promise<InactiveReport> {
  const report = await findInactive(now)
  for (const v of report.ielts) await db.delete(ieltsInvites).where(eq(ieltsInvites.email, v.id))
  for (const v of report.certs) {
    await db.delete(certInvites).where(eq(certInvites.email, v.id))
    await db.delete(certGrants).where(eq(certGrants.subject, emailSubject(v.id)))
  }
  for (const l of report.learners) await deleteLearner(l.id)
  return report
}
