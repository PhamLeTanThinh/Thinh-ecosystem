import { notFound } from 'next/navigation'
import { PracticeVocab } from '@/components/ielts/practice/PracticeVocab'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { vocabForSkill } from '@/lib/ielts/tests'

export default async function PracticeVocabPage({ params }: { params: Promise<{ skill: string }> }) {
  await assertIeltsAccess()
  const skill = parseSkill((await params).skill)
  if (!skill) notFound()
  return <PracticeVocab skill={skill} groups={vocabForSkill(skill)} />
}
