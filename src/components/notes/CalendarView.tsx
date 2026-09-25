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
  notes: StickyNote[] // TOÀN BỘ note — lịch tự gom todo theo ngày
  todayISO: string
  initialDate: string
  onSelectDay: (date: string) => void
  onSelectNote: (date: string, noteId: string) => void
  onToggleDone: (noteId: string, blockId: string) => void
}

const WEEKDAY_HEADERS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const MONTH_PREVIEW_LIMIT = 3

// "Todo" ở đây = mọi TimeBlock của note kind 'timeline' (cả có giờ lẫn không giờ) — khác
// TimelinePanel chỉ lấy việc có giờ. Có giờ xếp trước theo giờ, không giờ giữ nguyên thứ tự trong note.
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

// Lịch tháng/tuần để theo dõi việc chưa xong theo từng ngày — ngày đã qua mà còn việc tồn được tô
// đỏ. Bấm vào ô ngày để mở board của ngày đó; tick checkbox ngay trên lịch cũng được.
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
        ? // Đủ số tuần để phủ hết tháng (4–6 hàng), không cố định 6 hàng gây thừa 1 hàng trống.
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
      ? `Tháng ${anchorMonth + 1}, ${anchorDate.getFullYear()}`
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
            Tháng
          </button>
          <button type="button" className={mode === 'week' ? 'active' : ''} onClick={() => setMode('week')}>
            Tuần
          </button>
        </div>

        <div className="nt-day-nav">
          <button type="button" aria-label={mode === 'month' ? 'Tháng trước' : 'Tuần trước'} onClick={() => shift(-1)}>
            ‹
          </button>
          <span className="nt-cal-title">{title}</span>
          <button type="button" aria-label={mode === 'month' ? 'Tháng sau' : 'Tuần sau'} onClick={() => shift(1)}>
            ›
          </button>
          {!todayInView && (
            <button type="button" className="nt-day-nav-today" onClick={() => setAnchor(todayISO)}>
              Hôm nay
            </button>
          )}
        </div>

        <label className="nt-cal-filter">
          <input type="checkbox" checked={onlyPending} onChange={(e) => setOnlyPending(e.target.checked)} />
          Chỉ hiện việc chưa xong
        </label>

        <div className="nt-cal-summary">
          <span>
            <b>{summary.done}</b>/{summary.total} đã xong
          </span>
          <span className={summary.pending > 0 ? 'pending' : ''}>
            <b>{summary.pending}</b> chưa xong
          </span>
          {summary.overdue > 0 && (
            <span className="overdue">
              <b>{summary.overdue}</b> quá hạn ({summary.overdueDays} ngày)
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
                  <span className="nt-cal-badge" title={`${all.length - pending}/${all.length} việc đã xong`}>
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
                      aria-label={block.done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
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
                      {block.text || 'Việc trống'}
                    </button>
                  </li>
                ))}
              </ul>
              {hidden > 0 && <span className="nt-cal-more">+{hidden} việc nữa</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
