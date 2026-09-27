import type { TheoryDomain } from '../../ccaf-theory/types'

export const DOMAIN_3: TheoryDomain = {
  id: 'ai-data',
  number: 3,
  title: 'Giải pháp AI với dịch vụ quản lý dữ liệu',
  category: 'Develop AI Solutions By Using Azure Data Management Services',
  summary: 'Lưu & tìm embedding: pgvector trên PostgreSQL, vector search trong Cosmos DB for NoSQL, vector index trong Redis; consistency và hiệu năng.',
  topics: [
    {
      id: 'pgvector',
      title: 'PostgreSQL + pgvector',
      summary: 'Cột vector, toán tử <=>, HNSW / IVFFlat, B-tree cho cột lọc, connection pooling PgBouncer, scale bộ nhớ và đo trước/sau.',
      questionIds: [6, 7, 8, 9, 12, 19, 61, 70, 71, 105, 125],
      blocks: [
        {
          type: 'tldr',
          text: 'Lưu embedding trong cột kiểu **`vector`** (không phải varchar/JSON). Tìm tương tự bằng `ORDER BY embedding <=> :q LIMIT k`. Nhanh thì cần **index ANN** (**HNSW** hoặc **IVFFlat**) trên cột embedding + **B-tree** trên cột hay lọc. Nhiều kết nối đồng thời → **connection pooling** (PgBouncer).',
        },
        {
          type: 'terms',
          items: [
            { term: '`<=>`', meaning: 'Khoảng cách cosine (nhỏ = giống). `<->` là L2, `<#>` là inner product âm.' },
            { term: 'HNSW', meaning: 'Index đồ thị nhiều tầng — truy vấn nhanh, recall tốt, tốn RAM hơn, tạo được cả khi bảng rỗng.' },
            { term: 'IVFFlat', meaning: 'Chia vector thành các `lists` rồi chỉ tìm trong vài cụm gần — nên tạo **sau** khi đã nạp dữ liệu.' },
            { term: 'B-tree', meaning: 'Index thường cho cột vô hướng (`department`, `created_at`) — **không** phải vector index.' },
            { term: 'PgBouncer', meaning: 'Bộ gộp kết nối có sẵn trong Azure Database for PostgreSQL flexible server.' },
          ],
        },

        { type: 'h', text: '1. Thiết kế bảng & truy vấn' },
        { type: 'steps', items: ['**Định nghĩa bảng**: cột `vector(n)` + cột metadata có kiểu rõ ràng (`timestamp` cho ngày)', '**Nạp** embedding + metadata', '**Tạo index HNSW** trên cột embedding (sau khi nạp để nạp nhanh hơn)', '**Truy vấn**: `WHERE` lọc metadata, `ORDER BY embedding <=> :q LIMIT k`'] },
        { type: 'code', text: "SELECT id, title\nFROM documents\nWHERE department = 'Finance'\nORDER BY embedding <=> :query_embedding\nLIMIT 5;", caption: 'Lọc đúng bằng = (không dùng ILIKE), xếp theo độ giống, lấy 5' },

        { type: 'h', text: '2. Chậm thì sửa gì' },
        {
          type: 'table',
          headers: ['Triệu chứng', 'Cách xử lý'],
          rows: [
            ['Vector search chậm, chưa có index', '**HNSW** hoặc **IVFFlat** trên cột embedding'],
            ['Truy vấn luôn lọc theo `department` trước rồi mới xếp, CPU cao', '**B-tree** trên cột metadata hay lọc'],
            ['P95 tăng giờ cao điểm, cache hit ratio giảm (index không vừa RAM)', 'Scale lên tier **nhiều RAM hơn mỗi vCore**'],
            ['Không đạt mục tiêu độ trễ do thiếu năng lực tính toán', '**Tăng vCore**'],
            ['Nạp embedding liên tục, sợ đầy ổ', '**Storage autoscale**'],
          ],
        },
        {
          type: 'steps',
          items: ['Đo **baseline** trước cao điểm (P95, `EXPLAIN ANALYZE`)', '**Scale** tier nhiều RAM hơn', 'Xem **memory pressure / cache hit ratio** giờ cao điểm so với baseline', '**Chạy lại cùng benchmark**, so P95/P99'],
          loop: 'Luôn đo trước — đổi — đo lại cùng một workload.',
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Đáp án bẫy hay gặp',
          text: 'Tăng số chiều embedding, lưu embedding dạng JSON/varchar, tăng `statement_timeout`, tắt autovacuum, tăng `shared_buffers` / `max_connections` — đều không giải quyết đúng vấn đề đề bài hỏi.',
        },

        { type: 'h', text: '3. Kết nối: pooling & an toàn' },
        {
          type: 'table',
          headers: ['Yêu cầu', 'Cấu hình'],
          rows: [
            ['Nhiều request đồng thời, hết `max_connections`', '**Connection pooling** — PgBouncer, chế độ **transaction pooling**'],
            ['Bảo vệ DB lúc traffic tăng vọt', 'Đặt **maximum pool size**'],
            ['Xác thực theo chính sách không mật khẩu', '**Managed identity** (token Entra ID)'],
            ['Input người dùng đưa vào SQL', '**Parameterized query**: ID truyền như tham số, đưa tuple tham số cho hàm execute'],
          ],
        },
        {
          type: 'terms',
          items: [
            { term: 'Session pooling', meaning: 'Giữ một kết nối server cho cả phiên client — ít tái sử dụng.' },
            { term: 'Transaction pooling', meaning: 'Trả kết nối về pool khi transaction xong — tái sử dụng tối đa cho workload nhiều request ngắn.' },
            { term: 'Statement pooling', meaning: 'Trả sau từng câu lệnh — phá vỡ transaction nhiều câu.' },
          ],
        },
      ],
    },
    {
      id: 'cosmos-vector',
      title: 'Vector search & consistency trong Cosmos DB',
      summary: 'Embedding là mảng số, vector index flat / quantizedFlat / diskANN, VectorDistance + TOP N, indexing policy, 5 mức consistency.',
      questionIds: [13, 17, 101, 103, 119, 120, 139],
      blocks: [
        {
          type: 'tldr',
          text: 'Trong Cosmos DB for NoSQL, embedding là **mảng số JSON**, khai báo trong **vector embedding policy** và được tăng tốc bằng **vector index**. Truy vấn: `SELECT TOP 5 … ORDER BY VectorDistance(c.embedding, @q)`. Tốn RU quá → đổi index sang **quantizedFlat / diskANN** hoặc giảm độ chính xác của index.',
        },
        { type: 'code', text: 'SELECT TOP 5 c.id, VectorDistance(c.embedding, @q) AS score\nFROM c\nORDER BY VectorDistance(c.embedding, @q)', caption: 'TOP N giới hạn số kết quả gần nhất' },
        {
          type: 'table',
          headers: ['Vector index', 'Đặc điểm'],
          rows: [
            ['`flat`', 'Tìm chính xác (brute-force), giới hạn số chiều nhỏ, tốn RU khi dữ liệu lớn'],
            ['`quantizedFlat`', 'Nén vector → ít RU & bộ nhớ hơn, đổi lại recall giảm nhẹ'],
            ['`diskANN`', 'ANN tối ưu cho quy mô lớn, RU thấp, độ trễ thấp'],
          ],
        },
        {
          type: 'list',
          items: [
            'Composite index **không** tăng tốc vector search — nó dành cho `ORDER BY`/filter nhiều trường vô hướng.',
            'Ghi tốn RU vì mọi thuộc tính đều được index → **exclude các path không truy vấn** (giữ `deviceId`, `timestamp`).',
          ],
        },

        { type: 'h', text: 'Consistency levels (mạnh → yếu)' },
        {
          type: 'table',
          headers: ['Mức', 'Đảm bảo', 'Ví dụ trong đề'],
          rows: [
            ['**Strong**', 'Luôn đọc bản commit mới nhất', 'Trạng thái bệnh nhân mới nhất'],
            ['**Bounded staleness**', 'Trễ tối đa K phiên bản hoặc T thời gian — **dự đoán được**', 'Dữ liệu theo dõi "không trễ quá 1 phiên bản"'],
            ['Session', 'Đọc được chính những gì mình vừa ghi (mặc định)', '—'],
            ['Consistent prefix', 'Không bao giờ thấy thứ tự ghi bị đảo', '—'],
            ['**Eventual**', 'Cuối cùng sẽ hội tụ; nhanh & rẻ nhất', 'Hoá đơn đã chốt, không còn thay đổi'],
          ],
        },
        {
          type: 'callout',
          tone: 'exam',
          title: '"Thấy ghi ở mọi region trong khoảng thời gian dự đoán được"',
          text: '→ **Strong** hoặc **Bounded staleness**. Session và Eventual không cho giới hạn thời gian. Có thể **nới** consistency cho từng request (yếu hơn mặc định của tài khoản) để giảm độ trễ.',
        },
        {
          type: 'callout',
          tone: 'warn',
          title: 'Override theo request chỉ áp cho ĐỌC',
          text: 'Mặc định của tài khoản là **Session**. Đặt consistent prefix cho request → **đọc** chạy ở consistent prefix, còn **ghi** luôn theo mức của tài khoản (vẫn là Session). Override chỉ được **nới yếu hơn**, không nâng lên mạnh hơn mặc định.',
        },
      ],
    },
    {
      id: 'redis-vector',
      title: 'Vector search trong Redis',
      summary: 'Trường Vector + index HNSW (ANN) hoặc FLAT (chính xác); chỉ HSET embedding thì chưa tìm được; TTL tính bằng giây.',
      questionIds: [21, 104, 126],
      blocks: [
        {
          type: 'tldr',
          text: 'Lưu embedding bằng `HSET` **chưa đủ** để tìm tương tự — phải tạo **search index** có trường kiểu **VECTOR**. Thuật toán: **HNSW** (ANN, nhanh cho dữ liệu lớn) hoặc **FLAT** (tìm chính xác, brute-force).',
        },
        { type: 'code', text: 'FT.CREATE idx:docs ON HASH PREFIX 1 doc: SCHEMA\n  embedding VECTOR HNSW 6 TYPE FLOAT32 DIM 1536 DISTANCE_METRIC COSINE', caption: 'Tạo index vector trên trường embedding của các hash doc:*' },
        {
          type: 'table',
          headers: ['Yêu cầu', 'Chọn'],
          rows: [
            ['Kiểu trường của embedding', '**Vector** (không phải Numeric/Tag)'],
            ['ANN độ trễ thấp cho dữ liệu lớn', '**HNSW index**'],
            ['Embedding đã lưu nhưng query không ra kết quả', '**Tạo vector index** (vd. FLAT) trên trường embedding'],
          ],
        },
        {
          type: 'example',
          scenario: 'Code `HSET doc:1 embedding <bytes>` rồi `EXPIRE doc:1 600`.',
          right: 'Embedding được lưu thành **field của hash**; key **hết hạn sau 10 phút**; nhưng **chưa** bật similarity search.',
          why: 'EXPIRE tính bằng giây; similarity search cần FT.CREATE với trường VECTOR.',
        },
      ],
    },
  ],
}
