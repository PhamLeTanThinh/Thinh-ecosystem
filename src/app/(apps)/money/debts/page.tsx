'use client'

import { useMoneyStore } from '@/lib/money/store'
import { useMoneyUIStore } from '@/lib/money/uiStore'
import {
  formatFullDate,
  formatVND,
  getDebtPaid,
  getDebtRemaining,
  getTotalDebt,
  parseISODate,
} from '@/lib/money/calculations'
import type { Debt, Transaction } from '@/lib/money/types'

export default function DebtsPage() {
  const debts = useMoneyStore((s) => s.debts)
  const transactions = useMoneyStore((s) => s.transactions)
  const openAddDebt = useMoneyUIStore((s) => s.openAddDebt)

  const debtsIOwe = debts.filter((d) => d.direction === 'owe')
  const debtsOwedToMe = debts.filter((d) => d.direction === 'owed')
  const totalOwe = getTotalDebt(debts, transactions, 'owe')
  const totalOwed = getTotalDebt(debts, transactions, 'owed')

  return (
    <div>
      <div className="flex items-center justify-between px-4 pt-6">
        <h1 className="text-lg font-bold">Quản lý nợ</h1>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-4">
        <div className="rounded-card bg-card p-4">
          <p className="text-xs text-muted">Tôi đang nợ</p>
          <p className="mt-1 text-lg font-bold text-danger">{formatVND(totalOwe)}</p>
        </div>
        <div className="rounded-card bg-card p-4">
          <p className="text-xs text-muted">Người ta nợ tôi</p>
          <p className="mt-1 text-lg font-bold text-income">{formatVND(totalOwed)}</p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={openAddDebt}
          className="w-full rounded-pill bg-accent py-3 text-sm font-semibold text-black transition-transform duration-150 active:scale-[0.98]"
        >
          + Thêm khoản nợ
        </button>
      </div>

      <DebtSection title="Tôi nợ" debts={debtsIOwe} transactions={transactions} emptyLabel="Bạn chưa ghi khoản nợ nào." />
      <DebtSection
        title="Người ta nợ tôi"
        debts={debtsOwedToMe}
        transactions={transactions}
        emptyLabel="Chưa có ai nợ bạn."
      />
    </div>
  )
}

function DebtSection({
  title,
  debts,
  transactions,
  emptyLabel,
}: {
  title: string
  debts: Debt[]
  transactions: Transaction[]
  emptyLabel: string
}) {
  return (
    <section className="px-4 pt-6 pb-2">
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {debts.length === 0 && <p className="col-span-full py-6 text-center text-sm text-muted">{emptyLabel}</p>}
        {debts.map((debt) => (
          <DebtItem key={debt.id} debt={debt} transactions={transactions} />
        ))}
      </div>
    </section>
  )
}

function DebtItem({ debt, transactions }: { debt: Debt; transactions: Transaction[] }) {
  const deleteDebt = useMoneyStore((s) => s.deleteDebt)
  const paid = getDebtPaid(debt, transactions)
  const remaining = getDebtRemaining(debt, transactions)
  const progress = debt.principal > 0 ? Math.min(1, paid / debt.principal) : 0

  function handleDelete() {
    if (!window.confirm(`Xoá khoản nợ "${debt.name}"? Các giao dịch đã liên kết sẽ được giữ lại nhưng bỏ liên kết.`)) return
    deleteDebt(debt.id)
  }

  return (
    <div className="rounded-card bg-card p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-lg">
          {debt.direction === 'owe' ? '🏦' : '🤝'}
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium">{debt.name}</p>
          <p className="text-xs text-muted">
            Còn lại: <span className={remaining > 0 ? 'text-danger' : 'text-income'}>{formatVND(remaining)}</span>
            {debt.dueDate && ` · Hạn: ${formatFullDate(parseISODate(debt.dueDate))}`}
          </p>
        </div>
        <p className="text-sm font-semibold">{formatVND(debt.principal)}</p>
        <button type="button" onClick={handleDelete} aria-label={`Xoá khoản nợ ${debt.name}`} className="text-danger">
          🗑
        </button>
      </div>

      <div className="relative mt-3 h-1.5 rounded-pill bg-card-soft">
        <div className="h-full rounded-pill bg-accent" style={{ width: `${progress * 100}%` }} />
      </div>

      {debt.note && <p className="mt-2 text-xs text-muted">{debt.note}</p>}
    </div>
  )
}
