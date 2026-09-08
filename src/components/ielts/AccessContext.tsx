'use client'

import { createContext, useContext } from 'react'

interface IeltsAccessValue {
  isOwner: boolean
  email: string | null // null khi chưa bật chia sẻ (chạy local, không đăng nhập)
  sharingEnabled: boolean // false = chạy local, không hiện badge vai trò/nút đăng xuất
}

// Server Component ((protected)/layout.tsx) đọc cookie/DB rồi truyền quyền xuống đây 1 lần — các
// component con (Sidebar, PageEditor, VocabView...) chỉ cần đọc context này để ẩn/hiện nút chỉnh
// sửa, không tự kiểm tra quyền lại (nguồn sự thật vẫn là check phía server trong mỗi API route).
const AccessContext = createContext<IeltsAccessValue>({ isOwner: true, email: null, sharingEnabled: false })

export function IeltsAccessProvider({ isOwner, email, sharingEnabled, children }: IeltsAccessValue & { children: React.ReactNode }) {
  return <AccessContext.Provider value={{ isOwner, email, sharingEnabled }}>{children}</AccessContext.Provider>
}

export function useIeltsAccess() {
  return useContext(AccessContext)
}
