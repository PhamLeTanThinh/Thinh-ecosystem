import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { certInvites } from '@/db/schema'
import { appOrigin, sendLoginLink } from '@/lib/ielts/invite'
import { requestCertsAccess } from '@/lib/certs/invite'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Mọi trường hợp đều trả cùng 1 thông báo — tránh lộ "email này có được cấp quyền hay không" cho người
// ngoài (email enumeration). Song song với /api/ielts/request-link, chỉ khác bảng certInvites/certAccessRequests
// và next='/certs' khi gửi link. Xem file đó để biết đầy đủ 4 nhánh xử lý.
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
  const [invite] = isOwnerEmail ? [] : await db.select().from(certInvites).where(eq(certInvites.email, normalized))

  if (isOwnerEmail || (invite && !invite.revokedAt)) {
    await sendLoginLink(normalized, origin, '/certs')
    return generic()
  }

  if (ownerEmail && !invite && normalized.length <= 254 && EMAIL_RE.test(normalized)) {
    await requestCertsAccess(normalized, ownerEmail, origin)
  }
  return generic()
}
