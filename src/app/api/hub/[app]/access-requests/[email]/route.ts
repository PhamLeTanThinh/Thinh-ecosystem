import { NextRequest, NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { hubAccessRequests } from '@/db/schema'
import { isHubApp } from '@/lib/hub/apps'
import { requireHubOwnerApi } from '@/lib/hub/access'
import { grantHubAccess } from '@/lib/hub/invite'
import { appOrigin } from '@/lib/ielts/invite'

// PATCH { action: 'approve' | 'reject' } — song song với /api/ielts/access-requests/[email]: duyệt = mời + gửi magic
// link vào đúng app, từ chối = đánh dấu 'rejected', giữ lại dòng để họ xin lại cũng không báo chủ nữa.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ app: string; email: string }> }) {
  const { app, email } = await params
  if (!isHubApp(app)) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const forbidden = await requireHubOwnerApi(app)
  if (forbidden) return forbidden

  const target = decodeURIComponent(email).toLowerCase()
  const { action } = await req.json()

  if (action === 'approve') {
    return NextResponse.json(await grantHubAccess(app, target, appOrigin(req.url)))
  }
  if (action === 'reject') {
    await db
      .update(hubAccessRequests)
      .set({ status: 'rejected' })
      .where(and(eq(hubAccessRequests.app, app), eq(hubAccessRequests.email, target)))
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 })
}
