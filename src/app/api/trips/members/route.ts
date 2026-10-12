import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { tripEntries, tripFunds, tripMembers, tripRounds } from '@/db/schema'
import { isISODate, type FundMember } from '@/lib/trips/types'
import { toMember } from '@/lib/trips/rows'

// Thành viên của 1 quỹ: thêm giữa chừng, đổi tên, cho rời / quay lại (left_at), xoá hẳn nếu chưa dính khoản nào.

type MemberFields = Partial<Pick<FundMember, 'name' | 'note' | 'contact' | 'color' | 'joinedAt' | 'leftAt' | 'sortOrder'>>

function readFields(body: Record<string, unknown>, partial: boolean): MemberFields | string {
  const out: MemberFields = {}
  if ('name' in body || !partial) {
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (!name) return 'Thiếu tên'
    if (name.length > 60) return 'Tên tối đa 60 ký tự'
    out.name = name
  }
  for (const key of ['note', 'contact'] as const) {
    if (key in body) {
      const v = typeof body[key] === 'string' ? (body[key] as string).trim() : ''
      if (v.length > 500) return 'Tối đa 500 ký tự'
      out[key] = v
    }
  }
  if ('color' in body) out.color = typeof body.color === 'string' && /^#[0-9a-f]{3,8}$/i.test(body.color) ? body.color : null
  for (const key of ['joinedAt', 'leftAt'] as const) {
    if (key in body) {
      const v = body[key]
      if (v !== null && !isISODate(v)) return 'Ngày không hợp lệ'
      out[key] = v as string | null
    }
  }
  if (out.joinedAt && out.leftAt && out.leftAt < out.joinedAt) return 'Ngày rời phải sau ngày vào'
  if ('sortOrder' in body) out.sortOrder = Number.isInteger(body.sortOrder) ? (body.sortOrder as number) : 0
  return out
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Record<string, unknown>
  if (typeof body.id !== 'string' || !body.id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  if (typeof body.fundId !== 'string') return NextResponse.json({ error: 'Thiếu quỹ' }, { status: 400 })
  const fields = readFields(body, false)
  if (typeof fields === 'string') return NextResponse.json({ error: fields }, { status: 400 })
  const [fund] = await db.select({ id: tripFunds.id }).from(tripFunds).where(eq(tripFunds.id, body.fundId))
  if (!fund) return NextResponse.json({ error: 'Không tìm thấy quỹ' }, { status: 404 })
  const [row] = await db
    .insert(tripMembers)
    .values({ ...fields, id: body.id, fundId: body.fundId, name: fields.name! })
    .returning()
  return NextResponse.json(toMember(row))
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as Record<string, unknown>
  if (typeof body.id !== 'string') return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  const fields = readFields(body, true)
  if (typeof fields === 'string') return NextResponse.json({ error: fields }, { status: 400 })
  const [row] = await db
    .update(tripMembers)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(tripMembers.id, body.id))
    .returning()
  if (!row) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
  return NextResponse.json(toMember(row))
}

// Chỉ xoá hẳn được khi chưa có khoản nào nhắc tới người này — có rồi thì client chuyển sang "cho rời quỹ"
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  const [member] = await db.select().from(tripMembers).where(eq(tripMembers.id, id))
  if (!member) return NextResponse.json({ ok: true })
  const entries = await db
    .select({ memberId: tripEntries.memberId, toMemberId: tripEntries.toMemberId, splits: tripEntries.splits })
    .from(tripEntries)
    .where(eq(tripEntries.fundId, member.fundId))
  const used = entries.some(
    (e) => e.memberId === id || e.toMemberId === id || (Array.isArray(e.splits) && (e.splits as { memberId: string }[]).some((s) => s.memberId === id)),
  )
  if (used) return NextResponse.json({ error: 'Người này đã có khoản thu chi — chỉ cho rời quỹ được' }, { status: 409 })
  await db.transaction(async (tx) => {
    await tx.delete(tripMembers).where(eq(tripMembers.id, id))
    await tx.update(tripFunds).set({ treasurerId: null }).where(eq(tripFunds.treasurerId, id))
    // Bỏ khỏi danh sách tham gia các đợt của quỹ
    const rounds = await tx.select().from(tripRounds).where(eq(tripRounds.fundId, member.fundId))
    for (const r of rounds) {
      const ids = (r.memberIds as string[]) ?? []
      if (ids.includes(id)) await tx.update(tripRounds).set({ memberIds: ids.filter((x) => x !== id) }).where(eq(tripRounds.id, r.id))
    }
  })
  return NextResponse.json({ ok: true })
}
