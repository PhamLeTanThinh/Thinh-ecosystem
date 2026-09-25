import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'

// Giải thích từng câu của "Should we try to bring extinct species back to life?" (id q1…q13 khớp với reading.ts) —
// do tôi tự soạn từ bài đọc; ĐÁP ÁN đã đối chiếu khớp 100% answer key chính thức. Theo khuôn Paraphrasing + phân tích câu + diễn giải.
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
      question: [s('a reference to how '), s('further disappearance of multiple species', 'orange'), s(' '), s('could be avoided', 'green')],
      pairs: [
        { left: o('further disappearance of multiple species', 'sự biến mất thêm của nhiều loài'), right: o('mass extinctions in the future', 'tuyệt chủng hàng loạt trong tương lai') },
        { left: g('could be avoided', 'có thể tránh được'), right: g('how we could use it to make genetic modifications which could prevent', 'cách dùng công nghệ để biến đổi gen nhằm ngăn chặn') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('She (= Shapiro)'), b('prefers to focus the debate on'), b('how this technology could be used to fully understand why various species went extinct'), ',', b('and therefore'), g('how we could use it to make genetic modifications which could prevent', '= how … could be avoided'), o('mass extinctions in the future', '= further disappearance of multiple species')] }],
    },
    notes: '→ Shapiro muốn dùng công nghệ để hiểu vì sao các loài tuyệt chủng, từ đó "make genetic modifications which could **prevent mass extinctions in the future**"\n→ mass extinctions = disappearance of multiple species; prevent = avoid\n→ Đoạn B {no} chỉ nói thylacine có thể giúp 1 loài (Tasmanian devil), không phải nhiều loài\n⇒ Đáp án là **F** {ok}',
  },

  q2: {
    paraphrase: {
      question: [s('explanation of '), s('a way of reproducing an extinct animal', 'orange'), s(' '), s('using the DNA of only that species', 'green')],
      pairs: [
        { left: o('a way of reproducing an extinct animal', 'cách tái tạo động vật đã tuyệt chủng'), right: o('The basic premise involves using cloning technology … before being born as a living, breathing animal') },
        { left: g('using the DNA of only that species', 'chỉ dùng DNA của chính loài đó'), right: g('turn the DNA of extinct animals into a fertilised embryo', 'biến DNA của loài đã tuyệt chủng thành phôi') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('The basic premise', 'cơ chế cơ bản = explanation of a way'), b('involves using cloning technology'), g('to turn the DNA of extinct animals into a fertilised embryo', 'DNA của CHÍNH loài tuyệt chủng'), ',', b('which is carried by the nearest relative still in existence', 'loài gần nhất chỉ mang thai hộ'), b('before being born as a living, breathing animal')] }],
    },
    notes: '→ Đoạn A giải thích cơ chế "de-extinction": dùng công nghệ nhân bản biến **DNA của loài đã tuyệt chủng** thành phôi, loài họ hàng gần nhất chỉ **mang thai hộ**\n→ Đoạn C {no} bẫy — cách ở đoạn C dùng DNA của loài CÒN SỐNG làm khung rồi chèn DNA loài tuyệt chủng → lai 2 loài, không phải "only that species"\n⇒ Đáp án là **A** {ok}',
  },

  q3: {
    paraphrase: {
      question: [s('reference to '), s('a habitat', 'orange'), s(' which '), s('has suffered', 'green'), s(' '), s('following the extinction of a species', 'blue')],
      pairs: [
        { left: b('following the extinction of a species'), right: b('Since the disappearance of this key species') },
        { left: o('a habitat'), right: o('ecosystems in the eastern US … forests') },
        { left: g('has suffered', 'bị ảnh hưởng xấu'), right: g('have suffered … left forests stagnant', 'bị ảnh hưởng, rừng trì trệ') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('Since the disappearance of this key species', '= following the extinction of a species'), ',', o('ecosystems in the eastern US', '= a habitat'), g('have suffered', 'V')] },
        { n: 2, chips: [b('This'), g('has left forests stagnant', 'rừng trì trệ'), b('and therefore unwelcoming to the plants and animals which evolved to help regenerate the forest')] },
      ],
    },
    notes: '→ [[1]] Kể từ khi bồ câu viễn khách biến mất, hệ sinh thái miền Đông nước Mỹ "have suffered"\n→ [[2]] rừng trở nên trì trệ, không còn phù hợp cho các loài giúp tái sinh rừng\n→ Đoạn B {no} Tasmanian devil bị bệnh là 1 LOÀI chịu ảnh hưởng, không phải môi trường sống\n⇒ Đáp án là **D** {ok}',
  },

  q4: {
    paraphrase: {
      question: [s('mention of '), s('the exact point', 'orange'), s(' at which '), s('a particular species became extinct', 'green')],
      pairs: [
        { left: o('the exact point', 'thời điểm chính xác'), right: o('on 1 September 1914') },
        { left: g('a particular species became extinct'), right: g('the passenger pigeon’s existence came to an end … when the last living specimen died') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [g('the passenger pigeon’s existence came to an end', '= became extinct'), o('on 1 September 1914', '= the exact point'), ',', b('when the last living specimen died at Cincinnati Zoo', 'con cuối cùng chết')] }],
    },
    notes: '→ Bồ câu viễn khách tuyệt chủng đúng ngày "1 September 1914", khi con cuối cùng chết ở vườn thú Cincinnati → thời điểm chính xác\n→ Đoạn B {no} chỉ nói "in the decades since the thylacine went extinct", không có mốc chính xác\n⇒ Đáp án là **A** {ok}',
  },

  q5: {
    paraphrase: {
      question: [s('Professor George Church and his team', 'blue'), s(' are '), s('trying to identify', 'orange'), s(' the ___ '), s('which enabled mammoths to live in the tundra', 'green'), s('.')],
      pairs: [
        { left: o('trying to identify', 'cố xác định'), right: o('By pinpointing', 'bằng cách xác định chính xác') },
        { left: g('which enabled mammoths to live in the tundra'), right: g('made it possible for mammoths to survive the icy climate of the tundra') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [o('By pinpointing', '= trying to identify'), b('which'), g('genetic traits', 'đáp án'), g('made it possible for mammoths to survive the icy climate of the tundra', '= enabled mammoths to live in the tundra'), ',', b('the project’s goal is to return mammoths … to the area')] }],
    },
    notes: '→ pinpointing = identify; made it possible for mammoths to survive the icy climate of the tundra = enabled mammoths to live in the tundra\n→ Thứ cần xác định là "**genetic traits**" (2 từ)\n⇒ Đáp án: **genetic traits** {ok}',
  },

  q6: {
    paraphrase: {
      question: [s('introducing Asian elephants to the tundra would involve '), s('certain physical adaptations', 'orange'), s(' '), s('to minimise', 'green'), s(' ___')],
      pairs: [
        { left: o('certain physical adaptations', 'những thích nghi về cơ thể'), right: o('Necessary adaptations would include smaller ears, thicker hair, and extra insulating fat') },
        { left: g('to minimise ___', 'để giảm thiểu ___'), right: g('for the purpose of reducing heat loss', 'nhằm giảm sự mất nhiệt') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [o('Necessary adaptations', '= certain physical adaptations'), b('would include smaller ears, thicker hair, and extra insulating fat'), ',', b('all'), g('for the purpose of reducing', '= to minimise'), g('heat loss', 'đáp án'), b('in the tundra')] }],
    },
    notes: '→ Các thích nghi cần có đều "for the purpose of reducing **heat loss**" → reducing = minimise\n⇒ Đáp án: **heat loss** {ok}',
  },

  q7: {
    paraphrase: {
      question: [s('the mammoth-like features of '), s('thicker hair', 'blue'), s(', ___ '), s('of a reduced size', 'green')],
      pairs: [
        { left: b('thicker hair', 'Exact word'), right: b('thicker hair') },
        { left: g('___ of a reduced size', '___ có kích thước nhỏ hơn'), right: g('smaller ears', 'tai nhỏ hơn') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Necessary adaptations would include'), g('smaller', '= of a reduced size'), g('ears', 'đáp án'), ',', b('thicker hair', 'đã có trong câu hỏi'), ',', b('and extra insulating fat', '→ câu 8')] }],
    },
    notes: '→ "smaller ears" = ears of a reduced size\n→ "thicker hair" đã có sẵn trong câu hỏi; "extra insulating fat" dành cho câu 8\n⇒ Đáp án: **ears** {ok}',
  },

  q8: {
    paraphrase: {
      question: [s('and '), s('more', 'green'), s(' ___.')],
      pairs: [{ left: g('more ___', 'nhiều ___ hơn'), right: g('extra insulating fat', 'thêm lớp mỡ cách nhiệt') }],
    },
    breakdown: {
      sentences: [{ chips: [b('Necessary adaptations would include smaller ears, thicker hair, and'), g('extra', '= more'), o('insulating fat', 'đáp án')] }],
    },
    notes: '→ "extra insulating fat" = more insulating fat → extra = more\n→ "insulating fat" là 2 từ, đúng giới hạn; viết "fat" cũng được chấm đúng\n⇒ Đáp án: **insulating fat** {ok}',
  },

  q9: {
    paraphrase: {
      question: [s('Repopulating the tundra', 'blue'), s(' … could help to '), s('reduce temperatures', 'orange'), s(' and '), s('decrease', 'green'), s(' ___.')],
      pairs: [
        { left: b('Repopulating the tundra with mammoths or … hybrids'), right: b('This repopulation of the tundra … with large mammals') },
        { left: o('reduce temperatures'), right: o('This grass growth would reduce temperatures') },
        { left: g('decrease ___', 'giảm ___'), right: g('reducing carbon emissions … mitigate emissions from melting permafrost', 'giảm khí thải carbon') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('This repopulation of the tundra'), b('could also be a useful factor in'), g('reducing', '= decrease'), o('carbon emissions', 'đáp án')] },
        { n: 2, chips: [b('This grass growth'), b('would reduce temperatures', 'đã có trong câu hỏi'), b(', and'), g('mitigate', '= decrease'), o('emissions', 'nhắc lại')] },
      ],
    },
    notes: '→ [[1]] việc đưa động vật lớn trở lại lãnh nguyên giúp "reducing **carbon emissions**"\n→ [[2]] cỏ mọc giúp giảm nhiệt độ và "mitigate emissions" → reducing / mitigate = decrease\n→ "carbon emissions" (2 từ) hoặc "emissions" đều đúng\n⇒ Đáp án: **carbon emissions** {ok}',
  },

  q10: {
    paraphrase: {
      question: [s('Reintroducing an extinct species', 'orange'), s(' to its original habitat could '), s('improve the health of a particular species', 'green'), s(' living there.')],
      pairs: [
        { left: o('Reintroducing an extinct species to its original habitat'), right: o('The return of thylacines to Tasmania') },
        { left: g('improve the health of a particular species', 'cải thiện sức khoẻ 1 loài cụ thể'), right: g('help to ensure that devils are never again subjected to risks of this kind', 'giúp loài Tasmanian devil không còn bị bệnh ung thư lây lan') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Michael Archer', 'B'), b('…'), o('The return of thylacines to Tasmania', '= reintroducing an extinct species'), b('could help to ensure that'), g('devils are never again subjected to risks of this kind', 'risks = facial tumour syndrome → sức khoẻ của devils')] }],
    },
    notes: '→ Michael Archer: đưa thylacine trở lại Tasmania giúp loài Tasmanian devil không còn bị bệnh u mặt lây lan ("dangerously debilitating facial tumour syndrome")\n→ Tasmanian devils = a particular species living there; không còn bị bệnh = improve their health\n⇒ Đáp án là **B. Michael Archer** {ok}',
  },

  q11: {
    paraphrase: {
      question: [s('It is important to '), s('concentrate on', 'orange'), s(' '), s('the causes of an animal’s extinction', 'green'), s('.')],
      pairs: [
        { left: o('concentrate on', 'tập trung vào'), right: o('prefers to focus the debate on', 'muốn tập trung tranh luận vào') },
        { left: g('the causes of an animal’s extinction', 'nguyên nhân tuyệt chủng'), right: g('why various species went extinct in the first place', 'vì sao các loài tuyệt chủng ngay từ đầu') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('She (= Beth Shapiro)', 'C'), o('prefers to focus the debate on', '= concentrate on'), b('how this emerging technology could be used to fully understand'), g('why various species went extinct in the first place', '= the causes of extinction')] }],
    },
    notes: '→ Beth Shapiro muốn tập trung vào việc hiểu "why various species went extinct in the first place" = the causes of an animal’s extinction\n⇒ Đáp án là **C. Beth Shapiro** {ok}',
  },

  q12: {
    paraphrase: {
      question: [s('A species brought back from extinction', 'orange'), s(' could have an important '), s('beneficial impact on the vegetation of its habitat', 'green'), s('.')],
      pairs: [
        { left: o('A species brought back from extinction'), right: o('a hybridised band-tailed pigeon, with the added nesting habits of a passenger pigeon') },
        { left: g('beneficial impact on the vegetation of its habitat', 'tác động tốt tới thảm thực vật'), right: g('re-establish that forest disturbance, thereby creating a habitat necessary for a great many other native species to thrive', 'tái lập sự xáo trộn rừng → giúp rừng tái sinh') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('According to Novak', 'A'), ',', o('a hybridised band-tailed pigeon', 'loài được hồi sinh'), b('could, in theory,'), g('re-establish that forest disturbance', 'khôi phục việc làm gãy cành → rừng tái sinh'), ',', g('thereby creating a habitat necessary for a great many other native species to thrive', 'tác động tích cực')] }],
    },
    notes: '→ Novak: loài bồ câu lai có thể tái lập "forest disturbance" (phá cành, làm tổ dày đặc) → rừng hết trì trệ, cây cối tái sinh, tạo môi trường sống cho nhiều loài bản địa\n→ forest regeneration = beneficial impact on the vegetation\n→ George Church (voi ma mút → cỏ mọc) không nằm trong danh sách A-C\n⇒ Đáp án là **A. Ben Novak** {ok}',
  },

  q13: {
    paraphrase: {
      question: [s('Our current efforts', 'orange'), s(' at preserving biodiversity '), s('are insufficient', 'green'), s('.')],
      pairs: [
        { left: o('Our current efforts', 'nỗ lực hiện tại'), right: o('what we are doing today', 'những gì ta đang làm hôm nay') },
        { left: g('are insufficient', 'không đủ'), right: g('is not enough', 'không đủ') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Shapiro', 'C'), b('‘We know that'), o('what we are doing today', '= our current efforts'), g('is not enough', '= insufficient'), b(', and we have to be willing to take some calculated and measured risks.’')] }],
    },
    notes: '→ Shapiro: "We know that what we are doing today is not enough" → current efforts = what we are doing today; insufficient = not enough\n⇒ Đáp án là **C. Beth Shapiro** {ok}',
  },
}
