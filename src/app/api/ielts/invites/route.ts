import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ieltsInvites } from '@/db/schema'
import { requireOwnerApi } from '@/lib/ielts/access'
import { appOrigin, grantAccess } from '@/lib/ielts/invite'

export async function GET() {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const rows = await db.select().from(ieltsInvites).orderBy(ieltsInvites.invitedAt)
  return NextResponse.json(
    rows.map((r) => ({
      email: r.email,
      invitedAt: r.invitedAt.toISOString(),
      revokedAt: r.revokedAt ? r.revokedAt.toISOString() : null,
    })),
  )
}

// Thêm 1 email vào danh sách mời VÀ gửi luôn magic link đăng nhập cho họ trong cùng 1 lần bấm —
// đúng luồng "nhập email → họ nhận được mail" mà chủ mô tả, không cần bước riêng.
export async function POST(req: NextRequest) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const { email } = await req.json()
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }
  return NextResponse.json(await grantAccess(email.trim().toLowerCase(), appOrigin(req.url)))
}
