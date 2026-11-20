import type { TheoryDomain } from '../../ccaf-theory/types'

export const DOMAIN_6: TheoryDomain = {
  id: 'dev-productivity',
  number: 6,
  title: 'Năng suất developer & vận hành',
  category: 'Developer Productivity & Operational Enablement',
  summary: 'Thứ tự ưu tiên các scope cấu hình Claude Code, dùng project scope cho cấu hình chung và managed cho chính sách bắt buộc, CLAUDE.md và subagent, giữ secret ngoài repo, chẩn đoán sự cố và viết runbook.',
  topics: [
    {
      id: 'config-scopes',
      title: 'Các scope cấu hình Claude Code & thứ tự ưu tiên',
      summary: 'Managed → command line → local → project → user. Cấu hình chung của team (MCP, permission, context) → project scope commit vào repo; chính sách không được ghi đè → managed.',
      questionIds: [62, 52, 55, 102, 105, 96],
      blocks: [
        {
          type: 'tldr',
          text: 'Thứ tự ưu tiên từ cao xuống thấp: **Managed → command-line → local → project → user**. Cấu hình **cả team dùng chung** → **project scope**, commit vào repo. Chính sách **bảo mật bắt buộc** → **managed**. Sở thích cá nhân → **user**.',
        },
        {
          type: 'table',
          headers: ['Scope', 'File / nơi đặt', 'Dùng cho'],
          rows: [
            ['**Managed**', 'Managed settings do IT triển khai tập trung', 'Chính sách bảo mật, compliance **không ai ghi đè được**'],
            ['**Command-line**', 'Tham số khi chạy `claude`', 'Ghi đè tạm thời cho một phiên'],
            ['**Local**', '`.claude/settings.local.json` (không commit)', 'Tuỳ chỉnh cá nhân trong một project'],
            ['**Project**', '`.claude/settings.json`, `.mcp.json` (commit)', 'MCP server, permission, context **chung của team**'],
            ['**User**', '`~/.claude/settings.json`', 'Sở thích cá nhân trên mọi project'],
          ],
        },
        {
          type: 'example',
          scenario: 'Mọi kỹ sư trong cùng repo phải dùng **giống hệt các định nghĩa MCP server** mà không phải tự đồng bộ.',
          right: '`.claude/settings.json` và **`.mcp.json` ở project scope, commit vào repo**.',
          wrong: ['User scope — mỗi người một máy.', 'Local scope — không commit.', 'Gửi file cấu hình qua chat.'],
          why: 'Project scope nằm trong version control nên ai clone repo cũng nhận cùng cấu hình.',
        },
        {
          type: 'example',
          scenario: 'Phiên Claude Code báo **bị từ chối quyền** cho một thao tác kỹ sư nghĩ là được phép.',
          right: '**Kiểm tra các permission rule đang áp dụng ở mọi scope** (managed, CLI, local, project, user) để tìm rule đang chặn, rồi quyết định có sửa hay giữ.',
          why: 'Deny rule được xét trước ask / allow, và có thể đến từ scope cao hơn mà kỹ sư không thấy.',
        },
        { type: 'callout', tone: 'exam', title: 'Combo hay ra', text: 'Thiết lập môi trường team nhất quán và an toàn = **project scope** cho MCP + permission dùng chung **+ managed config** cho chính sách bắt buộc.' },
      ],
    },
    {
      id: 'claude-md-subagents',
      title: 'CLAUDE.md, subagent & AI ngay trong IDE',
      summary: 'Phải giải thích lại quy ước mỗi phiên → CLAUDE.md commit vào repo. Việc chuyên môn lặp lại cần prompt riêng, quyền hẹp, model riêng → subagent. AI trong IDE giảm chuyển đổi ngữ cảnh.',
      questionIds: [69, 116, 50],
      blocks: [
        {
          type: 'tldr',
          text: 'Kiến thức project lặp lại → ghi **một lần** vào **CLAUDE.md** ở project scope, mỗi phiên tự nạp. Việc chuyên môn **lặp lại** (vd. review schema database) cần **system prompt riêng, quyền tool hẹp, model riêng** → **subagent**. Hỗ trợ AI nên nằm **ngay trong IDE**.',
        },
        {
          type: 'table',
          headers: ['Vấn đề', 'Giải pháp'],
          rows: [
            ['Mỗi phiên kỹ sư phải giải thích lại quy ước và kiến trúc', '**CLAUDE.md** commit vào repo, tự nạp mỗi phiên'],
            ['Việc chuyên môn lặp lại qua nhiều phiên, cần prompt / quyền / model riêng', '**Project subagent**'],
            ['Việc một lần, không lặp lại', 'Dùng năng lực chung của Claude Code, không cần subagent'],
          ],
        },
        {
          type: 'example',
          scenario: 'Đề xuất A: tích hợp Claude Code vào IDE để sinh và review code ngay trong editor. Đề xuất B: mọi yêu cầu sinh code gửi qua Slack.',
          right: '**A giảm chuyển đổi ngữ cảnh** vì hỗ trợ ngay chỗ đang code; **B tạo ma sát** vì bắt dev rời IDE, đi ngược mục tiêu năng suất.',
          why: 'Năng suất đến từ việc AI có mặt đúng chỗ công việc đang diễn ra.',
        },
      ],
    },
    {
      id: 'secrets-ops',
      title: 'Secret, chẩn đoán sự cố & runbook',
      summary: 'Không commit API key vào file cấu hình — lấy từ secret store lúc chạy. JSON hỏng sau bảo trì → so cấu hình với bản tốt gần nhất + replay request cũ. Runbook: alert + triage, escalation, rollback, link dashboard / log.',
      questionIds: [14, 36, 71, 95],
      blocks: [
        {
          type: 'tldr',
          text: 'Secret **không bao giờ** nằm trong file có version control (kể cả `.claude/settings.json`) → lấy **từ secret store lúc chạy**. Chẩn đoán bằng **so với bản tốt gần nhất** và **tái hiện tối thiểu, đổi một biến mỗi lần**.',
        },
        {
          type: 'example',
          scenario: 'Sau đợt bảo trì định kỳ, pipeline bắt đầu trả JSON hỏng, làm hỏng xử lý phía sau.',
          right: '(1) **So system prompt và schema output hiện tại với bản tốt trước bảo trì**; (2) **replay các request trước bảo trì** trên cấu hình hiện tại và **xem response thô** của Claude.',
          why: 'Tách được lỗi do cấu hình thay đổi hay do bước parse phía sau.',
        },
        {
          type: 'table',
          headers: ['Bộ công cụ chẩn đoán Claude Code', 'Mục đích'],
          rows: [
            ['Tái hiện tối thiểu, mỗi lần chỉ đổi một biến', 'Xác định đúng input / cấu hình / môi trường gây lỗi'],
            ['Liệt kê MCP server đã cấu hình và xem trạng thái', 'Phát hiện lỗi kết nối với phụ thuộc bên ngoài'],
          ],
        },
        { type: 'h', text: 'Runbook vận hành phải có' },
        {
          type: 'list',
          items: [
            'Các **alert thường gặp** và **bước triage** cho từng alert.',
            '**Đường escalation**.',
            '**Quy trình rollback**.',
            'Link tới **dashboard và log** liên quan.',
          ],
        },
      ],
    },
  ],
}
