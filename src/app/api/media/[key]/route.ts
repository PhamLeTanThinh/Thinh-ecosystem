import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

// Whitelist key ẩn danh → file thật trong public/preloader/video. URL endpoint này KHÔNG mang đuôi
// .mp4 và trả Content-Type chung chung (application/octet-stream) thay vì video/* — phá cả 2 dấu
// hiệu mà IDM (và các trình quản lý tải khác) dùng để sniff network rồi tự chèn nút "Download this
// video" đè lên trang. Client phải tự fetch() rồi đóng gói lại thành Blob video/mp4 (xem
// components/media/ShieldedVideo.tsx) — video tag chỉ thấy 1 địa chỉ blob: nội bộ, không phải URL
// mạng thật.
const VIDEO_MAP: Record<string, string> = {
  korean: 'korean.mp4',
  chinese: 'chinese.mp4',
  ielts: 'ielts.mp4',
  music: 'music.mp4',
  pm: 'pm.mp4',
  it: 'IT.mp4',
  certs: 'cert.mp4',
  'study-mascot': 'main.mp4',
}

export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params
  const filename = VIDEO_MAP[key]
  if (!filename) return new NextResponse('Not found', { status: 404 })

  const filePath = path.join(process.cwd(), 'public', 'preloader', 'video', filename)
  const data = await readFile(filePath)

  return new NextResponse(new Uint8Array(data), {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'private, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
