'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useIeltsStore } from '@/lib/ielts/store'
import { useIeltsAccess } from './AccessContext'
import { SKILLS } from '@/lib/ielts/skills'
import type { Skill } from '@/lib/ielts/types'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'

export type Selection = { type: 'page'; id: string } | { type: 'vocab' }

interface Props {
  selection: Selection | null
  onSelect: (s: Selection) => void
  // Section mở sẵn khi Sidebar mount (chọn từ màn hình 4 card hoặc từ tìm kiếm); chỉ đọc lúc mount.
  initialSkill?: Skill | null
}

export function Sidebar({ selection, onSelect, initialSkill = null }: Props) {
  const { isOwner } = useIeltsAccess()
  const pages = useIeltsStore((s) => s.pages)
  const hydrated = useIeltsStore((s) => s.hydrated)
  const addPage = useIeltsStore((s) => s.addPage)
  // Mọi section thu gọn mỗi lần vào trang hoặc F5 — không lưu trạng thái mở/đóng. Ngoại lệ duy nhất:
  // section vừa được chọn ở màn hình 4 card (initialSkill) mở sẵn để thấy ngay các trang bên trong.
  const [expanded, setExpanded] = useState<Set<Skill>>(() => new Set(initialSkill ? [initialSkill] : []))
  const [addingTo, setAddingTo] = useState<Skill | null>(null)
  const [draftTitle, setDraftTitle] = useState('')

  function toggle(skill: Skill) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(skill)) next.delete(skill)
      else next.add(skill)
      return next
    })
  }

  function startAdd(skill: Skill) {
    setExpanded((prev) => new Set(prev).add(skill))
    setAddingTo(skill)
    setDraftTitle('')
  }

  function commitAdd(skill: Skill) {
    const title = draftTitle.trim()
    setAddingTo(null)
    if (!title) return
    const page = addPage(skill, title)
    onSelect({ type: 'page', id: page.id })
  }

  return (
    <aside className="ih-sidebar" style={{ viewTransitionName: 'ih-sidebar' }}>
      {/* Breadcrumb thay cho tiêu đề tĩnh "IELTS Hub" cũ — vừa báo vị trí (Study › IELTS Hub) vừa bấm
          được để quay lại /study. Chỉ hiện ở đây (sidebar chỉ tồn tại khi đã vào trong); lúc còn ở
          màn hình chọn kỹ năng (chưa có sidebar), breadcrumb nằm ở topbar — xem page.tsx. */}
      <AppBreadcrumb app="/ielts" className="ih-sidebar-crumb" />

      {SKILLS.map((skill) => {
        const skillPages = pages.filter((p) => p.skill === skill.key).sort((a, b) => a.sortOrder - b.sortOrder)
        const isOpen = expanded.has(skill.key)
        return (
          <div key={skill.key} className="ih-skill-group">
            {/* view-transition-name trùng với card cùng kỹ năng ở SkillLanding — để card bay vào đây. */}
            <button type="button" className="ih-skill-row" style={{ viewTransitionName: `ih-skill-${skill.key}` }} onClick={() => toggle(skill.key)}>
              <span className="ih-skill-toggle">{isOpen ? '▾' : '▸'}</span>
              <span className="ih-skill-icon">{skill.icon}</span>
              <span className="ih-skill-label">{skill.label}</span>
            </button>

            {isOpen && (
              <div className="ih-page-list">
                {!hydrated ? (
                  // Skeleton trong lúc chờ tải danh sách trang (rất nhanh, chỉ id/title — xem
                  // store.ts) — tránh hiện danh sách trống trơn 1 nhịp trước khi có dữ liệu thật.
                  <>
                    <div className="ih-page-skeleton-row" style={{ width: '70%' }} />
                    <div className="ih-page-skeleton-row" style={{ width: '55%' }} />
                  </>
                ) : (
                  skillPages.map((page) => (
                    <PageRow key={page.id} pageId={page.id} title={page.title} active={selection?.type === 'page' && selection.id === page.id} onSelect={() => onSelect({ type: 'page', id: page.id })} isOwner={isOwner} />
                  ))
                )}

                {isOwner && (addingTo === skill.key ? (
                  <input
                    autoFocus
                    className="ih-page-add-input"
                    value={draftTitle}
                    placeholder="Tên trang mới…"
                    onChange={(e) => setDraftTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitAdd(skill.key)
                      if (e.key === 'Escape') setAddingTo(null)
                    }}
                    onBlur={() => commitAdd(skill.key)}
                  />
                ) : (
                  <button type="button" className="ih-page-add-btn" onClick={() => startAdd(skill.key)}>
                    + Thêm trang
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <button type="button" className={`ih-skill-row ih-vocab-row${selection?.type === 'vocab' ? ' active' : ''}`} onClick={() => onSelect({ type: 'vocab' })}>
        <span className="ih-skill-toggle" />
        <span className="ih-skill-icon">📚</span>
        <span className="ih-skill-label">Từ vựng</span>
      </button>

      {isOwner && (
        <Link href="/admin" className="ih-skill-row">
          <span className="ih-skill-toggle" />
          <span className="ih-skill-icon">🔗</span>
          <span className="ih-skill-label">Admin · Người xem</span>
        </Link>
      )}
    </aside>
  )
}

function PageRow({ pageId, title, active, onSelect, isOwner }: { pageId: string; title: string; active: boolean; onSelect: () => void; isOwner: boolean }) {
  const updatePage = useIeltsStore((s) => s.updatePage)
  const flushPageSave = useIeltsStore((s) => s.flushPageSave)
  const deletePage = useIeltsStore((s) => s.deletePage)
  const [renaming, setRenaming] = useState(false)
  const [draft, setDraft] = useState(title)
  const btnRef = useRef<HTMLButtonElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)

  // Tooltip tên đầy đủ khi tên bị cắt bằng dấu … — hiện tức thì (title mặc định của trình duyệt trễ
  // cả giây). Dùng Popover API: phần tử popover nằm ở "top layer" nên không bị sidebar cắt
  // (overflow) và không bị backdrop-filter của sidebar làm lệch toạ độ position: fixed.
  function showTip() {
    const btn = btnRef.current
    const tip = tipRef.current
    if (!btn || !tip || !tip.showPopover) return
    if (btn.scrollWidth <= btn.clientWidth) return // tên hiện đủ rồi, khỏi tooltip
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
        {title}
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
              if (window.confirm(`Xoá trang "${title}"?`)) deletePage(pageId)
            }}
          >
            ×
          </button>
        </>
      )}
    </div>
  )
}
