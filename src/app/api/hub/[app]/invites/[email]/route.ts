import { NextRequest, NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { hubInvites } from '@/db/schema'
import { isHubApp } from '@/lib/hub/apps'
import { requireHubOwnerApi } from '@/lib/hub/access'

type Ctx = { params: Promise<{ app: string; email: string }> }

// PATCH { revoked: true|false } — thu hồi hoặc cấp lại quyền xem app của 1 email, không xoá hẳn dòng.
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { app, email } = await params
  if (!isHubApp(app)) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const forbidden = await requireHubOwnerApi(app)
  if (forbidden) return forbidden

  const { revoked } = await req.json()
  await db
    .update(hubInvites)
    .set({ revokedAt: revoked ? new Date() : null })
    .where(and(eq(hubInvites.app, app), eq(hubInvites.email, decodeURIComponent(email).toLowerCase())))
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { app, email } = await params
  if (!isHubApp(app)) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const forbidden = await requireHubOwnerApi(app)
  if (forbidden) return forbidden

  await db.delete(hubInvites).where(and(eq(hubInvites.app, app), eq(hubInvites.email, decodeURIComponent(email).toLowerCase())))
  return NextResponse.json({ ok: true })
}
