// Dán vào Console (F12) khi đang mở trang LMS và đã đăng nhập. Tải các bài DICTATION nằm trong roadmap (vd roadmap Listening) thành
// lms-dictation-<mã roadmap>.json → bỏ vào scripts/lms-dictation/ (thư mục bị git bỏ qua).
//
// Luồng của trang LMS khi mở 1 bài Dictation (bắt từ tab Network):
//   POST .../roadmaps/resource/generate            → courseResourceId (cid)        [chỉ khi mục chưa có mã]
//   ? dictation/api/dictations/<resourceId>/start?courseDictationId=<cid>          → tạo bản ghi luyện của bạn
//   GET dictation/api/user-dictations/<mã bản ghi> → đề: các câu, từng từ, mốc thời gian, bản dịch, từ vựng hay
// Chưa biết chắc "start" dùng POST hay GET nên thử POST rồi GET và in mã HTTP từng lần. Không nộp/chấm gì. Mở bài có thể đánh dấu bài đó
// là "đang làm" trong tài khoản LMS của bạn. Âm thanh không cần tải ở đây: bài Dictation dùng đúng file mp3 của section đề CAM tương ứng.
var BASE = location.hostname.split('.').slice(1).join('.'); // trang LMS có dạng <tên>.<miền>; api. và auth-v2. dùng chung <miền>
(async () => {
  const ROADMAP_ID = '6762fd34aecbd638ad575330' // roadmap Listening (từ URL .../course-roadmap/progress/<id>)
  const COURSE_ID = 'bbcbda1e3'
  const REG_KEY = 'f68b8957'
  const ROADMAP_TEMPLATE_ID = '66dac51ba04126061db2fa69'
  const TYPE = 'DICTATION'
  const START_MISSING = true
  const DELAY_MS = 700
  const API = `https://api.${BASE}`

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
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

  // 1) Roadmap
  const road = await (await fetch(`${API}/offline-course-management/api/learning-management/roadmaps/progress/${ROADMAP_ID}`, { headers, credentials: 'omit' })).json()
  const all = []
  for (const m of road.roadmap?.milestones ?? []) for (const d of m.days ?? []) for (const r of d.resources ?? []) all.push(r)
  const byType = {}
  for (const r of all) byType[r.type] = (byType[r.type] ?? 0) + 1
  console.log(`Roadmap có ${all.length} mục:`, byType)
  const items = all.filter((r) => r.type === TYPE)
  console.log(`${TYPE}: ${items.length} bài`)
  if (!items.length) return console.warn(`Không có mục type "${TYPE}". Copy dòng thống kê ở trên cho Claude.`)
  console.log('Các trường của mục đầu tiên:', Object.fromEntries(Object.entries(items[0]).filter(([, v]) => typeof v !== 'object')))

  const getJson = async (url) => {
    try {
      const r = await fetch(url, { headers, credentials: 'omit' })
      return { status: r.status, ok: r.ok, json: r.ok ? await r.json().catch(() => null) : null }
    } catch (e) {
      return { status: 'lỗi mạng ' + e.message, ok: false, json: null }
    }
  }
  const generate = async (r) => {
    const body = JSON.stringify({ subClassKey: COURSE_ID, studentRegistrationKey: REG_KEY, resourceType: r.type, resourceId: r.resourceId, roadmapId: ROADMAP_TEMPLATE_ID, userRoadmapResourceId: r.userRoadmapResourceId ?? r.id, studyTemplate: 'ROADMAP' })
    for (const cred of ['omit', 'include']) {
      try {
        const res = await fetch(`${API}/offline-course-management-sync-job/api/learning-management/roadmaps/resource/generate`, { method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body, credentials: cred })
        const txt = await res.text()
        console.log(`  generate ${r.name}: HTTP ${res.status}`, txt.slice(0, 100))
        return res.ok ? JSON.parse(txt) : null
      } catch (e) {
        console.warn(`  generate (${cred}) lỗi:`, e.message)
      }
    }
    return null
  }
  // "start": trả về bản ghi luyện của bạn (có thể chứa luôn đề, hoặc chỉ có mã để GET tiếp)
  const start = async (dictId, cid) => {
    const url = `${API}/dictation/api/dictations/${dictId}/start?courseDictationId=${cid}&studentRegistrationKey=${REG_KEY}`
    for (const method of ['POST', 'GET']) {
      try {
        const init = method === 'POST' ? { method, headers: { ...headers, 'content-type': 'application/json' }, body: '{}', credentials: 'omit' } : { method, headers, credentials: 'omit' }
        const r = await fetch(url, init)
        const txt = await r.text()
        console.log(`  start ${method} ${dictId}: HTTP ${r.status}`, txt.slice(0, 160))
        if (r.ok) return JSON.parse(txt)
      } catch (e) {
        console.warn(`  start ${method} lỗi mạng/CORS:`, e.message)
      }
    }
    return null
  }
  const sentencesOf = (j) => j?.dictation?.sentences ?? j?.sentences

  const out = []
  const failed = []
  for (const [i, r] of items.entries()) {
    try {
      let cid = r.courseResourceId ?? r.courseDictationId
      if (!cid && START_MISSING) cid = (await generate(r))?.courseResourceId
      if (!cid) throw new Error('không có mã khóa học (courseResourceId)')
      let ud = null
      const st = await start(r.resourceId, cid)
      if (sentencesOf(st)) ud = st
      else {
        // mã bản ghi luyện: thường nằm trong phản hồi "start"; thử vài tên trường quen thuộc
        const id = st?.id ?? st?.userDictationId ?? st?.userDictation?.id ?? st?.data?.id
        if (id) {
          const g = await getJson(`${API}/dictation/api/user-dictations/${id}`)
          if (g.ok) ud = g.json
          else console.warn(`  GET user-dictations/${id}: HTTP ${g.status}`)
        }
      }
      const d = ud?.dictation ?? ud
      if (!d?.sentences?.length) throw new Error('không lấy được các câu của bài (xem log "start" ở trên)')
      out.push({ name: r.name, resourceId: r.resourceId, dictation: d })
      console.log(`[${i + 1}/${items.length}] ${r.name} → ${d.sentences.length} câu, ${d.noOfWords ?? '?'} từ (${d.dictationId})`)
    } catch (e) {
      failed.push({ name: r.name, error: String(e) })
      console.warn(`[${i + 1}/${items.length}] LỖI ${r.name}:`, e)
    }
    await sleep(DELAY_MS)
  }

  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: 'application/json' }))
  a.download = `lms-dictation-${ROADMAP_ID}.json`
  a.click()
  console.log(`Xong: ${out.length} bài, ${failed.length} lỗi`, failed)
})()
