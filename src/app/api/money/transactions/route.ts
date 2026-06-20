import { NextRequest, NextResponse } from 'next/server'
import { notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { moneyTransactions } from '@/db/schema'
import type { Transaction } from '@/lib/money/types'

export async function GET() {
  const rows = await db.select().from(moneyTransactions)
  const transactions: Transaction[] = rows.map((r) => ({
    id: r.id,
    walletId: r.walletId,
    categoryId: r.categoryId,
    type: r.type as Transaction['type'],
    amount: r.amount,
    note: r.note ?? undefined,
    date: r.date,
    debtId: r.debtId ?? undefined,
    createdAt: r.createdAt.toISOString(),
  }))
  return NextResponse.json(transactions)
}

// Replaces the full transaction list — mirrors lib/money/storage.ts's bulk save semantics.
export async function PUT(req: NextRequest) {
  const transactions: Transaction[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = transactions.map((t) => t.id)
    if (ids.length > 0) {
      await tx.delete(moneyTransactions).where(notInArray(moneyTransactions.id, ids))
    } else {
      await tx.delete(moneyTransactions)
    }

    for (const t of transactions) {
      await tx
        .insert(moneyTransactions)
        .values({
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
        .onConflictDoUpdate({
          target: moneyTransactions.id,
          set: {
            walletId: t.walletId,
            categoryId: t.categoryId,
            type: t.type,
            amount: t.amount,
            note: t.note ?? null,
            date: t.date,
            debtId: t.debtId ?? null,
          },
        })
    }
  })

  return NextResponse.json({ ok: true })
}
