// Các app dùng chung cơ chế "xin quyền xem" của lib/hub (bảng hubInvites/hubAccessRequests/hubAccessLogs) — mỗi app
// 1 danh sách người được mời riêng, phân biệt bằng key. Không import gì để cả server lẫn component trình duyệt
// (HubAccessGate, HubAccessAdmin) dùng chung được. Thêm 1 app mới = thêm 1 dòng ở đây + bọc route group
// (protected) cho app đó (xem (apps)/pm/(protected)/layout.tsx).
export const HUB_APPS = {
  pm: { label: 'Project Manager', path: '/pm' },
  it: { label: 'IT Hub', path: '/it' },
} as const

export type HubApp = keyof typeof HUB_APPS

export function isHubApp(value: string): value is HubApp {
  return Object.prototype.hasOwnProperty.call(HUB_APPS, value)
}
