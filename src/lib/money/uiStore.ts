import { create } from 'zustand'

interface MoneyUIState {
  addTransactionOpen: boolean
  addTransactionKey: number
  addBudgetOpen: boolean
  addBudgetKey: number
  editingBudgetId: string | null
  // Kỳ (tháng/chu kỳ) đang xem trên trang Ngân sách — modal Thêm ngân sách đọc giá trị này để mặc
  // định vào đúng kỳ đang xem, và ghi lại giá trị này sau khi lưu để trang tự chuyển tới kỳ vừa lưu.
  // Tránh tình trạng thêm ngân sách xong nhưng "biến mất" vì 2 nơi lệch kỳ nhau.
  budgetMonthOffset: number
  addDebtOpen: boolean
  addDebtKey: number
  editingDebtId: string | null
  walletPickerOpen: boolean
  openAddTransaction: () => void
  closeAddTransaction: () => void
  openAddBudget: (budgetId?: string) => void
  closeAddBudget: () => void
  setBudgetMonthOffset: (offset: number) => void
  openAddDebt: (debtId?: string) => void
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
  budgetMonthOffset: 0,
  addDebtOpen: false,
  addDebtKey: 0,
  editingDebtId: null,
  walletPickerOpen: false,
  openAddTransaction: () => set((s) => ({ addTransactionOpen: true, addTransactionKey: s.addTransactionKey + 1 })),
  closeAddTransaction: () => set({ addTransactionOpen: false }),
  openAddBudget: (budgetId) =>
    set((s) => ({ addBudgetOpen: true, addBudgetKey: s.addBudgetKey + 1, editingBudgetId: budgetId ?? null })),
  closeAddBudget: () => set({ addBudgetOpen: false }),
  setBudgetMonthOffset: (offset) => set({ budgetMonthOffset: offset }),
  openAddDebt: (debtId) => set((s) => ({ addDebtOpen: true, addDebtKey: s.addDebtKey + 1, editingDebtId: debtId ?? null })),
  closeAddDebt: () => set({ addDebtOpen: false }),
  openWalletPicker: () => set({ walletPickerOpen: true }),
  closeWalletPicker: () => set({ walletPickerOpen: false }),
}))
