'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useNotesStore } from '@/lib/notes/store'
import { NotesBoard, ZOOM_STEP, clampZoom } from '@/components/notes/NotesBoard'
import { NotesSidebar } from '@/components/notes/NotesSidebar'
import { TimelinePanel } from '@/components/notes/TimelinePanel'
import { CalendarView } from '@/components/notes/CalendarView'
import { DailyTodoPanel } from '@/components/notes/DailyTodoPanel'
import { useNotesConfirm } from '@/components/notes/ConfirmDialog'
import { buildDateTree } from '@/lib/notes/dateTree'
import { addDays, formatDayLabel, formatDayShortLabel, fromISODate, toISODate } from '@/lib/notes/date'

export default function NotesPage() {
  const notes = useNotesStore((s) => s.notes)
  const deleteNotes = useNotesStore((s) => s.deleteNotes)
  const toggleTimeBlockDone = useNotesStore((s) => s.toggleTimeBlockDone)
  const deleteTimeBlock = useNotesStore((s) => s.deleteTimeBlock)
  const hydrated = useNotesStore((s) => s.hydrated)
  const syncDailyNote = useNotesStore((s) => s.syncDailyNote)
  const syncWorkNote = useNotesStore((s) => s.syncWorkNote)
  const syncPersonalNote = useNotesStore((s) => s.syncPersonalNote)
  const confirm = useNotesConfirm()
  const todayISO = useMemo(() => toISODate(new Date()), [])
  const [currentDate, setCurrentDate] = useState(todayISO)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [dailyOpen, setDailyOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [focusNoteId, setFocusNoteId] = useState<string | null>(null)
  // 'calendar' = month/week calendar for tracking unfinished items across multiple days (see CalendarView.tsx).
  const [view, setView] = useState<'board' | 'calendar'>('board')
  const dateInputRef = useRef<HTMLInputElement>(null)

  // Opening the app on today's date ensures 3 auto-created notes exist: Daily (from the Daily todo
  // templates), an empty WORK todo on weekdays only, and an empty Personal note every day. Only does
  // this for TODAY — doesn't retroactively generate one for a past day or preemptively for a future
  // day while browsing.
  useEffect(() => {
    if (!hydrated || currentDate !== todayISO) return
    syncDailyNote(todayISO)
    syncWorkNote(todayISO)
    syncPersonalNote(todayISO)
  }, [hydrated, currentDate, todayISO, syncDailyNote, syncWorkNote, syncPersonalNote])

  const notesForDay = useMemo(() => notes.filter((n) => n.date === currentDate), [notes, currentDate])

  // Whenever a new note is added to the day being viewed (from the kind-picker popover on the
  // canvas — see NotesBoard.tsx), auto-open the list panel on the right.
  const prevCountRef = useRef(notesForDay.length)
  useEffect(() => {
    if (notesForDay.length > prevCountRef.current) {
      setSidebarOpen(true)
      setTimelineOpen(false)
      setDailyOpen(false)
    }
    prevCountRef.current = notesForDay.length
  }, [notesForDay.length])

  // Clicking an entry in the Timeline opens the note containing that time entry on the board (same
  // day as the one being viewed, so no need to change currentDate like handleSelectNote does for
  // "by tag" — just focus + scroll to it). Still needs to clear the active tag filter like
  // handleSelectNote, otherwise the note could get filtered out of boardNotes if it doesn't carry
  // the active tag, and the focus/scroll would find nothing.
  function handleSelectTimelineNote(noteId: string) {
    setActiveTag(null)
    setEditingId(noteId)
    setFocusNoteId(noteId)
    setTimeout(() => setFocusNoteId(null), 1000)
  }

  const allTags = useMemo(() => {
    const set = new Set<string>()
    notesForDay.forEach((n) => n.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [notesForDay])

  // A tag that no longer exists on the day being viewed (because the day changed) is treated as
  // unselected — avoids filtering to a nonsensically empty list. Derived directly during render
  // rather than syncing activeTag back via an effect.
  const effectiveActiveTag = activeTag && allTags.includes(activeTag) ? activeTag : null

  const boardNotes = useMemo(
    () => (effectiveActiveTag ? notesForDay.filter((n) => n.tags.includes(effectiveActiveTag)) : notesForDay),
    [notesForDay, effectiveActiveTag],
  )

  const dateTree = useMemo(() => buildDateTree(notes, todayISO), [notes, todayISO])

  function goToDay(date: string) {
    setView('board')
    setCurrentDate(date)
    setEditingId(null)
  }

  // Select a specific note from the "by tag" list — unlike goToDay (just changes the day): also has
  // to clear THAT day's tag filter (effectiveActiveTag) so the note is guaranteed to show on the
  // board, and tells NotesBoard to scroll to the note's position (free-form coordinates, which may
  // be outside the visible area).
  function handleSelectNote(date: string, noteId: string) {
    setView('board')
    setCurrentDate(date)
    setActiveTag(null)
    setEditingId(noteId)
    setFocusNoteId(noteId)
    setTimeout(() => setFocusNoteId(null), 1000)
  }

  // If the day being viewed is part of the group just deleted, the board empties out on its own (notesForDay re-filters against the updated notes).
  async function handleDeleteGroup(noteIds: string[], label: string) {
    if (noteIds.length === 0) return
    if (!(await confirm(`Delete all ${noteIds.length} notes in "${label}"?`))) return
    deleteNotes(noteIds)
  }

  return (
    <div className="nt-page">
      <header className="nt-topbar">
        <h1 className="nt-wordmark">Notes</h1>

        <div className="nt-sidebar-tabs nt-view-switch">
          <button type="button" className={view === 'board' ? 'active' : ''} onClick={() => setView('board')}>
            Board
          </button>
          <button type="button" className={view === 'calendar' ? 'active' : ''} onClick={() => setView('calendar')}>
            Calendar
          </button>
        </div>

        <div className="nt-day-nav" hidden={view !== 'board'}>
          <button type="button" aria-label="Previous day" onClick={() => goToDay(toISODate(addDays(fromISODate(currentDate), -1)))}>
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
          <button type="button" aria-label="Next day" onClick={() => goToDay(toISODate(addDays(fromISODate(currentDate), 1)))}>
            ›
          </button>
          {currentDate !== todayISO && (
            <button type="button" className="nt-day-nav-today" onClick={() => goToDay(todayISO)}>
              Today
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

        {view === 'board' && allTags.length > 0 && (
          <div className="nt-tag-filter">
            <button type="button" className={effectiveActiveTag === null ? 'active' : ''} onClick={() => setActiveTag(null)}>
              All
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

        <div className="nt-zoom-controls" hidden={view !== 'board'}>
          <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}>
            −
          </button>
          <span>{Math.round(zoom * 100)}%</span>
          <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}>
            +
          </button>
          {zoom !== 1 && (
            <button type="button" aria-label="Reset to 100%" onClick={() => setZoom(1)}>
              ⟲
            </button>
          )}
        </div>

        {view === 'board' && !timelineOpen && (
          <button
            type="button"
            className="nt-sidebar-toggle"
            onClick={() => {
              setTimelineOpen(true)
              setSidebarOpen(false)
              setDailyOpen(false)
            }}
          >
            Timeline
          </button>
        )}

        {view === 'board' && !dailyOpen && (
          <button
            type="button"
            className="nt-sidebar-toggle"
            onClick={() => {
              setDailyOpen(true)
              setSidebarOpen(false)
              setTimelineOpen(false)
            }}
          >
            Daily todo
          </button>
        )}

        {view === 'board' && !sidebarOpen && (
          <button
            type="button"
            className="nt-sidebar-toggle"
            onClick={() => {
              setSidebarOpen(true)
              setTimelineOpen(false)
              setDailyOpen(false)
            }}
          >
            List
          </button>
        )}
      </header>

      {view === 'calendar' ? (
        <CalendarView
          notes={notes}
          todayISO={todayISO}
          initialDate={currentDate}
          onSelectDay={goToDay}
          onSelectNote={handleSelectNote}
          onToggleDone={toggleTimeBlockDone}
        />
      ) : (
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

          {dailyOpen && <DailyTodoPanel onClose={() => setDailyOpen(false)} />}

          {timelineOpen && (
            <TimelinePanel
              dayLabel={formatDayShortLabel(fromISODate(currentDate))}
              notes={notesForDay}
              onToggleDone={toggleTimeBlockDone}
              onDeleteBlock={deleteTimeBlock}
              onSelectNote={handleSelectTimelineNote}
              onClose={() => setTimelineOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}
