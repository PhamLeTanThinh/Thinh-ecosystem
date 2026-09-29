import { notFound, redirect } from 'next/navigation'
import { TestResult } from '@/components/ielts/practice/TestResult'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { findListeningTest, findTest } from '@/lib/ielts/tests'

// Màn kết quả sau khi nộp bài. Nằm ngoài nhóm (shell) như /run và /start nên không có sidebar.
export default async function ResultPage({ params }: { params: Promise<{ skill: string; testId: string }> }) {
  // Trang này gửi đáp án xuống client nên phải chặn TRƯỚC khi đụng dữ liệu đề.
  await assertIeltsAccess()
  const { skill: rawSkill, testId } = await params
  const skill = parseSkill(rawSkill)
  // Listening hiện kết quả ngay trong màn làm bài; vào thẳng /result thì chuyển sang trang xem lại
  if (skill === 'listening' && findListeningTest(testId)) redirect(`/ielts/listening/practice/${testId}/review`)
  const test = findTest(testId)
  if (!skill || !test || test.skill !== skill) notFound()
  return <TestResult test={test} />
}
