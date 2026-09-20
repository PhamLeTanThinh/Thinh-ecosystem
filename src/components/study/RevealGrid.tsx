'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

// Lưới thẻ ở /study: mỗi thẻ (.sd-card) chỉ "hiện hình" (data-in) khi cuộn tới gần khung nhìn — CSS
// (study.css) lo phần hoạt ảnh. Các thẻ vào khung nhìn cùng lúc được so le nhau (--d) theo thứ tự DOM.
export function RevealGrid({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = ref.current
    if (!grid) return
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.sd-card'))

    if (!('IntersectionObserver' in window)) {
      cards.forEach((c) => (c.dataset.in = '1'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, i) => {
            const el = e.target as HTMLElement
            el.style.setProperty('--d', `${i * 120}ms`)
            el.dataset.in = '1'
            io.unobserve(el)
          })
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    )
    cards.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
