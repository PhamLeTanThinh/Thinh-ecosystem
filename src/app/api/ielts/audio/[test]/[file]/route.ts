import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { Readable } from 'node:stream'
import { BlobError, get } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { requireAnyAccessApi } from '@/lib/ielts/access'

// Phát âm thanh Listening <đề>/<section>.mp3 nhưng qua URL KHÔNG có đuôi .mp3 và với
// Content-Type application/octet-stream: các trình tải (IDM…) nhận diện media theo đuôi file / audio/* nên sẽ không bật hộp thoại tải
// xuống cho request này. Trình duyệt vẫn phát được (tự nhận dạng MP3 theo nội dung), hỗ trợ Range để tua.
// Nguồn: public/ielts/audio (local, file đã tải về) → không có thì Vercel Blob private ielts/audio/… (bản deploy — đẩy lên bằng
// scripts/upload-listening-audio.mjs; mp3 bị loại khỏi bundle function bằng outputFileTracingExcludes trong next.config.ts).
// Người dùng chưa đăng nhập / không được mời: 403 (giống các API đọc khác của /api/ielts).
const ROOT = path.join(process.cwd(), 'public', 'ielts', 'audio')

export async function GET(req: NextRequest, { params }: { params: Promise<{ test: string; file: string }> }) {
  const forbidden = await requireAnyAccessApi()
  if (forbidden) return forbidden

  const { test, file } = await params
  if (!/^[a-z0-9-]+$/.test(test) || !/^s\d+$/.test(file)) return new NextResponse('Not found', { status: 404 })
  const full = path.join(ROOT, test, `${file}.mp3`)
  const base = { 'Content-Type': 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'private, max-age=3600' }
  let size: number
  try {
    size = (await stat(full)).size
  } catch {
    return fromBlob(`ielts/audio/${test}/${file}.mp3`, req.headers.get('range'), base)
  }

  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.get('range') ?? '')
  if (range && (range[1] || range[2])) {
    // bytes=a-b | bytes=a- | bytes=-n (n byte cuối)
    let start = range[1] ? Number(range[1]) : size - Number(range[2])
    let end = range[1] && range[2] ? Number(range[2]) : size - 1
    start = Math.max(0, start)
    end = Math.min(end, size - 1)
    if (start > end || start >= size) return new NextResponse(null, { status: 416, headers: { ...base, 'Content-Range': `bytes */${size}` } })
    const body = Readable.toWeb(createReadStream(full, { start, end })) as ReadableStream
    return new NextResponse(body, { status: 206, headers: { ...base, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1) } })
  }
  const body = Readable.toWeb(createReadStream(full)) as ReadableStream
  return new NextResponse(body, { status: 200, headers: { ...base, 'Content-Length': String(size) } })
}

// Stream blob private qua function (không lộ URL Blob), chuyển tiếp Range để tua; Blob tự trả 206 + Content-Range.
async function fromBlob(pathname: string, range: string | null, base: Record<string, string>) {
  // Trên Vercel store nối qua OIDC (BLOB_STORE_ID + token OIDC runtime, SDK tự lấy); local có thể dùng BLOB_READ_WRITE_TOKEN
  if (!process.env.BLOB_STORE_ID && !process.env.BLOB_READ_WRITE_TOKEN) return new NextResponse('Not found', { status: 404 })
  let res
  try {
    res = await get(pathname, { access: 'private', headers: range ? { range } : undefined })
  } catch (e) {
    // Range ngoài dung lượng file → Blob trả 416, SDK ném BlobError
    if (e instanceof BlobError && /\b416\b/.test(e.message)) return new NextResponse(null, { status: 416, headers: base })
    throw e
  }
  if (!res?.stream) return new NextResponse('Not found', { status: 404 })
  const headers: Record<string, string> = { ...base }
  const contentRange = res.headers.get('content-range')
  const contentLength = res.headers.get('content-length')
  if (contentRange) headers['Content-Range'] = contentRange
  if (contentLength) headers['Content-Length'] = contentLength
  return new NextResponse(res.stream, { status: contentRange ? 206 : 200, headers })
}
