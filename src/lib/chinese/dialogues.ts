// Hội thoại "Nói như người bản xứ" của từng bài (giáo trình Tiếng Trung Cảm Xúc). Mỗi câu gồm chữ Hán, pinyin,
// bản dịch tiếng Việt. Từ/cụm từ thuộc điểm ngữ pháp được đánh dấu bằng cú pháp [n:chữ] — n là số thứ tự trong
// `legend` của hội thoại đó (1..6, mỗi số 1 màu); n = 0 là từ tiếng Trung xen trong đoạn "Chém gió song ngữ".
export interface DialogueLine {
  who: string // 'A' | 'B' | '' (đoạn văn không có người nói)
  zh: string
  py?: string
  vi?: string
}

export interface DialogueLegend {
  n: number
  label: string
  np: string // vd 'NP 1.1'
}

export interface Dialogue {
  title?: string
  // 'bilingual': câu là tiếng Việt xen từ tiếng Trung (không có pinyin / bản dịch) — hiện chữ thường, không to như chữ Hán.
  variant?: 'bilingual'
  lines: DialogueLine[]
  legend?: DialogueLegend[]
  note?: { title: string; text: string }
}

const L = (who: string, zh: string, py?: string, vi?: string): DialogueLine => ({ who, zh, py, vi })

export const DIALOGUES: Record<number, Dialogue[]> = {
  1: [
    {
      lines: [
        L('A', '你好！', 'Nǐ hǎo!', 'Chào bạn!'),
        L('B', '你好！', 'Nǐ hǎo!', 'Chào bạn!'),
        L('A', '你叫[1:什么]名字？', 'Nǐ jiào [1:shénme] míngzi?', 'Bạn tên [1:gì]?'),
        L('B', '我叫阮美，美丽[2:的]美。你[3:呢]？', "Wǒ jiào Ruǎn Měi, Měilì [2:de] Měi. Nǐ [3:ne]?", 'Mình tên là Nguyễn Mỹ, Mỹ [2:trong] Mỹ Lệ (xinh đẹp). Còn bạn?'),
        L('A', '我姓李，叫李建成。我[4:是]中国人。你[3:呢]？', 'Wǒ xìng Lǐ, jiào Lǐ Jiànchéng. Wǒ [4:shì] Zhōngguó rén. Nǐ [3:ne]?', 'Mình họ Lý, tên [4:là] Lý Kiến Thành. Mình là người Trung Quốc, còn bạn thì sao?'),
        L('B', '我是越南人。', 'Wǒ shì Yuènán rén.', 'Mình là người Việt Nam.'),
        L('A', '你的手机号是[5:多少]？', 'Nǐ de shǒujī hào shì [5:duōshao]?', 'Số di động của bạn là [5:bao nhiêu]?'),
        L('B', '我的手机号是0912345678。', 'Wǒ de shǒujī hào shì 0912345678.', 'Số di động của mình là 0912345678.'),
      ],
      legend: [
        { n: 1, label: '什么', np: 'NP 1.1' },
        { n: 2, label: '的', np: 'NP 1.2' },
        { n: 3, label: '呢', np: 'NP 1.3' },
        { n: 4, label: '是', np: 'NP 1.4' },
        { n: 5, label: '多少', np: 'NP 1.5' },
      ],
    },
  ],
  2: [
    {
      lines: [
        L('A', '建成，你是学生[1:吗]？', 'Jiànchéng, nǐ shì xuésheng [1:ma]?', 'Kiến Thành, bạn vẫn đang đi học [1:phải không]?'),
        L('B', '不，我不是学生，我工作[2:了]，我是职员。', 'Bù, wǒ búshì xuésheng, wǒ gōngzuò [2:le], wǒ shì zhíyuán.', 'Không, mình không phải học sinh, mình đi làm [2:rồi], giờ mình là nhân viên.'),
        L('A', '是吗？你[3:多大]了？', 'Shì ma? Nǐ [3:duōdà] le?', 'Vậy sao? Bạn [3:bao nhiêu tuổi] rồi?'),
        L('B', '我24岁。', 'Wǒ èrshísì suì.', 'Mình 24 tuổi.'),
        L('A', '你家都[4:有]什么人？', 'Nǐ jiā dōu [4:yǒu] shénme rén?', 'Vậy à. Nhà bạn [4:có] những ai?'),
        L('B', '我家有爸爸，妈妈[5:和]我。我爸爸54岁，我妈妈50岁。', 'Wǒ jiā yǒu bàba, māma [5:hé] wǒ. Wǒ bàba wǔshísì suì, wǒ māma wǔshí suì.', 'Nhà mình có bố, mẹ [5:và] mình. Bố mình 54 tuổi, mẹ mình 50 tuổi.'),
        L('A', '你爸爸妈妈做什么工作？', 'Nǐ bàba māma zuò shénme gōngzuò?', 'Bố mẹ bạn làm nghề gì?'),
        L('B', '我爸爸妈妈[6:都]是北京大学的老师。', 'Wǒ bàba māma [6:dōu] shì Běijīng dàxué de lǎoshī.', 'Bố mẹ mình [6:đều] là giáo viên của Đại học Bắc Kinh.'),
        L('A', '认识你很高兴！', 'Rènshi nǐ hěn gāoxìng!', 'Rất vui khi biết bạn!'),
      ],
      legend: [
        { n: 1, label: '吗', np: 'NP 2.1' },
        { n: 2, label: '了', np: 'NP 2.2' },
        { n: 3, label: '多大', np: 'NP 2.3' },
        { n: 4, label: '有', np: 'NP 2.4' },
        { n: 5, label: '和', np: 'NP 2.5' },
        { n: 6, label: '都', np: 'NP 2.6' },
      ],
      note: {
        title: 'Chú thích',
        text: 'Trong tiếng Trung, 大学生 /dàxuéshēng/ dùng để chỉ sinh viên đại học. Tuy nhiên, trong giao tiếp thông thường, người Trung Quốc không hỏi 你是大学生吗？ /nǐ shì dàxuéshēng ma/, mà dùng cách hỏi chung chung 你是学生吗？ để hỏi đối phương có đang đi học không. Cách hỏi này khá tế nhị, tránh gây khó chịu cho đối phương khi người đó không học đại học.',
      },
    },
  ],
  3: [
    {
      title: 'Hội thoại 1',
      lines: [
        L('A', '这是什么？', 'Zhè shì shénme?', 'Đây là cái gì?'),
        L('B', '这是书。', 'Zhè shì shū.', 'Đây là sách.'),
        L('A', '这是什么书？', 'Zhè shì shénme shū?', 'Đây là sách gì?'),
        L('B', '汉语书。', 'Hànyǔ shū.', 'Sách tiếng Hán.'),
        L('A', '是[1:谁]的书？', 'Shì [1:shéi] de shū?', 'Là sách của [1:ai]?'),
        L('B', '是我朋友的书。她是老师。', 'Shì wǒ péngyou de shū. Tā shì lǎoshī.', 'Là sách của bạn tôi. Cô ấy là giáo viên.'),
      ],
      legend: [{ n: 1, label: '谁', np: 'NP 3.1' }],
    },
    {
      title: 'Hội thoại 2',
      lines: [
        L('A', '桌子[2:上]有什么？', 'Zhuōzi [2:shang] yǒu shénme?', '[2:Trên] bàn có cái gì?'),
        L('B', '桌子[2:上]有一[3:本]书。', 'Zhuōzi [2:shang] yǒu yì [3:běn] shū.', '[2:Trên] bàn có một [3:cuốn] sách.'),
        L('A', '我的手机[4:在][5:哪儿]？', 'Wǒ de shǒujī [4:zài] [5:nǎr]?', 'Điện thoại của tôi [4:ở] [5:đâu]?'),
        L('B', '你的手机在那个书包里。', 'Nǐ de shǒujī zài nà ge shūbāo li.', 'Điện thoại của bạn ở trong cái cặp sách kia.'),
        L('A', '谢谢。', 'Xièxie.', 'Cảm ơn.'),
        L('B', '不客气。', 'Bú kèqi.', 'Đừng khách sáo.'),
      ],
      legend: [
        { n: 2, label: '上', np: 'NP 3.2' },
        { n: 3, label: '本', np: 'NP 3.3' },
        { n: 4, label: '在', np: 'NP 3.4' },
        { n: 5, label: '哪儿', np: 'NP 3.5' },
      ],
    },
  ],
  4: [
    {
      title: 'Hội thoại 1',
      lines: [
        L('A', '你[1:会]说汉语吗？', 'Nǐ [1:huì] shuō Hànyǔ ma?', 'Bạn [1:có thể] nói tiếng Trung không?'),
        L('B', '我会说一点儿。', 'Wǒ huì shuō yìdiǎnr.', 'Tớ có thể nói một chút.'),
        L('A', '这个字是“菜”字。那是什么字？', 'Zhè ge zì shì “cài” zì. Nà shì shénme zì?', 'Chữ này là chữ 菜 (món ăn). Chữ kia là chữ gì?'),
        L('B', '那个字我不认识，也不会读。', 'Nà ge zì wǒ bú rènshi, yě bú huì dú.', 'Chữ kia tớ không quen, cũng không biết đọc như thế nào.'),
        L('A', '没关系。你会做什么菜？', 'Méi guānxi. Nǐ huì zuò shénme cài?', 'Không sao. Bạn biết nấu món gì?'),
        L('B', '越南菜我都会做，我[2:还]会做中国菜。[3:中国菜很好吃]。', 'Yuènán cài wǒ dōu huì zuò, wǒ [2:hái] huì zuò Zhōngguó cài. [3:Zhōngguó cài hěn hǎochī].', 'Món ăn Việt Nam tớ đều biết nấu, tớ [2:còn] biết nấu món ăn Trung Quốc. [3:Món ăn Trung Quốc rất ngon].'),
      ],
      legend: [
        { n: 1, label: '会', np: 'NP 4.1' },
        { n: 2, label: '还', np: 'NP 4.2' },
        { n: 3, label: '中国菜很好吃', np: 'NP 4.3' },
      ],
    },
    {
      title: 'Hội thoại 2',
      lines: [
        L('A', '你的名字[4:怎么]写？你[5:在]这儿写[6:吧]！', 'Nǐ de míngzi [4:zěnme] xiě? Nǐ [5:zài] zhèr xiě [6:ba]!', 'Tên của cậu viết [4:như thế nào]? Bạn viết [5:ở] đây [6:đi]!'),
        L('B', '对不起，我的名字我只会说，不会写。', 'Duìbuqǐ, wǒ de míngzi wǒ zhǐ huì shuō, bú huì xiě.', 'Xin lỗi, tớ chỉ biết nói tên tớ, chứ không biết viết.'),
        L('A', '没关系。', 'Méi guānxi.', 'Không sao cả.'),
      ],
      legend: [
        { n: 4, label: '怎么', np: 'NP 4.4' },
        { n: 5, label: '在 (2)', np: 'NP 4.5' },
        { n: 6, label: '吧', np: 'NP 4.6' },
      ],
    },
  ],
  5: [
    {
      lines: [
        L('A', '今天是[1:几月几号]？', 'Jīntiān shì [1:jǐ yuè jǐ hào]?', 'Hôm nay là [1:ngày mấy tháng mấy]?'),
        L('B', '今天是八月十六号，星期二。', "Jīntiān shì bā yuè shíliù hào, xīngqī'èr.", 'Hôm nay là ngày 16 tháng 08, thứ ba.'),
        L('A', '[2:那]明天是我[3:们]女儿的生日了。我们[4:去北京玩儿]吧！', "[2:Nà] míngtiān shì [3:wǒmen] nǚ'ér de shēngrì le. Wǒmen [4:qù Běijīng wánr] ba!", '[2:Thế thì] ngày mai là sinh nhật của con gái [3:chúng ta] rồi. Chúng ta [4:đi Bắc Kinh chơi] đi!'),
        L('B', '对不起，我明天还要上班，公司有事要做，我不去了。', 'Duìbuqǐ, wǒ míngtiān hái yào shàng bān, gōngsī yǒu shì yào zuò, wǒ bú qù le.', 'Xin lỗi, mai anh phải đi làm, công ty có việc phải làm, anh không đi được.'),
        L('A', '[5:真]难过。这个星期六呢？', '[5:Zhēn] nánguò. Zhè ge xīngqīliù ne?', '[5:Thật] buồn. Thế thứ Bảy tuần này thì sao?'),
        L('B', '好。星期六吧！', 'Hǎo. Xīngqīliù ba!', 'Được. Thứ Bảy nhé!'),
      ],
      legend: [
        { n: 1, label: '几月几号', np: 'NP 5.1' },
        { n: 2, label: '那', np: 'NP 5.2' },
        { n: 3, label: '们', np: 'NP 5.3' },
        { n: 4, label: '去北京玩儿', np: 'NP 5.4' },
        { n: 5, label: '真', np: 'NP 5.5' },
      ],
    },
  ],
  6: [
    {
      title: 'Hội thoại',
      lines: [
        L('A', '现在几点了？', 'Xiànzài jǐ diǎn le?', 'Bây giờ mấy giờ rồi?'),
        L('B', '现在[1:九点五十]。', 'Xiànzài [1:jiǔ diǎn wǔshí].', 'Bây giờ [1:9 giờ 50].'),
        L('A', '中午几点吃饭？', 'Zhōngwǔ jǐ diǎn chī fàn?', 'Buổi trưa mấy giờ ăn cơm?'),
        L('B', '十二点。', "Shí'èr diǎn.", 'Mười hai giờ.'),
        L('A', '什么时候休息？', 'Shénme shíhou xiūxi?', 'Khi nào nghỉ ngơi?'),
        L('B', '十二点半。', "Shí'èr diǎn bàn.", 'Mười hai rưỡi.'),
      ],
      legend: [{ n: 1, label: '九点五十', np: 'NP 6.1' }],
    },
    {
      title: 'Đoạn văn',
      lines: [
        L(
          '',
          '我叫阮美，我28岁。[2:今天早上]我六点半起床，七点吃早饭，七点半出门上班，八点钟到公司。我[3:从]上午八点[3:到]下午五点半上班。晚上八点我和我的朋友去看电影。我十点回家，洗澡，休息。我十一点睡觉。',
          'Wǒ jiào Ruǎn Měi, wǒ èrshíbā suì. [2:Jīntiān zǎoshang] wǒ liù diǎn bàn qǐ chuáng, qī diǎn chī zǎofàn, qī diǎn bàn chū mén shàng bān, bā diǎnzhōng dào gōngsī. Wǒ [3:cóng] shàngwǔ bā diǎn [3:dào] xiàwǔ wǔ diǎn bàn shàng bān. Wǎnshang bā diǎn wǒ hé wǒ de péngyou qù kàn diànyǐng. Wǒ shí diǎn huí jiā, xǐ zǎo, xiūxi. Wǒ shíyī diǎn shuìjiào.',
          'Tôi là Nguyễn Mỹ, tôi 28 tuổi. [2:Sáng hôm nay] 6 rưỡi tôi thức dậy, 7 giờ ăn sáng, 7 rưỡi ra khỏi nhà đi làm, 8 giờ tới công ty. Tôi làm việc [3:từ] 8 giờ sáng [3:đến] 5 rưỡi chiều. 8 giờ tối tôi và bạn tôi đi xem phim. 10 giờ tôi về nhà, tắm rửa, nghỉ ngơi. 11 giờ tôi đi ngủ.',
        ),
      ],
      legend: [
        { n: 2, label: '今天早上', np: 'NP 6.2' },
        { n: 3, label: '从…到', np: 'NP 6.3' },
      ],
    },
  ],
  7: [
    {
      title: 'Chém gió song ngữ 1',
      variant: 'bilingual',
      lines: [
        L('A', '[0:老板] ơi, nhà mình có [0:牛奶] Vinamilk không?'),
        L('B', 'Có. Bốn đồng năm một [0:瓶].'),
        L('A', 'Tôi muốn mua [0:两] chai cho hai bé nhà tôi.'),
        L('B', 'Còn muốn [0:买] thêm gì khác không?'),
        L('A', 'Tôi [0:再买] hai quả [0:鸡蛋] về rán. Tổng cộng bao nhiêu [0:钱]?'),
        L('B', '[0:一共] 12 đồng.'),
      ],
    },
    {
      title: 'Chém gió song ngữ 2',
      variant: 'bilingual',
      lines: [
        L('A', 'Táo bao nhiêu tiền một cân đấy?'),
        L('B', 'Đang mùa [0:苹果] nên chỉ ba đồng năm một [0:斤] thôi, rẻ lắm.'),
        L('A', '[0:太贵了], thế mà bảo là [0:便宜]. Giảm giá chút đi.'),
        L('B', '[0:行], giảm còn ba [0:块] nhé. Anh mua bao nhiêu?'),
        L('A', 'Tôi muốn mua [0:两] cân táo.'),
        L('B', 'Tổng cộng sáu đồng. Còn nhiều loại [0:水果] tươi ngon lắm này, mua thêm không?'),
        L('A', 'Thôi không mua đâu. [0:给] chị tiền này.'),
        L('B', 'Cảm ơn anh. Anh đi [0:慢慢] nhé!'),
      ],
    },
    {
      title: 'Hội thoại 1',
      lines: [
        L('A', '老板，有牛奶吗？', 'Lǎobǎn, yǒu niúnǎi ma?', 'Ông chủ. Có sữa bò không?'),
        L('B', '有。四[1:块]五一瓶。', 'Yǒu. Sì [1:kuài] wǔ yì píng.', 'Có. Bốn [1:đồng] rưỡi một chai.'),
        L('A', '我要[2:两]瓶。', 'Wǒ yào [2:liǎng] píng.', 'Tôi muốn [2:hai] chai.'),
        L('B', '还要别的吗？', 'Hái yào biéde ma?', 'Cậu còn muốn mua gì khác không?'),
        L('A', '[3:再]买两个鸡蛋。一共多少钱？', '[3:Zài] mǎi liǎng ge jīdàn. Yígòng duōshao qián?', 'Mua [3:thêm] hai quả trứng gà. Tổng cộng bao nhiêu tiền?'),
        L('B', '一共十二块。', "Yígòng shí'èr kuài.", 'Tổng cộng 12 đồng.'),
      ],
      legend: [
        { n: 1, label: '块', np: 'NP 7.1' },
        { n: 2, label: '两', np: 'NP 7.2' },
        { n: 3, label: '再', np: 'NP 7.3' },
      ],
    },
    {
      title: 'Hội thoại 2',
      lines: [
        L('A', '苹果多少钱一斤？', 'Píngguǒ duōshao qián yì jīn?', 'Táo bao nhiêu tiền một cân?'),
        L('B', '三块五一斤。', 'Sān kuài wǔ yì jīn.', 'Ba đồng rưỡi một cân.'),
        L('A', '[4:太]贵了，便宜一点儿，行吗？', '[4:Tài] guì le, piányi yìdiǎnr, xíng ma?', 'Đắt [4:quá], rẻ một chút đi, được không?'),
        L('B', '行，三块吧。你要多少？', 'Xíng, sān kuài ba. Nǐ yào duōshao?', 'Được, ba đồng nhé. Anh muốn bao nhiêu?'),
        L('A', '我要两斤。', 'Wǒ yào liǎng jīn.', 'Tôi muốn hai cân.'),
        L('B', '一共六块。还要别的水果吗？', 'Yígòng liù kuài. Hái yào bié de shuǐguǒ ma?', 'Tổng cộng sáu đồng. Còn muốn loại trái cây nào khác không?'),
        L('A', '不要了。给你钱。', 'Búyào le. Gěi nǐ qián.', 'Không muốn nữa. Trả cậu tiền này.'),
        L('B', '谢谢。你慢走！', 'Xièxie. Nǐ màn zǒu.', 'Cảm ơn. Anh đi thong thả nhé!'),
      ],
      legend: [{ n: 4, label: '太', np: 'NP 7.4' }],
    },
  ],
  8: [
    {
      title: 'Hội thoại 1',
      lines: [
        L('A', '今天的天气[1:怎么样]？', 'Jīntiān de tiānqì [1:zěnmeyàng]?', 'Thời tiết hôm nay [1:như thế nào]?'),
        L('B', '今天下大雨。', 'Jīntiān xià dàyǔ.', 'Hôm nay mưa to.'),
        L('A', '明天呢？明天的天气怎么样？', 'Míngtiān ne? Míngtiān de tiānqì zěnmeyàng?', 'Ngày mai thì sao? Thời tiết ngày mai như thế nào?'),
        L('B', '[2:明天天气很好]，是晴天。', '[2:Míngtiān tiānqì hěn hǎo], shì qíngtiān.', '[2:Thời tiết ngày mai rất đẹp], là ngày nắng.'),
      ],
      legend: [
        { n: 1, label: '怎么样', np: 'NP 8.1' },
        { n: 2, label: '明天天气很好', np: 'NP 8.2' },
      ],
    },
    {
      title: 'Hội thoại 2',
      lines: [
        L('A', '河内夏天的天气怎么样？', 'Hénèi xiàtiān de tiānqì zěnmeyàng?', 'Thời tiết mùa hè của Hà Nội như thế nào?'),
        L('B', '河内的夏天太热了，天天都是四十度。', 'Hénèi de xiàtiān tài rè le, tiāntiān dōu shì sìshí dù.', 'Mùa hè của Hà Nội nóng lắm, ngày nào cũng đều 40 độ.'),
        L('A', '秋天呢？听说秋天是[3:最]好的季节？', 'Qiūtiān ne? Tīngshuō qiūtiān shì [3:zuì] hǎo de jìjié?', 'Mùa thu thì sao? Nghe nói mùa thu là mùa đẹp [3:nhất]?'),
        L('B', '对，河内的秋天[4:不冷不热]，很舒服。春天也很舒服。', 'Duì, Hénèi de qiūtiān [4:bù lěng bú rè], hěn shūfu. Chūntiān yě hěn shūfu.', 'Đúng, mùa thu của Hà Nội [4:không lạnh không nóng], rất thoải mái. Mùa xuân cũng rất dễ chịu.'),
        L('A', '你最喜欢什么季节？', 'Nǐ zuì xǐhuan shénme jìjié?', 'Bạn thích nhất mùa nào?'),
        L('B', '我最喜欢冬天。', 'Wǒ zuì xǐhuan dōngtiān.', 'Tớ thích mùa đông nhất.'),
      ],
      legend: [
        { n: 3, label: '最', np: 'NP 8.3' },
        { n: 4, label: '不冷不热', np: 'NP 8.4' },
      ],
    },
  ],
  9: [
    {
      title: 'Hội thoại 1',
      lines: [
        L('A', '请问，去医院怎么走？', 'Qǐngwèn, qù yīyuàn zěnme zǒu?', 'Xin hỏi, đến bệnh viện đi như thế nào?'),
        L('B', '[1:就]在前面，一直[2:往]前走。', 'Jiù zài qiánmiàn, yìzhí [2:wǎng] qián zǒu.', 'Ở [1:ngay] trước mặt, cứ [2:hướng] thẳng phía trước là tới.'),
        L('A', '远吗？', 'Yuǎn ma?', 'Xa không?'),
        L('B', '不远，[3:在银行的旁边]。', 'Bù yuǎn, [3:zài yínháng de pángbiān].', 'Không xa, [3:ở bên cạnh ngân hàng].'),
      ],
      legend: [
        { n: 1, label: '就', np: 'NP 9.1' },
        { n: 2, label: '往', np: 'NP 9.2' },
        { n: 3, label: '在银行的旁边', np: 'NP 9.3' },
      ],
    },
    {
      title: 'Hội thoại 2',
      lines: [
        L('A', '小芳，你家[4:离]公司[5:多远]？', 'Xiǎo Fāng, nǐ jiā [4:lí] gōngsī [5:duōyuǎn]?', 'Tiểu Phương, nhà cậu [4:cách] công ty [5:bao xa]?'),
        L('B', '我家离公司两公里。', 'Wǒ jiā lí gōngsī liǎng gōnglǐ.', 'Nhà tớ cách công ty 2 km.'),
        L('A', '怎么走？', 'Zěnme zǒu?', 'Đi như thế nào?'),
        L('B', '出门[6:以后]往右拐，到银行往左拐就到了。', 'Chū mén [6:yǐhòu] wǎng yòu guǎi, dào yínháng wǎng zuǒ guǎi jiù dào le.', '[6:Sau khi] ra khỏi cổng thì rẽ phải, đến ngân hàng rẽ trái là tới.'),
        L('A', '要走多久？', 'Yào zǒu duōjiǔ?', 'Đi mất bao lâu?'),
        L('B', '要十分钟。', 'Yào shí fēnzhōng.', 'Mất 10 phút.'),
      ],
      legend: [
        { n: 4, label: '离', np: 'NP 9.4' },
        { n: 5, label: '多远', np: 'NP 9.5' },
        { n: 6, label: '以后', np: 'NP 9.6' },
      ],
    },
  ],
  10: [
    {
      lines: [
        L('A', '[1:喂]，是美玲吗？', 'Wèi, shì Měilíng ma?', '[1:Alo], Mỹ Linh phải không?'),
        L('B', '是我。', 'Shì wǒ.', 'Chính là mình đây.'),
        L('A', '你[2:在]做什么呢？', 'Nǐ [2:zài] zuò shénme ne?', 'Bạn [2:đang] làm gì đấy?'),
        L('B', '我在看电视。', 'Wǒ zài kàn diànshì.', 'Mình đang xem tivi.'),
        L('A', '美玲，明天晚上你有空儿吗？', 'Měilíng, míngtiān wǎnshang nǐ yǒu kòngr ma?', 'Mỹ Linh, tối ngày mai bạn có thời gian rảnh không?'),
        L('B', '我有事了。', 'Wǒ yǒu shì le.', 'Mình có việc rồi.'),
        L('A', '那周末呢？', 'Nà zhōumò ne?', 'Thế cuối tuần thì sao?'),
        L('B', '周末我有空儿，有事吗？', 'Zhōumò wǒ yǒu kòngr, yǒushì ma?', 'Cuối tuần tớ có thời gian rảnh, có việc gì không?'),
        L('A', '我们一起去看电影吧，我有两张票。', 'Wǒmen yìqǐ qù kàn diànyǐng ba, wǒ yǒu liǎng zhāng piào.', 'Chúng mình cùng đi xem phim đi, tớ có hai vé.'),
        L('B', '是新电影吗？', 'Shì xīn diànyǐng ma?', 'Là phim mới à?'),
        L('A', '对，是现在最好看的中国电影。', 'Duì, shì xiànzài zuì hǎokàn de Zhōngguó diànyǐng.', 'Đúng, là phim Trung Quốc hay nhất hiện nay.'),
        L('B', '太好了，我很喜欢看中国电影。我们几点去？', 'Tài hǎo le, wǒ hěn xǐhuan kàn Zhōngguó diànyǐng. Wǒmen jǐ diǎn qù?', 'Tốt quá, mình rất thích xem phim Trung Quốc. Mấy giờ chúng mình đi?'),
        L('A', '晚上八点半去吧！', 'Wǎnshang bā diǎn bàn qù ba!', 'Tám rưỡi tối đi nhé!'),
        L('B', '好。那我们[3:先]一起去吃饭，[3:然后]去电影院，怎么样？', 'Hǎo. Nà wǒmen [3:xiān] yìqǐ qù chī fàn, [3:ránhòu] qù diànyǐngyuàn, zěnmeyàng?', 'Được. Vậy chúng mình cùng đi ăn tối [3:trước], [3:sau đó] đến rạp chiếu phim, thấy sao?'),
        L('A', '行。我们怎么去？', 'Xíng. Wǒmen zěnme qù?', 'Được. Chúng mình đi như thế nào?'),
        L('B', '我们家都离电影院很远，我不[4:想][5:骑]自行车。[5:坐]公交车吧。', 'Wǒmen jiā dōu lí diànyǐngyuàn hěn yuǎn, wǒ bù [4:xiǎng] [5:qí] zìxíngchē. [5:Zuò] gōngjiāochē ba.', 'Nhà chúng ta đều cách rạp chiếu phim rất xa, tớ không [4:muốn] [5:đạp] xe đạp. [5:Ngồi] xe buýt nhé!'),
      ],
      legend: [
        { n: 1, label: '喂', np: 'NP 10.1' },
        { n: 2, label: '在', np: 'NP 10.2' },
        { n: 3, label: '先……然后……', np: 'NP 10.3' },
        { n: 4, label: '想', np: 'NP 10.4' },
        { n: 5, label: '骑、坐', np: 'NP 10.5' },
      ],
    },
  ],
  11: [
    {
      title: 'Hội thoại 1',
      lines: [
        L('A', '早上我[1:给]你打电话，你没接。去哪儿[2:了]？', 'Zǎoshang wǒ [1:gěi] nǐ dǎ diànhuà, nǐ méi jiē. Qù nǎr [2:le]?', 'Sáng anh gọi điện thoại cho em, em không bắt máy. Em đi đâu đấy?'),
        L('B', '啊，我和女儿去商店买东西了。商店的东西好看[3:极了]！', "A, wǒ hé nǚ'ér qù shāngdiàn mǎi dōngxi le. Shāngdiàn de dōngxi hǎokàn [3:jí le]!", 'À, em và con gái đi cửa hàng mua đồ. Đồ ở cửa hàng đẹp [3:cực kỳ]!'),
        L('A', '你们买了什么？', 'Nǐmen mǎi le shénme?', 'Hai mẹ con đã mua những gì?'),
        L('B', '我买了很多衣服。', 'Wǒ mǎi le hěn duō yīfu.', 'Em đã mua rất nhiều quần áo.'),
        L('A', '女儿买了什么？', "Nǚ'ér mǎi le shénme?", 'Thế con gái đã mua gì?'),
        L('B', '她没买什么。这些都是我[4:的]。', 'Tā méi mǎi shénme. Zhèxiē dōu shì wǒ [4:de].', 'Con chẳng mua gì. Những thứ này đều là đồ [4:của] em.'),
      ],
      legend: [
        { n: 1, label: '给', np: 'NP 11.1' },
        { n: 2, label: '了', np: 'NP 11.2' },
        { n: 3, label: '极了', np: 'NP 11.3' },
        { n: 4, label: '的', np: 'NP 11.4' },
      ],
    },
    {
      title: 'Hội thoại 2',
      lines: [
        L('A', '爸爸[1:呢]？他的身体怎么样了？', 'Bàba [1:ne]? Tā de shēntǐ zěnmeyàng le?', 'Bố [1:đâu]? Sức khỏe của ông thế nào rồi?'),
        L('B', '好[2:多了]。', 'Hǎo [2:duō le].', 'Đỡ [2:nhiều rồi].'),
        L('A', '再给爸爸吃这个药吧，[3:是]姐姐从中国买[3:的]。', 'Zài gěi bàba chī zhè ge yào ba, [3:shì] jiějie cóng Zhōngguó mǎi [3:de].', 'Cho bố uống thêm thuốc này đi, thuốc này chị mua tận Trung Quốc đấy.'),
        L('B', '知道了。昨天的报纸上也说这个很好。', 'Zhīdào le. Zuótiān de bàozhǐ shang yě shuō zhè ge hěn hǎo.', 'Em biết rồi. Báo hôm qua cũng có nói thuốc này rất tốt.'),
      ],
      legend: [
        { n: 1, label: '呢', np: 'NP 11.5' },
        { n: 2, label: '多了', np: 'NP 11.6' },
        { n: 3, label: '是……的', np: 'NP 11.7' },
      ],
    },
  ],
  12: [
    {
      title: 'Hội thoại 1',
      lines: [
        L('A', '帮我看[1:一下]，这几件衣服怎么样？', 'Bāng wǒ kàn [1:yíxià], zhè jǐ jiàn yīfu zěnmeyàng?', 'Nhìn giúp tôi [1:một lát], mấy bộ quần áo này như thế nào?'),
        L('B', '这件红的还可以，[2:就是][3:有点儿]小，大[3:一点儿]就好。', 'Zhè jiàn hóng de hái kěyǐ, [2:jiùshì] [3:yǒudiǎnr] xiǎo, dà [3:yìdiǎnr] jiù hǎo.', 'Bộ đỏ này cũng được, [2:chỉ có điều] [3:hơi] nhỏ, to [3:một chút] thì hay.'),
        L('A', '也[3:有点儿]贵，我想买便宜[3:一点儿]的。', 'Yě [3:yǒudiǎnr] guì, wǒ xiǎng mǎi piányi [3:yìdiǎnr] de.', 'Còn [3:hơi] đắt nữa, tôi muốn mua cái rẻ hơn [3:một chút].'),
        L('B', '这件蓝的呢？颜色真好，也是昨天新来的。', 'Zhè jiàn lán de ne? Yánsè zhēn hǎo, yěshì zuótiān xīn lái de.', 'Cái màu xanh này thì sao? Màu rất đẹp, lại là đồ mới về hôm qua.'),
        L('A', '让我看[1:一下]，这件真不错，买它吧！', 'Ràng wǒ kàn [1:yíxià], zhè jiàn zhēn búcuò, mǎi tā ba!', 'Để tôi xem [1:một lát], cái này được đấy, mua nó đi!'),
      ],
      legend: [
        { n: 1, label: '一下', np: 'NP 12.1' },
        { n: 2, label: '就是', np: 'NP 12.2' },
        { n: 3, label: '有点儿 / 一点儿', np: 'NP 12.3' },
      ],
    },
    {
      title: 'Hội thoại 2',
      lines: [
        L('A', '妈妈，我们家的咖啡[4:已经]没了。', 'Māma, wǒmen jiā de kāfēi [4:yǐjīng] méi le.', 'Mẹ ơi, cà phê của nhà chúng ta [4:đã] hết mất rồi.'),
        L('B', '好，明天我们一起去超市买吧，怎么样？', 'Hǎo, míngtiān wǒmen yìqǐ qù chāoshì mǎi ba, zěnmeyàng?', 'Được, ngày mai chúng ta cùng đi siêu thị mua, được chứ?'),
        L('A', '正好，我正想吃西瓜。我们去超市买咖啡和西瓜吧。茶呢？', 'Zhènghǎo, wǒ zhèng xiǎng chī xīguā. Wǒmen qù chāoshì mǎi kāfēi hé xīguā ba. Chá ne?', 'Vừa hay, con đang muốn ăn dưa hấu. Chúng ta đi siêu thị mua cà phê và dưa hấu nhé. Trà thì sao ạ?'),
        L('B', '昨天我[4:已经]买了。', 'Zuótiān wǒ [4:yǐjīng] mǎi le.', 'Hôm qua mẹ [4:đã] mua rồi.'),
      ],
      legend: [{ n: 4, label: '已经', np: 'NP 12.4' }],
    },
  ],
  13: [
    {
      title: 'Hội thoại 1 · 在饭店 (Ở nhà hàng)',
      lines: [
        L('A', '你们吃什么？', 'Nǐmen chī shénme?', 'Quý khách ăn gì?'),
        L('B', '我先[1:看看]菜单吧。(看菜单)一份酸辣鱼。', 'Wǒ xiān [1:kànkan] càidān ba. (kàn càidān) Yí fèn suānlàyú.', 'Để tôi [1:xem] thực đơn. (nhìn thực đơn) Cho một phần cá chua cay.'),
        L('A', '还要什么？', 'Hái yào shénme?', 'Quý khách còn muốn gì nữa?'),
        L('B', '再来两份炒米饭，一碗面条儿。', 'Zài lái liǎng fèn chǎo mǐfàn, yì wǎn miàntiáor.', 'Cho thêm hai phần cơm rang, một bát mỳ.'),
        L('A', '喝点儿什么？果汁[2:还是]啤酒？', 'Hē diǎnr shénme? Guǒzhī [2:háishì] píjiǔ?', 'Đồ uống thì sao? Nước quả [2:hay] bia?'),
        L('B', '果汁[2:或者]啤酒都行。', 'Guǒzhī [2:huòzhě] píjiǔ dōu xíng.', 'Nước quả [2:hay] bia đều được.'),
        L('A', '酸辣鱼要[3:等15分钟]。那我先给你们两瓶啤酒，然后再上菜吧。', 'Suānlàyú yào [3:děng shíwǔ fēnzhōng]. Nà wǒ xiān gěi nǐmen liǎng píng píjiǔ, ránhòu zài shàng cài ba.', 'Cá chua cay phải [3:đợi 15 phút]. Vậy tôi sẽ mang hai chai bia lên trước, sau đó đưa đồ ăn lên.'),
        L('B', '行。', 'Xíng.', 'Được.'),
      ],
      legend: [
        { n: 1, label: '看看', np: 'NP 13.1' },
        { n: 2, label: '还是 / 或者', np: 'NP 13.2' },
        { n: 3, label: '等15分钟', np: 'NP 13.3' },
      ],
    },
    {
      title: 'Hội thoại 2',
      lines: [
        L('A', '服务员，买单。', 'Fúwùyuán, mǎi dān.', 'Phục vụ, tính tiền.'),
        L('B', '请稍等。今天的菜[4:好不好吃]？', 'Qǐng shāo děng. Jīntiān de cài [4:hǎo bu hǎochī]?', 'Xin chờ chút. Món ăn hôm nay [4:ngon miệng không] ạ?'),
        L('A', '我[3:等菜等了40分钟]，但是菜真的很好吃！一共多少钱？', 'Wǒ [3:děng cài děng le sìshí fēnzhōng], dànshì cài zhēn de hěn hǎochī! Yígòng duōshao qián?', 'Tôi [3:đã đợi thức ăn trong 40 phút], nhưng thức ăn thực sự rất ngon! Tổng cộng bao nhiêu tiền?'),
        L('B', '一百二十二块。', "Yì bǎi èrshí'èr kuài.", 'Một trăm hai mươi hai đồng.'),
        L('A', '给你。', 'Gěi nǐ.', 'Gửi chị.'),
      ],
      legend: [
        { n: 3, label: '等菜等了40分钟', np: 'NP 13.3' },
        { n: 4, label: '好不好吃', np: 'NP 13.4' },
      ],
      note: {
        title: 'Chú thích',
        text: '稍等 /shāo děng/ là cách nói ngắn gọn, dễ hiểu của “稍微等一下” /shāowēi děng yíxià/. Hãy chờ một lát.',
      },
    },
  ],
  14: [
    {
      lines: [
        L('A', '妹妹，[1:不要]看电视了，[2:还]有二十分钟就上课了。', 'Mèimei, [1:búyào] kàn diànshì le, [2:hái] yǒu èrshí fēnzhōng jiù shàng kè le.', 'Em gái, [1:đừng] xem tivi nữa, [2:còn] 20 phút nữa phải đi học rồi.'),
        L('B', '哥，你总是这样。你不懂，我看的是中国电影，这[3:对]学汉语有帮助。', 'Gē, nǐ zǒngshì zhèyàng. Nǐ bù dǒng, wǒ kàn de shì Zhōngguó diànyǐng, zhè [3:duì] xué Hànyǔ yǒu bāngzhù.', 'Anh, anh lúc nào cũng thế. Anh không biết đó, cái em xem là phim Trung Quốc, [3:tốt cho việc] học Tiếng Trung.'),
        L('A', '[1:别]说了，你是喜欢电影里的帅哥美女吧。午饭还[4:没做完]呢，来帮我准备吧！', 'Bié shuō le, nǐ shì xǐhuān diànyǐng lǐ de shuàigē měinǚ ba. Wǔfàn hái [4:méi zuò wán] ne, lái bāng wǒ zhǔnbèi ba!', '[1:Đừng] nói nữa, em toàn chỉ thích trai xinh gái đẹp trong phim thôi. Bữa trưa còn [4:chưa nấu xong], ra giúp anh chuẩn bị nào.'),
        L('B', '不看就不看。哥，你看见我的裤子[4:了没有]？', 'Bú kàn jiù bú kàn. Gē, nǐ kànjiàn wǒ de kùzi [4:le méiyǒu]?', 'Không xem thì không xem. Anh nhìn thấy quần của em [4:không]?'),
        L('A', '我帮你洗完了。你看，我对你[5:那么]好。', 'Wǒ bāng nǐ xǐ wán le. Nǐ kàn, wǒ duì nǐ [5:nàme] hǎo.', 'Anh đã giặt xong giúp em rồi. Em thấy không, anh đối tốt với em [5:như thế] đó.'),
        L('B', '是是是，哥哥，我最爱你！', 'Shì shì shì, gēge, wǒ zuì ài nǐ!', 'Vâng vâng vâng, anh à, em gái yêu anh nhất!'),
      ],
      legend: [
        { n: 1, label: '不要 / 别', np: 'NP 14.1' },
        { n: 2, label: '还', np: 'NP 14.2' },
        { n: 3, label: '对', np: 'NP 14.3' },
        { n: 4, label: '没做完', np: 'NP 14.4' },
        { n: 5, label: '那么', np: 'NP 14.5' },
      ],
    },
  ],
  15: [
    {
      title: 'Hội thoại 1',
      lines: [
        L('A', '昨天和你一起[1:去KTV唱歌的人]是谁？[2:是不是]小兰？', 'Zuótiān hé nǐ yìqǐ [1:qù KTV chàng gē de rén] shì shéi? [2:Shìbushì] Xiǎo Lán?', 'Hôm qua [1:người đi hát ở quán karaoke] cùng cậu là ai thế? [2:Có phải] Tiểu Lan không?'),
        L('B', '不是，是咱们公司新来的职员，昨天[3:第]一次见。你[4:可能]还不认识她。', 'Búshì, shì zánmen gōngsī xīn lái de zhíyuán, zuótiān [3:dì] yī cì jiàn. Nǐ [4:kěnéng] hái bú rènshi tā.', 'Không phải, là nhân viên mới đến của công ty chúng ta, hôm qua [3:lần] đầu tiên gặp mặt. Cậu [4:có lẽ] không biết cô ấy.'),
        L('A', '她叫什么名字，多大了？', 'Tā jiào shénme míngzi, duōdà le?', 'Cô ấy tên là gì, bao nhiêu tuổi?'),
        L('B', '她二十二岁，[5:比]我们小五岁。她姓刘，叫刘云。她很高，我还没有她高呢。', "Tā èrshí'èr suì, [5:bǐ] wǒmen xiǎo wǔ suì. Tā xìng Liú, jiào Liú Yún. Tā hěn gāo, wǒ hái méiyǒu tā gāo ne.", 'Cô ấy 22 tuổi, nhỏ [5:hơn] chúng mình 5 tuổi. Họ Lưu, tên Lưu Vân. Cô ấy rất cao, tôi còn không cao bằng cô ấy.'),
      ],
      legend: [
        { n: 1, label: '去KTV唱歌的人', np: 'NP 15.1' },
        { n: 2, label: '是不是', np: 'NP 15.2' },
        { n: 3, label: '第', np: 'NP 15.3' },
        { n: 4, label: '可能', np: 'NP 15.4' },
        { n: 5, label: '比', np: 'NP 15.6' },
      ],
      note: {
        title: 'Chú thích',
        text: '“KTV” là cách gọi phổ biến của phòng karaoke ở Trung Quốc, đó là chữ viết tắt của cụm từ “Karaoke Television”, tạm dịch có nghĩa là Truyền hình karaoke.',
      },
    },
    {
      title: 'Hội thoại 2',
      lines: [
        L('A', '老师，我很喜欢跳舞，想跟你学习，可以吗？', 'Lǎoshī, wǒ hěn xǐhuan tiào wǔ, xiǎng gēn nǐ xuéxí, kěyǐ ma?', 'Cô giáo, con rất thích khiêu vũ, muốn theo học cô, có được không ạ?'),
        L('B', '你几岁了？', 'Nǐ jǐ suì le?', 'Con mấy tuổi rồi?'),
        L('A', '我七岁了，我希望[6:能]做你的学生。', 'Wǒ qī suì le, wǒ xīwàng [6:néng] zuò nǐ de xuésheng.', 'Con 7 tuổi rồi, con hy vọng [6:có thể] làm học sinh của cô.'),
        L('B', '没问题，非常欢迎，明天晚上我们开始吧！', 'Méi wèntí, fēicháng huānyíng, míngtiān wǎnshang wǒmen kāishǐ ba!', 'Không vấn đề, cô rất hoan nghênh, tối ngày mai chúng mình bắt đầu nhé!'),
      ],
      legend: [{ n: 6, label: '能', np: 'NP 15.5' }],
    },
  ],
  16: [
    {
      lines: [
        L('A', '听说你要搬家，在找房子，怎么样了？', 'Tīngshuō nǐ yào bān jiā, zài zhǎo fángzi, zěnmeyàng le?', 'Nghe nói cậu muốn chuyển nhà, đang tìm phòng, sao rồi?'),
        L('B', '还没找到，找房子真的累[2:死了]！', 'Hái méi zhǎodào, zhǎo fángzi zhēn de lèi [2:sǐ le]!', 'Tớ chưa tìm được, tìm nhà đúng là mệt [2:chết đi được].'),
        L('A', '你那么忙，一个人找房子太不容易。为什么要搬呢？', 'Nǐ nàme máng, yí ge rén zhǎo fángzi tài bù róngyì. Wèishénme yào bān ne?', 'Cậu bận như vậy, tìm nhà một mình thật không dễ dàng. Tại sao phải chuyển thế?'),
        L('B', '我现在[1:住得有点儿远]，到公司要一个小时，所以还[5:得]搬。', 'Wǒ xiànzài [1:zhù de yǒudiǎnr yuǎn], dào gōngsī yào yí ge xiǎoshí, suǒyǐ hái [5:děi] bān.', 'Bây giờ tớ [1:ở hơi xa], đến công ty mất một tiếng đồng hồ, cho nên vẫn [5:phải] chuyển.'),
        L('A', '你几点回到家？', 'Nǐ jǐ diǎn huí dào jiā?', 'Mấy giờ cậu về đến nhà?'),
        L('B', '[4:因为]我[3:每]天七点下班，八点[6:才]回到家，[4:所以]晚饭[1:吃得很晚]。', '[4:Yīnwèi] wǒ [3:měi]tiān qī diǎn xià bān, bā diǎn [6:cái] huí dào jiā, [4:suǒyǐ] wǎnfàn [1:chī de hěn wǎn].', '[4:Vì] hằng ngày 7 giờ tớ mới tan làm, 8 giờ [6:mới] về đến nhà, [4:nên] [1:ăn tối rất muộn].'),
        L('A', '我六点[6:就]到家了。你回得比我晚两个小时，真辛苦！那希望你能早点儿找到房子。', 'Wǒ liù diǎn [6:jiù] dào jiā le. Nǐ huí de bǐ wǒ wǎn liǎng ge xiǎoshí, zhēn xīnkǔ! Nà xīwàng nǐ néng zǎodiǎnr zhǎodào fángzi.', '6 giờ tớ [6:đã] về đến nhà rồi, cậu về muộn hơn tớ hai tiếng đồng hồ, thật vất vả quá! Vậy hy vọng cậu sớm tìm được nhà.'),
      ],
      legend: [
        { n: 1, label: '住得有点儿远', np: 'NP 16.1' },
        { n: 2, label: '死了', np: 'NP 16.2' },
        { n: 3, label: '每', np: 'NP 16.3' },
        { n: 4, label: '因为……所以……', np: 'NP 16.4' },
        { n: 5, label: '得', np: 'NP 16.5' },
        { n: 6, label: '就 / 才', np: 'NP 16.6' },
      ],
    },
  ],
  17: [
    {
      title: 'Hội thoại 1',
      lines: [
        L('A', '小南，我的电脑出问题了，不能用了。', 'Xiǎo Nán, wǒ de diànnǎo chū wèntí le, bùnéng yòng le.', 'Tiểu Nam, máy tính của em có vấn đề rồi, không dùng được nữa.'),
        L('B', '你的电脑怎么了？', 'Nǐ de diànnǎo zěnme le?', 'Máy tính của em làm sao?'),
        L('A', '三天[1:以前]就不能[2:上网]了。', 'Sān tiān [1:yǐqián] jiù bùnéng [2:shàng wǎng] le.', 'Không thể [2:lên mạng] từ ba ngày [1:trước].'),
        L('B', '别着急。正好我现在有空儿，我帮你看看。', 'Bié zháojí. Zhènghǎo wǒ xiànzài yǒu kòngr, wǒ bāng nǐ kànkan.', 'Đừng lo, vừa hay anh đang có thời gian rảnh, để anh xem giúp em.'),
        L('A', '要修多长时间呢？是不是坏了？', 'Yào xiū duō cháng shíjiān ne? Shìbushì huài le?', 'Phải sửa bao lâu? Hỏng rồi, phải không?'),
        L('B', '[3:一会儿]就好，你放心。', '[3:Yíhuìr] jiù hǎo, nǐ fàngxīn.', '[3:Một lát] là ổn, em yên tâm.'),
      ],
      legend: [
        { n: 1, label: '以前', np: 'NP 17.1' },
        { n: 2, label: '上网', np: 'NP 17.2' },
        { n: 3, label: '一会儿', np: 'NP 17.5' },
      ],
    },
    {
      title: 'Hội thoại 2',
      lines: [
        L('A', '你好，有事吗？', 'Nǐhǎo, yǒu shì ma?', 'Chào ông, có việc gì thế ạ?'),
        L('B', '我忘了带钥匙，帮我开一下门，好吗？', 'Wǒ wàng le dài yàoshi, bāng wǒ kāi yíxià mén, hǎo ma?', 'Tôi quên mang chìa khóa, cô giúp tôi mở cửa được không?'),
        L('A', '好的。', 'Hǎo de.', 'Được ạ.'),
        L('B', '我房间的空调坏了。', 'Wǒ fángjiān de kōngtiáo huài le.', 'Điều hòa phòng tôi cũng hỏng rồi.'),
        L('A', '你住[4:哪]个房间？', 'Nǐ zhù [4:nǎ] ge fángjiān?', 'Ông ở phòng [4:nào] ạ?'),
        L('B', '我住826。我的床单也脏了，能换一下吗？', 'Wǒ zhù bā èr liù. Wǒ de chuángdān yě zāng le, néng huàn yíxià ma?', 'Tôi ở phòng 826. Ga giường cũng bẩn rồi, có thể thay không?'),
        L('A', '今天早上就[5:换好]了。还有别的问题吗？', 'Jīntiān zǎoshang jiù [5:huàn hǎo] le. Hái yǒu bié de wèntí ma?', 'Sáng nay đã [5:thay xong] rồi ạ. Ông còn yêu cầu gì nữa không?'),
        L('B', '没有了，谢谢。', 'Méiyǒu le, xièxie.', 'Hết rồi. Tôi cảm ơn!'),
      ],
      legend: [
        { n: 4, label: '哪', np: 'NP 17.3' },
        { n: 5, label: '换好', np: 'NP 17.4' },
      ],
    },
  ],
  18: [
    {
      title: 'Hội thoại',
      lines: [
        L('A', '你认识正在喝咖啡的那个姑娘吗？', 'Nǐ rènshi zhèngzài hē kāfēi de nà ge gūniang ma?', 'Cậu biết cô gái đang uống café kia không?'),
        L('B', '我不认识，不过[1:看起来]她很漂亮。', 'Wǒ bú rènshi, búguò [1:kàn qǐlái] tā hěn piàoliang.', 'Tớ không quen, nhưng [1:xem ra] cô ấy rất xinh.'),
        L('A', '手里拿[2:着]报纸的呢？', 'Shǒu lǐ ná [2:zhe] bàozhǐ de ne?', 'Thế còn cô gái [2:đang] cầm tờ báo trên tay thì sao?'),
        L('B', '我认识。她是小林的前女友。', 'Wǒ rènshi. Tā shì Xiǎo Lín de qián nǚyǒu.', 'Tớ quen. Cô ấy là bạn gái cũ của Tiểu Lâm.'),
        L('A', '我好久不见小林了。他找到工作了吗？', 'Wǒ hǎo jiǔ bú jiàn Xiǎo Lín le. Tā zhǎo dào gōngzuò le ma?', 'Lâu lắm rồi tớ không gặp Tiểu Lâm. Cậu ấy tìm được việc chưa?'),
        L('B', '找到了。这是他的第一份工作，从上个星期一就开始上班了。', 'Zhǎo dào le. Zhè shì tā de dì yī fèn gōngzuò, cóng shàng ge xīngqīyī jiù kāishǐ shàng bān le.', 'Tìm được rồi. Đây là công việc đầu tiên của cậu ấy, bắt đầu đi làm từ thứ hai tuần trước rồi.'),
      ],
      legend: [
        { n: 1, label: '看起来', np: 'NP 18.1' },
        { n: 2, label: '着', np: 'NP 18.2' },
      ],
    },
    {
      title: 'Đoạn văn',
      lines: [
        L(
          '',
          '今天晚上我去小成家看足球赛。足球赛六点开始，六点差一刻我才[3:紧张地]骑着自行车去他家。我到的时候，他在床上躺着看《汉越词典》，铅笔在词典上放着。我先开电视，然后在椅子上坐着，和他一起看足球赛。',
          'Jīntiān wǎnshang wǒ qù Xiǎo Chéng jiā kàn zúqiú sài. Zúqiú sài liù diǎn kāishǐ, liù diǎn chà yí kè wǒ cái [3:jǐnzhāng de] qí zhe zìxíngchē qù tā jiā. Wǒ dào de shíhou, tā zài chuáng shang tǎng zhe kàn “Hàn Yuè cídiǎn”, qiānbǐ zài cídiǎn shang fàng zhe. Wǒ xiān kāi diànshì, ránhòu zài yǐzi shang zuò zhe, hé tā yìqǐ kàn zúqiú sài.',
          'Tối hôm nay tôi đến nhà Thành xem trận đấu bóng đá. Trận đấu 6 giờ bắt đầu, 6 giờ kém 15 tôi mới [3:vội vàng] đạp xe đến nhà cậu ấy. Lúc tôi đến, cậu ấy đang nằm trên giường đọc “Từ điển Hán Việt”, bút chì đặt trên từ điển. Tôi bật tivi lên trước, sau đó ngồi trên ghế, cùng xem trận đấu bóng với cậu ấy.',
        ),
      ],
      legend: [{ n: 3, label: '紧张地骑', np: 'NP 18.3' }],
    },
  ],
  19: [
    {
      lines: [
        L('A', '我很喜欢去旅游，每年都去不同的国家。', 'Wǒ hěn xǐhuan qù lǚyóu, měinián dōu qù bùtóng de guójiā.', 'Mình rất thích đi du lịch, mỗi năm lại đi một nước khác nhau.'),
        L('B', '今年你去哪儿？', 'Jīnnián nǐ qù nǎr?', 'Năm nay cậu đi đâu?'),
        L('A', '我下个周末去中国玩儿。', 'Wǒ xià ge zhōumò qù Zhōngguó wánr.', 'Mình định cuối tuần sau đi Trung Quốc chơi.'),
        L('B', '你[1:不是]去年已经去过中国了[1:吗]？今年还去！', 'Nǐ [1:bú shì] qùnián yǐjīng qù guo Zhōngguó le [1:ma]? Jīnnián hái qù!', '[1:Không phải] là năm ngoái cậu đã đi Trung Quốc rồi [1:sao]? Năm nay lại đi!'),
        L('A', '我[3:才][4:去过一次中国]，还[2:没去过中国北方]。现在中国北方下着雪，特别好看。', 'Wǒ [3:cái] [4:qù guo yí cì Zhōngguó], hái [2:méi qù guo Zhōngguó běifāng]. Xiànzài Zhōngguó běifāng xià zhe xuě, tèbié hǎokàn.', 'Mình [3:mới] [4:đi Trung Quốc một lần], còn [2:chưa đi miền Bắc Trung Quốc]. Bây giờ miền Bắc Trung Quốc đang có tuyết rơi, rất đẹp.'),
        L('B', '坐飞机去还是坐火车去？', 'Zuò fēijī qù háishì zuò huǒchē qù?', 'Cậu đi máy bay hay đi tàu hỏa?'),
        L('A', '坐飞机。要坐[5:四五个小时]飞机。', 'Zuò fēijī. Yào zuò [5:sì wǔ ge xiǎoshí] fēijī.', 'Đi máy bay. Phải ngồi máy bay [5:4-5 tiếng đồng hồ].'),
        L('B', '票买好了吗？宾馆订好了吗？', 'Piào mǎi hǎo le ma? Bīnguǎn dìng hǎo le ma?', 'Cậu mua vé chưa? Đặt khách sạn chưa?'),
        L('A', '都准备好了。下个星期六晚上八点我坐出租车去机场。', 'Dōu zhǔnbèi hǎo le. Xià ge xīngqīliù wǎnshang bā diǎn wǒ zuò chūzūchē qù jīchǎng.', 'Tất cả chuẩn bị xong hết rồi. 8 giờ tối thứ bảy tuần sau tớ bắt taxi ra sân bay.'),
      ],
      legend: [
        { n: 1, label: '不是……吗', np: 'NP 19.1' },
        { n: 2, label: '没去过中国北方', np: 'NP 19.2' },
        { n: 3, label: '才', np: 'NP 19.3' },
        { n: 4, label: '去过一次中国', np: 'NP 19.4' },
        { n: 5, label: '四五个小时', np: 'NP 19.5' },
      ],
    },
  ],
  20: [
    {
      title: 'Hội thoại 1',
      lines: [
        L('A', '喂，陈老师吗？我是小成的妈妈。', 'Wèi, Chén lǎoshī ma? Wǒ shì Xiǎo Chéng de māma.', 'Alo, thầy giáo Trần phải không? Tôi là mẹ của em Thành.'),
        L('B', '您好，我正想给你打电话问问。[1:都]九点[1:了]，小成[2:怎么]还没来上课？', 'Nínhǎo, wǒ zhèng xiǎng gěi nǐ dǎ diànhuà wènwen. [1:Dōu] jiǔ diǎn [1:le], Xiǎo Chéng [2:zěnme] hái méi lái shàng kè?', 'Chào chị, tôi đang muốn gọi điện cho chị hỏi han. [1:Đã] 9 giờ [1:rồi], Thành [2:sao] vẫn chưa đến lớp?'),
        L('A', '昨天我孩子去游泳的时候，人很多，水有点儿脏，所以今天早上眼睛变红了。现在我得带他去看医生。', 'Zuótiān wǒ háizi qù yóu yǒng de shíhou, rén hěn duō, shuǐ yǒudiǎnr zāng, suǒyǐ jīntiān zǎoshang yǎnjīng biàn hóng le. Xiànzài wǒ děi dài tā qù kàn yīshēng.', 'Hôm qua cháu nó đi bơi, đông người, nước hơi bẩn, nên sáng nay mắt bị đỏ. Giờ tôi phải đưa cháu nó đi gặp bác sĩ.'),
        L('B', '是吗？我妻子的弟弟是医生。我给你介绍一下。', 'Shì ma? Wǒ qīzi de dìdi shì yīshēng. Wǒ gěi nǐ jièshào yíxià.', 'Vậy sao? Em trai của vợ tôi là bác sĩ. Để tôi giới thiệu cho chị.'),
        L('A', '好的，谢谢老师。', 'Hǎo de, xièxie lǎoshī.', 'Vâng, cảm ơn thầy.'),
      ],
      legend: [
        { n: 1, label: '都……了', np: 'NP 20.1' },
        { n: 2, label: '怎么', np: 'NP 20.2' },
      ],
    },
    {
      title: 'Hội thoại 2',
      lines: [
        L('A', '请坐，你哪儿不舒服？', 'Qǐng zuò, nǐ nǎr bù shūfu?', 'Mời ngồi, bạn đau ở đâu?'),
        L('B', '我有点儿发烧。是不是生病了？', 'Wǒ yǒudiǎnr fā shāo. Shìbushì shēng bìng le?', 'Tôi hơi sốt. Có phải là ốm rồi không ạ?'),
        L('A', '咳嗽吗？头疼吗？', 'Késou ma? Tóu téng ma?', 'Ho không? Đau đầu không?'),
        L('B', '咳嗽，头疼。', 'Késou, tóu téng.', 'Có ho, có đau đầu ạ.'),
        L('A', '你先量一下体温吧。过五分钟给我看看。(过一会儿) 到时间了，我看看多少度。三十八度八，这么高？这样吧，我给你开点儿药，这种药每天吃三次，每次两片，要吃一个星期。你放心，[3:一]吃药，病[3:就]好。', 'Nǐ xiān liáng yíxià tǐwēn ba. Guò wǔ fēnzhōng gěi wǒ kànkan. (Guò yíhuìr) dào shíjiān le, wǒ kànkan duōshao dù. Sānshíbā dù bā, zhème gāo? Zhèyàng ba, wǒ gěi nǐ kāi diǎnr yào, zhè zhǒng yào měitiān chī sān cì, měi cì liǎng piàn, yào chī yí ge xīngqī. Nǐ fàngxīn, [3:yì] chī yào, bìng [3:jiù] hǎo.', 'Bạn đo nhiệt độ đi. 5 phút nữa đưa tôi xem. (Một lúc sau) Đến giờ rồi, tôi xem xem bao nhiêu độ nào. 38 độ 8, cao thế sao? Như thế đi, tôi kê cho bạn một ít thuốc, loại thuốc này mỗi ngày uống 3 lần, mỗi lần 2 viên, phải uống 1 tuần. Bạn yên tâm, [3:vừa] uống thuốc vào [3:là] bệnh khỏi liền.'),
        L('B', '谢谢医生。', 'Xièxie yīshēng.', 'Cảm ơn bác sĩ.'),
      ],
      legend: [{ n: 3, label: '一……就……', np: 'NP 20.3' }],
    },
  ],
  21: [
    {
      lines: [
        L('A', '我要买两张去广州的高铁票。', 'Wǒ yào mǎi liǎng zhāng qù Guǎngzhōu de gāotiě piào.', 'Tôi muốn mua 2 vé tàu cao tốc đi Quảng Châu.'),
        L('B', '要哪天的？', 'Yào nǎ tiān de?', 'Đi ngày nào?'),
        L('A', '明天的有没有？', 'Míngtiān de yǒuméiyǒu?', 'Ngày mai còn vé không?'),
        L('B', '卖完了。有快速火车的。可以吗？[1:虽然]快速火车开得比高铁慢，[1:但是]价格比高铁的便宜多了。', 'Mài wán le. Yǒu kuàisù huǒchē de. Kěyǐ ma? [1:Suīrán] kuàisù huǒchē kāi de bǐ gāotiě màn, [1:dànshì] jiàgé bǐ gāotiě de piányi duō le.', 'Bán hết rồi. Có vé tàu hỏa nhanh. Được không? [1:Tuy] tàu hỏa nhanh chạy chậm hơn tàu cao tốc, [1:nhưng] giá rẻ hơn tàu cao tốc nhiều.'),
        L('A', '那就快速火车吧。', 'Nà jiù kuàisù huǒchē ba.', 'Thế thì tàu hỏa nhanh đi.'),
        L('B', '要哪趟的？', 'Yào nǎ tàng de?', 'Đi chuyến nào.'),
        L('A', 'K2135次。', 'K2135 cì.', 'Chuyến K2135 đi.'),
        L('B', '要硬座还是软座？', 'Yào yìngzuò háishì ruǎn zuò?', 'Ngồi ghế cứng hay ghế mềm?'),
        L('A', '硬座。', 'Yìngzuò.', 'Ghế cứng.'),
        L('B', '好。两张一共一千两百五十块钱。', 'Hǎo. Liǎng zhāng yígòng yì qiān liǎng bǎi wǔshí kuài qián.', 'Được. Hai vé tổng cộng 1250 tệ.'),
      ],
      legend: [{ n: 1, label: '虽然……但是……', np: 'NP 21.1' }],
    },
  ],
  22: [
    {
      lines: [
        L('A', '喂，您好，是黄河酒店。', 'Wèi, nínhǎo, shì Huánghé jiǔdiàn.', 'Alo, xin chào, đây là Khách sạn Hoàng Hà.'),
        L('B', '你好，我想订房。', 'Nǐhǎo, wǒ xiǎng dìng fáng.', 'Xin chào, tôi muốn đặt phòng.'),
        L('A', '您几位？', 'Nín jǐ wèi?', 'Quý khách có mấy người ạ?'),
        L('B', '我们四位，要两个标准双人间。', 'Wǒmen sì wèi, yào liǎng ge biāozhǔn shuāngrénjiān.', 'Chúng tôi có 4 người, muốn đặt hai phòng đôi tiêu chuẩn.'),
        L('A', '您什么时候入住呢？', 'Nín shénme shíhou rùzhù ne?', 'Quý khách khi nào nhận phòng?'),
        L('B', '我要住五天，[1:从明天起]。我在网上查过，你们还有空房[2:吧]？', 'Wǒ yào zhù wǔ tiān, [1:cóng míngtiān qǐ]. Wǒ zài wǎngshang chá guo, nǐmen hái yǒu kōngfáng [2:ba]?', 'Tôi muốn ở 5 ngày, [1:bắt đầu từ ngày mai]. Tôi tra trên mạng, các bạn vẫn còn phòng trống [2:nhỉ]?'),
        L('A', '请稍等。……不好意思，双人间[3:一间也没有了]，正好还有两间大床间。可以吗？', 'Qǐng shāo děng. …… Bù hǎoyìsi, shuāngrénjiān [3:yì jiān yě méiyǒu le], zhènghǎo hái yǒu liǎng jiān dàchuángjiān. Kěyǐ ma?', 'Xin chờ chút. …… Thật xin lỗi, phòng đôi [3:không còn phòng nào], vừa hay có hai phòng giường lớn. Có được không ạ?'),
        L('B', '大床间一天多少钱？', 'Dàchuángjiān yì tiān duōshao qián?', 'Phòng giường lớn bao nhiêu tiền một ngày?'),
        L('A', '一间大床间三百块一晚，免费取消，免费早饭，退房时间是中午十二点。', "Yì jiān dàchuángjiān sān bǎi kuài yì wǎn, miǎnfèi qǔxiāo, miǎnfèi zǎofàn, tuì fáng shíjiān shì zhōngwǔ shí'èr diǎn.", 'Một phòng giường lớn 300 tệ một đêm, miễn phí hủy phòng, miễn phí ăn sáng, thời gian trả phòng là 12 giờ trưa.'),
        L('B', '好的，比我在网上查的价格还便宜。那我订两间大床间吧。', 'Hǎo de, bǐ wǒ zài wǎngshang chá de jiàgé hái piányi. Nà wǒ dìng liǎng jiān dàchuángjiān ba.', 'Được, giá còn rẻ hơn tôi tra trên mạng. Vậy tôi đặt hai phòng giường lớn nhé.'),
      ],
      legend: [
        { n: 1, label: '从明天起', np: 'NP 22.1' },
        { n: 2, label: '吧', np: 'NP 22.2' },
        { n: 3, label: '一间也没有了', np: 'NP 22.3' },
      ],
    },
  ],
  23: [
    {
      lines: [
        L('A', '老婆，我们儿子看起来有点儿胖？', 'Lǎopó, wǒmen érzi kàn qilai yǒudiǎnr pàng?', 'Bà xã, con trai chúng ta hình như hơi béo thì phải.'),
        L('B', '孩子在考试呢，[1:哪有时间]运动。', 'Háizi zài kǎoshì ne, [1:nǎ yǒu shíjiān] yùndòng.', 'Con trai đang thi, [1:làm gì có thời gian] vận động.'),
        L('A', '人家小明也在考试呢，听说每个星期一、三、五打篮球，星期二、四踢足球，周末跑步。我们孩子[2:不是]在学校复习英语，[2:就是]在家抱着手机玩儿，不出去外面走走是不行的。年轻人得多运动运动。过一会儿我去游泳，游七八百米就觉得很舒服，不如叫他一起去？', "Rénjiā Xiǎo Míng yě zài kǎoshì ne, tīngshuō měi ge xīngqīyī, sān, wǔ dǎ lánqiú, xīngqī'èr, sì tī zúqiú, zhōumò pǎo bù. Wǒmen háizi [2:búshì] zài xuéxiào fùxí Yīngyǔ, [2:jiùshì] zài jiā bào zhe shǒujī wánr, bù chūqù wàimiàn zǒuzou shì bùxíng de. Niánqīng rén děi duō yùndòng yùndòng. Guò yíhuìr wǒ qù yóuyǒng, yóu qī bā bǎi mǐ jiù juéde hěn shūfu, bùrú jiào tā yìqǐ qù?", 'Tiểu Minh nhà người ta cũng đang thi đấy. Nghe nói thứ 2-4-6 đi đánh bóng rổ, thứ 3-5 đá bóng, cuối tuần còn chạy bộ. Con chúng ta [2:nếu không phải] ôn tập Tiếng Anh ở trường [2:thì cũng] ở nhà ôm điện thoại chơi, không ra ngoài đi đây đi đó là không được đâu. Người trẻ phải vận động nhiều vào. Lát nữa tôi đi bơi, bơi 7-800 m thấy rất thoải mái, hay là gọi con trai đi cùng?'),
        L('B', '你试试吧，看他去不去，饭做好了等你们回来[3:再]吃。', 'Nǐ shìshi ba, kàn tā qù bu qù, fàn zuò hǎo le děng nǐmen huílai [3:zài] chī.', 'Ông thử xem, xem nó có đi không, cơm nấu xong xuôi rồi đợi bố con về cùng ăn.'),
      ],
      legend: [
        { n: 1, label: '哪有时间', np: 'NP 23.1' },
        { n: 2, label: '不是……就是……', np: 'NP 23.2' },
        { n: 3, label: '再', np: 'NP 23.3' },
      ],
    },
  ],
  24: [
    {
      lines: [
        L('A', '你看见[1:刚才]走过的那个漂亮的姑娘吗？', 'Nǐ kànjiàn [1:gāngcái] zǒu guo de nà ge piàoliang de gūniang ma?', '[1:Ban nãy] cậu nhìn thấy cô gái rất xinh đi ngang qua không?'),
        L('B', '你说谁？', 'Nǐ shuō shéi?', 'Cậu nói ai?'),
        L('A', '穿着黑裙子，手里拿着白杯子的那个人。', 'Chuān zhe hēi qúnzi, shǒu lǐ ná zhe bái bēizi de nà ge rén.', 'Cô gái mặc váy đen, tay cầm cái cốc trắng ấy.'),
        L('B', '你说的是李小姐吧？', 'Nǐ shuō de shì Lǐ xiǎojiě ba?', 'Cậu nói cô Lý ấy hả?'),
        L('A', '我不知道她的名字。不过我们在会议上见过面。她总是笑着跟别人说话。我想认识她。', 'Wǒ bù zhīdào tā de míngzi. Búguò wǒmen zài huìyì shang jiàn guo miàn. Tā zǒngshì xiào zhe gēn biérén shuōhuà. Wǒ xiǎng rènshi tā.', 'Tôi không biết tên cô ấy. Nhưng chúng tôi từng gặp ở cuộc họp. Cô ấy luôn cười đùa nói chuyện với mọi người. Tôi muốn làm quen với cô ấy.'),
        L('B', '她是新来的职员，[1:刚]进我们公司两周。她很聪明，工作[2:又]认真[2:又]热情。只是……', 'Tā shì xīn lái de zhíyuán, [1:gāng] jìn wǒmen gōngsī liǎng zhōu. Tā hěn cōngmíng, gōngzuò [2:yòu] rènzhēn [2:yòu] rèqíng. Zhǐshì……', 'Cô ấy là nhân viên mới, [1:vừa mới] vào làm ở công ty chúng ta có 2 tuần. Cô ấy rất thông minh, làm việc [2:vừa] chăm chỉ, [2:lại] nhiệt tình. Chỉ là...'),
        L('A', '只是什么？', 'Zhǐshì shénme?', 'Chỉ là sao..?'),
        L('B', '她结婚了。', 'Tā jiéhūn le.', 'Cô ấy lấy chồng rồi.'),
      ],
      legend: [
        { n: 1, label: '刚 / 刚才', np: 'NP 24.1' },
        { n: 2, label: '又……又……', np: 'NP 24.2' },
      ],
    },
  ],
  25: [
    {
      lines: [
        L('A', '时间过得真快，再过两个星期这一年[1:就要过去了]。', 'Shíjiān guò de zhēn kuài, zài guò liǎng ge xīngqī zhè yì nián [1:jiù yào guòqù le].', 'Thời gian trôi đi thật là nhanh, 2 tuần nữa là một năm nữa [1:lại sắp qua đi].'),
        L('B', '陈总，谢谢你和大家对我的帮助。希望我们的公司明年[2:更好]。', 'Chén zǒng, xièxie nǐ hé dàjiā duì wǒ de bāngzhù. Xīwàng wǒmen de gōngsī míngnián [2:gèng hǎo].', 'Tổng Giám đốc Trần, cảm ơn sự giúp đỡ của anh và mọi người. Hy vọng công ty chúng ta năm sau sẽ [2:tốt hơn].'),
        L('A', '甭谢。你打算什么时候回家过春节？', 'Béng xiè. Nǐ dǎsuàn shénme shíhou huí jiā guò chūnjié?', 'Không cần cảm ơn. Cậu định lúc nào về nhà đón tết?'),
        L('B', '看情况吧。我还没买票。', 'Kàn qíngkuàng ba. Wǒ hái méi mǎi piào.', 'Để xem tình hình đã. Em vẫn chưa mua vé.'),
        L('A', '都农历二十了还没买票。你真是……', 'Dōu nónglì èrshí le hái méi mǎi piào. Nǐ zhēn shì…', '20 âm rồi còn chưa mua vé. Cậu thật là...'),
        L('B', '我努力工作嘛。明天就马上去火车站买票。', 'Wǒ nǔlì gōngzuò ma. Míngtiān jiù mǎshàng qù huǒchē zhàn mǎi piào.', 'Em làm việc chăm chỉ mà. Ngày mai sẽ ra bến tàu mua vé ngay.'),
        L('A', '嗯。天阴了，快下雨了，我得回去了。你也早点儿离开办公室吧。你这个工作狂整天[3:跑来跑去]，这样对身体不好。', 'Ēn. Tiān yīn le, kuài xià yǔ le, wǒ děi huí qù le. Nǐ yě zǎodiǎnr lǐkāi bàngōngshì ba. Nǐ zhè ge gōngzuòkuáng zhěngtiān [3:pǎo lái pǎo qù], zhèyàng duì shēntǐ bù hǎo.', 'Ừ. Trời âm u, có vẻ sắp mưa rồi, tôi phải về thôi. Cậu cũng sớm rời văn phòng đi. Cậu cuồng công việc như vậy, cứ [3:chạy tới chạy lui] cả ngày, hại sức khỏe lắm.'),
        L('B', '我知道了陈总。你怎么回去？我送你吧。', 'Wǒ zhīdào le Chén zǒng. Nǐ zěnme huíqù? Wǒ sòng nǐ ba.', 'Em biết rồi ạ. Anh về kiểu gì? Em tiễn anh nhé.'),
        L('A', '你忙你的事吧，我到外面叫辆出租车就行了。', 'Nǐ máng nǐ de shì ba, wǒ dào wàimiàn jiào liàng chūzūchē jiù xíng le.', 'Cậu bận việc của cậu đi. Tôi ra ngoài gọi xe taxi là được rồi.'),
        L('B', '那路上小心。再见！', 'Nà lùshang xiǎoxīn. Zàijiàn!', 'Vậy anh đi đường cẩn thận nhé. Chào anh!'),
      ],
      legend: [
        { n: 1, label: '就要过去了', np: 'NP 25.1' },
        { n: 2, label: '更好', np: 'NP 25.2' },
        { n: 3, label: '跑来跑去', np: 'NP 25.3' },
      ],
      note: {
        title: 'Chú thích',
        text: '甭 /béng/ = 不用 /búyòng/, nghĩa là “không cần”, được ghép bởi 2 chữ Hán của từ 不用 mà thành. Đây là hình thức tạo chữ bằng cách kết hợp hai âm tiết với nhau (合音字 /hé yīn zì/), tương tự như 孬 /nāo/ = 不好.',
      },
    },
  ],
}
