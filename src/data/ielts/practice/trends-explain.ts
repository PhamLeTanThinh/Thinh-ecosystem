import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'

// Giải thích từng câu của "Making The Most Of Trends" (id q1…q14 khớp với reading.ts) — viết theo đúng
// khuôn đã dùng cho "Bringing Cinnamon To Europe" (xem cinnamon-explain.ts). Do tôi tự soạn từ bài đọc,
// CHƯA đối chiếu đáp án gốc cho câu 2-5, 6-14 — chỉ câu 1 đã khớp ảnh đáp án bạn cung cấp.
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
      question: [s('most managers', 'orange'), s(' '), s('are unaware of', 'green'), s(' the '), s('significant impact', 'blue'), s(' trends have on '), s('consumers’ lives.', 'blue')],
      pairs: [
        { left: o('managers', 'Exact word'), right: o('managers') },
        { left: g('are unaware of', 'không nhận ra'), right: g('fail to recognize', 'không nhận ra') },
        {
          left: b('the significant impact trends have on consumers’ lives', 'tác động đáng kể của trends đối với cuộc sống của người tiêu dùng'),
          right: b('the less obvious but profound ways these trends are influencing consumers’ aspirations, attitudes, and behaviors', 'những cách ít rõ ràng hơn nhưng sâu sắc mà trends đang ảnh hưởng đến nguyện vọng, thái độ và hành vi của người tiêu dùng'),
        },
      ],
    },
    breakdown: {
      sentences: [
        {
          chips: [
            b('managers', 'S'),
            b('often fail to recognize', 'V1 = are unaware of'),
            g('the less obvious but profound ways', 'profound = significant'),
            b('these trends', 'S2'),
            b('are influencing', 'V2'),
            g('consumers’ aspirations, attitudes, and behaviors', '= consumers’ lives'),
          ],
        },
      ],
    },
    notes:
      'Áp dụng DOL’s Linearthinking 🤓\n**managers** (S) **often fail to recognize** (V1 = are unaware of) **the less obvious but profound ways** (profound = significant) **these trends** (S2) **are influencing** (V2) **consumers’ aspirations, attitudes, and behaviors.** (= consumers’ lives)\n→ Main idea: manager ko nhận ra những ảnh hưởng của trend lên consumers\' lives\nTóm lại, câu trên trùng ý với option D: are unaware of the significant impact that trends have on consumers\' lives.\n⇒ Chọn D {ok}',
  },

  q2: {
    paraphrase: {
      question: [s('Coach', 'orange'), s(' was anxious to '), s('safeguard its reputation', 'green'), s(' as a manufacturer of '), s('luxury goods.', 'blue')],
      pairs: [
        { left: o('Coach', 'Exact word'), right: o('Coach') },
        { left: g('safeguard its **reputation**', 'bảo vệ danh tiếng'), right: g('risked **cheapening** the brand’s **image**', 'có nguy cơ làm rẻ hoá hình ảnh thương hiệu'), rel: '≠', note: 'tránh làm rẻ hoá hình ảnh ⇒ suy ra mối bận tâm là bảo vệ hình ảnh/danh tiếng' },
        { left: b('a manufacturer of **luxury goods**', 'nhà sản xuất hàng xa xỉ'), right: b('a symbol of **opulence and luxury** for nearly 70 years', 'biểu tượng xa hoa suốt gần 70 năm') },
      ],
    },
    breakdown: {
      sentences: [
        {
          n: 1,
          chips: [b('the most obvious reaction to the downturn', 'S'), b('would have been', 'V'), b('to lower prices', 'hạ giá — phản ứng "hiển nhiên" nhất')],
        },
        { n: 2, chips: [b('However', ''), b('that (=lowering prices)', 'S'), b('would have risked', 'V'), g('cheapening the brand’s image', 'điều Coach lo ngại')] },
      ],
    },
    notes:
      '→ [[1]] Phản ứng "hiển nhiên" nhất trước suy thoái là hạ giá\n→ [[2]] NHƯNG điều đó **risked cheapening the brand\'s image** — tức có nguy cơ làm rẻ hoá hình ảnh thương hiệu xa xỉ đã xây dựng gần 70 năm\n→ Mối bận tâm/nỗi lo chính khiến Coach KHÔNG hạ giá đồng loạt = muốn **bảo vệ danh tiếng hàng xa xỉ**\n{no} A sai — bài nói ngược lại: "In contrast to the many companies that responded to the recession by cutting prices". {no} B đúng nhưng chỉ là HỆ QUẢ (tránh giảm giá đồng loạt), chưa nêu đúng TRỌNG TÂM nỗi lo mà câu hỏi hỏi tới.\n⇒ Chọn C {ok}',
  },

  q3: {
    paraphrase: {
      question: [s('Tesco’s Greener Living programme', 'orange'), s(' did '), s('not require', 'green'), s(' Tesco to '), s('modify its core business activities.', 'blue')],
      pairs: [
        { left: o('Tesco', 'Exact word'), right: o('Tesco') },
        { left: g('did **not require**...to', 'không cần phải'), right: g('has **not abandoned**', 'không hề từ bỏ') },
        { left: b('modify its **core business activities**', 'thay đổi hoạt động kinh doanh cốt lõi'), right: b('its **traditional retail offerings**', 'các dịch vụ bán lẻ truyền thống của nó') },
      ],
    },
    breakdown: {
      sentences: [
        {
          chips: [
            b('Tesco', 'S'),
            b('has not abandoned', 'V1 = did not require to modify'),
            g('its traditional retail offerings', '= core business activities'),
            b('but'),
            b('augmented', 'V2'),
            b('its business with these innovations', 'chỉ BỔ SUNG thêm, không thay cốt lõi'),
          ],
        },
      ],
    },
    notes:
      '→ Tesco **has not abandoned** (không từ bỏ) hoạt động bán lẻ truyền thống, chỉ **augmented** (bổ sung thêm) chương trình Greener Living\n→ "không từ bỏ hoạt động cốt lõi" = "không cần phải thay đổi hoạt động kinh doanh cốt lõi" ⇒ khớp A\n{no} B, C, D không được nhắc tới trong đoạn D.\n⇒ Chọn A {ok}',
  },

  q4: {
    paraphrase: {
      question: [s('Nike’s strategy', 'orange'), s(' might '), s('appear to have', 'green'), s(' few '), s('obvious benefits.', 'blue')],
      pairs: [
        { left: o('Nike’s strategy', 'exact ý'), right: o('Nike’s move') },
        { left: g('might **appear** to have', 'có vẻ như'), right: g('**sounds like**', 'nghe có vẻ như') },
        { left: b('few **obvious benefits**', 'ít lợi ích rõ ràng'), right: b('**hardly worthwhile**', 'chẳng đáng làm chút nào') },
      ],
    },
    breakdown: {
      sentences: [
        {
          n: 1,
          chips: [
            b('spending resources to incorporate elements of a seemingly irrelevant trend into one’s core offerings', 'S'),
            b('sounds like', 'V'),
            g('it’s hardly worthwhile', '= might appear to have few obvious benefits'),
          ],
        },
        { n: 2, chips: [b('But'), b('consider', ''), b('Nike’s move to integrate the digital revolution...', 'dẫn chứng phản bác ý trên')] },
      ],
    },
    notes:
      '→ [[1]] Mở đầu đoạn F: bỏ nguồn lực vào 1 trend "seemingly irrelevant" (có vẻ chẳng liên quan) **sounds like it\'s hardly worthwhile** — nghe có vẻ chẳng đáng/ít lợi ích rõ ràng\n→ [[2]] Rồi bài mới dùng Nike làm dẫn chứng để PHẢN BÁC lại ấn tượng ban đầu đó\n→ Ý của writer: chiến lược kiểu Nike thoạt nhìn có vẻ ít lợi ích rõ ràng (nhưng thực ra hiệu quả)\n{no} A, B, C đều không được nhắc tới trong đoạn.\n⇒ Chọn D {ok}',
  },

  q5: {
    paraphrase: {
      question: [s('The ME2', 'orange'), s(' was a handheld game that addressed '), s('concerns about', 'green'), s(' '), s('unhealthy lifestyles.', 'blue')],
      pairs: [
        { left: o('The ME2', 'Exact word'), right: o('The ME2') },
        { left: g('addressed **concerns** about', 'giải quyết mối lo ngại về'), right: g('**countering** the negatives', 'đối phó với những mặt tiêu cực') },
        { left: b('**unhealthy lifestyles**', 'lối sống không lành mạnh'), right: b('associations with **lack of exercise and obesity**', 'liên quan tới thiếu vận động và béo phì') },
      ],
    },
    breakdown: {
      sentences: [
        {
          chips: [
            b('The ME2', 'S'),
            b('catered to', 'V1'),
            b('kids’ huge desire to play video games', ''),
            b('while'),
            b('countering', 'V2 = addressed concerns'),
            g('the negatives, such as associations with lack of exercise and obesity', '= concerns about unhealthy lifestyles'),
          ],
        },
      ],
    },
    notes:
      '→ ME2 vừa đáp ứng mong muốn chơi game của trẻ, vừa **countering the negatives** (đối phó mặt tiêu cực) như **lack of exercise and obesity** (thiếu vận động, béo phì) — tức lối sống ko lành mạnh\n{no} C sai vì đó là điểm GIỐNG các game cầm tay khác ("Like other handheld games..."), không phải điểm khác biệt — điều làm ME2 khác biệt là máy đếm bước (pedometer). {no} A, B không được nhắc trực tiếp.\n⇒ Chọn D {ok}',
  },

  q6: {
    paraphrase: {
      question: [s('turned the notion', 'orange'), s(' its products could have '), s('harmful effects', 'green'), s(' to its own '), s('advantage.', 'blue')],
      pairs: [
        { left: o('products could have **harmful effects**', 'sản phẩm có thể gây hại'), right: o('widely perceived **negative impacts** of digital gaming devices', 'những tác động tiêu cực phổ biến của thiết bị chơi game số') },
        {
          left: g('to its own **advantage**', 'biến thành lợi thế của mình'),
          right: g('**counteracted**...by **reaffirming** the toy category’s association with physical play', 'đối phó bằng cách khẳng định lại sự gắn kết với vận động thể chất'),
        },
      ],
    },
    breakdown: {
      sentences: [
        {
          chips: [
            b('the ME2', 'S'),
            b('counteracted', 'V'),
            g('some of the widely perceived negative impacts of digital gaming devices', '= harmful effects'),
            b('by reaffirming the toy category’s association with physical play', 'cách nó biến điều tiếng xấu thành lợi thế'),
          ],
        },
      ],
    },
    notes: '→ ME2 (của iToys) biến chính mối lo "digital gaming có hại" thành lợi thế — gắn máy đếm bước để thưởng điểm cho hoạt động thể chất, biến "điều tiếng xấu" thành tính năng bán hàng.\n⇒ Chọn D (iToys) {ok}',
  },

  q7: {
    paraphrase: {
      question: [s('extended its offering', 'orange'), s(' by '), s('collaborating', 'green'), s(' with another '), s('manufacturer.', 'blue')],
      pairs: [
        { left: o('extended its **offering**', 'mở rộng sản phẩm/dịch vụ'), right: o('a digital sports kit', 'bộ dụng cụ thể thao số — sản phẩm mới mở rộng thêm') },
        { left: g('**collaborating** with another manufacturer', 'hợp tác với 1 nhà sản xuất khác'), right: g('**teamed up with** technology company **Apple**', 'hợp tác với công ty công nghệ Apple') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('they (=Nike)', 'S'), g('teamed up with technology company Apple', 'V = collaborating with another manufacturer'), b('to launch Nike+', 'kết quả hợp tác')] }],
    },
    notes: '→ Nike hợp tác với Apple (một nhà sản xuất công nghệ khác) để cho ra đời Nike+ — mở rộng sản phẩm sang mảng thiết bị số.\n⇒ Chọn C (Nike) {ok}',
  },

  q8: {
    paraphrase: {
      question: [s('implemented an incentive scheme', 'orange'), s(' to demonstrate its '), s('corporate social responsibility.', 'green')],
      pairs: [
        { left: o('an **incentive scheme**', 'chương trình khuyến khích'), right: o('accumulate **points**...can be **redeemed for cash**', 'tích điểm, đổi được thành tiền') },
        { left: g('**corporate social responsibility**', 'trách nhiệm xã hội của doanh nghiệp'), right: g('commitment to **protecting the environment**', 'cam kết bảo vệ môi trường') },
      ],
    },
    breakdown: {
      sentences: [
        {
          chips: [
            b('Tesco customers', 'S'),
            g('can accumulate points', 'V = incentive scheme'),
            b('for such activities as reusing bags, recycling cans and printer cartridges, and buying home-insulation materials'),
          ],
        },
      ],
    },
    notes: '→ Chương trình tích điểm xanh (đổi được thành tiền) của Tesco là 1 hình thức khuyến khích (incentive scheme), thể hiện cam kết bảo vệ môi trường của công ty.\n⇒ Chọn B (Tesco) {ok}',
  },

  q9: {
    paraphrase: {
      question: [s('discovered', 'orange'), s(' customers had a '), s('positive attitude', 'green'), s(' towards dealing with '), s('difficult circumstances.', 'blue')],
      pairs: [
        { left: o('**discovered**', 'phát hiện ra'), right: o('a consumer-research project which **revealed**', 'dự án nghiên cứu thị trường tiết lộ') },
        { left: g('a **positive attitude**', 'thái độ tích cực'), right: g('customers were **eager**', 'khách hàng háo hức/mong muốn') },
        { left: b('dealing with **difficult circumstances**', 'đối mặt với hoàn cảnh khó khăn'), right: b('lift themselves and the country out of **tough times**', 'tự vực dậy bản thân và đất nước khỏi thời kỳ khó khăn') },
      ],
    },
    breakdown: {
      sentences: [
        { chips: [b('they (=Coach)', 'S'), b('initiated a consumer-research project', 'V1'), g('which revealed that customers were eager to lift themselves and the country out of tough times', '= positive attitude towards difficult circumstances')] },
      ],
    },
    notes: '→ Nghiên cứu thị trường của Coach cho thấy khách hàng "eager to lift themselves and the country out of tough times" — thái độ tích cực, muốn vượt qua giai đoạn khó khăn.\n⇒ Chọn A (Coach) {ok}',
  },

  q10: {
    paraphrase: {
      question: [s('responded to', 'orange'), s(' a growing '), s('lifestyle trend', 'green'), s(' in an '), s('unrelated product sector.', 'blue')],
      pairs: [
        { left: o('**responded to**', 'phản ứng lại'), right: o('integrate...into', 'tích hợp vào') },
        { left: g('a growing trend', 'xu hướng đang lên'), right: g('the **digital revolution**', 'cuộc cách mạng số') },
        { left: b('an **unrelated product sector**', 'lĩnh vực sản phẩm không liên quan'), right: b('high-performance athletic **footwear**', 'giày thể thao hiệu năng cao — mảng vốn không liên quan tới công nghệ số') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('consider', ''), b('Nike’s move', 'S'), b('to integrate', 'V'), g('the digital revolution', '= growing trend, unrelated'), b('into its reputation for high-performance athletic footwear', '= unrelated product sector')] }],
    },
    notes: '→ Nike (ngành giày thể thao) tích hợp xu hướng số hoá — một xu hướng vốn "seemingly irrelevant"/thuộc lĩnh vực khác — vào sản phẩm cốt lõi của mình, đúng chiến lược "combine and transcend".\n⇒ Chọn C (Nike) {ok}',
  },

  q11: {
    paraphrase: {
      question: [s('successfully avoided', 'orange'), s(' having to '), s('charge its customers less', 'green'), s(' for its '), s('core products.', 'blue')],
      pairs: [
        { left: o('**successfully avoided**', 'tránh được thành công'), right: o('allowed Coach to **avert**', 'giúp Coach tránh được') },
        { left: g('**charge...less**', 'tính giá thấp hơn'), right: g('an **across-the-board price cut**', 'giảm giá đồng loạt') },
        { left: b('core products', 'sản phẩm cốt lõi'), right: b('conventional Coach products', 'dòng sản phẩm Coach truyền thống') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Creating the sub-brand (=Poppy)', 'S'), g('allowed Coach to avert', 'V = successfully avoided'), b('an across-the-board price cut', '= charge less for core products')] }],
    },
    notes: '→ Nhờ tạo sub-brand Poppy giá thấp hơn, Coach tránh được việc phải giảm giá đồng loạt (across-the-board) cho toàn bộ dòng sản phẩm chính.\n⇒ Chọn A (Coach) {ok}',
  },

  q12: {
    paraphrase: {
      question: [s('trend-related changes', 'orange'), s(' impacting on your category'), s(', you should '), s('identify the most appropriate innovation strategy to use.', 'green')],
      pairs: [
        { left: o('trend-related changes...impacting on your category', 'Exact ý'), right: o('trend-related changes...impact on your category') },
        {
          left: g('identify the most appropriate **innovation strategy**', 'xác định chiến lược đổi mới phù hợp nhất'),
          right: g('**determine** which of our three innovation strategies to pursue', 'xác định nên theo đuổi chiến lược nào trong 3 chiến lược'),
        },
      ],
    },
    breakdown: {
      sentences: [
        {
          chips: [
            b('Once you have gained perspective on how trend-related changes...impact on your category', ''),
            b('you', 'S'),
            g('can determine which of our three innovation strategies to pursue', 'V = identify the most appropriate strategy'),
          ],
        },
      ],
    },
    notes: '→ Câu mở đầu đoạn I: bước ĐẦU TIÊN khi có thay đổi từ trend là xác định (determine) nên dùng chiến lược nào trong 3 chiến lược — chưa nói tới 1 chiến lược cụ thể nào.\n⇒ Chọn (ii) "identify the most appropriate innovation strategy to use." {ok}',
  },

  q13: {
    paraphrase: {
      question: [s('a current trend highlights', 'orange'), s(' a '), s('negative aspect', 'green'), s(' of your category, you should '), s('emphasise your brand’s traditional values with the counteract-and-reaffirm strategy.', 'blue')],
      pairs: [
        { left: o('a **negative aspect** of your category', 'khía cạnh tiêu cực của category'), right: o('undesired outcomes of a trend, such as associations with unhealthy lifestyles', 'kết quả không mong muốn của trend') },
        {
          left: b('emphasise your brand’s **traditional values**', 'nhấn mạnh giá trị truyền thống'),
          right: b('**reaffirming** the core values of your category', 'khẳng định lại giá trị cốt lõi'),
        },
      ],
    },
    breakdown: {
      sentences: [
        {
          chips: [
            b('if aspects of the category clash with undesired outcomes of a trend', '= negative aspect'),
            ',',
            b('there is an opportunity to counteract those changes', 'S+V'),
            g('by reaffirming the core values of your category', '= emphasise traditional values with counteract-and-reaffirm'),
          ],
        },
      ],
    },
    notes: '→ Khi trend làm lộ mặt tiêu cực của category (vd liên quan lối sống không lành mạnh), giải pháp là chiến lược counteract-and-reaffirm: khẳng định lại giá trị truyền thống.\n⇒ Chọn (iii) "emphasise your brand’s traditional values with the counteract-and-reaffirm strategy." {ok}',
  },

  q14: {
    paraphrase: {
      question: [s('consumers’ new focus has', 'orange'), s(' an increasing '), s('lack of connection', 'green'), s(' with your offering you should '), s('use the combine-and-transcend strategy to integrate the two worlds.', 'blue')],
      pairs: [
        { left: o('an increasing **lack of connection**', 'sự thiếu kết nối ngày càng tăng'), right: o('an increasing **disparity**', 'sự chênh lệch/khác biệt ngày càng tăng') },
        { left: g('**integrate** the two worlds', 'hợp nhất 2 thế giới'), right: g('**transcend** the category to integrate the two worlds', 'vượt ra khỏi category để hợp nhất 2 thế giới') },
      ],
    },
    breakdown: {
      sentences: [
        {
          chips: [
            b('if analysis reveals an increasing disparity between your category and consumers’ new focus', '= lack of connection'),
            ',',
            b('your innovations', 'S'),
            b('need to transcend', 'V'),
            g('the category to integrate the two worlds', '= combine-and-transcend strategy'),
          ],
        },
      ],
    },
    notes: '→ Càng lệch xa (disparity/lack of connection) giữa category và mối quan tâm mới của người tiêu dùng thì càng cần chiến lược combine-and-transcend để hợp nhất 2 thế giới.\n⇒ Chọn (iv) "use the combine-and-transcend strategy to integrate the two worlds." {ok}',
  },
}
