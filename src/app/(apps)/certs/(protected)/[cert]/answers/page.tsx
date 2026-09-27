import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { assertCertsAccess } from '@/lib/certs/access'
import { CERT_CATALOG, findCert } from '@/lib/certs/catalog'

export function generateStaticParams() {
  return CERT_CATALOG.filter((c) => c.answerGroups).map((c) => ({ cert: c.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ cert: string }> }) {
  const cert = findCert((await params).cert)
  return { title: cert ? `${cert.code} — Theo đáp án giống nhau` : 'Certs Hub' }
}

export default async function CertAnswersPage({ params }: { params: Promise<{ cert: string }> }) {
  await assertCertsAccess()
  const cert = findCert((await params).cert)
  if (!cert?.answerGroups) notFound()
  const groups = cert.answerGroups
  const base = `/certs/${cert.id}`
  const grouped = new Set(groups.flatMap((g) => g.questionIds)).size
  return (
    <div className="mx-auto w-[80%] min-w-0 py-8 max-lg:w-full max-lg:px-6">
      <AppBreadcrumb app="/certs" trail={[{ label: cert.code, href: base }, { label: 'Theo đáp án giống nhau' }]} className="mb-6" />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{cert.code} — Theo đáp án giống nhau</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Khác trang lý thuyết (nhóm theo chủ đề rộng): đây là những câu mà <strong className="text-text">đáp án đúng cùng một kỹ thuật cụ thể</strong>. {grouped}/
            {cert.questions.length} câu thuộc {groups.length} nhóm; câu có kỹ thuật riêng, không lặp ở câu nào khác thì không nằm trong nhóm nào.
          </p>
        </div>
        <Link href={base} className="rounded-pill border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white">
          Sang luyện đề →
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((g) => (
          <Link
            key={g.id}
            href={`${base}?answer=${g.id}`}
            prefetch={false}
            className="group flex flex-col rounded-card border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent"
          >
            <span className="text-2xl">{g.icon}</span>
            <h2 className="mt-3 font-semibold leading-snug">{g.title}</h2>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="rounded-pill bg-plum-soft px-2.5 py-0.5 font-semibold text-plum">{g.questionIds.length} câu</span>
              <span className="font-semibold text-accent transition group-hover:translate-x-1">Luyện →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
