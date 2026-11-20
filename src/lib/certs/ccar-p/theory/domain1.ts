import type { TheoryDomain } from '../../ccaf-theory/types'

export const DOMAIN_1: TheoryDomain = {
  id: 'solution-design',
  number: 1,
  title: 'Thiết kế giải pháp & kiến trúc',
  category: 'Solution Design & Architecture',
  summary: 'Chọn đúng pattern (workflow, agent, RAG), biết khi nào Claude không nên là giải pháp chính, giữ tool set gọn, phân rã pipeline thành pre / model / post và chạy discovery bài bản trước khi thiết kế.',
  topics: [
    {
      id: 'pattern-choice',
      title: 'Workflow, agent hay RAG — và khi nào không dùng Claude',
      summary: 'Bước cố định → workflow; cần trích dẫn nguồn nội bộ → RAG; quyết định dưới 50 ms hay thay vector index → không để LLM làm giải pháp chính.',
      questionIds: [5, 18, 37],
      blocks: [
        {
          type: 'tldr',
          text: 'Chọn pattern **đơn giản nhất đáp ứng được yêu cầu**. Các bước đã biết trước và cần chi phí dễ đoán → **workflow**. Cần trả lời có **trích dẫn** từ kho tài liệu chính thức → **augmented LLM + RAG**. Agent tự lập kế hoạch chỉ đáng dùng khi đường đi thật sự không biết trước.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Workflow', meaning: 'Chuỗi bước do code điều phối, thứ tự cố định — dễ test, token mỗi request ổn định.' },
            { term: 'Agent', meaning: 'Model tự quyết bước tiếp theo và tool cần gọi — linh hoạt nhưng chi phí, độ trễ khó đoán.' },
            { term: 'Augmented LLM', meaning: 'Một lần gọi model được "bổ sung" retrieval, tool hoặc memory — khối xây dựng cơ bản.' },
            { term: 'RAG', meaning: 'Retrieval-Augmented Generation: lấy đoạn tài liệu liên quan từ index rồi đưa vào prompt để trả lời có nguồn.' },
          ],
        },
        { type: 'h', text: '1. Bảng chọn pattern' },
        {
          type: 'table',
          headers: ['Tình huống', 'Pattern phù hợp', 'Vì sao'],
          rows: [
            ['Batch phân loại tài liệu: trích metadata → phân loại → tóm tắt → lưu', '**Workflow**', 'Bước cố định, cần chi phí token mỗi request dễ đoán'],
            ['Q&A tuân thủ phải trích dẫn chính sách nội bộ, ưu tiên latency, cost, audit', '**Augmented LLM + RAG** trên corpus chính thức', 'Có nguồn cho từng câu trả lời, rẻ và dễ audit hơn multi-agent'],
            ['Việc mở, không biết trước cần bao nhiêu bước', 'Agent', 'Cần model tự lập kế hoạch'],
          ],
        },
        {
          type: 'example',
          scenario: 'Trợ lý Q&A chính sách phải trả lời kèm trích dẫn từ bộ tài liệu chính thức; latency, cost và khả năng audit là ưu tiên.',
          right: '**Augmented LLM với RAG** trên corpus đã index, hiển thị trích dẫn ở mỗi câu trả lời.',
          wrong: ['Multi-agent orchestration — phức tạp, đắt, khó audit.', 'Tìm kiếm web tự do — nguồn không chính thức.', 'Nhét cả corpus vào mỗi prompt — tốn token, chậm.'],
          why: 'RAG chỉ lấy phần liên quan từ nguồn chính thức nên vừa có trích dẫn vừa kiểm soát được chi phí.',
        },
        { type: 'h', text: '2. Claude có nên là giải pháp chính?' },
        {
          type: 'table',
          headers: ['Use case', 'Claude làm chính?', 'Lý do'],
          rows: [
            ['Viết bản nháp báo cáo điều tra từ log bán cấu trúc, analyst duyệt', '**Có**', 'Tổng hợp văn bản bán cấu trúc là thế mạnh'],
            ['Review hợp đồng dài, trích điều khoản, gắn cờ sai lệch', '**Có**', 'Long context + trích xuất có cấu trúc'],
            ['Route ticket vào 30 nhóm kèm lý do', '**Có**', 'Phân loại + giải thích'],
            ['Chấm điểm gian lận real-time dưới 50 ms trên streaming', '**Không**', 'Cần model chuyên dụng, độ trễ thấp, dễ đoán'],
            ['Thay vector index để tìm kiếm trên hàng triệu tài liệu', '**Không**', 'Retrieval là việc của index, LLM dùng kết quả của nó'],
          ],
        },
        { type: 'callout', tone: 'exam', title: 'Mẹo chọn đáp án', text: 'Đề nhấn "predictable cost", "fixed stages" → workflow. Đề nhấn "citations", "authoritative source", "audit" → RAG. Đáp án "multi-agent" hay "đưa toàn bộ corpus vào prompt" thường là bẫy over-engineering.' },
      ],
    },
    {
      id: 'agent-tool-scope',
      title: 'Phạm vi tool của agent & progressive tool discovery',
      summary: 'Chỉ giữ tool phục vụ task đã định và hand-off thường xuyên; nhiều tool quá thì tải dần theo nhu cầu hoặc tách agent theo domain — đừng thêm router.',
      questionIds: [1, 7, 21],
      blocks: [
        {
          type: 'tldr',
          text: 'Càng nhiều tool, model càng chọn sai và càng tốn token. Giữ tool **bắt buộc cho task** và tool **dùng thường xuyên giúp giảm hand-off**; bỏ tool "thỉnh thoảng có ích" hay "để dành sau này". Catalog lớn thì dùng **progressive tool discovery**; tool đã phình qua nhiều domain thì **tách thành các agent chuyên biệt**.',
        },
        {
          type: 'table',
          headers: ['Nhóm tool', 'Giữ lại?'],
          rows: [
            ['(1) Bắt buộc để làm task đã định', '**Giữ**'],
            ['(2) Dùng thường xuyên, giảm hand-off', '**Giữ**'],
            ['(3) Thỉnh thoảng có ích cho việc không liên quan', 'Bỏ'],
            ['(4) Có thể hữu ích trong tương lai', 'Bỏ'],
          ],
        },
        { type: 'h', text: 'Progressive tool discovery' },
        {
          type: 'p',
          text: 'Trợ lý có 60 tool nội bộ: nạp toàn bộ định nghĩa mỗi request làm tăng token và thời gian phản hồi đầu tiên. Cách giải quyết là đưa ra **một tập con được chọn sẵn**, các tool khác **được nạp khi task cần** (Anthropic hỗ trợ deferred tool loading / Tool Search). Agent vẫn giữ đủ năng lực, chỉ không phải mang mọi định nghĩa trong context từ đầu.',
        },
        {
          type: 'example',
          scenario: 'Agent phân loại claim tăng từ 6 lên 34 tool sau 18 tháng; độ chính xác giảm từ 91% xuống 78%, chọn tool chậm thêm 2,3 giây. Một kỹ sư đề xuất đặt thêm một router chọn tool phía trước.',
          right: 'Tách thành **các agent theo 4 domain** quy trình claim, mỗi agent một tool set nhỏ.',
          wrong: ['Thêm router — thêm một lần gọi model cho **mọi** request, latency còn tệ hơn.'],
          why: '34 tool phục vụ 4 domain rõ ràng là ranh giới tự nhiên để chia nhỏ. Router chỉ che triệu chứng, không giảm tải cho agent.',
        },
        { type: 'callout', tone: 'warn', title: 'Bẫy hay gặp', text: '"Càng nhiều tool càng tốt" luôn sai. "Thêm một lớp model nữa để chọn" thường sai vì cộng thêm latency và chi phí cho từng request.' },
      ],
    },
    {
      id: 'pipeline-decomposition',
      title: 'Phân rã pipeline: pre-processing, model, post-processing',
      summary: 'OCR và che PII trước khi gọi model; Claude phân loại / trích xuất; validate schema rồi mới lưu. Logic tất định (thuế) để trong code, không để trong prompt.',
      questionIds: [23, 19],
      blocks: [
        {
          type: 'tldr',
          text: 'Mỗi pipeline có ba lớp: **chuẩn bị input** (OCR, che PII), **gọi model** (phân loại, trích xuất) và **xử lý output** (validate schema, lưu bản ghi đã hợp lệ). Việc gì làm được bằng code tất định thì để code làm.',
        },
        {
          type: 'steps',
          items: [
            '**Pre-processing**: OCR ảnh hoá đơn scan → che PII trong text **trước** khi gửi model.',
            '**Model stage**: Claude phân loại loại hoá đơn và trích xuất các trường có cấu trúc.',
            '**Post-processing**: validate các trường theo schema → chỉ lưu bản ghi hợp lệ vào system of record.',
          ],
        },
        { type: 'h', text: 'Thực hành kiến trúc đúng / sai' },
        {
          type: 'table',
          headers: ['Thực hành', 'Đúng?', 'Lý do'],
          rows: [
            ['Xác thực & phân quyền chạy **trước** retrieval để lọc theo danh tính', '**Đúng**', 'Không để tài liệu trái quyền lọt vào context'],
            ['Hàng đợi bất đồng bộ hấp thụ traffic dồn dập giữa intake và lớp gọi model', '**Đúng**', 'Tách nhận request khỏi xử lý, chịu được burst'],
            ['Viết công thức tính thuế trong system prompt thay vì code', 'Sai', 'Phép tính tất định cần code test được'],
            ['Log hội thoại giữ nguyên số định danh công dân để "tune tốt hơn"', 'Sai', 'PII nhạy cảm phải che hoặc ẩn'],
          ],
        },
        { type: 'callout', tone: 'exam', title: 'Quy tắc nhanh', text: 'Che PII là **pre-processing** (trước model). Validate schema và persist là **post-processing**. Thứ gì phải tính chính xác tuyệt đối → code, không phải prompt.' },
      ],
    },
    {
      id: 'chunking',
      title: 'Chọn cách chunking theo loại corpus',
      summary: 'Tài liệu dài có cấu trúc → semantic / hierarchical; bản ghi ngắn → mỗi record một chunk hoặc fixed-size có overlap; code / spec → theo function hoặc cây phân cấp.',
      questionIds: [17],
      blocks: [
        {
          type: 'tldr',
          text: 'Chunk tốt giữ nguyên **đơn vị ý nghĩa** của nguồn. Văn bản dài thì cắt theo đoạn, điều khoản, mục; bản ghi ngắn thì mỗi bản ghi là một chunk; code thì cắt theo function hoặc theo cây cấu trúc.',
        },
        {
          type: 'table',
          headers: ['Chiến lược chunking', 'Loại corpus'],
          rows: [
            ['Semantic chunking theo ranh giới đoạn / điều khoản', '**Tài liệu dài có cấu trúc**'],
            ['Hierarchical chunking theo cấu trúc mục của tài liệu', '**Tài liệu dài có cấu trúc**'],
            ['Per-record: mỗi bản ghi một chunk', '**Bản ghi ngắn, không đồng nhất**'],
            ['Fixed-size có overlap cho bản ghi ngắn dài gần bằng nhau', '**Bản ghi ngắn, không đồng nhất**'],
            ['Function-level / section-level cho module code', '**Code hoặc spec phân cấp**'],
            ['Tree-aware theo cây phân cấp của code / spec', '**Code hoặc spec phân cấp**'],
          ],
        },
        { type: 'callout', tone: 'tip', title: 'Cách nhớ', text: 'Có chữ "function" hoặc "tree" → code / spec. Có chữ "record" hoặc "fixed-size" → bản ghi ngắn. Có chữ "semantic", "clause", "section hierarchy" → tài liệu dài.' },
      ],
    },
    {
      id: 'discovery-requirements',
      title: 'Discovery, yêu cầu chức năng / phi chức năng',
      summary: 'Workshop với stakeholder để lộ ra ràng buộc latency, accuracy, compliance trước khi scope; ghi tiêu chí thành công và ngưỡng thất bại làm cổng lên production.',
      questionIds: [43, 92],
      blocks: [
        {
          type: 'tldr',
          text: 'Discovery có cấu trúc gồm hai việc chính: **làm workshop với stakeholder** để lộ ra các ràng buộc (latency, độ chính xác, compliance) trước khi chốt scope, và **ghi rõ tiêu chí thành công cùng ngưỡng thất bại** dùng làm cổng trước khi lên production.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Functional requirement', meaning: 'Hệ thống **phải làm gì**: trích trường, viết bản nháp, phân loại ticket.' },
            { term: 'Non-functional requirement', meaning: 'Hệ thống **phải làm tốt đến mức nào**: latency, chi phí, độ sẵn sàng, bảo mật, audit.' },
            { term: 'p95 latency', meaning: '95% request phản hồi nhanh hơn mức này — số đo NFR phổ biến.' },
          ],
        },
        {
          type: 'example',
          scenario: 'Mục nào là yêu cầu **phi chức năng**?',
          right: '"Hệ thống phải phản hồi với **p95 latency dưới 800 ms** ở lưu lượng dự kiến."',
          wrong: ['Trích xuất các trường từ form.', 'Tạo bản nháp người dùng sửa được.', 'Phân loại ticket.'],
          why: 'Ba lựa chọn sai đều mô tả chức năng; chỉ ràng buộc hiệu năng đo được mới là NFR.',
        },
        { type: 'callout', tone: 'exam', title: 'Mẹo', text: 'Hoạt động discovery đúng là **workshop lấy ràng buộc** và **ghi success criteria + failure threshold**. Đáp án kiểu "chọn model trước", "build prototype ngay" là nhảy cóc qua discovery.' },
      ],
    },
    {
      id: 'skill-vs-mcp',
      title: 'Claude Skill hay MCP server?',
      summary: 'Kiến thức quy trình cố định, có ví dụ, không cần gọi hệ thống ngoài → Skill. Cần truy cập dữ liệu / hệ thống live → MCP server.',
      questionIds: [97],
      blocks: [
        {
          type: 'tldr',
          text: '**Skill** đóng gói **kiến thức quy trình** (hướng dẫn, ví dụ, template) và dùng được trên claude.ai, Claude API, Claude Code. **MCP server** dùng để **kết nối hệ thống bên ngoài** (database, API, công cụ).',
        },
        {
          type: 'table',
          headers: ['Tiêu chí', 'Claude Skill', 'MCP server'],
          rows: [
            ['Nội dung', 'Quy trình, hướng dẫn, ví dụ, file tham khảo', 'Tool và resource từ hệ thống ngoài'],
            ['Gọi hệ thống live?', 'Không cần', '**Có** — đó là mục đích chính'],
            ['Tính di động', 'claude.ai, API, Claude Code', 'Mọi client hỗ trợ MCP'],
            ['Ví dụ', 'Quy trình soạn hồ sơ pháp lý có mẫu', 'Tra cứu giá real-time, đọc CRM'],
          ],
        },
        {
          type: 'example',
          scenario: 'Năng lực soạn hồ sơ khai báo pháp lý từ dữ liệu nội bộ: quy trình soạn cố định, có ví dụ mẫu, không gọi hệ thống bên ngoài, phải dùng được ở nhiều nơi.',
          right: '**Claude Skill** — vì đây là kiến thức quy trình, không cần gọi hệ thống live.',
          why: 'MCP chỉ cần khi phải truy cập dữ liệu hoặc hành động trên hệ thống bên ngoài.',
        },
      ],
    },
    {
      id: 'arch-docs',
      title: 'Tài liệu kiến trúc: guide, ADR, bàn giao cho người',
      summary: 'Xác định người đọc + câu hỏi họ cần trả lời và lên dàn ý trước khi viết; ghi quyết định bằng ADR; khi chuyển cho người xử lý thì đưa bản tóm tắt có cấu trúc.',
      questionIds: [79, 85, 125],
      blocks: [
        {
          type: 'tldr',
          text: 'Viết tài liệu kiến trúc thì **lập kế hoạch trước**: ai đọc, họ cần trả lời câu hỏi gì, rồi dàn ý các mục. Muốn lưu lý do của một quyết định cho audit và onboarding → **ADR**. Agent chuyển ca cho người → **handoff summary có cấu trúc**, không đẩy nguyên transcript.',
        },
        {
          type: 'steps',
          items: [
            'Xác định **người đọc** và các câu hỏi tài liệu phải trả lời cho họ.',
            'Lên **dàn ý**: overview, components, contracts, flows, runbooks, limitations.',
            'Sau đó mới viết từng mục.',
          ],
        },
        {
          type: 'terms',
          items: [
            { term: 'ADR', meaning: 'Architecture Decision Record: bối cảnh, quyết định, các phương án đã cân nhắc, hệ quả, ngày và người quyết định.' },
            { term: 'Handoff summary', meaning: 'Bản tóm tắt khi agent chuyển cho người: vấn đề, định danh đã xác minh, kết quả tool, việc đã thử, bước đề xuất tiếp theo.' },
          ],
        },
        {
          type: 'example',
          scenario: 'Khi agent gọi `escalate_to_human`, nhân viên phải đọc lại toàn bộ hội thoại, thời gian xử lý tăng.',
          right: 'Tạo **handoff summary có cấu trúc**: vấn đề của khách, định danh đã xác minh, kết quả tool và trạng thái tài khoản, việc đã thử, bước đề xuất tiếp theo.',
          wrong: ['Gửi kèm toàn bộ transcript — chính là nguyên nhân hiện tại.', 'Bắt khách kể lại từ đầu.'],
          why: 'Đưa ngay thông tin người xử lý cần lên đầu thì họ không phải đọc lại.',
        },
      ],
    },
  ],
}
