import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'

// Giải thích từng câu của "Saving bugs to find new drugs" (id khớp với reading.ts) — do tôi tự soạn từ bài đọc; ĐÁP ÁN
// cả 13 câu đã đối chiếu khớp answer key chính thức. Theo khuôn Paraphrasing + phân tích câu + diễn giải.
const chip =
  (color: ChipColor) =>
  (text: string, label?: string): ExChip => ({ text, color, label })
const o = chip('orange')
const g = chip('green')
const b = chip('blue')
const s = (text: string, color?: ChipColor) => ({ text, color })

// Câu 8-9 (Choose TWO) dùng chung 1 giải thích.
const PICK_TWO: Explanation = {
  paraphrase: {
    question: [s('Which TWO of the following '), s('make insects interesting', 'orange'), s(' for '), s('drug research', 'blue'), s('?')],
    answer: [s('B - '), s('the variety of substances insects have developed to protect themselves', 'green'), s(' · C - '), s('the potential to extract and make use of insects’ genetic codes', 'green')],
    pairs: [
      { left: g('the variety of substances insects have developed to protect themselves', 'nhiều loại chất côn trùng tạo ra để tự vệ'), right: g('driven the evolution of an enormous range of very interesting compounds for defensive and offensive purposes', 'tiến hoá ra vô số hợp chất để phòng thủ và tấn công') },
      { left: g('the potential to extract and make use of insects’ genetic codes', 'khả năng trích xuất và dùng mã gen'), right: g('snip out the stretches of the insect’s DNA that carry the codes … insert them into cell lines', 'cắt đoạn DNA mang mã và cấy vào dòng tế bào') },
    ],
  },
  breakdown: {
    sentences: [
      { n: 1, prefix: 'Đoạn D:', chips: [b('they have a bewildering array of interactions with other organisms'), ',', b('something which has driven the evolution of'), g('an enormous range of very interesting compounds for defensive and offensive purposes', '= B')] },
      { n: 2, prefix: 'Đoạn H:', chips: [b('it is now possible to'), g('snip out the stretches of the insect’s DNA that carry the codes for the interesting compounds', '= C'), b('and insert them into cell lines that allow larger quantities to be produced')] },
    ],
  },
  notes:
    '→ [[1]] côn trùng tiến hoá ra "an enormous range of very interesting compounds for **defensive** … purposes" → **B. the variety of substances insects have developed to protect themselves** {ok}\n→ [[2]] giờ có thể "snip out the stretches of the insect’s DNA that carry the **codes**" → **C. the potential to extract and make use of insects’ genetic codes** {ok}\n→ A. the huge number of individual insects {no} bẫy — đoạn F nói số lượng khổng lồ chỉ tập trung ở vài loài phổ biến, và "so many insects" lại là KHÓ KHĂN, không phải điểm hấp dẫn\n→ D. the similarities between different species {no} bài nhấn mạnh sự ĐA DẠNG (diversity), không phải điểm giống nhau\n→ E. the manageable size of most insects {no} ngược lại — "insects are generally very small" là 1 khó khăn (đoạn F)\n⇒ Đáp án: **B** và **C** (thứ tự nào cũng được)',
}

export const EXPLAIN: Record<string, Explanation> = {
  q8: PICK_TWO,
  q9: PICK_TWO,

  q1: {
    paraphrase: {
      question: [s('mention of '), s('factors driving', 'orange'), s(' a '), s('renewed interest in natural medicinal compounds', 'green')],
      pairs: [
        { left: g('a renewed interest in natural medicinal compounds', 'sự quan tâm TRỞ LẠI với hợp chất tự nhiên'), right: g('new approaches focusing once again on natural products … put bioprospecting firmly back on the map', 'lại tập trung vào sản phẩm tự nhiên') },
        { left: o('factors driving', 'các yếu tố thúc đẩy'), right: o('Laboratory-based drug discovery has achieved varying levels of success … the ability to mine genomes … several looming health crises, such as antibiotic resistance', 'thành công hạn chế, khả năng khai thác gen, khủng hoảng y tế') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [o('Laboratory-based drug discovery has achieved varying levels of success', 'yếu tố 1'), ',', b('something which has now prompted'), g('the development of new approaches focusing once again on natural products', '= renewed interest')] },
        { n: 2, chips: [o('With the ability to mine genomes for useful compounds', 'yếu tố 2'), ',', b('we have barely scratched the surface of nature’s molecular diversity')] },
        { n: 3, chips: [b('This realisation'), ',', o('together with several looming health crises, such as antibiotic resistance', 'yếu tố 3'), ',', g('has put bioprospecting firmly back on the map', '= renewed interest')] },
      ],
    },
    notes: '→ Đoạn C liệt kê các lý do khiến người ta **quay lại** tìm thuốc từ tự nhiên: [[1]] phương pháp phòng thí nghiệm thành công hạn chế, [[2]] khả năng khai thác bộ gen, [[3]] khủng hoảng y tế như kháng kháng sinh\n→ "once again", "back on the map" = renewed\n→ Đoạn B {no} nói lý do người ta RỜI BỎ tự nhiên (câu 6), không phải quay lại\n⇒ Đáp án là **C** {ok}',
  },

  q2: {
    paraphrase: {
      question: [s('how '), s('recent technological advances', 'orange'), s(' have '), s('made insect research easier', 'green')],
      pairs: [
        { left: o('recent technological advances', 'tiến bộ công nghệ gần đây'), right: o('it is now possible to snip out the stretches of the insect’s DNA … and insert them into cell lines', 'giờ có thể cắt đoạn DNA và cấy vào dòng tế bào') },
        { left: g('made insect research easier', 'giúp nghiên cứu côn trùng dễ hơn'), right: g('allow larger quantities to be produced', 'cho phép sản xuất lượng lớn hơn') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('natural history knowledge'), b('doesn’t solve'), b('the problems associated with obtaining useful compounds from insects', 'vấn đề: khó lấy đủ hợp chất')] },
        { n: 2, chips: [b('Fortunately'), ',', o('it is now possible to snip out the stretches of the insect’s DNA … and insert them into cell lines', '= recent technological advances'), g('that allow larger quantities to be produced', '= made research easier')] },
      ],
    },
    notes: '→ [[1]] vấn đề: khó thu được đủ hợp chất từ côn trùng\n→ [[2]] "Fortunately, it is **now** possible" cắt đoạn DNA và cấy vào dòng tế bào → sản xuất được lượng lớn hơn → nghiên cứu dễ hơn\n⇒ Đáp án là **H** {ok}',
  },

  q3: {
    paraphrase: {
      question: [s('examples of '), s('animals', 'orange'), s(' which '), s('use medicinal substances from nature', 'green')],
      pairs: [
        { left: o('animals'), right: o('other primates - such as the capuchin monkeys … or the chimpanzees') },
        { left: g('use medicinal substances from nature', 'dùng chất có tính chữa bệnh từ tự nhiên'), right: g('rub themselves with toxin-oozing millipedes to deter mosquitoes … use noxious forest plants to rid themselves of intestinal parasites') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('You only have to look at other primates', 'ví dụ động vật'), '-', o('capuchin monkeys', 'ví dụ 1'), g('rub themselves with toxin-oozing millipedes to deter mosquitoes', 'dùng cuốn chiếu đuổi muỗi'), ',', b('or'), o('the chimpanzees', 'ví dụ 2'), g('who use noxious forest plants to rid themselves of intestinal parasites', 'dùng cây rừng trị ký sinh trùng')] }],
    },
    notes: '→ Đoạn A đưa 2 ví dụ: khỉ capuchin dùng cuốn chiếu tiết độc để đuổi muỗi, tinh tinh dùng cây rừng để trị ký sinh trùng đường ruột\n⇒ Đáp án là **A** {ok}',
  },

  q4: {
    paraphrase: {
      question: [s('reasons', 'orange'), s(' why it is '), s('challenging to use insects in drug research', 'green')],
      pairs: [
        { left: g('challenging to use insects in drug research', 'khó dùng côn trùng trong nghiên cứu thuốc'), right: g('Why is it that insects have received relatively little attention in bioprospecting?', 'vì sao côn trùng ít được chú ý') },
        { left: o('reasons'), right: o('Firstly … Secondly … Thirdly …', 'liệt kê 3 lý do') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [o('Firstly'), ',', b('there are so many insects that … investigating this huge variety of species is a daunting task', 'quá nhiều loài')] },
        { n: 2, chips: [o('Secondly'), ',', b('insects are generally very small … difficult to obtain sufficient quantities', 'quá nhỏ')] },
        { n: 3, chips: [o('Thirdly'), ',', b('Many insect species are infrequently encountered and very difficult to rear in captivity', 'khó tìm, khó nuôi')] },
      ],
    },
    notes: '→ Đoạn F đặt câu hỏi vì sao côn trùng ít được nghiên cứu rồi liệt kê 3 lý do: [[1]] quá nhiều loài, [[2]] quá nhỏ nên khó lấy đủ hợp chất, [[3]] nhiều loài hiếm và khó nuôi\n→ Đoạn H {no} chỉ nhắc lại "the problems" rồi nói cách giải quyết\n⇒ Đáp án là **F** {ok}',
  },

  q5: {
    paraphrase: {
      question: [s('reference to how '), s('interest in drug research', 'orange'), s(' may '), s('benefit wildlife', 'green')],
      pairs: [
        { left: g('benefit wildlife', 'có lợi cho thế giới hoang dã'), right: g('my main motivation … is conservation … make people think differently about the value of nature', 'mục đích chính là bảo tồn') },
        { left: o('interest in drug research'), right: o('exploring the useful chemistry of the most diverse animals on the planet') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('my main motivation for looking at insects in this way'), g('is conservation', 'bảo tồn = benefit wildlife')] },
        { n: 2, chips: [b('If we can'), o('explore the useful chemistry of the most diverse animals', '= interest in drug research'), ',', g('we can make people think differently about the value of nature', 'người ta sẽ quý trọng thiên nhiên hơn')] },
      ],
    },
    notes: '→ [[1]] tác giả nói động lực chính là **bảo tồn** (conservation)\n→ [[2]] nếu khám phá được hoá chất hữu ích từ côn trùng, người ta sẽ nhìn nhận khác về giá trị của thiên nhiên → có lợi cho thế giới hoang dã\n⇒ Đáp án là **I** {ok}',
  },

  q6: {
    paraphrase: {
      question: [s('a reason', 'orange'), s(' why '), s('nature-based medicines fell out of favour', 'green'), s(' '), s('for a period', 'blue')],
      pairs: [
        { left: b('for a period'), right: b('for a while') },
        { left: g('nature-based medicines fell out of favour', 'thuốc từ tự nhiên bị lãng quên'), right: g('moved its focus away from nature and into the laboratory', 'chuyển trọng tâm khỏi tự nhiên, vào phòng thí nghiệm') },
        { left: o('a reason'), right: o('The main cause of this shift is that … finding them is far from easy', 'nguyên nhân chính: rất khó tìm') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('Then, for a while', '= for a period'), ',', b('modern pharmaceutical science'), g('moved its focus away from nature and into the laboratory', '= fell out of favour')] },
        { n: 2, chips: [o('The main cause of this shift', '= a reason'), b('is that although there are plenty of promising chemical compounds in nature'), ',', o('finding them is far from easy', 'lý do')] },
      ],
    },
    notes: '→ [[1]] "for a while" khoa học dược rời bỏ tự nhiên để thiết kế hợp chất trong phòng thí nghiệm\n→ [[2]] "The main cause of this shift" — vì hợp chất trong tự nhiên rất khó tìm\n⇒ Đáp án là **B** {ok}',
  },

  q7: {
    paraphrase: {
      question: [s('an example of '), s('an insect-derived medicine', 'orange'), s(' '), s('in use at the moment', 'green')],
      pairs: [
        { left: o('an insect-derived medicine', 'thuốc từ côn trùng'), right: o('alloferon, an antimicrobial compound produced by blow fly larvae', 'alloferon, do ấu trùng ruồi tạo ra') },
        { left: g('in use at the moment', 'đang được sử dụng'), right: g('is used as an antiviral and antitumor agent in South Korea and Russia', 'đang được dùng ở Hàn Quốc và Nga') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('For example'), ',', o('alloferon, an antimicrobial compound produced by blow fly larvae', '= insect-derived medicine'), g('is used', 'thì hiện tại = in use at the moment'), b('as an antiviral and antitumor agent in South Korea and Russia')] }],
    },
    notes: '→ "alloferon … produced by blow fly larvae, **is used** as an antiviral and antitumor agent in South Korea and Russia" → thuốc từ côn trùng đang được dùng\n→ Bẫy: hợp chất từ nọc ong Polybia paulista chỉ "has potential" (còn tiềm năng), chưa được sử dụng\n⇒ Đáp án là **E** {ok}',
  },

  q10: {
    paraphrase: {
      question: [s('Ross Piper and fellow zoologists', 'blue'), s(' are '), s('using their expertise in', 'orange'), s(' ___ when undertaking bioprospecting with insects.')],
      pairs: [
        { left: b('Ross Piper and fellow zoologists'), right: b('My colleagues and I at Aberystwyth University') },
        { left: o('using their expertise in ___', 'dùng chuyên môn về ___'), right: o('we use our knowledge of ecology as a guide', 'dùng kiến thức sinh thái học') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('My colleagues and I at Aberystwyth University'), b('have developed an approach in which'), o('we use our knowledge of', '= using their expertise in'), g('ecology', 'đáp án'), b('as a guide to target our efforts')] }],
    },
    notes: '→ "we use our knowledge of **ecology** as a guide" → knowledge = expertise\n⇒ Đáp án: **ecology** {ok}',
  },

  q11: {
    paraphrase: {
      question: [s('the compounds that insects produce to '), s('overpower and preserve', 'orange'), s(' their ___.')],
      pairs: [{ left: o('overpower and preserve', 'khuất phục và bảo quản'), right: o('subduing … and keeping it fresh for future consumption', 'khống chế và giữ tươi để ăn sau') }],
    },
    breakdown: {
      sentences: [{ chips: [b('the many insects that'), b('secrete powerful poison', '= compounds'), o('for subduing', '= overpower'), g('prey', 'đáp án — con mồi'), b('and'), o('keeping it fresh for future consumption', '= preserve')] }],
    },
    notes: '→ "secrete powerful poison for subduing **prey** and keeping it fresh" → subduing = overpower; keeping it fresh = preserve\n⇒ Đáp án: **prey** {ok}',
  },

  q12: {
    paraphrase: {
      question: [s('compounds which insects use to '), s('protect themselves from pathogenic bacteria and fungi', 'orange'), s(' found in their ___')],
      pairs: [{ left: o('protect themselves from pathogenic bacteria and fungi', 'tự bảo vệ khỏi vi khuẩn, nấm gây bệnh'), right: o('have many antimicrobial compounds for dealing with pathogenic bacteria and fungi') }],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('insects that are masters of exploiting filthy'), g('habitats', 'đáp án'), b(', such as faeces and carcasses'), ',', b('where they are regularly challenged by thousands of microorganisms', 'vi sinh vật ở trong môi trường sống')] },
        { n: 2, chips: [b('These insects have many antimicrobial compounds'), o('for dealing with pathogenic bacteria and fungi', '= protect themselves from')] },
      ],
    },
    notes: '→ [[1]] côn trùng sống ở "filthy **habitats**" (phân, xác động vật), nơi có hàng nghìn vi sinh vật\n→ [[2]] chúng có hợp chất kháng khuẩn để chống lại vi khuẩn và nấm đó → vi khuẩn, nấm "found in their habitats"\n⇒ Đáp án: **habitats** {ok}',
  },

  q13: {
    paraphrase: {
      question: [s('Piper hopes that these substances will be useful in '), s('the development of drugs', 'green'), s(' such as ___.')],
      pairs: [{ left: g('useful in the development of drugs such as ___'), right: g('many compounds that can serve as or inspire new antibiotics', 'hợp chất có thể làm hoặc gợi ý cho kháng sinh mới') }],
    },
    breakdown: {
      sentences: [{ chips: [b('suggesting that there is certainly potential to find many compounds'), g('that can serve as or inspire new', '= useful in the development of'), o('antibiotics', 'đáp án')] }],
    },
    notes: '→ "compounds that can serve as or inspire new **antibiotics**" → serve as or inspire = useful in the development of\n⇒ Đáp án: **antibiotics** {ok}',
  },
}
