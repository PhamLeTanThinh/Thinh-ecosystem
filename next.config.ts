import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
