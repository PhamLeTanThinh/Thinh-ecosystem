'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

// Bộ khung dùng chung cho các đồ thị động trong bài học (LessonArticle → block "viz").
// Mỗi đồ thị là 1 component SVG nhận `t` (giây đã chạy) và tự tính khung hình từ đó — chạy lặp liên tục,
// chỉ chạy khi đang nằm trong màn hình, có nút tạm dừng, và đứng yên ở `still` nếu người dùng bật giảm
// chuyển động. Dữ liệu sinh ngẫu nhiên đều dùng seed cố định để lần nào xem cũng giống nhau.

export const C = {
  ink: '#1d1d24',
  muted: '#8a8a96',
  faint: '#c9c9d3',
  grid: '#ececf1',
  blue: '#3b6fd8',
  lightBlue: '#9db8ee',
  orange: '#e8862a',
  green: '#2f9e5b',
  red: '#d6453d',
  purple: '#7c4ddb',
  teal: '#14918a',
  yellow: '#e2b93b',
}

export interface VizProps {
  t: number // giây đã chạy (chỉ tăng khi đang chạy)
}

// ── Toán & tiện ích ─────────────────────────────────────────────────────────────

// Bộ sinh số ngẫu nhiên có seed (mulberry32) — cùng seed thì cùng dãy số
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Số ngẫu nhiên phân phối chuẩn (Box–Muller)
export function gauss(r: () => number) {
  const u = Math.max(r(), 1e-9)
  const v = r()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k
export const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2)
// Pha trong chu kỳ: 0 → 1 lặp lại mỗi `period` giây
// Chia lấy dư luôn không âm (t có thể âm nếu `still` âm) — tránh tra mảng bằng chỉ số âm
export const mod = (a: number, n: number) => ((a % n) + n) % n
export const phase = (t: number, period: number) => mod(t, period) / period
// Tiến độ của một đoạn [a, b] trong pha 0..1 (trước a = 0, sau b = 1)
export const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1)

export function scale(d0: number, d1: number, r0: number, r1: number) {
  return (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0)
}

export function path(pts: [number, number][]) {
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('')
}

export function normalPdf(x: number, mu = 0, sd = 1) {
  return Math.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI))
}

// CDF phân phối chuẩn (xấp xỉ Abramowitz–Stegun, sai số ~1e-7)
export function normalCdf(x: number) {
  const tt = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989423 * Math.exp((-x * x) / 2)
  const p = d * tt * (0.3193815 + tt * (-0.3565638 + tt * (1.781478 + tt * (-1.821256 + tt * 1.330274))))
  return x > 0 ? 1 - p : p
}

export const fmt = (v: number, d = 2) => v.toFixed(d).replace('.', ',')

// ── Thành phần SVG ──────────────────────────────────────────────────────────────

export function Axes({
  x0,
  y0,
  x1,
  y1,
  xLabel,
  yLabel,
}: {
  x0: number
  y0: number // góc dưới trái (toạ độ SVG)
  x1: number
  y1: number // góc trên phải
  xLabel?: string
  yLabel?: string
}) {
  return (
    <g>
      <line x1={x0} y1={y0} x2={x1 + 6} y2={y0} stroke={C.ink} strokeWidth={1.5} markerEnd="url(#viz-arrow)" />
      <line x1={x0} y1={y0} x2={x0} y2={y1 - 6} stroke={C.ink} strokeWidth={1.5} markerEnd="url(#viz-arrow)" />
      {xLabel && (
        <text x={x1} y={y0 + 20} textAnchor="end" fontSize={13} fill={C.muted}>
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text x={x0 + 8} y={y1 + 2} fontSize={13} fill={C.muted}>
          {yLabel}
        </text>
      )}
    </g>
  )
}

export function Label({ x, y, children, color = C.ink, size = 13, anchor = 'start', weight = 500 }: {
  x: number
  y: number
  children: ReactNode
  color?: string
  size?: number
  anchor?: 'start' | 'middle' | 'end'
  weight?: number
}) {
  return (
    <text x={x} y={y} fontSize={size} fill={color} textAnchor={anchor} fontWeight={weight}>
      {children}
    </text>
  )
}

// Ô hiển thị giá trị (vd "bước 3 / learning rate 0,1")
export function Badge({ x, y, children, color = C.ink, anchor = 'start' }: { x: number; y: number; children: ReactNode; color?: string; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <text x={x} y={y} fontSize={13} fontWeight={700} fill={color} textAnchor={anchor} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {children}
    </text>
  )
}

export function Svg({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img" style={{ display: 'block', overflow: 'visible', fontFamily: 'inherit' }}>
      <defs>
        <marker id="viz-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={C.ink} />
        </marker>
      </defs>
      {children}
    </svg>
  )
}

// ── Khung chạy ──────────────────────────────────────────────────────────────────

export function VizFrame({ render, still = 3, label }: { render: (t: number) => ReactNode; still?: number; label: string }) {
  const boxRef = useRef<HTMLDivElement>(null)
  // Người dùng bật giảm chuyển động → mặc định đứng yên (vẫn bấm chạy được). Đồ thị chỉ render ở trình
  // duyệt (registry: ssr: false) nên đọc matchMedia ngay lúc khởi tạo được.
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [playing, setPlaying] = useState(!reduced)
  // Chạy từ khung đầu; đứng yên thì hiện khung `still` (khung minh hoạ rõ nhất)
  const [t, setT] = useState(reduced ? still : 0)
  const [visible, setVisible] = useState(false)

  // Chỉ chạy khi đồ thị đang nằm trong màn hình
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '80px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!playing || !visible) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000) // tab bị ẩn lâu thì không nhảy cóc
      last = now
      setT((v) => v + dt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, visible])

  return (
    <div ref={boxRef} className="la-viz" aria-label={label}>
      {render(t)}
      <div className="la-viz-controls">
        <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Tạm dừng' : 'Chạy'}>
          {playing ? '❚❚' : '▶'}
        </button>
        <button type="button" onClick={() => setT(0)} aria-label="Chạy lại từ đầu">
          ↺
        </button>
      </div>
    </div>
  )
}
