export interface Tool {
  href: string
  icon: string
  title: string
  description: string
  accent: string
}

/** Các app dùng để học — hiển thị ở /study. */
export const STUDY_TOOLS: Tool[] = [
  { href: '/korean', icon: '한', title: 'Tiếng Hàn', description: 'Từ vựng & ngữ pháp theo 18 bài Seoul Korean 2 — flashcard, trắc nghiệm.', accent: '#ff4d6d' },
  { href: '/chinese', icon: '中', title: 'Tiếng Trung', description: 'Ôn từ vựng bằng flashcard, pinyin hiện cùng mặt Hán tự hoặc mặt tiếng Việt.', accent: '#ffb020' },
  { href: '/ielts', icon: 'EN', title: 'IELTS Hub', description: 'Kiến thức IELTS theo kỹ năng — Listening, Speaking, Reading, Writing, Từ vựng.', accent: '#22d3ee' },
  { href: '/vitrine', icon: '3D', title: 'Vitrine', description: 'Từ vựng đa ngôn ngữ (VI · EN · 日本語 · 한국어) qua không gian vật thể 3D.', accent: '#a78bfa' },
]

/** Các app dùng hàng ngày — hiển thị ở /tools. */
export const DAILY_TOOLS: Tool[] = [
  { href: '/money', icon: '¥', title: 'Thu Chi', description: 'Theo dõi thu chi cá nhân theo ví, theo tháng.', accent: '#4ade80' },
  { href: '/habits', icon: '✓', title: 'Thói Quen', description: 'Theo dõi thói quen, streak và sức khoẻ mỗi ngày.', accent: '#60a5fa' },
  { href: '/notes', icon: '✎', title: 'Ghi Chú', description: 'Bảng ghi chú tự do, tự động nhóm theo tuần / tháng / năm.', accent: '#fb923c' },
]
