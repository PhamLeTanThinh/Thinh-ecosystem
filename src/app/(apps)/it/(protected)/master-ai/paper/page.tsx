'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { RESEARCH_PAPERS } from '@/lib/it/papers'
import { APP_BRAND } from '@/lib/apps/brand'
import '@/components/lessons/lessons.css'

// Layout dạng lưới card, có search (theo tên/tác giả) + lọc theo lĩnh vực (paper.fields). Icon tiêu
// đề dùng lại .lg-page-icon/.lg-head của lessons.css để nhận đúng card "Paper Research" bay từ
// TopicChoice sang (xem (apps)/it/master-ai/page.tsx).
export default function PaperPage() {
  const [query, setQuery] = useState('')
  const [activeField, setActiveField] = useState<string | null>(null)

  const allFields = useMemo(() => {
    const set = new Set<string>()
    RESEARCH_PAPERS.forEach((p) => p.fields.forEach((f) => set.add(f)))
    return Array.from(set).sort()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return RESEARCH_PAPERS.filter((p) => {
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q)
      const matchesField = !activeField || p.fields.includes(activeField)
      return matchesQuery && matchesField
    })
  }, [query, activeField])

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

      {/* Search */}
      <div className="relative mt-8 max-w-md">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">🔍</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên paper hoặc tác giả..."
          className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      {/* Filter theo lĩnh vực */}
      {allFields.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveField(null)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeField === null ? 'border-accent bg-accent text-white' : 'border-border bg-card hover:border-accent/60'
            }`}
          >
            Tất cả
          </button>
          {allFields.map((field) => (
            <button
              key={field}
              type="button"
              onClick={() => setActiveField((prev) => (prev === field ? null : field))}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                activeField === field ? 'border-accent bg-accent text-white' : 'border-border bg-card hover:border-accent/60'
              }`}
            >
              {field}
            </button>
          ))}
        </div>
      )}

      {/* Lưới card */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((paper) => (
            <Link
              key={paper.slug}
              href={`/it/master-ai/paper/${paper.slug}`}
              className="flex flex-col gap-3 rounded-card border border-border bg-card p-5 transition-colors hover:border-accent"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-lg text-white">📄</span>
                <span className="text-muted">→</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="block font-bold leading-snug">{paper.title}</span>
                <span className="mt-1 block text-sm text-muted">{paper.authors}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {paper.venue} · {paper.year}
                </span>
              </div>
              {paper.fields.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {paper.fields.map((f) => (
                    <span key={f} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent">
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-card border border-border bg-card p-8 text-center text-sm text-muted">
          Không tìm thấy paper nào khớp với bộ lọc hiện tại.
        </div>
      )}
    </div>
  )
}
