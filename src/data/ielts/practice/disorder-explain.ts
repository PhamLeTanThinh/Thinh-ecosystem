import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'
import { linear } from './linear'

// Giải thích từng câu của "Why companies should welcome disorder" (id q1…q14 khớp với reading.ts) — do tôi tự soạn
// từ bài đọc; ĐÁP ÁN đã đối chiếu khớp 100% answer key chính thức. Câu 1-8 (List of headings) theo khuôn "Simplify & Connection"; câu 12-14
// (T/F/NG) theo khuôn Linear thinking (linear()); câu 9-11 theo khuôn Paraphrasing + phân tích câu.
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
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('Organisation is big business', 'câu chủ đề')] },
        { n: 2, chips: [b('We have more strategies for time management … than at any other time', 'NHIỀU hơn bao giờ hết = increasingly')] },
        { n: 3, chips: [b('We'), o('are told that we ought to organise', 'bị bảo là NÊN tổ chức = are expected to do'), b('our company, our home life, our week, our day and even our sleep')] },
        { n: 4, chips: [b('countless seminars and workshops'), o('tell a paying public that they ought to structure their lives', 'lại "ought to"')] },
        { n: 5, chips: [b('The number of business schools and graduates'), b('has massively increased', '= increasingly'), b('teaching people how to organise well')] },
      ],
    },
    notes:
      'Câu [[1]] + [[2]] ngành "tổ chức" rất lớn, nhiều chiến lược **hơn bao giờ hết**\nCâu [[3]] + [[4]] ý chính: ta liên tục **bị bảo là nên** (ought to) tổ chức mọi thứ, từ công ty tới giấc ngủ\nCâu [[5]] số trường kinh doanh dạy cách tổ chức **tăng mạnh**\n→ we are told that we ought to = what people are expected to do; more than at any other time / massively increased = increasingly\n⇒ Chọn **vi. What people are increasingly expected to do** {ok}',
  },

  q2: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('Ironically, however', 'đối lập với đoạn A'), ',', o('the number of businesses that fail has also steadily increased', 'hậu quả tiêu cực')] },
        { n: 2, chips: [o('Work-related stress has increased')] },
        { n: 3, chips: [b('A large proportion of workers'), g('claim to be dissatisfied with', 'phàn nàn = complaints'), b('the way their work is structured and the way they are managed', 'về cách tổ chức = a certain approach')] },
        { n: 4, chips: [b('This begs the question: what has gone wrong?', 'câu dẫn sang đoạn sau')] },
      ],
    },
    notes:
      'Câu [[1]] + [[2]] "Ironically, however" → hệ quả xấu của trào lưu tổ chức: doanh nghiệp thất bại nhiều hơn, căng thẳng tăng\nCâu [[3]] ý chính: phần lớn người lao động **than phiền / không hài lòng** với cách công việc được tổ chức và quản lý\nCâu [[4]] đặt câu hỏi: sai ở đâu?\n→ claim to be dissatisfied = complaints; the way their work is structured = a certain approach\n→ Companies that have suffered from changing their approach {no} doanh nghiệp thất bại không phải vì ĐỔI cách làm\n⇒ Chọn **i. Complaints about the impact of a certain approach** {ok}',
  },

  q3: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('This has been a problem for a while now', 'vấn đề đã có từ lâu')] },
        { n: 2, chips: [b('Frederick Taylor'), b('was one of the forefathers of scientific management', 'người tiên phong')] },
        { n: 3, chips: [o('Writing in the first half of the 20th century', 'Early'), ',', b('he'), o('designed a number of principles to improve the efficiency of the work process', '= recommendations concerning business activities')] },
      ],
    },
    notes:
      'Câu [[1]] vấn đề đã tồn tại từ lâu\nCâu [[2]] + [[3]] ý chính: Frederick Taylor, **nửa đầu thế kỷ 20**, đưa ra các **nguyên tắc** nâng cao hiệu quả công việc\n→ first half of the 20th century = early; principles to improve the efficiency of the work process = recommendations concerning business activities\n⇒ Chọn **iii. Early recommendations concerning business activities** {ok}',
  },

  q4: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('New research suggests'), b('this obsession with efficiency'), o('is misguided', 'sai lầm = in fact incorrect')] },
        { n: 2, chips: [b('The problem is'), o('the basic assumptions we hold', 'giả định cơ bản = fundamental beliefs')] },
        { n: 3, chips: [b('Here it’s'), o('the assumption that order is a necessary condition for productivity', 'giả định 1')] },
        { n: 4, chips: [b('This assumption has also fostered'), o('the idea that disorder must be detrimental', 'giả định 2')] },
      ],
    },
    notes:
      'Câu [[1]] nghiên cứu mới cho thấy nỗi ám ảnh hiệu quả là **sai lầm** (misguided)\nCâu [[2]] ý chính: vấn đề nằm ở **những giả định cơ bản** ta vẫn tin\nCâu [[3]] + [[4]] cụ thể 2 giả định sai: trật tự là điều kiện cần cho năng suất; hỗn loạn chắc chắn có hại\n→ basic assumptions = fundamental beliefs; misguided = in fact incorrect\n⇒ Chọn **ii. Fundamental beliefs that are in fact incorrect** {ok}',
  },

  q5: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [o('recent studies show', 'bằng chứng = evidence'), b('that order actually has'), g('diminishing returns', 'lợi ích giảm dần')] },
        { n: 2, chips: [b('Order does increase productivity to a certain extent', 'ưu điểm (có giới hạn)'), ',', b('but eventually'), g('any further increase in order reduces productivity', 'nhược điểm lấn át')] },
        { n: 3, chips: [b('if'), g('the cost of formally structuring something outweighs the benefit', 'chi phí > lợi ích = more disadvantages than advantages'), ',', b('then that thing ought not to be formally structured')] },
      ],
    },
    notes:
      'Câu [[1]] "recent studies show" → **bằng chứng** cho thấy trật tự có lợi ích giảm dần\nCâu [[2]] tới 1 mức nào đó, tăng trật tự lại **làm giảm** năng suất\nCâu [[3]] khi chi phí vượt lợi ích thì không nên cấu trúc hoá\n→ recent studies show = evidence; the cost … outweighs the benefit = more disadvantages than advantages; a certain approach = order\n→ Neither approach guarantees continuous improvement {no} đoạn E chỉ nói về ORDER, chưa nói tới disorder (đó là đoạn H)\n⇒ Chọn **ix. Evidence that a certain approach can have more disadvantages than advantages** {ok}',
  },

  q6: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('when innovating'), ',', o('the best approach is', 'cách làm = how to'), b('to create an environment devoid of structure and hierarchy'), b('and enable everyone to engage as one organic group')] },
        { n: 2, chips: [b('These environments'), o('can lead to new solutions', '= achieve outcomes'), g('that, under conventionally structured environments, would never be reached', 'bình thường không đạt được = currently impossible')] },
      ],
    },
    notes:
      'Câu [[1]] "the best approach is…" → hướng dẫn **cách làm**: tạo môi trường không cấu trúc, không phân cấp\nCâu [[2]] môi trường đó giúp đạt được giải pháp mới mà với cấu trúc thông thường **sẽ không bao giờ đạt được**\n→ the best approach = how to; new solutions = outcomes; would never be reached under conventional structures = currently impossible\n⇒ Chọn **vii. How to achieve outcomes that are currently impossible** {ok}',
  },

  q7: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [o('companies have slowly started to embrace this disorganisation', 'áp dụng cách tiếp cận mới = put into practice')] },
        { n: 2, chips: [b('For example'), ',', o('Oticon', 'tổ chức 1'), b('used a ‘spaghetti’ structure'), b('→ scrapping formal job titles')] },
        { n: 3, chips: [o('the former chairman of General Electric', 'tổ chức 2'), b('embraced disorganisation — the ‘boundaryless’ organisation')] },
        { n: 4, chips: [o('Google and a number of other tech companies', 'tổ chức 3'), b('have embraced these kinds of flexible structures')] },
      ],
    },
    notes:
      'Câu [[1]] câu chủ đề: các công ty đã bắt đầu **áp dụng** sự thiếu tổ chức (disorganisation)\nCâu [[2]] + [[3]] + [[4]] ví dụ cụ thể: Oticon, General Electric, Google\n→ companies = organisations; embrace this disorganisation / putting mechanisms in place = put a new approach into practice\n→ Companies that have suffered from changing their approach {no} Oticon "proved to be highly successful", không phải chịu thiệt\n⇒ Chọn **iv. Organisations that put a new approach into practice** {ok}',
  },

  q8: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('A word of warning', 'lời cảnh báo'), ':', o('disorder, much like order', 'cả 2 cách = neither approach'), g('seems to have diminishing utility', 'lợi ích giảm dần = không đảm bảo cải thiện liên tục'), b('and can have detrimental effects if overused')] },
        { n: 2, chips: [b('Like order'), ',', b('disorder should be embraced only so far as it is useful')] },
        { n: 3, chips: [b('But we should not fear it'), b('— nor venerate one over the other', 'không đề cao bên nào')] },
      ],
    },
    notes:
      'Câu [[1]] ý chính: **cả disorder lẫn order** đều có lợi ích giảm dần, dùng quá đà thì có hại\nCâu [[2]] + [[3]] chỉ nên dùng tới mức còn hữu ích, không đề cao bên nào hơn\n→ disorder, much like order = neither approach; diminishing utility = doesn’t guarantee continuous improvement\n⇒ Chọn **viii. Neither approach guarantees continuous improvement** {ok}',
  },

  q9: {
    paraphrase: {
      question: [s('Numerous training sessions', 'orange'), s(' are '), s('aimed at people', 'blue'), s(' who feel they are not ___ enough.')],
      pairs: [
        { left: o('Numerous training sessions', 'rất nhiều buổi đào tạo'), right: o('countless seminars and workshops', 'vô số hội thảo') },
        { left: b('aimed at people'), right: b('to tell a paying public') },
        { left: g('who feel they are not ___ enough', 'cảm thấy mình chưa đủ ___'), right: g('as a means to becoming more productive', 'để trở nên năng suất hơn') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('We are told that we ought to organise …'), b('all as a means to becoming more'), g('productive', 'đáp án')] },
        { n: 2, chips: [b('Every week'), ',', o('countless seminars and workshops', '= numerous training sessions'), b('take place … to tell a paying public'), b('that they ought to structure their lives'), b('in order to achieve this', 'this = becoming more productive')] },
      ],
    },
    notes: '→ [[2]] countless seminars and workshops = numerous training sessions; "in order to achieve **this**"\n→ [[1]] "this" = becoming more **productive** → người tham gia là những người muốn năng suất hơn, tức thấy mình chưa đủ năng suất\n→ Chỗ trống đứng trước "enough" → cần 1 tính từ\n⇒ Đáp án: **productive** {ok}',
  },

  q10: {
    paraphrase: {
      question: [s('Being organised', 'orange'), s(' '), s('appeals to', 'green'), s(' people who '), s('regard themselves as', 'blue'), s(' ___.')],
      pairs: [
        { left: o('Being organised'), right: o('This rhetoric (= organise everything)') },
        { left: g('appeals to', 'hấp dẫn'), right: g('much to the delight of', 'khiến … rất thích thú') },
        { left: b('regard themselves as', 'tự coi mình là'), right: b('self-proclaimed', 'tự nhận là') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [o('This rhetoric', 'S - lối nói "hãy tổ chức mọi thứ"'), b('has crept into the thinking of business leaders'), ',', g('much to the delight of', '= appeals to'), b('self-proclaimed', '= regard themselves as'), g('perfectionists', 'đáp án'), b('with the need to get everything right')] }],
    },
    notes: '→ "much to the delight of self-proclaimed **perfectionists**" = appeals to people who regard themselves as perfectionists\n→ self-proclaimed = tự nhận mình là → regard themselves as\n⇒ Đáp án: **perfectionists** {ok}',
  },

  q11: {
    paraphrase: {
      question: [s('Many people', 'orange'), s(' feel ___ '), s('with aspects of their work', 'green'), s('.')],
      pairs: [
        { left: o('Many people'), right: o('A large proportion of workers') },
        { left: g('with aspects of their work', 'với các khía cạnh công việc'), right: g('with the way their work is structured and the way they are managed') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [o('A large proportion of workers from all demographics', '= many people'), b('claim to be'), b('dissatisfied', 'đáp án'), g('with the way their work is structured and the way they are managed', '= aspects of their work')] }],
    },
    notes: '→ A large proportion of workers = many people; claim to be dissatisfied = feel dissatisfied\n→ cách công việc được tổ chức + cách họ được quản lý = aspects of their work\n→ Sau "feel" cần 1 tính từ, và "dissatisfied with" khớp đúng giới từ "with"\n⇒ Đáp án: **dissatisfied** {ok}',
  },

  q12: {
    paraphrase: {
      question: [s('Both businesses and people', 'orange'), s(' '), s('aim at order', 'blue'), s(' '), s('without really considering its value', 'green'), s('.')],
      pairs: [
        { left: o('Both businesses and people', 'Exact word'), right: o('businesses and people') },
        { left: b('aim at order', 'hướng tới sự trật tự'), right: b('spend time and money organising themselves for the sake of organising') },
        { left: g('without really considering its value', 'mà không thực sự xét tới giá trị'), right: g('rather than actually looking at the end goal and usefulness of such an effort', 'thay vì xem xét mục tiêu và tính hữu ích') },
      ],
    },
    detail: linear({
      question: [g('Both businesses and people', 'S'), r('aim at order without really considering its value', 'V - theo đuổi trật tự mà không xét giá trị'), '.'],
      keywords: '"businesses and people", "order", "value"',
      where: 'đoạn D',
      topic: 'nói về những giả định sai về trật tự và năng suất',
      quote: 'The result is that **businesses and people spend time and money organising themselves for the sake of organising, rather than actually looking at the end goal and usefulness of such an effort**.',
      evidence: [
        [g('businesses and people', 'S'), b('spend time and money organising themselves', 'V - tốn thời gian, tiền để tổ chức'), r('for the sake of organising', 'tổ chức chỉ để tổ chức')],
        [b('rather than', 'thay vì'), r('actually looking at the end goal and usefulness', 'xem xét mục tiêu & tính hữu ích = value')],
      ],
      mainIdea: 'Cả doanh nghiệp lẫn con người **tổ chức chỉ để tổ chức**, **không xét tới** mục tiêu và tính hữu ích của việc đó.',
      inPassage: 'organising for the sake of organising, rather than looking at the usefulness.',
      inQuestion: 'aim at order without really considering its value.',
      conclusion: 'usefulness = value; for the sake of organising = aim at order → **khớp**.',
      answer: 'TRUE',
      others: [
        ['FALSE', 'chỉ đúng nếu bài nói họ luôn cân nhắc kỹ giá trị của việc tổ chức → bài nói ngược lại.'],
        ['NOT GIVEN', 'bài nói rõ điều này ở câu kết đoạn D.'],
      ],
    }),
  },

  q13: {
    paraphrase: {
      question: [s('Innovation', 'orange'), s(' is most successful if '), s('the people involved', 'blue'), s(' '), s('have distinct roles', 'green'), s('.')],
      pairs: [
        { left: o('Innovation is most successful', 'đổi mới hiệu quả nhất'), right: o('when innovating, the best approach is', 'khi đổi mới, cách tốt nhất là') },
        { left: g('have distinct roles', 'có vai trò riêng biệt'), right: g('devoid of structure and hierarchy … engage as one organic group', 'không cấu trúc, không phân cấp … hoạt động như 1 nhóm thống nhất'), rel: '≠' },
      ],
    },
    detail: linear({
      question: [g('Innovation', 'S'), b('is most successful', 'hiệu quả nhất'), r('if the people involved have distinct roles', 'khi mỗi người có vai trò riêng biệt'), '.'],
      keywords: '"innovation", "most successful", "roles"',
      where: 'đoạn F',
      topic: 'nói về môi trường tốt nhất cho đổi mới',
      quote: 'In fact, research shows that, **when innovating, the best approach is to create an environment devoid of structure and hierarchy and enable everyone involved to engage as one organic group**.',
      evidence: [
        [b('when innovating', '= innovation'), g('the best approach is', '= most successful')],
        [r('an environment devoid of structure and hierarchy', 'KHÔNG cấu trúc, KHÔNG phân cấp'), r('everyone involved engage as one organic group', 'mọi người hoà làm 1 nhóm')],
      ],
      mainIdea: 'Đổi mới hiệu quả nhất khi **không có cấu trúc, phân cấp** và mọi người hoạt động như **1 nhóm thống nhất**.',
      inPassage: 'devoid of structure and hierarchy, one organic group.',
      inQuestion: 'the people involved have distinct roles.',
      conclusion: 'Vai trò riêng biệt **trái ngược** với môi trường không cấu trúc, hoà làm 1 nhóm.',
      answer: 'FALSE',
      others: [
        ['TRUE', 'chỉ đúng nếu bài nói phân vai rõ ràng giúp đổi mới tốt nhất → bài nói ngược lại.'],
        ['NOT GIVEN', 'bài nói rõ cách tiếp cận tốt nhất khi đổi mới.'],
      ],
    }),
  },

  q14: {
    paraphrase: {
      question: [s('Google', 'orange'), s(' '), s('was inspired to adopt flexibility', 'green'), s(' '), s('by the success of General Electric', 'blue'), s('.')],
      pairs: [
        { left: o('Google', 'Exact word'), right: o('Google') },
        { left: g('adopt flexibility'), right: g('have embraced (at least in part) these kinds of flexible structures') },
        { left: b('was inspired … by the success of General Electric', 'lấy cảm hứng từ thành công của GE'), note: 'không có thông tin — bài chỉ nêu GE và Google như 2 ví dụ song song, không nói Google học theo GE' },
      ],
    },
    detail: linear({
      question: [g('Google', 'S'), r('was inspired to adopt flexibility by the success of General Electric', 'V - lấy cảm hứng từ thành công của GE'), '.'],
      keywords: '"Google", "flexibility", "General Electric"',
      where: 'đoạn G',
      topic: 'nói về các công ty đã áp dụng sự thiếu tổ chức',
      quote: 'In similar fashion, the former chairman of General Electric embraced disorganisation … **Google and a number of other tech companies have embraced (at least in part) these kinds of flexible structures**, facilitated by technology and strong company values which glue people together.',
      evidence: [
        [g('the former chairman of General Electric', 'ví dụ 1'), b('embraced disorganisation', 'boundaryless')],
        [g('Google and other tech companies', 'ví dụ 2'), b('have embraced these kinds of flexible structures', 'cũng áp dụng'), b('facilitated by technology and strong company values', 'nhờ công nghệ + giá trị công ty — không nhắc GE')],
      ],
      mainIdea: 'GE và Google là **2 ví dụ song song** — bài **không nói** Google lấy cảm hứng từ GE, cũng không nói GE thành công hay không.',
      inPassage: 'Google cũng áp dụng cấu trúc linh hoạt, nhờ công nghệ và giá trị công ty.',
      inQuestion: 'Google **lấy cảm hứng** từ **thành công** của GE.',
      conclusion: 'Bài đọc **không cung cấp** thông tin về mối liên hệ này.',
      answer: 'NOT GIVEN',
      others: [
        ['TRUE', 'chỉ đúng nếu bài nói Google học theo GE → bài không nói.'],
        ['FALSE', 'chỉ đúng nếu bài nói Google áp dụng hoàn toàn độc lập / không liên quan GE → bài cũng không nói.'],
      ],
    }),
  },
}
