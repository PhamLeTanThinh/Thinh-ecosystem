'use client'

import { useState } from 'react'
import { AdminActionProvider } from '@/components/admin/AdminDialog'
import { Breadcrumb } from '@/components/study/Breadcrumb'
import { IeltsAccessAdmin } from '@/components/admin/IeltsAccessAdmin'
import { CertsAccessAdmin } from '@/components/admin/CertsAccessAdmin'
import { LearnerAdmin } from '@/components/admin/LearnerAdmin'
import { FeedbackAdmin } from '@/components/admin/FeedbackAdmin'

type Tab = 'ielts' | 'certs' | 'learners' | 'feedback'

const TABS: { id: Tab; label: string }[] = [
  { id: 'ielts', label: 'Người xem IELTS' },
  { id: 'certs', label: 'Người xem Certs' },
  { id: 'learners', label: 'Hồ sơ học · 中文 · 한국어' },
  { id: 'feedback', label: 'Góp ý' },
]

// Trang quản trị của chủ, gồm 4 mảng: người được xem IELTS và người được xem Certs (mỗi app 1 danh sách
// mời/duyệt/thu hồi riêng — xem lib/certs/access.ts), hồ sơ học của app Trung/Hàn (xem/đổi tên/xoá), và góp
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

        <div className="adm-tabs" role="tablist" aria-label="Mảng quản lý">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className="adm-tab" onClick={() => selectTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'ielts' ? (
          <IeltsAccessAdmin ownerEmail={ownerEmail} />
        ) : tab === 'certs' ? (
          <CertsAccessAdmin ownerEmail={ownerEmail} />
        ) : tab === 'learners' ? (
          <LearnerAdmin />
        ) : (
          <FeedbackAdmin />
        )}
      </div>
    </AdminActionProvider>
  )
}
