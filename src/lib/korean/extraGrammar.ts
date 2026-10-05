// Ngữ pháp MỞ RỘNG — mẫu chưa có trong 18 bài TOPIK II / 16 bài TOPIK I nhưng đã gặp trong bài đọc, hội thoại…
// Chỉ hiện ở Cẩm nang (nhóm "Ngữ pháp mở rộng"), không thuộc bài nào nên không nằm trong DB / seed. Cùng kiểu
// KoreanCard để Cẩm nang hiển thị bằng đúng GrammarBody như thẻ trong bài. `lesson` = 0 (không thuộc bài nào).
import type { KoreanCard } from '@/lib/korean/types'
import type { ExampleDetail } from '@/lib/korean/exampleDetail'

const card = (c: Pick<KoreanCard, 'id' | 'front' | 'meaning' | 'note' | 'theory' | 'sortOrder'> & { details: ExampleDetail[] }): KoreanCard => ({
  id: c.id,
  kind: 'grammar',
  lesson: 0,
  front: c.front,
  meaning: c.meaning,
  note: c.note,
  example: c.details.map((d) => d.ko).join('\n'),
  theory: c.theory,
  exampleDetail: JSON.stringify(c.details),
  sortOrder: c.sortOrder,
  createdAt: '2026-10-05T00:00:00.000Z',
})

export const EXTRA_GRAMMAR: (KoreanCard & { cat: string; tip: string })[] = [
  {
    ...card({
      id: 'extra-dago-hada',
      front: 'A/V-다고 하다, N(이)라고 하다 (gián tiếp)',
      meaning: '[Ai đó] nói rằng… — thuật lại lời người khác theo lối gián tiếp (dạng đầy đủ của -대요).',
      note: 'A: 다고 하다 · V받침O: 는다고 하다 · V받침X: ㄴ다고 하다 · N받침O: 이라고 하다 · N받침X: 라고 하다 · Quá khứ: 았/었다고 하다 · Tương lai: (으)ㄹ 거라고 하다',
      theory: [
        "Dùng để thuật lại lời nói, suy nghĩ hoặc thông tin của người khác theo lối GIÁN TIẾP: '[ai đó] nói rằng…'. Người được thuật lại thường đứng đầu câu với 이/가 hoặc 은/는, còn 하다 chia theo thời điểm người đó nói: 했어요 (đã nói), 해요 (hay nói / người ta nói).",
        'Cách chia giống đuôi câu trần thuật -다 rồi thêm 고 하다: tính từ + 다고 (바쁘다고 했어요); động từ có patchim + 는다고 (먹는다고), không patchim + ㄴ다고 (간다고); danh từ + (이)라고 (학생이라고, 의사라고). Việc đã xảy ra: 았/었다고 (갔다고). Việc sẽ xảy ra: (으)ㄹ 거라고 (올 거라고).',
        "So với trích dẫn TRỰC TIẾP: giữ nguyên lời gốc trong ngoặc kép rồi thêm 라고 하다 — 민수 씨가 \"배가 고파요\"라고 했어요. Gián tiếp thì đổi lời gốc về đuôi -다 và bỏ ngoặc — 민수 씨가 배가 고프다고 했어요.",
        'Liên hệ bài đã học: N(이)라고 하다 ở TOPIK II · Bài 1 (저는 마리코라고 합니다 = tôi tên là Mariko) chính là dạng danh từ của mẫu này, dùng để nói tên gọi. Ở đây nó mở rộng ra thành thuật lại cả câu nói.',
        'Trong văn nói, -다고 해요 thường được rút gọn thành -대요 (바쁘다고 해요 → 바쁘대요), xem mẫu -대요 ngay bên dưới. Dạng đầy đủ -다고 하다 trang trọng hơn, dùng được ở mọi thì (했어요 / 해요 / 할 거예요) và hay gặp khi viết.',
      ].join('\n\n'),
      sortOrder: 0,
      details: [
        { ko: '민수 씨가 오늘 바쁘다고 했어요.', vi: 'Minsu nói là hôm nay bận.', vocab: '', breakdown: '바쁘다 (tính từ) + 다고 했어요 → 바쁘다고 했어요' },
        { ko: '지아는 순두부찌개를 먹는다고 했어요.', vi: 'Jia nói là sẽ ăn canh đậu phụ non.', vocab: '순두부찌개: canh đậu phụ non', breakdown: '먹다 (động từ, có patchim) + 는다고 → 먹는다고 했어요' },
        { ko: '선배가 다음 달에 터키에 간다고 했어요.', vi: 'Tiền bối nói tháng sau sẽ đi Thổ Nhĩ Kỳ.', vocab: '', breakdown: '가다 (động từ, không patchim) + ㄴ다고 → 간다고 했어요' },
        { ko: '그 사람은 자기가 의사라고 했어요.', vi: 'Người đó nói mình là bác sĩ.', vocab: '자기: bản thân (người đó)', breakdown: '의사 (danh từ, không patchim) + 라고 → 의사라고 했어요' },
        { ko: '친구가 어제 그 영화를 봤다고 했어요.', vi: 'Bạn tôi nói hôm qua đã xem bộ phim đó.', vocab: '', breakdown: '보다 → 봤다 (quá khứ) + 고 했어요 → 봤다고 했어요' },
        { ko: '뉴스에서 내일 비가 올 거라고 했어요.', vi: 'Bản tin nói ngày mai trời sẽ mưa.', vocab: '뉴스: bản tin', breakdown: '오다 → 올 거다 (tương lai) + 라고 → 올 거라고 했어요' },
      ],
    }),
    cat: 'reported',
    tip: 'Dạng đầy đủ, trang trọng: "[ai đó] nói rằng…", chia được mọi thì ở 하다. Văn nói rút gọn thành -대요.',
  },
  {
    ...card({
      id: 'extra-dae-yo',
      front: 'A/V-대요, N(이)래요',
      meaning: 'Nghe nói…, người ta nói… — thuật lại điều mình nghe / đọc được từ người khác (rút gọn của -다고 해요).',
      note: 'A: 대요 · V받침O: 는대요 · V받침X: ㄴ대요 · N받침O: 이래요 · N받침X: 래요 · Quá khứ: 았/었대요 · Tương lai: (으)ㄹ 거래요',
      theory: [
        "Dùng khi kể lại thông tin KHÔNG phải mình trực tiếp biết, mà nghe ai đó nói hoặc đọc ở đâu đó: 'nghe nói…', 'người ta bảo…', 'cậu ấy bảo…'. Rất hay dùng trong văn nói.",
        "-대요 là dạng rút gọn của lời nói gián tiếp -다고 해요: 많다고 해요 → 많대요, 먹는다고 해요 → 먹는대요, 학생이라고 해요 → 학생이래요. Hai dạng cùng nghĩa; dạng đầy đủ trang trọng hơn, hay gặp khi viết.",
        'Cách chia giống đuôi câu trần thuật -다: tính từ + 대요 (예쁘대요); động từ có patchim + 는대요 (먹는대요), không patchim + ㄴ대요 (간대요); danh từ + (이)래요 (의사래요, 학생이래요). Quá khứ: 았/었대요 (갔대요). Tương lai / dự định: (으)ㄹ 거래요 (올 거래요).',
        'Cùng họ với -대요 còn có: câu hỏi -냬요 (뭐 먹냬요 = hỏi ăn gì), mệnh lệnh -(으)래요 (빨리 오래요 = bảo đến nhanh), rủ rê -재요 (같이 가재요 = rủ đi cùng).',
        'Đừng nhầm -대요 với -데요: -대요 là nghe NGƯỜI KHÁC nói, còn -데요 (rút gọn của -더라고요) là kể lại điều CHÍNH MÌNH đã trải nghiệm. 맛있대요 = nghe nói ngon; 맛있데요 = (tôi ăn rồi) thấy ngon lắm.',
      ].join('\n\n'),
      sortOrder: 1,
      details: [
        { ko: '그 식당은 항상 사람이 많대요.', vi: 'Nghe nói quán đó lúc nào cũng đông.', vocab: '식당: quán ăn', breakdown: '많다 (tính từ) + 대요 → 많대요' },
        { ko: '이 식당에서는 삼겹살을 2인분 이상 주문해야 한대요.', vi: 'Nghe nói ở quán này phải gọi thịt ba chỉ từ 2 suất trở lên.', vocab: '2인분 이상: từ 2 suất trở lên', breakdown: '하다 (động từ, không patchim) + ㄴ대요 → 한대요' },
        { ko: '지아의 순두부찌개는 좀 싱거웠대요.', vi: 'Jia bảo canh đậu phụ non của cậu ấy hơi nhạt.', vocab: '싱겁다: nhạt', breakdown: '싱겁다 → 싱거웠다 (quá khứ) + 대요 → 싱거웠대요' },
        { ko: '민수 씨 형은 의사래요.', vi: 'Nghe nói anh trai của Minsu là bác sĩ.', vocab: '의사: bác sĩ', breakdown: '의사 (danh từ, không patchim) + 래요 → 의사래요' },
        { ko: '내일 비가 올 거래요.', vi: 'Nghe nói ngày mai trời sẽ mưa.', vocab: '', breakdown: '오다 → 올 거다 (tương lai) + 래요 → 올 거래요' },
      ],
    }),
    cat: 'reported',
    tip: 'Thuật lại điều nghe được: rút gọn của -다고 해요. Khác -데요 (chính mình trải nghiệm).',
  },
]
