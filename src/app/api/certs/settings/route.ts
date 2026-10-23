import { NextRequest, NextResponse } from 'next/server'
import { requireOwnerApi } from '@/lib/certs/access'
import { getCertsAccessMode, setCertsAccessMode } from '@/lib/certs/settings'

// Công tắc "cách vào Certs Hub" ở tab Certs của /admin — chỉ chủ trang đọc/ghi được.
export async function GET() {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden
  return NextResponse.json({ accessMode: await getCertsAccessMode() })
}

export async function PATCH(req: NextRequest) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden
  const body = await req.json().catch(() => null)
  const mode = body?.accessMode
  if (mode !== 'verified' && mode !== 'profile') return NextResponse.json({ error: 'bad-request' }, { status: 400 })
  await setCertsAccessMode(mode)
  return NextResponse.json({ accessMode: mode })
}
