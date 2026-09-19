import { notFound } from 'next/navigation'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { getResearchPaper } from '@/lib/it/papers'

export default async function PaperDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const paper = getResearchPaper(slug)
  if (!paper) notFound()

  return (
    <div className="w-full px-6 py-8 md:px-10">
      <AppBreadcrumb
        app="/it"
        trail={[{ label: 'Master AI', href: '/it/master-ai' }, { label: 'Paper Research', href: '/it/master-ai/paper' }, { label: paper.title }]}
        className="mb-6"
      />

      <h1 className="text-2xl font-bold">{paper.title}</h1>
      <p className="mt-1 text-sm text-muted">
        {paper.authors} · {paper.venue} · {paper.year}
      </p>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">{paper.summary}</p>
    </div>
  )
}
