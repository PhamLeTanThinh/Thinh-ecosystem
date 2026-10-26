import { NextRequest, NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { hubInvites } from '@/db/schema'
import { appOrigin, sendLoginLink } from '@/lib/ielts/invite'
import { HUB_APPS, isHubApp } from '@/lib/hub/apps'
import { requestHubAccess } from '@/lib/hub/invite'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Mọi trường hợp đều trả cùng 1 thông báo — tránh lộ "email này có được cấp quyền hay không" (email enumeration).
// Song song với /api/ielts/request-link (đọc file đó để biết đầy đủ các nhánh), chỉ khác bảng hubInvites/
// hubAccessRequests của đúng app trên URL và đích của link đăng nhập.
const GENERIC_MESSAGE =
  'Nếu email này đã được cấp quyền, link đăng nhập sẽ được gửi tới hộp thư của bạn. Nếu chưa, yêu cầu của bạn đã được chuyển cho chủ trang để duyệt — khi được duyệt bạn sẽ nhận email đăng nhập.'

export async function POST(req: NextRequest, { params }: { params: Promise<{ app: string }> }) {
  const { app } = await params
  if (!isHubApp(app)) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const { email } = await req.json()
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }
  const normalized = email.trim().toLowerCase()
  const generic = () => NextResponse.json({ ok: true, message: GENERIC_MESSAGE })
  const origin = appOrigin(req.url)

  const ownerEmail = process.env.IELTS_OWNER_EMAIL?.toLowerCase()
  const isOwnerEmail = Boolean(ownerEmail) && normalized === ownerEmail
  const [invite] = isOwnerEmail
    ? []
    : await db
        .select()
        .from(hubInvites)
        .where(and(eq(hubInvites.app, app), eq(hubInvites.email, normalized)))

  if (isOwnerEmail || (invite && !invite.revokedAt)) {
    await sendLoginLink(normalized, origin, HUB_APPS[app].path)
    return generic()
  }

  if (ownerEmail && !invite && normalized.length <= 254 && EMAIL_RE.test(normalized)) {
    await requestHubAccess(app, normalized, ownerEmail, origin)
  }
  return generic()
}
