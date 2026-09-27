import type { TheoryDomain } from '../../ccaf-theory/types'

export const DOMAIN_1: TheoryDomain = {
  id: 'containers',
  number: 1,
  title: 'Phát triển giải pháp container trên Azure',
  category: 'Develop Containerized Solutions On Azure',
  summary: 'Build & lưu image ở ACR, chạy trên Azure Container Apps (revision, ingress, KEDA scale), AKS (manifest, rolling update, troubleshoot) và App Service / Functions.',
  topics: [
    {
      id: 'acr-images',
      title: 'Azure Container Registry & image',
      summary: 'Tag vs digest, Dockerfile đúng thứ tự, ACR Tasks tự build theo commit / base image / lịch, đăng nhập bằng Entra ID thay vì admin user.',
      questionIds: [1, 4, 26, 56, 76, 112, 117, 127],
      blocks: [
        {
          type: 'tldr',
          text: 'ACR là kho image riêng của bạn trên Azure. **Tag** (`latest`, `production`) có thể bị trỏ sang bản build khác, còn **digest** (`sha256:…`) thì **không bao giờ đổi** — cần "chạy đúng bản build đó" thì deploy theo digest. Muốn registry **tự build** thì dùng **ACR Tasks** với trigger commit / base image / timer.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Tag', meaning: 'Nhãn dễ đọc gắn vào image (`v1.2`, `latest`) — có thể bị gán lại cho image khác.' },
            { term: 'Digest', meaning: 'Mã SHA-256 của manifest image — định danh bất biến cho đúng một bản build.' },
            { term: 'ACR Task', meaning: 'Build/push image ngay trong ACR, không cần máy build riêng.' },
            { term: 'Quick task', meaning: '`az acr build` — build một lần, chạy thủ công.' },
            { term: 'Base image', meaning: 'Image nền trong dòng `FROM` (vd. OS, runtime .NET) — được vá lỗi định kỳ.' },
          ],
        },

        { type: 'h', text: '1. Tag hay digest?' },
        {
          type: 'table',
          headers: ['Cách chỉ định', 'Bất biến?', 'Khi nào dùng'],
          rows: [
            ['`myacr.azurecr.io/api:latest`', 'Không', 'Dev/test, luôn lấy bản mới nhất'],
            ['`myacr.azurecr.io/api:1.4.2` (tag duy nhất)', 'Gần như — nếu không ai gán lại', 'Đánh phiên bản khi build & push'],
            ['`myacr.azurecr.io/api@sha256:…`', '**Có**', 'Production cần "đúng bản build đó" dù tag bị đổi'],
          ],
        },
        {
          type: 'example',
          scenario: 'Production phải luôn chạy **đúng một bản build**, kể cả khi tag bị chuyển sang bản khác sau này.',
          right: 'Deploy theo **SHA digest** của image.',
          wrong: ['Tag `production` hay `latest` — tag có thể bị gán lại.', 'Build lại mỗi đêm — càng làm image thay đổi.'],
          why: 'Digest là mã băm nội dung, chỉ khớp đúng một manifest.',
        },

        { type: 'h', text: '2. Dockerfile: lệnh nào chạy lúc nào' },
        {
          type: 'table',
          headers: ['Lệnh', 'Chạy khi', 'Dùng để'],
          rows: [
            ['`FROM`', 'Build', 'Chọn base image — luôn là dòng đầu'],
            ['`WORKDIR`', 'Build', 'Đặt thư mục làm việc cho các lệnh sau'],
            ['`COPY ./ .`', 'Build', 'Chép file từ build context vào image'],
            ['`RUN`', '**Build**', 'Chạy script cài đặt (vd. `RUN powershell ./setupScript.ps1`)'],
            ['`CMD` / `ENTRYPOINT`', '**Khi container khởi động**', 'Lệnh mặc định (vd. `CMD ["dotnet", "App.dll"]`)'],
            ['`ENV`', 'Build (nằm trong image)', 'Biến không nhạy cảm — **đừng** để secret ở đây'],
          ],
        },
        { type: 'code', text: 'FROM mcr.microsoft.com/dotnet/aspnet:8.0\nWORKDIR /apps/ContosoApp\nCOPY ./ .\nRUN powershell ./setupScript.ps1\nCMD ["dotnet", "ContosoApp.dll"]', caption: 'Thứ tự chuẩn: FROM → WORKDIR → COPY → RUN → CMD' },

        { type: 'h', text: '3. ACR Tasks — để registry tự build' },
        {
          type: 'table',
          headers: ['Trigger', 'Phản ứng với'],
          rows: [
            ['**Source code commit**', 'Developer push/commit lên Git (ACR tạo **webhook** trong repo để nhận sự kiện)'],
            ['**Base image update**', 'Image nền (OS, runtime) được vá — tự build lại image phụ thuộc'],
            ['**Timer (schedule)**', 'Build lại định kỳ theo cron'],
          ],
        },
        {
          type: 'list',
          items: [
            '**Quick task** (`az acr build`) chỉ chạy thủ công — không tự động.',
            '**Artifact Cache** chỉ cache image upstream, **không build** source.',
            'Yêu cầu "hạn chế phụ thuộc hạ tầng build bên ngoài" → chọn **ACR Task**, không chọn GitHub Actions / Azure DevOps pipeline.',
          ],
        },
        {
          type: 'example',
          scenario: 'Image phải được build lại khi code đổi, khi OS nền được cập nhật, và theo lịch định kỳ.',
          right: '3 trigger: **source code commit**, **base image update**, **timer**.',
          wrong: ['Registry event trigger / webhook notification trigger — không phải loại trigger của ACR Task.'],
          why: 'Đây đúng là 3 loại trigger mà ACR Tasks hỗ trợ.',
        },

        { type: 'h', text: '4. Đẩy & kéo image an toàn' },
        {
          type: 'steps',
          items: ['Build image, gắn **tag duy nhất** (vd. số build / commit SHA)', 'Đăng nhập ACR bằng **Microsoft Entra ID** (`az acr login`)', '`docker push` lên login server của ACR'],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Kéo image từ App Service / ACA / AKS',
          text: 'Luôn chọn **managed identity + role assignment** (AcrPull, hoặc **Container Registry Repository Reader** với registry bật ABAC). Bật **admin user**, để mật khẩu registry trong app settings hay trong Dockerfile đều là đáp án sai.',
        },
      ],
    },
    {
      id: 'aca-apps',
      title: 'Azure Container Apps: revision, ingress, domain, giám sát',
      summary: 'Single vs multiple revision mode, traffic splitting, revision label, session affinity, gắn custom domain đúng thứ tự, log streaming & console.',
      questionIds: [5, 54, 74, 81, 109, 122, 131, 138],
      blocks: [
        {
          type: 'tldr',
          text: 'Mỗi lần đổi template (image, env…) ACA tạo một **revision** mới. **Single revision mode**: chỉ bản mới chạy. **Multiple revision mode**: nhiều bản chạy song song, chia **% traffic** giữa chúng và gắn **label** để có URL riêng cho từng bản — nền tảng của canary / blue-green / rollback nhanh.',
        },
        {
          type: 'terms',
          items: [
            { term: 'Revision', meaning: 'Ảnh chụp bất biến của một phiên bản container app.' },
            { term: 'Revision mode', meaning: 'Single (một revision active) hoặc Multiple (nhiều revision active cùng lúc).' },
            { term: 'Traffic splitting', meaning: 'Chia trọng số % request cho các revision đang active.' },
            { term: 'Revision label', meaning: 'Nhãn tạo URL riêng, cố định trỏ tới một revision.' },
            { term: 'Ingress', meaning: 'Cổng vào HTTP/TCP của app (external hoặc chỉ nội bộ environment).' },
          ],
        },

        { type: 'h', text: '1. Chọn tính năng theo yêu cầu' },
        {
          type: 'table',
          headers: ['Yêu cầu trong đề', 'Cấu hình'],
          rows: [
            ['Chạy bản mới song song để test, không ảnh hưởng production', '**Multiple revision mode**'],
            ['Đưa 20% traffic sang bản mới / chuyển dần traffic', '**Traffic splitting** (cần multiple mode)'],
            ['Một URL cố định cho tester dùng thử bản mới', '**Revision label**'],
            ['Rollback nhanh', 'Multiple mode (bản cũ vẫn active) + đổi trọng số traffic về bản cũ'],
            ['Chỉ bản hiện tại chạy, bản cũ tự tắt', '**Single revision mode**'],
            ['Session affinity (sticky session)', '**HTTP ingress + single revision mode**'],
          ],
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Bẫy session affinity',
          text: 'Session affinity dùng **cookie HTTP** nên cần **HTTP ingress** (không phải TCP) và chỉ hỗ trợ **single revision mode**. Thấy "session affinity" → HTTP + single.',
        },

        { type: 'h', text: '2. Gắn custom domain (HTTPS)' },
        {
          type: 'steps',
          items: ['**Bật ingress** cho app', '**Thêm custom domain** trong ACA (lấy giá trị bản ghi cần tạo)', '**Thêm bản ghi DNS** (A/CNAME + TXT `asuid`) ở nhà cung cấp domain', '**Validate** domain', '**Bind certificate** để bật HTTPS'],
        },

        { type: 'h', text: '3. Giám sát & debug' },
        {
          type: 'table',
          headers: ['Nhu cầu', 'Tính năng'],
          rows: [
            ['Xem log console của container gần như real-time', '**Log streaming**'],
            ['Vào shell bên trong container để debug', '**Container console** (`az containerapp exec`)'],
            ['Truy vấn log lịch sử, tương quan nhiều app', '**Log Analytics** (KQL)'],
            ['Biểu đồ CPU/memory/request', '**Azure Monitor metrics**'],
          ],
        },

        { type: 'h', text: '4. Environment & workload profiles' },
        {
          type: 'p',
          text: '**Container Apps environment** là ranh giới dùng chung của nhiều app: cùng **virtual network**, cùng cấu hình **Dapr** và cùng nơi lưu **log**. Muốn cấu hình CPU/memory cho container theo profile (kể cả dedicated) thì bật **workload profiles** khi tạo environment.',
        },
        { type: 'code', text: 'az containerapp env create -n MyEnv -g MyResourceGroup --location eastus2 --enable-workload-profiles', caption: 'Chung VNet + Dapr + logging → environment; tuỳ chỉnh tài nguyên → workload profiles' },
        {
          type: 'list',
          items: [
            '`--internal-only`: environment không có endpoint public — không liên quan cấu hình tài nguyên.',
            '`--enable-mtls`: mã hoá traffic giữa các app trong environment.',
          ],
        },

        { type: 'h', text: '5. Health probe' },
        {
          type: 'table',
          headers: ['Probe', 'Trả lời câu hỏi', 'Khi fail'],
          rows: [
            ['**Readiness**', 'Replica đã sẵn sàng nhận request chưa?', 'Tạm không nhận traffic'],
            ['**Liveness**', 'Container còn "sống" không?', 'Restart container'],
            ['**Startup**', 'App khởi động chậm đã khởi động xong chưa?', 'Chặn liveness/readiness cho tới khi xong'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: '"Replica ready to process incoming requests"',
          text: '→ **readiness probe**. App nhận web request → chọn **HTTP** readiness probe (TCP chỉ biết port đã mở, không biết app đã phục vụ được chưa).',
        },
      ],
    },
    {
      id: 'aca-scaling',
      title: 'Scale Container Apps bằng KEDA',
      summary: 'Scale rule theo queue (Service Bus, Storage Queue), metadata bắt buộc, min replicas = 0 để về 0, max replicas chặn bùng nổ.',
      questionIds: [3, 23, 41, 106],
      blocks: [
        {
          type: 'tldr',
          text: 'ACA scale theo **sự kiện** nhờ **KEDA**: đặt một **scale rule** trỏ vào nguồn (Service Bus, Storage Queue, HTTP…). **min replicas = 0** → không có message thì **không tốn compute**; **max replicas** chặn scale quá tay.',
        },
        {
          type: 'terms',
          items: [
            { term: 'KEDA', meaning: 'Kubernetes Event-driven Autoscaler — scale theo độ dài queue, số event… chứ không chỉ CPU.' },
            { term: 'Scaler / type', meaning: 'Loại nguồn: `azure-servicebus`, `azure-queue`, `http`…' },
            { term: 'Metadata', meaning: 'Tham số riêng của scaler: `queueName`, `messageCount`, `queueLength`…' },
            { term: 'min / max replicas', meaning: 'Số bản sao tối thiểu / tối đa của app.' },
          ],
        },
        {
          type: 'table',
          headers: ['Nguồn', 'Scaler type', 'Metadata chính'],
          rows: [
            ['Azure Service Bus queue/topic', '`azure-servicebus`', '`queueName` (hoặc topic + subscription), **`messageCount`**'],
            ['Azure Storage queue', '`azure-queue`', '**`queueName`**, `queueLength`, `accountName`'],
            ['HTTP', '`http`', '`concurrentRequests`'],
          ],
        },
        {
          type: 'table',
          headers: ['Yêu cầu', 'Giá trị'],
          rows: [
            ['Không tốn compute khi queue rỗng / giải phóng instance', '**min replicas = 0** (cho phép tắt hết replica)'],
            ['Luôn có 1 instance, tránh cold start', '**min replicas = 1**'],
            ['Chặn scale bùng nổ', '**max replicas = N** cụ thể (vd. 10)'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Giá trị bắt buộc của scale rule tùy chỉnh',
          text: 'Chỉ cần **loại trigger (scaler type)** + **metadata của scaler** (vd. `queueName`). `pollingInterval`, `maxReplicas` là cài đặt scale **chung** của app, không phải phần bắt buộc của rule.',
        },
        {
          type: 'example',
          scenario: 'Worker đọc Service Bus queue, phải **không tốn compute** khi queue rỗng.',
          right: 'Scale rule KEDA theo độ dài queue **+** cho phép scale về 0 replica.',
          wrong: ['Tăng max replicas — không giúp về 0.', 'HTTP concurrency scaling — worker không nhận HTTP.'],
          why: 'KEDA bật replica khi có message và tắt hết khi hết message.',
        },
      ],
    },
    {
      id: 'aks-deploy',
      title: 'AKS: triển khai, scale & xử lý sự cố',
      summary: 'Manifest YAML, rolling update không gián đoạn, HPA & ClusterIP, xem pod events / logs / service endpoints trước khi restart.',
      questionIds: [2, 27, 39, 67, 82, 111],
      blocks: [
        {
          type: 'tldr',
          text: 'AKS chạy workload theo **manifest YAML** khai báo (`kubectl apply -f`). Cập nhật không gián đoạn = **sửa image tag trong manifest → apply → theo dõi rollout**. Khi lỗi: **điều tra trước** (events, logs, endpoints), đừng restart/scale mù.',
        },
        { type: 'h', text: '1. Chọn tài nguyên Kubernetes' },
        {
          type: 'table',
          headers: ['Yêu cầu', 'Tài nguyên'],
          rows: [
            ['Chạy & cập nhật pod web lâu dài', '**Deployment**'],
            ['Chạy tác vụ batch đến khi xong (vd. tính embedding hàng loạt)', '**Job** (khai báo trong YAML)'],
            ['Thêm pod khi CPU cao', '**HorizontalPodAutoscaler**'],
            ['Tăng CPU/RAM cho từng pod', 'VerticalPodAutoscaler'],
            ['Chỉ truy cập nội bộ trong cluster', '**ClusterIP service**'],
            ['Định tuyến HTTP từ bên ngoài', 'Ingress / LoadBalancer'],
          ],
        },

        { type: 'h', text: '2. Rolling update bằng manifest' },
        {
          type: 'steps',
          items: ['**Sửa image tag** trong deployment manifest', '**`kubectl apply -f`** manifest đã sửa', '**`kubectl rollout status`** để xác nhận'],
          loop: 'Có lỗi → `kubectl rollout undo` để quay lại revision trước.',
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Đáp án gây gián đoạn',
          text: '**Xoá deployment rồi tạo lại** hoặc **scale về 0 trước khi cập nhật** đều làm mất traffic — không phải rolling update.',
        },

        { type: 'h', text: '3. Xử lý sự cố: nhìn vào đâu' },
        {
          type: 'table',
          headers: ['Triệu chứng', 'Xem trước tiên'],
          rows: [
            ['Pod restart liên tục, event báo probe fail, CPU/RAM node bình thường', '**Pod events + container logs** (`kubectl describe pod`, `kubectl logs --previous`)'],
            ['Readiness probe fail', '**Pod description** (`kubectl describe pod`)'],
            ['Pod Ready nhưng service gọi nhau bị timeout', '**Service & Endpoints** (selector, port mapping)'],
            ['Service không liên lạc được service khác', '**Service endpoints**'],
          ],
        },
        {
          type: 'example',
          scenario: 'Mọi pod đều Ready, nhưng request giữa hai service trong cluster bị timeout.',
          right: 'Kiểm tra **Service và Endpoints**: selector có chọn đúng pod không, port của Service có trỏ đúng port container không.',
          wrong: ['Restart deployment / tăng replica — không sửa được selector hay port sai.', 'Test DNS từ máy của bạn — không phản ánh DNS trong cluster.'],
          why: 'Pod Ready chỉ nói pod khỏe, không nói Service định tuyến đúng tới pod.',
        },
      ],
    },
    {
      id: 'app-service-functions-hosting',
      title: 'App Service cho container & hosting plan của Functions',
      summary: 'App settings thành biến môi trường, xem log container bằng az webapp log, Consumption vs Premium vs Dedicated và giới hạn 230 giây của HTTP trigger.',
      questionIds: [36, 55, 57, 63, 129],
      blocks: [
        {
          type: 'tldr',
          text: 'App Service đưa **app settings** vào container dưới dạng **biến môi trường**; giá trị nhạy cảm thì dùng **Key Vault reference**. Với Functions: cần **custom Linux container + scale theo sự kiện + không cold start + VNet** → **Premium plan**. HTTP trigger luôn phải trả lời trong **230 giây** bất kể timeout cấu hình.',
        },
        { type: 'h', text: '1. Cấu hình container trên App Service' },
        {
          type: 'table',
          headers: ['Giá trị', 'Đặt ở đâu'],
          rows: [
            ['Cấu hình thường (vd. `MODEL_VERSION`)', '**App setting** giá trị thường'],
            ['Mật khẩu DB, API key', '**App setting dùng Key Vault reference**'],
            ['Bất kỳ secret nào', 'Không bao giờ để trong `ENV` của Dockerfile hay chuỗi kết nối nhúng mật khẩu'],
          ],
        },
        { type: 'code', text: 'az webapp log config --name myapp --resource-group rg --docker-container-logging filesystem\naz webapp log tail --name myapp --resource-group rg', caption: 'Xem log console (STDOUT/STDERR) của container real-time' },

        { type: 'h', text: '2. Hosting plan của Azure Functions' },
        {
          type: 'table',
          headers: ['', 'Consumption', 'Premium', 'Dedicated (App Service plan)'],
          rows: [
            ['Scale theo sự kiện', 'Có', '**Có**', 'Không (scale thủ công/autoscale)'],
            ['Custom Linux container', 'Không', '**Có**', 'Có'],
            ['Instance luôn ấm (không cold start)', 'Không', '**Có** (pre-warmed / always ready)', 'Có (Always On)'],
            ['VNet integration', 'Không', '**Có**', 'Có'],
            ['Timeout mặc định / tối đa', '5 / 10 phút', '30 phút / không giới hạn', '30 phút / không giới hạn'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: 'Con số 230 giây',
          text: 'Hàm **HTTP-triggered** phải phản hồi trong **230 giây** (idle timeout của Azure Load Balancer) — dù `functionTimeout` đặt dài hơn. Việc lâu hơn → chuyển sang xử lý bất đồng bộ qua queue.',
        },
        {
          type: 'example',
          scenario: 'App1: function app **Windows chạy code**, scale theo event, mỗi lần chạy < 10 phút. App2: function app **Linux chạy custom container**, scale theo event. Tối thiểu chi phí.',
          right: 'App1 → **Consumption**; App2 → **Premium**.',
          wrong: ['App2 → Dedicated — chạy được container nhưng không có event-driven scaling của Functions.', 'App2 → Consumption — không hỗ trợ custom container.'],
          why: 'Consumption rẻ nhất khi không cần container; trong các plan chạy được Linux container, chỉ Premium scale theo event.',
        },
      ],
    },
  ],
}
