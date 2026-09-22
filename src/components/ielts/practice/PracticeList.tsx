'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { clearDraft, loadAttempts, loadDrafts, QUESTION_TYPES, type Attempt, type Draft, type QuestionType, type SetStatus, type TestSummary } from '@/lib/ielts/practice'
import { accentVars, skillLabel } from '@/lib/ielts/skills'
import type { Skill } from '@/lib/ielts/types'
import { ConfirmDialog } from './ConfirmDialog'
import { ProgressBanner } from './ProgressBanner'

// Đang làm dở (có bài nháp) được ưu tiên hơn "đã làm": đề đã nộp rồi nhưng đang làm lại thì vẫn tính là đang làm.
function statusOf(id: string, attempts: Record<string, Attempt>, drafts: Record<string, Draft>): SetStatus {
  if (drafts[id]) return 'doing'
  if (attempts[id]) return 'done'
  return 'todo'
}

// Icon nét (SVG) cho nút nổi — đổi màu theo currentColor.
function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const ICON_RESUME = (
  <Svg>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M10 8.5v7M14 8.5v7" />
  </Svg>
)
const ICON_START = (
  <Svg>
    <circle cx="12" cy="12" r="9.5" />
    <path d="m10.5 8.5 5 3.5-5 3.5z" />
  </Svg>
)
const ICON_REDO = (
  <Svg>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4.5V9h4.5" />
  </Svg>
)

// Danh sách đề của 1 kỹ năng. Bấm vào thẻ = sang trang chọn chế độ (URL riêng). Rê chuột vào thẻ thì hiện nút
// nổi ở góc phải: Làm tiếp / Làm lại / Bắt đầu, kèm menu ⋮ (Làm lại, Lịch sử làm bài, Xem giải thích).
export function PracticeList({ skill, tests }: { skill: Skill; tests: TestSummary[] }) {
  const router = useRouter()
  const base = `/ielts/${skill}/practice`
  const [attempts, setAttempts] = useState<Record<string, Attempt>>({})
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<QuestionType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<SetStatus | 'all'>('all')
  const [menuFor, setMenuFor] = useState<string | null>(null)
  const [restartFor, setRestartFor] = useState<TestSummary | null>(null)

  // localStorage chỉ đọc được ở client. Trang được mount lại mỗi lần quay về từ màn làm bài nên điểm
  // mới nộp / bài làm dở luôn được đọc lại.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttempts(loadAttempts())
    setDrafts(loadDrafts())
  }, [])

  // Đóng menu ⋮ khi bấm ra ngoài nút nổi hoặc nhấn Esc.
  useEffect(() => {
    if (!menuFor) return
    const onDown = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.ih-pr-actions')) setMenuFor(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuFor(null)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuFor])

  const counts = useMemo(() => {
    let done = 0
    let doing = 0
    for (const t of tests) {
      const s = statusOf(t.id, attempts, drafts)
      if (s === 'done') done += 1
      else if (s === 'doing') doing += 1
    }
    return { done, doing }
  }, [tests, attempts, drafts])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tests.filter((t) => {
      if (q && !t.title.toLowerCase().includes(q)) return false
      if (typeFilter !== 'all' && !t.questionTypes.includes(typeFilter)) return false
      if (statusFilter !== 'all' && statusOf(t.id, attempts, drafts) !== statusFilter) return false
      return true
    })
  }, [tests, query, typeFilter, statusFilter, attempts, drafts])

  // Làm lại từ đầu ở đúng chế độ đang làm dở: xoá nháp rồi mở đề mới (sau khi xác nhận trong hộp thoại).
  function restartDraft(t: TestSummary) {
    const draft = drafts[t.id]
    setRestartFor(null)
    if (!draft) return
    clearDraft(t.id)
    router.push(`${base}/${t.id}/run?mode=${draft.mode}`)
  }

  const title =
    counts.done + counts.doing === 0
      ? 'Bạn chưa làm đề nào'
      : `Bạn đã hoàn thành ${counts.done} bài và đang làm ${counts.doing} bài`

  return (
    <div className="ih-pr" style={accentVars(skill)}>
      <ProgressBanner
        heading={`Làm đề ${skillLabel(skill)}`}
        title={title}
        sub={counts.done + counts.doing === 0 ? 'Chọn một đề bên dưới để bắt đầu nhé!' : 'Tiếp tục tập trung hoàn thành các đề còn lại nhé!'}
        done={counts.done}
        doing={counts.doing}
        total={tests.length}
      />

      <div className="ih-pr-filters">
        <input className="ih-pr-search" placeholder="Tìm kiếm…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="ih-pr-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as QuestionType | 'all')} aria-label="Loại bài">
          <option value="all">Loại bài</option>
          {QUESTION_TYPES.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
        <select className="ih-pr-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as SetStatus | 'all')} aria-label="Trạng thái">
          <option value="all">Trạng thái</option>
          <option value="todo">Chưa làm</option>
          <option value="doing">Đang làm</option>
          <option value="done">Đã làm</option>
        </select>
      </div>

      <div className="ih-les-grid">
        {filtered.map((t) => {
          const status = statusOf(t.id, attempts, drafts)
          const a = attempts[t.id]
          const draft = drafts[t.id]
          const answered = draft ? Object.values(draft.answers).filter((v) => v.trim()).length : 0
          const menuOpen = menuFor === t.id
          const chooserHref = `${base}/${t.id}`

          return (
            <div key={t.id} className={`ih-les-card ih-pr-card-act ${status}${menuOpen ? ' open' : ''}`}>
              {/* Cả thẻ là 1 link (phủ kín, nằm dưới nút nổi) — không lồng nút vào <a> để HTML hợp lệ. */}
              <Link href={chooserHref} className="ih-pr-card-link" aria-label={t.title} />

              <span className="ih-les-num">{tests.indexOf(t) + 1}</span>
              <span className="ih-les-body">
                <span className="ih-les-cap ih-les-cap-row">
                  <span className={`ih-pr-status ${status}`} aria-hidden>
                    {status === 'done' ? '✓' : ''}
                  </span>
                  {skillLabel(t.skill)} · {t.category}
                </span>
                <span className="ih-les-title">{t.title}</span>
                <span className="ih-les-part">↳ {t.part}</span>
                <span className="ih-pr-chips">
                  {status === 'doing' && (
                    <span className="ih-pr-chip ih-pr-chip-doing">
                      Đang làm {answered}/{t.questionCount}
                    </span>
                  )}
                  {status !== 'doing' && a && (
                    <span className="ih-pr-chip ih-pr-chip-score">
                      Best score {a.best}/{a.total}
                    </span>
                  )}
                </span>
              </span>

              <div className="ih-pr-actions">
                <div className={`ih-pr-pill ${status}`}>
                  <button
                    type="button"
                    className="ih-pr-pill-main"
                    onClick={() => {
                      // Đang làm dở → vào lại đúng chế độ; còn lại → trang chọn chế độ.
                      if (status === 'doing' && draft) router.push(`${base}/${t.id}/run?mode=${draft.mode}`)
                      else router.push(chooserHref)
                    }}
                  >
                    {status === 'doing' ? ICON_RESUME : status === 'done' ? ICON_REDO : ICON_START}
                    <span>{status === 'doing' ? 'Làm tiếp' : status === 'done' ? 'Làm lại' : 'Bắt đầu'}</span>
                  </button>
                  {status !== 'todo' && (
                    <button
                      type="button"
                      className={`ih-pr-pill-more${menuOpen ? ' on' : ''}`}
                      aria-label="Thêm tuỳ chọn"
                      aria-haspopup="menu"
                      aria-expanded={menuOpen}
                      onClick={() => setMenuFor(menuOpen ? null : t.id)}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                        <circle cx="12" cy="5" r="1.7" />
                        <circle cx="12" cy="12" r="1.7" />
                        <circle cx="12" cy="19" r="1.7" />
                      </svg>
                    </button>
                  )}
                </div>

                {menuOpen && (
                  <div className="ih-pr-menu" role="menu">
                    {status === 'doing' && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMenuFor(null)
                          setRestartFor(t)
                        }}
                      >
                        Làm lại
                      </button>
                    )}
                    {a && (
                      <>
                        <Link role="menuitem" href={`${base}/${t.id}/history`}>
                          Lịch sử làm bài
                        </Link>
                        <Link role="menuitem" href={`${base}/${t.id}/review`}>
                          Xem giải thích
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <p className="ih-pr-empty">{tests.length === 0 ? 'Chưa có đề nào.' : 'Không có đề khớp bộ lọc.'}</p>}
      </div>

      {restartFor && (
        <ConfirmDialog
          title="Làm lại từ đầu?"
          confirmLabel="Làm lại"
          cancelLabel="Huỷ"
          tone="danger"
          onCancel={() => setRestartFor(null)}
          onConfirm={() => restartDraft(restartFor)}
        >
          <p>
            Đáp án bạn đang làm dở ở đề <strong>{restartFor.title}</strong> sẽ bị xoá và bài được bắt đầu lại từ đầu.
          </p>
        </ConfirmDialog>
      )}
    </div>
  )
}
