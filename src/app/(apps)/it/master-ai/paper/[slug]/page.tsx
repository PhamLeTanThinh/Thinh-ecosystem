import { notFound } from 'next/navigation'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { PaperReader } from '@/components/study/PaperReader'
import { getResearchPaper } from '@/lib/it/papers'

export default async function PaperDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const paper = getResearchPaper(slug)
  if (!paper) notFound()

  return (
    <div className="flex h-full w-full flex-col px-6 py-8 md:px-10">
      <AppBreadcrumb
        app="/it"
        trail={[{ label: 'Master AI', href: '/it/master-ai' }, { label: 'Paper Research', href: '/it/master-ai/paper' }, { label: paper.title }]}
        className="mb-6"
      />

      <header className="rounded-card border border-border bg-card p-5">
        <h1 className="text-2xl font-bold leading-snug">{paper.title}</h1>
        <p className="mt-1 text-sm text-muted">{paper.venue}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2.5 rounded-2xl bg-accent/10 px-3.5 py-2">
            <span className="text-lg">✍️</span>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">Author</div>
              <div className="truncate text-sm font-bold">{paper.authors}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl bg-accent/10 px-3.5 py-2">
            <span className="text-lg">📅</span>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">Published</div>
              <div className="text-sm font-bold">{paper.year}</div>
            </div>
          </div>

          {typeof paper.citationCount === 'number' && (
            <div className="flex items-center gap-2.5 rounded-2xl bg-accent/10 px-3.5 py-2">
              <span className="text-lg">📈</span>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  Citations{paper.citationSource ? ` · ${paper.citationSource}` : ''}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold">{paper.citationCount}</span>
                  {paper.citationAsOf && <span className="text-[10px] font-medium text-muted">cập nhật {paper.citationAsOf}</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4 text-sm">
          {paper.sourceUrl && (
            <a
              href={paper.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-4 py-1.5 font-medium transition-colors hover:border-accent hover:text-accent"
            >
              Xem bài báo gốc ↗
            </a>
          )}
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-accent px-4 py-1.5 font-medium text-white transition-opacity hover:opacity-90"
            >
              Tải PDF ↗
            </a>
          )}
        </div>
      </header>

      <div className="mt-4 rounded-card border border-border bg-card p-5">
        <h2 className="text-[10px] font-semibold uppercase tracking-wide text-muted">Tóm tắt</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{paper.summary}</p>
      </div>

      <PaperReader paper={paper} />
    </div>
  )
}
