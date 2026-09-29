import { notFound } from 'next/navigation'
import { ListeningRunner } from '@/components/ielts/practice/ListeningRunner'
import { AnswerReview } from '@/components/ielts/practice/AnswerReview'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { findListeningTest, findTest } from '@/lib/ielts/tests'

export default async function ReviewPage({ params }: { params: Promise<{ skill: string; testId: string }> }) {
  // Trang này gửi đáp án xuống client nên phải chặn TRƯỚC khi đụng dữ liệu đề.
  await assertIeltsAccess()
  const { skill: rawSkill, testId } = await params
  const skill = parseSkill(rawSkill)
  const listening = skill === 'listening' ? findListeningTest(testId) : undefined
  if (listening) return <ListeningRunner key={listening.id} test={listening} initialView="review" />
  const test = findTest(testId)
  if (!skill || !test || test.skill !== skill) notFound()
  return <AnswerReview test={test} />
}
