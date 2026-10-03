// Định dạng ngày giờ dùng chung cho mọi bảng ở /admin: DD-MMM-YYYY HH:MM:SS (giờ máy người xem, 3 chữ cái
// tháng viết tắt tiếng Anh để không lẫn ngày/tháng như dd/mm hay mm/dd).
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const pad = (n: number) => String(n).padStart(2, '0')

export function formatAdminDate(iso: string): string {
  const d = new Date(iso)
  return `${pad(d.getDate())}-${MONTHS[d.getMonth()]}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// "5 phút trước", "3 ngày trước"… — kèm formatAdminDate() ở title khi cần ngày giờ đầy đủ
export function ago(iso: string | null): string {
  if (!iso) return '—'
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (min < 1) return 'vừa xong'
  if (min < 60) return `${min} phút trước`
  const h = Math.round(min / 60)
  if (h < 24) return `${h} giờ trước`
  const d = Math.round(h / 24)
  if (d < 30) return `${d} ngày trước`
  const m = Math.round(d / 30)
  return m < 12 ? `${m} tháng trước` : `${Math.round(m / 12)} năm trước`
}

// Màu avatar theo tên / email (ổn định giữa các lần tải)
const AVATAR_COLORS = ['#2b3a55', '#178a5a', '#b45309', '#7c3aed', '#0e7490', '#be185d', '#1d4ed8', '#9a3412']
export function avatarColor(id: string): string {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}
