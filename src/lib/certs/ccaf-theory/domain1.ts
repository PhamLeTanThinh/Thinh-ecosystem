import type { TheoryDomain } from './types'

export const DOMAIN_1: TheoryDomain = {
  id: 'agentic',
  number: 1,
  title: 'Kiến trúc Agentic & Điều phối',
  weight: 27,
  summary: 'Vòng lặp agent, các mẫu chia nhỏ tác vụ, hệ thống nhiều agent (coordinator – subagent), truyền trạng thái, guardrail và quản lý phiên.',
  topics: [
    {
      id: 'agent-loop-patterns',
      title: 'Agentic loop & các mẫu chia nhỏ tác vụ',
      summary: 'Claude tự quyết từng bước như thế nào, 5 mẫu workflow nên chọn khi nào, và cách chia một việc lớn chưa rõ ràng.',
      questionIds: [1, 2, 3, 4, 13, 36, 56, 85, 149, 193, 196],
      blocks: [
        {
          type: 'tldr',
          text: '**Agent** = Claude tự quyết từng bước. Ứng dụng của bạn chỉ làm "tay chân": chạy tool Claude yêu cầu rồi đưa kết quả lại cho Claude. Ngược lại, nếu các bước đã **biết trước** thì đó là **workflow** — bạn viết sẵn quy trình, Claude chỉ làm từng bước. Việc càng rõ ràng thì càng nên dùng cách đơn giản.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Tool', meaning: 'Một hàm do bạn viết (tra đơn hàng, tìm web...) mà Claude được phép "nhờ" gọi.' },
            { term: '`tool_use`', meaning: 'Claude trả lời: "tôi muốn gọi tool X với tham số Y". Claude không tự chạy được, ứng dụng phải chạy giúp.' },
            { term: '`tool_result`', meaning: 'Kết quả tool mà ứng dụng gửi ngược lại cho Claude, được thêm vào cuộc hội thoại.' },
            { term: '`end_turn`', meaning: 'Claude báo đã xong, không cần gọi thêm tool nào → vòng lặp dừng.' },
          ],
        },

        { type: 'h', text: '1. Vòng lặp agent chạy thế nào' },
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
          right: 'Kết quả tool được thêm vào hội thoại → Claude tự suy ra "đã quá hạn hoàn tiền" → chọn gọi `escalate_to_human` thay vì `process_refund`.',
          wrong: [
            'Một cây quyết định (if/else) viết cứng trong code.',
            'Một kế hoạch đã lập sẵn từ đầu cuộc hội thoại.',
            'Một tầng điều phối tự chuyển tool dựa trên trường `status`.',
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
            ['**Prompt chaining** (nối chuỗi)', 'Dây chuyền: xong bước 1 mới sang bước 2.', 'Các bước **cố định**, input nào cũng đi qua đúng các bước đó.', 'Review mọi PR theo 3 bước: style → bảo mật → tài liệu, rồi gộp kết quả.'],
            ['**Routing** (phân luồng)', 'Lễ tân hỏi bạn cần gì rồi chỉ đúng phòng.', 'Input thuộc **nhiều loại**, mỗi loại cần cách xử lý riêng.', 'Phân loại PR là feature / bugfix / refactor rồi review theo kiểu riêng.'],
            ['**Parallelization** (song song)', 'Chia việc cho nhiều người làm cùng lúc.', 'Các việc con **không phụ thuộc nhau**; hoặc chạy nhiều lần để lấy ý kiến đa số.', 'Tìm trên web và phân tích tài liệu cùng một lúc.'],
            ['**Orchestrator-workers** (trưởng nhóm – thành viên)', 'Trưởng nhóm tự nghĩ ra cần làm những việc gì rồi giao.', '**Không đoán trước** được cần những việc con nào.', 'Hệ thống nghiên cứu: coordinator tự quyết cần tra những gì.'],
            ['**Evaluator-optimizer** (viết – chấm)', 'Một người viết, một người chấm, sửa tới khi đạt.', 'Có **tiêu chí đánh giá rõ ràng**.', 'Phân tích → thấy còn thiếu → tìm thêm → phân tích lại.'],
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
            'Đọc hết 200 file trước (tốn ngữ cảnh và thời gian).',
            'Chia đều theo thư mục theo lịch cố định (bỏ qua mức độ quan trọng).',
            'Làm lần lượt theo bảng chữ cái (tuỳ tiện, không có kế hoạch).',
            'Lên kế hoạch chi tiết **trước khi** khám phá ("kế hoạch mù").',
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
      summary: 'Ngữ cảnh cô lập, công cụ Task, chạy song song, phân cấp phẳng, giao mục tiêu thay vì thủ tục, và giới hạn công cụ mỗi agent.',
      questionIds: [6, 7, 8, 13, 14, 16, 17, 20, 27, 82, 83, 85, 87, 90, 148, 152, 193, 195],
      blocks: [
        { type: 'h', text: 'Kiến trúc hub-and-spoke' },
        {
          type: 'p',
          text: 'Trong mẫu **coordinator (orchestrator) – subagent**, coordinator là trung tâm: nó nhận đầu ra từ subagent này và **chủ động đưa phần liên quan vào prompt** của subagent kế tiếp. Subagent **không** gọi trực tiếp nhau, không đăng ký sự kiện qua message queue, và không tự "thừa hưởng" ngữ cảnh của coordinator.',
        },
        {
          type: 'list',
          items: [
            '**Ngữ cảnh cô lập**: mỗi lần gọi subagent là một phiên/API call độc lập, không nhớ gì ngoài prompt được cấp. Subagent báo "không có dữ liệu nghiên cứu" ⇒ nguyên nhân là coordinator **quên đưa kết quả vào prompt** (Q16).',
            'Đưa thông tin bằng cách nào: prompt trực tiếp (gọn, ít dữ liệu), hoặc **lưu artifact ra kho chung và truyền mã tham chiếu** khi dữ liệu lớn (Q11) — hiệu quả token hơn nhồi 80–120K token vào prompt.',
            'Không có "callback giữa các subagent" và không có "kế thừa ngữ cảnh tự động".',
          ],
        },
        { type: 'h', text: 'Vì sao subagent không chạy? (AgentDefinitions & Task)' },
        {
          type: 'p',
          text: 'Trong Claude Agent SDK, subagent được khai báo bằng `AgentDefinition` (mô tả, prompt, giới hạn tool) và được **khởi chạy thông qua tool `Task`**. Nếu `allowedTools` của coordinator **không có `"Task"`**, coordinator vẫn "nói" là sẽ giao việc nhưng không có cơ chế nào thực sự spawn subagent — không lỗi, không log — rồi tiếp tục với thông tin thiếu (Q7/87).',
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Phân biệt triệu chứng',
          text: '`max_tokens` quá thấp → tool call bị cắt và có lỗi/hành vi khác. Thiếu mô tả subagent trong system prompt → model không biết có subagent. **Nói giao việc mà không thấy thực thi và không có lỗi = thiếu "Task" trong allowedTools.**',
        },
        { type: 'h', text: 'Chạy song song' },
        {
          type: 'list',
          items: [
            'Hai subagent độc lập (web search, document analysis)? Coordinator phát **nhiều tool call `Task` trong CÙNG MỘT message trả lời**; harness chạy các `tool_use` cùng lượt đồng thời (Q6/83/195).',
            'Sai: đổi sang model nhỏ (chỉ nhanh từng bước tuần tự), dựng tầng async ngoài agent (trùng lặp thứ vòng lặp agent đã có), hay chỉ **dặn trong system prompt** rằng "hãy song song" (không đảm bảo cơ chế cấu trúc).',
            'Độ trễ vì phải phân tích 12 tiền lệ tuần tự (Q8/82): coordinator **tự spawn nhiều subagent song song**, mỗi subagent một phần tiền lệ, rồi tổng hợp — vẫn giữ giám sát/gỡ lỗi tập trung.',
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Phân cấp phẳng (flat hierarchy)',
          text: 'Đáp án đúng luôn để **coordinator spawn trực tiếp** các subagent. Subagent tự spawn subagent, cây đệ quy, hay hàng đợi bất đồng bộ đều làm mất khả năng quan sát/gỡ lỗi của coordinator.',
        },
        { type: 'h', text: 'Giao việc bằng mục tiêu, không bằng thủ tục' },
        {
          type: 'p',
          text: 'Nếu coordinator ra chỉ thị từng bước (truy vấn chính xác, bộ lọc ngày…), subagent thành giòn: báo "không đủ kết quả" thay vì thử hướng khác, kém với chủ đề mới, hiếm khi phát hiện nguồn lân cận có giá trị (Q14). Cách tốt hơn: nêu **mục tiêu nghiên cứu và tiêu chí chất lượng** (độ phủ, đa dạng nguồn, độ mới) để subagent tự chọn chiến lược.',
        },
        {
          type: 'table',
          headers: ['Cách giao việc', 'Kết quả'],
          rows: [
            ['Thủ tục chi tiết từng bước', 'Giòn, không thích ứng, bỏ lỡ nguồn ngoài dự kiến.'],
            ['Chỉ nói "research X thoroughly"', 'Thiếu định hướng — giao việc **quá mơ hồ** cũng là lỗi.'],
            ['**Mục tiêu + tiêu chí chất lượng**', 'Cân bằng: rõ đích, tự do về cách đi.'],
          ],
        },
        { type: 'h', text: 'Mỗi agent chỉ nên có ít tool phù hợp vai trò' },
        {
          type: 'p',
          text: 'Cho cả bốn subagent quyền dùng **18 tool** khiến agent gọi tool ngoài chuyên môn (synthesis đi web search…). Nguyên nhân gốc là **độ phức tạp lựa chọn** vượt ngưỡng đáng tin cậy; độ chính xác chọn tool giảm khi số tool — nhất là tool không liên quan — tăng. Chỉ cấp **4–5 tool đúng vai trò** cho mỗi subagent (Q27/148).',
        },
        { type: 'h', text: 'Khi nào KHÔNG nên spawn subagent' },
        {
          type: 'p',
          text: 'Coordinator đã có 80K+ token phát hiện trong ngữ cảnh mà vẫn spawn subagent tổng hợp cho mỗi câu "tóm tắt giúp tôi" → chuyển 80K token mỗi lần, 40+ giây. Hãy để **coordinator tự xử lý các yêu cầu tóm tắt đơn giản**, chỉ spawn subagent khi cần cửa sổ ngữ cảnh riêng hoặc song song có giá trị (Q17/152).',
        },
      ],
    },
    {
      id: 'multi-agent-state',
      title: 'Truyền trạng thái & nguồn gốc dữ liệu giữa các agent',
      summary: 'Giữ trích dẫn qua các lần tóm tắt, vòng phản hồi khi thiếu thông tin, khôi phục sau sự cố, và trình bày dữ liệu không đồng nhất.',
      questionIds: [5, 9, 10, 11, 12, 18, 19, 21, 22, 78, 79, 80, 81, 84, 86, 88, 89, 91, 147],
      blocks: [
        { type: 'h', text: 'Nguyên tắc: siêu dữ liệu đi cùng dữ liệu, dạng có cấu trúc' },
        {
          type: 'p',
          text: 'Mọi lỗi kiểu "mất trích dẫn", "hiểu nhầm thời gian", "không biết claim nào từ nguồn nào" đều có gốc chung: **thông tin nguồn/ngữ cảnh bị rơi rụng ở bước tóm tắt**. Cách sửa nhất quán trong đề: bắt các agent xuất **dữ liệu có cấu trúc** tách riêng *nội dung* và *siêu dữ liệu*, và agent tổng hợp phải bảo toàn/gộp chúng.',
        },
        {
          type: 'table',
          headers: ['Vấn đề', 'Cách đúng', 'Vì sao cách khác sai'],
          rows: [
            ['Synthesis mất trích dẫn (Q9/18/88)', 'Subagent xuất **ánh xạ claim → nguồn** (URL, tên tài liệu, trang); synthesis bắt buộc giữ và gộp.', 'Tiền tố văn bản dễ vỡ; phân tích log/đối sánh ngữ nghĩa sau đó không tin cậy và tốn kém.'],
            ['Report generator cần cite (Q19/91)', 'Truyền **bản nháp + chỉ mục nguồn có cấu trúc** (claim → URL + trích đoạn).', 'Gán trích dẫn sau khi sinh báo cáo dễ sai; truyền toàn bộ ngữ cảnh (120K+ token) lãng phí.'],
            ['Số liệu 2024 vs 2022 bị coi là "mâu thuẫn" (Q21/78)', 'Yêu cầu subagent kèm **ngày công bố/thu thập** trong đầu ra có cấu trúc.', 'Bỏ dữ liệu cũ mất xu hướng; giới hạn 6 tháng mất bối cảnh lịch sử; "luôn tin dữ liệu mới" chỉ là quy tắc prompt.'],
            ['Kết quả trái chiều, độ bất định (Q22/84/147)', 'Báo cáo có **mục riêng** phân biệt kết luận vững chắc và kết luận còn tranh cãi, giữ nguyên đặc trưng nguồn + phương pháp.', 'Lọc ngưỡng tin cậy mất bằng chứng; chuẩn hoá về xác suất 0–1 xoá khác biệt phương pháp; yêu cầu ≥2 nguồn loại bỏ phát hiện hợp lệ đơn nguồn.'],
            ['Nhiều loại nội dung (JSON tài chính, văn xuôi tin tức, danh sách bằng sáng chế) (Q12/86)', 'Synthesis **render đúng dạng từng loại**: bảng cho số liệu, văn xuôi cho tin tức.', 'Mọi cách "chuẩn hoá về một dạng chung" lặp lại đúng lỗi làm phẳng (bullet).'],
          ],
        },
        { type: 'h', text: 'Vòng phản hồi khi phát hiện thiếu thông tin' },
        {
          type: 'p',
          text: 'Pipeline tuyến tính một chiều làm thông tin "thiếu chi tiết về token refresh" đến quá muộn. Cách chuẩn (Q10/79/81): agent phân tích **báo cáo khoảng trống cụ thể** cho coordinator → coordinator kích hoạt **tìm kiếm có mục tiêu** rồi chạy lại phân tích, lặp tới khi đủ. Chỉ "ghi chú giới hạn cho người dùng", tăng độ rộng truy vấn ban đầu, hay cho synthesis quyền web search trực tiếp đều không đóng được vòng lặp có kiểm soát.',
        },
        { type: 'h', text: 'Khôi phục sau sự cố (crash-resume)' },
        {
          type: 'p',
          text: 'Pipeline sập sau 12/28 tài liệu (Q5/80). Cân bằng độ trung thực và hiệu quả ngữ cảnh: **mỗi agent lưu bản xuất có cấu trúc vào vị trí đã biết**; khi resume, coordinator nạp **manifest** rồi chỉ **tiêm phần trạng thái liên quan** vào prompt từng agent.',
        },
        {
          type: 'list',
          items: [
            'Mỗi agent tự giữ file trạng thái và tự nạp: thiếu logic resume phối hợp.',
            'Lưu nguyên log hội thoại của coordinator: tràn ngữ cảnh.',
            'Vector store + tìm kiếm ngữ nghĩa: **lossy**, có thể bỏ sót hoặc làm sai lệch kết quả trước đó.',
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Từ khoá nhận diện đáp án',
          text: '"Có cấu trúc", "manifest", "ánh xạ claim–nguồn", "ngày tháng trong đầu ra", "coordinator điều phối vòng lặp" — thường là đáp án đúng. "Regex", "tương đồng ngữ nghĩa", "log analysis", "prompt nhấn mạnh" — thường là bẫy.',
        },
      ],
    },
    {
      id: 'guardrails-escalation',
      title: 'Guardrail, hook & chuyển giao cho con người',
      summary: 'Quy tắc bắt buộc phải nằm ngoài model (hook), tiêu chí escalate, bàn giao có cấu trúc, và đảm bảo mọi phiên đều kết thúc đúng cách.',
      questionIds: [29, 30, 31, 32, 33, 37, 38, 98, 99, 105, 189, 191, 204],
      blocks: [
        { type: 'h', text: 'Quy tắc tuân thủ phải là xác định (deterministic)' },
        {
          type: 'p',
          text: 'Khi luật nói "hoàn tiền > $500 **bắt buộc** chuyển người thật, không để model tự quyết", mọi giải pháp chỉ dựa vào prompt (nhấn mạnh CRITICAL, few-shot, mô tả tool) đều **không thể đạt 100%** — chúng chỉ dịch chuyển xác suất (3% lỗi vẫn còn). Cần cơ chế nằm **ngoài** model: **hook** chặn tool call (`PreToolUse`) hoặc kiểm soát trong chính tool.',
        },
        {
          type: 'table',
          headers: ['Cơ chế', 'Đảm bảo?', 'Ghi chú'],
          rows: [
            ['System prompt / emphatic language', 'Không', 'Giảm xác suất, không loại bỏ.'],
            ['Few-shot examples', 'Không', 'Dịch chuyển phân phối hành vi.'],
            ['Tool trả lỗi "hãy escalate"', 'Một phần', 'Vẫn phụ thuộc model hiểu lỗi và làm theo.'],
            ['**Hook chặn tool call khi amount > 500**', '**Có**', 'Chạy mọi lần, độc lập với hành vi model.'],
            ['**Tool tự thực thi ngưỡng** (Q99)', '**Có**', '≤ ngưỡng → tự giải ngân; > ngưỡng → tạo yêu cầu phê duyệt đang chờ. Tham số `approved_by_manager` do agent tự đặt là **không** chống giả mạo.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Bẫy trong Q99',
          text: 'Hook `PreToolUse` chỉ **thêm cờ vào ngữ cảnh** rồi để tool tự kiểm tra là gián tiếp và có thể bị vượt; kiểm audit hằng đêm là **phát hiện sau sự việc**, không phải ngăn chặn. Ngưỡng phải được **thi hành bên trong tool** (hoặc hook chặn thật sự).',
        },
        { type: 'h', text: 'Khi nào agent nên escalate' },
        {
          type: 'p',
          text: 'Escalation là **phán đoán về ý định và tiến triển** — điều LLM làm tốt. Tiêu chí bằng ngôn ngữ tự nhiên rõ ràng (Q29): khi khách **yêu cầu người thật**, khi vấn đề cần **ngoại lệ chính sách**, hoặc khi agent **không thể tiến triển có ý nghĩa**. Các quy tắc cứng (đếm số lần lỗi, ngưỡng sentiment, rules engine) hoặc kích hoạt quá sớm, quá muộn, hoặc gãy với các trường hợp không lường trước.',
        },
        {
          type: 'table',
          headers: ['Tình huống', 'Hành động đúng'],
          rows: [
            ['Khách bực, đòi gặp người, agent **đã xác nhận** đơn hoàn trả hợp lệ xử lý được ngay (Q33)', 'Ghi nhận cảm xúc, nói rõ **giải quyết được ngay**, đề nghị hoàn tất hoặc escalate — giữ quyền lựa chọn cho khách.'],
            ['Khách bực, đòi gặp người, **chưa gọi tool nào** (Q37)', 'Ghi nhận + hỏi **một** câu tập trung để hiểu vấn đề trước khi chuyển.'],
            ['Tool `process_refund` timeout nhưng đã xác minh đủ (Q32)', '**Suy giảm mềm**: giải thích khoản phí, xác nhận đủ điều kiện, nói thật về sự cố, đề nghị escalate hoặc thử lại sau. Không hứa "đã xử lý".'],
            ['Vượt hạn mức uỷ quyền giữa chừng (Q38/189)', 'Soạn **bàn giao có cấu trúc** (khách, đơn, vấn đề, lý do vượt quyền) rồi mới `escalate_to_human`. Không cố xử lý vượt quyền.'],
          ],
        },
        { type: 'h', text: 'Bàn giao (handoff) phải đủ để người tiếp nhận hành động ngay' },
        {
          type: 'p',
          text: 'Người thật **không có transcript**. Q30: gửi **tóm tắt có cấu trúc** gồm mã khách, nguyên nhân gốc, số tiền, hành động đề xuất. Không gửi: lời phàn nàn gốc + trích kết quả tool (buộc họ điều tra lại), toàn bộ transcript (lội 25 lượt), hay chỉ chẩn đoán + số tiền (thiếu định danh và đề xuất).',
        },
        { type: 'h', text: 'Đảm bảo mọi phiên đều kết thúc đúng' },
        {
          type: 'p',
          text: 'Nếu mục tiêu là **mọi tương tác đều kết thúc bằng giải quyết hoặc escalate, dù vòng lặp dừng vì lý do gì** (ví dụ chạm `max_turns` — Q191), giải pháp đảm bảo duy nhất là **mã ở tầng orchestration** kiểm tra kết quả sau mỗi lần vòng lặp kết thúc và **gọi `escalate_to_human` bằng lập trình** kèm ngữ cảnh đã tích luỹ. Hướng dẫn trong prompt hay chia đôi quy trình chỉ *giảm* khả năng, không *đảm bảo*.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Tách xác nhận khỏi thực thi (Q98, Q105)',
          text: 'Tham số `dry_run` bị bỏ qua 15%? Tách thành hai tool: `preview_…` trả về tác động + **token xác nhận dùng một lần**; `execute_…` **bắt buộc token** đó — buộc việc thực thi gắn với hành động đã xem trước. Với `delete_contact` có nhiều bản ghi trùng tên: hiển thị các bản ghi khớp cùng trường phân biệt và yêu cầu **một cú nhấp xác nhận đúng đối tượng** — giảm sai sót mà không thêm nhiều bước.',
        },
      ],
    },
    {
      id: 'sessions-exploration',
      title: 'Quản lý phiên: resume, fork & khám phá codebase',
      summary: 'Khi nào --resume, --continue, fork_session hay phiên mới; cách xử lý dữ liệu cũ, ngữ cảnh phình to và khám phá dài.',
      questionIds: [28, 45, 48, 49, 51, 52, 53, 54, 55, 162, 163, 165, 194],
      blocks: [
        { type: 'h', text: 'Chọn đúng cách tiếp tục công việc' },
        {
          type: 'table',
          headers: ['Nhu cầu', 'Cách làm'],
          rows: [
            ['Tiếp tục **đúng phiên có tên** đã dùng hôm qua (Q45/162)', '`claude --resume auth-deep-dive` — `--resume` nhận **tên hoặc ID** phiên.'],
            ['Tiếp tục cuộc hội thoại **gần nhất**', '`--continue` (không phù hợp nếu bạn đã làm việc ở codebase khác sau đó).'],
            ['Thử **hai hướng độc lập** từ cùng một phân tích (Q51/54/194)', '**`fork_session`** (CLI `--fork-session`, SDK `fork_session=True` + `resume`): tạo nhánh mới có ID mới, giữ nguyên ngữ cảnh phân tích, phiên gốc không đổi.'],
            ['Phiên cũ + **file đã thay đổi** (Q48/52)', '**Resume** rồi **báo cho agent biết cụ thể file/hàm nào đã đổi** để phân tích lại có mục tiêu.'],
            ['Phiên cũ chứa **kết quả tool lỗi thời** (Q28)', 'Phiên **mới** + tóm tắt có cấu trúc lần trước (loại vấn đề, hành động, tình trạng) rồi **gọi tool lấy dữ liệu mới** trước khi làm việc.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Bẫy phổ biến',
          text: 'Resume mà **không nói** file đã đổi → agent dựa vào hiểu biết lỗi thời. Xoá `tool_result` khỏi giữa hội thoại → transcript mâu thuẫn nội bộ. Dặn "ưu tiên kết quả mới nhất" trong prompt → chỉ là gợi ý, lỗi vẫn xảy ra. Gọi lại **tất cả** tool cũ khi bắt đầu → lãng phí mà dữ liệu cũ vẫn nằm trong ngữ cảnh.',
        },
        {
          type: 'p',
          text: 'Chia sẻ hai nhánh theo trình tự trong cùng luồng (Q54) khiến hai phương án **nhiễm chéo** ngữ cảnh; tạo hai phiên mới thì phải đọc lại và có nguy cơ hai phiên lệch nhau khỏi cùng một baseline.',
        },
        { type: 'h', text: 'Phiên khám phá dài: ngữ cảnh xuống cấp' },
        {
          type: 'p',
          text: 'Dấu hiệu ngữ cảnh phình to và xuống cấp: trả lời bằng "mẫu chung chung" thay vì tên lớp cụ thể (Q49), trả lời không nhất quán về cấu trúc đã bàn (Q53), sau 8 file độ chính xác giảm (Q55). Các cách xử lý:',
        },
        {
          type: 'list',
          items: [
            '**Scratchpad file** (Q53/165): agent ghi phát hiện quan trọng ra file và tham chiếu khi cần — bộ nhớ bền, không phụ thuộc độ đông đúc của ngữ cảnh.',
            '**Subagent cho câu hỏi cụ thể** (Q55): giao các điều tra có phạm vi rõ ("tìm mọi file test của payment", "truy vết luồng refund") cho subagent có ngữ cảnh mới; agent chính giữ **bức tranh cấp cao**.',
            '**Tóm tắt + subagent** (Q49): nén phát hiện quan trọng (VulkanPipeline, FrameGraph…) thành bản tóm tắt rồi đưa vào ngữ cảnh khởi đầu của subagent khám phá phần tiếp theo.',
            '**Resume subagent** từ transcript khi kết nối rớt (Q48): giữ 30 phút khám phá, chỉ báo phần đã thay đổi.',
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Sai lầm cần tránh',
          text: '`/clear` toàn bộ (mất kiến thức), xoá ngữ cảnh tự động mỗi 15 phút, nâng model chỉ để có cửa sổ lớn hơn (không giải quyết suy giảm chú ý), tóm tắt toàn bộ file trước khi khám phá (mất chi tiết).',
        },
      ],
    },
  ],
}
