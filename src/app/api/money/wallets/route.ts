import { NextRequest, NextResponse } from 'next/server'
import { notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { moneyWallets } from '@/db/schema'
import { createSnapshot } from '@/lib/money/backup'
import type { Wallet } from '@/lib/money/types'

export async function GET() {
  const rows = await db.select().from(moneyWallets)
  const wallets: Wallet[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    icon: r.icon,
    includeInTotal: r.includeInTotal,
    createdAt: r.createdAt.toISOString(),
  }))
  return NextResponse.json(wallets)
}

// Replaces the full wallet list — mirrors lib/money/storage.ts's bulk save semantics.
export async function PUT(req: NextRequest) {
  const wallets: Wallet[] = await req.json()

  await createSnapshot()

  await db.transaction(async (tx) => {
    const ids = wallets.map((w) => w.id)
    if (ids.length > 0) {
      await tx.delete(moneyWallets).where(notInArray(moneyWallets.id, ids))
    } else {
      await tx.delete(moneyWallets)
    }

    for (const w of wallets) {
      await tx
        .insert(moneyWallets)
        .values({
          id: w.id,
          name: w.name,
          icon: w.icon,
          includeInTotal: w.includeInTotal,
          createdAt: new Date(w.createdAt),
        })
        .onConflictDoUpdate({
          target: moneyWallets.id,
          set: { name: w.name, icon: w.icon, includeInTotal: w.includeInTotal },
        })
    }
  })

  return NextResponse.json({ ok: true })
}
