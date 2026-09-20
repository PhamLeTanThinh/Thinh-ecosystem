'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useChineseStore } from '@/lib/chinese/store'
import { useChineseUIStore } from '@/lib/chinese/uiStore'
import { HSK_LEVELS, LESSON_TITLES, levelLabel, lessonNumbersForLevel, type HskLevel } from '@/lib/chinese/lessons'
import { Sidebar, type Selection } from '@/components/chinese/Sidebar'
import { LearnerProfile } from '@/components/learner/LearnerProfile'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { LevelLanding, type LandingItem } from '@/components/landing/LevelLanding'
import { isMobileNav, withViewTransition } from '@/lib/viewTransition'
import { SegmentedControl } from '@/components/chinese/SegmentedControl'
import type { ExampleDetail } from '@/lib/chinese/exampleDetail'
import { SPEAKING_PRACTICE, type SpeakingPracticeSet } from '@/lib/chinese/speakingPractice'
import { DIALOGUES } from '@/lib/chinese/dialogues'
import { DialogueSection } from '@/components/chinese/DialogueSection'
import { PhoneticsSection } from '@/components/chinese/PhoneticsSection'
import { PHONETICS_LESSONS } from '@/lib/chinese/phonetics'
import { SpeakButton } from '@/components/shared/SpeakButton'
import type { ChineseCard, ChineseCardKind, ChineseDeck, ChineseProgress, PinyinPosition, QuizMode } from '@/lib/chinese/types'

const ZH_LANG = 'zh-CN'

const PAGE_SIZE = 30

const PINYIN_POSITION_OPTIONS: { value: PinyinPosition; label: string }[] = [
  { value: 'hanzi', label: 'Cùng mặt Hán tự' },
  { value: 'vietnamese', label: 'Cùng mặt tiếng Việt' },
]

const SHUFFLE_OPTIONS: { value: 'on' | 'off'; label: string }[] = [
  { value: 'on', label: '🔀 Ngẫu nhiên' },
  { value: 'off', label: 'Theo danh sách' },
]

const QUIZ_MODE_OPTIONS: { value: QuizMode; label: string }[] = [
  { value: 'hanzi-to-pinyin', label: 'Hán tự → Phát âm' },
  { value: 'hanzi-to-meaning', label: 'Hán tự → Nghĩa' },
  { value: 'meaning-to-hanzi', label: 'Nghĩa → Hán tự' },
]

const KIND_OPTIONS: { value: 'all' | ChineseCardKind; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'vocab', label: '📚 Từ vựng' },
  { value: 'grammar', label: '✏️ Ngữ pháp' },
]

type StatusFilter = 'all' | 'learned' | 'unlearned'

export default function ChinesePage() {
  const cards = useChineseStore((s) => s.cards)
  const progress = useChineseStore((s) => s.progress)
  const settings = useChineseStore((s) => s.settings)
  const decks = useChineseStore((s) => s.decks)
  const updateSettings = useChineseStore((s) => s.updateSettings)
  const addDeck = useChineseStore((s) => s.addDeck)
  const deleteDeck = useChineseStore((s) => s.deleteDeck)
  const openAddCard = useChineseUIStore((s) => s.openAddCard)

  const [selection, setSelection] = useState<Selection>({ type: 'overview' })
  const [kindFilter, setKindFilter] = useState<'all' | ChineseCardKind>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  // Màn hình đầu: các cấp độ HSK dạng card ở giữa (chưa có sidebar). Chọn 1 card (hoặc gõ vào ô tìm kiếm) thì vào
  // bố cục đầy đủ; cấp độ vừa chọn được mở sẵn trong sidebar. Giống màn hình 4 kỹ năng của IELTS.
  const [entered, setEntered] = useState(false)
  const [initialGroup, setInitialGroup] = useState<HskLevel | 'phonetics' | null>(null)
  const showLanding = !entered
  const [selecting, setSelecting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Quay lại trang đầu mỗi khi đổi bộ lọc/lựa chọn/từ khoá tìm kiếm — cập nhật state trong lúc
  // render (không phải effect) để tránh 1 nhịp render thừa, cùng convention với app/(apps)/korean/page.tsx.
  const filterKey = `${selection.type === 'lesson' ? selection.lesson : selection.type === 'deck' ? selection.deckId : 'overview'}|${kindFilter}|${statusFilter}|${searchQuery}`
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey)
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey)
    setVisibleCount(PAGE_SIZE)
  }

  const progressByCard = new Map(progress.map((p) => [p.id, p]))
  const isLearned = (cardId: string) => progressByCard.get(cardId)?.lastResult === 'correct'

  const sortedCards = [...cards].sort((a, b) => a.lesson - b.lesson || a.sortOrder - b.sortOrder)
  const learnedCount = sortedCards.filter((c) => isLearned(c.id)).length
  const learnedPercent = sortedCards.length > 0 ? Math.round((learnedCount / sortedCards.length) * 100) : 0

  function toggleSelecting() {
    setSelecting((s) => !s)
    setSelectedIds(new Set())
  }

  function toggleSelected(cardId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(cardId)) next.delete(cardId)
      else next.add(cardId)
      return next
    })
  }

  function handleCreateDeck() {
    const name = window.prompt('Tên bộ từ:')
    if (!name || !name.trim()) return
    addDeck(name.trim(), Array.from(selectedIds))
    setSelecting(false)
    setSelectedIds(new Set())
  }

  function pickLevel(key: string) {
    // Trên mobile sidebar là drawer nằm ngoài màn hình nên không có chỗ để card bay tới: bỏ hiệu ứng, thay vào đó
    // mở luôn drawer để thấy các bài của cấp độ vừa chọn.
    const mobile = isMobileNav()
    withViewTransition(
      () => {
        setEntered(true)
        setInitialGroup(key as HskLevel | 'phonetics')
      },
      { skip: mobile },
    )
    if (mobile) setMobileNavOpen(true)
  }

  // "Ngữ âm cơ bản" đứng trước mọi cấp độ HSK — cùng vị trí với mục riêng của nó ở đầu Sidebar (xem
  // components/chinese/Sidebar.tsx). Bấm vào chỉ mở sẵn nhóm này trong sidebar (giống hệt cách các
  // card HSK hoạt động — không tự nhảy thẳng vào Bài 1), người dùng tự chọn bài cụ thể muốn xem.
  const landingItems: LandingItem[] = [
    {
      key: 'phonetics',
      icon: '🔤',
      label: 'Ngữ âm cơ bản',
      meta: `${PHONETICS_LESSONS.length} bài`,
    },
    ...HSK_LEVELS.map(({ key, label }) => {
      const lessons = lessonNumbersForLevel(key)
      const cardCount = sortedCards.filter((c) => lessons.includes(c.lesson)).length
      return {
        key,
        icon: label.replace('HSK ', ''),
        label,
        meta: lessons.length === 0 ? 'Sắp ra mắt' : lessons.length + ' bài · ' + cardCount + ' thẻ',
        muted: lessons.length === 0,
      }
    }),
  ]

  function handleDeleteDeck(deckId: string, deckName: string) {
    if (!window.confirm(`Xoá bộ từ "${deckName}"? Các thẻ trong bộ không bị xoá.`)) return
    deleteDeck(deckId)
    if (selection.type === 'deck' && selection.deckId === deckId) setSelection({ type: 'overview' })
  }

  return (
    <div className="cn-shell">
      {!showLanding && (
        <Sidebar
          cards={sortedCards}
          decks={decks}
          isLearned={isLearned}
          selection={selection}
          onSelect={setSelection}
          onDeleteDeck={handleDeleteDeck}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
          initialGroup={initialGroup}
        />
      )}

      <div className="cn-main">
        <header className="cn-topbar">
          {!showLanding && (
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Mở danh sách bài học"
              className="cn-mobile-menu-btn"
            >
              ☰
            </button>
          )}
          {/* Khi đã vào trong (sidebar hiện), breadcrumb chuyển sang nằm ở đầu sidebar (Sidebar.tsx) thay
              cho tiêu đề tĩnh cũ — ở đây chỉ còn cần lúc màn hình chọn cấp độ chưa có sidebar. */}
          {showLanding && <AppBreadcrumb app="/chinese" />}
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              // Gõ tìm kiếm ở màn hình đầu thì vào thẳng danh sách kết quả (không animation — ô nhập đang có focus).
              if (showLanding && e.target.value.trim()) setEntered(true)
            }}
            placeholder="🔍 Tìm theo Hán tự, pinyin hoặc nghĩa…"
            className="cn-search"
          />
          <button type="button" onClick={() => openAddCard()} className="cn-btn-outline">
            ＋ Thêm thẻ
          </button>
          <LearnerProfile />
        </header>

        {showLanding ? (
          <div className="cn-content">
            <LevelLanding
              eyebrow="学中文"
              title="Chinese Hub"
              subtitle="Chọn cấp độ HSK để bắt đầu"
              items={landingItems}
              transitionPrefix="cn"
              onPick={pickLevel}
            />
          </div>
        ) : selection.type === 'overview' ? (
          <OverviewContent
            sortedCards={sortedCards}
            progressByCard={progressByCard}
            isLearned={isLearned}
            learnedCount={learnedCount}
            learnedPercent={learnedPercent}
            settings={settings}
            updateSettings={updateSettings}
            kindFilter={kindFilter}
            setKindFilter={setKindFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            visibleCount={visibleCount}
            setVisibleCount={setVisibleCount}
            selecting={selecting}
            toggleSelecting={toggleSelecting}
            selectedIds={selectedIds}
            toggleSelected={toggleSelected}
            onCreateDeck={handleCreateDeck}
          />
        ) : selection.type === 'lesson' ? (
          <LessonContent
            lesson={selection.lesson}
            cards={sortedCards}
            progressByCard={progressByCard}
            isLearned={isLearned}
          />
        ) : selection.type === 'phonetics' ? (
          <PhoneticsSection lesson={selection.lesson} />
        ) : (
          <DeckContent
            deck={decks.find((d) => d.id === selection.deckId) ?? null}
            cards={sortedCards}
            progressByCard={progressByCard}
            isLearned={isLearned}
            onDeleteDeck={handleDeleteDeck}
          />
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
  kindFilter,
  setKindFilter,
  statusFilter,
  setStatusFilter,
  searchQuery,
  visibleCount,
  setVisibleCount,
  selecting,
  toggleSelecting,
  selectedIds,
  toggleSelected,
  onCreateDeck,
}: {
  sortedCards: ChineseCard[]
  progressByCard: Map<string, ChineseProgress>
  isLearned: (id: string) => boolean
  learnedCount: number
  learnedPercent: number
  settings: { pinyinPosition: PinyinPosition; shuffle: boolean; quizMode: QuizMode }
  updateSettings: (patch: Partial<{ pinyinPosition: PinyinPosition; shuffle: boolean; quizMode: QuizMode }>) => void
  kindFilter: 'all' | ChineseCardKind
  setKindFilter: (v: 'all' | ChineseCardKind) => void
  statusFilter: StatusFilter
  setStatusFilter: (v: StatusFilter) => void
  searchQuery: string
  visibleCount: number
  setVisibleCount: (fn: (c: number) => number) => void
  selecting: boolean
  toggleSelecting: () => void
  selectedIds: Set<string>
  toggleSelected: (id: string) => void
  onCreateDeck: () => void
}) {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  const visibleCards = sortedCards.filter((c) => {
    if (kindFilter !== 'all' && c.kind !== kindFilter) return false
    if (statusFilter === 'learned' && !isLearned(c.id)) return false
    if (statusFilter === 'unlearned' && isLearned(c.id)) return false
    if (!normalizedQuery) return true
    return (
      c.hanzi.toLowerCase().includes(normalizedQuery) ||
      c.pinyin.toLowerCase().includes(normalizedQuery) ||
      c.meaning.toLowerCase().includes(normalizedQuery)
    )
  })

  const pagedCards = visibleCards.slice(0, visibleCount)
  const hasMore = visibleCount < visibleCards.length

  return (
    <div className="cn-content">
      <div className="cn-content-header">
        <div>
          <p className="cn-eyebrow">学中文</p>
          <h1 className="cn-page-title">Tất cả từ vựng</h1>
        </div>
        <div className="cn-content-header-actions">
          <button type="button" onClick={toggleSelecting} className="cn-btn-outline">
            {selecting ? 'Huỷ chọn' : '☑ Chọn từ'}
          </button>
          <Link href="/chinese/study" className="cn-btn-outline">
            🎴 Ôn tập
          </Link>
          <Link href="/chinese/quiz" className="cn-btn-solid">
            📝 Tạo quiz
          </Link>
        </div>
      </div>

      <div className="cn-stats-row">
        <div className="cn-glass cn-stat-tile">
          <p className="cn-stat-value">{sortedCards.length}</p>
          <p className="cn-stat-label">Tổng số thẻ</p>
        </div>
        <div className="cn-glass cn-stat-tile">
          <p className="cn-stat-value cn-stat-value-accent">{learnedCount}</p>
          <p className="cn-stat-label">Đã thuộc</p>
        </div>
        <div className="cn-glass cn-stat-tile">
          <p className="cn-stat-value">{learnedPercent}%</p>
          <p className="cn-stat-label">Hoàn thành</p>
        </div>
      </div>

      <div className="cn-glass cn-filter-panel">
        <div>
          <p className="cn-filter-label">HIỆN PINYIN</p>
          <SegmentedControl
            options={PINYIN_POSITION_OPTIONS}
            value={settings.pinyinPosition}
            onChange={(value) => updateSettings({ pinyinPosition: value })}
          />
        </div>
        <div>
          <p className="cn-filter-label">THỨ TỰ ÔN TẬP</p>
          <SegmentedControl options={SHUFFLE_OPTIONS} value={settings.shuffle ? 'on' : 'off'} onChange={(value) => updateSettings({ shuffle: value === 'on' })} />
        </div>
        <div>
          <p className="cn-filter-label">CHẾ ĐỘ TRẮC NGHIỆM</p>
          <SegmentedControl dense options={QUIZ_MODE_OPTIONS} value={settings.quizMode} onChange={(value) => updateSettings({ quizMode: value })} />
        </div>
        <div>
          <p className="cn-filter-label">LOẠI THẺ</p>
          <SegmentedControl dense options={KIND_OPTIONS} value={kindFilter} onChange={setKindFilter} />
        </div>
        <div>
          <p className="cn-filter-label">TRẠNG THÁI</p>
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

      <div className="cn-card-list-header">
        <p className="cn-section-label">DANH SÁCH THẺ</p>
        <p className="cn-section-meta">
          {visibleCards.length} thẻ
          {normalizedQuery || statusFilter !== 'all' || kindFilter !== 'all' ? ` (đã lọc / ${sortedCards.length} tổng)` : ''}
        </p>
      </div>

      {visibleCards.length === 0 && (
        <p className="cn-glass py-10 text-center text-sm text-muted">
          {sortedCards.length === 0 ? 'Chưa có thẻ nào. Nhấn "Thêm thẻ" để bắt đầu.' : 'Không có thẻ nào khớp.'}
        </p>
      )}

      <div className="cn-card-grid">
        {pagedCards.map((card, i) => {
          const showLessonHeader = i === 0 || pagedCards[i - 1].lesson !== card.lesson
          return (
            <div key={card.id} className="contents">
              {showLessonHeader && (
                <p className="cn-lesson-group-header">{LESSON_TITLES[card.lesson] ?? ''}</p>
              )}
              <VocabTile
                card={card}
                progress={progressByCard.get(card.id)}
                learned={isLearned(card.id)}
                selecting={selecting}
                selected={selectedIds.has(card.id)}
                onClick={selecting ? () => toggleSelected(card.id) : undefined}
              />
            </div>
          )
        })}
      </div>

      {hasMore && (
        <button type="button" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="cn-glass mt-2 w-full py-3 text-sm font-semibold text-muted">
          Xem thêm {Math.min(PAGE_SIZE, visibleCards.length - visibleCount)} thẻ ↓
        </button>
      )}

      {selecting && selectedIds.size > 0 && (
        <div className="cn-select-bar">
          <p className="text-sm font-medium">Đã chọn {selectedIds.size} thẻ</p>
          <button type="button" onClick={onCreateDeck} className="cn-btn-solid">
            Tạo bộ từ
          </button>
        </div>
      )}
    </div>
  )
}

function DeckContent({
  deck,
  cards,
  progressByCard,
  isLearned,
  onDeleteDeck,
}: {
  deck: ChineseDeck | null
  cards: ChineseCard[]
  progressByCard: Map<string, ChineseProgress>
  isLearned: (id: string) => boolean
  onDeleteDeck: (deckId: string, deckName: string) => void
}) {
  if (!deck) {
    return (
      <div className="cn-content">
        <p className="cn-glass py-10 text-center text-sm text-muted">Bộ từ này không còn tồn tại.</p>
      </div>
    )
  }

  const deckCardIds = new Set(deck.cardIds)
  const deckCards = cards.filter((c) => deckCardIds.has(c.id))

  return (
    <div className="cn-content">
      <div className="cn-content-header">
        <div>
          <p className="cn-eyebrow">学中文 · Bộ từ</p>
          <h1 className="cn-page-title">{deck.name}</h1>
        </div>
        <div className="cn-content-header-actions">
          <Link href={`/chinese/study?deck=${deck.id}`} className="cn-btn-outline">
            🎴 Ôn tập
          </Link>
          <Link href={`/chinese/quiz?deck=${deck.id}`} className="cn-btn-solid">
            📝 Kiểm tra
          </Link>
          <button type="button" onClick={() => onDeleteDeck(deck.id, deck.name)} className="cn-btn-outline">
            ✕ Xoá bộ
          </button>
        </div>
      </div>

      {deckCards.length === 0 ? (
        <p className="cn-glass py-10 text-center text-sm text-muted">Bộ từ này chưa có thẻ nào.</p>
      ) : (
        <div className="cn-vocab-tile-grid">
          {deckCards.map((card) => (
            <VocabTile key={card.id} card={card} progress={progressByCard.get(card.id)} learned={isLearned(card.id)} />
          ))}
        </div>
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
  cards: ChineseCard[]
  progressByCard: Map<string, ChineseProgress>
  isLearned: (id: string) => boolean
}) {
  const lessonCards = cards.filter((c) => c.lesson === lesson)
  const vocabCards = lessonCards.filter((c) => c.kind === 'vocab')
  const grammarCards = lessonCards.filter((c) => c.kind === 'grammar')
  const speaking = SPEAKING_PRACTICE[lesson]
  const dialogues = DIALOGUES[lesson]
  const hasSpeaking = !!speaking || !!dialogues

  // Mục lục "Đang đọc" bên phải — mỗi mục là 1 điểm ngữ pháp cụ thể, cùng convention với
  // app/(apps)/korean/page.tsx.
  const tocItems = useMemo(() => {
    const items: { id: string; label: string }[] = []
    if (vocabCards.length > 0) items.push({ id: 'cn-section-vocab', label: '📚 Từ vựng' })
    grammarCards.forEach((c) => items.push({ id: `cn-grammar-${c.id}`, label: c.hanzi }))
    if (dialogues) items.push({ id: 'cn-section-dialogue', label: '🗣️ Nói như người bản xứ' })
    if (speaking) items.push({ id: 'cn-section-speaking', label: '🗣️ Luyện nói' })
    return items
  }, [vocabCards.length, grammarCards, dialogues, speaking])

  const activeTocId = useSectionScrollspy(tocItems)

  const [mobileTab, setMobileTab] = useState<'vocab' | 'grammar' | 'speaking'>('vocab')
  const effectiveMobileTab = mobileTab === 'speaking' && !hasSpeaking ? 'vocab' : mobileTab

  return (
    <div className="cn-content">
      <div className="cn-content-header">
        <div>
          <p className="cn-eyebrow">{lesson === 0 ? '学中文' : `学中文 · ${levelLabel(lesson)}`}</p>
          <h1 className="cn-page-title">{LESSON_TITLES[lesson] ?? ''}</h1>
        </div>
        <div className="cn-content-header-actions">
          <Link href={`/chinese/study?lesson=${lesson}`} className="cn-btn-outline">
            🎴 Ôn tập
          </Link>
          <Link href={`/chinese/quiz?lesson=${lesson}`} className="cn-btn-solid">
            📝 Kiểm tra
          </Link>
        </div>
      </div>

      <div className="cn-mobile-tabs">
        <button
          type="button"
          className={`cn-mobile-tab${effectiveMobileTab === 'vocab' ? ' active' : ''}`}
          onClick={() => setMobileTab('vocab')}
        >
          📚 Từ vựng
        </button>
        <button
          type="button"
          className={`cn-mobile-tab${effectiveMobileTab === 'grammar' ? ' active' : ''}`}
          onClick={() => setMobileTab('grammar')}
        >
          ✏️ Ngữ pháp
        </button>
        {hasSpeaking && (
          <button
            type="button"
            className={`cn-mobile-tab${effectiveMobileTab === 'speaking' ? ' active' : ''}`}
            onClick={() => setMobileTab('speaking')}
          >
            🗣️ Luyện nói
          </button>
        )}
      </div>

      <div className="cn-doc-body">
        <div className="cn-doc-content">
          <div className={`cn-mobile-section${effectiveMobileTab === 'vocab' ? ' active' : ''}`}>
            <p className="cn-section-title" id="cn-section-vocab">
              📚 Từ vựng <span className="cn-section-count">({vocabCards.length})</span>
            </p>
            {vocabCards.length === 0 ? (
              <p className="cn-glass py-6 text-center text-sm text-muted">Chưa có từ vựng nào trong bài này.</p>
            ) : (
              <div className="cn-vocab-tile-grid">
                {vocabCards.map((card) => (
                  <VocabTile key={card.id} card={card} progress={progressByCard.get(card.id)} learned={isLearned(card.id)} />
                ))}
              </div>
            )}
          </div>

          <div className={`cn-mobile-section${effectiveMobileTab === 'grammar' ? ' active' : ''}`}>
            {grammarCards.length === 0 ? (
              <p className="cn-glass py-6 text-center text-sm text-muted">Chưa có ngữ pháp nào trong bài này.</p>
            ) : (
              <div className="cn-grammar-list">
                {grammarCards.map((card, i) => (
                  <GrammarCard key={card.id} card={card} index={i + 1} />
                ))}
              </div>
            )}
          </div>

          {hasSpeaking && (
            <div className={`cn-mobile-section${effectiveMobileTab === 'speaking' ? ' active' : ''}`}>
              {dialogues && <DialogueSection dialogues={dialogues} />}
              {speaking && <SpeakingPracticeSection data={speaking} />}
            </div>
          )}
        </div>

        {tocItems.length > 1 && (
          <aside className="cn-side-toc" aria-label="Mục lục">
            <span className="cn-side-toc-label">Đang đọc</span>
            {tocItems.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.label}
                className={`cn-side-toc-item${item.id === activeTocId ? ' active' : ''}`}
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

// Scrollspy: menu bên phải bám theo vị trí cuộn thực tế của window — cùng convention với
// app/(apps)/korean/page.tsx.
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
      <p className="cn-section-title" id="cn-section-speaking">
        🗣️ Luyện nói <span className="cn-section-count">({data.items.length})</span>
      </p>
      <p className="cn-speaking-intro">{data.intro}</p>

      <div className="cn-speaking-list">
        {data.items.map((item, i) => (
          <div key={i} className="cn-glass cn-speaking-card">
            <div className="cn-speaking-card-head">
              <span className="cn-speaking-index">Câu {i + 1}</span>
              <span className="cn-speaking-level">{item.level}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <p className="cn-speaking-q">{item.question}</p>
              <SpeakButton text={item.question} lang={ZH_LANG} className="shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand" />
            </div>
            <p className="cn-speaking-q-vi">{item.questionVi}</p>

            <div className="cn-speaking-answer">
              <span className="cn-speaking-answer-label">答え</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="cn-speaking-a">
                    {item.answer} <span className="cn-speaking-grammar-tag">{item.grammar}</span>
                  </p>
                  <SpeakButton text={item.answer} lang={ZH_LANG} className="shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand" />
                </div>
                <p className="cn-speaking-a-vi">{item.answerVi}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cn-glass cn-speaking-summary">
        <p className="cn-speaking-summary-title">📝 Từ vựng/ngữ pháp trọng tâm cần nhớ</p>
        <div className="cn-speaking-summary-grammar">
          {data.grammarSummary.map((g, i) => (
            <p key={i}>
              <span className="cn-speaking-grammar-tag">{g.label}</span> — {g.note}
            </p>
          ))}
        </div>
        <p className="cn-speaking-summary-vocab">
          <strong>Từ vựng đã dùng:</strong> {data.vocabSummary}
        </p>
      </div>
    </>
  )
}

function VocabTile({
  card,
  progress,
  learned,
  selecting,
  selected,
  onClick,
}: {
  card: ChineseCard
  progress: ChineseProgress | undefined
  learned: boolean
  selecting?: boolean
  selected?: boolean
  onClick?: () => void
}) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      {...(onClick ? { type: 'button', onClick } : {})}
      className={`cn-glass flex items-center justify-between gap-3 p-3 text-left transition-shadow ${onClick ? 'hover:shadow-md' : ''} ${
        selecting && selected ? 'ring-2 ring-accent' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {selecting && (
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs ${
              selected ? 'border-accent bg-accent text-white' : 'border-border'
            }`}
          >
            {selected && '✓'}
          </span>
        )}
        <span
          className={`relative flex min-h-14 min-w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft px-2 py-1.5 text-center font-bold leading-tight text-brand ${
            card.hanzi.length <= 2 ? 'text-2xl' : card.hanzi.length <= 4 ? 'text-lg' : 'text-sm'
          }`}
        >
          {card.hanzi}
          {learned && (
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-white ring-2 ring-card">
              ✓
            </span>
          )}
        </span>
        <div>
          <p className="inline-flex items-center gap-1 rounded-pill bg-card-soft px-2 py-0.5 text-xs text-muted">
            {card.kind === 'grammar' ? '✏️ Ngữ pháp' : card.pinyin || '📚 Từ vựng'}
          </p>
          <p className="mt-1 text-sm font-medium">{card.meaning}</p>
        </div>
        {/* Chỉ hiện khi không ở chế độ chọn thẻ — lúc đó Tag là <button>, không thể lồng thêm nút. */}
        {!onClick && (
          <SpeakButton
            text={card.hanzi}
            lang={ZH_LANG}
            className="shrink-0 rounded-full p-1.5 text-muted hover:bg-brand-soft hover:text-brand"
          />
        )}
      </div>
      {!selecting && progress && (progress.correctCount > 0 || progress.wrongCount > 0) && (
        <div className="flex shrink-0 flex-col items-end gap-1 text-xs font-semibold">
          {progress.correctCount > 0 && <span className="rounded-pill bg-gold-soft px-2 py-0.5 text-gold">✓ {progress.correctCount}</span>}
          {progress.wrongCount > 0 && <span className="rounded-pill bg-danger-soft px-2 py-0.5 text-danger">✕ {progress.wrongCount}</span>}
        </div>
      )}
    </Tag>
  )
}

interface StructureSegment {
  condition: string
  result: string
}

// Ghi chú cấu trúc "chuẩn" là chuỗi các cặp điều kiện:kết quả ngắn, ngăn bởi " · " — cùng
// convention với app/(apps)/korean/page.tsx (parseStructureSegments/classifyCondition).
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

type ConditionKind = 'base' | 'positive' | 'question' | 'negative' | 'note'

// Tô màu nhãn nhánh theo vai trò để mắt phân biệt nhanh (giống việc Korean tô theo 받침): xanh lá = dạng
// khẳng định / cấu trúc chính, cam = dạng hỏi, đỏ = phủ định, tím = nghĩa / lưu ý. Nhãn khác giữ màu xám.
function classifyCondition(condition: string): ConditionKind {
  const c = condition.toLowerCase()
  if (/phủ định/.test(c)) return 'negative'
  if (/nghi vấn|hỏi/.test(c)) return 'question'
  if (/lưu ý|nghĩa|dùng cho|ví dụ/.test(c)) return 'note'
  if (/khẳng định|cấu trúc/.test(c)) return 'positive'
  return 'base'
}

// `root` là điểm ngữ pháp của thẻ (card.hanzi) — làm node gốc mà các nhánh mẫu câu toả ra. Khác Korean
// (gốc là phần chung của điều kiện đầu), ở đây các nhánh là nhãn tiếng Việt (Khẳng định/Nghi vấn...) nên
// không có phần chung để cắt ra.
function GrammarStructure({ note, root }: { note: string; root: string }) {
  const segments = parseStructureSegments(note)

  if (!segments) {
    return (
      <div className="cn-grammar-structure">
        <span className="cn-grammar-structure-label">Cấu trúc</span>
        <span className="cn-grammar-structure-text">{note}</span>
      </div>
    )
  }

  return (
    <div className="cn-structure-diagram">
      <span className="cn-grammar-structure-label">Cấu trúc</span>
      <div className="cn-structure-tree">
        <div className="cn-structure-root">{root}</div>
        <div className="cn-structure-branches">
          {segments.map((seg, i) => (
            <div key={i} className="cn-structure-branch">
              <span className={`cn-structure-condition cn-structure-condition--${classifyCondition(seg.condition)}`}>{seg.condition}</span>
              <span className="cn-structure-arrow">→</span>
              <span className="cn-structure-result">{seg.result}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GrammarCard({ card, index }: { card: ChineseCard; index: number }) {
  return (
    <div id={`cn-grammar-${card.id}`} className="cn-glass cn-grammar-card">
      <div className="flex items-start gap-3">
        <span className="cn-grammar-index">{index}</span>
        <div>
          <p className="cn-grammar-eyebrow">✏️ NGỮ PHÁP</p>
          <h3 className="cn-grammar-title">{card.hanzi}</h3>
          {card.pinyin && <p className="cn-grammar-pinyin">{card.pinyin}</p>}
        </div>
      </div>
      <p className="cn-grammar-meaning">{card.meaning}</p>

      {card.note && <GrammarStructure note={card.note} root={card.hanzi} />}

      {card.theory && (
        <div className="cn-grammar-theory">
          {card.theory.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      <GrammarExamples card={card} />
    </div>
  )
}

function GrammarExamples({ card }: { card: ChineseCard }) {
  let details: ExampleDetail[] = []
  try {
    details = card.exampleDetail ? JSON.parse(card.exampleDetail) : []
  } catch {
    details = []
  }

  if (details.length > 0) {
    return (
      <div className="cn-grammar-examples">
        <span className="cn-grammar-examples-label">Ví dụ</span>
        {details.map((d, i) => (
          <div key={i} className="cn-grammar-example">
            <div className="flex items-center gap-1.5">
              <p className="cn-grammar-example-line">{d.zh}</p>
              <SpeakButton text={d.zh} lang={ZH_LANG} className="shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand" />
            </div>
            {d.pinyin && <p className="cn-grammar-example-pinyin">{d.pinyin}</p>}
            <p className="cn-grammar-example-vi">{d.vi}</p>
            {d.vocab && (
              <p className="cn-grammar-example-note">
                <span className="cn-grammar-example-note-label">Từ vựng</span> {d.vocab}
              </p>
            )}
            {d.breakdown && (
              <p className="cn-grammar-example-note">
                <span className="cn-grammar-example-note-label">Biến đổi</span> {d.breakdown}
              </p>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (!card.example) return null
  return (
    <div className="cn-grammar-examples">
      <span className="cn-grammar-examples-label">Ví dụ</span>
      {card.example.split('\n').map((ex, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <p className="cn-grammar-example-line">{ex}</p>
          <SpeakButton text={ex} lang={ZH_LANG} className="shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand" />
        </div>
      ))}
    </div>
  )
}
