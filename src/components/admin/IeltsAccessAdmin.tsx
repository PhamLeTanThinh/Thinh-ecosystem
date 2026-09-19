'use client'

import { useEffect, useState } from 'react'
import { useAdminAction, type ActionResult } from '@/components/admin/AdminDialog'
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

// Tab "Người xem IELTS" của trang /admin — mời/thu hồi quyền xem theo email và duyệt yêu cầu của người lạ.
// Nhập email rồi bấm mời sẽ gửi luôn 1 magic link đăng nhập tới đúng địa chỉ đó. Việc thực thi quyền thật
// nằm ở API (`requireOwnerApi`); /admin/layout.tsx đã chặn người không phải chủ ở phía giao diện. Mọi thao tác
// (mời/duyệt/từ chối/thu hồi/cấp lại/xoá) đi qua popup mèo hỏi–xong của AdminDialog, không dùng window.confirm.
export function IeltsAccessAdmin({ ownerEmail }: { ownerEmail: string | null }) {
  const runAction = useAdminAction()
  const [invites, setInvites] = useState<Invite[]>([])
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [stats, setStats] = useState<AccessStat[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Mọi fetch đều kiểm tra r.ok trước khi đọc JSON, và luôn rơi về mảng rỗng khi lỗi — trước đây fetch invites/
  // access-logs không kiểm tra, nên 1 API lỗi (vd DB tạm thời không kết nối được) trả về {message: "..."} thay vì
  // mảng, set thẳng vào state rồi .map() ở dưới ném lỗi, làm sập toàn bộ trang (React không có error boundary ở
  // đây) — trang trắng trơn không có gì hiện ra, không có cách nào biết vì sao.
  useEffect(() => {
    fetch('/api/ielts/invites')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`invites: HTTP ${r.status}`))))
      .then((data) => setInvites(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('[admin] tải danh sách người được mời thất bại:', err)
        setLoadError('Không tải được danh sách, thử tải lại trang nhé.')
      })
      .finally(() => setLoading(false))
    fetch('/api/ielts/access-requests')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch(() => {})
    fetch('/api/ielts/access-logs')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setStats(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  function upsertInvite(created: Invite) {
    setInvites((v) => (v.some((x) => x.email === created.email) ? v.map((x) => (x.email === created.email ? created : x)) : [...v, created]))
  }

  // Kết quả của thao tác CÓ gửi mail đăng nhập (duyệt / mời): mail đi được thì báo bình thường; không đi được (chưa cấu hình
  // gửi mail, Gmail/Resend từ chối...) thì nói thật và đưa link để chủ sao chép gửi tay — thay vì báo "đã gửi" suông.
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
          Duyệt cho <MascotEm>{targetEmail}</MascotEm> hả ông chủ?
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
        const res = await fetch(`/api/ielts/access-requests/${encodeURIComponent(targetEmail)}`, {
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

  function inviteEmail() {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return
    return runAction({
      bubble: (
        <>
          Mời <MascotEm>{trimmed}</MascotEm> xem IELTS Hub hả ông chủ?
        </>
      ),
      sub: 'Em sẽ gửi luôn link đăng nhập vào hộp thư của bạn ấy nha 🐾',
      confirmLabel: 'Mời nè',
      run: async () => {
        if (!EMAIL_RE.test(trimmed)) return { ok: false, error: 'Email này trông chưa đúng lắm, ông chủ kiểm tra lại giúp em nha' }
        const res = await fetch('/api/ielts/invites', {
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
        const res = await fetch(`/api/ielts/invites/${encodeURIComponent(targetEmail)}`, {
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
        const res = await fetch(`/api/ielts/invites/${encodeURIComponent(targetEmail)}`, { method: 'DELETE' })
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
    <div className="ih-vocab" style={{ maxWidth: 'none', margin: 0 }}>
      <h2 className="ih-font-hand" style={{ fontSize: 20, margin: '0 0 12px' }}>
        Mời người xem qua email
      </h2>

      <div className="ih-glass ih-vocab-form">
        <div className="ih-vocab-form-grid" style={{ gridTemplateColumns: '1fr auto' }}>
          <input
            className="ih-input"
            type="email"
            placeholder="Email người được mời"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && inviteEmail()}
          />
          <button type="button" className="ih-btn-solid" onClick={inviteEmail} disabled={!email.trim()}>
            + Mời qua email
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-ih-ink-soft)', margin: '8px 0 0' }}>
          Họ sẽ nhận 1 email chứa link đăng nhập ngay sau khi bạn bấm mời.
        </p>
      </div>

      {requests.length > 0 && (
        <div className="ih-vocab-grid" style={{ marginTop: 16, gridTemplateColumns: '1fr' }}>
          <h2 className="ih-font-hand" style={{ fontSize: 18, margin: 0 }}>
            Đang chờ duyệt ({requests.length})
          </h2>
          {requests.map((r) => (
            <div key={r.email} className="ih-glass ih-vocab-card" style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="ih-vocab-word">{r.email}</div>
                <div className="ih-vocab-meaning" style={{ fontSize: 12 }}>
                  Xin quyền lúc {new Date(r.requestedAt).toLocaleString('vi-VN')}
                </div>
              </div>
              <button type="button" className="ih-btn-solid" onClick={() => decideRequest(r.email, 'approve')}>
                Duyệt
              </button>
              <button type="button" className="ih-btn-outline" onClick={() => decideRequest(r.email, 'reject')}>
                Từ chối
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="ih-vocab-grid" style={{ marginTop: 16, gridTemplateColumns: '1fr' }}>
        {loading && <p className="ih-vocab-empty">Đang tải…</p>}
        {loadError && <p className="ih-vocab-empty" style={{ color: '#dc2626' }}>{loadError}</p>}
        {!loading && !loadError && invites.length === 0 && <p className="ih-vocab-empty">Chưa mời ai.</p>}
        {invites.map((v) => {
          const stat = statFor(v.email)
          return (
            <div key={v.email} className="ih-glass ih-vocab-card" style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="ih-vocab-word">{v.email}</div>
                <div className="ih-vocab-meaning" style={{ fontSize: 12 }}>
                  Mời lúc {new Date(v.invitedAt).toLocaleString('vi-VN')}
                  {v.revokedAt ? ' · Đã thu hồi' : ''}
                </div>
                <div className="ih-vocab-meaning" style={{ fontSize: 12 }}>
                  {stat
                    ? `Đã vào ${stat.count} lần · gần nhất ${new Date(stat.lastSeenAt).toLocaleString('vi-VN')} · ${stat.lastBrowser}`
                    : 'Chưa từng đăng nhập'}
                </div>
              </div>
              <button type="button" className="ih-btn-outline" onClick={() => toggleRevoke(v.email, !v.revokedAt)}>
                {v.revokedAt ? 'Cấp lại quyền' : 'Thu hồi'}
              </button>
              <button type="button" className="ih-vocab-card-action" aria-label="Xoá" onClick={() => removeInvite(v.email)}>
                ×
              </button>
            </div>
          )
        })}
      </div>

      {ownerEmail && statFor(ownerEmail) && (
        <p style={{ fontSize: 12, color: 'var(--color-ih-ink-soft)', marginTop: 16 }}>
          Bạn (chủ trang) đã vào {statFor(ownerEmail)!.count} lần · gần nhất{' '}
          {new Date(statFor(ownerEmail)!.lastSeenAt).toLocaleString('vi-VN')} · {statFor(ownerEmail)!.lastBrowser}
        </p>
      )}
    </div>
  )
}
