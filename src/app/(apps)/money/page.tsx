'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMoneyStore } from '@/lib/money/store'
import { useMoneyUIStore } from '@/lib/money/uiStore'
import { TrendChart } from '@/components/money/TrendChart'
import {
  filterByPeriod,
  filterByWallet,
  formatVND,
  getAverageTrend,
  getDailyTrend,
  getMonthPeriod,
  getTotalBalance,
  getTotalDebt,
  getWalletBalance,
  sumByType,
} from '@/lib/money/calculations'

export default function OverviewPage() {
  const [monthOffset, setMonthOffset] = useState(0)
  const wallets = useMoneyStore((s) => s.wallets)
  const currentWalletId = useMoneyStore((s) => s.currentWalletId)
  const transactions = useMoneyStore((s) => s.transactions)
  const debts = useMoneyStore((s) => s.debts)
  const categories = useMoneyStore((s) => s.categories)
  const cycleStartDay = useMoneyStore((s) => s.settings.cycleStartDay)
  const balanceHidden = useMoneyStore((s) => s.balanceHidden)
  const toggleBalanceHidden = useMoneyStore((s) => s.toggleBalanceHidden)
  const openWalletPicker = useMoneyUIStore((s) => s.openWalletPicker)

  const wallet = wallets.find((w) => w.id === currentWalletId)
  const totalBalance = getTotalBalance(wallets, transactions)
  const totalDebtOwed = getTotalDebt(debts, transactions, categories, 'owe')

  const period = getMonthPeriod(monthOffset, undefined, cycleStartDay)
  const walletTransactions = wallet ? filterByWallet(transactions, wallet.id) : []
  const periodTransactions = filterByPeriod(walletTransactions, period)
  const totalExpense = sumByType(periodTransactions, 'expense')
  const totalIncome = sumByType(periodTransactions, 'income')
  const expenseRatio = totalExpense + totalIncome > 0 ? totalExpense / (totalExpense + totalIncome) : 0

  const trendCurrent = getDailyTrend(walletTransactions, period, 'expense')
  const trendAverage = getAverageTrend(walletTransactions, period, 3, 'expense', cycleStartDay)

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-6">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted">Tổng số dư</p>
            <button type="button" onClick={toggleBalanceHidden} aria-label="Ẩn/hiện số dư" className="text-muted">
              {balanceHidden ? '🙈' : '👁️'}
            </button>
          </div>
          <p className="mt-1 text-3xl font-bold">{balanceHidden ? '•••••••• đ' : formatVND(totalBalance)}</p>
        </div>
        <div className="flex items-center gap-3 text-muted">
          <button type="button" aria-label="Tìm kiếm">
            🔍
          </button>
          <button type="button" aria-label="Thông báo">
            🔔
          </button>
        </div>
      </div>

      <section className="mt-6 px-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Ví của tôi</h2>
          <button type="button" onClick={openWalletPicker} className="text-xs font-medium text-accent">
            Xem tất cả
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {wallets.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={openWalletPicker}
              className="flex min-w-[150px] shrink-0 flex-col gap-2 rounded-card bg-card p-4 text-left"
            >
              <span className="text-xl">{w.icon}</span>
              <span className="text-sm font-medium">{w.name}</span>
              <span className="text-sm font-semibold">{formatVND(getWalletBalance(w.id, transactions))}</span>
            </button>
          ))}
        </div>
      </section>

      {totalDebtOwed > 0 && (
        <section className="mt-4 px-4">
          <Link href="/money/debts" className="flex items-center justify-between rounded-card bg-card p-4">
            <span className="text-sm text-muted">Tổng đang nợ</span>
            <span className="text-sm font-semibold text-danger">{formatVND(totalDebtOwed)} ›</span>
          </Link>
        </section>
      )}

      <section className="mt-6 px-4 pb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Báo cáo tháng này</h2>
          <Link href="/money/transactions" className="text-xs font-medium text-accent">
            Xem báo cáo
          </Link>
        </div>

        <div className="rounded-card bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted">Tổng đã chi</p>
              <p className="text-lg font-bold text-danger">{formatVND(totalExpense)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Tổng thu</p>
              <p className="text-lg font-bold text-income">{formatVND(totalIncome)}</p>
            </div>
          </div>

          <div className="mt-3 flex h-1.5 overflow-hidden rounded-pill bg-card-soft">
            <div className="h-full bg-danger" style={{ width: `${expenseRatio * 100}%` }} />
            <div className="h-full bg-income" style={{ width: `${(1 - expenseRatio) * 100}%` }} />
          </div>

          <div className="mt-4">
            <TrendChart current={trendCurrent} average={trendAverage} />
          </div>

          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-3 rounded-full bg-danger" /> Tháng này
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-3 rounded-full bg-muted" /> Trung bình 3 tháng trước
            </span>
            <span title="So sánh chi tiêu kỳ này với trung bình 3 kỳ trước đó" className="cursor-help text-muted">
              ?
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button type="button" onClick={() => setMonthOffset((o) => o - 1)} aria-label="Kỳ trước" className="text-muted">
              ‹
            </button>
            <div className="flex gap-1.5">
              {[-1, 0, 1].map((rel) => (
                <span key={rel} className={`h-1.5 w-1.5 rounded-full ${rel === 0 ? 'bg-accent' : 'bg-border'}`} />
              ))}
            </div>
            <button type="button" onClick={() => setMonthOffset((o) => o + 1)} aria-label="Kỳ sau" className="text-muted">
              ›
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
