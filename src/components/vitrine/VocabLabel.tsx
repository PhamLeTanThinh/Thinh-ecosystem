import type { CSSProperties } from 'react'
import { LANGUAGE_TAGS } from '@/lib/vitrine/languages'
import type { LanguageCode } from '@/lib/vitrine/types'

interface VocabLabelProps {
  word: string
  language: LanguageCode
  learned: boolean
  side: 'left' | 'right'
  style?: CSSProperties
  onClick?: () => void
}

export function VocabLabel({ word, language, learned, side, style, onClick }: VocabLabelProps) {
  return (
    <div style={{ position: 'absolute', width: 190, display: 'flex', justifyContent: side === 'left' ? 'flex-end' : 'flex-start', ...style }}>
      <button
        onClick={onClick}
        className="vt-glass"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: learned ? 'rgba(211,240,229,0.7)' : undefined,
          border: learned ? '1px solid rgba(13,156,120,0.55)' : undefined,
          borderRadius: 999,
          padding: '10px 16px 10px 12px',
          fontFamily: 'var(--font-vt-body), system-ui, sans-serif',
          cursor: 'pointer',
        }}
        title={learned ? 'Đã học — bấm để bỏ đánh dấu' : 'Bấm để đánh dấu đã học'}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            background: learned ? 'var(--color-vt-teal)' : 'linear-gradient(135deg, var(--color-vt-brass-soft), var(--color-vt-brass))',
            color: learned ? '#fff' : 'var(--color-vt-brass-deep)',
            padding: '3px 8px',
            borderRadius: 999,
          }}
        >
          {LANGUAGE_TAGS[language]}
        </span>
        <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-vt-ink)', whiteSpace: 'nowrap' }}>{word}</span>
      </button>
    </div>
  )
}
