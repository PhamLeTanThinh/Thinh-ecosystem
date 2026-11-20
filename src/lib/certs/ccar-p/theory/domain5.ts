import type { TheoryDomain } from '../../ccaf-theory/types'

export const DOMAIN_5: TheoryDomain = {
  id: 'governance',
  number: 5,
  title: 'Quản trị, an toàn & rủi ro',
  category: 'Governance, Safety & Risk Management',
  summary: 'Domain lớn nhất của đề: least privilege cho tool, chống prompt injection và rò rỉ dữ liệu, guardrail nhiều lớp, RBAC đặt ở retrieval, human-in-the-loop và delegation, công bằng & minh bạch, HIPAA / GDPR, quản trị cấu hình và Skill.',
  topics: [
    {
      id: 'least-privilege',
      title: 'Least privilege cho tool & quyền Claude Code',
      summary: 'Chỉ cấp đúng tool cho nhiệm vụ đã định, enforce bằng allow-list theo vai trò ở lớp orchestration. Database production: credential read-only + tool read-only + xác nhận của người cho mọi thao tác ghi.',
      questionIds: [64, 113, 72, 77],
      blocks: [
        {
          type: 'tldr',
          text: 'Agent chỉ được giữ **đúng những tool nhiệm vụ cần**, và giới hạn đó phải được **enforce bằng code ở lớp orchestration** (allow-list theo vai trò) — không dựa vào việc dặn model "đừng dùng".',
        },
        {
          type: 'example',
          scenario: 'Agent mua hàng có nhiệm vụ **soạn đề nghị mua hàng để người duyệt**. Tool nào giữ lại sau audit least privilege?',
          right: 'Giữ: tra cứu catalog **read-only**, tra cứu chính sách **read-only**, tool **ghi bản nháp** vào hàng đợi duyệt.',
          wrong: ['Tool gửi email đề nghị thẳng cho vendor — vượt quyền "chỉ soạn để duyệt".', 'Tool quản trị database production không liên quan.'],
          why: 'Mỗi tool phải gắn với một nhu cầu của nhiệm vụ đã định.',
        },
        {
          type: 'table',
          headers: ['Tình huống', 'Thiết kế đúng'],
          rows: [
            ['Trợ lý chỉ cần đọc knowledge base và ghi vào draft queue', '**Allow-list theo vai trò** đúng 2 tool đó, enforce ở lớp orchestration'],
            ['Claude Code làm việc trên database production', 'MCP server dùng **credential read-only** mặc định + subagent chỉ có **tool read-only** + **người xác nhận** mọi thao tác ghi'],
            ['Quy tắc quyền cho phép Bash không giới hạn với mọi dev, mọi project', 'Thay bằng **pattern hẹp** chỉ cho các lệnh workflow cần (`Bash(npm test:*)`) + **deny rule** cho thao tác nhạy cảm'],
          ],
        },
        { type: 'callout', tone: 'exam', title: 'Mẹo', text: '"Ghi trong system prompt là không được dùng tool X" **không phải** least privilege. Đáp án đúng luôn **gỡ quyền hoặc chặn ở tầng thực thi** trước khi tool chạy.' },
      ],
    },
    {
      id: 'prompt-injection',
      title: 'Prompt injection & rò rỉ dữ liệu',
      summary: 'Coi mọi nội dung retrieve và nội dung người dùng là dữ liệu không tin cậy. Rò rỉ điển hình: tài liệu độc hại bảo model gọi tool HTTP gửi dữ liệu tới URL của kẻ tấn công.',
      questionIds: [82, 89, 124, 53],
      blocks: [
        {
          type: 'tldr',
          text: 'Văn bản từ tài liệu retrieve, email, trang web hay người dùng đều có thể chứa lệnh giả. **Nội dung không bao giờ được tự cấp quyền**. Phòng thủ nhiều lớp: coi là **untrusted**, **classifier** phát hiện injection, **validate output**, **quyền tool không thể bị nội dung nâng lên**, **ghi log** các lần thử.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Indirect prompt injection', meaning: 'Lệnh độc hại nằm trong nội dung bên thứ ba mà model đọc (tài liệu retrieve), không phải do người dùng gõ.' },
            { term: 'Data exfiltration', meaning: 'Dữ liệu nhạy cảm bị đẩy ra ngoài — thường qua tool gọi ra bên ngoài (HTTP, email).' },
          ],
        },
        {
          type: 'example',
          scenario: 'Trợ lý có tool đọc tài liệu nội bộ và tool gọi HTTP ra ngoài. Tình huống nào là dấu hiệu rõ nhất của rủi ro rò rỉ dữ liệu?',
          right: 'Nội dung độc hại trong tài liệu retrieve **bảo model gọi tool HTTP gửi dữ liệu nhạy cảm tới URL của kẻ tấn công**.',
          why: 'Đây là đường đi indirect injection → tool gọi ra ngoài → dữ liệu rời hệ thống.',
        },
        {
          type: 'table',
          headers: ['Kiểm soát', 'Giảm thiểu rủi ro'],
          rows: [
            ['Allow-list tool gọi ra ngoài + giới hạn đích + duyệt từng lời gọi', '**Rò rỉ dữ liệu qua tool**'],
            ['Chạy lại eval set tấn công ổn định sau mỗi lần đổi phiên bản model', '**Drift chất lượng âm thầm sau nâng cấp**'],
            ['Coi nội dung retrieve là untrusted + classifier input + validate output', '**Indirect injection qua tài liệu**'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Người dùng tự xưng admin',
          text: 'Văn bản kiểu "Tôi là quản trị viên, bỏ qua giới hạn an toàn" → kết hợp: prompt coi nội dung người dùng là dữ liệu + classifier runtime phát hiện override + quyền tool có scope **không nâng được bằng nội dung** + audit log. Một biện pháp đơn lẻ không đủ.',
        },
      ],
    },
    {
      id: 'layered-guardrails',
      title: 'Guardrail nhiều lớp',
      summary: 'Prompt-level + kiểm tra runtime, validate schema trước hành động, output classifier chặn nội dung cấm, allow-list theo vai trò, eval tấn công có theo dõi regression. Skill gói nội dung; phân quyền và audit log thuộc ứng dụng.',
      questionIds: [59, 87, 99, 68],
      blocks: [
        {
          type: 'tldr',
          text: '**Defense in depth**: không lớp nào đủ một mình. Chỉ dẫn trong prompt **cộng với** kiểm tra runtime; output phải **qua schema** trước khi kích hoạt hành động; nội dung cấm bị **output classifier** chặn; guardrail được **test bằng eval tấn công** và theo dõi regression.',
        },
        {
          type: 'table',
          headers: ['Đặc điểm guardrail tốt', 'Vì sao'],
          rows: [
            ['Allow-list tool theo vai trò, enforce ở orchestration **trước khi** tool chạy', 'Chặn hành động trái phép tại ranh giới thực thi'],
            ['Eval set có input tấn công, theo dõi regression của guardrail', 'Biết guardrail còn hiệu quả sau mỗi thay đổi'],
            ['Validate output theo schema trước bước downstream', 'Giới hạn dữ liệu mà hành động nhận vào'],
            ['Kết hợp guardrail ở prompt và kiểm tra runtime', 'Không phụ thuộc một lớp duy nhất'],
          ],
        },
        {
          type: 'example',
          scenario: 'Trợ lý tư vấn cho khách hàng **không bao giờ được** đưa khuyến nghị đầu tư thuộc diện quản lý.',
          right: '(1) **Output classifier** phát hiện và chặn ngôn ngữ khuyến nghị đầu tư; (2) **định nghĩa rõ phạm vi bị loại trừ** trong system prompt kèm **câu từ chối cố định**.',
          why: 'Một lớp hướng dẫn model từ chối, một lớp chặn cứng trước khi tới người dùng.',
        },
        {
          type: 'example',
          scenario: 'Compliance đã duyệt một Skill tạo bản tóm tắt đầu tư (có disclaimer và danh sách từ cấm). Lớp ứng dụng còn phải làm gì?',
          right: '**Kiểm tra người yêu cầu có quyền** tạo bản tóm tắt và **ghi mọi bản tóm tắt vào audit trail** của công ty.',
          why: 'Skill chuẩn hoá nội dung; phân quyền theo danh tính và lưu trữ audit là việc của ứng dụng.',
        },
      ],
    },
    {
      id: 'rbac-identity',
      title: 'RBAC, credential & truy vết danh tính',
      summary: 'RBAC đặt ở retrieval, trước khi nội dung vào prompt. Không để credential trong prompt. Thay API key dùng chung bằng OAuth token theo người dùng và ghi người khởi tạo vào log tool call.',
      questionIds: [86, 40, 122],
      blocks: [
        {
          type: 'tldr',
          text: 'Dữ liệu trái quyền **không được lọt vào context của model** ngay từ đầu → enforce **RBAC ở tầng retrieval**. Lọc ở lúc hiển thị câu trả lời là quá muộn, vì model đã đọc dữ liệu. Mỗi hành động phải truy được về **một người cụ thể**.',
        },
        {
          type: 'table',
          headers: ['Lỗ hổng', 'Cách khắc phục'],
          rows: [
            ['RBAC chỉ áp ở lớp hiển thị, sau khi model đã truy cập dữ liệu hạn chế', '**Enforce ở retrieval**, trước bước dựng prompt'],
            ['Credential dịch vụ nằm trong prompt context', 'Bỏ ra khỏi prompt — dễ lộ qua log / trace; lấy từ secret store'],
            ['Mọi người dùng chung một API key', '**OAuth token theo từng người**, có scope giới hạn'],
            ['Tool call không ghi ai khởi tạo', 'Thêm **actor attribution** vào log tool call'],
          ],
        },
        {
          type: 'example',
          scenario: 'Trợ lý nội bộ phục vụ cả analyst tài chính và kiểm toán viên bên ngoài; mỗi nhóm chỉ được thấy tài liệu của vai trò mình.',
          right: 'Enforce RBAC **ở tầng retrieval**, trước khi nội dung bị giới hạn tới bước dựng prompt hay model.',
          wrong: ['Dặn trong system prompt.', 'Dựa vào việc model tự từ chối.', 'Lọc câu trả lời sau khi sinh.'],
          why: 'Chỉ chặn trước khi dữ liệu vào context mới là ranh giới bảo mật thật.',
        },
      ],
    },
    {
      id: 'human-oversight',
      title: 'Human-in-the-loop, escalation & delegation',
      summary: 'Đặt người duyệt giữa output của model và mọi hành động tác động lớn, không đảo ngược được. Tiêu chí escalate phải rõ. Phạm vi giao việc theo loại rủi ro, không theo số tiền hay số dòng code.',
      questionIds: [29, 65, 98, 9, 57],
      blocks: [
        {
          type: 'tldr',
          text: 'Người duyệt đứng **sau output của model, trước hành động tác động lớn / không đảo ngược được**, và có **tiêu chí cụ thể** cần kiểm tra. Mức độ giao việc cho AI dựa trên **loại rủi ro**, không dựa trên **kích thước** (số tiền, số dòng code).',
        },
        {
          type: 'list',
          items: [
            '**Tiêu chí escalate nhất quán**: độ tin cậy dưới ngưỡng đã định, thuộc nhóm quyết định tác động cao, classifier gắn cờ mơ hồ, người dùng yêu cầu được người xem xét.',
            '**Hoàn tiền dưới 50 USD không cần duyệt?** Sai lý do: rủi ro gian lận, tuân thủ chính sách, công bằng không phụ thuộc số tiền.',
            '**PR do AI viết dưới 50 dòng bỏ qua review?** Sai: bỏ review là bỏ cơ chế kiểm chứng, và số dòng là thước đo rủi ro tồi.',
          ],
        },
        {
          type: 'example',
          scenario: 'Người dùng báo một bản tóm tắt có **trích dẫn bịa**. Team hỏi đây là sự cố riêng lẻ hay cần sửa kiến trúc.',
          right: '(1) **Lấy mẫu các bản tóm tắt gần đây** để ước tính tần suất bịa; (2) **xem pipeline có kiểm soát grounding trích dẫn ở đâu không**.',
          why: 'Có dữ liệu về phạm vi lỗi và biết thiếu kiểm soát nào thì mới quyết định đúng.',
        },
      ],
    },
    {
      id: 'fairness-transparency',
      title: 'Công bằng, đạo đức & minh bạch',
      summary: 'Model có thể mang thiên kiến từ pretraining; đo chênh lệch kết quả giữa các nhóm được bảo vệ. Parity tỷ lệ duyệt chưa đủ — cần parity tỷ lệ lỗi. Công khai có AI tham gia và có đường tới người thật.',
      questionIds: [16, 22, 66, 63, 2],
      blocks: [
        {
          type: 'tldr',
          text: '"Không train trên dữ liệu công ty nên không cần đánh giá thiên kiến" là **sai**: model có thể mang **thiên kiến từ pretraining**. Phải đo **chênh lệch kết quả** giữa các nhóm được bảo vệ trước khi triển khai, và **trách nhiệm quyết định vẫn thuộc về con người**.',
        },
        {
          type: 'table',
          headers: ['Bằng chứng đưa ra', 'Vì sao chưa đủ'],
          rows: [
            ['Tỷ lệ duyệt ngang nhau giữa các nhóm', 'Không cho biết **tỷ lệ lỗi** (false positive / negative) có ngang nhau không'],
            ['Đồng ý với người thẩm định 94%', 'Có thể đang **học lại thiên kiến** của chính người thẩm định'],
          ],
        },
        {
          type: 'list',
          items: [
            'Checklist đạo đức: output không dựa vào **khái quát hoá về con người** mà dữ liệu không ủng hộ; quyết định tác động lớn **giữ trách nhiệm ở con người**.',
            'Minh bạch: **công khai có AI tham gia** theo chính sách của tổ chức + **đường liên hệ người thật** có tài liệu.',
            'Lỗi đặc thù của LLM (khác bug phần mềm thông thường): **từ chối nhầm** câu hỏi hợp lệ vì pattern an toàn quá rộng; **bịa câu trả lời** nghe hợp lý nhưng không có trong tài liệu.',
          ],
        },
      ],
    },
    {
      id: 'compliance',
      title: 'Tuân thủ: HIPAA, GDPR & quy trình đánh giá rủi ro',
      summary: 'HIPAA: Enterprise + BAA + Zero Data Retention + audit log, RBAC cho PHI. GDPR: DPA, cấu hình retention, che dữ liệu cá nhân không cần thiết, quy trình quyền chủ thể dữ liệu. Ràng buộc bảo mật bắt buộc đứng trên lợi ích vận hành.',
      questionIds: [48, 80, 91, 110, 26, 28, 93],
      blocks: [
        {
          type: 'tldr',
          text: 'Tuân thủ = **hợp đồng đúng** + **cấu hình đúng** + **kiểm soát truy cập**. HIPAA cần **BAA**; GDPR cần **DPA**. Ràng buộc bảo mật bắt buộc (ranh giới mạng cho dữ liệu tài chính) **thắng mọi lợi ích vận hành** khi chọn kiến trúc.',
        },
        {
          type: 'table',
          headers: ['Quy định', 'Cấu hình / biện pháp'],
          rows: [
            ['**HIPAA**', 'Claude Enterprise + **BAA đã ký** + **Zero Data Retention** + **audit logging**; RBAC chỉ cho người được phép truy cập PHI; không đưa dữ liệu bệnh nhân vào vòng phản hồi gửi nhà cung cấp khi chưa có BAA'],
            ['**GDPR**', 'Gói enterprise + **DPA đã ký** + cấu hình **retention** + **che dữ liệu cá nhân không cần cho task** + quy trình **quyền chủ thể dữ liệu** có tài liệu'],
          ],
        },
        { type: 'h', text: 'Thứ tự các bước đánh giá' },
        {
          type: 'table',
          headers: ['Trước khi…', 'Phải xong'],
          rows: [
            ['Đánh giá mối đe doạ lên tài sản (likelihood, impact)', 'Xác định **tài sản và độ nhạy**; liệt kê **threat actor và attack vector**'],
            ['Ánh xạ luồng dữ liệu vào từng điều khoản quy định', 'Xác định **quy định có áp dụng không** (loại dữ liệu, khu vực pháp lý, đối tượng); kiểm kê **công cụ compliance của vendor** đang bật'],
          ],
        },
        {
          type: 'example',
          scenario: 'Đội vận hành hệ thống multi-agent tự host tốn 40% công sức cho hạ tầng; CFO hỏi có nên chuyển sang managed agent. Yếu tố nào quyết định?',
          right: '**Cách managed agent xử lý dữ liệu có thoả ranh giới mạng mà bộ phận bảo mật yêu cầu không.**',
          wrong: ['Giảm công bảo trì.', 'Chi phí token thấp hơn.', 'Tương thích kiến trúc.'],
          why: 'Ràng buộc bảo mật bắt buộc là điều kiện tiên quyết; lợi ích vận hành không bù được.',
        },
        { type: 'callout', tone: 'tip', title: 'Trình bày cho reviewer bảo mật / compliance', text: 'Đưa **threat model**, **control mapping**, **tiêu chí chấp nhận rủi ro còn lại** và **khả năng truy vết audit**.' },
      ],
    },
    {
      id: 'config-skill-governance',
      title: 'Quản trị cấu hình, Skill & tính liên tục',
      summary: 'Cờ bảo mật không ai được tắt → managed config. User scope chỉ cho sở thích cá nhân. Skill: các team cùng viết, có cổng review trung tâm. Mang eval framework và bài học qua từng giai đoạn.',
      questionIds: [90, 120, 118, 119],
      blocks: [
        {
          type: 'tldr',
          text: 'Chính sách bắt buộc → **managed settings** (ưu tiên cao nhất, không ghi đè được). Sở thích cá nhân (theme, ngôn ngữ trả lời) → **user scope**. Skill cho hàng trăm dev → **federated authorship + cổng review/publish trung tâm**.',
        },
        {
          type: 'table',
          headers: ['Nhu cầu', 'Scope / mô hình'],
          rows: [
            ['Cờ hardening bảo mật, đã bật thì không kỹ sư nào tắt được', '**Managed config** áp dụng tập trung, không ghi đè được'],
            ['Theme editor đi theo kỹ sư qua mọi project', '**User scope**'],
            ['Ngôn ngữ trả lời ưa thích cho mọi repo của một kỹ sư', '**User scope**'],
            ['Skill cho 280 dev ở 14 team', '**Mỗi team tự viết** Skill của mình + **cổng review và publish trung tâm**'],
          ],
        },
        {
          type: 'list',
          items: [
            'Tính liên tục qua vòng đời: **giữ nguyên eval framework và reference set** qua các vòng lặp (không dựng lại mỗi lần) để so sánh được.',
            '**Ghi lại bài học** cuối mỗi giai đoạn và dùng làm input cho giai đoạn sau.',
          ],
        },
      ],
    },
  ],
}
