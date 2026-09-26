import type { TheoryDomain } from './types'

export const DOMAIN_5: TheoryDomain = {
  id: 'context-reliability',
  number: 5,
  title: 'Quản lý context & confidence',
  weight: 15,
  summary: 'API stateless, tóm tắt tiến dần, structured state, ngân sách context (tool output, RAG) và phiên bản hoá prompt.',
  topics: [
    {
      id: 'conversation-state',
      title: 'Trạng thái hội thoại & bộ nhớ dài hạn',
      summary: 'API không có trí nhớ nên phải gửi lại lịch sử; hội thoại dài thì progressive summarization, tách dữ kiện quan trọng thành structured state.',
      questionIds: [34, 39, 119, 120, 121, 123, 125, 142, 144, 146, 158],
      blocks: [
        {
          type: 'tldr',
          text: 'API của Claude **không có trí nhớ**: mỗi request, ứng dụng phải **gửi lại toàn bộ lịch sử** thì Claude mới "nhớ". Khi hội thoại quá dài: **tóm tắt phần cũ, giữ nguyên văn phần gần**, và tách các dữ kiện quan trọng (dị ứng, ngân sách, số liệu) thành **một mục có cấu trúc** luôn được gửi kèm.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Stateless', meaning: 'API không lưu gì giữa các lần gọi — mỗi request là một lần "gặp lần đầu".' },
            { term: '`messages` array', meaning: 'Danh sách các lượt user/assistant gửi kèm mỗi request — đây chính là "trí nhớ" của Claude.' },
            { term: 'Progressive summarization', meaning: 'Progressive summarization: phần cũ được nén thành bản tóm tắt, phần gần giữ nguyên văn.' },
            { term: 'Sliding window', meaning: 'Chỉ giữ N lượt gần nhất, lượt cũ hơn bị **bỏ hẳn**.' },
            { term: 'Structured state', meaning: 'Một đối tượng dữ liệu (vd. `{ budget, allergies }`) do code cập nhật và gửi kèm mỗi request.' },
          ],
        },

        { type: 'h', text: '1. API không có trí nhớ' },
        {
          type: 'p',
          text: 'Giống gọi tổng đài mà mỗi lần lại gặp một nhân viên mới: muốn họ biết chuyện trước đó, bạn phải **kể lại từ đầu**. Ứng dụng của bạn chính là người "kể lại" — bằng cách gửi mảng `messages` chứa các lượt trước.',
        },
        {
          type: 'example',
          scenario: 'Mới lượt thứ 3, Claude đã hỏi lại điều người dùng vừa nói ("bạn thích thể loại nhạc nào?" dù họ vừa nói thích jazz).',
          right: 'Ứng dụng **không gửi lại các lượt trước** trong `messages` ở request mới — sửa để luôn gửi kèm lịch sử.',
          wrong: [
            'Thiếu parameter `session_id` — API không có parameter này.',
            'Cần vector database để "nhớ".',
            'Lỗi công cụ xoá trạng thái, hoặc "giới hạn mặc định 2 lượt".',
          ],
          why: 'Hội thoại còn rất ngắn thì không thể là do đầy context — chỉ có thể là không truyền lịch sử.',
        },

        { type: 'h', text: '2. Hội thoại quá dài: chọn chiến lược nào' },
        {
          type: 'table',
          headers: ['Chiến lược', 'Ưu', 'Nhược', 'Dùng khi'],
          rows: [
            ['**Progressive summarization**: nén phần cũ thành tóm tắt nêu rõ **kết luận, quyết định, chủ đề lặp lại**; giữ nguyên văn các lượt gần', 'Giữ mạch chuyện, bớt token', 'Có thể mất vài chi tiết chính xác', '**Lựa chọn mặc định** cho hội thoại dài.'],
            ['Sliding window', 'Đơn giản', 'Âm thầm **bỏ mất** chuyện cũ mà người dùng có thể hỏi lại', 'Hiếm khi là đáp án đúng.'],
            ['Semantic search (vector) thay cho lịch sử', 'Chịu được dữ liệu rất lớn', 'Mất mạch trước-sau; nặng về kỹ thuật', 'Kho tri thức lớn — không phải hội thoại cần mạch.'],
            ['**Structured state** gửi kèm mỗi request', 'Chính xác, cập nhật được', 'Phải viết code duy trì', 'Sở thích/thông số **hay thay đổi**, hoặc dữ kiện then chốt.'],
          ],
        },
        {
          type: 'table',
          headers: ['Tình huống', 'Cách đúng'],
          rows: [
            ['Hội thoại 85.000 token sau 3 tháng, trả lời ngày càng chung chung', '**Progressive summarization**. Sliding window 25K thì bỏ mất các buổi cũ; thay hội thoại bằng embedding thì mất mạch; bọc thẻ XML không giảm được token.'],
            ['Lên kế hoạch tiệc tối, 78.000 token', '**Tách dữ kiện quan trọng** thành mục tham chiếu có cấu trúc (dị ứng hải sản, số suất, "bơ nhiệt độ phòng" = 68°F), tóm tắt phần chung, giữ nguyên văn lượt gần. Tóm tắt hết thì có thể mất chi tiết **dị ứng** — nguy hiểm!'],
            ['Người dùng đổi ý: "nâng ngân sách lên $650K", "thích căn hộ hơn nhà" (context mới dùng 35%)', 'Giữ một **đối tượng trạng thái hiện tại**, cập nhật khi người dùng đổi ý, gửi kèm mỗi request. Đáng tin hơn dặn "ưu tiên thông tin mới nhất", few-shot hay cắt bớt lượt cũ.'],
            ['Viết truyện dài 40+ lượt', 'Tách **"story bible"** (nhân vật, cốt truyện, luật thế giới) — phần luôn giữ ở đầu context; chỉ tóm tắt/cắt phần brainstorm tạm thời.'],
            ['Một session xử lý nhiều vấn đề; gần hết context thì khách hỏi lại vụ hoàn tiền ở lượt 1–15', '**Tóm tắt các lượt cũ dạng kể chuyện**, chỉ giữ nguyên văn cho vấn đề **đang xử lý**. Sliding window sẽ bỏ mất đúng vụ khách đang hỏi.'],
          ],
        },
        { type: 'h', text: '3. Câu hỏi cần số liệu chính xác' },
        {
          type: 'example',
          scenario: 'Trợ lý nghiên cứu: sau 8 lượt, bản tóm tắt làm mất cỡ mẫu, p-value chính xác và tiêu chí chọn mẫu của các bài báo.',
          right: 'Duy trì một **kho dữ kiện có cấu trúc** (cỡ mẫu, thống kê, phương pháp) trích từ mỗi bài báo; khi câu hỏi cần accuracy thì **lấy đúng mục liên quan đưa vào context**.',
          wrong: ['Tóm tắt "chi tiết hơn" — vẫn có thể rơi mất số liệu.', 'Giữ nguyên văn mãi mục Methods/Results — context phình to.'],
          why: 'Con số chính xác phải được **lưu nguyên**, không đi qua tóm tắt.',
        },

        { type: 'h', text: '4. Đổi system prompt mà không làm rối hội thoại cũ' },
        {
          type: 'example',
          scenario: 'Sau khi triển khai system prompt mới, những người có hội thoại kéo dài nhiều tuần thấy trợ lý **mâu thuẫn với lời cũ và đổi giọng**; người dùng mới thì không sao.',
          right: '**Đánh số phiên bản system prompt**, gắn mỗi hội thoại với phiên bản lúc bắt đầu; **chỉ dùng bản mới cho hội thoại mới**.',
          wrong: ['Sinh lại tóm tắt lịch sử.', 'Thông báo cho người dùng về việc thay đổi.', 'Dặn "hãy nhất quán với những gì đã nói".'],
          why: 'Hội thoại cũ được xây trên prompt cũ; đổi prompt giữa chừng thì mâu thuẫn là điều tất yếu.',
        },
      ],
    },
    {
      id: 'context-budgeting',
      title: 'Ngân sách context: tool output, RAG & suy giảm chất lượng',
      summary: 'Context có giới hạn: trim tool result thừa, chỉ giữ RAG gần nhất, dùng scratchpad file và subagent khi session quá dài.',
      questionIds: [42, 49, 53, 55, 114, 128],
      blocks: [
        {
          type: 'tldr',
          text: 'Context giống **chiếc ba batch có sức chứa giới hạn**: càng nhét nhiều đồ thừa thì càng khó tìm đồ cần. Hãy **bỏ bớt phần thừa** (trường tool không cần, kết quả tìm kiếm cũ), **cất thứ quan trọng ra chỗ bền** (scratchpad file, structured state) và **chia việc cho subagent** có context sạch. Cửa sổ lớn hơn không tự làm model tập trung hơn.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Context', meaning: 'Mọi thứ model "thấy" trong một lần gọi: system prompt, định nghĩa tool, lịch sử, tool result, tài liệu.' },
            { term: 'Context budget', meaning: 'Số token tối đa có thể đưa vào; phải chia cho mọi thứ ở trên.' },
            { term: 'RAG', meaning: 'Tìm tài liệu liên quan rồi chèn vào context để model trả lời dựa trên đó.' },
            { term: 'Trim', meaning: 'Chỉ giữ những trường cần thiết, bỏ phần dư thừa — giữ nguyên giá trị gốc.' },
          ],
        },

        { type: 'h', text: '1. Tool result làm phình context' },
        {
          type: 'example',
          scenario: 'Mỗi lần gọi `lookup_order` trả về 40+ trường; tool result chiếm gần hết context, trong khi khách vừa nhắc thêm hai đơn hàng nữa.',
          right: 'Trước khi gọi tiếp, **chỉ giữ các trường liên quan** (mặt hàng, ngày mua, hạn đổi trả, trạng thái) từ các kết quả đã có, bỏ phần còn lại. Tốt hơn nữa: **lọc ngay ở phía tool** — trả ít trường ngay từ đầu.',
          wrong: [
            'Tóm tắt thành văn xuôi — mất accuracy (ngày, số tiền).',
            'Đưa vào vector database — hạ tầng nặng cho một việc chỉ cần trim bớt.',
            'Không làm gì — context sắp cạn.',
          ],
          why: '**Trim có cấu trúc** giữ nguyên giá trị chính xác; **diễn giải lại** thì có thể làm sai.',
        },

        { type: 'h', text: '2. Kết quả RAG dồn lại chèn ép lịch sử' },
        {
          type: 'example',
          scenario: 'Mỗi truy vấn lại chèn thêm tài liệu RAG và giữ mãi; sau 15+ lượt, hội thoại mất mạch vì lịch sử bị chèn ép.',
          right: 'Dùng **sliding window cho kết quả RAG** (chỉ giữ kết quả của 2–3 truy vấn gần nhất) và **giữ nguyên lịch sử hội thoại**.',
          wrong: [
            'Dành thêm chỗ cho RAG bằng cách bớt lịch sử — mất mạch chuyện.',
            'Nén mọi kết quả RAG thành một bản tổng hợp cập nhật dần — thêm rủi ro rơi mất thông tin.',
          ],
          why: 'Tài liệu cũ đã hết giá trị cho câu hỏi hiện tại; lịch sử hội thoại thì vẫn cần để giữ mạch.',
        },

        { type: 'h', text: '3. Context dài không có nghĩa là tốt hơn' },
        {
          type: 'list',
          items: [
            'Session dài làm model **giảm tập trung**: trả lời bằng "mẫu chung chung" thay vì tên lớp cụ thể đã tìm ra, mô tả cấu trúc code không nhất quán. Đổi model có cửa sổ lớn hơn **không** chữa được.',
            'Mọi thứ **dùng chung một giới hạn**: định nghĩa tool 2.500 token + system prompt + tài liệu 175–190K chạm mốc 200K → phần cuối tài liệu bị bỏ sót.',
            'Điều tra 45 file mà chất lượng đã giảm sau 8 file đầu → **giao cho subagent** context sạch cho từng câu hỏi hẹp; agent chính chỉ giữ bức tranh tổng.',
          ],
        },
        {
          type: 'table',
          headers: ['Công cụ', 'Bảo vệ điều gì', 'Ví dụ'],
          rows: [
            ['**Scratchpad file**', 'Phát hiện quan trọng không bị lạc khi context đông', 'Agent ghi `notes.md` sau mỗi bước, đọc lại khi cần.'],
            ['**Subagent context mới**', 'Context chính không phình to', '"Tìm mọi file test cho payment."'],
            ['**Tóm tắt có chọn lọc**', 'Chi tiết then chốt', 'Nén phát hiện về phần rendering rồi giao cho subagent khám phá phần physics.'],
            ['**Trim field của tool result**', 'Ngân sách token', 'Chỉ giữ các trường liên quan tới đổi trả.'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Cách nhớ',
          text: 'Đừng **xoá sạch** (mất kiến thức), đừng **chỉ đổi model to hơn**. Hãy **giữ thứ quan trọng ở dạng bền, có cấu trúc** (scratchpad, trạng thái, kho dữ kiện), **bỏ phần nhiễu** (trường tool thừa, RAG cũ) và **chia việc cho context mới** (subagent).',
        },
      ],
    },
  ],
}
