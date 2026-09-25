import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'
import { linear } from './linear'

// Giải thích từng câu của "Artificial Artists" (id q1…q14 khớp với reading.ts) — do tôi tự soạn từ bài đọc; ĐÁP ÁN
// đã đối chiếu answer key chính thức (câu 5 là A theo key). Câu 12-14 (Y/N/NG) theo khuôn Linear thinking (linear()); còn lại Paraphrasing + phân tích câu.
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
      question: [s('What is the writer suggesting about '), s('computer-produced works', 'orange'), s(' in the first paragraph?')],
      answer: [s('B - '), s('A great deal of progress has already been attained in this field', 'green'), s('.')],
      pairs: [
        { left: o('computer-produced works'), right: o('computer programs which … possess creative talents') },
        { left: g('a great deal of progress has already been attained', 'đã đạt được nhiều tiến bộ'), right: g('a growing number … audiences enraptured … sold for thousands … hung in prestigious galleries … art that could not have been imagined by the programmer', 'liệt kê hàng loạt thành tựu') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('The Painting Fool is one of'), g('a growing number of computer programs', 'ngày càng nhiều'), b('which … possess creative talents')] },
        { n: 2, chips: [b('Classical music by an artificial composer'), g('has had audiences enraptured, and even tricked them', 'thành tựu 1')] },
        { n: 3, chips: [b('Artworks painted by a robot'), g('have sold for thousands of dollars and been hung in prestigious galleries', 'thành tựu 2')] },
        { n: 4, chips: [b('software has been built which'), g('creates art that could not have been imagined by the programmer', 'thành tựu 3 - vượt cả người lập trình')] },
      ],
    },
    notes:
      '→ Cả đoạn A là một chuỗi **thành tựu đã đạt được**: [[1]] ngày càng nhiều chương trình, [[2]] nhạc khiến khán giả say mê, [[3]] tranh bán được hàng nghìn đô, treo ở phòng tranh danh giá, [[4]] phần mềm tạo ra thứ người lập trình không tưởng tượng nổi\n→ A. acceptance can vary considerably {no} đoạn A chỉ nêu phản ứng TÍCH CỰC, không nói mức độ chấp nhận khác nhau\n→ C. more success in some genres {no} có nhạc và tranh nhưng không so sánh thể loại nào thành công hơn\n→ D. not as significant as the public believes {no} tác giả không hạ thấp các tiến bộ\n⇒ Đáp án là **B** {ok}',
  },

  q2: {
    paraphrase: {
      question: [s('According to Geraint Wiggins', 'blue'), s(', why are many people '), s('worried', 'orange'), s(' by computer art?')],
      answer: [s('C - '), s('It undermines a fundamental human quality', 'green'), s('.')],
      pairs: [
        { left: o('worried'), right: o('It scares a lot of people. They are worried') },
        { left: g('undermines', 'làm suy yếu, lấy mất'), right: g('taking something … away', 'lấy đi') },
        { left: g('a fundamental human quality', 'phẩm chất cốt lõi của con người'), right: g('something special … what it means to be human', 'điều đặc biệt làm nên con người') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('‘This is a question at the very core of humanity,’', 'cốt lõi của nhân loại'), b('says Geraint Wiggins')] },
        { n: 2, chips: [o('It scares a lot of people. They are worried', '= many people are worried'), b('that it is'), g('taking something special away from what it means to be human', '= undermines a fundamental human quality')] },
      ],
    },
    notes:
      '→ [[2]] Wiggins: mọi người lo vì máy tính đang "taking something special away from what it means to be human" — lấy mất điều đặc biệt làm nên con người (khả năng sáng tạo)\n→ A {no} không nói nghệ thuật máy kém thẩm mỹ\n→ B {no} không nói sẽ thay thế hoàn toàn nghệ thuật con người\n→ D {no} không nói khả năng con người sẽ đi xuống\n⇒ Đáp án là **C** {ok}',
  },

  q3: {
    paraphrase: {
      question: [s('What is a '), s('key difference', 'orange'), s(' between '), s('Aaron and the Painting Fool', 'blue'), s('?')],
      answer: [s('C - '), s('The source of its subject matter', 'green')],
      pairs: [
        { left: o('key difference'), right: o('Unlike earlier ‘artists’ such as Aaron') },
        { left: g('The source of its subject matter', 'nguồn ý tưởng / chủ đề'), right: g('can come up with its own concepts by going online for material', 'tự tìm ý tưởng bằng cách lên mạng lấy tư liệu') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, prefix: 'Aaron:', chips: [b('it is still little more than a tool'), g('to realise the programmer’s own creative ideas', 'ý tưởng đến từ NGƯỜI LẬP TRÌNH')] },
        { n: 2, prefix: 'Painting Fool:', chips: [o('Unlike earlier ‘artists’ such as Aaron', 'điểm khác'), ',', b('the Painting Fool'), g('can come up with its own concepts by going online for material', 'ý tưởng đến từ MẠNG')] },
      ],
    },
    notes:
      '→ [[1]] Aaron chỉ là công cụ hiện thực hoá **ý tưởng của người lập trình**\n→ [[2]] "Unlike … Aaron", Painting Fool **tự tìm ý tưởng** trên mạng (web searches, social media)\n→ Khác biệt then chốt: ý tưởng / chủ đề đến từ đâu\n→ A {no} không nói lý lịch người lập trình\n→ B {no} Aaron được trưng bày ở Tate Modern nhưng không so sánh phản ứng công chúng\n→ D {no} không so sánh chất lượng kỹ thuật\n⇒ Đáp án là **C** {ok}',
  },

  q4: {
    paraphrase: {
      question: [s('What point does '), s('Simon Colton', 'blue'), s(' make in the fourth paragraph?')],
      answer: [s('D - '), s('People tend to judge computer art and human art according to different criteria', 'green'), s('.')],
      pairs: [
        { left: g('judge … according to different criteria', 'đánh giá theo tiêu chuẩn khác nhau'), right: g('double standards', 'tiêu chuẩn kép') },
        { left: o('computer art and human art'), right: o('software-produced and human-produced art') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('While some might say they have a mechanical look'), ',', b('Colton argues that'), b('such reactions arise from'), g('people’s double standards', '= different criteria'), o('towards software-produced and human-produced art', '= computer art and human art')] },
        { n: 2, chips: [b('‘If a child painted a new scene from its head, you’d say it has a certain level of imagination … The same should be true of a machine.’', 'ví dụ minh hoạ tiêu chuẩn kép')] },
      ],
    },
    notes:
      '→ [[1]] Colton cho rằng việc chê tranh máy "mechanical" là do **double standards** (tiêu chuẩn kép) giữa nghệ thuật máy và người\n→ [[2]] ví dụ: trẻ con vẽ từ trí tưởng tượng thì được khen, máy làm vậy cũng nên được khen\n→ A {no} "childish" không xuất hiện; ví dụ đứa trẻ là để so sánh, không phải chê\n→ B {no} Colton muốn ÁP DỤNG cùng 1 tiêu chuẩn, ngược với B\n→ C {no} Colton lại cho rằng máy CÓ trí tưởng tượng\n⇒ Đáp án là **D** {ok}',
  },

  q5: {
    paraphrase: {
      question: [s('The writer refers to '), s('the paintings of a chair', 'orange'), s(' as an example of computer art which …')],
      answer: [s('A - '), s('achieves a particularly striking effect', 'green'), s('.')],
      pairs: [
        { left: o('the paintings of a chair'), right: o('Some of the Painting Fool’s paintings of a chair') },
        { left: g('achieves a particularly striking effect', 'tạo ra hiệu ứng đặc biệt ấn tượng'), right: g('gives the work an eerie, ghostlike quality', 'mang lại cho tác phẩm vẻ ma mị, kỳ bí') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('Software bugs'), b('can also lead to'), g('unexpected results', 'kết quả bất ngờ')] },
        { n: 2, chips: [b('Some of the Painting Fool’s paintings of a chair'), b('came out in black and white'), b('thanks to a technical glitch', 'do lỗi kỹ thuật')] },
        { n: 3, chips: [b('This', 'S = việc tranh ra đen trắng'), b('gives the work', 'V'), g('an eerie, ghostlike quality', '= a particularly striking effect')] },
        { n: 4, chips: [b('Human artists like the renowned Ellsworth Kelly'), b('are lauded for limiting their colour palette'), '–', b('so why should computers be any different?', 'bảo vệ giá trị của hiệu ứng đó')] },
      ],
    },
    notes:
      '→ [[1]] + [[2]] ví dụ tranh ghế được đưa ra để minh hoạ "unexpected results" do lỗi phần mềm: tranh chỉ còn đen trắng\n→ [[3]] kết quả: tác phẩm có "**an eerie, ghostlike quality**" — vẻ ma mị, kỳ bí → đây chính là **hiệu ứng đặc biệt ấn tượng** (striking effect)\n→ [[4]] câu so sánh với Ellsworth Kelly chỉ để bảo vệ rằng hiệu ứng đó đáng được khen\n→ B {no} bẫy — việc so với Kelly dễ khiến ta nghĩ tới "kỹ năng nghệ thuật", nhưng hiệu ứng ở đây đến từ **lỗi kỹ thuật** (glitch), không phải kỹ năng thật của phần mềm\n→ C {no} không nói tranh giống tranh Kelly — chỉ cùng việc giới hạn màu\n→ D {no} lỗi kỹ thuật lại tạo ra kết quả tích cực, không phải để nêu hạn chế\n⇒ Đáp án là **A** {ok}',
  },

  q6: {
    paraphrase: {
      question: [s('Simon Colton', 'blue'), s(' says it is '), s('important to consider the long-term view', 'orange'), s(' when '), s('comparing the artistic achievements of humans and computers', 'green')],
      pairs: [
        { left: o('consider the long-term view', 'xét tầm nhìn dài hạn'), right: o('humans who have had millennia to develop our skills', 'con người đã có hàng thiên niên kỷ để phát triển') },
        { left: g('comparing the artistic achievements of humans and computers'), right: g('measure machine creativity directly to that of humans', 'so trực tiếp sự sáng tạo của máy với người') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Researchers like Colton'), b('don’t believe it is right'), g('to measure machine creativity directly to that of humans', '= comparing'), o('who have had millennia to develop our skills', '= long-term view')] }],
    },
    notes: '→ Colton cho rằng không nên so trực tiếp sự sáng tạo của máy với con người, vì con người đã có **hàng thiên niên kỷ** để phát triển → phải xét tầm nhìn dài hạn **khi so sánh** thành tựu nghệ thuật của người và máy\n⇒ Đáp án là **D** {ok}',
  },

  q7: {
    paraphrase: {
      question: [s('David Cope’s EMI software', 'blue'), s(' '), s('surprised people', 'orange'), s(' by '), s('generating work that was virtually indistinguishable from that of humans', 'green')],
      pairs: [
        { left: o('surprised people', 'khiến mọi người ngạc nhiên'), right: o('Audiences were moved to tears … fooled classical music experts') },
        { left: g('virtually indistinguishable from that of humans', 'gần như không phân biệt được với người'), right: g('fooled classical music experts into thinking they were hearing genuine Bach', 'lừa được cả chuyên gia tưởng là nhạc Bach thật') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('EMI'), o('even fooled classical music experts', 'lừa được cả chuyên gia'), g('into thinking they were hearing genuine Bach', '= indistinguishable from human work')] }],
    },
    notes: '→ EMI "fooled classical music experts into thinking they were hearing genuine Bach" — ngay cả chuyên gia cũng không phân biệt được → virtually indistinguishable from that of humans\n⇒ Đáp án là **A** {ok}',
  },

  q8: {
    paraphrase: {
      question: [s('Geraint Wiggins', 'blue'), s(' '), s('criticized', 'orange'), s(' Cope for not '), s('revealing the technical details of his program', 'green')],
      pairs: [
        { left: o('criticized', 'chỉ trích'), right: o('have blasted … and condemned him', 'công kích và lên án') },
        { left: g('not revealing the technical details of his program', 'không tiết lộ chi tiết kỹ thuật'), right: g('his deliberately vague explanation of how the software worked', 'cố tình giải thích mơ hồ cách phần mềm hoạt động') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Some, such as Wiggins'), o('have blasted Cope’s work as pseudoscience', 'chỉ trích'), b(', and'), o('condemned him for', 'lên án vì'), g('his deliberately vague explanation of how the software worked', '= not revealing the technical details')] }],
    },
    notes: '→ Wiggins lên án Cope vì "deliberately vague explanation of how the software worked" — cố tình không nói rõ phần mềm hoạt động ra sao = not revealing the technical details of his program\n⇒ Đáp án là **E** {ok}',
  },

  q9: {
    paraphrase: {
      question: [s('Douglas Hofstadter', 'blue'), s(' claimed that EMI was '), s('producing work entirely dependent on the imagination of its creator', 'green')],
      pairs: [
        { left: g('entirely dependent on', 'hoàn toàn phụ thuộc vào'), right: g('still rely completely on', 'vẫn dựa hoàn toàn vào') },
        { left: g('the imagination of its creator', 'trí tưởng tượng của người tạo ra'), right: g('the original artist’s creative impulses', 'cảm hứng sáng tạo của nghệ sĩ gốc') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Douglas Hofstadter'), b('said'), b('EMI created replicas', 'chỉ là bản sao'), b('which'), g('still rely completely on', '= entirely dependent on'), g('the original artist’s creative impulses', '= the imagination of its creator')] }],
    },
    notes: '→ Hofstadter: EMI chỉ tạo ra bản sao "which still rely completely on the original artist’s creative impulses" = entirely dependent on the imagination of its creator\n⇒ Đáp án là **C** {ok}',
  },

  q10: {
    paraphrase: {
      question: [s('Audiences who had listened to EMI’s music', 'blue'), s(' '), s('became angry', 'orange'), s(' after '), s('discovering that it was the product of a computer program', 'green')],
      pairs: [
        { left: o('became angry', 'nổi giận'), right: o('were often outraged with Cope', 'thường phẫn nộ với Cope') },
        { left: g('discovering that it was the product of a computer program'), right: g('When audiences found out the truth', 'khi khán giả biết sự thật') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [g('When audiences found out the truth', '= discovering it was a computer program'), b('they'), o('were often outraged with Cope', '= became angry'), b(', and one music lover even tried to punch him')] }],
    },
    notes: '→ "When audiences found out the truth they were often outraged" — sự thật ở đây là nhạc do phần mềm tạo ra → angry after discovering that it was the product of a computer program\n⇒ Đáp án là **G** {ok}',
  },

  q11: {
    paraphrase: {
      question: [s('The participants in David Moffat’s study', 'blue'), s(' had to '), s('assess music', 'orange'), s(' without '), s('knowing whether it was the work of humans or software', 'green')],
      pairs: [
        { left: o('assess music'), right: o('assess six compositions') },
        { left: g('without knowing whether it was the work of humans or software', 'không biết do người hay máy sáng tác'), right: g('weren’t told beforehand whether the tunes were composed by humans or computers', 'không được báo trước nhạc do người hay máy') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('He asked both expert musicians and non-experts'), o('to assess six compositions', '= assess music')] },
        { n: 2, chips: [b('The participants'), g('weren’t told beforehand whether the tunes were composed by humans or computers', '= without knowing')] },
      ],
    },
    notes: '→ [[2]] người tham gia "weren’t told beforehand whether the tunes were composed by humans or computers" = assess music without knowing whether it was the work of humans or software\n⇒ Đáp án là **B** {ok}',
  },

  q12: {
    paraphrase: {
      question: [s('Moffat’s research', 'orange'), s(' '), s('may help explain', 'green'), s(' '), s('people’s reactions to EMI', 'blue'), s('.')],
      pairs: [
        { left: o('Moffat’s research'), right: o('A study by computer scientist David Moffat') },
        { left: g('may help explain', 'có thể giúp giải thích'), right: g('provides a clue', 'đưa ra manh mối') },
        { left: b('people’s reactions to EMI'), right: b('why did so many people love the music, yet recoil when they discovered how it was composed?') },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('Moffat’s research', 'S'), r('may help explain people’s reactions to EMI', 'V - có thể giúp giải thích phản ứng với EMI'), '.'],
      keywords: '"Moffat", "explain", "reactions"',
      where: 'đoạn F',
      topic: 'mở đầu bằng câu hỏi về phản ứng của khán giả với EMI',
      quote: '**But why did so many people love the music, yet recoil when they discovered how it was composed? A study by computer scientist David Moffat of Glasgow Caledonian University provides a clue.**',
      evidence: [
        [b('why did so many people love the music, yet recoil', 'câu hỏi = phản ứng với EMI')],
        [g('A study by … David Moffat', 'S'), r('provides a clue', 'V - đưa ra manh mối = may help explain')],
      ],
      mainIdea: 'Tác giả đặt câu hỏi vì sao khán giả phản ứng như vậy với EMI, rồi nói nghiên cứu của Moffat **đưa ra manh mối** để trả lời.',
      inPassage: 'provides a clue (đưa ra manh mối).',
      inQuestion: 'may help explain (có thể giúp giải thích).',
      conclusion: 'Cùng quan điểm → **khớp**.',
      answer: 'YES',
      others: [
        ['NO', 'chỉ đúng nếu tác giả nói nghiên cứu không liên quan tới phản ứng với EMI → tác giả nói ngược lại.'],
        ['NOT GIVEN', 'tác giả nêu rõ mối liên hệ ngay ở câu thứ 2 của đoạn F.'],
      ],
    }),
  },

  q13: {
    paraphrase: {
      question: [s('The non-experts in Moffat’s study', 'orange'), s(' '), s('all responded in a predictable way', 'green'), s('.')],
      pairs: [
        { left: o('The non-experts in Moffat’s study'), right: o('both expert musicians and non-experts') },
        { left: g('all responded in a predictable way', 'đều phản ứng như dự đoán'), note: 'không có thông tin — bài chỉ nói chuyên gia "might have been expected to be more objective", không nói gì về việc người không chuyên phản ứng có đoán trước được hay không' },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('The non-experts in Moffat’s study', 'S'), r('all responded in a predictable way', 'V - đều phản ứng như dự đoán'), '.'],
      keywords: '"non-experts", "predictable"',
      where: 'đoạn F',
      topic: 'nói về nghiên cứu của Moffat',
      quote: 'People who thought the composer was a computer tended to dislike the piece more than those who believed it was human. **This was true even among the experts, who might have been expected to be more objective in their analyses.**',
      evidence: [
        [b('People who thought the composer was a computer', 'S'), b('tended to dislike the piece more', 'xu hướng chung')],
        [b('This was true even among'), g('the experts', 'chỉ nói về CHUYÊN GIA'), b('who might have been expected to be more objective', 'điều được kỳ vọng ở chuyên gia')],
      ],
      mainIdea: 'Bài chỉ nói về kỳ vọng với **chuyên gia**; **không nói** người không chuyên có phản ứng như dự đoán hay không, cũng không nói "tất cả" họ phản ứng giống nhau.',
      inPassage: 'Xu hướng chung + chuyên gia (lẽ ra khách quan hơn) cũng vậy.',
      inQuestion: '**Tất cả** người không chuyên phản ứng **đoán trước được**.',
      conclusion: 'Bài đọc **không cung cấp** thông tin về điều này.',
      answer: 'NOT GIVEN',
      others: [
        ['YES', 'chỉ đúng nếu tác giả nói mọi người không chuyên phản ứng đúng như dự đoán → bài không nói.'],
        ['NO', 'chỉ đúng nếu tác giả nói có người không chuyên phản ứng bất ngờ → bài cũng không nói.'],
      ],
    }),
  },

  q14: {
    paraphrase: {
      question: [s('Justin Kruger’s findings', 'orange'), s(' '), s('cast doubt on', 'green'), s(' '), s('Paul Bloom’s theory', 'blue'), s(' about people’s prejudice towards computer art.')],
      pairs: [
        { left: b('Paul Bloom’s theory'), right: b('part of the pleasure we get from art stems from the creative process behind the work') },
        { left: o('Justin Kruger’s findings'), right: o('people’s enjoyment of an artwork increases if they think more time and effort was needed') },
        { left: g('cast doubt on', 'làm nghi ngờ, bác bỏ'), right: g('Meanwhile … Similarly', 'bổ sung, ủng hộ — không bác bỏ'), rel: '≠' },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('Justin Kruger’s findings', 'S'), r('cast doubt on Paul Bloom’s theory', 'V - làm nghi ngờ lý thuyết của Bloom'), '.'],
      keywords: '"Justin Kruger", "Paul Bloom", "prejudice"',
      where: 'đoạn G',
      topic: 'nói về nguồn gốc của định kiến với nghệ thuật máy tính',
      quote: 'Paul Bloom of Yale University has a suggestion: he reckons **part of the pleasure we get from art stems from the creative process behind the work**. … Meanwhile, experiments by Justin Kruger of New York University have shown that **people’s enjoyment of an artwork increases if they think more time and effort was needed to create it**.',
      evidence: [
        [g('Paul Bloom', 'S'), b('reckons'), b('pleasure from art stems from the creative process', 'niềm vui đến từ QUÁ TRÌNH sáng tạo')],
        [g('Justin Kruger’s experiments', 'S'), b('have shown'), r('enjoyment increases if more time and effort was needed', 'càng nhiều công sức càng thích = cùng hướng với Bloom')],
      ],
      mainIdea: 'Kết quả của Kruger (công sức bỏ ra làm tăng sự yêu thích) **ủng hộ** ý của Bloom (niềm vui đến từ quá trình sáng tạo), không bác bỏ.',
      inPassage: 'Kruger bổ sung cùng chiều với Bloom ("Meanwhile", rồi "Similarly" cho ý tiếp theo).',
      inQuestion: 'Kruger **làm nghi ngờ** lý thuyết của Bloom.',
      conclusion: 'Quan điểm **trái ngược**.',
      answer: 'NO',
      others: [
        ['YES', 'chỉ đúng nếu kết quả của Kruger mâu thuẫn với Bloom → hai ý cùng chiều.'],
        ['NOT GIVEN', 'bài trình bày cả 2 ý cạnh nhau, đủ để thấy chúng ủng hộ nhau.'],
      ],
    }),
  },
}
