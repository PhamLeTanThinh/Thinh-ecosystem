import { notFound } from 'next/navigation'
import { PracticeDictation } from '@/components/ielts/practice/PracticeDictation'
import { assertIeltsAccess } from '@/lib/ielts/access'
import { parseSkill } from '@/lib/ielts/skills'
import { dictationSummariesForSkill } from '@/lib/ielts/tests'

// Danh sách bài Dictation (chỉ Listening có) — số trang + quyển lọc nằm trên URL (?page=&book=).
export default async function PracticeDictationPage({ params, searchParams }: { params: Promise<{ skill: string }>; searchParams: Promise<{ page?: string; book?: string }> }) {
  await assertIeltsAccess()
  const skill = parseSkill((await params).skill)
  if (!skill) notFound()
  const items = dictationSummariesForSkill(skill)
  if (items.length === 0) notFound()
  const sp = await searchParams
  const page = Number.parseInt(sp.page ?? '1', 10)
  const book = sp.book && items.some((d) => d.book === sp.book) ? sp.book : 'all'
  return <PracticeDictation skill={skill} items={items} initialPage={Number.isFinite(page) && page > 0 ? page : 1} initialBook={book} />
}
