import { HUB_APPS, type HubApp } from '@/lib/hub/apps'
import './hub.css'

// Badge nổi góc trên phải: vai trò (chủ/đang xem) + nút đăng xuất — song song với components/certs/RoleBadge.tsx.
// Layout (protected) chỉ render khi đã bật chia sẻ (IELTS_OWNER_EMAIL có giá trị) nên không cần context.
export function HubRoleBadge({ app, isOwner, email }: { app: HubApp; isOwner: boolean; email: string | null }) {
  return (
    <div className="hub-role-badge">
      <span className={`hub-role-chip${isOwner ? ' owner' : ''}`}>{isOwner ? '👑 Chủ trang' : `👁️ Đang xem${email ? `: ${email}` : ''}`}</span>
      <a href={`/api/ielts/logout?next=${HUB_APPS[app].path}/login`} className="hub-role-logout">
        Đăng xuất
      </a>
    </div>
  )
}
