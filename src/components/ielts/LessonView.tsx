'use client'

import Link from 'next/link'
import { useIeltsStore } from '@/lib/ielts/store'
import { PageEditor } from '@/components/ielts/PageEditor'
import { skillLabel } from '@/lib/ielts/skills'
import type { Skill } from '@/lib/ielts/types'

// Bài học (trang kiến thức) tại /ielts/<skill>/lessons/<pageId>. Nội dung lấy từ store (đã hydrate ở
// layout (protected)), không phải từ server — API đã tự kiểm tra quyền nên trang này không cần gate.
export function LessonView({ skill, pageId }: { skill: Skill; pageId: string }) {
  const hydrated = useIeltsStore((s) => s.hydrated)
  const contentLoaded = useIeltsStore((s) => s.contentLoaded)
  const page = useIeltsStore((s) => s.pages.find((p) => p.id === pageId && p.skill === skill)) ?? null

  if (!hydrated) {
    return (
      <div className="ih-loading-state">
        <span className="ih-spinner" aria-hidden />
        <span>Đang tải…</span>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="ih-empty-state">
        <p>Không tìm thấy trang này (có thể đã bị xoá).</p>
        <p>
          <Link href={`/ielts/${skill}/lessons`} className="ih-btn-outline">
            ← Về danh sách Kiến thức
          </Link>
        </p>
      </div>
    )
  }

  return (
    // key theo id ở NGAY div ngoài cùng (không chỉ ở PageEditor) — để cả tiêu đề lẫn nội dung cùng
    // remount và cùng chạy lại animation fade-in-up mỗi lần đổi trang.
    <div key={page.id} className="ih-page-view">
      <div className="ih-page-view-meta">
        <span className="ih-page-view-skill">{skillLabel(page.skill)}</span>
        <h1 className="ih-font-hand ih-page-view-title">{page.title}</h1>
      </div>
      {contentLoaded ? (
        <PageEditor page={page} />
      ) : (
        // Chưa tải xong nội dung đầy đủ (đang tải nền, xem store.ts) — KHÔNG mount PageEditor lúc này,
        // vì nó chốt content lúc mount vào state nội bộ; mount sớm với content rỗng rồi lỡ tay lưu sẽ
        // xoá mất nội dung thật của trang.
        <div className="ih-loading-state">
          <span className="ih-spinner" aria-hidden />
          <span>Đang tải nội dung…</span>
        </div>
      )}
    </div>
  )
}
