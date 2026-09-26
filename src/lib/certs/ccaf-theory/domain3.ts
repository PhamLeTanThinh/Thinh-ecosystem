import type { TheoryDomain } from './types'

export const DOMAIN_3: TheoryDomain = {
  id: 'claude-code',
  number: 3,
  title: 'Cấu hình & quy trình Claude Code',
  weight: 20,
  summary: 'CLAUDE.md, rules, skills, hooks; plan mode vs. thực thi trực tiếp; loop cải tiến; chạy không giao diện (CI) và thiết kế review tự động.',
  topics: [
    {
      id: 'claude-md-config',
      title: 'CLAUDE.md, rules, skills & hooks',
      summary: 'Đặt hướng dẫn đúng chỗ: CLAUDE.md, rules theo đường dẫn, @import, skills dùng chung qua git, và hook khi cần chắc chắn 100%.',
      questionIds: [44, 168, 173, 174, 176, 178, 179, 199],
      blocks: [
        {
          type: 'tldr',
          text: '**CLAUDE.md** là "sổ tay dự án" Claude đọc khi bắt đầu làm việc — nó **hướng dẫn**, nhưng Claude vẫn có thể quên. **Rules** là các trang sổ tay chỉ mở khi sửa đúng loại file. **Skills** là quy trình đóng gói sẵn, gọi bằng `/tên`. **Hooks** là code chạy tự động — dùng khi cần **chắc chắn 100%**.',
        },
        {
          type: 'terms',
          items: [
            { term: 'CLAUDE.md', meaning: 'File hướng dẫn Claude tự nạp vào context: quy ước code, lệnh build, lưu ý dự án…' },
            { term: 'Rules (`.claude/rules/`)', meaning: 'File hướng dẫn có `paths:` — chỉ nạp khi Claude sửa file khớp đường dẫn đó.' },
            { term: '`@import`', meaning: 'Dòng `@đường/dẫn.md` trong CLAUDE.md để nhúng nội dung một file khác vào.' },
            { term: 'Skill', meaning: 'Một quy trình đóng gói trong `SKILL.md`, gọi bằng `/tên` hoặc được Claude tự dùng khi phù hợp.' },
            { term: 'Hook', meaning: 'Lệnh chạy tự động quanh sự kiện (trước/sau khi dùng tool, khi dừng…) — cấu hình trong `settings.json`.' },
            { term: '`/memory`', meaning: 'Lệnh xem những file hướng dẫn nào **đang thực sự được nạp**.' },
          ],
        },

        { type: 'h', text: '1. Đặt hướng dẫn ở đâu' },
        {
          type: 'table',
          headers: ['Cơ chế', 'Vị trí', 'Nạp khi nào / cho ai'],
          rows: [
            ['CLAUDE.md **cá nhân**', '`~/.claude/CLAUDE.md`', 'Mọi dự án của riêng bạn.'],
            ['CLAUDE.md **dự án**', '`./CLAUDE.md` (hoặc `.claude/CLAUDE.md`)', 'Đầu mỗi session; cả team dùng chung qua git.'],
            ['CLAUDE.md **thư mục con**', 'vd. `/terraform/CLAUDE.md`', 'Khi Claude làm việc với file trong thư mục đó.'],
            ['**Rules** theo đường dẫn', '`.claude/rules/*.md` + `paths: ["terraform/**/*"]`', 'Chỉ khi sửa file khớp → **tiết kiệm token**.'],
            ['**@import**', '`@docs/standards/security-rules.md` trong CLAUDE.md', 'Nhúng file khác, chia nhỏ cho gọn.'],
            ['**Skills**', '`.claude/skills/<tên>/SKILL.md` (dự án) hoặc `~/.claude/skills/…` (cá nhân)', 'Gọi `/tên` hoặc tự dùng khi hợp.'],
            ['**Hooks**', '`settings.json`: `PreToolUse`, `PostToolUse`, `Stop`…', 'Chạy **chắc chắn** mỗi lần sự kiện xảy ra.'],
          ],
        },

        { type: 'h', text: '2. Các tình huống hay ra thi' },
        {
          type: 'example',
          scenario: 'Monorepo hạ tầng: CLAUDE.md gốc dài 500+ dòng; quy tắc Terraform bị nạp cả khi đang sửa file Kubernetes.',
          right: 'Chuyển sang **`.claude/rules/`** với frontmatter **`paths`** — quy tắc Terraform chỉ nạp khi sửa file Terraform.',
          wrong: [
            'Chia CLAUDE.md theo thư mục con — chỉ tách theo *thư mục*, không theo *loại file*.',
            'Dùng `@import` — vẫn nạp toàn bộ nội dung.',
            'Thêm tiêu đề mục cho dễ đọc — không tiết kiệm được token nào.',
          ],
          why: 'Chỉ `paths` mới cho phép nạp hướng dẫn **theo loại file đang sửa**.',
        },
        {
          type: 'table',
          headers: ['Bài toán', 'Giải pháp đúng'],
          rows: [
            ['Skill chuyển React → Vue cho **cả team**, ai cũng có bản mới nhất', 'Đặt `.claude/skills/migrate-component/SKILL.md` **trong dự án, commit vào git** → pull là có bản mới.'],
            ['15 package, mỗi package cần một phần **khác nhau** trong 3 bộ tiêu chuẩn; nhìn tên package không đoán được', 'Trong CLAUDE.md của **từng package**, `@import` **đúng** những tiêu chuẩn nó cần (người phụ trách package quyết định). Rules `paths` liệt kê mọi package thì dễ lệch; gộp hết rồi dặn "bỏ qua cái không liên quan" là trông chờ model.'],
            ['Việc **làm một lần**, cần theo mẫu của 3 module cụ thể', 'Tham chiếu **`@` tới 3 module ngay trong prompt** — cho Claude xem code mẫu thật. Không cần ghi vào CLAUDE.md (thứ dành cho hướng dẫn lâu dài).'],
            ['Claude lúc theo quy ước `ApiError`, lúc không', 'Việc **đầu tiên**: chạy **`/memory`** xem file hướng dẫn nào thực sự được nạp. Thêm ví dụ hay viết rule mới là bước sau.'],
            ['Test sinh ra kém: 55% chỉ kiểm tra "không throw", trùng test cũ, dùng sai fixture', '**Ghi tiêu chuẩn test vào CLAUDE.md**: thế nào là test có giá trị, fixture nào có sẵn và để làm gì, ví dụ test tốt vs tầm thường. Sửa **từ gốc**; lọc sau khi sinh (coverage, chấm lại) chỉ xử lý hậu quả.'],
          ],
        },

        { type: 'h', text: '3. Hướng dẫn vs. đảm bảo' },
        {
          type: 'p',
          text: 'CLAUDE.md giống tờ giấy nhắc dán trên bàn: thường làm theo, đôi khi quên. Hook giống máy tự động: **luôn chạy**.',
        },
        {
          type: 'example',
          scenario: 'Dặn trong CLAUDE.md "luôn format bằng Prettier" nhưng 30% file vẫn sai định dạng; in đậm IMPORTANT giảm còn 15%, vẫn chưa hết.',
          right: 'Thêm **hook `PostToolUse`** với matcher **`Edit|Write`** tự chạy Prettier trên mỗi file Claude vừa sửa.',
          wrong: ['Viết skill chi tiết hơn.', 'Dùng rules theo đường dẫn.', 'Hook `Stop` dựa trên prompt.'],
          why: 'Các cách kia vẫn phụ thuộc model tự nhớ; hook thì chạy mọi lần, bất kể model.',
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Quy tắc chung',
          text: 'Cần **chắc chắn tuyệt đối** → **hook**. Cần hướng dẫn phong cách / context → CLAUDE.md, rules, skills. Cần tiết kiệm token theo loại file → **rules có `paths`**. Hướng dẫn không được làm theo → kiểm tra **`/memory`** trước.',
        },
      ],
    },
    {
      id: 'plan-vs-direct-iteration',
      title: 'Plan mode vs. thực thi trực tiếp & loop cải tiến',
      summary: 'Khi nào lập kế hoạch, khi nào làm luôn; cách sửa dần hiệu quả: test trước, ví dụ cụ thể, từng vấn đề một, để Claude hỏi lại.',
      questionIds: [3, 60, 164, 167, 169, 170, 171, 175, 177],
      blocks: [
        {
          type: 'tldr',
          text: 'Việc **nhỏ, rõ ràng** (sửa một hàm, lỗi đã có stack trace chỉ đúng chỗ) → **direct execution**. Việc **lớn, ảnh hưởng nhiều nơi** (nâng cấp thư viện đụng 45 file) → **plan mode**: khám phá và lập kế hoạch trước. Khi cần sửa đi sửa lại: đưa **test / ví dụ cụ thể**, sửa **từng vấn đề một**, và nếu chưa rõ yêu cầu thì **để Claude hỏi bạn**.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Plan mode', meaning: 'Chế độ Claude chỉ đọc và khám phá để đề xuất kế hoạch, chưa sửa gì cho tới khi bạn duyệt.' },
            { term: 'Direct execution', meaning: 'Làm luôn: đọc, sửa, kiểm tra — không qua bước lập kế hoạch riêng.' },
            { term: 'Breaking change', meaning: 'Thay đổi ở phiên bản mới khiến code cũ không còn chạy đúng.' },
            { term: 'Over-exploration', meaning: 'Khám phá quá mức cần, làm chậm việc (nhất là khi đang xử lý sự cố).' },
          ],
        },

        { type: 'h', text: '1. Lập kế hoạch hay làm luôn?' },
        {
          type: 'p',
          text: 'Giống việc nhà: thay bóng đèn thì làm luôn; sửa lại cả hệ thống điện thì phải khảo sát và vẽ sơ đồ trước.',
        },
        {
          type: 'table',
          headers: ['Tình huống', 'Chọn', 'Lý do'],
          rows: [
            ['Thêm **một điều kiện** kiểm tra ngày vào **một hàm** trong một file', '**Direct execution**', 'Nhỏ, rõ. Plan mode hay suy nghĩ mở rộng là thừa.'],
            ['Lỗi production, **stack trace chỉ đúng chỗ**', '**Direct execution**', 'Đọc trace → đọc code liên quan → sửa. Khám phá kiến trúc lúc này chỉ làm chậm xử lý sự cố.'],
            ['Nâng cấp thư viện auth v2 → v3, **45 file**, nhiều loại breaking change', '**Plan mode**', 'Rộng, nhiều module: tìm mọi chỗ dùng, vẽ bản đồ chỗ bị ảnh hưởng, lập chiến lược **rồi mới** sửa.'],
            ['"Cải thiện xử lý lỗi cho cả module"', '**Nhiều pha**: phân tích → đề xuất → làm + review', 'Việc cần phán đoán.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Bẫy: nâng cấp thư viện rồi sửa dần từng test hỏng',
          text: 'Không có phân tích tổng thể, agent vá theo từng test đỏ — bỏ sót code không có test và không có chiến lược chung. Tạo một slash command rồi chạy trên từng file mà **không khám phá** trước cũng bỏ qua đặc thù từng module.',
        },

        { type: 'h', text: '2. Cách lặp để kết quả tốt dần' },
        {
          type: 'table',
          headers: ['Tình huống', 'Cách làm hiệu quả'],
          rows: [
            ['Thuật toán phức tạp (đồ thị, nhiều trường hợp biên, yêu cầu hiệu năng)', '**Viết test trước** (hành vi mong muốn, trường hợp biên, hiệu năng) → nhờ Claude viết code vượt test → mỗi lượt **đưa các test còn fail** để sửa tiếp. Tiến độ đo được, khách quan.'],
            ['Script migration xử lý sai giá trị `null`', 'Đưa **một test case cụ thể: input có `null` + output mong muốn**, rồi nhờ sửa. Tốt hơn mô tả dài dòng, tự sửa tay, hay bảo "think harder".'],
          ],
        },
        {
          type: 'example',
          scenario: 'Báo cáo xuất ra có 3 lỗi dính nhau: độ rộng cột, định dạng ngày, ngắt trang (sửa cái này ảnh hưởng cái kia).',
          right: 'Sửa **tuần tự**: độ rộng cột trước (kèm số đo cụ thể) → **kiểm tra** → định dạng ngày → kiểm tra → ngắt trang.',
          wrong: ['Gộp cả 3 yêu cầu vào một tin nhắn.', 'Bắt làm lại toàn bộ từ đầu.'],
          why: 'Các lỗi ảnh hưởng lẫn nhau; sửa từng cái và kiểm tra ngay mới thấy được cái nào gây ra cái nào.',
        },
        {
          type: 'example',
          scenario: 'Bạn mới làm caching cho production, chỉ có ý tưởng "dùng Redis, TTL 5 phút".',
          right: '**Nhờ Claude phỏng vấn bạn trước** khi làm: chiến lược xoá cache, các tầng cache, tính nhất quán, khi Redis hỏng thì sao…',
          wrong: ['Làm bản tối thiểu rồi vá dần.', 'Để các chỗ chưa rõ là "TBD".'],
          why: 'Hai cách kia chỉ hiệu quả khi bạn **biết mình còn thiếu gì**. Người mới thì chưa biết mình chưa biết gì — câu hỏi của Claude giúp lộ ra.',
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Từ khoá',
          text: '"Stack trace rõ", "một hàm một file" → **direct execution**. "Nhiều file, nhiều module, chưa rõ ảnh hưởng" → **plan mode**. "Kết quả sai cụ thể" → đưa **test / ví dụ**. "Chưa biết mình chưa biết gì" → **để Claude phỏng vấn**.',
        },
      ],
    },
    {
      id: 'ci-headless-review',
      title: 'Chạy không giao diện (CI) & thiết kế review tự động',
      summary: 'Chạy Claude Code trong CI (-p, --max-turns, --max-budget-usd) và thiết kế review tự động: session riêng, tìm rộng rồi lọc, ví dụ có chú thích.',
      questionIds: [1, 43, 61, 75, 183, 186, 187, 188, 197, 198, 200, 201],
      blocks: [
        {
          type: 'tldr',
          text: 'Trong CI (GitHub Actions…), Claude Code chạy **không có người ngồi bấm**: dùng `-p`, giới hạn số vòng bằng `--max-turns` và tiền bằng `--max-budget-usd`. Khi làm review code tự động: review ở **session riêng** (không phải session đã viết code), **tìm rộng trước rồi lọc sau**, dạy bằng **ví dụ có chú thích**, tách prompt theo từng mục tiêu, và chia nhỏ khi PR quá lớn.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Headless / non-interactive', meaning: 'Chạy không có giao diện, không hỏi người dùng — kiểu chạy trong CI.' },
            { term: 'Recall', meaning: 'Trong số lỗi thật, tìm ra được bao nhiêu. Recall thấp = bỏ sót nhiều.' },
            { term: 'Precision', meaning: 'Trong số lỗi đã báo, bao nhiêu là thật. Precision thấp = nhiều false positive.' },
            { term: 'False positive', meaning: 'Báo là lỗi nhưng thực ra không phải.' },
            { term: 'Few-shot', meaning: 'Đưa vài example mẫu (input → output) trong prompt để model học theo.' },
          ],
        },

        { type: 'h', text: '1. Các cờ khi chạy trong CI' },
        {
          type: 'table',
          headers: ['Cờ', 'Tác dụng'],
          rows: [
            ['`-p` / `--print`', 'Chạy không tương tác, in kết quả rồi thoát.'],
            ['`--max-turns N`', '**Giới hạn số vòng** agent — Claude Code tự đảm bảo.'],
            ['`--max-budget-usd X`', '**Giới hạn chi phí** mỗi lần chạy — Claude Code tự đảm bảo.'],
            ['`--append-system-prompt`', '**Thêm** hướng dẫn vào system prompt mặc định (vẫn giữ hướng dẫn gốc về cách đọc file, dùng tool).'],
            ['`--system-prompt`', '**Thay thế toàn bộ** system prompt mặc định.'],
            ['`--allowedTools`', 'Các tool được dùng mà không cần hỏi.'],
            ['`--permission-mode dontAsk`', 'Tự từ chối mọi quyền chưa được cho sẵn — lo về **quyền**, không giới hạn vòng hay chi phí.'],
          ],
        },
        {
          type: 'example',
          scenario: 'Cần giới hạn số loop và số tiền cho mỗi lần chạy trong CI, và giới hạn đó phải **do chính Claude Code thi hành**.',
          right: '`claude -p ... --max-turns 10 --max-budget-usd 2.00`',
          wrong: ['`timeout-minutes` của GitHub Actions — nằm ngoài Claude Code.', 'Theo dõi dashboard chi phí — chỉ xem được, không chặn được.'],
          why: 'Đề hỏi giới hạn do Claude Code thi hành → chỉ hai cờ này.',
        },
        {
          type: 'example',
          scenario: 'Pipe diff vào `claude -p --system-prompt "Review this diff…"` nhưng Claude **không chịu mở đọc các file liên quan** xung quanh.',
          right: 'Đổi sang **`--append-system-prompt`**.',
          wrong: ['Nhúng diff thẳng vào chuỗi prompt.', 'Đưa hướng dẫn review vào CLAUDE.md.'],
          why: '`--system-prompt` **ghi đè** mất phần hướng dẫn gốc về cách dùng tool đọc file; `--append-system-prompt` chỉ thêm vào.',
        },

        { type: 'h', text: '2. Vì sao tự review trong cùng session hay bỏ sót' },
        {
          type: 'p',
          text: 'Giống tự soát bài văn mình vừa viết: đầu bạn vẫn còn "ý định" nên đọc thấy đúng. Claude trong cùng session cũng **nhớ lập luận của chính nó** nên ít nghi ngờ quyết định đã đưa ra. Dùng **một session review độc lập** (vd. trong CI, context sạch) để có góc nhìn mới. Lý do **không phải** vì CI thấy nhiều context hơn, prompt CI cụ thể hơn hay context window bị đầy.',
        },

        { type: 'h', text: '3. Review bỏ sót lỗi thật (low recall)' },
        {
          type: 'example',
          scenario: 'Prompt review ghi "chỉ báo khi **chắc chắn**, ưu tiên không comment". Kết quả: một race condition gây sự cố production không được báo.',
          right: 'Tách **2 giai đoạn**: (1) **Tìm** — mục tiêu là recall, báo mọi vấn đề nghi ngờ kèm **confidence + severity**; (2) **Lọc** — một bước riêng lọc theo ngưỡng.',
          wrong: [
            'Giữ câu "chỉ báo khi chắc chắn" trong prompt tìm lỗi — vẫn kìm recall.',
            'Chỉ lọc theo *danh mục* lỗi mà không có confidence/mức nghiêm trọng — có thể chặn luôn lỗi thật.',
          ],
          why: 'Model làm theo **đúng nghĩa đen** lời dặn "chỉ khi chắc chắn". Tìm và lọc là hai mục tiêu ngược nhau — nên tách ra.',
        },

        { type: 'h', text: '4. Giảm false positive, tăng chất lượng' },
        {
          type: 'table',
          headers: ['Vấn đề', 'Cách sửa', 'Vì sao cách khác kém'],
          rows: [
            ['Nhiều false positive', '**Few-shot có chú thích**: ví dụ code cho thấy đâu là **mẫu chấp nhận được**, đâu là **lỗi thật** trong từng nhóm → model khái quát sang trường hợp mới.', 'Lọc bằng từ khoá, dặn "hãy thận trọng", đặc tả thật dài — đều chỉ dựa vào luật cứng.'],
            ['Bỏ sót nhánh code chưa có test', 'Few-shot: đoạn code có nhánh chưa được test + comment **chỉ đích danh test còn thiếu**.', 'Chạy nhiều lượt hoặc liệt kê mọi nhánh — phức tạp không cần thiết.'],
            ['Một prompt làm nhiều mục tiêu; thêm ví dụ về logic thì phần review API lại kém đi', '**Tách thành nhiều prompt tập trung** (bảo mật + API; logic nghiệp vụ), mỗi cái có ví dụ riêng, rồi gộp kết quả.', 'Model mạnh hơn, cho xem toàn repo hay checklist — không xoá được sự đánh đổi.'],
            ['Bỏ sót lỗi ở **file khác** (chỗ gọi hàm nằm ở file không thay đổi)', 'Chuyển thành **tác vụ agentic có giới hạn lượt**: cho model tự đọc file, tìm trong codebase để xác minh.', 'Chain-of-thought không giúp với code model không nhìn thấy; đồ thị phụ thuộc tĩnh làm phình context mà vẫn sót tham chiếu động.'],
            ['Output bị **cắt giữa JSON** (PR 30+ file chạm `max_tokens`)', '**Chia PR thành nhiều lần gọi** theo nhóm file rồi gộp mảng kết quả.', 'Tăng `max_tokens` hay dặn viết ngắn chỉ hoãn vấn đề; đổi sang markdown thì mất cấu trúc.'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Review không cần chờ → cân nhắc Batch API',
          text: 'Nếu dev merge khi test qua và xử lý góp ý review ở commit sau, có thể dùng Batch API (rẻ hơn 50%). Câu hỏi quyết định: **kết quả trễ tới 24 giờ có còn dùng được không** — không phải chuyện một lượt hay nhiều lượt, cũng không phải thứ tự kết quả (đã có `custom_id`). Xem chủ đề "Message Batches API".',
        },
      ],
    },
  ],
}
