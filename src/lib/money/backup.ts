import { desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  moneyBackups,
  moneyBudgets,
  moneyCategories,
  moneyDebts,
  moneySettings,
  moneyTransactions,
  moneyWallets,
} from '@/db/schema'
import type { BackupSummary, MoneyBackupData } from './types'

const SETTINGS_ID = 'default'
const MAX_BACKUPS = 30

async function readAllData(): Promise<MoneyBackupData> {
  const [walletRows, categoryRows, transactionRows, budgetRows, debtRows, settingsRows] = await Promise.all([
    db.select().from(moneyWallets),
    db.select().from(moneyCategories),
    db.select().from(moneyTransactions),
    db.select().from(moneyBudgets),
    db.select().from(moneyDebts),
    db.select().from(moneySettings).where(eq(moneySettings.id, SETTINGS_ID)),
  ])

  return {
    wallets: walletRows.map((r) => ({
      id: r.id,
      name: r.name,
      icon: r.icon,
      includeInTotal: r.includeInTotal,
      createdAt: r.createdAt.toISOString(),
    })),
    categories: categoryRows.map((r) => ({
      id: r.id,
      name: r.name,
      icon: r.icon,
      color: r.color,
      type: r.type as MoneyBackupData['categories'][number]['type'],
    })),
    transactions: transactionRows.map((r) => ({
      id: r.id,
      walletId: r.walletId,
      categoryId: r.categoryId,
      type: r.type as MoneyBackupData['transactions'][number]['type'],
      amount: r.amount,
      note: r.note ?? undefined,
      date: r.date,
      debtId: r.debtId ?? undefined,
      createdAt: r.createdAt.toISOString(),
    })),
    budgets: budgetRows.map((r) => ({
      id: r.id,
      walletId: r.walletId,
      categoryId: r.categoryId,
      amount: r.amount,
      periodStart: r.periodStart,
      periodEnd: r.periodEnd,
      repeatMonthly: r.repeatMonthly,
    })),
    debts: debtRows.map((r) => ({
      id: r.id,
      name: r.name,
      direction: r.direction as MoneyBackupData['debts'][number]['direction'],
      principal: r.principal,
      dueDate: r.dueDate ?? undefined,
      note: r.note ?? undefined,
      closed: r.closed,
      createdAt: r.createdAt.toISOString(),
    })),
    settings: settingsRows[0] ? { cycleStartDay: settingsRows[0].cycleStartDay } : { cycleStartDay: 19 },
  }
}

/** Snapshot toàn bộ dữ liệu money hiện tại vào `moneyBackups`, rồi prune về tối đa `MAX_BACKUPS` bản gần nhất. */
export async function createSnapshot(): Promise<void> {
  const data = await readAllData()
  await db.insert(moneyBackups).values({ id: crypto.randomUUID(), data })

  const all = await db
    .select({ id: moneyBackups.id })
    .from(moneyBackups)
    .orderBy(desc(moneyBackups.createdAt))
  const staleIds = all.slice(MAX_BACKUPS).map((b) => b.id)
  if (staleIds.length > 0) {
    await db.delete(moneyBackups).where(inArray(moneyBackups.id, staleIds))
  }
}

export async function listBackups(): Promise<BackupSummary[]> {
  const rows = await db
    .select({ id: moneyBackups.id, createdAt: moneyBackups.createdAt })
    .from(moneyBackups)
    .orderBy(desc(moneyBackups.createdAt))
  return rows.map((r) => ({ id: r.id, createdAt: r.createdAt.toISOString() }))
}

export async function getBackupData(): Promise<MoneyBackupData> {
  return readAllData()
}

/** Ghi đè TOÀN BỘ dữ liệu money hiện tại bằng nội dung của 1 bản sao lưu (hoặc payload import thủ công). */
export async function restoreData(data: MoneyBackupData): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(moneyTransactions)
    await tx.delete(moneyBudgets)
    await tx.delete(moneyDebts)
    await tx.delete(moneyCategories)
    await tx.delete(moneyWallets)
    await tx.delete(moneySettings)

    for (const w of data.wallets) {
      await tx.insert(moneyWallets).values({
        id: w.id,
        name: w.name,
        icon: w.icon,
        includeInTotal: w.includeInTotal,
        createdAt: new Date(w.createdAt),
      })
    }
    for (const c of data.categories) {
      await tx.insert(moneyCategories).values({ id: c.id, name: c.name, icon: c.icon, color: c.color, type: c.type })
    }
    for (const d of data.debts) {
      await tx.insert(moneyDebts).values({
        id: d.id,
        name: d.name,
        direction: d.direction,
        principal: d.principal,
        dueDate: d.dueDate ?? null,
        note: d.note ?? null,
        closed: d.closed,
        createdAt: new Date(d.createdAt),
      })
    }
    await tx.insert(moneySettings).values({ id: SETTINGS_ID, cycleStartDay: data.settings.cycleStartDay })
    for (const t of data.transactions) {
      await tx.insert(moneyTransactions).values({
        id: t.id,
        walletId: t.walletId,
        categoryId: t.categoryId,
        type: t.type,
        amount: t.amount,
        note: t.note ?? null,
        date: t.date,
        debtId: t.debtId ?? null,
        createdAt: new Date(t.createdAt),
      })
    }
    for (const b of data.budgets) {
      await tx.insert(moneyBudgets).values({
        id: b.id,
        walletId: b.walletId,
        categoryId: b.categoryId,
        amount: b.amount,
        periodStart: b.periodStart,
        periodEnd: b.periodEnd,
        repeatMonthly: b.repeatMonthly,
      })
    }
  })
}

export async function getBackupRecordData(backupId: string): Promise<MoneyBackupData | null> {
  const [row] = await db.select().from(moneyBackups).where(eq(moneyBackups.id, backupId))
  return row ? (row.data as MoneyBackupData) : null
}
