import type { CSSProperties } from 'react'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { APP_BRAND } from '@/lib/apps/brand'
import '@/components/lessons/lessons.css'

// Skeleton — placeholder chủ đề, chưa có nội dung/flashcard/DB thật. Icon tiêu đề dùng lại
// .lg-page-icon/.lg-head của lessons.css để nhận đúng card "Software Engineer" bay từ TopicChoice
// sang (xem (apps)/it/page.tsx).
const TOPICS = [
  { title: 'Cấu trúc dữ liệu & Giải thuật', description: 'Ôn lại các cấu trúc và giải thuật thường gặp.' },
  { title: 'Thiết kế hệ thống', description: 'Scalability, caching, database, message queue.' },
  { title: 'Kiến trúc phần mềm', description: 'Design pattern, clean architecture, microservices.' },
]

export default function SoftwareEngineerPage() {
  return (
    <div className="lg-root" style={{ '--lg-accent': APP_BRAND.it } as CSSProperties}>
      <AppBreadcrumb app="/it" trail={[{ label: 'Software Engineer' }]} className="mb-6" />

      <div className="lg-head">
        <span className="lg-page-icon" style={{ viewTransitionName: 'it-level-software-engineer' } as CSSProperties}>
          💻
        </span>
        <div>
          <h1 className="lg-title">Software Engineer</h1>
          <p className="lg-subtitle">Ôn kiến thức lập trình, hệ thống và kiến trúc phần mềm.</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((topic) => (
          <div key={topic.title} className="rounded-card border border-border bg-card p-4">
            <h2 className="font-semibold">{topic.title}</h2>
            <p className="mt-1 text-sm text-muted">{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
