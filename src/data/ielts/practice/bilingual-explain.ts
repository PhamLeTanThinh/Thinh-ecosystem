import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'
import { linear } from './linear'

// Giải thích từng câu của "The Benefits of Being Bilingual" (id q1…q14 khớp với reading.ts) — do tôi tự soạn từ
// bài đọc; ĐÁP ÁN đã đối chiếu khớp 100% answer key chính thức. Câu 6-10 (Yes/No/Not Given) dùng khuôn Linear
// thinking (linear()).
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
      question: [s('Observing', 'orange'), s(' the ___ of '), s('Russian-English bilingual people', 'blue'), s(' when '), s('asked to select certain objects', 'green')],
      pairs: [
        { left: o('Observing', 'quan sát'), right: o('comes from studying', 'đến từ việc nghiên cứu') },
        { left: b('Russian-English bilingual people', 'Exact word'), right: b('A Russian-English bilingual') },
        { left: g('asked to select certain objects', 'được yêu cầu chọn đồ vật'), right: g('asked to ‘pick up a marker’ from a set of objects') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('Some of the most compelling evidence for this phenomenon', 'S'), b('comes from', 'V'), b('studying', '= observing'), o('eye movements', 'đáp án')] },
        { n: 2, chips: [b('A Russian-English bilingual asked to ‘pick up a marker’ from a set of objects', 'S'), b('would look more at a stamp', 'V — nhìn vào con tem nhiều hơn')] },
      ],
    },
    notes: '→ [[1]] studying eye movements = observing the eye movements\n→ [[2]] ví dụ cụ thể: người song ngữ Nga-Anh được yêu cầu nhặt "marker" lại **nhìn** vào con tem (marka) nhiều hơn → điều được quan sát là chuyển động của mắt\n→ 2 từ, đúng giới hạn NO MORE THAN TWO WORDS\n⇒ Đáp án: **eye movements** {ok}',
  },

  q2: {
    paraphrase: {
      question: [s('Bilingual people engage both languages simultaneously', 'orange'), s(': a mechanism '), s('known as', 'green'), s(' ___')],
      pairs: [
        { left: o('engage both languages simultaneously', 'dùng cả 2 ngôn ngữ cùng lúc'), right: o('when a bilingual person uses one language, the other is active at the same time') },
        { left: g('a mechanism known as', 'cơ chế được gọi là'), right: g('this phenomenon, called', 'hiện tượng này được gọi là') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('when a bilingual person uses one language'), ',', o('the other is active at the same time', '= engage both languages simultaneously')] },
        { n: 2, chips: [b('Some of the most compelling evidence for'), g('this phenomenon, called', '= a mechanism known as'), b('‘language co-activation’', 'đáp án')] },
      ],
    },
    notes: '→ [[1]] Khi dùng 1 ngôn ngữ, ngôn ngữ kia cũng hoạt động cùng lúc = engage both languages simultaneously\n→ [[2]] hiện tượng này được gọi là "**language co-activation**" (2 từ — "co-activation" có gạch nối tính là 1 từ)\n⇒ Đáp án: **language co-activation** {ok}',
  },

  q3: {
    paraphrase: {
      question: [s('A test called the ___'), s(', '), s('focusing on naming colours', 'orange')],
      pairs: [
        { left: b('A test called the ___'), right: b('In the classic Stroop Task') },
        { left: o('focusing on naming colours', 'tập trung vào việc gọi tên màu'), right: o('are asked to name the colour of the word’s font', 'được yêu cầu nói tên màu của chữ') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('In the classic'), g('Stroop Task', 'đáp án — tên bài kiểm tra'), ',', b('people', 'S'), b('see a word'), b('and'), o('are asked to name the colour of the word’s font', '= focusing on naming colours')] }],
    },
    notes: '→ Bài kiểm tra yêu cầu "name the colour of the word’s font" = focusing on naming colours\n→ Tên bài kiểm tra: "the classic **Stroop Task**" (2 từ)\n⇒ Đáp án: **Stroop Task** {ok}',
  },

  q4: {
    paraphrase: {
      question: [s('Bilingual people', 'blue'), s(' '), s('are more able to handle', 'orange'), s(' tasks involving '), s('a skill called', 'green'), s(' ___')],
      pairs: [
        { left: b('Bilingual people', 'Exact word'), right: b('bilingual people') },
        { left: o('are more able to handle', 'xử lý tốt hơn'), right: o('often perform better on', 'thường làm tốt hơn') },
        { left: g('tasks involving a skill called ___'), right: g('tasks that require conflict management', 'nhiệm vụ đòi hỏi kỹ năng xử lý xung đột') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('For this reason'), ',', b('bilingual people', 'S'), o('often perform better on', 'V = are more able to handle'), b('tasks that require'), g('conflict management', 'đáp án')] }],
    },
    notes: '→ perform better on = are more able to handle\n→ tasks that require **conflict management** = tasks involving a skill called ___\n→ Ngay sau đó bài giới thiệu Stroop Task làm ví dụ cho dạng nhiệm vụ này → khớp với hàng "Stroop Task" trong bảng\n⇒ Đáp án: **conflict management** {ok}',
  },

  q5: {
    paraphrase: {
      question: [s('When changing strategies', 'orange'), s(', bilingual people '), s('have superior', 'green'), s(' ___')],
      pairs: [
        { left: o('When changing strategies', 'khi đổi chiến lược'), right: o('when having to make rapid changes of strategy') },
        { left: g('have superior ___', 'có ___ vượt trội'), right: g('reflecting better cognitive control', 'cho thấy khả năng kiểm soát nhận thức tốt hơn') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('they', 'S = bilinguals'), b('do so more quickly than monolingual people'), ',', g('reflecting better', 'better = superior'), g('cognitive control', 'đáp án'), o('when having to make rapid changes of strategy', '= when changing strategies')] }],
    },
    notes: '→ Hàng thứ 3 của bảng: "A test involving switching between tasks" = bài chuyển từ phân loại theo màu sang theo hình\n→ "reflecting better **cognitive control** when having to make rapid changes of strategy"\n→ better = superior; rapid changes of strategy = changing strategies\n⇒ Đáp án: **cognitive control** {ok}',
  },

  q6: {
    paraphrase: {
      question: [s('Attitudes towards bilingualism', 'orange'), s(' '), s('have changed', 'green'), s(' '), s('in recent years', 'blue'), s('.')],
      pairs: [
        { left: b('in recent years'), right: b('In the past … Over the past few decades, however') },
        { left: o('Attitudes towards bilingualism', 'quan điểm về song ngữ'), right: o('such children were considered to be at a disadvantage', 'trẻ song ngữ từng bị coi là bất lợi') },
        { left: g('have changed', 'đã thay đổi'), right: g('identifying several clear benefits of being bilingual', 'nay xác định được nhiều lợi ích rõ ràng') },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('Attitudes towards bilingualism', 'S - quan điểm về song ngữ'), r('have changed in recent years', 'V - đã thay đổi những năm gần đây'), '.'],
      keywords: '"attitudes", "bilingualism", "changed"',
      where: 'đoạn A',
      topic: 'so sánh cách nhìn về người song ngữ trước đây và hiện nay',
      quote: '**In the past, such children were considered to be at a disadvantage** compared with their monolingual peers. **Over the past few decades, however**, technological advances have allowed researchers to look more deeply at how bilingualism interacts with and changes the cognitive and neurological systems, thereby **identifying several clear benefits of being bilingual**.',
      evidence: [
        [b('In the past', 'Time'), g('such children', 'S = trẻ song ngữ'), r('were considered to be at a disadvantage', 'V - bị coi là bất lợi')],
        [b('Over the past few decades, however', 'Time - đối lập với trước đây'), g('researchers', 'S'), r('identifying several clear benefits', 'xác định nhiều lợi ích rõ ràng')],
      ],
      mainIdea: 'Trước đây song ngữ bị coi là **bất lợi**; vài thập kỷ gần đây lại được chứng minh có **nhiều lợi ích** → cách nhìn đã **đổi**.',
      inPassage: 'Từ "bất lợi" (in the past) chuyển sang "lợi ích rõ ràng" (over the past few decades).',
      inQuestion: 'Quan điểm về song ngữ **đã thay đổi** gần đây.',
      conclusion: 'Cùng ý → **khớp**.',
      answer: 'YES',
      others: [
        ['NO', 'chỉ đúng nếu tác giả nói cách nhìn về song ngữ vẫn như cũ → tác giả nói ngược lại.'],
        ['NOT GIVEN', 'tác giả so sánh rõ quá khứ và hiện tại.'],
      ],
    }),
  },

  q7: {
    paraphrase: {
      question: [s('Bilingual people', 'orange'), s(' '), s('are better than monolingual people', 'green'), s(' at '), s('guessing correctly what words are before they are finished', 'blue'), s('.')],
      pairs: [
        { left: b('guessing … what words are before they are finished'), right: b('Long before the word is finished, the brain’s language system begins to guess what that word might be') },
        { left: g('are better than monolingual people', 'giỏi hơn người đơn ngữ'), note: 'không có thông tin — bài chỉ nói người song ngữ kích hoạt từ ở CẢ 2 ngôn ngữ, không so sánh ai đoán ĐÚNG hơn' },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('Bilingual people', 'S'), r('are better than monolingual people at guessing correctly what words are', 'V - đoán từ đúng hơn người đơn ngữ'), b('before they are finished', 'trước khi nghe hết từ'), '.'],
      keywords: '"guess", "before the word is finished"',
      where: 'đoạn B',
      topic: 'nói về cách não nhận diện từ khi nghe',
      quote: '**Long before the word is finished, the brain’s language system begins to guess what that word might be.** … For bilingual people, **this activation is not limited to a single language**; auditory input activates corresponding words regardless of the language to which they belong.',
      evidence: [
        [b('Long before the word is finished', 'Time'), g('the brain’s language system', 'S - não của MỌI người'), b('begins to guess', 'V - bắt đầu đoán')],
        [b('For bilingual people'), g('this activation', 'S'), r('is not limited to a single language', 'kích hoạt ở cả 2 ngôn ngữ — không nói đoán ĐÚNG hơn')],
      ],
      mainIdea: 'Ai cũng đoán từ trước khi nghe hết; người song ngữ chỉ **kích hoạt từ ở cả 2 ngôn ngữ** → **không so sánh độ chính xác** khi đoán.',
      inPassage: 'Người song ngữ kích hoạt từ ở nhiều ngôn ngữ hơn.',
      inQuestion: 'Người song ngữ **đoán đúng hơn** người đơn ngữ.',
      conclusion: 'Bài đọc **không cung cấp** thông tin so sánh độ chính xác khi đoán từ.',
      answer: 'NOT GIVEN',
      others: [
        ['YES', 'chỉ đúng nếu tác giả nói người song ngữ đoán từ chính xác hơn → bài không nói.'],
        ['NO', 'chỉ đúng nếu tác giả nói người song ngữ đoán kém hơn hoặc ngang bằng → bài cũng không nói.'],
      ],
    }),
  },

  q8: {
    paraphrase: {
      question: [s('Bilingual people', 'orange'), s(' '), s('consistently', 'blue'), s(' '), s('name images faster', 'green'), s(' than monolingual people.')],
      pairs: [
        { left: o('Bilingual people'), right: o('knowing more than one language') },
        { left: g('name images faster', 'gọi tên hình ảnh NHANH hơn'), right: g('name pictures more slowly', 'gọi tên hình ảnh CHẬM hơn'), rel: '≠' },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('Bilingual people', 'S'), r('consistently name images faster', 'V - luôn gọi tên hình ảnh nhanh hơn'), b('than monolingual people'), '.'],
      keywords: '"name", "images", "faster"',
      where: 'đoạn C',
      topic: 'nói về những khó khăn do phải dùng 2 ngôn ngữ',
      quote: 'Having to deal with this persistent linguistic competition can result in difficulties, however. For instance, **knowing more than one language can cause speakers to name pictures more slowly**, and can increase ‘tip-of-the-tongue states’',
      evidence: [
        [b('this persistent linguistic competition', 'S'), b('can result in difficulties', 'V - gây khó khăn')],
        [g('knowing more than one language', 'S = bilingual'), b('can cause speakers to'), r('name pictures more slowly', 'gọi tên hình CHẬM hơn')],
      ],
      mainIdea: 'Biết nhiều ngôn ngữ khiến người nói **gọi tên hình ảnh chậm hơn**.',
      inPassage: 'name pictures more slowly.',
      inQuestion: 'name images faster.',
      conclusion: 'faster **trái ngược** với more slowly.',
      answer: 'NO',
      others: [
        ['YES', 'chỉ đúng nếu tác giả nói người song ngữ gọi tên hình nhanh hơn → tác giả nói ngược lại.'],
        ['NOT GIVEN', 'tác giả nói rõ tốc độ gọi tên hình ảnh.'],
      ],
    }),
  },

  q9: {
    paraphrase: {
      question: [s('Bilingual people’s brains', 'orange'), s(' '), s('process single sounds more efficiently', 'green'), s(' than monolingual people '), s('in all situations', 'blue'), s('.')],
      pairs: [
        { left: g('process single sounds more efficiently', 'xử lý âm thanh hiệu quả hơn'), right: g('the bilingual listeners’ neural response is considerably larger', 'phản ứng thần kinh lớn hơn — CHỈ khi có tiếng ồn') },
        { left: b('in all situations', 'trong MỌI tình huống'), right: b('without any intervening background noise, they show highly similar brain stem responses', 'không có tiếng ồn → phản ứng GIỐNG nhau'), rel: '≠' },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('Bilingual people’s brains', 'S'), r('process single sounds more efficiently than monolingual people', 'V - xử lý âm thanh hiệu quả hơn'), r('in all situations', 'trong MỌI tình huống'), '.'],
      keywords: '"sounds", "more efficiently", "all situations"',
      where: 'đoạn D',
      topic: 'nói về cách não xử lý âm thanh',
      quote: 'When monolingual and bilingual adolescents listen to simple speech sounds **without any intervening background noise, they show highly similar brain stem responses**. When researchers play the same sound to both groups **in the presence of background noise, however, the bilingual listeners’ neural response is considerably larger**',
      evidence: [
        [b('without any background noise', 'điều kiện 1 - không ồn'), g('monolingual and bilingual adolescents', 'S'), r('show highly similar brain stem responses', 'phản ứng GIỐNG nhau')],
        [b('in the presence of background noise', 'điều kiện 2 - có ồn'), g('the bilingual listeners’ neural response', 'S'), b('is considerably larger', 'lớn hơn hẳn')],
      ],
      mainIdea: 'Người song ngữ chỉ xử lý âm thanh tốt hơn **khi có tiếng ồn**; không có ồn thì **như nhau**.',
      inPassage: 'Tốt hơn chỉ trong 1 điều kiện (có tiếng ồn nền).',
      inQuestion: 'Tốt hơn trong **mọi** tình huống.',
      conclusion: '"in all situations" **trái ngược** với việc không ồn thì giống nhau.',
      answer: 'NO',
      others: [
        ['YES', 'chỉ đúng nếu người song ngữ tốt hơn cả khi không có tiếng ồn → bài nói lúc đó như nhau.'],
        ['NOT GIVEN', 'bài nói rõ cả 2 điều kiện (có và không có tiếng ồn).'],
      ],
    }),
  },

  q10: {
    paraphrase: {
      question: [s('Fewer bilingual people', 'orange'), s(' than monolingual people '), s('suffer from brain disease', 'green'), s(' '), s('in old age', 'blue'), s('.')],
      pairs: [
        { left: g('brain disease'), right: g('Alzheimer’s disease, a degenerative brain disease') },
        { left: b('in old age'), right: b('Older bilinguals … during aging') },
        { left: o('Fewer bilingual people … suffer from', 'ÍT người song ngữ mắc bệnh hơn'), note: 'không có thông tin — bài chỉ nói người song ngữ có TRIỆU CHỨNG muộn hơn, không nói số người mắc bệnh ít hơn' },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('Fewer bilingual people than monolingual people', 'S - ÍT người song ngữ hơn'), r('suffer from brain disease', 'V - mắc bệnh não'), b('in old age', 'Time'), '.'],
      keywords: '"brain disease", "old age"',
      where: 'đoạn F',
      topic: 'nói về lợi ích của song ngữ với người già và bệnh Alzheimer',
      quote: 'In a study of over 200 patients with Alzheimer’s disease, a degenerative brain disease, **bilingual patients reported showing initial symptoms of the disease an average of five years later** than monolingual patients. … Surprisingly, **the bilinguals’ brains had more physical signs of disease** than their monolingual counterparts',
      evidence: [
        [g('bilingual patients', 'S - vẫn là BỆNH NHÂN'), r('showing initial symptoms … five years later', 'triệu chứng xuất hiện MUỘN hơn')],
        [g('the bilinguals’ brains', 'S'), b('had more physical signs of disease', 'thậm chí nhiều dấu hiệu bệnh hơn')],
      ],
      mainIdea: 'Người song ngữ vẫn mắc Alzheimer, chỉ **biểu hiện muộn hơn** → bài **không nói tỉ lệ người mắc bệnh** ít hơn.',
      inPassage: 'Triệu chứng xuất hiện muộn hơn ~5 năm.',
      inQuestion: '**Ít** người song ngữ **mắc bệnh** hơn.',
      conclusion: 'Bài đọc **không cung cấp** thông tin về số lượng / tỉ lệ người mắc bệnh.',
      answer: 'NOT GIVEN',
      others: [
        ['YES', 'chỉ đúng nếu tác giả nói người song ngữ ít mắc bệnh não hơn → bài chỉ nói triệu chứng đến muộn.'],
        ['NO', 'chỉ đúng nếu tác giả nói người song ngữ mắc bệnh nhiều hơn hoặc ngang bằng → bài cũng không nói ("more physical signs" là về mức độ tổn thương, không phải số người mắc).'],
      ],
    }),
  },

  q11: {
    paraphrase: {
      question: [s('an example of how bilingual and monolingual people’s brains '), s('respond differently', 'green'), s(' to a certain type of '), s('non-verbal auditory input', 'orange')],
      pairs: [
        { left: o('non-verbal auditory input', 'âm thanh không phải lời nói'), right: o('the same sound … in the presence of background noise', 'cùng 1 âm thanh khi có tiếng ồn nền') },
        { left: g('respond differently', 'phản ứng khác nhau'), right: g('the bilingual listeners’ neural response is considerably larger', 'phản ứng thần kinh lớn hơn hẳn') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('without any intervening background noise'), ',', b('they', 'S'), b('show highly similar brain stem responses', 'không ồn → giống nhau')] },
        { n: 2, chips: [o('in the presence of background noise', 'loại âm thanh cụ thể'), ',', g('the bilingual listeners’ neural response is considerably larger', '= respond differently')] },
      ],
    },
    notes: '→ Đoạn D so sánh phản ứng não của 2 nhóm với cùng 1 âm thanh: [[1]] không ồn thì như nhau, [[2]] **có tiếng ồn nền** thì não người song ngữ phản ứng mạnh hơn\n→ background noise = a certain type of non-verbal auditory input; neural response considerably larger = respond differently\n→ Đoạn G {no} có "a tinkling sound" nhưng đó là tín hiệu để dạy trẻ 1 quy tắc, không so sánh phản ứng não\n⇒ Đáp án là **D** {ok}',
  },

  q12: {
    paraphrase: {
      question: [s('a demonstration of how '), s('a bilingual upbringing', 'orange'), s(' has benefits '), s('even before we learn to speak', 'green')],
      pairs: [
        { left: o('a bilingual upbringing', 'lớn lên trong môi trường song ngữ'), right: o('babies growing up in … bilingual homes') },
        { left: g('even before we learn to speak', 'trước cả khi biết nói'), right: g('seven-month-old babies', 'trẻ 7 tháng tuổi — chưa biết nói') },
        { left: b('has benefits'), right: b('only the bilingual babies were able to successfully learn the new rule') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('the benefits associated with bilingual experience'), b('seem to start very early', 'bắt đầu từ rất sớm')] },
        { n: 2, chips: [b('researchers taught'), g('seven-month-old babies', 'trẻ chưa biết nói'), o('growing up in monolingual or bilingual homes', '= upbringing')] },
        { n: 3, chips: [b('only the bilingual babies', 'S'), b('were able to successfully learn the new rule', 'V = has benefits')] },
      ],
    },
    notes: '→ [[1]] Lợi ích của song ngữ bắt đầu từ rất sớm\n→ [[2]] Thí nghiệm với trẻ **7 tháng tuổi** (chưa biết nói) lớn lên trong gia đình song ngữ\n→ [[3]] Chỉ trẻ song ngữ học được quy tắc mới → có lợi ích\n⇒ Đáp án là **G** {ok}',
  },

  q13: {
    paraphrase: {
      question: [s('a description of '), s('the process', 'orange'), s(' by which people '), s('identify words that they hear', 'green')],
      pairs: [
        { left: g('identify words that they hear', 'nhận diện từ nghe được'), right: g('word recognition', 'nhận diện từ') },
        { left: o('the process', 'quá trình'), right: o('the sounds arrive in sequential order … the brain’s language system begins to guess', 'âm đến theo thứ tự → não bắt đầu đoán') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('When we hear a word'), ',', b('we don’t hear the entire word all at once'), ':', o('the sounds arrive in sequential order', 'bước 1')] },
        { n: 2, chips: [b('Long before the word is finished'), ',', o('the brain’s language system begins to guess what that word might be', 'bước 2')] },
        { n: 3, chips: [b('If you hear ‘can’'), ',', b('you will likely activate words like ‘candy’ and ‘candle’', 'ví dụ'), g('during the earlier stages of word recognition', '= identify words')] },
      ],
    },
    notes: '→ Đoạn B mô tả từng bước: [[1]] âm thanh đến theo thứ tự → [[2]] não đoán từ trước khi nghe hết → [[3]] kích hoạt các từ có âm giống (can → candy, candle)\n→ Đây chính là **quá trình** nhận diện từ nghe được ("word recognition")\n⇒ Đáp án là **B** {ok}',
  },

  q14: {
    paraphrase: {
      question: [s('reference to some '), s('negative consequences', 'orange'), s(' of '), s('being bilingual', 'green')],
      pairs: [
        { left: o('negative consequences', 'hậu quả tiêu cực'), right: o('can result in difficulties', 'có thể gây khó khăn') },
        { left: g('being bilingual'), right: g('knowing more than one language') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('Having to deal with this persistent linguistic competition', 'S'), o('can result in difficulties', 'V = negative consequences'), b(', however')] },
        { n: 2, chips: [b('For instance'), ',', g('knowing more than one language', '= being bilingual'), b('can cause speakers to name pictures more slowly', 'hậu quả 1'), b('and'), b('can increase ‘tip-of-the-tongue states’', 'hậu quả 2')] },
      ],
    },
    notes: '→ [[1]] "can result in **difficulties**, however" = negative consequences\n→ [[2]] liệt kê 2 hậu quả: gọi tên hình chậm hơn, hay bị "tip-of-the-tongue" (nhớ không ra từ)\n→ Đây là đoạn DUY NHẤT nói về mặt tiêu cực của song ngữ\n⇒ Đáp án là **C** {ok}',
  },
}
