import type { Skill } from './types'
import { markDirty, PRACTICE_KEYS } from './practiceSync'

// multi = "Choose TWO letters": N câu liền nhau cùng prompt + options, hiện thành 1 thẻ chọn N ô. Mỗi câu có
// answer = 1 đáp án đúng, alt = các đáp án đúng còn lại → chấm theo TẬP HỢP (chọn đúng mấy ô được mấy điểm,
// không phụ thuộc thứ tự chọn). UI sắp các ô đã chọn theo thứ tự options rồi gán lần lượt cho từng câu.
export type QuestionType = 'gap-fill' | 'table' | 'tfng' | 'ynng' | 'mcq' | 'multi' | 'match' | 'bank'

export const QUESTION_TYPES: { key: QuestionType; label: string }[] = [
  { key: 'gap-fill', label: 'Điền từ' },
  { key: 'table', label: 'Table Completion' },
  { key: 'tfng', label: 'True / False / Not Given' },
  { key: 'ynng', label: 'Yes / No / Not Given' },
  { key: 'mcq', label: 'Trắc nghiệm' },
  { key: 'multi', label: 'Chọn nhiều đáp án (Choose TWO letters)' },
  { key: 'match', label: 'Nối câu ↔ lựa chọn (A/B/C/D)' },
  { key: 'bank', label: 'Chọn từ ngân hàng đáp án dùng chung' },
]

// 3 lựa chọn cố định mà UI tự hiện (câu không cần options) — tfng hỏi về THÔNG TIN trong bài, ynng hỏi về
// QUAN ĐIỂM/nhận định của tác giả.
export const FIXED_CHOICES: Partial<Record<QuestionType, string[]>> = {
  tfng: ['True', 'False', 'Not Given'],
  ynng: ['Yes', 'No', 'Not Given'],
}

export function questionTypeLabel(type: QuestionType): string {
  return QUESTION_TYPES.find((t) => t.key === type)?.label ?? type
}

// ── Giải thích có cấu trúc (màn "Xem giải thích") ─────────────────────────────
export type ChipColor = 'blue' | 'orange' | 'green' | 'red'

// 1 cụm từ viền màu; label = nhãn nhỏ phía trên (vai trò S / V, hoặc nghĩa tiếng Việt). Hỗ trợ **đậm** trong text.
export interface ExChip {
  text: string
  color?: ChipColor // mặc định blue
  label?: string
  // Chuỗi NGUYÊN VĂN trong bài đọc để Locate tìm và tô (khi text của cụm không trùng nguyên văn, vd có chú thích trong ngoặc).
  find?: string
}

// 1 cặp so sánh "cụm ở câu hỏi = cụm ở bài đọc"; rel mặc định '='. Không có right thì hiện left + note
// (vd "→ không có thông tin trong bài").
export interface ExPair {
  left: ExChip
  right?: ExChip
  rel?: '=' | '≠'
  note?: string
}

export interface ExParaphrase {
  // Câu hỏi với các cụm được tô nền màu (color) — không có color thì chữ thường.
  question: { text: string; color?: ChipColor }[]
  // Dòng "Answer:" ngay dưới câu hỏi (vd "A - Plague outbreaks were…") — dùng khi câu hỏi chung cho nhiều đáp án
  // (dạng Choose TWO) nên cần nói rõ câu này giải thích cho lựa chọn nào.
  answer?: { text: string; color?: ChipColor }[]
  pairs: ExPair[]
}

// 1 câu của bài đọc tách thành các cụm. chips có thể xen chuỗi thường (dấu phẩy…). n = số thứ tự khi có nhiều câu.
export interface ExSentence {
  n?: number
  prefix?: string // vd "Bài đọc cho biết:"
  chips: (ExChip | string)[]
}

// Phân tích cấu trúc câu của bài đọc (nhiều câu → mỗi câu có số thứ tự n).
export interface ExBreakdown {
  title?: string // mặc định "Phân tích cấu trúc câu"
  sentences: ExSentence[]
}

export interface Explanation {
  paraphrase?: ExParaphrase // khối "Paraphrasing"
  breakdown?: ExBreakdown // khối phân tích cấu trúc câu trong "Giải thích chi tiết"
  // Các dòng diễn giải bên dưới. Định dạng: **đậm**, xuống dòng bằng \n, {ok} ✓ xanh, {no} ✕ đỏ, [[3]] huy hiệu số.
  notes?: string
  // Giải thích chi tiết dạng "từng bước" (vd Linear thinking Step 01-04): dòng chữ và dòng cụm (ExSentence) XEN
  // KẼ theo đúng thứ tự. Có detail thì hiện detail thay cho breakdown + notes. Dòng chữ hỗ trợ như notes, thêm
  // *nghiêng*, `---` = đường kẻ ngăn, dòng bắt đầu bằng "• " = gạch đầu dòng thụt vào.
  detail?: (string | ExSentence)[]
}

export interface PracticeQuestion {
  id: string
  type: QuestionType
  // gap-fill / table: dùng "___" đánh dấu chỗ trống (1 chỗ trống = 1 câu). tfng / mcq / match: câu hỏi thường.
  prompt: string
  options?: string[] // chỉ mcq
  // match: đáp án là 1 chữ cái khớp với key trong PracticeGroup.matchLegend (vd 'A', 'B'…) — hiện dạng
  // ma trận (mỗi câu 1 hàng, các lựa chọn A/B/C/D là các nút tròn cùng hàng) thay vì danh sách dọc như mcq.
  // bank: đáp án là NGUYÊN VĂN 1 mục trong PracticeGroup.optionBank (danh sách chung, hiện 1 lần cuối
  // nhóm) — mỗi câu chỉ hiện 1 ô "Chọn đáp án" để bấm chọn, không lặp lại 4 lựa chọn theo từng câu như mcq.
  answer: string
  alt?: string[] // các đáp án khác cũng được chấm đúng (vd số ít / số nhiều)
  // Giải thích đáp án (hiện ở trang "Xem giải thích"). Chưa có thì để trống, trang sẽ báo chưa có.
  // Hỗ trợ định dạng: **đậm**, xuống dòng bằng \n, {ok} = dấu ✓ xanh, {no} = dấu ✗ đỏ, [[3]] = huy hiệu số câu.
  explanation?: string | Explanation // chuỗi = chỉ có phần diễn giải
  // Câu chứng cứ trong bài đọc (para = chỉ số đoạn, text = đoạn chữ NGUYÊN VĂN) — công tắc "Locate" ở màn giải
  // thích sẽ tô sáng và cuộn tới các đoạn này.
  locate?: { para: number; text: string }[]
}

// Bố cục bảng cho dạng Table Completion: mỗi dòng của ô là chữ thường (không có chỗ trống) hoặc {q: id câu hỏi}
// — câu đó hiện bằng prompt của nó (có "___" thành ô điền) tại đúng vị trí trong bảng.
export interface TableLayout {
  title: string
  // labelLines: ô cột trái có chỗ trống (vd "Observing the ___ of…") — có thì hiện thay cho label (chữ thường, không đậm).
  rows: { label: string; labelLines?: (string | { q: string })[]; lines: (string | { q: string })[] }[]
  // Hàng tiêu đề cột (vd ['TEST', 'FINDINGS']) — không có thì bảng không có hàng tiêu đề.
  headers?: string[]
  // true = dạng Note Completion: bỏ khung bảng, mỗi hàng là 1 danh sách gạch đầu dòng; label khác rỗng thì hiện
  // làm tiêu đề phụ phía trên danh sách đó (dòng chữ thường vẫn là 1 gạch đầu dòng không có ô điền).
  // title rỗng = không hiện tiêu đề.
  bullets?: boolean
  // true = dạng Summary Completion: mỗi HÀNG là 1 đoạn văn, các dòng trong hàng nối liền nhau (ô trống nằm giữa
  // dòng chữ), không bảng, không gạch đầu dòng. Mỗi câu hỏi là 1 khúc của đoạn, prompt chứa "___"; dòng chữ thường
  // (không có ô trống) cũng được.
  summary?: boolean
}

export interface PracticeGroup {
  id: string
  // Hỗ trợ **in đậm** bằng cặp dấu ** (vd "Choose **ONE WORD ONLY**").
  instruction: string
  questions: PracticeQuestion[]
  table?: TableLayout // có thì nhóm hiển thị dạng bảng thay vì danh sách câu hỏi
  // Bảng chú giải A/B/C/D dùng chung cho các câu type 'match' trong nhóm (vd A=Coach, B=Tesco…) — hiện 1
  // lần ở cuối nhóm, không lặp lại theo từng câu.
  matchLegend?: { key: string; label: string }[]
  // Danh sách đáp án (nguyên văn, không phải chữ cái) dùng chung cho các câu type 'bank' trong nhóm —
  // hiện 1 lần dạng "ngân hàng đáp án" bên dưới các câu, mỗi mục dùng được cho nhiều câu (không khoá lại
  // sau khi đã chọn).
  optionBank?: string[]
}

export interface PracticeVocab {
  word: string
  partOfSpeech: string
  meaning: string
  example: string
  ipa?: string
  definitionEn?: string
  exampleVi?: string
  image?: string // URL ảnh minh hoạ; nếu thiếu sẽ dùng emoji
  emoji?: string
}

export interface PracticeTest {
  id: string
  skill: Skill
  title: string
  category: string // vd "Practice test"
  part: string // vd "Reading 5"
  durationMin: number
  passageTitle: string
  passage: string[] // mỗi phần tử = 1 đoạn
  paragraphLabels?: string[] // nhãn A, B, C… hiện bên trái từng đoạn (bài có câu hỏi theo đoạn)
  groups: PracticeGroup[]
  vocab: PracticeVocab[]
  difficulty?: Difficulty // hiện thành nhãn trên thẻ đề ở danh sách
}

export type PracticeMode = 'practice' | 'real'

// Phần tối thiểu client được nhận cho danh sách đề / trang từ vựng — KHÔNG có bài đọc, câu hỏi, đáp án.
// Đề đầy đủ chỉ đi tới client ở màn làm bài, sau khi đã kiểm tra quyền (xem assertIeltsAccess).
export interface TestSummary {
  id: string
  skill: Skill
  title: string
  category: string
  part: string
  durationMin: number
  questionTypes: QuestionType[]
  questionCount: number
  difficulty?: Difficulty
}

// 1 "Vocab set" = từ vựng của 1 đề, hoặc 1 set độc lập theo chủ đề (VocabSet bên dưới — vd Writing chưa có đề).
// testId = id đề hoặc id set; hasTest = false thì trang học set không hiện nút "Làm đề này".
export interface VocabGroup {
  testId: string
  testTitle: string
  skill: Skill
  category: string
  part: string
  vocab: PracticeVocab[]
  hasTest: boolean
}

// Vocab set không gắn với đề nào (theo chủ đề, vd Writing - Environment). Khai báo trong src/data/ielts/vocab/,
// gom vào vocabForSkill() ở lib/ielts/tests.ts cùng với vocab của các đề.
export interface VocabSet {
  id: string // dùng làm URL /ielts/<skill>/vocab/<id> và key lưu tiến độ "Đã thuộc" — đổi id là mất tiến độ
  skill: Skill
  title: string
  category: string
  part: string // vd "Topic 1", hiện ở dòng phụ của thẻ set
  vocab: PracticeVocab[]
}

// ── Bài tập "Ghép câu" (Sentence Building, Writing) ────────────────────────────────────────
// Khác đề Reading (không có bài đọc) và khác Vocab (có chấm đúng/sai): mỗi câu là 1 câu tiếng Việt cần
// dịch bằng cách CHỌN ĐÚNG THỨ TỰ vài thẻ từ cho sẵn — trong đó có cả thẻ nhiễu không dùng tới. Nguồn dữ
// liệu: API "Exercise" (questionType SENTENCE_BUILDING) của LMS.
export interface ExerciseWord {
  key: string // id ổn định của thẻ trong câu này (dùng làm React key) — KHÔNG dùng để so khớp đáp án
  value: string // chữ hiện trên thẻ, vd 'disagree' hoặc gộp vài cách nói 'completely/entirely'
  distractor: boolean // true = thẻ nhiễu, không xuất hiện trong bất kỳ correctAnswers nào
}

export interface ExerciseQuestion {
  id: string
  sentenceVi: string // câu tiếng Việt cần dịch/ghép
  words: ExerciseWord[] // trộn ngẫu nhiên ở UI lúc hiển thị, thứ tự khai báo ở đây không có ý nghĩa
  // Chấm bằng cách NỐI value của các thẻ người học đã bấm (theo đúng thứ tự bấm) bằng dấu cách rồi so khớp
  // không phân biệt hoa/thường với 1 trong các chuỗi này. Thường có 2 cách diễn đạt: theo động từ, theo
  // danh từ cùng gốc.
  correctAnswers: string[]
  hint?: string
  // Cùng cú pháp **đậm** / *nghiêng* / {ok} ✓ xanh với Explanation.notes ở Reading (xem AnswerReview.tsx).
  explanation?: string
}

interface ExerciseSetBase {
  id: string // dùng làm URL /ielts/<skill>/exercise/<id> và key lưu tiến độ — đổi id là mất tiến độ
  skill: Skill
  title: string
  category: string // vd 'Writing exercise'
  part: string // vd 'Writing 1 - Exercise 1', hiện ở dòng phụ của thẻ set
}

export interface SentenceBuildingSet extends ExerciseSetBase {
  kind: 'sentence-building'
  instruction?: string // câu hướng dẫn chung đầu bài (giống nhau cho mọi câu trong set)
  questions: ExerciseQuestion[]
}

// ── Bài tập "Nối nghĩa" (Matching, Writing) ─────────────────────────────────────────────────
// Dạng bài thứ 2 (khác Sentence Building): mỗi vòng cho sẵn N cụm tiếng Anh (options, gồm cả vài cụm
// nhiễu không khớp nghĩa nào) và N nghĩa tiếng Việt (prompts) — nối đúng cặp. Nguồn: API "Exercise" của
// LMS (questionType INFO_MATCHING), phần "recap" lấy từ trang TEXT hiện SAU mỗi vòng câu hỏi
// (câu ví dụ thật, không phải tự soạn).
export interface MatchingOption {
  key: string
  value: string // cụm tiếng Anh (collocation)
  distractor: boolean // true = không khớp nghĩa nào trong prompts của vòng này (bẫy)
}

export interface MatchingPrompt {
  key: string
  value: string // nghĩa tiếng Việt cần nối với đúng 1 option
}

export interface MatchingRecap {
  vi: string
  en: string
  example: string // câu ví dụ tiếng Anh thật dùng collocation này
}

export interface MatchingRound {
  id: string
  instruction: string // câu hướng dẫn của vòng này, vd 'Nối các collocations với ngữ nghĩa đúng'
  context?: string // dữ kiện/đề bài đi kèm vòng (vd số liệu cần diễn đạt), hiện dưới câu hướng dẫn
  options: MatchingOption[]
  prompts: MatchingPrompt[]
  correctMap: Record<string, string> // promptKey -> optionKey
  recap?: MatchingRecap[] // ôn lại sau khi kiểm tra vòng — hiện collocation + nghĩa + câu ví dụ
  explanation?: string // giải thích sau khi kiểm tra — cùng cú pháp **đậm** / *nghiêng* / {ok} / --- với ExerciseQuestion.explanation
}

export interface MatchingSet extends ExerciseSetBase {
  kind: 'matching'
  rounds: MatchingRound[]
}

// ── Bài tập "Quiz" (nhiều dạng câu trong 1 bộ, Writing) ─────────────────────────────────────
// Bộ trộn nhiều dạng câu (trắc nghiệm / điền chỗ trống từ ngân hàng / nối endings / sắp xếp câu / gõ tự do) — thường là các bài
// "Full Essay", "Paraphrasing"... Nguồn: API "Exercise" của LMS (MULTIPLE_CHOICE,
// COMPLETION_WITH_HINTS, INFO_MATCHING, SENTENCE_ARRANGEMENT, COMPLETION_WITHOUT_HINTS). Mỗi item = 1 màn: đúng hết mới tính qua (lưu tiến độ theo item.id).
interface QuizItemBase {
  id: string
  instruction: string // câu hướng dẫn của màn này
  context?: string // đề bài/dữ kiện đi kèm (hiện dưới câu hướng dẫn); nhiều dòng ngăn bằng \n
  explanation?: string // cùng cú pháp với ExerciseQuestion.explanation
}

export interface QuizChoiceItem extends QuizItemBase {
  type: 'choice'
  multiple: boolean // true = chọn nhiều đáp án (MULTIPLE), false = chọn 1
  options: { key: string; value: string }[] // giữ nguyên thứ tự nguồn
  correct: string[] // key các đáp án đúng
}

// Đoạn văn có chỗ trống: mỗi đoạn là dãy phần tử chữ / chỗ trống. Người học chọn cho mỗi chỗ trống 1 mục
// trong bank (mỗi mục dùng tối đa 1 lần, có thể có mục nhiễu).
export type QuizSegment = { text: string; bold?: boolean } | { blank: string }
export interface QuizCompletionItem extends QuizItemBase {
  type: 'completion'
  body: QuizSegment[][]
  bank: { key: string; value: string }[]
  correctMap: Record<string, string> // blankKey -> bankKey
}

export interface QuizMatchingItem extends QuizItemBase {
  type: 'matching'
  options: MatchingOption[]
  prompts: MatchingPrompt[]
  correctMap: Record<string, string> // promptKey -> optionKey
}

// Sắp xếp các câu (đoạn văn) theo đúng thứ tự — thường là các đoạn của 1 bài Full Essay.
export interface QuizOrderItem extends QuizItemBase {
  type: 'order'
  options: { key: string; value: string }[] // thứ tự nguồn (không có nghĩa)
  correct: string[] // key theo thứ tự đúng
}

// Gõ tự do vào chỗ trống (không có ngân hàng đáp án): chấm bằng cách so với các đáp án chấp nhận sau khi bỏ
// khác biệt hoa/thường, khoảng trắng thừa và dấu câu ở hai đầu.
export interface QuizTypingItem extends QuizItemBase {
  type: 'typing'
  body: QuizSegment[][]
  answers: Record<string, string[]> // blankKey -> các đáp án chấp nhận
}

// Bài nói lặp lại (Speaking, REPEATING): nghe câu gốc (prompt, thường là cách nói đơn giản) rồi NÓI câu mẫu (script,
// cách diễn đạt tự nhiên hơn). Chấm bằng nhận diện giọng nói của trình duyệt, hoặc người học tự đánh giá.
export interface QuizRepeatChunk {
  text: string
  meaning?: string // nghĩa tiếng Việt của cụm (chỉ có ở các cụm đáng chú ý)
  punct?: boolean // dấu câu: dính vào từ đứng trước, không cách dòng
}
export interface QuizRepeatItem extends QuizItemBase {
  type: 'repeat'
  prompt: string
  script: string
  chunks: QuizRepeatChunk[]
}

export type QuizItem = QuizChoiceItem | QuizCompletionItem | QuizMatchingItem | QuizOrderItem | QuizTypingItem | QuizRepeatItem

export interface QuizSet extends ExerciseSetBase {
  kind: 'quiz'
  items: QuizItem[]
}

export type ExerciseSet = SentenceBuildingSet | MatchingSet | QuizSet

// Phần tối thiểu cho trang danh sách — KHÔNG có words/correctAnswers/explanation (giữ đúng nguyên tắc
// TestSummary: dữ liệu có đáp án chỉ đi tới client ở màn làm bài, sau khi đã qua assertIeltsAccess).
export interface ExerciseSummary {
  id: string
  skill: Skill
  kind: ExerciseSet['kind']
  title: string
  category: string
  part: string
  // sentence-building: số câu. matching: số vòng. quiz: số màn (đơn vị "qua/chưa qua" thật sự được lưu tiến độ).
  questionCount: number
}

// ── Đề mẫu (Writing Sample) ──────────────────────────────────────────────────────────────────
// Khác cả Vocab set/Bài tập: đây là 1 bài luận mẫu hoàn chỉnh (đề bài + dàn ý + bài mẫu + từ vựng + 2 bài
// tập ôn nhúng sẵn) — hiện thành 1 trang cuộn dài có mục lục, không phải trang "làm bài" chấm điểm tổng.
// Nguồn: API "Sample" của LMS.
export interface SampleSpan {
  text: string
  // Có mặt khi đoạn chữ này là 1 cụm được tô — ở chế độ "Từ vựng" (vocabWord có giá trị) tô cam gạch chân
  // kèm nghĩa/IPA bấm vào xem; ở chế độ "Dàn ý" (highlight = true) tô xanh lá, phần chữ KHÔNG tô bị làm mờ.
  vocabWord?: string
  vocabMeaning?: string
  vocabIpa?: string
  highlight?: boolean
}

export interface SampleParagraph {
  id: string
  // Dòng tiêu đề chen giữa bài mẫu (Speaking: câu hỏi của giám khảo và nhãn "Answer 1"…) — có thì đoạn này chỉ hiện dòng chữ
  // này (vocabView / ideaView để rỗng). headingKind 'question' = câu hỏi (in đậm, to), 'label' = nhãn nhỏ.
  heading?: string
  headingKind?: 'question' | 'label'
  vocabView: SampleSpan[] // hiện khi bật chế độ "Từ vựng" (nguồn: samples[])
  ideaView: SampleSpan[] // hiện khi bật chế độ "Dàn ý" (nguồn: ideas[]) — cùng 1 câu chữ, khác cụm được tô
}

export interface SampleOutlineIdea {
  title: string
  bullets: string[]
}

export interface SampleOutlineParagraph {
  heading: string // vd 'Body paragraph 1:'
  topicSentence: string // câu chủ đề của đoạn — có đề chỉ 1 ý (ideas.length === 1), có đề nêu 2 hướng lập luận
  ideas: SampleOutlineIdea[]
}

export interface SampleGapFillItem {
  hintVi: string // câu tiếng Việt gợi ý phía trên chỗ trống
  before: string // phần câu tiếng Anh trước chỗ trống
  after: string // phần câu tiếng Anh sau chỗ trống
  correctValue: string // đáp án đúng — PHẢI có mặt trong SampleGapFill.bank
}

export interface SampleGapFill {
  bank: string[] // các lựa chọn hiện trong dropdown mỗi chỗ trống — dùng chung, không lặp (1-1 với items)
  items: SampleGapFillItem[]
}

export interface SampleShortAnswerItem {
  prompt: string // nghĩa tiếng Việt của cụm cần điền
  correctAnswer: string // so khớp không phân biệt hoa/thường, bỏ khoảng trắng thừa
}

export interface WritingSample {
  id: string // dùng làm URL /ielts/<skill>/sample/<id>
  skill: Skill
  title: string
  topic: string // vd 'Technology'
  resourceLabel: string // vd 'Writing Task 2 Academic'
  part: string // vd 'Writing 8', hiện ở dòng phụ của thẻ đề
  description: string
  question: string // đề bài
  // Ảnh biểu đồ/bản đồ/quy trình đi kèm đề — chỉ có ở Writing Task 1 (Map/Process/Chart/Diagram...).
  questionImage?: string
  chartType?: string // vd 'MAP', 'PROCESS', 'BAR_CHART', 'PIE_CHART', 'LINE', 'TABLE', 'MIXED' — chỉ có ở Task 1
  // Vài dòng "lộ trình" chung đầu mục Dàn ý (vd 'Chúng tôi sẽ trình bày quan điểm qua...') — không phải đề nào
  // cũng có sẵn trong nguồn.
  outlineIntro?: string[]
  // Task 2 luôn có (luận điểm agree/disagree...); Task 1 không có (chỉ mô tả số liệu, không nêu quan điểm).
  outlineThesis?: string
  outline: SampleOutlineParagraph[]
  essay: SampleParagraph[]
  vocab: PracticeVocab[]
  gapFill: SampleGapFill
  shortAnswer: SampleShortAnswerItem[]
  // "Lời kết" — không phải đề nào cũng có sẵn trong nguồn, thiếu thì trang ẩn luôn mục này.
  conclusion?: string[]
}

export interface SampleSummary {
  id: string
  skill: Skill
  title: string
  topic: string
  resourceLabel: string
  part: string
  description: string
  task?: 1 | 2 | 3 // Writing Task 1/2 hoặc Speaking Part 1/2/3, suy từ resourceLabel — dùng cho bộ lọc ở trang Đề mẫu
}

// Độ khó ước lượng của 1 đề (không quy ra band: mỗi đề chỉ ~13-14 câu nên không đủ để chấm band). Đánh giá theo độ
// dài / độ học thuật của bài đọc, dạng câu hỏi (heading, Y/N/NG, trắc nghiệm suy luận khó hơn điền từ, T/F/NG
// thông tin) và mức độ bẫy của đáp án.
export type Difficulty = 'easy' | 'medium' | 'hard'

export const DIFFICULTY_LABEL: Record<Difficulty, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' }

export function flatQuestions(test: PracticeTest): PracticeQuestion[] {
  return test.groups.flatMap((g) => g.questions)
}

export function isCorrect(q: PracticeQuestion, given: string | undefined): boolean {
  if (!given) return false
  const g = given.trim().toLowerCase()
  return [q.answer, ...(q.alt ?? [])].some((a) => a.trim().toLowerCase() === g)
}

// ── Lưu ở trình duyệt (localStorage) + đồng bộ lên database ─────────────────────
// localStorage vẫn là bộ nhớ đệm đọc/ghi đồng bộ cho UI; mỗi lần ghi được đẩy nền lên DB và khi vào /ielts
// dữ liệu từ DB được trộn ngược về localStorage trước khi hiển thị — xem practiceSync.ts. Nhờ đó điểm/bài
// làm dở/từ đã thuộc theo người dùng, dùng được trên nhiều máy, mà chữ ký các hàm dưới đây không đổi.
function readJson<T>(key: string): Record<string, T> {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as Record<string, T>) : {}
  } catch {
    return {}
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    markDirty(key)
  } catch {
    // localStorage đầy/bị chặn: bỏ qua, dữ liệu chỉ không được nhớ.
  }
}

// Mỗi lần nộp bài (kèm đáp án đã chọn để trang "Xem giải thích" đối chiếu được).
export interface AttemptRecord {
  score: number
  total: number
  at: string // ISO
  mode: PracticeMode
  answers: Record<string, string>
}

// Điểm cao nhất mỗi đề → hiện "Best score" + trạng thái "đã làm"; history = các lần nộp (mới nhất ở cuối).
export interface Attempt {
  best: number
  total: number
  lastAt: string
  history?: AttemptRecord[] // thiếu ở dữ liệu cũ (trước khi có lịch sử)
}

const ATTEMPTS_KEY = PRACTICE_KEYS.attempts
const MAX_HISTORY = 30

export function loadAttempts(): Record<string, Attempt> {
  return readJson<Attempt>(ATTEMPTS_KEY)
}

export function saveAttempt(testId: string, record: Omit<AttemptRecord, 'at'>): void {
  const all = loadAttempts()
  const prev = all[testId]
  const at = new Date().toISOString()
  all[testId] = {
    best: Math.max(prev?.best ?? 0, record.score),
    total: record.total,
    lastAt: at,
    history: [...(prev?.history ?? []), { ...record, at }].slice(-MAX_HISTORY),
  }
  writeJson(ATTEMPTS_KEY, all)
}

// Bài đang làm dở (chưa nộp): đáp án + mốc giờ kết thúc (chỉ thi thật). Lưu MỐC GIỜ chứ không lưu số
// giây còn lại để F5 / thoát ra vào lại đồng hồ vẫn chạy tiếp đúng — không reset được để "câu giờ".
export interface Draft {
  mode: PracticeMode
  answers: Record<string, string>
  deadline: number | null // epoch ms
  flags?: string[] // id các câu đã đánh dấu cờ để xem lại
}

const DRAFTS_KEY = PRACTICE_KEYS.drafts

export function loadDrafts(): Record<string, Draft> {
  return readJson<Draft>(DRAFTS_KEY)
}

export function saveDraft(testId: string, draft: Draft): void {
  const all = loadDrafts()
  all[testId] = draft
  writeJson(DRAFTS_KEY, all)
}

export function clearDraft(testId: string): void {
  const all = loadDrafts()
  if (!(testId in all)) return
  delete all[testId]
  writeJson(DRAFTS_KEY, all)
}

// Highlight / ghi chú trên bài đọc, theo từng đề. Vị trí tính bằng ký tự trong đoạn văn `para` (đoạn thứ
// mấy của test.passage), [start, end). `note` có giá trị = highlight kèm ghi chú.
export interface Highlight {
  id: string
  para: number
  start: number
  end: number
  color: string
  note?: string
}

const NOTES_KEY = PRACTICE_KEYS.notes

export function loadHighlights(testId: string): Highlight[] {
  return readJson<Highlight[]>(NOTES_KEY)[testId] ?? []
}

export function saveHighlights(testId: string, list: Highlight[]): void {
  const all = readJson<Highlight[]>(NOTES_KEY)
  if (list.length === 0) delete all[testId]
  else all[testId] = list
  writeJson(NOTES_KEY, all)
}

// Tuỳ chọn hiển thị của màn làm bài (nhớ giữa các đề): chế độ tối, cỡ chữ, xếp dọc thay vì chia đôi.
export interface RunPrefs {
  dark: boolean
  fontStep: number // -1..3, mỗi bậc ±12% cỡ chữ
  stack: boolean
  split: number // % chiều rộng cột trái (bài đọc) khi chia đôi, 25–75
}

export const DEFAULT_PREFS: RunPrefs = { dark: false, fontStep: 0, stack: false, split: 50 }
const PREFS_KEY = PRACTICE_KEYS.prefs

export function loadPrefs(): RunPrefs {
  return { ...DEFAULT_PREFS, ...(readJson<unknown>(PREFS_KEY).v as Partial<RunPrefs> | undefined) }
}

export function savePrefs(p: RunPrefs): void {
  writeJson(PREFS_KEY, { v: p })
}

// Từ đã thuộc của từng Vocab set (testId → danh sách từ).
const LEARNED_KEY = PRACTICE_KEYS.learned

export function loadLearned(): Record<string, string[]> {
  return readJson<string[]>(LEARNED_KEY)
}

export function saveLearned(testId: string, words: string[]): void {
  const all = loadLearned()
  all[testId] = words
  writeJson(LEARNED_KEY, all)
}

// Các câu đã làm ĐÚNG của từng bộ Bài tập ghép câu (setId → id câu) — cùng cách lưu với "Đã thuộc" ở Vocab.
const EXERCISE_PROGRESS_KEY = PRACTICE_KEYS.exerciseProgress

export function loadExerciseProgress(): Record<string, string[]> {
  return readJson<string[]>(EXERCISE_PROGRESS_KEY)
}

export function saveExerciseProgress(setId: string, solvedQuestionIds: string[]): void {
  const all = loadExerciseProgress()
  all[setId] = solvedQuestionIds
  writeJson(EXERCISE_PROGRESS_KEY, all)
}

export type SetStatus = 'todo' | 'doing' | 'done'
