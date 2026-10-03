'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAdminAction, type ActionResult } from '@/components/admin/AdminDialog'
import { ago, avatarColor, formatAdminDate } from '@/components/admin/format'
import { Pager, usePagination } from '@/components/admin/Pagination'
import type { PracticeProgressItem, PracticeSummary } from '@/lib/ielts/adminPractice'
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
  const [practice, setPractice] = useState<Record<string, PracticeSummary>>({}) // email → dữ liệu luyện đề
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'revoked'>('all')
  const [detail, setDetail] = useState<string | null>(null) // email đang xem chi tiết (popup)

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
    fetch('/api/admin/ielts-practice')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => setPractice(data && typeof data === 'object' ? (data as Record<string, PracticeSummary>) : {}))
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

  // Dữ liệu luyện đề lưu theo email (chữ thường); chủ trang chưa bật chia sẻ thì nằm ở khoá 'owner'
  const practiceOf = (e: string) => practice[e.toLowerCase()] ?? (e === ownerEmail ? practice.owner : undefined)

  const counts = useMemo(() => {
    const live = invites.filter((v) => !v.revokedAt)
    return {
      active: live.filter((v) => statFor(v.email)).length,
      pending: live.filter((v) => !statFor(v.email)).length,
      revoked: invites.length - live.length,
      submissions: Object.values(practice).reduce((n, p) => n + p.submissions, 0),
      practicing: Object.values(practice).filter((p) => p.submissions > 0).length,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invites, stats, practice])

  const shownInvites = sortedInvites.filter((v) => {
    if (query && !v.email.includes(query.trim().toLowerCase())) return false
    if (filter === 'revoked') return !!v.revokedAt
    if (filter === 'active') return !v.revokedAt && !!statFor(v.email)
    if (filter === 'pending') return !v.revokedAt && !statFor(v.email)
    return true
  })
  const invitePage = usePagination(shownInvites, 10, `${filter}|${query}`)

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
          <input className="adm-input adm-search" type="search" placeholder="Tìm theo email…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        {loading && <p className="adm-note">Đang tải…</p>}
        {loadError && <p className="adm-note adm-error">{loadError}</p>}

        {!loading && !loadError && (
          <>
            <div className="lad-stats">
              <StatTile label="Người được mời" value={invites.length} sub={`${counts.revoked} đã thu hồi`} />
              <StatTile label="Đã đăng nhập" value={counts.active} sub={`${invites.length ? Math.round((counts.active / invites.length) * 100) : 0}% người được mời`} tone="success" />
              <StatTile label="Chưa đăng nhập" value={counts.pending} sub="đã mời nhưng chưa vào" tone={counts.pending ? 'warning' : undefined} />
              <StatTile label="Lượt nộp bài" value={counts.submissions} sub={`${counts.practicing} người có luyện đề`} />
            </div>

            <div className="lad-filters">
              <div className="lad-chips">
                {(
                  [
                    ['all', 'Tất cả', invites.length],
                    ['active', 'Đã đăng nhập', counts.active],
                    ['pending', 'Chưa đăng nhập', counts.pending],
                    ['revoked', 'Đã thu hồi', counts.revoked],
                  ] as const
                ).map(([k, label, n]) => (
                  <button key={k} type="button" className={`lad-chip${filter === k ? ' on' : ''}`} onClick={() => setFilter(k)}>
                    {label} <span>{n}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="adm-table-wrap">
              <table className="adm-table lad-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Trạng thái</th>
                    <th>Lượt vào</th>
                    <th>Lần cuối</th>
                    <th>Luyện đề</th>
                    <th className="adm-col-actions">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {shownInvites.length === 0 && (
                    <tr className="adm-empty-row">
                      <td colSpan={6}>{invites.length === 0 ? 'Chưa mời ai.' : 'Không có ai khớp.'}</td>
                    </tr>
                  )}
                  {ownerEmail && filter === 'all' && !query && invitePage.page === 1 && (
                    <ViewerRow
                      email={ownerEmail}
                      sub="Chủ trang"
                      status={<span className="adm-pill adm-pill-accent">Chủ trang</span>}
                      stat={statFor(ownerEmail)}
                      practice={practiceOf(ownerEmail)}
                      onDetail={() => setDetail(ownerEmail)}
                    />
                  )}
                  {invitePage.items.map((v) => {
                    const stat = statFor(v.email)
                    return (
                      <ViewerRow
                        key={v.email}
                        email={v.email}
                        sub={`Mời ${formatAdminDate(v.invitedAt).slice(0, 11)}`}
                        warning={!stat && !v.revokedAt}
                        status={<InviteStatus invite={v} stat={stat} />}
                        stat={stat}
                        practice={practiceOf(v.email)}
                        onDetail={() => setDetail(v.email)}
                        actions={
                          <>
                            <button type="button" className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => toggleRevoke(v.email, !v.revokedAt)}>
                              {v.revokedAt ? 'Cấp lại' : 'Thu hồi'}
                            </button>
                            <button type="button" className="adm-btn adm-btn-outline adm-danger adm-btn-sm" onClick={() => removeInvite(v.email)}>
                              Xoá
                            </button>
                          </>
                        }
                      />
                    )
                  })}
                </tbody>
              </table>
            </div>
            <Pager p={invitePage} unit="người" />
          </>
        )}
      </div>

      {detail && (
        <ViewerDetail
          email={detail}
          invite={invites.find((x) => x.email === detail)}
          isOwner={detail === ownerEmail}
          stat={statFor(detail)}
          practice={practiceOf(detail)}
          onClose={() => setDetail(null)}
          // Đóng popup chi tiết để hiện popup xác nhận; bấm "Thôi" thì mở lại chi tiết như cũ
          onToggleRevoke={(revoked) => {
            const email = detail
            setDetail(null)
            void toggleRevoke(email, revoked).then((ok) => !ok && setDetail(email))
          }}
          onRemove={() => {
            const email = detail
            setDetail(null)
            void removeInvite(email).then((ok) => !ok && setDetail(email))
          }}
        />
      )}
    </>
  )
}

function InviteStatus({ invite, stat }: { invite: Invite; stat?: AccessStat }) {
  return (
    <span className={`adm-pill ${invite.revokedAt ? 'adm-pill-neutral' : stat ? 'adm-pill-success' : 'adm-pill-warning'}`}>
      {invite.revokedAt ? 'Đã thu hồi' : stat ? 'Đang hoạt động' : 'Chưa đăng nhập'}
    </span>
  )
}

function StatTile({ label, value, sub, tone }: { label: string; value: number | string; sub: string; tone?: 'success' | 'warning' }) {
  return (
    <div className={`lad-stat${tone ? ` ${tone}` : ''}`}>
      <span className="lad-stat-label">{label}</span>
      <b>{typeof value === 'number' ? value.toLocaleString('vi-VN') : value}</b>
      <small>{sub}</small>
    </div>
  )
}

// 1 dòng bảng: email + dòng phụ, trạng thái, lượt vào, lần cuối (kèm trình duyệt), tóm tắt luyện đề. Bấm dòng = xem chi tiết.
function ViewerRow({
  email,
  sub,
  status,
  stat,
  practice,
  warning,
  onDetail,
  actions,
}: {
  email: string
  sub: string
  status: React.ReactNode
  stat?: AccessStat
  practice?: PracticeSummary
  warning?: boolean
  onDetail: () => void
  actions?: React.ReactNode
}) {
  return (
    <tr className={`lad-row${warning ? ' adm-row-warning' : ''}`} onClick={onDetail}>
      <td>
        <div className="lad-who">
          <div className="lad-avatar lad-avatar-sm" style={{ background: avatarColor(email) }} aria-hidden="true">
            {email.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="adm-cell-main">{email}</div>
            <div className="adm-cell-sub">{sub}</div>
          </div>
        </div>
      </td>
      <td data-label="Trạng thái">{status}</td>
      <td data-label="Lượt vào">{stat ? stat.count : '–'}</td>
      <td data-label="Lần cuối" className="adm-cell-sub" title={stat ? formatAdminDate(stat.lastSeenAt) : undefined}>
        {stat ? (
          <>
            {ago(stat.lastSeenAt)} · {stat.lastBrowser}
          </>
        ) : (
          '–'
        )}
      </td>
      <td data-label="Luyện đề">
        {practice && practice.submissions + practice.drafts.length + practice.vocab.length > 0 ? (
          <div className="lad-cell">
            <b>{practice.submissions}</b> <span className="adm-cell-sub">lượt nộp · {practice.tests.length} đề</span>
          </div>
        ) : (
          <span className="adm-cell-sub">—</span>
        )}
      </td>
      <td className="adm-col-actions" onClick={(e) => e.stopPropagation()}>
        <div className="adm-actions">
          <button type="button" className="adm-btn adm-btn-outline adm-btn-sm" onClick={onDetail}>
            Chi tiết
          </button>
          {actions}
        </div>
      </td>
    </tr>
  )
}

const SKILL_LABEL: Record<string, string> = { listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking' }
const MODE_LABEL: Record<string, string> = { real: 'Thi thật', practice: 'Luyện tập' }
const pctOf = (a: number, b: number | null) => (b ? Math.round((a / b) * 100) : 0)

// Popup chi tiết 1 người xem: thông tin truy cập + toàn bộ dữ liệu luyện đề (kết quả từng đề kèm lịch sử nộp, bài làm
// dở, từ vựng đã thuộc, bài tập, dictation, highlight).
function ViewerDetail({
  email,
  invite,
  isOwner,
  stat,
  practice,
  onClose,
  onToggleRevoke,
  onRemove,
}: {
  email: string
  invite?: Invite
  isOwner: boolean
  stat?: AccessStat
  practice?: PracticeSummary
  onClose: () => void
  onToggleRevoke: (revoked: boolean) => void
  onRemove: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  const p = practice
  const testPage = usePagination(p?.tests ?? [], 5)
  const draftPage = usePagination(p?.drafts ?? [], 5)
  const highlightPage = usePagination(p?.highlights ?? [], 5)
  const avgBest = p && p.tests.length ? Math.round(p.tests.reduce((n, t) => n + (t.total ? t.best / t.total : 0), 0) / p.tests.length * 100) : null
  const learnedWords = p ? p.vocab.reduce((n, v) => n + v.done, 0) : 0
  return (
    <div className="lad-backdrop" onClick={onClose}>
      <div className="lad-modal" role="dialog" aria-modal="true" aria-label={`Chi tiết ${email}`} onClick={(e) => e.stopPropagation()}>
        <header className="lad-head">
          <div className="lad-avatar" style={{ background: avatarColor(email) }} aria-hidden="true">
            {email.charAt(0).toUpperCase()}
          </div>
          <div className="lad-id">
            <div className="lad-name">
              {email}
              {isOwner ? <span className="adm-pill adm-pill-accent">Chủ trang</span> : invite && <InviteStatus invite={invite} stat={stat} />}
            </div>
            <div className="lad-dates">
              {invite && <span>Mời {formatAdminDate(invite.invitedAt)}</span>}
              {invite?.revokedAt && <span>Thu hồi {formatAdminDate(invite.revokedAt)}</span>}
              <span>
                Lượt vào: <b>{stat ? stat.count : 0}</b>
              </span>
              <span>
                Lần cuối: <b>{stat ? `${ago(stat.lastSeenAt)} · ${formatAdminDate(stat.lastSeenAt)} · ${stat.lastBrowser}` : 'chưa đăng nhập'}</b>
              </span>
            </div>
          </div>
          <button type="button" className="lad-close" aria-label="Đóng" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="iad-body">
          {!p ? (
            <p className="lad-none">Chưa có dữ liệu luyện đề — tiến độ được đồng bộ lên máy chủ từ khi người này luyện đề trên bản mới.</p>
          ) : (
            <>
              <div className="lad-stats iad-stats">
                <StatTile label="Lượt nộp bài" value={p.submissions} sub={`${p.tests.length} đề đã làm`} />
                <StatTile label="Điểm cao nhất TB" value={avgBest === null ? '—' : `${avgBest}%`} sub="trung bình trên các đề đã làm" />
                <StatTile label="Đang làm dở" value={p.drafts.length} sub="đề chưa nộp" />
                <StatTile label="Từ đã thuộc" value={learnedWords} sub={`${p.vocab.length} bộ · ${p.favs} từ yêu thích`} />
                <StatTile label="Highlight" value={p.highlights.reduce((n, h) => n + h.count, 0)} sub={`trên ${p.highlights.length} bài đọc`} />
              </div>
              <p className="adm-cell-sub iad-sync">Dữ liệu cập nhật lần cuối: {p.updatedAt ? `${ago(p.updatedAt)} · ${formatAdminDate(p.updatedAt)}` : '—'}</p>

              <section className="iad-section">
                <h4>Kết quả luyện đề</h4>
                {p.tests.length === 0 ? (
                  <p className="lad-none">Chưa nộp đề nào.</p>
                ) : (
                  <ul className="iad-tests">
                    {testPage.items.map((t) => (
                      <li key={t.id}>
                        <div className="iad-test-top">
                          <div className="iad-test-title">
                            {t.skill && <span className={`iad-skill ${t.skill}`}>{SKILL_LABEL[t.skill]}</span>}
                            <b>{t.title}</b>
                          </div>
                          <div className="iad-test-score">
                            <span>
                              Cao nhất <b>{t.best}/{t.total}</b> <small>({pctOf(t.best, t.total)}%)</small>
                            </span>
                            <span className="adm-cell-sub">
                              {t.attempts} lần · {ago(t.lastAt)}
                            </span>
                          </div>
                        </div>
                        <div className="lad-bar lad-bar-sm">
                          <span className="ok" style={{ width: `${pctOf(t.best, t.total)}%` }} />
                        </div>
                        {t.history.length > 0 && (
                          <div className="iad-history">
                            {t.history.slice(0, 8).map((h, i) => (
                              <span key={i} className="iad-chip" title={formatAdminDate(h.at)}>
                                {h.score}/{h.total} · {MODE_LABEL[h.mode] ?? h.mode} · {formatAdminDate(h.at).slice(0, 11)}
                              </span>
                            ))}
                            {t.history.length > 8 && <span className="adm-cell-sub">+{t.history.length - 8} lần nữa</span>}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                <Pager p={testPage} sizes={[5, 10, 20]} unit="đề" compact />
              </section>

              {p.drafts.length > 0 && (
                <section className="iad-section">
                  <h4>Đang làm dở</h4>
                  <ul className="iad-list">
                    {draftPage.items.map((d) => (
                      <li key={d.id}>
                        {d.skill && <span className={`iad-skill ${d.skill}`}>{SKILL_LABEL[d.skill]}</span>}
                        <span className="iad-list-title">{d.title}</span>
                        <span className="adm-cell-sub">
                          {MODE_LABEL[d.mode] ?? d.mode} · đã trả lời {d.answered}
                          {d.total ? `/${d.total}` : ''} câu
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Pager p={draftPage} sizes={[]} unit="đề" compact />
                </section>
              )}

              <div className="iad-grid">
                <ProgressSection title="Từ vựng đã thuộc" items={p.vocab} unit="từ" empty="Chưa đánh dấu từ nào" />
                <ProgressSection title="Bài tập" items={p.exercises} unit="câu" empty="Chưa làm bài tập nào" />
                <ProgressSection title="Dictation" items={p.dictation} unit="câu" empty="Chưa làm dictation" />
                {p.highlights.length > 0 && (
                  <section className="iad-section">
                    <h4>Highlight bài đọc</h4>
                    <ul className="iad-list">
                      {highlightPage.items.map((h) => (
                        <li key={h.id}>
                          <span className="iad-list-title">{h.title}</span>
                          <span className="adm-cell-sub">{h.count} đoạn</span>
                        </li>
                      ))}
                    </ul>
                    <Pager p={highlightPage} sizes={[]} unit="bài" compact />
                  </section>
                )}
              </div>
            </>
          )}
        </div>

        <footer className="lad-foot">
          {invite && (
            <>
              <button type="button" className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => onToggleRevoke(!invite.revokedAt)}>
                {invite.revokedAt ? 'Cấp lại quyền' : 'Thu hồi quyền'}
              </button>
              <button type="button" className="adm-btn adm-btn-outline adm-danger adm-btn-sm" onClick={onRemove}>
                Xoá
              </button>
            </>
          )}
          <button type="button" className="adm-btn adm-btn-primary adm-btn-sm" onClick={onClose}>
            Đóng
          </button>
        </footer>
      </div>
    </div>
  )
}

function ProgressSection({ title, items, unit, empty }: { title: string; items: PracticeProgressItem[]; unit: string; empty: string }) {
  const page = usePagination(items, 5)
  return (
    <section className="iad-section">
      <h4>{title}</h4>
      {items.length === 0 ? (
        <p className="lad-none">{empty}</p>
      ) : (
        <ul className="iad-list">
          {page.items.map((it) => (
            <li key={it.id}>
              <span className="iad-list-title">{it.title}</span>
              <span className="adm-cell-sub">
                {it.done}
                {it.total ? `/${it.total}` : ''} {unit}
              </span>
              {it.total ? (
                <div className="lad-bar lad-bar-sm iad-list-bar">
                  <span className="ok" style={{ width: `${pctOf(it.done, it.total)}%` }} />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      <Pager p={page} sizes={[]} unit="mục" compact />
    </section>
  )
}
