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
  // id của note cần cuộn tới ngay khi board render (vd bấm 1 note từ danh sách "theo nhãn" ở
  // sidebar) — chỉ 1 tín hiệu 1 lần, không phải state hiển thị liên tục.
  focusNoteId?: string | null
}

// Canvas toàn màn hình của 1 ngày — mỗi ngày là 1 "space" riêng, note tạo mới gắn với `date`.
export function NotesBoard({ date, notes, editingId, zoom, onZoomChange, onStartEdit, onStopEdit, focusNoteId }: Props) {
  const addNote = useNotesStore((s) => s.addNote)
  const outerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  // Ghi lại target lúc mousedown — trình duyệt tổng hợp sự kiện "click" tại tổ tiên chung gần nhất
  // của target mousedown/mouseup, nên nếu người dùng bôi đen chữ BẮT ĐẦU trong 1 note con rồi thả
  // chuột ra ngoài (đè lên canvas trống), target của "click" vẫn là canvasRef (tổ tiên chung) dù
  // hành động thật sự là bôi đen chữ, không phải click vùng trống — gây tạo nhầm note mới + mất
  // selection do onStartEdit chuyển focus. Chỉ coi là "click vùng trống" khi CẢ mousedown lẫn click
  // đều nhắm đúng canvasRef.
  const mouseDownTargetRef = useRef<EventTarget | null>(null)
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

  // Cuộn tới đúng note khi được chọn từ nơi khác (vd danh sách "theo nhãn" ở sidebar) — note đó có
  // thể nằm ngoài vùng nhìn thấy trên canvas tự do (toạ độ x/y tuỳ ý), nên chỉ đổi ngày/mở edit
  // thôi chưa chắc đã nhìn thấy note. Đợi 1 nhịp cho note kịp render (nhất là khi vừa đổi `date`)
  // rồi mới scrollIntoView.
  useEffect(() => {
    if (!focusNoteId) return
    const id = requestAnimationFrame(() => {
      const el = canvasRef.current?.querySelector<HTMLElement>(`[data-note-id="${focusNoteId}"]`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
    })
    return () => cancelAnimationFrame(id)
  }, [focusNoteId, date, notes])

  const handleHeightChange = useCallback((id: string, height: number) => {
    setHeights((prev) => (prev[id] === height ? prev : { ...prev, [id]: height }))
  }, [])

  function handleCanvasMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    mouseDownTargetRef.current = e.target
  }

  function handleCanvasClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target !== canvasRef.current) return // chỉ tạo note khi click đúng vùng trống, không phải note con
    if (mouseDownTargetRef.current !== canvasRef.current) return // drag bắt đầu từ nơi khác (vd bôi đen chữ trong note) — không phải 1 cú click thật
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
        onMouseDown={handleCanvasMouseDown}
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
