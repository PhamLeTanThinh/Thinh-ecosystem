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
  saveCards: (cards: KoreanCard[]) => putJSON('/api/korean/cards', cards),

  getProgress: () => getJSON<KoreanProgress>('/api/korean/progress'),
  saveProgress: (progress: KoreanProgress[]) => putJSON('/api/korean/progress', progress),

  getSettings: () => getObject<KoreanSettings>('/api/korean/settings'),
  saveSettings: (settings: KoreanSettings) => putObject('/api/korean/settings', settings),
}
