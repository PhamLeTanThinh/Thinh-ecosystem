'use client'

import { useState } from 'react'
import { useMoneyStore } from '@/lib/money/store'
import type { TransactionType } from '@/lib/money/types'
import { BottomSheet } from './BottomSheet'
import { Row } from './Row'
import { SheetHeader } from './SheetHeader'

interface CategoryPickerProps {
  type: TransactionType
  value: string | null
  onChange: (categoryId: string) => void
}

export function CategoryPicker({ type, value, onChange }: CategoryPickerProps) {
  const [open, setOpen] = useState(false)
  const allCategories = useMoneyStore((s) => s.categories)
  const categories = allCategories.filter((c) => c.type === type)
  const selected = categories.find((c) => c.id === value) ?? null

  return (
    <>
      <Row
        icon={
          selected ? (
            <span className="text-lg">{selected.icon}</span>
          ) : (
            <span className="h-8 w-8 rounded-full bg-card-soft" />
          )
        }
        label="Chọn nhóm"
        value={selected?.name}
        onClick={() => setOpen(true)}
      />

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <SheetHeader title="Chọn nhóm" onCancel={() => setOpen(false)} cancelLabel="Đóng" />
        <div className="grid grid-cols-4 gap-3 p-4">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                onChange(c.id)
                setOpen(false)
              }}
              className={`flex flex-col items-center gap-1.5 rounded-card p-3 transition duration-150 active:scale-95 ${c.id === value ? 'bg-accent-soft' : 'bg-card-soft'}`}
            >
              <span className="text-2xl">{c.icon}</span>
              <span className="text-center text-[11px] leading-tight">{c.name}</span>
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  )
}
