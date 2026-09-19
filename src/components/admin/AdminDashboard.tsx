'use client'

import { useState } from 'react'
import { AdminActionProvider } from '@/components/admin/AdminDialog'
import { Breadcrumb } from '@/components/study/Breadcrumb'
import { IeltsAccessAdmin } from '@/components/admin/IeltsAccessAdmin'
import { LearnerAdmin } from '@/components/admin/LearnerAdmin'

type Tab = 'ielts' | 'learners'

const TABS: { id: Tab; label: string }[] = [
  { id: 'ielts', label: 'Người xem IELTS' },
  { id: 'learners', label: 'Hồ sơ học · 中文 · 한국어' },
]

// Trang quản trị của chủ, gồm 2 mảng: người được xem IELTS (mời/duyệt/thu hồi) và hồ sơ học của app Trung/Hàn
// (xem/đổi tên/xoá). Tab đang mở nằm trên URL (?tab=learners) để tải lại hay gửi link vẫn đúng tab — trang server
// đọc ?tab= rồi truyền xuống làm tab ban đầu, nên HTML server và client luôn khớp nhau.
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
      <div className="ad-root">
        <Breadcrumb
          accent="#2b3a55"
          items={[
            { label: 'Study', href: '/study', icon: 'study' },
            { label: 'Admin', icon: 'key' },
          ]}
        />

        <header className="ad-head">
          <h1 className="ih-font-hand ad-title">Quản lý</h1>
          {ownerEmail && <span className="ad-owner">Đăng nhập: {ownerEmail}</span>}
        </header>

        <div className="ad-tabs" role="tablist" aria-label="Mảng quản lý">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className="ad-tab" onClick={() => selectTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'ielts' ? <IeltsAccessAdmin ownerEmail={ownerEmail} /> : <LearnerAdmin />}
      </div>
    </AdminActionProvider>
  )
}
