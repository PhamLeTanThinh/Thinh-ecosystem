import { notFound } from 'next/navigation'
import { ModeChooser } from '@/components/ielts/practice/ModeChooser'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { findTest } from '@/lib/ielts/tests'

export default async function PracticeTestPage({ params }: { params: Promise<{ skill: string; testId: string }> }) {
  await assertIeltsAccess()
  const { skill: rawSkill, testId } = await params
  const skill = parseSkill(rawSkill)
  const test = findTest(testId)
  // Đề phải thuộc đúng kỹ năng trên URL (không cho /ielts/reading/practice/<đề-listening>).
  if (!skill || !test || test.skill !== skill) notFound()
  return <ModeChooser test={test} />
}
