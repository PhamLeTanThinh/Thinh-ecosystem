import Link from 'next/link'
import { flatQuestions, questionTypeLabel, type PracticeMode, type PracticeTest } from '@/lib/ielts/practice'
import { accentVars, skillMeta } from '@/lib/ielts/skills'

function MetaIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

// Màn giới thiệu đề — hiện sau khi chọn chế độ, trước khi vào làm bài: tên đề, số câu / đoạn văn / thời gian,
// hướng dẫn (đổi theo chế độ) và nút Bắt đầu. Server component thuần: chỉ có Link và các con số, KHÔNG gửi
// nội dung đề hay đáp án xuống client (nội dung đề chỉ đi tới client ở màn làm bài).
export function TestIntro({ test, mode }: { test: PracticeTest; mode: PracticeMode }) {
  const questions = flatQuestions(test)
  // Hiện mỗi đề chỉ có 1 bài đọc (test.passage là các đoạn của bài đó); khi có đề nhiều bài đọc thì đếm ở đây.
  const passageCount = 1
  const types = [...new Set(questions.map((q) => q.type))].map(questionTypeLabel)
  const meta = skillMeta(test.skill)
  const base = `/ielts/${test.skill}/practice/${test.id}`

  return (
    <main className="ih-intro" style={accentVars(test.skill)}>
      <div className="ih-intro-card">
        <Link href={base} className="ih-pr-back">
          ← Chọn chế độ khác
        </Link>

        <h1 className="ih-intro-title">
          <span className="ih-intro-icon" aria-hidden>
            {meta?.icon}
          </span>
          {test.title}
        </h1>

        <ul className="ih-intro-meta">
          <li>
            <MetaIcon>
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5M12 17h.01" />
            </MetaIcon>
            {questions.length} câu hỏi
          </li>
          <li>
            <MetaIcon>
              <path d="M7 3h7l4 4v14H7z" />
              <path d="M14 3v4h4" />
            </MetaIcon>
            {passageCount} đoạn văn
          </li>
          <li>
            <MetaIcon>
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2.5 2M9.5 2.5h5" />
            </MetaIcon>
            {test.durationMin} phút
          </li>
        </ul>

        <hr className="ih-intro-rule" />

        <section>
          <h2 className="ih-intro-h2">Hướng dẫn làm bài</h2>
          <div className="ih-intro-text">
            <p>Bạn sẽ đọc đoạn văn và trả lời câu hỏi, có thể di chuyển qua lại giữa các câu hỏi.</p>
            <p>Một câu hỏi có thể có một hoặc nhiều đáp án tùy theo yêu cầu, có thể thay đổi câu trả lời trong quá trình làm bài.</p>
            {mode === 'practice' ? (
              <>
                <p>Ở chế độ luyện tập: Bài làm sẽ không bị giới hạn thời gian. Bạn có thể làm và nộp bài bất cứ khi nào hoàn thành, và bấm “Kiểm tra” để xem đúng/sai ngay khi làm.</p>
                <p>Bài làm được tự lưu, bạn có thể thoát ra và làm tiếp sau.</p>
              </>
            ) : (
              <>
                <p>Ở chế độ thi thật: Đồng hồ đếm ngược {test.durationMin} phút bắt đầu ngay khi bạn bấm “Bắt đầu”, hết giờ hệ thống sẽ tự nộp bài. Không có hỗ trợ kiểm tra đáp án khi làm bài.</p>
                <p>Nếu thoát giữa chừng, đồng hồ vẫn tiếp tục chạy; bạn có thể vào lại để làm tiếp nếu còn giờ.</p>
              </>
            )}
          </div>
        </section>

        <section>
          <h2 className="ih-intro-h2">Thông tin bài test</h2>
          <div className="ih-intro-text">
            <p>
              Bài test này bao gồm {questions.length} câu hỏi thuộc {passageCount} đoạn văn, thời gian làm bài là {test.durationMin} phút.
            </p>
            <p>Các dạng câu hỏi có trong bài test: {types.join(', ')}</p>
          </div>
        </section>

        <div className="ih-intro-actions">
          <Link href={`${base}/run?mode=${mode}`} className="ih-intro-start">
            Bắt đầu
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  )
}
