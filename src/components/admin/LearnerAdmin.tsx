'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdminAction } from '@/components/admin/AdminDialog'
import { MascotEm } from '@/components/mascot/MascotDialog'
import type { LearnerSummary } from '@/lib/learner/admin'

const fmt = (iso: string) => new Date(iso).toLocaleString('vi-VN')

function progressText(reviewed: number, correct: number, wrong: number, decks?: number) {
  const parts = [reviewed > 0 ? `${reviewed} thẻ đã ôn · ✓${correct} ✕${wrong}` : 'chưa ôn thẻ nào']
  if (decks) parts.push(`${decks} bộ từ`)
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
    <div>
      <div className="ad-toolbar">
        <h2 className="ih-font-hand ad-subtitle">Hồ sơ học{learners ? ` (${learners.length})` : ''}</h2>
        <input className="ih-input ad-search" type="search" placeholder="Tìm theo tên hồ sơ…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="button" className="ih-btn-outline" onClick={load}>
          Tải lại
        </button>
      </div>
      <p className="ad-note">
        Hồ sơ dùng chung cho cả app Tiếng Trung và Tiếng Hàn. Đổi tên thì tiến độ đi theo tên mới; xoá thì mất toàn bộ tiến độ của hồ sơ đó.
      </p>

      {loadError && <p className="ih-vocab-empty ad-error">{loadError}</p>}
      {!loadError && learners === null && <p className="ih-vocab-empty">Đang tải…</p>}
      {learners && shown.length === 0 && <p className="ih-vocab-empty">{learners.length === 0 ? 'Chưa có hồ sơ nào.' : 'Không có hồ sơ nào khớp.'}</p>}

      <div className="ad-list">
        {shown.map((l) => {
          return (
            <div key={l.id} className="ih-glass ad-learner">
              <div className="ad-avatar" aria-hidden="true">
                {l.registered ? l.id.charAt(0).toUpperCase() : '?'}
              </div>

              <div className="ad-learner-main">
                <div className="ad-learner-name">
                  <span className="ad-name-text">{l.id}</span>
                  {!l.registered && (
                    <span className="ad-badge" title="Hồ sơ cũ, tạo từ trước khi có popup đặt tên — đổi tên để đăng ký">
                      {l.id === 'legacy' ? 'Dữ liệu cũ' : 'Chưa đặt tên'}
                    </span>
                  )}
                </div>

                <div className="ad-meta">
                  {l.createdAt ? `Tạo ${fmt(l.createdAt)} · ` : ''}
                  {l.lastActiveAt ? `Học gần nhất ${fmt(l.lastActiveAt)}` : 'Chưa từng ôn thẻ'}
                </div>
                <div className="ad-meta">
                  <strong>中文</strong> {progressText(l.chinese.reviewed, l.chinese.correct, l.chinese.wrong, l.chinese.decks)}
                </div>
                <div className="ad-meta">
                  <strong>한국어</strong> {progressText(l.korean.reviewed, l.korean.correct, l.korean.wrong)}
                </div>
              </div>

              <div className="ad-actions">
                <button type="button" className="ih-btn-outline" onClick={() => rename(l)}>
                  Đổi tên
                </button>
                <button type="button" className="ih-btn-outline ad-danger" onClick={() => remove(l)}>
                  Xoá
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
