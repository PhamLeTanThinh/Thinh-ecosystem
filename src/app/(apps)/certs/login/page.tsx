import { redirect } from 'next/navigation'
import { CertsAccessGate } from '@/components/certs/AccessGate'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { getCertsAccessMode } from '@/lib/certs/settings'

// Toàn bộ việc hỏi email + gửi link nằm trong popup CertsAccessGate; trang này chỉ là nền phía sau popup —
// song song với (apps)/ielts/login/page.tsx. Đang bật chế độ "chỉ cần hồ sơ" thì không cần email nữa,
// chuyển thẳng vào /certs để popup tạo hồ sơ học hiện ra.
export default async function CertsLoginPage() {
  if (process.env.IELTS_OWNER_EMAIL && (await getCertsAccessMode()) === 'profile') redirect('/certs')
  return (
    <div className="certs-access-denied">
      <div className="sb-floating">
        <AppBreadcrumb app="/certs" trail={[{ label: 'Đăng nhập', icon: 'key' }]} />
      </div>
      <CertsAccessGate />
    </div>
  )
}
