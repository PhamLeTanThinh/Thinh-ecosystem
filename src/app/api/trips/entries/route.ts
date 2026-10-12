import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { tripEntries, tripFunds, tripMembers } from '@/db/schema'
import { categoriesOf, isEntryType, isISODate, type EntrySplit, type FundEntry, type SplitMode } from '@/lib/trips/types'
import { toEntry } from '@/lib/trips/rows'

// Khoản thu / chi / chuyển tiền của 1 quỹ (/trips/[id]).

type EntryFields = Omit<FundEntry, 'id' | 'fundId' | 'createdAt' | 'attachments' | 'originalAmount' | 'originalCurrency'>

function readFields(body: Record<string, unknown>, memberIds: Set<string>): EntryFields | string {
  if (!isEntryType(body.type)) return 'Loại khoản không hợp lệ'
  const type = body.type
  const amount = Number(body.amount)
  if (!Number.isInteger(amount) || amount <= 0) return 'Số tiền phải lớn hơn 0'
  if (!isISODate(body.date)) return 'Ngày không hợp lệ'
  if (body.dueDate != null && !isISODate(body.dueDate)) return 'Hạn không hợp lệ'
  const member = (v: unknown) => (typeof v === 'string' && v ? v : null)
  const memberId = member(body.memberId)
  const toMemberId = type === 'transfer' ? member(body.toMemberId) : null
  for (const id of [memberId, toMemberId]) if (id && !memberIds.has(id)) return 'Thành viên không thuộc quỹ này'
  if (type === 'transfer' && memberId === toMemberId) return 'Người chuyển và người nhận phải khác nhau'

  const splitMode: SplitMode = body.splitMode === 'weight' || body.splitMode === 'exact' ? body.splitMode : 'equal'
  const splits: EntrySplit[] = []
  if (type === 'out' && Array.isArray(body.splits)) {
    for (const s of body.splits as { memberId?: unknown; value?: unknown }[]) {
      if (typeof s?.memberId !== 'string' || !memberIds.has(s.memberId)) return 'Người chia không thuộc quỹ này'
      const value = typeof s.value === 'number' && Number.isFinite(s.value) && s.value >= 0 ? s.value : null
      splits.push({ memberId: s.memberId, value })
    }
  }
  if (splitMode === 'exact' && splits.reduce((n, s) => n + (s.value ?? 0), 0) !== amount) return 'Tổng các phần phải bằng số tiền'

  const category = categoriesOf(type).some((c) => c.key === body.category) ? (body.category as string) : categoriesOf(type).at(-1)!.key
  const note = typeof body.note === 'string' ? body.note.trim() : ''
  if (note.length > 500) return 'Ghi chú tối đa 500 ký tự'
  const done = body.done !== false
  return {
    type,
    amount,
    date: body.date,
    // Khoản dự kiến: hạn = ngày hẹn. Khi đã thu/chi thì giữ hạn gốc client gửi lên (nếu có)
    dueDate: done ? (isISODate(body.dueDate) ? body.dueDate : null) : body.date,
    done,
    memberId,
    toMemberId,
    splitMode,
    splits,
    category,
    note,
  }
}

async function memberIdsOf(fundId: string) {
  const rows = await db.select({ id: tripMembers.id }).from(tripMembers).where(eq(tripMembers.fundId, fundId))
  return new Set(rows.map((r) => r.id))
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Record<string, unknown>
  if (typeof body.id !== 'string' || !body.id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  if (typeof body.fundId !== 'string') return NextResponse.json({ error: 'Thiếu quỹ' }, { status: 400 })
  const [fund] = await db.select({ id: tripFunds.id }).from(tripFunds).where(eq(tripFunds.id, body.fundId))
  if (!fund) return NextResponse.json({ error: 'Không tìm thấy quỹ' }, { status: 404 })
  const fields = readFields(body, await memberIdsOf(body.fundId))
  if (typeof fields === 'string') return NextResponse.json({ error: fields }, { status: 400 })
  const [row] = await db
    .insert(tripEntries)
    .values({ id: body.id, fundId: body.fundId, ...fields })
    .returning()
  return NextResponse.json(toEntry(row))
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as Record<string, unknown>
  if (typeof body.id !== 'string') return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  const [current] = await db.select({ fundId: tripEntries.fundId }).from(tripEntries).where(eq(tripEntries.id, body.id))
  if (!current) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
  const fields = readFields(body, await memberIdsOf(current.fundId))
  if (typeof fields === 'string') return NextResponse.json({ error: fields }, { status: 400 })
  const [row] = await db
    .update(tripEntries)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(tripEntries.id, body.id))
    .returning()
  return NextResponse.json(toEntry(row))
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  await db.delete(tripEntries).where(eq(tripEntries.id, id))
  return NextResponse.json({ ok: true })
}
