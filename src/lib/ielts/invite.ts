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

// next = trang đích sau khi bấm link (chỉ nhận các đường dẫn trong whitelist ở api/ielts/verify): '/admin' cho
// link đăng nhập trang quản trị của chủ, bỏ trống = vào /ielts như bình thường.
// Trả { sent, link }: sent = thư đã được nhà cung cấp nhận (xem mailer.ts), false khi gửi thất bại/chưa cấu hình gửi
// mail; link = đường dẫn đăng nhập, để trang admin đưa cho chủ tự gửi tay khi thư không đi được.
export async function sendLoginLink(email: string, origin: string, next?: '/admin'): Promise<{ sent: boolean; link: string }> {
  const token = nanoid(32)
  await db.insert(ieltsMagicTokens).values({ token, email, expiresAt: new Date(Date.now() + MAGIC_TOKEN_TTL_MS) })
  const nextParam = next ? `&next=${encodeURIComponent(next)}` : ''
  const link = `${origin}/api/ielts/verify?token=${token}${nextParam}`
  const sent = await sendMagicLinkEmail(email, link, next ? 'admin' : 'ielts')
  return { sent, link }
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
  const { sent, link } = await sendLoginLink(email, origin)
  // mailSent + loginLink (chỉ khi thư KHÔNG đi được) để trang admin báo thật cho chủ và đưa link cho chủ gửi tay, thay vì
  // luôn báo "đã gửi". Route này chỉ chủ gọi được (requireOwnerApi) nên trả link về là an toàn.
  return { email: invite.email, invitedAt: invite.invitedAt.toISOString(), revokedAt: null, mailSent: sent, ...(sent ? {} : { loginLink: link }) }
}

// Ghi nhận 1 người lạ xin quyền và báo cho chủ. Chỉ báo đúng 1 lần cho mỗi email: xin lại khi đang
// chờ hoặc đã bị từ chối thì không làm gì thêm (onConflictDoNothing cũng chặn được 2 request đồng thời).
export async function requestAccess(email: string, ownerEmail: string, origin: string) {
  const [{ n }] = await db.select({ n: count() }).from(ieltsAccessRequests).where(eq(ieltsAccessRequests.status, 'pending'))
  if (n >= MAX_PENDING_REQUESTS) return

  const inserted = await db.insert(ieltsAccessRequests).values({ email }).onConflictDoNothing().returning()
  if (inserted.length === 0) return

  try {
    await sendAccessRequestNotice(ownerEmail, email, `${origin}/admin`)
  } catch (err) {
    console.error('[ielts access request notice]', err)
  }
}
