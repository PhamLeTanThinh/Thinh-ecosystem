'use client'

import { LANGUAGE_NAMES, LANGUAGES } from '@/lib/vitrine/languages'
import { useVitrineStore } from '@/lib/vitrine/store'

export function ProfileScreen() {
  const language = useVitrineStore((s) => s.language)
  const setLanguage = useVitrineStore((s) => s.setLanguage)

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 64px 96px' }}>

      <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 34, marginBottom: 40 }}>
        Hồ sơ
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 44 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(150deg, var(--color-vt-teal-soft), var(--color-vt-teal))',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 10px 24px -10px rgba(13,156,120,.5)',
          }}
        />
        <div>
          <div className="vt-font-display" style={{ fontWeight: 600, fontSize: 20 }}>
            Người học Vitrine
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-vt-ink-soft)' }}>Khách — chưa liên kết tài khoản</div>
        </div>
      </div>

      <div style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-vt-teal)', fontWeight: 600, marginBottom: 14 }}>
        Ngôn ngữ hiển thị nhãn từ vựng
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 44 }}>
        {LANGUAGES.map((lang) => {
          const active = lang === language
          return (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={active ? undefined : 'vt-glass-soft'}
              style={{
                padding: '10px 18px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                background: active ? 'linear-gradient(135deg, var(--color-vt-teal), var(--color-vt-teal-deep))' : undefined,
                color: active ? '#fff' : 'var(--color-vt-ink)',
                border: active ? 'none' : undefined,
                boxShadow: active ? '0 8px 20px -8px rgba(13,156,120,.55)' : 'none',
              }}
            >
              {LANGUAGE_NAMES[lang]}
            </button>
          )
        })}
      </div>

      <div style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-vt-teal)', fontWeight: 600, marginBottom: 14 }}>
        Giao diện
      </div>
      <div className="vt-glass" style={{ borderRadius: 18, padding: '16px 20px', fontSize: 14, color: 'var(--color-vt-ink-soft)' }}>
        Vitrine chỉ hỗ trợ light mode.
      </div>
    </div>
  )
}
