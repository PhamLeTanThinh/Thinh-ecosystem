import { notFound } from 'next/navigation'
import { PracticeExercise } from '@/components/ielts/practice/PracticeExercise'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { exerciseSummariesForSkill } from '@/lib/ielts/tests'

export default async function PracticeExercisePage({ params, searchParams }: { params: Promise<{ skill: string }>; searchParams: Promise<{ page?: string }> }) {
  await assertIeltsAccess()
  const skill = parseSkill((await params).skill)
  if (!skill) notFound()
  const page = Number.parseInt((await searchParams).page ?? '1', 10)
  return <PracticeExercise skill={skill} sets={exerciseSummariesForSkill(skill)} initialPage={Number.isFinite(page) && page > 0 ? page : 1} />
}
