'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMoneyUIStore } from '@/lib/money/uiStore'

const leftItems = [
  { href: '/money', label: 'Tổng quan', icon: '🏠' },
  { href: '/money/transactions', label: 'Sổ giao dịch', icon: '📒' },
]

const rightItems = [
  { href: '/money/budget', label: 'Ngân sách', icon: '🎯' },
  { href: '/money/account', label: 'Tài khoản', icon: '👤' },
]

export function BottomNav() {
  const pathname = usePathname()
  const openAddTransaction = useMoneyUIStore((s) => s.openAddTransaction)

  const isActive = (href: string) => (href === '/money' ? pathname === '/money' : pathname.startsWith(href))

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-card/95 px-2 pt-2 backdrop-blur md:hidden"
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-between">
        {leftItems.map((item) => (
          <NavItem key={item.href} {...item} active={isActive(item.href)} />
        ))}

        <button
          type="button"
          onClick={openAddTransaction}
          aria-label="Thêm giao dịch"
          className="-mt-7 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-3xl font-light text-black shadow-lg shadow-accent-soft transition-transform duration-150 active:scale-90"
        >
          +
        </button>

        {rightItems.map((item) => (
          <NavItem key={item.href} {...item} active={isActive(item.href)} />
        ))}
      </div>
    </nav>
  )
}

function NavItem({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex flex-1 flex-col items-center gap-1 py-1 text-[11px] transition-colors ${active ? 'text-accent' : 'text-muted'}`}
    >
      <span className="text-lg leading-none">{icon}</span>
      {label}
    </Link>
  )
}
