import type { AnswerGroup } from '../ccaf-answer-groups'

// Nhóm câu AI-200 có CÙNG KỸ THUẬT/GIẢI PHÁP đúng (cùng ý tưởng với ccaf-answer-groups.ts). Soạn thủ công từ
// questions/ai-200.json — chỉ gom những câu mà đáp án đúng thật sự dựa vào cùng một kỹ thuật; một câu có thể
// thuộc nhiều nhóm nếu đáp án chạm tới nhiều kỹ thuật.
export const AI200_ANSWER_GROUPS: AnswerGroup[] = [
  { id: 'dead-letter', title: 'Dead-letter: giữ lại message/event lỗi để điều tra', icon: '🪦', questionIds: [24, 28, 33, 53, 114, 118, 124] },
  { id: 'defer-abandon', title: 'Settle message Service Bus: complete / abandon / defer / dead-letter', icon: '📨', questionIds: [32, 53, 118] },
  { id: 'topic-subscription', title: 'Topic + subscription: một message cho nhiều consumer', icon: '📣', questionIds: [35, 114, 115] },
  { id: 'eventgrid-advanced-filter', title: 'Event Grid advanced filter: lọc theo trường trong payload', icon: '🔎', questionIds: [30, 33, 123, 124] },
  { id: 'keyvault-reference', title: 'Key Vault reference trong app settings (không sửa code)', icon: '🔗', questionIds: [31, 42, 49, 50, 55, 62, 86, 93] },
  { id: 'managed-identity-rbac', title: 'Managed identity + role đúng phạm vi, không lưu credential', icon: '🪪', questionIds: [43, 45, 46, 56, 58, 63, 98, 99, 116] },
  { id: 'versionless-secret', title: 'Lấy secret KHÔNG kèm version để tự nhận bản đã rotate', icon: '🔄', questionIds: [46, 84, 94, 98] },
  { id: 'no-secret-in-image', title: 'Không nhét secret vào Dockerfile / GitHub secrets / source control', icon: '🚫', questionIds: [42, 47, 48, 51, 55] },
  { id: 'cache-ttl-invalidate', title: 'Redis: TTL tuyệt đối + xoá key khi dữ liệu nguồn đổi', icon: '⏱️', questionIds: [10, 15, 20, 72, 110] },
  { id: 'change-feed-lease', title: 'Change feed processor + lease container', icon: '📜', questionIds: [11, 18, 25, 128] },
  { id: 'connection-pooling', title: 'Connection pooling (PgBouncer, transaction mode, giới hạn pool)', icon: '🏊', questionIds: [6, 9, 19] },
  { id: 'ann-vector-index', title: 'Tạo vector index (HNSW / IVFFlat / DiskANN / FLAT) cho similarity search', icon: '🧭', questionIds: [7, 8, 21, 103, 104, 119] },
  { id: 'filter-then-rank', title: 'Lọc metadata (WHERE / B-tree) rồi xếp theo khoảng cách vector', icon: '🎚️', questionIds: [8, 12, 71] },
  { id: 'keda-queue-scale', title: 'KEDA scale theo độ dài queue, min replicas = 0 để về 0', icon: '📈', questionIds: [3, 23, 41, 106] },
  { id: 'aca-revisions', title: 'ACA revisions: multiple revision mode + traffic splitting / label', icon: '🔀', questionIds: [54, 74, 109, 122] },
  { id: 'acr-tasks', title: 'ACR Tasks: build tự động theo commit / base image / timer', icon: '🏗️', questionIds: [4, 26, 112, 127] },
  { id: 'kql-where-summarize', title: 'KQL: where lọc sớm, summarize để gom nhóm, join để tương quan', icon: '📊', questionIds: [59, 80, 83, 85, 87, 90, 92, 95] },
  { id: 'otel-pipeline', title: 'OpenTelemetry: TracerProvider → exporter → span processor', icon: '🛰️', questionIds: [40, 64, 65, 66, 78] },
  { id: 'inspect-before-restart', title: 'AKS: xem events / logs / endpoints trước, đừng restart hay scale mù', icon: '🩺', questionIds: [2, 39, 82] },
  { id: 'function-trigger-choice', title: 'Chọn trigger Azure Functions đúng mô hình (HTTP / Queue / Timer / Event Grid / Cosmos DB)', icon: '⚡', questionIds: [25, 29, 69, 75, 100] },
  { id: 'functions-premium', title: 'Functions Premium plan: custom container, VNet, không cold start', icon: '🔥', questionIds: [36, 63] },
  { id: 'cosmos-consistency', title: 'Chọn consistency level Cosmos DB theo yêu cầu độ mới', icon: '⚖️', questionIds: [17, 120] },
  { id: 'app-config-features', title: 'App Configuration: label theo môi trường, feature flag, refresh có cache', icon: '🎛️', questionIds: [43, 44, 79, 93] },
]
