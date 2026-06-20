'use client'

import { useState } from 'react'
import type { Category, Transaction } from '@/lib/money/types'
import { formatTransactionDate, formatVND, groupByCategory, type CategoryGroup } from '@/lib/money/calculations'

interface TransactionListProps {
  transactions: Transaction[]
  categories: Category[]
}

export function TransactionList({ transactions, categories }: TransactionListProps) {
  const groups = groupByCategory(transactions, categories)

  if (groups.length === 0) {
    return <p className="px-4 py-10 text-center text-sm text-muted">Chưa có giao dịch nào trong kỳ này.</p>
  }

  return (
    <div className="flex flex-col gap-3 px-4">
      {groups.map((group) => (
        <CategoryGroupItem key={group.category.id} group={group} />
      ))}
    </div>
  )
}

function CategoryGroupItem({ group }: { group: CategoryGroup }) {
  const [expanded, setExpanded] = useState(true)
  const isExpense = group.category.type === 'expense'
  const sign = isExpense ? '-' : '+'
  const amountClass = isExpense ? 'text-danger' : 'text-accent'

  return (
    <div className="overflow-hidden rounded-card bg-card">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-card-soft"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
          style={{ backgroundColor: `${group.category.color}26` }}
        >
          {group.category.icon}
        </span>
        <span className="flex-1">
          <span className="block text-sm font-medium">{group.category.name}</span>
          <span className="block text-xs text-muted">{group.transactions.length} giao dịch</span>
        </span>
        <span className={`text-sm font-semibold ${amountClass}`}>
          {sign}
          {formatVND(group.total)}
        </span>
        <span
          className={`text-muted transition-transform duration-200 ${expanded ? 'rotate-180' : 'rotate-0'}`}
          aria-hidden
        >
          ⌄
        </span>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border">
            {group.transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0">
                <div>
                  <p className="text-sm">{tx.note || group.category.name}</p>
                  <p className="text-xs text-muted">{formatTransactionDate(tx.date)}</p>
                </div>
                <span className={`text-sm font-medium ${amountClass}`}>
                  {sign}
                  {formatVND(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
