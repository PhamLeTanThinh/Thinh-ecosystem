import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { certGrants } from '@/db/schema'
import { requireOwnerApi } from '@/lib/certs/access'
import { CERT_OPTIONS, cleanCertIds, getDefaultVisibleCerts, setCertGrant, setDefaultVisibleCerts } from '@/lib/certs/visibility'

const SUBJECT_RE = /^(email:[^\s@]+@[^\s@]+\.[^\s@]+|learner:[a-z][a-z0-9_-]{2,23})$/

// Bảng "Ai được xem cert nào" ở tab Certs của /admin — chỉ chủ trang. Xem lib/certs/visibility.ts.
export async function GET() {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden
  const [defaults, rows] = await Promise.all([getDefaultVisibleCerts(), db.select().from(certGrants)])
  return NextResponse.json({
    certs: CERT_OPTIONS,
    defaults,
    grants: Object.fromEntries(rows.map((r) => [r.subject, r.certs])),
  })
}

// body: { subject: 'default' | 'email:<email>' | 'learner:<id>', certs: string[] } — ghi đè cả danh sách.
export async function PUT(req: NextRequest) {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden
  const body = await req.json().catch(() => null)
  const subject = typeof body?.subject === 'string' ? body.subject.trim().toLowerCase() : ''
  const certs = cleanCertIds(body?.certs)
  if (!certs || (subject !== 'default' && !SUBJECT_RE.test(subject))) return NextResponse.json({ error: 'bad-request' }, { status: 400 })

  if (subject === 'default') await setDefaultVisibleCerts(certs)
  else await setCertGrant(subject, certs)
  return NextResponse.json({ subject, certs })
}
