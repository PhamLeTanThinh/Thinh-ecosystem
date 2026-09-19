import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { and, isNull, notInArray, or, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { chineseCards } from '@/db/schema'
import { getLearnerId } from '@/lib/learner/identity'
import { requireAdminApi } from '@/lib/admin/access'
import type { ChineseCard, ChineseCardKind } from '@/lib/chinese/types'

function toCard(r: typeof chineseCards.$inferSelect): ChineseCard {
  return {
    id: r.id,
    kind: r.kind as ChineseCardKind,
    lesson: r.lesson,
    hanzi: r.hanzi,
    pinyin: r.pinyin,
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
// Không bao giờ trả thẻ do hồ sơ KHÁC thêm — xem chú thích chineseCards trong db/schema/index.ts.
export async function GET(req: NextRequest) {
  const learnerId = getLearnerId(req)
  const rows = await db
    .select()
    .from(chineseCards)
    .where(learnerId ? or(isNull(chineseCards.learnerId), eq(chineseCards.learnerId, learnerId)) : isNull(chineseCards.learnerId))
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
  if (!body || typeof body.hanzi !== 'string' || typeof body.meaning !== 'string') {
    return NextResponse.json({ error: 'hanzi and meaning are required' }, { status: 400 })
  }

  const [row] = await db
    .insert(chineseCards)
    .values({
      id: nanoid(),
      learnerId,
      kind: body.kind === 'grammar' ? 'grammar' : 'vocab',
      lesson: Number.isFinite(body.lesson) ? body.lesson : 0,
      hanzi: body.hanzi,
      pinyin: typeof body.pinyin === 'string' ? body.pinyin : '',
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

  const body: ChineseCard[] = await req.json()

  await db.transaction(async (tx) => {
    const ids = body.map((c) => c.id)
    if (ids.length > 0) {
      await tx.delete(chineseCards).where(and(isNull(chineseCards.learnerId), notInArray(chineseCards.id, ids)))
    } else {
      await tx.delete(chineseCards).where(isNull(chineseCards.learnerId))
    }

    for (const c of body) {
      await tx
        .insert(chineseCards)
        .values({
          id: c.id,
          learnerId: null,
          kind: c.kind,
          lesson: c.lesson,
          hanzi: c.hanzi,
          pinyin: c.pinyin,
          meaning: c.meaning,
          note: c.note,
          example: c.example,
          theory: c.theory,
          exampleDetail: c.exampleDetail,
          sortOrder: c.sortOrder,
        })
        .onConflictDoUpdate({
          target: chineseCards.id,
          set: {
            kind: sql`excluded.kind`,
            lesson: sql`excluded.lesson`,
            hanzi: sql`excluded.hanzi`,
            pinyin: sql`excluded.pinyin`,
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
