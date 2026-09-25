import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'
import { linear } from './linear'

// Giải thích từng câu của "Bringing Cinnamon To Europe" (id q1…q13 khớp với reading.ts).
// Câu 1, 2, 3, 9, 12: chép theo nội dung mẫu bạn cung cấp (câu 12 phần cuối bị cắt trong ảnh nên tôi viết tiếp).
// Các câu còn lại (4–8, 10, 11, 13): tôi tự soạn theo cùng khuôn — cần rà soát trước khi dùng nghiêm túc.
//
// Cách viết: o() / g() / b() tạo cụm viền cam / xanh lá / xanh dương, tham số 2 là nhãn phía trên cụm.
// s() tạo 1 đoạn của "Question:" (có màu thì tô nền). Hỗ trợ **đậm** trong text.
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
      question: [s('Biblical times:', 'orange'), s(' '), s('added to **oils**', 'green')],
      pairs: [
        { left: o('Biblical times', 'Exact word'), right: o('Biblical times') },
        { left: g('added to **oils**', 'được thêm vào dầu'), right: g('mixed with **oils**', 'được trộn với dầu') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('It (=cinnamon)', 'S'), b('was known', 'V'), o('in biblical times'), g('as an ingredient that was mixed with oils'), b('for anointing people’s bodies', 'nêu công dụng của nó')] }],
    },
    notes:
      '→ Vào thời kì Biblical times, cinnamon là 1 loại ingredient được mixed with oils để với mục đích để anointing people’s bodies\n→ **mixed with (trộn với) = added to (thêm vào)**\n→ Thứ mà cinnamon sẽ đc thêm vào là oils\n⇒ Đáp án là **oils** {ok}',
  },

  q2: {
    paraphrase: {
      question: [s('Biblical times:', 'orange'), s(' used to '), s('show **friendship** between people', 'green')],
      pairs: [
        { left: o('Biblical times', 'Exact word'), right: o('Biblical times') },
        { left: g('show **friendship** between people', 'cho thấy friendship giữa con người'), right: g('indicating **friendship** among lovers and friends', 'chỉ ra friendship giữa những người yêu nhau và những người bạn') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('It', 'S'), o('was known in biblical times as a token', 'V'), g('indicating friendship among lovers and friends', 'bổ nghĩa cho token')] }],
    },
    notes:
      '- Meaning: Vào thời kì Biblical times, cinnamon là một **token** dùng để **indicate friendship** giữa **lovers and friends**\n⇒ Dù có thể ko hiểu token là gì, nhưng vẫn có thể dựa vào cụm “among lovers and friends” = “between people” để suy ra đáp án là friendship.\n⇒ Chọn friendship {ok}',
  },

  q3: {
    paraphrase: {
      question: [s('Ancient Rome', 'orange'), s(': used for its '), s('sweet smell at **funerals**', 'green')],
      pairs: [
        { left: o('Ancient Rome', 'exact words'), right: o('ancient Rome') },
        { left: g('sweet smell at **funerals**', 'mùi hương dễ chịu tại đám tang'), right: g('**funerals** burnt cinnamon to create a pleasant scent.', 'đám tang đốt quế để tạo mùi hương dễ chịu.') },
      ],
    },
    breakdown: {
      sentences: [{ prefix: 'Bài đọc cho biết:', chips: [b('mourners attending funerals', 'S'), g('burnt cinnamon', 'V'), g('to create a pleasant scent', 'mục đích của burn cinnamon')] }],
    },
    notes: '⇒ Meaning: **mourners tham gia vào funerals** đốt cinnamon để tạo ra **pleasant scent** (=sweet smell)\n⇒ **funerals** là sự kiện mà cinnamon được dùng như 1 dạng sweet smell\n⇒ Đáp án là **funerals** {ok}',
  },

  q4: {
    paraphrase: {
      question: [s('Middle Ages: '), s('was an **indication**', 'orange'), s(' of '), s('a person’s **wealth**', 'green')],
      pairs: [
        { left: o('an **indication**', 'dấu hiệu, biểu hiện'), right: o('a **sign**', 'dấu hiệu') },
        { left: g('a person’s **wealth**', 'sự giàu có của một người'), right: g('the **wealth** at his or her disposal', 'sự giàu có mà chủ tiệc có trong tay') },
      ],
    },
    breakdown: {
      sentences: [{ prefix: 'Bài đọc cho biết:', chips: [b('a host', 'S'), b('would offer', 'V'), b('guests'), b('a plate with various spices piled upon it'), g('as a sign of the wealth at his or her disposal', 'ý nghĩa của hành động này')] }],
    },
    notes: '→ Vào thời Middle Ages, chủ tiệc bày các loại gia vị lên đĩa mời khách để cho thấy **sự giàu có** của mình\n→ **sign (dấu hiệu) = indication (biểu hiện)**\n⇒ Đáp án là **wealth** {ok}',
  },

  q5: {
    paraphrase: {
      question: [s('Middle Ages: '), s('known as a **treatment**', 'orange'), s(' for '), s('**indigestion** and other health problems', 'green')],
      pairs: [
        { left: o('a **treatment** for', 'phương pháp chữa'), right: o('**cure**', 'chữa khỏi') },
        { left: g('other **health problems**', 'các vấn đề sức khoẻ'), right: g('various **ailments**', 'nhiều chứng bệnh') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Cinnamon', 'S'), b('was also reported to have', 'V1'), b('health benefits'), ',', b('and'), b('was thought to cure', 'V2'), b('various ailments'), g(', such as indigestion', 'ví dụ cho ailments')] }],
    },
    notes: '→ Cinnamon được cho là có **health benefits** và có thể **cure** nhiều loại **ailments**\n→ **such as** dùng để đưa ra ví dụ: ailment được nhắc tới là **indigestion**\n⇒ Đáp án là **indigestion** {ok}',
  },

  q6: {
    paraphrase: {
      question: [s('Middle Ages: '), s('**grown**', 'orange'), s(' in '), s('**India**', 'green')],
      pairs: [
        { left: o('grown', 'được trồng'), right: o('was grown', 'được trồng (dạng bị động)') },
        { left: g('in **India**', 'địa điểm cần tìm'), right: g('from **India**, where it was grown', 'từ Ấn Độ, nơi nó được trồng') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('They (=Arab merchants)', 'S'), b('took it', 'V'), g('from India', 'nguồn gốc của quế'), ',', o('where it was grown', 'bổ nghĩa cho India')] }],
    },
    notes: '→ Thương nhân Ả Rập lấy quế **from India, where it was grown** (nơi nó được trồng)\n→ **where it was grown** bổ nghĩa cho **India** ⇒ quế được trồng ở India\n⇒ Đáp án là **India** {ok}',
  },

  q7: {
    paraphrase: {
      question: [s('Middle Ages: '), s('**merchants**', 'orange'), s(' used '), s('**camels**', 'green'), s(' to bring it to '), s('the Mediterranean', 'blue')],
      pairs: [
        { left: o('merchants', 'thương nhân'), right: o('Arab merchants', 'thương nhân Ả Rập') },
        { left: b('to bring it to **the Mediterranean**', 'mang nó tới Địa Trung Hải'), right: b('**on camels** via an overland route to **the Mediterranean**', 'chở bằng lạc đà theo đường bộ tới Địa Trung Hải') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('They (=Arab merchants)', 'S'), b('took it', 'V'), b('from India'), g('on camels', 'phương tiện di chuyển'), b('via an overland route'), b('to the Mediterranean')] }],
    },
    notes: '→ Thương nhân Ả Rập chở quế từ India tới Mediterranean **on camels** (bằng lạc đà) theo đường bộ\n→ **on + phương tiện** = dùng phương tiện đó để di chuyển ⇒ họ used **camels**\n⇒ Đáp án là **camels** {ok}',
  },

  q8: {
    paraphrase: {
      question: [s('Middle Ages: '), s('**arrived** in the Mediterranean', 'orange'), s(' at '), s('**Alexandria**', 'green')],
      pairs: [
        { left: o('the Mediterranean', 'exact words'), right: o('the Mediterranean') },
        { left: g('**arrived** … at', 'đến nơi'), right: g('**journey ended** when they **reached**', 'hành trình kết thúc khi họ tới') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Their journey', 'S'), b('ended', 'V'), g('when they reached Alexandria', 'thời điểm kết thúc hành trình')] }],
    },
    notes: '→ Hành trình của thương nhân Ả Rập kết thúc khi họ **reached** (đến) **Alexandria**\n→ **reached (đến nơi) = arrived at**\n⇒ Đáp án là **Alexandria** {ok}',
  },

  q9: {
    paraphrase: {
      question: [s('Middle Ages: '), s('traders', 'orange'), s(' '), s('took it to **Venice**', 'green'), s(' and sold it to '), s('destinations around Europe', 'blue')],
      pairs: [
        { left: o('traders', 'Exact word'), right: o('traders') },
        { left: g('took it to **Venice**', 'mang nó đến Venice'), right: g('brought it back to **Venice.**', 'đem nó về lại Venice.') },
        { left: b('destinations around Europe', 'những điểm đến vòng quanh Europe'), right: b('to markets all around Europe', 'đến những khu chợ trên toàn Europe') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('European traders', 'S'), b('sailed there', 'V1'), b('to purchase cinnamon'), ',', b('then'), b('brought it back', 'V2'), b('to Venice')] },
        { n: 2, chips: [b('The spice', '= cinnamon'), b('then travelled'), b('from that great trading city'), b('to markets all around Europe')] },
      ],
    },
    notes: '→ [[1]] traders đến mua cinnamon và mang nó về Venice\n→ [[2]] cinnamon đi từ thành phố đó đến khắp Europe.\n→ Tóm lại: traders mang cinnamon và Venice, và từ Venice nó đi khắp Europe\n→ Venice chính là địa điểm traders mang cinnamon đến trước khi bán nó khắp Europe.\n⇒ Đáp án cần tìm là **Venice** {ok}',
  },

  q10: {
    paraphrase: {
      question: [s('The Portuguese', 'orange'), s(' had control over the cinnamon trade in Ceylon ', 'blue'), s('throughout the 16th century', 'green')],
      pairs: [
        { left: o('The Portuguese', 'exact word'), right: o('the Portuguese') },
        { left: b('had **control** over the cinnamon trade', 'kiểm soát việc buôn quế'), right: b('develop a **monopoly** in the cinnamon trade', 'có độc quyền buôn quế') },
        { left: g('throughout the **16th century**', 'suốt thế kỷ 16'), right: g('In **1518** … By **1640** … the **150-year** Portuguese monopoly', 'từ 1518, độc quyền kéo dài 150 năm đến 1640') },
      ],
    },
    detail: linear({
      question: [g('The Portuguese', 'S - người Bồ Đào Nha'), r('had control over the cinnamon trade in Ceylon', 'V - kiểm soát việc buôn quế'), r('throughout the 16th century', 'suốt thế kỷ 16'), '.'],
      keywords: '"The Portuguese", "control", "cinnamon trade", "16th century"',
      where: 'đoạn C và D',
      topic: 'nói về việc người Bồ Đào Nha rồi người Hà Lan nắm việc buôn quế ở Ceylon',
      quote: 'In 1518, the Portuguese built a fort on Ceylon, … so helping them to **develop a monopoly in the cinnamon trade** … By 1640, the Dutch broke the **150-year Portuguese monopoly**',
      evidence: [
        [b('In 1518', 'Time'), g('the Portuguese', 'S'), r('develop a monopoly in the cinnamon trade', 'V - độc quyền buôn quế')],
        [b('By 1640', 'Time'), b('the Dutch', 'S'), b('broke', 'V - phá vỡ'), r('the 150-year Portuguese monopoly', 'độc quyền kéo dài 150 năm')],
      ],
      mainIdea: 'Bồ Đào Nha giữ **độc quyền** buôn quế ở Ceylon suốt **150 năm** tới 1640 → trùm toàn bộ thế kỷ 16.',
      inPassage: 'Độc quyền của Bồ Đào Nha kéo dài từ cuối thế kỷ 15 tới năm 1640.',
      inQuestion: 'Bồ Đào Nha kiểm soát việc buôn quế ở Ceylon **suốt** thế kỷ 16.',
      conclusion: 'monopoly = control; khoảng thời gian độc quyền bao trùm cả thế kỷ 16 → thông tin **khớp**.',
      answer: 'TRUE',
      others: [
        ['FALSE', 'chỉ đúng nếu bài nói Bồ Đào Nha mất quyền kiểm soát trong thế kỷ 16 → bài nói độc quyền kéo dài tới 1640.'],
        ['NOT GIVEN', 'bài có đủ mốc thời gian (1518, 150 năm, 1640) để kết luận.'],
      ],
    }),
  },

  q11: {
    paraphrase: {
      question: [s('The Dutch', 'orange'), s(' took over the cinnamon trade from the Portuguese ', 'blue'), s('as soon as they arrived in Ceylon', 'green')],
      pairs: [
        { left: o('The Dutch', 'exact word'), right: o('the Dutch') },
        { left: b('took over the cinnamon trade', 'giành quyền buôn quế'), right: b('gaining control of the lucrative cinnamon trade', 'giành quyền kiểm soát việc buôn quế') },
        { left: g('**as soon as** they arrived', 'ngay khi vừa tới'), right: g('**By 1640** … **By 1658**', 'phải đến 1640 / 1658 mới làm được'), rel: '≠' },
      ],
    },
    detail: linear({
      question: [g('The Dutch', 'S - người Hà Lan'), r('took over the cinnamon trade from the Portuguese', 'V - giành quyền buôn quế'), r('as soon as they arrived in Ceylon', 'ngay khi vừa tới'), '.'],
      keywords: '"The Dutch", "took over", "as soon as they arrived"',
      where: 'đoạn D',
      topic: 'nói về quá trình người Hà Lan giành quyền buôn quế từ Bồ Đào Nha',
      quote: 'When the Dutch arrived off the coast of southern Asia **at the very beginning of the 17th century**, … **By 1640**, the Dutch broke the 150-year Portuguese monopoly … **By 1658**, they had permanently expelled the Portuguese from the island, thereby gaining control of the lucrative cinnamon trade.',
      evidence: [
        [g('the Dutch arrived', 'S + V'), b('at the very beginning of the 17th century', 'Time - đầu thế kỷ 17')],
        [b('allied with Kandy', 'liên minh trước'), '→', b('By 1640', 'Time'), b('broke the Portuguese monopoly', 'V - phá độc quyền')],
      ],
      result: [b('By 1658', 'Time'), g('they', 'S'), b('expelled the Portuguese', 'V - trục xuất'), r('gaining control of the cinnamon trade', 'mới nắm được việc buôn quế')],
      mainIdea: 'Hà Lan tới **đầu thế kỷ 17**, phải liên minh rồi tới **1640** mới phá độc quyền và **1658** mới nắm hẳn việc buôn quế.',
      inPassage: 'Phải mất vài chục năm (≈1600 → 1640/1658) Hà Lan mới giành được quyền buôn quế.',
      inQuestion: 'Hà Lan giành quyền buôn quế **ngay khi vừa tới** Ceylon.',
      conclusion: '"as soon as" **trái ngược** với quá trình kéo dài hàng chục năm trong bài.',
      answer: 'FALSE',
      others: [
        ['TRUE', 'chỉ đúng nếu bài nói Hà Lan nắm quyền ngay lúc đặt chân tới → bài cho thấy phải tới 1640/1658.'],
        ['NOT GIVEN', 'bài có mốc thời gian cụ thể, đủ để thấy câu hỏi sai.'],
      ],
    }),
  },

  q12: {
    paraphrase: {
      question: [s('The trees planted by the Dutch', 'orange'), s(' '), s('produced larger quantities of cinnamon', 'blue'), s(' than '), s('the wild trees.', 'green')],
      pairs: [
        { left: o('The trees planted by the Dutch', 'những cái cây được trồng bởi người Dutch'), right: { ...o('their (the Dutch’s) own cinnamon trees', 'cây cinnamon của người Dutch'), find: 'their own cinnamon trees' } },
        { left: g('the wild trees', 'exact word'), right: g('the wild trees') },
        { left: b('produced larger quantities of cinnamon'), note: 'không có thông tin trong bài' },
      ],
    },
    detail: linear({
      question: [g('The trees planted by the Dutch', 'S - cây do người Hà Lan trồng'), r('produced larger quantities of cinnamon than the wild trees', 'V - cho nhiều quế hơn cây dại'), '.'],
      keywords: '"trees planted by the Dutch", "wild trees", "larger quantities"',
      where: 'đoạn E',
      topic: 'nói về việc người Hà Lan tự trồng cây quế',
      quote: 'Over time, the supply of cinnamon trees on the island became nearly exhausted, due to systematic stripping of the bark. Eventually, the Dutch began **cultivating their own cinnamon trees to supplement the diminishing number of wild trees** available for use.',
      evidence: [
        [g('the supply of cinnamon trees', 'S'), b('became nearly exhausted', 'V - gần cạn kiệt')],
        [g('the Dutch', 'S'), b('began cultivating their own cinnamon trees', 'V - tự trồng cây'), b('to supplement the diminishing number of wild trees', 'mục đích - bù cho cây dại đang giảm')],
      ],
      mainIdea: 'Cây dại gần cạn → Hà Lan **tự trồng thêm để bù số lượng** → **không so sánh sản lượng** giữa cây trồng và cây dại.',
      inPassage: 'Chỉ nói lý do trồng cây (bù cho số cây dại đang giảm).',
      inQuestion: 'Cây Hà Lan trồng cho **nhiều quế hơn** cây dại.',
      conclusion: 'Bài đọc **không cung cấp** thông tin so sánh sản lượng quế.',
      answer: 'NOT GIVEN',
      others: [
        ['TRUE', 'chỉ đúng nếu bài nói cây trồng cho sản lượng cao hơn → bài không nói.'],
        ['FALSE', 'chỉ đúng nếu bài nói cây trồng cho ít quế hơn hoặc bằng cây dại → bài cũng không nói.'],
      ],
    }),
  },

  q13: {
    paraphrase: {
      question: [s('The spice trade', 'orange'), s(' '), s('maintained its economic importance', 'blue'), s(' '), s('during the 19th century', 'green')],
      pairs: [
        { left: o('The **spice trade**', 'exact words'), right: o('the **spice trade** overall') },
        { left: b('maintained its economic **importance**', 'giữ nguyên tầm quan trọng kinh tế'), right: b('was **diminishing** in economic **potential**', 'đang suy giảm tiềm năng kinh tế'), rel: '≠' },
        { left: g('during the **19th century**', 'trong thế kỷ 19'), right: g('By the **middle of the 19th century**', 'vào giữa thế kỷ 19') },
      ],
    },
    detail: linear({
      question: [g('The spice trade', 'S - việc buôn gia vị'), r('maintained its economic importance', 'V - giữ nguyên tầm quan trọng kinh tế'), b('during the 19th century', 'Time'), '.'],
      keywords: '"spice trade", "economic importance", "19th century"',
      where: 'đoạn F',
      topic: 'nói về việc buôn gia vị vào giữa thế kỷ 19',
      quote: 'By the middle of the 19th century, … Not only was a monopoly of cinnamon becoming impossible, but **the spice trade overall was diminishing in economic potential**, and was eventually superseded by the rise of trade in coffee, tea, chocolate, and sugar.',
      evidence: [
        [b('By the middle of the 19th century', 'Time'), g('a monopoly of cinnamon', 'S'), b('becoming impossible', 'V - không thể độc quyền')],
        [g('the spice trade overall', 'S'), r('was diminishing in economic potential', 'V - giảm tiềm năng kinh tế'), '→', b('superseded by coffee, tea, chocolate, sugar', 'bị thay thế')],
      ],
      mainIdea: 'Giữa thế kỷ 19, buôn gia vị **suy giảm** giá trị kinh tế và dần bị thay thế.',
      inPassage: 'diminishing in economic potential (đang suy giảm).',
      inQuestion: 'maintained its economic importance (giữ nguyên).',
      conclusion: 'maintained **trái ngược** với diminishing.',
      answer: 'FALSE',
      others: [
        ['TRUE', 'chỉ đúng nếu bài nói buôn gia vị vẫn quan trọng như trước → bài nói ngược lại.'],
        ['NOT GIVEN', 'bài nói rõ giá trị kinh tế của buôn gia vị ở thế kỷ 19.'],
      ],
    }),
  },
}
