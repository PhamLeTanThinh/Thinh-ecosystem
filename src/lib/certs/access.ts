import { cookies } from 'next/headers'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { certInvites } from '@/db/schema'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/ielts/session'

// Quyền vào Certs Hub — cùng cơ chế đăng nhập (magic link + session cookie, xem lib/ielts/session.ts) và cùng
// 1 "chủ trang" (IELTS_OWNER_EMAIL — dùng chung biến với IELTS/Admin, đây là chủ của cả hệ thống chứ không
// riêng app nào) với IELTS, nhưng danh sách người được mời XEM tách riêng (bảng certInvites, không phải
// ieltsInvites) — được mời xem IELTS không tự có quyền xem Certs và ngược lại. Xem lib/ielts/access.ts để
// so sánh: hai file gần như song song nhau, chỉ khác bảng invites nào được tra.
async function getSessionEmail(): Promise<string | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)?.email ?? null
}

export type CertsAccess = { mode: 'owner'; email: string | null } | { mode: 'viewer'; email: string } | { mode: 'denied' }

// Chưa đặt IELTS_OWNER_EMAIL = chưa bật chia sẻ ra ngoài cho cả hệ thống — mọi request đều coi là chủ, giữ
// đúng hành vi cũ (dùng local, không cần đăng nhập gì), y như IELTS.
export async function getCertsAccess(): Promise<CertsAccess> {
  const ownerEmail = process.env.IELTS_OWNER_EMAIL
  if (!ownerEmail) return { mode: 'owner', email: null }

  const email = await getSessionEmail()
  if (!email) return { mode: 'denied' }
  if (email.toLowerCase() === ownerEmail.toLowerCase()) return { mode: 'owner', email }

  const [invite] = await db.select().from(certInvites).where(eq(certInvites.email, email.toLowerCase()))
  if (invite && !invite.revokedAt) return { mode: 'viewer', email }
  return { mode: 'denied' }
}

// Dùng ở đầu mọi PAGE (server component) trả dữ liệu đề luyện. Layout (protected) đã hiện màn khoá cho
// người chưa đăng nhập, nhưng KHÔNG đủ để chặn dữ liệu — lý do xem lib/ielts/access.ts (assertIeltsAccess).
export async function assertCertsAccess(): Promise<void> {
  if ((await getCertsAccess()).mode === 'denied') notFound()
}

export async function isCertsOwner(): Promise<boolean> {
  return (await getCertsAccess()).mode === 'owner'
}

// Dùng ở đầu mọi Route Handler ghi dữ liệu /api/certs/{invites,access-requests,access-logs}/* — 403 nếu
// không phải chủ. (Không áp cho /api/certs/{progress,attempts} — tiến độ luyện đề của từng learnerId,
// không liên quan quyền xem Certs.)
export async function requireOwnerApi(): Promise<NextResponse | null> {
  if (await isCertsOwner()) return null
  return NextResponse.json({ error: 'forbidden — chỉ chủ trang mới có quyền' }, { status: 403 })
}
