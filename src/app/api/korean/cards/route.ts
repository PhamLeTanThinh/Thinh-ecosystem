import { NextRequest, NextResponse } from 'next/server'
import { notInArray, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { koreanCards } from '@/db/schema'
import type { KoreanCard, KoreanCardKind } from '@/lib/korean/types'

// Bộ thẻ này seed sẵn ~650 thẻ (18 bài Notion) nên PUT ghi theo lô thay vì 1 upsert/thẻ
// (khác convention lib/chinese/storage.ts vốn chỉ có vài chục thẻ) — nếu không, lần hydrate
// đầu tiên phải chờ hàng trăm round-trip DB tuần tự.
const CHUNK_SIZE = 200

export async function GET() {
  const rows = await db.select().from(koreanCards)
  const result: KoreanCard[] = rows.map((r) => ({
    id: r.id,
    kind: r.kind as KoreanCardKind,
    lesson: r.lesson,
    front: r.front,
    meaning: r.meaning,
    note: r.note,
    example: r.example,
    sortOrder: r.sortOrder,
    createdAt: r.createdAt.toISOString(),
  }))
  return NextResponse.json(result)
}

// Replaces the full card list — mirrors lib/chinese/storage.ts's bulk save semantics.
export async function PUT(req: NextRequest) {
  const body: KoreanCard[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = body.map((c) => c.id)
    if (ids.length > 0) {
      await tx.delete(koreanCards).where(notInArray(koreanCards.id, ids))
    } else {
      await tx.delete(koreanCards)
    }

    for (let i = 0; i < body.length; i += CHUNK_SIZE) {
      const chunk = body.slice(i, i + CHUNK_SIZE)
      await tx
        .insert(koreanCards)
        .values(
          chunk.map((c) => ({
            id: c.id,
            kind: c.kind,
            lesson: c.lesson,
            front: c.front,
            meaning: c.meaning,
            note: c.note,
            example: c.example,
            sortOrder: c.sortOrder,
          }))
        )
        .onConflictDoUpdate({
          target: koreanCards.id,
          set: {
            kind: sql`excluded.kind`,
            lesson: sql`excluded.lesson`,
            front: sql`excluded.front`,
            meaning: sql`excluded.meaning`,
            note: sql`excluded.note`,
            example: sql`excluded.example`,
            sortOrder: sql`excluded.sort_order`,
          },
        })
    }
  })

  return NextResponse.json({ ok: true })
}
