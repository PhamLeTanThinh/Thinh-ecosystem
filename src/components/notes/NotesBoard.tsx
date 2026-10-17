'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNotesStore } from '@/lib/notes/store'
import { OVERALL_DATE, type NoteKind, type StickyNote } from '@/lib/notes/types'
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
  // id of the note to scroll to as soon as the board renders (e.g. clicking a note from the "by
  // tag" list in the sidebar) — a one-shot signal, not a persistent display state.
  focusNoteId?: string | null
  // Overall view only — the topic board new notes get attached to (null = Uncategorized / a day board).
  topicId?: string | null
}

// Full-screen canvas for a single day — each day is its own "space", new notes get attached to `date`.
export function NotesBoard({ date, notes, editingId, zoom, onZoomChange, onStartEdit, onStopEdit, focusNoteId, topicId = null }: Props) {
  const addNote = useNotesStore((s) => s.addNote)
  const outerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  // Position (canvas coordinates, unscaled) waiting for a "Note" vs "Timeline" choice — null = no
  // popover open. The note is only actually created after the user picks one of the two options.
  const [chooserAt, setChooserAt] = useState<{ x: number; y: number } | null>(null)
  // Tracks the target at mousedown time — the browser synthesizes the "click" event at the nearest
  // common ancestor of the mousedown/mouseup targets, so if the user starts selecting text INSIDE a
  // child note and releases the mouse outside it (over the empty canvas), the "click" target is
  // still canvasRef (the common ancestor) even though the real action was a text selection, not a
  // click on empty space — this would wrongly create a new note and lose the selection since
  // onStartEdit shifts focus. Only treat it as "clicked empty space" when BOTH mousedown and click
  // target canvasRef exactly.
  const mouseDownTargetRef = useRef<EventTarget | null>(null)
  const [outerSize, setOuterSize] = useState({ width: 0, height: 0 })
  // Khoảng đệm trái/trên của "thế giới" note (offX/offY, đơn vị canvas) + kích thước canvas tối thiểu (minW/minH)
  // — do zoom quanh con trỏ sinh ra (xem paint() bên dưới): thu nhỏ khi nội dung đã nhỏ hơn khung thì giữ điểm dưới
  // chuột đứng yên cần CUỘN ÂM (trình duyệt không cho) → dồn phần âm đó thành khoảng đệm đẩy các note vào trong.
  // Lưu thành state (chốt lúc hoạt ảnh zoom dừng) để render React khớp đúng khung hình cuối của hoạt ảnh.
  const [view, setView] = useState({ offX: 0, offY: 0, minW: 0, minH: 0 })
  // Note có thể nằm ở toạ độ ÂM (kéo vào vùng đệm bên trái/trên) → khoảng đệm hiệu lực luôn đủ chứa chúng.
  const minNoteX = notes.reduce((min, n) => Math.min(min, n.x), 0)
  const minNoteY = notes.reduce((min, n) => Math.min(min, n.y), 0)
  const effOffX = Math.max(view.offX, -minNoteX)
  const effOffY = Math.max(view.offY, -minNoteY)
  // Actual measured height of each note (via ResizeObserver) — needed so the canvas can grow to fit
  // rich-text content (which can span many lines) when a note sits near the bottom of the screen.
  const [heights, setHeights] = useState<Record<string, number>>({})
  // Photoshop-style "hand tool" drag-to-scroll when notes overflow the visible area — keeps the
  // starting coordinates (pointer + current scroll) to compute the delta on every mouse move, and a
  // `moved` flag to distinguish this from an actual CLICK (which opens the kind-picker popover) —
  // only counts as a pan once movement exceeds a small threshold, so a normal click (a few px of
  // hand tremor) doesn't get turned into a pan and swallow the note-creation action.
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

  // Scroll to the right note when it's selected from elsewhere (e.g. the "by tag" list in the
  // sidebar) — that note may be outside the visible area of the free-form canvas (arbitrary x/y),
  // so just switching the date/opening edit mode isn't enough to actually see it. Wait a frame for
  // the note to render (especially right after `date` changes) before calling scrollIntoView.
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
    if (e.button !== 0) return // only the left button pans/clicks — right-click is reserved for opening the kind-picker (see handleCanvasContextMenu)
    mouseDownTargetRef.current = e.target
    if (e.target !== canvasRef.current || !outerRef.current) return // only pan when starting from empty space, not while dragging a child note
    // Nhấn-rồi-kéo cũng là thao tác BÔI ĐEN CHỮ mặc định của trình duyệt → kéo canvas qua note nào là chữ note đó
    // bị bôi đen. Chặn mặc định ngay từ lúc nhấn + xoá vùng chọn cũ. Chặn mặc định thì ô chữ đang focus không tự
    // mất focus như trước nữa → blur tay, để note đang sửa vẫn thoát chế độ sửa khi bấm ra chỗ trống (handleRootBlur).
    e.preventDefault()
    window.getSelection()?.removeAllRanges()
    const active = document.activeElement
    if (active instanceof HTMLElement && canvasRef.current.contains(active)) active.blur()
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
    // Dragging right/down reveals content to the left/above (like dragging a sheet of paper by
    // hand) — scroll moves opposite to the pointer delta.
    outerRef.current.scrollLeft = panRef.current.startScrollLeft - dx
    outerRef.current.scrollTop = panRef.current.startScrollTop - dy
  }

  function handleCanvasPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return
    if (e.target === canvasRef.current) canvasRef.current?.releasePointerCapture(e.pointerId)
    const pan = panRef.current
    panRef.current = null
    setIsPanning(false)
    if (pan?.moved) return // just finished panning, nothing else to do

    if (e.target !== canvasRef.current) return
    if (mouseDownTargetRef.current !== canvasRef.current) return // drag started elsewhere (e.g. selecting text in a note) — not a real click
    // Left-click on empty space no longer opens the kind-picker popover (moved to right-click, see
    // handleCanvasContextMenu) — it now only closes an open popover, like a "click outside to cancel".
    setChooserAt(null)
  }

  // Right-clicking empty space opens the "Note" vs "Timeline" popover — right-clicking a note is
  // left alone (no interception), in case a note-specific context menu is needed later.
  function handleCanvasContextMenu(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target !== canvasRef.current) return
    e.preventDefault()
    const rect = canvasRef.current.getBoundingClientRect()
    // Toạ độ trong "thế giới" note = toạ độ canvas trừ khoảng đệm (effOffX/effOffY) — có thể âm khi bấm vào vùng
    // đệm bên trái/trên; chặn trong phạm vi canvas.
    const worldWidth = rect.width / zoom - effOffX
    const x = Math.max(4 - effOffX, Math.min((e.clientX - rect.left) / zoom - effOffX, worldWidth - NOTE_WIDTH - 4))
    const y = Math.max(4 - effOffY, (e.clientY - rect.top) / zoom - effOffY)
    setChooserAt({ x, y })
  }

  // The user finished picking a kind ("Note" or "Timeline") from the popover — this is when the
  // note actually gets created.
  function handleChooseKind(kind: NoteKind) {
    if (!chooserAt) return
    const note = addNote(date, chooserAt.x, chooserAt.y, kind, topicId)
    setChooserAt(null)
    onStartEdit(note.id)
  }

  // Close a pending popover if the user switches to editing a different note (e.g. clicks directly
  // on an existing note) or stops editing entirely — that click doesn't go through
  // handleCanvasPointerUp, so the popover has to be cleared here instead of relying solely on a
  // click overwriting chooserAt.
  useEffect(() => {
    setChooserAt(null)
  }, [editingId])

  // Ctrl/⌘ + lăn chuột (và pinch 2 ngón trên touchpad — trình duyệt báo nó là wheel kèm ctrlKey) trong board
  // chỉ zoom board, KHÔNG zoom cả trang. Phải là listener gốc { passive: false }: onWheel của React gắn ở chế
  // độ passive nên preventDefault() bị bỏ qua — board zoom mà trình duyệt cũng zoom theo.
  //
  // Zoom MƯỢT quanh con trỏ (kiểu Figma/Miro):
  // - mỗi sự kiện wheel nhân mức zoom đích với exp(-deltaY·k) — đều tay ở mọi mức zoom, pinch nhỏ thì zoom tinh;
  // - mức zoom hiển thị trượt dần về đích bằng requestAnimationFrame;
  // - trong lúc trượt KHÔNG đổi state React (đổi mỗi khung hình là render lại mọi note → giật): ghi thẳng
  //   transform / kích thước canvas + khối đệm / vị trí cuộn lên DOM, xong mới báo onZoomChange() 1 lần;
  // - điểm canvas dưới chuột (anchor) giữ nguyên chỗ suốt quá trình.
  const zoomRef = useRef(zoom) // mức zoom ĐANG HIỂN THỊ (kể cả giữa hoạt ảnh)
  const targetZoomRef = useRef(zoom)
  const rafRef = useRef(0)
  const anchorRef = useRef<{ canvasX: number; canvasY: number; viewX: number; viewY: number } | null>(null)
  const onZoomChangeRef = useRef(onZoomChange)
  const contentSizeRef = useRef({ width: 0, height: 0, minX: 0, minY: 0 })
  const sizerRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const offRef = useRef({ x: 0, y: 0 }) // khoảng đệm ĐANG HIỂN THỊ (đơn vị canvas) — như view.offX/offY nhưng cả giữa hoạt ảnh
  const lastPaintRef = useRef({ offX: 0, offY: 0, minW: 0, minH: 0 })
  useLayoutEffect(() => {
    onZoomChangeRef.current = onZoomChange
    // Không có hoạt ảnh → đồng bộ lại theo state (zoom đổi từ nút −/+/⟲, khoảng đệm đã chốt)
    if (!rafRef.current) {
      zoomRef.current = zoom
      targetZoomRef.current = zoom
      offRef.current = { x: effOffX, y: effOffY }
    }
  })
  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  useEffect(() => {
    const outer = outerRef.current
    if (!outer) return

    // Ghi 1 mức zoom thẳng lên DOM, giữ điểm neo (toạ độ "thế giới" dưới chuột) đứng yên trên màn hình.
    // Màn hình = (P + off)·z − scroll. Muốn = viewX → (scroll − off·z) = P·z − viewX =: need. need ≥ 0 thì cuộn tới
    // đó, khoảng đệm 0; need < 0 (thu nhỏ khi nội dung đã nhỏ hơn khung — phải "cuộn âm") thì cuộn 0 và đẩy các
    // note vào trong một khoảng đệm off = −need / z. Canvas đủ lớn để cuộn được tới đó (minW/minH).
    const paint = (z: number) => {
      const canvas = canvasRef.current
      const sizer = sizerRef.current
      const world = worldRef.current
      const a = anchorRef.current
      if (!canvas || !sizer || !world || !a) return
      const { width: cw, height: ch, minX, minY } = contentSizeRef.current
      const needX = a.canvasX * z - a.viewX
      const needY = a.canvasY * z - a.viewY
      // Khoảng đệm cũng không được nhỏ hơn phần các note đang lấn sang toạ độ âm (đã kéo vào vùng đệm) — nếu
      // không, zoom vào lại thì các note đó bị cắt mất bên ngoài mép trái/trên.
      const offX = Math.max(needX < 0 ? -needX / z : 0, -minX)
      const offY = Math.max(needY < 0 ? -needY / z : 0, -minY)
      const scrollX = needX + offX * z
      const scrollY = needY + offY * z
      const minW = (scrollX + outer.clientWidth) / z
      const minH = (scrollY + outer.clientHeight) / z
      const w = Math.max(outer.clientWidth / z, cw + offX, minW)
      const h = Math.max(outer.clientHeight / z, ch + offY, minH)
      canvas.style.transform = `scale(${z})`
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      sizer.style.width = `${w * z}px`
      sizer.style.height = `${h * z}px`
      world.style.left = `${offX}px`
      world.style.top = `${offY}px`
      outer.scrollLeft = scrollX
      outer.scrollTop = scrollY
      offRef.current = { x: offX, y: offY }
      lastPaintRef.current = { offX, offY, minW, minH }
    }

    let last = 0
    const step = (t: number) => {
      const dt = last ? Math.min(64, t - last) : 16.7
      last = t
      const target = targetZoomRef.current
      const cur = zoomRef.current
      // ~22% quãng còn lại mỗi khung 60Hz, quy đổi theo thời gian thật để màn 120Hz cũng trượt cùng tốc độ
      let next = cur + (target - cur) * (1 - Math.pow(1 - 0.22, dt / 16.7))
      const done = Math.abs(target - next) < 0.0015
      if (done) next = target
      zoomRef.current = next
      paint(next)
      if (done) {
        rafRef.current = 0
        last = 0
        anchorRef.current = null
        // Chốt khoảng đệm + kích thước tối thiểu của khung hình cuối vào state cùng lúc với zoom (cùng 1 lượt
        // render) — render React ra đúng y như DOM đang hiển thị, không nhảy.
        setView(lastPaintRef.current)
        onZoomChangeRef.current(target)
      } else {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      const target = clampZoom(targetZoomRef.current * Math.exp(-e.deltaY * 0.002))
      if (target === targetZoomRef.current && !rafRef.current) return
      // Neo theo mức zoom ĐANG HIỂN THỊ — lăn tiếp giữa chừng hoạt ảnh vẫn neo đúng chỗ dưới chuột.
      const cur = zoomRef.current
      const rect = outer.getBoundingClientRect()
      const viewX = e.clientX - rect.left
      const viewY = e.clientY - rect.top
      // Toạ độ "thế giới" (đã trừ khoảng đệm) của điểm dưới chuột
      anchorRef.current = {
        canvasX: (outer.scrollLeft + viewX) / cur - offRef.current.x,
        canvasY: (outer.scrollTop + viewY) / cur - offRef.current.y,
        viewX,
        viewY,
      }
      targetZoomRef.current = target
      if (!rafRef.current) rafRef.current = requestAnimationFrame(step)
    }
    outer.addEventListener('wheel', onWheel, { passive: false })
    return () => outer.removeEventListener('wheel', onWheel)
  }, [])

  const contentHeight = notes.reduce(
    (max, n) => Math.max(max, n.y + (heights[n.id] ?? NOTE_HEIGHT_ESTIMATE) + BOARD_BOTTOM_GAP),
    0,
  )
  // A note can be dragged arbitrarily far right (handleDragPointerMove in StickyNoteCard only
  // clamps the lower bound at x >= 0, not an upper bound) — the canvas must grow wide enough to
  // reach the farthest note so it can still be panned/scrolled to, otherwise that note effectively
  // "disappears" (sits outside the scrollable area).
  const contentWidth = notes.reduce((max, n) => Math.max(max, n.x + (n.width ?? NOTE_WIDTH) + BOARD_BOTTOM_GAP), 0)
  // At any zoom level, the canvas (before scaling) must be at least large enough that after scaling
  // it still fully covers the outer container — so "click anywhere on screen" always works, with no
  // dead zone that can't be clicked — but it can still grow WIDER/TALLER based on actual content
  // (contentWidth/contentHeight) to pan/scroll to a note outside the initially visible area.
  // + khoảng đệm / kích thước tối thiểu do zoom quanh con trỏ để lại (view, xem paint()).
  const canvasWidth = Math.max(outerSize.width > 0 ? outerSize.width / zoom : 0, contentWidth + effOffX, view.minW) || undefined
  const canvasHeight = Math.max(outerSize.height > 0 ? outerSize.height / zoom : 0, contentHeight + effOffY, view.minH)
  useLayoutEffect(() => {
    contentSizeRef.current = { width: contentWidth, height: contentHeight, minX: minNoteX, minY: minNoteY }
  })

  return (
    <div ref={outerRef} className="nt-board-outer">
      {/* transform: scale() không đổi kích thước bố cục → nếu để canvas tự quyết vùng cuộn thì zoom nhỏ dư chỗ
          trống, zoom to lại cắt mất phần tràn. Khối đệm này mang đúng kích thước SAU khi zoom để thanh cuộn
          (cả ngang lẫn dọc) luôn khớp với thứ đang thấy; canvas nằm tuyệt đối bên trong và chỉ việc phóng to/thu nhỏ. */}
      <div
        ref={sizerRef}
        className="nt-board-sizer"
        style={{
          width: canvasWidth ? canvasWidth * zoom : undefined,
          height: canvasHeight ? canvasHeight * zoom : undefined,
        }}
      >
        <div
          ref={canvasRef}
          className={`nt-board-canvas${isPanning ? ' panning' : ''}`}
          style={{ width: canvasWidth, height: canvasHeight || undefined, transform: `scale(${zoom})`, transformOrigin: '0 0' }}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onContextMenu={handleCanvasContextMenu}
        >
          {notes.length === 0 && <p className="nt-board-empty">Right-click anywhere to add a note or timeline</p>}
          {/* "Thế giới" các note — dịch vào trong theo khoảng đệm effOffX/effOffY (zoom quanh con trỏ khi thu nhỏ).
              Kích thước 0 nên bấm vào chỗ trống vẫn trúng canvas (pan / chuột phải tạo note) như cũ. */}
          <div ref={worldRef} className="nt-board-world" style={{ left: effOffX, top: effOffY }}>
            {notes.map((note) => (
              <StickyNoteCard
                key={note.id}
                note={note}
                editing={editingId === note.id}
                zoom={zoom}
                onStartEdit={() => onStartEdit(note.id)}
                onStopEdit={onStopEdit}
                onHeightChange={handleHeightChange}
                minX={-effOffX}
                minY={-effOffY}
              />
            ))}

            {chooserAt && (
              <div
                className="nt-kind-chooser"
                style={{ left: chooserAt.x, top: chooserAt.y }}
                onClick={(e) => e.stopPropagation()}
              >
                <button type="button" onClick={() => handleChooseKind('note')}>
                  📝 Note
                </button>
                <button type="button" onClick={() => handleChooseKind('timeline')}>
                  🕐 Timeline
                </button>
                {/* Vocab lists aren't tied to a day, so they're only offered on the Overall board. */}
                {date === OVERALL_DATE && (
                  <button type="button" onClick={() => handleChooseKind('vocab')}>
                    📖 Vocab
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
