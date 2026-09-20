import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin/access'
import { listFeedback } from '@/lib/feedback/admin'

// Danh sách góp ý gửi qua DonateWidget (tab "Góp ý") — chỉ chủ trang.
export async function GET() {
  const forbidden = await requireAdminApi()
  if (forbidden) return forbidden
  return NextResponse.json(await listFeedback())
}
