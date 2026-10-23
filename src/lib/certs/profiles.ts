// Một dòng trong bảng "Hồ sơ học Certs" ở /admin — xem /api/certs/profiles.
export interface CertsProfileStat {
  id: string
  displayName: string | null
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
}
