import { NextRequest, NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { hubAccessRequests } from '@/db/schema'
import { isHubApp } from '@/lib/hub/apps'
import { requireHubOwnerApi } from '@/lib/hub/access'

// Danh sách người lạ đang chờ chủ duyệt xem app (không trả những email đã bị từ chối). Song song với
// GET /api/ielts/access-requests.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ app: string }> }) {
  const { app } = await params
  if (!isHubApp(app)) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const forbidden = await requireHubOwnerApi(app)
  if (forbidden) return forbidden

  const rows = await db
    .select()
    .from(hubAccessRequests)
    .where(and(eq(hubAccessRequests.app, app), eq(hubAccessRequests.status, 'pending')))
    .orderBy(hubAccessRequests.requestedAt)
  return NextResponse.json(rows.map((r) => ({ email: r.email, requestedAt: r.requestedAt.toISOString() })))
}
