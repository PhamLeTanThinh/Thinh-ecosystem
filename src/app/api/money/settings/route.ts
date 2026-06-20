import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { moneySettings } from '@/db/schema'
import type { Settings } from '@/lib/money/types'

const SETTINGS_ID = 'default'
const DEFAULT_SETTINGS: Settings = { cycleStartDay: 19 }

export async function GET() {
  const [row] = await db.select().from(moneySettings).where(eq(moneySettings.id, SETTINGS_ID))
  const settings: Settings = row ? { cycleStartDay: row.cycleStartDay } : DEFAULT_SETTINGS
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const settings: Settings = await req.json()

  await db
    .insert(moneySettings)
    .values({ id: SETTINGS_ID, cycleStartDay: settings.cycleStartDay })
    .onConflictDoUpdate({
      target: moneySettings.id,
      set: { cycleStartDay: settings.cycleStartDay },
    })

  return NextResponse.json({ ok: true })
}
