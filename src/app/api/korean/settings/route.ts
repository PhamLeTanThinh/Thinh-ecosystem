import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { koreanSettings } from '@/db/schema'
import type { KoreanSettings, QuizMode } from '@/lib/korean/types'

const SETTINGS_ID = 'default'
const DEFAULT_SETTINGS: KoreanSettings = { shuffle: true, quizMode: 'front-to-meaning' }

export async function GET() {
  const [row] = await db.select().from(koreanSettings).where(eq(koreanSettings.id, SETTINGS_ID))
  const settings: KoreanSettings = row
    ? { shuffle: row.shuffle, quizMode: row.quizMode as QuizMode }
    : DEFAULT_SETTINGS
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const settings: KoreanSettings = await req.json()

  await db
    .insert(koreanSettings)
    .values({ id: SETTINGS_ID, shuffle: settings.shuffle, quizMode: settings.quizMode })
    .onConflictDoUpdate({
      target: koreanSettings.id,
      set: { shuffle: settings.shuffle, quizMode: settings.quizMode },
    })

  return NextResponse.json({ ok: true })
}
