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
  ]
}
