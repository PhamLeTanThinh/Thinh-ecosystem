'use client'

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useVitrineStore } from './store'
import { pickRandomFloatStyle } from './float-styles'

// Khớp với thời lượng animate rời đi của FlowItem (xem FlowLayout.tsx) — điều hướng
// bắt đầu đúng lúc card trôi gần xong, để PageTransition (exit gần như tức thời) nối
// tiếp liền mạch thay vì tạo thêm một khoảng chờ riêng biệt cảm giác "khựng" lại.
export const FLOW_NAV_DELAY = 260

interface DriftVector {
  x: number
  y: number
}

interface FlowTransitionValue {
  activeId: string | null
  isLeaving: boolean
  driftFor: (id: string) => DriftVector
  activate: (id: string, href: string) => void
  registerCard: (id: string, el: HTMLElement | null) => void
}

const FlowTransitionContext = createContext<FlowTransitionValue | null>(null)

// Cung cấp cơ chế "bấm 1 card -> các card khác trôi dạt ra khỏi màn hình rồi mới
// chuyển trang" cho FlowLayout — đo vị trí thật của từng card lúc bấm (getBoundingClientRect)
// để hướng trôi ra đúng là hướng ra XA card được chọn (dạng vector đơn vị, độ dài/độ
// xoay/độ mờ thật do FloatStyle ở FlowItem áp lên), không phải hướng cố định.
export function FlowTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const setFloatStyle = useVitrineStore((s) => s.setFloatStyle)
  const cardRefs = useRef(new Map<string, HTMLElement>())
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isLeaving, setIsLeaving] = useState(false)
  const [drifts, setDrifts] = useState(new Map<string, DriftVector>())

  const registerCard = useCallback((id: string, el: HTMLElement | null) => {
    if (el) cardRefs.current.set(id, el)
    else cardRefs.current.delete(id)
  }, [])

  const activate = useCallback(
    (id: string, href: string) => {
      if (isLeaving) return
      setFloatStyle(pickRandomFloatStyle())

      const clickedRect = cardRefs.current.get(id)?.getBoundingClientRect()
      const nextDrifts = new Map<string, DriftVector>()
      if (clickedRect) {
        const cx = clickedRect.left + clickedRect.width / 2
        const cy = clickedRect.top + clickedRect.height / 2
        for (const [otherId, el] of cardRefs.current) {
          if (otherId === id) continue
          const r = el.getBoundingClientRect()
          const ox = r.left + r.width / 2
          const oy = r.top + r.height / 2
          const dist = Math.hypot(ox - cx, oy - cy) || 1
          nextDrifts.set(otherId, { x: (ox - cx) / dist, y: (oy - cy) / dist })
        }
      }
      setDrifts(nextDrifts)
      setActiveId(id)
      setIsLeaving(true)
      window.setTimeout(() => router.push(href), FLOW_NAV_DELAY)
    },
    [isLeaving, router, setFloatStyle]
  )

  const driftFor = useCallback((id: string) => drifts.get(id) ?? { x: 0, y: -1 }, [drifts])

  return (
    <FlowTransitionContext.Provider value={{ activeId, isLeaving, driftFor, activate, registerCard }}>
      {children}
    </FlowTransitionContext.Provider>
  )
}

export function useFlowTransition() {
  const ctx = useContext(FlowTransitionContext)
  if (!ctx) throw new Error('useFlowTransition phải được gọi bên trong FlowTransitionProvider')
  return ctx
}
