import { NextRequest } from 'next/server'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { getResearchPaper } from '@/lib/it/papers'
import { requireHubAccessApi } from '@/lib/hub/access'

// Serve PDF qua API route (URL không có đuôi .pdf) thay vì file tĩnh trong public/ — một số
// trình quản lý tải xuống (IDM, Free Download Manager...) chộp request theo đuôi file trong URL,
// khiến fetch() ngầm của pdf.js bị huỷ giữa chừng dù request đó không phải do người dùng bấm tải.
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  // PDF là nội dung của IT Hub — cùng quyền xem với trang /it (lib/hub/access.ts).
  const forbidden = await requireHubAccessApi('it')
  if (forbidden) return forbidden

  const { slug } = await params
  const paper = getResearchPaper(slug)
  if (!paper) return new Response('Không tìm thấy', { status: 404 })

  const filePath = path.join(process.cwd(), 'src/data/papers', `${slug}.pdf`)
  let fileStat
  try {
    fileStat = await stat(filePath)
  } catch {
    return new Response('Không tìm thấy file PDF', { status: 404 })
  }

  const range = req.headers.get('range')
  if (range) {
    const match = /^bytes=(\d+)-(\d*)$/.exec(range)
    if (match) {
      const start = Number(match[1])
      const end = match[2] ? Number(match[2]) : fileStat.size - 1
      const buffer = await readFile(filePath)
      return new Response(new Uint8Array(buffer.subarray(start, end + 1)), {
        status: 206,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Range': `bytes ${start}-${end}/${fileStat.size}`,
          'Content-Length': String(end - start + 1),
          'Accept-Ranges': 'bytes',
        },
      })
    }
  }

  const buffer = await readFile(filePath)
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(fileStat.size),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
