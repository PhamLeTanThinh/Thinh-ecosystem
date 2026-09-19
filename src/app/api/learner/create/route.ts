import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { learnerProfiles } from '@/db/schema'
import { USERNAME_RULE_MESSAGE, normalizeUsername, setLearnerCookie } from '@/lib/learner/identity'
import { isLearnerIdTaken } from '@/lib/learner/registry'

const TAKEN_MESSAGE = 'Tên này đã có người dùng, hãy chọn tên khác'

// Tạo hồ sơ MỚI cho người vào app lần đầu. Từ chối nếu tên đã có người nhận — không có mật khẩu để
// phân xử "đúng chủ" hay chưa, nên tên đã tồn tại luôn coi là của người khác (muốn vào lại hồ sơ cũ
// thì dùng /api/learner/login).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const id = typeof body?.username === 'string' ? normalizeUsername(body.username) : null
  if (!id) return NextResponse.json({ error: USERNAME_RULE_MESSAGE }, { status: 400 })

  if (await isLearnerIdTaken(id)) return NextResponse.json({ error: TAKEN_MESSAGE }, { status: 409 })

  // INSERT ràng buộc UNIQUE = atomic: 2 người tạo cùng 1 tên gần như cùng lúc thì chỉ 1 người thành công.
  const [claim] = await db.insert(learnerProfiles).values({ id }).onConflictDoNothing().returning()
  if (!claim) return NextResponse.json({ error: TAKEN_MESSAGE }, { status: 409 })

  const res = NextResponse.json({ ok: true, id })
  setLearnerCookie(res, id)
  return res
}
