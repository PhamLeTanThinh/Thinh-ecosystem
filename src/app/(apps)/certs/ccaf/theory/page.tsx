import Link from 'next/link'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { CCAF_DOMAINS } from '@/lib/certs/ccaf-theory'

export const metadata = { title: 'CCAF — Lý thuyết' }

export default function CcafTheoryPage() {
  const topicCount = CCAF_DOMAINS.reduce((n, d) => n + d.topics.length, 0)
  return (
    <div className="mx-auto w-[80%] min-w-0 py-8 max-lg:w-full max-lg:px-6">
      <AppBreadcrumb app="/certs" trail={[{ label: 'CCAF', href: '/certs/ccaf' }, { label: 'Lý thuyết' }]} className="mb-6" />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">CCA Foundations — Lý thuyết</h1>
          <p className="mt-1 text-sm text-muted">
            {topicCount} chủ đề theo 5 domain của đề thi, soạn từ toàn bộ bộ đề: khái niệm, bảng so sánh, bẫy thường gặp và mẹo chọn đáp án.
          </p>
        </div>
        <Link href="/certs/ccaf" className="rounded-pill border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white">
          Sang luyện đề →
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {CCAF_DOMAINS.map((d) => (
          <section key={d.id}>
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="rounded-pill bg-accent px-3 py-1 text-xs font-bold text-white">Domain {d.number}</span>
              <h2 className="text-lg font-bold">{d.title}</h2>
              <span className="text-xs font-semibold text-plum">{d.weight}% đề thi</span>
            </div>
            <p className="mb-4 max-w-3xl text-sm text-muted">{d.summary}</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {d.topics.map((t) => (
                <Link
                  key={t.id}
                  href={`/certs/ccaf/theory/${t.id}`}
                  prefetch={false}
                  className="group flex flex-col rounded-card border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent"
                >
                  <h3 className="font-semibold leading-snug">{t.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{t.summary}</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="rounded-pill bg-plum-soft px-2.5 py-0.5 font-semibold text-plum">{t.questionIds.length} câu liên quan</span>
                    <span className="font-semibold text-accent transition group-hover:translate-x-1">Đọc →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
