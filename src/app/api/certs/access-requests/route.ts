import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { certAccessRequests } from '@/db/schema'
import { requireOwnerApi } from '@/lib/certs/access'

// Danh sách người lạ đang chờ chủ duyệt xem Certs (không trả những email đã bị từ chối). Song song với
// GET /api/ielts/access-requests.
export async function GET() {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const rows = await db.select().from(certAccessRequests).where(eq(certAccessRequests.status, 'pending')).orderBy(certAccessRequests.requestedAt)
  return NextResponse.json(rows.map((r) => ({ email: r.email, requestedAt: r.requestedAt.toISOString() })))
}
