'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { SampleSummary } from '@/lib/ielts/practice'
import { accentVars, skillLabel } from '@/lib/ielts/skills'
import type { Skill } from '@/lib/ielts/types'
import { Pager, pageQuery, paginate, replaceQuery } from './Pager'
import { ProgressBanner } from './ProgressBanner'

export type TaskFilter = 'all' | 1 | 2 | 3

// Trang danh sách Đề mẫu của 1 kỹ năng — không có khái niệm "đã làm/đã qua" như Vocab/Bài tập (đây là bài
// đọc + ôn tập, không chấm điểm tổng), nên banner chỉ hiện số đề, không có thanh tiến độ done/doing.
// Số trang + bộ lọc task nằm trên URL (?page=&task=) để bấm Back từ trang đề quay lại đúng chỗ đang xem.
export function PracticeSamples({
  skill,
  samples,
  initialPage = 1,
  initialTask = 'all',
}: {
  skill: Skill
  samples: SampleSummary[]
  initialPage?: number
  initialTask?: TaskFilter
}) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(initialPage)
  const [task, setTask] = useState<TaskFilter>(initialTask)
  const tasks = ([1, 2, 3] as const).filter((t) => samples.some((s) => s.task === t))
  const taskWord = skill === 'speaking' ? 'Part' : 'Task'
  const filtered = samples.filter((s) => {
    const q = query.trim().toLowerCase()
    if (task !== 'all' && s.task !== task) return false
    return !q || s.title.toLowerCase().includes(q) || s.topic.toLowerCase().includes(q)
  })
  const { current, pageCount, start, visible } = paginate(filtered, page)

  function syncUrl(p: number, t: TaskFilter) {
    replaceQuery({ ...pageQuery(p), task: t !== 'all' ? String(t) : null })
  }

  function goTo(p: number) {
    setPage(p)
    syncUrl(p, task)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function changeTask(t: TaskFilter) {
    setTask(t)
    setPage(1)
    syncUrl(1, t)
  }

  return (
    <div className="ih-pr" style={accentVars(skill)}>
      <ProgressBanner
        heading={`Đề mẫu ${skillLabel(skill)}`}
        title={samples.length === 0 ? 'Chưa có đề mẫu nào' : `${samples.length} đề mẫu`}
        sub="Đọc bài mẫu, học từ vựng hay đi kèm, rồi làm 2 bài tập ôn lại ngay trong trang."
        done={0}
        doing={0}
        total={samples.length}
      />

      <div className="ih-pr-filters">
        <input
          className="ih-pr-search"
          placeholder="Tìm đề mẫu hoặc chủ đề…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (current !== 1) goTo(1)
          }}
        />
        {tasks.length > 1 && (
          <div className="ih-pr-tabs" role="group" aria-label="Lọc theo task">
            {(['all', ...tasks] as TaskFilter[]).map((t) => (
              <button key={t} type="button" className="ih-pr-tab" aria-pressed={task === t} onClick={() => changeTask(t)}>
                {t === 'all' ? 'Tất cả' : `${taskWord} ${t}`}
                <span className="ih-pr-tab-count">{t === 'all' ? samples.length : samples.filter((s) => s.task === t).length}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ih-les-grid">
        {visible.map((s, i) => (
          <Link key={s.id} href={`/ielts/${skill}/sample/${s.id}`} className="ih-les-card">
            <span className="ih-les-num">{start + i + 1}</span>
            <span className="ih-les-body">
              <span className="ih-les-cap ih-les-cap-row">{skillLabel(s.skill)} · {s.resourceLabel}</span>
              <span className="ih-les-title">{s.title}</span>
              <span className="ih-les-part">↳ {s.part} · {s.topic}</span>
            </span>
            <span className="ih-les-arrow" aria-hidden>
              →
            </span>
          </Link>
        ))}
        {filtered.length === 0 && <p className="ih-pr-empty">{samples.length === 0 ? 'Chưa có Đề mẫu nào.' : 'Không có đề khớp tìm kiếm.'}</p>}
      </div>

      <Pager current={current} pageCount={pageCount} start={start} shown={visible.length} total={filtered.length} onPage={goTo} />
    </div>
  )
}
