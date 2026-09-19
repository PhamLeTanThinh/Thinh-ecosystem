import { NextRequest, NextResponse } from 'next/server'
import { and, eq, notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { chineseDecks } from '@/db/schema'
import { getLearnerId } from '@/lib/learner/identity'
import type { ChineseDeck } from '@/lib/chinese/types'

// Chỉ đọc/ghi bộ từ của ĐÚNG người học đang gọi (learnerId — xem lib/learner/identity.ts) — nhiều
// người cùng dùng app không còn thấy/xoá nhầm bộ từ của nhau.
export async function GET(req: NextRequest) {
  const learnerId = getLearnerId(req)
  if (!learnerId) return NextResponse.json([])
  const rows = await db.select().from(chineseDecks).where(eq(chineseDecks.learnerId, learnerId))
  const result: ChineseDeck[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    cardIds: r.cardIds,
    createdAt: r.createdAt.toISOString(),
  }))
  return NextResponse.json(result)
}

// Replaces the full deck list CỦA ĐÚNG NGƯỜI HỌC NÀY — mirrors lib/chinese/storage.ts's bulk save
// semantics, nhưng DELETE chỉ xoá trong phạm vi bộ từ của learnerId này (không đụng bộ từ người khác).
export async function PUT(req: NextRequest) {
  const learnerId = getLearnerId(req)
  if (!learnerId) return NextResponse.json({ error: 'no-profile' }, { status: 401 })
  const body: ChineseDeck[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = body.map((d) => d.id)
    if (ids.length > 0) {
      await tx.delete(chineseDecks).where(and(eq(chineseDecks.learnerId, learnerId), notInArray(chineseDecks.id, ids)))
    } else {
      await tx.delete(chineseDecks).where(eq(chineseDecks.learnerId, learnerId))
    }

    for (const d of body) {
      await tx
        .insert(chineseDecks)
        .values({ id: d.id, learnerId, name: d.name, cardIds: d.cardIds })
        .onConflictDoUpdate({
          target: chineseDecks.id,
          set: { name: d.name, cardIds: d.cardIds },
        })
    }
  })

  return NextResponse.json({ ok: true })
}
