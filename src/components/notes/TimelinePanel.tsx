'use client'

import type { StickyNote, TimeBlock } from '@/lib/notes/types'

interface FlatBlock extends TimeBlock {
  startTime: string
  noteId: string
}

interface Props {
  dayLabel: string
  notes: StickyNote[] // already filtered to the day being viewed — the component itself filters to kind === 'timeline' then gathers + sorts by time
  onToggleDone: (noteId: string, blockId: string) => void
  onDeleteBlock: (noteId: string, blockId: string) => void
  onSelectNote: (noteId: string) => void
  onClose: () => void
}

// A READ-ONLY aggregate view — the real data source is the 'timeline'-kind notes on the canvas (see
// StickyNoteCard.tsx to add/edit time entries). This panel just gathers every TIMED item across all
// timeline notes for the day into one list for an at-a-glance overview — untimed items (shown as a
// todo-list inside the note) are out of scope for this "by time" view and stay in their own note.
export function TimelinePanel({ dayLabel, notes, onToggleDone, onDeleteBlock, onSelectNote, onClose }: Props) {
  const blocks: FlatBlock[] = notes
    .filter((n) => n.kind === 'timeline')
    .flatMap((n) => n.timeBlocks.map((b) => ({ ...b, noteId: n.id })))
    .filter((b): b is FlatBlock => b.startTime !== null)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <aside className="nt-timeline-panel">
      <div className="nt-sidebar-header">
        <span>Timeline — {dayLabel}</span>
        <button type="button" aria-label="Close timeline" onClick={onClose}>
          ×
        </button>
      </div>

      {blocks.length === 0 ? (
        <p className="nt-tree-empty">
          No time entries yet — right-click the canvas and choose &quot;🕐 Timeline&quot; to create a new timeline note.
        </p>
      ) : (
        <div className="nt-timeline-track">
          {blocks.map((b) => (
            <div key={b.id} className={`nt-timeline-item${b.done ? ' done' : ''}`}>
              <div className="nt-timeline-time">
                <span>{b.startTime}</span>
                {b.endTime && <span className="nt-timeline-time-end">{b.endTime}</span>}
              </div>
              <div className="nt-timeline-rail">
                <span className="nt-timeline-dot" />
              </div>
              <div className="nt-timeline-content">
                <button
                  type="button"
                  className="nt-timeline-check"
                  aria-label={b.done ? 'Mark as not done' : 'Mark as done'}
                  onClick={() => onToggleDone(b.noteId, b.id)}
                >
                  {b.done && '✓'}
                </button>
                <button type="button" className="nt-timeline-text" onClick={() => onSelectNote(b.noteId)}>
                  {b.text}
                </button>
                <button
                  type="button"
                  aria-label="Delete time entry"
                  className="nt-timeline-delete"
                  onClick={() => onDeleteBlock(b.noteId, b.id)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}
