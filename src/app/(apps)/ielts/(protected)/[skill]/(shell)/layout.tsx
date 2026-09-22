import { notFound } from 'next/navigation'
import { SkillShell } from '@/components/ielts/SkillShell'
import { parseSkill } from '@/lib/ielts/skills'
import { summariesForSkill, vocabForSkill } from '@/lib/ielts/tests'

// Khung của 1 kỹ năng (sidebar Kiến thức / Làm đề / Vocab + topbar). Màn làm bài (/run) nằm NGOÀI nhóm
// (shell) này để chiếm trọn màn hình, không có sidebar.
export default async function SkillShellLayout({ children, params }: { children: React.ReactNode; params: Promise<{ skill: string }> }) {
  const skill = parseSkill((await params).skill)
  if (!skill) notFound()
  // Chỉ truyền SỐ ĐẾM xuống client (hiện ở dòng phụ của menu) — không phải nội dung đề. Nội dung đề vẫn
  // phải qua assertIeltsAccess ở từng trang.
  const counts = { tests: summariesForSkill(skill).length, vocabSets: vocabForSkill(skill).length }
  return (
    <SkillShell skill={skill} counts={counts}>
      {children}
    </SkillShell>
  )
}
