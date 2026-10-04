import { NextRequest, NextResponse } from 'next/server'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { bucketItems } from '@/db/schema'
import { getAdminAccess, requireAdminApi } from '@/lib/admin/access'
import { deleteFromR2, r2PublicUrl } from '@/lib/r2'
import { BUCKET_MAX_PHOTOS, BUCKET_SIZE, isBucketCategory, isBucketStatus, type BucketItem, type BucketPhoto } from '@/lib/bucketlist/types'

// Bucket list: ai cũng đọc được (GET), chỉ chủ trang ghi được (POST/PATCH/DELETE — cùng quyền với /admin).

function toItem(r: typeof bucketItems.$inferSelect): BucketItem {
  return {
    id: r.id,
    slot: r.slot,
    title: r.title,
    note: r.note,
    memory: r.memory,
    photos: Array.isArray(r.photos) ? (r.photos as BucketPhoto[]) : [],
    category: isBucketCategory(r.category) ? r.category : 'other',
    status: isBucketStatus(r.status) ? r.status : 'todo',
    achievedAt: r.achievedAt,
  }
}

const PHOTO_KEY = /^bucketlist\/[\w-]+\.(webp|jpe?g|png)$/

// Xoá ảnh khỏi R2 — lỗi thì bỏ qua (ảnh mồ côi không ảnh hưởng dữ liệu), không làm hỏng thao tác chính
async function deletePhotos(keys: string[]) {
  await Promise.all(keys.map((k) => deleteFromR2(k).catch((e) => console.error('[bucketlist] xoá ảnh lỗi', k, e))))
}

const today = () => new Date().toISOString().slice(0, 10)
const isDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)

// Chuẩn hoá phần dữ liệu người dùng gửi lên — trả về chuỗi lỗi nếu không hợp lệ
function readFields(body: Record<string, unknown>, partial: boolean) {
  const out: Partial<Omit<BucketItem, 'id' | 'slot'>> = {}
  if ('title' in body || !partial) {
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    if (!title) return 'Thiếu nội dung điều muốn đạt được'
    if (title.length > 200) return 'Nội dung tối đa 200 ký tự'
    out.title = title
  }
  if ('note' in body) {
    const note = typeof body.note === 'string' ? body.note.trim() : ''
    if (note.length > 2000) return 'Ghi chú tối đa 2000 ký tự'
    out.note = note
  }
  if ('memory' in body) {
    const memory = typeof body.memory === 'string' ? body.memory.trim() : ''
    if (memory.length > 4000) return 'Kỷ niệm tối đa 4000 ký tự'
    out.memory = memory
  }
  if ('photos' in body) {
    // Chỉ nhận ảnh do /api/bucketlist/photo tải lên (key trong thư mục bucketlist/); url dựng lại từ key, không tin client
    if (!Array.isArray(body.photos) || body.photos.length > BUCKET_MAX_PHOTOS) return `Tối đa ${BUCKET_MAX_PHOTOS} ảnh`
    const photos: BucketPhoto[] = []
    for (const ph of body.photos as { key?: unknown }[]) {
      if (typeof ph?.key !== 'string' || !PHOTO_KEY.test(ph.key)) return 'Ảnh không hợp lệ'
      photos.push({ key: ph.key, url: r2PublicUrl(ph.key) })
    }
    out.photos = photos
  }
  if ('category' in body) {
    if (!isBucketCategory(body.category)) return 'Nhóm không hợp lệ'
    out.category = body.category
  }
  if ('status' in body) {
    if (!isBucketStatus(body.status)) return 'Trạng thái không hợp lệ'
    out.status = body.status
  }
  if ('achievedAt' in body) {
    if (body.achievedAt !== null && !isDate(body.achievedAt)) return 'Ngày không hợp lệ'
    out.achievedAt = body.achievedAt as string | null
  }
  return out
}

export async function GET() {
  const rows = await db.select().from(bucketItems).orderBy(asc(bucketItems.slot))
  const canEdit = (await getAdminAccess()).ok
  return NextResponse.json({ items: rows.map(toItem), canEdit })
}

export async function POST(req: NextRequest) {
  const denied = await requireAdminApi()
  if (denied) return denied
  const body = (await req.json()) as Record<string, unknown>
  const slot = Number(body.slot)
  if (!Number.isInteger(slot) || slot < 1 || slot > BUCKET_SIZE) return NextResponse.json({ error: 'Ô không hợp lệ' }, { status: 400 })
  const fields = readFields(body, false)
  if (typeof fields === 'string') return NextResponse.json({ error: fields }, { status: 400 })
  const status = fields.status ?? 'todo'
  const taken = await db.select({ id: bucketItems.id }).from(bucketItems).where(eq(bucketItems.slot, slot))
  if (taken.length) return NextResponse.json({ error: 'Ô này đã có điều khác' }, { status: 409 })
  const [row] = await db
    .insert(bucketItems)
    .values({
      id: crypto.randomUUID(),
      slot,
      title: fields.title!,
      note: fields.note ?? '',
      memory: fields.memory ?? '',
      photos: fields.photos ?? [],
      category: fields.category ?? 'other',
      status,
      achievedAt: status === 'done' ? (fields.achievedAt ?? today()) : null,
    })
    .returning()
  return NextResponse.json(toItem(row))
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdminApi()
  if (denied) return denied
  const body = (await req.json()) as Record<string, unknown>
  if (typeof body.id !== 'string') return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  const fields = readFields(body, true)
  if (typeof fields === 'string') return NextResponse.json({ error: fields }, { status: 400 })
  const [current] = await db.select().from(bucketItems).where(eq(bucketItems.id, body.id))
  if (!current) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
  // Đạt được → ghi ngày (mặc định hôm nay nếu chưa có); bỏ trạng thái "đã đạt" → xoá ngày
  const status = fields.status ?? current.status
  const achievedAt = status === 'done' ? (fields.achievedAt ?? current.achievedAt ?? today()) : null
  const [row] = await db
    .update(bucketItems)
    .set({ ...fields, achievedAt, updatedAt: new Date() })
    .where(eq(bucketItems.id, body.id))
    .returning()
  // Ảnh bị gỡ khỏi điều này → xoá luôn trên R2
  if (fields.photos) {
    const kept = new Set(fields.photos.map((ph) => ph.key))
    await deletePhotos(((current.photos as BucketPhoto[]) ?? []).map((ph) => ph.key).filter((k) => !kept.has(k)))
  }
  return NextResponse.json(toItem(row))
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdminApi()
  if (denied) return denied
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 })
  const [row] = await db.delete(bucketItems).where(eq(bucketItems.id, id)).returning()
  if (row) await deletePhotos(((row.photos as BucketPhoto[]) ?? []).map((ph) => ph.key))
  return NextResponse.json({ ok: true })
}
