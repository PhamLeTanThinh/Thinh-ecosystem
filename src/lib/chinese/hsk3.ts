// SINH TỰ ĐỘNG bởi scripts/import-chinese-lessons.mjs từ scripts/chinese-data/hsk3/*.json — đừng sửa tay, sửa JSON rồi chạy lại.
import type { Dialogue } from './dialogues'
import type { LessonMeta } from './lessons'

export const HSK3_LESSON_META: Record<number, LessonMeta> = {
  "26": {
    "level": "hsk3",
    "title": "你最近怎么样了？",
    "titleVi": "Bạn gần đây thế nào?"
  },
  "27": {
    "level": "hsk3",
    "title": "我是来看房子的",
    "titleVi": "Tôi đến xem nhà"
  },
  "28": {
    "level": "hsk3",
    "title": "房间都收拾好了",
    "titleVi": "Phòng đã dọn xong rồi"
  },
  "29": {
    "level": "hsk3",
    "title": "哪条裙子更适合我？",
    "titleVi": "Cái váy nào hợp với tớ"
  },
  "30": {
    "level": "hsk3",
    "title": "你有什么爱好？",
    "titleVi": "Bạn có sở thích gì?"
  },
  "31": {
    "level": "hsk3",
    "title": "很多汉字看起来很像",
    "titleVi": "Rất nhiều chữ Hán nhìn giống nhau"
  },
  "32": {
    "level": "hsk3",
    "title": "那儿的饭菜很新鲜",
    "titleVi": "Món ăn ở đó rất tươi ngon"
  },
  "33": {
    "level": "hsk3",
    "title": "春节是最重要的节日",
    "titleVi": "Tết là dịp lễ quan trọng nhất"
  },
  "34": {
    "level": "hsk3",
    "title": "你想要什么样的爱情？",
    "titleVi": "Cậu muốn có một tình yêu như thế nào?"
  },
  "35": {
    "level": "hsk3",
    "title": "靠关系找工作是以前的事了",
    "titleVi": "Dựa vào quan hệ để tìm việc là chuyện của trước đây rồi"
  },
  "36": {
    "level": "hsk3",
    "title": "想请几天假去旅游",
    "titleVi": "Muốn xin nghỉ mấy ngày đi du lịch"
  },
  "37": {
    "level": "hsk3",
    "title": "师傅，我要去地铁站",
    "titleVi": "Bác tài ơi, cháu muốn đến bến tàu điện ngầm"
  },
  "38": {
    "level": "hsk3",
    "title": "教室没有图书馆安静",
    "titleVi": "Phòng học không yên tĩnh bằng thư viện"
  },
  "39": {
    "level": "hsk3",
    "title": "健康最重要",
    "titleVi": "Sức khỏe quan trọng nhất"
  },
  "40": {
    "level": "hsk3",
    "title": "欢迎参加今天的面试",
    "titleVi": "Chào mừng bạn đến tham gia buổi phỏng vấn hôm nay"
  },
  "41": {
    "level": "hsk3",
    "title": "第一天上班",
    "titleVi": "Ngày đầu tiên đi làm"
  },
  "42": {
    "level": "hsk3",
    "title": "生意终于谈成了",
    "titleVi": "Việc kinh doanh cuối cùng đã đàm phán xong"
  },
  "43": {
    "level": "hsk3",
    "title": "爸，我想换工作",
    "titleVi": "Bố, con muốn đổi công việc"
  },
  "44": {
    "level": "hsk3",
    "title": "节约小钱，却是浪费大钱",
    "titleVi": "Tiết kiệm khoản nhỏ lại là lãng phí món to"
  },
  "45": {
    "level": "hsk3",
    "title": "工作再忙也坚持阅读习惯",
    "titleVi": "Bận đến đâu cũng giữ thói quen đọc sách"
  },
  "46": {
    "level": "hsk3",
    "title": "你在看偶像的电视剧吧？",
    "titleVi": "Bạn đang xem phim của thần tượng à?"
  },
  "47": {
    "level": "hsk3",
    "title": "其实教育孩子很简单",
    "titleVi": "Thực ra dạy con rất đơn giản"
  },
  "48": {
    "level": "hsk3",
    "title": "互联网的发展",
    "titleVi": "Sự phát triển của internet"
  },
  "49": {
    "level": "hsk3",
    "title": "现代社会的压力挺大的",
    "titleVi": "Áp lực của xã hội hiện đại lớn quá"
  },
  "50": {
    "level": "hsk3",
    "title": "放弃一切，离开城市",
    "titleVi": "Từ bỏ tất cả, rời xa thành phố"
  }
}

export const HSK3_DIALOGUES: Record<number, Dialogue[]> = {
  "26": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "[0:班] cấp 3 chúng mình hình như đã [0:差不多] mười năm không gặp nhau rồi nhỉ. Các [0:同学] ai cũng [0:变化] nhiều, gặp ngoài đường khó mà nhận ra. Tiểu Mã, cuộc sống [0:最近] của bạn thế nào?"
        },
        {
          "who": "B",
          "zh": "Cảm ơn cậu, tớ [0:一切] đều tốt cả. Còn cậu trước đã xinh, giờ [0:越来越] xinh hơn. Đang làm ở đâu rồi?"
        },
        {
          "who": "A",
          "zh": "Đâu có, tớ béo hơn hồi trước phải đến 5 [0:公斤] ấy, hồi trước tớ [0:瘦] lắm, trông xinh [0:多么啊]. Tớ đang làm việc cho một công ty liên doanh [0:国际] trụ sở ở Trung Quốc nhưng có văn phòng ở Hà Nội."
        },
        {
          "who": "B",
          "zh": "Rời quê ra [0:城市] lập nghiệp, giờ còn làm ở công ty quốc tế nữa, lương [0:一定] là phải cao lắm nhỉ haha."
        },
        {
          "who": "A",
          "zh": "[0:工资] cũng được, nhưng mà bận lắm. Kết hôn xong thì còn bận hơn, không ở công ty làm việc thì cũng là ở nhà chăm con, [0:好不容易] mới tìm được [0:机会] \"ngàn năm có một\" này để ra ngoài gặp mọi người đấy."
        },
        {
          "who": "B",
          "zh": "Cậu đã kết hôn rồi à? Chẳng bù cho tớ vẫn là [0:单身狗] đây."
        },
        {
          "who": "A",
          "zh": "Thế tớ có một em [0:同事] cùng công ty cũng còn độc thân đấy, vừa xinh vừa [0:可爱], có cần tớ giới thiệu không?"
        },
        {
          "who": "B",
          "zh": "Thế thì còn gì bằng. Hôm nào rảnh tớ mời hai người café, cậu giới thiệu cho tớ nhé."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "A",
          "zh": "好久不见，咱们班同学差不多十年没见了吧？同学们应该都变化很大。小马，最近你怎么样？",
          "py": "Hǎojiǔ bújiàn, zánmen bān tóngxué chàbuduō shí nián méi jiàn le ba? Tóngxuémen yīnggāi dōu biànhuà hěn dà. Xiǎo Mǎ, zuìjìn nǐ zěnmeyàng?",
          "vi": "Lâu lắm không gặp, lớp chúng ta gần 10 năm chưa gặp ấy nhỉ? Các bạn học chắc hẳn đều có nhiều thay đổi. Tiểu Mã, gần đây bạn thế nào rồi?"
        },
        {
          "who": "B",
          "zh": "谢谢，我一切都好。你啊，真是[1:越来越]漂亮了。现在在哪儿工作？",
          "py": "Xièxie, wǒ yíqiè dōu hǎo. Nǐ a, zhēnshi [1:yuè lái yuè] piàoliang le. Xiànzài zài nǎr gōngzuò?",
          "vi": "Cảm ơn, tớ mọi thứ đều ổn. Cậu này, đúng là [1:ngày càng] xinh đẹp. Bây giờ đang làm ở đâu?"
        },
        {
          "who": "A",
          "zh": "哪有，我比以前胖了五公斤，以前我[2:多么]瘦[2:啊]！我现在在河内的一家国际公司工作。",
          "py": "Nǎ yǒu, wǒ bǐ yǐqián pàngle wǔ gōngjīn, yǐqián wǒ [2:duōme] shòu [2:a]! Wǒ xiànzài zài Hénèi de yì jiā guójì gōngsī gōngzuò.",
          "vi": "Đâu có, tớ mập hơn trước kia 5 kg, trước đây tớ gầy [2:lắm mà]. Tớ đang làm cho một công ty quốc tế ở Hà Nội."
        },
        {
          "who": "B",
          "zh": "在大城市工作，还是国际公司，你的工资[3:一定]很高吧？",
          "py": "Zài dà chéngshì gōngzuò, háishi guójì gōngsī, nǐ de gōngzī [3:yídìng] hěn gāo ba?",
          "vi": "Làm việc ở thành phố lớn, còn là công ty quốc tế, lương của cậu [3:chắc chắn] rất cao nhỉ?"
        },
        {
          "who": "A",
          "zh": "工资还好，但是忙死了！结婚以后就更忙了，不是在公司工作，就是回家忙着带孩子，[4:好不容易才]有机会出来见见你们。",
          "py": "Gōngzī hái hǎo, dànshì máng sǐ le! Jiéhūn yǐhòu jiù gèng máng le, búshì zài gōngsī gōngzuò, jiùshì huí jiā mángzhe dài háizi, [4:hǎobù róngyì cái] yǒu jīhuì chūlái jiànjian nǐmen.",
          "vi": "Lương cũng ổn, nhưng bận chết đi được! Sau khi kết hôn còn bận hơn, không phải làm việc ở công ty, thì lại về nhà bận chăm con, [4:khó khăn lắm] mới có cơ hội ra ngoài gặp gỡ các cậu."
        },
        {
          "who": "B",
          "zh": "你结婚了？我现在还是单身狗呢。",
          "py": "Nǐ jiéhūn le? Wǒ xiànzài háishi dānshēn gǒu ne.",
          "vi": "Cậu kết hôn rồi? Tớ bây giờ vẫn còn độc thân đây."
        },
        {
          "who": "A",
          "zh": "我有一个单身的女同事，她又漂亮又可爱，要不要我给你介绍？",
          "py": "Wǒ yǒu yí ge dānshēn de nǚ tóngshì, tā yòu piàoliang yòu kě'ài, yào bu yào wǒ gěi nǐ jièshào?",
          "vi": "Tớ có một cô đồng nghiệp cũng độc thân, cô ấy vừa xinh lại đáng yêu, có cần tớ giới thiệu cho cậu không?"
        },
        {
          "who": "B",
          "zh": "那太好了，你给我介绍吧！找时间我请你们喝咖啡。",
          "py": "Nà tài hǎo le, nǐ gěi wǒ jièshào ba! Zhǎo shíjiān wǒ qǐng nǐmen hē kāfēi.",
          "vi": "Thế thì tốt quá, cậu giới thiệu cho tớ nhé! Lúc nào tớ mời hai chị em đi uống cà phê."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "越来越",
          "np": "NP 1.1"
        },
        {
          "n": 2,
          "label": "多么……啊",
          "np": "NP 1.2"
        },
        {
          "n": 3,
          "label": "一定",
          "np": "NP 1.3"
        },
        {
          "n": 4,
          "label": "好不容易才",
          "np": "NP 1.4"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "哪有 /nǎ yǒu/ dùng để nhẹ nhàng phản đối ý kiến đối phương đưa ra, mang sắc thái khiêm tốn, thường dịch là \"đâu có\"."
      }
    }
  ],
  "27": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Cháu chào chú Cao ạ. [0:叔叔] ơi, cháu là đồng nghiệp của ông Trần. [0:先生] ấy giới thiệu cháu đến xem nhà ạ."
        },
        {
          "who": "B",
          "zh": "Cậu ấy cũng nói với chú rồi, cháu vào đi. Nhà chú gì cũng có, [0:不但] có [0:冰箱] mini loại 90 lít, tivi, điều hòa, [0:而且] phòng cũng mới sửa, chú lát lại gạch trắng sáng bóng nhìn cho [0:干净]. Vì là nhà chú xây để ở, nên có [0:客厅] rộng rãi đón khách, mỗi phòng đều có [0:卫生间] riêng trong phòng, [0:如果] có [0:客人] từ xa đến chơi, nhà rộng rãi thế này sẽ rất [0:方便]."
        },
        {
          "who": "A",
          "zh": "Mở [0:窗户] ra ngắm được hồ Tây luôn, thích quá ạ."
        },
        {
          "who": "B",
          "zh": "Gần hồ, xung quanh lại có nhiều [0:树] cổ thụ, bốn mùa đều mát mẻ, dễ chịu."
        },
        {
          "who": "A",
          "zh": "Căn nhà tốt thế này sao chú lại muốn cho [0:租] đi ạ?"
        },
        {
          "who": "B",
          "zh": "Con gái chú sắp đi Trung Quốc [0:留学], nhà chú cùng đi. Giờ chú cháu mình [0:谈] giá thuê nhé. Nhà này tiền thuê một tháng là 1000 tệ."
        },
        {
          "who": "A",
          "zh": "Dạ cháu đã rõ, cháu cũng muốn chuyển vào ở sớm. Khi nào [0:决定] xong cháu sẽ [0:告诉] chú luôn."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "A",
          "zh": "高叔叔，您好，我是陈先生的同事，我是来看房子的。",
          "py": "Gāo shūshu, nín hǎo, wǒ shì Chén xiānsheng de tóngshì, wǒ shì lái kàn fángzi de.",
          "vi": "Chú Cao, xin chào, cháu là đồng nghiệp của anh Trần, cháu đến xem nhà ạ."
        },
        {
          "who": "B",
          "zh": "他跟我说过，你进来吧。我的房子[1:什么都有]，[2:不但]有床、桌子、椅子、空调，[2:而且]还有冰箱、电视。客厅和洗手间也很大，很干净，[3:如果]有客人来[3:就]很方便。",
          "py": "Tā gēn wǒ shuō guo, nǐ jìnlai ba. Wǒ de fángzi [1:shénme dōu yǒu], [2:búdàn] yǒu chuáng, zhuōzi, yǐzi, kōngtiáo, [2:érqiě] hái yǒu bīngxiāng, diànshì. Kètīng hé xǐshǒujiān yě hěn dà, hěn gānjìng, [3:rúguǒ] yǒu kèren lái [3:jiù] hěn fāngbiàn.",
          "vi": "Cậu ấy cũng nói với chú rồi, cháu vào đi. Trong nhà [1:cái gì cũng có], [2:không những] có giường, bàn, ghế, điều hòa, [2:mà còn] có tủ lạnh, tivi. Phòng khách và nhà vệ sinh cũng rất to, rất sạch, [3:nếu] có khách đến [3:thì] rất tiện."
        },
        {
          "who": "A",
          "zh": "窗户有点儿小，夏天会不会很热？",
          "py": "Chuānghu yǒudiǎnr xiǎo, xiàtiān huì bu huì hěn rè?",
          "vi": "Cửa sổ hơi nhỏ, mùa hè có nóng không ạ?"
        },
        {
          "who": "B",
          "zh": "前面和后面有很多树，一年四季这个房间都会住得很舒服，不冷也不热。",
          "py": "Qiánmian hé hòumian yǒu hěn duō shù, yì nián sì jì zhè ge fángjiān dōu huì zhù de hěn shūfu, bù lěng yě bú rè.",
          "vi": "Phía trước và phía sau có nhiều cây, căn phòng này quanh năm đều rất dễ chịu, không lạnh cũng không nóng."
        },
        {
          "who": "A",
          "zh": "这么好的房子，您为什么想[4:租出去]？",
          "py": "Zhème hǎo de fángzi, nín wèishénme xiǎng [4:zū chūqu]?",
          "vi": "Nhà tốt thế này, sao chú lại muốn [4:cho thuê đi] ạ?"
        },
        {
          "who": "B",
          "zh": "因为我女儿快要出国留学了，我们想跟她一起去。如果你没有什么问题，我们谈谈价格吧。",
          "py": "Yīnwèi wǒ nǚ'ér kuàiyào chūguó liúxué le, wǒmen xiǎng gēn tā yìqǐ qù. Rúguǒ nǐ méiyǒu shénme wèntí, wǒmen tántan jiàgé ba.",
          "vi": "Vì con gái chú sắp đi nước ngoài du học, nhà chú sẽ cùng đi với em. Nếu cháu thấy không có vấn đề gì, mình cùng bàn về giá thuê nhé."
        },
        {
          "who": "A",
          "zh": "好的。这个房子一个月多少钱？",
          "py": "Hǎo de. Zhè ge fángzi yí ge yuè duōshao qián?",
          "vi": "Vâng ạ. Nhà này một tháng bao nhiêu tiền ạ?"
        },
        {
          "who": "B",
          "zh": "一个月一千块。",
          "py": "Yí ge yuè yì qiān kuài.",
          "vi": "Một nghìn tệ một tháng."
        },
        {
          "who": "A",
          "zh": "我知道了，我也想早点儿搬进来。决定好以后我就告诉您。",
          "py": "Wǒ zhīdào le, wǒ yě xiǎng zǎodiǎnr bān jìnlai. Juédìng hǎo yǐhòu wǒ jiù gàosu nín.",
          "vi": "Cháu biết rồi ạ, cháu cũng muốn sớm chuyển vào. Có quyết định cháu sẽ nói với chú ạ."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "什么都有",
          "np": "NP 2.1"
        },
        {
          "n": 2,
          "label": "不但；而且",
          "np": "NP 2.2"
        },
        {
          "n": 3,
          "label": "如果；就",
          "np": "NP 2.3"
        },
        {
          "n": 4,
          "label": "租出去",
          "np": "NP 2.4"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "(1) 好的 /hǎode/ khi dùng để trả lời sẽ thể hiện sự tôn trọng và khách sáo của người nói với người nghe, thường dịch là \"Vâng ạ, Dạ\". 好 /hǎo/ thường được người bề trên dùng khi trả lời lại yêu cầu của người dưới, thường dịch là \"Ừ\".\n(2) 一年四季 /yì nián sì jì/ là cụm từ bốn chữ, chỉ chung về mùa, thường dịch là \"Một năm bốn mùa\"."
      }
    }
  ],
  "28": [
    {
      "title": "Chém gió song ngữ 1",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Anh giúp em kéo cái [0:行李箱] du lịch này lên [0:楼] hai với ạ."
        },
        {
          "who": "B",
          "zh": "Được. Thế cái [0:衣柜] bốn cánh đựng quần áo kia để đâu?"
        },
        {
          "who": "A",
          "zh": "Anh để ở [0:卧室] có sẵn cái giường to kia đi ạ. Anh cẩn thận nhé."
        },
        {
          "who": "B",
          "zh": "Yên tâm, chúng tôi [0:经常] làm thế này suốt rồi."
        }
      ]
    },
    {
      "title": "Chém gió song ngữ 2",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Nhà mới xa thành phố nên chẳng lo ô nhiễm [0:环境] nhỉ, xung quanh còn có siêu thị, quán ăn, [0:公园] thì rộng và xanh mát tha hồ vui chơi và tập thể dục."
        },
        {
          "who": "B",
          "zh": "Cách xa đường phố nên còn rất [0:安静] nữa. Vừa mở [0:音乐] cổ điển, vừa đọc sách thích lắm."
        },
        {
          "who": "A",
          "zh": "Lúc nãy phòng còn bừa bộn mà giờ đã [0:收拾] xong rồi này. Mà bạn có thấy kính của tớ đâu không?"
        },
        {
          "who": "B",
          "zh": "[0:眼镜] của cậu lúc nãy còn ở trên bàn mà nhỉ. Cận như cậu không có kính nhìn có [0:清楚] không?"
        },
        {
          "who": "A",
          "zh": "[0:当然] là nhìn không rõ rồi. Giờ mà không thấy kính là gây ra bao [0:麻烦] đấy."
        },
        {
          "who": "B",
          "zh": "Yên tâm, tớ cùng tìm. Mà lát đi uống cà phê đi. Ở [0:附近] có quán cà phê mở nhạc nghe [0:挺] hay [0:的], phong cách thiết kế cũng rất [0:有意思]."
        },
        {
          "who": "A",
          "zh": "Tớ cứ uống cà phê là lại [0:睡不着觉], thôi tớ uống sinh tố thôi."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 1",
      "lines": [
        {
          "who": "A",
          "zh": "你帮我搬这个行李箱到二楼去吧。",
          "py": "Nǐ bāng wǒ bān zhè ge xínglixiāng dào èr lóu qù ba.",
          "vi": "Anh giúp tôi đưa cái vali này lên tầng 2 với."
        },
        {
          "who": "B",
          "zh": "好，外面的冰箱放在哪儿？",
          "py": "Hǎo, wàimian de bīngxiāng fàng zài nǎr?",
          "vi": "Được, cái tủ lạnh bên ngoài đặt ở đâu?"
        },
        {
          "who": "A",
          "zh": "先放我这儿吧。还有那个大衣柜放在卧室里，小心点儿。",
          "py": "Xiān fàng wǒ zhèr ba. Hái yǒu nà ge dà yīguì fàng zài wòshì lǐ, xiǎoxīn diǎnr.",
          "vi": "Trước hết cứ đặt ở chỗ tôi đây. Còn cái tủ quần áo to kia để ở trong phòng ngủ, anh cẩn thận chút nhé."
        },
        {
          "who": "B",
          "zh": "放心，我们经常做这些。",
          "py": "Nǐ fàngxīn, wǒmen jīngcháng zuò zhèxiē.",
          "vi": "Cứ yên tâm, chúng tôi vẫn thường làm thế này."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 2",
      "lines": [
        {
          "who": "A",
          "zh": "新家的环境真好，楼下还有公园、超市和饭店，多方便啊！",
          "py": "Xīnjiā de huánjìng zhēn hǎo, lóu xià hái yǒu gōngyuán, chāoshì hé fàndiàn, duō fāngbiàn a!",
          "vi": "Không gian nhà mới đẹp thật, dưới tầng còn có công viên, siêu thị và quán ăn, tiện thế!"
        },
        {
          "who": "B",
          "zh": "还很安静啊。[1:一边]听音乐[1:一边]看书特别舒服。",
          "py": "Hái hěn ānjìng a. [1:Yìbiān] tīng yīnyuè [1:yìbiān] kànshū tèbié shūfu.",
          "vi": "Còn rất yên tĩnh nữa. [1:Vừa] nghe nhạc, [1:vừa] đọc sách, rất thoải mái."
        },
        {
          "who": "A",
          "zh": "房间都收拾好了。你看见我的眼镜了吗？",
          "py": "Fángjiān dōu shōushi hǎo le. Nǐ kànjiàn wǒ de yǎnjìng le ma?",
          "vi": "Phòng dọn xong rồi. Cậu thấy kính của tớ đâu không?"
        },
        {
          "who": "B",
          "zh": "刚才还在桌子上呢。没有眼镜你[2:看得清楚吗]？",
          "py": "Gāngcái hái zài zhuōzi shàng ne. Méiyǒu yǎnjìng nǐ [2:kàn de qīngchu ma]?",
          "vi": "Lúc nãy còn ở trên bàn mà. Không có kính cậu [2:nhìn rõ không]?"
        },
        {
          "who": "A",
          "zh": "当然[2:看不清楚]了。这么多东西，不知道放哪儿了，[2:找不到]就麻烦了。",
          "py": "Dāngrán [2:kàn bù qīngchu] le. Zhème duō dōngxi, bù zhīdào fàng nǎr le, [2:zhǎo bu dào] jiù máfan le.",
          "vi": "Đương nhiên là [2:nhìn không rõ] rồi. Nhiều đồ thế này, không biết để đâu rồi, [2:không tìm được] thì phiền rồi."
        },
        {
          "who": "B",
          "zh": "我帮你找。找到了我们一起去喝咖啡吧，附近有一个[3:挺]有意思的咖啡店，环境也不错。",
          "py": "Wǒ bāng nǐ zhǎo. Zhǎodào le wǒmen yìqǐ qù hē kāfēi ba, fùjìn yǒu yí gè [3:tǐng] yǒuyìsi de kāfēi diàn, huánjìng yě búcuò.",
          "vi": "Tớ giúp cậu tìm. Tìm được rồi chúng mình cùng đi uống cà phê đi, gần đây có một quán cà phê [3:khá] thú vị, khung cảnh cũng rất tuyệt."
        },
        {
          "who": "A",
          "zh": "我一喝咖啡就[2:睡不着觉]，我[4:还是]喝果汁吧。",
          "py": "Wǒ yì hē kāfēi jiù [2:shuì bù zháo jiào], wǒ [4:háishi] hē guǒzhī ba.",
          "vi": "Tớ cứ uống cà phê là [2:không ngủ được], tớ [4:vẫn] uống nước quả thôi."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "一边",
          "np": "NP 3.1"
        },
        {
          "n": 2,
          "label": "看得清楚吗",
          "np": "NP 3.2"
        },
        {
          "n": 3,
          "label": "挺",
          "np": "NP 3.3"
        },
        {
          "n": 4,
          "label": "还是",
          "np": "NP 3.4"
        }
      ]
    }
  ],
  "29": [
    {
      "title": "Chém gió song ngữ 1",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Trong mấy [0:条] váy liền này, cậu nghĩ tớ nên [0:选择] cái nào để mua mặc đi đám cưới."
        },
        {
          "who": "B",
          "zh": "Cái màu trắng với màu đỏ tớ thấy đều rất [0:适合] với vóc dáng [0:矮] như nấm của cậu."
        },
        {
          "who": "A",
          "zh": "Nhưng váy đỏ hơi [0:长] nhỉ, giẫm vào váy có mà ngã sấp mặt, giá mà có cái nào [0:短] hơn một chút thì xinh. Váy trắng đẹp đấy, nhưng đến [0:参加] đám cưới ai lại mặc màu trắng [0:像] váy cưới của [0:新娘] nhà người ta, phải mặc màu không [0:一样] mới phải.."
        },
        {
          "who": "B",
          "zh": "Lo gì, thiệp mời dự [0:婚礼] cũng đâu có quy định khắt khe gì về trang phục. Cứ đẹp là được."
        },
        {
          "who": "A",
          "zh": "Tớ còn thích cái này, nhưng màu của nó lại hơi [0:深], tớ lại thích cái nào màu nhạt thôi."
        },
        {
          "who": "B",
          "zh": "Cả cái [0:衣柜] của cửa hàng quần áo to như vậy, trên móc [0:挂] đầy quần áo thế này, thích cái nào cứ chọn đại đi. Chứ tình hình này tớ [0:恐怕] cứ ngắm lên ngắm xuống mãi, đám cưới người ta [0:结束] rồi cậu còn chưa chốt mua được cái nào cũng nên."
        }
      ]
    },
    {
      "title": "Chém gió song ngữ 2",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Cô ơi, chuối bao nhiêu một nải ạ?"
        },
        {
          "who": "B",
          "zh": "Một [0:串] có 50 tệ thôi. [0:香蕉] miền Nam chuyển ra, kiểm định [0:安全] thực phẩm rất gắt gao, cuống còn [0:新鲜] thế này cơ mà."
        },
        {
          "who": "A",
          "zh": "Chuối này chín chắc [0:甜] như mật ấy cô nhỉ. Nhưng để cháu giá 45 được không cô, cô [0:同意] giá này là cháu mua cho cô cả buồng luôn."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 1",
      "lines": [
        {
          "who": "A",
          "zh": "你觉得哪条裙子更适合我？",
          "py": "Nǐ juéde nǎ tiáo qúnzi gèng shìhé wǒ?",
          "vi": "Cậu thấy cái váy nào hợp với tớ?"
        },
        {
          "who": "B",
          "zh": "白的、红的我觉得都挺好看的。",
          "py": "Bái de, hóng de wǒ juéde dōu tǐng hǎokàn de.",
          "vi": "Cái màu trắng và màu đỏ tớ thấy rất đẹp."
        },
        {
          "who": "A",
          "zh": "红的有点儿长，穿上去很矮。白的[1:好看是好看]，不过参加婚礼谁穿白色啊，不能穿得[2:像]新娘[2:一样]。",
          "py": "Hóng de yǒudiǎnr cháng, chuān shàngqu hěn ǎi. Bái de [1:hǎokàn shì hǎokàn], búguò cānjiā hūnlǐ shéi chuān báisè a, bùnéng chuān de [2:xiàng] xīnniáng [2:yíyàng].",
          "vi": "Cái màu đỏ hơi dài, mặc lên trông rất thấp. Cái trắng [1:đẹp thì có đẹp], nhưng đi đám cưới ai lại mặc đồ trắng, không thể mặc [2:giống] cô dâu được."
        },
        {
          "who": "B",
          "zh": "那这条红的怎么样？",
          "py": "Nà zhè tiáo hóng de zěnmeyàng?",
          "vi": "Vậy cái màu đỏ này thế nào?"
        },
        {
          "who": "A",
          "zh": "太短了吧。",
          "py": "Tài duǎn le ba.",
          "vi": "Ngắn quá nhỉ."
        },
        {
          "who": "B",
          "zh": "衣柜挂着这么多衣服，你喜欢哪个就买哪个。",
          "py": "Yīguì guàzhe zhème duō yīfu, nǐ xǐhuan nǎ ge jiù mǎi nǎ ge.",
          "vi": "Trên giá treo nhiều quần áo thế, cậu thích cái nào thì mua cái đó."
        },
        {
          "who": "A",
          "zh": "看来看去还不知道选择哪一个，明天我们再来看吧。",
          "py": "Kàn lái kàn qù hái bù zhīdào xuǎnzé nǎ yí ge, míngtiān wǒmen zàilái kàn ba.",
          "vi": "Nhìn đi nhìn lại vẫn không biết chọn cái nào, ngày mai chúng ta lại đến xem nhé."
        },
        {
          "who": "B",
          "zh": "你啊，昨天看了，今天[3:又]看，明天再来看，婚礼结束了恐怕你还没选好呢。",
          "py": "Nǐ a, zuótiān kàn le, jīntiān [3:yòu] kàn, míngtiān zài lái kàn, hūnlǐ jiéshù le kǒngpà nǐ hái méi xuǎn hǎo ne.",
          "vi": "Cậu hôm qua xem rồi, hôm nay [3:lại] xem, ngày mai lại đến xem, đám cưới kết thúc rồi, e là cậu vẫn chưa chọn được."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "好看是好看",
          "np": "NP 4.1"
        },
        {
          "n": 2,
          "label": "像……一样",
          "np": "NP 4.2"
        },
        {
          "n": 3,
          "label": "又",
          "np": "NP 4.3"
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 2",
      "lines": [
        {
          "who": "A",
          "zh": "阿姨，一串香蕉多少钱？",
          "py": "Āyí, yí chuàn xiāngjiāo duōshao qián?",
          "vi": "Cô ơi, 1 nải chuối bao nhiêu tiền?"
        },
        {
          "who": "B",
          "zh": "50块一串，你买几串？",
          "py": "Wǔshí kuài yí chuàn, nǐ mǎi jǐ chuàn?",
          "vi": "50 đồng một nải, cháu mua mấy nải?"
        },
        {
          "who": "A",
          "zh": "怎么这么贵？",
          "py": "Zěnme zhème guì?",
          "vi": "Sao mà đắt thế?"
        },
        {
          "who": "B",
          "zh": "这是最便宜的价格了。这香蕉又香又甜，还很新鲜。",
          "py": "Zhè shì zuì piányi de jiàgé le. Zhè xiāngjiāo yòu xiāng yòu tián, hái hěn xīnxiān.",
          "vi": "Đây là giá rẻ nhất rồi. Chuối này vừa thơm vừa ngọt, còn rất tươi."
        },
        {
          "who": "A",
          "zh": "45元一串可以吗？你同意我就买两串。",
          "py": "Sìshíwǔ yuán yí chuàn kěyǐ ma? Nǐ tóngyì wǒ jiù mǎi liǎng chuàn.",
          "vi": "45 đồng một nải được không ạ? Cô đồng ý thì cháu mua hai nải."
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "再说 /zàishuō/ dùng để đưa ra thêm lý do bổ sung, lý do đi cùng với 再说 không phải lý do quan trọng nhất."
      }
    }
  ],
  "30": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Dạo này [0:发现] mình lại béo lên, [0:自己] cảm thấy buồn quá."
        },
        {
          "who": "B",
          "zh": "[0:越] béo sẽ càng [0:懒] vận động, mau [0:关] cái tivi đi, không là tớ [0:把] cái điều khiển vứt đi bây giờ."
        },
        {
          "who": "A",
          "zh": "Xem tivi cũng [0:蛮] thú vị chứ bộ, có thể xem phim, cày những [0:电视剧] đang hot, còn xem cả những [0:游戏节目] như The Voice, Ai là triệu phú, cái gì cũng có."
        },
        {
          "who": "B",
          "zh": "[0:除了] xem tivi [0:以外], bạn không có [0:爱好] nào khác nữa à, như chơi nhạc cụ, hát hò, chăm cây cảnh chẳng hạn. Như tớ này, cuối tuần đều đi Ba Vì leo núi. [0:山] không quá cao nên [0:爬] cũng không quá vất vả, thỉnh thoảng có thể [0:停] chân ngắm những [0:树木] xanh cao vút, hít hà hương [0:花] thơm ngát, mệt thì ngả lưng xuống bãi [0:草] xanh mát, thích là giơ [0:照相机] lên chụp. Vừa là cơ hội [0:锻炼] sức khỏe, vừa để mình được [0:放松] sau một tuần làm việc. Không đi thì có thể ở nhà nghe nhạc, [0:画画儿] thủy mặc chẳng hạn."
        },
        {
          "who": "A",
          "zh": "Tớ không xem tivi, thì cũng lên mạng [0:聊天儿] với hội bạn. [0:其实] tớ cũng không biết đi đâu chơi cả."
        },
        {
          "who": "B",
          "zh": "Để tớ qua đưa cậu đi. [0:地址] nhà cậu ở đâu nhỉ, [0:发] cho tớ đi, tớ chạy qua đón luôn."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "A",
          "zh": "我发现自己越来越胖了，真难过！",
          "py": "Wǒ fāxiàn zìjǐ yuè lái yuè pàng le, zhēn nánguò!",
          "vi": "Tớ phát hiện là tớ ngày càng béo, thật buồn quá!"
        },
        {
          "who": "B",
          "zh": "你整天在家躺着看电视，[1:能]不胖[1:吗]？[2:越]胖[2:越]懒，快[3:把]电视关了吧。",
          "py": "Nǐ zhěng tiān zài jiā tǎngzhe kàn diànshì, [1:néng] bú pàng [1:ma]? [2:Yuè] pàng [2:yuè] lǎn, kuài [3:bǎ] diànshì guān le ba.",
          "vi": "Cậu nằm ở nhà xem tivi cả ngày, [1:có thể] không béo [1:không]? [2:Càng] béo [2:càng] lười, nhanh tắt tivi đi."
        },
        {
          "who": "A",
          "zh": "看电视也蛮有意思的。电影、电视剧、游戏节目，什么都有。",
          "py": "Kàn diànshì yě mán yǒuyìsi de. Diànyǐng, diànshìjù, yóuxì jiémù, shénme dōu yǒu.",
          "vi": "Xem tivi cũng khá thú vị mà. Phim, kịch truyền hình, chương trình giải trí, cái gì cũng có."
        },
        {
          "who": "B",
          "zh": "[4:除了]看电视[4:以外]，你没有别的爱好吗？",
          "py": "[4:Chúle] kàn diànshì [4:yǐwài], nǐ méiyǒu bié de àihào ma?",
          "vi": "[4:Ngoài] xem tivi [4:ra] cậu còn có sở thích nào khác không?"
        },
        {
          "who": "A",
          "zh": "没有。你呢，有空儿的时候，你喜欢做什么？",
          "py": "Méiyǒu. Nǐ ne, yǒu kòngr de shíhou, nǐ xǐhuan zuò shénme?",
          "vi": "Tớ không, còn cậu thì sao? Lúc rảnh cậu thường làm gì?"
        },
        {
          "who": "B",
          "zh": "有空儿的时候，我经常带着照相机去爬爬山，路上停下来看看树木花草，一边锻炼身体，一边放松自己。如果在家里，我会听音乐，画画儿或者看书。我今天刚买回来了很多书。",
          "py": "Yǒu kòngr de shíhou, wǒ jīngcháng dài zhe zhàoxiàngjī qù pá páshān, lùshang tíng xiàlai kànkan shùmù huācǎo, yìbiān duànliàn shēntǐ, yìbiān fàngsōng zìjǐ. Rúguǒ zài jiāli, wǒ huì tīng yīnyuè, huà huàr huòzhě kànshū. Wǒ jīntiān mǎi huílai le hěn duō shū.",
          "vi": "Lúc rảnh tớ thường mang theo máy ảnh đi leo núi, trên đường dừng lại ngắm cây cối hoa cỏ, vừa rèn luyện sức khoẻ vừa thư giãn. Nếu ở nhà thì tớ sẽ nghe nhạc, vẽ tranh hoặc đọc sách. Hôm nay tớ vừa mua về bao nhiêu là sách đây."
        },
        {
          "who": "A",
          "zh": "我在家不是看电视，就是上网聊天儿。其实我也不知道应该去哪儿玩儿。",
          "py": "Wǒ zài jiā búshì kàn diànshì, jiùshì shàngwǎng liáotiānr. Qíshí wǒ yě bù zhīdào yīnggāi qù nǎr wánr.",
          "vi": "Còn tớ ở nhà không xem tivi thì cũng lên mạng tán gẫu. Thực ra tớ cũng không biết nên đi đâu chơi."
        },
        {
          "who": "B",
          "zh": "没问题，我带你去。[3:把]你家的地址发给我，我马上过去接你。",
          "py": "Méi wèntí, wǒ dài nǐ qù. [3:Bǎ] nǐ jiā de dìzhǐ fā gěi wǒ, wǒ mǎshàng guòqu jiē nǐ.",
          "vi": "Không vấn đề, tớ dẫn cậu đi. Gửi địa chỉ của cậu cho tớ, tớ lập tức qua đón cậu."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "能不胖吗",
          "np": "NP 5.1"
        },
        {
          "n": 2,
          "label": "越胖越懒",
          "np": "NP 5.2"
        },
        {
          "n": 3,
          "label": "把",
          "np": "NP 5.3"
        },
        {
          "n": 4,
          "label": "除了…以外",
          "np": "NP 5.4"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "蛮 /mán/ dùng trong khẩu ngữ, để biểu đạt mức độ cao của tính từ hay động từ tâm lý, cách dùng tương tự như 挺 /tǐng/, nhưng có hoặc không có 的 đều được, thường dịch là \"khá, khá là, hơi\"."
      }
    }
  ],
  "31": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "[0:作业] về nhà hôm nay thầy giao có câu này tớ chẳng biết làm, cậu giúp tớ với."
        },
        {
          "who": "B",
          "zh": "Hừm, [0:好像] cậu viết nhầm chữ hay sao ấy. Thôi đúng rồi, viết nhầm chữ \"Bình thường\" thành chữ \"Thuyền\" trong tên tác phẩm \"Chiếc [0:船] ngoài xa\"."
        },
        {
          "who": "A",
          "zh": "Hóa ra đấy là chữ [0:一般] à. Chữ viết bằng phấn trắng trên [0:黑板] mà lại hơi nhỏ, nên nhìn không có ra."
        },
        {
          "who": "B",
          "zh": "Nhiều chữ Hán trông giống nhau, nên viết sai cũng là điều [0:正常] như cân đường hộp sữa."
        },
        {
          "who": "A",
          "zh": "Tớ đã [0:花] rất nhiều thời gian luyện tập, [0:可是] cứ học được vài từ, sáng hôm sau là [0:忘记] sạch, nhìn lại như mới. Bài kiểm tra mới đây khiến tớ [0:发现] ra rằng [0:水平] Tiếng Trung của tớ cũng không được tốt như tớ vẫn [0:想象]. Cậu có [0:办法] nào giúp dễ nhớ chữ, chỉ tớ với!"
        },
        {
          "who": "B",
          "zh": "Để luyện Tiếng Trung tớ áp dụng [0:主要] một số cách như: dành thời gian đọc sách [0:中文], xem phim Trung, nghe nhạc Trung v.v... Đọc, xem hay nghe được từ nào, [0:句子] nào hay là ghi lại luôn, biết đâu được status chất. Dần dần khả năng Tiếng Trung cũng từng bước được [0:提高]."
        },
        {
          "who": "A",
          "zh": "Được, tớ cũng sẽ học [0:向] cách của cậu, nhất định [0:继续] nỗ lực không bỏ cuộc!"
        },
        {
          "who": "B",
          "zh": "Với quyết tâm ấy, tớ [0:相信] cậu sẽ học tốt."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "A",
          "zh": "今天的作业我不知道怎么做，请你帮帮我。",
          "py": "Jīntiān de zuòyè wǒ bù zhīdào zěnme zuò, qǐng nǐ bāngbang wǒ.",
          "vi": "Bài tập hôm nay tớ không biết làm thế nào, cậu giúp tớ với."
        },
        {
          "who": "B",
          "zh": "[1:好像]你写错了，你[2:把]\"一般\"的\"般\"写成\"船\"了。",
          "py": "[1:Hǎoxiàng] nǐ xiě cuò le, nǐ [2:bǎ] \"yìbān\" de \"bān\" xiě chéng \"chuán\" le.",
          "vi": "[1:Hình như] cậu viết sai rồi, cậu viết chữ \"般\" trong từ \"一般\" thành chữ \"船\" rồi."
        },
        {
          "who": "A",
          "zh": "黑板上写的字有点儿小，我看不清楚，也不想麻烦老师。",
          "py": "Hēibǎn shang xiě de zì yǒudiǎnr xiǎo, wǒ kàn bu qīngchu, yě bù xiǎng máfan lǎoshī.",
          "vi": "Chữ viết trên bảng hơi nhỏ, tớ nhìn không rõ, cũng không muốn làm phiền thầy cô."
        },
        {
          "who": "B",
          "zh": "写错字也是正常的，因为很多汉字看起来很像。",
          "py": "Xiě cuò zì yěshì zhèngcháng de, yīnwèi hěn duō hànzì kàn qǐlai hěn xiàng.",
          "vi": "Viết sai chữ cũng là điều bình thường, bởi vì nhiều chữ Hán trông rất giống nhau."
        },
        {
          "who": "A",
          "zh": "我花很多时间练习，可是总是学了就忘记。最近考试才发现我的水平没有自己想象的那么好。你有什么办法吗？",
          "py": "Wǒ huā hěn duō shíjiān liànxí, kěshì zǒng shì xué le jiù wàngjì. Zuìjìn kǎoshì cái fāxiàn wǒ de shuǐpíng méiyǒu zìjǐ xiǎngxiàng de nàme hǎo. Nǐ yǒu shénme bànfǎ ma?",
          "vi": "Tớ dành rất nhiều thời gian để luyện viết chữ Hán, nhưng mà toàn học rồi lại quên. Gần đây đi thi mới phát hiện ra là trình độ Tiếng Trung của tớ không tốt như những gì tớ đã tưởng tượng. Cậu có cách nào không?"
        },
        {
          "who": "B",
          "zh": "练习汉语的时候，我主要看中文书、中国电影，听中国音乐等等。每次听到好句子就马上写[3:下来]。过了几个月，我的中文慢慢就提高了。你试试吧！",
          "py": "Liànxí Hànyǔ de shíhou, wǒ zhǔyào kàn Zhōngwén shū, Zhōngguó diànyǐng, tīng Zhōngguó yīnyuè děngděng. Měi cì tīng dào hǎo jùzi jiù mǎshàng xiě [3:xiàlai]. Guò le jǐ ge yuè, wǒ de Zhōngwén mànmàn jiù tígāo le. Nǐ shìshi ba!",
          "vi": "Lúc luyện Tiếng Trung tớ chủ yếu đọc sách Tiếng Trung, xem phim Trung Quốc và nghe nhạc Trung Quốc v.v... Mỗi khi nghe thấy câu nào hay liền lập tức [3:ghi lại]. Qua mấy tháng, Tiếng Trung của tớ dần tốt lên. Cậu thử xem."
        },
        {
          "who": "A",
          "zh": "好，我向你学习，继续努力[3:下去]！",
          "py": "Hǎo, wǒ xiàng nǐ xuéxí, jìxù nǔlì [3:xiàqu]!",
          "vi": "Được, tớ phải học tập cậu, [3:tiếp tục] cố gắng thôi!"
        },
        {
          "who": "B",
          "zh": "万事开头难，我相信你能学好的。",
          "py": "Wàn shì kāi tóu nán, wǒ xiāngxìn nǐ néng xué hǎo de.",
          "vi": "Vạn sự khởi đầu nan, tớ tin cậu có thể học tốt."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "好像",
          "np": "NP 6.1"
        },
        {
          "n": 2,
          "label": "把",
          "np": "NP 6.2"
        },
        {
          "n": 3,
          "label": "下来 / 下去",
          "np": "NP 6.3"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "1. 万事开头难 /wànshì kāitóu nán/, thành ngữ, thường dịch là \"Vạn sự khởi đầu nan\".\n2. 等等 /děng děng/ đặt phía sau các từ hay cụm từ để nhấn mạnh ý liệt kê, thường dịch là \"vân vân\". 等等 không đặt sau tên người hay địa danh, lúc đó cần dùng 等. Khi đã dùng từ 等 hay 等等 thì không cần dùng dấu chấm lửng."
      }
    }
  ],
  "32": [
    {
      "title": "Chém gió song ngữ 1",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Hôm nay trả bài thi, thành tích kỳ này lại kém hơn [0:成绩] kỳ trước, tớ vừa [0:被] cô chủ nhiệm gọi lên văn phòng [0:批评] nghiêm khắc một trận. Giờ chắc [0:只有] ăn thịt [0:才] làm [0:心情] đang tuột dốc của tớ lúc này vui trở lại."
        },
        {
          "who": "B",
          "zh": "Thế giờ cậu [0:需要] ăn gì? Tớ biết một [0:餐厅] mới khai trương, thực phẩm nhập trong ngày nên [0:新鲜] roi rói. Chưa ăn sáng nên giờ tớ [0:饿] lắm rồi, [0:渴] khô cả cổ, cùng đi [0:尝] thử hương vị món ăn ở nhà hàng đó đi."
        },
        {
          "who": "A",
          "zh": "Thế cậu gọi điện đặt chỗ luôn đi, kẻo gần giờ ăn trưa đến lại không có [0:座位]."
        }
      ]
    },
    {
      "title": "Chém gió song ngữ 2",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Món ăn hôm nay ngon quá, nghe danh đặc sản [0:羊肉] Ninh Bình và cơm cháy đã lâu, nay mới được thưởng thức. Món [0:面包] đặc ruột thơm bơ cũng ưng. [0:饮料] nhà hàng pha cũng ngon, tớ uống no căng."
        },
        {
          "who": "B",
          "zh": "Ừ, tớ cũng ăn đến [0:饱] căng cả bụng rồi. [0:盘子] sứ tròn để đồ ăn cùng [0:筷子] gắp thức ăn làm đẹp nhỉ, tớ rất [0:感兴趣] với cách thiết kế ứng dụng mỹ thuật cổ như vậy. Thái độ phục vụ chu đáo cũng làm tớ thấy rất [0:满意], sau này sẽ lại tới đây."
        },
        {
          "who": "A",
          "zh": "Còn cả đĩa cá chua ngọt chúng mình chưa ăn [0:口] nào, sao giờ?"
        },
        {
          "who": "B",
          "zh": "Nhờ nhân viên giúp mình [0:打包] lại rồi xách về thôi."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 1",
      "lines": [
        {
          "who": "A",
          "zh": "今天考试成绩不好，我[1:被]老师批评了。现在[2:只有]吃肉[2:才]能让我的心情好起来。",
          "py": "Jīntiān kǎoshì chéngjì bù hǎo, wǒ [1:bèi] lǎoshī pīpíng le. Xiànzài [2:zhǐyǒu] chī ròu [2:cái] néng ràng wǒ de xīnqíng hǎo qǐlai.",
          "vi": "Tớ [1:bị] giáo viên phê bình vì kết quả kiểm tra không tốt hôm nay. Bây giờ [2:chỉ có] ăn thịt [2:mới] có thể khiến tâm trạng của tớ dễ chịu hơn."
        },
        {
          "who": "B",
          "zh": "你需要吃什么？我知道一家餐厅，那儿的饭菜很新鲜。酸的，甜的，咸的，辣的，想吃什么就有什么。正好我又饿又渴，我带你去尝尝吧。",
          "py": "Nǐ xūyào chī shénme? Wǒ zhīdào yì jiā cāntīng, nàr de fàncài hěn xīnxiān. Suān de, tián de, xián de, là de, xiǎng chī shénme jiù yǒu shénme. Zhènghǎo wǒ yòu è yòu kě, wǒ dài nǐ qù chángchang ba.",
          "vi": "Bạn muốn ăn gì? Tớ biết một nhà hàng này thức ăn rất tươi. Món chua, món ngọt, món mặn, món cay, thích ăn món nào là có món đấy. Đúng lúc tớ vừa đói vừa khát, tớ đưa bạn đi ăn thử nhé."
        },
        {
          "who": "A",
          "zh": "那你打电话订座位吧。",
          "py": "Nà nǐ dǎ diànhuà dìng zuòwèi ba.",
          "vi": "Thế bạn gọi điện đặt chỗ đi."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "被",
          "np": "NP 7.1"
        },
        {
          "n": 2,
          "label": "只有……才……",
          "np": "NP 7.2"
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 2",
      "lines": [
        {
          "who": "A",
          "zh": "今天的菜太好吃了，我吃了很多羊肉和面包，也喝了不少饮料。",
          "py": "Jīntiān de cài tài hǎochī le, wǒ chī le hěn duō yángròu hé miànbāo, yě hē le bù shǎo yǐnliào.",
          "vi": "Đồ ăn hôm nay rất ngon, tớ đã ăn rất nhiều thịt dê và bánh mì, cũng uống rất nhiều đồ uống."
        },
        {
          "who": "B",
          "zh": "我也吃得太饱了。我[3:对]这家餐厅的碗、盘子和筷子很[3:感兴趣]。我对他们的服务也特别满意，以后有机会我们再来这里吃吧。",
          "py": "Wǒ yě chī de tài bǎo le. Wǒ [3:duì] zhè jiā cāntīng de wǎn, pánzi hé kuàizi hěn [3:gǎn xìngqù]. Wǒ duì tāmen de fúwù yě tèbié mǎnyì, yǐhòu yǒu jīhuì wǒmen zàilái zhèlǐ chī ba.",
          "vi": "Tớ cũng quá no luôn. Tớ [3:rất thích thú với] bát, đĩa, đũa ở nhà hàng này. Tớ cũng rất hài lòng với cách phục vụ của họ, sau này có cơ hội lại đến đây ăn nhé."
        },
        {
          "who": "A",
          "zh": "还有一盘酸辣鱼一口也没吃呢，怎么办？",
          "py": "Hái yǒu yì pán suān là yú yì kǒu yě méi chī ne, zěnme bàn?",
          "vi": "Vẫn còn một đĩa cá chua ngọt chưa ăn miếng nào, phải làm sao?"
        },
        {
          "who": "B",
          "zh": "那把酸辣鱼打包带回去吧。",
          "py": "Nà bǎ suān là yú dǎbāo dài huíqu ba.",
          "vi": "Thế thì gói cá chua ngọt mang về thôi."
        }
      ],
      "legend": [
        {
          "n": 3,
          "label": "对……感兴趣",
          "np": "NP 7.3"
        }
      ]
    }
  ],
  "33": [
    {
      "title": "Chém gió song ngữ 1",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Hôm nay là kỷ niệm ngày cưới của bố mẹ, con chúc bố mẹ [0:一生一世] luôn hạnh phúc bên nhau, đúng như tên chương trình truyền hình \"[0:快乐] - [0:健康] - Có ích\"."
        },
        {
          "who": "B",
          "zh": "Bố mẹ cảm ơn con."
        },
        {
          "who": "A",
          "zh": "Con còn chuẩn bị [0:礼物] tặng cho bố mẹ nữa cơ. [0:皮鞋] da bò thật này là tặng mẹ đi, [0:手表] này là tặng bố đeo để xem giờ. Bố mẹ cứ yên tâm, đừng [0:担心] nhé, sau này bố mẹ già vẫn sẽ luôn có con ở bên [0:照顾] bố mẹ."
        },
        {
          "who": "B",
          "zh": "Mình ơi, bé con lí lắc suốt ngày giả làm [0:猫] kêu meo meo khắp nhà của chúng ta đã [0:长大] thật rồi, dẻo [0:嘴] chưa kìa. Nhìn con lớn và hiểu chuyện như này, bố mẹ rất [0:开心]."
        },
        {
          "who": "A",
          "zh": "Con gái [0:为] yêu bố mẹ mà đến đó ạ. Nhưng ngoài quà, con còn chuẩn bị một cái [0:蛋糕] sô-cô-la 2 tầng liền, bố mẹ thổi nến, cắt bánh rồi cả nhà mình cùng ăn nhé ạ."
        }
      ]
    },
    {
      "title": "Chém gió song ngữ 2",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Tuy một năm người Việt đón mừng nhiều [0:节日], như Tết Trung thu, Tết Đoan ngọ, trẻ em có Tết Thiếu nhi, nhưng [0:对] với người Việt Nam [0:来说] Tết có ý nghĩa đặc biệt vì là ngày lễ [0:重要] bậc nhất trong năm. [0:为了] chuẩn bị tiễn năm [0:旧] đi, đón năm mới đến, nhà nào cũng [0:打扫] sạch sẽ. Bạn hài lòng với thành quả năm vừa [0:过去] của mình chứ? Năm mới, khởi đầu mới, mong bạn luôn vui vẻ, hạnh phúc, [0:平安] vô sự."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 1",
      "lines": [
        {
          "who": "A",
          "zh": "爸妈，今天是你们结婚二十周年，希望你们每天开心快乐，一生一世健康。",
          "py": "Bà mā, jīntiān shì nǐmen jiéhūn èrshí zhōunián, xīwàng nǐmen měitiān kāixīn kuàilè, yì shēng yí shì jiànkāng.",
          "vi": "Bố mẹ ơi, hôm nay là kỉ niệm tròn 20 năm ngày cưới của bố mẹ, con mong bố mẹ vui vẻ mỗi ngày, cả đời mạnh khỏe."
        },
        {
          "who": "B",
          "zh": "爸妈谢谢你。",
          "py": "Bà mā xièxie nǐ.",
          "vi": "Bố mẹ cảm ơn con."
        },
        {
          "who": "A",
          "zh": "我还[1:为]你们准备了礼物呢。皮鞋是送给妈妈的，手表是送给爸爸的。爸妈别担心，以后我会好好儿照顾你们的。",
          "py": "Wǒ hái [1:wèi] nǐmen zhǔnbèi le lǐwù ne. Píxié shì sòng gěi māma de, shǒubiǎo shì sòng gěi bàba de. Bà mā bié dānxīn, yǐhòu wǒ huì hǎohāor zhàogù nǐmen de.",
          "vi": "Con cũng đã chuẩn bị quà [1:cho] bố mẹ. Giày da là để tặng mẹ, đồng hồ là để tặng bố. Bố mẹ đừng lo lắng, sau này con sẽ chăm sóc bố mẹ thật tốt."
        },
        {
          "who": "B",
          "zh": "老公你看，我们家的小猫已经长大了，嘴这么甜，真会说话。",
          "py": "Lǎogōng nǐ kàn, wǒmen jiā de xiǎo māo yǐjīng zhǎng dà le, zuǐ zhème tián, zhēn huì shuō huà.",
          "vi": "Mình ơi, bé mèo con của chúng ta đã lớn thật rồi, nói được lời ngọt ngào như thế, thật khéo mồm."
        },
        {
          "who": "A",
          "zh": "你们的女儿嘛。除了礼物，我还准备一个大蛋糕，我们快一起吃吧。",
          "py": "Nǐmen de nǚ'ér ma. Chúle lǐwù, wǒ hái zhǔnbèi yí ge dà dàngāo, wǒmen kuài yìqǐ chī ba.",
          "vi": "Con gái của bố mẹ mà. Ngoài quà ra, con còn chuẩn bị một cái bánh to, cả nhà mình cùng nhau ăn nhé."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "为 / 为了",
          "np": "NP 8.1"
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 2",
      "lines": [
        {
          "who": "",
          "zh": "[2:对]越南人[2:来说]，春节是最重要的节日。[1:为了]送旧迎新，大家都把房间打扫得[3:干干净净]。你对过去一年里的成绩觉得满意吗？新的一年，新的开始，希望你新年[3:高高兴兴]，一生[3:快快乐乐]，一世[3:平平安安]。",
          "py": "[2:Duì] Yuènán rén [2:lái shuō], Chūnjié shì zuì zhòngyào de jiérì. [1:Wèile] sòng jiù yíng xīn, dàjiā dōu bǎ fángjiān dǎsǎo de [3:gān gān jìng jìng]. Nǐ duì guòqù yì nián lǐ de chéngjì juéde mǎnyì ma? Xīn de yì nián, xīn de kāishǐ, xīwàng nǐ xīnnián [3:gāo gāo xìng xìng], yìshēng [3:kuài kuài lè lè], yí shì [3:píng píng ān ān].",
          "vi": "[2:Đối với] người Việt Nam, Tết là dịp lễ quan trọng nhất. [1:Để] tiễn cái cũ và chào đón cái mới, mọi người đều dọn dẹp phòng [3:sạch sẽ]. Bạn có hài lòng với thành quả của mình năm qua không? Một năm mới, một khởi đầu mới, mong bạn một năm mới [3:hân hoan], một đời [3:vui vẻ], [3:bình an]."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "为了",
          "np": "NP 8.1"
        },
        {
          "n": 2,
          "label": "对……来说",
          "np": "NP 8.2"
        },
        {
          "n": 3,
          "label": "干干净净",
          "np": "NP 8.3"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "送旧迎新 /sòng jiù yíng xīn/, âm Hán Việt là \"tống cựu nghênh tân\", mang nghĩa \"tiễn cái cũ, đón cái mới\"."
      }
    }
  ],
  "34": [
    {
      "title": "Chém gió song ngữ 1",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Cậu muốn một tình yêu như thế nào?"
        },
        {
          "who": "B",
          "zh": "Tớ muốn một [0:爱情] giống như ông nội và [0:奶奶] của tớ, bao nhiêu năm đã qua mà [0:感情] giữa hai người vẫn đẹp như thế. Có lúc, tớ cảm thấy ông bà [0:不是] những người già đã kết hôn hơn năm chục năm, [0:而是] giống như thanh niên vừa mới kết hôn thôi."
        },
        {
          "who": "A",
          "zh": "Có phải là [0:爷爷] cậu rất [0:关心] đến bà nội của cậu không?"
        },
        {
          "who": "B",
          "zh": "Đúng vậy. Ông thường hay [0:讲] cho tớ nghe chuyện về lần đầu tiên ông bà gặp nhau, lúc đó bà nội có mái [0:头发] dài đen tuyền, [0:个子] gầy gầy, [0:鼻子] thẳng và cao. Bà cất lời chào, ông nghe [0:声音] của bà là thích bà liền."
        }
      ]
    },
    {
      "title": "Chém gió song ngữ 2",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Hôm qua tớ tình cờ [0:遇到] Tiểu Bạch trên đường, bạn học cũ của chúng mình ấy, cậu còn [0:记得] không?"
        },
        {
          "who": "B",
          "zh": "Tiểu Bạch á? À, tớ nhớ [0:起来] rồi, bạn ấy là con gái nhà [0:邻居] sát vách với nhà tớ, hồi chúng mình mới từ cấp 2 lên [0:年级] 10, bạn ấy thầm thích cậu, chả [0:表白] với cậu hôm Valentine, còn chuẩn bị cả hoa và chocolate mà bị cậu [0:拒绝] thẳng thừng, đúng không?"
        },
        {
          "who": "A",
          "zh": "Đúng vậy. Còn nhớ lúc đó bạn ấy ngại quá nên [0:脸] đỏ ửng như cà chua chín, hai [0:耳朵] cũng đỏ hết cả. Lúc đấy bạn ấy còn [0:哭] rơm rớm nữa. Chuyện qua đã lâu mà đến lúc này [0:突然] nghĩ lại tớ vẫn còn cảm thấy có lỗi với bạn ấy."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 1",
      "lines": [
        {
          "who": "A",
          "zh": "你想要什么样的爱情？",
          "py": "Nǐ xiǎng yào shénme yàng de àiqíng?",
          "vi": "Cậu muốn một tình yêu như thế nào?"
        },
        {
          "who": "B",
          "zh": "我想要像我爷爷奶奶一样的爱情，这么多年来感情还是那么好。有时候，我觉得他们[1:不是]结婚五十多年的老人，[1:而是]像刚结婚的年轻人。",
          "py": "Wǒ xiǎng yào xiàng wǒ yéye nǎinai yíyàng de àiqíng, zhème duōnián lái gǎnqíng háishi nàme hǎo. Yǒu shíhou, wǒ juéde tāmen [1:búshì] jiéhūn wǔshí duō nián de lǎorén, [1:érshì] xiàng gāng jiéhūn de niánqīng rén.",
          "vi": "Tớ muốn một tình yêu giống như ông bà nội tớ, bao nhiêu năm nay tình cảm vẫn tốt đẹp như thế. Có lúc, tớ cảm thấy ông bà [1:không giống] như những người già đã kết hôn hơn năm chục năm, [1:mà giống] như thanh niên vừa mới kết hôn thôi."
        },
        {
          "who": "A",
          "zh": "你爷爷是不是很关心你奶奶？",
          "py": "Nǐ yéye shì búshì hěn guānxīn nǐ nǎinai?",
          "vi": "Có phải là ông cậu rất quan tâm đến bà cậu?"
        },
        {
          "who": "B",
          "zh": "对的。爷爷常跟我讲，第一次见面时，奶奶头发长长的，个子瘦瘦的，鼻子高高的。爷爷一听奶奶说话的声音就[2:喜欢上]她了。",
          "py": "Duì de. Yéye cháng gēn wǒ jiǎng, dì yī cì jiàn miàn shí, nǎinai tóufa cháng cháng de, gèzi shòu shòu de, bízi gāo gāo de. Yéye yì tīng nǎinai shuō huà de shēngyīn jiù [2:xǐhuan shàng] tā le.",
          "vi": "Đúng vậy. Ông thường hay kể với tớ, lần đầu tiên gặp nhau, tóc bà nội dài dài, vóc dáng gầy gầy, mũi cao cao. Ông nghe thấy giọng nói của bà là [2:thích] bà liền."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "不是……而是……",
          "np": "NP 9.1"
        },
        {
          "n": 2,
          "label": "喜欢上",
          "np": "NP 9.2"
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 2",
      "lines": [
        {
          "who": "A",
          "zh": "昨天我遇到了小白，你记得她吗？",
          "py": "Zuótiān wǒ yùdào le Xiǎo Bái, nǐ jìde tā ma?",
          "vi": "Hôm qua tớ tình cờ gặp Tiểu Bạch, cậu còn nhớ cô ấy không?"
        },
        {
          "who": "B",
          "zh": "小白？啊，我[3:想起来]了，她是我们邻居的女儿。咱们上高中一年级的时候，她向你表白，但是你拒绝了，对吧？",
          "py": "Xiǎo Bái? À, wǒ [3:xiǎng qǐlai] le, tā shì wǒmen línjū de nǚ'ér. Zánmen shàng gāozhōng yī niánjí de shíhou, tā xiàng nǐ biǎobái, dànshì nǐ jùjué le, duì ba?",
          "vi": "Tiểu Bạch á? À, tớ [3:nhớ ra] rồi, cô ấy là con gái hàng xóm của chúng ta, hồi chúng mình học lớp 10, cô ấy tỏ tình với cậu, nhưng mà cậu từ chối, đúng không?"
        },
        {
          "who": "A",
          "zh": "对。还记得那时她的脸和耳朵都[3:红了起来]，还哭了。现在[4:突然][3:想起来]还是觉得很对不起她。",
          "py": "Duì. Hái jìde nà shí tā de liǎn hé ěrduo dōu [3:hóng le qǐlai], hái kū le. Xiànzài [4:tūrán] [3:xiǎng qǐlai] háishi juéde hěn duìbuqǐ tā.",
          "vi": "Đúng vậy. Còn nhớ lúc đó mặt và tai cô ấy đều [3:đỏ ửng lên], cô ấy còn khóc nữa. Bây giờ [4:đột nhiên] [3:nghĩ lại] tớ vẫn cảm thấy có lỗi với cô ấy."
        }
      ],
      "legend": [
        {
          "n": 3,
          "label": "想起来",
          "np": "NP 9.3"
        },
        {
          "n": 4,
          "label": "突然",
          "np": "NP 9.4"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "高一 /gāo yī/ là cách nói gọn lại trong khẩu ngữ của 高中一年级 /gāozhōng yì niánjí/ - Năm thứ nhất bậc Trung học phổ thông, tương đương với lớp 10 trong hệ thống giáo dục phổ thông Việt Nam. Cách nói gọn này có thể áp dụng cho các bậc học khác, bằng cách nói [chữ đầu bậc học] + [năm học]. Ví dụ: 大二 /dà èr/ tức là Năm thứ hai Đại học."
      }
    }
  ],
  "35": [
    {
      "title": "Chém gió song ngữ 1",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Ngân hàng Phương [0:南] vừa gửi [0:电子邮件] đến hòm thư điện tử cho tớ, thông báo tớ đã qua phòng thi viết, rồi mời tớ đến tham gia [0:面试] trực tiếp. Tớ hơi hồi hộp."
        },
        {
          "who": "B",
          "zh": "Cơ hội tốt quá, ngân hàng đó rất [0:有名] trong giới ngân hàng. Cậu đừng [0:害怕], cậu giỏi mà."
        },
        {
          "who": "A",
          "zh": "Ôi [0:棒] gì chứ, cậu quá lời rồi, nhưng cảm ơn cậu nhé. Cậu tìm được việc chưa?"
        },
        {
          "who": "B",
          "zh": "Vẫn chưa. Công việc tớ thích thì bố mẹ không đồng ý cho tớ làm. Còn công việc mà bố mẹ dựa vào mối [0:关系] để tìm cho tớ thì lại không phải việc tớ thích, tớ không [0:愿意] nên từ chối luôn."
        },
        {
          "who": "A",
          "zh": "[0:靠] vào quan hệ để tìm việc là chuyện trước đây rồi. Tớ thì [0:认为], khi chọn việc trước hết phải [0:根据] trên cơ sở là hứng thú và sở thích của bản thân. Cậu [0:加油] nhé!"
        }
      ]
    },
    {
      "title": "Chém gió song ngữ 2",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Cậu sao đó, vừa nãy tớ hỏi sao cậu không [0:回答]?"
        },
        {
          "who": "B",
          "zh": "Xin lỗi, tớ đang [0:考虑] mấy vấn đề, đau cả đầu."
        },
        {
          "who": "A",
          "zh": "Là vấn đề công việc à?"
        },
        {
          "who": "B",
          "zh": "Ừ. Cả sáng chúng tớ vừa [0:开会] các phòng ban với [0:经理] điều hành công ty, [0:要求] mà giám đốc đưa ra ngày càng nhiều, chưa kịp [0:解决] xong việc cũ thì [0:事情] mới đã tới. Để [0:完成] công việc tháng này, chúng tớ phải thường xuyên [0:加班], 9-10 giờ tối mới từ công ty về."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 1",
      "lines": [
        {
          "who": "A",
          "zh": "南方银行给我发电子邮件，让我去面试。我有点儿紧张。",
          "py": "Nánfāng yínháng gěi wǒ fā diànzǐ yóujiàn, ràng wǒ qù miànshì. Wǒ yǒudiǎnr jǐnzhāng.",
          "vi": "Ngân hàng Phương Nam gửi email cho tớ, hẹn tớ đi phỏng vấn. Tớ hơi hồi hộp."
        },
        {
          "who": "B",
          "zh": "那么好的机会啊，那家银行很有名。你不用害怕，你很棒的。",
          "py": "Nàme hǎo de jīhuì a, nà jiā yínháng hěn yǒumíng. Nǐ búyòng hàipà, nǐ hěn bàng de.",
          "vi": "Cơ hội tốt quá, ngân hàng đó rất nổi tiếng. Cậu đừng sợ, cậu giỏi mà."
        },
        {
          "who": "A",
          "zh": "谢谢你。你找到工作了吗？",
          "py": "Xièxie nǐ. Nǐ zhǎodào gōngzuò le ma?",
          "vi": "Cảm ơn cậu, cậu tìm được việc chưa?"
        },
        {
          "who": "B",
          "zh": "还没呢。我喜欢的工作爸妈不同意让我做。爸妈靠关系帮我找的工作，我又不愿意做。",
          "py": "Hái méi ne. Wǒ xǐhuan de gōngzuò bà mā bù tóngyì ràng wǒ zuò. Bà mā kào guānxi bāng wǒ zhǎo de gōngzuò, wǒ yòu bú yuànyì zuò.",
          "vi": "Vẫn chưa. Công việc tớ thích thì bố mẹ không đồng ý cho tớ làm. Còn công việc mà bố mẹ dựa vào quan hệ để tìm cho tớ thì tớ lại không thích."
        },
        {
          "who": "A",
          "zh": "靠关系找工作是以前的事了。我[1:认为]要[2:根据]自己的兴趣爱好来选择工作。加油吧！",
          "py": "Kào guānxi zhǎo gōngzuò shì yǐqián de shì le. Wǒ [1:rènwéi] yào [2:gēnjù] zìjǐ de xìngqù àihào lái xuǎnzé gōngzuò. Jiāyóu ba!",
          "vi": "Dựa vào quan hệ để tìm việc là chuyện của trước đây rồi. Tớ [1:cho rằng] phải [2:dựa vào] hứng thú và sở thích của bản thân để chọn việc. Cố lên!"
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "认为",
          "np": "NP 10.1"
        },
        {
          "n": 2,
          "label": "根据",
          "np": "NP 10.2"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "你很棒的！/Nǐ hěn bàng de/ và 加油吧！/Jiāyóu ba/ là cách nói cổ vũ tinh thần, thường dịch tương ứng là \"Bạn rất giỏi\" và \"Cố lên\". 棒 /bàng/ là tính từ, thường dịch là \"khoẻ; vâm; đô (thể lực), giỏi; cao (trình độ), tốt; cao; cừ; xịn (thành tích)\". 加油 /jiā yóu/ là cụm động – tân, có nghĩa đen là \"thêm dầu; đổ xăng\"; khi dùng để cổ vũ ai đó, thường dịch là \"cố gắng\"."
      }
    },
    {
      "title": "Nói như người bản xứ 2 (在咖啡店 — Tại quán cà phê)",
      "lines": [
        {
          "who": "A",
          "zh": "你怎么了，刚才问你话，怎么不回答？",
          "py": "Nǐ zěnmele, gāngcái wèn nǐ huà, zěnme bù huídá?",
          "vi": "Cậu sao đó, vừa nãy tớ hỏi cậu sao cậu không trả lời?"
        },
        {
          "who": "B",
          "zh": "不好意思，我在考虑几个问题。",
          "py": "Bù hǎoyìsi, wǒ zài kǎolǜ jǐ gè wèntí.",
          "vi": "Xin lỗi, tớ đang suy nghĩ mấy vấn đề."
        },
        {
          "who": "A",
          "zh": "是工作的问题吗？",
          "py": "Shì gōngzuò de wèntí ma?",
          "vi": "Là vấn đề công việc à?"
        },
        {
          "who": "B",
          "zh": "是。我们刚跟经理开会，经理的要求越来越多了，还没把旧的问题解决好，经理又[3:把新的事情交给我们]了。为了完成这个月的工作，我们经常要加班。",
          "py": "Shì. Wǒmen gāng gēn jīnglǐ kāihuì, jīnglǐ de yāoqiú yuè lái yuè duō le, hái méi bǎ jiù de wèntí jiějué hǎo, jīnglǐ yòu [3:bǎ xīn de shìqing jiāo gěi wǒmen] le. Wèile wánchéng zhè ge yuè de gōngzuò, wǒmen jīngcháng yào jiā bān.",
          "vi": "Ừ. Chúng tớ vừa họp với giám đốc, yêu cầu của giám đốc ngày càng nhiều, chưa kịp giải quyết việc cũ thì giám đốc lại [3:giao thêm việc mới cho chúng tớ]. Để hoàn thành công việc tháng này, chúng tớ phải thường xuyên tăng ca."
        }
      ],
      "legend": [
        {
          "n": 3,
          "label": "把 (3)",
          "np": "NP 10.3"
        }
      ]
    }
  ],
  "36": [
    {
      "title": "Chém gió song ngữ 1",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Gần đây làm dự án, [0:压力] mà công việc tạo ra lớn quá, [0:终于] cũng có thời gian rảnh xả hơi rồi, tớ muốn [0:请假] mấy ngày phép đi du lịch."
        },
        {
          "who": "B",
          "zh": "Đi Vân Nam đi. Cậu xem này, đây là [0:照片] bạn tớ chụp ở [0:云南] này. Nghe nói [0:空气] ở đó trong lành, thích lắm."
        },
        {
          "who": "A",
          "zh": "Hay quá, đến Vân Nam chúng mình nhất định [0:必须] đi leo núi, [0:站] trên đỉnh cao, phóng tầm mắt ra xa, chắc chắn là thích lắm."
        },
        {
          "who": "B",
          "zh": "[0:千万] không được quên mang theo máy ảnh nhé, trên đường đi mình có thể vừa ngắm cảnh vừa chụp ảnh."
        },
        {
          "who": "A",
          "zh": "Vậy chiều nay tớ đến nhà anh trai tớ [0:借] máy ảnh về mình mang đi."
        }
      ]
    },
    {
      "title": "Chém gió song ngữ 2",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Cậu có hiểu biết về lịch sử và [0:文化] Trung Quốc không?"
        },
        {
          "who": "B",
          "zh": "Tớ có [0:了解] một chút. Lúc nhỏ, bố có [0:影响] đến tớ, nên tớ rất hứng thú với [0:历史] văn hóa Trung Quốc."
        },
        {
          "who": "A",
          "zh": "Vậy cậu có biết Tứ hợp viện của Thủ đô [0:北京] không?"
        },
        {
          "who": "B",
          "zh": "Biết chứ. Bố hay kể cho tớ các [0:故事] về Tứ hợp viện. Tứ hợp viện nói một cách [0:简单] dễ hiểu và ngắn gọn là: Ở [0:中间] có một cái sân, bốn phía là phòng ở. Ngoài Trung Quốc, những [0:地方] khác trên khắp [0:世界] đều không có Tứ hợp viện."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 1",
      "lines": [
        {
          "who": "A",
          "zh": "最近工作压力太大，[1:终于]有空儿了，我想请几天假去旅游。",
          "py": "Zuìjìn gōngzuò yālì tài dà, [1:zhōngyú] yǒu kòngr le, wǒ xiǎng qǐng jǐ tiān jià qù lǚyóu.",
          "vi": "Gần đây áp lực công việc lớn quá, [1:cuối cùng] cũng có thời gian rảnh rồi, tớ muốn xin nghỉ mấy ngày phép đi du lịch."
        },
        {
          "who": "B",
          "zh": "去云南吧。你看，这是云南的照片。听说那儿的空气很好。",
          "py": "Qù Yúnnán ba. Nǐ kàn, zhè shì Yúnnán de zhàopiàn. Tīng shuō nàr de kōngqì hěn hǎo.",
          "vi": "Đi Vân Nam đi. Cậu xem này, đây là ảnh chụp Vân Nam. Nghe nói không khí ở đó rất tốt."
        },
        {
          "who": "A",
          "zh": "好啊。到了云南我们还[2:必须]去爬山，站得高，看得远，一定很舒服。",
          "py": "Hǎo a. Dào le Yúnnán wǒmen hái [2:bìxū] qù páshān, zhàn de gāo, kàn de yuǎn, yídìng hěn shūfu.",
          "vi": "Hay quá, đến Vân Nam chúng mình nhất định [2:phải] đi leo núi, đứng trên cao, nhìn ra xa, chắc chắn là thích lắm."
        },
        {
          "who": "B",
          "zh": "[3:千万]不要忘了带上照相机，路上可以一边看一边照相。",
          "py": "[3:Qiānwàn] búyào wàngle dài shàng zhàoxiàngjī, lùshang kěyǐ yìbiān kàn yìbiān zhàoxiàng.",
          "vi": "[3:Nhất định] không được quên mang theo máy ảnh nhé, trên đường đi mình có thể vừa ngắm cảnh vừa chụp ảnh."
        },
        {
          "who": "A",
          "zh": "那下午我就去哥哥家把照相机借回来。",
          "py": "Nà xiàwǔ wǒ jiù qù gēge jiā bǎ zhàoxiàngjī jiè huílai.",
          "vi": "Vậy chiều nay tớ đến nhà anh trai tớ mượn máy ảnh về."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "终于",
          "np": "NP 11.1"
        },
        {
          "n": 2,
          "label": "必须",
          "np": "NP 11.2"
        },
        {
          "n": 3,
          "label": "千万",
          "np": "NP 11.3"
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 2",
      "lines": [
        {
          "who": "A",
          "zh": "你了解中国的历史文化吗？",
          "py": "Nǐ liǎojiě Zhōngguó de lìshǐ wénhuà ma?",
          "vi": "Cậu có hiểu biết về lịch sử văn hóa Trung Quốc không?"
        },
        {
          "who": "B",
          "zh": "我了解一点儿。小时候，[4:在爸爸的影响下]，我对历史和文化都很感兴趣。",
          "py": "Wǒ liǎojiě yìdiǎnr. Xiǎoshíhou, [4:zài bàba de yǐngxiǎng xià], wǒ duì lìshǐ hé wénhuà dōu hěn gǎn xìngqù.",
          "vi": "Tớ có hiểu biết một chút. Lúc nhỏ, [4:bố có ảnh hưởng đến tớ], nên tớ rất hứng thú với lịch sử văn hóa Trung Quốc."
        },
        {
          "who": "A",
          "zh": "那你知道北京四合院吗？",
          "py": "Nà nǐ zhīdào Běijīng sìhéyuàn ma?",
          "vi": "Vậy cậu có biết Tứ hợp viện Bắc Kinh không?"
        },
        {
          "who": "B",
          "zh": "知道。爸爸常给我讲四合院的故事。简单地说就是：院子在中间，四面有房子。除了北京，世界上别的地方都没有四合院。",
          "py": "Zhīdào. Bàba cháng gěi wǒ jiǎng sìhéyuàn de gùshi. Jiǎndān de shuō jiùshì: Yuànzi zài zhōngjiān, sìmiàn yǒu fángzi. Chúle Běijīng, shìjiè shàng bié de dìfang dōu méiyǒu sìhéyuàn.",
          "vi": "Biết. Bố hay kể cho tớ các câu chuyện về Tứ hợp viện. Nói một cách đơn giản là: Ở giữa có một cái sân, bốn phía là phòng ở. Ngoài Bắc Kinh, những nơi khác trên thế giới đều không có Tứ hợp viện."
        }
      ],
      "legend": [
        {
          "n": 4,
          "label": "在……下",
          "np": "NP 11.4"
        }
      ]
    }
  ],
  "37": [
    {
      "title": "Chém gió song ngữ 1",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Bác tài, tôi muốn đến cửa phía [0:东] mặt trời mọc của bến [0:地铁] dưới lòng đất."
        },
        {
          "who": "B",
          "zh": "Được, cậu lên xe đi, từ đây đến đó chắc mất [0:大约] 20 phút [0:左右] là cùng."
        },
        {
          "who": "A",
          "zh": "Xin hỏi bao nhiêu tiền? Tôi chưa đổi tiền nên không có [0:现金], có thể thanh toán qua Wechat hoặc quẹt [0:卡] tín dụng không?"
        },
        {
          "who": "B",
          "zh": "Quét [0:微信] hay [0:刷] thẻ [0:信用] đều được."
        }
      ]
    },
    {
      "title": "Chém gió song ngữ 2",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "[0:师傅] lái taxi ơi, cháu nghe nói ở đây có phố ẩm thực mà ở đó cả một con [0:街道] bán toàn [0:小吃] như đồ nướng, sủi cảo, đặc sản của vùng, chú biết không ạ?"
        },
        {
          "who": "B",
          "zh": "Chú là [0:司机], ngày ngày bon bon trên đường, đương nhiên là biết. Cháu lên xe đi, chú để đồ lên xe cho."
        },
        {
          "who": "A",
          "zh": "Hành lý của cháu [0:比较] nặng, chú [0:注意] kẻo rơi vào [0:脚] chú là đau lắm đấy ạ. Ối, cháu [0:迟到] rồi, chú nhanh lên giúp cháu được không ạ?"
        },
        {
          "who": "B",
          "zh": "Đừng lo, đợi chú tra [0:地图] tìm đường ngắn nhất đã nhé."
        },
        {
          "who": "A",
          "zh": "Dạ cảm ơn chú ạ, ngoài các món ăn, ở đây còn có cái gì [0:其他] nổi tiếng nữa không ạ?"
        },
        {
          "who": "B",
          "zh": "Có chứ, đã đến đây nhất định phải đi xem gấu trúc."
        },
        {
          "who": "A",
          "zh": "Ôi cháu thích [0:熊猫] lắm, trước giờ mới chỉ xem trên tivi, chưa từng [0:亲眼] nhìn ngắm một [0:只] gấu trúc nào."
        },
        {
          "who": "B",
          "zh": "Trăm [0:闻] không bằng một thấy, chú đưa cháu đi."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 1",
      "lines": [
        {
          "who": "A",
          "zh": "师傅，我要去地铁站东门。",
          "py": "Shīfu, wǒ yào qù dìtiě zhàn dōng mén.",
          "vi": "Bác tài ơi, cháu muốn đến cổng phía Đông bến tàu điện ngầm."
        },
        {
          "who": "B",
          "zh": "好的，你上车吧，[1:大约]20分钟[1:左右]就到了。",
          "py": "Hǎo de, nǐ shàng chē ba, [1:dàyuē] 20 fēnzhōng [1:zuǒyòu] jiù dào le.",
          "vi": "Ừ, cháu lên xe đi, [1:khoảng] 20 phút là đến."
        },
        {
          "who": "A",
          "zh": "请问多少钱？我没有现金，可以刷卡吗？",
          "py": "Qǐngwèn duōshao qián? Wǒ méiyǒu xiànjīn, kěyǐ shuākǎ ma?",
          "vi": "Xin hỏi bác bao nhiêu tiền ạ? Cháu không có tiền mặt, có thể quẹt thẻ không ạ?"
        },
        {
          "who": "B",
          "zh": "扫微信或者刷信用卡都没问题。",
          "py": "Sǎo Wēixìn huòzhě shuā xìnyòngkǎ dōu méi wèntí.",
          "vi": "Quét mã Wechat hoặc là quẹt thẻ tín dụng đều không thành vấn đề."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "大约 / 左右",
          "np": "NP 12.1"
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 2",
      "lines": [
        {
          "who": "A",
          "zh": "师傅，听说这儿有一条卖小吃的街道，您知道吗？",
          "py": "Shīfu, tīng shuō zhèr yǒu yì tiáo mài xiǎochī de jiēdào, nín zhīdào ma?",
          "vi": "Bác tài ơi, nghe nói ở đây có một con phố bán đồ ăn vặt, bác có biết không?"
        },
        {
          "who": "B",
          "zh": "我是司机，当然知道。你上车吧，我帮你把行李箱搬上来。",
          "py": "Wǒ shì sījī, dāngrán zhīdào. Nǐ shàng chē ba, wǒ bāng nǐ bǎ xínglǐ xiāng bān shànglai.",
          "vi": "Bác là tài xế, đương nhiên là biết rồi. Cháu lên xe đi, để bác chuyển vali lên xe."
        },
        {
          "who": "A",
          "zh": "我的行李箱比较大，请注意您的脚。我快要迟到了，您可以快一点儿吗？",
          "py": "Wǒ de xínglǐ xiāng bǐjiào dà, qǐng zhùyì nín de jiǎo. Wǒ kuàiyào chídào le, nín kěyǐ kuài yìdiǎnr ma?",
          "vi": "Vali của cháu hơi to, bác chú ý kẻo va vào chân nha. Cháu sắp muộn rồi, bác có thể nhanh hơn một chút không?"
        },
        {
          "who": "B",
          "zh": "别着急，等我查地图找最短的路。",
          "py": "Bié zháojí, děng wǒ chá dìtú zhǎo zuìduǎn de lù.",
          "vi": "Đừng lo lắng, đợi bác tra bản đồ tìm đường nào ngắn nhất."
        },
        {
          "who": "A",
          "zh": "谢谢师傅，除了吃的，还有其他有名的东西吗？",
          "py": "Xièxie shīfu. Chúle chī de, hái yǒu qítā yǒumíng de dōngxi ma?",
          "vi": "Cảm ơn bác, ở đây ngoài đồ ăn ngon ra thì còn thứ gì nổi tiếng khác không bác?"
        },
        {
          "who": "B",
          "zh": "有啊，到这儿来必须去看我们的动物，[2:比如]说熊猫。",
          "py": "Yǒu a, dào zhèr lái bìxū qù kàn wǒmen de dòngwù, [2:bǐrú] shuō xióngmāo.",
          "vi": "Có chứ, đến đây cháu nhất định phải đi xem các loài động vật, [2:ví dụ] như gấu trúc."
        },
        {
          "who": "A",
          "zh": "我对熊猫很感兴趣，但[3:从来]没亲眼见到，只在电视上看到过。",
          "py": "Wǒ duì xióngmāo hěn gǎn xìngqù, dàn [3:cónglái] méi qīnyǎn jiàn dào, zhǐ zài diànshì shàng kàn dàoguo.",
          "vi": "Cháu rất có hứng thú với gấu trúc, nhưng [3:trước giờ] cháu chưa từng nhìn tận mắt, cháu chỉ nhìn qua trên tivi thôi."
        },
        {
          "who": "B",
          "zh": "百闻不如一见，我带你去。",
          "py": "Bǎi wén bùrú yí jiàn, wǒ dài nǐ qù.",
          "vi": "Trăm nghe không bằng một thấy, để bác đưa cháu đi."
        }
      ],
      "legend": [
        {
          "n": 2,
          "label": "比如",
          "np": "NP 12.2"
        },
        {
          "n": 3,
          "label": "从来",
          "np": "NP 12.3"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "百闻不如一见 /bǎi wén bùrú yí jiàn/, thành ngữ, thường dịch là \"Trăm nghe không bằng một thấy\"."
      }
    }
  ],
  "38": [
    {
      "title": "Chém gió song ngữ 1",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Chuyện [0:奇怪] như [0:太阳] mọc từ phía [0:西] thế này, sao bạn tôi đột nhiên lại quan tâm đến [0:体育] thể thao vậy?"
        },
        {
          "who": "B",
          "zh": "Bạn trai tớ thích chạy bộ, tớ [0:几乎] bị anh ấy ảnh hưởng rồi. Cậu xem [0:新闻] Thời sự trên tivi hôm qua chưa? Bản tin cũng [0:提] đến [0:比赛] chạy bộ của trường, bạn trai tớ cũng tham gia đấy."
        },
        {
          "who": "A",
          "zh": "Thế [0:后来] kết quả thế nào?"
        },
        {
          "who": "B",
          "zh": "Mặc dù cuộc thi này anh ấy chỉ [0:获得] huy chương Đồng, nhưng mà [0:最后] đến lúc trao thưởng vẫn nhận được món quà lớn từ thầy [0:校长] đó."
        }
      ]
    },
    {
      "title": "Chém gió song ngữ 2",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Tớ thích môn Lịch sử, [0:文学], không thích môn Toán. Tớ cảm thấy [0:数学] khó hơn Lịch sử và Văn học nhiều. [0:题] Toán kiểm tra học kỳ lần này tớ dám [0:肯定] là rất khó, chỉ sợ tớ lại thi không tốt."
        },
        {
          "who": "B",
          "zh": "Cậu mang [0:笔记本] ra đây ghi chép đi, tớ có thể [0:教] cậu cách giải. Mỗi ngày học một hai tiếng, thành tích của cậu sẽ được nâng cao."
        },
        {
          "who": "A",
          "zh": "[0:教室] có sẵn bàn ghế và bảng, nhưng không yên tĩnh bằng thư viện, chúng mình đi [0:图书馆] học đi."
        },
        {
          "who": "B",
          "zh": "Ừ. Trước khi ra khỏi phòng thì nhớ tắt [0:灯] đi."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 1",
      "lines": [
        {
          "who": "A",
          "zh": "奇怪，今天太阳从西边出来了吗？你怎么突然关心起体育来了？",
          "py": "Qíguài, jīntiān tàiyáng cóng xībian chūlaile ma? Nǐ zěnme tūrán guānxīn qǐ tǐyù láile?",
          "vi": "Kỳ lạ, hôm nay mặt trời mọc từ đằng Tây hay sao? Cậu sao đột nhiên lại quan tâm đến thể dục thể thao vậy?"
        },
        {
          "who": "B",
          "zh": "我的男朋友喜欢跑步，我[1:几乎]被他影响了。你看昨天的新闻了吗？新闻上也提到学校跑步比赛，我的男朋友也参加了。",
          "py": "Wǒ de nán péngyou xǐhuan pǎobù, wǒ [1:jīhū] bèi tā yǐngxiǎngle. Nǐ kàn zuótiān de xīnwénle ma? Xīnwén shàng yě tí dào xuéxiào pǎobù bǐsài, wǒ de nán péngyou yě cānjiāle.",
          "vi": "Bạn trai tớ thích chạy bộ, tớ [1:dường như] bị anh ấy ảnh hưởng rồi. Cậu xem tin tức hôm qua chưa? Trên tin tức cũng để cập đến cuộc thi chạy bộ của trường, bạn trai tớ cũng tham gia."
        },
        {
          "who": "A",
          "zh": "[2:后来]成绩怎么样呢？",
          "py": "[2:Hòulái] chéngjì zěnmeyàng ne?",
          "vi": "[2:Sau đó] kết quả thế nào?"
        },
        {
          "who": "B",
          "zh": "虽然这次比赛他只获得了第三名，但是[3:最后]还拿到了校长的大礼物呢。",
          "py": "Suīrán zhè cì bǐsài tā zhǐ huòdéle dì sān míng, dànshì [3:zuìhòu] hái ná dào le xiàozhǎng de dà lǐwù ne.",
          "vi": "Mặc dù cuộc thi lần này anh ấy chỉ đạt được vị trí thứ 3, nhưng mà [3:cuối cùng] vẫn nhận được món quà lớn của hiệu trưởng đó."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "几乎",
          "np": "NP 13.1"
        },
        {
          "n": 2,
          "label": "后来",
          "np": "NP 13.2"
        },
        {
          "n": 3,
          "label": "最后",
          "np": "NP 13.3"
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 2",
      "lines": [
        {
          "who": "A",
          "zh": "我喜欢历史课，文学课，不喜欢数学课。我觉得数学比历史难多了。这次数学考试题[4:肯定]很难，恐怕我又考得不怎么样。",
          "py": "Wǒ xǐhuan lìshǐ kè, wénxué kè, bù xǐhuan shùxué kè. Wǒ juéde shùxué bǐ lìshǐ nán duō le. Zhè cì shùxué kǎoshì tí [4:kěndìng] hěn nán, kǒngpà wǒ yòu kǎo de bù zěnmeyàng.",
          "vi": "Tớ thích môn Lịch sử, Văn học, không thích môn Toán học. Tớ cảm thấy Toán khó hơn Lịch sử nhiều. Lần thi Toán này đề [4:chắc chắn] là rất khó, chỉ sợ tớ lại thi không ra làm sao."
        },
        {
          "who": "B",
          "zh": "你把笔记本拿出来，我可以教你。每天学一两个小时，你成绩就提高了。",
          "py": "Nǐ bǎ bǐjìběn ná chūlai, wǒ kěyǐ jiāo nǐ. Měitiān xué yì liǎng gè xiǎoshí, nǐ chéngjì jiù tígāole.",
          "vi": "Cậu cầm sổ tay ra đây, tớ có thể dạy cậu. Mỗi ngày học một hai tiếng, thành tích của cậu sẽ được nâng cao."
        },
        {
          "who": "A",
          "zh": "教室没有图书馆安静，我们去图书馆学吧。",
          "py": "Jiàoshì méiyǒu túshū guǎn ānjìng, wǒmen qù túshūguǎn xué ba.",
          "vi": "Phòng học không yên tĩnh bằng thư viện, chúng mình đi thư viện học đi."
        },
        {
          "who": "B",
          "zh": "好的。离开教室前记得把灯关了。",
          "py": "Hǎo de. Líkāi jiàoshì qián jìde bǎ dēng guān le.",
          "vi": "Ừ. Trước khi ra khỏi phòng học thì nhớ tắt đèn đi."
        }
      ],
      "legend": [
        {
          "n": 4,
          "label": "肯定",
          "np": "NP 13.4"
        }
      ]
    }
  ],
  "39": [
    {
      "title": "Chém gió song ngữ 1",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Tớ gần đây hay bị mỏi mắt, tình trạng ngày một [0:厉害], có tình trạng này [0:估计] là vì tớ [0:使用] điện thoại và máy tính trong thời gian dài rồi."
        },
        {
          "who": "B",
          "zh": "[0:也许] vậy đấy. Mắt cứ [0:对看] với điện thoại, máy tính trong thời gian dài [0:不仅] không tốt cho mắt, [0:而且] làm cơ thể mệt mỏi. Mau [0:安排] thời gian đi bệnh viện [0:检查] mắt đi."
        },
        {
          "who": "A",
          "zh": "Được, đi khám bác sỹ trước, uống ít thuốc, mong là thuốc đắng bệnh [0:除]."
        },
        {
          "who": "B",
          "zh": "Còn nữa, khi làm việc, cứ mỗi 20 phút phải đứng lên, nhìn về [0:处] xa, [0:尤其] là nhìn nhiều những loài [0:植物] trong vườn màu [0:绿] mát mắt."
        }
      ]
    },
    {
      "title": "Chém gió song ngữ 2",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Khó khăn lắm mới leo được lên đến [0:层] 8 của tòa nhà, được rồi nhỉ?"
        },
        {
          "who": "B",
          "zh": "Chưa được, phải leo lên đến tầng 14, như vậy việc giảm béo mới có [0:效果]."
        },
        {
          "who": "A",
          "zh": "Á, nhưng giờ tớ không còn chút [0:力气] nào, sắp không đi nổi nữa rồi."
        },
        {
          "who": "B",
          "zh": "Nếu muốn [0:减肥], cậu phải [0:坚持] tiếp!"
        },
        {
          "who": "A",
          "zh": "Thực ra sức khỏe mới quan trọng, béo gầy đâu có sao. [0:再说], rèn luyện sức khỏe phải căn cứ vào tình trạng sức khỏe của bản thân chứ."
        },
        {
          "who": "B",
          "zh": "Thế được, chúng ta nghỉ ngơi chút vậy."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 1",
      "lines": [
        {
          "who": "A",
          "zh": "最近我眼睛红得越来越厉害了，[1:估计]是因为我长时间使用手机和电脑。",
          "py": "Zuìjìn wǒ yǎnjing hóng de yuè lái yuè lìhai le, [1:gūjì] shì yīnwèi wǒ cháng shíjiān shǐyòng shǒujī hé diànnǎo.",
          "vi": "Mắt tớ gần đây đỏ ngày càng nặng, [1:xem chừng] là vì tớ sử dụng điện thoại và máy tính thời gian dài."
        },
        {
          "who": "B",
          "zh": "也许吧。长时间看手机、电脑[2:不仅]对眼睛不好，[2:而且]身体也会累极了。快安排时间去医院检查吧。",
          "py": "Yěxǔ ba. Cháng shíjiān kàn shǒujī, diànnǎo [2:bùjǐn] duì yǎnjing bù hǎo, [2:érqiě] shēntǐ yě huì lèi jíle. Kuài ānpái shíjiān qù yīyuàn jiǎnchá ba.",
          "vi": "Có lẽ vậy đấy. Nhìn điện thoại, máy tính trong thời gian dài [2:không chỉ] không tốt cho mắt, [2:mà còn] làm cơ thể mệt mỏi. Mau sắp xếp thời gian đi bệnh viện kiểm tra đi."
        },
        {
          "who": "A",
          "zh": "好的，先去看医生，吃点儿药。希望药到病除。",
          "py": "Hǎo de, xiān qù kàn yīshēng, chī diǎnr yào. Xīwàng yào dào bìng chú.",
          "vi": "Được, đi khám bác sỹ trước, uống ít thuốc. Mong là thuốc đắng dã tật."
        },
        {
          "who": "B",
          "zh": "还有。工作时，每20分钟要站起来，向远处看，[3:尤其]是多看绿色的植物。",
          "py": "Hái yǒu. Gōngzuò shí, měi èrshí fēnzhōng yào zhàn qǐlai, xiàng yuǎn chù kàn, [3:yóuqí] shì duō kàn lǜsè de zhíwù.",
          "vi": "Còn nữa, khi làm việc, cứ mỗi 20 phút phải đứng lên, nhìn về phía xa, [3:nhất là] nhìn nhiều những loài thực vật màu xanh."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "估计",
          "np": "NP 14.1"
        },
        {
          "n": 2,
          "label": "不仅",
          "np": "NP 14.2"
        },
        {
          "n": 3,
          "label": "尤其",
          "np": "NP 14.3"
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 2",
      "lines": [
        {
          "who": "A",
          "zh": "好不容易才爬到第八层，可以了吧？",
          "py": "Hǎobù róngyì cái pá dào dì bā céng, kěyǐle ba?",
          "vi": "Khó khăn lắm mới leo được lên đến tầng 8, được rồi chứ?"
        },
        {
          "who": "B",
          "zh": "不行，要爬到第十四层，这样才有效果。",
          "py": "Bùxíng, yào pá dào dì shísì céng, zhèyàng cái yǒu xiàoguǒ.",
          "vi": "Chưa được, phải leo lên đến tầng 14, như vậy mới có hiệu quả."
        },
        {
          "who": "A",
          "zh": "啊，可是我现在就没力气了，快走不动了。",
          "py": "A, kěshì wǒ xiànzài jiù méi lìqi le, kuài zǒu bú dòng le.",
          "vi": "Á, nhưng giờ tớ không có chút sức lực nào, sắp không đi nổi nữa rồi."
        },
        {
          "who": "B",
          "zh": "如果想减肥，你就要坚持下去！",
          "py": "Rúguǒ xiǎng jiǎnféi, nǐ jiù yào jiānchí xiàqu!",
          "vi": "Nếu muốn giảm béo, cậu phải kiên trì tiếp!"
        },
        {
          "who": "A",
          "zh": "其实健康最重要，胖瘦没关系。[4:再说]，锻炼身体必须要根据自己的健康情况啊。",
          "py": "Qíshí jiànkāng zuì zhòngyào, pàng shòu méiguānxi. [4:Zàishuō], duànliàn shēntǐ bìxū yào gēnjù zìjǐ de jiànkāng qíngkuàng a.",
          "vi": "Thực ra sức khỏe mới quan trọng, béo gầy đâu có sao. [4:Hơn nữa], rèn luyện sức khỏe phải căn cứ vào tình trạng sức khỏe của bản thân chứ."
        },
        {
          "who": "B",
          "zh": "那好，我们休息一下吧。",
          "py": "Nà hǎo, wǒmen xiūxi yíxià ba.",
          "vi": "Thế được, chúng ta nghỉ ngơi chút vậy."
        }
      ],
      "legend": [
        {
          "n": 4,
          "label": "再说",
          "np": "NP 14.4"
        }
      ]
    }
  ],
  "40": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Chào anh, chào mừng anh đến tham gia buổi phỏng vấn hôm nay, xin mời anh tự giới thiệu về mình."
        },
        {
          "who": "B",
          "zh": "Chào anh, tôi họ Lí, tên Lí Tiểu Bạch, tôi đã hoàn thành chương trình cử nhân và [0:毕业] từ trường Đại học [0:经济] Quốc dân, [0:专业] học tại trường là Kinh tế Quốc tế. Tôi có ba năm [0:经验] làm việc [0:实际] trong môi trường công ty. Biết quý công ty đang có nhu cầu [0:招聘] nhân sự, tôi liền nộp đơn để [0:应聘]."
        },
        {
          "who": "A",
          "zh": "Anh cho rằng anh là một người như thế nào?"
        },
        {
          "who": "B",
          "zh": "Tôi là một người chăm chỉ, [0:主动] làm việc không để bị nhắc nhở, nhưng [0:缺点] là yêu cầu đối với bản thân rất cao. Trong công việc, tôi coi trọng [0:结果] cuối cùng, không quá [0:重视] quá trình thực hiện."
        },
        {
          "who": "A",
          "zh": "Kinh nghiệm làm việc của anh có [0:好处] gì cho công ty của chúng tôi?"
        },
        {
          "who": "B",
          "zh": "Như đã nói, tôi đã có 3 năm kinh nghiệm làm việc. [0:本来] tôi làm việc tại công ty A, [0:当] vị trí nhân viên [0:研究] thị trường. [0:经过] nhiều năm làm việc ở phòng [0:市场] của họ, bây giờ tôi rất [0:熟悉] thị trường Hà Nội. Nếu công ty có yêu cầu, tôi cũng sẵn sàng làm thêm giờ và đi [0:出差] các tỉnh xa."
        },
        {
          "who": "A",
          "zh": "Rất tốt, nếu anh không còn thắc mắc gì [0:关于] công việc này nữa, chúng ta dừng ở đây nhé. Có kết quả chúng tôi sẽ [0:通知] ngay tới anh."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "A",
          "zh": "你好，欢迎参加今天的面试，请自我介绍一下。",
          "py": "Nǐ hǎo, huānyíng cānjiā jīntiān de miànshì, qǐng zìwǒ jièshào yíxià.",
          "vi": "Chào bạn, chào mừng bạn đến tham gia buổi phỏng vấn hôm nay, xin mời bạn tự giới thiệu về mình."
        },
        {
          "who": "B",
          "zh": "您好！我姓李，叫李小白。我是从经济大学毕业的，学国际经济专业。我有三年工作经验了。知道贵公司在招聘，我就马上来应聘的。",
          "py": "Nín hǎo! Wǒ xìng Lǐ, jiào Lǐ Xiǎobái. Wǒ shì cóng jīngjì dàxué bì yè de, xué guójì jīngjì zhuānyè. Wǒ yǒu sān nián gōngzuò jīngyàn le. Zhīdào guì gōngsī zài zhāopìn, wǒ jiù mǎshàng lái yìngpìn de.",
          "vi": "Chào anh, tôi họ Lý, tên Lý Tiểu Bạch, tôi tốt nghiệp trường Đại học Kinh tế, chuyên ngành Kinh tế Quốc tế. Tôi có ba năm kinh nghiệm làm việc thực tế. Biết quý công ty đang tuyển dụng, tôi liền đến ứng tuyển."
        },
        {
          "who": "A",
          "zh": "你自己认为你是怎么样的人？",
          "py": "Nǐ zìjǐ rènwéi nǐ shì zěnmeyàng de rén?",
          "vi": "Bạn cho rằng bạn là một người như thế nào?"
        },
        {
          "who": "B",
          "zh": "我是一个认真、主动工作的人，但缺点是对自己要求太高。[1:在工作上]，我最重视工作的结果。",
          "py": "Wǒ shì yí ge rènzhēn, zhǔdòng gōngzuò de rén, dàn quēdiǎn shì duì zìjǐ yāoqiú tài gāo. [1:Zài gōngzuò shang], wǒ zuì zhòngshì gōngzuò de jiéguǒ.",
          "vi": "Tôi là một người chăm chỉ, chủ động làm việc, nhưng khuyết điểm là yêu cầu đối với bản thân rất cao. [1:Về phương diện công việc], tôi rất coi trọng kết quả công việc."
        },
        {
          "who": "A",
          "zh": "你的工作经验对公司有什么好处？",
          "py": "Nǐ de gōngzuò jīngyàn duì gōngsī yǒu shén me hǎochù?",
          "vi": "Kinh nghiệm làm việc của bạn có lợi gì cho công ty của chúng tôi?"
        },
        {
          "who": "B",
          "zh": "我[2:本来]在A公司当研究员。经过多年在市场部工作，我现在对河内市场很熟悉。[3:要是]公司要求，我也愿意加班和出差。",
          "py": "Wǒ [2:běnlái] zài A gōngsī dāng yánjiūyuán. Jīngguò duōnián zài shìchǎngbù gōngzuò, wǒ xiànzài duì Hénèi shìchǎng hěn shúxī. [3:Yàoshi] gōngsī yāoqiú, wǒ yě yuànyì jiābān hé chūchāi.",
          "vi": "Tôi [2:trước đây] làm nhân viên nghiên cứu cho công ty A. Qua nhiều năm làm việc ở phòng thị trường, bây giờ tôi rất quen thuộc thị trường Hà Nội. [3:Nếu] công ty có yêu cầu, tôi cũng sẵn sàng làm thêm giờ và đi công tác."
        },
        {
          "who": "A",
          "zh": "好的。[4:关于]这份工作，如果没有别的问题，面试就到这儿吧。有结果再通知你。",
          "py": "Hǎo de. [4:Guānyú] zhè fèn gōngzuò, rúguǒ méiyǒu bié de wèntí, miànshì jiù dào zhèr ba. Yǒu jiéguǒ zài tōngzhī nǐ.",
          "vi": "Rất tốt, [4:về] công việc này, nếu không còn vấn đề gì nữa, cuộc phỏng vấn sẽ kết thúc tại đây. Có kết quả chúng tôi sẽ thông báo cho bạn."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "在…上",
          "np": "NP 15.1"
        },
        {
          "n": 2,
          "label": "本来",
          "np": "NP 15.2"
        },
        {
          "n": 3,
          "label": "要是",
          "np": "NP 15.3"
        },
        {
          "n": 4,
          "label": "关于",
          "np": "NP 15.4"
        }
      ]
    }
  ],
  "41": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Anh ơi, kết quả phỏng vấn đã có, ngày mai em có thể [0:正式] trở thành nhân viên công ty rồi. Vui quá! Mặc dù em mới ra trường, còn [0:缺少] kinh nghiệm, nhưng giám đốc nhất định là có [0:印象] tốt về em. Thật không ngờ tìm việc lại [0:顺利] như vậy."
        },
        {
          "who": "B",
          "zh": "Tốt quá, anh [0:祝贺] em nhé! Anh biết cảm xúc bây giờ em đang rất [0:兴奋] vì đã vào được công ty yêu thích, nhưng hãy [0:记住] điều này trong đầu, rằng đây mới chỉ là [0:步] đầu tiên trên con đường đi tới thành công, em sẽ phải cố gắng hơn nữa trong tương lai."
        },
        {
          "who": "A",
          "zh": "Lại thế rồi đấy, em còn chưa vui được đến 60 [0:秒] để làm tròn thành 1 phút, anh thật là."
        },
        {
          "who": "B",
          "zh": "Em biết không, hồi bằng tuổi em, [0:原来] anh cũng cứ [0:以为] rằng công việc rất dễ dàng, nhưng sau đó anh mới nhận ra rằng [0:并不] dễ dàng như mình nghĩ. Kinh nghiệm có thể dần dần [0:积累], nhưng [0:态度] quan trọng hơn [0:能力], phải nhớ lấy. Bây giờ [0:赚] tiền ngày càng khó."
        },
        {
          "who": "A",
          "zh": "Em đã [0:明白] rồi ạ."
        },
        {
          "who": "B",
          "zh": "Ngày đầu tiên đi làm, em nhất định phải [0:留下] ấn tượng tốt với đồng nghiệp mới. [0:首先] là phải chú ý mặc trang phục lịch sự, [0:其次] là phải đúng giờ. [0:不管] là đi học hay đi làm, [0:准时] luôn là điều rất quan trọng."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "A",
          "zh": "哥哥，面试结果出来了，我明天可以正式上班。太高兴了！虽说我刚毕业，缺少经验，但经理对我的印象肯定不错。真没想到找工作这么顺利。",
          "py": "Gēge, miànshì jiéguǒ chūlaile, wǒ míngtiān kěyǐ zhèngshì shàng bān. Tài gāoxìngle! Suīshuō wǒ gāng bìyè, quēshǎo jīngyàn, dàn jīnglǐ kěndìng duì wǒ de yìnxiàng búcuò. Zhēn méi xiǎngdào zhǎo gōngzuò zhème shùnlì.",
          "vi": "Anh ơi, kết quả phỏng vấn đã có, ngày mai em có thể chính thức đi làm rồi. Vui quá! Mặc dù em mới ra trường, thiếu kinh nghiệm, nhưng giám đốc nhất định là có ấn tượng tốt về em. Thật không ngờ tìm việc lại suôn sẻ như vậy."
        },
        {
          "who": "B",
          "zh": "祝贺你。我知道你现在很兴奋，但要记住这只是走向成功的第一步，以后要多多努力了。",
          "py": "Zhùhè nǐ. Wǒ zhīdào nǐ xiànzài hěn xīngfèn, dàn yào jì zhù zhè zhǐshì zǒuxiàng chénggōng de dì yī bù, yǐhòu yào gèngjiā nǔlìle.",
          "vi": "Chúc mừng em. Anh biết bây giờ em đang rất phấn khích, nhưng hãy nhớ rằng đây mới chỉ là bước đầu tiên để hướng tới thành công, em sẽ phải cố gắng hơn nữa trong tương lai."
        },
        {
          "who": "A",
          "zh": "又来了，我还没高兴几秒，你真是。",
          "py": "Yòu láile, wǒ hái méi gāoxìng jǐ miǎo, nǐ zhēnshi.",
          "vi": "Lại thế rồi đấy, em còn chưa vui được mấy giây, anh thật là."
        },
        {
          "who": "B",
          "zh": "我[1:原来]也[2:以为]工作很简单，后来才发现其实[3:并]不那么容易。经验可以慢慢积累，但态度比能力更重要，要记住。现在赚钱越来越难了。",
          "py": "Wǒ [1:yuánlái] yě [2:yǐwéi] gōngzuò hěn jiǎndān, hòulái cái fāxiàn qíshí [3:bìng] bù nàme róngyì. Jīngyàn kěyǐ mànmàn jīlěi, dàn tàidù bǐ nénglì gèng zhòngyào, yào jì zhù. Xiànzài zhuànqián yuè lái yuè nánle.",
          "vi": "[1:Ban đầu] anh cũng [2:tưởng rằng] công việc rất dễ dàng, nhưng sau đó anh mới nhận ra rằng thực sự [3:không] dễ dàng như vậy. Kinh nghiệm có thể dần dần tích lũy, nhưng thái độ quan trọng hơn năng lực, phải nhớ lấy. Bây giờ kiếm tiền ngày càng khó."
        },
        {
          "who": "A",
          "zh": "我明白了。",
          "py": "Wǒ míngbaile.",
          "vi": "Em hiểu rõ rồi."
        },
        {
          "who": "B",
          "zh": "第一天上班一定要给新同事留下好印象。[4:首先]要注意穿正式的衣服，[4:其次]要准时。[5:不管]是上课还是上班，准时都很重要。",
          "py": "Dì yī tiān shàng bān yídìng yào gěi xīn tóngshì liú xià hǎo yìnxiàng. [4:Shǒuxiān] yào zhùyì chuān zhèngshì de yīfu, [4:qícì] yào zhǔnshí. [5:Bùguǎn] shì shàngkè háishi shàng bān, zhǔnshí dōu hěn zhòngyào.",
          "vi": "Ngày đầu tiên đi làm, em nhất định phải để lại ấn tượng tốt với đồng nghiệp mới. [4:Đầu tiên] phải chú ý mặc trang phục lịch sự, [4:thứ hai] là phải đúng giờ. [5:Cho dù] là đi học hay đi làm, đúng giờ là rất quan trọng."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "原来",
          "np": "NP 16.1"
        },
        {
          "n": 2,
          "label": "以为",
          "np": "NP 16.2"
        },
        {
          "n": 3,
          "label": "并",
          "np": "NP 16.3"
        },
        {
          "n": 4,
          "label": "首先……其次……",
          "np": "NP 16.4"
        },
        {
          "n": 5,
          "label": "不管",
          "np": "NP 16.5"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "又来了 /yòu láile/ được dùng trong khẩu ngữ với ý cảm thán với những sự việc đã xảy ra nhiều lần, mang ngữ khí không hài lòng, thường dịch là \"lại thế rồi, lại nữa rồi đấy\"."
      }
    }
  ],
  "42": [
    {
      "title": "Chém gió song ngữ 1",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Thông báo tới cả nhà một [0:消息] vui, việc hợp tác [0:生意] của công ty A với chúng ta cuối cùng đã được hai bên [0:谈] xong và chốt ngày ký kết."
        },
        {
          "who": "B",
          "zh": "Tuyệt vời. [0:任务] giám đốc giao cho chúng ta lần này gặp bao [0:困难] trắc trở, quá nhiều [0:材料] phải chuẩn bị thành chồng mà vẫn không [0:够], lúc thuyết trình xong tôi còn tưởng sắp [0:失败] đến nơi, [0:竟然] chúng ta đã hoàn thành công việc một cách suôn sẻ."
        },
        {
          "who": "A",
          "zh": "Cả nhà thấy đó, [0:尽管] nhiệm vụ dù đơn giản hay [0:复杂], nhưng chỉ cần mọi người cùng nỗ lực, mọi thứ đều sẽ có cách."
        },
        {
          "who": "B",
          "zh": "Hy vọng chúng ta sẽ nhận được [0:奖金] của dự án như giám đốc đã hứa thưởng nóng."
        }
      ]
    },
    {
      "title": "Chém gió song ngữ 2",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Ghế [0:沙发] tháng này không bán được, cậu mau [0:联系] với bộ phận [0:广告], nhờ họ nghĩ cách marketing xem sao."
        },
        {
          "who": "B",
          "zh": "Tôi đã liên lạc rồi. Đây là [0:计划] quảng cáo tháng sau mà bên đó gửi cho chúng ta, anh có [0:建议] gì với bên họ không?"
        },
        {
          "who": "A",
          "zh": "Tôi đã xem, không có [0:意见] gì, kế hoạch rất tốt. Buổi họp chiều nay diễn ra [0:提前] một tiếng so với kế hoạch, e rằng [0:来不及] chuẩn bị tài liệu."
        },
        {
          "who": "B",
          "zh": "Anh cứ yên tâm, tôi đã chuẩn bị xong tài liệu từ sớm."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 1",
      "lines": [
        {
          "who": "A",
          "zh": "告诉大家一个好消息，我们的生意终于谈成了。",
          "py": "Gàosu dàjiā yí ge hǎo xiāoxi, wǒmen de shēngyì zhōngyú tán chéng le.",
          "vi": "Thông báo tới cả nhà một tin vui, việc kinh doanh của chúng ta cuối cùng đã đàm phán xong."
        },
        {
          "who": "B",
          "zh": "太好了。这次任务有很多困难，材料准备又不够，我还以为我们快要失败了，[1:竟然]那么顺利地完成了工作。",
          "py": "Tài hǎo le. Zhè cì rènwù yǒu hěn duō kùnnan, cáiliào zhǔnbèi yòu búgòu, wǒ hái yǐwéi wǒmen kuàiyào shībài le, [1:jìngrán] nàme shùnlì de wánchéng le gōngzuò.",
          "vi": "Tuyệt vời. Nhiệm vụ này gặp rất nhiều khó khăn, tài liệu chuẩn bị còn không đủ, tôi còn tưởng chúng ta sắp thất bại, [1:vậy mà] chúng ta đã hoàn thành công việc một cách suôn sẻ."
        },
        {
          "who": "A",
          "zh": "[2:尽管]任务更复杂，但是[3:只要]大家一起努力，一切都会有办法的。",
          "py": "[2:Jǐnguǎn] rènwù gèng fùzá, dànshì [3:zhǐyào] dàjiā yìqǐ nǔlì, yíqiè dōu huì yǒu bànfǎ de.",
          "vi": "[2:Cho dù] nhiệm vụ có phức tạp hơn, nhưng [3:chỉ cần] mọi người cùng nỗ lực, mọi thứ đều sẽ có cách."
        },
        {
          "who": "B",
          "zh": "希望下个月我们会拿到奖金。",
          "py": "Xīwàng xià ge yuè wǒmen huì ná dào jiǎngjīn.",
          "vi": "Hy vọng tháng tới chúng ta sẽ nhận được tiền thưởng."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "竟然",
          "np": "NP 17.1"
        },
        {
          "n": 2,
          "label": "尽管",
          "np": "NP 17.2"
        },
        {
          "n": 3,
          "label": "只要",
          "np": "NP 17.3"
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 2",
      "lines": [
        {
          "who": "A",
          "zh": "沙发这个月卖不出去，你快跟广告部联系，让他们想想办法吧。",
          "py": "Shāfā zhè ge yuè mài bù chūqu, nǐ kuài gēn guǎnggào bù liánxì, ràng tāmen xiǎng xiǎng bànfǎ ba.",
          "vi": "Ghế sofa tháng này không bán được, cậu mau lòng liên hệ với bộ phận quảng cáo, nhờ họ nghĩ cách xem sao."
        },
        {
          "who": "B",
          "zh": "我联系了。这是那边发给我们的下个月广告计划，你有什么建议吗？",
          "py": "Wǒ liánxì le. Zhè shì nà biān fā gěi wǒmen de xià ge yuè guǎnggào jìhuà, nǐ yǒu shénme jiànyì ma?",
          "vi": "Tôi đã liên lạc. Đây là kế hoạch quảng cáo tháng sau mà bên đó gửi cho chúng ta, anh có đề xuất gì không?"
        },
        {
          "who": "A",
          "zh": "我看过了，没意见，计划很不错。今天下午的会议提前一个小时，恐怕[4:来不及]准备材料。",
          "py": "Wǒ kànguo le, méi yìjiàn, jìhuà hěn búcuò. Jīntiān xiàwǔ de huìyì tíqián yí ge xiǎoshí, kǒngpà [4:láibují] zhǔnbèi cáiliào.",
          "vi": "Tôi đã xem, không có ý kiến gì, kế hoạch rất tốt. Buổi họp chiều nay diễn ra trước một tiếng so với kế hoạch, e rằng [4:không kịp] chuẩn bị tài liệu."
        },
        {
          "who": "B",
          "zh": "你放心，材料我早就准备好了。",
          "py": "Nǐ fàngxīn, cáiliào wǒ zǎo jiù zhǔnbèi hǎo le.",
          "vi": "Anh cứ yên tâm, tôi đã chuẩn bị xong tài liệu từ sớm."
        },
        {
          "who": "A",
          "zh": "昨晚多几分钟的准备，今天少几小时的麻烦。真有你的！",
          "py": "Zuó wǎn duō jǐ fēnzhōng de zhǔnbèi, jīntiān shǎo jǐ xiǎoshí de máfan. Zhēnyǒu nǐ de!",
          "vi": "Tối qua chuẩn bị thêm vài phút, hôm nay bớt rắc rối vài giờ. Thật tốt vì có cậu!"
        }
      ],
      "legend": [
        {
          "n": 4,
          "label": "来不及",
          "np": "NP 17.4"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "真有你的 /zhēn yǒu nǐ de/ dùng để khen ngợi đối phương, thường dịch là \"may mà / thật tốt vì có bạn\"."
      }
    }
  ],
  "43": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Bố, con muốn đổi công việc. Bây giờ công việc quá nhiều, con bận không xuể, lương ba cọc ba đồng, rất [0:低] lại còn chẳng có tiền thưởng."
        },
        {
          "who": "B",
          "zh": "Lại muốn thay đổi công việc rồi. Để [0:适应] được với môi trường mới, công việc mới [0:与] đồng nghiệp mới, con phải dành ra ít nhất một năm mới để [0:完全] thích nghi. Hơn nữa, người trẻ như con không nên vội vàng kiếm tiền, đừng quá chú trọng đến [0:收入] hàng tháng. Trong mấy năm đầu tiên bắt đầu đi làm, điều quan trọng là phải làm [0:丰富] kinh nghiệm của bản thân, học [0:方法] để trò chuyện [0:交流] với đồng nghiệp. Đây mới là thái độ làm việc mà con nên có."
        },
        {
          "who": "A",
          "zh": "[0:可是] sếp cứ [0:交] cho con những việc mà con không thích."
        },
        {
          "who": "B",
          "zh": "Đây là cơ hội để con rèn luyện tinh thần [0:责任] của mình với công việc. Trong công việc con sẽ nếm trải [0:各] loại hương vị: chua, ngọt, [0:苦], cay, đâu thể chỉ nếm mỗi một [0:味道], con cứ nghĩ mà xem, [0:反正] thì con cũng không thể cứ chỉ làm những việc mình thích được."
        },
        {
          "who": "A",
          "zh": "Làm việc mình không thích thì sao có thể có đạt được kết quả tốt, làm không tốt con còn bị sếp mắng, thật [0:讨厌]."
        },
        {
          "who": "B",
          "zh": "Không giữ được bình tĩnh, dễ [0:发脾气] chính là khuyết điểm của con. Lớn rồi mà [0:性格] vẫn như ngày còn đi học. Đi làm rồi tốt hơn hết con nên [0:改变] tính cách này đi."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "A",
          "zh": "爸，我想换工作。现在工作太多，我[1:忙不过来]，工资又很低，也没有奖金。",
          "py": "Bà, wǒ xiǎng huàn gōngzuò. Xiànzài gōngzuò tài duō, wǒ [1:máng búguò lái], gōngzī yòu hěn dī, yě méiyǒu jiǎngjīn.",
          "vi": "Bố, con muốn đổi công việc. Bây giờ công việc quá nhiều, tôi [1:bận không xuể], lương còn rất thấp, cũng không có tiền thưởng."
        },
        {
          "who": "B",
          "zh": "又想换工作了。其实，完全适应一个新工作需要一年的时间。再说，年轻人不应该着急赚钱，太重视收入。开始工作的头几年，重要的是丰富自己的经验，学习[2:与]同事交流的方法。这才是应该有的工作态度。",
          "py": "Yòu xiǎng huàn gōngzuòle. Qíshí, wánquán shìyìng yí ge xīn gōngzuò xūyào yì nián de shíjiān. Zàishuō, niánqīng rén bù yīnggāi zháojí zhuànqián, tài zhòngshì shōurù. Kāishǐ gōngzuò de tóu jǐ nián, zhòngyào de shì fēngfù zìjǐ de jīngyàn, xuéxí [2:yǔ] tóngshì jiāoliú de fāngfǎ. Zhè cái shì yīnggāi yǒu de gōngzuò tàidù.",
          "vi": "Lại muốn thay đổi công việc rồi. Thực ra, phải mất thời gian một năm để thích nghi hoàn toàn với công việc mới. Hơn nữa, người trẻ không nên vội vàng kiếm tiền, quá chú trọng đến thu nhập. Trong mấy năm đầu tiên bắt đầu đi làm, điều quan trọng là phải làm giàu kinh nghiệm của bản thân, học cách giao tiếp [2:với] đồng nghiệp. Đây mới là thái độ làm việc mà con nên có."
        },
        {
          "who": "A",
          "zh": "[3:可是]老板都把我不喜欢的任务交给我。",
          "py": "[3:Kěshì] lǎobǎn dōu bǎ wǒ bù xǐhuan de rènwù jiāo gěi wǒ.",
          "vi": "[3:Nhưng] sếp cứ giao cho con những việc mà con không thích."
        },
        {
          "who": "B",
          "zh": "这就是让你锻炼责任心的机会。在工作上你会尝到酸、甜、苦、辣各种味道，[4:反正]不能只做喜欢的事。",
          "py": "Zhè jiùshì ràng nǐ duànliàn zérèn xīn de jīhuì. Zài gōngzuò shàng nǐ huì cháng dào suān, tián, kǔ, là gè zhǒng wèidào, [4:fǎnzhèng] bùnéng zhǐ zuò xǐhuan de shì.",
          "vi": "Đây là cơ hội để con rèn luyện tinh thần trách nhiệm của mình. Trong công việc con sẽ nếm trải các hương vị chua, ngọt, đắng, cay, [4:dù sao thì] con cũng không thể cứ chỉ làm những việc mình thích được."
        },
        {
          "who": "A",
          "zh": "做自己不想做的哪能换来好结果，做不好我又被老板批评，太讨厌了。",
          "py": "Zuò zìjǐ bùxiǎng zuò de nǎ néng huàn lái hǎo jiéguǒ, zuò bù hǎo wǒ yòu bèi lǎobǎn pīpíng, tài tǎoyàn le.",
          "vi": "Làm việc mình không thích thì sao có thể đạt được kết quả tốt, làm không tốt con còn bị sếp mắng, thật khó chịu."
        },
        {
          "who": "B",
          "zh": "容易发脾气就是你的缺点。上班了要改变这个性格才好，不要像以前上学时那样。",
          "py": "Róngyì fā píqì jiùshì nǐ de quēdiǎn. Shàng bān le yào gǎibiàn zhè ge xìnggé cái hǎo, búyào xiàng yǐqián shàngxué shí nàyàng.",
          "vi": "Dễ nổi nóng chính là khuyết điểm của con. Đi làm rồi tốt hơn hết con nên thay đổi tính cách này đi, chứ đừng như ngày còn đi học."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "过来",
          "np": "NP 18.1"
        },
        {
          "n": 2,
          "label": "与",
          "np": "NP 18.2"
        },
        {
          "n": 3,
          "label": "可是",
          "np": "NP 18.3"
        },
        {
          "n": 4,
          "label": "反正",
          "np": "NP 18.4"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "酸甜苦辣 /suān tián kǔ là/ ngoài dùng để miêu tả hương vị, còn được dùng trong khẩu ngữ với nghĩa bóng, mang nghĩa tương tự cụm từ \"đắng cay ngọt bùi\" trong Tiếng Việt."
      }
    }
  ],
  "44": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Em nhìn chiếc ghế sofa này xem, dù đánh giá từ [0:方面] nào: mẫu mã, giá cả hay là [0:质量] sản phẩm thì cũng thấy rất [0:值得] để chúng ta cân nhắc mua. [0:另外], họ còn có chính sách hậu mãi cam kết sẽ [0:负责] hoàn toàn việc [0:修理] miễn phí sản phẩm khi bị hỏng trong vòng một năm."
        },
        {
          "who": "B",
          "zh": "Em không ngờ lên mạng cũng có thể mua được [0:家具] để trang trí nhà cửa đó."
        },
        {
          "who": "A",
          "zh": "Đúng vậy, hiện nay [0:购物] trực tuyến đang ngày càng trở nên [0:流行] hơn. Hầu hết mọi thứ em đều có thể mua trên mạng. Người bán còn có thể [0:寄] hàng em mua đến tận nhà cho em [0:任何] lúc nào, rất tiện lợi."
        },
        {
          "who": "B",
          "zh": "Hôm qua em đi [0:逛] trung tâm mua sắm, đang vào mùa [0:打折] để kích cầu mua sắm cuối năm, các cửa hàng ở đó [0:举行] rất nhiều [0:活动] giảm giá, thế là [0:顺便] em mua luôn một cái váy. Về đến nhà mới phát hiện nhỏ quá, không mặc được, giặt xong còn phát hiện bị [0:掉] màu nữa."
        },
        {
          "who": "A",
          "zh": "Nhiều người mua đồ rẻ khi được giảm giá, nhưng họ ít khi nghĩ xem những thứ đó có thực sự phù hợp với mình [0:是否], cũng không chú ý nhiều đến chất lượng của nó. Nếu không phù hợp với mình, mua đồ rẻ để [0:节约] khoản tiền nhỏ, [0:却] thành ra [0:浪费] món tiền to."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "A",
          "zh": "你看看这个沙发，不管[1:从价格方面来看]，还是从质量方面来看，都值得考虑的。[2:另外]，一年内他们都负责免费修理。",
          "py": "Nǐ kànkan zhè ge shāfā, bùguǎn [1:cóng jiàgé fāngmiàn lái kàn], háishi cóng zhìliàng fāngmiàn lái kàn, dōu zhídé kǎolǜ de. [2:Lìngwài], yì nián nèi tāmen dōu fùzé miǎnfèi xiūlǐ.",
          "vi": "Em nhìn chiếc ghế sofa này xem, dù [1:xét từ góc độ giá cả] hay chất lượng thì cũng rất đáng cân nhắc. [2:Ngoài ra], họ còn chịu trách nhiệm sửa chữa miễn phí trong vòng một năm."
        },
        {
          "who": "B",
          "zh": "没想到上网也可以买到家具。",
          "py": "Méi xiǎngdào shàng wǎng yě kěyǐ mǎi dào jiājù.",
          "vi": "Em không ngờ lên mạng cũng có thể mua đồ nội thất."
        },
        {
          "who": "A",
          "zh": "是啊，现在网上购物变得越来越流行了。网上几乎什么都可以买到。卖家还可以在任何时间把你买的东西寄到你家里，非常方便。",
          "py": "Shì a, xiànzài wǎngshang gòu wù biàn de yuè lái yuè liúxíng le. Wǎngshang jīhū shénme dōu kěyǐ mǎi dào. Màijiā hái kěyǐ zài rènhé shíjiān bǎ nǐ mǎi de dōngxi jì dào nǐ jiāli, fēicháng fāngbiàn.",
          "vi": "Đúng vậy, hiện nay mua sắm trực tuyến đang ngày càng trở nên phổ biến hơn. Hầu hết mọi thứ em đều có thể mua trên mạng. Người bán cũng có thể gửi hàng mua đến tận nhà cho em bất cứ lúc nào, rất tiện lợi."
        },
        {
          "who": "B",
          "zh": "昨天我去逛购物中心了，那儿的商店正好举行了很多打折活动，我顺便买了一条裙子。回到家后才发现太小了，穿不了，洗完后还发现掉色了。",
          "py": "Zuótiān wǒ qù guàng gòu wù zhōng xīn le, nàr de shāngdiàn zhènghǎo jǔxíng le hěn duō dǎ zhé huódòng, wǒ shùnbiàn mǎi le yì tiáo qúnzi. Huí dào jiā hòu cái fāxiàn tài xiǎo le, chuān bù liǎo, xǐ wán hòu hái fāxiàn diàosè le.",
          "vi": "Hôm qua em đi dạo trung tâm mua sắm, các cửa hàng ở đó đang tổ chức rất nhiều hoạt động giảm giá, nhân tiện em mua một cái váy. Về đến nhà mới phát hiện nhỏ quá, không mặc được, giặt xong còn phát hiện bị phai màu nữa."
        },
        {
          "who": "A",
          "zh": "很多人在打折的时候买便宜的东西，但他们很少考虑到那些东西[3:是否]适合自己，也不太注意到它的质量。如果不适合自己，节约小钱，[4:却]是浪费大钱。",
          "py": "Hěn duō rén zài dǎ zhé de shíhou mǎi piányi de dōngxi, dàn tāmen hěn shǎo kǎolǜ dào nàxiē dōngxi [3:shìfǒu] shìhé zìjǐ, yě bú tài zhùyì dào tā de zhìliàng. Rúguǒ bú shìhé zìjǐ, jiéyuē xiǎoqián, [4:què] shì làngfèi dàqián.",
          "vi": "Nhiều người mua đồ rẻ khi được giảm giá, nhưng họ ít khi nghĩ xem những thứ đó có phù hợp với mình [3:hay không], cũng không chú ý nhiều đến chất lượng của nó. Nếu không phù hợp với mình, tiết kiệm khoản tiền nhỏ [4:lại] là lãng phí món tiền to."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "从…来看",
          "np": "NP 19.1"
        },
        {
          "n": 2,
          "label": "另外",
          "np": "NP 19.2"
        },
        {
          "n": 3,
          "label": "是否",
          "np": "NP 19.3"
        },
        {
          "n": 4,
          "label": "却",
          "np": "NP 19.4"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "没想到 /méi xiǎngdào/ được dùng trong khẩu ngữ, mang ngữ khí bất ngờ, thường dịch là \"không ngờ rằng\"."
      }
    }
  ],
  "45": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "[0:哇塞], cả căn phòng chất [0:满] sách, lại còn là sách [0:厚] cồm cộp thế này. Đây đều là những cuốn bạn thích đọc à?"
        },
        {
          "who": "B",
          "zh": "Tớ có hứng thú với Luật học, như [0:法律] Hình sự và Lịch sử, cho nên đã mua rất nhiều sách. Đây đều là sách [0:著名] cả trong và ngoài nước, do các [0:教授] đầu ngành viết ra, [0:内容] phong phú, các giáo sư [0:解释] rất rõ ràng, nên đều dày như vậy."
        },
        {
          "who": "A",
          "zh": "Bạn đỉnh thế! Thứ tớ đọc nhiều nhất mỗi ngày chỉ là [0:杂志] thời trang và [0:小说] tình yêu kinh điển."
        },
        {
          "who": "B",
          "zh": "[0:无论] là đọc các sách [0:普通] thường thức hay sách [0:科学] tự nhiên, dù ít dù nhiều đều có ích cho chúng ta. Tớ một ngày không đọc sách giống như thiếu đi một [0:部分] niềm vui trong [0:生活] vậy. [0:除此以外], những người có thói quen [0:阅读] không chỉ dễ kiếm việc làm, mà mức lương cũng tương đối cao."
        },
        {
          "who": "A",
          "zh": "Còn phải nói, thế nên dù bận rộn đến đâu, tớ vẫn kiên trì [0:习惯] đọc sách của mình."
        },
        {
          "who": "B",
          "zh": "Những người thích đọc chắc chắn sẽ tìm thấy thời gian để đọc. Nhờ đọc sách mà [0:连] trong thời gian thư giãn mà vẫn có thể tích lũy thêm [0:知识], vốn kiến thức của bản thân không ngừng [0:增加], thật tiện lợi."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "A",
          "zh": "哇塞，房间里放满了书，还很厚。这些都是你喜欢看的吗？",
          "py": "Wāsāi, fángjiān lǐ fàng mǎn le shū, hái hěn hòu. Zhèxiē dōu shì nǐ xǐhuan kàn de ma?",
          "vi": "Chà, căn phòng để đầy sách, lại còn là sách dày. Đây đều là những cuốn bạn thích đọc à?"
        },
        {
          "who": "B",
          "zh": "我对法律和历史很感兴趣，所以买了很多书。这些都是著名教授写的，内容丰富，解释清楚，所以都这么厚的。",
          "py": "Wǒ duì fǎlǜ hé lìshǐ hěn gǎn xìngqù, suǒyǐ mǎi le hěn duō shū. Zhèxiē dōu shì zhùmíng jiàoshòu xiě de, nèiróng fēngfù, jiěshì qīngchu, suǒyǐ dōu zhème hòu de.",
          "vi": "Tớ có hứng thú với pháp luật và lịch sử, cho nên đã mua rất nhiều sách. Đây đều là do các giáo sư nổi tiếng viết, nội dung phong phú, giải thích rõ ràng, nên đều dày như vậy."
        },
        {
          "who": "A",
          "zh": "你真棒！我每天看的最多的只是杂志和著名小说。",
          "py": "Nǐ zhēn bàng! Wǒ měitiān kàn de zuìduō de zhǐshì zázhì hé zhùmíng xiǎoshuō.",
          "vi": "Bạn đỉnh thế! Thứ tớ đọc nhiều nhất mỗi ngày là tạp chí và tiểu thuyết nổi tiếng."
        },
        {
          "who": "B",
          "zh": "[1:无论]是普通的还是科学的，看或多或少对我们都有好处。我一天不看书就好像生活中缺少了快乐的一部分。[2:除此以外]，阅读能力好的人不仅容易找到工作，而且工资也比较高。",
          "py": "[1:Wúlùn] shì pǔtōng de háishi kēxué de, kàn huò duō huò shǎo duì wǒmen dōu yǒu hǎochu. Wǒ yì tiān bú kàn shū jiù hǎoxiàng shēnghuó zhōng quēshǎo le kuàilè de yí bùfen. [2:Chú cǐ yǐwài], yuèdú nénglì hǎo de rén bùjǐn róngyì zhǎo dào gōngzuò, érqiě gōngzī yě bǐjiào gāo.",
          "vi": "[1:Bất kể] là sách thông thường hay sách khoa học, dù ít dù nhiều đều có ích cho chúng ta. Tớ một ngày không đọc sách giống như thiếu đi một phần niềm vui trong cuộc sống vậy. [2:Ngoài ra], những người có khả năng đọc hiểu tốt không chỉ dễ kiếm việc làm, mà mức lương cũng tương đối cao."
        },
        {
          "who": "A",
          "zh": "可不是嘛，所以尽管工作再忙，我还会坚持阅读的习惯。",
          "py": "Kě búshì ma, suǒyǐ jǐnguǎn gōngzuò zài máng, wǒ hái huì jiānchí yuèdú de xíguàn.",
          "vi": "Còn phải nói, thế nên dù bận rộn đến đâu, tớ vẫn kiên trì thói quen đọc sách của mình."
        },
        {
          "who": "B",
          "zh": "喜欢看书的人一定会找出时间来看书的。[3:连]放松的时间也能增加自己的知识，太方便了。",
          "py": "Xǐhuan kàn shū de rén yídìng huì zhǎo chū shíjiān lái kàn shū de. [3:Lián] fàngsōng de shíjiān yě néng zēngjiā zìjǐ de zhīshi, tài fāngbiàn le.",
          "vi": "Những người thích đọc chắc chắn sẽ tìm thấy thời gian để đọc. [3:Ngay cả] thời gian thư giãn cũng có thể làm tăng kiến thức của bản thân, thật tiện lợi."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "无论",
          "np": "NP 20.1"
        },
        {
          "n": 2,
          "label": "除此以外",
          "np": "NP 20.2"
        },
        {
          "n": 3,
          "label": "连",
          "np": "NP 20.3"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "1. 哇塞 /wā sāi/ vốn là phương ngữ Mân Nam (hay tiếng Phúc Kiến), ngày nay được sử dụng rộng rãi trong cộng đồng người nói Tiếng Trung, với ý thể hiện sự kinh ngạc, thường dịch là \"Wow, chà, ôi chao…\"\n2. Cụm từ 可不是 /kěbúshì/ được dùng để biểu thị sự tán đồng của người nói với ý kiến đối phương đưa ra, thường dịch là \"chính xác đấy, đúng rồi, còn phải nói\"."
      }
    }
  ],
  "46": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Bạn đang xem phim truyền hình của [0:偶像] mà bạn hâm mộ à?"
        },
        {
          "who": "B",
          "zh": "Đúng rồi, bộ này đang rất [0:红], còn [0:受] được sự [0:喜爱] của [0:观众] khắp cả nước."
        },
        {
          "who": "A",
          "zh": "Tại sao bạn thích anh ấy đến vậy?"
        },
        {
          "who": "B",
          "zh": "Sau khi nghe tớ kể câu chuyện của anh ấy, bạn [0:不得不] yêu quý anh ấy. Từ nhỏ anh ấy đã thích nghệ thuật và trở thành [0:演员] để được đóng phim, nhưng gia cảnh [0:穷], chạy ăn từng bữa, [0:父母] không đồng ý cho anh ấy theo học ngành [0:艺术]. Nhưng anh ấy chưa từng [0:放弃], vừa làm việc để kiếm tiền, vừa học [0:表演]. Sau nhiều năm [0:苦练], anh ấy cuối cùng đã [0:成为] một diễn viên nổi tiếng."
        },
        {
          "who": "A",
          "zh": "Nghe những gì bạn nói, tớ đã dần trở thành [0:粉丝] của anh ấy rồi. Tớ rất [0:羡慕] những người không ngừng nỗ lực vì [0:理想] mà họ luôn đau đáu hướng tới."
        },
        {
          "who": "B",
          "zh": "Tớ cũng vậy, thành công có được [0:确实] là nhờ đến 99% trên tổng [0:百分] nỗ lực của chính mình. Tôi học được rất nhiều điều từ anh ấy, người trẻ trước hết phải hiểu mình muốn gì, thứ hai là kiên định với lựa chọn của mình, không được dễ dàng từ bỏ. Có như vậy mỗi ngày mới có thể trôi qua [0:愉快]."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "A",
          "zh": "你在看偶像的电视剧吧？",
          "py": "Nǐ zài kàn ǒuxiàng de diànshìjù ba?",
          "vi": "Bạn đang xem phim truyền hình của thần tượng à?"
        },
        {
          "who": "B",
          "zh": "对啊，这部现在很红，受到全国观众的喜爱。",
          "py": "Duì a, zhè bù xiànzài hěn hóng, shòudào quánguó guānzhòng de xǐ'ài.",
          "vi": "Đúng rồi, bộ này đang rất nổi tiếng, được khán giả cả nước yêu thích."
        },
        {
          "who": "A",
          "zh": "你为什么这么喜欢他呢？",
          "py": "Nǐ wèishénme zhème xǐhuan tā ne?",
          "vi": "Tại sao bạn thích anh ấy đến vậy?"
        },
        {
          "who": "B",
          "zh": "听我讲他的故事后，你[1:不得不]爱上他。他从小就喜欢当演员，但家里很穷，他父母不让他学艺术。但他从来没放弃过，每天都一边工作赚钱一边学表演。经过多年苦练，他终于成为著名演员。",
          "py": "Tīng wǒ jiǎng tā de gùshi hòu, nǐ [1:bù dé bú] ài shàng tā. Tā cóngxiǎo jiù xǐhuan dāng yǎnyuán, dàn jiālǐ hěn qióng, tā fùmǔ bú ràng tā xué yìshù. Dàn tā cónglái méi fàngqì guo, měitiān dōu yìbiān gōngzuò zhuàn qián yìbiān xué biǎoyǎn. Jīngguò duōnián kǔliàn, tā zhōngyú chéngwéi zhùmíng yǎnyuán.",
          "vi": "Sau khi nghe tớ kể câu chuyện của anh ấy, bạn [1:nhất định] sẽ yêu anh ấy. Anh ấy từ nhỏ đã thích trở thành diễn viên, nhưng gia đình anh ấy rất nghèo, bố mẹ anh ấy không cho anh ấy theo học nghệ thuật. Nhưng anh ấy trước nay chưa từng bỏ cuộc, mỗi ngày vừa làm việc để kiếm tiền vừa học diễn xuất. Sau nhiều năm khổ luyện, anh ấy cuối cùng đã trở thành một diễn viên nổi tiếng."
        },
        {
          "who": "A",
          "zh": "听你这么一说，我也慢慢成为他的粉丝了。我很羡慕能[2:为]自己的理想[2:而]不停努力的人。",
          "py": "Tīng nǐ zhème yì shuō, wǒ yě màn màn chéngwéi tā de fěnsī le. Wǒ hěn xiànmù néng [2:wèi] zìjǐ de lǐxiǎng [2:ér] bù tíng nǔlì de rén.",
          "vi": "Nghe những gì bạn nói, tớ đã dần trở thành fan của anh ấy rồi. Tớ rất ngưỡng mộ những người không ngừng nỗ lực [2:vì] lý tưởng của họ."
        },
        {
          "who": "B",
          "zh": "我也是，一个人成功的[3:百分之九十九][4:确实]是靠自己的努力。我从他身上学到很多东西，年轻人首先要了解自己想要什么，其次是坚持自己的选择，不要容易放弃。这样每天才能过得愉快。",
          "py": "Wǒ yěshì, yí ge rén chénggōng de [3:bǎi fēn zhī jiǔshíjiǔ] [4:quèshí] shì kào zìjǐ de nǔlì. Wǒ cóng tā shēnshang xué dào hěn duō dōngxi, niánqīng rén shǒuxiān yào liǎojiě zìjǐ xiǎng yào shénme, qícì shì jiānchí zìjǐ de xuǎnzé, búyào róngyì fàngqì. Zhèyàng měitiān cáinéng guò de yúkuài.",
          "vi": "Tớ cũng vậy, [4:thực sự] thì [3:chín mươi chín phần trăm] thành công đạt được là nhờ nỗ lực của chính mình. Tôi học được rất nhiều điều từ anh ấy, người trẻ trước hết phải hiểu mình muốn gì, thứ hai là kiên định với lựa chọn của mình, không được dễ dàng từ bỏ. Có như vậy mỗi ngày mới có thể trôi qua vui vẻ."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "不得不",
          "np": "NP 21.1"
        },
        {
          "n": 2,
          "label": "为…而…",
          "np": "NP 21.2"
        },
        {
          "n": 3,
          "label": "百分之",
          "np": "NP 21.3"
        },
        {
          "n": 4,
          "label": "确实",
          "np": "NP 21.4"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "Cấu trúc 受…的喜爱 /shòu… de xǐ'ài/, 受…的欢迎 /shòu… de huānyíng/ biểu đạt ý nhận được sự yêu quý, đón chào của ai, 受 /shòu/ mang nghĩa \"nhận, được\", thường đi cùng tân ngữ là những điều trừu tượng (giáo dục, chào mừng, yêu thích…)."
      }
    }
  ],
  "47": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Con tôi rất rụt rè, chẳng [0:自信] như các bạn. Nhà trường biết con hát hay, mời [0:报名] tham gia hoạt động, bé cũng không [0:积极] tham gia. Bé luôn [0:害羞] như cây, không năng động [0:活泼] như anh trai."
        },
        {
          "who": "B",
          "zh": "Thực ra [0:教育] con rất đơn giản, chỉ cần dùng cách [0:正确] là được. Bạn nên thường xuyên [0:鼓励] bé bày tỏ [0:看法] của mình. Bé đã làm được bạn nên [0:表扬] bé, thưởng cho bé [0:及时]. Làm như vậy bé sẽ ngày càng tự tin hơn."
        },
        {
          "who": "A",
          "zh": "Thế [0:平时] làm thế nào để bạn [0:养成] thói quen đọc sách cho con bạn? Con tôi cứ đọc sách là [0:困] díu cả mắt lại."
        },
        {
          "who": "B",
          "zh": "Đọc những cuốn sách bổ ích [0:不如] đọc những cuốn sách thú vị, hãy cho bé đọc một số cuốn sách [0:有趣] chẳng hạn như động vật, thực vật, lịch sử và văn hóa [0:什么的]. Nhất định phải chọn sách [0:按照] hứng thú, sở thích và [0:年龄] của trẻ. Khi trẻ đang đọc sách, cha mẹ cũng nên ngồi bên cạnh đọc sách của chính chúng, làm vậy chắc chắn sẽ mang lại hiệu quả khích lệ con [0:真正]."
        },
        {
          "who": "A",
          "zh": "Bạn hiểu về cách dạy con như vậy, ngưỡng mộ quá."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "A",
          "zh": "我的孩子不够自信。她不积极报名参加学校的活动。她总是害羞，不像她哥哥那样活泼。",
          "py": "Wǒ de háizi búgòu zìxìn. Tā bù jījí bàomíng cānjiā xuéxiào de huódòng. Tā zǒngshì hàixiū, bú xiàng tā gēge nàyàng huópō.",
          "vi": "Con tôi không đủ tự tin. Cô bé không tích cực đăng ký các hoạt động của trường. Bé luôn nhút nhát, không hoạt bát như anh trai."
        },
        {
          "who": "B",
          "zh": "其实教育孩子很简单，使用正确的方法就好。你应该经常鼓励她说出自己的看法。她做到了你应该及时表扬她。这样做她就越来越自信了。",
          "py": "Qíshí jiàoyù háizi hěn jiǎndān, shǐyòng zhèngquè de fāngfǎ jiù hǎo. Nǐ yīnggāi jīngcháng gǔlì tā shuō chū zìjǐ de kànfǎ. Tā zuò dào le nǐ yīnggāi jíshí biǎoyáng tā. Zhèyàng zuò tā jiù yuè lái yuè zìxìn le.",
          "vi": "Thực ra dạy con rất đơn giản, chỉ cần dùng đúng cách là được. Bạn nên thường xuyên khuyến khích bé bày tỏ ý kiến của mình. Bé đã làm được bạn nên khen ngợi bé kịp thời. Làm như vậy bé sẽ ngày càng tự tin hơn."
        },
        {
          "who": "A",
          "zh": "那你平时怎么让你孩子养成读书的习惯呢？我孩子一看书就困。",
          "py": "Nà nǐ píngshí zěnme ràng nǐ háizi yǎng chéng dú shū de xíguàn ne? Wǒ háizi yí kàn shū jiù kùn.",
          "vi": "Thế bình thường làm thế nào để bạn hình thành thói quen đọc sách cho con bạn? Con tôi cứ đọc sách là buồn ngủ."
        },
        {
          "who": "B",
          "zh": "读有用的书[1:不如]读有趣的书，你让她读一些有趣的书吧，动物，植物，历史，文化[2:什么的]。一定要[3:按照]孩子的兴趣、爱好、年龄来选书。当孩子读书时，父母也应该在旁边读自己的书，这样做一定会带来真正的鼓励效果。",
          "py": "Dú yǒu yòng de shū [1:bùrú] dú yǒuqù de shū, nǐ ràng tā dú yìxiē yǒuqù de shū ba, dòngwù, zhíwù, lìshǐ, wénhuà [2:shénme de]. Yídìng yào [3:ànzhào] háizi de xìngqù, àihào, niánlíng lái xuǎn shū. Dāng háizi dú shū shí, fùmǔ yě yīnggāi zài pángbiān dú zìjǐ de shū, zhèyàng zuò yídìng huì dài lái zhēnzhèng de gǔlì xiàoguǒ.",
          "vi": "Đọc những cuốn sách bổ ích [1:không bằng] đọc những cuốn sách thú vị, hãy cho bé đọc một số cuốn sách thú vị, chẳng hạn như động vật, thực vật, lịch sử và văn hóa [2:v.v…] Nhất định phải chọn sách [3:theo] hứng thú, sở thích và độ tuổi của trẻ. Khi trẻ đang đọc sách, cha mẹ cũng nên ngồi bên cạnh đọc sách của chính chúng, làm vậy chắc chắn sẽ mang lại hiệu quả khích lệ con thực sự."
        },
        {
          "who": "A",
          "zh": "你太了解怎样教育孩子了，好羡慕！",
          "py": "Nǐ tài liǎojiě zěnyàng jiàoyù háizi le, hǎo xiànmù!",
          "vi": "Bạn hiểu về cách dạy con như thế nào quá, ngưỡng mộ quá."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "不如",
          "np": "NP 22.1"
        },
        {
          "n": 2,
          "label": "什么的",
          "np": "NP 22.2"
        },
        {
          "n": 3,
          "label": "按照",
          "np": "NP 22.3"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "Cấu trúc 当…时 /dāng… shí/, 当…的时候 /dāng… de shíhou/ biểu đạt ý \"Lúc / khi…\", giống với việc chỉ sử dụng 时候 hoặc 时."
      }
    }
  ],
  "48": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Điện thoại của tớ lại không thấy đâu rồi, phải làm sao đây?"
        },
        {
          "who": "B",
          "zh": "Người hiện đại ơi là người [0:现代], ngày càng không thể tách rời điện thoại di động ra rồi đấy."
        },
        {
          "who": "A",
          "zh": "Còn phải nói, sự [0:发展] không ngừng của [0:互联网] đã mang lại cho chúng ta bao tiện ích. Chỉ cần sử dụng một chiếc điện thoại di động nho nhỏ để mở app, mở trình duyệt để truy cập vào các [0:网站], là bạn đã có thể xem tin tức, nghe nhạc, xem phim, đọc tiểu thuyết, chơi game, v.v… Giờ đây, [0:人们] không chỉ có thể lên mạng viết [0:日记] ghi lại cảm xúc mỗi ngày, mà việc [0:约会] với người khác trên mạng cũng trở nên [0:普遍], [0:甚至] còn có thể tỏ tình với thần tượng của mình."
        },
        {
          "who": "B",
          "zh": "Tất nhiên tớ biết điều này, bởi vì internet cũng đã [0:使] cho [0:方式] học tập của học sinh [0:发生] rất nhiều thay đổi. Học ngoại ngữ giờ đến từ điển cũng chẳng cần dùng, hầu hết các [0:词语] đều có thể tra trực tuyến, thực sự thuận tiện hơn nhiều so với thời mà [0:俩] chúng ta còn đi học."
        },
        {
          "who": "A",
          "zh": "Đúng đấy. Cũng có rất nhiều [0:作者] viết tiểu thuyết trên mạng, nhờ tốc độ lan truyền mạnh mà tiếng tăm [0:火] lên rất nhanh. Điều này [0:既] giúp dễ dàng viết ra câu truyện, còn vừa tiết kiệm [0:纸], giúp [0:保护] môi trường."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "A",
          "zh": "我的手机又不见了，怎么办？",
          "py": "Wǒ de shǒujī yòu bú jiàn le, zěnmebàn?",
          "vi": "Điện thoại của tớ lại không thấy đâu rồi, phải làm sao đây?"
        },
        {
          "who": "B",
          "zh": "现代人啊现代人，越来越离不开手机了。",
          "py": "Xiàndài rén a xiàndài rén, yuè lái yuè lí bu kāi shǒujī le.",
          "vi": "Người hiện đại ơi là người hiện đại, ngày càng không thể tách rời điện thoại di động ra rồi đấy."
        },
        {
          "who": "A",
          "zh": "可不是嘛，互联网的发展给我们带来很多方便。只要使用小小的手机打开网站，就可以看新闻，听音乐，看电影，读小说，玩儿游戏等。现在，人们不仅可以在网上写日记，而且在网上与别人约会也很普遍，[1:甚至]还可以向偶像表白呢。",
          "py": "Kě búshì ma, hùliánwǎng de fāzhǎn gěi wǒmen dài lái hěn duō fāngbiàn. Zhǐyào shǐyòng xiǎo xiǎo de shǒujī dǎ kāi wǎngzhàn, jiù kěyǐ kàn xīnwén, tīng yīnyuè, kàn diànyǐng, dú xiǎoshuō, wánr yóuxì děng. Xiànzài, rénmen bùjǐn kěyǐ zài wǎngshang xiě rìjì, érqiě zài wǎngshang yǔ biérén yuēhuì yě hěn pǔbiàn, [1:shènzhì] hái kěyǐ xiàng ǒuxiàng biǎobái ne.",
          "vi": "Còn phải nói, sự phát triển của internet đã mang lại cho chúng ta bao tiện ích. Chỉ cần sử dụng một chiếc điện thoại di động nho nhỏ để mở trang web, bạn có thể xem tin tức, nghe nhạc, xem phim, đọc tiểu thuyết, chơi game, v.v… Giờ đây, mọi người không chỉ có thể viết nhật ký trên mạng, mà việc hẹn hò với người khác trên mạng cũng trở nên phổ biến, [1:thậm chí] còn có thể tỏ tình với thần tượng của mình."
        },
        {
          "who": "B",
          "zh": "这我当然知道，因为互联网也[2:使]学生们的学习方式发生了很多变化。学外语时连词典也不用了，大部分词语都能在网上查，确实比我们俩上学的时候方便多了。",
          "py": "Zhè wǒ dāngrán zhīdao, yīnwèi hùliánwǎng yě [2:shǐ] xuéshēngmen de xuéxí fāngshì fāshēng le hěn duō biànhuà. Xué wàiyǔ shí lián cídiǎn yě búyòng le, dà bùfen cíyǔ dōu néng zài wǎngshang chá, quèshí bǐ wǒmen liǎ shàng xué de shíhou fāngbiàn duō le.",
          "vi": "Tất nhiên tớ biết điều này, bởi vì internet cũng đã [2:khiến] cho cách học của học sinh thay đổi rất nhiều. Học ngoại ngữ giờ đến từ điển cũng chẳng cần dùng, hầu hết các từ đều có thể tra trực tuyến, thực sự thuận tiện hơn nhiều so với thời hai chúng ta còn đi học."
        },
        {
          "who": "A",
          "zh": "对啊。还有很多作者在网上写小说，非常火。这样[3:既]能容易写出故事，[3:还]能节约用纸，保护环境。",
          "py": "Duì a. Hái yǒu hěn duō zuòzhě zài wǎngshang xiě xiǎoshuō, fēicháng huǒ. Zhèyàng [3:jì] néng róngyì xiě chū gùshi, [3:hái] néng jiéyuē yòng zhǐ, bǎohù huánjìng.",
          "vi": "Đúng đấy. Cũng có rất nhiều tác giả viết tiểu thuyết trên mạng, rất được yêu thích. Điều này [3:vừa] giúp dễ dàng viết ra câu truyện, [3:còn vừa] tiết kiệm giấy và bảo vệ môi trường."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "甚至",
          "np": "NP 23.1"
        },
        {
          "n": 2,
          "label": "使",
          "np": "NP 23.2"
        },
        {
          "n": 3,
          "label": "既…还…",
          "np": "NP 23.3"
        }
      ]
    }
  ],
  "49": [
    {
      "title": "Chém gió song ngữ 1",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "[0:随着] sự phát triển của khoa học và [0:技术], mọi mặt trong cuộc sống của chúng ta đều ít nhiều bị ảnh hưởng."
        },
        {
          "who": "B",
          "zh": "Ngoài những tác động tích cực, còn có [0:许多] vấn nạn tồn tại. Lấy môi trường làm ví dụ, biến đổi [0:气候], [0:污染] môi trường, v.v… Việc con người sử dụng quá nhiều [0:塑料袋] để đựng đồ cũng là một trong những [0:原因] khiến Trái đất ngày càng ô nhiễm."
        },
        {
          "who": "A",
          "zh": "Để bảo vệ trái đất, chúng ta nên [0:减少] sử dụng túi ni lông."
        }
      ]
    },
    {
      "title": "Chém gió song ngữ 2",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Áp lực của [0:社会] hiện đại lớn quá."
        },
        {
          "who": "B",
          "zh": "Ừ! Tôi phải [0:竞争] với các đồng nghiệp mỗi ngày ở công ty, về đến nhà cũng chẳng [0:轻松] hơn chút nào. Nhà vẫn phải thuê, tiền cứ [0:按时] mà trả. Trong nhà từ trên xuống dưới đều [0:由] chúng ta gánh vác, bận đến mức không có thời gian cho riêng mình."
        },
        {
          "who": "A",
          "zh": "Tôi cũng vậy. Tôi làm việc chăm chỉ để được người khác [0:尊重]. Tôi làm việc chăm chỉ để gia đình có thể [0:骄傲] về những thành tựu của tôi. Họ đã đặt nhiều hy vọng vào tôi, tôi thực sự không muốn làm họ [0:失望]."
        },
        {
          "who": "B",
          "zh": "Cuộc sống giống như thanh [0:巧克力] vậy, vừa đắng vừa ngọt. Cũng không thể hài lòng với [0:所有] mọi việc. Chúng ta đều cần cố gắng bước tiếp."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 1",
      "lines": [
        {
          "who": "A",
          "zh": "[1:随着]科学和技术的发展，我们生活的各个方面或多或少都受到了影响。",
          "py": "[1:Suízhe] kēxué hé jìshù de fāzhǎn, wǒmen shēnghuó de gègè fāngmiàn huò duō huò shǎo dōu shòudào le yǐngxiǎng.",
          "vi": "[1:Cùng với] sự phát triển của khoa học và công nghệ, mọi mặt trong cuộc sống của chúng ta đều ít nhiều bị ảnh hưởng."
        },
        {
          "who": "B",
          "zh": "除了积极的影响，还有着许多问题。[2:拿环境来说]，气候变化，环境污染等。再说，人们使用太多塑料袋了，这也是让地球越来越污染的原因[3:之一]。",
          "py": "Chúle jījí de yǐngxiǎng, hái yǒu zhe xǔduō wèntí. [2:Ná huánjìng lái shuō], qìhòu biànhuà, huánjìng wūrǎn děng. Zàishuō, rénmen shǐyòng tài duō sùliào dài le, zhè yěshì ràng dìqiú yuè lái yuè wūrǎn de yuányīn [3:zhī yī].",
          "vi": "Ngoài những tác động tích cực, còn có nhiều vấn đề. [2:Lấy môi trường làm ví dụ], biến đổi khí hậu, ô nhiễm môi trường, v.v… Việc con người sử dụng quá nhiều túi ni lông cũng là [3:một trong những] nguyên nhân khiến trái đất ngày càng ô nhiễm."
        },
        {
          "who": "A",
          "zh": "为了保护地球，我们应该要减少使用塑料袋。",
          "py": "Wèile bǎohù dìqiú, wǒmen yīnggāi yào jiǎnshǎo shǐyòng sùliào dài.",
          "vi": "Để bảo vệ trái đất, chúng ta nên giảm sử dụng túi ni lông."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "随着",
          "np": "NP 24.1"
        },
        {
          "n": 2,
          "label": "拿…来说",
          "np": "NP 24.2"
        },
        {
          "n": 3,
          "label": "之一",
          "np": "NP 24.3"
        }
      ]
    },
    {
      "title": "Nói như người bản xứ 2",
      "lines": [
        {
          "who": "A",
          "zh": "现代社会的压力挺大的。",
          "py": "Xiàndài shèhuì de yālì tǐng dà de.",
          "vi": "Áp lực của xã hội hiện đại lớn quá."
        },
        {
          "who": "B",
          "zh": "对啊！在公司天天要跟同事竞争，回了家也不轻松。房还要租，钱按时交。家里上下都[4:由]我们来负责，忙到连一点自己的时间都没有。",
          "py": "Duì a! Zài gōngsī tiāntiān yào gēn tóngshì jìngzhēng, huí le jiā yě bù qīngsōng. Fáng hái yào zū, qián ànshí jiāo. Jiālǐ shàngxià dōu [4:yóu] wǒmen lái fùzé, máng dào lián yìdiǎn zìjǐ de shíjiān dōu méiyǒu.",
          "vi": "Ừ! Tôi phải cạnh tranh với các đồng nghiệp mỗi ngày ở công ty, về đến nhà cũng chẳng nhẹ nhõm hơn. Nhà vẫn phải thuê, tiền trả đúng hạn. Trong nhà từ trên xuống dưới đều [4:do] chúng ta gánh vác, bận đến mức không có thời gian cho riêng mình."
        },
        {
          "who": "A",
          "zh": "我也是。我努力工作让别人尊重我。我努力工作让我家人为我骄傲。我真的不想让他们失望。",
          "py": "Wǒ yěshì. Wǒ nǔlì gōngzuò ràng biérén zūnzhòng wǒ. Wǒ nǔlì gōngzuò ràng wǒ jiārén wèi wǒ jiāo'ào. Wǒ zhēn de bù xiǎng ràng tāmen shīwàng.",
          "vi": "Tôi cũng vậy. Tôi làm việc chăm chỉ để khiến người khác tôn trọng mình. Tôi làm việc chăm chỉ để gia đình tự hào về tôi. Tôi thực sự không muốn làm họ thất vọng."
        },
        {
          "who": "B",
          "zh": "生活像巧克力一样，又苦又甜。也不能[5:所有]事情都满意吧。我们都要坚持下去。",
          "py": "Shēnghuó xiàng qiǎokèlì yíyàng, yòu kǔ yòu tián. Yě bùnéng [5:suǒyǒu] shìqing dōu mǎnyì ba. Wǒmen dōu yào jiānchí xiàqu.",
          "vi": "Cuộc sống giống như chocolate vậy, vừa đắng vừa ngọt. Cũng không thể hài lòng với [5:tất cả] mọi việc. Chúng ta đều cần cố gắng bước tiếp."
        }
      ],
      "legend": [
        {
          "n": 4,
          "label": "由",
          "np": "NP 24.4"
        },
        {
          "n": 5,
          "label": "所有",
          "np": "NP 24.5"
        }
      ]
    }
  ],
  "50": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "A",
          "zh": "Cuộc sống ở thành phố [0:既然] mang tới quá nhiều áp lực và [0:烦恼] cho chúng ta, chi bằng chúng ta từ bỏ mọi thứ, về sống ở vùng [0:郊区] cách thành phố 40-50 km đi. Cứ về với thiên nhiên là sẽ cảm thấy rất thoải mái. [0:景色] miền thôn quê vô cùng [0:美丽], [0:周围] đầy hoa cỏ sẽ khiến bản thân [0:冷静] hơn trước những bon chen phiền muộn."
        },
        {
          "who": "B",
          "zh": "Sếp cũ của tớ cũng rời thành phố, chuyển vào sống trong [0:森林] sâu. Tớ rất ngưỡng mộ sự [0:勇敢] của anh ấy!"
        },
        {
          "who": "A",
          "zh": "Trong giấc [0:梦] của tớ, ngôi nhà lý tưởng cũng sẽ ở trong rừng, mỗi ngày [0:醒] dậy đều nhìn thấy màu xanh của cây cối, đọc sách dưới tán cây, nhìn [0:叶子] từ từ [0:降落] xuống mặt đất, khi thấy [0:难受] trong lòng thì ôm lấy những con vật nhỏ. Cứ như vậy phiền não sẽ ngày một ít hơn."
        },
        {
          "who": "B",
          "zh": "Khi gặp điều phiền não, chúng ta đều nên tìm cách giải quyết. Rời thành phố chỉ là một [0:其中] nhiều giải pháp. Tớ [0:仍然] chọn tiếp tục nỗ lực để làm tốt công việc hiện tại. Không phải không muốn, mà là tớ không [0:敢] từ bỏ hết mọi thứ đi như vậy."
        },
        {
          "who": "A",
          "zh": "\"Giày [0:合适] hay không, chỉ có chân mới biết\", mỗi người đều có sự lựa chọn của riêng mình, chỉ cần chọn điều không khiến bạn [0:后悔] là được."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "A",
          "zh": "[1:既然]城市里的生活有这么多烦恼，还是我们放弃一切，到郊区住吧。一回到大自然就会觉得很舒服。美丽的景色，周围满是鲜花绿草会让自己冷静下来。",
          "py": "[1:Jìrán] chéngshì lǐ de shēnghuó yǒu zhème duō fánnǎo, háishi wǒmen fàngqì yíqiè, dào jiāoqū zhù ba. Yì huí dào dà zìrán jiù huì juéde hěn shūfu. Měilì de jǐngsè, zhōuwéi mǎn shì xiān huā lǜ cǎo huì ràng zìjǐ lěngjìng xiàlai.",
          "vi": "[1:Nếu] cuộc sống ở thành phố đã có quá nhiều phiền não như vậy, chi bằng chúng ta từ bỏ mọi thứ, về sống ở vùng ngoại ô đi. Cứ về với thiên nhiên là sẽ cảm thấy rất thoải mái. Cảnh sắc tuyệt đẹp, xung quanh đầy hoa cỏ sẽ khiến bản thân bình tĩnh hơn."
        },
        {
          "who": "B",
          "zh": "我的前老板也离开了城市，搬到森林里住。好羡慕他的勇敢！",
          "py": "Wǒ de qián lǎobǎn yě líkāi le chéngshì, bān dào sēnlín lǐ zhù. Hǎo xiànmù tā de yǒnggǎn!",
          "vi": "Sếp cũ của tớ cũng rời thành phố, chuyển vào sống trong rừng. Tớ rất ngưỡng mộ sự dũng cảm của anh ấy!"
        },
        {
          "who": "A",
          "zh": "在我梦里，理想的房子也要在森林里，每天醒来都看到绿色的树木，在树下读书，看叶子慢慢降落，难受时抱着小动物。这样烦恼就[2:一天比一天]少。",
          "py": "Zài wǒ mèng lǐ, lǐxiǎng de fángzi yě yào zài sēnlín lǐ, měitiān xǐng lái dōu kàn dào lǜsè de shùmù, zài shù xià dú shū, kàn yèzi màn màn jiàngluò, nánshòu shí bàozhe xiǎo dòngwù. Zhèyàng fánnǎo jiù [2:yì tiān bǐ yì tiān] shǎo.",
          "vi": "Trong giấc mơ của tớ, ngôi nhà lý tưởng cũng sẽ ở trong rừng, mỗi ngày thức dậy đều nhìn thấy màu xanh của cây cối, đọc sách dưới tán cây, nhìn lá rơi từ từ, khi khó chịu thì ôm những con vật nhỏ vào lòng. Cứ như vậy phiền não sẽ [2:ngày một] ít hơn."
        },
        {
          "who": "B",
          "zh": "遇到烦恼时，咱们都应该找办法来解决。离开城市是[3:其中]的一个办法。我[4:仍然]选择继续努力做好现在的工作吧。我不敢放弃所有。",
          "py": "Yù dào fánnǎo shí, zánmen dōu yīnggāi zhǎo bànfǎ lái jiějué. Líkāi chéngshì shì [3:qízhōng] de yí ge bànfǎ. Wǒ [4:réngrán] xuǎnzé jìxù nǔlì zuò hǎo xiànzài de gōngzuò ba. Wǒ bù gǎn fàngqì suǒyǒu.",
          "vi": "Khi gặp điều phiền não, chúng ta đều nên tìm cách giải quyết. Rời thành phố là [3:một trong những] cách như vậy. Tớ [4:vẫn] chọn tiếp tục nỗ lực để làm tốt công việc hiện tại. Tớ không dám từ bỏ mọi thứ."
        },
        {
          "who": "A",
          "zh": "\"鞋合不合适，只有脚知道\"，每个人都有自己的选择，选择不让你后悔就好。",
          "py": "\"Xié hé bu héshì, zhǐyǒu jiǎo zhīdao\", měi ge rén dōu yǒu zìjǐ de xuǎnzé, xuǎnzé bú ràng nǐ hòuhuǐ jiù hǎo.",
          "vi": "\"Giày hợp hay không, chỉ có chân mới biết\", mỗi người đều có sự lựa chọn của riêng mình, chỉ cần chọn điều không khiến bạn hối hận là được."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "既然",
          "np": "NP 25.1"
        },
        {
          "n": 2,
          "label": "一天比一天",
          "np": "NP 25.2"
        },
        {
          "n": 3,
          "label": "其中",
          "np": "NP 25.3"
        },
        {
          "n": 4,
          "label": "仍然",
          "np": "NP 25.4"
        }
      ]
    }
  ]
}
