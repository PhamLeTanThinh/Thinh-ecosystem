import type { TheoryDomain } from '../../ccaf-theory/types'

export const DOMAIN_2: TheoryDomain = {
  id: 'connect-services',
  number: 2,
  title: 'Kết nối và sử dụng dịch vụ Azure',
  category: 'Connect To And Consume Azure Services',
  summary: 'Azure Functions (trigger, binding, concurrency), Service Bus, Event Grid, Cosmos DB SDK & change feed, Redis cache và App Configuration.',
  topics: [
    {
      id: 'functions-dev',
      title: 'Azure Functions: trigger, binding & công cụ',
      summary: 'Chọn trigger theo mô hình gọi, input vs output binding, authorization level, tách việc nặng qua queue, dynamic concurrency, func init và CI/CD.',
      questionIds: [25, 29, 68, 69, 75, 96, 97, 100, 107, 121],
      blocks: [
        {
          type: 'tldr',
          text: 'Mỗi function có **đúng 1 trigger** (cái gọi nó chạy) và có thể có nhiều **binding** (đọc = input, ghi = output). Chọn trigger theo **ai gọi và khi nào**: client cần trả lời ngay → HTTP; việc nền → Queue; theo lịch → Timer; file vừa upload → Event Grid; tài liệu Cosmos vừa đổi → Cosmos DB trigger.',
        },
        { type: 'h', text: '1. Chọn trigger' },
        {
          type: 'table',
          headers: ['Tình huống', 'Trigger'],
          rows: [
            ['API công khai, trả kết quả ngay, xác thực Entra ID', '**HTTP**'],
            ['Xử lý việc nền từ hàng đợi, có retry', '**Queue Storage** (hoặc Service Bus)'],
            ['Chạy theo lịch cố định', '**Timer**'],
            ['Blob vừa upload → xử lý ngay, không polling, độ trễ thấp', '**Event Grid**'],
            ['Tài liệu Cosmos DB tạo/sửa → sinh embedding', '**Azure Cosmos DB trigger** (dùng change feed)'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Idempotency không đến từ trigger',
          text: 'Chống xử lý trùng khi client retry phải làm **trong code** (idempotency key, kiểm tra đã xử lý chưa). Trigger chỉ quyết định **cách gọi**.',
        },

        { type: 'h', text: '2. Binding' },
        {
          type: 'list',
          items: [
            '**Input binding**: đọc dữ liệu sẵn có (vd. đọc file JSON cấu hình trong Blob Storage) mà không cần viết code SDK.',
            '**Output binding**: ghi kết quả ra đích (queue, blob, Cosmos DB…).',
            'HTTP trigger + input binding Blob = "khi có request, đọc file cấu hình".',
          ],
        },

        { type: 'h', text: '3. Tách việc nặng khỏi request HTTP' },
        {
          type: 'steps',
          items: ['HTTP function nhận upload, lưu file, đẩy message vào queue rồi **trả lời ngay**', '**Queue-triggered function** xử lý ảnh ở nền, scale độc lập', 'Hàng đợi có **retry** (visibility timeout, `maxDequeueCount`) cho lần xử lý lỗi'],
        },

        { type: 'h', text: '4. Đọc code HTTP trigger' },
        {
          type: 'list',
          items: [
            '`AuthorizationLevel.Function` → cần **function key** khi gọi; `Anonymous` → không cần; `Admin` → master key.',
            'Danh sách method (`"post"`) quyết định method nào được chấp nhận — chỉ có `post` thì **GET không được hỗ trợ**.',
            'Chỉ đọc body rồi trả `OkObjectResult(body)` là **không có validate**.',
          ],
        },

        { type: 'h', text: '5. Cấu hình & công cụ' },
        {
          type: 'table',
          headers: ['Việc', 'Cách làm'],
          rows: [
            ['Bật **dynamic concurrency**', 'Trong **`host.json`** (`concurrency.dynamicConcurrencyEnabled`) — runtime tự điều chỉnh riêng cho từng function có trigger hỗ trợ (vd. Queue)'],
            ['Tạo project mới (không template)', '**`func init --worker-runtime python|dotnet`**'],
            ['Thêm một function từ template', '`func new`'],
            ['Deploy hạ tầng Bicep + code lặp lại được, có kiểm soát phiên bản', '**GitHub Actions** (CI/CD)'],
          ],
        },
      ],
    },
    {
      id: 'service-bus',
      title: 'Azure Service Bus',
      summary: 'Queue vs topic/subscription, peek-lock, complete / abandon / defer / dead-letter, duplicate detection, session FIFO, SQL filter & action.',
      questionIds: [28, 32, 35, 37, 53, 73, 114, 115, 118, 130, 135, 136],
      blocks: [
        {
          type: 'tldr',
          text: '**Queue**: mỗi message tới **một** consumer. **Topic + subscription**: mỗi subscription nhận **bản sao riêng** (pub/sub). Ở chế độ **peek-lock**, message chỉ bị xoá khi bạn **complete**; lỗi thì chọn đúng hành động: abandon (thử lại), defer (để dành), dead-letter (cách ly).',
        },
        {
          type: 'terms',
          items: [
            { term: 'Peek-lock', meaning: 'Nhận message nhưng chỉ khoá tạm; phải settle rõ ràng. Mặc định của processor.' },
            { term: 'Delivery count', meaning: 'Số lần message đã được giao; vượt `MaxDeliveryCount` → tự vào DLQ.' },
            { term: 'Dead-letter queue (DLQ)', meaning: 'Hàng đợi con chứa message không xử lý được, để kiểm tra sau.' },
            { term: 'Session', meaning: 'Nhóm message theo `SessionId`, đảm bảo xử lý **FIFO** nghiêm ngặt.' },
          ],
        },

        { type: 'h', text: '1. Settle message' },
        {
          type: 'table',
          headers: ['Hành động', 'Kết quả', 'Dùng khi'],
          rows: [
            ['**Complete**', 'Xoá khỏi queue', 'Xử lý thành công'],
            ['**Abandon**', 'Nhả khoá, giao lại (tăng delivery count)', 'Lỗi tạm thời, để consumer khác thử lại'],
            ['**Defer**', 'Để riêng trong queue, lấy lại bằng sequence number', 'Chưa xử lý được lúc này (API ngoài đang sập) mà **không muốn tăng delivery count**'],
            ['**Dead-letter**', 'Chuyển vào DLQ ngay', 'Payload hỏng / JSON sai — thử lại cũng vô ích, **không được chặn** message tốt'],
          ],
        },

        { type: 'h', text: '2. Chọn thực thể' },
        {
          type: 'table',
          headers: ['Yêu cầu', 'Thực thể / tính năng'],
          rows: [
            ['Một message → nhiều consumer độc lập, mỗi bên một bản', '**Topic + subscription**'],
            ['Xử lý theo thứ tự FIFO', '**Queue** (FIFO nghiêm ngặt: bật **session**)'],
            ['Cách ly message lỗi', '**Dead-letter queue**'],
            ['Không xử lý trùng message gửi lại', '**Duplicate detection** (theo `MessageId` trong một khoảng thời gian)'],
            ['Service Bus phát sự kiện sang Event Grid', 'Tier **Premium** + quyền **Contributor** trên namespace (bộ lựa chọn không có Contributor → role **Data Receiver** cho Function nhận message)'],
          ],
        },

        { type: 'h', text: '3. Filter & action của subscription' },
        {
          type: 'list',
          items: [
            '**SQL filter**: lọc theo **system properties** và application properties bằng biểu thức SQL; chỉ SQL filter mới đi kèm **action**.',
            '**Correlation filter**: so khớp nhanh các thuộc tính cố định (CorrelationId, Label…), không có action.',
            '**Boolean filter** (`TrueFilter`/`FalseFilter`): nhận tất cả / không nhận gì.',
            'Action chạy trên **bản sao** của message được lọc — sửa metadata của bản sao, message gốc giữ nguyên.',
          ],
        },

        { type: 'h', text: '4. Dựng processor (SDK)' },
        {
          type: 'steps',
          items: ['Tạo **ServiceBusClient**', 'Tạo **ServiceBusProcessor** cho queue', 'Đăng ký **message handler + error handler**', '**Start** processor'],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Client đã tạo mà không nhận message',
          text: 'Thiếu bước **đăng ký handler**. SDK cũ (`Microsoft.Azure.ServiceBus`): `subscriptionClient.RegisterMessageHandler(...)` vừa gắn callback vừa bật message pump. `AddRuleAsync` chỉ quyết định message nào vào subscription, `CloseAsync` thì dừng xử lý.',
        },

        { type: 'h', text: '5. Request/reply & audit trail' },
        {
          type: 'table',
          headers: ['Thuộc tính của reply', 'Gán bằng', 'Để làm gì'],
          rows: [
            ['`ReplyToSessionId`', '`SessionId` của message gốc', 'Reply quay về đúng session gốc'],
            ['`CorrelationId`', '`MessageId` của message gốc', 'Nối reply với message gốc (audit trail)'],
          ],
        },
        { type: 'p', text: '`SequenceNumber` và `DeliveryCount` do broker tự gán khi giao message — không gán tay và không dùng để dựng audit trail.' },
      ],
    },
    {
      id: 'event-grid',
      title: 'Azure Event Grid',
      summary: 'Subject filter, event type filter, advanced filter trên payload; retry policy, dead-letter; custom topic & đăng ký provider.',
      questionIds: [24, 30, 33, 34, 108, 123, 124, 133, 134],
      blocks: [
        {
          type: 'tldr',
          text: 'Event Grid **đẩy** sự kiện tới subscriber (push, không polling). Lọc bằng **event type**, **subject** (bắt đầu/kết thúc bằng…) hoặc **advanced filter** (so sánh giá trị trong `data`). Sự kiện giao không được → **dead-letter destination** (một blob container).',
        },
        { type: 'h', text: '1. Chọn filter' },
        {
          type: 'table',
          headers: ['Điều kiện', 'Filter'],
          rows: [
            ['Chỉ một số loại sự kiện (`Microsoft.Storage.BlobCreated`)', '**Event type filter**'],
            ['Đường dẫn bắt đầu bằng `/uploads/ai/` / kết thúc bằng `.pdf`', '**Subject filter** (begins with / ends with)'],
            ['`data.fileType == "pdf"`, `data.confidenceScore > 0.80`, điều kiện Boolean theo `season`', '**Advanced filter** (StringIn, NumberGreaterThan, BoolEquals…)'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Thấy "payload" / "data field" / số → advanced',
          text: 'Subject và event type chỉ là so khớp chuỗi tĩnh. Hễ điều kiện nằm **trong dữ liệu sự kiện** hoặc cần **so sánh số / linh hoạt** → **advanced filter**.',
        },

        { type: 'h', text: '2. Độ tin cậy khi giao sự kiện' },
        {
          type: 'table',
          headers: ['Cài đặt', 'Tác dụng'],
          rows: [
            ['**Retry policy**: max delivery attempts (1–30), event TTL', 'Giới hạn số lần / thời gian thử lại'],
            ['**Dead-letter destination**', 'Giữ lại sự kiện không giao được để điều tra & xử lý lại'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'HTTP 400 không được retry',
          text: 'Với lỗi như **400 Bad Request** hay **413**, Event Grid **không thử lại** — chỉ có **dead-letter** mới giữ được sự kiện. Cấu hình retry policy không cứu được trường hợp này.',
        },

        { type: 'h', text: '3. Dựng luồng sự kiện tùy chỉnh' },
        {
          type: 'steps',
          items: ['**Đăng ký resource provider** `Microsoft.EventGrid` (subscription mới)', 'Tạo **custom topic** (sự kiện do app tự định nghĩa)', 'Tạo **event subscription** (filter + endpoint)'],
        },
        {
          type: 'list',
          items: [
            '**Domain**: quản lý hàng nghìn topic cho nhiều tenant — không cần cho một luồng đơn.',
            '**Partner topic**: sự kiện từ đối tác SaaS bên ngoài.',
            '**Giao event tới webhook**: Event Grid xác nhận endpoint bằng **validation handshake** — **ValidationCode** (đồng bộ, endpoint do bạn viết code) hoặc **ValidationURL** (thủ công, cho dịch vụ không tự trả mã được).',
            '**Publish lên topic**: client xác thực bằng **access key** hoặc **SAS token** — SAS token có hạn dùng, tự hết hiệu lực; access key dùng vô thời hạn tới khi tạo lại. Cần "hết hiệu lực sau một khoảng thời gian" → SAS token.',
          ],
        },

        { type: 'h', text: '4. System topic, custom topic hay domain?' },
        {
          type: 'table',
          headers: ['Loại', 'Ai publish', 'Dùng khi'],
          rows: [
            ['**System topic**', 'Chính dịch vụ Azure (Storage, Event Hubs…)', 'Phản ứng với event của tài nguyên Azure — app **không** tự publish vào được'],
            ['**Custom topic**', 'Ứng dụng của bạn', 'Một luồng event tuỳ chỉnh; tối đa **500 event subscription** mỗi topic'],
            ['**Domain**', 'Ứng dụng của bạn, qua **một endpoint**', 'Hàng nghìn topic riêng cho từng khách hàng/tenant, phân quyền bằng Microsoft Entra ID'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: '"Thousands of customers" + "single endpoint"',
          text: '→ **Event Grid domain**. System topic sai vì app không publish được; custom topic + mỗi khách một subscription sai vì vượt giới hạn 500 subscription.',
        },
      ],
    },
    {
      id: 'cosmos-sdk',
      title: 'Cosmos DB for NoSQL: SDK, index, change feed',
      summary: 'CosmosClient → Database → Container, shared throughput, composite index cho ORDER BY, pre-trigger, DateTimeBin, change feed processor & lease container, role Cosmos DB Operator.',
      questionIds: [11, 18, 22, 60, 77, 91, 102, 113, 128],
      blocks: [
        {
          type: 'tldr',
          text: 'SDK đi theo tầng: **CosmosClient** (tài khoản) → **Database** (có thể giữ throughput dùng chung) → **Container** (CRUD, query). Muốn phản ứng khi tài liệu đổi → **change feed processor**, trạng thái & việc chia partition giữa các instance nằm trong **lease container**.',
        },
        { type: 'h', text: '1. Tầng SDK' },
        {
          type: 'table',
          headers: ['Việc', 'Đối tượng'],
          rows: [
            ['Khởi tạo kết nối bằng endpoint + key/credential', '**CosmosClient**'],
            ['Throughput dùng chung cho nhiều container', '**Database**'],
            ['CRUD item, chạy query (`query_items`)', '**Container**'],
          ],
        },
        { type: 'steps', items: ['Tạo **CosmosClient**', 'Lấy database theo **tên**', 'Lấy **container reference**', '**Chạy query**'] },

        { type: 'h', text: '2. Change feed processor' },
        {
          type: 'table',
          headers: ['Thành phần', 'Vai trò'],
          rows: [
            ['**Monitored container**', 'Nguồn — nơi đọc thay đổi'],
            ['**Lease container**', 'Lưu continuation token + **chia quyền sở hữu partition** giữa các instance → cân bằng tải, scale out'],
            ['**Latest version mode**', 'Chế độ mặc định: phiên bản mới nhất của item được tạo/sửa'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Nhiều instance processor → lease container',
          text: 'Các instance dùng **chung một lease container** thì tự chia partition và tự cân bằng lại khi thêm/bớt instance. Quét toàn container định kỳ hay SELECT cross-partition là đáp án tốn RU.',
        },

        { type: 'h', text: '3. Index & truy vấn' },
        {
          type: 'list',
          items: [
            'Mặc định **mọi thuộc tính đều được index** → ghi tốn RU. Chỉ query theo vài trường → **loại các path không dùng** khỏi indexing policy.',
            '`ORDER BY` nhiều thuộc tính (vd. `name ASC, city DESC`) cần **composite index** liệt kê đúng thứ tự & chiều sắp xếp.',
            '`DateTimeBin(c.whenFinished, \'day\', 2)` gom timestamp vào **ô 2 ngày**; `COUNT` để đếm; biểu thức GROUP BY phải trùng biểu thức SELECT.',
          ],
        },

        { type: 'h', text: '4. Server-side pre-trigger' },
        { type: 'code', text: "var r = getContext().getRequest();\nvar i = r.getBody();\nif (!(\"tip\" in i)) { i[\"tip\"] = 0; }\nr.setBody(i);", caption: 'Gán giá trị mặc định cho client cũ chưa gửi `tip`' },

        { type: 'h', text: '5. Phân quyền' },
        {
          type: 'table',
          headers: ['Role', 'Quản lý tài khoản / DB / container', 'Đọc được key'],
          rows: [
            ['**Cosmos DB Operator**', 'Có', '**Không**'],
            ['DocumentDB Account Contributor', 'Có', 'Có'],
            ['Cosmos DB Account Reader', 'Chỉ đọc', 'Chỉ read-only key'],
          ],
        },
      ],
    },
    {
      id: 'redis-cache',
      title: 'Azure Redis: cache-aside, TTL, invalidation, eviction',
      summary: 'Absolute vs sliding expiration, xoá key khi nguồn đổi, publish sự kiện invalidation, allkeys-lru giữ key hay dùng.',
      questionIds: [10, 15, 16, 20, 72, 110],
      blocks: [
        {
          type: 'tldr',
          text: '**Cache-aside**: đọc cache trước, miss thì đọc nguồn rồi ghi vào cache. Muốn dữ liệu **hết hạn đúng giờ** → **TTL tuyệt đối**. Muốn **không bao giờ trả dữ liệu cũ** khi nguồn đổi → **xoá/invalidate key ngay lúc nguồn đổi**. Hết bộ nhớ mà muốn giữ key hay dùng → **allkeys-lru**.',
        },
        {
          type: 'table',
          headers: ['Yêu cầu', 'Kỹ thuật'],
          rows: [
            ['Xoá sau đúng 5 phút / 24 giờ, **bất kể được đọc bao nhiêu lần**', '**Absolute expiration** (TTL đặt lúc ghi)'],
            ['Giữ lâu hơn nếu còn được truy cập', 'Sliding expiration (reset TTL mỗi lần đọc) — **sai** khi đề đòi "đúng hạn"'],
            ['Dữ liệu nguồn đổi thì không được trả bản cũ', '**Xoá key liên quan khi nguồn đổi** / publish sự kiện invalidation'],
            ['Giảm độ trễ cho request lặp lại', '**Cache-aside + lazy loading**'],
            ['Chỉ giữ embedding hay dùng trong RAM', '**`allkeys-lru`** eviction'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Eviction ≠ độ tươi dữ liệu',
          text: 'LRU chỉ đuổi key khi **thiếu bộ nhớ** — không đảm bảo dữ liệu mới. Tăng bộ nhớ hay đổi eviction policy **không** giải quyết yêu cầu "không trả dữ liệu cũ".',
        },
        {
          type: 'terms',
          items: [
            { term: '`allkeys-lru`', meaning: 'Xét mọi key, đuổi key lâu không dùng nhất.' },
            { term: '`volatile-lru`', meaning: 'Chỉ xét key có TTL.' },
            { term: '`volatile-ttl`', meaning: 'Đuổi key có TTL sắp hết nhất.' },
            { term: '`EXPIRE key 600`', meaning: 'Đặt TTL **tính bằng giây** (600 s = 10 phút).' },
            { term: '`PERSIST`', meaning: 'Gỡ TTL — key sống mãi.' },
          ],
        },
      ],
    },
    {
      id: 'app-configuration',
      title: 'Azure App Configuration',
      summary: 'Key-value, label theo môi trường, feature flag, Key Vault reference, refresh động có cache, DefaultAzureCredential.',
      questionIds: [43, 44, 58, 79, 93, 137],
      blocks: [
        {
          type: 'tldr',
          text: 'App Configuration giữ **cấu hình tập trung**: cùng một key, khác **label** cho test/staging/prod; **feature flag** cho rollout theo %; **Key Vault reference** cho secret (secret vẫn nằm ở Key Vault). App **cache** giá trị và **refresh theo chu kỳ** — không gọi dịch vụ mỗi request.',
        },
        {
          type: 'table',
          headers: ['Nhu cầu', 'Tính năng'],
          rows: [
            ['Giá trị khác nhau cho từng môi trường, cùng key', '**Label**'],
            ['Rollout theo %, theo nhóm người dùng', '**Feature flag**'],
            ['Giới hạn token, danh sách region…', '**Key-value** thường'],
            ['API key lấy an toàn lúc chạy', '**Key Vault reference**'],
            ['Đổi nhiều setting mà app phải nạp lại **nhất quán** cùng lúc', '**Sentinel key** register với `refreshAll: true`'],
            ['Giảm số request tới App Configuration', '**Tăng** cache expiration (refresh interval)'],
            ['Cập nhật cấu hình không restart, request vẫn nhanh', '**Cache + refresh interval**'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Bộ ba "cấu hình động an toàn"',
          text: '(1) Refresh theo **polling interval**, (2) **secret sang Key Vault**, (3) **managed identity** cho cả App Configuration lẫn Key Vault. Service principal secret hay biến môi trường là đáp án sai.',
        },
        { type: 'code', text: 'from azure.identity import DefaultAzureCredential\nfrom azure.appconfiguration import AzureAppConfigurationClient\n\nclient = AzureAppConfigurationClient(endpoint, DefaultAzureCredential())\nsetting = client.get_configuration_setting(key="FeatureX", label="production")', caption: 'DefaultAzureCredential: managed identity trên Azure, tài khoản dev khi chạy local — không phải sửa code' },
      ],
    },
  ],
}
