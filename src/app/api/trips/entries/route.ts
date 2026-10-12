import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { tripEntries, tripFunds, tripMembers, tripRounds } from '@/db/schema'
import { deleteFromR2, r2PublicUrl } from '@/lib/r2'
import {
  categoriesOf,
  isEntryType,
  isISODate,
  MAX_ENTRY_PHOTOS,
  TRIP_PHOTO_KEY,
  type EntryPhoto,
  type EntrySplit,
  type FundEntry,
  type SplitMode,
} from '@/lib/trips/types'
import { toEntry } from '@/lib/trips/rows'

// Khoản thu / chi / chuyển tiền của 1 quỹ (/trips/[id]).

// attachments không gửi lên = giữ nguyên ảnh cũ (vd đánh dấu "đã thu" chỉ gửi lại các trường khác)
type EntryFields = Omit<FundEntry, 'id' | 'fundId' | 'createdAt' | 'originalAmount' | 'originalCurrency' | 'attachments'> & {
  attachments?: EntryPhoto[]
}

// Ảnh của khoản bị gỡ / khoản bị xoá → xoá luôn trên R2 (lỗi thì bỏ qua: ảnh mồ côi không ảnh hưởng số liệu)
function photoKeys(attachments: unknown): string[] {
  return Array.isArray(attachments) ? (attachments as EntryPhoto[]).map((p) => p.key).filter((k) => typeof k === 'string') : []
}
async function deletePhotos(keys: string[]) {
  await Promise.all(keys.map((k) => deleteFromR2(k).catch((e) => console.error('[trips] xoá ảnh lỗi', k, e))))
}

function readFields(body: Record<string, unknown>, memberIds: Set<string>, roundIds: Set<string>): EntryFields | string {
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
  const roundId = typeof body.roundId === 'string' && body.roundId ? body.roundId : null
  if (roundId && !roundIds.has(roundId)) return 'Đợt không thuộc quỹ này'
  // Chỉ nhận ảnh do /api/trips/photo tải lên (thư mục trips/); url dựng lại từ key, không tin client
  let attachments: EntryPhoto[] | undefined
  if (Array.isArray(body.attachments)) {
    attachments = []
    if (body.attachments.length > MAX_ENTRY_PHOTOS) return `Tối đa ${MAX_ENTRY_PHOTOS} ảnh mỗi khoản`
    for (const p of body.attachments as { key?: unknown }[]) {
      if (typeof p?.key !== 'string' || !TRIP_PHOTO_KEY.test(p.key)) return 'Ảnh không hợp lệ'
      attachments.push({ key: p.key, url: r2PublicUrl(p.key) })
    }
  }
  return {
    roundId,
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
    attachments,
  }
}

async function memberIdsOf(fundId: string) {
  const rows = await db.select({ id: tripMembers.id }).from(tripMembers).where(eq(tripMembers.fundId, fundId))
  return new Set(rows.map((r) => r.id))
}

async function roundIdsOf(fundId: string) {
  const rows = await db.select({ id: tripRounds.id }).from(tripRounds).where(eq(tripRounds.fundId, fundId))
  return new Set(rows.map((r) => r.id))
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Record<string, unknown>
  if (typeof body.id !== 'string' || !body.id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  if (typeof body.fundId !== 'string') return NextResponse.json({ error: 'Thiếu quỹ' }, { status: 400 })
  const [fund] = await db.select({ id: tripFunds.id }).from(tripFunds).where(eq(tripFunds.id, body.fundId))
  if (!fund) return NextResponse.json({ error: 'Không tìm thấy quỹ' }, { status: 404 })
  const fields = readFields(body, await memberIdsOf(body.fundId), await roundIdsOf(body.fundId))
  if (typeof fields === 'string') return NextResponse.json({ error: fields }, { status: 400 })
  const [row] = await db
    .insert(tripEntries)
    .values({ id: body.id, fundId: body.fundId, ...fields, attachments: fields.attachments ?? [] })
    .returning()
  return NextResponse.json(toEntry(row))
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as Record<string, unknown>
  if (typeof body.id !== 'string') return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  const [current] = await db
    .select({ fundId: tripEntries.fundId, attachments: tripEntries.attachments })
    .from(tripEntries)
    .where(eq(tripEntries.id, body.id))
  if (!current) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
  const fields = readFields(body, await memberIdsOf(current.fundId), await roundIdsOf(current.fundId))
  if (typeof fields === 'string') return NextResponse.json({ error: fields }, { status: 400 })
  const [row] = await db
    .update(tripEntries)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(tripEntries.id, body.id))
    .returning()
  // Ảnh bị gỡ khỏi khoản này → xoá trên R2
  if (fields.attachments) {
    const kept = new Set(fields.attachments.map((p) => p.key))
    await deletePhotos(photoKeys(current.attachments).filter((k) => !kept.has(k)))
  }
  return NextResponse.json(toEntry(row))
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  const [row] = await db.delete(tripEntries).where(eq(tripEntries.id, id)).returning({ attachments: tripEntries.attachments })
  if (row) await deletePhotos(photoKeys(row.attachments))
  return NextResponse.json({ ok: true })
}
