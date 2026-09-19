import { create } from 'zustand'
import { createDefaultCards } from './seed'
import { storage } from './storage'
import type { KoreanCard, KoreanSettings, KoreanProgress, ReviewResult } from './types'

const DEFAULT_SETTINGS: KoreanSettings = { shuffle: true, quizMode: 'front-to-meaning' }

// markResult() chạy MỖI LẦN trả lời 1 câu lúc học/làm quiz — nếu PUT thẳng lên server mỗi lần thì
// "hit" DB liên tục suốt cả buổi học dù chỉ 1 người đang thao tác dồn dập. Debounce: dồn nhiều lần
// trả lời liên tiếp trong khoảng ngắn thành 1 request mang đúng trạng thái progress mới nhất. Flush
// ngay khi rời/ẩn trang để không mất lần trả lời cuối nếu người dùng thoát đúng lúc còn đang chờ.
const PROGRESS_SAVE_DEBOUNCE_MS = 1200
let progressSaveTimer: ReturnType<typeof setTimeout> | null = null
let pendingProgress: KoreanProgress[] | null = null

function scheduleProgressSave(progress: KoreanProgress[]) {
  pendingProgress = progress
  if (progressSaveTimer) clearTimeout(progressSaveTimer)
  progressSaveTimer = setTimeout(() => {
    progressSaveTimer = null
    const toSave = pendingProgress
    pendingProgress = null
    if (toSave) storage.saveProgress(toSave).catch(console.error)
  }, PROGRESS_SAVE_DEBOUNCE_MS)
}

function flushProgressSave() {
  if (progressSaveTimer) clearTimeout(progressSaveTimer)
  progressSaveTimer = null
  const toSave = pendingProgress
  pendingProgress = null
  if (toSave) storage.saveProgress(toSave).catch(console.error)
}


if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushProgressSave()
  })
  window.addEventListener('pagehide', flushProgressSave)
}

interface KoreanState {
  hydrated: boolean
  cards: KoreanCard[]
  progress: KoreanProgress[]
  settings: KoreanSettings

  hydrate: () => Promise<void>

  addCard: (
    input: Pick<KoreanCard, 'kind' | 'lesson' | 'front' | 'meaning' | 'note' | 'example'> & Partial<Pick<KoreanCard, 'theory' | 'exampleDetail'>>
  ) => Promise<KoreanCard>

  markResult: (cardId: string, result: ReviewResult) => void

  updateSettings: (patch: Partial<KoreanSettings>) => void
}

export const useKoreanStore = create<KoreanState>((set, get) => ({
  hydrated: false,
  cards: [],
  progress: [],
  settings: DEFAULT_SETTINGS,

  hydrate: async () => {
    if (get().hydrated) return

    const [fetchedCards, progress, settings] = await Promise.all([
      storage.getCards(),
      storage.getProgress(),
      storage.getSettings(),
    ])
    let cards = fetchedCards

    if (cards.length === 0) {
      cards = createDefaultCards()
      await storage.saveCards(cards)
    }

    set({ hydrated: true, cards, progress, settings })
  },

  // Thêm thẻ mới — gắn với hồ sơ học đang đăng nhập (server tự gán, xem api/korean/cards/route.ts). Không
  // còn tự sinh id/sửa/xoá ở client: thẻ đã thêm là cố định, muốn "xoá" thì xoá cả hồ sơ (trang /admin).
  addCard: async (input) => {
    const card = await storage.addCard({
      kind: input.kind,
      lesson: input.lesson,
      front: input.front,
      meaning: input.meaning,
      note: input.note,
      example: input.example,
      theory: input.theory ?? '',
      exampleDetail: input.exampleDetail ?? '[]',
    })
    set({ cards: [...get().cards, card] })
    return card
  },

  markResult: (cardId, result) => {
    const existing = get().progress.find((p) => p.id === cardId)
    const now = new Date().toISOString()
    const next: KoreanProgress = existing
      ? {
          ...existing,
          correctCount: existing.correctCount + (result === 'correct' ? 1 : 0),
          wrongCount: existing.wrongCount + (result === 'wrong' ? 1 : 0),
          lastResult: result,
          lastReviewedAt: now,
        }
      : {
          id: cardId,
          correctCount: result === 'correct' ? 1 : 0,
          wrongCount: result === 'wrong' ? 1 : 0,
          lastResult: result,
          lastReviewedAt: now,
        }
    const progress = existing
      ? get().progress.map((p) => (p.id === cardId ? next : p))
      : [...get().progress, next]
    set({ progress })
    scheduleProgressSave(progress)
  },

  updateSettings: (patch) => {
    const settings = { ...get().settings, ...patch }
    set({ settings })
    storage.saveSettings(settings).catch(console.error)
  },
}))
