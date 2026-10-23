import { NextResponse } from 'next/server'
import { count, desc, isNotNull, max, sql, sum } from 'drizzle-orm'
import { db } from '@/lib/db'
import { certAccessLogs, certAttempts, certProgress, learnerProfiles } from '@/db/schema'
import { requireOwnerApi } from '@/lib/certs/access'
import type { CertsProfileStat } from '@/lib/certs/profiles'
import { detectBrowser } from '@/lib/ielts/userAgent'

// Theo dõi người học Certs theo HỒ SƠ HỌC (chế độ 'profile', xem lib/certs/settings.ts) — song song với
// /api/certs/access-logs (theo email). Gồm mọi hồ sơ đã vào Certs hoặc đã có tiến độ/lượt thi Certs.
export async function GET() {
  const forbidden = await requireOwnerApi()
  if (forbidden) return forbidden

  const [logs, progress, attempts, profiles] = await Promise.all([
    db
      .select({ id: certAccessLogs.learnerId, userAgent: certAccessLogs.userAgent, createdAt: certAccessLogs.createdAt })
      .from(certAccessLogs)
      .where(isNotNull(certAccessLogs.learnerId))
      .orderBy(desc(certAccessLogs.createdAt)),
    db
      .select({
        id: certProgress.learnerId,
        questions: count(),
        correct: sum(certProgress.correctCount),
        wrong: sum(certProgress.wrongCount),
        last: max(certProgress.lastReviewedAt),
        certs: sql<string[]>`array_agg(distinct ${certProgress.certId})`,
      })
      .from(certProgress)
      .groupBy(certProgress.learnerId),
    db
      .select({
        id: certAttempts.learnerId,
        n: count(),
        avg: sql<number>`avg(${certAttempts.correct}::float / nullif(${certAttempts.total}, 0))`.mapWith(Number),
        last: max(certAttempts.createdAt),
      })
      .from(certAttempts)
      .groupBy(certAttempts.learnerId),
    db.select({ id: learnerProfiles.id, displayName: learnerProfiles.displayName }).from(learnerProfiles),
  ])

  const names = new Map(profiles.map((p) => [p.id, p.displayName]))
  const byId = new Map<string, CertsProfileStat>()
  const get = (id: string) => {
    let s = byId.get(id)
    if (!s) {
      s = { id, displayName: names.get(id) ?? null, visits: 0, lastSeenAt: null, lastBrowser: null, questions: 0, correct: 0, wrong: 0, attempts: 0, avgScore: null, certs: [], lastStudyAt: null }
      byId.set(id, s)
    }
    return s
  }
  const later = (a: string | null, b: Date | null) => (b && (!a || b.toISOString() > a) ? b.toISOString() : a)

  // logs đã xếp mới nhất trước → dòng đầu tiên của mỗi hồ sơ là lần vào gần nhất.
  for (const l of logs) {
    const s = get(l.id!)
    if (s.visits === 0) {
      s.lastSeenAt = l.createdAt.toISOString()
      s.lastBrowser = detectBrowser(l.userAgent)
    }
    s.visits += 1
  }
  for (const r of progress) {
    const s = get(r.id)
    s.questions = r.questions
    s.correct = Number(r.correct ?? 0)
    s.wrong = Number(r.wrong ?? 0)
    s.certs = r.certs ?? []
    s.lastStudyAt = later(s.lastStudyAt, r.last)
  }
  for (const r of attempts) {
    const s = get(r.id)
    s.attempts = r.n
    s.avgScore = r.avg == null || Number.isNaN(r.avg) ? null : Math.round(r.avg * 100)
    s.lastStudyAt = later(s.lastStudyAt, r.last)
  }

  const recent = (s: CertsProfileStat) => [s.lastSeenAt, s.lastStudyAt].filter(Boolean).sort().pop() ?? ''
  return NextResponse.json([...byId.values()].sort((a, b) => recent(b).localeCompare(recent(a))))
}
