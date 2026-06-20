import { NextRequest, NextResponse } from 'next/server'
import { notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { moneyDebts } from '@/db/schema'
import type { Debt } from '@/lib/money/types'

export async function GET() {
  const rows = await db.select().from(moneyDebts)
  const debts: Debt[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    direction: r.direction as Debt['direction'],
    principal: r.principal,
    dueDate: r.dueDate ?? undefined,
    note: r.note ?? undefined,
    closed: r.closed,
    createdAt: r.createdAt.toISOString(),
  }))
  return NextResponse.json(debts)
}

// Replaces the full debt list — mirrors lib/money/storage.ts's bulk save semantics.
export async function PUT(req: NextRequest) {
  const debts: Debt[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = debts.map((d) => d.id)
    if (ids.length > 0) {
      await tx.delete(moneyDebts).where(notInArray(moneyDebts.id, ids))
    } else {
      await tx.delete(moneyDebts)
    }

    for (const d of debts) {
      await tx
        .insert(moneyDebts)
        .values({
          id: d.id,
          name: d.name,
          direction: d.direction,
          principal: d.principal,
          dueDate: d.dueDate ?? null,
          note: d.note ?? null,
          closed: d.closed,
          createdAt: new Date(d.createdAt),
        })
        .onConflictDoUpdate({
          target: moneyDebts.id,
          set: {
            name: d.name,
            direction: d.direction,
            principal: d.principal,
            dueDate: d.dueDate ?? null,
            note: d.note ?? null,
            closed: d.closed,
          },
        })
    }
  })

  return NextResponse.json({ ok: true })
}
