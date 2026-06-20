'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)
  const [prevOpen, setPrevOpen] = useState(open)

  // Đọc lúc render (không phải trong effect): mount/ẩn ngay khi `open` đổi, để có 1 frame
  // ở trạng thái ban đầu cho CSS transition chạy từ đó.
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) setMounted(true)
    else setVisible(false)
  }

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <button type="button" aria-label="Đóng" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div
        className={`relative z-10 max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-t-card bg-card pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
        onTransitionEnd={(e) => {
          // Tailwind v4: `translate-y-*` ghi vào CSS property `translate` riêng, không phải
          // `transform` — transitionend báo propertyName là 'translate'.
          if (e.propertyName === 'translate' && !open) setMounted(false)
        }}
      >
        {children}
      </div>
    </div>
  )
}
