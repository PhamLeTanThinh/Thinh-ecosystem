import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ieltsInvites } from '@/db/schema'
import { requireOwnerApi } from '@/lib/ielts/access'

// PATCH { revoked: true|false } — thu hồi hoặc cấp lại quyền xem của 1 email, không xoá hẳn dòng.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const { email } = await params
  const { revoked } = await req.json()
  await db
    .update(ieltsInvites)
    .set({ revokedAt: revoked ? new Date() : null })
    .where(eq(ieltsInvites.email, decodeURIComponent(email).toLowerCase()))
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const { email } = await params
  await db.delete(ieltsInvites).where(eq(ieltsInvites.email, decodeURIComponent(email).toLowerCase()))
  return NextResponse.json({ ok: true })
}
