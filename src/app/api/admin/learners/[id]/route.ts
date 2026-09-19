import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin/access'
import { deleteLearner, renameLearner } from '@/lib/learner/admin'
import { USERNAME_RULE_MESSAGE, normalizeUsername } from '@/lib/learner/identity'

// PATCH { username } — đổi tên hồ sơ (chuyển luôn toàn bộ dữ liệu học sang tên mới).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const forbidden = await requireAdminApi()
  if (forbidden) return forbidden

  const { id } = await params
  const body = await req.json().catch(() => null)
  const newId = typeof body?.username === 'string' ? normalizeUsername(body.username) : null
  if (!newId) return NextResponse.json({ error: USERNAME_RULE_MESSAGE }, { status: 400 })

  const result = await renameLearner(decodeURIComponent(id), newId)
  if (result === 'not-found') return NextResponse.json({ error: 'Không tìm thấy hồ sơ này' }, { status: 404 })
  if (result === 'taken') return NextResponse.json({ error: 'Tên này đã có người dùng, hãy chọn tên khác' }, { status: 409 })
  return NextResponse.json({ ok: true, id: newId })
}

// DELETE — xoá hẳn hồ sơ và toàn bộ tiến độ/cài đặt/bộ từ của nó (không khôi phục được).
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const forbidden = await requireAdminApi()
  if (forbidden) return forbidden

  const { id } = await params
  await deleteLearner(decodeURIComponent(id))
  return NextResponse.json({ ok: true })
}
