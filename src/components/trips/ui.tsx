import { themeOf, type TripTheme } from '@/lib/trips/themes'
import type { Fund, FundKind } from '@/lib/trips/types'

// Mảnh giao diện "du lịch" dùng chung cho /trips (xem trips.css).

// Vòng xoay nhỏ đặt trong nút đang xử lý — màu theo chữ của nút
export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent align-[-2px] ${className}`}
      role="status"
      aria-label="Đang xử lý"
    />
  )
}

// Nội dung nút: đang bận thì thay bằng spinner + chữ đang làm (giữ nguyên bề rộng tương đối)
export function BusyLabel({ busy, label, children }: { busy: boolean; label?: string; children: React.ReactNode }) {
  if (!busy) return <>{children}</>
  return (
    <span className="inline-flex items-center justify-center gap-1.5">
      <Spinner />
      {label ?? children}
    </span>
  )
}

// Mã vé kiểu "TP-7KQ2" — lấy từ id cho ổn định, chỉ để trang trí
export function ticketCode(id: string) {
  const clean = id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  return `${clean.slice(0, 2)}-${clean.slice(-4)}`
}

// Chữ trên dải đầu vé: chuyến đi theo theme ("Boarding pass", "Road trip"...), quỹ góp thì theo loại quỹ
const KIND_TAG: Record<Exclude<FundKind, 'trip'>, string> = {
  fund: 'Group fund',
  other: 'Shared wallet',
}

export function ticketTag(fund: Fund) {
  return fund.kind === 'trip' ? themeOf(fund.theme).tag : KIND_TAG[fund.kind]
}

// Nhãn 2 mốc ngày: chuyến đi theo theme ("Khởi hành / Trở về", "Vào rừng / Xuống núi"...), quỹ góp là thời hạn gom
export function dateLabels(fund: Fund): [string, string] {
  return fund.kind === 'trip' ? themeOf(fund.theme).dateLabels : ['Bắt đầu gom', 'Hạn chót']
}

// Tiến độ gom tiền dạng hành trình: phương tiện của theme (✈️ 🚗 🥾 ⛵) đi tới đích (📍 🏁 ⛺ 🏝️) theo % đã gom.
// Kiểu đường (nét đứt, mặt đường nhựa, lối mòn, sóng) do CSS của theme quyết định.
export function TripRoute({ pct, theme }: { pct: number; theme: TripTheme }) {
  const p = Math.max(0, Math.min(100, pct))
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-accent">●</span>
      <div className="tp-route flex-1" role="progressbar" aria-valuenow={Math.round(p)} aria-valuemin={0} aria-valuemax={100}>
        <span className="tp-route-track" />
        <span className="tp-route-fill" style={{ width: `calc((100% - 12px) * ${p / 100})` }} />
        <span className="tp-route-plane" style={{ left: `calc(6px + (100% - 12px) * ${p / 100})` }}>
          {theme.vehicle}
        </span>
      </div>
      <span className="text-sm">{theme.destination}</span>
    </div>
  )
}

const AVATAR_COLORS = ['#0f6e78', '#e0573a', '#1d6fb8', '#b7791f', '#7c3aed', '#2f855a', '#c2410c', '#be185d']

export function avatarColor(id: string) {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

export function Avatar({ id, name, size = 40, faded = false }: { id: string; name: string; size?: number; faded?: boolean }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-card ${faded ? 'opacity-50 grayscale' : ''}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: avatarColor(id),
      }}
      aria-hidden="true"
    >
      {initials || '?'}
    </span>
  )
}
