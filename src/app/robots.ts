import type { MetadataRoute } from 'next'
import { AI_CRAWLERS, PRIVATE_PREFIXES } from '@/lib/security/crawl'

// robots.txt — lớp 1 chống crawl (xem lib/security/crawl.ts): bot AI tránh toàn bộ site; công cụ tìm kiếm chỉ được index
// portfolio ở "/", tránh mọi app học, /api và link rút gọn.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_CRAWLERS, disallow: '/' },
      { userAgent: '*', allow: '/', disallow: [...PRIVATE_PREFIXES, '/s/'] }, // robots.txt so khớp theo tiền tố
    ],
  }
}
