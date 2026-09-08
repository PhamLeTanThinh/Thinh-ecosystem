import Link from 'next/link'
import { headers } from 'next/headers'
import { nanoid } from 'nanoid'
import { IeltsHydrator } from '@/components/ielts/IeltsHydrator'
import { IeltsAccessProvider } from '@/components/ielts/AccessContext'
import { getIeltsAccess } from '@/lib/ielts/access'
import { db } from '@/lib/db'
import { ieltsAccessLogs } from '@/db/schema'

// Bọc riêng /ielts và /ielts/admin — không bọc /ielts/login (nằm ngoài route group này) vì trang
// đó phải luôn render được cho cả người chưa đăng nhập.
export default async function IeltsProtectedLayout({ children }: { children: React.ReactNode }) {
  const access = await getIeltsAccess()

  if (access.mode === 'denied') {
    return (
      <div className="ih-access-denied">
        <p>Bạn cần đăng nhập bằng email được mời để xem trang này.</p>
        <Link href="/ielts/login" className="ih-btn-solid" style={{ marginTop: 8 }}>
          Đăng nhập
        </Link>
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
      {children}
    </IeltsAccessProvider>
  )
}
