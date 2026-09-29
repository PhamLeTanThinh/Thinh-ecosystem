import { notFound } from 'next/navigation'
import { PracticeSamples } from '@/components/ielts/practice/PracticeSamples'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { sampleSummariesForSkill } from '@/lib/ielts/tests'

export default async function PracticeSamplesPage({
  params,
  searchParams,
}: {
  params: Promise<{ skill: string }>
  searchParams: Promise<{ page?: string; task?: string }>
}) {
  await assertIeltsAccess()
  const skill = parseSkill((await params).skill)
  if (!skill) notFound()
  const sp = await searchParams
  const page = Number.parseInt(sp.page ?? '1', 10)
  const task = sp.task === '1' ? 1 : sp.task === '2' ? 2 : 'all'
  return (
    <PracticeSamples
      skill={skill}
      samples={sampleSummariesForSkill(skill)}
      initialPage={Number.isFinite(page) && page > 0 ? page : 1}
      initialTask={task}
    />
  )
}
