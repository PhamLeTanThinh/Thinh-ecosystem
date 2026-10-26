'use client'

import { useState } from 'react'
import { AdminActionProvider } from '@/components/admin/AdminDialog'
import { Breadcrumb } from '@/components/study/Breadcrumb'
import { IeltsAccessAdmin } from '@/components/admin/IeltsAccessAdmin'
import { CertsAccessAdmin } from '@/components/admin/CertsAccessAdmin'
import { HubAccessAdmin } from '@/components/admin/HubAccessAdmin'
import { LearnerAdmin } from '@/components/admin/LearnerAdmin'
import { FeedbackAdmin } from '@/components/admin/FeedbackAdmin'

export type Tab = 'ielts' | 'certs' | 'pm' | 'it' | 'learners' | 'feedback'

// Sidebar chia nhóm: mỗi app có danh sách người xem riêng, rồi tới hồ sơ học và góp ý.
const NAV: { group: string; items: { id: Tab; label: string; icon: string }[] }[] = [
  {
    group: 'Người xem',
    items: [
      { id: 'ielts', label: 'IELTS Hub', icon: '📝' },
      { id: 'certs', label: 'Certs Hub', icon: '🎓' },
      { id: 'pm', label: 'Project Manager', icon: '📋' },
      { id: 'it', label: 'IT Hub', icon: '💻' },
    ],
  },
  { group: 'Hồ sơ học', items: [{ id: 'learners', label: '中文 · 한국어', icon: '🈶' }] },
  { group: 'Khác', items: [{ id: 'feedback', label: 'Góp ý', icon: '💬' }] },
]

// Trang quản trị của chủ, gồm: người được xem IELTS, Certs, Project Manager, IT Hub (mỗi app 1 danh sách
// mời/duyệt/thu hồi riêng — xem lib/certs/access.ts, lib/hub/access.ts), hồ sơ học của app Trung/Hàn (xem/đổi tên/xoá), và góp
// ý gửi qua DonateWidget (xem/xoá). Tab đang mở nằm trên URL (?tab=learners) để tải lại hay gửi link vẫn
// đúng tab — trang server đọc ?tab= rồi truyền xuống làm tab ban đầu, nên HTML server và client luôn khớp nhau.
export function AdminDashboard({ ownerEmail, initialTab }: { ownerEmail: string | null; initialTab: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab)

  function selectTab(next: Tab) {
    setTab(next)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', next)
    window.history.replaceState(null, '', url)
  }

  return (
    <AdminActionProvider>
      <div className="adm-root">
        <Breadcrumb
          accent="#2b3a55"
          items={[
            { label: 'Study', href: '/study', icon: 'study' },
            { label: 'Admin', icon: 'key' },
          ]}
        />

        <header className="adm-head">
          <div>
            <h1 className="adm-title">Quản lý</h1>
            <p className="adm-subhead">Người xem, hồ sơ học và góp ý — chỉ chủ trang mới vào được trang này.</p>
          </div>
          {ownerEmail && <span className="adm-owner">{ownerEmail}</span>}
        </header>

        <div className="adm-layout">
          <nav className="adm-side" role="tablist" aria-orientation="vertical" aria-label="Mảng quản lý">
            {NAV.map((g) => (
              <div key={g.group} className="adm-side-group">
                <p className="adm-side-title">{g.group}</p>
                {g.items.map((t) => (
                  <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className="adm-side-item" onClick={() => selectTab(t.id)}>
                    <span className="adm-side-icon" aria-hidden="true">
                      {t.icon}
                    </span>
                    {t.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <main className="adm-main">
            {tab === 'ielts' ? (
              <IeltsAccessAdmin ownerEmail={ownerEmail} />
            ) : tab === 'certs' ? (
              <CertsAccessAdmin ownerEmail={ownerEmail} />
            ) : tab === 'pm' || tab === 'it' ? (
              // key: đổi qua lại PM ↔ IT phải dựng lại component để tải danh sách của app mới
              <HubAccessAdmin key={tab} app={tab} ownerEmail={ownerEmail} />
            ) : tab === 'learners' ? (
              <LearnerAdmin />
            ) : (
              <FeedbackAdmin />
            )}
          </main>
        </div>
      </div>
    </AdminActionProvider>
  )
}
