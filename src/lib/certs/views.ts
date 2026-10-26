import { count, desc, max } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { db } from '@/lib/db'
import { certViews } from '@/db/schema'
import type { CertsAccess } from '@/lib/certs/access'
import { getCertSubject } from '@/lib/certs/subject'
import type { CertSection, CertViewStat } from '@/lib/certs/viewTypes'

// Ghi lại ai mở cert nào, phần nào (bảng certViews). Gọi từ assertCertVisible sau khi đã chắc người này được xem cert.
// Không ghi cho chủ trang (thống kê là để theo dõi người xem); người xem chưa tạo hồ sơ học cũng bỏ qua (getCertSubject).
export async function logCertView(access: CertsAccess, certId: string, section: CertSection): Promise<void> {
  const subject = await getCertSubject(access)
  if (!subject) return
  // await thay vì fire-and-forget (serverless có thể đóng hàm sớm); lỗi ghi log không được làm hỏng trang.
  try {
    await db.insert(certViews).values({ id: nanoid(), subject, certId, section })
  } catch (err) {
    console.error('[cert view]', err)
  }
}

// subject → các cert đã mở, cert xem nhiều nhất lên đầu.
export async function getCertViewStats(): Promise<Map<string, CertViewStat[]>> {
  const rows = await db
    .select({ subject: certViews.subject, cert: certViews.certId, section: certViews.section, n: count(), last: max(certViews.createdAt) })
    .from(certViews)
    .groupBy(certViews.subject, certViews.certId, certViews.section)
    .orderBy(desc(max(certViews.createdAt)))

  const bySubject = new Map<string, Map<string, CertViewStat>>()
  for (const r of rows) {
    let certs = bySubject.get(r.subject)
    if (!certs) bySubject.set(r.subject, (certs = new Map()))
    let stat = certs.get(r.cert)
    if (!stat) certs.set(r.cert, (stat = { cert: r.cert, count: 0, lastAt: null, sections: {} }))
    stat.count += r.n
    stat.sections[r.section as CertSection] = r.n
    const last = r.last?.toISOString() ?? null
    if (last && (!stat.lastAt || last > stat.lastAt)) stat.lastAt = last
  }
  return new Map([...bySubject].map(([subject, certs]) => [subject, [...certs.values()].sort((a, b) => b.count - a.count)]))
}
