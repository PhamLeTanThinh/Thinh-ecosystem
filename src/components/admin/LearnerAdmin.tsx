'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdminAction } from '@/components/admin/AdminDialog'
import { formatAdminDate } from '@/components/admin/format'
import { MascotEm } from '@/components/mascot/MascotDialog'
import type { LearnerSummary } from '@/lib/learner/admin'


function progressText(reviewed: number, correct: number, wrong: number, decks?: number, addedCards?: number) {
  const parts = [reviewed > 0 ? `${reviewed} thẻ đã ôn · ✓${correct} ✕${wrong}` : 'chưa ôn thẻ nào']
  if (decks) parts.push(`${decks} bộ từ`)
  if (addedCards) parts.push(`${addedCards} thẻ tự thêm`)
  return parts.join(' · ')
}

// Tab "Hồ sơ học" của trang /admin — hồ sơ của app Chinese + Korean (dùng chung 1 hồ sơ, xem lib/learner/identity.ts).
// Chủ xem được ai đang học gì, đổi tên hồ sơ (dữ liệu đi theo) hoặc xoá hẳn. Việc thực thi quyền nằm ở API
// /api/admin/learners (requireAdminApi). Đổi tên/xoá đi qua popup mèo hỏi–xong của AdminDialog, không dùng window.confirm.
export function LearnerAdmin() {
  const runAction = useAdminAction()
  const [learners, setLearners] = useState<LearnerSummary[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const load = useCallback(async () => {
    setLoadError(null)
    try {
      const res = await fetch('/api/admin/learners')
      if (res.status === 403) throw new Error('Phiên đăng nhập đã hết hạn — tải lại trang để đăng nhập lại nhé.')
      if (!res.ok) throw new Error('Không tải được danh sách hồ sơ, thử lại sau.')
      setLearners(await res.json())
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Không tải được danh sách hồ sơ.')
    }
  }, [])

  useEffect(() => {
    // Gọi load() trong effect là đúng chỗ để đồng bộ với API bên ngoài; setState chạy sau await nên không gây render dây chuyền.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (learners ?? []).filter((l) => !q || l.id.toLowerCase().includes(q))
  }, [learners, query])

  function rename(l: LearnerSummary) {
    return runAction({
      bubble: (
        <>
          Ông chủ muốn đổi tên hồ sơ <MascotEm>{l.id}</MascotEm> thành gì nè?
        </>
      ),
      sub: 'Tiến độ học (cả tiếng Trung lẫn tiếng Hàn) sẽ đi theo tên mới nha 🐾',
      confirmLabel: 'Đổi tên nè',
      input: {
        placeholder: 'Tên mới (chữ thường, số, - hoặc _)',
        initial: l.registered ? l.id : '',
        maxLength: 24,
        hint: 'Từ 3 ký tự, bắt đầu bằng chữ cái; gồm chữ, số, gạch ngang hoặc gạch dưới.',
      },
      run: async (username) => {
        const res = await fetch(`/api/admin/learners/${encodeURIComponent(l.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) return { ok: false, error: data.error ?? 'Chưa đổi được rồi, ông chủ thử lại sau chút nha' }
        await load()
        return {
          ok: true,
          bubble: (
            <>
              Đã đổi tên rồi nè! <MascotEm>{l.id}</MascotEm> giờ là <MascotEm>{data.id ?? username}</MascotEm> 🎉
            </>
          ),
          sub: 'Tiến độ học đã đi theo tên mới rồi nha 🐾',
        }
      },
    })
  }

  function remove(l: LearnerSummary) {
    return runAction({
      bubble: (
        <>
          Xoá hẳn hồ sơ <MascotEm>{l.id}</MascotEm> hả ông chủ?
        </>
      ),
      sub: (
        <>
          Toàn bộ tiến độ, cài đặt và bộ từ (cả tiếng Trung lẫn tiếng Hàn) sẽ mất luôn, không khôi phục được đâu nha! Thẻ từ vựng dùng chung thì vẫn còn.
          {l.id === 'legacy' && ' Đây là dữ liệu học cũ của ông chủ đó, nghĩ kỹ nha!'}
        </>
      ),
      confirmLabel: 'Xoá luôn',
      danger: true,
      run: async () => {
        const res = await fetch(`/api/admin/learners/${encodeURIComponent(l.id)}`, { method: 'DELETE' })
        if (!res.ok) return { ok: false, error: 'Chưa xoá được rồi, ông chủ thử lại sau chút nha' }
        setLearners((v) => (v ? v.filter((x) => x.id !== l.id) : v))
        return {
          ok: true,
          bubble: (
            <>
              Đã xoá hồ sơ <MascotEm>{l.id}</MascotEm> rồi nha
            </>
          ),
        }
      },
    })
  }

  return (
    <div className="adm-panel">
      <div className="adm-toolbar">
        <h2 className="adm-panel-title">
          Hồ sơ học {learners && <span className="adm-count">{learners.length}</span>}
        </h2>
        <input className="adm-input adm-search" type="search" placeholder="Tìm theo tên hồ sơ…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="button" className="adm-btn adm-btn-outline" onClick={load}>
          Tải lại
        </button>
      </div>
      <p className="adm-note">
        Hồ sơ dùng chung cho cả app Tiếng Trung và Tiếng Hàn. Đổi tên thì tiến độ đi theo tên mới; xoá thì mất toàn bộ tiến độ của hồ sơ đó.
      </p>

      {loadError && <p className="adm-note adm-error">{loadError}</p>}

      {!loadError && (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Hồ sơ</th>
                <th>Hoạt động</th>
                <th>中文</th>
                <th>한국어</th>
                <th className="adm-col-actions">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {learners === null && (
                <tr className="adm-empty-row">
                  <td colSpan={5}>Đang tải…</td>
                </tr>
              )}
              {learners && shown.length === 0 && (
                <tr className="adm-empty-row">
                  <td colSpan={5}>{learners.length === 0 ? 'Chưa có hồ sơ nào.' : 'Không có hồ sơ nào khớp.'}</td>
                </tr>
              )}
              {shown.map((l) => (
                <tr key={l.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div className="adm-avatar" aria-hidden="true">
                        {l.registered ? l.id.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <div className="adm-cell-main">{l.id}</div>
                        {!l.registered && (
                          <span className="adm-pill adm-pill-warning" title="Hồ sơ cũ, tạo từ trước khi có popup đặt tên — đổi tên để đăng ký">
                            {l.id === 'legacy' ? 'Dữ liệu cũ' : 'Chưa đặt tên'}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="adm-cell-sub">
                    {l.createdAt ? `Tạo ${formatAdminDate(l.createdAt)}` : ''}
                    {l.createdAt && <br />}
                    {l.lastActiveAt ? `Gần nhất ${formatAdminDate(l.lastActiveAt)}` : 'Chưa từng ôn thẻ'}
                  </td>
                  <td className="adm-cell-sub">{progressText(l.chinese.reviewed, l.chinese.correct, l.chinese.wrong, l.chinese.decks, l.chinese.addedCards)}</td>
                  <td className="adm-cell-sub">{progressText(l.korean.reviewed, l.korean.correct, l.korean.wrong, undefined, l.korean.addedCards)}</td>
                  <td className="adm-col-actions">
                    <div className="adm-actions">
                      <button type="button" className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => rename(l)}>
                        Đổi tên
                      </button>
                      <button type="button" className="adm-btn adm-btn-outline adm-danger adm-btn-sm" onClick={() => remove(l)}>
                        Xoá
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
