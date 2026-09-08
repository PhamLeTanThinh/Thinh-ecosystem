'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LESSON_NUMBERS, LESSON_TITLES } from '@/lib/korean/lessons'
import type { KoreanCard } from '@/lib/korean/types'

export type Selection = { type: 'overview' } | { type: 'lesson'; lesson: number }

interface Props {
  cards: KoreanCard[]
  isLearned: (cardId: string) => boolean
  selection: Selection
  onSelect: (s: Selection) => void
}

export function Sidebar({ cards, isLearned, selection, onSelect }: Props) {
  const [expanded, setExpanded] = useState<Set<'topik1' | 'topik2'>>(() => new Set(['topik2']))

  function toggle(key: 'topik1' | 'topik2') {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <aside className="kr-sidebar">
      <div className="kr-sidebar-title">한국어 공부</div>

      <div className="kr-topik-group">
        <button type="button" className="kr-topik-header" onClick={() => toggle('topik1')}>
          <span className="kr-topik-toggle">{expanded.has('topik1') ? '▾' : '▸'}</span>
          <span className="kr-topik-label">TOPIK I</span>
        </button>
        {expanded.has('topik1') && <p className="kr-topik-empty">Chưa có nội dung — sắp ra mắt</p>}
      </div>

      <div className="kr-topik-group">
        <button type="button" className="kr-topik-header" onClick={() => toggle('topik2')}>
          <span className="kr-topik-toggle">{expanded.has('topik2') ? '▾' : '▸'}</span>
          <span className="kr-topik-label">TOPIK II · Seoul Korean 2</span>
        </button>

        {expanded.has('topik2') && (
          <>
            <div className={`kr-lesson-row kr-overview-row${selection.type === 'overview' ? ' active' : ''}`}>
              <button type="button" className="kr-lesson-row-btn" onClick={() => onSelect({ type: 'overview' })}>
                <span className="kr-lesson-badge">✨</span>
                <span className="kr-lesson-row-body">
                  <span className="kr-lesson-row-title">Tất cả bài học</span>
                  <span className="kr-lesson-row-meta">{cards.length} thẻ</span>
                </span>
              </button>
            </div>

            <div className="kr-lesson-list">
              {LESSON_NUMBERS.map((n) => {
                const lessonCards = cards.filter((c) => c.lesson === n)
                const learnedCount = lessonCards.filter((c) => isLearned(c.id)).length
                const active = selection.type === 'lesson' && selection.lesson === n
                return (
                  <div key={n} className={`kr-lesson-row${active ? ' active' : ''}`}>
                    <button type="button" className="kr-lesson-row-btn" onClick={() => onSelect({ type: 'lesson', lesson: n })}>
                      <span className="kr-lesson-badge">{n}과</span>
                      <span className="kr-lesson-row-body">
                        <span className="kr-lesson-row-title">{LESSON_TITLES[n]}</span>
                        <span className="kr-lesson-row-meta">
                          {learnedCount}/{lessonCards.length} thuộc
                        </span>
                      </span>
                    </button>
                    <span className="kr-lesson-row-actions">
                      <Link href={`/korean/study?lesson=${n}`} aria-label="Ôn tập" title="Ôn tập" className="kr-lesson-row-action">
                        🎴
                      </Link>
                      <Link href={`/korean/quiz?lesson=${n}`} aria-label="Kiểm tra" title="Kiểm tra" className="kr-lesson-row-action">
                        📝
                      </Link>
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
