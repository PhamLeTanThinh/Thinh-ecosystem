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
  // Kiểu card "nhấn màu" (hiện chỉ Chinese dùng): có accent thì card nhuộm màu riêng, chữ chìm to ở góc,
  // dòng mô tả và thanh tiến độ. Không truyền accent thì card giữ kiểu cũ (Korean, Music).
  accent?: string
  glyph?: string
  desc?: string
  progress?: number // 0..1 — tỉ lệ thẻ đã thuộc
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

      <div className={`lv-grid${items.some((item) => item.accent) ? ' lv-grid--accent' : ''}`}>
        {items.map((item, i) => (
          <button
            key={item.key}
            type="button"
            className={`lv-card${item.accent ? ' lv-card--accent' : ''}${item.muted ? ' lv-card--muted' : ''}`}
            style={{ viewTransitionName: `${transitionPrefix}-level-${item.key}`, '--i': i, ...(item.accent ? { '--acc': item.accent } : {}) } as CSSProperties}
            onClick={() => onPick(item.key)}
          >
            {item.glyph && (
              <span className="lv-card-glyph" aria-hidden>
                {item.glyph}
              </span>
            )}
            <span className="lv-card-icon">{item.icon}</span>
            <span className="lv-card-label">{item.label}</span>
            {item.sublabel && <span className="lv-card-sub">{item.sublabel}</span>}
            {item.desc && <span className="lv-card-desc">{item.desc}</span>}
            <span className="lv-card-meta">{item.meta}</span>
            {item.progress !== undefined && !item.muted && (
              <span className="lv-card-progress-row">
                <span className="lv-card-progress" aria-hidden>
                  <span style={{ width: `${Math.round(item.progress * 100)}%` }} />
                </span>
                <span className="lv-card-pct">{Math.round(item.progress * 100)}% thuộc</span>
              </span>
            )}
            {item.accent && (
              <span className="lv-card-go" aria-hidden>
                →
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
