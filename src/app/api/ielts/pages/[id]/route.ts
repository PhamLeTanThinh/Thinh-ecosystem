import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ieltsPages } from '@/db/schema'
import { requireOwnerApi } from '@/lib/ielts/access'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const { id } = await params
  const patch = await req.json()
  const set: Record<string, unknown> = { updatedAt: new Date() }
  if (typeof patch.title === 'string') set.title = patch.title
  if (typeof patch.content === 'string') set.content = patch.content
  if (typeof patch.sortOrder === 'number') set.sortOrder = patch.sortOrder

  await db.update(ieltsPages).set(set).where(eq(ieltsPages.id, id))
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const { id } = await params
  await db.delete(ieltsPages).where(eq(ieltsPages.id, id))
  return NextResponse.json({ ok: true })
}
