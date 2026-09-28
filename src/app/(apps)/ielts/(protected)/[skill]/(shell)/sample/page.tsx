import { notFound } from 'next/navigation'
import { PracticeSamples } from '@/components/ielts/practice/PracticeSamples'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { sampleSummariesForSkill } from '@/lib/ielts/tests'

export default async function PracticeSamplesPage({ params }: { params: Promise<{ skill: string }> }) {
  await assertIeltsAccess()
  const skill = parseSkill((await params).skill)
  if (!skill) notFound()
  return <PracticeSamples skill={skill} samples={sampleSummariesForSkill(skill)} />
}
