'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { FlowTransitionProvider, useFlowTransition } from '@/lib/vitrine/flow-transition'
import { useVitrineStore } from '@/lib/vitrine/store'
import { applyFloatStyle, type Vec2 } from '@/lib/vitrine/float-styles'

// Lệch dọc theo chu kỳ cố định (không random) để item "trôi" so le một cách hữu cơ
// mà vẫn khớp giữa server/client render — tránh cảm giác grid ô vuông đều tăm tắp.
const STAGGER_PATTERN = [6, 46, 2, 52, 20, 38, 10, 30]

// Hướng bay vào lúc trang mount (vector đơn vị) — không có "card vừa bấm" để tính hướng
// ra xa như lúc rời trang, nên dùng 1 vòng hướng cố định xen kẽ theo index; FloatStyle
// (đọc trong FlowItem) quyết định biên độ/độ xoay/độ mờ thật sự áp lên hướng này.
const ENTRANCE_DIRECTIONS: Vec2[] = [
  { x: -0.81, y: 0.58 },
  { x: 0.76, y: -0.65 },
  { x: -0.68, y: -0.74 },
  { x: 0.86, y: 0.51 },
  { x: 0.5, y: 0.87 },
  { x: -0.5, y: -0.87 },
  { x: 0.97, y: -0.24 },
  { x: -0.97, y: 0.24 },
]

export function FlowLayout({ children }: { children: ReactNode }) {
  return (
    <FlowTransitionProvider>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px 32px', alignItems: 'flex-start' }}>{children}</div>
    </FlowTransitionProvider>
  )
}

interface FlowItemProps {
  id: string
  index: number
  children: ReactNode
}

// Card nào KHÔNG được bấm sẽ trôi dạt ra xa (theo `driftFor`) và mờ dần; card được bấm
// phóng to nhẹ rồi đứng yên chờ điều hướng. Trang đích đọc lại đúng `floatStyle` đã chọn
// (persist qua store, xem flow-transition.tsx) để bay vào cùng "chất" — random 1 trong 4
// kiểu mỗi lần bấm, nhưng in/out luôn khớp nhau trong cùng 1 lượt điều hướng.
export function FlowItem({ id, index, children }: FlowItemProps) {
  const offset = STAGGER_PATTERN[index % STAGGER_PATTERN.length]
  const entranceDir = ENTRANCE_DIRECTIONS[index % ENTRANCE_DIRECTIONS.length]
  const { activeId, isLeaving, driftFor, registerCard } = useFlowTransition()
  const floatStyle = useVitrineStore((s) => s.floatStyle)
  const isActive = activeId === id

  const exit = applyFloatStyle(driftFor(id), floatStyle, index)
  const enter = applyFloatStyle(entranceDir, floatStyle, index)

  return (
    <motion.div
      ref={(el) => registerCard(id, el)}
      initial={{ opacity: 0, x: enter.x, y: offset + enter.y, scale: enter.scale, rotate: enter.rotate, filter: `blur(${enter.blur}px)` }}
      animate={
        isLeaving
          ? isActive
            ? { opacity: 1, x: 0, y: offset, scale: 1.04, rotate: 0, filter: 'blur(0px)', transition: { duration: 0.26, ease: 'easeOut' } }
            : {
                opacity: 0,
                x: exit.x,
                y: offset + exit.y,
                scale: exit.scale,
                rotate: exit.rotate,
                filter: `blur(${exit.blur}px)`,
                transition: { duration: 0.26, ease: 'easeIn' },
              }
          : {
              opacity: 1,
              x: 0,
              y: offset,
              scale: 1,
              rotate: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.42, ease: 'easeOut', delay: Math.min(index * 0.05, 0.2) },
            }
      }
      style={{ position: 'relative', zIndex: isActive ? 2 : 1 }}
    >
      {children}
    </motion.div>
  )
}
