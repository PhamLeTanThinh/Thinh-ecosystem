'use client'

import type { ChangeEvent } from 'react'

const VND_FORMATTER = new Intl.NumberFormat('vi-VN')

// Nút thêm nhanh số 0 vào cuối số đang nhập, thay vì phải bấm tay từng số 0.
const QUICK_ZEROS = [
  { label: '000', multiplier: 1000 },
  { label: '00', multiplier: 100 },
  { label: '0', multiplier: 10 },
]

interface AmountInputProps {
  value: number
  onChange: (value: number) => void
  accentColor?: string
  autoFocus?: boolean
}

export function AmountInput({ value, onChange, accentColor = '#18181b', autoFocus }: AmountInputProps) {
  const display = value > 0 ? VND_FORMATTER.format(value) : ''

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '')
    onChange(digits ? Number(digits) : 0)
  }

  return (
    <div className="border-b border-border px-4 py-5">
      <p className="text-sm text-muted">Số tiền</p>
      <div className="mt-2 flex items-center gap-3">
        <span className="rounded-pill bg-card-soft px-3 py-1 text-xs font-semibold text-muted">VND</span>
        <input
          inputMode="numeric"
          autoFocus={autoFocus}
          value={display}
          onChange={handleChange}
          placeholder="0"
          aria-label="Số tiền"
          className="flex-1 bg-transparent text-4xl font-bold outline-none placeholder:text-muted"
          style={{ color: accentColor }}
        />
      </div>

      <div className="mt-3 flex gap-2">
        {QUICK_ZEROS.map(({ label, multiplier }) => (
          <button
            key={label}
            type="button"
            disabled={value <= 0}
            onClick={() => onChange(value * multiplier)}
            aria-label={`Thêm ${label}`}
            className="flex-1 rounded-pill bg-card-soft py-2 text-sm font-semibold text-muted disabled:opacity-40"
          >
            +{label}
          </button>
        ))}
      </div>
    </div>
  )
}
