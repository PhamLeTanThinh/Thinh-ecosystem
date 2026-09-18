import Link from 'next/link'
import type { CSSProperties } from 'react'
import { STUDY_TOOLS } from '@/lib/apps/tools'

const STUDY_CLIPS = ['study.mp4', '1.mp4', '2.mp4', '3.mp4', '4.mp4']

export default function StudyPage() {
  return (
    <div className="sd-root">
      <div className="sd-blobs" aria-hidden="true">
        <span className="sd-blob sd-blob-1" />
        <span className="sd-blob sd-blob-2" />
        <span className="sd-blob sd-blob-3" />
        <span className="sd-blob sd-blob-4" />
      </div>

      <div className="sd-content">
        <p className="sd-kicker">Study</p>
        <h1 className="sd-title">Bài học của tôi</h1>
        <p className="sd-subtitle">Chọn một thẻ để mở app tương ứng.</p>

        <div className="sd-grid">
          {STUDY_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="sd-card"
              style={{ '--accent': tool.accent } as CSSProperties}
            >
              <span className="sd-card-icon">{tool.icon}</span>
              <span className="sd-card-name">{tool.title}</span>
              <p className="sd-card-desc">{tool.description}</p>
              <span className="sd-card-go">Mở →</span>
            </Link>
          ))}
        </div>
      </div>

      <footer className="sd-footer">
        <div className="sd-footer-grid">
          {STUDY_CLIPS.map((clip) => (
            <div key={clip} className="sd-footer-clip">
              <video
                src={`/preloader/study/${clip}`}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            </div>
          ))}
        </div>
      </footer>
    </div>
  )
}
