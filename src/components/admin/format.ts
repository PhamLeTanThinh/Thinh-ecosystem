// Định dạng ngày giờ dùng chung cho mọi bảng ở /admin: DD-MMM-YYYY HH:MM:SS (giờ máy người xem, 3 chữ cái
// tháng viết tắt tiếng Anh để không lẫn ngày/tháng như dd/mm hay mm/dd).
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const pad = (n: number) => String(n).padStart(2, '0')

export function formatAdminDate(iso: string): string {
  const d = new Date(iso)
  return `${pad(d.getDate())}-${MONTHS[d.getMonth()]}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
