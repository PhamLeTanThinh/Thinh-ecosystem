import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { chineseSettings } from '@/db/schema'
import { getLearnerId } from '@/lib/learner/identity'
import type { ChineseSettings, PinyinPosition, QuizMode } from '@/lib/chinese/types'

const DEFAULT_SETTINGS: ChineseSettings = { pinyinPosition: 'hanzi', shuffle: true, quizMode: 'hanzi-to-meaning' }

// 1 dòng/người học (learnerId từ cookie hồ sơ — xem lib/learner/identity.ts), thay vì 1 dòng
// chung cho cả app như trước.
export async function GET(req: NextRequest) {
  const learnerId = getLearnerId(req)
  if (!learnerId) return NextResponse.json(DEFAULT_SETTINGS)
  const [row] = await db.select().from(chineseSettings).where(eq(chineseSettings.learnerId, learnerId))
  const settings: ChineseSettings = row
    ? { pinyinPosition: row.pinyinPosition as PinyinPosition, shuffle: row.shuffle, quizMode: row.quizMode as QuizMode }
    : DEFAULT_SETTINGS
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const learnerId = getLearnerId(req)
  if (!learnerId) return NextResponse.json({ error: 'no-profile' }, { status: 401 })
  const settings: ChineseSettings = await req.json()

  await db
    .insert(chineseSettings)
    .values({
      learnerId,
      pinyinPosition: settings.pinyinPosition,
      shuffle: settings.shuffle,
      quizMode: settings.quizMode,
    })
    .onConflictDoUpdate({
      target: chineseSettings.learnerId,
      set: { pinyinPosition: settings.pinyinPosition, shuffle: settings.shuffle, quizMode: settings.quizMode },
    })

  return NextResponse.json({ ok: true })
}
