// Tiêu đề email chứa link đăng nhập — tách riêng, không import gì, để cả server (mailer.ts) lẫn các popup đăng
// nhập chạy trên trình duyệt (AccessGate, AdminGate) dùng chung 1 hằng số mà không kéo thư viện gửi mail vào
// bundle của trình duyệt. Popup nhắc NGUYÊN VĂN tiêu đề này để người dùng tìm đúng thư, nên phải luôn khớp.
// 'ielts' = link vào IELTS Hub, 'admin' = link vào trang quản trị của chủ (api/admin/request-link).
export type MagicLinkKind = 'ielts' | 'admin'

export const MAGIC_LINK_SUBJECT: Record<MagicLinkKind, string> = {
  ielts: 'Link đăng nhập IELTS Knowledge Hub',
  admin: 'Link đăng nhập trang Admin',
}
