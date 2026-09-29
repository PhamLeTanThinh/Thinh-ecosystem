import { notFound } from 'next/navigation'
import { AttemptHistory } from '@/components/ielts/practice/AttemptHistory'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { findListeningTest, findTest } from '@/lib/ielts/tests'

export default async function HistoryPage({ params }: { params: Promise<{ skill: string; testId: string }> }) {
  await assertIeltsAccess()
  const { skill: rawSkill, testId } = await params
  const skill = parseSkill(rawSkill)
  const listening = skill === 'listening' ? findListeningTest(testId) : undefined
  if (skill && listening) return <AttemptHistory skill={skill} testId={listening.id} title={listening.title} />
  const test = findTest(testId)
  if (!skill || !test || test.skill !== skill) notFound()
  return <AttemptHistory skill={skill} testId={test.id} title={test.title} />
}
