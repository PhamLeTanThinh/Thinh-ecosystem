import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { chineseSettings } from '@/db/schema'
import type { ChineseSettings, PinyinPosition, QuizMode } from '@/lib/chinese/types'

const SETTINGS_ID = 'default'
const DEFAULT_SETTINGS: ChineseSettings = { pinyinPosition: 'hanzi', shuffle: true, quizMode: 'hanzi-to-meaning' }

export async function GET() {
  const [row] = await db.select().from(chineseSettings).where(eq(chineseSettings.id, SETTINGS_ID))
  const settings: ChineseSettings = row
    ? { pinyinPosition: row.pinyinPosition as PinyinPosition, shuffle: row.shuffle, quizMode: row.quizMode as QuizMode }
    : DEFAULT_SETTINGS
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const settings: ChineseSettings = await req.json()

  await db
    .insert(chineseSettings)
    .values({
      id: SETTINGS_ID,
      pinyinPosition: settings.pinyinPosition,
      shuffle: settings.shuffle,
      quizMode: settings.quizMode,
    })
    .onConflictDoUpdate({
      target: chineseSettings.id,
      set: { pinyinPosition: settings.pinyinPosition, shuffle: settings.shuffle, quizMode: settings.quizMode },
    })

  return NextResponse.json({ ok: true })
}
