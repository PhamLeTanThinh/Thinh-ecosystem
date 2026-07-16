import { NextRequest, NextResponse } from 'next/server'
import { notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { wellnessLogs } from '@/db/schema'
import type { WellnessLog } from '@/lib/habits/types'

export async function GET() {
  const rows = await db.select().from(wellnessLogs)
  const result: WellnessLog[] = rows.map((r) => ({ id: r.id, date: r.date, mood: r.mood, sleepHours: r.sleepHours }))
  return NextResponse.json(result)
}

// Replaces the full wellness log list — mirrors lib/habits/storage.ts's bulk save semantics.
export async function PUT(req: NextRequest) {
  const body: WellnessLog[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = body.map((w) => w.id)
    if (ids.length > 0) {
      await tx.delete(wellnessLogs).where(notInArray(wellnessLogs.id, ids))
    } else {
      await tx.delete(wellnessLogs)
    }

    for (const w of body) {
      await tx
        .insert(wellnessLogs)
        .values({ id: w.id, date: w.date, mood: w.mood, sleepHours: w.sleepHours })
        .onConflictDoUpdate({ target: wellnessLogs.id, set: { date: w.date, mood: w.mood, sleepHours: w.sleepHours } })
    }
  })

  return NextResponse.json({ ok: true })
}
