import { cookies } from 'next/headers'
import { eq, inArray } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { appSettings, certGrants } from '@/db/schema'
import { getCertsAccess, type CertsAccess } from '@/lib/certs/access'
import { CERT_CATALOG } from '@/lib/certs/catalog'
import { LEARNER_COOKIE } from '@/lib/learner/identity'
import { logCertView } from '@/lib/certs/views'
import type { CertSection } from '@/lib/certs/viewTypes'

// Ai được xem cert nào — chủ trang chỉnh ở tab Certs của /admin:
// - Chủ trang luôn thấy hết.
// - Mọi người thấy các cert trong danh sách MẶC ĐỊNH (app_settings 'certs_default_visible', chưa đặt = chỉ CCAF).
// - Từng người được mở THÊM cert qua bảng cert_grants, theo email (chế độ xác thực) và/hoặc theo hồ sơ học
//   (cookie learner_id, chế độ chỉ cần hồ sơ) — có cả 2 thì cộng dồn.
// Cert không được thấy: ẩn khỏi trang /certs, gõ thẳng URL thì 404.

// Danh sách cert cho admin (id + mã hiển thị), CCAF làm trước nên đứng đầu.
export const CERT_OPTIONS: { id: string; code: string }[] = [{ id: 'ccaf', code: 'CCAF' }, ...CERT_CATALOG.map((c) => ({ id: c.id, code: c.code }))]
const VALID_IDS = new Set(CERT_OPTIONS.map((c) => c.id))

const DEFAULT_KEY = 'certs_default_visible'
const FALLBACK_DEFAULT = ['ccaf']

export function cleanCertIds(value: unknown): string[] | null {
  if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) return null
  return CERT_OPTIONS.map((c) => c.id).filter((id) => value.includes(id))
}

export async function getDefaultVisibleCerts(): Promise<string[]> {
  const [row] = await db.select({ value: appSettings.value }).from(appSettings).where(eq(appSettings.key, DEFAULT_KEY)).limit(1)
  if (!row) return FALLBACK_DEFAULT
  try {
    return cleanCertIds(JSON.parse(row.value)) ?? FALLBACK_DEFAULT
  } catch {
    return FALLBACK_DEFAULT
  }
}

export async function setDefaultVisibleCerts(certs: string[]): Promise<void> {
  const value = JSON.stringify(certs)
  await db
    .insert(appSettings)
    .values({ key: DEFAULT_KEY, value })
    .onConflictDoUpdate({ target: appSettings.key, set: { value, updatedAt: new Date() } })
}

export async function setCertGrant(subject: string, certs: string[]): Promise<void> {
  if (certs.length === 0) {
    await db.delete(certGrants).where(eq(certGrants.subject, subject))
    return
  }
  await db
    .insert(certGrants)
    .values({ subject, certs })
    .onConflictDoUpdate({ target: certGrants.subject, set: { certs, updatedAt: new Date() } })
}

export const emailSubject = (email: string) => `email:${email.toLowerCase()}`
export const learnerSubject = (id: string) => `learner:${id}`

// 'all' = chủ trang (thấy hết).
export async function getVisibleCertIds(access: CertsAccess): Promise<Set<string> | 'all'> {
  if (access.mode === 'owner') return 'all'
  if (access.mode === 'denied') return new Set()

  const subjects: string[] = []
  if (access.email) subjects.push(emailSubject(access.email))
  const learnerId = (await cookies()).get(LEARNER_COOKIE)?.value
  if (learnerId) subjects.push(learnerSubject(learnerId))

  const [defaults, grants] = await Promise.all([
    getDefaultVisibleCerts(),
    subjects.length ? db.select({ certs: certGrants.certs }).from(certGrants).where(inArray(certGrants.subject, subjects)) : [],
  ])
  return new Set([...defaults, ...grants.flatMap((g) => g.certs)].filter((id) => VALID_IDS.has(id)))
}

export async function canSeeCert(access: CertsAccess, certId: string): Promise<boolean> {
  const visible = await getVisibleCertIds(access)
  return visible === 'all' || visible.has(certId)
}

// Dùng ở đầu mọi PAGE của 1 cert (thay cho assertCertsAccess) — chưa đăng nhập thì về /certs/login, đăng nhập
// rồi mà không được xem cert này thì 404 như thể trang không tồn tại. section = phần của cert đang mở, để ghi lượt xem
// (lib/certs/views.ts) cho /admin biết người xem mở cert nào, phần nào.
export async function assertCertVisible(certId: string, section: CertSection): Promise<void> {
  const access = await getCertsAccess()
  if (access.mode === 'denied') redirect('/certs/login')
  if (!(await canSeeCert(access, certId))) notFound()
  await logCertView(access, certId, section)
}
