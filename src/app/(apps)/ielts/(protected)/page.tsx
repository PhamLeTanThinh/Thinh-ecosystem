'use client'

import { useEffect, useState } from 'react'
import { useIeltsStore } from '@/lib/ielts/store'
import { Sidebar, type Selection } from '@/components/ielts/Sidebar'
import { SkillLanding } from '@/components/ielts/SkillLanding'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { PageEditor } from '@/components/ielts/PageEditor'
import { VocabView } from '@/components/ielts/VocabView'
import { GlobalSearch } from '@/components/ielts/GlobalSearch'
import { useIeltsAccess } from '@/components/ielts/AccessContext'
import { skillLabel } from '@/lib/ielts/skills'
import type { Skill } from '@/lib/ielts/types'
import { withViewTransition } from '@/lib/viewTransition'

export default function IeltsHomePage() {
  const { isOwner, email, sharingEnabled } = useIeltsAccess()
  const pages = useIeltsStore((s) => s.pages)
  const contentLoaded = useIeltsStore((s) => s.contentLoaded)
  const [selection, setSelection] = useState<Selection | null>(null)
  // Kỹ năng chọn từ màn hình 4 card. Chưa chọn kỹ năng và chưa chọn trang nào = đang ở màn hình đầu
  // (chỉ có topbar + 4 card ở giữa, chưa có sidebar); có 1 trong 2 thì hiện bố cục đầy đủ.
  const [picked, setPicked] = useState<Skill | null>(null)
  const showLanding = picked === null && selection === null

  const activePage = selection?.type === 'page' ? pages.find((p) => p.id === selection.id) ?? null : null

  // Chọn trang từ ô tìm kiếm khi đang ở màn hình đầu cũng chạy transition (sidebar hiện ra).
  function selectFromSearch(s: Selection) {
    if (showLanding) withViewTransition(() => setSelection(s))
    else setSelection(s)
  }

  // Cuộn về đầu trang mỗi lần đổi lựa chọn (trang khác hoặc Từ vựng) — thiếu bước này, trang mới sẽ
  // "thừa hưởng" vị trí cuộn dở dang của trang trước đó, khiến việc chuyển trang cảm giác giật/lỗi
  // dù nội dung đã đổi đúng. Không dùng behavior:'smooth' vì đây là 2 tài liệu khác nhau (không phải
  // cuộn tiếp 1 trang dài) — nhảy thẳng lên đầu, còn cảm giác "mượt" đến từ animation fade-in-up của
  // .ih-page-view (ielts.css) chạy song song ngay sau đó.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [selection?.type, selection?.type === 'page' ? selection.id : null])

  return (
    <div className="ih-shell">
      {!showLanding && <Sidebar selection={selection} onSelect={setSelection} initialSkill={picked ?? activePage?.skill ?? null} />}

      <div className="ih-main">
        <header className="ih-topbar">
          {/* Khi đã vào trong (sidebar hiện), breadcrumb chuyển sang nằm ở đầu sidebar (Sidebar.tsx) thay
              cho tiêu đề tĩnh cũ — ở đây chỉ còn cần lúc màn hình chọn kỹ năng chưa có sidebar. */}
          {showLanding && <AppBreadcrumb app="/ielts" />}
          <GlobalSearch onSelect={selectFromSearch} />
          {sharingEnabled && (
            <div className="ih-role-badge">
              <span className={`ih-role-chip${isOwner ? ' owner' : ''}`}>{isOwner ? '👑 Chủ trang' : `👁️ Đang xem${email ? `: ${email}` : ''}`}</span>
              <a href="/api/ielts/logout" className="ih-role-logout">
                Đăng xuất
              </a>
            </div>
          )}
        </header>

        <div className="ih-content">
          {showLanding && <SkillLanding onPick={(skill) => withViewTransition(() => setPicked(skill))} />}

          {selection?.type === 'vocab' && <VocabView onNavigateToPage={(id) => setSelection({ type: 'page', id })} />}

          {selection?.type === 'page' && activePage && (
            // key theo id ở NGAY div ngoài cùng (không chỉ ở PageEditor) — để cả tiêu đề lẫn nội dung
            // cùng remount và cùng chạy lại animation fade-in-up mỗi lần đổi trang.
            <div key={activePage.id} className="ih-page-view">
              <div className="ih-page-view-meta">
                <span className="ih-page-view-skill">{skillLabel(activePage.skill)}</span>
                <h1 className="ih-font-hand ih-page-view-title">{activePage.title}</h1>
              </div>
              {contentLoaded ? (
                <PageEditor page={activePage} />
              ) : (
                // Chưa tải xong nội dung đầy đủ (đang tải nền, xem store.ts) — KHÔNG mount PageEditor
                // lúc này, vì nó chốt content lúc mount vào state nội bộ; mount sớm với content rỗng
                // rồi lỡ tay lưu sẽ xoá mất nội dung thật của trang.
                <div className="ih-loading-state">
                  <span className="ih-spinner" aria-hidden />
                  <span>Đang tải nội dung…</span>
                </div>
              )}
            </div>
          )}

          {!selection && !showLanding && (
            <div className="ih-empty-state">
              <p>Chúc bạn học thật tốt và đạt band điểm mơ ước nhé! 🍀</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
