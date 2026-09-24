import type { TheoryDomain } from './types'

export const DOMAIN_5: TheoryDomain = {
  id: 'context-reliability',
  number: 5,
  title: 'Quản lý ngữ cảnh & độ tin cậy',
  weight: 15,
  summary: 'API không trạng thái, tóm tắt tiến dần, trạng thái có cấu trúc, ngân sách ngữ cảnh (tool output, RAG) và phiên bản hoá prompt.',
  topics: [
    {
      id: 'conversation-state',
      title: 'Trạng thái hội thoại & bộ nhớ dài hạn',
      summary: 'API stateless: phải gửi lại messages; tóm tắt tiến dần, trạng thái có cấu trúc, "story bible", kho sự kiện cho câu hỏi cần độ chính xác.',
      questionIds: [34, 39, 119, 120, 121, 123, 125, 135, 142, 144, 146, 158],
      blocks: [
        { type: 'h', text: 'API không có bộ nhớ' },
        {
          type: 'p',
          text: 'Messages API là **stateless**. Claude "quên" người dùng vừa nói thích jazz, quên câu trả lời xác minh thứ ba, hay không biết "những từ vựng đó" là gì (Q34/121/123) vì ứng dụng **không gửi lại các lượt trước trong mảng `messages`** ở request kế tiếp. Không có tham số `session_id`, không cần vector database để "nhớ", không phải lỗi công cụ xoá trạng thái, và không có "giới hạn hai lượt mặc định".',
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Nhận diện nhanh',
          text: 'Hỏi lại thông tin vừa được cung cấp, hội thoại còn rất ngắn ⇒ **không truyền lịch sử** vào mỗi request. Cửa sổ ngữ cảnh đầy chỉ là nguyên nhân khi hội thoại đã rất dài.',
        },
        { type: 'h', text: 'Khi hội thoại quá dài: các chiến lược' },
        {
          type: 'table',
          headers: ['Chiến lược', 'Ưu', 'Nhược', 'Dùng khi'],
          rows: [
            ['**Tóm tắt tiến dần** (progressive summarization): thay khối cũ bằng tóm tắt **rút trích kết luận, quyết định, chủ đề lặp lại**, giữ nguyên văn các lượt gần đây', 'Giữ mạch chuyện, giảm token', 'Có thể mất chi tiết chính xác', '**Lựa chọn mặc định** cho hội thoại dài, cần duy trì mạch (Q119/125/39).'],
            ['Sliding window (cửa sổ trượt)', 'Đơn giản', 'Âm thầm **bỏ mất** vấn đề cũ mà người dùng có thể hỏi lại', 'Ít khi đúng trong đề.'],
            ['Truy hồi ngữ nghĩa (vector) thay thế lịch sử', 'Quy mô lớn', 'Mất mạch tuyến tính; kỹ thuật nặng', 'Kho tri thức lớn, không phải hội thoại cần mạch chuyện.'],
            ['**Trạng thái có cấu trúc** (structured state) đi kèm mỗi request', 'Chính xác, cập nhật được', 'Cần code duy trì', 'Sở thích/tham số **thay đổi** hoặc dữ kiện then chốt (Q144).'],
          ],
        },
        {
          type: 'list',
          items: [
            '**85.000 token sau 3 tháng, trả lời chung chung** (Q119) → **progressive summarization**: khối cũ thành tóm tắt nêu rõ kết luận/quyết định/chủ đề, phần gần đây giữ nguyên văn. Cửa sổ trượt 25K bỏ mất buổi cũ; embedding thay hội thoại mất mạch chuyện; thẻ XML không giảm token.',
            '**Bữa tiệc tối 78.000 token** (Q120): **trích dữ kiện quan trọng có cấu trúc** (dị ứng hải sản, số khẩu phần, định nghĩa "bơ nhiệt độ phòng" = 68°F) vào một mục tham chiếu gọn, **tóm tắt phần chung**, giữ nguyên văn các lượt gần. Tóm tắt toàn bộ mất dị ứng — an toàn!',
            '**Mất sở thích do chỉnh sửa** (Q125/144): thay sliding window bằng **lai: tóm tắt tin nhắn cũ + giữ nguyên văn tin nhắn gần**. Với sở thích bị thay đổi ("nâng ngân sách lên $650K", "thích căn hộ hơn nhà") dù ngữ cảnh chỉ 35%: **duy trì đối tượng trạng thái hiện tại, cập nhật khi đổi, đưa vào mỗi request** — đáng tin hơn dặn "ưu tiên mới nhất", few-shot hay cắt tỉa lượt cũ.',
            '**Truyện dài 40+ lượt** (Q142): tách **"story bible"** (nhân vật, cốt truyện, luật thế giới) làm phần **được giữ lại** ở đầu ngữ cảnh; chỉ cắt/tóm tắt **phần brainstorm** phù du.',
            '**Nhiều vấn đề trong một phiên** (Q39/135): gần giới hạn ngữ cảnh mà khách hỏi lại vấn đề hoàn tiền ở lượt 1–15 → **tóm tắt các lượt trước thành mô tả dạng kể, chỉ giữ nguyên văn cho vấn đề đang hoạt động**. Sliding window bỏ mất vấn đề cần hỏi.',
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Lưu ý Q135',
          text: 'Q135 là bản trùng của Q39 nhưng file gốc đánh dấu "trạng thái có cấu trúc" là đúng. Đáp án nhất quán với Q39 là **tóm tắt dạng kể + giữ nguyên văn cho vấn đề đang hoạt động**. Ứng dụng đã sửa để hai câu khớp nhau.',
        },
        { type: 'h', text: 'Câu hỏi cần độ chính xác số liệu (Q158)' },
        {
          type: 'p',
          text: 'Tóm tắt sau 8 lượt làm mất cỡ mẫu, p-value chính xác, tiêu chí đưa vào. Cách đúng: **duy trì kho dữ kiện có cấu trúc** (sample size, thống kê, phương pháp) trích từ mỗi bài báo và **truy hồi mục liên quan vào ngữ cảnh** khi phát hiện câu hỏi cần độ chính xác. Tóm tắt "chi tiết hơn" vẫn có thể lossy; giữ vĩnh viễn nguyên văn mục Methods/Results phình ngữ cảnh.',
        },
        { type: 'h', text: 'Phiên bản hoá system prompt (Q146)' },
        {
          type: 'p',
          text: 'Sau khi triển khai system prompt mới, người dùng có hội thoại kéo dài nhiều tuần thấy trợ lý **mâu thuẫn lời cũ và đổi phong cách**, người mới không bị. Cách đúng: **phiên bản hoá system prompt** và gắn mỗi hội thoại với phiên bản prompt lúc bắt đầu; **chỉ áp dụng bản mới cho hội thoại mới**. Sinh lại tóm tắt lịch sử, thông báo chuyển đổi, hay dặn "nhất quán với những gì đã nói" không đảm bảo.',
        },
      ],
    },
    {
      id: 'context-budgeting',
      title: 'Ngân sách ngữ cảnh: tool output, RAG & suy giảm chất lượng',
      summary: 'Tỉa kết quả tool cồng kềnh, cửa sổ trượt cho RAG, chống suy giảm chú ý bằng scratchpad/subagent, và giữ dữ kiện quan trọng.',
      questionIds: [42, 49, 53, 55, 114, 128, 134, 190],
      blocks: [
        { type: 'h', text: 'Kết quả tool phình to ngữ cảnh' },
        {
          type: 'p',
          text: 'Mỗi phản hồi `lookup_order` có 40+ trường, tool output chiếm phần lớn ngữ cảnh, khách nhắc thêm hai đơn hàng (Q42/134/190). Trước khi gọi tiếp, **trích chỉ các trường liên quan tới bài toán** (mặt hàng, ngày mua, thời hạn hoàn trả, trạng thái) từ các phản hồi hiện có và bỏ phần dài dòng.',
        },
        {
          type: 'list',
          items: [
            'Tóm tắt thành văn xuôi: mất độ chính xác (ngày, số tiền) — **tỉa có cấu trúc tốt hơn diễn giải lại**.',
            'Đưa vào vector database có index ngữ nghĩa: hạ tầng nặng cho thứ chỉ là bài toán tỉa.',
            'Không làm gì: ngữ cảnh sắp cạn.',
            'Cách sạch hơn: **lọc ở phía tool** — trả ít trường hơn ngay từ đầu.',
          ],
        },
        { type: 'h', text: 'RAG tích luỹ chèn ép lịch sử (Q128)' },
        {
          type: 'p',
          text: 'Kết quả RAG của mọi truy vấn trước đó chiếm ngữ cảnh làm hội thoại kém mạch lạc sau 15+ lượt. Cách đúng: **sliding window cho kết quả RAG** (giữ kết quả 2–3 truy vấn gần nhất) **và giữ nguyên lịch sử hội thoại**. Nhường thêm ngân sách cho RAG làm mất lịch sử; nén mọi RAG thành một bản tổng hợp cập nhật dần lại thêm rủi ro mất mát.',
        },
        { type: 'h', text: 'Ngữ cảnh dài ≠ luôn tốt hơn' },
        {
          type: 'list',
          items: [
            'Trong phiên dài, model có thể suy giảm chú ý — trả lời bằng "mẫu chung" thay vì lớp cụ thể đã khám phá (Q49), không nhất quán về cấu trúc mã (Q53). Cửa sổ lớn hơn **không** giải quyết vấn đề này.',
            'Định nghĩa tool, system prompt và tài liệu cùng nằm trong giới hạn: định nghĩa tool 2.500 token + tài liệu 175–190K chạm 200K và mất phần cuối (Q114).',
            'Bài toán điều tra lớn (45 file): đọc 8 file đầu đã tụt chất lượng → **uỷ quyền cho subagent** với ngữ cảnh sạch cho từng câu hỏi hẹp, agent chính giữ bức tranh tổng (Q55).',
          ],
        },
        {
          type: 'table',
          headers: ['Công cụ', 'Bảo vệ điều gì', 'Ví dụ'],
          rows: [
            ['**Scratchpad file**', 'Phát hiện quan trọng khỏi mất khi ngữ cảnh đông', 'Agent ghi `notes.md` sau mỗi bước, đọc lại khi cần.'],
            ['**Subagent với ngữ cảnh mới**', 'Ngữ cảnh chính khỏi phình', '"Tìm mọi file test cho payment."'],
            ['**Tóm tắt có chọn lọc**', 'Chi tiết quyết định', 'Nén phát hiện rendering rồi giao cho subagent khám phá physics.'],
            ['**Tỉa trường tool output**', 'Ngân sách token', 'Chỉ giữ các trường liên quan hoàn trả.'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Cách nhớ',
          text: 'Không **xoá sạch** (mất kiến thức), không **chỉ nâng model**. Hãy **giữ thứ quan trọng ở dạng bền và có cấu trúc** (scratchpad, trạng thái, kho dữ kiện), **loại phần nhiễu** (tool output thừa, RAG cũ) và **chia việc cho ngữ cảnh mới** (subagent).',
        },
      ],
    },
  ],
}
