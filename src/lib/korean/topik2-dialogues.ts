// SINH TỰ ĐỘNG bởi scripts/import-korean-topik2-dialogues.mjs từ scripts/korean-data/topik2/*.json — đừng sửa tay.
import type { Dialogue } from '@/lib/chinese/dialogues'

export const TOPIK2_DIALOGUES: Record<number, Dialogue[]> = {
  "1": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "마리코",
          "zh": "처음 뵙겠습니다. 저는 다나카 [1:마리코라고 합니다].",
          "vi": "Rất hân hạnh được gặp anh. Tôi tên là Tanaka Mariko."
        },
        {
          "who": "스티븐",
          "zh": "만나서 반가워요, 다나카 마리코 씨. 저는 스티븐입니다.",
          "vi": "Rất vui được gặp chị, Tanaka Mariko. Tôi là Steven."
        },
        {
          "who": "마리코",
          "zh": "그냥 [1:마리코라고 부르세요]. 실례지만 스티븐 씨는 무슨 일을 하세요?",
          "vi": "Anh cứ gọi tôi là Mariko thôi. Xin lỗi, anh Steven làm nghề gì vậy?"
        },
        {
          "who": "스티븐",
          "zh": "저는 대학교에서 한국 역사를 공부하고 있어요. 마리코 씨는 왜 한국어를 공부하세요?",
          "vi": "Tôi đang học lịch sử Hàn Quốc ở trường đại học. Còn Mariko học tiếng Hàn để làm gì?"
        },
        {
          "who": "마리코",
          "zh": "좋아하는 한국 드라마를 한국어로 [2:보려고] 공부해요.",
          "vi": "Tôi học để xem phim truyền hình Hàn Quốc mình thích bằng tiếng Hàn."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "N(이)라고 하다",
          "np": "NP 1.1"
        },
        {
          "n": 2,
          "label": "V-(으)려고",
          "np": "NP 1.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "샤오밍",
          "zh": "마리코 씨는 주말에 보통 뭐 하세요?",
          "vi": "Mariko cuối tuần thường làm gì?"
        },
        {
          "who": "마리코",
          "zh": "집에서 쉬거나 친구를 만나요. 샤오밍 씨는요?",
          "vi": "Tôi nghỉ ở nhà hoặc gặp bạn bè. Còn Tiểu Minh?"
        },
        {
          "who": "샤오밍",
          "zh": "저는 주말에는 항상 운동을 해요.",
          "vi": "Cuối tuần tôi luôn tập thể thao."
        },
        {
          "who": "마리코",
          "zh": "무슨 운동을 해요?",
          "vi": "Anh tập môn gì?"
        },
        {
          "who": "샤오밍",
          "zh": "수영이나 농구를 해요.",
          "vi": "Tôi bơi hoặc chơi bóng rổ."
        },
        {
          "who": "마리코",
          "zh": "그래요? 저도 매일 수영을 해요.",
          "vi": "Vậy à? Tôi cũng bơi mỗi ngày."
        },
        {
          "who": "샤오밍",
          "zh": "어, 우리는 취미가 같네요.",
          "vi": "Ồ, chúng ta có cùng sở thích nhỉ."
        }
      ]
    }
  ],
  "2": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "나나",
          "zh": "정우 씨는 취미가 뭐예요?",
          "vi": "Sở thích của Jeongwoo là gì?"
        },
        {
          "who": "정우",
          "zh": "저는 [1:운동하는 것]을 좋아해요. 나나 씨는요?",
          "vi": "Tôi thích tập thể thao. Còn Nana?"
        },
        {
          "who": "나나",
          "zh": "저도 [1:운동하는 것]을 좋아해요. 정우 씨는 무슨 운동을 잘하세요?",
          "vi": "Tôi cũng thích tập thể thao. Jeongwoo giỏi môn gì?"
        },
        {
          "who": "정우",
          "zh": "테니스를 좀 [2:칠 줄 알아요]. 나나 씨도 테니스를 [2:칠 줄 아세요]?",
          "vi": "Tôi biết chơi tennis một chút. Nana cũng biết chơi tennis chứ?"
        },
        {
          "who": "나나",
          "zh": "아니요, 저는 테니스를 전혀 못 쳐요. 시간이 나면 한번 배워 보고 싶어요.",
          "vi": "Không, tôi hoàn toàn không biết chơi tennis. Có thời gian tôi muốn học thử một lần."
        },
        {
          "who": "정우",
          "zh": "그럼 제가 가르쳐 드릴까요?",
          "vi": "Vậy để tôi dạy cho nhé?"
        },
        {
          "who": "나나",
          "zh": "네, 좋아요. 고마워요.",
          "vi": "Vâng, được đấy. Cảm ơn anh."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-는 것",
          "np": "NP 2.1"
        },
        {
          "n": 2,
          "label": "V-(으)ㄹ 줄 알다",
          "np": "NP 2.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "나나",
          "zh": "마리코 씨, [1:요리하는 것]을 좋아해요?",
          "vi": "Mariko, cậu thích nấu ăn à?"
        },
        {
          "who": "마리코",
          "zh": "네, 그래서 요리 동호회에 가입했어요. 어제도 모임이 있었어요.",
          "vi": "Ừ, nên tớ đã tham gia câu lạc bộ nấu ăn. Hôm qua cũng có buổi họp mặt."
        },
        {
          "who": "나나",
          "zh": "어제는 뭘 했어요?",
          "vi": "Hôm qua các cậu làm gì?"
        },
        {
          "who": "마리코",
          "zh": "한국 음식을 만들었어요. 어제 [3:만든 음식]은 김밥이에요.",
          "vi": "Bọn tớ làm món Hàn. Món làm hôm qua là kimbap."
        },
        {
          "who": "나나",
          "zh": "한국 음식 [1:만드는 게] [4:어렵지 않았어요]?",
          "vi": "Làm món Hàn không khó à?"
        },
        {
          "who": "마리코",
          "zh": "별로 [4:어렵지 않았어요]. 재미있었어요.",
          "vi": "Không khó lắm. Vui lắm."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-는 것",
          "np": "NP 2.1"
        },
        {
          "n": 3,
          "label": "V-(으)ㄴ N",
          "np": "NP 2.3"
        },
        {
          "n": 4,
          "label": "V/A-지 않다",
          "np": "NP 2.4"
        }
      ]
    }
  ],
  "3": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "나나",
          "zh": "히엔 씨, [2:방학 동안] 뭐 했어요?",
          "vi": "Hiền, kỳ nghỉ cậu đã làm gì?"
        },
        {
          "who": "히엔",
          "zh": "제주도에 갔다 왔어요.",
          "vi": "Tớ đã đi đảo Jeju về."
        },
        {
          "who": "나나",
          "zh": "아, 저도 작년에 제주도에 [1:가 봤어요]. 제주도에서 [1:낚시해 봤어요]?",
          "vi": "À, năm ngoái tớ cũng đi Jeju rồi. Cậu đã thử câu cá ở Jeju chưa?"
        },
        {
          "who": "히엔",
          "zh": "네, 낚시도 [1:해 보고] 생선회도 [1:먹어 봤어요].",
          "vi": "Rồi, tớ đã thử câu cá và cũng ăn thử gỏi cá sống."
        },
        {
          "who": "나나",
          "zh": "제주도에 [2:얼마 동안] 있었어요?",
          "vi": "Cậu ở Jeju bao lâu?"
        },
        {
          "who": "히엔",
          "zh": "5일 있었어요. 정말 재미있었어요.",
          "vi": "Tớ ở 5 ngày. Vui thật sự."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-아/어 보다",
          "np": "NP 3.1"
        },
        {
          "n": 2,
          "label": "N 동안",
          "np": "NP 3.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "나나",
          "zh": "줄리앙 씨, 한국 가수 콘서트에 [1:가 봤어요]?",
          "vi": "Julien, anh đã đi xem concert ca sĩ Hàn Quốc chưa?"
        },
        {
          "who": "줄리앙",
          "zh": "아니요, 못 [1:가 봤어요].",
          "vi": "Chưa, tôi chưa đi được."
        },
        {
          "who": "나나",
          "zh": "그럼 이번 주말에 시간 괜찮아요? 콘서트 표가 [3:있는데] 같이 가요.",
          "vi": "Vậy cuối tuần này anh có rảnh không? Tôi có vé concert, mình đi cùng nhé."
        },
        {
          "who": "줄리앙",
          "zh": "미안해요. 저도 가고 싶지만 갈 시간이 없어요.",
          "vi": "Xin lỗi nhé. Tôi cũng muốn đi nhưng không có thời gian."
        },
        {
          "who": "나나",
          "zh": "왜요? 무슨 일 있어요?",
          "vi": "Sao thế? Có chuyện gì à?"
        },
        {
          "who": "줄리앙",
          "zh": "고향에서 친구가 와요.",
          "vi": "Bạn tôi từ quê sang chơi."
        },
        {
          "who": "나나",
          "zh": "그래요? 그럼 다음에 꼭 같이 가요.",
          "vi": "Vậy à? Thế lần sau nhất định cùng đi nhé."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-아/어 보다",
          "np": "NP 3.1"
        },
        {
          "n": 3,
          "label": "V-는데 (bối cảnh)",
          "np": "NP 3.3"
        }
      ]
    }
  ],
  "4": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "점원",
          "zh": "손님, 어떤 옷을 찾으세요?",
          "vi": "Quý khách tìm loại quần áo nào ạ?"
        },
        {
          "who": "유진",
          "zh": "코트 좀 보려고 왔어요.",
          "vi": "Tôi đến để xem áo khoác."
        },
        {
          "who": "점원",
          "zh": "이건 어떠세요? 요즘 유행하는 스타일이에요.",
          "vi": "Cái này thì sao ạ? Đây là kiểu đang thịnh hành."
        },
        {
          "who": "유진",
          "zh": "네, 한번 입어 볼게요.",
          "vi": "Vâng, tôi mặc thử xem."
        },
        {
          "who": "점원",
          "zh": "어떠세요? 마음에 드세요?",
          "vi": "Thế nào ạ? Chị có ưng không?"
        },
        {
          "who": "유진",
          "zh": "사이즈가 좀 [1:큰 것 같아요].",
          "vi": "Hình như cỡ hơi rộng."
        },
        {
          "who": "점원",
          "zh": "그럼 한 사이즈 작은 거로 보여 드릴게요. 잠깐만 기다리세요.",
          "vi": "Vậy để tôi cho chị xem cỡ nhỏ hơn một số. Chị đợi một chút nhé."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "A-(으)ㄴ/V-는 것 같다",
          "np": "NP 4.1"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "점원",
          "zh": "어서 오세요. 찾으시는 거 있으세요?",
          "vi": "Xin mời vào. Anh đang tìm gì ạ?"
        },
        {
          "who": "아키라",
          "zh": "어제 이 넥타이를 샀는데 다른 거로 [3:바꿨으면 좋겠어요].",
          "vi": "Hôm qua tôi mua cái cà vạt này, tôi muốn đổi sang cái khác."
        },
        {
          "who": "점원",
          "zh": "왜요? 마음에 안 드세요?",
          "vi": "Sao vậy ạ? Anh không ưng à?"
        },
        {
          "who": "아키라",
          "zh": "네, 색깔이 너무 [1:어두운 것 같아요]. [2:이것보다] 좀 더 밝은 거 있어요?",
          "vi": "Vâng, hình như màu tối quá. Có cái nào sáng màu hơn cái này không?"
        },
        {
          "who": "점원",
          "zh": "그럼 이건 어떠세요? 한번 해 보세요.",
          "vi": "Vậy cái này thì sao ạ? Anh đeo thử xem."
        },
        {
          "who": "점원",
          "zh": "잘 어울리시네요. 이거로 드릴까요?",
          "vi": "Anh đeo hợp lắm. Tôi gói cái này cho anh nhé?"
        },
        {
          "who": "아키라",
          "zh": "네, 이거로 주세요.",
          "vi": "Vâng, lấy cho tôi cái này."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "A-(으)ㄴ/V-는 것 같다",
          "np": "NP 4.1"
        },
        {
          "n": 2,
          "label": "N보다",
          "np": "NP 4.2"
        },
        {
          "n": 3,
          "label": "-았/었으면 좋겠다",
          "np": "NP 4.3"
        }
      ]
    }
  ],
  "5": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "마리코",
          "zh": "다음 주에 친구가 한국에 와요.",
          "vi": "Tuần sau bạn tôi sang Hàn Quốc."
        },
        {
          "who": "지연",
          "zh": "그래요? 여행 오는 거예요?",
          "vi": "Vậy à? Bạn sang du lịch à?"
        },
        {
          "who": "마리코",
          "zh": "네, 그런데 친구하고 어디에 가면 [1:좋을까요?]",
          "vi": "Ừ, nhưng đi đâu với bạn thì hay nhỉ?"
        },
        {
          "who": "지연",
          "zh": "안동에 가 봤어요? 안 가 봤으면 한번 가 보세요.",
          "vi": "Cậu đi Andong chưa? Nếu chưa thì thử đi một lần xem."
        },
        {
          "who": "마리코",
          "zh": "안동이 어떤 곳이에요?",
          "vi": "Andong là nơi thế nào?"
        },
        {
          "who": "지연",
          "zh": "경치도 아름답고 한국의 전통문화도 느낄 수 있는 곳이에요. 친구가 [2:좋아할 거예요].",
          "vi": "Là nơi cảnh đẹp mà còn cảm nhận được văn hóa truyền thống Hàn Quốc. Bạn cậu chắc sẽ thích."
        },
        {
          "who": "마리코",
          "zh": "아, 그래요? 안동 가는 패키지여행이 [1:있을까요?]",
          "vi": "À, vậy à? Không biết có tour trọn gói đi Andong không nhỉ?"
        },
        {
          "who": "지연",
          "zh": "네, [2:있을 거예요]. 여행사에 가서 한번 알아보세요.",
          "vi": "Chắc là có. Cậu thử đến công ty du lịch hỏi xem."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "-(으)ㄹ까요?",
          "np": "NP 5.1"
        },
        {
          "n": 2,
          "label": "-(으)ㄹ 거예요 (suy đoán)",
          "np": "NP 5.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "직원",
          "zh": "어서 오세요.",
          "vi": "Xin mời vào."
        },
        {
          "who": "마리코",
          "zh": "1박 2일로 안동에 가려고 하는데 어떤 여행 상품이 있어요?",
          "vi": "Tôi định đi Andong 2 ngày 1 đêm, có những tour nào vậy?"
        },
        {
          "who": "직원",
          "zh": "언제 [2:가실 거예요]?",
          "vi": "Chị định đi khi nào ạ?"
        },
        {
          "who": "마리코",
          "zh": "다음 주말에 가려고 해요.",
          "vi": "Tôi định đi cuối tuần sau."
        },
        {
          "who": "직원",
          "zh": "그럼 토요일 아침에 출발하는 게 있는데 어떠세요? 자세한 일정은 여기 [3:있으니까] 한번 보세요.",
          "vi": "Vậy có tour xuất phát sáng thứ Bảy, chị thấy sao ạ? Lịch trình chi tiết ở đây, chị xem thử nhé."
        },
        {
          "who": "마리코",
          "zh": "네, 좋네요. 그런데 요금이 어떻게 돼요?",
          "vi": "Vâng, được đấy. Mà giá bao nhiêu ạ?"
        },
        {
          "who": "직원",
          "zh": "한 분에 10만 원인데 교통비와 숙박비가 포함되어 있습니다.",
          "vi": "Mỗi người 100.000 won, đã bao gồm phí đi lại và tiền phòng."
        },
        {
          "who": "마리코",
          "zh": "네, 알겠습니다. 생각해 [4:보고 나서] 연락드릴게요.",
          "vi": "Vâng, tôi hiểu rồi. Tôi suy nghĩ rồi sẽ liên lạc lại."
        },
        {
          "who": "직원",
          "zh": "네, 연락 주세요.",
          "vi": "Vâng, chị liên lạc nhé."
        }
      ],
      "legend": [
        {
          "n": 2,
          "label": "-(으)ㄹ 거예요 (suy đoán)",
          "np": "NP 5.2"
        },
        {
          "n": 3,
          "label": "-(으)니까",
          "np": "NP 5.3"
        },
        {
          "n": 4,
          "label": "V-고 나서",
          "np": "NP 5.4"
        }
      ]
    }
  ],
  "6": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "직원",
          "zh": "어서 오세요.",
          "vi": "Xin mời vào."
        },
        {
          "who": "줄리앙",
          "zh": "프랑스에 소포를 보내려고 왔어요.",
          "vi": "Tôi đến để gửi bưu kiện sang Pháp."
        },
        {
          "who": "직원",
          "zh": "네, 여기에 받는 분 성함과 주소를 쓰시고 저울 위에 올려 주세요. 안에 뭐가 들었어요?",
          "vi": "Vâng, anh ghi tên và địa chỉ người nhận vào đây rồi đặt lên cân nhé. Bên trong có gì ạ?"
        },
        {
          "who": "줄리앙",
          "zh": "옷이 들었어요. [1:비행기로] 보내면 요금이 얼마예요?",
          "vi": "Có quần áo. Gửi bằng máy bay thì cước bao nhiêu?"
        },
        {
          "who": "직원",
          "zh": "6만 원이에요. [1:비행기로] 보내시겠어요?",
          "vi": "60.000 won. Anh gửi đường hàng không chứ?"
        },
        {
          "who": "줄리앙",
          "zh": "네, 지금 보내면 언제 도착할까요?",
          "vi": "Vâng, gửi bây giờ thì khi nào đến nơi?"
        },
        {
          "who": "직원",
          "zh": "다음 주 금요일쯤 도착할 거예요. 내일이 [2:휴일이라서] 하루 정도 더 걸려요.",
          "vi": "Khoảng thứ Sáu tuần sau sẽ đến. Mai là ngày nghỉ nên mất thêm khoảng một ngày."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "N(으)로",
          "np": "NP 6.1"
        },
        {
          "n": 2,
          "label": "N(이)라서",
          "np": "NP 6.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "직원",
          "zh": "어서 오세요. 뭘 도와 드릴까요?",
          "vi": "Xin mời vào. Tôi có thể giúp gì ạ?"
        },
        {
          "who": "스티븐",
          "zh": "환전을 하려고 왔습니다.",
          "vi": "Tôi đến để đổi tiền."
        },
        {
          "who": "직원",
          "zh": "얼마를 바꿔 드릴까요?",
          "vi": "Anh muốn đổi bao nhiêu ạ?"
        },
        {
          "who": "스티븐",
          "zh": "1,000달러를 전부 [1:원으로] 바꿔 주세요. 오늘 환율이 어떻게 돼요?",
          "vi": "Đổi hết 1.000 đô la sang won giúp tôi. Tỷ giá hôm nay thế nào?"
        },
        {
          "who": "직원",
          "zh": "1달러에 1,200원입니다.",
          "vi": "1 đô la ăn 1.200 won."
        },
        {
          "who": "스티븐",
          "zh": "지난주보다 [5:오른 것 같네요].",
          "vi": "Hình như tăng so với tuần trước nhỉ."
        },
        {
          "who": "직원",
          "zh": "네, 조금 올랐어요. 신분증 좀 주시겠어요?",
          "vi": "Vâng, tăng một chút. Anh cho tôi xem giấy tờ tùy thân được không?"
        },
        {
          "who": "스티븐",
          "zh": "외국인등록증이 없는데 여권도 괜찮아요?",
          "vi": "Tôi không có thẻ đăng ký người nước ngoài, hộ chiếu có được không?"
        },
        {
          "who": "직원",
          "zh": "네, 여권만 [4:주시면 됩니다].",
          "vi": "Vâng, chỉ cần đưa hộ chiếu là được."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "N(으)로",
          "np": "NP 6.1"
        },
        {
          "n": 4,
          "label": "V-(으)면 되다",
          "np": "NP 6.4"
        },
        {
          "n": 5,
          "label": "V-(으)ㄴ 것 같다",
          "np": "NP 6.5"
        }
      ]
    }
  ],
  "7": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "아키라",
          "zh": "유진 씨, 내일 나나 씨 생일인데 무슨 선물이 좋을까요?",
          "vi": "Yujin, mai là sinh nhật Nana, tặng quà gì thì hay nhỉ?"
        },
        {
          "who": "유진",
          "zh": "나나 씨는 요리하는 것을 좋아하니까 요리책이 [1:좋을 것 같아요].",
          "vi": "Nana thích nấu ăn nên chắc sách dạy nấu ăn sẽ hợp."
        },
        {
          "who": "아키라",
          "zh": "아, 그게 [1:좋을 것 같네요]. 그런데 이 근처에 서점이 어디에 [2:있는지 아세요]?",
          "vi": "À, chắc cái đó hay đấy. Mà chị có biết hiệu sách gần đây ở đâu không?"
        },
        {
          "who": "유진",
          "zh": "네, 우체국 옆에 있어요.",
          "vi": "Có, ở cạnh bưu điện."
        },
        {
          "who": "아키라",
          "zh": "우체국은 어디에 있어요?",
          "vi": "Bưu điện ở đâu?"
        },
        {
          "who": "유진",
          "zh": "이쪽으로 10분쯤 걸어가면 보여요.",
          "vi": "Đi bộ về phía này khoảng 10 phút là thấy."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "-(으)ㄹ 것 같다",
          "np": "NP 7.1"
        },
        {
          "n": 2,
          "label": "V-는지 알다[모르다]",
          "np": "NP 7.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "켈리",
          "zh": "저기요, 한옥마을이 어디에 [2:있는지 아세요]?",
          "vi": "Cho tôi hỏi, bác có biết làng Hanok ở đâu không ạ?"
        },
        {
          "who": "아저씨",
          "zh": "저도 여기가 처음이라서 잘 모르겠어요.",
          "vi": "Tôi cũng mới đến đây lần đầu nên không rõ lắm."
        },
        {
          "who": "켈리",
          "zh": "실례지만 한옥마을에 [4:가려면] 어느 쪽으로 가야 돼요?",
          "vi": "Xin lỗi, muốn đến làng Hanok thì phải đi hướng nào ạ?"
        },
        {
          "who": "아주머니",
          "zh": "4번 출구로 나가면 돼요.",
          "vi": "Ra lối số 4 là được."
        },
        {
          "who": "켈리",
          "zh": "4번 출구에서 한참 가야 돼요?",
          "vi": "Từ lối số 4 có phải đi xa lắm không ạ?"
        },
        {
          "who": "아주머니",
          "zh": "아니요, 가까워요. 쭉 [5:가다가] 사거리에서 길을 건너면 한옥마을이 나와요.",
          "vi": "Không, gần lắm. Cứ đi thẳng, đến ngã tư thì sang đường là thấy làng Hanok."
        },
        {
          "who": "켈리",
          "zh": "감사합니다.",
          "vi": "Cảm ơn bác."
        }
      ],
      "legend": [
        {
          "n": 2,
          "label": "V-는지 알다[모르다]",
          "np": "NP 7.2"
        },
        {
          "n": 4,
          "label": "V-(으)려면",
          "np": "NP 7.4"
        },
        {
          "n": 5,
          "label": "V-다가",
          "np": "NP 7.5"
        }
      ]
    }
  ],
  "8": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "유진",
          "zh": "줄리앙 씨, 무슨 안 좋은 일 있어요?",
          "vi": "Julien, có chuyện gì không vui à?"
        },
        {
          "who": "줄리앙",
          "zh": "네, [2:친구 때문에] 좀 걱정이 돼서요.",
          "vi": "Ừ, tôi hơi lo vì bạn tôi."
        },
        {
          "who": "유진",
          "zh": "왜요? 무슨 일 있어요?",
          "vi": "Sao thế? Có chuyện gì à?"
        },
        {
          "who": "줄리앙",
          "zh": "친구가 교통사고가 나서 병원에 있어요.",
          "vi": "Bạn tôi bị tai nạn giao thông nên đang nằm viện."
        },
        {
          "who": "유진",
          "zh": "아, 그래요? 정말 [1:걱정되겠어요].",
          "vi": "À, vậy à? Chắc anh lo lắm."
        },
        {
          "who": "줄리앙",
          "zh": "네, 친구가 빨리 [5:퇴원했으면 좋겠어요].",
          "vi": "Ừ, mong bạn tôi mau được xuất viện."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V/A-겠-",
          "np": "NP 8.1"
        },
        {
          "n": 2,
          "label": "N 때문에",
          "np": "NP 8.2"
        },
        {
          "n": 5,
          "label": "-았/었으면 좋겠다",
          "np": "NP 8.5"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "마리코",
          "zh": "오늘은 정말 운이 없는 날인 것 같아요.",
          "vi": "Hôm nay đúng là một ngày xui xẻo."
        },
        {
          "who": "지연",
          "zh": "왜요? 무슨 일 있었어요?",
          "vi": "Sao thế? Có chuyện gì à?"
        },
        {
          "who": "마리코",
          "zh": "지하철에서 잠이 들어서 내릴 곳을 [3:지나가 버렸어요].",
          "vi": "Tớ ngủ quên trên tàu điện ngầm nên đi quá ga mất rồi."
        },
        {
          "who": "지연",
          "zh": "그래요? 그럼 학교에 [1:늦었겠네요]?",
          "vi": "Vậy à? Thế chắc cậu đến trường muộn nhỉ?"
        },
        {
          "who": "마리코",
          "zh": "네, 그리고 집에 [4:올 때] 지갑을 [3:잃어버렸어요].",
          "vi": "Ừ, rồi lúc về nhà tớ còn làm mất ví nữa."
        },
        {
          "who": "지연",
          "zh": "정말 [1:속상하겠어요].",
          "vi": "Chắc cậu buồn lắm."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V/A-겠-",
          "np": "NP 8.1"
        },
        {
          "n": 3,
          "label": "V-아/어 버리다",
          "np": "NP 8.3"
        },
        {
          "n": 4,
          "label": "-(으)ㄹ 때",
          "np": "NP 8.4"
        }
      ]
    }
  ],
  "9": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "유진",
          "zh": "여보세요? 켈리 씨 휴대폰이지요?",
          "vi": "Alô? Đây là điện thoại của Kelly phải không?"
        },
        {
          "who": "켈리",
          "zh": "네, 전데요.",
          "vi": "Vâng, tôi đây."
        },
        {
          "who": "유진",
          "zh": "켈리 씨, 저 [1:유진인데요]. 지금 통화 괜찮아요?",
          "vi": "Kelly, tôi là Yujin đây. Giờ nói chuyện được không?"
        },
        {
          "who": "켈리",
          "zh": "네, 괜찮아요. [2:숙제하는 중이었어요].",
          "vi": "Ừ, được. Tôi đang làm bài tập."
        },
        {
          "who": "유진",
          "zh": "켈리 씨, 한국 전통 음악 좋아하지요?",
          "vi": "Kelly thích nhạc truyền thống Hàn Quốc phải không?"
        },
        {
          "who": "켈리",
          "zh": "네, 좋아해요. 그런데 왜요?",
          "vi": "Ừ, thích. Mà sao thế?"
        },
        {
          "who": "유진",
          "zh": "국립국악원에서 외국인을 위한 국악 수업을 해요. 켈리 씨가 좋아할 것 같아서 전화했어요.",
          "vi": "Viện Quốc nhạc Quốc gia có lớp nhạc truyền thống dành cho người nước ngoài. Tôi nghĩ Kelly sẽ thích nên gọi điện."
        },
        {
          "who": "켈리",
          "zh": "그래요? 무슨 요일에 [1:하는데요]?",
          "vi": "Vậy à? Học vào thứ mấy?"
        },
        {
          "who": "유진",
          "zh": "매주 토요일에 하는데 자세한 것은 전화해서 물어보세요. 문자로 전화번호 보내 줄게요.",
          "vi": "Học thứ Bảy hằng tuần, chi tiết thì chị gọi điện hỏi nhé. Tôi sẽ nhắn số điện thoại cho."
        },
        {
          "who": "켈리",
          "zh": "네, 고마워요.",
          "vi": "Ừ, cảm ơn chị."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "-(으)ㄴ데요/는데요",
          "np": "NP 9.1"
        },
        {
          "n": 2,
          "label": "V-는 중이다",
          "np": "NP 9.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "켈리",
          "zh": "여보세요? 거기 국립국악원이지요? 문의할 게 있어서 [1:전화드렸는데요].",
          "vi": "Alô? Đó là Viện Quốc nhạc Quốc gia phải không ạ? Tôi có việc muốn hỏi nên gọi điện."
        },
        {
          "who": "직원",
          "zh": "네, 말씀하세요.",
          "vi": "Vâng, chị cứ nói ạ."
        },
        {
          "who": "켈리",
          "zh": "사물놀이를 배우고 싶은데 외국인을 위한 수업은 [5:토요일밖에] [4:없나요?]",
          "vi": "Tôi muốn học samulnori, lớp cho người nước ngoài chỉ có thứ Bảy thôi ạ?"
        },
        {
          "who": "직원",
          "zh": "네, 토요일에만 [1:있는데요].",
          "vi": "Vâng, chỉ có vào thứ Bảy thôi ạ."
        },
        {
          "who": "켈리",
          "zh": "신청하려면 어떻게 해야 하지요?",
          "vi": "Muốn đăng ký thì phải làm thế nào ạ?"
        },
        {
          "who": "직원",
          "zh": "다음 주 금요일까지 전화나 인터넷으로 하시면 됩니다.",
          "vi": "Chị đăng ký qua điện thoại hoặc internet trước thứ Sáu tuần sau là được."
        },
        {
          "who": "켈리",
          "zh": "네, 알겠습니다. 그런데 수업 들을 때 필요한 것이 [4:있나요?]",
          "vi": "Vâng, tôi hiểu rồi. Mà khi đi học có cần mang gì không ạ?"
        },
        {
          "who": "직원",
          "zh": "아니요, 필요한 것은 모두 무료로 빌려 드리니까 그냥 오시면 됩니다.",
          "vi": "Không ạ, những thứ cần thiết đều được cho mượn miễn phí nên chị cứ đến là được."
        },
        {
          "who": "켈리",
          "zh": "감사합니다.",
          "vi": "Cảm ơn anh."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "-(으)ㄴ데요/는데요",
          "np": "NP 9.1"
        },
        {
          "n": 4,
          "label": "A-(으)ㄴ가요?, V-나요?",
          "np": "NP 9.4"
        },
        {
          "n": 5,
          "label": "N 밖에",
          "np": "NP 9.5"
        }
      ]
    }
  ],
  "10": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "스티븐",
          "zh": "이 근처에 있는 [1:식당 중에서] 어디가 제일 [2:좋아?]",
          "vi": "Trong các quán ăn quanh đây, quán nào ngon nhất?"
        },
        {
          "who": "정우",
          "zh": "식당은 왜?",
          "vi": "Hỏi quán ăn làm gì?"
        },
        {
          "who": "스티븐",
          "zh": "다음 주 토요일이 우리 반 친구 생일이라서 친구들하고 같이 저녁 먹으려고.",
          "vi": "Thứ Bảy tuần sau là sinh nhật bạn cùng lớp nên tớ định ăn tối với các bạn."
        },
        {
          "who": "정우",
          "zh": "친구들이 어떤 음식을 좋아하는데?",
          "vi": "Các bạn thích món gì?"
        },
        {
          "who": "스티븐",
          "zh": "다 잘 [4:먹는데] [1:친구들 중에] 매운 음식을 잘 못 먹는 사람이 [2:있어.]",
          "vi": "Ai cũng ăn được hết, nhưng trong nhóm có người không ăn cay được."
        },
        {
          "who": "정우",
          "zh": "그럼 사거리에 있는 서울식당이 어때? 서울식당은 갈비가 유명한데 다른 음식도 다 맛있고 값도 비싸지 [2:않아.]",
          "vi": "Vậy quán Seoul ở ngã tư thì sao? Quán Seoul nổi tiếng món sườn, món khác cũng ngon mà giá cũng không đắt."
        },
        {
          "who": "스티븐",
          "zh": "미리 예약을 해야 할까?",
          "vi": "Có cần đặt trước không nhỉ?"
        },
        {
          "who": "정우",
          "zh": "주말에는 항상 사람이 많으니까 예약해야 될 [2:거야.]",
          "vi": "Cuối tuần lúc nào cũng đông nên chắc phải đặt trước đấy."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "N 중에(서)",
          "np": "NP 10.1"
        },
        {
          "n": 2,
          "label": "반말",
          "np": "NP 10.2"
        },
        {
          "n": 4,
          "label": "V-는데 (2)",
          "np": "NP 10.4"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "정우",
          "zh": "스티븐, 뭐 [3:먹을래?]",
          "vi": "Steven, cậu ăn gì?"
        },
        {
          "who": "스티븐",
          "zh": "종류가 많네. 여긴 뭐가 [2:맛있어?]",
          "vi": "Nhiều món quá. Ở đây món nào ngon?"
        },
        {
          "who": "정우",
          "zh": "이 식당은 삼계탕이 [4:맛있는데] 한번 먹어 [3:볼래?]",
          "vi": "Quán này gà hầm sâm ngon lắm, cậu ăn thử không?"
        },
        {
          "who": "스티븐",
          "zh": "음, 난 닭고기는 [4:좋아하는데] 삼계탕은 별로 안 좋아해.",
          "vi": "Ừm, tớ thích thịt gà nhưng không thích gà hầm sâm lắm."
        },
        {
          "who": "정우",
          "zh": "[3:그래?] 그럼 감자탕 어때? 안 먹어 봤으면 한번 먹어 봐.",
          "vi": "Vậy à? Thế canh xương hầm khoai tây thì sao? Chưa ăn thì thử đi."
        },
        {
          "who": "스티븐",
          "zh": "[2:좋아.] 그럼 감자탕 [2:시키자.]",
          "vi": "Được. Vậy gọi canh xương hầm khoai tây đi."
        },
        {
          "who": "정우",
          "zh": "아주머니, 여기 감자탕 2인분 주세요.",
          "vi": "Cô ơi, cho cháu hai suất canh xương hầm khoai tây."
        },
        {
          "who": "정우",
          "zh": "맛이 어때? 입에 [2:맞아?]",
          "vi": "Vị thế nào? Có hợp khẩu vị không?"
        },
        {
          "who": "스티븐",
          "zh": "응, 조금 매운데 [2:맛있어.]",
          "vi": "Ừ, hơi cay nhưng ngon."
        }
      ],
      "legend": [
        {
          "n": 2,
          "label": "반말",
          "np": "NP 10.2"
        },
        {
          "n": 3,
          "label": "V-(으)ㄹ래요",
          "np": "NP 10.3"
        },
        {
          "n": 4,
          "label": "V-는데 (2)",
          "np": "NP 10.4"
        }
      ]
    }
  ],
  "11": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "약사",
          "zh": "어떻게 오셨어요?",
          "vi": "Chị bị làm sao vậy?"
        },
        {
          "who": "나나",
          "zh": "배가 아파서 왔는데요.",
          "vi": "Tôi bị đau bụng nên đến đây."
        },
        {
          "who": "약사",
          "zh": "속도 안 좋으세요?",
          "vi": "Chị có bị khó chịu trong bụng không?"
        },
        {
          "who": "나나",
          "zh": "네, 속도 안 좋고 토할 것 같아요.",
          "vi": "Có, bụng khó chịu mà cứ như muốn nôn."
        },
        {
          "who": "약사",
          "zh": "언제부터 아프셨어요?",
          "vi": "Chị đau từ khi nào?"
        },
        {
          "who": "나나",
          "zh": "어제 저녁부터 계속 아파요.",
          "vi": "Tôi đau liên tục từ tối qua."
        },
        {
          "who": "약사",
          "zh": "그럼 이 약을 한번 드셔 보세요. 식후 세 번, 여덟 [2:시간마다] 드시면 돼요.",
          "vi": "Vậy chị uống thử thuốc này. Uống sau ăn, ngày ba lần, cứ tám tiếng một lần là được."
        },
        {
          "who": "나나",
          "zh": "네, 얼마지요?",
          "vi": "Vâng, bao nhiêu tiền ạ?"
        },
        {
          "who": "약사",
          "zh": "5,000원이에요. 이 약을 이틀 정도 드셔 보시고 그래도 안 나으면 병원에 가세요.",
          "vi": "5.000 won. Chị uống thuốc này khoảng hai ngày, nếu vẫn không khỏi thì đi bệnh viện nhé."
        },
        {
          "who": "나나",
          "zh": "네, 감사합니다. 안녕히 계세요.",
          "vi": "Vâng, cảm ơn anh. Chào anh."
        }
      ],
      "legend": [
        {
          "n": 2,
          "label": "N 마다",
          "np": "NP 11.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "민수",
          "zh": "아키라 씨, 왜 이렇게 기운이 없어요?",
          "vi": "Akira, sao trông anh mệt mỏi thế?"
        },
        {
          "who": "아키라",
          "zh": "모르겠어요. 요즘 계속 피곤하고 입맛도 없어요.",
          "vi": "Không biết nữa. Dạo này cứ mệt mỏi mà còn chán ăn."
        },
        {
          "who": "민수",
          "zh": "그럼 운동을 좀 [3:해 보는 게 어때요]?",
          "vi": "Vậy anh thử tập thể dục một chút thì sao?"
        },
        {
          "who": "아키라",
          "zh": "민수 씨는 건강을 위해서 특별히 하는 운동이 있어요?",
          "vi": "Minsu có môn thể thao nào đặc biệt tập để giữ sức khỏe không?"
        },
        {
          "who": "민수",
          "zh": "네, 저는 [2:아침마다] 수영을 하는데 기분도 좋고 스트레스도 풀려요.",
          "vi": "Có, sáng nào tôi cũng bơi, vừa thấy sảng khoái vừa giải tỏa căng thẳng."
        },
        {
          "who": "아키라",
          "zh": "그래요? 어디에서 하는데요?",
          "vi": "Vậy à? Anh bơi ở đâu?"
        },
        {
          "who": "민수",
          "zh": "회사 근처에 있는 수영장에서 해요. 다음 주부터 지호 씨도 같이 [4:하기로 했는데] 아키라 씨도 같이 할래요?",
          "vi": "Tôi bơi ở bể bơi gần công ty. Từ tuần sau Jiho cũng quyết định bơi cùng, Akira cũng bơi cùng không?"
        },
        {
          "who": "아키라",
          "zh": "네, 저도 시간 내서 한번 가 볼게요.",
          "vi": "Vâng, tôi cũng sẽ sắp xếp thời gian đi thử."
        }
      ],
      "legend": [
        {
          "n": 2,
          "label": "N 마다",
          "np": "NP 11.2"
        },
        {
          "n": 3,
          "label": "V-는 게 어때요?",
          "np": "NP 11.3"
        },
        {
          "n": 4,
          "label": "V-기로 하다",
          "np": "NP 11.4"
        }
      ]
    }
  ],
  "12": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "마리코",
          "zh": "여기가 내 방이야.",
          "vi": "Đây là phòng của chị."
        },
        {
          "who": "나나",
          "zh": "책이 많네요. 이건 친구들 사진이에요?",
          "vi": "Nhiều sách thế. Đây là ảnh các bạn chị à?"
        },
        {
          "who": "마리코",
          "zh": "응, 작년 크리스마스 때 찍었어.",
          "vi": "Ừ, chụp hồi Giáng sinh năm ngoái."
        },
        {
          "who": "나나",
          "zh": "참 [1:즐거워 보여요]. 언니 옆에 있는 사람은 누구예요?",
          "vi": "Trông vui quá. Người đứng cạnh chị là ai vậy?"
        },
        {
          "who": "마리코",
          "zh": "나하고 제일 친한 친구야. 어릴 때부터 [2:자매처럼] 지냈어.",
          "vi": "Là bạn thân nhất của chị. Từ nhỏ đã thân như chị em."
        },
        {
          "who": "나나",
          "zh": "그래요? 언니하고 얼굴도 닮은 것 같아요.",
          "vi": "Vậy à? Hình như mặt cũng giống chị nữa."
        },
        {
          "who": "마리코",
          "zh": "그런 말 많이 들어. 우리 둘 다 이마가 넓고 눈이 커서 그런 것 같아.",
          "vi": "Chị nghe người ta nói thế nhiều rồi. Chắc vì cả hai đều trán rộng mắt to."
        },
        {
          "who": "나나",
          "zh": "성격도 비슷해요?",
          "vi": "Tính cách cũng giống nhau không?"
        },
        {
          "who": "마리코",
          "zh": "아니, 성격은 정말 달라. 나는 활발한 성격인데 내 친구는 내성적이야.",
          "vi": "Không, tính cách thì khác hẳn. Chị thì hoạt bát còn bạn chị thì hướng nội."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "A-아/어 보이다",
          "np": "NP 12.1"
        },
        {
          "n": 2,
          "label": "N처럼",
          "np": "NP 12.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "스티븐",
          "zh": "켈리 씨의 이상형은 어떤 사람이에요?",
          "vi": "Mẫu người lý tưởng của Kelly là người thế nào?"
        },
        {
          "who": "켈리",
          "zh": "제가 좀 [3:조용한 편이라서] 활발한 사람이 좋아요. 말을 [4:재미있게 하는] 사람이면 더 좋고요.",
          "vi": "Tôi thuộc kiểu khá trầm lặng nên thích người hoạt bát. Nếu là người nói chuyện thú vị thì càng tốt."
        },
        {
          "who": "스티븐",
          "zh": "그래요? 제 친구 중에 괜찮은 친구가 있는데 한번 만나 볼래요?",
          "vi": "Vậy à? Trong số bạn tôi có một người khá được, chị gặp thử không?"
        },
        {
          "who": "켈리",
          "zh": "어떤 사람인데요?",
          "vi": "Là người thế nào?"
        },
        {
          "who": "스티븐",
          "zh": "한국어 공부할 때 저를 많이 도와준 한국 친구인데 활발하고 재미있어요. 켈리 씨와 잘 어울릴 것 같아요.",
          "vi": "Là bạn Hàn đã giúp tôi nhiều lúc học tiếng Hàn, hoạt bát và vui tính. Chắc sẽ hợp với Kelly."
        },
        {
          "who": "켈리",
          "zh": "그래요? 학생이에요?",
          "vi": "Vậy à? Là sinh viên à?"
        },
        {
          "who": "스티븐",
          "zh": "아니요, 회사원이에요. 편하게 한번 만나 보세요.",
          "vi": "Không, là nhân viên công ty. Chị cứ thoải mái gặp thử một lần xem."
        },
        {
          "who": "켈리",
          "zh": "좋아요. 그럼 나중에 연락 주세요.",
          "vi": "Được. Vậy sau này liên lạc với tôi nhé."
        }
      ],
      "legend": [
        {
          "n": 3,
          "label": "A-(으)ㄴ 편이다",
          "np": "NP 12.3"
        },
        {
          "n": 4,
          "label": "A-게",
          "np": "NP 12.4"
        }
      ]
    }
  ],
  "13": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "나나",
          "zh": "학교 근처로 이사하고 싶은데 괜찮은 집이 [1:있을지 모르겠어요].",
          "vi": "Tôi muốn chuyển đến gần trường nhưng không biết có nhà nào ổn không."
        },
        {
          "who": "줄리앙",
          "zh": "왜요? 지금 사는 집이 마음에 안 들어요?",
          "vi": "Sao thế? Chị không ưng nhà đang ở à?"
        },
        {
          "who": "나나",
          "zh": "지금 사는 집은 방이 넓어서 [2:좋기는 하지만] 학교에서 너무 멀어요.",
          "vi": "Nhà đang ở phòng rộng nên cũng thích, nhưng xa trường quá."
        },
        {
          "who": "줄리앙",
          "zh": "그래요? 그럼 학교 근처에 있는 부동산에 한번 가 보세요.",
          "vi": "Vậy à? Thế chị thử đến văn phòng môi giới nhà đất gần trường xem."
        },
        {
          "who": "나나",
          "zh": "그렇지 않아도 수업 후에 가 보려고요.",
          "vi": "Đúng lúc tôi cũng định học xong sẽ đi."
        },
        {
          "who": "줄리앙",
          "zh": "어떤 집을 구하는데요?",
          "vi": "Chị tìm nhà thế nào?"
        },
        {
          "who": "나나",
          "zh": "시설이 잘되어 있는 원룸을 구했으면 좋겠어요.",
          "vi": "Tôi mong tìm được phòng studio có đầy đủ tiện nghi."
        },
        {
          "who": "줄리앙",
          "zh": "요즘 새로 지은 원룸이 많으니까 쉽게 구할 수 있을 거예요.",
          "vi": "Dạo này có nhiều phòng studio mới xây nên chắc sẽ dễ tìm thôi."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "-(으)ㄹ지 모르겠다",
          "np": "NP 13.1"
        },
        {
          "n": 2,
          "label": "V/A-기는 하지만",
          "np": "NP 13.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "중개인",
          "zh": "어서 오세요.",
          "vi": "Xin mời vào."
        },
        {
          "who": "아키라",
          "zh": "원룸을 하나 찾고 있는데요.",
          "vi": "Tôi đang tìm một phòng studio."
        },
        {
          "who": "중개인",
          "zh": "언제쯤 이사하실 계획인가요?",
          "vi": "Anh định chuyển nhà khoảng khi nào?"
        },
        {
          "who": "아키라",
          "zh": "두 달 후에 집 계약이 [3:끝나기 때문에] 그 전에 이사했으면 좋겠어요.",
          "vi": "Hai tháng nữa hợp đồng nhà hết hạn nên tôi muốn chuyển trước đó."
        },
        {
          "who": "중개인",
          "zh": "아, 그러세요? 마침 좋은 원룸이 하나 있는데 근처에 공원도 있고 주변이 조용해서 [4:살기 좋아요].",
          "vi": "À, vậy ạ? Vừa hay có một phòng studio rất tốt, gần đó có công viên, xung quanh yên tĩnh nên sống rất thích."
        },
        {
          "who": "아키라",
          "zh": "집세는 어떻게 돼요?",
          "vi": "Tiền nhà thế nào ạ?"
        },
        {
          "who": "중개인",
          "zh": "전세는 7,000만 원이고 월세는 보증금 1,000만 원에 50만 원이에요.",
          "vi": "Thuê đặt cọc toàn phần là 70 triệu won, còn thuê theo tháng thì cọc 10 triệu won, mỗi tháng 500.000 won."
        },
        {
          "who": "아키라",
          "zh": "좀 비싸네요.",
          "vi": "Hơi đắt nhỉ."
        },
        {
          "who": "중개인",
          "zh": "좀 [2:비싸기는 하지만] 깨끗하고 시설도 잘되어 [3:있기 때문에] 마음에 드실 거예요. 한번 구경해 보세요.",
          "vi": "Hơi đắt thật nhưng sạch sẽ, tiện nghi đầy đủ nên anh sẽ ưng thôi. Anh cứ xem thử."
        },
        {
          "who": "아키라",
          "zh": "네, 그럼 보고 결정할게요.",
          "vi": "Vâng, vậy tôi xem rồi quyết định."
        }
      ],
      "legend": [
        {
          "n": 2,
          "label": "V/A-기는 하지만",
          "np": "NP 13.2"
        },
        {
          "n": 3,
          "label": "-기 때문에",
          "np": "NP 13.3"
        },
        {
          "n": 4,
          "label": "V-기(가) A",
          "np": "NP 13.4"
        }
      ]
    }
  ],
  "14": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "스티븐",
          "zh": "한국어는 참 어려운 것 같아.",
          "vi": "Tiếng Hàn khó thật đấy."
        },
        {
          "who": "유진",
          "zh": "너 한국어 잘하는데 왜?",
          "vi": "Cậu nói tiếng Hàn giỏi mà, sao thế?"
        },
        {
          "who": "스티븐",
          "zh": "아니야. 오늘 병원에 갔을 때 한국어를 잘못해서 창피한 일이 있었어.",
          "vi": "Không đâu. Hôm nay lúc đi bệnh viện, tớ nói sai tiếng Hàn nên bị một phen xấu hổ."
        },
        {
          "who": "유진",
          "zh": "무슨 일이 있었는데?",
          "vi": "Có chuyện gì vậy?"
        },
        {
          "who": "스티븐",
          "zh": "의사 선생님을 '의사님'이라고 불러서 사람들이 웃었어.",
          "vi": "Tớ gọi bác sĩ là 'uisa-nim' nên mọi người cười."
        },
        {
          "who": "유진",
          "zh": "나도 가끔 처음 만난 사람을 뭐라고 불러야 할지 몰라서 어려울 때가 있어.",
          "vi": "Tớ cũng có lúc không biết nên gọi người mới gặp là gì nên thấy khó."
        },
        {
          "who": "스티븐",
          "zh": "너도 한국어 때문에 [1:실수한 적 있어]?",
          "vi": "Cậu cũng từng mắc lỗi vì tiếng Hàn à?"
        },
        {
          "who": "유진",
          "zh": "물론이지. 그래도 실수하면서 배운 것은 안 잊어버려서 좋아.",
          "vi": "Tất nhiên rồi. Nhưng những gì học được nhờ mắc lỗi thì không quên nên cũng hay."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-(으)ㄴ 적이 있다",
          "np": "NP 14.1"
        }
      ]
    }
  ],
  "15": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "지훈",
          "zh": "아키라 씨, 오래간만이에요.",
          "vi": "Akira, lâu rồi không gặp."
        },
        {
          "who": "아키라",
          "zh": "네, 안녕하세요? 지훈 씨, 그동안 잘 지냈어요?",
          "vi": "Vâng, chào anh. Jihoon, thời gian qua anh khỏe chứ?"
        },
        {
          "who": "지훈",
          "zh": "네, 잘 지냈어요. 아키라 씨는 요즘 어떻게 지내세요? 이제 한국 생활에 [1:익숙해졌어요]?",
          "vi": "Vâng, tôi khỏe. Dạo này Akira thế nào? Đã quen với cuộc sống ở Hàn Quốc chưa?"
        },
        {
          "who": "아키라",
          "zh": "네, 회사 일에도 [1:익숙해지고] 한국 음식도 잘 [2:먹게 됐어요]. 지훈 씨도 별일 없지요?",
          "vi": "Rồi, tôi đã quen với công việc ở công ty và cũng ăn được món Hàn rồi. Jihoon cũng không có chuyện gì chứ?"
        },
        {
          "who": "지훈",
          "zh": "전 다음 달부터 중국에서 [2:일하게 됐어요].",
          "vi": "Từ tháng sau tôi sẽ sang Trung Quốc làm việc."
        },
        {
          "who": "아키라",
          "zh": "아, 그래요? 얼마나 있을 건데요?",
          "vi": "À, vậy à? Anh sẽ ở đó bao lâu?"
        },
        {
          "who": "지훈",
          "zh": "2년 동안 있을 거예요. 그런데 지금까지 한 번도 외국에서 [3:지내 본 적이 없어서] 좀 걱정이에요.",
          "vi": "Tôi sẽ ở hai năm. Nhưng đến giờ tôi chưa từng sống ở nước ngoài lần nào nên hơi lo."
        },
        {
          "who": "아키라",
          "zh": "걱정하지 마세요. 처음에는 힘들겠지만 곧 [1:익숙해질] 거예요.",
          "vi": "Đừng lo. Lúc đầu chắc sẽ vất vả nhưng rồi sẽ quen nhanh thôi."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "A-아지다/어지다",
          "np": "NP 15.1"
        },
        {
          "n": 2,
          "label": "V-게 되다",
          "np": "NP 15.2"
        },
        {
          "n": 3,
          "label": "V-(으)ㄴ 적이 없다",
          "np": "NP 15.3"
        }
      ]
    }
  ],
  "16": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "스티븐",
          "zh": "지연 씨, 이번 연휴에 고향에 내려가요?",
          "vi": "Jiyeon, kỳ nghỉ dài lần này chị về quê à?"
        },
        {
          "who": "지연",
          "zh": "네, 한 달 전에 미리 기차표를 [1:예매해 놓았어요].",
          "vi": "Vâng, tôi đã đặt vé tàu trước một tháng rồi."
        },
        {
          "who": "스티븐",
          "zh": "그렇게 빨리 예매를 해야 돼요?",
          "vi": "Phải đặt vé sớm như vậy à?"
        },
        {
          "who": "지연",
          "zh": "네, 명절에는 고향에 가는 사람들이 많아서 서두르지 않으면 표 사기가 힘들어요.",
          "vi": "Vâng, dịp lễ tết nhiều người về quê nên không nhanh tay thì khó mua vé lắm."
        },
        {
          "who": "스티븐",
          "zh": "그런데 한국에서는 설날에 보통 뭘 해요?",
          "vi": "Mà ở Hàn Quốc ngày Tết thường làm gì?"
        },
        {
          "who": "지연",
          "zh": "아침에 음식을 [1:차려 놓고] 차례를 지내요. 그리고 어른들께 세배를 해요.",
          "vi": "Buổi sáng bày cỗ rồi cúng tổ tiên. Sau đó lạy chúc Tết người lớn."
        },
        {
          "who": "스티븐",
          "zh": "설날에 먹는 특별한 음식이 있어요?",
          "vi": "Ngày Tết có món ăn gì đặc biệt không?"
        },
        {
          "who": "지연",
          "zh": "설날에는 [2:밥 대신] 떡국을 먹어요.",
          "vi": "Ngày Tết ăn canh bánh gạo thay cho cơm."
        },
        {
          "who": "스티븐",
          "zh": "지연 씨도 떡국 끓일 줄 알아요?",
          "vi": "Jiyeon cũng biết nấu canh bánh gạo à?"
        },
        {
          "who": "지연",
          "zh": "그럼요. 나중에 우리 집에 오면 제가 해 줄게요.",
          "vi": "Tất nhiên. Sau này anh đến nhà tôi, tôi sẽ nấu cho."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-아/어 놓다",
          "np": "NP 16.1"
        },
        {
          "n": 2,
          "label": "N 대신",
          "np": "NP 16.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "줄리앙",
          "zh": "이번 추석 연휴에 뭐 할 거야?",
          "vi": "Kỳ nghỉ Trung thu lần này cậu định làm gì?"
        },
        {
          "who": "켈리",
          "zh": "글쎄, 아직 잘 모르겠는데.",
          "vi": "Để xem, tớ vẫn chưa biết nữa."
        },
        {
          "who": "줄리앙",
          "zh": "그럼, 토요일에 반 친구들을 [3:초대할까 하는데] 너도 올래?",
          "vi": "Vậy thứ Bảy tớ định mời các bạn cùng lớp, cậu cũng đến chứ?"
        },
        {
          "who": "켈리",
          "zh": "재미있겠다. 나도 갈게. 내가 뭐 도와줄 거 있어?",
          "vi": "Chắc vui đấy. Tớ cũng đến. Có gì tớ giúp được không?"
        },
        {
          "who": "줄리앙",
          "zh": "그럼 음식 준비하는 것 좀 도와줄래?",
          "vi": "Vậy giúp tớ chuẩn bị đồ ăn được không?"
        },
        {
          "who": "켈리",
          "zh": "그래. 뭘 만들 건데?",
          "vi": "Được. Cậu định làm món gì?"
        },
        {
          "who": "줄리앙",
          "zh": "송편을 [3:만들까 하는데] 해 본 적이 없어서 잘할 수 있을지 모르겠어.",
          "vi": "Tớ định làm bánh songpyeon nhưng chưa làm bao giờ nên không biết có làm được không."
        },
        {
          "who": "켈리",
          "zh": "나 송편 만들 줄 알아. 내가 [4:도와줄 테니까] 걱정하지 마.",
          "vi": "Tớ biết làm songpyeon. Tớ sẽ giúp nên đừng lo."
        },
        {
          "who": "줄리앙",
          "zh": "잘됐다. 그럼 내가 장을 미리 [1:봐 놓을게].",
          "vi": "Tốt quá. Vậy tớ sẽ đi chợ mua đồ trước."
        },
        {
          "who": "켈리",
          "zh": "그래. 그럼 토요일에 보자.",
          "vi": "Ừ. Vậy thứ Bảy gặp nhé."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-아/어 놓다",
          "np": "NP 16.1"
        },
        {
          "n": 3,
          "label": "V-(으)ㄹ까 하다",
          "np": "NP 16.3"
        },
        {
          "n": 4,
          "label": "-(으)ㄹ 테니까",
          "np": "NP 16.4"
        }
      ]
    }
  ],
  "17": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "켈리",
          "zh": "오늘은 다른 때보다 늦게 왔네요.",
          "vi": "Hôm nay cậu đến muộn hơn mọi khi nhỉ."
        },
        {
          "who": "샤오밍",
          "zh": "오늘 부모님이 고향으로 돌아가셔서 공항에 [1:모셔다 드리고] 왔어요.",
          "vi": "Hôm nay bố mẹ tớ về quê nên tớ đưa bố mẹ ra sân bay rồi mới đến."
        },
        {
          "who": "켈리",
          "zh": "아, 그래요? 잘 [1:모셔다 드렸어요]?",
          "vi": "À, vậy à? Đưa bố mẹ đi suôn sẻ chứ?"
        },
        {
          "who": "샤오밍",
          "zh": "네. 그런데 비행기를 [2:놓칠 뻔했어요].",
          "vi": "Ừ. Nhưng suýt nữa thì lỡ chuyến bay."
        },
        {
          "who": "켈리",
          "zh": "왜요? 무슨 일 있었어요?",
          "vi": "Sao thế? Có chuyện gì à?"
        },
        {
          "who": "샤오밍",
          "zh": "길이 너무 막혀서 공항에 늦게 도착했어요.",
          "vi": "Đường tắc quá nên đến sân bay muộn."
        },
        {
          "who": "켈리",
          "zh": "아침부터 바빴겠네요.",
          "vi": "Chắc từ sáng đã bận rộn lắm nhỉ."
        },
        {
          "who": "샤오밍",
          "zh": "네, 정말 정신이 없었어요. 그래도 비행기를 안 놓쳐서 다행이에요.",
          "vi": "Ừ, cuống cả lên. Nhưng may là không lỡ chuyến bay."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-아다/어다 주다",
          "np": "NP 17.1"
        },
        {
          "n": 2,
          "label": "V-(으)ㄹ 뻔하다",
          "np": "NP 17.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "직원",
          "zh": "[3:어떻게] 오셨습니까?",
          "vi": "Chị cần gì ạ?"
        },
        {
          "who": "켈리",
          "zh": "가방을 잃어버려서 왔는데요.",
          "vi": "Tôi bị mất túi nên đến đây."
        },
        {
          "who": "직원",
          "zh": "어디서 잃어버리셨습니까?",
          "vi": "Chị làm mất ở đâu ạ?"
        },
        {
          "who": "켈리",
          "zh": "오늘 아침에 지하철 2호선에 놓고 내렸어요.",
          "vi": "Sáng nay tôi để quên trên tàu điện tuyến số 2 rồi xuống."
        },
        {
          "who": "직원",
          "zh": "가방이 [3:어떻게] 생겼습니까?",
          "vi": "Túi trông như thế nào ạ?"
        },
        {
          "who": "켈리",
          "zh": "[3:까만색] 배낭인데 [3:하얀색] 인형이 [4:달려 있어요].",
          "vi": "Là ba lô màu đen, có gắn một con búp bê màu trắng."
        },
        {
          "who": "직원",
          "zh": "가방 안에 뭐가 들어 있습니까?",
          "vi": "Trong túi có gì ạ?"
        },
        {
          "who": "켈리",
          "zh": "책 두 권하고 지갑이 [4:들어 있어요].",
          "vi": "Có hai quyển sách và một cái ví."
        },
        {
          "who": "직원",
          "zh": "잠깐만요. 그런 가방은 없는데요.",
          "vi": "Chị đợi chút. Không có cái túi nào như vậy ạ."
        },
        {
          "who": "켈리",
          "zh": "그래요? 꼭 찾아야 하는데 큰일 났네요.",
          "vi": "Vậy à? Tôi nhất định phải tìm được, gay go rồi."
        },
        {
          "who": "직원",
          "zh": "찾으면 연락 드릴 테니까 여기에 전화번호를 써 놓고 가세요.",
          "vi": "Nếu tìm được chúng tôi sẽ liên lạc, chị ghi số điện thoại vào đây rồi về nhé."
        }
      ],
      "legend": [
        {
          "n": 3,
          "label": "'ㅎ' bất quy tắc",
          "np": "NP 17.3"
        },
        {
          "n": 4,
          "label": "V-아/어 있다",
          "np": "NP 17.4"
        }
      ]
    }
  ],
  "18": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "스티븐",
          "zh": "우리가 한국에 [1:온 지] 벌써 [2:6개월이나] 됐네요.",
          "vi": "Chúng ta đến Hàn Quốc đã được 6 tháng rồi nhỉ."
        },
        {
          "who": "나나",
          "zh": "맞아요. 시간이 정말 빨리 지나간 것 같아요.",
          "vi": "Đúng vậy. Thời gian trôi nhanh thật."
        },
        {
          "who": "스티븐",
          "zh": "나나 씨, 다음 학기에도 계속 공부하지요?",
          "vi": "Nana, học kỳ sau chị vẫn tiếp tục học chứ?"
        },
        {
          "who": "나나",
          "zh": "아니요, 다음 학기에 고향으로 돌아가요.",
          "vi": "Không, học kỳ sau tôi về quê."
        },
        {
          "who": "스티븐",
          "zh": "그래요? 왜 갑자기 돌아가게 됐어요?",
          "vi": "Vậy à? Sao tự nhiên lại phải về?"
        },
        {
          "who": "나나",
          "zh": "사정이 좀 있어서요.",
          "vi": "Tôi có chút việc riêng."
        },
        {
          "who": "스티븐",
          "zh": "그래요? 같이 공부할 수 없게 돼서 아쉽네요.",
          "vi": "Vậy à? Không được học cùng nữa thật tiếc."
        },
        {
          "who": "나나",
          "zh": "고향에 가면 친구들이 많이 그리울 것 같아요. 정이 많이 들었는데…….",
          "vi": "Về quê chắc tôi sẽ nhớ các bạn nhiều lắm. Đã gắn bó nhiều thế mà……"
        },
        {
          "who": "스티븐",
          "zh": "그래도 고향에 가니까 좋지 않아요?",
          "vi": "Nhưng được về quê chẳng phải cũng vui sao?"
        },
        {
          "who": "나나",
          "zh": "가족을 만날 수 있어서 좋기는 하지만 한국을 떠나는 건 아쉬워요.",
          "vi": "Được gặp gia đình thì vui thật, nhưng rời Hàn Quốc thì tiếc lắm."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-(으)ㄴ 지",
          "np": "NP 18.1"
        },
        {
          "n": 2,
          "label": "N(이)나",
          "np": "NP 18.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "",
          "zh": "시간이 참 빨리 [3:지나간다]. 처음 한국에 왔을 때 겨울이었는데 지금은 봄, 여름이 지나고 가을이 되었다. 한국의 계절은 우리 나라와 아주 [3:다르다]. 우리 나라는 계절의 변화가 거의 없고 일 년 내내 따뜻한 [3:편이다]. 하지만 한국은 사계절이 [3:있다].",
          "vi": "Thời gian trôi thật nhanh. Lúc mới đến Hàn Quốc là mùa đông, giờ đã qua xuân, hạ và sang thu. Mùa ở Hàn Quốc rất khác nước tôi. Nước tôi hầu như không có sự thay đổi mùa, quanh năm khá ấm áp. Còn Hàn Quốc thì có bốn mùa."
        },
        {
          "who": "",
          "zh": "한국은 봄에 날씨가 따뜻하고 꽃이 많이 [3:핀다]. 여름에는 날씨가 매우 덥고 습도가 [3:높다]. 또 장마가 있어서 비가 많이 [3:온다].",
          "vi": "Mùa xuân ở Hàn Quốc trời ấm và hoa nở nhiều. Mùa hè trời rất nóng và độ ẩm cao. Lại có mùa mưa nên mưa nhiều."
        },
        {
          "who": "",
          "zh": "내가 제일 좋아하는 계절은 [3:가을이다]. 10월이 되면 날씨가 쌀쌀해지고 단풍이 [3:든다]. 사람들은 단풍을 구경하러 산에 [3:간다].",
          "vi": "Mùa tôi thích nhất là mùa thu. Đến tháng 10 trời se lạnh và lá chuyển màu. Mọi người lên núi ngắm lá đỏ."
        },
        {
          "who": "",
          "zh": "겨울에는 기온이 영하로 내려가는 날이 많고 눈이 자주 [3:내린다]. 나는 스키를 타 본 적이 없어서 이번 겨울에 친구들과 스키장에 가 보려고 [3:한다]. 빨리 겨울이 왔으면 좋겠다.",
          "vi": "Mùa đông có nhiều ngày nhiệt độ xuống dưới 0 độ và tuyết rơi thường xuyên. Tôi chưa từng trượt tuyết nên mùa đông này định đi khu trượt tuyết với bạn bè. Mong mùa đông mau đến."
        }
      ],
      "legend": [
        {
          "n": 3,
          "label": "A-다, V-ㄴ다/는다",
          "np": "NP 18.3"
        }
      ]
    }
  ]
}
