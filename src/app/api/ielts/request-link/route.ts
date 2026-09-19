import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ieltsInvites } from '@/db/schema'
import { appOrigin, requestAccess, sendLoginLink } from '@/lib/ielts/invite'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Mọi trường hợp đều trả cùng 1 thông báo — tránh lộ "email này có được cấp quyền hay không" cho
// người ngoài (email enumeration). Phía sau:
//  - chủ (IELTS_OWNER_EMAIL) hoặc email đang được mời → gửi magic link luôn;
//  - email lạ → ghi thành yêu cầu chờ duyệt và báo cho chủ (chủ duyệt ở /admin mới có mail);
//  - email từng bị thu hồi quyền → im lặng, không tạo yêu cầu, để chủ đã thu hồi khỏi bị làm phiền.
const GENERIC_MESSAGE =
  'Nếu email này đã được cấp quyền, link đăng nhập sẽ được gửi tới hộp thư của bạn. Nếu chưa, yêu cầu của bạn đã được chuyển cho chủ trang để duyệt — khi được duyệt bạn sẽ nhận email đăng nhập.'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }
  const normalized = email.trim().toLowerCase()
  const generic = () => NextResponse.json({ ok: true, message: GENERIC_MESSAGE })
  const origin = appOrigin(req.url)

  const ownerEmail = process.env.IELTS_OWNER_EMAIL?.toLowerCase()
  const isOwnerEmail = Boolean(ownerEmail) && normalized === ownerEmail
  const [invite] = isOwnerEmail ? [] : await db.select().from(ieltsInvites).where(eq(ieltsInvites.email, normalized))

  if (isOwnerEmail || (invite && !invite.revokedAt)) {
    await sendLoginLink(normalized, origin)
    return generic()
  }

  // Email lạ. Chưa bật chia sẻ (không có chủ để báo) hoặc email không hợp lệ thì bỏ qua.
  if (ownerEmail && !invite && normalized.length <= 254 && EMAIL_RE.test(normalized)) {
    await requestAccess(normalized, ownerEmail, origin)
  }
  return generic()
}
