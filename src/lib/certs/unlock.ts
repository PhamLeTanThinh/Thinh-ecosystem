import { and, count, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { certGrants, certUnlockRequests, learnerProfiles } from '@/db/schema'
import { CERT_OPTIONS, setCertGrant } from '@/lib/certs/visibility'
import { sendAppAccessRequestNotice } from '@/lib/ielts/mailer'

// Xin mở từng cert: người xem thấy mọi cert ở /certs, cert chưa được mở thì có nút "Xin quyền xem" → 1 dòng
// certUnlockRequests chờ chủ duyệt ở tab Certs của /admin. Duyệt = thêm cert vào certGrants của người đó.

// Trần số yêu cầu đang chờ — ai đã vào được Certs cũng gọi được, chặn spam làm đầy bảng và hộp thư của chủ.
const MAX_PENDING = 200

export type UnlockStatus = 'pending' | 'rejected'

const certCode = (certId: string) => CERT_OPTIONS.find((c) => c.id === certId)?.code ?? certId.toUpperCase()

// Trạng thái yêu cầu của 1 người xem cho từng cert (chỉ cert đã từng xin) — để trang /certs hiện đúng nút.
export async function getUnlockStatuses(subject: string): Promise<Record<string, UnlockStatus>> {
  const rows = await db.select().from(certUnlockRequests).where(eq(certUnlockRequests.subject, subject))
  return Object.fromEntries(rows.map((r) => [r.certId, r.status as UnlockStatus]))
}

// Tên dễ đọc của subject: email, hoặc tên hồ sơ học (có dấu) nếu có.
async function subjectLabels(subjects: string[]): Promise<Map<string, string>> {
  const learnerIds = subjects.filter((s) => s.startsWith('learner:')).map((s) => s.slice('learner:'.length))
  const names = learnerIds.length
    ? await db.select({ id: learnerProfiles.id, displayName: learnerProfiles.displayName }).from(learnerProfiles).where(inArray(learnerProfiles.id, learnerIds))
    : []
  const byId = new Map(names.map((n) => [n.id, n.displayName || n.id]))
  return new Map(subjects.map((s) => [s, s.startsWith('learner:') ? `hồ sơ ${byId.get(s.slice(8)) ?? s.slice(8)}` : s.slice('email:'.length)]))
}

// Ghi 1 yêu cầu (kèm họ tên người xin tự nhập) và báo chủ — chỉ báo lần đầu (xin lại khi đang chờ / đã bị từ chối thì
// không làm gì).
export async function requestCertUnlock(subject: string, certId: string, fullName: string, origin: string): Promise<void> {
  const [{ n }] = await db.select({ n: count() }).from(certUnlockRequests).where(eq(certUnlockRequests.status, 'pending'))
  if (n >= MAX_PENDING) return

  const inserted = await db.insert(certUnlockRequests).values({ subject, certId, fullName }).onConflictDoNothing().returning()
  if (inserted.length === 0) return

  const ownerEmail = process.env.IELTS_OWNER_EMAIL
  if (!ownerEmail) return
  try {
    const label = `${fullName} (${(await subjectLabels([subject])).get(subject) ?? subject})`
    await sendAppAccessRequestNotice(ownerEmail, label, `${origin}/admin?tab=certs`, `Certs Hub · ${certCode(certId)}`)
  } catch (err) {
    console.error('[cert unlock request notice]', err)
  }
}

export interface UnlockRequestRow {
  subject: string
  label: string
  fullName: string
  certId: string
  code: string
  requestedAt: string
}

export async function listPendingUnlocks(): Promise<UnlockRequestRow[]> {
  const rows = await db.select().from(certUnlockRequests).where(eq(certUnlockRequests.status, 'pending')).orderBy(certUnlockRequests.requestedAt)
  const labels = await subjectLabels([...new Set(rows.map((r) => r.subject))])
  return rows.map((r) => ({ subject: r.subject, label: labels.get(r.subject) ?? r.subject, fullName: r.fullName, certId: r.certId, code: certCode(r.certId), requestedAt: r.requestedAt.toISOString() }))
}

const requestWhere = (subject: string, certId: string) => and(eq(certUnlockRequests.subject, subject), eq(certUnlockRequests.certId, certId))

// Duyệt: cộng cert vào quyền xem riêng của người đó (giữ các cert đã mở trước), rồi xoá yêu cầu.
export async function approveCertUnlock(subject: string, certId: string): Promise<void> {
  const [grant] = await db.select({ certs: certGrants.certs }).from(certGrants).where(eq(certGrants.subject, subject))
  const current = grant?.certs ?? []
  if (!current.includes(certId)) await setCertGrant(subject, [...current, certId])
  await db.delete(certUnlockRequests).where(requestWhere(subject, certId))
}

export async function rejectCertUnlock(subject: string, certId: string): Promise<void> {
  await db.update(certUnlockRequests).set({ status: 'rejected' }).where(requestWhere(subject, certId))
}
