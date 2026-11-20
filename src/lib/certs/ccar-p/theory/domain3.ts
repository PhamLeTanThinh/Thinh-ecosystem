import type { TheoryDomain } from '../../ccaf-theory/types'

export const DOMAIN_3: TheoryDomain = {
  id: 'integration',
  number: 3,
  title: 'Tích hợp',
  category: 'Integration',
  summary: 'Chọn giữa MCP, gọi API trực tiếp và agent handoff; đưa Claude Code vào quy trình PR, viết tài liệu và pilot mà vẫn giữ quyền quyết định của con người; xử lý sự cố MCP server.',
  topics: [
    {
      id: 'integration-mechanism',
      title: 'MCP, API trực tiếp hay agent handoff?',
      summary: 'Cần dùng chung cho nhiều AI client → MCP. Một lời gọi stateless, latency thấp tới API HTTP sẵn có → gọi API trực tiếp với credential giới hạn.',
      questionIds: [38, 39],
      blocks: [
        {
          type: 'tldr',
          text: 'Hai câu hỏi quyết định: tích hợp có cần **dùng lại trên nhiều AI client** không (có → **MCP**)? Và tương tác là **stateless, cần nhanh** hay **có trạng thái, chạy lâu**? Stateless và đã có API ổn định → **gọi API trực tiếp**. Việc dài, cần chuyển toàn bộ ngữ cảnh → **agent handoff**.',
        },
        {
          type: 'table',
          headers: ['Cơ chế', 'Hợp khi'],
          rows: [
            ['**MCP**', 'Cần chuẩn chung, dùng được từ nhiều host / client tương thích'],
            ['**API trực tiếp**', 'Request–response đơn giản, latency thấp, API đã có sẵn và ổn định'],
            ['**Agent-to-agent handoff**', 'Tác vụ có trạng thái, kéo dài, cần chuyển trách nhiệm kèm ngữ cảnh'],
          ],
        },
        {
          type: 'example',
          scenario: 'Trợ lý cần **một** lời gọi stateless, latency thấp tới dịch vụ giá nội bộ đã có HTTP API ổn định.',
          right: '**Gọi thẳng endpoint hiện có** bằng credential có scope phù hợp.',
          wrong: ['Dựng MCP server có session lâu dài.', 'Tự viết lớp streaming riêng.', 'Đặt một agent trung gian.'],
          why: 'Mọi lớp thêm vào đều tăng độ phức tạp và độ trễ mà không giải quyết nhu cầu nào.',
        },
        { type: 'callout', tone: 'exam', title: 'Mẹo', text: 'Tiêu chí đúng khi chọn cơ chế: **tính di động giữa các client** và **vòng đời tương tác (stateless/stateful)**. Đáp án "chọn cái mới nhất" hay "chọn cái đội quen" là sai.' },
      ],
    },
    {
      id: 'claude-code-team-workflow',
      title: 'Đưa Claude Code vào quy trình của team',
      summary: 'Claude Code review PR và comment, người vẫn duyệt merge; tài liệu sinh ra phải đọc từ code thật và qua review; trước pilot phải chia rõ việc AI làm / việc người giữ và cấu hình project.',
      questionIds: [67, 84, 104],
      blocks: [
        {
          type: 'tldr',
          text: 'AI **hỗ trợ**, con người **quyết định**. Claude Code review PR và **đăng phân tích thành comment**, việc duyệt vẫn theo **branch protection** hiện có. Tài liệu sinh tự động phải **đọc code thật** qua filesystem / code search và đi qua **quy trình review bình thường**.',
        },
        {
          type: 'table',
          headers: ['Mục tiêu', 'Thiết kế đúng', 'Sai lầm hay gặp'],
          rows: [
            ['Review PR bằng AI, giữ quyền duyệt của người', 'Claude Code comment phân tích có cấu trúc; người duyệt theo branch protection', 'Cho AI tự approve / merge'],
            ['Tài liệu bám sát code', 'Subagent đọc file liên quan bằng filesystem + code search, viết docs, đẩy thay đổi qua review', 'Sinh docs từ mô tả chung chung, không đọc code'],
          ],
        },
        { type: 'h', text: 'Trước khi pilot với nhóm nhỏ' },
        {
          type: 'steps',
          items: [
            'Xác định **bước nào AI thêm giá trị** và **bước nào phải giữ quyền của người**.',
            'Cấu hình project: **MCP server**, **permission**, **subagent** và **context dự án lâu dài** (CLAUDE.md).',
            'Sau đó mới pilot, thu phản hồi, điều chỉnh.',
          ],
        },
      ],
    },
    {
      id: 'mcp-troubleshooting',
      title: 'Xử lý sự cố MCP server',
      summary: 'Server không hiện trong phiên → `claude mcp list` rồi reconnect; lỗi chỉ ở lần chạy đầu kèm hộp thoại quyền hệ thống → hành vi bình thường, ghi vào tài liệu onboarding.',
      questionIds: [8, 46],
      blocks: [
        {
          type: 'tldr',
          text: 'Chẩn đoán từ bước **ít xâm lấn nhất**. MCP server mới không xuất hiện → chạy **`claude mcp list`** để xem đã đăng ký chưa và trạng thái kết nối, rồi **khởi động lại phiên** (thay đổi cấu hình thường cần restart). Lỗi chỉ xảy ra lần đầu kèm hộp thoại xin quyền của hệ điều hành → đó là bước cấp quyền, **ghi vào hướng dẫn onboarding**.',
        },
        {
          type: 'table',
          headers: ['Triệu chứng', 'Cách xử lý'],
          rows: [
            ['MCP server mới thêm không thấy trong phiên Claude Code', '`claude mcp list` → kiểm tra trạng thái (connected / cần xác thực / không kết nối được) → reconnect phiên'],
            ['Lần chạy đầu lỗi, các lần sau chạy được; lần đầu có hộp thoại quyền hệ thống', 'Xác nhận là do cấp quyền lần đầu, ghi vào onboarding, kiểm tra các lần sau chạy ổn'],
          ],
        },
        { type: 'callout', tone: 'warn', title: 'Bẫy', text: 'Cài lại toàn bộ, xoá cấu hình hay đổi sang server khác ngay từ đầu là quá tay — chưa xác định được lỗi nằm ở đăng ký hay kết nối.' },
      ],
    },
  ],
}
