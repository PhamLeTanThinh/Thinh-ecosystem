import type { StickyNote } from './types'

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

// Backed by Postgres via /api/notes — mirrors lib/habits/storage.ts's bulk-replace convention.
export const storage = {
  getNotes: () => getJSON<StickyNote>('/api/notes'),
  saveNotes: (notes: StickyNote[]) => putJSON('/api/notes', notes),
}
