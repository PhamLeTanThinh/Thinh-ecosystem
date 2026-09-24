import { NextRequest, NextResponse } from 'next/server'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { certAttempts } from '@/db/schema'
import { getLearnerId } from '@/lib/learner/identity'

// Lịch sử các lần luyện của ĐÚNG người học đang gọi (cookie hồ sơ — xem lib/learner/identity.ts).
const CERT_ID = /^[a-z0-9-]{1,20}$/
const MODE = /^[a-z0-9]{1,20}$/
const MAX_LIST = 100

function toDto(r: typeof certAttempts.$inferSelect) {
  return { id: r.id, mode: r.mode, total: r.total, correct: r.correct, wrongIds: r.wrongIds, createdAt: r.createdAt.toISOString() }
}

export async function GET(req: NextRequest) {
  const learnerId = getLearnerId(req)
  const cert = req.nextUrl.searchParams.get('cert') ?? ''
  if (!learnerId || !CERT_ID.test(cert)) return NextResponse.json([])
  const rows = await db
    .select()
    .from(certAttempts)
    .where(and(eq(certAttempts.learnerId, learnerId), eq(certAttempts.certId, cert)))
    .orderBy(desc(certAttempts.createdAt))
    .limit(MAX_LIST)
  return NextResponse.json(rows.map(toDto))
}

export async function POST(req: NextRequest) {
  const learnerId = getLearnerId(req)
  if (!learnerId) return NextResponse.json({ error: 'no-profile' }, { status: 401 })
  const body = await req.json().catch(() => null)
  const { cert, mode, total, correct, wrongIds } = body ?? {}
  const validIds = Array.isArray(wrongIds) && wrongIds.length <= 1000 && wrongIds.every((n) => Number.isInteger(n))
  if (
    typeof cert !== 'string' || !CERT_ID.test(cert) ||
    typeof mode !== 'string' || !MODE.test(mode) ||
    !Number.isInteger(total) || total < 1 ||
    !Number.isInteger(correct) || correct < 0 || correct > total ||
    !validIds
  ) {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 })
  }
  const [row] = await db.insert(certAttempts).values({ learnerId, certId: cert, mode, total, correct, wrongIds }).returning()
  return NextResponse.json(toDto(row))
}
