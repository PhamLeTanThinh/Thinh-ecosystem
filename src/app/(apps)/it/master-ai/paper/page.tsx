import type { CSSProperties } from 'react'
import Link from 'next/link'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { RESEARCH_PAPERS } from '@/lib/it/papers'
import { APP_BRAND } from '@/lib/apps/brand'
import '@/components/lessons/lessons.css'

// Layout danh sách giống trang "Nhạc yêu thích" bên Music Hub (xem (apps)/music/favorites/page.tsx) —
// 1 danh sách thẻ, mỗi thẻ mở ra trang ghi chú riêng của paper đó. Icon tiêu đề dùng lại
// .lg-page-icon/.lg-head của lessons.css để nhận đúng card "Paper Research" bay từ TopicChoice sang
// (xem (apps)/it/master-ai/page.tsx).
export default function PaperPage() {
  return (
    <div className="lg-root" style={{ '--lg-accent': APP_BRAND.it } as CSSProperties}>
      <AppBreadcrumb app="/it" trail={[{ label: 'Master AI', href: '/it/master-ai' }, { label: 'Paper Research' }]} className="mb-6" />

      <div className="lg-head">
        <span className="lg-page-icon" style={{ viewTransitionName: 'it-ma-level-paper' } as CSSProperties}>
          📄
        </span>
        <div>
          <h1 className="lg-title">Paper Research</h1>
          <p className="lg-subtitle">{RESEARCH_PAPERS.length} paper — bấm vào để xem ghi chú.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {RESEARCH_PAPERS.map((paper) => (
          <Link
            key={paper.slug}
            href={`/it/master-ai/paper/${paper.slug}`}
            className="flex items-center gap-4 rounded-card border border-border bg-card p-4 transition-colors hover:border-accent"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-xl text-white">📄</span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">{paper.title}</span>
              <span className="block text-sm">{paper.authors}</span>
              <span className="block text-xs text-muted">
                {paper.venue} · {paper.year}
              </span>
            </span>
            <span className="text-muted">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
