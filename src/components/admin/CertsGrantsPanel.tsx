'use client'

import { useEffect, useState } from 'react'
import { Pager, usePagination } from '@/components/admin/Pagination'
import type { CertsProfileStat } from '@/lib/certs/profiles'

interface GrantsData {
  certs: { id: string; code: string }[]
  defaults: string[]
  grants: Record<string, string[]>
}

interface Row {
  subject: string
  label: string
  sub?: string
}

// Bảng "Ai được xem cert nào" ở tab Certs của /admin: hàng đầu = mặc định cho mọi người, các hàng sau = từng
// người (email được mời ở chế độ xác thực, hồ sơ học ở chế độ chỉ cần hồ sơ). Tick là lưu ngay. Cert đã mở cho
// mọi người thì ô của từng người hiện sẵn dấu tick mờ, không bỏ riêng được. Chủ trang luôn thấy hết.
// Xem lib/certs/visibility.ts.
export function CertsGrantsPanel({ mode, invites }: { mode: 'verified' | 'profile'; invites: { email: string; revokedAt: string | null }[] }) {
  const [data, setData] = useState<GrantsData | null>(null)
  const [profiles, setProfiles] = useState<CertsProfileStat[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null) // `${subject}|${certId}` đang lưu

  useEffect(() => {
    fetch('/api/certs/grants')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`grants: HTTP ${r.status}`))))
      .then(setData)
      .catch((err) => {
        console.error('[admin] tải quyền xem cert thất bại:', err)
        setError('Không tải được quyền xem cert, thử tải lại trang nhé.')
      })
  }, [])

  useEffect(() => {
    if (mode !== 'profile') return
    fetch('/api/certs/profiles')
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => setProfiles(Array.isArray(rows) ? rows : []))
      .catch(() => {})
  }, [mode])

  const rows: Row[] =
    mode === 'profile'
      ? profiles.map((p) => ({ subject: `learner:${p.id}`, label: p.displayName || p.id, sub: p.displayName && p.displayName !== p.id ? p.id : undefined }))
      : invites.filter((v) => !v.revokedAt).map((v) => ({ subject: `email:${v.email}`, label: v.email }))
  const page = usePagination(rows, 10)

  async function toggle(subject: string, certId: string) {
    if (!data || saving) return
    const current = subject === 'default' ? data.defaults : (data.grants[subject] ?? [])
    const next = current.includes(certId) ? current.filter((x) => x !== certId) : [...current, certId]
    const apply = (certs: string[]) =>
      setData((d) => (d ? (subject === 'default' ? { ...d, defaults: certs } : { ...d, grants: { ...d.grants, [subject]: certs } }) : d))

    apply(next)
    setSaving(`${subject}|${certId}`)
    setError(null)
    try {
      const res = await fetch('/api/certs/grants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, certs: next }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    } catch (err) {
      console.error('[admin] lưu quyền xem cert thất bại:', err)
      apply(current)
      setError('Chưa lưu được, thử lại sau chút nhé.')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="adm-panel">
      <div className="adm-toolbar">
        <h2 className="adm-panel-title">Ai được xem cert nào</h2>
      </div>
      <p className="adm-note">
        Tick là lưu ngay. Hàng &ldquo;Mọi người&rdquo; mở cert cho tất cả; các hàng dưới mở thêm cho từng {mode === 'profile' ? 'hồ sơ học' : 'email'}. Cert không được
        mở sẽ ẩn khỏi trang Certs và vào thẳng link cũng không được. Bạn (chủ trang) luôn thấy hết.
      </p>
      {error && <p className="adm-note adm-error">{error}</p>}
      {!data && !error && <p className="adm-note">Đang tải…</p>}

      {data && (
        <div className="adm-table-wrap">
          <table className="adm-table adm-grants">
            <thead>
              <tr>
                <th>{mode === 'profile' ? 'Hồ sơ' : 'Email'}</th>
                {data.certs.map((c) => (
                  <th key={c.id} className="adm-grant-cell">
                    {c.code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="adm-grants-default">
                <td className="adm-cell-main">Mọi người (mặc định)</td>
                {data.certs.map((c) => (
                  <td key={c.id} className="adm-grant-cell">
                    <input
                      type="checkbox"
                      aria-label={`${c.code} cho mọi người`}
                      checked={data.defaults.includes(c.id)}
                      disabled={saving !== null}
                      onChange={() => toggle('default', c.id)}
                    />
                  </td>
                ))}
              </tr>
              {rows.length === 0 && (
                <tr className="adm-empty-row">
                  <td colSpan={data.certs.length + 1}>
                    {mode === 'profile' ? 'Chưa có hồ sơ học nào.' : 'Chưa mời ai (hoặc mọi lời mời đã bị thu hồi).'}
                  </td>
                </tr>
              )}
              {page.items.map((r) => (
                <tr key={r.subject}>
                  <td>
                    <div className="adm-cell-main">{r.label}</div>
                    {r.sub && <div className="adm-cell-sub">{r.sub}</div>}
                  </td>
                  {data.certs.map((c) => {
                    const byDefault = data.defaults.includes(c.id)
                    return (
                      <td key={c.id} className="adm-grant-cell">
                        <input
                          type="checkbox"
                          aria-label={`${c.code} cho ${r.label}`}
                          title={byDefault ? 'Đã mở cho mọi người' : undefined}
                          checked={byDefault || (data.grants[r.subject] ?? []).includes(c.id)}
                          disabled={byDefault || saving !== null}
                          onChange={() => toggle(r.subject, c.id)}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <Pager p={page} unit={mode === 'profile' ? 'hồ sơ' : 'người'} />
        </div>
      )}
    </div>
  )
}
