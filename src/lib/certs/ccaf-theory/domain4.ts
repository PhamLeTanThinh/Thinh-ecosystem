import type { TheoryDomain } from './types'

export const DOMAIN_4: TheoryDomain = {
  id: 'prompt-structured',
  number: 4,
  title: 'Prompt Engineering & Structured Output',
  weight: 20,
  summary: 'Trích xuất có cấu trúc bằng tool_use, thiết kế schema, kiểm tra & thử lại, few-shot, xử lý mơ hồ, duy trì hành vi qua nhiều lượt và Message Batches API.',
  topics: [
    {
      id: 'structured-extraction-schema',
      title: 'Trích xuất có cấu trúc: tool_use, tool_choice & thiết kế schema',
      summary: 'Ép JSON đúng schema bằng tool_use, điều khiển tool_choice, và thiết kế schema (nullable, enum + other, giá trị có phiên bản) để giảm bịa số liệu.',
      questionIds: [63, 65, 67, 68, 69, 70, 71, 72, 73, 106, 107, 111, 112, 113, 115, 117, 155, 156, 157, 180, 182],
      blocks: [
        { type: 'h', text: 'Cách đáng tin nhất để có JSON đúng schema' },
        {
          type: 'p',
          text: '**Định nghĩa một tool có `input_schema` chính là cấu trúc bạn cần**, để Claude "gọi tool" với dữ liệu đã trích, rồi đọc từ `tool_use` (Q111/182). Nhờ đó không còn lỗi cú pháp JSON.',
        },
        {
          type: 'table',
          headers: ['Cách', 'Đánh giá'],
          rows: [
            ['**Tool với schema mục tiêu** + đọc `tool_use`', '**Đáng tin nhất** cho tuân thủ schema.'],
            ['Pre-fill `{` rồi tự phân tích', 'Ép dạng nhưng không đảm bảo đúng schema/đủ trường.'],
            ['"Only output valid JSON" + retry khi parse lỗi; regex bóc JSON', 'Giòn, tốn vòng.'],
            ['Hai lệnh gọi: trích dạng văn bản rồi format JSON', 'Thêm chi phí và điểm lỗi.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Schema hợp lệ ≠ dữ liệu đúng',
          text: 'Strict schema loại bỏ **lỗi cú pháp** nhưng **không** loại bỏ lỗi **ngữ nghĩa** (đặt "30 minutes" vào trường số lượng nguyên liệu; tổng dòng ≠ tổng hoá đơn; mảng rỗng khi tài liệu có thông tin). Đó là việc của few-shot, kiểm tra ngữ nghĩa và review.',
        },
        { type: 'h', text: 'tool_choice: ai quyết định gọi tool nào' },
        {
          type: 'table',
          headers: ['Giá trị', 'Ý nghĩa', 'Dùng khi'],
          rows: [
            ['`auto`', 'Model tự quyết gọi tool hoặc trả lời chữ', 'Có thể trả **văn bản hội thoại** thay vì gọi tool → hỏng parser (Q117).'],
            ['`any`', 'Bắt buộc gọi **một** tool, model chọn tool nào', 'Nhiều schema theo loại tài liệu (invoice, contract, receipt) và **chưa biết loại trước** → đảm bảo luôn có đầu ra có cấu trúc.'],
            ['`{"type":"tool","name":"X"}`', 'Bắt buộc gọi **đúng tool X**', 'Cần bước bắt buộc **đầu tiên** (Q71/113): ép `extract_metadata` trước, rồi quay lại `auto` ở lượt sau để enrichment.'],
            ['`none`', 'Cấm gọi tool', '—'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Bẫy tool_choice',
          text: '`any` **không** chọn đúng tool — vẫn có thể gọi `lookup_citations` trước. **Thứ tự liệt kê tool** không phải hợp đồng ưu tiên. Ép một tool cố định ở **mọi** lệnh gọi sẽ không bao giờ cho enrichment chạy.',
        },
        { type: 'h', text: 'Thiết kế schema để không ép model bịa' },
        {
          type: 'list',
          items: [
            '**Trường không có thông tin → `null`** (Q68/157): thêm chỉ dẫn "trả `null` khi thông tin không được nêu trực tiếp". Đặt field **bắt buộc** (non-nullable) ép model **bịa** giá trị hợp lệ; nâng model hay thêm LLM verify chỉ là chữa triệu chứng.',
            '**Trường mơ hồ**: cho phép giá trị "thoát hiểm" hợp lệ — mảng rỗng cho `pros/cons` khi review quá ngắn, và `"unclear"` trong enum `overall_sentiment` (Q107/180). `neutral` không phải "không rõ"; `null` và mảng rỗng khác nghĩa.',
            '**Enum mở dần** (Q72/155): thêm giá trị **`"other"` + trường `property_type_detail`** (chuỗi) — giữ enum chặt cho các trường hợp phổ biến, vẫn lưu chi tiết. Mở rộng enum mãi = đuổi bắt; đổi sang chuỗi tự do mất từ vựng chuẩn; ép "tiny house" vào "house" làm mất khác biệt.',
            '**Giá trị có phiên bản** (Q65): hợp đồng có sửa đổi (30 ngày → 45 ngày) → schema cho phép **nhiều giá trị, mỗi giá trị kèm vị trí nguồn và ngày hiệu lực**. Quy tắc "luôn lấy bản mới nhất" mất bản gốc (cần khi tranh chấp).',
            '**Trường tự kiểm tra** (Q70/115): thêm `calculated_total` (model tự cộng các dòng) cạnh `stated_total`; **chênh lệch trở thành tín hiệu** để gắn cờ cho người kiểm tra. Model "hoà giải" thầm lặng hoặc tự điều chỉnh tỷ lệ số tiền là bịa dữ liệu tài chính.',
            '**Chuẩn hoá định dạng ngay khi trích** (Q67): schema chặt + **quy tắc chuẩn hoá trong prompt** ("giá là số thập phân 2 chữ số", "dietary là tag enum") — một lượt, giữ ngữ cảnh chéo trường.',
          ],
        },
        { type: 'h', text: 'Few-shot: cách dạy mẫu đầu ra' },
        {
          type: 'p',
          text: 'Khi vấn đề là **cách model diễn giải** (thế nào là một "skill", tách "Python và SQL" hay không, định dạng vật liệu nào là chuẩn, nhận diện trích dẫn/phương pháp ở các định dạng khác nhau), **few-shot với 2–3 cặp input–output đầy đủ** dạy mẫu cụ thể và cũng tăng recall (Q63/73/69/106/112/156).',
        },
        {
          type: 'table',
          headers: ['Vấn đề', 'Cách sửa', 'Không hiệu quả vì'],
          rows: [
            ['Độ dài mảng skills 5–10 vs 40+; tách/không tách; skills ngầm định', 'Few-shot về tách cụm, tiêu chí "được nhắc rõ", độ chi tiết.', 'Giới hạn cứng 10–20 gây bỏ sót hoặc độn; hậu xử lý không sửa được suy diễn ngầm.'],
            ['"cotton blend" vs "Cotton/Polyester mix", đôi khi bỏ trống', 'Few-shot định dạng chuẩn.', '`required` không sửa định dạng, có thể bịa; `temperature 0` chỉ làm câu sai nhất quán; đổi model tốn kém mà không nói cho model biết định dạng mong muốn.'],
            ['5% mảng rỗng dù tài liệu có citations/methodology ở định dạng đa dạng', 'Few-shot trên **cấu trúc tài liệu đa dạng**.', 'Retry cùng prompt không dạy nhận ra thứ chưa nhận ra; regex giòn; nới lỏng schema chỉ che triệu chứng.'],
          ],
        },
      ],
    },
    {
      id: 'validation-retry-review',
      title: 'Kiểm tra, thử lại & con người trong vòng lặp',
      summary: 'Retry kèm phản hồi lỗi, khi nào retry vô ích, xử lý tài liệu dài, và phân bổ sức người review dựa trên độ tin cậy được hiệu chỉnh.',
      questionIds: [64, 66, 74, 108, 109, 114, 118, 150, 151, 154],
      blocks: [
        { type: 'h', text: 'Retry với phản hồi lỗi' },
        {
          type: 'p',
          text: 'Khi validation thất bại (Pydantic: "expected float for quantity, got \'2 to 3\'"), **retry nguyên xi** cho cùng lỗi. Cách đúng (Q109/118): **gửi yêu cầu tiếp theo kèm tài liệu gốc + bản trích sai + lỗi cụ thể** để model tự sửa. Kỹ thuật này giải quyết phần lớn lỗi trong 2–3 lượt.',
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Khi nào retry KHÔNG giúp được (Q66/108)',
          text: 'Chỉ giúp với lỗi mà model **có thể làm đúng từ chính nguồn**: sai định dạng ("1,234" → 1234), sai kiểu ngày (ISO datetime → `YYYY-MM-DD`), sai cấu trúc (object lồng → mảng phẳng). **Vô ích** khi thông tin **không có trong input** — ví dụ "et al." trong khi danh sách tác giả đầy đủ nằm ở tài liệu ngoài.',
        },
        { type: 'h', text: 'Tài liệu dài & phân tán thông tin' },
        {
          type: 'list',
          items: [
            'Độ chính xác 94% (họp <30 phút) tụt còn 68% (họp >60 phút) dù vẫn vừa cửa sổ (Q150): **chia transcript thành các đoạn, trích từng đoạn, rồi gộp và khử trùng lặp**. Few-shot, model mạnh hơn hay bước tóm tắt trước đều không xử lý trực tiếp phân tán thông tin trong ngữ cảnh dài.',
            'Định nghĩa tool 2.500 token cộng system prompt cộng tài liệu 175–190K chạm giới hạn 200K nên phần cuối tài liệu bị bỏ sót (Q114): **định nghĩa tool cũng tiêu tốn token đầu vào**.',
            '300 tài liệu lỗi `context_length_exceeded` trong một batch (Q77): **chia nhỏ rồi chỉ gửi lại 300 tài liệu đó**, sau đó gộp kết quả một phần. Tăng `max_tokens` chỉ tác động độ dài **đầu ra**.',
          ],
        },
        { type: 'h', text: 'Dùng phản hồi của người để cải thiện' },
        {
          type: 'p',
          text: '847 lần sửa, 23% do phép đo không chính xác ("a handful", "a splash") (Q151): **thêm few-shot** trích chúng **nguyên văn** thay vì đổi số hoặc bỏ trống. Không cần fine-tune ngay, thêm trường enum hay pattern matching tự điền.',
        },
        { type: 'h', text: 'Phân bổ sức người review' },
        {
          type: 'table',
          headers: ['Tình huống', 'Cách đúng', 'Lý do'],
          rows: [
            ['12% lỗi ngữ nghĩa qua được schema; người chỉ review được **20%** (Q74)', 'Model xuất **confidence từng trường**, **hiệu chỉnh ngưỡng bằng tập dữ liệu có nhãn**', 'Lỗi tập trung ở vùng tin cậy thấp; lấy mẫu ngẫu nhiên chỉ bắt 20% của 12%.'],
            ['Muốn tự động hoá các trích xuất >90% tin cậy (aggregate 97%) (Q64)', '**Phân tích độ chính xác theo loại tài liệu và trường** trước', 'Số tổng hợp che phân đoạn yếu (một loại có thể chỉ 70%). Chỉnh ngưỡng, pilot, kiểm yêu cầu hạ nguồn đều đến **sau**.'],
            ['12% lỗi còn nằm ở nhóm >85% tin cậy (bảng đối thủ, phụ lục…) (Q154)', '**Lấy mẫu ngẫu nhiên phân tầng** một tỷ lệ cố định mỗi tuần', 'Đo được tỷ lệ lỗi theo thời gian và phát hiện mẫu lỗi mới; luật heuristic chỉ bắt lỗi đã biết.'],
          ],
        },
      ],
    },
    {
      id: 'prompting-techniques',
      title: 'Kỹ thuật prompt, làm rõ yêu cầu & duy trì hành vi',
      summary: 'System prompt cho hành vi bền vững, nguyên tắc chung thay vì nhiều điều kiện, xử lý mơ hồ bằng giả định tường minh và giữ hướng dẫn qua các lượt dài.',
      questionIds: [122, 124, 126, 127, 129, 130, 131, 132, 138, 143, 145, 159],
      blocks: [
        { type: 'h', text: 'Đặt hướng dẫn hành vi ở đâu' },
        {
          type: 'p',
          text: 'Hành vi phải nhất quán qua mọi tương tác (giọng điệu nhiệt tình, giải thích lý do, hỏi làm rõ) → **system prompt** (Q129). Không đặt trong tin nhắn assistant đầu tiên, không nối vào từng tin nhắn người dùng, không dùng biến môi trường.',
        },
        {
          type: 'p',
          text: 'Thông tin **thay đổi giữa chừng** (webhook báo gói hàng đã giao) → cập nhật vào **system prompt trước lệnh gọi API kế tiếp** để trợ lý tự nhiên đưa vào câu trả lời (Q130). Không gửi "user message" giả gây phản hồi không được yêu cầu, hay gắn tiền tố vào tin nhắn người dùng.',
        },
        { type: 'h', text: 'Nguyên tắc chung thắng chuỗi điều kiện IF–THEN' },
        {
          type: 'p',
          text: 'System prompt kiểu "nếu người dùng nói mình là beginner… nếu dùng từ superset…" chỉ nhận ra **tuyên bố tường minh**, còn tín hiệu ngầm (thuật ngữ chuyên môn) bị bỏ qua (Q122/159). Thay hầu hết điều kiện bằng **một nguyên tắc**: *"Điều chỉnh độ sâu giải thích theo trình độ người dùng, phản chiếu thuật ngữ của họ"*, chỉ giữ điều kiện **an toàn quan trọng** (khuyên gặp bác sĩ khi hỏi tiền sử chấn thương). Thêm nhánh điều kiện mới là chạy theo vô hạn.',
        },
        { type: 'h', text: 'Yêu cầu mơ hồ: giả định tường minh, hỏi khi bất khả đảo ngược' },
        {
          type: 'p',
          text: '"Book a venue for the party" thiếu ngày, số khách, ngân sách: hỏi 4 câu làm **35% bỏ cuộc**; hỏi ít thì gợi ý lệch (Q126/138/143). Cách cân bằng: **nêu rõ các giả định** dựa trên ngữ cảnh, tiếp tục đưa gợi ý và mời người dùng chỉnh, **chỉ hỏi làm rõ** cho hành động **không thể hoàn tác** (xác nhận đặt chỗ).',
        },
        {
          type: 'list',
          items: [
            'Dùng mặc định ngầm không nói ra: người dùng không biết đã bị giả định gì.',
            'Form thu thập tất cả tham số trước: tạo ma sát.',
            'Gộp mọi câu hỏi vào một câu ghép: chỉ giảm số lượt, không xử lý bản chất.',
            'Yêu cầu có **ba cách hiểu** ("Set up my focus music": cấu hình, tạo playlist hay phát ngay?) và hành động khác nhau đáng kể (Q131) → **một câu hỏi làm rõ loại hành động**.',
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Lưu ý Q138',
          text: 'Trong bộ đề gốc, Q138 (bản trùng của Q126) từng đánh dấu nhầm "gộp câu hỏi" là đúng. Đáp án nhất quán với Q126/Q143 là **nêu giả định tường minh + chỉ hỏi cho hành động không thể hoàn tác**.',
        },
        { type: 'h', text: 'Hướng dẫn bị "trôi" qua nhiều lượt' },
        {
          type: 'p',
          text: 'Hành vi đúng ở lượt 1–4 rồi chệch ở lượt 7 dù hội thoại chỉ 2.500 token; hoặc lệch giọng/định dạng ở lượt 25–30 (Q124/127/145). Không phải giới hạn ngữ cảnh mà là **ảnh hưởng của system prompt bị pha loãng** khi các phản hồi tích luỹ.',
        },
        {
          type: 'table',
          headers: ['Cách đề chấp nhận', 'Khi nào'],
          rows: [
            ['**Chèn tin nhắn vai user nhắc lại hướng dẫn then chốt** tại điểm ngắt tự nhiên, nhất là trước yêu cầu phức tạp (Q127)', 'Muốn duy trì giọng/định dạng/hạn chế thông tin.'],
            ['**Thay hướng dẫn dài bằng few-shot** minh hoạ đầu ra ở từng mức (từ vựng, độ phức tạp, độ sâu) (Q145)', 'Quy tắc điều chỉnh theo trình độ bị bỏ qua khi hội thoại kéo dài; ví dụ cụ thể bền hơn văn bản mô tả.'],
          ],
        },
        {
          type: 'list',
          items: [
            'Không chuyển hướng dẫn từ system prompt vào tin nhắn user đầu tiên.',
            'Không tự động bắt đầu hội thoại mới mỗi 20 lượt hoặc sinh lại từng phản hồi cho tới khi hợp lệ (đắt và không giải quyết gốc).',
            '**Loại bỏ câu mở đầu lặp** kiểu "Certainly!/I\'d be happy to help!" (Q132): đề chọn cách **gắn sẵn phần mở đầu của assistant (prefill) để model viết tiếp**. Chỉ dặn "đừng bắt đầu bằng…", hậu xử lý cắt chữ, hạ temperature đều kém hiệu quả. *(Lưu ý: một số model mới không hỗ trợ prefill; đây là đáp án theo bộ đề.)*',
          ],
        },
      ],
    },
    {
      id: 'batch-api',
      title: 'Message Batches API',
      summary: 'Giảm 50% chi phí, xử lý bất đồng bộ tới 24 giờ; chọn giữa batch và real-time, tính chu kỳ gửi theo SLA và xử lý lỗi.',
      questionIds: [62, 75, 76, 77, 110, 116, 181],
      blocks: [
        { type: 'h', text: 'Đặc điểm cần thuộc' },
        {
          type: 'list',
          items: [
            '**Giảm 50% chi phí** so với Messages API đồng bộ.',
            '**Bất đồng bộ**: đa số batch xong trong 1 giờ nhưng có thể mất **tới 24 giờ** — không đảm bảo độ trễ thấp.',
            'Mỗi request có **`custom_id`** để đối chiếu; **thứ tự kết quả có thể khác thứ tự gửi**.',
            'Kết quả liệt kê từng request thành công/thất bại theo `custom_id` (ví dụ `context_length_exceeded`).',
            'Không dùng cho việc chặn người dùng chờ hoặc có SLA phút.',
          ],
        },
        { type: 'h', text: 'Chọn batch hay real-time' },
        {
          type: 'table',
          headers: ['Tình huống', 'Quyết định'],
          rows: [
            ['Báo cáo hàng tháng (lưu trữ) + báo cáo ngoại lệ **cần cảnh báo trong 30 phút** (Q62/116)', '**Lai**: báo cáo thường → **Batch** (rẻ hơn 50%); báo cáo khẩn → **real-time**. Batch cho tất cả không đáp ứng SLA 30 phút.'],
            ['Review bảo mật 50 PR/ngày, **không chặn merge**, $150/ngày (Q75)', 'Yếu tố quyết định: **phản hồi trễ tới 24 giờ có còn hành động được không**.'],
            ['Trích 50.000 hợp đồng trong 2 tuần, 18% cần tinh chỉnh (Q110)', 'Gửi **toàn bộ qua batch**, sau đó gửi các bản lỗi ở **các batch kế tiếp**, tinh chỉnh prompt giữa các lần cho tới khi đạt.'],
          ],
        },
        { type: 'h', text: 'Tính chu kỳ gửi batch theo SLA (Q76)' },
        {
          type: 'p',
          text: 'Tài liệu đến liên tục; SLA: kết quả trong **30 giờ** với độ tin cậy 99,9%. Thời gian xấu nhất = **thời gian chờ để vào batch + 24 giờ xử lý**. Gửi mỗi **4 giờ** ⇒ 4 + 24 = 28 giờ (còn 2 giờ đệm) ✔. Mỗi 6 giờ ⇒ đúng 30 giờ, **không có biên an toàn** cho mục tiêu 99,9%. Gửi một lần cuối ngày ⇒ vượt SLA. Dùng real-time cho tất cả thì mất khoản tiết kiệm 50%.',
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Sửa lại đáp án bộ đề',
          text: 'Q76 trong file gốc đánh dấu nhầm "mỗi 6 giờ" là đúng, trong khi lời giải thích của chính câu này và phép tính đều cho đáp án **mỗi 4 giờ**. Ứng dụng đã sửa đáp án thành "mỗi 4 giờ".',
        },
        { type: 'h', text: 'Xử lý lỗi trong batch (Q77/181)' },
        {
          type: 'p',
          text: 'Chỉ tái xử lý **các request lỗi** (nhận diện qua `custom_id`), sau khi **chia nhỏ** tài liệu vượt giới hạn ngữ cảnh, rồi **gộp** kết quả từng phần. Chạy lại cả 10.000 tài liệu (dù bật prompt caching hay đổi model) phí phạm; `max_tokens` không liên quan tới lỗi độ dài đầu vào.',
        },
      ],
    },
  ],
}
