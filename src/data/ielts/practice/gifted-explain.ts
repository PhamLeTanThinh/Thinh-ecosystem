import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'

// Giải thích từng câu của "Gifted children and learning" (id q1…q13 khớp với reading.ts) — do tôi tự soạn từ bài đọc,
// ĐÁP ÁN đã đối chiếu khớp 100% answer key chính thức. Theo khuôn Paraphrasing + phân tích câu + diễn giải.
const chip =
  (color: ChipColor) =>
  (text: string, label?: string): ExChip => ({ text, color, label })
const o = chip('orange')
const g = chip('green')
const b = chip('blue')
const s = (text: string, color?: ChipColor) => ({ text, color })

export const EXPLAIN: Record<string, Explanation> = {
  q1: {
    paraphrase: {
      question: [s('a reference to '), s('the influence', 'orange'), s(' of '), s('the domestic background', 'green'), s(' on '), s('the gifted child', 'blue')],
      pairs: [
        { left: g('the domestic background', 'hoàn cảnh gia đình'), right: g('their home educational provision … verbal interactions with parents, number of books and activities in their home', 'điều kiện giáo dục ở nhà') },
        { left: o('the influence', 'ảnh hưởng'), right: o('a very close positive relationship … The higher the children’s IQ scores … the better the quality of their educational backup', 'mối liên hệ chặt chẽ') },
        { left: b('the gifted child'), right: b('especially over IQ 130') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('Children’s educational environment'), o('contributes to', '= influence'), b('the IQ score and the way intelligence is used')] },
        { n: 2, chips: [o('a very close positive relationship was found', 'liên hệ chặt'), b('when children’s IQ scores were compared with'), g('their home educational provision', '= domestic background')] },
        { n: 3, chips: [b('The higher the children’s IQ scores, especially over IQ 130', '= gifted'), ',', b('the better the quality of their educational backup'), g('measured in terms of verbal interactions with parents, number of books and activities in their home', 'môi trường gia đình')] },
      ],
    },
    notes: '→ [[2]] + [[3]] IQ của trẻ liên hệ chặt với điều kiện giáo dục **ở nhà**: nói chuyện với bố mẹ, số sách, hoạt động trong nhà\n→ home educational provision = domestic background; IQ over 130 = the gifted child\n⇒ Đáp án là **A** {ok}',
  },

  q2: {
    paraphrase: {
      question: [s('reference to '), s('what can be lost', 'orange'), s(' if learners are '), s('given too much guidance', 'green')],
      pairs: [
        { left: g('given too much guidance', 'được chỉ dẫn quá nhiều'), right: g('teachers who have a tendency to ‘overdirect’ … Too much dependence on the teachers', 'giáo viên chỉ dẫn quá mức') },
        { left: o('what can be lost', 'những gì có thể mất'), right: o('diminish their gifted pupils’ learning autonomy … risks loss of autonomy and motivation to discover', 'mất tính tự chủ và động lực khám phá') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [g('teachers who have a tendency to ‘overdirect’', '= too much guidance'), o('can diminish their gifted pupils’ learning autonomy', 'làm giảm tính tự chủ')] },
        { n: 2, chips: [g('Too much dependence on the teachers'), o('risks loss of autonomy and motivation to discover', '= what can be lost')] },
      ],
    },
    notes: '→ [[1]] giáo viên "overdirect" (chỉ dẫn quá mức) làm giảm tính tự chủ của học sinh\n→ [[2]] phụ thuộc quá nhiều vào giáo viên → "**loss** of autonomy and motivation to discover"\n⇒ Đáp án là **D** {ok}',
  },

  q3: {
    paraphrase: {
      question: [s('a reference to '), s('the damaging effects', 'green'), s(' of '), s('anxiety', 'orange')],
      pairs: [
        { left: o('anxiety', 'lo âu'), right: o('negative emotions … Fear', 'cảm xúc tiêu cực … nỗi sợ') },
        { left: g('the damaging effects', 'tác hại'), right: g('inhibit it … can limit the development of curiosity', 'kìm hãm, hạn chế sự tò mò') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('Positive emotions facilitate the creative aspects of learning'), b('and'), o('negative emotions', '= anxiety'), g('inhibit it', 'kìm hãm')] },
        { n: 2, chips: [o('Fear', 'ví dụ cảm xúc tiêu cực'), b(', for example,'), g('can limit the development of curiosity', '= damaging effects')] },
      ],
    },
    notes: '→ [[1]] cảm xúc tiêu cực "inhibit" (kìm hãm) việc học\n→ [[2]] ví dụ: nỗi sợ (fear) "can limit the development of curiosity" → tác hại của lo âu\n⇒ Đáp án là **F** {ok}',
  },

  q4: {
    paraphrase: {
      question: [s('examples of '), s('classroom techniques', 'orange'), s(' which '), s('favour socially-disadvantaged children', 'green')],
      pairs: [
        { left: o('classroom techniques', 'phương pháp trên lớp'), right: o('new methods … such as child-initiated learning, ability-peer tutoring', 'ví dụ các phương pháp mới') },
        { left: g('favour socially-disadvantaged children', 'có lợi cho trẻ có hoàn cảnh khó khăn'), right: g('particularly useful for bright children from deprived areas', 'đặc biệt hữu ích cho trẻ giỏi ở vùng khó khăn') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('There are quite a number of'), o('new methods', '= classroom techniques'), b('which can help, such as'), o('child-initiated learning, ability-peer tutoring', 'examples')] },
        { n: 2, chips: [b('Such practices'), b('have been found to be'), g('particularly useful for bright children from deprived areas', '= favour socially-disadvantaged children')] },
      ],
    },
    notes: '→ [[1]] ví dụ phương pháp: "child-initiated learning, ability-peer tutoring"\n→ [[2]] "particularly useful for bright children from **deprived areas**" = favour socially-disadvantaged children\n⇒ Đáp án là **D** {ok}',
  },

  q5: {
    paraphrase: {
      question: [s('Less time can be spent on exercises', 'green'), s(' with gifted pupils who '), s('produce accurate work', 'orange')],
      pairs: [
        { left: o('produce accurate work', 'làm bài chính xác'), right: o('make fewer errors', 'mắc ít lỗi hơn') },
        { left: g('Less time can be spent on exercises', 'ít thời gian luyện tập hơn'), right: g('we can shorten the practice', 'rút ngắn phần luyện tập') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('(Shore and Kanevsky, 1993)', 'B'), b('‘If they [the gifted]'), o('merely make fewer errors', '= produce accurate work'), b(', then'), g('we can shorten the practice’', '= less time on exercises')] }],
    },
    notes: '→ Shore và Kanevsky: "If they merely make fewer errors, then we can shorten the practice"\n→ make fewer errors = produce accurate work; shorten the practice = less time spent on exercises\n⇒ Đáp án là **B. Shore and Kanevsky** {ok}',
  },

  q6: {
    paraphrase: {
      question: [s('Self-reliance', 'orange'), s(' is a valuable tool that helps gifted students '), s('reach their goals', 'green'), s('.')],
      pairs: [
        { left: o('Self-reliance', 'sự tự lập'), right: o('independence', 'tính độc lập') },
        { left: g('reach their goals', 'đạt mục tiêu'), right: g('reaching the highest levels of expertise', 'đạt trình độ chuyên môn cao nhất') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Research … by Simonton (1988)', 'D'), b('brought him to the conclusion that'), b('above a certain high level'), ',', o('characteristics such as independence', '= self-reliance'), b('seemed to contribute more to'), g('reaching the highest levels of expertise', '= reach their goals'), b('than intellectual skills')] }],
    },
    notes: '→ Simonton: ở mức cao, "independence" đóng góp nhiều hơn kỹ năng trí tuệ vào việc "reaching the highest levels of expertise"\n→ independence = self-reliance; reaching the highest levels = reach their goals\n⇒ Đáp án là **D. Simonton** {ok}',
  },

  q7: {
    paraphrase: {
      question: [s('Gifted children', 'blue'), s(' know how to '), s('channel their feelings', 'orange'), s(' '), s('to assist their learning', 'green')],
      pairs: [
        { left: b('Gifted children'), right: b('very high IQ and highly achieving children') },
        { left: o('channel their feelings', 'điều hướng cảm xúc'), right: o('she found emotional forces in harness', 'cảm xúc được khai thác, điều khiển') },
        { left: g('to assist their learning'), right: g('improve their learning efficiency and increase their own learning resources') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('In Boekaerts’ (1991) review', 'E'), b('of emotion in the learning of very high IQ and highly achieving children'), ',', b('she found'), o('emotional forces in harness', '= channel their feelings')] },
        { n: 2, chips: [b('They were not only curious, but'), g('had a strong desire to … improve their learning efficiency and increase their own learning resources', '= assist their learning')] },
      ],
    },
    notes: '→ [[1]] Boekaerts thấy ở trẻ IQ rất cao "emotional forces in harness" — cảm xúc được "thắng yên cương", tức được điều khiển\n→ [[2]] cảm xúc đó phục vụ việc học: muốn nâng hiệu quả học, tăng nguồn lực học\n⇒ Đáp án là **E. Boekaerts** {ok}',
  },

  q8: {
    paraphrase: {
      question: [s('The very gifted child', 'blue'), s(' '), s('benefits from appropriate support', 'green'), s(' from '), s('close relatives', 'orange'), s('.')],
      pairs: [
        { left: b('The very gifted child'), right: b('especially over IQ 130') },
        { left: o('close relatives', 'người thân'), right: o('parents … in their home', 'bố mẹ, gia đình') },
        { left: g('benefits from appropriate support', 'được lợi từ sự hỗ trợ'), right: g('the better the quality of their educational backup', 'sự hỗ trợ giáo dục càng tốt') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('(Freeman, 2010)', 'A'), b('The higher the children’s IQ scores'), b('especially over IQ 130', '= very gifted'), ',', g('the better the quality of their educational backup', '= appropriate support'), b('measured in terms of'), o('reported verbal interactions with parents', '= close relatives'), b(', number of books and activities in their home')] }],
    },
    notes: '→ Nghiên cứu của Freeman (2010): trẻ IQ càng cao (nhất là trên 130) thì sự hỗ trợ giáo dục ở nhà càng tốt — gồm trò chuyện với **bố mẹ**, sách, hoạt động\n→ parents = close relatives; educational backup = appropriate support\n⇒ Đáp án là **A. Freeman** {ok}',
  },

  q9: {
    paraphrase: {
      question: [s('Really successful students', 'orange'), s(' have '), s('learnt a considerable amount about their subject', 'green'), s('.')],
      pairs: [
        { left: g('learnt a considerable amount about their subject', 'học được rất nhiều về môn của mình'), right: g('know a great deal about a specific domain', 'biết rất nhiều về 1 lĩnh vực cụ thể') },
        { left: o('Really successful students', 'học sinh thực sự thành công'), right: o('will achieve at a higher level', 'đạt thành tích cao hơn') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('knowledge is also vital to outstanding performance'), ':', b('individuals who'), g('know a great deal about a specific domain', '= learnt a considerable amount about their subject'), o('will achieve at a higher level', '= really successful'), b('than those who do not (Elshout, 1995)', 'C')] }],
    },
    notes: '→ Elshout (1995): người "know a great deal about a specific domain" sẽ đạt thành tích cao hơn\n→ a great deal = a considerable amount; specific domain = their subject\n⇒ Đáp án là **C. Elshout** {ok}',
  },

  q10: {
    paraphrase: {
      question: [s('One study', 'blue'), s(' found '), s('a strong connection', 'orange'), s(' between children’s IQ and the availability of ___ '), s('at home', 'green'), s('.')],
      pairs: [
        { left: o('a strong connection', 'mối liên hệ chặt'), right: o('a very close positive relationship') },
        { left: g('at home'), right: g('in their home') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('the better the quality of their educational backup, measured in terms of'), b('reported verbal interactions with parents', 'không phải "thứ có sẵn"'), ',', b('number of'), o('books and activities', 'đáp án'), g('in their home', '= at home')] }],
    },
    notes: '→ Sự hỗ trợ được đo bằng "verbal interactions with parents, number of **books and activities** in their home"\n→ "the availability of ___" cần những THỨ có sẵn trong nhà → books and activities (3 từ, đúng giới hạn)\n⇒ Đáp án: **books and activities** {ok}',
  },

  q11: {
    paraphrase: {
      question: [s('Children of average ability', 'orange'), s(' seem to '), s('need more direction from teachers', 'green'), s(' because they do not have ___.')],
      pairs: [
        { left: o('Children of average ability'), right: o('more average-ability or older pupils') },
        { left: g('need more direction from teachers', 'cần giáo viên chỉ dẫn nhiều hơn'), right: g('external regulation by the teacher often compensates for', 'sự điều chỉnh từ giáo viên bù đắp cho') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [o('more average-ability or older pupils', '= children of average ability'), b(', for whom'), g('external regulation by the teacher', '= direction from teachers'), g('often compensates for', 'bù cho'), b('lack of', '= do not have'), b('internal regulation', 'đáp án')] }],
    },
    notes: '→ Với học sinh năng lực trung bình, "external regulation by the teacher often compensates for **lack of internal regulation**"\n→ lack of = do not have; external regulation by the teacher = direction from teachers\n⇒ Đáp án: **internal regulation** {ok}',
  },

  q12: {
    paraphrase: {
      question: [s('Meta-cognition', 'orange'), s(' involves children understanding their own learning strategies, as well as '), s('developing', 'green'), s(' ___')],
      pairs: [
        { left: o('Meta-cognition', 'siêu nhận thức'), right: o('metacognition') },
        { left: g('as well as developing ___', 'cũng như phát triển ___'), right: g('Emotional awareness is also part of metacognition', 'nhận thức cảm xúc cũng là 1 phần') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('all children can be helped to identify their own ways of learning', '= understanding their own learning strategies'), '–', o('metacognition')] },
        { n: 2, chips: [g('Emotional awareness', 'đáp án'), b('is also part of', '= as well as'), o('metacognition')] },
      ],
    },
    notes: '→ [[1]] metacognition = nhận biết cách học của chính mình (vế đầu của câu hỏi)\n→ [[2]] "**Emotional awareness** is also part of metacognition" → vế thứ 2\n⇒ Đáp án: **emotional awareness** {ok}',
  },

  q13: {
    paraphrase: {
      question: [s('Teachers who '), s('rely on', 'orange'), s(' what is known as ___ often produce '), s('sets of impressive grades in class tests', 'green'), s('.')],
      pairs: [
        { left: g('sets of impressive grades in class tests', 'điểm số ấn tượng'), right: g('extremely high examination results', 'kết quả thi cực cao') },
        { left: o('what is known as ___', 'cái được gọi là ___'), right: o('‘spoon-feeding’', 'mớm cho ăn — dạy kiểu nhồi sẵn') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Although'), o('‘spoon-feeding’', 'đáp án — trong ngoặc nháy = "what is known as"'), g('can produce extremely high examination results', '= impressive grades'), ',', b('these are not always followed by equally impressive life successes')] }],
    },
    notes: '→ "Although **‘spoon-feeding’** can produce extremely high examination results" → dạy kiểu "mớm sẵn" cho điểm thi rất cao\n→ Từ đặt trong ngoặc nháy thường ứng với "what is known as"\n⇒ Đáp án: **spoon-feeding** {ok}',
  },
}
