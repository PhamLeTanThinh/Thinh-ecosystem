import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { createDefaultCards } from './seed'
import { storage } from './storage'
import type { ChineseCard, ChineseDeck, ChineseSettings, ChineseProgress, ReviewResult } from './types'

const DEFAULT_SETTINGS: ChineseSettings = { pinyinPosition: 'hanzi', shuffle: true, quizMode: 'hanzi-to-meaning' }

interface ChineseState {
  hydrated: boolean
  cards: ChineseCard[]
  progress: ChineseProgress[]
  settings: ChineseSettings
  decks: ChineseDeck[]

  hydrate: () => Promise<void>

  addCard: (input: Pick<ChineseCard, 'hanzi' | 'pinyin' | 'meaning'>) => ChineseCard
  updateCard: (id: string, patch: Partial<Omit<ChineseCard, 'id'>>) => void
  deleteCard: (id: string) => void

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

  addCard: (input) => {
    const card: ChineseCard = {
      id: nanoid(),
      hanzi: input.hanzi,
      pinyin: input.pinyin,
      meaning: input.meaning,
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

  // Cascades: xoá luôn tiến độ ôn tập của thẻ này, và gỡ khỏi mọi bộ học đang chứa nó.
  deleteCard: (id) => {
    const cards = get().cards.filter((c) => c.id !== id)
    const progress = get().progress.filter((p) => p.id !== id)
    const decks = get().decks.map((d) => ({ ...d, cardIds: d.cardIds.filter((cardId) => cardId !== id) }))
    set({ cards, progress, decks })
    storage.saveCards(cards).catch(console.error)
    storage.saveProgress(progress).catch(console.error)
    storage.saveDecks(decks).catch(console.error)
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
    storage.saveProgress(progress).catch(console.error)
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
