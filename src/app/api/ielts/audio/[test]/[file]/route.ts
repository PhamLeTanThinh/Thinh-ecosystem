import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { Readable } from 'node:stream'
import { NextRequest, NextResponse } from 'next/server'
import { requireAnyAccessApi } from '@/lib/ielts/access'

// Phát âm thanh Listening từ public/ielts/audio/<đề>/<section>.mp3 nhưng qua URL KHÔNG có đuôi .mp3 và với
// Content-Type application/octet-stream: các trình tải (IDM…) nhận diện media theo đuôi file / audio/* nên sẽ không bật hộp thoại tải
// xuống cho request này. Trình duyệt vẫn phát được (tự nhận dạng MP3 theo nội dung), hỗ trợ Range để tua.
// Người dùng chưa đăng nhập / không được mời: 403 (giống các API đọc khác của /api/ielts).
const ROOT = path.join(process.cwd(), 'public', 'ielts', 'audio')

export async function GET(req: NextRequest, { params }: { params: Promise<{ test: string; file: string }> }) {
  const forbidden = await requireAnyAccessApi()
  if (forbidden) return forbidden

  const { test, file } = await params
  if (!/^[a-z0-9-]+$/.test(test) || !/^s\d+$/.test(file)) return new NextResponse('Not found', { status: 404 })
  const full = path.join(ROOT, test, `${file}.mp3`)
  let size: number
  try {
    size = (await stat(full)).size
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }

  const base = { 'Content-Type': 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'private, max-age=3600' }
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
