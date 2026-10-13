import { NextRequest, NextResponse } from 'next/server'
import { customAlphabet } from 'nanoid'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { tripFunds } from '@/db/schema'
import { toFund } from '@/lib/trips/rows'

// Bật / tắt / đổi link chia sẻ chỉ-xem của 1 quỹ (cột share_slug). Mã 12 ký tự chữ + số, không đoán được;
// đổi link = tạo mã mới → link cũ hết hiệu lực ngay.
const newSlug = customAlphabet('23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ', 12)

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as { fundId?: unknown; action?: unknown }
  if (typeof body.fundId !== 'string') return NextResponse.json({ error: 'Thiếu quỹ' }, { status: 400 })
  if (body.action !== 'enable' && body.action !== 'disable' && body.action !== 'regenerate')
    return NextResponse.json({ error: 'Thao tác không hợp lệ' }, { status: 400 })
  const [current] = await db.select({ shareSlug: tripFunds.shareSlug }).from(tripFunds).where(eq(tripFunds.id, body.fundId))
  if (!current) return NextResponse.json({ error: 'Không tìm thấy quỹ' }, { status: 404 })
  // Bật khi đã có link → giữ link cũ (bấm lại không làm hỏng link đã gửi đi)
  const shareSlug = body.action === 'disable' ? null : body.action === 'enable' && current.shareSlug ? current.shareSlug : newSlug()
  const [row] = await db.update(tripFunds).set({ shareSlug, updatedAt: new Date() }).where(eq(tripFunds.id, body.fundId)).returning()
  return NextResponse.json(toFund(row))
}
