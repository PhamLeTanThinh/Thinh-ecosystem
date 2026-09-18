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
    // Tạo note (ở cả 2 kind) giờ luôn lưu ngay, kể cả khi chưa nhập gì — không tự xoá note rỗng lúc
    // blur nữa. Trước đây tự xoá để tránh rác note trống do lỡ tay click, nhưng từ khi thêm popover
    // chọn loại (bấm canvas → chọn "Ghi chú"/"Lịch trình" mới thật sự tạo), việc tạo note đã là 1
    // hành động chủ ý — tự xoá lúc này chỉ gây khó chịu: user tạo note/lịch trình rồi bấm sang chỗ
    // khác trước khi kịp gõ chữ/thêm mốc giờ đầu tiên thì mất trắng.
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
  // Chiều cao tự kéo (note.height) chỉ áp dụng lúc ĐANG edit — đó là lúc user kéo to note ra để
  // vừa đủ chỗ cho toolbar + nội dung. Lúc không edit, toolbar biến mất nhưng khung ngoài vẫn giữ
  // nguyên chiều cao cố định đó nếu áp dụng luôn, để lại 1 khoảng trống thừa đúng bằng chiều cao
  // toolbar vừa ẩn — bug thật đã gặp. Bỏ qua note.height khi không edit để khung tự co theo đúng
  // nội dung thật sự đang hiển thị (không toolbar), không còn khoảng trống thừa.
  const height = liveSize?.height ?? (editing ? note.height ?? undefined : undefined)

  // Việc không gắn giờ hiện như todo-list thường (chỉ checkbox + text); việc có giờ hiện theo dạng
  // lịch trình (dòng thời gian dọc, sort theo giờ) — 1 note kind 'timeline' có thể trộn cả 2 loại.
  const todoItems = note.timeBlocks.filter((b) => !b.startTime)
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
        // Note đang edit phải luôn nổi lên TRÊN mọi note khác đè lên nó — mặc định các note xếp
        // chồng theo thứ tự trong mảng/DOM (note tạo sau nằm trên), nên note đang focus có thể vẫn
        // bị 1 note khác (tạo sau nó) che một phần dù toolbar/chrome của nó đã hiện ra — bug thật
        // đã gặp. Ép z-index cao hơn hẳn mọi note khác trong lúc editing để luôn thấy trọn vẹn.
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

      {note.kind === 'timeline' ? (
        <div className="nt-note-blocks">
          {todoItems.length > 0 && (
            <div className="nt-note-todos">
              {todoItems.map((b) => (
                <div key={b.id} className={`nt-note-todo${b.done ? ' done' : ''}`}>
                  <button
                    type="button"
                    className="nt-note-done-toggle"
                    aria-label={b.done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
                    onClick={() => toggleTimeBlockDone(note.id, b.id)}
                  >
                    {b.done && '✓'}
                  </button>
                  <span className="nt-note-todo-text">{b.text}</span>
                  {editing && (
                    <button
                      type="button"
                      aria-label="Xoá việc"
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
              <p className="nt-note-blocks-label">🕐 Lịch trình</p>
              {scheduledItems.map((b) => (
                <div key={b.id} className={`nt-note-block${b.done ? ' done' : ''}`}>
                  <button
                    type="button"
                    className="nt-note-done-toggle"
                    aria-label={b.done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
                    onClick={() => toggleTimeBlockDone(note.id, b.id)}
                  >
                    {b.done && '✓'}
                  </button>
                  <span className="nt-note-block-time">
                    {b.startTime}
                    {b.endTime && `–${b.endTime}`}
                  </span>
                  <span className="nt-note-block-text">{b.text}</span>
                  {editing && (
                    <button
                      type="button"
                      aria-label="Xoá mốc giờ"
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

// Form thêm 1 việc mới vào note — giờ KHÔNG bắt buộc (để trống = thêm như todo-list thường, có giờ
// = thêm vào lịch trình). Giữ draft bằng local state riêng, chỉ gọi addTimeBlock lúc submit (không
// phải mỗi phím gõ), khác NoteEditor's content vốn lưu debounce theo từng phím gõ.
//
// Input giờ dùng type="text" (không phải type="time") — <input type="time"> ở 1 số trình duyệt/hệ
// điều hành mở popup chọn giờ RIÊNG NGOÀI DOM của trang, khiến input bị blur với relatedTarget=null
// khi popup đó hiện lên; handleRootBlur coi relatedTarget=null là "rời khỏi note" nên tự đóng edit
// mode giữa chừng, xoá sạch draft đang nhập — bug thật đã gặp (user chọn giờ xong mất hết dữ liệu),
// không phải lý thuyết. type="text" tránh hẳn popup ngoài DOM đó, đồng thời gõ tay cũng nhanh hơn
// nhiều so với phải click đúng từng ô giờ/phút của input native.
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
          placeholder="Giờ (vd 09:00)"
          aria-label="Giờ bắt đầu (tuỳ chọn — để trống nếu chỉ là việc cần làm)"
        />
        <span>→</span>
        <input
          type="text"
          inputMode="numeric"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="Kết thúc"
          aria-label="Giờ kết thúc (tuỳ chọn)"
        />
      </div>
      <div className="nt-note-block-add-text">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Việc cần làm..."
          aria-label="Việc cần làm"
        />
        {/* KHÔNG dùng `disabled` dựa theo state sống (text rỗng) — handleSubmit đã tự guard rồi, và
           nếu nút đang giữ focus lúc bị disable ngay sau khi bấm (form tự reset về rỗng), trình
           duyệt ép blur focus ra khỏi nút tới ngoài note, khiến handleRootBlur tưởng nhầm user đã
           rời khỏi note và tự đóng chế độ edit — bug thật đã gặp, không phải lý thuyết. */}
        <button type="submit">+</button>
      </div>
    </form>
  )
}
