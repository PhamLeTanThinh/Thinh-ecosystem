// Bài đọc cuối bài học Korean — 1 đoạn văn dùng lại TOÀN BỘ từ vựng của bài (và ngữ pháp của bài) để ôn trong ngữ
// cảnh. Trong `ko`, từ vựng của bài bọc trong {{…}} để tô màu (ReadingSection bóc dấu khi đọc to).
import type { Reading } from '@/components/shared/ReadingSection'

export const KOREAN_READINGS: Record<number, Reading> = {
  10: {
    title: '선배와 함께한 맛있는 하루',
    titleVi: 'Một ngày ngon miệng cùng tiền bối',
    note: 'Dùng đủ 54 từ vựng và 4 ngữ pháp của bài: N 중에서, 반말, V-(으)ㄹ래(요), -(으)ㄴ데/는데.',
    paragraphs: [
      {
        ko: '지난 토요일에 학교 {{선배}}인 민수 씨와 {{후배}} 지아를 만났어요. 민수 선배는 저보다 두 살이 많아서 저는 항상 {{높임말}}을 써요. 지아는 학교 후배인데 나이는 저와 {{동갑}}이에요. 그래서 그날 지아가 "우리 동갑이니까 이제 {{말을 놓}}자." 하고 말했어요. 그날부터 우리는 반말을 하기로 했어요.',
        vi: 'Thứ Bảy tuần trước, tôi gặp anh Minsu, tiền bối ở trường, và Jia, hậu bối. Anh Minsu hơn tôi hai tuổi nên tôi luôn nói kính ngữ với anh. Jia là hậu bối ở trường nhưng lại bằng tuổi tôi. Vì vậy hôm đó Jia bảo: "Mình bằng tuổi mà, giờ nói chuyện thoải mái đi." Từ hôm đó, hai chúng tôi quyết định nói 반말 với nhau.',
      },
      {
        ko: '점심은 민수 선배가 {{추천}}한 {{맛집}}에 가기로 했어요. 그 식당은 {{교통}}이 조금 불편한데 음식 {{맛}}이 좋아서 항상 사람이 많대요. 그래서 선배가 {{미리}} 예약을 했어요. 메뉴에는 {{김치찌개}}, {{된장찌개}}, {{순두부찌개}}, {{감자탕}}, {{설렁탕}}, {{매운탕}}, {{갈비찜}}, {{떡갈비}}, {{삼겹살}}, {{냉면}}, {{비빔국수}}, {{칼국수}}가 있었어요.',
        vi: 'Bữa trưa, cả nhóm đi tới quán ăn ngon mà anh Minsu giới thiệu. Nghe nói quán đó đi lại hơi bất tiện nhưng đồ ăn ngon nên lúc nào cũng đông, vì vậy anh đã đặt bàn trước. Thực đơn có canh kimchi, canh tương đậu, canh đậu phụ non, canh xương khoai tây, canh hầm xương, canh cá cay, sườn hầm, sườn băm nướng, thịt ba chỉ, mì lạnh, mì trộn và mì cắt tay.',
      },
      {
        ko: '"지아야, 뭐 먹을래?" 제가 물었어요.\n"음… 이 중에서 나는 순두부찌개를 먹을래. 너는?"\n"나는 매운 음식을 잘 못 먹는데 오늘은 김치찌개를 먹어 볼래."',
        vi: '"Jia ơi, ăn gì đây?" tôi hỏi.\n"Ừm… trong mấy món này, mình ăn canh đậu phụ non. Còn cậu?"\n"Mình không ăn cay giỏi lắm, nhưng hôm nay thử ăn canh kimchi xem."',
      },
      {
        ko: '민수 선배는 삼겹살 3{{인분}}과 떡갈비를 {{시켰어요}}. 이 식당에서는 삼겹살을 2인분 {{이상}} 주문해야 한대요.',
        vi: 'Anh Minsu gọi 3 suất thịt ba chỉ và sườn băm nướng. Nghe nói ở quán này phải gọi thịt ba chỉ từ 2 suất trở lên.',
      },
      {
        ko: '잠시 후 {{직원}}이 큰 {{상}}에 음식을 차려 주었어요. 김치찌개가 보글보글 {{끓고}} 있었어요. 생각보다 {{맵지}} 않았는데 조금 {{짰어요}}. 반대로 지아의 순두부찌개는 좀 {{싱거웠대요}}. 지아가 "여기요, 작은 {{그릇}} 하나만 {{갖다 주}}세요." 하고 말했어요. 직원이 "물도 더 드릴까요?" 하고 물었지만 지아는 "물은 {{필요 없}}어요."라고 했어요. 선배는 숟가락으로 찌개를 잘 {{저어서}} 우리에게 나눠 주었어요. 같이 나온 {{야채}}도 아주 신선했어요.',
        vi: 'Một lúc sau, nhân viên bày đồ ăn ra một bàn lớn. Nồi canh kimchi đang sôi sùng sục. Canh không cay như tôi nghĩ, nhưng hơi mặn. Ngược lại, Jia bảo canh đậu phụ non của cậu ấy hơi nhạt. Jia gọi: "Chị ơi, cho em xin một cái bát nhỏ ạ." Nhân viên hỏi "Em có cần thêm nước không?" nhưng Jia nói "Nước thì không cần ạ." Anh Minsu dùng thìa khuấy đều nồi canh rồi chia cho chúng tôi. Rau ăn kèm cũng rất tươi.',
      },
      {
        ko: '음식이 모두 {{입에 맞}}아서 우리는 정말 많이 먹었어요. 너무 {{배가 불러서}} {{후식}}은 먹지 못했어요. 그래도 음식 {{값}}이 싸고 양도 많아서 하나도 {{돈이 아깝지}} 않았어요.',
        vi: 'Món nào cũng hợp khẩu vị nên chúng tôi ăn rất nhiều. No quá nên không ăn nổi món tráng miệng. Nhưng giá rẻ mà lượng lại nhiều, nên chẳng tiếc đồng nào.',
      },
      {
        ko: '식당에서 나와서 길에서 {{붕어빵}}을 샀어요. 붕어빵 안의 팥이 아주 {{달았어요}}. 지아는 커피를 마셨는데 커피가 너무 {{써서}} 얼굴을 찡그렸어요. 그리고 선배가 준 레몬 사탕이 너무 {{셔서}} 우리는 모두 웃었어요.',
        vi: 'Ra khỏi quán, chúng tôi mua bánh cá ngoài đường. Nhân đậu đỏ bên trong rất ngọt. Jia uống cà phê, nhưng cà phê đắng quá nên cậu ấy nhăn mặt. Rồi viên kẹo chanh anh Minsu đưa chua quá, cả bọn bật cười.',
      },
      {
        ko: '이야기를 나누다가 지아가 다음 달에 {{자유 여행}}으로 터키에 간다고 했어요. "터키에 가면 진짜 {{케밥}}을 꼭 먹을 거야!" 지아는 아주 신이 났어요. 민수 선배는 다음에는 한국 전통 음식을 맛보러 {{한정식}} 집에 같이 가자고 했어요.',
        vi: 'Đang nói chuyện thì Jia kể tháng sau sẽ đi du lịch tự túc sang Thổ Nhĩ Kỳ. "Sang đó nhất định mình phải ăn kebab chính gốc!" Jia háo hức lắm. Anh Minsu rủ lần sau cả nhóm đi ăn cơm Hàn truyền thống nhiều món để nếm thử món ăn Hàn Quốc.',
      },
      {
        ko: '저녁에는 집에 돌아오는 길에 마트에 들러서 {{장을 봤어요}}. 내일 친구들을 초대해서 직접 된장찌개를 {{끓일}} 거예요. 그래서 {{재료}}로 두부와 {{채소}}를 샀어요. 그런데 집에 도착하니까 동생이 시킨 피자 두 {{판}}이 벌써 {{배달되어}} 있었어요. 오늘은 정말 맛있는 음식이 가득한 하루였어요.',
        vi: 'Buổi tối trên đường về, tôi ghé siêu thị đi chợ. Ngày mai tôi mời bạn bè đến và sẽ tự nấu canh tương đậu, nên tôi mua đậu phụ và rau củ làm nguyên liệu. Nhưng về tới nhà thì hai cái pizza em tôi gọi đã được giao tới rồi. Hôm nay đúng là một ngày ngập tràn đồ ăn ngon.',
      },
    ],
  },
}
