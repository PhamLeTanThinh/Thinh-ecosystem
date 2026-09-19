import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { createDefaultCards } from './seed'
import { storage } from './storage'
import type { ChineseCard, ChineseDeck, ChineseSettings, ChineseProgress, ReviewResult } from './types'

const DEFAULT_SETTINGS: ChineseSettings = { pinyinPosition: 'hanzi', shuffle: true, quizMode: 'hanzi-to-meaning' }

// markResult() chạy MỖI LẦN trả lời 1 câu lúc học/làm quiz — nếu PUT thẳng lên server mỗi lần thì
// "hit" DB liên tục suốt cả buổi học dù chỉ 1 người đang thao tác dồn dập. Debounce: dồn nhiều lần
// trả lời liên tiếp trong khoảng ngắn thành 1 request mang đúng trạng thái progress mới nhất. Flush
// ngay khi rời/ẩn trang để không mất lần trả lời cuối nếu người dùng thoát đúng lúc còn đang chờ.
const PROGRESS_SAVE_DEBOUNCE_MS = 1200
let progressSaveTimer: ReturnType<typeof setTimeout> | null = null
let pendingProgress: ChineseProgress[] | null = null

function scheduleProgressSave(progress: ChineseProgress[]) {
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

interface ChineseState {
  hydrated: boolean
  cards: ChineseCard[]
  progress: ChineseProgress[]
  settings: ChineseSettings
  decks: ChineseDeck[]

  hydrate: () => Promise<void>

  addCard: (
    input: Pick<ChineseCard, 'kind' | 'lesson' | 'hanzi' | 'pinyin' | 'meaning' | 'note' | 'example'> &
      Partial<Pick<ChineseCard, 'theory' | 'exampleDetail'>>
  ) => Promise<ChineseCard>

  markResult: (cardId: string, result: ReviewResult) => void

  updateSettings: (patch: Partial<ChineseSettings>) => void

  addDeck: (name: string, cardIds: string[]) => ChineseDeck
  deleteDeck: (id: string) => void
}

export const useChineseStore = create<ChineseState>((set, get) => ({
  hydrated: false,
  cards: [],
  progress: [],
  settings: DEFAULT_SETTINGS,
  decks: [],

  hydrate: async () => {
    if (get().hydrated) return

    const [fetchedCards, progress, settings, decks] = await Promise.all([
      storage.getCards(),
      storage.getProgress(),
      storage.getSettings(),
      storage.getDecks(),
    ])
    let cards = fetchedCards

    if (cards.length === 0) {
      cards = createDefaultCards()
      await storage.saveCards(cards)
    }

    set({ hydrated: true, cards, progress, settings, decks })
  },

  // Thêm thẻ mới — gắn với hồ sơ học đang đăng nhập (server tự gán, xem api/chinese/cards/route.ts). Không
  // còn tự sinh id/sửa/xoá ở client: thẻ đã thêm là cố định, muốn "xoá" thì xoá cả hồ sơ (trang /admin).
  addCard: async (input) => {
    const card = await storage.addCard({
      kind: input.kind,
      lesson: input.lesson,
      hanzi: input.hanzi,
      pinyin: input.pinyin,
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
    const next: ChineseProgress = existing
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

  addDeck: (name, cardIds) => {
    const deck: ChineseDeck = { id: nanoid(), name, cardIds, createdAt: new Date().toISOString() }
    const decks = [...get().decks, deck]
    set({ decks })
    storage.saveDecks(decks).catch(console.error)
    return deck
  },

  deleteDeck: (id) => {
    const decks = get().decks.filter((d) => d.id !== id)
    set({ decks })
    storage.saveDecks(decks).catch(console.error)
  },
}))
