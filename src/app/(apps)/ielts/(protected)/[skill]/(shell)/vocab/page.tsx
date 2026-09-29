import { notFound } from 'next/navigation'
import { PracticeVocab } from '@/components/ielts/practice/PracticeVocab'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { vocabForSkill } from '@/lib/ielts/tests'

export default async function PracticeVocabPage({ params, searchParams }: { params: Promise<{ skill: string }>; searchParams: Promise<{ page?: string }> }) {
  await assertIeltsAccess()
  const skill = parseSkill((await params).skill)
  if (!skill) notFound()
  const page = Number.parseInt((await searchParams).page ?? '1', 10)
  return <PracticeVocab skill={skill} groups={vocabForSkill(skill)} initialPage={Number.isFinite(page) && page > 0 ? page : 1} />
}
