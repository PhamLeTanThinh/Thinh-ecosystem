'use client'

import { useMemo, useState } from 'react'
import { getAncestorKeys, type TreeNode } from '@/lib/notes/dateTree'
import { fromISODate } from '@/lib/notes/date'
import type { StickyNote } from '@/lib/notes/types'

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function shortDate(iso: string): string {
  const d = fromISODate(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

interface Props {
  tree: TreeNode[]
  notes: StickyNote[] // TOÀN BỘ note (mọi ngày) — dùng để dựng danh sách "theo nhãn", khác `tree` vốn chỉ gom theo ngày
  currentDate: string
  onSelectDay: (date: string) => void
  onSelectNote: (date: string, noteId: string) => void
  onDeleteGroup: (noteIds: string[], label: string) => void
  onClose: () => void
}

type SidebarMode = 'date' | 'tag'

export function NotesSidebar({ tree, notes, currentDate, onSelectDay, onSelectNote, onDeleteGroup, onClose }: Props) {
  const [mode, setMode] = useState<SidebarMode>('date')
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(getAncestorKeys(currentDate)))
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set())
  // Theo dõi ngày đang xem lúc render trước — khi đổi (qua nav ở topbar, không chỉ click trong cây),
  // mở rộng luôn nhánh dẫn tới ngày mới ngay trong render (không dùng effect để tránh 1 nhịp re-render
  // thừa) mà vẫn giữ các nhánh user đã tự mở/đóng trước đó.
  const [trackedDate, setTrackedDate] = useState(currentDate)
  if (currentDate !== trackedDate) {
    setTrackedDate(currentDate)
    setExpanded((prev) => new Set([...prev, ...getAncestorKeys(currentDate)]))
  }

  // Gom theo nhãn trên TOÀN BỘ note (không chỉ ngày đang xem) — mục đích chính là TÌM note cũ theo
  // nhãn, nên phải xuyên suốt mọi ngày. Mỗi nhãn sắp theo ngày mới nhất trước.
  const byTag = useMemo(() => {
    const map = new Map<string, StickyNote[]>()
    for (const n of notes) {
      for (const t of n.tags) {
        if (!map.has(t)) map.set(t, [])
        map.get(t)!.push(n)
      }
    }
    for (const list of map.values()) list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [notes])

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function toggleTag(tag: string) {
    setExpandedTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  return (
    <aside className="nt-sidebar">
      <div className="nt-sidebar-header">
        <span>Ghi chú</span>
        <button type="button" aria-label="Đóng danh sách" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="nt-sidebar-tabs">
        <button type="button" className={mode === 'date' ? 'active' : ''} onClick={() => setMode('date')}>
          Theo ngày
        </button>
        <button type="button" className={mode === 'tag' ? 'active' : ''} onClick={() => setMode('tag')}>
          Theo nhãn
        </button>
      </div>

      {mode === 'date' ? (
        <div className="nt-tree">
          {tree.map((node) => (
            <TreeRow
              key={node.key}
              node={node}
              depth={0}
              currentDate={currentDate}
              expanded={expanded}
              onToggle={toggle}
              onSelectDay={onSelectDay}
              onDeleteGroup={onDeleteGroup}
            />
          ))}
        </div>
      ) : byTag.length === 0 ? (
        <p className="nt-tree-empty">Chưa có ghi chú nào được gắn nhãn.</p>
      ) : (
        <div className="nt-tree">
          {byTag.map(([tag, tagNotes]) => {
            const isOpen = expandedTags.has(tag)
            return (
              <div key={tag} className="nt-tree-group">
                <div className="nt-tree-group-row">
                  <button type="button" className="nt-tree-toggle" aria-label={isOpen ? 'Thu gọn' : 'Mở rộng'} onClick={() => toggleTag(tag)}>
                    {isOpen ? '▾' : '▸'}
                  </button>
                  <button type="button" className="nt-tree-group-label" onClick={() => toggleTag(tag)}>
                    #{tag}
                  </button>
                  <span className="nt-tree-count">{tagNotes.length}</span>
                </div>
                {isOpen &&
                  tagNotes.map((n) => (
                    <button key={n.id} type="button" className="nt-tree-note" onClick={() => onSelectNote(n.date, n.id)}>
                      <span className="nt-tree-note-snippet">{stripHtml(n.content) || 'Ghi chú trống'}</span>
                      <span className="nt-tree-note-date">{shortDate(n.date)}</span>
                    </button>
                  ))}
              </div>
            )
          })}
        </div>
      )}
    </aside>
  )
}

interface RowProps {
  node: TreeNode
  depth: number
  currentDate: string
  expanded: Set<string>
  onToggle: (key: string) => void
  onSelectDay: (date: string) => void
  onDeleteGroup: (noteIds: string[], label: string) => void
}

function TreeRow({ node, depth, currentDate, expanded, onToggle, onSelectDay, onDeleteGroup }: RowProps) {
  if (node.isDay) {
    const isActive = node.date === currentDate
    return (
      <div
        className={`nt-tree-day${isActive ? ' active' : ''}`}
        style={{ paddingLeft: 12 + depth * 14, borderLeftColor: node.color }}
      >
        <button type="button" className="nt-tree-day-btn" onClick={() => onSelectDay(node.date!)}>
          {node.label}
        </button>
        {node.count > 0 && <span className="nt-tree-count">{node.count}</span>}
        {node.count > 0 && (
          <button
            type="button"
            aria-label={`Xoá ghi chú ngày ${node.label}`}
            className="nt-tree-delete"
            onClick={() => onDeleteGroup(node.noteIds, node.label)}
          >
            ×
          </button>
        )}
      </div>
    )
  }

  const isOpen = expanded.has(node.key)

  return (
    <div className="nt-tree-group">
      <div className="nt-tree-group-row" style={{ paddingLeft: depth * 14, borderLeftColor: node.color }}>
        <button
          type="button"
          className="nt-tree-toggle"
          aria-label={isOpen ? 'Thu gọn' : 'Mở rộng'}
          onClick={() => onToggle(node.key)}
        >
          {isOpen ? '▾' : '▸'}
        </button>
        <button type="button" className="nt-tree-group-label" onClick={() => onToggle(node.key)}>
          {node.label}
        </button>
        <span className="nt-tree-count">{node.count}</span>
        {node.count > 0 && (
          <button
            type="button"
            aria-label={`Xoá tất cả ghi chú trong ${node.label}`}
            className="nt-tree-delete"
            onClick={() => onDeleteGroup(node.noteIds, node.label)}
          >
            ×
          </button>
        )}
      </div>
      {isOpen &&
        node.children.map((child) => (
          <TreeRow
            key={child.key}
            node={child}
            depth={depth + 1}
            currentDate={currentDate}
            expanded={expanded}
            onToggle={onToggle}
            onSelectDay={onSelectDay}
            onDeleteGroup={onDeleteGroup}
          />
        ))}
    </div>
  )
}
