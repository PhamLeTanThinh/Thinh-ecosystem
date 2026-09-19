// Cấu hình loading của từng app — 1 nguồn duy nhất cho cả loading bên trong app (IeltsLoading,
// ChineseLoading, KoreanLoading) lẫn loading hiện lúc bấm thẻ ở /study (StudyCardLink), để video, màu
// và câu chữ luôn khớp nhau.
//
// accent lấy từ lib/apps/brand.ts (màu chủ đạo của từng app, cùng nguồn với màu thẻ ở /study).
// Tên linh vật "Diên" luôn giữ nguyên chữ Latinh trong câu, dù câu viết bằng tiếng nào.
import { APP_BRAND } from '@/lib/apps/brand'

export interface AppLoadingConfig {
  apiPrefix: string
  videoSrc: string
  accent: string
  message: string
}

export const IELTS_LOADING: AppLoadingConfig = {
  apiPrefix: '/api/ielts',
  videoSrc: '/preloader/video/ielts.mp4',
  accent: APP_BRAND.ielts,
  message: 'Wait for Diên xíu nha!',
}

// "Đợi Diên một chút nhé!"
export const CHINESE_LOADING: AppLoadingConfig = {
  apiPrefix: '/api/chinese',
  videoSrc: '/preloader/video/chinese.mp4',
  accent: APP_BRAND.chinese,
  message: '等 Diên 一下哦！',
}

// "Hãy đợi Diên một chút nhé!" — Diên kết thúc bằng phụ âm n nên trợ từ tân ngữ là 을, không phải 를.
export const KOREAN_LOADING: AppLoadingConfig = {
  apiPrefix: '/api/korean',
  videoSrc: '/preloader/video/korean.mp4',
  accent: APP_BRAND.korean,
  message: 'Diên을 잠깐만 기다려 주세요!',
}

// "Đợi Diên một chút nha!" — Music chưa có API riêng (apiPrefix không khớp request nào) nên loading
// chỉ còn phụ thuộc mốc "trang đã load xong" của tracker — vẫn đúng ý cho 1 app tĩnh, không dữ liệu.
export const MUSIC_LOADING: AppLoadingConfig = {
  apiPrefix: '/api/music',
  videoSrc: '/preloader/video/music.mp4',
  accent: APP_BRAND.music,
  message: 'Đợi Diên một chút nha!',
}

// PM / IT / Certs chưa có API riêng — cùng lý do với Music (loading chỉ theo mốc "trang đã load xong").
export const PM_LOADING: AppLoadingConfig = {
  apiPrefix: '/api/pm',
  videoSrc: '/preloader/video/pm.mp4',
  accent: APP_BRAND.pm,
  message: 'Đợi Diên một chút nha!',
}

export const IT_LOADING: AppLoadingConfig = {
  apiPrefix: '/api/it',
  videoSrc: '/preloader/video/IT.mp4',
  accent: APP_BRAND.it,
  message: 'Đợi Diên một chút nha!',
}

export const CERTS_LOADING: AppLoadingConfig = {
  apiPrefix: '/api/certs',
  videoSrc: '/preloader/video/cert.mp4',
  accent: APP_BRAND.certs,
  message: 'Đợi Diên một chút nha!',
}

// Tra theo đường dẫn của app — dùng ở /study. App nào không có ở đây thì bấm vào không hiện loading.
export const APP_LOADING_BY_HREF: Record<string, AppLoadingConfig> = {
  '/ielts': IELTS_LOADING,
  '/chinese': CHINESE_LOADING,
  '/korean': KOREAN_LOADING,
  '/music': MUSIC_LOADING,
  '/pm': PM_LOADING,
  '/it': IT_LOADING,
  '/certs': CERTS_LOADING,
}
