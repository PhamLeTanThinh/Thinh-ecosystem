import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Route /api/ielts/audio đọc public/ielts/audio bằng fs nên nft kéo cả ~366 MB mp3 vào function (vượt giới hạn 250 MB
  // của Vercel). Loại ra: trên Vercel route đọc từ Vercel Blob (scripts/upload-listening-audio.mjs).
  outputFileTracingExcludes: {
    '/*': ['public/ielts/audio/**/*'],
  },
  // Trang quản trị đã tách khỏi app IELTS sang /admin — giữ link cũ (email báo yêu cầu cũ, bookmark) còn dùng được.
  async redirects() {
    return [{ source: '/ielts/admin', destination: '/admin', permanent: false }]
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
