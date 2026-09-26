import type { TheoryDomain } from './types'

export const DOMAIN_4: TheoryDomain = {
  id: 'prompt-structured',
  number: 4,
  title: 'Prompt Engineering & Structured Output',
  weight: 20,
  summary: 'Trích xuất có cấu trúc bằng tool_use, thiết kế schema, kiểm tra & retry, few-shot, xử lý mơ hồ, duy trì hành vi qua nhiều lượt và Message Batches API.',
  topics: [
    {
      id: 'structured-extraction-schema',
      title: 'Trích xuất có cấu trúc: tool_use, tool_choice & thiết kế schema',
      summary: 'Lấy JSON đúng cấu trúc bằng tool_use, điều khiển tool_choice, và thiết kế schema (null, other, unclear) để model không phải bịa.',
      questionIds: [63, 65, 67, 68, 69, 70, 71, 72, 73, 106, 107, 111, 112, 113, 115, 117, 155, 156, 157, 180, 182],
      blocks: [
        {
          type: 'tldr',
          text: 'Muốn Claude trả JSON **đúng cấu trúc**: khai báo một **tool có schema** chính là cấu trúc bạn cần, rồi đọc dữ liệu từ `tool_use`. Nhưng **đúng cấu trúc ≠ đúng nội dung** — còn phải thiết kế schema để model **không bị ép bịa** (cho phép `null`, `"other"`, `"unclear"`) và dạy bằng **few-shot**.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Schema', meaning: 'Bản khai báo cấu trúc dữ liệu: có những trường nào, kiểu gì, bắt buộc hay không.' },
            { term: '`input_schema`', meaning: 'Schema parameter của một tool. Mẹo: dùng nó làm khuôn cho dữ liệu cần trích.' },
            { term: '`tool_choice`', meaning: 'Parameter quyết định Claude có phải gọi tool không, và gọi tool nào.' },
            { term: 'Nullable', meaning: 'Trường được phép để trống (`null`) khi không có thông tin.' },
            { term: 'Enum', meaning: 'Danh sách giá trị cố định được phép, vd. `"positive" | "negative" | "unclear"`.' },
            { term: 'Few-shot', meaning: 'Đưa 2–3 cặp ví dụ input → output mẫu trong prompt để model làm theo.' },
          ],
        },

        { type: 'h', text: '1. Cách chắc chắn nhất để có JSON đúng schema' },
        {
          type: 'p',
          text: 'Giống đưa cho người nhập liệu một **tờ mẫu có sẵn ô** thay vì bảo "viết ra giấy cho đúng định dạng nhé". Bạn định nghĩa một tool có `input_schema` đúng cấu trúc cần; Claude "gọi tool" với dữ liệu đã trích; bạn đọc dữ liệu từ `tool_use`. Không còn lỗi cú pháp JSON.',
        },
        {
          type: 'table',
          headers: ['Cách', 'Đánh giá'],
          rows: [
            ['**Tool có schema mục tiêu** + đọc `tool_use`', '**Đáng tin nhất.**'],
            ['Điền sẵn `{` đầu câu trả lời rồi tự parse', 'Ép được dạng JSON nhưng không đảm bảo đúng schema, đủ trường.'],
            ['Dặn "Only output valid JSON" + retry khi parse lỗi; dùng regex bóc JSON', 'Dễ gãy, tốn thêm lượt.'],
            ['Gọi 2 lần: trích ra chữ, rồi nhờ chuyển sang JSON', 'Thêm chi phí và thêm chỗ có thể lỗi.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Đúng cấu trúc ≠ đúng nội dung',
          text: 'Schema chặt chỉ loại lỗi **cú pháp**. Nó **không** ngăn lỗi **ý nghĩa**: ghi "30 minutes" vào trường số lượng nguyên liệu; tổng các dòng ≠ tổng hoá đơn; trả mảng rỗng dù tài liệu có thông tin. Những lỗi này phải xử lý bằng few-shot, kiểm tra ý nghĩa và người review.',
        },

        { type: 'h', text: '2. `tool_choice`: ai quyết định gọi tool nào' },
        {
          type: 'table',
          headers: ['Giá trị', 'Nghĩa là', 'Dùng khi'],
          rows: [
            ['`auto`', 'Model tự quyết: gọi tool **hoặc** trả lời bằng chữ', 'Mặc định. Rủi ro: model trả một câu hội thoại thay vì gọi tool → parser của bạn hỏng.'],
            ['`any`', 'Bắt buộc gọi **một** tool nào đó, model tự chọn tool', 'Có nhiều schema theo loại tài liệu (hoá đơn, hợp đồng, biên lai) mà **chưa biết trước** loại nào → luôn có output có cấu trúc.'],
            ['`{"type":"tool","name":"X"}`', 'Bắt buộc gọi **đúng tool X**', 'Cần một bước **bắt buộc chạy đầu tiên**: ép `extract_metadata` trước, lượt sau chuyển về `auto` để làm tiếp.'],
            ['`none`', 'Cấm gọi tool', '—'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Bẫy tool_choice',
          text: '`any` **không** đảm bảo chọn đúng tool bạn muốn — vẫn có thể gọi `lookup_citations` trước. **Thứ tự liệt kê tool** không quyết định ưu tiên. Ép một tool cố định ở **mọi** lượt thì các bước bổ sung phía sau không bao giờ chạy được.',
        },

        { type: 'h', text: '3. Thiết kế schema để model không phải bịa' },
        {
          type: 'p',
          text: 'Nếu tờ mẫu có ô **bắt buộc** mà tài liệu không có thông tin, người điền sẽ… bịa cho đủ. Model cũng vậy. Hãy luôn cho nó một "lối thoát" hợp lệ:',
        },
        {
          type: 'table',
          headers: ['Tình huống', 'Thiết kế đúng', 'Thiết kế sai'],
          rows: [
            ['Tài liệu **không nêu** thông tin', 'Cho trường **nullable** + dặn "trả `null` khi không được nêu trực tiếp".', 'Trường bắt buộc → model bịa giá trị. Đổi model mạnh hơn hay thêm LLM kiểm tra chỉ chữa triệu chứng.'],
            ['Thông tin **mơ hồ** (review quá ngắn)', 'Cho phép mảng rỗng cho `pros/cons`; thêm `"unclear"` vào enum `overall_sentiment`.', 'Dùng `neutral` thay "không rõ" — hai nghĩa khác nhau; `null` và mảng rỗng cũng khác nghĩa.'],
            ['Gặp giá trị **ngoài danh sách** (vd. "tiny house")', 'Thêm **`"other"`** + trường chữ **`property_type_detail`**.', 'Mở rộng enum mãi (đuổi không kịp); đổi sang chuỗi tự do (mất từ vựng chuẩn); ép vào "house" (mất khác biệt).'],
            ['Hợp đồng có **sửa đổi** (30 ngày → 45 ngày)', 'Cho phép **nhiều giá trị**, mỗi giá trị kèm vị trí nguồn + ngày hiệu lực.', 'Luật "luôn lấy bản mới nhất" — mất bản gốc (cần khi tranh chấp).'],
            ['Cần **tự kiểm tra** số liệu', 'Thêm `calculated_total` (model tự cộng các dòng) bên cạnh `stated_total`; **chênh lệch = tín hiệu** để gắn cờ cho người xem.', 'Để model âm thầm "hoà giải" hoặc tự chỉnh số — là bịa dữ liệu tài chính.'],
            ['Định dạng không đồng nhất (giá, chế độ ăn…)', 'Schema chặt + **quy tắc chuẩn hoá ngay trong prompt** ("giá là số thập phân 2 chữ số", "dietary là tag enum") — làm trong một lượt.', 'Tách một bước chuẩn hoá riêng sau đó.'],
          ],
        },

        { type: 'h', text: '4. Few-shot: dạy bằng ví dụ' },
        {
          type: 'p',
          text: 'Khi vấn đề là **model hiểu sai ý bạn** (thế nào là một "skill", có tách "Python và SQL" không, định dạng vật liệu nào là chuẩn, nhận ra trích dẫn ở nhiều kiểu trình bày), hãy đưa **2–3 cặp input → output hoàn chỉnh**. Ví dụ cụ thể dạy nhanh hơn mô tả dài, và còn giúp tìm ra nhiều hơn (tăng recall).',
        },
        {
          type: 'table',
          headers: ['Vấn đề', 'Cách sửa', 'Vì sao cách khác không hiệu quả'],
          rows: [
            ['Mảng skills lúc 5–10 mục, lúc 40+; lúc tách lúc gộp; tự suy ra skill không được nhắc', 'Few-shot về cách tách cụm, tiêu chí "được nhắc rõ", mức chi tiết.', 'Giới hạn cứng 10–20 mục → bỏ sót hoặc độn thêm; xử lý sau không sửa được suy diễn ngầm.'],
            ['"cotton blend" lúc lại "Cotton/Polyester mix", đôi khi bỏ trống', 'Few-shot với định dạng chuẩn.', '`required` không sửa định dạng mà còn gây bịa; `temperature 0` chỉ làm sai một cách nhất quán; đổi model tốn tiền mà vẫn không cho model biết định dạng mong muốn.'],
            ['5% trả mảng rỗng dù tài liệu có trích dẫn/phương pháp (viết theo nhiều kiểu)', 'Few-shot trên **nhiều kiểu tài liệu khác nhau**.', 'Retry cùng prompt không dạy được điều model chưa nhận ra; regex dễ gãy; nới lỏng schema chỉ che triệu chứng.'],
          ],
        },
      ],
    },
    {
      id: 'validation-retry-review',
      title: 'Kiểm tra, retry & con người trong loop',
      summary: 'Retry kèm lỗi cụ thể, khi nào retry vô ích, chia nhỏ tài liệu dài, và dồn sức người review vào chỗ model kém tự tin.',
      questionIds: [64, 66, 74, 108, 109, 114, 118, 150, 151, 154],
      blocks: [
        {
          type: 'tldr',
          text: 'Khi dữ liệu trích ra bị sai: **retry kèm thông báo lỗi cụ thể** (không retry y nguyên). Retry chỉ giúp nếu thông tin **có trong tài liệu** — không có thì thử mấy lần cũng vô ích. Tài liệu dài thì **chia đoạn**. Người review có hạn thì dồn sức vào chỗ **model kém tự tin**, và đo accuracy **theo từng loại** chứ đừng nhìn con số trung bình.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Validation', meaning: 'Bước kiểm tra dữ liệu có hợp lệ không (vd. bằng thư viện Pydantic).' },
            { term: 'Confidence', meaning: 'Model tự ước lượng mức chắc chắn cho từng trường nó trích.' },
            { term: 'Calibrate threshold', meaning: 'Dùng dữ liệu đã có đáp án đúng để chọn mức confidence nào là "đủ tin".' },
            { term: 'Stratified sampling', meaning: 'Chọn ngẫu nhiên một tỷ lệ cố định từ **mỗi nhóm** để kiểm tra, không chỉ chọn ngẫu nhiên chung.' },
          ],
        },

        { type: 'h', text: '1. Retry — nhưng phải kèm lỗi' },
        {
          type: 'p',
          text: 'Giống giáo viên trả bài: chỉ nói "làm lại đi" thì học sinh dễ sai y như cũ; khoanh đỏ chỗ sai và ghi lý do thì lần sau sửa đúng.',
        },
        {
          type: 'steps',
          items: [
            'Validation báo lỗi, vd. Pydantic: `expected float for quantity, got "2 to 3"`.',
            'Gửi yêu cầu mới kèm: **tài liệu gốc + bản trích bị sai + thông báo lỗi cụ thể**.',
            'Model tự sửa. Cách này xử lý phần lớn lỗi trong 2–3 lượt.',
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Khi nào retry KHÔNG giúp được',
          text: '**Giúp được** khi model có thể làm đúng từ chính tài liệu: sai định dạng số ("1,234" → 1234), sai định dạng ngày (ISO datetime → `YYYY-MM-DD`), sai cấu trúc (object lồng → mảng phẳng). **Vô ích** khi thông tin **không có trong input** — vd. tài liệu chỉ ghi "et al." còn danh sách tác giả đầy đủ nằm ở tài liệu khác.',
        },

        { type: 'h', text: '2. Tài liệu dài: chia nhỏ' },
        {
          type: 'list',
          items: [
            'Accuracy 94% với cuộc họp < 30 phút nhưng chỉ 68% với cuộc họp > 60 phút, dù vẫn vừa context window → **chia transcript thành đoạn, trích từng đoạn, rồi gộp và bỏ trùng**. Few-shot, model mạnh hơn hay tóm tắt trước đều không giải quyết được việc thông tin bị rải rác trong context dài.',
            'Tool definition 2.500 token + system prompt + tài liệu 175–190K chạm giới hạn 200K → phần cuối tài liệu bị bỏ sót. Nhớ rằng **định nghĩa tool cũng tốn token input**.',
            'Batch có 300 tài liệu lỗi `context_length_exceeded` → **chia nhỏ rồi chỉ gửi lại đúng 300 tài liệu đó**, sau đó gộp kết quả. Tăng `max_tokens` chỉ ảnh hưởng độ dài **output**, không liên quan.',
          ],
        },

        { type: 'h', text: '3. Học từ những lần người dùng sửa' },
        {
          type: 'example',
          scenario: 'Có 847 lần người dùng sửa kết quả trích công thức nấu ăn; 23% là do lượng không chính xác như "a handful", "a splash".',
          right: '**Thêm few-shot** cho thấy cách trích **nguyên văn** các cụm này.',
          wrong: ['Tự đổi sang số hoặc để trống.', 'Fine-tune model ngay.', 'Thêm trường enum hoặc pattern matching để tự điền.'],
          why: 'Đây là vấn đề model hiểu sai cách xử lý — few-shot example sửa nhanh và rẻ nhất.',
        },

        { type: 'h', text: '4. Người review có hạn: dồn sức vào đâu' },
        {
          type: 'table',
          headers: ['Tình huống', 'Cách đúng', 'Lý do'],
          rows: [
            ['12% lỗi ý nghĩa lọt qua schema; người chỉ xem được **20%** số bản ghi', 'Model xuất **confidence cho từng trường**, **hiệu chỉnh ngưỡng bằng dữ liệu có nhãn**, người xem các bản ghi dưới ngưỡng.', 'Lỗi tập trung ở chỗ model kém tự tin. Chọn ngẫu nhiên 20% thì chỉ bắt được 20% số lỗi.'],
            ['Muốn tự động duyệt các bản trích > 90% tin cậy (accuracy chung 97%)', '**Trước tiên**: phân tích accuracy **theo loại tài liệu và theo trường**.', 'Số trung bình che mất nhóm yếu — một loại tài liệu có thể chỉ đạt 70%. Chỉnh ngưỡng, chạy thử… đều làm **sau**.'],
            ['Vẫn còn lỗi trong nhóm > 85% tin cậy (bảng đối thủ, phụ lục…)', '**Lấy mẫu ngẫu nhiên phân tầng** một tỷ lệ cố định mỗi tuần.', 'Theo dõi được tỷ lệ lỗi theo thời gian và phát hiện kiểu lỗi mới; luật heuristic chỉ bắt được lỗi đã biết.'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Nhớ nhanh',
          text: 'Retry **kèm lỗi cụ thể**. Thông tin **không có trong nguồn** → retry vô ích. Tài liệu dài → **chia đoạn rồi gộp**. Người review có hạn → **confidence đã hiệu chỉnh**. Đừng tin số trung bình → **tách theo loại tài liệu / trường**.',
        },
      ],
    },
    {
      id: 'prompting-techniques',
      title: 'Kỹ thuật prompt, làm rõ yêu cầu & duy trì hành vi',
      summary: 'Đặt hướng dẫn trong system prompt, một nguyên tắc chung thay vì nhiều điều kiện, nêu giả định khi mơ hồ, nhắc lại khi hội thoại dài.',
      questionIds: [122, 124, 126, 127, 129, 130, 131, 132, 138, 143, 145, 159],
      blocks: [
        {
          type: 'tldr',
          text: 'Hành vi cần giữ suốt cuộc trò chuyện → đặt trong **system prompt**. Viết **một nguyên tắc chung** thay vì hàng chục câu "nếu… thì…". Yêu cầu mơ hồ → **tự nêu giả định rồi làm tiếp**, chỉ hỏi lại khi hành động **không thể hoàn tác**. Hội thoại dài làm hướng dẫn "phai" dần → **nhắc lại** ở chỗ hợp lý hoặc dạy bằng **ví dụ**.',
        },
        {
          type: 'terms',
          items: [
            { term: 'System prompt', meaning: 'Phần hướng dẫn nền đặt ngoài cuộc hội thoại, áp dụng cho mọi lượt.' },
            { term: 'User / assistant message', meaning: 'Các lượt trong hội thoại: người dùng nói (user), Claude trả lời (assistant).' },
            { term: 'Prefill', meaning: 'Điền sẵn phần đầu câu trả lời của assistant để model viết tiếp từ đó.' },
            { term: 'Irreversible action', meaning: 'Làm rồi không quay lại được: đặt cọc, gửi email, xoá dữ liệu…' },
          ],
        },

        { type: 'h', text: '1. Đặt hướng dẫn ở đâu' },
        {
          type: 'table',
          headers: ['Loại thông tin', 'Đặt ở', 'Không nên'],
          rows: [
            ['Hành vi **luôn phải giữ** (giọng nhiệt tình, giải thích lý do, hỏi làm rõ)', '**System prompt**', 'Tin nhắn assistant đầu tiên; nối vào mỗi tin nhắn user; biến môi trường.'],
            ['Thông tin **thay đổi giữa chừng** (webhook báo gói hàng đã giao)', 'Cập nhật **system prompt trước lần gọi API kế tiếp** → trợ lý tự nhiên dùng thông tin mới.', 'Gửi một "tin nhắn user" giả (gây phản hồi không ai hỏi); gắn tiền tố vào tin nhắn user.'],
          ],
        },

        { type: 'h', text: '2. Một nguyên tắc chung thắng chuỗi "nếu… thì…"' },
        {
          type: 'example',
          scenario: 'System prompt: "Nếu user nói mình là beginner thì… Nếu user dùng từ superset thì…". Người dùng không tự nhận trình độ nhưng dùng nhiều thuật ngữ chuyên môn — Claude vẫn giải thích như cho người mới.',
          right: 'Thay phần lớn điều kiện bằng **một nguyên tắc**: "Điều chỉnh độ sâu giải thích theo trình độ người dùng, dùng lại thuật ngữ của họ". Chỉ giữ điều kiện **an toàn quan trọng** (vd. khuyên gặp bác sĩ khi hỏi về chấn thương cũ).',
          wrong: ['Thêm nhánh "nếu… thì…" mới cho trường hợp vừa gặp — chạy theo không bao giờ hết.'],
          why: 'Điều kiện cứng chỉ bắt được **lời nói thẳng**; nguyên tắc chung giúp model hiểu cả **tín hiệu ngầm**.',
        },

        { type: 'h', text: '3. Yêu cầu mơ hồ: nêu giả định, chỉ hỏi khi không thể quay lại' },
        {
          type: 'example',
          scenario: '"Đặt giúp tôi địa điểm tổ chức tiệc" — thiếu ngày, số khách, ngân sách. Hỏi đủ 4 câu thì 35% người dùng bỏ đi; hỏi ít thì gợi ý lệch.',
          right: '**Nói rõ các giả định** dựa trên context ("tôi giả định khoảng 20 khách, tối thứ Bảy…"), đưa gợi ý luôn và mời người dùng chỉnh. **Chỉ hỏi** trước hành động **không thể hoàn tác** (xác nhận đặt chỗ).',
          wrong: [
            'Tự dùng mặc định mà không nói ra — người dùng không biết đã bị giả định gì.',
            'Bắt điền form đủ mọi thông tin trước — gây phiền.',
            'Gộp mọi câu hỏi vào một câu dài — chỉ bớt số lượt, không giải quyết bản chất.',
          ],
          why: 'Người dùng được kết quả ngay mà vẫn kiểm soát được; chỉ dừng lại hỏi ở chỗ sai thì không sửa được.',
        },
        {
          type: 'p',
          text: 'Ngoại lệ: yêu cầu có **nhiều cách hiểu dẫn tới hành động rất khác nhau** — vd. "Set up my focus music" có thể là cấu hình, tạo playlist hay phát nhạc ngay → hỏi **một câu** để làm rõ loại hành động.',
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Lưu ý bộ đề',
          text: 'Câu Q138 (bản trùng của Q126) trong bộ đề gốc từng đánh dấu nhầm "gộp câu hỏi" là đúng. Đáp án nhất quán với Q126/Q143 là **nêu giả định rõ ràng + chỉ hỏi cho hành động không thể hoàn tác**.',
        },

        { type: 'h', text: '4. Hướng dẫn bị "phai" khi hội thoại dài' },
        {
          type: 'p',
          text: 'Claude làm đúng ở lượt 1–4 rồi lệch ở lượt 7 (dù hội thoại mới 2.500 token), hoặc lệch giọng/định dạng ở lượt 25–30. Nguyên nhân **không phải** hết context, mà là **system prompt bị "loãng"** giữa quá nhiều câu trả lời đã tích luỹ. Giống lời dặn đầu buổi họp — càng về cuối càng ít người nhớ.',
        },
        {
          type: 'table',
          headers: ['Cách sửa', 'Dùng khi'],
          rows: [
            ['**Chèn một tin nhắn vai user nhắc lại hướng dẫn chính** ở chỗ chuyển ý tự nhiên, nhất là trước yêu cầu phức tạp', 'Cần giữ giọng điệu, định dạng hoặc giới hạn thông tin.'],
            ['**Thay hướng dẫn dài bằng few-shot** minh hoạ câu trả lời ở từng mức (từ vựng, độ phức tạp, độ sâu)', 'Quy tắc "điều chỉnh theo trình độ" bị quên khi hội thoại kéo dài — ví dụ cụ thể bền hơn lời mô tả.'],
          ],
        },
        {
          type: 'list',
          items: [
            'Không: chuyển hướng dẫn từ system prompt sang tin nhắn user đầu tiên.',
            'Không: tự mở hội thoại mới mỗi 20 lượt, hay sinh lại câu trả lời tới khi hợp lệ (tốn kém, không sửa gốc).',
            'Muốn bỏ câu mở đầu lặp đi lặp lại kiểu "Certainly! I would be happy to help!": đáp án của bộ đề là **prefill** — điền sẵn phần đầu câu trả lời để model viết tiếp. Chỉ dặn "đừng mở đầu bằng…", cắt chữ sau khi sinh, hay hạ temperature đều kém hơn. *(Một số model mới không hỗ trợ prefill; đây là đáp án theo bộ đề.)*',
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Nhớ nhanh',
          text: 'Hành vi lâu dài → **system prompt**. Nhiều "nếu… thì…" → **một nguyên tắc chung**. Mơ hồ → **nêu giả định**, chỉ hỏi khi **không thể hoàn tác**. Hướng dẫn phai → **nhắc lại bằng tin nhắn user** hoặc **few-shot**.',
        },
      ],
    },
    {
      id: 'batch-api',
      title: 'Message Batches API',
      summary: 'Rẻ hơn 50% nhưng chờ tới 24 giờ: khi nào dùng batch, tính chu kỳ gửi theo SLA, và xử lý phần bị lỗi.',
      questionIds: [62, 75, 76, 77, 110, 116, 181],
      blocks: [
        {
          type: 'tldr',
          text: '**Message Batches API** = gửi một batch lớn yêu cầu, **rẻ hơn 50%**, đổi lại phải **chờ tới 24 giờ**. Dùng cho việc **không gấp**; việc cần kết quả trong vài phút thì gọi thường (real-time). Câu hỏi quyết định luôn là: **chờ tới 24 giờ có chấp nhận được không?**',
        },
        {
          type: 'terms',
          items: [
            { term: 'Batch', meaning: 'Một batch nhiều yêu cầu gửi cùng lúc, xử lý dần ở phía Anthropic.' },
            { term: 'Real-time', meaning: 'Gọi API bình thường, có kết quả ngay (vài giây).' },
            { term: '`custom_id`', meaning: 'Mã bạn tự gắn cho mỗi yêu cầu để khớp kết quả trả về.' },
            { term: 'SLA', meaning: 'Cam kết thời gian phải có kết quả, vd. "trong 30 giờ, 99,9% trường hợp".' },
          ],
        },

        { type: 'h', text: '1. Đặc điểm cần thuộc' },
        {
          type: 'p',
          text: 'Giống gửi hàng: **chuyển phát tiết kiệm** rẻ một nửa nhưng không hứa giờ tới; **hoả tốc** thì đắt nhưng tới ngay.',
        },
        {
          type: 'list',
          items: [
            '**Rẻ hơn 50%** so với gọi Messages API thông thường.',
            '**Async**: đa số batch xong trong 1 giờ, nhưng có thể mất **tới 24 giờ** — không đảm bảo nhanh.',
            'Mỗi yêu cầu có **`custom_id`**; **thứ tự kết quả có thể khác thứ tự gửi** → khớp bằng `custom_id`.',
            'Kết quả ghi rõ từng yêu cầu thành công hay lỗi (vd. `context_length_exceeded`).',
            'Không dùng khi người dùng đang ngồi chờ, hoặc khi SLA tính bằng phút.',
          ],
        },

        { type: 'h', text: '2. Batch hay real-time?' },
        {
          type: 'table',
          headers: ['Tình huống', 'Quyết định'],
          rows: [
            ['Báo cáo tháng (để lưu trữ) + báo cáo bất thường **phải cảnh báo trong 30 phút**', '**Kết hợp**: báo cáo thường → **Batch**; báo cáo khẩn → **real-time**. Batch cho tất cả thì không kịp 30 phút.'],
            ['Review bảo mật 50 PR/ngày, **không chặn merge**, tốn $150/ngày', 'Câu hỏi quyết định: **góp ý trễ tới 24 giờ có còn dùng được không?** Được → Batch.'],
            ['Trích dữ liệu 50.000 hợp đồng trong 2 tuần; 18% cần chỉnh lại', 'Gửi **tất cả qua batch**, rồi gửi các bản lỗi ở **các batch sau**, chỉnh prompt giữa các lần cho tới khi đạt.'],
          ],
        },

        { type: 'h', text: '3. Tính chu kỳ gửi batch theo SLA' },
        {
          type: 'p',
          text: 'Tài liệu đến liên tục; SLA: có kết quả trong **30 giờ**, đúng hạn 99,9%. Trường hợp xấu nhất = **thời gian tài liệu chờ tới lượt gửi batch + 24 giờ xử lý**.',
        },
        {
          type: 'table',
          headers: ['Gửi batch mỗi…', 'Xấu nhất', 'Kết luận'],
          rows: [
            ['**4 giờ**', '4 + 24 = **28 giờ**', '✔ Kịp, còn 2 giờ dự phòng.'],
            ['6 giờ', '6 + 24 = 30 giờ', '✕ Vừa khít, **không có dự phòng** cho mục tiêu 99,9%.'],
            ['Cuối mỗi ngày', 'tới 24 + 24 = 48 giờ', '✕ Trễ SLA.'],
            ['Không batch, gọi real-time hết', 'Vài giây', '✕ Kịp nhưng mất khoản tiết kiệm 50%.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Đã sửa đáp án bộ đề',
          text: 'Câu Q76 trong file gốc đánh dấu nhầm "mỗi 6 giờ", trong khi chính lời giải thích và phép tính cho ra **mỗi 4 giờ**. Ứng dụng đã sửa đáp án thành "mỗi 4 giờ".',
        },

        { type: 'h', text: '4. Một phần batch bị lỗi thì làm gì' },
        {
          type: 'example',
          scenario: 'Batch 10.000 tài liệu, 300 tài liệu lỗi `context_length_exceeded` (quá dài).',
          right: 'Tìm các yêu cầu lỗi qua **`custom_id`** → **chia nhỏ** các tài liệu quá dài → **chỉ gửi lại** chúng → **gộp** kết quả từng phần.',
          wrong: [
            'Chạy lại cả 10.000 tài liệu (dù bật prompt caching hay đổi model) — lãng phí.',
            'Tăng `max_tokens` — chỉ ảnh hưởng độ dài **output**, không liên quan lỗi input quá dài.',
          ],
          why: 'Chỉ xử lý lại đúng phần lỗi, và sửa đúng nguyên nhân (input quá dài → chia nhỏ).',
        },
      ],
    },
  ],
}
