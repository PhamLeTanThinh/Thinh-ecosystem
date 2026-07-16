import type { ChineseCard, ChineseDeck, ChineseProgress, ChineseSettings } from './types'

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

// Backed by Postgres via /api/chinese/* — mirrors lib/habits/storage.ts's bulk-replace convention.
export const storage = {
  getCards: () => getJSON<ChineseCard>('/api/chinese/cards'),
  saveCards: (cards: ChineseCard[]) => putJSON('/api/chinese/cards', cards),

  getProgress: () => getJSON<ChineseProgress>('/api/chinese/progress'),
  saveProgress: (progress: ChineseProgress[]) => putJSON('/api/chinese/progress', progress),

  getSettings: () => getObject<ChineseSettings>('/api/chinese/settings'),
  saveSettings: (settings: ChineseSettings) => putObject('/api/chinese/settings', settings),

  getDecks: () => getJSON<ChineseDeck>('/api/chinese/decks'),
  saveDecks: (decks: ChineseDeck[]) => putJSON('/api/chinese/decks', decks),
}
