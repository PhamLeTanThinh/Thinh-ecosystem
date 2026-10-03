'use client'

import { Axes, Badge, C, Label, Svg, VizFrame, ease, fmt, gauss, lerp, normalPdf, path, phase, rng, scale, seg } from './core'

// ── Một đường thẳng không đủ: dữ liệu dạng vòng, đường thẳng xoay mãi không tách được ─
export function OneLineNotEnough() {
  const r = rng(81)
  const pts: [number, number, number][] = Array.from({ length: 90 }, (_, i) => {
    const inner = i % 2 === 0
    const a = r() * Math.PI * 2
    const rad = inner ? r() * 1.1 : 1.9 + r() * 0.9
    return [Math.cos(a) * rad, Math.sin(a) * rad, inner ? 1 : 0]
  })
  const sx = scale(-3.2, 3.2, 30, 330)
  const sy = scale(-3.2, 3.2, 290, 10)
  const acc = (a: number, c: number) => {
    // tỉ lệ đúng tốt nhất khi phân loại theo một phía của đường thẳng
    const side = pts.map(([x, y]) => x * Math.cos(a) + y * Math.sin(a) > c)
    const k = pts.reduce((s, p, i) => s + (side[i] === (p[2] === 1) ? 1 : 0), 0)
    return Math.max(k, pts.length - k) / pts.length
  }
  return (
    <VizFrame
      label="Một đường thẳng không tách được dữ liệu dạng vòng, nhiều nơ-ron thì được"
      still={8.5}
      render={(t) => {
        const p = phase(t, 11)
        const curved = p > 0.62
        const a = p * Math.PI * 3
        const c = 0.6 * Math.sin(p * 9)
        const nx = Math.cos(a)
        const ny = Math.sin(a)
        const line = [
          [c * nx - 5 * ny, c * ny + 5 * nx],
          [c * nx + 5 * ny, c * ny - 5 * nx],
        ]
        const growR = ease(seg(p, 0.62, 0.75))
        return (
          <Svg w={640} h={300}>
            <defs>
              <clipPath id="clip-oneline">
                <rect x={30} y={10} width={300} height={280} />
              </clipPath>
            </defs>
            <rect x={30} y={10} width={300} height={280} fill="none" stroke={C.faint} />
            {pts.map(([x, y, cl], i) => (
              <circle key={i} cx={sx(x)} cy={sy(y)} r={4.5} fill={cl ? C.orange : C.blue} />
            ))}
            {!curved && <line x1={sx(line[0][0])} y1={sy(line[0][1])} x2={sx(line[1][0])} y2={sy(line[1][1])} stroke={C.ink} strokeWidth={2.5} clipPath="url(#clip-oneline)" />}
            {curved && <circle cx={sx(0)} cy={sy(0)} r={growR * 1.5 * (sx(1) - sx(0))} fill={C.orange} opacity={0.12} stroke={C.green} strokeWidth={3} />}
            <g transform="translate(355 70)">
              {!curved ? (
                <>
                  <Label x={0} y={0} weight={700}>
                    1 đường thẳng (1 nơ-ron tuyến tính)
                  </Label>
                  <Badge x={0} y={32} color={C.red}>
                    đúng tối đa ~{Math.round(acc(a, c) * 100)}%
                  </Badge>
                  <Label x={0} y={62} size={12} color={C.muted}>
                    xoay kiểu gì cũng không tách được
                  </Label>
                  <Label x={0} y={80} size={12} color={C.muted}>
                    vòng trong (cam) khỏi vòng ngoài (xanh)
                  </Label>
                </>
              ) : (
                <>
                  <Label x={0} y={0} weight={700} color={C.green}>
                    Nhiều nơ-ron + activation
                  </Label>
                  <Badge x={0} y={32} color={C.green}>
                    ranh giới cong → đúng ~100%
                  </Badge>
                  <Label x={0} y={62} size={12} color={C.muted}>
                    ghép nhiều “hàm nhỏ” lại thì mô tả
                  </Label>
                  <Label x={0} y={80} size={12} color={C.muted}>
                    được ranh giới phức tạp
                  </Label>
                </>
              )}
            </g>
          </Svg>
        )
      }}
    />
  )
}

// ── Một nơ-ron tính toán: y = ReLU(w·x + b) ─────────────────────────────────────
export function NeuronCompute() {
  const w = [0.8, -0.5, 0.6]
  const b = -0.4
  return (
    <VizFrame
      label="Một nơ-ron: nhân đầu vào với trọng số, cộng bias, qua activation"
      still={3}
      render={(t) => {
        const ph = phase(t, 8)
        const x = [1 + Math.sin(ph * 2 * Math.PI) * 0.9, 0.6 + Math.cos(ph * 2 * Math.PI * 2) * 0.6, 0.9 + Math.sin(ph * 2 * Math.PI + 1.3) * 0.8]
        const z = w.reduce((s, wi, i) => s + wi * x[i], 0) + b
        const y = Math.max(0, z)
        const pulse = (t * 1.2) % 1
        return (
          <Svg w={640} h={260}>
            {x.map((xi, i) => {
              const yy = 50 + i * 80
              return (
                <g key={i}>
                  <line x1={110} y1={yy} x2={330} y2={130} stroke={w[i] > 0 ? C.green : C.red} strokeWidth={1 + Math.abs(w[i]) * 5} opacity={0.5} />
                  <circle cx={lerp(110, 330, pulse)} cy={lerp(yy, 130, pulse)} r={4} fill={C.ink} />
                  <circle cx={80} cy={yy} r={26} fill="#eef3fd" stroke={C.blue} strokeWidth={2} />
                  <Badge x={80} y={yy + 5} anchor="middle" color={C.blue}>
                    {fmt(xi, 1)}
                  </Badge>
                  <Label x={40} y={yy + 5} anchor="end" size={12} color={C.muted}>
                    x{i + 1}
                  </Label>
                  <Badge x={lerp(110, 330, 0.45)} y={lerp(yy, 130, 0.45) - 8} anchor="middle" color={w[i] > 0 ? C.green : C.red}>
                    w={fmt(w[i], 1)}
                  </Badge>
                </g>
              )
            })}
            <circle cx={370} cy={130} r={40} fill="#fff" stroke={C.ink} strokeWidth={2} />
            <text x={370} y={128} textAnchor="middle" fontSize={20} fill={C.ink}>
              Σ
            </text>
            <text x={370} y={150} textAnchor="middle" fontSize={11} fill={C.muted}>
              + b ({fmt(b, 1)})
            </text>
            <line x1={410} y1={130} x2={470} y2={130} stroke={C.ink} strokeWidth={2} markerEnd="url(#viz-arrow)" />
            <rect x={475} y={105} width={64} height={50} rx={8} fill="#fdf1e4" stroke={C.orange} />
            <text x={507} y={135} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.orange}>
              ReLU
            </text>
            <line x1={539} y1={130} x2={585} y2={130} stroke={C.ink} strokeWidth={2} markerEnd="url(#viz-arrow)" />
            <Badge x={612} y={135} anchor="middle" color={y > 0 ? C.green : C.muted}>
              {fmt(y)}
            </Badge>
            <Badge x={320} y={245} anchor="middle">
              z = {w.map((wi, i) => `${fmt(wi, 1)}·${fmt(x[i], 1)}`).join(' + ')} {fmt(b, 1)} = {fmt(z)} → ReLU = {fmt(y)} {y === 0 ? '(nơ-ron “tắt”)' : ''}
            </Badge>
          </Svg>
        )
      }}
    />
  )
}

// ── Activation functions: một z chạy chung qua 4 hàm ────────────────────────────
export function ActivationSweep() {
  const fns = [
    { name: 'Sigmoid', f: (z: number) => 1 / (1 + Math.exp(-z)), lo: -0.2, hi: 1.2, color: C.orange },
    { name: 'Tanh', f: Math.tanh, lo: -1.2, hi: 1.2, color: C.purple },
    { name: 'ReLU', f: (z: number) => Math.max(0, z), lo: -1, hi: 5, color: C.green },
    { name: 'Leaky ReLU', f: (z: number) => (z > 0 ? z : 0.1 * z), lo: -1, hi: 5, color: C.teal },
  ]
  return (
    <VizFrame
      label="Giá trị đầu ra của các activation function khi z thay đổi"
      still={6}
      render={(t) => {
        const z = 5 * Math.sin(phase(t, 9) * 2 * Math.PI)
        return (
          <Svg w={640} h={250}>
            {fns.map((fn, j) => {
              const ox = j * 160
              const sx = scale(-5, 5, ox + 12, ox + 148)
              const sy = scale(fn.lo, fn.hi, 190, 40)
              const pts: [number, number][] = []
              for (let v = -5; v <= 5.001; v += 0.1) pts.push([sx(v), sy(fn.f(v))])
              const out = fn.f(z)
              return (
                <g key={fn.name}>
                  <Label x={ox + 80} y={22} anchor="middle" weight={700} color={fn.color}>
                    {fn.name}
                  </Label>
                  <line x1={ox + 12} x2={ox + 148} y1={sy(0)} y2={sy(0)} stroke={C.faint} />
                  <line x1={sx(0)} x2={sx(0)} y1={40} y2={190} stroke={C.faint} />
                  <path d={path(pts)} fill="none" stroke={fn.color} strokeWidth={3} />
                  <line x1={sx(z)} x2={sx(z)} y1={40} y2={190} stroke={C.ink} strokeDasharray="3 3" opacity={0.5} />
                  <circle cx={sx(z)} cy={sy(out)} r={6} fill={C.ink} />
                  <Badge x={ox + 80} y={215} anchor="middle" color={fn.color}>
                    → {fmt(out)}
                  </Badge>
                </g>
              )
            })}
            <Badge x={320} y={244} anchor="middle">
              z = {fmt(z)}
            </Badge>
          </Svg>
        )
      }}
    />
  )
}

// ── Bias dịch đường thẳng: không có bias thì buộc qua gốc toạ độ ─────────────────
export function BiasShift() {
  const r = rng(91)
  const pts: [number, number, number][] = Array.from({ length: 40 }, (_, i) => {
    const c = i % 2
    return [1 + r() * 4, c ? 3.6 + r() * 2.2 : 0.4 + r() * 2.2, c]
  })
  const sx = scale(0, 6, 50, 390)
  const sy = scale(0, 6.5, 270, 20)
  return (
    <VizFrame
      label="Bias giúp dịch đường quyết định thay vì buộc đi qua gốc toạ độ"
      still={8}
      render={(t) => {
        const p = phase(t, 10)
        const withBias = p > 0.5
        // y = 0,05x + b: trước nửa chu kỳ b = 0 (đường xoay quanh gốc), sau đó b tăng dần
        const slope = withBias ? 0.05 : lerp(1.6, 0.1, 0.5 - 0.5 * Math.cos(seg(p, 0, 0.5) * 2 * Math.PI))
        const b = withBias ? lerp(0, 2.95, ease(seg(p, 0.55, 0.85))) : 0
        const wrong = pts.filter(([x, y, c]) => (y > slope * x + b ? 1 : 0) !== c).length
        return (
          <Svg w={640} h={290}>
            <Axes x0={50} y0={270} x1={390} y1={20} />
            <circle cx={sx(0)} cy={sy(0)} r={5} fill={C.ink} />
            {pts.map(([x, y, c], i) => (
              <circle key={i} cx={sx(x)} cy={sy(y)} r={5} fill={c ? C.orange : C.blue} />
            ))}
            <defs>
              <clipPath id="clip-bias">
                <rect x={50} y={20} width={340} height={250} />
              </clipPath>
            </defs>
            <line x1={sx(0)} y1={sy(b)} x2={sx(6)} y2={sy(slope * 6 + b)} stroke={withBias ? C.green : C.red} strokeWidth={3} clipPath="url(#clip-bias)" />
            <g transform="translate(415 70)">
              <Badge x={0} y={0} color={withBias ? C.green : C.red}>
                {withBias ? 'Có bias' : 'Không có bias (b = 0)'}
              </Badge>
              <Badge x={0} y={28} color={C.muted}>
                y = {fmt(slope)}·x + {fmt(b)}
              </Badge>
              <Badge x={0} y={56} color={wrong ? C.red : C.green}>
                phân loại sai: {wrong} điểm
              </Badge>
              <Label x={0} y={92} size={12} color={C.muted}>
                {withBias ? 'bias "nhấc" đường lên đúng chỗ' : 'đường chỉ xoay được quanh gốc'}
              </Label>
              <Label x={0} y={110} size={12} color={C.muted}>
                {withBias ? 'giữa hai nhóm' : 'nên không tách được hai nhóm'}
              </Label>
            </g>
          </Svg>
        )
      }}
    />
  )
}

// ── Lan truyền xuôi / ngược trong mạng nhiều lớp ────────────────────────────────
const LAYERS = [3, 5, 5, 2]
function netPos(l: number, i: number): [number, number] {
  const n = LAYERS[l]
  return [70 + l * 150, 140 + (i - (n - 1) / 2) * 48]
}
function NetViz({ backward, dropout }: { backward: boolean; dropout: boolean }) {
  const r = rng(101)
  const weights = LAYERS.slice(0, -1).map((n, l) => Array.from({ length: n }, () => Array.from({ length: LAYERS[l + 1] }, () => gauss(r))))
  return (
    <VizFrame
      label={dropout ? 'Dropout tắt ngẫu nhiên một số nơ-ron ở mỗi bước train' : backward ? 'Lan truyền xuôi rồi lan truyền ngược' : 'Lan truyền xuôi qua các lớp của mạng'}
      still={3}
      render={(t) => {
        const per = backward ? 6 : 4
        const p = phase(t, per)
        const step = Math.max(0, Math.floor(t / per))
        // Dropout: chọn lại nơ-ron bị tắt mỗi bước
        const dr = rng(500 + step)
        const off = LAYERS.map((n, l) => Array.from({ length: n }, () => dropout && l > 0 && l < LAYERS.length - 1 && dr() < 0.4))
        const fwd = backward ? seg(p, 0, 0.45) : seg(p, 0, 0.9)
        const bwd = backward ? seg(p, 0.55, 1) : 0
        const front = fwd * (LAYERS.length - 1) // vị trí sóng xuôi (theo lớp)
        const back = (1 - bwd) * (LAYERS.length - 1)
        return (
          <Svg w={640} h={290}>
            {weights.map((m, l) =>
              m.map((row, i) =>
                row.map((wv, j) => {
                  const [x1, y1] = netPos(l, i)
                  const [x2, y2] = netPos(l + 1, j)
                  const dead = off[l][i] || off[l + 1][j]
                  const lit = !dead && front >= l + 1 && fwd < 1.01
                  const blit = !dead && bwd > 0 && back <= l
                  return <line key={`${l}-${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={blit ? C.red : lit ? C.blue : C.faint} strokeWidth={dead ? 0.6 : 1 + Math.abs(wv) * 1.2} opacity={dead ? 0.25 : blit || lit ? 0.75 : 0.5} />
                }),
              ),
            )}
            {/* chấm chạy dọc cạnh */}
            {!backward || fwd < 1
              ? LAYERS.slice(0, -1).map((n, l) => {
                  const k = front - l
                  if (k <= 0 || k >= 1) return null
                  return Array.from({ length: n }, (_, i) => {
                    if (off[l][i]) return null
                    const [x1, y1] = netPos(l, i)
                    const [x2, y2] = netPos(l + 1, Math.min(i, LAYERS[l + 1] - 1))
                    return <circle key={`p${l}-${i}`} cx={lerp(x1, x2, k)} cy={lerp(y1, y2, k)} r={4} fill={C.blue} />
                  })
                })
              : null}
            {LAYERS.map((n, l) =>
              Array.from({ length: n }, (_, i) => {
                const [x, y] = netPos(l, i)
                const dead = off[l][i]
                const active = front >= l && !dead
                const bact = bwd > 0 && back <= l && !dead
                return (
                  <g key={`n${l}-${i}`}>
                    <circle cx={x} cy={y} r={15} fill={dead ? '#f1f1f4' : bact ? '#fde7e5' : active ? '#e6eefc' : '#fff'} stroke={dead ? C.faint : bact ? C.red : active ? C.blue : C.muted} strokeWidth={2} />
                    {dead && (
                      <text x={x} y={y + 6} textAnchor="middle" fontSize={18} fill={C.red}>
                        ✕
                      </text>
                    )}
                  </g>
                )
              }),
            )}
            {['Lớp vào', 'Lớp ẩn 1', 'Lớp ẩn 2', 'Lớp ra'].map((name, l) => (
              <Label key={name} x={70 + l * 150} y={282} anchor="middle" size={12} color={C.muted}>
                {name}
              </Label>
            ))}
            <Badge x={320} y={22} anchor="middle" color={bwd > 0 ? C.red : C.blue}>
              {dropout ? `Bước train ${step + 1}: các nơ-ron ✕ bị tắt ngẫu nhiên (40%)` : bwd > 0 ? '← Backward: lan truyền gradient ngược để cập nhật weight' : backward && fwd >= 1 ? 'Tính loss: so dự đoán với đáp án' : 'Forward: dữ liệu đi qua từng lớp →'}
            </Badge>
          </Svg>
        )
      }}
    />
  )
}
export function ForwardPass() {
  return <NetViz backward={false} dropout={false} />
}
export function ForwardBackward() {
  return <NetViz backward dropout={false} />
}
export function DropoutNet() {
  return <NetViz backward={false} dropout />
}

// ── Hiệu năng theo lượng dữ liệu: ML truyền thống vs mạng nơ-ron ─────────────────
export function DlPerformance() {
  const curves = [
    { name: 'Mạng nơ-ron lớn', color: C.blue, f: (d: number) => 0.95 * (1 - Math.exp(-d / 3.2)) },
    { name: 'Mạng nơ-ron vừa', color: C.green, f: (d: number) => 0.72 * (1 - Math.exp(-d / 2.2)) },
    { name: 'Mạng nơ-ron nhỏ', color: C.orange, f: (d: number) => 0.6 * (1 - Math.exp(-d / 1.6)) },
    { name: 'ML truyền thống', color: C.red, f: (d: number) => 0.52 * (1 - Math.exp(-d / 1.1)) },
  ]
  const sx = scale(0, 10, 50, 470)
  const sy = scale(0, 1, 260, 25)
  return (
    <VizFrame
      label="Hiệu năng theo lượng dữ liệu của ML truyền thống và mạng nơ-ron các cỡ"
      still={8}
      render={(t) => {
        const d = Math.max(0.05, seg(phase(t, 9), 0.05, 0.85) * 10)
        return (
          <Svg w={640} h={290}>
            <Axes x0={50} y0={260} x1={470} y1={25} xLabel="lượng dữ liệu" yLabel="hiệu năng" />
            {curves.map((c) => {
              const pts: [number, number][] = []
              for (let v = 0; v <= d + 0.0001; v += 0.05) pts.push([sx(v), sy(c.f(v))])
              return (
                <g key={c.name}>
                  <path d={path(pts)} fill="none" stroke={c.color} strokeWidth={3} />
                  <circle cx={sx(d)} cy={sy(c.f(d))} r={4.5} fill={c.color} />
                </g>
              )
            })}
            {curves.map((c, i) => (
              <g key={c.name} transform={`translate(490 ${60 + i * 28})`}>
                <rect width={20} height={4} y={-5} fill={c.color} rx={2} />
                <Label x={28} y={0} size={12}>
                  {c.name}
                </Label>
              </g>
            ))}
            {d > 6 && (
              <>
                <Label x={490} y={200} size={12} color={C.muted}>
                  ML truyền thống
                </Label>
                <Label x={490} y={218} size={12} color={C.muted}>
                  chững lại sớm
                </Label>
              </>
            )}
          </Svg>
        )
      }}
    />
  )
}

// ── Tích chập: bộ lọc 3×3 trượt trên ảnh, tạo bản đồ đặc trưng ─────────────────
export function ConvolutionSlide() {
  // Ảnh 8×8 có một nét dọc và một nét ngang
  const img = Array.from({ length: 8 }, (_, y) => Array.from({ length: 8 }, (_, x) => (x === 2 && y >= 1 && y <= 6 ? 1 : y === 5 && x >= 3 && x <= 6 ? 1 : 0)))
  const k = [
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1],
  ] // phát hiện cạnh dọc
  const out = Array.from({ length: 6 }, (_, y) => Array.from({ length: 6 }, (_, x) => k.reduce((s, row, i) => s + row.reduce((a, kv, j) => a + kv * img[y + i][x + j], 0), 0)))
  const cs = 26
  return (
    <VizFrame
      label="Bộ lọc tích chập 3×3 trượt trên ảnh và tạo bản đồ đặc trưng"
      still={8}
      render={(t) => {
        const n = Math.floor(seg(phase(t, 12), 0.03, 0.9) * 36)
        const pos = Math.min(35, n)
        const px = pos % 6
        const py = Math.floor(pos / 6)
        const cur = out[py][px]
        return (
          <Svg w={640} h={280}>
            <Label x={30 + 4 * cs} y={22} anchor="middle" weight={700}>
              Ảnh đầu vào 8×8
            </Label>
            {img.map((row, y) =>
              row.map((v, x) => <rect key={`${x}-${y}`} x={30 + x * cs} y={35 + y * cs} width={cs - 2} height={cs - 2} rx={3} fill={v ? C.ink : '#eef0f4'} />),
            )}
            <rect x={30 + px * cs - 2} y={35 + py * cs - 2} width={3 * cs + 2} height={3 * cs + 2} rx={4} fill={C.orange} opacity={0.25} stroke={C.orange} strokeWidth={3} />
            <Label x={300} y={22} anchor="middle" weight={700}>
              Bộ lọc
            </Label>
            {k.map((row, y) =>
              row.map((v, x) => (
                <g key={`k${x}-${y}`}>
                  <rect x={262 + x * cs} y={40 + y * cs} width={cs - 2} height={cs - 2} rx={3} fill={v > 0 ? '#e3f4ea' : v < 0 ? '#fde7e5' : '#f4f4f6'} stroke={C.orange} />
                  <text x={262 + x * cs + cs / 2 - 1} y={40 + y * cs + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
                    {v}
                  </text>
                </g>
              )),
            )}
            <Label x={300} y={145} anchor="middle" size={12} color={C.muted}>
              (phát hiện cạnh dọc)
            </Label>
            <Badge x={300} y={185} anchor="middle" color={C.orange}>
              Σ (ô × bộ lọc) = {cur}
            </Badge>
            <Label x={430 + 3 * cs} y={22} anchor="middle" weight={700}>
              Bản đồ đặc trưng 6×6
            </Label>
            {out.map((row, y) =>
              row.map((v, x) => {
                const idx = y * 6 + x
                const shown = idx <= pos
                const col = v > 0 ? C.green : v < 0 ? C.red : '#eef0f4'
                return (
                  <g key={`o${x}-${y}`}>
                    <rect x={430 + x * cs} y={35 + y * cs} width={cs - 2} height={cs - 2} rx={3} fill={shown ? col : '#fafafb'} opacity={shown ? 0.25 + Math.min(1, Math.abs(v) / 3) * 0.75 : 1} stroke={idx === pos ? C.orange : 'none'} strokeWidth={2} />
                    {shown && v !== 0 && (
                      <text x={430 + x * cs + cs / 2 - 1} y={35 + y * cs + 17} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">
                        {v}
                      </text>
                    )}
                  </g>
                )
              }),
            )}
            <Label x={320} y={270} anchor="middle" size={12} color={C.muted}>
              Ô đậm màu = chỗ ảnh có cạnh dọc; nét ngang gần như không được “nhìn thấy”
            </Label>
          </Svg>
        )
      }}
    />
  )
}

// ── RNN đọc từng từ, mang theo trạng thái ẩn ───────────────────────────────────
export function RnnUnroll() {
  const words = ['Cà phê', 'nóng', 'quá', 'nên', 'chưa', '…']
  const r = rng(111)
  const states = words.map(() => Array.from({ length: 6 }, () => r()))
  return (
    <VizFrame
      label="RNN đọc câu từng từ một, trạng thái ẩn mang thông tin sang bước sau"
      still={9}
      render={(t) => {
        const p = phase(t, 11)
        const n = Math.min(words.length, Math.floor(seg(p, 0.03, 0.85) * (words.length + 0.999)))
        const done = p > 0.86
        return (
          <Svg w={640} h={270}>
            {words.map((w, i) => {
              const x = 55 + i * 105
              const on = i < n
              return (
                <g key={i} opacity={on ? 1 : 0.25}>
                  <rect x={x - 38} y={190} width={76} height={34} rx={8} fill="#eef3fd" stroke={C.blue} />
                  <text x={x} y={212} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.blue}>
                    {w}
                  </text>
                  <line x1={x} y1={190} x2={x} y2={148} stroke={C.ink} markerEnd="url(#viz-arrow)" />
                  <rect x={x - 32} y={92} width={64} height={52} rx={10} fill="#fff" stroke={C.ink} strokeWidth={2} />
                  {states[i].map((v, j) => (
                    <rect key={j} x={x - 26 + j * 9} y={128 - v * 28} width={7} height={v * 28} fill={on ? C.purple : C.faint} rx={1.5} />
                  ))}
                  {i < words.length - 1 && <line x1={x + 32} y1={118} x2={x + 72} y2={118} stroke={on && i + 1 < n ? C.purple : C.faint} strokeWidth={3} markerEnd="url(#viz-arrow)" />}
                </g>
              )
            })}
            <Label x={30} y={80} size={12} color={C.purple} weight={700}>
              trạng thái ẩn h (bộ nhớ) truyền sang phải →
            </Label>
            <Label x={30} y={250} size={12} color={C.muted}>
              Cùng một khối (cùng weight) lặp lại ở mỗi bước thời gian
            </Label>
            {done && (
              <Badge x={480} y={40} anchor="middle" color={C.green}>
                Dự đoán từ tiếp theo: “uống” (nhớ cà phê + nóng)
              </Badge>
            )}
          </Svg>
        )
      }}
    />
  )
}

// ── GAN (1 chiều): phân phối giả của Generator dần khớp phân phối thật ───────────
export function GanDistribution() {
  const sx = scale(-1, 9, 40, 600)
  const sy = scale(0, 0.55, 240, 30)
  const curve = (mu: number, sd: number) => {
    const pts: [number, number][] = []
    for (let x = -1; x <= 9.001; x += 0.05) pts.push([sx(x), sy(normalPdf(x, mu, sd))])
    return path(pts)
  }
  return (
    <VizFrame
      label="GAN: phân phối của dữ liệu giả dần khớp với dữ liệu thật"
      still={8}
      render={(t) => {
        const p = phase(t, 11)
        const k = ease(seg(p, 0.05, 0.8))
        const mu = lerp(1.2, 5.5, k) + Math.sin(t * 3) * 0.15 * (1 - k)
        const sd = lerp(0.6, 1.1, k)
        // Discriminator: xác suất “thật” ~ pdata / (pdata + pfake)
        const dpts: [number, number][] = []
        for (let x = -1; x <= 9.001; x += 0.05) {
          const a = normalPdf(x, 5.5, 1.1)
          const b = normalPdf(x, mu, sd)
          dpts.push([sx(x), sy((a / (a + b + 1e-9)) * 0.5)])
        }
        return (
          <Svg w={640} h={290}>
            <line x1={40} x2={600} y1={240} y2={240} stroke={C.ink} />
            <path d={curve(5.5, 1.1)} fill={C.green} fillOpacity={0.15} stroke={C.green} strokeWidth={3} />
            <path d={curve(mu, sd)} fill={C.red} fillOpacity={0.12} stroke={C.red} strokeWidth={3} />
            <path d={path(dpts)} fill="none" stroke={C.blue} strokeWidth={2} strokeDasharray="6 4" />
            <g transform="translate(40 268)">
              <rect width={18} height={4} y={-5} fill={C.green} />
              <Label x={24} y={0} size={12}>
                dữ liệu thật
              </Label>
              <rect x={130} width={18} height={4} y={-5} fill={C.red} />
              <Label x={154} y={0} size={12}>
                dữ liệu giả (Generator)
              </Label>
              <rect x={330} width={18} height={4} y={-5} fill={C.blue} />
              <Label x={354} y={0} size={12}>
                Discriminator: khả năng là “thật”
              </Label>
            </g>
            <Badge x={600} y={30} anchor="end" color={k > 0.95 ? C.green : C.muted}>
              {k > 0.95 ? 'Cân bằng: Discriminator chỉ còn đoán 50/50' : `Vòng train ${Math.round(k * 5000)}`}
            </Badge>
          </Svg>
        )
      }}
    />
  )
}

// ── Diffusion: thêm nhiễu dần rồi khử nhiễu từng bước ──────────────────────────
export function DiffusionNoise() {
  const S = 16
  // Ảnh mặt cười 16×16
  const img = Array.from({ length: S }, (_, y) =>
    Array.from({ length: S }, (_, x) => {
      const d = Math.hypot(x - 7.5, y - 7.5)
      const eye = Math.hypot(x - 5, y - 5.5) < 1.3 || Math.hypot(x - 10, y - 5.5) < 1.3
      const mouth = y >= 9 && y <= 11 && Math.abs(Math.hypot(x - 7.5, y - 6.5) - 4) < 0.9
      return d < 7.4 ? (eye || mouth ? 0.05 : 0.85) : 0.97
    }),
  )
  const r = rng(121)
  const noise = img.map((row) => row.map(() => gauss(r)))
  return (
    <VizFrame
      label="Diffusion: thêm nhiễu dần cho tới khi thành nhiễu hoàn toàn, rồi học cách khử nhiễu ngược lại"
      still={3}
      render={(t) => {
        const p = phase(t, 10)
        const forward = p < 0.5
        const level = forward ? ease(seg(p, 0.05, 0.45)) : 1 - ease(seg(p, 0.55, 0.95))
        const cs = 12
        const steps = Math.round(level * 1000)
        return (
          <Svg w={640} h={250}>
            <g transform="translate(40 30)">
              {img.map((row, y) =>
                row.map((v, x) => {
                  const g = Math.max(0, Math.min(1, Math.sqrt(1 - level) * v + Math.sqrt(level) * (0.5 + 0.35 * noise[y][x])))
                  const c = Math.round(g * 255)
                  return <rect key={`${x}-${y}`} x={x * cs} y={y * cs} width={cs} height={cs} fill={`rgb(${c},${Math.round(c * 0.96)},${Math.round(c * 0.85)})`} />
                }),
              )}
            </g>
            <g transform="translate(270 60)">
              <Badge x={0} y={0} color={forward ? C.red : C.green}>
                {forward ? 'Quá trình thuận: thêm nhiễu →' : '← Quá trình ngược: model khử nhiễu'}
              </Badge>
              <Badge x={0} y={30} color={C.muted}>
                bước nhiễu t = {steps} / 1000
              </Badge>
              <rect x={0} y={46} width={300} height={12} rx={4} fill={C.grid} />
              <rect x={0} y={46} width={300 * level} height={12} rx={4} fill={forward ? C.red : C.green} />
              <Label x={0} y={92} size={12} color={C.muted}>
                Khi train: model học đoán phần nhiễu đã thêm vào.
              </Label>
              <Label x={0} y={110} size={12} color={C.muted}>
                Khi sinh ảnh: bắt đầu từ nhiễu ngẫu nhiên và
              </Label>
              <Label x={0} y={128} size={12} color={C.muted}>
                khử nhiễu từng bước cho tới khi ra ảnh rõ.
              </Label>
            </g>
          </Svg>
        )
      }}
    />
  )
}
