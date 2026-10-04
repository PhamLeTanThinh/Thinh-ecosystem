import type { Metadata } from 'next'
import { Caveat, Londrina_Solid, Patrick_Hand } from 'next/font/google'
import './bucketlist.css'

// Chữ tiêu đề to kiểu tô sáp màu
const titleFont = Londrina_Solid({
  subsets: ['latin'],
  weight: ['400', '900'],
  variable: '--font-bl-title',
  display: 'swap',
})

// Chữ viết tay cho danh sách — có bộ tiếng Việt
const handFont = Patrick_Hand({
  subsets: ['latin', 'vietnamese'],
  weight: '400',
  variable: '--font-bl-hand',
  display: 'swap',
})

const scriptFont = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-bl-script',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bucket List — 100 điều muốn làm trước khi chết',
  description: '100 điều muốn làm được trong đời.',
}

export default function BucketListLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${titleFont.variable} ${handFont.variable} ${scriptFont.variable} bl-root`}>{children}</div>
}
