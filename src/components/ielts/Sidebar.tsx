'use client'

import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useIeltsStore } from '@/lib/ielts/store'
import { useIeltsAccess } from './AccessContext'
import { skillMeta } from '@/lib/ielts/skills'
import { parseLessonTitle } from '@/lib/ielts/lessonTitle'
import type { Skill } from '@/lib/ielts/types'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { beginIeltsNavigation } from '@/lib/ielts/navigationLoading'

export interface SkillCounts {
  tests: number
  vocabSets: number
}

interface Props {
  skill: Skill
  // Số đề / Vocab set của kỹ năng (server tính, xem SkillShell) — hiện ở dòng phụ của từng mục.
  counts: SkillCounts
  // Off-canvas trên mobile (xem SkillShell + ielts.css) — không ảnh hưởng gì trên desktop.
  navOpen?: boolean
  // Gọi khi người dùng chọn 1 mục — để đóng off-canvas trên mobile.
  onNavigate?: () => void
}

// Icon nét mảnh (cùng kiểu với breadcrumb), đổi màu theo currentColor — không phụ thuộc emoji của hệ điều hành.
function NavIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const ICON_LESSONS = (
  <NavIcon>
    <path d="M7 3h7l4 4v14H7z" />
    <path d="M14 3v4h4M10 12h5M10 16h5" />
  </NavIcon>
)
const ICON_PRACTICE = (
  <NavIcon>
    <rect x="6" y="4" width="12" height="17" rx="2" />
    <path d="M9 4h6v3H9zM9.5 14l2 2 3.5-4" />
  </NavIcon>
)
const ICON_VOCAB = (
  <NavIcon>
    <path d="M5 19V6a2 2 0 0 1 2-2h11v15H7a2 2 0 0 0-2 2z" />
    <path d="M9 8.5h6M9 12h4" />
  </NavIcon>
)

// Menu trái của MỘT kỹ năng: Kiến thức (kèm danh sách bài học) / Làm đề / Vocab. Không còn menu chung
// cho 4 kỹ năng — đổi kỹ năng bằng nút "Đổi kỹ năng" ở đáy (hoặc breadcrumb "IELTS Hub").
export function SkillSidebar({ skill, counts, navOpen = false, onNavigate }: Props) {
  const { isOwner } = useIeltsAccess()
  const router = useRouter()
  const pathname = usePathname()
  const pages = useIeltsStore((s) => s.pages)
  const hydrated = useIeltsStore((s) => s.hydrated)
  const addPage = useIeltsStore((s) => s.addPage)
  const meta = skillMeta(skill)
  const base = `/ielts/${skill}`

  const onLessons = pathname.startsWith(`${base}/lessons`)
  const onPractice = pathname.startsWith(`${base}/practice`)
  const onVocab = pathname.startsWith(`${base}/vocab`)
  // /ielts/<skill>/lessons/<id> → id (phần tử thứ 4 sau khi tách theo "/").
  const activePageId = onLessons ? (pathname.split('/')[4] ?? null) : null

  // Danh sách bài học tự mở khi đang ở mục Kiến thức; người dùng bấm mũi tên để ghi đè (mở/đóng tay).
  const [manualOpen, setManualOpen] = useState<boolean | null>(null)
  const lessonsOpen = manualOpen ?? onLessons
  const [adding, setAdding] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')

  const skillPages = pages.filter((p) => p.skill === skill).sort((a, b) => a.sortOrder - b.sortOrder)

  function navigate(path: string) {
    beginIeltsNavigation(path)
    router.push(path)
    onNavigate?.()
  }

  function commitAdd() {
    const title = draftTitle.trim()
    setAdding(false)
    if (!title) return
    const page = addPage(skill, title)
    navigate(`${base}/lessons/${page.id}`)
  }

  return (
    <aside
      className={`ih-sidebar ih-sidebar-skill${navOpen ? ' ih-sidebar-open' : ''}`}
      style={{ '--nav-accent': meta?.accent ?? '#c9667a' } as CSSProperties}
    >
      {/* Study › IELTS Hub › <Kỹ năng>: bấm "IELTS Hub" để về màn chọn kỹ năng, "Study" để về /study. */}
      <AppBreadcrumb app="/ielts" trail={[{ label: meta?.label ?? skill, glyph: meta?.icon }]} className="ih-sidebar-crumb" />

      <div className="ih-nav-hero">
        <span className="ih-nav-hero-icon" aria-hidden>
          {meta?.icon}
        </span>
        <span className="ih-nav-hero-text">
          <span className="ih-nav-hero-cap">IELTS</span>
          <span className="ih-font-hand ih-nav-hero-name">{meta?.label}</span>
        </span>
      </div>

      <nav className="ih-nav" aria-label={`Menu ${meta?.label ?? skill}`}>
        <div className={`ih-nav-item${onLessons ? ' active' : ''}`}>
          <Link href={`${base}/lessons`} className="ih-nav-link" onClick={onNavigate} aria-current={onLessons && !activePageId ? 'page' : undefined}>
            <span className="ih-nav-tile">{ICON_LESSONS}</span>
            <span className="ih-nav-text">
              <span className="ih-nav-label">Kiến thức</span>
              <span className="ih-nav-sub">{hydrated ? `${skillPages.length} bài` : ' '}</span>
            </span>
          </Link>
          <button
            type="button"
            className={`ih-nav-chevron${lessonsOpen ? ' open' : ''}`}
            aria-label={lessonsOpen ? 'Thu gọn danh sách bài học' : 'Mở danh sách bài học'}
            aria-expanded={lessonsOpen}
            onClick={() => setManualOpen(!lessonsOpen)}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
        </div>

        {lessonsOpen && (
          <div className="ih-page-list ih-nav-tree">
            {!hydrated ? (
              // Skeleton trong lúc chờ tải danh sách trang (rất nhanh, chỉ id/title — xem store.ts).
              <>
                <div className="ih-page-skeleton-row" style={{ width: '70%' }} />
                <div className="ih-page-skeleton-row" style={{ width: '55%' }} />
              </>
            ) : (
              skillPages.map((page) => (
                <PageRow
                  key={page.id}
                  pageId={page.id}
                  title={page.title}
                  active={page.id === activePageId}
                  isOwner={isOwner}
                  onSelect={() => {
                    navigate(`${base}/lessons/${page.id}`)
                  }}
                  onDeleted={() => {
                    if (page.id === activePageId) navigate(`${base}/lessons`)
                  }}
                />
              ))
            )}

            {isOwner &&
              (adding ? (
                <input
                  autoFocus
                  className="ih-page-add-input"
                  value={draftTitle}
                  placeholder="Tên trang mới…"
                  onChange={(e) => setDraftTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitAdd()
                    if (e.key === 'Escape') setAdding(false)
                  }}
                  onBlur={commitAdd}
                />
              ) : (
                <button
                  type="button"
                  className="ih-page-add-btn"
                  onClick={() => {
                    setDraftTitle('')
                    setAdding(true)
                  }}
                >
                  + Thêm trang
                </button>
              ))}
          </div>
        )}

        <div className={`ih-nav-item${onPractice ? ' active' : ''}`}>
          <Link href={`${base}/practice`} className="ih-nav-link" onClick={onNavigate} aria-current={onPractice ? 'page' : undefined}>
            <span className="ih-nav-tile">{ICON_PRACTICE}</span>
            <span className="ih-nav-text">
              <span className="ih-nav-label">Làm đề</span>
              <span className="ih-nav-sub">{counts.tests} đề</span>
            </span>
          </Link>
        </div>

        <div className={`ih-nav-item${onVocab ? ' active' : ''}`}>
          <Link href={`${base}/vocab`} className="ih-nav-link" onClick={onNavigate} aria-current={onVocab ? 'page' : undefined}>
            <span className="ih-nav-tile">{ICON_VOCAB}</span>
            <span className="ih-nav-text">
              <span className="ih-nav-label">Vocab</span>
              <span className="ih-nav-sub">{counts.vocabSets} set</span>
            </span>
          </Link>
        </div>
      </nav>

      {/* Ghim ở đáy sidebar: đổi kỹ năng không còn menu chung nên cần 1 lối ra rõ ràng. */}
      <Link href="/ielts" className="ih-nav-back" onClick={onNavigate}>
        <span aria-hidden>←</span> Đổi kỹ năng
      </Link>
    </aside>
  )
}

function PageRow({ pageId, title, active, onSelect, onDeleted, isOwner }: { pageId: string; title: string; active: boolean; onSelect: () => void; onDeleted: () => void; isOwner: boolean }) {
  const updatePage = useIeltsStore((s) => s.updatePage)
  const flushPageSave = useIeltsStore((s) => s.flushPageSave)
  const deletePage = useIeltsStore((s) => s.deletePage)
  const [renaming, setRenaming] = useState(false)
  const [draft, setDraft] = useState(title)
  const btnRef = useRef<HTMLButtonElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  // "Lesson 3 — Read Connectors" → ô số "3" + tên "Read Connectors". Tên không theo mẫu thì hiện nguyên.
  const parsed = parseLessonTitle(title)

  // Tooltip tên đầy đủ khi tên bị cắt bằng dấu … — hiện tức thì (title mặc định của trình duyệt trễ
  // cả giây). Dùng Popover API: phần tử popover nằm ở "top layer" nên không bị sidebar cắt
  // (overflow) và không bị backdrop-filter của sidebar làm lệch toạ độ position: fixed.
  function showTip() {
    const btn = btnRef.current
    const tip = tipRef.current
    if (!btn || !tip || !tip.showPopover) return
    // Tên hiện đủ rồi (không bị cắt bớt dòng) thì khỏi tooltip.
    const text = textRef.current
    if (text && text.scrollHeight <= text.clientHeight + 1) return
    const rect = btn.getBoundingClientRect()
    // Hiện bên phải sidebar (không hiện phía dưới dòng — sẽ che các lesson kế bên dưới), căn giữa
    // theo chiều dọc với dòng đang hover.
    const sidebarRight = btn.closest('.ih-sidebar')?.getBoundingClientRect().right ?? rect.right
    if (!tip.matches(':popover-open')) tip.showPopover()
    // Đo sau khi hiện (mới biết kích thước thật) rồi kẹp vào trong màn hình.
    const left = Math.min(sidebarRight + 8, window.innerWidth - tip.offsetWidth - 8)
    const top = rect.top + (rect.height - tip.offsetHeight) / 2
    tip.style.left = `${Math.max(8, left)}px`
    tip.style.top = `${Math.max(8, Math.min(top, window.innerHeight - tip.offsetHeight - 8))}px`
  }

  function hideTip() {
    const tip = tipRef.current
    if (tip?.matches(':popover-open')) tip.hidePopover()
  }

  function commitRename() {
    setRenaming(false)
    const t = draft.trim()
    if (t && t !== title) {
      updatePage(pageId, { title: t })
      flushPageSave(pageId)
    } else {
      setDraft(title)
    }
  }

  if (renaming) {
    return (
      <input
        autoFocus
        className="ih-page-add-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commitRename()
          if (e.key === 'Escape') {
            setDraft(title)
            setRenaming(false)
          }
        }}
        onBlur={commitRename}
      />
    )
  }

  return (
    <div className={`ih-page-row${active ? ' active' : ''}`}>
      <button
        ref={btnRef}
        type="button"
        className="ih-page-row-btn"
        onClick={onSelect}
        onMouseEnter={showTip}
        onMouseLeave={hideTip}
        onFocus={showTip}
        onBlur={hideTip}
      >
        {parsed && <span className="ih-lesson-num">{parsed.num}</span>}
        <span ref={textRef} className="ih-lesson-title">
          {parsed ? parsed.name : title}
        </span>
      </button>
      <div ref={tipRef} popover="manual" role="tooltip" className="ih-tip">
        {title}
      </div>
      {isOwner && (
        <>
          <button
            type="button"
            aria-label="Đổi tên trang"
            className="ih-page-row-action"
            onClick={() => {
              setDraft(title)
              setRenaming(true)
            }}
          >
            ✎
          </button>
          <button
            type="button"
            aria-label="Xoá trang"
            className="ih-page-row-action"
            onClick={() => {
              if (window.confirm(`Xoá trang "${title}"?`)) {
                deletePage(pageId)
                onDeleted()
              }
            }}
          >
            ×
          </button>
        </>
      )}
    </div>
  )
}
