// Bộ câu hỏi luyện nói theo từng bài — cùng khuôn dạng với lib/korean/speakingPractice.ts.
// Chưa có nội dung thật (chưa có giáo trình), nên SPEAKING_PRACTICE để rỗng: LessonContent sẽ
// không hiện mục "Luyện nói" cho tới khi bài đó có key tương ứng ở đây.
export interface SpeakingPracticeItem {
  level: 'Dễ' | 'Trung bình' | 'Nâng cao'
  question: string
  questionVi: string
  answer: string
  grammar: string
  answerVi: string
}

export interface SpeakingPracticeSet {
  intro: string
  items: SpeakingPracticeItem[]
  grammarSummary: { label: string; note: string }[]
  vocabSummary: string
}

export const SPEAKING_PRACTICE: Record<number, SpeakingPracticeSet> = {}
