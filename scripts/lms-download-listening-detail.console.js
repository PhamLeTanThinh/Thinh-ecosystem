// Dán vào Console (F12) khi đang mở trang LMS và đã đăng nhập. Không nộp bài. Đề chưa làm được "bắt đầu" (POST resource/generate — giống
// khi bạn bấm nút trên LMS, có thể tốn lượt làm) nếu START_MISSING = true; đọc đề chỉ bằng GET.
// Với mỗi bài thi thử Listening trong roadmap đã có userCourseOnlineTestId (kể cả đề chưa làm xong), gọi
//   GET .../student/courses/online-tests/<userCourseOnlineTestId>
// — request giống trang LMS tự gọi — rồi lưu nguyên văn phản hồi (đề, transcript, đáp án nếu LMS trả về) thành
// lms-listening-detail-<mã roadmap>.json → bỏ vào scripts/lms-listening-detail/ (thư mục bị git bỏ qua).
var BASE = location.hostname.split('.').slice(1).join('.'); // trang LMS có dạng <tên>.<miền>; api. và auth-v2. dùng chung <miền>
(async () => {
  const ROADMAP_ID = '6762fd34aecbd638ad575330' // roadmap Listening (từ URL .../course-roadmap/progress/<id>)
  const DELAY_MS = 700
  const START_MISSING = true // true = bắt đầu các đề chưa làm (có thể tốn lượt làm); false = chỉ đọc các đề đã có mã
  const COURSE_ID = 'bbcbda1e3'
  const REG_KEY = 'f68b8957'
  const ROADMAP_TEMPLATE_ID = '66dac51ba04126061db2fa69' // roadmapId trong body request bắt đầu (khác mã tiến độ ở ROADMAP_ID)

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
  const headers = { accept: 'application/json', authorization: 'Bearer ' + token }

  // 2) Danh sách bài thi thử trong roadmap
  const road = await (await fetch(`https://api.${BASE}/offline-course-management/api/learning-management/roadmaps/progress/${ROADMAP_ID}`, { headers, credentials: 'omit' })).json()
  const tests = []
  for (const m of road.roadmap?.milestones ?? []) for (const day of m.days ?? []) for (const r of day.resources ?? []) if (r.type === 'ONLINE_TEST') tests.push(r)
  console.log(`Roadmap có ${tests.length} bài thi thử`)
  for (const t of tests) console.log(`  ${t.name} — ${t.status}` + (t.userCourseOnlineTestId ? '' : ' — CHƯA có userCourseOnlineTestId (bỏ qua)'))

  // waveInfo rất nặng → nén thành `wave` 200 cột (như script tải trước)
  const stripWave = (o) => {
    if (Array.isArray(o)) o.forEach(stripWave)
    else if (o && typeof o === 'object') {
      if (typeof o.waveInfo === 'string') {
        try {
          const a = JSON.parse(o.waveInfo)
          const peaks = []
          for (let i = 0; i < a.length; i += 2) peaks.push(Math.max(Math.abs(a[i]), Math.abs(a[i + 1] ?? 0)))
          const N = 200
          const cols = []
          for (let b = 0; b < N; b++) {
            const s = Math.floor((b * peaks.length) / N)
            const e = Math.max(s + 1, Math.floor(((b + 1) * peaks.length) / N))
            cols.push(peaks.slice(s, e).reduce((m, v) => Math.max(m, v), 0))
          }
          const top = Math.max(...cols) || 1
          o.wave = cols.map((v) => Math.round((v / top) * 100) / 100)
        } catch {}
        delete o.waveInfo
      }
      for (const k of Object.keys(o)) stripWave(o[k])
    }
    return o
  }
  const countAnswers = (o) => {
    let n = 0
    const walk = (x) => {
      if (Array.isArray(x)) x.forEach(walk)
      else if (x && typeof x === 'object') {
        if (Array.isArray(x.correctAnswers) && x.correctAnswers.length) n++
        Object.values(x).forEach(walk)
      }
    }
    walk(o)
    return n
  }

  // 2b) Đề chưa bắt đầu: gọi đúng request mà trang LMS gọi khi bấm bắt đầu (POST .../roadmaps/resource/generate), lấy userCourseResourceId
  // trả về làm mã đề. Chỉ ĐỌC được đề sau bước này (đề chưa có mã thì GET không có gì để đọc). Dừng ngay khi có lỗi.
  if (START_MISSING) {
    const todo = tests.filter((t) => !t.userCourseOnlineTestId && t.status === 'NOT_STARTED')
    for (const t of todo) {
      const rid = t.userRoadmapResourceId ?? t.id
      if (!rid) {
        console.warn('Không thấy userRoadmapResourceId trong mục roadmap. Các trường có:', Object.fromEntries(Object.entries(t).filter(([, v]) => typeof v !== 'object')))
        break
      }
      const body = JSON.stringify({ subClassKey: COURSE_ID, studentRegistrationKey: REG_KEY, resourceType: 'ONLINE_TEST', resourceId: t.resourceId, roadmapId: ROADMAP_TEMPLATE_ID, userRoadmapResourceId: rid, studyTemplate: 'ROADMAP' })
      const url = `https://api.${BASE}/offline-course-management-sync-job/api/learning-management/roadmaps/resource/generate`
      let r
      for (const cred of ['omit', 'include']) {
        try {
          r = await fetch(url, { method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body, credentials: cred })
          break
        } catch (e) {
          console.warn(`  generate (${cred}) lỗi mạng/CORS:`, e.message)
        }
      }
      const txt = r ? await r.text() : ''
      console.log(`  bắt đầu ${t.name}: HTTP ${r?.status}`, txt.slice(0, 200))
      if (!r?.ok) break
      try {
        t.userCourseOnlineTestId = JSON.parse(txt).userCourseResourceId
      } catch {}
      if (!t.userCourseOnlineTestId) break
      await new Promise((res) => setTimeout(res, 1500))
    }
  }

  // 3) GET từng đề
  const withId = tests.filter((t) => t.userCourseOnlineTestId)
  const out = []
  const failed = []
  for (const [i, t] of withId.entries()) {
    try {
      // "Failed to fetch" = trình duyệt chặn (CORS) hoặc server lỗi không kèm header CORS → thử lần lượt vài kiểu gửi, in ra kiểu nào chạy
      const url = `https://api.${BASE}/offline-course-management/api/student/courses/online-tests/${t.userCourseOnlineTestId}`
      const variants = [
        ['omit', headers],
        ['include', headers],
        ['include+header trang web', { ...headers, 'access-control-allow-origin': '*' }],
      ]
      let r
      const errs = []
      for (const [label, h] of variants) {
        try {
          r = await fetch(url, { headers: h, credentials: label.startsWith('omit') ? 'omit' : 'include' })
          console.log(`  ${t.userCourseOnlineTestId}: ${label} → HTTP ${r.status}`)
          if (r.ok) break
        } catch (e) {
          errs.push(label + ': ' + e.message)
          r = undefined
        }
      }
      if (!r) throw new Error('mọi kiểu đều "Failed to fetch" → ' + errs.join(' | ') + ` | id=${t.userCourseOnlineTestId}`)
      if (!r.ok) throw new Error(r.status + ' ' + (await r.text()).slice(0, 120))
      const detail = stripWave(await r.json())
      out.push({ name: t.name, status: t.status, resourceId: t.resourceId, userCourseOnlineTestId: t.userCourseOnlineTestId, detail })
      console.log(`[${i + 1}/${withId.length}] ${t.name} → ${detail.testSections?.length ?? 0} section, ${countAnswers(detail)} mục có đáp án`)
    } catch (e) {
      failed.push({ name: t.name, error: String(e) })
      console.warn(`[${i + 1}/${withId.length}] LỖI ${t.name}:`, e)
    }
    await new Promise((res) => setTimeout(res, DELAY_MS))
  }

  // 4) Tải file về
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: 'application/json' }))
  a.download = `lms-listening-detail-${ROADMAP_ID}.json`
  a.click()
  console.log(`Xong: ${out.length} đề, ${failed.length} lỗi`, failed)
})()
