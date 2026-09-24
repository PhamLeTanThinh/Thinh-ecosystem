import { headers } from 'next/headers'
import { nanoid } from 'nanoid'
import { AccessGate } from '@/components/ielts/AccessGate'
import { PracticeSyncGate } from '@/components/ielts/PracticeSyncGate'
import { IeltsHydrator } from '@/components/ielts/IeltsHydrator'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { IeltsAccessProvider } from '@/components/ielts/AccessContext'
import { getIeltsAccess } from '@/lib/ielts/access'
import { db } from '@/lib/db'
import { ieltsAccessLogs } from '@/db/schema'

// Bọc riêng /ielts — không bọc /ielts/login (nằm ngoài route group này) vì trang
// đó phải luôn render được cho cả người chưa đăng nhập.
export default async function IeltsProtectedLayout({ children }: { children: React.ReactNode }) {
  const access = await getIeltsAccess()

  if (access.mode === 'denied') {
    return (
      <div className="ih-access-denied">
        <div className="sb-floating">
          <AppBreadcrumb app="/ielts" />
        </div>
        <AccessGate />
      </div>
    )
  }

  // Chỉ ghi log khi đã thật sự bật chia sẻ (có email) — bỏ qua lúc chạy local chưa đăng nhập.
  // await thay vì fire-and-forget vì trên serverless (Vercel) hàm có thể bị đóng trước khi promise
  // chưa await xong kịp chạy.
  if (access.email) {
    try {
      const userAgent = (await headers()).get('user-agent') ?? ''
      await db.insert(ieltsAccessLogs).values({ id: nanoid(), email: access.email.toLowerCase(), userAgent })
    } catch (err) {
      console.error('[ielts access log]', err)
    }
  }

  return (
    <IeltsAccessProvider isOwner={access.mode === 'owner'} email={access.email} sharingEnabled={Boolean(process.env.IELTS_OWNER_EMAIL)}>
      <IeltsHydrator />
      <PracticeSyncGate>{children}</PracticeSyncGate>
    </IeltsAccessProvider>
  )
}
