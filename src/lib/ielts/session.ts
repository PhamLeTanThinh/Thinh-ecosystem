import crypto from 'crypto'
import type { NextResponse } from 'next/server'

// Tách khỏi access.ts để proxy.ts import được mà không kéo theo kết nối DB (proxy chỉ cần ký/verify
// token, không tra bảng invites).
export const SESSION_COOKIE = 'ielts_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 ngày
// Session trượt: mỗi lần vào lại thì cấp cookie mới 30 ngày. Chỉ cấp lại khi token đã cũ hơn ngần
// này, để không phải set-cookie ở từng request (API fetch, prefetch...).
const REFRESH_AFTER_MS = 1000 * 60 * 60 * 24 // 1 ngày

function sessionSecret(): string {
  const secret = process.env.IELTS_SESSION_SECRET
  if (!secret) throw new Error('IELTS_SESSION_SECRET is not set')
  return secret
}

function sign(value: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url')
}

export function createSessionToken(email: string): string {
  const payload = Buffer.from(JSON.stringify({ email: email.toLowerCase(), exp: Date.now() + SESSION_TTL_MS })).toString('base64url')
  return `${payload}.${sign(payload, sessionSecret())}`
}

export function verifySessionToken(token: string): { email: string; exp: number } | null {
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  try {
    const expected = sign(payload, sessionSecret())
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { email: string; exp: number }
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return null
    return { email: data.email, exp: data.exp }
  } catch {
    return null
  }
}

export function setSessionCookie(res: NextResponse, email: string) {
  res.cookies.set(SESSION_COOKIE, createSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TTL_MS / 1000,
    path: '/',
  })
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.delete(SESSION_COOKIE)
}

// Token còn hợp lệ nhưng đã được cấp hơn REFRESH_AFTER_MS thì trả email để cấp lại cookie mới.
export function emailToRefresh(token: string): string | null {
  const session = verifySessionToken(token)
  if (!session) return null
  const issuedAt = session.exp - SESSION_TTL_MS
  return Date.now() - issuedAt > REFRESH_AFTER_MS ? session.email : null
}
