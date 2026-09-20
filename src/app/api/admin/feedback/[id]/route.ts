import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin/access'
import { deleteFeedback } from '@/lib/feedback/admin'

// DELETE — xoá 1 góp ý đã đọc xong, không khôi phục được.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const forbidden = await requireAdminApi()
  if (forbidden) return forbidden

  const { id } = await params
  await deleteFeedback(decodeURIComponent(id))
  return NextResponse.json({ ok: true })
}
