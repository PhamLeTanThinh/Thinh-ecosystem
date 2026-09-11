import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ieltsPages } from '@/db/schema'
import type { IeltsPage } from '@/lib/ielts/types'
import { requireAnyAccessApi, requireOwnerApi } from '@/lib/ielts/access'

// ?meta=1 bỏ qua cột `content` (rich text HTML, có trang 60-100KB+) — sidebar chỉ cần
// id/title/skill/sortOrder để vẽ danh sách, không cần đợi tải nội dung đầy đủ của MỌI trang mới
// hiện được menu. Nội dung đầy đủ vẫn được store tải tiếp ở background (xem store.ts hydrate()).
export async function GET(req: NextRequest) {
  const forbidden = await requireAnyAccessApi()
  if (forbidden) return forbidden

  const meta = req.nextUrl.searchParams.get('meta') === '1'

  if (meta) {
    const rows = await db
      .select({
        id: ieltsPages.id,
        skill: ieltsPages.skill,
        title: ieltsPages.title,
        sortOrder: ieltsPages.sortOrder,
        createdAt: ieltsPages.createdAt,
        updatedAt: ieltsPages.updatedAt,
      })
      .from(ieltsPages)
    const pages: IeltsPage[] = rows.map((r) => ({
      id: r.id,
      skill: r.skill as IeltsPage['skill'],
      title: r.title,
      content: '',
      sortOrder: r.sortOrder,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }))
    return NextResponse.json(pages)
  }

  const rows = await db.select().from(ieltsPages)
  const pages: IeltsPage[] = rows.map((r) => ({
    id: r.id,
    skill: r.skill as IeltsPage['skill'],
    title: r.title,
    content: r.content,
    sortOrder: r.sortOrder,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }))
  return NextResponse.json(pages)
}

export async function POST(req: NextRequest) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const p: IeltsPage = await req.json()
  await db.insert(ieltsPages).values({
    id: p.id,
    skill: p.skill,
    title: p.title,
    content: p.content,
    sortOrder: p.sortOrder,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
  })
  return NextResponse.json(p)
}
