import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ieltsInvites, ieltsMagicTokens } from '@/db/schema'
import { sendMagicLinkEmail } from '@/lib/ielts/mailer'

const MAGIC_TOKEN_TTL_MS = 1000 * 60 * 30 // 30 phút

// Trả về cùng 1 thông báo dù email có được mời hay không — tránh lộ thông tin "email này có được
// cấp quyền hay không" cho người ngoài (email enumeration). Chỉ thực sự gửi mail khi email khớp
// chủ (IELTS_OWNER_EMAIL) hoặc là 1 dòng còn hiệu lực trong ieltsInvites.
export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }
  const normalized = email.trim().toLowerCase()
  const genericResponse = NextResponse.json({ ok: true, message: 'Nếu email này được cấp quyền, bạn sẽ nhận được link đăng nhập trong vài phút.' })

  const ownerEmail = process.env.IELTS_OWNER_EMAIL?.toLowerCase()
  const isOwnerEmail = ownerEmail && normalized === ownerEmail
  let isInvited = false
  if (!isOwnerEmail) {
    const [invite] = await db.select().from(ieltsInvites).where(eq(ieltsInvites.email, normalized))
    isInvited = Boolean(invite && !invite.revokedAt)
  }
  if (!isOwnerEmail && !isInvited) return genericResponse

  const token = nanoid(32)
  await db.insert(ieltsMagicTokens).values({
    token,
    email: normalized,
    expiresAt: new Date(Date.now() + MAGIC_TOKEN_TTL_MS),
  })

  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin
  const link = `${origin}/api/ielts/verify?token=${token}`
  await sendMagicLinkEmail(normalized, link)

  return genericResponse
}
