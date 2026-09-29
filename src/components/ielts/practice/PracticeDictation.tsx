'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { loadDictationProgress, type DictationProgress, type SetStatus } from '@/lib/ielts/practice'
import { partLabel, type DictationSummary } from '@/lib/ielts/dictation'
import { accentVars, skillLabel } from '@/lib/ielts/skills'
import type { Skill } from '@/lib/ielts/types'
import { Pager, pageQuery, paginate, replaceQuery } from './Pager'
import { ProgressBanner } from './ProgressBanner'

function statusOf(done: number, total: number): SetStatus {
  if (total > 0 && done >= total) return 'done'
  return done > 0 ? 'doing' : 'todo'
}

// Trang danh sách bài Dictation của 1 kỹ năng (Listening): mỗi bài = 1 section của 1 đề CAM. Lọc theo quyển (Cambridge 9/16/18),
// phân trang; số trang + quyển nằm trên URL (?page=&book=) để bấm Back từ trang luyện quay lại đúng chỗ.
export function PracticeDictation({ skill, items, initialPage = 1, initialBook = 'all' }: { skill: Skill; items: DictationSummary[]; initialPage?: number; initialBook?: string }) {
  const [progress, setProgress] = useState<Record<string, DictationProgress>>({})
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<SetStatus | 'all'>('all')
  const [book, setBook] = useState(initialBook)
  const [page, setPage] = useState(initialPage)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadDictationProgress())
  }, [])

  const books = useMemo(() => [...new Map(items.map((d) => [d.book, d.bookNo])).entries()].sort((a, b) => a[1] - b[1]).map(([b]) => b), [items])
  const rows = useMemo(
    () =>
      items.map((d) => {
        const n = (progress[d.id]?.done ?? []).filter((i) => i < d.sentences).length
        return { d, n, status: statusOf(n, d.sentences) }
      }),
    [items, progress],
  )
  const done = rows.filter((r) => r.status === 'done').length
  const doing = rows.filter((r) => r.status === 'doing').length

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase()
    if (book !== 'all' && r.d.book !== book) return false
    if (q && !r.d.title.toLowerCase().includes(q) && !partLabel(r.d).toLowerCase().includes(q)) return false
    return statusFilter === 'all' || r.status === statusFilter
  })
  const { current, pageCount, start, visible } = paginate(filtered, page)

  const sync = (p: number, b: string) => replaceQuery({ ...pageQuery(p), book: b !== 'all' ? b : null })
  function goTo(p: number) {
    setPage(p)
    sync(p, book)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function changeBook(b: string) {
    setBook(b)
    setPage(1)
    sync(1, b)
  }

  const title = done + doing === 0 ? 'Bạn chưa luyện bài Dictation nào' : done === 0 ? `Bạn đang luyện ${doing} bài` : `Bạn đã hoàn thành ${done} bài và đang luyện ${doing} bài`

  return (
    <div className="ih-pr" style={accentVars(skill)}>
      <ProgressBanner
        heading={`Dictation ${skillLabel(skill)}`}
        title={title}
        sub="Nghe từng câu rồi chép lại — điền từng từ (EASY) hoặc gõ cả câu (HARD), có bản dịch và phát âm."
        done={done}
        doing={doing}
        total={items.length}
      />

      <div className="ih-pr-filters">
        <input
          className="ih-pr-search"
          placeholder="Tìm bài hoặc đề…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (current !== 1) goTo(1)
          }}
        />
        <select
          className="ih-pr-select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as SetStatus | 'all')
            if (current !== 1) goTo(1)
          }}
          aria-label="Trạng thái"
        >
          <option value="all">Trạng thái</option>
          <option value="todo">Chưa làm</option>
          <option value="doing">Đang làm</option>
          <option value="done">Đã xong</option>
        </select>
        {books.length > 1 && (
          <div className="ih-pr-tabs" role="group" aria-label="Lọc theo quyển">
            {['all', ...books].map((b) => (
              <button key={b} type="button" className="ih-pr-tab" aria-pressed={book === b} onClick={() => changeBook(b)}>
                {b === 'all' ? 'Tất cả' : b}
                <span className="ih-pr-tab-count">{b === 'all' ? items.length : items.filter((d) => d.book === b).length}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ih-les-grid">
        {visible.map(({ d, n, status }, i) => (
          <Link key={d.id} href={`/ielts/${skill}/dictation/${d.id}`} className="ih-les-card">
            <span className="ih-les-num">{start + i + 1}</span>
            <span className="ih-les-body">
              <span className="ih-les-cap ih-les-cap-row">
                <span className={`ih-pr-status ${status}`} aria-hidden>
                  {status === 'done' ? '✓' : ''}
                </span>
                {skillLabel(skill)} · Dictation
              </span>
              <span className="ih-les-title">{d.title}</span>
              <span className="ih-les-part">↳ {partLabel(d)}</span>
              <span className="ih-pr-chips">
                <span className={`ih-pr-chip ${status === 'done' ? 'ih-pr-chip-score' : status === 'doing' ? 'ih-pr-chip-doing' : 'ih-pr-chip-todo'}`}>
                  Đã đúng {n}/{d.sentences} câu
                </span>
                <span className="ih-pr-chip ih-pr-chip-todo">{d.words} từ</span>
              </span>
            </span>
            <span className="ih-les-arrow" aria-hidden>
              →
            </span>
          </Link>
        ))}
        {filtered.length === 0 && <p className="ih-pr-empty">{items.length === 0 ? 'Chưa có bài Dictation nào.' : 'Không có bài khớp bộ lọc.'}</p>}
      </div>

      <Pager current={current} pageCount={pageCount} start={start} shown={visible.length} total={filtered.length} onPage={goTo} />
    </div>
  )
}
