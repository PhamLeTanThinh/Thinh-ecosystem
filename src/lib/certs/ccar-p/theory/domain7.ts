import type { TheoryDomain } from '../../ccaf-theory/types'

export const DOMAIN_7: TheoryDomain = {
  id: 'stakeholder-lifecycle',
  number: 7,
  title: 'Giao tiếp stakeholder & quản lý vòng đời',
  category: 'Stakeholder Communication & Lifecycle Management',
  summary: 'Biến yêu cầu mơ hồ thành yêu cầu làm được, trình bày theo từng đối tượng, viết ADR và gói bàn giao đủ để đội khác tự triển khai, định nghĩa SLA đo được, quản lý thay đổi scope và phản hồi, gọi đúng tên các loại giá trị.',
  topics: [
    {
      id: 'vague-discovery',
      title: 'Discovery khi sponsor chỉ nói "cải thiện trải nghiệm"',
      summary: 'Không bắt tay build ngay: làm discovery để xác định quyết định đang hỏng và metric mục tiêu; hỏi ai escalate, vì sao, thế nào là tốt, ràng buộc gì.',
      questionIds: [88, 103, 112],
      blocks: [
        {
          type: 'tldr',
          text: 'Yêu cầu kiểu "AI để cải thiện trải nghiệm khách hàng" chưa đủ để thiết kế. Phải **làm discovery có cấu trúc** để tìm **quyết định đang hỏng**, **hành trình bị ảnh hưởng** và **metric mục tiêu** — rồi mới biết AI có phù hợp không.',
        },
        {
          type: 'example',
          scenario: 'Sponsor muốn "một hệ thống AI để xử lý escalation của khách hàng".',
          right: '**Phân rã yêu cầu** bằng câu hỏi cụ thể: **ai** escalate, **điều gì** gây escalate, **thế nào** là giải quyết tốt, ràng buộc nào áp dụng (latency, chi phí, audit, độ nhạy dữ liệu).',
          wrong: ['Build prototype ngay để sponsor xem.', 'Chọn model trước rồi tính sau.'],
          why: 'Chỉ khi có người dùng, trigger, tiêu chí thành công và ràng buộc mới viết được yêu cầu làm được.',
        },
        {
          type: 'table',
          headers: ['Trước khi validate yêu cầu với stakeholder', 'Phải thu thập'],
          rows: [
            ['Kết quả cần đạt', '**Mục tiêu kinh doanh, tiêu chí thành công, nhóm người dùng trong phạm vi**'],
            ['Giới hạn giải pháp', '**Ràng buộc phi chức năng**: latency, chi phí, audit, độ nhạy dữ liệu, quy định'],
          ],
        },
      ],
    },
    {
      id: 'audience-communication',
      title: 'Trình bày quyết định theo đối tượng',
      summary: 'Executive: kết quả kinh doanh, trade-off, rủi ro cấp cao. Bảo mật: threat model, control mapping. Product: năng lực đã giao, phụ thuộc roadmap. Nhóm hỗn hợp: quyết định trước, chi tiết kỹ thuật sau.',
      questionIds: [56, 58, 73, 101],
      blocks: [
        {
          type: 'tldr',
          text: 'Luôn **mở đầu bằng quyết định**, rồi trả lời đúng **mối quan tâm của từng người nghe**. Executive cần **kết quả kinh doanh, trade-off, rủi ro cấp cao**. Kỹ sư cần **lý do kỹ thuật, phương án đã cân nhắc, tác động triển khai**.',
        },
        {
          type: 'table',
          headers: ['Đối tượng', 'Nội dung phù hợp'],
          rows: [
            ['**Executive sponsor**', 'Kết quả kinh doanh, trade-off đã chấp nhận, rủi ro cấp cao'],
            ['**Reviewer bảo mật & compliance**', 'Threat model, sổ rủi ro còn lại, bảng control mapping'],
            ['**Product manager** sở hữu roadmap', 'Danh sách năng lực đã giao, phụ thuộc ở cấp tính năng'],
            ['**CFO / General counsel / CIO**', 'Lần lượt: tài chính / pháp lý & rủi ro / kỹ thuật, bảo mật, vận hành'],
          ],
        },
        {
          type: 'example',
          scenario: 'Trình bày một quyết định kiến trúc cho nhóm gồm executive sponsor và các lead kỹ thuật.',
          right: '**Mở đầu bằng quyết định, kết quả kinh doanh và trade-off**; sau đó là **lý do kỹ thuật, phương án khác và tác động triển khai** cho kỹ sư.',
          wrong: ['Bắt đầu bằng chi tiết kỹ thuật.', 'Làm hai buổi riêng với nội dung khác nhau.'],
          why: 'Executive đánh giá được giá trị và rủi ro ngay đầu; kỹ sư vẫn có đủ chi tiết.',
        },
      ],
    },
    {
      id: 'adr-handoff',
      title: 'ADR & gói tài liệu bàn giao',
      summary: 'ADR phải có phương án đã cân nhắc, tiêu chí đánh giá, trade-off, người sở hữu và lịch xem lại. Gói bàn giao: tổng quan kiến trúc, ADR, contract thành phần, eval framework, runbook, on-call playbook, hạn chế đã biết.',
      questionIds: [47, 49, 51, 74, 83, 121],
      blocks: [
        {
          type: 'tldr',
          text: 'Tài liệu tốt cho phép đội khác **triển khai và vận hành mà không cần bạn**. ADR ghi **cả lý do** (phương án, tiêu chí, trade-off) chứ không chỉ quyết định. Gói bàn giao phải có **contract** giữa các thành phần, cách **kiểm chứng** (eval) và cách **vận hành** (runbook, on-call).',
        },
        {
          type: 'table',
          headers: ['Thành phần ADR tốt', 'Vì sao'],
          rows: [
            ['Phương án đã cân nhắc + tiêu chí đánh giá từng phương án', 'Người sau hiểu vì sao chọn'],
            ['Trade-off đã chấp nhận', 'Biết đã hy sinh gì'],
            ['Người sở hữu + lịch xem lại khi điều kiện thay đổi', 'Quyết định không bị bỏ quên'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'ADR thiếu phương án và trade-off',
          text: 'Phản hồi đúng: **yêu cầu tác giả bổ sung trước khi publish** — không publish rồi "sửa sau".',
        },
        {
          type: 'table',
          headers: ['Mục đích', 'Gói tài liệu'],
          rows: [
            ['Chuyển từ thiết kế sang triển khai', 'Tổng quan kiến trúc, ADR, **contract thành phần**, **eval framework + reference set**, runbook, on-call playbook, hạn chế đã biết'],
            ['Bàn giao deployment', 'Tổng quan kiến trúc, ADR, sơ đồ thành phần, runbook vận hành, on-call playbook, hạn chế đã biết'],
            ['Implementation guide cho đội build', 'Trách nhiệm thành phần, contract giữa thành phần, sequence diagram luồng chính, tham số cấu hình + mặc định, runbook'],
            ['Đủ để đội khác tự triển khai', '**Integration contract, schema cấu hình, input/output từng thành phần** + **decision log** có lý do và phương án bị loại'],
          ],
        },
      ],
    },
    {
      id: 'sla-scope-feedback',
      title: 'SLA, thay đổi scope & vòng phản hồi',
      summary: 'SLA = metric + ngưỡng + cửa sổ đo + hệ quả khi vi phạm. Scope tăng → nói rõ tác động và đưa lựa chọn (hoãn, bỏ phần khác, lùi lịch). Buổi phản hồi: agenda, gửi tài liệu trước, ghi quyết định, chốt người và hạn.',
      questionIds: [61, 94, 100, 60, 115],
      blocks: [
        {
          type: 'tldr',
          text: 'Cam kết phải **đo được**. Thay đổi phải **minh bạch về tác động** và **để stakeholder chọn**. Phản hồi phải biến thành **việc có người làm và có hạn**.',
        },
        {
          type: 'example',
          scenario: 'Định nghĩa SLA nào có ý nghĩa vận hành nhất?',
          right: 'Có **metric, ngưỡng, cửa sổ đánh giá và hệ quả khi vi phạm** — vd. "**p95 latency mỗi request dưới 800 ms trong cửa sổ 28 ngày**".',
          wrong: ['"Hệ thống phải nhanh".', '"Uptime cao nhất có thể".'],
          why: 'Thiếu bất kỳ phần nào thì không biết khi nào là vi phạm và phải làm gì.',
        },
        {
          type: 'table',
          headers: ['Tình huống', 'Cách xử lý đúng'],
          rows: [
            ['Stakeholder thêm scope lớn khi dự án đang chạy', 'Ghi nhận, nói rõ tác động scope / timeline, đưa lựa chọn: **hoãn, bỏ bớt phần khác, hoặc lùi lịch** để họ chọn'],
            ['Stakeholder lo về latency giữa kỳ phát triển', 'Đưa **số đo p50 / p95 thực tế so với ngưỡng SLA**; nếu không đạt được thì **cùng sửa lại SLA**'],
            ['Buổi lấy phản hồi', 'Agenda tập trung, gửi tài liệu trước, ghi quyết định và việc cần làm, chốt người phụ trách và hạn'],
            ['Giữ đồng thuận giữa nhiều stakeholder', '**Lịch định kỳ** xem lại kỳ vọng và giả định; **giải quyết thẳng** các ý kiến trái nhau thay vì lấp liếm'],
          ],
        },
      ],
    },
    {
      id: 'value-rollout',
      title: 'Phân loại giá trị & chuẩn bị rollout cấu hình',
      summary: 'Gấp 3 lượng PO mỗi analyst = efficiency; bỏ nhập liệu tay, chuyển người sang quản lý vendor = transformation. Trước pilot cấu hình Claude Code: xác định workflow và ranh giới bảo mật, rồi baseline project scope.',
      questionIds: [78, 70],
      blocks: [
        {
          type: 'tldr',
          text: 'Phản hồi sau triển khai phải được **gọi đúng loại giá trị**. Làm nhiều hơn trong cùng quy trình = **Efficiency**; thiết kế lại vai trò = **Transformation**; tiền hạ tầng = **Solution Cost**; cam kết tốc độ / uptime = **Performance SLA**.',
        },
        {
          type: 'table',
          headers: ['Phản hồi', 'Loại'],
          rows: [
            ['"Mỗi analyst xử lý gấp 3 lần số đơn mua hàng"', '**Efficiency**'],
            ['"Bỏ nhập liệu thủ công, nhân sự chuyển sang quản lý quan hệ vendor"', '**Transformation**'],
            ['Chi phí hạ tầng / API', '**Solution Cost**'],
            ['Thời gian phản hồi, uptime', '**Performance SLA**'],
          ],
        },
        { type: 'h', text: 'Trước khi pilot cấu hình Claude Code chuẩn hoá' },
        {
          type: 'steps',
          items: [
            'Xác định **workflow của team**, **ranh giới bảo mật**, và quyết định nào thuộc **managed** vs **project**.',
            'Định nghĩa **baseline project scope**: MCP server, permission rule, subagent.',
            'Pilot với một nhóm nhỏ kỹ sư.',
          ],
        },
      ],
    },
  ],
}
