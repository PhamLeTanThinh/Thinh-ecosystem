'use client'

import type { StickyNote, TimeBlock } from '@/lib/notes/types'

interface FlatBlock extends TimeBlock {
  startTime: string
  noteId: string
}

interface Props {
  dayLabel: string
  notes: StickyNote[] // đã lọc theo ngày đang xem — component tự lọc kind === 'timeline' rồi gom + sort theo giờ
  onToggleDone: (noteId: string, blockId: string) => void
  onDeleteBlock: (noteId: string, blockId: string) => void
  onSelectNote: (noteId: string) => void
  onClose: () => void
}

// View tổng hợp CHỈ ĐỌC — nguồn dữ liệu thật là các note kind 'timeline' trên canvas (xem
// StickyNoteCard.tsx để thêm/sửa mốc giờ). Panel này chỉ gom hết các việc ĐÃ GẮN GIỜ của mọi
// note-lịch-trình trong ngày thành 1 danh sách duy nhất cho dễ nhìn tổng quan — việc không gắn giờ
// (hiện như todo-list trong note) không thuộc phạm vi view "theo giờ" này, ở lại trong note của nó.
export function TimelinePanel({ dayLabel, notes, onToggleDone, onDeleteBlock, onSelectNote, onClose }: Props) {
  const blocks: FlatBlock[] = notes
    .filter((n) => n.kind === 'timeline')
    .flatMap((n) => n.timeBlocks.map((b) => ({ ...b, noteId: n.id })))
    .filter((b): b is FlatBlock => b.startTime !== null)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <aside className="nt-timeline-panel">
      <div className="nt-sidebar-header">
        <span>Lịch trình — {dayLabel}</span>
        <button type="button" aria-label="Đóng lịch trình" onClick={onClose}>
          ×
        </button>
      </div>

      {blocks.length === 0 ? (
        <p className="nt-tree-empty">
          Chưa có mốc giờ nào — nhấp vào canvas và chọn &quot;🕐 Lịch trình&quot; để tạo 1 note lịch trình mới.
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
                  aria-label={b.done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
                  onClick={() => onToggleDone(b.noteId, b.id)}
                >
                  {b.done && '✓'}
                </button>
                <button type="button" className="nt-timeline-text" onClick={() => onSelectNote(b.noteId)}>
                  {b.text}
                </button>
                <button
                  type="button"
                  aria-label="Xoá mốc giờ"
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
