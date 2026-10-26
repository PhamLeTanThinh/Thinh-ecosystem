import { NextRequest, NextResponse } from 'next/server'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { hubAccessLogs } from '@/db/schema'
import { isHubApp } from '@/lib/hub/apps'
import { requireHubOwnerApi } from '@/lib/hub/access'
import { detectBrowser } from '@/lib/ielts/userAgent'

// Gom theo email — song song với GET /api/ielts/access-logs.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ app: string }> }) {
  const { app } = await params
  if (!isHubApp(app)) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const forbidden = await requireHubOwnerApi(app)
  if (forbidden) return forbidden

  const rows = await db.select().from(hubAccessLogs).where(eq(hubAccessLogs.app, app)).orderBy(desc(hubAccessLogs.createdAt))

  const byEmail = new Map<string, { email: string; count: number; lastSeenAt: string; lastBrowser: string }>()
  for (const row of rows) {
    const existing = byEmail.get(row.email)
    if (existing) {
      existing.count += 1
    } else {
      byEmail.set(row.email, {
        email: row.email,
        count: 1,
        lastSeenAt: row.createdAt.toISOString(),
        lastBrowser: detectBrowser(row.userAgent),
      })
    }
  }

  return NextResponse.json(Array.from(byEmail.values()).sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt)))
}
