import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'
import { linear } from './linear'

// Giải thích từng câu của "The thylacine" (id q1…q13 khớp với reading.ts) — do tôi tự soạn từ bài đọc; ĐÁP ÁN
// đã đối chiếu answer key chính thức (câu 13 sửa False → Not Given theo key). Viết theo khuôn nutmeg-explain.ts.
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
      question: [s('ate', 'orange'), s(' an '), s('entirely', 'green'), s(' ___ diet')],
      pairs: [
        { left: o('ate … diet', 'chế độ ăn'), right: o('In terms of feeding', 'về mặt ăn uống') },
        { left: g('entirely', 'hoàn toàn'), right: g('exclusively', 'chỉ, duy nhất') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [o('In terms of feeding'), ',', b('it', 'S'), b('was', 'V'), g('exclusively', '= entirely'), b('carnivorous', 'đáp án — ăn thịt')] }],
    },
    notes: '→ Chỗ trống đứng giữa "entirely" và danh từ "diet" → cần 1 **tính từ**\n→ exclusively = entirely; In terms of feeding = diet\n⇒ Đáp án: **carnivorous** {ok}',
  },

  q2: {
    paraphrase: {
      question: [s('probably', 'blue'), s(' '), s('depended mainly on', 'orange'), s(' ___ '), s('when hunting', 'green')],
      pairs: [
        { left: b('probably'), right: b('were likely to') },
        { left: o('depended mainly on', 'dựa chủ yếu vào'), right: o('relied more on … than any other sense', 'dựa vào … hơn mọi giác quan khác') },
        { left: g('when hunting'), right: g('During long-distance chases', 'khi rượt đuổi đường dài') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [g('During long-distance chases', '= when hunting'), ',', b('thylacines', 'S'), b('were likely to', '= probably'), o('have relied more on', 'V = depended mainly on'), b('scent', 'đáp án — khứu giác'), b('than any other sense')] }],
    },
    notes: '→ were likely to = probably; relied more on … than any other sense = depended mainly on\n→ Chỗ trống sau "on" → cần 1 danh từ: **scent**\n⇒ Đáp án: **scent** {ok}',
  },

  q3: {
    paraphrase: {
      question: [s('young', 'orange'), s(' '), s('spent first months of life', 'green'), s(' inside its mother\'s ___')],
      pairs: [
        { left: o('young', 'con non'), right: o('Newborns', 'con sơ sinh') },
        { left: g('spent first months of life inside', 'ở trong suốt những tháng đầu'), right: g('crawled into … remaining there for up to three months', 'bò vào và ở đó tới 3 tháng') },
      ],
    },
    breakdown: {
      sentences: [
        { chips: [o('Newborns', 'S'), b('crawled into', 'V'), b('the pouch', 'đáp án — túi'), b('on the belly of their mother', '= its mother\'s'), ',', b('and attached themselves to one of the four teats'), ',', g('remaining there for up to three months', '= first months of life')] },
      ],
    },
    notes: '→ Newborns = young; "remaining there for up to three months" = spent first months of life\n→ "there" = **the pouch** on the belly of their mother\n→ Không chọn "lair" — đó là nơi con non ở SAU khi đã rời túi, lúc mẹ đi săn\n⇒ Đáp án: **pouch** {ok}',
  },

  q4: {
    paraphrase: {
      question: [s('last evidence', 'orange'), s(' in '), s('mainland Australia', 'green'), s(' is a '), s('3,100-year-old', 'blue'), s(' ___')],
      pairs: [
        { left: o('last evidence', 'bằng chứng cuối cùng'), right: o('The most recent, well-dated occurrence', 'lần xuất hiện gần nhất, có niên đại rõ') },
        { left: g('mainland Australia'), right: g('on the mainland … Western Australia') },
        { left: b('3,100-year-old'), right: b('around 3,100 years old') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [o('The most recent, well-dated occurrence of a thylacine on the mainland', 'S'), b('is', 'V'), b('a carbon-dated'), g('fossil', 'đáp án — hoá thạch'), b('from Murray Cave in Western Australia'), ',', b('which is around 3,100 years old', '= 3,100-year-old')] }],
    },
    notes: '→ most recent occurrence = last evidence\n→ "a carbon-dated **fossil** … around 3,100 years old" = a 3,100-year-old fossil\n→ Chỉ 1 từ nên không viết "carbon-dated fossil"\n⇒ Đáp án: **fossil** {ok}',
  },

  q5: {
    paraphrase: {
      question: [s('reduction in', 'orange'), s(' ___ and '), s('available sources of food', 'green'), s(' were '), s('partly responsible for', 'blue'), s(' decline in Tasmania')],
      pairs: [
        { left: o('reduction in ___', 'sự suy giảm'), right: o('loss of habitat', 'mất môi trường sống') },
        { left: g('available sources of food', 'nguồn thức ăn'), right: g('the disappearance of prey species', 'sự biến mất của con mồi') },
        { left: b('partly responsible for', 'góp 1 phần'), right: b('various other factors also contributed to', 'các yếu tố khác cũng góp phần') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('it is likely that'), b('various other factors', 'S'), b('also contributed to', 'V = partly responsible for'), b('the decline and eventual extinction of the species')] },
        { n: 2, chips: [b('These include'), b('competition with wild dogs'), ',', o('loss of', '= reduction in'), o('habitat', 'đáp án'), g('along with the disappearance of prey species', '= available sources of food'), ',', b('and a distemper-like disease')] },
      ],
    },
    notes: '→ [[1]] "various other factors also contributed to" = partly responsible for (vì nguyên nhân chính là thợ săn, những yếu tố này chỉ GÓP PHẦN)\n→ [[2]] loss of **habitat** = reduction in habitat; disappearance of prey species = (reduction in) available sources of food\n⇒ Đáp án: **habitat** {ok}',
  },

  q6: {
    paraphrase: {
      question: [s('Significant numbers of thylacines were killed', 'green'), s(' '), s('by humans', 'orange'), s(' '), s('from the 1830s onwards', 'blue'), s('.')],
      pairs: [
        { left: b('from the 1830s onwards'), right: b('began in the 1830s and continued for a century') },
        { left: o('by humans'), right: o('sheep farmers and bounty hunters with shotguns') },
        { left: g('Significant numbers … were killed', 'bị giết với số lượng lớn'), right: g('The dramatic decline … attributed to the relentless efforts of … hunters with shotguns', 'suy giảm mạnh do bị săn bắn không ngừng') },
      ],
    },
    detail: linear({
      question: [g('Significant numbers of thylacines', 'S'), r('were killed by humans from the 1830s onwards', 'V - bị con người giết từ thập niên 1830'), '.'],
      keywords: '"killed", "humans", "1830s"',
      where: 'đoạn 5',
      topic: 'nói về sự suy giảm của thylacine ở Tasmania',
      quote: '**The dramatic decline of the thylacine in Tasmania, which began in the 1830s** and continued for a century, is generally attributed to **the relentless efforts of sheep farmers and bounty hunters with shotguns**. While this determined campaign undoubtedly played a large part, …',
      evidence: [
        [g('The dramatic decline', 'S - suy giảm mạnh'), b('began in the 1830s', 'Time')],
        [b('is attributed to', 'V - do'), r('sheep farmers and bounty hunters with shotguns', 'con người săn bắn')],
      ],
      mainIdea: 'Từ thập niên 1830, thylacine **giảm mạnh do bị con người săn bắn**.',
      inPassage: 'dramatic decline from the 1830s … attributed to hunters with shotguns.',
      inQuestion: 'significant numbers killed by humans from the 1830s.',
      conclusion: 'Cùng ý → **khớp**.',
      answer: 'TRUE',
      others: [
        ['FALSE', 'chỉ đúng nếu bài nói con người giết rất ít → bài nói ngược lại.'],
        ['NOT GIVEN', 'bài nói rõ nguyên nhân và thời điểm.'],
      ],
    }),
  },

  q7: {
    paraphrase: {
      question: [s('Several', 'green'), s(' thylacines were '), s('born in zoos', 'orange'), s(' '), s('during the late 1800s', 'blue'), s('.')],
      pairs: [
        { left: o('born in zoos', 'sinh ra trong vườn thú'), right: o('breed a thylacine in captivity', 'nhân giống trong điều kiện nuôi nhốt') },
        { left: b('during the late 1800s'), right: b('in 1899') },
        { left: g('Several', 'nhiều con'), right: g('only one successful attempt', 'CHỈ 1 lần thành công'), rel: '≠' },
      ],
    },
    detail: linear({
      question: [g('Several thylacines', 'S - nhiều con'), r('were born in zoos during the late 1800s', 'V - được sinh ra trong vườn thú'), '.'],
      keywords: '"born", "zoos", "late 1800s"',
      where: 'đoạn 6',
      topic: 'nói về thylacine trong điều kiện nuôi nhốt',
      quote: '**There was only one successful attempt to breed a thylacine in captivity, at Melbourne Zoo in 1899.** This was despite the large numbers that went through some zoos, particularly London Zoo and Tasmania’s Hobart Zoo.',
      evidence: [
        [r('only one successful attempt', 'CHỈ 1 lần'), g('to breed a thylacine in captivity', '= born in zoos'), b('in 1899', 'Time')],
        [b('despite'), b('the large numbers that went through some zoos', 'nhiều con ĐI QUA vườn thú, không phải sinh ra')],
      ],
      mainIdea: 'Chỉ **1 lần** nhân giống thành công trong vườn thú (1899).',
      inPassage: 'only one successful attempt to breed.',
      inQuestion: 'several thylacines were born in zoos.',
      conclusion: 'several ≠ only one → thông tin **trái ngược**.',
      answer: 'FALSE',
      others: [
        ['TRUE', 'chỉ đúng nếu có nhiều con được sinh ra trong vườn thú → bài nói chỉ 1.'],
        ['NOT GIVEN', 'bài nói rõ số lần nhân giống thành công.'],
      ],
    }),
  },

  q8: {
    paraphrase: {
      question: [s('John Gould\'s', 'orange'), s(' '), s('prediction about the thylacine', 'blue'), s(' '), s('surprised some biologists', 'green'), s('.')],
      pairs: [
        { left: o('John Gould', 'Exact word'), right: o('The famous naturalist John Gould') },
        { left: b('prediction about the thylacine', 'lời tiên đoán'), right: b('foresaw the thylacine’s demise', 'đoán trước sự diệt vong') },
        { left: g('surprised some biologists', 'khiến 1 số nhà sinh vật học ngạc nhiên'), note: 'không có thông tin — bài không nói phản ứng của các nhà sinh vật học với lời tiên đoán này' },
      ],
    },
    detail: linear({
      question: [g('John Gould’s prediction about the thylacine', 'S - lời tiên đoán của Gould'), r('surprised some biologists', 'V - khiến 1 số nhà sinh vật học ngạc nhiên'), '.'],
      keywords: '"John Gould", "prediction", "biologists"',
      where: 'đoạn 6',
      topic: 'nói về lời tiên đoán của John Gould',
      quote: 'The famous naturalist **John Gould foresaw the thylacine’s demise** when he published his Mammals of Australia between 1848 and 1863 …',
      evidence: [[g('John Gould', 'S'), b('foresaw', 'V - tiên đoán'), b('the thylacine’s demise', 'sự diệt vong')]],
      mainIdea: 'Gould **tiên đoán** thylacine tuyệt chủng → bài **không nói phản ứng** của các nhà sinh vật học.',
      inPassage: 'Chỉ nói nội dung lời tiên đoán.',
      inQuestion: 'Lời tiên đoán **khiến các nhà sinh vật học ngạc nhiên**.',
      conclusion: 'Bài đọc **không cung cấp** thông tin về phản ứng với lời tiên đoán.',
      answer: 'NOT GIVEN',
      others: [
        ['TRUE', 'chỉ đúng nếu bài nói có nhà sinh vật học ngạc nhiên → bài không nói.'],
        ['FALSE', 'chỉ đúng nếu bài nói không ai ngạc nhiên → bài cũng không nói.'],
      ],
    }),
  },

  q9: {
    paraphrase: {
      question: [s('In the early 1900s', 'blue'), s(', '), s('many scientists', 'orange'), s(' '), s('became worried about', 'green'), s(' the possible extinction of the thylacine.')],
      pairs: [
        { left: b('In the early 1900s'), right: b('in the decades that followed (sau 1848-1863)') },
        { left: o('many scientists'), right: o('scientists … A notable exception was T.T. Flynn', 'chỉ 1 ngoại lệ') },
        { left: g('became worried about', 'trở nên lo lắng'), right: g('nor was much concern expressed', 'KHÔNG mấy lo ngại'), rel: '≠' },
      ],
    },
    detail: linear({
      question: [b('In the early 1900s', 'Time'), g('many scientists', 'S'), r('became worried about the possible extinction', 'V - lo lắng về nguy cơ tuyệt chủng'), '.'],
      keywords: '"scientists", "worried", "extinction"',
      where: 'đoạn 7',
      topic: 'nói về thái độ trước sự suy giảm của thylacine',
      quote: 'However, there seems to have been little public pressure to preserve the thylacine, **nor was much concern expressed by scientists** at the decline of this species in the decades that followed. **A notable exception was T.T. Flynn**',
      evidence: [
        [r('nor was much concern expressed', 'KHÔNG mấy lo ngại'), g('by scientists', 'S'), b('in the decades that followed', '= early 1900s')],
        [b('A notable exception', 'ngoại lệ'), b('was T.T. Flynn', 'chỉ 1 người')],
      ],
      mainIdea: 'Các nhà khoa học **không mấy lo ngại**, chỉ có **1 ngoại lệ** là Flynn.',
      inPassage: 'not much concern, only one exception.',
      inQuestion: 'many scientists became worried.',
      conclusion: 'Thông tin **trái ngược**.',
      answer: 'FALSE',
      others: [
        ['TRUE', 'chỉ đúng nếu nhiều nhà khoa học lo lắng → bài nói ít ai lo.'],
        ['NOT GIVEN', 'bài nói rõ thái độ của các nhà khoa học.'],
      ],
    }),
  },

  q10: {
    paraphrase: {
      question: [s('T. T. Flynn\'s proposal', 'orange'), s(' to '), s('rehome captive thylacines on an island', 'blue'), s(' '), s('proved to be impractical', 'green'), s('.')],
      pairs: [
        { left: o('T. T. Flynn’s proposal', 'đề xuất của Flynn'), right: o('he … suggest', 'ông đề xuất') },
        { left: b('rehome captive thylacines on an island'), right: b('some should be captured and placed on a small island') },
        { left: g('proved to be impractical', 'hoá ra không khả thi'), note: 'không có thông tin — bài không nói đề xuất có được thực hiện hay đánh giá là khả thi hay không' },
      ],
    },
    detail: linear({
      question: [g('T. T. Flynn’s proposal to rehome captive thylacines on an island', 'S - đề xuất của Flynn'), r('proved to be impractical', 'V - hoá ra không khả thi'), '.'],
      keywords: '"Flynn", "island", "impractical"',
      where: 'đoạn 7',
      topic: 'nói về đề xuất của T.T. Flynn',
      quote: 'In 1914, he was sufficiently concerned about the scarcity of the thylacine **to suggest that some should be captured and placed on a small island**. But it was not until 1929 … that Tasmania’s Animals and Birds Protection Board passed a motion …',
      evidence: [
        [g('he (= Flynn)', 'S'), b('suggest', 'V - đề xuất'), b('some should be captured and placed on a small island', 'nội dung')],
        [b('But'), b('1929 … passed a motion', 'chuyển sang chuyện luật bảo vệ')],
      ],
      mainIdea: 'Bài chỉ nói Flynn **đề xuất**, không nói đề xuất có được thực hiện hay khả thi không.',
      inPassage: 'Chỉ có nội dung đề xuất.',
      inQuestion: 'Đề xuất **không khả thi**.',
      conclusion: 'Bài đọc **không cung cấp** thông tin về kết quả của đề xuất.',
      answer: 'NOT GIVEN',
      others: [
        ['TRUE', 'chỉ đúng nếu bài nói đề xuất thất bại vì không khả thi → bài không nói.'],
        ['FALSE', 'chỉ đúng nếu bài nói đề xuất khả thi / đã thực hiện thành công → bài cũng không nói.'],
      ],
    }),
  },

  q11: {
    paraphrase: {
      question: [s('There were still '), s('reasonable numbers of thylacines', 'green'), s(' in existence when '), s('a piece of legislation protecting the species during their breeding season', 'orange'), s(' was passed.')],
      pairs: [
        { left: o('a piece of legislation … during their breeding season', 'luật bảo vệ trong mùa sinh sản'), right: o('passed a motion protecting thylacines only for the month of December, which was thought to be their prime breeding season') },
        { left: g('still reasonable numbers of thylacines', 'vẫn còn số lượng kha khá'), right: g('with the species on the very edge of extinction', 'loài ở bờ vực tuyệt chủng'), rel: '≠' },
      ],
    },
    detail: linear({
      question: [g('reasonable numbers of thylacines', 'S - còn số lượng kha khá'), r('still in existence when legislation protecting the breeding season was passed', 'V - khi luật bảo vệ mùa sinh sản ra đời'), '.'],
      keywords: '"legislation", "breeding season"',
      where: 'đoạn 7',
      topic: 'nói về luật bảo vệ thylacine năm 1929',
      quote: 'But it was not until 1929, **with the species on the very edge of extinction**, that Tasmania’s Animals and Birds Protection Board **passed a motion protecting thylacines only for the month of December**, which was thought to be their prime breeding season.',
      evidence: [
        [b('1929', 'Time'), r('the species on the very edge of extinction', 'đã sát bờ tuyệt chủng')],
        [g('the Board', 'S'), b('passed a motion protecting thylacines', 'V = legislation'), b('only for December - prime breeding season', '= breeding season')],
      ],
      mainIdea: 'Luật bảo vệ mùa sinh sản ra đời khi loài **đã ở bờ vực tuyệt chủng**.',
      inPassage: 'on the very edge of extinction.',
      inQuestion: 'still reasonable numbers.',
      conclusion: 'Thông tin **trái ngược**.',
      answer: 'FALSE',
      others: [
        ['TRUE', 'chỉ đúng nếu lúc đó còn nhiều thylacine → bài nói gần tuyệt chủng.'],
        ['NOT GIVEN', 'bài nói rõ tình trạng loài lúc đó.'],
      ],
    }),
  },

  q12: {
    paraphrase: {
      question: [s('From 1930 to 1936', 'blue'), s(', '), s('the only known living thylacines', 'orange'), s(' were '), s('all in captivity', 'green'), s('.')],
      pairs: [
        { left: b('From 1930 to 1936'), right: b('in 1930 … 7th September, 1936') },
        { left: o('the only known living thylacines'), right: o('The last known wild thylacine to be killed … leaving just …') },
        { left: g('all in captivity', 'đều bị nuôi nhốt'), right: g('leaving just captive specimens', 'chỉ còn lại các cá thể nuôi nhốt') },
      ],
    },
    detail: linear({
      question: [b('From 1930 to 1936', 'Time'), g('the only known living thylacines', 'S'), r('were all in captivity', 'V - đều bị nuôi nhốt'), '.'],
      keywords: '"1930", "1936", "captivity"',
      where: 'đoạn 7',
      topic: 'nói về những con thylacine cuối cùng',
      quote: '**The last known wild thylacine to be killed was shot** by a farmer in the north-east of Tasmania **in 1930, leaving just captive specimens**. … the last known individual died in Hobart Zoo on 7th September, 1936.',
      evidence: [
        [b('1930', 'Time'), g('the last known wild thylacine', 'S - con hoang dã cuối cùng'), b('was shot', 'V')],
        [r('leaving just captive specimens', 'chỉ còn con nuôi nhốt')],
      ],
      result: [b('1936', 'Time'), g('the last known individual', 'S'), b('died in Hobart Zoo', 'V - chết trong vườn thú')],
      mainIdea: 'Từ 1930 **chỉ còn con nuôi nhốt**, con cuối cùng chết ở Hobart Zoo năm 1936.',
      inPassage: 'leaving just captive specimens (1930 → 1936).',
      inQuestion: 'the only known living thylacines were all in captivity.',
      conclusion: 'Cùng ý → **khớp**.',
      answer: 'TRUE',
      others: [
        ['FALSE', 'chỉ đúng nếu sau 1930 vẫn còn con hoang dã được biết đến → bài nói con hoang dã cuối cùng bị bắn năm 1930.'],
        ['NOT GIVEN', 'bài có đủ mốc thời gian để kết luận.'],
      ],
    }),
  },

  // Câu 13 theo khuôn "Linear thinking" 4 bước (Explanation.detail) — mẫu do bạn cung cấp.
  q13: {
    paraphrase: {
      question: [s('Attempts to find living thylacines', 'green'), s(' '), s('are now rarely made', 'red'), s('.')],
      pairs: [
        { left: g('Attempts to find living thylacines', 'nỗ lực tìm kiếm thylacines còn sống'), right: g('expeditions and searches for the thylacine', 'những chuyến khám phá và tìm kiếm về thylacines') },
        { left: r('are **now** rarely made', 'Hiện tại hiếm khi được thực hiện'), note: 'Không được nhắc đến trong bài ⇒ **NOT GIVEN**' },
      ],
    },
    detail: [
      '😊 **Ứng dụng Linear thinking để giải quyết dạng bài True / False / Not Given**',
      '**Step 01: Read the question to understand (main idea + detail)**',
      { prefix: '• **Simplified:**', chips: [g('Attempts to find living thylacines', 'S - nỗ lực tìm kiếm thylacine còn sống'), r('are now rarely made', 'V - hiện nay rất ít'), '.'] },
      '---',
      '**Step 02: Locate relevant information**',
      '🔍 **Từ khoá**: "Attempts", "find living thylacines", "rarely made"',
      '→ Dựa vào các từ khoá trên, ta tìm được **đoạn 8** nói về hoạt động tìm kiếm thylacine qua thời gian.',
      '---',
      '**Step 03: Read relevant information to understand (main + detail)**',
      '📌 **Trích dẫn:** *"There have been* **numerous expeditions and searches for the thylacine over the years** *, none of which has produced definitive evidence that thylacines still exist. The species was declared extinct by the Tasmanian government in 1986."* (Đoạn 8)',
      '• **Simplified:**',
      { chips: [g('There have been numerous expeditions + searches', 'S - nhiều cuộc tìm kiếm và thám hiểm'), g('over the years', 'khoảng thời gian'), '→', b('but none found proof', 'Kết quả')] },
      { prefix: '**→ Result:**', chips: [b('The species', 'S - thylacine'), b('was declared extinct', 'V - đã được tuyên bố tuyệt chủng'), b('by the Tasmanian government', 'bởi chính phủ'), b('in 1986', 'Time'), '.'] },
      '• **Main idea:** **Nhiều cuộc tìm kiếm diễn ra qua nhiều năm** ⇒ không thấy bằng chứng thylacine còn tồn tại → Chính phủ **đã tuyên bố tuyệt chủng** vào năm 1986 → **không nói tần suất tìm kiếm hiện nay.**',
      '---',
      '**Step 04: Compare meaning with meaning**',
      '• **Trong bài đọc:** Có nhiều cuộc tìm kiếm "qua nhiều năm", nhưng không nói rõ hiện nay còn thường xuyên tìm kiếm hay tìm kiếm đã giảm.',
      '• **Trong câu hỏi:** Hiện nay, các nỗ lực tìm kiếm thylacine **hiếm khi diễn ra**.',
      '→ Bài đọc **không cung cấp** thông tin về mức độ thường xuyên của hoạt động tìm kiếm **hiện nay**.',
      { prefix: '⇒ ✅ **Chọn:**', chips: [o('NOT GIVEN')] },
      '---',
      '**Giải thích vì sao đáp án khác sai:**',
      '• **TRUE**: chỉ đúng nếu bài nói rõ rằng hiện nay hầu như không còn ai tìm kiếm → bài không nói.',
      '• **FALSE**: chỉ đúng nếu bài nói hiện nay có rất nhiều nỗ lực tìm kiếm → bài cũng không nói.',
    ],
  },
}
