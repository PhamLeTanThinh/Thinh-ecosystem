// SINH TỰ ĐỘNG bởi scripts/import-chinese-lessons.mjs từ scripts/chinese-data/hsk4/*.json — đừng sửa tay, sửa JSON rồi chạy lại.
import type { Dialogue } from './dialogues'
import type { LessonMeta } from './lessons'

export const HSK4_LESSON_META: Record<number, LessonMeta> = {
  "51": {
    "level": "hsk4",
    "title": "活到老，学到老",
    "titleVi": "Sống đến già, học đến già"
  },
  "52": {
    "level": "hsk4",
    "title": "文化故事",
    "titleVi": "Câu chuyện văn hóa"
  },
  "53": {
    "level": "hsk4",
    "title": "去旅行",
    "titleVi": "Đi du lịch"
  },
  "54": {
    "level": "hsk4",
    "title": "交通工具",
    "titleVi": "Phương tiện giao thông"
  },
  "55": {
    "level": "hsk4",
    "title": "身体健康",
    "titleVi": "Cơ thể mạnh khỏe"
  },
  "56": {
    "level": "hsk4",
    "title": "结婚成家",
    "titleVi": "Hôn nhân – Gia đình"
  },
  "57": {
    "level": "hsk4",
    "title": "选择职业",
    "titleVi": "Lựa chọn nghề nghiệp"
  },
  "58": {
    "level": "hsk4",
    "title": "办公室生活",
    "titleVi": "Đời sống công sở"
  },
  "59": {
    "level": "hsk4",
    "title": "互联网",
    "titleVi": "Internet"
  },
  "60": {
    "level": "hsk4",
    "title": "经济",
    "titleVi": "Kinh tế"
  },
  "61": {
    "level": "hsk4",
    "title": "快乐成长",
    "titleVi": "Vui vẻ lớn lên"
  },
  "62": {
    "level": "hsk4",
    "title": "解决烦恼",
    "titleVi": "Thoát khỏi phiền não"
  },
  "63": {
    "level": "hsk4",
    "title": "理解别人",
    "titleVi": "Thấu hiểu người khác"
  },
  "64": {
    "level": "hsk4",
    "title": "工作态度",
    "titleVi": "Thái độ làm việc"
  },
  "65": {
    "level": "hsk4",
    "title": "为梦想做好准备",
    "titleVi": "Chuẩn bị cho ước mơ"
  },
  "66": {
    "level": "hsk4",
    "title": "生活常识",
    "titleVi": "Thường thức cuộc sống"
  },
  "67": {
    "level": "hsk4",
    "title": "艺术欣赏",
    "titleVi": "Thưởng thức nghệ thuật"
  },
  "68": {
    "level": "hsk4",
    "title": "行为规则",
    "titleVi": "Quy tắc ứng xử"
  },
  "69": {
    "level": "hsk4",
    "title": "回忆学生时代",
    "titleVi": "Kỷ niệm thời học sinh"
  },
  "70": {
    "level": "hsk4",
    "title": "尽力而为",
    "titleVi": "Cố gắng hết sức"
  }
}

export const HSK4_DIALOGUES: Record<number, Dialogue[]> = {
  "51": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Số lượng các quốc gia trên Trái Đất đem [0:加] tổng tất cả lại chỉ có hơn 200, nhưng [0:而], thế giới đã biết [0:超过] 5000 loại ngôn ngữ (cụ thể là 5651 loại). [0:语言] không chỉ là [0:工具] để con người giao tiếp và [0:表达] ý tưởng, mà còn là một bộ phận không thể thiếu của nền văn hóa của từng quốc gia, từng nhóm [0:民族] thiểu số khác nhau. Tuy số lượng nhiều như vậy, nhưng [0:由于] con người không chú ý bảo vệ, [0:人数] sử dụng ngôn ngữ ấy ngày càng giảm, ngôn ngữ của nhiều dân tộc đã dần trở thành lịch sử, và [0:全部] những gì chúng ta biết về chúng chỉ [0:剩] lại một cái tên, thật là [0:可惜]!"
        },
        {
          "who": "",
          "zh": "Làm thế nào để có thể nói [0:流利] một ngôn ngữ như người bản xứ? Nếu như bạn không có gì ngoài [0:条件] và đã có một trình độ [0:基础] về ngôn ngữ, thì việc đi ra nước ngoài là một lựa chọn tốt. Nhưng nhiều người vấp phải chút khó khăn ban đầu, [0:于是] mới bắt đầu đã bỏ cuộc. Muốn học tốt ngôn ngữ trước hết cần tin tưởng chính mình và đặt [0:信心] vào việc mình nhất định sẽ học được ngôn ngữ đó thì mới thành công."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "地球上所有的国家[1:加起来]只有200多个，[2:而]全世界已经知道的语言却超过了5000种。语言不但是人们交流和表达的工具，而且是民族文化不可缺少的部分。可惜的是，[3:由于]不注意保护和使用人数的减少，许多民族的语言慢慢成为了历史，我们对它们的全部了解也只剩下了一个名字。",
          "py": "Dìqiú shang suǒyǒu de guójiā [1:jiā qǐlai] zhǐyǒu liǎng bǎi duō gè, [2:ér] quán shìjiè yǐjīng zhīdào de yǔyán què chāoguò le wǔqiān zhǒng. Yǔyán búdàn shì rénmen jiāoliú hé biǎodá de gōngjù, érqiě shì mínzú wénhuà bù kě quēshǎo de bùfen. Kěxī de shì, [3:yóuyú] bú zhùyì bǎohù hé shǐyòng rénshù de jiǎnshǎo, xǔduō mínzú de yǔyán mànman chéngwéi le lìshǐ, wǒmen duì tāmen de quánbù liǎojiě yě zhǐ shèng xià le yí gè míngzi.",
          "vi": "Tất cả các quốc gia trên Trái Đất [1:cộng lại] chỉ có hơn 200, [2:nhưng] ngôn ngữ mà thế giới biết tới đã hơn 5.000 loại. Ngôn ngữ không chỉ là công cụ để con người giao tiếp và biểu đạt, mà còn là một bộ phận không thể thiếu của văn hóa dân tộc. Điều đáng tiếc là [3:do] không chú ý bảo vệ và số lượng người sử dụng ngày càng giảm, ngôn ngữ của nhiều dân tộc đã dần trở thành lịch sử, và tất cả những gì chúng ta biết về chúng chỉ còn lại một cái tên."
        },
        {
          "who": "",
          "zh": "怎样才能说一口流利的外语呢？如果你有一定的语言基础和经济条件，那么出国走走是最好的选择。学习一种语言不是简单的事情，许多人在开始学的时候觉得很困难，[4:于是]就放弃了。但是只要坚持下去，从最基础的东西学起，慢慢就会发现自己的变化。这时候信心就会增加，我们离学好这门语言的那一天也越来越近了。",
          "py": "Zěnyàng cáinéng shuō yì kǒu liúlì de wàiyǔ ne? Rúguǒ nǐ yǒu yídìng de yǔyán jīchǔ hé jīngjì tiáojiàn, nàme chūguó zǒuzou shì zuì hǎo de xuǎnzé. Xuéxí yì zhǒng yǔyán búshì jiǎndān de shìqing, xǔduō rén zài kāishǐ xué de shíhou juéde hěn kùnnan, [4:yúshì] jiù fàngqì le. Dànshì zhǐyào jiānchí xiàqu, cóng zuì jīchǔ de dōngxi xué qǐ, mànman jiù huì fāxiàn zìjǐ de biànhuà. Zhè shíhou xìnxīn jiù huì zēngjiā, wǒmen lí xué hǎo zhè mén yǔyán de nà yì tiān yě yuè lái yuè jìn le.",
          "vi": "Làm thế nào để có thể nói lưu loát một ngoại ngữ? Nếu bạn đã có một nền tảng ngôn ngữ và điều kiện kinh tế nhất định thì việc đi ra nước ngoài là lựa chọn tốt nhất. Học ngoại ngữ không phải là chuyện đơn giản, nhiều người cảm thấy khó khăn khi mới học [4:nên] đã bỏ cuộc. Nhưng chỉ cần bạn kiên trì tiếp, học từ những điều cơ bản nhất, bạn sẽ dần dần khám phá ra những thay đổi của chính mình. Lúc này sự tự tin sẽ tăng lên, chúng ta ngày càng tiến gần hơn đến ngày học tốt ngôn ngữ này."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "加起来",
          "np": "NP 1.1"
        },
        {
          "n": 2,
          "label": "而",
          "np": "NP 1.2"
        },
        {
          "n": 3,
          "label": "由于",
          "np": "NP 1.3"
        },
        {
          "n": 4,
          "label": "于是",
          "np": "NP 1.4"
        }
      ]
    }
  ],
  "52": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Khi giao tiếp với người nước ngoài, tốt nhất bạn nên tìm hiểu văn hóa đất nước của họ trước, [0:否则] tìm hiểu sẽ làm ảnh hưởng đến hiệu quả giao tiếp, dễ khiến hai bên [0:误会] ý của nhau, [0:引起] rắc rối không đáng có."
        },
        {
          "who": "",
          "zh": "Sự nồng hậu và [0:友好] của người Trung Quốc đối với anh em họ hàng [0:亲戚], nội ngoại và anh em bạn bè nổi tiếng khắp thế giới. Cho dù ai là khách, người Trung Quốc sẽ [0:往往] chọn lấy những thứ ngon nhất trong nhà ra mời khách ăn, [0:即使] trong nhà chỉ còn có món [0:饺子] hấp có hình nén bạc, mì sợi, [0:包子] hai trứng cút cũng sẽ để khách ăn no, ăn đủ. Nếu đó là một người bạn rất quan trọng, người Trung Quốc sẽ đưa ra lời [0:邀请] khách quý đi ăn ở nhà hàng, họ làm như thế [0:以表示] sự tôn trọng và phép [0:礼貌] với khách."
        },
        {
          "who": "",
          "zh": "Ngoài các tên chính thức, người Trung Quốc thường có một [0:小名] để gọi ở nhà. Thường thì trước khi đứa trẻ được [0:出生], cha mẹ đã [0:起] biệt danh đó để gọi trẻ. Các biệt hiệu thường đều dễ nghe dễ nhớ, và hầu hết chúng thường là từ có hai âm [0:相同] với nhau, [0:例如] như \"Lạc Lạc\", \"Tiếu Tiếu\", \"Thông Thông\", v.v..."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "与不同国家的人交流时，最好先了解一下这个国家的文化，[1:否则]很可能会影响正常的交流活动，稍不注意还可能会引起误会，带来麻烦。",
          "py": "Yǔ bùtóng guójiā de rén jiāoliú shí, zuì hǎo xiān liǎojiě yíxià zhège guójiā de wénhuà, [1:fǒuzé] hěn kěnéng huì yǐngxiǎng zhèngcháng de jiāoliú huódòng, shāo bú zhùyì hái kěnéng huì yǐnqǐ wùhuì, dài lái máfan.",
          "vi": "Khi giao tiếp với những người đến từ các quốc gia khác nhau, tốt nhất bạn nên tìm hiểu văn hóa của quốc gia đó trước, [1:nếu không] rất có thể ảnh hưởng đến hoạt động giao tiếp bình thường, và một chút bất cẩn có thể khiến hiểu nhầm và gây ra rắc rối."
        },
        {
          "who": "",
          "zh": "中国人对亲戚和朋友的热情、友好，在全世界都是有名的。客人来了，中国人一定要把家里最好吃的东西拿出来给客人吃，[2:即使]只有饺子、面条儿、包子，也得让客人吃个够、吃个饱。如果是很重要的朋友，中国人[3:往往]会邀请他们去餐厅吃，[4:以]表示对客人的尊重和礼貌。",
          "py": "Zhōngguó rén duì qīnqi hé péngyou de rèqíng, yǒuhǎo, zài quán shìjiè dōu shì yǒumíng de. Kèrén lái le, Zhōngguó rén yídìng yào bǎ jiālǐ zuì hǎochī de dōngxi ná chūlái gěi kèrén chī, [2:jíshǐ] zhǐyǒu jiǎozi, miàntiáor, bāozi, yě děi ràng kèrén chī gè gòu, chī gè bǎo. Rúguǒ shì hěn zhòngyào de péngyou, Zhōngguó rén [3:wǎngwǎng] huì yāoqǐng tāmen qù cāntīng chī, [4:yǐ] biǎoshì duì kèrén de zūnzhòng hé lǐmào.",
          "vi": "Sự nồng hậu và thân thiện của người Trung Quốc với họ hàng và bạn bè nổi tiếng khắp thế giới. Khi khách đến, người Trung Quốc nhất định sẽ mang những thứ ngon nhất trong nhà ra mời khách ăn, [2:kể cả] chỉ có bánh chẻo, mì sợi, bánh bao cũng phải mời khách ăn đầy đủ, ăn no. Nếu đó là một người bạn rất quan trọng, người Trung Quốc [3:thường] sẽ mời đi nhà hàng ăn, [4:để] thể hiện sự tôn trọng và lịch sự với khách."
        },
        {
          "who": "",
          "zh": "除了正式的名字，中国人一般都有个小名。孩子往往还没出生，父母就已经起好了小名。小名都比较好听好记，而且多数是两个相同的字，例如\"乐乐\"\"笑笑\"\"聪聪\"等。",
          "py": "Chúle zhèngshì de míngzi, Zhōngguó rén yìbān dōu yǒu gè xiǎo míng. Háizi wǎngwǎng hái méi chūshēng, fùmǔ jiù yǐjīng qǐ hǎo le xiǎo míng. Xiǎo míng dōu bǐjiào hǎotīng hǎojì, érqiě duōshù shì liǎng gè xiāngtóng de zì, lìrú \"lè le\" \"xiào xiao\" \"cōng cong\" děng.",
          "vi": "Ngoài tên gọi chính thức, người Trung Quốc thường có một biệt danh. Thường thì cha mẹ đã đặt biệt danh trước khi đứa trẻ được sinh ra. Các biệt danh thường đều dễ nghe dễ nhớ, hầu hết thường là từ có hai âm tiết giống nhau, ví dụ \"Lạc Lạc\", \"Tiếu Tiếu\", \"Thông Thông\", v.v."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "否则",
          "np": "NP 2.1"
        },
        {
          "n": 2,
          "label": "即使",
          "np": "NP 2.2"
        },
        {
          "n": 3,
          "label": "往往",
          "np": "NP 2.3"
        },
        {
          "n": 4,
          "label": "以",
          "np": "NP 2.4"
        }
      ]
    }
  ],
  "53": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Chúng ta cần đi du lịch. Việc đi [0:旅行] có thể làm phong phú thêm [0:经历] muôn màu cuộc sống của bạn. Nhưng trước khi có thể [0:享受] sự thư giãn của chuyến đi, bạn nên lên kế hoạch trước, chẳng hạn như sẽ đi [0:参观] mấy [0:地点] một ngày thì vừa thời gian và sức lực, từ nơi xuất phát đến [0:目的地] đi như thế nào cho tiện, tự đi hay tìm một [0:导游] là người dân địa phương dẫn đi giới thiệu về từng địa điểm, làm sao để tìm trên mạng những bài hướng dẫn đầy [0:信息] hữu ích về gợi ý ăn uống, vui chơi. Bạn lên kế hoạch càng [0:详细] bao nhiêu, thì bạn đi du lịch càng dễ dàng bấy nhiêu."
        },
        {
          "who": "",
          "zh": "Từ phía Bắc Trung Quốc xuống tới phía Nam có [0:距离] vào khoảng 5.500 km, [0:因此] mà hai miền có sự [0:区别] một trời một vực về khí hậu. Nhiều nơi ở miền Nam, mùa đông không lạnh chút nào, [0:温度] hằng ngày chỉ khoảng 20 độ, tương tự như mùa xuân miền Bắc, vào khoảng thời gian tháng 2 đầu năm trời đã rất [0:暖和] rồi, không còn lạnh nữa. Trong [0:段] thời gian giao mùa này, chỉ cần áo khoác mỏng hoặc một chiếc [0:毛衣] làm lông cừu mỏng là được rồi. Cây thay lá mới, hoa cũng nở rộ, cảnh sắc thật [0:十分] rực rỡ. Vì vậy, nhiều người miền Bắc rất thích lên xe [0:出发] đi du lịch miền Nam vào thời điểm này."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "人一定要旅行，旅行能丰富你的经历，不仅会让你对很多事情有新的认识和看法，享受旅行时还能让你变得更自信。但去旅游前最好做个计划，比如要去参观几个地点，怎么坐车，带哪些东西，一共要玩儿多少天，要不要找导游，了解目的地的信息，一路怎么吃喝玩乐等。把这些都详细计划好，旅游时才会过得更轻松。",
          "py": "Rén yídìng yào lǚxíng, lǚxíng néng fēngfù nǐ de jīnglì, bùjǐn huì ràng nǐ duì hěn duō shìqing yǒu xīn de rènshi hé kànfǎ, xiǎngshòu lǚxíng shí hái néng ràng nǐ biàn de gèng zìxìn. Dàn qù lǚyóu qián zuì hǎo zuò gè jìhuà, bǐrú yào qù cānguān jǐ gè dìdiǎn, zěnme zuò chē, dài nǎxiē dōngxi, yígòng yào wánr duōshao tiān, yào bu yào zhǎo dǎoyóu, liǎojiě mùdìdì de xìnxī, yílù zěnme chī hē wán lè děng. Bǎ zhèxiē dōu xiángxì jìhuà hǎo, lǚyóu shí cái huì guò de gèng qīngsōng.",
          "vi": "Con người nhất định cần đi du lịch. Du lịch có thể làm phong phú thêm trải nghiệm của bạn. Du lịch không chỉ mang lại cho bạn sự hiểu biết và cái nhìn mới về mọi vật, mà còn khiến bạn tự tin hơn khi tận hưởng chuyến du lịch. Nhưng tốt nhất bạn nên lên kế hoạch trước khi đi du lịch, chẳng hạn như tham quan bao nhiêu nơi, đi tàu xe như thế nào, mang theo những gì, chơi tổng cộng bao nhiêu ngày hoặc có cần tìm một hướng dẫn viên du lịch không? Hiểu rõ những thông tin về điểm đến và trong cả chuyến du lịch sẽ ăn uống và vui chơi như thế nào. Lên kế hoạch chi tiết cho tất cả những điều này, sẽ giúp bạn đi du lịch dễ dàng hơn."
        },
        {
          "who": "",
          "zh": "中国南北方距离大约5500公里，[1:因此]南北气候有很大区别。南方很多地方的冬天一点儿也不冷，温度跟北方春天差不多，2月份的时候已经很暖和了，这段时间人们可以只穿一件毛衣了，树长新叶，花也开了，[2:十分]漂亮。所以这个时候很多北方人喜欢出发去南方旅游。",
          "py": "Zhōngguó nán běi fāng jùlí dàyuē wǔ qiān wǔ bǎi gōnglǐ, [1:yīncǐ] nánběi qìhòu yǒu hěn dà qūbié. Nánfāng hěn duō dìfang de dōngtiān yìdiǎnr yě bù lěng, wēndù gēn běifāng chūntiān chàbuduō, èr yuèfèn de shíhou yǐjīng hěn nuǎnhuo le, zhè duàn shíjiān rénmen kěyǐ zhǐ chuān yí jiàn máoyī le, shù zhǎng xīn yè, huā yě kāi le, [2:shífēn] piàoliang. Suǒyǐ zhège shíhou hěn duō běifāng rén xǐhuan chūfā qù nánfāng lǚyóu.",
          "vi": "Khoảng cách giữa Bắc - Nam của Trung Quốc là khoảng 5.500 km, [1:do đó] có sự khác biệt lớn về khí hậu giữa 2 miền. Nhiều nơi ở miền Nam, mùa đông không lạnh chút nào, nhiệt độ cũng tương tự như mùa xuân miền Bắc, vào tháng 2 trời đã rất ấm. Trong thời gian này, người ta chỉ cần mặc một chiếc áo len là được rồi. Cây thay lá mới, hoa cũng nở rộ, cảnh sắc [2:rất] đẹp. Vì vậy, vào thời điểm này, nhiều người miền Bắc thích đi miền Nam du lịch."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "因此",
          "np": "NP 3.1"
        },
        {
          "n": 2,
          "label": "十分",
          "np": "NP 3.2"
        }
      ],
      "note": {
        "title": "Chú thích",
        "text": "1. 吃喝玩乐 /chī hē wán lè/ là cụm bốn chữ dùng để diễn tả ý \"ăn chơi hưởng thụ\".\n2. 月份 /yuèfèn/ là cách diễn đạt văn viết của từ 月 khi nói về thời gian, thường dịch là \"tháng\"."
      }
    }
  ],
  "54": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Phương tiện [0:交通] là một phần không thể thiếu trong cuộc sống, như [0:汽车] 4 chỗ - 7 chỗ, máy bay, tàu thuyền,... Nhờ giao thông phát triển mà khoảng cách [0:之间] người với người được [0:拉] gần lại, sự phát triển ấy có thể tăng cường phát triển kinh tế [0:并且] nâng cao chất lượng cuộc sống của người dân."
        },
        {
          "who": "",
          "zh": "Hiện nay trên thế giới ước tính có [0:大概] 80-81 quốc gia đã có [0:公路] cao tốc. Đường [0:高速] nói chung có thể thích hợp với [0:速度] trên 120 km/h trở lên. Sự [0:出现] của đường cao tốc mang lại cả [0:优点] và nhược điểm. Tốc độ nhanh, vận hành [0:安全] tiết kiệm, chúng ta vì chỉ cần [0:乘坐] yên vị trên ghế là dễ dàng di chuyển giữa các nơi. Tuy ưu điểm là thế, [0:然而] đường cao tốc lại tác động lớn đến môi trường và mức phí tại các trạm [0:收费] đường bộ khá cao."
        },
        {
          "who": "",
          "zh": "Hiện nay ở các thành phố, ngày càng nhiều người lựa chọn đi bộ đi làm, lý do [0:共同] mà họ đưa ra là bởi như thế không chỉ rèn luyện thân thể, tiết kiệm [0:金钱] di chuyển hằng tháng, mà còn giảm [0:堵车] giao thông giờ cao điểm."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "交通工具是生活中不可缺少的一部分。常见的交通工具有汽车、飞机、船等，这一切拉近了人与人之间的距离，[1:并且]增加了各地方之间的经济联系和发展，提高人们的生活质量。",
          "py": "Jiāotōng gōngjù shì shēnghuó zhōng bùkě quēshǎo de yí bùfen. Chángjiàn de jiāotōng gōngjù yǒu qìchē, fēijī, chuán děng, zhè yíqiè lā jìn le rén yǔ rén zhī jiān de jùlí, [1:bìngqiě] zēngjiā le gè dìfang zhī jiān de jīngjì liánxì hé fāzhǎn, tígāo rénmen de shēnghuó zhìliàng.",
          "vi": "Phương tiện giao thông là một phần không thể thiếu trong cuộc sống. Một số phương tiện giao thông phổ biến là ô tô, máy bay, tàu thuyền,... tất cả đều rút ngắn khoảng cách giữa con người với nhau, tăng cường kết nối và phát triển kinh tế giữa các nơi, [1:và] nâng cao chất lượng cuộc sống của người dân."
        },
        {
          "who": "",
          "zh": "现在全世界[2:大概]80多个国家有高速公路。高速公路一般能适应每小时120公里以上的速度。高速公路的出现既带来了优点，也有些缺点，虽然速度快，安全，方便人们乘坐，[3:然而]对环境影响也大、收费高。",
          "py": "Xiànzài quán shìjiè [2:dàgài] 80 duō gè guójiā yǒu gāosù gōnglù. Gāosù gōnglù yìbān néng shìyìng měi xiǎoshí 120 gōnglǐ yǐshàng de sùdù. Gāosù gōnglù de chūxiàn jì dài lái le yōudiǎn yě yǒuxiē quēdiǎn, suīrán sùdù kuài, ānquán, fāngbiàn rénmen chéngzuò, [3:rán'ér] duì huánjìng yǐngxiǎng yě dà, shōufèi gāo.",
          "vi": "Hiện nay trên thế giới [2:hơn] 80 quốc gia đã có đường cao tốc. Đường cao tốc nói chung có thể thích hợp với tốc độ trên 120 km/h trở lên. Sự ra đời của đường cao tốc mang lại cả ưu và nhược điểm. Tuy chúng nhanh, an toàn, thuận tiện cho người dân đi lại, [3:nhưng lại] tác động lớn đến môi trường và mức thu phí cao."
        },
        {
          "who": "",
          "zh": "现在，城市里越来越多的\"汽车族\"变成了\"弃车族\"，走路上下班成为他们共同的生活习惯。人们放弃开车，不仅能锻炼身体，节约金钱，还减少路上堵车情况，这样一来，连空气也变新鲜了。",
          "py": "Xiànzài, chéngshì lǐ yuè lái yuè duō de \"qìchē zú\" biàn chéng le \"qì chē zú\", zǒulù shàng xià bān chéngwéi tāmen gòngtóng de shēnghuó xíguàn. Rénmen fàngqì kāichē, bùjǐn néng duànliàn shēntǐ, jiéyuē jīnqián, hái jiǎnshǎo lùshang dǔchē qíngkuàng, zhèyàng yì lái, lián kōngqì yě biàn xīnxiān le.",
          "vi": "Giờ đây, ở các thành phố ngày càng có nhiều \"dân xe hơi\" trở thành \"dân không xe\", và việc đi bộ đi làm, tan làm đã trở thành thói quen sinh hoạt chung của họ. Mọi người từ bỏ việc lái xe, không chỉ rèn luyện thân thể, tiết kiệm chi phí mà còn giảm ùn tắc giao thông trên đường. Hiện tượng như vậy xuất hiện, không khí cũng trở nên trong lành hơn."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "并且",
          "np": "NP 4.1"
        },
        {
          "n": 2,
          "label": "大概",
          "np": "NP 4.2"
        },
        {
          "n": 3,
          "label": "然而",
          "np": "NP 4.3"
        }
      ]
    }
  ],
  "55": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Các nhà khoa học đã phát hiện ra rằng khi con người [0:感觉] đói, cơ thể sẽ đưa nhầm tín hiệu để [0:骗] mọi người và khiến [0:食物] trông ngon mắt hơn, tăng sức [0:吸引] với chúng ta hơn. Vì vậy, đừng đi siêu thị khi [0:肚子] đang cảm thấy đói, bạn sẽ dễ bị dụ mua những thứ mà trong [0:实际] bạn cũng không cần đến."
        },
        {
          "who": "",
          "zh": "Mùi vị rất [0:关键] đối với sức khỏe, chỉ cần bạn thay đổi thói quen một [0:稍微] xíu thôi là có thể thay đổi được sức khỏe. Ví dụ, khi ăn cơm tăng thêm nhiều [0:盐] trắng mặn chát hay nhiều [0:糖] ngọt lịm có thể làm cho nhịp điệu tích tắc của [0:钟] sinh học trong cơ thể nhanh hơn và làm cho người lười vận động cũng trở nên năng động hơn. Đó là cách khiến đồng hồ [0:生物] chạy nhanh, còn [0:相反], nếu muốn làm chậm lại, uống rượu vang đỏ làm từ quả [0:葡萄] sẽ là giải pháp khả thi."
        },
        {
          "who": "",
          "zh": "Các nhà khoa học thường xuyên đưa lời khuyên và [0:提醒] mọi người rằng, tốt nhất là không nên ngồi [0:静] một chỗ liên tục 4 tiếng mỗi ngày, nhất là những người ngồi văn phòng, phải đứng dậy đi lại vận động khi có thời gian. Sau khi tan làm, nên vận động cơ thể như chơi [0:网球] sân đất nện, môn [0:乒乓球] với tiếng đập ping-pong của quả bóng vào bàn và vợt gỗ, hay luyện tập môn [0:羽毛球] giỏi như tay vợt Nguyễn Tiến Minh,.... Đừng quên rằng [0:生命] của bạn dài hay ngắn, chính là nhờ vào vận động, bạn phải [0:记住] đấy nhé!"
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "科学家研究发现，人在感觉饿的时候，身体会骗人，让食物看起来更吸引人。因此在肚子饿的时候去超市，你就容易买很多实际上并不需要的东西。",
          "py": "Kēxuéjiā yánjiū fāxiàn, rén zài gǎnjué è de shíhou, shēntǐ huì piàn rén, ràng shíwù kàn qǐlai gèng xīyǐn rén. Yīncǐ zài dùzi è de shíhou qù chāoshì, nǐ jiù róngyì mǎi hěn duō shíjì shang bìng bù xūyào de dōngxi.",
          "vi": "Các nhà khoa học đã phát hiện ra rằng khi con người cảm thấy đói, cơ thể sẽ đánh lừa mọi người và khiến thức ăn trông hấp dẫn hơn. Vì vậy lúc đói mà đi siêu thị, bạn có thể dễ dàng mua rất nhiều thứ mà bạn không thực sự cần."
        },
        {
          "who": "",
          "zh": "味道对身体十分关键，只要稍微改变一下自己的习惯，就可以改变身体的健康。比如吃饭时增加高盐、高糖的食物，就可以使生物钟变快，使懒人变得活泼起来；而喝红葡萄酒却相反，可以使生物钟变慢。",
          "py": "Wèidao duì shēntǐ shífēn guānjiàn, zhǐyào shāowēi gǎibiàn yíxià zìjǐ de xíguàn, jiù kěyǐ gǎibiàn shēntǐ de jiànkāng. Bǐrú chī fàn shí zēngjiā gāo yán, gāo táng de shíwù, jiù kěyǐ shǐ shēngwùzhōng biàn kuài, shǐ lǎn rén biàn de huópō qǐlai; ér hē hóng pútáojiǔ què xiāngfǎn, kěyǐ shǐ shēngwùzhōng biàn màn.",
          "vi": "Mùi vị rất quan trọng đối với cơ thể, chỉ cần bạn thay đổi thói quen một chút là có thể thay đổi sức khỏe. Ví dụ, khi ăn cơm tăng thêm thực phẩm nhiều muối, nhiều đường có thể làm cho đồng hồ sinh học nhanh hơn và làm cho người lười vận động cũng trở nên năng động hơn. Ngược lại, uống rượu vang đỏ có thể làm chậm đồng hồ sinh học."
        },
        {
          "who": "",
          "zh": "科学家提醒人们，每天静坐的时间最好不要超过4小时，尤其是久坐办公室的人，有时间一定要站起来活动活动，下班后参加锻炼网球、乒乓球、羽毛球等运动。生命[1:在于]运动，一定要[2:记住]哦！",
          "py": "Kēxuéjiā tíxǐng rénmen, měitiān jìngzuò de shíjiān zuì hǎo búyào chāoguò 4 xiǎoshí, yóuqí shì jiǔ zuò bàngōngshì de rén, yǒu shíjiān yídìng yào zhàn qǐlai huódòng huódòng, xiàbān hòu cānjiā duànliàn wǎngqiú, pīngpāng qiú, yǔmáoqiú děng yùndòng. Shēngmìng [1:zàiyú] yùndòng, yídìng yào [2:jì zhù] ò!",
          "vi": "Các nhà khoa học nhắc nhở mọi người rằng, tốt nhất là không nên ngồi quá 4 tiếng mỗi ngày, nhất là những người ngồi văn phòng, phải đứng dậy đi lại vận động khi có thời gian. Sau khi tan làm, nên vận động thân thể như chơi tennis, bóng bàn, cầu lông,.... Sinh mệnh [1:nằm ở] vận động, bạn phải [2:nhớ kỹ] nhé!"
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "在于",
          "np": "NP 5.1"
        },
        {
          "n": 2,
          "label": "记住",
          "np": "NP 5.2"
        }
      ]
    }
  ],
  "56": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Việc [0:婚姻] đại sự của người trẻ hiện đại ngày nay là dựa theo cảm tính, ý kiến của bố mẹ không còn quá quan trọng. Dù quen nhau [0:通过] sự giới thiệu của bạn bè, nhưng nếu cả hai bên thiếu đi sự tôn trọng [0:互相], thiếu tin tưởng đối phương, không thể làm đối phương \"[0:感冒]\" nắng, hay khiến trái tim mình [0:感动] một cách [0:深] sắc thì người ta có thể đi mất, chuyện tình cảm [0:浪漫] vẫn chưa bắt đầu đã [0:破] thành từng mảnh rồi."
        },
        {
          "who": "",
          "zh": "Một cặp [0:夫妻] son sau khi cưới về chung một nhà, nhưng không thể phủ nhận họ từ bé được nuôi lớn và [0:成长] trong những môi trường khác nhau, nên chuyện [0:吵架] lớn tiếng sau hôn nhân không có gì là lạ. Ngược lại, thật bất bình thường nếu bạn nghĩ rằng một cuộc hôn nhân [0:幸福] mỹ mãn nghĩa là [0:永远] không bao giờ cãi vã. Học cách chấp nhận là điều rất quan trọng, học cách [0:接受] mọi việc với thái độ tích cực, đừng [0:故意] tìm cớ gây sự, phải thật [0:耐心] để lắng nghe tâm tư của đối phương, cùng đối phương [0:商量] về giải pháp, được như thế thì lâu lâu [0:偶尔] cãi vã một vài lần sẽ không ảnh hưởng [0:对于] chất lượng hôn nhân đâu."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "现代年轻人的婚姻是跟着感觉走，父母的意见已经不那么重要了。即使是[1:通过]朋友介绍互相认识，如果对对方不\"感冒\"，没有给自己留下深深的感动，也可以马上走人，浪漫故事还没开始一下子就被打破了。",
          "py": "Xiàndài niánqīng rén de hūnyīn shì gēnzhe gǎnjué zǒu, fùmǔ de yìjiàn yǐjīng bú nàme zhòngyào le. Jíshǐ shì [1:tōngguò] péngyou jièshào hùxiāng rènshi, rúguǒ duì duìfāng bù \"gǎnmào\", méiyǒu gěi zìjǐ liú xià shēnshēn de gǎndòng, yě kěyǐ mǎshàng zǒu rén, làngmàn gùshi hái méi kāishǐ yíxiàzi jiù bèi dǎpò le.",
          "vi": "Việc kết hôn của giới trẻ hiện đại ngày nay là dựa theo cảm tính, ý kiến của bố mẹ không còn quá quan trọng. Dù quen nhau [1:thông qua] sự giới thiệu của bạn bè nhưng nếu không \"cảm nắng\" nhau và khiến bản thân xúc động thì có thể rời đi ngay lập tức. Chuyện tình cảm lãng mạn vẫn chưa bắt đầu đã tan vỡ."
        },
        {
          "who": "",
          "zh": "一对夫妻不仅成长环境不同，性格爱好、习惯基础也不同，所以婚后吵架也不是什么奇怪的事。[2:相反]，要是以为幸福的婚姻就是永远不吵架，这才是不正常的。其实，只要学会以积极的态度来接受，不要故意没事找事，耐心地跟另一半共同努力，商量办法，[3:偶尔]吵吵架[4:对于]婚姻并不会影响，而且还能提高婚姻质量。",
          "py": "Yí duì fūqī bùjǐn chéngzhǎng huánjìng bùtóng, xìnggé àihào, xíguàn jīchǔ yě bùtóng, suǒyǐ hūn hòu chǎojià yě búshì shénme qíguài de shì. [2:Xiāngfǎn], yàoshi yǐwéi xìngfú de hūnyīn jiùshì yǒngyuǎn bù chǎojià, zhè cái shì bú zhèngcháng de. Qíshí, zhǐyào xuéhuì yǐ jījí de tàidù lái jiēshòu, búyào gùyì méishì zhǎoshì, nàixīn de gēn lìng yí bàn gòngtóng nǔlì, shāngliang bànfǎ, [3:ǒu'ěr] chǎochao jià [4:duìyú] hūnyīn bìng bú huì yǐngxiǎng, érqiě hái néng tígāo hūnyīn zhìliàng.",
          "vi": "Một cặp vợ chồng không chỉ lớn lên trong những môi trường khác nhau mà còn có những tính cách, sở thích, thói quen khác nhau nên chuyện cãi vã sau hôn nhân không có gì là lạ. [2:Ngược lại], thật bất bình thường nếu bạn nghĩ rằng một cuộc hôn nhân hạnh phúc nghĩa là không bao giờ cãi vã. Trên thực tế, chỉ cần bạn học cách chấp nhận với thái độ tích cực, không cố tình tìm cớ gây sự, và kiên nhẫn cùng đối phương thảo luận về biện pháp thì việc [3:thi thoảng] xảy ra cãi vã cũng sẽ không ảnh hưởng [4:đối với] hôn nhân, thậm chí nó còn có thể nâng cao chất lượng cuộc hôn nhân."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "通过",
          "np": "NP 6.1"
        },
        {
          "n": 2,
          "label": "相反",
          "np": "NP 6.2"
        },
        {
          "n": 3,
          "label": "偶尔",
          "np": "NP 6.3"
        },
        {
          "n": 4,
          "label": "对于",
          "np": "NP 6.4"
        }
      ]
    }
  ],
  "57": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Khi lựa chọn [0:职业] để làm và nuôi sống bản thân và gia đình, bạn xem [0:重] điều gì nhất? Lương, thưởng hay sự phát triển trong [0:将来] 5-10 năm nữa? Theo tôi, kiếm tiền không phải là điều quan trọng nhất, sự hứng thú mới là điều quan trọng. Làm công việc mình thích một cách nhiệt tình, bạn sẽ không cảm thấy mệt mỏi, áp lực được [0:减轻]. Không cần biết bạn là [0:律师] biện hộ, [0:警察] điều tra vụ án, [0:大夫] khám chữa bệnh, [0:记者] đưa tin báo chí, nhà [0:管理] doanh nghiệp hay [0:作家] viết tiểu thuyết, chỉ cần mỗi ngày vẫn [0:能够] làm việc vui vẻ, thì bạn thật hạnh phúc!"
        },
        {
          "who": "",
          "zh": "Sau khi tốt nghiệp Đại học, nhiều người muốn [0:申请] học bổng để học tiếp lên bậc [0:硕士] hoặc cao hơn là bậc [0:博士]. Trước tiên, chúng ta nên hiểu rõ về bản thân, không chỉ để biết mình muốn làm gì, mà còn cần dựa trên tính cách và sở thích của mình để [0:判断] nghề nghiệp nào sẽ [0:符合] với bản thân. Như vậy bạn có thể tìm được một chuyên ngành ưng ý và có khoảng thời gian du học đầy những kỷ niệm [0:美好]."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "选择职业时，你最看重什么？工资、奖金还是将来的发展？[1:在我看来]，赚钱多少不是最重要的，兴趣才是关键。带着热情去做自己喜欢的工作既不会觉得累，又能减轻压力。不管现在你是律师、警察、大夫、记者、管理者还是作家，如果你每天都能够愉快地工作，那你太幸福了！",
          "py": "Xuǎnzé zhíyè shí, nǐ zuì kànzhòng shénme? Gōngzī, jiǎngjīn háishi jiānglái de fāzhǎn? [1:Zài wǒ kàn lái], zhuànqián duōshǎo búshì zuì zhòngyào de, xìngqù cái shì guānjiàn. Dài zhe rèqíng qù zuò zìjǐ xǐhuan de gōngzuò jì bú huì juéde lèi, yòu néng jiǎnqīng yālì. Bùguǎn xiànzài nǐ shì lǜshī, jǐngchá, dàifu, jìzhě, guǎnlǐzhě háishi zuòjiā, rúguǒ nǐ měitiān dōu nénggòu yúkuài de gōngzuò, nà nǐ tài xìngfú le!",
          "vi": "Khi chọn nghề, bạn coi trọng nhất điều gì? Lương, thưởng hay sự phát triển trong tương lai? [1:Theo tôi], kiếm tiền không phải là điều quan trọng nhất, sự hứng thú mới là điều quan trọng. Làm công việc mình yêu thích với lòng nhiệt huyết vừa không cảm thấy mệt mỏi vừa giảm bớt áp lực. Cho dù bạn là luật sư, cảnh sát, bác sĩ, phóng viên, nhà quản lý hay nhà văn, nếu bạn có thể làm việc vui vẻ mỗi ngày, thì bạn thật hạnh phúc!"
        },
        {
          "who": "",
          "zh": "大学毕业后，很多人想申请奖学金，出国留学硕士、博士，积累专业的知识。我们首先应该对自己有清楚的认识，不仅要知道自己想做什么，重点还要根据自己的性格、爱好去判断什么样的职业符合自己，这样才能找到满意的专业，才会有美好的留学时间。",
          "py": "Dàxué bìyè hòu, hěn duō rén xiǎng shēnqǐng jiǎngxuéjīn, chūguó liúxué shuòshì, bóshì, jīlěi zhuānyè de zhīshi. Wǒmen shǒuxiān yīnggāi duì zìjǐ yǒu qīngchu de rènshi, bùjǐn yào zhīdào zìjǐ xiǎng zuò shénme, zhòngdiǎn hái yào gēnjù zìjǐ de xìnggé, àihào qù pànduàn shénme yàng de zhíyè fúhé zìjǐ, zhèyàng cáinéng zhǎodào mǎnyì de zhuānyè, cái huì yǒu měihǎo de liúxué shíjiān.",
          "vi": "Sau khi tốt nghiệp đại học, nhiều người muốn xin học bổng, đi du học thạc sĩ, tiến sĩ, tích lũy kiến thức chuyên môn. Trước tiên, chúng ta nên hiểu rõ về bản thân, không chỉ để biết mình muốn làm gì mà còn dựa trên tính cách và sở thích của mình để phán đoán nghề nghiệp phù hợp với bản thân, có như vậy mới tìm được ngành học ưng ý và có khoảng thời gian du học tốt đẹp."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "在…看来",
          "np": "NP 7.1"
        }
      ]
    }
  ],
  "58": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Thị trường lao động càng đông, thì sự cạnh tranh càng trở nên [0:热闹], bởi nhân sự tốt chính là [0:因素] quyết định tới sự [0:成败] của doanh nghiệp, bất kể đó là [0:企业] lớn hay vừa và nhỏ, chỉ có tìm cách giữ chân [0:人才] mới có thể giúp doanh nghiệp giành chiến [0:赢] trong cuộc cạnh tranh. Lương cao chỉ là giải pháp [0:暂时] để giữ chân nhân tài một thời gian thôi. Để phát triển trong tương lai, giữa nhiều cách khác nhau, các công ty cần [0:选取] ra các cách giúp cải thiện chất lượng môi trường làm việc, [0:增多] cơ hội học tập và phát triển nhiều hơn cho nhân sự. Đây nên là [0:方向] đúng đắn đi tới sự phát triển lâu dài của doanh nghiệp."
        },
        {
          "who": "",
          "zh": "Một kết quả [0:调查] thị trường cho biết, khi mới [0:加入] một công ty mới, các bạn trẻ ngoài việc làm tốt công việc theo [0:专门] mà mình đã học tại Đại học, học thêm cách gửi fax qua máy [0:传真], cách sử dụng máy [0:打印] để in tài liệu, [0:复印] tài liệu ra thành nhiều bản,... mà còn phải chú ý vấn đề giao tiếp với đồng nghiệp, kéo gần khoảng cách, chứng tỏ rằng bạn là một người hiểu chuyện, [0:能干] mọi việc được giao, [0:细心] đến từng chi tiết nhỏ. Thực tế chứng minh con người nhờ những trò chuyện mà thắt chặt tình [0:友谊] giữa bạn bè đồng nghiệp với nhau, từ đó công việc càng thêm suôn sẻ."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "在越来越热闹的市场竞争中，人才是决定企业发展成败的关键因素，留住人才才能帮企业在竞争中赢来成功。高工资只能暂时留住人才。考虑到将来的发展，企业必须选取有效办法提高工作环境的质量，增多人才发展的机会。这应该是企业努力的方向。",
          "py": "Zài yuè lái yuè rènao de shìchǎng jìngzhēng zhōng, réncái shì juédìng qǐyè fāzhǎn chéngbài de guānjiàn yīnsù, liú zhù réncái cái néng bāng qǐyè zài jìngzhēng zhōng yíng lái chénggōng. Gāo gōngzī zhǐ néng zànshí liú zhù réncái. Kǎolǜ dào jiānglái de fāzhǎn, qǐyè bìxū xuǎnqǔ yǒuxiào bànfǎ tígāo gōngzuò huánjìng de zhìliàng, zēngduō réncái fāzhǎn de jīhuì. Zhè yīnggāi shì qǐyè nǔlì de fāngxiàng.",
          "vi": "Trong thị trường cạnh tranh ngày càng sôi động, nhân tài chính là nhân tố quyết định sự thành bại của sự phát triển của một doanh nghiệp, chỉ có giữ chân nhân tài mới có thể giúp doanh nghiệp giành được thành công trong cạnh tranh. Lương cao chỉ có thể tạm thời giữ chân nhân tài. Cân nhắc đến sự phát triển trong tương lai, các công ty phải lựa chọn cách cải thiện chất lượng môi trường làm việc và tăng cơ hội phát triển nhân tài. Đây nên là hướng nỗ lực của doanh nghiệp."
        },
        {
          "who": "",
          "zh": "一个调查结果表示，加入新公司的时候，年轻人除了专门做好自己的工作，学会发传真，打印，复印材料等事情以外，还要注意与同事交流问题，拉近距离，表示出你是个又懂事能干，又细心友好的人。因为人们还可以通过聊天获得友谊，所以友好的同事关系几乎成为顺利完成工作的重要条件。",
          "py": "Yí ge diàochá jiéguǒ biǎoshì, jiārù xīn gōngsī de shíhou, niánqīng rén chúle zhuānmén zuò hǎo zìjǐ de gōngzuò, xuéhuì fā chuánzhēn, dǎyìn, fùyìn cáiliào děng shìqing yǐwài, hái yào zhùyì yǔ tóngshì jiāoliú wèntí, lā jìn jùlí, biǎoshì chū nǐ shì ge yòu dǒngshì nénggàn, yòu xìxīn yǒuhǎo de rén. Yīnwèi rénmen hái kěyǐ tōngguò liáotiān huòdé yǒuyì, suǒyǐ yǒuhǎo de tóngshì guānxi jīhū chéngwéi shùnlì wánchéng gōngzuò de zhòngyào tiáojiàn.",
          "vi": "Một kết quả khảo sát cho biết, khi gia nhập một công ty mới, các bạn trẻ ngoài việc làm tốt công việc chuyên môn của mình, học cách gửi fax, in ấn, sao chép tài liệu,... mà còn phải chú ý vấn đề giao tiếp với đồng nghiệp, kéo gần khoảng cách, chứng tỏ rằng bạn là người vừa hiểu chuyện, có năng lực, lại vừa tinh tế, thân thiện. Bởi vì con người thông qua trò chuyện mà có được tình bạn, vì vậy có mối quan hệ đồng nghiệp tốt dường như đã trở thành điều kiện quan trọng để hoàn thành công việc một cách suôn sẻ."
        }
      ],
      "note": {
        "title": "Ngữ pháp đã học trong bài",
        "text": "Bài này không có ngữ pháp mới. Ôn lại: 必须 (NP 11.2, Tăng tốc): 企业必须选取办法提高工作环境的质量 · 除了…(以外) (NP 5.4, Tăng tốc): 年轻人除了专门做好自己的工作… · 几乎 (NP 13.1, Tăng tốc): 友好的同事关系几乎成为顺利完成…"
      }
    }
  ],
  "59": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Một kết quả khảo sát đã [0:证明] một thực tế và [0:指出] rằng 70% mọi người khi gặp câu hỏi khó thì điều đầu tiên họ nghĩ đến là tìm [0:答案] ở trên mạng, tất nhiên, quen thuộc nhất chính là [0:网址] Google.com.vn. [0:回忆] về kỷ niệm chỉ chục năm trước đây, để gửi một lá thư cần mất vài ngày, nhưng bây giờ thậm chí không cần đến [0:邮局] gửi thư, cũng không cần dùng [0:信封] và dán tem lên, chỉ cần gửi [0:短信] qua tin nhắn hoặc lên mạng gửi email là được rồi. Tin tức ở [0:外地] nhiều khi phải vài ngày sau mới được cập nhật địa phương mình, thì bây giờ lên mạng và truy cập vào một [0:网页], bất kỳ thông tin nào cũng có thể được trao đổi một cách [0:直接] không giới hạn với mọi người trên khắp thế giới. Cuộc cách mạng [0:科技] 4.0 mang đến nhiều [0:作用] tích cực cho đời sống, giúp xã hội [0:转] sang nền kinh tế số, mang đến cho con người ngày càng nhiều sự lựa chọn."
        },
        {
          "who": "",
          "zh": "Làm thế nào để có thể nhớ được nhiều [0:密码] được sử dụng khi lên mạng? Không ít người sử dụng mật khẩu là một chuỗi [0:数字] dễ nhớ, ví dụ 123456. Nhưng để nâng cao an ninh khi lên [0:网络], nhiều trang web đưa ra [0:规定] mật khẩu phải là 1 dãy [0:号码] phức tạp và có chứa [0:文字] đặc biệt như @, #, *..."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "一个调查结果证明并指出，百分之七十的人遇到问题时，首先想到的就是上网找答案，当然最熟悉的就是Google网址了。回忆以前，寄信需要好几天，现在连邮局都不用去，信封都[1:用不着]，只要发短信或上网发个电子邮件。以前外地的新闻要几天后才能知道，现在有了网页，任何消息都可以在第一时间和全世界的人们直接交流。科技发展的积极作用让社会转向数字经济，让人们的选择越来越多了。",
          "py": "Yí ge diàochá jiéguǒ zhèngmíng bìng zhǐchū, bǎi fēn zhī qīshí de rén yù dào wèntí shí, shǒuxiān xiǎng dào de jiùshì shàng wǎng zhǎo dá'àn, dāngrán zuì shúxī de jiùshì Google wǎngzhǐ le. Huíyì yǐqián, jì xìn xūyào hǎo jǐ tiān, xiànzài lián yóujú dōu búyòng qù, xìnfēng dōu [1:yòng bù zháo], zhǐyào fā duǎnxìn huò shàng wǎng fā ge diànzǐ yóujiàn. Yǐqián wàidì de xīnwén yào jǐ tiān hòu cáinéng zhīdào, xiànzài yǒu le wǎngyè, rènhé xiāoxi dōu kěyǐ zài dì yī shíjiān hé quán shìjiè de rénmen zhíjiē jiāoliú. Kējì fāzhǎn de jījí zuòyòng ràng shèhuì zhuǎnxiàng shùzì jīngjì, ràng rénmen de xuǎnzé yuè lái yuè duō le.",
          "vi": "Một kết quả khảo sát đã chứng minh và chỉ ra rằng 70% số người khi gặp vấn đề thì điều đầu tiên họ nghĩ đến là tìm câu trả lời trên mạng, tất nhiên, quen thuộc nhất chính là trang web Google. Nhớ lại trước đây, để gửi một lá thư cần mất vài ngày, bây giờ thậm chí không cần đến bưu điện, [1:cũng không cần dùng tới] phong bì, chỉ cần gửi tin nhắn hoặc lên mạng gửi email. Trước đây, tin tức ở nơi khác phải vài ngày sau mới biết, giờ có web, bất kỳ tin tức nào cũng có thể được trao đổi trực tiếp với mọi người trên khắp thế giới ngay lúc đầu tiên. Những tác động tích cực của sự phát triển công nghệ đã chuyển xã hội sang nền kinh tế số, con người càng nhiều sự lựa chọn."
        },
        {
          "who": "",
          "zh": "很多人都遇到过这样的问题：怎么才能记住上网用的很多密码呢？不少人为了方便，直接用了\"123456\"这样好记的\"懒人密码\"。为了提高网络安全，很多网站规定密码必须是一段复杂号码和特别文字。",
          "py": "Hěn duō rén dōu yù dào guo zhèyàng de wèntí: Zěnme cáinéng jì zhù shàng wǎng yòng de hěn duō mìmǎ ne? Bù shǎo rén wèile fāngbiàn, zhíjiē yòng le \"123456\" zhèyàng hǎo jì de \"lǎn rén mìmǎ\". Wèile tígāo wǎngluò ānquán, hěn duō wǎngzhàn guīdìng mìmǎ bìxū shì yí duàn fùzá hàomǎ hé tèbié wénzì.",
          "vi": "Nhiều người đã gặp câu hỏi này: Làm thế nào có thể nhớ được nhiều mật khẩu được sử dụng khi lên mạng? Để thuận tiện, không ít người đã đưa ra \"mật khẩu dành cho người lười\" dễ nhớ như \"123456\". Để nâng cao an ninh mạng, nhiều trang web quy định mật khẩu phải là 1 dãy số phức và ký tự đặc biệt."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "用不着",
          "np": "NP 9.1"
        }
      ]
    }
  ],
  "60": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Siêu thị là nơi [0:提供] thực phẩm và các mặt hàng [0:消费] cho người dân. Vì thế, để tìm hiểu nhu cầu và thu hút thêm [0:顾客] đến siêu thị [0:购买] các loại [0:商品] đa dạng chủng loại, nhiều siêu thị đã [0:推] ra thị trường dịch vụ mới lạ, chính là [0:服务] \"cho khách ăn thử\": Bên này cho ăn thử [0:饼干] Danisa giòn rụm loại mới, đằng kia thấy loa từ hệ thống đài [0:广播] của siêu thị mời qua uống thử [0:矿泉水] LaVie. Vì những \"bữa [0:午餐] miễn phí\" mỗi buổi trưa ngày càng trở nên phổ biến, những người đi siêu thị chỉ để ăn thử đồ mà không mua hàng được [0:叫作] \"người nếm thử chuyên nghiệp\"."
        },
        {
          "who": "",
          "zh": "Việc cạnh tranh cũng giống như một [0:场] thi đấu thể thao, có cạnh tranh thì người xem mới thấy trận đấu [0:精彩] và hấp dẫn. Thương trường cũng vậy, giữa một rừng sản phẩm, tại sao người tiêu dùng lại nên chọn mua [0:产品] này mà không phải sản phẩm kia. Để cạnh tranh, các doanh nghiệp đã [0:进行] nhiều biện pháp như nghiên cứu cải tiến [0:特点] đặc trưng riêng của mỗi sản phẩm, [0:降低] giá bán xuống cho vừa túi tiền phổ thông hơn, bổ sung phương thức [0:付款] nhiều hơn tiền mặt, qua thẻ, quét mã... Những điều này [0:说明]: Khi các doanh nghiệp cạnh tranh, người được lợi chính là người tiêu dùng."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "为了了解顾客的需要，吸引顾客购买商品，很多超市推出了\"试吃\"服务：这边有新出的饼干免费试吃，那边超市广播说有新出的矿泉水免费试喝。由于这样\"免费的午餐\"越来越普遍，人们[1:把]到超市只吃不买的人[1:叫作]\"专业试吃族\"。",
          "py": "Wèile liǎojiě gùkè de xūyào, xīyǐn gùkè gòumǎi shāngpǐn, hěn duō chāoshì tuīchū le \"shì chī\" fúwù: Zhè biān yǒu xīn chū de bǐnggān miǎnfèi shì chī, nà biān chāoshì guǎngbō shuō yǒu xīn chū de kuàngquán shuǐ miǎnfèi shì hē. Yóuyú zhèyàng \"miǎnfèi de wǔcān\" yuè lái yuè pǔbiàn, rénmen [1:bǎ] dào chāoshì zhǐ chī bù mǎi de rén [1:jiàozuò] \"zhuānyè shì chī zú\".",
          "vi": "Để tìm hiểu nhu cầu của khách hàng và thu hút khách mua hàng, nhiều siêu thị đã tung ra dịch vụ \"ăn thử\": Bên này siêu thị có bánh quy mới cho nếm thử miễn phí, đằng kia đài phát thanh siêu thị nói có nước khoáng mới miễn phí uống thử. Vì những \"bữa trưa miễn phí\" ngày càng trở nên phổ biến, những người đi siêu thị để ăn thử nhưng không mua hàng [1:được gọi là] \"người nếm thử chuyên nghiệp\"."
        },
        {
          "who": "",
          "zh": "竞争对一个国家的经济发展有很大的好处，就好像一场体育比赛，有了竞争，比赛才会更精彩。对一个企业也是这样。为了竞争，各企业都进行很多方法，比如注意研究提高产品的质量，降低产品的价格，注意提供更多售后服务，方便顾客的付款方式等。这些说明：企业竞争，赢家就是消费者。",
          "py": "Jìngzhēng duì yí ge guójiā de jīngjì fāzhǎn yǒu hěn dà de hǎochu, jiù hǎoxiàng yì chǎng tǐyù bǐsài, yǒu le jìngzhēng, bǐsài cái huì gèng jīngcǎi. Duì yí ge qǐyè yěshì zhèyàng. Wèile jìngzhēng, gè qǐyè dōu jìnxíng hěn duō fāngfǎ, bǐrú zhùyì yánjiū tígāo chǎnpǐn de zhìliàng, jiàngdī chǎnpǐn de jiàgé, zhùyì tígōng gèng duō shòuhòu fúwù, fāngbiàn gùkè de fùkuǎn fāngshì děng. Zhèxiē shuōmíng: Qǐyè jìngzhēng, yíngjiā jiù shì xiāofèizhě.",
          "vi": "Cạnh tranh mang lại lợi ích to lớn cho sự phát triển kinh tế của một quốc gia, cũng giống như một trò chơi thể thao, có cạnh tranh thì trò chơi sẽ thú vị hơn. Điều này cũng đúng đối với một doanh nghiệp. Để cạnh tranh, các công ty đều áp dụng nhiều phương pháp như chú ý nghiên cứu nâng cao chất lượng sản phẩm, giảm giá thành sản phẩm, cung cấp thêm nhiều dịch vụ hậu mãi, cung cấp phương thức thanh toán thuận tiện cho khách hàng. Những điều này cho thấy rõ: Doanh nghiệp cạnh tranh, người chiến thắng chính là người tiêu dùng."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "把…叫作",
          "np": "NP 10.1"
        }
      ]
    }
  ],
  "61": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Nếu bạn thấy con mình bất ngờ [0:扔] bừa bãi đồ đạc, làm cả nhà [0:乱] hết cả lên, xin đừng mắng con bằng những từ như \"con hư thế\", \"sao mà [0:笨] như bò\", \"nhanh nhảu [0:粗心], sao chẳng cẩn thận gì\" hay \"bất lịch sự thế\". Điều này có thể là do chúng đang gặp khó khăn hoặc đang tức giận nên mới [0:生气] cả chém thớt. Nhưng [0:之前] khi cha mẹ phê bình con, thì phải đi tìm nguyên nhân sâu xa một cách thật [0:仔细] để tránh phán đoán sai lầm. Cha mẹ nên dừng việc đang làm, [0:同时] ngay lúc đó nên ngồi xuống bên con luôn, [0:陪] con [0:整理] lại đồ đạc cho gọn gàng, hãy lắng nghe, giúp con [0:弄] rõ và nói ra những khúc mắc trong lòng là được. Việc cha mẹ dành tình yêu thương, sự quan tâm và [0:支持] mọi hành vi tốt của trẻ sẽ khiến trẻ cảm thấy hạnh phúc."
        },
        {
          "who": "",
          "zh": "Một số phụ huynh tin rằng việc con mình được học cách [0:弹钢琴] từ nhỏ sẽ giúp con thông minh, trở nên [0:优秀] hơn các bạn cùng trang lứa. Nhưng không chỉ chơi đàn piano đâu, việc học cách chơi các loại nhạc cụ khác đều đem tới tác dụng tích cực tới não bộ. [0:过程] trải nghiệm quan trọng hơn kết quả cuối cùng. Phụ huynh nên tôn trọng sở thích, [0:同情] với quan điểm của con, điều [0:至少] cần làm và nên làm là hỏi xem con có hứng thú không. Nếu không việc đó [0:只好] mang tới cho con áp lực."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "如果你突然发现孩子开始在家里乱扔东西，首先请不要用\"懒\"\"笨\"\"粗心\"\"不礼貌\"这种词批评孩子。这可能是因为他们遇到困难或者生气了。批评[1:之前]一定要仔细找原因。这时候父母应该停下手中的事情，一边陪孩子整理东西，一边支持他们说出心里话，[2:弄]清楚他们的问题。父母的关心可以让孩子心情愉快起来。",
          "py": "Rúguǒ nǐ tūrán fāxiàn háizi kāishǐ zài jiālǐ luàn rēng dōngxi, shǒuxiān qǐng búyào yòng \"lǎn\" \"bèn\" \"cūxīn\" \"bù lǐmào\" zhè zhǒng cí pīpíng háizi. Zhè kěnéng shì yīnwèi tāmen yùdào kùnnan huòzhě shēngqì le. Pīpíng [1:zhīqián] yídìng yào zǐxì zhǎo yuányīn. Zhè shíhou fùmǔ yīnggāi tíng xià shǒu zhōng de shìqing, yìbiān péi háizi zhěnglǐ dōngxi, yìbiān zhīchí tāmen shuō chū xīnlǐ huà, [2:nòng] qīngchu tāmen de wèntí. Fùmǔ de guānxīn kěyǐ ràng háizi xīnqíng yúkuài qǐlái.",
          "vi": "Nếu bất ngờ bạn thấy con mình ném đồ đạc trong nhà, xin đừng mắng con bằng những từ như \"lười biếng\", \"ngu ngốc\", \"bất cẩn\" hay \"không lễ phép\". Điều này có thể là do các con đang gặp khó khăn hoặc đang tức giận. [1:Trước khi] chỉ trích, bạn phải cẩn thận tìm lý do. Lúc này, cha mẹ nên dừng việc đang làm, vừa thu dọn đồ cùng con, vừa khuyến khích con nói ra tâm sự, [2:làm] rõ vấn đề của mình. Sự quan tâm của cha mẹ có thể khiến tâm trạng của trẻ vui vẻ lên."
        },
        {
          "who": "",
          "zh": "有些父母希望自己的孩子从小就学习弹钢琴，他们认为学弹钢琴的过程能使孩子变得更聪明、更优秀。但不管学什么，你至少也应该尊重孩子的兴趣，用同情心去听他们的想法，否则孩子只好带着压力学习，[3:同时]效果不一定好。",
          "py": "Yǒuxiē fùmǔ xīwàng zìjǐ de háizi cóng xiǎo jiù xuéxí tán gāngqín, tāmen rènwéi xué tán gāngqín de guòchéng néng shǐ háizi biàn de gèng cōngmíng, gèng yōuxiù. Dàn bùguǎn xué shénme, nǐ zhìshǎo yě yīnggāi zūnzhòng háizi de xìngqù, yòng tóngqíng xīn qù tīng tāmen de xiǎngfǎ, fǒuzé háizi zhǐhǎo dàizhe yālì xuéxí, [3:tóngshí] xiàoguǒ bù yídìng hǎo.",
          "vi": "Một số phụ huynh hy vọng rằng con mình sẽ học chơi piano từ khi còn nhỏ, họ tin rằng quá trình học chơi piano có thể giúp con họ thông minh và giỏi hơn. Nhưng dù học gì đi chăng nữa thì ít nhất bạn cũng nên tôn trọng sở thích của con cái và lắng nghe tâm tư của chúng bằng lòng cảm thông. Nếu không, con cái học hành sẽ bị áp lực, [3:đồng thời] hiệu quả chưa chắc đã tốt."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "之前",
          "np": "NP 11.1"
        },
        {
          "n": 2,
          "label": "弄",
          "np": "NP 11.2"
        },
        {
          "n": 3,
          "label": "同时",
          "np": "NP 11.3"
        }
      ]
    }
  ],
  "62": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Bước đầu tiên để giải quyết những rắc rối là gạt bỏ tất cả những suy nghĩ tiêu cực, làm chúng biến [0:丢] khỏi tâm trí, chẳng hạn như sự [0:不安] (không yên tâm), sự [0:无聊] thiếu muối, sự hối hận, việc không có niềm tin vào bản thân, v.v...; thứ hai là tích cực tham gia các hoạt động [0:户外] như [0:散步], leo núi... Đồng thời, thường xuyên tán gẫu với bạn bè, đọc vài đoạn, vài trang hoặc vài [0:篇] tản văn với lối viết [0:文章] bay bổng nhẹ nhàng, đọc những mẩu chuyện [0:笑话] như chuyện tiểu lâm đầy câu thoại [0:幽默] khiến bạn cười phá lên, v.v. Việc chuyển hướng sự quan tâm sẽ làm bạn thoát khỏi tâm trạng không vui và từ từ bình tĩnh lại."
        },
        {
          "who": "",
          "zh": "Ngủ nướng cũng có thể làm hiệu quả của công việc [0:加倍] lên, từ 1 thành 2, từ 2 thành 4. Kết quả của cuộc nghiên cứu này khiến bạn [0:吃惊] mắt chữ O mồm chữ A đúng không? Nhưng khi chưa suy xét kỹ thì đừng vội đưa ra quyết định một cách cẩu thả qua loa [0:马虎] rằng: ngoài thứ bảy cần ra ngoài, thì bạn sẽ nằm trên giường cả ngày [0:礼拜天] trước khi đi làm trở lại vào thứ Hai nhé [0:呀]. Tôi dám [0:保证] rằng với quan điểm của phụ huynh, thì [0:父亲] và [0:母亲] của bạn chắc chắn sẽ [0:反对] kịch liệt sự lười biếng đó. Tuy chưa rõ [0:到底] thì chúng ta cần ngủ bao nhiêu tiếng mới được coi là tốt cho sức khỏe, nhưng chỉ cần bạn ngủ đủ giấc để thức dậy tự nhiên, tinh thần thoải mái, công việc của bạn sẽ diễn ra suôn sẻ hơn."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "解决烦恼的第一步，就是把一切不积极的想法，把不安、无聊、后悔、无信心、紧张等想法全部丢到脑外；第二是积极参加户外活动，例如去散步、爬山、看球赛、游泳等，并且与熟悉的朋友聊聊有趣的事，阅读几篇比较轻松的文章，幽默的笑话等。[1:总的来说]，找办法转换你的注意力就会让自己从不高兴的心情中走出来，慢慢地冷静下来。",
          "py": "Jiějué fánnǎo de dì yī bù, jiùshì bǎ yíqiè bù jījí de xiǎngfǎ, bǎ bù'ān, wúliáo, hòuhuǐ, wú xìnxīn, jǐnzhāng děng xiǎngfǎ quánbù diū dào nǎo wài; dì èr shì jījí cānjiā hùwài huódòng, lìrú qù sànbù, páshān, kàn qiúsài, yóuyǒng děng, bìngqiě yǔ shúxī de péngyou liáo liao yǒuqù de shì, yuèdú jǐ piān bǐjiào qīngsōng de wénzhāng, yōumò de xiàohuà děng. [1:Zǒng de lái shuō], zhǎo bànfǎ zhuǎnhuàn nǐ de zhùyìlì jiù huì ràng zìjǐ cóng bù gāoxìng de xīnqíng zhōng zǒu chūlái, mànmàn de lěngjìng xiàlái.",
          "vi": "Bước đầu tiên để giải quyết những rắc rối là gạt bỏ tất cả những suy nghĩ thiếu tích cực ra khỏi tâm trí, chẳng hạn như lo lắng, buồn chán, hối hận, thiếu tự tin, căng thẳng, v.v...; thứ hai là tích cực tham gia các hoạt động ngoài trời, chẳng hạn như đi dạo, leo núi, xem bóng đá, bơi lội, v.v. Đồng thời, tán gẫu với những người bạn thân quen về những điều thú vị, đọc một vài trang sách nhẹ nhàng hơn, truyện cười hài hước, v.v. [1:Nói chung], tìm cách chuyển những mối quan tâm của bạn sẽ làm bạn thoát khỏi tâm trạng không vui và từ từ bình tĩnh lại."
        },
        {
          "who": "",
          "zh": "睡懒觉也能加倍工作效果。这个研究结果让你吃惊吧？但不要马虎下决定这个礼拜天一直躺在床上睡觉呀，我敢保证你这样做一定带来父亲、母亲的反对。不能说清楚[2:到底]需要睡几个小时才健康，只要你睡得够到自然醒，懒一点儿但心里舒服，工作会更顺利地进行。",
          "py": "Shuì lǎnjiào yě néng jiābèi gōngzuò xiàoguǒ. Zhège yánjiū jiéguǒ ràng nǐ chījīng ba? Dàn búyào mǎhu xià juédìng zhège lǐbài tiān yìzhí tǎng zài chuáng shàng shuìjiào ya, wǒ gǎn bǎozhèng nǐ zhèyàng zuò yídìng dài lái fùqin, mǔqin de fǎnduì. Bùnéng shuō qīngchu [2:dàodǐ] xūyào shuì jǐ ge xiǎoshí cái jiànkāng, zhǐyào nǐ shuì de gòu dào zìrán xǐng, lǎn yìdiǎnr dàn xīnlǐ shūfu, gōngzuò huì gèng shùnlì de jìnxíng.",
          "vi": "Ngủ nướng cũng có thể tăng gấp đôi hiệu quả của công việc. Kết quả của cuộc nghiên cứu này khiến bạn ngạc nhiên đúng không? Nhưng đừng đưa ra một quyết định một cách cẩu thả là bạn sẽ nằm trên giường cả ngày chủ nhật nhé! Tôi dám đảm bảo rằng bạn sẽ vấp phải sự phản đối của bố và mẹ. Không rõ [2:rốt cuộc] cần ngủ bao nhiêu tiếng mới tốt cho sức khỏe, chỉ cần bạn ngủ đủ giấc để thức dậy tự nhiên, lười biếng chút nhưng trong lòng thoải mái, công việc sẽ diễn ra càng suôn sẻ hơn."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "总的来说",
          "np": "NP 12.1"
        },
        {
          "n": 2,
          "label": "到底",
          "np": "NP 12.2"
        }
      ]
    }
  ],
  "63": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Hiểu mình [0:理解] người, trăm trận trăm thắng, bởi khi chưa lắng nghe và suy xét đầy đủ, đừng [0:否定] ý kiến của người khác. Nhiều khi chúng ta làm những việc khiến người khác cảm thấy \"[0:伤心] như cắt, nước mắt đầm đìa\", chỉ vì chúng ta chưa trải qua những chuyện như của người khác. [0:举] một [0:例子] thế này để cả nhà dễ hiểu, sau khi con gái chào đời, tôi mới biết việc làm mẹ [0:实在] không hề đơn giản như tôi vốn tưởng. Làm mẹ rồi tôi mới [0:更加] hiểu thêm những vất vả của bố mẹ mình, xin bố mẹ [0:原谅] cho những việc làm [0:错误] trước đây tôi gây ra, tôi muốn nói lời [0:道歉] với họ và [0:感谢] thật nhiều vì tình yêu mà họ đã dành cho tôi."
        },
        {
          "who": "",
          "zh": "Do người phụ trách trước đó viết rất [0:随便] không theo quy củ gì và không đạt yêu cầu, giám đốc yêu cầu anh Lý viết [0:重新] bản báo cáo, bản này sẽ [0:总结] tất cả kết quả thu được từ hội nghị vừa qua, nhưng nửa ngày rồi mà anh ấy không viết nổi một chữ. Thấy [0:样子] mệt mỏi của anh, vợ anh muốn bông đùa giúp anh vui lên nên mới tiến lại vừa cười vừa [0:开玩笑] với anh rằng: \"[0:难道] viết báo cáo lại khó hơn việc em sinh con sao?\" Anh Lý cười trả lời: \"Em không biết rồi, khi sinh con, con có trong bụng rồi, nhưng trong bụng anh bây giờ không có cơ sở gì thì làm sao viết ra được\"."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "要学会理解别人，不要随便否定别人的意见。很多时候我们让别人伤心，只是因为没有经历过别人的经历。举个例子来说，女儿出生以后，我才知道做妈妈实在不容易。因此，我更加理解我的父母了，想向他们道歉，希望他们原谅我以前的错误，也感谢他们这么多年来给我的爱。",
          "py": "Yào xuéhuì lǐjiě biérén, búyào suíbiàn fǒudìng biérén de yìjiàn. Hěn duō shíhou wǒmen ràng biérén shāngxīn, zhǐshì yīnwèi méiyǒu jīnglì guo biérén de jīnglì. Jǔ ge lìzi lái shuō, nǚ'ér chūshēng yǐhòu, wǒ cái zhīdào zuò māma shízài bù róngyì. Yīncǐ, wǒ gèngjiā lǐjiě wǒ de fùmǔ le, xiǎng xiàng tāmen dàoqiàn, xīwàng tāmen yuánliàng wǒ yǐqián de cuòwù, yě gǎnxiè tāmen zhème duō nián lái gěi wǒ de ài.",
          "vi": "Cần học cách được hiểu người khác, đừng phủ nhận ý kiến của người khác một cách tùy tiện. Nhiều khi chúng ta làm người khác buồn, chỉ vì chúng ta chưa trải qua những chuyện như của người khác. Lấy một ví dụ, sau khi con gái chào đời, tôi mới biết làm mẹ không dễ chút nào. Vì vậy, tôi hiểu bố mẹ hơn và muốn xin lỗi họ, mong họ tha thứ cho lỗi lầm trước đây của tôi và cảm ơn vì tình yêu mà họ đã dành cho tôi suốt bao năm qua."
        },
        {
          "who": "",
          "zh": "一次，经理让小李重新写一篇会议总结，可是过了半天他连一个字也没写出来。看着他烦恼的样子，妻子就跟他开玩笑说：\"写文章[1:难道]比我生孩子还难？\"小李笑着回答：\"你不知道，生孩子时，孩子已经在肚子里了，可我现在肚子里什么基础也没有，怎么能写出来呢？\"",
          "py": "Yí cì, jīnglǐ ràng Xiǎo Lǐ chóngxīn xiě yì piān huìyì zǒngjié, kěshì guò le bàntiān tā lián yí ge zì yě méi xiě chūlái. Kànzhe tā fánnǎo de yàngzi, qīzi jiù gēn tā kāi wánxiào shuō: \"Xiě wénzhāng [1:nándào] bǐ wǒ shēng háizi hái nán?\" Xiǎo Lǐ xiàozhe huídá: \"Nǐ bù zhīdào, shēng háizi shí, háizi yǐjīng zài dùzi lǐ le, kě wǒ xiànzài dùzi lǐ shénme jīchǔ yě méiyǒu, zěnme néng xiě chūlái ne?\"",
          "vi": "Một lần, giám đốc yêu cầu Tiểu Lý viết lại một bản tổng kết cuộc họp, nhưng qua nửa ngày rồi anh ấy thậm chí một chữ cũng không viết ra được. Thấy dáng vẻ anh gặp rắc rối, vợ anh đã nói đùa với anh: \"[1:Chẳng lẽ] viết một bài báo khó hơn việc em sinh con sao?\" Tiểu Lý cười trả lời: \"Em không biết rồi, khi sinh con, con có trong bụng rồi, nhưng trong bụng anh bây giờ không có cơ sở gì thì làm sao viết ra được\"."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "难道",
          "np": "NP 13.1"
        }
      ]
    }
  ],
  "64": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Cơm nên ăn từng miếng một, việc cũng cần làm theo [0:顺序] từng cái một, đây là một trong những cách để nâng cao hiệu quả công việc. Nhưng đừng [0:光] nói suông mà không làm, vào mỗi buổi sáng, [0:之后] ra khỏi nhà và đến công ty, bạn cần [0:排列] hết tất cả những việc cần làm trong ngày hôm đó ra giấy thành một [0:表格] công việc, sau đó tuân thủ thật [0:严格] và tiến hành giải quyết. Thành công lớn bắt đầu từ những [0:动作] nhỏ, việc làm này sẽ giúp bạn không bị \"[0:迷路]\" khi đi tìm đường giữa núi việc, giúp bạn [0:避免] tình trạng quên [0:目标] mà công việc hướng tới."
        },
        {
          "who": "",
          "zh": "Hôm nay là Ngày của Mẹ, cửa hàng rất bận, người phục vụ luôn tay luôn chân, không [0:来得及] dọn dẹp, nên trên [0:餐桌] bày đầy [0:刀] cắt, đĩa và [0:勺子] cán súp; chỗ [0:厨房] nơi đầu bếp nấu nướng, [0:垃圾桶] đựng rác đã đầy ắp, và [0:卫生间] nơi khách \"xả nước cứu thân\" cũng không kịp dọn dẹp. Ngay cả [0:售货员] là tôi cũng phải giúp khách hàng gói đồ vào [0:盒子] giấy và đặt vào [0:袋子] để xách đi khác mang về. Tôi cảm thấy rất tự hào vì hôm nay có thể giúp đỡ đồng nghiệp một [0:把] một chân."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "饭要[1:一口一口地]吃，事也要按顺序[1:一件一件地]做，这是提高工作效果的办法之一。但不要[2:光]说不做，每天早上到公司之后，一定要把这一天要做的所有事情排列出来，然后严格地按照那表格进行工作安排。小动作，大效果，这样就帮你不\"迷路\"，避免了忘记工作目标的情况。",
          "py": "Fàn yào [1:yì kǒu yì kǒu de] chī, shì yě yào àn shùnxù [1:yí jiàn yí jiàn de] zuò, zhè shì tígāo gōngzuò xiàoguǒ de bànfǎ zhī yī. Dàn búyào [2:guāng] shuō bú zuò, měitiān zǎoshang dào gōngsī zhīhòu, yídìng yào bǎ zhè yì tiān yào zuò de suǒyǒu shìqing páiliè chūlái, ránhòu yángé de ànzhào nà biǎogé jìnxíng gōngzuò ānpái. Xiǎo dòngzuò, dà xiàoguǒ, zhèyàng jiù bāng nǐ bù \"mílù\", bìmiǎn le wàngjì gōngzuò mùbiāo de qíngkuàng.",
          "vi": "Cơm nên ăn [1:từng miếng một], việc cũng cần làm theo thứ tự [1:từng việc một], đây là một trong những cách để nâng cao hiệu quả công việc. Nhưng đừng [2:chỉ] nói mà không làm, vào mỗi buổi sáng sau khi đến công ty, bạn phải sắp xếp tất cả những việc cần làm trong ngày hôm đó, sau đó tuân thủ nghiêm ngặt biểu mẫu để tiến hành làm việc. Hành động nhỏ, hiệu quả lớn, điều này sẽ giúp bạn không bị \"lạc\" và tránh tình trạng quên mục tiêu công việc."
        },
        {
          "who": "",
          "zh": "今天是母亲节，店里很忙，服务员没来得及收拾，所以餐桌上的刀和勺子没人收拾，厨房后边的垃圾桶都满了，卫生间也不能及时打扫，甚至售货员的我也要来帮客人用盒子和袋子把菜打包回去。虽然这样忙过头的情况弄得我哭笑不得，但能帮同事一把，能为客人服务，我心里觉得很骄傲。",
          "py": "Jīntiān shì Mǔqīn jié, diàn lǐ hěn máng, fúwùyuán méi láidejí shōushi, suǒyǐ cānzhuō shang de dāo hé sháozi méi rén shōushi, chúfáng hòubian de lājī tǒng dōu mǎn le, wèishēngjiān yě bùnéng jíshí dǎsǎo, shènzhì shòuhuòyuán de wǒ yě yào lái bāng kèrén yòng hézi hé dàizi bǎ cài dǎbāo huíqù. Suīrán zhèyàng máng guòtóu de qíngkuàng nòng de wǒ kūxiàobùdé, dàn néng bāng tóngshì yì bǎ, néng wèi kèrén fúwù, wǒ xīnlǐ juéde hěn jiāo'ào.",
          "vi": "Hôm nay là Ngày của Mẹ, cửa hàng rất bận, người phục vụ không có thời gian dọn dẹp, nên dao và thìa trên bàn không ai thu dọn, thùng rác sau bếp đã đầy, phòng vệ sinh không kịp dọn dẹp. Ngay cả nhân viên bán hàng là tôi cũng phải đến và giúp khách hàng gói đồ vào hộp và túi để mang về. Tuy tình hình công việc bận ngập đầu này khiến tôi dở khóc dở cười, nhưng có thể giúp đỡ đồng nghiệp một tay, có thể phục vụ khách hàng, trong lòng tôi thấy rất đỗi tự hào."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "一…一…地",
          "np": "NP 14.1"
        },
        {
          "n": 2,
          "label": "光",
          "np": "NP 14.2"
        }
      ]
    }
  ],
  "65": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Đi du lịch vòng [0:遍] Trung Quốc đã là ước mơ của tôi từ khi còn là một đứa trẻ. Trong giấc mơ của mình, tôi sẽ leo lên Vạn Lý [0:长城], du ngoạn con sông dài nhất Trung Quốc - [0:长江], ăn [0:烤鸭] Bắc Kinh béo ngậy, luyện tập [0:功夫], nếm thử nhiều món cao lương [0:美味] và ngắm nhìn những [0:美景] nổi tiếng của nhiều [0:省] và thành phố. Mặc dù tôi chưa có cơ hội làm điều đó, nhưng tôi đã rất chăm chỉ học Tiếng Trung. Năm nay tôi đã tham gia cuộc thi Nói giỏi [0:普通话] của Trung Quốc và giành được giải Nhất."
        },
        {
          "who": "",
          "zh": "Bất ngờ thay, [0:大使馆] Trung Quốc tại Việt Nam sẽ tặng cho ba người đứng đầu cuộc thi này cơ hội một tháng đến Trung Quốc để tham gia giao lưu và được cấp [0:签证] du lịch miễn phí. Đến tháng 6 khi học sinh chúng tôi được chính thức [0:放暑假], giấc mơ Trung Quốc của tôi không còn phải [0:做梦] mỗi đêm nữa rồi. Tôi vừa vui mừng hạnh phúc vừa [0:激动] không nói nên lời, và ngay lập tức sắp xếp một [0:旅程] sao cho đi được nhiều nơi, trải nghiệm nhiều trong thời gian ngắn này."
        },
        {
          "who": "",
          "zh": "Chúng ta đang nhìn thấy \"Núi Hổ\". Mọi người thử [0:猜] xem, tại sao người ta lại [0:取] cái tên đặc biệt này? Không phải vì trên núi có [0:老虎] đâu, mà bởi vì [0:座] núi này trông giống như một con hổ, thật thú vị nhỉ!"
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "走遍中国是我从小的梦想。在梦里，我爬长城，游长江，吃烤鸭，练功夫，尝各种各样美味，看各省各地美景。虽然还没机会做到，但我一直努力学习汉语。今年我参加了说好普通话比赛并得了第一名。",
          "py": "Zǒu biàn Zhōngguó shì wǒ cóng xiǎo de mèngxiǎng. Zài mèng lǐ, wǒ pá Chángchéng, yóu Chángjiāng, chī kǎoyā, liàn gōngfu, cháng gè zhǒng gè yàng měiwèi, kàn gè shěng gè dì měijǐng. Suīrán hái méi jīhuì zuò dào, dàn wǒ yìzhí nǔlì xuéxí Hànyǔ. Jīnnián wǒ cānjiā le shuō hǎo pǔtōnghuà bǐsài bìng dé le dì yī míng.",
          "vi": "Đi du lịch vòng quanh Trung Quốc đã là ước mơ của tôi từ khi còn là một đứa trẻ. Trong giấc mơ của mình, tôi sẽ leo lên Vạn Lý Trường Thành, du ngoạn sông Dương Tử, ăn vịt quay, luyện tập Kungfu, nếm thử nhiều món ngon và ngắm nhìn cảnh đẹp của nhiều tỉnh. Mặc dù tôi chưa có cơ hội làm điều đó, nhưng tôi đã rất chăm chỉ học tiếng Trung. Năm nay tôi đã tham gia cuộc thi Nói tiếng phổ thông và giành được giải Nhất."
        },
        {
          "who": "",
          "zh": "没想到，中国大使馆会为这次比赛前三名提供一个月去中国参加交流的机会和免费办旅游签证。放暑假的时候，我的中国梦不再是做梦了。我既兴奋，又激动，马上做了个旅程安排。我相信，有梦想并一直为它做好准备，机会总有一天就会出现的。",
          "py": "Méi xiǎngdào, Zhōngguó dàshǐ guǎn huì wèi zhè cì bǐsài qián sān míng tígōng yí ge yuè qù Zhōngguó cānjiā jiāoliú de jīhuì hé miǎnfèi bàn lǚyóu qiānzhèng. Fàng shǔjià de shíhou, wǒ de Zhōngguó mèng bú zài shì zuòmèng le. Wǒ jì xīngfèn, yòu jīdòng, mǎshàng zuò le ge lǚchéng ānpái. Wǒ xiāngxìn, yǒu mèngxiǎng bìng yìzhí wèi tā zuò hǎo zhǔnbèi, jīhuì zǒng yǒu yì tiān jiù huì chūxiàn de.",
          "vi": "Bất ngờ thay, Đại sứ quán Trung Quốc sẽ tặng cho ba người đứng đầu cuộc thi này cơ hội một tháng đến Trung Quốc để tham gia giao lưu và được cấp thị thực du lịch miễn phí. Khi kỳ nghỉ hè đến, giấc mơ Trung Quốc của tôi không còn là giấc mơ nữa. Tôi vừa vui mừng vừa háo hức, và ngay lập tức sắp xếp một lộ trình lần này. Tôi tin rằng nếu bạn có ước mơ và luôn chuẩn bị cho nó thì một ngày nào đó cơ hội sẽ xuất hiện."
        },
        {
          "who": "",
          "zh": "我们看到的就是\"老虎山\"。你们猜猜，为什么人们取这个名字呢？不是因为山里有老虎，而是因为这座山很像一只老虎，有趣吧！",
          "py": "Wǒmen kàn dào de jiùshì \"lǎohǔ shān\". Nǐmen cāicai, wèishénme rénmen qǔ zhège míngzi ne? Búshì yīnwèi shān lǐ yǒu lǎohǔ, ér shì yīnwèi zhè zuò shān hěn xiàng yì zhī lǎohǔ, yǒuqù ba!",
          "vi": "Ngọn núi chúng ta đang nhìn thấy là \"Núi Hổ\". Mọi người thử đoán xem, tại sao người ta lại lấy tên này? Không phải vì trên núi có hổ, mà bởi vì ngọn núi này trông giống như một con hổ, thật thú vị!"
        }
      ],
      "note": {
        "title": "Ngữ pháp đã học trong bài",
        "text": "Bài này không có ngữ pháp mới. Ôn lại: 并 (NP 16.3, Tăng tốc): 参加了说好普通话比赛并得了第一名 · 为 và 为了 (NP 8.1, Tăng tốc): 一直为它做好准备 · 不是…而是… (NP 9.1, Tăng tốc): 不是因为山里有老虎，而是因为这座山很像一只老虎. Chú thích: 各种各样 /gè zhǒng gè yàng/ là cụm bốn chữ diễn tả ý \"đa dạng chủng loại, kiểu dáng\"."
      }
    }
  ],
  "66": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Bạn biết không, mỗi sáng mỗi tối khi dùng bàn chải [0:刷牙] để bảo vệ răng, chỉ cần thêm một chút muối vào [0:牙膏] và kiên trì lâu ngày có thể làm cho răng trắng lên. Vẫn còn rất nhiều kiến thức nhỏ trong cuộc sống như: lần đầu gặp mặt nên [0:打招呼] và bắt chuyện thế nào; uống rượu có nên làm một hơi [0:干杯] hết cả ly; cách uống rượu vang thế nào mới là [0:准确], khi rót rượu thì có nên [0:倒] đầy cốc không; cho trẻ ăn gì để đêm ngủ bớt đổ [0:汗] trộm ướt sũng áo; cách bảo vệ làn [0:皮肤] dưới nắng hè chang chang; nên dùng loại [0:毛巾] chất liệu gì để mỗi khi [0:擦] lên mặt vừa sạch vừa không thô ráp; khi ngủ có nên [0:脱] hết quần áo để \"thả rông\", nếu không thì sẽ gây ra [0:坏处] gì có hại, làm sao để dễ dàng lau dọn bệ xí của [0:厕所], v.v. Bạn thấy đấy, chúng ta đã bước sang [0:世纪] 21 được hơn 20 năm, thế giới đã thay đổi rất nhiều, [0:数量] kiến thức mới tăng theo cấp số nhân, nhưng chỉ cần bạn chú ý hơn đến nó thì cuộc sống của bạn sẽ dễ dàng hơn."
        },
        {
          "who": "",
          "zh": "Bàn ăn rất quan trọng với người [0:亚洲] (như Việt Nam, Trung Quốc, Nhật Bản, Hàn Quốc) và là nơi để mọi người hiểu nhau. Trên bàn ăn có nhiều điều cấm kỵ cần chú ý, ví dụ như người lớn luôn nhắc chúng ta [0:禁止] dùng đũa [0:敲] vào đĩa, bát vì như vậy là kiêng kị, không được gây ồn ào xì xà xì xụp khi húp [0:汤], trong bữa ăn cũng nên nhắc nhở [0:儿童] không được chạy lung tung lăng xăng khi đang ăn,... Điều này sẽ khiến người khác sẽ cảm thấy bạn không lịch sự."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "你知道吗，刷牙时在牙膏上加点儿盐，坚持一段时间，就能使牙变白。生活中还有很多小知识，比如：怎么打招呼更幽默；喝红酒怎么干杯才准确，倒酒时要倒多少才合适；吃什么能减少出汗；怎样保护皮肤；擦脸应该用什么毛巾；睡觉不脱衣服有什么坏处，怎样轻松地收拾厕所等等。你看，21世纪了，世界变化很大，新知识的数量一天比一天多，只要多注意一点儿，你的生活就会更加方便。",
          "py": "Nǐ zhīdào ma, shuāyá shí zài yágāo shang jiā diǎnr yán, jiānchí yí duàn shíjiān, jiù néng shǐ yá biàn bái. Shēnghuó zhōng hái yǒu hěn duō xiǎo zhīshi, bǐrú: Zěnme dǎzhāohu gèng yōumò; hē hóngjiǔ zěnme gānbēi cái zhǔnquè, dào jiǔ shí yào dào duōshao cái héshì; chī shénme néng jiǎnshǎo chū hàn; zěnyàng bǎohù pífū; cā liǎn yīnggāi yòng shénme máojīn; shuìjiào bù tuō yīfu yǒu shénme huàichu, zěnyàng qīngsōng de shōushi cèsuǒ děngděng. Nǐ kàn, èrshíyī shìjì le, shìjiè biànhuà hěn dà, xīn zhīshi de shùliàng yì tiān bǐ yì tiān duō, zhǐyào duō zhùyì yìdiǎnr, nǐ de shēnghuó jiù huì gèngjiā fāngbiàn.",
          "vi": "Bạn có biết rằng thêm một chút muối vào kem đánh răng khi đánh răng và kiên trì lâu ngày có thể làm răng trắng lên. Vẫn còn rất nhiều kiến thức nhỏ trong cuộc sống như: cách chào hỏi hài hước hơn; cách nâng ly uống rượu vang đỏ thế nào mới là chính xác, khi rót rượu thì rót bao nhiêu là phù hợp; ăn gì để bớt đổ mồ hôi; cách bảo vệ da; nên dùng khăn gì để rửa mặt; không cởi quần áo khi ngủ có nhược điểm gì, làm sao để dễ dàng lau dọn nhà vệ sinh, v.v. Bạn thấy đấy, trong thế kỷ 21, thế giới đã thay đổi rất nhiều, lượng kiến thức mới ngày một nhiều lên, chỉ cần bạn chú ý hơn đến nó thì cuộc sống của bạn sẽ dễ dàng hơn."
        },
        {
          "who": "",
          "zh": "餐桌文化对亚洲人来说很重要。在餐桌上有很多事情要注意，例如：禁止用筷子敲盘子、碗，喝汤时不发出声音，儿童吃饭时不可以乱跑乱跳等，这样都会让别人觉得你很没礼貌。",
          "py": "Cānzhuō wénhuà duì Yàzhōu rén lái shuō hěn zhòngyào. Zài cānzhuō shang yǒu hěn duō shìqing yào zhùyì, lìrú: Jìnzhǐ yòng kuàizi qiāo pánzi, wǎn, hē tāng shí bù fāchū shēngyīn, értóng chīfàn shí bù kěyǐ luàn pǎo luàn tiào děng, zhèyàng dōu huì ràng biérén juéde nǐ hěn méi lǐmào.",
          "vi": "Bàn ăn rất quan trọng với người Á Đông và là nơi để mọi người hiểu nhau. Trên bàn ăn có nhiều điều cần chú ý, ví dụ như không được dùng đũa gõ vào đĩa, bát, không được gây ồn ào khi uống nước canh, trẻ em không được chạy lung tung khi đang ăn,... Điều này sẽ khiến người khác sẽ cảm thấy bạn không lịch sự."
        }
      ],
      "note": {
        "title": "Ngữ pháp đã học trong bài",
        "text": "Bài này không có ngữ pháp mới. Ôn lại: 一天比一天 (NP 25.2, Tăng tốc): 新知识的数量一天比一天多"
      }
    }
  ],
  "67": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Âm nhạc cũng là một ngôn ngữ toàn cầu. Không phân biệt mang [0:国籍] nước nào, dân tộc nào, [0:性别] nam hay nữ, [0:肤色] vàng - trắng hay đen, mọi người đều có thể sử dụng âm nhạc để thể hiện cảm xúc của mình và dễ dàng nói ra những lời từ tận sâu [0:底] lòng mình. So với các ngôn ngữ khác, cảm xúc được thể hiện bằng âm nhạc đôi khi dễ hiểu hơn."
        },
        {
          "who": "",
          "zh": "Vỗ tay là một cách thể hiện sự nhiệt tình. Tuy nhiên, nếu [0:鼓掌] quá khích khi nghe hòa nhạc, [0:表演者] đang biểu diễn trên [0:台] sẽ phải dừng lại giữa chừng và chờ tràng [0:掌声] giòn giã kết thúc, việc bị gián đoạn không chỉ ảnh hưởng đến tính [0:完整] của chương trình, mà còn ảnh hưởng trực tiếp một cách [0:严重] đến tâm trạng khi đang trên sân khấu [0:演出] của nghệ sỹ vào ngay [0:当时]. Những khán giả \"[0:合格] chuẩn ISO\" đầu tiên nên đợi cho đến khi âm nhạc kết thúc, [0:接着] mới nên vỗ tay."
        },
        {
          "who": "",
          "zh": "Tôi rất quan tâm đến nghệ thuật biểu diễn Kinh kịch, cũng thỉnh thoảng hát một hai câu [0:京剧] khi ở nhà. Sau khi đến Trung Quốc, tôi nhận được lời mời của trường, tôi có cơ hội tham gia lớp nghiên cứu Kinh kịch do Đại học Bắc Kinh [0:举办], được cùng [0:讨论] các chủ đề với những chuyên gia [0:来自] khắp nơi trên thế giới, tôi cảm thấy rất [0:得意] về điều đó."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "音乐也是一种语言。无论国籍、民族、性别、肤色，人们都可以用音乐来表达感情，轻松地说出自己的心底话。和其他语言比起来，音乐表达的感情有时更容易让人听懂。",
          "py": "Yīnyuè yěshì yì zhǒng yǔyán. Wúlùn guójí, mínzú, xìngbié, fūsè, rénmen dōu kěyǐ yòng yīnyuè lái biǎodá gǎnqíng, qīngsōng de shuō chū zìjǐ de xīndǐ huà. Hé qítā yǔyán bǐ qǐlái, yīnyuè biǎodá de gǎnqíng yǒushí gèng róngyì ràng rén tīng dǒng.",
          "vi": "Âm nhạc cũng là một ngôn ngữ. Không phân biệt quốc tịch, dân tộc, giới tính, màu da, mọi người đều có thể sử dụng âm nhạc để thể hiện cảm xúc của mình và dễ dàng nói ra những lời từ đáy lòng mình. So với các ngôn ngữ khác, cảm xúc được thể hiện bằng âm nhạc đôi khi dễ hiểu hơn."
        },
        {
          "who": "",
          "zh": "鼓掌是表达热情的方式。但是，如果在听音乐会时鼓掌太积极，就会使台上的表演者不得不中间停下来，等掌声结束，这样不但影响了节目的完整性，也严重影响了表演者当时的演出心情。合格的观众应该等音乐结束后，接着才大声鼓掌。",
          "py": "Gǔzhǎng shì biǎodá rèqíng de fāngshì. Dànshì, rúguǒ zài tīng yīnyuè huì shí gǔzhǎng tài jījí, jiù huì shǐ tái shàng de biǎoyǎn zhě bùdébù zhōngjiān tíng xiàlái, děng zhǎngshēng jiéshù, zhèyàng búdàn yǐngxiǎng le jiémù de wánzhěng xìng, yě yánzhòng yǐngxiǎng le biǎoyǎn zhě dāngshí de yǎnchū xīnqíng. Hégé de guānzhòng yīnggāi děng yīnyuè jiéshù hòu, jiēzhe cái dàshēng gǔzhǎng.",
          "vi": "Vỗ tay là một cách thể hiện sự nhiệt tình. Tuy nhiên, nếu vỗ tay quá khích khi nghe hòa nhạc, người biểu diễn trên sân khấu sẽ phải dừng lại giữa chừng và chờ hết tiếng vỗ tay, điều này không chỉ ảnh hưởng đến tính toàn vẹn của chương trình mà còn ảnh hưởng nghiêm trọng đến tâm trạng người biểu diễn vào thời điểm đó. Khán giả \"đạt chuẩn\" nên đợi cho đến khi âm nhạc kết thúc rồi mới vỗ tay lớn."
        },
        {
          "who": "",
          "zh": "我对京剧表演艺术非常感兴趣，偶尔也在家里唱一两句。来中国以后收到学校的邀请，我有机会参加由北京大学举办的京剧研究班，跟其他来自世界各地的京剧爱好者讨论，我心里非常得意。",
          "py": "Wǒ duì Jīngjù biǎoyǎn yìshù fēicháng gǎn xìngqù, ǒu'ěr yě zài jiālǐ chàng yì liǎng jù. Lái Zhōngguó yǐhòu shōu dào xuéxiào de yāoqǐng, wǒ yǒu jīhuì cānjiā yóu Běijīng dàxué jǔbàn de Jīngjù yánjiū bān, gēn qítā láizì shìjiè gè dì de jīngjù àihào zhě tǎolùn, wǒ xīnlǐ fēicháng déyì.",
          "vi": "Tôi rất quan tâm đến nghệ thuật biểu diễn Kinh kịch, cũng thỉnh thoảng hát một hai câu khi ở nhà. Sau khi đến Trung Quốc, tôi nhận được lời mời của trường, tôi có cơ hội tham gia lớp nghiên cứu Kinh kịch do Đại học Bắc Kinh tổ chức và thảo luận với những người hâm mộ Kinh kịch khác từ khắp nơi trên thế giới. Tôi rất tự hào về điều đó."
        }
      ],
      "note": {
        "title": "Ngữ pháp đã học trong bài",
        "text": "Bài này không có ngữ pháp mới. Ôn lại: 无论 (NP 20.1, Tăng tốc): 无论国籍、民族、性别、肤色… · 不得不 (NP 21.1, Tăng tốc): 表演者不得不中间停下来 · 不但…而且… (NP 2.2, Tăng tốc): 这样不但影响了节目的完整性 · A 对 B 感兴趣 (NP 7.3, Tăng tốc): 我对京剧表演艺术非常感兴趣 · 偶尔 (NP 6.3, Cất cánh): 偶尔也在家里唱一两句 · 由 (NP 24.4, Tăng tốc): 由北京大学举办的京剧研究班"
      }
    }
  ],
  "68": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Nhiều cô gái cảm thấy không có quần áo để mặc mỗi khi đi ra ngoài [0:聚会] cà phê chuyện trò với nhóm bạn, cứ đứng trước [0:镜子] ngắm đi ngắm lại cả buổi, thay xong 1 bộ lại đi [0:照] gương, thay tái thay hồi [0:究竟] cũng chọn ra được một bộ. Cầu toàn về trang phục là điều bình thường, vì quần áo cũng sẽ [0:代表] sự tôn trọng của bạn đối với người nhìn. Vì vậy, khi tham gia các sự kiện [0:重大], phái đẹp thường rất [0:讲究] đến việc mặc gì, [0:戴] lên người phụ kiện vòng nhẫn hoa tai gì, cũng không quên [0:打扮] cho má hồng môi xinh thật rạng rỡ."
        },
        {
          "who": "",
          "zh": "Mọi người đều biết rằng hút thuốc có hại cho sức khỏe. Nhưng [0:抽烟] không chỉ ảnh hưởng đến sức khỏe, còn [0:显示] cho người ngoài thấy phép lịch sự của bạn. Ví dụ, hút thuốc ở gần [0:加油站] mọi người qua lại đổ xăng cũng rất [0:危险] vì nguy cơ cháy nổ do gần chỗ xăng dầu dễ bắt lửa, do đó, việc hút thuốc ở [0:空间] công cộng bị cấm."
        },
        {
          "who": "",
          "zh": "Vào buổi tối, ngay khi tôi nằm xuống, có tiếng gõ cửa [0:响] lên \"Cốc, cốc\". Vừa đoán là tôi biết ngay là bạn [0:同屋] ở cùng tôi lại không mang chìa khóa. Dù lần nào anh ấy cũng đỏ mặt nói [0:抱歉] rối rít vì đã [0:打扰] đến giờ nghỉ ngơi của tôi, nhưng vài ngày sau anh ấy lại trở lại như cũ. Tôi thực sự [0:受不了] nữa và bực lắm rồi."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "许多女孩子每次参加聚会的时候，就会觉得自己没有衣服穿，照着镜子换了许多件都觉得不满意。这也很正常，因为衣服[1:究竟]也能代表你对人的尊重。所以，参加重大活动时，女人常讲究穿戴，也不忘打扮。",
          "py": "Xǔduō nǚ háizi měi cì cānjiā jùhuì de shíhou, jiù huì juéde zìjǐ méiyǒu yīfu chuān, zhàozhe jìngzi huàn le xǔduō jiàn dōu juéde bù mǎnyì. Zhè yě hěn zhèngcháng, yīnwèi yīfu [1:jiūjìng] yě néng dàibiǎo nǐ duì rén de zūnzhòng. Suǒyǐ, cānjiā zhòngdà huódòng shí, nǚrén cháng jiǎngjiū chuāndài, yě bú wàng dǎbàn.",
          "vi": "Nhiều cô gái cảm thấy không có quần áo để mặc mỗi khi đi dự tiệc, cảm thấy bản thân chẳng có gì để mặc, đứng trước gương thay rất nhiều bộ nhưng không hài lòng. Đây cũng là điều bình thường, vì quần áo [1:xét cho cùng] cũng thể hiện sự tôn trọng của bạn đối với mọi người. Vì vậy, khi tham gia các sự kiện lớn, phái đẹp thường rất chú ý đến việc ăn mặc và không quên trang điểm."
        },
        {
          "who": "",
          "zh": "抽烟对身体不好，人人都知道。不仅影响健康，而且抽烟也显示出个人的礼貌。例如，在医院抽烟会污染空气，在加油站抽烟非常危险，因此，公共空间都禁止抽烟。",
          "py": "Chōuyān duì shēntǐ bù hǎo, rén rén dōu zhīdào. Bùjǐn yǐngxiǎng jiànkāng, érqiě chōuyān yě xiǎnshì chū gèrén de lǐmào. Lìrú, zài yīyuàn chōuyān huì wūrǎn kōngqì, zài jiāyóu zhàn chōuyān fēicháng wēixiǎn, yīncǐ, gōnggòng kōngjiān dōu jìnzhǐ chōuyān.",
          "vi": "Mọi người đều biết rằng hút thuốc có hại cho sức khỏe của bạn. Không chỉ ảnh hưởng đến sức khỏe, hút thuốc lá còn thể hiện phép lịch sự cá nhân. Ví dụ, hút thuốc trong bệnh viện làm ô nhiễm không khí, hút thuốc trong trạm xăng rất nguy hiểm, do đó, việc hút thuốc ở không gian công cộng bị cấm."
        },
        {
          "who": "",
          "zh": "晚上，我刚刚躺下，就响起了敲门声。一猜就知道是同屋又没带钥匙。他虽然每次都红着脸向我说抱歉，打扰了，可过不了几天他又回到老样子。我实在[2:受不了]了。",
          "py": "Wǎnshang, wǒ gānggāng tǎng xià, jiù xiǎng qǐle qiāo mén shēng. Yì cāi jiù zhīdào shì tóngwū yòu méi dài yàoshi. Tā suīrán měi cì dōu hóngzhe liǎn xiàng wǒ shuō bàoqiàn, dǎrǎo le, kě guò bùliǎo jǐ tiān tā yòu huí dào lǎo yàngzi. Wǒ shízài [2:shòu bùliǎo] le.",
          "vi": "Vào buổi tối, ngay khi tôi nằm xuống, có tiếng gõ cửa. Vừa đoán là tôi biết ngay là bạn cùng phòng lại không mang chìa khóa. Dù lần nào anh ấy cũng đỏ mặt nói xin lỗi và làm phiền rồi nhưng vài ngày sau anh ấy lại trở lại như cũ. Tôi [2:không thể chịu đựng được] nữa rồi."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "究竟",
          "np": "NP 18.1"
        },
        {
          "n": 2,
          "label": "受不了",
          "np": "NP 18.2"
        }
      ]
    }
  ],
  "69": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Hôm nay là một ngày đẹp trời, [0:阳光] chói chang, tôi và bạn học về thăm trường cũ. [0:母校] cấp 3 của tôi là một trường trọng điểm của Hà Nội - [0:首都] của Việt Nam."
        },
        {
          "who": "",
          "zh": "Tôi còn nhớ ngày nhập học, cầm tờ giấy thông báo [0:入学] của trường đến làm thủ tục chuẩn bị bước vào [0:学期] đầu tiên của năm lớp 10, tôi ngại ngùng đứng phía [0:对面] với cổng trường mà không dám [0:进入]. Một lúc sau, có một giáo viên đến bên động viên tôi, cô chính là [0:班主任] của chúng tôi suốt 3 năm trung học. Những [0:棵] cây trồng trong [0:校园] xanh ngát phía sau trường kia là nơi lũ học trò tinh nghịch chúng tôi nảy ra [0:主意] viết những dòng [0:留言] cho nhau trước ngày tốt nghiệp và hẹn 10 năm sau về trường tìm đọc lại; bảng đen trong lớp học này là nơi chúng tôi ôn lại cấu trúc [0:语法] của Tiếng Trung và [0:预习] trước kiến thức bài học ngày hôm sau bằng việc học chữ Hán. \"Muốn sang thì bắc [0:桥] kiều\", tại đây tôi và thầy cô cùng nhau lên thuyền vượt qua [0:海洋] tri thức mênh mông, cùng bạn bè [0:建立] nên cây cầu tình bạn vững chãi. Có thể [0:获取] được nhiều thành công như ngày hôm nay, tôi rất biết ơn khoảng thời gian trung học ấy."
        },
        {
          "who": "",
          "zh": "Dù là trời xanh [0:云] trắng hay [0:浪] to gió lớn, mỗi kỷ niệm đều phải được [0:存] thật tốt trong ngăn ký ức, bởi vì chúng ta của hiện tại đều trưởng thành từ những ký ức ấy."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "我的母校，阳光中学，是首都重点学校。今天是她五十岁的生日，也是新学期的开始，所以我出主意，约好同学们一起回母校。",
          "py": "Wǒ de mǔxiào, Yángguāng zhōngxué, shì shǒudū zhòngdiǎn xuéxiào. Jīntiān shì tā wǔshí suì de shēngrì, yěshì xīn xuéqī de kāishǐ, suǒyǐ wǒ chū zhǔyi, yuē hǎo tóngxuémen yìqǐ huí mǔxiào.",
          "vi": "Trường cũ của tôi, Trung học Ánh Dương, là một trường trọng điểm của thủ đô. Hôm nay là sinh nhật lần thứ 50 của trường và ngày đầu của học kỳ mới nên tôi đã hẹn các bạn cũ quay lại trường xưa."
        },
        {
          "who": "",
          "zh": "我还记得入学的那一天，害羞的我站在学校大门对面，不敢进入。过了一会儿，有一位老师主动过来鼓励我，后来她就成了我们的班主任。校园里的那棵树还留着我们毕业时写的很多留言，这间教室的黑板是我们复习语法，预习汉字的地方。在这里，我跟老师们游过知识的海洋，跟同学们建立了友谊[1:之]桥。我们能获取今天的成就，也感谢中学的那段美好的日子。",
          "py": "Wǒ hái jìdé rùxué de nà yì tiān, hàixiū de wǒ zhàn zài xuéxiào dàmén duìmiàn, bù gǎn jìnrù. Guò le yíhuìr, yǒu yí wèi lǎoshī zhǔdòng guòlái gǔlì wǒ, hòulái tā jiù chéng le wǒmen de bānzhǔrèn. Xiàoyuán lǐ de nà kē shù hái liúzhe wǒmen bìyè shí xiě de hěn duō liúyán, zhè jiān jiàoshì de hēibǎn shì wǒmen fùxí yǔfǎ, yùxí Hànzì de dìfang. Zài zhèlǐ, wǒ gēn lǎoshīmen yóu guo zhīshi de hǎiyáng, gēn tóngxuémen jiànlì le yǒuyì [1:zhī] qiáo. Wǒmen néng huòqǔ jīntiān de chéngjiù, yě gǎnxiè zhōngxué de nà duàn měihǎo de rìzi.",
          "vi": "Tôi còn nhớ ngày nhập học, tôi ngại ngùng đứng đối diện cổng trường không dám bước vào. Sau một thời gian, một giáo viên đã chủ động đến động viên tôi, sau này cô ấy trở thành giáo viên chủ nhiệm của chúng tôi. Cái cây trong khuôn viên trường vẫn lưu lại nhiều lời nhắn nhủ chúng tôi đã viết khi tốt nghiệp. Bảng đen trong lớp học này là nơi chúng tôi ôn lại ngữ pháp và chuẩn bị học chữ Hán mới. Tại đây, tôi và thầy cô cùng nhau bơi qua đại dương tri thức, cùng bạn bè dựng nên cây cầu [1:của] tình bạn. Tôi có thể có được thành tựu như ngày hôm nay, tôi cũng rất biết ơn khoảng thời gian cấp hai."
        },
        {
          "who": "",
          "zh": "无论是蓝天白云还是大风大浪，每个回忆都要好好儿地存起来，因为现在的我们都是从这些回忆中走出来的。",
          "py": "Wúlùn shì lántiān báiyún háishi dàfēng dàlàng, měi ge huíyì dōu yào hǎohāor de cún qǐlái, yīnwèi xiànzài de wǒmen dōu cóng zhèxiē huíyì zhōng zǒu chūlái de.",
          "vi": "Dù là trời xanh mây trắng hay mưa to gió lớn, mỗi ký ức đều phải được lưu giữ thật tốt, bởi vì bây giờ chúng ta đều bước ra từ những ký ức này."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "之",
          "np": "NP 19.1"
        }
      ]
    }
  ],
  "70": [
    {
      "title": "Chém gió song ngữ",
      "variant": "bilingual",
      "lines": [
        {
          "who": "",
          "zh": "Tuần trước tôi đi công tác Hà Nội, trước khi đi có chuyện đột xuất, tôi phải [0:推迟] thời gian ra sân bay thêm nửa tiếng."
        },
        {
          "who": "",
          "zh": "Sau khi [0:处理] xong xuôi mọi việc, tôi [0:赶紧] chạy ra cửa vẫy gọi ngay taxi, nhưng lúc đi không may [0:碰] đúng cảnh tắc đường, nhìn trái nhìn phải [0:到处] đều là người, lãng phí mất bao nhiêu thời gian."
        },
        {
          "who": "",
          "zh": "Khi đến nơi, tôi xuống xe ở [0:入口] của sân bay chứ chưa đi vào bên trong, đang lục tìm trong ví xem có đồng [0:零钱] nào để trả cho tài xế không, thì không may cánh tay bị cửa xe [0:撞] vào đau điếng, [0:胳膊] của tôi lúc đó đau buốt như bị [0:打针] bằng kim tiêm vậy."
        },
        {
          "who": "",
          "zh": "Lúc đi vào còn phải [0:排队] ngay ngắn theo thứ tự để người và đồ đi qua máy quét, qua được cửa [0:安检] của Cảnh sát sân bay, nhân viên mới nói rằng tôi đã đến muộn."
        },
        {
          "who": "",
          "zh": "Những tưởng hôm nay bước chân trái ra đường nên chẳng có chút [0:运气] nào, nhưng [0:幸运] thay, lúc đó nghe được thông báo: Do nguyên nhân thời tiết, [0:航班] mang số hiệu VN123 của tôi không thể cất cánh [0:正点] như dự kiến, bị [0:晚点] hai tiếng đồng hồ, thế là tôi đã được nhân viên cấp [0:登机牌] lên máy bay rồi."
        },
        {
          "who": "",
          "zh": "Nhờ có trải nghiệm lần này tôi hiểu ra: May rủi đan xen, cuộc sống thật [0:无常] và khó đoán định, nhất định phải [0:尽力而为] hết sức mình, không bao giờ bỏ cuộc cho đến giây phút cuối cùng."
        }
      ]
    },
    {
      "title": "Nói như người bản xứ",
      "lines": [
        {
          "who": "",
          "zh": "上个礼拜我去河内出差，出发前突然发生意外，我得推迟去机场的时间。",
          "py": "Shàng ge lǐbài wǒ qù Hénèi chūchāi, chūfā qián tūrán fāshēng yìwài, wǒ děi tuīchí qù jīchǎng de shíjiān.",
          "vi": "Tôi đi công tác ở Hà Nội tuần trước, trước khi đi thì xảy ra sự cố khiến tôi phải hoãn thời gian ra sân bay."
        },
        {
          "who": "",
          "zh": "处理好以后，我赶紧叫辆出租车。但碰上堵车，到处都是人，我的时间就浪费在堵车中了。",
          "py": "Chǔlǐ hǎo yǐhòu, wǒ gǎnjǐn jiào liàng chūzūchē. Dàn pèng shàng dǔchē, dàochù dōu shì rén, wǒ de shíjiān jiù làngfèi zài dǔchē zhōng le.",
          "vi": "Xử lý xong, tôi vội gọi taxi. Nhưng gặp tắc đường, người ở khắp nơi, lãng phí nhiều thời gian của tôi."
        },
        {
          "who": "",
          "zh": "到了机场，在入口给司机找零钱的时候，我不小心被车门撞了，胳膊像打针一样疼。",
          "py": "Dào le jīchǎng, zài rùkǒu gěi sījī zhǎo língqián de shíhou, wǒ bù xiǎoxīn bèi chēmén zhuàng le, gēbo xiàng dǎzhēn yíyàng téng.",
          "vi": "Khi đến sân bay, ở cổng vào, tôi không may bị va vào cửa xe khi đang tìm tiền lẻ để trả cho tài xế, cánh tay bị đau như tiêm."
        },
        {
          "who": "",
          "zh": "进入时还要排队做安检。过了以后，工作人员[1:倒]说我迟到了。",
          "py": "Jìnrù shí hái yào páiduì zuò ānjiǎn. Guò le yǐhòu, gōngzuò rényuán [1:dào] shuō wǒ chídào le.",
          "vi": "Khi đi vào, tôi phải xếp hàng để kiểm tra an ninh. Sau khi qua, nhân viên [1:lại] nói rằng tôi đã đến muộn."
        },
        {
          "who": "",
          "zh": "还以为今天运气很不好了，但幸运的是，那时却听到通知：由于天气原因，我的航班不能正点起飞，晚点了两个小时，我终于拿到登机牌了。",
          "py": "Hái yǐwéi jīntiān yùnqi hěn bù hǎo le, dàn xìngyùn de shì, nà shí què tīng dào tōngzhī: Yóuyú tiānqì yuányīn, wǒ de hángbān bùnéng zhèngdiǎn qǐfēi, wǎndiǎn le liǎng ge xiǎoshí, wǒ zhōngyú ná dào dēngjī pái le.",
          "vi": "Tôi cứ nghĩ hôm nay xui xẻo lắm rồi, nhưng may mắn thay, lúc đó tôi nghe được thông báo: Do nguyên nhân thời tiết, chuyến bay của tôi không thể cất cánh đúng giờ, bị hoãn hai tiếng đồng hồ, cuối cùng tôi cũng nhận được thẻ lên máy bay rồi."
        },
        {
          "who": "",
          "zh": "这次经历让我明白：[2:一方面]，做事前必须做好计划，不要太随意。[2:另一方面]，生活也无常，一定尽力而为，不到最后一刻，千万别放弃。",
          "py": "Zhè cì jīnglì ràng wǒ míngbai: [2:Yì fāngmiàn], zuò shì qián bìxū zuò hǎo jìhuà, búyào tài suíyì. [2:Lìng yì fāngmiàn], shēnghuó yě wúcháng, yídìng jìnlì ér wéi, bú dào zuìhòu yí kè, qiānwàn bié fàngqì.",
          "vi": "Trải nghiệm này khiến tôi hiểu rằng: [2:Một mặt], bạn phải lập kế hoạch tốt trước khi thực hiện mọi việc, đừng quá tùy tiện. [2:Mặt khác], cuộc sống cũng vô thường, bạn phải nỗ lực hết mình và đừng bao giờ bỏ cuộc cho đến phút cuối cùng."
        }
      ],
      "legend": [
        {
          "n": 1,
          "label": "倒",
          "np": "NP 20.1"
        },
        {
          "n": 2,
          "label": "一方面…另一方面…",
          "np": "NP 20.2"
        }
      ]
    }
  ]
}
