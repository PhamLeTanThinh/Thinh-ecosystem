'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useHabitsUIStore } from '@/lib/habits/uiStore'

const NAV_ITEMS = [
  { href: '/habits', label: 'Hôm nay', icon: '✅' },
  { href: '/habits/grid', label: 'Lưới tháng', icon: '🗓️' },
  { href: '/habits/stats', label: 'Thống kê', icon: '📊' },
  { href: '/habits/wellness', label: 'Sức khoẻ', icon: '🌙' },
]

export function Sidebar() {
  const pathname = usePathname()
  const openAddHabit = useHabitsUIStore((s) => s.openAddHabit)

  const isActive = (href: string) => (href === '/habits' ? pathname === '/habits' : pathname.startsWith(href))

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card px-4 py-6 md:flex">
      <p className="px-2 text-lg font-bold">🔥 Thói Quen</p>

      <button
        type="button"
        onClick={() => openAddHabit()}
        className="mt-6 flex items-center justify-center gap-2 rounded-pill bg-accent py-3 text-sm font-semibold text-black transition-transform duration-150 active:scale-95"
      >
        <span className="text-lg leading-none">＋</span> Thêm Thói Quen
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
