'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAdminAction, type ActionResult } from '@/components/admin/AdminDialog'
import { formatAdminDate } from '@/components/admin/format'
import { MascotEm } from '@/components/mascot/MascotDialog'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface Invite {
  email: string
  invitedAt: string
  revokedAt: string | null
}

interface AccessRequest {
  email: string
  requestedAt: string
}

interface AccessStat {
  email: string
  count: number
  lastSeenAt: string
  lastBrowser: string
}


// Tab "Người xem Certs" của trang /admin — song song với IeltsAccessAdmin.tsx (đọc file đó để biết đầy đủ
// từng nhánh xử lý), chỉ đổi endpoint sang /api/certs/*. Danh sách người mời TÁCH RIÊNG khỏi IELTS: được
// mời xem IELTS không tự có quyền xem Certs và ngược lại — xem lib/certs/access.ts.
export function CertsAccessAdmin({ ownerEmail }: { ownerEmail: string | null }) {
  const runAction = useAdminAction()
  const [invites, setInvites] = useState<Invite[]>([])
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [stats, setStats] = useState<AccessStat[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/certs/invites')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`invites: HTTP ${r.status}`))))
      .then((data) => setInvites(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('[admin] tải danh sách người được mời (Certs) thất bại:', err)
        setLoadError('Không tải được danh sách, thử tải lại trang nhé.')
      })
      .finally(() => setLoading(false))
    fetch('/api/certs/access-requests')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch(() => {})
    fetch('/api/certs/access-logs')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setStats(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  function upsertInvite(created: Invite) {
    setInvites((v) => (v.some((x) => x.email === created.email) ? v.map((x) => (x.email === created.email ? created : x)) : [...v, created]))
  }

  function grantResult(targetEmail: string, data: { mailSent?: boolean; loginLink?: string }, verb: 'duyệt cho' | 'mời'): ActionResult {
    const name = <MascotEm>{targetEmail}</MascotEm>
    if (data.mailSent === false && data.loginLink) {
      return {
        ok: true,
        bubble: (
          <>
            Đã {verb} {name} rồi, nhưng em chưa gửi được mail đăng nhập 😿
          </>
        ),
        sub: 'Ông chủ sao chép link dưới đây gửi giúp em cho bạn ấy nha (link dùng 1 lần, hiệu lực 30 phút). Ông chủ nhớ kiểm tra cấu hình gửi mail nữa — log máy chủ có ghi lý do.',
        copy: { text: data.loginLink, label: 'Sao chép link' },
      }
    }
    return {
      ok: true,
      bubble: (
        <>
          Đã {verb} {name} rồi nè! 🎉
        </>
      ),
      sub: 'Link đăng nhập đang trên đường tới hộp thư của bạn ấy 📬',
    }
  }

  function decideRequest(targetEmail: string, action: 'approve' | 'reject') {
    const approve = action === 'approve'
    return runAction({
      bubble: approve ? (
        <>
          Duyệt cho <MascotEm>{targetEmail}</MascotEm> xem Certs hả ông chủ?
        </>
      ) : (
        <>
          Từ chối <MascotEm>{targetEmail}</MascotEm> hả ông chủ?
        </>
      ),
      sub: approve ? 'Bạn ấy sẽ nhận email chứa link đăng nhập ngay nha 🐾' : 'Bạn ấy xin lại em cũng sẽ không báo ông chủ nữa đâu nha 🐾',
      confirmLabel: approve ? 'Duyệt nè' : 'Từ chối nè',
      danger: !approve,
      run: async () => {
        const res = await fetch(`/api/certs/access-requests/${encodeURIComponent(targetEmail)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        })
        if (!res.ok) return { ok: false, error: 'Chưa làm được rồi, ông chủ thử lại sau chút nha' }
        setRequests((v) => v.filter((x) => x.email !== targetEmail))
        if (approve) {
          const data = await res.json()
          upsertInvite(data)
          return grantResult(targetEmail, data, 'duyệt cho')
        }
        return {
          ok: true,
          bubble: (
            <>
              Đã từ chối <MascotEm>{targetEmail}</MascotEm> rồi nha
            </>
          ),
        }
      },
    })
  }

  function statFor(targetEmail: string) {
    return stats.find((s) => s.email === targetEmail)
  }

  // Mặc định xếp theo lần vào gần nhất (mới nhất lên đầu) — ai chưa từng đăng nhập thì xuống cuối, xếp
  // theo lúc được mời (mời gần đây nhất lên trước) trong nhóm đó.
  const sortedInvites = useMemo(() => {
    return [...invites].sort((a, b) => {
      const sa = statFor(a.email)?.lastSeenAt
      const sb = statFor(b.email)?.lastSeenAt
      if (sa && sb) return sb.localeCompare(sa)
      if (sa) return -1
      if (sb) return 1
      return b.invitedAt.localeCompare(a.invitedAt)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invites, stats])

  function inviteEmail() {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return
    return runAction({
      bubble: (
        <>
          Mời <MascotEm>{trimmed}</MascotEm> xem Certs Hub hả ông chủ?
        </>
      ),
      sub: 'Em sẽ gửi luôn link đăng nhập vào hộp thư của bạn ấy nha 🐾',
      confirmLabel: 'Mời nè',
      run: async () => {
        if (!EMAIL_RE.test(trimmed)) return { ok: false, error: 'Email này trông chưa đúng lắm, ông chủ kiểm tra lại giúp em nha' }
        const res = await fetch('/api/certs/invites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed }),
        })
        if (!res.ok) return { ok: false, error: 'Chưa mời được rồi, ông chủ thử lại sau chút nha' }
        const data = await res.json()
        upsertInvite(data)
        setRequests((v) => v.filter((x) => x.email !== trimmed))
        setEmail('')
        return grantResult(trimmed, data, 'mời')
      },
    })
  }

  function toggleRevoke(targetEmail: string, revoked: boolean) {
    return runAction({
      bubble: revoked ? (
        <>
          Thu hồi quyền của <MascotEm>{targetEmail}</MascotEm> hả ông chủ?
        </>
      ) : (
        <>
          Cấp lại quyền cho <MascotEm>{targetEmail}</MascotEm> nha ông chủ?
        </>
      ),
      sub: revoked ? 'Bạn ấy sẽ không vào được trang ngay ở lần tải kế tiếp đó nha 🐾' : 'Bạn ấy vào lại được liền, không cần xin link mới nha 🐾',
      confirmLabel: revoked ? 'Thu hồi nè' : 'Cấp lại nè',
      danger: revoked,
      run: async () => {
        const res = await fetch(`/api/certs/invites/${encodeURIComponent(targetEmail)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ revoked }),
        })
        if (!res.ok) return { ok: false, error: 'Chưa làm được rồi, ông chủ thử lại sau chút nha' }
        setInvites((v) => v.map((x) => (x.email === targetEmail ? { ...x, revokedAt: revoked ? new Date().toISOString() : null } : x)))
        return {
          ok: true,
          bubble: revoked ? (
            <>
              Đã thu hồi quyền của <MascotEm>{targetEmail}</MascotEm> rồi nha
            </>
          ) : (
            <>
              Đã cấp lại quyền cho <MascotEm>{targetEmail}</MascotEm> rồi nè! 🎉
            </>
          ),
        }
      },
    })
  }

  function removeInvite(targetEmail: string) {
    return runAction({
      bubble: (
        <>
          Xoá hẳn <MascotEm>{targetEmail}</MascotEm> hả ông chủ?
        </>
      ),
      sub: 'Xoá là mất luôn, không khôi phục được đâu nha 🐾',
      confirmLabel: 'Xoá luôn',
      danger: true,
      run: async () => {
        const res = await fetch(`/api/certs/invites/${encodeURIComponent(targetEmail)}`, { method: 'DELETE' })
        if (!res.ok) return { ok: false, error: 'Chưa xoá được rồi, ông chủ thử lại sau chút nha' }
        setInvites((v) => v.filter((x) => x.email !== targetEmail))
        return {
          ok: true,
          bubble: (
            <>
              Đã xoá <MascotEm>{targetEmail}</MascotEm> rồi nha
            </>
          ),
        }
      },
    })
  }

  return (
    <>
      <div className="adm-panel">
        <h2 className="adm-panel-title">Mời người xem qua email</h2>
        <div className="adm-inline-form">
          <input
            className="adm-input"
            type="email"
            placeholder="Email người được mời"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && inviteEmail()}
          />
          <button type="button" className="adm-btn adm-btn-primary" onClick={inviteEmail} disabled={!email.trim()}>
            + Mời qua email
          </button>
        </div>
        <p className="adm-note">Họ sẽ nhận 1 email chứa link đăng nhập ngay sau khi bạn bấm mời.</p>
      </div>

      {requests.length > 0 && (
        <div className="adm-panel">
          <div className="adm-toolbar">
            <h2 className="adm-panel-title">
              Đang chờ duyệt <span className="adm-count">{requests.length}</span>
            </h2>
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Xin quyền lúc</th>
                  <th className="adm-col-actions">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.email}>
                    <td className="adm-cell-main">{r.email}</td>
                    <td>{formatAdminDate(r.requestedAt)}</td>
                    <td className="adm-col-actions">
                      <div className="adm-actions">
                        <button type="button" className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => decideRequest(r.email, 'approve')}>
                          Duyệt
                        </button>
                        <button type="button" className="adm-btn adm-btn-outline adm-danger adm-btn-sm" onClick={() => decideRequest(r.email, 'reject')}>
                          Từ chối
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="adm-panel">
        <div className="adm-toolbar">
          <h2 className="adm-panel-title">
            Người được mời <span className="adm-count">{invites.length}</span>
          </h2>
        </div>

        {loading && <p className="adm-note">Đang tải…</p>}
        {loadError && <p className="adm-note adm-error">{loadError}</p>}

        {!loading && !loadError && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Trạng thái</th>
                  <th>Mời lúc</th>
                  <th>Lượt vào</th>
                  <th>Lần cuối</th>
                  <th>Trình duyệt</th>
                  <th className="adm-col-actions">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {invites.length === 0 && (
                  <tr className="adm-empty-row">
                    <td colSpan={7}>Chưa mời ai.</td>
                  </tr>
                )}
                {sortedInvites.map((v) => {
                  const stat = statFor(v.email)
                  return (
                    <tr key={v.email} className={stat ? undefined : 'adm-row-warning'}>
                      <td className="adm-cell-main">{v.email}</td>
                      <td>
                        <span className={`adm-pill ${v.revokedAt ? 'adm-pill-neutral' : stat ? 'adm-pill-success' : 'adm-pill-warning'}`}>
                          {v.revokedAt ? 'Đã thu hồi' : stat ? 'Đang hoạt động' : 'Chưa đăng nhập'}
                        </span>
                      </td>
                      <td>{formatAdminDate(v.invitedAt)}</td>
                      <td>{stat ? stat.count : '–'}</td>
                      <td>{stat ? formatAdminDate(stat.lastSeenAt) : '–'}</td>
                      <td>{stat ? stat.lastBrowser : '–'}</td>
                      <td className="adm-col-actions">
                        <div className="adm-actions">
                          <button type="button" className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => toggleRevoke(v.email, !v.revokedAt)}>
                            {v.revokedAt ? 'Cấp lại' : 'Thu hồi'}
                          </button>
                          <button type="button" className="adm-btn-ghost" aria-label="Xoá" onClick={() => removeInvite(v.email)}>
                            ×
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {ownerEmail && statFor(ownerEmail) && (
          <p className="adm-note">
            Bạn (chủ trang) đã vào {statFor(ownerEmail)!.count} lần · gần nhất {formatAdminDate(statFor(ownerEmail)!.lastSeenAt)} · {statFor(ownerEmail)!.lastBrowser}
          </p>
        )}
      </div>
    </>
  )
}
