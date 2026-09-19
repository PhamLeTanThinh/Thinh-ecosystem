import { NextRequest, NextResponse } from 'next/server'
import { appOrigin, sendLoginLink } from '@/lib/ielts/invite'

// Đăng nhập trang /admin: gửi magic link — CHỈ khi email đúng là IELTS_OWNER_EMAIL. Tách khỏi
// /api/ielts/request-link vì route đó coi email lạ là "người xin quyền xem IELTS" (ghi yêu cầu + báo chủ),
// còn ai gõ email lạ vào cổng admin thì chỉ cần bị bỏ qua, không được sinh yêu cầu nào. Luôn trả cùng 1 kết
// quả dù email đúng hay sai để người ngoài không dò ra email của chủ.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const ownerEmail = process.env.IELTS_OWNER_EMAIL?.trim().toLowerCase()

  if (email && ownerEmail && email === ownerEmail) {
    try {
      await sendLoginLink(email, appOrigin(req.url), '/admin')
    } catch (err) {
      console.error('[admin request-link]', err)
    }
  }
  return NextResponse.json({ ok: true })
}
