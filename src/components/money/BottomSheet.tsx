'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  // true: chỉ trượt từ dưới lên trên mobile; từ md trở lên hiện thành popup giữa màn hình
  responsive?: boolean
  // false: bấm nền tối bên ngoài KHÔNG đóng (form nhập dài, tránh mất dữ liệu đang gõ dở) — chỉ đóng bằng nút Huỷ
  closeOnBackdrop?: boolean
}

export function BottomSheet({ open, onClose, children, responsive = false, closeOnBackdrop = true }: BottomSheetProps) {
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
        responsive ? 'md:items-center md:p-6' : ''
      } ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {closeOnBackdrop ? (
        <button type="button" aria-label="Đóng" onClick={onClose} className="absolute inset-0 bg-black/60" />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
      )}
      <div
        // Ẩn thanh cuộn (vẫn cuộn được bằng chuột / vuốt) — thanh cuộn mặc định phá góc bo của sheet
        role="dialog"
        aria-modal="true"
        className={`relative z-10 max-h-[92vh] w-full max-w-120 overflow-x-hidden overflow-y-auto overscroll-contain rounded-t-card [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-card pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out ${
          responsive ? 'md:max-h-[86vh] md:max-w-140 md:rounded-card md:pb-0 md:shadow-2xl' : ''
        } ${
          visible
            ? `translate-y-0 ${responsive ? 'md:scale-100' : ''}`
            : `translate-y-full ${responsive ? 'md:translate-y-6 md:scale-95' : ''}`
        }`}
        onTransitionEnd={(e) => {
          // Tailwind v4: `translate-y-*` ghi vào CSS property `translate` riêng, không phải
          // `transform` — transitionend báo propertyName là 'translate' (cả kiểu popup trên desktop
          // cũng trượt nhẹ translate-y-6 nên vẫn bắt được).
          if (e.propertyName === 'translate' && !open) setMounted(false)
        }}
      >
        {children}
      </div>
    </div>
  )
}
