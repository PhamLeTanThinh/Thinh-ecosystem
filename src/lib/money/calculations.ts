import type { Budget, Category, Debt, DebtDirection, Transaction, TransactionType, Wallet } from './types'

export interface Period {
  start: Date
  end: Date
}

const MONTH_NAMES_VN = [
  'thg 1', 'thg 2', 'thg 3', 'thg 4', 'thg 5', 'thg 6',
  'thg 7', 'thg 8', 'thg 9', 'thg 10', 'thg 11', 'thg 12',
]

// --- date helpers -----------------------------------------------------------

/** Transaction/Budget `date` fields are stored as 'YYYY-MM-DD'. Parsing with a fixed
 * time avoids the day shifting backward/forward depending on the local timezone. */
export function parseISODate(iso: string): Date {
  return new Date(`${iso.slice(0, 10)}T00:00:00`)
}

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/**
 * Period spanning `cycleStartDay` of one month through `cycleStartDay - 1` of the next
 * (e.g. cycleStartDay=19 → 19/06–18/07). `cycleStartDay<=1` falls back to a plain calendar month.
 */
function periodFromCycleMonth(year: number, monthIndex: number, cycleStartDay: number): Period {
  if (cycleStartDay <= 1) {
    return { start: new Date(year, monthIndex, 1), end: new Date(year, monthIndex + 1, 0) }
  }
  return { start: new Date(year, monthIndex, cycleStartDay), end: new Date(year, monthIndex + 1, cycleStartDay - 1) }
}

/** Cycle period for `monthOffset` cycles relative to `today` (0 = the cycle containing today). */
export function getMonthPeriod(monthOffset: number, today: Date = new Date(), cycleStartDay: number = 1): Period {
  const baseMonth = cycleStartDay <= 1 || today.getDate() >= cycleStartDay ? today.getMonth() : today.getMonth() - 1
  return periodFromCycleMonth(today.getFullYear(), baseMonth + monthOffset, cycleStartDay)
}

export function formatDayMonth(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function formatFullDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

export function formatPeriodRangeLabel(period: Period): string {
  return `${formatDayMonth(period.start)} - ${formatDayMonth(period.end)}`
}

/** "19 thg 6 2026, Hôm nay" style label used in the transaction list. */
export function formatTransactionDate(iso: string, today: Date = new Date()): string {
  const date = parseISODate(iso)
  const base = `${date.getDate()} ${MONTH_NAMES_VN[date.getMonth()]} ${date.getFullYear()}`
  if (isSameDay(date, today)) return `${base}, Hôm nay`
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (isSameDay(date, yesterday)) return `${base}, Hôm qua`
  return base
}

export function getDaysLeftInPeriod(period: Period, today: Date = new Date()): number {
  const end = new Date(period.end.getFullYear(), period.end.getMonth(), period.end.getDate())
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000))
}

// --- formatting --------------------------------------------------------------

const VND_FORMATTER = new Intl.NumberFormat('vi-VN')

export function formatVND(amount: number): string {
  return `${VND_FORMATTER.format(Math.round(amount))} đ`
}

// --- filtering -----------------------------------------------------------------

export function filterByWallet<T extends { walletId: string }>(items: T[], walletId: string): T[] {
  return items.filter((item) => item.walletId === walletId)
}

export function filterByPeriod(transactions: Transaction[], period: Period): Transaction[] {
  return transactions.filter((tx) => {
    const date = parseISODate(tx.date)
    return date >= period.start && date <= period.end
  })
}

export function filterByType(transactions: Transaction[], type: TransactionType): Transaction[] {
  return transactions.filter((tx) => tx.type === type)
}

// --- sums & balances -------------------------------------------------------------

export function sumAmount(transactions: Transaction[]): number {
  return transactions.reduce((total, tx) => total + tx.amount, 0)
}

export function sumByType(transactions: Transaction[], type: TransactionType): number {
  return sumAmount(filterByType(transactions, type))
}

/** Net cash effect of a transaction: expense subtracts, income/debt add. */
export function signedAmount(tx: Transaction): number {
  return tx.type === 'expense' ? -tx.amount : tx.amount
}

export function getWalletBalance(walletId: string, transactions: Transaction[]): number {
  return filterByWallet(transactions, walletId).reduce((total, tx) => total + signedAmount(tx), 0)
}

export function getTotalBalance(wallets: Wallet[], transactions: Transaction[]): number {
  return wallets
    .filter((w) => w.includeInTotal)
    .reduce((total, w) => total + getWalletBalance(w.id, transactions), 0)
}

/** Wallet balance at the start of `period` (i.e. net of every transaction before it). */
export function getOpeningBalance(walletId: string, transactions: Transaction[], period: Period): number {
  return filterByWallet(transactions, walletId)
    .filter((tx) => parseISODate(tx.date) < period.start)
    .reduce((total, tx) => total + signedAmount(tx), 0)
}

export function getClosingBalance(openingBalance: number, periodTransactions: Transaction[]): number {
  return periodTransactions.reduce((total, tx) => total + signedAmount(tx), openingBalance)
}

// --- grouping ---------------------------------------------------------------------

export interface CategoryGroup {
  category: Category
  transactions: Transaction[]
  total: number
}

/** Groups transactions by category, newest group first (by latest transaction in the group). */
export function groupByCategory(transactions: Transaction[], categories: Category[]): CategoryGroup[] {
  const byCategory = new Map<string, Transaction[]>()
  for (const tx of transactions) {
    const list = byCategory.get(tx.categoryId) ?? []
    list.push(tx)
    byCategory.set(tx.categoryId, list)
  }

  const groups: CategoryGroup[] = []
  for (const [categoryId, txs] of byCategory) {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) continue
    const sorted = [...txs].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
    groups.push({ category, transactions: sorted, total: sumAmount(sorted) })
  }

  return groups.sort((a, b) => b.transactions[0].date.localeCompare(a.transactions[0].date))
}

// --- trend chart ---------------------------------------------------------------------

export interface TrendPoint {
  date: string
  amount: number
}

/** Cumulative daily total of `type` transactions across the period, one point per day. */
export function getDailyTrend(transactions: Transaction[], period: Period, type: TransactionType = 'expense'): TrendPoint[] {
  const daily = filterByType(filterByPeriod(transactions, period), type)
  const totalsByDay = new Map<string, number>()
  for (const tx of daily) {
    totalsByDay.set(tx.date, (totalsByDay.get(tx.date) ?? 0) + tx.amount)
  }

  const points: TrendPoint[] = []
  let running = 0
  const cursor = new Date(period.start)
  while (cursor <= period.end) {
    const iso = toISODate(cursor)
    running += totalsByDay.get(iso) ?? 0
    points.push({ date: iso, amount: running })
    cursor.setDate(cursor.getDate() + 1)
  }
  return points
}

/** Average cumulative trend across the `monthsBack` periods preceding `period`, aligned by day index. */
export function getAverageTrend(
  transactions: Transaction[],
  period: Period,
  monthsBack: number = 3,
  type: TransactionType = 'expense',
  cycleStartDay: number = 1,
): TrendPoint[] {
  const pastTrends: TrendPoint[][] = []
  for (let i = 1; i <= monthsBack; i++) {
    const pastPeriod = periodFromCycleMonth(period.start.getFullYear(), period.start.getMonth() - i, cycleStartDay)
    pastTrends.push(getDailyTrend(transactions, pastPeriod, type))
  }

  const dayCount = Math.round((period.end.getTime() - period.start.getTime()) / 86_400_000) + 1
  const points: TrendPoint[] = []
  const cursor = new Date(period.start)
  for (let i = 0; i < dayCount; i++) {
    const valuesAtIndex = pastTrends.map((trend) => trend[Math.min(i, trend.length - 1)]?.amount ?? 0)
    const average = valuesAtIndex.length ? valuesAtIndex.reduce((a, b) => a + b, 0) / valuesAtIndex.length : 0
    points.push({ date: toISODate(cursor), amount: average })
    cursor.setDate(cursor.getDate() + 1)
  }
  return points
}

// --- budget ---------------------------------------------------------------------

// Không lọc theo `tx.type` vì category đã tự quyết định type (invariant giữa transaction
// và category) — nhờ vậy ngân sách áp dụng được cho cả category chi tiêu và category nợ.
export function getBudgetSpent(budget: Budget, transactions: Transaction[]): number {
  const start = parseISODate(budget.periodStart)
  const end = parseISODate(budget.periodEnd)
  return transactions
    .filter((tx) => tx.walletId === budget.walletId && tx.categoryId === budget.categoryId)
    .filter((tx) => {
      const date = parseISODate(tx.date)
      return date >= start && date <= end
    })
    .reduce((total, tx) => total + tx.amount, 0)
}

export function getBudgetProgress(budget: Budget, transactions: Transaction[]): number {
  if (budget.amount <= 0) return 0
  return Math.min(1, getBudgetSpent(budget, transactions) / budget.amount)
}

export function getTodayMarkerProgress(period: Period, today: Date = new Date()): number {
  const total = period.end.getTime() - period.start.getTime()
  if (total <= 0) return 0
  return Math.min(1, Math.max(0, (today.getTime() - period.start.getTime()) / total))
}

/**
 * Budgets for `walletId` that apply to `period`: one-time budgets only match their exact
 * original month, `repeatMonthly` budgets match every month from their creation onward and
 * are remapped so `periodStart`/`periodEnd` reflect the viewed period.
 */
export function getActiveBudgetsForPeriod(budgets: Budget[], walletId: string, period: Period): Budget[] {
  return budgets
    .filter((b) => b.walletId === walletId)
    .filter((b) => {
      const budgetStart = parseISODate(b.periodStart)
      return b.repeatMonthly ? budgetStart <= period.end : isSameDay(budgetStart, period.start)
    })
    .map((b) =>
      b.repeatMonthly ? { ...b, periodStart: toISODate(period.start), periodEnd: toISODate(period.end) } : b,
    )
}

// --- debt --------------------------------------------------------------------------

export function getDebtPaid(debt: Debt, transactions: Transaction[]): number {
  return transactions.filter((tx) => tx.debtId === debt.id).reduce((total, tx) => total + tx.amount, 0)
}

export function getDebtRemaining(debt: Debt, transactions: Transaction[]): number {
  return Math.max(0, debt.principal - getDebtPaid(debt, transactions))
}

export function getTotalDebt(debts: Debt[], transactions: Transaction[], direction: DebtDirection): number {
  return debts
    .filter((d) => d.direction === direction)
    .reduce((total, d) => total + getDebtRemaining(d, transactions), 0)
}
