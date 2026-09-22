import type { CSSProperties } from 'react'
import type { Skill } from './types'

// accent: màu nhấn riêng của kỹ năng, dùng cho menu trái (ô icon, thanh mục đang chọn).
export const SKILLS: { key: Skill; label: string; icon: string; accent: string }[] = [
  { key: 'listening', label: 'Listening', icon: '🎧', accent: '#3b7dd8' },
  { key: 'speaking', label: 'Speaking', icon: '🗣️', accent: '#e08a2e' },
  { key: 'reading', label: 'Reading', icon: '📖', accent: '#c9667a' },
  { key: 'writing', label: 'Writing', icon: '✍️', accent: '#2f9e6f' },
]

// Đoạn [skill] trên URL → Skill hợp lệ, hoặc null (route gọi notFound()).
export function parseSkill(raw: string): Skill | null {
  return SKILLS.find((s) => s.key === raw)?.key ?? null
}

export function skillMeta(skill: Skill) {
  return SKILLS.find((s) => s.key === skill)
}

// Biến CSS --nav-accent (màu kỹ năng) để gắn inline vào phần tử gốc của 1 trang; mọi lớp ih-les-* / menu
// trái đều đọc màu từ biến này nên các trang trong cùng kỹ năng luôn cùng tông.
export function accentVars(skill: Skill): CSSProperties {
  return { '--nav-accent': skillMeta(skill)?.accent ?? '#c9667a' } as CSSProperties
}

export function skillLabel(skill: Skill): string {
  return SKILLS.find((s) => s.key === skill)?.label ?? skill
}
