import type { CertViewStat } from '@/lib/certs/viewTypes'

// Một dòng trong bảng "Hồ sơ học Certs" ở /admin — xem /api/certs/profiles.
export interface CertsProfileStat {
  id: string
  displayName: string | null
  registered: boolean // đã có tên trong sổ đăng ký hồ sơ (false = hồ sơ cũ chỉ có tiến độ)
  visits: number
  lastSeenAt: string | null
  lastBrowser: string | null
  questions: number
  correct: number
  wrong: number
  attempts: number
  avgScore: number | null // % đúng trung bình các lượt thi đã lưu
  certs: string[]
  lastStudyAt: string | null
  certViews: CertViewStat[] // cert nào đã mở, bao nhiêu lần (lib/certs/views.ts)
}
