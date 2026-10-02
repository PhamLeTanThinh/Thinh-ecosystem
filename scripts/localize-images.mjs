// Tải các ảnh của LMS (chúng tôi) còn hot-link trong dữ liệu IELTS về public/ielts/images/remote/ rồi đổi đường dẫn trong file dữ liệu.
//   node scripts/localize-images.mjs
// Chạy lại được nhiều lần (ảnh đã có thì bỏ qua, link tải lỗi giữ nguyên để lần sau thử lại). Nên chạy lại sau mỗi lần import-lms-*.mjs,
//   Thư mục ảnh không commit vào git — xong nhớ chạy: node --env-file=.env.local scripts/sync-public-to-r2.mjs ielts/images/remote
// vì importer sinh lại file dữ liệu với link gốc. Ảnh của bên thứ ba (Freepik, iStock…) cố ý không tải. File .mp3 (audioUrl) không đụng tới: đó là đường lùi khi thiếu file cục bộ.
import fs from 'node:fs'
import crypto from 'node:crypto'
import path from 'node:path'

const FILES = [
  'src/data/ielts/samples/writing.ts',
  'src/data/ielts/samples/writing-task1.ts',
  'src/data/ielts/samples/speaking.ts',
  'src/data/ielts/listening/lms.ts',
]
const LMS_HOST = /^https:\/\/suijm9clouobj\.vcdn\.cloud\//
const OUT = 'public/ielts/images/remote'
const MANIFEST = path.join(OUT, '_manifest.json')
const PUBLIC_PREFIX = '/ielts/images/remote/'
const EXT = { 'image/jpeg': '.jpg', 'image/jpg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/avif': '.avif', 'image/svg+xml': '.svg' }
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

fs.mkdirSync(OUT, { recursive: true })
const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {}

const texts = new Map(FILES.map((f) => [f, fs.readFileSync(f, 'utf8')]))
const urls = new Set()
for (const t of texts.values()) {
  for (const m of t.matchAll(/'(https?:\/\/[^'\r\n]+)'/g)) {
    if (LMS_HOST.test(m[1]) && !/\.mp3(\?|$)/i.test(m[1])) urls.add(m[1])
  }
}
const todo = [...urls].filter((u) => !(manifest[u] && fs.existsSync(path.join(OUT, manifest[u]))))
console.log(`${urls.size} link ảnh, ${urls.size - todo.length} đã tải, cần tải ${todo.length}`)

const failed = []
let done = 0
async function grab(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/*,*/*;q=0.8' }, signal: AbortSignal.timeout(40000), redirect: 'follow' })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  const type = (res.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
  const buf = Buffer.from(await res.arrayBuffer())
  if (!buf.length) throw new Error('file rỗng')
  let ext = EXT[type]
  if (!ext) {
    // Server trả octet-stream: đoán theo phần đầu file
    if (buf[0] === 0xff && buf[1] === 0xd8) ext = '.jpg'
    else if (buf.slice(1, 4).toString() === 'PNG') ext = '.png'
    else if (buf.slice(0, 4).toString() === 'RIFF') ext = '.webp'
    else if (buf.slice(0, 3).toString() === 'GIF') ext = '.gif'
    else throw new Error('không phải ảnh (' + (type || 'không rõ loại') + ')')
  }
  const name = crypto.createHash('sha1').update(url).digest('hex').slice(0, 14) + ext
  fs.writeFileSync(path.join(OUT, name), buf)
  manifest[url] = name
}

let next = 0
async function worker() {
  while (next < todo.length) {
    const url = todo[next++]
    try {
      await grab(url)
    } catch (e) {
      failed.push([url, e.message])
    }
    if (++done % 50 === 0) console.log(`  ${done}/${todo.length}`)
  }
}
await Promise.all(Array.from({ length: 8 }, worker))
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1))

// Đổi link trong file dữ liệu (chỉ thay đúng chuỗi URL, giữ nguyên xuống dòng CRLF/LF)
let replaced = 0
for (const [file, text] of texts) {
  const out = text.replace(/'(https?:\/\/[^'\r\n]+)'/g, (whole, u) => {
    const name = manifest[u]
    if (!name) return whole
    replaced++
    return `'${PUBLIC_PREFIX}${name}'`
  })
  if (out !== text) fs.writeFileSync(file, out)
}
console.log(`Xong: tải ${todo.length - failed.length}, lỗi ${failed.length}, đổi ${replaced} đường dẫn → ${OUT}`)
if (failed.length) {
  fs.writeFileSync(path.join('scripts', 'localize-images-failed.txt'), failed.map(([u, e]) => `${e}\t${u}`).join('\n'))
  console.log('Danh sách lỗi: scripts/localize-images-failed.txt')
  const byErr = {}
  for (const [, e] of failed) byErr[e] = (byErr[e] ?? 0) + 1
  console.log(byErr)
}
