import type { TheoryDomain } from './types'

export const DOMAIN_2: TheoryDomain = {
  id: 'tools-mcp',
  number: 2,
  title: 'Thiết kế Tool & tích hợp MCP',
  weight: 18,
  summary: 'Mô tả và ranh giới tool, thiết kế kết quả/lỗi trả về, MCP (resources, scope, lỗi giao thức) và bộ công cụ tích hợp của Claude Code.',
  topics: [
    {
      id: 'tool-design-selection',
      title: 'Thiết kế tool: mô tả, ranh giới & số lượng',
      summary: 'Model chọn tool dựa vào mô tả; tách tool theo mục đích, gộp tool trùng nghĩa, tham số ràng buộc và thiết kế chống race condition.',
      questionIds: [15, 27, 46, 57, 96, 100, 102, 103, 104, 136, 140, 148, 153, 184, 192, 207],
      blocks: [
        { type: 'h', text: 'Mô tả tool là đòn bẩy chính để model chọn tool' },
        {
          type: 'p',
          text: 'Claude chọn tool dựa trên **tên + mô tả + schema** nó nhìn thấy. Nếu tool MCP chỉ có mô tả "Analyzes dependency graph" còn `Grep` có mô tả dài, cụ thể, model sẽ chọn Grep dù MCP tool phù hợp hơn (Q46/57). Sửa tận gốc: **viết mô tả chi tiết** — làm được gì, đầu vào/đầu ra, **khi nào nên dùng** (so với tool khác), **khi nào không**.',
        },
        {
          type: 'table',
          headers: ['Triệu chứng', 'Cách sửa đúng', 'Cách sửa kém'],
          rows: [
            ['Agent dùng `Grep`/`sed` thay vì tool MCP chuyên dụng (Q46/57)', 'Mô tả MCP tool chi tiết: khả năng, đầu ra, khi nào ưu việt hơn.', 'Bỏ Grep/Write (mất chức năng hợp lệ), pre-classifier định tuyến (thêm hệ thống phải bảo trì), chấp nhận hiện trạng.'],
            ['Gọi `delete_file` khi chính sách yêu cầu `archive_file` (Q104)', 'Mở rộng mô tả: use case + "**Do not use for backup files**".', 'Thêm bước xác nhận (không đổi việc chọn sai), few-shot theo từ khoá.'],
            ['Thiếu/sai tham số `user_id` (Q136)', 'Mô tả tham số rõ định dạng: `user_id: UUID của người dùng cần cập nhật (bắt buộc)`.', 'Tên tham số dài mã hoá định dạng, chỉ dựa vào JSON Schema.'],
          ],
        },
        { type: 'h', text: 'Tách tool theo mục đích, mỗi tool một hợp đồng vào/ra rõ ràng' },
        {
          type: 'list',
          items: [
            '**Một tool "vạn năng" nhận chỉ thị văn bản tự do** (`analyze_document(doc, instruction)`) → đầu ra không ổn định (35% phải hỏi lại). Tách thành `extract_data_points`, `summarize_content`, `verify_claim_against_source`, mỗi tool có hợp đồng vào/ra xác định (Q15/153/192). Thêm enum `analysis_type` hay mô tả kỹ vẫn giữ **một hợp đồng đầu ra lỏng**.',
            '**Một tool hợp nhất nhiều thao tác khác tham số** (`refund`, `cancel`, `reship` chung một tool) → agent bỏ sót hoặc thêm tham số thừa. Tách thành ba tool, mỗi tool chỉ có tham số của nó (Q100). JSON Schema `if-then-else` và object lồng nhau thay đổi theo loại phức tạp và kém tin cậy hơn.',
            '**`log_workout(exercise_type, value, measurement)`** dễ tạo tổ hợp sai (reps cho chạy bộ). Tách `log_cardio_workout` và `log_strength_workout`, mỗi cái có tham số riêng (Q103) — **loại bỏ lỗi từ thiết kế** thay vì vá bằng validation.',
            '**`update_game_score(date, home, away)`**: nickname, định dạng ngày, trận đấu lại → thay bằng **`game_id` + tool `search_games`** (Q140). Enum tên đội + regex ngày chỉ vá triệu chứng.',
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Nguyên tắc: loại bỏ khả năng sai bằng thiết kế',
          text: 'Nếu có lựa chọn giữa "thiết kế để không thể sai" (tách tool, dùng ID, ràng buộc cấu trúc) và "dặn model cẩn thận" (mô tả dài, few-shot, cảnh báo), đề thường chọn **thiết kế**.',
        },
        { type: 'h', text: 'Số lượng tool & tool trùng nghĩa' },
        {
          type: 'p',
          text: 'Từ 4 lên 10 tool, độ chính xác tụt còn 71% vì các tool **chồng lấn ngữ nghĩa** (`issue_credit` vs `process_refund`, `check_delivery_status` vs `lookup_order`). Cách **loại bỏ cấu trúc** phần chồng lấn (Q184/207): **gộp** tool trùng nghĩa (ví dụ một `resolve_compensation`; gộp tra cứu giao hàng vào `lookup_order` với cờ `include_tracking`). Few-shot chỉ giảm lỗi, tool search/`defer_loading` giải quyết bài toán *nhiều tool* chứ không phải *tool trùng nghĩa*, và tách sang hai sub-agent không xoá được chồng lấn trong từng nhóm.',
        },
        {
          type: 'p',
          text: 'Với **50+ connector** (Q96): thiết kế `search_connectors` để **tự động thêm connector khớp vào tập tool khả dụng của agent** — connector ban đầu ẩn, được khám phá rồi tồn tại tiếp. Cách này vừa **ép** tìm trước khi dùng, vừa giữ danh sách tool gọn.',
        },
        { type: 'h', text: 'Thiết kế tránh race condition & mơ hồ' },
        {
          type: 'list',
          items: [
            '**Kiểm tra rồi đặt** bị chen ngang (15% "slot no longer available") → **gộp thành một tool nguyên tử** `find_and_book_appointment` trả về đặt chỗ đã xác nhận hoặc các phương án thay thế (Q102). Tool `hold_slot` thêm bước và trạng thái; retry qua prompt không sửa cấu trúc.',
            'Tool trả về "Found 3 documents: A, B, C" không hỗ trợ bước tiếp: hãy trả **dữ liệu có cấu trúc** (ID + metadata) để gọi tool kế tiếp (Q95/101).',
          ],
        },
      ],
    },
    {
      id: 'tool-results-errors',
      title: 'Kết quả tool, xử lý lỗi & phân trang',
      summary: 'isError, lỗi có cấu trúc (loại lỗi, retryable), tách lỗi tạm thời/vĩnh viễn, phân trang và đầu ra có cấu trúc đủ để hành động.',
      questionIds: [35, 40, 41, 92, 93, 94, 95, 97, 101, 133, 137, 139, 141, 185, 205, 206],
      blocks: [
        { type: 'h', text: 'Lỗi trả về cho agent phải "có thể hành động"' },
        {
          type: 'p',
          text: 'Trả `{"isError": true, "content": [{"type":"text","text":"Operation failed"}]}` cho mọi lỗi khiến agent không phân biệt được loại lỗi: khi thì thử lại 5+ lần cho đơn không tồn tại, khi thì escalate sớm vì mạng chập chờn, khi thì hỏi khách trong lúc lỗi là **thiếu quyền** (Q35/205/206). Tài liệu Anthropic: *"Write instructive error messages"* — nêu **chuyện gì xảy ra và Claude nên thử gì tiếp**.',
        },
        {
          type: 'code',
          caption: 'Lỗi có cấu trúc — nguồn thông tin quyết định cho agent',
          text: `{
  "isError": true,
  "content": [{
    "type": "text",
    "text": "{\\"errorCategory\\":\\"validation\\",\\"isRetryable\\":false,\\"description\\":\\"Order ORD-991 not found. Try get_customer to search by phone.\\"}"
  }]
}`,
        },
        {
          type: 'table',
          headers: ['Loại lỗi', 'Ví dụ', 'Hành vi mong muốn'],
          rows: [
            ['**Transient** (tạm thời)', '503, timeout, mạng', 'Retry tự động (ưu tiên **trong tool** với backoff); nếu lộ ra agent thì `isRetryable: true`.'],
            ['**Validation / vĩnh viễn nghiệp vụ**', 'Order không tồn tại, quá hạn 30 ngày, đã hoàn tiền, cú pháp filter sai', '**Không retry.** Trả `retryable: false` kèm giải thích thân thiện để agent trả lời khách hoặc thử tool khác.'],
            ['**Permission**', '403', 'Không retry, không hỏi khách; escalate hoặc dùng đường khác.'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Phân chia trách nhiệm (Q41/97/133/137)',
          text: 'Lỗi **tạm thời** → retry tự động **bên trong tool**. Lỗi **vĩnh viễn/nghiệp vụ** → trả ngay cho agent với **mô tả cụ thể + cờ `retryable`**. Đừng: retry mọi lỗi (che khuất phân biệt), trả thông báo chung "try again later", thêm few-shot để model **đoán** loại lỗi từ chuỗi text, hay thêm tool `analyze_error` (một vòng thừa cho thứ tool đã biết).',
        },
        { type: 'h', text: 'Đừng trả kết quả rỗng khi thực ra là lỗi' },
        {
          type: 'p',
          text: 'Backend lỗi mà tool trả về danh sách rỗng "cho đỡ rối" khiến agent tưởng **không có dữ liệu** — nhầm lẫn còn tệ hơn (Q40/93). Đúng: đưa thông báo lỗi vào `content` của tool result và đặt `isError: true`. Ném exception bên trong handler làm gãy giao thức và không cho model gì để suy luận; trường `status` tự chế mỗi tool một kiểu thì model không có chuẩn để hiểu.',
        },
        { type: 'h', text: 'Lỗi giao thức vs. lỗi thực thi tool (MCP)' },
        {
          type: 'table',
          headers: ['Tình huống với `check_availability`', 'Cách báo'],
          rows: [
            ['(1) Thiếu tham số bắt buộc `user_email` — **request sai cấu trúc**', '**Lỗi giao thức JSON-RPC** (invalid params).'],
            ['(2) Calendar API trả 404: người dùng không tồn tại', '**Kết quả tool** với `isError: true` — lỗi nghiệp vụ model cần thấy và xử lý.'],
            ['(3) Calendar API trả 503', '**Kết quả tool** với `isError: true` (kèm chỉ dẫn có thể thử lại).'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Quy tắc nhớ',
          text: '**Sai giao thức** (request không hợp lệ) → JSON-RPC error. **Sai khi thực thi** (dịch vụ lỗi, không tìm thấy) → `isError: true` trong tool result để **Claude nhìn thấy và suy luận**.',
        },
        { type: 'h', text: 'Phân trang & khối lượng dữ liệu' },
        {
          type: 'p',
          text: 'Truy vấn khớp 200+ sản phẩm, tự lấy hết mọi trang gây trễ 15–20 giây (Q92). Thiết kế đúng: **trả trang đầu + tổng số kết quả khớp + con trỏ (cursor)** cho trang sau — agent tự quyết định có lấy thêm không. Tham số `max_pages` cố định, chỉ trả top-50 theo relevance (mất kết quả) hay tách thêm tool `fetch_more` đều kém hơn.',
        },
        { type: 'h', text: 'Đầu ra có cấu trúc, đủ thông tin để người dùng hiểu & agent hành động' },
        {
          type: 'list',
          items: [
            'Lợi ích chính của JSON có trường xác định (Q101): agent **trích giá trị cụ thể đáng tin cậy** mà không phải phân tích văn bản tự do. Không phải vì tiết kiệm token, không phải "xử lý xác định", cũng không tự xác thực dữ liệu.',
            'Tool cấp phát tài nguyên chỉ trả "OK" khiến người dùng phê duyệt mà không hiểu (Q141). Trả về **cấu trúc gồm chi phí ước tính, dự án đích, thông số, tóm tắt tác động**.',
            'Tool trích hoá đơn bằng ML (Q139): trả các trường + confidence **cộng thêm `requires_review` (đã tính từ ngưỡng đã kiểm chứng) và mảng `review_reasons`** — agent không phải tự diễn giải điểm thô.',
          ],
        },
      ],
    },
    {
      id: 'mcp',
      title: 'MCP: servers, resources & phạm vi cấu hình',
      summary: 'Dùng MCP server có sẵn cho dịch vụ chuẩn, resources để khai báo catalog, scope .mcp.json vs ~/.claude.json, và cách tool từ nhiều server cùng khả dụng.',
      questionIds: [24, 26, 46, 57, 172, 203],
      blocks: [
        { type: 'h', text: 'Ba primitive của MCP' },
        {
          type: 'table',
          headers: ['Primitive', 'Ai điều khiển', 'Dùng để'],
          rows: [
            ['**Tools**', 'Model', 'Hành động/truy vấn model chủ động gọi (`search_issues`, `run_query`).'],
            ['**Resources**', 'Ứng dụng', 'Dữ liệu ngữ cảnh có thể duyệt/đọc (catalog, schema, cây tài liệu) — không cần "gọi tool thăm dò".'],
            ['**Prompts**', 'Người dùng', 'Mẫu prompt có tham số tái sử dụng.'],
          ],
        },
        { type: 'h', text: 'Khi agent gọi 8–10 tool tuần tự chỉ để "khám phá"' },
        {
          type: 'p',
          text: 'Ba server (issue tracker, wiki, database) và câu hỏi liên hệ thống "bảng nào bị ảnh hưởng bởi refactor auth ở PROJ-1234?" khiến agent gọi 8–10 lần, tốn ngữ cảnh vì **không biết mỗi server chứa gì** (Q26). Giải pháp gốc MCP: **hiển thị catalog nội dung mỗi server dưới dạng resources** — tóm tắt issue, cây tài liệu, schema DB — để agent nhìn thấy trước khi hành động.',
        },
        {
          type: 'list',
          items: [
            'Gộp ba server thành một monolith: đi ngược thiết kế composable của MCP.',
            'Thêm tool `prepare_investigation` cho mỗi server: chỉ thêm tool, không tận dụng khả năng MCP.',
            'Orchestrator định tuyến bằng từ khoá tới **một** server: làm hỏng câu hỏi xuyên hệ thống.',
          ],
        },
        { type: 'h', text: 'Tích hợp dịch vụ chuẩn (Jira, GitHub…)' },
        {
          type: 'p',
          text: 'Với dữ liệu dịch vụ bên thứ ba phổ biến (Q24), **tích hợp một MCP server có sẵn**: tool dạng typed, có thể khám phá, xác thực được quản lý sẵn. Tự viết MCP server chỉ khi thật sự có nhu cầu riêng; xuất tài liệu ra markdown thì lỗi thời; `curl` + header xác thực inline thì giòn và lộ thông tin.',
        },
        { type: 'h', text: 'Nhiều server cùng lúc' },
        {
          type: 'p',
          text: 'Tool của **tất cả** MCP server được cấu hình đều được **khám phá lúc kết nối và khả dụng đồng thời** (Q203). Agent không phải chọn server theo từng lượt hay truy vấn tuần tự tới từng server; yêu cầu "tạo branch cho JIRA-123 và thêm link tài liệu vào ticket" dùng tool từ git, Jira, docs ngay trong một luồng.',
        },
        { type: 'h', text: 'Phạm vi cấu hình MCP trong Claude Code' },
        {
          type: 'table',
          headers: ['Mục đích', 'Vị trí', 'Ghi chú'],
          rows: [
            ['Server **dùng chung cho cả team**', '`.mcp.json` ở gốc dự án (commit vào git)', 'Mọi thành viên đều nhận cấu hình.'],
            ['Server **thử nghiệm riêng của bạn**', '`~/.claude.json` (user/local scope)', 'Không ảnh hưởng đồng đội.'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Đề Q172',
          text: 'Venue server dùng chung → `.mcp.json`; music playlist thử nghiệm cá nhân → `~/.claude.json`. Đáp án đảo ngược hay đặt cả hai vào cùng một nơi là sai.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Mô tả tool MCP quyết định adoption',
          text: 'Server khoẻ, `tools/list` thấy đủ tool, nhưng agent vẫn dùng Grep/sed thay vì tool MCP → nguyên nhân là **mô tả tool nghèo nàn**, không phải kết nối (xem chủ đề "Thiết kế tool").',
        },
      ],
    },
    {
      id: 'builtin-tools-exploration',
      title: 'Công cụ tích hợp & chiến lược khám phá codebase',
      summary: 'Grep (nội dung), Glob (tên file), Read/Edit/Write, Bash — dùng công cụ nào cho việc nào và cách lần theo mã hiệu quả.',
      questionIds: [23, 25, 47, 50, 56, 58, 59, 160, 161, 166, 202],
      blocks: [
        { type: 'h', text: 'Chọn đúng công cụ' },
        {
          type: 'table',
          headers: ['Việc cần làm', 'Công cụ', 'Vì sao'],
          rows: [
            ['Tìm mọi chỗ gọi `eval(` / import `@company/auth` / chuỗi lỗi `SYNC_CONFLICT` (Q23/25/160/202)', '**Grep**', 'Tìm **nội dung** file (ripgrep). Glob và `ls -R | grep` chỉ khớp **tên**.'],
            ['Tìm file theo tên/đường dẫn (`**/*.test.ts`)', '**Glob**', 'Khớp đường dẫn, không đọc nội dung.'],
            ['Đọc một file', '**Read**', 'Sau khi đã xác định mục tiêu.'],
            ['Sửa đoạn có văn bản **duy nhất**', '**Edit**', '`old_string` phải khớp duy nhất.'],
            ['Chèn vào file lặp lại nhiều chỗ giống nhau (Q58/166)', '**Read → sửa trong bộ nhớ → Write** toàn bộ file', 'Edit không thể tìm chuỗi duy nhất; `replace_all` phá mọi chỗ khớp; nối cuối file sai vị trí; `old_string` 30+ dòng giòn.'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Grep vs Glob',
          text: 'Câu hỏi "tìm nơi dùng/chuỗi/pattern trong nội dung" → **Grep**. "Tìm file có tên..." → **Glob**. Đọc entry file và lần theo import không có khả năng mở rộng và không đảm bảo phủ.',
        },
        { type: 'h', text: 'Tìm mọi nơi gọi một hàm có nhiều tên (alias)' },
        {
          type: 'p',
          text: 'Hàm `calculateTax` trong thư viện được module `orders` re-export là `computeOrderTax` (Q47). Grep mỗi tên gốc sẽ **bỏ sót**. Cách đáng tin: **đọc thư viện và các wrapper để liệt kê mọi tên được phơi ra**, rồi **Grep từng tên** trong toàn codebase. Tìm trong tài liệu (có thể lỗi thời) hoặc đọc từng file import (rất tốn công) đều kém.',
        },
        { type: 'h', text: 'Xây dựng hiểu biết tăng dần, trong giới hạn ngữ cảnh' },
        {
          type: 'list',
          items: [
            '**Từ điểm vào, lần theo mã** (Q59): Grep các entry point xác thực (login, verify token, middleware) → đọc → **đi theo import và lời gọi** để dựng luồng dần dần. Không đọc tất cả file chứa "auth/login/token" (nhiễu), không bắt người mới ("mới vào team") chỉ ra 10–15 file quan trọng.',
            '**Từ lớp cơ sở** (Q50/161): với hệ thống cache 15 file (~8.000 dòng), phân tích import/phân cấp lớp để xác định **base cache class**, đọc nó để hiểu **interface**, rồi lần theo các cài đặt invalidation cụ thể. Đọc tuần tự cả 15 file (phí ngữ cảnh), ưu tiên theo kích thước (tuỳ tiện), hay chỉ đọc các dòng chứa "invalidate/expire" (rời rạc) đều kém.',
            '**Adaptive** khi debug (Q56): mỗi file vừa đọc thay đổi bước hữu ích tiếp theo; dựa vào bằng chứng, không dựng kế hoạch mù hay một chuỗi bước cố định.',
          ],
        },
      ],
    },
  ],
}
