import type { AnswerGroup } from '../ccaf-answer-groups'

// Nhóm câu CCAR-P có CÙNG NGUYÊN TẮC đúng (cùng ý tưởng với ccaf-answer-groups.ts). Soạn thủ công từ
// questions/ccar-p.json — chỉ gom những câu mà đáp án đúng thật sự dựa vào cùng một nguyên tắc; một câu có thể
// thuộc nhiều nhóm nếu đáp án chạm tới nhiều nguyên tắc.
export const CCARP_ANSWER_GROUPS: AnswerGroup[] = [
  { id: 'least-privilege', title: 'Least privilege: chỉ cấp đúng tool cần, allow-list enforce ở orchestration', icon: '🔐', questionIds: [1, 59, 64, 72, 77, 113, 124] },
  { id: 'rbac-at-retrieval', title: 'Phân quyền trước retrieval — dữ liệu trái quyền không vào context', icon: '🛂', questionIds: [19, 30, 40, 48, 86] },
  { id: 'untrusted-content', title: 'Coi nội dung retrieve / người dùng là untrusted (prompt injection, exfiltration)', icon: '☣️', questionIds: [53, 82, 89, 124] },
  { id: 'layered-guardrails', title: 'Guardrail nhiều lớp: prompt + classifier runtime + validate schema', icon: '🧱', questionIds: [59, 68, 87, 99, 124] },
  { id: 'prompt-caching', title: 'Prompt caching cho prefix dài lặp lại + cắt context còn phần liên quan', icon: '♻️', questionIds: [4, 15, 34, 41, 106, 123] },
  { id: 'tool-discovery', title: 'Quá nhiều tool: tải khi cần (Tool Search / progressive discovery) hoặc tách agent', icon: '🧰', questionIds: [7, 21, 45, 81] },
  { id: 'human-before-irreversible', title: 'Người duyệt trước hành động tác động lớn / không đảo ngược, có tiêu chí rõ', icon: '🙋', questionIds: [3, 9, 29, 65, 67, 72, 98, 117] },
  { id: 'grounding-citations', title: 'Bám nguồn: RAG, bắt buộc trích dẫn, bước kiểm chứng, prompt không mâu thuẫn', icon: '📎', questionIds: [18, 31, 57, 76, 107] },
  { id: 'regression-by-version', title: 'Regression: reference set cố định, chấm theo phiên bản model / prompt', icon: '🔁', questionIds: [11, 25, 27, 31, 32, 53] },
  { id: 'define-before-run', title: 'Câu "bước nào TRƯỚC": định nghĩa / xác định trước, thực thi sau', icon: '🪜', questionIds: [10, 20, 26, 42, 70, 79, 84, 109, 110, 112, 117] },
  { id: 'right-sized-model', title: 'Model vừa đủ: Haiku cho phân loại khối lượng lớn, route theo tầng, eval quyết định', icon: '⚖️', questionIds: [12, 24, 33, 41] },
  { id: 'hard-constraint-first', title: 'Ràng buộc cứng (SLA, accuracy-first, bảo mật) loại phương án trước, rồi mới so chi phí', icon: '🚧', questionIds: [28, 44, 126] },
  { id: 'simplest-pattern', title: 'Chọn pattern đơn giản nhất: workflow, RAG, gọi API trực tiếp — không thêm lớp thừa', icon: '🪶', questionIds: [5, 18, 21, 37, 39] },
  { id: 'project-scope', title: 'Project scope: .mcp.json, .claude/settings.json, CLAUDE.md commit vào repo', icon: '📁', questionIds: [52, 55, 69, 70, 84, 102, 105] },
  { id: 'managed-config', title: 'Managed config & thứ tự scope: chính sách bắt buộc không ai ghi đè được', icon: '🏛️', questionIds: [52, 62, 90, 96, 105, 120] },
  { id: 'skill-centralized', title: 'Claude Skill: quy trình dùng chung, một nguồn, có chủ sở hữu và cổng review', icon: '🧩', questionIds: [68, 97, 114, 118] },
  { id: 'secrets-identity', title: 'Không để secret trong repo / prompt; OAuth theo người + ghi ai khởi tạo', icon: '🗝️', questionIds: [14, 40, 122] },
  { id: 'compliance-contracts', title: 'Tuân thủ: BAA (HIPAA), DPA (GDPR), retention, audit log', icon: '📜', questionIds: [28, 48, 80, 91, 110] },
  { id: 'fairness-eval', title: 'Công bằng: đo chênh lệch kết quả và tỷ lệ lỗi trên tập đại diện', icon: '🟰', questionIds: [16, 22, 66, 108] },
  { id: 'observability', title: 'Observability: model + version mỗi lượt, correlation ID, SLO trước instrument', icon: '🔭', questionIds: [13, 42, 111] },
  { id: 'adr-handoff', title: 'ADR có phương án + trade-off; gói bàn giao có contract, eval, runbook, hạn chế', icon: '🗂️', questionIds: [47, 49, 51, 74, 83, 85, 121, 125] },
  { id: 'decision-first-audience', title: 'Trình bày: mở bằng quyết định, nội dung theo mối quan tâm của từng đối tượng', icon: '🎯', questionIds: [56, 58, 73, 93, 101] },
  { id: 'discovery-before-build', title: 'Discovery trước khi build: quyết định đang hỏng, metric, ràng buộc phi chức năng', icon: '🧭', questionIds: [43, 88, 92, 103, 112] },
  { id: 'measurable-sla', title: 'SLA đo được: metric + ngưỡng + cửa sổ + hệ quả; đưa số đo thực khi bàn latency', icon: '⏱️', questionIds: [44, 61, 115] },
  { id: 'transparent-alignment', title: 'Đồng thuận minh bạch: nói rõ tác động scope, đưa lựa chọn, chốt người và hạn', icon: '🤝', questionIds: [60, 94, 100] },
  { id: 'value-pillars', title: 'Gọi đúng loại giá trị: efficiency, productivity, cost, transformation, SLA', icon: '📊', questionIds: [6, 54, 78] },
  { id: 'diagnose-minimal-first', title: 'Chẩn đoán từ bước ít xâm lấn: liệt kê / so với bản tốt / tái hiện tối thiểu', icon: '🩺', questionIds: [8, 31, 36, 46, 71, 96] },
]
