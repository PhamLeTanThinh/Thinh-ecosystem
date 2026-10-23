import type { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'
import { db } from '@/lib/db'
import { learnerVisits } from '@/db/schema'

// Các app dùng chung hồ sơ học (lib/learner/identity.ts) — mỗi lần mở 1 app ghi 1 lượt vào learner_visits.
export const LEARNER_APPS = ['chinese', 'korean', 'certs'] as const
export type LearnerApp = (typeof LEARNER_APPS)[number]

export function toLearnerApp(value: unknown): LearnerApp | null {
  return LEARNER_APPS.includes(value as LearnerApp) ? (value as LearnerApp) : null
}

// await thay vì fire-and-forget: trên serverless (Vercel) hàm có thể bị đóng trước khi promise chạy xong.
// Lỗi ghi log không được làm hỏng request chính.
export async function logLearnerVisit(req: NextRequest, learnerId: string, app: LearnerApp): Promise<void> {
  try {
    await db.insert(learnerVisits).values({ id: nanoid(), learnerId, app, userAgent: req.headers.get('user-agent') ?? '' })
  } catch (err) {
    console.error('[learner visit]', err)
  }
}
