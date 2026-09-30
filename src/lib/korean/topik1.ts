// SINH TỰ ĐỘNG bởi scripts/import-korean-lessons.mjs từ scripts/korean-data/topik1/*.json — đừng sửa tay, sửa JSON rồi chạy lại.
import type { Dialogue } from '@/lib/chinese/dialogues'
import type { LessonMeta } from './lessons'

export const TOPIK1_LESSON_META: Record<number, LessonMeta> = {
  "101": {
    "level": "topik1",
    "title": "안녕하세요?",
    "titleVi": "Xin chào"
  },
  "102": {
    "level": "topik1",
    "title": "이거는 뭐예요?",
    "titleVi": "Đây là cái gì?"
  },
  "103": {
    "level": "topik1",
    "title": "한국어를 공부해요",
    "titleVi": "Tôi học tiếng Hàn"
  },
  "104": {
    "level": "topik1",
    "title": "어디에 있어요?",
    "titleVi": "Ở đâu vậy?"
  },
  "105": {
    "level": "topik1",
    "title": "주말에 친구를 만났어요",
    "titleVi": "Cuối tuần tôi đã gặp bạn"
  },
  "106": {
    "level": "topik1",
    "title": "얼마예요?",
    "titleVi": "Bao nhiêu tiền?"
  },
  "107": {
    "level": "topik1",
    "title": "날씨가 어떻습니까?",
    "titleVi": "Thời tiết thế nào?"
  },
  "108": {
    "level": "topik1",
    "title": "영화 볼까요?",
    "titleVi": "Mình đi xem phim nhé?"
  },
  "109": {
    "level": "topik1",
    "title": "이분은 누구세요?",
    "titleVi": "Vị này là ai vậy?"
  },
  "110": {
    "level": "topik1",
    "title": "지금 몇 시예요?",
    "titleVi": "Bây giờ là mấy giờ?"
  },
  "111": {
    "level": "topik1",
    "title": "감기에 걸렸어요",
    "titleVi": "Tôi bị cảm rồi"
  },
  "112": {
    "level": "topik1",
    "title": "여보세요",
    "titleVi": "Alô"
  },
  "113": {
    "level": "topik1",
    "title": "서울역으로 가 주세요",
    "titleVi": "Làm ơn đi đến ga Seoul"
  },
  "114": {
    "level": "topik1",
    "title": "이 옷을 입어 보세요",
    "titleVi": "Hãy mặc thử bộ đồ này"
  },
  "115": {
    "level": "topik1",
    "title": "여행을 가고 싶어요",
    "titleVi": "Tôi muốn đi du lịch"
  },
  "116": {
    "level": "topik1",
    "title": "우리 집에 올 수 있어요?",
    "titleVi": "Bạn đến nhà mình được không?"
  }
}

export const TOPIK1_DIALOGUES: Record<number, Dialogue[]> = {
  "101": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "나나",
          "zh": "[1:안녕하세요?] 저는 [2:나나예요].",
          "vi": "Xin chào! Tôi là Nana."
        },
        {
          "who": "마이클",
          "zh": "[1:안녕하세요?] 저는 [2:마이클이에요].",
          "vi": "Xin chào! Tôi là Michael."
        },
        {
          "who": "나나",
          "zh": "[1:만나서 반가워요], 마이클 씨.",
          "vi": "Rất vui được gặp anh, Michael."
        },
        {
          "who": "마이클",
          "zh": "[1:반가워요]. 나나 씨는 어느 나라 [2:사람이에요]?",
          "vi": "Rất vui được gặp chị. Nana là người nước nào vậy?"
        },
        {
          "who": "나나",
          "zh": "저는 중국 [2:사람이에요].",
          "vi": "Tôi là người Trung Quốc."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "인사말 (안녕하세요? / 반가워요 / 안녕히 가세요·계세요)",
          "np": "NP 1.1"
        },
        {
          "n": 2,
          "label": "N은/는 N이에요/예요",
          "np": "NP 1.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "마이클",
          "zh": "여러분, [1:만나서 반갑습니다]. 저는 [3:마이클입니다].",
          "vi": "Chào mọi người, rất vui được gặp các bạn. Tôi là Michael."
        },
        {
          "who": "켈리",
          "zh": "[1:안녕하세요?] 마이클 씨는 미국 [3:사람입니까]?",
          "vi": "Xin chào! Anh Michael là người Mỹ phải không?"
        },
        {
          "who": "마이클",
          "zh": "아니요, 저는 미국 [4:사람이 아닙니다]. 영국 [3:사람입니다].",
          "vi": "Không, tôi không phải người Mỹ. Tôi là người Anh."
        },
        {
          "who": "켈리",
          "zh": "아, 네. 직업은 [3:무엇입니까]?",
          "vi": "À, vâng. Nghề nghiệp của anh là gì?"
        },
        {
          "who": "마이클",
          "zh": "[3:기자입니다].",
          "vi": "Tôi là nhà báo."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "인사말 (안녕하세요? / 반가워요 / 안녕히 가세요·계세요)",
          "np": "NP 1.1"
        },
        {
          "n": 3,
          "label": "N입니까?, N입니다",
          "np": "NP 1.3"
        },
        {
          "n": 4,
          "label": "N이/가 아닙니다",
          "np": "NP 1.4"
        }
      ]
    }
  ],
  "102": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "스티븐",
          "zh": "[1:전자사전 있어요]?",
          "vi": "Có từ điển điện tử không ạ?"
        },
        {
          "who": "아주머니",
          "zh": "아니요, [1:없어요].",
          "vi": "Không, không có."
        },
        {
          "who": "스티븐",
          "zh": "[2:이거는] 한국어로 뭐예요?",
          "vi": "Cái này tiếng Hàn gọi là gì ạ?"
        },
        {
          "who": "아주머니",
          "zh": "자예요.",
          "vi": "Là thước kẻ."
        },
        {
          "who": "스티븐",
          "zh": "[2:저거는] 연필이에요?",
          "vi": "Cái kia là bút chì ạ?"
        },
        {
          "who": "아주머니",
          "zh": "아니요, 볼펜이에요.",
          "vi": "Không, là bút bi."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "N이/가 있어요[없어요]",
          "np": "NP 2.1"
        },
        {
          "n": 2,
          "label": "이거는[그거는, 저거는] N이에요/예요",
          "np": "NP 2.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "아주머니",
          "zh": "어서 오세요.",
          "vi": "Mời vào."
        },
        {
          "who": "줄리앙",
          "zh": "[1:신문 있어요]?",
          "vi": "Có báo không ạ?"
        },
        {
          "who": "아주머니",
          "zh": "네, [1:있어요]. [4:한국신문하고 나라신문이] [1:있어요].",
          "vi": "Có. Có báo Hàn Quốc và báo Nara."
        },
        {
          "who": "줄리앙",
          "zh": "[3:한국신문 주세요].",
          "vi": "Cho tôi tờ báo Hàn Quốc."
        },
        {
          "who": "아주머니",
          "zh": "[1:여기 있어요].",
          "vi": "Đây ạ."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "N이/가 있어요[없어요]",
          "np": "NP 2.1"
        },
        {
          "n": 3,
          "label": "N 주세요",
          "np": "NP 2.3"
        },
        {
          "n": 4,
          "label": "N하고 N, N과/와 N",
          "np": "NP 2.4"
        }
      ]
    }
  ],
  "103": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "마리코",
          "zh": "스티븐 씨, 지금 뭐 [1:해요]?",
          "vi": "Steven, anh đang làm gì đấy?"
        },
        {
          "who": "스티븐",
          "zh": "[1:공부해요]. 마리코 씨는 뭐 [1:해요]?",
          "vi": "Tôi đang học. Còn Mariko đang làm gì?"
        },
        {
          "who": "마리코",
          "zh": "저는 [2:책을] [1:읽어요].",
          "vi": "Tôi đang đọc sách."
        },
        {
          "who": "스티븐",
          "zh": "한국어 [2:책을] [1:읽어요]?",
          "vi": "Chị đọc sách tiếng Hàn à?"
        },
        {
          "who": "마리코",
          "zh": "아니요, 일본어 [2:책을] [1:읽어요].",
          "vi": "Không, tôi đọc sách tiếng Nhật."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-아요/어요",
          "np": "NP 3.1"
        },
        {
          "n": 2,
          "label": "N을/를",
          "np": "NP 3.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "스티븐",
          "zh": "아키라 씨, 지금 뭐 [1:해요]?",
          "vi": "Akira, anh đang làm gì đấy?"
        },
        {
          "who": "아키라",
          "zh": "[1:공부해요].",
          "vi": "Tôi đang học."
        },
        {
          "who": "스티븐",
          "zh": "[3:도서관에서] [1:공부해요]?",
          "vi": "Anh học ở thư viện à?"
        },
        {
          "who": "아키라",
          "zh": "아니요, [3:도서관에서] [4:공부 안 해요].",
          "vi": "Không, tôi không học ở thư viện."
        },
        {
          "who": "스티븐",
          "zh": "그럼 [3:어디에서] [1:공부해요]?",
          "vi": "Vậy anh học ở đâu?"
        },
        {
          "who": "아키라",
          "zh": "[3:집에서] [1:공부해요].",
          "vi": "Tôi học ở nhà."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-아요/어요",
          "np": "NP 3.1"
        },
        {
          "n": 3,
          "label": "N에서",
          "np": "NP 3.3"
        },
        {
          "n": 4,
          "label": "안 V",
          "np": "NP 3.4"
        }
      ]
    }
  ],
  "104": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "유진",
          "zh": "[1:여기가 인사동이에요]?",
          "vi": "Đây là Insadong à?"
        },
        {
          "who": "정우",
          "zh": "네, 인사동이에요.",
          "vi": "Ừ, là Insadong."
        },
        {
          "who": "유진",
          "zh": "인사동에서 뭐 해요?",
          "vi": "Ở Insadong thì làm gì?"
        },
        {
          "who": "정우",
          "zh": "차를 마셔요. [2:인사동에는 찻집이 있어요].",
          "vi": "Uống trà. Ở Insadong có quán trà."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "여기가 N이에요/예요",
          "np": "NP 4.1"
        },
        {
          "n": 2,
          "label": "N에 있어요[없어요]",
          "np": "NP 4.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "줄리앙",
          "zh": "스티븐 씨, [3:어디에 가요]?",
          "vi": "Steven, anh đi đâu đấy?"
        },
        {
          "who": "스티븐",
          "zh": "[3:공항에 가요]. 친구가 [3:한국에 와요]. 줄리앙 씨는 [3:어디에 가요]?",
          "vi": "Tôi đi sân bay. Bạn tôi đến Hàn Quốc. Còn Julien đi đâu?"
        },
        {
          "who": "줄리앙",
          "zh": "[3:우체국에 가요].",
          "vi": "Tôi đi bưu điện."
        },
        {
          "who": "스티븐",
          "zh": "우체국이 [2:어디에 있어요]?",
          "vi": "Bưu điện ở đâu vậy?"
        },
        {
          "who": "줄리앙",
          "zh": "한국은행 알아요? [4:한국은행 앞에] 있어요.",
          "vi": "Anh biết Ngân hàng Hàn Quốc không? Bưu điện ở trước Ngân hàng Hàn Quốc."
        }
      ],
      "legend": [
        {
          "n": 2,
          "label": "N에 있어요[없어요]",
          "np": "NP 4.2"
        },
        {
          "n": 3,
          "label": "N에 가요[와요]",
          "np": "NP 4.3"
        },
        {
          "n": 4,
          "label": "N 앞[뒤, 옆]",
          "np": "NP 4.4"
        }
      ]
    }
  ],
  "105": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "민수",
          "zh": "[1:5월 9일]에 시간이 있어요?",
          "vi": "Ngày 9 tháng 5 anh có rảnh không?"
        },
        {
          "who": "아키라",
          "zh": "[1:9일]이 [1:무슨 요일]이에요?",
          "vi": "Ngày 9 là thứ mấy?"
        },
        {
          "who": "민수",
          "zh": "[1:금요일]이에요. [2:금요일에] 파티가 있어요.",
          "vi": "Thứ Sáu. Thứ Sáu có bữa tiệc."
        },
        {
          "who": "아키라",
          "zh": "아, 미안해요. [2:금요일에는] 약속이 있어요. 친구하고 같이 영화를 봐요.",
          "vi": "À, xin lỗi. Thứ Sáu tôi có hẹn rồi. Tôi đi xem phim với bạn."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "날짜와 요일 (N월 N일, 무슨 요일)",
          "np": "NP 5.1"
        },
        {
          "n": 2,
          "label": "N에 (thời gian)",
          "np": "NP 5.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "줄리앙",
          "zh": "[2:주말에] 뭐 [3:했어요]?",
          "vi": "Cuối tuần chị đã làm gì?"
        },
        {
          "who": "마리코",
          "zh": "코엑스몰에 [3:갔어요].",
          "vi": "Tôi đã đến COEX Mall."
        },
        {
          "who": "줄리앙",
          "zh": "거기에서 뭐 [3:했어요]?",
          "vi": "Ở đó chị đã làm gì?"
        },
        {
          "who": "마리코",
          "zh": "친구하고 같이 [4:영화를 보고] [3:쇼핑했어요]. 줄리앙 씨는 뭐 [3:했어요]?",
          "vi": "Tôi xem phim với bạn rồi đi mua sắm. Còn Julien đã làm gì?"
        },
        {
          "who": "줄리앙",
          "zh": "저는 집에서 [3:쉬었어요].",
          "vi": "Tôi nghỉ ở nhà."
        }
      ],
      "legend": [
        {
          "n": 2,
          "label": "N에 (thời gian)",
          "np": "NP 5.2"
        },
        {
          "n": 3,
          "label": "V-았/었-",
          "np": "NP 5.3"
        },
        {
          "n": 4,
          "label": "V-고 (trình tự)",
          "np": "NP 5.4"
        }
      ]
    }
  ],
  "106": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "종업원",
          "zh": "어서 [1:오세요]. 여기 [1:앉으세요].",
          "vi": "Xin mời vào. Mời ngồi đây ạ."
        },
        {
          "who": "스티븐",
          "zh": "메뉴 좀 [1:주세요].",
          "vi": "Cho tôi xem thực đơn."
        },
        {
          "who": "종업원",
          "zh": "네, 여기 있어요.",
          "vi": "Vâng, đây ạ."
        },
        {
          "who": "스티븐",
          "zh": "유진 씨는 뭐 좋아해요?",
          "vi": "Yujin thích món gì?"
        },
        {
          "who": "유진",
          "zh": "저는 비빔밥을 좋아해요.",
          "vi": "Tôi thích bibimbap."
        },
        {
          "who": "스티븐",
          "zh": "그럼, 비빔밥 [2:한 그릇]하고 갈비탕 [2:한 그릇] [1:주세요].",
          "vi": "Vậy cho tôi một bát bibimbap và một bát canh sườn."
        },
        {
          "who": "종업원",
          "zh": "네, 잠깐만 [1:기다리세요].",
          "vi": "Vâng, xin đợi một chút ạ."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-(으)세요",
          "np": "NP 6.1"
        },
        {
          "n": 2,
          "label": "N 개[병, 잔, 그릇]",
          "np": "NP 6.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "마리코",
          "zh": "아저씨, 오렌지 얼마예요?",
          "vi": "Chú ơi, cam bao nhiêu tiền ạ?"
        },
        {
          "who": "아저씨",
          "zh": "[2:여섯 개]에 오천 원이에요.",
          "vi": "Sáu quả 5.000 won."
        },
        {
          "who": "마리코",
          "zh": "사과는 얼마예요?",
          "vi": "Còn táo bao nhiêu ạ?"
        },
        {
          "who": "아저씨",
          "zh": "[2:세 개]에 이천 원이에요.",
          "vi": "Ba quả 2.000 won."
        },
        {
          "who": "마리코",
          "zh": "뭐가 [3:맛있어요]?",
          "vi": "Loại nào ngon ạ?"
        },
        {
          "who": "아저씨",
          "zh": "모두 [3:맛있어요].",
          "vi": "Loại nào cũng ngon."
        },
        {
          "who": "마리코",
          "zh": "그럼 오렌지 [2:여섯 개] [1:주세요]. [4:사과도] [2:세 개] [1:주세요].",
          "vi": "Vậy cho cháu sáu quả cam. Cho cháu cả ba quả táo nữa."
        },
        {
          "who": "아저씨",
          "zh": "네, 여기 있어요. 또 [1:오세요].",
          "vi": "Đây, của cháu. Lần sau lại đến nhé."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-(으)세요",
          "np": "NP 6.1"
        },
        {
          "n": 2,
          "label": "N 개[병, 잔, 그릇]",
          "np": "NP 6.2"
        },
        {
          "n": 3,
          "label": "N이/가 A-아요/어요",
          "np": "NP 6.3"
        },
        {
          "n": 4,
          "label": "N도",
          "np": "NP 6.4"
        }
      ]
    }
  ],
  "107": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "아키라",
          "zh": "서울은 오늘 날씨가 어때요?",
          "vi": "Hôm nay thời tiết ở Seoul thế nào?"
        },
        {
          "who": "민수",
          "zh": "[1:더워요]. 도쿄도 [1:더워요]?",
          "vi": "Nóng lắm. Tokyo cũng nóng à?"
        },
        {
          "who": "아키라",
          "zh": "아니요. 어제는 [2:더웠지만] 오늘은 안 [1:더워요].",
          "vi": "Không. Hôm qua thì nóng nhưng hôm nay không nóng."
        },
        {
          "who": "민수",
          "zh": "아, 그래요? 서울에 언제 와요?",
          "vi": "À, vậy à? Khi nào anh đến Seoul?"
        },
        {
          "who": "아키라",
          "zh": "토요일에 가요.",
          "vi": "Thứ Bảy tôi sẽ đến."
        },
        {
          "who": "민수",
          "zh": "그럼 조심해서 오세요.",
          "vi": "Vậy đi đường cẩn thận nhé."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "'ㅂ' 불규칙",
          "np": "NP 7.1"
        },
        {
          "n": 2,
          "label": "A/V-지만",
          "np": "NP 7.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "",
          "zh": "제 고향은 [3:파리입니다]. 파리는 지금 [3:겨울입니다]. 파리는 겨울에 [4:눈이 오고] [3:춥습니다]. 사람들은 스키장에 [3:갑니다]. 여러분 고향은 날씨가 [3:어떻습니까]?",
          "vi": "Quê tôi là Paris. Bây giờ Paris đang là mùa đông. Mùa đông ở Paris có tuyết rơi và lạnh. Mọi người đi khu trượt tuyết. Thời tiết ở quê các bạn thế nào?"
        }
      ],
      "legend": [
        {
          "n": 3,
          "label": "A/V-습니다/ㅂ니다",
          "np": "NP 7.3"
        },
        {
          "n": 4,
          "label": "A/V-고 (liệt kê)",
          "np": "NP 7.4"
        }
      ]
    }
  ],
  "108": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "정우",
          "zh": "켈리 씨, 한국 생활이 어때요?",
          "vi": "Kelly, cuộc sống ở Hàn Quốc thế nào?"
        },
        {
          "who": "켈리",
          "zh": "한국어 공부는 재미있지만 주말에는 조금 심심해요.",
          "vi": "Học tiếng Hàn thì thú vị nhưng cuối tuần hơi buồn chán."
        },
        {
          "who": "정우",
          "zh": "그래요? 그럼 주말에 같이 자전거 [1:탈까요?]",
          "vi": "Vậy à? Thế cuối tuần mình cùng đi xe đạp nhé?"
        },
        {
          "who": "켈리",
          "zh": "좋아요. 어디에서 [1:탈까요?]",
          "vi": "Được đấy. Mình đạp xe ở đâu?"
        },
        {
          "who": "정우",
          "zh": "한강에서 타요.",
          "vi": "Đạp ở sông Hàn đi."
        },
        {
          "who": "켈리",
          "zh": "네. 그런데 한강에 어떻게 가요?",
          "vi": "Ừ. Nhưng mà đến sông Hàn bằng cách nào?"
        },
        {
          "who": "정우",
          "zh": "가까워요. [2:걸어서] 가요.",
          "vi": "Gần lắm. Đi bộ là tới."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-(으)ㄹ까요?",
          "np": "NP 8.1"
        },
        {
          "n": 2,
          "label": "'ㄷ' 불규칙",
          "np": "NP 8.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "정우",
          "zh": "여기가 한강공원이에요.",
          "vi": "Đây là công viên sông Hàn."
        },
        {
          "who": "켈리",
          "zh": "와, 정말 [4:시원하네요]. 정우 씨는 [3:이 공원]에 자주 와요?",
          "vi": "Wow, mát thật đấy! Jeongwoo có hay đến công viên này không?"
        },
        {
          "who": "정우",
          "zh": "네, 자주 와요. 우리 자전거 [1:탈까요?]",
          "vi": "Ừ, tôi hay đến. Mình đạp xe nhé?"
        },
        {
          "who": "켈리",
          "zh": "그래요.",
          "vi": "Được."
        },
        {
          "who": "정우",
          "zh": "켈리 씨, 재미있어요?",
          "vi": "Kelly, có vui không?"
        },
        {
          "who": "켈리",
          "zh": "네, 아주 [4:재미있네요].",
          "vi": "Ừ, vui lắm!"
        },
        {
          "who": "정우",
          "zh": "그럼 우리 다음에 또 [1:올까요?]",
          "vi": "Vậy lần sau mình lại đến nhé?"
        },
        {
          "who": "켈리",
          "zh": "좋아요.",
          "vi": "Được đấy."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-(으)ㄹ까요?",
          "np": "NP 8.1"
        },
        {
          "n": 3,
          "label": "이[그, 저] N",
          "np": "NP 8.3"
        },
        {
          "n": 4,
          "label": "A/V-네요",
          "np": "NP 8.4"
        }
      ]
    }
  ],
  "109": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "스티븐",
          "zh": "정우 씨, [4:인사하세요]. 이쪽은 줄리앙 씨예요.",
          "vi": "Jeongwoo, chào hỏi đi. Đây là Julien."
        },
        {
          "who": "정우",
          "zh": "안녕[4:하세요], 줄리앙 씨?",
          "vi": "Chào anh Julien."
        },
        {
          "who": "스티븐",
          "zh": "줄리앙 씨, 이쪽은 정우 씨예요. 정우 씨는 [1:제 룸메이트예요].",
          "vi": "Julien, đây là Jeongwoo. Jeongwoo là bạn cùng phòng của tôi."
        },
        {
          "who": "줄리앙",
          "zh": "만나서 반가워요, 정우 씨. 저는 줄리앙이에요. [1:스티븐 씨의 한국어 반] 친구예요.",
          "vi": "Rất vui được gặp anh, Jeongwoo. Tôi là Julien, bạn cùng lớp tiếng Hàn của Steven."
        },
        {
          "who": "정우",
          "zh": "네, 만나서 반가워요. 스티븐 씨한테서 이야기 많이 들었어요.",
          "vi": "Vâng, rất vui được gặp anh. Tôi nghe Steven kể về anh nhiều rồi."
        },
        {
          "who": "줄리앙",
          "zh": "저도 정우 씨 이야기 많이 들었어요.",
          "vi": "Tôi cũng nghe kể nhiều về anh."
        },
        {
          "who": "스티븐",
          "zh": "줄리앙 씨는 [2:노래를 아주 잘해요].",
          "vi": "Julien hát hay lắm đấy."
        },
        {
          "who": "줄리앙",
          "zh": "뭘요. [2:잘 못해요].",
          "vi": "Có gì đâu. Tôi hát không hay lắm."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "N(의) N",
          "np": "NP 9.1"
        },
        {
          "n": 2,
          "label": "N을/를 잘하다[잘 못하다, 못하다]",
          "np": "NP 9.2"
        },
        {
          "n": 4,
          "label": "A/V-(으)시-",
          "np": "NP 9.4"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "민수",
          "zh": "가족이 몇 명이에요?",
          "vi": "Gia đình anh có mấy người?"
        },
        {
          "who": "아키라",
          "zh": "네 명이에요. 부모님이 [4:계시고] 여동생이 한 명 있어요.",
          "vi": "Bốn người. Có bố mẹ và một em gái."
        },
        {
          "who": "민수",
          "zh": "아버지는 무슨 일을 [4:하세요]?",
          "vi": "Bố anh làm nghề gì?"
        },
        {
          "who": "아키라",
          "zh": "회사에 [4:다니세요].",
          "vi": "Bố tôi đi làm ở công ty."
        },
        {
          "who": "민수",
          "zh": "어머니가 [3:미인이세요]. 연세가 어떻게 [4:되세요]?",
          "vi": "Mẹ anh đẹp quá. Bác năm nay bao nhiêu tuổi rồi?"
        },
        {
          "who": "아키라",
          "zh": "[3:쉰일곱이세요].",
          "vi": "Mẹ tôi 57 tuổi."
        },
        {
          "who": "민수",
          "zh": "가족이 모두 일본에 [4:계세요]?",
          "vi": "Cả nhà anh đều ở Nhật à?"
        },
        {
          "who": "아키라",
          "zh": "아니요, 여동생은 한국에서 대학교에 다녀요.",
          "vi": "Không, em gái tôi đang học đại học ở Hàn Quốc."
        }
      ],
      "legend": [
        {
          "n": 3,
          "label": "N(이)세요",
          "np": "NP 9.3"
        },
        {
          "n": 4,
          "label": "A/V-(으)시-",
          "np": "NP 9.4"
        }
      ]
    }
  ],
  "110": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "지연",
          "zh": "우리 내일 영화 볼까요?",
          "vi": "Mai mình đi xem phim nhé?"
        },
        {
          "who": "마리코",
          "zh": "좋아요. 그런데 내일 오전에는 한국어 수업이 있어요.",
          "vi": "Được đấy. Nhưng sáng mai tớ có lớp tiếng Hàn."
        },
        {
          "who": "지연",
          "zh": "[2:몇 시까지] 수업을 해요?",
          "vi": "Cậu học đến mấy giờ?"
        },
        {
          "who": "마리코",
          "zh": "[2:9시부터 1시까지] 해요.",
          "vi": "Từ 9 giờ đến 1 giờ."
        },
        {
          "who": "지연",
          "zh": "그럼 우리 [1:몇 시]에 만날까요?",
          "vi": "Vậy mình gặp nhau lúc mấy giờ?"
        },
        {
          "who": "마리코",
          "zh": "[1:1시 반쯤]에 극장 앞에서 만나요.",
          "vi": "Gặp nhau trước rạp khoảng 1 rưỡi nhé."
        },
        {
          "who": "지연",
          "zh": "네. 밥도 같이 먹을까요?",
          "vi": "Ừ. Mình ăn cơm cùng nhau luôn nhé?"
        },
        {
          "who": "마리코",
          "zh": "그래요. 같이 밥 먹고 영화 봐요.",
          "vi": "Được. Cùng ăn cơm rồi xem phim."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "시간 (N시 N분)",
          "np": "NP 10.1"
        },
        {
          "n": 2,
          "label": "N부터 N까지",
          "np": "NP 10.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "스티븐",
          "zh": "줄리앙 씨, 주말 잘 보냈어요?",
          "vi": "Julien, cuối tuần vui chứ?"
        },
        {
          "who": "줄리앙",
          "zh": "네. 스티븐 씨도 주말 잘 보냈어요? 주말에 뭐 했어요?",
          "vi": "Ừ. Steven cuối tuần cũng vui chứ? Anh đã làm gì?"
        },
        {
          "who": "스티븐",
          "zh": "유진 씨하고 같이 인사동에 [3:가서] 차를 마셨어요.",
          "vi": "Tôi đi Insadong với Yujin rồi uống trà."
        },
        {
          "who": "줄리앙",
          "zh": "아, 데이트했어요? 오늘도 유진 씨를 만나요?",
          "vi": "À, hẹn hò à? Hôm nay cũng gặp Yujin à?"
        },
        {
          "who": "스티븐",
          "zh": "아니요. 오늘은 정우 씨를 [3:만나서] 박물관에 [4:갈 거예요]. 줄리앙 씨는 오후에 뭐 [4:할 거예요]?",
          "vi": "Không. Hôm nay tôi sẽ gặp Jeongwoo rồi đi bảo tàng. Chiều nay Julien sẽ làm gì?"
        },
        {
          "who": "줄리앙",
          "zh": "저는 도서관에 [3:가서] [4:공부할 거예요].",
          "vi": "Tôi sẽ đến thư viện học bài."
        }
      ],
      "legend": [
        {
          "n": 3,
          "label": "V-아서/어서 (trình tự)",
          "np": "NP 10.3"
        },
        {
          "n": 4,
          "label": "V-(으)ㄹ 거예요",
          "np": "NP 10.4"
        }
      ]
    }
  ],
  "111": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "의사",
          "zh": "여기 앉으세요. 어떻게 오셨어요?",
          "vi": "Mời ngồi đây. Anh bị làm sao vậy?"
        },
        {
          "who": "줄리앙",
          "zh": "감기에 걸렸어요.",
          "vi": "Tôi bị cảm."
        },
        {
          "who": "의사",
          "zh": "어디가 [1:아프세요]?",
          "vi": "Anh đau ở đâu?"
        },
        {
          "who": "줄리앙",
          "zh": "목이 많이 [1:아파요].",
          "vi": "Tôi đau họng lắm."
        },
        {
          "who": "의사",
          "zh": "언제부터 [1:아프셨어요]?",
          "vi": "Anh bị đau từ khi nào?"
        },
        {
          "who": "줄리앙",
          "zh": "지난주 토요일부터요.",
          "vi": "Từ thứ Bảy tuần trước."
        },
        {
          "who": "의사",
          "zh": "요즘 감기가 유행이에요. 약을 드시고 집에서 푹 쉬세요. 그리고 말을 많이 [2:하지 마세요].",
          "vi": "Dạo này đang có dịch cảm. Anh uống thuốc rồi nghỉ ngơi ở nhà cho khỏe. Và đừng nói nhiều nhé."
        },
        {
          "who": "줄리앙",
          "zh": "네, 알겠습니다.",
          "vi": "Vâng, tôi hiểu rồi."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "'ㅡ' 탈락",
          "np": "NP 11.1"
        },
        {
          "n": 2,
          "label": "V-지 마세요",
          "np": "NP 11.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "켈리",
          "zh": "줄리앙 씨, 감기는 어때요? 지금도 많이 [1:아파요]?",
          "vi": "Julien, cảm thế nào rồi? Giờ vẫn còn mệt lắm à?"
        },
        {
          "who": "줄리앙",
          "zh": "지금은 괜찮아요. [3:기침만] 조금 해요.",
          "vi": "Giờ đỡ rồi. Chỉ còn ho một chút."
        },
        {
          "who": "켈리",
          "zh": "다행이네요. 오늘도 병원에 [4:가야 돼요]?",
          "vi": "May quá. Hôm nay anh cũng phải đi bệnh viện à?"
        },
        {
          "who": "줄리앙",
          "zh": "아니요, 오늘은 안 가요.",
          "vi": "Không, hôm nay không đi."
        },
        {
          "who": "켈리",
          "zh": "그럼 오후에 같이 차 마실까요?",
          "vi": "Vậy chiều nay mình cùng uống trà nhé?"
        },
        {
          "who": "줄리앙",
          "zh": "미안해요. 오늘은 [4:공부해야 돼요]. 내일 시험이 있어요.",
          "vi": "Xin lỗi. Hôm nay tôi phải học. Mai tôi có bài thi."
        },
        {
          "who": "켈리",
          "zh": "그래요? 그럼 다음에 만나요. 너무 [2:무리하지 마세요].",
          "vi": "Vậy à? Thế lần sau gặp nhé. Đừng làm quá sức đấy."
        },
        {
          "who": "줄리앙",
          "zh": "네, 고마워요.",
          "vi": "Ừ, cảm ơn chị."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "'ㅡ' 탈락",
          "np": "NP 11.1"
        },
        {
          "n": 2,
          "label": "V-지 마세요",
          "np": "NP 11.2"
        },
        {
          "n": 3,
          "label": "N만",
          "np": "NP 11.3"
        },
        {
          "n": 4,
          "label": "V-아야/어야 되다",
          "np": "NP 11.4"
        }
      ]
    }
  ],
  "112": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "유진",
          "zh": "여보세요. 마리코 씨 [1:휴대폰이지요?] 저 유진이에요.",
          "vi": "Alô. Đây là điện thoại của Mariko phải không? Tớ là Yujin đây."
        },
        {
          "who": "마리코",
          "zh": "아, 유진 씨. 오랜만이에요. 잘 [1:지내지요?]",
          "vi": "À, Yujin. Lâu rồi không gặp. Cậu khỏe chứ?"
        },
        {
          "who": "유진",
          "zh": "네, 잘 지내요. 마리코 씨, 지금 전화 괜찮아요?",
          "vi": "Ừ, tớ khỏe. Mariko, giờ nói chuyện điện thoại được không?"
        },
        {
          "who": "마리코",
          "zh": "네, 괜찮아요. [2:요리하고 있어요]. 그런데 무슨 일이에요?",
          "vi": "Ừ, được. Tớ đang nấu ăn. Mà có chuyện gì thế?"
        },
        {
          "who": "유진",
          "zh": "마리코 씨, 아키라 씨 사무실 전화번호 알아요?",
          "vi": "Mariko, cậu có biết số điện thoại văn phòng của Akira không?"
        },
        {
          "who": "마리코",
          "zh": "네, 알아요.",
          "vi": "Ừ, tớ biết."
        },
        {
          "who": "유진",
          "zh": "전화번호가 몇 [1:번이지요?]",
          "vi": "Số bao nhiêu nhỉ?"
        },
        {
          "who": "마리코",
          "zh": "잠깐만요. 3588-9102예요.",
          "vi": "Đợi chút nhé. Là 3588-9102."
        },
        {
          "who": "유진",
          "zh": "고마워요.",
          "vi": "Cảm ơn cậu."
        },
        {
          "who": "마리코",
          "zh": "뭘요. 우리 다음에 봐요.",
          "vi": "Có gì đâu. Hẹn gặp lại nhé."
        },
        {
          "who": "유진",
          "zh": "네. 그럼 안녕히 계세요.",
          "vi": "Ừ. Vậy chào cậu nhé."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "A/V-지요?, N(이)지요?",
          "np": "NP 12.1"
        },
        {
          "n": 2,
          "label": "V-고 있다",
          "np": "NP 12.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "직원",
          "zh": "네, 월드여행사입니다.",
          "vi": "Vâng, công ty du lịch World xin nghe."
        },
        {
          "who": "유진",
          "zh": "여보세요. 거기 [1:월드여행사지요?] 스도 아키라 씨 계십니까?",
          "vi": "Alô. Đó là công ty du lịch World phải không ạ? Anh Sudo Akira có ở đó không ạ?"
        },
        {
          "who": "직원",
          "zh": "아키라 씨요? 잠깐만 기다리세요.",
          "vi": "Anh Akira ạ? Xin chờ một chút."
        },
        {
          "who": "아키라",
          "zh": "네, 스도 아키라입니다.",
          "vi": "Vâng, Sudo Akira đây."
        },
        {
          "who": "유진",
          "zh": "아키라 씨, 저 유진이에요. 휴대폰을 [4:안 받아서] 전화했어요.",
          "vi": "Akira, tôi là Yujin đây. Anh không nghe di động nên tôi gọi vào đây."
        },
        {
          "who": "아키라",
          "zh": "아, 유진 씨. 아까 회의를 [2:하고 있어서] [3:못 받았어요]. 미안해요.",
          "vi": "À, Yujin. Lúc nãy tôi đang họp nên không nghe máy được. Xin lỗi nhé."
        },
        {
          "who": "유진",
          "zh": "괜찮아요. 오늘 스티븐 씨 생일 파티에 올 [1:거죠?]",
          "vi": "Không sao. Hôm nay anh sẽ đến tiệc sinh nhật Steven chứ?"
        },
        {
          "who": "아키라",
          "zh": "그럼요. 여섯 시 반, [1:강남역이지요?] 그런데 저는 일이 [4:많아서] 삼십 분쯤 늦을 거예요.",
          "vi": "Tất nhiên rồi. 6 rưỡi ở ga Gangnam phải không? Nhưng tôi nhiều việc nên sẽ đến muộn khoảng 30 phút."
        },
        {
          "who": "유진",
          "zh": "아, 그래요? 알겠어요. 그럼 이따 봐요.",
          "vi": "À, vậy à? Tôi biết rồi. Vậy lát gặp nhé."
        },
        {
          "who": "아키라",
          "zh": "네, 이따 봐요.",
          "vi": "Ừ, lát gặp."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "A/V-지요?, N(이)지요?",
          "np": "NP 12.1"
        },
        {
          "n": 2,
          "label": "V-고 있다",
          "np": "NP 12.2"
        },
        {
          "n": 3,
          "label": "못 V",
          "np": "NP 12.3"
        },
        {
          "n": 4,
          "label": "A/V-아서/어서 (lý do)",
          "np": "NP 12.4"
        }
      ]
    }
  ],
  "113": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "스티븐",
          "zh": "지금 뭐 해요?",
          "vi": "Cậu đang làm gì đấy?"
        },
        {
          "who": "샤오밍",
          "zh": "비행기 표를 알아보고 있어요.",
          "vi": "Tớ đang tìm vé máy bay."
        },
        {
          "who": "스티븐",
          "zh": "여행 갈 거예요?",
          "vi": "Cậu định đi du lịch à?"
        },
        {
          "who": "샤오밍",
          "zh": "아니요. 방학에 중국에 [1:가려고 해요].",
          "vi": "Không. Kỳ nghỉ tớ định về Trung Quốc."
        },
        {
          "who": "스티븐",
          "zh": "네. 그런데 [2:한국에서 중국까지] 얼마나 걸려요?",
          "vi": "Ừ. Mà từ Hàn Quốc đến Trung Quốc mất bao lâu?"
        },
        {
          "who": "샤오밍",
          "zh": "두 시간쯤 걸려요. 스티븐 씨는 방학에 뭐 [1:하려고 해요]?",
          "vi": "Mất khoảng hai tiếng. Kỳ nghỉ Steven định làm gì?"
        },
        {
          "who": "스티븐",
          "zh": "저는 집에서 푹 [1:쉬려고 해요].",
          "vi": "Tớ định nghỉ ngơi thật thoải mái ở nhà."
        },
        {
          "who": "샤오밍",
          "zh": "그래요? 여행은 안 갈 거예요?",
          "vi": "Vậy à? Cậu không đi du lịch à?"
        },
        {
          "who": "스티븐",
          "zh": "네. 이번 방학에는 서울에 있을 거예요.",
          "vi": "Ừ. Kỳ nghỉ này tớ sẽ ở Seoul."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-(으)려고 하다",
          "np": "NP 13.1"
        },
        {
          "n": 2,
          "label": "N에서 N까지",
          "np": "NP 13.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "기사",
          "zh": "[4:어디로] 가세요?",
          "vi": "Anh đi đâu ạ?"
        },
        {
          "who": "줄리앙",
          "zh": "[4:서울역으로] [3:가 주세요].",
          "vi": "Làm ơn cho tôi đến ga Seoul."
        },
        {
          "who": "기사",
          "zh": "외국인이시네요. 어느 나라에서 오셨어요?",
          "vi": "Anh là người nước ngoài nhỉ. Anh đến từ nước nào?"
        },
        {
          "who": "줄리앙",
          "zh": "프랑스에서 왔어요.",
          "vi": "Tôi đến từ Pháp."
        },
        {
          "who": "기사",
          "zh": "서울역에는 무슨 일이세요? 여행 가세요?",
          "vi": "Anh đến ga Seoul có việc gì? Đi du lịch à?"
        },
        {
          "who": "줄리앙",
          "zh": "네, 친구하고 같이 [4:부산으로] 여행을 갈 거예요.",
          "vi": "Vâng, tôi sẽ đi du lịch Busan với bạn."
        },
        {
          "who": "기사",
          "zh": "한국말을 아주 잘하시네요.",
          "vi": "Anh nói tiếng Hàn giỏi quá."
        },
        {
          "who": "줄리앙",
          "zh": "뭘요. 아직 잘 못해요.",
          "vi": "Có gì đâu ạ. Tôi vẫn chưa giỏi lắm."
        },
        {
          "who": "줄리앙",
          "zh": "아저씨, 저기 버스 정류장에서 [3:세워 주세요].",
          "vi": "Chú ơi, cho cháu dừng ở trạm xe buýt đằng kia."
        },
        {
          "who": "기사",
          "zh": "네, 알겠습니다.",
          "vi": "Vâng, được ạ."
        },
        {
          "who": "줄리앙",
          "zh": "고맙습니다.",
          "vi": "Cảm ơn chú."
        }
      ],
      "legend": [
        {
          "n": 3,
          "label": "V-아/어 주다",
          "np": "NP 13.3"
        },
        {
          "n": 4,
          "label": "N(으)로",
          "np": "NP 13.4"
        }
      ]
    }
  ],
  "114": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "켈리",
          "zh": "아키라 씨, 저 사람은 누구예요?",
          "vi": "Akira, người kia là ai vậy?"
        },
        {
          "who": "아키라",
          "zh": "누구요?",
          "vi": "Ai cơ?"
        },
        {
          "who": "켈리",
          "zh": "저기 [2:키가 큰 남자]요. 청바지를 입었어요.",
          "vi": "Người đàn ông cao cao đằng kia. Mặc quần jean ấy."
        },
        {
          "who": "아키라",
          "zh": "아, 저 사람은 유스케 씨예요. 우리 회사에 다녀요.",
          "vi": "À, đó là Yusuke. Anh ấy làm cùng công ty tôi."
        },
        {
          "who": "켈리",
          "zh": "유스케 씨는 어떤 사람이에요?",
          "vi": "Yusuke là người thế nào?"
        },
        {
          "who": "아키라",
          "zh": "아주 [2:재미있는 사람]이에요.",
          "vi": "Là người rất vui tính."
        },
        {
          "who": "켈리",
          "zh": "그래요? 저는 [2:재미있는 사람]을 좋아해요. 소개 좀 해 주세요.",
          "vi": "Vậy à? Tôi thích người vui tính. Giới thiệu cho tôi với."
        },
        {
          "who": "아키라",
          "zh": "음, 그럼 지금 같이 가서 인사할까요?",
          "vi": "Ừm, vậy giờ mình cùng qua chào anh ấy nhé?"
        },
        {
          "who": "켈리",
          "zh": "네, 좋아요.",
          "vi": "Ừ, được đấy."
        }
      ],
      "legend": [
        {
          "n": 2,
          "label": "A-(으)ㄴ N",
          "np": "NP 14.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "유진",
          "zh": "나나 씨, 이 티셔츠 어때요? 좀 봐 주세요.",
          "vi": "Nana, cái áo phông này thế nào? Xem giúp tớ với."
        },
        {
          "who": "나나",
          "zh": "괜찮네요. 한번 [4:입어 보세요]. 유진 씨가 입을 거지요?",
          "vi": "Được đấy. Mặc thử một lần xem. Yujin định mặc à?"
        },
        {
          "who": "유진",
          "zh": "아니요. 우리 [3:언니한테] 선물할 거예요.",
          "vi": "Không. Tớ định tặng chị gái tớ."
        },
        {
          "who": "나나",
          "zh": "그래요? 언니는 어떤 스타일을 좋아해요?",
          "vi": "Vậy à? Chị cậu thích phong cách thế nào?"
        },
        {
          "who": "유진",
          "zh": "우리 언니는 [2:단순한 스타일]을 좋아해요.",
          "vi": "Chị tớ thích phong cách đơn giản."
        },
        {
          "who": "나나",
          "zh": "그럼 이건 어때요? 이게 요즘 유행이에요.",
          "vi": "Vậy cái này thì sao? Dạo này đang thịnh hành kiểu này."
        },
        {
          "who": "유진",
          "zh": "그거 예쁘네요.",
          "vi": "Cái đó đẹp nhỉ."
        },
        {
          "who": "나나",
          "zh": "예쁘죠? 이거 사세요.",
          "vi": "Đẹp đúng không? Mua cái này đi."
        }
      ],
      "legend": [
        {
          "n": 2,
          "label": "A-(으)ㄴ N",
          "np": "NP 14.2"
        },
        {
          "n": 3,
          "label": "N한테[께]",
          "np": "NP 14.3"
        },
        {
          "n": 4,
          "label": "V-아/어 보세요",
          "np": "NP 14.4"
        }
      ]
    }
  ],
  "115": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "히엔",
          "zh": "켈리 씨, 이번 방학에 뭐 할 거예요?",
          "vi": "Kelly, kỳ nghỉ này cậu sẽ làm gì?"
        },
        {
          "who": "켈리",
          "zh": "부산에 [2:사는 친구] 집에 가려고 해요.",
          "vi": "Tớ định đến nhà người bạn sống ở Busan."
        },
        {
          "who": "히엔",
          "zh": "그래요? 언제 갈 거예요?",
          "vi": "Vậy à? Khi nào cậu đi?"
        },
        {
          "who": "켈리",
          "zh": "[2:방학하는 날] 저녁에 출발하려고 해요.",
          "vi": "Tớ định xuất phát vào tối ngày bắt đầu nghỉ."
        },
        {
          "who": "히엔",
          "zh": "어떻게 갈 거예요? 표 예매했어요?",
          "vi": "Cậu đi bằng gì? Đặt vé chưa?"
        },
        {
          "who": "켈리",
          "zh": "아니요. 수업 끝나고 이따 예매하려고 해요.",
          "vi": "Chưa. Học xong lát nữa tớ định đặt."
        },
        {
          "who": "히엔",
          "zh": "부산에 가서 뭐 할 거예요?",
          "vi": "Đến Busan cậu sẽ làm gì?"
        },
        {
          "who": "켈리",
          "zh": "해운대에서 수영할 거예요. 히엔 씨는 방학에 뭐 할 거예요?",
          "vi": "Tớ sẽ bơi ở biển Haeundae. Kỳ nghỉ Hiền sẽ làm gì?"
        },
        {
          "who": "히엔",
          "zh": "친구가 한국에 [1:오면] 같이 여행을 하고, [1:못 오면] 집에서 쉴 거예요.",
          "vi": "Nếu bạn tớ đến Hàn Quốc thì tớ sẽ đi du lịch cùng bạn, còn nếu bạn không đến được thì tớ sẽ nghỉ ở nhà."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "A/V-(으)면",
          "np": "NP 15.1"
        },
        {
          "n": 2,
          "label": "V-는 N",
          "np": "NP 15.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "스티븐",
          "zh": "아키라 씨, 제주도 여행은 즐거웠어요?",
          "vi": "Akira, chuyến du lịch đảo Jeju vui chứ?"
        },
        {
          "who": "아키라",
          "zh": "네, 날씨도 좋고 경치도 정말 아름다웠어요. 또 [3:가고 싶어요].",
          "vi": "Ừ, thời tiết đẹp mà cảnh cũng đẹp lắm. Tôi muốn đi nữa."
        },
        {
          "who": "스티븐",
          "zh": "등산도 했어요?",
          "vi": "Anh có leo núi không?"
        },
        {
          "who": "아키라",
          "zh": "아니요, 등산도 [3:하고 싶었지만] 시간이 없어서 못 했어요.",
          "vi": "Không, tôi cũng muốn leo núi nhưng không có thời gian nên không leo được."
        },
        {
          "who": "스티븐",
          "zh": "그런데 휴가가 언제까지예요?",
          "vi": "Mà kỳ nghỉ phép của anh đến khi nào?"
        },
        {
          "who": "아키라",
          "zh": "내일까지예요. 왜요?",
          "vi": "Đến ngày mai. Sao thế?"
        },
        {
          "who": "스티븐",
          "zh": "제 친구가 야구 경기를 [4:보고 싶어 해서] 내일 야구장에 가려고 해요. 아키라 씨도 같이 가요.",
          "vi": "Bạn tôi muốn xem bóng chày nên mai tôi định đi sân bóng chày. Akira cũng đi cùng nhé."
        },
        {
          "who": "아키라",
          "zh": "저도 [3:가고 싶지만] 내일은 약속이 있어요.",
          "vi": "Tôi cũng muốn đi nhưng mai tôi có hẹn rồi."
        }
      ],
      "legend": [
        {
          "n": 3,
          "label": "V-고 싶다",
          "np": "NP 15.3"
        },
        {
          "n": 4,
          "label": "V-고 싶어 하다",
          "np": "NP 15.4"
        }
      ]
    }
  ],
  "116": [
    {
      "title": "말하기 1",
      "lines": [
        {
          "who": "나나",
          "zh": "샤오밍 씨, 오늘 저녁에 바빠요?",
          "vi": "Tiểu Minh, tối nay cậu có bận không?"
        },
        {
          "who": "샤오밍",
          "zh": "아니요. 별일 없어요. 그런데 왜요?",
          "vi": "Không. Chẳng có việc gì. Mà sao thế?"
        },
        {
          "who": "나나",
          "zh": "시험이 끝나서 우리 집에서 파티를 하려고 해요. 샤오밍 씨도 [1:올 수 있어요]?",
          "vi": "Thi xong rồi nên tớ định mở tiệc ở nhà. Tiểu Minh đến được không?"
        },
        {
          "who": "샤오밍",
          "zh": "네, [1:갈 수 있어요]. 몇 시쯤 갈까요?",
          "vi": "Ừ, tớ đến được. Mấy giờ tớ đến nhỉ?"
        },
        {
          "who": "나나",
          "zh": "일곱 시쯤 오세요.",
          "vi": "Khoảng 7 giờ đến nhé."
        },
        {
          "who": "샤오밍",
          "zh": "네, 좋아요. 일곱 시까지 [2:갈게요]. 그런데 파티 준비 다 했어요? 제가 좀 도와줄까요?",
          "vi": "Ừ, được. Tớ sẽ đến trước 7 giờ. Mà chuẩn bị tiệc xong hết chưa? Tớ giúp một tay nhé?"
        },
        {
          "who": "나나",
          "zh": "그럼 케이크 좀 사 주세요. 바빠서 케이크를 아직 못 샀어요.",
          "vi": "Vậy mua giúp tớ cái bánh kem nhé. Bận quá nên tớ chưa mua được bánh."
        },
        {
          "who": "샤오밍",
          "zh": "네, 그럼 제가 케이크를 사 [2:갈게요].",
          "vi": "Ừ, vậy tớ sẽ mua bánh mang đến."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "V-(으)ㄹ 수 있다[없다]",
          "np": "NP 16.1"
        },
        {
          "n": 2,
          "label": "V-(으)ㄹ게요",
          "np": "NP 16.2"
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "나나",
          "zh": "줄리앙 씨, 어서 들어오세요. 덥지요?",
          "vi": "Julien, mời vào. Nóng lắm nhỉ?"
        },
        {
          "who": "줄리앙",
          "zh": "아니에요. 초대해 줘서 고마워요. 집이 정말 좋네요.",
          "vi": "Không đâu. Cảm ơn đã mời tôi. Nhà đẹp thật đấy."
        },
        {
          "who": "나나",
          "zh": "뭘요. 청소도 잘 못 했어요.",
          "vi": "Có gì đâu. Tôi còn chưa dọn dẹp kỹ nữa."
        },
        {
          "who": "줄리앙",
          "zh": "룸메이트는 집에 없어요?",
          "vi": "Bạn cùng phòng không có nhà à?"
        },
        {
          "who": "나나",
          "zh": "네. 도서관에 [3:공부하러 갔어요].",
          "vi": "Ừ. Cô ấy đi thư viện học bài rồi."
        },
        {
          "who": "줄리앙",
          "zh": "다른 친구들은 아직 안 왔어요?",
          "vi": "Các bạn khác chưa đến à?"
        },
        {
          "who": "나나",
          "zh": "곧 올 거예요. 텔레비전 [4:보면서] 좀 기다려 주세요.",
          "vi": "Sắp đến rồi. Anh vừa xem tivi vừa đợi một chút nhé."
        },
        {
          "who": "나나",
          "zh": "여보세요? 스티븐 씨? 무슨 일 있어요?",
          "vi": "Alô? Steven à? Có chuyện gì không?"
        },
        {
          "who": "스티븐",
          "zh": "나나 씨, 미안해요. 길이 복잡해서 조금 늦을 거예요. 빨리 [2:갈게요].",
          "vi": "Nana, xin lỗi nhé. Đường đông quá nên tôi sẽ đến muộn một chút. Tôi sẽ đến nhanh."
        },
        {
          "who": "나나",
          "zh": "괜찮아요. 지금 줄리앙 씨만 왔어요. 천천히 오세요.",
          "vi": "Không sao. Giờ mới có Julien đến thôi. Cứ từ từ đến nhé."
        }
      ],
      "legend": [
        {
          "n": 2,
          "label": "V-(으)ㄹ게요",
          "np": "NP 16.2"
        },
        {
          "n": 3,
          "label": "V-(으)러 가다[오다]",
          "np": "NP 16.3"
        },
        {
          "n": 4,
          "label": "V-(으)면서",
          "np": "NP 16.4"
        }
      ]
    }
  ]
}
