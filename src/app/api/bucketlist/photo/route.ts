import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { requireAdminApi } from '@/lib/admin/access'
import { deleteFromR2, uploadToR2 } from '@/lib/r2'

// Ảnh kỷ niệm của bucket list — chỉ chủ trang. Client đã nén ảnh (≤1600px, WebP/JPEG) trước khi gửi nên body nhỏ,
// đi thẳng qua server lên R2 (không dùng presigned URL vì bucket chưa bật CORS cho trình duyệt).
const TYPES: Record<string, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' }
const MAX_BYTES = 4 * 1024 * 1024

export async function POST(req: NextRequest) {
  const denied = await requireAdminApi()
  if (denied) return denied
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'Thiếu ảnh' }, { status: 400 })
  const ext = TYPES[file.type]
  if (!ext) return NextResponse.json({ error: 'Chỉ nhận ảnh WebP, JPEG hoặc PNG' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Ảnh quá lớn (tối đa 4MB)' }, { status: 400 })
  const key = `bucketlist/${nanoid()}.${ext}`
  try {
    const url = await uploadToR2(key, Buffer.from(await file.arrayBuffer()), file.type)
    return NextResponse.json({ key, url })
  } catch (e) {
    console.error('[bucketlist] upload ảnh lỗi', e)
    return NextResponse.json({ error: 'Không tải ảnh lên được' }, { status: 500 })
  }
}

// Xoá ảnh vừa tải lên nhưng chưa lưu vào điều nào (người dùng bấm Huỷ)
export async function DELETE(req: NextRequest) {
  const denied = await requireAdminApi()
  if (denied) return denied
  const key = req.nextUrl.searchParams.get('key') ?? ''
  if (!/^bucketlist\/[\w-]+\.(webp|jpe?g|png)$/.test(key)) return NextResponse.json({ error: 'Ảnh không hợp lệ' }, { status: 400 })
  await deleteFromR2(key).catch((e) => console.error('[bucketlist] xoá ảnh lỗi', key, e))
  return NextResponse.json({ ok: true })
}
