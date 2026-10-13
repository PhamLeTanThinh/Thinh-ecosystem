import { NextRequest, NextResponse } from 'next/server'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { tripEntries, tripFunds, tripMembers, tripRounds } from '@/db/schema'
import { toEntry, toFund, toMember, toRound } from '@/lib/trips/rows'

// Dữ liệu cho trang xem qua link chia sẻ (/trips/share/[slug]) — chỉ đọc. Chỉ trả những gì cần để xem: bỏ mã chia sẻ,
// liên hệ (SĐT / số tài khoản) và ghi chú riêng của thành viên.
export async function GET(_req: NextRequest, ctx: RouteContext<'/api/trips/share/[slug]'>) {
  const { slug } = await ctx.params
  if (!/^[A-Za-z0-9]{6,32}$/.test(slug)) return NextResponse.json({ error: 'Link không hợp lệ' }, { status: 404 })
  const [fund] = await db.select().from(tripFunds).where(eq(tripFunds.shareSlug, slug))
  if (!fund) return NextResponse.json({ error: 'Link không tồn tại hoặc đã bị tắt' }, { status: 404 })
  const [members, rounds, entries] = await Promise.all([
    db.select().from(tripMembers).where(eq(tripMembers.fundId, fund.id)).orderBy(asc(tripMembers.sortOrder), asc(tripMembers.createdAt)),
    db.select().from(tripRounds).where(eq(tripRounds.fundId, fund.id)).orderBy(asc(tripRounds.sortOrder), asc(tripRounds.createdAt)),
    db.select().from(tripEntries).where(eq(tripEntries.fundId, fund.id)).orderBy(asc(tripEntries.date), asc(tripEntries.createdAt)),
  ])
  return NextResponse.json(
    {
      fund: { ...toFund(fund), shareSlug: null },
      members: members.map((m) => ({ ...toMember(m), contact: '', note: '' })),
      rounds: rounds.map(toRound),
      entries: entries.map(toEntry),
    },
    { headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } },
  )
}
