import { NextRequest, NextResponse } from 'next/server'
import { asc, notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { dailyTodos } from '@/db/schema'
import type { DailyTodo } from '@/lib/notes/types'

export async function GET() {
  const rows = await db.select().from(dailyTodos).orderBy(asc(dailyTodos.sortOrder))
  const todos: DailyTodo[] = rows.map((r) => ({ id: r.id, text: r.text, createdAt: r.createdAt.toISOString() }))
  return NextResponse.json(todos)
}

// Replaces the full list — array order is the sortOrder, same bulk-save convention as /api/notes.
export async function PUT(req: NextRequest) {
  const todos: DailyTodo[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = todos.map((t) => t.id)
    if (ids.length > 0) {
      await tx.delete(dailyTodos).where(notInArray(dailyTodos.id, ids))
    } else {
      await tx.delete(dailyTodos)
    }

    for (const [i, t] of todos.entries()) {
      await tx
        .insert(dailyTodos)
        .values({ id: t.id, text: t.text, sortOrder: i, createdAt: new Date(t.createdAt) })
        .onConflictDoUpdate({ target: dailyTodos.id, set: { text: t.text, sortOrder: i } })
    }
  })

  return NextResponse.json({ ok: true })
}
