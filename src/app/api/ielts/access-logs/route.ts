import { NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ieltsAccessLogs } from '@/db/schema'
import { requireOwnerApi } from '@/lib/ielts/access'
import { detectBrowser } from '@/lib/ielts/userAgent'

// Gom theo email — chủ chỉ cần biết "ai vào bao nhiêu lần, gần nhất bằng trình duyệt gì", không
// cần xem từng dòng log thô. Số lượng log của 1 app cá nhân nhỏ nên gom bằng JS cho đơn giản,
// không cần GROUP BY SQL.
export async function GET() {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const rows = await db.select().from(ieltsAccessLogs).orderBy(desc(ieltsAccessLogs.createdAt))

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
