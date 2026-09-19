import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/ielts/session'

// Quyền vào trang /admin (và /api/admin/*) — CHỈ chủ trang, xác định bằng đúng phiên đăng nhập email đã có
// (cookie ielts_session, xem lib/ielts/session.ts) có email = IELTS_OWNER_EMAIL. Cố ý KHÔNG đi qua
// getIeltsAccess(): chủ không cần đang là "người được mời xem IELTS" mới duyệt được yêu cầu của người khác,
// và admin không còn nằm trong app IELTS nữa.
//
// Khác getIeltsAccess() ở 1 điểm: chưa đặt IELTS_OWNER_EMAIL thì IELTS coi mọi người là chủ (tiện dùng local),
// còn admin chỉ giữ hành vi đó khi chạy dev — ở production mà thiếu biến này thì KHÔNG ai vào được, vì trang này
// giờ còn xoá được dữ liệu học của người khác, không thể mở toang chỉ vì quên cấu hình.
export type AdminAccess = { ok: true; email: string | null } | { ok: false }

export async function getAdminAccess(): Promise<AdminAccess> {
  const ownerEmail = process.env.IELTS_OWNER_EMAIL?.trim().toLowerCase()
  if (!ownerEmail) return process.env.NODE_ENV === 'production' ? { ok: false } : { ok: true, email: null }

  const token = (await cookies()).get(SESSION_COOKIE)?.value
  const email = token ? verifySessionToken(token)?.email.toLowerCase() : null
  return email === ownerEmail ? { ok: true, email } : { ok: false }
}

// Dùng ở đầu mọi Route Handler dưới /api/admin/* — 403 nếu không phải chủ.
export async function requireAdminApi(): Promise<NextResponse | null> {
  if ((await getAdminAccess()).ok) return null
  return NextResponse.json({ error: 'forbidden — chỉ chủ trang mới có quyền' }, { status: 403 })
}
