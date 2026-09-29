// Dán vào Console (F12) khi đang mở trang LMS và đã đăng nhập. Tải mọi Đề mẫu (Sample) của khóa học thành
// 1 file lms-samples-<mã khóa>.json → bỏ vào scripts/lms-samples/ rồi chạy: node scripts/import-lms-samples.mjs
//
// Lưu ý: nội dung đề mẫu chỉ lấy được qua POST .../samples/<id>/sessions (chính request mà trang web gọi khi bạn mở đề).
// Nó tạo (hoặc lấy lại) 1 "phiên đọc" của đề đó trên tài khoản → LMS có thể đánh dấu các đề đã tải là "đang đọc"
// (READING) thay vì "chưa đọc" (UNREAD). Điểm số/tiến độ khác không đổi. Cách nhau ~1s.
var BASE = location.hostname.split('.').slice(1).join('.'); // trang LMS có dạng <tên>.<miền>; api. và auth-v2. dùng chung <miền>
(async () => {
  // Khóa Writing: 'bbcbda1e4' · Khóa Speaking: 'bbcbda1e3' (lấy từ URL request trong tab Network: /courses/<id>/…)
  const COURSE_ID = 'bbcbda1e3'
  const REG_KEY = 'f68b8957'
  const ONLY = null // vd /Hobbies|Technology/ để chỉ tải vài đề theo tên; null = tải hết
  const DELAY_MS = 1000

  // 1) Token (giống các script tải khác)
  const isJwt = (t) => typeof t === 'string' && /^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(t)
  let token
  for (const path of ['token', 'get-session']) {
    try {
      const r = await fetch('https://auth-v2.' + BASE + '/api/auth/' + path, { credentials: 'include' })
      const h = r.headers.get('set-auth-jwt')
      const s = await r.json().catch(() => null)
      token = [h, s?.token, s?.jwt, s?.accessToken, s?.session?.token, s?.session?.accessToken].find(isJwt)
      if (token) break
    } catch {}
  }
  if (!isJwt(token)) token = (prompt('Không tự lấy được token. Dán token (phần sau "Bearer " của 1 request bất kỳ trong tab Network):') ?? '').trim().replace(/^Bearer\s+/i, '')
  if (!isJwt(token)) return console.error('Thiếu token JWT hợp lệ')
  console.log('Đã có token, hết hạn:', new Date(JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp * 1000).toLocaleString())
  // credentials 'omit': API xác thực bằng Bearer, server không cho gửi cookie qua CORS
  const headers = { accept: 'application/json', authorization: 'Bearer ' + token }

  // 2) Danh sách đề mẫu từ syllabus (nhóm SAMPLE)
  const syl = await (
    await fetch(`https://api.${BASE}/offline-course-management/api/student/courses/${COURSE_ID}/overview/syllabus?studentRegistrationKey=${REG_KEY}`, { headers, credentials: 'omit' })
  ).json()
  const samples = []
  for (const w of syl.weeks ?? []) for (const sw of w.subWeeks ?? []) for (const grp of sw.resources ?? []) {
    if (grp.type === 'SAMPLE') samples.push(...grp.resources)
  }
  const todo = samples.filter((x) => !ONLY || ONLY.test(x.name))
  console.log(`Có ${samples.length} đề mẫu, sẽ tải ${todo.length}`)

  // 3) POST /sessions từng đề để lấy nội dung
  const out = []
  const failed = []
  for (const [i, x] of todo.entries()) {
    try {
      const r = await fetch(`https://api.${BASE}/offline-course-management/api/student/courses/samples/${x.id}/sessions`, {
        method: 'POST',
        headers: { ...headers, 'content-type': 'application/json' },
        body: '{}',
        credentials: 'omit',
      })
      if (!r.ok) throw new Error(r.status + ' ' + (await r.text()).slice(0, 120))
      const session = await r.json()
      // Giữ phần cần cho import; bỏ trường không dùng (thumbnail, thống kê…) để file nhẹ
      out.push({ name: x.name, id: x.id, sampleId: x.sampleId, speakingType: x.speakingType, weekName: session.weekName, subWeekName: session.subWeekName, sample: session.sample })
      const s = session.sample
      console.log(`[${i + 1}/${todo.length}] ${x.name} → ${s?.samples?.length ?? 0} câu hỏi, ${s?.vocab?.vocabs?.length ?? 0} từ vựng, exercises=${s?.exercises ? 'có' : 'không'}`)
    } catch (e) {
      failed.push({ name: x.name, error: String(e) })
      console.warn(`[${i + 1}/${todo.length}] LỖI ${x.name}:`, e)
    }
    await new Promise((res) => setTimeout(res, DELAY_MS))
  }

  // 4) Tải file về
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: 'application/json' }))
  a.download = `lms-samples-${COURSE_ID}.json`
  a.click()
  console.log(`Xong: ${out.length} đề, ${failed.length} lỗi`, failed)
})()
