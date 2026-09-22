import { cookies } from 'next/headers'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ieltsInvites } from '@/db/schema'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/ielts/session'

// Đăng nhập bằng magic link qua email — không mật khẩu, không OAuth. Chủ đặt IELTS_OWNER_EMAIL
// trong .env; người xem được thêm vào bảng ieltsInvites (mời qua /admin). Ai đăng nhập đúng
// email nằm trong 1 trong 2 diện đó mới được vào; login xong nhận 1 cookie session đã ký (HMAC),
// không cần bảng session riêng — mỗi request tự giải mã + verify chữ ký, rồi tra lại DB xem email
// đó còn hợp lệ không (nên thu hồi 1 người có tác dụng ngay ở request kế tiếp của họ).
// Phần ký/verify token + đặt/xoá cookie nằm ở session.ts (session trượt 30 ngày, gia hạn ở proxy.ts).
async function getSessionEmail(): Promise<string | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)?.email ?? null
}

export type IeltsAccess = { mode: 'owner'; email: string | null } | { mode: 'viewer'; email: string } | { mode: 'denied' }

// Chưa đặt IELTS_OWNER_EMAIL = chưa bật chia sẻ ra ngoài — mọi request đều coi là chủ, giữ đúng
// hành vi cũ (dùng local, không cần đăng nhập gì). Đặt biến này mới thật sự bắt đầu yêu cầu login.
export async function getIeltsAccess(): Promise<IeltsAccess> {
  const ownerEmail = process.env.IELTS_OWNER_EMAIL
  if (!ownerEmail) return { mode: 'owner', email: null }

  const email = await getSessionEmail()
  if (!email) return { mode: 'denied' }
  if (email.toLowerCase() === ownerEmail.toLowerCase()) return { mode: 'owner', email }

  const [invite] = await db.select().from(ieltsInvites).where(eq(ieltsInvites.email, email.toLowerCase()))
  if (invite && !invite.revokedAt) return { mode: 'viewer', email }
  return { mode: 'denied' }
}

// Dùng ở đầu mọi PAGE (server component) trả dữ liệu đề luyện. Layout (protected) đã hiện màn khoá cho
// người chưa đăng nhập, nhưng KHÔNG đủ để chặn dữ liệu: Next render page song song với layout nên nội
// dung page vẫn nằm trong phản hồi RSC gửi về client dù giao diện hiện màn khoá. Phải kiểm tra lại ở đây.
export async function assertIeltsAccess(): Promise<void> {
  if ((await getIeltsAccess()).mode === 'denied') notFound()
}

export async function isOwner(): Promise<boolean> {
  const access = await getIeltsAccess()
  return access.mode === 'owner'
}

// Dùng ở đầu mọi Route Handler ghi dữ liệu /api/ielts/* — 403 nếu không phải chủ.
export async function requireOwnerApi(): Promise<NextResponse | null> {
  if (await isOwner()) return null
  return NextResponse.json({ error: 'forbidden — chỉ chủ trang mới có quyền chỉnh sửa' }, { status: 403 })
}

// Dùng ở đầu mọi Route Handler đọc dữ liệu /api/ielts/* — 403 nếu không đăng nhập/không được mời.
export async function requireAnyAccessApi(): Promise<NextResponse | null> {
  const access = await getIeltsAccess()
  if (access.mode === 'denied') {
    return NextResponse.json({ error: 'forbidden — cần đăng nhập bằng email được mời' }, { status: 403 })
  }
  return null
}
