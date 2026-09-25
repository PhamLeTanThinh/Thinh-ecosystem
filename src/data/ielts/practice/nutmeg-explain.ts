import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'
import { linear } from './linear'

// Giải thích từng câu của "Nutmeg — a valuable spice" (id q1…q13 khớp với reading.ts) — do tôi tự soạn từ bài
// đọc; ĐÁP ÁN đã đối chiếu khớp 100% answer key chính thức. Viết theo đúng khuôn của venus-explain.ts /
// seti-explain.ts.
const chip =
  (color: ChipColor) =>
  (text: string, label?: string): ExChip => ({ text, color, label })
const o = chip('orange')
const g = chip('green')
const b = chip('blue')
const r = chip('red')
const s = (text: string, color?: ChipColor) => ({ text, color })

export const EXPLAIN: Record<string, Explanation> = {
  q1: {
    paraphrase: {
      question: [s('The leaves', 'orange'), s(' of the tree are ___ '), s('in shape', 'green')],
      pairs: [
        { left: o('The leaves', 'Exact word'), right: o('leaves') },
        { left: g('___ in shape', 'cần 1 TÍNH TỪ chỉ hình dạng'), right: g('oval', 'hình bầu dục') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('The tree', 'S'), b('is thickly branched', 'V'), b('with dense foliage of'), b('tough, dark green', 'tính từ chỉ độ cứng, màu'), g('oval', 'tính từ chỉ HÌNH DẠNG'), o('leaves', 'N')] }],
    },
    notes: '→ Chỗ trống đứng sau "are" và trước "in shape" → cần 1 **tính từ chỉ hình dạng**\n→ Trong cụm "tough, dark green oval leaves": tough = độ cứng, dark green = màu, **oval** = hình dạng\n⇒ Đáp án: **oval** {ok}',
  },

  q2: {
    paraphrase: {
      question: [s('The ___ '), s('surrounds the fruit', 'orange'), s(' and '), s('breaks open', 'green'), s(' when '), s('the fruit is ripe', 'blue')],
      pairs: [
        { left: o('surrounds the fruit', 'bao quanh quả'), right: o('The fruit is encased in a fleshy husk', 'quả được bọc trong lớp vỏ') },
        { left: g('breaks open', 'tách ra'), right: g('splits into two halves', 'tách làm đôi') },
        { left: b('when the fruit is ripe', 'Exact word'), right: b('When the fruit is ripe') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('The fruit', 'S'), b('is encased in', 'V — được bọc trong'), o('a fleshy husk', 'lớp vỏ thịt')] },
        { n: 2, chips: [b('When the fruit is ripe'), ',', o('this husk', 'S'), g('splits into two halves', 'V = breaks open'), b('along a ridge....')] },
      ],
    },
    notes: '→ Chỗ trống đứng sau "The" và làm chủ ngữ của "surrounds" → cần 1 **danh từ**\n→ [[1]] "encased in a fleshy husk" = surrounds the fruit\n→ [[2]] "this husk splits into two halves" = breaks open when the fruit is ripe\n⇒ Đáp án: **husk** {ok}',
  },

  q3: {
    paraphrase: {
      question: [s('The ___ is '), s('used to produce', 'orange'), s(' '), s('the spice nutmeg', 'green')],
      pairs: [
        { left: o('is used to produce', 'được dùng để làm ra'), right: o('being produced from', 'được làm ra từ') },
        { left: g('the spice nutmeg'), right: g('the former (= nutmeg)', 'the former = cái được nhắc trước') },
      ],
    },
    breakdown: {
      sentences: [
        { chips: [b('These', 'S'), b('are the sources of', 'V'), b('the two spices nutmeg and mace'), ',', g('the former', '= nutmeg'), o('being produced from', 'được làm từ'), b('the dried seed', 'đáp án'), b('and'), b('the latter', '= mace'), b('from the aril')] },
      ],
    },
    notes: '→ "the two spices **nutmeg** and **mace**, **the former** … and **the latter** …" — the former = cái nhắc đến trước = nutmeg, the latter = cái sau = mace\n→ nutmeg is produced "from the dried **seed**"\n→ Chỉ được điền ONE WORD → "seed" (không viết "dried seed")\n⇒ Đáp án: **seed** {ok}',
  },

  q4: {
    paraphrase: {
      question: [s('The covering known as '), s('the aril', 'orange'), s(' is '), s('used to produce', 'green'), s(' ___')],
      pairs: [
        { left: o('the aril', 'Exact word'), right: o('the aril') },
        { left: g('is used to produce ___'), right: g('the latter (= mace) … from the aril', 'the latter = mace') },
      ],
    },
    breakdown: {
      sentences: [
        { chips: [b('the two spices nutmeg and mace'), ',', b('the former', '= nutmeg'), b('being produced from the dried seed'), b('and'), o('the latter', '= mace'), g('from the aril', '(being produced) from the aril')] },
      ],
    },
    notes: '→ Cùng câu với câu 3: "the latter from the aril" — vế sau lược bỏ "being produced"\n→ the latter = spice được nhắc sau trong "nutmeg and **mace**"\n→ Dòng cuối "The tree has yellow flowers and fruit" không phải câu hỏi, chỉ là thông tin có sẵn\n⇒ Đáp án: **mace** {ok}',
  },

  q5: {
    paraphrase: {
      question: [s('In the Middle Ages', 'orange'), s(', '), s('most Europeans', 'blue'), s(' '), s('knew where nutmeg was grown', 'green'), s('.')],
      pairs: [
        { left: o('In the Middle Ages', 'Exact word'), right: o('in the Middle Ages') },
        { left: b('most Europeans'), right: b('merchants based in Venice') },
        { left: g('knew where nutmeg was grown', 'biết nơi trồng'), right: g('they never revealed the exact location of the source', 'không bao giờ tiết lộ nguồn gốc'), rel: '≠' },
      ],
    },
    detail: linear({
      question: [b('In the Middle Ages', 'Time'), g('most Europeans', 'S'), r('knew where nutmeg was grown', 'V - biết nơi trồng nhục đậu khấu'), '.'],
      keywords: '"Middle Ages", "Europeans", "where nutmeg was grown"',
      where: 'đoạn 2',
      topic: 'nói về việc buôn nhục đậu khấu thời Trung Cổ',
      quote: 'Throughout this period, **the Arabs were the exclusive importers of the spice to Europe**. They sold nutmeg for high prices to merchants based in Venice, but **they never revealed the exact location of the source** of this extremely valuable commodity.',
      evidence: [
        [g('the Arabs', 'S'), b('were the exclusive importers', 'V - nhà nhập khẩu duy nhất')],
        [g('They', 'S'), b('sold nutmeg to merchants in Venice'), '→', r('never revealed the exact location', 'không bao giờ tiết lộ nơi trồng')],
      ],
      mainIdea: 'Người Ả Rập **giấu kín nguồn gốc** → người châu Âu (kể cả thương nhân mua trực tiếp) **không biết** nơi trồng.',
      inPassage: 'never revealed the exact location of the source.',
      inQuestion: 'most Europeans knew where nutmeg was grown.',
      conclusion: 'Thông tin **trái ngược**.',
      answer: 'FALSE',
      others: [
        ['TRUE', 'chỉ đúng nếu bài nói người châu Âu biết nơi trồng → bài nói nơi trồng bị giấu kín.'],
        ['NOT GIVEN', 'bài nói rõ nguồn gốc không được tiết lộ.'],
      ],
    }),
  },

  q6: {
    paraphrase: {
      question: [s('The VOC', 'orange'), s(' was '), s('the world’s first major trading company', 'green'), s('.')],
      pairs: [
        { left: o('The VOC', 'Exact word'), right: o('the VOC') },
        { left: g('the world’s first major trading company', 'công ty thương mại lớn ĐẦU TIÊN'), right: g('the richest commercial operation in the world', 'GIÀU NHẤT thế giới'), note: 'richest ≠ first — bài không nói VOC có phải là công ty đầu tiên hay không' },
      ],
    },
    detail: linear({
      question: [g('The VOC', 'S'), r('was the world’s first major trading company', 'V - công ty thương mại lớn đầu tiên'), '.'],
      keywords: '"VOC", "first", "trading company"',
      where: 'đoạn 4',
      topic: 'nói về VOC',
      quote: 'In 1602, Dutch merchants founded the VOC, a trading corporation better known as the Dutch East India Company. By 1617, **the VOC was the richest commercial operation in the world**.',
      evidence: [
        [b('In 1602', 'Time'), g('Dutch merchants', 'S'), b('founded the VOC', 'V - thành lập')],
        [b('By 1617', 'Time'), g('the VOC', 'S'), r('was the richest commercial operation', 'GIÀU NHẤT, không phải đầu tiên')],
      ],
      mainIdea: 'VOC là công ty **giàu nhất** thế giới vào 1617 → **không nói có phải công ty đầu tiên** hay không.',
      inPassage: 'richest (giàu nhất).',
      inQuestion: 'first (đầu tiên).',
      conclusion: 'richest ≠ first → bài đọc **không cung cấp** thông tin.',
      answer: 'NOT GIVEN',
      others: [
        ['TRUE', 'chỉ đúng nếu bài nói VOC là công ty thương mại lớn đầu tiên → bài không nói.'],
        ['FALSE', 'chỉ đúng nếu bài nói đã có công ty lớn khác trước VOC → bài cũng không nói.'],
      ],
    }),
  },

  q7: {
    paraphrase: {
      question: [s('Following the Treaty of Breda', 'orange'), s(', the Dutch '), s('had control of all the islands', 'green'), s(' where nutmeg grew.')],
      pairs: [
        { left: o('Following the Treaty of Breda', 'sau hiệp ước Breda'), right: o('the Treaty of Breda, in 1667 … The British agreed') },
        { left: g('had control of all the islands where nutmeg grew', 'kiểm soát TẤT CẢ đảo trồng nhục đậu khấu'), right: g('securing their hold over every nutmeg-producing island … The Dutch now had a monopoly', 'nắm giữ mọi đảo sản xuất → độc quyền') },
      ],
    },
    detail: linear({
      question: [b('Following the Treaty of Breda', 'Time'), g('the Dutch', 'S'), r('had control of all the islands where nutmeg grew', 'V - kiểm soát mọi đảo trồng nhục đậu khấu'), '.'],
      keywords: '"Treaty of Breda", "control", "all the islands"',
      where: 'đoạn 5',
      topic: 'nói về cuộc đổi đảo Run lấy Manhattan',
      quote: 'There was only one obstacle to Dutch domination. One of the Banda Islands, … Run, … was under the control of the British. … **Intent on securing their hold over every nutmeg-producing island**, the Dutch offered a trade … The British agreed. … **The Dutch now had a monopoly over the nutmeg trade**',
      evidence: [
        [b('only one obstacle', 'Run - đảo duy nhất thuộc Anh')],
        [b('the Treaty of Breda'), '→', b('The British agreed', 'Anh đồng ý đổi Run')],
      ],
      result: [g('The Dutch', 'S'), b('now', 'sau hiệp ước'), r('had a monopoly over the nutmeg trade', 'độc quyền')],
      mainIdea: 'Sau hiệp ước, Hà Lan có nốt đảo Run → **nắm mọi đảo trồng nhục đậu khấu**.',
      inPassage: 'securing their hold over every nutmeg-producing island … now had a monopoly.',
      inQuestion: 'had control of all the islands where nutmeg grew.',
      conclusion: 'Cùng ý → **khớp**.',
      answer: 'TRUE',
      others: [
        ['FALSE', 'chỉ đúng nếu vẫn còn đảo nào không thuộc Hà Lan → Run là trở ngại duy nhất và đã được trao.'],
        ['NOT GIVEN', 'bài nói rõ kết quả sau hiệp ước.'],
      ],
    }),
  },

  q8: {
    paraphrase: {
      question: [s('Middle Ages', 'blue'), s(' — Nutmeg '), s('was brought to Europe', 'orange'), s(' by the ___')],
      pairs: [
        { left: b('Middle Ages', 'Exact word'), right: b('in the Middle Ages') },
        { left: o('was brought to Europe by', 'được đưa tới châu Âu bởi'), right: o('were the exclusive importers of the spice to Europe', 'là nhà nhập khẩu duy nhất vào châu Âu') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Throughout this period', '= Middle Ages'), ',', g('the Arabs', 'S — đáp án'), b('were', 'V'), o('the exclusive importers of the spice to Europe', '= brought nutmeg to Europe')] }],
    },
    notes: '→ "Throughout this period" = thời Trung Cổ (câu trước vừa nhắc "in the Middle Ages")\n→ importers of the spice to Europe = brought nutmeg to Europe\n→ Không chọn "merchants" (thương nhân Venice) — họ chỉ MUA lại từ người Ả Rập\n⇒ Đáp án: **Arabs** {ok}',
  },

  q9: {
    paraphrase: {
      question: [s('17th century', 'blue'), s(' — '), s('Demand for nutmeg grew', 'orange'), s(', as it was believed to be '), s('effective against the disease', 'green'), s(' known as the ___')],
      pairs: [
        { left: o('Demand for nutmeg grew', 'nhu cầu tăng'), right: o('Everybody wanted nutmeg', 'ai cũng muốn có') },
        { left: g('believed to be effective against the disease', 'được tin là trị được bệnh'), right: g('they decided nutmeg held the cure', 'cho rằng nhục đậu khấu là thuốc chữa') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('thousands of people across Europe', 'S'), b('were dying of', 'V'), g('the plague', 'đáp án'), b(', a highly contagious and deadly disease', '= the disease')] },
        { n: 2, chips: [b('Doctors'), b('were desperate for a way to stop the spread of this disease'), ',', b('and'), b('they decided'), g('nutmeg held the cure', '= effective against')] },
        { n: 3, chips: [o('Everybody wanted nutmeg', '= demand grew')] },
      ],
    },
    notes: '→ Mốc thời gian: VOC 1602–1617 → thế kỷ 17\n→ [[1]] căn bệnh = "**the plague**, a highly contagious and deadly disease"\n→ [[2]] bác sĩ tin nhục đậu khấu chữa được bệnh này → [[3]] ai cũng muốn có (demand grew)\n⇒ Đáp án: **plague** {ok}',
  },

  q10: {
    paraphrase: {
      question: [s('The Dutch — put ___ '), s('on nutmeg', 'orange'), s(' '), s('to avoid it being cultivated outside the islands', 'green')],
      pairs: [
        { left: o('put ___ on nutmeg', 'phủ ___ lên hạt'), right: o('all exported nutmeg was covered with lime', 'hạt xuất khẩu được phủ vôi') },
        { left: g('to avoid it being cultivated outside the islands', 'tránh bị trồng ở nơi khác'), right: g('to make sure there was no chance a fertile seed which could be grown elsewhere would leave the islands') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('In addition'), ',', b('all exported nutmeg', 'S'), o('was covered with', 'V = put … on'), g('lime', 'đáp án — vôi'), b('to make sure there was no chance a fertile seed which could be grown elsewhere would leave the islands', 'mục đích = avoid being cultivated outside')] }],
    },
    notes: '→ "was covered with lime" = put lime on nutmeg\n→ mục đích "no chance a fertile seed which could be grown elsewhere would leave the islands" = to avoid it being cultivated outside the islands\n⇒ Đáp án: **lime** {ok}',
  },

  q11: {
    paraphrase: {
      question: [s('The Dutch — '), s('finally obtained', 'orange'), s(' the island of ___ '), s('from the British', 'green')],
      pairs: [
        { left: o('finally obtained', 'cuối cùng giành được'), right: o('After decades of fighting … if the British would give them the island of Run') },
        { left: g('from the British'), right: g('was under the control of the British') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('One of the Banda Islands'), ',', b('a sliver of land called'), o('Run', 'đáp án'), b(', was under the control of the British', 'thuộc Anh')] },
        { n: 2, chips: [b('if the British would give them the island of Run'), ',', b('they would in turn give Britain … Manhattan'), '.', b('The British agreed', '→ Hà Lan có được Run')] },
      ],
    },
    notes: '→ [[1]] Run là đảo duy nhất thuộc Anh\n→ [[2]] "After decades of fighting" (= finally) Anh đồng ý đổi Run cho Hà Lan lấy Manhattan\n→ Không chọn "Manhattan" — đó là đảo Hà Lan ĐƯA cho Anh, không phải đảo Hà Lan nhận được\n⇒ Đáp án: **Run** {ok}',
  },

  q12: {
    paraphrase: {
      question: [s('1770', 'blue'), s(' — '), s('nutmeg plants were secretly taken to', 'orange'), s(' ___')],
      pairs: [
        { left: b('1770', 'Exact word'), right: b('in 1770') },
        { left: o('were secretly taken to', 'bị bí mật mang tới'), right: o('successfully smuggled nutmeg plants to safety in', 'buôn lậu cây tới') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Then, in 1770'), ',', b('a Frenchman named Pierre Poivre', 'S'), o('successfully smuggled', 'V — smuggle = secretly take'), b('nutmeg plants to safety in'), g('Mauritius', 'đáp án'), b(', an island off the coast of Africa')] }],
    },
    notes: '→ smuggled = secretly taken (buôn lậu = mang đi bí mật)\n→ Không chọn "Caribbean" hay "Grenada" — cây được đưa tới đó SAU này ("later exported"), không phải năm 1770\n⇒ Đáp án: **Mauritius** {ok}',
  },

  q13: {
    paraphrase: {
      question: [s('1778', 'blue'), s(' — '), s('half the Banda Islands’ nutmeg plantations', 'orange'), s(' '), s('were destroyed by', 'green'), s(' a ___')],
      pairs: [
        { left: b('1778', 'Exact word'), right: b('in 1778') },
        { left: o('half the … nutmeg plantations'), right: o('half the nutmeg groves') },
        { left: g('were destroyed by', 'bị phá huỷ bởi'), right: g('caused a tsunami that wiped out', 'gây ra sóng thần xoá sổ') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Next, in 1778'), ',', b('a volcanic eruption in the Banda region', 'S'), b('caused', 'V'), g('a tsunami', 'O — đáp án'), b('that'), g('wiped out', '= destroyed'), o('half the nutmeg groves', '= plantations')] }],
    },
    notes: '→ wiped out = destroyed, groves = plantations\n→ Chủ thể trực tiếp phá huỷ là "a **tsunami**" (mệnh đề "that wiped out…" bổ nghĩa cho tsunami)\n→ "volcanic eruption" là nguyên nhân gián tiếp và dài 2 từ, sai giới hạn ONE WORD ONLY\n⇒ Đáp án: **tsunami** {ok}',
  },
}
