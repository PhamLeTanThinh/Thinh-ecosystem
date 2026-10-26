import { cookies } from 'next/headers'
import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hubInvites } from '@/db/schema'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/ielts/session'
import { HUB_APPS, type HubApp } from '@/lib/hub/apps'

// Quyền vào Project Manager / IT Hub — song song với lib/ielts/access.ts và lib/certs/access.ts: cùng magic link +
// session cookie (lib/ielts/session.ts), cùng chủ trang (IELTS_OWNER_EMAIL), chỉ khác bảng invites được tra
// (hubInvites, lọc theo app). Được mời xem 1 app không tự có quyền xem app khác.
async function getSessionEmail(): Promise<string | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)?.email ?? null
}

export type HubAccess = { mode: 'owner'; email: string | null } | { mode: 'viewer'; email: string } | { mode: 'denied' }

// Chưa đặt IELTS_OWNER_EMAIL = chưa bật chia sẻ ra ngoài cho cả hệ thống — mọi request đều coi là chủ, y như IELTS.
export async function getHubAccess(app: HubApp): Promise<HubAccess> {
  const ownerEmail = process.env.IELTS_OWNER_EMAIL
  if (!ownerEmail) return { mode: 'owner', email: null }

  const email = await getSessionEmail()
  if (!email) return { mode: 'denied' }
  if (email.toLowerCase() === ownerEmail.toLowerCase()) return { mode: 'owner', email }

  const [invite] = await db
    .select()
    .from(hubInvites)
    .where(and(eq(hubInvites.app, app), eq(hubInvites.email, email.toLowerCase())))
  if (invite && !invite.revokedAt) return { mode: 'viewer', email }
  return { mode: 'denied' }
}

// Dùng ở đầu mọi PAGE (server component) của app — layout (protected) chặn giao diện nhưng không chặn được dữ liệu
// của page (lý do xem assertIeltsAccess trong lib/ielts/access.ts).
export async function assertHubAccess(app: HubApp): Promise<void> {
  if ((await getHubAccess(app)).mode === 'denied') redirect(`${HUB_APPS[app].path}/login`)
}

// Dùng ở đầu các Route Handler quản lý /api/hub/[app]/{invites,access-requests,access-logs} — 403 nếu không phải chủ.
export async function requireHubOwnerApi(app: HubApp): Promise<NextResponse | null> {
  if ((await getHubAccess(app)).mode === 'owner') return null
  return NextResponse.json({ error: 'forbidden — chỉ chủ trang mới có quyền' }, { status: 403 })
}

// Dùng ở đầu Route Handler trả nội dung của app (vd /api/papers/[slug] của IT Hub) — 403 nếu không được mời.
export async function requireHubAccessApi(app: HubApp): Promise<NextResponse | null> {
  if ((await getHubAccess(app)).mode !== 'denied') return null
  return NextResponse.json({ error: 'forbidden — cần đăng nhập bằng email được mời' }, { status: 403 })
}
