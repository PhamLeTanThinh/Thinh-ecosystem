import { NextRequest, NextResponse } from 'next/server'
import { and, eq, notInArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { chineseProgress } from '@/db/schema'
import { getLearnerId } from '@/lib/learner/identity'
import type { ChineseProgress, ReviewResult } from '@/lib/chinese/types'

// Chỉ đọc/ghi tiến độ của ĐÚNG người học đang gọi (learnerId từ cookie ẩn danh — xem
// lib/learner/identity.ts), không phải toàn bộ bảng như trước — nhiều người cùng học không còn
// đụng tiến độ của nhau nữa (thẻ vẫn dùng chung, chỉ tiến độ là riêng).
export async function GET(req: NextRequest) {
  const learnerId = getLearnerId(req)
  if (!learnerId) return NextResponse.json([])
  const rows = await db.select().from(chineseProgress).where(eq(chineseProgress.learnerId, learnerId))
  const result: ChineseProgress[] = rows.map((r) => ({
    id: r.id,
    correctCount: r.correctCount,
    wrongCount: r.wrongCount,
    lastResult: r.lastResult as ReviewResult | null,
    lastReviewedAt: r.lastReviewedAt ? r.lastReviewedAt.toISOString() : null,
  }))
  return NextResponse.json(result)
}

// Replaces the full progress list CỦA ĐÚNG NGƯỜI HỌC NÀY — mirrors lib/chinese/storage.ts's bulk
// save semantics, nhưng cả DELETE lẫn INSERT đều lọc theo learnerId nên không xoá/ghi đè dữ liệu của
// người học khác.
export async function PUT(req: NextRequest) {
  const learnerId = getLearnerId(req)
  if (!learnerId) return NextResponse.json({ error: 'no-profile' }, { status: 401 })
  const body: ChineseProgress[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = body.map((p) => p.id)
    if (ids.length > 0) {
      await tx.delete(chineseProgress).where(and(eq(chineseProgress.learnerId, learnerId), notInArray(chineseProgress.id, ids)))
    } else {
      await tx.delete(chineseProgress).where(eq(chineseProgress.learnerId, learnerId))
    }

    for (const p of body) {
      await tx
        .insert(chineseProgress)
        .values({
          learnerId,
          id: p.id,
          correctCount: p.correctCount,
          wrongCount: p.wrongCount,
          lastResult: p.lastResult,
          lastReviewedAt: p.lastReviewedAt ? new Date(p.lastReviewedAt) : null,
        })
        .onConflictDoUpdate({
          target: [chineseProgress.learnerId, chineseProgress.id],
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
