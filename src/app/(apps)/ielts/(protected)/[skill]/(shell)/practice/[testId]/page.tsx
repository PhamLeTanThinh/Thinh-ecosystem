import { notFound, redirect } from 'next/navigation'
import { ModeChooser } from '@/components/ielts/practice/ModeChooser'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { findListeningTest, findTest } from '@/lib/ielts/tests'

export default async function PracticeTestPage({ params }: { params: Promise<{ skill: string; testId: string }> }) {
  await assertIeltsAccess()
  const { skill: rawSkill, testId } = await params
  const skill = parseSkill(rawSkill)
  // Listening chỉ có 1 chế độ (tính giờ theo đề) → bỏ qua màn chọn chế độ
  if (skill === 'listening' && findListeningTest(testId)) redirect(`/ielts/listening/practice/${testId}/run`)
  const test = findTest(testId)
  // Đề phải thuộc đúng kỹ năng trên URL (không cho /ielts/reading/practice/<đề-listening>).
  if (!skill || !test || test.skill !== skill) notFound()
  return <ModeChooser test={test} />
}
