import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'
import { linear } from './linear'

// Giải thích từng câu của "Venus in Transit" (id q1…q13 khớp với reading.ts) — do tôi tự soạn từ bài
// đọc, CHƯA đối chiếu đáp án gốc. Viết theo đúng khuôn của cinnamon-explain.ts / trends-explain.ts.
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
      question: [s('examples of '), s('different ways', 'orange'), s(' in which the '), s('parallax principle', 'green'), s(' has been applied')],
      pairs: [
        { left: o('different ways', 'nhiều cách khác nhau'), right: o('used for both measuring the AU AND measuring star distances', 'ít nhất 2 cách áp dụng khác nhau') },
        { left: g('the parallax principle', 'Exact word'), right: g('the parallax principle') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('Johann Franz Encke', 'S'), b('finally determined a value for the AU based on all these parallax measurements', 'cách 1: đo AU')] },
        { n: 2, chips: [b('The parallax principle', 'S'), g('can be extended', 'V'), b('to measure the distances to the stars', 'cách 2: đo khoảng cách tới các ngôi sao')] },
      ],
    },
    notes: '→ [[1]] Parallax được dùng để tính AU (khoảng cách Trái Đất – Mặt Trời)\n→ [[2]] Rồi đoạn F nói nguyên lý này còn được mở rộng (**extended**) để đo khoảng cách tới các ngôi sao\n→ 2 cách áp dụng khác nhau của cùng 1 nguyên lý parallax đều nằm trong đoạn F\n⇒ Đáp án là **F** {ok}',
  },

  q2: {
    paraphrase: {
      question: [s('a description of '), s('an event', 'orange'), s(' which '), s('prevented', 'green'), s(' a transit observation')],
      pairs: [
        { left: o('an event'), right: o('the British were besieging his observation site at Pondicherry', 'sự kiện: bị vây hãm') },
        { left: g('prevented a transit observation', 'ngăn cản việc quan sát'), right: g('thwarted by the fact that...', 'bị cản trở bởi việc...') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('He (=Le Gentil)', 'S'), g('was thwarted', 'V = prevented'), b('by the fact that the British were besieging his observation site at Pondicherry in India', 'sự kiện ngăn cản')] }],
    },
    notes: '→ Le Gentil bị ngăn không quan sát được vì quân Anh đang vây hãm nơi ông đặt trạm quan sát ở Pondicherry\n→ Đây chính là "1 sự kiện ngăn cản việc quan sát transit"\n⇒ Đáp án là **D** {ok}',
  },

  q3: {
    paraphrase: {
      question: [s('a statement about '), s('potential future discoveries', 'orange'), s(' leading on from '), s('transit observations', 'green')],
      pairs: [
        { left: o('potential future discoveries'), right: o('one of the most vital breakthroughs...detecting Earth-sized planets orbiting other stars', 'khám phá tiềm năng trong tương lai') },
        { left: g('leading on from transit observations', 'bắt nguồn từ việc quan sát transit'), right: g('such transits have paved the way for', 'đã mở đường cho') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('such transits', 'S'), g('have paved the way for', 'V = leading on from'), b('what might prove to be one of the most vital breakthroughs...detecting Earth-sized planets orbiting other stars', 'khám phá tương lai')] }],
    },
    notes: '→ Đoạn G: các lần transit đã "mở đường" (paved the way) cho khả năng phát hiện hành tinh giống Trái Đất quanh các ngôi sao khác trong tương lai\n⇒ Đáp án là **G** {ok}',
  },

  q4: {
    paraphrase: {
      question: [s('a description of '), s('physical states', 'orange'), s(' connected with Venus which early astronomical instruments '), s('failed to overcome', 'green')],
      pairs: [
        { left: o('physical states connected with Venus'), right: o('it looks smeared not circular... a halo of light', 'trạng thái vật lý quan sát được của Venus') },
        { left: g('failed to overcome', 'không khắc phục được'), right: g('made it impossible to obtain accurate timings', 'khiến không thể đo chính xác') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('both effects (=black drop + halo of light)', 'S'), g('made it impossible', 'V = failed to overcome'), b('to obtain accurate timings', 'kết quả không đạt được')] }],
    },
    notes: '→ Đoạn E mô tả 2 hiện tượng vật lý gắn với Venus khi transit: "black drop" (hình dạng bị nhoè) và quầng sáng (halo) quanh Venus\n→ Cả 2 đều khiến các nhà thiên văn KHÔNG THỂ đo chính xác được, dù dùng thiết bị thời đó\n⇒ Đáp án là **E** {ok}',
  },

  q5: {
    paraphrase: {
      question: [s('He calculated the distance of the Sun from the Earth', 'orange'), s(' based on observations of Venus with '), s('a fair degree of accuracy.', 'green')],
      pairs: [
        { left: o('calculated the distance of the Sun from the Earth'), right: o('determined a value for the AU based on all these parallax measurements') },
        { left: g('a fair degree of accuracy', 'độ chính xác tương đối tốt'), right: g('reasonably accurate for the time', 'khá chính xác so với thời đó') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Johann Franz Encke', 'S'), b('finally determined a value for the AU', 'V'), b('based on all these parallax measurements: 153,340,000 km', 'kết quả, gần với giá trị hiện đại')] }],
    },
    notes: '→ Encke tính ra giá trị AU (153,340,000 km) — "reasonably accurate", khá gần với giá trị hiện đại (149,597,870 km)\n⇒ Đáp án là **D (Johann Franz Encke)** {ok}',
  },

  q6: {
    paraphrase: {
      question: [s('He understood that the distance of the Sun from the Earth could be worked out', 'orange'), s(' by '), s('comparing observations of a transit.', 'green')],
      pairs: [
        { left: o('understood...could be worked out'), right: o('He realised that...') },
        { left: g('comparing observations of a transit', 'so sánh các quan sát transit'), right: g('by timing the transit from two widely-separated locations', 'đo thời gian transit từ 2 địa điểm cách xa nhau') },
      ],
    },
    breakdown: {
      sentences: [
        {
          chips: [
            b('By timing the transit from two widely-separated locations', ''),
            b('teams of astronomers', 'S'),
            b('could calculate', 'V'),
            b('the parallax angle...allow astronomers to measure...the distance of the Earth from the Sun', 'kết quả: tính được AU'),
          ],
        },
      ],
    },
    notes: '→ Halley là người nhận ra: đo thời gian transit từ 2 nơi cách xa nhau → tính được góc parallax → tính được khoảng cách Trái Đất–Mặt Trời (AU)\n⇒ Đáp án là **A (Edmond Halley)** {ok}',
  },

  q7: {
    paraphrase: {
      question: [s('He realised that the time taken by a planet to go round the Sun', 'orange'), s(' depends on '), s('its distance from the Sun.', 'green')],
      pairs: [
        { left: o('the time taken by a planet to go round the Sun'), right: o('orbital speeds', 'tốc độ quỹ đạo') },
        { left: g('depends on its distance from the Sun', 'phụ thuộc vào khoảng cách tới Mặt Trời'), right: g('the distances of the planets from the Sun governed their orbital speeds', 'khoảng cách chi phối tốc độ quỹ đạo') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Johannes Kepler', 'S'), b('had shown that', 'V'), g('the distances of the planets from the Sun governed their orbital speeds', '= time to orbit depends on distance')] }],
    },
    notes: '→ Kepler chỉ ra rằng khoảng cách của hành tinh tới Mặt Trời quyết định (govern) tốc độ quỹ đạo của nó — tức thời gian đi hết 1 vòng phụ thuộc vào khoảng cách\n⇒ Đáp án là **B (Johannes Kepler)** {ok}',
  },

  q8: {
    paraphrase: {
      question: [s('He witnessed a Venus transit', 'orange'), s(' but was '), s('unable to make any calculations.', 'green')],
      pairs: [
        { left: o('witnessed a Venus transit'), right: o('Le Gentil saw a wonderful transit') },
        { left: g('unable to make any calculations', 'không thể tính toán được'), right: g('the ship’s pitching and rolling ruled out any attempt at making accurate observations', 'con tàu lắc khiến không thể quan sát chính xác') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Le Gentil', 'S'), b('saw a wonderful transit', 'V1 = witnessed'), b('but'), g('the ship’s pitching and rolling ruled out any attempt at making accurate observations', 'V2 = unable to make any calculations')] }],
    },
    notes: '→ Le Gentil quan sát được transit trên tàu, nhưng tàu tròng trành khiến ông không thể đo đạc/tính toán chính xác được\n⇒ Đáp án là **C (Guillaume Le Gentil)** {ok}',
  },

  q9: {
    paraphrase: {
      question: [s('Halley', 'orange'), s(' observed '), s('one transit', 'green'), s(' of the planet Venus.')],
      pairs: [
        { left: o('Halley', 'Exact word'), right: o('Halley') },
        { left: g('one transit of...Venus', 'quan sát 1 lần transit của Venus'), right: g('observed a transit of the innermost planet, Mercury', 'quan sát transit của Mercury, KHÔNG PHẢI Venus'), rel: '≠' },
      ],
    },
    detail: linear({
      question: [g('Halley', 'S'), r('observed one transit of the planet Venus', 'V - quan sát 1 lần Venus đi qua Mặt Trời'), '.'],
      keywords: '"Halley", "observed", "transit", "Venus"',
      where: 'đoạn B và C',
      topic: 'nói về Halley và các lần transit',
      quote: 'In November 1677, **Halley observed a transit of the innermost planet, Mercury** … he accurately predicted that Venus would cross the face of the Sun in both 1761 and 1769 - **though he didn’t survive to see either**.',
      evidence: [
        [g('Halley', 'S'), b('observed', 'V'), r('a transit of … Mercury', 'transit của Sao Thuỷ, không phải Venus')],
        [g('he', 'S'), b('predicted', 'V - dự đoán'), b('Venus transits in 1761 and 1769'), '→', r('didn’t survive to see either', 'không sống tới để xem')],
      ],
      mainIdea: 'Halley chỉ quan sát transit **Mercury**; transit Venus ông chỉ **dự đoán** và **không sống tới** để thấy.',
      inPassage: 'Halley chưa từng quan sát transit Venus nào.',
      inQuestion: 'Halley quan sát **1** lần transit Venus.',
      conclusion: 'Thông tin **trái ngược**.',
      answer: 'FALSE',
      others: [
        ['TRUE', 'chỉ đúng nếu bài nói Halley đã thấy Venus đi qua Mặt Trời → bài nói ông chỉ thấy Mercury.'],
        ['NOT GIVEN', 'bài nói rõ ông không sống tới 1761/1769.'],
      ],
    }),
  },

  q10: {
    paraphrase: {
      question: [s('Le Gentil', 'orange'), s(' managed to observe '), s('a second Venus transit.', 'green')],
      pairs: [
        { left: o('Le Gentil', 'Exact word'), right: o('Le Gentil') },
        { left: g('managed to observe a second Venus transit', 'quan sát THÀNH CÔNG lần transit thứ 2'), right: g('his view was clouded out at the last moment', 'bị mây che ngay phút chót'), rel: '≠' },
      ],
    },
    detail: linear({
      question: [g('Le Gentil', 'S'), r('managed to observe a second Venus transit', 'V - quan sát thành công lần transit thứ 2'), '.'],
      keywords: '"Le Gentil", "second", "transit"',
      where: 'đoạn D',
      topic: 'kể về chuyến đi của Le Gentil',
      quote: '… before setting off to observe the next transit in the Philippines. Ironically, after travelling nearly 50,000 kilometres, **his view was clouded out at the last moment**, a very dispiriting experience.',
      evidence: [
        [g('he (= Le Gentil)', 'S'), b('set off to observe the next transit', 'lần transit thứ 2'), b('in the Philippines')],
        [b('after travelling nearly 50,000 km'), r('his view was clouded out at the last moment', 'V - bị mây che phút chót')],
      ],
      mainIdea: 'Lần transit thứ 2, Le Gentil **bị mây che** nên **không quan sát được**.',
      inPassage: 'Không quan sát được lần transit thứ 2.',
      inQuestion: 'Quan sát **thành công** lần transit thứ 2.',
      conclusion: 'Thông tin **trái ngược**.',
      answer: 'FALSE',
      others: [
        ['TRUE', 'chỉ đúng nếu bài nói ông đã nhìn thấy transit ở Philippines → bài nói bị mây che.'],
        ['NOT GIVEN', 'bài nói rõ kết quả lần quan sát thứ 2.'],
      ],
    }),
  },

  q11: {
    paraphrase: {
      question: [s('The shape of Venus', 'orange'), s(' appears '), s('distorted', 'green'), s(' when it starts to pass in front of the Sun.')],
      pairs: [
        { left: o('The shape of Venus'), right: o('Venus') },
        { left: g('appears distorted', 'trông bị méo/biến dạng'), right: g('it looks smeared not circular', 'trông bị nhoè, không tròn') },
      ],
    },
    detail: linear({
      question: [g('The shape of Venus', 'S - hình dạng Venus'), r('appears distorted', 'V - trông bị méo'), b('when it starts to pass in front of the Sun', 'Time'), '.'],
      keywords: '"shape", "distorted", "starts to pass"',
      where: 'đoạn E',
      topic: 'nói về hiệu ứng "black drop"',
      quote: '**When Venus begins to cross the Sun’s disc, it looks smeared not circular** - which makes it difficult to establish timings.',
      evidence: [[b('When Venus begins to cross the Sun’s disc', 'Time = starts to pass in front of the Sun'), g('it', 'S'), r('looks smeared not circular', 'V - trông nhoè, không tròn')]],
      mainIdea: 'Khi Venus bắt đầu đi qua Mặt Trời, nó **trông nhoè, không tròn**.',
      inPassage: 'smeared not circular.',
      inQuestion: 'distorted (méo).',
      conclusion: 'smeared not circular = distorted; begins to cross = starts to pass → **khớp**.',
      answer: 'TRUE',
      others: [
        ['FALSE', 'chỉ đúng nếu bài nói Venus vẫn tròn, rõ nét → bài nói ngược lại.'],
        ['NOT GIVEN', 'bài mô tả rõ hình dạng Venus lúc bắt đầu transit.'],
      ],
    }),
  },

  q12: {
    paraphrase: {
      question: [s('Early astronomers', 'orange'), s(' suspected that the atmosphere on Venus was '), s('toxic.', 'green')],
      pairs: [
        { left: o('Early astronomers'), right: o('astronomers') },
        { left: b('the atmosphere on Venus'), right: b('a thick layer of gases refracting sunlight') },
        { left: g('toxic'), note: 'không có thông tin trong bài — chỉ nói Venus có lớp khí dày, không nói gì về độc tính' },
      ],
    },
    detail: linear({
      question: [g('Early astronomers', 'S'), r('suspected that the atmosphere on Venus was toxic', 'V - nghi khí quyển Venus độc'), '.'],
      keywords: '"atmosphere", "Venus", "toxic"',
      where: 'đoạn E',
      topic: 'nói về quầng sáng quanh Venus',
      quote: 'While **this showed astronomers that Venus was surrounded by a thick layer of gases refracting sunlight around it**, both effects made it impossible to obtain accurate timings.',
      evidence: [[g('this (= the halo)', 'S'), b('showed astronomers', 'V'), r('Venus was surrounded by a thick layer of gases', 'chỉ biết có lớp khí dày')]],
      mainIdea: 'Nhà thiên văn chỉ biết Venus có **lớp khí dày** → **không nói gì về độc tính**.',
      inPassage: 'Venus có lớp khí dày khúc xạ ánh sáng.',
      inQuestion: 'Nhà thiên văn nghi khí quyển Venus **độc**.',
      conclusion: 'Bài đọc **không cung cấp** thông tin về độc tính của khí quyển.',
      answer: 'NOT GIVEN',
      others: [
        ['TRUE', 'chỉ đúng nếu bài nói họ nghi khí quyển độc → bài không nói.'],
        ['FALSE', 'chỉ đúng nếu bài nói họ cho rằng khí quyển không độc → bài cũng không nói.'],
      ],
    }),
  },

  q13: {
    paraphrase: {
      question: [s('The parallax principle', 'orange'), s(' allows astronomers to work out '), s('how far away distant stars are', 'green'), s(' from the Earth.')],
      pairs: [
        { left: o('The parallax principle', 'Exact word'), right: o('The parallax principle') },
        { left: g('work out how far away distant stars are', 'tính khoảng cách tới các ngôi sao xa'), right: g('the parallax shift lets astronomers calculate the distance', 'độ lệch parallax cho phép tính khoảng cách') },
      ],
    },
    detail: linear({
      question: [g('The parallax principle', 'S'), r('allows astronomers to work out how far away distant stars are', 'V - giúp tính khoảng cách tới các ngôi sao'), '.'],
      keywords: '"parallax principle", "distant stars"',
      where: 'đoạn F',
      topic: 'nói về ứng dụng của nguyên lý parallax',
      quote: '**The parallax principle can be extended to measure the distances to the stars.** … Knowing the width of Earth’s orbit, **the parallax shift lets astronomers calculate the distance**.',
      evidence: [
        [g('The parallax principle', 'S'), b('can be extended', 'V'), r('to measure the distances to the stars', 'đo khoảng cách tới các sao')],
        [g('the parallax shift', 'S'), r('lets astronomers calculate the distance', 'V - giúp tính khoảng cách')],
      ],
      mainIdea: 'Nguyên lý parallax được **mở rộng để đo khoảng cách tới các ngôi sao**.',
      inPassage: 'measure the distances to the stars.',
      inQuestion: 'work out how far away distant stars are.',
      conclusion: 'Cùng nghĩa → **khớp**.',
      answer: 'TRUE',
      others: [
        ['FALSE', 'chỉ đúng nếu bài nói parallax không dùng được cho các ngôi sao → bài nói ngược lại.'],
        ['NOT GIVEN', 'bài nói thẳng điều này.'],
      ],
    }),
  },
}
