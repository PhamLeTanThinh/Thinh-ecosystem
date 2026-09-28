'use client'

import { useEffect, useRef, useState } from 'react'
import { useNotesStore } from '@/lib/notes/store'
import { NOTE_COLORS, type NoteColor, type StickyNote } from '@/lib/notes/types'
import { NoteEditor } from './NoteEditor'
import { useNotesConfirm } from './ConfirmDialog'

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
  const addTimeBlock = useNotesStore((s) => s.addTimeBlock)
  const toggleTimeBlockDone = useNotesStore((s) => s.toggleTimeBlockDone)
  const deleteTimeBlock = useNotesStore((s) => s.deleteTimeBlock)
  const updateTimeBlockText = useNotesStore((s) => s.updateTimeBlockText)
  const confirm = useNotesConfirm()
  const [tagDraft, setTagDraft] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  // "Live" position/size while dragging/resizing — only written to the store on release, to avoid
  // spamming the server with a PUT on every pixel moved. Also kept in a ref (not just state) so the
  // latest value can be read on pointerup without hitting a stale closure or a nested setState
  // side-effect.
  const [livePos, setLivePos] = useState<{ x: number; y: number } | null>(null)
  const [liveSize, setLiveSize] = useState<{ width: number; height: number } | null>(null)
  const livePosRef = useRef<{ x: number; y: number } | null>(null)
  const liveSizeRef = useRef<{ width: number; height: number } | null>(null)
  const dragRef = useRef<{ startX: number; startY: number; noteX: number; noteY: number } | null>(null)
  const resizeRef = useRef<{ startX: number; startY: number; width: number; height: number } | null>(null)

  // The parent band needs to know the note's real height (rich text can span many lines) so it can
  // grow accordingly, avoiding a note overlapping the next week's band.
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
    // Creating a note (either kind) now always saves immediately, even with nothing typed yet — it
    // no longer auto-deletes an empty note on blur. It used to, to avoid clutter from an accidental
    // click, but ever since the kind-picker popover was added (clicking the canvas → choosing
    // "Note"/"Timeline" is what actually creates it), creating a note is already a deliberate
    // action — auto-deleting at this point is just annoying: the user creates a note/timeline, then
    // clicks elsewhere before typing anything or adding a first time entry, and loses it entirely.
    useNotesStore.getState().flushSave()
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
  // The manually-resized height (note.height) only applies WHILE editing — that's when the user
  // dragged the note bigger to fit the toolbar + content. When not editing, the toolbar disappears
  // but the outer frame would keep that same fixed height if we always applied it, leaving a gap
  // exactly the size of the now-hidden toolbar — a real bug we hit. Ignore note.height while not
  // editing so the frame shrinks to fit what's actually shown (no toolbar), with no leftover gap.
  const height = liveSize?.height ?? (editing ? note.height ?? undefined : undefined)

  // Items with no time show as a plain todo-list entry (checkbox + text only); items with a time
  // show in schedule form (vertical timeline, sorted by time) — a single 'timeline' note can mix
  // both kinds.
  // Todo items marked done get pushed to the bottom, unfinished ones float to the top (stable sort,
  // so the original order within each group is preserved).
  const todoItems = note.timeBlocks.filter((b) => !b.startTime).sort((a, b) => Number(a.done) - Number(b.done))
  const scheduledItems = note.timeBlocks.filter((b) => b.startTime).sort((a, b) => a.startTime!.localeCompare(b.startTime!))

  return (
    <div
      ref={rootRef}
      data-note-id={note.id}
      className="nt-note"
      style={{
        left: x,
        top: y,
        width,
        height,
        borderLeftColor: note.color ? COLOR_HEX[note.color] : 'transparent',
        // A note being edited must always float ABOVE every other note overlapping it — by default
        // notes stack in array/DOM order (later-created notes on top), so a focused note could
        // still be partly covered by another note created after it, even with its toolbar/chrome
        // showing — a real bug we hit. Force a much higher z-index than every other note while
        // editing so it's always fully visible.
        zIndex: editing ? 1 : undefined,
      }}
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

      {/* A short title any note can carry — the 3 auto-created notes (Daily/WORK/Personal, see
         syncDailyNote/syncWorkNote/syncPersonalNote in lib/notes/store.ts) start with one pre-filled,
         but it's just a regular editable field: rename it or add one to any note. Shown even outside
         edit mode (as plain text) so it stays readable once you click away; while editing it becomes
         an input, and it disappears entirely when empty and not editing (nothing to show). */}
      {(editing || note.header) && (
        <div className="nt-note-header">
          {editing ? (
            <input
              className="nt-note-header-input"
              value={note.header}
              onChange={(e) => updateNote(note.id, { header: e.target.value })}
              onClick={(e) => e.stopPropagation()}
              placeholder="+ header"
              aria-label="Note header"
            />
          ) : (
            note.header
          )}
        </div>
      )}

      {editing && (
        <div className="nt-note-chrome">
          <div className="nt-tb-swatches" aria-label="Note color">
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
            aria-label="Delete note"
            className="nt-note-delete"
            onClick={() => {
              confirm('Delete this note?').then((ok) => ok && deleteNote(note.id))
            }}
          >
            ×
          </button>
        </div>
      )}

      {note.kind === 'timeline' ? (
        <div className="nt-note-blocks">
          {todoItems.length > 0 && (
            <div className="nt-note-todos">
              {todoItems.map((b) => (
                <div key={b.id} className={`nt-note-todo${b.done ? ' done' : ''}`}>
                  <button
                    type="button"
                    className="nt-note-done-toggle"
                    aria-label={b.done ? 'Mark as not done' : 'Mark as done'}
                    onClick={() => toggleTimeBlockDone(note.id, b.id)}
                  >
                    {b.done && '✓'}
                  </button>
                  <TimeBlockText
                    className="nt-note-todo-text"
                    text={b.text}
                    editable={editing}
                    onSave={(text) => updateTimeBlockText(note.id, b.id, text)}
                  />
                  {editing && (
                    <button
                      type="button"
                      aria-label="Delete item"
                      className="nt-note-block-delete"
                      onClick={() => deleteTimeBlock(note.id, b.id)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {scheduledItems.length > 0 && (
            <div className="nt-note-schedule">
              <p className="nt-note-blocks-label">🕐 Schedule</p>
              {scheduledItems.map((b) => (
                <div key={b.id} className={`nt-note-block${b.done ? ' done' : ''}`}>
                  <button
                    type="button"
                    className="nt-note-done-toggle"
                    aria-label={b.done ? 'Mark as not done' : 'Mark as done'}
                    onClick={() => toggleTimeBlockDone(note.id, b.id)}
                  >
                    {b.done && '✓'}
                  </button>
                  <span className="nt-note-block-time">
                    {b.startTime}
                    {b.endTime && `–${b.endTime}`}
                  </span>
                  <TimeBlockText
                    className="nt-note-block-text"
                    text={b.text}
                    editable={editing}
                    onSave={(text) => updateTimeBlockText(note.id, b.id, text)}
                  />
                  {editing && (
                    <button
                      type="button"
                      aria-label="Delete time entry"
                      className="nt-note-block-delete"
                      onClick={() => deleteTimeBlock(note.id, b.id)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {editing && <TimeBlockAddForm noteId={note.id} onAdd={addTimeBlock} />}
        </div>
      ) : (
        <div className="nt-note-body">
          <NoteEditor content={note.content} editable={editing} onChangeHtml={(html) => updateNote(note.id, { content: html })} />
        </div>
      )}

      {(editing || note.tags.length > 0) && (
        <div className="nt-note-tags">
          {note.tags.map((t) => (
            <span key={t} className="nt-tag-chip">
              {t}
              {editing && (
                <button
                  type="button"
                  aria-label={`Remove tag ${t}`}
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
              placeholder="+ tag"
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

// Form for adding a new item to a note — the time is now OPTIONAL (left blank = adds a plain
// todo-list item, with a time = adds a schedule entry). Kept as separate local-state draft, only
// calling addTimeBlock on submit (not on every keystroke), unlike NoteEditor's content which saves
// debounced on every keystroke.
//
// The time inputs use type="text" (not type="time") — on some browsers/OSes, <input type="time">
// opens a time picker OUTSIDE the page's DOM, which blurs the input with relatedTarget=null when
// that picker appears; handleRootBlur treats relatedTarget=null as "left the note" and closes edit
// mode mid-way, wiping the draft being typed — a real bug we hit (user picks a time, then loses
// everything), not a theoretical one. type="text" avoids that out-of-DOM popup entirely, and typing
// by hand is also much faster than clicking each hour/minute field of the native input.
function TimeBlockAddForm({
  noteId,
  onAdd,
}: {
  noteId: string
  onAdd: (noteId: string, startTime: string | null, endTime: string | null, text: string) => void
}) {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [text, setText] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(noteId, start.trim() || null, end.trim() || null, text.trim())
    setStart('')
    setEnd('')
    setText('')
  }

  return (
    <form className="nt-note-block-add" onSubmit={handleSubmit}>
      <div className="nt-note-block-add-times">
        <input
          type="text"
          inputMode="numeric"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="Time (e.g. 09:00)"
          aria-label="Start time (optional — leave blank for a plain to-do item)"
        />
        <span>→</span>
        <input
          type="text"
          inputMode="numeric"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="End"
          aria-label="End time (optional)"
        />
      </div>
      <div className="nt-note-block-add-text">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="To-do..."
          aria-label="To-do item"
        />
        {/* Do NOT use `disabled` based on live state (empty text) — handleSubmit already guards for
           this, and if the button holds focus when it's disabled right after being clicked (the
           form resets to empty), the browser forces focus off the button and out of the note,
           making handleRootBlur think the user left the note and auto-closing edit mode — a real
           bug we hit, not theoretical. */}
        <button type="submit">+</button>
      </div>
    </form>
  )
}

// An existing item's text — plain read-only text outside edit mode, an inline-editable input while
// editing (click-to-rename, same pattern as DailyTodoText in DailyTodoPanel.tsx). Only commits on
// blur/Enter (not per keystroke), and stopPropagation on click keeps the click from bubbling up to
// the note root, which would otherwise treat it as "click empty note area" — harmless here since the
// note is already editing, but stopping it is what lets a click land in the input and place the
// caret instead of only ever focusing it at the start/end.
function TimeBlockText({
  className,
  text,
  editable,
  onSave,
}: {
  className: string
  text: string
  editable: boolean
  onSave: (text: string) => void
}) {
  const [value, setValue] = useState(text)

  if (!editable) return <span className={className}>{text}</span>

  function commit() {
    const next = value.trim()
    if (!next) setValue(text)
    else if (next !== text) onSave(next)
  }

  return (
    <input
      className={`${className} nt-note-block-text-input`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      aria-label="Edit item text"
    />
  )
}
