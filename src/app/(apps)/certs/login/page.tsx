import { CertsAccessGate } from '@/components/certs/AccessGate'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'

// Toàn bộ việc hỏi email + gửi link nằm trong popup CertsAccessGate; trang này chỉ là nền phía sau popup —
// song song với (apps)/ielts/login/page.tsx.
export default function CertsLoginPage() {
  return (
    <div className="certs-access-denied">
      <div className="sb-floating">
        <AppBreadcrumb app="/certs" trail={[{ label: 'Đăng nhập', icon: 'key' }]} />
      </div>
      <CertsAccessGate />
    </div>
  )
}
