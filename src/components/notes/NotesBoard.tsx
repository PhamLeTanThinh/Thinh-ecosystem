'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useNotesStore } from '@/lib/notes/store'
import type { StickyNote } from '@/lib/notes/types'
import { StickyNoteCard } from './StickyNoteCard'

const NOTE_WIDTH = 260
const NOTE_HEIGHT_ESTIMATE = 100
const BOARD_BOTTOM_GAP = 20
export const ZOOM_MIN = 0.5
export const ZOOM_MAX = 2
export const ZOOM_STEP = 0.1

export function clampZoom(z: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z * 100) / 100))
}

interface Props {
  date: string
  notes: StickyNote[]
  editingId: string | null
  zoom: number
  onZoomChange: (zoom: number) => void
  onStartEdit: (id: string) => void
  onStopEdit: () => void
}

// Canvas toàn màn hình của 1 ngày — mỗi ngày là 1 "space" riêng, note tạo mới gắn với `date`.
export function NotesBoard({ date, notes, editingId, zoom, onZoomChange, onStartEdit, onStopEdit }: Props) {
  const addNote = useNotesStore((s) => s.addNote)
  const outerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [outerSize, setOuterSize] = useState({ width: 0, height: 0 })
  // Chiều cao thật của từng note (đo bằng ResizeObserver) — cần để canvas tự giãn theo nội dung
  // rich text (có thể dài nhiều dòng) khi note nằm gần đáy màn hình.
  const [heights, setHeights] = useState<Record<string, number>>({})

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const report = () => setOuterSize({ width: el.clientWidth, height: el.clientHeight })
    report()
    const ro = new ResizeObserver(report)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handleHeightChange = useCallback((id: string, height: number) => {
    setHeights((prev) => (prev[id] === height ? prev : { ...prev, [id]: height }))
  }, [])

  function handleCanvasClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target !== canvasRef.current) return // chỉ tạo note khi click đúng vùng trống, không phải note con
    const rect = canvasRef.current!.getBoundingClientRect()
    const canvasWidth = rect.width / zoom
    const x = Math.max(4, Math.min((e.clientX - rect.left) / zoom, canvasWidth - NOTE_WIDTH - 4))
    const y = Math.max(4, (e.clientY - rect.top) / zoom)
    const note = addNote(date, x, y)
    onStartEdit(note.id)
  }

  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    if (!e.ctrlKey && !e.metaKey) return
    e.preventDefault()
    onZoomChange(clampZoom(zoom - e.deltaY * 0.001))
  }

  const contentHeight = notes.reduce(
    (max, n) => Math.max(max, n.y + (heights[n.id] ?? NOTE_HEIGHT_ESTIMATE) + BOARD_BOTTOM_GAP),
    0,
  )
  // Ở mọi mức zoom, canvas (trước khi scale) phải đủ lớn để sau khi scale vẫn phủ kín outer —
  // để "bấm bất kỳ đâu trên màn hình" luôn đúng, không để lại vùng chết không bấm được.
  const canvasWidth = outerSize.width > 0 ? outerSize.width / zoom : undefined
  const canvasHeight = Math.max(outerSize.height > 0 ? outerSize.height / zoom : 0, contentHeight)

  return (
    <div ref={outerRef} className="nt-board-outer" onWheel={handleWheel}>
      <div
        ref={canvasRef}
        className="nt-board-canvas"
        style={{ width: canvasWidth, height: canvasHeight || undefined, transform: `scale(${zoom})`, transformOrigin: '0 0' }}
        onClick={handleCanvasClick}
      >
        {notes.length === 0 && <p className="nt-board-empty">Nhấp vào bất kỳ đâu để tạo ghi chú</p>}
        {notes.map((note) => (
          <StickyNoteCard
            key={note.id}
            note={note}
            editing={editingId === note.id}
            zoom={zoom}
            onStartEdit={() => onStartEdit(note.id)}
            onStopEdit={onStopEdit}
            onHeightChange={handleHeightChange}
          />
        ))}
      </div>
    </div>
  )
}
