// Đồng bộ trạng thái luyện đề IELTS giữa localStorage (bộ nhớ đệm đồng bộ cho UI) và database
// (bảng ielts_practice_state, xem /api/ielts/practice-state). Không import practice.ts để tránh vòng
// phụ thuộc — practice.ts gọi markDirty() sau mỗi lần ghi.
//
// - Ghi: markDirty(key) đánh dấu thời điểm sửa + đẩy nền (debounce) cục JSON của key đó lên DB.
// - Đọc: syncPractice() chạy 1 lần khi vào /ielts, trộn dữ liệu DB về localStorage TRƯỚC khi UI đọc
//   (xem PracticeSyncGate). Lịch sử nộp bài (attempts) được hợp nhất theo từng lần nộp; các mục còn lại
//   (bài làm dở, highlight, từ đã thuộc, tuỳ chọn) lấy bản sửa sau cùng.

export const PRACTICE_KEYS = {
  attempts: 'ielts-practice-attempts',
  drafts: 'ielts-practice-drafts',
  notes: 'ielts-practice-notes',
  learned: 'ielts-vocab-learned',
  prefs: 'ielts-run-prefs',
} as const

const META_KEY = 'ielts-sync-meta' // { [key]: thời điểm sửa cuối (epoch ms) }
const PUSH_DELAY_MS = 1500
const MAX_HISTORY = 30
const ALL_KEYS: string[] = Object.values(PRACTICE_KEYS)

type Meta = Record<string, number>
type Remote = Record<string, { value: unknown; updatedAt: number }>

function readMeta(): Meta {
  try {
    return JSON.parse(localStorage.getItem(META_KEY) ?? '{}') as Meta
  } catch {
    return {}
  }
}

function writeMeta(meta: Meta) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta))
  } catch {
    // bỏ qua
  }
}

function readLocal(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function push(key: string, keepalive = false): Promise<void> {
  const value = readLocal(key)
  if (value === null) return Promise.resolve()
  const updatedAt = readMeta()[key] ?? Date.now()
  return fetch('/api/ielts/practice-state', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Background': '1' },
    body: JSON.stringify({ key, value, updatedAt }),
    keepalive,
  })
    .then(() => undefined)
    .catch(() => undefined)
}

const pending = new Set<string>()
let timer: ReturnType<typeof setTimeout> | null = null
let listening = false

function flush(keepalive = false) {
  if (timer) clearTimeout(timer)
  timer = null
  for (const key of pending) void push(key, keepalive)
  pending.clear()
}

export function markDirty(key: string) {
  if (typeof window === 'undefined' || !ALL_KEYS.includes(key)) return
  writeMeta({ ...readMeta(), [key]: Date.now() })
  pending.add(key)
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => flush(), PUSH_DELAY_MS)
  if (!listening) {
    listening = true
    // Đóng tab/chuyển trang trước khi debounce kịp chạy thì đẩy nốt.
    window.addEventListener('pagehide', () => flush(true))
  }
}

interface AttemptRec {
  score: number
  at: string
  [k: string]: unknown
}
interface AttemptEntry {
  best: number
  total: number
  lastAt: string
  history?: AttemptRec[]
}

function mergeAttempts(a: Record<string, AttemptEntry>, b: Record<string, AttemptEntry>): Record<string, AttemptEntry> {
  const out: Record<string, AttemptEntry> = {}
  for (const id of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[id]
    const y = b[id]
    if (!x || !y) {
      out[id] = (x ?? y) as AttemptEntry
      continue
    }
    const seen = new Set<string>()
    const history = [...(x.history ?? []), ...(y.history ?? [])]
      .filter((h) => {
        const k = `${h.at}|${h.score}`
        if (seen.has(k)) return false
        seen.add(k)
        return true
      })
      .sort((p, q) => p.at.localeCompare(q.at))
      .slice(-MAX_HISTORY)
    const latest = history[history.length - 1]
    out[id] = {
      best: Math.max(x.best, y.best, ...history.map((h) => h.score)),
      total: latest ? (latest.total as number | undefined) ?? x.total : x.lastAt >= y.lastAt ? x.total : y.total,
      lastAt: latest?.at ?? (x.lastAt >= y.lastAt ? x.lastAt : y.lastAt),
      history,
    }
  }
  return out
}

let syncing: Promise<void> | null = null

// Chạy 1 lần mỗi lần tải trang. Lỗi mạng/DB thì bỏ qua — UI vẫn chạy bằng localStorage.
export function syncPractice(): Promise<void> {
  if (!syncing) syncing = doSync().catch(() => undefined)
  return syncing
}

async function doSync() {
  const res = await fetch('/api/ielts/practice-state')
  if (!res.ok) return
  const remote = (await res.json()) as Remote
  const meta = readMeta()
  const now = Date.now()
  const pushes: Promise<void>[] = []

  for (const key of ALL_KEYS) {
    const local = readLocal(key)
    const r = remote[key]
    // Dữ liệu cũ chưa có mốc sửa (từ trước khi có đồng bộ) coi là rất cũ: bản trên DB (nếu có) sẽ thắng.
    const localTs = meta[key] ?? (local ? 1 : 0)

    if (!r) {
      if (local) {
        meta[key] = Math.max(localTs, 1)
        pushes.push(push(key))
      }
      continue
    }

    if (key === PRACTICE_KEYS.attempts) {
      const merged = mergeAttempts((local ?? {}) as Record<string, AttemptEntry>, r.value as Record<string, AttemptEntry>)
      localStorage.setItem(key, JSON.stringify(merged))
      if (JSON.stringify(merged) === JSON.stringify(r.value)) {
        meta[key] = r.updatedAt
      } else {
        meta[key] = now
        pushes.push(push(key))
      }
    } else if (r.updatedAt > localTs) {
      localStorage.setItem(key, JSON.stringify(r.value))
      meta[key] = r.updatedAt
    } else if (localTs > r.updatedAt && local) {
      pushes.push(push(key))
    }
  }

  writeMeta(meta)
  await Promise.all(pushes)
}
