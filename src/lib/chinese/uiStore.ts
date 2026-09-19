import { create } from 'zustand'

interface ChineseUIState {
  addCardOpen: boolean
  addCardKey: number
  openAddCard: () => void
  closeAddCard: () => void
}

// `addCardKey` bumps on every open so the modal's form remounts with fresh state
// instead of needing a reset effect (same convention as lib/habits/uiStore.ts).
export const useChineseUIStore = create<ChineseUIState>((set) => ({
  addCardOpen: false,
  addCardKey: 0,
  openAddCard: () => set((s) => ({ addCardOpen: true, addCardKey: s.addCardKey + 1 })),
  closeAddCard: () => set({ addCardOpen: false }),
}))
