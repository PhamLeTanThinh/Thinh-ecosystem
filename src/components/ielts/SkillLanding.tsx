'use client'

import type { CSSProperties } from 'react'
import { SKILLS } from '@/lib/ielts/skills'
import { useIeltsStore } from '@/lib/ielts/store'
import type { Skill } from '@/lib/ielts/types'

// Màn hình đầu khi mới vào /ielts: 4 kỹ năng dạng card ở giữa màn hình. Chọn 1 card thì trang cha
// (page.tsx) chạy View Transition: mỗi card có view-transition-name trùng với dòng skill tương ứng
// trong Sidebar nên trình duyệt tự cho card "bay" sang vị trí dòng đó ở bên trái.
export function SkillLanding({ onPick }: { onPick: (skill: Skill) => void }) {
  const pages = useIeltsStore((s) => s.pages)
  const hydrated = useIeltsStore((s) => s.hydrated)

  return (
    <div className="ih-landing">
      <h1 className="ih-font-hand ih-landing-title">IELTS Hub</h1>
      <p className="ih-landing-sub">Chọn một kỹ năng để bắt đầu</p>

      <div className="ih-landing-grid">
        {SKILLS.map((skill, i) => {
          const count = pages.filter((p) => p.skill === skill.key).length
          return (
            <button
              key={skill.key}
              type="button"
              className="ih-glass ih-landing-card"
              style={{ viewTransitionName: `ih-skill-${skill.key}`, '--i': i } as CSSProperties}
              onClick={() => onPick(skill.key)}
            >
              <span className="ih-landing-icon">{skill.icon}</span>
              <span className="ih-font-hand ih-landing-label">{skill.label}</span>
              {/* Chưa tải xong danh sách trang thì để trống (giữ chiều cao) thay vì hiện "0 trang" sai. */}
              <span className="ih-landing-count">{hydrated ? `${count} trang` : ' '}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
