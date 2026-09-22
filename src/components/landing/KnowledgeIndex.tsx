'use client'

export interface KnowledgeItem {
  number: number
  title: string
  meta?: string
}

interface Props {
  icon: string
  title: string
  subtitle: string
  items: KnowledgeItem[]
  onPick: (lesson: number) => void
  emptyMessage?: string
}

// Danh sách bài học dùng chung cho Chinese/Korean, cùng cấu trúc banner + card với LessonsIndex của IELTS.
export function KnowledgeIndex({ icon, title, subtitle, items, onPick, emptyMessage = 'Chưa có bài học — sắp ra mắt.' }: Props) {
  return (
    <div className="lv-knowledge-index">
      <header className="lv-knowledge-hero">
        <span className="lv-knowledge-hero-icon" aria-hidden>
          {icon}
        </span>
        <div>
          <h1 className="lv-knowledge-title">{title}</h1>
          <p className="lv-knowledge-subtitle">{subtitle}</p>
        </div>
      </header>

      {items.length === 0 ? (
        <p className="lv-knowledge-empty">{emptyMessage}</p>
      ) : (
        <div className="lv-knowledge-grid">
          {items.map((item) => (
            <button key={item.number} type="button" className="lv-knowledge-card" onClick={() => onPick(item.number)}>
              <span className="lv-knowledge-number">{item.number}</span>
              <span className="lv-knowledge-body">
                <span className="lv-knowledge-cap">Bài {item.number}</span>
                <span className="lv-knowledge-card-title">{item.title}</span>
                {item.meta && <span className="lv-knowledge-meta">{item.meta}</span>}
              </span>
              <span className="lv-knowledge-arrow" aria-hidden>
                →
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
