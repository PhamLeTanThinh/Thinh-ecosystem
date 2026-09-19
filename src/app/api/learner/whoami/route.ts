import { NextRequest, NextResponse } from 'next/server'
import { getLearnerId } from '@/lib/learner/identity'
import { hasLearnerData, isRegistered } from '@/lib/learner/registry'

// `registered` = tên này đã được nhận qua sổ đăng ký chưa. false với hồ sơ cũ (mã tự sinh/'legacy' từ
// trước khi có popup hỏi tên) → UI cho phép đặt tên để giữ tiến độ, xem /api/learner/rename.
export async function GET(req: NextRequest) {
  const id = getLearnerId(req)
  if (!id) return NextResponse.json({ id: null, registered: false })
  const registered = await isRegistered(id)
  // Cookie trỏ tới 1 hồ sơ không còn tồn tại (bị chủ xoá, hoặc đã đổi tên ở /admin): không có tên trong sổ và
  // cũng không còn dữ liệu nào để "nhận" → coi như chưa có hồ sơ để hiện popup tạo mới, thay vì popup đặt tên
  // cho 1 hồ sơ rỗng. Hồ sơ cũ CÓ dữ liệu thì vẫn trả về để được đặt tên và giữ tiến độ.
  if (!registered && !(await hasLearnerData(id))) return NextResponse.json({ id: null, registered: false })
  return NextResponse.json({ id, registered })
}
