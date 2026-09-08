'use client'

import { useEffect, useRef, useState } from 'react'
import { useNotesStore } from '@/lib/notes/store'
import { NOTE_COLORS, type NoteColor, type StickyNote } from '@/lib/notes/types'
import { NoteEditor } from './NoteEditor'

const NOTE_WIDTH_DEFAULT = 260
const MIN_WIDTH = 180
const MIN_HEIGHT = 90

const COLOR_HEX: Record<NoteColor, string> = {
  yellow: '#E8B324',
  pink: '#E0648A',
  mint: '#2FAE82',
  sky: '#3E8FE0',
  lavender: '#8B6FE0',
}

function isEffectivelyEmpty(html: string): boolean {
  if (/<img\b/i.test(html)) return false // note chỉ có ảnh, không có chữ, vẫn tính là có nội dung
  return html.replace(/<[^>]*>/g, '').trim() === ''
}

interface Props {
  note: StickyNote
  editing: boolean
  zoom: number
  onStartEdit: () => void
  onStopEdit: () => void
  onHeightChange: (id: string, height: number) => void
}

export function StickyNoteCard({ note, editing, zoom, onStartEdit, onStopEdit, onHeightChange }: Props) {
  const updateNote = useNotesStore((s) => s.updateNote)
  const deleteNote = useNotesStore((s) => s.deleteNote)
  const [tagDraft, setTagDraft] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  // Vị trí/kích thước "sống" trong lúc đang kéo/resize — chỉ ghi vào store lúc thả ra,
  // tránh spam PUT lên server mỗi pixel di chuyển. Dùng thêm ref (không chỉ state) để đọc
  // được giá trị mới nhất ở pointerup mà không dính stale-closure hay setState lồng side-effect.
  const [livePos, setLivePos] = useState<{ x: number; y: number } | null>(null)
  const [liveSize, setLiveSize] = useState<{ width: number; height: number } | null>(null)
  const livePosRef = useRef<{ x: number; y: number } | null>(null)
  const liveSizeRef = useRef<{ width: number; height: number } | null>(null)
  const dragRef = useRef<{ startX: number; startY: number; noteX: number; noteY: number } | null>(null)
  const resizeRef = useRef<{ startX: number; startY: number; width: number; height: number } | null>(null)

  // Band cha cần biết chiều cao thật của note (rich text có thể dài nhiều dòng) để tự giãn,
  // tránh note tràn đè lên band tuần kế tiếp.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const report = () => onHeightChange(note.id, el.offsetHeight)
    report()
    const ro = new ResizeObserver(report)
    ro.observe(el)
    return () => ro.disconnect()
  }, [note.id, onHeightChange])

  function handleRootBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return
    onStopEdit()
    if (isEffectivelyEmpty(note.content)) deleteNote(note.id)
    else useNotesStore.getState().flushSave()
  }

  function handleDragPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, noteX: note.x, noteY: note.y }
  }

  function handleDragPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return
    const dx = (e.clientX - dragRef.current.startX) / zoom
    const dy = (e.clientY - dragRef.current.startY) / zoom
    const next = { x: Math.max(0, dragRef.current.noteX + dx), y: Math.max(0, dragRef.current.noteY + dy) }
    livePosRef.current = next
    setLivePos(next)
  }

  function handleDragPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return
    dragRef.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
    const pos = livePosRef.current
    livePosRef.current = null
    setLivePos(null)
    if (pos) updateNote(note.id, { x: pos.x, y: pos.y })
  }

  function handleResizePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      width: note.width ?? rootRef.current?.offsetWidth ?? NOTE_WIDTH_DEFAULT,
      height: note.height ?? rootRef.current?.offsetHeight ?? MIN_HEIGHT,
    }
  }

  function handleResizePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!resizeRef.current) return
    const dx = (e.clientX - resizeRef.current.startX) / zoom
    const dy = (e.clientY - resizeRef.current.startY) / zoom
    const next = {
      width: Math.max(MIN_WIDTH, resizeRef.current.width + dx),
      height: Math.max(MIN_HEIGHT, resizeRef.current.height + dy),
    }
    liveSizeRef.current = next
    setLiveSize(next)
  }

  function handleResizePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!resizeRef.current) return
    resizeRef.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
    const size = liveSizeRef.current
    liveSizeRef.current = null
    setLiveSize(null)
    if (size) updateNote(note.id, { width: size.width, height: size.height })
  }

  const x = livePos?.x ?? note.x
  const y = livePos?.y ?? note.y
  const width = liveSize?.width ?? note.width ?? NOTE_WIDTH_DEFAULT
  const height = liveSize?.height ?? note.height ?? undefined

  return (
    <div
      ref={rootRef}
      className="nt-note"
      style={{ left: x, top: y, width, height, borderLeftColor: note.color ? COLOR_HEX[note.color] : 'transparent' }}
      onClick={() => !editing && onStartEdit()}
      onFocus={onStartEdit}
      onBlur={handleRootBlur}
    >
      <div
        className="nt-note-drag-handle"
        onPointerDown={handleDragPointerDown}
        onPointerMove={handleDragPointerMove}
        onPointerUp={handleDragPointerUp}
      >
        <span />
        <span />
        <span />
      </div>

      {editing && (
        <div className="nt-note-chrome">
          <div className="nt-tb-swatches" aria-label="Màu ghi chú">
            {NOTE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                className={`nt-tb-swatch${note.color === c ? ' active' : ''}`}
                style={{ backgroundColor: COLOR_HEX[c] }}
                onClick={() => updateNote(note.id, { color: note.color === c ? null : c })}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Xoá ghi chú"
            className="nt-note-delete"
            onClick={() => {
              if (window.confirm('Xoá ghi chú này?')) deleteNote(note.id)
            }}
          >
            ×
          </button>
        </div>
      )}

      <div className="nt-note-body">
        <NoteEditor content={note.content} editable={editing} onChangeHtml={(html) => updateNote(note.id, { content: html })} />
      </div>

      {(editing || note.tags.length > 0) && (
        <div className="nt-note-tags">
          {note.tags.map((t) => (
            <span key={t} className="nt-tag-chip">
              {t}
              {editing && (
                <button
                  type="button"
                  aria-label={`Xoá nhãn ${t}`}
                  onClick={() => updateNote(note.id, { tags: note.tags.filter((x) => x !== t) })}
                >
                  ×
                </button>
              )}
            </span>
          ))}
          {editing && (
            <input
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagDraft.trim()) {
                  e.preventDefault()
                  updateNote(note.id, { tags: Array.from(new Set([...note.tags, tagDraft.trim()])) })
                  setTagDraft('')
                }
              }}
              placeholder="+ nhãn"
              className="nt-tag-input"
            />
          )}
        </div>
      )}

      <div
        className="nt-note-resize-handle"
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
      />
    </div>
  )
}
