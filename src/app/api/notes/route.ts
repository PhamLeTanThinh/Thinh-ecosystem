import { NextRequest, NextResponse } from 'next/server'
import { notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { stickyNotes } from '@/db/schema'
import type { StickyNote } from '@/lib/notes/types'

export async function GET() {
  const rows = await db.select().from(stickyNotes)
  const notes: StickyNote[] = rows.map((r) => ({
    id: r.id,
    date: r.date,
    x: r.x,
    y: r.y,
    width: r.width ?? null,
    height: r.height ?? null,
    content: r.content,
    color: (r.color as StickyNote['color']) ?? null,
    tags: r.tags,
    createdAt: r.createdAt.toISOString(),
  }))
  return NextResponse.json(notes)
}

// Replaces the full note list — mirrors lib/habits/storage.ts's bulk save semantics.
export async function PUT(req: NextRequest) {
  const notes: StickyNote[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = notes.map((n) => n.id)
    if (ids.length > 0) {
      await tx.delete(stickyNotes).where(notInArray(stickyNotes.id, ids))
    } else {
      await tx.delete(stickyNotes)
    }

    for (const n of notes) {
      await tx
        .insert(stickyNotes)
        .values({
          id: n.id,
          date: n.date,
          x: n.x,
          y: n.y,
          width: n.width,
          height: n.height,
          content: n.content,
          color: n.color,
          tags: n.tags,
          createdAt: new Date(n.createdAt),
        })
        .onConflictDoUpdate({
          target: stickyNotes.id,
          set: {
            date: n.date,
            x: n.x,
            y: n.y,
            width: n.width,
            height: n.height,
            content: n.content,
            color: n.color,
            tags: n.tags,
          },
        })
    }
  })

  return NextResponse.json({ ok: true })
}
