import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin/access'
import { practiceSummaries } from '@/lib/ielts/adminPractice'

// Tóm tắt dữ liệu luyện đề IELTS của từng người (email → kết quả đề, bài làm dở, từ vựng…) — chỉ chủ trang.
export async function GET() {
  const forbidden = await requireAdminApi()
  if (forbidden) return forbidden
  return NextResponse.json(await practiceSummaries())
}
