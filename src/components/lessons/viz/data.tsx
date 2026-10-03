'use client'

import { Badge, C, Label, Svg, VizFrame, ease, fmt, gauss, lerp, mod, path, phase, rng, scale, seg } from './core'

// ── Điền giá trị thiếu cho chuỗi thời gian: lần lượt từng phương pháp ───────────
export function TimeseriesFill() {
  const r = rng(17)
  const N = 48
  const truth = Array.from({ length: N }, (_, i) => 40 + 22 * Math.sin(i / 5) + 10 * Math.sin(i / 1.7) + gauss(r) * 4)
  const missing = new Set<number>()
  for (const [a, b] of [
    [6, 9],
    [17, 18],
    [24, 30],
    [36, 37],
    [41, 43],
  ])
    for (let i = a; i <= b; i++) missing.add(i)
  const known = truth.map((v, i) => (missing.has(i) ? null : v))
  const prevKnown = (i: number) => {
    for (let j = i; j >= 0; j--) if (known[j] !== null) return j
    return -1
  }
  const nextKnown = (i: number) => {
    for (let j = i; j < N; j++) if (known[j] !== null) return j
    return -1
  }
  const methods: { name: string; color: string; fill: (i: number) => number }[] = [
    { name: 'Forward fill — lấy giá trị liền trước', color: C.green, fill: (i) => known[prevKnown(i)]! },
    { name: 'Backward fill — lấy giá trị liền sau', color: C.red, fill: (i) => known[nextKnown(i)]! },
    {
      name: 'Linear — nối thẳng hai đầu khoảng trống',
      color: C.purple,
      fill: (i) => {
        const a = prevKnown(i)
        const b = nextKnown(i)
        return lerp(known[a]!, known[b]!, (i - a) / (b - a))
      },
    },
    {
      name: 'Quadratic — nối bằng đường cong (có thể vọt quá)',
      color: C.orange,
      fill: (i) => {
        // Đa thức bậc 2 đi qua 2 điểm trước khoảng trống và 1 điểm sau
        const a = prevKnown(i)
        const b = nextKnown(i)
        const a2 = prevKnown(a - 1) >= 0 ? prevKnown(a - 1) : a
        const X = [a2, a, b]
        const Y = X.map((x) => known[x]!)
        const L = (k: number) => X.reduce((p, xj, j) => (j === k ? p : (p * (i - xj)) / (X[k] - xj)), 1)
        return X[0] === X[1] ? lerp(Y[1], Y[2], (i - a) / (b - a)) : Y.reduce((s, y, k) => s + y * L(k), 0)
      },
    },
    {
      name: 'Nearest — lấy giá trị đã biết gần nhất',
      color: C.teal,
      fill: (i) => {
        const a = prevKnown(i)
        const b = nextKnown(i)
        return i - a <= b - i ? known[a]! : known[b]!
      },
    },
  ]
  const sx = scale(0, N - 1, 30, 610)
  const sy = scale(-5, 90, 230, 30)
  return (
    <VizFrame
      label="Các cách điền giá trị thiếu trong chuỗi thời gian"
      still={4}
      render={(t) => {
        const per = 4
        const m = methods[mod(Math.floor(t / per), methods.length)]
        const reveal = ease(seg(phase(t, per), 0.1, 0.6)) * N // điền dần từ trái sang phải
        // Các đoạn dữ liệu có thật
        const segs: [number, number][][] = []
        let cur: [number, number][] = []
        known.forEach((v, i) => {
          if (v === null) {
            if (cur.length) segs.push(cur)
            cur = []
          } else cur.push([sx(i), sy(v)])
        })
        if (cur.length) segs.push(cur)
        const filled = [...missing].filter((i) => i < reveal)
        return (
          <Svg w={640} h={270}>
            <line x1={30} x2={610} y1={230} y2={230} stroke={C.ink} />
            {[...missing].map((i) => (
              <rect key={`g${i}`} x={sx(i) - 6} y={30} width={12} height={200} fill={C.grid} />
            ))}
            {segs.map((s, i) => (
              <path key={i} d={path(s)} fill="none" stroke={C.blue} strokeWidth={2} />
            ))}
            {known.map((v, i) => (v === null ? null : <circle key={i} cx={sx(i)} cy={sy(v)} r={3.5} fill={C.blue} />))}
            {/* Đoạn nối giá trị điền với dữ liệu thật */}
            {filled.map((i) => {
              const a = known[i - 1] !== null ? [sx(i - 1), sy(known[i - 1]!)] : [sx(i - 1), sy(m.fill(i - 1))]
              return <line key={`l${i}`} x1={a[0]} y1={a[1]} x2={sx(i)} y2={sy(m.fill(i))} stroke={m.color} strokeWidth={2} strokeDasharray="3 2" />
            })}
            {filled.map((i) => {
              const nk = nextKnown(i)
              return i + 1 === nk ? <line key={`e${i}`} x1={sx(i)} y1={sy(m.fill(i))} x2={sx(nk)} y2={sy(known[nk]!)} stroke={m.color} strokeWidth={2} strokeDasharray="3 2" /> : null
            })}
            {filled.map((i) => (
              <circle key={`f${i}`} cx={sx(i)} cy={sy(m.fill(i))} r={4.5} fill={m.color} />
            ))}
            <Badge x={30} y={22} color={m.color}>
              {m.name}
            </Badge>
            <Label x={610} y={252} anchor="end" size={12} color={C.muted}>
              cột xám = thời điểm bị thiếu dữ liệu
            </Label>
          </Svg>
        )
      }}
    />
  )
}

// ── DBSCAN: cụm lan dần từ các điểm lõi ──────────────────────────────────────────
export function DbscanGrow() {
  const r = rng(23)
  const pts: [number, number][] = []
  const blob = (cx: number, cy: number, n: number, s: number) => {
    for (let i = 0; i < n; i++) pts.push([cx + gauss(r) * s, cy + gauss(r) * s])
  }
  blob(2, 2, 26, 0.45)
  blob(6, 3.2, 26, 0.5)
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI
    pts.push([4 + 2.3 * Math.cos(a) + gauss(r) * 0.12, 5.6 + 0.8 * Math.sin(a) + gauss(r) * 0.12])
  }
  pts.push([0.4, 5.6], [8.6, 0.6], [4.2, 0.4], [8.4, 6.2], [0.8, 0.2])
  const eps = 0.62
  const minPts = 4
  const nb = pts.map((p) => pts.map((q, j) => [j, Math.hypot(p[0] - q[0], p[1] - q[1])] as const).filter(([, d]) => d <= eps).map(([j]) => j))
  const core = nb.map((n) => n.length >= minPts)
  // Mở rộng cụm (BFS) và ghi lại thứ tự gán nhãn để chạy hoạt ảnh
  const label = new Array(pts.length).fill(-1)
  const order: { i: number; c: number }[] = []
  let cid = 0
  for (let i = 0; i < pts.length; i++) {
    if (label[i] !== -1 || !core[i]) continue
    const queue = [i]
    label[i] = cid
    order.push({ i, c: cid })
    while (queue.length) {
      const p = queue.shift()!
      if (!core[p]) continue
      for (const q of nb[p])
        if (label[q] === -1) {
          label[q] = cid
          order.push({ i: q, c: cid })
          queue.push(q)
        }
    }
    cid++
  }
  const cols = [C.blue, C.orange, C.green, C.purple]
  const sx = scale(0, 9, 30, 430)
  const sy = scale(0, 6.8, 270, 20)
  return (
    <VizFrame
      label="DBSCAN mở rộng cụm từ các điểm lõi, điểm lẻ loi là nhiễu"
      still={8.5}
      render={(t) => {
        const p = phase(t, 10)
        const n = Math.floor(seg(p, 0.05, 0.78) * order.length)
        const assigned = new Map(order.slice(0, n).map((o) => [o.i, o.c]))
        const last = order[Math.max(0, n - 1)]
        const showNoise = p > 0.8
        return (
          <Svg w={640} h={290}>
            {n > 0 && n < order.length && <circle cx={sx(pts[last.i][0])} cy={sy(pts[last.i][1])} r={eps * (sx(1) - sx(0))} fill={cols[last.c % 4]} opacity={0.12} stroke={cols[last.c % 4]} />}
            {pts.map((pt, i) => {
              const c = assigned.get(i)
              const noise = showNoise && label[i] === -1
              return <circle key={i} cx={sx(pt[0])} cy={sy(pt[1])} r={noise ? 6 : core[i] && c !== undefined ? 5.5 : 4.5} fill={c !== undefined ? cols[c % 4] : noise ? C.red : C.faint} stroke={noise ? C.ink : 'none'} />
            })}
            <g transform="translate(450 60)">
              <Label x={0} y={0} weight={700}>
                eps = {fmt(eps)} · minPts = {minPts}
              </Label>
              <Label x={0} y={30} size={12} color={C.muted}>
                Điểm lõi: ≥ {minPts} điểm trong bán
              </Label>
              <Label x={0} y={48} size={12} color={C.muted}>
                kính eps. Cụm lan dần qua
              </Label>
              <Label x={0} y={66} size={12} color={C.muted}>
                các điểm lõi kề nhau.
              </Label>
              <Badge x={0} y={90} color={C.ink}>
                Đã gán: {n}/{order.length} điểm
              </Badge>
              {showNoise && (
                <Badge x={0} y={118} color={C.red}>
                  ● {label.filter((l) => l === -1).length} điểm nhiễu (outlier)
                </Badge>
              )}
            </g>
          </Svg>
        )
      }}
    />
  )
}

// ── Isolation Forest: cắt ngẫu nhiên tới khi cô lập được điểm cần xét ──────────
function isolate(pts: [number, number][], target: number, seed: number) {
  const r = rng(seed)
  let box = { x0: 0, x1: 10, y0: 0, y1: 10 }
  let inside = pts.map((_, i) => i)
  const cuts: { x?: number; y?: number; box: typeof box }[] = []
  let tries = 0 // chặn vòng lặp vô hạn nếu các điểm trùng nhau
  while (inside.length > 1 && cuts.length < 40 && tries++ < 400) {
    const vertical = r() < 0.5
    const lo = vertical ? Math.min(...inside.map((i) => pts[i][0])) : Math.min(...inside.map((i) => pts[i][1]))
    const hi = vertical ? Math.max(...inside.map((i) => pts[i][0])) : Math.max(...inside.map((i) => pts[i][1]))
    if (hi - lo < 1e-6) continue
    const v = lo + r() * (hi - lo)
    cuts.push(vertical ? { x: v, box: { ...box } } : { y: v, box: { ...box } })
    const tv = vertical ? pts[target][0] : pts[target][1]
    if (vertical) box = tv < v ? { ...box, x1: v } : { ...box, x0: v }
    else box = tv < v ? { ...box, y1: v } : { ...box, y0: v }
    inside = inside.filter((i) => {
      const p = pts[i]
      return p[0] >= box.x0 && p[0] <= box.x1 && p[1] >= box.y0 && p[1] <= box.y1
    })
  }
  return { cuts, final: box }
}

export function IsolationCuts() {
  const r = rng(29)
  const pts: [number, number][] = Array.from({ length: 50 }, () => [4.5 + gauss(r) * 1.1, 4.8 + gauss(r) * 1.1])
  pts.push([9.2, 1.0]) // outlier
  const outlier = pts.length - 1
  // Điểm bình thường: điểm gần tâm nhất
  const normal = pts.reduce((m, p, i) => (Math.hypot(p[0] - 4.5, p[1] - 4.8) < Math.hypot(pts[m][0] - 4.5, pts[m][1] - 4.8) ? i : m), 0)
  const A = isolate(pts, outlier, 3)
  const B = isolate(pts, normal, 3)
  const panel = (ox: number, title: string, run: ReturnType<typeof isolate>, target: number, color: string, t: number) => {
    const sx = scale(0, 10, ox + 15, ox + 295)
    const sy = scale(0, 10, 265, 45)
    const total = Math.max(A.cuts.length, B.cuts.length)
    const n = Math.min(run.cuts.length, Math.floor(seg(phase(t, 11), 0.05, 0.8) * (total + 1)))
    const doneNow = n >= run.cuts.length
    return (
      <g>
        <Label x={ox + 155} y={18} anchor="middle" weight={700} color={color}>
          {title}
        </Label>
        <rect x={sx(0)} y={sy(10)} width={sx(10) - sx(0)} height={sy(0) - sy(10)} fill="none" stroke={C.faint} />
        {run.cuts.slice(0, n).map((c, i) =>
          c.x !== undefined ? (
            <line key={i} x1={sx(c.x)} x2={sx(c.x)} y1={sy(c.box.y0)} y2={sy(c.box.y1)} stroke={C.ink} strokeWidth={1.3} opacity={0.75} />
          ) : (
            <line key={i} y1={sy(c.y!)} y2={sy(c.y!)} x1={sx(c.box.x0)} x2={sx(c.box.x1)} stroke={C.ink} strokeWidth={1.3} opacity={0.75} />
          ),
        )}
        {doneNow && <rect x={sx(run.final.x0)} y={sy(run.final.y1)} width={sx(run.final.x1) - sx(run.final.x0)} height={sy(run.final.y0) - sy(run.final.y1)} fill={color} opacity={0.18} />}
        {pts.map((p, i) => (
          <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r={i === target ? 7 : 3.5} fill={i === target ? color : C.faint} stroke={i === target ? C.ink : 'none'} />
        ))}
        <Badge x={ox + 155} y={38} anchor="middle" color={doneNow ? color : C.muted}>
          {n} nhát cắt {doneNow ? '→ đã cô lập!' : '…'}
        </Badge>
      </g>
    )
  }
  return (
    <VizFrame
      label="Isolation Forest: số nhát cắt ngẫu nhiên cần để cô lập outlier và điểm bình thường"
      still={9}
      render={(t) => (
        <Svg w={640} h={280}>
          {panel(0, 'Cô lập outlier', A, outlier, C.red, t)}
          {panel(325, 'Cô lập điểm bình thường', B, normal, C.blue, t)}
        </Svg>
      )}
    />
  )
}

// ── PCA: trục xoay dò hướng có variance lớn nhất ────────────────────────────────
export function PcaRotate() {
  const r = rng(37)
  const a0 = (30 * Math.PI) / 180
  const pts: [number, number][] = Array.from({ length: 60 }, () => {
    const u = gauss(r) * 1.6
    const v = gauss(r) * 0.45
    return [u * Math.cos(a0) - v * Math.sin(a0), u * Math.sin(a0) + v * Math.cos(a0)]
  })
  const varAlong = (a: number) => pts.reduce((s, [x, y]) => s + (x * Math.cos(a) + y * Math.sin(a)) ** 2, 0) / pts.length
  const maxVar = varAlong(a0)
  const sx = scale(-4, 4, 30, 400)
  const sy = (v: number) => 150 - v * ((400 - 30) / 8)
  return (
    <VizFrame
      label="PCA tìm hướng mà dữ liệu trải rộng nhất"
      still={7}
      render={(t) => {
        const p = phase(t, 10)
        const sweep = seg(p, 0.02, 0.62)
        const a = lerp(a0 - Math.PI * 0.85, a0, ease(sweep)) // quét rồi dừng ở PC1
        const locked = p > 0.62
        const v = varAlong(a)
        const ux = Math.cos(a)
        const uy = Math.sin(a)
        return (
          <Svg w={640} h={300}>
            <line x1={sx(-4.5 * ux)} y1={sy(-4.5 * uy)} x2={sx(4.5 * ux)} y2={sy(4.5 * uy)} stroke={locked ? C.red : C.ink} strokeWidth={2.5} />
            {locked && <line x1={sx(-1.6 * -uy)} y1={sy(-1.6 * ux)} x2={sx(1.6 * -uy)} y2={sy(1.6 * ux)} stroke={C.orange} strokeWidth={2.5} />}
            {pts.map(([x, y], i) => {
              const d = x * ux + y * uy
              return (
                <g key={i}>
                  <line x1={sx(x)} y1={sy(y)} x2={sx(d * ux)} y2={sy(d * uy)} stroke={C.faint} strokeWidth={1} />
                  <circle cx={sx(x)} cy={sy(y)} r={4} fill={C.blue} opacity={0.75} />
                  <circle cx={sx(d * ux)} cy={sy(d * uy)} r={2.6} fill={locked ? C.red : C.ink} />
                </g>
              )
            })}
            {locked && (
              <>
                <Label x={sx(4.3 * ux)} y={sy(4.3 * uy) - 8} color={C.red} weight={700}>
                  PC1
                </Label>
                <Label x={sx(1.7 * -uy) + 4} y={sy(1.7 * ux)} color={C.orange} weight={700}>
                  PC2
                </Label>
              </>
            )}
            <g transform="translate(430 70)">
              <Label x={0} y={0} weight={700}>
                Variance khi chiếu lên trục
              </Label>
              <rect x={0} y={14} width={180} height={18} rx={4} fill={C.grid} />
              <rect x={0} y={14} width={180 * (v / maxVar)} height={18} rx={4} fill={locked ? C.red : C.blue} />
              <Badge x={0} y={56}>
                {fmt(v)} / tối đa {fmt(maxVar)}
              </Badge>
              <Label x={0} y={90} size={12} color={C.muted}>
                Chấm đen = vị trí điểm khi chiếu
              </Label>
              <Label x={0} y={108} size={12} color={C.muted}>
                xuống trục. Trục làm các chấm
              </Label>
              <Label x={0} y={126} size={12} color={C.muted}>
                trải rộng nhất chính là PC1.
              </Label>
              {locked && (
                <Badge x={0} y={160} color={C.red}>
                  Giữ PC1 = giữ {Math.round((maxVar / (maxVar + varAlong(a0 + Math.PI / 2))) * 100)}% thông tin
                </Badge>
              )}
            </g>
          </Svg>
        )
      }}
    />
  )
}

// ── t-SNE: điểm từ vị trí ngẫu nhiên dần tụ thành cụm (minh hoạ) ────────────────
export function TsneConverge() {
  const r = rng(43)
  const centers: [number, number][] = [
    [-2.2, 1.4],
    [2.1, 1.6],
    [0.2, -1.8],
    [-2.6, -1.6],
    [2.6, -1.2],
  ]
  const cols = [C.blue, C.orange, C.green, C.purple, C.red]
  const pts = Array.from({ length: 110 }, (_, i) => {
    const c = i % 5
    return { c, start: [gauss(r) * 2, gauss(r) * 1.6] as [number, number], end: [centers[c][0] + gauss(r) * 0.42, centers[c][1] + gauss(r) * 0.42] as [number, number], delay: r() * 0.25 }
  })
  const sx = scale(-4, 4, 40, 440)
  const sy = scale(-3, 3, 270, 20)
  return (
    <VizFrame
      label="t-SNE sắp xếp các điểm thành cụm sau nhiều vòng lặp (minh hoạ)"
      still={7}
      render={(t) => {
        const p = phase(t, 10)
        return (
          <Svg w={640} h={290}>
            {pts.map((pt, i) => {
              const k = ease(seg(p, 0.08 + pt.delay * 0.4, 0.7 + pt.delay * 0.3))
              const x = lerp(pt.start[0], pt.end[0], k)
              const y = lerp(pt.start[1], pt.end[1], k)
              return <circle key={i} cx={sx(x)} cy={sy(y)} r={4.5} fill={cols[pt.c]} opacity={0.8} />
            })}
            <g transform="translate(460 80)">
              <Badge x={0} y={0}>
                Vòng lặp {Math.round(seg(p, 0.08, 0.9) * 1000)}
              </Badge>
              <Label x={0} y={34} size={12} color={C.muted}>
                Màu = nhãn thật (t-SNE không
              </Label>
              <Label x={0} y={52} size={12} color={C.muted}>
                biết nhãn). Điểm giống nhau ở
              </Label>
              <Label x={0} y={70} size={12} color={C.muted}>
                không gian nhiều chiều được
              </Label>
              <Label x={0} y={88} size={12} color={C.muted}>
                kéo lại gần nhau trên 2D.
              </Label>
            </g>
          </Svg>
        )
      }}
    />
  )
}
