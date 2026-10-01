// Cẩm nang ngữ pháp (/korean/handbook): gom ngữ pháp TOPIK I + TOPIK II theo NGHĨA/CHỨC NĂNG thay vì theo bài, để tra
// nhanh những mẫu dịch ra cùng 1 nghĩa nhưng cách dùng khác nhau (vd "vì... nên" có 5 mẫu). Trang hiện mỗi nhóm thành
// 1 bảng so sánh: mẫu | điểm phân biệt (`tip` bên dưới) | ví dụ (lấy từ thẻ trong DB). Lý thuyết đầy đủ vẫn nằm ở thẻ
// ngữ pháp trong DB, mở ra ngay tại chỗ hoặc nhảy về đúng bài.
//
// Key của HANDBOOK_ITEMS = `${lesson}|${front}` khớp CHÍNH XÁC với thẻ trong DB (cùng quy ước với grammarTheory.ts),
// kể cả các `front` bị lỗi encoding từ dữ liệu gốc (vd 'V(으)랜고' = -(으)려고). `tip` dùng chính tả chuẩn. Thẻ ngữ pháp
// mới chưa có ở đây sẽ rơi vào nhóm "Chưa phân loại" ở cuối trang (không bị ẩn mất).

import type { HandbookCategory, HandbookGroup, HandbookItem } from '@/lib/handbook/types'

export const HANDBOOK_GROUPS: HandbookGroup[] = [
  { key: 'clause', title: 'Nối hai vế câu' },
  { key: 'mind', title: 'Ý định – Suy nghĩ' },
  { key: 'ending', title: 'Đuôi câu – Cách nói' },
  { key: 'state', title: 'Trạng thái' },
  { key: 'noun', title: 'Danh từ – Trợ từ' },
  { key: 'other', title: 'Khác' },
]

export const HANDBOOK_CATEGORIES: HandbookCategory[] = [
  { key: 'reason', group: 'clause', icon: '🔗', title: 'Lý do – Nguyên nhân', intro: 'Cùng dịch "vì… nên". Khác nhau ở chỗ vế sau có được là mệnh lệnh / rủ rê hay không, và sắc thái.' },
  { key: 'condition', group: 'clause', icon: '🧩', title: 'Điều kiện – Giả định', intro: 'Các cách nói "nếu… thì…".' },
  { key: 'contrast', group: 'clause', icon: '⚖️', title: 'Tương phản (nhưng…)', intro: 'Các cách nói "nhưng", từ trung tính đến mềm mỏng.' },
  { key: 'background', group: 'clause', icon: '💬', title: 'Bối cảnh – Dẫn nhập', intro: '-는데 (nghĩa 1): nêu bối cảnh trước khi nói ý chính. Nghĩa "nhưng" của -는데 nằm ở nhóm Tương phản.' },
  { key: 'sequence', group: 'clause', icon: '⛓️', title: 'Trình tự – Đồng thời', intro: 'Nối 2 hành động: lần lượt, phải xong rồi mới làm, song song hay bị gián đoạn.' },
  { key: 'time', group: 'clause', icon: '⏰', title: 'Thời điểm (khi, lúc)', intro: '"Khi", "lúc", "kể từ khi" và cách nói giờ, ngày tháng.' },

  { key: 'guess', group: 'mind', icon: '🔮', title: 'Suy đoán – Phỏng đoán', intro: 'Đều là "chắc là / hình như". Khác ở căn cứ để đoán và thời của sự việc.' },
  { key: 'purpose', group: 'mind', icon: '🎯', title: 'Mục đích – Ý định', intro: '"Để…" và "định…". Khác ở vị trí trong câu, độ chắc chắn và động từ đi kèm.' },
  { key: 'commit', group: 'mind', icon: '🤝', title: 'Hứa hẹn – Ý muốn', intro: '"Tôi sẽ…". Khác ở chỗ có mang ý hứa với người nghe hay không.' },
  { key: 'wish', group: 'mind', icon: '💭', title: 'Mong muốn', intro: 'Muốn của ai, và điều đó mình có tự quyết được hay không.' },
  { key: 'ability', group: 'mind', icon: '💪', title: 'Khả năng – Năng lực', intro: 'Có thể / không thể, và biết cách làm.' },
  { key: 'permission', group: 'mind', icon: '🚦', title: 'Cho phép – Cấm – Bắt buộc', intro: 'Xin phép, cho phép, cấm đoán và nghĩa vụ.' },
  { key: 'experience', group: 'mind', icon: '🧪', title: 'Thử làm – Kinh nghiệm', intro: '"Thử V" và "đã từng V".' },

  { key: 'request', group: 'ending', icon: '🙋', title: 'Đề nghị – Rủ rê – Yêu cầu', intro: 'Rủ, gợi ý và nhờ / yêu cầu người nghe.' },
  { key: 'confirm', group: 'ending', icon: '❓', title: 'Xác nhận – Hỏi nhẹ – Cảm thán', intro: 'Đuôi câu thể hiện thái độ của người nói.' },
  { key: 'tense', group: 'ending', icon: '🕒', title: 'Thì cơ bản', intro: 'Hiện tại, quá khứ, tương lai.' },
  { key: 'negation', group: 'ending', icon: '🚫', title: 'Phủ định', intro: 'Các cách nói "không". "Không thể" nằm ở nhóm Khả năng.' },
  { key: 'honorific', group: 'ending', icon: '🙏', title: 'Kính ngữ – Trang trọng', intro: 'Trang trọng với người nghe, và tôn trọng người làm chủ ngữ.' },
  { key: 'style', group: 'ending', icon: '✍️', title: 'Văn viết – Văn nói thân mật', intro: 'Đuôi câu dùng khi viết và cách nói suồng sã.' },

  { key: 'state', group: 'state', icon: '📌', title: 'Đang diễn ra – Trạng thái kết quả', intro: '"Đang…": hành động đang làm hay kết quả còn lưu lại.' },
  { key: 'change', group: 'state', icon: '🔄', title: 'Thay đổi trạng thái', intro: '"Trở nên…": sau tính từ hay sau động từ.' },

  { key: 'comparison', group: 'noun', icon: '📏', title: 'So sánh', intro: 'So sánh hơn, giống nhau và nhất.' },
  { key: 'limit', group: 'noun', icon: '🎚️', title: 'Chỉ – Cũng – Tận', intro: 'Trợ từ giới hạn và nhấn mạnh số lượng.' },
  { key: 'means', group: 'noun', icon: '🧭', title: 'N(으)로: phương tiện hay hướng?', intro: 'Cùng hình thức (으)로. Nhìn động từ đi kèm để biết nghĩa.' },
  { key: 'fromTo', group: 'noun', icon: '↔️', title: 'Từ… đến…', intro: 'Thời gian dùng 부터, nơi chốn dùng 에서.' },
  { key: 'exist', group: 'noun', icon: '📍', title: 'Có / Ở đâu', intro: 'Sở hữu, tồn tại và vị trí.' },
  { key: 'nominal', group: 'noun', icon: '📝', title: 'Danh từ hoá – Câu hỏi lồng', intro: 'Biến cụm động từ thành danh từ, hoặc lồng một câu hỏi vào câu.' },
  { key: 'modifier', group: 'noun', icon: '🏷️', title: 'Định ngữ', intro: 'Đặt trước danh từ để bổ nghĩa. Định ngữ động từ chia theo 3 thời.' },
  { key: 'basic', group: 'noun', icon: '🧱', title: 'Câu & trợ từ sơ cấp', intro: 'Nền tảng câu và trợ từ của TOPIK I.' },

  { key: 'irregular', group: 'other', icon: '🔧', title: 'Bất quy tắc – Biến âm', intro: 'Gốc từ biến đổi khi gặp đuôi bắt đầu bằng nguyên âm. Mỗi loại có từ ngoại lệ, xem trong thẻ.' },
  { key: 'misc', group: 'other', icon: '🔹', title: 'Mẫu câu riêng lẻ', intro: 'Không có mẫu cùng nghĩa để so sánh.' },
]

// `${lesson}|${front}` → nhóm + điểm phân biệt. Một mẫu chỉ thuộc đúng 1 nhóm.
export const HANDBOOK_ITEMS: Record<string, HandbookItem> = {
  // Lý do – Nguyên nhân
  '112|A/V-아서/어서 (lý do)': { cat: 'reason', tip: 'Lý do thông thường. ✗ trước mệnh lệnh / rủ rê, ✗ chia quá khứ ở vế trước.' },
  '5|A/V–(으)니까, N(이)니까': { cat: 'reason', tip: 'Dùng được trước mệnh lệnh / rủ rê / đề nghị, chia được quá khứ (했으니까). Hay mang ý chủ quan, thuyết phục.' },
  '6|N(이)라서': { cat: 'reason', tip: 'Bản danh từ của -아서/어서: "vì là N". ✗ trước mệnh lệnh / rủ rê.' },
  '8|N 때문에': { cat: 'reason', tip: 'Sau danh từ: "tại N". Nhấn nguyên nhân cụ thể, hay mang ý tiêu cực. ✗ trước mệnh lệnh.' },
  '13|V/A-기 때문에, N(이)기 때문에': { cat: 'reason', tip: 'Sau động/tính từ: lý do rõ ràng, trang trọng, hay dùng khi viết. ✗ trước mệnh lệnh.' },

  // Điều kiện
  '115|A/V-(으)면': { cat: 'condition', tip: 'Điều kiện / giả định chung nhất.' },
  '7|V-(으)려면': { cat: 'condition', tip: '"Nếu MUỐN V thì…". Vế sau là lời khuyên, yêu cầu.' },
  '6|V-(으)면 되다': { cat: 'condition', tip: '"Chỉ cần V là được": điều kiện tối thiểu là đủ.' },

  // Tương phản
  '107|A/V-지만': { cat: 'contrast', tip: '"Nhưng" trung tính, phổ biến nhất, nói và viết đều được.' },
  '10|A-(으)닀, V-는닀, N 인닀 (2)': { cat: 'contrast', tip: '-는데: "nhưng" mềm, tự nhiên trong hội thoại.' },
  '13|V/A-기는 하지만': { cat: 'contrast', tip: 'Công nhận vế trước rồi mới nói ý ngược: "ngon thì có ngon, nhưng…".' },

  // Bối cảnh – Dẫn nhập
  '3|A-(으)ㄴ데, V-는데 (1) — Bối cảnh': { cat: 'background', tip: 'Giữa câu: nêu bối cảnh rồi hỏi / đề nghị ở vế sau.' },
  '3|N 인데 (1)': { cat: 'background', tip: 'Bản danh từ: "là N, …" rồi nói tiếp.' },
  '9|A-(으)ㄴ데요, V-는데요, N 인데요': { cat: 'background', tip: 'Cuối câu: để ngỏ, chờ người nghe phản hồi, hoặc từ chối khéo.' },

  // Trình tự – Đồng thời
  '105|V-고 (trình tự)': { cat: 'sequence', tip: 'Làm A rồi làm B, hai việc có thể độc lập. Không chia thì ở vế trước.' },
  '107|A/V-고 (liệt kê)': { cat: 'sequence', tip: 'Liệt kê "và": đảo vế không đổi nghĩa, hai vế khác chủ ngữ được.' },
  '110|V-아서/어서 (trình tự)': { cat: 'sequence', tip: 'A là tiền đề của B (가서 만나요 = đến đó rồi gặp ở đó). Cùng chủ ngữ.' },
  '5|V–고 나서': { cat: 'sequence', tip: 'Nhấn A phải XONG hẳn rồi mới làm B.' },
  '15|V-기 전에': { cat: 'sequence', tip: '"Trước khi V". Không chia thì.' },
  '15|V-(으)ㄴ 후에': { cat: 'sequence', tip: '"Sau khi V". Dùng được khi hai vế khác chủ ngữ.' },
  '7|V-다가': { cat: 'sequence', tip: 'Đang làm A thì dừng / chuyển sang B (bị gián đoạn).' },
  '116|V-(으)면서': { cat: 'sequence', tip: 'A và B cùng lúc: "vừa… vừa…". Cùng chủ ngữ.' },
  '3|N 동안': { cat: 'sequence', tip: '"Trong suốt N": nhấn độ dài khoảng thời gian.' },
  '17|V-아다/어다 주다': { cat: 'sequence', tip: 'Làm ở chỗ này rồi mang đến chỗ khác cho ai (사다 주다 = mua mang đến cho).' },

  // Thời điểm
  '8|V/A–(으)ㄹ 때': { cat: 'time', tip: '"Khi V": lúc đang hoặc sắp diễn ra.' },
  '14|V/A-았을/었을 땄': { cat: 'time', tip: '"Khi đã V": việc đã xong, thuộc về quá khứ.' },
  '18|V-(으)ㄴ 지': { cat: 'time', tip: '"Từ khi V đến nay đã…" (한국에 온 지 1년이 됐어요).' },
  '105|N에 (thời gian)': { cat: 'time', tip: '"Vào lúc N". ✗ với 오늘, 어제, 내일, 지금.' },
  '105|날짜와 요일 (N월 N일, 무슨 요일)': { cat: 'time', tip: 'Ngày tháng (số Hán Hàn) và thứ trong tuần.' },
  '110|시간 (N시 N분)': { cat: 'time', tip: 'Giờ đếm bằng số thuần Hàn, phút đếm bằng số Hán Hàn.' },

  // Suy đoán
  '4|A–(으)ㄴ/V-는/N인 것 같다 (hiện tại)': { cat: 'guess', tip: 'Đoán việc ĐANG xảy ra, dựa trên cảm nhận. Nói giảm nhẹ, dùng mọi ngữ cảnh.' },
  '6|V-(으)ㄴ 것 같다 (quá khứ)': { cat: 'guess', tip: 'Đoán việc ĐÃ xảy ra (với động từ).' },
  '7|V/A-(으)ㄹ 것 같다 (tương lai)': { cat: 'guess', tip: 'Đoán việc SẼ xảy ra. Cũng dùng để nêu ý kiến một cách khiêm tốn.' },
  '5|A/V (으)ㄹ 거예요 (suy đoán)': { cat: 'guess', tip: 'Chủ ngữ ngôi 3: suy luận từ thông tin đã biết, chắc chắn hơn 것 같다.' },
  '8|V/A-걨-': { cat: 'guess', tip: '-겠-: đoán ngay tại chỗ dựa trên điều đang thấy (보니까 맛있겠어요).' },
  '12|A-아/어 보이다': { cat: 'guess', tip: 'Chỉ dựa trên vẻ ngoài: "trông có vẻ". Chỉ đi với tính từ.' },
  '13|V/A-(으)ㄹ지 모르겠다': { cat: 'guess', tip: 'Phân vân, không chắc: "không biết có… không".' },

  // Mục đích – Ý định
  '1|V(으)랜고': { cat: 'purpose', tip: '-(으)려고: mục đích trong câu ("để V"). Cùng chủ ngữ, ✗ vế sau là mệnh lệnh / rủ rê.' },
  '116|V-(으)러 가다[오다]': { cat: 'purpose', tip: '"Đi / đến để V": CHỈ đi với 가다, 오다, 다니다. Vế sau dùng được mệnh lệnh.' },
  '113|V-(으)려고 하다': { cat: 'purpose', tip: 'Cuối câu: "định V". Dùng được ở quá khứ (-(으)려고 했어요).' },
  '16|V-(으)ㄹ까 하다': { cat: 'purpose', tip: '"Đang tính V": ý định còn mơ hồ, chỉ dùng cho ngôi thứ nhất.' },
  '11|V-기로 하다': { cat: 'purpose', tip: 'Quyết định / lời hứa đã chốt (thường dùng -기로 했어요).' },

  // Hứa hẹn – Ý muốn
  '116|V-(으)ㄹ게요': { cat: 'commit', tip: 'Hứa / báo quyết định tức thời với người nghe. Chỉ ngôi thứ nhất.' },
  '10|V-(으)ㄹ램요': { cat: 'commit', tip: '-(으)ㄹ래요: ý muốn, lựa chọn của mình. Ở câu hỏi = hỏi ý người nghe (뭐 먹을래요?).' },
  '16|V/A-(으)ㄹ 타니까': { cat: 'commit', tip: '-(으)ㄹ 테니까: "tôi sẽ V1, vậy bạn V2". Ý chí của mình làm lý do cho lời đề nghị.' },

  // Mong muốn
  '115|V-고 싶다': { cat: 'wish', tip: 'Mong muốn của tôi (hoặc hỏi bạn).' },
  '115|V-고 싶어 하다': { cat: 'wish', tip: 'Mong muốn của người thứ ba.' },
  '4|A/V–았으면/었으면 좋겠다': { cat: 'wish', tip: '"Ước gì / mong là": điều mình không tự quyết được.' },

  // Khả năng
  '116|V-(으)ㄹ 수 있다[없다]': { cat: 'ability', tip: 'Có thể / không thể nói chung, do năng lực hoặc hoàn cảnh.' },
  '2|V-(으)ㄹ 줄 알다 [모르다]': { cat: 'ability', tip: 'Biết / không biết CÁCH làm, tức là kỹ năng đã học.' },
  '112|못 V': { cat: 'ability', tip: '"Không thể V" (phủ định ngắn). Khác 안 V = không làm vì không muốn.' },

  // Cho phép – Cấm – Bắt buộc
  '14|V-아도/어도 돼다': { cat: 'permission', tip: 'Xin phép / cho phép: "V có được không?", "V cũng được".' },
  '14|V-(으)면 안 돼다': { cat: 'permission', tip: 'Cấm: "không được V". Hay gặp ở quy định, nội quy.' },
  '111|V-지 마세요': { cat: 'permission', tip: 'Bảo thẳng người nghe "đừng V".' },
  '111|V-아야/어야 되다': { cat: 'permission', tip: 'Bắt buộc: "phải V" (= -아야/어야 하다).' },

  // Thử làm – Kinh nghiệm
  '3|V 아/어 보다': { cat: 'experience', tip: 'Hiện tại: "thử V". Quá khứ (봤어요): "đã từng V".' },
  '114|V-아/어 보세요': { cat: 'experience', tip: 'Lời khuyên "hãy thử V".' },
  '14|V-(으)ㄴ 적(이) 있다[없다]': { cat: 'experience', tip: '"Đã từng / chưa từng": nhấn việc đó có xảy ra hay không.' },

  // Đề nghị – Rủ rê – Yêu cầu
  '108|V-(으)ㄹ까요?': { cat: 'request', tip: 'Rủ / hỏi ý kiến: "…nhé?", để ngỏ cho người nghe từ chối.' },
  '5|V/A–(으)ㄹ까요?': { cat: 'request', tip: 'Thêm nghĩa tự hỏi, phỏng đoán khi chủ ngữ là ngôi 3: "không biết… nhỉ?".' },
  '11|V-는 게 어녕요?': { cat: 'request', tip: '-는 게 어때요?: gợi ý một giải pháp cụ thể ("thử… thì sao?").' },
  '106|V-(으)세요': { cat: 'request', tip: 'Yêu cầu / mời lịch sự: "hãy V".' },
  '102|N 주세요': { cat: 'request', tip: 'Xin vật gì: "cho tôi N".' },

  // Xác nhận – Hỏi nhẹ – Cảm thán
  '108|A/V-네요': { cat: 'confirm', tip: 'Cảm thán khi vừa nhận ra điều gì.' },
  '112|A/V-지요?, N(이)지요?': { cat: 'confirm', tip: 'Hỏi để xác nhận điều đã biết: "…phải không?".' },
  '9|A-(으)ㄴ가요?, V-나요?, N 인가요?': { cat: 'confirm', tip: 'Hỏi lịch sự, nhẹ nhàng hơn -아요/어요?.' },

  // Thì cơ bản
  '103|V-아요/어요': { cat: 'tense', tip: 'Hiện tại: việc đang làm, thói quen.' },
  '105|V-았/었-': { cat: 'tense', tip: 'Quá khứ.' },
  '110|V-(으)ㄹ 거예요': { cat: 'tense', tip: 'Tương lai, dự định (chủ ngữ là tôi / bạn). Với ngôi 3 thì mang nghĩa suy đoán.' },

  // Phủ định
  '103|안 V': { cat: 'negation', tip: 'Phủ định ngắn, dùng khi nói (공부 안 해요).' },
  '2|V/A–지 않다': { cat: 'negation', tip: 'Phủ định dài, trang trọng hơn, gắn thẳng sau gốc từ.' },
  '101|N이/가 아닙니다': { cat: 'negation', tip: '"Không phải là N": phủ định danh từ.' },

  // Kính ngữ – Trang trọng
  '101|N입니까?, N입니다': { cat: 'honorific', tip: 'Đuôi danh từ trang trọng (= 이에요/예요).' },
  '107|A/V-습니다/ㅂ니다': { cat: 'honorific', tip: 'Đuôi câu trang trọng: thuyết trình, tin tức, phỏng vấn.' },
  '109|A/V-(으)시-': { cat: 'honorific', tip: 'Tôn trọng người làm chủ ngữ. Không dùng cho chính mình.' },
  '109|N(이)세요': { cat: 'honorific', tip: 'Kính ngữ của N이에요/예요.' },

  // Văn viết – Văn nói thân mật
  '18|A-다, V-ㄴ다/는다': { cat: 'style', tip: 'Đuôi câu văn viết (báo, nhật ký, bài luận).' },
  '18|N(이)다': { cat: 'style', tip: 'Đuôi văn viết cho danh từ.' },
  '10|반말': { cat: 'style', tip: 'Nói suồng sã với người thân: bỏ 요, xưng 나/너.' },

  // Đang diễn ra – Trạng thái kết quả
  '112|V-고 있다': { cat: 'state', tip: 'Hành động đang diễn ra.' },
  '9|V-는 중이다': { cat: 'state', tip: 'Đang giữa chừng một việc, hay dùng để báo là đang bận.' },
  '9|N 중이다': { cat: 'state', tip: 'Bản danh từ: 회의 중, 통화 중.' },
  '17|V-아/어 있다': { cat: 'state', tip: 'Hành động đã xong, kết quả còn lưu lại (앉아 있다, 열려 있다).' },
  '16|V-아/어 놓다': { cat: 'state', tip: 'Chủ động làm sẵn để dùng sau.' },
  '8|V-아/어 버리다': { cat: 'state', tip: 'Xong hẳn, kèm cảm giác tiếc nuối hoặc nhẹ nhõm.' },

  // Thay đổi trạng thái
  '15|A-아지다/어지다': { cat: 'change', tip: 'Sau tính từ: trạng thái dần thay đổi (더워졌어요).' },
  '15|V-게 돼다': { cat: 'change', tip: 'Sau động từ: thành ra như vậy do hoàn cảnh, không do mình chủ động.' },

  // So sánh
  '4|N 보다': { cat: 'comparison', tip: '"So với N": mốc so sánh hơn / kém.' },
  '12|N 철럼[같이]': { cat: 'comparison', tip: 'N처럼 / N같이: "giống như N".' },
  '10|N 중에(서)': { cat: 'comparison', tip: '"Trong số N", thường đi với 제일 / 가장.' },

  // Chỉ – Cũng – Tận
  '111|N만': { cat: 'limit', tip: '"Chỉ N", trung tính.' },
  '9|N 밖에': { cat: 'limit', tip: '"Chỉ có N": luôn đi với phủ định, mang ý ít ỏi.' },
  '106|N도': { cat: 'limit', tip: '"N cũng".' },
  '18|N(이)나 (2)': { cat: 'limit', tip: '"Tận / những N": nhiều hơn mong đợi.' },

  // N(으)로
  '6|N(으)로': { cat: 'means', tip: 'Phương tiện, cách thức: 비행기로 보내요, 한국어로 말해요.' },
  '113|N(으)로': { cat: 'means', tip: 'Hướng đi: 오른쪽으로 가세요.' },

  // Từ… đến…
  '110|N부터 N까지': { cat: 'fromTo', tip: 'Thời gian, thứ tự (9시부터 5시까지).' },
  '113|N에서 N까지': { cat: 'fromTo', tip: 'Nơi chốn, quãng đường (집에서 학교까지).' },

  // Có / Ở đâu
  '102|N이/가 있어요[없어요]': { cat: 'exist', tip: 'CÓ / không có cái gì (sở hữu, tồn tại).' },
  '104|N에 있어요[없어요]': { cat: 'exist', tip: 'Ở / không ở đâu (vị trí).' },

  // Danh từ hoá – Câu hỏi lồng
  '2|V-는 것': { cat: 'nominal', tip: '"Việc V", làm chủ ngữ hoặc tân ngữ.' },
  '13|V-기(가) A': { cat: 'nominal', tip: 'Đánh giá độ dễ / khó của việc gì: 읽기가 어려워요.' },
  '7|V-는지 알다 [모르다]': { cat: 'nominal', tip: 'Lồng câu hỏi: "biết / không biết là V… không".' },
  '7|N 인지 알다 [모르다]': { cat: 'nominal', tip: 'Bản danh từ: "biết N là gì / bao nhiêu".' },

  // Định ngữ
  '115|V-는 N': { cat: 'modifier', tip: 'Động từ, hiện tại: 먹는 음식.' },
  '2|V–(으)ㄴ N (định ngữ quá khứ)': { cat: 'modifier', tip: 'Động từ, quá khứ: 먹은 음식.' },
  '3|V–(으)ㄹ N (định ngữ tương lai)': { cat: 'modifier', tip: 'Động từ, tương lai / dự định: 먹을 음식.' },
  '114|A-(으)ㄴ N': { cat: 'modifier', tip: 'Tính từ (hiện tại): 예쁜 꽃.' },
  '108|이[그, 저] N': { cat: 'modifier', tip: '"N này / đó / kia".' },

  // Câu & trợ từ sơ cấp
  '101|인사말 (안녕하세요? / 반가워요 / 안녕히 가세요·계세요)': { cat: 'basic', tip: 'Chào gặp mặt, làm quen và tạm biệt.' },
  '101|N은/는 N이에요/예요': { cat: 'basic', tip: 'Câu giới thiệu "N là N".' },
  '102|이거는[그거는, 저거는] N이에요/예요': { cat: 'basic', tip: '"Cái này / đó / kia là N".' },
  '102|N하고 N, N과/와 N': { cat: 'basic', tip: '"N và N": 하고 khi nói, 과/와 khi viết.' },
  '103|N을/를': { cat: 'basic', tip: 'Trợ từ tân ngữ.' },
  '103|N에서': { cat: 'basic', tip: '"Ở N": nơi diễn ra hành động.' },
  '104|여기가 N이에요/예요': { cat: 'basic', tip: '"Đây là (nơi) N".' },
  '104|N에 가요[와요]': { cat: 'basic', tip: '"Đi / đến N".' },
  '104|N 앞[뒤, 옆]': { cat: 'basic', tip: '"Trước / sau / cạnh N".' },
  '106|N 개[병, 잔, 그릇]': { cat: 'basic', tip: 'Đếm đồ vật: tên vật + số thuần Hàn + đơn vị.' },
  '106|N이/가 A-아요/어요': { cat: 'basic', tip: 'Miêu tả: "N thì A".' },
  '109|N(의) N': { cat: 'basic', tip: '"N của N".' },
  '109|N을/를 잘하다[잘 못하다, 못하다]': { cat: 'basic', tip: '"Giỏi / không giỏi N".' },
  '113|V-아/어 주다': { cat: 'basic', tip: '"Làm giúp / làm cho ai".' },
  '114|N한테[께]': { cat: 'basic', tip: '"Cho / với N": người nhận.' },

  // Bất quy tắc
  '107|\'ㅂ\' 불규칙': { cat: 'irregular', tip: 'ㅂ → 우: 덥다 → 더워요.' },
  '108|\'ㄷ\' 불규칙': { cat: 'irregular', tip: 'ㄷ → ㄹ: 듣다 → 들어요.' },
  '111|\'ㅡ\' 탈락': { cat: 'irregular', tip: 'Bỏ ㅡ: 바쁘다 → 바빠요.' },
  '114|\'ㄹ\' 탈락': { cat: 'irregular', tip: 'ㄹ rơi trước ㄴ, ㅂ, ㅅ: 살다 → 사세요.' },
  "6|'ㄹ' 불규칙 (Bất quy tắc ㄹ)": { cat: 'irregular', tip: '르 → ㄹㄹ: 모르다 → 몰라요.' },
  "11|'ㅅ' bất quy tắc": { cat: 'irregular', tip: 'ㅅ bị lược: 낫다 → 나아요.' },
  "17|'ㅎ' bất quy tắc": { cat: 'irregular', tip: 'ㅎ bị lược: 그렇다 → 그래요.' },

  // Mẫu câu riêng lẻ
  '17|V-(으)ㄹ 뻔하다': { cat: 'misc', tip: '"Suýt nữa thì…", luôn chia quá khứ.' },
  '16|N 대신': { cat: 'misc', tip: '"Thay cho N".' },
  '11|N 마다': { cat: 'misc', tip: '"Mỗi N" (주말마다, 사람마다).' },
  '12|A-(으)ㄴ 편이다, V-는 편이다': { cat: 'misc', tip: '"Thuộc dạng…, khá là…": nhận xét tương đối.' },
  '12|A-게': { cat: 'misc', tip: 'Tính từ → trạng từ: 예쁘게, 맛있게.' },
  '1|N(이)라고 하다': { cat: 'misc', tip: '"Được gọi là N": giới thiệu tên.' },
}

export function handbookKey(lesson: number, front: string): string {
  return `${lesson}|${front}`
}
