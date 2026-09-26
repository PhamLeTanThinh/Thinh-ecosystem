import Link from 'next/link'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { assertCertsAccess } from '@/lib/certs/access'
import { CCAF_ANSWER_GROUPS } from '@/lib/certs/ccaf-answer-groups'

export const metadata = { title: 'CCAF — Theo đáp án giống nhau' }

export default async function CcafAnswersPage() {
  await assertCertsAccess()
  const grouped = CCAF_ANSWER_GROUPS.reduce((n, g) => n + g.questionIds.length, 0)
  return (
    <div className="mx-auto w-[80%] min-w-0 py-8 max-lg:w-full max-lg:px-6">
      <AppBreadcrumb app="/certs" trail={[{ label: 'CCAF', href: '/certs/ccaf' }, { label: 'Theo đáp án giống nhau' }]} className="mb-6" />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">CCA Foundations — Theo đáp án giống nhau</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Khác trang lý thuyết (nhóm theo chủ đề rộng): đây là những câu mà <strong className="text-text">đáp án đúng cùng một kỹ thuật cụ thể</strong> — vd.
            &quot;thêm few-shot examples&quot; hay &quot;dùng hook chặn tool call&quot;. {grouped} câu thuộc {CCAF_ANSWER_GROUPS.length} nhóm; câu có kỹ thuật
            riêng, không lặp ở câu nào khác thì không nằm trong nhóm nào.
          </p>
        </div>
        <Link href="/certs/ccaf" className="rounded-pill border border-accent bg-accent px-4 py-2 text-sm font-semibold text-white">
          Sang luyện đề →
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CCAF_ANSWER_GROUPS.map((g) => (
          <Link
            key={g.id}
            href={`/certs/ccaf?answer=${g.id}`}
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
