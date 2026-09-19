import { NextRequest, NextResponse } from 'next/server'
import { notInArray, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { chineseCards } from '@/db/schema'
import type { ChineseCard, ChineseCardKind } from '@/lib/chinese/types'

export async function GET() {
  const rows = await db.select().from(chineseCards)
  const result: ChineseCard[] = rows.map((r) => ({
    id: r.id,
    kind: r.kind as ChineseCardKind,
    lesson: r.lesson,
    hanzi: r.hanzi,
    pinyin: r.pinyin,
    meaning: r.meaning,
    note: r.note,
    example: r.example,
    theory: r.theory,
    exampleDetail: r.exampleDetail,
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
          kind: c.kind,
          lesson: c.lesson,
          hanzi: c.hanzi,
          pinyin: c.pinyin,
          meaning: c.meaning,
          note: c.note,
          example: c.example,
          theory: c.theory,
          exampleDetail: c.exampleDetail,
          sortOrder: c.sortOrder,
        })
        .onConflictDoUpdate({
          target: chineseCards.id,
          set: {
            kind: sql`excluded.kind`,
            lesson: sql`excluded.lesson`,
            hanzi: sql`excluded.hanzi`,
            pinyin: sql`excluded.pinyin`,
            meaning: sql`excluded.meaning`,
            note: sql`excluded.note`,
            example: sql`excluded.example`,
            theory: sql`excluded.theory`,
            exampleDetail: sql`excluded.example_detail`,
            sortOrder: sql`excluded.sort_order`,
          },
        })
    }
  })

  return NextResponse.json({ ok: true })
}
