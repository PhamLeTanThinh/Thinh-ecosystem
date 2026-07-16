import { NextRequest, NextResponse } from 'next/server'
import { notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { chineseCards } from '@/db/schema'
import type { ChineseCard } from '@/lib/chinese/types'

export async function GET() {
  const rows = await db.select().from(chineseCards)
  const result: ChineseCard[] = rows.map((r) => ({
    id: r.id,
    hanzi: r.hanzi,
    pinyin: r.pinyin,
    meaning: r.meaning,
    sortOrder: r.sortOrder,
    createdAt: r.createdAt.toISOString(),
  }))
  return NextResponse.json(result)
}

// Replaces the full card list — mirrors lib/chinese/storage.ts's bulk save semantics.
export async function PUT(req: NextRequest) {
  const body: ChineseCard[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = body.map((c) => c.id)
    if (ids.length > 0) {
      await tx.delete(chineseCards).where(notInArray(chineseCards.id, ids))
    } else {
      await tx.delete(chineseCards)
    }

    for (const c of body) {
      await tx
        .insert(chineseCards)
        .values({
          id: c.id,
          hanzi: c.hanzi,
          pinyin: c.pinyin,
          meaning: c.meaning,
          sortOrder: c.sortOrder,
        })
        .onConflictDoUpdate({
          target: chineseCards.id,
          set: {
            hanzi: c.hanzi,
            pinyin: c.pinyin,
            meaning: c.meaning,
            sortOrder: c.sortOrder,
          },
        })
    }
  })

  return NextResponse.json({ ok: true })
}
