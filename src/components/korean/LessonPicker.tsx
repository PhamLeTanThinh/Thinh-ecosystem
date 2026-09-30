'use client'

import { LESSON_NUMBERS, LESSON_TITLES, TOPIK_LABEL, lessonDisplayNumber, lessonNumbersForLevel } from '@/lib/korean/lessons'

interface Props {
  cardCountByLesson: Map<number, number>
  selected: Set<number>
  onToggle: (lesson: number) => void
  onSelectAll: () => void
  onClearAll: () => void
}

export function LessonPicker({ cardCountByLesson, selected, onToggle, onSelectAll, onClearAll }: Props) {
  const selectableLessons = LESSON_NUMBERS.filter((n) => (cardCountByLesson.get(n) ?? 0) > 0)
  const allSelected = selectableLessons.length > 0 && selectableLessons.every((n) => selected.has(n))

  return (
    <div>
      <div className="kr-picker-toolbar">
        <p className="kr-filter-label">CHỌN BÀI HỌC</p>
        <button type="button" onClick={allSelected ? onClearAll : onSelectAll} className="kr-picker-toggle-all">
          {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
        </button>
      </div>
      {/* Nhóm theo cấp độ — số bài hiển thị theo sách (TOPIK I lưu lesson 101-116 nhưng ghi 1과-16과). */}
      {(['topik1', 'topik2'] as const).map((level) =>
        lessonNumbersForLevel(level).length === 0 ? null : (
          <div key={level}>
            <p className="kr-picker-level">{TOPIK_LABEL[level]}</p>
            <div className="kr-picker-grid">
              {lessonNumbersForLevel(level).map((n) => {
                const count = cardCountByLesson.get(n) ?? 0
                const checked = selected.has(n)
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onToggle(n)}
                    disabled={count === 0}
                    className={`kr-picker-item${checked ? ' active' : ''}`}
                  >
                    <span className="kr-picker-item-badge">{lessonDisplayNumber(n)}과</span>
                    <span className="kr-picker-item-body">
                      <span className="kr-picker-item-title">{LESSON_TITLES[n] ?? ''}</span>
                      <span className="kr-picker-item-count">{count} thẻ</span>
                    </span>
                    {checked && <span className="kr-picker-item-check">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        ),
      )}
    </div>
  )
}
