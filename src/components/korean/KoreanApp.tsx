'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useParams, useRouter, useSearchParams } from 'next/navigation'
import { useKoreanStore } from '@/lib/korean/store'
import { useKoreanUIStore } from '@/lib/korean/uiStore'
import { LESSON_NUMBERS, LESSON_TITLES } from '@/lib/korean/lessons'
import { Sidebar, type Selection, type TopikKey } from '@/components/korean/Sidebar'
import { LearnerProfile } from '@/components/learner/LearnerProfile'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { LevelLanding, type LandingItem } from '@/components/landing/LevelLanding'
import { KnowledgeIndex } from '@/components/landing/KnowledgeIndex'
import { SegmentedControl } from '@/components/korean/SegmentedControl'
import type { ExampleDetail } from '@/lib/korean/exampleDetail'
import { SPEAKING_PRACTICE, type SpeakingPracticeSet } from '@/lib/korean/speakingPractice'
import { SpeakButton } from '@/components/shared/SpeakButton'
import { KOREAN_LOADING } from '@/lib/loading/apps'
import { createLoadingTracker } from '@/lib/loading/tracker'
import type { KoreanCard, KoreanCardKind, KoreanProgress, QuizMode } from '@/lib/korean/types'

const KO_LANG = 'ko-KR'

const PAGE_SIZE = 30
const loadingTracker = createLoadingTracker(KOREAN_LOADING.apiPrefix)

const SHUFFLE_OPTIONS: { value: 'on' | 'off'; label: string }[] = [
  { value: 'on', label: '🔀 Ngẫu nhiên' },
  { value: 'off', label: 'Theo danh sách' },
]

const QUIZ_MODE_OPTIONS: { value: QuizMode; label: string }[] = [
  { value: 'front-to-meaning', label: 'Từ/mẫu câu → Nghĩa' },
  { value: 'meaning-to-front', label: 'Nghĩa → Từ/mẫu câu' },
]

const KIND_OPTIONS: { value: 'all' | KoreanCardKind; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'vocab', label: '📚 Từ vựng' },
  { value: 'grammar', label: '✏️ Ngữ pháp' },
]

type StatusFilter = 'all' | 'learned' | 'unlearned'

// Đường dẫn thật cho từng loại lựa chọn — /korean/vocab (tổng quan), /korean/lessons/<n>. Mỗi bài giờ
// có URL riêng (chia sẻ được, back/forward hoạt động), cùng pattern với /ielts/<skill>/lessons/<id>.
function pathForSelection(s: Selection): string {
  return s.type === 'lesson' ? `/korean/lessons/${s.lesson}` : '/korean/vocab'
}

export function KoreanApp() {
  const cards = useKoreanStore((s) => s.cards)
  const progress = useKoreanStore((s) => s.progress)
  const settings = useKoreanStore((s) => s.settings)
  const updateSettings = useKoreanStore((s) => s.updateSettings)
  const openAddCard = useKoreanUIStore((s) => s.openAddCard)
  const navigatingTo = useKoreanUIStore((s) => s.navigatingTo)
  const beginNavigating = useKoreanUIStore((s) => s.beginNavigating)
  const endNavigating = useKoreanUIStore((s) => s.endNavigating)

  const router = useRouter()
  const pathname = usePathname()
  const params = useParams<{ lesson?: string }>()
  const searchParams = useSearchParams()
  // Chuyển bài giờ là điều hướng route thật (không chỉ đổi state) — component này REMOUNT ngay khi
  // route mới sẵn sàng, nên đích điều hướng phải sống ở store chứ không phải state cục bộ ở đây.
  // Overlay chỉ nhả cờ điều hướng khi URL đã khớp đích; tracker API sẽ tiếp tục giữ nó nếu còn request.
  function navigate(path: string) {
    loadingTracker.setNavigationPending(true)
    beginNavigating(path)
    router.push(path)
  }
  useEffect(() => {
    if (navigatingTo === null) return
    const target = new URL(navigatingTo, window.location.origin)
    const currentSearch = new URLSearchParams(searchParams.toString())
    target.searchParams.sort()
    currentSearch.sort()
    if (target.pathname !== pathname || target.searchParams.toString() !== currentSearch.toString()) return
    loadingTracker.setNavigationPending(false)
    endNavigating()
  }, [navigatingTo, pathname, searchParams, endNavigating])

  // Bài đang chọn suy ra thẳng từ URL (giống SkillSidebar của IELTS đọc từ pathname) thay vì state
  // riêng — mỗi loại có route riêng nên URL luôn phản ánh đúng đang xem gì, F5/chia sẻ link đều đúng.
  const selection: Selection = pathname.startsWith('/korean/lessons/')
    ? { type: 'lesson', lesson: Number(params.lesson) }
    : pathname === '/korean/lessons'
      ? { type: 'knowledge' }
      : { type: 'overview' }
  // Chỉ đúng "/korean" (không có gì sau) là màn hình chọn cấp độ — mọi route con khác đều đã "vào trong".
  const showLanding = pathname === '/korean'
  const kindParam = searchParams.get('kind')
  const contentKind: 'vocab' | 'grammar' | null = kindParam === 'vocab' || kindParam === 'grammar' ? kindParam : null

  const [kindFilter, setKindFilter] = useState<'all' | KoreanCardKind>(contentKind ?? 'all')
  const [previousContentKind, setPreviousContentKind] = useState(contentKind)
  if (contentKind !== previousContentKind) {
    setPreviousContentKind(contentKind)
    setKindFilter(contentKind ?? 'all')
  }
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') ?? '')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  // Nhóm cấp độ mở sẵn trong sidebar khi vừa bấm 1 card ở màn hình chọn cấp độ — mang qua route mới
  // bằng query string (?open=topik2), đọc 1 lần lúc mount (xem prop initialGroup của Sidebar).
  const initialGroup = (searchParams.get('open') as TopikKey | null) ?? null

  // Quay lại trang đầu mỗi khi đổi bộ lọc/lựa chọn/từ khoá tìm kiếm — cập nhật state trong lúc
  // render (không phải effect) để tránh 1 nhịp render thừa, cùng convention với app/(apps)/chinese/page.tsx.
  const filterKey = `${selection.type === 'lesson' ? selection.lesson : 'overview'}|${kindFilter}|${statusFilter}|${searchQuery}`
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey)
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey)
    setVisibleCount(PAGE_SIZE)
  }

  const progressByCard = new Map(progress.map((p) => [p.id, p]))
  const isLearned = (cardId: string) => progressByCard.get(cardId)?.lastResult === 'correct'

  const sortedCards = [...cards].sort((a, b) => a.lesson - b.lesson || a.sortOrder - b.sortOrder)
  const overviewCards = initialGroup === 'topik1' ? [] : sortedCards
  const learnedCount = overviewCards.filter((c) => isLearned(c.id)).length
  const learnedPercent = overviewCards.length > 0 ? Math.round((learnedCount / overviewCards.length) * 100) : 0

  function pickLevel(key: string) {
    navigate(`/korean/lessons?open=${key}`)
  }

  const landingItems: LandingItem[] = [
    { key: 'topik1', icon: 'I', label: 'TOPIK I', meta: 'Sắp ra mắt', muted: true },
    { key: 'topik2', icon: 'II', label: 'TOPIK II', sublabel: 'Seoul Korean 2', meta: LESSON_NUMBERS.length + ' bài · ' + sortedCards.length + ' thẻ' },
  ]

  return (
    <div className="kr-shell">
      {!showLanding && (
        <Sidebar
          cards={sortedCards}
          isLearned={isLearned}
          selection={selection}
          onSelect={(s) => navigate(pathForSelection(s))}
          onOpenKnowledge={(group) => navigate(`/korean/lessons?open=${group}`)}
          contentKind={contentKind}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
          initialGroup={initialGroup}
        />
      )}

      <div className="kr-main">
        <header className="kr-topbar">
          {!showLanding && (
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Mở danh sách bài học"
              className="kr-mobile-menu-btn"
            >
              ☰
            </button>
          )}
          {/* Khi đã vào trong (sidebar hiện), breadcrumb chuyển sang nằm ở đầu sidebar (Sidebar.tsx) thay
              cho tiêu đề tĩnh cũ — ở đây chỉ còn cần lúc màn hình chọn cấp độ chưa có sidebar. */}
          {showLanding && <AppBreadcrumb app="/korean" />}
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value
              setSearchQuery(value)
              // Gõ tìm kiếm ở màn hình đầu thì vào thẳng danh sách kết quả — mang từ khoá qua bằng query
              // string vì route đổi (unmount) khiến state cục bộ mất, không animation (ô nhập đang focus).
              if (showLanding && value.trim()) navigate(`/korean/vocab?q=${encodeURIComponent(value.trim())}`)
            }}
            placeholder="🔍 Tìm theo Hangul, mẫu ngữ pháp hoặc nghĩa…"
            className="kr-search"
          />
          <button type="button" onClick={() => openAddCard()} className="kr-btn-outline">
            ＋ Thêm thẻ
          </button>
          <LearnerProfile />
        </header>

        {showLanding ? (
          <div className="kr-content">
            <LevelLanding
              eyebrow="한국어 공부"
              title="Korean Hub"
              subtitle="Chọn cấp độ TOPIK để bắt đầu"
              items={landingItems}
              transitionPrefix="kr"
              onPick={pickLevel}
            />
          </div>
        ) : selection.type === 'knowledge' ? (
          <KnowledgeIndex
            icon="한"
            title={`Kiến thức ${initialGroup === 'topik1' ? 'TOPIK I' : 'TOPIK II'}`}
            subtitle={`${initialGroup === 'topik1' ? 0 : LESSON_NUMBERS.length} bài học${initialGroup === 'topik1' ? '' : ' · chọn một bài để bắt đầu'}`}
            items={
              initialGroup === 'topik1'
                ? []
                : LESSON_NUMBERS.map((lesson) => {
                    const lessonCards = sortedCards.filter((card) => card.lesson === lesson)
                    return {
                      number: lesson,
                      title: LESSON_TITLES[lesson],
                      meta: `${lessonCards.filter((card) => isLearned(card.id)).length}/${lessonCards.length} thuộc`,
                    }
                  })
            }
            onPick={(lesson) => navigate(`/korean/lessons/${lesson}`)}
          />
        ) : selection.type === 'overview' ? (
          <OverviewContent
            sortedCards={overviewCards}
            progressByCard={progressByCard}
            isLearned={isLearned}
            learnedCount={learnedCount}
            learnedPercent={learnedPercent}
            settings={settings}
            updateSettings={updateSettings}
            contentKind={contentKind}
            kindFilter={kindFilter}
            setKindFilter={setKindFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            visibleCount={visibleCount}
            setVisibleCount={setVisibleCount}
          />
        ) : (
          <LessonContent lesson={selection.lesson} cards={sortedCards} progressByCard={progressByCard} isLearned={isLearned} />
        )}
      </div>
    </div>
  )
}

function OverviewContent({
  sortedCards,
  progressByCard,
  isLearned,
  learnedCount,
  learnedPercent,
  settings,
  updateSettings,
  contentKind,
  kindFilter,
  setKindFilter,
  statusFilter,
  setStatusFilter,
  searchQuery,
  visibleCount,
  setVisibleCount,
}: {
  sortedCards: KoreanCard[]
  progressByCard: Map<string, KoreanProgress>
  isLearned: (id: string) => boolean
  learnedCount: number
  learnedPercent: number
  settings: { shuffle: boolean; quizMode: QuizMode }
  updateSettings: (patch: Partial<{ shuffle: boolean; quizMode: QuizMode }>) => void
  contentKind: 'vocab' | 'grammar' | null
  kindFilter: 'all' | KoreanCardKind
  setKindFilter: (v: 'all' | KoreanCardKind) => void
  statusFilter: StatusFilter
  setStatusFilter: (v: StatusFilter) => void
  searchQuery: string
  visibleCount: number
  setVisibleCount: (fn: (c: number) => number) => void
}) {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  const visibleCards = sortedCards.filter((c) => {
    if (kindFilter !== 'all' && c.kind !== kindFilter) return false
    if (statusFilter === 'learned' && !isLearned(c.id)) return false
    if (statusFilter === 'unlearned' && isLearned(c.id)) return false
    if (!normalizedQuery) return true
    return (
      c.front.toLowerCase().includes(normalizedQuery) ||
      c.meaning.toLowerCase().includes(normalizedQuery) ||
      c.note.toLowerCase().includes(normalizedQuery)
    )
  })

  const pagedCards = visibleCards.slice(0, visibleCount)
  const hasMore = visibleCount < visibleCards.length

  return (
    <div className="kr-content">
      <div className="kr-content-header">
        <div>
          <p className="kr-eyebrow">한국어 공부</p>
          <h1 className="kr-page-title">{contentKind === 'vocab' ? 'Tất cả từ vựng' : contentKind === 'grammar' ? 'Tất cả ngữ pháp' : 'Tất cả bài học'}</h1>
        </div>
        <div className="kr-content-header-actions">
          <Link href="/korean/study" className="kr-btn-outline">
            🎴 Ôn tập
          </Link>
          <Link href="/korean/quiz" className="kr-btn-solid">
            📝 Tạo quiz
          </Link>
        </div>
      </div>

      <div className="kr-stats-row">
        <div className="kr-glass kr-stat-tile">
          <p className="kr-stat-value">{sortedCards.length}</p>
          <p className="kr-stat-label">Tổng số thẻ</p>
        </div>
        <div className="kr-glass kr-stat-tile">
          <p className="kr-stat-value kr-stat-value-accent">{learnedCount}</p>
          <p className="kr-stat-label">Đã thuộc</p>
        </div>
        <div className="kr-glass kr-stat-tile">
          <p className="kr-stat-value">{learnedPercent}%</p>
          <p className="kr-stat-label">Hoàn thành</p>
        </div>
      </div>

      <div className="kr-glass kr-filter-panel">
        <div>
          <p className="kr-filter-label">THỨ TỰ ÔN TẬP</p>
          <SegmentedControl options={SHUFFLE_OPTIONS} value={settings.shuffle ? 'on' : 'off'} onChange={(value) => updateSettings({ shuffle: value === 'on' })} />
        </div>
        <div>
          <p className="kr-filter-label">CHẾ ĐỘ TRẮC NGHIỆM</p>
          <SegmentedControl dense options={QUIZ_MODE_OPTIONS} value={settings.quizMode} onChange={(value) => updateSettings({ quizMode: value })} />
        </div>
        <div>
          <p className="kr-filter-label">LOẠI THẺ</p>
          <SegmentedControl dense options={KIND_OPTIONS} value={kindFilter} onChange={setKindFilter} />
        </div>
        <div>
          <p className="kr-filter-label">TRẠNG THÁI</p>
          <SegmentedControl
            dense
            options={[
              { value: 'all' as const, label: `Tất cả (${sortedCards.length})` },
              { value: 'learned' as const, label: `Đã thuộc (${learnedCount})` },
              { value: 'unlearned' as const, label: `Chưa thuộc (${sortedCards.length - learnedCount})` },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      <div className="kr-card-list-header">
        <p className="kr-section-label">DANH SÁCH THẺ</p>
        <p className="kr-section-meta">
          {visibleCards.length} thẻ
          {normalizedQuery || statusFilter !== 'all' || kindFilter !== 'all' ? ` (đã lọc / ${sortedCards.length} tổng)` : ''}
        </p>
      </div>

      {visibleCards.length === 0 && (
        <p className="kr-glass py-10 text-center text-sm text-muted">
          {sortedCards.length === 0 ? 'Chưa có thẻ nào. Nhấn "Thêm thẻ" để bắt đầu.' : 'Không có thẻ nào khớp.'}
        </p>
      )}

      <div className="kr-card-grid">
        {pagedCards.map((card, i) => {
          const showLessonHeader = i === 0 || pagedCards[i - 1].lesson !== card.lesson
          return (
            <div key={card.id} className="contents">
              {showLessonHeader && (
                <p className="kr-lesson-group-header">
                  제{card.lesson}과 · {LESSON_TITLES[card.lesson] ?? ''}
                </p>
              )}
              <VocabTile card={card} progress={progressByCard.get(card.id)} learned={isLearned(card.id)} />
            </div>
          )
        })}
      </div>

      {hasMore && (
        <button type="button" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="kr-glass mt-2 w-full py-3 text-sm font-semibold text-muted">
          Xem thêm {Math.min(PAGE_SIZE, visibleCards.length - visibleCount)} thẻ ↓
        </button>
      )}
    </div>
  )
}

function LessonContent({
  lesson,
  cards,
  progressByCard,
  isLearned,
}: {
  lesson: number
  cards: KoreanCard[]
  progressByCard: Map<string, KoreanProgress>
  isLearned: (id: string) => boolean
}) {
  const lessonCards = cards.filter((c) => c.lesson === lesson)
  const vocabCards = lessonCards.filter((c) => c.kind === 'vocab')
  const grammarCards = lessonCards.filter((c) => c.kind === 'grammar')
  const speaking = SPEAKING_PRACTICE[lesson]

  // Mục lục "Đang đọc" bên phải — mỗi mục là 1 điểm ngữ pháp cụ thể (không chỉ tiêu đề mục lớn)
  // để nhảy thẳng tới đúng thẻ đang cần xem, giống cách .ih-side-toc sinh từ H2 bên app IELTS.
  const tocItems = useMemo(() => {
    const items: { id: string; label: string }[] = []
    if (vocabCards.length > 0) items.push({ id: 'kr-section-vocab', label: '📚 Từ vựng' })
    grammarCards.forEach((c) => items.push({ id: `kr-grammar-${c.id}`, label: c.front }))
    if (speaking) items.push({ id: 'kr-section-speaking', label: '🗣️ Luyện nói' })
    return items
  }, [vocabCards.length, grammarCards, speaking])

  const activeTocId = useSectionScrollspy(tocItems)

  // Trên mobile không đủ chỗ để cuộn + mục lục bên phải như desktop, nên thay bằng tab bấm-để-xem
  // (CSS chỉ hiện .kr-mobile-tabs và áp dụng .kr-mobile-section ở @media ≤860px — desktop vẫn giữ
  // nguyên bố cục cuộn dọc như cũ, xem korean.css). Nếu bài không có Luyện nói mà tab đang chọn lại
  // là 'speaking' (dư từ bài trước đó), coi như đang ở 'vocab' thay vì crash hoặc màn hình trắng.
  const [mobileTab, setMobileTab] = useState<'vocab' | 'grammar' | 'speaking'>('vocab')
  const effectiveMobileTab = mobileTab === 'speaking' && !speaking ? 'vocab' : mobileTab

  return (
    <div className="kr-content">
      <div className="kr-content-header">
        <div>
          <p className="kr-eyebrow">한국어 공부 · 제{lesson}과</p>
          <h1 className="kr-page-title">{LESSON_TITLES[lesson] ?? ''}</h1>
        </div>
        <div className="kr-content-header-actions">
          <Link href={`/korean/study?lesson=${lesson}`} className="kr-btn-outline">
            🎴 Ôn tập
          </Link>
          <Link href={`/korean/quiz?lesson=${lesson}`} className="kr-btn-solid">
            📝 Kiểm tra
          </Link>
        </div>
      </div>

      <div className="kr-mobile-tabs">
        <button
          type="button"
          className={`kr-mobile-tab${effectiveMobileTab === 'vocab' ? ' active' : ''}`}
          onClick={() => setMobileTab('vocab')}
        >
          📚 Từ vựng
        </button>
        <button
          type="button"
          className={`kr-mobile-tab${effectiveMobileTab === 'grammar' ? ' active' : ''}`}
          onClick={() => setMobileTab('grammar')}
        >
          ✏️ Ngữ pháp
        </button>
        {speaking && (
          <button
            type="button"
            className={`kr-mobile-tab${effectiveMobileTab === 'speaking' ? ' active' : ''}`}
            onClick={() => setMobileTab('speaking')}
          >
            🗣️ Luyện nói
          </button>
        )}
      </div>

      <div className="kr-doc-body">
        <div className="kr-doc-content">
          <div className={`kr-mobile-section${effectiveMobileTab === 'vocab' ? ' active' : ''}`}>
            <p className="kr-section-title" id="kr-section-vocab">
              📚 Từ vựng <span className="kr-section-count">({vocabCards.length})</span>
            </p>
            {vocabCards.length === 0 ? (
              <p className="kr-glass py-6 text-center text-sm text-muted">Chưa có từ vựng nào trong bài này.</p>
            ) : (
              <div className="kr-vocab-tile-grid">
                {vocabCards.map((card) => (
                  <VocabTile key={card.id} card={card} progress={progressByCard.get(card.id)} learned={isLearned(card.id)} />
                ))}
              </div>
            )}
          </div>

          <div className={`kr-mobile-section${effectiveMobileTab === 'grammar' ? ' active' : ''}`}>
            {grammarCards.length === 0 ? (
              <p className="kr-glass py-6 text-center text-sm text-muted">Chưa có ngữ pháp nào trong bài này.</p>
            ) : (
              <div className="kr-grammar-list">
                {grammarCards.map((card, i) => (
                  <GrammarCard key={card.id} card={card} index={i + 1} />
                ))}
              </div>
            )}
          </div>

          {speaking && (
            <div className={`kr-mobile-section${effectiveMobileTab === 'speaking' ? ' active' : ''}`}>
              <SpeakingPracticeSection data={speaking} />
            </div>
          )}
        </div>

        {tocItems.length > 1 && (
          <aside className="kr-side-toc" aria-label="Mục lục">
            <span className="kr-side-toc-label">Đang đọc</span>
            {tocItems.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.label}
                className={`kr-side-toc-item${item.id === activeTocId ? ' active' : ''}`}
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                {item.label}
              </button>
            ))}
          </aside>
        )}
      </div>
    </div>
  )
}

// Scrollspy: menu bên phải bám theo vị trí cuộn thực tế của window (trang không có scroll
// container riêng — xem ghi chú .kr-doc-body trong korean.css) để biết đang đọc tới thẻ nào.
function useSectionScrollspy(items: { id: string; label: string }[]): string {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (items.length === 0) return
    const els = items.map((it) => document.getElementById(it.id)).filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    const topOffset = 110
    let ticking = false

    function updateActive() {
      ticking = false
      let current = els[0].id
      for (const el of els) {
        if (el.getBoundingClientRect().top - topOffset <= 0) current = el.id
      }
      setActiveId(current)
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(updateActive)
    }

    updateActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [items])

  return activeId
}

function SpeakingPracticeSection({ data }: { data: SpeakingPracticeSet }) {
  return (
    <>
      <p className="kr-section-title" id="kr-section-speaking">
        🗣️ Luyện nói <span className="kr-section-count">({data.items.length})</span>
      </p>
      <p className="kr-speaking-intro">{data.intro}</p>

      <div className="kr-speaking-list">
        {data.items.map((item, i) => (
          <div key={i} className="kr-glass kr-speaking-card">
            <div className="kr-speaking-card-head">
              <span className="kr-speaking-index">Câu {i + 1}</span>
              <span className="kr-speaking-level">{item.level}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <p className="kr-speaking-q">{item.question}</p>
              <SpeakButton text={item.question} lang={KO_LANG} className="shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand" />
            </div>
            <p className="kr-speaking-q-vi">{item.questionVi}</p>

            <div className="kr-speaking-answer">
              <span className="kr-speaking-answer-label">대답</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="kr-speaking-a">
                    {item.answer} <span className="kr-speaking-grammar-tag">{item.grammar}</span>
                  </p>
                  <SpeakButton text={item.answer} lang={KO_LANG} className="shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand" />
                </div>
                <p className="kr-speaking-a-vi">{item.answerVi}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="kr-glass kr-speaking-summary">
        <p className="kr-speaking-summary-title">📝 Từ vựng/ngữ pháp trọng tâm cần nhớ</p>
        <div className="kr-speaking-summary-grammar">
          {data.grammarSummary.map((g, i) => (
            <p key={i}>
              <span className="kr-speaking-grammar-tag">{g.label}</span> — {g.note}
            </p>
          ))}
        </div>
        <p className="kr-speaking-summary-vocab">
          <strong>Từ vựng đã dùng:</strong> {data.vocabSummary}
        </p>
      </div>
    </>
  )
}

function VocabTile({ card, progress, learned }: { card: KoreanCard; progress: KoreanProgress | undefined; learned: boolean }) {
  return (
    <div className="kr-glass flex items-center justify-between gap-3 p-3 text-left">
      <div className="flex items-center gap-3">
        <span
          className={`relative flex min-h-14 min-w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft px-2 py-1.5 text-center font-bold leading-tight text-brand ${
            card.front.length <= 4 ? 'text-lg' : card.front.length <= 10 ? 'text-sm' : 'text-xs'
          }`}
        >
          {card.front}
          {learned && (
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-white ring-2 ring-card">
              ✓
            </span>
          )}
        </span>
        <div>
          <p className="inline-flex items-center gap-1 rounded-pill bg-card-soft px-2 py-0.5 text-xs text-muted">
            {card.kind === 'grammar' ? '✏️ Ngữ pháp' : '📚 Từ vựng'}
          </p>
          <p className="mt-1 text-sm font-medium">{card.meaning}</p>
        </div>
        <SpeakButton text={card.front} lang={KO_LANG} className="shrink-0 rounded-full p-1.5 text-muted hover:bg-brand-soft hover:text-brand" />
      </div>
      {progress && (progress.correctCount > 0 || progress.wrongCount > 0) && (
        <div className="flex shrink-0 flex-col items-end gap-1 text-xs font-semibold">
          {progress.correctCount > 0 && <span className="rounded-pill bg-gold-soft px-2 py-0.5 text-gold">✓ {progress.correctCount}</span>}
          {progress.wrongCount > 0 && <span className="rounded-pill bg-danger-soft px-2 py-0.5 text-danger">✕ {progress.wrongCount}</span>}
        </div>
      )}
    </div>
  )
}

interface StructureSegment {
  condition: string
  result: string
}

// Ghi chú cấu trúc "chuẩn" là chuỗi các cặp điều kiện:kết quả ngắn, ngăn bởi " · "
// (ví dụ "V받침O: 려고 · V받침X: (으)려고"). Ghi chú của các động từ bất quy tắc (ㄹ/ㅅ/ㅎ)
// là văn xuôi mô tả dài, tình cờ cũng chứa dấu ":" nên phải chặn bằng độ dài điều kiện —
// nếu bất kỳ đoạn nào có phần điều kiện quá dài thì rơi về hiển thị dạng văn bản phẳng.
function parseStructureSegments(note: string): StructureSegment[] | null {
  const parts = note
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean)
  if (parts.length < 2) return null

  const segments: StructureSegment[] = []
  for (const part of parts) {
    const colonIndex = part.indexOf(':')
    if (colonIndex === -1) return null
    const condition = part.slice(0, colonIndex).trim()
    const result = part.slice(colonIndex + 1).trim()
    if (!condition || !result || condition.length > 25) return null
    segments.push({ condition, result })
  }
  return segments
}

type ConditionKind = 'patchim-o' | 'patchim-x' | 'special' | 'base'

// Tô màu phần điều kiện theo loại 받침 để mắt phân biệt nhanh giữa các nhánh:
// có patchim (받침O), không patchim (받침X), hoặc phụ âm đặc biệt của động từ bất quy tắc
// (받침ㄹ/ㅅ/ㅎ...). Trường hợp mơ hồ (받침O/X) hoặc không nhắc tới 받침 thì giữ màu trung tính.
function classifyCondition(condition: string): ConditionKind {
  const idx = condition.indexOf('받침')
  if (idx === -1) return 'base'
  const rest = condition.slice(idx + 2)
  if (/[ㄱ-ㅎ]/.test(rest)) return 'special'
  const hasO = rest.includes('O')
  const hasX = rest.includes('X')
  if (hasO && !hasX) return 'patchim-o'
  if (hasX && !hasO) return 'patchim-x'
  return 'base'
}

function GrammarStructure({ note }: { note: string }) {
  const segments = parseStructureSegments(note)

  if (!segments) {
    return (
      <div className="kr-grammar-structure">
        <span className="kr-grammar-structure-label">Cấu trúc</span>
        <span className="kr-grammar-structure-text">{note}</span>
      </div>
    )
  }

  // Nhãn gốc là phần chung trước "받침" của điều kiện đầu tiên (vd "N받침O"/"N받침X" → "N") —
  // hiển thị như 1 node gốc mà các nhánh điều kiện toả ra, giống sơ đồ cây thật thay vì liệt kê.
  const rootLabel = segments[0].condition.split('받침')[0].trim() || segments[0].condition

  return (
    <div className="kr-structure-diagram">
      <span className="kr-grammar-structure-label">Cấu trúc</span>
      <div className="kr-structure-tree">
        <div className="kr-structure-root">{rootLabel}</div>
        <div className="kr-structure-branches">
          {segments.map((seg, i) => (
            <div key={i} className="kr-structure-branch">
              <span className={`kr-structure-condition kr-structure-condition--${classifyCondition(seg.condition)}`}>{seg.condition}</span>
              <span className="kr-structure-arrow">→</span>
              <span className="kr-structure-result">{seg.result}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GrammarCard({ card, index }: { card: KoreanCard; index: number }) {
  return (
    <div id={`kr-grammar-${card.id}`} className="kr-glass kr-grammar-card">
      <div className="flex items-start gap-3">
        <span className="kr-grammar-index">{index}</span>
        <div>
          <p className="kr-grammar-eyebrow">✏️ NGỮ PHÁP</p>
          <h3 className="kr-grammar-title">{card.front}</h3>
        </div>
      </div>
      <p className="kr-grammar-meaning">{card.meaning}</p>

      {card.note && <GrammarStructure note={card.note} />}

      {card.theory && (
        <div className="kr-grammar-theory">
          {card.theory.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      <GrammarExamples card={card} />
    </div>
  )
}

function GrammarExamples({ card }: { card: KoreanCard }) {
  let details: ExampleDetail[] = []
  try {
    details = card.exampleDetail ? JSON.parse(card.exampleDetail) : []
  } catch {
    details = []
  }

  if (details.length > 0) {
    return (
      <div className="kr-grammar-examples">
        <span className="kr-grammar-examples-label">Ví dụ</span>
        {details.map((d, i) => (
          <div key={i} className="kr-grammar-example">
            <div className="flex items-center gap-1.5">
              <p className="kr-grammar-example-line">{d.ko}</p>
              <SpeakButton text={d.ko} lang={KO_LANG} className="shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand" />
            </div>
            <p className="kr-grammar-example-vi">{d.vi}</p>
            {d.vocab && (
              <p className="kr-grammar-example-note">
                <span className="kr-grammar-example-note-label">Từ vựng</span> {d.vocab}
              </p>
            )}
            {d.breakdown && (
              <p className="kr-grammar-example-note">
                <span className="kr-grammar-example-note-label">Biến đổi</span> {d.breakdown}
              </p>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (!card.example) return null
  return (
    <div className="kr-grammar-examples">
      <span className="kr-grammar-examples-label">Ví dụ</span>
      {card.example.split('\n').map((ex, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <p className="kr-grammar-example-line">{ex}</p>
          <SpeakButton text={ex} lang={KO_LANG} className="shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand" />
        </div>
      ))}
    </div>
  )
}
