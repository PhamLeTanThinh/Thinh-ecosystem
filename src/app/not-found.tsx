import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import './not-found.css'

export const metadata: Metadata = {
  title: '404 — Không tìm thấy trang',
}

// 404 dùng chung cho cả hệ thống: URL không khớp route nào, hoặc notFound() được gọi ở bất kỳ trang nào
// (vd vitrine) — chỉ có 1 root layout nên file này là nơi duy nhất cần chỉnh.
export default function NotFound() {
  return (
    <main className="nf-root">
      <Image
        src="/preloader/image/404.png"
        alt="404 — chú mèo đang thắc mắc vì không tìm thấy trang"
        width={1536}
        height={1024}
        priority
        sizes="(max-width: 1100px) 92vw, 1100px"
        className="nf-image"
      />
      <Link href="/" className="nf-home">
        <span aria-hidden="true">←</span> Back To Home
      </Link>
    </main>
  )
}
