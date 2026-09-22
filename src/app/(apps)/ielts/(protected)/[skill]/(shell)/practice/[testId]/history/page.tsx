import { notFound } from 'next/navigation'
import { AttemptHistory } from '@/components/ielts/practice/AttemptHistory'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { findTest } from '@/lib/ielts/tests'

export default async function HistoryPage({ params }: { params: Promise<{ skill: string; testId: string }> }) {
  await assertIeltsAccess()
  const { skill: rawSkill, testId } = await params
  const skill = parseSkill(rawSkill)
  const test = findTest(testId)
  if (!skill || !test || test.skill !== skill) notFound()
  return <AttemptHistory skill={skill} testId={test.id} title={test.title} />
}
