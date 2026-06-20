'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useMoneyStore } from '@/lib/money/store'
import { WalletSelector } from '@/components/money/WalletSelector'
import { TransactionList } from '@/components/money/TransactionList'
import {
  filterByPeriod,
  filterByWallet,
  formatPeriodRangeLabel,
  formatVND,
  getClosingBalance,
  getMonthPeriod,
  getOpeningBalance,
  type Period,
} from '@/lib/money/calculations'

function tabLabel(offset: number, period: Period): string {
  if (offset === 0) return 'Tháng này'
  if (offset > 0) return 'TƯƠNG LAI'
  if (offset === -1) return 'Tháng trước'
  return formatPeriodRangeLabel(period)
}

export default function TransactionsPage() {
  const [monthOffset, setMonthOffset] = useState(0)
  const wallets = useMoneyStore((s) => s.wallets)
  const currentWalletId = useMoneyStore((s) => s.currentWalletId)
  const categories = useMoneyStore((s) => s.categories)
  const transactions = useMoneyStore((s) => s.transactions)

  const wallet = wallets.find((w) => w.id === currentWalletId)

  const tabs = useMemo(
    () => [monthOffset - 1, monthOffset, monthOffset + 1].map((offset) => ({ offset, period: getMonthPeriod(offset) })),
    [monthOffset],
  )

  const period = getMonthPeriod(monthOffset)

  const walletTransactions = wallet ? filterByWallet(transactions, wallet.id) : []
  const periodTransactions = filterByPeriod(walletTransactions, period)
  const openingBalance = wallet ? getOpeningBalance(wallet.id, transactions, period) : 0
  const closingBalance = getClosingBalance(openingBalance, periodTransactions)

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-6">
        <button type="button" aria-label="Trợ giúp" className="text-muted">
          ?
        </button>
        <WalletSelector />
        <div className="flex items-center gap-3 text-muted">
          <button type="button" aria-label="Tìm kiếm">
            🔍
          </button>
          <button type="button" aria-label="Tuỳ chọn khác">
            ⋯
          </button>
        </div>
      </div>

      <div className="px-4 py-6 text-center">
        <p className="text-sm text-muted">Số dư</p>
        <p className="mt-1 text-3xl font-bold">{formatVND(closingBalance)}</p>
      </div>

      <div className="flex items-center justify-between border-b border-border px-4">
        {tabs.map(({ offset, period: tabPeriod }) => {
          const active = offset === monthOffset
          return (
            <button
              key={offset}
              type="button"
              onClick={() => setMonthOffset(offset)}
              className={`flex-1 pb-3 text-xs font-medium tracking-wide ${active ? 'border-b-2 border-accent text-text' : 'text-muted'}`}
            >
              {tabLabel(offset, tabPeriod)}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 py-4">
        <div className="rounded-card bg-card p-4">
          <p className="text-xs text-muted">Số dư đầu</p>
          <p className="mt-1 text-base font-semibold">{formatVND(openingBalance)}</p>
        </div>
        <div className="rounded-card bg-card p-4">
          <p className="text-xs text-muted">Số dư cuối</p>
          <p className="mt-1 text-base font-semibold">{formatVND(closingBalance)}</p>
        </div>
      </div>

      <Link href="/money" className="block px-4 pb-4 text-sm font-medium text-accent">
        Xem báo cáo cho giai đoạn này ›
      </Link>

      <TransactionList transactions={periodTransactions} categories={categories} />
    </div>
  )
}
