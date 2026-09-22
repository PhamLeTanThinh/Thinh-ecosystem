import { notFound } from 'next/navigation'
import { VocabSetStudy } from '@/components/ielts/practice/VocabSetStudy'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { vocabForSkill } from '@/lib/ielts/tests'

export default async function VocabSetPage({ params }: { params: Promise<{ skill: string; testId: string }> }) {
  await assertIeltsAccess()
  const { skill: rawSkill, testId } = await params
  const skill = parseSkill(rawSkill)
  const group = skill ? vocabForSkill(skill).find((g) => g.testId === testId) : undefined
  if (!skill || !group) notFound()
  return <VocabSetStudy group={group} />
}
