'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

// CHỈ animate opacity — Học 3D dùng position:fixed để chiếm toàn màn hình, mà bất kỳ
// CSS transform nào trên phần tử cha (translate/scale/...) sẽ biến nó thành containing
// block mới cho descendant `position:fixed`, phá layout fullscreen trong lúc chuyển
// trang. Card "trôi ra" (FlowLayout.tsx) an toàn dùng transform vì không bọc gì fixed.
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.1, ease: 'easeIn' } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
