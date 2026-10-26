import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ieltsMagicTokens } from '@/db/schema'
import { setSessionCookie } from '@/lib/ielts/session'

// Đích sau khi đăng nhập — khớp tham số next của sendLoginLink (lib/ielts/invite.ts).
const ALLOWED_NEXT = new Set(['/admin', '/certs', '/pm', '/it'])

// Bấm vào link trong email sẽ tới đây — kiểm tra token còn hạn, chưa dùng, rồi đánh dấu đã dùng
// (chống mở lại link cũ trong email để đăng nhập lần nữa) và cấp session cookie cho đúng email đó.
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const token = searchParams.get('token')
  if (!token) return NextResponse.redirect(new URL('/ielts/login?error=missing_token', origin))

  const [row] = await db.select().from(ieltsMagicTokens).where(eq(ieltsMagicTokens.token, token))
  if (!row || row.usedAt || row.expiresAt < new Date()) {
    return NextResponse.redirect(new URL('/ielts/login?error=invalid_token', origin))
  }

  await db.update(ieltsMagicTokens).set({ usedAt: new Date() }).where(eq(ieltsMagicTokens.token, token))

  // Chỉ nhận đúng các đích trong whitelist — không redirect tới đường dẫn tuỳ ý người ta nhét vào link.
  const next = searchParams.get('next')
  const dest = next && ALLOWED_NEXT.has(next) ? next : '/ielts'
  const res = NextResponse.redirect(new URL(dest, origin))
  setSessionCookie(res, row.email)
  return res
}
