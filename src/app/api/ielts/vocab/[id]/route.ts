import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ieltsVocab } from '@/db/schema'
import { requireOwnerApi } from '@/lib/ielts/access'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const { id } = await params
  const patch = await req.json()
  const set: Record<string, unknown> = {}
  for (const key of ['word', 'partOfSpeech', 'meaning', 'example', 'band', 'topic', 'linkedPageId'] as const) {
    if (key in patch) set[key] = patch[key]
  }

  await db.update(ieltsVocab).set(set).where(eq(ieltsVocab.id, id))
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const { id } = await params
  await db.delete(ieltsVocab).where(eq(ieltsVocab.id, id))
  return NextResponse.json({ ok: true })
}
