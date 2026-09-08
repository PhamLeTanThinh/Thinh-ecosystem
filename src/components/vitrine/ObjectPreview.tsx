import type { AccentColor } from '@/lib/vitrine/types'

const ACCENT_VARS: Record<AccentColor, { soft: string; strong: string; glow: string }> = {
  teal: { soft: 'var(--color-vt-teal-soft)', strong: 'var(--color-vt-teal)', glow: 'rgba(13,156,120,.45)' },
  brass: { soft: 'var(--color-vt-brass-soft)', strong: 'var(--color-vt-brass)', glow: 'rgba(201,162,39,.45)' },
  plum: { soft: 'var(--color-vt-plum-soft)', strong: 'var(--color-vt-plum)', glow: 'rgba(124,47,86,.4)' },
}

// 4 biến thể bố cục khối trôi — lặp lại có chu kỳ theo `seed` để có cảm giác "bộ sưu tập"
// so le mà vẫn xác định (tránh lệch hydration server/client do không dùng random thật).
const VARIANTS = [
  { baseW: 150, baseH: 110, baseLeft: 24, baseBottom: 24, baseRotate: -3, accentW: 64, accentH: 64, accentLeft: 104, accentBottom: 96, accentRotate: 8, accentRadius: 14, accentRound: false },
  { baseW: 120, baseH: 96, baseLeft: 40, baseBottom: 26, baseRotate: 4, accentW: 58, accentH: 58, accentLeft: 44, accentBottom: 88, accentRotate: 0, accentRadius: 29, accentRound: true },
  { baseW: 100, baseH: 100, baseLeft: 52, baseBottom: 24, baseRotate: 0, accentW: 46, accentH: 46, accentLeft: 36, accentBottom: 108, accentRotate: -12, accentRadius: 12, accentRound: false },
  { baseW: 150, baseH: 100, baseLeft: 30, baseBottom: 24, baseRotate: -2, accentW: 50, accentH: 50, accentLeft: 118, accentBottom: 98, accentRotate: 18, accentRadius: 25, accentRound: false },
] as const

interface ObjectPreviewProps {
  accent: AccentColor
  seed?: number
  size?: number
  className?: string
}

export function ObjectPreview({ accent, seed = 0, size = 210, className }: ObjectPreviewProps) {
  const v = VARIANTS[Math.abs(seed) % VARIANTS.length]
  const colors = ACCENT_VARS[accent]
  const scale = size / 210

  return (
    <div className={className} style={{ position: 'relative', width: size, height: size * 0.9 }}>
      {/* Quầng sáng màu mờ phía sau — cho khối kính phía trên nổi lên như đang phát sáng nhẹ. */}
      <div
        style={{
          position: 'absolute',
          bottom: 6 * scale,
          left: (v.baseLeft - 18) * scale,
          width: (v.baseW + 60) * scale,
          height: (v.baseH + 40) * scale,
          borderRadius: '50%',
          background: colors.glow,
          filter: `blur(${20 * scale}px)`,
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 10 * scale,
          left: (v.baseLeft + 6) * scale,
          width: v.baseW * scale,
          height: 22 * scale,
          background: 'radial-gradient(ellipse, rgba(20,30,24,.2), transparent 72%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: v.baseBottom * scale,
          left: v.baseLeft * scale,
          width: v.baseW * scale,
          height: v.baseH * scale,
          borderRadius: 22 * scale,
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(8px) saturate(150%)',
          WebkitBackdropFilter: 'blur(8px) saturate(150%)',
          border: '1px solid rgba(255,255,255,0.65)',
          boxShadow: '0 18px 26px -16px var(--color-vt-shadow), 0 1px 0 rgba(255,255,255,.8) inset',
          transform: `rotate(${v.baseRotate}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: v.accentBottom * scale,
          left: v.accentLeft * scale,
          width: v.accentW * scale,
          height: v.accentH * scale,
          borderRadius: v.accentRound ? '50%' : v.accentRadius * scale,
          background: `linear-gradient(155deg, ${colors.soft}, ${colors.strong})`,
          boxShadow: `0 12px 22px -8px ${colors.glow}, 0 1px 0 rgba(255,255,255,.5) inset`,
          transform: `rotate(${v.accentRotate}deg)`,
        }}
      />
    </div>
  )
}
