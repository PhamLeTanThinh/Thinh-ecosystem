'use client'

import { useAdminAction } from '@/components/admin/AdminDialog'
import { MascotEm } from '@/components/mascot/MascotDialog'

// Đủ thông tin để đổi tên / xoá 1 hồ sơ học — LearnerSummary (tab 中文 · 한국어) và CertsProfileStat (tab Certs) đều khớp.
export interface LearnerRef {
  id: string
  displayName: string | null
  registered: boolean
}

const nameOf = (l: LearnerRef) => l.displayName || l.id

// Đổi tên / xoá hồ sơ học qua popup mèo hỏi–xong của AdminDialog (API /api/admin/learners/[id]). Dùng chung cho tab
// "Hồ sơ học · 中文 · 한국어" (LearnerAdmin) và bảng "Hồ sơ học Certs" (CertsAccessAdmin) — hồ sơ dùng chung cho cả 3 app
// nên đổi tên / xoá ở đâu cũng tác động tới tiến độ của cả 3. Trả về promise ok/không như runAction.
export function useLearnerActions({ onRenamed, onRemoved }: { onRenamed: () => void | Promise<void>; onRemoved: (id: string) => void }) {
  const runAction = useAdminAction()

  function rename(l: LearnerRef) {
    return runAction({
      bubble: (
        <>
          Ông chủ muốn đổi tên hồ sơ <MascotEm>{nameOf(l)}</MascotEm> thành gì nè?
        </>
      ),
      sub: 'Tiến độ học (tiếng Trung, tiếng Hàn và cả luyện đề Certs) sẽ đi theo tên mới nha 🐾',
      confirmLabel: 'Đổi tên nè',
      input: {
        placeholder: 'Tên mới (chữ thường, số, - hoặc _)',
        initial: l.registered ? nameOf(l) : '',
        maxLength: 24,
        hint: 'Từ 3 ký tự, bắt đầu bằng chữ cái; gồm chữ, số, gạch ngang hoặc gạch dưới.',
      },
      run: async (username) => {
        const res = await fetch(`/api/admin/learners/${encodeURIComponent(l.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) return { ok: false, error: data.error ?? 'Chưa đổi được rồi, ông chủ thử lại sau chút nha' }
        await onRenamed()
        return {
          ok: true,
          bubble: (
            <>
              Đã đổi tên rồi nè! <MascotEm>{nameOf(l)}</MascotEm> giờ là <MascotEm>{data.displayName || data.id || username}</MascotEm> 🎉
            </>
          ),
          sub: 'Tiến độ học đã đi theo tên mới rồi nha 🐾',
        }
      },
    })
  }

  function remove(l: LearnerRef) {
    return runAction({
      bubble: (
        <>
          Xoá hẳn hồ sơ <MascotEm>{nameOf(l)}</MascotEm> hả ông chủ?
        </>
      ),
      sub: (
        <>
          Toàn bộ tiến độ, cài đặt, bộ từ và lịch sử luyện đề (tiếng Trung, tiếng Hàn, Certs) sẽ mất luôn, không khôi phục được đâu nha! Thẻ từ vựng dùng chung thì
          vẫn còn.
          {l.id === 'legacy' && ' Đây là dữ liệu học cũ của ông chủ đó, nghĩ kỹ nha!'}
        </>
      ),
      confirmLabel: 'Xoá luôn',
      danger: true,
      run: async () => {
        const res = await fetch(`/api/admin/learners/${encodeURIComponent(l.id)}`, { method: 'DELETE' })
        if (!res.ok) return { ok: false, error: 'Chưa xoá được rồi, ông chủ thử lại sau chút nha' }
        onRemoved(l.id)
        return {
          ok: true,
          bubble: (
            <>
              Đã xoá hồ sơ <MascotEm>{nameOf(l)}</MascotEm> rồi nha
            </>
          ),
        }
      },
    })
  }

  return { rename, remove }
}
