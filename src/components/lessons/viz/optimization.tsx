'use client'

import { Axes, Badge, C, Label, Svg, VizFrame, ease, fmt, gauss, lerp, path, phase, rng, scale, seg } from './core'

// ── Gradient Descent với 2 learning rate trên f(x) = x² ─────────────────────────
// Trái lr = 0,1: mỗi bước x ← 0,8·x, tiến dần xuống đáy. Phải lr = 0,95: x ← −0,9·x, nhảy qua lại hai bên đáy.
function gdPanel(ox: number, lr: number, title: string, color: string, t: number) {
  const N = 14
  const xs = [2.8]
  for (let i = 0; i < N; i++) xs.push(xs[i] - lr * 2 * xs[i])
  const sx = scale(-3.2, 3.2, ox + 30, ox + 290)
  const sy = scale(0, 10.5, 240, 58)
  const curve: [number, number][] = []
  for (let x = -3.2; x <= 3.2001; x += 0.08) curve.push([sx(x), sy(x * x)])

  const p = phase(t, 9)
  const prog = seg(p, 0.05, 0.85) * N // số bước đã đi (thực)
  const k = Math.min(N - 1, Math.floor(prog))
  const f = prog >= N ? 1 : ease(prog - k)
  const xa = xs[k]
  const xb = xs[k + 1]
  const x = lerp(xa, xb, f)
  // Bóng "nhảy" theo cung giữa 2 vị trí (nhìn rõ từng bước)
  const y = lerp(xa * xa, xb * xb, f) + Math.sin(Math.PI * f) * Math.min(2.2, Math.abs(xb - xa) * 0.9)
  const done = Math.min(k, N)
  const grad = 2 * x
  const tan = (dx: number) => [sx(x + dx), sy(x * x + grad * dx)] as [number, number]

  return (
    <g>
      <Label x={ox + 160} y={16} anchor="middle" weight={700} color={color}>
        {title}
      </Label>
      <Badge x={ox + 160} y={38} anchor="middle" color={C.muted}>
        bước {Math.min(N, Math.floor(prog))} · w = {fmt(x)} · loss = {fmt(x * x)}
      </Badge>
      <Axes x0={ox + 30} y0={240} x1={ox + 290} y1={58} xLabel="w" yLabel="loss" />
      <path d={path(curve)} fill="none" stroke={C.lightBlue} strokeWidth={4} />
      {Array.from({ length: done }, (_, i) => (
        <line
          key={i}
          x1={sx(xs[i])}
          y1={sy(xs[i] * xs[i])}
          x2={sx(xs[i + 1])}
          y2={sy(xs[i + 1] * xs[i + 1])}
          stroke={color}
          strokeWidth={1.6}
          opacity={0.55}
          markerEnd="url(#viz-arrow)"
        />
      ))}
      <path d={path([tan(-0.7), tan(0.7)])} stroke={C.muted} strokeDasharray="4 3" strokeWidth={1.3} />
      <circle cx={sx(x)} cy={sy(y)} r={8} fill={C.ink} />
    </g>
  )
}

export function GdLearningRate() {
  return (
    <VizFrame
      label="Gradient Descent với learning rate vừa phải và quá lớn"
      still={7}
      render={(t) => (
        <Svg w={640} h={272}>
          {gdPanel(0, 0.1, 'learning rate = 0,1 (vừa phải)', C.green, t)}
          {gdPanel(320, 0.95, 'learning rate = 0,95 (quá lớn)', C.red, t)}
        </Svg>
      )}
    />
  )
}

// ── Local minimum vs global minimum ─────────────────────────────────────────────
const fLocal = (x: number) => 0.12 * x ** 4 - x * x + 0.35 * x + 3
const dLocal = (x: number) => 0.48 * x ** 3 - 2 * x + 0.35

function descend(x0: number, lr: number, n: number) {
  const xs = [x0]
  for (let i = 0; i < n; i++) xs.push(xs[i] - lr * dLocal(xs[i]))
  return xs
}

export function LocalMinimum() {
  const runs = [
    { x0: 3.05, color: C.red, label: 'kẹt ở local minimum' },
    { x0: -0.45, color: C.green, label: 'tới global minimum' },
  ].map((r) => ({ ...r, xs: descend(r.x0, 0.06, 60) }))
  const sx = scale(-3.2, 3.3, 50, 600)
  const sy = scale(-0.3, 7, 250, 30)
  const curve: [number, number][] = []
  for (let x = -3.2; x <= 3.3; x += 0.05) curve.push([sx(x), sy(fLocal(x))])
  return (
    <VizFrame
      label="Gradient Descent kẹt ở local minimum hay tới global minimum tuỳ điểm xuất phát"
      still={6}
      render={(t) => {
        const p = phase(t, 9)
        const prog = seg(p, 0.08, 0.8) * 60
        return (
          <Svg w={640} h={290}>
            <Axes x0={50} y0={250} x1={600} y1={30} xLabel="w" yLabel="loss" />
            <path d={path(curve)} fill="none" stroke={C.lightBlue} strokeWidth={4} />
            <Label x={sx(-2.12)} y={sy(0.19) + 26} anchor="middle" color={C.green} weight={700}>
              global minimum
            </Label>
            <Label x={sx(1.95)} y={sy(1.61) + 26} anchor="middle" color={C.red} weight={700}>
              local minimum
            </Label>
            {runs.map((r, j) => {
              const k = Math.min(59, Math.floor(prog))
              const x = lerp(r.xs[k], r.xs[k + 1], prog - k)
              const trail: [number, number][] = r.xs.slice(0, k + 1).map((v) => [sx(v), sy(fLocal(v))])
              trail.push([sx(x), sy(fLocal(x))])
              return (
                <g key={j}>
                  <path d={path(trail)} fill="none" stroke={r.color} strokeWidth={2} strokeDasharray="3 3" />
                  <circle cx={sx(r.x0)} cy={sy(fLocal(r.x0))} r={4} fill={r.color} opacity={0.5} />
                  <circle cx={sx(x)} cy={sy(fLocal(x)) - 9} r={9} fill={r.color} />
                </g>
              )
            })}
            <Badge x={600} y={22} anchor="end" color={C.muted}>
              2 điểm xuất phát khác nhau · cùng learning rate
            </Badge>
          </Svg>
        )
      }}
    />
  )
}

// ── Đường đi tới điểm tối ưu: Batch / Mini-batch / SGD trên đường đồng mức ──────
const N_STEPS = 70
function descentPath(noise: number, seed: number, lr: number) {
  const r = rng(seed)
  // Loss = 0,5·(w1²/9 + w2²) xoay 25° — hình elip
  const a = (25 * Math.PI) / 180
  const grad = (w1: number, w2: number) => {
    const u = w1 * Math.cos(a) + w2 * Math.sin(a)
    const v = -w1 * Math.sin(a) + w2 * Math.cos(a)
    const gu = u / 9
    const gv = v
    return [gu * Math.cos(a) - gv * Math.sin(a), gu * Math.sin(a) + gv * Math.cos(a)]
  }
  const pts: [number, number][] = [[-3.6, 1.2]]
  for (let i = 0; i < N_STEPS; i++) {
    const [w1, w2] = pts[i]
    const [g1, g2] = grad(w1, w2)
    pts.push([w1 - lr * (g1 + noise * gauss(r)), w2 - lr * (g2 + noise * gauss(r))])
  }
  return pts
}

export function DescentPaths({ variant = 'three' }: { variant?: 'two' | 'three' }) {
  const all = [
    { name: variant === 'two' ? 'Gradient Descent' : 'Batch GD', color: C.blue, pts: descentPath(0, 1, 0.55) },
    { name: 'Mini-batch GD', color: C.green, pts: descentPath(0.18, 7, 0.55) },
    { name: 'SGD', color: C.purple, pts: descentPath(0.5, 3, 0.55) },
  ]
  const lines = variant === 'two' ? [all[0], all[2]] : all
  const sx = scale(-4.5, 4.5, 40, 420)
  // cùng tỉ lệ px/đơn vị với trục x để elip xoay vẽ đúng
  const sy = scale(-2.72, 2.72, 260, 30)
  const a = (25 * Math.PI) / 180
  return (
    <VizFrame
      label="Đường đi tới điểm tối ưu của các biến thể Gradient Descent"
      still={7}
      render={(t) => {
        const p = phase(t, 10)
        const n = Math.max(1, Math.floor(seg(p, 0.05, 0.85) * N_STEPS))
        return (
          <Svg w={640} h={290}>
            <defs>
              <clipPath id={`clip-descent-${variant}`}>
                <rect x={20} y={10} width={410} height={270} rx={10} />
              </clipPath>
            </defs>
            <g clipPath={`url(#clip-descent-${variant})`}>
            {[0.15, 0.5, 1, 1.7, 2.6, 3.7].map((lv, i) => (
              <ellipse
                key={i}
                cx={sx(0)}
                cy={sy(0)}
                rx={Math.sqrt(2 * lv * 9) * (sx(1) - sx(0))}
                ry={Math.sqrt(2 * lv) * (sy(0) - sy(1))}
                transform={`rotate(${(-a * 180) / Math.PI} ${sx(0)} ${sy(0)})`}
                fill="none"
                stroke={C.faint}
                strokeWidth={1.2}
              />
            ))}
            <circle cx={sx(0)} cy={sy(0)} r={5} fill={C.ink} />
            <Label x={sx(0) + 8} y={sy(0) + 18} color={C.muted} size={12}>
              điểm tối ưu
            </Label>
            {lines.map((l) => {
              const pts = l.pts.slice(0, n + 1).map(([x, y]) => [sx(x), sy(y)] as [number, number])
              const last = pts[pts.length - 1]
              return (
                <g key={l.name}>
                  <path d={path(pts)} fill="none" stroke={l.color} strokeWidth={2} strokeLinejoin="round" />
                  <circle cx={last[0]} cy={last[1]} r={5} fill={l.color} />
                </g>
              )
            })}
            </g>
            {lines.map((l, i) => (
              <g key={l.name} transform={`translate(450 ${70 + i * 32})`}>
                <rect width={22} height={4} y={-5} fill={l.color} rx={2} />
                <Label x={30} y={0}>
                  {l.name}
                </Label>
              </g>
            ))}
            <Badge x={450} y={70 + lines.length * 32 + 12} color={C.muted}>
              bước {n}
            </Badge>
            <Label x={450} y={70 + lines.length * 32 + 40} color={C.muted} size={12}>
              càng ít dữ liệu mỗi bước →
            </Label>
            <Label x={450} y={70 + lines.length * 32 + 58} color={C.muted} size={12}>
              đường đi càng “lắc”
            </Label>
          </Svg>
        )
      }}
    />
  )
}

// ── Cost theo epoch: GD giảm đều, SGD giảm nhanh nhưng dao động ─────────────────
export function CostCurves() {
  const E = 60
  const r = rng(11)
  const gd = Array.from({ length: E + 1 }, (_, k) => 2.4 * Math.exp(-k / 16) + 0.25)
  const sgd = Array.from({ length: E + 1 }, (_, k) => 2.4 * Math.exp(-k / 7) + 0.27 + Math.abs(gauss(r)) * 0.35 * Math.exp(-k / 40) + gauss(r) * 0.05)
  const sx = scale(0, E, 50, 600)
  const sy = scale(0, 2.8, 250, 30)
  return (
    <VizFrame
      label="Cost theo epoch của Gradient Descent và SGD"
      still={7}
      render={(t) => {
        const n = Math.max(1, Math.floor(seg(phase(t, 9), 0.03, 0.85) * E))
        const line = (arr: number[]) => path(arr.slice(0, n + 1).map((v, k) => [sx(k), sy(v)]))
        return (
          <Svg w={640} h={285}>
            <Axes x0={50} y0={250} x1={600} y1={30} xLabel="epoch" yLabel="cost" />
            <path d={line(gd)} fill="none" stroke={C.blue} strokeWidth={2.5} />
            <path d={line(sgd)} fill="none" stroke={C.green} strokeWidth={2} />
            <circle cx={sx(n)} cy={sy(gd[n])} r={4.5} fill={C.blue} />
            <circle cx={sx(n)} cy={sy(sgd[n])} r={4.5} fill={C.green} />
            <g transform="translate(430 60)">
              <rect width={22} height={4} y={-5} fill={C.blue} rx={2} />
              <Label x={30} y={0}>
                Gradient Descent
              </Label>
              <rect width={22} height={4} y={23} fill={C.green} rx={2} />
              <Label x={30} y={28}>
                SGD
              </Label>
              <Badge x={0} y={62} color={C.muted}>
                epoch {n}
              </Badge>
            </g>
          </Svg>
        )
      }}
    />
  )
}

export function DescentPathsTwo() {
  return <DescentPaths variant="two" />
}
