import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ieltsAccessRequests } from '@/db/schema'
import { requireOwnerApi } from '@/lib/ielts/access'
import { appOrigin, grantAccess } from '@/lib/ielts/invite'

// PATCH { action: 'approve' | 'reject' } — duyệt = mời + gửi magic link cho họ (trả về dòng invite
// mới); từ chối = đánh dấu 'rejected', giữ lại dòng để họ xin lại cũng không báo chủ nữa.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const { email } = await params
  const target = decodeURIComponent(email).toLowerCase()
  const { action } = await req.json()

  if (action === 'approve') {
    return NextResponse.json(await grantAccess(target, appOrigin(req.url)))
  }
  if (action === 'reject') {
    await db.update(ieltsAccessRequests).set({ status: 'rejected' }).where(eq(ieltsAccessRequests.email, target))
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 })
}
