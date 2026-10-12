import { NextRequest, NextResponse } from 'next/server'
import { and, eq, isNull, max } from 'drizzle-orm'
import { db } from '@/lib/db'
import { tripEntries, tripFunds, tripMembers, tripRounds } from '@/db/schema'
import { isISODate, type FundRound } from '@/lib/trips/types'
import { toMember, toRound } from '@/lib/trips/rows'

// Đợt của quỹ dùng nhiều lần (/trips/[id]). Tạo đợt mới có thể kèm tên thành viên mới (`newMembers`) — họ được thêm
// vào quỹ rồi vào luôn danh sách tham gia của đợt.

type RoundFields = Partial<Pick<FundRound, 'name' | 'note' | 'startDate' | 'endDate' | 'target' | 'perMemberTarget' | 'memberIds' | 'closed'>>

function readFields(body: Record<string, unknown>, partial: boolean, memberIds: Set<string>): RoundFields | string {
  const out: RoundFields = {}
  if ('name' in body || !partial) {
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (!name) return 'Thiếu tên đợt'
    if (name.length > 80) return 'Tên đợt tối đa 80 ký tự'
    out.name = name
  }
  if ('note' in body) {
    const note = typeof body.note === 'string' ? body.note.trim() : ''
    if (note.length > 1000) return 'Ghi chú tối đa 1000 ký tự'
    out.note = note
  }
  for (const key of ['startDate', 'endDate'] as const) {
    if (key in body) {
      const v = body[key]
      if (v !== null && v !== '' && !isISODate(v)) return 'Ngày không hợp lệ'
      out[key] = v ? (v as string) : null
    }
  }
  if (out.startDate && out.endDate && out.endDate < out.startDate) return 'Ngày kết thúc phải sau ngày bắt đầu'
  for (const key of ['target', 'perMemberTarget'] as const) {
    if (key in body) {
      const v = Number(body[key] ?? 0)
      if (!Number.isInteger(v) || v < 0) return 'Số tiền không hợp lệ'
      out[key] = v
    }
  }
  if ('memberIds' in body) {
    if (!Array.isArray(body.memberIds)) return 'Danh sách người tham gia không hợp lệ'
    const ids = [...new Set(body.memberIds.filter((x): x is string => typeof x === 'string'))]
    if (ids.some((id) => !memberIds.has(id))) return 'Thành viên không thuộc quỹ này'
    out.memberIds = ids
  }
  if ('closed' in body) out.closed = body.closed === true
  return out
}

async function memberIdsOf(fundId: string) {
  const rows = await db.select({ id: tripMembers.id }).from(tripMembers).where(eq(tripMembers.fundId, fundId))
  return new Set(rows.map((r) => r.id))
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Record<string, unknown>
  if (typeof body.id !== 'string' || !body.id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  if (typeof body.fundId !== 'string') return NextResponse.json({ error: 'Thiếu quỹ' }, { status: 400 })
  const fundId = body.fundId
  const [fund] = await db.select({ id: tripFunds.id }).from(tripFunds).where(eq(tripFunds.id, fundId))
  if (!fund) return NextResponse.json({ error: 'Không tìm thấy quỹ' }, { status: 404 })

  const newMembers = (Array.isArray(body.newMembers) ? (body.newMembers as { id?: unknown; name?: unknown }[]) : [])
    .map((m) => ({ id: typeof m?.id === 'string' && m.id ? m.id : crypto.randomUUID(), name: typeof m?.name === 'string' ? m.name.trim() : '' }))
    .filter((m) => m.name && m.name.length <= 60)
  const existing = await memberIdsOf(fundId)
  const fields = readFields(
    { ...body, memberIds: [...(Array.isArray(body.memberIds) ? body.memberIds : []), ...newMembers.map((m) => m.id)] },
    false,
    new Set([...existing, ...newMembers.map((m) => m.id)]),
  )
  if (typeof fields === 'string') return NextResponse.json({ error: fields }, { status: 400 })

  const result = await db.transaction(async (tx) => {
    const memberRows = newMembers.length
      ? await tx
          .insert(tripMembers)
          .values(newMembers.map((m, i) => ({ ...m, fundId, sortOrder: existing.size + i })))
          .returning()
      : []
    const [{ last }] = await tx.select({ last: max(tripRounds.sortOrder) }).from(tripRounds).where(eq(tripRounds.fundId, fundId))
    const [round] = await tx
      .insert(tripRounds)
      .values({ ...fields, id: body.id as string, fundId, name: fields.name!, sortOrder: (last ?? -1) + 1 })
      .returning()
    // Quỹ cũ chưa chia đợt: khoản chưa thuộc đợt nào gom vào đợt được chỉ định (`adoptOrphans`)
    if (body.adoptOrphans === true) {
      await tx
        .update(tripEntries)
        .set({ roundId: round.id })
        .where(and(eq(tripEntries.fundId, fundId), isNull(tripEntries.roundId)))
    }
    return { round: toRound(round), members: memberRows.map(toMember) }
  })
  return NextResponse.json(result)
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as Record<string, unknown>
  if (typeof body.id !== 'string') return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  const [current] = await db.select({ fundId: tripRounds.fundId }).from(tripRounds).where(eq(tripRounds.id, body.id))
  if (!current) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
  const fields = readFields(body, true, await memberIdsOf(current.fundId))
  if (typeof fields === 'string') return NextResponse.json({ error: fields }, { status: 400 })
  const [row] = await db
    .update(tripRounds)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(tripRounds.id, body.id))
    .returning()
  return NextResponse.json(toRound(row))
}

// Chỉ xoá được đợt chưa có khoản nào (FK RESTRICT) — có khoản rồi thì phải xoá / chuyển khoản trước
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  const used = await db.select({ id: tripEntries.id }).from(tripEntries).where(eq(tripEntries.roundId, id)).limit(1)
  if (used.length) return NextResponse.json({ error: 'Đợt này đã có khoản thu chi — xoá các khoản trước' }, { status: 409 })
  await db.delete(tripRounds).where(eq(tripRounds.id, id))
  return NextResponse.json({ ok: true })
}
