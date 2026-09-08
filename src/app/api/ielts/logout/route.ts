import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/ielts/access'

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/ielts/login', req.url))
  clearSessionCookie(res)
  return res
}
