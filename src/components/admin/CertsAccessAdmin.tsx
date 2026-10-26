'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdminAction, type ActionResult } from '@/components/admin/AdminDialog'
import { CertsGrantsPanel } from '@/components/admin/CertsGrantsPanel'
import { CertUnlockRequestsPanel } from '@/components/admin/CertUnlockRequestsPanel'
import { useLearnerActions } from '@/components/admin/useLearnerActions'
import { formatAdminDate } from '@/components/admin/format'
import { Pager, usePagination } from '@/components/admin/Pagination'
import { MascotEm } from '@/components/mascot/MascotDialog'
import { CertViewsList } from '@/components/admin/CertViews'
import type { CertViewStat } from '@/lib/certs/viewTypes'
import type { CertsProfileStat } from '@/lib/certs/profiles'

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
  certViews: CertViewStat[]
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
  // null = đang tải — công tắc khoá lại tới khi biết chế độ hiện tại.
  const [accessMode, setAccessMode] = useState<'verified' | 'profile' | null>(null)
  // Tăng lên mỗi lần duyệt 1 yêu cầu mở cert → dựng lại bảng quyền xem để tải quyền mới.
  const [grantsVersion, setGrantsVersion] = useState(0)

  useEffect(() => {
    fetch('/api/certs/settings')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`settings: HTTP ${r.status}`))))
      .then((data) => setAccessMode(data.accessMode === 'profile' ? 'profile' : 'verified'))
      .catch((err) => console.error('[admin] tải cách vào Certs thất bại:', err))
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
  const invitePage = usePagination(sortedInvites, 10)

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

  function toggleAccessMode() {
    if (!accessMode) return
    const next = accessMode === 'verified' ? 'profile' : 'verified'
    const toProfile = next === 'profile'
    return runAction({
      bubble: toProfile ? 'Mở Certs Hub cho ai cũng vào học được hả ông chủ?' : 'Bật lại xác thực email cho Certs Hub hả ông chủ?',
      sub: toProfile
        ? 'Không cần email hay chờ duyệt nữa, mỗi người chỉ cần đặt tên hồ sơ học là vào được nha 🐾'
        : 'Chỉ người được mời mới vào được. Ai đang vào bằng hồ sơ học sẽ bị hỏi email ở lần tải kế tiếp đó nha 🐾',
      confirmLabel: toProfile ? 'Mở luôn' : 'Bật lại nè',
      danger: toProfile,
      run: async () => {
        const res = await fetch('/api/certs/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessMode: next }),
        })
        if (!res.ok) return { ok: false, error: 'Chưa đổi được rồi, ông chủ thử lại sau chút nha' }
        setAccessMode(next)
        return { ok: true, bubble: toProfile ? 'Đã mở Certs Hub, chỉ cần tạo hồ sơ là học được rồi nè! 🎉' : 'Đã bật lại xác thực email rồi nha' }
      },
    })
  }

  return (
    <>
      <div className="adm-panel">
        <div className="adm-toolbar">
          <h2 className="adm-panel-title">Cách vào Certs Hub</h2>
          <button
            type="button"
            role="switch"
            aria-checked={accessMode === 'profile'}
            aria-label="Chỉ cần tạo hồ sơ học, không cần xác thực email"
            className="adm-switch"
            disabled={!accessMode}
            onClick={toggleAccessMode}
          >
            <span className="adm-switch-track" aria-hidden="true">
              <span className="adm-switch-thumb" />
            </span>
            <span className="adm-switch-label">{accessMode === 'profile' ? 'Chỉ cần hồ sơ học' : 'Xác thực email'}</span>
          </button>
        </div>
        <p className="adm-note">
          {accessMode === 'profile'
            ? 'Ai có link cũng vào được: chỉ cần đặt tên hồ sơ học (như Chinese/Korean), không cần email hay chờ duyệt. Danh sách mời bên dưới tạm không có tác dụng.'
            : 'Người xem phải đăng nhập bằng link gửi qua email và nằm trong danh sách được mời/duyệt.'}
        </p>
      </div>

      <CertUnlockRequestsPanel onChanged={() => setGrantsVersion((v) => v + 1)} />

      {accessMode && <CertsGrantsPanel key={grantsVersion} mode={accessMode} invites={invites} />}

      {accessMode === 'verified' && (
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
                      <th>Cert đã xem</th>
                      <th className="adm-col-actions">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invites.length === 0 && (
                      <tr className="adm-empty-row">
                        <td colSpan={8}>Chưa mời ai.</td>
                      </tr>
                    )}
                    {invitePage.items.map((v) => {
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
                          <td>
                            <CertViewsList views={stat?.certViews ?? []} />
                          </td>
                          <td className="adm-col-actions">
                            <div className="adm-actions">
                              <button type="button" className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => toggleRevoke(v.email, !v.revokedAt)}>
                                {v.revokedAt ? 'Cấp lại' : 'Thu hồi'}
                              </button>
                              <button type="button" className="adm-btn adm-btn-outline adm-danger adm-btn-sm" onClick={() => removeInvite(v.email)}>
                                Xoá
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <Pager p={invitePage} unit="người" />
              </div>
            )}

            {ownerEmail && statFor(ownerEmail) && (
              <p className="adm-note">
                Bạn (chủ trang) đã vào {statFor(ownerEmail)!.count} lần · gần nhất {formatAdminDate(statFor(ownerEmail)!.lastSeenAt)} · {statFor(ownerEmail)!.lastBrowser}
              </p>
            )}
          </div>
        </>
      )}

      {/* Tiến độ Certs theo hồ sơ học hiện ở CẢ 2 chế độ: luyện đề luôn lưu theo hồ sơ (kể cả người vào bằng email), và
          tab "Hồ sơ học · 中文 · 한국어" không còn hiện phần Certs nữa. */}
      {accessMode && <CertsProfilesPanel onChanged={() => setGrantsVersion((v) => v + 1)} />}
    </>
  )
}

// Theo dõi người học Certs theo hồ sơ học (tên) — lượt vào Certs, cert đã xem, tiến độ luyện đề — kèm đổi tên / xoá
// hồ sơ (useLearnerActions, dùng chung với tab 中文 · 한국어). onChanged: đổi tên / xoá xong thì bảng quyền xem cert
// (hàng theo hồ sơ) cũng phải tải lại.
function CertsProfilesPanel({ onChanged }: { onChanged: () => void }) {
  const [rows, setRows] = useState<CertsProfileStat[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  // API trả MỌI hồ sơ (dùng chung với Trung/Hàn); mặc định chỉ hiện ai đã từng dùng Certs.
  const [showAll, setShowAll] = useState(false)
  const usedCerts = (p: CertsProfileStat) => p.visits + p.questions + p.attempts + p.certViews.length > 0
  // Học gần nhất lên đầu; chưa học thì xuống dưới, xếp theo lần vào Certs gần nhất.
  const shown = (rows ?? [])
    .filter((p) => showAll || usedCerts(p))
    .sort((a, b) => (b.lastStudyAt ?? '').localeCompare(a.lastStudyAt ?? '') || (b.lastSeenAt ?? '').localeCompare(a.lastSeenAt ?? ''))
  const page = usePagination(shown, 10, String(showAll))

  const load = useCallback(
    () =>
      fetch('/api/certs/profiles')
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`profiles: HTTP ${r.status}`))))
        .then((data) => setRows(Array.isArray(data) ? data : []))
        .catch((err) => {
          console.error('[admin] tải hồ sơ học Certs thất bại:', err)
          setLoadError('Không tải được danh sách hồ sơ, thử tải lại trang nhé.')
        }),
    [],
  )

  useEffect(() => {
    load()
  }, [load])

  const { rename, remove } = useLearnerActions({
    onRenamed: async () => {
      await load()
      onChanged()
    },
    onRemoved: (id) => {
      setRows((v) => (v ? v.filter((x) => x.id !== id) : v))
      onChanged()
    },
  })

  return (
    <div className="adm-panel">
      <div className="adm-toolbar">
        <h2 className="adm-panel-title">
          Hồ sơ học Certs <span className="adm-count">{shown.length}</span>
        </h2>
        {rows && (
          <label className="adm-note">
            <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} /> Hiện cả hồ sơ chưa vào Certs ({rows.filter((p) => !usedCerts(p)).length})
          </label>
        )}
      </div>

      {!rows && !loadError && <p className="adm-note">Đang tải…</p>}
      {loadError && <p className="adm-note adm-error">{loadError}</p>}

      {rows && (
        <div className="adm-table-wrap">
          <table className="adm-table adm-table-wide">
            <thead>
              <tr>
                <th className="adm-col-who">Hồ sơ</th>
                <th>Lượt vào</th>
                <th>Lần cuối vào</th>
                <th>Trình duyệt</th>
                <th>Câu đã làm</th>
                <th>Tỉ lệ đúng</th>
                <th>Lượt thi</th>
                <th>Chứng chỉ</th>
                <th>Cert đã xem</th>
                <th>Học gần nhất</th>
                <th className="adm-col-actions">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr className="adm-empty-row">
                  <td colSpan={11}>Chưa có hồ sơ học nào.</td>
                </tr>
              )}
              {page.items.map((p) => {
                const answered = p.correct + p.wrong
                return (
                  <tr key={p.id}>
                    <td className="adm-col-who">
                      <div className="adm-cell-main">{p.displayName || p.id}</div>
                      {p.displayName && p.displayName !== p.id && <div className="adm-cell-sub">{p.id}</div>}
                    </td>
                    <td>{p.visits || '–'}</td>
                    <td>{p.lastSeenAt ? formatAdminDate(p.lastSeenAt) : '–'}</td>
                    <td>{p.lastBrowser ?? '–'}</td>
                    <td>{p.questions || '–'}</td>
                    <td>{answered ? `${Math.round((p.correct / answered) * 100)}%` : '–'}</td>
                    <td>{p.attempts ? `${p.attempts}${p.avgScore != null ? ` · TB ${p.avgScore}%` : ''}` : '–'}</td>
                    <td>{p.certs.length ? p.certs.join(', ').toUpperCase() : '–'}</td>
                    <td>
                      <CertViewsList views={p.certViews} />
                    </td>
                    <td>{p.lastStudyAt ? formatAdminDate(p.lastStudyAt) : '–'}</td>
                    <td className="adm-col-actions">
                      <div className="adm-actions">
                        <button type="button" className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => rename(p)}>
                          Đổi tên
                        </button>
                        <button type="button" className="adm-btn adm-btn-outline adm-danger adm-btn-sm" onClick={() => remove(p)}>
                          Xoá
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <Pager p={page} unit="hồ sơ" />
        </div>
      )}
      <p className="adm-note">Lượt vào và cert đã xem chỉ được đếm từ khi có tính năng theo dõi; tiến độ luyện đề thì tính cả trước đó. Đổi tên / xoá hồ sơ ở đây tác động cả tiến độ Tiếng Trung, Tiếng Hàn của hồ sơ đó.</p>
    </div>
  )
}
