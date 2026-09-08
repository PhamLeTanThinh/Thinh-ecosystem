'use client'

import { useState } from 'react'
import { useIeltsStore } from '@/lib/ielts/store'
import { Sidebar, type Selection } from '@/components/ielts/Sidebar'
import { PageEditor } from '@/components/ielts/PageEditor'
import { VocabView } from '@/components/ielts/VocabView'
import { GlobalSearch } from '@/components/ielts/GlobalSearch'
import { useIeltsAccess } from '@/components/ielts/AccessContext'
import { skillLabel } from '@/lib/ielts/skills'

export default function IeltsHomePage() {
  const { isOwner, email, sharingEnabled } = useIeltsAccess()
  const pages = useIeltsStore((s) => s.pages)
  const [selection, setSelection] = useState<Selection | null>(null)

  const activePage = selection?.type === 'page' ? pages.find((p) => p.id === selection.id) ?? null : null

  return (
    <div className="ih-shell">
      <Sidebar selection={selection ?? { type: 'vocab' }} onSelect={setSelection} />

      <div className="ih-main">
        <header className="ih-topbar">
          <span className="ih-wordmark">IELTS Hub</span>
          <GlobalSearch onSelect={setSelection} />
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
          {selection?.type === 'vocab' && <VocabView onNavigateToPage={(id) => setSelection({ type: 'page', id })} />}

          {selection?.type === 'page' && activePage && (
            <div className="ih-page-view">
              <div className="ih-page-view-meta">
                <span className="ih-page-view-skill">{skillLabel(activePage.skill)}</span>
                <h1 className="ih-font-hand ih-page-view-title">{activePage.title}</h1>
              </div>
              <PageEditor key={activePage.id} page={activePage} />
            </div>
          )}

          {!selection && (
            <div className="ih-empty-state">
              <p>Chọn 1 trang trong sidebar, hoặc bấm “+ Thêm trang” để bắt đầu ghi chú.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
