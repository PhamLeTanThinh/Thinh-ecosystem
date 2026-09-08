export type Skill = 'listening' | 'speaking' | 'reading' | 'writing'

export interface IeltsPage {
  id: string
  skill: Skill
  title: string
  content: string // rich text HTML
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface VocabEntry {
  id: string
  word: string
  partOfSpeech: string
  meaning: string
  example: string
  band: string
  topic: string
  linkedPageId: string | null
  createdAt: string
}
