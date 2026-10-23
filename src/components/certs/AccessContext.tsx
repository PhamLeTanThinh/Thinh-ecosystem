'use client'

import { createContext, useContext } from 'react'

interface CertsAccessValue {
  isOwner: boolean
  email: string | null // null khi chưa bật chia sẻ (chạy local, không đăng nhập) hoặc đang ở chế độ chỉ cần hồ sơ
  sharingEnabled: boolean // false = chạy local, không hiện badge vai trò/nút đăng xuất
  profileOnly: boolean // true = người xem vào bằng hồ sơ học, không có phiên email (xem lib/certs/settings.ts)
}

// Song song với components/ielts/AccessContext.tsx — server layout ((protected)/layout.tsx) đọc quyền 1 lần
// rồi truyền xuống đây; component con chỉ đọc context, không tự kiểm tra quyền lại.
const CertsAccessContext = createContext<CertsAccessValue>({ isOwner: true, email: null, sharingEnabled: false, profileOnly: false })

export function CertsAccessProvider({ isOwner, email, sharingEnabled, profileOnly, children }: CertsAccessValue & { children: React.ReactNode }) {
  return <CertsAccessContext.Provider value={{ isOwner, email, sharingEnabled, profileOnly }}>{children}</CertsAccessContext.Provider>
}

export function useCertsAccess() {
  return useContext(CertsAccessContext)
}
