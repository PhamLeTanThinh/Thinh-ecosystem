import type { NextConfig } from 'next'
import { PRIVATE_PREFIXES } from './src/lib/security/crawl'

// URL public của bucket R2 — không phải bí mật nên có giá trị mặc định (bản build trên Vercel vẫn chuyển hướng đúng
// kể cả khi chưa khai báo biến). Danh sách thư mục phải khớp R2_DIRS trong scripts/sync-public-to-r2.mjs.
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-39baa00067584b43b749444b6e0d78b5.r2.dev'
const R2_DIRS = ['ielts/images/vocab', 'ielts/images/writing-task1', 'ielts/images/remote', 'korean/vocab-img', 'chinese/vocab-img']

const nextConfig: NextConfig = {
  // Route /api/ielts/audio đọc public/ielts/audio bằng fs nên nft kéo cả ~366 MB mp3 vào function (vượt giới hạn 250 MB
  // của Vercel). Loại ra: trên Vercel route đọc từ Vercel Blob (scripts/upload-listening-audio.mjs).
  outputFileTracingExcludes: {
    '/*': ['public/ielts/audio/**/*'],
  },
  // Trang quản trị đã tách khỏi app IELTS sang /admin — giữ link cũ (email báo yêu cầu cũ, bookmark) còn dùng được.
  async redirects() {
    return [
      { source: '/ielts/admin', destination: '/admin', permanent: false },
      // Ảnh lớn (từ vựng IELTS/Korean/Chinese, đề Writing…) không commit vào git — nằm trên Cloudflare R2
      // (scripts/sync-public-to-r2.mjs) để mỗi bản deploy Vercel không mang theo ~140 MB ảnh. Data vẫn ghi đường
      // dẫn /…; trình duyệt được chuyển thẳng sang R2 (không qua function, không tốn băng thông Vercel).
      ...R2_DIRS.map((dir) => ({ source: `/${dir}/:path*`, destination: `${R2_PUBLIC_URL}/${dir}/:path*`, permanent: true })),
    ]
  },
  // Lớp 2 chống crawl (xem src/lib/security/crawl.ts): mọi trang app + API báo cho bot không index, không lưu bản sao,
  // không dùng nội dung / hình ảnh để huấn luyện AI (noai, noimageai).
  async headers() {
    return PRIVATE_PREFIXES.flatMap((prefix) =>
      [prefix, `${prefix}/:path*`].map((source) => ({
        source,
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai' }],
      })),
    )
  },
  images: {
    // Cho phép load ảnh từ R2 public URL sau này
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
    ],
  },
}

export default nextConfig
