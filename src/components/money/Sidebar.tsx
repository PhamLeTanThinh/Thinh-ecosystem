'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMoneyUIStore } from '@/lib/money/uiStore'

const NAV_ITEMS = [
  { href: '/money', label: 'Tổng quan', icon: '🏠' },
  { href: '/money/transactions', label: 'Sổ giao dịch', icon: '📒' },
  { href: '/money/budget', label: 'Ngân sách', icon: '🎯' },
  { href: '/money/debts', label: 'Quản lý nợ', icon: '🧾' },
  { href: '/money/account', label: 'Tài khoản', icon: '👤' },
]

export function Sidebar() {
  const pathname = usePathname()
  const openAddTransaction = useMoneyUIStore((s) => s.openAddTransaction)

  const isActive = (href: string) => (href === '/money' ? pathname === '/money' : pathname.startsWith(href))

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card px-4 py-6 md:flex">
      <p className="px-2 text-lg font-bold">💸 Thu Chi</p>

      <button
        type="button"
        onClick={openAddTransaction}
        className="mt-6 flex items-center justify-center gap-2 rounded-pill bg-accent py-3 text-sm font-semibold text-black transition-transform duration-150 active:scale-95"
      >
        <span className="text-lg leading-none">＋</span> Thêm Giao Dịch
      </button>

      <nav className="mt-8 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
              isActive(item.href) ? 'bg-accent-soft text-accent' : 'text-muted hover:bg-card-soft'
            }`}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
