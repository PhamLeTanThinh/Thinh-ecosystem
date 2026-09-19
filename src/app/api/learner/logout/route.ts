import { NextResponse } from 'next/server'
import { clearLearnerCookie } from '@/lib/learner/identity'

// "Đổi hồ sơ": chỉ xoá cookie trên trình duyệt này — dữ liệu trong DB giữ nguyên, gõ lại tên là vào lại.
export async function POST() {
  const res = NextResponse.json({ ok: true })
  clearLearnerCookie(res)
  return res
}
