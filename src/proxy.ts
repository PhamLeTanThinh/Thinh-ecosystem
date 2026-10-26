import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, emailToRefresh, setSessionCookie } from '@/lib/ielts/session'
import { LEARNER_COOKIE, setLearnerCookie } from '@/lib/learner/identity'
import { isBlockedAgent, isRateLimited } from '@/lib/security/crawl'

const SESSION_PREFIXES = ['/ielts', '/api/ielts', '/admin', '/api/admin', '/pm', '/it', '/api/hub', '/api/papers']

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Lớp 3 chống crawl (xem lib/security/crawl.ts): bot AI / script scrape bị chặn hẳn khỏi app học + API; API thêm giới
  // hạn tốc độ theo IP. Cron của Vercel (/api/cron/*) không đi qua đây — nằm ngoài matcher.
  if (isBlockedAgent(req.headers.get('user-agent'))) {
    return new NextResponse('Forbidden', { status: 403, headers: { 'X-Robots-Tag': 'noindex, nofollow' } })
  }
  if (pathname.startsWith('/api/')) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'too many requests' }, { status: 429, headers: { 'Retry-After': '60' } })
    }
  }

  const res = NextResponse.next()

  // Trang /admin, Project Manager, IT Hub dùng chung phiên đăng nhập email của IELTS nên cũng gia hạn trượt ở đây.
  if (SESSION_PREFIXES.some((p) => pathname.startsWith(p))) {
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
  // Mọi app học + mọi API (trừ cron — Vercel Cron tự xác thực bằng CRON_SECRET), để lớp chặn bot phía trên phủ hết dữ liệu.
  // Portfolio "/" và link rút gọn /s/* không nằm ở đây (vẫn public cho bot xem trước link).
  matcher: [
    '/(admin|bucketlist|certs|chinese|family|habits|ielts|it|korean|money|music|notes|pm|rmbg|short|study|tools|trips|vitrine)/:path*',
    '/(admin|bucketlist|certs|chinese|family|habits|ielts|it|korean|money|music|notes|pm|rmbg|short|study|tools|trips|vitrine)',
    '/api/((?!cron/).*)',
  ],
}
