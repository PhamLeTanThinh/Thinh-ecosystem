import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { slugify, TheoryBlocks } from '@/components/certs/TheoryRich'
import { CCAF_TOPICS, findTopic } from '@/lib/certs/ccaf-theory'

export function generateStaticParams() {
  return CCAF_TOPICS.map((t) => ({ topic: t.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const found = findTopic((await params).topic)
  return { title: found ? `${found.topic.title} — CCAF` : 'CCAF — Lý thuyết' }
}

export default async function CcafTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const found = findTopic((await params).topic)
  if (!found) notFound()
  const { topic, domain, prev, next } = found
  const headings = topic.blocks.filter((b) => b.type === 'h').map((b) => b.text)

  return (
    <div className="mx-auto w-[80%] min-w-0 py-8 max-lg:w-full max-lg:px-6">
      <AppBreadcrumb
        app="/certs"
        trail={[
          { label: 'CCAF', href: '/certs/ccaf' },
          { label: 'Lý thuyết', href: '/certs/ccaf/theory' },
          { label: topic.title },
        ]}
        className="mb-6"
      />

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-pill bg-accent px-3 py-1 font-bold text-white">Domain {domain.number}</span>
        <span className="font-semibold text-muted">{domain.title} · {domain.weight}% đề thi</span>
      </div>
      <h1 className="mt-3 text-2xl font-bold">{topic.title}</h1>
      <p className="mt-2 max-w-3xl text-muted">{topic.summary}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_16rem]">
        <article className="min-w-0 rounded-card border border-border bg-card p-6 shadow-sm md:p-8">
          <TheoryBlocks blocks={topic.blocks} />

          <div className="mt-10 rounded-xl bg-accent-soft p-5">
            <div className="font-bold">Kiểm tra hiểu biết</div>
            <p className="mt-1 text-sm text-muted">Làm {topic.questionIds.length} câu trong bộ đề liên quan trực tiếp tới chủ đề này.</p>
            <Link
              href={`/certs/ccaf?topic=${topic.id}`}
              prefetch={false}
              className="mt-3 inline-block rounded-pill border border-accent bg-accent px-5 py-2 text-sm font-semibold text-white"
            >
              Luyện {topic.questionIds.length} câu về chủ đề này →
            </Link>
          </div>

          <nav className="mt-6 flex flex-wrap justify-between gap-3 text-sm">
            {prev ? (
              <Link href={`/certs/ccaf/theory/${prev.id}`} prefetch={false} className="rounded-pill border border-border px-4 py-2 font-semibold hover:border-accent">← {prev.title}</Link>
            ) : <span />}
            {next ? (
              <Link href={`/certs/ccaf/theory/${next.id}`} prefetch={false} className="rounded-pill border border-border px-4 py-2 font-semibold hover:border-accent">{next.title} →</Link>
            ) : <span />}
          </nav>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-6 flex flex-col gap-4">
            <div className="rounded-card border border-border bg-card p-4 text-sm shadow-sm">
              <div className="mb-2 font-bold">Trong chủ đề này</div>
              <ul className="flex flex-col gap-1.5">
                {headings.map((h) => (
                  <li key={h}><a href={`#${slugify(h)}`} className="text-muted hover:text-accent">{h}</a></li>
                ))}
              </ul>
            </div>
            <div className="rounded-card border border-border bg-card p-4 text-sm shadow-sm">
              <div className="mb-2 font-bold">Cùng domain {domain.number}</div>
              <ul className="flex flex-col gap-1.5">
                {domain.topics.map((t) => (
                  <li key={t.id}>
                    {t.id === topic.id ? (
                      <span className="font-semibold text-accent">{t.title}</span>
                    ) : (
                      <Link href={`/certs/ccaf/theory/${t.id}`} prefetch={false} className="text-muted hover:text-accent">{t.title}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
