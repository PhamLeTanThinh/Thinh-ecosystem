'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdminAction } from '@/components/admin/AdminDialog'
import { ago, avatarColor, formatAdminDate } from '@/components/admin/format'
import { Pager, usePagination } from '@/components/admin/Pagination'
import { MascotEm } from '@/components/mascot/MascotDialog'
import type { AppStats, CertStats, LearnerSummary, LearnerTotals } from '@/lib/learner/admin'

type Filter = 'all' | 'active' | 'idle' | 'empty'
type Sort = 'recent' | 'name' | 'created' | 'cards'

const DAY = 24 * 60 * 60 * 1000

const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0)
const hasActivity = (l: LearnerSummary) => l.chinese.reviewed + l.korean.reviewed + l.certs.questions + l.certs.attempts > 0
const totalCards = (l: LearnerSummary) => l.chinese.reviewed + l.korean.reviewed

// Tab "Hồ sơ học" của trang /admin — hồ sơ dùng chung cho Chinese + Korean + Certs (xem lib/learner/identity.ts).
// Bên ngoài là bảng danh sách (cùng kiểu tab Người xem IELTS): trạng thái, ngày tạo, hoạt động gần nhất, tóm tắt
// tiến độ mỗi app. Bấm 1 dòng / "Chi tiết" → popup đủ 3 khối tiến độ (中文, 한국어, Certs): % đã thuộc, độ chính xác,
// thẻ đang sai, lần học gần nhất, bộ từ… Phía trên là số liệu tổng + lọc / sắp xếp.
// Đổi tên / xoá đi qua popup mèo hỏi–xong của AdminDialog (API /api/admin/learners, requireAdminApi).
export function LearnerAdmin() {
  const runAction = useAdminAction()
  const [learners, setLearners] = useState<LearnerSummary[] | null>(null)
  const [totals, setTotals] = useState<LearnerTotals>({ chineseCards: 0, koreanCards: 0 })
  const [loadError, setLoadError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('recent')
  const [detail, setDetail] = useState<string | null>(null) // id hồ sơ đang xem chi tiết (popup)

  const load = useCallback(async () => {
    setLoadError(null)
    try {
      const res = await fetch('/api/admin/learners')
      if (res.status === 403) throw new Error('Phiên đăng nhập đã hết hạn — tải lại trang để đăng nhập lại nhé.')
      if (!res.ok) throw new Error('Không tải được danh sách hồ sơ, thử lại sau.')
      const data = (await res.json()) as { learners: LearnerSummary[]; totals: LearnerTotals }
      setLearners(data.learners)
      setTotals(data.totals)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Không tải được danh sách hồ sơ.')
    }
  }, [])

  useEffect(() => {
    // Gọi load() trong effect là đúng chỗ để đồng bộ với API bên ngoài; setState chạy sau await nên không gây render dây chuyền.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  // Mốc "hoạt động 7 ngày" tính 1 lần mỗi lần có dữ liệu mới (không gọi Date.now() trong lúc render)
  const [now, setNow] = useState(0)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now())
  }, [learners])
  const isActive = useCallback((l: LearnerSummary) => !!l.lastActiveAt && now - new Date(l.lastActiveAt).getTime() < 7 * DAY, [now])

  const summary = useMemo(() => {
    const list = learners ?? []
    return {
      total: list.length,
      registered: list.filter((l) => l.registered).length,
      active: list.filter(isActive).length,
      empty: list.filter((l) => !hasActivity(l)).length,
      zh: list.reduce((s, l) => s + l.chinese.reviewed, 0),
      ko: list.reduce((s, l) => s + l.korean.reviewed, 0),
      certs: list.reduce((s, l) => s + l.certs.attempts, 0),
    }
  }, [learners, isActive])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = (learners ?? []).filter((l) => {
      if (q && !l.id.toLowerCase().includes(q)) return false
      if (filter === 'active') return isActive(l)
      if (filter === 'idle') return hasActivity(l) && !isActive(l)
      if (filter === 'empty') return !hasActivity(l)
      return true
    })
    const by: Record<Sort, (a: LearnerSummary, b: LearnerSummary) => number> = {
      recent: () => 0, // API đã xếp sẵn theo hoạt động gần nhất
      name: (a, b) => a.id.localeCompare(b.id),
      created: (a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''),
      cards: (a, b) => totalCards(b) - totalCards(a),
    }
    return [...list].sort(by[sort])
  }, [learners, query, filter, sort, isActive])
  const learnerPage = usePagination(shown, 10, `${filter}|${query}|${sort}`)

  const detailOf = detail ? (learners ?? []).find((x) => x.id === detail) : undefined

  function rename(l: LearnerSummary) {
    return runAction({
      bubble: (
        <>
          Ông chủ muốn đổi tên hồ sơ <MascotEm>{l.id}</MascotEm> thành gì nè?
        </>
      ),
      sub: 'Tiến độ học (tiếng Trung, tiếng Hàn và luyện đề Certs) sẽ đi theo tên mới nha 🐾',
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
          Toàn bộ tiến độ, cài đặt, bộ từ và lịch sử luyện đề (tiếng Trung, tiếng Hàn, Certs) sẽ mất luôn, không khôi phục được đâu nha! Thẻ từ vựng dùng chung thì
          vẫn còn.
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

  const FILTERS: [Filter, string, number][] = [
    ['all', 'Tất cả', summary.total],
    ['active', 'Hoạt động 7 ngày', summary.active],
    ['idle', 'Lâu không học', summary.total - summary.active - summary.empty],
    ['empty', 'Chưa học gì', summary.empty],
  ]

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
        Hồ sơ dùng chung cho app Tiếng Trung, Tiếng Hàn và luyện đề Certs. Đổi tên thì tiến độ đi theo tên mới; xoá thì mất toàn bộ tiến độ của hồ sơ đó.
      </p>

      {loadError && <p className="adm-note adm-error">{loadError}</p>}

      {!loadError && learners && (
        <>
          <div className="lad-stats">
            <Stat label="Hồ sơ" value={summary.total} sub={`${summary.registered} đã đặt tên`} />
            <Stat label="Hoạt động 7 ngày" value={summary.active} sub={`${pct(summary.active, summary.total)}% hồ sơ`} tone="success" />
            <Stat label="Thẻ đã ôn · 中文" value={summary.zh} sub={`trên ${totals.chineseCards.toLocaleString('vi-VN')} thẻ`} />
            <Stat label="Thẻ đã ôn · 한국어" value={summary.ko} sub={`trên ${totals.koreanCards.toLocaleString('vi-VN')} thẻ`} />
            <Stat label="Lượt luyện Certs" value={summary.certs} sub="đã lưu điểm" />
          </div>

          <div className="lad-filters">
            <div className="lad-chips">
              {FILTERS.map(([k, label, n]) => (
                <button key={k} type="button" className={`lad-chip${filter === k ? ' on' : ''}`} onClick={() => setFilter(k)}>
                  {label} <span>{n}</span>
                </button>
              ))}
            </div>
            <label className="lad-sort">
              Sắp xếp
              <select className="adm-input" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="recent">Hoạt động gần nhất</option>
                <option value="cards">Ôn nhiều thẻ nhất</option>
                <option value="created">Mới tạo</option>
                <option value="name">Tên A–Z</option>
              </select>
            </label>
          </div>
        </>
      )}

      {!loadError && (
        <div className="adm-table-wrap">
          <table className="adm-table lad-table">
            <thead>
              <tr>
                <th>Hồ sơ</th>
                <th>Trạng thái</th>
                <th>Hoạt động gần nhất</th>
                <th>中文</th>
                <th>한국어</th>
                <th>Certs</th>
                <th className="adm-col-actions">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {learners === null && (
                <tr className="adm-empty-row">
                  <td colSpan={7}>Đang tải…</td>
                </tr>
              )}
              {learners && shown.length === 0 && (
                <tr className="adm-empty-row">
                  <td colSpan={7}>{learners.length === 0 ? 'Chưa có hồ sơ nào.' : 'Không có hồ sơ nào khớp.'}</td>
                </tr>
              )}
              {learnerPage.items.map((l) => (
                <tr key={l.id} className="lad-row" onClick={() => setDetail(l.id)}>
                  <td>
                    <div className="lad-who">
                      <div className="lad-avatar lad-avatar-sm" style={{ background: avatarColor(l.id) }} aria-hidden="true">
                        {l.registered ? l.id.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <div className="adm-cell-main">{l.id}</div>
                        <div className="adm-cell-sub">Tạo {l.createdAt ? formatAdminDate(l.createdAt).slice(0, 11) : '—'}</div>
                        {!l.registered && <span className="adm-pill adm-pill-warning">{l.id === 'legacy' ? 'Dữ liệu cũ' : 'Chưa đặt tên'}</span>}
                      </div>
                    </div>
                  </td>
                  <td data-label="Trạng thái">
                    <StatusPill l={l} active={isActive(l)} />
                  </td>
                  <td data-label="Hoạt động gần nhất" className="adm-cell-sub" title={l.lastActiveAt ? formatAdminDate(l.lastActiveAt) : undefined}>
                    {l.lastActiveAt ? ago(l.lastActiveAt) : 'Chưa có'}
                  </td>
                  <td data-label="中文">
                    <AppCell s={l.chinese} total={totals.chineseCards} />
                  </td>
                  <td data-label="한국어">
                    <AppCell s={l.korean} total={totals.koreanCards} />
                  </td>
                  <td data-label="Certs">
                    {l.certs.questions + l.certs.attempts > 0 ? (
                      <div className="lad-cell">
                        <b>{l.certs.avgScore ?? '—'}%</b> <span className="adm-cell-sub">TB · {l.certs.attempts} lượt</span>
                      </div>
                    ) : (
                      <span className="adm-cell-sub">—</span>
                    )}
                  </td>
                  <td className="adm-col-actions" onClick={(e) => e.stopPropagation()}>
                    <div className="adm-actions">
                      <button type="button" className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => setDetail(l.id)}>
                        Chi tiết
                      </button>
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
          <Pager p={learnerPage} unit="hồ sơ" />
        </div>
      )}

      {detailOf && (
        <DetailModal
          l={detailOf}
          active={isActive(detailOf)}
          totals={totals}
          onClose={() => setDetail(null)}
          // Đóng popup chi tiết để hiện popup xác nhận; bấm "Thôi" thì mở lại chi tiết như cũ
          onRename={() => {
            setDetail(null)
            void rename(detailOf).then((ok) => !ok && setDetail(detailOf.id))
          }}
          onRemove={() => {
            setDetail(null)
            void remove(detailOf).then((ok) => !ok && setDetail(detailOf.id))
          }}
        />
      )}
    </div>
  )
}

function StatusPill({ l, active }: { l: LearnerSummary; active: boolean }) {
  if (active) return <span className="adm-pill adm-pill-success">● Đang học</span>
  return <span className="adm-pill adm-pill-neutral">{hasActivity(l) ? 'Lâu không học' : 'Chưa học gì'}</span>
}

// Ô tóm tắt 1 app trong bảng: số thẻ đã thuộc / tổng + thanh nhỏ
function AppCell({ s, total }: { s: AppStats; total: number }) {
  if (s.reviewed === 0) return <span className="adm-cell-sub">—</span>
  return (
    <div className="lad-cell">
      <div>
        <b>{s.learned}</b> <span className="adm-cell-sub">/ {total.toLocaleString('vi-VN')} thuộc</span>
      </div>
      <div className="lad-bar lad-bar-sm">
        <span className="ok" style={{ width: `${pct(s.learned, total)}%` }} />
        <span className="bad" style={{ width: `${pct(s.wrongNow, total)}%` }} />
      </div>
    </div>
  )
}

// Popup chi tiết 1 hồ sơ: thông tin chung + 3 khối tiến độ (中文, 한국어, Certs) + đổi tên / xoá
function DetailModal({
  l,
  active,
  totals,
  onClose,
  onRename,
  onRemove,
}: {
  l: LearnerSummary
  active: boolean
  totals: LearnerTotals
  onClose: () => void
  onRename: () => void
  onRemove: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="lad-backdrop" onClick={onClose}>
      <div className="lad-modal" role="dialog" aria-modal="true" aria-label={`Chi tiết hồ sơ ${l.id}`} onClick={(e) => e.stopPropagation()}>
        <header className="lad-head">
          <div className="lad-avatar" style={{ background: avatarColor(l.id) }} aria-hidden="true">
            {l.registered ? l.id.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="lad-id">
            <div className="lad-name">
              {l.id}
              <StatusPill l={l} active={active} />
              {!l.registered && <span className="adm-pill adm-pill-warning">{l.id === 'legacy' ? 'Dữ liệu cũ' : 'Chưa đặt tên'}</span>}
            </div>
            <div className="lad-dates">
              <span>Tạo {l.createdAt ? formatAdminDate(l.createdAt) : '—'}</span>
              <span>
                Hoạt động gần nhất: <b>{l.lastActiveAt ? `${ago(l.lastActiveAt)} · ${formatAdminDate(l.lastActiveAt)}` : 'chưa có'}</b>
              </span>
            </div>
          </div>
          <button type="button" className="lad-close" aria-label="Đóng" onClick={onClose}>
            ✕
          </button>
        </header>
        <div className="lad-apps">
          <AppBlock title="中文 · Tiếng Trung" s={l.chinese} total={totals.chineseCards} />
          <AppBlock title="한국어 · Tiếng Hàn" s={l.korean} total={totals.koreanCards} />
          <CertBlock s={l.certs} />
        </div>
        <footer className="lad-foot">
          <button type="button" className="adm-btn adm-btn-outline adm-btn-sm" onClick={onRename}>
            Đổi tên
          </button>
          <button type="button" className="adm-btn adm-btn-outline adm-danger adm-btn-sm" onClick={onRemove}>
            Xoá hồ sơ
          </button>
          <button type="button" className="adm-btn adm-btn-primary adm-btn-sm" onClick={onClose}>
            Đóng
          </button>
        </footer>
      </div>
    </div>
  )
}

function Stat({ label, value, sub, tone }: { label: string; value: number; sub: string; tone?: 'success' }) {
  return (
    <div className={`lad-stat${tone ? ` ${tone}` : ''}`}>
      <span className="lad-stat-label">{label}</span>
      <b>{value.toLocaleString('vi-VN')}</b>
      <small>{sub}</small>
    </div>
  )
}

// Khối tiến độ 1 app: % đã thuộc (trên tổng thẻ gốc), độ chính xác, thẻ đang sai, lần ôn gần nhất, bộ từ / thẻ tự thêm
function AppBlock({ title, s, total }: { title: string; s: AppStats; total: number }) {
  const answers = s.correct + s.wrong
  return (
    <section className={`lad-app${s.reviewed ? '' : ' none'}`}>
      <h4>{title}</h4>
      {s.reviewed === 0 ? (
        <p className="lad-none">Chưa ôn thẻ nào</p>
      ) : (
        <>
          <div className="lad-bar" title={`${s.learned} thuộc · ${s.wrongNow} đang sai · ${total - s.reviewed} chưa ôn`}>
            <span className="ok" style={{ width: `${pct(s.learned, total)}%` }} />
            <span className="bad" style={{ width: `${pct(s.wrongNow, total)}%` }} />
          </div>
          <p className="lad-big">
            <b>{s.learned}</b> / {total.toLocaleString('vi-VN')} thẻ đã thuộc <span className="lad-muted">({pct(s.learned, total)}%)</span>
          </p>
          <ul className="lad-kv">
            <li>
              <span>Đã ôn</span>
              <b>{s.reviewed} thẻ</b>
            </li>
            <li>
              <span>Đang sai</span>
              <b className={s.wrongNow ? 'bad' : ''}>{s.wrongNow}</b>
            </li>
            <li>
              <span>Chính xác</span>
              <b>
                {pct(s.correct, answers)}% <small>(✓{s.correct} ✕{s.wrong})</small>
              </b>
            </li>
            <li>
              <span>Gần nhất</span>
              <b title={s.lastAt ? formatAdminDate(s.lastAt) : undefined}>{ago(s.lastAt)}</b>
            </li>
          </ul>
          {(s.decks > 0 || s.addedCards > 0) && (
            <p className="lad-tags">
              {s.decks > 0 && <span className="adm-pill adm-pill-accent">{s.decks} bộ từ</span>}
              {s.addedCards > 0 && <span className="adm-pill adm-pill-accent">{s.addedCards} thẻ tự thêm</span>}
            </p>
          )}
        </>
      )}
    </section>
  )
}

function CertBlock({ s }: { s: CertStats }) {
  const answers = s.correct + s.wrong
  const has = s.questions + s.attempts > 0
  return (
    <section className={`lad-app${has ? '' : ' none'}`}>
      <h4>Certs · Luyện đề</h4>
      {!has ? (
        <p className="lad-none">Chưa luyện đề nào</p>
      ) : (
        <>
          <div className="lad-bar">
            <span className="ok" style={{ width: `${s.avgScore ?? pct(s.correct, answers)}%` }} />
          </div>
          <p className="lad-big">
            Điểm TB <b>{s.avgScore ?? '—'}%</b> <span className="lad-muted">qua {s.attempts} lượt</span>
          </p>
          <ul className="lad-kv">
            <li>
              <span>Câu đã làm</span>
              <b>{s.questions}</b>
            </li>
            <li>
              <span>Chính xác</span>
              <b>
                {pct(s.correct, answers)}% <small>(✓{s.correct} ✕{s.wrong})</small>
              </b>
            </li>
            <li>
              <span>Gần nhất</span>
              <b title={s.lastAt ? formatAdminDate(s.lastAt) : undefined}>{ago(s.lastAt)}</b>
            </li>
          </ul>
          {s.certs.length > 0 && (
            <p className="lad-tags">
              {s.certs.map((c) => (
                <span key={c} className="adm-pill adm-pill-accent">
                  {c.toUpperCase()}
                </span>
              ))}
            </p>
          )}
        </>
      )}
    </section>
  )
}
