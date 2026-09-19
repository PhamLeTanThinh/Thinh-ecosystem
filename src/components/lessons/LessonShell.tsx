'use client'

import type { CSSProperties } from 'react'
import { useState } from 'react'
import { AppBreadcrumb, type AppHref, type Crumb } from '@/components/study/Breadcrumb'
import { withViewTransition } from '@/lib/viewTransition'
import './lessons.css'

interface Props {
  app: AppHref
  trail: Crumb[]
  accent: string
  topicLabel: string
  topicIcon: string
  count: number
  // Card chủ đề tương ứng ở TopicChoice cùng view-transition-name này bay vào icon màn chọn bài của
  // trang này — bỏ trống nếu trang này không phải đích của TopicChoice nào.
  levelTransitionName?: string
  // Tiền tố view-transition-name riêng cho lưới "Bài n" ↔ dòng sidebar — không trùng hub khác.
  transitionPrefix: string
}

// Chọn 1 bài trong lưới "Bài 1..N" thì KHÔNG đổi URL (vẫn ở path của topic, vd /pm/pmfsoft) — chỉ
// đổi state trong cùng 1 trang, card "Bài n" bay sang dòng cùng số trong sidebar rồi nội dung hiện ra
// bên phải, đúng cơ chế card→sidebar của Korean/Chinese (lib/viewTransition.ts) — không phải điều
// hướng sang trang khác như TopicChoice.
export function LessonShell({ app, trail, accent, topicLabel, topicIcon, count, levelTransitionName, transitionPrefix }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  function pickFromGrid(n: number) {
    withViewTransition(() => setSelected(n))
  }

  if (selected === null) {
    return (
      <div className="lg-root" style={{ '--lg-accent': accent } as CSSProperties}>
        <AppBreadcrumb app={app} trail={trail} />

        <div className="lg-head">
          {levelTransitionName && (
            <span className="lg-page-icon" style={{ viewTransitionName: levelTransitionName } as CSSProperties}>
              {topicIcon}
            </span>
          )}
          <div>
            <h1 className="lg-title">{topicLabel}</h1>
            <p className="lg-subtitle">{count} bài — bấm vào để xem nội dung.</p>
          </div>
        </div>

        <div className="lg-grid">
          {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className="lg-card"
              style={{ viewTransitionName: `${transitionPrefix}-lesson-${n}` } as CSSProperties}
              onClick={() => pickFromGrid(n)}
            >
              <span className="lg-card-num">{n}</span>
              <span className="lg-card-label">Bài {n}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="lg-shell" style={{ '--lg-accent': accent } as CSSProperties}>
      <aside className="lg-sidebar" style={{ viewTransitionName: 'lg-sidebar' } as CSSProperties}>
        <AppBreadcrumb app={app} trail={trail} className="lg-sidebar-crumb" />

        <div className="lg-sidebar-list">
          {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={`lg-sidebar-row${n === selected ? ' active' : ''}`}
              style={{ viewTransitionName: `${transitionPrefix}-lesson-${n}` } as CSSProperties}
              onClick={() => setSelected(n)}
            >
              <span className="lg-sidebar-row-num">{n}</span>
              Bài {n}
            </button>
          ))}
        </div>
      </aside>

      <div className="lg-main">
        <div key={selected} className="lg-detail-meta lg-detail-fade">
          <span className="lg-detail-topic">{topicLabel}</span>
          <h1 className="lg-detail-title">Bài {selected}</h1>
        </div>
        <p className="lg-detail-body">Nội dung đang cập nhật.</p>
      </div>
    </div>
  )
}
