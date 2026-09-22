import { notFound } from 'next/navigation'
import { PracticeList } from '@/components/ielts/practice/PracticeList'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { summariesForSkill } from '@/lib/ielts/tests'

export default async function PracticeListPage({ params }: { params: Promise<{ skill: string }> }) {
  await assertIeltsAccess()
  const skill = parseSkill((await params).skill)
  if (!skill) notFound()
  return <PracticeList skill={skill} tests={summariesForSkill(skill)} />
}
