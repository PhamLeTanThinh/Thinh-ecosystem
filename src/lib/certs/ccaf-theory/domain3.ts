import type { TheoryDomain } from './types'

export const DOMAIN_3: TheoryDomain = {
  id: 'claude-code',
  number: 3,
  title: 'Cấu hình & quy trình Claude Code',
  weight: 20,
  summary: 'CLAUDE.md, rules, skills, hooks; plan mode vs. thực thi trực tiếp; vòng lặp cải tiến; chạy không giao diện (CI) và thiết kế review tự động.',
  topics: [
    {
      id: 'claude-md-config',
      title: 'CLAUDE.md, rules, skills & hooks',
      summary: 'Đặt hướng dẫn đúng chỗ: CLAUDE.md, .claude/rules có path-scoping, @imports, skills chia sẻ qua git, và hook để đảm bảo tuân thủ.',
      questionIds: [44, 168, 173, 174, 176, 178, 179, 199],
      blocks: [
        { type: 'h', text: 'Bản đồ các nơi đặt cấu hình' },
        {
          type: 'table',
          headers: ['Cơ chế', 'Vị trí', 'Khi nào nạp / dùng'],
          rows: [
            ['CLAUDE.md **cá nhân**', '`~/.claude/CLAUDE.md`', 'Mọi dự án của bạn.'],
            ['CLAUDE.md **dự án**', '`./CLAUDE.md` (hoặc `.claude/CLAUDE.md`)', 'Nạp khi bắt đầu phiên; chia sẻ với team qua git.'],
            ['CLAUDE.md **thư mục con**', '`/terraform/CLAUDE.md`…', 'Nạp khi Claude làm việc với file trong thư mục đó.'],
            ['**Rules có phạm vi đường dẫn**', '`.claude/rules/*.md` + frontmatter `paths: ["terraform/**/*"]`', 'Chỉ nạp khi chỉnh file khớp đường dẫn → **tiết kiệm token**.'],
            ['**@imports**', '`@docs/standards/security-rules.md` trong CLAUDE.md', 'Nhúng file khác một cách module hoá.'],
            ['**Skills**', '`.claude/skills/<tên>/SKILL.md` (dự án) hoặc `~/.claude/skills/...` (cá nhân)', 'Gọi bằng `/tên` hoặc tự nạp khi phù hợp.'],
            ['**Hooks**', '`settings.json`: `PreToolUse`, `PostToolUse`, `Stop`…', 'Chạy **xác định** quanh mỗi tool call/sự kiện.'],
          ],
        },
        { type: 'h', text: 'Tình huống & đáp án chuẩn' },
        {
          type: 'table',
          headers: ['Bài toán', 'Giải pháp đúng'],
          rows: [
            ['Monorepo IaC: CLAUDE.md gốc 500+ dòng, quy tắc Terraform nạp cả khi sửa Kubernetes (Q173)', '**`.claude/rules/` với YAML frontmatter `paths`** — chỉ nạp khi chỉnh file khớp. Chia thư mục con CLAUDE.md chỉ theo thư mục, không theo loại file; `@import` vẫn nạp cả nội dung; đặt tiêu đề mục chỉ cải thiện đọc, không tiết kiệm token.'],
            ['Skill chuyển React → Vue cho **cả team**, đồng bộ khi cập nhật (Q174)', '**`.claude/skills/migrate-component/SKILL.md` ở gốc dự án, commit vào git** → mọi người có bản mới nhất khi pull.'],
            ['Monorepo 15 package, mỗi package cần **khác nhau** trong 3 bộ tiêu chuẩn; tên package không cho biết cái nào cần gì (Q179)', 'Trong CLAUDE.md từng package, **`@import` chỉ những file tiêu chuẩn liên quan** (dựa trên hiểu biết của maintainer). Rules `paths` liệt kê mọi package thì dễ lệch; gộp chung rồi "bỏ qua khi không liên quan" là dựa vào model.'],
            ['Tác vụ **một lần** cần theo mẫu của 3 module cụ thể (Q176)', '**`@references` tới 3 module trong prompt** — cho ví dụ mã cụ thể. Không cần đưa vào CLAUDE.md (tài liệu dự án lâu dài) vì đây là việc một lần; mô tả bằng lời kém chính xác hơn mã thật.'],
            ['Claude đôi khi làm theo quy ước `ApiError`, đôi khi không (Q178)', 'Bước chẩn đoán đầu tiên: chạy **`/memory`** xem file memory nào **thực sự được nạp**. (Thêm ví dụ, tìm xung đột ở `~/.claude`, viết rule mới là bước sau.)'],
            ['Test sinh ra kém giá trị: 55% chỉ kiểm tra "không throw", trùng test cũ, sai fixture (Q44/199)', '**Ghi tiêu chuẩn test vào CLAUDE.md**: tiêu chí test có giá trị, fixture có sẵn + mục đích, ví dụ test hành vi có ý nghĩa vs tầm thường. Sửa **nguyên nhân sinh ra**; lọc sau (coverage, chấm điểm lần hai) chỉ xử lý đầu ra.'],
          ],
        },
        { type: 'h', text: 'Hook để đảm bảo, CLAUDE.md để hướng dẫn' },
        {
          type: 'p',
          text: 'CLAUDE.md là **ngữ cảnh** — model *có thể* vi phạm (30% tệp sai định dạng, in đậm IMPORTANT giảm còn 15% vẫn chưa hết). Khi cần **100%** (Q168), dùng **hook `PostToolUse` với matcher `Edit|Write` tự chạy Prettier** trên mỗi file Claude vừa sửa. Skill chi tiết hơn, path-scoped rules, hay hook `Stop` dựa trên prompt vẫn để model phán đoán.',
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Quy tắc chung',
          text: '**Cần đảm bảo tuyệt đối → hook / cơ chế xác định.** Cần hướng dẫn phong cách/ngữ cảnh → CLAUDE.md, rules, skills. Cần tiết kiệm token theo loại file → rules có `paths`.',
        },
      ],
    },
    {
      id: 'plan-vs-direct-iteration',
      title: 'Plan mode vs. thực thi trực tiếp & vòng lặp cải tiến',
      summary: 'Khi nào lập kế hoạch, khi nào làm luôn; cách lặp hiệu quả: test trước, sửa từng vấn đề, phỏng vấn để lộ yêu cầu.',
      questionIds: [3, 60, 164, 167, 169, 170, 171, 175, 177],
      blocks: [
        { type: 'h', text: 'Quyết định: plan mode hay direct execution' },
        {
          type: 'table',
          headers: ['Tình huống', 'Chọn', 'Lý do'],
          rows: [
            ['Thêm **một điều kiện** kiểm tra ngày vào **một hàm** trong một file (Q167)', '**Direct execution**', 'Phạm vi nhỏ, rõ ràng. Plan mode/extended thinking là quá mức.'],
            ['Lỗi production, **stack trace chỉ đúng chỗ** (Q60/175)', '**Direct execution**', 'Đọc trace → đọc mã liên quan → sửa khi thấy nguyên nhân. Plan/khám phá kiến trúc là **over-exploration** và làm chậm xử lý sự cố.'],
            ['Nâng cấp thư viện auth v2 → v3, **45 file**, breaking changes nhiều loại (Q164)', '**Plan mode**', 'Phạm vi rộng, ảnh hưởng nhiều module: khám phá cách dùng, lập bản đồ đường mã bị ảnh hưởng, thiết kế chiến lược **rồi mới** triển khai.'],
            ['"Cải thiện xử lý lỗi toàn module" (Q3)', '**Quy trình nhiều pha** (analyze → propose → implement + review)', 'Đòi hỏi phán đoán.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Bẫy: cập nhật phụ thuộc rồi sửa từng lỗi test (Q164 – phương án C)',
          text: 'Không có phân tích cấu trúc, agent vá theo từng test hỏng, dễ bỏ sót mã không có test và không có chiến lược chung. Tạo slash command rồi chạy trên từng file **không khám phá** cũng bỏ qua ngữ cảnh từng module.',
        },
        { type: 'h', text: 'Vòng lặp cải tiến hiệu quả' },
        {
          type: 'list',
          items: [
            '**Test-driven** (Q171): với thuật toán phức tạp (đồ thị, edge case, hiệu năng) — **viết bộ test trước** (hành vi mong đợi, edge case, yêu cầu hiệu năng), nhờ Claude viết mã vượt test, rồi **đưa test thất bại** vào mỗi lượt tinh chỉnh. Tiến triển đo được, khách quan.',
            '**Đưa ví dụ cụ thể** (Q177): script migration xử lý sai giá trị null → cung cấp **test case có input chứa null + output mong đợi**, rồi yêu cầu sửa. Tốt hơn mô tả dài, tự tay sửa, hay "think harder".',
            '**Các vấn đề tương tác nhau thì sửa tuần tự** (Q169): độ rộng cột ↔ định dạng ngày ↔ ngắt trang: sửa **độ rộng cột trước** với số đo cụ thể, xác minh, rồi ngày, rồi ngắt trang — **kiểm tra sau mỗi thay đổi**. Gộp cả ba vào một tin nhắn hay làm lại từ đầu che mất quan hệ nhân quả.',
            '**Phỏng vấn để lộ yêu cầu bị bỏ sót** (Q170): người mới với caching production chỉ có ý tưởng "Redis + TTL 5 phút" → **nhờ Claude phỏng vấn bạn** trước khi triển khai (chiến lược invalidation, các tầng cache, consistency, failure mode). Bắt đầu tối thiểu rồi vá, hay để "TBD" chỉ hoạt động khi bạn biết mình không biết gì.',
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Từ khoá',
          text: '"Stack trace rõ ràng", "một hàm một file" → direct. "Nhiều file, nhiều module, không rõ ảnh hưởng" → plan. "Đầu ra sai cụ thể" → đưa test/ví dụ. "Chưa biết mình chưa biết" → để Claude phỏng vấn.',
        },
      ],
    },
    {
      id: 'ci-headless-review',
      title: 'Chạy không giao diện (CI) & thiết kế review tự động',
      summary: 'Cờ -p, --max-turns, --max-budget-usd, --append-system-prompt; review độc lập; cân bằng recall/precision, few-shot, tách prompt, chia nhỏ khi cắt output.',
      questionIds: [1, 43, 61, 75, 183, 186, 187, 188, 197, 198, 200, 201],
      blocks: [
        { type: 'h', text: 'Claude Code ở chế độ non-interactive' },
        {
          type: 'table',
          headers: ['Cờ', 'Tác dụng'],
          rows: [
            ['`-p` / `--print`', 'Chạy không tương tác, in kết quả rồi thoát (dùng trong CI).'],
            ['`--max-turns N`', '**Giới hạn số vòng agent** — do chính Claude Code thi hành.'],
            ['`--max-budget-usd X`', '**Giới hạn chi phí** mỗi lần gọi — cũng do Claude Code thi hành.'],
            ['`--append-system-prompt`', '**Thêm** hướng dẫn vào system prompt mặc định (giữ nguyên hướng dẫn dùng công cụ đọc file/điều hướng mã).'],
            ['`--system-prompt`', '**Thay thế hoàn toàn** system prompt mặc định.'],
            ['`--allowedTools`', 'Cho phép công cụ không cần hỏi.'],
            ['`--permission-mode dontAsk`', 'Từ chối tự động mọi quyền không được cho phép sẵn — quản lý **quyền**, không giới hạn vòng/chi phí.'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Hai đề kinh điển',
          text: '**Q43:** cần giới hạn số vòng lặp và số tiền **do Claude Code thi hành** → `--max-turns 10 --max-budget-usd 2.00`. `timeout-minutes` của GitHub Actions và theo dõi dashboard nằm ngoài Claude Code. **Q198:** review diff qua pipe nhưng Claude **không đọc file lân cận** → dùng **`--append-system-prompt`** thay vì `--system-prompt` (vì `--system-prompt` ghi đè hướng dẫn tích hợp về dùng công cụ). Nhúng diff vào chuỗi prompt hay đưa vào CLAUDE.md không giải quyết đúng cơ chế.',
        },
        { type: 'h', text: 'Vì sao review cùng phiên bỏ sót lỗi mà CI bắt được (Q200)' },
        {
          type: 'p',
          text: 'Claude **giữ lại lập luận trước đó** trong cùng phiên nên ít nghi ngờ quyết định của chính nó (thiên kiến tự xác nhận). Dùng **một phiên/instance review độc lập** (ví dụ CI với ngữ cảnh sạch) sẽ có góc nhìn mới. Không phải do CI thấy nhiều ngữ cảnh hơn, prompt CI cụ thể hơn, hay cửa sổ ngữ cảnh đầy.',
        },
        { type: 'h', text: 'Review thiếu lỗi thật: precision cao, recall thấp (Q61/187)' },
        {
          type: 'p',
          text: 'Prompt "chỉ báo cáo khi **chắc chắn**, ưu tiên không comment" khiến model làm theo **đúng nghĩa đen** → race condition gây sự cố production không được báo. Cách sửa: **tách hai giai đoạn**: (1) **finding** — mục tiêu là **độ phủ**, báo mọi vấn đề tiềm ẩn kèm siêu dữ liệu **confidence + severity**; (2) một giai đoạn riêng **lọc theo ngưỡng**. Giữ lệnh lọc tin cậy trong prompt vẫn kìm recall; chỉ lọc theo *danh mục* mà không có độ tin cậy/mức độ thì có thể chặn cả lỗi thật.',
        },
        { type: 'h', text: 'Giảm false positive & tăng chất lượng phát hiện' },
        {
          type: 'list',
          items: [
            '**Few-shot có chú thích** (Q183): ví dụ đoạn mã phân biệt **mẫu chấp nhận được vs vấn đề thật** trong từng nhóm → model **khái quát hoá** sang mẫu chưa gặp. Từ khoá lọc hậu xử lý, "hãy thận trọng" hay bản đặc tả dài chỉ dựa vào luật tường minh.',
            '**Thiếu nhánh chưa được test** (Q186): thêm **few-shot: mã có nhánh chưa phủ + comment chỉ đích danh test còn thiếu**. Đa lượt/enumerate nhánh thêm độ phức tạp không cần thiết.',
            '**Một prompt đa mục tiêu, thêm ví dụ logic làm tụt API design** (Q188/201): **tách thành các prompt tập trung** (bảo mật + API; business logic) với ví dụ riêng, rồi gộp kết quả. Model mạnh hơn, ngữ cảnh toàn repo hay checklist không loại bỏ được sự đánh đổi.',
            '**Lỗi xuyên file** (Q1): review chỉ nhận diff + file thay đổi sẽ bỏ sót caller ở file không đổi → chuyển thành **tác vụ agentic có giới hạn lượt**, để model đọc file/tìm kiếm codebase để xác minh. CoT không giúp với mã model không nhìn thấy; đồ thị phụ thuộc tĩnh làm phình ngữ cảnh mà vẫn bỏ sót tham chiếu động.',
            '**Output bị cắt giữa JSON** (Q197): PR 30+ file chạm `max_tokens` → **chia PR thành nhiều lần gọi theo tập file rồi gộp mảng findings**. Tăng `max_tokens` hoặc dặn ngắn gọn chỉ hoãn vấn đề; chuyển sang markdown mất cấu trúc.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Review không chặn (non-blocking) → cân nhắc Batch API',
          text: 'Nhà phát triển merge sau khi test qua và xử lý phát hiện ở commit sau (Q75): yếu tố quyết định dùng Batch (giảm 50% chi phí) là **kết quả trễ tới 24 giờ có còn hành động được không**, không phải chuyện đơn/đa lượt hay thứ tự kết quả (đã có `custom_id`). Xem chủ đề "Message Batches API".',
        },
      ],
    },
  ],
}
