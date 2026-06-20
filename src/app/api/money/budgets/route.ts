import { NextRequest, NextResponse } from 'next/server'
import { notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { moneyBudgets } from '@/db/schema'
import type { Budget } from '@/lib/money/types'

export async function GET() {
  const rows = await db.select().from(moneyBudgets)
  const budgets: Budget[] = rows.map((r) => ({
    id: r.id,
    walletId: r.walletId,
    categoryId: r.categoryId,
    amount: r.amount,
    periodStart: r.periodStart,
    periodEnd: r.periodEnd,
    repeatMonthly: r.repeatMonthly,
  }))
  return NextResponse.json(budgets)
}

// Replaces the full budget list — mirrors lib/money/storage.ts's bulk save semantics.
export async function PUT(req: NextRequest) {
  const budgets: Budget[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = budgets.map((b) => b.id)
    if (ids.length > 0) {
      await tx.delete(moneyBudgets).where(notInArray(moneyBudgets.id, ids))
    } else {
      await tx.delete(moneyBudgets)
    }

    for (const b of budgets) {
      await tx
        .insert(moneyBudgets)
        .values({
          id: b.id,
          walletId: b.walletId,
          categoryId: b.categoryId,
          amount: b.amount,
          periodStart: b.periodStart,
          periodEnd: b.periodEnd,
          repeatMonthly: b.repeatMonthly,
        })
        .onConflictDoUpdate({
          target: moneyBudgets.id,
          set: {
            walletId: b.walletId,
            categoryId: b.categoryId,
            amount: b.amount,
            periodStart: b.periodStart,
            periodEnd: b.periodEnd,
            repeatMonthly: b.repeatMonthly,
          },
        })
    }
  })

  return NextResponse.json({ ok: true })
}
