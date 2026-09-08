'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useVitrineStore } from '@/lib/vitrine/store'

const NAV_LINKS = [
  { href: '/vitrine', label: 'Khám phá' },
  { href: '/vitrine/progress', label: 'Tiến trình' },
  { href: '/vitrine/profile', label: 'Hồ sơ' },
]

export function VitrineHeader() {
  const streakDays = useVitrineStore((s) => s.streakDays)
  const pathname = usePathname()

  return (
    <div
      className="vt-glass-soft"
      style={{
        position: 'sticky',
        top: 20,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 40,
        flexWrap: 'wrap',
        gap: 16,
        padding: '12px 20px',
        borderRadius: 999,
      }}
    >
      <Link href="/vitrine" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: 'linear-gradient(145deg, var(--color-vt-teal), var(--color-vt-teal-deep))',
            boxShadow: '0 4px 14px -3px rgba(13,156,120,.55)',
          }}
        />
        <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 18, letterSpacing: '-0.01em' }}>
          Vitrine
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_LINKS.map((link) => {
            const active = link.href === '/vitrine' ? pathname === '/vitrine' : pathname?.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 13.5,
                  fontWeight: 500,
                  padding: '7px 14px',
                  borderRadius: 999,
                  textDecoration: 'none',
                  color: active ? 'var(--color-vt-ink)' : 'var(--color-vt-ink-soft)',
                  background: active ? 'rgba(255,255,255,0.65)' : 'transparent',
                  boxShadow: active ? '0 2px 8px -2px var(--color-vt-shadow)' : 'none',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div style={{ fontSize: 13, color: 'var(--color-vt-ink-soft)' }}>{streakDays} ngày liên tiếp</div>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'linear-gradient(150deg, var(--color-vt-brass-soft), var(--color-vt-brass))',
            border: '1px solid rgba(255,255,255,0.7)',
          }}
        />
      </div>
    </div>
  )
}
