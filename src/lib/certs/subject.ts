import { cookies } from 'next/headers'
import type { CertsAccess } from '@/lib/certs/access'
import { LEARNER_COOKIE } from '@/lib/learner/identity'

// "Người xem này là ai" theo quy ước subject của certGrants / certViews / certUnlockRequests: có phiên email thì
// 'email:<email>', không có (chế độ chỉ cần hồ sơ) thì 'learner:<id>' từ cookie hồ sơ học. null = chủ trang, bị chặn,
// hoặc chưa tạo hồ sơ học.
export async function getCertSubject(access: CertsAccess): Promise<string | null> {
  if (access.mode === 'owner' || access.mode === 'denied') return null
  if (access.email) return `email:${access.email.toLowerCase()}`
  const learnerId = (await cookies()).get(LEARNER_COOKIE)?.value
  return learnerId ? `learner:${learnerId}` : null
}
