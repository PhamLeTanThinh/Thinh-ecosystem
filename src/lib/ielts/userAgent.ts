// Suy ra tên trình duyệt từ chuỗi User-Agent — chỉ để hiển thị thống kê cho chủ trang, không cần
// chính xác tuyệt đối nên không kéo thêm thư viện parse UA. Thứ tự check quan trọng: Edge/Opera
// cũng chứa token "Chrome/", Chrome cũng chứa token "Safari/".
export function detectBrowser(userAgent: string): string {
  const ua = userAgent || ''
  if (/Edg\//.test(ua)) return 'Edge'
  if (/OPR\/|Opera/.test(ua)) return 'Opera'
  if (/Chrome\//.test(ua)) return 'Chrome'
  if (/Firefox\//.test(ua)) return 'Firefox'
  if (/Safari\//.test(ua)) return 'Safari'
  return 'Khác'
}
