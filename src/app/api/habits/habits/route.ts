import { NextRequest, NextResponse } from 'next/server'
import { notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { habits } from '@/db/schema'
import type { Habit, HabitCategory } from '@/lib/habits/types'

export async function GET() {
  const rows = await db.select().from(habits)
  const result: Habit[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    icon: r.icon,
    color: r.color,
    category: r.category as HabitCategory,
    sortOrder: r.sortOrder,
    archived: r.archived,
    createdAt: r.createdAt.toISOString(),
  }))
  return NextResponse.json(result)
}

// Replaces the full habit list — mirrors lib/habits/storage.ts's bulk save semantics.
export async function PUT(req: NextRequest) {
  const body: Habit[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = body.map((h) => h.id)
    if (ids.length > 0) {
      await tx.delete(habits).where(notInArray(habits.id, ids))
    } else {
      await tx.delete(habits)
    }

    for (const h of body) {
      await tx
        .insert(habits)
        .values({
          id: h.id,
          name: h.name,
          icon: h.icon,
          color: h.color,
          category: h.category,
          sortOrder: h.sortOrder,
          archived: h.archived,
        })
        .onConflictDoUpdate({
          target: habits.id,
          set: {
            name: h.name,
            icon: h.icon,
            color: h.color,
            category: h.category,
            sortOrder: h.sortOrder,
            archived: h.archived,
          },
        })
    }
  })

  return NextResponse.json({ ok: true })
}
