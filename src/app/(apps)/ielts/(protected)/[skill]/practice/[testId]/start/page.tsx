import { notFound } from 'next/navigation'
import { TestIntro } from '@/components/ielts/practice/TestIntro'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { type PracticeMode } from '@/lib/ielts/practice'
import { parseSkill } from '@/lib/ielts/skills'
import { findTest } from '@/lib/ielts/tests'

// Màn giới thiệu đề trước khi làm bài. Nằm ngoài nhóm (shell) như /run nên không có sidebar.
export default async function StartPage({ params, searchParams }: { params: Promise<{ skill: string; testId: string }>; searchParams: Promise<{ mode?: string | string[] }> }) {
  await assertIeltsAccess()
  const { skill: rawSkill, testId } = await params
  const skill = parseSkill(rawSkill)
  const test = findTest(testId)
  if (!skill || !test || test.skill !== skill) notFound()
  const mode: PracticeMode = (await searchParams).mode === 'real' ? 'real' : 'practice'
  return <TestIntro test={test} mode={mode} />
}
