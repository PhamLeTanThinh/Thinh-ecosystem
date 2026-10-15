// Bài đọc cuối bài học Korean — 1 đoạn văn dùng lại TOÀN BỘ từ vựng của bài (và ngữ pháp của bài) để ôn trong ngữ
// cảnh. Trong `ko`, từ vựng của bài bọc trong {{…}} để tô màu (ReadingSection bóc dấu khi đọc to).
import type { GlossLookup, Reading } from '@/components/shared/ReadingSection'

// Tách chữ Hangul thành jamo (đầu / giữa / cuối) bằng phép tính trên mã Unicode — không dùng normalize('NFD') vì có môi
// trường tách sai chữ (xem lib/learner/identity.ts). Phụ âm đầu và phụ âm cuối dùng CHUNG 1 chữ (ㄹ cuối = ㄹ đầu) để
// khớp được các biến âm khi chia: 부르 → 불러 (ㄹ của 르 nhảy lên làm phụ âm cuối). Ký tự khác giữ nguyên.
const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'
const JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
function jamo(s: string): string[] {
  const out: string[] = []
  for (const ch of s) {
    const code = ch.charCodeAt(0) - 0xac00
    if (code < 0 || code > 11171) {
      out.push(ch)
      continue
    }
    out.push(CHO[Math.floor(code / 588)], JUNG[Math.floor((code % 588) / 28)])
    if (code % 28) out.push(JONG[code % 28])
  }
  return out
}

// Các cách viết của 1 mục từ: "A/B" → A, B; phần trong ngoặc là tuỳ chọn — "배(가) 부르다" → 배가 부르다, 배 부르다;
// "(1인)분" → 1인분, 분 — và bỏ số đứng đầu (bài đọc viết "3{{인분}}"); cách nói thay thế trong [] xem bên dưới.
function forms(front: string): string[] {
  // Cách nói thay thế trong [] cho từ đứng ngay trước nó, ở bất kỳ vị trí nào: "열이 나다[있다]" → 열이 나다, 열이 있다;
  // "높임말[존댓말]을 하다" → 높임말을 하다, 존댓말을 하다; "까만색[검은색]" → 까만색, 검은색
  const alt = front.match(/^(.*?)([^\s[]+)\[([^\]]+)\](.*)$/)
  if (alt) return [...forms(alt[1] + alt[2] + alt[4]), ...forms(alt[1] + alt[3] + alt[4])]
  return front.split('/').flatMap((f) => {
    const withParen = f.replace(/[()]/g, '').trim()
    const without = f.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim()
    return [...new Set([withParen, without, withParen.replace(/^\d+/, '')])].filter(Boolean)
  })
}

function commonPrefix(a: string[], b: string[]): number {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  return i
}

// Tra nghĩa cho từ được tô trong bài đọc (tooltip khi rê chuột). Từ trong bài thường đã CHIA (시켰어요, 싱거웠대요,
// 배가 불러서) nên so theo gốc từ (bỏ đuôi 다) ở mức jamo: khớp được nếu chỉ lệch tối đa 1 jamo cuối của gốc — đủ cho
// các biến âm khi chia (시키+었 → 시켰, 싱겁 → 싱거워, 젓 → 저어, 쓰 → 써). Chọn thẻ khớp dài nhất.
export function koreanGloss(cards: { front: string; meaning: string }[]): GlossLookup {
  const entries = cards.flatMap((c) => forms(c.front).map((form) => ({ form, stem: jamo(form.replace(/다$/, '')), meaning: c.meaning })))
  return (word) => {
    const w = jamo(word)
    // Chọn thẻ khớp DÀI nhất (산책을 했어요 → 산책하다, không phải 사 "bốn"); bằng nhau thì ưu tiên thẻ khớp TRỌN gốc từ
    // (알아요 → 알다, không phải 아래 — cả hai đều khớp 3 jamo ㅇㅏㄹ).
    let best: { full: boolean; score: number; meaning: string } | undefined
    for (const e of entries) {
      if (e.form === word) return { meaning: e.meaning }
      const score = commonPrefix(e.stem, w)
      if (score === 0 || score < e.stem.length - 1) continue
      const full = score === e.stem.length
      if (!best || score > best.score || (score === best.score && full && !best.full)) best = { full, score, meaning: e.meaning }
    }
    return best && { meaning: best.meaning }
  }
}

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

  // ── TOPIK I (서울대 한국어 1A + 1B, lesson 101-116 = Bài 1-16) ──
  101: {
    title: '우리 반 친구들',
    titleVi: 'Các bạn trong lớp tôi',
    note: 'Dùng đủ 42 từ vựng và 4 ngữ pháp của bài: lời chào, N은/는 N이에요/예요, N입니까? / N입니다, N이/가 아닙니다.',
    paragraphs: [
      {
        ko: '{{안녕하세요}}? {{저}}는 Lan이에요. 베트남 {{사람}}이에요. 저는 {{학생}}이에요. {{만나서 반가워요}}!',
        vi: 'Xin chào! Tôi là Lan. Tôi là người Việt Nam. Tôi là sinh viên. Rất vui được gặp các bạn!',
      },
      {
        ko: '우리 반에는 여러 {{나라}} 사람이 있어요. Wang {{씨}}는 {{중국}} 사람이에요. Yuki 씨는 {{일본}} 사람, Tom 씨는 {{미국}} 사람, Emma 씨는 {{영국}} 사람, Pierre 씨는 {{프랑스}} 사람, Hans 씨는 {{독일}} 사람이에요. Jack 씨는 {{호주}}, Anna 씨는 {{캐나다}}, Ivan 씨는 {{러시아}}, Raj 씨는 {{인도}}, Ali 씨는 {{파키스탄}} 사람이에요.',
        vi: 'Lớp tôi có người từ nhiều nước. Anh Wang là người Trung Quốc. Yuki là người Nhật, Tom là người Mỹ, Emma là người Anh, Pierre là người Pháp, Hans là người Đức. Jack là người Úc, Anna là người Canada, Ivan là người Nga, Raj là người Ấn Độ, Ali là người Pakistan.',
      },
      {
        ko: '"Ali 씨, {{어느}} 나라 사람이에요?"\n"파키스탄 사람이에요."\n"{{국적}}이 파키스탄입니까?"\n"{{네}}, 파키스탄 사람입니다."',
        vi: '"Ali, bạn là người nước nào?"\n"Tôi là người Pakistan."\n"Quốc tịch của bạn là Pakistan à?"\n"Vâng, tôi là người Pakistan."',
      },
      {
        ko: '"Wang 씨는 {{선생님}}이에요?"\n"{{아니요}}, 저는 선생님이 아닙니다. {{회사원}}입니다."\n우리 반 친구들은 {{직업}}도 달라요. Tom 씨는 {{의사}}예요. Emma 씨는 {{요리사}}예요. Pierre 씨는 {{기자}}, Hans 씨는 {{가수}}, Ivan 씨는 {{군인}}이에요. Anna 씨는 {{주부}}예요.',
        vi: '"Anh Wang là giáo viên à?"\n"Không, tôi không phải giáo viên. Tôi là nhân viên công ty."\nNghề nghiệp của các bạn trong lớp cũng khác nhau. Tom là bác sĩ. Emma là đầu bếp. Pierre là nhà báo, Hans là ca sĩ, Ivan là quân nhân. Anna là nội trợ.',
      },
      {
        ko: '선생님이 교실에 들어왔어요.\n"{{여러분}}, {{안녕하십니까}}? 저는 Kim입니다. {{한국}} 사람입니다. {{만나서 반갑습니다}}."\n선생님이 {{명함}}을 줬어요. "이거는 {{무엇}}입니까?" "명함입니다." 명함에 선생님 {{이름}}하고 {{전화번호}}가 있어요. {{영어}} 이름도 있어요.',
        vi: 'Cô giáo bước vào lớp.\n"Chào các em. Cô là Kim. Cô là người Hàn Quốc. Rất vui được gặp các em."\nCô phát danh thiếp. "Cái này là gì ạ?" "Là danh thiếp." Trên danh thiếp có tên và số điện thoại của cô. Còn có cả tên tiếng Anh nữa.',
      },
      {
        ko: '수업이 끝났어요. 저는 선생님께 "{{안녕히 계세요}}." 하고 인사했어요. 선생님은 "{{안녕히 가세요}}." 하고 웃었어요.',
        vi: 'Hết giờ học. Tôi chào cô: "Em chào cô ạ (cô ở lại mạnh khỏe)." Cô cười nói: "Tạm biệt em (em về cẩn thận)."',
      },
    ],
  },

  102: {
    title: '제 방에 뭐가 있어요?',
    titleVi: 'Trong phòng tôi có gì?',
    note: 'Dùng đủ 56 từ vựng và 4 ngữ pháp của bài: N이/가 있어요[없어요], 이거는[그거는, 저거는] N이에요/예요, N 주세요, N하고 N / N과/와 N.',
    paragraphs: [
      {
        ko: '여기는 제 {{방}}이에요. 방에 {{침대}}, {{책상}}, {{의자}}가 있어요. {{냉장고}}하고 {{에어컨}}도 있어요. {{텔레비전}}은 없어요. {{창문}} 옆에 {{컴퓨터}}가 있어요. {{우리}} 방은 작아요.',
        vi: 'Đây là phòng của tôi. Trong phòng có giường, bàn học, ghế. Còn có tủ lạnh và máy điều hòa. Không có tivi. Cạnh cửa sổ có máy tính. Phòng của chúng tôi nhỏ.',
      },
      {
        ko: '책상 위에 {{책}}, {{공책}}, {{사전}}, {{전자사전}}, {{잡지}}, {{신문}}이 있어요. {{필통}}에는 {{볼펜}}, {{연필}}, {{지우개}}, {{자}}가 있어요.',
        vi: 'Trên bàn có sách, vở, từ điển, từ điển điện tử, tạp chí, báo. Trong hộp bút có bút bi, bút chì, cục tẩy, thước kẻ.',
      },
      {
        ko: '"이거는 {{뭐}}예요?"\n"그거는 {{시계}}예요."\n"저거는요?"\n"저거는 {{제}} {{룸메이트}} {{카메라}}예요."',
        vi: '"Cái này là gì?"\n"Cái đó là đồng hồ."\n"Còn cái kia?"\n"Cái kia là máy ảnh của bạn cùng phòng tôi."',
      },
      {
        ko: '제 {{가방}}에는 {{지갑}}, {{휴대폰}}, {{교통카드}}, {{안경}}, {{휴지}}, {{우산}}이 있어요. 지갑에 {{동전}}이 많아요. {{모자}}는 없어요. {{지도}}도 없어요.',
        vi: 'Trong túi của tôi có ví, điện thoại di động, thẻ giao thông, kính, khăn giấy, ô. Trong ví có nhiều đồng xu. Không có mũ. Bản đồ cũng không có.',
      },
      {
        ko: '오후에 가게에 갔어요.\n"{{어서 오세요}}."\n"{{물}}하고 {{우유}} {{좀}} 주세요. {{주스}}도 있어요?"\n"네, {{오렌지}} 주스하고 {{사과}} 주스가 있어요."\n"그럼 오렌지 주스 주세요. {{딸기}}하고 {{바나나}}도 주세요. {{콜라}}하고 {{커피}}는 없어요?"\n"있어요. {{여기 있어요}}."',
        vi: 'Buổi chiều tôi đi cửa hàng.\n"Xin mời vào."\n"Cho tôi nước và sữa. Có nước ép không ạ?"\n"Có, có nước cam và nước táo."\n"Vậy cho tôi nước cam. Cho tôi cả dâu tây và chuối nữa. Không có coca với cà phê à?"\n"Có ạ. Đây ạ."',
      },
      {
        ko: '제 {{친구}}는 {{서울대학교}} 학생이에요. 친구는 {{여자 친구}}가 있어요. 저는 {{남자 친구}}가 없어요. 우리는 같이 {{한국어}}를 공부해요. 그리고 {{한국어로}} {{영화}}를 봐요. 친구는 {{차}}가 있어요.',
        vi: 'Bạn tôi là sinh viên Đại học Quốc gia Seoul. Bạn ấy có bạn gái. Tôi thì không có bạn trai. Chúng tôi học tiếng Hàn cùng nhau. Rồi xem phim bằng tiếng Hàn. Bạn tôi có ô tô.',
      },
    ],
  },

  103: {
    title: 'Lan 씨의 하루',
    titleVi: 'Một ngày của Lan',
    note: 'Dùng đủ 49 từ vựng và 4 ngữ pháp của bài: V-아요/어요, N을/를, N에서, 안 V.',
    paragraphs: [
      {
        ko: '{{오늘}}은 토요일이에요. 저는 {{지금}} {{집}}에서 {{숙제를 해요}}. {{그리고}} {{차}}를 {{마셔요}}.',
        vi: 'Hôm nay là thứ bảy. Bây giờ tôi đang làm bài tập ở nhà. Rồi uống trà.',
      },
      {
        ko: '"Lan 씨, 오늘 {{어디}}에 가요?"\n"{{도서관}}에 가요. 도서관에서 {{공부해요}}. {{책을 읽어요}}."\n"{{그럼}} 오후에는요?"\n"오후에는 {{커피숍}}에서 {{아르바이트해요}}."',
        vi: '"Lan ơi, hôm nay bạn đi đâu?"\n"Mình đi thư viện. Mình học ở thư viện. Mình đọc sách."\n"Vậy buổi chiều thì sao?"\n"Buổi chiều mình làm thêm ở quán cà phê."',
      },
      {
        ko: 'Yuki 씨는 {{언어교육원}}에서 한국어를 {{배워요}}. Yuki 씨 어머니는 {{학교}}에서 {{일본어}}를 {{가르쳐요}}. Pierre 씨는 {{회사}}에서 {{일해요}}. 저녁에는 학생들에게 {{프랑스어}}도 가르쳐요.',
        vi: 'Yuki học tiếng Hàn ở Viện Giáo dục Ngôn ngữ. Mẹ của Yuki dạy tiếng Nhật ở trường học. Pierre làm việc ở công ty. Buổi tối anh ấy còn dạy tiếng Pháp cho học sinh.',
      },
      {
        ko: '저녁에 {{친구를 만나요}}. 친구하고 {{식당}}에서 {{밥을 먹어요}}. 저는 {{불고기}}를 {{먹어요}}. 친구는 {{고기}}를 안 먹어요. 친구는 {{피자}}를 먹어요. 그리고 같이 {{커피를 마셔요}}.',
        vi: 'Buổi tối tôi gặp bạn. Tôi và bạn ăn cơm ở quán ăn. Tôi ăn bulgogi. Bạn tôi không ăn thịt. Bạn ấy ăn pizza. Rồi chúng tôi cùng uống cà phê.',
      },
      {
        ko: '친구는 매일 {{스포츠 센터}}에서 {{운동해요}}. 주말에는 {{태권도를 배워요}}. 저는 운동을 안 해요. 저는 {{공원}}에서 {{쉬어요}}.',
        vi: 'Bạn tôi ngày nào cũng tập thể dục ở trung tâm thể thao. Cuối tuần bạn ấy học Taekwondo. Tôi không tập thể dục. Tôi nghỉ ngơi ở công viên.',
      },
      {
        ko: '일요일에는 {{시장}}하고 {{백화점}}에 가요. 백화점에서 {{옷을 사요}}. 시장에서는 과일을 {{사요}}. 밤에는 {{극장}}에서 {{영화를 봐요}}. 아니면 {{노래방}}에 가요.',
        vi: 'Chủ nhật tôi đi chợ và trung tâm thương mại. Ở trung tâm thương mại tôi mua quần áo. Ở chợ thì mua hoa quả. Buổi tối tôi xem phim ở rạp. Hoặc là đi karaoke.',
      },
      {
        ko: '집에서는 {{드라마}}를 {{봐요}}. 저는 {{요리}}를 좋아해요. 그래서 룸메이트하고 같이 요리를 {{해요}}. 자기 전에 소설을 조금 {{읽어요}}. 그리고 열한 시에 {{자요}}. 내일도 친구를 {{만나요}}.',
        vi: 'Ở nhà tôi xem phim truyền hình. Tôi thích nấu ăn. Vì vậy tôi nấu ăn cùng bạn cùng phòng. Trước khi ngủ tôi đọc tiểu thuyết một chút. Rồi mười một giờ tôi đi ngủ. Ngày mai tôi cũng gặp bạn.',
      },
    ],
  },

  104: {
    title: '서울에서 보내는 편지',
    titleVi: 'Lá thư gửi từ Seoul',
    note: 'Dùng đủ 44 từ vựng và 4 ngữ pháp của bài: 여기가 N이에요/예요, N에 있어요[없어요], N에 가요[와요], N 앞[뒤, 옆].',
    paragraphs: [
      {
        ko: '{{어머니}}, {{아버지}}, {{잘 지내세요}}? 저는 {{서울}}에서 잘 지내요.',
        vi: 'Mẹ, bố, bố mẹ có khỏe không ạ? Con ở Seoul vẫn sống tốt.',
      },
      {
        ko: '여기가 제 {{기숙사}}예요. 기숙사 {{앞}}에 {{은행}}이 있어요. 은행 {{옆}}에 {{우체국}}하고 {{약국}}이 있어요. 기숙사 {{뒤}}에는 {{병원}}이 있어요.',
        vi: 'Đây là ký túc xá của con. Phía trước ký túc xá có ngân hàng. Bên cạnh ngân hàng có bưu điện và hiệu thuốc. Phía sau ký túc xá có bệnh viện.',
      },
      {
        ko: '저는 {{매일}} 학교에 가요. 우리 {{반}} {{교실}}은 3층에 있어요. 교실 {{안}}에 {{그림}}이 있어요. 책상 {{위}}에 책이 있어요. 책상 {{밑}}에 가방이 있어요. {{화장실}}은 교실 옆에 있어요. {{아래}}층에는 {{서점}}하고 {{빵집}}이 있어요.',
        vi: 'Ngày nào con cũng đến trường. Phòng học của lớp con ở tầng 3. Trong phòng học có bức tranh. Trên bàn có sách. Dưới gầm bàn có cặp. Nhà vệ sinh ở bên cạnh phòng học. Tầng dưới có hiệu sách và tiệm bánh.',
      },
      {
        ko: '주말에는 {{시내}}에 가요. {{명동}}에서 {{쇼핑해요}}. {{인사동}}에서는 {{찻집}}에 가요. {{가게}}에서 {{기념품}}을 사요. {{대학로}}에서 {{연극}}을 봐요. {{청계천}}도 {{구경해요}}.',
        vi: 'Cuối tuần con đi vào trung tâm thành phố. Con mua sắm ở Myeongdong. Ở Insadong con đi quán trà. Con mua quà lưu niệm ở cửa hàng. Con xem kịch ở Daehakro. Con cũng đi ngắm suối Cheonggyecheon.',
      },
      {
        ko: '어제는 {{남산}}에 갔어요. {{N서울타워}}에서 {{사진}}을 많이 찍었어요. {{그}} 사진을 같이 보내요.',
        vi: 'Hôm qua con đi núi Namsan. Con chụp rất nhiều ảnh ở tháp N Seoul. Con gửi kèm những tấm ảnh đó.',
      },
      {
        ko: '다음 주에 친구가 {{공항}}에 와요. 친구는 {{대사관}}에서 일해요. 기숙사 근처에 {{미용실}}도 있어요. 한국 {{음식}}은 정말 맛있어요. 제 새 주소를 {{알아요}}? 편지 많이 보내 주세요. 어머니, 아버지, {{사랑해요}}!',
        vi: 'Tuần sau bạn con đến sân bay. Bạn con làm việc ở đại sứ quán. Gần ký túc xá còn có tiệm làm tóc. Đồ ăn Hàn Quốc ngon lắm. Bố mẹ có biết địa chỉ mới của con không? Hãy gửi thư cho con nhiều nhé. Con yêu bố mẹ!',
      },
    ],
  },

  105: {
    title: '바쁜 일주일',
    titleVi: 'Một tuần bận rộn',
    note: 'Dùng đủ 54 từ vựng và 4 ngữ pháp của bài: ngày tháng và thứ, N에 (thời gian), V-았/었-, V-고 (trình tự).',
    paragraphs: [
      {
        ko: '"{{내일}}이 {{무슨}} 요일이에요?"\n"{{금요일}}이에요."\n"내일 {{시간}} 있어요? {{같이}} 영화 봐요."\n"{{미안해요}}. 내일은 {{약속}}이 있어요."',
        vi: '"Ngày mai là thứ mấy?"\n"Thứ sáu."\n"Mai bạn có thời gian không? Cùng đi xem phim đi."\n"Xin lỗi nhé. Mai mình có hẹn rồi."',
      },
      {
        ko: '이건 제 {{스케줄}}이에요. {{월요일}}에는 수업이 있어요. {{화요일}}에는 아르바이트를 해요. {{수요일}}에는 {{시험}}이 있어요. {{목요일}}에는 친구{{하고}} 운동해요. {{토요일}}에는 {{혼자}} 쉬어요. {{일요일}}에는 공원에서 {{산책을 해요}}.',
        vi: 'Đây là lịch trình của tôi. Thứ hai có giờ học. Thứ ba tôi làm thêm. Thứ tư có bài kiểm tra. Thứ năm tôi tập thể dục với bạn. Thứ bảy tôi nghỉ ngơi một mình. Chủ nhật tôi đi dạo ở công viên.',
      },
      {
        ko: '{{어제}}는 제 {{생일}}이었어요. 친구들이 {{파티}}를 했어요. 친구가 {{선물}}하고 {{카드}}를 줬어요. 우리는 {{사진을 찍었어요}}. 파티는 밤 열 시에 {{끝났어요}}. {{그래서}} 오늘은 조금 피곤해요.',
        vi: 'Hôm qua là sinh nhật tôi. Các bạn tổ chức tiệc cho tôi. Bạn tôi tặng quà và thiệp. Chúng tôi chụp ảnh. Bữa tiệc kết thúc lúc mười giờ tối. Vì vậy hôm nay tôi hơi mệt.',
      },
      {
        ko: '아침에 일어나고 {{세수해요}}. 그리고 {{이를 닦아요}}. 아침을 먹고 학교에 가요.',
        vi: 'Buổi sáng tôi dậy rồi rửa mặt. Sau đó đánh răng. Ăn sáng xong rồi đi học.',
      },
      {
        ko: '{{지난주}} {{주말}}에는 {{코엑스몰}}에 갔어요.\n"{{누구}}하고 갔어요?"\n"친구하고 갔어요. {{거기}}에서 쇼핑하고 밥을 먹었어요."\n{{크리스마스}}에도 거기에 갈 거예요.',
        vi: 'Cuối tuần trước tôi đi COEX Mall.\n"Bạn đi với ai?"\n"Mình đi với bạn. Ở đó mình mua sắm rồi ăn cơm."\nGiáng sinh tôi cũng sẽ đến đó.',
      },
      {
        ko: '"{{설날}}이 {{언제}}예요? {{며칠}}이에요?"\n"설날은 {{음력}} 1월 1일이에요. {{양력}}으로는 보통 1월이나 2월이에요."\n설날에는 {{떡국}}을 먹고 {{세배를 해요}}. {{추석}}에는 {{송편}}을 먹고 {{차례를 지내요}}.',
        vi: '"Tết Nguyên đán là khi nào? Ngày mấy?"\n"Tết là ngày 1 tháng 1 âm lịch. Theo dương lịch thì thường rơi vào tháng 1 hoặc tháng 2."\nNgày Tết người Hàn ăn canh bánh gạo và lạy chúc Tết. Tết Trung thu thì ăn bánh songpyeon và cúng tổ tiên.',
      },
      {
        ko: '오늘 수업에서 한국어 숫자를 배웠어요: {{일}}, {{이}}, {{삼}}, {{사}}, {{오}}, {{육}}, {{칠}}, {{팔}}, {{구}}, {{십}}.',
        vi: 'Hôm nay trên lớp tôi học số đếm tiếng Hàn: một, hai, ba, bốn, năm, sáu, bảy, tám, chín, mười.',
      },
    ],
  },

  106: {
    title: '시장과 식당에서',
    titleVi: 'Ở chợ và ở quán ăn',
    note: 'Dùng đủ 88 từ vựng và 4 ngữ pháp của bài: V-(으)세요, N 개[병, 잔, 그릇], N이/가 A-아요/어요, N도.',
    paragraphs: [
      {
        ko: '"{{아저씨}}, 이 {{배}} {{얼마}}예요?"\n"{{하나}}{{에}} 삼천 원이에요."\n"{{아주}} {{비싸요}}. 좀 {{깎아 주세요}}."\n"{{그래요?}} 그럼 {{몇}} 개 사요?"',
        vi: '"Chú ơi, quả lê này bao nhiêu tiền?"\n"Ba nghìn won mỗi quả."\n"Đắt quá. Chú bớt cho cháu chút đi."\n"Vậy à? Thế cháu mua mấy quả?"',
      },
      {
        ko: '"{{다섯}} 개 주세요. {{귤}}하고 {{수박}}, {{멜론}}, {{키위}}, {{파인애플}}도 있어요?"\n"네, {{모두}} 있어요. 귤은 {{싸요}}."',
        vi: '"Cho cháu năm quả. Có quýt, dưa hấu, dưa lưới, kiwi với dứa không chú?"\n"Có, có tất cả. Quýt thì rẻ."',
      },
      {
        ko: '저는 한국어 숫자를 연습했어요: 하나, {{둘}}, {{셋}}, {{넷}}, 다섯, {{여섯}}, {{일곱}}, {{여덟}}, {{아홉}}, {{열}}. 한국 돈에는 {{십 원}}, {{오십 원}}, {{백 원}}, {{오백 원}} 동전이 있어요. {{천 원}}, {{오천 원}}, {{만 원}}, {{오만 원}} 지폐도 있어요.',
        vi: 'Tôi luyện đếm số thuần Hàn: một, hai, ba, bốn, năm, sáu, bảy, tám, chín, mười. Tiền Hàn Quốc có xu 10 won, 50 won, 100 won, 500 won. Còn có tờ 1.000 won, 5.000 won, 10.000 won, 50.000 won.',
      },
      {
        ko: '마트에서 {{과자}}, {{빵}}, {{달걀}}, {{라면}}, {{아이스크림}}을 샀어요. {{맥주}}도 두 병 샀어요. 마트에는 {{물건}}이 많아요. 사람도 많아서 {{복잡해요}}. 하지만 아주 {{깨끗해요}}.',
        vi: 'Tôi mua bánh kẹo, bánh mì, trứng, mì gói, kem ở siêu thị. Còn mua hai chai bia. Siêu thị có rất nhiều đồ. Người cũng đông nên rất chen chúc. Nhưng rất sạch sẽ.',
      },
      {
        ko: '옆 가게에서는 {{운동화}}하고 {{바지}}를 {{팔아요}}. 운동화가 정말 {{좋아요}}. 전자 매장에는 오십 {{인치}} 텔레비전이 있어요. {{리모컨}}도 {{박스}}에 있어요. 서점에서는 한국어 책 두 {{권}}을 샀어요. 한국어 1{{급}} 책이에요.',
        vi: 'Cửa hàng bên cạnh bán giày thể thao và quần. Giày thể thao tốt thật. Trong cửa hàng điện tử có tivi 50 inch. Điều khiển từ xa cũng ở trong hộp. Ở hiệu sách tôi mua hai quyển sách tiếng Hàn. Là sách tiếng Hàn cấp 1.',
      },
      {
        ko: '{{점심}}에 식당에 갔어요.\n"{{여기요}}! {{메뉴}} 좀 {{주세요}}."\n"네, {{잠깐만}} {{기다리세요}}. 여기 {{앉으세요}}."',
        vi: 'Buổi trưa tôi đi quán ăn.\n"Em ơi! Cho tôi xin thực đơn."\n"Vâng, xin chờ một chút. Mời anh chị ngồi đây."',
      },
      {
        ko: '메뉴에 {{김밥}}, {{비빔밥}}, {{김치찌개}}, {{김치볶음밥}}, {{김치전}}, {{냉면}}, {{갈비탕}}, {{우동}}, {{돈가스}}, {{스파게티}}, {{햄버거}}, {{샌드위치}}가 있어요. 저는 비빔밥을 먹었어요. 정말 {{맛있어요}}! 반찬으로 {{김치}}, {{깍두기}}, {{물김치}}, {{백김치}}, {{오이김치}}가 나왔어요. 저는 김치를 {{많이}} {{좋아해요}}. "김치 {{또}} 주세요!"',
        vi: 'Thực đơn có kimbap, bibimbap, canh kimchi, cơm rang kimchi, bánh xèo kimchi, mì lạnh, canh sườn bò, mì udon, thịt heo chiên xù, spaghetti, hamburger, sandwich. Tôi ăn bibimbap. Ngon thật! Món ăn kèm có kimchi, kimchi củ cải, kimchi nước, kimchi trắng, kimchi dưa chuột. Tôi rất thích kimchi. "Cho tôi thêm kimchi nữa!"',
      },
      {
        ko: '식당에서 나와서 카페에 갔어요. {{아이스커피}}하고 {{에스프레소}}를 마셨어요. {{케이크}}도 먹었어요. 그리고 친구에게 {{전화했어요}}. 집에 가는 {{길}}에 친구하고 {{노래}}를 불렀어요. {{아리랑}}이에요. {{이런}} 하루가 정말 좋아요.',
        vi: 'Ra khỏi quán ăn, tôi đi cà phê. Tôi uống cà phê đá và espresso. Còn ăn bánh ngọt nữa. Rồi tôi gọi điện cho bạn. Trên đường về nhà, tôi cùng bạn hát một bài. Là bài Arirang. Một ngày như thế này thật tuyệt.',
      },
    ],
  },

  107: {
    title: '여러 나라의 날씨',
    titleVi: 'Thời tiết ở các nước',
    note: 'Dùng đủ 61 từ vựng và 4 ngữ pháp của bài: bất quy tắc \'ㅂ\', A/V-지만, A/V-습니다/ㅂ니다, A/V-고 (liệt kê).',
    paragraphs: [
      {
        ko: '"{{요즘}} 서울 {{날씨}}가 {{어때요?}}"\n"{{춥습니다}}. 하지만 {{하늘}}은 {{맑습니다}}."',
        vi: '"Dạo này thời tiết Seoul thế nào?"\n"Lạnh lắm. Nhưng bầu trời quang đãng."',
      },
      {
        ko: '저는 베트남{{에서}} 왔어요. 제 {{고향}}은 {{항상}} {{덥지만}} {{바다}}가 아름다워요. 한국의 겨울은 {{처음}}이에요.',
        vi: 'Tôi đến từ Việt Nam. Quê tôi lúc nào cũng nóng nhưng biển rất đẹp. Đây là mùa đông Hàn Quốc đầu tiên của tôi.',
      },
      {
        ko: '한국에는 {{계절}}이 네 개 있어요. {{봄}}에는 {{꽃}}이 많고 {{따뜻해요}}. {{여름}}에는 {{비가 와요}}. 그래서 {{수영장}}에서 {{수영해요}}. {{가을}}에는 {{단풍}}이 예쁘고 {{시원해요}}. {{겨울}}에는 {{눈이 와요}}. {{스키장}}에 가고 {{눈사람}}을 {{만들어요}}.',
        vi: 'Hàn Quốc có bốn mùa. Mùa xuân nhiều hoa và ấm áp. Mùa hè trời mưa. Vì vậy mọi người bơi ở bể bơi. Mùa thu lá phong đẹp và trời mát mẻ. Mùa đông tuyết rơi. Mọi người đi khu trượt tuyết và làm người tuyết.',
      },
      {
        ko: '{{쉬는 시간}}에 친구{{들}}하고 {{이야기했어요}}. Yuki 씨 고향은 {{도쿄}}예요. Wang 씨는 {{베이징}}, Emma 씨는 {{런던}}, Tom 씨는 {{뉴욕}}, Pierre 씨는 {{파리}}, Ivan 씨는 {{모스크바}}에서 왔어요. Maria 씨는 {{브라질}}의 {{브라질리아}}에서 왔어요. Nok 씨는 {{태국}}, Lee 씨는 {{싱가포르}}에서 왔어요.',
        vi: 'Giờ giải lao tôi nói chuyện với các bạn. Quê của Yuki là Tokyo. Wang đến từ Bắc Kinh, Emma từ London, Tom từ New York, Pierre từ Paris, Ivan từ Moskva. Maria đến từ Brasília của Brazil. Nok đến từ Thái Lan, Lee đến từ Singapore.',
      },
      {
        ko: '"태국 날씨는 {{어떻습니까}}?"\n"아주 덥습니다. 그래서 {{선글라스}}하고 {{부채}}, {{슬리퍼}}가 필요해요. 그리고 {{망고}}가 정말 맛있어요."',
        vi: '"Thời tiết Thái Lan thế nào?"\n"Rất nóng. Vì vậy cần kính râm, quạt tay và dép lê. Mà xoài ở đó ngon lắm."',
      },
      {
        ko: '{{작년}} 여름에 {{부산}}에 갔어요. 거기에서 {{생선}}하고 {{삼계탕}}을 먹었어요. {{떡볶이}}는 {{매웠어요}}. 오늘은 날씨가 {{흐려요}}.',
        vi: 'Mùa hè năm ngoái tôi đi Busan. Ở đó tôi ăn cá và gà hầm sâm. Tteokbokki thì cay. Hôm nay trời âm u.',
      },
      {
        ko: '한국어 공부는 {{어렵지만}} {{재미있어요}}. 문법은 {{쉬워요}}. 숙제는 조금 {{재미없어요}}. 제 가방은 {{무거워요}}. 친구 가방은 {{가벼워요}}. 다음 달에 제 {{동생}}이 한국에 와요. 저는 동생에게 "{{조심해서 오세요}}." 하고 말했어요.',
        vi: 'Học tiếng Hàn khó nhưng thú vị. Ngữ pháp thì dễ. Bài tập hơi chán. Cặp của tôi nặng. Cặp của bạn tôi nhẹ. Tháng sau em tôi sang Hàn. Tôi dặn em: "Đi đường cẩn thận nhé."',
      },
    ],
  },

  108: {
    title: '주말에 뭐 할까요?',
    titleVi: 'Cuối tuần mình làm gì nhỉ?',
    note: 'Dùng đủ 53 từ vựng và 4 ngữ pháp của bài: V-(으)ㄹ까요?, bất quy tắc \'ㄷ\', 이[그, 저] N, A/V-네요.',
    paragraphs: [
      {
        ko: '"이번 주말에 같이 {{등산을 할까요}}?"\n"{{그래요}}. 어디로 갈까요?"\n"{{관악산}}에 가요. 학교에서 {{가까워요}}."\n"{{어떻게}} 가요?"\n"{{버스}}를 {{타요}}. 501{{번}} 버스예요."',
        vi: '"Cuối tuần này mình cùng đi leo núi nhé?"\n"Được đó. Mình đi đâu nhỉ?"\n"Đi núi Gwanak đi. Gần trường mình."\n"Đi bằng gì?"\n"Đi xe buýt. Xe buýt số 501."',
      },
      {
        ko: '저는 {{보통}} 주말에 {{낮잠을 자요}}. {{그런데}} 요즘은 좀 {{심심해요}}. 그래서 친구가 {{소개팅}}을 {{소개했어요}}. 언니는 지난주에 {{선을 봤어요}}. 회사 동료들은 {{미팅}}을 해요.',
        vi: 'Cuối tuần tôi thường ngủ trưa. Nhưng mà dạo này hơi buồn chán. Vì vậy bạn tôi giới thiệu cho tôi một buổi hẹn hò làm quen. Chị gái tôi tuần trước đi xem mắt. Đồng nghiệp ở công ty thì đi gặp mặt làm quen theo nhóm.',
      },
      {
        ko: '우리 반 친구들은 취미가 {{많아요}}. Tom 씨는 {{골프를 쳐요}}. Hans 씨는 {{테니스를 쳐요}}. Pierre 씨는 {{기타를 치고}} Emma 씨는 {{피아노를 쳐요}}. Ivan 씨는 친구들하고 {{당구를 쳐요}}. Raj 씨는 {{축구를 하고}} Jack 씨는 {{농구를 해요}}. Wang 씨는 집에서 {{게임을 해요}}.',
        vi: 'Các bạn lớp tôi có nhiều sở thích. Tom chơi golf. Hans chơi tennis. Pierre chơi guitar, Emma chơi piano. Ivan chơi bi-a với bạn bè. Raj đá bóng, Jack chơi bóng rổ. Wang thì chơi game ở nhà.',
      },
      {
        ko: '봄에는 {{한강}}에서 {{자전거를 타요}}. 겨울에는 {{스키를 타고}} {{스케이트를 타요}}.',
        vi: 'Mùa xuân mọi người đạp xe ở sông Hàn. Mùa đông thì trượt tuyết và trượt băng.',
      },
      {
        ko: '저는 {{음악}}을 {{자주}} {{들어요}}. {{라디오}}로 {{뉴스}}도 들어요. 노래는 {{잘}} 못하지만 친구들하고 {{노래방에 가요}}. {{오후}}에는 {{운동장}}에서 {{걸어요}}. 학교까지 {{걸어서 가요}}. 와, {{저기}} {{시청}}이 {{정말}} {{크네요}}!',
        vi: 'Tôi thường xuyên nghe nhạc. Tôi còn nghe tin tức trên radio. Tôi hát không giỏi nhưng vẫn đi karaoke với bạn bè. Buổi chiều tôi đi bộ ở sân vận động. Tôi đi bộ đến trường. Ồ, tòa thị chính đằng kia to thật đấy!',
      },
      {
        ko: '{{수업}}이 끝나고 너무 {{피곤해요}}. 그래서 {{찜질방에 가요}}. 찜질방에서 {{식혜}}를 마셔요. 이제 한국 {{생활}}이 {{조금}} 익숙해요. 한국에서는 {{웃어른}}께 인사를 잘 해야 해요. {{다음}} 방학에는 제주도에서 {{여행을 해요}}.',
        vi: 'Học xong tôi mệt quá. Vì vậy tôi đi xông hơi jjimjilbang. Ở đó tôi uống nước gạo ngọt sikhye. Giờ tôi đã hơi quen với cuộc sống ở Hàn. Ở Hàn Quốc phải chào hỏi người bề trên cho đàng hoàng. Kỳ nghỉ tới tôi sẽ đi du lịch ở đảo Jeju.',
      },
    ],
  },

  109: {
    title: '우리 가족을 소개합니다',
    titleVi: 'Xin giới thiệu gia đình tôi',
    note: 'Dùng đủ 69 từ vựng và 4 ngữ pháp của bài: N(의) N, N을/를 잘하다[잘 못하다, 못하다], N(이)세요, A/V-(으)시-.',
    paragraphs: [
      {
        ko: '이거는 {{우리}} {{가족사진}}이에요. 우리 {{가족}}은 모두 여섯 {{명}}이에요.',
        vi: 'Đây là ảnh gia đình tôi. Gia đình tôi có tất cả sáu người.',
      },
      {
        ko: '이분은 우리 {{할아버지}}세요. {{연세}}가 {{아흔}}이세요. 할아버지는 보통 밤 아홉 시에 {{주무세요}}. 우리 {{할머니}}는 {{여든}} 살이세요. 할머니는 지금 시골 {{댁}}에 {{계세요}}.',
        vi: 'Vị này là ông tôi. Ông chín mươi tuổi rồi. Ông thường đi ngủ lúc chín giờ tối. Bà tôi tám mươi tuổi. Bây giờ bà đang ở nhà dưới quê.',
      },
      {
        ko: '"{{이쪽}}은 누구세요?"\n"{{이분}}은 우리 {{아버지}}세요. 아버지는 {{신문사}} {{사장님}}이세요. 그리고 이분은 우리 {{어머니}}세요. 어머니는 {{중학교}}에서 {{수학}}을 가르치세요. 우리 {{부모님}}은 두 분 다 바쁘세요."',
        vi: '"Người này là ai vậy?"\n"Vị này là bố tôi. Bố tôi là giám đốc một tòa soạn báo. Còn vị này là mẹ tôi. Mẹ dạy toán ở trường trung học cơ sở. Bố mẹ tôi cả hai đều bận."',
      },
      {
        ko: '{{오빠}}는 {{대학교}}에 {{다녀요}}. {{역사}}를 공부해요. 오빠는 {{운전}}을 잘해요. {{언니}}는 작년에 결혼했어요. 언니 {{남편}}은 아주 {{멋있어요}}. 언니도 {{미인}}이에요. 언니는 {{아들}} 하나, {{딸}} 하나가 있어요. {{아기}}가 정말 귀여워요. {{여동생}}은 {{강아지}}를 좋아해요.',
        vi: 'Anh trai tôi đang học đại học. Anh học lịch sử. Anh lái xe giỏi. Chị gái tôi năm ngoái đã kết hôn. Chồng chị rất phong độ. Chị cũng là người đẹp. Chị có một con trai và một con gái. Em bé đáng yêu lắm. Em gái tôi thích cún con.',
      },
      {
        ko: '제 친구 Minho 씨는 저하고 {{같은 과}} 학생이에요. Minho 씨는 {{형}}, {{누나}}, {{남동생}}이 있어요. 형은 결혼해서 {{아내}}하고 같이 살아요. Minho 씨는 {{스물}}두 {{살}}이에요. 형은 {{서른}}, 아버지는 {{쉰}}, 어머니는 {{마흔}}아홉 살이에요. 이웃 할아버지는 {{예순}}, {{일흔}}... 아니, {{백}} 살이 다 되셨어요!',
        vi: 'Bạn tôi là Minho, học cùng khoa với tôi. Minho có anh trai, chị gái và em trai. Anh trai cậu ấy đã kết hôn, sống cùng vợ. Minho hai mươi hai tuổi. Anh trai ba mươi, bố năm mươi, mẹ bốn mươi chín tuổi. Ông cụ hàng xóm sáu mươi, bảy mươi... à không, gần trăm tuổi rồi!',
      },
      {
        ko: '지난주에 Minho 씨 {{집}}에 갔어요. 저는 할아버지께 {{인사했어요}}.\n"할아버지, {{성함}}이 어떻게 되세요?"\n"Kim Cheolsu예요. 학생은 {{이름}}이 뭐예요? {{나이}}는요?"\n"Lan이에요. 스물한 살이에요."\n"한국어를 정말 잘하네요!"\n"{{뭘요}}."',
        vi: 'Tuần trước tôi đến nhà Minho. Tôi chào ông của cậu ấy.\n"Thưa ông, quý danh của ông là gì ạ?"\n"Ông là Kim Cheolsu. Cháu tên là gì? Bao nhiêu tuổi rồi?"\n"Cháu là Lan. Cháu hai mươi mốt tuổi ạ."\n"Cháu nói tiếng Hàn giỏi thật đấy!"\n"Có gì đâu ạ."',
      },
      {
        ko: '할아버지는 정말 좋은 {{분}}이세요. 아주 {{친절하세요}}. 할아버지가 "어서 {{드세요}}." 하고 말씀하셨어요. 저는 밥을 많이 {{먹었어요}}. 저는 {{다른 나라}}에서 {{태어났어요}}. {{전에}}는 베트남에 {{있었어요}}. 제 {{취미}}는 요리예요. 요즘 학교 {{동아리}}에서 요리를 배워요. 저는 요리사가 {{되고}} 싶어요. Minho 씨 어머니{{한테서}} 김치 만드는 법도 배웠어요. 할아버지는 계속 {{웃으셨어요}}. 그날 저는 {{열}} 시에 집에 와서 바로 {{잤어요}}.',
        vi: 'Ông là một người thật tốt. Ông rất thân thiện. Ông bảo: "Ăn đi cháu." Tôi ăn rất nhiều cơm. Tôi sinh ra ở một nước khác. Trước đây tôi ở Việt Nam. Sở thích của tôi là nấu ăn. Dạo này tôi học nấu ăn ở câu lạc bộ của trường. Tôi muốn trở thành đầu bếp. Tôi còn học được cách làm kimchi từ mẹ của Minho. Ông cứ cười mãi. Hôm đó mười giờ tôi về đến nhà rồi ngủ luôn.',
      },
    ],
  },

  110: {
    title: '저의 하루와 방학 계획',
    titleVi: 'Một ngày của tôi và kế hoạch kỳ nghỉ',
    note: 'Dùng đủ 41 từ vựng và 4 ngữ pháp của bài: thời gian (N시 N분), N부터 N까지, V-아서/어서 (trình tự), V-(으)ㄹ 거예요.',
    paragraphs: [
      {
        ko: '저는 보통 {{아침}} 일곱 {{시}}에 {{일어나요}}. 일어나서 {{세수해요}}. 그리고 {{샤워해요}}. 일곱 시 {{반}}에 정류장에 가서 {{버스를 기다려요}}. 그리고 {{버스를 타요}}.',
        vi: 'Tôi thường dậy lúc bảy giờ sáng. Dậy xong tôi rửa mặt. Rồi tắm vòi sen. Bảy giờ rưỡi tôi ra trạm chờ xe buýt. Rồi lên xe buýt.',
      },
      {
        ko: '{{오전}} 아홉 시부터 열두 시까지 {{수업을 해요}}. {{오후}}에는 도서관에서 발음 {{연습}}을 해요. {{저녁}}에는 {{요리해요}}. 밤 열 시{{쯤}} {{컴퓨터를 해요}}. 친구에게 {{이메일}}을 보내요.',
        vi: 'Từ chín giờ sáng đến mười hai giờ tôi học trên lớp. Buổi chiều tôi luyện phát âm ở thư viện. Buổi tối tôi nấu ăn. Khoảng mười giờ đêm tôi dùng máy tính. Tôi gửi email cho bạn bè.',
      },
      {
        ko: '토요일 {{낮}}에는 {{청소해요}}. 그리고 {{빨래해요}}. {{밤}}에는 남자 친구하고 {{데이트해요}}. 우리는 {{강남}}이나 {{여의도}}에 가요.',
        vi: 'Ban ngày thứ bảy tôi dọn dẹp. Rồi giặt đồ. Ban đêm tôi hẹn hò với bạn trai. Chúng tôi đi Gangnam hoặc Yeouido.',
      },
      {
        ko: '언니는 회사원이에요. 언니는 아침 여덟 시 이십 {{분}}에 회사에 가요. 언니는 회사까지 {{운전해요}}. 오전에는 {{회의해요}}. 오후에는 손님에게 {{전화해요}}.',
        vi: 'Chị tôi là nhân viên công ty. Chị đến công ty lúc tám giờ hai mươi phút sáng. Chị tự lái xe đến công ty. Buổi sáng chị họp. Buổi chiều chị gọi điện cho khách hàng.',
      },
      {
        ko: '다음 주부터 {{방학}}이에요. {{이번}} 방학에는 {{전주}}에 갈 거예요. 전주에서 한국 {{전통}} 집을 보고 {{박물관}}에도 갈 거예요. 거기에서 그림도 {{그릴}} 거예요. {{그렇지만}} 먼저 {{출입국관리사무소}}에 가야 돼요. 그리고 {{인천}} 공항에서 친구를 만날 거예요.',
        vi: 'Từ tuần sau là kỳ nghỉ rồi. Kỳ nghỉ này tôi sẽ đi Jeonju. Ở Jeonju tôi sẽ xem nhà truyền thống Hàn Quốc và đi cả bảo tàng nữa. Tôi cũng sẽ vẽ tranh ở đó. Nhưng trước tiên tôi phải đến phòng quản lý xuất nhập cảnh. Rồi tôi sẽ gặp bạn ở sân bay Incheon.',
      },
      {
        ko: '내일은 {{시험을 봐요}}. 그래서 {{새벽}} 다섯 시에 일어날 거예요. {{조금 후}}에 친구에게 전화할 거예요. 친구에게 이렇게 말할 거예요. "{{주말 잘 보내세요}}!"',
        vi: 'Ngày mai tôi thi. Vì vậy tôi sẽ dậy lúc năm giờ sáng sớm. Lát nữa tôi sẽ gọi điện cho bạn. Tôi sẽ nói với bạn thế này: "Chúc cuối tuần vui vẻ nhé!"',
      },
    ],
  },

  111: {
    title: '감기에 걸렸어요',
    titleVi: 'Tôi bị cảm rồi',
    note: 'Dùng đủ 65 từ vựng và 4 ngữ pháp của bài: \'ㅡ\' 탈락, V-지 마세요, N만, V-아야/어야 되다.',
    paragraphs: [
      {
        ko: '어제부터 {{몸}}이 안 좋아요. {{머리}}가 아프고 {{열이 나요}}. {{기침을 해요}}. {{콧물이 나요}}. {{목이 아파요}}. {{몸살}}도 있어요. {{감기에 걸렸어요}}.',
        vi: 'Từ hôm qua người tôi không khỏe. Đầu đau và bị sốt. Tôi ho. Sổ mũi. Đau họng. Còn bị ê ẩm cả người. Tôi bị cảm rồi.',
      },
      {
        ko: '의사 선생님이 말했어요. "요즘 감기가 {{유행이에요}}. {{약}}을 먹고 {{푹 쉬세요}}. {{따뜻한 물}}을 많이 마셔야 돼요. {{얼음물}}은 마시지 마세요. {{소금물}}로 입을 {{헹구세요}}. 목이 아프니까 {{말을 하지}} 마세요."',
        vi: 'Bác sĩ nói: "Dạo này cảm cúm đang lây lan. Uống thuốc rồi nghỉ ngơi cho thật khỏe. Phải uống nhiều nước ấm. Đừng uống nước đá. Hãy súc miệng bằng nước muối. Đang đau họng nên đừng nói nhiều."',
      },
      {
        ko: '"{{술}}을 마시지 마세요. {{담배를 피우지}} 마세요. {{무리하지}} 마세요. {{오래}} 컴퓨터를 하지 마세요. {{피시방}}에도 가지 마세요."\n"네, {{알겠어요}}."',
        vi: '"Đừng uống rượu. Đừng hút thuốc. Đừng làm quá sức. Đừng dùng máy tính lâu. Cũng đừng ra quán net."\n"Vâng, tôi hiểu rồi."',
      },
      {
        ko: '할머니는 "{{무즙}}에 꿀을 넣어서 마셔." 하고 말씀하셨어요. {{파}}를 넣은 국도 감기에 좋아요. 할머니가 제 등에 파스를 {{붙이셨어요}}. 언니는 제 {{어깨}}를 {{마사지해요}}.',
        vi: 'Bà bảo: "Cho mật ong vào nước ép củ cải rồi uống đi." Canh có hành lá cũng tốt cho người bị cảm. Bà dán miếng dán giảm đau lên lưng tôi. Chị tôi mát-xa vai cho tôi.',
      },
      {
        ko: '오늘 아침에 {{알람}}을 {{껐어요}}. 그래서 학교에 {{늦었어요}}. 저는 {{눈}}, {{코}}, {{입}}, {{귀}}가 다 아파요. {{얼굴}}도 빨개요. {{목}}, {{가슴}}, {{허리}}, {{팔}}, {{다리}}, {{무릎}}, {{발}}이 다 아파요. {{손}}도 차가워요. {{배}}는 안 아프지만 {{배고파요}}.',
        vi: 'Sáng nay tôi tắt báo thức. Vì vậy tôi đến trường muộn. Mắt, mũi, miệng, tai tôi đều đau. Mặt cũng đỏ. Cổ, ngực, lưng, tay, chân, đầu gối, bàn chân đều đau. Tay cũng lạnh. Bụng thì không đau nhưng tôi đói.',
      },
      {
        ko: '내일까지 {{리포트}}를 {{내야}} 돼요. 그런데 {{너무}} {{바빠요}}. 그래서 오늘은 리포트만 {{써요}}. 그리고 손을 {{씻고}} 일찍 잘 거예요. 자기 전에 {{목욕해야}} 돼요.',
        vi: 'Đến mai tôi phải nộp bài báo cáo. Nhưng tôi bận quá. Vì vậy hôm nay tôi chỉ viết báo cáo thôi. Rồi rửa tay và đi ngủ sớm. Trước khi ngủ phải tắm.',
      },
      {
        ko: '어머니가 전화했어요. "엄마, {{걱정}}하지 마세요. 저는 {{괜찮아요}}." 어머니는 "{{다행이다}}." 하셨어요. 다음 주는 할머니 {{생신}}이에요. 할머니께 {{편지}}를 쓸 거예요. {{내년}}에는 언니가 {{결혼해요}}. 언니는 정말 {{예뻐요}}. 그런데 어제 언니하고 {{싸웠어요}}. 그래서 기분이 {{나빠요}}. {{이렇게}} 아프니까 집에 {{손님}}도 못 오세요. 한국어 {{발음}} 연습도 못 했어요.',
        vi: 'Mẹ gọi điện. "Mẹ ơi, đừng lo ạ. Con không sao." Mẹ nói: "Thật may quá." Tuần sau là sinh nhật bà. Tôi sẽ viết thư cho bà. Năm sau chị tôi kết hôn. Chị đẹp lắm. Nhưng hôm qua tôi cãi nhau với chị. Vì vậy tâm trạng không tốt. Ốm thế này nên khách cũng không đến nhà được. Tôi cũng chưa luyện được phát âm tiếng Hàn.',
      },
    ],
  },

  112: {
    title: '여보세요?',
    titleVi: 'Alô?',
    note: 'Dùng đủ 28 từ vựng và 4 ngữ pháp của bài: A/V-지요?, N(이)지요?, V-고 있다, 못 V, A/V-아서/어서 (lý do).',
    paragraphs: [
      {
        ko: '"{{여보세요}}?"\n"여보세요. Lan 씨 휴대폰이지요?"\n"네, {{그렇습니다}}. {{실례지만 누구세요?}}"\n"저 Minho예요. {{오랜만이에요}}!"',
        vi: '"Alô?"\n"Alô. Đây là điện thoại của Lan phải không?"\n"Vâng, đúng vậy. Xin lỗi, ai đấy ạ?"\n"Mình là Minho đây. Lâu rồi không gặp!"',
      },
      {
        ko: '"{{조금 전}}에 {{전화를 했어요}}. {{왜}} 안 받았어요?"\n"미안해요. 오늘 {{늦잠}}을 자서 정신이 없었어요. {{아까}}는 샤워하고 있었어요. 지금 {{전화를 받았어요}}."',
        vi: '"Lúc nãy mình gọi điện cho bạn. Sao bạn không nghe máy?"\n"Xin lỗi nhé. Hôm nay mình ngủ dậy muộn nên cuống cả lên. Lúc nãy mình đang tắm. Giờ mình nghe máy rồi đây."',
      },
      {
        ko: '"오늘 저녁에 시간 있지요? 같이 밥 먹어요."\n"{{그럼요}}! {{장소}}는 어디예요?"\n"{{이따}} {{문자를 보낼게요}}."',
        vi: '"Tối nay bạn rảnh chứ? Cùng đi ăn đi."\n"Tất nhiên rồi! Địa điểm ở đâu?"\n"Lát nữa mình nhắn tin cho."',
      },
      {
        ko: '조금 후에 Minho 씨한테서 {{문자를 받았어요}}. "7시, 학교 앞 식당. 제 새 {{휴대폰 번호}}는 {{공}}일공-1234-5678이에요." 그런데 Minho 씨 새 {{전화번호}}를 {{몰라서}} 다시 확인했어요.',
        vi: 'Một lúc sau tôi nhận được tin nhắn của Minho. "7 giờ, quán ăn trước cổng trường. Số điện thoại di động mới của mình là 010-1234-5678." Vì không biết số điện thoại mới của Minho nên tôi kiểm tra lại.',
      },
      {
        ko: '저녁에 식당에서 Minho 씨가 말했어요. "오늘 {{사무실}}에 {{일}}이 많았어요. 그리고 회사 근처에서 {{사고가 났어요}}. 옆 건물에는 {{불이 났어요}}. 지난주에는 우리 집에 {{도둑이 들었어요}}." 한 주에 무서운 일이 {{다}} 있었네요.',
        vi: 'Buổi tối ở quán ăn, Minho kể: "Hôm nay văn phòng nhiều việc lắm. Rồi gần công ty còn xảy ra tai nạn. Tòa nhà bên cạnh thì bị cháy. Tuần trước nhà mình còn bị trộm vào." Trong một tuần mà có đủ cả chuyện đáng sợ.',
      },
      {
        ko: '그런데 이 식당 음식은 {{맛없어요}}. 그래서 우리는 {{다른}} 식당에 갔어요. Minho 씨는 다음 달부터 {{여행사}}에서 일할 거예요.',
        vi: 'Mà đồ ăn ở quán này không ngon. Vì vậy chúng tôi chuyển sang quán khác. Từ tháng sau Minho sẽ làm việc ở một công ty du lịch.',
      },
    ],
  },

  113: {
    title: '서울역으로 가 주세요',
    titleVi: 'Làm ơn đi đến ga Seoul',
    note: 'Dùng đủ 47 từ vựng và 4 ngữ pháp của bài: V-(으)려고 하다, N에서 N까지, V-아/어 주다, N(으)로.',
    paragraphs: [
      {
        ko: '{{얼마 전}}에 친구가 {{몽골}}에서 한국에 왔어요. 친구는 {{비행기}}를 타고 {{김포공항}}에 도착했어요. 저는 공항에서 친구를 만나려고 했어요.',
        vi: 'Cách đây không lâu, bạn tôi từ Mông Cổ sang Hàn Quốc. Bạn ấy đi máy bay đến sân bay Gimpo. Tôi định ra sân bay đón bạn.',
      },
      {
        ko: '우리는 공항에서 택시를 탔어요.\n"기사님, {{서울역}}으로 가 주세요. 서울역까지 {{얼마나}} {{걸려요}}?"\n"삼십 분 {{안에}} 도착해요."\n"{{요금}}이 좀 비싸네요. 조금 {{깎아}} 주세요."\n"하하, 안 돼요. 이 길로 {{쭉}} 가요. 저기 {{신호등}} 앞에서 차를 {{세워}} 줄게요."\n"{{그러면}} 거기서 {{내려요}}."',
        vi: 'Chúng tôi bắt taxi ở sân bay.\n"Bác tài ơi, làm ơn đi đến ga Seoul. Đến ga Seoul mất bao lâu ạ?"\n"Trong vòng ba mươi phút là tới."\n"Cước hơi đắt nhỉ. Bác bớt cho cháu chút ạ."\n"Haha, không được đâu. Đi thẳng đường này. Bác sẽ dừng xe trước đèn giao thông đằng kia."\n"Vậy chúng cháu xuống ở đó ạ."',
      },
      {
        ko: '친구는 {{한국말}}을 {{아직}} 잘 못해요. 그래서 제가 친구를 {{도와}} 줬어요. 서울역은 큰 {{기차역}}이에요. 사람이 아주 많았어요.',
        vi: 'Bạn tôi vẫn chưa nói giỏi tiếng Hàn. Vì vậy tôi giúp bạn ấy. Ga Seoul là một ga tàu lớn. Người rất đông.',
      },
      {
        ko: '{{다음 날}} 우리는 {{경주}}에 가려고 했어요. 저는 인터넷으로 시간을 {{알아봤어요}}. 서울에서 경주까지 {{기차}}{{나}} {{버스}}로 갈 수 있어요. {{고속버스 터미널}}에서 버스를 타면 네 {{시간}} 걸려요.',
        vi: 'Hôm sau chúng tôi định đi Gyeongju. Tôi tìm hiểu giờ giấc trên mạng. Từ Seoul đến Gyeongju có thể đi tàu hỏa hoặc xe buýt. Đi xe buýt từ bến xe cao tốc thì mất bốn tiếng.',
      },
      {
        ko: '서울은 교통이 아주 {{편리해요}}. 사람들은 {{지하철}}을 많이 {{사용해요}}. {{지하철역}}에서 2{{호선}}을 {{타요}}. 시청역에서 1호선으로 {{갈아타요}}. {{버스 정류장}}도 많아요. {{택시}}, {{자전거}}, {{오토바이}}도 있어요. 제주도에는 {{배}}로도 갈 수 있어요. {{인천항 터미널}}에서 배를 타요.',
        vi: 'Giao thông ở Seoul rất tiện lợi. Mọi người dùng tàu điện ngầm rất nhiều. Ở ga tàu điện ngầm, lên tuyến số 2. Đến ga Tòa thị chính thì chuyển sang tuyến số 1. Trạm xe buýt cũng nhiều. Còn có taxi, xe đạp, xe máy. Đến đảo Jeju còn có thể đi bằng tàu thủy. Lên tàu ở bến cảng Incheon.',
      },
      {
        ko: '우리 학교는 기숙사에서 {{멀어요}}. 매일 학교 {{정문}} 앞에서 버스에서 내려요. 교실에 들어가서 문을 {{닫았어요}}. 선생님이 {{칠판}}에 글을 쓰셨어요. 쉬는 시간에 친구들하고 {{가위바위보}}를 했어요. 그런데 밖에서 {{구급차}} 소리가 들렸어요. 길에서 한 아이가 {{울었어요}}.',
        vi: 'Trường tôi ở xa ký túc xá. Ngày nào tôi cũng xuống xe buýt trước cổng chính của trường. Vào lớp, tôi đóng cửa lại. Cô giáo viết chữ lên bảng đen. Giờ giải lao, tôi chơi oẳn tù tì với các bạn. Nhưng bên ngoài vang lên tiếng xe cấp cứu. Có một đứa trẻ khóc trên đường.',
      },
    ],
  },

  114: {
    title: '이 옷을 입어 보세요',
    titleVi: 'Hãy mặc thử bộ đồ này',
    note: 'Dùng đủ 61 từ vựng và 4 ngữ pháp của bài: \'ㄹ\' 탈락, A-(으)ㄴ N, N한테[께], V-아/어 보세요.',
    paragraphs: [
      {
        ko: '다음 주에 한국어 {{수료식}}이 있어요. 그래서 {{새}} 옷을 사러 백화점에 갔어요.',
        vi: 'Tuần sau có lễ bế giảng khóa tiếng Hàn. Vì vậy tôi đến trung tâm thương mại mua quần áo mới.',
      },
      {
        ko: '"손님, {{어떤}} 옷을 찾으세요?"\n"{{원피스}}를 사고 싶어요. 그런데 제 {{스타일}}을 잘 {{모르겠어요}}."\n"이 원피스를 {{한번}} {{입어}} 보세요. 요즘 {{유행이에요}}."',
        vi: '"Chị tìm loại quần áo nào ạ?"\n"Tôi muốn mua váy liền. Nhưng tôi không rõ phong cách của mình lắm."\n"Chị mặc thử chiếc váy này một lần xem. Dạo này đang hợp mốt lắm."',
      },
      {
        ko: '원피스는 {{귀여웠어요}}. 하지만 조금 {{작았어요}}. 그리고 너무 {{짧았어요}}. {{긴}} 원피스도 있었지만 {{비쌌어요}}. 그래서 {{싼}} {{치마}}하고 {{셔츠}}를 샀어요. 새 {{바지}}도 샀어요. 치마가 아주 {{편해요}}.',
        vi: 'Chiếc váy dễ thương lắm. Nhưng hơi nhỏ. Lại còn ngắn quá. Cũng có váy dài nhưng đắt. Vì vậy tôi mua một chiếc chân váy và áo sơ mi giá rẻ. Tôi còn mua một chiếc quần mới. Chân váy rất thoải mái.',
      },
      {
        ko: '제 친구 Minho 씨는 {{키}}가 크고 {{체격이 좋아요}}. Minho 씨는 {{양복}}을 샀어요. 까만 {{구두}}도 {{신었어요}}. 정말 {{똑똑해}} 보여요. Minho 씨 동생은 {{청바지}}, {{티셔츠}}, {{운동화}}를 좋아해요. 동생 옷은 {{단순해요}}.',
        vi: 'Bạn tôi là Minho cao và có vóc dáng đẹp. Minho mua một bộ com-lê. Cậu ấy còn đi đôi giày da màu đen. Trông thông minh thật. Em của Minho thích quần jean, áo phông và giày thể thao. Quần áo của em ấy đơn giản.',
      },
      {
        ko: '지금은 겨울이에요. 저는 {{두꺼운}} {{코트}}를 입고 {{목도리}}를 {{해요}}. {{모자}}도 {{쓰고}} 나가요. {{얇은}} 옷은 추워요. {{미니스커트}}는 겨울에 {{불편해요}}. 할머니께 {{한복}}을 입은 사진을 {{보냈어요}}.',
        vi: 'Bây giờ đang là mùa đông. Tôi mặc áo khoác dày và quàng khăn. Tôi còn đội mũ rồi mới ra ngoài. Quần áo mỏng thì lạnh. Váy ngắn mặc vào mùa đông thì bất tiện. Tôi gửi cho bà tấm ảnh mặc hanbok.',
      },
      {
        ko: '수료식 날 아침, 저는 {{먼저}} 선생님께 꽃을 {{드렸어요}}. 선물 상자를 {{열어}} 보고 선생님은 {{놀라셨어요}}. 선생님의 {{마음}}이 정말 따뜻했어요. 친구에게는 {{귀걸이}}를 {{선물했어요}}. 친구가 아주 {{기뻐했어요}}. Minho 씨는 {{큰}} 가방을 {{가지고}} 왔어요. 가방 안에 {{사탕}}하고 {{막걸리}}가 있었어요. "모두 {{축하}}해요!" 우리는 밤까지 {{놀았어요}}.',
        vi: 'Sáng ngày bế giảng, trước tiên tôi biếu cô giáo một bó hoa. Mở thử hộp quà ra, cô rất ngạc nhiên. Tấm lòng của cô thật ấm áp. Tôi tặng bạn một đôi khuyên tai. Bạn tôi rất vui. Minho mang theo một chiếc túi to. Trong túi có kẹo và rượu makgeolli. "Chúc mừng tất cả mọi người!" Chúng tôi chơi đến tận đêm.',
      },
      {
        ko: '수료식은 {{높은}} 건물 이십 층에서 했어요. 창문이 {{낮아서}} 밖이 다 보였어요. 저는 높은 곳이 {{무서워요}}. 그래서 친구에게 "괜찮아?" 하고 {{물어봤어요}}. 친구들은 곧 다른 {{도시}}에서 {{살아요}}. 그래서 조금 {{슬퍼요}}.',
        vi: 'Lễ bế giảng tổ chức ở tầng hai mươi của một tòa nhà cao. Cửa sổ thấp nên nhìn rõ hết bên ngoài. Tôi sợ chỗ cao. Vì vậy tôi hỏi bạn: "Cậu có sao không?" Các bạn tôi sắp sống ở thành phố khác rồi. Vì vậy tôi hơi buồn.',
      },
    ],
  },

  115: {
    title: '여행을 가고 싶어요',
    titleVi: 'Tôi muốn đi du lịch',
    note: 'Dùng đủ 39 từ vựng và 4 ngữ pháp của bài: A/V-(으)면, V-는 N, V-고 싶다, V-고 싶어 하다.',
    paragraphs: [
      {
        ko: '다음 달에 {{휴가}}가 있어요. 그래서 {{여행하고}} 싶어요. 저는 친구에게 {{질문}}을 했어요. "어디가 좋아요?"',
        vi: 'Tháng sau tôi có kỳ nghỉ phép. Vì vậy tôi muốn đi du lịch. Tôi hỏi bạn: "Đi đâu thì hay?"',
      },
      {
        ko: '친구가 대답했어요. "{{춘천}}에 가 보세요. 춘천에서 {{남이섬}}에 갈 수 있어요. {{섬}}에 가면 {{경치가 아름다워요}}. 그리고 {{사람도 없고 조용해요}}. {{삼악산}}에도 {{올라가요}}. 춘천은 {{닭갈비}}하고 {{막국수}}가 유명해요."',
        vi: 'Bạn tôi trả lời: "Thử đi Chuncheon xem. Từ Chuncheon có thể đến đảo Nami. Ra đảo thì cảnh rất đẹp. Lại vắng người và yên tĩnh. Còn có thể leo lên núi Samak. Chuncheon nổi tiếng với gà xào cay dakgalbi và mì kiều mạch."',
      },
      {
        ko: '"부산 {{해운대}}도 좋아요. 부산은 {{맛있는 음식이 많아요}}. 그리고 {{구경거리가 많아요}}. {{야구장}}에서 {{야구 경기}}도 볼 수 있어요."\n"{{안동}}은 어때요?"\n"안동은 {{찜닭}}이 맛있어요. 시장 {{물건값이 싸요}}."',
        vi: '"Biển Haeundae ở Busan cũng hay. Busan có nhiều món ngon. Lại có nhiều thứ để ngắm. Còn có thể xem trận bóng chày ở sân bóng chày nữa."\n"Andong thì sao?"\n"Andong có món gà hầm jjimdak ngon lắm. Giá đồ ở chợ rẻ."',
      },
      {
        ko: '"{{용인}}에는 큰 놀이공원이 있어요. 거기에서 {{말}}도 탈 수 있어요. {{평창}}에서는 겨울에 스키를 타요. 서울에도 좋은 {{미술관}}이 많아요."',
        vi: '"Yongin có công viên giải trí lớn. Ở đó còn có thể cưỡi ngựa. Ở Pyeongchang mùa đông thì trượt tuyết. Ở Seoul cũng có nhiều bảo tàng mỹ thuật hay."',
      },
      {
        ko: '제 언니는 다음 달에 결혼해요. 언니는 {{신혼여행}}으로 외국에 가고 싶어 해요. 작년에 형부가 바다가 {{보이는}} {{곳}}에서 {{프러포즈}}를 했어요. 그때 형부가 {{반지}}를 줬어요. 언니는 지금 {{여권을 만들어요}}. 그리고 {{비행기 표를 예매하고}} {{호텔을 예약했어요}}. 은행에서 {{돈을 바꿨어요}}.',
        vi: 'Chị gái tôi tháng sau kết hôn. Chị muốn đi nước ngoài hưởng tuần trăng mật. Năm ngoái anh rể cầu hôn chị ở một nơi nhìn ra biển. Lúc đó anh tặng chị một chiếc nhẫn. Bây giờ chị đang làm hộ chiếu. Chị đã đặt vé máy bay và đặt khách sạn. Chị còn đổi tiền ở ngân hàng.',
      },
      {
        ko: '언니는 9월 10일에 {{출발해요}}. 아침에 서울을 {{떠나서}} 저녁에 파리에 {{도착해요}}. 일주일 후에 {{돌아와요}}. 언니는 여행 가는 {{날}}을 기다리고 있어요. 언니는 요즘 아주 {{즐거워요}}.',
        vi: 'Chị khởi hành vào ngày 10 tháng 9. Sáng rời Seoul, tối đến Paris. Một tuần sau chị quay về. Chị đang chờ đến ngày lên đường. Dạo này chị vui lắm.',
      },
    ],
  },

  116: {
    title: '우리 집에 올 수 있어요?',
    titleVi: 'Bạn đến nhà mình được không?',
    note: 'Dùng đủ 36 từ vựng và 4 ngữ pháp của bài: V-(으)ㄹ 수 있다[없다], V-(으)ㄹ게요, V-(으)러 가다[오다], V-(으)면서.',
    paragraphs: [
      {
        ko: '저는 지난주에 {{이사를 했어요}}. 그래서 이번 {{휴일}}에 친구들을 집에 {{초대하려고}} 해요. 작은 {{모임}}을 {{계획했어요}}.',
        vi: 'Tuần trước tôi chuyển nhà. Vì vậy ngày nghỉ lần này tôi định mời bạn bè đến nhà. Tôi đã lên kế hoạch cho một buổi họp mặt nhỏ.',
      },
      {
        ko: '친구에게 {{연락했어요}}. "토요일에 우리 집에 올 수 있어요?"\n"{{참}}, 그날 {{별일}} 없어요. 갈 수 있어요. 뭐 {{사 갈게요}}?"\n"{{아니에요}}, 그냥 오세요."\n"그럼 {{음료수}}하고 {{팝콘}}을 사 갈게요."',
        vi: 'Tôi liên lạc với bạn. "Thứ bảy bạn đến nhà mình được không?"\n"À mà, hôm đó mình không có việc gì đặc biệt. Mình đến được. Mình mua gì mang đến nhé?"\n"Không cần đâu, cứ đến thôi."\n"Vậy mình mua đồ uống với bỏng ngô mang đến."',
      },
      {
        ko: '다른 친구는 이메일로 {{답장}}을 보냈어요. "잘 {{몰라요}}. 그날 일이 있을 수도 있어요." 그래서 저는 제 {{이메일 주소}}를 다시 알려 줬어요.',
        vi: 'Một người bạn khác trả lời qua email: "Mình chưa biết nữa. Hôm đó có thể mình có việc." Vì vậy tôi gửi lại địa chỉ email của mình cho bạn ấy.',
      },
      {
        ko: '토요일 아침, {{일찍}} 일어나서 음식을 {{준비했어요}}. 은행에 가서 {{돈을 찾았어요}}. 마트에서 {{세제}}도 샀어요. 친구들이 {{늦게}} 오면 안 돼요. "{{빨리}} 오세요!"',
        vi: 'Sáng thứ bảy, tôi dậy sớm chuẩn bị đồ ăn. Tôi ra ngân hàng rút tiền. Ở siêu thị tôi còn mua bột giặt. Các bạn không được đến muộn đâu nhé. "Đến nhanh lên!"',
      },
      {
        ko: '친구들이 집에 {{들어왔어요}}. 우리는 같이 {{식사했어요}}. 음식을 {{많이}} 먹었어요. 노래를 부르면서 {{춤을 췄어요}}. 여러 가지 {{놀이}}도 했어요. 정말 즐겁게 {{시간을 보냈어요}}.',
        vi: 'Các bạn bước vào nhà. Chúng tôi cùng dùng bữa. Chúng tôi ăn rất nhiều. Vừa hát vừa nhảy. Còn chơi đủ loại trò chơi. Chúng tôi đã có khoảng thời gian thật vui.',
      },
      {
        ko: '친구 한 명은 다음 달에 {{세계}} 여행을 가요. 친구는 {{열심히}} 일해서 돈을 모았어요. "나는 {{부자}}가 아니에요. {{조금}}씩 모았어요." 저는 이번 시험 {{점수}}가 좋아서 친구들이 {{축하해}} 줬어요. 친구가 제 한국어 실력이 {{잘}} 늘었다고 했어요. "다음에 또 만나요. {{곧}} 연락할게요. {{천천히}} 가세요!"',
        vi: 'Một người bạn tháng sau sẽ đi du lịch vòng quanh thế giới. Bạn ấy làm việc chăm chỉ để dành dụm tiền. "Mình không phải người giàu đâu. Mình để dành từng chút một." Lần thi này điểm của tôi cao nên các bạn chúc mừng tôi. Bạn tôi nói tiếng Hàn của tôi tiến bộ tốt. "Lần sau lại gặp nhé. Mình sẽ liên lạc sớm. Đi từ từ thôi nhé!"',
      },
    ],
  },

  // ── TOPIK II (Seoul Korean 2, bài 1-18) ──
  1: {
    title: '처음 뵙겠습니다',
    titleVi: 'Rất hân hạnh được gặp bạn',
    note: 'Dùng đủ 44 từ vựng và 2 ngữ pháp của bài: N(이)라고 하다, V-(으)려고.',
    paragraphs: [
      {
        ko: '처음 {{뵙겠습니다}}. 저는 Lan이라고 해요. 베트남에서 왔어요. 한국어를 배우려고 한국에 왔어요.',
        vi: 'Rất hân hạnh được gặp mọi người. Tôi tên là Lan. Tôi đến từ Việt Nam. Tôi sang Hàn Quốc để học tiếng Hàn.',
      },
      {
        ko: '오늘 {{외국인등록증}}을 만들었어요. 서류에 {{성명}}, {{성}}, {{성별}}, {{생년월일}}, {{국적}}, {{주소}}, {{연락처}}, {{이메일}}, {{직업}}, {{종교}}를 썼어요. {{신분증}}도 보여 줬어요. 사무실에는 {{외국인}}이 정말 많았어요.',
        vi: 'Hôm nay tôi làm thẻ đăng ký người nước ngoài. Tôi điền vào tờ khai họ tên, họ, giới tính, ngày sinh, quốc tịch, địa chỉ, thông tin liên lạc, email, nghề nghiệp, tôn giáo. Tôi còn xuất trình giấy tờ tùy thân. Trong văn phòng có rất nhiều người nước ngoài.',
      },
      {
        ko: '수업 시간에 선생님이 제 {{이름을 불렀어요}}.\n"Lan 씨는 왜 한국어를 배워요? {{이유}}가 뭐예요?"\n"한국 {{문화}}를 좋아해요. 그리고 한국 {{친구를 사귀려고}} 해요."',
        vi: 'Trong giờ học, cô giáo gọi tên tôi.\n"Lan, sao em học tiếng Hàn? Lý do là gì?"\n"Em thích văn hóa Hàn Quốc. Và em muốn kết bạn với người Hàn ạ."',
      },
      {
        ko: '저는 {{평일}}에는 {{매일}} 학교에 가요. 주말에 {{시간이 나면}} {{소설책}}을 읽어요. {{가끔}} 영화도 봐요. 고향에 있는 가족에게 {{매주}} {{전화}}를 해요. 부모님은 {{매달}} 생활비를 보내 주세요. 저는 {{매년}} 여름에 고향에 가요.',
        vi: 'Ngày thường hôm nào tôi cũng đến trường. Cuối tuần có thời gian rảnh thì tôi đọc tiểu thuyết. Thỉnh thoảng cũng xem phim. Tuần nào tôi cũng gọi điện cho gia đình ở quê. Bố mẹ gửi tiền sinh hoạt cho tôi mỗi tháng. Năm nào tôi cũng về quê vào mùa hè.',
      },
      {
        ko: '제 룸메이트는 멕시코 사람이에요. 우리는 아주 {{친해요}}. 룸메이트는 {{형제들}}이 다섯 명이에요. 룸메이트는 {{스페인어}}를 해요. 스페인어는 {{중남미}}의 많은 나라에서 쓰는 {{언어}}예요. 스페인어 {{글자}}는 영어하고 {{비슷해요}}. 우리는 {{항상}} 같이 밥을 먹어요. 룸메이트는 마트에서 과일을 {{사 와요}}. 저는 {{자주}} 요리를 해요.',
        vi: 'Bạn cùng phòng của tôi là người Mexico. Chúng tôi rất thân. Bạn ấy có năm anh chị em. Bạn ấy nói tiếng Tây Ban Nha. Tiếng Tây Ban Nha là ngôn ngữ được dùng ở nhiều nước Trung và Nam Mỹ. Chữ cái tiếng Tây Ban Nha giống tiếng Anh. Chúng tôi lúc nào cũng ăn cơm cùng nhau. Bạn ấy mua hoa quả ở siêu thị mang về. Tôi thì thường xuyên nấu ăn.',
      },
      {
        ko: '룸메이트는 내년에 대학원에 {{들어가려고}} 해요. 다음 주에는 수업에서 멕시코 음식{{에 대해서}} {{발표해요}}. 발표 시간은 십 분 {{정도}}예요. 룸메이트는 멕시코 음식 중에서 타코를 {{제일}} 좋아해요. 그래서 고추를 {{빼고}} 타코를 만들려고 해요. 저는 "{{그냥}} 넣어도 돼요!" 하고 말했어요.',
        vi: 'Năm sau bạn cùng phòng của tôi định vào học cao học. Tuần sau bạn ấy thuyết trình về món ăn Mexico trong giờ học. Thời gian thuyết trình khoảng mười phút. Trong các món Mexico, bạn ấy thích nhất là taco. Vì vậy bạn ấy định làm taco nhưng bỏ ớt ra. Tôi nói: "Cứ cho vào cũng được mà!"',
      },
    ],
  },

  2: {
    title: '취미가 뭐예요?',
    titleVi: 'Sở thích của bạn là gì?',
    note: 'Dùng đủ 38 từ vựng và 4 ngữ pháp của bài: V-는 것, V-(으)ㄹ 줄 알다[모르다], V-(으)ㄴ N (định ngữ quá khứ), V/A-지 않다.',
    paragraphs: [
      {
        ko: '제 취미는 {{블로그}}에 글을 쓰는 것이에요. 저는 여행을 가서 {{사진을 찍어요}}. 그리고 찍은 사진을 블로그에 {{올려요}}.',
        vi: 'Sở thích của tôi là viết bài trên blog. Tôi đi du lịch và chụp ảnh. Rồi đăng những tấm ảnh đã chụp lên blog.',
      },
      {
        ko: '저는 {{여러 가지}} 취미가 있어요. {{등산}}을 좋아해서 {{등산화}}도 샀어요. 그리고 {{요가}}, {{요리}}, {{독서}}, {{낚시}}도 좋아해요. {{영화 감상}}하고 {{음악 감상}}도 좋아해요. 매일 {{음악을 들어요}}.',
        vi: 'Tôi có nhiều sở thích. Tôi thích leo núi nên còn mua cả giày leo núi. Tôi cũng thích yoga, nấu ăn, đọc sách, câu cá. Tôi còn thích xem phim và nghe nhạc. Ngày nào tôi cũng nghe nhạc.',
      },
      {
        ko: '하지만 저는 {{악기}}를 연주할 줄 몰라요. {{노래를 부르는}} 것도 잘 못해요. 그림도 {{별로}} 잘 그리지 않아요. 그래도 주말에는 공원에서 {{그림을 그려요}}.',
        vi: 'Nhưng tôi không biết chơi nhạc cụ. Hát cũng không giỏi. Vẽ cũng không giỏi lắm. Dù vậy cuối tuần tôi vẫn vẽ tranh ở công viên.',
      },
      {
        ko: '친구는 {{라틴 댄스}} {{동호회}}에 {{가입했어요}}. 동호회 사람들은 매주 토요일에 {{연습실}}에 {{모여요}}. {{회비}}는 한 달에 삼만 원이에요. 친구는 {{춤을 추는}} 것을 {{아주}} 좋아해요. 다음 달에는 {{대회에 나가요}}.',
        vi: 'Bạn tôi đã gia nhập câu lạc bộ nhảy Latin. Thành viên câu lạc bộ tụ họp ở phòng tập vào thứ bảy hằng tuần. Hội phí là ba mươi nghìn won một tháng. Bạn tôi rất thích nhảy. Tháng sau bạn ấy tham gia cuộc thi.',
      },
      {
        ko: '동생은 {{태권도복}}을 입고 {{문화 센터}}에서 {{운동}}을 해요. 동생은 {{야구를 할}} 줄도 알아요. 하지만 {{컴퓨터 게임}}에는 {{관심}}이 {{전혀}} 없어요. 저는 반대로 매일 {{인터넷을 해요}}.',
        vi: 'Em tôi mặc đồng phục Taekwondo và tập thể dục ở trung tâm văn hóa. Em còn biết chơi bóng chày. Nhưng em hoàn toàn không quan tâm đến game máy tính. Ngược lại, ngày nào tôi cũng lên mạng.',
      },
      {
        ko: '언니는 {{인형을 모아요}}. 언니 방에는 인형이 {{참}} 많아요. 언니는 {{외국어}}를 잘해요. 그래서 영어로 쓴 {{소설}}을 읽는 것을 좋아해요.',
        vi: 'Chị tôi sưu tầm búp bê. Phòng chị có thật là nhiều búp bê. Chị giỏi ngoại ngữ. Vì vậy chị thích đọc tiểu thuyết viết bằng tiếng Anh.',
      },
    ],
  },

  3: {
    title: '콘서트에 가 봤어요?',
    titleVi: 'Bạn đã từng đi xem concert chưa?',
    note: 'Dùng đủ 65 từ vựng và 5 ngữ pháp của bài: V-아/어 보다, N 동안, A-(으)ㄴ데 / V-는데 (bối cảnh), N인데, V-(으)ㄹ N (định ngữ tương lai).',
    paragraphs: [
      {
        ko: '"{{번지 점프}}를 해 봤어요?"\n"네, 작년에 해 봤어요. 정말 {{기억에 남아요}}. {{스쿠버 다이빙}}도 해 봤어요."',
        vi: '"Bạn đã từng nhảy bungee chưa?"\n"Rồi, năm ngoái mình thử rồi. Thật sự rất đáng nhớ. Mình còn thử lặn biển nữa."',
      },
      {
        ko: '저는 한국에서 여러 가지 {{체험}}을 했어요. {{김치박물관}}에서 김치를 만들어 봤어요. {{다도}}도 배워 봤어요. {{전통문화}}를 직접 {{경험}}해서 좋았어요. {{박물관}}과 {{미술관}}에도 가서 {{전시}}를 봤어요. 그 {{전시회}}에는 사람이 많았어요.',
        vi: 'Ở Hàn Quốc tôi đã có nhiều trải nghiệm thực tế. Tôi đã thử làm kimchi ở Bảo tàng Kimchi. Tôi còn học thử trà đạo. Được trực tiếp trải nghiệm văn hóa truyền thống thật thích. Tôi còn đến bảo tàng và bảo tàng nghệ thuật xem các vật trưng bày. Cuộc triển lãm đó rất đông người.',
      },
      {
        ko: '지난달에는 {{국립극장}}에서 {{연극}}을 봤어요. {{예술의전당}}에서 {{뮤지컬}}하고 {{음악회}}도 봤어요. {{국립국악원}}에서는 {{국악}} {{공연}}과 {{사물놀이}}를 봤어요. {{공연장}}이 아주 컸어요. 저는 친구한테서 {{초대를 받았어요}}. 다음에는 {{재즈}} {{콘서트}}에 {{꼭}} 가 보고 싶어요.',
        vi: 'Tháng trước tôi xem kịch ở Nhà hát Quốc gia. Ở Nhà hát Nghệ thuật Seoul tôi còn xem nhạc kịch và buổi hòa nhạc. Ở Trung tâm Quốc nhạc Quốc gia tôi xem biểu diễn quốc nhạc và samullori. Nhà hát rất lớn. Tôi được bạn mời đi. Lần sau tôi nhất định muốn đi xem concert nhạc jazz.',
      },
      {
        ko: '부산 {{국제}} {{영화제}}에 {{갔다 왔어요}}. 거기에서 {{액션 영화}}, {{코미디 영화}}, {{애니메이션}}을 봤어요. 영화를 {{상영}}하는 동안 유명한 {{배우}}와 {{감독}}을 봤어요. 그 감독은 큰 {{상을 받았어요}}. 저는 그 감독을 {{존경해요}}. {{자리}}가 없어서 서서 봤는데 괜찮았어요.',
        vi: 'Tôi đã đi Liên hoan phim quốc tế Busan về. Ở đó tôi xem phim hành động, phim hài và phim hoạt hình. Trong lúc chiếu phim, tôi thấy diễn viên và đạo diễn nổi tiếng. Vị đạo diễn đó nhận giải thưởng lớn. Tôi rất kính trọng ông. Không có chỗ ngồi nên tôi đứng xem, nhưng vẫn ổn.',
      },
      {
        ko: '가을에는 {{축제}}가 많아요. 저는 {{놀이공원}}에서 {{불꽃놀이}}를 봤어요. 그리고 {{말하기 대회}}에 {{참가했어요}}. {{참가비}}는 없었어요. {{여러 나라}} 학생들이 나왔는데 저는 한국 {{왕}} 이야기를 했어요. 상을 받았냐고요? {{글쎄요}}, 상은 못 받았지만 {{특히}} 재미있었어요.',
        vi: 'Mùa thu có nhiều lễ hội. Tôi xem bắn pháo hoa ở công viên giải trí. Rồi tôi tham gia cuộc thi nói. Không mất phí tham gia. Học sinh từ nhiều nước tham dự, còn tôi kể chuyện về một vị vua Hàn Quốc. Có nhận giải không à? Để xem nào, không nhận được giải nhưng đặc biệt vui.',
      },
      {
        ko: '저는 한국에서 일 {{년}} 육 {{개월}} 동안 살았어요. 한 {{달}}에 {{하루}}는 여행을 가요. 지난 {{주}}에는 제주도에서 {{사흘}} 동안 있었어요. 제주도에서 {{생선회}}하고 {{닭}} 요리를 먹었어요. 비행기는 한 {{시간}} 십 {{분}} 걸렸어요. 평일에는 오 {{일}} 동안 {{아르바이트}}를 해요. 친구가 카메라를 {{빌려 줬어요}}. 제주도에 {{다시}} 가고 싶어요. 여행이 저한테 {{가장}} {{중요한}} 일이에요. 다음에는 사막에서 {{낙타}}도 타 볼 거예요.',
        vi: 'Tôi đã sống ở Hàn Quốc một năm sáu tháng. Mỗi tháng tôi đi du lịch một ngày. Tuần trước tôi ở đảo Jeju ba ngày. Ở Jeju tôi ăn gỏi cá sống và món gà. Máy bay mất một tiếng mười phút. Ngày thường tôi làm thêm năm ngày. Bạn tôi cho tôi mượn máy ảnh. Tôi muốn lại đến Jeju lần nữa. Du lịch là việc quan trọng nhất với tôi. Lần sau tôi sẽ thử cưỡi lạc đà trên sa mạc.',
      },
    ],
  },

  4: {
    title: '옷이 좀 큰 것 같아요',
    titleVi: 'Hình như áo hơi rộng',
    note: 'Dùng đủ 49 từ vựng và 3 ngữ pháp của bài: A-(으)ㄴ / V-는 / N인 것 같다, N보다, A/V-았으면/었으면 좋겠다.',
    paragraphs: [
      {
        ko: '어제 인터넷으로 옷을 {{주문했어요}}. {{블라우스}}, {{청바지}}, {{스웨터}}를 샀어요. 가게보다 {{옷값}}이 {{훨씬}} 쌌어요. 그런데 블라우스가 {{마음에 안 들어요}}. {{색깔}}이 너무 {{어두워요}}. 그리고 {{사이즈}}도 {{좀 커요}}.',
        vi: 'Hôm qua tôi đặt quần áo qua mạng. Tôi mua áo blouse, quần jean và áo len. Giá quần áo rẻ hơn ngoài cửa hàng nhiều. Nhưng tôi không ưng chiếc áo blouse. Màu quá tối. Kích cỡ cũng hơi rộng.',
      },
      {
        ko: '그래서 가게에 {{직접}} 갔어요.\n"이 블라우스를 {{교환하고}} 싶어요. 안 되면 {{환불해}} 주세요."\n"그럼 이 {{빨간색}} 블라우스는 어떠세요? 색깔이 {{밝아요}}. 요즘 이 {{디자인}}이 {{유행해요}}."\n"이게 {{마음에 들어요}}. 저한테 {{잘 어울리는}} 것 같아요."',
        vi: 'Vì vậy tôi trực tiếp đến cửa hàng.\n"Tôi muốn đổi chiếc áo blouse này. Không được thì hoàn tiền cho tôi."\n"Vậy chiếc blouse màu đỏ này thì sao ạ? Màu sáng. Dạo này kiểu dáng này đang hợp mốt."\n"Tôi ưng cái này. Hình như nó hợp với tôi."',
      },
      {
        ko: '그런데 청바지는 {{좀 작아요}}. {{길이}}도 {{짧아요}}. 저는 {{긴}} 청바지가 좋아요. 스웨터는 {{잘 맞아요}}. 그런데 동생은 그 스웨터가 저한테 {{잘 안 어울리는}} 것 같다고 했어요.',
        vi: 'Nhưng quần jean thì hơi chật. Chiều dài cũng ngắn. Tôi thích quần jean dài. Áo len thì vừa. Nhưng em tôi bảo hình như chiếc áo len đó không hợp với tôi.',
      },
      {
        ko: '아버지 생신 선물로 {{양복}}하고 {{넥타이}}를 샀어요. 아버지는 매일 넥타이를 {{하고}} 회사에 가세요. 할머니께는 따뜻한 {{스카프}}하고 {{장갑}}을 샀어요. 할머니는 겨울에 항상 장갑을 {{껴요}}.',
        vi: 'Tôi mua bộ vest và cà vạt làm quà sinh nhật bố. Ngày nào bố cũng thắt cà vạt đi làm. Tôi mua cho bà khăn quàng cổ ấm và găng tay. Mùa đông bà lúc nào cũng đeo găng tay.',
      },
      {
        ko: '언니는 {{굽이 높은}} 구두를 {{신어요}}. 저는 {{양말}}을 신고 운동화를 신어요. 저는 모자를 {{쓰고}} {{티셔츠}}를 {{입어요}}. 이 가게 옷은 {{가격}}이 {{싸요}}. 하지만 백화점 옷은 {{비싸요}}.',
        vi: 'Chị tôi đi giày cao gót. Tôi đi tất rồi đi giày thể thao. Tôi đội mũ và mặc áo phông. Quần áo ở cửa hàng này giá rẻ. Nhưng quần áo ở trung tâm thương mại thì đắt.',
      },
      {
        ko: '부모님은 {{시골}}에 사세요. 부모님이 항상 {{건강했으면}} 좋겠어요. 시골에서 {{싱싱한}} 채소와 {{고추장}}을 보내 주셨어요. 저는 요즘 돈을 {{절약해야}} 돼요. 다음 주에 회사 {{면접}}이 있어서 정장이 {{필요해요}}. 면접 질문 {{내용}}이 정말 궁금해요.',
        vi: 'Bố mẹ tôi sống ở quê. Tôi mong bố mẹ lúc nào cũng khỏe mạnh. Bố mẹ gửi từ quê lên rau tươi và tương ớt. Dạo này tôi phải tiết kiệm tiền. Tuần sau tôi có buổi phỏng vấn xin việc nên cần bộ đồ công sở. Tôi rất tò mò nội dung câu hỏi phỏng vấn.',
      },
    ],
  },

  5: {
    title: '어디에 가면 좋을까요?',
    titleVi: 'Nên đi đâu thì hay nhỉ?',
    note: 'Dùng đủ 87 từ vựng và 4 ngữ pháp của bài: V/A-(으)ㄹ까요?, A/V-(으)ㄹ 거예요 (suy đoán), A/V-(으)니까 / N(이)니까, V-고 나서.',
    paragraphs: [
      {
        ko: '이번 방학에 {{여행}}을 가고 싶어요. {{대학원}} 공부를 {{마치고}} 나서 {{배낭여행}}을 할까요? 아니면 {{패키지여행}}을 할까요? 저는 {{며칠}} 동안 {{생각했어요}}.',
        vi: 'Kỳ nghỉ này tôi muốn đi du lịch. Học xong cao học rồi thì nên đi phượt nhỉ? Hay là đi tour trọn gói? Tôi đã suy nghĩ mấy ngày liền.',
      },
      {
        ko: '여행사에 가서 {{가이드}}에게 {{물어봤어요}}. "어떤 {{여행 상품}}이 있어요?" "요즘 {{유럽}} 여행이 인기가 많아요. {{아프리카}}의 {{사막}} 여행도 있어요. 터키는 {{동양}}과 {{서양}} {{사이}}에 있으니까 {{동서양}} 문화를 모두 {{느낄}} 수 있어요. 터키를 {{추천해요}}."',
        vi: 'Tôi đến công ty du lịch hỏi hướng dẫn viên. "Có những sản phẩm du lịch nào ạ?" "Dạo này du lịch châu Âu rất được ưa chuộng. Còn có tour sa mạc ở châu Phi. Thổ Nhĩ Kỳ nằm giữa phương Đông và phương Tây nên có thể cảm nhận cả văn hóa Đông Tây. Tôi giới thiệu Thổ Nhĩ Kỳ."',
      },
      {
        ko: '하지만 저는 한국 안에서 여행하고 싶었어요. 가이드가 {{여행지}}를 소개해 줬어요. {{한라산}}, {{거제도}}, {{부석사}} {{등}}이 {{유명해요}}. 한라산은 {{자연}}이 아름다운 {{명승지}}예요. 부석사는 {{오래된}} 절이에요. 거기에서 {{전통적}}인 {{건축물}}을 볼 수 있어요.',
        vi: 'Nhưng tôi muốn đi du lịch trong nước. Hướng dẫn viên giới thiệu các điểm đến. Núi Halla, đảo Geoje, chùa Buseoksa v.v. đều nổi tiếng. Núi Halla là danh lam thắng cảnh có thiên nhiên tươi đẹp. Buseoksa là ngôi chùa lâu đời. Ở đó có thể xem các công trình kiến trúc mang tính truyền thống.',
      },
      {
        ko: '서울에서는 {{경복궁}}, {{덕수궁}}, {{경희궁}}에 가 볼까요? 궁에서는 {{조선 시대}}의 {{분위기}}를 느낄 수 있어요. {{광장}}에는 세종대왕 {{동상}}이 있어요. 북촌 {{한옥마을}}에서는 {{한옥}}을 구경할 수 있어요. {{노량진}} {{수산 시장}}도 재미있을 거예요. 봄에는 {{벚꽃}}이 정말 예뻐요. {{당일}} 여행으로도 좋아요.',
        vi: 'Ở Seoul thì thử đi cung Gyeongbok, cung Deoksu, cung Gyeonghui nhỉ? Trong cung có thể cảm nhận không khí triều đại Joseon. Ở quảng trường có tượng vua Sejong. Ở làng Hanok Bukchon có thể ngắm nhà truyền thống. Chợ hải sản Noryangjin chắc cũng thú vị. Mùa xuân hoa anh đào đẹp lắm. Đi du lịch trong ngày cũng rất hay.',
      },
      {
        ko: '{{숙소}}는 {{종류}}가 {{다양해요}}. {{펜션}}, {{콘도}}, {{민박}}, {{게스트하우스}}, {{원룸}}이 있어요. {{동네}}에 있는 게스트하우스를 예약하려고 했는데 {{빈방}}이 없었어요. 그래서 펜션에서 이{{박}} 할 거예요. {{숙박비}}에 {{식비}}가 {{포함되어 있어요}}. 박물관 {{입장료}}도 포함되어 있어요.',
        vi: 'Nơi lưu trú có nhiều loại. Có nhà nghỉ villa, căn hộ condo, nhà nghỉ tư nhân, nhà khách, phòng trọ studio. Tôi định đặt nhà khách trong khu phố nhưng không còn phòng trống. Vì vậy tôi sẽ ở nhà nghỉ villa hai đêm. Tiền ăn đã được bao gồm trong phí lưu trú. Phí vào cổng bảo tàng cũng đã bao gồm.',
      },
      {
        ko: '{{항공권}}도 {{알아봤어요}}. {{왕복}}이 {{편도}} 두 장보다 싸요. {{일등석}}하고 {{비즈니스석}}은 너무 비싸니까 {{일반석}}을 탈 거예요. {{항공료}}는 {{아마}} 삼십만 원쯤 될 거예요. {{자리}}는 창가 {{좌석}}으로 했어요. {{여행자 보험료}}도 냈어요. 여행 {{요금}}은 카드로 {{이용할}} 수 있어요. 가이드가 결제 {{방법}}을 {{자세하게}} 알려 줬어요.',
        vi: 'Tôi cũng tìm hiểu vé máy bay. Vé khứ hồi rẻ hơn hai vé một chiều. Hạng nhất với hạng thương gia đắt quá nên tôi sẽ đi hạng thường. Giá vé máy bay có lẽ khoảng ba trăm nghìn won. Tôi chọn chỗ ngồi là ghế cạnh cửa sổ. Tôi cũng đã đóng phí bảo hiểm du lịch. Phí tour có thể dùng thẻ để thanh toán. Hướng dẫn viên chỉ cho tôi cách thanh toán rất chi tiết.',
      },
      {
        ko: '{{출국 날짜}}는 7월 3일이고 {{귀국 날짜}}는 7월 10일이에요. {{출발}}은 오전 아홉 시, {{도착}}은 오후 두 시예요. {{일정}}이 정말 기대돼요. 아버지는 {{출장}} 때문에 같이 못 가세요. 아버지는 이번 여행을 {{기념해서}} {{담배를 끊었어요}}. 저는 가족 모두 건강하기를 {{바라요}}. 엄마는 우산을 꼭 {{가지고 가라고}} 하셨어요. 여행 경비는 제가 모은 돈이에요. {{등록금}}은 따로 있어요. 여행지에서 옛날 {{대통령}} 별장도 볼 수 있대요. {{온천}}에도 꼭 가 보고 싶어요.',
        vi: 'Ngày xuất cảnh là 3 tháng 7, ngày về nước là 10 tháng 7. Giờ khởi hành là chín giờ sáng, giờ đến nơi là hai giờ chiều. Tôi rất háo hức với lịch trình. Bố tôi đi công tác nên không đi cùng được. Bố đã bỏ thuốc lá để kỷ niệm chuyến đi này. Tôi mong cả nhà đều khỏe mạnh. Mẹ dặn nhất định phải mang ô theo. Tiền đi du lịch là tiền tôi tự dành dụm. Học phí thì để riêng. Nghe nói ở điểm du lịch còn có biệt thự của một vị tổng thống ngày xưa. Tôi nhất định muốn đi suối nước nóng nữa.',
      },
    ],
  },

  6: {
    title: '비행기로 보내면 얼마예요?',
    titleVi: 'Gửi bằng máy bay thì bao nhiêu tiền?',
    note: 'Dùng đủ 56 từ vựng và 5 ngữ pháp của bài: N(으)로, N(이)라서, bất quy tắc \'ㄹ\', V-(으)면 되다, V-(으)ㄴ 것 같다 (quá khứ).',
    paragraphs: [
      {
        ko: '오늘은 할 일이 많아요. 먼저 은행에 갔어요. {{통장}}을 만들려고 {{신청했어요}}. {{도장}}이 필요해서 집에서 {{가져왔어요}}. 직원이 서류를 {{접수했어요}}.',
        vi: 'Hôm nay có nhiều việc phải làm. Trước tiên tôi đi ngân hàng. Tôi đăng ký mở sổ tài khoản. Cần con dấu nên tôi mang từ nhà đến. Nhân viên tiếp nhận hồ sơ.',
      },
      {
        ko: '은행에서는 {{입금}}, {{출금}}, {{송금}}, {{환전}}을 할 수 있어요. 저는 {{현금 카드}}하고 {{신용 카드}}를 다 써요. 오늘은 {{현금 인출기}}에서 {{돈을 찾았어요}}. 그리고 통장에 {{돈을 넣었어요}}.',
        vi: 'Ở ngân hàng có thể nộp tiền, rút tiền, chuyển tiền, đổi ngoại tệ. Tôi dùng cả thẻ ghi nợ lẫn thẻ tín dụng. Hôm nay tôi rút tiền ở máy rút tiền. Rồi gửi tiền vào sổ tài khoản.',
      },
      {
        ko: '고향에 계신 부모님께 {{돈을 보내요}}. 그래서 달러를 원으로 {{돈을 바꿨어요}}. 오늘은 {{환율}}이 좋아요. 친구는 {{유로}}, {{엔}}, {{위안}}을 다 가지고 있어요. 저는 매달 {{돈을 모아요}}.',
        vi: 'Tôi gửi tiền cho bố mẹ ở quê. Vì vậy tôi đổi đô la sang won. Hôm nay tỷ giá tốt. Bạn tôi có cả euro, yên và nhân dân tệ. Tháng nào tôi cũng tiết kiệm tiền.',
      },
      {
        ko: '은행 다음에 우체국에 갔어요. 우체국에서 {{소포를 포장했어요}}. 물건을 {{상자}}에 넣고 {{저울}}에 올렸어요. 서류에 {{품명}}과 {{수량}}을 쓰고 {{주소를 썼어요}}. 직원이 "상자에 뭐가 {{들어}} 있어요?" 하고 물었어요. "옷하고 과자가 {{전부}}예요."',
        vi: 'Sau ngân hàng tôi đến bưu điện. Ở bưu điện tôi gói bưu phẩm. Tôi cho đồ vào hộp rồi đặt lên cân. Tôi ghi tên hàng và số lượng lên tờ khai rồi viết địa chỉ. Nhân viên hỏi: "Trong hộp có gì vậy?" "Toàn bộ là quần áo và bánh kẹo ạ."',
      },
      {
        ko: '할머니께 {{편지를 부쳤어요}}. 편지를 {{봉투에 넣고}} {{우표를 붙였어요}}. 친구에게는 {{엽서를 부쳤어요}}. {{우편}}은 비행기로 보내면 {{빨라요}}. 하지만 배로 보내면 도착하는 날이 {{달라요}}. 배로 보내면 한 달쯤 걸리면 돼요.',
        vi: 'Tôi gửi thư cho bà. Tôi cho thư vào phong bì rồi dán tem. Gửi bưu thiếp cho bạn. Thư từ gửi bằng máy bay thì nhanh. Còn gửi bằng tàu thì ngày đến khác hẳn. Gửi bằng tàu thì mất khoảng một tháng.',
      },
      {
        ko: '집에 오니까 {{택배 기사}}가 {{벌써}} 왔다 간 것 같아요. {{택배}}는 {{경비실}}에 {{맡겼어요}}. {{퇴근 시간}}이라서 길이 막혀서 {{서둘러서}} 갔어요. 저는 경비실에서 택배를 찾는 방법을 {{몰라요}}. 경비 아저씨가 "{{맞아요}}, 여기에 이름을 쓰면 돼요." 하고 {{바로}} 택배를 주셨어요.',
        vi: 'Về đến nhà, hình như người giao hàng đã đến rồi đi rồi. Bưu kiện được gửi ở phòng bảo vệ. Đang giờ tan làm nên đường tắc, tôi vội vàng đi. Tôi không biết cách nhận hàng ở phòng bảo vệ. Chú bảo vệ nói: "Đúng rồi, viết tên vào đây là được." rồi đưa hàng cho tôi ngay.',
      },
      {
        ko: '오후에는 한국어 학원을 {{방문했어요}}. 학원에 {{등록하려면}} {{배치 시험}}을 봐야 돼요. 학원 옆 {{꽃집}}에서 꽃을 샀어요. 꽃집 사장님이 좋은 {{소식}}을 {{전해}} 줬어요. 한국에서 {{제비}}는 좋은 {{의미}}가 있는 {{새}}라고 해요. 그리고 오늘 반 친구들이 저를 반장으로 {{뽑았어요}}.',
        vi: 'Buổi chiều tôi ghé học viện tiếng Hàn. Muốn đăng ký học ở đây thì phải làm bài thi xếp lớp. Tôi mua hoa ở cửa hàng hoa cạnh học viện. Chủ cửa hàng hoa báo cho tôi một tin vui. Nghe nói ở Hàn Quốc chim én là loài chim mang ý nghĩa tốt lành. Và hôm nay các bạn trong lớp đã bầu tôi làm lớp trưởng.',
      },
    ],
  },

  7: {
    title: '명동성당이 어디에 있는지 아세요?',
    titleVi: 'Bạn có biết nhà thờ Myeongdong ở đâu không?',
    note: 'Dùng đủ 43 từ vựng và 5 ngữ pháp của bài: V/A-(으)ㄹ 것 같다 (tương lai), V-는지 알다[모르다], N인지 알다[모르다], V-(으)려면, V-다가.',
    paragraphs: [
      {
        ko: '"실례합니다. {{명동성당}}에 어떻게 가는지 아세요?"\n"{{지하철역}} 4번 {{출구}}로 {{나가서}} {{쭉 가세요}}. {{사거리}}가 나오면 {{좌회전하세요}}. 그다음에 {{직진하세요}}."',
        vi: '"Xin lỗi. Bạn có biết đi đến nhà thờ Myeongdong thế nào không?"\n"Ra lối số 4 của ga tàu điện ngầm rồi đi thẳng. Đến ngã tư thì rẽ trái. Sau đó đi thẳng."',
      },
      {
        ko: '"{{거리}}가 얼마나 돼요?"\n"오백 {{미터}}쯤이에요. {{걸어오면}} 십 분 정도 걸릴 것 같아요."',
        vi: '"Khoảng cách bao xa ạ?"\n"Khoảng năm trăm mét. Đi bộ đến chắc mất chừng mười phút."',
      },
      {
        ko: '"가다가 {{횡단보도}}를 {{건너세요}}. {{신호등}}이 있어요. 그리고 {{육교}}를 {{지나서}} {{우회전하세요}}. 아니면 {{지하도}}로 {{내려가도}} 돼요."',
        vi: '"Đi một đoạn thì qua vạch sang đường. Ở đó có đèn giao thông. Rồi đi qua cầu vượt và rẽ phải. Hoặc cũng có thể đi xuống đường hầm."',
      },
      {
        ko: '저는 길을 잘 몰라서 {{한참}} 헤맸어요. {{간판}}도 많고 {{표지판}}도 많았어요. 그래서 친구가 {{약도}}를 그려서 {{알려 주었어요}}. 다음에는 {{교통편}}을 미리 알아볼 거예요.',
        vi: 'Tôi không rành đường nên đi lạc khá lâu. Biển hiệu cửa hàng nhiều, bảng chỉ dẫn cũng nhiều. Vì vậy bạn tôi vẽ sơ đồ đường đi chỉ cho tôi. Lần sau tôi sẽ tìm hiểu trước phương tiện giao thông.',
      },
      {
        ko: '오후에는 비가 와서 {{택시 정류장}}에 갔어요. 그런데 {{길이 막혀서}} 택시가 안 왔어요. 그래서 {{버스 정류장}}으로 갔어요. 버스에서 {{내리고}} {{근처}} {{보건소}}에 갔어요. 집에 갈 때는 택시를 탔어요. "기사님, {{왼쪽으로 돌아가세요}}. 그다음에 {{오른쪽으로 돌아가면}} 돼요. 저 앞에서 {{세워}} 주세요." {{차비}}는 만 원이었어요.',
        vi: 'Buổi chiều trời mưa nên tôi ra trạm taxi. Nhưng đường tắc nên taxi không tới. Vì vậy tôi ra trạm xe buýt. Xuống xe buýt rồi tôi đến trạm y tế gần đó. Lúc về nhà tôi đi taxi. "Bác tài, rẽ trái ạ. Sau đó rẽ phải là được. Dừng xe ở phía trước giúp cháu." Tiền xe là mười nghìn won.',
      },
      {
        ko: '친구가 "{{학생회관}} 2층으로 {{올라와}}." 하고 문자를 보냈어요. 학생회관 식당에서 {{잡채}}를 먹었어요. 친구는 비가 오니까 우산을 {{가져가라고}} 했어요. 그런데 저는 우산을 또 {{잊어버릴}} 것 같아요. 학교 앞 길은 옛날 {{장군}}의 {{이름을 붙였어요}}. 밥을 먹고 그 길로 {{나왔어요}}.',
        vi: 'Bạn tôi nhắn: "Lên tầng 2 nhà sinh viên đi." Tôi ăn miến trộn japchae ở căng tin nhà sinh viên. Bạn tôi bảo trời mưa nên mang ô theo. Nhưng hình như tôi lại sắp quên ô mất. Con đường trước trường được đặt tên theo một vị tướng quân ngày xưa. Ăn xong chúng tôi đi ra con đường đó.',
      },
    ],
  },

  8: {
    title: '정말 속상하겠어요',
    titleVi: 'Chắc bạn buồn lắm',
    note: 'Dùng đủ 44 từ vựng và 4 ngữ pháp của bài: V/A-겠-, N 때문에, V-아/어 버리다, V/A-(으)ㄹ 때.',
    paragraphs: [
      {
        ko: '오늘은 정말 {{운이 없었어요}}. 아침에 늦게 일어나서 버스를 {{놓쳤어요}}. 다음 버스에서 {{졸다가}} {{종점}}까지 가 버렸어요. 정말 {{당황했어요}}.',
        vi: 'Hôm nay đúng là xui xẻo. Sáng dậy muộn nên lỡ xe buýt. Lên chuyến sau thì ngủ gật, đi luôn đến bến cuối. Thật sự lúng túng.',
      },
      {
        ko: '회사에 가다가 길에서 {{넘어졌어요}}. 사람들이 다 봐서 너무 {{창피했어요}}. 그리고 {{노트북}}이 {{고장이 났어요}}. 지갑도 {{잃어버렸어요}}. 정말 {{속상해요}}.',
        vi: 'Đang đi làm thì tôi ngã ngoài đường. Mọi người nhìn thấy hết nên xấu hổ quá. Rồi máy tính xách tay bị hỏng. Ví cũng làm mất. Thật là buồn lòng.',
      },
      {
        ko: '오후에는 친구가 {{교통사고가 났어요}}. 다행히 큰 {{사고가 난}} 건 아니에요. 친구는 다음 주에 {{퇴원해요}}. 그래도 너무 {{걱정돼요}}. 친구 병원에 가려고 {{시간을 냈어요}}. 꽃도 {{사 갔어요}}.',
        vi: 'Buổi chiều bạn tôi bị tai nạn giao thông. May mà không phải tai nạn lớn. Tuần sau bạn ấy xuất viện. Nhưng tôi vẫn lo lắm. Tôi dành thời gian đến bệnh viện thăm bạn. Tôi còn mua hoa mang theo.',
      },
      {
        ko: '요즘 회사 일 때문에 {{스트레스를 받아요}}. 상사가 제 {{잘못}}이라고 해서 {{화가 났어요}}. 계속 {{짜증이 나요}}. 일이 많아서 {{힘들고}} {{답답해요}}. 그래서 저는 {{큰 소리로}} 노래를 부르면서 {{스트레스를 풀어요}}.',
        vi: 'Dạo này tôi bị căng thẳng vì công việc. Sếp bảo là lỗi của tôi nên tôi tức giận. Cứ bực mình mãi. Việc nhiều nên vừa mệt vừa bức bối. Vì vậy tôi hát thật to để giải tỏa căng thẳng.',
      },
      {
        ko: '지난주에 {{방송국}}에서 {{인터뷰}}를 했어요. 너무 {{긴장돼서}} 질문에 잘 {{대답하지}} 못했어요. 미리 {{답}}을 {{외웠는데}} 다 잊어버렸어요. 아나운서가 질문을 다시 {{설명해}} 줬어요.',
        vi: 'Tuần trước tôi được phỏng vấn ở đài truyền hình. Căng thẳng quá nên tôi không trả lời tốt các câu hỏi. Tôi đã học thuộc câu trả lời trước rồi mà quên sạch. Phát thanh viên giải thích lại câu hỏi cho tôi.',
      },
      {
        ko: '제일 친한 친구가 다른 도시로 {{이사를 가요}}. 그래서 {{슬퍼요}}. 친구가 없으면 {{외로울}} 것 같아요. 친구와 함께한 {{즐거운}} 시간이 자꾸 {{생각이 나요}}. 친구 집 앞을 {{지나갈}} 때마다 친구가 보고 싶을 거예요. 하지만 친구가 좋은 직장을 구해서 {{기뻐요}}. {{무엇보다}} 친구가 행복했으면 좋겠어요. 마음을 말로 {{표현하는}} 건 어려워요. 오늘은 {{기분이 나빴지만}} 친구랑 통화하고 {{기분이 좋아졌어요}}. 그리고 밤에 일찍 {{잠이 들었어요}}.',
        vi: 'Người bạn thân nhất của tôi sắp chuyển nhà đến thành phố khác. Vì vậy tôi buồn. Không có bạn chắc tôi sẽ cô đơn. Những khoảng thời gian vui vẻ bên bạn cứ hiện lên trong đầu. Mỗi lần đi ngang qua nhà bạn chắc tôi sẽ nhớ bạn. Nhưng bạn tìm được chỗ làm tốt nên tôi cũng vui. Hơn hết, tôi mong bạn hạnh phúc. Diễn tả tấm lòng bằng lời thật khó. Hôm nay tôi tâm trạng tệ nhưng nói chuyện điện thoại với bạn xong thì thấy vui hơn. Và tối đó tôi ngủ thiếp đi từ sớm.',
      },
    ],
  },

  9: {
    title: '문의할 게 있는데요',
    titleVi: 'Tôi có việc muốn hỏi',
    note: 'Dùng đủ 38 từ vựng và 5 ngữ pháp của bài: A-(으)ㄴ데요 / V-는데요 / N인데요, V-는 중이다, N 중이다, A-(으)ㄴ가요? / V-나요? / N인가요?, N 밖에.',
    paragraphs: [
      {
        ko: '구청에서 외국인 주부{{를 위한}} {{프로그램}}이 있다는 {{정보를 얻었어요}}. 저는 {{궁금해서}} 구청에 {{전화를 걸었어요}}.\n"여보세요. {{문의}}할 게 있는데요."\n"네, {{말씀하세요}}."',
        vi: 'Tôi nhận được thông tin rằng văn phòng quận có chương trình dành cho các bà nội trợ người nước ngoài. Tò mò quá nên tôi gọi điện cho văn phòng quận.\n"Alô. Tôi có việc muốn hỏi ạ."\n"Vâng, chị cứ nói ạ."',
      },
      {
        ko: '"외국인 프로그램은 {{대상}}이 누구인가요?"\n"잠깐만요. 담당자에게 {{전화를 바꿔}} 드릴게요."\n{{상담원}}이 대답했어요. "한국에 사는 외국인이요. {{한국학}} 수업, {{동양화}} 수업, 한국어 {{퀴즈}} 대회가 있어요. 수업은 {{무료}}예요. {{재료비}}만 내면 돼요."',
        vi: '"Đối tượng của chương trình cho người nước ngoài là ai ạ?"\n"Chờ chút nhé. Tôi sẽ chuyển máy cho người phụ trách."\nNhân viên tư vấn trả lời: "Là người nước ngoài sống ở Hàn Quốc ạ. Có lớp Hàn Quốc học, lớp tranh phương Đông, cuộc thi câu đố tiếng Hàn. Các lớp đều miễn phí. Chỉ cần đóng phí nguyên liệu thôi."',
      },
      {
        ko: '"신청 {{기간}}은 언제까지인가요? {{접수}}는 어디에서 하나요?"\n"이번 주 금요일까지예요. 구청 2층 {{창구}}에서 하시면 돼요. 수업 {{장소}}는 지금 {{공사}} 중이라서 다음 주에 알려 드릴게요. 자리가 다섯 개밖에 안 {{남았어요}}."',
        vi: '"Thời hạn đăng ký đến khi nào ạ? Tiếp nhận hồ sơ ở đâu ạ?"\n"Đến thứ sáu tuần này. Chị nộp ở quầy tầng 2 của văn phòng quận là được. Địa điểm học đang thi công nên tuần sau chúng tôi sẽ báo. Chỉ còn lại năm chỗ thôi ạ."',
      },
      {
        ko: '저는 한국말이 서툴러서 {{통역}} {{서비스}}를 {{부탁했어요}}. 상담원이 영어로 {{통역해}} 줬어요. 상담원은 친절하게 {{말해}} 줬어요. 저는 고맙다고 하고 {{전화를 끊었어요}}.',
        vi: 'Tiếng Hàn của tôi còn vụng nên tôi nhờ dịch vụ phiên dịch. Nhân viên tư vấn phiên dịch sang tiếng Anh cho tôi. Nhân viên nói chuyện rất thân thiện. Tôi cảm ơn rồi tắt máy.',
      },
      {
        ko: '저녁에 {{갑자기}} {{전화가 왔어요}}. 남편이었어요. 저는 요리하는 중이라서 {{전화를 받았어요}}. 하지만 길게 {{통화를 하지}} 못했어요. 남편은 회사에 {{문제가 있어서}} 늦을 거라고 했어요.',
        vi: 'Buổi tối bất ngờ có điện thoại gọi đến. Là chồng tôi. Tôi đang nấu ăn nhưng vẫn nghe máy. Nhưng không nói chuyện lâu được. Chồng tôi nói công ty có sự cố nên sẽ về muộn.',
      },
      {
        ko: '조금 후에 남편에게 {{문자 받았어요}}. "미안해. 일찍 갈게." 저도 남편에게 {{문자 보냈어요}}. 그리고 친구에게 {{문자를 보냈어요}}. 친구한테서도 {{문자를 받았어요}}. 친구는 요즘 다리 {{치료를 받는}} 중이래요. 저는 오래된 {{문자를 지웠어요}}.',
        vi: 'Một lát sau tôi nhận được tin nhắn của chồng: "Anh xin lỗi. Anh sẽ về sớm." Tôi cũng nhắn tin lại cho chồng. Rồi tôi gửi tin nhắn cho bạn. Bạn cũng nhắn lại cho tôi. Nghe nói dạo này bạn đang được điều trị ở chân. Tôi xóa những tin nhắn cũ.',
      },
    ],
  },

  11: {
    title: '운동을 좀 해 보는 게 어때요?',
    titleVi: 'Thử tập thể dục một chút thì sao?',
    note: 'Dùng đủ 61 từ vựng và 4 ngữ pháp của bài: bất quy tắc \'ㅅ\', N마다, V-는 게 어때요?, V-기로 하다.',
    paragraphs: [
      {
        ko: '요즘 저는 {{계속}} 아파요. 밤에 {{잠을 잘 못 자요}}. {{기운이 없어요}}. {{입맛이 없어요}}. {{속이 안 좋아요}}. {{소화가 안 돼요}}. 어제는 {{배탈이 나서}} {{토했어요}}. {{어지러워요}}. {{몸살이 나고}} {{기침이 나요}}. 얼굴도 {{부었어요}}. 그리고 {{얼굴에 뭐가 났어요}}.',
        vi: 'Dạo này tôi ốm liên tục. Đêm ngủ không ngon. Người không có sức. Chán ăn. Trong bụng khó chịu. Khó tiêu. Hôm qua tôi đau bụng rồi nôn. Chóng mặt. Tôi bị ê ẩm mình mẩy và ho. Mặt cũng sưng lên. Rồi còn nổi mụn trên mặt.',
      },
      {
        ko: '그래서 병원에서 {{진료를 받았어요}}. 병원에는 {{내과}}, {{치과}}, {{안과}}, {{피부과}}, {{정형외과}}, {{이비인후과}}가 있어요. 의사 선생님이 약을 주셨어요. "하루에 세 번, {{식후}}에 두 {{알}}{{씩}} 드세요." 저는 {{약을 먹었어요}}.',
        vi: 'Vì vậy tôi đi khám ở bệnh viện. Bệnh viện có khoa nội, nha khoa, khoa mắt, khoa da liễu, khoa chỉnh hình, khoa tai mũi họng. Bác sĩ cho tôi thuốc: "Ngày ba lần, sau khi ăn mỗi lần hai viên." Tôi uống thuốc.',
      },
      {
        ko: '약국에서 {{감기약}}, {{두통약}}, {{소화제}}, {{해열제}}, {{멀미약}}, {{영양제}}를 샀어요. 눈이 아파서 {{안약}}도 샀어요. 하루에 두 번 눈에 {{안약을 넣어요}}. {{연고}}도 샀어요. 얼굴에 {{연고를 발라요}}. 허리가 아파서 {{파스}}를 샀어요. 그리고 허리에 {{파스를 붙였어요}}.',
        vi: 'Ở hiệu thuốc tôi mua thuốc cảm, thuốc đau đầu, thuốc tiêu hóa, thuốc hạ sốt, thuốc say xe, thực phẩm bổ sung dinh dưỡng. Mắt đau nên tôi mua cả thuốc nhỏ mắt. Mỗi ngày tôi nhỏ mắt hai lần. Tôi còn mua thuốc mỡ. Tôi bôi thuốc mỡ lên mặt. Lưng đau nên tôi mua cao dán. Rồi dán cao lên lưng.',
      },
      {
        ko: '동생은 축구를 하다가 {{다리를 다쳤어요}}. 동생은 차를 타면 {{멀미를 해요}}. 동생은 아주 {{말랐어요}}. 저는 조금 {{똥똥해요}}. 친구는 {{날씬해요}}. 일주일 후에 동생 다리가 다 {{나았어요}}.',
        vi: 'Em tôi đá bóng thì bị thương ở chân. Em đi xe là bị say xe. Em rất gầy. Tôi thì hơi mập. Bạn tôi thì thon thả. Một tuần sau chân em đã khỏi hẳn.',
      },
      {
        ko: '저는 {{고민}}이 있어서 친구에게 {{조언}}을 구했어요. 친구가 말했어요. "운동을 좀 해 보는 게 어때요? 건강{{을 위해서}} 운동하면 감기도 {{예방할}} 수 있어요. 운동하면 {{스트레스가 풀려요}}." {{그러나}} 저는 운동을 싫어해요. {{그래도}} 매일 아침마다 공원을 걷기로 했어요. 혼자 {{외출하는}} 게 좀 무서웠지만 괜찮았어요.',
        vi: 'Tôi có nỗi băn khoăn nên xin bạn lời khuyên. Bạn tôi nói: "Thử tập thể dục một chút thì sao? Tập thể dục vì sức khỏe thì còn phòng ngừa được cảm cúm. Tập thể dục thì hết căng thẳng." Tuy nhiên tôi ghét tập thể dục. Dù vậy tôi quyết định sáng nào cũng đi bộ ở công viên. Ra ngoài một mình hơi sợ nhưng không sao.',
      },
      {
        ko: '공원에서 {{나비}}를 봤어요. 나무에 초록색 {{잎}}이 많았어요. 공원 옆에서는 새 건물을 {{지었어요}}. 그 건물을 {{짓는}} 데 돈이 많이 {{들었대요}}. 저는 {{생활비}}를 아끼려고 커피를 {{덜}} 마셔요. 요즘 {{모든}} 게 비싸서 {{자꾸}} 걱정이 돼요. 어제는 싸운 친구하고 {{화해했어요}}. {{특별히}} 한 일은 없지만 오늘은 {{특별한}} 하루였어요.',
        vi: 'Ở công viên tôi thấy con bướm. Trên cây có nhiều lá xanh. Cạnh công viên người ta đã xây một tòa nhà mới. Nghe nói xây tòa nhà đó tốn rất nhiều tiền. Tôi uống cà phê ít hơn để tiết kiệm sinh hoạt phí. Dạo này cái gì cũng đắt nên tôi cứ lo mãi. Hôm qua tôi đã làm hòa với người bạn từng cãi nhau. Tôi không làm gì đặc biệt cả nhưng hôm nay là một ngày đặc biệt.',
      },
    ],
  },

  12: {
    title: '저는 좀 조용한 편이에요',
    titleVi: 'Tôi thuộc kiểu người khá trầm tính',
    note: 'Dùng đủ 62 từ vựng và 4 ngữ pháp của bài: A-아/어 보이다, N처럼[같이], A-(으)ㄴ 편이다 / V-는 편이다, A-게.',
    paragraphs: [
      {
        ko: '저는 조용한 편이에요. {{내성적이에요}}. 제 {{속마음}}을 잘 말하지 않아요. 그런데 동생은 아주 {{활발해요}}. 우리는 {{자매}}인데 {{성격}}이 많이 달라요. 동생은 {{급해요}}. 친구들도 동생한테 "너는 {{성격이 급하다}}."라고 해요. 저는 {{꼼꼼한}} 편이에요. 제 {{글씨}}는 작고 {{정확해요}}.',
        vi: 'Tôi thuộc kiểu trầm tính. Tôi hướng nội. Tôi không hay nói ra suy nghĩ trong lòng. Nhưng em tôi thì rất hoạt bát. Hai chị em mà tính cách khác nhau nhiều. Em tôi nóng vội. Bạn bè cũng bảo em: "Cậu nóng tính quá." Tôi thì thuộc kiểu tỉ mỉ. Chữ viết tay của tôi nhỏ và chính xác.',
      },
      {
        ko: '외모도 달라요. 저는 {{눈}}이 작아요. {{눈이 작고}} {{쌍꺼풀이 없어요}}. 동생은 {{눈이 크고}} {{쌍꺼풀이 있어요}}. 동생 {{쌍꺼풀}}이 예뻐요. 저는 {{눈썹이 진해요}}. 동생은 {{눈썹이 연해요}}. 저는 {{코}}가 낮아요. {{코가 낮아요}}. 동생은 {{코가 높아요}}.',
        vi: 'Ngoại hình cũng khác. Mắt tôi nhỏ. Mắt nhỏ và không có hai mí. Em tôi mắt to và có hai mí. Mí mắt của em đẹp lắm. Lông mày tôi đậm. Lông mày em nhạt. Mũi tôi thấp. Mũi thấp thật. Còn em thì mũi cao.',
      },
      {
        ko: '저는 {{입}}이 작아요. {{입이 작고}} {{입술}}이 얇아요. {{입술이 얇아요}}. 동생은 {{입이 크고}} {{입술이 두꺼워요}}. 저는 {{이마}}가 넓어요. {{이마가 넓어요}}. 동생은 {{이마가 좁아요}}. 동생 {{어깨}}는 좁아요. {{어깨가 좁아요}}. 저는 {{어깨가 넓어요}}. {{키}}는 제가 커요. {{키가 커요}}. 동생은 {{키가 작아요}}.',
        vi: 'Miệng tôi nhỏ. Miệng nhỏ và môi mỏng. Môi mỏng lắm. Em tôi miệng to và môi dày. Trán tôi rộng. Trán rộng thật. Em thì trán hẹp. Vai em hẹp. Vai hẹp lắm. Tôi thì vai rộng. Về chiều cao thì tôi cao hơn. Tôi cao. Em thì thấp.',
      },
      {
        ko: '사람들은 저를 처음 보면 차가워 보인다고 해요. 제 {{첫인상}}이 좋지 않은 것 같아요. 동생은 {{모델}}처럼 {{날씬하고}} {{멋있어요}}. 동생은 {{여성적이에요}}. 저는 조금 {{남성적이에요}}. 저는 {{뚱뚱하지}} 않지만 {{보통이에요}}. 하지만 사람들은 제가 {{똑똑하다}}고 해요.',
        vi: 'Mọi người lần đầu gặp tôi đều bảo trông tôi lạnh lùng. Có vẻ ấn tượng đầu tiên về tôi không tốt. Em tôi thon thả và ngầu như người mẫu. Em rất nữ tính. Tôi thì hơi nam tính. Tôi không mập nhưng cũng bình thường. Nhưng mọi người bảo tôi thông minh.',
      },
      {
        ko: '동생은 아직 {{어려요}}. 하지만 {{어른}}처럼 말해요. 우리 둘은 엄마를 {{닮았어요}}. 다음 주에 동생 {{졸업식}}이 있어요. 그래서 오늘 미용실에 갔어요. {{머리 모양}}을 바꾸고 싶었어요. 저는 머리를 짧게 {{잘랐어요}}. 그리고 {{앞머리를 다듬었어요}}. 동생은 {{염색을 하고}} {{파마를 했어요}}. 동생은 완전히 {{새로워}} 보였어요.',
        vi: 'Em tôi còn nhỏ. Nhưng em nói chuyện như người lớn. Hai chị em đều giống mẹ. Tuần sau là lễ tốt nghiệp của em. Vì vậy hôm nay chúng tôi đi tiệm làm tóc. Tôi muốn đổi kiểu tóc. Tôi cắt tóc ngắn. Rồi tỉa tóc mái. Em tôi nhuộm tóc và uốn tóc. Trông em hoàn toàn mới mẻ.',
      },
      {
        ko: '요즘 일이 많아서 {{스트레스가 쌓였어요}}. 그래서 주말에 방을 {{정리를 했어요}}. 방이 {{완전히}} 깨끗해졌어요. 동생의 {{이상형}}은 {{외모}}보다 마음이 따뜻한 사람이에요. 동생은 말할 때 {{제스처}}를 많이 해요. 우리는 지금 아주 {{행복해요}}.',
        vi: 'Dạo này nhiều việc nên căng thẳng dồn nén. Vì vậy cuối tuần tôi sắp xếp lại phòng. Phòng sạch hoàn toàn. Mẫu người lý tưởng của em tôi là người có tấm lòng ấm áp hơn là ngoại hình. Em tôi nói chuyện hay dùng nhiều cử chỉ. Bây giờ hai chị em rất hạnh phúc.',
      },
    ],
  },

  13: {
    title: '주변이 조용해서 살기 좋아요',
    titleVi: 'Xung quanh yên tĩnh nên sống rất thích',
    note: 'Dùng đủ 54 từ vựng và 4 ngữ pháp của bài: V/A-(으)ㄹ지 모르겠다, V/A-기는 하지만, V/A-기 때문에 / N(이)기 때문에, V-기(가) A.',
    paragraphs: [
      {
        ko: '저는 다음 달에 {{회사를 옮겨요}}. 그래서 새 집을 {{구해야}} 돼요. 지금은 회사 {{기숙사}}에 살아요. 저는 {{부동산}}에 가서 집을 알아봤어요. "{{그렇지 않아도}} 좋은 집이 하나 나왔어요." 부동산 아저씨가 말했어요.',
        vi: 'Tháng sau tôi chuyển công ty. Vì vậy tôi phải tìm nhà mới. Hiện tôi đang sống ở ký túc xá công ty. Tôi đến văn phòng bất động sản tìm hiểu nhà. Chú môi giới nói: "Đúng lúc đang có một căn nhà tốt vừa ra."',
      },
      {
        ko: '집의 종류는 많아요. {{아파트}}, {{주택}}, {{빌라}}, {{오피스텔}}, {{원룸}}, {{하숙집}}, {{고시원}}이 있어요. 계약은 {{전세}}하고 {{월세}}가 있어요. {{대부분}}의 학생들은 월세로 살아요. 집을 {{매매}}하는 건 너무 비싸요.',
        vi: 'Có nhiều loại nhà. Có chung cư, nhà riêng, nhà villa, officetel, phòng trọ một phòng, nhà trọ có ăn, phòng trọ gosiwon. Hợp đồng thì có jeonse và thuê theo tháng. Đa số sinh viên thuê theo tháng. Mua bán nhà thì quá đắt.',
      },
      {
        ko: '아저씨가 보여 준 빌라는 {{새로 지었어요}}. 지금 {{비어 있어요}}. {{방}}이 두 개인데 {{방이 넓어요}}. {{거실}}, {{부엌}}, {{화장실}}, {{현관}}, {{베란다}}가 있어요. {{바람이 통해서}} {{공기}}가 좋아요. 집의 {{크기}}도 딱 좋아요. {{시설이 잘되어 있어요}}. 그리고 높은 층이라서 {{전망이 좋아요}}.',
        vi: 'Căn villa chú môi giới cho xem là nhà mới xây. Hiện đang trống. Có hai phòng, phòng rộng. Có phòng khách, bếp, nhà vệ sinh, sảnh vào, ban công. Thông gió tốt nên không khí trong lành. Kích thước căn nhà cũng vừa đẹp. Cơ sở vật chất tốt. Lại ở tầng cao nên tầm nhìn đẹp.',
      },
      {
        ko: '{{위치}}도 좋아요. 회사 {{바로}} 옆에 있기 때문에 {{교통비}}가 안 들어요. {{교통이 편리해요}}. {{주변 환경}}도 좋아요. {{주변이 조용해요}}. 옆집 {{이웃}}은 {{떠들지}} 않아요. 지금 사는 기숙사는 {{시끄러워요}}. 그리고 {{집주인이 좋아요}}.',
        vi: 'Vị trí cũng tốt. Vì ở ngay cạnh công ty nên không tốn chi phí đi lại. Giao thông thuận tiện. Môi trường xung quanh cũng tốt. Xung quanh yên tĩnh. Hàng xóm bên cạnh không làm ồn. Ký túc xá tôi đang ở thì ồn ào. Rồi chủ nhà cũng tốt.',
      },
      {
        ko: '"{{보증금}}하고 {{집세}}는 얼마예요?"\n"보증금은 천만 원이고 {{방값이 싸요}}. 한 달에 오십만 원 {{이하}}예요. {{관리비}}는 따로 내야 돼요. {{전기 요금}}, {{수도 요금}}, {{가스 요금}}, {{전화 요금}}, {{기타}} 요금도 따로 내요."',
        vi: '"Tiền đặt cọc và tiền nhà bao nhiêu ạ?"\n"Tiền đặt cọc mười triệu won, tiền phòng rẻ. Mỗi tháng năm trăm nghìn won trở xuống. Phí quản lý phải đóng riêng. Tiền điện, tiền nước, tiền gas, tiền điện thoại và các khoản khác cũng đóng riêng."',
      },
      {
        ko: '조건이 좋기는 하지만 조금 비싼지 모르겠어요. 그래도 이 집으로 {{결정했어요}}. 다음 주에 {{계약}}을 할 거예요. 집을 고를 때 {{조건}}을 잘 봐야 해요. 제 동생은 내년에 대학교 {{입학}}을 해서 저하고 같이 살 거예요.',
        vi: 'Điều kiện tốt thật nhưng không biết có hơi đắt không. Dù vậy tôi đã quyết định chọn căn này. Tuần sau tôi sẽ ký hợp đồng. Khi chọn nhà phải xem kỹ các điều kiện. Năm sau em tôi nhập học đại học nên sẽ sống cùng tôi.',
      },
    ],
  },

  14: {
    title: '여기서 사진을 찍어도 돼요?',
    titleVi: 'Ở đây chụp ảnh có được không?',
    note: 'Dùng đủ 27 từ vựng và 4 ngữ pháp của bài: V-(으)ㄴ 적(이) 있다[없다], V/A-았을/었을 때, V-아도/어도 되다, V-(으)면 안 되다.',
    paragraphs: [
      {
        ko: '박물관 입구에 안내문이 있었어요. "{{사진 촬영 금지}}", "{{음식물 반입 금지}}", "{{휴대 전화 사용 금지}}", "{{금연}}". 주차장에는 "{{주차 금지}}"라고 쓰여 있었어요.',
        vi: 'Ở lối vào bảo tàng có bảng thông báo: "Cấm chụp ảnh", "Cấm mang đồ ăn thức uống vào", "Cấm sử dụng điện thoại", "Cấm hút thuốc". Ở bãi xe có ghi "Cấm đậu xe".',
      },
      {
        ko: '"여기서 사진을 찍어도 돼요?"\n"아니요, 찍으면 안 돼요. 그리고 작품을 {{만지면}} 안 돼요."\n"이 의자에 앉아도 돼요?"\n"{{물론이에요}}. 앉아도 {{상관없어요}}."',
        vi: '"Ở đây chụp ảnh có được không ạ?"\n"Không, không được chụp. Và không được sờ vào tác phẩm."\n"Ngồi ghế này có được không ạ?"\n"Tất nhiên rồi. Ngồi cũng không sao."',
      },
      {
        ko: '저는 한국에 처음 왔을 때 한국 {{예절}}을 잘 몰랐어요. 박물관에서 할머니 앞에 {{다리를 꼬고 앉았어요}}. 그리고 할머니께 {{반말을 했어요}}. 한국에서는 어른에게 {{반말}}을 하면 안 돼요. 어른에게는 {{높임말을 해요}}. 그 후로 저는 어른께 항상 {{존댓말을 했어요}}.',
        vi: 'Khi mới đến Hàn Quốc, tôi chưa rõ phép lịch sự ở đây. Ở bảo tàng tôi ngồi vắt chân trước mặt một cụ bà. Rồi còn nói trống không với cụ. Ở Hàn Quốc không được nói 반말 với người lớn tuổi. Với người lớn thì nói kính ngữ. Từ đó trở đi tôi luôn nói kính ngữ với người lớn.',
      },
      {
        ko: '한국 사람들은 {{공중도덕}}을 중요하게 생각해요. 지하철에서 무거운 짐을 가진 할머니를 본 적이 있어요. 저는 그 짐을 {{들어}} 드렸어요. 할머니가 저를 {{칭찬했어요}}. 할머니는 제 머리를 {{쓰다듬었어요}}. 그리고 저를 꼭 {{안아}} 주셨어요.',
        vi: 'Người Hàn rất coi trọng đạo đức công cộng. Tôi từng gặp một cụ bà mang đồ nặng trên tàu điện ngầm. Tôi xách đồ giúp cụ. Cụ khen tôi. Cụ xoa đầu tôi. Rồi ôm tôi thật chặt.',
      },
      {
        ko: '저는 한국 문화{{에 대한}} 책을 읽었어요. 옛날 사람들은 조상의 {{영혼}}을 소중하게 생각했대요. 한국에는 학생 {{할인}} {{제도}}가 있어서 박물관 입장료가 쌌어요. {{어떤}} 친구는 늦게 일어나서 {{머리를 감지}} 못하고 왔어요. 저는 박물관에서 배가 고팠지만 {{참았어요}}. 남을 존중하는 것처럼 {{자신}}을 사랑하는 것도 중요해요.',
        vi: 'Tôi đọc một cuốn sách về văn hóa Hàn Quốc. Nghe nói người xưa rất coi trọng linh hồn của tổ tiên. Ở Hàn có chế độ giảm giá cho sinh viên nên vé vào bảo tàng rẻ. Có một người bạn dậy muộn nên chưa kịp gội đầu đã đi. Ở bảo tàng tôi đói nhưng vẫn nhịn. Cũng như tôn trọng người khác, yêu thương bản thân cũng rất quan trọng.',
      },
    ],
  },

  15: {
    title: '한국 생활에 익숙해졌어요',
    titleVi: 'Tôi đã quen với cuộc sống ở Hàn Quốc',
    note: 'Dùng đủ 41 từ vựng và 4 ngữ pháp của bài: A-아지다/어지다, V-게 되다, V-기 전에, V-(으)ㄴ 후에.',
    paragraphs: [
      {
        ko: '한국에 {{유학}}을 온 지 일 년이 됐어요. {{이제}} 한국 생활에 {{익숙해졌어요}}. 처음에는 한국 {{예절}}이 어려웠어요. 한국에서는 어른을 만나면 {{고개를 숙여서 인사해요}}. 물건은 {{두 손으로 드려요}}. {{한 손으로 받으면}} 안 돼요. 어른과 같이 마실 때는 {{고개를 돌리고 마셔요}}. 지하철에서는 노인에게 {{자리를 양보해요}}.',
        vi: 'Tôi sang Hàn du học được một năm rồi. Giờ tôi đã quen với cuộc sống ở đây. Lúc đầu phép tắc của Hàn Quốc rất khó với tôi. Ở Hàn, gặp người lớn thì cúi đầu chào. Đồ vật thì đưa bằng hai tay. Không được nhận bằng một tay. Khi uống cùng người lớn thì quay đầu sang một bên. Trên tàu điện ngầm thì nhường ghế cho người già.',
      },
      {
        ko: '처음에는 이런 {{습관}}이 어색했어요. 하지만 {{평소}}에 계속 {{노력했어요}}. 한국 {{친구를 사귀고}} 한국에 {{정이 들었어요}}. 처음에는 {{고생했지만}} 지금은 모든 게 {{잘됐어요}}. 요즘은 {{별일 없어요}}.',
        vi: 'Lúc đầu những thói quen này rất gượng gạo. Nhưng thường ngày tôi luôn cố gắng. Tôi kết bạn với người Hàn và dần gắn bó với Hàn Quốc. Lúc đầu vất vả nhưng bây giờ mọi thứ đều suôn sẻ. Dạo này không có chuyện gì đặc biệt.',
      },
      {
        ko: '수업 시간에 "{{인생}}"에 대해 이야기했어요. 사람은 {{태어나서}} {{초등학교}}에 {{입학해요}}. 학교를 {{졸업한}} 후에 {{취직해요}}. 그리고 {{사랑에 빠지고}} {{결혼해요}}. {{아기를 낳고}} 회사에서 {{승진해요}}. 나이가 들면 {{은퇴하고}} 언젠가는 {{죽어요}}.',
        vi: 'Trong giờ học chúng tôi nói chuyện về "nhân sinh". Con người được sinh ra rồi vào tiểu học. Sau khi tốt nghiệp thì đi làm. Rồi phải lòng ai đó và kết hôn. Sinh con, được thăng chức ở công ty. Về già thì nghỉ hưu, và một ngày nào đó sẽ qua đời.',
      },
      {
        ko: '저는 나중에 {{변호사}}가 되고 싶어요. 그리고 {{봉사 활동을 하고}} 싶어요. 미래가 정말 {{기대가 돼요}}.',
        vi: 'Sau này tôi muốn trở thành luật sư. Và muốn làm tình nguyện. Tôi rất mong chờ tương lai.',
      },
      {
        ko: '한국은 아주 빨리 {{발전했어요}}. {{예전에}}는 {{인구}}가 계속 {{늘었어요}}. 하지만 지금은 아이가 {{줄었어요}}. 물가는 많이 {{올랐어요}}. 집값은 조금 {{내렸어요}}. 우리 동네에도 새 카페가 많이 {{생겼어요}}. 이제 한국에서는 {{어디에서나}} 인터넷을 쓸 수 있게 됐어요.',
        vi: 'Hàn Quốc phát triển rất nhanh. Ngày trước dân số liên tục tăng. Nhưng bây giờ số trẻ em đã giảm. Vật giá tăng nhiều. Giá nhà thì giảm một chút. Khu phố tôi cũng mọc lên nhiều quán cà phê mới. Giờ ở Hàn Quốc ở đâu cũng dùng được internet.',
      },
    ],
  },

  16: {
    title: '설날에는 밥 대신 떡국을 먹어요',
    titleVi: 'Ngày Tết ăn canh bánh gạo thay cho cơm',
    note: 'Dùng đủ 38 từ vựng và 4 ngữ pháp của bài: V-아/어 놓다, N 대신, V-(으)ㄹ까 하다, V/A-(으)ㄹ 테니까.',
    paragraphs: [
      {
        ko: '한국의 가장 큰 {{명절}}은 설날과 추석이에요. 명절 {{연휴}}에는 많은 사람들이 {{고향에 가요}}. 설날에는 {{한복을 입어요}}. 아침에 {{조상}}께 {{차례를 지내요}}. 그리고 밥 대신 {{떡국}}을 먹고 어른들께 {{세배를 해요}}. 가족들과 {{윷놀이를 해요}}.',
        vi: 'Ngày lễ truyền thống lớn nhất của Hàn Quốc là Tết Nguyên đán và Trung thu. Vào kỳ nghỉ lễ dài, nhiều người về quê. Ngày Tết người ta mặc hanbok. Buổi sáng cúng tổ tiên. Rồi ăn canh bánh gạo thay cho cơm và lạy chào năm mới người lớn. Cả nhà chơi trò Yut.',
      },
      {
        ko: '추석은 가을에 {{곡식}}을 {{추수하고}} 감사하는 날이에요. 옛날에는 {{농사}}가 아주 중요했어요. 추석에는 {{성묘를 해요}}. 그리고 {{송편}}을 만들어요. 밤에는 {{보름달}}을 보면서 {{소원을 빌어요}}. 여자들은 손을 잡고 {{강강술래}}를 해요.',
        vi: 'Trung thu là ngày thu hoạch ngũ cốc vào mùa thu và tạ ơn. Ngày xưa nghề nông rất quan trọng. Dịp Trung thu người ta đi tảo mộ. Rồi làm bánh songpyeon. Ban đêm vừa ngắm trăng tròn vừa cầu nguyện điều ước. Phụ nữ nắm tay nhau múa vòng tròn ganggangsullae.',
      },
      {
        ko: '명절에는 음식도 많아요. 저는 엄마 대신 {{빈대떡을 부쳤어요}}. 동생은 {{음식을 차렸어요}}. {{빈대떡}}, {{한과}}, {{식혜}}가 다 맛있었어요. 할머니는 명절이 끝나면 {{김치를 담가요}}.',
        vi: 'Ngày lễ có rất nhiều món ăn. Tôi chiên bánh đậu xanh thay mẹ. Em tôi bày món ăn ra. Bánh đậu xanh, bánh kẹo truyền thống, nước gạo ngọt đều ngon. Hết dịp lễ là bà làm kimchi.',
      },
      {
        ko: '손님들이 오실 테니까 명절 전에 집을 청소해 놓았어요. 저는 {{방을 닦고}} {{청소기를 돌렸어요}}. 언니는 {{세탁기를 돌리고}} {{설거지를 했어요}}.',
        vi: 'Khách sẽ đến nên trước ngày lễ chúng tôi dọn nhà sẵn. Tôi lau phòng rồi hút bụi. Chị tôi chạy máy giặt rồi rửa bát.',
      },
      {
        ko: '연휴에 외국인 친구를 데리고 {{민속촌}}에 갔어요. 부모님도 {{모시고}} 갔어요. 저는 친구에게 {{가이드북}}을 {{보여 주었어요}}. 친구는 {{한복을 입고}} 사진을 찍었어요. 어린 조카는 {{색동저고리}}를 입었어요. 조카는 지난달에 {{돌잔치}}를 했어요. 비가 와서 {{실내}}에서 공연을 봤어요. 우리는 맛있는 떡을 {{나눠}} 먹었어요. 저는 학교 신문 {{원고}}를 {{맡았어요}}. 그래서 민속촌 이야기를 쓸까 해요.',
        vi: 'Kỳ nghỉ, tôi dẫn bạn người nước ngoài đi làng dân gian. Tôi còn đưa cả bố mẹ đi. Tôi cho bạn xem sách hướng dẫn du lịch. Bạn tôi mặc hanbok chụp ảnh. Đứa cháu nhỏ mặc áo khoác nhiều màu truyền thống. Tháng trước cháu vừa làm tiệc đầy năm. Trời mưa nên chúng tôi xem biểu diễn trong nhà. Chúng tôi chia nhau ăn bánh gạo ngon. Tôi phụ trách bản thảo cho báo trường. Vì vậy tôi định viết về làng dân gian.',
      },
    ],
  },

  17: {
    title: '비행기를 놓칠 뻔했어요',
    titleVi: 'Suýt nữa thì lỡ chuyến bay',
    note: 'Dùng đủ 62 từ vựng và 4 ngữ pháp của bài: V-아다/어다 주다, V-(으)ㄹ 뻔하다, bất quy tắc \'ㅎ\', V-아/어 있다.',
    paragraphs: [
      {
        ko: '어제는 정말 {{정신이 없었어요}}. 아침에 {{깜빡 졸아서}} 비행기를 {{놓칠}} 뻔했어요. 공항에 뛰어가다가 {{넘어졌어요}}. 그리고 사람하고 {{부딪혔어요}}. 휴대폰도 {{떨어뜨렸어요}}.',
        vi: 'Hôm qua đúng là rối tung cả lên. Buổi sáng tôi ngủ gật nên suýt lỡ chuyến bay. Đang chạy ra sân bay thì bị ngã. Rồi còn va vào người khác. Điện thoại cũng làm rơi.',
      },
      {
        ko: '{{마침}} 비행기가 늦게 출발해서 {{다행이에요}}. 하지만 공항에서 가방을 {{잃어버렸어요}}. 정말 {{큰일이 났어요}}. 제가 {{실수했어요}}. 너무 {{후회가 돼요}}.',
        vi: 'Đúng lúc máy bay khởi hành muộn nên thật may. Nhưng ở sân bay tôi làm mất túi. Đúng là xảy ra chuyện lớn. Tôi đã mắc lỗi. Hối hận quá.',
      },
      {
        ko: '공항 {{유실물 센터}}에 가서 {{경찰관}}에게 {{신고}}를 했어요.\n"어떤 가방이에요?"\n"{{갈색}} 가방인데 {{줄무늬}}가 있어요. {{끈}}에 {{이름표}}가 {{달려}} 있어요. 가방 안에 {{수첩}}하고 {{소중한}} 사진이 있어요."\n"그럼 1층 {{분실물 센터}}에 가 보세요. 거기에 {{분실물}}이 많이 있어요."',
        vi: 'Tôi đến trung tâm đồ thất lạc của sân bay trình báo với cảnh sát.\n"Túi như thế nào ạ?"\n"Túi màu nâu có họa tiết kẻ sọc. Trên dây có gắn thẻ tên. Trong túi có sổ tay và những tấm ảnh quý giá."\n"Vậy chị thử xuống trung tâm đồ thất lạc ở tầng 1 xem. Ở đó có nhiều đồ thất lạc lắm."',
      },
      {
        ko: '분실물 센터에는 가방이 많이 {{놓여}} 있었어요. 벽에도 가방들이 {{걸려}} 있었어요. 가방마다 종이가 {{붙어}} 있었어요. 문은 {{열려}} 있었어요. 직원이 문 앞에 {{서}} 있었어요. 어떤 아저씨는 의자에 {{누워}} 있었어요.',
        vi: 'Trong trung tâm đồ thất lạc có rất nhiều túi được đặt ở đó. Trên tường cũng treo nhiều túi. Túi nào cũng được dán giấy. Cửa đang mở. Nhân viên đứng trước cửa. Có một ông chú đang nằm trên ghế.',
      },
      {
        ko: '가방이 정말 많았어요. {{까만색}}, {{하얀색}}, {{노란색}}, {{파란색}}, {{녹색}}, {{연두색}}, {{보라색}}, {{분홍색}}, {{주황색}}, {{회색}} 가방이 있었어요. {{꽃무늬}}, {{체크무늬}}, {{물방울무늬}} 가방도 있었어요. {{빨간}} 가방, {{까만}} 가방, {{노란}} 가방, {{파란}} 가방, {{하얀}} 가방… 마치 {{무지개}} 같았어요.',
        vi: 'Túi nhiều thật. Có túi màu đen, trắng, vàng, xanh dương, xanh lá, xanh nõn chuối, tím, hồng, cam, xám. Còn có túi họa tiết hoa, caro, chấm bi. Túi đỏ, túi đen, túi vàng, túi xanh, túi trắng… cứ như cầu vồng vậy.',
      },
      {
        ko: '{{거의}} 한 시간 동안 찾았어요. 드디어 제 가방을 찾았어요! 직원이 가방을 {{돌려주었어요}}. 다음에는 가방을 잘 {{두고}} 다닐 거예요. 그런데 {{태풍이 와서}} 비행기가 또 늦게 왔어요. 집에 늦게 와서 엄마한테 {{야단을 맞았어요}}. 엄마는 "{{시간을 지켜야}} 돼." 하셨어요. 저는 "{{사정이 있었어요}}." 하고 말했어요.',
        vi: 'Tôi tìm gần như suốt một tiếng. Cuối cùng cũng tìm thấy túi của mình! Nhân viên trả lại túi cho tôi. Lần sau tôi sẽ để túi cẩn thận. Nhưng có bão tới nên máy bay lại đến muộn. Về nhà muộn nên tôi bị mẹ mắng. Mẹ nói: "Con phải đúng giờ chứ." Tôi nói: "Con có lý do mà."',
      },
      {
        ko: '그날은 사건이 많았어요. 옆 아파트에 {{불이 났어요}}. 아버지 차도 {{고장이 났어요}}. 집 앞 길에서 {{사고가 났어요}}. 다음 날 저는 {{조카}}를 {{데리고}} 공원에 갔어요. 조카는 장난감을 {{가지고}} 왔어요.',
        vi: 'Hôm đó có nhiều chuyện. Chung cư bên cạnh bị cháy. Xe của bố cũng bị hỏng. Trên đường trước nhà xảy ra tai nạn. Hôm sau tôi dẫn cháu ra công viên. Cháu mang theo đồ chơi.',
      },
    ],
  },

  18: {
    title: '한국에 온 지 벌써 6개월이 되었어요',
    titleVi: 'Đến Hàn Quốc đã được 6 tháng rồi',
    note: 'Dùng đủ 29 từ vựng và 4 ngữ pháp của bài: V-(으)ㄴ 지, N(이)나 (2), A-다 / V-ㄴ다/는다, N(이)다.',
    paragraphs: [
      {
        ko: '한국에 온 지 벌써 6개월이 되었다. {{시간이 지나가는}} 게 정말 빠르다. {{오랜만에}} 고향 친구에게 전화했다. "{{오래간만이다}}!" 친구 목소리를 들으니까 {{눈물을 흘렸다}}. 가족이 너무 {{그립다}}.',
        vi: 'Tôi đến Hàn Quốc đã được 6 tháng rồi. Thời gian trôi qua thật nhanh. Sau một thời gian dài, tôi gọi điện cho bạn ở quê. "Lâu lắm rồi nhỉ!" Nghe giọng bạn mà tôi rơi nước mắt. Tôi nhớ gia đình quá.',
      },
      {
        ko: '처음 왔을 때는 여름이었다. {{장마가 시작돼서}} 한 달 {{내내}} 비가 왔다. {{습도가 높고}} 더웠다. 가을에는 {{단풍이 들고}} {{나뭇잎이 떨어졌다}}. 날씨가 {{쌀쌀했다}}. 겨울에는 {{기온이 영하로 내려갔다}}. {{바람이 불고}} {{눈이 내렸다}}. 강에 {{얼음이 얼었다}}. 날씨가 아주 {{건조했다}}. 이제 곧 봄이니까 {{꽃이 필}} 것이다.',
        vi: 'Khi tôi mới đến là mùa hè. Mùa mưa bắt đầu nên suốt một tháng trời mưa. Độ ẩm cao và nóng. Mùa thu lá chuyển màu, lá rụng. Thời tiết se lạnh. Mùa đông nhiệt độ xuống dưới 0. Gió thổi và tuyết rơi. Sông đóng băng. Thời tiết rất khô hanh. Sắp sang xuân rồi nên hoa sẽ nở.',
      },
      {
        ko: '나는 {{홈스테이를 한다}}. 홈스테이 가족은 나를 가족처럼 {{대해}} 준다. 할아버지는 {{나이가 들어서}} 귀가 잘 안 들리신다. 그래서 할아버지는 늘 {{말없이}} 웃으신다.',
        vi: 'Tôi ở homestay. Gia đình homestay đối xử với tôi như người nhà. Ông đã lớn tuổi nên tai không còn nghe rõ. Vì vậy ông lúc nào cũng lặng lẽ mỉm cười.',
      },
      {
        ko: '6개월 동안 많은 {{변화}}가 있었다. 내 한국어 {{실력이 늘었다}}. 생활도 많이 {{바뀌었다}}. 서울은 {{매우}} 빨리 {{발전하는}} 도시다. 하지만 나는 {{아직도}} 한국 음식을 잘 못 만든다.',
        vi: 'Trong 6 tháng đã có nhiều thay đổi. Tiếng Hàn của tôi tiến bộ. Cuộc sống cũng thay đổi nhiều. Seoul là thành phố phát triển rất nhanh. Nhưng tôi vẫn chưa nấu được món Hàn ngon.',
      },
      {
        ko: '한국에서 좋은 {{추억}}이 많이 생겼다. 그런데 다음 달에 친한 친구가 고향에 돌아간다. 정말 {{아쉽다}}.',
        vi: 'Tôi có rất nhiều kỷ niệm đẹp ở Hàn Quốc. Nhưng tháng sau người bạn thân của tôi về nước. Thật là tiếc nuối.',
      },
    ],
  },
}
