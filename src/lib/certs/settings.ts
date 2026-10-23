import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { appSettings } from '@/db/schema'

// Cách vào Certs Hub, chủ trang bật/tắt ở tab Certs của /admin:
// - 'verified' (mặc định): đăng nhập bằng magic link email + phải được mời/duyệt (bảng certInvites).
// - 'profile': ai cũng vào được, chỉ cần tạo hồ sơ học (tên, không email) như Chinese/Korean — xem
//   lib/learner/identity.ts. Chủ trang vẫn nhận ra qua session email như cũ.
export type CertsAccessMode = 'verified' | 'profile'

const KEY = 'certs_access_mode'

export async function getCertsAccessMode(): Promise<CertsAccessMode> {
  const [row] = await db.select({ value: appSettings.value }).from(appSettings).where(eq(appSettings.key, KEY)).limit(1)
  return row?.value === 'profile' ? 'profile' : 'verified'
}

export async function setCertsAccessMode(mode: CertsAccessMode): Promise<void> {
  await db
    .insert(appSettings)
    .values({ key: KEY, value: mode })
    .onConflictDoUpdate({ target: appSettings.key, set: { value: mode, updatedAt: new Date() } })
}
