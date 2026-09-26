import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { certAccessRequests } from '@/db/schema'
import { requireOwnerApi } from '@/lib/certs/access'
import { grantCertsAccess } from '@/lib/certs/invite'
import { appOrigin } from '@/lib/ielts/invite'

// PATCH { action: 'approve' | 'reject' } — song song với /api/ielts/access-requests/[email]: duyệt = mời +
// gửi magic link (đích /certs), từ chối = đánh dấu 'rejected', giữ lại dòng để họ xin lại cũng không báo chủ nữa.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const { email } = await params
  const target = decodeURIComponent(email).toLowerCase()
  const { action } = await req.json()

  if (action === 'approve') {
    return NextResponse.json(await grantCertsAccess(target, appOrigin(req.url)))
  }
  if (action === 'reject') {
    await db.update(certAccessRequests).set({ status: 'rejected' }).where(eq(certAccessRequests.email, target))
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 })
}
