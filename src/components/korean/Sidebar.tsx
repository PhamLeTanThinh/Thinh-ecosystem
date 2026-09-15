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
  // Trên mobile, sidebar chuyển thành drawer trượt từ trái — ẩn/hiện qua 2 prop này thay vì tự
  // quản lý state riêng, để nút ☰ ở topbar (component khác) điều khiển được từ ngoài.
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ cards, isLearned, selection, onSelect, mobileOpen, onMobileClose }: Props) {
  const [expanded, setExpanded] = useState<Set<'topik1' | 'topik2'>>(() => new Set(['topik2']))

  function toggle(key: 'topik1' | 'topik2') {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // Chọn xong trên mobile thì đóng luôn drawer — trên desktop onMobileClose() không có tác dụng
  // gì (drawer không tồn tại về mặt hiển thị) nên gọi vô điều kiện cho đơn giản.
  function handleSelect(s: Selection) {
    onSelect(s)
    onMobileClose()
  }

  return (
    <>
      {mobileOpen && <div className="kr-sidebar-backdrop" onClick={onMobileClose} />}
      <aside className={`kr-sidebar${mobileOpen ? ' kr-sidebar-open' : ''}`}>
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
                <button type="button" className="kr-lesson-row-btn" onClick={() => handleSelect({ type: 'overview' })}>
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
                      <button type="button" className="kr-lesson-row-btn" onClick={() => handleSelect({ type: 'lesson', lesson: n })}>
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
    </>
  )
}
