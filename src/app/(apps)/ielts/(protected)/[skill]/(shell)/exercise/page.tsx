import { notFound } from 'next/navigation'
import { PracticeExercise } from '@/components/ielts/practice/PracticeExercise'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { exerciseSummariesForSkill } from '@/lib/ielts/tests'

export default async function PracticeExercisePage({ params }: { params: Promise<{ skill: string }> }) {
  await assertIeltsAccess()
  const skill = parseSkill((await params).skill)
  if (!skill) notFound()
  return <PracticeExercise skill={skill} sets={exerciseSummariesForSkill(skill)} />
}
