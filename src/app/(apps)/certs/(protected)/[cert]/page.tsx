import { notFound } from 'next/navigation'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { CertQuiz } from '@/components/certs/CertQuiz'
import { LearnerGate, LearnerProfile } from '@/components/learner/LearnerProfile'
import { assertCertsAccess } from '@/lib/certs/access'
import { CERT_CATALOG, findCert } from '@/lib/certs/catalog'

export function generateStaticParams() {
  return CERT_CATALOG.map((c) => ({ cert: c.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ cert: string }> }) {
  const cert = findCert((await params).cert)
  return { title: cert ? `${cert.code} — Luyện đề` : 'Certs Hub' }
}

export default async function CertPage({ params }: { params: Promise<{ cert: string }> }) {
  await assertCertsAccess()
  const cert = findCert((await params).cert)
  if (!cert) notFound()
  const categories = new Set(cert.questions.map((q) => q.category).filter(Boolean)).size
  return (
    <div className="mx-auto flex w-[80%] min-w-0 flex-col py-4 max-lg:w-full max-lg:px-6 lg:h-dvh lg:overflow-hidden">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <AppBreadcrumb app="/certs" trail={[{ label: cert.code }]} />
        <LearnerProfile />
      </div>
      <section className="relative mb-4 shrink-0 overflow-hidden rounded-card border border-border bg-gradient-to-br from-accent-soft via-card to-plum-soft px-5 py-4 shadow-sm md:px-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <span className="rounded-pill border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold">Microsoft Certified</span>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight">{cert.code} — {cert.title}</h1>
            <p className="mt-1 text-sm text-muted">{cert.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-pill border border-border bg-card/70 px-3 py-1 text-text">📝 {cert.questions.length} câu</span>
            {categories > 0 && <span className="rounded-pill border border-border bg-card/70 px-3 py-1 text-text">🧩 {categories} chủ đề</span>}
            <span className="rounded-pill border border-border bg-card/70 px-3 py-1 text-text">🇻🇳 Giải thích tiếng Việt</span>
          </div>
        </div>
      </section>
      <div className="min-h-0 flex-1 max-lg:min-h-fit lg:overflow-y-auto">
        <CertQuiz certId={cert.id} questions={cert.questions} />
      </div>
      <LearnerGate />
    </div>
  )
}
