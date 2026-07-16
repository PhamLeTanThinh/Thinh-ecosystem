import { NextRequest, NextResponse } from 'next/server'
import { notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { chineseProgress } from '@/db/schema'
import type { ChineseProgress, ReviewResult } from '@/lib/chinese/types'

export async function GET() {
  const rows = await db.select().from(chineseProgress)
  const result: ChineseProgress[] = rows.map((r) => ({
    id: r.id,
    correctCount: r.correctCount,
    wrongCount: r.wrongCount,
    lastResult: r.lastResult as ReviewResult | null,
    lastReviewedAt: r.lastReviewedAt ? r.lastReviewedAt.toISOString() : null,
  }))
  return NextResponse.json(result)
}

// Replaces the full progress list — mirrors lib/chinese/storage.ts's bulk save semantics.
export async function PUT(req: NextRequest) {
  const body: ChineseProgress[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = body.map((p) => p.id)
    if (ids.length > 0) {
      await tx.delete(chineseProgress).where(notInArray(chineseProgress.id, ids))
    } else {
      await tx.delete(chineseProgress)
    }

    for (const p of body) {
      await tx
        .insert(chineseProgress)
        .values({
          id: p.id,
          correctCount: p.correctCount,
          wrongCount: p.wrongCount,
          lastResult: p.lastResult,
          lastReviewedAt: p.lastReviewedAt ? new Date(p.lastReviewedAt) : null,
        })
        .onConflictDoUpdate({
          target: chineseProgress.id,
          set: {
            correctCount: p.correctCount,
            wrongCount: p.wrongCount,
            lastResult: p.lastResult,
            lastReviewedAt: p.lastReviewedAt ? new Date(p.lastReviewedAt) : null,
          },
        })
    }
  })

  return NextResponse.json({ ok: true })
}
