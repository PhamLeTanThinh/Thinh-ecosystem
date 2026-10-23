import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { certGrants, certInvites } from '@/db/schema'
import { requireOwnerApi } from '@/lib/certs/access'
import { emailSubject } from '@/lib/certs/visibility'

// PATCH { revoked: true|false } — thu hồi hoặc cấp lại quyền xem Certs của 1 email, không xoá hẳn dòng.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const { email } = await params
  const { revoked } = await req.json()
  await db
    .update(certInvites)
    .set({ revokedAt: revoked ? new Date() : null })
    .where(eq(certInvites.email, decodeURIComponent(email).toLowerCase()))
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const { email } = await params
  const normalized = decodeURIComponent(email).toLowerCase()
  await db.delete(certInvites).where(eq(certInvites.email, normalized))
  // Quyền xem cert riêng của email này (lib/certs/visibility.ts) cũng bỏ theo.
  await db.delete(certGrants).where(eq(certGrants.subject, emailSubject(normalized)))
  return NextResponse.json({ ok: true })
}
