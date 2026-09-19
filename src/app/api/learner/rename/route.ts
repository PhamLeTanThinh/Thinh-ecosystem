import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { learnerProfiles } from '@/db/schema'
import { moveLearnerData } from '@/lib/learner/admin'
import { USERNAME_RULE_MESSAGE, getLearnerId, normalizeUsername, setLearnerCookie } from '@/lib/learner/identity'
import { isLearnerIdTaken, isRegistered } from '@/lib/learner/registry'

const NAME_TAKEN = 'NAME_TAKEN'
const TAKEN_MESSAGE = 'Tên này đã có người dùng, hãy chọn tên khác'

// CHỈ dành cho hồ sơ CŨ chưa có tên (mã tự sinh từ bản trước, hoặc 'legacy'): đặt tên và CHUYỂN toàn
// bộ dữ liệu học (tiến độ/cài đặt/bộ từ của cả Chinese lẫn Korean) sang tên mới để không mất tiến độ.
// Hồ sơ đã có tên rồi thì không cho đổi tiếp — muốn dùng hồ sơ khác thì đăng xuất và tạo/đăng nhập lại.
export async function POST(req: NextRequest) {
  const oldId = getLearnerId(req)
  if (!oldId) return NextResponse.json({ error: 'no-profile' }, { status: 401 })
  if (await isRegistered(oldId)) {
    return NextResponse.json({ error: 'Hồ sơ này đã có tên rồi' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  const newId = typeof body?.username === 'string' ? normalizeUsername(body.username) : null
  if (!newId) return NextResponse.json({ error: USERNAME_RULE_MESSAGE }, { status: 400 })

  // Giữ nguyên tên cũ (vd 'legacy') mà chỉ "đăng ký" nó thì không coi là trùng với chính mình.
  if (newId !== oldId && (await isLearnerIdTaken(newId))) {
    return NextResponse.json({ error: TAKEN_MESSAGE }, { status: 409 })
  }

  try {
    await db.transaction(async (tx) => {
      const [claim] = await tx.insert(learnerProfiles).values({ id: newId }).onConflictDoNothing().returning()
      if (!claim) throw new Error(NAME_TAKEN)
      if (newId === oldId) return

      await moveLearnerData(tx, oldId, newId)
    })
  } catch (err) {
    if (err instanceof Error && err.message === NAME_TAKEN) {
      return NextResponse.json({ error: TAKEN_MESSAGE }, { status: 409 })
    }
    throw err
  }

  const res = NextResponse.json({ ok: true, id: newId })
  setLearnerCookie(res, newId)
  return res
}
