'use client'

import { AppBreadcrumb, type Crumb } from '@/components/study/Breadcrumb'
import { GlobalSearch } from './GlobalSearch'
import { useIeltsAccess } from './AccessContext'

interface TopbarProps {
  // Nút ☰ mở menu off-canvas (chỉ hiện trên mobile, xem ielts.css) — chỉ truyền khi trang có sidebar.
  onToggleNav?: () => void
  // Có breadcrumb ở topbar hay không. Trang có sidebar thì breadcrumb nằm ở đầu sidebar.
  crumbTrail?: Crumb[]
  onNavigate?: () => void
}

export function IeltsTopbar({ onToggleNav, crumbTrail, onNavigate }: TopbarProps) {
  const { isOwner, email, sharingEnabled } = useIeltsAccess()
  return (
    <header className="ih-topbar">
      {onToggleNav && (
        <button type="button" className="ih-nav-toggle" aria-label="Mở menu" onClick={onToggleNav}>
          ☰
        </button>
      )}
      {crumbTrail && <AppBreadcrumb app="/ielts" trail={crumbTrail} />}
      <GlobalSearch onNavigate={onNavigate} />
      {sharingEnabled && (
        <div className="ih-role-badge">
          <span className={`ih-role-chip${isOwner ? ' owner' : ''}`}>{isOwner ? '👑 Chủ trang' : `👁️ Đang xem${email ? `: ${email}` : ''}`}</span>
          <a href="/api/ielts/logout" className="ih-role-logout">
            Đăng xuất
          </a>
        </div>
      )}
    </header>
  )
}

// Khung không có sidebar: màn chọn kỹ năng và trang từ vựng chung. Skill có menu riêng dùng SkillShell.
export function IeltsPlainShell({ trail = [], children }: { trail?: Crumb[]; children: React.ReactNode }) {
  return (
    <div className="ih-shell">
      <div className="ih-main">
        <IeltsTopbar crumbTrail={trail} />
        <div className="ih-content">{children}</div>
      </div>
    </div>
  )
}
