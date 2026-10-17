'use client'

import { useEffect, useRef, useState } from 'react'
import { useNotesStore } from '@/lib/notes/store'
import { NOTE_COLORS, type NoteColor, type StickyNote } from '@/lib/notes/types'
import { NoteEditor } from './NoteEditor'
import { useNotesConfirm } from './ConfirmDialog'

const NOTE_WIDTH_DEFAULT = 260
const MIN_WIDTH = 180
const MIN_HEIGHT = 90
// Tỉ lệ mặc định cột Word / (Word + Nghĩa) — trước đây cố định 1fr : 1.3fr
const VOCAB_SPLIT_DEFAULT = 1 / 2.3
const VOCAB_SPLIT_MIN = 0.15
const VOCAB_SPLIT_MAX = 0.85
const RESIZE_EDGES: [string, -1 | 0 | 1, -1 | 0 | 1][] = [
  ['left', -1, 0],
  ['right', 1, 0],
  ['top', 0, -1],
  ['bottom', 0, 1],
]

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
  // Toạ độ nhỏ nhất được kéo tới (mép trái/trên canvas) — âm khi board có khoảng đệm do zoom (NotesBoard: effOffX/Y)
  minX?: number
  minY?: number
}

export function StickyNoteCard({ note, editing, zoom, onStartEdit, onStopEdit, onHeightChange, minX = 0, minY = 0 }: Props) {
  const updateNote = useNotesStore((s) => s.updateNote)
  const deleteNote = useNotesStore((s) => s.deleteNote)
  const addTimeBlock = useNotesStore((s) => s.addTimeBlock)
  const toggleTimeBlockDone = useNotesStore((s) => s.toggleTimeBlockDone)
  const deleteTimeBlock = useNotesStore((s) => s.deleteTimeBlock)
  const updateTimeBlockText = useNotesStore((s) => s.updateTimeBlockText)
  const addVocab = useNotesStore((s) => s.addVocab)
  const updateVocab = useNotesStore((s) => s.updateVocab)
  const deleteVocab = useNotesStore((s) => s.deleteVocab)
  const confirm = useNotesConfirm()
  const [tagDraft, setTagDraft] = useState('')
  // Vocab self-test: hide a whole column (word or meaning), then click a single masked cell to peek
  // at it. View-only state — not saved, so every visit starts with both columns showing.
  const [vocabHidden, setVocabHidden] = useState({ term: false, meaning: false })
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  function toggleVocabColumn(col: 'term' | 'meaning') {
    setVocabHidden((prev) => ({ ...prev, [col]: !prev[col] }))
    setRevealed(new Set()) // re-hiding a column masks every cell again, even ones peeked at before
  }

  function reveal(key: string) {
    setRevealed((prev) => new Set(prev).add(key))
  }
  const rootRef = useRef<HTMLDivElement>(null)

  // "Live" position/size while dragging/resizing — only written to the store on release, to avoid
  // spamming the server with a PUT on every pixel moved. Also kept in a ref (not just state) so the
  // latest value can be read on pointerup without hitting a stale closure or a nested setState
  // side-effect.
  const [livePos, setLivePos] = useState<{ x: number; y: number } | null>(null)
  const [liveSize, setLiveSize] = useState<{ width?: number; height?: number } | null>(null)
  const livePosRef = useRef<{ x: number; y: number } | null>(null)
  const liveSizeRef = useRef<{ width?: number; height?: number } | null>(null)
  const dragRef = useRef<{ startX: number; startY: number; noteX: number; noteY: number } | null>(null)
  // dirX/dirY: cạnh đang kéo — 1 = phải/dưới, -1 = trái/trên (kéo cạnh này thì note dời vị trí theo), 0 = không đổi chiều đó
  // Kéo thanh chia giữa cột Word | Nghĩa: liveSplit chỉ sống trong lúc kéo, nhả chuột mới lưu note.vocabSplit
  const [liveSplit, setLiveSplit] = useState<number | null>(null)
  const liveSplitRef = useRef<number | null>(null)
  const splitDragRef = useRef<{ left: number; total: number } | null>(null)
  const resizeRef = useRef<{
    startX: number
    startY: number
    width: number
    height: number
    noteX: number
    noteY: number
    minHeight: number
    dirX: -1 | 0 | 1
    dirY: -1 | 0 | 1
  } | null>(null)

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
    const next = { x: Math.max(minX, dragRef.current.noteX + dx), y: Math.max(minY, dragRef.current.noteY + dy) }
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

  function handleResizePointerDown(e: React.PointerEvent<HTMLDivElement>, dirX: -1 | 0 | 1, dirY: -1 | 0 | 1) {
    e.stopPropagation()
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    // Note vocab/timeline không cuộn bên trong: không cho kéo thấp hơn chiều cao nội dung (đo bằng cách tạm bỏ
    // height/minHeight). Note rich text thì nội dung cuộn trong khung nên chỉ cần MIN_HEIGHT.
    let minHeight = MIN_HEIGHT
    const el = rootRef.current
    if (el && note.kind !== 'note') {
      const { height, minHeight: prevMin } = el.style
      el.style.height = 'auto'
      el.style.minHeight = '0'
      minHeight = Math.max(MIN_HEIGHT, el.offsetHeight)
      el.style.height = height
      el.style.minHeight = prevMin
    }
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      width: rootRef.current?.offsetWidth ?? note.width ?? NOTE_WIDTH_DEFAULT,
      height: rootRef.current?.offsetHeight ?? note.height ?? MIN_HEIGHT,
      noteX: note.x,
      noteY: note.y,
      minHeight,
      dirX,
      dirY,
    }
  }

  function handleResizePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const r = resizeRef.current
    if (!r) return
    const dx = (e.clientX - r.startX) / zoom
    const dy = (e.clientY - r.startY) / zoom
    const size: { width?: number; height?: number } = {}
    let pos: { x: number; y: number } | null = null
    if (r.dirX !== 0) {
      // Kéo cạnh trái: mép phải đứng yên, mép trái chạy theo chuột (không vượt quá minX)
      const maxWidth = r.dirX < 0 ? r.noteX + r.width - minX : Infinity
      size.width = Math.min(maxWidth, Math.max(MIN_WIDTH, r.width + dx * r.dirX))
      if (r.dirX < 0) pos = { x: r.noteX + r.width - size.width, y: r.noteY }
    }
    if (r.dirY !== 0) {
      const maxHeight = r.dirY < 0 ? r.noteY + r.height - minY : Infinity
      size.height = Math.min(maxHeight, Math.max(r.minHeight, r.height + dy * r.dirY))
      if (r.dirY < 0) pos = { x: pos?.x ?? r.noteX, y: r.noteY + r.height - size.height }
    }
    liveSizeRef.current = size
    setLiveSize(size)
    livePosRef.current = pos
    setLivePos(pos)
  }

  function handleResizePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!resizeRef.current) return
    resizeRef.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
    const size = liveSizeRef.current
    const pos = livePosRef.current
    liveSizeRef.current = null
    livePosRef.current = null
    setLiveSize(null)
    setLivePos(null)
    if (size || pos) updateNote(note.id, { ...size, ...pos })
  }

  function handleSplitPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    e.preventDefault()
    const head = e.currentTarget.parentElement?.querySelector('.nt-vocab-head')
    const termCell = head?.children[1]?.getBoundingClientRect()
    const meaningCell = head?.children[2]?.getBoundingClientRect()
    if (!termCell || !meaningCell) return
    e.currentTarget.setPointerCapture(e.pointerId)
    // Đo bằng px màn hình nên đã tính sẵn zoom của board — tỉ lệ không phụ thuộc zoom
    splitDragRef.current = { left: termCell.left, total: meaningCell.right - termCell.left }
  }

  function handleSplitPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = splitDragRef.current
    if (!d || d.total <= 0) return
    const ratio = Math.min(VOCAB_SPLIT_MAX, Math.max(VOCAB_SPLIT_MIN, (e.clientX - d.left) / d.total))
    liveSplitRef.current = ratio
    setLiveSplit(ratio)
  }

  function handleSplitPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!splitDragRef.current) return
    splitDragRef.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
    const ratio = liveSplitRef.current
    liveSplitRef.current = null
    setLiveSplit(null)
    if (ratio != null) updateNote(note.id, { vocabSplit: ratio })
  }

  const vocabSplit = liveSplit ?? note.vocabSplit ?? VOCAB_SPLIT_DEFAULT

  const x = livePos?.x ?? note.x
  const y = livePos?.y ?? note.y
  const width = liveSize?.width ?? note.width ?? NOTE_WIDTH_DEFAULT
  // The manually-resized height (note.height) only applies WHILE editing — that's when the user
  // dragged the note bigger to fit the toolbar + content. When not editing, the toolbar disappears
  // but the outer frame would keep that same fixed height if we always applied it, leaving a gap
  // exactly the size of the now-hidden toolbar — a real bug we hit. Ignore note.height while not
  // editing so the frame shrinks to fit what's actually shown (no toolbar), with no leftover gap.
  const editHeight = editing ? note.height ?? undefined : undefined
  // Only rich-text notes scroll inside a fixed frame (.nt-note-body). Timeline/vocab bodies don't
  // scroll, so a fixed height made each newly added row spill out below the frame, pushing the add
  // form further down on every Enter — for those, the resized height is just a floor and the frame
  // grows with its rows.
  const growsWithContent = note.kind !== 'note'
  // Với note tự giãn, chiều cao đang kéo cũng chỉ là mức sàn (minHeight) → khung không bao giờ thấp hơn nội dung
  // (trước đây là height cố định nên kéo nhỏ được hơn nội dung, các hàng tràn ra ngoài khung).
  const height = growsWithContent ? undefined : liveSize?.height ?? editHeight
  const minHeight = growsWithContent ? liveSize?.height ?? editHeight : undefined

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
        minHeight,
        borderLeftColor: note.color ? COLOR_HEX[note.color] : 'transparent',
        // A note being edited must always float ABOVE every other note overlapping it — by default
        // notes stack in array/DOM order (later-created notes on top), so a focused note could
        // still be partly covered by another note created after it, even with its toolbar/chrome
        // showing — a real bug we hit. Force a much higher z-index than every other note while
        // editing so it's always fully visible.
        zIndex: editing ? 1 : undefined,
      }}
      onClick={() => !editing && onStartEdit()}
      // Chỉ vào chế độ sửa khi focus vào Ô GÕ CHỮ. Focus vào nút (checkbox, ô nghĩa đang che, ×, tiêu đề cột) xảy ra
      // ngay lúc nhấn chuột xuống: nếu lúc đó vào chế độ sửa, thanh màu + ô header chèn lên đầu note đẩy cả nội dung
      // xuống → nhả chuột ra thì nút đã trôi khỏi chỗ bấm, click bị mất → phải bấm lần 2. Nút giờ ăn ngay lần đầu
      // (và tự lo việc của nó); bấm vào chỗ trống trong note vẫn mở chế độ sửa qua onClick ở trên.
      onFocus={(e) => {
        if (e.target.matches('input, textarea, [contenteditable="true"]')) onStartEdit()
      }}
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

      {note.kind === 'vocab' ? (
        <div className="nt-note-blocks">
          {note.vocab.length > 0 && (
            <div
              className={`nt-vocab-list${liveSplit != null ? ' splitting' : ''}`}
              style={{ gridTemplateColumns: `auto minmax(0, ${vocabSplit}fr) minmax(0, ${1 - vocabSplit}fr) auto` }}
            >
              {/* Thanh chia giữa 2 cột (nằm ở mép trái cột Nghĩa, cao suốt danh sách) — kéo ngang để đổi bề rộng.
                 Double-click để về tỉ lệ mặc định. */}
              <div
                className="nt-vocab-splitter"
                role="separator"
                aria-orientation="vertical"
                aria-label="Kéo để đổi bề rộng cột Word / Nghĩa"
                title="Kéo để đổi bề rộng cột · double-click: mặc định"
                onPointerDown={handleSplitPointerDown}
                onPointerMove={handleSplitPointerMove}
                onPointerUp={handleSplitPointerUp}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  updateNote(note.id, { vocabSplit: null })
                }}
              />
              <div className="nt-vocab-row nt-vocab-head">
                <span />
                <VocabColumnToggle label="Word" hidden={vocabHidden.term} onToggle={() => toggleVocabColumn('term')} />
                <VocabColumnToggle label="Nghĩa" hidden={vocabHidden.meaning} onToggle={() => toggleVocabColumn('meaning')} />
                <span />
              </div>
              {note.vocab.map((v) => (
                <div key={v.id} className={`nt-vocab-row${v.done ? ' done' : ''}`}>
                  <button
                    type="button"
                    className="nt-note-done-toggle"
                    aria-label={v.done ? 'Mark as not done' : 'Mark as done'}
                    onClick={(e) => { e.stopPropagation(); updateVocab(note.id, v.id, { done: !v.done }) }}
                  >
                    {v.done && '✓'}
                  </button>
                  {vocabHidden.term && !revealed.has(`${v.id}:term`) ? (
                    <VocabMaskedCell className="nt-vocab-term" text={v.term} onReveal={() => reveal(`${v.id}:term`)} />
                  ) : (
                    <TimeBlockText
                      className="nt-vocab-term"
                      text={v.term}
                      editable={editing}
                      onSave={(term) => updateVocab(note.id, v.id, { term })}
                    />
                  )}
                  {vocabHidden.meaning && !revealed.has(`${v.id}:meaning`) ? (
                    <VocabMaskedCell className="nt-vocab-meaning" text={v.meaning} onReveal={() => reveal(`${v.id}:meaning`)} />
                  ) : (
                    <TimeBlockText
                      className="nt-vocab-meaning"
                      text={v.meaning}
                      editable={editing}
                      allowEmpty
                      onSave={(meaning) => updateVocab(note.id, v.id, { meaning })}
                    />
                  )}
                  <button
                    type="button"
                    aria-label="Delete word"
                    className="nt-note-block-delete"
                    onClick={(e) => { e.stopPropagation(); deleteVocab(note.id, v.id) }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {editing && <VocabAddForm noteId={note.id} onAdd={addVocab} />}
        </div>
      ) : note.kind === 'timeline' ? (
        <div className="nt-note-blocks">
          {todoItems.length > 0 && (
            <div className="nt-note-todos">
              {todoItems.map((b) => (
                <div key={b.id} className={`nt-note-todo${b.done ? ' done' : ''}`}>
                  <button
                    type="button"
                    className="nt-note-done-toggle"
                    aria-label={b.done ? 'Mark as not done' : 'Mark as done'}
                    onClick={(e) => { e.stopPropagation(); toggleTimeBlockDone(note.id, b.id) }}
                  >
                    {b.done && '✓'}
                  </button>
                  <TimeBlockText
                    className="nt-note-todo-text"
                    text={b.text}
                    editable={editing}
                    onSave={(text) => updateTimeBlockText(note.id, b.id, text)}
                  />
                  {/* Not gated behind `editing` like the note-level controls above — deleting one
                     item is low-stakes enough to not require opening the note first, so it's always
                     in the DOM and only revealed on hover (see .nt-note-todo:hover in notes.css).
                     stopPropagation so this click doesn't also bubble to the root and open edit mode. */}
                  <button
                    type="button"
                    aria-label="Delete item"
                    className="nt-note-block-delete"
                    onClick={(e) => { e.stopPropagation(); deleteTimeBlock(note.id, b.id) }}
                  >
                    ×
                  </button>
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
                    onClick={(e) => { e.stopPropagation(); toggleTimeBlockDone(note.id, b.id) }}
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
                  <button
                    type="button"
                    aria-label="Delete time entry"
                    className="nt-note-block-delete"
                    onClick={(e) => { e.stopPropagation(); deleteTimeBlock(note.id, b.id) }}
                  >
                    ×
                  </button>
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

      {/* Kéo viền để đổi kích thước (như cửa sổ): 4 cạnh + góc dưới-phải. Viền trái/trên dời luôn vị trí note.
         Viền trên/dưới chỉ có khi đang sửa — ngoài lúc sửa note.height không áp dụng (xem editHeight) nên kéo dọc vô nghĩa. */}
      {RESIZE_EDGES.filter(([, , dirY]) => dirY === 0 || editing).map(([cls, dirX, dirY]) => (
        <div
          key={cls}
          className={`nt-note-resize-edge ${cls}`}
          onPointerDown={(e) => handleResizePointerDown(e, dirX, dirY)}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          onClick={(e) => e.stopPropagation()}
        />
      ))}
      <div
        className="nt-note-resize-handle"
        onPointerDown={(e) => handleResizePointerDown(e, 1, 1)}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
        onClick={(e) => e.stopPropagation()}
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

// Column header of a vocab note — the label plus an eye toggle that hides/shows the whole column.
// stopPropagation so toggling doesn't also open the note's edit mode.
function VocabColumnToggle({ label, hidden, onToggle }: { label: string; hidden: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className={`nt-vocab-col-toggle${hidden ? ' hidden-col' : ''}`}
      aria-pressed={hidden}
      aria-label={hidden ? `Show ${label}` : `Hide ${label}`}
      title={hidden ? `Show ${label}` : `Hide ${label}`}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
    >
      {label}
      <span aria-hidden>{hidden ? '🙈' : '👁'}</span>
    </button>
  )
}

// A cell whose column is hidden — the text stays in place (so the row keeps its height) but is
// blurred; clicking it reveals just that one cell.
function VocabMaskedCell({ className, text, onReveal }: { className: string; text: string; onReveal: () => void }) {
  return (
    <button
      type="button"
      className={`${className} nt-vocab-masked`}
      aria-label="Click to reveal"
      title="Click to reveal"
      onClick={(e) => {
        e.stopPropagation()
        onReveal()
      }}
    >
      <span aria-hidden>{text || '—'}</span>
    </button>
  )
}

// Add-row form of a 'vocab' note: foreign term + Vietnamese meaning. Enter in the term field jumps to
// the meaning; Enter in the meaning adds the row and puts the caret back in the term field, so a
// whole list can be typed without touching the mouse. Same focus caveats as TimeBlockAddForm (no
// `disabled` on the submit button).
function VocabAddForm({
  noteId,
  onAdd,
}: {
  noteId: string
  onAdd: (noteId: string, term: string, meaning: string) => void
}) {
  const [term, setTerm] = useState('')
  const [meaning, setMeaning] = useState('')
  const termRef = useRef<HTMLInputElement>(null)
  const meaningRef = useRef<HTMLTextAreaElement>(null)

  // Ô nghĩa là textarea tự giãn theo số dòng (Shift+Enter xuống hàng)
  useEffect(() => {
    const el = meaningRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [meaning])

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!term.trim()) {
      termRef.current?.focus()
      return
    }
    onAdd(noteId, term.trim(), meaning.trim())
    setTerm('')
    setMeaning('')
    termRef.current?.focus()
  }

  return (
    <form className="nt-vocab-add" onSubmit={handleSubmit}>
      <input
        ref={termRef}
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && term.trim() && !meaning.trim()) {
            e.preventDefault()
            meaningRef.current?.focus()
          }
        }}
        placeholder="Word..."
        aria-label="Foreign word"
      />
      <textarea
        ref={meaningRef}
        rows={1}
        value={meaning}
        onChange={(e) => setMeaning(e.target.value)}
        onKeyDown={(e) => {
          // Enter = thêm từ (như submit form); Shift+Enter = xuống hàng trong nghĩa
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            handleSubmit()
          }
        }}
        placeholder="Nghĩa..."
        aria-label="Vietnamese meaning"
      />
      <button type="submit">+</button>
    </form>
  )
}

// An existing item's text — plain read-only text outside edit mode, an inline-editable field while
// editing (click-to-rename, same pattern as DailyTodoText in DailyTodoPanel.tsx). A <textarea>
// rather than an <input> on purpose: an <input> can't wrap, so a long item that wrapped across
// multiple lines as a <span> would collapse to one scrolling line the moment you clicked to edit it
// — a real "format changes under you" bug we hit. The height-matching effect below keeps it exactly
// as tall as its wrapped content (no resize handle, no scrollbar), so switching in and out of edit
// mode doesn't reflow the item at all. Only commits on blur/Enter (not per keystroke), and
// stopPropagation on click keeps the click from bubbling up to the note root, which would otherwise
// treat it as "click empty note area" — harmless here since the note is already editing, but
// stopping it is what lets a click land in the field and place the caret instead of only ever
// focusing it at the start/end.
function TimeBlockText({
  className,
  text,
  editable,
  allowEmpty = false,
  onSave,
}: {
  className: string
  text: string
  editable: boolean
  allowEmpty?: boolean // true = clearing the field saves '' instead of reverting (e.g. a vocab meaning)
  onSave: (text: string) => void
}) {
  const [value, setValue] = useState(text)
  const ref = useRef<HTMLTextAreaElement>(null)
  // Nội dung đổi từ chỗ khác (vd đổi tên mục Daily todo) → cập nhật lại ô ngay trong lúc render, không dùng effect.
  const [syncedText, setSyncedText] = useState(text)
  if (text !== syncedText) {
    setSyncedText(text)
    setValue(text)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value, editable])

  // LUÔN là <textarea> (chỉ đọc khi note chưa ở chế độ sửa) chứ không đổi qua lại với <span>: bấm 1 lần vào chữ
  // là focus đúng ô này → note vào chế độ sửa (onFocus ở thẻ gốc) → ô hết readOnly mà vẫn giữ focus + con trỏ đúng
  // chỗ vừa bấm. Trước đây bấm lần 1 chỉ để note vào chế độ sửa (span → textarea, mất chỗ bấm), lần 2 mới gõ được.
  function commit() {
    const next = value.trim()
    if (!next && !allowEmpty) setValue(text)
    else if (next !== text) onSave(next)
  }

  return (
    <textarea
      ref={ref}
      rows={1}
      className={`${className} nt-note-block-text-input`}
      readOnly={!editable}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        // Enter = lưu (blur); Shift+Enter = xuống hàng như bình thường (vd nghĩa nhiều dòng của 1 từ).
        // Bỏ qua Enter lúc bộ gõ (IME) còn đang ghép chữ.
        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
          e.preventDefault()
          e.currentTarget.blur()
        }
      }}
      aria-label="Edit item text"
    />
  )
}
