// Tải file âm thanh các section của bài thi thử Listening về máy để phát cục bộ (không phụ thuộc CDN của LMS).
//   node scripts/download-listening-audio.mjs [thư-mục-json = scripts/lms-listening]
// Đọc đường dẫn âm thanh từ JSON đã tải bằng scripts/lms-download-listening.console.js, lưu vào
// public/ielts/audio/<id đề>/s<N>.mp3 (thư mục bị git bỏ qua — mỗi đề ~55 MB, không commit). Đã có file đủ dung lượng thì bỏ qua.
// Sau đó chạy lại scripts/import-lms-listening.mjs để app dùng file cục bộ (tự lùi về CDN của LMS nếu thiếu file).
import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const dir = process.argv[2] ?? 'scripts/lms-listening'
const CDN = 'https://suijm9clouobj.vcdn.cloud/'
const OUT = 'public/ielts/audio'
const slug = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const mb = (n) => (n / 1048576).toFixed(1) + ' MB'
let ok = 0
let skipped = 0
let failed = 0

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
  for (const entry of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))) {
    const t = entry.data.test
    const id = 'listening-' + slug(t.testID || t.name)
    for (const [i, sec] of entry.data.testSections.entries()) {
      const a = sec.script?.audio
      if (!a?.path) {
        console.warn(`  ${id} s${i + 1}: không có đường dẫn âm thanh`)
        failed++
        continue
      }
      const dest = path.join(OUT, id, `s${i + 1}.mp3`)
      const want = a.size // dung lượng LMS báo (byte)
      if (fs.existsSync(dest) && fs.statSync(dest).size === want) {
        console.log(`  ${id} s${i + 1}: đã có (${mb(want)})`)
        skipped++
        continue
      }
      try {
        const res = await fetch(CDN + a.path)
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        const tmp = dest + '.part'
        await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(tmp))
        const got = fs.statSync(tmp).size
        if (want && got !== want) throw new Error(`sai dung lượng: tải ${got}, LMS báo ${want}`)
        fs.renameSync(tmp, dest)
        console.log(`  ${id} s${i + 1}: tải xong (${mb(got)})`)
        ok++
      } catch (e) {
        console.warn(`  ${id} s${i + 1}: LỖI ${e.message}`)
        fs.rmSync(dest + '.part', { force: true })
        failed++
      }
    }
  }
}
console.log(`Xong: ${ok} tải mới, ${skipped} đã có, ${failed} lỗi → ${OUT}`)
