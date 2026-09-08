'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useIeltsStore } from '@/lib/ielts/store'
import { useIeltsAccess } from './AccessContext'
import { SKILLS } from '@/lib/ielts/skills'
import type { Skill } from '@/lib/ielts/types'

export type Selection = { type: 'page'; id: string } | { type: 'vocab' }

interface Props {
  selection: Selection
  onSelect: (s: Selection) => void
}

export function Sidebar({ selection, onSelect }: Props) {
  const { isOwner } = useIeltsAccess()
  const pages = useIeltsStore((s) => s.pages)
  const addPage = useIeltsStore((s) => s.addPage)
  const [expanded, setExpanded] = useState<Set<Skill>>(() => new Set(SKILLS.map((s) => s.key)))
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
    <aside className="ih-sidebar">
      <div className="ih-sidebar-title">Kiến thức IELTS</div>

      {SKILLS.map((skill) => {
        const skillPages = pages.filter((p) => p.skill === skill.key).sort((a, b) => a.sortOrder - b.sortOrder)
        const isOpen = expanded.has(skill.key)
        return (
          <div key={skill.key} className="ih-skill-group">
            <button type="button" className="ih-skill-row" onClick={() => toggle(skill.key)}>
              <span className="ih-skill-toggle">{isOpen ? '▾' : '▸'}</span>
              <span className="ih-skill-icon">{skill.icon}</span>
              <span className="ih-skill-label">{skill.label}</span>
            </button>

            {isOpen && (
              <div className="ih-page-list">
                {skillPages.map((page) => (
                  <PageRow key={page.id} pageId={page.id} title={page.title} active={selection.type === 'page' && selection.id === page.id} onSelect={() => onSelect({ type: 'page', id: page.id })} isOwner={isOwner} />
                ))}

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

      <button type="button" className={`ih-skill-row ih-vocab-row${selection.type === 'vocab' ? ' active' : ''}`} onClick={() => onSelect({ type: 'vocab' })}>
        <span className="ih-skill-toggle" />
        <span className="ih-skill-icon">📚</span>
        <span className="ih-skill-label">Từ vựng</span>
      </button>

      {isOwner && (
        <Link href="/ielts/admin" className="ih-skill-row">
          <span className="ih-skill-toggle" />
          <span className="ih-skill-icon">🔗</span>
          <span className="ih-skill-label">Chia sẻ / Người xem</span>
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
      <button type="button" className="ih-page-row-btn" onClick={onSelect}>
        {title}
      </button>
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
