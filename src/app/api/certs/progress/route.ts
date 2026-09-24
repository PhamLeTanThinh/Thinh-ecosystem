import { NextRequest, NextResponse } from 'next/server'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { certProgress } from '@/db/schema'
import { getLearnerId } from '@/lib/learner/identity'

// Tiến độ luyện đề chứng chỉ của ĐÚNG người học đang gọi (learnerId từ cookie hồ sơ — xem
// lib/learner/identity.ts). Chưa có hồ sơ thì GET trả rỗng, POST trả 401 để UI vẫn làm bài được nhưng
// không lưu.
const CERT_ID = /^[a-z0-9-]{1,20}$/

export async function GET(req: NextRequest) {
  const learnerId = getLearnerId(req)
  const cert = req.nextUrl.searchParams.get('cert') ?? ''
  if (!learnerId || !CERT_ID.test(cert)) return NextResponse.json([])
  const rows = await db
    .select()
    .from(certProgress)
    .where(and(eq(certProgress.learnerId, learnerId), eq(certProgress.certId, cert)))
  return NextResponse.json(
    rows.map((r) => ({
      id: r.questionId,
      correctCount: r.correctCount,
      wrongCount: r.wrongCount,
      lastResult: r.lastResult,
      lastReviewedAt: r.lastReviewedAt ? r.lastReviewedAt.toISOString() : null,
    })),
  )
}

// Ghi 1 lần trả lời: tăng bộ đếm đúng/sai và cập nhật kết quả gần nhất (upsert atomic).
export async function POST(req: NextRequest) {
  const learnerId = getLearnerId(req)
  if (!learnerId) return NextResponse.json({ error: 'no-profile' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const cert = typeof body?.cert === 'string' ? body.cert : ''
  const questionId = body?.questionId
  const correct = body?.correct
  if (!CERT_ID.test(cert) || !Number.isInteger(questionId) || typeof correct !== 'boolean') {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 })
  }
  const lastResult = correct ? 'correct' : 'wrong'
  const now = new Date()
  await db
    .insert(certProgress)
    .values({
      learnerId,
      certId: cert,
      questionId,
      correctCount: correct ? 1 : 0,
      wrongCount: correct ? 0 : 1,
      lastResult,
      lastReviewedAt: now,
    })
    .onConflictDoUpdate({
      target: [certProgress.learnerId, certProgress.certId, certProgress.questionId],
      set: {
        correctCount: correct ? sql`${certProgress.correctCount} + 1` : certProgress.correctCount,
        wrongCount: correct ? certProgress.wrongCount : sql`${certProgress.wrongCount} + 1`,
        lastResult,
        lastReviewedAt: now,
      },
    })
  return NextResponse.json({ ok: true })
}
