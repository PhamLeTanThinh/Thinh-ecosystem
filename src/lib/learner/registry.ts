import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { certProgress, chineseDecks, chineseProgress, chineseSettings, koreanProgress, koreanSettings, learnerProfiles } from '@/db/schema'

export async function isRegistered(id: string): Promise<boolean> {
  const [row] = await db.select({ id: learnerProfiles.id }).from(learnerProfiles).where(eq(learnerProfiles.id, id)).limit(1)
  return !!row
}

// Tên đã có dữ liệu học ở 1 trong 6 bảng — bắt các tên có dữ liệu THẬT nhưng chưa nằm trong sổ
// learnerProfiles (vd 'legacy', hoặc hồ sơ từ trước khi có sổ đăng ký). Chỉ là bước lọc nhanh; chốt
// chặn chống trùng tên thật sự là ràng buộc UNIQUE của learnerProfiles.id.
export async function hasLearnerData(id: string): Promise<boolean> {
  const [a] = await db.select({ x: chineseProgress.learnerId }).from(chineseProgress).where(eq(chineseProgress.learnerId, id)).limit(1)
  if (a) return true
  const [b] = await db.select({ x: chineseSettings.learnerId }).from(chineseSettings).where(eq(chineseSettings.learnerId, id)).limit(1)
  if (b) return true
  const [c] = await db.select({ x: chineseDecks.learnerId }).from(chineseDecks).where(eq(chineseDecks.learnerId, id)).limit(1)
  if (c) return true
  const [d] = await db.select({ x: koreanProgress.learnerId }).from(koreanProgress).where(eq(koreanProgress.learnerId, id)).limit(1)
  if (d) return true
  const [e] = await db.select({ x: koreanSettings.learnerId }).from(koreanSettings).where(eq(koreanSettings.learnerId, id)).limit(1)
  if (e) return true
  const [f] = await db.select({ x: certProgress.learnerId }).from(certProgress).where(eq(certProgress.learnerId, id)).limit(1)
  return !!f
}

export async function isLearnerIdTaken(id: string): Promise<boolean> {
  return (await isRegistered(id)) || (await hasLearnerData(id))
}
