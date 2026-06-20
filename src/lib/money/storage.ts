import type { Budget, Category, Debt, Settings, Transaction, Wallet } from './types'

async function getJSON<T>(url: string): Promise<T[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`)
  return res.json()
}

async function putJSON<T>(url: string, body: T[]): Promise<void> {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PUT ${url} failed: ${res.status}`)
}

async function getObject<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`)
  return res.json()
}

async function putObject<T>(url: string, body: T): Promise<void> {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PUT ${url} failed: ${res.status}`)
}

// Backed by Postgres via /api/money/* — swap these bodies again for a different
// backend later, callers (lib/money/store.ts) never change.
export const storage = {
  getWallets: () => getJSON<Wallet>('/api/money/wallets'),
  saveWallets: (wallets: Wallet[]) => putJSON('/api/money/wallets', wallets),

  getCategories: () => getJSON<Category>('/api/money/categories'),
  saveCategories: (categories: Category[]) => putJSON('/api/money/categories', categories),

  getTransactions: () => getJSON<Transaction>('/api/money/transactions'),
  saveTransactions: (transactions: Transaction[]) => putJSON('/api/money/transactions', transactions),

  getBudgets: () => getJSON<Budget>('/api/money/budgets'),
  saveBudgets: (budgets: Budget[]) => putJSON('/api/money/budgets', budgets),

  getDebts: () => getJSON<Debt>('/api/money/debts'),
  saveDebts: (debts: Debt[]) => putJSON('/api/money/debts', debts),

  getSettings: () => getObject<Settings>('/api/money/settings'),
  saveSettings: (settings: Settings) => putObject('/api/money/settings', settings),
}
