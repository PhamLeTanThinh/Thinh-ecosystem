import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { koreanSettings } from '@/db/schema'
import { getLearnerId } from '@/lib/learner/identity'
import type { KoreanSettings, QuizMode } from '@/lib/korean/types'

const DEFAULT_SETTINGS: KoreanSettings = { shuffle: true, quizMode: 'front-to-meaning' }

// 1 dòng/người học (learnerId từ cookie hồ sơ — xem lib/learner/identity.ts), thay vì 1 dòng
// chung cho cả app như trước.
export async function GET(req: NextRequest) {
  const learnerId = getLearnerId(req)
  if (!learnerId) return NextResponse.json(DEFAULT_SETTINGS)
  const [row] = await db.select().from(koreanSettings).where(eq(koreanSettings.learnerId, learnerId))
  const settings: KoreanSettings = row ? { shuffle: row.shuffle, quizMode: row.quizMode as QuizMode } : DEFAULT_SETTINGS
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const learnerId = getLearnerId(req)
  if (!learnerId) return NextResponse.json({ error: 'no-profile' }, { status: 401 })
  const settings: KoreanSettings = await req.json()

  await db
    .insert(koreanSettings)
    .values({ learnerId, shuffle: settings.shuffle, quizMode: settings.quizMode })
    .onConflictDoUpdate({
      target: koreanSettings.learnerId,
      set: { shuffle: settings.shuffle, quizMode: settings.quizMode },
    })

  return NextResponse.json({ ok: true })
}
