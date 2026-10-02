// Tìm ảnh minh hoạ cho thẻ từ vựng Korean/Chinese trên Pixabay (giấy phép Pixabay: dùng tự do, không cần ghi nguồn,
// nhưng KHÔNG được hotlink — nên tải về, thu nhỏ và tự phục vụ ở public/<app>/vocab-img/<cardId>.webp).
//   Xong sẽ tự đồng bộ ảnh lên Cloudflare R2 (scripts/sync-public-to-r2.mjs) — ảnh không commit vào git.
//   node --env-file=.env.local scripts/fetch-vocab-images.mjs <korean|chinese> <lesson…> [--force] [--dry-run]
// Chỉ tìm cho từ có từ khoá ảnh trong scripts/vocab-examples (danh từ cụ thể). Ghi đường dẫn vào cột image.
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'
import sharp from 'sharp'
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const app = args[0]
const lessons = args.slice(1).filter((a) => /^\d+$/.test(a)).map(Number)
const force = args.includes('--force')
const dryRun = args.includes('--dry-run')
if (!['korean', 'chinese'].includes(app) || lessons.length === 0) {
  console.error('Cách dùng: node --env-file=.env.local scripts/fetch-vocab-images.mjs <korean|chinese> <lesson…> [--force] [--dry-run]')
  process.exit(1)
}
const KEY = process.env.PIXABAY_API_KEY
if (!KEY) throw new Error('Thiếu PIXABAY_API_KEY trong .env.local')

const OUT = path.join('public', app, 'vocab-img')
fs.mkdirSync(OUT, { recursive: true })
// Pixabay đặt Cloudflare chặn bot: fetch từ Node (kể cả giả User-Agent) hay Chrome headless đều lúc được lúc bị chặn.
// Nên mọi request đi qua 1 cửa sổ Chrome thật (Playwright, profile riêng để giữ cookie đã qua xác minh): mở API 1 lần
// cho Cloudflare tự giải, sau đó gọi fetch() ngay trong trang (cùng origin pixabay.com, ảnh ở cdn.pixabay.com cho CORS).
const browser = await chromium.launchPersistentContext(path.join(process.env.TEMP ?? '.', 'pixabay-profile'), {
  executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: false,
  args: ['--disable-blink-features=AutomationControlled'],
})
const page = browser.pages()[0] ?? (await browser.newPage())
await page.goto(`https://pixabay.com/api/?key=${KEY}&q=apple&per_page=3`)
for (let i = 0; ; i++) {
  if (i > 60) throw new Error('Không qua được bước xác minh Cloudflare của Pixabay')
  await page.waitForTimeout(1000)
  const body = await page.evaluate(() => document.body?.innerText ?? '').catch(() => '')
  if (body.trim().startsWith('{')) break
}
const getText = (url) => page.evaluate(async (u) => { const r = await fetch(u); return [r.status, await r.text()] }, url)
// Ảnh tải bằng tab riêng (điều hướng thẳng tới URL ảnh) — fetch() trong trang API đôi khi bị cdn trả về trang xác minh.
const imgPage = await browser.newPage()
async function getBytes(url) {
  let res = await imgPage.goto(url)
  // cdn cũng giới hạn tốc độ: gặp 429 thì chờ rồi thử lại (tăng dần) thay vì dừng cả lượt chạy.
  for (let attempt = 1; res?.status() === 429 && attempt <= 5; attempt++) {
    await sleep(30_000 * attempt)
    res = await imgPage.goto(url)
  }
  const type = res?.headers()['content-type'] ?? ''
  if (!res || res.status() !== 200 || !type.startsWith('image/')) {
    const body = res ? (await res.text().catch(() => '')).slice(0, 120) : ''
    throw new Error(`Tải ảnh lỗi ${res?.status()} ${type}: ${url}\n${body}`)
  }
  return res.body()
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Từ khoá ảnh lấy từ scripts/vocab-examples/<app>/L<n>.json (phần tử cuối, tiếng Anh) — chỉ có ở danh từ cụ thể, do
// người soạn câu ví dụ chọn. Từ không có từ khoá (động từ, phó từ, từ trừu tượng…) thì không gắn ảnh.
const norm = (s) => s.replace(/\s+/g, '')
const queries = new Map()
const exDir = path.join('scripts', 'vocab-examples', app)
for (const file of fs.existsSync(exDir) ? fs.readdirSync(exDir).filter((x) => /^L\d+\.json$/.test(x)) : []) {
  const data = JSON.parse(fs.readFileSync(path.join(exDir, file), 'utf8'))
  for (const [word, entry] of Object.entries(data.words)) {
    const q = entry[app === 'korean' ? 2 : 3]
    if (q) queries.set(`${data.lesson}|${norm(word)}`, q)
  }
}

async function search(q) {
  const url = `https://pixabay.com/api/?key=${KEY}&q=${encodeURIComponent(q)}&image_type=all&safesearch=true&per_page=5&order=popular`
  for (let attempt = 0; attempt < 3; attempt++) {
    const [status, text] = await getText(url)
    if (status === 429) {
      await sleep(30_000)
      continue
    }
    if (!text.startsWith('{')) throw new Error(`Pixabay trả về không phải JSON (bị chặn?): ${text.slice(0, 80)}`)
    return JSON.parse(text)
  }
  throw new Error('Pixabay 429 quá nhiều lần')
}

const table = app === 'korean' ? 'korean_cards' : 'chinese_cards'
const frontCol = app === 'korean' ? 'front' : 'hanzi'
// Pool thay vì Client: lượt chạy dài (chờ 429) làm kết nối nhàn rỗi bị Railway cắt — Pool tự mở kết nối mới.
const client = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 })
client.on("error", () => {})
const { rows } = await client.query(
  `SELECT id, lesson, ${frontCol} AS front, meaning, note, image FROM ${table} WHERE kind = 'vocab' AND learner_id IS NULL AND lesson = ANY($1) ORDER BY lesson, sort_order`,
  [lessons],
)

const stats = { ok: 0, skipped: 0, noQuery: 0, noHit: 0 }
const report = []
for (const c of rows) {
  const q = queries.get(`${c.lesson}|${norm(c.front)}`)
  if (!q) {
    // Không có từ khoá → gỡ ảnh cũ (nếu có từ lần chạy trước) để không còn ảnh lệch nghĩa.
    if (c.image && !dryRun) {
      await client.query(`UPDATE ${table} SET image = '' WHERE id = $1`, [c.id])
      fs.rmSync(path.join('public', c.image), { force: true })
    }
    stats.noQuery++
    continue
  }
  if (c.image && !force) {
    stats.skipped++
    continue
  }
  // Từ chỉ màu: từ khoá là mã màu (#rrggbb) → tự vẽ ô màu, chính xác hơn mọi ảnh tìm được.
  if (/^#[0-9a-f]{6}$/i.test(q)) {
    if (!dryRun) {
      const file = `${c.id}.webp`
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360"><rect width="360" height="360" fill="#f4f4f6"/><circle cx="180" cy="180" r="126" fill="${q}" stroke="#d5d7dd" stroke-width="3"/></svg>`
      await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(path.join(OUT, file))
      await client.query(`UPDATE ${table} SET image = $1 WHERE id = $2`, [`/${app}/vocab-img/${file}`, c.id])
    }
    stats.ok++
    report.push([c.lesson, c.front, c.meaning, q, 'ô màu'])
    continue
  }
  const data = await search(q)
  await sleep(700) // ≤ 100 request/phút
  // Chỉ nhận ảnh có tag chứa mọi chữ của từ khoá — tránh ảnh "phổ biến" nhưng lệch nghĩa; không có thì thử ảnh kế tiếp.
  const words = q.toLowerCase().split(' ').filter((w) => w.length > 2)
  const hit = (data.hits ?? []).find((h) => words.every((w) => h.tags.toLowerCase().includes(w)))
  if (!hit) {
    stats.noHit++
    report.push([c.lesson, c.front, c.meaning, q, 'KHÔNG CÓ ẢNH KHỚP'])
    continue
  }
  if (dryRun) {
    report.push([c.lesson, c.front, c.meaning, q, hit.tags])
    continue
  }
  let buf
  try {
    buf = await getBytes(hit.webformatURL)
  } catch (err) {
    stats.noHit++
    report.push([c.lesson, c.front, c.meaning, q, `LỖI TẢI: ${String(err).slice(0, 60)}`])
    continue
  }
  const file = `${c.id}.webp`
  await sharp(buf).resize(360, 360, { fit: "cover" }).webp({ quality: 72 }).toFile(path.join(OUT, file))
  const url = `/${app}/vocab-img/${file}`
  await client.query(`UPDATE ${table} SET image = $1 WHERE id = $2`, [url, c.id])
  stats.ok++
  report.push([c.lesson, c.front, c.meaning, q, hit.tags])
}
await client.end()
await browser.close()
for (const r of report) console.log(r.join(' | '))
console.log(stats)

// Ảnh không commit vào git (.gitignore) mà phục vụ từ Cloudflare R2 — đồng bộ thư mục ảnh của app (kể cả xoá ảnh đã gỡ).
if (!dryRun && process.env.R2_ACCESS_KEY_ID) {
  const { execFileSync } = await import('node:child_process')
  execFileSync(process.execPath, ['scripts/sync-public-to-r2.mjs', `${app}/vocab-img`, '--delete'], { stdio: 'inherit' })
} else if (!dryRun) {
  console.log(`⚠ Chưa có R2_* trong .env.local — nhớ chạy: node --env-file=.env.local scripts/sync-public-to-r2.mjs ${app}/vocab-img --delete`)
}
