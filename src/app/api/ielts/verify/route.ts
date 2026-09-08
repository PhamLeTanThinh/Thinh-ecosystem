import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ieltsMagicTokens } from '@/db/schema'
import { setSessionCookie } from '@/lib/ielts/access'

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

  const res = NextResponse.redirect(new URL('/ielts', origin))
  setSessionCookie(res, row.email)
  return res
}
