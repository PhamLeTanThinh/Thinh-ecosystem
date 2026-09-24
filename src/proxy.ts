import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, emailToRefresh, setSessionCookie } from '@/lib/ielts/session'
import { LEARNER_COOKIE, setLearnerCookie } from '@/lib/learner/identity'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  // Trang /admin dùng chung phiên đăng nhập email của IELTS (phiên của chủ) nên cũng gia hạn trượt ở đây.
  if (pathname.startsWith('/ielts') || pathname.startsWith('/api/ielts') || pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (pathname !== '/api/ielts/logout') {
      const token = req.cookies.get(SESSION_COOKIE)?.value
      if (token) {
        const email = emailToRefresh(token)
        if (email) setSessionCookie(res, email)
      }
    }
  }

  // Hồ sơ học Chinese/Korean/Certs: gia hạn trượt 30 ngày mỗi lần vào trang hoặc gọi API của 2 app này.
  // KHÔNG tự cấp cookie khi chưa có — người học phải tự đặt tên qua popup (xem LearnerProfile.tsx).
  // Không áp cho /api/learner/* vì create/login/logout tự quyết định cookie của mình, tránh 2 header
  // Set-Cookie cùng tên tranh nhau.
  if (pathname.startsWith('/chinese') || pathname.startsWith('/korean') || pathname.startsWith('/api/chinese') || pathname.startsWith('/api/korean') || pathname.startsWith('/certs') || pathname.startsWith('/api/certs')) {
    const learnerId = req.cookies.get(LEARNER_COOKIE)?.value
    if (learnerId) setLearnerCookie(res, learnerId)
  }

  return res
}

export const config = {
  matcher: [
    '/ielts/:path*',
    '/api/ielts/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/chinese/:path*',
    '/korean/:path*',
    '/api/chinese/:path*',
    '/api/korean/:path*',
    '/certs/:path*',
    '/api/certs/:path*',
  ],
}
