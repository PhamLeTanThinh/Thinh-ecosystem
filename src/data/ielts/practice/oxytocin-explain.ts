import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'

// Giải thích từng câu của "Oxytocin" (id q1…q13 khớp với reading.ts) — do tôi tự soạn từ bài đọc; ĐÁP ÁN đã đối
// chiếu khớp 100% answer key chính thức. Theo khuôn Paraphrasing + phân tích câu + diễn giải.
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
      question: [s('reference to research showing '), s('the beneficial effects', 'green'), s(' of oxytocin '), s('on people', 'orange')],
      pairs: [
        { left: o('on people'), right: o('oxytocin’s role in human behaviour … effects of oxytocin on human interactions') },
        { left: g('the beneficial effects', 'tác động tích cực'), right: g('people become more charitable, better at reading emotions … and at communicating constructively in arguments', 'hào phóng hơn, đọc cảm xúc tốt hơn, tranh luận xây dựng hơn') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('participants who had sniffed oxytocin'), g('invested more money', 'tin tưởng hơn'), b('than those who received a placebo')] },
        { n: 2, chips: [b('These follow-up studies have shown that after a sniff of the hormone'), ',', o('people', '= on people'), g('become more charitable, better at reading emotions on others’ faces and at communicating constructively in arguments', '= beneficial effects')] },
      ],
    },
    notes: '→ Đoạn B kể các nghiên cứu trên NGƯỜI: [[1]] thí nghiệm 2005 người hít oxytocin tin tưởng, đầu tư nhiều hơn; [[2]] các nghiên cứu sau cho thấy người ta hào phóng hơn, đọc cảm xúc tốt hơn, tranh luận xây dựng hơn\n→ Đoạn A {no} bẫy — đoạn A cũng nói "more trusting, empathetic…" nhưng chỉ là lời đồn ("it is claimed"), không phải NGHIÊN CỨU\n⇒ Đáp án là **B** {ok}',
  },

  q2: {
    paraphrase: {
      question: [s('reasons', 'orange'), s(' why '), s('the effects of oxytocin are complex', 'green')],
      pairs: [
        { left: g('the effects of oxytocin are complex', 'tác động phức tạp'), right: g('the oxytocin story has become more perplexing', 'câu chuyện oxytocin trở nên khó hiểu hơn') },
        { left: o('reasons', 'lý do'), right: o('a very simple and ancient molecule that has been co-opted for many different functions … affects primitive parts of the brain', 'phân tử cổ xưa, đảm nhiệm nhiều chức năng, tác động phần não nguyên thuỷ') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('Perhaps we should not be surprised that'), g('the oxytocin story has become more perplexing', '= effects are complex')] },
        { n: 2, chips: [o('It’s a very simple and ancient molecule that has been co-opted for many different functions', 'lý do 1')] },
        { n: 3, chips: [o('It affects primitive parts of the brain like the amygdala', 'lý do 2'), b(', so it’s going to have many effects on just about everything')] },
        { n: 4, chips: [o('these basic processes could manifest in different ways depending on individual differences and context', 'lý do 3 (Bartz)')] },
      ],
    },
    notes: '→ [[1]] đoạn F mở đầu: không ngạc nhiên khi oxytocin ngày càng khó hiểu (perplexing = complex)\n→ [[2]] + [[3]] + [[4]] giải thích **tại sao**: phân tử cổ xưa đảm nhiệm nhiều chức năng, tác động tới phần não nguyên thuỷ, biểu hiện khác nhau tuỳ người và hoàn cảnh\n→ Đoạn C, D {no} chỉ nêu các kết quả trái ngược, không giải thích LÝ DO\n⇒ Đáp án là **F** {ok}',
  },

  q3: {
    paraphrase: {
      question: [s('mention of '), s('a period', 'orange'), s(' in which oxytocin '), s('attracted little scientific attention', 'green')],
      pairs: [
        { left: o('a period', '1 khoảng thời gian'), right: o('For eight years', 'suốt 8 năm') },
        { left: g('attracted little scientific attention', 'ít được giới khoa học chú ý'), right: g('it was quite a lonesome field', 'là 1 lĩnh vực khá cô đơn (ít người nghiên cứu)') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [o('‘For eight years', '= a period'), ',', g('it was quite a lonesome field,’', '= attracted little scientific attention'), b('Heinrichs recalls.'), b('‘Now, everyone is interested.’', 'đối lập: giờ ai cũng quan tâm')] }],
    },
    notes: '→ Heinrichs: "For eight years, it was quite a **lonesome field**" — suốt 8 năm, lĩnh vực này gần như không ai nghiên cứu\n→ "Now, everyone is interested" càng khẳng định trước đó ít ai chú ý\n⇒ Đáp án là **B** {ok}',
  },

  q4: {
    paraphrase: {
      question: [s('reference to '), s('people ignoring', 'orange'), s(' '), s('certain aspects of their research data', 'green')],
      pairs: [
        { left: o('people ignoring', 'phớt lờ'), right: o('researchers took no notice of', 'nhà nghiên cứu không để ý tới') },
        { left: g('certain aspects of their research data'), right: g('such findings (= oxytocin influenced only certain individuals or in certain circumstances)') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('in almost half of the existing research results'), ',', g('oxytocin influenced only certain individuals or in certain circumstances', 'những kết quả bị bỏ qua')] },
        { n: 2, chips: [b('Where once'), o('researchers took no notice of', '= people ignoring'), g('such findings', '= certain aspects of their research data'), b(', now a more nuanced understanding … is propelling investigations down new lines')] },
      ],
    },
    notes: '→ [[1]] gần nửa kết quả nghiên cứu cho thấy oxytocin chỉ tác động lên 1 số người / hoàn cảnh\n→ [[2]] "Where once researchers **took no notice of** such findings" = people ignoring certain aspects of their research data\n⇒ Đáp án là **E** {ok}',
  },

  q5: {
    paraphrase: {
      question: [s('People are '), s('more trusting', 'green'), s(' when affected by oxytocin.')],
      pairs: [{ left: g('more trusting', 'tin tưởng hơn'), right: g('invested more money with an anonymous person who was not guaranteed to be honest', 'đầu tư nhiều tiền hơn cho người lạ không chắc trung thực') }],
    },
    breakdown: {
      sentences: [{ chips: [b('Markus Heinrichs', 'A'), b('asked volunteers to'), b('invest money with an anonymous person who was not guaranteed to be honest'), '→', b('participants who had sniffed oxytocin'), g('invested more money', '= more trusting'), b('than those who received a placebo')] }],
    },
    notes: '→ Thí nghiệm của Markus Heinrichs: người hít oxytocin đầu tư nhiều tiền hơn vào 1 người lạ không chắc trung thực → họ **tin tưởng hơn**\n→ Đoạn A cũng nói "more trusting" nhưng không gắn với nhà nghiên cứu nào\n⇒ Đáp án là **A. Markus Heinrichs** {ok}',
  },

  q6: {
    paraphrase: {
      question: [s('Oxytocin '), s('increases', 'orange'), s(' people’s '), s('feelings of jealousy', 'green'), s('.')],
      pairs: [
        { left: g('feelings of jealousy', 'cảm giác ghen tị'), right: g('felt more envy', 'cảm thấy đố kỵ hơn') },
        { left: o('increases'), right: o('more … more') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Simone Shamay-Tsoory', 'B'), b('found that when volunteers played a competitive game'), ',', b('those who inhaled the hormone'), b('showed more pleasure when they beat other players'), b(', and'), g('felt more envy when others won', '= increases feelings of jealousy')] }],
    },
    notes: '→ Simone Shamay-Tsoory: người hít oxytocin "felt more envy when others won" → envy = jealousy\n⇒ Đáp án là **B. Simone Shamay-Tsoory** {ok}',
  },

  q7: {
    paraphrase: {
      question: [s('The effect of oxytocin '), s('varies from one type of person to another', 'green'), s('.')],
      pairs: [{ left: g('varies from one type of person to another', 'khác nhau tuỳ kiểu người'), right: g('sharply contrasting outcomes depending on a person’s disposition … only if they are not very socially adept … reduces cooperation in subjects who are particularly anxious', 'kết quả trái ngược tuỳ tính cách') }],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('administering oxytocin also has'), g('sharply contrasting outcomes depending on a person’s disposition', '= varies from one type of person to another')] },
        { n: 2, chips: [b('Jennifer Bartz', 'C'), b('found that it improves people’s ability to read emotions'), g('but only if they are not very socially adept to begin with', 'kiểu người 1')] },
        { n: 3, chips: [b('oxytocin in fact reduces cooperation in'), g('subjects who are particularly anxious or sensitive to rejection', 'kiểu người 2')] },
      ],
    },
    notes: '→ [[1]] tác động của oxytocin khác nhau tuỳ "disposition" (tính cách)\n→ [[2]] + [[3]] Jennifer Bartz chỉ ra: giúp người kém giao tiếp đọc cảm xúc tốt hơn, nhưng lại làm người hay lo âu kém hợp tác hơn\n→ Carolyn DeClerck (D) {no} tác động khác nhau tuỳ người ta ĐANG TƯƠNG TÁC với ai, không phải tuỳ kiểu người\n⇒ Đáp án là **C. Jennifer Bartz** {ok}',
  },

  q8: {
    paraphrase: {
      question: [s('The earliest findings', 'orange'), s(' about oxytocin and bonding came from '), s('research involving', 'green'), s(' ___.')],
      pairs: [
        { left: o('The earliest findings', 'phát hiện sớm nhất'), right: o('scientists first became aware of the influence of oxytocin', 'lần đầu nhận biết') },
        { left: g('research involving ___'), right: g('various studies focusing on animals', 'các nghiên cứu trên động vật') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('It was through'), g('various studies focusing on', '= research involving'), b('animals', 'đáp án'), b('that'), o('scientists first became aware of the influence of oxytocin', '= the earliest findings')] }],
    },
    notes: '→ "It was through various studies focusing on **animals** that scientists first became aware of the influence of oxytocin"\n→ first became aware = earliest findings; studies focusing on = research involving\n⇒ Đáp án: **animals** {ok}',
  },

  q9: {
    paraphrase: {
      question: [s('It was also discovered that '), s('humans produce oxytocin', 'orange'), s(' during ___.')],
      pairs: [{ left: o('humans produce oxytocin', 'con người tiết oxytocin'), right: o('It is also released by women', 'phụ nữ cũng tiết ra') }],
    },
    breakdown: {
      sentences: [{ chips: [b('It (= oxytocin)'), o('is also released by women', '= humans produce oxytocin'), b('in'), g('childbirth', 'đáp án'), b(', strengthening the attachment between mother and baby')] }],
    },
    notes: '→ "It is also released by women in **childbirth**" → released by women = humans produce\n⇒ Đáp án: **childbirth** {ok}',
  },

  q10: {
    paraphrase: {
      question: [s('An experiment in 2005', 'blue'), s(', in which participants were given '), s('either oxytocin or a', 'orange'), s(' ___, reinforced the belief that the hormone had a positive effect.')],
      pairs: [
        { left: b('An experiment in 2005'), right: b('Oxytocin’s role in human behaviour first emerged in 2005') },
        { left: o('given either oxytocin or a ___', 'được cho oxytocin hoặc ___'), right: o('participants who had sniffed oxytocin … than those who received a placebo', 'nhóm hít oxytocin vs nhóm nhận giả dược') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('participants who had sniffed oxytocin via a nasal spray beforehand'), b('invested more money than'), o('those who received a', '= either … or a'), g('placebo', 'đáp án — giả dược')] }],
    },
    notes: '→ Thí nghiệm 2005 so sánh nhóm hít oxytocin với nhóm "received a **placebo**" (giả dược)\n⇒ Đáp án: **placebo** {ok}',
  },

  q11: {
    paraphrase: {
      question: [s('A study at the University of Haifa', 'blue'), s(' where participants '), s('took part in a', 'orange'), s(' ___ revealed '), s('the negative emotions', 'green'), s(' which oxytocin can trigger.')],
      pairs: [
        { left: b('A study at the University of Haifa'), right: b('Simone Shamay-Tsoory at the University of Haifa') },
        { left: o('took part in a ___'), right: o('volunteers played a competitive game') },
        { left: g('the negative emotions', 'cảm xúc tiêu cực'), right: g('felt more envy when others won', 'đố kỵ hơn khi người khác thắng') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Simone Shamay-Tsoory at the University of Haifa'), b('found that when volunteers'), o('played a competitive', '= took part in a'), o('game', 'đáp án'), ',', b('those who inhaled the hormone'), g('felt more envy when others won', '= negative emotions')] }],
    },
    notes: '→ Nghiên cứu ở Đại học Haifa: người tham gia "played a competitive **game**" → cảm thấy đố kỵ hơn khi người khác thắng (negative emotions)\n→ Chỉ được 1 từ → "game" (không viết "competitive game")\n⇒ Đáp án: **game** {ok}',
  },

  q12: {
    paraphrase: {
      question: [s('A study at the University of Antwerp', 'blue'), s(' showed '), s('people’s lack of willingness to help', 'orange'), s(' ___ while under the influence of oxytocin.')],
      pairs: [
        { left: b('A study at the University of Antwerp'), right: b('Carolyn DeClerck of the University of Antwerp') },
        { left: o('lack of willingness to help', 'không sẵn lòng giúp đỡ'), right: o('became less cooperative', 'kém hợp tác hơn') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('people who had received a dose of oxytocin', '= under the influence of oxytocin'), o('actually became less cooperative', '= lack of willingness to help'), b('when dealing with complete'), g('strangers', 'đáp án')] }],
    },
    notes: '→ Nghiên cứu ở Antwerp: người được cho oxytocin "became less cooperative when dealing with complete **strangers**"\n→ less cooperative = lack of willingness to help\n⇒ Đáp án: **strangers** {ok}',
  },

  q13: {
    paraphrase: {
      question: [s('people who have been given oxytocin consider ___ '), s('that are familiar to them in their own country', 'green'), s(' to have '), s('more positive associations', 'orange'), s(' than those from other cultures.')],
      pairs: [
        { left: o('have more positive associations', 'có liên tưởng tích cực hơn'), right: o('quicker to associate positive words with', 'nhanh hơn trong việc gắn từ tích cực với') },
        { left: g('that are familiar to them in their own country … than those from other cultures'), right: g('Dutch names than with foreign ones', 'tên Hà Lan so với tên nước ngoài') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Carsten De Dreu at the University of Amsterdam'), b('discovered that volunteers given oxytocin showed favouritism'), ':', b('Dutchmen'), o('became quicker to associate positive words with', '= more positive associations'), b('Dutch'), g('names', 'đáp án'), b('than with foreign ones', '= those from other cultures')] }],
    },
    notes: '→ Nghiên cứu ở Amsterdam: người Hà Lan được cho oxytocin gắn từ tích cực với **tên** Hà Lan nhanh hơn tên nước ngoài\n→ Dutch names = names that are familiar to them in their own country\n⇒ Đáp án: **names** {ok}',
  },
}
