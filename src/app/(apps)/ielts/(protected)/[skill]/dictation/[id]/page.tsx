import { notFound } from 'next/navigation'
import { DictationRunner } from '@/components/ielts/practice/DictationRunner'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { findDictation } from '@/lib/ielts/tests'

// Màn luyện 1 bài Dictation — nằm NGOÀI nhóm (shell) để chiếm trọn màn hình (không có sidebar), giống màn làm đề.
export default async function DictationRunPage({ params }: { params: Promise<{ skill: string; id: string }> }) {
  await assertIeltsAccess()
  const { skill: rawSkill, id } = await params
  const skill = parseSkill(rawSkill)
  if (skill !== 'listening') notFound()
  const dictation = findDictation(decodeURIComponent(id))
  if (!dictation) notFound()
  return <DictationRunner dictation={dictation} backHref={`/ielts/${skill}/dictation`} />
}
