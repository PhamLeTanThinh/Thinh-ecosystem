import { headers } from 'next/headers'
import { nanoid } from 'nanoid'
import { CertsAccessGate } from '@/components/certs/AccessGate'
import { CertsAccessProvider } from '@/components/certs/AccessContext'
import { CertsRoleBadge } from '@/components/certs/RoleBadge'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { getCertsAccess } from '@/lib/certs/access'
import { db } from '@/lib/db'
import { certAccessLogs } from '@/db/schema'

// Bọc riêng /certs (trừ /certs/login, nằm ngoài route group này) — song song với
// (apps)/ielts/(protected)/layout.tsx. Đọc file đó để biết vì sao page vẫn cần tự gọi assertCertsAccess()
// dù layout đã chặn giao diện (Next render page song song với layout, RSC payload của page vẫn có thể lọt ra).
export default async function CertsProtectedLayout({ children }: { children: React.ReactNode }) {
  const access = await getCertsAccess()

  if (access.mode === 'denied') {
    return (
      <div className="certs-access-denied">
        <div className="sb-floating">
          <AppBreadcrumb app="/certs" />
        </div>
        <CertsAccessGate />
      </div>
    )
  }

  // Chỉ ghi log khi đã thật sự bật chia sẻ (có email) — bỏ qua lúc chạy local chưa đăng nhập. await thay vì
  // fire-and-forget vì trên serverless (Vercel) hàm có thể bị đóng trước khi promise chưa await xong kịp chạy.
  if (access.email) {
    try {
      const userAgent = (await headers()).get('user-agent') ?? ''
      await db.insert(certAccessLogs).values({ id: nanoid(), email: access.email.toLowerCase(), userAgent })
    } catch (err) {
      console.error('[certs access log]', err)
    }
  }

  return (
    <CertsAccessProvider isOwner={access.mode === 'owner'} email={access.email} sharingEnabled={Boolean(process.env.IELTS_OWNER_EMAIL)}>
      <CertsRoleBadge />
      {children}
    </CertsAccessProvider>
  )
}
