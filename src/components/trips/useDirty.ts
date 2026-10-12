'use client'

import { useState } from 'react'

// Form đã thay đổi gì so với lúc mở chưa — so ảnh chụp (JSON) của mọi thứ sẽ được lưu với ảnh chụp lúc mount.
// Dùng để tắt nút "Lưu" khi không có gì để lưu (kể cả form tạo mới chưa nhập gì).
export function useDirty(snapshot: unknown): boolean {
  const current = JSON.stringify(snapshot)
  const [initial] = useState(current)
  return current !== initial
}
