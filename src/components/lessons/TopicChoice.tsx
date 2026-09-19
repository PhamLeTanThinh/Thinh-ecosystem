'use client'

import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppBreadcrumb, type AppHref, type Crumb } from '@/components/study/Breadcrumb'
import { withViewTransition } from '@/lib/viewTransition'
import './lessons.css'

export interface TopicChoiceItem {
  key: string
  icon: string
  label: string
  meta?: string
  muted?: boolean // chưa có nội dung ("sắp ra mắt") — vẫn bấm được nhưng mờ hơn
}

interface Props {
  app: AppHref
  trail?: Crumb[]
  accent: string
  title: string
  subtitle?: string
  items: TopicChoiceItem[]
  // Điều hướng tới `${basePath}/${item.key}`.
  basePath: string
  // Tiền tố view-transition-name — phải trùng với tên đặt trên .lg-page-icon (hoặc tương đương) ở
  // trang đích để card "bay" sang đúng chỗ, xem lessons.css.
  transitionPrefix: string
  // Trang này CŨNG là đích của 1 TopicChoice khác ở cấp cha (vd /it/master-ai là đích của card
  // "Master AI" ở /it) — icon + ĐÚNG view-transition-name của card đó, để nhận card bay tới. Bỏ trống
  // nếu trang này không phải đích của TopicChoice nào.
  incomingIcon?: string
  incomingTransitionName?: string
}

// Màn hình chọn chủ đề (giống LevelLanding của Korean/Chinese, dùng cho mọi hub học theo lesson) —
// chọn 1 card thì điều hướng SANG TRANG KHÁC kèm View Transition (lib/viewTransition.ts), card bay
// sang icon tiêu đề trang đích thay vì đổi state trong cùng 1 trang.
export function TopicChoice({ app, trail = [], accent, title, subtitle, items, basePath, transitionPrefix, incomingIcon, incomingTransitionName }: Props) {
  const router = useRouter()

  // startViewTransition cần DOM trang mới sẵn sàng ngay khi callback trả về — prefetch sẵn mọi trang
  // đích, không thì hiệu ứng bay sẽ bị đứt/nhảy khựng (xem (apps)/music/page.tsx, cùng lý do).
  useEffect(() => {
    items.forEach((item) => router.prefetch(`${basePath}/${item.key}`))
  }, [router, items, basePath])

  function pick(key: string) {
    withViewTransition(() => router.push(`${basePath}/${key}`))
  }

  return (
    <div className="lg-root" style={{ '--lg-accent': accent } as CSSProperties}>
      <AppBreadcrumb app={app} trail={trail} />

      <div className="lg-landing">
        {incomingIcon && incomingTransitionName && (
          <span className="lg-page-icon lg-landing-icon-in" style={{ viewTransitionName: incomingTransitionName } as CSSProperties}>
            {incomingIcon}
          </span>
        )}
        <h1 className="lg-landing-title">{title}</h1>
        {subtitle && <p className="lg-landing-sub">{subtitle}</p>}

        <div className="lg-landing-grid">
          {items.map((item, i) => (
            <button
              key={item.key}
              type="button"
              className={`lg-landing-card${item.muted ? ' lg-landing-card--muted' : ''}`}
              style={{ viewTransitionName: `${transitionPrefix}-level-${item.key}`, '--i': i } as CSSProperties}
              onClick={() => pick(item.key)}
            >
              <span className="lg-landing-card-icon">{item.icon}</span>
              <span className="lg-landing-card-label">{item.label}</span>
              {item.meta && <span className="lg-landing-card-meta">{item.meta}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
