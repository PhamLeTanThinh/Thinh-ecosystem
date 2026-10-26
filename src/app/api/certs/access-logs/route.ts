import { NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { certAccessLogs } from '@/db/schema'
import { requireOwnerApi } from '@/lib/certs/access'
import { detectBrowser } from '@/lib/ielts/userAgent'
import { emailSubject } from '@/lib/certs/visibility'
import { getCertViewStats } from '@/lib/certs/views'
import type { CertViewStat } from '@/lib/certs/viewTypes'

// Gom theo email — song song với GET /api/ielts/access-logs. Số lượng log của 1 app cá nhân nhỏ nên gom
// bằng JS cho đơn giản, không cần GROUP BY SQL.
export async function GET() {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const [rows, viewStats] = await Promise.all([db.select().from(certAccessLogs).orderBy(desc(certAccessLogs.createdAt)), getCertViewStats()])

  // certViews = cert nào người này đã mở (lib/certs/views.ts) — lượt vào ở trên chỉ đếm lần mở app Certs.
  const byEmail = new Map<string, { email: string; count: number; lastSeenAt: string; lastBrowser: string; certViews: CertViewStat[] }>()
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
        certViews: viewStats.get(emailSubject(row.email)) ?? [],
      })
    }
  }

  return NextResponse.json(Array.from(byEmail.values()).sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt)))
}
