import { create } from 'zustand'

interface HabitsUIState {
  addHabitOpen: boolean
  addHabitKey: number
  editingHabitId: string | null
  openAddHabit: (habitId?: string) => void
  closeAddHabit: () => void
}

// `addHabitKey` bumps on every open so the modal's form remounts with fresh state
// instead of needing a reset effect (same convention as lib/money/uiStore.ts).
export const useHabitsUIStore = create<HabitsUIState>((set) => ({
  addHabitOpen: false,
  addHabitKey: 0,
  editingHabitId: null,
  openAddHabit: (habitId) =>
    set((s) => ({ addHabitOpen: true, addHabitKey: s.addHabitKey + 1, editingHabitId: habitId ?? null })),
  closeAddHabit: () => set({ addHabitOpen: false }),
}))
