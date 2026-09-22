import { notFound } from 'next/navigation'
import { TestRunner } from '@/components/ielts/practice/TestRunner'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { type PracticeMode } from '@/lib/ielts/practice'
import { parseSkill } from '@/lib/ielts/skills'
import { findTest } from '@/lib/ielts/tests'

// Màn làm bài: nằm ngoài nhóm (shell) nên không có topbar — TestRunner tự chiếm toàn màn hình.
export default async function RunPage({ params, searchParams }: { params: Promise<{ skill: string; testId: string }>; searchParams: Promise<{ mode?: string | string[] }> }) {
  // Chặn TRƯỚC khi đụng tới dữ liệu đề: đây là trang duy nhất gửi cả bài đọc lẫn đáp án xuống client.
  await assertIeltsAccess()
  const { skill: rawSkill, testId } = await params
  const skill = parseSkill(rawSkill)
  const test = findTest(testId)
  if (!skill || !test || test.skill !== skill) notFound()
  // Thiếu / sai ?mode= thì mặc định luyện tập (chế độ an toàn, không tính giờ).
  const mode: PracticeMode = (await searchParams).mode === 'real' ? 'real' : 'practice'
  // key theo đề + chế độ để đổi ?mode= (hoặc sang đề khác) luôn làm mới bài, không giữ đáp án cũ.
  return <TestRunner key={`${test.id}:${mode}`} test={test} mode={mode} />
}
