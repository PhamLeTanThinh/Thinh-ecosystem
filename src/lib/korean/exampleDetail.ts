// Ví dụ minh hoạ có chú thích đầy đủ cho 73 điểm ngữ pháp — key = `${lesson}|${front}` (khớp với
// grammarTheory.ts). Vì nhiều câu ví dụ gốc trong seed.ts bị lỗi encoding (xem ghi chú cuối
// grammarTheory.ts), các câu `ko` ở đây được viết lại SẠCH/ĐÚNG chính tả thay vì lấy nguyên câu gốc,
// để bản dịch và phần chú thích luôn khớp chính xác với câu tiếng Hàn hiển thị.
export interface ExampleDetail {
  ko: string // câu ví dụ tiếng Hàn (đã chuẩn hoá chính tả)
  vi: string // bản dịch tiếng Việt
  vocab: string // giải thích từ vựng đáng chú ý trong câu (rỗng nếu không có từ mới đáng chú ý)
  breakdown: string // cách biến đổi ngữ pháp áp dụng trong câu này
}

export const EXAMPLE_DETAIL: Record<string, ExampleDetail[]> = {
  '1|N(이)라고 하다': [
    { ko: '저는 트엡이라고 합니다.', vi: 'Tôi tên là Tiếp.', vocab: '트엡: tên riêng', breakdown: '트엡 (danh từ, có patchim ㅂ) + 이라고 합니다 → 트엡이라고 합니다' },
    { ko: '여기는 호안끼엠 호수라고 하고 하노이의 유명한 명소입니다.', vi: 'Đây được gọi là hồ Hoàn Kiếm, một địa danh nổi tiếng của Hà Nội.', vocab: '호수: hồ · 명소: địa danh nổi tiếng', breakdown: '호수 (danh từ, không patchim) + 라고 하다 → 호수라고 하고' },
  ],
  '1|V(으)랜고': [
    { ko: '한국 친구들과 이야기하려고 한국어를 공부해요.', vi: 'Tôi học tiếng Hàn để nói chuyện với bạn bè người Hàn.', vocab: '이야기하다: nói chuyện', breakdown: '이야기하다 (동사, không patchim) + 려고 → 이야기하려고' },
    { ko: '내일 아이에게 줄 선물을 사려고 백화점에 가요.', vi: 'Ngày mai tôi đi trung tâm thương mại để mua quà tặng cho con.', vocab: '선물: quà tặng · 백화점: trung tâm thương mại', breakdown: '사다 (동사, không patchim) + 려고 → 사려고' },
  ],

  '2|V-는 것': [
    { ko: '저는 책 읽는 것을 좋아해요.', vi: 'Tôi thích việc đọc sách.', vocab: '', breakdown: '읽다 (동사, có patchim) + 는 것 → 읽는 것' },
    { ko: '한국어 배우는 것은 재미있지만 어려워요.', vi: 'Việc học tiếng Hàn thú vị nhưng khó.', vocab: '', breakdown: '배우다 (동사, không patchim) + 는 것 → 배우는 것' },
  ],
  '2|V-(으)ㄹ 줄 알다 [모르다]': [
    { ko: '민수 씨는 수영할 줄 몰라요.', vi: 'Anh Minsu không biết bơi.', vocab: '수영하다: bơi', breakdown: '수영하다 (không patchim) + ㄹ 줄 모르다 → 수영할 줄 몰라요' },
    { ko: '저는 한국 음식을 만들 줄 알아요.', vi: 'Tôi biết cách làm món ăn Hàn Quốc.', vocab: '만들다: làm, chế biến', breakdown: '만들다 (patchim ㄹ, lược bỏ) + 줄 알다 → 만들 줄 알아요' },
  ],
  '2|V–(으)ㄴ N (định ngữ quá khứ)': [
    { ko: '저는 베트남에서 온 히엔입니다.', vi: 'Tôi là Hiền, đến từ Việt Nam.', vocab: '', breakdown: '오다 (không patchim) + ㄴ N → 온 히엔' },
    { ko: '어제 만든 음식 이름은 퍼입니다.', vi: 'Món ăn tôi làm hôm qua tên là phở.', vocab: '', breakdown: '만들다 (patchim ㄹ, lược bỏ) + ㄴ N → 만든 음식' },
  ],
  '2|V/A–지 않다': [
    { ko: '제 방은 크지 않지만 깨끗하고 좋아요.', vi: 'Phòng tôi không lớn nhưng sạch sẽ và đẹp.', vocab: '깨끗하다: sạch sẽ', breakdown: '크다 (tính từ) + 지 않다 → 크지 않다' },
    { ko: '어제 아파서 학교에 가지 않았어요.', vi: 'Hôm qua tôi bị ốm nên đã không đến trường.', vocab: '아프다: đau, ốm', breakdown: '가다 (동사) + 지 않았어요 (quá khứ) → 가지 않았어요' },
  ],

  '3|V 아/어 보다': [
    { ko: '한국에 가 보고 싶어요.', vi: 'Tôi muốn thử đi Hàn Quốc.', vocab: '', breakdown: '가다 (ㅏ) + 아 보다 → 가 보다 + 고 싶다 → 가 보고 싶어요' },
    { ko: '작년에 저는 처음 한국에 가 봤어요.', vi: 'Năm ngoái tôi đã lần đầu đi Hàn Quốc.', vocab: '작년: năm ngoái', breakdown: '가다 + 아 보다 → 가 보다 → 가 봤어요 (quá khứ, kinh nghiệm)' },
  ],
  '3|N 동안': [
    { ko: '어제 4시간 동안 공부했습니다.', vi: 'Hôm qua tôi đã học liên tục trong 4 tiếng.', vocab: '', breakdown: '4시간 (danh từ chỉ thời lượng) + 동안 → 4시간 동안' },
    { ko: '방학 동안 고향에 다녀왔어요.', vi: 'Trong kỳ nghỉ tôi đã về quê rồi quay lại.', vocab: '방학: kỳ nghỉ · 고향: quê hương', breakdown: '방학 (danh từ) + 동안 → 방학 동안' },
  ],
  '3|A-(으)ㄴ데, V-는데 (1) — Bối cảnh': [
    { ko: '날씨가 더운데 에어컨을 켤까요?', vi: 'Trời đang nóng, hay là bật điều hoà nhỉ?', vocab: '에어컨을 켜다: bật điều hoà', breakdown: '덥다 (tính từ, bất quy tắc ㅂ) + 은데 → 더운데' },
    { ko: '저는 이 책이 없는데 좀 빌려 주세요.', vi: 'Tôi không có cuốn sách này, hãy cho tôi mượn nhé.', vocab: '빌리다: mượn', breakdown: '없다 (luôn dùng 는데) → 없는데' },
  ],
  '3|N 인데 (1)': [
    { ko: '제 친구인데 한국말을 진짜 잘해요.', vi: 'Đây là bạn tôi, bạn ấy nói tiếng Hàn thực sự giỏi.', vocab: '', breakdown: '친구 (danh từ) + 인데 → 친구인데' },
    { ko: '여기는 하노이인데 베트남의 수도입니다.', vi: 'Đây là Hà Nội, thủ đô của Việt Nam.', vocab: '수도: thủ đô', breakdown: '하노이 (danh từ) + 인데 → 하노이인데' },
  ],
  '3|V–(으)ㄹ N (định ngữ tương lai)': [
    { ko: '내일은 만날 시간이 없어요.', vi: 'Ngày mai tôi không có thời gian để gặp.', vocab: '', breakdown: '만나다 (không patchim) + ㄹ N → 만날 시간' },
    { ko: '이 도시락은 점심에 먹을 것입니다.', vi: 'Hộp cơm này là để ăn vào bữa trưa.', vocab: '도시락: cơm hộp', breakdown: '먹다 (patchim) + 을 것 → 먹을 것' },
  ],

  '4|A–(으)ㄴ/V-는/N인 것 같다 (hiện tại)': [
    { ko: '내일 너무 추운 것 같아요.', vi: 'Hình như ngày mai sẽ rất lạnh.', vocab: '', breakdown: '춥다 (tính từ, bất quy tắc ㅂ) + 은 것 같다 → 추운 것 같다' },
    { ko: '지금 밖에 비가 내리는 것 같아요.', vi: 'Hình như bây giờ ngoài trời đang mưa.', vocab: '비가 내리다: mưa rơi', breakdown: '내리다 (동사) + 는 것 같다 → 내리는 것 같다' },
  ],
  '4|N 보다': [
    { ko: '딸기는 사과보다 싸요.', vi: 'Dâu tây rẻ hơn táo.', vocab: '딸기: dâu tây', breakdown: '사과 (danh từ) + 보다 → 사과보다' },
    { ko: '저는 여름보다 겨울을 더 좋아해요.', vi: 'Tôi thích mùa đông hơn mùa hè.', vocab: '여름: mùa hè · 겨울: mùa đông', breakdown: '여름 + 보다 → 여름보다 (kèm 더 nhấn mạnh)' },
  ],
  '4|A/V–았으면/었으면 좋겠다': [
    { ko: '돈이 많았으면 좋겠습니다.', vi: 'Giá mà tôi có nhiều tiền.', vocab: '', breakdown: '많다 (ㅏ) + 았으면 좋겠다 → 많았으면 좋겠다' },
    { ko: '내일 비가 안 왔으면 좋겠어요.', vi: 'Mong là ngày mai trời đừng mưa.', vocab: '', breakdown: '오다 (ㅗ) + 았으면 좋겠다 → 왔으면 좋겠어요' },
  ],

  '5|V/A–(으)ㄹ까요?': [
    { ko: '오늘 저녁에 뭘 먹을까요?', vi: 'Tối nay chúng ta ăn gì nhỉ?', vocab: '', breakdown: '먹다 (patchim) + 을까요 → 먹을까요' },
    { ko: '이번 주말에 집에서 쉴까요?', vi: 'Cuối tuần này hay là nghỉ ở nhà nhỉ?', vocab: '', breakdown: '쉬다 (không patchim) + ㄹ까요 → 쉴까요' },
  ],
  '5|A/V (으)ㄹ 거예요 (suy đoán)': [
    { ko: '이 신발이 민수 씨에게 작을 거예요.', vi: 'Chắc là đôi giày này sẽ nhỏ với anh Minsu.', vocab: '신발: giày', breakdown: '작다 (patchim) + 을 거예요 → 작을 거예요' },
    { ko: '내일부터 날씨가 더울 거예요.', vi: 'Chắc là từ ngày mai trời sẽ nóng.', vocab: '', breakdown: '덥다 (bất quy tắc ㅂ) + ㄹ 거예요 → 더울 거예요' },
  ],
  '5|A/V–(으)니까, N(이)니까': [
    { ko: '오늘은 바쁘니까 내일 만날까요?', vi: 'Hôm nay tôi bận nên hay là mai gặp nhau nhé?', vocab: '', breakdown: '바쁘다 (không patchim) + 니까 → 바쁘니까' },
    { ko: '오늘은 토요일이니까 문을 일찍 닫을 거예요.', vi: 'Hôm nay là thứ Bảy nên cửa hàng sẽ đóng cửa sớm.', vocab: '닫다: đóng', breakdown: '토요일 (danh từ, patchim) + 이니까 → 토요일이니까' },
  ],
  '5|V–고 나서': [
    { ko: '이 책을 다 읽고 나서 친구에게 빌려 줄 거예요.', vi: 'Đọc xong cuốn sách này rồi tôi sẽ cho bạn mượn.', vocab: '', breakdown: '읽다 (동사) + 고 나서 → 읽고 나서' },
    { ko: '밥을 먹고 나서 숙제를 해야 돼요.', vi: 'Ăn cơm xong rồi tôi phải làm bài tập.', vocab: '숙제: bài tập', breakdown: '먹다 + 고 나서 → 먹고 나서' },
  ],

  '6|N(으)로': [
    { ko: '매일 버스로 회사에 가요.', vi: 'Hằng ngày tôi đi làm bằng xe buýt.', vocab: '', breakdown: '버스 (danh từ, không patchim) + 로 → 버스로' },
    { ko: '저는 스마트폰으로 사진을 찍는 것을 좋아해요.', vi: 'Tôi thích chụp ảnh bằng điện thoại thông minh.', vocab: '스마트폰: điện thoại thông minh', breakdown: '스마트폰 (patchim ㄴ) + 으로 → 스마트폰으로' },
  ],
  '6|N(이)라서': [
    { ko: '내일은 주말이라서 이 식당이 문을 열지 않아요.', vi: 'Vì ngày mai là cuối tuần nên nhà hàng này không mở cửa.', vocab: '', breakdown: '주말 (patchim ㄹ) + 이라서 → 주말이라서' },
    { ko: '저는 외국인이라서 한국 문화를 잘 몰라요.', vi: 'Vì tôi là người nước ngoài nên chưa hiểu rõ văn hoá Hàn Quốc.', vocab: '', breakdown: '외국인 (patchim ㄴ) + 이라서 → 외국인이라서' },
  ],
  "6|'ㄹ' 불규칙 (Bất quy tắc ㄹ)": [
    { ko: '한국어를 몰라서 불편해요.', vi: 'Vì không biết tiếng Hàn nên bất tiện.', vocab: '불편하다: bất tiện', breakdown: '모르다 (르 bất quy tắc, nguyên âm trước 르 là ㅗ) → 몰라서' },
    { ko: '우리 누나하고 저는 성격이 아주 달라요.', vi: 'Tính cách của chị tôi và tôi rất khác nhau.', vocab: '성격: tính cách', breakdown: '다르다 (르 bất quy tắc, nguyên âm trước 르 là ㅏ) → 달라요' },
  ],
  '6|V-(으)면 되다': [
    { ko: '이 서류에 이름만 쓰면 돼요.', vi: 'Chỉ cần viết tên vào giấy tờ này là được.', vocab: '서류: giấy tờ', breakdown: '쓰다 (không patchim) + 면 되다 → 쓰면 돼요' },
    { ko: '지금 빨리 출발하면 돼요.', vi: 'Chỉ cần xuất phát ngay bây giờ là được.', vocab: '출발하다: xuất phát', breakdown: '출발하다 (không patchim) + 면 되다 → 출발하면 돼요' },
  ],
  '6|V-(으)ㄴ 것 같다 (quá khứ)': [
    { ko: '수업이 끝난 것 같아요.', vi: 'Hình như tiết học đã kết thúc rồi.', vocab: '끝나다: kết thúc', breakdown: '끝나다 (không patchim) + ㄴ 것 같다 → 끝난 것 같다' },
    { ko: '밖에 비가 온 것 같아요.', vi: 'Hình như bên ngoài đã mưa (còn dấu vết).', vocab: '', breakdown: '오다 (không patchim) + ㄴ 것 같다 → 온 것 같다' },
  ],

  '7|V/A-(으)ㄹ 것 같다 (tương lai)': [
    { ko: '이 옷은 좀 클 것 같아요.', vi: 'Bộ quần áo này chắc sẽ hơi rộng.', vocab: '', breakdown: '크다 (không patchim) + ㄹ 것 같다 → 클 것 같다' },
    { ko: '회의가 많아서 다음 주부터 엄청 바쁠 것 같아요.', vi: 'Vì có nhiều cuộc họp nên chắc từ tuần sau tôi sẽ rất bận.', vocab: '회의: cuộc họp', breakdown: '바쁘다 (không patchim) + ㄹ 것 같다 → 바쁠 것 같다' },
  ],
  '7|V-는지 알다 [모르다]': [
    { ko: '유진 씨가 무슨 음식을 좋아하는지 아세요?', vi: 'Bạn có biết chị Yujin thích món ăn gì không?', vocab: '', breakdown: '좋아하다 (동사) + 는지 알다 → 좋아하는지 아세요' },
    { ko: '이 기차가 몇 시에 출발하는지 몰라요.', vi: 'Tôi không biết chuyến tàu này mấy giờ khởi hành.', vocab: '기차: tàu hoả · 출발하다: khởi hành', breakdown: '출발하다 + 는지 모르다 → 출발하는지 몰라요' },
  ],
  '7|N 인지 알다 [모르다]': [
    { ko: '박물관 입장료가 얼마인지 잘 모르겠어요.', vi: 'Tôi không rõ vé vào bảo tàng bao nhiêu tiền.', vocab: '입장료: vé vào cửa', breakdown: '얼마 (danh từ) + 인지 모르다 → 얼마인지 모르겠어요' },
    { ko: '저분이 누구인지 아세요?', vi: 'Bạn có biết vị đó là ai không?', vocab: '저분: vị đó (kính ngữ)', breakdown: '누구 (danh từ) + 인지 알다 → 누구인지 아세요' },
  ],
  '7|V-(으)려면': [
    { ko: '한국말을 잘하려면 매일 연습하세요.', vi: 'Nếu muốn giỏi tiếng Hàn thì hãy luyện tập mỗi ngày.', vocab: '연습하다: luyện tập', breakdown: '잘하다 (không patchim) + 려면 → 잘하려면' },
    { ko: '기차를 타려면 지금 출발해야 해요.', vi: 'Nếu muốn bắt kịp tàu thì phải xuất phát ngay bây giờ.', vocab: '', breakdown: '타다 (không patchim) + 려면 → 타려면' },
  ],
  '7|V-다가': [
    { ko: '일을 하다가 밖으로 나갔어요.', vi: 'Đang làm việc thì (tôi) đi ra ngoài.', vocab: '', breakdown: '하다 + 다가 → 하다가' },
    { ko: '공부하다가 너무 졸려서 잠깐 잤어요.', vi: 'Đang học bài thì buồn ngủ quá nên tôi ngủ một chút.', vocab: '졸리다: buồn ngủ', breakdown: '공부하다 + 다가 → 공부하다가' },
  ],

  '8|V/A-걨-': [
    { ko: '월급을 받아서 기분이 좋겠어요.', vi: 'Chắc là (bạn) vui vì vừa nhận lương.', vocab: '월급: lương', breakdown: '좋다 + 겠어요 → 좋겠어요' },
    { ko: '오후에 비가 오겠어요.', vi: 'Chiều nay chắc trời sẽ mưa.', vocab: '', breakdown: '오다 + 겠어요 → 오겠어요' },
  ],
  '8|N 때문에': [
    { ko: '날씨 때문에 비행기가 출발하지 못했어요.', vi: 'Vì thời tiết nên máy bay đã không thể cất cánh.', vocab: '비행기: máy bay', breakdown: '날씨 (danh từ) + 때문에 → 날씨 때문에' },
    { ko: '감기 때문에 회사에 못 갔어요.', vi: 'Vì bị cảm nên tôi đã không thể đi làm.', vocab: '감기: cảm cúm', breakdown: '감기 + 때문에 → 감기 때문에' },
  ],
  '8|V-아/어 버리다': [
    { ko: '배가 너무 고파서 남겨 준 음식을 다 먹어 버렸어요.', vi: 'Vì quá đói nên tôi đã lỡ ăn hết phần đồ ăn để dành.', vocab: '남기다: để dành lại', breakdown: '먹다 (ㅓ) + 어 버리다 → 먹어 버렸어요' },
    { ko: '지갑을 잃어버렸어요.', vi: 'Tôi đã đánh mất ví rồi.', vocab: '지갑: ví tiền', breakdown: '잃다 (ㅣ) + 어 버리다 → 잃어버렸어요' },
  ],
  '8|V/A–(으)ㄹ 때': [
    { ko: '스트레스를 받을 때 쇼핑하거나 산책하는 것이 좋아요.', vi: 'Khi bị stress thì đi mua sắm hoặc đi dạo là tốt.', vocab: '스트레스를 받다: bị stress · 산책하다: đi dạo', breakdown: '받다 (patchim) + 을 때 → 받을 때' },
    { ko: '밥을 먹을 때는 휴대폰을 보지 마세요.', vi: 'Khi ăn cơm thì đừng nhìn điện thoại.', vocab: '휴대폰: điện thoại di động', breakdown: '먹다 (patchim) + 을 때 → 먹을 때' },
  ],

  '9|A-(으)ㄴ데요, V-는데요, N 인데요': [
    { ko: '이건 예쁜데 너무 비싼데요.', vi: 'Cái này đẹp đấy nhưng mà đắt quá.', vocab: '', breakdown: '비싸다 (không patchim) + ㄴ데요 → 비싼데요' },
    { ko: '저는 지금 회사인데요.', vi: 'Tôi hiện đang ở công ty đây.', vocab: '', breakdown: '회사 (danh từ) + 인데요 → 회사인데요' },
  ],
  '9|V-는 중이다': [
    { ko: '지금 수업 듣는 중이니까 통화가 불가능합니다.', vi: 'Bây giờ tôi đang trong giờ học nên không thể gọi điện.', vocab: '통화: gọi điện thoại · 불가능하다: không thể', breakdown: '듣다 (동사) + 는 중이다 → 듣는 중이다' },
    { ko: '지금 밥을 먹는 중이에요.', vi: 'Bây giờ tôi đang ăn cơm.', vocab: '', breakdown: '먹다 + 는 중이다 → 먹는 중이에요' },
  ],
  '9|N 중이다': [
    { ko: '마이 씨는 휴가 중이라서 회사에 안 계세요.', vi: 'Chị Mai đang trong kỳ nghỉ phép nên không có ở công ty.', vocab: '휴가: nghỉ phép', breakdown: '휴가 (danh từ) + 중이다 → 휴가 중이다' },
    { ko: '지금 회의 중이니까 나중에 다시 전화하세요.', vi: 'Bây giờ đang họp nên lát nữa hãy gọi lại.', vocab: '회의: cuộc họp', breakdown: '회의 + 중이다 → 회의 중이다' },
  ],
  '9|A-(으)ㄴ가요?, V-나요?, N 인가요?': [
    { ko: '이 음식은 어느 나라 음식인가요?', vi: 'Món ăn này là món ăn của nước nào vậy?', vocab: '', breakdown: '음식 (danh từ) + 인가요 → 음식인가요' },
    { ko: '이 옷이 저한테 잘 어울리나요?', vi: 'Bộ quần áo này có hợp với tôi không nhỉ?', vocab: '어울리다: hợp, phù hợp', breakdown: '어울리다 (동사) + 나요 → 어울리나요' },
  ],
  '9|N 밖에': [
    { ko: '지갑에 만 원밖에 없어요.', vi: 'Trong ví chỉ có mười nghìn won thôi.', vocab: '지갑: ví tiền', breakdown: '만 원 (danh từ) + 밖에 없다 → 만 원밖에 없어요' },
    { ko: '우리 반에 외국인 학생이 한 명밖에 없어요.', vi: 'Trong lớp chúng tôi chỉ có một sinh viên nước ngoài thôi.', vocab: '', breakdown: '한 명 + 밖에 없다 → 한 명밖에 없어요' },
  ],

  '10|N 중에(서)': [
    { ko: '저는 운동 중에서 야구를 가장 좋아해요.', vi: 'Trong các môn thể thao, tôi thích bóng chày nhất.', vocab: '야구: bóng chày', breakdown: '운동 (danh từ số nhiều) + 중에서 → 운동 중에서' },
    { ko: '지금까지 본 영화 중에서 뭐가 제일 재미있었어요?', vi: 'Trong số các phim bạn đã xem đến giờ, phim nào thú vị nhất?', vocab: '', breakdown: '영화 (danh từ, tập hợp) + 중에서 → 영화 중에서' },
  ],
  '10|반말': [
    { ko: '밥 먹었어? 오늘 뭐 해?', vi: 'Ăn cơm chưa? Hôm nay làm gì thế?', vocab: '', breakdown: '먹었어요 (해요체) → bỏ 요 → 먹었어 (반말)' },
    { ko: '나는 학교 가야 돼. 이따가 전화할게.', vi: 'Tớ phải đi học đây. Lát nữa tớ sẽ gọi điện.', vocab: '', breakdown: '저는 → 나는; 전화할게요 → 전화할게 (bỏ 요)' },
  ],
  '10|V-(으)ㄹ램요': [
    { ko: '제가 문을 닫을게요.', vi: 'Để tôi đóng cửa cho.', vocab: '', breakdown: '닫다 (patchim) + 을게요 → 닫을게요' },
    { ko: '이따가 다시 전화할게요.', vi: 'Lát nữa tôi sẽ gọi lại.', vocab: '이따가: lát nữa', breakdown: '전화하다 (không patchim) + ㄹ게요 → 전화할게요' },
  ],
  '10|A-(으)닀, V-는닀, N 인닀 (2)': [
    { ko: '이 꽃이 예쁜데 향이 안 좋아요.', vi: 'Bông hoa này đẹp nhưng mùi không thơm.', vocab: '향: hương thơm', breakdown: '예쁘다 (không patchim) + ㄴ데 → 예쁜데' },
    { ko: '열심히 일을 했는데 월급이 오르지 않았어요.', vi: 'Tôi đã làm việc chăm chỉ nhưng lương không tăng.', vocab: '월급이 오르다: lương tăng', breakdown: '하다 + 았는데 (quá khứ) → 했는데' },
  ],

  "11|'ㅅ' bất quy tắc": [
    { ko: '감기가 빨리 나았으면 좋겠어요.', vi: 'Mong là cảm cúm mau khỏi.', vocab: '', breakdown: '낫다 (ㅅ bất quy tắc) + 아으면 → 나으면 → 나았으면' },
    { ko: '밤에 라면을 먹어서 아침에 얼굴이 좀 부은 것 같아요.', vi: 'Vì tối ăn mì gói nên sáng nay mặt tôi có vẻ hơi sưng.', vocab: '라면: mì gói · 얼굴: khuôn mặt', breakdown: '붓다 (ㅅ bất quy tắc) + 은 것 같다 → 부은 것 같다' },
  ],
  '11|N 마다': [
    { ko: '사람마다 성격이 달라요.', vi: 'Mỗi người mỗi tính cách khác nhau.', vocab: '', breakdown: '사람 (danh từ) + 마다 → 사람마다' },
    { ko: '40분마다 버스가 와요.', vi: 'Cứ mỗi 40 phút xe buýt lại đến.', vocab: '', breakdown: '40분 (danh từ chỉ thời lượng) + 마다 → 40분마다' },
  ],
  '11|V-는 게 어녕요?': [
    { ko: '여행 가고 싶으면 제주도로 가는 게 어때요?', vi: 'Nếu muốn đi du lịch thì đi đảo Jeju thì thế nào?', vocab: '제주도: đảo Jeju', breakdown: '가다 (동사) + 는 게 어때요 → 가는 게 어때요' },
    { ko: '길이 막히는데 지하철을 타는 게 어때요?', vi: 'Đường đang tắc, hay là đi tàu điện ngầm thì sao?', vocab: '길이 막히다: tắc đường', breakdown: '타다 + 는 게 어때요 → 타는 게 어때요' },
  ],
  '11|V-기로 하다': [
    { ko: '주말에 친구를 만나기로 했어요.', vi: 'Tôi đã hẹn gặp bạn vào cuối tuần.', vocab: '', breakdown: '만나다 (동사) + 기로 하다 → 만나기로 했어요' },
    { ko: '내일 민수 씨와 저녁을 먹기로 했어요.', vi: 'Tôi đã hẹn ăn tối cùng anh Minsu vào ngày mai.', vocab: '', breakdown: '먹다 + 기로 하다 → 먹기로 했어요' },
  ],

  '12|A-아/어 보이다': [
    { ko: '그 가방 비싸 보이는데요.', vi: 'Cái túi đó trông có vẻ đắt đấy.', vocab: '가방: túi xách', breakdown: '비싸다 (ㅏ) + 아 보이다 → 비싸 보이다' },
    { ko: '요즘은 건강해 보이네요. 운동 열심히 했어요?', vi: 'Dạo này trông bạn có vẻ khoẻ mạnh nhỉ. Bạn tập thể dục chăm chỉ à?', vocab: '건강하다: khoẻ mạnh', breakdown: '건강하다 (하다) + 해 보이다 → 건강해 보이다' },
  ],
  '12|N 철럼[같이]': [
    { ko: '민수 씨는 가수처럼 노래를 잘해요.', vi: 'Anh Minsu hát hay như ca sĩ vậy.', vocab: '가수: ca sĩ', breakdown: '가수 (danh từ) + 처럼 → 가수처럼' },
    { ko: '하루 종일 밥을 못 먹은 것처럼 배가 고파요.', vi: 'Tôi đói bụng như thể cả ngày chưa được ăn cơm vậy.', vocab: '하루 종일: cả ngày', breakdown: '먹은 것 (mệnh đề) + 처럼 → 먹은 것처럼' },
  ],
  '12|A-(으)ㄴ 편이다, V-는 편이다': [
    { ko: '제 동생은 좀 마른 편이에요.', vi: 'Em tôi thuộc dạng hơi gầy.', vocab: '마르다: gầy', breakdown: '마르다 (không patchim) + ㄴ 편이다 → 마른 편이다' },
    { ko: '저는 매운 음식을 잘 먹는 편이에요.', vi: 'Tôi thuộc dạng ăn cay khá tốt.', vocab: '', breakdown: '먹다 (동사) + 는 편이다 → 먹는 편이다' },
  ],
  '12|A-게': [
    { ko: '오늘 데이트가 있어서 예쁘게 입었어요.', vi: 'Hôm nay có hẹn hò nên tôi đã ăn mặc đẹp.', vocab: '데이트: hẹn hò', breakdown: '예쁘다 (tính từ) + 게 → 예쁘게' },
    { ko: '주말에 친구들과 재미있게 놀았어요.', vi: 'Cuối tuần tôi đã chơi vui vẻ với bạn bè.', vocab: '', breakdown: '재미있다 + 게 → 재미있게' },
  ],

  '13|V/A-(으)ㄹ지 모르겠다': [
    { ko: '친구에게 선물을 샀는데 좋아할지 모르겠어요.', vi: 'Tôi đã mua quà cho bạn nhưng không biết bạn ấy có thích hay không.', vocab: '', breakdown: '좋아하다 (không patchim) + ㄹ지 모르겠다 → 좋아할지 모르겠다' },
    { ko: '담배를 끊고 싶은데 끊을 수 있을지 모르겠어요.', vi: 'Tôi muốn bỏ thuốc lá nhưng không biết có bỏ được hay không.', vocab: '담배를 끊다: bỏ thuốc lá', breakdown: '있다 + 을지 모르겠다 → 있을지 모르겠다' },
  ],
  '13|V/A-기는 하지만': [
    { ko: '이 식당은 음식이 맛있기는 하지만 가격이 비싸요.', vi: 'Nhà hàng này món ăn ngon thì có ngon thật, nhưng giá đắt.', vocab: '', breakdown: '맛있다 + 기는 하지만 → 맛있기는 하지만' },
    { ko: '오늘 아침을 먹기는 했지만 아직 배가 고파요.', vi: 'Sáng nay tôi có ăn sáng thật, nhưng vẫn còn đói.', vocab: '', breakdown: '먹다 + 기는 했지만 (quá khứ) → 먹기는 했지만' },
  ],
  '13|V/A-기 때문에, N(이)기 때문에': [
    { ko: '집에서 학교까지 멀기 때문에 일찍 나와야 해요.', vi: 'Vì từ nhà đến trường xa nên tôi phải ra khỏi nhà sớm.', vocab: '', breakdown: '멀다 (tính từ) + 기 때문에 → 멀기 때문에' },
    { ko: '오늘은 휴일이기 때문에 시간이 많아요.', vi: 'Vì hôm nay là ngày nghỉ nên tôi có nhiều thời gian.', vocab: '휴일: ngày nghỉ', breakdown: '휴일 (danh từ) + 이기 때문에 → 휴일이기 때문에' },
  ],
  '13|V-기(가) A': [
    { ko: '주변에 시장도 있고 지하철역도 가까워서 살기 편해요.', vi: 'Xung quanh có chợ và ga tàu điện ngầm gần nên sống rất tiện.', vocab: '지하철역: ga tàu điện ngầm', breakdown: '살다 (동사) + 기(가) 편하다 → 살기 편해요' },
    { ko: '이 음식은 매워서 먹기가 좋아요.', vi: 'Món này cay nên ăn rất hợp.', vocab: '', breakdown: '먹다 + 기가 좋다 → 먹기가 좋아요' },
  ],

  '14|V-(으)ㄴ 적(이) 있다[없다]': [
    { ko: '저는 전에 한국에 가 본 적이 있어요.', vi: 'Trước đây tôi đã từng đi Hàn Quốc.', vocab: '', breakdown: '가 보다 (동사) + ㄴ 적이 있다 → 가 본 적이 있다' },
    { ko: '예전에 이 책을 읽은 적이 있어요.', vi: 'Trước đây tôi đã từng đọc cuốn sách này.', vocab: '예전에: trước đây', breakdown: '읽다 (patchim) + 은 적이 있다 → 읽은 적이 있다' },
  ],
  '14|V/A-았을/었을 땄': [
    { ko: '어렸을 때는 고개를 숙여서 인사해야 돼요.', vi: 'Khi còn nhỏ (ở Hàn) phải cúi đầu chào.', vocab: '고개를 숙이다: cúi đầu', breakdown: '어리다 (ㅣ) + 었을 때 → 어렸을 때' },
    { ko: '학생이었을 때 한국에 와 본 적이 있어요.', vi: 'Khi (tôi) còn là học sinh, tôi đã từng đến Hàn Quốc.', vocab: '', breakdown: '학생이다 + 었을 때 → 학생이었을 때' },
  ],
  '14|V-아도/어도 돼다': [
    { ko: '5시니까 이제 가도 돼요.', vi: 'Vì đã 5 giờ rồi nên bây giờ (bạn) về cũng được.', vocab: '', breakdown: '가다 (ㅏ) + 아도 되다 → 가도 돼요' },
    { ko: '숙제를 내일 내도 돼요?', vi: 'Bài tập nộp vào ngày mai có được không?', vocab: '', breakdown: '내다 (ㅐ) + 아도 되다 → 내도 돼요' },
  ],
  '14|V-(으)면 안 돼다': [
    { ko: '여기에서는 담배를 피우면 안 됩니다.', vi: 'Ở đây không được hút thuốc.', vocab: '담배를 피우다: hút thuốc', breakdown: '피우다 (không patchim) + 면 안 되다 → 피우면 안 됩니다' },
    { ko: '교실에서 음식을 먹으면 안 됩니다.', vi: 'Trong lớp học không được ăn uống.', vocab: '', breakdown: '먹다 (patchim) + 으면 안 되다 → 먹으면 안 됩니다' },
  ],

  '15|A-아지다/어지다': [
    { ko: '과일 값이 많이 비싸졌어요.', vi: 'Giá trái cây đã trở nên đắt hơn nhiều.', vocab: '과일 값: giá trái cây', breakdown: '비싸다 (ㅏ) + 아지다 → 비싸지다 → 비싸졌어요' },
    { ko: '날씨가 점점 더워지고 있어요.', vi: 'Thời tiết đang ngày càng trở nên nóng hơn.', vocab: '점점: dần dần', breakdown: '덥다 (bất quy tắc ㅂ) + 어지다 → 더워지다' },
  ],
  '15|V-게 돼다': [
    { ko: '한국 노래를 좋아해서 한국어를 배우게 되었어요.', vi: 'Vì thích nhạc Hàn nên tôi đã (dần) học tiếng Hàn.', vocab: '', breakdown: '배우다 (동사) + 게 되다 → 배우게 되었어요' },
    { ko: '다음 달부터 회사 일로 출장 가게 됐어요.', vi: 'Từ tháng sau tôi sẽ phải đi công tác vì việc công ty.', vocab: '출장: công tác', breakdown: '가다 + 게 되다 → 가게 됐어요' },
  ],
  '15|V-기 전에': [
    { ko: '고향에 돌아가기 전에 부산 여행을 할 거예요.', vi: 'Trước khi về quê tôi sẽ đi du lịch Busan.', vocab: '돌아가다: quay về', breakdown: '돌아가다 (동사) + 기 전에 → 돌아가기 전에' },
    { ko: '밥을 먹기 전에 손을 씻으세요.', vi: 'Trước khi ăn cơm hãy rửa tay.', vocab: '', breakdown: '먹다 + 기 전에 → 먹기 전에' },
  ],
  '15|V-(으)ㄴ 후에': [
    { ko: '숙제부터 한 후에 놀아요.', vi: 'Làm bài tập xong rồi hãy chơi nhé.', vocab: '', breakdown: '하다 (không patchim) + ㄴ 후에 → 한 후에' },
    { ko: '저는 아침을 먹은 후에 커피를 마셔요.', vi: 'Sau khi ăn sáng tôi uống cà phê.', vocab: '', breakdown: '먹다 (patchim) + 은 후에 → 먹은 후에' },
  ],

  '16|V-아/어 놓다': [
    { ko: '동생에게 주려고 가방을 사 놓았어요.', vi: 'Tôi đã mua sẵn túi xách để tặng cho em.', vocab: '', breakdown: '사다 (ㅏ) + 아 놓다 → 사 놓았어요' },
    { ko: '제가 미리 예약해 놓았으니까 걱정하지 마세요.', vi: 'Tôi đã đặt chỗ trước sẵn rồi nên đừng lo lắng.', vocab: '예약하다: đặt chỗ · 미리: trước', breakdown: '예약하다 (하다) + 해 놓다 → 예약해 놓았으니까' },
  ],
  '16|N 대신': [
    { ko: '제가 아파서 친구가 저 대신 운전을 했어요.', vi: 'Vì tôi bị ốm nên bạn tôi đã lái xe thay tôi.', vocab: '운전하다: lái xe', breakdown: '저 (danh từ) + 대신 → 저 대신' },
    { ko: '시간이 없어서 밥 대신 우유만 한 잔 마셨어요.', vi: 'Vì không có thời gian nên thay vì ăn cơm tôi chỉ uống một ly sữa.', vocab: '', breakdown: '밥 (danh từ) + 대신 → 밥 대신' },
  ],
  '16|V-(으)ㄹ까 하다': [
    { ko: '이번 휴가 때 부모님과 여행 갈까 해요.', vi: 'Kỳ nghỉ này tôi đang định đi du lịch cùng bố mẹ.', vocab: '', breakdown: '가다 (không patchim) + ㄹ까 하다 → 갈까 해요' },
    { ko: '오늘 저녁에 한식을 먹을까 하는데 같이 먹을래요?', vi: 'Tối nay tôi đang định ăn món Hàn, bạn ăn cùng không?', vocab: '한식: món ăn Hàn Quốc', breakdown: '먹다 (patchim) + 을까 하다 → 먹을까 하다' },
  ],
  '16|V/A-(으)ㄹ 타니까': [
    { ko: '제가 곧 도착할 테니까 조금만 기다리세요.', vi: 'Tôi sẽ đến ngay bây giờ nên (bạn) đợi một chút nhé.', vocab: '', breakdown: '도착하다 (không patchim) + ㄹ 테니까 → 도착할 테니까' },
    { ko: '제가 밥을 할 테니까 이따가 식사 후에 설거지하세요.', vi: 'Tôi sẽ nấu cơm, vậy nên lát ăn xong hãy rửa bát nhé.', vocab: '설거지하다: rửa bát', breakdown: '하다 (không patchim) + ㄹ 테니까 → 할 테니까' },
  ],

  '17|V-아다/어다 주다': [
    { ko: '고장 난 컴퓨터를 고쳐다 줬어요.', vi: 'Tôi đã (mang đi) sửa máy tính bị hỏng rồi mang về cho.', vocab: '고장 나다: bị hỏng', breakdown: '고치다 (ㅣ) + 어다 주다 → 고쳐다 줬어요' },
    { ko: '아이를 학교에 데려다 주고 왔어요.', vi: 'Tôi đã đưa con đến tận trường rồi mới về.', vocab: '', breakdown: '데리다 (đặc biệt) + 어다 주다 → 데려다 주다' },
  ],
  '17|V-(으)ㄹ 뻔하다': [
    { ko: '학교에 오다가 사고가 날 뻔했어요.', vi: 'Trên đường đến trường suýt nữa xảy ra tai nạn.', vocab: '사고가 나다: xảy ra tai nạn', breakdown: '나다 (không patchim) + ㄹ 뻔하다 → 날 뻔했어요' },
    { ko: '늦게 일어나서 약속에 늦을 뻔했어요.', vi: 'Vì dậy muộn nên tôi suýt nữa trễ hẹn.', vocab: '', breakdown: '늦다 (patchim) + 을 뻔하다 → 늦을 뻔했어요' },
  ],
  "17|'ㅎ' bất quy tắc": [
    { ko: '한국 사람의 머리 색깔은 까매요.', vi: 'Màu tóc của người Hàn Quốc là màu đen.', vocab: '머리 색깔: màu tóc', breakdown: '까맣다 (ㅎ bất quy tắc) + 아요 → 까매요' },
    { ko: '눈이 많이 와서 밖이 하얘요.', vi: 'Vì tuyết rơi nhiều nên bên ngoài trắng xoá.', vocab: '눈이 오다: tuyết rơi', breakdown: '하얗다 (ㅎ bất quy tắc) + 아요 → 하얘요' },
  ],
  '17|V-아/어 있다': [
    { ko: '친구가 교통사고가 나서 지금 병원에 입원해 있어요.', vi: 'Bạn tôi bị tai nạn giao thông nên hiện đang nằm viện.', vocab: '교통사고: tai nạn giao thông · 입원하다: nhập viện', breakdown: '입원하다 (하다) + 해 있다 → 입원해 있어요' },
    { ko: '문이 열려 있어요.', vi: 'Cửa đang ở trạng thái mở.', vocab: '', breakdown: '열리다 (ㅕ) + 어 있다 → 열려 있어요' },
  ],

  '18|V-(으)ㄴ 지': [
    { ko: '대학교를 졸업한 지 일 년이 되었어요.', vi: 'Đã một năm kể từ khi tôi tốt nghiệp đại học.', vocab: '졸업하다: tốt nghiệp', breakdown: '졸업하다 (không patchim) + ㄴ 지 → 졸업한 지' },
    { ko: '기숙사에 산 지 얼마나 됐어요?', vi: 'Bạn đã sống ở ký túc xá được bao lâu rồi?', vocab: '기숙사: ký túc xá', breakdown: '살다 (patchim ㄹ, lược bỏ) + ㄴ 지 → 산 지' },
  ],
  '18|N(이)나 (2)': [
    { ko: '우리 가족은 아홉 명이나 있어요.', vi: 'Gia đình tôi có tận chín người.', vocab: '', breakdown: '아홉 명 (số từ) + 이나 → 아홉 명이나' },
    { ko: '민영 씨는 강아지 다섯 마리나 키워요.', vi: 'Chị Minyoung nuôi tận năm con chó.', vocab: '강아지: chó con · 키우다: nuôi', breakdown: '다섯 마리 (số từ) + 나 → 다섯 마리나' },
  ],
  '18|A-다, V-ㄴ다/는다': [
    { ko: '밤에 바람이 불어서 아주 시원하다.', vi: 'Ban đêm gió thổi nên rất mát mẻ.', vocab: '바람이 불다: gió thổi', breakdown: '시원하다 (tính từ) + 다 → 시원하다' },
    { ko: '나는 자기 전에 책을 읽는다.', vi: 'Tôi đọc sách trước khi ngủ.', vocab: '', breakdown: '읽다 (patchim) + 는다 → 읽는다' },
  ],
  '18|N(이)다': [
    { ko: '여기는 내가 일하는 회사다.', vi: 'Đây là công ty tôi làm việc.', vocab: '', breakdown: '회사 (không patchim) + 다 → 회사다' },
    { ko: '어제는 아버지 생신이었다.', vi: 'Hôm qua là sinh nhật bố tôi.', vocab: '생신: sinh nhật (kính ngữ)', breakdown: '생신 (patchim ㄴ) + 이었다 (quá khứ) → 생신이었다' },
  ],
}
