import type { TheoryDomain } from '../../ccaf-theory/types'

export const DOMAIN_4: TheoryDomain = {
  id: 'evaluation',
  number: 4,
  title: 'Đánh giá, kiểm thử & tối ưu',
  category: 'Evaluation, Testing & Optimization',
  summary: 'Thiết kế eval đúng thứ tự, bắt regression khi đổi model / prompt, tối ưu chi phí và latency mà không hy sinh ưu tiên chính, chọn chiến lược retrieval, đo lường, lấy mẫu cho human review và phân biệt các trụ giá trị.',
  topics: [
    {
      id: 'eval-design',
      title: 'Thiết kế eval & thí nghiệm',
      summary: 'Định nghĩa metric và slice → curate & gắn nhãn dataset → mới chạy. Dataset phải đại diện cho người dùng thật. A/B test: giả thuyết + metric chính + effect size / cỡ mẫu trước khi random.',
      questionIds: [20, 108, 109, 10, 30, 6],
      blocks: [
        {
          type: 'tldr',
          text: 'Eval chỉ có ý nghĩa khi **quyết định cần đo gì trước**, rồi mới chạy. Thứ tự chuẩn: **định nghĩa metric và slice** (case đại diện, case biên, case tấn công) → **curate và gắn nhãn** dataset theo các slice đó → chạy hệ thống → tổng hợp, xem lỗi, công bố.',
        },
        {
          type: 'table',
          headers: ['Việc', 'Bước phải xong TRƯỚC'],
          rows: [
            ['Chạy deployment trên eval dataset', 'Định nghĩa **metric + slice**; **curate & label** dataset theo slice'],
            ['Test mẫu đại diện trên model ứng viên', 'Định nghĩa **ngưỡng chất lượng, latency chấp nhận được, lưu lượng**; **chọn model ứng viên** theo yêu cầu'],
            ['Chạy thí nghiệm so sánh 2 prompt (random assignment)', '**Giả thuyết + metric chính**; **minimum detectable effect và cỡ mẫu** đủ power'],
          ],
        },
        {
          type: 'example',
          scenario: 'Eval set của công cụ hỗ trợ tuyển dụng chỉ lấy từ **một khu vực** và **một nhóm thâm niên**.',
          right: '**Mở rộng** eval set ra mọi khu vực và nhóm thâm niên công cụ sẽ phục vụ, **chấm lại** trước khi phát hành rộng.',
          wrong: ['Phát hành rồi theo dõi sau.', 'Ghi chú hạn chế trong tài liệu là đủ.'],
          why: 'Eval set phải đại diện cho tập người dùng thật thì mới chứng minh được hiệu năng và tính công bằng.',
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Metric phải khớp với yêu cầu',
          text: 'Yêu cầu "trần chi phí mỗi query" → đo **token cost mỗi query so với trần**. Yêu cầu "không lộ dữ liệu cho sai vai trò" → đo **tỷ lệ RBAC chặn đúng trên bộ red-team**. "Tỷ lệ chấp nhận lần đầu 89%" chỉ đo mức tiếp nhận ban đầu, không chứng minh đề xuất đúng sau khi chuyên gia xem xét; chuyên gia hay override vì tiêu chí bị bỏ sót → **lỗ hổng phạm vi input**.',
        },
      ],
    },
    {
      id: 'regression-drift',
      title: 'Regression & drift khi đổi model hoặc prompt',
      summary: 'Đổi prompt làm hỏng case cũ → regression test trên reference set ổn định. Đổi model → eval set tấn công có chấm điểm theo phiên bản trước khi promote. Trả lời trái nguồn → thử lại model cũ, kiểm tra chỉ dẫn grounding.',
      questionIds: [11, 25, 27, 31, 76],
      blocks: [
        {
          type: 'tldr',
          text: 'Mỗi lần đổi **prompt** hoặc **phiên bản model** đều có thể làm hỏng hành vi đã đúng. Phòng bằng **bộ tham chiếu cố định** chạy lại mỗi lần đổi, **ghi điểm theo phiên bản**, và chỉ promote khi không tụt.',
        },
        {
          type: 'table',
          headers: ['Loại test', 'Bắt được gì'],
          rows: [
            ['**Regression test** trên reference set known-good', 'Case từng pass nay hỏng sau khi đổi prompt template'],
            ['**Adversarial test** (prompt injection, input dị dạng)', 'An toàn khi bị tấn công'],
            ['**Integration test** end-to-end', 'Các thành phần phối hợp đúng như một hệ thống'],
            ['**Eval set tấn công, chấm theo phiên bản model**', 'Drift chất lượng an toàn sau khi nâng cấp model'],
          ],
        },
        {
          type: 'example',
          scenario: 'Trợ lý nghiên cứu bắt đầu trả lời tự tin **trái với tài liệu đã retrieve**, dù pipeline retrieval không đổi.',
          right: '(1) **Thử tái hiện trên phiên bản model trước** để kiểm tra lệch model; (2) **kiểm tra chỉ dẫn grounding trong system prompt** xem ràng buộc trích dẫn còn nguyên không.',
          wrong: ['Re-index toàn bộ corpus — retrieval không đổi.', 'Tăng top-k.'],
          why: 'Retrieval không đổi thì nguyên nhân nằm ở model hoặc chỉ dẫn.',
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Sau nâng cấp, câu trả lời có claim không có trong nguồn',
          text: 'Cách khắc phục trực tiếp: **ràng buộc trả lời theo nội dung nguồn, bắt buộc trích dẫn, thêm bước kiểm chứng**.',
        },
      ],
    },
    {
      id: 'cost-latency',
      title: 'Tối ưu chi phí & latency',
      summary: 'Prefix dài lặp lại → prompt caching; context retrieve lớn → cắt còn phần liên quan; ca dễ → model nhỏ hơn. Ràng buộc cứng (SLA, accuracy-first) loại phương án trước, rồi mới so chi phí.',
      questionIds: [4, 34, 41, 106, 126, 44],
      blocks: [
        {
          type: 'tldr',
          text: 'Tìm **yếu tố chi phí lớn nhất** rồi xử lý nó. System prompt dài lặp lại → **cache prefix**. Context retrieve lớn → **cắt còn đoạn liên quan** hoặc cache các chunk hay dùng. Traffic dễ → **route sang model nhỏ, nhanh**. Nhưng **ràng buộc cứng luôn được xét trước** tối ưu.',
        },
        {
          type: 'table',
          headers: ['Vấn đề', 'Tối ưu đúng'],
          rows: [
            ['Preamble chính sách 6.000 token lặp mỗi lần gọi (45% chi phí)', '**Prompt caching** cho preamble tĩnh'],
            ['Chunk dữ liệu bán hàng lịch sử dùng lại nhiều trong ngày (30%)', '**Cache các chunk hay dùng**'],
            ['Cần giảm **cả** chi phí lẫn p95 latency, giữ chất lượng', '**Cache prefix tĩnh** + **route câu đơn giản sang model nhỏ**'],
            ['Trợ lý tương tác, latency là ràng buộc chính', 'Giảm độ sâu retrieval còn top-k thường chứa câu trả lời + cache system prompt'],
            ['Chi phí chủ yếu từ system prompt dài + context retrieve lớn', 'Đưa system prompt vào prefix cache + cắt context còn đoạn liên quan'],
          ],
        },
        {
          type: 'example',
          scenario: 'Kiến trúc X chất lượng cao hơn nhưng $0,18/phiên và trung bình 4,2 s; Y chất lượng thấp hơn chút, $0,09/phiên và 2,1 s. SLA yêu cầu dưới 3 s; 2 triệu phiên/năm.',
          right: '**Loại X vì vi phạm SLA**, rồi đánh giá Y: chênh chi phí ($0,18 − $0,09) × 2 triệu = **$180.000/năm**, và xem mức chênh chất lượng có ảnh hưởng thật tới năng suất lâm sàng không.',
          why: 'SLA là ràng buộc cứng — phương án vi phạm bị loại trước, không so chi phí.',
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Ưu tiên đã nêu là trên hết',
          text: 'Khi đề nói **accuracy là ưu tiên số một**, chọn cấu hình **giữ được accuracy** dù cấu hình kia nhanh hơn 38% — mức tụt 2% accuracy đo được là không chấp nhận được.',
        },
      ],
    },
    {
      id: 'retrieval-strategy',
      title: 'Chiến lược retrieval: dense, sparse, structured, hybrid',
      summary: 'Dense bắt diễn đạt khác nhau; sparse bắt đúng mã, định danh, từ hiếm; structured query cho lọc và tổng hợp; hybrid kết hợp hai loại nên recall khác dense.',
      questionIds: [35],
      blocks: [
        {
          type: 'tldr',
          text: 'Mỗi kiểu retrieval mạnh ở một chỗ: **dense** (vector) hiểu ý dù diễn đạt khác; **sparse** (từ khoá, BM25) bắt chính xác mã, ID, từ hiếm; **structured query** dành cho lọc và tổng hợp trên database quan hệ; **hybrid** kết hợp dense và sparse.',
        },
        {
          type: 'table',
          headers: ['Nhận định', 'Đúng?'],
          rows: [
            ['Dense hợp để bắt ý được diễn đạt khác trên văn bản phi cấu trúc', '**Đúng**'],
            ['Sparse bắt chính xác từ (ID, token hiếm) tốt hơn dense đơn thuần', '**Đúng**'],
            ['Structured query hợp với lọc + tổng hợp trên database quan hệ có schema và index', '**Đúng**'],
            ['Hybrid giống hệt dense-only, cùng đặc tính recall', 'Sai'],
            ['Lấy mẫu ngẫu nhiên từ kho dữ liệu là chiến lược retrieval ổn cho Q&A production', 'Sai'],
          ],
        },
      ],
    },
    {
      id: 'observability',
      title: 'Observability & monitoring',
      summary: 'Ghi model + phiên bản ở mỗi lượt và truyền correlation ID qua mọi lời gọi agent / tool. Trước khi instrument: định nghĩa metric, slice, SLO và error budget.',
      questionIds: [13, 42],
      blocks: [
        {
          type: 'tldr',
          text: 'Không quy được lỗi về đâu thì không sửa được. Mỗi lượt phải lưu **model và phiên bản**; mỗi request phải có **correlation ID** truyền qua mọi agent và tool để nối thành một trace. Trước khi gắn instrument: định nghĩa **metric + slice** (traffic thường và traffic tấn công) và **SLO + error budget**.',
        },
        {
          type: 'table',
          headers: ['Lỗ hổng observability', 'Hậu quả'],
          rows: [
            ['Không ghi model + phiên bản theo từng lượt', 'Không quy được hành vi, latency, regression về cấu hình model cụ thể'],
            ['Correlation ID không truyền qua agent / tool', 'Span bị đứt, không ghép được trace phân tán'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Thứ tự',
          text: 'Metric/slice và SLO/error budget **trước**; instrument emit metric & trace; ngưỡng alert cần **baseline quan sát được** nên đặt **sau**; dashboard cũng làm sau.',
        },
      ],
    },
    {
      id: 'iteration-lifecycle',
      title: 'Giai đoạn iteration & khi nào quay lại thiết kế',
      summary: 'Iteration: xem telemetry, mẫu output đã chấm và phản hồi stakeholder → chọn thay đổi tác động lớn nhất, đo bằng eval framework. Kiến trúc không đáp ứng nếu không đổi trách nhiệm thành phần / contract → chu kỳ thiết kế mới.',
      questionIds: [111, 75],
      blocks: [
        {
          type: 'tldr',
          text: 'Trong giai đoạn **iteration**, quyết định dựa trên bằng chứng: **telemetry production**, **mẫu output đã chấm**, **phản hồi stakeholder** → chọn **một thay đổi có tác động lớn nhất** → đo nó bằng **eval framework sẵn có**. Khi yêu cầu mới **buộc phải đổi trách nhiệm thành phần hoặc contract lõi** → đó là lúc **quay lại thiết kế**.',
        },
        {
          type: 'table',
          headers: ['Dấu hiệu', 'Làm gì'],
          rows: [
            ['Cập nhật cấu hình, nội dung, tài liệu cục bộ', 'Tiếp tục iterate tại chỗ'],
            ['Kiến trúc hiện tại không đáp ứng yêu cầu mới nếu không đổi trách nhiệm thành phần / contract lõi', '**Chu kỳ thiết kế mới**'],
          ],
        },
      ],
    },
    {
      id: 'hitl-sampling',
      title: 'Human review: lấy mẫu & thiết kế điểm kiểm soát',
      summary: 'Không duyệt hết được → lấy mẫu theo rủi ro: duyệt toàn bộ output độ tin cậy thấp / tác động cao + mẫu ngẫu nhiên nhỏ của ca thường. Trước pilot: xác định điểm quyết định cần người và tiêu chí lấy mẫu / escalate.',
      questionIds: [3, 117],
      blocks: [
        {
          type: 'tldr',
          text: '**Risk-stratified sampling**: duyệt **toàn bộ** output **độ tin cậy thấp** hoặc **tác động cao**, cộng một **mẫu ngẫu nhiên nhỏ** của output thường có độ tin cậy cao để phát hiện lỗi ẩn. Vừa giữ throughput vừa không bỏ giám sát.',
        },
        {
          type: 'steps',
          items: [
            'Xác định **các điểm quyết định cần người** theo **mức tác động** và **khả năng đảo ngược**.',
            'Định nghĩa **chiến lược lấy mẫu** và **tiêu chí escalate** ở mỗi điểm.',
            'Pilot trên một phần traffic đại diện → điều chỉnh theo kết quả.',
          ],
        },
        { type: 'callout', tone: 'warn', title: 'Bẫy', text: '"Chỉ lấy mẫu ngẫu nhiên đều" bỏ sót ca rủi ro; "duyệt 100%" không khả thi; "chỉ duyệt khi người dùng khiếu nại" là phản ứng muộn.' },
      ],
    },
    {
      id: 'value-pillars',
      title: 'Các trụ giá trị: efficiency, productivity, cost, transformation',
      summary: 'Thời gian mỗi việc giảm = efficiency; chỉ thành productivity khi có thêm output thực; chi phí API tăng = solution cost; thời gian sửa lỗi AI = efficiency loss.',
      questionIds: [54],
      blocks: [
        {
          type: 'tldr',
          text: 'Phải gọi đúng tên loại giá trị. **Efficiency**: tốn ít công hơn cho mỗi việc. **Productivity**: chỉ thành hiện thực khi tạo thêm **output đo được** (vd. thêm giờ tính phí). **Solution cost**: chi phí hạ tầng, API. **Transformation**: thiết kế lại vai trò, quy trình. **Performance SLA**: cam kết latency / uptime.',
        },
        {
          type: 'table',
          headers: ['Quan sát', 'Phân loại'],
          rows: [
            ['Thời gian tóm tắt giảm từ 47 phút xuống 6 phút mỗi tài liệu', '**Efficiency gain**'],
            ['Associate tốn ít thời gian hơn nhưng giờ tính phí không tăng', '**Productivity chưa thành hiện thực**'],
            ['Thêm lời gọi API làm chi phí hạ tầng tăng', '**Solution cost**'],
            ['Luật sư mất thời gian sửa lỗi bản tóm tắt', '**Efficiency loss**, bù trừ một phần mức tăng ở trên'],
          ],
        },
      ],
    },
  ],
}
