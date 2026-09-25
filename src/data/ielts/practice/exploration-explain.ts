import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'

// Giải thích từng câu của "What is exploration?" (id q1…q14 khớp với reading.ts) — do tôi tự soạn từ bài đọc;
// ĐÁP ÁN đã đối chiếu answer key chính thức (câu 14 theo key là "surface"). Theo khuôn Paraphrasing + phân tích câu + diễn giải (có loại phương án sai).
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
      question: [s('The writer refers to '), s('visitors to New York', 'orange'), s(' to illustrate the point that '), s('exploration is an intrinsic element of being human', 'green'), s('.')],
      pairs: [
        { left: o('visitors to New York'), right: o('a visitor negotiate the subways of New York') },
        { left: g('exploration is an intrinsic element of being human', 'khám phá là bản chất vốn có của con người'), right: g('This questing nature of ours … is part of what makes us human', 'bản tính tìm tòi … là 1 phần làm nên con người') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('We are all explorers', 'ai cũng là nhà thám hiểm'), '.', b('Our desire to discover'), g('is part of what makes us human', '= intrinsic element of being human')] },
        { n: 2, chips: [g('This questing nature of ours', 'S - bản tính tìm tòi'), b('helped our species spread around the globe'), b(', just as it'), b('helps'), b('the Penan maintain their existence'), b('and'), o('a visitor negotiate the subways of New York', 'ví dụ đời thường')] },
      ],
    },
    notes:
      '→ [[1]] Câu chủ đề: "We are all explorers" — mong muốn khám phá là "part of what makes us human"\n→ [[2]] Du khách tìm đường trong tàu điện ngầm New York là **ví dụ đời thường** cho thấy bản tính tìm tòi có ở MỌI người\n→ B. most people are enthusiastic about exploring {no} bài nói ai cũng có bản năng này, không nói ai cũng **hào hứng**\n→ C. exploration can lead to surprising results {no} không nhắc kết quả bất ngờ\n→ D. most people find exploration daunting {no} không nói khám phá đáng sợ\n⇒ Đáp án là **A** {ok}',
  },

  q2: {
    paraphrase: {
      question: [s('According to the second paragraph, what is '), s('the writer’s view of explorers', 'orange'), s('?')],
      answer: [s('C - '), s('They act on an urge that is common to everyone', 'green'), s('.')],
      pairs: [
        { left: g('an urge that is common to everyone', 'thôi thúc mà ai cũng có'), right: g('we all have this enquiring instinct', 'tất cả chúng ta đều có bản năng tìm tòi') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('we’ve come to think of explorers as a peculiar breed', 'ta thường nghĩ họ là người đặc biệt'), ';', b('perhaps there is a type of person more suited to seeking out the new')] },
        { n: 2, chips: [b('That, however,', 'đối lập - ý chính'), b('doesn’t take away from the fact that'), g('we all have this enquiring instinct', '= urge common to everyone'), b(', even today')] },
      ],
    },
    notes:
      '→ [[1]] Người ta hay nghĩ nhà thám hiểm là "a peculiar breed" — khác người thường\n→ [[2]] "however" → quan điểm thật của tác giả: điều đó không phủ nhận việc "**we all have this enquiring instinct**"\n→ Nghĩa là nhà thám hiểm chỉ đang làm theo 1 bản năng mà ai cũng có\n→ D. more attracted to certain professions {no} bẫy — bài nhắc artist, marine biologist, astronomer để nói nghề nào cũng đang khám phá, không nói nhà thám hiểm thích nghề nào hơn\n→ A, B {no} bài không nói lợi/hại của phát hiện hay giá trị giảng dạy\n⇒ Đáp án là **C** {ok}',
  },

  q3: {
    paraphrase: {
      question: [s('The writer refers to '), s('a description of Egdon Heath', 'orange'), s(' to suggest that '), s('Hardy’s aim was to investigate people’s emotional states', 'green'), s('.')],
      pairs: [
        { left: o('a description of Egdon Heath'), right: o('used the landscape') },
        { left: g('investigate', 'tìm hiểu, khám phá'), right: g('delving into', 'đào sâu vào') },
        { left: g('people’s emotional states', 'trạng thái cảm xúc'), right: g('the desires and fears of his characters', 'khao khát và nỗi sợ của nhân vật') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('Thomas Hardy'), o('used the landscape', 'dùng khung cảnh'), b('to suggest'), g('the desires and fears of his characters', '= emotional states')] },
        { n: 2, chips: [b('He'), g('is delving into', '= investigate'), b('matters we all recognise because they are common to humanity')] },
        { n: 3, chips: [b('This is surely an act of exploration', 'đây cũng là khám phá')] },
      ],
    },
    notes:
      '→ [[1]] Hardy dùng khung cảnh Egdon Heath để thể hiện "desires and fears" (cảm xúc) của nhân vật\n→ [[2]] "delving into" = investigate → mục đích là khám phá cảm xúc con người\n→ [[3]] tác giả coi đó cũng là 1 hành động khám phá\n→ A {no} Egdon Heath là vùng đất HƯ CẤU (fictional), không phải trải nghiệm thật của Hardy\n→ B {no} tác giả không nói Hardy sai\n→ D {no} không nói về sức hút của sự cô lập\n⇒ Đáp án là **C** {ok}',
  },

  q4: {
    paraphrase: {
      question: [s('In the fourth paragraph, the writer refers to '), s('‘a golden age’', 'orange'), s(' to suggest that '), s('we are wrong to think that exploration is no longer necessary', 'green'), s('.')],
      pairs: [
        { left: o('‘a golden age’'), right: o('We think back to a golden age, as if exploration peaked somehow in the 19th century') },
        { left: g('we are wrong to think', 'ta đã nghĩ sai'), right: g('as if … though the truth is that', 'như thể … nhưng sự thật là') },
        { left: g('exploration is no longer necessary', 'khám phá không còn cần thiết'), right: g('the process of discovery is now on the decline', 'khám phá đang đi xuống') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('We think back to a golden age'), ',', b('as if', 'như thể - quan niệm sai'), b('exploration peaked in the 19th century'), b('— as if the process of discovery is now on the decline')] },
        { n: 2, chips: [g('though the truth is that', 'sự thật là - bác bỏ'), b('we have named only 1.5 million species'), b('… studied only 5 per cent … scarcely mapped the ocean floors …', 'còn rất nhiều thứ chưa khám phá')] },
      ],
    },
    notes:
      '→ [[1]] "as if" → tác giả đang nêu một **quan niệm sai**: khám phá đã đạt đỉnh ở thế kỷ 19 và giờ đi xuống\n→ [[2]] "though the truth is" → bác bỏ: mới đặt tên 1.5 triệu loài, mới nghiên cứu 5%, đáy đại dương gần như chưa lập bản đồ → vẫn còn rất nhiều cần khám phá\n→ A {no} bài không nói lượng thông tin hữu ích giảm đi — đó chính là quan niệm bị bác bỏ\n→ B, C {no} không nói ít người quan tâm hơn hay khám phá kém thú vị hơn\n⇒ Đáp án là **D** {ok}',
  },

  q5: {
    paraphrase: {
      question: [s('In the sixth paragraph, when discussing '), s('the definition of exploration', 'orange'), s(', the writer argues that '), s('people tend to relate exploration to their own professional interests', 'green'), s('.')],
      pairs: [
        { left: o('the definition of exploration'), right: o('Each definition') },
        { left: g('tend to relate exploration to', 'có xu hướng liên hệ khám phá với'), right: g('tends to reflect', 'có xu hướng phản ánh') },
        { left: g('their own professional interests', 'lĩnh vực nghề nghiệp của mình'), right: g('the field of endeavour of each pioneer', 'lĩnh vực hoạt động của mỗi người tiên phong') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('Each definition'), b('is slightly different'), b('— and'), g('tends to reflect the field of endeavour of each pioneer', '= relate to their own professional interests')] },
        { n: 2, chips: [b('the prominent historian', 'ví dụ'), b('would say exploration was a thing of the past'), ',', b('the cutting-edge scientist'), b('would say it was of the present')] },
      ],
    },
    notes:
      '→ [[1]] Mỗi định nghĩa "tends to reflect the field of endeavour of each pioneer"\n→ [[2]] ví dụ: nhà sử học nói khám phá thuộc về quá khứ, nhà khoa học nói thuộc về hiện tại → ai cũng định nghĩa theo nghề của mình\n→ B {no} không nói ai hiểu sai bản chất khám phá\n→ C {no} không nói định nghĩa thay đổi theo thời gian\n→ D {no} không so sánh ai có định nghĩa đúng hơn\n⇒ Đáp án là **A** {ok}',
  },

  q6: {
    paraphrase: {
      question: [s('In the last paragraph, the writer explains that '), s('he is interested in', 'orange'), s(' '), s('the human ability to cast new light on places that may be familiar', 'green'), s('.')],
      pairs: [
        { left: o('he is interested in'), right: o('this is what interests me') },
        { left: g('cast new light on', 'soi rọi góc nhìn mới'), right: g('a fresh interpretation … can give its readers new insights', 'cách diễn giải mới mang lại hiểu biết mới') },
        { left: g('places that may be familiar', 'những nơi có thể đã quen thuộc'), right: g('even of a well-travelled route', 'ngay cả 1 cung đường đã nhiều người đi') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [o('this is what interests me', '= he is interested in'), ':', g('how a fresh interpretation', 'cách diễn giải mới'), g('even of a well-travelled route', '= places that may be familiar'), g('can give its readers new insights', '= cast new light on')] }],
    },
    notes:
      '→ "this is what interests me: how a fresh interpretation, even of a well-travelled route, can give its readers new insights"\n→ fresh interpretation / new insights = cast new light on; well-travelled route = places that may be familiar\n→ A {no} không nói về tính cách thể hiện qua nơi chọn đi\n→ C {no} không nói thể loại du ký thay đổi thế nào\n→ D {no} không nói về cảm xúc của nhà văn với nơi họ khám phá\n⇒ Đáp án là **B** {ok}',
  },

  q7: {
    paraphrase: {
      question: [s('He referred to '), s('the relevance of the form of transport used', 'green'), s('.')],
      pairs: [
        { left: g('the form of transport used', 'phương tiện di chuyển'), right: g('by camel … by car', 'bằng lạc đà … bằng ô tô') },
        { left: g('the relevance of', 'tầm quan trọng / liên quan'), right: g('it would have been a stunt', 'thì chỉ là trò làm màu') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Wilfred Thesiger', 'E'), b('told me'), g('‘If I’d gone across by camel when I could have gone by car', 'nói về phương tiện'), g('it would have been a stunt.’', 'đi lạc đà khi có thể đi ô tô = làm màu')] }],
    },
    notes: '→ Thesiger nói nếu đi bằng **lạc đà** trong khi có thể đi **ô tô** thì đó chỉ là "a stunt" → phương tiện di chuyển quyết định việc có được coi là khám phá hay không\n⇒ Đáp án là **E. Wilfred Thesiger** {ok}',
  },

  q8: {
    paraphrase: {
      question: [s('He described '), s('feelings', 'orange'), s(' on '), s('coming back home after a long journey', 'green'), s('.')],
      pairs: [
        { left: g('coming back home after a long journey', 'trở về nhà sau chuyến đi dài'), right: g('the explorer returns to the existence he has left behind with his loved ones', 'nhà thám hiểm trở về cuộc sống đã bỏ lại cùng người thân') },
        { left: o('feelings'), right: o('seen himself only as a puny and irrelevant alien … suddenly encounters his other self', 'cảm giác nhỏ bé, lạc lõng → bỗng gặp lại chính mình') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('Peter Fleming', 'A'), b('talks of'), g('the moment when the explorer returns to the existence he has left behind with his loved ones', '= coming back home')] },
        { n: 2, chips: [b('The traveller'), o('who has … seen himself only as a puny and irrelevant alien', 'cảm xúc khi đi xa'), o('suddenly encounters his other self', 'cảm xúc khi trở về')] },
      ],
    },
    notes: '→ [[1]] Peter Fleming nói về khoảnh khắc nhà thám hiểm **trở về** với người thân\n→ [[2]] miêu tả cảm xúc: từ chỗ thấy mình nhỏ bé, lạc lõng → bỗng gặp lại "his other self"\n⇒ Đáp án là **A. Peter Fleming** {ok}',
  },

  q9: {
    paraphrase: {
      question: [s('He '), s('worked for the benefit of', 'orange'), s(' '), s('specific groups of people', 'green'), s('.')],
      pairs: [
        { left: o('worked for the benefit of', 'làm việc vì lợi ích của'), right: o('a campaigner on behalf of', 'nhà vận động thay mặt cho') },
        { left: g('specific groups of people', 'những nhóm người cụ thể'), right: g('remote so-called ‘tribal’ peoples', 'các bộ tộc sống biệt lập') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Robin Hanbury-Tenison', 'D'), ',', o('a campaigner on behalf of', '= worked for the benefit of'), g('remote so-called ‘tribal’ peoples', '= specific groups of people')] }],
    },
    notes: '→ Robin Hanbury-Tenison là "a campaigner **on behalf of** remote so-called ‘tribal’ peoples" — người vận động vì quyền lợi của các bộ tộc\n⇒ Đáp án là **D. Robin Hanbury-Tenison** {ok}',
  },

  q10: {
    paraphrase: {
      question: [s('He '), s('did not consider', 'orange'), s(' '), s('learning about oneself', 'green'), s(' an essential part of the exploration.')],
      pairs: [
        { left: g('learning about oneself', 'hiểu thêm về bản thân'), right: g('self-discovery', 'tự khám phá bản thân') },
        { left: o('did not consider … an essential part', 'không coi là phần thiết yếu'), right: o('regardless of any great self-discovery', 'bất kể có tự khám phá gì hay không') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('To him (= Thesiger)', 'E'), ',', b('exploration meant'), b('bringing back information from a remote place'), o('regardless of', 'bất kể = không quan trọng'), g('any great self-discovery', '= learning about oneself')] }],
    },
    notes: '→ Với Thesiger, khám phá là mang thông tin từ nơi xa về, "**regardless of** any great self-discovery" → việc hiểu bản thân không phải phần thiết yếu\n→ Bẫy: câu này đứng ngay sau lời Thesiger, và E dùng được nhiều lần (câu 7 cũng là E)\n⇒ Đáp án là **E. Wilfred Thesiger** {ok}',
  },

  q11: {
    paraphrase: {
      question: [s('He defined exploration as being both '), s('unique', 'orange'), s(' and '), s('of value to others', 'green'), s('.')],
      pairs: [
        { left: o('unique', 'độc nhất'), right: o('something that no human has done before', 'điều chưa ai từng làm') },
        { left: g('of value to others', 'có giá trị với người khác'), right: g('something scientifically useful', 'có ích về mặt khoa học') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('Ran Fiennes', 'B'), b('said'), b('‘An explorer is someone who has done'), o('something that no human has done before', '= unique'), b('— and also done'), g('something scientifically useful.’', '= of value to others')] }],
    },
    notes: '→ Ran Fiennes: nhà thám hiểm là người làm điều "no human has done before" (= unique) VÀ "scientifically useful" (= of value to others)\n→ Chris Bonington {no} chỉ nói "gone somewhere new", không có vế có ích cho người khác\n⇒ Đáp án là **B. Ran Fiennes** {ok}',
  },

  q12: {
    paraphrase: {
      question: [s('The writer has experience of '), s('a large number of', 'orange'), s(' ___')],
      pairs: [{ left: o('experience of a large number of ___', 'trải nghiệm rất nhiều ___'), right: o('I’ve done a great many expeditions', 'tôi đã thực hiện rất nhiều chuyến thám hiểm') }],
    },
    breakdown: {
      sentences: [{ chips: [b('I', 'S = the writer'), b('’ve done', 'V = has experience of'), o('a great many', '= a large number of'), g('expeditions', 'đáp án')] }],
    },
    notes: '→ "I’ve done **a great many** expeditions" = has experience of a large number of expeditions\n→ Sau "a large number of" cần danh từ số nhiều → **expeditions**\n⇒ Đáp án: **expeditions** {ok}',
  },

  q13: {
    paraphrase: {
      question: [s('was '), s('the first stranger', 'orange'), s(' that certain previously ___ people '), s('had encountered', 'green')],
      pairs: [
        { left: o('the first stranger … had encountered', 'người lạ đầu tiên họ gặp'), right: o('‘uncontacted tribes’', 'bộ tộc chưa từng tiếp xúc với bên ngoài') },
        { left: g('certain … people'), right: g('two ‘uncontacted tribes’') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('I’ve lived for months alone with isolated groups of people'), ',', b('even two'), o('‘uncontacted', 'đáp án — chưa từng tiếp xúc'), b('tribes’', '= people')] }],
    },
    notes: '→ Tác giả sống cùng "two ‘**uncontacted** tribes’" — bộ tộc chưa từng tiếp xúc với người ngoài → tác giả là người lạ ĐẦU TIÊN họ gặp\n→ "previously uncontacted people" = những người trước đó chưa từng được tiếp xúc\n→ Không chọn "isolated" — "biệt lập" chưa chắc là chưa từng gặp người lạ; chỉ "uncontacted" mới khớp với "the first stranger"\n⇒ Đáp án: **uncontacted** {ok}',
  },

  q14: {
    paraphrase: {
      question: [s('He believes '), s('there is no need for further exploration', 'orange'), s(' of Earth’s ___, '), s('except to answer specific questions such as how buffalo eat', 'green')],
      pairs: [
        { left: o('there is no need for further exploration', 'không cần khám phá thêm'), right: o('We know how the land surface of our planet lies', 'ta đã biết bề mặt đất liền ra sao') },
        { left: g('except … how buffalo eat', 'trừ … trâu ăn thế nào'), right: g('exploration of it is now down to the details — … the grazing behaviour of buffalo', 'giờ chỉ còn khám phá chi tiết') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [b('We know how'), b('the land'), o('surface', 'đáp án'), b('of our planet', '= Earth’s'), b('lies')] },
        { n: 2, chips: [b('exploration of it', 'S'), g('is now down to the details', 'chỉ còn chi tiết'), b('— the habits of microbes, say, or'), g('the grazing behaviour of buffalo', '= how buffalo eat')] },
      ],
    },
    notes: '→ [[1]] "We know how the land **surface** of our planet lies" → không cần khám phá bề mặt Trái Đất nữa; "of our planet" = Earth’s\n→ [[2]] khám phá giờ chỉ còn ở chi tiết, vd "the grazing behaviour of buffalo" = how buffalo eat\n→ Chỗ trống đứng sau "Earth’s" → cần 1 danh từ: **surface** (viết "land surface" cũng được, vẫn trong giới hạn 2 từ)\n⇒ Đáp án: **surface** {ok}',
  },
}
