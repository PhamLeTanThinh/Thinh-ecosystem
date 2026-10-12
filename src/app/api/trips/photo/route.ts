import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { deleteFromR2, uploadToR2 } from '@/lib/r2'
import { TRIP_PHOTO_KEY } from '@/lib/trips/types'

// Ảnh chứng từ (hoá đơn, bill...) của khoản chi trong /trips. Client đã nén ảnh (≤1600px, WebP/JPEG) trước khi gửi nên
// body nhỏ, đi thẳng qua server lên R2 — cùng cách làm với /api/bucketlist/photo. App trips không khoá nên không check quyền.
const TYPES: Record<string, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' }
const MAX_BYTES = 4 * 1024 * 1024

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'Thiếu ảnh' }, { status: 400 })
  const ext = TYPES[file.type]
  if (!ext) return NextResponse.json({ error: 'Chỉ nhận ảnh WebP, JPEG hoặc PNG' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Ảnh quá lớn (tối đa 4MB)' }, { status: 400 })
  const key = `trips/${nanoid()}.${ext}`
  try {
    const url = await uploadToR2(key, Buffer.from(await file.arrayBuffer()), file.type)
    return NextResponse.json({ key, url })
  } catch (e) {
    console.error('[trips] upload ảnh lỗi', e)
    return NextResponse.json({ error: 'Không tải ảnh lên được' }, { status: 500 })
  }
}

// Xoá ảnh vừa tải lên nhưng chưa lưu vào khoản nào (người dùng gỡ ra hoặc bấm Huỷ)
export async function DELETE(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key') ?? ''
  if (!TRIP_PHOTO_KEY.test(key)) return NextResponse.json({ error: 'Ảnh không hợp lệ' }, { status: 400 })
  await deleteFromR2(key).catch((e) => console.error('[trips] xoá ảnh lỗi', key, e))
  return NextResponse.json({ ok: true })
}
