// Dán vào Console (F12) khi đang mở trang LMS và đã đăng nhập. Tải mọi Vocab set của khóa học thành
// 1 file lms-vocab-<mã khóa>.json → bỏ vào scripts/lms-vocab/ rồi chạy: node scripts/import-lms-vocab.mjs
//
// Chỉ ĐỌC danh sách từ (GET), không ghi gì lên tài khoản. Ảnh không tải ở đây — script Node sẽ tải từ URL công khai.
var BASE = location.hostname.split('.').slice(1).join('.') // trang LMS có dạng <tên>.<miền>; api. và auth-v2. dùng chung <miền>
(async () => {
  // Khóa Writing: 'bbcbda1e4' · Khóa Speaking: 'bbcbda1e3' (lấy từ URL request trong tab Network: /courses/<id>/…)
  const COURSE_ID = 'bbcbda1e3'
  const REG_KEY = 'f68b8957'
  const ONLY = null // vd /L1|L2/ để chỉ tải vài set theo tên; null = tải hết
  const DELAY_MS = 600

  // 1) Token (giống script tải Exercise): lấy từ session đang đăng nhập; không thấy thì hỏi
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

  // 2) Danh sách Vocab set từ syllabus
  const syl = await (
    await fetch(`https://api.${BASE}/offline-course-management/api/student/courses/${COURSE_ID}/overview/syllabus?studentRegistrationKey=${REG_KEY}`, { headers, credentials: 'omit' })
  ).json()
  const sets = []
  const groupTypes = new Set()
  for (const w of syl.weeks ?? []) for (const sw of w.subWeeks ?? []) for (const grp of sw.resources ?? []) {
    groupTypes.add(grp.type)
    if (grp.type === 'VOCAB_SET') sets.push(...grp.resources)
  }
  const todo = sets.filter((x) => !ONLY || ONLY.test(x.name))
  console.log(`Có ${sets.length} vocab set (các loại mục trong syllabus: ${[...groupTypes].join(', ')}), sẽ tải ${todo.length}`)

  // 3) Gọi API danh sách từ của từng set
  const out = []
  const failed = []
  for (const [i, x] of todo.entries()) {
    const url = `https://api.${BASE}/vocab-v2/api/v2/user-vocab-sets/vocab-set/${x.vocabSetId}/vocabs?sortBy=DEFAULT&courseVocabSetId=${x.courseVocabSetId}&studentRegistrationKey=${REG_KEY}&userVocabSetSourceEnum=FROM_COURSE`
    try {
      const r = await fetch(url, { headers, credentials: 'omit' })
      if (!r.ok) throw new Error(r.status + ' ' + (await r.text()).slice(0, 120))
      const vocabs = await r.json()
      // Chỉ giữ phần cần cho import (bỏ tiến độ học, bài quiz kèm theo…) để file nhẹ
      out.push({
        name: x.name,
        vocabSetId: x.vocabSetId,
        courseVocabSetId: x.courseVocabSetId,
        vocabs: vocabs.map((v) => ({
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
      console.log(`[${i + 1}/${todo.length}] ${x.name} → ${vocabs.length} từ (syllabus báo ${x.noOfVocabs})`)
    } catch (e) {
      failed.push({ name: x.name, error: String(e) })
      console.warn(`[${i + 1}/${todo.length}] LỖI ${x.name}:`, e)
    }
    await new Promise((res) => setTimeout(res, DELAY_MS))
  }

  // 4) Tải file về
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: 'application/json' }))
  a.download = `lms-vocab-${COURSE_ID}.json`
  a.click()
  console.log(`Xong: ${out.length} set, ${failed.length} lỗi`, failed)
})()
