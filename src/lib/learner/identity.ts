import type { NextRequest, NextResponse } from 'next/server'

// Hồ sơ học của app Chinese/Korean — KHÔNG phải đăng nhập kiểu IELTS (không mật khẩu, không email,
// không token ký): chỉ là 1 TÊN (username) do người học tự chọn lần đầu vào app, lưu trong cookie để
// mỗi người có tiến độ/cài đặt/bộ từ RIÊNG. Tên được "nhận" qua /api/learner/create (xem
// lib/learner/registry.ts); máy/trình duyệt khác gõ đúng tên đó qua /api/learner/login để nhận lại
// dữ liệu cũ.
//
// Cookie sống 30 ngày và TRƯỢT: mỗi lần vào /chinese, /korean hoặc gọi API của 2 app này, proxy.ts
// gia hạn lại đủ 30 ngày kể từ lúc đó — giống cách IELTS gia hạn session. Hết hạn thì chỉ cần gõ lại
// tên, dữ liệu học KHÔNG bị xoá.
export const LEARNER_COOKIE = 'learner_id'
const LEARNER_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 ngày

// Dữ liệu học tồn tại từ TRƯỚC khi có khái niệm "hồ sơ riêng từng người" được gắn vào mã cố định này
// — xem route /api/learner/claim-legacy để "nhận lại", rồi đặt tên qua /api/learner/rename.
export const LEGACY_LEARNER_ID = 'legacy'

// null = chưa có hồ sơ (lần đầu vào app, hoặc cookie đã hết hạn) — UI sẽ hiện popup hỏi tên.
export function getLearnerId(req: NextRequest): string | null {
  return req.cookies.get(LEARNER_COOKIE)?.value || null
}

export function setLearnerCookie(res: NextResponse, id: string) {
  res.cookies.set(LEARNER_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: LEARNER_COOKIE_MAX_AGE,
    path: '/',
  })
}

export function clearLearnerCookie(res: NextResponse) {
  res.cookies.set(LEARNER_COOKIE, '', { path: '/', maxAge: 0 })
}

// Chuẩn hoá tên người dùng gõ vào: viết thường, khoảng trắng → gạch ngang, bỏ ký tự lạ; phải từ 3 ký
// tự và bắt đầu bằng chữ cái. Dùng cho cả tạo mới lẫn đăng nhập lại, nên "Thinh" và "thinh" là 1 tên.
export function normalizeUsername(input: string): string | null {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 24)
  return cleaned.length >= 3 && /^[a-z]/.test(cleaned) ? cleaned : null
}

export const USERNAME_RULE_MESSAGE = 'Tên phải từ 3 ký tự, bắt đầu bằng chữ cái, chỉ gồm chữ/số/gạch ngang/gạch dưới'
