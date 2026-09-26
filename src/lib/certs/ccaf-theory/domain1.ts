import type { TheoryDomain } from './types'

export const DOMAIN_1: TheoryDomain = {
  id: 'agentic',
  number: 1,
  title: 'Kiến trúc Agentic & Điều phối',
  weight: 27,
  summary: 'Loop agent, các mẫu chia nhỏ tác vụ, hệ thống nhiều agent (coordinator – subagent), truyền trạng thái, guardrail và quản lý session.',
  topics: [
    {
      id: 'agent-loop-patterns',
      title: 'Agentic loop & các mẫu chia nhỏ tác vụ',
      summary: 'Claude tự quyết từng bước như thế nào, 5 mẫu workflow nên chọn khi nào, và cách chia một việc lớn chưa rõ ràng.',
      questionIds: [1, 2, 3, 4, 13, 36, 56],
      blocks: [
        {
          type: 'tldr',
          text: '**Agent** = Claude tự quyết từng bước. Ứng dụng của bạn chỉ làm "tay chân": chạy tool Claude yêu cầu rồi đưa kết quả lại cho Claude. Ngược lại, nếu các bước đã **biết trước** thì đó là **workflow** — bạn viết sẵn quy trình, Claude chỉ làm từng bước. Việc càng rõ ràng thì càng nên dùng cách đơn giản.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Tool', meaning: 'Một hàm do bạn viết (tra đơn hàng, tìm web...) mà Claude được phép "nhờ" gọi.' },
            { term: '`tool_use`', meaning: 'Claude trả lời: "tôi muốn gọi tool X với parameter Y". Claude không tự chạy được, ứng dụng phải chạy giúp.' },
            { term: '`tool_result`', meaning: 'Tool result mà ứng dụng gửi ngược lại cho Claude, được thêm vào cuộc hội thoại.' },
            { term: '`end_turn`', meaning: 'Claude báo đã xong, không cần gọi thêm tool nào → loop dừng.' },
          ],
        },

        { type: 'h', text: '1. Loop agent chạy thế nào' },
        {
          type: 'p',
          text: 'Hình dung Claude là **người quản lý**, còn ứng dụng của bạn là **trợ lý**. Quản lý không tự mở máy tính được: muốn biết thông tin đơn hàng thì bảo trợ lý tra rồi báo lại, nghe xong mới quyết định làm gì tiếp.',
        },
        {
          type: 'steps',
          items: [
            'Ứng dụng gửi cho Claude: tin nhắn của người dùng + danh sách tool được phép dùng.',
            'Claude trả về `tool_use`: "hãy gọi tool `lookup_order` giúp tôi".',
            'Ứng dụng chạy tool, gửi kết quả lại dưới dạng `tool_result`.',
            'Claude đọc **toàn bộ** hội thoại (kể cả kết quả vừa nhận) rồi **tự quyết** bước tiếp: gọi tool khác, hoặc trả lời xong (`end_turn`).',
          ],
          loop: 'Lặp lại bước 2 → 4 cho tới khi Claude trả `end_turn`.',
        },
        {
          type: 'p',
          text: 'Điểm mấu chốt: **không có kế hoạch nào được viết sẵn từ đầu**. Mỗi lượt, Claude nhìn tình hình mới nhất rồi mới chọn bước tiếp theo.',
        },
        {
          type: 'example',
          scenario: 'Khách đòi hoàn tiền. Tool `lookup_order` trả về: đơn hàng mua cách đây **45 ngày**. Điều gì quyết định bước tiếp theo?',
          right: 'Tool result được thêm vào hội thoại → Claude tự suy ra "đã quá hạn hoàn tiền" → chọn gọi `escalate_to_human` thay vì `process_refund`.',
          wrong: [
            'Một cây quyết định (if/else) viết cứng trong code.',
            'Một kế hoạch đã lập sẵn từ đầu cuộc hội thoại.',
            'Một orchestration layer tự chuyển tool dựa trên trường `status`.',
          ],
          why: 'Cả ba đều là quy trình viết cứng (workflow). Trong agent, chính model đọc kết quả rồi suy luận ra bước tiếp.',
        },

        { type: 'h', text: '2. Năm mẫu workflow — chọn mẫu nào?' },
        {
          type: 'p',
          text: 'Không phải việc gì cũng cần một agent "tự do". Bài viết **Building Effective Agents** của Anthropic đưa ra 5 mẫu, từ đơn giản tới phức tạp. Quy tắc: chọn mẫu **đơn giản nhất** mà vẫn làm được việc.',
        },
        {
          type: 'table',
          headers: ['Mẫu', 'Hiểu đơn giản', 'Dùng khi', 'Ví dụ'],
          rows: [
            ['**Prompt chaining**', 'Dây chuyền: xong bước 1 mới sang bước 2.', 'Các bước **cố định**, input nào cũng đi qua đúng các bước đó.', 'Review mọi PR theo 3 bước: style → bảo mật → tài liệu, rồi gộp kết quả.'],
            ['**Routing**', 'Lễ tân hỏi bạn cần gì rồi chỉ đúng phòng.', 'Input thuộc **nhiều loại**, mỗi loại cần cách xử lý riêng.', 'Phân loại PR là feature / bugfix / refactor rồi review theo kiểu riêng.'],
            ['**Parallelization**', 'Chia việc cho nhiều người làm cùng lúc.', 'Các việc con **không phụ thuộc nhau**; hoặc chạy nhiều lần để lấy ý kiến đa số.', 'Tìm trên web và phân tích tài liệu cùng một lúc.'],
            ['**Orchestrator-workers**', 'Trưởng nhóm tự nghĩ ra cần làm những việc gì rồi giao.', '**Không đoán trước** được cần những việc con nào.', 'Hệ thống nghiên cứu: coordinator tự quyết cần tra những gì.'],
            ['**Evaluator-optimizer**', 'Một người viết, một người chấm, sửa tới khi đạt.', 'Có **tiêu chí đánh giá rõ ràng**.', 'Phân tích → thấy còn thiếu → tìm thêm → phân tích lại.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Bẫy: chọn mẫu phức tạp quá mức cần',
          text: 'Đề nói "**cùng một quy trình cho mọi PR**" → đó là **prompt chaining**, không phải orchestrator-workers. Chỉ dùng orchestrator-workers khi các việc con thay đổi khó đoán theo từng input.',
        },

        { type: 'h', text: '3. Việc chưa rõ: khám phá trước, lập kế hoạch sau' },
        {
          type: 'p',
          text: 'Khi chưa biết việc lớn cỡ nào (thêm test cho codebase 200 file, tìm lỗi 500 lúc có lúc không), đừng vội lên kế hoạch chi tiết. Hãy làm như một người mới vào dự án:',
        },
        {
          type: 'steps',
          items: [
            'Dùng **Glob/Grep** dò cấu trúc thư mục và tìm chỗ liên quan — **không** mở đọc hết từng file.',
            'Tìm phần **quan trọng nhất**: module được nhiều nơi khác dùng tới (phụ thuộc nhiều).',
            'Lập kế hoạch, ưu tiên các phần quan trọng đó trước.',
            '**Điều chỉnh kế hoạch** khi phát hiện thêm phụ thuộc mới.',
          ],
        },
        {
          type: 'example',
          scenario: 'Cần thêm test cho một codebase 200 file chưa có test. Nên bắt đầu thế nào?',
          right: 'Dùng Glob/Grep lập bản đồ codebase → ưu tiên các module phụ thuộc nhiều, tác động lớn → điều chỉnh khi phát hiện thêm phụ thuộc.',
          wrong: [
            'Đọc hết 200 file trước (tốn context và thời gian).',
            'Chia đều theo thư mục theo lịch cố định (bỏ qua mức độ quan trọng).',
            'Làm lần lượt theo bảng chữ cái (tuỳ tiện, không có kế hoạch).',
            'Lên kế hoạch chi tiết **trước khi** khám phá ("blind planning").',
          ],
          why: 'Việc mở thì phải khám phá rồi mới biết chỗ nào đáng làm trước; kế hoạch cần thay đổi theo những gì vừa tìm thấy.',
        },
        {
          type: 'table',
          headers: ['Loại việc', 'Cách làm hợp lý'],
          rows: [
            ['Việc cơ học, rõ ràng (đổi tên một hàm ở mọi nơi)', 'Làm luôn, không cần chia nhiều pha.'],
            ['Việc cần phán đoán ("cải thiện xử lý lỗi cho cả module")', 'Tách rõ: phân tích → đề xuất → triển khai, có review giữa các bước.'],
            ['Tìm nguyên nhân lỗi', 'Tạo việc con **theo bằng chứng vừa thấy**. Không kiểm tra song song cả 4 tầng (routing, middleware, business, DB) — tốn gấp 4 cho 3 tầng không liên quan.'],
            ['Truy vấn lúc dễ lúc khó', 'Để **coordinator tự đánh giá từng truy vấn** rồi chọn gọi subagent nào. Luật cứng hay bộ phân loại huấn luyện sẵn dễ "gãy" khi truy vấn đa dạng và luôn thay đổi.'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Nhớ 1 câu',
          text: 'Chưa rõ → **thích ứng** (khám phá rồi điều chỉnh). Đã rõ các bước → **cố định** (chaining). Việc độc lập → **song song**. Việc đơn giản → **đừng thêm cấu trúc**.',
        },
      ],
    },
    {
      id: 'multi-agent',
      title: 'Hệ thống nhiều agent: coordinator & subagent',
      summary: 'Trưởng nhóm chia việc cho các subagent: truyền đủ thông tin, chạy song song, giao mục tiêu thay vì thủ tục, mỗi agent ít tool.',
      questionIds: [6, 7, 8, 13, 14, 16, 17, 20, 27],
      blocks: [
        {
          type: 'tldr',
          text: 'Một **coordinator** nhận việc lớn, chia nhỏ rồi giao cho các **subagent**. Mỗi subagent **không nhớ gì** ngoài những gì trưởng nhóm đưa trong lời giao việc. Muốn hệ thống chạy tốt: đưa đủ thông tin, giao theo **mục tiêu** chứ không theo thủ tục, chạy song song khi được, và mỗi thành viên chỉ cầm ít tool đúng việc.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Coordinator / orchestrator', meaning: 'Agent trung tâm: chia việc, giao việc, gom kết quả. Mọi thông tin đều đi qua nó.' },
            { term: 'Subagent', meaning: 'Agent phụ được giao một phần việc, chạy trong context riêng, xong thì trả kết quả về coordinator.' },
            { term: '`Task`', meaning: 'Tool mà coordinator dùng để khởi chạy (spawn) subagent trong Claude Agent SDK.' },
            { term: '`AgentDefinition`', meaning: 'Bản khai báo một subagent: mô tả, prompt riêng và danh sách tool được dùng.' },
            { term: '`allowedTools`', meaning: 'Danh sách tool một agent được phép gọi.' },
            { term: 'Spawn', meaning: 'Tạo và chạy một subagent mới.' },
          ],
        },

        { type: 'h', text: '1. Mô hình hub-and-spoke' },
        {
          type: 'p',
          text: 'Hình dung một bánh xe: coordinator là **trục giữa**, các subagent là **nan hoa**. Nan hoa không nối trực tiếp với nhau — muốn đưa kết quả của subagent A cho subagent B, coordinator phải **tự chép phần liên quan vào lời giao việc** cho B.',
        },
        {
          type: 'list',
          items: [
            'Subagent **không** gọi nhau trực tiếp, **không** nghe sự kiện qua message queue, **không** tự "thừa hưởng" context của coordinator.',
            'Mỗi lần gọi subagent là một session độc lập, **chỉ biết đúng những gì có trong prompt** được giao.',
            'Dữ liệu ít → đưa thẳng vào prompt. Dữ liệu lớn (80–120K token) → **lưu ra kho chung và chỉ truyền mã tham chiếu**, đỡ tốn token hơn nhiều.',
          ],
        },
        {
          type: 'example',
          scenario: 'Subagent viết báo cáo trả lời: "Tôi không có dữ liệu nghiên cứu nào", dù subagent tìm kiếm đã chạy xong và có kết quả.',
          right: 'Coordinator đã **quên đưa kết quả tìm kiếm vào prompt** của subagent viết báo cáo — sửa ở phía coordinator.',
          wrong: [
            'Nghĩ rằng subagent tự nhận được context của coordinator.',
            'Cho các subagent gọi callback lẫn nhau.',
          ],
          why: 'Context của subagent bị cô lập. Không có cơ chế nào tự chuyển dữ liệu giữa chúng — chỉ có coordinator làm việc đó.',
        },

        { type: 'h', text: '2. Coordinator "nói" giao việc nhưng không có gì chạy' },
        {
          type: 'p',
          text: 'Subagent được khởi chạy **thông qua tool `Task`**. Nếu `allowedTools` của coordinator **thiếu `"Task"`**, coordinator vẫn viết "tôi sẽ giao cho subagent nghiên cứu…" nhưng thực tế không có gì được spawn — **không lỗi, không log** — rồi nó tiếp tục làm với thông tin thiếu.',
        },
        {
          type: 'table',
          headers: ['Triệu chứng', 'Nguyên nhân'],
          rows: [
            ['Nói là giao việc, **không thấy chạy, không có lỗi**', 'Thiếu `"Task"` trong `allowedTools`.'],
            ['Tool call bị cắt ngang, có lỗi', '`max_tokens` quá thấp.'],
            ['Model không hề nhắc tới subagent', 'System prompt chưa mô tả là có subagent.'],
          ],
        },

        { type: 'h', text: '3. Chạy song song và giữ cấu trúc phẳng' },
        {
          type: 'p',
          text: 'Muốn hai subagent độc lập (tìm web, phân tích tài liệu) chạy **cùng lúc**: coordinator gửi **nhiều lệnh `Task` trong cùng một câu trả lời**. Hệ thống chạy các `tool_use` trong cùng một lượt đồng thời.',
        },
        {
          type: 'example',
          scenario: 'Hệ thống chậm vì coordinator phân tích 12 precedent lần lượt từng cái một.',
          right: 'Coordinator **tự spawn nhiều subagent song song** (mỗi subagent một nhóm precedent) trong cùng một lượt, rồi tổng hợp kết quả.',
          wrong: [
            'Đổi sang model nhỏ hơn — chỉ nhanh hơn từng bước, vẫn chạy tuần tự.',
            'Dựng thêm một tầng xử lý async bên ngoài agent — làm lại thứ loop agent đã có sẵn.',
            'Chỉ dặn trong system prompt "hãy chạy song song" — không có gì đảm bảo.',
          ],
          why: 'Song song phải đến từ cơ chế (nhiều `Task` trong một lượt), không phải lời dặn. Coordinator vẫn là nơi giám sát, dễ gỡ lỗi.',
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Flat hierarchy',
          text: 'Đáp án đúng: **coordinator spawn trực tiếp** mọi subagent. Subagent tự spawn subagent con, cây nhiều tầng hay queue async đều làm coordinator mất khả năng theo dõi và gỡ lỗi.',
        },

        { type: 'h', text: '4. Giao việc bằng mục tiêu, không bằng thủ tục' },
        {
          type: 'p',
          text: 'Giống giao việc cho người: bảo "gõ đúng câu tìm kiếm này, lọc từ ngày này" thì họ làm máy móc — không ra kết quả là báo "không tìm thấy" chứ không thử hướng khác, gặp chủ đề mới thì lúng túng, hiếm khi phát hiện nguồn hay ngoài dự kiến. Hãy nói **cần đạt gì và thế nào là tốt**.',
        },
        {
          type: 'table',
          headers: ['Cách giao việc', 'Kết quả'],
          rows: [
            ['Thủ tục chi tiết từng bước (câu truy vấn, bộ lọc ngày…)', 'Cứng nhắc, không thích ứng, bỏ lỡ nguồn ngoài dự kiến.'],
            ['Chỉ nói "nghiên cứu kỹ về X"', 'Quá mơ hồ, thiếu định hướng — cũng là lỗi.'],
            ['**Mục tiêu + tiêu chí chất lượng** (coverage, nguồn đa dạng, độ mới)', 'Vừa đủ: rõ đích đến, tự do chọn cách đi.'],
          ],
        },

        { type: 'h', text: '5. Mỗi agent chỉ cầm ít tool đúng vai trò' },
        {
          type: 'p',
          text: 'Cho cả 4 subagent dùng chung **18 tool** → agent tổng hợp lại đi tìm web, agent tìm kiếm lại đi viết báo cáo. Lý do: càng nhiều lựa chọn (nhất là tool không liên quan), model chọn tool càng dễ sai. Cách sửa: mỗi subagent chỉ được **4–5 tool đúng việc** của nó.',
        },

        { type: 'h', text: '6. Khi nào KHÔNG nên spawn subagent' },
        {
          type: 'example',
          scenario: 'Coordinator đã có 80K+ token kết quả trong context. Mỗi lần người dùng hỏi "tóm tắt giúp tôi", nó lại spawn một subagent tổng hợp — mất 40+ giây vì phải chuyển 80K token mỗi lần.',
          right: 'Để **coordinator tự trả lời** các yêu cầu tóm tắt đơn giản — nó đã có sẵn thông tin.',
          why: 'Subagent chỉ đáng dùng khi cần một context riêng sạch sẽ hoặc khi chạy song song mang lại lợi ích thật.',
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Nhớ nhanh',
          text: 'Subagent **không nhớ gì** ngoài prompt → coordinator phải đưa đủ. Không chạy mà không lỗi → thiếu **`Task`**. Muốn nhanh → nhiều `Task` **trong một lượt**. Giao **mục tiêu + tiêu chí**, không giao thủ tục. **4–5 tool** mỗi agent.',
        },
      ],
    },
    {
      id: 'multi-agent-state',
      title: 'Truyền trạng thái & nguồn gốc dữ liệu giữa các agent',
      summary: 'Giữ nguồn, ngày tháng và độ chắc chắn không bị rơi mất khi thông tin đi qua nhiều agent; tìm thêm khi thiếu; chạy tiếp sau khi sập.',
      questionIds: [5, 9, 10, 11, 12, 18, 19, 21, 22, 81, 86],
      blocks: [
        {
          type: 'tldr',
          text: 'Khi thông tin đi qua nhiều agent, mỗi lần **tóm tắt** là một lần có thể **rơi mất chi tiết**: nguồn trích dẫn, ngày tháng, độ chắc chắn. Cách chữa chung: bắt mỗi agent trả về **structured data** — tách riêng *nội dung* và *thông tin đi kèm* (nguồn, ngày, phương pháp) — và agent phía sau phải giữ nguyên chúng.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Structured data', meaning: 'Dạng có trường rõ ràng (JSON, bảng…) thay vì một đoạn văn tự do. Ví dụ: `{ claim, source_url, page, date }`.' },
            { term: 'Metadata', meaning: 'Thông tin *về* dữ liệu: lấy từ nguồn nào, ngày nào, bằng phương pháp gì.' },
            { term: 'Synthesis agent', meaning: 'Agent tổng hợp: gom kết quả của các subagent thành báo cáo cuối.' },
            { term: 'Manifest', meaning: 'Tệp "mục lục" ghi agent nào đã làm xong gì và kết quả lưu ở đâu.' },
            { term: 'Lossy', meaning: '"Mất mát": cách lưu/tìm lại làm rơi hoặc sai lệch một phần thông tin.' },
          ],
        },

        { type: 'h', text: '1. Giữ thông tin đi kèm qua mỗi bước tóm tắt' },
        {
          type: 'p',
          text: 'Giống trò "tam sao thất bản": câu chuyện truyền qua mấy người thì chi tiết biến mất. Lỗi kiểu "mất trích dẫn", "hiểu nhầm năm", "không biết ý nào từ nguồn nào" đều có chung một gốc: **thông tin nguồn bị rơi ở bước tóm tắt**. Bảng dưới là các dạng đề hay gặp:',
        },
        {
          type: 'table',
          headers: ['Vấn đề', 'Cách đúng', 'Vì sao cách khác sai'],
          rows: [
            ['Báo cáo tổng hợp bị **mất trích dẫn**', 'Subagent trả về **bảng ánh xạ ý → nguồn** (URL, tên tài liệu, trang); agent tổng hợp bắt buộc giữ và gộp lại.', 'Gắn tiền tố vào văn bản thì dễ vỡ; đọc log hay so khớp ngữ nghĩa sau đó thì không tin cậy, lại tốn kém.'],
            ['Agent viết báo cáo **cần trích dẫn**', 'Truyền **bản nháp + chỉ mục nguồn có cấu trúc** (ý → URL + đoạn trích).', 'Gắn trích dẫn *sau khi* viết xong dễ gắn sai; truyền toàn bộ context 120K+ token thì lãng phí.'],
            ['Số liệu 2024 và 2022 bị coi là **"mâu thuẫn"**', 'Yêu cầu subagent ghi kèm **ngày công bố / ngày thu thập** trong output.', 'Bỏ dữ liệu cũ thì mất xu hướng; chỉ lấy 6 tháng gần nhất thì mất bối cảnh; dặn "luôn tin số mới" chỉ là lời dặn.'],
            ['Các nguồn **kết luận trái ngược**', 'Báo cáo có **mục riêng**: điều gì đã chắc chắn, điều gì còn tranh cãi — giữ nguyên nguồn và phương pháp.', 'Lọc theo ngưỡng tin cậy thì mất bằng chứng; quy hết về xác suất 0–1 thì xoá khác biệt phương pháp; đòi ≥ 2 nguồn thì loại cả phát hiện đúng chỉ có 1 nguồn.'],
            ['Nhiều **loại nội dung** (JSON tài chính, tin tức, danh sách bằng sáng chế)', 'Trình bày **đúng dạng từng loại**: bảng cho số liệu, văn xuôi cho tin tức.', 'Ép tất cả về một dạng chung (vd. toàn gạch đầu dòng) làm mất ý nghĩa.'],
          ],
        },

        { type: 'h', text: '2. Thiếu thông tin → quay lại tìm thêm (feedback loop)' },
        {
          type: 'p',
          text: 'Pipeline chỉ đi một chiều (tìm → phân tích → viết) thì khi phát hiện "thiếu chi tiết về token refresh" đã quá muộn. Cần một loop do coordinator điều khiển:',
        },
        {
          type: 'steps',
          items: [
            'Agent phân tích **báo cáo cụ thể** còn thiếu gì cho coordinator.',
            'Coordinator giao một lượt **tìm kiếm có mục tiêu** cho đúng chỗ thiếu.',
            'Chạy lại phân tích với thông tin mới.',
          ],
          loop: 'Lặp tới khi đủ thông tin.',
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Các cách không đóng được loop',
          text: 'Chỉ "ghi chú giới hạn cho người dùng", mở rộng câu tìm kiếm ban đầu cho thật rộng, hay cho agent tổng hợp tự đi tìm web — đều không có loop được coordinator kiểm soát.',
        },

        { type: 'h', text: '3. Pipeline bị sập giữa chừng → tiếp tục thế nào' },
        {
          type: 'example',
          scenario: 'Pipeline xử lý 28 tài liệu thì sập sau tài liệu thứ 12. Làm sao chạy tiếp mà không mất việc đã làm và không tràn context?',
          right: '**Mỗi agent lưu kết quả có cấu trúc vào một chỗ cố định**. Khi chạy lại, coordinator đọc **manifest** rồi chỉ đưa **phần trạng thái liên quan** vào prompt của từng agent.',
          wrong: [
            'Mỗi agent tự giữ file trạng thái và tự nạp lại — không có ai phối hợp việc chạy tiếp.',
            'Lưu nguyên log hội thoại của coordinator rồi nạp lại — tràn context.',
            'Lưu vào vector store rồi tìm lại bằng semantic search — **lossy**, có thể sót hoặc sai kết quả cũ.',
          ],
          why: 'Cần cả hai: đủ chính xác (structured data, lưu chỗ đã biết) và gọn context (chỉ nạp phần cần).',
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Từ khoá nhận diện đáp án',
          text: 'Thường **đúng**: "có cấu trúc", "manifest", "ánh xạ ý – nguồn", "kèm ngày tháng trong output", "coordinator điều phối loop". Thường là **bẫy**: "regex", "tương đồng ngữ nghĩa", "phân tích log", "nhấn mạnh trong prompt".',
        },
      ],
    },
    {
      id: 'guardrails-escalation',
      title: 'Guardrail, hook & chuyển giao cho con người',
      summary: 'Quy tắc bắt buộc phải chặn bằng code (hook/tool), khi nào escalate, và handoff sao cho người nhận làm được ngay.',
      questionIds: [29, 30, 31, 32, 33, 37, 38, 98, 99, 105, 191],
      blocks: [
        {
          type: 'tldr',
          text: 'Prompt chỉ làm model **có khả năng cao** làm đúng, không bao giờ **chắc chắn 100%**. Quy tắc nào **bắt buộc** (vd. hoàn tiền > $500 phải có người duyệt) thì phải chặn bằng **code nằm ngoài model**: hook hoặc chính tool. Còn quyết định *khi nào* escalate thì là việc cần phán đoán — cứ để model quyết theo tiêu chí rõ ràng.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Guardrail', meaning: '"Lan can": cơ chế ngăn agent làm điều không được phép.' },
            { term: 'Deterministic', meaning: 'Luôn cho cùng một kết quả, 100% lần — khác với model, vốn có xác suất.' },
            { term: 'Hook', meaning: 'Đoạn code chạy tự động tại một thời điểm cố định, vd. **trước** mỗi lần gọi tool.' },
            { term: '`PreToolUse`', meaning: 'Hook chạy ngay trước khi tool được gọi — có thể chặn lời gọi đó.' },
            { term: 'Escalate', meaning: 'Chuyển vụ việc lên cho người thật xử lý.' },
            { term: 'Handoff', meaning: 'Bản handoff gửi kèm khi escalate.' },
          ],
        },

        { type: 'h', text: '1. Quy tắc bắt buộc phải chặn bằng code' },
        {
          type: 'p',
          text: 'Giống biển báo "cấm vào" và cái barie: biển báo (prompt) khiến hầu hết mọi người dừng lại, nhưng vẫn có người vượt. Barie (hook / tool) thì **không ai qua được**. Nếu đề nói "**bắt buộc**", "**không được để model tự quyết**", "**100%**" → cần barie.',
        },
        {
          type: 'table',
          headers: ['Cơ chế', 'Chắc chắn 100%?', 'Ghi chú'],
          rows: [
            ['System prompt, viết IN HOA "CRITICAL"', 'Không', 'Chỉ giảm xác suất sai (vẫn còn vài % lỗi).'],
            ['Few-shot examples', 'Không', 'Chỉ đẩy hành vi về hướng mong muốn.'],
            ['Tool trả lỗi "hãy escalate"', 'Một phần', 'Vẫn phụ thuộc model hiểu và làm theo.'],
            ['**Hook chặn tool call khi số tiền > 500**', '**Có**', 'Chạy mọi lần, không phụ thuộc model.'],
            ['**Tool tự kiểm tra ngưỡng**', '**Có**', '≤ ngưỡng → tự chi tiền; > ngưỡng → tạo yêu cầu phê duyệt đang chờ.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Bẫy: trông như kiểm soát nhưng không phải',
          text: 'Parameter `approved_by_manager` mà **chính agent tự điền** → agent có thể tự điền "true", không chống giả được. Hook chỉ **gắn thêm cờ vào context** rồi để tool tự xem → gián tiếp, có thể bị bỏ qua. Kiểm tra (audit) mỗi đêm → chỉ **phát hiện sau khi đã sai**, không ngăn được.',
        },

        { type: 'h', text: '2. Khi nào nên escalate' },
        {
          type: 'p',
          text: 'Quyết định escalate cần hiểu **ý định và tình hình** của khách — việc model làm tốt. Hãy viết tiêu chí rõ bằng lời thường. Escalate khi:',
        },
        {
          type: 'list',
          items: [
            'Khách **yêu cầu gặp người thật**.',
            'Vấn đề cần **ngoại lệ chính sách** (agent không có quyền cho).',
            'Agent **không thể tiến triển thêm** một cách có ý nghĩa.',
          ],
        },
        {
          type: 'p',
          text: 'Luật cứng như "sai 3 lần thì chuyển", "điểm cảm xúc < 0.3 thì chuyển" hay một rules engine thì hoặc chuyển quá sớm, hoặc quá muộn, hoặc gãy trước tình huống chưa lường trước.',
        },
        {
          type: 'table',
          headers: ['Tình huống', 'Nên làm'],
          rows: [
            ['Khách bực, đòi gặp người — nhưng agent **đã xác nhận** đơn hoàn trả hợp lệ, xử lý được ngay', 'Ghi nhận cảm xúc, nói rõ **có thể giải quyết ngay**, hỏi khách muốn hoàn tất luôn hay vẫn muốn gặp người — để khách chọn.'],
            ['Khách bực, đòi gặp người — agent **chưa tra cứu gì**', 'Ghi nhận cảm xúc + hỏi **một** câu ngắn để hiểu vấn đề trước khi chuyển.'],
            ['Tool `process_refund` bị timeout, dù đã xác minh đủ điều kiện', 'Nói thật: đã xác nhận đủ điều kiện, hệ thống đang lỗi; đề nghị escalate hoặc retry sau. **Không** nói "đã hoàn tiền".'],
            ['Giữa chừng phát hiện việc **vượt quyền hạn** của agent', 'Viết **bản handoff có cấu trúc** rồi gọi `escalate_to_human`. Không cố tự xử lý.'],
          ],
        },

        { type: 'h', text: '3. Bản handoff: người nhận phải làm được ngay' },
        {
          type: 'p',
          text: 'Người nhận **không đọc được** cuộc hội thoại trước đó. Bản handoff phải đủ để họ hành động ngay mà không phải điều tra lại.',
        },
        {
          type: 'example',
          scenario: 'Agent cần chuyển một vụ hoàn tiền phức tạp cho nhân viên. Gửi gì?',
          right: '**Tóm tắt có cấu trúc**: mã khách hàng, nguyên nhân gốc, số tiền, hành động đề xuất.',
          wrong: [
            'Lời phàn nàn gốc + trích tool result — nhân viên phải tự điều tra lại.',
            'Toàn bộ transcript 25 lượt — quá dài để đọc.',
            'Chỉ chẩn đoán + số tiền — thiếu mã khách và đề xuất.',
          ],
          why: 'Handoff tốt = người nhận đọc xong là hành động được.',
        },

        { type: 'h', text: '4. Đảm bảo session nào cũng có kết thúc đúng' },
        {
          type: 'example',
          scenario: 'Yêu cầu: mọi cuộc hội thoại **phải** kết thúc bằng "đã giải quyết" hoặc "đã escalate", kể cả khi loop dừng vì chạm `max_turns`.',
          right: 'Viết **code ở orchestration layer**: mỗi khi loop dừng, kiểm tra kết quả; nếu chưa giải quyết thì **tự gọi `escalate_to_human` bằng code**, kèm context đã có.',
          wrong: ['Dặn trong prompt "trước khi hết lượt hãy escalate".', 'Chia quy trình làm hai nửa.'],
          why: 'Những cách đó chỉ *giảm* khả năng bị sót; chỉ code chạy sau loop mới *đảm bảo*.',
        },

        { type: 'h', text: '5. Tách "xem trước" khỏi "thực hiện"' },
        {
          type: 'list',
          items: [
            'Parameter `dry_run` bị model bỏ qua 15% số lần? Tách thành **hai tool**: `preview_…` trả về tác động + **mã xác nhận dùng một lần**; `execute_…` **bắt buộc có mã đó**. Nhờ vậy không thể thực hiện thứ chưa xem trước.',
            'Xoá liên hệ (`delete_contact`) mà có nhiều bản ghi trùng tên: hiện các bản ghi khớp kèm trường phân biệt (email, công ty…) và yêu cầu **một cú nhấp xác nhận đúng người** — ít sai mà không thêm nhiều bước.',
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Nhớ nhanh',
          text: 'Có chữ "bắt buộc / luôn luôn / 100%" → **hook hoặc tool tự kiểm tra**, không phải prompt. Khi nào escalate → **model phán đoán** theo tiêu chí rõ. Handoff → **tóm tắt có cấu trúc**. Mọi session phải kết thúc đúng → **code sau loop**.',
        },
      ],
    },
    {
      id: 'sessions-exploration',
      title: 'Quản lý session: resume, fork & khám phá codebase',
      summary: 'Khi nào dùng resume, continue, fork hay session mới; xử lý khi context quá đầy trong session khám phá dài.',
      questionIds: [28, 45, 48, 49, 51, 52, 53, 54, 55],
      blocks: [
        {
          type: 'tldr',
          text: 'Một **session** là một cuộc hội thoại với Claude Code kèm toàn bộ context của nó. Muốn làm tiếp thì **resume**; muốn thử hai hướng khác nhau từ cùng một điểm thì **fork**; dữ liệu cũ đã sai thì **mở session mới** kèm bản tóm tắt. Session càng dài thì context càng "đặc" và chất lượng giảm — hãy ghi chú ra file và giao việc nhỏ cho subagent.',
        },
        {
          type: 'terms',
          items: [
            { term: '`--resume <tên|ID>`', meaning: 'Mở lại **đúng** một session cũ theo tên hoặc ID.' },
            { term: '`--continue`', meaning: 'Mở lại session **gần nhất** (bất kể là session nào).' },
            { term: 'Fork (`--fork-session`)', meaning: 'Tách một nhánh mới từ session cũ: giữ nguyên context, có ID mới, session gốc không bị đổi.' },
            { term: 'Scratchpad', meaning: 'File nháp để agent ghi lại những phát hiện quan trọng, đọc lại khi cần.' },
          ],
        },

        { type: 'h', text: '1. Chọn đúng cách làm tiếp' },
        {
          type: 'table',
          headers: ['Bạn muốn…', 'Dùng'],
          rows: [
            ['Làm tiếp **đúng session có tên** hôm qua (vd. `auth-deep-dive`)', '`claude --resume auth-deep-dive`'],
            ['Làm tiếp cuộc hội thoại **gần nhất**', '`--continue` — nhưng không hợp nếu sau đó bạn đã làm ở codebase khác.'],
            ['Thử **hai hướng độc lập** từ cùng một phân tích', '**Fork**: CLI `--fork-session`, hoặc SDK `fork_session=True` + `resume`. Mỗi nhánh có context phân tích chung, không ảnh hưởng nhau.'],
            ['Session cũ, nhưng **code đã thay đổi** từ đó tới giờ', '**Resume** rồi **nói rõ file/hàm nào đã đổi** để agent phân tích lại đúng chỗ.'],
            ['Session cũ chứa **tool result đã lỗi thời**', '**Session mới** + tóm tắt có cấu trúc của lần trước (loại vấn đề, đã làm gì, đang ở đâu), rồi **gọi tool lấy dữ liệu mới**.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Bẫy phổ biến',
          text: 'Resume mà **không nói** file đã đổi → agent vẫn dựa vào hiểu biết cũ. Xoá `tool_result` ở giữa hội thoại → hội thoại tự mâu thuẫn. Dặn "ưu tiên kết quả mới nhất" → chỉ là gợi ý. Gọi lại **mọi** tool cũ khi bắt đầu → tốn công mà dữ liệu cũ vẫn nằm trong context.',
        },
        {
          type: 'example',
          scenario: 'Sau khi phân tích xong, bạn muốn thử cả hai cách sửa: dùng thư viện A và tự viết lại. Làm thế nào?',
          right: '**Fork** session thành hai nhánh — mỗi nhánh thử một cách, cùng xuất phát từ một bản phân tích.',
          wrong: [
            'Thử lần lượt cả hai trong cùng một session — hai hướng **lẫn vào nhau** trong context.',
            'Mở hai session mới hoàn toàn — phải phân tích lại từ đầu, và hai session có thể hiểu codebase khác nhau.',
          ],
          why: 'Fork giữ chung điểm xuất phát nhưng tách biệt hai hướng thử.',
        },

        { type: 'h', text: '2. Session khám phá dài: context bị "quá tải"' },
        {
          type: 'p',
          text: 'Giống đọc tài liệu liền 5 tiếng: càng về sau càng nhớ nhầm, trả lời chung chung. Dấu hiệu context đã quá đầy:',
        },
        {
          type: 'list',
          items: [
            'Trả lời bằng "mẫu thiết kế chung chung" thay vì tên lớp cụ thể trong code.',
            'Mô tả cấu trúc **không nhất quán** với điều đã nói trước đó.',
            'Sau khoảng 8 file, accuracy giảm rõ.',
          ],
        },
        {
          type: 'table',
          headers: ['Cách xử lý', 'Làm thế nào'],
          rows: [
            ['**Scratchpad file**', 'Agent ghi phát hiện quan trọng ra file, cần thì đọc lại — không phụ thuộc context đang đầy cỡ nào.'],
            ['**Subagent cho câu hỏi hẹp**', 'Giao việc có phạm vi rõ ("tìm mọi file test của payment", "lần theo luồng refund") cho subagent có context mới; agent chính chỉ giữ **bức tranh tổng**.'],
            ['**Tóm tắt rồi giao tiếp**', 'Nén phát hiện quan trọng (vd. `VulkanPipeline`, `FrameGraph`) thành bản tóm tắt, dùng làm context khởi đầu cho subagent khám phá phần tiếp theo.'],
            ['**Resume subagent** khi mất kết nối', 'Giữ lại 30 phút khám phá, chỉ báo thêm phần đã thay đổi.'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Sai lầm cần tránh',
          text: '`/clear` sạch toàn bộ (mất hết hiểu biết). Tự xoá context mỗi 15 phút. Đổi sang model có cửa sổ lớn hơn — không chữa được việc "loãng chú ý". Tóm tắt mọi file **trước khi** khám phá — mất chi tiết.',
        },
      ],
    },
  ],
}
