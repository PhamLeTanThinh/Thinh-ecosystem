// Bucket list — 100 điều muốn đạt được trước khi chết (/bucketlist). Mỗi điều nằm ở 1 ô cố định 1..100.
export const BUCKET_SIZE = 100

export type BucketStatus = 'todo' | 'doing' | 'done'

// Ảnh kỷ niệm lưu trên R2 — key để xoá, url để hiển thị
export interface BucketPhoto {
  key: string
  url: string
}

export const BUCKET_MAX_PHOTOS = 12

export interface BucketItem {
  id: string
  slot: number // 1..BUCKET_SIZE
  title: string
  note: string // vì sao muốn làm — viết lúc đặt mục tiêu
  memory: string // kỷ niệm — viết khi đã làm được
  photos: BucketPhoto[] // ảnh kỷ niệm
  category: BucketCategory
  status: BucketStatus
  achievedAt: string | null // 'YYYY-MM-DD'
}

export const BUCKET_CATEGORIES = [
  { key: 'travel', icon: '✈️', label: 'Du lịch' },
  { key: 'career', icon: '💼', label: 'Sự nghiệp' },
  { key: 'learning', icon: '📚', label: 'Học tập' },
  { key: 'health', icon: '💪', label: 'Sức khoẻ' },
  { key: 'family', icon: '❤️', label: 'Gia đình & bạn bè' },
  { key: 'experience', icon: '🎢', label: 'Trải nghiệm' },
  { key: 'finance', icon: '💰', label: 'Tài chính' },
  { key: 'creative', icon: '🎨', label: 'Sáng tạo' },
  { key: 'giving', icon: '🤝', label: 'Cho đi' },
  { key: 'other', icon: '✨', label: 'Khác' },
] as const

export type BucketCategory = (typeof BUCKET_CATEGORIES)[number]['key']

export const BUCKET_STATUSES: { key: BucketStatus; label: string }[] = [
  { key: 'todo', label: 'Chưa làm' },
  { key: 'doing', label: 'Đang làm' },
  { key: 'done', label: 'Đã đạt' },
]

export function categoryOf(key: string) {
  return BUCKET_CATEGORIES.find((c) => c.key === key) ?? BUCKET_CATEGORIES[BUCKET_CATEGORIES.length - 1]
}

export function isBucketCategory(key: unknown): key is BucketCategory {
  return BUCKET_CATEGORIES.some((c) => c.key === key)
}

export function isBucketStatus(key: unknown): key is BucketStatus {
  return key === 'todo' || key === 'doing' || key === 'done'
}
