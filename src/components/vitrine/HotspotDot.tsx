import { forwardRef } from 'react'

// <g> nhận toạ độ qua `transform` được set imperative mỗi frame bởi Scene3DCanvas
// (xem LearningScene) — tránh setState 60 lần/giây khi model đang xoay.
export const HotspotDot = forwardRef<SVGGElement>(function HotspotDot(_props, ref) {
  return (
    <g ref={ref}>
      <circle r={13} fill="none" stroke="var(--color-vt-brass)" strokeOpacity={0.35} strokeWidth={1.5} />
      <circle r={7} fill="var(--color-vt-brass)" stroke="var(--color-vt-surface)" strokeWidth={3} />
    </g>
  )
})
