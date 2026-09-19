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
}
