import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { siteFeedback } from '@/db/schema'

// Danh sách góp ý (tab "Góp ý" trong /admin) — chỉ chủ trang đọc được, xem requireAdminApi ở
// api/admin/feedback/route.ts. Mới nhất lên trước.
export interface FeedbackItem {
  id: string
  message: string
  page: string
  createdAt: string
}

export async function listFeedback(): Promise<FeedbackItem[]> {
  const rows = await db.select().from(siteFeedback).orderBy(desc(siteFeedback.createdAt))
  return rows.map((r) => ({ id: r.id, message: r.message, page: r.page, createdAt: r.createdAt.toISOString() }))
}

export async function deleteFeedback(id: string): Promise<void> {
  await db.delete(siteFeedback).where(eq(siteFeedback.id, id))
}
