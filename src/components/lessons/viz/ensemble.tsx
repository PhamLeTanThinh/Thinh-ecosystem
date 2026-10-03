'use client'

import { Axes, Badge, C, Label, Svg, VizFrame, ease, fmt, gauss, lerp, path, phase, rng, scale, seg } from './core'

const BALL = [C.blue, C.orange, C.green, C.purple, C.red]
const NAMES = ['A', 'B', 'C', 'D', 'E']

// ── Bootstrap: rút có hoàn lại từ A–E, mẫu không được rút là OOB ─────────────────
export function BootstrapDraw() {
  const r = rng(52)
  const draws = Array.from({ length: 3 }, () => Array.from({ length: 5 }, () => Math.floor(r() * 5)))
  const total = 15
  return (
    <VizFrame
      label="Lấy mẫu bootstrap có hoàn lại và các mẫu Out-of-Bag"
      still={10}
      render={(t) => {
        const p = phase(t, 12)
        const prog = seg(p, 0.06, 0.82) * total
        const done = Math.floor(prog)
        const f = ease(prog - done)
        const ball = (cx: number, cy: number, k: number, op = 1) => (
          <g opacity={op}>
            <circle cx={cx} cy={cy} r={16} fill={BALL[k]} />
            <text x={cx} y={cy + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="#fff">
              {NAMES[k]}
            </text>
          </g>
        )
        return (
          <Svg w={640} h={300}>
            <Label x={30} y={36} weight={700}>
              Dữ liệu gốc
            </Label>
            {NAMES.map((_, k) => (
              <g key={k}>{ball(150 + k * 44, 30, k)}</g>
            ))}
            <Label x={400} y={36} size={12} color={C.muted}>
              rút xong lại bỏ vào (có hoàn lại)
            </Label>
            {draws.map((row, b) => {
              const y = 100 + b * 64
              const rowDone = done >= (b + 1) * 5
              const oob = NAMES.map((_, k) => k).filter((k) => !row.includes(k))
              return (
                <g key={b}>
                  <Label x={30} y={y + 6} weight={700} color={C.muted}>
                    Bootstrap {b + 1}
                  </Label>
                  {row.map((k, s) => {
                    const idx = b * 5 + s
                    if (idx > done) return <circle key={s} cx={150 + s * 44} cy={y} r={16} fill="none" stroke={C.faint} strokeDasharray="3 3" />
                    if (idx === done && prog < total) {
                      // bóng đang bay từ hàng gốc xuống
                      return <g key={s}>{ball(lerp(150 + k * 44, 150 + s * 44, f), lerp(30, y, f), k)}</g>
                    }
                    const dup = row.slice(0, s).includes(k)
                    return (
                      <g key={s}>
                        {ball(150 + s * 44, y, k)}
                        {dup && rowDone && (
                          <text x={150 + s * 44} y={y - 20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.red}>
                            lặp
                          </text>
                        )}
                      </g>
                    )
                  })}
                  {rowDone && (
                    <g>
                      <Label x={400} y={y + 5} size={13} color={C.muted}>
                        OOB:
                      </Label>
                      {oob.length ? oob.map((k, j) => <g key={k}>{ball(450 + j * 40, y, k, 0.45)}</g>) : <Label x={440} y={y + 5} size={12} color={C.muted}>(không có)</Label>}
                    </g>
                  )}
                </g>
              )
            })}
            <Badge x={30} y={290} color={C.muted}>
              Mỗi bootstrap chứa ~63% mẫu khác nhau; ~37% còn lại (OOB) dùng để đánh giá cây đó.
            </Badge>
          </Svg>
        )
      }}
    />
  )
}

// ── Bagging / Random Forest: dữ liệu → bootstrap → cây → bỏ phiếu ───────────────
function EnsembleFlowViz({ rf }: { rf: boolean }) {
  const votes = ['Spam', 'Không spam', 'Spam']
  const feats = ['X₁, X₄, X₇', 'X₂, X₅, X₉', 'X₃, X₄, X₈']
  return (
    <VizFrame
      label={rf ? 'Random Forest: mỗi cây dùng bootstrap và một tập feature ngẫu nhiên' : 'Bagging: các cây học song song rồi bỏ phiếu'}
      still={8.5}
      render={(t) => {
        const p = phase(t, 10)
        const s1 = seg(p, 0.05, 0.25) // dữ liệu → bootstrap
        const s2 = seg(p, 0.3, 0.5) // bootstrap → cây
        const s3 = seg(p, 0.55, 0.72) // cây → bỏ phiếu
        const final = p > 0.76
        const spam = votes.filter((v, i) => v === 'Spam' && s3 >= (i + 1) / 3).length
        const not = votes.filter((v, i) => v !== 'Spam' && s3 >= (i + 1) / 3).length
        return (
          <Svg w={640} h={290}>
            <rect x={20} y={97} width={100} height={70} rx={10} fill={C.blue} />
            <text x={70} y={129} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
              Dữ liệu
            </text>
            <text x={70} y={147} textAnchor="middle" fill="#fff" fontSize={12}>
              train
            </text>
            {[0, 1, 2].map((i) => {
              const y = 32 + i * 84
              const yc = y + 25
              return (
                <g key={i}>
                  <line x1={120} y1={132} x2={170} y2={yc} stroke={C.faint} strokeWidth={2} />
                  {s1 > 0 && s1 < 1 && <circle cx={lerp(120, 170, s1)} cy={lerp(132, yc, s1)} r={5} fill={C.blue} />}
                  <rect x={170} y={y} width={120} height={50} rx={8} fill="#eef3fd" stroke={C.lightBlue} />
                  <text x={230} y={y + 22} textAnchor="middle" fontSize={12} fill={C.blue} fontWeight={700}>
                    Bootstrap {i + 1}
                  </text>
                  {rf && (
                    <text x={230} y={y + 40} textAnchor="middle" fontSize={11} fill={C.orange}>
                      {feats[i]}
                    </text>
                  )}
                  <line x1={290} y1={yc} x2={340} y2={yc} stroke={C.faint} strokeWidth={2} />
                  {s2 > 0 && s2 < 1 && <circle cx={lerp(290, 340, s2)} cy={yc} r={5} fill={C.green} />}
                  <g opacity={s2 > 0.95 ? 1 : 0.35}>
                    <text x={360} y={yc + 8} fontSize={24}>
                      🌲
                    </text>
                    <text x={392} y={yc + 5} fontSize={13} fontWeight={700} fill={C.green}>
                      Cây {i + 1}
                    </text>
                  </g>
                  <line x1={455} y1={yc} x2={500} y2={132} stroke={C.faint} strokeWidth={2} />
                  {s3 >= (i + 1) / 3 && (
                    <text x={445} y={yc - 14} textAnchor="end" fontSize={12} fontWeight={700} fill={votes[i] === 'Spam' ? C.red : C.green}>
                      → {votes[i]}
                    </text>
                  )}
                </g>
              )
            })}
            <rect x={500} y={82} width={125} height={100} rx={10} fill={final ? C.orange : '#fdf1e4'} stroke={C.orange} />
            <text x={562} y={107} textAnchor="middle" fontSize={12} fontWeight={700} fill={final ? '#fff' : C.orange}>
              Bỏ phiếu
            </text>
            <text x={562} y={132} textAnchor="middle" fontSize={12} fill={final ? '#fff' : C.ink}>
              Spam: {spam} · Không: {not}
            </text>
            {final && (
              <text x={562} y={162} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">
                → SPAM
              </text>
            )}
            {rf && (
              <Label x={230} y={282} anchor="middle" size={12} color={C.orange}>
                mỗi cây chỉ xét một tập feature ngẫu nhiên
              </Label>
            )}
          </Svg>
        )
      }}
    />
  )
}
export function BaggingFlow() {
  return <EnsembleFlowViz rf={false} />
}
export function RandomForestFlow() {
  return <EnsembleFlowViz rf />
}

// ── OOB error theo số cây ───────────────────────────────────────────────────────
export function OobCurve() {
  const r = rng(61)
  const xs = Array.from({ length: 50 }, (_, i) => 10 + i * 10)
  const ys = xs.map((n) => 0.055 + 0.13 * Math.exp(-n / 38) + gauss(r) * 0.0025)
  const sx = scale(0, 500, 50, 560)
  const sy = scale(0, 0.2, 250, 30)
  return (
    <VizFrame
      label="OOB error giảm rồi đi ngang khi tăng số cây"
      still={8}
      render={(t) => {
        const p = phase(t, 9)
        const n = Math.max(1, Math.floor(seg(p, 0.05, 0.85) * xs.length))
        const pts = xs.slice(0, n).map((x, i) => [sx(x), sy(ys[i])] as [number, number])
        return (
          <Svg w={640} h={285}>
            {n > 18 && <rect x={sx(100)} y={30} width={sx(200) - sx(100)} height={220} fill={C.green} opacity={0.1} />}
            {n > 18 && (
              <Label x={sx(150)} y={46} anchor="middle" size={12} color={C.green} weight={700}>
                sweet spot 100–200 cây
              </Label>
            )}
            <Axes x0={50} y0={250} x1={560} y1={30} xLabel="số cây" yLabel="OOB error" />
            <path d={path(pts)} fill="none" stroke={C.blue} strokeWidth={3} />
            {pts.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={2.5} fill={C.blue} />
            ))}
            <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={6} fill={C.ink} />
            <Badge x={560} y={90} anchor="end">
              {xs[n - 1]} cây · OOB error = {fmt(ys[n - 1], 3)}
            </Badge>
            {n > 30 && (
              <Label x={560} y={116} anchor="end" size={12} color={C.muted}>
                thêm cây gần như không cải thiện — nhưng cũng không overfit
              </Label>
            )}
          </Svg>
        )
      }}
    />
  )
}

// ── AdaBoost: trọng số model α theo lỗi ε ──────────────────────────────────────
export function AdaboostAlpha() {
  const alpha = (e: number) => 0.5 * Math.log((1 - e) / e)
  const sx = scale(0, 1, 60, 470)
  const sy = scale(-2.6, 2.6, 260, 20)
  const pts: [number, number][] = []
  for (let e = 0.005; e <= 0.995; e += 0.005) pts.push([sx(e), sy(Math.max(-2.6, Math.min(2.6, alpha(e))))])
  return (
    <VizFrame
      label="Trọng số model α của AdaBoost thay đổi theo lỗi ε"
      still={2}
      render={(t) => {
        const e = 0.5 - 0.47 * Math.cos(phase(t, 10) * 2 * Math.PI)
        const a = alpha(e)
        const zone = e < 0.45 ? ['Model tốt → α dương, càng chính xác càng có tiếng nói lớn', C.green] : e <= 0.55 ? ['Như đoán bừa → α ≈ 0, gần như không đóng góp', C.orange] : ['Tệ hơn đoán bừa → α âm, dự đoán bị đảo ngược', C.red]
        return (
          <Svg w={640} h={290}>
            <line x1={60} x2={480} y1={sy(0)} y2={sy(0)} stroke={C.ink} />
            <line x1={60} x2={60} y1={20} y2={260} stroke={C.ink} />
            <line x1={sx(0.5)} x2={sx(0.5)} y1={20} y2={260} stroke={C.faint} strokeDasharray="4 3" />
            <Label x={470} y={sy(0) + 18} anchor="end" size={12} color={C.muted}>
              ε (lỗi)
            </Label>
            <Label x={66} y={30} size={12} color={C.muted}>
              α
            </Label>
            <Label x={sx(0.5)} y={275} anchor="middle" size={12} color={C.muted}>
              0,5
            </Label>
            <path d={path(pts)} fill="none" stroke={C.blue} strokeWidth={3} />
            <circle cx={sx(e)} cy={sy(Math.max(-2.6, Math.min(2.6, a)))} r={8} fill={zone[1]} stroke={C.ink} strokeWidth={1.5} />
            <g transform="translate(495 70)">
              <Badge x={0} y={0}>
                ε = {fmt(e)}
              </Badge>
              <Badge x={0} y={28} color={zone[1]}>
                α = ½·ln((1−ε)/ε) = {fmt(a)}
              </Badge>
              <foreignObject x={0} y={44} width={140} height={110}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: zone[1], lineHeight: 1.4 }}>{zone[0]}</div>
              </foreignObject>
            </g>
          </Svg>
        )
      }}
    />
  )
}

// ── Gradient Boosting thật: mỗi vòng thêm 1 stump fit residual ──────────────────
export function GradientBoostingFit() {
  const r = rng(71)
  const xs = Array.from({ length: 40 }, (_, i) => (i + r() * 0.8) * 0.25).sort((a, b) => a - b)
  const ys = xs.map((x) => Math.sin(x) * 1.6 + 2 + gauss(r) * 0.18)
  const M = 30
  const lr = 0.35
  const mean = ys.reduce((a, b) => a + b, 0) / ys.length
  const stumps: { s: number; l: number; rr: number }[] = []
  let F = ys.map(() => mean)
  const history: number[][] = [F]
  for (let m = 0; m < M; m++) {
    const res = ys.map((y, i) => y - F[i])
    let best = { sse: Infinity, s: 0, l: 0, rr: 0 }
    for (let k = 1; k < xs.length; k++) {
      const left = res.slice(0, k)
      const right = res.slice(k)
      const ml = left.reduce((a, b) => a + b, 0) / left.length
      const mr = right.reduce((a, b) => a + b, 0) / right.length
      const sse = left.reduce((a, b) => a + (b - ml) ** 2, 0) + right.reduce((a, b) => a + (b - mr) ** 2, 0)
      if (sse < best.sse) best = { sse, s: (xs[k - 1] + xs[k]) / 2, l: ml, rr: mr }
    }
    stumps.push(best)
    F = F.map((f, i) => f + lr * (xs[i] < best.s ? best.l : best.rr))
    history.push(F)
  }
  const predict = (x: number, m: number) => mean + stumps.slice(0, m).reduce((s, st) => s + lr * (x < st.s ? st.l : st.rr), 0)
  const sx = scale(0, 10, 50, 450)
  const sy = scale(-0.2, 4.2, 200, 20)
  return (
    <VizFrame
      label="Gradient Boosting: mỗi vòng thêm một cây nhỏ fit phần còn sai"
      still={9}
      render={(t) => {
        const m = Math.min(M, Math.floor(seg(phase(t, 11), 0.04, 0.85) * (M + 1)))
        const curve: [number, number][] = []
        for (let x = 0; x <= 10.001; x += 0.02) curve.push([sx(x), sy(predict(x, m))])
        const Fm = history[m]
        const mse = ys.reduce((s, y, i) => s + (y - Fm[i]) ** 2, 0) / ys.length
        const ry = (v: number) => 250 - v * 45
        return (
          <Svg w={640} h={290}>
            <Axes x0={50} y0={200} x1={450} y1={20} yLabel="y" />
            {xs.map((x, i) => (
              <circle key={i} cx={sx(x)} cy={sy(ys[i])} r={4} fill={C.ink} opacity={0.7} />
            ))}
            <path d={path(curve)} fill="none" stroke={C.orange} strokeWidth={3} />
            {/* residual từng điểm */}
            <line x1={50} x2={450} y1={250} y2={250} stroke={C.faint} />
            <Label x={52} y={284} size={12} color={C.muted}>
              residual của từng điểm
            </Label>
            {xs.map((x, i) => (
              <line key={`r${i}`} x1={sx(x)} x2={sx(x)} y1={250} y2={ry(ys[i] - Fm[i])} stroke={C.red} strokeWidth={3} opacity={0.8} />
            ))}
            <g transform="translate(470 60)">
              <Badge x={0} y={0}>
                Vòng {m} / {M}
              </Badge>
              <Badge x={0} y={28} color={C.red}>
                MSE = {fmt(mse, 3)}
              </Badge>
              <Label x={0} y={64} size={12} color={C.muted}>
                Vòng 0: đoán bằng trung bình.
              </Label>
              <Label x={0} y={82} size={12} color={C.muted}>
                Mỗi vòng: 1 stump học residual,
              </Label>
              <Label x={0} y={100} size={12} color={C.muted}>
                cộng thêm × learning rate {fmt(lr)}.
              </Label>
            </g>
          </Svg>
        )
      }}
    />
  )
}

// ── SHAP waterfall: cộng dồn đóng góp từng feature ─────────────────────────────
export function ShapWaterfall() {
  const base = 2.07
  const contrib: [string, number][] = [
    ['Thu nhập khu vực = 8,3', 0.92],
    ['Vĩ độ = 37,9', -0.53],
    ['Kinh độ = −122,2', 0.41],
    ['Tuổi nhà = 41', 0.12],
    ['Số phòng TB = 6,9', -0.08],
    ['Dân số = 322', 0.05],
  ]
  const fx = base + contrib.reduce((s, c) => s + c[1], 0)
  const sx = scale(1.4, 3.4, 220, 600)
  return (
    <VizFrame
      label="SHAP waterfall cộng dồn đóng góp của từng feature vào dự đoán"
      still={9}
      render={(t) => {
        const n = Math.floor(seg(phase(t, 10), 0.08, 0.8) * (contrib.length + 1))
        let acc = base
        return (
          <Svg w={640} h={300}>
            <line x1={sx(base)} x2={sx(base)} y1={20} y2={250} stroke={C.faint} strokeDasharray="4 3" />
            <Label x={sx(base)} y={268} anchor="middle" size={12} color={C.muted}>
              E[f(x)] = {fmt(base)} (trung bình)
            </Label>
            {contrib.map(([name, v], i) => {
              const from = acc
              acc += v
              const shown = i < n
              const y = 30 + i * 34
              return (
                <g key={name} opacity={shown ? 1 : 0.15}>
                  <Label x={210} y={y + 17} anchor="end" size={12}>
                    {name}
                  </Label>
                  <rect x={sx(Math.min(from, acc))} y={y + 4} width={Math.abs(sx(acc) - sx(from))} height={20} rx={3} fill={v > 0 ? C.red : C.blue} />
                  <Badge x={v > 0 ? sx(acc) + 6 : sx(acc) - 6} y={y + 19} anchor={v > 0 ? 'start' : 'end'} color={v > 0 ? C.red : C.blue}>
                    {v > 0 ? '+' : '−'}
                    {fmt(Math.abs(v))}
                  </Badge>
                </g>
              )
            })}
            {n > contrib.length - 1 && (
              <g>
                <line x1={sx(fx)} x2={sx(fx)} y1={20} y2={250} stroke={C.ink} strokeWidth={2} />
                <Badge x={sx(fx)} y={290} anchor="middle">
                  f(x) = {fmt(fx)} (dự đoán cho căn nhà này)
                </Badge>
              </g>
            )}
          </Svg>
        )
      }}
    />
  )
}
