import { notFound } from 'next/navigation'
import { ExerciseSetStudy } from '@/components/ielts/practice/ExerciseSetStudy'
import { MatchingSetStudy } from '@/components/ielts/practice/MatchingSetStudy'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { findExerciseSet } from '@/lib/ielts/tests'

// 2 dạng bài tập dùng chung route/URL, khác component render theo set.kind — xem ExerciseSet (union) trong
// lib/ielts/practice.ts.
export default async function ExerciseSetPage({ params }: { params: Promise<{ skill: string; setId: string }> }) {
  await assertIeltsAccess()
  const { skill: rawSkill, setId } = await params
  const skill = parseSkill(rawSkill)
  const set = findExerciseSet(setId)
  if (!skill || !set || set.skill !== skill) notFound()
  if (set.kind === 'matching') return <MatchingSetStudy set={set} />
  return <ExerciseSetStudy set={set} />
}
