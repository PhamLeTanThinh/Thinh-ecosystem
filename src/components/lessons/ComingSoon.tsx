import type { CSSProperties } from 'react'
import { AppBreadcrumb, type AppHref, type Crumb } from '@/components/study/Breadcrumb'
import './lessons.css'

interface Props {
  app: AppHref
  trail: Crumb[]
  accent: string
  title: string
  subtitle?: string
  icon?: string
  // Card chủ đề tương ứng ở TopicChoice cùng view-transition-name `${transitionPrefix}-level-<key>`
  // bay vào icon này — bỏ trống nếu trang này không phải đích của TopicChoice nào.
  transitionName?: string
}

export function ComingSoon({ app, trail, accent, title, subtitle, icon = '🚧', transitionName }: Props) {
  return (
    <div className="lg-root" style={{ '--lg-accent': accent } as CSSProperties}>
      <AppBreadcrumb app={app} trail={trail} />

      <div className="lg-soon">
        <span className="lg-soon-icon" style={transitionName ? ({ viewTransitionName: transitionName } as CSSProperties) : undefined}>
          {icon}
        </span>
        <h1 className="lg-soon-title">{title}</h1>
        <p className="lg-soon-sub">{subtitle ?? 'Nội dung đang được chuẩn bị — quay lại sau nhé.'}</p>
      </div>
    </div>
  )
}
