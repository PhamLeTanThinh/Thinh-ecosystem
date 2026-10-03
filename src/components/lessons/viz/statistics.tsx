'use client'

import { Axes, Badge, C, Label, Svg, VizFrame, clamp, ease, fmt, gauss, lerp, normalCdf, normalPdf, path, phase, rng, scale, seg } from './core'

// ── Correlation: đám điểm biến đổi liên tục từ r = −1 tới r = +1 ────────────────
export function CorrelationMorph() {
  const r0 = rng(5)
  const n = 90
  const xs = Array.from({ length: n }, () => gauss(r0))
  const es = Array.from({ length: n }, () => gauss(r0))
  // Chuẩn hoá e để không tương quan với x (Gram–Schmidt) → r hiển thị đúng bằng r mục tiêu
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const xc = xs.map((v) => v - mx)
  const sxx = xc.reduce((a, b) => a + b * b, 0)
  const proj = es.reduce((a, e, i) => a + e * xc[i], 0) / sxx
  const ec = es.map((e, i) => e - proj * xc[i])
  const me = ec.reduce((a, b) => a + b, 0) / n
  const ee = ec.map((v) => v - me)
  const sx0 = Math.sqrt(sxx / n)
  const se0 = Math.sqrt(ee.reduce((a, b) => a + b * b, 0) / n)
  const sx = scale(-3, 3, 60, 360)
  const sy = scale(-3, 3, 270, 30)
  return (
    <VizFrame
      label="Đám điểm thay đổi theo hệ số tương quan r từ −1 đến +1"
      still={2.5}
      render={(t) => {
        const r = Math.cos(phase(t, 12) * 2 * Math.PI) // +1 → −1 → +1
        const k = Math.sqrt(Math.max(0, 1 - r * r))
        const color = r > 0.05 ? C.blue : r < -0.05 ? C.red : C.muted
        const desc = Math.abs(r) >= 0.9 ? 'rất mạnh' : Math.abs(r) >= 0.7 ? 'mạnh' : Math.abs(r) >= 0.5 ? 'vừa' : Math.abs(r) >= 0.2 ? 'yếu' : 'gần như không tương quan'
        return (
          <Svg w={640} h={290}>
            <Axes x0={60} y0={270} x1={360} y1={30} xLabel="X" yLabel="Y" />
            {xc.map((x, i) => {
              const xv = x / sx0
              const yv = r * xv + k * (ee[i] / se0)
              return <circle key={i} cx={sx(xv * 0.95)} cy={sy(clamp(yv, -3, 3) * 0.95)} r={4} fill={color} opacity={0.75} />
            })}
            <Label x={410} y={80} color={C.muted}>
              Hệ số tương quan
            </Label>
            <text x={410} y={130} fontSize={44} fontWeight={800} fill={color} style={{ fontVariantNumeric: 'tabular-nums' }}>
              r = {fmt(r)}
            </text>
            <Label x={410} y={162} weight={700} color={color}>
              {Math.abs(r) < 0.2 ? desc : `tương quan ${r > 0 ? 'thuận' : 'nghịch'} ${desc}`}
            </Label>
            {/* Thanh −1 … 1 */}
            <line x1={410} x2={610} y1={210} y2={210} stroke={C.faint} strokeWidth={6} strokeLinecap="round" />
            <circle cx={lerp(410, 610, (r + 1) / 2)} cy={210} r={9} fill={color} />
            <Label x={410} y={236} color={C.muted} size={12}>
              −1
            </Label>
            <Label x={510} y={236} color={C.muted} size={12} anchor="middle">
              0
            </Label>
            <Label x={610} y={236} color={C.muted} size={12} anchor="end">
              +1
            </Label>
          </Svg>
        )
      }}
    />
  )
}

// ── Kiểm định hai phía: thống kê z di chuyển, p-value đổi theo ───────────────────
export function TwoTailedTest() {
  const sx = scale(-4, 4, 40, 600)
  const sy = scale(0, 0.42, 230, 30)
  const curve: [number, number][] = []
  for (let x = -4; x <= 4.001; x += 0.05) curve.push([sx(x), sy(normalPdf(x))])
  const tail = (from: number, to: number) => {
    const pts: [number, number][] = [[sx(from), sy(0)]]
    for (let x = from; x <= to + 1e-9; x += 0.04) pts.push([sx(x), sy(normalPdf(x))])
    pts.push([sx(to), sy(0)])
    return path(pts) + 'Z'
  }
  return (
    <VizFrame
      label="Kiểm định hai phía: thống kê z và p-value"
      still={3}
      render={(t) => {
        const z = 3.3 * Math.sin(phase(t, 12) * 2 * Math.PI)
        const p = 2 * (1 - normalCdf(Math.abs(z)))
        const reject = Math.abs(z) > 1.96
        const az = Math.abs(z)
        return (
          <Svg w={640} h={300}>
            {/* Vùng bác bỏ cố định (α = 0,05) */}
            <path d={tail(-4, -1.96)} fill={C.red} opacity={0.18} />
            <path d={tail(1.96, 4)} fill={C.red} opacity={0.18} />
            {/* p-value = diện tích 2 đuôi ngoài |z| */}
            {az < 3.95 && <path d={tail(az, 4)} fill={reject ? C.red : C.orange} opacity={0.55} />}
            {az < 3.95 && <path d={tail(-4, -az)} fill={reject ? C.red : C.orange} opacity={0.55} />}
            <path d={path(curve)} fill="none" stroke={C.blue} strokeWidth={3} />
            <line x1={40} x2={600} y1={230} y2={230} stroke={C.ink} strokeWidth={1.5} />
            {[-1.96, 1.96].map((c) => (
              <g key={c}>
                <line x1={sx(c)} x2={sx(c)} y1={230} y2={120} stroke={C.red} strokeDasharray="4 3" />
                <Label x={sx(c)} y={248} anchor="middle" color={C.red} size={12}>
                  {fmt(c)}
                </Label>
              </g>
            ))}
            <Label x={sx(-3.2)} y={150} anchor="middle" color={C.red} size={12}>
              vùng bác bỏ 2,5%
            </Label>
            <Label x={sx(3.2)} y={150} anchor="middle" color={C.red} size={12}>
              vùng bác bỏ 2,5%
            </Label>
            {/* Thống kê kiểm định */}
            <line x1={sx(z)} x2={sx(z)} y1={230} y2={40} stroke={C.ink} strokeWidth={2} />
            <circle cx={sx(z)} cy={230} r={6} fill={C.ink} />
            <Badge x={sx(z)} y={32} anchor="middle">
              z = {fmt(z)}
            </Badge>
            <Badge x={320} y={278} anchor="middle" color={reject ? C.red : C.green}>
              p-value = {p < 0.001 ? '< 0,001' : fmt(p, 3)} → {reject ? 'p < 0,05: bác bỏ H0' : 'p ≥ 0,05: chưa bác bỏ H0'}
            </Badge>
          </Svg>
        )
      }}
    />
  )
}

// ── Z-score: một điểm chạy dọc phân phối chuẩn ─────────────────────────────────
export function ZScoreBell() {
  const sx = scale(-4, 4, 40, 600)
  const sy = scale(0, 0.42, 220, 30)
  const curve: [number, number][] = []
  for (let x = -4; x <= 4.001; x += 0.05) curve.push([sx(x), sy(normalPdf(x))])
  const band = (a: number, b: number) => {
    const pts: [number, number][] = [[sx(a), sy(0)]]
    for (let x = a; x <= b + 1e-9; x += 0.05) pts.push([sx(x), sy(normalPdf(x))])
    pts.push([sx(b), sy(0)])
    return path(pts) + 'Z'
  }
  return (
    <VizFrame
      label="Z-score của một điểm dữ liệu trên phân phối chuẩn"
      still={2}
      render={(t) => {
        const z = 3.8 * Math.sin(phase(t, 11) * 2 * Math.PI)
        const out = Math.abs(z) > 3
        const height = 165 + 10 * z // ví dụ chiều cao: trung bình 165, độ lệch chuẩn 10
        return (
          <Svg w={640} h={300}>
            <path d={band(-1, 1)} fill={C.green} opacity={0.22} />
            <path d={band(-2, -1)} fill={C.yellow} opacity={0.25} />
            <path d={band(1, 2)} fill={C.yellow} opacity={0.25} />
            <path d={band(-3, -2)} fill={C.orange} opacity={0.25} />
            <path d={band(2, 3)} fill={C.orange} opacity={0.25} />
            <path d={band(-4, -3)} fill={C.red} opacity={0.3} />
            <path d={band(3, 4)} fill={C.red} opacity={0.3} />
            <path d={path(curve)} fill="none" stroke={C.blue} strokeWidth={3} />
            <line x1={40} x2={600} y1={220} y2={220} stroke={C.ink} strokeWidth={1.5} />
            {[-3, -2, -1, 0, 1, 2, 3].map((v) => (
              <Label key={v} x={sx(v)} y={238} anchor="middle" color={C.muted} size={12}>
                {v === 0 ? 'mean' : `${v > 0 ? '+' : ''}${v}σ`}
              </Label>
            ))}
            <Label x={sx(0)} y={130} anchor="middle" color={C.green} size={12}>
              68%
            </Label>
            <Label x={sx(-3.5)} y={200} anchor="middle" color={C.red} size={12}>
              outlier
            </Label>
            <Label x={sx(3.5)} y={200} anchor="middle" color={C.red} size={12}>
              outlier
            </Label>
            <circle cx={sx(z)} cy={sy(normalPdf(z)) - 2} r={8} fill={out ? C.red : C.ink} />
            <line x1={sx(z)} x2={sx(z)} y1={sy(normalPdf(z)) + 6} y2={220} stroke={out ? C.red : C.ink} strokeDasharray="3 3" />
            <Badge x={320} y={270} anchor="middle" color={out ? C.red : C.ink}>
              chiều cao {Math.round(height)} cm → z = ({Math.round(height)} − 165) / 10 = {fmt(z, 1)} {out ? '→ |z| > 3: OUTLIER' : ''}
            </Badge>
          </Svg>
        )
      }}
    />
  )
}

// ── Standardization: dời về trung bình 0 rồi co giãn để độ lệch chuẩn = 1 ───────
export function Standardization() {
  const r = rng(21)
  const raw = Array.from({ length: 70 }, () => 60 + 15 * gauss(r))
  const mean = raw.reduce((a, b) => a + b, 0) / raw.length
  const sd = Math.sqrt(raw.reduce((a, b) => a + (b - mean) ** 2, 0) / raw.length)
  const sx = scale(-80, 120, 30, 610)
  const rows = raw.map((v, i) => 40 + (i % 7) * 10) // xếp chồng cho dễ nhìn
  return (
    <VizFrame
      label="Standardization: trừ trung bình rồi chia độ lệch chuẩn"
      still={6.5}
      render={(t) => {
        const p = phase(t, 10)
        const a = ease(seg(p, 0.12, 0.35)) // bước 1: trừ mean
        const b = ease(seg(p, 0.5, 0.73)) // bước 2: chia std (phóng to ×20 để nhìn được)
        const show = (v: number) => {
          const shifted = v - a * mean
          const scaled = lerp(shifted, (shifted / sd) * 20, b)
          return scaled
        }
        const m = show(mean)
        const s1 = show(mean + sd) - m
        const stage = b > 0.99 ? 'Bước 2: chia độ lệch chuẩn → mean = 0, std = 1' : a > 0.99 ? 'Bước 1: trừ trung bình → tâm về 0' : 'Dữ liệu gốc: mean ≈ 60, std ≈ 15'
        return (
          <Svg w={640} h={250}>
            <line x1={30} x2={610} y1={130} y2={130} stroke={C.ink} strokeWidth={1.5} />
            <line x1={sx(0)} x2={sx(0)} y1={30} y2={140} stroke={C.muted} strokeDasharray="4 3" />
            <Label x={sx(0)} y={156} anchor="middle" color={C.muted} size={12}>
              0
            </Label>
            {raw.map((v, i) => (
              <circle key={i} cx={sx(show(v))} cy={rows[i]} r={4.5} fill={C.blue} opacity={0.7} />
            ))}
            {/* mean và ±1 std */}
            <line x1={sx(m)} x2={sx(m)} y1={30} y2={130} stroke={C.red} strokeWidth={2} />
            <line x1={sx(m - s1)} x2={sx(m + s1)} y1={118} y2={118} stroke={C.orange} strokeWidth={3} />
            <Label x={sx(m)} y={24} anchor="middle" color={C.red} size={12}>
              mean
            </Label>
            <Label x={sx(m + s1) + 6} y={122} color={C.orange} size={12}>
              ±1 std
            </Label>
            <Badge x={320} y={196} anchor="middle">
              {stage}
            </Badge>
            <Label x={320} y={222} anchor="middle" color={C.muted} size={12}>
              {b > 0.5 ? '(trục đã phóng to ×20 để dễ nhìn — hình dạng phân phối giữ nguyên)' : 'z = (x − mean) / std'}
            </Label>
          </Svg>
        )
      }}
    />
  )
}

// ── Boxplot dựng dần: xếp dữ liệu → Q1, median, Q3 → râu → outlier ─────────────
export function BoxplotBuild() {
  const r = rng(8)
  const data = [...Array.from({ length: 34 }, () => 50 + 9 * gauss(r)), 12, 95, 103].sort((x, y) => x - y)
  const q = (p: number) => {
    const i = (data.length - 1) * p
    const lo = Math.floor(i)
    return lerp(data[lo], data[Math.ceil(i)], i - lo)
  }
  const q1 = q(0.25)
  const med = q(0.5)
  const q3 = q(0.75)
  const iqr = q3 - q1
  const lo = q1 - 1.5 * iqr
  const hi = q3 + 1.5 * iqr
  const wLo = data.find((v) => v >= lo)!
  const wHi = [...data].reverse().find((v) => v <= hi)!
  const sx = scale(0, 110, 30, 610)
  const jit = data.map(() => (r() - 0.5) * 50)
  return (
    <VizFrame
      label="Dựng boxplot: Q1, median, Q3, râu và outlier"
      still={8}
      render={(t) => {
        const p = phase(t, 11)
        const sorted = ease(seg(p, 0.05, 0.18)) // dồn điểm về 1 hàng
        const sMed = seg(p, 0.22, 0.3)
        const sBox = seg(p, 0.32, 0.42)
        const sWhisk = seg(p, 0.46, 0.56)
        const sOut = seg(p, 0.6, 0.68)
        const step = sOut > 0 ? 'Điểm ngoài khoảng Q1 − 1,5·IQR … Q3 + 1,5·IQR = outlier' : sWhisk > 0 ? 'Râu kéo tới giá trị bình thường xa nhất (trong 1,5·IQR)' : sBox > 0 ? 'Hộp từ Q1 (25%) đến Q3 (75%) — độ dài hộp là IQR' : sMed > 0 ? 'Median: giá trị chính giữa' : 'Dữ liệu: 37 giá trị'
        return (
          <Svg w={640} h={250}>
            <line x1={30} x2={610} y1={190} y2={190} stroke={C.ink} strokeWidth={1.5} />
            {[0, 20, 40, 60, 80, 100].map((v) => (
              <Label key={v} x={sx(v)} y={208} anchor="middle" color={C.muted} size={12}>
                {v}
              </Label>
            ))}
            {sBox > 0 && <rect x={sx(q1)} y={90} width={(sx(q3) - sx(q1)) * sBox} height={60} fill={C.lightBlue} opacity={0.5} stroke={C.blue} strokeWidth={2} />}
            {sWhisk > 0 && (
              <g stroke={C.ink} strokeWidth={2} opacity={sWhisk}>
                <line x1={sx(q1)} x2={lerp(sx(q1), sx(wLo), sWhisk)} y1={120} y2={120} />
                <line x1={sx(q3)} x2={lerp(sx(q3), sx(wHi), sWhisk)} y1={120} y2={120} />
                <line x1={sx(wLo)} x2={sx(wLo)} y1={105} y2={135} />
                <line x1={sx(wHi)} x2={sx(wHi)} y1={105} y2={135} />
              </g>
            )}
            {data.map((v, i) => {
              const isOut = v < lo || v > hi
              return <circle key={i} cx={sx(v)} cy={lerp(120 + jit[i], 120, sorted)} r={isOut && sOut > 0 ? 7 : 4.5} fill={isOut && sOut > 0 ? C.red : C.blue} opacity={0.75} />
            })}
            {sMed > 0 && <line x1={sx(med)} x2={sx(med)} y1={lerp(120, 85, sMed)} y2={lerp(120, 155, sMed)} stroke={C.yellow} strokeWidth={4} />}
            {sBox > 0.9 && (
              <g>
                <Label x={sx(q1)} y={80} anchor="middle" size={12} color={C.blue}>
                  Q1
                </Label>
                <Label x={sx(med)} y={80} anchor="middle" size={12} color={C.yellow}>
                  median
                </Label>
                <Label x={sx(q3)} y={80} anchor="middle" size={12} color={C.blue}>
                  Q3
                </Label>
              </g>
            )}
            <Badge x={320} y={238} anchor="middle">
              {step}
            </Badge>
          </Svg>
        )
      }}
    />
  )
}
