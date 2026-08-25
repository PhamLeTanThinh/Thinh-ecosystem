import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { createDefaultCards } from './seed'
import { storage } from './storage'
import type { KoreanCard, KoreanSettings, KoreanProgress, ReviewResult } from './types'

const DEFAULT_SETTINGS: KoreanSettings = { shuffle: true, quizMode: 'front-to-meaning' }

interface KoreanState {
  hydrated: boolean
  cards: KoreanCard[]
  progress: KoreanProgress[]
  settings: KoreanSettings

  hydrate: () => Promise<void>

  addCard: (input: Pick<KoreanCard, 'kind' | 'lesson' | 'front' | 'meaning' | 'note' | 'example'>) => KoreanCard
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
    storage.saveProgress(progress).catch(console.error)
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
    storage.saveProgress(progress).catch(console.error)
  },

  updateSettings: (patch) => {
    const settings = { ...get().settings, ...patch }
    set({ settings })
    storage.saveSettings(settings).catch(console.error)
  },
}))
