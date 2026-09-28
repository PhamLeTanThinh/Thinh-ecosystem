'use client'

import { useMemo, useState } from 'react'
import { addDays, addMonths, fromISODate, startOfMonth, startOfWeek, toISODate } from '@/lib/notes/date'
import type { StickyNote, TimeBlock } from '@/lib/notes/types'

type CalendarMode = 'month' | 'week'

interface DayTodo {
  noteId: string
  block: TimeBlock
}

interface Props {
  notes: StickyNote[] // ALL notes — the calendar gathers todos by day itself
  todayISO: string
  initialDate: string
  onSelectDay: (date: string) => void
  onSelectNote: (date: string, noteId: string) => void
  onToggleDone: (noteId: string, blockId: string) => void
}

const WEEKDAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTH_PREVIEW_LIMIT = 3

// A "todo" here = any TimeBlock from a 'timeline' note (both timed and untimed) — unlike
// TimelinePanel which only takes timed items. Timed items sort first by time, untimed items keep
// their order within the note.
function buildTodoMap(notes: StickyNote[]): Map<string, DayTodo[]> {
  const map = new Map<string, DayTodo[]>()
  for (const n of notes) {
    if (n.kind !== 'timeline' || n.timeBlocks.length === 0) continue
    if (!map.has(n.date)) map.set(n.date, [])
    const list = map.get(n.date)!
    for (const b of n.timeBlocks) list.push({ noteId: n.id, block: b })
  }
  for (const list of map.values()) {
    list.sort((a, b) => {
      const ta = a.block.startTime
      const tb = b.block.startTime
      if (ta && tb) return ta.localeCompare(tb)
      if (ta) return -1
      if (tb) return 1
      return 0
    })
  }
  return map
}

type DayStatus = 'empty' | 'done' | 'overdue' | 'today' | 'pending'

function dayStatus(dateISO: string, todayISO: string, total: number, pending: number): DayStatus {
  if (total === 0) return 'empty'
  if (pending === 0) return 'done'
  if (dateISO < todayISO) return 'overdue'
  if (dateISO === todayISO) return 'today'
  return 'pending'
}

// Month/week calendar for tracking unfinished items day by day — a past day still carrying items
// gets highlighted red. Click a day cell to open that day's board; the checkbox can also be ticked
// right on the calendar.
export function CalendarView({ notes, todayISO, initialDate, onSelectDay, onSelectNote, onToggleDone }: Props) {
  const [mode, setMode] = useState<CalendarMode>('month')
  const [anchor, setAnchor] = useState(initialDate)
  const [onlyPending, setOnlyPending] = useState(false)

  const todoMap = useMemo(() => buildTodoMap(notes), [notes])
  const anchorDate = fromISODate(anchor)
  const anchorMonth = anchorDate.getMonth()

  const days = useMemo(() => {
    const a = fromISODate(anchor)
    const start = mode === 'month' ? startOfWeek(startOfMonth(a)) : startOfWeek(a)
    const count =
      mode === 'month'
        ? // Enough weeks to cover the whole month (4–6 rows), not a fixed 6 rows that leaves an extra empty row.
          Math.ceil(((startOfMonth(a).getDay() + 6) % 7 + new Date(a.getFullYear(), a.getMonth() + 1, 0).getDate()) / 7) * 7
        : 7
    return Array.from({ length: count }, (_, i) => toISODate(addDays(start, i)))
  }, [anchor, mode])

  const summary = useMemo(() => {
    const month = fromISODate(anchor).getMonth()
    let total = 0
    let done = 0
    let overdue = 0
    let overdueDays = 0
    for (const d of days) {
      if (mode === 'month' && fromISODate(d).getMonth() !== month) continue
      const list = todoMap.get(d) ?? []
      const pending = list.filter((t) => !t.block.done).length
      total += list.length
      done += list.length - pending
      if (d < todayISO && pending > 0) {
        overdue += pending
        overdueDays++
      }
    }
    return { total, done, pending: total - done, overdue, overdueDays }
  }, [days, todoMap, todayISO, mode, anchor])

  function shift(delta: number) {
    const next = mode === 'month' ? addMonths(anchorDate, delta) : addDays(anchorDate, delta * 7)
    setAnchor(toISODate(next))
  }

  const title =
    mode === 'month'
      ? `${anchorDate.toLocaleString('en-US', { month: 'short' })} ${anchorDate.getFullYear()}`
      : (() => {
          const s = fromISODate(days[0])
          const e = fromISODate(days[6])
          return `${s.getDate()}/${s.getMonth() + 1} – ${e.getDate()}/${e.getMonth() + 1}/${e.getFullYear()}`
        })()

  const todayInView = days.includes(todayISO) && (mode === 'week' || fromISODate(todayISO).getMonth() === anchorMonth)

  return (
    <div className="nt-cal">
      <div className="nt-cal-header">
        <div className="nt-sidebar-tabs nt-cal-mode">
          <button type="button" className={mode === 'month' ? 'active' : ''} onClick={() => setMode('month')}>
            Month
          </button>
          <button type="button" className={mode === 'week' ? 'active' : ''} onClick={() => setMode('week')}>
            Week
          </button>
        </div>

        <div className="nt-day-nav">
          <button type="button" aria-label={mode === 'month' ? 'Previous month' : 'Previous week'} onClick={() => shift(-1)}>
            ‹
          </button>
          <span className="nt-cal-title">{title}</span>
          <button type="button" aria-label={mode === 'month' ? 'Next month' : 'Next week'} onClick={() => shift(1)}>
            ›
          </button>
          {!todayInView && (
            <button type="button" className="nt-day-nav-today" onClick={() => setAnchor(todayISO)}>
              Today
            </button>
          )}
        </div>

        <label className="nt-cal-filter">
          <input type="checkbox" checked={onlyPending} onChange={(e) => setOnlyPending(e.target.checked)} />
          Show only unfinished
        </label>

        <div className="nt-cal-summary">
          <span>
            <b>{summary.done}</b>/{summary.total} done
          </span>
          <span className={summary.pending > 0 ? 'pending' : ''}>
            <b>{summary.pending}</b> unfinished
          </span>
          {summary.overdue > 0 && (
            <span className="overdue">
              <b>{summary.overdue}</b> overdue ({summary.overdueDays} days)
            </span>
          )}
        </div>
      </div>

      <div className={`nt-cal-grid ${mode}`}>
        {WEEKDAY_HEADERS.map((w) => (
          <div key={w} className="nt-cal-weekday">
            {w}
          </div>
        ))}

        {days.map((d) => {
          const date = fromISODate(d)
          const all = todoMap.get(d) ?? []
          const pending = all.filter((t) => !t.block.done).length
          const status = dayStatus(d, todayISO, all.length, pending)
          const shown = onlyPending ? all.filter((t) => !t.block.done) : all
          const visible = mode === 'month' ? shown.slice(0, MONTH_PREVIEW_LIMIT) : shown
          const hidden = shown.length - visible.length
          const outside = mode === 'month' && date.getMonth() !== anchorMonth

          return (
            <div
              key={d}
              role="button"
              tabIndex={0}
              className={`nt-cal-cell status-${status}${outside ? ' outside' : ''}${d === todayISO ? ' is-today' : ''}`}
              onClick={() => onSelectDay(d)}
              onKeyDown={(e) => {
                if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  onSelectDay(d)
                }
              }}
            >
              <div className="nt-cal-cell-head">
                <span className="nt-cal-daynum">{mode === 'week' ? `${date.getDate()}/${date.getMonth() + 1}` : date.getDate()}</span>
                {all.length > 0 && (
                  <span className="nt-cal-badge" title={`${all.length - pending}/${all.length} items done`}>
                    {pending === 0 ? '✓' : `${all.length - pending}/${all.length}`}
                  </span>
                )}
              </div>

              {all.length > 0 && (
                <div className="nt-cal-progress">
                  <span style={{ width: `${((all.length - pending) / all.length) * 100}%` }} />
                </div>
              )}

              <ul className="nt-cal-todos">
                {visible.map(({ noteId, block }) => (
                  <li key={block.id} className={block.done ? 'done' : ''}>
                    <button
                      type="button"
                      className="nt-cal-check"
                      aria-label={block.done ? 'Mark as not done' : 'Mark as done'}
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleDone(noteId, block.id)
                      }}
                    >
                      {block.done && '✓'}
                    </button>
                    <button
                      type="button"
                      className="nt-cal-todo-text"
                      title={block.text}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectNote(d, noteId)
                      }}
                    >
                      {block.startTime && <span className="nt-cal-todo-time">{block.startTime}</span>}
                      {block.text || 'Empty item'}
                    </button>
                  </li>
                ))}
              </ul>
              {hidden > 0 && <span className="nt-cal-more">+{hidden} more</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
