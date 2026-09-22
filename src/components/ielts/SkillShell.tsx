'use client'

import { useState } from 'react'
import type { Skill } from '@/lib/ielts/types'
import { IeltsTopbar } from './IeltsShell'
import { SkillSidebar, type SkillCounts } from './Sidebar'

// Khung của 1 kỹ năng: sidebar riêng bên trái + topbar (tìm kiếm, vai trò) + nội dung. Sidebar chuyển
// thành off-canvas (trượt từ trái, che nội dung) trên màn hẹp — xem media query trong ielts.css; trạng
// thái đóng/mở chỉ có ý nghĩa ở đó.
export function SkillShell({ skill, counts, children }: { skill: Skill; counts: SkillCounts; children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="ih-shell">
      <SkillSidebar skill={skill} counts={counts} navOpen={navOpen} onNavigate={() => setNavOpen(false)} />
      {/* Backdrop chỉ hiện (display) trên mobile khi navOpen. Bấm ra ngoài để đóng. */}
      {navOpen && <div className="ih-nav-backdrop" onClick={() => setNavOpen(false)} />}

      <div className="ih-main">
        <IeltsTopbar onToggleNav={() => setNavOpen((v) => !v)} onNavigate={() => setNavOpen(false)} />
        <div className="ih-content">{children}</div>
      </div>
    </div>
  )
}
