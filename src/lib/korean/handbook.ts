// Cẩm nang ngữ pháp (/korean/handbook): gom ngữ pháp TOPIK I + TOPIK II theo NGHĨA/CHỨC NĂNG thay vì theo bài,
// để tra nhanh những mẫu dịch ra cùng 1 nghĩa nhưng cách dùng khác nhau (vd "vì... nên" có 5 mẫu). Nội dung chi
// tiết (lý thuyết, ví dụ) vẫn nằm ở thẻ ngữ pháp trong DB — ở đây chỉ có phân loại + phần "cách chọn nhanh" so
// sánh các mẫu trong cùng nhóm, mỗi mẫu link về đúng thẻ trong bài.
//
// Key của HANDBOOK_MAP = `${lesson}|${front}` khớp CHÍNH XÁC với thẻ trong DB (cùng quy ước với grammarTheory.ts),
// kể cả các `front` bị lỗi encoding từ dữ liệu gốc (vd 'V(으)랜고' = -(으)려고). Phần `note` bên dưới dùng chính tả
// chuẩn. Thẻ ngữ pháp mới chưa được phân loại sẽ rơi vào nhóm "Chưa phân loại" ở cuối trang (không bị ẩn mất).

export interface HandbookCategory {
  key: string
  icon: string
  title: string
  note: string // "cách chọn nhanh" — mỗi đoạn tách bằng '\n\n'
}

export const HANDBOOK_CATEGORIES: HandbookCategory[] = [
  {
    key: 'reason',
    icon: '🔗',
    title: 'Lý do – Nguyên nhân (Vì… nên…)',
    note:
      '-아서/어서 và -(으)니까 đều dịch là "vì… nên", nhưng -아서/어서 KHÔNG dùng được khi vế sau là mệnh lệnh, rủ rê, đề nghị (-(으)세요, -(으)ㅂ시다, -(으)ㄹ까요?). Gặp các câu đó thì bắt buộc dùng -(으)니까.\n\n' +
      '-아서/어서 cũng không kết hợp với thì quá khứ (không nói 먹었어서), còn -(으)니까 thì được (먹었으니까). -(으)니까 hay mang sắc thái người nói đưa ra lý do chủ quan để thuyết phục.\n\n' +
      'N(이)라서 là dạng dành cho danh từ, ý khách quan, và cũng không đứng trước mệnh lệnh/đề nghị (주말이라서 쉽시다 ✗ → 주말이니까 쉽시다 ✓).\n\n' +
      'N 때문에 / -기 때문에 nhấn mạnh nguyên nhân rõ ràng, cụ thể, thường mang sắc thái tiêu cực (đổ lỗi, trở ngại) và trang trọng hơn. Không dùng trước mệnh lệnh/đề nghị. Lưu ý: với danh từ, "N 때문에" = "tại N", còn "N(이)기 때문에" = "vì là N".',
  },
  {
    key: 'guess',
    icon: '🔮',
    title: 'Suy đoán – Phỏng đoán',
    note:
      'Hệ "것 같다" chia theo thời: -는 것 같다 (đang xảy ra), -(으)ㄴ 것 같다 (đã xảy ra, với động từ), -(으)ㄹ 것 같다 (sẽ xảy ra). Dùng được trong hầu hết ngữ cảnh; người Hàn hay dùng để nói giảm nhẹ, khiêm tốn, kể cả khi khá chắc chắn.\n\n' +
      '-(으)ㄹ 거예요 (khi chủ ngữ là ngôi thứ 3) là suy đoán dựa trên suy luận hoặc thông tin đã biết, nên thường chắc chắn hơn "것 같다".\n\n' +
      '-겠- là phỏng đoán dựa ngay trên tình huống/dấu hiệu trước mắt tại thời điểm nói (보니까 맛있겠어요 — nhìn thì chắc là ngon).\n\n' +
      '-아/어 보이다 CHỈ dựa trên vẻ ngoài nhìn thấy được và chỉ dùng với tính từ ("trông có vẻ…").\n\n' +
      '-(으)ㄹ지 모르겠다 nhấn vào sự phân vân, không chắc ("không biết là… có… hay không").',
  },
  {
    key: 'purpose',
    icon: '🎯',
    title: 'Mục đích – Ý định (để…, định…)',
    note:
      '-(으)려고 nêu mục đích ngay trong câu ("để V"). Hai vế phải cùng chủ ngữ, và vế sau không được là mệnh lệnh/rủ rê.\n\n' +
      '-(으)러 가다/오다 cũng là "để V" nhưng CHỈ đi với động từ di chuyển (가다, 오다, 다니다…), và vế sau lại dùng được mệnh lệnh (밥 먹으러 가세요 ✓).\n\n' +
      '-(으)려고 하다 đứng cuối câu, nói về Ý ĐỊNH sắp làm ("định V").\n\n' +
      '-(으)ㄹ까 하다 cũng là "định V" nhưng ý định còn mơ hồ, đang cân nhắc, và chỉ dùng cho ngôi thứ nhất.\n\n' +
      '-기로 하다 là quyết định/lời hứa đã chốt, một mình hoặc với người khác (thường chia quá khứ -기로 했어요).\n\n' +
      'Xem thêm -(으)려면 ("nếu muốn… thì…") ở nhóm Điều kiện.',
  },
  {
    key: 'condition',
    icon: '🧩',
    title: 'Điều kiện – Giả định (Nếu… thì…)',
    note:
      '-(으)면 là điều kiện/giả định chung nhất ("nếu… thì…").\n\n' +
      '-(으)려면 = -(으)려고 (ý định) + -면 (điều kiện): "nếu MUỐN V thì…". Vế sau gần như luôn là lời khuyên, yêu cầu hoặc hướng dẫn.\n\n' +
      '-(으)면 되다 = "chỉ cần V là được", nêu điều kiện tối thiểu, đủ để đạt mục đích. Đối lập với -(으)면 안 되다 (cấm) ở nhóm Cho phép – Cấm.',
  },
  {
    key: 'permission',
    icon: '🚦',
    title: 'Cho phép – Cấm đoán – Bắt buộc',
    note:
      '-아도/어도 되다 = hỏi xin phép / cho phép ("V có được không?", "V cũng được"). Có thể thay 되다 bằng 괜찮다.\n\n' +
      '-(으)면 안 되다 = không được phép V, là dạng đối lập trực tiếp của -아도/어도 되다. Hay gặp ở nội quy, biển báo.\n\n' +
      '-지 마세요 = lời yêu cầu/khuyên "đừng V" nói thẳng với người nghe. -(으)면 안 되다 thì nêu quy định chung.\n\n' +
      '-아야/어야 되다 (= -아야/어야 하다) = bắt buộc, nghĩa vụ ("phải V").',
  },
  {
    key: 'experience',
    icon: '🧪',
    title: 'Thử làm – Kinh nghiệm',
    note:
      '-아/어 보다 ở hiện tại/tương lai = "thử V". Ở quá khứ (-아/어 봤어요) = "đã từng V", tức là kinh nghiệm qua một lần thử.\n\n' +
      '-아/어 보세요 = lời khuyên "hãy thử V".\n\n' +
      '-(으)ㄴ 적이 있다/없다 = đã từng / chưa từng, nhấn vào việc sự kiện đó CÓ xảy ra hay không, không cần mang ý "thử". Hai mẫu hay đi chung: 가 본 적이 있어요 = đã từng đi (thử).',
  },
  {
    key: 'sequence',
    icon: '⛓️',
    title: 'Trình tự – Đồng thời – Liệt kê',
    note:
      '-고 nối 2 việc một cách trung tính: liệt kê (A/V-고) hoặc trình tự (V-고), không nhấn hoàn tất.\n\n' +
      '-아서/어서 (trình tự) nối 2 hành động CÓ LIÊN QUAN, hành động trước là tiền đề của hành động sau (가서 만나요 = đến đó RỒI gặp). -고 thì 2 việc có thể độc lập (밥을 먹고 공부해요).\n\n' +
      '-고 나서 nhấn hành động trước phải HOÀN TẤT xong rồi mới làm việc sau (chỉ dùng với động từ, cùng chủ ngữ).\n\n' +
      '-기 전에 / -(으)ㄴ 후에 là cặp "trước khi / sau khi". -(으)ㄴ 후에 gần nghĩa -고 나서 nhưng dùng được khi 2 vế KHÁC chủ ngữ.\n\n' +
      '-다가 = đang làm thì bị GIÁN ĐOẠN, chuyển sang việc khác.\n\n' +
      '-(으)면서 = 2 hành động diễn ra ĐỒNG THỜI ("vừa… vừa…"), cùng chủ ngữ.\n\n' +
      'N 동안 nhấn ĐỘ DÀI khoảng thời gian một việc kéo dài liên tục.\n\n' +
      '-아다/어다 주다 = làm V1 ở một chỗ rồi mang kết quả đến chỗ khác cho ai đó (사다 주다 = mua mang đến cho).',
  },
  {
    key: 'contrast',
    icon: '⚖️',
    title: 'Tương phản (Nhưng…)',
    note:
      '-지만 = "nhưng" trung tính, phổ biến nhất, dùng được cả văn nói lẫn văn viết.\n\n' +
      '-는데/(으)ㄴ데/인데 (nghĩa 2) cũng là "nhưng", mềm và tự nhiên hơn trong hội thoại. Cùng hình thức này còn có nghĩa "bối cảnh" (xem nhóm Bối cảnh – Dẫn nhập), nên phải dựa vào nội dung 2 vế để phân biệt: 2 vế đối lập nhau thì là "nhưng".\n\n' +
      '-기는 하지만 (= -긴 하지만) thừa nhận vế trước là đúng rồi mới đưa ý trái ngược ("ngon thì có ngon thật, nhưng…"). Hợp khi vừa khen vừa chê.',
  },
  {
    key: 'background',
    icon: '💬',
    title: 'Bối cảnh – Dẫn nhập – Chờ phản hồi',
    note:
      '-는데/(으)ㄴ데/인데 (nghĩa 1) đặt GIỮA câu, nêu bối cảnh/tiền đề rồi hỏi, đề nghị hoặc nói tiếp ở vế sau (더운데 에어컨을 켤까요?).\n\n' +
      '-는데요/(으)ㄴ데요/인데요 là cùng hệ đó nhưng đặt CUỐI câu: câu nói để ngỏ, chờ người nghe phản hồi, hoặc từ chối/phản bác một cách khéo.\n\n' +
      'Nghĩa "nhưng" của hệ ngữ pháp này nằm ở nhóm Tương phản.',
  },
  {
    key: 'commit',
    icon: '🤝',
    title: 'Hứa hẹn – Ý định của người nói',
    note:
      '-(으)ㄹ게요 = lời HỨA/thông báo quyết định tức thời với người nghe ("tôi sẽ V nhé"). Chỉ dùng cho ngôi thứ nhất, câu trần thuật.\n\n' +
      '-(으)ㄹ래요 = ý muốn, lựa chọn của người nói. Ở câu hỏi thì dùng để hỏi ý muốn của người nghe (뭐 먹을래요?). Không mang ý hứa hẹn như -(으)ㄹ게요.\n\n' +
      '-(으)ㄹ 테니까 = "(tôi) sẽ V1, vậy nên (bạn) hãy V2": ý chí của người nói làm lý do cho lời đề nghị ở vế sau. Hoặc là phán đoán chắc chắn làm lý do ("chắc sẽ… nên…").\n\n' +
      'So với -(으)ㄹ 거예요 (nhóm Thì cơ bản): -(으)ㄹ 거예요 là dự định đã có từ trước, không mang ý hứa với người nghe.',
  },
  {
    key: 'ability',
    icon: '💪',
    title: 'Khả năng – Năng lực',
    note:
      '-(으)ㄹ 수 있다/없다 = có thể / không thể, nói chung. Có thể do năng lực, cũng có thể do hoàn cảnh cho phép.\n\n' +
      '-(으)ㄹ 줄 알다/모르다 = biết / không biết CÁCH làm, tức là kỹ năng đã học (수영할 줄 알아요 = biết bơi). Còn 수영할 수 있어요 = có thể bơi, ví dụ vì hôm nay không bị ốm.\n\n' +
      '못 V = phủ định ngắn của khả năng ("không thể V"), dạng dài tương đương là -지 못하다. Khác 안 V (không làm, do không muốn).',
  },
  {
    key: 'negation',
    icon: '🚫',
    title: 'Phủ định',
    note:
      '안 V/A = phủ định ngắn, thường dùng trong văn nói. Với động từ "danh từ + 하다" phải tách ra: 공부 안 해요.\n\n' +
      '-지 않다 = phủ định dài, trang trọng hơn, gắn thẳng vào gốc từ nên an toàn với mọi động từ (공부하지 않아요).\n\n' +
      'N이/가 아니다 = phủ định danh từ ("không phải là N").\n\n' +
      'Phủ định mang nghĩa "không thể" (못, -지 못하다) nằm ở nhóm Khả năng.',
  },
  {
    key: 'tense',
    icon: '🕒',
    title: 'Thì cơ bản (hiện tại – quá khứ – tương lai)',
    note:
      '-아요/어요 = hiện tại (việc đang làm, thói quen, dự định gần).\n\n' +
      '-았/었- = quá khứ.\n\n' +
      '-(으)ㄹ 거예요 = tương lai, dự định, kế hoạch (khi chủ ngữ là tôi/bạn). Cùng hình thức này, khi chủ ngữ là ngôi thứ 3 hoặc nói về điều không chắc, lại mang nghĩa suy đoán "chắc là sẽ…" (xem nhóm Suy đoán).',
  },
  {
    key: 'honorific',
    icon: '🙏',
    title: 'Kính ngữ – Đuôi câu trang trọng',
    note:
      '-습니다/ㅂ니다 và N입니다 / N입니까? là đuôi câu TRANG TRỌNG (formal), dùng khi thuyết trình, phỏng vấn, tin tức, nói với người lạ trong tình huống nghiêm túc.\n\n' +
      '-(으)시- chèn vào gốc từ để TÔN TRỌNG người làm chủ ngữ (người lớn tuổi, cấp trên), không liên quan đến người nghe. Có thể dùng chung với đuôi -아요/어요: 가세요, 읽으세요.\n\n' +
      'N(이)세요 là dạng kính ngữ của N이에요/예요 (선생님이세요?).',
  },
  {
    key: 'confirm',
    icon: '❓',
    title: 'Xác nhận – Hỏi nhẹ – Cảm thán',
    note:
      '-네요 = cảm thán khi vừa NHẬN RA điều gì đó (lần đầu thấy/biết).\n\n' +
      '-지요?(-죠?) = hỏi để XÁC NHẬN điều mình đã biết/đoán trước, mong người nghe đồng ý ("…phải không?", "…nhỉ?").\n\n' +
      '-나요? / -(으)ㄴ가요? / 인가요? = hỏi LỊCH SỰ, nhẹ nhàng hơn -아요?/어요?, hay dùng với người mới quen hoặc khi hỏi thông tin một cách tế nhị.',
  },
  {
    key: 'request',
    icon: '🙋',
    title: 'Đề nghị – Rủ rê – Yêu cầu',
    note:
      '-(으)ㄹ까요? = rủ rê/hỏi ý kiến nhẹ nhàng ("…nhé?", "hay là…?"), để ngỏ cho người nghe từ chối. Khi chủ ngữ là ngôi thứ 3 thì là tự hỏi, phỏng đoán.\n\n' +
      '-는 게 어때요? = đưa ra một GIẢI PHÁP/gợi ý cụ thể cho vấn đề đang bàn ("thử… thì sao?").\n\n' +
      '-(으)세요 = yêu cầu, mời lịch sự ("hãy V", "mời V").\n\n' +
      'N 주세요 = xin/yêu cầu được đưa vật gì. V-아/어 주세요 = nhờ ai làm giúp việc gì (xem -아/어 주다 ở nhóm Cấu trúc sơ cấp).',
  },
  {
    key: 'wish',
    icon: '💭',
    title: 'Mong muốn',
    note:
      '-고 싶다 = mong muốn của người nói (hoặc hỏi người nghe), có thể tự mình làm được.\n\n' +
      '-고 싶어 하다 = mong muốn của NGƯỜI THỨ BA, người nói nhìn từ bên ngoài (동생이 가고 싶어 해요).\n\n' +
      '-았/었으면 좋겠다 = ước gì, mong là… Dùng cho điều mình KHÔNG tự quyết định được (비가 안 왔으면 좋겠어요 — không thể nói 비가 안 오고 싶어요).',
  },
  {
    key: 'change',
    icon: '🔄',
    title: 'Thay đổi trạng thái (trở nên…)',
    note:
      '-아지다/어지다 gắn sau TÍNH TỪ, diễn tả trạng thái biến đổi dần dần ("trở nên…", 날씨가 더워졌어요).\n\n' +
      '-게 되다 gắn sau ĐỘNG TỪ, diễn tả sự thay đổi do hoàn cảnh đưa đẩy, không phải do chủ động quyết định ("thành ra…", "được/bị/phải…").',
  },
  {
    key: 'state',
    icon: '📌',
    title: 'Đang diễn ra – Trạng thái kết quả',
    note:
      '-고 있다 = hành động ĐANG diễn ra, tiếp diễn (먹고 있어요).\n\n' +
      '-는 중이다 / N 중이다 = đang ở GIỮA một quá trình. Thường dùng để giải thích vì sao đang bận (회의 중이에요).\n\n' +
      '-아/어 있다 = hành động đã xong nhưng TRẠNG THÁI KẾT QUẢ vẫn còn (앉아 있어요 = đang ngồi, 문이 열려 있어요 = cửa đang mở). Thường đi với nội động từ/bị động. Đừng nhầm với -고 있다.\n\n' +
      '-아/어 놓다 = CHỦ ĐỘNG làm sẵn, để đó cho sau này dùng (tha động từ, 문을 열어 놓았어요 = mở cửa sẵn).\n\n' +
      '-아/어 버리다 = hoàn tất trọn vẹn, kèm cảm xúc tiếc nuối ("…mất rồi") hoặc nhẹ nhõm ("…cho xong").',
  },
  {
    key: 'comparison',
    icon: '📏',
    title: 'So sánh',
    note:
      'N보다 = đánh dấu vật làm mốc so sánh hơn/kém ("so với N thì…"), thường đi với 더.\n\n' +
      'N처럼 / N같이 = so sánh GIỐNG NHAU ("giống như N"). Lưu ý 같이 còn có nghĩa "cùng nhau".\n\n' +
      'N 중에(서) = chọn một trong số nhiều, thường đi với 가장/제일 (so sánh nhất).',
  },
  {
    key: 'time',
    icon: '⏰',
    title: 'Thời điểm (khi, lúc, kể từ khi)',
    note:
      '-(으)ㄹ 때 = "khi/lúc V", hành động đang diễn ra hoặc sắp diễn ra tại thời điểm đó.\n\n' +
      '-았/었을 때 = "khi ĐÃ V", việc đã hoàn toàn xong hoặc thuộc về quá khứ (한국에 갔을 때 = khi đã đến Hàn, lúc ở đó).\n\n' +
      '-(으)ㄴ 지 + khoảng thời gian + 되다/지나다 = "kể từ khi V đã được…" (한국에 온 지 1년이 됐어요).\n\n' +
      'N에 = "vào lúc N", trợ từ thời điểm (không dùng với 오늘, 어제, 내일, 지금).',
  },
  {
    key: 'fromTo',
    icon: '↔️',
    title: 'Từ… đến… (thời gian & nơi chốn)',
    note:
      'N부터 N까지 dùng cho THỜI GIAN hoặc thứ tự (9시부터 5시까지).\n\n' +
      'N에서 N까지 dùng cho NƠI CHỐN, khoảng cách (집에서 학교까지).',
  },
  {
    key: 'means',
    icon: '🧭',
    title: 'N(으)로 — Phương tiện hay Hướng đi?',
    note:
      'Cùng một hình thức (으)로 nhưng có 2 nghĩa. Dựa vào động từ đi kèm để phân biệt:\n\n' +
      'Đi với 가다/오다/돌다… → HƯỚNG di chuyển ("về phía N": 오른쪽으로 가세요).\n\n' +
      'Đi với 만들다/쓰다/보내다/타다… → PHƯƠNG TIỆN, CÁCH THỨC, CHẤT LIỆU ("bằng N": 비행기로 보내요, 한국어로 말해요).',
  },
  {
    key: 'exist',
    icon: '📍',
    title: 'Có / Không có — Sở hữu & Vị trí',
    note:
      'N이/가 있다/없다 = CÓ / không có cái gì (sở hữu, tồn tại nói chung: 시간이 있어요).\n\n' +
      'N에 있다/없다 = Ở / không ở đâu (vị trí: 학교에 있어요). Hai mẫu hay ghép chung: 방에 책상이 있어요.',
  },
  {
    key: 'limit',
    icon: '🎚️',
    title: 'Trợ từ giới hạn – Nhấn mạnh (chỉ, cũng, tận)',
    note:
      'N만 = "chỉ N", trung tính, vị ngữ khẳng định hay phủ định đều được.\n\n' +
      'N밖에 = "chỉ có N" nhưng LUÔN đi với phủ định (없다, 안, 못…), nhấn ý ít ỏi, không đủ so với mong đợi.\n\n' +
      'N도 = "N cũng", thêm vào điều đã nói.\n\n' +
      'N(이)나 (nghĩa 2) = số lượng NHIỀU hơn mong đợi ("tận, những…"), ngược chiều với 밖에.',
  },
  {
    key: 'nominal',
    icon: '📝',
    title: 'Danh từ hoá – Câu hỏi gián tiếp',
    note:
      '-는 것 biến động từ thành cụm danh từ ("việc V") làm chủ ngữ hoặc tân ngữ (수영하는 것을 좋아해요).\n\n' +
      '-기(가) + tính từ đánh giá (쉽다, 어렵다, 좋다, 편하다…) nhận xét độ dễ/khó của hành động (읽기가 어려워요).\n\n' +
      '-는지 / N인지 + 알다/모르다 lồng một câu hỏi vào trong câu ("biết/không biết là… không, …thế nào"), giữ nguyên từ để hỏi (뭐, 어디, 얼마…).',
  },
  {
    key: 'modifier',
    icon: '🏷️',
    title: 'Định ngữ (bổ nghĩa cho danh từ)',
    note:
      'Định ngữ ĐỘNG TỪ chia theo 3 thời: -는 N (đang/thường xảy ra), -(으)ㄴ N (đã xảy ra), -(으)ㄹ N (sẽ xảy ra, dự định). Ví dụ: 먹는 음식 / 먹은 음식 / 먹을 음식.\n\n' +
      'Định ngữ TÍNH TỪ dùng -(으)ㄴ N cho hiện tại (예쁜 꽃). Đừng nhầm với -(으)ㄴ quá khứ của động từ.\n\n' +
      '이/그/저 N = N này / đó (gần người nghe) / kia (xa cả hai).',
  },
  {
    key: 'style',
    icon: '✍️',
    title: 'Văn viết – Văn nói thân mật',
    note:
      'A-다 / V-ㄴ다·는다 / N(이)다 là đuôi câu trần thuật dùng trong VĂN VIẾT (báo chí, nhật ký, bài luận TOPIK viết câu 51–54). Không dùng khi nói chuyện với người khác.\n\n' +
      '반말 là lời nói SUỒNG SÃ, thân mật (bỏ 요, xưng 나/너). Chỉ dùng với người rất thân hoặc nhỏ tuổi hơn, khi đã được cho phép.',
  },
  {
    key: 'irregular',
    icon: '🔧',
    title: 'Bất quy tắc – Biến âm',
    note:
      'Mỗi bất quy tắc xảy ra với một nhóm âm cuối khi gặp đuôi bắt đầu bằng nguyên âm:\n\n' +
      'ㅂ → 우 (덥다 → 더워요) · ㄷ → ㄹ (듣다 → 들어요) · ㅅ bị lược (낫다 → 나아요) · ㅎ bị lược (그렇다 → 그래요) · 르 → ㄹㄹ (모르다 → 몰라요) · ㅡ bị lược (바쁘다 → 바빠요).\n\n' +
      'ㄹ 탈락: patchim ㄹ rơi trước ㄴ, ㅂ, ㅅ (살다 → 사세요, 삽니다).\n\n' +
      'Có nhiều từ ngoại lệ không theo quy tắc (웃다, 씻다 với ㅅ; 입다, 좁다 với ㅂ; 받다, 닫다 với ㄷ) — xem chi tiết trong từng thẻ.',
  },
  {
    key: 'misc',
    icon: '🔹',
    title: 'Mẫu câu riêng lẻ',
    note: 'Các mẫu không có "anh em" cùng nghĩa để so sánh — liệt kê để tra cứu nhanh.',
  },
  {
    key: 'basic',
    icon: '🧱',
    title: 'Cấu trúc câu & trợ từ sơ cấp',
    note:
      'Nền tảng TOPIK I: câu "N은/는 N이에요", trợ từ 을/를 (tân ngữ), 에서 (nơi hành động), 에 (đích đến), 한테/께 (người nhận), 의 (sở hữu), cách đếm, cách chào hỏi… Đây là các mẫu cơ bản, xem chi tiết trong từng bài.',
  },
]

// `${lesson}|${front}` → key nhóm. Một mẫu chỉ thuộc đúng 1 nhóm; liên hệ chéo giữa các nhóm ghi trong `note`.
export const HANDBOOK_MAP: Record<string, string> = {
  // Lý do – Nguyên nhân
  '5|A/V–(으)니까, N(이)니까': 'reason',
  '6|N(이)라서': 'reason',
  '8|N 때문에': 'reason',
  '13|V/A-기 때문에, N(이)기 때문에': 'reason',
  '112|A/V-아서/어서 (lý do)': 'reason',

  // Suy đoán
  '4|A–(으)ㄴ/V-는/N인 것 같다 (hiện tại)': 'guess',
  '6|V-(으)ㄴ 것 같다 (quá khứ)': 'guess',
  '7|V/A-(으)ㄹ 것 같다 (tương lai)': 'guess',
  '5|A/V (으)ㄹ 거예요 (suy đoán)': 'guess',
  '8|V/A-걨-': 'guess',
  '12|A-아/어 보이다': 'guess',
  '13|V/A-(으)ㄹ지 모르겠다': 'guess',

  // Mục đích – Ý định
  '1|V(으)랜고': 'purpose',
  '113|V-(으)려고 하다': 'purpose',
  '116|V-(으)러 가다[오다]': 'purpose',
  '11|V-기로 하다': 'purpose',
  '16|V-(으)ㄹ까 하다': 'purpose',

  // Điều kiện
  '115|A/V-(으)면': 'condition',
  '7|V-(으)려면': 'condition',
  '6|V-(으)면 되다': 'condition',

  // Cho phép – Cấm – Bắt buộc
  '14|V-아도/어도 돼다': 'permission',
  '14|V-(으)면 안 돼다': 'permission',
  '111|V-지 마세요': 'permission',
  '111|V-아야/어야 되다': 'permission',

  // Thử làm – Kinh nghiệm
  '3|V 아/어 보다': 'experience',
  '114|V-아/어 보세요': 'experience',
  '14|V-(으)ㄴ 적(이) 있다[없다]': 'experience',

  // Trình tự – Đồng thời – Liệt kê
  '105|V-고 (trình tự)': 'sequence',
  '107|A/V-고 (liệt kê)': 'sequence',
  '110|V-아서/어서 (trình tự)': 'sequence',
  '5|V–고 나서': 'sequence',
  '15|V-기 전에': 'sequence',
  '15|V-(으)ㄴ 후에': 'sequence',
  '7|V-다가': 'sequence',
  '116|V-(으)면서': 'sequence',
  '3|N 동안': 'sequence',
  '17|V-아다/어다 주다': 'sequence',

  // Tương phản
  '107|A/V-지만': 'contrast',
  '10|A-(으)닀, V-는닀, N 인닀 (2)': 'contrast',
  '13|V/A-기는 하지만': 'contrast',

  // Bối cảnh – Dẫn nhập
  '3|A-(으)ㄴ데, V-는데 (1) — Bối cảnh': 'background',
  '3|N 인데 (1)': 'background',
  '9|A-(으)ㄴ데요, V-는데요, N 인데요': 'background',

  // Hứa hẹn – Ý định của người nói
  '116|V-(으)ㄹ게요': 'commit',
  '10|V-(으)ㄹ램요': 'commit',
  '16|V/A-(으)ㄹ 타니까': 'commit',

  // Khả năng
  '116|V-(으)ㄹ 수 있다[없다]': 'ability',
  '2|V-(으)ㄹ 줄 알다 [모르다]': 'ability',
  '112|못 V': 'ability',

  // Phủ định
  '103|안 V': 'negation',
  '2|V/A–지 않다': 'negation',
  '101|N이/가 아닙니다': 'negation',

  // Thì cơ bản
  '103|V-아요/어요': 'tense',
  '105|V-았/었-': 'tense',
  '110|V-(으)ㄹ 거예요': 'tense',

  // Kính ngữ – Trang trọng
  '101|N입니까?, N입니다': 'honorific',
  '107|A/V-습니다/ㅂ니다': 'honorific',
  '109|A/V-(으)시-': 'honorific',
  '109|N(이)세요': 'honorific',

  // Xác nhận – Hỏi nhẹ – Cảm thán
  '108|A/V-네요': 'confirm',
  '112|A/V-지요?, N(이)지요?': 'confirm',
  '9|A-(으)ㄴ가요?, V-나요?, N 인가요?': 'confirm',

  // Đề nghị – Rủ rê – Yêu cầu
  '108|V-(으)ㄹ까요?': 'request',
  '5|V/A–(으)ㄹ까요?': 'request',
  '11|V-는 게 어녕요?': 'request',
  '106|V-(으)세요': 'request',
  '102|N 주세요': 'request',

  // Mong muốn
  '115|V-고 싶다': 'wish',
  '115|V-고 싶어 하다': 'wish',
  '4|A/V–았으면/었으면 좋겠다': 'wish',

  // Thay đổi trạng thái
  '15|A-아지다/어지다': 'change',
  '15|V-게 돼다': 'change',

  // Đang diễn ra – Trạng thái kết quả
  '112|V-고 있다': 'state',
  '9|V-는 중이다': 'state',
  '9|N 중이다': 'state',
  '17|V-아/어 있다': 'state',
  '16|V-아/어 놓다': 'state',
  '8|V-아/어 버리다': 'state',

  // So sánh
  '4|N 보다': 'comparison',
  '12|N 철럼[같이]': 'comparison',
  '10|N 중에(서)': 'comparison',

  // Thời điểm
  '8|V/A–(으)ㄹ 때': 'time',
  '14|V/A-았을/었을 땄': 'time',
  '18|V-(으)ㄴ 지': 'time',
  '105|N에 (thời gian)': 'time',
  '105|날짜와 요일 (N월 N일, 무슨 요일)': 'time',
  '110|시간 (N시 N분)': 'time',

  // Từ… đến…
  '110|N부터 N까지': 'fromTo',
  '113|N에서 N까지': 'fromTo',

  // N(으)로
  '6|N(으)로': 'means',
  '113|N(으)로': 'means',

  // Có / Không có
  '102|N이/가 있어요[없어요]': 'exist',
  '104|N에 있어요[없어요]': 'exist',

  // Trợ từ giới hạn – Nhấn mạnh
  '111|N만': 'limit',
  '9|N 밖에': 'limit',
  '106|N도': 'limit',
  '18|N(이)나 (2)': 'limit',

  // Danh từ hoá – Câu hỏi gián tiếp
  '2|V-는 것': 'nominal',
  '13|V-기(가) A': 'nominal',
  '7|V-는지 알다 [모르다]': 'nominal',
  '7|N 인지 알다 [모르다]': 'nominal',

  // Định ngữ
  '115|V-는 N': 'modifier',
  '2|V–(으)ㄴ N (định ngữ quá khứ)': 'modifier',
  '3|V–(으)ㄹ N (định ngữ tương lai)': 'modifier',
  '114|A-(으)ㄴ N': 'modifier',
  '108|이[그, 저] N': 'modifier',

  // Văn viết – Văn nói thân mật
  '18|A-다, V-ㄴ다/는다': 'style',
  '18|N(이)다': 'style',
  '10|반말': 'style',

  // Bất quy tắc
  '107|\'ㅂ\' 불규칙': 'irregular',
  '108|\'ㄷ\' 불규칙': 'irregular',
  '111|\'ㅡ\' 탈락': 'irregular',
  '114|\'ㄹ\' 탈락': 'irregular',
  "6|'ㄹ' 불규칙 (Bất quy tắc ㄹ)": 'irregular',
  "11|'ㅅ' bất quy tắc": 'irregular',
  "17|'ㅎ' bất quy tắc": 'irregular',

  // Mẫu câu riêng lẻ
  '17|V-(으)ㄹ 뻔하다': 'misc',
  '16|N 대신': 'misc',
  '11|N 마다': 'misc',
  '12|A-(으)ㄴ 편이다, V-는 편이다': 'misc',
  '12|A-게': 'misc',
  '1|N(이)라고 하다': 'misc',

  // Cấu trúc câu & trợ từ sơ cấp
  '101|인사말 (안녕하세요? / 반가워요 / 안녕히 가세요·계세요)': 'basic',
  '101|N은/는 N이에요/예요': 'basic',
  '102|이거는[그거는, 저거는] N이에요/예요': 'basic',
  '102|N하고 N, N과/와 N': 'basic',
  '103|N을/를': 'basic',
  '103|N에서': 'basic',
  '104|여기가 N이에요/예요': 'basic',
  '104|N에 가요[와요]': 'basic',
  '104|N 앞[뒤, 옆]': 'basic',
  '106|N 개[병, 잔, 그릇]': 'basic',
  '106|N이/가 A-아요/어요': 'basic',
  '109|N(의) N': 'basic',
  '109|N을/를 잘하다[잘 못하다, 못하다]': 'basic',
  '113|V-아/어 주다': 'basic',
  '114|N한테[께]': 'basic',
}

export function handbookKey(lesson: number, front: string): string {
  return `${lesson}|${front}`
}
