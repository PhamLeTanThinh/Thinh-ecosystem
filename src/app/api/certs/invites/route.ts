import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { certInvites } from '@/db/schema'
import { requireOwnerApi } from '@/lib/certs/access'
import { grantCertsAccess } from '@/lib/certs/invite'
import { appOrigin } from '@/lib/ielts/invite'

export async function GET() {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const rows = await db.select().from(certInvites).orderBy(certInvites.invitedAt)
  return NextResponse.json(
    rows.map((r) => ({
      email: r.email,
      invitedAt: r.invitedAt.toISOString(),
      revokedAt: r.revokedAt ? r.revokedAt.toISOString() : null,
    })),
  )
}

// Thêm 1 email vào danh sách mời xem Certs VÀ gửi luôn magic link đăng nhập cho họ — song song với
// POST /api/ielts/invites.
export async function POST(req: NextRequest) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const { email } = await req.json()
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }
  return NextResponse.json(await grantCertsAccess(email.trim().toLowerCase(), appOrigin(req.url)))
}
