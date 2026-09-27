// Các nhóm câu CÙNG TÌNH HUỐNG trong từng bộ đề — hiện trên mỗi câu trong CertQuiz kèm nút chuyển tới câu kia
// và lời giải thích vì sao chúng giống nhau (mở sẵn sau khi đã nộp đáp án, để khỏi lộ đáp án trước).
//
// Chỉ gồm những câu KHÔNG phải trùng y hệt: bản trùng thật (cùng đề, cùng đáp án đúng, chỉ khác lựa chọn sai)
// đã bị xoá khỏi bộ đề. Còn lại hai loại:
// - variant: cùng đề nhưng bộ lựa chọn khác nên đáp án đúng khác — phải đọc kỹ các lựa chọn đang có.
// - series: dạng "Solution: … Does this meet the goal?" của Microsoft — cùng một mục tiêu, mỗi câu thử một giải
//   pháp. Phần mô tả mục tiêu thường bị mất khi thu thập đề, nên note ghi lại mục tiêu để câu có nghĩa.
// - case: cùng case study nhưng hỏi khía cạnh khác.
export type RelatedKind = 'variant' | 'series' | 'case'

export interface RelatedGroup {
  ids: number[]
  kind: RelatedKind
  title: string
  note: string
}

export const RELATED_KIND_LABEL: Record<RelatedKind, string> = {
  variant: 'Cùng đề, khác đáp án',
  series: 'Cùng tình huống (chuỗi "Solution")',
  case: 'Cùng case study',
}

const RELATED: Record<string, RelatedGroup[]> = {
  'ai-200': [
    {
      ids: [47, 48, 49, 88],
      kind: 'series',
      title: 'Lưu API key cho container trên App Service',
      note: 'Mục tiêu gốc: container chạy trên Azure App Service cần một API key; key phải nằm **ngoài source control / lịch sử Git** nhưng container vẫn đọc được **lúc chạy**. Mỗi câu thử một cách. **Đạt**: Key Vault + Key Vault reference trong app setting (#49), app setting đặt qua Azure portal (#88). **Không đạt**: ENV trong Dockerfile (#47 — key nằm trong image và Git), GitHub repository secret (#48 — chỉ dùng trong workflow, không tới container).',
    },
    {
      ids: [50, 51, 52],
      kind: 'series',
      title: 'Lưu cấu hình & secret theo môi trường cho Function app',
      note: 'Mục tiêu gốc: Function app cần cấu hình riêng cho từng môi trường và secret (connection string), **không để trong source control**. **Đạt**: App Configuration + Key Vault reference, truy cập bằng managed identity (#50); application settings đặt qua portal (#52 — mã hoá khi lưu, thành biến môi trường). **Không đạt**: ENV khai báo trong Dockerfile (#51 — secret nằm trong image).',
    },
    {
      ids: [85, 87, 92],
      kind: 'series',
      title: 'Đọc kết quả query KQL summarize theo resultCode',
      note: 'Query gốc: `requests | summarize request_count = count() by resultCode | order by request_count desc`, mục tiêu là liệt kê các result code **từ nhiều request nhất đến ít nhất**. **Đúng**: mỗi resultCode một hàng kèm số request (#85). **Sai**: hiện từng request riêng lẻ (#87 — summarize đã gộp nhóm), sắp theo alphabet (#92 — đang sắp theo `request_count`).',
    },
  ],
  'ai-103': [
    {
      ids: [17, 18, 19, 20],
      kind: 'series',
      title: 'Agent tóm tắt bỏ sót điều khoản bắt buộc',
      note: 'Mục tiêu gốc: agent tóm tắt tài liệu chính sách bỏ sót các điều khoản bắt buộc **dù chúng có trong nội dung truy xuất**; cần sửa trong logic ứng dụng để bản tóm tắt đủ điều khoản **trước khi trả về**. **Đạt**: reflection pass kiểm tra và tạo lại khi thiếu (#18). **Không đạt**: tăng `max_tokens` (#17 — không phải lỗi độ dài), tăng `temperature` (#19 — chỉ thêm ngẫu nhiên), evaluation flow chấm điểm rồi chặn (#20 — chỉ là cổng chất lượng, không bổ sung nội dung còn thiếu).',
    },
    {
      ids: [52, 53, 54, 55],
      kind: 'series',
      title: 'Ảnh upload: vừa có nội dung không an toàn, vừa có lệnh chèn gián tiếp',
      note: 'Mục tiêu gốc: ứng dụng nhận ảnh người dùng upload, phải chặn **cả** ảnh có nội dung độc hại **lẫn** chữ trong ảnh chứa lệnh prompt injection gián tiếp. Mỗi giải pháp đơn lẻ chỉ xử lý một nửa nên **cả bốn đều "No"**: prompt shield cho user prompt (#52 — không xét nội dung bên thứ ba), image moderation (#53 — chỉ nửa về ảnh), prompt shield cho documents (#54 — chỉ nửa về injection), protected material detection (#55 — dành cho nội dung có bản quyền ở đầu ra).',
    },
  ],
  'ab-100': [
    {
      ids: [15, 16, 17],
      kind: 'series',
      title: 'Tóm tắt email Outlook & chuẩn bị họp từ dữ liệu CRM',
      note: 'Mục tiêu gốc: đội sales cần tóm tắt chuỗi email Outlook, gợi ý trả lời và bản tóm tắt chuẩn bị cuộc họp dựa trên dữ liệu Dynamics 365 CRM. **Đạt**: Microsoft 365 Copilot for Sales (#15). **Không đạt**: classic Dataverse workflow (#16 — tự động hoá theo quy tắc, không có AI tạo sinh), Microsoft 365 Copilot agent template (#17 — chỉ là điểm khởi đầu dựng agent).',
    },
    {
      ids: [76, 77, 78, 79],
      kind: 'series',
      title: 'Tùy chỉnh bản tóm tắt cơ hội (opportunity summary) của Copilot',
      note: 'Mục tiêu gốc: tùy chỉnh nội dung và cách hiển thị bản tóm tắt cơ hội do Copilot tạo trong Dynamics 365 Sales. **Đạt**: thêm field vào opportunity summary (#77), đặt widget opportunity summary lên form Opportunity (#79). **Không đạt**: Power Automate flow (#76 — không có cách được hỗ trợ để chỉnh tóm tắt có sẵn), AI Builder lead scoring (#78 — là tính năng dự đoán khác hẳn).',
    },
    {
      ids: [102, 103, 104],
      kind: 'series',
      title: 'Nền tảng agent phân tích khách hàng, ít phát triển tùy chỉnh',
      note: 'Mục tiêu gốc: cần nền tảng agent phân tích khách hàng có sẵn analytics về hiệu suất AI và nhận diện nhân khẩu học, hạn chế tối đa phát triển tùy chỉnh. **Cả ba đều "No"**: GitHub Copilot (#102 — hỗ trợ lập trình), Security Copilot (#103 — cho đội bảo mật), Copilot Studio (#104 — analytics có sẵn tập trung vào hiệu suất hội thoại của agent, không phải nhân khẩu học khách hàng).',
    },
    {
      ids: [21, 39],
      kind: 'variant',
      title: 'Ước tính chi phí giải pháp phân tích cảm xúc cho ROAI',
      note: 'Cùng một đề, chỉ khác bộ lựa chọn. Giải pháp **chưa triển khai** nên cần **ước tính** chi phí: có **Azure pricing calculator** thì chọn nó (#21). Bộ lựa chọn của #39 không có pricing calculator nên đáp án là **Cost Management + Billing**. TCO Calculator (so on-premises với cloud), Reservations / savings plans (giảm giá cam kết) luôn là bẫy. Các bản trùng y hệt đã được xoá.',
    },
    {
      ids: [27, 68, 117],
      kind: 'variant',
      title: 'Giám sát telemetry nhiều agent Copilot Studio',
      note: 'Cùng một đề, chỉ khác bộ lựa chọn. Có **Application Insights** thì chọn nó (#27 — telemetry & chẩn đoán đầy đủ). Không có thì chọn **the Analytics tab in Copilot Studio** (#68). ⚠️ #117 cũng không có Application Insights nhưng bộ đề ghi đáp án là **Power BI** — mâu thuẫn với #68, nơi có cả Power BI lẫn Analytics tab mà đáp án là Analytics tab. Nhiều khả năng đáp án của #117 bị ghi sai; nên hiểu đáp án đúng là Analytics tab. Các bản trùng y hệt đã được xoá.',
    },
    {
      ids: [30, 115],
      kind: 'variant',
      title: 'Chuẩn bị dữ liệu phản hồi khách hàng cho agent',
      note: 'Cùng một đề, chỉ khác bộ lựa chọn. Có **"Identify and address biased data"** thì chọn nó (#30 — dữ liệu lệch làm sai insight về cảm xúc). Bộ lựa chọn của #115 không có lựa chọn về bias nên đáp án là **xử lý dữ liệu thiếu / không nhất quán**. Các bản trùng y hệt đã được xoá.',
    },
    {
      ids: [71, 81],
      kind: 'case',
      title: 'Case study Fabrikam chuyển sang Dynamics 365 Sales',
      note: 'Cùng một case study (Fabrikam bỏ hệ thống on-premises, dùng Dynamics 365 Sales theo hướng AI-first) nhưng hỏi hai khía cạnh khác nhau: #71 hỏi nguồn hướng dẫn best practice, #81 hỏi chọn tool và dữ liệu tool cần. Không phải câu trùng.',
    },
  ],
}

export interface RelatedLink {
  group: RelatedGroup
  others: number[]
}

// Câu hỏi → các nhóm liên quan (kèm id các câu còn lại trong nhóm).
export function relatedByQuestion(certId: string): Record<number, RelatedLink[]> {
  const map: Record<number, RelatedLink[]> = {}
  for (const group of RELATED[certId] ?? []) for (const id of group.ids) (map[id] ??= []).push({ group, others: group.ids.filter((x) => x !== id) })
  return map
}
