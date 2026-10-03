import 'server-only'
import { db } from '@/lib/db'
import { ieltsPracticeState } from '@/db/schema'
import { PRACTICE_KEYS } from '@/lib/ielts/practiceSync'
import { practiceItemInfo, vocabCount } from '@/lib/ielts/tests'
import type { Skill } from '@/lib/ielts/types'

// Tóm tắt dữ liệu luyện đề IELTS (bảng ielts_practice_state, đồng bộ từ localStorage — xem lib/ielts/practiceSync.ts)
// của MỌI người cho tab "Người xem IELTS" ở /admin: kết quả từng đề (lịch sử nộp), bài làm dở, highlight, từ vựng
// đã thuộc / yêu thích, bài tập, dictation. ownerKey = email (chữ thường) hoặc 'owner' khi chưa bật chia sẻ.

export interface PracticeTestResult {
  id: string
  title: string
  skill: Skill | null
  best: number
  total: number
  attempts: number
  lastAt: string
  lastScore: number | null
  history: { at: string; score: number; total: number; mode: string }[] // mới nhất trước
}

export interface PracticeProgressItem {
  id: string
  title: string
  skill: Skill | null
  done: number
  total: number | null
}

export interface PracticeSummary {
  updatedAt: string | null
  submissions: number
  tests: PracticeTestResult[]
  drafts: { id: string; title: string; skill: Skill | null; mode: string; answered: number; total: number | null }[]
  highlights: { id: string; title: string; count: number }[]
  vocab: PracticeProgressItem[]
  favs: number
  exercises: PracticeProgressItem[]
  dictation: PracticeProgressItem[]
}

type Rec<T> = Record<string, T>

const info = (id: string) => practiceItemInfo(id)
const titleOf = (id: string) => info(id)?.title ?? id
// Không còn trong dữ liệu đề (đề đã gỡ / đổi id) thì đoán kỹ năng theo tiền tố id: 'listening-…', 'reading-…'
const SKILLS: Skill[] = ['listening', 'reading', 'writing', 'speaking']
const skillOf = (id: string) => info(id)?.skill ?? SKILLS.find((sk) => id.startsWith(`${sk}-`)) ?? null

export async function practiceSummaries(): Promise<Record<string, PracticeSummary>> {
  const rows = await db.select().from(ieltsPracticeState)
  const byOwner = new Map<string, { updatedAt: Date; data: Rec<unknown> }>()
  for (const r of rows) {
    const cur = byOwner.get(r.ownerKey) ?? { updatedAt: r.updatedAt, data: {} }
    if (r.updatedAt > cur.updatedAt) cur.updatedAt = r.updatedAt
    cur.data[r.key] = r.value
    byOwner.set(r.ownerKey, cur)
  }

  const out: Record<string, PracticeSummary> = {}
  for (const [owner, { updatedAt, data }] of byOwner) {
    const attempts = (data[PRACTICE_KEYS.attempts] ?? {}) as Rec<{ best: number; total: number; lastAt: string; history?: { at: string; score: number; total: number; mode: string }[] }>
    const drafts = (data[PRACTICE_KEYS.drafts] ?? {}) as Rec<{ mode: string; answers?: Rec<string> }>
    const notes = (data[PRACTICE_KEYS.notes] ?? {}) as Rec<unknown[]>
    const learned = (data[PRACTICE_KEYS.learned] ?? {}) as Rec<string[]>
    const favs = data[PRACTICE_KEYS.favs]
    const exercises = (data[PRACTICE_KEYS.exerciseProgress] ?? {}) as Rec<string[]>
    const dictation = (data[PRACTICE_KEYS.dictation] ?? {}) as Rec<{ done?: number[] }>

    const tests: PracticeTestResult[] = Object.entries(attempts)
      .map(([id, a]) => {
        const history = [...(a.history ?? [])].sort((x, y) => y.at.localeCompare(x.at)).map(({ at, score, total, mode }) => ({ at, score, total, mode }))
        return {
          id,
          title: titleOf(id),
          skill: skillOf(id),
          best: a.best,
          total: a.total,
          attempts: history.length || 1,
          lastAt: a.lastAt,
          lastScore: history[0]?.score ?? null,
          history,
        }
      })
      .sort((x, y) => y.lastAt.localeCompare(x.lastAt))

    out[owner] = {
      updatedAt: updatedAt.toISOString(),
      submissions: tests.reduce((n, t) => n + t.attempts, 0),
      tests,
      drafts: Object.entries(drafts).map(([id, d]) => ({
        id,
        title: titleOf(id),
        skill: skillOf(id),
        mode: d.mode,
        answered: Object.values(d.answers ?? {}).filter((v) => v !== '' && v != null).length,
        total: info(id)?.total ?? null,
      })),
      highlights: Object.entries(notes)
        .filter(([, list]) => Array.isArray(list) && list.length > 0)
        .map(([id, list]) => ({ id, title: titleOf(id), count: list.length })),
      vocab: Object.entries(learned)
        .filter(([, words]) => words.length > 0)
        .map(([id, words]) => ({ id, title: titleOf(id), skill: skillOf(id), done: words.length, total: vocabCount(id) ?? null })),
      favs: Array.isArray(favs) ? favs.length : favs && typeof favs === 'object' ? Object.values(favs as Rec<unknown[]>).reduce((n, v) => n + (Array.isArray(v) ? v.length : 1), 0) : 0,
      exercises: Object.entries(exercises)
        .filter(([, ids]) => ids.length > 0)
        .map(([id, ids]) => ({ id, title: titleOf(id), skill: skillOf(id), done: ids.length, total: info(id)?.total ?? null })),
      dictation: Object.entries(dictation).map(([id, p]) => ({ id, title: titleOf(id), skill: 'listening' as Skill, done: p.done?.length ?? 0, total: info(id)?.total ?? null })),
    }
  }
  return out
}
