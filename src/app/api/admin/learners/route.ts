import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin/access'
import { listLearners } from '@/lib/learner/admin'

// Danh sách hồ sơ học (Chinese + Korean) kèm thống kê — chỉ chủ trang.
export async function GET() {
  const forbidden = await requireAdminApi()
  if (forbidden) return forbidden
  return NextResponse.json(await listLearners())
}
