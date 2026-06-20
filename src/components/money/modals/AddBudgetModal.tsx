'use client'

import { useState } from 'react'
import { useMoneyStore } from '@/lib/money/store'
import { useMoneyUIStore } from '@/lib/money/uiStore'
import { formatPeriodRangeLabel, getMonthPeriod, parseISODate, toISODate } from '@/lib/money/calculations'
import type { TransactionType } from '@/lib/money/types'
import { AmountInput } from '../AmountInput'
import { BottomSheet } from '../BottomSheet'
import { CategoryPicker } from '../CategoryPicker'
import { Row } from '../Row'
import { SheetHeader } from '../SheetHeader'

// Số chu kỳ (tháng) lệch giữa kỳ của budget đang sửa và kỳ hiện tại (monthOffset = 0).
function monthOffsetForPeriodStart(periodStart: string, cycleStartDay: number): number {
  const todayPeriod = getMonthPeriod(0, undefined, cycleStartDay)
  const start = parseISODate(periodStart)
  const todayIndex = todayPeriod.start.getFullYear() * 12 + todayPeriod.start.getMonth()
  const startIndex = start.getFullYear() * 12 + start.getMonth()
  return startIndex - todayIndex
}

const BUDGET_TYPE_TABS: { type: TransactionType; label: string }[] = [
  { type: 'expense', label: 'Chi tiêu' },
  { type: 'debt', label: 'Trả nợ' },
]

const ACCENT_BY_TYPE: Record<TransactionType, string> = {
  expense: '#16a34a',
  income: '#16a34a',
  debt: '#d97706',
}

export function AddBudgetModal() {
  const open = useMoneyUIStore((s) => s.addBudgetOpen)
  const resetKey = useMoneyUIStore((s) => s.addBudgetKey)
  const close = useMoneyUIStore((s) => s.closeAddBudget)
  const editingBudgetId = useMoneyUIStore((s) => s.editingBudgetId)

  return (
    <BottomSheet open={open} onClose={close}>
      <AddBudgetForm key={resetKey} onClose={close} editingBudgetId={editingBudgetId} />
    </BottomSheet>
  )
}

function AddBudgetForm({ onClose, editingBudgetId }: { onClose: () => void; editingBudgetId: string | null }) {
  const openWalletPicker = useMoneyUIStore((s) => s.openWalletPicker)

  const wallets = useMoneyStore((s) => s.wallets)
  const currentWalletId = useMoneyStore((s) => s.currentWalletId)
  const categories = useMoneyStore((s) => s.categories)
  const budgets = useMoneyStore((s) => s.budgets)
  const addBudget = useMoneyStore((s) => s.addBudget)
  const updateBudget = useMoneyStore((s) => s.updateBudget)
  const cycleStartDay = useMoneyStore((s) => s.settings.cycleStartDay)

  const editingBudget = editingBudgetId ? budgets.find((b) => b.id === editingBudgetId) ?? null : null
  const editingCategory = editingBudget ? categories.find((c) => c.id === editingBudget.categoryId) : undefined

  const [budgetType, setBudgetType] = useState<TransactionType>(editingCategory?.type === 'debt' ? 'debt' : 'expense')
  const [categoryId, setCategoryId] = useState<string | null>(
    () => editingBudget?.categoryId ?? categories.find((c) => c.type === 'expense')?.id ?? null,
  )
  const [amount, setAmount] = useState(editingBudget?.amount ?? 0)
  const [monthOffset, setMonthOffset] = useState(() =>
    editingBudget ? monthOffsetForPeriodStart(editingBudget.periodStart, cycleStartDay) : 0,
  )
  const [repeatMonthly, setRepeatMonthly] = useState(editingBudget?.repeatMonthly ?? false)

  const wallet = wallets.find((w) => w.id === (editingBudget?.walletId ?? currentWalletId)) ?? wallets[0]
  const period = getMonthPeriod(monthOffset, undefined, cycleStartDay)

  function handleBudgetTypeChange(nextType: TransactionType) {
    setBudgetType(nextType)
    setCategoryId((current) => {
      const stillValid = categories.find((c) => c.id === current)?.type === nextType
      return stillValid ? current : categories.find((c) => c.type === nextType)?.id ?? null
    })
  }

  function handleSave() {
    if (amount <= 0 || !categoryId || !wallet) return
    const patch = {
      walletId: wallet.id,
      categoryId,
      amount,
      periodStart: toISODate(period.start),
      periodEnd: toISODate(period.end),
      repeatMonthly,
    }
    if (editingBudget) {
      updateBudget(editingBudget.id, patch)
    } else {
      addBudget(patch)
    }
    onClose()
  }

  const periodLabel = monthOffset === 0 ? 'Tháng này' : monthOffset > 0 ? 'Tháng sau' : 'Tháng trước'

  return (
    <>
      <SheetHeader title={editingBudget ? 'Sửa ngân sách' : 'Thêm ngân sách'} onCancel={onClose} />

      <div className="flex gap-2 p-4">
        {BUDGET_TYPE_TABS.map((tab) => (
          <button
            key={tab.type}
            type="button"
            onClick={() => handleBudgetTypeChange(tab.type)}
            className={`flex-1 rounded-pill py-2 text-sm font-medium transition-colors duration-200 ${
              budgetType === tab.type ? 'bg-accent text-black' : 'bg-card-soft text-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <CategoryPicker type={budgetType} value={categoryId} onChange={setCategoryId} />

      <AmountInput value={amount} onChange={setAmount} accentColor={ACCENT_BY_TYPE[budgetType]} />

      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <span className="flex h-8 w-8 items-center justify-center text-lg">📅</span>
        <button type="button" onClick={() => setMonthOffset((o) => o - 1)} aria-label="Kỳ trước" className="text-muted">
          ‹
        </button>
        <span className="flex-1 text-center text-sm font-medium">
          {periodLabel} ({formatPeriodRangeLabel(period)})
        </span>
        <button type="button" onClick={() => setMonthOffset((o) => o + 1)} aria-label="Kỳ sau" className="text-muted">
          ›
        </button>
      </div>

      <Row
        icon={<span className="text-lg">{wallet?.icon ?? '👛'}</span>}
        label="Ví"
        value={wallet?.name ?? 'Chọn ví'}
        onClick={openWalletPicker}
      />

      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
        <div>
          <p className="text-sm font-medium">Lặp lại ngân sách này</p>
          <p className="text-xs text-muted">Tự áp dụng ngân sách này cho các tháng tiếp theo</p>
        </div>
        <button
          type="button"
          onClick={() => setRepeatMonthly((v) => !v)}
          aria-pressed={repeatMonthly}
          aria-label="Lặp lại ngân sách"
          className={`relative h-7 w-12 shrink-0 rounded-pill transition-colors ${repeatMonthly ? 'bg-accent' : 'bg-card-soft'}`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-text transition-transform ${repeatMonthly ? 'translate-x-5' : 'translate-x-0.5'}`}
          />
        </button>
      </div>

      <div className="px-4 py-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={amount <= 0 || !categoryId}
          className="w-full rounded-pill bg-accent py-3.5 text-sm font-semibold text-black disabled:opacity-40"
        >
          {editingBudget ? 'Lưu thay đổi' : 'Lưu'}
        </button>
      </div>
    </>
  )
}
