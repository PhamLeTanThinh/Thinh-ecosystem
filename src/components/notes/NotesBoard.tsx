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
  // Toạ độ (hệ canvas, chưa scale) đang chờ chọn loại "Ghi chú" hay "Lịch trình" — null = không có
  // popover nào đang mở. Chỉ tạo note THẬT SỰ sau khi người dùng chọn 1 trong 2 lựa chọn.
  const [chooserAt, setChooserAt] = useState<{ x: number; y: number } | null>(null)
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
  // Kéo-để-cuộn kiểu "bàn tay" (Photoshop hand tool) khi note tràn ra ngoài vùng nhìn thấy — giữ
  // toạ độ bắt đầu (con trỏ + scroll hiện tại) để tính delta mỗi lần di chuột, và cờ `moved` để phân
  // biệt với 1 cú CLICK thật (mở popover chọn loại) — chỉ coi là pan nếu di chuyển vượt ngưỡng nhỏ,
  // tránh biến 1 click bình thường (tay hơi run vài px) thành pan làm mất luôn thao tác tạo note.
  const panRef = useRef<{ startX: number; startY: number; startScrollLeft: number; startScrollTop: number; moved: boolean } | null>(
    null,
  )
  const [isPanning, setIsPanning] = useState(false)
  const PAN_THRESHOLD = 4

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

  function handleCanvasPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return // chỉ nút trái mới pan/click — nút phải dành riêng cho việc mở popover chọn loại (xem handleCanvasContextMenu)
    mouseDownTargetRef.current = e.target
    if (e.target !== canvasRef.current || !outerRef.current) return // chỉ pan khi bắt đầu từ vùng trống, không phải kéo note con
    canvasRef.current.setPointerCapture(e.pointerId)
    panRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startScrollLeft: outerRef.current.scrollLeft,
      startScrollTop: outerRef.current.scrollTop,
      moved: false,
    }
  }

  function handleCanvasPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!panRef.current || !outerRef.current) return
    const dx = e.clientX - panRef.current.startX
    const dy = e.clientY - panRef.current.startY
    if (!panRef.current.moved) {
      if (Math.hypot(dx, dy) < PAN_THRESHOLD) return
      panRef.current.moved = true
      setIsPanning(true)
    }
    // Kéo chuột sang phải/xuống = lộ ra phần nội dung bên trái/trên (giống kéo tờ giấy bằng tay) —
    // scroll ngược dấu với delta con trỏ.
    outerRef.current.scrollLeft = panRef.current.startScrollLeft - dx
    outerRef.current.scrollTop = panRef.current.startScrollTop - dy
  }

  function handleCanvasPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    if (e.target === canvasRef.current) canvasRef.current?.releasePointerCapture(e.pointerId)
    const pan = panRef.current
    panRef.current = null
    setIsPanning(false)
    if (pan?.moved) return // vừa pan xong thì thôi

    if (e.target !== canvasRef.current) return
    if (mouseDownTargetRef.current !== canvasRef.current) return // drag bắt đầu từ nơi khác (vd bôi đen chữ trong note) — không phải 1 cú click thật
    // Click trái vào vùng trống không còn mở popover chọn loại nữa (đã đổi sang bấm chuột phải, xem
    // handleCanvasContextMenu) — chỉ dùng để đóng popover đang mở, giống thao tác "bấm ra ngoài để huỷ".
    setChooserAt(null)
  }

  // Bấm chuột phải vào vùng trống mới mở popover chọn "Ghi chú" hay "Lịch trình" — bấm phải lên 1
  // note thì để mặc định (không can thiệp), phòng khi sau này cần menu ngữ cảnh riêng cho note.
  function handleCanvasContextMenu(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target !== canvasRef.current) return
    e.preventDefault()
    const rect = canvasRef.current.getBoundingClientRect()
    const canvasWidth = rect.width / zoom
    const x = Math.max(4, Math.min((e.clientX - rect.left) / zoom, canvasWidth - NOTE_WIDTH - 4))
    const y = Math.max(4, (e.clientY - rect.top) / zoom)
    setChooserAt({ x, y })
  }

  // Người dùng chọn xong loại ("Ghi chú" hay "Lịch trình") ở popover — mới thật sự tạo note lúc này.
  function handleChooseKind(kind: 'note' | 'timeline') {
    if (!chooserAt) return
    const note = addNote(date, chooserAt.x, chooserAt.y, kind)
    setChooserAt(null)
    onStartEdit(note.id)
  }

  // Đóng popover đang chờ chọn nếu người dùng chuyển sang chỉnh sửa 1 note khác (vd bấm thẳng vào 1
  // note có sẵn) hoặc dừng chỉnh sửa hoàn toàn — click đó không đi qua handleCanvasPointerUp nên
  // phải dọn popover ở đây thay vì chỉ dựa vào việc click mới ghi đè chooserAt.
  useEffect(() => {
    setChooserAt(null)
  }, [editingId])

  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    if (!e.ctrlKey && !e.metaKey) return
    e.preventDefault()
    onZoomChange(clampZoom(zoom - e.deltaY * 0.001))
  }

  const contentHeight = notes.reduce(
    (max, n) => Math.max(max, n.y + (heights[n.id] ?? NOTE_HEIGHT_ESTIMATE) + BOARD_BOTTOM_GAP),
    0,
  )
  // Note có thể bị kéo sang phải quá xa (handleDragPointerMove trong StickyNoteCard chỉ chặn cận
  // dưới x >= 0, không chặn cận trên) — canvas phải tự giãn rộng ra theo đúng note xa nhất để còn
  // pan/cuộn ngang tới được, không thì note đó coi như "biến mất" (nằm ngoài vùng có thể cuộn).
  const contentWidth = notes.reduce((max, n) => Math.max(max, n.x + (n.width ?? NOTE_WIDTH) + BOARD_BOTTOM_GAP), 0)
  // Ở mọi mức zoom, canvas (trước khi scale) tối thiểu phải đủ lớn để sau khi scale vẫn phủ kín
  // outer — để "bấm bất kỳ đâu trên màn hình" luôn đúng, không để lại vùng chết không bấm được —
  // nhưng vẫn có thể giãn RỘNG/CAO hơn theo nội dung thật (contentWidth/contentHeight) để pan/cuộn
  // tới được note nằm ngoài vùng nhìn thấy ban đầu.
  const canvasWidth = Math.max(outerSize.width > 0 ? outerSize.width / zoom : 0, contentWidth) || undefined
  const canvasHeight = Math.max(outerSize.height > 0 ? outerSize.height / zoom : 0, contentHeight)

  return (
    <div ref={outerRef} className="nt-board-outer" onWheel={handleWheel}>
      <div
        ref={canvasRef}
        className={`nt-board-canvas${isPanning ? ' panning' : ''}`}
        style={{ width: canvasWidth, height: canvasHeight || undefined, transform: `scale(${zoom})`, transformOrigin: '0 0' }}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onContextMenu={handleCanvasContextMenu}
      >
        {notes.length === 0 && <p className="nt-board-empty">Nhấp chuột phải vào bất kỳ đâu để thêm ghi chú hoặc lịch trình</p>}
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

        {chooserAt && (
          <div
            className="nt-kind-chooser"
            style={{ left: chooserAt.x, top: chooserAt.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={() => handleChooseKind('note')}>
              📝 Ghi chú
            </button>
            <button type="button" onClick={() => handleChooseKind('timeline')}>
              🕐 Lịch trình
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
