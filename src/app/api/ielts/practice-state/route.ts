import { NextRequest, NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { ieltsPracticeState } from '@/db/schema'
import { getIeltsAccess } from '@/lib/ielts/access'
import { PRACTICE_KEYS } from '@/lib/ielts/practiceSync'

// Trạng thái luyện đề IELTS của ĐÚNG người đang đăng nhập (email trong session; chưa bật chia sẻ thì dùng
// chung 1 khoá 'owner'). Cả chủ lẫn người được mời đều đọc/ghi được phần của mình — không đụng dữ liệu
// nội dung như các route ghi khác, nên không cần requireOwnerApi.
const ALLOWED_KEYS: string[] = Object.values(PRACTICE_KEYS)
const MAX_VALUE_BYTES = 500_000

async function ownerKey(): Promise<string | null> {
  const access = await getIeltsAccess()
  if (access.mode === 'denied') return null
  return access.email ? access.email.toLowerCase() : 'owner'
}

export async function GET() {
  const owner = await ownerKey()
  if (!owner) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const rows = await db.select().from(ieltsPracticeState).where(eq(ieltsPracticeState.ownerKey, owner))
  const out: Record<string, { value: unknown; updatedAt: number }> = {}
  for (const r of rows) out[r.key] = { value: r.value, updatedAt: r.updatedAt.getTime() }
  return NextResponse.json(out)
}

export async function PUT(req: NextRequest) {
  const owner = await ownerKey()
  if (!owner) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const body = await req.json().catch(() => null)
  const { key, value, updatedAt } = body ?? {}
  if (
    typeof key !== 'string' || !ALLOWED_KEYS.includes(key) ||
    value === null || typeof value !== 'object' ||
    !Number.isFinite(updatedAt) || updatedAt <= 0 ||
    JSON.stringify(value).length > MAX_VALUE_BYTES
  ) {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 })
  }
  const at = new Date(Math.min(updatedAt, Date.now() + 60_000)) // không tin mốc giờ ở tương lai xa
  // Bản cũ hơn bản đang có trên DB thì bỏ qua (last-write-wins theo mốc sửa của client).
  await db
    .insert(ieltsPracticeState)
    .values({ ownerKey: owner, key, value, updatedAt: at })
    .onConflictDoUpdate({
      target: [ieltsPracticeState.ownerKey, ieltsPracticeState.key],
      set: { value, updatedAt: at },
      setWhere: sql`${ieltsPracticeState.updatedAt} <= ${at}`,
    })
  return NextResponse.json({ ok: true })
}
