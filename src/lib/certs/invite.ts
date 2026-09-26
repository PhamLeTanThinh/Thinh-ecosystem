import { count, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { certAccessRequests, certInvites } from '@/db/schema'
import { sendLoginLink } from '@/lib/ielts/invite'
import { sendCertsAccessRequestNotice } from '@/lib/ielts/mailer'

// Trần số yêu cầu đang chờ — cùng lý do với ieltsAccessRequests (lib/ielts/invite.ts): chặn spam làm đầy
// bảng và hộp thư của chủ.
const MAX_PENDING_REQUESTS = 100

// Mời 1 email (hoặc cấp lại nếu đã bị thu hồi) xem Certs Hub, dọn yêu cầu chờ duyệt của họ nếu có, và gửi
// luôn magic link — dùng chung sendLoginLink với IELTS (lib/ielts/invite.ts), chỉ khác next='/certs' nên
// thư gửi đúng lời thoại + link đưa họ vào đúng /certs sau khi xác thực.
export async function grantCertsAccess(email: string, origin: string) {
  const [invite] = await db
    .insert(certInvites)
    .values({ email })
    .onConflictDoUpdate({ target: certInvites.email, set: { revokedAt: null } })
    .returning()
  await db.delete(certAccessRequests).where(eq(certAccessRequests.email, email))
  const { sent, link } = await sendLoginLink(email, origin, '/certs')
  return { email: invite.email, invitedAt: invite.invitedAt.toISOString(), revokedAt: null, mailSent: sent, ...(sent ? {} : { loginLink: link }) }
}

// Ghi nhận 1 người lạ xin quyền xem Certs và báo cho chủ — cùng khuôn với requestAccess (IELTS) nhưng ghi
// vào certAccessRequests, không đụng tới bảng của IELTS.
export async function requestCertsAccess(email: string, ownerEmail: string, origin: string) {
  const [{ n }] = await db.select({ n: count() }).from(certAccessRequests).where(eq(certAccessRequests.status, 'pending'))
  if (n >= MAX_PENDING_REQUESTS) return

  const inserted = await db.insert(certAccessRequests).values({ email }).onConflictDoNothing().returning()
  if (inserted.length === 0) return

  try {
    await sendCertsAccessRequestNotice(ownerEmail, email, `${origin}/admin?tab=certs`)
  } catch (err) {
    console.error('[certs access request notice]', err)
  }
}
