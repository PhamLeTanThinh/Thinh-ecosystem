import {
  pgTable,
  text,
  timestamp,
  integer,
  real,
  boolean,
  jsonb,
  uuid,
  varchar,
  primaryKey,
} from 'drizzle-orm/pg-core'

// ── URL SHORTENER ─────────────────────────────────────────────────
export const shortUrls = pgTable('short_urls', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 12 }).notNull().unique(),
  originalUrl: text('original_url').notNull(),
  clicks: integer('clicks').default(0).notNull(),
  expiresAt: timestamp('expires_at'),           // null = permanent
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── CHINESE VOCAB (Học từ vựng tiếng Trung bằng flashcard) ─────────
// `id` là text vì client tự sinh nanoid trước khi gửi lên server, cùng convention với habits/money.
// `learnerId` NULL = thẻ GỐC dùng chung cho mọi người (toàn bộ ~611 thẻ hiện có, chỉ chủ trang mới
// thêm/sửa được — xem requireAdminApi ở api/chinese/cards). Có giá trị = thẻ do 1 hồ sơ khách tự thêm,
// CHỈ hồ sơ đó thấy được; hồ sơ bị xoá (lib/learner/admin.ts deleteLearner) thì các thẻ này xoá theo,
// nhưng không bao giờ đụng tới thẻ gốc (learnerId NULL). Không cho SỬA thẻ (kể cả thẻ tự thêm) — chỉ
// thêm mới hoặc xoá cả hồ sơ, để tránh phải phân xử "ai được sửa field nào" cho từng trường hợp.
export const chineseCards = pgTable('chinese_cards', {
  id: text('id').primaryKey(),
  learnerId: text('learner_id'),
  kind: varchar('kind', { length: 10 }).default('vocab').notNull(), // 'vocab' | 'grammar'
  lesson: integer('lesson').default(1).notNull(), // theo LESSON_NUMBERS trong lib/chinese/lessons.ts
  hanzi: text('hanzi').notNull(),     // 你好 (vocab) hoặc mẫu ngữ pháp (grammar)
  pinyin: text('pinyin').notNull(),   // nǐ hǎo — rỗng nếu là grammar không cần phiên âm
  meaning: text('meaning').notNull(), // Xin chào
  note: text('note').default('').notNull(), // ghi chú thêm (vocab) hoặc cách chia/cách dùng (grammar)
  example: text('example').default('').notNull(), // câu ví dụ, nhiều câu nối bằng '\n'
  theory: text('theory').default('').notNull(), // lý thuyết mở rộng (chỉ dùng cho grammar)
  exampleDetail: text('example_detail').default('[]').notNull(), // JSON chú thích từng câu ví dụ (chỉ grammar)
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Kết quả ôn tập gần nhất của mỗi thẻ, RIÊNG THEO TỪNG NGƯỜI HỌC (learnerId — định danh ẩn danh theo
// trình duyệt, xem lib/learner/identity.ts; KHÔNG phải tài khoản/đăng nhập). Khoá chính kép
// (learnerId, id) vì thẻ (id = cardId) là nội dung DÙNG CHUNG — nhiều người có thể cùng ôn 1 thẻ mà
// tiến độ không đụng nhau. Dữ liệu tạo ra trước khi có khái niệm này được gắn learnerId = 'legacy'
// (xem LEGACY_LEARNER_ID) thay vì mất — xem route /api/learner/claim-legacy để nhận lại.
export const chineseProgress = pgTable(
  'chinese_progress',
  {
    learnerId: text('learner_id').default('legacy').notNull(),
    id: text('id').notNull(), // = cardId
    correctCount: integer('correct_count').default(0).notNull(),
    wrongCount: integer('wrong_count').default(0).notNull(),
    lastResult: varchar('last_result', { length: 10 }), // 'correct' | 'wrong'
    lastReviewedAt: timestamp('last_reviewed_at'),
  },
  (t) => [primaryKey({ columns: [t.learnerId, t.id] })],
)

// Cài đặt hiển thị của app — 1 dòng/người học. Cột SQL vẫn tên "id" (không đổi tên cột thật trong DB)
// nhưng giờ mang giá trị learnerId thay vì hằng số 'default' như trước — xem lib/learner/identity.ts.
export const chineseSettings = pgTable('chinese_settings', {
  learnerId: text('id').primaryKey(),
  pinyinPosition: varchar('pinyin_position', { length: 10 }).default('hanzi').notNull(), // 'hanzi' | 'vietnamese'
  shuffle: boolean('shuffle').default(true).notNull(),
  // 'hanzi-to-pinyin' | 'hanzi-to-meaning' | 'meaning-to-hanzi' — chiều câu hỏi trắc nghiệm kiểu Quizlet.
  quizMode: varchar('quiz_mode', { length: 20 }).default('hanzi-to-meaning').notNull(),
})

// Sổ đăng ký TÊN hồ sơ đã được ai đó "nhận" (route /api/learner/create, hoặc rename cho hồ sơ cũ) —
// tách riêng khỏi 5 bảng dữ liệu học vì 1 hồ sơ vừa tạo xong có thể CHƯA có dòng nào ở bất kỳ bảng nào
// (chưa học gì cả), nên chỉ dò "tên đã có dữ liệu chưa" ở các bảng đó là không đủ — người khác có thể
// "cướp" đúng cái tên rỗng đó. Ràng buộc UNIQUE trên id còn giúp việc "nhận tên" atomic, tránh 2 người
// tạo trùng tên cùng lúc (race condition) mà không cần khoá thêm ở tầng ứng dụng.
export const learnerProfiles = pgTable('learner_profiles', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Bộ học riêng do người dùng tự chọn 1 nhóm từ để ôn tập tách biệt — mỗi người học chỉ thấy/sửa được
// bộ của chính mình (learnerId, xem lib/learner/identity.ts). `id` (nanoid do client sinh) vẫn đủ
// làm khoá chính vì đã ngẫu nhiên xuyên suốt mọi người học.
export const chineseDecks = pgTable('chinese_decks', {
  id: text('id').primaryKey(),
  learnerId: text('learner_id').default('legacy').notNull(),
  name: text('name').notNull(),
  cardIds: text('card_ids').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── KOREAN VOCAB & GRAMMAR (Học từ vựng + ngữ pháp tiếng Hàn theo bài) ──
// `id` là text vì client tự sinh nanoid trước khi gửi lên server, cùng convention với chinese/habits/money.
// `learnerId`: cùng quy ước với chineseCards ở trên (NULL = thẻ gốc dùng chung, chỉ chủ trang sửa được;
// có giá trị = thẻ do 1 hồ sơ khách tự thêm, riêng tư, xoá theo khi hồ sơ đó bị xoá).
export const koreanCards = pgTable('korean_cards', {
  id: text('id').primaryKey(),
  learnerId: text('learner_id'),
  kind: varchar('kind', { length: 10 }).notNull(), // 'vocab' | 'grammar'
  lesson: integer('lesson').notNull(), // 1-18, tương ứng 제 N 과
  front: text('front').notNull(), // hangul (vocab) hoặc mẫu ngữ pháp (grammar)
  meaning: text('meaning').notNull(), // nghĩa tiếng Việt
  note: text('note').default('').notNull(), // english (vocab) hoặc cách chia/cách dùng (grammar)
  example: text('example').default('').notNull(), // câu ví dụ, nhiều câu nối bằng '\n'
  theory: text('theory').default('').notNull(), // lý thuyết mở rộng (chỉ dùng cho grammar)
  exampleDetail: text('example_detail').default('[]').notNull(), // JSON chú thích từng câu ví dụ (chỉ grammar)
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Kết quả ôn tập gần nhất của mỗi thẻ, RIÊNG THEO TỪNG NGƯỜI HỌC — cùng thiết kế với chineseProgress
// ở trên (xem chú thích đó và lib/learner/identity.ts).
export const koreanProgress = pgTable(
  'korean_progress',
  {
    learnerId: text('learner_id').default('legacy').notNull(),
    id: text('id').notNull(), // = cardId
    correctCount: integer('correct_count').default(0).notNull(),
    wrongCount: integer('wrong_count').default(0).notNull(),
    lastResult: varchar('last_result', { length: 10 }), // 'correct' | 'wrong'
    lastReviewedAt: timestamp('last_reviewed_at'),
  },
  (t) => [primaryKey({ columns: [t.learnerId, t.id] })],
)

// Cài đặt hiển thị của app — 1 dòng/người học — cùng thiết kế với chineseSettings ở trên.
export const koreanSettings = pgTable('korean_settings', {
  learnerId: text('id').primaryKey(),
  shuffle: boolean('shuffle').default(true).notNull(),
  // 'front-to-meaning' | 'meaning-to-front' — chiều câu hỏi trắc nghiệm kiểu Quizlet.
  quizMode: varchar('quiz_mode', { length: 20 }).default('front-to-meaning').notNull(),
})

// Tiến độ luyện đề chứng chỉ (Certs Hub), RIÊNG THEO TỪNG NGƯỜI HỌC — cùng hồ sơ learnerId với
// Chinese/Korean (xem lib/learner/identity.ts). certId (vd 'ccaf') + questionId (id câu trong ngân
// hàng đề) cùng learnerId tạo khoá kép.
export const certProgress = pgTable(
  'cert_progress',
  {
    learnerId: text('learner_id').notNull(),
    certId: varchar('cert_id', { length: 20 }).notNull(),
    questionId: integer('question_id').notNull(),
    correctCount: integer('correct_count').default(0).notNull(),
    wrongCount: integer('wrong_count').default(0).notNull(),
    lastResult: varchar('last_result', { length: 10 }), // 'correct' | 'wrong'
    lastReviewedAt: timestamp('last_reviewed_at'),
  },
  (t) => [primaryKey({ columns: [t.learnerId, t.certId, t.questionId] })],
)

// Mỗi LẦN luyện (bấm "Kết thúc") của 1 người học: điểm + danh sách id câu sai của lần đó, để liệt kê lịch
// sử và luyện lại đúng những câu sai của từng lần. Cùng quy ước learnerId với certProgress.
export const certAttempts = pgTable('cert_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  learnerId: text('learner_id').notNull(),
  certId: varchar('cert_id', { length: 20 }).notNull(),
  mode: varchar('mode', { length: 20 }).notNull(),
  total: integer('total').notNull(),
  correct: integer('correct').notNull(),
  wrongIds: jsonb('wrong_ids').$type<number[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Trạng thái luyện đề IELTS của từng người (điểm + lịch sử các lần nộp, bài làm dở, highlight, từ đã thuộc,
// tuỳ chọn hiển thị) — mỗi mục 1 dòng, value là đúng cục JSON mà trình duyệt vẫn giữ ở localStorage (xem
// lib/ielts/practiceSync.ts). ownerKey = email đăng nhập (chữ thường), hoặc 'owner' khi chưa bật chia sẻ.
export const ieltsPracticeState = pgTable(
  'ielts_practice_state',
  {
    ownerKey: text('owner_key').notNull(),
    key: varchar('key', { length: 40 }).notNull(),
    value: jsonb('value').notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.ownerKey, t.key] })],
)

// ── FAMILY TREE ───────────────────────────────────────────────────
export const familyMembers = pgTable('family_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  nameEn: text('name_en'),
  gender: varchar('gender', { length: 10 }), // 'male' | 'female' | 'other'
  birthDate: timestamp('birth_date'),
  deathDate: timestamp('death_date'),
  photoKey: text('photo_key'),   // R2 key
  photoUrl: text('photo_url'),
  bio: text('bio'),
  meta: jsonb('meta'),           // thêm fields tuỳ ý
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const familyRelations = pgTable('family_relations', {
  id: uuid('id').defaultRandom().primaryKey(),
  fromId: uuid('from_id').notNull().references(() => familyMembers.id),
  toId: uuid('to_id').notNull().references(() => familyMembers.id),
  type: varchar('type', { length: 20 }).notNull(),
  // 'parent' | 'child' | 'spouse' | 'sibling'
})

// ── EXPENSE TRACKER (Quản lý thu chi) ──────────────────────────────
// `id` là text vì client tự sinh nanoid (lib/money/store.ts) trước khi gửi
// lên server — tránh phải đổi id sau khi insert.
export const moneyWallets = pgTable('money_wallets', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  includeInTotal: boolean('include_in_total').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const moneyCategories = pgTable('money_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  color: text('color').notNull(),
  type: varchar('type', { length: 10 }).notNull(), // 'expense' | 'income' | 'debt'
})

// `debtId` liên kết giao dịch trả/thu nợ với 1 khoản nợ cụ thể trong moneyDebts (nullable).
export const moneyTransactions = pgTable('money_transactions', {
  id: text('id').primaryKey(),
  walletId: text('wallet_id').notNull().references(() => moneyWallets.id),
  categoryId: text('category_id').notNull().references(() => moneyCategories.id),
  type: varchar('type', { length: 10 }).notNull(),
  amount: integer('amount').notNull(),
  note: text('note'),
  date: varchar('date', { length: 10 }).notNull(), // 'YYYY-MM-DD'
  debtId: text('debt_id').references(() => moneyDebts.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const moneyBudgets = pgTable('money_budgets', {
  id: text('id').primaryKey(),
  walletId: text('wallet_id').notNull().references(() => moneyWallets.id),
  categoryId: text('category_id').notNull().references(() => moneyCategories.id),
  amount: integer('amount').notNull(),
  periodStart: varchar('period_start', { length: 10 }).notNull(),
  periodEnd: varchar('period_end', { length: 10 }).notNull(),
  repeatMonthly: boolean('repeat_monthly').default(false).notNull(),
})

// Cài đặt chung của app (1 dòng duy nhất, id = 'default').
export const moneySettings = pgTable('money_settings', {
  id: text('id').primaryKey(),
  cycleStartDay: integer('cycle_start_day').notNull(),
})

// ── QUẢN LÝ NỢ (Vay/Cho vay theo từng khoản cụ thể) ────────────────
export const moneyDebts = pgTable('money_debts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(), // tên người/nơi vay hoặc cho vay
  direction: varchar('direction', { length: 10 }).notNull(), // 'owe' (tôi nợ) | 'owed' (người ta nợ tôi)
  principal: integer('principal').notNull(), // số tiền vay gốc
  dueDate: varchar('due_date', { length: 10 }), // 'YYYY-MM-DD', optional
  note: text('note'),
  closed: boolean('closed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Bản sao lưu toàn bộ dữ liệu money (snapshot trước mỗi lần ghi đè toàn bộ 1 bảng,
// hoặc tạo thủ công) — phòng trường hợp 1 lệnh PUT (replace toàn bộ) ghi nhầm dữ liệu.
export const moneyBackups = pgTable('money_backups', {
  id: text('id').primaryKey(),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── HABIT TRACKER (Theo dõi thói quen) ─────────────────────────────
// `id` là text vì client tự sinh nanoid trước khi gửi lên server, cùng convention với money.
export const habits = pgTable('habits', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  color: text('color').notNull(),
  category: varchar('category', { length: 20 }).default('health').notNull(), // 'health' | 'study'
  sortOrder: integer('sort_order').default(0).notNull(),
  archived: boolean('archived').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// 1 dòng = 1 ngày habit đó đã được tick hoàn thành; không có dòng nghĩa là chưa làm.
export const habitLogs = pgTable('habit_logs', {
  id: text('id').primaryKey(),
  habitId: text('habit_id').notNull().references(() => habits.id),
  date: varchar('date', { length: 10 }).notNull(), // 'YYYY-MM-DD'
})

// Mood/giờ ngủ mỗi ngày — `id` = `date` để đảm bảo chỉ 1 dòng/ngày.
export const wellnessLogs = pgTable('wellness_logs', {
  id: varchar('id', { length: 10 }).primaryKey(), // = date 'YYYY-MM-DD'
  date: varchar('date', { length: 10 }).notNull(),
  mood: integer('mood'), // 1-5, nullable
  sleepHours: real('sleep_hours'), // nullable
})

// ── STICKY NOTES (mỗi ngày là 1 canvas toàn màn hình riêng — click bất kỳ đâu để tạo) ──
// `id` là text vì client tự sinh nanoid trước khi gửi lên server, cùng convention với habits/money.
export const stickyNotes = pgTable('sticky_notes', {
  id: text('id').primaryKey(),
  date: varchar('date', { length: 10 }).notNull(), // 'YYYY-MM-DD' — note thuộc "space" ngày nào
  x: real('x').notNull(), // toạ độ tự do trên canvas của ngày đó (px, ở zoom 100%)
  y: real('y').notNull(),
  width: real('width'), // null = auto (mặc định); có giá trị khi user tự kéo resize
  height: real('height'), // null = auto theo nội dung; có giá trị khi user tự kéo resize
  kind: varchar('kind', { length: 10 }).default('note').notNull(), // 'note' | 'timeline' — chọn lúc tạo, xem lib/notes/types.ts
  content: text('content').notNull(), // rich text HTML (TipTap) — chỉ dùng khi kind = 'note'
  color: varchar('color', { length: 10 }), // accent tuỳ chọn: 'yellow' | 'pink' | 'mint' | 'sky' | 'lavender' | null
  tags: text('tags').array().default([]).notNull(), // nhãn tự do do user tự đặt, không ép taxonomy
  timeBlocks: jsonb('time_blocks').default([]).notNull(), // TimeBlock[] — các mốc giờ nối tiếp trong note (xem lib/notes/types.ts)
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── IELTS KNOWLEDGE HUB (gom kiến thức theo chủ đề/kỹ năng, khác notes theo thời gian) ──
// `id` là text vì client tự sinh nanoid trước khi gửi lên server, cùng convention với các app khác.
// Trang tài liệu dài (rich text) — 1 dòng/trang con do user tự tạo trong 1 mục kỹ năng.
export const ieltsPages = pgTable('ielts_pages', {
  id: text('id').primaryKey(),
  skill: varchar('skill', { length: 20 }).notNull(), // 'listening' | 'speaking' | 'reading' | 'writing'
  title: text('title').notNull(),
  content: text('content').default('').notNull(), // rich text HTML (TipTap, callout/example block riêng)
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Danh sách email được mời XEM (không edit) /ielts — chủ nhập email trong /admin, hệ thống
// gửi magic link tới đúng email đó. `email` là khoá chính (luôn lưu dạng lowercase) nên thu hồi/mời
// lại 1 người chỉ cần update đúng 1 dòng, không tạo trùng.
export const ieltsInvites = pgTable('ielts_invites', {
  email: text('email').primaryKey(),
  invitedAt: timestamp('invited_at').defaultNow().notNull(),
  revokedAt: timestamp('revoked_at'), // null = còn hiệu lực; có giá trị = đã bị thu hồi quyền xem
})

// Người lạ vào /ielts/login nhập email khi chưa được mời → 1 dòng ở đây chờ chủ duyệt trong
// /admin. Duyệt = thêm vào ieltsInvites + gửi magic link, rồi xoá dòng này. Từ chối = đổi
// status sang 'rejected' và GIỮ dòng lại để lần xin sau của cùng email không báo lại cho chủ (chống spam).
export const ieltsAccessRequests = pgTable('ielts_access_requests', {
  email: text('email').primaryKey(), // lowercase
  status: varchar('status', { length: 10 }).default('pending').notNull(), // 'pending' | 'rejected'
  requestedAt: timestamp('requested_at').defaultNow().notNull(),
})

// Token đăng nhập 1 lần gửi qua email (magic link) — sống ngắn hạn (xem MAGIC_TOKEN_TTL_MS trong
// access.ts), dùng 1 lần rồi đánh dấu usedAt để không replay lại được link cũ trong email.
export const ieltsMagicTokens = pgTable('ielts_magic_tokens', {
  token: text('token').primaryKey(),
  email: text('email').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
})

// 1 dòng = 1 lần load trang /ielts thành công (owner hoặc viewer) — dùng để chủ trang xem được
// ai vào bao nhiêu lần, bằng trình duyệt gì. Ghi ở layout server, không ghi theo mỗi request API.
export const ieltsAccessLogs = pgTable('ielts_access_logs', {
  id: text('id').primaryKey(),
  email: text('email').notNull(), // lowercase; 'owner' nếu chưa bật chia sẻ thì không ghi (xem access.ts)
  userAgent: text('user_agent').default('').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Từ vựng — danh sách có cấu trúc, khác document tự do của các trang kỹ năng.
export const ieltsVocab = pgTable('ielts_vocab', {
  id: text('id').primaryKey(),
  word: text('word').notNull(),
  partOfSpeech: varchar('part_of_speech', { length: 20 }).default('').notNull(), // tự do: 'danh từ', 'động từ'...
  meaning: text('meaning').notNull(),
  example: text('example').default('').notNull(),
  band: varchar('band', { length: 20 }).default('').notNull(), // vd 'Band 7+', tự do nhập
  topic: text('topic').default('').notNull(), // tự do nhập
  linkedPageId: text('linked_page_id').references(() => ieltsPages.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── GÓP Ý (tab "Góp ý" trong DonateWidget — mèo "Mua pate cho Diên" ở /study) ──────────────
// Không gắn learnerId/auth gì — ai cũng gửi được, chỉ mình chủ trang đọc qua db:studio. `page` ghi lại
// pathname lúc gửi để biết góp ý đang nói về app nào.
export const siteFeedback = pgTable('site_feedback', {
  id: text('id').primaryKey(),
  message: text('message').notNull(),
  page: text('page').default('').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
