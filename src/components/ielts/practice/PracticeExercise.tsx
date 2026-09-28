'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { loadExerciseProgress, type ExerciseSummary, type SetStatus } from '@/lib/ielts/practice'
import { accentVars, skillLabel } from '@/lib/ielts/skills'
import type { Skill } from '@/lib/ielts/types'
import { ProgressBanner } from './ProgressBanner'

// Cùng quy tắc trạng thái với Vocab set: làm đúng hết câu = xong, đúng ≥1 câu = đang làm, chưa câu nào = chưa làm.
function setStatus(solved: number, total: number): SetStatus {
  if (total > 0 && solved >= total) return 'done'
  return solved > 0 ? 'doing' : 'todo'
}

// Trang danh sách Bài tập (ghép câu) của 1 kỹ năng — cùng khung với PracticeVocab, chỉ đổi nguồn tiến độ.
export function PracticeExercise({ skill, sets }: { skill: Skill; sets: ExerciseSummary[] }) {
  const [progress, setProgress] = useState<Record<string, string[]>>({})
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<SetStatus | 'all'>('all')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadExerciseProgress())
  }, [])

  const rows = useMemo(
    () =>
      sets.map((s) => {
        // Bài đã sửa/xoá câu thì số câu đã làm cũ có thể vượt quá total hiện tại — kẹp lại cho chắc.
        const solved = Math.min((progress[s.id] ?? []).length, s.questionCount)
        return { s, solved, status: setStatus(solved, s.questionCount) }
      }),
    [sets, progress],
  )

  const done = rows.filter((r) => r.status === 'done').length
  const doing = rows.filter((r) => r.status === 'doing').length

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase()
    if (q && !r.s.title.toLowerCase().includes(q)) return false
    return statusFilter === 'all' || r.status === statusFilter
  })

  const title = done + doing === 0 ? 'Bạn chưa làm Bài tập nào' : done === 0 ? `Bạn đang làm ${doing} bài` : `Bạn đã hoàn thành ${done} bài và đang làm ${doing} bài`

  return (
    <div className="ih-pr" style={accentVars(skill)}>
      <ProgressBanner
        heading={`Bài tập ${skillLabel(skill)}`}
        title={title}
        sub={done + doing === 0 ? 'Chọn một bài bên dưới để bắt đầu ghép câu nhé!' : 'Tiếp tục hoàn thành các bài còn lại nhé!'}
        done={done}
        doing={doing}
        total={sets.length}
      />

      <div className="ih-pr-filters">
        <input className="ih-pr-search" placeholder="Tìm bài…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="ih-pr-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as SetStatus | 'all')} aria-label="Trạng thái">
          <option value="all">Trạng thái</option>
          <option value="todo">Chưa làm</option>
          <option value="doing">Đang làm</option>
          <option value="done">Đã xong</option>
        </select>
      </div>

      <div className="ih-les-grid">
        {filtered.map(({ s, solved, status }, i) => (
          <Link key={s.id} href={`/ielts/${skill}/exercise/${s.id}`} className="ih-les-card">
            <span className="ih-les-num">{i + 1}</span>
            <span className="ih-les-body">
              <span className="ih-les-cap ih-les-cap-row">
                <span className={`ih-pr-status ${status}`} aria-hidden>
                  {status === 'done' ? '✓' : ''}
                </span>
                {skillLabel(s.skill)} · Bài tập
              </span>
              <span className="ih-les-title">{s.title}</span>
              <span className="ih-les-part">↳ {s.part}</span>
              <span className="ih-pr-chips">
                <span className={`ih-pr-chip ${status === 'done' ? 'ih-pr-chip-score' : status === 'doing' ? 'ih-pr-chip-doing' : 'ih-pr-chip-todo'}`}>
                  Đã đúng {solved}/{s.questionCount} {s.kind === 'matching' ? 'vòng' : 'câu'}
                </span>
              </span>
            </span>
            <span className="ih-les-arrow" aria-hidden>
              →
            </span>
          </Link>
        ))}
        {filtered.length === 0 && <p className="ih-pr-empty">{sets.length === 0 ? 'Chưa có Bài tập nào.' : 'Không có bài khớp bộ lọc.'}</p>}
      </div>
    </div>
  )
}
