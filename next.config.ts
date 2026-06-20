import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
