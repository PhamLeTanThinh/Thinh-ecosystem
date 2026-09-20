import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

// Whitelist key ẩn danh → file thật trong public/preloader. URL endpoint này KHÔNG mang đuôi
// .mp4 và trả Content-Type chung chung (application/octet-stream) thay vì video/* — phá cả 2 dấu
// hiệu mà IDM (và các trình quản lý tải khác) dùng để sniff network rồi tự chèn nút "Download this
// video" đè lên trang. Client phải tự fetch() rồi đóng gói lại thành Blob video/mp4 (xem
// components/media/ShieldedVideo.tsx) — video tag chỉ thấy 1 địa chỉ blob: nội bộ, không phải URL
// mạng thật.
const VIDEO_MAP: Record<string, string> = {
  korean: 'video/korean.mp4',
  chinese: 'video/chinese.mp4',
  ielts: 'video/ielts.mp4',
  music: 'video/music.mp4',
  pm: 'video/pm.mp4',
  it: 'video/IT.mp4',
  certs: 'video/cert.mp4',
  'study-mascot': 'video/main.mp4',
  question: 'video/question.mp4',
  happy: 'video/happy.mp4',
  preloader: 'preloader.mp4',
}

export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params
  const filename = VIDEO_MAP[key]
  if (!filename) return new NextResponse('Not found', { status: 404 })

  const filePath = path.join(process.cwd(), 'public', 'preloader', filename)
  const data = await readFile(filePath)

  return new NextResponse(new Uint8Array(data), {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'private, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
