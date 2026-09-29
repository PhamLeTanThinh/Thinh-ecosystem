import 'server-only'
import { DICTATIONS } from '@/data/ielts/dictation/lms'
import { LISTENING_TESTS } from '@/data/ielts/listening/lms'
import { READING_TESTS } from '@/data/ielts/practice/reading'
import { LISTENING_VOCAB_SETS } from '@/data/ielts/vocab/listening'
import { SPEAKING_VOCAB_SETS } from '@/data/ielts/vocab/speaking'
import { WRITING_VOCAB_SETS } from '@/data/ielts/vocab/writing'
import { WRITING_EXERCISES } from '@/data/ielts/exercises/writing'
import { SPEAKING_LMS_EXERCISES } from '@/data/ielts/exercises/speaking-lms'
import { WRITING_LMS_EXERCISES } from '@/data/ielts/exercises/writing-lms'
import { SPEAKING_SAMPLES } from '@/data/ielts/samples/speaking'
import { WRITING_SAMPLES } from '@/data/ielts/samples/writing'
import { WRITING_TASK1_SAMPLES } from '@/data/ielts/samples/writing-task1'
import { flatQuestions, type ExerciseSet, type QuestionType, type ExerciseSummary, type PracticeTest, type SampleSummary, type TestSummary, type VocabGroup, type VocabSet, type WritingSample } from './practice'
import { itemCount, totalQuestions, type ListeningTest } from './listening'
import { dictationSummary, type Dictation, type DictationSummary } from './dictation'
import type { Skill } from './types'

// CHỈ chạy ở server ('server-only' làm build lỗi nếu client component lỡ import): dữ liệu đề gồm cả
// đáp án nên không được đóng gói vào JS tĩnh mà ai cũng tải được. Client chỉ nhận bản tóm tắt bên dưới,
// hoặc đề đầy đủ ở màn làm bài sau khi đã kiểm tra quyền.

// Gom đề của mọi kỹ năng ở 1 chỗ. Kỹ năng mới: import mảng đề của nó vào đây.
const ALL_TESTS: PracticeTest[] = [...READING_TESTS]

export function findTest(id: string): PracticeTest | undefined {
  return ALL_TESTS.find((t) => t.id === id)
}

// Dictation (nghe chép chính tả) chỉ có ở Listening: mỗi bài = 1 section của 1 đề CAM.
export function dictationSummariesForSkill(skill: Skill): DictationSummary[] {
  return skill === 'listening' ? DICTATIONS.map(dictationSummary) : []
}
export function findDictation(id: string): Dictation | undefined {
  return DICTATIONS.find((d) => d.id === id)
}

// Đề Listening có cấu trúc riêng (nhiều section + âm thanh + transcript) nên tách khỏi PracticeTest của Reading.
export function findListeningTest(id: string): ListeningTest | undefined {
  return LISTENING_TESTS.find((t) => t.id === id)
}

// Loại câu hỏi Listening → nhãn loại câu hỏi dùng chung ở danh sách đề.
const LISTENING_TYPE: Record<string, QuestionType> = { fill: 'gap-fill', choice: 'mcq', multi: 'multi', map: 'match', match: 'bank' }

function listeningSummary(t: ListeningTest): TestSummary {
  const items = t.sections.flatMap((s) => s.groups.flatMap((g) => g.items))
  return {
    id: t.id,
    skill: t.skill,
    title: t.title,
    category: t.category,
    part: t.part,
    durationMin: t.durationMin,
    questionTypes: [...new Set(items.map((it) => LISTENING_TYPE[it.type]))],
    questionCount: items.reduce((n, it) => n + itemCount(it), 0) || totalQuestions(t),
  }
}

export function summariesForSkill(skill: Skill): TestSummary[] {
  if (skill === 'listening') return LISTENING_TESTS.map(listeningSummary)
  return ALL_TESTS.filter((t) => t.skill === skill).map((t) => ({
    id: t.id,
    skill: t.skill,
    title: t.title,
    category: t.category,
    part: t.part,
    durationMin: t.durationMin,
    questionTypes: [...new Set(flatQuestions(t).map((q) => q.type))],
    questionCount: flatQuestions(t).length,
    difficulty: t.difficulty,
  }))
}

// Vocab set độc lập (không gắn đề). Kỹ năng mới có set theo chủ đề: import mảng của nó vào đây.
const ALL_VOCAB_SETS: VocabSet[] = [...WRITING_VOCAB_SETS, ...SPEAKING_VOCAB_SETS, ...LISTENING_VOCAB_SETS]

export function vocabForSkill(skill: Skill): VocabGroup[] {
  const fromTests = ALL_TESTS.filter((t) => t.skill === skill).map((t) => ({ testId: t.id, testTitle: t.title, skill: t.skill, category: t.category, part: t.part, vocab: t.vocab, hasTest: true }))
  const standalone = ALL_VOCAB_SETS.filter((s) => s.skill === skill).map((s) => ({ testId: s.id, testTitle: s.title, skill: s.skill, category: s.category, part: s.part, vocab: s.vocab, hasTest: false }))
  return [...fromTests, ...standalone]
}

// Bộ Bài tập (Sentence Building hoặc Matching). Kỹ năng mới có bài tập: import mảng của nó vào đây.
const ALL_EXERCISE_SETS: ExerciseSet[] = [...WRITING_EXERCISES, ...WRITING_LMS_EXERCISES, ...SPEAKING_LMS_EXERCISES]

export function findExerciseSet(id: string): ExerciseSet | undefined {
  return ALL_EXERCISE_SETS.find((s) => s.id === id)
}

// Đơn vị "qua/chưa qua" khác nhau theo dạng bài: sentence-building tính theo TỪNG CÂU, matching tính theo
// TỪNG VÒNG, quiz theo TỪNG MÀN (khớp đúng đơn vị mà loadExerciseProgress/saveExerciseProgress lưu — xem 2 component Study).
function exerciseQuestionCount(s: ExerciseSet): number {
  if (s.kind === 'sentence-building') return s.questions.length
  return s.kind === 'quiz' ? s.items.length : s.rounds.length
}

export function exerciseSummariesForSkill(skill: Skill): ExerciseSummary[] {
  return ALL_EXERCISE_SETS.filter((s) => s.skill === skill).map((s) => ({
    id: s.id,
    skill: s.skill,
    kind: s.kind,
    title: s.title,
    category: s.category,
    part: s.part,
    questionCount: exerciseQuestionCount(s),
  }))
}

// Đề mẫu (bài luận mẫu hoàn chỉnh). Kỹ năng mới có đề mẫu: import mảng của nó vào đây.
const ALL_SAMPLES: WritingSample[] = [...WRITING_SAMPLES, ...WRITING_TASK1_SAMPLES, ...SPEAKING_SAMPLES]

export function findSample(id: string): WritingSample | undefined {
  return ALL_SAMPLES.find((s) => s.id === id)
}

export function sampleSummariesForSkill(skill: Skill): SampleSummary[] {
  return ALL_SAMPLES.filter((s) => s.skill === skill).map((s) => ({
    id: s.id,
    skill: s.skill,
    title: s.title,
    topic: s.topic,
    resourceLabel: s.resourceLabel,
    part: s.part,
    description: s.description,
    // "Writing Task 1" / "Writing Task 2 Academic" / "Speaking Part 3" → số task/part cho bộ lọc ở trang Đề mẫu
    task: ((m) => (m ? (Number(m[1]) as 1 | 2 | 3) : undefined))(/(?:task|part)\s*([123])\b/i.exec(s.resourceLabel)),
  }))
}
