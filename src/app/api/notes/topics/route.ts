import { NextRequest, NextResponse } from 'next/server'
import { asc, notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { noteTopics } from '@/db/schema'
import type { NoteTopic } from '@/lib/notes/types'

export async function GET() {
  const rows = await db.select().from(noteTopics).orderBy(asc(noteTopics.sortOrder))
  const topics: NoteTopic[] = rows.map((r) => ({ id: r.id, title: r.title, createdAt: r.createdAt.toISOString() }))
  return NextResponse.json(topics)
}

// Replaces the full list — array order is the sortOrder, same bulk-save convention as /api/notes.
export async function PUT(req: NextRequest) {
  const topics: NoteTopic[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = topics.map((t) => t.id)
    if (ids.length > 0) {
      await tx.delete(noteTopics).where(notInArray(noteTopics.id, ids))
    } else {
      await tx.delete(noteTopics)
    }

    for (const [i, t] of topics.entries()) {
      await tx
        .insert(noteTopics)
        .values({ id: t.id, title: t.title, sortOrder: i, createdAt: new Date(t.createdAt) })
        .onConflictDoUpdate({ target: noteTopics.id, set: { title: t.title, sortOrder: i } })
    }
  })

  return NextResponse.json({ ok: true })
}
