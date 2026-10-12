import { NextRequest, NextResponse } from 'next/server'
import { asc, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { tripEntries, tripFunds, tripMembers, tripRounds } from '@/db/schema'
import { isFundKind, isISODate, kindOf, type Fund } from '@/lib/trips/types'
import { toEntry, toFund, toMember, toRound } from '@/lib/trips/rows'
import { deleteFromR2 } from '@/lib/r2'
import { isTripTheme } from '@/lib/trips/themes'

// Trip & Quỹ chung: GET trả về toàn bộ quỹ + thành viên + mọi khoản (dữ liệu nhỏ, client tự tính tổng). Không khoá
// PIN — ai có link đều xem / sửa được.

type FundFields = Partial<Omit<Fund, 'id' | 'createdAt' | 'closedAt' | 'coverImage' | 'shareSlug'>>

// Chuẩn hoá dữ liệu quỹ người dùng gửi lên — trả về chuỗi lỗi nếu không hợp lệ
function readFields(body: Record<string, unknown>, partial: boolean): FundFields | string {
  const out: FundFields = {}
  if ('name' in body || !partial) {
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (!name) return 'Thiếu tên'
    if (name.length > 120) return 'Tên tối đa 120 ký tự'
    out.name = name
  }
  if ('kind' in body) {
    if (!isFundKind(body.kind)) return 'Loại không hợp lệ'
    out.kind = body.kind
  }
  if ('theme' in body) {
    if (!isTripTheme(body.theme)) return 'Theme không hợp lệ'
    out.theme = body.theme
  }
  if ('icon' in body) {
    const icon = typeof body.icon === 'string' ? body.icon.trim() : ''
    if (icon.length > 16) return 'Icon không hợp lệ'
    if (icon) out.icon = icon
  }
  for (const [key, max] of [
    ['note', 2000],
    ['location', 200],
  ] as const) {
    if (key in body) {
      const v = typeof body[key] === 'string' ? (body[key] as string).trim() : ''
      if (v.length > max) return `Tối đa ${max} ký tự`
      out[key] = v
    }
  }
  if ('currency' in body) {
    if (typeof body.currency !== 'string' || !/^[A-Z]{3}$/.test(body.currency)) return 'Tiền tệ không hợp lệ'
    out.currency = body.currency
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
  if ('treasurerId' in body) out.treasurerId = typeof body.treasurerId === 'string' && body.treasurerId ? body.treasurerId : null
  if ('closed' in body) out.closed = body.closed === true
  return out
}

export async function GET() {
  const [funds, members, rounds, entries] = await Promise.all([
    db.select().from(tripFunds).orderBy(desc(tripFunds.createdAt)),
    db.select().from(tripMembers).orderBy(asc(tripMembers.sortOrder), asc(tripMembers.createdAt)),
    db.select().from(tripRounds).orderBy(asc(tripRounds.sortOrder), asc(tripRounds.createdAt)),
    db.select().from(tripEntries).orderBy(asc(tripEntries.date), asc(tripEntries.createdAt)),
  ])
  return NextResponse.json({ funds: funds.map(toFund), members: members.map(toMember), rounds: rounds.map(toRound), entries: entries.map(toEntry) })
}

// Tạo quỹ, kèm danh sách thành viên ban đầu (`members: {id, name}[]`, id do client sinh)
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Record<string, unknown>
  if (typeof body.id !== 'string' || !body.id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  const fields = readFields(body, false)
  if (typeof fields === 'string') return NextResponse.json({ error: fields }, { status: 400 })
  const initial = Array.isArray(body.members) ? (body.members as { id?: unknown; name?: unknown }[]) : []
  const members = initial
    .map((m, i) => ({
      id: typeof m?.id === 'string' && m.id ? m.id : crypto.randomUUID(),
      name: typeof m?.name === 'string' ? m.name.trim() : '',
      sortOrder: i,
    }))
    .filter((m) => m.name && m.name.length <= 60)
  const kind = fields.kind ?? 'trip'
  const result = await db.transaction(async (tx) => {
    const [fund] = await tx
      .insert(tripFunds)
      .values({
        ...fields,
        id: body.id as string,
        name: fields.name!,
        kind,
        icon: fields.icon ?? kindOf(kind).icon,
        closedAt: fields.closed ? new Date() : null,
      })
      .returning()
    const rows = members.length
      ? await tx
          .insert(tripMembers)
          .values(members.map((m) => ({ ...m, fundId: fund.id })))
          .returning()
      : []
    // Quỹ góp / khác dùng được nhiều đợt → tạo sẵn đợt đầu với toàn bộ thành viên ban đầu
    const roundRows =
      kind === 'trip'
        ? []
        : await tx
            .insert(tripRounds)
            .values({
              id: fund.id + '-r1',
              fundId: fund.id,
              name: typeof body.roundName === 'string' && body.roundName.trim() ? body.roundName.trim().slice(0, 80) : 'Đợt 1',
              startDate: fields.startDate ?? null,
              endDate: fields.endDate ?? null,
              target: fields.target ?? 0,
              perMemberTarget: fields.perMemberTarget ?? 0,
              memberIds: rows.map((m) => m.id),
            })
            .returning()
    return { fund: toFund(fund), members: rows.map(toMember), rounds: roundRows.map(toRound) }
  })
  return NextResponse.json(result)
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as Record<string, unknown>
  if (typeof body.id !== 'string') return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  const fields = readFields(body, true)
  if (typeof fields === 'string') return NextResponse.json({ error: fields }, { status: 400 })
  const [current] = await db.select().from(tripFunds).where(eq(tripFunds.id, body.id))
  if (!current) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
  // Ghi lại thời điểm đóng quỹ; mở lại thì xoá
  const closedAt = 'closed' in fields ? (fields.closed ? (current.closedAt ?? new Date()) : null) : current.closedAt
  const [row] = await db
    .update(tripFunds)
    .set({ ...fields, closedAt, updatedAt: new Date() })
    .where(eq(tripFunds.id, body.id))
    .returning()
  return NextResponse.json(toFund(row))
}

// Xoá quỹ cùng thành viên + mọi khoản thu chi của nó
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  const photos = await db.select({ attachments: tripEntries.attachments }).from(tripEntries).where(eq(tripEntries.fundId, id))
  await db.transaction(async (tx) => {
    // Khoản phải xoá trước: FK khoản → thành viên là RESTRICT, cascade từ quỹ không đảm bảo thứ tự
    await tx.delete(tripEntries).where(eq(tripEntries.fundId, id))
    await tx.delete(tripFunds).where(eq(tripFunds.id, id))
  })
  const keys = photos.flatMap((p) => (Array.isArray(p.attachments) ? (p.attachments as { key: string }[]).map((x) => x.key) : []))
  await Promise.all(keys.map((k) => deleteFromR2(k).catch((e) => console.error('[trips] xoá ảnh lỗi', k, e))))
  return NextResponse.json({ ok: true })
}
