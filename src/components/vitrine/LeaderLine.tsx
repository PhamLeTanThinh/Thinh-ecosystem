import { forwardRef } from 'react'

interface LeaderLineProps {
  toX: number
  toY: number
}

// x1/y1 (đầu hotspot) được set imperative mỗi frame; x2/y2 (đầu nhãn) cố định vì
// nhãn đứng yên ở mép màn hình.
export const LeaderLine = forwardRef<SVGLineElement, LeaderLineProps>(function LeaderLine({ toX, toY }, ref) {
  return <line ref={ref} x2={toX} y2={toY} stroke="var(--color-vt-teal)" strokeWidth={1.5} />
})
