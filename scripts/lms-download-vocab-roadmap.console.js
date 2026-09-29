// Dán vào Console (F12) khi đang mở trang LMS và đã đăng nhập. Tải các Vocab set nằm TRONG ROADMAP (vd roadmap Listening) thành
// lms-vocab-roadmap-<mã roadmap>.json → bỏ vào scripts/lms-vocab/ rồi chạy: node scripts/import-lms-vocab.mjs
//
// Đọc danh sách từ bằng GET. Set chưa từng mở thì LMS chưa có mã lượt học → nếu START_MISSING = true, script gọi đúng request "generate"
// mà trang LMS gọi khi bạn mở mục đó (giống lúc bắt đầu bài thi thử; không nộp gì, không chấm điểm). Trước đó nó in thống kê các loại mục
// trong roadmap và thử nhiều tổ hợp mã để tìm cách gọi đúng — log cho biết tổ hợp nào chạy.
var BASE = location.hostname.split('.').slice(1).join('.'); // trang LMS có dạng <tên>.<miền>; api. và auth-v2. dùng chung <miền>
(async () => {
  const ROADMAP_ID = '6762fd34aecbd638ad575330' // roadmap Listening (từ URL .../course-roadmap/progress/<id>)
  const COURSE_ID = 'bbcbda1e3'
  const REG_KEY = 'f68b8957'
  const ROADMAP_TEMPLATE_ID = '66dac51ba04126061db2fa69'
  const SKILL = 'listening' // ghi kèm vào mỗi set để importer biết kỹ năng (tên set trong roadmap có thể không theo mẫu)
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

  // 1) Roadmap: thống kê loại mục, lọc Vocab set
  const road = await (await fetch(`${API}/offline-course-management/api/learning-management/roadmaps/progress/${ROADMAP_ID}`, { headers, credentials: 'omit' })).json()
  const all = []
  for (const m of road.roadmap?.milestones ?? []) for (const d of m.days ?? []) for (const r of d.resources ?? []) all.push(r)
  const byType = {}
  for (const r of all) byType[r.type] = (byType[r.type] ?? 0) + 1
  console.log(`Roadmap có ${all.length} mục:`, byType)
  const sets = all.filter((r) => /VOCAB/i.test(r.type))
  console.log(`Vocab set: ${sets.length}`)
  if (!sets.length) return console.warn('Không thấy mục nào có type chứa "VOCAB". Copy dòng thống kê ở trên cho Claude.')
  console.log('Các trường của mục Vocab đầu tiên:', Object.fromEntries(Object.entries(sets[0]).filter(([, v]) => typeof v !== 'object')))

  const vocabsUrl = (setId, courseId) => `${API}/vocab-v2/api/v2/user-vocab-sets/vocab-set/${setId}/vocabs?sortBy=DEFAULT&courseVocabSetId=${courseId}&studentRegistrationKey=${REG_KEY}&userVocabSetSourceEnum=FROM_COURSE`
  const tryGet = async (setIds, courseIds) => {
    for (const s of setIds.filter(Boolean)) {
      for (const c of courseIds.filter(Boolean)) {
        try {
          const r = await fetch(vocabsUrl(s, c), { headers, credentials: 'omit' })
          tryGet.last = `HTTP ${r.status} (setId=${s}, courseId=${c})`
          if (r.ok) {
            const j = await r.json()
            if (Array.isArray(j)) return { vocabSetId: s, courseVocabSetId: c, vocabs: j }
          }
        } catch {}
      }
    }
    return null
  }
  const uniq = (a) => [...new Set(a.filter(Boolean))]

  // Luồng của trang LMS khi mở 1 Vocab set (bắt từ tab Network): mã trong URL trang = courseResourceId (cid) →
  //   POST/GET .../courses/<khoá>/course-vocab-sets/<cid>/start   (tạo bản ghi học của bạn bên vocab-v2)
  //   GET vocab-v2/api/course-vocab-sets/<cid>                       (cho biết vocabSetId thật)
  //   GET vocab-v2/.../vocab-set/<vocabSetId>/vocabs?courseVocabSetId=<cid>
  const getJson = async (url) => {
    try {
      const r = await fetch(url, { headers, credentials: 'omit' })
      return { status: r.status, ok: r.ok, json: r.ok ? await r.json().catch(() => null) : null }
    } catch (e) {
      return { status: 'lỗi mạng ' + e.message, ok: false, json: null }
    }
  }
  const infoUrl = (cid) => `${API}/vocab-v2/api/course-vocab-sets/${cid}?studentRegistrationKey=${REG_KEY}&userVocabSetSourceEnum=FROM_COURSE`
  const startUrl = (cid) => `${API}/offline-course-management/api/learning-management/courses/${COURSE_ID}/course-vocab-sets/${cid}/start?studentRegistrationKey=${REG_KEY}`
  const startSet = async (cid) => {
    // Chưa biết chắc phương thức → thử POST rồi GET, dừng ở lần thành công đầu tiên
    for (const method of ['POST', 'GET']) {
      try {
        const init = method === 'POST' ? { method, headers: { ...headers, 'content-type': 'application/json' }, body: '{}', credentials: 'omit' } : { method, headers, credentials: 'omit' }
        const r = await fetch(startUrl(cid), init)
        console.log(`  start ${method} ${cid}: HTTP ${r.status}`)
        if (r.ok) return true
      } catch (e) {
        console.warn(`  start ${method} lỗi mạng/CORS:`, e.message)
      }
    }
    return false
  }
  const generate = async (r) => {
    const body = JSON.stringify({ subClassKey: COURSE_ID, studentRegistrationKey: REG_KEY, resourceType: r.type, resourceId: r.resourceId, roadmapId: ROADMAP_TEMPLATE_ID, userRoadmapResourceId: r.userRoadmapResourceId ?? r.id, studyTemplate: 'ROADMAP' })
    for (const cred of ['omit', 'include']) {
      try {
        const res = await fetch(`${API}/offline-course-management-sync-job/api/learning-management/roadmaps/resource/generate`, { method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body, credentials: cred })
        const txt = await res.text()
        console.log(`  generate ${r.name}: HTTP ${res.status}`, txt.slice(0, 120))
        return res.ok ? JSON.parse(txt) : null
      } catch (e) {
        console.warn(`  generate (${cred}) lỗi:`, e.message)
      }
    }
    return null
  }

  const out = []
  const failed = []
  let shownInfo = false
  for (const [i, r] of sets.entries()) {
    let cid = r.courseResourceId ?? r.courseVocabSetId
    if (!cid && START_MISSING) cid = (await generate(r))?.courseResourceId
    let got = null
    let info = { status: '—', json: null }
    let setIds = uniq([r.vocabSetId, r.resourceId])
    if (cid) {
      info = await getJson(infoUrl(cid))
      if (!info.ok && START_MISSING) {
        await startSet(cid)
        await sleep(1200)
        info = await getJson(infoUrl(cid))
      }
      if (info.ok && !shownInfo) {
        shownInfo = true
        console.log('Các trường của course-vocab-sets/<cid>:', Object.fromEntries(Object.entries(info.json ?? {}).filter(([, v]) => typeof v !== 'object')))
      }
      setIds = uniq([info.json?.vocabSetId, info.json?.vocabSet?.id, info.json?.id, ...setIds])
      got = await tryGet(setIds, [cid])
      if (!got && START_MISSING) {
        await startSet(cid)
        await sleep(1500)
        got = await tryGet(setIds, [cid])
      }
    }
    if (!got) tryGet.last = `${tryGet.last ?? ''} | cid=${cid} info=${info.status}`
    if (!got) {
      failed.push({ name: r.name, tried: { cid, setIds } })
      console.warn(`[${i + 1}/${sets.length}] KHÔNG lấy được ${r.name} — lần thử cuối: ${tryGet.last}`, { cid, setIds })
    } else {
      out.push({
        name: r.name,
        skill: SKILL,
        vocabSetId: got.vocabSetId,
        courseVocabSetId: got.courseVocabSetId,
        vocabs: got.vocabs.map((v) => ({
          vocabId: v.vocabId,
          term: v.term,
          partOfSpeeches: v.partOfSpeeches,
          pronounce: v.pronounce,
          enDefinition: v.enDefinition,
          viDefinition: v.viDefinition,
          wordInContexts: v.wordInContexts,
          image: v.image ? { url: v.image.url, name: v.image.name } : null,
        })),
      })
      console.log(`[${i + 1}/${sets.length}] ${r.name} → ${got.vocabs.length} từ (setId=${got.vocabSetId}, courseId=${got.courseVocabSetId})`)
    }
    await sleep(DELAY_MS)
  }

  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: 'application/json' }))
  a.download = `lms-vocab-roadmap-${ROADMAP_ID}.json`
  a.click()
  console.log(`Xong: ${out.length} set, ${failed.length} lỗi`, failed)
})()
