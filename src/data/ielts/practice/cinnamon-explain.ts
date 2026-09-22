import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'

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
    breakdown: {
      sentences: [
        { n: 1, chips: [g('In 1518', 'mốc bắt đầu'), ',', b('the Portuguese', 'S'), b('built a fort on Ceylon', 'V'), b('which enabled them to protect the island'), b('so helping them to develop a monopoly in the cinnamon trade', 'kết quả: độc quyền')] },
        { n: 2, chips: [g('By 1640', 'mốc kết thúc'), ',', b('the Dutch', 'S'), b('broke', 'V'), b('the 150-year Portuguese monopoly')] },
      ],
    },
    notes: '→ [[1]] Từ **1518**, người Bồ Đào Nha có pháo đài và bắt đầu độc quyền cinnamon\n→ [[2]] Đến **1640** người Hà Lan mới phá vỡ **150-year monopoly** này (150 năm trước 1640 ≈ 1490)\n→ Độc quyền kéo dài từ cuối thế kỷ 15 đến 1640 ⇒ bao trùm toàn bộ thế kỷ 16\n⇒ Đáp án là **True** {ok}',
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
    breakdown: {
      sentences: [
        { n: 1, chips: [b('the Dutch', 'S'), b('arrived off the coast of southern Asia'), g('at the very beginning of the 17th century', 'thời điểm họ tới')] },
        { n: 2, chips: [g('By 1640', 'mốc 1'), ',', b('the Dutch', 'S'), b('broke the 150-year Portuguese monopoly', 'V')] },
        { n: 3, chips: [g('By 1658', 'mốc 2'), ',', b('they', 'S'), b('had permanently expelled the Portuguese', 'V'), b('from the island')] },
      ],
    },
    notes: '→ Người Hà Lan tới vào đầu thế kỷ 17, nhưng phải đến **1640** mới phá được độc quyền và đến **1658** mới đuổi hẳn người Bồ Đào Nha\n→ Khoảng cách hàng chục năm ⇒ **không phải** “as soon as they arrived”\n⇒ Đáp án là **False** {ok}',
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
    breakdown: {
      sentences: [{ chips: [b('the Dutch', 'S'), b('began cultivating', 'V'), b('their own cinnamon trees'), b('to supplement the diminishing number of wild trees', 'mục đích của V')] }],
    },
    notes:
      '- Câu này chỉ nói rằng: the Dutch trồng cinnamon trees của riêng họ để bổ sung cho số lượng wild trees đang giảm\n→ Câu này chỉ nói **số lượng wild trees giảm**, chứ hoàn toàn ko so sánh **số lượng quế** được sản xuất bởi **cây do người Dutch trồng** với **wild trees**\n⇒ Đáp án là **Not Given** {ok}',
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
    breakdown: {
      sentences: [{ chips: [b('the spice trade overall', 'S'), b('was diminishing', 'đang suy giảm'), b('in economic potential'), ',', b('and'), b('was eventually superseded', 'V2'), b('by the rise of trade in coffee, tea, chocolate, and sugar')] }],
    },
    notes: '→ Đến giữa thế kỷ 19, **spice trade** đang **diminishing in economic potential** (giảm tiềm năng kinh tế)\n→ Câu hỏi nói **maintained** (giữ nguyên) ⇒ **trái ngược** với **diminishing**\n⇒ Đáp án là **False** {ok}',
  },
}
