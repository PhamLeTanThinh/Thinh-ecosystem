import type { CSSProperties } from 'react'

// Map token màu /admin (--color-adm-*, khai báo trong admin.css) sang biến --md-* của MascotDialog — dùng cho
// popup xác nhận (AdminDialog.tsx) và popup đăng nhập chủ trang (AdminGate.tsx). Giữ nguyên con mèo Diên +
// giọng văn, chỉ đổi màu cho khớp bảng màu trung tính/chuyên nghiệp mới của trang, thay vì mượn màu hồng IELTS.
export const ADMIN_TOKENS = {
  '--md-card': 'var(--color-adm-surface)',
  '--md-soft': 'var(--color-adm-surface-soft)',
  '--md-brand': 'var(--color-adm-accent)',
  '--md-brand-strong': 'var(--color-adm-ink)',
  '--md-text': 'var(--color-adm-ink)',
  '--md-muted': 'var(--color-adm-ink-soft)',
  '--md-border': 'var(--color-adm-border)',
  '--md-radius': '14px',
} as CSSProperties
