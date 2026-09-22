'use client'

import type { CSSProperties } from 'react'
import Link from 'next/link'
import { SKILLS } from '@/lib/ielts/skills'
import { useIeltsStore } from '@/lib/ielts/store'
import { useIeltsAccess } from './AccessContext'

// Màn hình đầu /ielts: 4 kỹ năng dạng card. Mỗi card dẫn vào khu riêng của kỹ năng đó (/ielts/<skill>,
// có menu Kiến thức / Làm đề / Vocab). Bên dưới là lối vào kho từ vựng chung (và Admin nếu là chủ).
export function SkillLanding() {
  const { isOwner } = useIeltsAccess()
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
            <Link key={skill.key} href={`/ielts/${skill.key}/lessons`} className="ih-glass ih-landing-card" style={{ '--i': i } as CSSProperties}>
              <span className="ih-landing-icon">{skill.icon}</span>
              <span className="ih-font-hand ih-landing-label">{skill.label}</span>
              {/* Chưa tải xong danh sách trang thì để trống (giữ chiều cao) thay vì hiện "0 trang" sai. */}
              <span className="ih-landing-count">{hydrated ? `${count} trang` : ' '}</span>
            </Link>
          )
        })}
      </div>

      <div className="ih-landing-links">
        <Link href="/ielts/vocab" className="ih-btn-outline">
          📚 Từ vựng chung
        </Link>
        {isOwner && (
          <Link href="/admin" className="ih-btn-outline">
            🔗 Admin · Người xem
          </Link>
        )}
      </div>
    </div>
  )
}
