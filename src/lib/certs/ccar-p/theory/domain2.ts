import type { TheoryDomain } from '../../ccaf-theory/types'

export const DOMAIN_2: TheoryDomain = {
  id: 'models-prompting',
  number: 2,
  title: 'Model Claude, prompting & context engineering',
  category: 'Claude Models, Prompting & Context Engineering',
  summary: 'Chọn model theo workload (Haiku cho phân loại khối lượng lớn), chọn kỹ thuật prompt vừa đủ, giữ chỉ dẫn nhất quán, quản lý context bằng prompt caching và Tool Search, đóng gói quy trình dùng chung thành Skill.',
  topics: [
    {
      id: 'model-selection',
      title: 'Chọn model theo workload',
      summary: 'Phân loại khối lượng lớn, latency chặt → Haiku. Model mạnh nhất không phải lúc nào cũng đúng; xác nhận bằng eval trên mẫu đại diện và route theo tầng.',
      questionIds: [33, 12],
      blocks: [
        {
          type: 'tldr',
          text: 'Chọn model **nhẹ nhất vẫn đạt chất lượng** cho workload. **Haiku** hợp với phân loại, trích xuất, routing khối lượng lớn và nhạy latency. Model suy luận nặng chậm hơn và tốn rate limit hơn. Quyết định cuối cùng phải dựa trên **eval trên mẫu đại diện**, không dựa trên "model mới nhất".',
        },
        {
          type: 'table',
          headers: ['Workload', 'Gợi ý'],
          rows: [
            ['Moderation khối lượng lớn, nhãn rõ, ngân sách latency chặt', '**Haiku**'],
            ['Phần lớn traffic đơn giản, một số ca khó', '**Route theo tầng**: model nhẹ cho ca thường, model nặng cho ca khó'],
            ['Suy luận phức tạp, nhiều bước', 'Model lớn hơn hoặc bật extended thinking — chấp nhận chậm hơn, tốn token hơn'],
          ],
        },
        { type: 'h', text: 'Đúng hay sai về chọn model' },
        {
          type: 'table',
          headers: ['Nhận định', 'Đúng?'],
          rows: [
            ['Model suy luận nặng thường tốn rate limit hơn và chạy chậm hơn model nhẹ trên cùng input', '**Đúng**'],
            ['Eval trên mẫu đại diện của workload thật là cơ sở xác nhận lựa chọn model', '**Đúng**'],
            ['Route theo tầng: model nhẹ cho traffic thường, model nặng cho ca cần năng lực cao', '**Đúng**'],
            ['Model mạnh nhất luôn là lựa chọn đúng bất kể workload', 'Sai'],
            ['Chọn theo phiên bản vừa công bố gần nhất', 'Sai'],
          ],
        },
        { type: 'callout', tone: 'exam', title: 'Mẹo', text: 'Đề có "high volume", "tight latency", "well-defined labels" → Haiku. Đáp án "thêm extended thinking" hoặc "dùng model lớn nhất" cho workload đơn giản là bẫy.' },
      ],
    },
    {
      id: 'prompt-techniques',
      title: 'Chọn kỹ thuật prompt & giữ chỉ dẫn nhất quán',
      summary: 'Phân loại tập nhãn đóng đã mô tả rõ → zero-shot; trích xuất cần đúng tên trường → few-shot; chain-of-thought chỉ khi cần; system prompt không được tự mâu thuẫn.',
      questionIds: [24, 32, 107],
      blocks: [
        {
          type: 'tldr',
          text: 'Bắt đầu từ cách **đơn giản nhất**. Có 30 nhóm đã mô tả rõ trong prompt → **zero-shot** kèm định dạng output là đủ. Cần output đúng tên trường → thêm **few-shot**. Chain-of-thought **không phải** mặc định cho mọi task. Chỉ dẫn mâu thuẫn nhau thì phải sửa cho nhất quán.',
        },
        {
          type: 'table',
          headers: ['Kỹ thuật', 'Dùng khi'],
          rows: [
            ['**Zero-shot**', 'Phân loại tập nhãn đóng, đã có tên và mô tả từng nhãn trong prompt'],
            ['**Few-shot**', 'Cần "neo" định dạng output, ví dụ trích xuất với đúng tên trường'],
            ['**Chain-of-thought**', 'Task cần suy luận nhiều bước — không bật đại trà'],
            ['**So sánh trung lập, nêu tiêu chí**', 'Chống câu hỏi dẫn dắt (leading question)'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Bẫy: khác biệt giữa các phiên bản model',
          text: 'Prompt đã validate trên một phiên bản **vẫn phải test lại** khi đổi phiên bản. "Validate một lần là xong" là sai.',
        },
        {
          type: 'example',
          scenario: 'System prompt có một mục nói "không bao giờ suy đoán ngoài nguồn", mục khác lại bảo "tự tin điền vào chỗ trống".',
          right: '**Bỏ hoặc viết lại** chỉ dẫn điền chỗ trống để prompt nhất quán: chỉ trả lời theo nguồn.',
          wrong: ['Giữ cả hai và để model tự cân nhắc.', 'Thêm few-shot để "giải thích" mâu thuẫn.'],
          why: 'Chỉ dẫn mâu thuẫn làm hành vi khó đoán và dễ bịa thông tin.',
        },
      ],
    },
    {
      id: 'context-budget',
      title: 'Ngân sách context: prompt caching, Tool Search, vòng đời token',
      summary: 'Nội dung dài lặp lại → cache làm prefix; quá nhiều tool MCP chiếm context → bật Tool Search; xếp phần ổn định lên đầu, cắt gọn input, validate output.',
      questionIds: [15, 45, 81, 123],
      blocks: [
        {
          type: 'tldr',
          text: 'Token lặp lại là chi phí lãng phí. Phần **ổn định và dài** (tài liệu, system prompt) đặt ở **đầu prompt** và bật **prompt caching**. Định nghĩa tool MCP chiếm hết context ngay từ đầu phiên → bật **Tool Search** để tải tool khi cần.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Prompt caching', meaning: 'Tái sử dụng phần prefix giống hệt giữa các request — input cache tính giá thấp hơn và xử lý nhanh hơn, nội dung không đổi.' },
            { term: 'Tool Search', meaning: 'Trong Claude Code: định nghĩa tool MCP được hoãn, chỉ tải khi model tìm tới — tool vẫn còn, context ban đầu nhẹ hơn.' },
          ],
        },
        {
          type: 'example',
          scenario: 'Hồ sơ pháp lý trung bình 80.000 token, mỗi hồ sơ bị hỏi khoảng 14 lần; hiện tại gửi nguyên hồ sơ mỗi lần hỏi. CFO muốn giảm chi phí mỗi truy vấn mà không giảm chất lượng.',
          right: '**Cache hồ sơ làm prompt prefix** để dùng lại cho 14 câu hỏi.',
          wrong: ['Tóm tắt hồ sơ cho ngắn — mất chi tiết, giảm chất lượng.', 'Đổi sang model nhỏ hơn — ảnh hưởng chất lượng.'],
          why: 'Caching giữ nguyên toàn bộ context nhưng giảm chi phí và độ trễ của phần lặp lại.',
        },
        {
          type: 'example',
          scenario: 'Phiên Claude Code dùng 50.000 token context trước khi kỹ sư gõ chữ nào; nhóm có 60+ tool MCP từ nhiều server.',
          right: 'Nguyên nhân: nhiều MCP server, **Tool Search chưa bật** nên mọi định nghĩa tool nạp từ đầu. Cách sửa: **bật Tool Search**.',
          why: 'Tool vẫn dùng được, định nghĩa chỉ vào context khi cần — không phải gỡ bớt năng lực.',
        },
        { type: 'h', text: 'Chiến thuật token theo từng giai đoạn request' },
        {
          type: 'table',
          headers: ['Giai đoạn', 'Chiến thuật'],
          rows: [
            ['**Input preparation**', 'Tóm tắt lịch sử hội thoại khi không cần đầy đủ; cắt đoạn retrieve còn phần liên quan đến câu hỏi'],
            ['**Prompt construction**', 'Xếp phần cache được lên trước phần thay đổi theo request; đưa nội dung lặp lại vào prefix cache ở đầu prompt'],
            ['**Output handling**', 'Validate output có cấu trúc theo schema; lưu output đã validate để dùng tiếp và audit'],
          ],
        },
      ],
    },
    {
      id: 'skills-packaging',
      title: 'Đóng gói quy trình dùng chung bằng Claude Skill',
      summary: 'Quy trình phải dùng y hệt ở nhiều workflow và cập nhật thường xuyên → một Skill do bộ phận sở hữu quản lý, mọi workflow cùng tham chiếu.',
      questionIds: [114],
      blocks: [
        {
          type: 'tldr',
          text: 'Một quy trình phải chạy **giống hệt** ở nhiều nơi và đổi nhiều lần mỗi năm → đóng gói **một Skill duy nhất**, giao cho **đội nắm nghiệp vụ** (vd. compliance) sở hữu, và cho mọi workflow **tham chiếu cùng Skill đó**. Sửa một chỗ là áp dụng khắp nơi.',
        },
        {
          type: 'example',
          scenario: 'Quy trình công bố thông tin theo quy định phải dùng y hệt ở chăm sóc khách hàng, bán hàng và onboarding; cơ quan quản lý cập nhật 4–6 lần mỗi năm.',
          right: '**Đóng gói thành Claude Skill do đội compliance sở hữu** và **cả ba workflow tham chiếu cùng Skill đó**.',
          wrong: ['Chép quy trình vào system prompt của từng workflow — mỗi lần cập nhật phải sửa ba nơi, dễ lệch nhau.', 'Mỗi đội tự viết bản riêng.'],
          why: 'Một nguồn duy nhất, có chủ sở hữu rõ ràng, giữ các workflow luôn đồng bộ.',
        },
        { type: 'callout', tone: 'tip', title: 'Liên quan', text: 'Skill gói **nội dung và quy trình**; việc **phân quyền** và **ghi audit log** vẫn là trách nhiệm của lớp ứng dụng (xem domain Governance).' },
      ],
    },
  ],
}
