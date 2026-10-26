import { and, count, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { hubAccessRequests, hubInvites } from '@/db/schema'
import { sendLoginLink } from '@/lib/ielts/invite'
import { sendAppAccessRequestNotice } from '@/lib/ielts/mailer'
import { HUB_APPS, type HubApp } from '@/lib/hub/apps'

// Trần số yêu cầu đang chờ của MỖI app — cùng lý do với ieltsAccessRequests (lib/ielts/invite.ts): chặn spam làm đầy
// bảng và hộp thư của chủ.
const MAX_PENDING_REQUESTS = 100

// Mời 1 email (hoặc cấp lại nếu đã bị thu hồi) xem 1 app, dọn yêu cầu chờ duyệt của họ ở app đó, và gửi luôn magic
// link đưa thẳng vào app — song song với grantCertsAccess (lib/certs/invite.ts).
export async function grantHubAccess(app: HubApp, email: string, origin: string) {
  const [invite] = await db
    .insert(hubInvites)
    .values({ app, email })
    .onConflictDoUpdate({ target: [hubInvites.app, hubInvites.email], set: { revokedAt: null } })
    .returning()
  await db.delete(hubAccessRequests).where(and(eq(hubAccessRequests.app, app), eq(hubAccessRequests.email, email)))
  const { sent, link } = await sendLoginLink(email, origin, HUB_APPS[app].path)
  return { email: invite.email, invitedAt: invite.invitedAt.toISOString(), revokedAt: null, mailSent: sent, ...(sent ? {} : { loginLink: link }) }
}

// Ghi nhận 1 người lạ xin quyền xem 1 app và báo cho chủ — cùng khuôn với requestAccess (IELTS): chỉ báo đúng 1 lần
// cho mỗi email ở mỗi app.
export async function requestHubAccess(app: HubApp, email: string, ownerEmail: string, origin: string) {
  const [{ n }] = await db
    .select({ n: count() })
    .from(hubAccessRequests)
    .where(and(eq(hubAccessRequests.app, app), eq(hubAccessRequests.status, 'pending')))
  if (n >= MAX_PENDING_REQUESTS) return

  const inserted = await db.insert(hubAccessRequests).values({ app, email }).onConflictDoNothing().returning()
  if (inserted.length === 0) return

  try {
    await sendAppAccessRequestNotice(ownerEmail, email, `${origin}/admin?tab=${app}`, HUB_APPS[app].label)
  } catch (err) {
    console.error(`[${app} access request notice]`, err)
  }
}
