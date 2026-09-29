// Dán vào Console (F12) khi đang mở trang LMS và đã đăng nhập. Tải nội dung các bài thi thử Listening ĐANG LÀM DỞ
// trong roadmap thành 1 file lms-listening-<mã roadmap>.json → bỏ vào scripts/lms-listening/ (thư mục đã bị git bỏ qua).
//
// AN TOÀN VỚI LƯỢT LÀM: script chỉ gọi lại đúng request mà trang làm bài gọi khi bạn bấm "Tiếp tục làm bài"
// (POST .../online-tests/<userCourseOnlineTestId>?mode=ONLINE), và CHỈ cho đề có trạng thái IN_PROGRESS. Nó KHÔNG bắt đầu đề
// mới, KHÔNG động tới đề đã hoàn thành/chưa bắt đầu (các đề đó sẽ được liệt kê để bạn biết), và không nộp bài.
// Đáp án (correctAnswers) do LMS ẩn cho tới khi nộp bài nên file này KHÔNG có đáp án — chỉ có câu hỏi, transcript, link âm thanh.
var BASE = location.hostname.split('.').slice(1).join('.'); // trang LMS có dạng <tên>.<miền>; api. và auth-v2. dùng chung <miền>
(async () => {
  const ROADMAP_ID = '6762fd34aecbd638ad575330' // roadmap Listening (từ URL .../course-roadmap/progress/<id>)
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
  const headers = { accept: 'application/json', authorization: 'Bearer ' + token }

  // 2) Danh sách bài thi thử trong roadmap
  const road = await (await fetch(`https://api.${BASE}/offline-course-management/api/learning-management/roadmaps/progress/${ROADMAP_ID}`, { headers, credentials: 'omit' })).json()
  const tests = []
  for (const m of road.roadmap?.milestones ?? []) for (const day of m.days ?? []) for (const r of day.resources ?? []) if (r.type === 'ONLINE_TEST') tests.push(r)
  const runnable = tests.filter((t) => t.status === 'IN_PROGRESS' && t.userCourseOnlineTestId)
  console.log(`Roadmap có ${tests.length} bài thi thử; đang làm dở (tải được, không tốn lượt): ${runnable.length}`)
  for (const t of tests) if (!runnable.includes(t)) console.log(`  bỏ qua: ${t.name} — trạng thái ${t.status}` + (t.userCourseOnlineTestId ? '' : ' (chưa bắt đầu)'))

  // 3) Tải nội dung từng đề đang làm dở
  const stripWave = (o) => {
    // waveInfo = chuỗi JSON các cặp (max, min) biên độ để vẽ sóng âm — rất nặng (hàng nghìn số/section). Nén thành `wave`:
    // 200 cột, mỗi cột là biên độ đỉnh, chuẩn hoá 0..1 (vài trăm byte/section) rồi bỏ waveInfo gốc.
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
  const out = []
  const failed = []
  for (const [i, t] of runnable.entries()) {
    try {
      const r = await fetch(`https://api.${BASE}/offline-course-management/api/student/courses/online-tests/${t.userCourseOnlineTestId}?mode=ONLINE`, {
        method: 'POST',
        headers: { ...headers, 'content-type': 'application/json' },
        body: '{}',
        credentials: 'omit',
      })
      if (!r.ok) throw new Error(r.status + ' ' + (await r.text()).slice(0, 120))
      const data = stripWave(await r.json())
      out.push({ name: t.name, resourceId: t.resourceId, userCourseOnlineTestId: t.userCourseOnlineTestId, data })
      console.log(`[${i + 1}/${runnable.length}] ${t.name} → ${data.testSections?.length ?? 0} section, ${data.test?.totalQuestion ?? '?'} câu`)
    } catch (e) {
      failed.push({ name: t.name, error: String(e) })
      console.warn(`[${i + 1}/${runnable.length}] LỖI ${t.name}:`, e)
    }
    await new Promise((res) => setTimeout(res, DELAY_MS))
  }

  // 4) Tải file về
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: 'application/json' }))
  a.download = `lms-listening-${ROADMAP_ID}.json`
  a.click()
  console.log(`Xong: ${out.length} đề, ${failed.length} lỗi`, failed)
})()
