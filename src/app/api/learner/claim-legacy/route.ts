import { NextRequest, NextResponse } from 'next/server'
import { LEGACY_LEARNER_ID, setLearnerCookie } from '@/lib/learner/identity'

// Mở link này 1 lần (đúng trình duyệt hay dùng để học) để "nhận lại" toàn bộ tiến độ/cài đặt/bộ từ
// Chinese & Korean được tạo ra TRƯỚC khi app có khái niệm định danh riêng từng người học (xem
// lib/learner/identity.ts) — dữ liệu đó được gắn cố định vào learnerId = 'legacy' lúc thêm cột
// learnerId, không hề bị xoá. Bấm 1 lần là đủ (cookie sống 1 năm); ai khác ghé sau đó vẫn có định
// danh ngẫu nhiên riêng, không tự nhiên "thừa kế" theo learnerId này.
export async function GET(req: NextRequest) {
  const origin = new URL(req.url).origin
  const res = NextResponse.redirect(new URL('/study', origin))
  setLearnerCookie(res, LEGACY_LEARNER_ID)
  return res
}
