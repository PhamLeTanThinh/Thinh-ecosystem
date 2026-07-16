import { NextRequest, NextResponse } from 'next/server'
import { notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { chineseDecks } from '@/db/schema'
import type { ChineseDeck } from '@/lib/chinese/types'

export async function GET() {
  const rows = await db.select().from(chineseDecks)
  const result: ChineseDeck[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    cardIds: r.cardIds,
    createdAt: r.createdAt.toISOString(),
  }))
  return NextResponse.json(result)
}

// Replaces the full deck list — mirrors lib/chinese/storage.ts's bulk save semantics.
export async function PUT(req: NextRequest) {
  const body: ChineseDeck[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = body.map((d) => d.id)
    if (ids.length > 0) {
      await tx.delete(chineseDecks).where(notInArray(chineseDecks.id, ids))
    } else {
      await tx.delete(chineseDecks)
    }

    for (const d of body) {
      await tx
        .insert(chineseDecks)
        .values({ id: d.id, name: d.name, cardIds: d.cardIds })
        .onConflictDoUpdate({
          target: chineseDecks.id,
          set: { name: d.name, cardIds: d.cardIds },
        })
    }
  })

  return NextResponse.json({ ok: true })
}
