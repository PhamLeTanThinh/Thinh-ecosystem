import type { KoreanCard, KoreanProgress, KoreanSettings } from './types'

async function getJSON<T>(url: string): Promise<T[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`)
  return res.json()
}

async function putJSON<T>(url: string, body: T[]): Promise<void> {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PUT ${url} failed: ${res.status}`)
}

async function postJSON<TIn, TOut>(url: string, body: TIn): Promise<TOut> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`)
  return res.json()
}

async function getObject<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`)
  return res.json()
}

async function putObject<T>(url: string, body: T): Promise<void> {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PUT ${url} failed: ${res.status}`)
}

// Backed by Postgres via /api/korean/* — mirrors lib/chinese/storage.ts's bulk-replace convention.
export const storage = {
  getCards: () => getJSON<KoreanCard>('/api/korean/cards'),
  // Chỉ dùng để seed lần đầu khi DB rỗng (server chặn PUT bằng requireAdminApi — xem api/korean/cards/route.ts).
  saveCards: (cards: KoreanCard[]) => putJSON('/api/korean/cards', cards),
  // Thêm 1 thẻ mới, gắn với hồ sơ đang đăng nhập — server tự sinh id, không sửa/xoá được thẻ đã có.
  addCard: (input: Omit<KoreanCard, 'id' | 'sortOrder' | 'createdAt'>) => postJSON<typeof input, KoreanCard>('/api/korean/cards', input),

  getProgress: () => getJSON<KoreanProgress>('/api/korean/progress'),
  saveProgress: (progress: KoreanProgress[]) => putJSON('/api/korean/progress', progress),

  getSettings: () => getObject<KoreanSettings>('/api/korean/settings'),
  saveSettings: (settings: KoreanSettings) => putObject('/api/korean/settings', settings),
}
