import { notFound } from 'next/navigation'
import { LessonView } from '@/components/ielts/LessonView'
import { parseSkill } from '@/lib/ielts/skills'

export default async function LessonPage({ params }: { params: Promise<{ skill: string; pageId: string }> }) {
  const { skill: rawSkill, pageId } = await params
  const skill = parseSkill(rawSkill)
  if (!skill) notFound()
  return <LessonView skill={skill} pageId={pageId} />
}
