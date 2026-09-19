import { APP_BRAND } from './brand'

// Hiệu ứng hạt riêng của từng thẻ ở /study (xem components/study/CardFx.tsx).
export type CardEffect = 'sakura' | 'embers' | 'snow' | 'notes'

export interface Tool {
  href: string
  icon: string
  title: string
  description: string
  accent: string
  // Clip linh vật làm khung ảnh của thẻ ở /study (chỉ các app học mới dùng).
  video?: string
  effect?: CardEffect
}

/** Các app dùng để học — hiển thị ở /study. */
export const STUDY_TOOLS: Tool[] = [
  { href: '/korean', icon: '한', title: '한국어 Hub', description: 'Từ vựng & ngữ pháp theo 18 bài Seoul Korean 2 — flashcard, trắc nghiệm.', accent: APP_BRAND.korean, video: '/preloader/video/korean.mp4', effect: 'sakura' },
  { href: '/chinese', icon: '中', title: '中文 Hub', description: 'Ôn từ vựng bằng flashcard, pinyin hiện cùng mặt Hán tự hoặc mặt tiếng Việt.', accent: APP_BRAND.chinese, video: '/preloader/video/chinese.mp4', effect: 'embers' },
  { href: '/ielts', icon: 'EN', title: 'IELTS Hub', description: 'Kiến thức IELTS theo kỹ năng — Listening, Speaking, Reading, Writing, Từ vựng.', accent: APP_BRAND.ielts, video: '/preloader/video/ielts.mp4', effect: 'snow' },
  // Vitrine tạm ẩn khỏi /study (chưa show lên) — thẻ ở vị trí này giờ là Music, dùng lại đúng
  // clip + hiệu ứng hạt "notes" đã có sẵn (rất hợp cho app nhạc). Bật lại Vitrine bằng cách thêm
  // lại object cũ: { href: '/vitrine', icon: '3D', title: 'Vitrine', description: 'Từ vựng đa
  // ngôn ngữ (VI · EN · 日本語 · 한국어) qua không gian vật thể 3D.', accent: APP_BRAND.vitrine,
  // video: '/preloader/video/music.mp4', effect: 'notes' }.
  { href: '/music', icon: '♪', title: 'Music Hub', description: 'Học nốt nhạc và lưu lại những bản nhạc yêu thích của bạn.', accent: APP_BRAND.music, video: '/preloader/video/music.mp4', effect: 'notes' },
]

/** Các app dùng hàng ngày — hiển thị ở /tools. */
export const DAILY_TOOLS: Tool[] = [
  { href: '/money', icon: '¥', title: 'Thu Chi', description: 'Theo dõi thu chi cá nhân theo ví, theo tháng.', accent: '#4ade80' },
  { href: '/habits', icon: '✓', title: 'Thói Quen', description: 'Theo dõi thói quen, streak và sức khoẻ mỗi ngày.', accent: '#60a5fa' },
  { href: '/notes', icon: '✎', title: 'Ghi Chú', description: 'Bảng ghi chú tự do, tự động nhóm theo tuần / tháng / năm.', accent: '#fb923c' },
]
