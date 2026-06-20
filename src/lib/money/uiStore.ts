import { create } from 'zustand'

interface MoneyUIState {
  addTransactionOpen: boolean
  addTransactionKey: number
  addBudgetOpen: boolean
  addBudgetKey: number
  editingBudgetId: string | null
  addDebtOpen: boolean
  addDebtKey: number
  walletPickerOpen: boolean
  openAddTransaction: () => void
  closeAddTransaction: () => void
  openAddBudget: (budgetId?: string) => void
  closeAddBudget: () => void
  openAddDebt: () => void
  closeAddDebt: () => void
  openWalletPicker: () => void
  closeWalletPicker: () => void
}

// `*Key` is bumped on every open so the modal's form remounts with fresh state
// instead of needing a reset effect.
export const useMoneyUIStore = create<MoneyUIState>((set) => ({
  addTransactionOpen: false,
  addTransactionKey: 0,
  addBudgetOpen: false,
  addBudgetKey: 0,
  editingBudgetId: null,
  addDebtOpen: false,
  addDebtKey: 0,
  walletPickerOpen: false,
  openAddTransaction: () => set((s) => ({ addTransactionOpen: true, addTransactionKey: s.addTransactionKey + 1 })),
  closeAddTransaction: () => set({ addTransactionOpen: false }),
  openAddBudget: (budgetId) =>
    set((s) => ({ addBudgetOpen: true, addBudgetKey: s.addBudgetKey + 1, editingBudgetId: budgetId ?? null })),
  closeAddBudget: () => set({ addBudgetOpen: false }),
  openAddDebt: () => set((s) => ({ addDebtOpen: true, addDebtKey: s.addDebtKey + 1 })),
  closeAddDebt: () => set({ addDebtOpen: false }),
  openWalletPicker: () => set({ walletPickerOpen: true }),
  closeWalletPicker: () => set({ walletPickerOpen: false }),
}))
