import Link from 'next/link'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { TipReview } from '@/components/certs/TipReview'
import type { CertQuestion } from '@/components/certs/CertQuiz'
import { assertCertsAccess } from '@/lib/certs/access'
import data from '@/lib/certs/ccaf-questions.json'

const questions = data as unknown as CertQuestion[]

export const metadata = { title: 'CCAF — Ôn mẹo nhanh' }

export default async function CcafTipsPage() {
  await assertCertsAccess()
  return (
    <div className="mx-auto w-[80%] min-w-0 py-8 max-lg:w-full max-lg:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <AppBreadcrumb app="/certs" trail={[{ label: 'CCAF', href: '/certs/ccaf' }, { label: 'Ôn mẹo nhanh' }]} />
        <Link href="/certs/ccaf" className="rounded-pill border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white">
          ← Về luyện đề
        </Link>
      </div>
      <TipReview questions={questions} />
    </div>
  )
}
