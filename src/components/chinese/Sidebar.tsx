'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HSK_LEVELS, LESSON_TITLES, UNSORTED_LESSON, lessonNumbersForLevel, type HskLevel } from '@/lib/chinese/lessons'
import { PHONETICS_LESSONS } from '@/lib/chinese/phonetics'
import type { ChineseCard, ChineseDeck } from '@/lib/chinese/types'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'

export type Selection =
  | { type: 'overview' }
  | { type: 'lesson'; lesson: number }
  | { type: 'deck'; deckId: string }
  | { type: 'phonetics'; lesson: number }

interface Props {
  cards: ChineseCard[]
  decks: ChineseDeck[]
  isLearned: (cardId: string) => boolean
  selection: Selection
  onSelect: (s: Selection) => void
  onDeleteDeck: (deckId: string, deckName: string) => void
  // Trên mobile, sidebar chuyển thành drawer trượt từ trái — ẩn/hiện qua 2 prop này thay vì tự
  // quản lý state riêng, cùng convention với components/korean/Sidebar.tsx.
  mobileOpen: boolean
  onMobileClose: () => void
  // Nhóm mở sẵn khi Sidebar mount (cấp độ chọn ở màn hình đầu — LevelLanding); chỉ đọc lúc mount.
  initialGroup?: HskLevel | null
}

type GroupKey = HskLevel | 'decks' | 'phonetics'

export function Sidebar({ cards, decks, isLearned, selection, onSelect, onDeleteDeck, mobileOpen, onMobileClose, initialGroup = null }: Props) {
  // Mọi nhóm (HSK 1+2 … HSK 6, Bộ từ của tôi) thu gọn mỗi lần vào trang hoặc F5 — giống Sidebar của IELTS. Ngoại lệ
  // duy nhất: cấp độ vừa chọn ở màn hình đầu mở sẵn để thấy ngay các bài bên trong.
  const [expanded, setExpanded] = useState<Set<GroupKey>>(() => new Set(initialGroup ? [initialGroup] : []))

  function toggle(key: GroupKey) {
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
      {mobileOpen && <div className="cn-sidebar-backdrop" onClick={onMobileClose} />}
      <aside className={`cn-sidebar${mobileOpen ? ' cn-sidebar-open' : ''}`} style={{ viewTransitionName: 'lv-sidebar' }}>
        {/* Breadcrumb thay cho tiêu đề tĩnh "学中文" cũ — vừa báo vị trí (Study › Chinese Hub) vừa bấm
            được để quay lại /study. Chỉ hiện ở đây (sidebar chỉ tồn tại khi đã vào trong); lúc còn ở
            màn hình chọn cấp độ (chưa có sidebar), breadcrumb nằm ở topbar — xem page.tsx. */}
        <AppBreadcrumb app="/chinese" className="cn-sidebar-crumb" />

        <div className={`cn-lesson-row cn-overview-row${selection.type === 'overview' ? ' active' : ''}`}>
          <button type="button" className="cn-lesson-row-btn" onClick={() => handleSelect({ type: 'overview' })}>
            <span className="cn-lesson-badge">✨</span>
            <span className="cn-lesson-row-body">
              <span className="cn-lesson-row-title">Tất cả từ vựng</span>
              <span className="cn-lesson-row-meta">{cards.length} thẻ</span>
            </span>
          </button>
        </div>

        {(() => {
          const unsortedCount = cards.filter((c) => c.lesson === UNSORTED_LESSON).length
          if (unsortedCount === 0) return null
          const active = selection.type === 'lesson' && selection.lesson === UNSORTED_LESSON
          return (
            <div className={`cn-lesson-row cn-overview-row${active ? ' active' : ''}`}>
              <button type="button" className="cn-lesson-row-btn" onClick={() => handleSelect({ type: 'lesson', lesson: UNSORTED_LESSON })}>
                <span className="cn-lesson-badge">🗂️</span>
                <span className="cn-lesson-row-body">
                  <span className="cn-lesson-row-title">{LESSON_TITLES[UNSORTED_LESSON]}</span>
                  <span className="cn-lesson-row-meta">{unsortedCount} thẻ</span>
                </span>
              </button>
            </div>
          )
        })()}

        {/* Chuỗi bài vỡ lòng đứng riêng, trước mọi cấp độ HSK — KHÔNG phải "lesson" trong LESSON_META
            (nội dung nằm hẳn trong code, xem lib/chinese/phonetics.ts), nên có Selection riêng
            ('phonetics') và danh sách bài lấy từ PHONETICS_LESSONS thay vì lessonNumbersForLevel. */}
        <div className="cn-topik-group">
          <button type="button" className="cn-topik-header" onClick={() => toggle('phonetics')}>
            <span className="cn-topik-toggle">{expanded.has('phonetics') ? '▾' : '▸'}</span>
            <span className="cn-topik-label">🔤 Ngữ âm cơ bản</span>
          </button>

          {expanded.has('phonetics') && (
            <div className="cn-lesson-list">
              {PHONETICS_LESSONS.map((pl) => {
                const active = selection.type === 'phonetics' && selection.lesson === pl.number
                return (
                  <div key={pl.number} className={`cn-lesson-row${active ? ' active' : ''}`}>
                    <button type="button" className="cn-lesson-row-btn" onClick={() => handleSelect({ type: 'phonetics', lesson: pl.number })}>
                      <span className="cn-lesson-badge">{pl.number}</span>
                      <span className="cn-lesson-row-body">
                        <span className="cn-lesson-row-title">{pl.title}</span>
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {HSK_LEVELS.map(({ key, label }) => {
          const lessonNumbers = lessonNumbersForLevel(key)
          return (
            <div key={key} className="cn-topik-group">
              {/* view-transition-name trùng với card cùng cấp độ ở LevelLanding — để card bay vào đây. */}
              <button type="button" className="cn-topik-header" style={{ viewTransitionName: `cn-level-${key}` }} onClick={() => toggle(key)}>
                <span className="cn-topik-toggle">{expanded.has(key) ? '▾' : '▸'}</span>
                <span className="cn-topik-label">{label}</span>
              </button>

              {expanded.has(key) &&
                (lessonNumbers.length === 0 ? (
                  <p className="cn-topik-empty">Chưa có nội dung — sắp ra mắt</p>
                ) : (
                  <div className="cn-lesson-list">
                    {lessonNumbers.map((n) => {
                      const lessonCards = cards.filter((c) => c.lesson === n)
                      const learnedCount = lessonCards.filter((c) => isLearned(c.id)).length
                      const active = selection.type === 'lesson' && selection.lesson === n
                      return (
                        <div key={n} className={`cn-lesson-row${active ? ' active' : ''}`}>
                          <button type="button" className="cn-lesson-row-btn" onClick={() => handleSelect({ type: 'lesson', lesson: n })}>
                            <span className="cn-lesson-badge">{n}</span>
                            <span className="cn-lesson-row-body">
                              <span className="cn-lesson-row-title">{LESSON_TITLES[n]}</span>
                              <span className="cn-lesson-row-meta">
                                {learnedCount}/{lessonCards.length} thuộc
                              </span>
                            </span>
                          </button>
                          <span className="cn-lesson-row-actions">
                            <Link href={`/chinese/study?lesson=${n}`} aria-label="Ôn tập" title="Ôn tập" className="cn-lesson-row-action">
                              🎴
                            </Link>
                            <Link href={`/chinese/quiz?lesson=${n}`} aria-label="Kiểm tra" title="Kiểm tra" className="cn-lesson-row-action">
                              📝
                            </Link>
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ))}
            </div>
          )
        })}

        <div className="cn-topik-group">
          <button type="button" className="cn-topik-header" onClick={() => toggle('decks')}>
            <span className="cn-topik-toggle">{expanded.has('decks') ? '▾' : '▸'}</span>
            <span className="cn-topik-label">Bộ từ của tôi</span>
          </button>

          {expanded.has('decks') &&
            (decks.length === 0 ? (
              <p className="cn-topik-empty">Chưa có bộ từ nào — chọn từ ở &quot;Tất cả từ vựng&quot; để tạo.</p>
            ) : (
              <div className="cn-lesson-list">
                {decks.map((deck) => {
                  const active = selection.type === 'deck' && selection.deckId === deck.id
                  return (
                    <div key={deck.id} className={`cn-lesson-row${active ? ' active' : ''}`}>
                      <button type="button" className="cn-lesson-row-btn" onClick={() => handleSelect({ type: 'deck', deckId: deck.id })}>
                        <span className="cn-lesson-badge">📚</span>
                        <span className="cn-lesson-row-body">
                          <span className="cn-lesson-row-title">{deck.name}</span>
                          <span className="cn-lesson-row-meta">{deck.cardIds.length} từ</span>
                        </span>
                      </button>
                      <span className="cn-lesson-row-actions">
                        <Link href={`/chinese/study?deck=${deck.id}`} aria-label="Ôn tập" title="Ôn tập" className="cn-lesson-row-action">
                          🎴
                        </Link>
                        <Link href={`/chinese/quiz?deck=${deck.id}`} aria-label="Kiểm tra" title="Kiểm tra" className="cn-lesson-row-action">
                          📝
                        </Link>
                        <button
                          type="button"
                          aria-label={`Xoá bộ từ ${deck.name}`}
                          title="Xoá bộ từ"
                          className="cn-lesson-row-action"
                          onClick={() => onDeleteDeck(deck.id, deck.name)}
                        >
                          ✕
                        </button>
                      </span>
                    </div>
                  )
                })}
              </div>
            ))}
        </div>
      </aside>
    </>
  )
}
