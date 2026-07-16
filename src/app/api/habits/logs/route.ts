import { NextRequest, NextResponse } from 'next/server'
import { notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { habitLogs } from '@/db/schema'
import type { HabitLog } from '@/lib/habits/types'

export async function GET() {
  const rows = await db.select().from(habitLogs)
  const result: HabitLog[] = rows.map((r) => ({ id: r.id, habitId: r.habitId, date: r.date }))
  return NextResponse.json(result)
}

// Replaces the full log list — mirrors lib/habits/storage.ts's bulk save semantics.
export async function PUT(req: NextRequest) {
  const body: HabitLog[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = body.map((l) => l.id)
    if (ids.length > 0) {
      await tx.delete(habitLogs).where(notInArray(habitLogs.id, ids))
    } else {
      await tx.delete(habitLogs)
    }

    for (const l of body) {
      await tx
        .insert(habitLogs)
        .values({ id: l.id, habitId: l.habitId, date: l.date })
        .onConflictDoUpdate({ target: habitLogs.id, set: { habitId: l.habitId, date: l.date } })
    }
  })

  return NextResponse.json({ ok: true })
}
