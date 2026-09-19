import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ieltsAccessRequests } from '@/db/schema'
import { requireOwnerApi } from '@/lib/ielts/access'

// Danh sách người lạ đang chờ chủ duyệt (không trả những email đã bị từ chối).
export async function GET() {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const rows = await db.select().from(ieltsAccessRequests).where(eq(ieltsAccessRequests.status, 'pending')).orderBy(ieltsAccessRequests.requestedAt)
  return NextResponse.json(rows.map((r) => ({ email: r.email, requestedAt: r.requestedAt.toISOString() })))
}
