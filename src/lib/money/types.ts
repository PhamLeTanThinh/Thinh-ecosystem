export type TransactionType = 'expense' | 'income' | 'debt'

export interface Wallet {
  id: string
  name: string
  icon: string
  createdAt: string
  includeInTotal: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: TransactionType
}

export interface Transaction {
  id: string
  walletId: string
  categoryId: string
  type: TransactionType
  amount: number
  note?: string
  date: string
  debtId?: string
  createdAt: string
}

export interface Budget {
  id: string
  walletId: string
  categoryId: string
  amount: number
  periodStart: string
  periodEnd: string
  repeatMonthly: boolean
}

export interface Settings {
  cycleStartDay: number
}

export type DebtDirection = 'owe' | 'owed'

export interface Debt {
  id: string
  name: string
  direction: DebtDirection
  principal: number
  dueDate?: string
  note?: string
  closed: boolean
  createdAt: string
}

export interface MoneyBackupData {
  wallets: Wallet[]
  categories: Category[]
  transactions: Transaction[]
  budgets: Budget[]
  debts: Debt[]
  settings: Settings
}

export interface BackupSummary {
  id: string
  createdAt: string
}
