'use client'

import { Axes, Badge, C, Label, Svg, VizFrame, clamp, ease, fmt, gauss, lerp, mod, normalCdf, normalPdf, path, phase, rng, scale, seg } from './core'

// ── Least squares đa thức (giải phương trình chuẩn, x đã đưa về [−1, 1]) ─────────
function polyFit(xs: number[], ys: number[], deg: number) {
  const n = deg + 1
  const A = Array.from({ length: n }, () => new Array(n + 1).fill(0))
  xs.forEach((x, k) => {
    const pw = Array.from({ length: n }, (_, i) => x ** i)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) A[i][j] += pw[i] * pw[j]
      A[i][n] += pw[i] * ys[k]
    }
  })
  for (let i = 0; i < n; i++) A[i][i] += 1e-9 // ổn định số khi bậc cao
  for (let c = 0; c < n; c++) {
    let piv = c
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r
    ;[A[c], A[piv]] = [A[piv], A[c]]
    for (let r = 0; r < n; r++) {
      if (r === c) continue
      const f = A[r][c] / A[c][c]
      for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k]
    }
  }
  const w = A.map((row, i) => row[n] / row[i])
  return (x: number) => w.reduce((s, wi, i) => s + wi * x ** i, 0)
}

interface PolySpec {
  seed: number
  n: number
  degs: number[]
  truth: (x: number) => number // x ∈ [−1, 1]
  noise: number
  xLabel: string
  yLabel: string
  showError: boolean
}

function PolyFitViz({ spec }: { spec: PolySpec }) {
  const r = rng(spec.seed)
  const xs = Array.from({ length: spec.n }, (_, i) => -0.95 + (1.9 * (i + 0.5 * r())) / spec.n)
  const ys = xs.map((x) => spec.truth(x) + spec.noise * gauss(r))
  const tx = Array.from({ length: 40 }, () => -0.95 + 1.9 * r())
  const ty = tx.map((x) => spec.truth(x) + spec.noise * gauss(r))
  const fits = spec.degs.map((d) => {
    const f = polyFit(xs, ys, d)
    const mse = (X: number[], Y: number[]) => X.reduce((s, x, i) => s + (f(x) - Y[i]) ** 2, 0) / X.length
    return { d, f, train: mse(xs, ys), test: mse(tx, ty) }
  })
  const W = spec.showError ? 420 : 600
  const sx = scale(-1, 1, 50, W)
  const sy = scale(-0.2, 1.25, 250, 30)
  const maxErr = Math.max(...fits.map((f) => Math.min(f.test, 0.2)))
  return (
    <VizFrame
      label="Fit đa thức với bậc tăng dần: underfitting, vừa khít, overfitting"
      still={(Math.max(1, spec.degs.findIndex((d) => d >= 2)) + 0.6) * 2.4}
      render={(t) => {
        const per = 2.4
        const idx = mod(Math.floor(t / per), fits.length)
        const cur = fits[idx]
        const morph = ease(seg(phase(t, per), 0, 0.35))
        const prev = fits[mod(idx - 1, fits.length)]
        const curve: [number, number][] = []
        for (let x = -1; x <= 1.0001; x += 0.01) curve.push([sx(x), sy(lerp(prev.f(x), cur.f(x), idx === 0 ? 1 : morph))])
        const verdict = cur.d <= 1 ? ['Underfitting — quá đơn giản', C.orange] : cur.test > cur.train * 2.2 && cur.d >= 6 ? ['Overfitting — học thuộc cả nhiễu', C.red] : ['Vừa khít', C.green]
        return (
          <Svg w={640} h={290}>
            <defs>
              <clipPath id={`clip-poly-${spec.seed}`}>
                <rect x={50} y={20} width={W - 50} height={232} />
              </clipPath>
            </defs>
            <Axes x0={50} y0={250} x1={W} y1={30} xLabel={spec.xLabel} yLabel={spec.yLabel} />
            {spec.showError && tx.map((x, i) => <circle key={`t${i}`} cx={sx(x)} cy={sy(ty[i])} r={3.5} fill={C.faint} />)}
            {xs.map((x, i) => (
              <circle key={i} cx={sx(x)} cy={sy(ys[i])} r={6} fill={C.blue} />
            ))}
            <path d={path(curve)} fill="none" stroke={verdict[1]} strokeWidth={3} clipPath={`url(#clip-poly-${spec.seed})`} />
            <Badge x={W} y={22} anchor="end" color={verdict[1]}>
              Bậc {cur.d}: {verdict[0]}
            </Badge>
            {spec.showError && (
              <g transform="translate(450 50)">
                <Label x={0} y={0} weight={700}>
                  Lỗi (MSE)
                </Label>
                {[
                  ['train', cur.train, C.blue],
                  ['test (dữ liệu mới)', cur.test, C.red],
                ].map(([name, v, col], i) => (
                  <g key={name as string} transform={`translate(0 ${24 + i * 56})`}>
                    <Label x={0} y={0} size={12} color={C.muted}>
                      {name as string}
                    </Label>
                    <rect x={0} y={8} width={170} height={16} rx={4} fill={C.grid} />
                    <rect x={0} y={8} width={170 * clamp((v as number) / maxErr, 0.01, 1)} height={16} rx={4} fill={col as string} />
                    <Badge x={170} y={42} anchor="end" color={col as string}>
                      {fmt(v as number, 4)}
                    </Badge>
                  </g>
                ))}
                <circle cx={4} cy={156} r={5} fill={C.blue} />
                <Label x={14} y={160} size={12} color={C.muted}>
                  điểm train
                </Label>
                <circle cx={94} cy={156} r={4} fill={C.faint} />
                <Label x={104} y={160} size={12} color={C.muted}>
                  điểm test
                </Label>
              </g>
            )}
          </Svg>
        )
      }}
    />
  )
}

const uShape = (x: number) => 0.85 * x * x + 0.15 * x + 0.15
const concave = (x: number) => 0.55 + 0.5 * Math.sin(1.3 * x) - 0.12 * x * x

export function PolyFitError() {
  return <PolyFitViz spec={{ seed: 3, n: 11, degs: [1, 2, 3, 5, 8, 10], truth: uShape, noise: 0.07, xLabel: 'X', yLabel: 'Y', showError: true }} />
}
export function PolyFitHouse() {
  return <PolyFitViz spec={{ seed: 9, n: 9, degs: [1, 2, 4, 8], truth: concave, noise: 0.06, xLabel: 'diện tích', yLabel: 'giá', showError: false }} />
}
export function PolyFitDegrees() {
  return <PolyFitViz spec={{ seed: 14, n: 16, degs: [1, 2, 3], truth: (x) => 0.5 + 0.35 * x + 0.25 * Math.sin(3 * x), noise: 0.05, xLabel: 'X', yLabel: 'Y', showError: false }} />
}

// ── K-Fold Cross-Validation ─────────────────────────────────────────────────────
export function KFold() {
  const scores = [91, 89, 93, 88, 90]
  return (
    <VizFrame
      label="5-Fold Cross-Validation"
      still={9.5}
      render={(t) => {
        const p = phase(t, 11)
        const k = Math.min(5, Math.floor(seg(p, 0.02, 0.8) * 5 + 1e-9))
        const showMean = p > 0.82
        return (
          <Svg w={640} h={280}>
            {Array.from({ length: 5 }, (_, row) => {
              const active = row === k || (k === 5 && row === 4)
              const reached = row < k || showMean
              return (
                <g key={row} transform={`translate(30 ${30 + row * 44})`} opacity={reached || row === k ? 1 : 0.35}>
                  <Label x={0} y={22} size={12} color={C.muted}>
                    Lượt {row + 1}
                  </Label>
                  {Array.from({ length: 5 }, (_, col) => (
                    <g key={col}>
                      <rect x={60 + col * 76} y={4} width={70} height={28} rx={6} fill={col === row ? C.orange : C.lightBlue} opacity={col === row ? 1 : 0.6} stroke={active && col === row ? C.ink : 'none'} />
                      <Label x={95 + col * 76} y={23} anchor="middle" size={12} color={col === row ? '#fff' : C.ink}>
                        {col === row ? 'test' : 'train'}
                      </Label>
                    </g>
                  ))}
                  {reached && (
                    <Badge x={450} y={23} color={C.green}>
                      → {scores[row]}%
                    </Badge>
                  )}
                </g>
              )
            })}
            <Badge x={30} y={262} color={showMean ? C.ink : C.muted}>
              {showMean ? 'Kết quả: trung bình 90,2% ± 1,7% (mọi mẫu đều được làm test đúng 1 lần)' : `Đang chạy lượt ${Math.min(5, k + 1)}: train trên 4 phần, chấm điểm trên phần màu cam`}
            </Badge>
          </Svg>
        )
      }}
    />
  )
}

// ── ROC: ngưỡng chạy, điểm trên đường ROC chạy theo ─────────────────────────────
export function RocThreshold() {
  const muN = -0.8
  const muP = 0.9
  const roc = (thr: number) => [1 - normalCdf(thr - muN), 1 - normalCdf(thr - muP)] as const // [FPR, TPR]
  const sxL = scale(-4, 4, 20, 320)
  const syL = scale(0, 0.42, 220, 40)
  const sxR = scale(0, 1, 400, 610)
  const syR = scale(0, 1, 230, 20)
  const curveD = (mu: number) => {
    const pts: [number, number][] = []
    for (let x = -4; x <= 4.001; x += 0.05) pts.push([sxL(x), syL(normalPdf(x, mu))])
    return path(pts)
  }
  const area = (mu: number, from: number) => {
    const pts: [number, number][] = [[sxL(from), syL(0)]]
    for (let x = from; x <= 4.001; x += 0.05) pts.push([sxL(x), syL(normalPdf(x, mu))])
    pts.push([sxL(4), syL(0)])
    return path(pts) + 'Z'
  }
  const full: [number, number][] = []
  for (let th = 4; th >= -4; th -= 0.05) {
    const [f, tp] = roc(th)
    full.push([sxR(f), syR(tp)])
  }
  const auc = normalCdf((muP - muN) / Math.SQRT2)
  return (
    <VizFrame
      label="Thay đổi ngưỡng phân loại và điểm tương ứng trên đường ROC"
      still={5}
      render={(t) => {
        const thr = 3.2 * Math.cos(phase(t, 12) * 2 * Math.PI)
        const [fpr, tpr] = roc(thr)
        const traced = full.filter(([x]) => x <= sxR(fpr) + 0.5)
        return (
          <Svg w={640} h={290}>
            <path d={area(muN, thr)} fill={C.blue} opacity={0.25} />
            <path d={area(muP, thr)} fill={C.orange} opacity={0.35} />
            <path d={curveD(muN)} fill="none" stroke={C.blue} strokeWidth={2.5} />
            <path d={curveD(muP)} fill="none" stroke={C.orange} strokeWidth={2.5} />
            <line x1={20} x2={320} y1={220} y2={220} stroke={C.ink} strokeWidth={1.5} />
            <line x1={sxL(thr)} x2={sxL(thr)} y1={30} y2={220} stroke={C.ink} strokeWidth={2} />
            <Label x={sxL(thr)} y={24} anchor="middle" size={12} weight={700}>
              ngưỡng
            </Label>
            <Label x={sxL(muN) - 22} y={205} anchor="middle" size={12} color={C.blue} weight={700}>
              Negative
            </Label>
            <Label x={sxL(muP) + 22} y={205} anchor="middle" size={12} color={C.orange} weight={700}>
              Positive
            </Label>
            <Label x={170} y={240} anchor="middle" size={12} color={C.muted}>
              điểm số model chấm · bên phải ngưỡng = đoán Positive
            </Label>
            <Badge x={20} y={268} color={C.orange}>
              TPR (Recall) = {fmt(tpr * 100, 0)}%
            </Badge>
            <Badge x={180} y={268} color={C.blue}>
              FPR = {fmt(fpr * 100, 0)}%
            </Badge>
            {/* ROC */}
            <Axes x0={400} y0={230} x1={610} y1={20} />
            <line x1={sxR(0)} y1={syR(0)} x2={sxR(1)} y2={syR(1)} stroke={C.faint} strokeDasharray="4 3" />
            <path d={path(full) + `L${sxR(1)},${syR(0)}L${sxR(0)},${syR(0)}Z`} fill={C.green} opacity={0.08} />
            <path d={path(full)} fill="none" stroke={C.faint} strokeWidth={2} />
            <path d={path(traced)} fill="none" stroke={C.green} strokeWidth={3} />
            <circle cx={sxR(fpr)} cy={syR(tpr)} r={7} fill={C.ink} />
            <Label x={505} y={252} anchor="middle" size={12} color={C.muted}>
              FPR
            </Label>
            <Label x={380} y={125} anchor="middle" size={12} color={C.muted}>
              TPR
            </Label>
            <Badge x={505} y={276} anchor="middle" color={C.green}>
              AUC = {fmt(auc)}
            </Badge>
          </Svg>
        )
      }}
    />
  )
}

// ── Linear Regression học bằng Gradient Descent: residual & RSS giảm dần ─────────
export function RegressionFit() {
  const r = rng(4)
  const xs = Array.from({ length: 14 }, (_, i) => 0.5 + i * 0.7 + r() * 0.3)
  const ys = xs.map((x) => 1.5 + 0.75 * x + gauss(r) * 0.8)
  // GD trên MSE với x chuẩn hoá cho hội tụ nhanh
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length
  const sdx = Math.sqrt(xs.reduce((a, b) => a + (b - mx) ** 2, 0) / xs.length)
  const steps: { a: number; b: number }[] = [{ a: 6.5, b: -1.2 }] // y = a + b·z, z = (x − mx)/sdx
  for (let i = 0; i < 40; i++) {
    const { a, b } = steps[i]
    let ga = 0
    let gb = 0
    xs.forEach((x, k) => {
      const z = (x - mx) / sdx
      const e = a + b * z - ys[k]
      ga += e
      gb += e * z
    })
    steps.push({ a: a - 0.12 * (ga / xs.length) * 2, b: b - 0.12 * (gb / xs.length) * 2 })
  }
  const sx = scale(0, 10.5, 50, 470)
  const sy = scale(0, 11, 260, 25)
  return (
    <VizFrame
      label="Linear Regression học bằng Gradient Descent, residual và RSS giảm dần"
      still={8}
      render={(t) => {
        const prog = seg(phase(t, 10), 0.05, 0.85) * 40
        const k = Math.min(39, Math.floor(prog))
        const a = lerp(steps[k].a, steps[k + 1].a, prog - k)
        const b = lerp(steps[k].b, steps[k + 1].b, prog - k)
        const f = (x: number) => a + (b * (x - mx)) / sdx
        const rss = xs.reduce((s, x, i) => s + (ys[i] - f(x)) ** 2, 0)
        return (
          <Svg w={640} h={290}>
            <Axes x0={50} y0={260} x1={470} y1={25} xLabel="X" yLabel="Y" />
            {xs.map((x, i) => (
              <line key={`r${i}`} x1={sx(x)} x2={sx(x)} y1={sy(ys[i])} y2={sy(f(x))} stroke={C.red} strokeWidth={1.8} opacity={0.75} />
            ))}
            <line x1={sx(0)} y1={sy(f(0))} x2={sx(10.5)} y2={sy(f(10.5))} stroke={C.blue} strokeWidth={3} />
            {xs.map((x, i) => (
              <circle key={i} cx={sx(x)} cy={sy(ys[i])} r={5.5} fill={C.ink} />
            ))}
            <g transform="translate(495 60)">
              <Label x={0} y={0} weight={700}>
                Vòng lặp {Math.floor(prog)}
              </Label>
              <Label x={0} y={30} size={12} color={C.red}>
                ━ residual (phần dư)
              </Label>
              <Label x={0} y={70} size={12} color={C.muted}>
                RSS = tổng bình phương
              </Label>
              <Badge x={0} y={94} color={C.red}>
                RSS = {fmt(rss, 1)}
              </Badge>
              <rect x={0} y={106} width={120} height={12} rx={4} fill={C.grid} />
              <rect x={0} y={106} width={120 * clamp(rss / 260, 0.02, 1)} height={12} rx={4} fill={C.red} />
            </g>
          </Svg>
        )
      }}
    />
  )
}

// ── Mặt phẳng hồi quy 3D xoay vòng ─────────────────────────────────────────────
export function RegressionPlane3D() {
  const r = rng(12)
  const pts = Array.from({ length: 34 }, () => {
    const x1 = r() * 10
    const x2 = r() * 10
    return [x1, x2, 1 + 0.55 * x1 + 0.35 * x2 + gauss(r) * 0.9] as const
  })
  const plane = (x1: number, x2: number) => 1 + 0.55 * x1 + 0.35 * x2
  return (
    <VizFrame
      label="Mặt phẳng Linear Regression với 2 feature, xoay để nhìn từ nhiều phía"
      still={2}
      render={(t) => {
        const th = phase(t, 16) * 2 * Math.PI
        const proj = (x1: number, x2: number, y: number): [number, number] => {
          const X = x1 - 5
          const Z = x2 - 5
          const Xr = X * Math.cos(th) - Z * Math.sin(th)
          const Zr = X * Math.sin(th) + Z * Math.cos(th)
          return [320 + Xr * 24, 215 - y * 14 + Zr * 13]
        }
        const grid: string[] = []
        for (let i = 0; i <= 10; i += 2) {
          grid.push(path([proj(i, 0, plane(i, 0)), proj(i, 10, plane(i, 10))]))
          grid.push(path([proj(0, i, plane(0, i)), proj(10, i, plane(10, i))]))
        }
        const corner = [proj(0, 0, plane(0, 0)), proj(10, 0, plane(10, 0)), proj(10, 10, plane(10, 10)), proj(0, 10, plane(0, 10))]
        return (
          <Svg w={640} h={290}>
            {/* sàn + trục */}
            <path d={path([proj(0, 0, 0), proj(10, 0, 0), proj(10, 10, 0), proj(0, 10, 0)]) + 'Z'} fill={C.grid} opacity={0.6} />
            <path d={path([proj(0, 0, 0), proj(11, 0, 0)])} stroke={C.ink} strokeWidth={1.5} />
            <path d={path([proj(0, 0, 0), proj(0, 11, 0)])} stroke={C.ink} strokeWidth={1.5} />
            <path d={path([proj(0, 0, 0), proj(0, 0, 13)])} stroke={C.ink} strokeWidth={1.5} />
            <Label x={proj(11.6, 0, 0)[0]} y={proj(11.6, 0, 0)[1]} anchor="middle" color={C.muted} size={12}>
              X₁
            </Label>
            <Label x={proj(0, 11.6, 0)[0]} y={proj(0, 11.6, 0)[1]} anchor="middle" color={C.muted} size={12}>
              X₂
            </Label>
            <Label x={proj(0, 0, 13.8)[0]} y={proj(0, 0, 13.8)[1]} anchor="middle" color={C.muted} size={12}>
              Y
            </Label>
            <path d={path(corner) + 'Z'} fill={C.blue} opacity={0.18} />
            {grid.map((d, i) => (
              <path key={i} d={d} stroke={C.blue} strokeWidth={1} opacity={0.6} />
            ))}
            {pts.map(([a, b, y], i) => {
              const [px, py] = proj(a, b, y)
              const [qx, qy] = proj(a, b, plane(a, b))
              return (
                <g key={i}>
                  <line x1={px} y1={py} x2={qx} y2={qy} stroke={C.red} strokeWidth={1.2} opacity={0.6} />
                  <circle cx={px} cy={py} r={4.5} fill={y > plane(a, b) ? C.ink : '#55555f'} />
                </g>
              )
            })}
            <Badge x={20} y={24} color={C.muted}>
              Y = 1 + 0,55·X₁ + 0,35·X₂
            </Badge>
          </Svg>
        )
      }}
    />
  )
}

// ── Sigmoid: con trỏ chạy dọc trục, xác suất và lớp dự đoán đổi theo ────────────
export function LogisticSigmoid() {
  const pass = [0.6, 1.1, 1.6, 2.1, 2.7, 3.2, 3.6, 4.1, 4.5, 5.1, 5.6, 6.2]
  const label = [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1]
  const b0 = -7
  const b1 = 2
  const sig = (z: number) => 1 / (1 + Math.exp(-z))
  // Đường thẳng Linear Regression trên cùng dữ liệu 0/1 (để so sánh)
  const mx = pass.reduce((a, b) => a + b, 0) / pass.length
  const my = label.reduce((a, b) => a + b, 0) / label.length
  const slope = pass.reduce((s, x, i) => s + (x - mx) * (label[i] - my), 0) / pass.reduce((s, x) => s + (x - mx) ** 2, 0)
  const lin = (x: number) => my + slope * (x - mx)
  const sx = scale(0, 7, 50, 450)
  const sy = scale(-0.35, 1.35, 260, 25)
  const sCurve: [number, number][] = []
  for (let x = 0; x <= 7.001; x += 0.05) sCurve.push([sx(x), sy(sig(b0 + b1 * x))])
  return (
    <VizFrame
      label="Logistic Regression: sigmoid biến tổng tuyến tính thành xác suất"
      still={4}
      render={(t) => {
        const x = 3.5 + 3.3 * Math.sin(phase(t, 10) * 2 * Math.PI - Math.PI / 2)
        const z = b0 + b1 * x
        const p = sig(z)
        const yes = p >= 0.5
        return (
          <Svg w={640} h={290}>
            <Axes x0={50} y0={sy(0)} x1={450} y1={25} xLabel="giờ học" />
            <line x1={50} x2={450} y1={sy(1)} y2={sy(1)} stroke={C.faint} strokeDasharray="4 3" />
            <line x1={50} x2={450} y1={sy(0.5)} y2={sy(0.5)} stroke={C.faint} strokeDasharray="2 4" />
            <Label x={44} y={sy(1) + 4} anchor="end" size={12} color={C.muted}>
              1
            </Label>
            <Label x={44} y={sy(0.5) + 4} anchor="end" size={12} color={C.muted}>
              0,5
            </Label>
            <Label x={44} y={sy(0) + 4} anchor="end" size={12} color={C.muted}>
              0
            </Label>
            <line x1={sx(0)} y1={sy(lin(0))} x2={sx(7)} y2={sy(lin(7))} stroke={C.blue} strokeWidth={2} strokeDasharray="6 4" />
            <path d={path(sCurve)} fill="none" stroke={C.orange} strokeWidth={3.5} />
            <line x1={sx(3.5)} x2={sx(3.5)} y1={sy(-0.1)} y2={sy(1.1)} stroke={C.green} strokeDasharray="4 3" />
            <Label x={sx(3.5) + 5} y={sy(1.2)} size={12} color={C.green}>
              ranh giới (σ = 0,5)
            </Label>
            {pass.map((h, i) => (
              <circle key={i} cx={sx(h)} cy={sy(label[i])} r={6} fill={label[i] ? C.green : C.red} opacity={0.8} />
            ))}
            <line x1={sx(x)} x2={sx(x)} y1={sy(-0.3)} y2={sy(1.3)} stroke={C.ink} strokeWidth={1.2} />
            <circle cx={sx(x)} cy={sy(p)} r={7} fill={C.orange} stroke={C.ink} strokeWidth={1.5} />
            <circle cx={sx(x)} cy={sy(lin(x))} r={5} fill={C.blue} />
            <g transform="translate(470 50)">
              <Badge x={0} y={0}>
                giờ học = {fmt(x, 1)}
              </Badge>
              <Badge x={0} y={28} color={C.muted}>
                z = −7 + 2·{fmt(x, 1)} = {fmt(z, 1)}
              </Badge>
              <Badge x={0} y={56} color={C.orange}>
                σ(z) = {fmt(p)}
              </Badge>
              <Badge x={0} y={84} color={yes ? C.green : C.red}>
                → dự đoán: {yes ? 'ĐẬU' : 'RỚT'}
              </Badge>
              <Label x={0} y={128} size={12} color={C.blue}>
                - - Linear Regression:
              </Label>
              <Label x={0} y={146} size={12} color={C.blue}>
                ra {fmt(lin(x))} {lin(x) < 0 || lin(x) > 1 ? '(ngoài 0–1!)' : ''}
              </Label>
              <Label x={0} y={176} size={12} color={C.orange}>
                ━ Sigmoid: luôn trong 0–1
              </Label>
            </g>
          </Svg>
        )
      }}
    />
  )
}

// ── Softmax: điểm số (logits) thay đổi → xác suất thay đổi, tổng luôn = 1 ────────
export function SoftmaxBars() {
  const names = ['chó', 'mèo', 'chim']
  const cols = [C.blue, C.orange, C.green]
  return (
    <VizFrame
      label="Softmax biến điểm số thành xác suất có tổng bằng 1"
      still={1}
      render={(t) => {
        const w = phase(t, 9) * 2 * Math.PI
        const z = [2 + 1.4 * Math.sin(w), 1 + 1.6 * Math.sin(w + 2.1), 0.2 + 1.5 * Math.sin(w + 4.2)]
        const ex = z.map(Math.exp)
        const s = ex.reduce((a, b) => a + b, 0)
        const p = ex.map((v) => v / s)
        const best = p.indexOf(Math.max(...p))
        const zy = scale(-2, 4, 230, 50)
        return (
          <Svg w={640} h={280}>
            <Label x={130} y={24} anchor="middle" weight={700}>
              Điểm số (logits)
            </Label>
            <line x1={30} x2={240} y1={zy(0)} y2={zy(0)} stroke={C.ink} />
            {z.map((v, i) => (
              <g key={i}>
                <rect x={50 + i * 65} width={44} y={Math.min(zy(v), zy(0))} height={Math.abs(zy(v) - zy(0))} rx={4} fill={cols[i]} opacity={0.85} />
                <Badge x={72 + i * 65} y={v >= 0 ? zy(v) - 8 : zy(v) + 18} anchor="middle">
                  {fmt(v, 1)}
                </Badge>
                <Label x={72 + i * 65} y={262} anchor="middle" size={12} color={C.muted}>
                  {names[i]}
                </Label>
              </g>
            ))}
            <text x={300} y={150} fontSize={26} fill={C.ink} textAnchor="middle">
              →
            </text>
            <Label x={300} y={125} anchor="middle" size={12} color={C.muted}>
              softmax
            </Label>
            <Label x={480} y={24} anchor="middle" weight={700}>
              Xác suất (tổng = 100%)
            </Label>
            <line x1={360} x2={610} y1={230} y2={230} stroke={C.ink} />
            {p.map((v, i) => (
              <g key={i}>
                <rect x={385 + i * 75} width={50} y={230 - v * 175} height={v * 175} rx={4} fill={cols[i]} stroke={i === best ? C.ink : 'none'} strokeWidth={2} />
                <Badge x={410 + i * 75} y={222 - v * 175} anchor="middle">
                  {Math.round(v * 100)}%
                </Badge>
                <Label x={410 + i * 75} y={262} anchor="middle" size={12} color={i === best ? C.ink : C.muted} weight={i === best ? 700 : 500}>
                  {names[i]}
                </Label>
              </g>
            ))}
          </Svg>
        )
      }}
    />
  )
}

// ── Ranh giới kNN khi k giảm dần: từ mượt (underfit) tới ôm từng điểm (overfit) ──
export function KnnBoundary() {
  const r = rng(31)
  const pts: [number, number, number][] = []
  for (let i = 0; i < 70; i++) {
    const c = i % 2
    const a = r() * Math.PI
    const x = c ? 1 - Math.cos(a) : Math.cos(a)
    const y = c ? 0.5 - Math.sin(a) : Math.sin(a)
    pts.push([x + gauss(r) * 0.22, y + gauss(r) * 0.22, c])
  }
  const sx = scale(-1.6, 2.6, 30, 430)
  const sy = scale(-1.1, 1.6, 270, 20)
  const COLS = 50
  const ROWS = 32
  const grid = (k: number) => {
    const out: number[] = []
    for (let j = 0; j < ROWS; j++)
      for (let i = 0; i < COLS; i++) {
        const gx = -1.6 + ((i + 0.5) * 4.2) / COLS
        const gy = -1.1 + ((j + 0.5) * 2.7) / ROWS
        const near = pts.map((p) => [(p[0] - gx) ** 2 + (p[1] - gy) ** 2, p[2]]).sort((a, b) => a[0] - b[0])
        const vote = near.slice(0, k).reduce((s, n) => s + n[1], 0) / k
        out.push(vote)
      }
    return out
  }
  const ks = [45, 21, 9, 3, 1]
  // Tính sẵn ranh giới cho mọi k một lần khi mount (vài chục ms), khung hình chỉ việc tra
  const grids = new Map(ks.map((k) => [k, grid(k)]))
  return (
    <VizFrame
      label="Ranh giới quyết định của kNN khi k giảm dần"
      still={5.5}
      render={(t) => {
        const idx = mod(Math.floor(t / 2.6), ks.length)
        const k = ks[idx]
        const g = grids.get(k)!
        const cw = 400 / COLS
        const ch = 250 / ROWS
        const verdict = k >= 40 ? ['k lớn → ranh giới quá đơn giản (underfit)', C.orange] : k <= 1 ? ['k = 1 → ôm từng điểm, kể cả nhiễu (overfit)', C.red] : k <= 3 ? ['k nhỏ → ranh giới bắt đầu ngoằn ngoèo', C.red] : ['k vừa phải → ranh giới hợp lý', C.green]
        return (
          <Svg w={640} h={290}>
            {g.map((v, n) => (
              <rect key={n} x={30 + (n % COLS) * cw} y={20 + (ROWS - 1 - Math.floor(n / COLS)) * ch} width={cw + 0.4} height={ch + 0.4} fill={v >= 0.5 ? C.orange : C.blue} opacity={0.18 + 0.12 * Math.abs(v - 0.5) * 2} />
            ))}
            {pts.map((p, i) => (
              <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r={4.5} fill={p[2] ? C.orange : C.blue} stroke="#fff" strokeWidth={1} />
            ))}
            <g transform="translate(450 70)">
              <text x={0} y={0} fontSize={34} fontWeight={800} fill={C.ink}>
                k = {k}
              </text>
              <foreignObject x={0} y={16} width={170} height={110}>
                <div style={{ fontSize: 13, fontWeight: 700, color: verdict[1], lineHeight: 1.4 }}>{verdict[0]}</div>
              </foreignObject>
            </g>
          </Svg>
        )
      }}
    />
  )
}

// ── Bia Bias–Variance ───────────────────────────────────────────────────────────
export function BiasVarianceTargets() {
  const cfg = [
    { title: 'Bias thấp · Variance thấp', bias: [0, 0], spread: 0.09, color: C.green },
    { title: 'Bias thấp · Variance cao', bias: [0, 0], spread: 0.32, color: C.orange },
    { title: 'Bias cao · Variance thấp', bias: [0.42, -0.3], spread: 0.09, color: C.orange },
    { title: 'Bias cao · Variance cao', bias: [0.38, -0.32], spread: 0.32, color: C.red },
  ]
  const shots = cfg.map((c, j) => {
    const r = rng(40 + j)
    return Array.from({ length: 14 }, () => [c.bias[0] + c.spread * gauss(r), c.bias[1] + c.spread * gauss(r)])
  })
  return (
    <VizFrame
      label="Bia bắn minh hoạ bias và variance"
      still={6}
      render={(t) => {
        const n = Math.floor(seg(phase(t, 8), 0.05, 0.75) * 14)
        return (
          <Svg w={640} h={300}>
            {cfg.map((c, j) => {
              const cx = 85 + j * 157
              const cy = 150
              return (
                <g key={j}>
                  {[62, 46, 30, 14].map((rad, i) => (
                    <circle key={rad} cx={cx} cy={cy} r={rad} fill={i % 2 ? '#fff' : '#eef3fd'} stroke={C.lightBlue} />
                  ))}
                  <circle cx={cx} cy={cy} r={5} fill={C.red} />
                  {shots[j].slice(0, n).map(([x, y], i) => (
                    <circle key={i} cx={cx + x * 70} cy={cy + y * 70} r={4} fill={C.ink} opacity={i === n - 1 ? 1 : 0.7} />
                  ))}
                  <foreignObject x={cx - 72} y={225} width={144} height={50}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: c.color, textAlign: 'center', lineHeight: 1.35 }}>{c.title}</div>
                  </foreignObject>
                </g>
              )
            })}
            <Label x={320} y={40} anchor="middle" color={C.muted} size={12}>
              Tâm đỏ = đáp án đúng · mỗi chấm = model train trên một bộ dữ liệu khác nhau
            </Label>
          </Svg>
        )
      }}
    />
  )
}

// ── L1 vs L2: đường đồng mức nở dần tới khi chạm vùng ràng buộc ─────────────────
export function L1L2Balls() {
  const bh: [number, number] = [1.7, 0.6] // nghiệm không regularization
  const A = [
    [1, 0.55],
    [0.55, 0.75],
  ]
  const q = (b1: number, b2: number) => {
    const d1 = b1 - bh[0]
    const d2 = b2 - bh[1]
    return A[0][0] * d1 * d1 + 2 * A[0][1] * d1 * d2 + A[1][1] * d2 * d2
  }
  const best = (pts: [number, number][]) => pts.reduce((m, p) => (q(p[0], p[1]) < q(m[0], m[1]) ? p : m))
  const circ: [number, number][] = []
  const diam: [number, number][] = []
  for (let i = 0; i < 2000; i++) {
    const a = (i / 2000) * 2 * Math.PI
    circ.push([Math.cos(a), Math.sin(a)])
    const c = Math.cos(a)
    const s = Math.sin(a)
    const k = 1 / (Math.abs(c) + Math.abs(s))
    diam.push([c * k, s * k])
  }
  const solL2 = best(circ)
  const solL1 = best(diam)
  // Elip q = level: dùng giá trị riêng của A để vẽ
  const tr = A[0][0] + A[1][1]
  const det = A[0][0] * A[1][1] - A[0][1] ** 2
  const l1 = tr / 2 + Math.sqrt((tr * tr) / 4 - det)
  const l2 = tr / 2 - Math.sqrt((tr * tr) / 4 - det)
  const ang = (Math.atan2(l1 - A[0][0], A[0][1]) * 180) / Math.PI
  const panel = (ox: number, title: string, sol: [number, number], shape: 'diamond' | 'circle', color: string, t: number) => {
    const s = scale(-1.6, 3.2, ox + 20, ox + 300)
    const sy = (v: number) => 160 - v * (s(1) - s(0))
    const level = q(sol[0], sol[1])
    const p = phase(t, 9)
    const grow = ease(seg(p, 0.08, 0.6))
    const lv = Math.max(0.0001, level * grow)
    const touched = p > 0.6
    return (
      <g>
        <defs>
          <clipPath id={`clip-l1l2-${ox}`}>
            <rect x={ox + 10} y={34} width={300} height={232} />
          </clipPath>
        </defs>
        <Label x={ox + 160} y={22} anchor="middle" weight={700} color={color}>
          {title}
        </Label>
        <line x1={s(-1.6)} x2={s(3.2)} y1={160} y2={160} stroke={C.ink} />
        <line x1={s(0)} x2={s(0)} y1={260} y2={40} stroke={C.ink} />
        <Label x={s(3.2)} y={176} anchor="end" size={12} color={C.muted}>
          β₁
        </Label>
        <Label x={s(0) + 6} y={50} size={12} color={C.muted}>
          β₂
        </Label>
        {shape === 'circle' ? (
          <circle cx={s(0)} cy={160} r={s(1) - s(0)} fill={color} opacity={0.22} stroke={color} strokeWidth={2} />
        ) : (
          <path d={path([[s(1), 160], [s(0), sy(1)], [s(-1), 160], [s(0), sy(-1)]]) + 'Z'} fill={color} opacity={0.22} stroke={color} strokeWidth={2} />
        )}
        <g clipPath={`url(#clip-l1l2-${ox})`}>
        {[1, 0.55].map((m) => (
          <ellipse
            key={m}
            cx={s(bh[0])}
            cy={sy(bh[1])}
            rx={Math.sqrt((lv * m) / l2) * (s(1) - s(0))}
            ry={Math.sqrt((lv * m) / l1) * (s(1) - s(0))}
            // SVG có trục y hướng xuống nên góc toán học phải đổi dấu
            transform={`rotate(${90 - ang} ${s(bh[0])} ${sy(bh[1])})`}
            fill="none"
            stroke={C.red}
            strokeWidth={m === 1 ? 2 : 1}
            opacity={m === 1 ? 0.9 : 0.4}
          />
        ))}
        </g>
        <circle cx={s(bh[0])} cy={sy(bh[1])} r={4} fill={C.red} />
        <Label x={s(bh[0]) + 6} y={sy(bh[1]) - 6} size={11} color={C.red}>
          β̂ (không phạt)
        </Label>
        {touched && <circle cx={s(sol[0])} cy={sy(sol[1])} r={7} fill={C.ink} />}
        <Badge x={ox + 160} y={285} anchor="middle" color={touched ? C.ink : C.muted}>
          {touched ? `β₁ = ${fmt(sol[0])}, β₂ = ${fmt(Math.abs(sol[1]) < 0.01 ? 0 : sol[1])}` : 'đường đồng mức nở dần…'}
        </Badge>
      </g>
    )
  }
  return (
    <VizFrame
      label="L1 (hình thoi) và L2 (hình tròn): nghiệm là điểm đường đồng mức chạm vùng ràng buộc"
      still={7}
      render={(t) => (
        <Svg w={640} h={295}>
          {panel(0, 'L1 — Lasso (hình thoi)', solL1, 'diamond', C.blue, t)}
          {panel(320, 'L2 — Ridge (hình tròn)', solL2, 'circle', C.green, t)}
        </Svg>
      )}
    />
  )
}

// ── Hàm biến đổi hệ số theo λ: Best subset, Ridge, Lasso ─────────────────────────
export function ShrinkageFunctions() {
  const fns = [
    { name: 'Best subset', f: (b: number, l: number) => (Math.abs(b) > l ? b : 0), color: C.purple, note: 'giữ nguyên hoặc bỏ hẳn' },
    { name: 'Ridge (L2)', f: (b: number, l: number) => b / (1 + l), color: C.green, note: 'co theo tỉ lệ, không về 0' },
    { name: 'Lasso (L1)', f: (b: number, l: number) => Math.sign(b) * Math.max(Math.abs(b) - l, 0), color: C.blue, note: 'trừ bớt λ, nhỏ hơn λ thì = 0' },
  ]
  return (
    <VizFrame
      label="Cách Best subset, Ridge và Lasso biến đổi hệ số khi λ thay đổi"
      still={4}
      render={(t) => {
        const lam = 1.4 * (0.5 - 0.5 * Math.cos(phase(t, 9) * 2 * Math.PI))
        return (
          <Svg w={640} h={285}>
            {fns.map((fn, j) => {
              const ox = j * 213
              const s = scale(-3, 3, ox + 15, ox + 195)
              const sy = (v: number) => 140 - (v * 180) / 6
              const pts: [number, number][] = []
              for (let b = -3; b <= 3.0001; b += 0.02) pts.push([s(b), sy(fn.f(b, lam))])
              return (
                <g key={fn.name}>
                  <Label x={ox + 105} y={22} anchor="middle" weight={700} color={fn.color}>
                    {fn.name}
                  </Label>
                  <line x1={ox + 15} x2={ox + 195} y1={140} y2={140} stroke={C.ink} />
                  <line x1={s(0)} x2={s(0)} y1={50} y2={230} stroke={C.ink} />
                  <line x1={s(-3)} y1={sy(-3)} x2={s(3)} y2={sy(3)} stroke={C.faint} strokeDasharray="4 3" />
                  <path d={path(pts)} fill="none" stroke={fn.color} strokeWidth={3} />
                  <foreignObject x={ox + 10} y={238} width={190} height={40}>
                    <div style={{ fontSize: 12, color: C.muted, textAlign: 'center', lineHeight: 1.35 }}>{fn.note}</div>
                  </foreignObject>
                </g>
              )
            })}
            <Badge x={320} y={44} anchor="middle">
              λ = {fmt(lam)}
            </Badge>
          </Svg>
        )
      }}
    />
  )
}
