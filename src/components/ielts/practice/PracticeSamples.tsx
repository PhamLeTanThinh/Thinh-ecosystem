'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { SampleSummary } from '@/lib/ielts/practice'
import { accentVars, skillLabel } from '@/lib/ielts/skills'
import type { Skill } from '@/lib/ielts/types'
import { ProgressBanner } from './ProgressBanner'

// Trang danh sách Đề mẫu của 1 kỹ năng — không có khái niệm "đã làm/đã qua" như Vocab/Bài tập (đây là bài
// đọc + ôn tập, không chấm điểm tổng), nên banner chỉ hiện số đề, không có thanh tiến độ done/doing.
export function PracticeSamples({ skill, samples }: { skill: Skill; samples: SampleSummary[] }) {
  const [query, setQuery] = useState('')
  const filtered = samples.filter((s) => {
    const q = query.trim().toLowerCase()
    return !q || s.title.toLowerCase().includes(q) || s.topic.toLowerCase().includes(q)
  })

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
        <input className="ih-pr-search" placeholder="Tìm đề mẫu hoặc chủ đề…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="ih-les-grid">
        {filtered.map((s, i) => (
          <Link key={s.id} href={`/ielts/${skill}/sample/${s.id}`} className="ih-les-card">
            <span className="ih-les-num">{i + 1}</span>
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
    </div>
  )
}
