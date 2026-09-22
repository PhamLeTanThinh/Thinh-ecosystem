'use client'

import type { CSSProperties } from 'react'
import Link from 'next/link'
import { useIeltsStore } from '@/lib/ielts/store'
import { skillMeta } from '@/lib/ielts/skills'
import { parseLessonTitle } from '@/lib/ielts/lessonTitle'
import type { Skill } from '@/lib/ielts/types'

// /ielts/<skill>/lessons — trang chào của mục Kiến thức: banner màu kỹ năng + thẻ các bài học (ô số bài
// lớn, tên bài tách riêng). Trùng nội dung với danh sách ở sidebar nhưng dễ quét hơn, nhất là trên mobile
// khi sidebar đang đóng.
export function LessonsIndex({ skill }: { skill: Skill }) {
  const hydrated = useIeltsStore((s) => s.hydrated)
  const pages = useIeltsStore((s) => s.pages)
  const meta = skillMeta(skill)
  const list = pages.filter((p) => p.skill === skill).sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    // --nav-accent: cùng biến màu với sidebar (ở đây đặt lại vì trang nằm ngoài <aside>).
    <div className="ih-pr ih-les" style={{ '--nav-accent': meta?.accent ?? '#c9667a' } as CSSProperties}>
      <header className="ih-les-hero">
        <span className="ih-les-hero-icon" aria-hidden>
          {meta?.icon}
        </span>
        <div>
          <h1 className="ih-font-hand ih-les-hero-title">Kiến thức {meta?.label}</h1>
          <p className="ih-les-hero-sub">{hydrated ? `${list.length} bài học · chọn một bài để bắt đầu` : 'Đang tải…'}</p>
        </div>
      </header>

      {!hydrated ? (
        <div className="ih-loading-state">
          <span className="ih-spinner" aria-hidden />
          <span>Đang tải…</span>
        </div>
      ) : (
        <div className="ih-les-grid">
          {list.map((p) => {
            const parsed = parseLessonTitle(p.title)
            return (
              <Link key={p.id} href={`/ielts/${skill}/lessons/${p.id}`} className="ih-les-card">
                <span className="ih-les-num">{parsed ? parsed.num : '📄'}</span>
                <span className="ih-les-body">
                  <span className="ih-les-cap">{parsed ? `Lesson ${parsed.num}` : 'Bài học'}</span>
                  <span className="ih-les-title">{parsed ? parsed.name : p.title}</span>
                </span>
                <span className="ih-les-arrow" aria-hidden>
                  →
                </span>
              </Link>
            )
          })}
          {list.length === 0 && <p className="ih-pr-empty">Chưa có bài nào. Chủ trang có thể bấm “+ Thêm trang” ở menu bên trái.</p>}
        </div>
      )}
    </div>
  )
}
