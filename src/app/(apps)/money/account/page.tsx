'use client'

import Link from 'next/link'
import { useMoneyStore } from '@/lib/money/store'
import { useMoneyUIStore } from '@/lib/money/uiStore'
import { formatVND, getTotalBalance } from '@/lib/money/calculations'

export default function AccountPage() {
  const wallets = useMoneyStore((s) => s.wallets)
  const transactions = useMoneyStore((s) => s.transactions)
  const openWalletPicker = useMoneyUIStore((s) => s.openWalletPicker)

  const debts = useMoneyStore((s) => s.debts)
  const cycleStartDay = useMoneyStore((s) => s.settings.cycleStartDay)
  const updateSettings = useMoneyStore((s) => s.updateSettings)
  const totalBalance = getTotalBalance(wallets, transactions)

  function shiftCycleStartDay(delta: number) {
    updateSettings({ cycleStartDay: Math.min(28, Math.max(1, cycleStartDay + delta)) })
  }

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold">Tài khoản</h1>

      <div className="mt-4 rounded-card bg-card p-5">
        <p className="text-sm text-muted">Tổng số dư</p>
        <p className="mt-1 text-2xl font-bold">{formatVND(totalBalance)}</p>
      </div>

      <button
        type="button"
        onClick={openWalletPicker}
        className="mt-4 flex w-full items-center justify-between rounded-card bg-card p-4 text-left"
      >
        <span>Quản lý ví ({wallets.length})</span>
        <span className="text-muted">›</span>
      </button>

      <Link
        href="/money/debts"
        className="mt-3 flex w-full items-center justify-between rounded-card bg-card p-4 text-left"
      >
        <span>Quản lý nợ ({debts.length})</span>
        <span className="text-muted">›</span>
      </Link>

      <div className="mt-4 rounded-card bg-card p-4">
        <p className="text-sm font-medium">Ngày bắt đầu chu kỳ ngân sách</p>
        <p className="mt-0.5 text-xs text-muted">
          Tổng quan và ngân sách sẽ tính &quot;tháng&quot; bắt đầu từ ngày này (ví dụ: ngày lương về).
        </p>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => shiftCycleStartDay(-1)}
            aria-label="Giảm ngày bắt đầu chu kỳ"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card-soft text-lg"
          >
            −
          </button>
          <span className="flex-1 text-center text-lg font-semibold">Ngày {cycleStartDay}</span>
          <button
            type="button"
            onClick={() => shiftCycleStartDay(1)}
            aria-label="Tăng ngày bắt đầu chu kỳ"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card-soft text-lg"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
