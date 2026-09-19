import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, emailToRefresh, setSessionCookie } from '@/lib/ielts/session'

// Gia hạn session IELTS thêm 30 ngày mỗi lần người dùng vào lại. Cookie chỉ ghi được ở proxy/Route
// Handler, không ghi được từ layout (Server Component), nên việc gia hạn nằm ở đây.
export function proxy(req: NextRequest) {
  const res = NextResponse.next()
  // logout tự xoá cookie — không gia hạn đè lên.
  if (req.nextUrl.pathname === '/api/ielts/logout') return res

  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) return res

  const email = emailToRefresh(token)
  if (email) setSessionCookie(res, email)
  return res
}

export const config = {
  matcher: ['/ielts/:path*', '/api/ielts/:path*'],
}
