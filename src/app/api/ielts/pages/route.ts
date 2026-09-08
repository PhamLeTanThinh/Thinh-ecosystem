import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ieltsPages } from '@/db/schema'
import type { IeltsPage } from '@/lib/ielts/types'
import { requireAnyAccessApi, requireOwnerApi } from '@/lib/ielts/access'

export async function GET() {
  const forbidden = await requireAnyAccessApi()
  if (forbidden) return forbidden

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
