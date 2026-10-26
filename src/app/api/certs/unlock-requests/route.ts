import { NextRequest, NextResponse } from 'next/server'
import { getCertsAccess, requireOwnerApi } from '@/lib/certs/access'
import { getCertSubject } from '@/lib/certs/subject'
import { approveCertUnlock, listPendingUnlocks, rejectCertUnlock, requestCertUnlock } from '@/lib/certs/unlock'
import { CERT_OPTIONS, canSeeCert } from '@/lib/certs/visibility'
import { appOrigin } from '@/lib/ielts/invite'

const SUBJECT_RE = /^(email:[^\s@]+@[^\s@]+\.[^\s@]+|learner:[a-z][a-z0-9_-]{2,23})$/
const isCertId = (v: unknown): v is string => typeof v === 'string' && CERT_OPTIONS.some((c) => c.id === v)

// Xin mở từng cert — xem lib/certs/unlock.ts.
// GET (chủ trang): danh sách yêu cầu đang chờ cho tab Certs của /admin.
export async function GET() {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden
  return NextResponse.json(await listPendingUnlocks())
}

// POST { certId, fullName } (người xem đã vào được Certs): xin quyền xem 1 cert đang khoá, kèm họ tên đầy đủ.
export async function POST(req: NextRequest) {
  const access = await getCertsAccess()
  if (access.mode === 'denied') return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const body = await req.json().catch(() => null)
  if (!isCertId(body?.certId)) return NextResponse.json({ error: 'bad-request' }, { status: 400 })
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim().replace(/\s+/g, ' ') : ''
  if (fullName.length < 2 || fullName.length > 80) return NextResponse.json({ error: 'full-name' }, { status: 400 })
  if (await canSeeCert(access, body.certId)) return NextResponse.json({ status: 'granted' })

  const subject = await getCertSubject(access)
  // Chế độ chỉ cần hồ sơ mà chưa tạo hồ sơ học: chưa biết ai để mở quyền cho.
  if (!subject) return NextResponse.json({ error: 'no-profile' }, { status: 409 })
  await requestCertUnlock(subject, body.certId, fullName, appOrigin(req.url))
  return NextResponse.json({ status: 'pending' })
}

// PATCH { subject, certId, action: 'approve' | 'reject' } (chủ trang).
export async function PATCH(req: NextRequest) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden
  const body = await req.json().catch(() => null)
  const subject = typeof body?.subject === 'string' ? body.subject : ''
  if (!SUBJECT_RE.test(subject) || !isCertId(body?.certId)) return NextResponse.json({ error: 'bad-request' }, { status: 400 })

  if (body.action === 'approve') await approveCertUnlock(subject, body.certId)
  else if (body.action === 'reject') await rejectCertUnlock(subject, body.certId)
  else return NextResponse.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 })
  return NextResponse.json({ ok: true })
}
