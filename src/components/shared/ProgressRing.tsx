import type { CSSProperties } from 'react'
import './progress-ring.css'

interface Props {
  done: number
  total: number
  size?: number
  className?: string
  // Chữ cho tooltip + trình đọc màn hình, vd "56/58 thẻ đã thuộc"
  label: string
}

// Vòng tiến độ nhỏ: cung màu chạy theo done/total, giữa là % (xong hết thì thành dấu ✓). Màu lấy từ --color-brand
// của app đang dùng (fallback currentColor) nên đặt được ở Korean/Chinese/... mà không cần truyền màu.
export function ProgressRing({ done, total, size = 30, className, label }: Props) {
  const ratio = total > 0 ? Math.min(1, done / total) : 0
  const pct = Math.round(ratio * 100)
  const r = 15.5
  const c = 2 * Math.PI * r
  const complete = total > 0 && done >= total
  return (
    <span
      className={`pring${complete ? ' pring--done' : ''}${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size } as CSSProperties}
      role="img"
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 36 36" aria-hidden="true">
        <circle className="pring-track" cx="18" cy="18" r={r} />
        <circle className="pring-bar" cx="18" cy="18" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - ratio)} />
      </svg>
      <span className="pring-text" aria-hidden="true">
        {complete ? '✓' : pct}
      </span>
    </span>
  )
}
