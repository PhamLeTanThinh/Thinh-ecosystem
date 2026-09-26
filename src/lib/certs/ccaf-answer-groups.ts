// Nhóm câu hỏi CCAF có CÙNG KỸ THUẬT/GIẢI PHÁP đúng (khác với ccaf-theory: đó là nhóm theo chủ đề lý
// thuyết rộng, còn đây là nhóm hẹp hơn — những câu mà đáp án đúng là cùng 1 kỹ thuật cụ thể, vd. "thêm
// few-shot examples" hay "dùng hook chặn tool call"). Soạn thủ công từ nội dung câu hỏi + đáp án (xem
// ccaf-questions.json) — chỉ đưa vào nhóm những câu THẬT SỰ cùng kỹ thuật; câu có kỹ thuật riêng biệt,
// không lặp lại ở câu nào khác thì không thuộc nhóm nào (vẫn luyện được bình thường ở các chế độ khác).
// Một câu có thể thuộc nhiều nhóm nếu đáp án của nó thật sự chạm tới nhiều kỹ thuật.
export interface AnswerGroup {
  id: string
  title: string
  icon: string
  questionIds: number[]
}

export const CCAF_ANSWER_GROUPS: AnswerGroup[] = [
  { id: 'grep-glob', title: 'Grep vs Glob: chọn đúng công cụ tìm kiếm', icon: '🔍', questionIds: [2, 23, 25, 46, 47, 59, 202, 222] },
  { id: 'coordinator-subagent', title: 'Điều phối coordinator ↔ subagent', icon: '🧭', questionIds: [6, 7, 16, 211, 237] },
  { id: 'source-metadata', title: 'Giữ nguồn & metadata khi tổng hợp nhiều agent', icon: '🔗', questionIds: [9, 18, 19, 21, 65] },
  { id: 'mcp-resources', title: 'MCP resources: danh mục nội dung server', icon: '📚', questionIds: [26, 218] },
  { id: 'customer-escalate', title: 'Escalate & phục vụ khách hàng đúng lúc', icon: '🤝', questionIds: [29, 32, 33, 37, 38, 245] },
  { id: 'enforce-by-code', title: 'Đảm bảo bằng code, không chỉ dựa vào prompt', icon: '🔒', questionIds: [31, 168, 191, 259] },
  { id: 'error-category', title: 'Phân loại lỗi: tạm thời vs vĩnh viễn (structured errorCategory)', icon: '⚠️', questionIds: [35, 41, 93, 97, 137, 185, 209, 228, 250] },
  { id: 'iserror-protocol', title: 'isError / lỗi giao thức MCP', icon: '🛑', questionIds: [40, 94] },
  { id: 'retry-with-feedback', title: 'Follow-up kèm lỗi validation cụ thể (extraction tự sửa)', icon: '🔁', questionIds: [66, 109, 118] },
  { id: 'few-shot', title: 'Few-shot examples: dạy bằng ví dụ', icon: '💡', questionIds: [63, 69, 73, 145, 151, 183, 186, 188, 208, 227, 231] },
  { id: 'claude-md-rules', title: 'CLAUDE.md / .claude/rules: tổ chức hướng dẫn dự án', icon: '📋', questionIds: [44, 173, 176, 178, 179, 199, 224, 230, 242, 262] },
  { id: 'confidence-calibrate', title: 'Confidence & calibration: định tuyến review theo độ tin cậy', icon: '🎯', questionIds: [61, 64, 74, 139, 154, 220, 253] },
  { id: 'direct-vs-plan', title: 'Direct execution hay Plan mode', icon: '🛠️', questionIds: [60, 164, 167, 232, 238] },
  { id: 'resume-named', title: '--resume theo tên phiên', icon: '↩️', questionIds: [45, 48, 52, 217] },
  { id: 'fork-session', title: 'fork_session: tách nhánh song song từ cùng baseline', icon: '🌿', questionIds: [51, 54, 247] },
  { id: 'long-exploration', title: 'Quản lý context khi khám phá dài (scratchpad, subagent hẹp)', icon: '📝', questionIds: [50, 53, 55, 212] },
  { id: 'adaptive-decomposition', title: 'Khám phá/chia việc thích ứng, không lên kế hoạch mù', icon: '🧩', questionIds: [2, 13, 56] },
  { id: 'batch-api', title: 'Batch API: chi phí, SLA, custom_id', icon: '📦', questionIds: [62, 75, 77, 110, 216, 243] },
  { id: 'tool-redesign', title: 'Thiết kế lại tool: tách theo mục đích hoặc gộp trùng nghĩa', icon: '🔧', questionIds: [15, 100, 140, 184, 257] },
  { id: 'schema-anti-fabrication', title: 'Schema chống bịa: null / enum mở / tự đối chiếu tổng', icon: '🧮', questionIds: [68, 70, 72, 107, 208] },
  { id: 'tool-choice', title: 'tool_choice: ép tool cụ thể hoặc any', icon: '🎛️', questionIds: [71, 117] },
  { id: 'progressive-summarization', title: 'Progressive summarization: quản lý context hội thoại dài', icon: '📉', questionIds: [119, 125, 128] },
  { id: 'structured-state', title: 'Structured state object: theo dõi thông tin thay đổi', icon: '🗂️', questionIds: [144, 241] },
  { id: 'ambiguous-request', title: 'Yêu cầu mơ hồ: nêu giả định rõ ràng', icon: '❓', questionIds: [126, 143] },
]

export function findAnswerGroup(id: string): AnswerGroup | undefined {
  return CCAF_ANSWER_GROUPS.find((g) => g.id === id)
}

// Câu hỏi → các nhóm nó thuộc về, để hiện gợi ý "Xem các câu cùng kỹ thuật" sau khi chấm (nếu muốn dùng sau này).
export function answerGroupsByQuestion(): Record<number, { id: string; title: string }[]> {
  const map: Record<number, { id: string; title: string }[]> = {}
  for (const g of CCAF_ANSWER_GROUPS) for (const qid of g.questionIds) (map[qid] ??= []).push({ id: g.id, title: g.title })
  return map
}
