'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useHabitsUIStore } from '@/lib/habits/uiStore'

const leftItems = [
  { href: '/habits', label: 'Hôm nay', icon: '✅' },
  { href: '/habits/grid', label: 'Lưới tháng', icon: '🗓️' },
]

const rightItems = [
  { href: '/habits/stats', label: 'Thống kê', icon: '📊' },
  { href: '/habits/wellness', label: 'Sức khoẻ', icon: '🌙' },
]

export function BottomNav() {
  const pathname = usePathname()
  const openAddHabit = useHabitsUIStore((s) => s.openAddHabit)

  const isActive = (href: string) => (href === '/habits' ? pathname === '/habits' : pathname.startsWith(href))

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
          onClick={() => openAddHabit()}
          aria-label="Thêm thói quen"
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
