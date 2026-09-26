'use client'

import { useCertsAccess } from './AccessContext'

// Badge nổi góc trên phải: vai trò (chủ/đang xem) + nút đăng xuất — chỉ hiện khi đã bật chia sẻ
// (IELTS_OWNER_EMAIL có giá trị), song song với .ih-role-badge trong IeltsShell.tsx. Đặt ở layout
// (protected) thay vì lặp lại trong từng trang vì các trang Certs không dùng chung 1 khung header.
export function CertsRoleBadge() {
  const { isOwner, email, sharingEnabled } = useCertsAccess()
  if (!sharingEnabled) return null
  return (
    <div className="certs-role-badge">
      <span className={`certs-role-chip${isOwner ? ' owner' : ''}`}>{isOwner ? '👑 Chủ trang' : `👁️ Đang xem${email ? `: ${email}` : ''}`}</span>
      <a href="/api/ielts/logout?next=/certs/login" className="certs-role-logout">
        Đăng xuất
      </a>
    </div>
  )
}
