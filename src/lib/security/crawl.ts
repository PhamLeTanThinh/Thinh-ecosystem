// Chống crawl / scrape dữ liệu học (đề IELTS, thẻ Trung/Hàn, đề Certs...). 3 lớp, dùng chung danh sách ở đây:
//   1. app/robots.ts           — bot "lịch sự" (Google, Bing, bot AI) đọc robots.txt và tự tránh.
//   2. next.config.ts headers  — X-Robots-Tag noindex/noai trên mọi trang app, lỡ bot vào được cũng không index/huấn luyện.
//   3. proxy.ts                — chặn cứng (403) User-Agent của bot AI + thư viện scrape, và giới hạn tốc độ gọi API theo IP.
// Portfolio ở "/" và link rút gọn /s/* vẫn public: link rút gọn cần bot xem trước link (Zalo, Facebook, Slack) đọc được.
// File này không import gì để next.config.ts nạp được.

// Các app học / công cụ cá nhân — không cho index. Thêm app mới thì thêm vào đây (và matcher trong proxy.ts).
export const PRIVATE_PREFIXES = [
  '/admin',
  '/bucketlist',
  '/certs',
  '/chinese',
  '/family',
  '/habits',
  '/ielts',
  '/it',
  '/korean',
  '/money',
  '/music',
  '/notes',
  '/pm',
  '/rmbg',
  '/short',
  '/study',
  '/tools',
  '/trips',
  '/vitrine',
  '/api',
]

// Bot thu thập dữ liệu cho AI — chặn ở mọi nơi, kể cả portfolio.
export const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'Claude-SearchBot',
  'anthropic-ai',
  'CCBot',
  'Google-Extended',
  'GoogleOther',
  'PerplexityBot',
  'Perplexity-User',
  'Bytespider',
  'Amazonbot',
  'Applebot-Extended',
  'FacebookBot',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'cohere-ai',
  'cohere-training-data-crawler',
  'Diffbot',
  'ImagesiftBot',
  'Omgilibot',
  'Omgili',
  'YouBot',
  'Timpibot',
  'AI2Bot',
  'Ai2Bot-Dolma',
  'DuckAssistBot',
  'MistralAI-User',
  'PetalBot',
  'Scrapy',
]

// Dấu hiệu của script/thư viện tự động (không phải trình duyệt người dùng). So khớp không phân biệt hoa thường.
const SCRAPER_SIGNS = [
  'python-requests',
  'python-urllib',
  'python-httpx',
  'aiohttp',
  'scrapy',
  'curl/',
  'wget/',
  'go-http-client',
  'node-fetch',
  'undici',
  'axios/',
  'okhttp',
  'libwww-perl',
  'java/',
  'apache-httpclient',
  'httpclient',
  'headlesschrome',
  'phantomjs',
  'puppeteer',
  'playwright',
  'selenium',
  'httrack',
  'colly',
  'crawler',
  'spider',
  'scraper',
]

const AI_SIGNS = AI_CRAWLERS.map((s) => s.toLowerCase())

// true = User-Agent của bot AI / script scrape, hoặc trống (trình duyệt thật luôn gửi User-Agent).
export function isBlockedAgent(userAgent: string | null): boolean {
  const ua = (userAgent ?? '').toLowerCase().trim()
  if (!ua) return true
  return AI_SIGNS.some((s) => ua.includes(s)) || SCRAPER_SIGNS.some((s) => ua.includes(s))
}

// ── Giới hạn tốc độ gọi API theo IP ─────────────────────────────────────────────────────────────────────────────
// Cửa sổ trượt đơn giản trong bộ nhớ: mỗi IP tối đa RATE_LIMIT request /api trong RATE_WINDOW_MS. Bộ nhớ là của từng
// instance (trên Vercel có thể có nhiều instance song song) nên đây là lớp chặn script tải dồn dập, không phải giới hạn
// tuyệt đối — muốn chặt hơn thì bật Rate Limiting của Vercel Firewall. Mức này rộng rãi cho người học thật (ôn thẻ,
// luyện đề gọi API liên tục cũng chỉ vài request/giây).
const RATE_LIMIT = 240
const RATE_WINDOW_MS = 60_000
const MAX_TRACKED_IPS = 5000

const hits = new Map<string, number[]>()

// true = IP này đã vượt giới hạn, nên trả 429.
export function isRateLimited(ip: string, now = Date.now()): boolean {
  const since = now - RATE_WINDOW_MS
  const recent = (hits.get(ip) ?? []).filter((t) => t > since)
  recent.push(now)
  hits.set(ip, recent)
  // Giữ Map không phình mãi: quá ngưỡng thì bỏ các IP cũ nhất (Map giữ thứ tự chèn).
  if (hits.size > MAX_TRACKED_IPS) {
    for (const key of hits.keys()) {
      hits.delete(key)
      if (hits.size <= MAX_TRACKED_IPS / 2) break
    }
  }
  return recent.length > RATE_LIMIT
}
