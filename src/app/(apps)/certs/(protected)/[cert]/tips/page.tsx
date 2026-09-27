import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { TipReview } from '@/components/certs/TipReview'
import { assertCertsAccess } from '@/lib/certs/access'
import { CERT_CATALOG, findCert } from '@/lib/certs/catalog'

export function generateStaticParams() {
  return CERT_CATALOG.filter((c) => c.questions.some((q) => q.tip)).map((c) => ({ cert: c.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ cert: string }> }) {
  const cert = findCert((await params).cert)
  return { title: cert ? `${cert.code} — Ôn mẹo nhanh` : 'Certs Hub' }
}

export default async function CertTipsPage({ params }: { params: Promise<{ cert: string }> }) {
  await assertCertsAccess()
  const cert = findCert((await params).cert)
  if (!cert || !cert.questions.some((q) => q.tip)) notFound()
  const base = `/certs/${cert.id}`
  return (
    <div className="mx-auto w-[80%] min-w-0 py-8 max-lg:w-full max-lg:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <AppBreadcrumb app="/certs" trail={[{ label: cert.code, href: base }, { label: 'Ôn mẹo nhanh' }]} />
        <Link href={base} className="rounded-pill border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white">
          ← Về luyện đề
        </Link>
      </div>
      <TipReview questions={cert.questions} contexts={cert.contexts} />
    </div>
  )
}
