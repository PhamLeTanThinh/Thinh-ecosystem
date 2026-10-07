import type { GrammarLesson } from '@/lib/ielts/grammar'
import { LESSONS_1 } from './lessons-1'
import { LESSONS_2 } from './lessons-2'

// 45 bài ngữ pháp cơ bản theo thứ tự học (chia 2 file cho dễ sửa: 1-23 và 24-45).
export const GRAMMAR_LESSONS: GrammarLesson[] = [...LESSONS_1, ...LESSONS_2]
