import Link from 'next/link'
import type { CSSProperties } from 'react'
import { DAILY_TOOLS } from '@/lib/apps/tools'

export default function ToolsPage() {
  return (
    <div className="tl-root">
      <div className="tl-blobs" aria-hidden="true">
        <span className="tl-blob tl-blob-1" />
        <span className="tl-blob tl-blob-2" />
        <span className="tl-blob tl-blob-3" />
      </div>

      <div className="tl-content">
        <p className="tl-kicker">Tools</p>
        <h1 className="tl-title">Công cụ hàng ngày</h1>
        <p className="tl-subtitle">Chọn một thẻ để mở app tương ứng.</p>

        <div className="tl-grid">
          {DAILY_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="tl-card"
              style={{ '--accent': tool.accent } as CSSProperties}
            >
              <span className="tl-card-icon">{tool.icon}</span>
              <span className="tl-card-name">{tool.title}</span>
              <p className="tl-card-desc">{tool.description}</p>
              <span className="tl-card-go">Mở →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
