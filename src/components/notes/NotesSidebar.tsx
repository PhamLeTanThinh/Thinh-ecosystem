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
  notes: StickyNote[] // ALL notes (every day) — used to build the "by tag" list, unlike `tree` which only groups by day
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
  // Tracks the day being viewed as of the previous render — when it changes (via the topbar nav,
  // not just clicking in the tree), expand the branch leading to the new day right during render
  // (no effect, to avoid an extra render pass) while still keeping any branches the user manually
  // opened/closed before.
  const [trackedDate, setTrackedDate] = useState(currentDate)
  if (currentDate !== trackedDate) {
    setTrackedDate(currentDate)
    setExpanded((prev) => new Set([...prev, ...getAncestorKeys(currentDate)]))
  }

  // Group by tag across ALL notes (not just the day being viewed) — the point here is to FIND old
  // notes by tag, so it has to span every day. Each tag is sorted with the newest date first.
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
        <span>Notes</span>
        <button type="button" aria-label="Close list" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="nt-sidebar-tabs">
        <button type="button" className={mode === 'date' ? 'active' : ''} onClick={() => setMode('date')}>
          By date
        </button>
        <button type="button" className={mode === 'tag' ? 'active' : ''} onClick={() => setMode('tag')}>
          By tag
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
        <p className="nt-tree-empty">No tagged notes yet.</p>
      ) : (
        <div className="nt-tree">
          {byTag.map(([tag, tagNotes]) => {
            const isOpen = expandedTags.has(tag)
            return (
              <div key={tag} className="nt-tree-group">
                <div className="nt-tree-group-row">
                  <button type="button" className="nt-tree-toggle" aria-label={isOpen ? 'Collapse' : 'Expand'} onClick={() => toggleTag(tag)}>
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
                      <span className="nt-tree-note-snippet">{stripHtml(n.content) || 'Empty note'}</span>
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

// Every card is tinted with its level's color (hex from dateTree.ts + ~9% alpha) — distinguishes
// levels without being loud. The currently selected day skips the tint to keep .nt-tree-day.active's
// solid background.
function levelStyle(color: string | undefined, active = false): React.CSSProperties {
  if (!color) return {}
  return active ? { borderLeftColor: color } : { borderLeftColor: color, backgroundColor: `${color}17` }
}

function TreeRow({ node, depth, currentDate, expanded, onToggle, onSelectDay, onDeleteGroup }: RowProps) {
  if (node.isDay) {
    const isActive = node.date === currentDate
    return (
      <div
        className={`nt-tree-day${isActive ? ' active' : ''}`}
        style={{ paddingLeft: 12 + depth * 14, ...levelStyle(node.color, isActive) }}
      >
        <button type="button" className="nt-tree-day-btn" onClick={() => onSelectDay(node.date!)}>
          {node.label}
        </button>
        {node.count > 0 && <span className="nt-tree-count">{node.count}</span>}
        {node.count > 0 && (
          <button
            type="button"
            aria-label={`Delete notes for ${node.label}`}
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
      <div className="nt-tree-group-row" style={{ paddingLeft: depth * 14, ...levelStyle(node.color) }}>
        <button
          type="button"
          className="nt-tree-toggle"
          aria-label={isOpen ? 'Collapse' : 'Expand'}
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
            aria-label={`Delete all notes in ${node.label}`}
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
