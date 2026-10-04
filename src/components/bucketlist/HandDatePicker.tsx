'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  value: string // 'YYYY-MM-DD'
  onChange: (value: string) => void
}

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const pad = (n: number) => String(n).padStart(2, '0')
const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`
export const todayIso = () => {
  const t = new Date()
  return toIso(t.getFullYear(), t.getMonth(), t.getDate())
}

// Chọn ngày kiểu vẽ tay cho bucket list — thay ô date mặc định của trình duyệt. Lịch mở NGAY BÊN DƯỚI (trong luồng,
// không nổi) để không bị khung cuộn của hộp thoại cắt mất. Bấm tiêu đề tháng → lưới chọn tháng/năm.
export function HandDatePicker({ value, onChange }: Props) {
  const [y0, m0] = value.split('-').map(Number)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'days' | 'months'>('days')
  const [year, setYear] = useState(y0)
  const [month, setMonth] = useState(m0 - 1) // 0..11
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  function toggle() {
    if (!open) {
      setYear(y0)
      setMonth(m0 - 1)
      setView('days')
    }
    setOpen(!open)
  }

  function shiftMonth(delta: number) {
    const d = new Date(year, month + delta, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth())
  }

  function pick(iso: string) {
    onChange(iso)
    setOpen(false)
  }

  // Lưới ngày bắt đầu từ thứ Hai; ô trống trước ngày 1
  const lead = (new Date(year, month, 1).getDay() + 6) % 7
  const days = new Date(year, month + 1, 0).getDate()
  const today = todayIso()

  return (
    <div
      ref={rootRef}
      className="bl-date"
      onKeyDown={(e) => {
        // Esc đóng lịch trước, không đóng luôn cả hộp thoại
        if (e.key === 'Escape' && open) {
          e.stopPropagation()
          setOpen(false)
        }
      }}
    >
      <button type="button" className="bl-date-btn" aria-expanded={open} onClick={toggle}>
        <span>{value.split('-').reverse().join(' / ')}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
      </button>

      {open && (
        <div className="bl-cal" role="dialog" aria-label="Chọn ngày">
          <div className="bl-cal-head">
            <button
              type="button"
              className="bl-cal-arrow"
              aria-label={view === 'days' ? 'Tháng trước' : 'Năm trước'}
              onClick={() => (view === 'days' ? shiftMonth(-1) : setYear(year - 1))}
            >
              ‹
            </button>
            <button type="button" className="bl-cal-title" onClick={() => setView(view === 'days' ? 'months' : 'days')}>
              {view === 'days' ? `Tháng ${month + 1}, ${year}` : year}
            </button>
            <button
              type="button"
              className="bl-cal-arrow"
              aria-label={view === 'days' ? 'Tháng sau' : 'Năm sau'}
              onClick={() => (view === 'days' ? shiftMonth(1) : setYear(year + 1))}
            >
              ›
            </button>
          </div>

          {view === 'days' ? (
            <div className="bl-cal-grid">
              {WEEKDAYS.map((w) => (
                <span key={w} className="bl-cal-wd">
                  {w}
                </span>
              ))}
              {Array.from({ length: lead }, (_, i) => (
                <span key={'e' + i} />
              ))}
              {Array.from({ length: days }, (_, i) => {
                const iso = toIso(year, month, i + 1)
                return (
                  <button
                    key={iso}
                    type="button"
                    className={`bl-cal-day${iso === value ? ' is-picked' : ''}${iso === today ? ' is-today' : ''}`}
                    aria-pressed={iso === value}
                    onClick={() => pick(iso)}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="bl-cal-months">
              {Array.from({ length: 12 }, (_, m) => (
                <button
                  key={m}
                  type="button"
                  className={`bl-cal-month${m === month ? ' is-picked' : ''}`}
                  onClick={() => {
                    setMonth(m)
                    setView('days')
                  }}
                >
                  Th {m + 1}
                </button>
              ))}
            </div>
          )}

          <div className="bl-cal-foot">
            <button type="button" className="bl-cal-today" onClick={() => pick(today)}>
              Hôm nay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
