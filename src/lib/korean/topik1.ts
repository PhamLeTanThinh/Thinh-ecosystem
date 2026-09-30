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
          "zh": "안녕하세요? 저는 나나예요.",
          "vi": "Xin chào! Tôi là Nana."
        },
        {
          "who": "마이클",
          "zh": "안녕하세요? 저는 마이클이에요.",
          "vi": "Xin chào! Tôi là Michael."
        },
        {
          "who": "나나",
          "zh": "만나서 반가워요, 마이클 씨.",
          "vi": "Rất vui được gặp anh, Michael."
        },
        {
          "who": "마이클",
          "zh": "반가워요. 나나 씨는 어느 나라 사람이에요?",
          "vi": "Rất vui được gặp chị. Nana là người nước nào vậy?"
        },
        {
          "who": "나나",
          "zh": "저는 중국 사람이에요.",
          "vi": "Tôi là người Trung Quốc."
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "마이클",
          "zh": "여러분, 만나서 반갑습니다. 저는 마이클입니다.",
          "vi": "Chào mọi người, rất vui được gặp các bạn. Tôi là Michael."
        },
        {
          "who": "켈리",
          "zh": "안녕하세요? 마이클 씨는 미국 사람입니까?",
          "vi": "Xin chào! Anh Michael là người Mỹ phải không?"
        },
        {
          "who": "마이클",
          "zh": "아니요, 저는 미국 사람이 아닙니다. 영국 사람입니다.",
          "vi": "Không, tôi không phải người Mỹ. Tôi là người Anh."
        },
        {
          "who": "켈리",
          "zh": "아, 네. 직업은 무엇입니까?",
          "vi": "À, vâng. Nghề nghiệp của anh là gì?"
        },
        {
          "who": "마이클",
          "zh": "기자입니다.",
          "vi": "Tôi là nhà báo."
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
          "zh": "전자사전 있어요?",
          "vi": "Có từ điển điện tử không ạ?"
        },
        {
          "who": "아주머니",
          "zh": "아니요, 없어요.",
          "vi": "Không, không có."
        },
        {
          "who": "스티븐",
          "zh": "이거는 한국어로 뭐예요?",
          "vi": "Cái này tiếng Hàn gọi là gì ạ?"
        },
        {
          "who": "아주머니",
          "zh": "자예요.",
          "vi": "Là thước kẻ."
        },
        {
          "who": "스티븐",
          "zh": "저거는 연필이에요?",
          "vi": "Cái kia là bút chì ạ?"
        },
        {
          "who": "아주머니",
          "zh": "아니요, 볼펜이에요.",
          "vi": "Không, là bút bi."
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
          "zh": "신문 있어요?",
          "vi": "Có báo không ạ?"
        },
        {
          "who": "아주머니",
          "zh": "네, 있어요. 한국신문하고 나라신문이 있어요.",
          "vi": "Có. Có báo Hàn Quốc và báo Nara."
        },
        {
          "who": "줄리앙",
          "zh": "한국신문 주세요.",
          "vi": "Cho tôi tờ báo Hàn Quốc."
        },
        {
          "who": "아주머니",
          "zh": "여기 있어요.",
          "vi": "Đây ạ."
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
          "zh": "스티븐 씨, 지금 뭐 해요?",
          "vi": "Steven, anh đang làm gì đấy?"
        },
        {
          "who": "스티븐",
          "zh": "공부해요. 마리코 씨는 뭐 해요?",
          "vi": "Tôi đang học. Còn Mariko đang làm gì?"
        },
        {
          "who": "마리코",
          "zh": "저는 책을 읽어요.",
          "vi": "Tôi đang đọc sách."
        },
        {
          "who": "스티븐",
          "zh": "한국어 책을 읽어요?",
          "vi": "Chị đọc sách tiếng Hàn à?"
        },
        {
          "who": "마리코",
          "zh": "아니요, 일본어 책을 읽어요.",
          "vi": "Không, tôi đọc sách tiếng Nhật."
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "스티븐",
          "zh": "아키라 씨, 지금 뭐 해요?",
          "vi": "Akira, anh đang làm gì đấy?"
        },
        {
          "who": "아키라",
          "zh": "공부해요.",
          "vi": "Tôi đang học."
        },
        {
          "who": "스티븐",
          "zh": "도서관에서 공부해요?",
          "vi": "Anh học ở thư viện à?"
        },
        {
          "who": "아키라",
          "zh": "아니요, 도서관에서 공부 안 해요.",
          "vi": "Không, tôi không học ở thư viện."
        },
        {
          "who": "스티븐",
          "zh": "그럼 어디에서 공부해요?",
          "vi": "Vậy anh học ở đâu?"
        },
        {
          "who": "아키라",
          "zh": "집에서 공부해요.",
          "vi": "Tôi học ở nhà."
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
          "zh": "여기가 인사동이에요?",
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
          "zh": "차를 마셔요. 인사동에는 찻집이 있어요.",
          "vi": "Uống trà. Ở Insadong có quán trà."
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "줄리앙",
          "zh": "스티븐 씨, 어디에 가요?",
          "vi": "Steven, anh đi đâu đấy?"
        },
        {
          "who": "스티븐",
          "zh": "공항에 가요. 친구가 한국에 와요. 줄리앙 씨는 어디에 가요?",
          "vi": "Tôi đi sân bay. Bạn tôi đến Hàn Quốc. Còn Julien đi đâu?"
        },
        {
          "who": "줄리앙",
          "zh": "우체국에 가요.",
          "vi": "Tôi đi bưu điện."
        },
        {
          "who": "스티븐",
          "zh": "우체국이 어디에 있어요?",
          "vi": "Bưu điện ở đâu vậy?"
        },
        {
          "who": "줄리앙",
          "zh": "한국은행 알아요? 한국은행 앞에 있어요.",
          "vi": "Anh biết Ngân hàng Hàn Quốc không? Bưu điện ở trước Ngân hàng Hàn Quốc."
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
          "zh": "5월 9일에 시간이 있어요?",
          "vi": "Ngày 9 tháng 5 anh có rảnh không?"
        },
        {
          "who": "아키라",
          "zh": "9일이 무슨 요일이에요?",
          "vi": "Ngày 9 là thứ mấy?"
        },
        {
          "who": "민수",
          "zh": "금요일이에요. 금요일에 파티가 있어요.",
          "vi": "Thứ Sáu. Thứ Sáu có bữa tiệc."
        },
        {
          "who": "아키라",
          "zh": "아, 미안해요. 금요일에는 약속이 있어요. 친구하고 같이 영화를 봐요.",
          "vi": "À, xin lỗi. Thứ Sáu tôi có hẹn rồi. Tôi đi xem phim với bạn."
        }
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "줄리앙",
          "zh": "주말에 뭐 했어요?",
          "vi": "Cuối tuần chị đã làm gì?"
        },
        {
          "who": "마리코",
          "zh": "코엑스몰에 갔어요.",
          "vi": "Tôi đã đến COEX Mall."
        },
        {
          "who": "줄리앙",
          "zh": "거기에서 뭐 했어요?",
          "vi": "Ở đó chị đã làm gì?"
        },
        {
          "who": "마리코",
          "zh": "친구하고 같이 영화를 보고 쇼핑했어요. 줄리앙 씨는 뭐 했어요?",
          "vi": "Tôi xem phim với bạn rồi đi mua sắm. Còn Julien đã làm gì?"
        },
        {
          "who": "줄리앙",
          "zh": "저는 집에서 쉬었어요.",
          "vi": "Tôi nghỉ ở nhà."
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
          "zh": "어서 오세요. 여기 앉으세요.",
          "vi": "Xin mời vào. Mời ngồi đây ạ."
        },
        {
          "who": "스티븐",
          "zh": "메뉴 좀 주세요.",
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
          "zh": "그럼, 비빔밥 한 그릇하고 갈비탕 한 그릇 주세요.",
          "vi": "Vậy cho tôi một bát bibimbap và một bát canh sườn."
        },
        {
          "who": "종업원",
          "zh": "네, 잠깐만 기다리세요.",
          "vi": "Vâng, xin đợi một chút ạ."
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
          "zh": "여섯 개에 오천 원이에요.",
          "vi": "Sáu quả 5.000 won."
        },
        {
          "who": "마리코",
          "zh": "사과는 얼마예요?",
          "vi": "Còn táo bao nhiêu ạ?"
        },
        {
          "who": "아저씨",
          "zh": "세 개에 이천 원이에요.",
          "vi": "Ba quả 2.000 won."
        },
        {
          "who": "마리코",
          "zh": "뭐가 맛있어요?",
          "vi": "Loại nào ngon ạ?"
        },
        {
          "who": "아저씨",
          "zh": "모두 맛있어요.",
          "vi": "Loại nào cũng ngon."
        },
        {
          "who": "마리코",
          "zh": "그럼 오렌지 여섯 개 주세요. 사과도 세 개 주세요.",
          "vi": "Vậy cho cháu sáu quả cam. Cho cháu cả ba quả táo nữa."
        },
        {
          "who": "아저씨",
          "zh": "네, 여기 있어요. 또 오세요.",
          "vi": "Đây, của cháu. Lần sau lại đến nhé."
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
          "zh": "더워요. 도쿄도 더워요?",
          "vi": "Nóng lắm. Tokyo cũng nóng à?"
        },
        {
          "who": "아키라",
          "zh": "아니요. 어제는 더웠지만 오늘은 안 더워요.",
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
      ]
    },
    {
      "title": "말하기 2",
      "lines": [
        {
          "who": "",
          "zh": "제 고향은 파리입니다. 파리는 지금 겨울입니다. 파리는 겨울에 눈이 오고 춥습니다. 사람들은 스키장에 갑니다. 여러분 고향은 날씨가 어떻습니까?",
          "vi": "Quê tôi là Paris. Bây giờ Paris đang là mùa đông. Mùa đông ở Paris có tuyết rơi và lạnh. Mọi người đi khu trượt tuyết. Thời tiết ở quê các bạn thế nào?"
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
          "zh": "그래요? 그럼 주말에 같이 자전거 탈까요?",
          "vi": "Vậy à? Thế cuối tuần mình cùng đi xe đạp nhé?"
        },
        {
          "who": "켈리",
          "zh": "좋아요. 어디에서 탈까요?",
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
          "zh": "가까워요. 걸어서 가요.",
          "vi": "Gần lắm. Đi bộ là tới."
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
          "zh": "와, 정말 시원하네요. 정우 씨는 이 공원에 자주 와요?",
          "vi": "Wow, mát thật đấy! Jeongwoo có hay đến công viên này không?"
        },
        {
          "who": "정우",
          "zh": "네, 자주 와요. 우리 자전거 탈까요?",
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
          "zh": "네, 아주 재미있네요.",
          "vi": "Ừ, vui lắm!"
        },
        {
          "who": "정우",
          "zh": "그럼 우리 다음에 또 올까요?",
          "vi": "Vậy lần sau mình lại đến nhé?"
        },
        {
          "who": "켈리",
          "zh": "좋아요.",
          "vi": "Được đấy."
        }
      ]
    }
  ]
}
