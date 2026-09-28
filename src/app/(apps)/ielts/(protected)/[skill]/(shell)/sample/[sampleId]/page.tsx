import { notFound } from 'next/navigation'
import { WritingSampleView } from '@/components/ielts/practice/WritingSampleView'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { findSample } from '@/lib/ielts/tests'

export default async function WritingSamplePage({ params }: { params: Promise<{ skill: string; sampleId: string }> }) {
  await assertIeltsAccess()
  const { skill: rawSkill, sampleId } = await params
  const skill = parseSkill(rawSkill)
  const sample = findSample(sampleId)
  if (!skill || !sample || sample.skill !== skill) notFound()
  return <WritingSampleView sample={sample} />
}
