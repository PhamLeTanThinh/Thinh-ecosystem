import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'
import { linear } from './linear'

// Giải thích từng câu của "The Search for Extra-terrestrial Intelligence" (id q1…q13 khớp với reading.ts) —
// do tôi tự soạn từ bài đọc; ĐÁP ÁN đã đối chiếu khớp answer key chính thức. Viết theo đúng khuôn của
// venus-explain.ts. Heading câu 1-4 theo key: IV, VII, I, II (đánh số theo thứ tự trong optionBank).
const chip =
  (color: ChipColor) =>
  (text: string, label?: string): ExChip => ({ text, color, label })
const o = chip('orange')
const g = chip('green')
const b = chip('blue')
const r = chip('red')
const s = (text: string, color?: ChipColor) => ({ text, color })

export const EXPLAIN: Record<string, Explanation> = {
  // Câu 1-4 (List of headings) theo khuôn "Simplify & Connection": tách TỪNG câu của đoạn thành cụm có nhãn,
  // rồi nối vai trò các câu với nhau ở notes để rút ra ý chính của đoạn → heading. Không có khối Paraphrasing
  // (danh sách heading đã hiện ngay phía trên).
  q1: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('In discussing'), b('whether', 'nghi vấn rằng'), b('we'), b('are'), b('alone'), ',', b('most SETI scientists', 'Most: hầu hết'), b('adopt', 'đưa ra'), o('2 rules', 'First & Second')] },
        { n: 2, chips: [b('First'), ',', b('UFOs are ignored'), b('since', 'because'), b('scientists'), b('don’t consider the evidence'), b('to be strong enough'), b('to bear serious consideration')] },
        { n: 3, chips: [b('Second'), ',', b('we'), b('make'), o('a conservative assumption', 'giả định thận trọng'), b('that'), b('we'), b('are looking for a life form'), b('that is well like us', 'relative clause'), b('since', 'because'), b('if + S + V....', 'giải thích lý do')] },
        { n: 4, chips: [b('In other words'), b('the life form'), b('we'), b('are looking for....', 'diễn đạt cụ thể hơn về life form khác thường')] },
      ],
    },
    notes:
      'Câu [[1]] SETI scientists adopt 2 rules\nCâu [[2]] + [[3]] nêu ra rule 1 và rule 2 theo thứ tự\nCâu [[4]] giải thích cụ thể cho rule 2\n→ Cả đoạn xoay quanh **2 rules / assumption** mà các nhà khoa học đặt ra TRƯỚC khi đi tìm — chính là các **giả định nền tảng** của việc tìm kiếm\n→ Knowledge of extra-terrestrial life forms {no} đoạn không nói ta BIẾT gì về sự sống ngoài hành tinh, chỉ nói ta GIẢ ĐỊNH nó giống ta\n→ Reasons for the search… {no} lý do tìm kiếm là nội dung đoạn A (curiosity, survival)\n⇒ Chọn **iv. Assumptions underlying the search for extra-terrestrial intelligence** {ok}',
  },

  q2: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('Even when'), b('we'), b('make'), b('these assumptions', '2 rules ở đoạn trên'), ',', b('our understanding of other life forms'), b('is limited')] },
        { n: 2, chips: [b('For example', 'Limited như thế nào'), b('we'), b('do not know'), b('how many stars have planets', 'câu hỏi trong câu khẳng định'), b('and'), b('we'), b('do not know'), b('how likely it is', 'same'), b('that'), b('life will arise naturally')] },
        { n: 3, chips: [b('However', 'Phản bác'), ',', b('when'), b('we'), b('look at'), b('the 100 billion stars....', 'liệt kê'), b('it'), o('seems inconceivable', 'seem + adj'), b('that'), b('at least'), b('one of these planets'), b('does not have'), b('a life form'), ';', b('in fact ....................', 'giải thích cho vế trước → không cần đọc')] },
        { n: 4, chips: [b('That means', 'That = câu 3'), b('that our nearest neighbours are 100 light years away'), ',', b('which is next door.....', 'relative clause')] },
      ],
    },
    notes:
      'Câu [[1]] tóm lại ý của nguyên đoạn B (these assumptions)\nCâu [[2]] đưa ví dụ giải thích our understanding is limited\nCâu [[3]] "However" phản bác lại câu 1-2: dù hiểu biết còn hạn chế, **gần như chắc chắn** có sự sống ở đâu đó (inconceivable that… does not have a life form; ước tính 1/100,000 ngôi sao) → đây là **ý chính** của đoạn\nCâu [[4]] giải thích rõ hơn cho câu [[3]]\n⇒ Ý chính: khả năng tồn tại sự sống trên các hành tinh khác\n→ Knowledge of extra-terrestrial life forms {no} bẫy từ câu 1-2 — đó chỉ là ý dẫn, bị "However" lật lại\n→ Vast distances to Earth’s closest neighbours {no} bẫy từ câu 4 — bài nói 100 light years là "next door", tức là GẦN\n⇒ Chọn **vii. Likelihood of life on other planets** {ok}',
  },

  q3: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('An alien civilisation'), b('could choose'), b('many different ways of sending information', 'nhiều cách gửi thông tin'), ',', b('but', 'đối lập'), b('many of these'), b('require too much energy'), b('or else'), b('are severely attenuated', 'bị suy yếu')] },
        { n: 2, chips: [b('It turns out that', 'hoá ra là'), ',', o('radio waves', 'loại được chọn'), b('in the frequency range 1000 to 3000 MHz'), b('travel the greatest distance'), ',', b('and so', 'kết quả'), b('all searches'), o('have concentrated on looking for radio waves', 'tập trung tìm sóng radio')] },
        { n: 3, chips: [b('So far', 'cho tới nay'), b('there have been'), b('a number of searches'), b('by various groups'), ',', b('including Australian searches....', 'ví dụ')] },
        { n: 4, chips: [b('Until now'), b('there have not been any detections', 'chưa phát hiện được gì'), b('from the few hundred stars....')] },
        { n: 5, chips: [b('The scale of the searches'), b('has been increased dramatically'), b('since 1992'), ',', b('when the US Congress voted NASA $10 million....', 'lý do tăng quy mô')] },
        { n: 6, chips: [b('Much of the money'), b('is being spent on'), b('developing the special hardware'), b('needed to search many frequencies at once')] },
        { n: 7, chips: [b('The project'), b('has two parts', 'targeted & undirected'), '.', b('One part'), b('is a targeted search....', 'tìm có mục tiêu — 1000 stars'), '.', b('The other part'), b('is an undirected search....', 'quét toàn bộ không gian')] },
      ],
    },
    notes:
      'Câu [[1]] + [[2]] giải thích vì sao chọn tìm **radio waves** (đi xa nhất) → mọi cuộc tìm kiếm đều tập trung vào sóng radio\nCâu [[3]] + [[4]] các cuộc tìm kiếm đã có và kết quả (chưa phát hiện gì)\nCâu [[5]] + [[6]] + [[7]] dự án NASA từ 1992: tiền, thiết bị và 2 phần của dự án\n→ Cả đoạn đều nói về **việc đi tìm tín hiệu radio**: tìm bằng cách nào, ai đã tìm, đang tìm ra sao\n⇒ Chọn **i. Seeking the transmission of radio signals from planets** {ok}',
  },

  q4: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('There is'), b('considerable debate', 'tranh luận lớn'), o('over how we should react', 'nên phản ứng thế nào'), b('if we detect a signal from an alien civilisation')] },
        { n: 2, chips: [b('Everybody agrees'), b('that'), b('we'), o('should not reply immediately', 'không trả lời ngay')] },
        { n: 3, chips: [b('Quite apart from', 'ngoài việc'), b('the impracticality of sending a reply....'), ',', b('it'), b('raises'), b('a host of ethical questions', 'nhiều vấn đề đạo đức'), b('that would have to be addressed....', 'relative clause')] },
        { n: 4, chips: [b('Would the human race face the culture shock....?', 'ví dụ 1 câu hỏi đạo đức')] },
        { n: 5, chips: [b('Luckily'), ',', b('there is'), b('no urgency', 'không gấp'), b('about this')] },
        { n: 6, chips: [b('The stars'), b('are hundreds of light years away'), ',', b('so', 'kết quả'), b('it takes hundreds of years....', 'giải thích cho câu 5')] },
        { n: 7, chips: [b('It’s not important'), b('then'), ',', b('if there’s a delay....'), b('while'), b('the human race'), b('debates'), b('whether to reply'), b('and'), o('carefully drafts a reply', 'soạn thư trả lời cẩn thận')] },
      ],
    },
    notes:
      'Câu [[1]] câu chủ đề: tranh luận về **cách phản ứng** khi nhận được tín hiệu\nCâu [[2]] điều mọi người đồng ý: không trả lời ngay\nCâu [[3]] + [[4]] lý do: trả lời có nhiều vấn đề đạo đức (vd culture shock)\nCâu [[5]] + [[6]] + [[7]] không có gì gấp → cứ từ từ tranh luận và soạn thư trả lời cẩn thận\n→ Cả đoạn bàn về việc nên **phản hồi thế nào cho phù hợp** khi nhận được tín hiệu\n⇒ Chọn **ii. Appropriate responses to signals from other civilisations** {ok}',
  },

  q5: {
    paraphrase: {
      question: [s('What is '), s('the life expectancy', 'orange'), s(' of '), s('Earth', 'green'), s('?')],
      pairs: [
        { left: o('life expectancy', 'tuổi thọ'), right: o('the lifetime', 'thời gian tồn tại') },
        { left: g('Earth'), right: g('a planet like ours') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Since'), o('the lifetime', 'S'), g('of a planet like ours', '= Earth'), b('is', 'V'), b('several billion years', 'đáp án')] }],
    },
    notes: '→ the lifetime of a planet like ours = life expectancy of Earth\n→ "is **several billion years**" — 3 từ, đúng giới hạn NO MORE THAN THREE WORDS\n⇒ Đáp án: **several billion years** {ok}',
  },

  q6: {
    paraphrase: {
      question: [s('What kind of '), s('signals', 'orange'), s(' from '), s('other intelligent civilisations', 'green'), s(' are SETI scientists '), s('searching for', 'blue'), s('?')],
      pairs: [
        { left: b('searching for'), right: b('search for') },
        { left: o('signals'), right: o('radio signals') },
        { left: g('other intelligent civilisations', 'Exact word'), right: g('other intelligent civilisations') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('we', 'S'), b('search for', 'V'), o('radio signals', 'O — radio = loại tín hiệu'), g('from other intelligent civilisations', '')] },
        { n: 2, chips: [b('all searches to date', 'S'), b('have concentrated on', 'V'), o('looking for radio waves in this frequency range', 'xác nhận lại: tìm sóng vô tuyến')] },
      ],
    },
    notes: '→ [[1]] Đoạn mở đầu: "as we search for **radio** signals from other intelligent civilisations"\n→ Câu hỏi hỏi "What **kind of** signals" — chữ "signals" đã có sẵn trong câu hỏi, chỉ cần điền **loại** tín hiệu → **radio**\n→ [[2]] Đoạn D củng cố: mọi cuộc tìm kiếm đều tập trung vào "radio waves" 1000–3000 MHz\n⇒ Đáp án: **radio** {ok} (viết "radio signals" vẫn được chấm đúng)',
  },

  q7: {
    paraphrase: {
      question: [s('How many stars', 'orange'), s(' are '), s('the world’s most powerful radio telescopes', 'green'), s(' searching?')],
      pairs: [
        { left: g('the world’s most powerful radio telescopes'), right: g('the world’s largest radio telescopes') },
        { left: o('How many stars'), right: o('the nearest 1000 likely stars') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('One part', 'S'), b('is', 'V'), b('a targeted search'), g('using the world’s largest radio telescopes', '= most powerful')] },
        { n: 2, chips: [b('This part of the project', 'S'), b('is searching', 'V'), o('the nearest 1000 likely stars', 'O — đáp án'), b('with high sensitivity', '')] },
      ],
    },
    notes: '→ [[1]] largest radio telescopes (Arecibo và Nancy) = most powerful radio telescopes\n→ [[2]] phần tìm kiếm này đang quét "the nearest **1000** likely stars"\n→ Không chọn "a few hundred" — đó là số sao ĐÃ được tìm trước đây, không phải số sao các kính lớn nhất đang tìm\n⇒ Đáp án: **1000** {ok}',
  },

  q8: {
    paraphrase: {
      question: [s('Alien civilisations', 'orange'), s(' may be able to '), s('help the human race', 'green'), s(' to '), s('overcome serious problems', 'blue'), s('.')],
      pairs: [
        { left: o('Alien civilisations'), right: o('the older civilisation') },
        { left: g('help the human race', 'giúp loài người'), right: g('pass on the benefits of their experience', 'truyền lại lợi ích từ kinh nghiệm của họ') },
        { left: b('overcome serious problems', 'vượt qua vấn đề nghiêm trọng'), right: b('dealing with threats to survival such as nuclear war and global pollution', 'đối phó với mối đe doạ sự sống còn') },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('Alien civilisations', 'S'), r('may be able to help the human race to overcome serious problems', 'V - có thể giúp con người vượt qua vấn đề nghiêm trọng'), '.'],
      keywords: '"help", "overcome", "serious problems"',
      where: 'đoạn A',
      topic: 'nói về lý do tìm kiếm sự sống ngoài hành tinh',
      quote: 'It is even possible that **the older civilisation may pass on the benefits of their experience in dealing with threats to survival** such as nuclear war and global pollution, and other threats that we haven’t yet discovered.',
      evidence: [[b('It is even possible that', 'có thể'), g('the older civilisation', 'S'), r('may pass on the benefits of their experience', 'V - truyền lại kinh nghiệm'), b('in dealing with threats to survival', 'đối phó với mối đe doạ')]],
      mainIdea: 'Tác giả cho rằng nền văn minh lâu đời hơn **có thể truyền lại kinh nghiệm** đối phó chiến tranh hạt nhân, ô nhiễm.',
      inPassage: 'may pass on … experience in dealing with threats to survival.',
      inQuestion: 'may be able to help … overcome serious problems.',
      conclusion: 'Cùng quan điểm → **khớp**.',
      answer: 'YES',
      others: [
        ['NO', 'chỉ đúng nếu tác giả nói người ngoài hành tinh không thể giúp → tác giả nói ngược lại.'],
        ['NOT GIVEN', 'tác giả nêu rõ quan điểm này.'],
      ],
    }),
  },

  q9: {
    paraphrase: {
      question: [s('SETI scientists', 'orange'), s(' are trying to find '), s('a life form', 'green'), s(' that '), s('resembles humans in many ways', 'blue'), s('.')],
      pairs: [
        { left: o('SETI scientists', 'Exact word'), right: o('most SETI scientists') },
        { left: g('trying to find a life form'), right: g('we are looking for a life form') },
        { left: b('resembles humans in many ways', 'giống con người ở nhiều mặt'), right: b('pretty well like us ... it will nevertheless resemble us', 'khá giống chúng ta') },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('SETI scientists', 'S'), r('are trying to find a life form that resembles humans in many ways', 'V - tìm dạng sống giống người ở nhiều mặt'), '.'],
      keywords: '"SETI scientists", "life form", "resembles"',
      where: 'đoạn B',
      topic: 'nói về các giả định của nhà khoa học SETI',
      quote: 'we make a very conservative assumption that **we are looking for a life form that is pretty well like us** … but **it will nevertheless resemble us** in that it should communicate with its fellows, be interested in the Universe, live on a planet orbiting a star like our Sun, and … have a chemistry, like us, based on carbon and water.',
      evidence: [
        [g('we (= SETI scientists)', 'S'), b('are looking for', 'V'), r('a life form that is pretty well like us', 'dạng sống khá giống ta')],
        [g('it', 'S'), r('will resemble us', 'V - giống ta'), b('communicate, interested in the Universe, planet like ours, carbon and water', 'liệt kê NHIỀU điểm giống')],
      ],
      mainIdea: 'Các nhà khoa học SETI tìm dạng sống **khá giống con người**, giống ở **nhiều mặt** được liệt kê.',
      inPassage: 'pretty well like us + nhiều điểm giống được liệt kê.',
      inQuestion: 'resembles humans in many ways.',
      conclusion: 'Cùng ý → **khớp**.',
      answer: 'YES',
      others: [
        ['NO', 'chỉ đúng nếu bài nói họ tìm dạng sống khác hẳn con người → bài nói ngược lại.'],
        ['NOT GIVEN', 'bài nói rõ giả định này.'],
      ],
    }),
  },

  q10: {
    paraphrase: {
      question: [s('The Americans and Australians', 'orange'), s(' have '), s('co-operated on joint research projects', 'green'), s('.')],
      pairs: [
        { left: o('Australians'), right: o('Australian searches using the radio telescope at Parkes') },
        { left: o('Americans'), right: o('the American-operated telescope in Arecibo') },
        { left: g('co-operated on joint research projects', 'hợp tác trong dự án chung'), note: 'không có thông tin — bài chỉ nói từng nước có cuộc tìm kiếm riêng, không nhắc tới việc hai bên hợp tác' },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('The Americans and Australians', 'S'), r('have co-operated on joint research projects', 'V - hợp tác trong dự án chung'), '.'],
      keywords: '"Americans", "Australians", "co-operated"',
      where: 'đoạn D',
      topic: 'nói về các cuộc tìm kiếm tín hiệu radio',
      quote: 'So far there have been a number of searches by various groups around the world, including **Australian searches using the radio telescope at Parkes**, New South Wales. … **the American-operated telescope in Arecibo**, Puerto Rico and the French telescope in Nancy in France.',
      evidence: [
        [g('Australian searches', 'Úc'), b('using the radio telescope at Parkes', 'tìm riêng')],
        [g('the American-operated telescope in Arecibo', 'Mỹ'), b('and the French telescope in Nancy', 'đi cùng Pháp, không phải Úc')],
      ],
      mainIdea: 'Úc và Mỹ đều có hoạt động tìm kiếm, nhưng bài **không nói hai bên hợp tác**.',
      inPassage: 'Úc tìm ở Parkes; Mỹ vận hành kính ở Arecibo.',
      inQuestion: 'Mỹ và Úc **hợp tác** trong dự án chung.',
      conclusion: 'Bài đọc **không cung cấp** thông tin về sự hợp tác.',
      answer: 'NOT GIVEN',
      others: [
        ['YES', 'chỉ đúng nếu bài nói Mỹ và Úc cùng làm 1 dự án → bài không nói.'],
        ['NO', 'chỉ đúng nếu bài nói hai bên không hợp tác → bài cũng không nói.'],
      ],
    }),
  },

  q11: {
    paraphrase: {
      question: [s('So far', 'orange'), s(' SETI scientists '), s('have picked up radio signals', 'green'), s(' from '), s('several stars', 'blue'), s('.')],
      pairs: [
        { left: o('So far'), right: o('Until now') },
        { left: g('have picked up radio signals', 'đã thu được tín hiệu'), right: g('there have not been any detections', 'chưa phát hiện được gì'), rel: '≠' },
        { left: b('several stars'), right: b('the few hundred stars which have been searched') },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('So far SETI scientists', 'S'), r('have picked up radio signals from several stars', 'V - đã thu được tín hiệu từ nhiều sao'), '.'],
      keywords: '"So far", "picked up", "radio signals"',
      where: 'đoạn D',
      topic: 'nói về kết quả các cuộc tìm kiếm',
      quote: '**Until now there have not been any detections** from the few hundred stars which have been searched.',
      evidence: [[b('Until now', '= so far'), r('there have not been any detections', 'KHÔNG có phát hiện nào'), b('from the few hundred stars', 'vài trăm sao đã tìm')]],
      mainIdea: 'Tới nay **chưa phát hiện** được tín hiệu nào.',
      inPassage: 'not any detections.',
      inQuestion: 'have picked up radio signals from several stars.',
      conclusion: 'Thông tin **trái ngược**.',
      answer: 'NO',
      others: [
        ['YES', 'chỉ đúng nếu bài nói đã thu được tín hiệu → bài nói ngược lại.'],
        ['NOT GIVEN', 'bài nói rõ chưa có phát hiện nào.'],
      ],
    }),
  },

  q12: {
    paraphrase: {
      question: [s('The NASA project', 'orange'), s(' attracted '), s('criticism', 'green'), s(' from some '), s('members of Congress', 'blue'), s('.')],
      pairs: [
        { left: o('The NASA project'), right: o('NASA $10 million per year for ten years') },
        { left: b('members of Congress'), right: b('the US Congress voted') },
        { left: g('criticism', 'sự chỉ trích'), note: 'không có thông tin — bài chỉ nói Quốc hội bỏ phiếu cấp tiền, không nói có ai phản đối/chỉ trích' },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('The NASA project', 'S'), r('attracted criticism from some members of Congress', 'V - bị 1 số thành viên Quốc hội chỉ trích'), '.'],
      keywords: '"NASA project", "Congress", "criticism"',
      where: 'đoạn D',
      topic: 'nói về dự án của NASA',
      quote: 'The scale of the searches has been increased dramatically since 1992, when **the US Congress voted NASA $10 million per year for ten years** to conduct a thorough search for extra-terrestrial life.',
      evidence: [[g('the US Congress', 'S'), b('voted', 'V - bỏ phiếu cấp'), b('NASA $10 million per year for ten years', 'ngân sách')]],
      mainIdea: 'Quốc hội **bỏ phiếu cấp tiền** cho NASA → **không nói ai chỉ trích**.',
      inPassage: 'Quốc hội cấp ngân sách cho dự án.',
      inQuestion: 'Dự án **bị chỉ trích** bởi 1 số thành viên Quốc hội.',
      conclusion: 'Bài đọc **không cung cấp** thông tin về sự chỉ trích.',
      answer: 'NOT GIVEN',
      others: [
        ['YES', 'chỉ đúng nếu bài nói có thành viên Quốc hội chỉ trích → bài không nói.'],
        ['NO', 'chỉ đúng nếu bài nói không ai chỉ trích → bài cũng không nói.'],
      ],
    }),
  },

  q13: {
    paraphrase: {
      question: [s('If '), s('a signal from outer space', 'orange'), s(' is received, it will be important to '), s('respond promptly', 'green'), s('.')],
      pairs: [
        { left: o('a signal from outer space'), right: o('a signal from an alien civilisation') },
        { left: g('important to respond promptly', 'cần trả lời ngay'), right: g('we should not reply immediately ... there is no urgency', 'KHÔNG nên trả lời ngay, không có gì gấp'), rel: '≠' },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('If a signal from outer space is received', 'điều kiện'), r('it will be important to respond promptly', 'cần trả lời ngay'), '.'],
      keywords: '"signal", "respond promptly"',
      where: 'đoạn E',
      topic: 'nói về cách phản ứng khi nhận được tín hiệu',
      quote: 'Everybody agrees that **we should not reply immediately**. … Luckily, **there is no urgency about this**.',
      evidence: [
        [g('Everybody', 'S'), b('agrees', 'V'), r('we should not reply immediately', 'không nên trả lời ngay')],
        [b('there is'), r('no urgency', 'không có gì gấp')],
      ],
      mainIdea: 'Tác giả cho rằng **không nên trả lời ngay** và **không có gì gấp**.',
      inPassage: 'should not reply immediately; no urgency.',
      inQuestion: 'important to respond promptly.',
      conclusion: 'Quan điểm **trái ngược**.',
      answer: 'NO',
      others: [
        ['YES', 'chỉ đúng nếu tác giả nói cần trả lời nhanh → tác giả nói ngược lại.'],
        ['NOT GIVEN', 'tác giả nêu rõ quan điểm.'],
      ],
    }),
  },
}
