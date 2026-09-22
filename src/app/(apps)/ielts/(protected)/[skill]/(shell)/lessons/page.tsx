import { notFound } from 'next/navigation'
import { LessonsIndex } from '@/components/ielts/LessonsIndex'
import { parseSkill } from '@/lib/ielts/skills'

export default async function LessonsPage({ params }: { params: Promise<{ skill: string }> }) {
  const skill = parseSkill((await params).skill)
  if (!skill) notFound()
  return <LessonsIndex skill={skill} />
}
