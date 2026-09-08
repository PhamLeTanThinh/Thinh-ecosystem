import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ieltsVocab } from '@/db/schema'
import type { VocabEntry } from '@/lib/ielts/types'
import { requireAnyAccessApi, requireOwnerApi } from '@/lib/ielts/access'

export async function GET() {
  const forbidden = await requireAnyAccessApi()
  if (forbidden) return forbidden

  const rows = await db.select().from(ieltsVocab)
  const vocab: VocabEntry[] = rows.map((r) => ({
    id: r.id,
    word: r.word,
    partOfSpeech: r.partOfSpeech,
    meaning: r.meaning,
    example: r.example,
    band: r.band,
    topic: r.topic,
    linkedPageId: r.linkedPageId,
    createdAt: r.createdAt.toISOString(),
  }))
  return NextResponse.json(vocab)
}

export async function POST(req: NextRequest) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const v: VocabEntry = await req.json()
  await db.insert(ieltsVocab).values({
    id: v.id,
    word: v.word,
    partOfSpeech: v.partOfSpeech,
    meaning: v.meaning,
    example: v.example,
    band: v.band,
    topic: v.topic,
    linkedPageId: v.linkedPageId,
    createdAt: new Date(v.createdAt),
  })
  return NextResponse.json(v)
}
