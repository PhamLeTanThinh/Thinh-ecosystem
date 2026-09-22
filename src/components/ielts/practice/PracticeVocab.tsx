'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { loadLearned, type SetStatus, type VocabGroup } from '@/lib/ielts/practice'
import { accentVars, skillLabel } from '@/lib/ielts/skills'
import type { Skill } from '@/lib/ielts/types'
import { ProgressBanner } from './ProgressBanner'

// Mỗi đề = 1 Vocab set. Thuộc hết từ = xong, đã thuộc ≥1 từ = đang làm, chưa thuộc từ nào = chưa làm.
function setStatus(learned: number, total: number): SetStatus {
  if (total > 0 && learned >= total) return 'done'
  return learned > 0 ? 'doing' : 'todo'
}

// Trang Vocab của 1 kỹ năng: banner tiến độ + danh sách Vocab set (bấm vào để học từng set).
export function PracticeVocab({ skill, groups }: { skill: Skill; groups: VocabGroup[] }) {
  const [learned, setLearned] = useState<Record<string, string[]>>({})
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<SetStatus | 'all'>('all')

  // localStorage chỉ đọc được ở client; trang mount lại mỗi lần quay về từ trang học nên tiến độ luôn mới.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLearned(loadLearned())
  }, [])

  const rows = useMemo(
    () =>
      groups.map((g) => {
        const words = new Set(g.vocab.map((v) => v.word))
        // Chỉ đếm từ còn tồn tại trong set (đề đã sửa/xoá từ thì số cũ không làm lệch tiến độ).
        const count = (learned[g.testId] ?? []).filter((w) => words.has(w)).length
        return { g, count, status: setStatus(count, g.vocab.length) }
      }),
    [groups, learned],
  )

  const done = rows.filter((r) => r.status === 'done').length
  const doing = rows.filter((r) => r.status === 'doing').length

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase()
    if (q && !r.g.testTitle.toLowerCase().includes(q) && !r.g.vocab.some((v) => v.word.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q))) return false
    return statusFilter === 'all' || r.status === statusFilter
  })

  const title = done + doing === 0 ? 'Bạn chưa học Vocab set nào' : done === 0 ? `Bạn đang làm ${doing} set` : `Bạn đã hoàn thành ${done} set và đang làm ${doing} set`

  return (
    <div className="ih-pr" style={accentVars(skill)}>
      <ProgressBanner
        heading={`Vocab ${skillLabel(skill)}`}
        title={title}
        sub={done + doing === 0 ? 'Chọn một Vocab set bên dưới để bắt đầu nhé!' : 'Tiếp tục tập trung hoàn thành các Vocab set còn lại nhé!'}
        done={done}
        doing={doing}
        total={groups.length}
      />

      <div className="ih-pr-filters">
        <input className="ih-pr-search" placeholder="Tìm set hoặc từ…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="ih-pr-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as SetStatus | 'all')} aria-label="Trạng thái">
          <option value="all">Trạng thái</option>
          <option value="todo">Chưa làm</option>
          <option value="doing">Đang làm</option>
          <option value="done">Đã xong</option>
        </select>
      </div>

      <div className="ih-les-grid">
        {filtered.map(({ g, count, status }, i) => (
          <Link key={g.testId} href={`/ielts/${skill}/vocab/${g.testId}`} className="ih-les-card">
            <span className="ih-les-num">{i + 1}</span>
            <span className="ih-les-body">
              <span className="ih-les-cap ih-les-cap-row">
                <span className={`ih-pr-status ${status}`} aria-hidden>
                  {status === 'done' ? '✓' : ''}
                </span>
                {skillLabel(g.skill)} · Vocab set
              </span>
              <span className="ih-les-title">{g.testTitle}</span>
              <span className="ih-les-part">↳ {g.part}</span>
              <span className="ih-pr-chips">
                <span className={`ih-pr-chip ${status === 'done' ? 'ih-pr-chip-score' : status === 'doing' ? 'ih-pr-chip-doing' : 'ih-pr-chip-todo'}`}>
                  Đã thuộc {count}/{g.vocab.length} từ
                </span>
              </span>
            </span>
            <span className="ih-les-arrow" aria-hidden>
              →
            </span>
          </Link>
        ))}
        {filtered.length === 0 && <p className="ih-pr-empty">{groups.length === 0 ? 'Chưa có Vocab set nào.' : 'Không có set khớp bộ lọc.'}</p>}
      </div>
    </div>
  )
}
