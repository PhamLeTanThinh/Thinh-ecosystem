'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useNotesStore } from '@/lib/notes/store'
import { NotesBoard, ZOOM_STEP, clampZoom } from '@/components/notes/NotesBoard'
import { NotesSidebar } from '@/components/notes/NotesSidebar'
import { buildDateTree } from '@/lib/notes/dateTree'
import { addDays, formatDayLabel, fromISODate, toISODate } from '@/lib/notes/date'

export default function NotesPage() {
  const notes = useNotesStore((s) => s.notes)
  const deleteNotes = useNotesStore((s) => s.deleteNotes)
  const todayISO = useMemo(() => toISODate(new Date()), [])
  const [currentDate, setCurrentDate] = useState(todayISO)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [focusNoteId, setFocusNoteId] = useState<string | null>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)

  const notesForDay = useMemo(() => notes.filter((n) => n.date === currentDate), [notes, currentDate])

  // Mỗi lần có note mới được thêm vào ngày đang xem, tự mở panel danh sách bên phải.
  const prevCountRef = useRef(notesForDay.length)
  useEffect(() => {
    if (notesForDay.length > prevCountRef.current) setSidebarOpen(true)
    prevCountRef.current = notesForDay.length
  }, [notesForDay.length])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    notesForDay.forEach((n) => n.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [notesForDay])

  // Tag hết tồn tại ở ngày đang xem (vì đổi ngày) thì coi như chưa chọn — tránh lọc ra danh sách
  // rỗng vô lý. Suy ra trực tiếp lúc render thay vì đồng bộ ngược lại activeTag qua effect.
  const effectiveActiveTag = activeTag && allTags.includes(activeTag) ? activeTag : null

  const boardNotes = useMemo(
    () => (effectiveActiveTag ? notesForDay.filter((n) => n.tags.includes(effectiveActiveTag)) : notesForDay),
    [notesForDay, effectiveActiveTag],
  )

  const dateTree = useMemo(() => buildDateTree(notes, todayISO), [notes, todayISO])

  function goToDay(date: string) {
    setCurrentDate(date)
    setEditingId(null)
  }

  // Chọn 1 note cụ thể từ danh sách "theo nhãn" — khác goToDay (chỉ đổi ngày): còn phải bỏ filter
  // tag của NGÀY đó (effectiveActiveTag) để note chắc chắn hiện ra trên board, và báo cho
  // NotesBoard cuộn tới đúng vị trí note (toạ độ tự do, có thể đang ngoài vùng nhìn thấy).
  function handleSelectNote(date: string, noteId: string) {
    setCurrentDate(date)
    setActiveTag(null)
    setEditingId(noteId)
    setFocusNoteId(noteId)
    setTimeout(() => setFocusNoteId(null), 1000)
  }

  // Nếu ngày đang xem nằm trong nhóm vừa xoá, board tự trống theo (notesForDay lọc lại theo notes mới).
  function handleDeleteGroup(noteIds: string[], label: string) {
    if (noteIds.length === 0) return
    if (!window.confirm(`Xoá toàn bộ ${noteIds.length} ghi chú trong "${label}"?`)) return
    deleteNotes(noteIds)
  }

  return (
    <div className="nt-page">
      <header className="nt-topbar">
        <h1 className="nt-wordmark">Ghi chú</h1>

        <div className="nt-day-nav">
          <button type="button" aria-label="Ngày trước" onClick={() => goToDay(toISODate(addDays(fromISODate(currentDate), -1)))}>
            ‹
          </button>
          <button
            type="button"
            className="nt-day-nav-label"
            onClick={() => {
              try {
                dateInputRef.current?.showPicker?.()
              } catch {
                dateInputRef.current?.click()
              }
            }}
          >
            {formatDayLabel(fromISODate(currentDate))}
          </button>
          <button type="button" aria-label="Ngày sau" onClick={() => goToDay(toISODate(addDays(fromISODate(currentDate), 1)))}>
            ›
          </button>
          {currentDate !== todayISO && (
            <button type="button" className="nt-day-nav-today" onClick={() => goToDay(todayISO)}>
              Hôm nay
            </button>
          )}
          <input
            ref={dateInputRef}
            type="date"
            value={currentDate}
            onChange={(e) => e.target.value && goToDay(e.target.value)}
            className="nt-day-nav-input"
            tabIndex={-1}
            aria-hidden
          />
        </div>

        {allTags.length > 0 && (
          <div className="nt-tag-filter">
            <button type="button" className={effectiveActiveTag === null ? 'active' : ''} onClick={() => setActiveTag(null)}>
              Tất cả
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                className={effectiveActiveTag === t ? 'active' : ''}
                onClick={() => setActiveTag(effectiveActiveTag === t ? null : t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="nt-zoom-controls">
          <button type="button" aria-label="Thu nhỏ" onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}>
            −
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Phóng to" onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}>
            +
          </button>
          {zoom !== 1 && (
            <button type="button" aria-label="Về 100%" onClick={() => setZoom(1)}>
              ⟲
            </button>
          )}
        </div>

        {!sidebarOpen && (
          <button type="button" className="nt-sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            Danh sách
          </button>
        )}
      </header>

      <div className="nt-body">
        <NotesBoard
          date={currentDate}
          notes={boardNotes}
          editingId={editingId}
          zoom={zoom}
          onZoomChange={setZoom}
          onStartEdit={setEditingId}
          onStopEdit={() => setEditingId(null)}
          focusNoteId={focusNoteId}
        />

        {sidebarOpen && (
          <NotesSidebar
            tree={dateTree}
            notes={notes}
            currentDate={currentDate}
            onSelectDay={goToDay}
            onSelectNote={handleSelectNote}
            onDeleteGroup={handleDeleteGroup}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
