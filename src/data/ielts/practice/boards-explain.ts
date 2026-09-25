import type { ChipColor, ExChip, Explanation } from '@/lib/ielts/practice'
import { linear } from './linear'

// Giải thích từng câu của "UK Companies Need More Effective Boards of Directors" (id q1…q14 khớp với
// reading.ts) — do tôi tự soạn từ bài đọc, CHƯA đối chiếu đáp án gốc. Câu 1-7 (List of headings) theo khuôn
// "Simplify & Connection" giống seti-explain.ts; câu 8-14 theo khuôn Paraphrasing + phân tích câu.
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
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('After'), b('serious failures of governance', 'thất bại trong quản trị'), ',', b('companies'), b('should consider'), b('radical changes to their directors’ roles')] },
        { n: 2, chips: [b('It is clear that'), b('the role of a board director'), b('is not an easy one')] },
        { n: 3, chips: [b('Following the 2008 financial meltdown', 'khủng hoảng 2008'), ',', b('the search for explanations'), b('has meant'), o('blame has been spread far and wide', 'đổ lỗi lan rộng khắp nơi')] },
        { n: 4, chips: [o('Governments, regulators, central banks and auditors', 'liệt kê = many external bodies'), o('have all been in the frame', 'đều bị nghi / bị quy trách nhiệm')] },
        { n: 5, chips: [b('The role of bank directors and management'), b('have been extensively picked over and examined', 'bị mổ xẻ, xem xét kỹ')] },
      ],
    },
    notes:
      'Câu [[1]] + [[2]] mở bài: vai trò giám đốc hội đồng quản trị không dễ, cần thay đổi\nCâu [[3]] ý chính: sau khủng hoảng 2008, việc **đổ lỗi bị lan ra rất rộng** (far and wide)\nCâu [[4]] liệt kê cụ thể ai bị đổ lỗi: chính phủ, cơ quan quản lý, ngân hàng trung ương, kiểm toán → đều là **bên ngoài** công ty\nCâu [[5]] bổ sung: giám đốc ngân hàng cũng bị xem xét kỹ\n→ blame spread far and wide = held responsible; governments, regulators, central banks, auditors = many external bodies\n→ The possible need for fundamental change… {no} "radical changes" chỉ là câu mở bài, ý thay đổi toàn diện là của đoạn G\n⇒ Chọn **iv. Many external bodies being held responsible for problems** {ok}',
  },

  q2: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [o('The knock-on effect of this scrutiny', 'tác động dây chuyền của sự soi xét'), b('has been'), b('to make the governance of companies an issue of intense public debate'), b('and'), b('has increased the pressures on directors', 'tăng áp lực')] },
        { n: 2, chips: [b('At the simplest level'), ',', b('the time involved'), b('has increased significantly'), ',', b('calling into question', 'đặt dấu hỏi về'), b('the effectiveness of part-time non-executive directors')] },
        { n: 3, chips: [b('Where once'), b('8-10 meetings a year'), ',', b('the number of events requiring board input'), b('has dramatically risen', 'ví dụ 1')] },
        { n: 4, chips: [b('Furthermore'), ',', b('the amount of reading and preparation'), b('is increasing', 'ví dụ 2')] },
        { n: 5, chips: [b('Agendas'), b('can become overloaded'), b('and'), b('the time for constructive debate'), b('must be restricted', 'hậu quả')] },
      ],
    },
    notes:
      'Câu [[1]] câu chủ đề: **tác động (knock-on effect)** của việc bị soi xét (scrutiny) → áp lực và trách nhiệm của giám đốc tăng\nCâu [[2]] cụ thể hoá: thời gian cần bỏ ra tăng mạnh\nCâu [[3]] + [[4]] + [[5]] ví dụ: nhiều cuộc họp hơn, nhiều tài liệu hơn, chương trình họp quá tải\n→ knock-on effect = impact; scrutiny = close examination\n⇒ Chọn **ii. The impact on companies of being subjected to close examination** {ok}',
  },

  q3: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('Often'), ',', b('board business'), b('is devolved to committees', 'giao cho các uỷ ban'), b('to cope with the workload'), ',', b('which may be more efficient', 'ưu điểm'), b('but', 'đối lập'), o('can mean that the board as a whole is less involved', 'cả hội đồng ít tham gia hơn'), b('in fully addressing the most important issues', '= solving major problems')] },
        { n: 2, chips: [b('It is not uncommon for'), b('the audit committee meeting'), b('to last longer than the main board meeting', 'ví dụ')] },
        { n: 3, chips: [b('Process'), b('may take the place of discussion'), ',', b('so that'), b('boxes are ticked rather than issues tackled', 'làm cho có, không giải quyết vấn đề')] },
      ],
    },
    notes:
      'Câu [[1]] ý chính nằm sau "but": giao việc cho uỷ ban khiến **cả hội đồng (the board as a whole)** ít tham gia giải quyết các vấn đề quan trọng nhất\nCâu [[2]] ví dụ: họp uỷ ban kiểm toán còn lâu hơn họp hội đồng chính\nCâu [[3]] hệ quả: chỉ làm theo thủ tục, không thật sự giải quyết vấn đề\n→ can mean = a risk; the board as a whole is less involved = not all directors take part; the most important issues = major problems\n⇒ Chọn **vi. A risk that not all directors take part in solving major problems** {ok}',
  },

  q4: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [o('A radical solution', 'giải pháp triệt để = a proposal'), ',', b('which may work for some very large companies'), ',', b('is'), o('the professional board', 'hội đồng chuyên nghiệp'), ',', b('whose members would work up to 3-4 days a week', 'mô tả cách vận hành mới')] },
        { n: 2, chips: [b('There are obvious risks'), b('and'), b('it would be important to establish clear guidelines', 'rủi ro + cần quy định')] },
        { n: 3, chips: [b('Problems of recruitment, remuneration and independence'), b('could also arise'), b('and'), b('this structure would not be appropriate for all companies')] },
        { n: 4, chips: [b('However', 'quay lại ủng hộ'), ',', b('more professional and better-informed boards'), b('would have been particularly appropriate for banks')] },
      ],
    },
    notes:
      'Câu [[1]] câu chủ đề: đề xuất **professional board** — thành viên làm 3-4 ngày/tuần, có nhân sự riêng → thay đổi cách hội đồng làm việc\nCâu [[2]] + [[3]] nhược điểm của đề xuất\nCâu [[4]] "However" khẳng định lại lợi ích (nhất là với ngân hàng)\n→ Cả đoạn xoay quanh 1 **đề xuất** và phân tích ưu/nhược của nó\n→ A radical solution = a proposal; professional board working 3-4 days a week = change the way the board operates\n→ Disputes over financial arrangements… {no} "remuneration" chỉ được nhắc lướt như 1 rủi ro\n⇒ Chọn **viii. A proposal to change the way the board operates** {ok}',
  },

  q5: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('One of the main criticisms of boards'), b('is that'), o('they do not focus sufficiently on longer-term matters', 'không tập trung đủ vào dài hạn'), ',', b('but'), g('concentrate too much on short-term financial metrics', 'quá chú trọng ngắn hạn')] },
        { n: 2, chips: [b('Regulatory requirements and the structure of the market'), b('encourage this behaviour', 'nguyên nhân')] },
        { n: 3, chips: [b('The tyranny of quarterly reporting'), b('can distort board decision-making'), ',', b('as directors have to ‘make the numbers’ every four months', 'ví dụ')] },
        { n: 4, chips: [b('This'), b('encourages'), b('a certain kind of investor'), b('who is simply seeking a short-term financial gain')] },
        { n: 5, chips: [b('Corporate culture adapts'), b('and'), b('management teams are incentivised to meet financial goals')] },
      ],
    },
    notes:
      'Câu [[1]] câu chủ đề: hội đồng **không tập trung đủ vào dài hạn**, chỉ lo các chỉ số tài chính ngắn hạn\nCâu [[2]] nguyên nhân: quy định và cấu trúc thị trường\nCâu [[3]] + [[4]] + [[5]] ví dụ và hệ quả: báo cáo quý, nhà đầu tư lướt sóng, văn hoá chạy theo mục tiêu tài chính\n→ do not focus sufficiently on longer-term matters = not looking far enough ahead\n⇒ Chọn **vii. Boards not looking far enough ahead** {ok}',
  },

  q6: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [o('Compensation for chief executives', 'thù lao CEO = financial arrangements regarding senior managers'), b('has become'), o('a combat zone', 'chiến trường = disputes'), b('where pitched battles between investors, management and board members are fought')] },
        { n: 2, chips: [b('Many would argue'), b('that this is in the interest of transparency'), b('as'), b('shareholders use their muscle in the area of pay', 'cổ đông gây sức ép về lương')] },
        { n: 3, chips: [b('Their powers'), b('to vote down executive remuneration policies'), b('increased')] },
        { n: 4, chips: [b('The chair of the remuneration committee'), b('can be an exposed and lonely role'), ',', b('as Alison Carnwath … found', 'ví dụ cụ thể')] },
      ],
    },
    notes:
      'Câu [[1]] câu chủ đề: thù lao CEO đã thành **"chiến trường"** giữa nhà đầu tư, ban điều hành và hội đồng\nCâu [[2]] + [[3]] cổ đông dùng quyền lực về lương để gây sức ép\nCâu [[4]] ví dụ: chủ tịch uỷ ban lương thưởng của Barclays phải từ chức\n→ Compensation = financial arrangements; chief executives = senior managers; combat zone / pitched battles = disputes\n⇒ Chọn **i. Disputes over financial arrangements regarding senior managers** {ok}',
  },

  q7: {
    breakdown: {
      title: 'Simplify & Connection',
      sentences: [
        { n: 1, chips: [b('The financial crisis'), b('stimulated a debate about the role and purpose of the company'), b('and'), b('a heightened awareness of corporate ethics')] },
        { n: 2, chips: [b('Trust in the corporation'), b('has been eroded'), b('and'), b('academics'), b('are questioning the morality of capitalism', 'ví dụ Michael Sandel')] },
        { n: 3, chips: [o('Boards of companies in all sectors', '= every area of business'), b('will need to'), b('widen their perspective'), b('and'), b('this may involve', '= possible'), o('a realignment of corporate goals', 'định hướng lại mục tiêu = fundamental change')] },
        { n: 4, chips: [b('We live in challenging times')] },
      ],
    },
    notes:
      'Câu [[1]] + [[2]] bối cảnh: khủng hoảng làm dấy lên tranh luận về vai trò, đạo đức doanh nghiệp; niềm tin bị suy giảm\nCâu [[3]] ý chính: hội đồng ở **mọi lĩnh vực** cần mở rộng tầm nhìn, **có thể** phải định hướng lại mục tiêu doanh nghiệp\nCâu [[4]] câu kết\n→ may involve = possible need; a realignment of corporate goals = fundamental change; companies in all sectors = every area of business\n→ A proposal to change the way the board operates {no} đó là đề xuất cụ thể ở đoạn D, còn đoạn G nói về thay đổi mục tiêu doanh nghiệp nói chung\n⇒ Chọn **iii. The possible need for fundamental change in every area of business** {ok}',
  },

  q8: {
    paraphrase: {
      question: [s('Close scrutiny', 'orange'), s(' of '), s('the behaviour of boards', 'blue'), s(' '), s('has increased', 'green'), s(' '), s('since the economic downturn', 'green'), s('.')],
      pairs: [
        { left: g('since the economic downturn'), right: g('Following the 2008 financial meltdown, which resulted in a deeper and more prolonged period of economic downturn') },
        { left: o('Close scrutiny', 'sự soi xét kỹ'), right: o('extensively picked over and examined … this scrutiny', 'bị mổ xẻ, xem xét kỹ') },
        { left: b('the behaviour of boards'), right: b('The role of bank directors … the governance of companies') },
        { left: g('has increased'), right: g('an issue of intense public debate … significantly increased the pressures') },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('Close scrutiny of the behaviour of boards', 'S - sự soi xét hội đồng quản trị'), r('has increased since the economic downturn', 'V - tăng lên từ khi suy thoái'), '.'],
      keywords: '"scrutiny", "boards", "economic downturn"',
      where: 'đoạn A và B',
      topic: 'nói về hệ quả sau khủng hoảng 2008',
      quote: 'Following the 2008 financial meltdown, which resulted in … economic downturn … The role of bank directors and management and their widely publicised failures **have been extensively picked over and examined** … **The knock-on effect of this scrutiny** has been to make the governance of companies in general **an issue of intense public debate**',
      evidence: [
        [b('Following the 2008 financial meltdown', '= since the economic downturn'), g('the role of bank directors', 'S'), r('extensively picked over and examined', 'V - bị soi xét kỹ')],
        [g('this scrutiny', 'S'), r('an issue of intense public debate', 'thành chủ đề tranh luận gay gắt')],
      ],
      mainIdea: 'Sau khủng hoảng 2008, hội đồng quản trị **bị soi xét kỹ hơn nhiều**.',
      inPassage: 'extensively picked over and examined … intense public debate.',
      inQuestion: 'close scrutiny has increased since the economic downturn.',
      conclusion: 'Khớp quan điểm tác giả → **khớp**.',
      answer: 'YES',
      others: [
        ['NO', 'chỉ đúng nếu tác giả nói việc soi xét giảm hoặc không đổi → tác giả nói ngược lại.'],
        ['NOT GIVEN', 'tác giả nêu rõ điều này.'],
      ],
    }),
  },

  q9: {
    paraphrase: {
      question: [s('Banks', 'orange'), s(' have been '), s('mismanaged', 'blue'), s(' '), s('to a greater extent than other businesses', 'green'), s('.')],
      pairs: [
        { left: o('Banks'), right: o('bank directors and management') },
        { left: b('mismanaged', 'quản lý kém'), right: b('their widely publicised failures', 'những thất bại bị công khai rộng rãi') },
        { left: g('to a greater extent than other businesses', 'NHIỀU HƠN các doanh nghiệp khác'), note: 'không có thông tin — bài không so sánh mức độ quản lý kém của ngân hàng với ngành khác' },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('Banks', 'S'), r('have been mismanaged to a greater extent than other businesses', 'V - quản lý kém hơn doanh nghiệp khác'), '.'],
      keywords: '"Banks", "mismanaged", "greater extent"',
      where: 'đoạn A',
      topic: 'nói về thất bại của giám đốc ngân hàng',
      quote: 'The role of bank directors and management and **their widely publicised failures** have been extensively picked over and examined in reports, inquiries and commentaries.',
      evidence: [[g('bank directors and management', 'S'), r('their widely publicised failures', 'thất bại bị công khai'), b('have been examined', 'V')]],
      mainIdea: 'Ngân hàng có thất bại, nhưng bài **không so sánh** với doanh nghiệp khác.',
      inPassage: 'Ngân hàng có những thất bại được công khai rộng rãi.',
      inQuestion: 'Ngân hàng quản lý kém **hơn** doanh nghiệp khác.',
      conclusion: 'Bài đọc **không cung cấp** phép so sánh này.',
      answer: 'NOT GIVEN',
      others: [
        ['YES', 'chỉ đúng nếu tác giả nói ngân hàng tệ hơn ngành khác → bài không nói.'],
        ['NO', 'chỉ đúng nếu tác giả nói ngân hàng không tệ hơn → bài cũng không nói.'],
      ],
    }),
  },

  q10: {
    paraphrase: {
      question: [s('Board meetings', 'orange'), s(' normally '), s('continue for as long as necessary', 'green'), s(' '), s('to debate matters in full', 'blue'), s('.')],
      pairs: [
        { left: o('Board meetings'), right: o('Agendas … each meeting') },
        { left: b('to debate matters in full', 'tranh luận đầy đủ'), right: b('constructive debate', 'tranh luận mang tính xây dựng') },
        { left: g('continue for as long as necessary', 'kéo dài bao lâu cũng được'), right: g('the time for constructive debate must necessarily be restricted', 'thời gian tranh luận BẮT BUỘC bị giới hạn'), rel: '≠' },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('Board meetings', 'S'), r('normally continue for as long as necessary to debate matters in full', 'V - kéo dài đủ để tranh luận đầy đủ'), '.'],
      keywords: '"meetings", "debate", "as long as necessary"',
      where: 'đoạn B',
      topic: 'nói về khối lượng công việc của hội đồng',
      quote: 'Agendas can become overloaded and this can mean **the time for constructive debate must necessarily be restricted** in favour of getting through the business.',
      evidence: [
        [g('Agendas', 'S'), b('can become overloaded', 'V - quá tải')],
        [g('the time for constructive debate', 'S'), r('must necessarily be restricted', 'V - buộc phải bị giới hạn')],
      ],
      mainIdea: 'Chương trình họp quá tải → thời gian tranh luận **bị giới hạn**.',
      inPassage: 'the time for constructive debate must be restricted.',
      inQuestion: 'continue for as long as necessary to debate matters in full.',
      conclusion: 'Quan điểm **trái ngược**.',
      answer: 'NO',
      others: [
        ['YES', 'chỉ đúng nếu tác giả nói họp đủ lâu để bàn kỹ → tác giả nói ngược lại.'],
        ['NOT GIVEN', 'tác giả nói rõ thời gian tranh luận bị cắt.'],
      ],
    }),
  },

  q11: {
    paraphrase: {
      question: [s('Using a committee structure', 'orange'), s(' would '), s('ensure that board members are fully informed', 'green'), s(' about '), s('significant issues', 'blue'), s('.')],
      pairs: [
        { left: o('Using a committee structure'), right: o('board business is devolved to committees') },
        { left: b('significant issues'), right: b('the most important issues') },
        { left: g('ensure that board members are fully informed', 'đảm bảo thành viên nắm đầy đủ'), right: g('the board as a whole is less involved in fully addressing', 'cả hội đồng ÍT tham gia hơn'), rel: '≠' },
      ],
    },
    detail: linear({
      yn: true,
      question: [g('Using a committee structure', 'S'), r('would ensure that board members are fully informed about significant issues', 'V - đảm bảo thành viên nắm đủ vấn đề quan trọng'), '.'],
      keywords: '"committee", "fully informed", "significant issues"',
      where: 'đoạn C',
      topic: 'nói về việc giao việc cho các uỷ ban',
      quote: 'Often, board business is devolved to committees in order to cope with the workload, which may be more efficient but **can mean that the board as a whole is less involved in fully addressing some of the most important issues**.',
      evidence: [
        [g('board business is devolved to committees', 'dùng uỷ ban'), b('may be more efficient', 'ưu điểm'), '→', b('but', 'đối lập')],
        [r('the board as a whole is less involved', 'cả hội đồng ÍT tham gia'), b('in fully addressing the most important issues', '= significant issues')],
      ],
      mainIdea: 'Dùng uỷ ban khiến **cả hội đồng ít tham gia** vào các vấn đề quan trọng nhất.',
      inPassage: 'less involved in fully addressing the most important issues.',
      inQuestion: 'ensure … fully informed about significant issues.',
      conclusion: 'Quan điểm **trái ngược**.',
      answer: 'NO',
      others: [
        ['YES', 'chỉ đúng nếu tác giả nói uỷ ban giúp mọi thành viên nắm đủ thông tin → tác giả nói ngược lại.'],
        ['NOT GIVEN', 'tác giả nêu rõ nhược điểm này.'],
      ],
    }),
  },

  q12: {
    paraphrase: {
      question: [s('Before 2008', 'blue'), s(', '), s('non-executive directors', 'orange'), s(' were '), s('at a disadvantage', 'green'), s(' because of their lack of ___')],
      pairs: [
        { left: b('Before 2008'), right: b('unable to comprehend or anticipate the 2008 crash', 'trước khi khủng hoảng xảy ra') },
        { left: o('non-executive directors'), right: o('part-time non-executive directors') },
        { left: g('at a disadvantage because of their lack of ___', 'bất lợi vì thiếu ___'), right: g('the executives had access to information that part-time non-executive directors lacked', 'điều hành có thông tin mà NED thiếu') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('banks where'), b('the executives', 'S'), b('had access to', 'V'), g('information', 'đáp án'), b('that part-time non-executive directors lacked', 'mà NED thiếu'), ',', b('leaving the latter unable to comprehend or anticipate the 2008 crash', '= at a disadvantage')] }],
    },
    notes: '→ "information that part-time non-executive directors **lacked**" = their lack of information\n→ "leaving the latter unable to comprehend or anticipate the 2008 crash" = bất lợi, không hiểu và không lường trước được khủng hoảng (tức là trước 2008)\n⇒ Đáp án: **information** {ok}',
  },

  q13: {
    paraphrase: {
      question: [s('Boards', 'orange'), s(' tend to '), s('place too much emphasis on', 'green'), s(' ___ considerations '), s('that are only of short-term relevance', 'blue'), s('.')],
      pairs: [
        { left: o('Boards', 'Exact word'), right: o('boards and their directors') },
        { left: g('place too much emphasis on', 'quá chú trọng'), right: g('concentrate too much on') },
        { left: b('___ considerations that are only of short-term relevance'), right: b('short-term financial metrics', 'chỉ số tài chính ngắn hạn') },
      ],
    },
    breakdown: {
      sentences: [{ chips: [b('One of the main criticisms of boards'), b('is that'), b('they do not focus sufficiently on longer-term matters'), ',', b('but instead'), g('concentrate too much on', '= place too much emphasis on'), b('short-term', '= of short-term relevance'), o('financial', 'đáp án — tính từ'), b('metrics', '= considerations')] }],
    },
    notes: '→ concentrate too much on = place too much emphasis on\n→ Chỗ trống đứng trước danh từ "considerations" → cần 1 **tính từ**; trong "short-term **financial** metrics", "short-term" đã được diễn đạt lại thành "only of short-term relevance"\n→ Chỉ còn "financial" là tính từ phù hợp\n⇒ Đáp án: **financial** {ok}',
  },

  q14: {
    paraphrase: {
      question: [s('On certain matters, '), s('such as pay', 'orange'), s(', the board '), s('may have to accept the views of', 'green'), s(' ___')],
      pairs: [
        { left: o('such as pay'), right: o('in the area of pay … executive remuneration policies') },
        { left: g('may have to accept the views of ___', 'buộc phải chấp nhận ý kiến của'), right: g('shareholders use their muscle … to pressure boards … powers to vote down … binding votes', 'cổ đông gây sức ép, có quyền phủ quyết') },
      ],
    },
    breakdown: {
      sentences: [
        { n: 1, chips: [o('shareholders', 'S — đáp án'), g('use their muscle', 'V — dùng quyền lực'), b('in the area of pay', '= such as pay'), b('to pressure boards to remove underperforming chief executives')] },
        { n: 2, chips: [b('Their powers to vote down executive remuneration policies', 'S'), b('increased', 'V'), g('when binding votes came into force', 'phiếu bầu có tính ràng buộc → board PHẢI chấp nhận')] },
      ],
    },
    notes: '→ [[1]] Cổ đông dùng "muscle" (quyền lực) về vấn đề lương để gây sức ép lên hội đồng\n→ [[2]] quyền phủ quyết chính sách lương của họ tăng khi có "binding votes" (phiếu bầu có tính ràng buộc) → hội đồng buộc phải chấp nhận ý kiến cổ đông\n→ Không chọn "investors" — câu đầu đoạn chỉ nói các bên tranh cãi, còn người có quyền biểu quyết ràng buộc là shareholders\n⇒ Đáp án: **shareholders** {ok}',
  },
}
