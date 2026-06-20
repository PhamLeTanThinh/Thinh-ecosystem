import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { createDefaultCategories, createDefaultWallet } from './seed'
import { storage } from './storage'
import type { Budget, Category, Debt, Settings, Transaction, Wallet } from './types'

const DEFAULT_SETTINGS: Settings = { cycleStartDay: 19 }

interface MoneyState {
  hydrated: boolean
  wallets: Wallet[]
  categories: Category[]
  transactions: Transaction[]
  budgets: Budget[]
  debts: Debt[]
  settings: Settings
  currentWalletId: string | null
  balanceHidden: boolean

  hydrate: () => Promise<void>
  toggleBalanceHidden: () => void
  setCurrentWalletId: (id: string) => void

  addWallet: (input: Pick<Wallet, 'name' | 'icon'>) => Wallet
  updateWallet: (id: string, patch: Partial<Omit<Wallet, 'id'>>) => void
  deleteWallet: (id: string) => void

  addTransaction: (input: Omit<Transaction, 'id' | 'createdAt'>) => Transaction
  updateTransaction: (id: string, patch: Partial<Omit<Transaction, 'id'>>) => void
  deleteTransaction: (id: string) => void

  addBudget: (input: Omit<Budget, 'id'>) => Budget
  updateBudget: (id: string, patch: Partial<Omit<Budget, 'id'>>) => void
  deleteBudget: (id: string) => void

  addDebt: (input: Omit<Debt, 'id' | 'createdAt' | 'closed'>) => Debt
  updateDebt: (id: string, patch: Partial<Omit<Debt, 'id'>>) => void
  deleteDebt: (id: string) => void

  updateSettings: (patch: Partial<Settings>) => void
}

export const useMoneyStore = create<MoneyState>((set, get) => ({
  hydrated: false,
  wallets: [],
  categories: [],
  transactions: [],
  budgets: [],
  debts: [],
  settings: DEFAULT_SETTINGS,
  currentWalletId: null,
  balanceHidden: false,

  hydrate: async () => {
    if (get().hydrated) return

    const [fetchedWallets, fetchedCategories, transactions, budgets, debts, settings] = await Promise.all([
      storage.getWallets(),
      storage.getCategories(),
      storage.getTransactions(),
      storage.getBudgets(),
      storage.getDebts(),
      storage.getSettings(),
    ])
    let wallets = fetchedWallets
    let categories = fetchedCategories

    if (categories.length === 0) {
      categories = createDefaultCategories()
      await storage.saveCategories(categories)
    }
    if (wallets.length === 0) {
      wallets = [createDefaultWallet(new Date(), settings.cycleStartDay)]
      await storage.saveWallets(wallets)
    }

    set({
      hydrated: true,
      wallets,
      categories,
      transactions,
      budgets,
      debts,
      settings,
      currentWalletId: wallets[0]?.id ?? null,
    })
  },

  toggleBalanceHidden: () => set((s) => ({ balanceHidden: !s.balanceHidden })),

  setCurrentWalletId: (id) => set({ currentWalletId: id }),

  addWallet: (input) => {
    const wallet: Wallet = {
      id: nanoid(),
      name: input.name,
      icon: input.icon,
      createdAt: new Date().toISOString(),
      includeInTotal: true,
    }
    const wallets = [...get().wallets, wallet]
    set({ wallets })
    storage.saveWallets(wallets).catch(console.error)
    return wallet
  },

  updateWallet: (id, patch) => {
    const wallets = get().wallets.map((w) => (w.id === id ? { ...w, ...patch } : w))
    set({ wallets })
    storage.saveWallets(wallets).catch(console.error)
  },

  // Cascades: xoá luôn giao dịch/ngân sách thuộc ví này, không cho xoá ví cuối cùng.
  deleteWallet: (id) => {
    const state = get()
    if (state.wallets.length <= 1) return

    const wallets = state.wallets.filter((w) => w.id !== id)
    const transactions = state.transactions.filter((t) => t.walletId !== id)
    const budgets = state.budgets.filter((b) => b.walletId !== id)
    const currentWalletId = state.currentWalletId === id ? wallets[0]?.id ?? null : state.currentWalletId

    set({ wallets, transactions, budgets, currentWalletId })
    storage.saveWallets(wallets).catch(console.error)
    storage.saveTransactions(transactions).catch(console.error)
    storage.saveBudgets(budgets).catch(console.error)
  },

  addTransaction: (input) => {
    const tx: Transaction = { ...input, id: nanoid(), createdAt: new Date().toISOString() }
    const transactions = [...get().transactions, tx]
    set({ transactions })
    storage.saveTransactions(transactions).catch(console.error)
    return tx
  },

  updateTransaction: (id, patch) => {
    const transactions = get().transactions.map((tx) => (tx.id === id ? { ...tx, ...patch } : tx))
    set({ transactions })
    storage.saveTransactions(transactions).catch(console.error)
  },

  deleteTransaction: (id) => {
    const transactions = get().transactions.filter((tx) => tx.id !== id)
    set({ transactions })
    storage.saveTransactions(transactions).catch(console.error)
  },

  addBudget: (input) => {
    const budget: Budget = { ...input, id: nanoid() }
    const budgets = [...get().budgets, budget]
    set({ budgets })
    storage.saveBudgets(budgets).catch(console.error)
    return budget
  },

  updateBudget: (id, patch) => {
    const budgets = get().budgets.map((b) => (b.id === id ? { ...b, ...patch } : b))
    set({ budgets })
    storage.saveBudgets(budgets).catch(console.error)
  },

  deleteBudget: (id) => {
    const budgets = get().budgets.filter((b) => b.id !== id)
    set({ budgets })
    storage.saveBudgets(budgets).catch(console.error)
  },

  addDebt: (input) => {
    const debt: Debt = { ...input, id: nanoid(), closed: false, createdAt: new Date().toISOString() }
    const debts = [...get().debts, debt]
    set({ debts })
    storage.saveDebts(debts).catch(console.error)
    return debt
  },

  updateDebt: (id, patch) => {
    const debts = get().debts.map((d) => (d.id === id ? { ...d, ...patch } : d))
    set({ debts })
    storage.saveDebts(debts).catch(console.error)
  },

  // Unlink giao dịch đã gắn với khoản nợ này (giữ lại giao dịch, chỉ bỏ liên kết).
  // Phải lưu transactions (bỏ debtId) xong rồi mới xoá debt — tránh vi phạm FK trên server.
  deleteDebt: (id) => {
    const debts = get().debts.filter((d) => d.id !== id)
    const transactions = get().transactions.map((tx) => (tx.debtId === id ? { ...tx, debtId: undefined } : tx))
    set({ debts, transactions })
    storage
      .saveTransactions(transactions)
      .then(() => storage.saveDebts(debts))
      .catch(console.error)
  },

  updateSettings: (patch) => {
    const settings = { ...get().settings, ...patch }
    set({ settings })
    storage.saveSettings(settings).catch(console.error)
  },
}))
