// Nội dung "Ngữ âm cơ bản" (chuỗi bài vỡ lòng trước HSK 1+2: thanh mẫu/vận mẫu/thanh điệu) — soạn từ
// giáo trình EmotionalChinese, KHÔNG phải thẻ để ôn/quiz nên không lưu trong chineseCards (DB), cùng
// convention với dialogues.ts/speakingPractice.ts (nội dung bổ trợ lưu thẳng trong code, theo bài học).
// Đây là các bài học RIÊNG của chuỗi ngữ âm (Bài 1, Bài 2, …), khác với LESSON_META (Bài 1..25 HSK 1+2).

export interface PhoneticSound {
  letter: string
  characteristic: string // Đặc tính
  howTo: string[] // Cách phát âm — mỗi phần tử là 1 gạch đầu dòng
  soundLike: string // Đặc trưng âm thanh
  note?: string // Chú ý thêm (vd âm e đọc thành "ơ" trong 1 số trường hợp)
}

export interface PhoneticsNote {
  title: string
  intro: string
  bullets?: { label: string; text: string }[]
  // Gạch đầu dòng KHÔNG có nhãn riêng (khác bullets ở trên) — vd 3 lưu ý rời rạc của Bài 6, không
  // phải cặp label:text.
  plainBullets?: string[]
  outro?: string
  examples?: { hanzi: string; pinyin: string; meaning: string }[]
}

export interface SyllableRow {
  consonant: string
  cells: (string | null)[] // theo đúng thứ tự vowels của bảng chứa nó (xem SyllableTableData.vowelLabels)
}

// 1 bài có thể có NHIỀU bảng ghép âm (Bài 6: zh/ch/sh/r ghép với a-o-e-i-u-ü VÀ ghép riêng với vận
// mẫu kép ai/ei/ao/ou/an/en/ang/eng/ong — 2 bảng tách biệt vì quá nhiều cột để gộp làm 1).
export interface SyllableTableData {
  vowelLabels: string[]
  rows: SyllableRow[]
}

// Ví dụ minh hoạ 1 quy tắc biến điệu. `after` là cách đọc theo quy tắc; `before` chỉ có khi quy tắc
// là 1 phép BIẾN ĐỔI từ cách đọc gốc sang cách đọc khác (Bài 3: nǐ hǎo → ní hǎo) — bỏ trống khi quy
// tắc chỉ đơn thuần liệt kê ví dụ cho 1 cách đọc cố định (Bài 6: quy tắc biến điệu của 不/一, mỗi ví
// dụ đã ở đúng dạng đọc cuối, không có gì để "biến đổi từ" cả).
export interface ToneSandhiExample {
  before?: string
  after: string
  hanzi: string
  meaning: string
}

// 1 variant = quy tắc thường; 2 variants (có label) = 2 cách biến điệu song song cho cùng 1 tình huống
// (vd 3 âm tiết thanh 3 liền nhau — Bài 3: "2 âm tiết đầu đổi" vs "chỉ âm tiết giữa đổi").
export interface ToneSandhiVariant {
  label?: string
  examples: ToneSandhiExample[]
}

export interface ToneSandhiBlock {
  title: string
  variants: ToneSandhiVariant[]
  // Dùng khi quy tắc chỉ mô tả bằng lời (vd "nửa thanh 3"), không có ví dụ chữ Hán đầy đủ.
  plainNote?: string
}

export interface EndingComparisonSide {
  label: string
  soundFeature: string // Đặc trưng âm
  howTo: string // Cách phát âm
  auralTip: string // Phân biệt bằng thính giác
}

export interface EndingComparison {
  title: string
  left: EndingComparisonSide
  right: EndingComparisonSide
}

// Bảng so sánh N nhóm thanh mẫu cạnh nhau (Bài 7: mặt lưỡi j/q/x vs đầu lưỡi sau zh/ch/sh vs đầu
// lưỡi trước z/c/s) — khác EndingComparison (cố định đúng 2 cột) vì số cột thay đổi theo bài, và mỗi
// ô có thể là 1 đoạn văn HOẶC 1 danh sách gạch đầu dòng (hàng "Cách phát âm" trong sách là bullet list).
export interface GroupComparisonColumn {
  title: string
  subtitle: string // vd "j, q, x"
}

export interface GroupComparisonRow {
  label: string
  cells: (string | string[])[] // theo đúng thứ tự columns — string[] = hiện dạng bullet list
}

export interface GroupComparison {
  title: string
  columns: GroupComparisonColumn[]
  rows: GroupComparisonRow[]
}

// Thanh nhẹ (qingsheng) — Bài 4: âm tiết không mang thanh điệu, đọc ngắn/nhẹ, luôn đứng sau 1 âm
// tiết khác. Khác hẳn cấu trúc TONES (4 thẻ) và toneSandhi (quy tắc biến điệu) nên có type riêng.
export interface NeutralToneSection {
  intro: string[] // các đoạn văn giải thích, nối bằng nhiều <p>
  howTo: string
  examples: { hanzi: string; pinyin: string; meaning: string }[]
  distinguishNote: { title: string; bullets: string[] } // "Phân biệt thanh điệu bình thường và thanh nhẹ"
}

export interface PhoneticsLesson {
  number: number
  title: string
  // Mỗi nhóm con render thành 1 hàng thẻ — 2 phần tử = so sánh cặp (giống sách), 1 phần tử = thẻ đứng riêng (vd âm h).
  initialGroups: PhoneticSound[][]
  finalGroups: PhoneticSound[][]
  // true = hiện lại bộ 4 thẻ thanh điệu (Bài 1 giới thiệu lần đầu, Bài 2 trở đi chỉ ôn tập — cùng dùng chung TONES).
  showTones: boolean
  toneSectionTitle: string
  // Bài 3: quy tắc biến điệu thanh 3 — thay thế showTones (không hiện lại bộ thẻ TONES, hiện quy tắc thay vào đó).
  toneSandhi?: ToneSandhiBlock[]
  // Bài 4: thanh nhẹ — cũng thay thế showTones, cấu trúc khác hẳn toneSandhi (giải thích + ví dụ + ghi chú phân biệt).
  neutralTone?: NeutralToneSection
  // Bài 3: bảng so sánh vận mẫu đuôi -n / -ng, đứng trước phần "Một số lưu ý".
  endingComparison?: EndingComparison
  // Bài 7: bảng so sánh 3 nhóm thanh mẫu dễ nhầm (mặt lưỡi/đầu lưỡi sau/đầu lưỡi trước) — đứng sau
  // phần thanh mẫu, trước bảng ghép âm.
  groupComparison?: GroupComparison
  // 1 hoặc nhiều bảng ghép âm (xem SyllableTableData) — hầu hết các bài chỉ có 1, Bài 6 có 2.
  syllableTables: SyllableTableData[]
  notes: PhoneticsNote[]
}

export const SYLLABLE_VOWELS = ['a', 'o', 'e', 'i', 'u', 'ü']

// Web Speech API (giọng zh-CN) đọc pinyin KHÔNG dấu thanh (vd "pa", "bu") không ổn định — nhiều máy
// đọc tách rời thành tên từng chữ cái ("P", "A") thay vì đọc như 1 âm tiết tiếng Trung thật. Map sang
// 1 chữ Hán có âm đọc đúng y hệt âm tiết đó (bất kể thanh điệu — mục đích chỉ để nghe đúng ÂM, không
// cần đúng dấu) để SpeakButton đọc chữ Hán thay vì đọc thẳng chuỗi la-tinh không dấu.
export const SYLLABLE_HANZI: Record<string, string> = {
  ba: '八', bo: '波', bi: '笔', bu: '不',
  pa: '趴', po: '坡', pi: '皮', pu: '普',
  ma: '妈', mo: '摸', me: '么', mi: '米', mu: '木',
  fa: '发', fo: '佛', fu: '福',
  da: '大', de: '的', di: '低', du: '读',
  ta: '他', te: '特', ti: '提', tu: '图',
  na: '那', ne: '呢', ni: '你', nu: '努', nü: '女',
  la: '拉', le: '了', lu: '路', lü: '绿',
  ga: '嘎', ge: '哥', gu: '古',
  ka: '卡', ke: '可', ku: '哭',
  ha: '哈', he: '河', hu: '湖',
  // Bài 3 — thanh mẫu ghép với vận mẫu kép (ai/ei/ao/ou/an/en/ang/eng/ong).
  bai: '白', bei: '北', bao: '包', ban: '半', ben: '本', bang: '帮', beng: '蹦',
  pai: '拍', pei: '配', pao: '跑', pou: '剖', pan: '盘', pen: '盆', pang: '旁', peng: '朋',
  mai: '买', mei: '美', mao: '猫', mou: '某', man: '慢', men: '们', mang: '忙', meng: '梦',
  fei: '飞', fou: '否', fan: '饭', fen: '分', fang: '方', feng: '风',
  dai: '带', dei: '得', dao: '到', dou: '都', dan: '但', dang: '当', deng: '等', dong: '东',
  tai: '太', tao: '套', tou: '头', tan: '谈', tang: '糖', teng: '疼', tong: '同',
  nai: '奶', nei: '内', nao: '脑', nan: '难', nen: '嫩', nang: '囊', neng: '能', nong: '农',
  lai: '来', lei: '累', lao: '老', lou: '楼', lan: '蓝', lang: '浪', leng: '冷', long: '龙',
  gai: '该', gei: '给', gao: '高', gou: '狗', gan: '干', gen: '跟', gang: '港', geng: '更', gong: '工',
  kai: '开', kao: '考', kou: '口', kan: '看', ken: '肯', kang: '抗', keng: '坑', kong: '空',
  hai: '还', hei: '黑', hao: '好', hou: '后', han: '汉', hen: '很', hang: '航', heng: '横', hong: '红',
  // Bài 4 — thanh mẫu mặt lưỡi j/q/x ghép với vận mẫu có i/ü đứng đầu.
  ji: '机', ju: '局', jue: '决', juan: '捐', jun: '军',
  qi: '七', qu: '去', que: '缺', quan: '全', qun: '群',
  xi: '西', xu: '需', xue: '学', xuan: '选', xun: '寻',
  // Bài 5 — vận mẫu ghép có "i" đứng đầu (ia/ie/ian/iang/iao/iu/in/ing/iong), ghép với mọi thanh mẫu đã học.
  bie: '别', bian: '边', biao: '表', bin: '宾', bing: '病',
  pie: '撇', pian: '片', piao: '票', pin: '品', ping: '平',
  mie: '灭', mian: '面', miao: '秒', miu: '谬', min: '民', ming: '明',
  die: '蝶', dian: '店', diao: '掉', diu: '丢', ding: '顶',
  tie: '铁', tian: '天', tiao: '条', ting: '听',
  nie: '捏', nian: '年', niang: '娘', niao: '鸟', niu: '牛', nin: '您', ning: '宁',
  lia: '俩', lie: '列', lian: '连', liang: '两', liao: '聊', liu: '六', lin: '林', ling: '铃',
  jia: '家', jie: '姐', jian: '见', jiang: '讲', jiao: '教', jiu: '九', jin: '今', jing: '京', jiong: '窘',
  qia: '恰', qie: '切', qian: '前', qiang: '强', qiao: '桥', qiu: '球', qin: '亲', qing: '请', qiong: '穷',
  xia: '下', xie: '谢', xian: '先', xiang: '想', xiao: '小', xiu: '修', xin: '心', xing: '星', xiong: '熊',
  // Bài 6 — thanh mẫu đầu lưỡi sau (uốn lưỡi) zh/ch/sh/r.
  zha: '扎', zhe: '这', zhi: '知', zhu: '猪',
  cha: '茶', che: '车', chi: '吃', chu: '出',
  sha: '沙', she: '蛇', shi: '是', shu: '书',
  re: '热', ri: '日', ru: '如',
  zhai: '摘', zhei: '这', zhao: '找', zhou: '周', zhan: '站', zhen: '真', zhang: '张', zheng: '正', zhong: '中',
  chai: '拆', chao: '超', chou: '抽', chan: '产', chen: '陈', chang: '长', cheng: '城', chong: '虫',
  shai: '晒', shei: '谁', shao: '少', shou: '手', shan: '山', shen: '深', shang: '上', sheng: '生',
  rao: '绕', rou: '肉', ran: '然', ren: '人', rang: '让', reng: '扔', rong: '容',
  // Bài 7 — thanh mẫu đầu lưỡi trước (răng) z/c/s.
  za: '咋', ze: '责', zi: '字', zu: '组',
  ca: '擦', ce: '册', ci: '词', cu: '粗',
  sa: '撒', se: '色', si: '四', su: '素',
  zai: '在', zei: '贼', zao: '早', zou: '走', zan: '咱', zen: '怎', zang: '脏', zeng: '增', zong: '总',
  cai: '才', cao: '草', cou: '凑', can: '参', cen: '岑', cang: '仓', ceng: '层', cong: '从',
  sai: '塞', sao: '扫', sou: '搜', san: '三', sen: '森', sang: '桑', seng: '僧', song: '松',
  // Bài 8 — vận mẫu ghép có "u" đứng đầu (ua/uo/uai/uei-ui/uan/uen-un/uang/ueng), ghép với thanh mẫu
  // đầu lưỡi (d/t/n/l/z/c/s) và thanh mẫu cuống lưỡi/uốn lưỡi (zh/ch/sh/r/g/h/k).
  duo: '多', dui: '对', duan: '段', dun: '顿',
  tuo: '拖', tui: '推', tuan: '团', tun: '吞',
  nuo: '诺', nuan: '暖',
  luo: '落', luan: '乱', lun: '论',
  zuo: '做', zui: '最', zuan: '钻', zun: '尊',
  cuo: '错', cui: '脆', cuan: '窜', cun: '村',
  suo: '所', sui: '虽', suan: '算', sun: '孙',
  zhua: '抓', zhuo: '桌', zhuai: '拽', zhui: '追', zhuan: '转', zhun: '准', zhuang: '装',
  chua: '欻', chuo: '戳', chuai: '揣', chui: '吹', chuan: '穿', chun: '春', chuang: '窗',
  shua: '刷', shuo: '说', shuai: '摔', shui: '水', shuan: '栓', shun: '顺', shuang: '双',
  rua: '挼', ruo: '若', rui: '瑞', ruan: '软', run: '润',
  gua: '瓜', guo: '国', guai: '乖', gui: '贵', guan: '关', gun: '滚', guang: '光',
  hua: '花', huo: '火', huai: '坏', hui: '会', huan: '欢', hun: '婚', huang: '黄',
  kua: '夸', kuo: '阔', kuai: '快', kui: '亏', kuan: '宽', kun: '困', kuang: '矿',
}

export interface ToneInfo {
  number: 1 | 2 | 3 | 4
  mark: string // chữ cái mang dấu thanh, vd ā/á/ǎ/à
  name: string
  contour: number[] // các mốc cao độ 1–5 để vẽ đường nét thanh điệu (xem PhoneticsSection)
  example: { hanzi: string; pinyin: string; meaning: string }
}

// Ví dụ kinh điển 妈/麻/马/骂 (mā/má/mǎ/mà) — cùng 1 âm tiết "ma", chỉ đổi thanh điệu, nghĩa đổi hẳn.
export const TONES: ToneInfo[] = [
  { number: 1, mark: 'ā', name: 'Thanh ngang (âm bình)', contour: [5, 5], example: { hanzi: '妈', pinyin: 'mā', meaning: 'Mẹ' } },
  { number: 2, mark: 'á', name: 'Thanh sắc (dương bình)', contour: [3, 5], example: { hanzi: '麻', pinyin: 'má', meaning: 'Cây gai dầu' } },
  { number: 3, mark: 'ǎ', name: 'Thanh hỏi (thượng thanh)', contour: [4, 1, 4], example: { hanzi: '马', pinyin: 'mǎ', meaning: 'Con ngựa' } },
  { number: 4, mark: 'à', name: 'Thanh huyền (khứ thanh)', contour: [5, 1], example: { hanzi: '骂', pinyin: 'mà', meaning: 'Mắng, chửi' } },
]

const b: PhoneticSound = {
  letter: 'b',
  characteristic: 'Âm môi, tắc, không bật hơi.',
  howTo: [
    'Để tạo âm này, hai môi bặm nhẹ trong khi hai hàm tách nhau.',
    'Khi phát âm, đường dẫn khí bị tắc hoàn toàn, sau đó đột ngột mở hai môi đẩy về phía trước để luồng hơi đi ra nhẹ, môi không chạm vào răng, không bật hơi.',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Âm đọc giống âm "p" trong Pikachu, Com-pa, Pác Bó của Tiếng Việt.',
}

const p: PhoneticSound = {
  letter: 'p',
  characteristic: 'Âm môi, tắc, bật hơi.',
  howTo: [
    'Để tạo âm này, hai môi bặm nhẹ trong khi hai hàm tách nhau.',
    'Khi phát âm, đường dẫn khí bị tắc hoàn toàn, sau đó đột ngột mở hai môi đẩy về phía trước để luồng hơi bật mạnh ra, môi không chạm vào răng, cằm giật mạnh về phía trước, vai nảy lên.',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
}

const m: PhoneticSound = {
  letter: 'm',
  characteristic: 'Âm môi, mũi, không bật hơi.',
  howTo: [
    'Để tạo âm này, hai môi chạm nhẹ vào nhau trong khi hai hàm tách nhau.',
    'Khi phát âm, đẩy nhẹ môi ra để môi không chạm vào răng. Đường dẫn khí khoang miệng đóng lại, luồng khí hoàn toàn theo khoang mũi thoát ra.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Âm đọc giống âm "m" trong Mẹ tôi, Mua bán, Mênh mông.',
}

const f: PhoneticSound = {
  letter: 'f',
  characteristic: 'Âm môi răng, xát, không bật hơi.',
  howTo: [
    'Để tạo âm này, răng trên chạm nhẹ môi dưới.',
    'Khi phát âm, đẩy môi dưới ra khỏi răng trên, luồng hơi lách qua khe hẹp tạo ra tiếng cọ xát.',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Âm đọc giống âm "ph" trong Phở bò, Phúc lợi, Phung phí.',
}

const aFinal: PhoneticSound = {
  letter: 'a',
  characteristic: 'Nguyên âm rộng, lưỡi trước, không tròn môi.',
  howTo: [
    'Trong quá trình phát âm, miệng mở rộng một cách tự nhiên, lưỡi phẳng và hạ ở vị trí thấp nhất, lưỡi ở phía trước.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Âm đọc giống âm "a" trong "A, ra thế", "A ha".',
}

const oFinal: PhoneticSound = {
  letter: 'o',
  characteristic: 'Nguyên âm trung bình, lưỡi sau, tròn môi.',
  howTo: [
    'Khi phát âm miệng từ từ mở rộng, môi tròn và hơi nhô lên, lưỡi rút nhẹ về sau, mặt sau của lưỡi được nâng lên, lưỡi ở giữa.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm tương tự trong Tiếng Việt.',
}

const eFinal: PhoneticSound = {
  letter: 'e',
  characteristic: 'Nguyên âm trung bình, lưỡi sau, không tròn môi.',
  howTo: [
    'Khi phát âm, miệng mở một nửa, lưỡi rụt nhẹ về phía sau, khoé miệng bị dẹt sang hai bên.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm tương tự trong Tiếng Việt.',
  note: 'Khi đi với các thanh mẫu d/t/n/l và âm tiết mang thanh nhẹ, thì âm /e/ được phát âm thành "ơ".',
}

const iFinal: PhoneticSound = {
  letter: 'i',
  characteristic: 'Nguyên âm hẹp cao, lưỡi trước, không tròn môi.',
  howTo: [
    'Khi phát âm miệng dẹt, hai mép kéo rộng sang hai bên, đầu lưỡi chạm nhẹ lợi dưới, phần giữa và cuống lưỡi được nâng lên sát với vòm miệng phía trên.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Âm thanh tương tự phần đầu của từ "young" trong Tiếng Anh.',
}

const uFinal: PhoneticSound = {
  letter: 'u',
  characteristic: 'Nguyên âm trung bình, lưỡi sau, tròn môi.',
  howTo: [
    'Khi phát âm, môi tròn và nhô ra thành một lỗ nhỏ, mặt sau của lưỡi được nâng lên, lưỡi rụt về phía sau.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Âm đọc giống âm "u" trong "U tối", "U ám".',
}

const uUmlautFinal: PhoneticSound = {
  letter: 'ü',
  characteristic: 'Nguyên âm hẹp cao, lưỡi trước, tròn môi.',
  howTo: [
    'Khi phát âm, đọc như âm "uy" nhưng môi tròn, hai khoé mép khép nhau như hình quả trám, đầu lưỡi chạm nhẹ lợi dưới, phần giữa và cuống lưỡi được nâng lên sát với vòm miệng phía trên.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm tương tự trong Tiếng Việt.',
  note: 'Tròn môi từ đầu đến cuối âm, khi kết thúc âm môi vẫn phải tròn.',
}

const d: PhoneticSound = {
  letter: 'd',
  characteristic: 'Âm đầu lưỡi, tắc, không bật hơi.',
  howTo: [
    'Để tạo âm này, đưa đầu lưỡi tiếp xúc với lợi trên.',
    'Khi phát âm, đầu lưỡi hạ xuống đột ngột, không bật hơi.',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Âm đọc giống âm "t" trong Tung tăng, Tách biệt, Tưới cây.',
}

const t: PhoneticSound = {
  letter: 't',
  characteristic: 'Âm đầu lưỡi, tắc, bật hơi.',
  howTo: [
    'Để tạo âm này, đưa đầu lưỡi tiếp xúc với lợi trên.',
    'Khi phát âm, đầu lưỡi hạ xuống đột ngột, đồng thời bật hơi ra, cằm giật mạnh về phía trước, vai nảy lên.',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
  note: 'Phân biệt với âm /θ/ trong Tiếng Anh (trong các từ Think, Thief...): âm /θ/ đẩy lưỡi chạm răng trên, còn âm "t" trong Tiếng Trung lưỡi chạm lợi trên, không chạm răng.',
}

const n: PhoneticSound = {
  letter: 'n',
  characteristic: 'Âm đầu lưỡi, mũi, không bật hơi.',
  howTo: [
    'Để tạo âm này, đưa đầu lưỡi tiếp xúc với lợi trên.',
    'Khi phát âm, đầu lưỡi hạ xuống đột ngột, không bật hơi. Đường dẫn khí khoang miệng đóng lại, luồng khí hoàn toàn theo khoang mũi thoát ra.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Âm đọc giống âm "n" trong Nắng nóng, Non nước.',
}

const l: PhoneticSound = {
  letter: 'l',
  characteristic: 'Âm đầu lưỡi, biên, không bật hơi.',
  howTo: [
    'Để tạo âm này, đưa đầu lưỡi tiếp xúc với lợi trên.',
    'Khi phát âm, đầu lưỡi hạ xuống đột ngột, không bật hơi. Đường dẫn khí giữa lưỡi bị tắc, luồng hơi thoát ra theo hai bên lưỡi.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Âm đọc giống âm "l" trong Lá cây, Lạnh giá, Lung linh.',
}

const g: PhoneticSound = {
  letter: 'g',
  characteristic: 'Âm cuống lưỡi, tắc, không bật hơi.',
  howTo: [
    'Để tạo âm này, đưa mặt trên của cuống lưỡi vồng lên, chạm vào vòm miệng trên.',
    'Khi phát âm, phần tiếp xúc đó hạ xuống đột ngột, không ma sát lưỡi, không bật hơi.',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Âm đọc giống âm "c" trong Con cá, Cứng cáp.',
}

const k: PhoneticSound = {
  letter: 'k',
  characteristic: 'Âm cuống lưỡi, tắc, bật hơi.',
  howTo: [
    'Trước khi đọc âm k, người học đọc lại âm g, nhận biết và nắm rõ vị trí phần cuống lưỡi tiếp xúc với vòm miệng.',
    'Khi phát âm, phần tiếp xúc đó đập mạnh lên vòm miệng trên rồi hạ xuống ngay, không ma sát lưỡi, cằm gập, vai giật lên, đẩy mạnh hơi ra ngoài.',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm tương tự trong Tiếng Việt.',
}

const h: PhoneticSound = {
  letter: 'h',
  characteristic: 'Âm cuống lưỡi, xát, không bật hơi.',
  howTo: [
    'Để tạo âm này cần rụt sâu cuống lưỡi, cảm nhận phần tiếp xúc với cuống lưỡi ở rất sâu trong cổ họng.',
    'Khi phát âm, ma sát phần tiếp xúc cuống lưỡi đó trong cuống họng, vồng vòm họng lên và phát ra âm thanh.',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
}

const aiFinal: PhoneticSound = {
  letter: 'ai',
  characteristic: 'Nguyên âm đôi vang trước.',
  howTo: [
    'Khi phát âm, đầu tiên mở rộng miệng phát âm âm a, sau đó khép hàm lại, trượt sang âm i, luồng khí không bị gián đoạn, âm thanh nghe liền và mượt. Nguyên âm đứng trước (a) nghe vang và rõ hơn hẳn nguyên âm đứng sau (i).',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Nghe âm dẹt hơn, cuối âm lưỡi sát lên vòm miệng trên hơn so với âm "ai" trong Tiếng Việt.',
}

const eiFinal: PhoneticSound = {
  letter: 'ei',
  characteristic: 'Nguyên âm đôi vang trước.',
  howTo: [
    'Khi phát âm, đầu tiên mở miệng trung bình để phát âm âm e (ngả sang ê), sau đó khép hàm lại, trượt sang i, luồng khí không bị gián đoạn, âm thanh nghe liền và mượt, khoé miệng dẹt ra hai bên. Nguyên âm đứng trước (e) nghe vang và rõ hơn hẳn nguyên âm đứng sau (i).',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Nghe âm dẹt hơn, cuối âm lưỡi sát lên vòm miệng trên hơn so với âm "ây" trong Tiếng Việt.',
}

const aoFinal: PhoneticSound = {
  letter: 'ao',
  characteristic: 'Nguyên âm đôi vang trước.',
  howTo: [
    'Khi phát âm, đầu tiên mở rộng miệng phát âm âm a, sau đó cuống lưỡi nhấc lên, miệng tròn và nhẹ nhàng trượt về phía âm o, luồng khí không bị gián đoạn, âm thanh nghe liền và mượt. Nguyên âm đứng trước (a) nghe vang và rõ hơn hẳn nguyên âm đứng sau (o).',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Nghe âm vang hơn, hàm dưới hạ xuống hơn so với âm "ao" trong Tiếng Việt.',
}

const ouFinal: PhoneticSound = {
  letter: 'ou',
  characteristic: 'Nguyên âm đôi vang trước.',
  howTo: [
    'Khi phát âm, đầu tiên mở miệng vừa, phát âm âm o (ngả sang ô), sau đó môi dần dần khép lại, cuống lưỡi nâng lên và trượt về phía âm u, khẩu hình miệng di chuyển từ lớn đến nhỏ. Nguyên âm đứng trước (o) nghe vang và rõ hơn hẳn nguyên âm đứng sau (u).',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Nghe âm vang hơn, hàm dưới hạ xuống hơn so với âm "âu" trong Tiếng Việt.',
}

const anFinal: PhoneticSound = {
  letter: 'an',
  characteristic: 'Vận mẫu mũi đầu lưỡi.',
  howTo: [
    'Khi phát âm, đầu tiên mở rộng miệng, phát âm âm a, sau đó đưa đầu lưỡi chạm lên phần lợi của hàm răng trên, bịt đường dẫn khí khoang miệng lại để luồng hơi đi qua mũi, hai hàm từ mở to đến khép lại.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Phần đầu âm nghe vang hơn so với âm "an" trong Tiếng Việt.',
}

const enFinal: PhoneticSound = {
  letter: 'en',
  characteristic: 'Vận mẫu mũi đầu lưỡi.',
  howTo: [
    'Khi phát âm, đầu tiên mở miệng vừa, phát âm âm e (ngả sang ơ), sau đó đưa đầu lưỡi chạm lên phần lợi của hàm răng trên, bịt đường dẫn khí khoang miệng lại để luồng hơi đi qua mũi, hai hàm mở vừa đến khép lại.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Phần đầu âm nghe vang hơn so với âm "ân" trong Tiếng Việt.',
}

const angFinal: PhoneticSound = {
  letter: 'ang',
  characteristic: 'Vận mẫu mũi cuống lưỡi.',
  howTo: [
    'Khi phát âm, đầu tiên mở rộng miệng phát âm âm a, sau đó rụt cuống lưỡi lại để chặn vòm họng, đồng thời nâng hàm lên cho miệng hẹp lại, cảm nhận rõ luồng hơi lên mũi bị bịt lại.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Cả âm nghe vang và ngân nga hơn thấy rõ, cuống lưỡi chặn sâu trong vòm họng so với âm "ang" trong Tiếng Việt.',
}

const engFinal: PhoneticSound = {
  letter: 'eng',
  characteristic: 'Vận mẫu mũi cuống lưỡi.',
  howTo: [
    'Khi phát âm, đầu tiên mở miệng vừa, phát âm âm e (ngả sang ơ), sau đó rụt cuống lưỡi lại để chặn vòm họng, đồng thời nâng hàm lên cho miệng hẹp lại, cảm nhận rõ luồng hơi lên mũi bị bịt lại.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Cả âm nghe vang và ngân nga hơn thấy rõ, cuống lưỡi chặn sâu trong vòm họng so với âm "âng" trong Tiếng Việt.',
}

const ongFinal: PhoneticSound = {
  letter: 'ong',
  characteristic: 'Vận mẫu mũi cuống lưỡi.',
  howTo: [
    'Khi phát âm, đầu tiên phát âm âm o (đọc thành u), môi tròn chúm lại, sau đó rụt cuống lưỡi lại để chặn vòm họng, cảm nhận rõ luồng hơi lên mũi bị bịt lại, khẩu hình môi không thay đổi. Khi hết âm, môi vẫn tròn hở ra một lỗ nhỏ chứ không khép hẳn lại.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Cả âm nghe vang và ngân nga hơn thấy rõ, cuối âm âm thanh vẫn kéo dài thanh thoát chứ không bị bịt lại như âm "ung" trong Tiếng Việt.',
}

const j: PhoneticSound = {
  letter: 'j',
  characteristic: 'Âm mặt lưỡi, tắc xát, không bật hơi.',
  howTo: [
    'Để tạo âm này, lưỡi để phẳng, bẹt, dẹt, đầu lưỡi chạm mặt trong hàm răng dưới, mặt lưỡi áp sát vòm miệng trên, hai mép kéo ra hai bên giống như cười mỉm, không được nhìn thấy răng dưới.',
    'Khi phát âm, chặn hơi rồi sau đó đẩy hơi sao cho luồng không khí ùa ra từ khe hẹp và ma sát với vòm miệng trên tạo ra âm thanh.',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
}

const q: PhoneticSound = {
  letter: 'q',
  characteristic: 'Âm mặt lưỡi, tắc xát, bật hơi.',
  howTo: [
    'Để tạo âm này, lưỡi để phẳng, bẹt, dẹt, đầu lưỡi chạm mặt trong hàm răng dưới, mặt lưỡi áp sát vòm miệng trên, hai mép kéo ra hai bên giống như cười mỉm, không được nhìn thấy răng dưới.',
    'Khi phát âm, chặn hơi rồi sau đó đẩy mạnh hơi sao cho cằm giật, vai nảy lên, luồng không khí tống mạnh ra từ khe hẹp và ma sát với vòm miệng trên tạo ra âm thanh.',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
}

const x: PhoneticSound = {
  letter: 'x',
  characteristic: 'Âm mặt lưỡi, xát, không tắc, không bật hơi.',
  howTo: [
    'Để tạo âm này, lưỡi để phẳng, bẹt, dẹt, đầu lưỡi chạm mặt trong hàm răng dưới, mặt lưỡi áp sát vòm miệng trên, hai mép kéo ra hai bên giống như cười mỉm, không được nhìn thấy răng dưới.',
    'Khi phát âm, đẩy hơi sao cho luồng không khí ùa ra từ khe hẹp và ma sát rõ rệt với vòm miệng trên tạo ra tiếng "xì xì".',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Âm thanh tương tự âm "x" trong Xi măng, Xí hổ, Hắt xì.',
}

const ueFinal: PhoneticSound = {
  letter: 'üe',
  characteristic: 'Nguyên âm đôi vang sau, tròn môi.',
  howTo: [
    'Khi phát âm, đầu tiên tròn môi, hai khoé mép khép nhau như hình quả trám để phát âm âm ü, sau đó hạ hàm nhẹ nhàng trượt sang âm ê, luồng khí không bị gián đoạn, âm thanh nghe liền và mượt. Trong suốt quá trình phát âm, đầu lưỡi chạm nhẹ lợi dưới, phần cuống lưỡi được nâng lên sát với vòm miệng phía trên.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
}

const uUmlautAnFinal: PhoneticSound = {
  letter: 'üan',
  characteristic: 'Nguyên âm ba, tròn môi.',
  howTo: [
    'Khi phát âm, đầu tiên tròn môi, hai khoé mép khép nhau như hình quả trám để phát âm âm ü, sau đó hạ hàm trượt về âm a, cuối cùng đưa đầu lưỡi chạm lên phần lợi của hàm răng trên, bịt đường dẫn khí khoang miệng lại để luồng hơi đi qua mũi, môi từ tròn đến mở to rồi khép lại.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
}

const unFinal: PhoneticSound = {
  letter: 'ün (-un)',
  characteristic: 'Nguyên âm ba, tròn môi.',
  howTo: [
    'Khi phát âm, đầu tiên tròn môi, hai khoé mép khép nhau như hình quả trám để phát âm âm ü, sau đó đưa đầu lưỡi chạm lên phần lợi của hàm răng trên, bịt đường dẫn khí khoang miệng lại để luồng hơi đi qua mũi, môi tròn đều từ đầu đến cuối âm.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
}

const iaFinal: PhoneticSound = {
  letter: 'ia',
  characteristic: 'Nguyên âm đôi vang sau.',
  howTo: [
    'Khi phát âm, đầu tiên đẩy cao lưỡi sát vòm miệng trên và dẹt miệng để phát âm âm i, sau đó hạ hàm và nhẹ nhàng trượt về phía âm a, luồng khí không bị gián đoạn, âm thanh nghe liền và mượt. Nguyên âm đứng sau (a) nghe vang và rõ hơn nguyên âm đứng trước (i).',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
  note: 'Phải đọc rõ âm i rồi mới nối sang âm a.',
}

const ieFinal: PhoneticSound = {
  letter: 'ie',
  characteristic: 'Nguyên âm đôi vang sau.',
  howTo: [
    'Khi phát âm, đầu tiên đẩy cao lưỡi sát vòm miệng trên và dẹt miệng để phát âm âm i, sau đó hạ hàm và nhẹ nhàng trượt về phía âm ê, luồng khí không bị gián đoạn, âm thanh nghe liền và mượt. Nguyên âm đứng sau (e) nghe vang và rõ hơn nguyên âm đứng trước (i).',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Nghe âm ngả sang ê hơn là a, cuối âm hàm hạ xuống thay vì mở dẹt sang hai bên như âm "ia" trong Tiếng Việt.',
  note: 'Phải đọc rõ âm i rồi mới nối sang âm e.',
}

const iaoFinal: PhoneticSound = {
  letter: 'iao',
  characteristic: 'Nguyên âm ba.',
  howTo: [
    'Khi phát âm, đầu tiên đẩy cao lưỡi sát vòm miệng trên và dẹt miệng để phát âm âm i, sau đó nhẹ nhàng trượt về phía âm ao, luồng khí không bị gián đoạn, âm thanh nghe liền và mượt.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
  note: 'Phải đọc rõ âm i rồi mới nối sang âm ao.',
}

const iouFinal: PhoneticSound = {
  letter: 'iou (-iu)',
  characteristic: 'Nguyên âm ba.',
  howTo: [
    'Khi phát âm, đầu tiên đẩy cao lưỡi sát vòm miệng trên và dẹt miệng để phát âm âm i, sau đó nhẹ nhàng trượt về phía âm ou, luồng khí không bị gián đoạn, âm thanh nghe liền và mượt, hình dạng miệng thay đổi từ phẳng sang tròn.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
  note: 'Phải đọc rõ âm i rồi mới nối sang âm ou.',
}

const ianFinal: PhoneticSound = {
  letter: 'ian',
  characteristic: 'Vận mẫu mũi đầu lưỡi rộng.',
  howTo: [
    'Khi phát âm, đầu tiên đẩy cao lưỡi sát vòm miệng trên và dẹt miệng để phát âm âm i, sau đó hạ hàm trượt về âm a, cuối cùng đưa đầu lưỡi chạm lên phần lợi của hàm răng trên, bịt đường dẫn khí khoang miệng lại để luồng hơi đi qua mũi, hai hàm từ dẹt đến mở to rồi khép lại.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
  note: 'Phải đọc rõ âm i rồi mới nối sang âm an.',
}

const iangFinal: PhoneticSound = {
  letter: 'iang',
  characteristic: 'Vận mẫu mũi cuống lưỡi rộng.',
  howTo: [
    'Khi phát âm, đầu tiên đẩy cao lưỡi sát vòm miệng trên và dẹt miệng để phát âm âm i, sau đó hạ hàm trượt về âm a, cuối cùng hạ hàm đồng thời rụt cuống lưỡi lại để chặn vòm họng, cảm nhận rõ luồng hơi lên mũi bị bịt lại, hai hàm từ dẹt đến mở to.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
  note: 'Phải đọc rõ âm i rồi mới nối sang âm ang.',
}

const inFinal: PhoneticSound = {
  letter: 'in',
  characteristic: 'Vận mẫu mũi đầu lưỡi hẹp.',
  howTo: [
    'Khi phát âm, đầu tiên đẩy cao lưỡi sát vòm miệng trên và dẹt miệng để phát âm âm i, sau đó đưa đầu lưỡi chạm lên phần lợi của hàm răng trên, bịt đường dẫn khí khoang miệng lại để luồng hơi đi qua mũi, hai hàm dẹt từ đầu đến cuối âm.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
  note: 'Mặt lưỡi áp sát lên vòm miệng trên từ đầu đến cuối âm.',
}

const ingFinal: PhoneticSound = {
  letter: 'ing',
  characteristic: 'Vận mẫu mũi cuống lưỡi hẹp.',
  howTo: [
    'Khi phát âm, đầu tiên đẩy cao lưỡi sát vòm miệng trên và dẹt miệng để phát âm âm i, sau đó hạ hàm đồng thời rụt cuống lưỡi lại để chặn vòm họng, cảm nhận rõ luồng hơi lên mũi bị bịt lại, khẩu hình miệng từ dẹt hẹp chuyển sang hạ sâu hàm dưới.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
  note: 'Đầu âm nên đẩy lưỡi về phía trước một chút để rõ âm "i", sau đó mới hạ sâu hàm, chặn cuống lưỡi để phát ra phần còn lại của âm.',
}

const iongFinal: PhoneticSound = {
  letter: 'iong',
  characteristic: 'Vận mẫu mũi cuống lưỡi vừa.',
  howTo: [
    'Khi phát âm, đầu tiên đẩy cao lưỡi sát vòm miệng trên và dẹt miệng để phát âm âm i, sau đó tròn môi nhẹ nhàng trượt về phía âm u, cuối cùng hạ hàm đồng thời rụt cuống lưỡi lại để chặn vòm họng, cảm nhận rõ luồng hơi lên mũi bị bịt lại, khẩu hình miệng từ dẹt hẹp chuyển sang tròn.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
  note: 'Phải đọc rõ âm i rồi mới nối sang âm ong.',
}

const zh: PhoneticSound = {
  letter: 'zh',
  characteristic: 'Âm đầu lưỡi sau, tắc xát, không bật hơi.',
  howTo: [
    'Để tạo âm này, đầu lưỡi cần cuộn lên, cuống lưỡi uốn sát vào gần cuống họng, hai môi cong ra ngoài (môi trên cong lên, môi dưới cong xuống).',
    'Khi phát âm, dùng lưỡi chặn hơi rồi sau đó đẩy một luồng khí yếu ùa ra khỏi điểm tắc nghẽn ở đầu lưỡi, luồn qua khe hẹp, ma sát với vòm miệng trên tạo ra âm thanh.',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Âm nghe nặng, tù, vang, đầu lưỡi cuốn sâu hơn nhiều so với âm "tr" trong Tiếng Việt.',
}

const ch: PhoneticSound = {
  letter: 'ch',
  characteristic: 'Âm đầu lưỡi sau, tắc xát, bật hơi.',
  howTo: [
    'Để tạo âm này, đầu lưỡi cần cuộn lên, cuống lưỡi uốn sát vào gần cuống họng, hai môi cong ra ngoài (môi trên cong lên, môi dưới cong xuống).',
    'Khi phát âm, chặn hơi rồi sau đó đẩy một luồng hơi thật mạnh sao cho cằm giật, vai nảy lên, hơi ùa mạnh ra khỏi điểm tắc nghẽn ở đầu lưỡi, luồn qua khe hẹp, ma sát với vòm miệng trên tạo ra âm thanh.',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
}

const sh: PhoneticSound = {
  letter: 'sh',
  characteristic: 'Âm đầu lưỡi sau, xát, không tắc, không bật hơi.',
  howTo: [
    'Để tạo âm này, đầu lưỡi cần cuộn lên, cuống lưỡi uốn sát vào gần cuống họng, hai môi cong ra ngoài (môi trên cong lên, môi dưới cong xuống).',
    'Khi phát âm, đẩy một luồng khí yếu luồn qua khe hẹp, ma sát rõ rệt với vòm miệng trên tạo ra âm thanh "xì xì".',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Âm nghe nặng, tù, vang, đầu lưỡi cuốn sâu hơn nhiều so với âm "s" trong Tiếng Việt.',
}

const r: PhoneticSound = {
  letter: 'r',
  characteristic: 'Âm đầu lưỡi sau, xát, không tắc, không bật hơi, rung dây thanh.',
  howTo: [
    'Để tạo âm này, đầu lưỡi cần cuộn lên, cuống lưỡi uốn sát vào gần cuống họng, hai môi cong ra ngoài (môi trên cong lên, môi dưới cong xuống).',
    'Khi phát âm, đẩy một luồng khí từ sâu trong cổ họng, luồn qua khe hẹp, ma sát nhẹ với vòm miệng trên để tạo ra âm thanh hơi rung rung.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Âm nghe tù, vang, lưỡi không rung, đầu lưỡi cuốn sâu hơn nhiều so với âm "r" trong Tiếng Việt.',
}

const erFinal: PhoneticSound = {
  letter: 'er',
  characteristic: 'Vận mẫu cuốn lưỡi.',
  howTo: ['Hạ hàm dưới, rụt sâu cuống lưỡi vào cuống họng, đầu lưỡi cong sâu lên rồi phát âm.'],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
}

const z: PhoneticSound = {
  letter: 'z',
  characteristic: 'Âm đầu lưỡi trước, tắc xát, không bật hơi.',
  howTo: [
    'Để tạo âm này, miệng thả lỏng tự nhiên, răng hàm trên phủ nhẹ lên răng hàm dưới, hai hàm không cắn chặt vào nhau.',
    'Khi phát âm, đẩy đầu lưỡi áp vào mặt sau của răng cửa trên, chặn luồng khí, sau đó để một luồng khí yếu tách ra khỏi đầu lưỡi, luồn qua khe hẹp và ma sát tạo ra âm thanh.',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
}

const c: PhoneticSound = {
  letter: 'c',
  characteristic: 'Âm đầu lưỡi trước, tắc xát, bật hơi.',
  howTo: [
    'Để tạo âm này, miệng thả lỏng tự nhiên, răng hàm trên phủ nhẹ lên răng hàm dưới, hai hàm không cắn chặt vào nhau, môi hé mở.',
    'Khi phát âm, đẩy đầu lưỡi áp vào mặt sau của răng cửa trên, chặn luồng khí, sau đó bật mạnh để tống hơi ra, cằm giật, vai nảy lên, luồng hơi bật mạnh luồn qua khe hẹp và ma sát tạo ra âm thanh.',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
}

const s: PhoneticSound = {
  letter: 's',
  characteristic: 'Âm đầu lưỡi trước, xát, không tắc, không bật hơi.',
  howTo: [
    'Để tạo âm này, miệng thả lỏng tự nhiên, răng hàm trên phủ nhẹ lên răng hàm dưới, hai hàm không cắn chặt vào nhau, môi hé mở.',
    'Khi phát âm, đẩy đầu lưỡi áp vào mặt sau của răng cửa trên, sau đó đẩy một luồng khí yếu tách ra khỏi đầu lưỡi, luồn qua khe hẹp và ma sát rõ rệt với phần lợi trên tạo ra âm thanh "xì xì".',
    'Không rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Không có âm thanh tương tự trong Tiếng Việt.',
}

const uaFinal: PhoneticSound = {
  letter: 'ua',
  characteristic: 'Nguyên âm đôi vang sau.',
  howTo: [
    'Khi phát âm, đầu tiên tròn môi phát âm âm u, sau đó mở rộng miệng trượt về phía âm a, luồng khí không bị gián đoạn, âm thanh nghe liền và mượt. Nguyên âm đứng sau (a) nghe vang và rõ hơn hẳn nguyên âm đứng trước (u).',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Nghe âm vang hơn, cuống lưỡi rụt sâu hơn so với âm "oa" trong Tiếng Việt.',
}

const uoFinal: PhoneticSound = {
  letter: 'uo',
  characteristic: 'Nguyên âm đôi vang sau.',
  howTo: [
    'Khi phát âm, đầu tiên tròn môi phát âm âm u, sau đó mở rộng miệng nhẹ nhàng trượt về phía âm o, luồng khí không bị gián đoạn, âm thanh nghe liền và mượt. Nguyên âm đứng sau (o) nghe vang và rõ hơn hẳn nguyên âm đứng trước (u).',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Nghe âm vang hơn, cuống lưỡi rụt sâu hơn so với âm "ua" trong Tiếng Việt.',
}

const uaiFinal: PhoneticSound = {
  letter: 'uai',
  characteristic: 'Nguyên âm ba, lưỡi trước, tròn môi.',
  howTo: [
    'Khi phát âm, đầu tiên tròn môi phát âm âm u, sau đó nhẹ nhàng trượt về phía âm ai, luồng khí không bị gián đoạn, âm thanh nghe liền và mượt.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Nghe âm vang hơn, cuống lưỡi rụt sâu hơn so với âm "oai" trong Tiếng Việt.',
}

const ueiFinal: PhoneticSound = {
  letter: 'uei (-ui)',
  characteristic: 'Nguyên âm ba, lưỡi trước, tròn môi.',
  howTo: [
    'Khi phát âm, đầu tiên tròn môi phát âm âm u, sau đó nhẹ nhàng trượt về phía âm ei, luồng khí không bị gián đoạn, âm thanh nghe liền và mượt.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Nghe âm vang hơn, cuống lưỡi rụt sâu hơn, mặt lưỡi áp lên trên hơn so với âm "uây" trong Tiếng Việt.',
}

const uanFinal: PhoneticSound = {
  letter: 'uan',
  characteristic: 'Vận mẫu mũi đầu lưỡi, tròn môi.',
  howTo: [
    'Khi phát âm, đầu tiên tròn môi để phát âm âm u, sau đó hạ hàm trượt về âm a, cuối cùng đưa đầu lưỡi chạm lên phần lợi của hàm răng trên, bịt đường dẫn khí khoang miệng lại để luồng hơi đi qua mũi, hai hàm từ dẹt đến mở to rồi khép lại.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Nghe âm vang hơn, cuống lưỡi rụt sâu hơn so với âm "oan" trong Tiếng Việt.',
}

const uenFinal: PhoneticSound = {
  letter: 'uen (-un)',
  characteristic: 'Vận mẫu mũi đầu lưỡi, tròn môi.',
  howTo: [
    'Khi phát âm, đầu tiên tròn môi để phát âm âm u, sau đó mở miệng trượt sang âm e (ngả sang ơ), cuối cùng đưa đầu lưỡi chạm lên phần lợi của hàm răng trên, bịt đường dẫn khí khoang miệng lại để luồng hơi đi qua mũi, hai hàm từ tròn đến mở vừa rồi khép lại.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Nghe âm vang hơn, cuống lưỡi rụt sâu hơn, miệng tròn hơn so với âm "uân" trong Tiếng Việt.',
}

const uangFinal: PhoneticSound = {
  letter: 'uang',
  characteristic: 'Vận mẫu mũi cuống lưỡi, tròn môi.',
  howTo: [
    'Khi phát âm, đầu tiên tròn môi để phát âm âm u, sau đó hạ hàm trượt về âm a, cuối cùng hạ hàm đồng thời rụt cuống lưỡi lại để chặn vòm họng, cảm nhận rõ luồng hơi lên mũi bị bịt lại, hai hàm từ dẹt đến mở to.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Nghe âm vang hơn, cuống lưỡi rụt sâu hơn so với âm "oang" trong Tiếng Việt.',
}

const uengFinal: PhoneticSound = {
  letter: 'ueng',
  characteristic: 'Vận mẫu mũi cuống lưỡi, tròn môi.',
  howTo: [
    'Khi phát âm, đầu tiên tròn môi để phát âm âm u, sau đó mở miệng trượt sang âm e (ngả sang ơ), cuối cùng hạ hàm đồng thời rụt cuống lưỡi lại để chặn vòm họng, cảm nhận rõ luồng hơi lên mũi bị bịt lại, hai hàm từ tròn đến mở to.',
    'Làm rung dây thanh trong cổ họng khi phát âm.',
  ],
  soundLike: 'Nghe âm vang hơn, cuống lưỡi rụt sâu hơn, miệng tròn hơn so với âm "uâng" trong Tiếng Việt.',
}

export const PHONETICS_LESSONS: PhoneticsLesson[] = [
  {
    number: 1,
    title: 'Bài 1 · Thanh mẫu môi, vận mẫu đơn, thanh điệu',
    initialGroups: [
      [b, p],
      [m, f],
    ],
    finalGroups: [
      [aFinal, oFinal],
      [eFinal, iFinal],
      [uFinal, uUmlautFinal],
    ],
    showTones: true,
    toneSectionTitle: '🎵 Thanh điệu',
    syllableTables: [
      {
        vowelLabels: SYLLABLE_VOWELS,
        rows: [
          { consonant: 'b', cells: ['ba', 'bo', null, 'bi', 'bu', null] },
          { consonant: 'p', cells: ['pa', 'po', null, 'pi', 'pu', null] },
          { consonant: 'm', cells: ['ma', 'mo', 'me', 'mi', 'mu', null] },
          { consonant: 'f', cells: ['fa', 'fo', null, null, 'fu', null] },
        ],
      },
    ],
    notes: [],
  },
  {
    number: 2,
    title: 'Bài 2 · Thanh mẫu đầu lưỡi & cuống lưỡi',
    initialGroups: [
      [d, t],
      [n, l],
      [g, k],
      [h],
    ],
    finalGroups: [],
    showTones: true,
    toneSectionTitle: '🎵 Thanh điệu (ôn tập)',
    syllableTables: [
      {
        vowelLabels: SYLLABLE_VOWELS,
        rows: [
          { consonant: 'd', cells: ['da', null, 'de', 'di', 'du', null] },
          { consonant: 't', cells: ['ta', null, 'te', 'ti', 'tu', null] },
          { consonant: 'n', cells: ['na', null, 'ne', 'ni', 'nu', 'nü'] },
          { consonant: 'l', cells: ['la', null, 'le', null, 'lu', 'lü'] },
          { consonant: 'g', cells: ['ga', null, 'ge', null, 'gu', null] },
          { consonant: 'k', cells: ['ka', null, 'ke', null, 'ku', null] },
          { consonant: 'h', cells: ['ha', null, 'he', null, 'hu', null] },
        ],
      },
    ],
    notes: [
      {
        title: 'Viết liền âm tiết trong từ nhiều âm tiết',
        intro: 'Một từ do nhiều âm tiết cấu tạo thành thì khi viết phiên âm phải viết liền. Ví dụ:',
        examples: [
          { hanzi: '皮肤', pinyin: 'pífū', meaning: 'Da' },
          { hanzi: '鼻涕', pinyin: 'bítì', meaning: 'Nước mũi' },
          { hanzi: '可乐', pinyin: 'kělè', meaning: 'Cola' },
        ],
      },
      {
        title: 'Cách phân biệt hai âm n và l',
        intro: 'Người học bịt mũi khi phát âm, âm nào thấy rung mũi là âm n, không rung là âm l.',
      },
      {
        title: 'Cách sửa các lỗi sai âm "h" điển hình',
        intro: 'Âm h có 2 cách đọc sai phổ biến:',
        bullets: [
          { label: 'Đọc giống "h" trong "Hà Nội"', text: 'Cuống lưỡi không ma sát với họng.' },
          { label: 'Đọc giống "kh" trong "khà khà"', text: 'Phần ma sát nông ở phía ngoài hơn so với âm "h" trong Tiếng Trung.' },
        ],
        outro:
          'Để không mắc hai lỗi sai này, có thể dùng mẹo sau: hình dung như khi đang ngậm quả táo trong miệng để vồng vòm họng lên; hoặc ngửa mặt nhẹ như đang súc miệng nước muối, phần sâu trong cuống họng chặn lại để nước muối không đi xuống, âm thanh "khò khò" phát ra từ sâu trong cuống họng tạo ra âm "h".',
      },
    ],
  },
  {
    number: 3,
    title: 'Bài 3 · Vận mẫu ghép, biến điệu thanh 3',
    initialGroups: [],
    finalGroups: [
      [aiFinal, eiFinal],
      [aoFinal, ouFinal],
      [anFinal, enFinal],
      [angFinal, engFinal],
      [ongFinal],
    ],
    showTones: false,
    toneSectionTitle: '🎵 Thanh điệu · Quy tắc biến điệu của thanh ba',
    // Ví dụ kinh điển 你好/古老 và 你很美/我很好 — giống sách, cùng 1 bộ ví dụ lặp lại giữa các quy tắc
    // để thấy rõ 1 câu bị biến điệu khác nhau tuỳ số âm tiết thanh 3 đứng liền nhau.
    toneSandhi: [
      {
        title: 'Khi hai âm tiết cùng mang thanh ba đi liền nhau, âm tiết đầu đọc thành thanh hai:',
        variants: [
          {
            examples: [
              { before: 'Nǐ hǎo', after: 'Ní hǎo', hanzi: '你好', meaning: 'Xin chào.' },
              { before: 'gǔlǎo', after: 'gúlǎo', hanzi: '古老', meaning: 'Cổ xưa.' },
            ],
          },
        ],
      },
      {
        title: 'Khi ba âm tiết cùng mang thanh 3 liền nhau, có thể biến điệu:',
        variants: [
          {
            label: 'Hai âm tiết đầu đọc thành thanh hai',
            examples: [
              { before: 'nǐ hěn měi', after: 'ní hén měi', hanzi: '你很美', meaning: 'Bạn rất đẹp.' },
              { before: 'wǒ hěn hǎo', after: 'wó hén hǎo', hanzi: '我很好', meaning: 'Tôi rất khỏe.' },
            ],
          },
          {
            label: 'Âm tiết thứ hai đọc thành thanh hai',
            examples: [
              { before: 'nǐ hěn měi', after: 'nǐ hén měi', hanzi: '你很美', meaning: 'Bạn rất đẹp.' },
              { before: 'wǒ hěn hǎo', after: 'wǒ hén hǎo', hanzi: '我很好', meaning: 'Tôi rất khỏe.' },
            ],
          },
        ],
      },
      {
        title: 'Khi sau âm tiết mang thanh 3 là âm tiết thanh 1, thanh 2 hoặc thanh 4, thì âm tiết đó đọc thành nửa thanh 3',
        variants: [],
        plainNote:
          'Tức là chỉ đọc phần trước của thanh 3, không đọc nửa phần lên giọng ở phía sau và đọc tiếp ngay âm tiết sau. Ví dụ: hěn máng, hǎo ma…',
      },
    ],
    endingComparison: {
      title: 'Phân biệt vận mẫu đuôi -n và -ng',
      left: {
        label: 'Âm -n',
        soundFeature: 'Vận mẫu mũi đầu lưỡi.',
        howTo: 'Đầu lưỡi phải tì chặt vào sau lợi trên và giữ nguyên cho đến khi kết thúc phát âm.',
        auralTip: 'Âm yếu, nghe hơi tắc.',
      },
      right: {
        label: 'Âm -ng',
        soundFeature: 'Vận mẫu mũi cuống lưỡi.',
        howTo: 'Cuống lưỡi áp sát vòm họng và không được rời ra trước khi kết thúc phát âm.',
        auralTip: 'Âm vang, to, kéo dài.',
      },
    },
    // Vận mẫu kép (9 cột) thay cho SYLLABLE_VOWELS mặc định — dùng lại 11 thanh mẫu đã học ở Bài 1+2.
    // Đã đối chiếu với ngữ âm tiếng Trung chuẩn và sửa 2 ô nhiều khả năng lệch khi số hoá từ ảnh sách
    // (cột "an" hàng f trùng "fen" 2 lần → sửa thành "fan"; cột "ang" hàng t bị thiếu → thêm "tang") —
    // nên đối chiếu lại với sách gốc nếu thấy khác.
    syllableTables: [
      {
        vowelLabels: ['ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong'],
        rows: [
          { consonant: 'b', cells: ['bai', 'bei', 'bao', null, 'ban', 'ben', 'bang', 'beng', null] },
          { consonant: 'p', cells: ['pai', 'pei', 'pao', 'pou', 'pan', 'pen', 'pang', 'peng', null] },
          { consonant: 'm', cells: ['mai', 'mei', 'mao', 'mou', 'man', 'men', 'mang', 'meng', null] },
          { consonant: 'f', cells: [null, 'fei', null, 'fou', 'fan', 'fen', 'fang', 'feng', null] },
          { consonant: 'd', cells: ['dai', 'dei', 'dao', 'dou', 'dan', null, 'dang', 'deng', 'dong'] },
          { consonant: 't', cells: ['tai', null, 'tao', 'tou', 'tan', null, 'tang', 'teng', 'tong'] },
          { consonant: 'n', cells: ['nai', 'nei', 'nao', null, 'nan', 'nen', 'nang', 'neng', 'nong'] },
          { consonant: 'l', cells: ['lai', 'lei', 'lao', 'lou', 'lan', null, 'lang', 'leng', 'long'] },
          { consonant: 'g', cells: ['gai', 'gei', 'gao', 'gou', 'gan', 'gen', 'gang', 'geng', 'gong'] },
          { consonant: 'k', cells: ['kai', null, 'kao', 'kou', 'kan', 'ken', 'kang', 'keng', 'kong'] },
          { consonant: 'h', cells: ['hai', 'hei', 'hao', 'hou', 'han', 'hen', 'hang', 'heng', 'hong'] },
        ],
      },
    ],
    notes: [
      {
        title: 'Cách đánh dấu thanh điệu — ưu tiên a rồi đến e/o',
        intro:
          'Khi vận mẫu kép có nguyên âm a, thanh điệu được viết trên a. Khi không có a, thanh điệu lần lượt được viết trên e và o theo thứ tự ưu tiên giảm dần. Ví dụ:',
        examples: [
          { hanzi: '包', pinyin: 'bāo', meaning: 'Túi, bao' },
          { hanzi: '楼', pinyin: 'lóu', meaning: 'Tòa nhà, lầu' },
          { hanzi: '美', pinyin: 'měi', meaning: 'Đẹp' },
          { hanzi: '胖', pinyin: 'pàng', meaning: 'Béo, mập' },
        ],
      },
      {
        title: 'Đánh dấu thanh điệu trên vận mẫu i — bỏ dấu chấm',
        intro: 'Khi đánh dấu thanh điệu trên vận mẫu i, cần bỏ dấu chấm trên i. Ví dụ:',
        examples: [
          { hanzi: '滴', pinyin: 'dī', meaning: 'Nhỏ giọt' },
          { hanzi: '鼻', pinyin: 'bí', meaning: 'Mũi' },
          { hanzi: '礼', pinyin: 'lǐ', meaning: 'Lễ' },
          { hanzi: '密', pinyin: 'mì', meaning: 'Kín, mật' },
        ],
      },
      {
        title: 'Dấu cách âm (\')',
        intro:
          'Khi vận mẫu a, o, e đứng đầu một âm tiết, liền ngay sau một âm tiết khác, để tránh nhầm lẫn khi phát âm cần có thêm dấu cách âm. Ví dụ:',
        examples: [
          { hanzi: '答案', pinyin: "dá'àn", meaning: 'Đáp án' },
          { hanzi: '木偶', pinyin: "mù'ǒu", meaning: 'Con rối' },
          { hanzi: '洪恩', pinyin: "hóng'ēn", meaning: 'Hồng ân' },
        ],
      },
    ],
  },
  {
    number: 4,
    title: 'Bài 4 · Thanh mẫu mặt lưỡi, vận mẫu ü ghép, thanh nhẹ',
    initialGroups: [[j, q], [x]],
    finalGroups: [[ueFinal, uUmlautAnFinal], [unFinal]],
    showTones: false,
    toneSectionTitle: '🎵 Thanh điệu · Thanh nhẹ',
    neutralTone: {
      intro: [
        'Mỗi âm tiết Tiếng Trung đều mang thanh điệu, nhưng trong một số từ và câu thường mất đi thanh điệu vốn có, đọc nhẹ và yếu hơn. Khi đó thanh điệu của âm tiết đó đã biến thành "thanh nhẹ". Trong kí hiệu phiên âm, thanh nhẹ là âm tiết không có kí hiệu thanh điệu ở trên đầu.',
        'Thanh nhẹ luôn luôn xuất hiện sau âm tiết khác hoặc xen giữa từ ngữ, không bao giờ xuất hiện ở đầu từ hoặc đầu câu. Độ cao của thanh nhẹ thay đổi do ảnh hưởng của thanh điệu âm tiết trước đó.',
      ],
      howTo: 'Đọc nhấn mạnh và rõ ràng âm đầu tiên, sau đó đọc ngắn, nhẹ, nhanh âm tiết mang thanh nhẹ.',
      examples: [
        { hanzi: '妈妈', pinyin: 'māma', meaning: 'Mẹ' },
        { hanzi: '白的', pinyin: 'báide', meaning: 'Cái màu trắng' },
        { hanzi: '你们', pinyin: 'nǐmen', meaning: 'Các bạn' },
        { hanzi: '爸爸', pinyin: 'bàba', meaning: 'Bố' },
      ],
      distinguishNote: {
        title: 'Phân biệt thanh điệu bình thường và thanh nhẹ',
        bullets: [
          'Độ dài của các âm tương đương nhau thì đó là các âm mang thanh điệu bình thường.',
          'Âm trước hơi kéo dài và được nhấn hơn âm sau, âm sau đọc nhẹ và lướt, thì âm sau là âm mang thanh nhẹ.',
          'Nghe hơi na ná nhưng lại không rõ âm thanh của các thanh 1, 2, 3, 4, thì là âm tiết mang thanh nhẹ.',
        ],
      },
    },
    // Vận mẫu bảng ghép âm của Bài 4: i, ü, üe, üan, ün — j/q/x chỉ đi được với 5 vận mẫu này (xem ghi
    // chú "Quy tắc kết hợp" bên dưới), khác hẳn bảng a-o-e-i-u-ü hay vận mẫu kép của các bài trước.
    syllableTables: [
      {
        vowelLabels: ['i', 'ü', 'üe', 'üan', 'ün (-un)'],
        rows: [
          { consonant: 'j', cells: ['ji', 'ju', 'jue', 'juan', 'jun'] },
          { consonant: 'q', cells: ['qi', 'qu', 'que', 'quan', 'qun'] },
          { consonant: 'x', cells: ['xi', 'xu', 'xue', 'xuan', 'xun'] },
        ],
      },
    ],
    notes: [
      {
        title: 'Quy tắc kết hợp của j, q, x',
        intro:
          'Các thanh mẫu j, q, x sẽ luôn đi với các vận mẫu có "i" đứng đầu, hoặc vận mẫu có "ü" đứng đầu. Do đó sẽ không có trường hợp j, q, x đi với các vận mẫu như "ao", "an", "en", "u", "ei"…',
      },
      {
        title: 'Quy tắc ghi phiên âm của vận mẫu ü',
        intro:
          'Khi đứng sau các thanh mẫu j, q, x (và y), vận mẫu ü được viết tắt thành "u" (bỏ 2 dấu chấm) — vì nhóm thanh mẫu này chỉ ghép được với ü, không bao giờ ghép với u nên không sợ nhầm lẫn. Vì vậy bảng ghép âm phía dưới viết "ju/qu/xu/jun/qun/xun" chứ không phải "jü/qü/xü/jün/qün/xün".',
        outro: 'Sau n và l thì vẫn viết đủ 2 dấu chấm (nü, lü — xem Bài 2) vì n/l ghép được với cả u lẫn ü, bỏ dấu sẽ gây nhầm lẫn.',
      },
    ],
  },
  {
    number: 5,
    title: 'Bài 5 · Vận mẫu ghép có "i" đứng đầu',
    // Không có thanh mẫu mới — cả 3 thanh mẫu mặt lưỡi (j/q/x) đã học đủ ở Bài 4, bài này chỉ thêm
    // vận mẫu ghép mới rồi ghép lại với TẤT CẢ thanh mẫu phụ âm đã học từ Bài 1-4.
    initialGroups: [],
    finalGroups: [
      [iaFinal, ieFinal],
      [iaoFinal, iouFinal],
      [ianFinal, iangFinal],
      [inFinal, ingFinal],
      [iongFinal],
    ],
    // Bài này không có nội dung thanh điệu mới (không showTones/toneSandhi/neutralTone) — PhoneticsSection
    // tự bỏ qua cả khối "Thanh điệu" khi cả 3 đều rỗng/false, không cần xử lý riêng gì thêm ở đây.
    showTones: false,
    toneSectionTitle: '',
    // Bảng ghép âm lớn nhất từ trước tới giờ: 11 thanh mẫu đã học (b/p/m/f/d/t/n/l/j/q/x — bỏ g/k/h vì
    // nhóm cuống lưỡi không ghép được với vận mẫu "i" đứng đầu) × 9 vận mẫu mới của bài này.
    syllableTables: [
      {
        vowelLabels: ['ia', 'ie', 'ian', 'iang', 'iao', 'iu', 'in', 'ing', 'iong'],
        rows: [
          { consonant: 'b', cells: [null, 'bie', 'bian', null, 'biao', null, 'bin', 'bing', null] },
          { consonant: 'p', cells: [null, 'pie', 'pian', null, 'piao', null, 'pin', 'ping', null] },
          { consonant: 'm', cells: [null, 'mie', 'mian', null, 'miao', 'miu', 'min', 'ming', null] },
          { consonant: 'f', cells: [null, null, null, null, null, null, null, null, null] },
          { consonant: 'd', cells: [null, 'die', 'dian', null, 'diao', 'diu', null, 'ding', null] },
          { consonant: 't', cells: [null, 'tie', 'tian', null, 'tiao', null, null, 'ting', null] },
          { consonant: 'n', cells: [null, 'nie', 'nian', 'niang', 'niao', 'niu', 'nin', 'ning', null] },
          { consonant: 'l', cells: ['lia', 'lie', 'lian', 'liang', 'liao', 'liu', 'lin', 'ling', null] },
          { consonant: 'j', cells: ['jia', 'jie', 'jian', 'jiang', 'jiao', 'jiu', 'jin', 'jing', 'jiong'] },
          { consonant: 'q', cells: ['qia', 'qie', 'qian', 'qiang', 'qiao', 'qiu', 'qin', 'qing', 'qiong'] },
          { consonant: 'x', cells: ['xia', 'xie', 'xian', 'xiang', 'xiao', 'xiu', 'xin', 'xing', 'xiong'] },
        ],
      },
    ],
    notes: [
      {
        title: 'Phân biệt cách đọc âm ie và üe',
        intro: 'So sánh 2 âm dễ nhầm lẫn:',
        bullets: [
          { label: 'ie', text: 'Hai mép bẹt sang hai bên ngay từ đầu âm.' },
          { label: 'üe', text: 'Lúc đầu môi tròn, sau đó mở dần sang hai bên.' },
        ],
      },
    ],
  },
  {
    number: 6,
    title: 'Bài 6 · Thanh mẫu uốn lưỡi, vần cuốn lưỡi "er", biến điệu 不/一',
    initialGroups: [[zh, ch], [sh, r]],
    finalGroups: [[erFinal]],
    showTones: false,
    toneSectionTitle: '🎵 Thanh điệu · Quy tắc biến điệu của 不 và 一',
    // Không phải review 4 thanh hay biến điệu thanh 3 (Bài 3) — đây là 2 từ CHỨC NĂNG cực hay dùng
    // (不 "không", 一 "một") có cách đọc đổi tuỳ thanh điệu âm tiết theo sau, nên tái dùng cấu trúc
    // toneSandhi nhưng mỗi ví dụ chỉ cần hiện đúng 1 cách đọc cuối (before để trống — xem type).
    toneSandhi: [
      {
        title: '"不" (bù) đứng độc lập, hoặc đứng trước thanh 1/thanh 2/thanh 3 → đọc là "bù" (giữ nguyên)',
        variants: [
          {
            examples: [
              { after: 'bù zhīdào', hanzi: '不知道', meaning: 'Không biết' },
              { after: 'bùtóng', hanzi: '不同', meaning: 'Không giống' },
              { after: 'bù hǎo', hanzi: '不好', meaning: 'Không tốt' },
            ],
          },
        ],
      },
      {
        title: '"不" (bù) đứng trước thanh 4 → đọc là "bú"',
        variants: [
          {
            examples: [
              { after: 'búyào', hanzi: '不要', meaning: 'Không cần, đừng' },
              { after: 'búshì', hanzi: '不是', meaning: 'Không phải' },
              { after: 'bú rènshi', hanzi: '不认识', meaning: 'Không quen biết' },
            ],
          },
        ],
      },
      {
        title: '"不" đứng giữa cấu trúc lặp "A不A" hoặc trong 1 số từ ghép cố định → đọc thành thanh nhẹ "bu"',
        variants: [
          {
            examples: [
              { after: 'hǎobuhǎo', hanzi: '好不好', meaning: 'Tốt không' },
              { after: 'děngbují', hanzi: '等不及', meaning: 'Không đợi được' },
              { after: 'duìbuqǐ', hanzi: '对不起', meaning: 'Xin lỗi' },
            ],
          },
        ],
      },
      {
        title: '"一" (yī) đứng độc lập, đếm số, đọc số → đọc là "yī" (giữ nguyên)',
        variants: [
          {
            examples: [
              { after: 'èrshíyī', hanzi: '二十一', meaning: 'Hai mươi mốt' },
              { after: 'dì yī', hanzi: '第一', meaning: 'Thứ nhất' },
              { after: 'chū yī', hanzi: '初一', meaning: 'Mùng một' },
            ],
          },
        ],
      },
      {
        title: '"一" đứng trước thanh 1/thanh 2/thanh 3 → đọc là "yì"',
        variants: [
          {
            examples: [
              { after: 'yìbān', hanzi: '一般', meaning: 'Thường' },
              { after: 'yìshēng', hanzi: '一生', meaning: 'Cả đời' },
              { after: 'yìzhí', hanzi: '一直', meaning: 'Luôn, thẳng' },
              { after: 'yìqí', hanzi: '一齐', meaning: 'Cùng lúc' },
              { after: 'yìqǐ', hanzi: '一起', meaning: 'Cùng nhau' },
              { after: 'yìkǒu', hanzi: '一口', meaning: 'Một hơi, một miệng' },
            ],
          },
        ],
      },
      {
        title: '"一" đứng trước thanh 4 → đọc là "yí"',
        variants: [
          {
            examples: [
              { after: 'yídìng', hanzi: '一定', meaning: 'Nhất định' },
              { after: 'yígòng', hanzi: '一共', meaning: 'Tổng cộng' },
            ],
          },
        ],
      },
    ],
    syllableTables: [
      {
        vowelLabels: SYLLABLE_VOWELS,
        rows: [
          { consonant: 'zh', cells: ['zha', null, 'zhe', 'zhi', 'zhu', null] },
          { consonant: 'ch', cells: ['cha', null, 'che', 'chi', 'chu', null] },
          { consonant: 'sh', cells: ['sha', null, 'she', 'shi', 'shu', null] },
          { consonant: 'r', cells: [null, null, 're', 'ri', 'ru', null] },
        ],
      },
      {
        vowelLabels: ['ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong'],
        rows: [
          { consonant: 'zh', cells: ['zhai', 'zhei', 'zhao', 'zhou', 'zhan', 'zhen', 'zhang', 'zheng', 'zhong'] },
          { consonant: 'ch', cells: ['chai', null, 'chao', 'chou', 'chan', 'chen', 'chang', 'cheng', 'chong'] },
          { consonant: 'sh', cells: ['shai', 'shei', 'shao', 'shou', 'shan', 'shen', 'shang', 'sheng', null] },
          { consonant: 'r', cells: [null, null, 'rao', 'rou', 'ran', 'ren', 'rang', 'reng', 'rong'] },
        ],
      },
    ],
    notes: [
      {
        title: 'Một số lưu ý',
        intro: 'Với nhóm âm đầu lưỡi sau (uốn lưỡi):',
        plainBullets: [
          'Ngoài cử động lưỡi thì việc cong môi cũng trợ giúp rất nhiều cho việc điều chỉnh âm thanh phát ra đúng.',
          'Âm zh là âm tắc, vì vậy khi phát âm không được tạo thành các âm ma sát, có tiếng "xì xì".',
          'Khi các thanh mẫu nhóm này đi với kí tự "i" thì "i" phải đọc thành âm "ư".',
        ],
      },
      {
        title: 'Cách viết vần cuốn lưỡi (儿化)',
        intro: 'Vận mẫu thêm âm cuốn lưỡi "er" tạo thành "vần cuốn lưỡi" — quy tắc khi viết:',
        plainBullets: [
          'Khi viết phiên âm, thêm "r" sau vận mẫu của âm tiết.',
          'Khi viết chữ Hán thêm "儿" vào sau chữ Hán.',
          'Một số từ nhất thiết phải cuốn lưỡi để thể hiện sự khác biệt về từ loại hay nghĩa từ.',
        ],
      },
    ],
  },
  {
    number: 7,
    title: 'Bài 7 · Thanh mẫu đầu lưỡi trước (z, c, s)',
    initialGroups: [[z, c], [s]],
    finalGroups: [],
    showTones: false,
    toneSectionTitle: '',
    groupComparison: {
      title: 'Phân biệt các nhóm âm',
      columns: [
        { title: 'Âm mặt lưỡi', subtitle: 'j, q, x' },
        { title: 'Âm đầu lưỡi sau', subtitle: 'zh, ch, sh' },
        { title: 'Âm đầu lưỡi trước', subtitle: 'z, c, s' },
      ],
      rows: [
        {
          label: 'Cách phát âm',
          cells: [
            ['Đầu lưỡi thẳng, mặt lưỡi bẹt, ngang;', 'Môi kéo dẹt ra như khi cười mỉm hết cỡ;', 'Hai hàm răng sát nhau nhưng song song, hàm trên không phủ lên hàm dưới.'],
            ['Đầu lưỡi uốn cong lên trên;', 'Môi cong ra ngoài, môi trên cong lên, môi dưới cong xuống;', 'Hai hàm răng hơi cách nhau.'],
            ['Đầu lưỡi thẳng;', 'Môi không động đậy;', 'Hai hàm răng sát nhau nhưng không cắn chặt, răng hàm trên phủ lên răng hàm dưới.'],
          ],
        },
        {
          label: 'Cách luyện đọc ban đầu',
          cells: [
            'Khoé miệng được kéo sang hai bên như cười mỉm, lưỡi phẳng, bẹt, dẹt, hai cạnh lưỡi chạm nhẹ vào khoảng hở giữa hai hàm răng, đầu lưỡi chạm mặt trong hàm răng dưới rồi đọc.',
            'Miệng hơi mở, răng trên và dưới hơi hé để thấy lưỡi uốn lên: cho đầu lưỡi nhích dần từ sau lợi lên và đưa về phía sau, đến khi đầu lưỡi chạm vào phần nếp nhăn ở vòm họng thì mới phát âm.',
            'Môi hé mở, hai hàm răng sát nhau, răng trên và dưới khít, răng trên che khuất đỉnh răng dưới, không để chừa khe hở. Khi đọc, hàm dưới đẩy nhẹ ra ngoài so với hàm trên, mặt đầu lưỡi miết lên phần lợi trên tạo ra tiếng gió.',
          ],
        },
        {
          label: 'Phân biệt bằng thính giác',
          cells: ['Âm thoáng, mở.', 'Âm hơi đóng, tiếng vang và um um như tiếng trống.', 'Âm thoáng, mở, nghe rõ tiếng gió ở đầu âm.'],
        },
        {
          label: 'Phân biệt khi ghép với i',
          cells: ['Nghe âm cuối là "i".', 'Nghe âm cuối là "ư".', 'Nghe âm cuối là "ư".'],
        },
      ],
    },
    syllableTables: [
      {
        vowelLabels: SYLLABLE_VOWELS,
        rows: [
          { consonant: 'z', cells: ['za', null, 'ze', 'zi', 'zu', null] },
          { consonant: 'c', cells: ['ca', null, 'ce', 'ci', 'cu', null] },
          { consonant: 's', cells: ['sa', null, 'se', 'si', 'su', null] },
        ],
      },
      {
        vowelLabels: ['ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong'],
        rows: [
          { consonant: 'z', cells: ['zai', 'zei', 'zao', 'zou', 'zan', 'zen', 'zang', 'zeng', 'zong'] },
          { consonant: 'c', cells: ['cai', null, 'cao', 'cou', 'can', 'cen', 'cang', 'ceng', 'cong'] },
          { consonant: 's', cells: ['sai', null, 'sao', 'sou', 'san', 'sen', 'sang', 'seng', 'song'] },
        ],
      },
    ],
    notes: [
      {
        title: 'Chú ý',
        intro: 'Khi các thanh mẫu này đi với kí tự "i" thì "i" phải đọc thành âm "ư".',
      },
    ],
  },
  {
    number: 8,
    title: 'Bài 8 · Vận mẫu ghép có "u" đứng đầu',
    // Không có thanh mẫu mới — bài này chỉ thêm vận mẫu ghép rồi ghép lại với các thanh mẫu đầu lưỡi
    // (d/t/n/l/z/c/s) và thanh mẫu cuống lưỡi/uốn lưỡi (g/h/k/zh/ch/sh/r) đã học từ trước.
    initialGroups: [],
    finalGroups: [
      [uaFinal, uoFinal],
      [uaiFinal, ueiFinal],
      [uanFinal, uenFinal],
      [uangFinal, uengFinal],
    ],
    showTones: false,
    toneSectionTitle: '',
    // 2 bảng ghép âm tách theo nhóm thanh mẫu, giống Bài 6/7 — cột "ueng" trống ở MỌI hàng vì "ueng"
    // trong tiếng Trung chuẩn chỉ tồn tại độc lập (weng 翁), không ghép với bất kỳ thanh mẫu nào. Đã
    // đối chiếu lại với ngữ âm chuẩn và sửa cột "uai" ở các hàng zh/ch/sh/g/h/k (dễ bị số hoá nhầm
    // thành "ai" khi thiếu chữ "u" — vd "guai" 乖 chứ không phải "gai" 该) — nên đối chiếu lại với
    // sách gốc nếu thấy khác.
    syllableTables: [
      {
        vowelLabels: ['ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang', 'ueng'],
        rows: [
          { consonant: 'd', cells: [null, 'duo', null, 'dui', 'duan', 'dun', null, null] },
          { consonant: 't', cells: [null, 'tuo', null, 'tui', 'tuan', 'tun', null, null] },
          { consonant: 'n', cells: [null, 'nuo', null, null, 'nuan', null, null, null] },
          { consonant: 'l', cells: [null, 'luo', null, null, 'luan', 'lun', null, null] },
          { consonant: 'z', cells: [null, 'zuo', null, 'zui', 'zuan', 'zun', null, null] },
          { consonant: 'c', cells: [null, 'cuo', null, 'cui', 'cuan', 'cun', null, null] },
          { consonant: 's', cells: [null, 'suo', null, 'sui', 'suan', 'sun', null, null] },
        ],
      },
      {
        vowelLabels: ['ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang', 'ueng'],
        rows: [
          { consonant: 'zh', cells: ['zhua', 'zhuo', 'zhuai', 'zhui', 'zhuan', 'zhun', 'zhuang', null] },
          { consonant: 'ch', cells: ['chua', 'chuo', 'chuai', 'chui', 'chuan', 'chun', 'chuang', null] },
          { consonant: 'sh', cells: ['shua', 'shuo', 'shuai', 'shui', 'shuan', 'shun', 'shuang', null] },
          { consonant: 'r', cells: ['rua', 'ruo', null, 'rui', 'ruan', 'run', null, null] },
          { consonant: 'g', cells: ['gua', 'guo', 'guai', 'gui', 'guan', 'gun', 'guang', null] },
          { consonant: 'h', cells: ['hua', 'huo', 'huai', 'hui', 'huan', 'hun', 'huang', null] },
          { consonant: 'k', cells: ['kua', 'kuo', 'kuai', 'kui', 'kuan', 'kun', 'kuang', null] },
        ],
      },
    ],
    notes: [],
  },
]
