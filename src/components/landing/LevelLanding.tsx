'use client'

import type { CSSProperties } from 'react'
import './level-landing.css'

export interface LandingItem {
  key: string
  icon: string
  label: string
  sublabel?: string
  meta: string
  muted?: boolean // chưa có nội dung ("sắp ra mắt") — vẫn bấm được nhưng mờ hơn
}

interface Props {
  eyebrow: string
  title: string
  subtitle: string
  items: LandingItem[]
  // Tiền tố tên view-transition (vd 'cn' → 'cn-level-hsk3'); phải trùng với tên đặt trên tiêu đề nhóm trong Sidebar
  // của app đó để card "bay" sang đúng dòng.
  transitionPrefix: string
  onPick: (key: string) => void
}

// Màn hình đầu của app học ngôn ngữ (Chinese / Korean): các cấp độ (HSK / TOPIK) dạng card ở giữa màn hình, giống
// màn hình 4 kỹ năng của IELTS (components/ielts/SkillLanding.tsx). Chọn 1 card thì trang cha chạy View Transition
// (lib/viewTransition.ts) để card bay sang Sidebar.
export function LevelLanding({ eyebrow, title, subtitle, items, transitionPrefix, onPick }: Props) {
  return (
    <div className="lv-landing">
      <p className="lv-eyebrow">{eyebrow}</p>
      <h1 className="lv-title">{title}</h1>
      <p className="lv-sub">{subtitle}</p>

      <div className="lv-grid">
        {items.map((item, i) => (
          <button
            key={item.key}
            type="button"
            className={`lv-card${item.muted ? ' lv-card--muted' : ''}`}
            style={{ viewTransitionName: `${transitionPrefix}-level-${item.key}`, '--i': i } as CSSProperties}
            onClick={() => onPick(item.key)}
          >
            <span className="lv-card-icon">{item.icon}</span>
            <span className="lv-card-label">{item.label}</span>
            {item.sublabel && <span className="lv-card-sub">{item.sublabel}</span>}
            <span className="lv-card-meta">{item.meta}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
