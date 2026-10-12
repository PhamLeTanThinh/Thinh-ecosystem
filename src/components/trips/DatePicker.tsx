'use client'

import { useEffect, useRef, useState } from 'react'
import { formatDate, todayISO } from '@/lib/trips/types'

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const pad = (n: number) => String(n).padStart(2, '0')
const toISO = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

interface DatePickerProps {
  label: string
  value: string | null // 'YYYY-MM-DD'
  onChange: (value: string | null) => void
  min?: string | null
  clearable?: boolean
  align?: 'left' | 'right' // mép popover bám theo — ô bên phải thì 'right' để lịch không tràn khỏi màn hình
}

// Ô chọn ngày thay cho <input type="date"> của trình duyệt: lịch tuần bắt đầu từ thứ 2, nhãn tiếng Việt, bấm tiêu đề
// tháng để nhảy nhanh theo tháng/năm.
export function DatePicker({ label, value, onChange, min, clearable = false, align = 'left' }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'days' | 'months'>('days')
  const base = value ?? (min && min > todayISO() ? min : todayISO())
  const [cursor, setCursor] = useState({
    y: Number(base.slice(0, 4)),
    m: Number(base.slice(5, 7)) - 1,
  })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function toggle() {
    if (!open) {
      // Mở lại luôn nhảy về tháng của ngày đang chọn
      setCursor({
        y: Number(base.slice(0, 4)),
        m: Number(base.slice(5, 7)) - 1,
      })
      setView('days')
    }
    setOpen(!open)
  }

  function shiftMonth(delta: number) {
    setCursor(({ y, m }) => {
      const d = new Date(y, m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }

  function pick(iso: string | null) {
    onChange(iso)
    setOpen(false)
  }

  const today = todayISO()
  const firstDow = (new Date(cursor.y, cursor.m, 1).getDay() + 6) % 7 // 0 = thứ 2
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate()
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7) cells.push(null)

  return (
    <div ref={ref} className="relative text-sm text-muted">
      {label}
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`mt-1 flex w-full items-center justify-between gap-2 rounded-xl border bg-card-soft px-3 py-2 text-left transition-colors ${
          open ? 'border-accent' : 'border-transparent'
        }`}
      >
        <span className={value ? 'font-medium text-text' : 'text-muted'}>{value ? formatDate(value) : 'Chọn ngày'}</span>
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className={`absolute top-full z-30 mt-2 w-72 rounded-2xl border border-border bg-card p-3 text-text shadow-xl ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => (view === 'days' ? shiftMonth(-1) : setCursor((c) => ({ ...c, y: c.y - 1 })))}
              aria-label="Trước"
              className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-muted hover:bg-card-soft"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setView(view === 'days' ? 'months' : 'days')}
              className="rounded-pill px-3 py-1 font-semibold hover:bg-card-soft"
            >
              {view === 'days' ? `Tháng ${cursor.m + 1}, ${cursor.y}` : cursor.y}
            </button>
            <button
              type="button"
              onClick={() => (view === 'days' ? shiftMonth(1) : setCursor((c) => ({ ...c, y: c.y + 1 })))}
              aria-label="Sau"
              className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-muted hover:bg-card-soft"
            >
              ›
            </button>
          </div>

          {view === 'days' ? (
            <div className="grid grid-cols-7 gap-y-1 text-center">
              {WEEKDAYS.map((w, i) => (
                <span key={w} className={`pb-1 text-xs font-medium ${i >= 5 ? 'text-danger/70' : 'text-muted'}`}>
                  {w}
                </span>
              ))}
              {cells.map((d, i) => {
                if (!d) return <span key={i} />
                const iso = toISO(cursor.y, cursor.m, d)
                const selected = iso === value
                const disabled = !!min && iso < min
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => pick(iso)}
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-25 ${
                      selected
                        ? 'bg-accent font-semibold text-white'
                        : iso === today
                          ? 'font-semibold text-accent ring-1 ring-accent'
                          : 'hover:bg-card-soft'
                    }`}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setCursor((c) => ({ ...c, m }))
                    setView('days')
                  }}
                  className={`rounded-xl py-2.5 text-sm ${m === cursor.m ? 'bg-accent font-semibold text-white' : 'hover:bg-card-soft'}`}
                >
                  Th {m + 1}
                </button>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-sm">
            {clearable ? (
              <button type="button" onClick={() => pick(null)} className="rounded-pill px-2 py-1 text-muted hover:bg-card-soft">
                Xoá
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              disabled={!!min && today < min}
              onClick={() => pick(today)}
              className="rounded-pill px-2 py-1 font-medium text-accent hover:bg-accent-soft disabled:opacity-30"
            >
              Hôm nay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
