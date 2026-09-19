import { nanoid } from 'nanoid'
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

// Dùng cho các thay đổi KHÔNG nên trì hoãn (vd xoá thẻ kéo theo xoá progress) — huỷ hẳn lần lưu debounce
// đang chờ (nếu có) rồi lưu ngay mảng progress MỚI NHẤT truyền vào. Bắt buộc phải huỷ timer cũ: nếu
// không, timer đó vẫn đang giữ mảng progress CŨ (từ trước khi xoá) và sẽ ghi đè lên đây sau ~1.2s,
// làm "sống lại" đúng dòng progress vừa xoá.
function commitProgressNow(progress: KoreanProgress[]) {
  if (progressSaveTimer) clearTimeout(progressSaveTimer)
  progressSaveTimer = null
  pendingProgress = null
  storage.saveProgress(progress).catch(console.error)
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
  ) => KoreanCard
  updateCard: (id: string, patch: Partial<Omit<KoreanCard, 'id'>>) => void
  deleteCard: (id: string) => void

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

  addCard: (input) => {
    const card: KoreanCard = {
      id: nanoid(),
      kind: input.kind,
      lesson: input.lesson,
      front: input.front,
      meaning: input.meaning,
      note: input.note,
      example: input.example,
      theory: input.theory ?? '',
      exampleDetail: input.exampleDetail ?? '[]',
      sortOrder: get().cards.length,
      createdAt: new Date().toISOString(),
    }
    const cards = [...get().cards, card]
    set({ cards })
    storage.saveCards(cards).catch(console.error)
    return card
  },

  updateCard: (id, patch) => {
    const cards = get().cards.map((c) => (c.id === id ? { ...c, ...patch } : c))
    set({ cards })
    storage.saveCards(cards).catch(console.error)
  },

  // Cascades: xoá luôn tiến độ ôn tập của thẻ này.
  deleteCard: (id) => {
    const cards = get().cards.filter((c) => c.id !== id)
    const progress = get().progress.filter((p) => p.id !== id)
    set({ cards, progress })
    storage.saveCards(cards).catch(console.error)
    commitProgressNow(progress)
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
