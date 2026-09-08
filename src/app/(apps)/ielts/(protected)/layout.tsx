import Link from 'next/link'
import { IeltsHydrator } from '@/components/ielts/IeltsHydrator'
import { IeltsAccessProvider } from '@/components/ielts/AccessContext'
import { getIeltsAccess } from '@/lib/ielts/access'

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

  return (
    <IeltsAccessProvider isOwner={access.mode === 'owner'} email={access.email} sharingEnabled={Boolean(process.env.IELTS_OWNER_EMAIL)}>
      <IeltsHydrator />
      {children}
    </IeltsAccessProvider>
  )
}
