import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'

// Giải thích từng câu của "Measures to combat infectious disease in tsarist Russia" (id khớp với reading.ts) — do
// tôi tự soạn từ bài đọc; ĐÁP ÁN câu 1-8, 11-13 đã đối chiếu khớp answer key chính thức. Câu 1-6 (List of headings) theo khuôn "Simplify &
// Connection"; câu 7-8 (Choose TWO) dùng chung 1 giải thích; câu điền từ theo khuôn Paraphrasing + phân tích câu.
const chip =
  (color: ChipColor) =>
  (text: string, label?: string): ExChip => ({ text, color, label })
const o = chip('orange')
const g = chip('green')
const b = chip('blue')
const s = (text: string, color?: ChipColor) => ({ text, color })

const PICK_TWO: Explanation = {
  paraphrase: {
    question: [s('Which TWO '), s('measures', 'orange'), s(' did Russia take '), s('in the seventeenth century', 'blue'), s(' to '), s('avoid plague outbreaks', 'green'), s('?')],
    pairs: [
      { left: b('in the seventeenth century'), right: b('In the second half of the seventeenth century') },
      { left: g('avoid plague outbreaks', 'tránh dịch hạch bùng phát'), right: g('to prevent the importation of plague', 'ngăn dịch hạch lọt vào') },
      { left: o('Spying', 'do thám'), right: o('undercover agents', 'đặc vụ ngầm') },
      { left: o('Restrictions on access to its ports', 'hạn chế ra vào cảng'), right: o('foreign vessels were not allowed to dock in Russian ports', 'tàu nước ngoài không được cập cảng Nga') },
    ],
  },
  breakdown: {
    sentences: [
      { n: 1, prefix: 'Đoạn A:', chips: [b('Information on disease outbreak occurring abroad', 'S'), b('was regularly reported to the tsar’s court', 'V'), b('through various means, including'), o('undercover agents', '= spying')] },
      { n: 2, prefix: 'Đoạn B:', chips: [o('foreign vessels were not allowed to dock in Russian ports', '= restrictions on access to its ports'), b('if there was credible information about the existence of epidemics')] },
    ],
  },
  notes:
    '→ [[1]] Thế kỷ 17, Nga thu thập tin dịch bệnh ở nước ngoài qua nhiều kênh, trong đó có "**undercover agents**" → **B. Spying** {ok}\n→ [[2]] Tàu nước ngoài "**not allowed to dock in Russian ports**" nếu nước đó có dịch → **D. Restrictions on access to its ports** {ok}\n→ A. Cooperation with foreign leaders {no} Sa hoàng viết thư cho vua Charles II để THÔNG BÁO cắt quan hệ thương mại, không phải hợp tác\n→ C. Military campaigns {no} các chiến dịch quân sự (đoạn C) ở thế kỷ 18 và còn LÀM LAN dịch, không phải biện pháp phòng dịch\n→ E. Expulsion of foreigners {no} người nước ngoài phải cách ly (quarantine) và bị hỏi thông tin, không bị trục xuất\n⇒ Đáp án: **B** và **D** (thứ tự nào cũng được)',
}

export const EXPLAIN: Record<string, Explanation> = {
  q1: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('In the second half of the 17th century', 'Time'), ',', b('Russian authorities'), b('began implementing controls at the borders', 'kiểm soát biên giới'), b('to prevent the importation of plague')] },
        { n: 2, chips: [o('Information on disease outbreak occurring abroad', 'thông tin dịch bệnh ở NƯỚC NGOÀI = external cases'), o('was regularly reported', 'được báo cáo THƯỜNG XUYÊN = systematic'), b('through various means, including …', 'liệt kê: thương nhân, quân nhân, đặc vụ, đại sứ quán, hải quan')] },
        { n: 3, chips: [b('For instance', 'ví dụ'), ',', b('the heads of customs offices'), b('were instructed to question foreigners', 'hỏi người nước ngoài'), b('about possible epidemics in their countries')] },
      ],
    },
    notes:
      'Câu [[1]] mở đoạn: Nga bắt đầu kiểm soát biên giới để chặn dịch hạch\nCâu [[2]] ý chính: tin dịch bệnh ở nước ngoài được **báo cáo thường xuyên** về triều đình qua nhiều kênh (thương nhân, quân đội, đặc vụ, đại sứ quán, hải quan)\nCâu [[3]] ví dụ: hải quan được lệnh hỏi người nước ngoài về dịch bệnh\n→ regularly reported through various means = systematic intelligence-gathering; outbreak occurring abroad = external cases\n→ Partly successful bans… {no} lệnh cấm là nội dung đoạn B\n⇒ Chọn **ii. Systematic intelligence-gathering about external cases of plague** {ok}',
  },

  q2: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('If news of an outbreak came from abroad'), ',', o('relations with the affected country were suspended', 'cắt quan hệ = bans against foreign states')] },
        { n: 2, chips: [b('For instance', 'ví dụ'), ',', b('foreign vessels were not allowed to dock'), b('+ foreigners had to undergo quarantine'), b('+ 1665: Tsar Alexei ceased trade with England', 'ví dụ cụ thể')] },
        { n: 3, chips: [b('These protective measures'), g('appeared to have been effective', 'có hiệu quả'), b('no cases of plague … in the next three decades')] },
        { n: 4, chips: [b('It was not until 1692', 'nhưng'), g('that another plague outbreak was recorded', 'dịch vẫn quay lại → chỉ thành công 1 phần'), b('killed 10,383 people')] },
      ],
    },
    notes:
      'Câu [[1]] câu chủ đề: nếu nước ngoài có dịch → **cắt quan hệ** với nước đó (= bans against foreign states affected by plague)\nCâu [[2]] ví dụ: cấm tàu cập cảng, cách ly, cắt thương mại với Anh\nCâu [[3]] các biện pháp **có hiệu quả** — 30 năm không có ca dịch nào\nCâu [[4]] nhưng năm 1692 dịch **vẫn bùng phát** ở Astrakhan\n→ Hiệu quả 30 năm rồi vẫn có dịch → **partly successful**\n→ Hostile reactions from foreign states… {no} bài không nói nước ngoài phản ứng thế nào\n⇒ Chọn **v. Partly successful bans against foreign states affected by plague** {ok}',
  },

  q3: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('During the eighteenth century'), ',', b('plague appeared in Russia several times', 'dịch xuất hiện nhiều lần')] },
        { n: 2, chips: [b('After defeating the Swedes in the battle of Poltava', 'chiến tranh'), ',', b('Peter I dispatched part of his army to Poland', 'đưa quân sang Ba Lan'), '→', o('the disease spread among the Russian troops', 'dịch lây trong quân đội')] },
        { n: 3, chips: [b('the Russians besieged Riga', 'vây thành'), '→', o('the Russian army lost 9,800 soldiers to the plague', 'mất quân vì dịch')] },
        { n: 4, chips: [o('more soldiers died of the disease', 'chết vì dịch'), b('than from enemy fire during the siege', 'nhiều hơn chết vì trận đánh')] },
      ],
    },
    notes:
      'Câu [[1]] thế kỷ 18 dịch xuất hiện nhiều lần\nCâu [[2]] + [[3]] các lần bùng phát đều gắn với **chiến dịch quân sự**: đưa quân sang Ba Lan → dịch lây trong quân; vây thành Riga → mất 9,800 lính vì dịch\nCâu [[4]] số lính chết vì dịch còn nhiều hơn chết vì đánh nhau\n→ dispatched army / besieged Riga = military campaigns; disease spread among the troops = outbreaks as a result\n→ Various measures to limit outbreaks associated with war {no} đoạn C chỉ kể dịch lây lan, các BIỆN PHÁP ở đoạn D\n⇒ Chọn **i. Outbreaks of plague as a result of military campaigns** {ok}',
  },

  q4: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('Tsar Peter I'), o('imposed strict measures', 'áp đặt biện pháp nghiêm ngặt'), b('to prevent the spread of plague'), g('during these conflicts', '= associated with war')] },
        { n: 2, chips: [b('Soldiers suspected of being infected were isolated', 'biện pháp 1'), ';', b('camps were designed to separate divisions', 'biện pháp 2')] },
        { n: 3, chips: [b('the army'), b('cordon off the entire boundary along the Luga River', 'biện pháp 3 - phong toả')] },
        { n: 4, chips: [b('roadblocks and checkpoints were set up on all roads', 'biện pháp 4'), ';', b('those who disobeyed were hung', 'thực thi nghiêm')] },
      ],
    },
    notes:
      'Câu [[1]] câu chủ đề: Peter I áp đặt **biện pháp nghiêm ngặt** chống dịch **trong các cuộc chiến**\nCâu [[2]] + [[3]] + [[4]] liệt kê **nhiều** biện pháp: cách ly lính nghi nhiễm, chia tách doanh trại, phong toả sông Luga, lập chốt chặn trên mọi con đường\n→ strict measures (nhiều loại) = various measures; during these conflicts = associated with war\n→ Outbreaks of plague as a result of military campaigns {no} đó là đoạn C (dịch lây); đoạn D nói về BIỆN PHÁP ngăn dịch\n⇒ Chọn **vii. Various measures to limit outbreaks of plague associated with war** {ok}',
  },

  q5: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('However', 'đối lập với đoạn D'), ',', b('although the authorities applied such methods'), ',', o('all of the measures had a provisional character', 'mọi biện pháp đều chỉ TẠM THỜI = general limitations')] },
        { n: 2, chips: [b('they were intended to respond to a specific outbreak', 'chỉ đối phó 1 đợt dịch cụ thể'), ',', b('and were not designed as a coherent set of measures', 'không phải hệ thống bài bản')] },
        { n: 3, chips: [b('The advent of such a standard response system'), b('came a few years later', 'dẫn sang đoạn F')] },
      ],
    },
    notes:
      'Câu [[1]] "However" → chỉ ra **hạn chế**: **tất cả** các biện pháp (all of the measures = general) đều mang tính tạm thời\nCâu [[2]] giải thích: chỉ để đối phó 1 đợt dịch cụ thể, không phải 1 hệ thống bài bản\nCâu [[3]] câu nối sang đoạn F (hệ thống chuẩn ra đời sau đó)\n→ all of the measures had a provisional character = the general limitations of early anti-plague measures\n⇒ Chọn **iv. The general limitations of early Russian anti-plague measures** {ok}',
  },

  q6: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [o('The first attempts to organise procedures and carry out proactive steps', 'lần đầu xây dựng quy trình chủ động = formulation of preventive strategies'), b('date to the aftermath of the 1727-1728 epidemic in Astrakhan')] },
        { n: 2, chips: [b('the Russian imperial authorities'), o('issued several decrees', 'ban hành sắc lệnh = publication'), b('aimed at controlling the future spread of plague', 'phòng ngừa')] },
        { n: 3, chips: [b('the decree required …', 'nội dung: báo Senate, khám, cách ly, lập chốt, đốt nhà, báo tỉnh lân cận, hơ thư trên lửa')] },
      ],
    },
    notes:
      'Câu [[1]] lần **đầu tiên** xây dựng quy trình và các bước **chủ động** (proactive) chống dịch\nCâu [[2]] chính quyền **ban hành** (issued) nhiều sắc lệnh nhằm kiểm soát dịch trong **tương lai**\nCâu [[3]] phần còn lại của đoạn liệt kê chi tiết nội dung sắc lệnh\n→ organise procedures / proactive steps = formulation of preventive strategies; issued decrees = publication\n⇒ Chọn **viii. The formulation and publication of preventive strategies** {ok}',
  },

  q7: PICK_TWO,
  q8: PICK_TWO,

  // Câu 9-10 (Choose TWO, đầu thế kỷ 18) — theo mẫu giải thích bạn cung cấp: q9 giải thích lựa chọn A, q10 lựa chọn E.
  q9: {
    paraphrase: {
      question: [s('Which TWO statements are made about Russia in the early '), s('eighteenth century', 'orange'), s('?')],
      answer: [s('A - '), s('Plague outbreaks were consistently smaller than before', 'blue'), s('.')],
      pairs: [
        { left: o('eighteenth century', 'thế kỷ 18'), right: o('eighteenth century') },
        { left: b('Plague outbreaks were consistently smaller than before', 'các đợt dịch hạch có quy mô nhỏ hơn trước'), right: b('none of the occurrences was of the same scale as in the past', 'không có đợt dịch hạch nào có quy mô lớn như trước') },
      ],
    },
    detail: [
      '😎 Tới **thế kỷ 18**, ta biết cần đọc từ **đoạn C** đổ xuống',
      '⇒ Ở đây bạn nào đã làm **Matching Heading** và nắm được **ý chính** của bài, có thể **đọc qua list đáp án** để xem có nhớ được thông tin nào vừa nãy ta đọc qua rồi không',
      '⇒ Như vậy sẽ tìm thông tin nhanh hơn 😄',
      '😍 **Áp dụng Linear thinking để nắm main idea:**',
      { chips: [b('During the eighteenth century'), ',', b('although'), b('none of the occurrences'), b('was of the same scale as in the past'), ',', b('plague'), b('appeared in Russia several times.')] },
      '**>>> ‘Occurrences’** ở đây là **sự diễn ra** — trong ngữ cảnh bài đọc thì tác giả đang đề cập tới **‘plague outbreaks’**',
      '⇒ Mặc dù **không có** đợt bùng dịch nào **có cùng quy mô** với ngày trước (ngày trước lớn hơn), plague cũng xuất hiện vài lần ở Nga',
      '⇒ Nói cách khác, các đợt bùng dịch ở thế kỷ 18 **nhỏ hơn** so với lúc trước',
      '⇒ **Chọn A - Plague outbreaks were consistently smaller than before** {ok}',
    ],
  },

  q10: {
    paraphrase: {
      question: [s('Which TWO statements are made about Russia in the early '), s('eighteenth century', 'orange'), s('?')],
      answer: [s('E - '), s('Anti-plague measures were generally reactive rather than strategic', 'blue'), s('.')],
      pairs: [
        { left: g('Anti-plague measures', 'các biện pháp chống dịch'), right: g('all of the measures') },
        { left: b('generally reactive', 'nhìn chung mang tính phản ứng / ứng phó'), right: b('had a provisional character: they were intended to respond to a specific outbreak', 'tạm thời, chỉ để ứng phó 1 đợt dịch cụ thể') },
        { left: b('rather than strategic', 'chứ không mang tính chiến lược'), right: b('were not designed as a coherent set of measures to be implemented systematically', 'không được thiết kế thành hệ thống bài bản') },
      ],
    },
    detail: [
      '😍 **Áp dụng Linear thinking để nắm main idea:**',
      { chips: [b('all of the measures'), b('had a provisional character'), ':', b('they', 'measures'), b('were intended to respond to'), b('a specific outbreak'), ',', b('and'), b('were not designed as'), b('a coherent set of measures to be implemented systematically'), b('at the first sign of plague.')] },
      '⇒ Trong trường hợp có ít từ vựng, không hiểu **‘provisional’** + **‘coherent’** hay **‘implemented’**, ta dựa vào các thông tin xung quanh để đoán nghĩa',
      '⇒ Tính chất của các measures là: **chỉ để respond lại một outbreak cụ thể** → nghĩa là các phương pháp chỉ **ứng phó tạm thời** khi có dịch',
      '⇒ Sau đó nói — chữ **không được** thiết kế như — ‘a coherent set of measures…’ → biết đang chỉ ý ngược lại ý trước',
      '⇒ Sau đó ta còn thấy thông tin **‘at the first sign of plague’** → **Không phải** giải pháp ngay khi **vừa phát hiện** plague',
      '⇒ Từ đó có thể rút ra là, các phương pháp **chỉ có tác dụng ứng phó, phản ứng lại** khi dịch bùng ra → ứng với **‘reactive’**',
      '⇒ **Answer: E - Anti-plague measures were generally reactive rather than strategic** {ok}',
      'Ngoài ra để chắc hơn ta còn có thể **loại các đáp án sai** {no}',
      '**Ví dụ:** Bài đọc cho biết *‘more soldiers died of the disease than (died) from enemy fire during the siege of that city.’*',
      '⇒ Nhiều người chết vì bệnh dịch **hơn là** chết vì súng đạn → **Loại B** (Military casualties at Riga exceeded the number of plague victims) {no}',
      '• **C** (The design of military camps allowed plague to spread quickly): bài nói *‘camps were designed to separate divisions, detachments, and smaller units of soldiers’* → doanh trại được thiết kế để **tách** quân, nhằm **ngăn** dịch lây, ngược với "spread quickly" → **Loại C** {no}',
      '• **D** (The tsar’s plan to protect St Petersburg … was not strictly implemented): bài nói *‘The tsar’s orders were rigorously enforced, and those who disobeyed were hung’* → lệnh được thi hành **rất nghiêm**, ngược với "not strictly implemented" → **Loại D** {no}',
    ],
  },

  q11: {
    paraphrase: {
      question: [s('An outbreak of plague in ___ '), s('prompted', 'orange'), s(' '), s('the publication of a coherent preventative strategy', 'green'), s('.')],
      pairs: [
        { left: o('prompted', 'thúc đẩy, dẫn tới'), right: o('date to the aftermath of … In response to this', 'sau đợt dịch … để đối phó') },
        { left: g('the publication of a coherent preventative strategy', 'ban hành chiến lược phòng ngừa bài bản'), right: g('issued several decrees aimed at controlling the future spread of plague') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('The first attempts to organise procedures and carry out proactive steps to control plague', 'S'), b('date to', 'V'), b('the aftermath of the 1727-1728 epidemic in'), o('Astrakhan', 'đáp án')] },
        { n: 2, chips: [g('In response to this', '= prompted'), ',', b('the Russian imperial authorities'), g('issued several decrees', '= publication')] },
      ],
    },
    notes: '→ [[1]] Chiến lược phòng dịch bài bản đầu tiên ra đời sau đợt dịch 1727-1728 ở **Astrakhan**\n→ [[2]] "In response to this … issued several decrees" = prompted the publication\n→ Bẫy: Astrakhan cũng xuất hiện ở đoạn B (dịch 1692), nhưng lần đó chưa có chiến lược bài bản (đoạn E nói mọi biện pháp trước đó đều tạm thời)\n⇒ Đáp án: **Astrakhan** {ok}',
  },

  q12: {
    paraphrase: {
      question: [s('Provincial governors', 'blue'), s(' were ordered to '), s('burn', 'orange'), s(' the ___ and '), s('possessions', 'green'), s(' of plague victims.')],
      pairs: [
        { left: b('Provincial governors'), right: b('The governors (Instructions for Governors)') },
        { left: o('burn'), right: o('were to be burned') },
        { left: g('possessions', 'đồ đạc'), right: g('all of the personal property they contained', 'mọi tài sản cá nhân bên trong') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('The'), o('houses', 'đáp án'), b('of infected persons', '= of plague victims'), o('were to be burned', 'V = burn'), g('along with all of the personal property they contained', '= and possessions'), b(', including farm animals and cattle')] }],
    },
    notes: '→ "The **houses** of infected persons were to be burned along with all of the personal property" = burn the houses and possessions of plague victims\n→ Chỗ trống đứng trước "and possessions" → cần 1 danh từ song song với possessions\n⇒ Đáp án: **houses** {ok}',
  },

  q13: {
    paraphrase: {
      question: [s('Correspondence', 'orange'), s(' was '), s('held over a ___', 'green'), s(' '), s('prior to copying it', 'blue'), s('.')],
      pairs: [
        { left: o('Correspondence', 'thư từ'), right: o('letters brought by couriers', 'thư do người đưa thư mang tới') },
        { left: g('held over a ___', 'hơ trên ___'), right: g('were heated above a fire', 'được hơ nóng trên lửa') },
        { left: b('prior to copying it'), right: b('before being copied') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Finally'), ',', o('letters brought by couriers', 'S = correspondence'), g('were heated above a', 'V = held over a'), g('fire', 'đáp án'), b('before being copied', '= prior to copying it')] }],
    },
    notes: '→ letters brought by couriers = correspondence; heated above a fire = held over a fire; before being copied = prior to copying it\n⇒ Đáp án: **fire** {ok}',
  },
}
