import type { TheoryDomain } from '../../ccaf-theory/types'

export const DOMAIN_4: TheoryDomain = {
  id: 'secure-monitor',
  number: 4,
  title: 'Bảo mật, giám sát & xử lý sự cố',
  category: 'Secure Monitor Troubleshoot Azure Solutions',
  summary: 'Managed identity + Key Vault, đặt secret đúng chỗ, xoay vòng secret, OpenTelemetry → Azure Monitor và truy vấn KQL.',
  topics: [
    {
      id: 'key-vault-identity',
      title: 'Key Vault & managed identity',
      summary: 'System- vs user-assigned identity, role Key Vault Secrets User ở phạm vi vault, thứ tự dựng quyền, secret không version để tự nhận bản rotate, Always Encrypted.',
      questionIds: [14, 31, 38, 45, 46, 56, 62, 63, 84, 94, 98, 99, 116],
      blocks: [
        {
          type: 'tldr',
          text: 'Công thức gần như luôn đúng: **secret nằm trong Key Vault**, app xác thực bằng **managed identity** (không lưu credential), identity được cấp **đúng role đọc secret ở phạm vi vault** (least privilege), và app đọc secret **không kèm version** để tự nhận bản mới sau khi rotate.',
        },
        {
          type: 'terms',
          items: [
            { term: 'System-assigned identity', meaning: 'Gắn với vòng đời app — **xoá app là identity mất theo**, quyền cũng tự hết.' },
            { term: 'User-assigned identity', meaning: 'Tài nguyên độc lập, dùng chung cho nhiều app, sống tiếp khi app bị xoá.' },
            { term: 'Key Vault Secrets User', meaning: 'Role RBAC chỉ **đọc nội dung secret** — đủ cho app.' },
            { term: 'Access policy', meaning: 'Mô hình phân quyền cũ của Key Vault; vault dùng **Azure RBAC** thì phải gán role, không dùng access policy.' },
            { term: 'Versionless secret', meaning: 'Gọi secret không kèm version → luôn trả bản hiện tại.' },
          ],
        },

        { type: 'h', text: '1. Thứ tự dựng quyền' },
        { type: 'steps', items: ['Tạo app (Function / Container App…)', '**Bật managed identity** cho app', '**Cấp quyền** cho identity trên Key Vault (role Secrets User / access policy)', 'Thêm **Key Vault reference** vào app settings hoặc đọc bằng SDK', '**Deploy code**'] },
        {
          type: 'table',
          headers: ['Lựa chọn', 'Đúng / sai'],
          rows: [
            ['Key Vault **Secrets User** ở **phạm vi vault**', 'Đúng — least privilege, giới hạn blast radius'],
            ['Key Vault **Administrator** ở phạm vi subscription', 'Sai — quá rộng'],
            ['Service principal + client secret trong env', 'Sai — lại phải lưu credential'],
            ['Quyền **recover**', 'Sai — chỉ để khôi phục object đã xoá'],
          ],
        },
        {
          type: 'example',
          scenario: 'Functions (Java) phải dùng Key Vault **không sửa code**, scale theo event, **không cold start**, vào **VNet**, và quyền **tự mất khi xoá app**.',
          right: '**Premium plan** → **system-assigned identity** → **access policy** cho identity đó.',
          wrong: ['Consumption — không có pre-warmed instance / VNet.', 'User-assigned identity — không mất theo app.'],
          why: 'Premium đáp ứng scale + warm + VNet; system-assigned gắn vòng đời app.',
        },

        { type: 'h', text: '2. Xoay vòng secret' },
        {
          type: 'table',
          headers: ['Cách đọc', 'Sau khi rotate'],
          rows: [
            ['**Không** chỉ định version', 'Tự nhận bản mới — **hỗ trợ rotation tự động**'],
            ['Chỉ định version (vd. `"123"`)', 'Vẫn trả bản cũ — **phải sửa tay**'],
            ['Managed identity', '**Không cần lưu credential**'],
            ['Client secret trong biến môi trường', '**Lộ credential**'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Credential đổi mỗi 30 ngày, app không được sửa tay',
          text: '**Rotation policy** trên Key Vault + **đọc secret không version**. Cache secret 30 ngày hay ghim version đều sai.',
        },

        { type: 'h', text: '3. Key Vault reference' },
        { type: 'code', text: '@Microsoft.KeyVault(SecretUri=https://mykeyvault.vault.azure.net/secrets/token/)', caption: 'Giá trị app setting — app đọc như biến môi trường thường' },

        { type: 'h', text: '4. Always Encrypted (Cosmos DB)' },
        {
          type: 'steps',
          items: ['Tạo **customer-managed key (CMK)** trong **Key Vault**', 'Tạo **data encryption key (DEK)** bằng SDK, bọc bởi CMK, lưu trong Cosmos DB', 'Tạo container với **encryption policy** chỉ định các trường cần mã hoá'],
        },
      ],
    },
    {
      id: 'secret-placement',
      title: 'Đặt secret & cấu hình ở đâu cho đúng',
      summary: 'App settings (mã hoá khi lưu) vs Key Vault reference vs Dockerfile ENV vs GitHub secrets vs local.settings.json — chuỗi câu "Does this solution meet the goal?".',
      questionIds: [42, 47, 48, 49, 50, 51, 52, 55, 86, 88],
      blocks: [
        {
          type: 'tldr',
          text: 'Đề hay ra chuỗi câu Yes/No cho cùng một mục tiêu "giữ secret ngoài source control mà container vẫn dùng được lúc chạy". Nguyên tắc: **cấu hình ngoài image, tiêm lúc chạy** → đạt; **nằm trong image hoặc chỉ tồn tại lúc CI** → không đạt.',
        },
        {
          type: 'table',
          headers: ['Giải pháp', 'Đạt?', 'Vì sao'],
          rows: [
            ['Key Vault + **Key Vault reference** trong app setting', '**Yes**', 'Secret ở Key Vault, app đọc như env var, hỗ trợ rotate không redeploy'],
            ['App Configuration + Key Vault reference, truy cập bằng managed identity', '**Yes**', 'Cấu hình theo môi trường + secret ở Key Vault'],
            ['**App setting / connection string** trong Azure portal', '**Yes**', 'Mã hoá khi lưu, tiêm thành env var, không nằm trong Git'],
            ['`ENV` trong **Dockerfile**', '**No**', 'Secret nằm trong image & lịch sử Git'],
            ['**GitHub repository secret**', '**No**', 'Chỉ dùng trong workflow GitHub Actions, không tới container lúc chạy'],
            ['`local.settings.json` / file tham số trong source control / hard-code', '**No**', 'Lộ trong source'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Cần rotate không redeploy, không downtime',
          text: '→ **App settings với Key Vault reference** (không version). App setting thường vẫn "đạt" cho câu hỏi chỉ đòi tránh source control, nhưng không đáp ứng yêu cầu rotate.',
        },
      ],
    },
    {
      id: 'opentelemetry',
      title: 'OpenTelemetry & distributed tracing với Azure Monitor',
      summary: 'Instrument → exporter → span processor → redeploy; TracerProvider, AzureMonitorTraceExporter, BatchSpanProcessor, sampler, propagation.',
      questionIds: [40, 64, 65, 66, 78],
      blocks: [
        {
          type: 'tldr',
          text: 'Pipeline tracing: **TracerProvider** (đăng ký toàn cục) → **exporter** (AzureMonitorTraceExporter) được gắn vào provider qua **span processor** (thường BatchSpanProcessor) → code tạo span bằng `tracer.start_as_current_span()`. Muốn trace **nối qua các service** thì phải **instrument thư viện HTTP** (vd. `requests`) để truyền trace context.',
        },
        {
          type: 'table',
          headers: ['Thành phần', 'Vai trò'],
          rows: [
            ['**TracerProvider**', 'Khởi tạo & đăng ký tracing toàn cục — phải làm **trước** khi tạo span'],
            ['**AzureMonitorTraceExporter**', 'Gửi dữ liệu trace tới Azure Monitor'],
            ['**Span processor**', 'Nối exporter vào provider; **BatchSpanProcessor** xuất nền theo lô (**không đồng bộ**)'],
            ['`tracer.start_as_current_span()`', 'Tạo span trong code ứng dụng'],
            ['Instrumentation library (`requests`, Flask…)', 'Tự tạo span & **inject header `traceparent`** cho request đi ra'],
          ],
        },
        { type: 'code', text: 'provider = TracerProvider()\ntrace.set_tracer_provider(provider)\nexporter = AzureMonitorTraceExporter(connection_string=conn)\nprovider.add_span_processor(BatchSpanProcessor(exporter))\n\ntracer = trace.get_tracer(__name__)\nwith tracer.start_as_current_span("process_request"):\n    ...', caption: 'Thứ tự đúng: provider → exporter → processor → span' },
        { type: 'steps', items: ['**Instrument code** bằng OpenTelemetry SDK', 'Cấu hình **trace exporter**', '**Redeploy** các service đã instrument'] },

        { type: 'h', text: 'Sampler' },
        {
          type: 'table',
          headers: ['Yêu cầu', 'Sampler'],
          rows: [
            ['Giữ quyết định sampling của span cha (nhất quán trong một trace)', '**ParentBasedSampler**'],
            ['Ghi mọi span khi test local', '**AlwaysOnSampler**'],
            ['Lấy 10% trace ở production', '**TraceIdRatioBasedSampler(0.1)**'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Bẫy',
          text: '**View** trong OpenTelemetry áp dụng cho **metrics**, không phải trace. `TelemetryClient.TrackEvent()` tạo custom event (SDK Application Insights cũ), không tạo distributed trace. **Log sampling** không xuất span.',
        },
      ],
    },
    {
      id: 'kql-monitor',
      title: 'KQL & phân tích log trong Azure Monitor',
      summary: 'where lọc sớm, summarize gom nhóm, join tương quan requests–dependencies, project, order by; đọc kết quả query.',
      questionIds: [59, 80, 83, 85, 87, 89, 90, 92, 95],
      blocks: [
        {
          type: 'tldr',
          text: 'KQL đọc từ trên xuống, mỗi `|` biến đổi kết quả. **`where`** để lọc (thời gian, lỗi) — đặt **càng sớm càng tốt**; **`summarize`** để tính `count()`/`avg()` **theo nhóm**; **`join`** để ghép requests với dependencies qua operation id. Phân tích **một lần** trên log nhiều dịch vụ → chạy **query KQL** trong Log Analytics.',
        },
        {
          type: 'table',
          headers: ['Toán tử', 'Làm gì'],
          rows: [
            ['`where`', 'Lọc hàng theo điều kiện (`TimeGenerated > ago(30m)`, `Success == false`)'],
            ['`summarize … by …`', 'Tổng hợp theo nhóm — **mỗi giá trị nhóm ra một hàng**'],
            ['`join`', 'Ghép hai bảng theo khoá chung'],
            ['`project`', 'Chọn / đổi tên cột'],
            ['`extend`', 'Thêm cột tính toán'],
            ['`order by x desc`', 'Sắp xếp theo cột x giảm dần'],
            ['`distinct`, `render`', 'Lấy giá trị khác nhau / vẽ biểu đồ — hiếm khi là đáp án tính toán'],
          ],
        },
        {
          type: 'code',
          text: 'AppRequests\n| where TimeGenerated > ago(24h)\n| where Success == false\n| join kind=inner (AppDependencies) on OperationId\n| summarize avg(DurationMs1) by OperationName',
          caption: 'Thứ tự tối ưu: chọn bảng → lọc thời gian → lọc lỗi → join → summarize',
        },
        {
          type: 'example',
          scenario: '`requests | summarize request_count = count() by resultCode | order by request_count desc`',
          right: 'Ra **một hàng cho mỗi `resultCode`** kèm số request, sắp **từ nhiều đến ít**.',
          wrong: ['"Hiện từng request kèm result code" — summarize đã gộp lại.', '"Result code sắp theo alphabet" — đang sắp theo `request_count`.'],
          why: 'summarize gom nhóm; order by sắp theo cột được chỉ định.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Workbook vs query',
          text: '**Workbook** là báo cáo trực quan dùng lại nhiều lần; **Activity log** chỉ ghi thao tác trên tài nguyên Azure. Phân tích **ad-hoc một lần** → **KQL query**.',
        },
      ],
    },
  ],
}
