import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { and, isNull, notInArray, or, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { koreanCards } from '@/db/schema'
import { getLearnerId } from '@/lib/learner/identity'
import { requireAdminApi } from '@/lib/admin/access'
import type { KoreanCard, KoreanCardKind } from '@/lib/korean/types'

// Bộ thẻ này seed sẵn ~650 thẻ (18 bài Notion) nên PUT ghi theo lô thay vì 1 upsert/thẻ
// (khác convention lib/chinese/storage.ts vốn chỉ có vài chục thẻ) — nếu không, lần hydrate
// đầu tiên phải chờ hàng trăm round-trip DB tuần tự.
const CHUNK_SIZE = 200

function toCard(r: typeof koreanCards.$inferSelect): KoreanCard {
  return {
    id: r.id,
    kind: r.kind as KoreanCardKind,
    lesson: r.lesson,
    front: r.front,
    meaning: r.meaning,
    note: r.note,
    example: r.example,
    theory: r.theory,
    exampleDetail: r.exampleDetail,
    sortOrder: r.sortOrder,
    createdAt: r.createdAt.toISOString(),
  }
}

// Thẻ GỐC (learner_id NULL, dùng chung cho mọi người) + thẻ do CHÍNH hồ sơ đang gọi tự thêm (nếu có hồ sơ).
// Không bao giờ trả thẻ do hồ sơ KHÁC thêm — xem chú thích koreanCards trong db/schema/index.ts.
export async function GET(req: NextRequest) {
  const learnerId = getLearnerId(req)
  const rows = await db
    .select()
    .from(koreanCards)
    .where(learnerId ? or(isNull(koreanCards.learnerId), eq(koreanCards.learnerId, learnerId)) : isNull(koreanCards.learnerId))
  return NextResponse.json(rows.map(toCard))
}

// Thêm 1 thẻ MỚI, gắn với hồ sơ đang gọi — không sửa/xoá được thẻ đã có (kể cả thẻ của chính mình), chỉ
// thêm mới hoặc xoá cả hồ sơ (xem lib/learner/admin.ts deleteLearner). `id` luôn do SERVER tự sinh (bỏ qua
// mọi id client gửi lên) và luôn INSERT (không upsert) — để không có cách nào từ client ghi đè lên 1 thẻ
// đã tồn tại, kể cả thẻ gốc dùng chung.
export async function POST(req: NextRequest) {
  const learnerId = getLearnerId(req)
  if (!learnerId) return NextResponse.json({ error: 'no-profile' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body.front !== 'string' || typeof body.meaning !== 'string') {
    return NextResponse.json({ error: 'front and meaning are required' }, { status: 400 })
  }

  const [row] = await db
    .insert(koreanCards)
    .values({
      id: nanoid(),
      learnerId,
      kind: body.kind === 'grammar' ? 'grammar' : 'vocab',
      lesson: Number.isFinite(body.lesson) ? body.lesson : 1,
      front: body.front,
      meaning: body.meaning,
      note: typeof body.note === 'string' ? body.note : '',
      example: typeof body.example === 'string' ? body.example : '',
      theory: typeof body.theory === 'string' ? body.theory : '',
      exampleDetail: typeof body.exampleDetail === 'string' ? body.exampleDetail : '[]',
      sortOrder: 0,
    })
    .returning()

  return NextResponse.json(toCard(row))
}

// Thay thế TOÀN BỘ thẻ GỐC (bulk) — chỉ chủ trang gọi được (requireAdminApi), dùng để seed lần đầu / quản
// lý nội dung dùng chung. KHÔNG đụng tới thẻ do hồ sơ khách tự thêm (learner_id NOT NULL) — cả DELETE lẫn
// upsert đều chỉ tác động phạm vi thẻ gốc.
export async function PUT(req: NextRequest) {
  const forbidden = await requireAdminApi()
  if (forbidden) return forbidden

  const body: KoreanCard[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = body.map((c) => c.id)
    if (ids.length > 0) {
      await tx.delete(koreanCards).where(and(isNull(koreanCards.learnerId), notInArray(koreanCards.id, ids)))
    } else {
      await tx.delete(koreanCards).where(isNull(koreanCards.learnerId))
    }

    for (let i = 0; i < body.length; i += CHUNK_SIZE) {
      const chunk = body.slice(i, i + CHUNK_SIZE)
      await tx
        .insert(koreanCards)
        .values(
          chunk.map((c) => ({
            id: c.id,
            learnerId: null,
            kind: c.kind,
            lesson: c.lesson,
            front: c.front,
            meaning: c.meaning,
            note: c.note,
            example: c.example,
            theory: c.theory,
            exampleDetail: c.exampleDetail,
            sortOrder: c.sortOrder,
          }))
        )
        .onConflictDoUpdate({
          target: koreanCards.id,
          set: {
            kind: sql`excluded.kind`,
            lesson: sql`excluded.lesson`,
            front: sql`excluded.front`,
            meaning: sql`excluded.meaning`,
            note: sql`excluded.note`,
            example: sql`excluded.example`,
            theory: sql`excluded.theory`,
            exampleDetail: sql`excluded.example_detail`,
            sortOrder: sql`excluded.sort_order`,
          },
        })
    }
  })

  return NextResponse.json({ ok: true })
}
