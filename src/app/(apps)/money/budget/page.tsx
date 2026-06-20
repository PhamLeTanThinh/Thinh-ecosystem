'use client'

import { useState } from 'react'
import { useMoneyStore } from '@/lib/money/store'
import { useMoneyUIStore } from '@/lib/money/uiStore'
import { WalletSelector } from '@/components/money/WalletSelector'
import { BudgetGauge } from '@/components/money/BudgetGauge'
import {
  formatVND,
  getActiveBudgetsForPeriod,
  getBudgetProgress,
  getBudgetSpent,
  getDaysLeftInPeriod,
  getMonthPeriod,
  getTodayMarkerProgress,
} from '@/lib/money/calculations'
import type { Budget } from '@/lib/money/types'

export default function BudgetPage() {
  const [monthOffset, setMonthOffset] = useState(0)
  const wallets = useMoneyStore((s) => s.wallets)
  const currentWalletId = useMoneyStore((s) => s.currentWalletId)
  const budgets = useMoneyStore((s) => s.budgets)
  const transactions = useMoneyStore((s) => s.transactions)
  const cycleStartDay = useMoneyStore((s) => s.settings.cycleStartDay)
  const openAddBudget = useMoneyUIStore((s) => s.openAddBudget)

  const wallet = wallets.find((w) => w.id === currentWalletId)
  const period = getMonthPeriod(monthOffset, undefined, cycleStartDay)
  const activeBudgets = wallet ? getActiveBudgetsForPeriod(budgets, wallet.id, period) : []

  const totalBudget = activeBudgets.reduce((total, b) => total + b.amount, 0)
  const totalSpent = activeBudgets.reduce((total, b) => total + getBudgetSpent(b, transactions), 0)
  const canSpend = Math.max(0, totalBudget - totalSpent)
  const daysLeft = getDaysLeftInPeriod(period)
  const todayMarker = monthOffset === 0 ? getTodayMarkerProgress(period) : null

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-6">
        <h1 className="text-lg font-bold">Ngân sách Đang áp dụng</h1>
        <button type="button" aria-label="Trợ giúp" className="text-muted">
          ?
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between px-4">
        <WalletSelector />
        <button type="button" aria-label="Tuỳ chọn khác" className="text-muted">
          ⋯
        </button>
      </div>

      <div className="mt-4 flex gap-2 px-4">
        <button
          type="button"
          onClick={() => setMonthOffset(0)}
          className={`rounded-pill px-4 py-1.5 text-xs font-medium transition-colors duration-200 ${monthOffset === 0 ? 'bg-accent text-black' : 'bg-card-soft text-muted'}`}
        >
          Tháng này
        </button>
        <button
          type="button"
          onClick={() => setMonthOffset(-1)}
          className={`rounded-pill px-4 py-1.5 text-xs font-medium transition-colors duration-200 ${monthOffset === -1 ? 'bg-accent text-black' : 'bg-card-soft text-muted'}`}
        >
          Tháng trước
        </button>
        <button
          type="button"
          onClick={() => setMonthOffset(1)}
          className={`rounded-pill px-4 py-1.5 text-xs font-medium transition-colors duration-200 ${monthOffset === 1 ? 'bg-accent text-black' : 'bg-card-soft text-muted'}`}
        >
          Tháng sau
        </button>
      </div>

      <div className="mx-4 mt-4 rounded-card bg-card p-5">
        <BudgetGauge canSpend={canSpend} totalBudget={totalBudget} />

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-muted">Tổng ngân sách</p>
            <p className="mt-1 text-sm font-semibold">{formatVND(totalBudget)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Tổng đã chi</p>
            <p className="mt-1 text-sm font-semibold text-danger">{formatVND(totalSpent)}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Số ngày còn lại</p>
            <p className="mt-1 text-sm font-semibold">{daysLeft}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openAddBudget()}
          className="mt-5 w-full rounded-pill bg-accent py-3 text-sm font-semibold text-black transition-transform duration-150 active:scale-[0.98]"
        >
          Tạo Ngân sách
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 px-4 pb-6 md:grid-cols-2">
        {activeBudgets.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted">Chưa có ngân sách nào cho kỳ này.</p>
        )}
        {activeBudgets.map((budget) => (
          <BudgetItem key={budget.id} budget={budget} todayMarker={todayMarker} />
        ))}
      </div>
    </div>
  )
}

function BudgetItem({ budget, todayMarker }: { budget: Budget; todayMarker: number | null }) {
  const categories = useMoneyStore((s) => s.categories)
  const transactions = useMoneyStore((s) => s.transactions)
  const deleteBudget = useMoneyStore((s) => s.deleteBudget)
  const openAddBudget = useMoneyUIStore((s) => s.openAddBudget)
  const category = categories.find((c) => c.id === budget.categoryId)
  const spent = getBudgetSpent(budget, transactions)
  const progress = getBudgetProgress(budget, transactions)
  const remaining = budget.amount - spent
  const overBudget = remaining < 0

  function handleDelete() {
    if (!window.confirm(`Xoá ngân sách "${category?.name ?? ''}"?`)) return
    deleteBudget(budget.id)
  }

  return (
    <div className="rounded-card bg-card p-4">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => openAddBudget(budget.id)} className="flex flex-1 items-center gap-3 text-left">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
            style={{ backgroundColor: `${category?.color ?? '#9ca3af'}26` }}
          >
            {category?.icon ?? '📦'}
          </span>
          <span className="flex-1">
            <span className="block text-sm font-medium">{category?.name ?? 'Không xác định'}</span>
            <span className={`block text-xs ${overBudget ? 'text-danger' : 'text-muted'}`}>
              Còn lại: {formatVND(remaining)}
            </span>
          </span>
          <span className="text-sm font-semibold">{formatVND(budget.amount)}</span>
        </button>
        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Xoá ngân sách ${category?.name ?? ''}`}
          className="text-danger"
        >
          🗑
        </button>
      </div>

      <div className="relative mt-3 h-1.5 rounded-pill bg-card-soft">
        <div
          className={`h-full rounded-pill ${overBudget ? 'bg-danger' : 'bg-accent'}`}
          style={{ width: `${Math.min(1, progress) * 100}%` }}
        />
        {todayMarker !== null && (
          <span
            className="absolute -top-3.5 flex -translate-x-1/2 flex-col items-center text-[9px] text-muted"
            style={{ left: `${todayMarker * 100}%` }}
          >
            Hôm nay
            <span className="mt-0.5 h-2 w-px bg-muted" />
          </span>
        )}
      </div>
    </div>
  )
}
