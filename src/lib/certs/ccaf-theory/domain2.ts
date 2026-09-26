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
      summary: 'Claude chọn tool chỉ dựa vào tên và mô tả: viết mô tả rõ, mỗi tool một việc, gộp tool trùng nghĩa, thiết kế để không thể dùng sai.',
      questionIds: [15, 27, 46, 57, 96, 100, 102, 103, 104, 136, 140, 148, 153, 184, 192, 207],
      blocks: [
        {
          type: 'tldr',
          text: 'Claude **không nhìn thấy code** của tool — nó chỉ đọc **tên, mô tả và danh sách parameter** để chọn tool nào. Vì vậy: viết mô tả thật rõ, mỗi tool chỉ làm **một việc** với parameter riêng, gộp các tool trùng nghĩa, và **thiết kế sao cho không thể dùng sai** thay vì dặn model cẩn thận.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Tool description', meaning: 'Đoạn chữ giải thích tool làm gì, khi nào dùng — thứ duy nhất giúp model chọn đúng.' },
            { term: 'Schema', meaning: 'Khai báo các parameter của tool: tên, kiểu dữ liệu, bắt buộc hay không.' },
            { term: 'Input/output contract', meaning: 'Cam kết rõ ràng: đưa vào gì thì nhận ra gì, luôn đúng một dạng.' },
            { term: 'Atomic', meaning: 'Làm trọn trong một lần, không thể bị chen ngang giữa chừng.' },
            { term: 'Race condition', meaning: 'Hai việc chạy chen nhau làm kết quả sai (vd. vừa kiểm tra còn chỗ thì người khác đã đặt mất).' },
          ],
        },

        { type: 'h', text: '1. Tool description quyết định model chọn tool nào' },
        {
          type: 'p',
          text: 'Giống thực đơn nhà hàng: món ghi "Món đặc biệt" thì ít ai gọi; món ghi rõ "Bò lúc lắc, khoai tây chiên, hợp ăn tối" thì dễ chọn. Mô tả tốt nêu: **làm được gì**, input/output, **khi nào nên dùng** (so với tool khác) và **khi nào không**.',
        },
        {
          type: 'table',
          headers: ['Triệu chứng', 'Cách sửa đúng', 'Cách sửa kém'],
          rows: [
            ['Agent dùng `Grep`/`sed` thay vì tool MCP chuyên dụng (mô tả chỉ có "Analyzes dependency graph")', 'Viết lại tool description MCP chi tiết: khả năng, output, khi nào tốt hơn Grep.', 'Bỏ Grep/Write (mất chức năng hợp lệ); thêm bộ phân loại routing (thêm thứ phải bảo trì); chấp nhận hiện trạng.'],
            ['Gọi `delete_file` trong khi chính sách yêu cầu `archive_file`', 'Mở rộng mô tả: các trường hợp dùng + "**Do not use for backup files**".', 'Thêm bước xác nhận (không sửa việc chọn sai); few-shot theo từ khoá.'],
            ['Truyền thiếu hoặc sai `user_id`', 'Mô tả parameter rõ: `user_id: UUID của người dùng cần cập nhật (bắt buộc)`.', 'Đặt tên parameter thật dài; chỉ dựa vào JSON Schema.'],
          ],
        },

        { type: 'h', text: '2. Mỗi tool một việc, parameter riêng' },
        {
          type: 'p',
          text: 'Tool "đa năng" giống cái điều khiển có 80 nút — dễ bấm nhầm. Tách thành nhiều tool nhỏ, mỗi tool chỉ có đúng parameter của nó:',
        },
        {
          type: 'table',
          headers: ['Thiết kế dễ sai', 'Vấn đề', 'Thiết kế tốt'],
          rows: [
            ['`analyze_document(doc, instruction)` nhận chỉ thị tự do', 'Output lúc thế này lúc thế khác (35% phải hỏi lại).', '`extract_data_points`, `summarize_content`, `verify_claim_against_source` — mỗi tool một dạng output cố định.'],
            ['Một tool chung cho `refund` / `cancel` / `reship`', 'Agent quên parameter cần hoặc thêm parameter thừa.', 'Ba tool riêng, mỗi tool chỉ có parameter của nó.'],
            ['`log_workout(exercise_type, value, measurement)`', 'Dễ ghi tổ hợp vô lý (số "reps" cho chạy bộ).', '`log_cardio_workout` và `log_strength_workout`.'],
            ['`update_game_score(date, home, away)`', 'Biệt danh đội, định dạng ngày, trận đá lại…', 'Dùng **`game_id`** + tool `search_games` để tìm ID trước.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Các cách "vá" không tận gốc',
          text: 'Thêm enum `analysis_type` hay viết mô tả thật dài → vẫn là **một** tool với output lỏng. JSON Schema `if-then-else`, object lồng nhau đổi theo loại → phức tạp, kém tin cậy. Enum tên đội + regex ngày → chỉ vá triệu chứng.',
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Nguyên tắc: làm cho không thể sai',
          text: 'Khi phải chọn giữa **thiết kế để không thể sai** (tách tool, dùng ID, ràng buộc cấu trúc) và **dặn model cẩn thận** (mô tả dài, few-shot, cảnh báo) → đề thường chọn **thiết kế**.',
        },

        { type: 'h', text: '3. Quá nhiều tool, hoặc tool trùng nghĩa' },
        {
          type: 'example',
          scenario: 'Tăng từ 4 lên 10 tool, accuracy chọn tool tụt còn 71%. Có các cặp như `issue_credit` / `process_refund`, `check_delivery_status` / `lookup_order`.',
          right: '**Gộp** các tool trùng nghĩa: vd. một tool `resolve_compensation`; gộp tra cứu giao hàng vào `lookup_order` với cờ `include_tracking`.',
          wrong: [
            'Thêm few-shot — chỉ giảm lỗi, không xoá chỗ overlap.',
            'Tool search / `defer_loading` — giải bài toán *quá nhiều* tool, không phải tool *trùng nghĩa*.',
            'Chia cho hai sub-agent — trong mỗi nhóm vẫn còn overlap.',
          ],
          why: 'Hai tool cùng làm gần giống nhau thì model phải đoán. Xoá chỗ overlap khỏi thiết kế là hết đoán.',
        },
        {
          type: 'p',
          text: 'Có **50+ connector**? Làm tool `search_connectors`: tìm thấy connector nào khớp thì **tự thêm vào bộ tool của agent** (ban đầu ẩn, tìm ra rồi thì giữ lại). Vừa buộc agent tìm trước khi dùng, vừa giữ danh sách tool gọn.',
        },

        { type: 'h', text: '4. Tránh bị chen ngang và kết quả mơ hồ' },
        {
          type: 'example',
          scenario: 'Agent gọi `check_slot` thấy còn chỗ, rồi gọi `book_slot` — nhưng 15% lần báo "slot no longer available" vì người khác đặt mất ở giữa.',
          right: 'Gộp thành **một tool atomic** `find_and_book_appointment`: trả về lịch đã đặt thành công, hoặc các lựa chọn thay thế.',
          wrong: ['Thêm tool `hold_slot` — thêm bước và thêm trạng thái phải quản lý.', 'Dặn trong prompt "nếu hết chỗ thì retry" — không sửa được cấu trúc.'],
          why: 'Kiểm tra và đặt trong cùng một bước thì không còn khe hở để bị chen ngang.',
        },
        {
          type: 'p',
          text: 'Tool trả về câu "Found 3 documents: A, B, C" thì agent khó làm bước tiếp. Hãy trả **structured data** (ID + thông tin đi kèm) để gọi tool kế tiếp được ngay.',
        },
      ],
    },
    {
      id: 'tool-results-errors',
      title: 'Tool result, xử lý lỗi & phân trang',
      summary: 'Báo lỗi sao cho agent biết làm gì tiếp: lỗi tạm thời hay vĩnh viễn, có nên retry; pagination và trả kết quả đủ để hành động.',
      questionIds: [35, 40, 41, 92, 93, 94, 95, 97, 101, 133, 137, 139, 141, 185, 205, 206],
      blocks: [
        {
          type: 'tldr',
          text: 'Khi tool lỗi, agent chỉ biết đúng những gì tool báo lại. Báo chung chung "Operation failed" thì agent **đoán mò**: retry mãi thứ không bao giờ thành, hoặc bỏ cuộc vì lỗi mạng thoáng qua. Hãy báo **loại lỗi**, **có nên retry không** và **nên làm gì tiếp**. Lỗi tạm thời thì để tool tự retry; lỗi vĩnh viễn thì báo ngay cho agent.',
        },
        {
          type: 'terms',
          items: [
            { term: '`isError: true`', meaning: 'Cờ trong tool result báo cho Claude biết "lần gọi này bị lỗi".' },
            { term: 'Transient error', meaning: 'Lỗi tự hết sau một lúc: mạng chập chờn, 503, timeout. Retry là được.' },
            { term: 'Validation / business error', meaning: 'Lỗi vĩnh viễn: đơn không tồn tại, quá hạn 30 ngày, đã hoàn tiền. Retry vô ích.' },
            { term: 'Backoff', meaning: 'Retry có giãn cách, mỗi lần chờ lâu hơn một chút.' },
            { term: 'Cursor', meaning: 'Mã đánh dấu "đang ở trang nào" để lấy trang kết quả tiếp theo.' },
            { term: 'JSON-RPC', meaning: 'Giao thức MCP dùng để gửi yêu cầu/phản hồi giữa client và server.' },
          ],
        },

        { type: 'h', text: '1. Báo lỗi sao cho agent biết làm gì tiếp' },
        {
          type: 'p',
          text: 'Giống cây ATM: màn hình ghi "Giao dịch thất bại" thì bạn không biết nên retry, đổi thẻ hay gọi ngân hàng. Ghi "Số dư không đủ" hay "Mất kết nối, retry sau 1 phút" thì biết ngay phải làm gì. Nguyên tắc của Anthropic: *viết thông báo lỗi có tính hướng dẫn* — nói **chuyện gì xảy ra** và **Claude nên thử gì tiếp**.',
        },
        {
          type: 'code',
          caption: 'Lỗi có cấu trúc: có loại lỗi, có cờ retry, có gợi ý bước tiếp theo',
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
          headers: ['Loại lỗi', 'Ví dụ', 'Nên xử lý thế nào'],
          rows: [
            ['**Transient**', '503, timeout, mạng', 'Tự retry **ngay trong tool** (có backoff). Nếu vẫn phải báo cho agent thì ghi `isRetryable: true`.'],
            ['**Permanent / business**', 'Đơn không tồn tại, quá hạn, đã hoàn tiền, cú pháp lọc sai', '**Không retry.** Trả `retryable: false` + giải thích dễ hiểu để agent trả lời khách hoặc dùng tool khác.'],
            ['**Permission**', '403', 'Không retry, không hỏi khách; escalate hoặc đi đường khác.'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Ai lo phần nào',
          text: 'Lỗi **tạm thời** → tool **tự retry** bên trong. Lỗi **vĩnh viễn** → báo **ngay** cho agent kèm mô tả cụ thể + cờ `retryable`. **Bẫy**: retry mọi lỗi; trả câu chung "try again later"; thêm few-shot để model **đoán** loại lỗi từ chữ; thêm tool `analyze_error` (một vòng thừa cho điều tool đã biết).',
        },

        { type: 'h', text: '2. Đừng giả vờ "không có kết quả" khi thực ra là lỗi' },
        {
          type: 'example',
          scenario: 'Backend bị lỗi, tool trả về danh sách rỗng `[]` cho "đỡ rối".',
          right: 'Đưa thông báo lỗi vào `content` của tool result và đặt **`isError: true`**.',
          wrong: [
            'Trả danh sách rỗng — agent tưởng **thật sự không có dữ liệu** và trả lời sai cho khách.',
            'Ném exception trong handler — làm gãy giao thức, model không có gì để suy luận.',
            'Tự chế trường `status` riêng cho từng tool — model không có chuẩn chung để hiểu.',
          ],
          why: '"Không có dữ liệu" và "không lấy được dữ liệu" là hai chuyện khác nhau; nhầm lẫn còn tệ hơn báo lỗi.',
        },

        { type: 'h', text: '3. Lỗi giao thức hay lỗi khi chạy tool? (MCP)' },
        {
          type: 'p',
          text: 'Phân biệt như gửi thư: **ghi sai địa chỉ** thì bưu điện trả lại ngay (lỗi giao thức); **thư tới nơi nhưng người nhận đã chuyển nhà** thì đó là chuyện người đọc thư cần biết (lỗi thực thi).',
        },
        {
          type: 'table',
          headers: ['Tình huống với tool `check_availability`', 'Báo lỗi kiểu gì'],
          rows: [
            ['Thiếu parameter bắt buộc `user_email` — **yêu cầu sai cấu trúc**', '**Lỗi giao thức JSON-RPC** (invalid params).'],
            ['Calendar API trả 404: người dùng không tồn tại', '**Tool result** với `isError: true` — lỗi nghiệp vụ Claude cần thấy để xử lý.'],
            ['Calendar API trả 503', '**Tool result** với `isError: true`, kèm gợi ý có thể retry.'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Quy tắc nhớ',
          text: '**Yêu cầu không hợp lệ** → lỗi JSON-RPC. **Chạy rồi mới lỗi** (dịch vụ hỏng, không tìm thấy) → `isError: true` trong tool result để **Claude nhìn thấy và suy luận**.',
        },

        { type: 'h', text: '4. Nhiều kết quả: pagination' },
        {
          type: 'example',
          scenario: 'Truy vấn khớp 200+ sản phẩm; tool tự lấy hết mọi trang nên chậm 15–20 giây.',
          right: 'Trả **trang đầu + tổng số kết quả + cursor** cho trang sau. Agent tự quyết có cần lấy thêm không.',
          wrong: ['Parameter `max_pages` cố định.', 'Chỉ trả top-50 theo độ liên quan — mất kết quả.', 'Tách thêm tool `fetch_more` riêng.'],
          why: 'Agent biết tổng quan (có bao nhiêu) mà không phải chờ tải hết.',
        },

        { type: 'h', text: '5. Tool result phải đủ để hiểu và hành động' },
        {
          type: 'list',
          items: [
            'Lợi ích chính của JSON có trường rõ ràng: agent **lấy đúng giá trị cần một cách đáng tin**, không phải đọc hiểu văn bản tự do. (Không phải vì tiết kiệm token, không phải vì "tự xác thực dữ liệu".)',
            'Tool cấp phát tài nguyên chỉ trả "OK" → người dùng bấm duyệt mà không hiểu gì. Hãy trả **chi phí ước tính, dự án đích, cấu hình, tóm tắt tác động**.',
            'Tool đọc hoá đơn bằng ML: trả các trường + confidence, **kèm `requires_review`** (đã tính sẵn từ ngưỡng đã kiểm chứng) và **`review_reasons`** — agent không phải tự diễn giải điểm số thô.',
          ],
        },
      ],
    },
    {
      id: 'mcp',
      title: 'MCP: servers, resources & phạm vi cấu hình',
      summary: 'MCP là cổng nối Claude với hệ thống ngoài: tools, resources, prompts; dùng server có sẵn; cấu hình cho team hay cho riêng bạn.',
      questionIds: [24, 26, 46, 57, 172, 203],
      blocks: [
        {
          type: 'tldr',
          text: '**MCP** (Model Context Protocol) là "cổng cắm chuẩn" để nối Claude với hệ thống bên ngoài (Jira, GitHub, database…). Mỗi **MCP server** cung cấp tool, dữ liệu để đọc (resources) và mẫu prompt. Dịch vụ phổ biến thì **dùng server có sẵn**; server dùng chung cho team thì cấu hình trong `.mcp.json`, server thử riêng thì để trong `~/.claude.json`.',
        },
        {
          type: 'terms',
          items: [
            { term: 'MCP server', meaning: 'Chương trình "phiên dịch" giữa Claude và một hệ thống (vd. Jira), cung cấp tool và dữ liệu cho Claude.' },
            { term: 'Tools', meaning: 'Hành động **model chủ động gọi**: `search_issues`, `run_query`…' },
            { term: 'Resources', meaning: 'Dữ liệu để **đọc sẵn** (danh mục, schema, cây tài liệu) — không cần gọi tool dò dẫm.' },
            { term: 'Prompts', meaning: 'Mẫu prompt có parameter, do **người dùng** chọn dùng lại.' },
            { term: 'Scope', meaning: 'Cấu hình áp dụng cho ai: cả team (theo dự án) hay chỉ riêng bạn.' },
          ],
        },

        { type: 'h', text: '1. Ba thứ một MCP server cung cấp' },
        {
          type: 'table',
          headers: ['Loại', 'Ai quyết định dùng', 'Để làm gì'],
          rows: [
            ['**Tools**', 'Model', 'Hành động/truy vấn model chủ động gọi (`search_issues`, `run_query`).'],
            ['**Resources**', 'Ứng dụng', 'Dữ liệu context để xem trước: danh mục, schema, cây tài liệu.'],
            ['**Prompts**', 'Người dùng', 'Mẫu prompt có parameter, dùng lại được.'],
          ],
        },

        { type: 'h', text: '2. Agent gọi 8–10 tool chỉ để "dò đường"' },
        {
          type: 'p',
          text: 'Giống vào thư viện không có mục lục: phải đi từng kệ mới biết sách nằm đâu. Nếu có **mục lục** thì nhìn một lần là biết.',
        },
        {
          type: 'example',
          scenario: 'Có 3 server (issue tracker, wiki, database). Câu hỏi: "Refactor auth ở PROJ-1234 ảnh hưởng những bảng nào?" Agent gọi 8–10 tool lần lượt, tốn context vì **không biết server nào chứa gì**.',
          right: 'Cho mỗi server **đưa danh mục nội dung ra dưới dạng resources** (tóm tắt issue, cây tài liệu, schema DB) để agent nhìn thấy trước khi hành động.',
          wrong: [
            'Gộp 3 server thành một khối lớn — đi ngược thiết kế ghép-nối-từng-mảnh của MCP.',
            'Thêm tool `prepare_investigation` cho mỗi server — chỉ thêm tool, không dùng đúng khả năng của MCP.',
            'Cho bộ điều phối routing theo từ khoá tới **một** server — hỏng với câu hỏi cần nhiều hệ thống.',
          ],
          why: 'Resources chính là "mục lục" mà MCP thiết kế sẵn cho việc này.',
        },

        { type: 'h', text: '3. Dịch vụ phổ biến → dùng server có sẵn' },
        {
          type: 'p',
          text: 'Cần dữ liệu từ Jira, GitHub…? **Cài MCP server có sẵn**: tool có kiểu dữ liệu rõ, tự khám phá được, xác thực đã được lo sẵn. Chỉ tự viết server khi có nhu cầu thật sự riêng.',
        },
        {
          type: 'list',
          items: [
            'Xuất tài liệu ra file markdown → nhanh chóng lỗi thời.',
            'Gọi `curl` với header xác thực viết thẳng trong lệnh → dễ gãy và lộ thông tin bí mật.',
          ],
        },

        { type: 'h', text: '4. Nhiều server cùng lúc' },
        {
          type: 'p',
          text: 'Tool của **mọi** MCP server đã cấu hình đều được nạp **ngay khi kết nối** và **dùng được cùng lúc**. Agent không phải chọn server theo từng lượt. Ví dụ "tạo branch cho JIRA-123 rồi thêm link tài liệu vào ticket" dùng tool của git, Jira và docs trong cùng một luồng.',
        },

        { type: 'h', text: '5. Cấu hình ở đâu: cho team hay cho riêng bạn' },
        {
          type: 'table',
          headers: ['Mục đích', 'Đặt ở', 'Hệ quả'],
          rows: [
            ['Server **cả team dùng chung**', '`.mcp.json` ở gốc dự án (commit vào git)', 'Ai clone dự án cũng có.'],
            ['Server **bạn thử nghiệm riêng**', '`~/.claude.json` (phạm vi user/local)', 'Không ảnh hưởng đồng đội.'],
          ],
        },
        {
          type: 'example',
          scenario: 'Team dùng chung server "venue" (địa điểm). Bạn muốn thử một server "music playlist" cho riêng mình.',
          right: 'Venue → `.mcp.json`. Music playlist → `~/.claude.json`.',
          wrong: ['Đảo ngược hai vị trí.', 'Đặt cả hai cùng một chỗ.'],
          why: 'Thứ dùng chung phải theo dự án (vào git); thứ thử nghiệm cá nhân phải nằm ở máy bạn.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Server chạy tốt mà agent vẫn không dùng?',
          text: 'Kết nối ổn, `tools/list` thấy đủ tool, nhưng agent vẫn dùng Grep/sed → vấn đề là **tool description quá sơ sài**, không phải kết nối (xem chủ đề "Thiết kế tool").',
        },
      ],
    },
    {
      id: 'builtin-tools-exploration',
      title: 'Công cụ tích hợp & chiến lược khám phá codebase',
      summary: 'Grep tìm nội dung, Glob tìm tên file, Read/Edit/Write; cách tìm hiểu code lạ từ entry point hoặc base class.',
      questionIds: [23, 25, 47, 50, 56, 58, 59, 160, 161, 166, 202],
      blocks: [
        {
          type: 'tldr',
          text: 'Claude Code có sẵn bộ công cụ: **Grep** tìm theo **nội dung** bên trong file, **Glob** tìm theo **tên file**, **Read** đọc, **Edit** sửa một đoạn duy nhất, **Write** ghi đè cả file. Khi tìm hiểu code lạ: bắt đầu từ **entry point** hoặc **base class**, rồi lần theo import và lời gọi — không đọc tràn lan.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Grep', meaning: 'Tìm một chuỗi/mẫu **bên trong nội dung** các file (dùng ripgrep).' },
            { term: 'Glob', meaning: 'Tìm file theo **tên/đường dẫn**, vd. `**/*.test.ts`. Không đọc nội dung.' },
            { term: 'Edit', meaning: 'Thay một đoạn văn bản; `old_string` phải **xuất hiện đúng một lần** trong file.' },
            { term: 'Write', meaning: 'Ghi đè toàn bộ nội dung file.' },
            { term: 'Entry point', meaning: 'Nơi luồng xử lý bắt đầu: hàm login, middleware, route…' },
            { term: 'Re-export / alias', meaning: 'Một hàm được xuất lại dưới **tên khác** ở module khác.' },
          ],
        },

        { type: 'h', text: '1. Việc nào dùng công cụ nào' },
        {
          type: 'table',
          headers: ['Việc cần làm', 'Công cụ', 'Vì sao'],
          rows: [
            ['Tìm mọi chỗ gọi `eval(`, import `@company/auth`, hay chuỗi lỗi `SYNC_CONFLICT`', '**Grep**', 'Cần tìm **trong nội dung**. Glob và `ls -R | grep` chỉ khớp **tên file**.'],
            ['Tìm file theo tên (`**/*.test.ts`)', '**Glob**', 'Khớp đường dẫn, không cần đọc nội dung.'],
            ['Đọc một file', '**Read**', 'Sau khi đã biết cần đọc file nào.'],
            ['Sửa một đoạn **chỉ có một chỗ** như vậy', '**Edit**', '`old_string` phải khớp duy nhất.'],
            ['Chèn vào file có **nhiều đoạn giống hệt nhau**', '**Read → sửa trong bộ nhớ → Write** cả file', 'Edit không tìm được chuỗi duy nhất; `replace_all` sửa nhầm mọi chỗ; nối cuối file thì sai vị trí; `old_string` dài 30+ dòng thì dễ gãy.'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Grep hay Glob?',
          text: '"Tìm nơi dùng / chuỗi / mẫu **trong code**" → **Grep**. "Tìm **file có tên**…" → **Glob**. Đọc file input rồi lần từng import để tìm thì không mở rộng được và không đảm bảo tìm hết.',
        },

        { type: 'h', text: '2. Tìm mọi chỗ gọi một hàm có nhiều tên' },
        {
          type: 'example',
          scenario: 'Hàm `calculateTax` trong thư viện, nhưng module `orders` xuất lại nó dưới tên `computeOrderTax`. Cần tìm mọi nơi gọi hàm này.',
          right: '**Đọc thư viện và các lớp bọc** để liệt kê **mọi tên** mà hàm được xuất ra, rồi **Grep từng tên** trong cả codebase.',
          wrong: [
            'Chỉ Grep tên gốc `calculateTax` — **bỏ sót** chỗ dùng tên khác.',
            'Tra trong tài liệu — có thể đã lỗi thời.',
            'Mở đọc từng file có import — rất tốn công.',
          ],
          why: 'Grep chỉ tìm đúng chữ bạn đưa. Phải biết đủ các tên thì mới tìm đủ.',
        },

        { type: 'h', text: '3. Tìm hiểu code lạ từng bước, không đọc tràn lan' },
        {
          type: 'p',
          text: 'Giống tìm đường trong thành phố lạ: đừng đi hết mọi con phố — hãy bắt đầu từ một địa điểm chính rồi đi theo biển chỉ dẫn.',
        },
        {
          type: 'steps',
          items: [
            '**Grep entry point** của luồng cần hiểu (vd. với xác thực: login, verify token, middleware).',
            '**Đọc** các file đó.',
            '**Đi theo import và lời gọi hàm** để dựng dần bức tranh luồng xử lý.',
          ],
        },
        {
          type: 'example',
          scenario: 'Cần hiểu một hệ thống cache gồm 15 file (~8.000 dòng) để sửa cơ chế invalidation.',
          right: 'Phân tích import và cây kế thừa để tìm **base cache class** → đọc nó để hiểu **interface** → lần theo các cài đặt invalidation cụ thể.',
          wrong: [
            'Đọc lần lượt cả 15 file — phí context.',
            'Đọc theo thứ tự file lớn nhất trước — tuỳ tiện.',
            'Chỉ đọc các dòng chứa "invalidate/expire" — rời rạc, thiếu bối cảnh.',
            'Đọc mọi file có chữ "auth/login/token", hoặc nhờ người mới vào team chỉ ra 10–15 file quan trọng.',
          ],
          why: 'Hiểu base class trước thì các lớp con chỉ còn là "biến thể" dễ theo dõi.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Khi debug: linh hoạt theo bằng chứng',
          text: 'Mỗi file vừa đọc sẽ thay đổi bước nên làm tiếp. Đi theo bằng chứng, đừng lập sẵn một chuỗi bước cố định hay blind planning.',
        },
      ],
    },
  ],
}
