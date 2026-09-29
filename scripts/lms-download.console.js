// Dán vào Console (F12) khi đang mở trang LMS và đã đăng nhập. Tải mọi Exercise của khóa học
// thành 1 file lms-exercises-<mã khóa>.json → bỏ vào scripts/lms-exercises/ rồi chạy: node scripts/import-lms-exercises.mjs
//
// Lưu ý: mỗi lần gọi /start tạo (hoặc lấy lại) 1 lượt làm bài IN_PROGRESS trên tài khoản — điểm/tiến độ
// không đổi, nhưng LMS sẽ hiện các bài đó là "đang làm". Script gọi isStartOver=false, cách nhau ~1s.
var BASE = location.hostname.split('.').slice(1).join('.'); // trang LMS có dạng <tên>.<miền>; api. và auth-v2. dùng chung <miền>
(async () => {
  // Khóa Writing: 'bbcbda1e4' · Khóa Speaking: 'bbcbda1e3' (lấy từ URL request trong tab Network: /courses/<id>/…)
  const COURSE_ID = 'bbcbda1e3'
  const REG_KEY = 'f68b8957'
  const ONLY = null // vd /L1[1-9]|L2\d/ để chỉ tải vài bài theo tên; null = tải hết
  const DELAY_MS = 1000

  // 1) Token: lấy từ session đang đăng nhập; không thấy thì hỏi (copy giá trị sau "Bearer " của 1 request bất kỳ)
  // Token API là JWT cấp mới mỗi lần (không nằm trong get-session) → thử các endpoint token; nếu không được
  // thì hỏi. Token sai sẽ bị server trả 401 không kèm header CORS, trình duyệt báo thành "CORS error".
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
  const headers = { accept: 'application/json', authorization: 'Bearer ' + token }

  // 2) Danh sách Exercise từ syllabus. Gọi api.<miền LMS> với credentials 'omit' (xác thực bằng Bearer; server
  // không cho gửi cookie qua CORS nên 'include' bị chặn).
  const syl = await (
    await fetch(`https://api.${BASE}/offline-course-management/api/student/courses/${COURSE_ID}/overview/syllabus?studentRegistrationKey=${REG_KEY}`, { headers, credentials: 'omit' })
  ).json()
  const items = []
  const groupTypes = new Set()
  for (const w of syl.weeks ?? []) for (const sw of w.subWeeks ?? []) for (const grp of sw.resources ?? []) {
    groupTypes.add(grp.type)
    if (grp.type === 'EXERCISE') items.push(...grp.resources)
  }
  // Dự phòng: khóa này không có mục EXERCISE trong syllabus → dùng API danh sách exercise (phân trang) của khóa học
  if (items.length === 0) {
    console.warn('Syllabus không có mục EXERCISE (các loại có: ' + [...groupTypes].join(', ') + ') — thử API danh sách exercise…')
    for (let page = 0; page < 50; page++) {
      const r = await fetch(`https://api.${BASE}/offline-course-management/api/learning-management/courses/${COURSE_ID}/exercises?studentRegistrationKey=${REG_KEY}&page=${page}&size=50&search=`, { headers, credentials: 'omit' })
      if (!r.ok) { console.warn('Danh sách exercise lỗi', r.status); break }
      const body = await r.json()
      const rows = Array.isArray(body) ? body : (Object.values(body).find((v) => Array.isArray(v)) ?? [])
      if (page === 0) console.log('Mẫu 1 dòng danh sách:', rows[0])
      const mapped = rows
        .map((x) => ({ ...x, exerciseId: x.exerciseId ?? x.exercise?.id ?? x.exercise?.exerciseId, courseExerciseId: x.courseExerciseId ?? x.id, name: x.name ?? x.testName ?? x.exercise?.testName ?? x.title }))
        .filter((x) => x.exerciseId && x.courseExerciseId)
      if (mapped.length === 0) break
      items.push(...mapped)
      if (rows.length < 50) break
    }
  }
  const todo = items.filter((x) => !ONLY || ONLY.test(x.name))
  console.log(`Có ${items.length} exercise, sẽ tải ${todo.length}`)

  // 3) Gọi /start từng bài
  const out = []
  const failed = []
  for (const [i, x] of todo.entries()) {
    const url = `https://api.${BASE}/exercise-v2/api/exercises/${x.exerciseId}/start?courseId=${COURSE_ID}&courseExerciseId=${x.courseExerciseId}&studentRegistrationKey=${REG_KEY}&isStartOver=false`
    try {
      const r = await fetch(url, { method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body: '{}', credentials: 'omit' })
      if (!r.ok) throw new Error(r.status + ' ' + (await r.text()).slice(0, 120))
      const data = await r.json()
      // Chỉ giữ phần cần cho import (bỏ tiến độ/user) để file nhẹ
      out.push({ exercise: data.exercise })
      const types = [...new Set(data.exercise.pages.filter((p) => p.type === 'QUESTION').map((p) => p.content?.questionType))]
      console.log(`[${i + 1}/${todo.length}] ${x.name} → ${types.join(', ')}`)
    } catch (e) {
      failed.push({ name: x.name, error: String(e) })
      console.warn(`[${i + 1}/${todo.length}] LỖI ${x.name}:`, e)
    }
    await new Promise((res) => setTimeout(res, DELAY_MS))
  }

  // 4) Tải file về
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: 'application/json' }))
  a.download = `lms-exercises-${COURSE_ID}.json`
  a.click()
  console.log(`Xong: ${out.length} bài, ${failed.length} lỗi`, failed)
})()
