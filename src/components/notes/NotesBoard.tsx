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
  // id of the note to scroll to as soon as the board renders (e.g. clicking a note from the "by
  // tag" list in the sidebar) — a one-shot signal, not a persistent display state.
  focusNoteId?: string | null
}

// Full-screen canvas for a single day — each day is its own "space", new notes get attached to `date`.
export function NotesBoard({ date, notes, editingId, zoom, onZoomChange, onStartEdit, onStopEdit, focusNoteId }: Props) {
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
    const canvasWidth = rect.width / zoom
    const x = Math.max(4, Math.min((e.clientX - rect.left) / zoom, canvasWidth - NOTE_WIDTH - 4))
    const y = Math.max(4, (e.clientY - rect.top) / zoom)
    setChooserAt({ x, y })
  }

  // The user finished picking a kind ("Note" or "Timeline") from the popover — this is when the
  // note actually gets created.
  function handleChooseKind(kind: 'note' | 'timeline') {
    if (!chooserAt) return
    const note = addNote(date, chooserAt.x, chooserAt.y, kind)
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

  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    if (!e.ctrlKey && !e.metaKey) return
    e.preventDefault()
    onZoomChange(clampZoom(zoom - e.deltaY * 0.001))
  }

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
        {notes.length === 0 && <p className="nt-board-empty">Right-click anywhere to add a note or timeline</p>}
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
              📝 Note
            </button>
            <button type="button" onClick={() => handleChooseKind('timeline')}>
              🕐 Timeline
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
