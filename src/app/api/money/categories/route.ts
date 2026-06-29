import { NextRequest, NextResponse } from 'next/server'
import { notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { moneyCategories } from '@/db/schema'
import { createSnapshot } from '@/lib/money/backup'
import type { Category } from '@/lib/money/types'

export async function GET() {
  const rows = await db.select().from(moneyCategories)
  const categories: Category[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    icon: r.icon,
    color: r.color,
    type: r.type as Category['type'],
  }))
  return NextResponse.json(categories)
}

// Replaces the full category list — mirrors lib/money/storage.ts's bulk save semantics.
export async function PUT(req: NextRequest) {
  const categories: Category[] = await req.json()

  await createSnapshot()

  await db.transaction(async (tx) => {
    const ids = categories.map((c) => c.id)
    if (ids.length > 0) {
      await tx.delete(moneyCategories).where(notInArray(moneyCategories.id, ids))
    } else {
      await tx.delete(moneyCategories)
    }

    for (const c of categories) {
      await tx
        .insert(moneyCategories)
        .values({ id: c.id, name: c.name, icon: c.icon, color: c.color, type: c.type })
        .onConflictDoUpdate({
          target: moneyCategories.id,
          set: { name: c.name, icon: c.icon, color: c.color, type: c.type },
        })
    }
  })

  return NextResponse.json({ ok: true })
}
