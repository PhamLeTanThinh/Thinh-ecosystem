// "Bảng chữ cái" (/korean/hangul) — phần 한글 배우기 (Learning the Korean alphabet) ở đầu sách 서울대 한국어 1A
// (trang 24–51, trước Bài 1). Không phải thẻ để ôn/quiz nên không lưu DB, cùng convention với lib/chinese/phonetics.ts
// (nội dung vỡ lòng lưu thẳng trong code). Bảng ghép âm tiết không liệt kê tay mà tính bằng công thức Unicode
// (composeSyllable) nên luôn đúng chữ.

export interface HangulLetter {
  char: string
  ipa: string // âm vị theo sách, vd "[k/g]"
  vi: string // gợi ý đọc cho người Việt
  say: string // âm tiết để máy đọc (đọc thẳng 1 chữ cái rời thì TTS đọc TÊN chữ, vd ㄱ → "기역")
}

export interface HangulWord {
  ko: string
  vi: string
}

export type HangulBlock =
  | { kind: 'text'; title: string; paragraphs: string[]; bullets?: string[] }
  | { kind: 'letters'; title: string; intro?: string; tip?: string; letters: HangulLetter[] }
  | { kind: 'syllables'; title: string; intro?: string; consonants: string[]; vowels: string[] }
  | { kind: 'words'; title: string; intro?: string; words: HangulWord[] }
  | { kind: 'vowelPrinciple'; title: string; intro: string; basics: VowelBasic[]; groups: { title: string; note: string; items: VowelDerived[] }[]; footnote: string }
  | { kind: 'consonantPrinciple'; title: string; intro: string; rows: ConsonantClass[]; extras: { title: string; text: string; chars: string[] }[] }
  | { kind: 'structure'; title: string; items: { label: string; pattern: string; examples: string[]; note: string }[] }
  | { kind: 'compare'; title: string; intro: string; rows: { plain: string; aspirated: string; tense: string }[] }
  | { kind: 'batchim'; title: string; intro: string; groups: { finals: string; ipa: string; vi: string; examples: string[] }[] }
  | { kind: 'reading'; title: string; intro: string; lines: string[][] }
  | { kind: 'builder'; title: string; intro: string }

// Nguyên âm gốc (기본자) theo 훈민정음 해례본: ㆍ trời, ㅡ đất, ㅣ người.
export interface VowelBasic {
  char: string
  shape: 'dot' | 'h' | 'v'
  meaning: string
  desc: string
}

// Nguyên âm phái sinh: thêm 1 (초출자) hoặc 2 (재출자) chấm vào ㅡ hoặc ㅣ. `side` là vị trí chấm so với nét dài.
export interface VowelDerived {
  char: string
  base: 'h' | 'v' // ㅡ (ngang) hay ㅣ (dọc)
  side: 'top' | 'bottom' | 'right' | 'left'
  dots: 1 | 2
  yang: boolean // dương (chấm trên / ngoài) hay âm (chấm dưới / trong)
}

// 1 nhóm phụ âm theo vị trí phát âm: chữ gốc (상형) rồi thêm nét (가획) cho âm mạnh hơn.
export interface ConsonantClass {
  group: string // vd "아음 (âm lưỡi gốc)"
  basic: string
  organ: string // chữ gốc mô phỏng cái gì
  chain: string[] // gồm cả chữ gốc, vd ['ㄴ', 'ㄷ', 'ㅌ']
  note?: string
}

export interface HangulLesson {
  number: number
  label: string // nhãn tab
  title: string
  titleKo: string
  pages: [number, number]
  intro: string
  blocks: HangulBlock[]
}

// Thứ tự Unicode của phụ âm đầu / nguyên âm / phụ âm cuối — dùng cho composeSyllable.
export const INITIALS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
export const MEDIALS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ']
export const FINALS = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

// Ghép phụ âm đầu + nguyên âm (+ phụ âm cuối) thành 1 âm tiết: 0xAC00 + (đầu × 21 + giữa) × 28 + cuối.
export function composeSyllable(initial: string, medial: string, final = ''): string {
  const i = INITIALS.indexOf(initial)
  const m = MEDIALS.indexOf(medial)
  const f = FINALS.indexOf(final)
  if (i < 0 || m < 0 || f < 0) return ''
  return String.fromCharCode(0xac00 + (i * 21 + m) * 28 + f)
}

const BASIC_VOWELS: HangulLetter[] = [
  { char: 'ㅏ', ipa: '[a]', vi: 'a', say: '아' },
  { char: 'ㅓ', ipa: '[ə]', vi: 'ơ (miệng mở rộng hơn "ơ" tiếng Việt)', say: '어' },
  { char: 'ㅗ', ipa: '[o]', vi: 'ô (tròn môi)', say: '오' },
  { char: 'ㅜ', ipa: '[u]', vi: 'u', say: '우' },
  { char: 'ㅡ', ipa: '[ɨ]', vi: 'ư', say: '으' },
  { char: 'ㅣ', ipa: '[i]', vi: 'i', say: '이' },
]

const BASIC_CONSONANTS: HangulLetter[] = [
  { char: 'ㄱ', ipa: '[k/g]', vi: 'k ở đầu từ, g khi ở giữa hai nguyên âm (아기)', say: '가' },
  { char: 'ㄴ', ipa: '[n]', vi: 'n', say: '나' },
  { char: 'ㄷ', ipa: '[t/d]', vi: 't ở đầu từ, đ khi ở giữa từ (구두)', say: '다' },
  { char: 'ㄹ', ipa: '[r/l]', vi: 'r nhẹ (lướt lưỡi) ở đầu âm tiết, l ở cuối', say: '라' },
  { char: 'ㅁ', ipa: '[m]', vi: 'm', say: '마' },
  { char: 'ㅂ', ipa: '[p/b]', vi: 'p ở đầu từ, b khi ở giữa từ (아버지)', say: '바' },
  { char: 'ㅅ', ipa: '[s]', vi: 'x; trước ㅣ, ㅑ, ㅕ… đọc gần "sh" (시)', say: '사' },
  { char: 'ㅇ', ipa: '[∅/ŋ]', vi: 'câm khi đứng đầu âm tiết, đọc "ng" khi là patchim', say: '아' },
  { char: 'ㅈ', ipa: '[tʃ/dʒ]', vi: 'ch nhẹ, giữa từ gần "j" (바지)', say: '자' },
  { char: 'ㅎ', ipa: '[h]', vi: 'h', say: '하' },
]

export const HANGUL_LESSONS: HangulLesson[] = [
  {
    number: 0,
    label: 'Tổng quan',
    title: 'Giới thiệu chữ Hangul',
    titleKo: '한글 개관',
    pages: [26, 30],
    intro: 'Chữ Hangul gồm 19 phụ âm và 21 nguyên âm. Mỗi âm tiết là một khối vuông ghép từ phụ âm và nguyên âm, nắm được quy tắc ghép là đọc được mọi chữ.',
    blocks: [
      {
        kind: 'text',
        title: '📜 Lịch sử ra đời',
        paragraphs: [
          'Hangul (한글) được vua Sejong (세종대왕) cùng các học giả Tập Hiền điện (집현전) tạo ra năm 1443, và công bố năm 1446 qua cuốn 훈민정음 (Huấn dân chính âm, nghĩa là "âm chuẩn để dạy dân"). Cuốn này được UNESCO công nhận là Di sản Tư liệu Thế giới năm 1997.',
          'Trước đó người Hàn mượn chữ Hán để viết. Chữ Hán khó học nên chỉ tầng lớp quý tộc biết chữ. Vua Sejong tạo ra Hangul để dân thường dễ học, dễ viết, giảm nạn mù chữ.',
          'Ban đầu có 28 chữ (17 phụ âm, 11 nguyên âm). Về sau 4 chữ bị bỏ, hiện nay dùng 24 chữ cơ bản. Ngày 9/10 hằng năm là Ngày Hangul (한글날) ở Hàn Quốc.',
        ],
      },
      {
        kind: 'vowelPrinciple',
        title: '✍️ Nguyên lý tạo nguyên âm',
        intro: 'Theo 훈민정음 해례본 (1446), nguyên âm dựng từ 3 chữ gốc mô phỏng 天 trời, 地 đất, 人 người. Các nguyên âm khác tạo bằng cách thêm 1 hoặc 2 CHẤM ㆍ vào ㅡ hoặc ㅣ. Vị trí chấm quyết định chữ.',
        basics: [
          { char: 'ㆍ', shape: 'dot', meaning: 'Trời (天)', desc: 'Tròn như bầu trời. Ngày nay không còn dùng riêng (bị bỏ năm 1933), chỉ còn là nét trong các nguyên âm khác.' },
          { char: 'ㅡ', shape: 'h', meaning: 'Đất (地)', desc: 'Phẳng như mặt đất.' },
          { char: 'ㅣ', shape: 'v', meaning: 'Người (人)', desc: 'Người đứng thẳng giữa trời và đất.' },
        ],
        groups: [
          {
            title: '초출자 — thêm 1 chấm',
            note: 'Chấm nằm TRÊN ㅡ hoặc BÊN NGOÀI (phải) ㅣ là nguyên âm dương (양): ㅗ ㅏ. Chấm nằm DƯỚI ㅡ hoặc BÊN TRONG (trái) ㅣ là nguyên âm âm (음): ㅜ ㅓ.',
            items: [
              { char: 'ㅗ', base: 'h', side: 'top', dots: 1, yang: true },
              { char: 'ㅏ', base: 'v', side: 'right', dots: 1, yang: true },
              { char: 'ㅜ', base: 'h', side: 'bottom', dots: 1, yang: false },
              { char: 'ㅓ', base: 'v', side: 'left', dots: 1, yang: false },
            ],
          },
          {
            title: '재출자 — thêm 2 chấm',
            note: 'Thêm chấm thứ hai = thêm âm [y] phía trước: ㅗ → ㅛ, ㅏ → ㅑ, ㅜ → ㅠ, ㅓ → ㅕ.',
            items: [
              { char: 'ㅛ', base: 'h', side: 'top', dots: 2, yang: true },
              { char: 'ㅑ', base: 'v', side: 'right', dots: 2, yang: true },
              { char: 'ㅠ', base: 'h', side: 'bottom', dots: 2, yang: false },
              { char: 'ㅕ', base: 'v', side: 'left', dots: 2, yang: false },
            ],
          },
        ],
        footnote: 'Bản gốc viết đúng là chấm tròn. Về sau, khi viết bằng bút lông, chấm kéo dài thành gạch ngắn, nên chữ ngày nay có gạch thay cho chấm. Các nguyên âm còn lại (ㅐ ㅔ ㅘ ㅝ ㅢ…) ghép từ những chữ trên.',
      },
      {
        kind: 'consonantPrinciple',
        title: '👄 Nguyên lý tạo phụ âm',
        intro: 'Theo 훈민정음 해례본, có 5 phụ âm gốc vẽ theo HÌNH DẠNG cơ quan phát âm khi đọc âm đó (상형). Âm cùng vị trí nhưng mạnh hơn thì THÊM NÉT vào chữ gốc (가획).',
        rows: [
          { group: '아음 · âm gốc lưỡi', basic: 'ㄱ', organ: 'Gốc lưỡi nâng lên chặn cuống họng', chain: ['ㄱ', 'ㅋ'] },
          { group: '설음 · âm đầu lưỡi', basic: 'ㄴ', organ: 'Đầu lưỡi chạm lợi trên', chain: ['ㄴ', 'ㄷ', 'ㅌ'] },
          { group: '순음 · âm môi', basic: 'ㅁ', organ: 'Hình cái miệng', chain: ['ㅁ', 'ㅂ', 'ㅍ'] },
          { group: '치음 · âm răng', basic: 'ㅅ', organ: 'Hình chiếc răng', chain: ['ㅅ', 'ㅈ', 'ㅊ'] },
          { group: '후음 · âm cổ họng', basic: 'ㅇ', organ: 'Hình cái cổ họng (tròn)', chain: ['ㅇ', 'ㅎ'], note: 'Bản gốc có chữ trung gian ㆆ (ㅇ → ㆆ → ㅎ), nay đã bỏ.' },
        ],
        extras: [
          { title: 'Chữ dị thể (이체자)', text: 'ㄹ thêm nét từ ㄴ nhưng không mạnh hơn, nên tính là chữ khác thể.', chars: ['ㄹ'] },
          { title: 'Nhân đôi (병서) → phụ âm căng', text: 'Viết chữ gốc hai lần liền nhau.', chars: ['ㄲ', 'ㄸ', 'ㅃ', 'ㅆ', 'ㅉ'] },
        ],
      },
      {
        kind: 'structure',
        title: '🧱 4 kiểu cấu trúc âm tiết',
        items: [
          { label: 'V', pattern: 'nguyên âm', examples: ['아', '오'], note: 'Âm tiết bắt đầu bằng nguyên âm phải viết thêm ㅇ (câm) ở vị trí phụ âm đầu.' },
          { label: 'CV', pattern: 'phụ âm + nguyên âm', examples: ['가', '구'], note: 'Kiểu cơ bản nhất.' },
          { label: 'VC', pattern: 'nguyên âm + phụ âm cuối', examples: ['안', '옷'], note: 'Vẫn cần ㅇ câm ở đầu, phụ âm cuối (patchim) viết ở dưới.' },
          { label: 'CVC', pattern: 'phụ âm + nguyên âm + phụ âm cuối', examples: ['강', '곰'], note: 'Patchim luôn nằm dưới cùng của khối chữ.' },
        ],
      },
      {
        kind: 'text',
        title: '📐 Quy tắc viết',
        paragraphs: ['Hangul không viết các chữ cái thành hàng ngang như tiếng Anh hay tiếng Việt, mà ghép thành từng khối âm tiết: ㅇ ㅏ ㅇ ㅣ → 아이, ㄱ ㅏ ㄱ ㅜ → 가구.'],
        bullets: [
          'Nguyên âm DỌC (ㅏ ㅓ ㅣ ㅐ…): phụ âm đứng BÊN TRÁI — 나, 너, 며.',
          'Nguyên âm NGANG (ㅗ ㅜ ㅡ ㅛ…): phụ âm đứng PHÍA TRÊN — 고, 부.',
          'Âm tiết bắt đầu bằng nguyên âm: thêm ㅇ (không đọc) vào chỗ phụ âm đầu — 아, 오.',
          'Phụ âm cuối (patchim) luôn viết ở DƯỚI nguyên âm — 안, 발, 옷, 곰.',
          'Thứ tự nét: từ trên xuống dưới, từ trái sang phải.',
        ],
      },
      {
        kind: 'builder',
        title: '🧪 Thử ghép âm tiết',
        intro: 'Chọn phụ âm đầu, nguyên âm và phụ âm cuối (có thể bỏ trống) để xem khối chữ ghép thành và nghe cách đọc.',
      },
    ],
  },
  {
    number: 1,
    label: 'Hangul 1',
    title: 'Nguyên âm cơ bản và phụ âm cơ bản',
    titleKo: '한글 1',
    pages: [31, 35],
    intro: '6 nguyên âm cơ bản và 10 phụ âm cơ bản. Học xong bài này là ghép được 60 âm tiết đầu tiên.',
    blocks: [
      { kind: 'letters', title: '🔡 Nguyên âm (1)', intro: 'Đứng một mình thì viết kèm ㅇ câm: 아 어 오 우 으 이.', letters: BASIC_VOWELS },
      {
        kind: 'words',
        title: '📖 Đọc thử',
        words: [
          { ko: '오', vi: 'số 5' },
          { ko: '이', vi: 'răng' },
          { ko: '아우', vi: 'em' },
          { ko: '아이', vi: 'đứa trẻ' },
          { ko: '오이', vi: 'dưa chuột' },
        ],
      },
      {
        kind: 'letters',
        title: '🔠 Phụ âm (1)',
        intro: 'Phụ âm không đọc riêng được, nên nút nghe đọc phụ âm ghép với ㅏ: 가 나 다 라 마 바 사 아 자 하.',
        letters: BASIC_CONSONANTS,
      },
      { kind: 'syllables', title: '📋 Bảng ghép âm', intro: 'Phụ âm (cột trái) + nguyên âm (hàng trên). Bấm vào ô để nghe.', consonants: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅎ'], vowels: ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ'] },
      {
        kind: 'words',
        title: '📖 Đọc thử',
        words: [
          { ko: '가수', vi: 'ca sĩ' },
          { ko: '고기', vi: 'thịt' },
          { ko: '구두', vi: 'giày da' },
          { ko: '나라', vi: 'đất nước' },
          { ko: '나무', vi: 'cây' },
          { ko: '다리', vi: 'chân' },
          { ko: '라디오', vi: 'radio' },
          { ko: '머리', vi: 'đầu' },
          { ko: '바나나', vi: 'chuối' },
          { ko: '바지', vi: 'quần' },
          { ko: '소', vi: 'con bò' },
          { ko: '아기', vi: 'em bé' },
          { ko: '어머니', vi: 'mẹ' },
          { ko: '지도', vi: 'bản đồ' },
          { ko: '모자', vi: 'mũ' },
          { ko: '아버지', vi: 'bố' },
          { ko: '허리', vi: 'eo' },
          { ko: '지하', vi: 'dưới lòng đất' },
        ],
      },
      {
        kind: 'reading',
        title: '👓 Luyện đọc tổng hợp',
        intro: 'Bảng đo thị lực trong sách: đọc lần lượt từng dòng, chữ nhỏ dần. Bấm một chữ để nghe.',
        lines: [
          ['너', '오', '그'],
          ['두', '사', '어', '누'],
          ['으', '로', '마', '저', '비'],
          ['호', '누', '이', '다', '미', '소'],
          ['자', '오', '리', '구', '서', '모', '바', '느', '후'],
          ['소', '나', '드', '로', '마', '버', '스', '지', '하', '모', '이'],
          ['도', '자', '기', '구', '시', '소', '너', '머', '시', '로', '더', '허'],
        ],
      },
    ],
  },
  {
    number: 2,
    label: 'Hangul 2',
    title: 'Nguyên âm có "y", phụ âm bật hơi và phụ âm căng',
    titleKo: '한글 2',
    pages: [36, 42],
    intro: 'Thêm 4 nguyên âm ghép với [y] và 9 phụ âm biến thể. Ba dãy phụ âm thường, bật hơi, căng là chỗ người Việt hay đọc nhầm nhất.',
    blocks: [
      {
        kind: 'letters',
        title: '🔡 Nguyên âm (2)',
        tip: 'Đọc [이] thật ngắn và nhẹ rồi nối ngay sang [아, 어, 오, 우], không ngắt quãng: 이+아 → 야.',
        letters: [
          { char: 'ㅑ', ipa: '[ya]', vi: 'ya', say: '야' },
          { char: 'ㅕ', ipa: '[yə]', vi: 'yơ', say: '여' },
          { char: 'ㅛ', ipa: '[yo]', vi: 'yô', say: '요' },
          { char: 'ㅠ', ipa: '[yu]', vi: 'yu', say: '유' },
        ],
      },
      { kind: 'syllables', title: '📋 Bảng ghép âm', intro: 'Bấm vào ô để nghe.', consonants: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅈ', 'ㅎ'], vowels: ['ㅑ', 'ㅕ', 'ㅛ', 'ㅠ'] },
      {
        kind: 'words',
        title: '📖 Đọc thử',
        words: [
          { ko: '야구', vi: 'bóng chày' },
          { ko: '야자수', vi: 'cây dừa' },
          { ko: '이야기', vi: 'câu chuyện' },
          { ko: '여자', vi: 'phụ nữ' },
          { ko: '벼', vi: 'cây lúa' },
          { ko: '혀', vi: 'lưỡi' },
          { ko: '요가', vi: 'yoga' },
          { ko: '요리', vi: 'nấu ăn' },
          { ko: '교수', vi: 'giáo sư' },
          { ko: '유리', vi: 'thuỷ tinh' },
          { ko: '휴지', vi: 'giấy vệ sinh' },
          { ko: '우유', vi: 'sữa' },
        ],
      },
      {
        kind: 'letters',
        title: '💨 Phụ âm bật hơi (2)',
        tip: 'Là ㄱ, ㄷ, ㅂ, ㅈ cộng thêm [ㅎ]: đẩy mạnh luồng hơi ra ngoài. Thử đặt tờ giấy trước miệng, đọc đúng thì tờ giấy rung.',
        letters: [
          { char: 'ㅋ', ipa: '[kʰ]', vi: 'kh bật hơi (khác "kh" tiếng Việt, không xát)', say: '카' },
          { char: 'ㅌ', ipa: '[tʰ]', vi: 'th (như "th" tiếng Việt)', say: '타' },
          { char: 'ㅍ', ipa: '[pʰ]', vi: 'p bật hơi mạnh (KHÔNG phải "ph" = f)', say: '파' },
          { char: 'ㅊ', ipa: '[tʃʰ]', vi: 'ch bật hơi', say: '차' },
        ],
      },
      { kind: 'syllables', title: '📋 Bảng ghép âm', consonants: ['ㅋ', 'ㅌ', 'ㅍ', 'ㅊ'], vowels: ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ'] },
      {
        kind: 'words',
        title: '📖 Đọc thử',
        words: [
          { ko: '카드', vi: 'thẻ, thiệp' },
          { ko: '코', vi: 'mũi' },
          { ko: '키', vi: 'chiều cao' },
          { ko: '타조', vi: 'đà điểu' },
          { ko: '토마토', vi: 'cà chua' },
          { ko: '투우사', vi: 'đấu sĩ bò tót' },
          { ko: '파리', vi: 'con ruồi' },
          { ko: '포도', vi: 'nho' },
          { ko: '우표', vi: 'tem thư' },
          { ko: '차', vi: 'trà' },
          { ko: '치마', vi: 'váy' },
          { ko: '고추', vi: 'ớt' },
          { ko: '커피', vi: 'cà phê' },
          { ko: '코트', vi: 'áo khoác' },
          { ko: '기차표', vi: 'vé tàu' },
        ],
      },
      {
        kind: 'letters',
        title: '💪 Phụ âm căng (3)',
        tip: 'Là ㄱ, ㄷ, ㅂ, ㅅ, ㅈ đọc với cổ họng căng, KHÔNG bật hơi. Người Việt đọc gần đúng nhất khi phát âm như "c, t, b" tiếng Việt nhưng dứt khoát, mạnh hơn.',
        letters: [
          { char: 'ㄲ', ipa: "[k']", vi: 'c / k căng (như "c" tiếng Việt, mạnh)', say: '까' },
          { char: 'ㄸ', ipa: "[t']", vi: 't căng (như "t" tiếng Việt, mạnh)', say: '따' },
          { char: 'ㅃ', ipa: "[p']", vi: 'p căng (giữa "b" và "p")', say: '빠' },
          { char: 'ㅆ', ipa: "[s']", vi: 'x căng, rít mạnh', say: '싸' },
          { char: 'ㅉ', ipa: "[tʃ']", vi: 'ch căng', say: '짜' },
        ],
      },
      { kind: 'syllables', title: '📋 Bảng ghép âm', consonants: ['ㄲ', 'ㄸ', 'ㅃ', 'ㅆ', 'ㅉ'], vowels: ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ'] },
      {
        kind: 'compare',
        title: '⚖️ Phân biệt thường – bật hơi – căng',
        intro: 'Cùng vị trí phát âm, khác ở luồng hơi và độ căng. Bấm từng chữ, nghe 3 chữ cùng hàng liên tiếp để thấy sự khác nhau.',
        rows: [
          { plain: '가', aspirated: '카', tense: '까' },
          { plain: '다', aspirated: '타', tense: '따' },
          { plain: '바', aspirated: '파', tense: '빠' },
          { plain: '자', aspirated: '차', tense: '짜' },
          { plain: '사', aspirated: '', tense: '싸' },
        ],
      },
      {
        kind: 'words',
        title: '📖 Đọc thử',
        words: [
          { ko: '까치', vi: 'chim ác là' },
          { ko: '꼬리', vi: 'cái đuôi' },
          { ko: '코끼리', vi: 'con voi' },
          { ko: '따다', vi: 'hái' },
          { ko: '뜨다', vi: 'nổi' },
          { ko: '머리띠', vi: 'bờm tóc' },
          { ko: '뿌리', vi: 'rễ cây' },
          { ko: '뼈', vi: 'xương' },
          { ko: '아빠', vi: 'bố' },
          { ko: '싸다', vi: 'rẻ' },
          { ko: '쓰다', vi: 'viết' },
          { ko: '아저씨', vi: 'chú' },
          { ko: '짜다', vi: 'mặn' },
          { ko: '찌다', vi: 'hấp' },
          { ko: '가짜', vi: 'đồ giả' },
        ],
      },
    ],
  },
  {
    number: 3,
    label: 'Hangul 3',
    title: 'Nguyên âm ghép và phụ âm cuối (patchim)',
    titleKo: '한글 3',
    pages: [43, 51],
    intro: '11 nguyên âm ghép còn lại và cách đọc phụ âm cuối. Có nhiều patchim nhưng chỉ đọc thành 7 âm.',
    blocks: [
      {
        kind: 'letters',
        title: '🔡 Nguyên âm (3)',
        tip: 'ㅐ và ㅔ ngày nay đọc gần như giống nhau ("e/ê"), ㅙ, ㅞ, ㅚ cũng gần như cùng âm [we]. Chỉ cần nhớ cách viết đúng từng từ.',
        letters: [
          { char: 'ㅐ', ipa: '[ɛ]', vi: 'e', say: '애' },
          { char: 'ㅔ', ipa: '[e]', vi: 'ê', say: '에' },
          { char: 'ㅒ', ipa: '[yɛ]', vi: 'ye', say: '얘' },
          { char: 'ㅖ', ipa: '[ye]', vi: 'yê', say: '예' },
          { char: 'ㅘ', ipa: '[wa]', vi: 'oa', say: '와' },
          { char: 'ㅝ', ipa: '[wə]', vi: 'uơ', say: '워' },
          { char: 'ㅙ', ipa: '[wɛ]', vi: 'oe', say: '왜' },
          { char: 'ㅞ', ipa: '[we]', vi: 'uê', say: '웨' },
          { char: 'ㅚ', ipa: '[ö/we]', vi: 'uê', say: '외' },
          { char: 'ㅟ', ipa: '[ü/wi]', vi: 'uy', say: '위' },
          { char: 'ㅢ', ipa: '[ɰi]', vi: 'ưi (đọc liền ư → i)', say: '의' },
        ],
      },
      {
        kind: 'text',
        title: '📌 Lưu ý cách đọc ㅢ',
        paragraphs: ['ㅢ đổi cách đọc tuỳ vị trí:'],
        bullets: [
          'Đứng đầu từ: đọc [의] — 의사 (bác sĩ), 의자 (ghế).',
          'Không đứng đầu từ: thường đọc [이] — 회의 → [회이], 여의도 → [여이도].',
          'Đi sau phụ âm: đọc [이] — 희망 → [히망].',
          'Là trợ từ sở hữu 의 ("của"): thường đọc [에] — 나의 → [나에].',
        ],
      },
      { kind: 'syllables', title: '📋 Bảng ghép âm', intro: 'Bấm vào ô để nghe.', consonants: ['ㄱ', 'ㄴ', 'ㄷ', 'ㅁ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅎ'], vowels: ['ㅐ', 'ㅔ', 'ㅘ', 'ㅝ', 'ㅚ', 'ㅟ', 'ㅢ'] },
      {
        kind: 'words',
        title: '📖 Đọc thử',
        words: [
          { ko: '개미', vi: 'con kiến' },
          { ko: '배', vi: 'thuyền' },
          { ko: '새', vi: 'con chim' },
          { ko: '해', vi: 'mặt trời' },
          { ko: '게', vi: 'con cua' },
          { ko: '세수', vi: 'rửa mặt' },
          { ko: '그네', vi: 'xích đu' },
          { ko: '카메라', vi: 'máy ảnh' },
          { ko: '얘기', vi: 'câu chuyện' },
          { ko: '예쁘다', vi: 'đẹp' },
          { ko: '서예', vi: 'thư pháp' },
          { ko: '시계', vi: 'đồng hồ' },
          { ko: '과자', vi: 'bánh kẹo' },
          { ko: '와이셔츠', vi: 'áo sơ mi' },
          { ko: '화가', vi: 'hoạ sĩ' },
          { ko: '사과', vi: 'quả táo' },
          { ko: '뭐', vi: 'cái gì' },
          { ko: '줘요', vi: 'đưa cho' },
          { ko: '더워요', vi: 'nóng' },
          { ko: '추워요', vi: 'lạnh' },
          { ko: '돼지', vi: 'con lợn' },
          { ko: '왜', vi: 'tại sao' },
          { ko: '웨이터', vi: 'bồi bàn' },
          { ko: '스웨터', vi: 'áo len' },
          { ko: '쇠고기', vi: 'thịt bò' },
          { ko: '외우다', vi: 'học thuộc' },
          { ko: '회사', vi: 'công ty' },
          { ko: '두뇌', vi: 'bộ não' },
          { ko: '귀', vi: 'tai' },
          { ko: '쉬다', vi: 'nghỉ ngơi' },
          { ko: '쥐', vi: 'con chuột' },
          { ko: '가위', vi: 'cái kéo' },
          { ko: '의사', vi: 'bác sĩ' },
          { ko: '의자', vi: 'cái ghế' },
          { ko: '여의도', vi: 'đảo Yeouido' },
          { ko: '회의', vi: 'cuộc họp' },
        ],
      },
      {
        kind: 'batchim',
        title: '🔚 Phụ âm cuối (patchim)',
        intro: 'Phụ âm viết dưới nguyên âm gọi là patchim (받침). Dù có nhiều chữ, khi đứng cuối âm tiết chỉ đọc thành 7 âm. Âm [k], [t], [p] cuối không bật ra, chỉ ngậm lại (như "các", "mát", "đáp" tiếng Việt).',
        groups: [
          { finals: 'ㄱ, ㅋ, ㄲ', ipa: '[k̚]', vi: 'như "c" cuối: các', examples: ['벽', '부엌', '밖'] },
          { finals: 'ㄴ', ipa: '[n]', vi: 'như "n" cuối: an', examples: ['눈'] },
          { finals: 'ㄷ, ㅌ, ㅅ, ㅆ, ㅈ, ㅊ, ㅎ', ipa: '[t̚]', vi: 'như "t" cuối: át', examples: ['곧', '밑', '옷', '낮', '꽃', '히읗'] },
          { finals: 'ㄹ', ipa: '[l]', vi: '"l" cuối, cong đầu lưỡi', examples: ['달'] },
          { finals: 'ㅁ', ipa: '[m]', vi: 'như "m" cuối: am', examples: ['곰'] },
          { finals: 'ㅂ, ㅍ', ipa: '[p̚]', vi: 'như "p" cuối: áp', examples: ['집', '잎'] },
          { finals: 'ㅇ', ipa: '[ŋ]', vi: 'như "ng" cuối: ang', examples: ['방'] },
        ],
      },
      {
        kind: 'words',
        title: '✍️ Ghép patchim',
        intro: 'Theo bài tập viết trong sách: âm tiết + phụ âm cuối.',
        words: [
          { ko: '벽', vi: 'bức tường (벼 + ㄱ)' },
          { ko: '밖', vi: 'bên ngoài (바 + ㄲ)' },
          { ko: '눈', vi: 'mắt (누 + ㄴ)' },
          { ko: '산', vi: 'núi (사 + ㄴ)' },
          { ko: '밑', vi: 'bên dưới (미 + ㅌ)' },
          { ko: '옷', vi: 'quần áo (오 + ㅅ)' },
          { ko: '낮', vi: 'ban ngày (나 + ㅈ)' },
          { ko: '꽃', vi: 'hoa (꼬 + ㅊ)' },
          { ko: '달', vi: 'mặt trăng (다 + ㄹ)' },
          { ko: '물', vi: 'nước (무 + ㄹ)' },
          { ko: '곰', vi: 'con gấu (고 + ㅁ)' },
          { ko: '삼', vi: 'số 3 (사 + ㅁ)' },
          { ko: '집', vi: 'nhà (지 + ㅂ)' },
          { ko: '숲', vi: 'rừng (수 + ㅍ)' },
          { ko: '공', vi: 'quả bóng (고 + ㅇ)' },
          { ko: '방', vi: 'căn phòng (바 + ㅇ)' },
        ],
      },
      {
        kind: 'words',
        title: '📖 Đọc thử',
        words: [
          { ko: '수박', vi: 'dưa hấu' },
          { ko: '책', vi: 'sách' },
          { ko: '부엌', vi: 'nhà bếp' },
          { ko: '돈', vi: 'tiền' },
          { ko: '레몬', vi: 'chanh vàng' },
          { ko: '신문', vi: 'báo' },
          { ko: '우산', vi: 'ô (dù)' },
          { ko: '곧', vi: 'sắp, ngay' },
          { ko: '빗', vi: 'cái lược' },
          { ko: '빛', vi: 'ánh sáng' },
          { ko: '히읗', vi: 'tên chữ ㅎ' },
          { ko: '딸기', vi: 'dâu tây' },
          { ko: '발', vi: 'bàn chân' },
          { ko: '연필', vi: 'bút chì' },
          { ko: '남자', vi: 'đàn ông' },
          { ko: '엄마', vi: 'mẹ' },
          { ko: '컴퓨터', vi: 'máy tính' },
          { ko: '밥', vi: 'cơm' },
          { ko: '입', vi: 'miệng' },
          { ko: '무릎', vi: 'đầu gối' },
          { ko: '가방', vi: 'cặp, túi' },
          { ko: '냉장고', vi: 'tủ lạnh' },
          { ko: '창문', vi: 'cửa sổ' },
        ],
      },
      {
        kind: 'reading',
        title: '🪧 Luyện đọc biển hiệu',
        intro: 'Các biển hiệu ở Seoul trong sách. Bấm một biển để nghe.',
        lines: [['서울역', '명동', '아름다운가게', '옛찻집'], ['파리크라상', '스타벅스 커피', '뽀뽀', '강남면옥'], ['이니스프리', '세종이야기', '코쿤피스', '서울미술관'], ['쌈지길', '디초콜릿 커피', '올리브영']],
      },
    ],
  },
]
