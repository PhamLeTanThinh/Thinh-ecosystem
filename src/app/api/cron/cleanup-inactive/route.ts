import { NextRequest, NextResponse } from 'next/server'
import { getAdminAccess } from '@/lib/admin/access'
import { findInactive, purgeInactive } from '@/lib/admin/inactive'

// Vercel Cron gọi mỗi tuần 1 lần (vercel.json) kèm header `Authorization: Bearer <CRON_SECRET>` — xoá hẳn người
// quá 30 ngày không hoạt động, xem lib/admin/inactive.ts.
// ?dry=1: chỉ liệt kê ai SẼ bị xoá, không xoá gì — chủ trang (đăng nhập /admin) gọi được để xem trước.
export async function GET(req: NextRequest) {
  const dry = req.nextUrl.searchParams.get('dry') === '1'
  const secret = process.env.CRON_SECRET
  const fromCron = Boolean(secret) && req.headers.get('authorization') === `Bearer ${secret}`
  if (!fromCron && !(dry && (await getAdminAccess()).ok)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const report = dry ? await findInactive() : await purgeInactive()
  if (!dry) {
    console.log(`[cleanup-inactive] xoá ${report.ielts.length} IELTS, ${report.certs.length} Certs, ${report.learners.length} hồ sơ học`, report)
  }
  return NextResponse.json({ dry, ...report })
}
