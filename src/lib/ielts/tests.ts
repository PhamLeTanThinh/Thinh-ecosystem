import 'server-only'
import { READING_TESTS } from '@/data/ielts/practice/reading'
import { flatQuestions, type PracticeTest, type TestSummary, type VocabGroup } from './practice'
import type { Skill } from './types'

// CHỈ chạy ở server ('server-only' làm build lỗi nếu client component lỡ import): dữ liệu đề gồm cả
// đáp án nên không được đóng gói vào JS tĩnh mà ai cũng tải được. Client chỉ nhận bản tóm tắt bên dưới,
// hoặc đề đầy đủ ở màn làm bài sau khi đã kiểm tra quyền.

// Gom đề của mọi kỹ năng ở 1 chỗ. Kỹ năng mới: import mảng đề của nó vào đây.
const ALL_TESTS: PracticeTest[] = [...READING_TESTS]

export function findTest(id: string): PracticeTest | undefined {
  return ALL_TESTS.find((t) => t.id === id)
}

export function summariesForSkill(skill: Skill): TestSummary[] {
  return ALL_TESTS.filter((t) => t.skill === skill).map((t) => ({
    id: t.id,
    skill: t.skill,
    title: t.title,
    category: t.category,
    part: t.part,
    durationMin: t.durationMin,
    questionTypes: [...new Set(flatQuestions(t).map((q) => q.type))],
    questionCount: flatQuestions(t).length,
  }))
}

export function vocabForSkill(skill: Skill): VocabGroup[] {
  return ALL_TESTS.filter((t) => t.skill === skill).map((t) => ({ testId: t.id, testTitle: t.title, skill: t.skill, category: t.category, part: t.part, vocab: t.vocab }))
}
