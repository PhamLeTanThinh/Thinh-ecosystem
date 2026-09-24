import Link from 'next/link'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { CcafQuiz, type CcafQuestion } from '@/components/certs/CcafQuiz'
import { LearnerGate, LearnerProfile } from '@/components/learner/LearnerProfile'
import data from '@/lib/certs/ccaf-questions.json'
import { CCAF_TOPICS, topicsByQuestion } from '@/lib/certs/ccaf-theory'

const questions = data as unknown as CcafQuestion[]

export const metadata = { title: 'CCAF — Luyện đề' }

const theoryByQuestion = topicsByQuestion()

export default async function CcafPage({ searchParams }: { searchParams: Promise<{ topic?: string | string[] }> }) {
  const topicParam = (await searchParams).topic
  const topic = CCAF_TOPICS.find((t) => t.id === (Array.isArray(topicParam) ? topicParam[0] : topicParam))
  return (
    <div className="mx-auto flex w-[80%] min-w-0 flex-col py-4 max-lg:w-full max-lg:px-6 lg:h-dvh lg:overflow-hidden">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <AppBreadcrumb app="/certs" trail={[{ label: 'CCAF' }]} />
        <LearnerProfile />
      </div>
      <section className="relative mb-4 shrink-0 overflow-hidden rounded-card border border-blue-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 px-5 py-4 shadow-sm md:px-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-200/30" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-blue-200/30" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <span className="rounded-pill bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">Claude Certified Architect</span>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight">CCA Foundations — Luyện đề</h1>
            <p className="mt-1 text-sm text-muted">CCA-F là chứng chỉ nền tảng dành cho kiến trúc sư xây dựng giải pháp với Claude, kiểm tra kiến thức về thiết kế agent, tool & MCP, Claude Code, prompt và quản lý ngữ cảnh.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-pill border border-blue-100 bg-white/70 px-3 py-1 text-blue-800">📝 {questions.length} câu</span>
            <span className="rounded-pill border border-blue-100 bg-white/70 px-3 py-1 text-blue-800">🧩 5 domain</span>
            <span className="rounded-pill border border-blue-100 bg-white/70 px-3 py-1 text-blue-800">🌐 Song ngữ</span>
            <Link href="/certs/ccaf/theory" className="rounded-pill border border-blue-200 bg-white px-5 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md">
            📖 Học lý thuyết
            </Link>
          </div>
        </div>
      </section>
      <div className="min-h-0 flex-1 max-lg:min-h-fit lg:overflow-y-auto">
      <CcafQuiz
        key={topic?.id ?? 'all'}
        questions={questions}
        theoryByQuestion={theoryByQuestion}
        initialTopic={topic ? { id: topic.id, title: topic.title, ids: topic.questionIds } : undefined}
      />
      </div>
      <LearnerGate />
    </div>
  )
}
