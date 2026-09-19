import { NextRequest, NextResponse } from 'next/server'
import { USERNAME_RULE_MESSAGE, normalizeUsername, setLearnerCookie } from '@/lib/learner/identity'
import { isRegistered } from '@/lib/learner/registry'

// Vào lại hồ sơ ĐÃ CÓ (máy/trình duyệt khác, hoặc cookie hết hạn) bằng cách gõ đúng tên. Chỉ nhận tên
// đã được tạo qua /api/learner/create — không tự tạo mới ở đây để gõ nhầm chính tả không vô tình đẻ
// ra 1 hồ sơ rỗng.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const id = typeof body?.username === 'string' ? normalizeUsername(body.username) : null
  if (!id) return NextResponse.json({ error: USERNAME_RULE_MESSAGE }, { status: 400 })

  if (!(await isRegistered(id))) {
    return NextResponse.json({ error: 'Chưa có hồ sơ nào tên này — kiểm tra lại chính tả hoặc tạo hồ sơ mới' }, { status: 404 })
  }

  const res = NextResponse.json({ ok: true, id })
  setLearnerCookie(res, id)
  return res
}
