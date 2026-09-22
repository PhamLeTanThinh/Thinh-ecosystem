'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { LESSON_NUMBERS, LESSON_TITLES } from '@/lib/korean/lessons'
import type { KoreanCard } from '@/lib/korean/types'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { GrammarNavIcon, LessonNavIcon, NavChevronIcon, VocabNavIcon } from '@/components/shared/SidebarIcons'
import { useKoreanUIStore } from '@/lib/korean/uiStore'

export type Selection = { type: 'overview' } | { type: 'knowledge' } | { type: 'lesson'; lesson: number }

interface Props {
  cards: KoreanCard[]
  isLearned: (cardId: string) => boolean
  selection: Selection
  onSelect: (s: Selection) => void
  onOpenKnowledge: (group: TopikKey) => void
  contentKind?: 'vocab' | 'grammar' | null
  // Trên mobile, sidebar chuyển thành drawer trượt từ trái — ẩn/hiện qua 2 prop này thay vì tự
  // quản lý state riêng, để nút ☰ ở topbar (component khác) điều khiển được từ ngoài.
  mobileOpen: boolean
  onMobileClose: () => void
  // Nhóm mở sẵn khi Sidebar mount (cấp độ chọn ở màn hình đầu — LevelLanding); chỉ đọc lúc mount.
  initialGroup?: TopikKey | null
}

export type TopikKey = 'topik1' | 'topik2'

export function Sidebar({ cards, isLearned, selection, onSelect, onOpenKnowledge, contentKind = null, mobileOpen, onMobileClose, initialGroup = null }: Props) {
  // Chỉ 1 nhóm (TOPIK I, TOPIK II) mở tại 1 thời điểm — kiểu accordion, bấm mở nhóm khác thì nhóm đang
  // mở tự đóng lại, tránh menu dài loằng ngoằng vì nhiều nhóm cùng hiện hết bài học. Thu gọn mỗi lần
  // vào trang hoặc F5 — giống Sidebar của IELTS. Ngoại lệ duy nhất: cấp độ vừa chọn ở màn hình đầu mở
  // sẵn để thấy ngay các bài bên trong. Sống ở uiStore (module-level) thay vì useState cục bộ để KHÔNG
  // bị đóng lại mỗi lần chuyển bài — mỗi lần chọn 1 bài khác, Sidebar remount theo route mới (xem
  // KoreanApp.tsx), useState cục bộ sẽ mất nhưng store thì không.
  const openGroupKey = useKoreanUIStore((s) => s.openGroupKey)
  const toggle = useKoreanUIStore((s) => s.toggleGroup)
  const openGroupOnce = useKoreanUIStore((s) => s.openGroupOnce)
  // Nhóm chứa bài đang chọn — dùng để TỰ mở đúng nhóm đó khi vào thẳng 1 URL bài học (chia sẻ link,
  // F5), vì lúc đó không có ?open= (chỉ có khi điều hướng từ màn hình chọn cấp độ) nên nếu không suy
  // ra nhóm này, sidebar sẽ mở trống trơn và không thấy bài đang xem đâu cả. Chỉ có TOPIK II có bài
  // học thật nên mọi selection kiểu 'lesson' đều thuộc nhóm đó.
  const activeGroupKey: TopikKey | null = selection.type === 'lesson' ? 'topik2' : null
  // Giữ sidebar trong đúng cấp độ vừa chọn. Khi đang ở URL một bài, cấp độ suy ra từ bài được ưu tiên;
  // ở trang tổng quan, `initialGroup` đến từ card người dùng vừa chọn trên màn hình đầu. Dữ liệu Korean
  // hiện chỉ có giáo trình TOPIK II, nên /korean/vocab không có ?open= vẫn phải vào thẳng ngữ cảnh đó,
  // không quay về menu tổng hợp TOPIK I + TOPIK II.
  const focusedGroupKey: TopikKey = activeGroupKey ?? initialGroup ?? 'topik2'
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

  // Mục đang xem, hiện thêm làm crumb cuối trong breadcrumb — cùng cách IELTS thêm tên kỹ năng vào
  // sau "IELTS Hub" để biết đang đứng ở đâu trong app, không chỉ biết đang ở app nào.
  const sectionLabel = focusedGroupKey === 'topik1' ? 'TOPIK I' : focusedGroupKey === 'topik2' || selection.type === 'lesson' ? 'TOPIK II' : 'Tất cả bài học'

  // Chọn xong trên mobile thì đóng luôn drawer — trên desktop onMobileClose() không có tác dụng
  // gì (drawer không tồn tại về mặt hiển thị) nên gọi vô điều kiện cho đơn giản.
  function handleSelect(s: Selection) {
    onSelect(s)
    onMobileClose()
  }

  return (
    <>
      {mobileOpen && <div className="kr-sidebar-backdrop" onClick={onMobileClose} />}
      <aside className={`kr-sidebar${mobileOpen ? ' kr-sidebar-open' : ''}`} style={{ viewTransitionName: 'lv-sidebar' }}>
        {/* Breadcrumb thay cho tiêu đề tĩnh "한국어 공부" cũ — vừa báo vị trí (Study › Korean Hub) vừa
            bấm được để quay lại /study. Chỉ hiện ở đây (sidebar chỉ tồn tại khi đã vào trong); lúc còn
            ở màn hình chọn cấp độ (chưa có sidebar), breadcrumb nằm ở topbar — xem page.tsx. */}
        <AppBreadcrumb app="/korean" trail={[{ label: sectionLabel }]} className="kr-sidebar-crumb" />

        {/* Thẻ giới thiệu app ở đầu sidebar — cùng vị trí/kiểu với .ih-nav-hero bên IELTS (icon + tên viết
            hoa nhỏ + tên app). Trước đây sidebar này nhảy thẳng từ breadcrumb vào danh sách, thiếu điểm
            neo thị giác mà IELTS có. */}
        <div className="kr-nav-hero">
          <span className="kr-nav-hero-icon" aria-hidden>
            한
          </span>
          <span className="kr-nav-hero-text">
            <span className="kr-nav-hero-cap">{focusedGroupKey ? '한국어 공부' : 'KOREAN'}</span>
            <span className="kr-nav-hero-name">{focusedGroupKey === 'topik1' ? 'TOPIK I' : focusedGroupKey === 'topik2' ? 'TOPIK II' : '한국어 공부'}</span>
          </span>
        </div>

        {focusedGroupKey === 'topik1' && <div className="kr-topik-group">
          {/* view-transition-name trùng với card cùng cấp độ ở LevelLanding — để card bay vào đây. */}
          <div className={`kr-topik-header kr-topik-header--split${contentKind === null ? ' active' : ''}`} style={{ viewTransitionName: 'kr-level-topik1' }}>
            <button type="button" className="kr-topik-header-main" onClick={() => onOpenKnowledge('topik1')}>
              <span className="kr-nav-tile" aria-hidden>
                <LessonNavIcon />
              </span>
              <span className="kr-nav-text">
                <span className="kr-nav-label">{focusedGroupKey === 'topik1' ? 'Kiến thức' : 'TOPIK I'}</span>
                <span className="kr-nav-sub">Sắp ra mắt</span>
              </span>
            </button>
            <button
              type="button"
              className={`kr-nav-chevron${openGroupKey === 'topik1' ? ' open' : ''}`}
              aria-label={openGroupKey === 'topik1' ? 'Thu gọn danh sách bài học' : 'Mở danh sách bài học'}
              aria-expanded={openGroupKey === 'topik1'}
              onClick={() => toggle('topik1')}
            >
              <NavChevronIcon />
            </button>
          </div>
          {openGroupKey === 'topik1' && <p className="kr-topik-empty">Chưa có nội dung — sắp ra mắt</p>}

          <Link href="/korean/vocab?open=topik1&kind=vocab" className={`kr-topik-header${contentKind === 'vocab' ? ' active' : ''}`} onClick={onMobileClose}>
            <span className="kr-nav-tile" aria-hidden>
              <VocabNavIcon />
            </span>
            <span className="kr-nav-text">
              <span className="kr-nav-label">Tất cả từ vựng</span>
              <span className="kr-nav-sub">0 thẻ</span>
            </span>
          </Link>

          <Link href="/korean/vocab?open=topik1&kind=grammar" className={`kr-topik-header${contentKind === 'grammar' ? ' active' : ''}`} onClick={onMobileClose}>
            <span className="kr-nav-tile" aria-hidden>
              <GrammarNavIcon />
            </span>
            <span className="kr-nav-text">
              <span className="kr-nav-label">Tất cả ngữ pháp</span>
              <span className="kr-nav-sub">0 thẻ</span>
            </span>
          </Link>
        </div>}

        {focusedGroupKey === 'topik2' && <div className="kr-topik-group">
          <div className={`kr-topik-header kr-topik-header--split${contentKind === null ? ' active' : ''}`} style={{ viewTransitionName: 'kr-level-topik2' }}>
            <button type="button" className="kr-topik-header-main" onClick={() => onOpenKnowledge('topik2')}>
              <span className="kr-nav-tile" aria-hidden>
                <LessonNavIcon />
              </span>
              <span className="kr-nav-text">
                <span className="kr-nav-label">{focusedGroupKey === 'topik2' ? 'Kiến thức' : 'TOPIK II'}</span>
                <span className="kr-nav-sub">{focusedGroupKey === 'topik2' ? `${LESSON_NUMBERS.length} bài` : `Seoul Korean 2 · ${LESSON_NUMBERS.length} bài`}</span>
              </span>
            </button>
            <button
              type="button"
              className={`kr-nav-chevron${openGroupKey === 'topik2' ? ' open' : ''}`}
              aria-label={openGroupKey === 'topik2' ? 'Thu gọn danh sách bài học' : 'Mở danh sách bài học'}
              aria-expanded={openGroupKey === 'topik2'}
              onClick={() => toggle('topik2')}
            >
              <NavChevronIcon />
            </button>
          </div>

          {openGroupKey === 'topik2' && (
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
          )}

          <Link href="/korean/vocab?open=topik2&kind=vocab" className={`kr-topik-header${contentKind === 'vocab' ? ' active' : ''}`} onClick={onMobileClose}>
            <span className="kr-nav-tile" aria-hidden>
              <VocabNavIcon />
            </span>
            <span className="kr-nav-text">
              <span className="kr-nav-label">Tất cả từ vựng</span>
              <span className="kr-nav-sub">{cards.filter((card) => card.kind === 'vocab').length} thẻ</span>
            </span>
          </Link>

          <Link href="/korean/vocab?open=topik2&kind=grammar" className={`kr-topik-header${contentKind === 'grammar' ? ' active' : ''}`} onClick={onMobileClose}>
            <span className="kr-nav-tile" aria-hidden>
              <GrammarNavIcon />
            </span>
            <span className="kr-nav-text">
              <span className="kr-nav-label">Tất cả ngữ pháp</span>
              <span className="kr-nav-sub">{cards.filter((card) => card.kind === 'grammar').length} thẻ</span>
            </span>
          </Link>
        </div>}

      </aside>
    </>
  )
}
