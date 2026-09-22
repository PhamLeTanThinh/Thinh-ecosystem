'use client'

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'

const MIN = 25
const MAX = 75
const clamp = (v: number) => Math.max(MIN, Math.min(MAX, v))

export interface DividerHandlers {
  onPointerDown: (e: PointerEvent<HTMLDivElement>) => void
  onPointerMove: (e: PointerEvent<HTMLDivElement>) => void
  onPointerUp: (e: PointerEvent<HTMLDivElement>) => void
  onPointerCancel: (e: PointerEvent<HTMLDivElement>) => void
  onDoubleClick: () => void
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void
}

// Kéo thanh chia để đổi độ rộng 2 cột (bài đọc | câu hỏi) — dùng cho màn làm bài và màn giải thích.
// `split` = % chiều rộng của cột trái (25–75), đưa vào CSS qua biến --split (xem .ih-run-body trong practice.css).
// Chỉ ghi nhớ (onCommit) khi thả chuột / nhấn phím, không ghi liên tục lúc đang kéo.
export function useColumnSplit(initial: number, onCommit: (v: number) => void) {
  const [split, setSplit] = useState(clamp(initial))
  const bodyRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const latest = useRef(clamp(initial))

  function apply(v: number) {
    latest.current = clamp(v)
    setSplit(latest.current)
  }

  function end(e: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return
    dragging.current = false
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    document.body.classList.remove('ih-resizing')
    onCommit(latest.current)
  }

  const divider: DividerHandlers = {
    onPointerDown: (e) => {
      dragging.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
      document.body.classList.add('ih-resizing')
    },
    onPointerMove: (e) => {
      if (!dragging.current || !bodyRef.current) return
      const r = bodyRef.current.getBoundingClientRect()
      apply(((e.clientX - r.left) / r.width) * 100)
    },
    onPointerUp: end,
    onPointerCancel: end,
    // Nhấp đúp = về 50/50.
    onDoubleClick: () => {
      apply(50)
      onCommit(50)
    },
    onKeyDown: (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      e.preventDefault()
      apply(latest.current + (e.key === 'ArrowLeft' ? -2 : 2))
      onCommit(latest.current)
    },
  }

  const style = { '--split': split } as CSSProperties
  return { bodyRef, style, divider, apply }
}

// Thanh chia giữa 2 cột. Ẩn trên màn hẹp (đang dùng tab) và khi xếp dọc — xem CSS.
export function ColumnDivider({ divider }: { divider: DividerHandlers }) {
  return (
    <div className="ih-run-divider" role="separator" aria-orientation="vertical" aria-label="Kéo để đổi độ rộng hai cột (nhấp đúp để đặt lại)" title="Kéo để đổi độ rộng hai cột · nhấp đúp để đặt lại" tabIndex={0} {...divider}>
      <span />
    </div>
  )
}
