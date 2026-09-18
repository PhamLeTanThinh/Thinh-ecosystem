import type { Metadata } from 'next'
import './tools.css'

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Các công cụ dùng hàng ngày — bấm vào thẻ để mở app tương ứng.',
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <div className="tools-root min-h-dvh">{children}</div>
}
