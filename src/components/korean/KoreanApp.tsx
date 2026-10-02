'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useParams, useRouter, useSearchParams } from 'next/navigation'
import { useKoreanStore } from '@/lib/korean/store'
import { useKoreanUIStore } from '@/lib/korean/uiStore'
import { LESSON_TITLES, LESSON_TITLES_VI, TOPIK_LABEL, lessonDisplayNumber, lessonLevel, lessonNumbersForLevel, type TopikLevel } from '@/lib/korean/lessons'
import { Sidebar, type Selection, type TopikKey } from '@/components/korean/Sidebar'
import { LearnerProfile } from '@/components/learner/LearnerProfile'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { LevelLanding, type LandingItem } from '@/components/landing/LevelLanding'
import { KnowledgeIndex } from '@/components/landing/KnowledgeIndex'
import { SegmentedControl } from '@/components/korean/SegmentedControl'
import type { ExampleDetail } from '@/lib/korean/exampleDetail'
import { SPEAKING_PRACTICE, type SpeakingPracticeSet } from '@/lib/korean/speakingPractice'
import { TOPIK1_DIALOGUES } from '@/lib/korean/topik1'
import { TOPIK2_DIALOGUES } from '@/lib/korean/topik2-dialogues'
import { DialogueSection } from '@/components/shared/DialogueSection'
import { VocabStudy, groupByTopic, type StudyWord } from '@/components/shared/vocab/VocabStudy'
import { parsePos } from '@/components/shared/vocab/pos'
import { LessonSection } from '@/components/shared/LessonSection'
import { LessonToc, type TocNode } from '@/components/shared/LessonToc'
import { Handbook } from '@/components/korean/Handbook'
import { HangulSection } from '@/components/korean/HangulSection'
import { HANGUL_LESSONS } from '@/lib/korean/hangul'
import { HANDBOOK_CATEGORIES } from '@/lib/korean/handbook'
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
  if (s.type === 'lesson') return `/korean/lessons/${s.lesson}`
  if (s.type === 'hangul') return `/korean/hangul/${s.lesson}`
  return '/korean/vocab'
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
    : pathname.startsWith('/korean/hangul')
      ? { type: 'hangul', lesson: params.lesson ? Number(params.lesson) : 0 }
    : pathname === '/korean/lessons'
      ? { type: 'knowledge' }
      : { type: 'overview' }
  // Chỉ đúng "/korean" (không có gì sau) là màn hình chọn cấp độ — mọi route con khác đều đã "vào trong".
  const showLanding = pathname === '/korean'
  // Cẩm nang ngữ pháp gộp cả TOPIK I + II nên không dùng Sidebar (Sidebar chỉ hiện 1 cấp độ) — full width như màn hình đầu.
  const showHandbook = pathname === '/korean/handbook'
  // Bảng chữ cái (4 bài vỡ lòng 한글 배우기, /korean/hangul/<n>) — có Sidebar riêng liệt kê 4 bài, giống "Ngữ âm cơ bản" bên Chinese.
  const showHangul = selection.type === 'hangul'
  // Trang đứng riêng (không Sidebar, không nút ☰): chỉ còn cẩm nang.
  const standalone = showHandbook
  // ?g=<cardId> — mở bài và cuộn thẳng tới thẻ ngữ pháp đó (link "Mở trong bài" từ Cẩm nang).
  const focusCardId = searchParams.get('g')
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
  // Trang tổng quan (/korean/vocab) chỉ hiện thẻ của cấp độ đang mở (?open=), mặc định TOPIK II như trước.
  const overviewLevel: TopikLevel = initialGroup ?? 'topik2'
  const cardsOfLevel = (level: TopikLevel) => sortedCards.filter((card) => lessonLevel(card.lesson) === level)
  const overviewCards = cardsOfLevel(overviewLevel)
  const learnedCount = overviewCards.filter((c) => isLearned(c.id)).length
  const learnedPercent = overviewCards.length > 0 ? Math.round((learnedCount / overviewCards.length) * 100) : 0

  function pickLevel(key: string) {
    navigate(key === 'handbook' ? '/korean/handbook' : key === 'hangul' ? '/korean/hangul/0' : `/korean/lessons?open=${key}`)
  }

  const grammarCards = sortedCards.filter((card) => card.kind === 'grammar')

  const levelItems: LandingItem[] = (['topik1', 'topik2'] as const).map((key) => {
    const lessons = lessonNumbersForLevel(key)
    const levelCards = cardsOfLevel(key)
    return {
      key,
      icon: key === 'topik1' ? 'I' : 'II',
      label: TOPIK_LABEL[key],
      meta: lessons.length === 0 ? 'Sắp ra mắt' : `${lessons.length} bài · ${levelCards.length} thẻ`,
      muted: lessons.length === 0,
      progress: levelCards.length ? levelCards.filter((card) => isLearned(card.id)).length / levelCards.length : 0,
      ...(key === 'topik1'
        ? { accent: '#0c8599', glyph: '초', desc: 'Sơ cấp · Giáo trình 서울대 한국어 1A + 1B' }
        : { accent: '#1f4fd6', glyph: '중', desc: 'Trung – cao cấp · Giáo trình Seoul Korean 2' }),
    }
  })

  // "Bảng chữ cái" đứng trước TOPIK I — cùng vị trí với card "Ngữ âm cơ bản" bên Chinese Hub.
  const landingItems: LandingItem[] = [
    {
      key: 'hangul',
      icon: '가',
      label: 'Bảng chữ cái',
      meta: `${HANGUL_LESSONS.length} bài · 40 chữ cái`,
      accent: '#e8590c',
      glyph: '한',
      desc: 'Vỡ lòng · Nguyên âm, phụ âm, patchim',
    },
    ...levelItems,
    {
      key: 'handbook',
      icon: '📖',
      label: 'Cẩm nang',
      meta: `${HANDBOOK_CATEGORIES.length} nhóm · ${grammarCards.length} mẫu ngữ pháp`,
      accent: '#7048e8',
      glyph: '법',
      desc: 'Ngữ pháp TOPIK I + II gom theo nghĩa, so sánh các mẫu dễ nhầm',
    },
  ]

  return (
    <div className="kr-shell">
      {!showLanding && !standalone && (
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
          {!showLanding && !standalone && (
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
          {showHandbook && <AppBreadcrumb app="/korean" trail={[{ label: 'Cẩm nang', glyph: '법' }]} />}
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
            placeholder={showHandbook ? '🔍 Tìm mẫu ngữ pháp, nghĩa hoặc nhóm…' : '🔍 Tìm theo Hangul, mẫu ngữ pháp hoặc nghĩa…'}
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
        ) : showHangul ? (
          <HangulSection lesson={selection.lesson} onPick={(n) => navigate(`/korean/hangul/${n}`)} />
        ) : showHandbook ? (
          <Handbook grammarCards={grammarCards} searchQuery={searchQuery} renderDetail={(card) => <GrammarBody card={card} />} />
        ) : selection.type === 'knowledge' ? (
          <KnowledgeIndex
            icon="한"
            title={`Kiến thức ${TOPIK_LABEL[overviewLevel]}`}
            subtitle={`${lessonNumbersForLevel(overviewLevel).length} bài học · chọn một bài để bắt đầu`}
            items={lessonNumbersForLevel(overviewLevel).map((lesson) => {
              const lessonCards = sortedCards.filter((card) => card.lesson === lesson)
              return {
                number: lesson,
                label: lessonDisplayNumber(lesson),
                title: LESSON_TITLES[lesson],
                titleVi: LESSON_TITLES_VI[lesson],
                meta: `${lessonCards.filter((card) => isLearned(card.id)).length}/${lessonCards.length} thuộc`,
              }
            })}
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
          <LessonContent lesson={selection.lesson} cards={sortedCards} isLearned={isLearned} focusCardId={focusCardId} />
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
                  제{lessonDisplayNumber(card.lesson)}과 · {LESSON_TITLES[card.lesson] ?? ''}
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
  isLearned,
  focusCardId,
}: {
  lesson: number
  cards: KoreanCard[]
  isLearned: (id: string) => boolean
  focusCardId: string | null
}) {
  const setLearned = useKoreanStore((s) => s.setLearned)
  const lessonCards = cards.filter((c) => c.lesson === lesson)
  const vocabCards = lessonCards.filter((c) => c.kind === 'vocab')
  const grammarCards = lessonCards.filter((c) => c.kind === 'grammar')
  const speaking = SPEAKING_PRACTICE[lesson]
  // Hội thoại 말하기 của giáo trình (TOPIK I: 서울대 1A/1B, TOPIK II: 2A/2B) — cùng tab "Luyện nói" trên mobile với SPEAKING_PRACTICE.
  const dialogues = TOPIK1_DIALOGUES[lesson] ?? TOPIK2_DIALOGUES[lesson]
  const hasSpeaking = !!speaking || !!dialogues

  const studyWords = useMemo(() => vocabCards.map(toStudyWord), [vocabCards])

  // Mục lục "Đang đọc" bên phải — dạng cây theo dữ liệu thật của bài: Từ vựng → các nhóm chủ đề, Ngữ pháp → từng điểm
  // ngữ pháp, Hội thoại → từng hội thoại, Luyện nói → từng câu (xem components/shared/LessonToc.tsx).
  const tocNodes = useMemo(() => {
    const nodes: TocNode[] = []
    if (vocabCards.length > 0) {
      const groups = groupByTopic(studyWords)
      nodes.push({
        id: 'kr-section-vocab',
        label: '📚 Từ vựng',
        section: 'vocab',
        children: groups.flatMap((g, i) => (g.title ? [{ id: `kr-vocab-topic-${i}`, label: g.title }] : [])),
      })
    }
    if (grammarCards.length > 0) {
      nodes.push({ id: 'kr-section-grammar', label: '✏️ Ngữ pháp', section: 'grammar', children: grammarCards.map((c) => ({ id: `kr-grammar-${c.id}`, label: c.front })) })
    }
    if (dialogues) {
      nodes.push({
        id: 'kr-section-dialogue',
        label: '💬 Hội thoại',
        section: 'dialogue',
        children: dialogues.map((d, i) => ({ id: `kr-dialogue-${i}`, label: d.title || `Hội thoại ${i + 1}` })),
      })
    }
    if (speaking) {
      nodes.push({
        id: 'kr-section-speaking',
        label: '🗣️ Luyện nói',
        section: 'speaking',
        children: speaking.items.map((it, i) => ({ id: `kr-speaking-${i}`, label: `${i + 1}. ${it.question}` })),
      })
    }
    return nodes
  }, [vocabCards.length, studyWords, grammarCards, dialogues, speaking])

  // Trên mobile không đủ chỗ để cuộn + mục lục bên phải như desktop, nên thay bằng tab bấm-để-xem
  // (CSS chỉ hiện .kr-mobile-tabs và áp dụng .kr-mobile-section ở @media ≤860px — desktop vẫn giữ
  // nguyên bố cục cuộn dọc như cũ, xem korean.css). Nếu bài không có Luyện nói mà tab đang chọn lại
  // là 'speaking' (dư từ bài trước đó), coi như đang ở 'vocab' thay vì crash hoặc màn hình trắng.
  // Vào từ Cẩm nang (?g=<cardId>) thì mở sẵn tab Ngữ pháp trên mobile để thẻ đích hiện ra.
  const [mobileTab, setMobileTab] = useState<'vocab' | 'grammar' | 'speaking'>(focusCardId ? 'grammar' : 'vocab')
  const effectiveMobileTab = mobileTab === 'speaking' && !hasSpeaking ? 'vocab' : mobileTab

  // Cuộn tới thẻ ?g= sau khi thẻ đã render (thẻ lấy từ store nên có thể chưa có ở lần render đầu) — chỉ 1 lần.
  const focusedOnce = useRef(false)
  const focusTargetReady = !!focusCardId && grammarCards.some((c) => c.id === focusCardId)
  useEffect(() => {
    if (!focusTargetReady || focusedOnce.current) return
    focusedOnce.current = true
    requestAnimationFrame(() => document.getElementById(`kr-grammar-${focusCardId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [focusTargetReady, focusCardId])

  return (
    <div className="kr-content">
      <div className="kr-content-header">
        <div>
          <p className="kr-eyebrow">한국어 공부 · {TOPIK_LABEL[lessonLevel(lesson) ?? 'topik2']} · 제{lessonDisplayNumber(lesson)}과</p>
          <h1 className="kr-page-title">{LESSON_TITLES[lesson] ?? ''}</h1>
          {LESSON_TITLES_VI[lesson] && <p className="kr-page-title-vi">{LESSON_TITLES_VI[lesson]}</p>}
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
        {hasSpeaking && (
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
            <LessonSection sectionKey="vocab" prefix="kr" title="📚 Từ vựng" count={vocabCards.length}>
              <VocabStudy words={studyWords} lang={KO_LANG} isLearned={isLearned} onToggleLearned={setLearned} groupIdPrefix="kr-vocab-topic-" />
            </LessonSection>
          </div>

          <div className={`kr-mobile-section${effectiveMobileTab === 'grammar' ? ' active' : ''}`}>
            {grammarCards.length === 0 ? (
              <p className="kr-glass py-6 text-center text-sm text-muted">Chưa có ngữ pháp nào trong bài này.</p>
            ) : (
              <LessonSection sectionKey="grammar" prefix="kr" title="✏️ Ngữ pháp" count={grammarCards.length}>
                <div className="kr-grammar-list">
                  {grammarCards.map((card, i) => (
                    <GrammarCard key={card.id} card={card} index={i + 1} />
                  ))}
                </div>
              </LessonSection>
            )}
          </div>

          {hasSpeaking && (
            <div className={`kr-mobile-section${effectiveMobileTab === 'speaking' ? ' active' : ''}`}>
              {dialogues && <DialogueSection dialogues={dialogues} lang="ko-KR" prefix="kr" title="💬 Hội thoại" showVi />}
              {speaking && <SpeakingPracticeSection data={speaking} />}
            </div>
          )}
        </div>

        <LessonToc nodes={tocNodes} prefix="kr" />
      </div>
    </div>
  )
}

function SpeakingPracticeSection({ data }: { data: SpeakingPracticeSet }) {
  return (
    <LessonSection sectionKey="speaking" prefix="kr" title="🗣️ Luyện nói" count={data.items.length}>
      <p className="kr-speaking-intro">{data.intro}</p>

      <div className="kr-speaking-list">
        {data.items.map((item, i) => (
          <div key={i} id={`kr-speaking-${i}`} className="kr-glass kr-speaking-card">
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
    </LessonSection>
  )
}

// Thẻ từ vựng → dạng của danh sách học dùng chung. Câu ví dụ nằm ở example, bản dịch ở exampleDetail[0].vi.
function toStudyWord(card: KoreanCard): StudyWord {
  let detail: ExampleDetail | undefined
  try {
    detail = (JSON.parse(card.exampleDetail || '[]') as ExampleDetail[])[0]
  } catch {}
  return {
    id: card.id,
    word: card.front,
    pos: parsePos(card.pos),
    topic: card.topic || undefined,
    meaning: card.meaning,
    en: card.note || undefined,
    example: card.example.split('\n')[0] || detail?.ko || undefined,
    exampleVi: detail?.vi || undefined,
    image: card.image || undefined,
  }
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

interface ParsedStructure {
  branches: StructureSegment[] // quy tắc chia "điều kiện → kết quả", vẽ thành nhánh cây
  notes: string[] // phần còn lại (lưu ý cách dùng, danh sách ví dụ bất quy tắc…), hiện dạng gạch đầu dòng
}

// Ghi chú cấu trúc là các đoạn ngăn bởi " · ". Hai kiểu viết cùng tồn tại trong dữ liệu:
//   - TOPIK II: "V받침O: 으니까 · V받침X: 니까"                 (điều kiện: kết quả)
//   - TOPIK I:  "ㅏ, ㅗ + 아서 · 하다 → 해서 · Vế sau không…"    (điều kiện + kết quả / A → B, lẫn câu lưu ý)
// Mỗi đoạn được xét riêng: tách được thành quy tắc ngắn thì thành nhánh, không thì thành 1 dòng lưu ý — trước đây
// chỉ cần 1 đoạn không đúng kiểu TOPIK II là cả khối rơi về chữ phẳng.
function parseStructure(note: string): ParsedStructure {
  const branches: StructureSegment[] = []
  const notes: string[] = []
  for (const part of note.split('·').map((s) => s.trim()).filter(Boolean)) {
    // Đoạn chỉ gồm các cặp ví dụ biến âm "덥다 → 더워요, 춥다 → 추워요" → mỗi cặp 1 nhánh.
    if (/^[^,→:]+→[^,→:]+(,\s*[^,→:]+→[^,→:]+)+$/.test(part)) {
      for (const pair of part.split(',')) {
        const [condition, result] = pair.split('→').map((s) => s.trim())
        branches.push({ condition, result })
      }
      continue
    }
    const rule = splitRule(part)
    if (rule) branches.push(rule)
    else notes.push(part)
  }
  return { branches, notes }
}

// Mũi tên trong ngoặc là ví dụ đi kèm ("ㄹ라 (vd: 자르다 → 잘라요)"), không tính là quy tắc thứ hai.
const countArrows = (s: string) => (s.replace(/\([^()]*\)/g, '').match(/→/g) ?? []).length
const hasOpenParen = (s: string) => (s.match(/\(/g) ?? []).length > (s.match(/\)/g) ?? []).length

// Chặn theo độ dài phần điều kiện vì câu lưu ý dài đôi khi cũng chứa ":" / "+" / "→"; kết quả có nhiều "→" là
// danh sách ví dụ (덥다 → 더워요, 춥다 → 추워요…) nên để nguyên thành lưu ý.
function splitRule(part: string): StructureSegment | null {
  const colon = part.indexOf(':')
  const colonCondition = colon === -1 ? '' : part.slice(0, colon).trim()
  // Dấu ":" nằm trong ngoặc ví dụ hoặc sau mũi tên thì không phải "điều kiện: kết quả" — xét tiếp → / +.
  if (colon !== -1 && !colonCondition.includes('→') && !hasOpenParen(colonCondition)) {
    const result = part.slice(colon + 1).trim()
    if (!colonCondition || !result || colonCondition.length > 40 || countArrows(result) > 1) return null
    return { condition: colonCondition, result }
  }
  for (const op of ['→', ' + ']) {
    const i = part.indexOf(op)
    if (i === -1) continue
    const condition = part.slice(0, i).trim()
    const result = part.slice(i + op.length).trim()
    if (!condition || !result || condition.length > 32 || countArrows(result) > 0) return null
    return { condition, result }
  }
  return null
}

type ConditionKind = 'patchim-o' | 'patchim-x' | 'special' | 'base'

// Tô màu phần điều kiện để mắt phân biệt nhanh các nhánh: xanh lá = có patchim / nguyên âm ㅏ,ㅗ (nhánh "아"),
// cam = không patchim / nguyên âm còn lại (nhánh "어"), tím = patchim ㄹ, 하다 hoặc phụ âm bất quy tắc.
// Không rõ loại (받침O/X, "Hỏi", "Danh từ"…) thì giữ màu trung tính.
function classifyCondition(condition: string): ConditionKind {
  const idx = condition.indexOf('받침')
  if (idx !== -1) {
    const rest = condition.slice(idx + 2)
    if (/[ㄱ-ㅎ]/.test(rest)) return 'special'
    const hasO = rest.includes('O')
    const hasX = rest.includes('X')
    if (hasO && !hasX) return 'patchim-o'
    if (hasX && !hasO) return 'patchim-x'
    return 'base'
  }
  const lower = condition.toLowerCase()
  if (/không\s+patchim/.test(lower)) return 'patchim-x'
  if (/patchim\s*ㄹ|bất quy tắc|ngoại lệ/.test(lower)) return 'special'
  if (/có\s+patchim/.test(lower)) return 'patchim-o'
  if (/하다/.test(condition)) return 'special'
  if (/ㅓ|ㅡ|ㅣ|ㅜ|^khác$|nguyên âm khác/.test(lower)) return 'patchim-x'
  if (/ㅏ|ㅗ/.test(condition)) return 'patchim-o'
  return 'base'
}

// Kết quả là chữ Hàn (으니까, 해서…) thì hiện to, đậm; kết quả là câu giải thích tiếng Việt thì chữ thường, cho xuống dòng.
const isTextResult = (result: string) => /[A-Za-zÀ-ỹĐđ]{3,}/.test(result)

// Nút gốc của cây: phần trước "받침" ở điều kiện đầu (V/A받침O → V/A), hoặc loại từ ở đầu mẫu ngữ pháp (A/V-아서 → A/V).
function structureRoot(branches: StructureSegment[], front: string): string | null {
  const first = branches[0]?.condition ?? ''
  if (first.includes('받침')) return first.split('받침')[0].trim() || null
  if (/^(A\/V|V\/A|V|A|N)$/.test(first)) return first
  return front.match(/^(A\/V|V\/A|V|A|N)\b/)?.[1] ?? null
}

function GrammarStructure({ note, front }: { note: string; front: string }) {
  const { branches, notes } = parseStructure(note)
  const root = structureRoot(branches, front)

  return (
    <div className="kr-structure-diagram">
      <span className="kr-grammar-structure-label">Cấu trúc</span>
      {branches.length > 0 && (
        <div className="kr-structure-tree">
          {root && <div className="kr-structure-root">{root}</div>}
          <div className={`kr-structure-branches${root ? '' : ' kr-structure-branches--rootless'}`}>
            {branches.map((seg, i) => {
              const text = isTextResult(seg.result)
              return (
                <div key={i} className={`kr-structure-branch${text ? ' kr-structure-branch--text' : ''}`}>
                  <span className={`kr-structure-condition kr-structure-condition--${classifyCondition(seg.condition)}`}>{seg.condition}</span>
                  <span className="kr-structure-arrow">→</span>
                  <span className={`kr-structure-result${text ? ' kr-structure-result--text' : ''}`}>{seg.result}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {notes.length > 0 && (
        <ul className={`kr-structure-notes${branches.length > 0 ? '' : ' kr-structure-notes--only'}`}>
          {notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
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

      <GrammarBody card={card} />
    </div>
  )
}

// Phần thân thẻ ngữ pháp (cấu trúc + lý thuyết + ví dụ) — dùng chung cho thẻ trong bài và dòng mở rộng ở Cẩm nang.
function GrammarBody({ card }: { card: KoreanCard }) {
  return (
    <>
      {card.note && <GrammarStructure note={card.note} front={card.front} />}

      {card.theory && (
        <div className="kr-grammar-theory">
          {card.theory.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      <GrammarExamples card={card} />
    </>
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
