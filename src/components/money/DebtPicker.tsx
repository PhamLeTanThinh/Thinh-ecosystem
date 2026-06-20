'use client'

import { useState } from 'react'
import { useMoneyStore } from '@/lib/money/store'
import type { DebtDirection } from '@/lib/money/types'
import { BottomSheet } from './BottomSheet'
import { Row } from './Row'
import { SheetHeader } from './SheetHeader'

interface DebtPickerProps {
  direction: DebtDirection
  value: string | undefined
  onChange: (debtId: string | undefined) => void
}

export function DebtPicker({ direction, value, onChange }: DebtPickerProps) {
  const [open, setOpen] = useState(false)
  const debts = useMoneyStore((s) => s.debts).filter((d) => d.direction === direction && !d.closed)
  const selected = debts.find((d) => d.id === value) ?? null

  function pick(debtId: string | undefined) {
    onChange(debtId)
    setOpen(false)
  }

  return (
    <>
      <Row
        icon={<span className="text-lg">🧾</span>}
        label="Khoản nợ liên kết"
        value={selected?.name ?? 'Không liên kết'}
        onClick={() => setOpen(true)}
      />

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <SheetHeader title="Chọn khoản nợ" onCancel={() => setOpen(false)} cancelLabel="Đóng" />
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => pick(undefined)}
            className={`flex items-center border-b border-border px-4 py-4 text-left text-sm ${!value ? 'font-semibold text-accent' : 'text-muted'}`}
          >
            Không liên kết
          </button>
          {debts.length === 0 && <p className="px-4 py-6 text-center text-sm text-muted">Chưa có khoản nợ nào.</p>}
          {debts.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => pick(d.id)}
              className={`flex items-center justify-between gap-3 border-b border-border px-4 py-4 text-left last:border-b-0 ${d.id === value ? 'bg-accent-soft' : ''}`}
            >
              <span className="text-sm font-medium">{d.name}</span>
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  )
}
