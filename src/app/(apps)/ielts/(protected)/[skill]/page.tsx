import { redirect } from 'next/navigation'

// /ielts/<skill> mở mục đầu tiên của menu: Kiến thức.
export default async function SkillHomePage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill } = await params
  redirect(`/ielts/${skill}/lessons`)
}
