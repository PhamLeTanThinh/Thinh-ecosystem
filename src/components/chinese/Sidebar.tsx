'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { HSK_LEVELS, LESSON_META, LESSON_TITLES, UNSORTED_LESSON, lessonNumbersForLevel, type HskLevel } from '@/lib/chinese/lessons'
import { PHONETICS_LESSONS } from '@/lib/chinese/phonetics'
import type { ChineseCard, ChineseDeck } from '@/lib/chinese/types'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { GrammarNavIcon, LessonNavIcon, NavChevronIcon, VocabNavIcon } from '@/components/shared/SidebarIcons'
import { useChineseUIStore } from '@/lib/chinese/uiStore'

export type Selection =
  | { type: 'overview' }
  | { type: 'knowledge' }
  | { type: 'lesson'; lesson: number }
  | { type: 'deck'; deckId: string }
  | { type: 'phonetics'; lesson: number }

interface Props {
  cards: ChineseCard[]
  decks: ChineseDeck[]
  isLearned: (cardId: string) => boolean
  selection: Selection
  onSelect: (s: Selection) => void
  onOpenKnowledge: (group: HskLevel | 'phonetics' | 'decks') => void
  onDeleteDeck: (deckId: string, deckName: string) => void
  contentKind?: 'vocab' | 'grammar' | null
  // Trên mobile, sidebar chuyển thành drawer trượt từ trái — ẩn/hiện qua 2 prop này thay vì tự
  // quản lý state riêng, cùng convention với components/korean/Sidebar.tsx.
  mobileOpen: boolean
  onMobileClose: () => void
  // Nhóm mở sẵn khi Sidebar mount (cấp độ/mục chọn ở màn hình đầu — LevelLanding); chỉ đọc lúc mount.
  initialGroup?: HskLevel | 'phonetics' | null
}

export function Sidebar({ cards, decks, isLearned, selection, onSelect, onOpenKnowledge, onDeleteDeck, contentKind = null, mobileOpen, onMobileClose, initialGroup = null }: Props) {
  // Chỉ 1 nhóm (HSK 1+2 … HSK 6, Bộ từ của tôi) mở tại 1 thời điểm — kiểu accordion, bấm mở nhóm khác
  // thì nhóm đang mở tự đóng lại, tránh menu dài loằng ngoằng vì nhiều nhóm cùng hiện hết bài học.
  // Thu gọn mỗi lần vào trang hoặc F5 — giống Sidebar của IELTS. Ngoại lệ duy nhất: cấp độ vừa chọn ở
  // màn hình đầu mở sẵn để thấy ngay các bài bên trong. Sống ở uiStore (module-level) thay vì useState
  // cục bộ để KHÔNG bị đóng lại mỗi lần chuyển bài — mỗi lần chọn 1 bài khác, Sidebar remount theo
  // route mới (xem ChineseApp.tsx), useState cục bộ sẽ mất nhưng store thì không.
  const openGroupKey = useChineseUIStore((s) => s.openGroupKey)
  const toggle = useChineseUIStore((s) => s.toggleGroup)
  const openGroupOnce = useChineseUIStore((s) => s.openGroupOnce)
  // Nhóm chứa bài/mục đang chọn — dùng để TỰ mở đúng nhóm đó khi vào thẳng 1 URL bài học (chia sẻ
  // link, F5), vì lúc đó không có ?open= (chỉ có khi điều hướng từ màn hình chọn cấp độ) nên nếu
  // không suy ra nhóm này, sidebar sẽ mở trống trơn và không thấy bài đang xem đâu cả.
  const activeGroupKey: string | null =
    selection.type === 'lesson'
      ? selection.lesson === UNSORTED_LESSON
        ? null
        : (LESSON_META[selection.lesson]?.level ?? null)
      : selection.type === 'phonetics'
        ? 'phonetics'
        : selection.type === 'deck'
          ? 'decks'
          : null
  // Khi đã đi vào một cấp độ từ màn hình chọn, sidebar chỉ còn ngữ cảnh của cấp độ đó, giống IELTS
  // chỉ hiện menu của kỹ năng đang học. URL bài học được ưu tiên; `initialGroup` giữ ngữ cảnh ở trang
  // tổng quan ngay sau khi vừa chọn card cấp độ.
  const focusedGroupKey = activeGroupKey ?? initialGroup
  // Chỉ chạy 1 lần lúc mount: ưu tiên initialGroup (mang qua ?open= khi vừa chọn cấp độ ở màn hình
  // đầu), không có thì mở nhóm chứa mục đang chọn — LUÔN đặt (không toggle) vì đây là lần đầu vào.
  const appliedInitialGroup = useRef(false)
  useEffect(() => {
    if (appliedInitialGroup.current) return
    const group = focusedGroupKey
    if (group) {
      appliedInitialGroup.current = true
      openGroupOnce(group)
    }
  }, [focusedGroupKey, openGroupOnce])

  // Mục đang xem, hiện thêm làm crumb cuối trong breadcrumb — cùng cách IELTS thêm tên kỹ năng
  // (trail={[{label: skill}]}) vào sau "IELTS Hub" để biết đang đứng ở đâu trong app, không chỉ biết
  // đang ở app nào.
  const focusedGroupLabel =
    focusedGroupKey === 'phonetics'
      ? 'Ngữ âm cơ bản'
      : focusedGroupKey === 'decks'
        ? 'Bộ từ của tôi'
        : HSK_LEVELS.find((level) => level.key === focusedGroupKey)?.label
  const sectionLabel =
    selection.type === 'overview' || selection.type === 'knowledge'
      ? (focusedGroupLabel ?? 'Tất cả từ vựng')
      : selection.type === 'phonetics'
        ? 'Ngữ âm cơ bản'
        : selection.type === 'deck'
          ? 'Bộ từ của tôi'
          : selection.lesson === UNSORTED_LESSON
            ? LESSON_TITLES[UNSORTED_LESSON]
            : (HSK_LEVELS.find((l) => l.key === activeGroupKey)?.label ?? 'Từ vựng')

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
        <AppBreadcrumb app="/chinese" trail={[{ label: sectionLabel }]} className="cn-sidebar-crumb" />

        {/* Thẻ giới thiệu app ở đầu sidebar — cùng vị trí/kiểu với .ih-nav-hero bên IELTS (icon + tên viết
            hoa nhỏ + tên app). Trước đây sidebar này nhảy thẳng từ breadcrumb vào danh sách, thiếu điểm
            neo thị giác mà IELTS có. */}
        <div className="cn-nav-hero">
          <span className="cn-nav-hero-icon" aria-hidden>
            学
          </span>
          <span className="cn-nav-hero-text">
            <span className="cn-nav-hero-cap">{focusedGroupLabel ? '学中文' : 'CHINESE'}</span>
            <span className="cn-nav-hero-name">{focusedGroupLabel ?? '学中文'}</span>
          </span>
        </div>

        {focusedGroupKey === null && (
          <>
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
          </>
        )}

        {/* Chuỗi bài vỡ lòng đứng riêng, trước mọi cấp độ HSK — KHÔNG phải "lesson" trong LESSON_META
            (nội dung nằm hẳn trong code, xem lib/chinese/phonetics.ts), nên có Selection riêng
            ('phonetics') và danh sách bài lấy từ PHONETICS_LESSONS thay vì lessonNumbersForLevel. */}
        {(focusedGroupKey === null || focusedGroupKey === 'phonetics') && <div className="cn-topik-group">
          {/* view-transition-name trùng với card "Ngữ âm cơ bản" ở LevelLanding — để card bay vào đây. */}
          <div className={`cn-topik-header cn-topik-header--split${focusedGroupKey === 'phonetics' ? ' active' : ''}`} style={{ viewTransitionName: 'cn-level-phonetics' }}>
            <button type="button" className="cn-topik-header-main" onClick={() => onOpenKnowledge('phonetics')}>
              <span className="cn-nav-tile" aria-hidden>
                <LessonNavIcon />
              </span>
              <span className="cn-nav-text">
                <span className="cn-nav-label">{focusedGroupKey === 'phonetics' ? 'Kiến thức' : 'Ngữ âm cơ bản'}</span>
                <span className="cn-nav-sub">{PHONETICS_LESSONS.length} bài</span>
              </span>
            </button>
            <button
              type="button"
              className={`cn-nav-chevron${openGroupKey === 'phonetics' ? ' open' : ''}`}
              aria-label={openGroupKey === 'phonetics' ? 'Thu gọn danh sách bài học' : 'Mở danh sách bài học'}
              aria-expanded={openGroupKey === 'phonetics'}
              onClick={() => toggle('phonetics')}
            >
              <NavChevronIcon />
            </button>
          </div>

          {openGroupKey === 'phonetics' && (
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
        </div>}

        {HSK_LEVELS.filter(({ key }) => focusedGroupKey === null || focusedGroupKey === key).map(({ key, label }) => {
          const lessonNumbers = lessonNumbersForLevel(key)
          return (
            <div key={key} className="cn-topik-group">
              {/* view-transition-name trùng với card cùng cấp độ ở LevelLanding — để card bay vào đây. */}
              <div className={`cn-topik-header cn-topik-header--split${focusedGroupKey === key && contentKind === null ? ' active' : ''}`} style={{ viewTransitionName: `cn-level-${key}` }}>
                <button type="button" className="cn-topik-header-main" onClick={() => onOpenKnowledge(key)}>
                  <span className="cn-nav-tile" aria-hidden>
                    <LessonNavIcon />
                  </span>
                  <span className="cn-nav-text">
                    <span className="cn-nav-label">{focusedGroupKey === key ? 'Kiến thức' : label}</span>
                    <span className="cn-nav-sub">{lessonNumbers.length === 0 ? 'Sắp ra mắt' : `${lessonNumbers.length} bài`}</span>
                  </span>
                </button>
                <button
                  type="button"
                  className={`cn-nav-chevron${openGroupKey === key ? ' open' : ''}`}
                  aria-label={openGroupKey === key ? 'Thu gọn danh sách bài học' : 'Mở danh sách bài học'}
                  aria-expanded={openGroupKey === key}
                  onClick={() => toggle(key)}
                >
                  <NavChevronIcon />
                </button>
              </div>

              {openGroupKey === key &&
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

              {focusedGroupKey === key && (
                <>
                  <Link href={`/chinese/vocab?open=${key}&kind=vocab`} className={`cn-topik-header${contentKind === 'vocab' ? ' active' : ''}`} onClick={onMobileClose}>
                    <span className="cn-nav-tile" aria-hidden>
                      <VocabNavIcon />
                    </span>
                    <span className="cn-nav-text">
                      <span className="cn-nav-label">Tất cả từ vựng</span>
                      <span className="cn-nav-sub">{cards.filter((card) => LESSON_META[card.lesson]?.level === key && card.kind === 'vocab').length} thẻ</span>
                    </span>
                  </Link>
                  <Link href={`/chinese/vocab?open=${key}&kind=grammar`} className={`cn-topik-header${contentKind === 'grammar' ? ' active' : ''}`} onClick={onMobileClose}>
                    <span className="cn-nav-tile" aria-hidden>
                      <GrammarNavIcon />
                    </span>
                    <span className="cn-nav-text">
                      <span className="cn-nav-label">Tất cả ngữ pháp</span>
                      <span className="cn-nav-sub">{cards.filter((card) => LESSON_META[card.lesson]?.level === key && card.kind === 'grammar').length} thẻ</span>
                    </span>
                  </Link>
                </>
              )}
            </div>
          )
        })}

        {(focusedGroupKey === null || focusedGroupKey === 'decks') && <div className="cn-topik-group">
          <button type="button" className={`cn-topik-header${focusedGroupKey === 'decks' ? ' active' : ''}`} onClick={() => toggle('decks')}>
            <span className="cn-nav-tile" aria-hidden>
              📚
            </span>
            <span className="cn-nav-text">
              <span className="cn-nav-label">{focusedGroupKey === 'decks' ? 'Danh sách bộ từ' : 'Bộ từ của tôi'}</span>
              <span className="cn-nav-sub">{decks.length > 0 ? `${decks.length} bộ` : ' '}</span>
            </span>
            <span className={`cn-nav-chevron${openGroupKey === 'decks' ? ' open' : ''}`} aria-hidden>
              <NavChevronIcon />
            </span>
          </button>

          {openGroupKey === 'decks' &&
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
        </div>}

      </aside>
    </>
  )
}
