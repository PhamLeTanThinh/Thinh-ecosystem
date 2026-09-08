import type { IeltsPage, VocabEntry } from './types'

export interface SearchResult {
  type: 'page' | 'vocab'
  id: string
  title: string
  snippet: string
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFC')
}

export function searchAll(pages: IeltsPage[], vocab: VocabEntry[], query: string): SearchResult[] {
  const q = normalize(query.trim())
  if (!q) return []

  const results: SearchResult[] = []

  for (const p of pages) {
    const plain = stripHtml(p.content)
    const hitTitle = normalize(p.title).includes(q)
    const hitContent = normalize(plain).includes(q)
    if (hitTitle || hitContent) {
      results.push({
        type: 'page',
        id: p.id,
        title: p.title,
        snippet: hitTitle ? plain.slice(0, 80) : excerptAround(plain, q),
      })
    }
  }

  for (const v of vocab) {
    const haystack = normalize(`${v.word} ${v.meaning} ${v.topic} ${v.example}`)
    if (haystack.includes(q)) {
      results.push({
        type: 'vocab',
        id: v.id,
        title: v.word,
        snippet: v.meaning,
      })
    }
  }

  return results
}

function excerptAround(text: string, q: string): string {
  const idx = normalize(text).indexOf(q)
  if (idx === -1) return text.slice(0, 80)
  const start = Math.max(0, idx - 30)
  return `${start > 0 ? '…' : ''}${text.slice(start, start + 90)}…`
}
