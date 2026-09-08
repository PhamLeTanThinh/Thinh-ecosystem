'use client'

import { useVitrineStore } from '@/lib/vitrine/store'
import { LANGUAGE_NAMES } from '@/lib/vitrine/languages'

export function LanguageSwitcher() {
  const language = useVitrineStore((s) => s.language)
  const cycleLanguage = useVitrineStore((s) => s.cycleLanguage)

  return (
    <button
      onClick={cycleLanguage}
      className="vt-glass"
      style={{
        position: 'absolute',
        top: 28,
        right: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        borderRadius: 999,
        padding: '11px 16px',
        cursor: 'pointer',
        fontFamily: 'var(--font-vt-body), system-ui, sans-serif',
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="var(--color-vt-ink-soft)" strokeWidth="1.6" />
        <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" stroke="var(--color-vt-ink-soft)" strokeWidth="1.6" />
      </svg>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-vt-ink)' }}>{LANGUAGE_NAMES[language]}</span>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M6 9l6 6 6-6" stroke="var(--color-vt-ink-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
