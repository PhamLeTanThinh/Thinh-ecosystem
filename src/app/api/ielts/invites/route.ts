import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { db } from '@/lib/db'
import { ieltsInvites, ieltsMagicTokens } from '@/db/schema'
import { requireOwnerApi } from '@/lib/ielts/access'
import { sendMagicLinkEmail } from '@/lib/ielts/mailer'

const MAGIC_TOKEN_TTL_MS = 1000 * 60 * 30

export async function GET() {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const rows = await db.select().from(ieltsInvites).orderBy(ieltsInvites.invitedAt)
  return NextResponse.json(
    rows.map((r) => ({
      email: r.email,
      invitedAt: r.invitedAt.toISOString(),
      revokedAt: r.revokedAt ? r.revokedAt.toISOString() : null,
    })),
  )
}

// Thêm 1 email vào danh sách mời VÀ gửi luôn magic link đăng nhập cho họ trong cùng 1 lần bấm —
// đúng luồng "nhập email → họ nhận được mail" mà chủ mô tả, không cần bước riêng.
export async function POST(req: NextRequest) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const { email } = await req.json()
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }
  const normalized = email.trim().toLowerCase()

  await db
    .insert(ieltsInvites)
    .values({ email: normalized })
    .onConflictDoUpdate({ target: ieltsInvites.email, set: { revokedAt: null } })

  const token = nanoid(32)
  await db.insert(ieltsMagicTokens).values({
    token,
    email: normalized,
    expiresAt: new Date(Date.now() + MAGIC_TOKEN_TTL_MS),
  })
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin
  await sendMagicLinkEmail(normalized, `${origin}/api/ielts/verify?token=${token}`)

  return NextResponse.json({ email: normalized, invitedAt: new Date().toISOString(), revokedAt: null })
}
