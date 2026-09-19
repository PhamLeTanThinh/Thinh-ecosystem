import { nanoid } from 'nanoid'
import { count, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ieltsAccessRequests, ieltsInvites, ieltsMagicTokens } from '@/db/schema'
import { sendAccessRequestNotice, sendMagicLinkEmail } from '@/lib/ielts/mailer'

const MAGIC_TOKEN_TTL_MS = 1000 * 60 * 30 // 30 phút
// Trần số yêu cầu đang chờ — ai cũng gọi được request-link nên cần chặn kẻ spam email ngẫu nhiên
// làm đầy bảng và hộp thư của chủ. Vượt trần thì bỏ qua âm thầm.
const MAX_PENDING_REQUESTS = 100

export function appOrigin(reqUrl: string): string {
  return process.env.NEXT_PUBLIC_APP_URL || new URL(reqUrl).origin
}

export async function sendLoginLink(email: string, origin: string) {
  const token = nanoid(32)
  await db.insert(ieltsMagicTokens).values({ token, email, expiresAt: new Date(Date.now() + MAGIC_TOKEN_TTL_MS) })
  await sendMagicLinkEmail(email, `${origin}/api/ielts/verify?token=${token}`)
}

// Mời 1 email (hoặc cấp lại nếu đã bị thu hồi), dọn yêu cầu chờ duyệt của họ nếu có, và gửi luôn
// magic link. Dùng chung cho nút "Mời qua email" và nút "Duyệt" ở yêu cầu truy cập.
export async function grantAccess(email: string, origin: string) {
  const [invite] = await db
    .insert(ieltsInvites)
    .values({ email })
    .onConflictDoUpdate({ target: ieltsInvites.email, set: { revokedAt: null } })
    .returning()
  await db.delete(ieltsAccessRequests).where(eq(ieltsAccessRequests.email, email))
  await sendLoginLink(email, origin)
  return { email: invite.email, invitedAt: invite.invitedAt.toISOString(), revokedAt: null }
}

// Ghi nhận 1 người lạ xin quyền và báo cho chủ. Chỉ báo đúng 1 lần cho mỗi email: xin lại khi đang
// chờ hoặc đã bị từ chối thì không làm gì thêm (onConflictDoNothing cũng chặn được 2 request đồng thời).
export async function requestAccess(email: string, ownerEmail: string, origin: string) {
  const [{ n }] = await db.select({ n: count() }).from(ieltsAccessRequests).where(eq(ieltsAccessRequests.status, 'pending'))
  if (n >= MAX_PENDING_REQUESTS) return

  const inserted = await db.insert(ieltsAccessRequests).values({ email }).onConflictDoNothing().returning()
  if (inserted.length === 0) return

  try {
    await sendAccessRequestNotice(ownerEmail, email, `${origin}/ielts/admin`)
  } catch (err) {
    console.error('[ielts access request notice]', err)
  }
}
