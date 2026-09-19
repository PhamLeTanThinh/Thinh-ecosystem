import { flushSync } from 'react-dom'

// Điểm ngắt mà app Chinese / Korean chuyển sidebar thành drawer trượt từ mép trái (xem @media (max-width: 860px)
// trong chinese.css / korean.css). Dưới ngưỡng này sidebar nằm ngoài màn hình nên card không có "chỗ đến" để bay tới.
export const MOBILE_NAV_QUERY = '(max-width: 860px)'

export function isMobileNav(): boolean {
  return window.matchMedia(MOBILE_NAV_QUERY).matches
}

// Chạy update trong View Transition: các phần tử cùng view-transition-name (card ở màn hình đầu ↔ tiêu đề nhóm trong
// Sidebar) tự "bay" từ vị trí cũ sang vị trí mới. flushSync để DOM mới đã sẵn sàng ngay khi callback trả về (trình
// duyệt chụp trạng thái mới ngay sau đó). Trình duyệt chưa hỗ trợ, người dùng bật giảm chuyển động, hoặc caller báo
// `skip` thì cập nhật thẳng, không animation.
export function withViewTransition(update: () => void, opts: { skip?: boolean } = {}) {
  if (opts.skip || !document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    update()
    return
  }
  document.startViewTransition(() => flushSync(update))
}
