import { AccessGate } from '@/components/ielts/AccessGate'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'

// Toàn bộ việc hỏi email + gửi link nằm trong popup AccessGate (con mèo Diên hỏi email); trang này chỉ là
// nền phía sau popup.
export default function IeltsLoginPage() {
  return (
    <div className="ih-access-denied">
      <div className="sb-floating">
        <AppBreadcrumb app="/ielts" trail={[{ label: 'Đăng nhập', icon: 'key' }]} />
      </div>
      <AccessGate />
    </div>
  )
}
