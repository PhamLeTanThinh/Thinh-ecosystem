'use client'

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { HandbookCategory, HandbookEntry, HandbookGroup } from '@/lib/handbook/types'
import './grammar-handbook.css'

// Thẻ ngữ pháp mới thêm sau này mà chưa được phân loại vẫn hiện ra ở đây thay vì bị ẩn mất.
const UNCATEGORIZED: HandbookCategory = {
  key: 'uncategorized',
  group: '__other',
  icon: '🗂️',
  title: 'Chưa phân loại',
  intro: 'Mẫu ngữ pháp mới chưa được xếp nhóm trong cẩm nang.',
}

interface Props {
  eyebrow: string
  entries: HandbookEntry[] // đã lọc theo cấp độ, đã sắp xếp
  groups: HandbookGroup[]
  categories: HandbookCategory[]
  searchQuery: string
  levelControl: ReactNode // bộ lọc cấp độ (SegmentedControl riêng của từng app)
  levelColors: Record<string, string> // màu nhãn cấp độ
  frontLang?: string // lang của mẫu / ví dụ (ko, zh) để trình duyệt chọn font đúng
  // Phần chi tiết khi mở 1 mẫu (cấu trúc + lý thuyết + ví dụ) — app truyền vào để dùng lại đúng cách hiển thị thẻ trong bài.
  renderDetail: (id: string) => ReactNode
}

// Cẩm nang ngữ pháp dùng chung (Korean /korean/handbook, Chinese /chinese/handbook): mục lục nhóm bên trái (theo
// nghĩa/chức năng), bên phải là bảng so sánh của 1 nhóm: mẫu | khác ở điểm nào | ví dụ. Bấm 1 hàng để mở lý thuyết
// đầy đủ ngay tại chỗ. Đang gõ tìm kiếm thì hiện mọi nhóm có kết quả liền nhau. Màu lấy từ biến --color-* của app.
export function GrammarHandbook({ eyebrow, entries, groups, categories, searchQuery, levelControl, levelColors, frontLang, renderDetail }: Props) {
  const searchParams = useSearchParams()
  const [activeKey, setActiveKey] = useState(() => searchParams.get('c') ?? categories[0]?.key ?? '')
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set())
  const query = searchQuery.trim().toLowerCase()

  const allCategories = useMemo(() => [...categories, UNCATEGORIZED], [categories])
  const allGroups = useMemo(() => [...groups, { key: UNCATEGORIZED.group, title: 'Khác' }], [groups])

  const entriesByCategory = useMemo(() => {
    const known = new Set(categories.map((c) => c.key))
    const map = new Map<string, HandbookEntry[]>()
    for (const entry of entries) {
      const key = entry.cat && known.has(entry.cat) ? entry.cat : UNCATEGORIZED.key
      const list = map.get(key) ?? []
      list.push(entry)
      map.set(key, list)
    }
    if (!query) return map
    // Khớp tên/giới thiệu của nhóm thì giữ cả nhóm (vd gõ "lý do"), không thì chỉ giữ các mẫu khớp.
    const filtered = new Map<string, HandbookEntry[]>()
    for (const category of allCategories) {
      const list = map.get(category.key) ?? []
      const categoryMatches = category.title.toLowerCase().includes(query) || category.intro.toLowerCase().includes(query)
      const kept = categoryMatches ? list : list.filter((e) => e.searchText.includes(query))
      if (kept.length > 0) filtered.set(category.key, kept)
    }
    return filtered
  }, [entries, categories, allCategories, query])

  const visibleCategories = allCategories.filter((c) => (entriesByCategory.get(c.key)?.length ?? 0) > 0)
  const activeCategory = visibleCategories.find((c) => c.key === activeKey) ?? visibleCategories[0]
  const shownCategories = query ? visibleCategories : activeCategory ? [activeCategory] : []
  const activeIndex = activeCategory ? visibleCategories.indexOf(activeCategory) : -1
  const totalShown = shownCategories.reduce((sum, c) => sum + (entriesByCategory.get(c.key)?.length ?? 0), 0)
  const grouped = allGroups.map((group) => ({ group, categories: visibleCategories.filter((c) => c.group === group.key) })).filter((g) => g.categories.length > 0)

  function pick(key: string) {
    if (query) {
      document.getElementById(`gh-cat-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setActiveKey(key)
    // Giữ nhóm đang xem trên URL (?c=) để F5 / chia sẻ link vẫn đúng nhóm, không tạo thêm mục lịch sử.
    const url = new URL(window.location.href)
    url.searchParams.set('c', key)
    window.history.replaceState(window.history.state, '', url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const count = (key: string) => entriesByCategory.get(key)?.length ?? 0

  return (
    <div className="gh">
      <header className="gh-head">
        <div>
          <p className="gh-eyebrow">{eyebrow}</p>
          <h1 className="gh-title">Cẩm nang ngữ pháp</h1>
          <p className="gh-subtitle">Ngữ pháp gom theo nghĩa. Mỗi nhóm là một bảng so sánh, bấm vào một hàng để xem cách dùng và ví dụ đầy đủ.</p>
        </div>
        <div className="gh-level">{levelControl}</div>
      </header>

      {visibleCategories.length === 0 ? (
        <p className="gh-empty">{entries.length === 0 && !query ? 'Chưa có ngữ pháp nào.' : 'Không có mẫu ngữ pháp nào khớp.'}</p>
      ) : (
        <>
          {/* Mobile: không đủ chỗ cho mục lục bên trái → 1 ô chọn nhóm. */}
          <label className="gh-select">
            <span className="gh-select-label">Nhóm</span>
            <select value={activeCategory?.key} onChange={(e) => pick(e.target.value)}>
              {grouped.map(({ group, categories: cats }) => (
                <optgroup key={group.key} label={group.title}>
                  {cats.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.icon} {c.title} ({count(c.key)})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <div className="gh-layout">
            <nav className="gh-nav" aria-label="Các nhóm ngữ pháp">
              {grouped.map(({ group, categories: cats }) => (
                <div key={group.key} className="gh-nav-group">
                  <p className="gh-nav-group-title">{group.title}</p>
                  {cats.map((c) => (
                    <button key={c.key} type="button" className={`gh-nav-item${!query && c.key === activeCategory?.key ? ' active' : ''}`} onClick={() => pick(c.key)}>
                      <span className="gh-nav-icon" aria-hidden>
                        {c.icon}
                      </span>
                      <span className="gh-nav-title">{c.title}</span>
                      <span className="gh-nav-count">{count(c.key)}</span>
                    </button>
                  ))}
                </div>
              ))}
            </nav>

            <div className="gh-main">
              {query && (
                <p className="gh-result-meta">
                  {totalShown} mẫu trong {shownCategories.length} nhóm khớp &ldquo;{searchQuery.trim()}&rdquo;
                </p>
              )}

              {shownCategories.map((category) => (
                <section key={category.key} id={`gh-cat-${category.key}`} className="gh-panel">
                  <div className="gh-panel-head">
                    <span className="gh-panel-icon" aria-hidden>
                      {category.icon}
                    </span>
                    <div>
                      <h2 className="gh-panel-title">{category.title}</h2>
                      <p className="gh-panel-intro">{category.intro}</p>
                    </div>
                  </div>

                  <div role="list">
                    <div className="gh-thead" aria-hidden>
                      <span>Mẫu ngữ pháp</span>
                      <span>Khác ở điểm nào</span>
                      <span>Ví dụ</span>
                    </div>
                    {(entriesByCategory.get(category.key) ?? []).map((entry) => {
                      const open = openIds.has(entry.id)
                      return (
                        <div key={entry.id} role="listitem" className={`gh-row${open ? ' open' : ''}`}>
                          <button type="button" className="gh-row-head" aria-expanded={open} onClick={() => toggle(entry.id)}>
                            <span className="gh-cell-pattern">
                              <span className="gh-front" lang={frontLang}>
                                {entry.front}
                              </span>
                              {entry.sub && <span className="gh-sub">{entry.sub}</span>}
                              <span className="gh-badge" style={{ '--lv': levelColors[entry.level] ?? 'var(--color-brand)' } as CSSProperties}>
                                {entry.badge}
                              </span>
                            </span>
                            <span className="gh-cell-tip">{entry.tip}</span>
                            <span className="gh-cell-example">
                              {entry.example && (
                                <>
                                  <span className="gh-example-text" lang={frontLang}>
                                    {entry.example.text}
                                  </span>
                                  {entry.example.pinyin && <span className="gh-example-pinyin">{entry.example.pinyin}</span>}
                                  {entry.example.vi && <span className="gh-example-vi">{entry.example.vi}</span>}
                                </>
                              )}
                            </span>
                            <span className="gh-chevron" aria-hidden>
                              ▾
                            </span>
                          </button>
                          {open && (
                            <div className="gh-row-body">
                              {renderDetail(entry.id)}
                              <Link href={entry.lessonHref} className="gh-open-lesson">
                                Mở trong {entry.lessonLabel} →
                              </Link>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>
              ))}

              {!query && activeIndex !== -1 && (
                <div className="gh-pager">
                  {activeIndex > 0 ? (
                    <button type="button" className="gh-pager-btn" onClick={() => pick(visibleCategories[activeIndex - 1].key)}>
                      <span className="gh-pager-dir">← Nhóm trước</span>
                      <span className="gh-pager-name">
                        {visibleCategories[activeIndex - 1].icon} {visibleCategories[activeIndex - 1].title}
                      </span>
                    </button>
                  ) : (
                    <span />
                  )}
                  {activeIndex < visibleCategories.length - 1 && (
                    <button type="button" className="gh-pager-btn gh-pager-btn--next" onClick={() => pick(visibleCategories[activeIndex + 1].key)}>
                      <span className="gh-pager-dir">Nhóm tiếp →</span>
                      <span className="gh-pager-name">
                        {visibleCategories[activeIndex + 1].icon} {visibleCategories[activeIndex + 1].title}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
