import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/ielts/session'

// Đăng xuất dùng chung cho mọi app đi qua session cookie này (IELTS, Certs — xem lib/ielts/session.ts): xoá
// đúng 1 cookie là hết phiên ở mọi nơi cùng lúc, vì bản chất chỉ có 1 danh tính (email) đăng nhập chung.
// ?next=/certs/login đưa người dùng về đúng trang đăng nhập của app họ vừa đăng xuất; mặc định về /ielts/login.
export async function GET(req: NextRequest) {
  const next = new URL(req.url).searchParams.get('next')
  const dest = next === '/certs/login' ? '/certs/login' : '/ielts/login'
  const res = NextResponse.redirect(new URL(dest, req.url))
  clearSessionCookie(res)
  return res
}
