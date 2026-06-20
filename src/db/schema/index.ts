import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uuid,
  varchar,
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

// ── LANGUAGE LEARNING (Chinese / Korean) ─────────────────────────
export const languages = pgTable('languages', {
  id: varchar('id', { length: 10 }).primaryKey(), // 'chinese' | 'korean'
  name: text('name').notNull(),
})

export const flashcards = pgTable('flashcards', {
  id: uuid('id').defaultRandom().primaryKey(),
  languageId: varchar('language_id', { length: 10 }).notNull()
    .references(() => languages.id),
  front: text('front').notNull(),     // 你好 / 안녕하세요
  back: text('back').notNull(),       // Xin chào
  pinyin: text('pinyin'),             // nǐ hǎo (chỉ Chinese)
  romanized: text('romanized'),       // annyeonghaseyo (chỉ Korean)
  level: integer('level').default(1), // HSK level / TOPIK level
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const userProgress = pgTable('user_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: text('session_id').notNull(), // anonymous session
  flashcardId: uuid('flashcard_id').notNull()
    .references(() => flashcards.id),
  correct: integer('correct').default(0).notNull(),
  wrong: integer('wrong').default(0).notNull(),
  lastReviewedAt: timestamp('last_reviewed_at').defaultNow(),
  nextReviewAt: timestamp('next_review_at'),   // spaced repetition
})

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
