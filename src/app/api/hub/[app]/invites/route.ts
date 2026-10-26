import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { hubInvites } from '@/db/schema'
import { isHubApp } from '@/lib/hub/apps'
import { requireHubOwnerApi } from '@/lib/hub/access'
import { grantHubAccess } from '@/lib/hub/invite'
import { appOrigin } from '@/lib/ielts/invite'

type Ctx = { params: Promise<{ app: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { app } = await params
  if (!isHubApp(app)) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const forbidden = await requireHubOwnerApi(app)
  if (forbidden) return forbidden

  const rows = await db.select().from(hubInvites).where(eq(hubInvites.app, app)).orderBy(hubInvites.invitedAt)
  return NextResponse.json(
    rows.map((r) => ({
      email: r.email,
      invitedAt: r.invitedAt.toISOString(),
      revokedAt: r.revokedAt ? r.revokedAt.toISOString() : null,
    })),
  )
}

// Thêm 1 email vào danh sách mời của app VÀ gửi luôn magic link đăng nhập cho họ — song song với POST /api/ielts/invites.
export async function POST(req: NextRequest, { params }: Ctx) {
  const { app } = await params
  if (!isHubApp(app)) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const forbidden = await requireHubOwnerApi(app)
  if (forbidden) return forbidden

  const { email } = await req.json()
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }
  return NextResponse.json(await grantHubAccess(app, email.trim().toLowerCase(), appOrigin(req.url)))
}
