'use client'

import type { ChangeEvent } from 'react'

const VND_FORMATTER = new Intl.NumberFormat('vi-VN')

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
    </div>
  )
}
