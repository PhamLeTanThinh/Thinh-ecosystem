import type { Skill } from './types'

export const SKILLS: { key: Skill; label: string; icon: string }[] = [
  { key: 'listening', label: 'Listening', icon: '🎧' },
  { key: 'speaking', label: 'Speaking', icon: '🗣️' },
  { key: 'reading', label: 'Reading', icon: '📖' },
  { key: 'writing', label: 'Writing', icon: '✍️' },
]

export function skillLabel(skill: Skill): string {
  return SKILLS.find((s) => s.key === skill)?.label ?? skill
}
