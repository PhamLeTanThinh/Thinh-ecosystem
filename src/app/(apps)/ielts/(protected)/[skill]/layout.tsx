import { notFound } from 'next/navigation'
import { parseSkill } from '@/lib/ielts/skills'

// Chặn mọi URL /ielts/<gì-đó> không phải kỹ năng hợp lệ (vd /ielts/abc) ngay từ layout — các trang con
// khỏi phải tự kiểm tra lại. (Layout KHÔNG chặn được dữ liệu, xem assertIeltsAccess ở các trang đề.)
export default async function SkillLayout({ children, params }: { children: React.ReactNode; params: Promise<{ skill: string }> }) {
  const { skill } = await params
  if (!parseSkill(skill)) notFound()
  return children
}
