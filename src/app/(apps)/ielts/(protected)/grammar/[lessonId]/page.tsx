import { notFound } from 'next/navigation'
import { IeltsPlainShell } from '@/components/ielts/IeltsShell'
import { GrammarLessonView } from '@/components/ielts/grammar/GrammarLessonView'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { getGrammarLesson } from '@/lib/ielts/grammar'

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }) {
  const lesson = getGrammarLesson((await params).lessonId)
  return { title: lesson ? `${lesson.title} — Ngữ pháp cơ bản` : 'Ngữ pháp cơ bản' }
}

// 1 bài ngữ pháp (dữ liệu ở src/data/ielts/grammar/lessons-*.ts).
export default async function GrammarLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  await assertIeltsAccess()
  const lesson = getGrammarLesson((await params).lessonId)
  if (!lesson) notFound()
  return (
    <IeltsPlainShell trail={[{ label: 'Ngữ pháp cơ bản', href: '/ielts/grammar' }, { label: `${lesson.no}. ${lesson.title}` }]}>
      <GrammarLessonView lesson={lesson} />
    </IeltsPlainShell>
  )
}
