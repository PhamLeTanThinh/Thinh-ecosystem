'use client'

import { useState } from 'react'
import { useMoneyStore } from '@/lib/money/store'
import { useMoneyUIStore } from '@/lib/money/uiStore'
import { formatPeriodRangeLabel, getMonthPeriod, toISODate } from '@/lib/money/calculations'
import type { TransactionType } from '@/lib/money/types'
import { AmountInput } from '../AmountInput'
import { BottomSheet } from '../BottomSheet'
import { CategoryPicker } from '../CategoryPicker'
import { Row } from '../Row'
import { SheetHeader } from '../SheetHeader'

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

  return (
    <BottomSheet open={open} onClose={close}>
      <AddBudgetForm key={resetKey} onClose={close} />
    </BottomSheet>
  )
}

function AddBudgetForm({ onClose }: { onClose: () => void }) {
  const openWalletPicker = useMoneyUIStore((s) => s.openWalletPicker)

  const wallets = useMoneyStore((s) => s.wallets)
  const currentWalletId = useMoneyStore((s) => s.currentWalletId)
  const categories = useMoneyStore((s) => s.categories)
  const addBudget = useMoneyStore((s) => s.addBudget)
  const cycleStartDay = useMoneyStore((s) => s.settings.cycleStartDay)

  const [budgetType, setBudgetType] = useState<TransactionType>('expense')
  const [categoryId, setCategoryId] = useState<string | null>(
    () => categories.find((c) => c.type === 'expense')?.id ?? null,
  )
  const [amount, setAmount] = useState(0)
  const [monthOffset, setMonthOffset] = useState(0)
  const [repeatMonthly, setRepeatMonthly] = useState(false)

  const wallet = wallets.find((w) => w.id === currentWalletId) ?? wallets[0]
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
    addBudget({
      walletId: wallet.id,
      categoryId,
      amount,
      periodStart: toISODate(period.start),
      periodEnd: toISODate(period.end),
      repeatMonthly,
    })
    onClose()
  }

  const periodLabel = monthOffset === 0 ? 'Tháng này' : monthOffset > 0 ? 'Tháng sau' : 'Tháng trước'

  return (
    <>
      <SheetHeader title="Thêm ngân sách" onCancel={onClose} />

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
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-text transition-transform ${repeatMonthly ? 'translate-x-5' : 'translate-x-0.5'}`}
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
          Lưu
        </button>
      </div>
    </>
  )
}
