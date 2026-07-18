'use client'

import { useState } from 'react'
import { useMoneyStore } from '@/lib/money/store'
import { useMoneyUIStore } from '@/lib/money/uiStore'
import { parseISODate, toISODate } from '@/lib/money/calculations'
import type { DebtDirection } from '@/lib/money/types'
import { AmountInput } from '../AmountInput'
import { BottomSheet } from '../BottomSheet'
import { SheetHeader } from '../SheetHeader'

const DIRECTION_TABS: { direction: DebtDirection; label: string }[] = [
  { direction: 'owe', label: 'Tôi nợ' },
  { direction: 'owed', label: 'Người ta nợ tôi' },
]

const ACCENT_BY_DIRECTION: Record<DebtDirection, string> = {
  owe: '#dc2626',
  owed: '#16a34a',
}

export function AddDebtModal() {
  const open = useMoneyUIStore((s) => s.addDebtOpen)
  const resetKey = useMoneyUIStore((s) => s.addDebtKey)
  const close = useMoneyUIStore((s) => s.closeAddDebt)
  const editingDebtId = useMoneyUIStore((s) => s.editingDebtId)

  return (
    <BottomSheet open={open} onClose={close}>
      <AddDebtForm key={resetKey} onClose={close} editingDebtId={editingDebtId} />
    </BottomSheet>
  )
}

function AddDebtForm({ onClose, editingDebtId }: { onClose: () => void; editingDebtId: string | null }) {
  const debts = useMoneyStore((s) => s.debts)
  const addDebt = useMoneyStore((s) => s.addDebt)
  const updateDebt = useMoneyStore((s) => s.updateDebt)
  const deleteDebt = useMoneyStore((s) => s.deleteDebt)

  const editingDebt = editingDebtId ? debts.find((d) => d.id === editingDebtId) ?? null : null

  const [direction, setDirection] = useState<DebtDirection>(editingDebt?.direction ?? 'owe')
  const [name, setName] = useState(editingDebt?.name ?? '')
  const [principal, setPrincipal] = useState(editingDebt?.principal ?? 0)
  const [hasDueDate, setHasDueDate] = useState(Boolean(editingDebt?.dueDate))
  const [dueDate, setDueDate] = useState(() => (editingDebt?.dueDate ? parseISODate(editingDebt.dueDate) : new Date()))
  const [note, setNote] = useState(editingDebt?.note ?? '')

  function shiftDueDate(deltaDays: number) {
    setDueDate((d) => {
      const next = new Date(d)
      next.setDate(next.getDate() + deltaDays)
      return next
    })
  }

  function handleSave() {
    const trimmedName = name.trim()
    if (!trimmedName || principal <= 0) return
    const patch = {
      name: trimmedName,
      direction,
      principal,
      dueDate: hasDueDate ? toISODate(dueDate) : undefined,
      note: note.trim() || undefined,
    }
    if (editingDebt) {
      updateDebt(editingDebt.id, patch)
    } else {
      addDebt(patch)
    }
    onClose()
  }

  function handleDelete() {
    if (!editingDebt) return
    if (!window.confirm(`Xoá khoản nợ "${editingDebt.name}"? Các giao dịch đã liên kết sẽ được giữ lại nhưng bỏ liên kết.`)) return
    deleteDebt(editingDebt.id)
    onClose()
  }

  return (
    <>
      <SheetHeader title={editingDebt ? 'Sửa khoản nợ' : 'Thêm khoản nợ'} onCancel={onClose} />

      <div className="flex gap-2 p-4">
        {DIRECTION_TABS.map((tab) => (
          <button
            key={tab.direction}
            type="button"
            onClick={() => setDirection(tab.direction)}
            className={`flex-1 rounded-pill py-2 text-sm font-medium transition-colors duration-200 ${
              direction === tab.direction ? 'bg-accent text-black' : 'bg-card-soft text-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <span className="flex h-8 w-8 items-center justify-center text-lg">👤</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={direction === 'owe' ? 'Nợ ai / nơi nào?' : 'Cho ai vay?'}
          aria-label="Tên người/nơi vay"
          autoFocus
          className="flex-1 bg-transparent text-base outline-none placeholder:text-muted"
        />
      </div>

      <AmountInput value={principal} onChange={setPrincipal} accentColor={ACCENT_BY_DIRECTION[direction]} />

      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
        <div>
          <p className="text-sm font-medium">Có hạn trả</p>
          <p className="text-xs text-muted">Đặt ngày hẹn trả/thu nợ</p>
        </div>
        <button
          type="button"
          onClick={() => setHasDueDate((v) => !v)}
          aria-pressed={hasDueDate}
          aria-label="Có hạn trả"
          className={`relative h-7 w-12 shrink-0 rounded-pill transition-colors ${hasDueDate ? 'bg-accent' : 'bg-card-soft'}`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-text transition-transform ${hasDueDate ? 'translate-x-5' : 'translate-x-0.5'}`}
          />
        </button>
      </div>

      {hasDueDate && (
        <div className="flex items-center gap-3 border-b border-border px-4 py-4">
          <span className="flex h-8 w-8 items-center justify-center text-lg">📅</span>
          <button type="button" onClick={() => shiftDueDate(-1)} aria-label="Ngày trước" className="text-muted">
            ‹
          </button>
          <span className="flex-1 text-center text-sm font-medium">
            {dueDate.getDate().toString().padStart(2, '0')}/{(dueDate.getMonth() + 1).toString().padStart(2, '0')}/{dueDate.getFullYear()}
          </span>
          <button type="button" onClick={() => shiftDueDate(1)} aria-label="Ngày sau" className="text-muted">
            ›
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <span className="flex h-8 w-8 items-center justify-center text-lg">📝</span>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú"
          aria-label="Ghi chú"
          className="flex-1 bg-transparent text-base outline-none placeholder:text-muted"
        />
      </div>

      <div className="flex gap-3 px-4 py-4">
        {editingDebt && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-pill border border-danger px-5 py-3.5 text-sm font-semibold text-danger"
          >
            Xoá
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!name.trim() || principal <= 0}
          className="flex-1 rounded-pill bg-accent py-3.5 text-sm font-semibold text-black disabled:opacity-40"
        >
          {editingDebt ? 'Lưu thay đổi' : 'Lưu'}
        </button>
      </div>
    </>
  )
}
