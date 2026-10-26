import { headers } from 'next/headers'
import { nanoid } from 'nanoid'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { HubAccessGate } from '@/components/hub/HubAccessGate'
import { HubRoleBadge } from '@/components/hub/HubRoleBadge'
import { HUB_APPS, type HubApp } from '@/lib/hub/apps'
import { getHubAccess } from '@/lib/hub/access'
import { db } from '@/lib/db'
import { hubAccessLogs } from '@/db/schema'
import './hub.css'

// Thân của (apps)/<app>/(protected)/layout.tsx cho PM và IT — song song với (apps)/certs/(protected)/layout.tsx.
// Layout chỉ chặn giao diện; page vẫn phải tự gọi assertHubAccess() (lý do xem lib/ielts/access.ts).
export async function HubProtected({ app, children }: { app: HubApp; children: React.ReactNode }) {
  const access = await getHubAccess(app)

  if (access.mode === 'denied') {
    return (
      <div className="hub-access-denied">
        <div className="sb-floating">
          <AppBreadcrumb app={HUB_APPS[app].path} />
        </div>
        <HubAccessGate app={app} />
      </div>
    )
  }

  // Chỉ ghi log khi đã thật sự bật chia sẻ (có email). await thay vì fire-and-forget vì trên serverless hàm có thể
  // bị đóng trước khi promise kịp chạy.
  if (access.email) {
    try {
      const userAgent = (await headers()).get('user-agent') ?? ''
      await db.insert(hubAccessLogs).values({ id: nanoid(), app, email: access.email.toLowerCase(), userAgent })
    } catch (err) {
      console.error(`[${app} access log]`, err)
    }
  }

  return (
    <>
      {process.env.IELTS_OWNER_EMAIL && <HubRoleBadge app={app} isOwner={access.mode === 'owner'} email={access.email} />}
      {children}
    </>
  )
}

// Thân của (apps)/<app>/login/page.tsx — popup HubAccessGate lo toàn bộ việc hỏi email + gửi link.
export function HubLogin({ app }: { app: HubApp }) {
  return (
    <div className="hub-access-denied">
      <div className="sb-floating">
        <AppBreadcrumb app={HUB_APPS[app].path} trail={[{ label: 'Đăng nhập', icon: 'key' }]} />
      </div>
      <HubAccessGate app={app} />
    </div>
  )
}
