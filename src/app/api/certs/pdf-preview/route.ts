import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

// Trả PDF của portfolio dưới dạng JSON (base64) thay vì tải thẳng file .pdf, vì
// download manager kiểu IDM hook vào network-level response có Content-Type
// application/pdf bất kể request đó do người dùng bấm hay do fetch() của JS
// gọi — chuyển sang application/json khiến nó không còn nhận ra để cướp nữa.
// Client tự base64-decode thành Blob('application/pdf') ở phía trình duyệt,
// bước đó không đụng mạng nên IDM không có gì để chặn.
const CERTS_DIR = path.join(process.cwd(), 'public', 'certs')
const SAFE_REL_PATH = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9._ -]+\.pdf$/

export async function GET(req: NextRequest) {
  const rel = req.nextUrl.searchParams.get('path') ?? ''
  if (!SAFE_REL_PATH.test(rel)) return NextResponse.json({ error: 'invalid-path' }, { status: 400 })

  const filePath = path.join(CERTS_DIR, rel)
  // Chặn path traversal dù regex ở trên đã loại '..' — phòng thêm lớp nữa.
  if (!filePath.startsWith(CERTS_DIR + path.sep)) return NextResponse.json({ error: 'invalid-path' }, { status: 400 })

  try {
    const buf = await readFile(filePath)
    return NextResponse.json({ data: buf.toString('base64') })
  } catch {
    return NextResponse.json({ error: 'not-found' }, { status: 404 })
  }
}
