import { count, eq, isNotNull, max, sum } from 'drizzle-orm'
import { db } from '@/lib/db'
import { chineseCards, chineseDecks, chineseProgress, chineseSettings, koreanCards, koreanProgress, koreanSettings, learnerProfiles } from '@/db/schema'
import { hasLearnerData, isLearnerIdTaken, isRegistered } from '@/lib/learner/registry'

// Quản lý hồ sơ học (Chinese + Korean dùng chung 1 hồ sơ) cho trang /admin — xem lib/learner/identity.ts.

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

// Chuyển toàn bộ dữ liệu học của 1 hồ sơ sang tên mới (tiến độ/cài đặt/bộ từ/thẻ tự thêm của cả 2 app).
// Không đụng sổ đăng ký learnerProfiles — nơi gọi tự xử lý phần đó tuỳ ngữ cảnh (nhận tên mới hay đổi tên
// hồ sơ đã đăng ký). chineseCards/koreanCards CHỈ update những dòng đã có learnerId = oldId (thẻ tự thêm
// của hồ sơ này) — không đụng tới thẻ gốc (learnerId NULL) vì điều kiện where không bao giờ khớp NULL.
export async function moveLearnerData(tx: Tx, oldId: string, newId: string) {
  await tx.update(chineseProgress).set({ learnerId: newId }).where(eq(chineseProgress.learnerId, oldId))
  await tx.update(chineseSettings).set({ learnerId: newId }).where(eq(chineseSettings.learnerId, oldId))
  await tx.update(chineseDecks).set({ learnerId: newId }).where(eq(chineseDecks.learnerId, oldId))
  await tx.update(chineseCards).set({ learnerId: newId }).where(eq(chineseCards.learnerId, oldId))
  await tx.update(koreanProgress).set({ learnerId: newId }).where(eq(koreanProgress.learnerId, oldId))
  await tx.update(koreanSettings).set({ learnerId: newId }).where(eq(koreanSettings.learnerId, oldId))
  await tx.update(koreanCards).set({ learnerId: newId }).where(eq(koreanCards.learnerId, oldId))
}

export interface LearnerSummary {
  id: string
  // false = hồ sơ CŨ có dữ liệu nhưng chưa có tên trong sổ đăng ký (mã tự sinh từ bản trước, hoặc 'legacy').
  registered: boolean
  createdAt: string | null
  lastActiveAt: string | null
  chinese: { reviewed: number; correct: number; wrong: number; decks: number; addedCards: number }
  korean: { reviewed: number; correct: number; wrong: number; addedCards: number }
}

const emptySummary = (id: string): LearnerSummary => ({
  id,
  registered: false,
  createdAt: null,
  lastActiveAt: null,
  chinese: { reviewed: 0, correct: 0, wrong: 0, decks: 0, addedCards: 0 },
  korean: { reviewed: 0, correct: 0, wrong: 0, addedCards: 0 },
})

// Gộp mọi hồ sơ: những tên đã đăng ký (kể cả chưa học gì) + những mã chỉ xuất hiện trong bảng dữ liệu. Mới
// hoạt động gần nhất lên đầu; hồ sơ chưa học gì xếp theo ngày tạo.
export async function listLearners(): Promise<LearnerSummary[]> {
  const [profiles, cProg, kProg, cDecks, cSettings, kSettings, cCards, kCards] = await Promise.all([
    db.select().from(learnerProfiles),
    db
      .select({
        id: chineseProgress.learnerId,
        reviewed: count(),
        correct: sum(chineseProgress.correctCount),
        wrong: sum(chineseProgress.wrongCount),
        last: max(chineseProgress.lastReviewedAt),
      })
      .from(chineseProgress)
      .groupBy(chineseProgress.learnerId),
    db
      .select({
        id: koreanProgress.learnerId,
        reviewed: count(),
        correct: sum(koreanProgress.correctCount),
        wrong: sum(koreanProgress.wrongCount),
        last: max(koreanProgress.lastReviewedAt),
      })
      .from(koreanProgress)
      .groupBy(koreanProgress.learnerId),
    db.select({ id: chineseDecks.learnerId, n: count() }).from(chineseDecks).groupBy(chineseDecks.learnerId),
    db.select({ id: chineseSettings.learnerId }).from(chineseSettings),
    db.select({ id: koreanSettings.learnerId }).from(koreanSettings),
    // learnerId NULL = thẻ gốc dùng chung, không tính vào của riêng ai — isNotNull() lọc trước khi group.
    db.select({ id: chineseCards.learnerId, n: count() }).from(chineseCards).where(isNotNull(chineseCards.learnerId)).groupBy(chineseCards.learnerId),
    db.select({ id: koreanCards.learnerId, n: count() }).from(koreanCards).where(isNotNull(koreanCards.learnerId)).groupBy(koreanCards.learnerId),
  ])

  const byId = new Map<string, LearnerSummary>()
  const get = (id: string) => {
    let s = byId.get(id)
    if (!s) byId.set(id, (s = emptySummary(id)))
    return s
  }
  const touch = (s: LearnerSummary, d: Date | null) => {
    if (d && (!s.lastActiveAt || d.toISOString() > s.lastActiveAt)) s.lastActiveAt = d.toISOString()
  }

  for (const p of profiles) {
    const s = get(p.id)
    s.registered = true
    s.createdAt = p.createdAt.toISOString()
  }
  for (const r of cProg) {
    const s = get(r.id)
    s.chinese.reviewed = r.reviewed
    s.chinese.correct = Number(r.correct ?? 0)
    s.chinese.wrong = Number(r.wrong ?? 0)
    touch(s, r.last)
  }
  for (const r of kProg) {
    const s = get(r.id)
    s.korean.reviewed = r.reviewed
    s.korean.correct = Number(r.correct ?? 0)
    s.korean.wrong = Number(r.wrong ?? 0)
    touch(s, r.last)
  }
  for (const r of cDecks) get(r.id).chinese.decks = r.n
  for (const r of cSettings) get(r.id)
  for (const r of kSettings) get(r.id)
  for (const r of cCards) if (r.id) get(r.id).chinese.addedCards = r.n
  for (const r of kCards) if (r.id) get(r.id).korean.addedCards = r.n

  return [...byId.values()].sort((a, b) => {
    const ka = a.lastActiveAt ?? a.createdAt ?? ''
    const kb = b.lastActiveAt ?? b.createdAt ?? ''
    return kb.localeCompare(ka) || a.id.localeCompare(b.id)
  })
}

// Xoá hẳn 1 hồ sơ: toàn bộ tiến độ, cài đặt, bộ từ, THẺ TỰ THÊM (Trung + Hàn) và cả tên trong sổ đăng ký —
// tên được giải phóng cho người khác dùng. Thẻ GỐC (learnerId NULL, ~611/646 thẻ nội dung dùng chung) không
// bao giờ bị đụng tới ở đây: mọi điều kiện where đều so bằng đúng `id` cụ thể, không bao giờ khớp NULL.
export async function deleteLearner(id: string): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(chineseProgress).where(eq(chineseProgress.learnerId, id))
    await tx.delete(chineseSettings).where(eq(chineseSettings.learnerId, id))
    await tx.delete(chineseDecks).where(eq(chineseDecks.learnerId, id))
    await tx.delete(chineseCards).where(eq(chineseCards.learnerId, id))
    await tx.delete(koreanProgress).where(eq(koreanProgress.learnerId, id))
    await tx.delete(koreanSettings).where(eq(koreanSettings.learnerId, id))
    await tx.delete(koreanCards).where(eq(koreanCards.learnerId, id))
    await tx.delete(learnerProfiles).where(eq(learnerProfiles.id, id))
  })
}

export type RenameResult = 'ok' | 'taken' | 'not-found'

// Đổi tên 1 hồ sơ bất kỳ (kể cả hồ sơ cũ chưa có tên — đăng ký luôn tên mới). Tên cũ của hồ sơ đã đăng ký
// được giải phóng. Người đang dùng tên cũ trên trình duyệt sẽ được hỏi lại tên ở lần vào kế tiếp (xem whoami).
export async function renameLearner(oldId: string, newId: string): Promise<RenameResult> {
  if (oldId === newId) return 'ok'
  const registered = await isRegistered(oldId)
  if (!registered && !(await hasLearnerData(oldId))) return 'not-found'
  if (await isLearnerIdTaken(newId)) return 'taken'

  try {
    await db.transaction(async (tx) => {
      if (registered) await tx.update(learnerProfiles).set({ id: newId }).where(eq(learnerProfiles.id, oldId))
      else await tx.insert(learnerProfiles).values({ id: newId })
      await moveLearnerData(tx, oldId, newId)
    })
  } catch (err) {
    // 2 người đổi/tạo cùng 1 tên gần như cùng lúc: chỉ 1 người thắng ở ràng buộc UNIQUE của sổ đăng ký.
    const code = (err as { code?: string; cause?: { code?: string } }).code ?? (err as { cause?: { code?: string } }).cause?.code
    if (code === '23505') return 'taken'
    throw err
  }
  return 'ok'
}
