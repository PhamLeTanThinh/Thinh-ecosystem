// Bài đọc cuối bài học Chinese (HSK 1+2 bài 1-25, HSK 3 lesson 26-50) — mỗi bài 1 câu chuyện dùng lại TOÀN BỘ từ vựng của bài (và ngữ
// pháp của bài) để ôn trong ngữ cảnh. Trong `ko` (chữ Hán), từ vựng của bài bọc trong {{…}} để tô màu — mỗi từ được
// đánh dấu ít nhất 1 lần đúng nguyên văn như trong danh sách từ của bài. `py` = pinyin, cùng số dòng với `ko`.
import type { GlossLookup, Reading } from '@/components/shared/ReadingSection'

// Tra nghĩa cho từ được tô trong bài đọc (tooltip khi rê chuột) từ thẻ từ vựng của bài. Từ trong bài luôn khớp đúng 1
// dạng của mục từ: "姥爷 / 外公" → từng dạng; "(汉)字" → 汉字 và 字; chú thích latin "得 (de)" bỏ đi; cấu trúc khung
// "从…到" → từng phần (从, 到) nếu phần đó chưa là 1 từ riêng.
export function chineseGloss(cards: { hanzi: string; pinyin: string; meaning: string }[]): GlossLookup {
  const map = new Map<string, { reading?: string; meaning: string }>()
  const frames: [string, { reading?: string; meaning: string }][] = []
  for (const c of cards) {
    const g = { reading: c.pinyin || undefined, meaning: c.meaning }
    const forms = c.hanzi
      .replace(/\s*\([a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü ]+\)\s*/g, '')
      .split(/\s*\/\s*/)
      .flatMap((v) => {
        const m = v.match(/^\((.+?)\)(.+)$/)
        return m ? [m[1] + m[2], m[2]] : [v.trim()]
      })
    for (const form of forms) {
      if (form.includes('…')) {
        for (const part of form.split('…').filter(Boolean)) frames.push([part, g])
      } else if (!map.has(form)) {
        map.set(form, g)
      }
    }
  }
  for (const [part, g] of frames) if (!map.has(part)) map.set(part, g)
  return (word) => map.get(word)
}

export const CHINESE_READINGS: Record<number, Reading> = {
  1: {
    title: '我们的汉语班',
    titleVi: 'Lớp tiếng Trung của chúng mình',
    note: 'Dùng đủ 34 từ vựng và 5 ngữ pháp của bài: 什么, 的, 呢, 多少, số đếm.',
    paragraphs: [
      {
        ko: '{{你}}{{好}}！{{我}}{{叫}}Lan。我{{姓}}Nguyen，{{是}}{{越南}}{{人}}。',
        py: 'Nǐ hǎo! Wǒ jiào Lan. Wǒ xìng Nguyen, shì Yuènán rén.',
        vi: 'Xin chào! Mình tên là Lan. Mình họ Nguyễn, là người Việt Nam.',
      },
      {
        ko: '这是我{{的}}同学们。Li Ming是{{中国}}人，Anna是{{美国}}人，Mark是{{德国}}人，Tanaka是{{日本}}人，Jisoo是{{韩国}}人，Pierre是{{法国}}人，Tom是{{英国}}人，Mario是{{意大利}}人，Jack是{{加拿大}}人。',
        py: "Zhè shì wǒ de tóngxuémen. Li Ming shì Zhōngguó rén, Anna shì Měiguó rén, Mark shì Déguó rén, Tanaka shì Rìběn rén, Jisoo shì Hánguó rén, Pierre shì Fǎguó rén, Tom shì Yīngguó rén, Mario shì Yìdàlì rén, Jack shì Jiānádà rén.",
        vi: 'Đây là các bạn cùng lớp của mình. Li Ming là người Trung Quốc, Anna là người Mỹ, Mark là người Đức, Tanaka là người Nhật Bản, Jisoo là người Hàn Quốc, Pierre là người Pháp, Tom là người Anh, Mario là người Ý, Jack là người Canada.',
      },
      {
        ko: 'Li Ming问我："你叫{{什么}}{{名字}}？"\n"我叫Lan。你{{呢}}？"\n"我叫Li Ming。你的{{手机}}{{号}}是{{多少}}？"\n"我的手机号是零九一二三四五六七八。"',
        py: 'Li Ming wèn wǒ: "Nǐ jiào shénme míngzi?"\n"Wǒ jiào Lan. Nǐ ne?"\n"Wǒ jiào Li Ming. Nǐ de shǒujī hào shì duōshao?"\n"Wǒ de shǒujī hào shì líng jiǔ yāo èr sān sì wǔ liù qī bā."',
        vi: 'Li Ming hỏi mình: "Bạn tên là gì?"\n"Mình tên Lan. Còn bạn?"\n"Mình tên Li Ming. Số điện thoại di động của bạn là bao nhiêu?"\n"Số điện thoại của mình là 0912345678."',
      },
      {
        ko: '老师说，很多汉字词越南人一听就懂，比如"人"：{{人民}}、{{人物}}、{{人才}}、{{人力}}。{{伟人}}是很了不起的人，{{小人}}是不好的人。',
        py: 'Lǎoshī shuō, hěn duō Hànzì cí Yuènán rén yì tīng jiù dǒng, bǐrú "rén": rénmín, rénwù, réncái, rénlì. Wěirén shì hěn liǎobuqǐ de rén, xiǎorén shì bù hǎo de rén.',
        vi: 'Cô giáo nói, rất nhiều từ gốc Hán người Việt nghe là hiểu ngay, ví dụ chữ "nhân": nhân dân, nhân vật, nhân tài, nhân lực. Vĩ nhân là người rất phi thường, tiểu nhân là người không tốt.',
      },
      {
        ko: 'Li Ming的爸爸是{{商人}}，{{人缘}}很好，朋友很多。Anna是我们班的{{美人}}，很多人想做她的{{情人}}！',
        py: 'Li Ming de bàba shì shāngrén, rényuán hěn hǎo, péngyou hěn duō. Anna shì wǒmen bān de měirén, hěn duō rén xiǎng zuò tā de qíngrén!',
        vi: 'Bố của Li Ming là thương nhân, rất có nhân duyên (được lòng người), bạn bè rất đông. Anna là mỹ nhân của lớp mình, nhiều người muốn làm người yêu (tình nhân) của bạn ấy lắm!',
      },
    ],
  },

  2: {
    title: '我的大家庭',
    titleVi: 'Đại gia đình của tôi',
    note: 'Dùng đủ 51 từ vựng và 6 ngữ pháp của bài: 吗, 了, 多大 / 几岁 / 年纪, 有, 和, 都.',
    paragraphs: [
      {
        ko: '{{认识}}你们{{很}}{{高兴}}！我叫Li Ming，是{{北京}}人。我今年二十{{岁}}，是{{学生}}，在{{学院}}{{学习}}{{文学}}。',
        py: 'Rènshi nǐmen hěn gāoxìng! Wǒ jiào Li Ming, shì Běijīng rén. Wǒ jīnnián èrshí suì, shì xuésheng, zài xuéyuàn xuéxí wénxué.',
        vi: 'Rất vui được làm quen với các bạn! Mình tên Li Ming, là người Bắc Kinh. Năm nay mình hai mươi tuổi, là sinh viên, học văn học ở học viện.',
      },
      {
        ko: '我{{家}}{{有}}九口人：{{爷爷}}、{{奶奶}}、{{爸爸}}、{{妈妈}}、{{哥哥}}、{{姐姐}}、{{弟弟}}、{{妹妹}}{{和}}我。{{外公}}和{{外婆}}不住在北京。',
        py: 'Wǒ jiā yǒu jiǔ kǒu rén: yéye, nǎinai, bàba, māma, gēge, jiějie, dìdi, mèimei hé wǒ. Wàigōng hé wàipó bú zhù zài Běijīng.',
        vi: 'Nhà mình có chín người: ông nội, bà nội, bố, mẹ, anh trai, chị gái, em trai, em gái và mình. Ông ngoại và bà ngoại không sống ở Bắc Kinh.',
      },
      {
        ko: '你问我爸爸{{做}}什么{{工作}}？他是{{医生}}。我妈妈是{{会计}}。我的{{父亲}}和{{母亲}}{{都}}很忙。爷爷以前是{{工人}}，奶奶以前是{{农民}}，外公以前是{{司机}}。',
        py: 'Nǐ wèn wǒ bàba zuò shénme gōngzuò? Tā shì yīshēng. Wǒ māma shì kuàijì. Wǒ de fùqīn hé mǔqīn dōu hěn máng. Yéye yǐqián shì gōngrén, nǎinai yǐqián shì nóngmín, wàigōng yǐqián shì sījī.',
        vi: 'Bạn hỏi bố mình làm nghề gì à? Bố là bác sĩ. Mẹ mình là kế toán. Bố và mẹ mình đều rất bận. Ông nội trước đây là công nhân, bà nội trước đây là nông dân, ông ngoại trước đây là tài xế.',
      },
      {
        ko: '哥哥是{{军人}}。姐姐是{{公务员}}，她的{{爱人}}是公司{{职员}}。他们有一个{{儿子}}和一个{{女儿}}。',
        py: 'Gēge shì jūnrén. Jiějie shì gōngwùyuán, tā de àirén shì gōngsī zhíyuán. Tāmen yǒu yí ge érzi hé yí ge nǚ\'ér.',
        vi: 'Anh trai mình là quân nhân. Chị gái là công chức, chồng chị ấy là nhân viên văn phòng của một công ty. Anh chị có một con trai và một con gái.',
      },
      {
        ko: '"姐姐的儿子{{多}}{{大}}了？"\n"他六岁了，在{{小学}}{{学}}{{数学}}。"\n"你妹妹也是{{老师}}{{吗}}？"\n"她{{不}}是老师，她也是学生。"',
        py: '"Jiějie de érzi duō dà le?"\n"Tā liù suì le, zài xiǎoxué xué shùxué."\n"Nǐ mèimei yě shì lǎoshī ma?"\n"Tā bú shì lǎoshī, tā yě shì xuésheng."',
        vi: '"Con trai chị gái bạn bao nhiêu tuổi rồi?"\n"Bé sáu tuổi rồi, đang học toán ở trường tiểu học."\n"Em gái bạn cũng là giáo viên à?"\n"Em ấy không phải giáo viên, em ấy cũng là học sinh."',
      },
      {
        ko: '爷爷七十多岁了，可是很{{好学}}，每天都看书。他喜欢{{劝学}}，常常说："{{学费}}很贵，你们要好好学习！"他还喜欢看各种{{学说}}的书。爷爷说，{{学力}}比钱更重要。',
        py: 'Yéye qīshí duō suì le, kěshì hěn hàoxué, měi tiān dōu kàn shū. Tā xǐhuan quànxué, chángcháng shuō: "Xuéfèi hěn guì, nǐmen yào hǎohāo xuéxí!" Tā hái xǐhuan kàn gè zhǒng xuéshuō de shū. Yéye shuō, xuélì bǐ qián gèng zhòngyào.',
        vi: 'Ông nội đã hơn bảy mươi tuổi nhưng rất hiếu học, ngày nào cũng đọc sách. Ông thích khuyến học, hay nói: "Học phí đắt lắm, các cháu phải học cho tốt!" Ông còn thích đọc sách về đủ loại học thuyết. Ông bảo học lực quan trọng hơn tiền bạc.',
      },
    ],
  },

  3: {
    title: '我的汉语书在哪儿？',
    titleVi: 'Sách tiếng Trung của tôi đâu rồi?',
    note: 'Dùng đủ 34 từ vựng và 5 ngữ pháp của bài: 谁, 上 / 下 / 里, 个 / 本, 在, 哪儿.',
    paragraphs: [
      {
        ko: '{{这}}是我的房间。房间{{里}}有{{窗户}}、{{灯}}、{{空调}}、{{冰箱}}、{{电风扇}}、{{沙发}}和{{电视机}}，还有一张{{桌子}}和两把{{椅子}}。',
        py: 'Zhè shì wǒ de fángjiān. Fángjiān li yǒu chuānghu, dēng, kōngtiáo, bīngxiāng, diànfēngshàn, shāfā hé diànshìjī, hái yǒu yì zhāng zhuōzi hé liǎng bǎ yǐzi.',
        vi: 'Đây là phòng của mình. Trong phòng có cửa sổ, đèn, điều hòa, tủ lạnh, quạt điện, sofa và tivi, còn có một cái bàn và hai cái ghế.',
      },
      {
        ko: '"妈妈，我的{{汉语}}{{书}}{{在}}{{哪儿}}？"\n"在桌子{{上}}。"\n"桌子上有两{{本}}书。{{那}}本书是{{谁}}的？"\n"那本书是你{{朋友}}的。"',
        py: '"Māma, wǒ de Hànyǔ shū zài nǎr?"\n"Zài zhuōzi shang."\n"Zhuōzi shang yǒu liǎng běn shū. Nà běn shū shì shéi de?"\n"Nà běn shū shì nǐ péngyou de."',
        vi: '"Mẹ ơi, sách tiếng Trung của con ở đâu ạ?"\n"Ở trên bàn."\n"Trên bàn có hai quyển sách. Quyển kia là của ai ạ?"\n"Quyển đó là của bạn con."',
      },
      {
        ko: '我的朋友叫Mei，{{她}}也学汉语。她的{{包}}在沙发上，包里有一{{个}}手机和一本书。',
        py: 'Wǒ de péngyou jiào Mei, tā yě xué Hànyǔ. Tā de bāo zài shāfā shang, bāo li yǒu yí ge shǒujī hé yì běn shū.',
        vi: 'Bạn mình tên là Mei, bạn ấy cũng học tiếng Trung. Túi của bạn ấy ở trên sofa, trong túi có một chiếc điện thoại và một quyển sách.',
      },
      {
        ko: 'Mei来拿书。我说："这是你的书。"\n她说："{{谢谢}}！"\n我说："{{不客气}}！"',
        py: 'Mei lái ná shū. Wǒ shuō: "Zhè shì nǐ de shū."\nTā shuō: "Xièxie!"\nWǒ shuō: "Bú kèqi!"',
        vi: 'Mei đến lấy sách. Mình nói: "Đây là sách của bạn."\nBạn ấy nói: "Cảm ơn nhé!"\nMình nói: "Đừng khách sáo!"',
      },
      {
        ko: 'Mei的爸爸在{{机关}}工作，常常坐{{飞机}}去北京。他的工作很{{机密}}，我们不知道他做什么{{机器}}。他说现在是学汉语的好{{机会}}，也是好{{时机}}。',
        py: 'Mei de bàba zài jīguān gōngzuò, chángcháng zuò fēijī qù Běijīng. Tā de gōngzuò hěn jīmì, wǒmen bù zhīdào tā zuò shénme jīqì. Tā shuō xiànzài shì xué Hànyǔ de hǎo jīhuì, yě shì hǎo shíjī.',
        vi: 'Bố của Mei làm việc ở cơ quan nhà nước, thường đi máy bay sang Bắc Kinh. Công việc của chú ấy rất cơ mật, tụi mình không biết chú làm máy móc (cơ khí) gì. Chú bảo bây giờ là cơ hội tốt để học tiếng Trung, cũng là thời cơ tốt.',
      },
      {
        ko: '老师问我们学汉语的{{动机}}是什么。Mei说："不会外语，找工作就有{{危机}}！""{{机}}"这个字真有意思。',
        py: 'Lǎoshī wèn wǒmen xué Hànyǔ de dòngjī shì shénme. Mei shuō: "Bú huì wàiyǔ, zhǎo gōngzuò jiù yǒu wēijī!" "Jī" zhège zì zhēn yǒu yìsi.',
        vi: 'Cô giáo hỏi động cơ học tiếng Trung của tụi mình là gì. Mei nói: "Không biết ngoại ngữ thì đi tìm việc sẽ gặp nguy cơ!" Chữ "cơ" này thật thú vị.',
      },
    ],
  },

  4: {
    title: '在越南饭馆',
    titleVi: 'Ở quán ăn Việt Nam',
    note: 'Dùng đủ 29 từ vựng và 6 ngữ pháp của bài: 会, 还, 很 + tính từ, 怎么, 在, 吧.',
    paragraphs: [
      {
        ko: '"你{{会}}{{说}}汉语吗？"\n"我会说{{一点儿}}。我{{也}}会{{读}}，可是不会{{写}}{{汉字}}。"\n"{{没关系}}，我教你{{吧}}！"',
        py: '"Nǐ huì shuō Hànyǔ ma?"\n"Wǒ huì shuō yìdiǎnr. Wǒ yě huì dú, kěshì bú huì xiě Hànzì."\n"Méi guānxi, wǒ jiāo nǐ ba!"',
        vi: '"Bạn biết nói tiếng Trung không?"\n"Mình biết nói một chút. Mình cũng biết đọc, nhưng không biết viết chữ Hán."\n"Không sao, để mình dạy bạn nhé!"',
      },
      {
        ko: '"\'菜\'字{{怎么}}写？"\n"你看{{这儿}}，是这样写的。"',
        py: '"\'Cài\' zì zěnme xiě?"\n"Nǐ kàn zhèr, shì zhèyàng xiě de."',
        vi: '"Chữ \'thái\' (món ăn) viết thế nào?"\n"Bạn nhìn chỗ này nè, viết như thế này."',
      },
      {
        ko: '中午，我们在一家越南饭馆吃饭。这家的{{菜}}很{{好吃}}。我{{喜欢}}{{甜}}的，朋友喜欢{{辣}}的。这个汤有点儿{{酸}}，那个菜太{{咸}}了，越南咖啡很{{苦}}。',
        py: 'Zhōngwǔ, wǒmen zài yì jiā Yuènán fànguǎn chī fàn. Zhè jiā de cài hěn hǎochī. Wǒ xǐhuan tián de, péngyou xǐhuan là de. Zhège tāng yǒudiǎnr suān, nàge cài tài xián le, Yuènán kāfēi hěn kǔ.',
        vi: 'Buổi trưa, tụi mình ăn ở một quán ăn Việt Nam. Đồ ăn quán này rất ngon. Mình thích món ngọt, bạn mình thích món cay. Món canh này hơi chua, món kia mặn quá, cà phê Việt Nam thì rất đắng.',
      },
      {
        ko: '服务员说："{{对不起}}，牛肉没有了，{{只}}有鸡肉。"\n我们说："没关系。我们{{还}}要一个鸡肉菜。"',
        py: 'Fúwùyuán shuō: "Duìbuqǐ, niúròu méiyǒu le, zhǐ yǒu jīròu."\nWǒmen shuō: "Méi guānxi. Wǒmen hái yào yí ge jīròu cài."',
        vi: 'Nhân viên phục vụ nói: "Xin lỗi, hết thịt bò rồi, chỉ có thịt gà thôi."\nTụi mình nói: "Không sao. Tụi mình gọi thêm một món gà nữa."',
      },
      {
        ko: '我的朋友很会{{说服}}别人，像一个{{说客}}。他喜欢看{{小说}}，也喜欢听{{传说}}。他不喜欢{{说教}}，可是很喜欢{{演说}}。吃饭的时候，他给我{{说明}}：这些词都有一个"说"字。',
        py: 'Wǒ de péngyou hěn huì shuōfú biérén, xiàng yí ge shuìkè. Tā xǐhuan kàn xiǎoshuō, yě xǐhuan tīng chuánshuō. Tā bù xǐhuan shuōjiào, kěshì hěn xǐhuan yǎnshuō. Chī fàn de shíhou, tā gěi wǒ shuōmíng: zhèxiē cí dōu yǒu yí ge "shuō" zì.',
        vi: 'Bạn mình rất giỏi thuyết phục người khác, giống như một thuyết khách. Cậu ấy thích đọc tiểu thuyết, cũng thích nghe truyền thuyết. Cậu ấy không thích thuyết giáo, nhưng rất thích diễn thuyết. Lúc ăn, cậu ấy thuyết minh cho mình: những từ này đều có chữ "thuyết".',
      },
    ],
  },

  5: {
    title: '女儿的生日',
    titleVi: 'Sinh nhật con gái',
    note: 'Dùng đủ 39 từ vựng và 5 ngữ pháp của bài: năm / tháng / ngày / thứ, 那, 们, câu liên động, 真.',
    paragraphs: [
      {
        ko: '"{{今天}}{{几}}{{月}}几号？{{星期}}几？"\n"今天十月十五号，{{星期三}}。"\n"{{明天}}是{{星期四}}，是我{{女儿}}的{{生日}}！"',
        py: '"Jīntiān jǐ yuè jǐ hào? Xīngqī jǐ?"\n"Jīntiān shí yuè shíwǔ hào, xīngqīsān."\n"Míngtiān shì xīngqīsì, shì wǒ nǚ\'ér de shēngrì!"',
        vi: '"Hôm nay là ngày mấy tháng mấy? Thứ mấy?"\n"Hôm nay là ngày 15 tháng 10, thứ tư."\n"Ngày mai là thứ năm, là sinh nhật con gái mình!"',
      },
      {
        ko: '女儿说："妈妈，明天{{我们}}{{去}}公园{{玩儿}}{{吧}}！"\n可是我明天{{要}}{{上班}}，{{公司}}有很多{{事}}。女儿{{真}}{{难过}}。',
        py: 'Nǚ\'ér shuō: "Māma, míngtiān wǒmen qù gōngyuán wánr ba!"\nKěshì wǒ míngtiān yào shàngbān, gōngsī yǒu hěn duō shì. Nǚ\'ér zhēn nánguò.',
        vi: 'Con gái nói: "Mẹ ơi, ngày mai mình đi công viên chơi nhé!"\nNhưng ngày mai mẹ phải đi làm, công ty có rất nhiều việc. Con bé buồn thật sự.',
      },
      {
        ko: '这个星期我真忙：{{星期一}}去北京，{{星期二}}回家，{{星期五}}和{{星期六}}也要上班，只有{{星期天}}休息。{{前天}}、{{昨天}}我都很忙，{{后天}}也很忙。',
        py: 'Zhège xīngqī wǒ zhēn máng: xīngqīyī qù Běijīng, xīngqī\'èr huí jiā, xīngqīwǔ hé xīngqīliù yě yào shàngbān, zhǐ yǒu xīngqītiān xiūxi. Qiántiān, zuótiān wǒ dōu hěn máng, hòutiān yě hěn máng.',
        vi: 'Tuần này mình bận thật: thứ hai đi Bắc Kinh, thứ ba về nhà, thứ sáu và thứ bảy cũng phải đi làm, chỉ có chủ nhật được nghỉ. Hôm kia, hôm qua mình đều rất bận, ngày kia cũng rất bận.',
      },
      {
        ko: '我{{先生}}说："那明天晚上我们去饭店吃饭吧！"女儿听{{了}}，马上笑了。',
        py: 'Wǒ xiānsheng shuō: "Nà míngtiān wǎnshang wǒmen qù fàndiàn chī fàn ba!" Nǚ\'ér tīng le, mǎshàng xiào le.',
        vi: 'Chồng mình nói: "Vậy tối mai cả nhà mình đi nhà hàng ăn nhé!" Con gái nghe xong, cười tươi ngay.',
      },
      {
        ko: '吃饭的时候，女儿问："\'{{生}}\'是什么意思？"我说，{{生命}}、{{生活}}、{{人生}}都有"生"字。我们要讲{{卫生}}，也要{{养生}}，还要保护{{生态}}和{{生物}}。不管{{发生}}什么事，生活都要过得{{生动}}有趣。',
        py: 'Chī fàn de shíhou, nǚ\'ér wèn: "\'Shēng\' shì shénme yìsi?" Wǒ shuō, shēngmìng, shēnghuó, rénshēng dōu yǒu "shēng" zì. Wǒmen yào jiǎng wèishēng, yě yào yǎngshēng, hái yào bǎohù shēngtài hé shēngwù. Bùguǎn fāshēng shénme shì, shēnghuó dōu yào guò de shēngdòng yǒuqù.',
        vi: 'Lúc ăn, con gái hỏi: "\'Sinh\' nghĩa là gì ạ?" Mình bảo, sinh mệnh, sinh hoạt, nhân sinh đều có chữ "sinh". Chúng ta phải giữ vệ sinh, phải dưỡng sinh, còn phải bảo vệ sinh thái và sinh vật. Dù có phát sinh chuyện gì, cuộc sống cũng phải sống sao cho sinh động, thú vị.',
      },
    ],
  },

  6: {
    title: 'Wang的一天',
    titleVi: 'Một ngày của Wang',
    note: 'Dùng đủ 44 từ vựng và 4 ngữ pháp của bài: 点 / 分 / 秒, 差 / 刻, từ chỉ thời gian làm trạng ngữ, 从…到.',
    paragraphs: [
      {
        ko: '"{{现在}}几点了？"\n"七{{点钟}}。不对，现在是七{{点}}零五{{分}}三十{{秒}}！"',
        py: '"Xiànzài jǐ diǎn le?"\n"Qī diǎnzhōng. Bú duì, xiànzài shì qī diǎn líng wǔ fēn sānshí miǎo!"',
        vi: '"Bây giờ là mấy giờ rồi?"\n"Bảy giờ đúng. À không, bây giờ là bảy giờ năm phút ba mươi giây!"',
      },
      {
        ko: 'Wang每天{{早上}}六点{{半}}{{起床}}，起床以后先收拾{{床}}。七点一{{刻}}{{吃早饭}}，{{差}}五分八点{{出门}}。',
        py: 'Wang měi tiān zǎoshang liù diǎn bàn qǐchuáng, qǐchuáng yǐhòu xiān shōushi chuáng. Qī diǎn yí kè chī zǎofàn, chà wǔ fēn bā diǎn chūmén.',
        vi: 'Wang mỗi ngày dậy lúc sáu giờ rưỡi sáng, dậy xong thì dọn giường trước. Bảy giờ mười lăm ăn sáng, tám giờ kém năm ra khỏi nhà.',
      },
      {
        ko: '他{{从}}{{上午}}八点{{到}}十二点{{上课}}，十二点{{下课}}。{{中午}}他在学校{{吃午饭}}。{{下午}}他去公司工作，五点半{{下班}}。',
        py: 'Tā cóng shàngwǔ bā diǎn dào shí\'èr diǎn shàngkè, shí\'èr diǎn xiàkè. Zhōngwǔ tā zài xuéxiào chī wǔfàn. Xiàwǔ tā qù gōngsī gōngzuò, wǔ diǎn bàn xiàbān.',
        vi: 'Cậu ấy học từ tám giờ sáng đến mười hai giờ, mười hai giờ tan học. Buổi trưa cậu ăn cơm trưa ở trường. Buổi chiều cậu đến công ty làm việc, năm rưỡi tan làm.',
      },
      {
        ko: '{{晚上}}七点他{{回}}家{{吃晚饭}}。{{吃}}完{{饭}}，他{{看书}}、{{上网}}，有{{时候}}也{{看}}{{电影}}。十点{{洗澡}}，十一点{{睡觉}}。周末他在家{{休息}}。',
        py: 'Wǎnshang qī diǎn tā huí jiā chī wǎnfàn. Chī wán fàn, tā kàn shū, shàngwǎng, yǒu shíhou yě kàn diànyǐng. Shí diǎn xǐzǎo, shíyī diǎn shuìjiào. Zhōumò tā zài jiā xiūxi.',
        vi: 'Bảy giờ tối cậu về nhà ăn tối. Ăn cơm xong, cậu đọc sách, lên mạng, có lúc cũng xem phim. Mười giờ tắm, mười một giờ đi ngủ. Cuối tuần cậu ở nhà nghỉ ngơi.',
      },
      {
        ko: 'Wang学习很{{出色}}。他{{出身}}在一个小村子，爸爸做{{出口}}生意，常常{{出行}}。他的姐姐明年要{{出嫁}}了。Wang说，以后他要写一本书，让它{{出版}}。',
        py: 'Wang xuéxí hěn chūsè. Tā chūshēn zài yí ge xiǎo cūnzi, bàba zuò chūkǒu shēngyi, chángcháng chūxíng. Tā de jiějie míngnián yào chūjià le. Wang shuō, yǐhòu tā yào xiě yì běn shū, ràng tā chūbǎn.',
        vi: 'Wang học rất xuất sắc. Cậu xuất thân từ một ngôi làng nhỏ, bố làm nghề xuất khẩu, thường xuyên xuất hành (đi xa). Chị gái cậu sang năm sẽ xuất giá. Wang nói sau này cậu sẽ viết một cuốn sách và cho xuất bản.',
      },
      {
        ko: '明天早上五点他们要{{出发}}去北京。老师说，路上可能会{{出现}}问题，大家要早点儿起床。"{{出}}"这个字的意思真多！',
        py: 'Míngtiān zǎoshang wǔ diǎn tāmen yào chūfā qù Běijīng. Lǎoshī shuō, lù shang kěnéng huì chūxiàn wèntí, dàjiā yào zǎo diǎnr qǐchuáng. "Chū" zhège zì de yìsi zhēn duō!',
        vi: 'Năm giờ sáng mai cả lớp xuất phát đi Bắc Kinh. Thầy giáo nói trên đường có thể xuất hiện sự cố, mọi người phải dậy sớm một chút. Chữ "xuất" này nhiều nghĩa thật!',
      },
    ],
  },

  7: {
    title: '在水果店',
    titleVi: 'Ở cửa hàng hoa quả',
    note: 'Dùng đủ 39 từ vựng và 5 ngữ pháp của bài: 元(块) / 角(毛) / 分, 二 / 两, 再, 太, 几 / 多少.',
    paragraphs: [
      {
        ko: '"{{老板}}，{{苹果}}多少{{钱}}一{{斤}}？"\n"八{{块}}五{{毛}}一斤。"\n"{{太}}{{贵}}{{了}}！{{便宜}}一点儿{{行}}吗？"\n"那就八块吧。"',
        py: '"Lǎobǎn, píngguǒ duōshao qián yì jīn?"\n"Bā kuài wǔ máo yì jīn."\n"Tài guì le! Piányi yìdiǎnr xíng ma?"\n"Nà jiù bā kuài ba."',
        vi: '"Ông chủ ơi, táo bao nhiêu tiền một cân (nửa ký)?"\n"Tám đồng năm hào một cân."\n"Đắt quá! Rẻ hơn chút được không?"\n"Vậy tám đồng thôi."',
      },
      {
        ko: '"行。我要{{两}}斤苹果，还要一{{瓶}}{{牛奶}}和十个{{鸡蛋}}。"\n"还要{{别的}}吗？"\n"{{再}}要一点儿{{水果}}吧，来两个西瓜。"',
        py: '"Xíng. Wǒ yào liǎng jīn píngguǒ, hái yào yì píng niúnǎi hé shí ge jīdàn."\n"Hái yào bié de ma?"\n"Zài yào yìdiǎnr shuǐguǒ ba, lái liǎng ge xīguā."',
        vi: '"Được. Tôi lấy hai cân táo, thêm một chai sữa bò và mười quả trứng gà."\n"Còn lấy gì khác không?"\n"Lấy thêm ít hoa quả nữa, cho hai quả dưa hấu."',
      },
      {
        ko: '"{{一共}}多少钱？"\n"一共四十九{{元}}三{{角}}五{{分}}。"\n"我没有{{零钱}}，只有{{整钱}}。{{给}}你一百块{{人民币}}。"',
        py: '"Yígòng duōshao qián?"\n"Yígòng sìshíjiǔ yuán sān jiǎo wǔ fēn."\n"Wǒ méiyǒu língqián, zhǐ yǒu zhěngqián. Gěi nǐ yìbǎi kuài rénmínbì."',
        vi: '"Tổng cộng bao nhiêu tiền?"\n"Tổng cộng bốn mươi chín đồng ba hào năm xu."\n"Tôi không có tiền lẻ, chỉ có tiền chẵn. Gửi ông một trăm tệ."',
      },
      {
        ko: '老板找了钱，笑着说："您{{慢走}}！"我{{慢}}慢地{{走}}回家。晚上妈妈做好了饭，对我们说："{{慢用}}！"',
        py: 'Lǎobǎn zhǎo le qián, xiào zhe shuō: "Nín màn zǒu!" Wǒ mànmàn de zǒu huí jiā. Wǎnshang māma zuò hǎo le fàn, duì wǒmen shuō: "Màn yòng!"',
        vi: 'Ông chủ trả lại tiền thừa, cười nói: "Đi thong thả nhé!" Tôi chậm rãi đi bộ về nhà. Buổi tối mẹ nấu cơm xong, nói với cả nhà: "Ăn từ từ nhé!"',
      },
      {
        ko: '我的越南朋友说，一百块人民币差不多是三十多万{{越南盾}}，也差不多是十四{{美元}}。',
        py: 'Wǒ de Yuènán péngyou shuō, yìbǎi kuài rénmínbì chàbuduō shì sānshí duō wàn Yuènándùn, yě chàbuduō shì shísì Měiyuán.',
        vi: 'Bạn người Việt của tôi nói, một trăm tệ khoảng hơn ba trăm nghìn đồng Việt Nam, cũng khoảng mười bốn đô la Mỹ.',
      },
      {
        ko: '"{{果}}"字的意思很多：{{结果}}、{{成果}}、{{效果}}、{{后果}}、{{因果}}。佛教说做好事有{{功果}}，修行最后能成{{正果}}。越南菜里还有{{草果}}，是一种很香的香料。',
        py: '"Guǒ" zì de yìsi hěn duō: jiéguǒ, chéngguǒ, xiàoguǒ, hòuguǒ, yīnguǒ. Fójiào shuō zuò hǎoshì yǒu gōngguǒ, xiūxíng zuìhòu néng chéng zhèngguǒ. Yuènán cài li hái yǒu cǎoguǒ, shì yì zhǒng hěn xiāng de xiāngliào.',
        vi: 'Chữ "quả" có nhiều nghĩa: kết quả, thành quả, hiệu quả, hậu quả, nhân quả. Đạo Phật nói làm việc tốt thì có công quả, tu hành cuối cùng sẽ thành chính quả. Món Việt còn có thảo quả, một loại gia vị rất thơm.',
      },
    ],
  },

  8: {
    title: '河内的四个季节',
    titleVi: 'Bốn mùa Hà Nội',
    note: 'Dùng đủ 35 từ vựng và 4 ngữ pháp của bài: 怎么样, câu vị ngữ chủ-vị, 最, 不A不B.',
    paragraphs: [
      {
        ko: '"{{河内}}的{{天气}}{{怎么样}}？"\n"{{夏天}}很{{热}}，常常三十八{{度}}。"\n"{{听说}}河内{{秋天}}{{最}}好，{{对}}吗？"\n"对！秋天不{{冷}}不热，很{{舒服}}。"',
        py: '"Hénèi de tiānqì zěnmeyàng?"\n"Xiàtiān hěn rè, chángcháng sānshíbā dù."\n"Tīngshuō Hénèi qiūtiān zuì hǎo, duì ma?"\n"Duì! Qiūtiān bù lěng bú rè, hěn shūfu."',
        vi: '"Thời tiết Hà Nội thế nào?"\n"Mùa hè rất nóng, thường ba mươi tám độ."\n"Nghe nói mùa thu Hà Nội đẹp nhất, đúng không?"\n"Đúng! Mùa thu không lạnh không nóng, rất dễ chịu."',
      },
      {
        ko: '{{春天}}常常{{下}}小{{雨}}，早上有{{雾}}。{{冬天}}有点儿冷，可是不{{下雪}}。我最{{喜欢}}秋天，这是河内最美的{{季节}}。',
        py: 'Chūntiān chángcháng xià xiǎo yǔ, zǎoshang yǒu wù. Dōngtiān yǒudiǎnr lěng, kěshì bú xiàxuě. Wǒ zuì xǐhuan qiūtiān, zhè shì Hénèi zuì měi de jìjié.',
        vi: 'Mùa xuân hay mưa phùn, buổi sáng có sương mù. Mùa đông hơi lạnh, nhưng không có tuyết. Tôi thích nhất mùa thu, đó là mùa đẹp nhất của Hà Nội.',
      },
      {
        ko: '今天是{{阴天}}，{{多云}}。下午{{刮风}}、{{打雷}}，下了一场{{雷阵雨}}。天气预报说明天是{{晴天}}。夏天有时候还有{{台风}}，台风来的时候大家都不出门。',
        py: 'Jīntiān shì yīntiān, duōyún. Xiàwǔ guāfēng, dǎléi, xià le yì cháng léizhènyǔ. Tiānqì yùbào shuō míngtiān shì qíngtiān. Xiàtiān yǒu shíhou hái yǒu táifēng, táifēng lái de shíhou dàjiā dōu bù chūmén.',
        vi: 'Hôm nay trời âm u, nhiều mây. Buổi chiều nổi gió, có sấm, rồi đổ một trận mưa dông. Dự báo thời tiết nói ngày mai trời nắng ráo. Mùa hè đôi khi còn có bão, lúc bão đến mọi người đều không ra khỏi nhà.',
      },
      {
        ko: '我姐姐在一家衣服店做{{服务}}工作。她很喜欢{{服饰}}，每个季节都穿不同的{{服装}}。她说："{{服}}字有\'衣服\'的意思，也有\'服从\'的意思。"',
        py: 'Wǒ jiějie zài yì jiā yīfu diàn zuò fúwù gōngzuò. Tā hěn xǐhuan fúshì, měi ge jìjié dōu chuān bù tóng de fúzhuāng. Tā shuō: "Fú zì yǒu \'yīfu\' de yìsi, yě yǒu \'fúcóng\' de yìsi."',
        vi: 'Chị gái tôi làm công việc phục vụ ở một cửa hàng quần áo. Chị rất thích phục sức (trang phục và đồ trang sức), mùa nào cũng mặc phục trang khác nhau. Chị nói: "Chữ \'phục\' vừa có nghĩa \'quần áo\', vừa có nghĩa \'phục tùng\'."',
      },
      {
        ko: '我哥哥正在{{服役}}，当兵很辛苦，可是他{{克服}}了很多困难。上个冬天他爬上了一座很高的山，"{{征服}}"了它。我真{{拜服}}他！',
        py: 'Wǒ gēge zhèngzài fúyì, dāng bīng hěn xīnkǔ, kěshì tā kèfú le hěn duō kùnnan. Shàng ge dōngtiān tā pá shàng le yí zuò hěn gāo de shān, "zhēngfú" le tā. Wǒ zhēn bàifú tā!',
        vi: 'Anh trai tôi đang phục dịch (đi nghĩa vụ quân sự), làm lính rất vất vả, nhưng anh đã khắc phục được rất nhiều khó khăn. Mùa đông năm ngoái anh leo lên một ngọn núi rất cao, "chinh phục" được nó. Tôi thật sự bái phục anh!',
      },
    ],
  },

  9: {
    title: '请问，医院在哪儿？',
    titleVi: 'Xin hỏi, bệnh viện ở đâu?',
    note: 'Dùng đủ 37 từ vựng và 6 ngữ pháp của bài: 就, 往, 边 / 面, 离, 多 + tính từ, ……以后.',
    paragraphs: [
      {
        ko: '"{{请}}{{问}}，{{医院}}在哪儿？"\n"医院{{离}}这儿不{{远}}，{{就}}在{{银行}}{{旁边}}。"\n"{{多远}}？"\n"一{{公里}}多。你{{一直}}{{往}}{{前面}}走，到了路口{{以后}}往{{右}}{{拐}}。"',
        py: '"Qǐngwèn, yīyuàn zài nǎr?"\n"Yīyuàn lí zhèr bù yuǎn, jiù zài yínháng pángbiān."\n"Duō yuǎn?"\n"Yì gōnglǐ duō. Nǐ yìzhí wǎng qiánmiàn zǒu, dào le lùkǒu yǐhòu wǎng yòu guǎi."',
        vi: '"Xin hỏi, bệnh viện ở đâu ạ?"\n"Bệnh viện cách đây không xa, ở ngay cạnh ngân hàng."\n"Bao xa ạ?"\n"Hơn một cây số. Bạn cứ đi thẳng về phía trước, đến ngã tư thì rẽ phải."',
      },
      {
        ko: '"走路要{{多久}}？"\n"十五{{分钟}}，很{{近}}。往{{左}}拐是学校，别走错了！"',
        py: '"Zǒulù yào duō jiǔ?"\n"Shíwǔ fēnzhōng, hěn jìn. Wǎng zuǒ guǎi shì xuéxiào, bié zǒu cuò le!"',
        vi: '"Đi bộ mất bao lâu ạ?"\n"Mười lăm phút, gần lắm. Rẽ trái là trường học, đừng đi nhầm nhé!"',
      },
      {
        ko: '医院{{后面}}是一个{{公园}}，{{左边}}有一个{{超市}}，{{右边}}是一家{{咖啡馆}}和一家{{电影院}}。公园{{里边}}很安静，{{外边}}车很多。',
        py: 'Yīyuàn hòumiàn shì yí ge gōngyuán, zuǒbian yǒu yí ge chāoshì, yòubian shì yì jiā kāfēiguǎn hé yì jiā diànyǐngyuàn. Gōngyuán lǐbian hěn ānjìng, wàibian chē hěn duō.',
        vi: 'Phía sau bệnh viện là một công viên, bên trái có một siêu thị, bên phải là một quán cà phê và một rạp chiếu phim. Bên trong công viên rất yên tĩnh, bên ngoài thì rất nhiều xe.',
      },
      {
        ko: '公园门口站着一个{{公安}}。墙上{{公布}}了一个消息：公园是{{公共}}的地方，每个{{公民}}都可以免费进去，很{{公平}}。这个消息是{{公开}}的，大家都知道。',
        py: 'Gōngyuán ménkǒu zhàn zhe yí ge gōng\'ān. Qiáng shang gōngbù le yí ge xiāoxi: gōngyuán shì gōnggòng de dìfang, měi ge gōngmín dōu kěyǐ miǎnfèi jìnqu, hěn gōngpíng. Zhège xiāoxi shì gōngkāi de, dàjiā dōu zhīdào.',
        vi: 'Trước cổng công viên có một anh công an đứng. Trên tường công bố một thông báo: công viên là nơi công cộng, mọi công dân đều được vào miễn phí, rất công bằng. Thông báo này được công khai, ai cũng biết.',
      },
      {
        ko: '公园里有很多小朋友。一个小女孩穿着漂亮的裙子说："我是{{公主}}！""{{公}}"这个字也真有意思。',
        py: 'Gōngyuán li yǒu hěn duō xiǎopéngyou. Yí ge xiǎo nǚhái chuān zhe piàoliang de qúnzi shuō: "Wǒ shì gōngzhǔ!" "Gōng" zhège zì yě zhēn yǒu yìsi.',
        vi: 'Trong công viên có rất nhiều bạn nhỏ. Một cô bé mặc váy xinh xắn nói: "Con là công chúa!" Chữ "công" này cũng thú vị thật.',
      },
    ],
  },

  10: {
    title: '周末一起去看电影',
    titleVi: 'Cuối tuần cùng đi xem phim',
    note: 'Dùng đủ 46 từ vựng và 4 ngữ pháp của bài: 在 (đang), 先…然后…, 想, 骑 / 坐 / 开.',
    paragraphs: [
      {
        ko: '"{{喂}}，你{{在}}做什么呢？"\n"我{{正在}}看{{电视}}。"\n"这个{{周末}}你有{{空儿}}吗？我有两{{张}}{{新}}电影的{{票}}，听说很{{好看}}。我们{{一起}}去{{电影院}}吧！"\n"好啊！"',
        py: '"Wéi, nǐ zài zuò shénme ne?"\n"Wǒ zhèngzài kàn diànshì."\n"Zhège zhōumò nǐ yǒu kòngr ma? Wǒ yǒu liǎng zhāng xīn diànyǐng de piào, tīngshuō hěn hǎokàn. Wǒmen yìqǐ qù diànyǐngyuàn ba!"\n"Hǎo a!"',
        vi: '"A lô, cậu đang làm gì đấy?"\n"Tớ đang xem tivi."\n"Cuối tuần này cậu có rảnh không? Tớ có hai vé phim mới, nghe nói hay lắm. Mình cùng đi rạp chiếu phim nhé!"\n"Được đó!"',
      },
      {
        ko: '"你{{想}}怎么去？{{骑}}{{自行车}}还是{{坐}}{{公交车}}？"\n"我哥哥{{开}}{{汽车}}送我们吧。他现在{{正}}洗车呢。"',
        py: '"Nǐ xiǎng zěnme qù? Qí zìxíngchē háishi zuò gōngjiāochē?"\n"Wǒ gēge kāi qìchē sòng wǒmen ba. Tā xiànzài zhèng xǐ chē ne."',
        vi: '"Cậu muốn đi bằng gì? Đạp xe hay đi xe buýt?"\n"Để anh trai tớ lái ô tô chở tụi mình đi. Anh ấy đang rửa xe đấy."',
      },
      {
        ko: '我们城市的交通很方便，有{{公共汽车}}、{{地铁}}和{{摩托车}}，去别的城市可以坐{{火车}}、{{船}}或者{{飞机}}。',
        py: 'Wǒmen chéngshì de jiāotōng hěn fāngbiàn, yǒu gōnggòng qìchē, dìtiě hé mótuōchē, qù bié de chéngshì kěyǐ zuò huǒchē, chuán huòzhě fēijī.',
        vi: 'Giao thông thành phố mình rất tiện, có xe buýt công cộng, tàu điện ngầm và xe máy; muốn đi thành phố khác thì có thể đi tàu hỏa, tàu thủy hoặc máy bay.',
      },
      {
        ko: '周末我们{{先}}看电影，{{然后}}去{{逛街}}、{{购物}}。我朋友还喜欢{{健身}}、{{踢足球}}、{{跳舞}}、{{听音乐会}}和{{看画展}}，我最喜欢在咖啡馆{{聊天儿}}。',
        py: 'Zhōumò wǒmen xiān kàn diànyǐng, ránhòu qù guàngjiē, gòuwù. Wǒ péngyou hái xǐhuan jiànshēn, tī zúqiú, tiàowǔ, tīng yīnyuèhuì hé kàn huàzhǎn, wǒ zuì xǐhuan zài kāfēiguǎn liáotiānr.',
        vi: 'Cuối tuần tụi mình xem phim trước, sau đó đi dạo phố, mua sắm. Bạn tớ còn thích tập gym, đá bóng, khiêu vũ, đi nghe hòa nhạc và xem triển lãm tranh; còn tớ thích nhất là tán gẫu ở quán cà phê.',
      },
      {
        ko: '我朋友很{{自信}}，可是不{{自满}}。她喜欢{{自由}}，做事很{{自主}}，什么都{{自力}}完成。她{{自愿}}参加了一个{{自发}}的活动，保护大{{自然}}。',
        py: 'Wǒ péngyou hěn zìxìn, kěshì bú zìmǎn. Tā xǐhuan zìyóu, zuò shì hěn zìzhǔ, shénme dōu zìlì wánchéng. Tā zìyuàn cānjiā le yí ge zìfā de huódòng, bǎohù dà zìrán.',
        vi: 'Bạn tớ rất tự tin nhưng không tự mãn. Cô ấy thích tự do, làm việc gì cũng tự chủ, cái gì cũng tự lực hoàn thành. Cô ấy tự nguyện tham gia một hoạt động tự phát để bảo vệ thiên nhiên (tự nhiên).',
      },
      {
        ko: '她家的门是{{自动}}的，很先进。她常说："我为自己{{自豪}}！""{{自}}"就是"自己"的意思。',
        py: 'Tā jiā de mén shì zìdòng de, hěn xiānjìn. Tā cháng shuō: "Wǒ wèi zìjǐ zìháo!" "Zì" jiù shì "zìjǐ" de yìsi.',
        vi: 'Cửa nhà cô ấy là cửa tự động, rất hiện đại. Cô ấy hay nói: "Tớ tự hào về bản thân!" "Tự" chính là "bản thân mình".',
      },
    ],
  },

  11: {
    title: '姐姐买了很多衣服',
    titleVi: 'Chị gái đã mua rất nhiều quần áo',
    note: 'Dùng đủ 38 từ vựng và 7 ngữ pháp của bài: 给, 了 (động thái), 极了, 的 (cụm từ), danh từ + 呢？, 多了, 是……的.',
    paragraphs: [
      {
        ko: '{{昨天}}我给{{姐姐}}{{打电话}}，她{{没}}{{接}}。后来她说，她去{{商店}}买{{东西}}了。',
        py: 'Zuótiān wǒ gěi jiějie dǎ diànhuà, tā méi jiē. Hòulái tā shuō, tā qù shāngdiàn mǎi dōngxi le.',
        vi: 'Hôm qua tôi gọi điện cho chị gái, chị không nghe máy. Sau đó chị bảo chị đi cửa hàng mua đồ.',
      },
      {
        ko: '"你买了什么？"\n"我买了很{{多}}{{衣服}}：一件{{奥黛}}、两件{{衬衫}}、一条{{裤子}}、一条{{裙子}}、三件{{T恤}}、一条{{牛仔裤}}、一件{{毛衣}}和一件{{外套}}。{{这些}}衣服都漂亮{{极了}}！"',
        py: '"Nǐ mǎi le shénme?"\n"Wǒ mǎi le hěn duō yīfu: yí jiàn àodài, liǎng jiàn chènshān, yì tiáo kùzi, yì tiáo qúnzi, sān jiàn T xù, yì tiáo niúzǎikù, yí jiàn máoyī hé yí jiàn wàitào. Zhèxiē yīfu dōu piàoliang jí le!"',
        vi: '"Chị mua gì thế?"\n"Chị mua rất nhiều quần áo: một bộ áo dài, hai cái áo sơ mi, một cái quần, một cái váy, ba cái áo phông, một cái quần bò, một cái áo len và một cái áo khoác. Mấy bộ này đều đẹp cực kỳ!"',
      },
      {
        ko: '"你的{{身体}}呢？"\n"好多了。上个星期我生病了，吃了几天{{药}}，现在好多了。"',
        py: '"Nǐ de shēntǐ ne?"\n"Hǎo duō le. Shàng ge xīngqī wǒ shēngbìng le, chī le jǐ tiān yào, xiànzài hǎo duō le."',
        vi: '"Sức khỏe chị thì sao?"\n"Khá hơn nhiều rồi. Tuần trước chị bị ốm, uống thuốc mấy hôm, giờ đỡ nhiều rồi."',
      },
      {
        ko: '"照片上的{{他}}是谁？"\n"他是我男朋友。你不{{知道}}吗？这件外套是他{{送}}给我的。"',
        py: '"Zhàopiàn shang de tā shì shéi?"\n"Tā shì wǒ nánpéngyou. Nǐ bù zhīdào ma? Zhè jiàn wàitào shì tā sòng gěi wǒ de."',
        vi: '"Anh trong ảnh là ai thế?"\n"Anh ấy là bạn trai chị. Em không biết à? Cái áo khoác này là anh ấy tặng chị đấy."',
      },
      {
        ko: '下午姐姐去邮局{{寄}}了一个包裹，又去图书馆{{还}}了一本书。路上有人在{{卖}}{{报纸}}，她买了一份《河内{{日报}}》。',
        py: 'Xiàwǔ jiějie qù yóujú jì le yí ge bāoguǒ, yòu qù túshūguǎn huán le yì běn shū. Lù shang yǒu rén zài mài bàozhǐ, tā mǎi le yí fèn "Hénèi Rìbào".',
        vi: 'Buổi chiều chị đi bưu điện gửi một bưu kiện, rồi đến thư viện trả một quyển sách. Trên đường có người bán báo, chị mua một tờ "Hà Nội Nhật báo".',
      },
      {
        ko: '报纸上有很多消息：天气{{预报}}说明天有台风，政府发了台风{{警报}}，也{{通报}}了很多学校停课。有一篇{{报告}}说，很多学生{{报名}}参加了志愿活动，想{{报答}}社会。还有一部新电影，讲一个人为了{{报仇}}去偷{{情报}}。"{{报}}"这个字真有用！',
        py: 'Bàozhǐ shang yǒu hěn duō xiāoxi: tiānqì yùbào shuō míngtiān yǒu táifēng, zhèngfǔ fā le táifēng jǐngbào, yě tōngbào le hěn duō xuéxiào tíngkè. Yǒu yì piān bàogào shuō, hěn duō xuésheng bàomíng cānjiā le zhìyuàn huódòng, xiǎng bàodá shèhuì. Hái yǒu yí bù xīn diànyǐng, jiǎng yí ge rén wèile bàochóu qù tōu qíngbào. "Bào" zhège zì zhēn yǒuyòng!',
        vi: 'Trên báo có rất nhiều tin: dự báo thời tiết nói ngày mai có bão, chính phủ phát cảnh báo bão, cũng thông báo nhiều trường cho học sinh nghỉ. Có một bài báo cáo nói nhiều sinh viên đã báo danh tham gia hoạt động tình nguyện để báo đáp xã hội. Còn có một bộ phim mới, kể về một người vì báo thù mà đi đánh cắp tình báo. Chữ "báo" này thật hữu ích!',
      },
    ],
  },

  12: {
    title: '这几件衣服怎么样？',
    titleVi: 'Mấy bộ quần áo này thế nào?',
    note: 'Dùng đủ 35 từ vựng và 4 ngữ pháp của bài: 一下, 就是, 一点儿 / 有点儿, 已经.',
    paragraphs: [
      {
        ko: '"你{{帮}}我看{{一下}}，这{{件}}{{红}}衣服怎么样？"\n"{{还可以}}，{{就是}}{{有点儿}}{{小}}。"\n"那这件{{蓝}}的呢？"\n"这个{{颜色}}{{不错}}！"',
        py: '"Nǐ bāng wǒ kàn yíxià, zhè jiàn hóng yīfu zěnmeyàng?"\n"Hái kěyǐ, jiùshì yǒudiǎnr xiǎo."\n"Nà zhè jiàn lán de ne?"\n"Zhège yánsè búcuò!"',
        vi: '"Cậu xem giúp tớ một chút, cái áo đỏ này thế nào?"\n"Cũng tạm, chỉ có điều hơi nhỏ."\n"Thế cái màu xanh này thì sao?"\n"Màu này được đấy!"',
      },
      {
        ko: '服务员说："{{来}}，我{{让}}你试试大一点儿的。"我很喜欢这件衣服，可是{{它}}有点儿贵。',
        py: 'Fúwùyuán shuō: "Lái, wǒ ràng nǐ shìshi dà yìdiǎnr de." Wǒ hěn xǐhuan zhè jiàn yīfu, kěshì tā yǒudiǎnr guì.',
        vi: 'Nhân viên nói: "Nào, để em cho chị thử cái to hơn một chút." Tôi rất thích chiếc áo này, nhưng nó hơi đắt.',
      },
      {
        ko: '买好衣服，我们去{{超市}}。{{已经}}十二点了，我们都有点儿累。{{正好}}超市里有一家小店，我喝了一杯{{咖啡}}，朋友喝了一杯{{茶}}，我们还买了一个{{西瓜}}。',
        py: 'Mǎi hǎo yīfu, wǒmen qù chāoshì. Yǐjīng shí\'èr diǎn le, wǒmen dōu yǒudiǎnr lèi. Zhènghǎo chāoshì li yǒu yì jiā xiǎo diàn, wǒ hē le yì bēi kāfēi, péngyou hē le yì bēi chá, wǒmen hái mǎi le yí ge xīguā.',
        vi: 'Mua quần áo xong, chúng tôi đi siêu thị. Đã mười hai giờ rồi, ai cũng hơi mệt. Vừa hay trong siêu thị có một quán nhỏ, tôi uống một cốc cà phê, bạn tôi uống một cốc trà, chúng tôi còn mua một quả dưa hấu.',
      },
      {
        ko: '超市里的水果五颜六色：{{黑}}葡萄、{{白}}梨、{{橙}}子、{{黄}}香蕉、{{绿}}苹果，还有{{紫}}色的茄子。',
        py: 'Chāoshì li de shuǐguǒ wǔ yán liù sè: hēi pútao, bái lí, chéngzi, huáng xiāngjiāo, lǜ píngguǒ, hái yǒu zǐsè de qiézi.',
        vi: 'Hoa quả trong siêu thị đủ màu sắc: nho đen, lê trắng, cam, chuối vàng, táo xanh lục, còn có cả cà tím màu tím.',
      },
      {
        ko: '朋友说我今天{{气色}}很好。她是画家，画画很{{出色}}，她的画很有{{特色}}，最喜欢画越南的{{景色}}。她说做人要保持{{本色}}。',
        py: 'Péngyou shuō wǒ jīntiān qìsè hěn hǎo. Tā shì huàjiā, huà huà hěn chūsè, tā de huà hěn yǒu tèsè, zuì xǐhuan huà Yuènán de jǐngsè. Tā shuō zuò rén yào bǎochí běnsè.',
        vi: 'Bạn tôi nói hôm nay tôi khí sắc rất tốt. Cô ấy là họa sĩ, vẽ rất xuất sắc, tranh của cô ấy rất đặc sắc, cô ấy thích vẽ cảnh sắc Việt Nam nhất. Cô ấy nói làm người phải giữ được bản sắc của mình.',
      },
      {
        ko: '她唱歌的{{音色}}也很美，我写文章，她还帮我{{润色}}。可是她最不喜欢{{好色}}的男人！"{{色}}"字原来有这么多意思。',
        py: 'Tā chànggē de yīnsè yě hěn měi, wǒ xiě wénzhāng, tā hái bāng wǒ rùnsè. Kěshì tā zuì bù xǐhuan hàosè de nánrén! "Sè" zì yuánlái yǒu zhème duō yìsi.',
        vi: 'Âm sắc giọng hát của cô ấy cũng rất hay, tôi viết bài thì cô ấy còn giúp tôi nhuận sắc (trau chuốt câu chữ). Nhưng cô ấy ghét nhất đàn ông háo sắc! Thì ra chữ "sắc" có nhiều nghĩa đến thế.',
      },
    ],
  },

  13: {
    title: '再来两份炒米饭',
    titleVi: 'Cho thêm hai suất cơm rang',
    note: 'Dùng đủ 38 từ vựng và 4 ngữ pháp của bài: lặp động từ, 还是 / 或者, bổ ngữ thời lượng, A不A.',
    paragraphs: [
      {
        ko: '中午我和同事去{{饭店}}吃饭。{{服务员}}给了我们一个{{菜单}}。',
        py: 'Zhōngwǔ wǒ hé tóngshì qù fàndiàn chī fàn. Fúwùyuán gěi le wǒmen yí ge càidān.',
        vi: 'Buổi trưa tôi và đồng nghiệp đi nhà hàng ăn cơm. Nhân viên phục vụ đưa cho chúng tôi một quyển thực đơn.',
      },
      {
        ko: '"你们要不要{{酸}}{{辣}}{{鱼}}？"\n"要，再来两{{份}}{{炒}}{{米饭}}和一{{碗}}{{面条儿}}。"\n"{{喝}}什么？{{果汁}}{{还是}}{{啤酒}}？"\n"我不喝{{酒}}，果汁{{或者}}茶都行。"',
        py: '"Nǐmen yào bu yào suān là yú?"\n"Yào, zài lái liǎng fèn chǎo mǐfàn hé yì wǎn miàntiáor."\n"Hē shénme? Guǒzhī háishi píjiǔ?"\n"Wǒ bù hē jiǔ, guǒzhī huòzhě chá dōu xíng."',
        vi: '"Các anh chị có dùng cá chua cay không?"\n"Có, cho thêm hai suất cơm rang và một bát mì."\n"Uống gì ạ? Nước ép hay bia?"\n"Tôi không uống rượu bia, nước ép hoặc trà đều được."',
      },
      {
        ko: '菜单上还有{{鸡肉}}、{{猪肉}}、{{牛肉}}和{{羊肉}}。同事说："我们再{{考虑}}考虑吧。"我们看了十分钟菜单。',
        py: 'Càidān shang hái yǒu jīròu, zhūròu, niúròu hé yángròu. Tóngshì shuō: "Wǒmen zài kǎolǜ kǎolǜ ba." Wǒmen kàn le shí fēnzhōng càidān.',
        vi: 'Trên thực đơn còn có thịt gà, thịt heo, thịt bò và thịt cừu. Đồng nghiệp nói: "Mình cân nhắc thêm chút nhé." Chúng tôi xem thực đơn mất mười phút.',
      },
      {
        ko: '菜很快就{{上}}了。吃完饭，我说："服务员，{{买单}}！"\n"请{{稍等}}。"我们{{等}}了五分钟。',
        py: 'Cài hěn kuài jiù shàng le. Chī wán fàn, wǒ shuō: "Fúwùyuán, mǎidān!"\n"Qǐng shāo děng." Wǒmen děng le wǔ fēnzhōng.',
        vi: 'Món ăn được bưng lên rất nhanh. Ăn xong, tôi nói: "Em ơi, tính tiền!"\n"Xin đợi một lát." Chúng tôi đợi năm phút.',
      },
      {
        ko: '同事说："这家的米饭很香，{{但是}}有点儿贵。听说这里的{{米}}是从越南来的。"他一边吃饭，一边{{学习}}汉语。',
        py: 'Tóngshì shuō: "Zhè jiā de mǐfàn hěn xiāng, dànshì yǒudiǎnr guì. Tīngshuō zhèlǐ de mǐ shì cóng Yuènán lái de." Tā yìbiān chī fàn, yìbiān xuéxí Hànyǔ.',
        vi: 'Đồng nghiệp nói: "Cơm quán này rất thơm, nhưng hơi đắt. Nghe nói gạo ở đây là gạo từ Việt Nam sang." Anh ấy vừa ăn cơm vừa học tiếng Trung.',
      },
      {
        ko: '我的同事是{{单身}}，一个人住，有时候觉得很{{孤单}}。他人很{{单纯}}，喜欢{{单独}}吃饭。他在一个物流{{单位}}工作，每天要看很多{{运单}}，周末还去街上发{{传单}}。他说："生活很{{简单}}，\'{{单}}\'就是\'一个\'的意思。"',
        py: 'Wǒ de tóngshì shì dānshēn, yí ge rén zhù, yǒu shíhou juéde hěn gūdān. Tā rén hěn dānchún, xǐhuan dāndú chī fàn. Tā zài yí ge wùliú dānwèi gōngzuò, měi tiān yào kàn hěn duō yùndān, zhōumò hái qù jiē shang fā chuándān. Tā shuō: "Shēnghuó hěn jiǎndān, \'dān\' jiù shì \'yí ge\' de yìsi."',
        vi: 'Đồng nghiệp tôi là người đơn thân, sống một mình, đôi khi thấy rất cô đơn. Anh ấy rất đơn thuần, thích ăn cơm một mình (đơn độc). Anh làm ở một đơn vị vận chuyển, mỗi ngày phải xem rất nhiều vận đơn, cuối tuần còn ra phố phát truyền đơn. Anh nói: "Cuộc sống rất giản đơn, \'đơn\' nghĩa là \'một\'."',
      },
    ],
  },

  14: {
    title: '还有二十分钟就上课了',
    titleVi: 'Còn hai mươi phút nữa là vào học rồi',
    note: 'Dùng đủ 45 từ vựng và 5 ngữ pháp của bài: 别 / 不要, 还 (vẫn), 对, bổ ngữ kết quả, 这么 / 那么.',
    paragraphs: [
      {
        ko: '早上七点，{{妹妹}}还在睡觉。我说："快起床！还有二十分钟就{{上课}}了！"\n她说："{{哥}}，{{别}}叫我，我还想睡。"她{{总是}}{{这样}}！',
        py: 'Zǎoshang qī diǎn, mèimei hái zài shuìjiào. Wǒ shuō: "Kuài qǐchuáng! Hái yǒu èrshí fēnzhōng jiù shàngkè le!"\nTā shuō: "Gē, bié jiào wǒ, wǒ hái xiǎng shuì." Tā zǒngshì zhèyàng!',
        vi: 'Bảy giờ sáng, em gái vẫn còn ngủ. Tôi nói: "Dậy mau! Còn hai mươi phút nữa là vào học rồi!"\nNó nói: "Anh ơi, đừng gọi em, em vẫn muốn ngủ." Lúc nào nó cũng như vậy!',
      },
      {
        ko: '她起床以后，{{刷牙}}、{{洗脸}}、{{穿衣服}}，可是不吃早饭。妈妈说："{{早吃好，午吃饱，晚吃少}}。{{不要}}不吃早饭！"',
        py: 'Tā qǐchuáng yǐhòu, shuāyá, xǐliǎn, chuān yīfu, kěshì bù chī zǎofàn. Māma shuō: "Zǎo chī hǎo, wǔ chī bǎo, wǎn chī shǎo. Búyào bù chī zǎofàn!"',
        vi: 'Dậy xong, nó đánh răng, rửa mặt, mặc quần áo, nhưng không ăn sáng. Mẹ nói: "Sáng ăn ngon, trưa ăn no, tối ăn ít. Đừng có nhịn ăn sáng!"',
      },
      {
        ko: '晚上妹妹的作业没{{写完}}。她说："这道题我不{{懂}}，你{{帮助}}我吧。"我帮她把作业{{做好}}，她也{{学会}}了。作业做{{完}}了，她说："谢谢哥哥，你真{{帅}}！"',
        py: 'Wǎnshang mèimei de zuòyè méi xiě wán. Tā shuō: "Zhè dào tí wǒ bù dǒng, nǐ bāngzhù wǒ ba." Wǒ bāng tā bǎ zuòyè zuò hǎo, tā yě xué huì le. Zuòyè zuò wán le, tā shuō: "Xièxie gēge, nǐ zhēn shuài!"',
        vi: 'Buổi tối em gái chưa viết xong bài tập. Nó nói: "Bài này em không hiểu, anh giúp em với." Tôi giúp nó làm xong bài, nó cũng học được cách làm. Làm xong bài tập, nó nói: "Cảm ơn anh, anh đẹp trai thật!"',
      },
      {
        ko: '周末中午我{{准备}}{{午饭}}。我{{看见}}妹妹的{{裤子}}很脏，就帮她{{洗}}了，然后又{{洗衣服}}。',
        py: 'Zhōumò zhōngwǔ wǒ zhǔnbèi wǔfàn. Wǒ kànjiàn mèimei de kùzi hěn zāng, jiù bāng tā xǐ le, ránhòu yòu xǐ yīfu.',
        vi: 'Trưa cuối tuần tôi chuẩn bị bữa trưa. Tôi nhìn thấy quần của em gái rất bẩn nên giặt giúp nó, rồi giặt luôn cả quần áo.',
      },
      {
        ko: '晚上妹妹{{做作业}}，我{{玩游戏}}，爸爸{{看新闻}}。我在网上{{看到}}一个好消息，又{{听见}}妹妹在唱歌。她唱得{{那么}}好，真{{美}}！她是一个可爱的{{女}}孩子，最{{爱}}吃{{冰激凌}}。今天我终于{{买到}}了她最喜欢的冰激凌。',
        py: 'Wǎnshang mèimei zuò zuòyè, wǒ wán yóuxì, bàba kàn xīnwén. Wǒ zài wǎng shang kàndào yí ge hǎo xiāoxi, yòu tīngjiàn mèimei zài chànggē. Tā chàng de nàme hǎo, zhēn měi! Tā shì yí ge kě\'ài de nǚ háizi, zuì ài chī bīngjīlíng. Jīntiān wǒ zhōngyú mǎidào le tā zuì xǐhuan de bīngjīlíng.',
        vi: 'Buổi tối em gái làm bài tập, tôi chơi game, bố xem tin tức. Tôi đọc được một tin vui trên mạng, rồi lại nghe thấy em gái đang hát. Nó hát hay như thế, thật là đẹp! Nó là một cô bé đáng yêu, mê ăn kem nhất. Hôm nay cuối cùng tôi cũng mua được loại kem nó thích nhất.',
      },
      {
        ko: '我们家旁边有一座{{别墅}}，住着一位老画家。他的{{别号}}叫"山人"，画画有{{别才}}，属于一个很{{特别}}的{{别派}}。他说好画和坏画的{{差别}}很大，只有{{个别}}人能看懂。明天他要搬走了，我们去和他{{告别}}。{{分别}}的时候大家都很难过，{{别离}}总是让人伤心。',
        py: 'Wǒmen jiā pángbiān yǒu yí zuò biéshù, zhù zhe yí wèi lǎo huàjiā. Tā de biéhào jiào "Shānrén", huà huà yǒu biécái, shǔyú yí ge hěn tèbié de biépài. Tā shuō hǎo huà hé huài huà de chābié hěn dà, zhǐ yǒu gèbié rén néng kàn dǒng. Míngtiān tā yào bān zǒu le, wǒmen qù hé tā gàobié. Fēnbié de shíhou dàjiā dōu hěn nánguò, biélí zǒngshì ràng rén shāngxīn.',
        vi: 'Cạnh nhà tôi có một căn biệt thự, một họa sĩ già sống ở đó. Biệt hiệu của ông là "Sơn Nhân", ông có biệt tài vẽ tranh, thuộc một biệt phái rất đặc biệt. Ông nói sai biệt giữa tranh đẹp và tranh xấu rất lớn, chỉ cá biệt vài người mới hiểu được. Ngày mai ông chuyển đi, chúng tôi đến cáo biệt ông. Lúc chia tay (phân biệt) ai cũng buồn, biệt ly lúc nào cũng khiến người ta đau lòng.',
      },
    ],
  },

  15: {
    title: '她比我们小五岁',
    titleVi: 'Cô ấy kém chúng tôi năm tuổi',
    note: 'Dùng đủ 35 từ vựng và 6 ngữ pháp của bài: 的 (định ngữ là động từ), 是不是, 第, 可能, 能, 比.',
    paragraphs: [
      {
        ko: '今天公司来了一个新同事，她叫Hong。她{{比}}我们小五岁，{{非常}}{{年轻}}，也很{{漂亮}}。',
        py: 'Jīntiān gōngsī lái le yí ge xīn tóngshì, tā jiào Hong. Tā bǐ wǒmen xiǎo wǔ suì, fēicháng niánqīng, yě hěn piàoliang.',
        vi: 'Hôm nay công ty có một đồng nghiệp mới, tên là Hong. Cô ấy kém chúng tôi năm tuổi, vô cùng trẻ trung, cũng rất xinh đẹp.',
      },
      {
        ko: '"Hong，你是不是第一{{次}}来越南？"\n"是，这是我{{第一}}次来越南。"\n"{{欢迎}}你！{{咱们}}{{可能}}要一起工作很久呢。"',
        py: '"Hong, nǐ shì bu shì dì yī cì lái Yuènán?"\n"Shì, zhè shì wǒ dì yī cì lái Yuènán."\n"Huānyíng nǐ! Zánmen kěnéng yào yìqǐ gōngzuò hěn jiǔ ne."',
        vi: '"Hong, có phải lần đầu em đến Việt Nam không?"\n"Vâng, đây là lần đầu tiên em đến Việt Nam."\n"Chào mừng em! Có lẽ chúng ta sẽ làm việc cùng nhau lâu đấy."',
      },
      {
        ko: 'Hong以前在{{三星}}工作。她说："我{{希望}}{{能}}{{跟}}你们{{学习}}越南语。"我说："{{没问题}}！你现在就{{可以}}{{开始}}学。"',
        py: 'Hong yǐqián zài Sānxīng gōngzuò. Tā shuō: "Wǒ xīwàng néng gēn nǐmen xuéxí Yuènányǔ." Wǒ shuō: "Méi wèntí! Nǐ xiànzài jiù kěyǐ kāishǐ xué."',
        vi: 'Hong trước đây làm ở Samsung. Cô ấy nói: "Em hy vọng có thể học tiếng Việt với các anh chị." Tôi nói: "Không vấn đề gì! Em có thể bắt đầu học ngay bây giờ."',
      },
      {
        ko: '晚上我们一起去{{唱歌}}、{{跳舞}}。我们的{{大哥}}很{{高}}，Hong有点儿{{矮}}，可是她唱歌唱得最好，是{{第}}一名。',
        py: 'Wǎnshang wǒmen yìqǐ qù chànggē, tiàowǔ. Wǒmen de dàgē hěn gāo, Hong yǒudiǎnr ǎi, kěshì tā chànggē chàng de zuì hǎo, shì dì yī míng.',
        vi: 'Buổi tối chúng tôi cùng đi hát, khiêu vũ. Anh cả của nhóm rất cao, Hong hơi thấp, nhưng cô ấy hát hay nhất, đứng thứ nhất.',
      },
      {
        ko: '大哥说，以前他很{{胖}}，现在很{{瘦}}。他说："胖不{{难看}}，开心最重要！"那天的桌子太{{低}}了，大哥坐得很不舒服。',
        py: 'Dàgē shuō, yǐqián tā hěn pàng, xiànzài hěn shòu. Tā shuō: "Pàng bù nánkàn, kāixīn zuì zhòngyào!" Nà tiān de zhuōzi tài dī le, dàgē zuò de hěn bù shūfu.',
        vi: 'Anh cả nói trước đây anh rất béo, bây giờ thì rất gầy. Anh bảo: "Béo không xấu, vui vẻ mới quan trọng nhất!" Hôm đó cái bàn thấp quá, anh cả ngồi rất khó chịu.',
      },
      {
        ko: 'Hong有一个{{愿望}}：去越南很多地方旅游。她说，人要有{{期望}}，不要{{绝望}}，也不要{{失望}}。她非常{{渴望}}学好越南语，对未来的{{展望}}也很好。可是她说，人不能有太多{{欲望}}。"{{望}}"有"看"和"希望"的意思。',
        py: 'Hong yǒu yí ge yuànwàng: qù Yuènán hěn duō dìfang lǚyóu. Tā shuō, rén yào yǒu qīwàng, búyào juéwàng, yě búyào shīwàng. Tā fēicháng kěwàng xué hǎo Yuènányǔ, duì wèilái de zhǎnwàng yě hěn hǎo. Kěshì tā shuō, rén bù néng yǒu tài duō yùwàng. "Wàng" yǒu "kàn" hé "xīwàng" de yìsi.',
        vi: 'Hong có một nguyện vọng: đi du lịch thật nhiều nơi ở Việt Nam. Cô ấy nói con người phải có kỳ vọng, đừng tuyệt vọng, cũng đừng thất vọng. Cô ấy vô cùng khát vọng học giỏi tiếng Việt, triển vọng tương lai cũng rất tốt. Nhưng cô ấy bảo con người không nên có quá nhiều dục vọng. "Vọng" vừa có nghĩa "nhìn" vừa có nghĩa "hy vọng".',
      },
    ],
  },

  16: {
    title: '我在找房子',
    titleVi: 'Tôi đang tìm nhà',
    note: 'Dùng đủ 40 từ vựng và 6 ngữ pháp của bài: 得 (bổ ngữ trạng thái), 死了, 每, 因为…所以…, 得 (děi), 就 / 才.',
    paragraphs: [
      {
        ko: '最近我很{{忙}}，因为我在{{找}}{{房子}}。我现在{{住}}在学校的{{宿舍}}，可是明年{{得}}{{搬}}出去。',
        py: 'Zuìjìn wǒ hěn máng, yīnwèi wǒ zài zhǎo fángzi. Wǒ xiànzài zhù zài xuéxiào de sùshè, kěshì míngnián děi bān chūqu.',
        vi: 'Dạo này tôi rất bận vì đang tìm nhà. Hiện tôi sống ở ký túc xá của trường, nhưng sang năm phải chuyển ra ngoài.',
      },
      {
        ko: '找房子真不{{容易}}。我{{每}}天要看三个{{小时}}的房子，{{累}}{{死}}了！',
        py: 'Zhǎo fángzi zhēn bù róngyì. Wǒ měi tiān yào kàn sān ge xiǎoshí de fángzi, lèi sǐ le!',
        vi: 'Tìm nhà thật chẳng dễ dàng. Mỗi ngày tôi phải đi xem nhà ba tiếng đồng hồ, mệt chết đi được!',
      },
      {
        ko: '"你{{为什么}}不住{{楼房}}？"\n"{{因为}}楼房太贵，{{所以}}我想找一个{{平房}}或者小{{公寓}}。"',
        py: '"Nǐ wèishénme bú zhù lóufáng?"\n"Yīnwèi lóufáng tài guì, suǒyǐ wǒ xiǎng zhǎo yí ge píngfáng huòzhě xiǎo gōngyù."',
        vi: '"Sao cậu không ở nhà tầng?"\n"Vì nhà tầng đắt quá, nên tớ muốn tìm một căn nhà trệt hoặc một căn chung cư nhỏ."',
      },
      {
        ko: '昨天我去看了一个公寓。那座{{楼}}一共有二十{{层}}，公寓在十二楼。楼里有{{电梯}}，可是电梯坏了，我们只能走{{楼梯}}。我{{早}}上九点就出门了，{{晚}}上八点{{才}}回家，真{{辛苦}}！',
        py: 'Zuótiān wǒ qù kàn le yí ge gōngyù. Nà zuò lóu yígòng yǒu èrshí céng, gōngyù zài shí\'èr lóu. Lóu li yǒu diàntī, kěshì diàntī huài le, wǒmen zhǐ néng zǒu lóutī. Wǒ zǎoshang jiǔ diǎn jiù chūmén le, wǎnshang bā diǎn cái huí jiā, zhēn xīnkǔ!',
        vi: 'Hôm qua tôi đi xem một căn chung cư. Tòa nhà đó có tất cả hai mươi tầng, căn hộ ở tầng mười hai. Trong tòa nhà có thang máy nhưng thang máy hỏng, chúng tôi đành đi cầu thang bộ. Tôi ra khỏi nhà từ chín giờ sáng, tám giờ tối mới về đến nhà, vất vả thật!',
      },
      {
        ko: '我的{{男朋友}}{{常常}}帮我。他说话说{{得}}很{{好听}}："别着急，我们一起找。"',
        py: 'Wǒ de nánpéngyou chángcháng bāng wǒ. Tā shuōhuà shuō de hěn hǎotīng: "Bié zháojí, wǒmen yìqǐ zhǎo."',
        vi: 'Bạn trai tôi thường xuyên giúp tôi. Anh ấy nói chuyện rất dễ nghe: "Đừng lo, chúng mình cùng tìm."',
      },
      {
        ko: '{{当时}}我很着急。男朋友说："现在是网络{{时代}}，找房子要抓住{{时机}}。"他{{同时}}在网上帮我看了很多房子，有新消息就{{及时}}告诉我。最后我们找到了一个{{临时}}的地方，我{{暂时}}住在那儿。',
        py: 'Dāngshí wǒ hěn zháojí. Nánpéngyou shuō: "Xiànzài shì wǎngluò shídài, zhǎo fángzi yào zhuāzhù shíjī." Tā tóngshí zài wǎng shang bāng wǒ kàn le hěn duō fángzi, yǒu xīn xiāoxi jiù jíshí gàosu wǒ. Zuìhòu wǒmen zhǎodào le yí ge línshí de dìfang, wǒ zànshí zhù zài nàr.',
        vi: 'Lúc đó (đương thời) tôi rất sốt ruột. Bạn trai nói: "Bây giờ là thời đại internet, tìm nhà phải nắm lấy thời cơ." Anh ấy đồng thời giúp tôi xem rất nhiều nhà trên mạng, có tin mới là báo cho tôi kịp thời. Cuối cùng chúng tôi tìm được một chỗ ở lâm thời, tôi tạm thời ở đó.',
      },
      {
        ko: '他说，这是我们生活中一个特别的{{时期}}，每个{{时刻}}都很重要。有他在，{{时间}}过得真快。"{{时}}"就是"时间"的意思。',
        py: 'Tā shuō, zhè shì wǒmen shēnghuó zhōng yí ge tèbié de shíqī, měi ge shíkè dōu hěn zhòngyào. Yǒu tā zài, shíjiān guò de zhēn kuài. "Shí" jiù shì "shíjiān" de yìsi.',
        vi: 'Anh ấy nói đây là một thời kỳ đặc biệt trong cuộc sống của chúng tôi, mỗi thời khắc đều rất quan trọng. Có anh ấy bên cạnh, thời gian trôi qua thật nhanh. "Thời" chính là "thời gian".',
      },
    ],
  },

  17: {
    title: '今天早上就换好了',
    titleVi: 'Sáng nay đã đổi xong rồi',
    note: 'Dùng đủ 43 từ vựng và 5 ngữ pháp của bài: 以前, từ ly hợp, 哪, 好 / 完 (bổ ngữ kết quả), 一会儿 / 一下.',
    paragraphs: [
      {
        ko: '我的{{电脑}}{{坏}}了，不能{{上网}}，我很{{着急}}。\n"你能帮我{{修}}一下吗？要{{多长}}{{时间}}？"\n"{{一会儿}}就好，你{{放心}}吧！"',
        py: 'Wǒ de diànnǎo huài le, bù néng shàngwǎng, wǒ hěn zháojí.\n"Nǐ néng bāng wǒ xiū yíxià ma? Yào duō cháng shíjiān?"\n"Yíhuìr jiù hǎo, nǐ fàngxīn ba!"',
        vi: 'Máy tính của tôi hỏng rồi, không lên mạng được, tôi rất lo.\n"Anh sửa giúp tôi một chút được không? Mất bao lâu ạ?"\n"Một lát là xong, cứ yên tâm!"',
      },
      {
        ko: '修好以后，我{{用}}电脑上{{脸书}}、{{谷歌}}、{{微博}}和{{推特}}，还用手机上{{微信}}、{{淘宝}}、{{天猫}}和{{抖音}}。{{以前}}我每天上网五个小时，现在少多了。电脑后面的{{网}}线太{{长}}了，我换了一根短的。',
        py: 'Xiū hǎo yǐhòu, wǒ yòng diànnǎo shàng Liǎnshū, Gǔgē, Wēibó hé Tuītè, hái yòng shǒujī shàng Wēixìn, Táobǎo, Tiānmāo hé Dǒuyīn. Yǐqián wǒ měi tiān shàngwǎng wǔ ge xiǎoshí, xiànzài shǎo duō le. Diànnǎo hòumiàn de wǎngxiàn tài cháng le, wǒ huàn le yì gēn duǎn de.',
        vi: 'Sửa xong, tôi dùng máy tính vào Facebook, Google, Weibo và Twitter, còn dùng điện thoại vào WeChat, Taobao, Tmall và TikTok. Trước đây mỗi ngày tôi lên mạng năm tiếng, giờ thì ít hơn nhiều rồi. Dây mạng phía sau máy tính dài quá, tôi đổi một sợi ngắn hơn.',
      },
      {
        ko: '上个月我去旅行，住在一家宾馆。那天晚上我{{忘}}了{{带}}{{钥匙}}，服务员来帮我{{开门}}。{{房间}}里的{{空调}}也坏了，{{床单}}还很{{脏}}。',
        py: 'Shàng ge yuè wǒ qù lǚxíng, zhù zài yì jiā bīnguǎn. Nà tiān wǎnshang wǒ wàng le dài yàoshi, fúwùyuán lái bāng wǒ kāimén. Fángjiān li de kōngtiáo yě huài le, chuángdān hái hěn zāng.',
        vi: 'Tháng trước tôi đi du lịch, ở một khách sạn. Tối hôm đó tôi quên mang chìa khóa, nhân viên phải đến mở cửa giúp. Điều hòa trong phòng cũng hỏng, ga trải giường lại còn bẩn.',
      },
      {
        ko: '我问服务员："{{哪}}个房间的空调是好的？"\n她说："对不起，明天给您{{换}}一个房间。"\n今天早上就换好了。晚上我在新房间里唱了一{{首}}歌，{{唱歌}}、{{跳舞}}以后，很快就{{睡觉}}了。',
        py: 'Wǒ wèn fúwùyuán: "Nǎ ge fángjiān de kōngtiáo shì hǎo de?"\nTā shuō: "Duìbuqǐ, míngtiān gěi nín huàn yí ge fángjiān."\nJīntiān zǎoshang jiù huàn hǎo le. Wǎnshang wǒ zài xīn fángjiān li chàng le yì shǒu gē, chànggē, tiàowǔ yǐhòu, hěn kuài jiù shuìjiào le.',
        vi: 'Tôi hỏi nhân viên: "Phòng nào điều hòa còn tốt?"\nCô ấy nói: "Xin lỗi, ngày mai sẽ đổi phòng khác cho anh."\nSáng nay đã đổi xong rồi. Buổi tối tôi hát một bài trong phòng mới, hát hò nhảy nhót xong là ngủ ngay.',
      },
      {
        ko: '我觉得电脑很{{实用}}，{{作用}}很大。现在电脑和手机的{{应用}}很多，{{使用}}也很{{通用}}。我们要好好{{运用}}和{{利用}}网络，也要注意网上的{{信用}}。',
        py: 'Wǒ juéde diànnǎo hěn shíyòng, zuòyòng hěn dà. Xiànzài diànnǎo hé shǒujī de yìngyòng hěn duō, shǐyòng yě hěn tōngyòng. Wǒmen yào hǎohāo yùnyòng hé lìyòng wǎngluò, yě yào zhùyì wǎng shang de xìnyòng.',
        vi: 'Tôi thấy máy tính rất thực dụng (hữu ích), tác dụng rất lớn. Bây giờ ứng dụng trên máy tính và điện thoại rất nhiều, cách sử dụng cũng rất thông dụng. Chúng ta phải vận dụng và lợi dụng (tận dụng) internet cho tốt, cũng phải chú ý giữ tín dụng (uy tín) trên mạng.',
      },
    ],
  },

  18: {
    title: '我紧张地骑着自行车去她家',
    titleVi: 'Tôi hồi hộp đạp xe đến nhà cô ấy',
    note: 'Dùng đủ 40 từ vựng và 4 ngữ pháp của bài: 看起来, 着, 地, ……的时候.',
    paragraphs: [
      {
        ko: '{{上个星期}}我在路上看见一个{{姑娘}}，{{看起来}}很{{漂亮}}。她{{手}}里{{拿}}{{着}}一本{{词典}}和一支{{铅笔}}。原来她是我的{{前女友}}！',
        py: 'Shàng ge xīngqī wǒ zài lù shang kànjiàn yí ge gūniang, kàn qǐlái hěn piàoliang. Tā shǒu li ná zhe yì běn cídiǎn hé yì zhī qiānbǐ. Yuánlái tā shì wǒ de qián nǚyǒu!',
        vi: 'Tuần trước tôi nhìn thấy một cô gái trên đường, trông rất xinh. Cô ấy cầm trong tay một quyển từ điển và một cây bút chì. Hóa ra đó là bạn gái cũ của tôi!',
      },
      {
        ko: '"{{好久不见}}！"她笑着说。\n"是啊，好{{久}}没见了！"',
        py: '"Hǎojiǔ bú jiàn!" Tā xiào zhe shuō.\n"Shì a, hǎo jiǔ méi jiàn le!"',
        vi: '"Lâu lắm không gặp!" Cô ấy cười nói.\n"Ừ, lâu lắm rồi không gặp!"',
      },
      {
        ko: '她说她{{明年}}要结婚了，请我去她家玩儿。那天我{{紧张}}{{地}}骑着自行车去她家。我到的{{时候}}，她家的{{门}}开着。',
        py: 'Tā shuō tā míngnián yào jiéhūn le, qǐng wǒ qù tā jiā wánr. Nà tiān wǒ jǐnzhāng de qí zhe zìxíngchē qù tā jiā. Wǒ dào de shíhou, tā jiā de mén kāi zhe.',
        vi: 'Cô ấy nói sang năm sẽ kết hôn, mời tôi đến nhà chơi. Hôm đó tôi hồi hộp đạp xe đến nhà cô ấy. Lúc tôi đến, cửa nhà cô ấy đang mở.',
      },
      {
        ko: '她家很漂亮，{{不过}}有点儿乱：书{{放}}在{{椅子}}上，她弟弟{{躺}}在沙发上看{{足球赛}}。',
        py: 'Tā jiā hěn piàoliang, búguò yǒudiǎnr luàn: shū fàng zài yǐzi shang, tā dìdi tǎng zài shāfā shang kàn zúqiúsài.',
        vi: 'Nhà cô ấy rất đẹp, nhưng hơi bừa: sách để trên ghế, em trai cô ấy nằm trên sofa xem trận bóng đá.',
      },
      {
        ko: '她的男朋友{{站}}在门口，{{背}}着一个大包。他{{跑}}过来{{抱}}了她一下，还{{吻}}了她。他们把很多花{{摆}}在桌子上。听说他求婚的时候还{{跪}}了下来！我笑着{{关}}上门，走了。',
        py: 'Tā de nánpéngyou zhàn zài ménkǒu, bēi zhe yí ge dà bāo. Tā pǎo guòlai bào le tā yíxià, hái wěn le tā. Tāmen bǎ hěn duō huā bǎi zài zhuōzi shang. Tīngshuō tā qiúhūn de shíhou hái guì le xiàlai! Wǒ xiào zhe guān shàng mén, zǒu le.',
        vi: 'Bạn trai cô ấy đứng ở cửa, đeo một chiếc ba lô to. Anh ấy chạy lại ôm cô ấy một cái, còn hôn cô ấy. Họ bày rất nhiều hoa lên bàn. Nghe nói lúc cầu hôn anh ấy còn quỳ xuống! Tôi mỉm cười đóng cửa lại rồi đi.',
      },
      {
        ko: '她的男朋友是足球{{选手}}，比赛的时候{{对手}}都很怕他。他也是医生的{{助手}}，会做小{{手术}}，{{手法}}很好，还喜欢做{{手工}}。有一次，他看见一个{{凶手}}想{{动手}}打人，就用了一个好{{手段}}把他抓住了。结婚要办很多{{手续}}，祝他们幸福！',
        py: 'Tā de nánpéngyou shì zúqiú xuǎnshǒu, bǐsài de shíhou duìshǒu dōu hěn pà tā. Tā yě shì yīshēng de zhùshǒu, huì zuò xiǎo shǒushù, shǒufǎ hěn hǎo, hái xǐhuan zuò shǒugōng. Yǒu yí cì, tā kànjiàn yí ge xiōngshǒu xiǎng dòngshǒu dǎ rén, jiù yòng le yí ge hǎo shǒuduàn bǎ tā zhuāzhù le. Jiéhūn yào bàn hěn duō shǒuxù, zhù tāmen xìngfú!',
        vi: 'Bạn trai cô ấy là tuyển thủ bóng đá, lúc thi đấu đối thủ nào cũng sợ anh ấy. Anh còn là trợ thủ của bác sĩ, biết làm tiểu phẫu (thủ thuật), thủ pháp rất khéo, lại thích làm đồ thủ công. Có lần anh thấy một hung thủ định động thủ đánh người, liền dùng một thủ đoạn hay để bắt hắn lại. Kết hôn phải làm nhiều thủ tục lắm, chúc họ hạnh phúc!',
      },
    ],
  },

  19: {
    title: '你去过中国吗？',
    titleVi: 'Bạn đã từng đến Trung Quốc chưa?',
    note: 'Dùng đủ 39 từ vựng và 5 ngữ pháp của bài: 不是……吗？, 过, 才 (chỉ mới), bổ ngữ động lượng, số ước lượng.',
    paragraphs: [
      {
        ko: '"你去{{过}}中国吗？"\n"去过。{{去年}}我去过两次。我喜欢{{旅游}}，每{{年}}都去一个{{不同}}的{{国家}}。"',
        py: '"Nǐ qù guo Zhōngguó ma?"\n"Qù guo. Qùnián wǒ qù guo liǎng cì. Wǒ xǐhuan lǚyóu, měi nián dōu qù yí ge bù tóng de guójiā."',
        vi: '"Bạn đã từng đến Trung Quốc chưa?"\n"Rồi. Năm ngoái mình đi hai lần. Mình thích du lịch, năm nào cũng đi một nước khác nhau."',
      },
      {
        ko: '"中国{{北方}}冬天常常{{下雪}}，{{特别}}冷。你不是怕冷吗？"\n"是啊，{{可是}}雪真美！"',
        py: '"Zhōngguó běifāng dōngtiān chángcháng xiàxuě, tèbié lěng. Nǐ bú shì pà lěng ma?"\n"Shì a, kěshì xuě zhēn měi!"',
        vi: '"Miền Bắc Trung Quốc mùa đông hay có tuyết, lạnh đặc biệt. Chẳng phải bạn sợ lạnh sao?"\n"Đúng vậy, nhưng tuyết đẹp thật!"',
      },
      {
        ko: '去旅游以前要做很多事：{{请假}}、{{办护照}}、{{办签证}}、{{买机票}}、{{预订酒店}}、{{换钱}}，还要{{收拾行李}}。',
        py: 'Qù lǚyóu yǐqián yào zuò hěn duō shì: qǐngjià, bàn hùzhào, bàn qiānzhèng, mǎi jīpiào, yùdìng jiǔdiàn, huànqián, hái yào shōushi xíngli.',
        vi: 'Trước khi đi du lịch phải làm rất nhiều việc: xin nghỉ phép, làm hộ chiếu, xin visa, mua vé máy bay, đặt khách sạn, đổi tiền, còn phải thu dọn hành lý.',
      },
      {
        ko: '这次我坐{{飞机}}去北京，从{{机场}}坐{{出租车}}去{{宾馆}}。宾馆是我在网上{{订}}的。司机不会说{{英语}}，我只好说汉语。我在北京才玩了三四天，又坐{{火车}}去了上海。',
        py: 'Zhè cì wǒ zuò fēijī qù Běijīng, cóng jīchǎng zuò chūzūchē qù bīnguǎn. Bīnguǎn shì wǒ zài wǎng shang dìng de. Sījī bú huì shuō Yīngyǔ, wǒ zhǐhǎo shuō Hànyǔ. Wǒ zài Běijīng cái wán le sān sì tiān, yòu zuò huǒchē qù le Shànghǎi.',
        vi: 'Lần này mình đi máy bay đến Bắc Kinh, từ sân bay bắt taxi về khách sạn. Khách sạn là mình đặt trên mạng. Tài xế không biết nói tiếng Anh, mình đành nói tiếng Trung. Mình mới chơi ở Bắc Kinh được ba bốn ngày lại đi tàu hỏa sang Thượng Hải.',
      },
      {
        ko: '我喜欢{{自由行}}，不喜欢{{跟团游}}。在路上我常常{{查地图}}、{{拍照}}，还{{买纪念品}}送朋友。',
        py: 'Wǒ xǐhuan zìyóuxíng, bù xǐhuan gēntuányóu. Zài lù shang wǒ chángcháng chá dìtú, pāizhào, hái mǎi jìniànpǐn sòng péngyou.',
        vi: 'Mình thích du lịch tự túc, không thích đi theo đoàn. Trên đường mình hay tra bản đồ, chụp ảnh, còn mua quà lưu niệm tặng bạn bè.',
      },
      {
        ko: '每个{{地方}}都有自己的特色。在很多{{方面}}，中国和越南很像，比如生活{{方式}}。我常常走错{{方向}}，所以出发前要做好{{方案}}，找到好的{{方法}}。在博物馆，我还看到一块一{{立方}}米大的石头。',
        py: 'Měi ge dìfang dōu yǒu zìjǐ de tèsè. Zài hěn duō fāngmiàn, Zhōngguó hé Yuènán hěn xiàng, bǐrú shēnghuó fāngshì. Wǒ chángcháng zǒu cuò fāngxiàng, suǒyǐ chūfā qián yào zuò hǎo fāng\'àn, zhǎodào hǎo de fāngfǎ. Zài bówùguǎn, wǒ hái kàndào yí kuài yí lìfāng mǐ dà de shítou.',
        vi: 'Mỗi địa phương đều có nét đặc sắc riêng. Về nhiều phương diện, Trung Quốc và Việt Nam rất giống nhau, ví dụ như phương thức sinh hoạt. Mình hay đi nhầm phương hướng, nên trước khi xuất phát phải lập phương án, tìm phương pháp tốt. Ở bảo tàng, mình còn thấy một tảng đá to cả mét khối (lập phương).',
      },
      {
        ko: '我有一个中国朋友，{{对方}}教我汉语，我教他越南语，{{双方}}都进步了。"{{方}}"这个字用得真多！',
        py: 'Wǒ yǒu yí ge Zhōngguó péngyou, duìfāng jiāo wǒ Hànyǔ, wǒ jiāo tā Yuènányǔ, shuāngfāng dōu jìnbù le. "Fāng" zhège zì yòng de zhēn duō!',
        vi: 'Mình có một người bạn Trung Quốc, đối phương dạy mình tiếng Trung, mình dạy bạn ấy tiếng Việt, song phương đều tiến bộ. Chữ "phương" này được dùng nhiều thật!',
      },
    ],
  },

  20: {
    title: '都九点了，怎么还没来上课？',
    titleVi: 'Đã chín giờ rồi, sao vẫn chưa đến lớp?',
    note: 'Dùng đủ 40 từ vựng và 3 ngữ pháp của bài: 都……了, 怎么 (hỏi nguyên nhân), 一……就…….',
    paragraphs: [
      {
        ko: '都九点了，Ming怎么还没来上课？老师给他妈妈打电话。\n"{{您}}好，Ming今天怎么没来？"\n"对不起，老师，他{{生病}}了。昨天他去{{游泳}}，喝了很多{{水}}，晚上一回家就{{发烧}}了。"',
        py: 'Dōu jiǔ diǎn le, Ming zěnme hái méi lái shàngkè? Lǎoshī gěi tā māma dǎ diànhuà.\n"Nín hǎo, Ming jīntiān zěnme méi lái?"\n"Duìbuqǐ, lǎoshī, tā shēngbìng le. Zuótiān tā qù yóuyǒng, hē le hěn duō shuǐ, wǎnshang yì huí jiā jiù fāshāo le."',
        vi: 'Đã chín giờ rồi, sao Ming vẫn chưa đến lớp? Cô giáo gọi điện cho mẹ cậu bé.\n"Chào chị, sao hôm nay Ming không đến lớp ạ?"\n"Xin lỗi cô, cháu bị ốm rồi. Hôm qua cháu đi bơi, uống phải nhiều nước, tối vừa về nhà là sốt."',
      },
      {
        ko: '妈妈带Ming去医院{{看病}}。{{医生}}问："哪儿不舒服？"\nMing说："我{{头}}{{疼}}，{{咳嗽}}，{{嗓子疼}}，还{{流鼻涕}}。"\n医生给他{{量}}了{{体温}}：三十九度。医生说："是{{感冒}}，不是大{{病}}。"',
        py: 'Māma dài Ming qù yīyuàn kànbìng. Yīshēng wèn: "Nǎr bù shūfu?"\nMing shuō: "Wǒ tóu téng, késou, sǎngzi téng, hái liú bítì."\nYīshēng gěi tā liáng le tǐwēn: sānshíjiǔ dù. Yīshēng shuō: "Shì gǎnmào, bú shì dà bìng."',
        vi: 'Mẹ đưa Ming đến bệnh viện khám bệnh. Bác sĩ hỏi: "Cháu khó chịu ở đâu?"\nMing nói: "Cháu đau đầu, ho, đau họng, còn sổ mũi nữa."\nBác sĩ đo thân nhiệt cho cậu bé: ba mươi chín độ. Bác sĩ nói: "Là cảm thôi, không phải bệnh nặng."',
      },
      {
        ko: '医生又问："你{{肚子疼}}吗？{{胃疼}}吗？{{头晕}}吗？"Ming说都不疼，也不晕。医生给他{{开药}}："这{{种}}药一天吃三次，每次两{{片}}。"Ming最怕{{打针}}，一听不用打针就笑了。',
        py: 'Yīshēng yòu wèn: "Nǐ dùzi téng ma? Wèi téng ma? Tóuyūn ma?" Ming shuō dōu bù téng, yě bù yūn. Yīshēng gěi tā kāi yào: "Zhè zhǒng yào yì tiān chī sān cì, měi cì liǎng piàn." Ming zuì pà dǎzhēn, yì tīng búyòng dǎzhēn jiù xiào le.',
        vi: 'Bác sĩ lại hỏi: "Cháu có đau bụng không? Đau dạ dày không? Có chóng mặt không?" Ming nói đều không đau, cũng không chóng mặt. Bác sĩ kê đơn thuốc: "Loại thuốc này ngày uống ba lần, mỗi lần hai viên." Ming sợ nhất là tiêm, vừa nghe không phải tiêm là cười ngay.',
      },
      {
        ko: '回到家，爸爸、他的{{妻子}}和Ming的{{弟弟}}都在等他们。爸爸听了医生的{{介绍}}，说Ming的{{眼睛}}也有点儿红，要多休息。他没{{想到}}孩子会病得{{这么}}厉害，告诉{{孩子}}以后要学会照顾{{自己}}。',
        py: 'Huí dào jiā, bàba, tā de qīzi hé Ming de dìdi dōu zài děng tāmen. Bàba tīng le yīshēng de jièshào, shuō Ming de yǎnjing yě yǒudiǎnr hóng, yào duō xiūxi. Tā méi xiǎngdào háizi huì bìng de zhème lìhai, gàosu háizi yǐhòu yào xuéhuì zhàogù zìjǐ.',
        vi: 'Về đến nhà, bố, vợ của bố (mẹ Ming) và em trai Ming đều đang chờ. Bố nghe kể lại lời bác sĩ giới thiệu, thấy mắt Ming cũng hơi đỏ, bảo phải nghỉ ngơi nhiều. Bố không ngờ con lại ốm nặng thế này, dặn con sau này phải biết tự chăm sóc bản thân.',
      },
      {
        ko: '一年后，Ming{{变}}了很多：身体好了，学习态度也{{改变}}了。妈妈说孩子的{{变化}}真大，是一个好的{{转变}}。生活中会有很多{{变故}}和{{变迁}}，可是妈妈对孩子的爱永远{{不变}}。',
        py: 'Yì nián hòu, Ming biàn le hěn duō: shēntǐ hǎo le, xuéxí tàidu yě gǎibiàn le. Māma shuō háizi de biànhuà zhēn dà, shì yí ge hǎo de zhuǎnbiàn. Shēnghuó zhōng huì yǒu hěn duō biàngù hé biànqiān, kěshì māma duì háizi de ài yǒngyuǎn búbiàn.',
        vi: 'Một năm sau, Ming thay đổi rất nhiều: sức khỏe tốt lên, thái độ học tập cũng cải biến. Mẹ nói con biến hóa (thay đổi) nhiều thật, là một chuyển biến tốt. Cuộc sống sẽ có nhiều biến cố và biến thiên, nhưng tình yêu của mẹ dành cho con thì mãi bất biến.',
      },
      {
        ko: '老师上课的时候说，汉字的样子也在慢慢{{演变}}。她还提醒大家：天热的时候，食物很容易{{变质}}，不要吃。',
        py: 'Lǎoshī shàngkè de shíhou shuō, Hànzì de yàngzi yě zài mànmàn yǎnbiàn. Tā hái tíxǐng dàjiā: tiān rè de shíhou, shíwù hěn róngyì biànzhì, búyào chī.',
        vi: 'Lúc lên lớp, cô giáo nói hình dạng chữ Hán cũng đang dần diễn biến (thay đổi). Cô còn nhắc mọi người: lúc trời nóng thức ăn rất dễ biến chất, đừng ăn.',
      },
    ],
  },

  21: {
    title: '我要买两张去广州的票',
    titleVi: 'Tôi muốn mua hai vé đi Quảng Châu',
    note: 'Dùng đủ 35 từ vựng và 4 ngữ pháp của bài: 虽然……但是……, ……以内, 多 (ước lượng), 应该.',
    paragraphs: [
      {
        ko: '"你好，我要买两张去{{广州}}的票。"\n"{{高铁}}票已经{{卖}}完了，还有{{快速}}火车的票。"\n"{{虽然}}快速火车慢一点儿，{{但是}}{{价格}}便宜，那就买快速的吧。"',
        py: '"Nǐ hǎo, wǒ yào mǎi liǎng zhāng qù Guǎngzhōu de piào."\n"Gāotiě piào yǐjīng mài wán le, hái yǒu kuàisù huǒchē de piào."\n"Suīrán kuàisù huǒchē màn yìdiǎnr, dànshì jiàgé piányi, nà jiù mǎi kuàisù de ba."',
        vi: '"Chào chị, tôi muốn mua hai vé đi Quảng Châu."\n"Vé tàu cao tốc đã bán hết rồi, chỉ còn vé tàu nhanh."\n"Tàu nhanh tuy chậm hơn một chút nhưng giá rẻ, vậy mua tàu nhanh vậy."',
      },
      {
        ko: '"这{{趟}}车几点{{开}}？"\n"早上七点{{出发}}，晚上九点{{到达}}。有{{硬座}}和{{软座}}。"\n"要两张软座。"',
        py: '"Zhè tàng chē jǐ diǎn kāi?"\n"Zǎoshang qī diǎn chūfā, wǎnshang jiǔ diǎn dàodá. Yǒu yìngzuò hé ruǎnzuò."\n"Yào liǎng zhāng ruǎnzuò."',
        vi: '"Chuyến này mấy giờ chạy?"\n"Bảy giờ sáng xuất phát, chín giờ tối đến nơi. Có ghế cứng và ghế mềm."\n"Cho tôi hai vé ghế mềm."',
      },
      {
        ko: '"三天{{以内}}可以退票吗？"\n"可以。你们{{应该}}早点儿{{预订}}，这个季节坐车的人很多。"',
        py: '"Sān tiān yǐnèi kěyǐ tuì piào ma?"\n"Kěyǐ. Nǐmen yīnggāi zǎo diǎnr yùdìng, zhège jìjié zuò chē de rén hěn duō."',
        vi: '"Trong vòng ba ngày có trả vé được không?"\n"Được. Lần sau anh chị nên đặt trước sớm hơn, mùa này người đi tàu rất đông."',
      },
      {
        ko: '回到家，我朋友说她有{{急事}}，得坐飞机去北京。我说："我{{帮忙}}给你{{查}}一下吧。"真{{巧}}，晚上八点有一趟飞机{{起飞}}，可是只有{{头等舱}}和{{商务舱}}，没有{{经济舱}}了。',
        py: 'Huí dào jiā, wǒ péngyou shuō tā yǒu jíshì, děi zuò fēijī qù Běijīng. Wǒ shuō: "Wǒ bāngmáng gěi nǐ chá yíxià ba." Zhēn qiǎo, wǎnshang bā diǎn yǒu yí tàng fēijī qǐfēi, kěshì zhǐ yǒu tóuděngcāng hé shāngwùcāng, méiyǒu jīngjìcāng le.',
        vi: 'Về đến nhà, bạn tôi nói có việc gấp, phải đi máy bay ra Bắc Kinh. Tôi nói: "Để mình giúp tra thử cho." Thật đúng lúc, tám giờ tối có một chuyến bay cất cánh, nhưng chỉ còn khoang hạng nhất và khoang thương gia, hết khoang phổ thông rồi.',
      },
      {
        ko: '飞机上的{{空姐}}很热情。飞机{{正点}}起飞，一点儿也没{{晚点}}，她两个多小时就到了北京。',
        py: 'Fēijī shang de kōngjiě hěn rèqíng. Fēijī zhèngdiǎn qǐfēi, yìdiǎnr yě méi wǎndiǎn, tā liǎng ge duō xiǎoshí jiù dào le Běijīng.',
        vi: 'Tiếp viên trên máy bay rất nhiệt tình. Máy bay cất cánh đúng giờ, không trễ chút nào, hơn hai tiếng là cô ấy đã đến Bắc Kinh.',
      },
      {
        ko: '朋友去北京还有一个{{动机}}：去看熊猫。熊猫是一种很可爱的{{动物}}，吃饱了就躺着不{{动}}。朋友做事很{{主动}}，每天早上都去{{运动}}，她说健康是她的{{动力}}。那天夜里她听到外面有{{动静}}，原来是一只小猫。她给我讲的故事很{{生动}}，让我很{{感动}}。',
        py: 'Péngyou qù Běijīng hái yǒu yí ge dòngjī: qù kàn xióngmāo. Xióngmāo shì yì zhǒng hěn kě\'ài de dòngwù, chī bǎo le jiù tǎng zhe bú dòng. Péngyou zuò shì hěn zhǔdòng, měi tiān zǎoshang dōu qù yùndòng, tā shuō jiànkāng shì tā de dònglì. Nà tiān yèli tā tīngdào wàimiàn yǒu dòngjing, yuánlái shì yì zhī xiǎo māo. Tā gěi wǒ jiǎng de gùshi hěn shēngdòng, ràng wǒ hěn gǎndòng.',
        vi: 'Bạn tôi đi Bắc Kinh còn một động cơ nữa: đi xem gấu trúc. Gấu trúc là một loài động vật rất đáng yêu, ăn no là nằm im không động đậy. Bạn tôi làm việc gì cũng chủ động, sáng nào cũng đi vận động (tập thể dục), cô ấy nói sức khỏe là động lực của mình. Đêm hôm đó cô ấy nghe bên ngoài có động tĩnh, hóa ra là một chú mèo con. Câu chuyện cô ấy kể rất sinh động, khiến tôi rất cảm động.',
      },
    ],
  },

  22: {
    title: '一间单人房三百块一天',
    titleVi: 'Một phòng đơn ba trăm tệ một ngày',
    note: 'Dùng đủ 45 từ vựng và 4 ngữ pháp của bài: 从……起, 吧 (2), 一……也 / 都 + 不, bổ ngữ xu hướng đơn.',
    paragraphs: [
      {
        ko: '{{玛丽}}来到{{黄河}}{{酒店}}。{{前台}}的服务员说："欢迎光临！请问几{{位}}？"\n"两位。有{{标准}}{{双人间}}吗？"',
        py: 'Mǎlì lái dào Huánghé Jiǔdiàn. Qiántái de fúwùyuán shuō: "Huānyíng guānglín! Qǐngwèn jǐ wèi?"\n"Liǎng wèi. Yǒu biāozhǔn shuāngrénjiān ma?"',
        vi: 'Mary đến khách sạn Hoàng Hà. Nhân viên lễ tân nói: "Chào mừng quý khách! Xin hỏi đi mấy người ạ?"\n"Hai người. Còn phòng đôi tiêu chuẩn không?"',
      },
      {
        ko: '"{{不好意思}}，双人间一{{间}}{{空}}房也没有了，只有大床房。"\n"那就要一间{{大床间}}吧。我们{{从}}今天{{起}}{{入住}}三天。"',
        py: '"Bù hǎoyìsi, shuāngrénjiān yì jiān kòng fáng yě méiyǒu le, zhǐ yǒu dàchuángfáng."\n"Nà jiù yào yì jiān dàchuángjiān ba. Wǒmen cóng jīntiān qǐ rùzhù sān tiān."',
        vi: '"Ngại quá, phòng đôi không còn một phòng trống nào, chỉ còn phòng giường lớn."\n"Vậy lấy một phòng giường lớn nhé. Chúng tôi nhận phòng ba ngày bắt đầu từ hôm nay."',
      },
      {
        ko: '"房间{{有窗户}}吗？有{{无线网}}吗？"\n"有，无线网是{{免费}}的。房间里都{{禁烟}}，{{洗手间}}在房间里。我们还有{{洗衣服务}}和{{接送机场}}服务。"\n"如果要{{取消}}呢？"\n"明天中午以前可以免费取消。{{退房}}时间是中午十二点。"',
        py: '"Fángjiān yǒu chuānghu ma? Yǒu wúxiànwǎng ma?"\n"Yǒu, wúxiànwǎng shì miǎnfèi de. Fángjiān li dōu jìnyān, xǐshǒujiān zài fángjiān li. Wǒmen hái yǒu xǐyī fúwù hé jiēsòng jīchǎng fúwù."\n"Rúguǒ yào qǔxiāo ne?"\n"Míngtiān zhōngwǔ yǐqián kěyǐ miǎnfèi qǔxiāo. Tuìfáng shíjiān shì zhōngwǔ shí\'èr diǎn."',
        vi: '"Phòng có cửa sổ không? Có Wi-Fi không?"\n"Có, Wi-Fi miễn phí. Các phòng đều cấm hút thuốc, nhà vệ sinh ở trong phòng. Khách sạn còn có dịch vụ giặt ủi và đưa đón sân bay."\n"Nếu muốn hủy phòng thì sao?"\n"Trước trưa mai có thể hủy miễn phí. Giờ trả phòng là mười hai giờ trưa."',
      },
      {
        ko: '"请给我看一下您的{{护照}}，再{{填}}一张{{表}}。"\n玛丽填好表，服务员给了她{{房卡}}，还说了一{{句}}："祝您住得愉快！"',
        py: '"Qǐng gěi wǒ kàn yíxià nín de hùzhào, zài tián yì zhāng biǎo."\nMǎlì tián hǎo biǎo, fúwùyuán gěi le tā fángkǎ, hái shuō le yí jù: "Zhù nín zhù de yúkuài!"',
        vi: '"Xin cho tôi xem hộ chiếu của chị, rồi điền một tờ đơn."\nMary điền xong, nhân viên đưa cho cô thẻ phòng, còn nói thêm một câu: "Chúc chị ở vui vẻ!"',
      },
      {
        ko: '玛丽拿着{{行李}}坐{{电梯}}{{上}}去。到了房间，她{{进}}去放好行李，喝了一{{杯}}茶，然后{{下}}楼吃饭。吃完饭她{{出}}去散步，走{{过}}一座小桥，九点才{{回}}来。第二天早上她六点就{{起}}来了。',
        py: 'Mǎlì ná zhe xíngli zuò diàntī shàngqu. Dào le fángjiān, tā jìnqu fàng hǎo xíngli, hē le yì bēi chá, ránhòu xià lóu chī fàn. Chī wán fàn tā chūqu sànbù, zǒu guò yí zuò xiǎo qiáo, jiǔ diǎn cái huílai. Dì èr tiān zǎoshang tā liù diǎn jiù qǐlai le.',
        vi: 'Mary xách hành lý đi thang máy lên. Đến phòng, cô đi vào cất hành lý, uống một cốc trà rồi xuống tầng ăn tối. Ăn xong cô ra ngoài đi dạo, đi qua một cây cầu nhỏ, chín giờ mới về. Sáng hôm sau sáu giờ cô đã dậy rồi.',
      },
      {
        ko: '晚上酒店有{{表演}}。演员{{表现}}得很好，玛丽用掌声{{表示}}喜欢。她不太会用汉语{{表达}}，可是脸上{{表露}}出很高兴的样子。经理{{表扬}}了演员们，还说下个月的节目要大家一起{{表决}}。玛丽一边吃苹果一边看表演——她说苹果的{{表皮}}最有营养。',
        py: 'Wǎnshang jiǔdiàn yǒu biǎoyǎn. Yǎnyuán biǎoxiàn de hěn hǎo, Mǎlì yòng zhǎngshēng biǎoshì xǐhuan. Tā bú tài huì yòng Hànyǔ biǎodá, kěshì liǎn shang biǎolù chū hěn gāoxìng de yàngzi. Jīnglǐ biǎoyáng le yǎnyuánmen, hái shuō xià ge yuè de jiémù yào dàjiā yìqǐ biǎojué. Mǎlì yìbiān chī píngguǒ yìbiān kàn biǎoyǎn — tā shuō píngguǒ de biǎopí zuì yǒu yíngyǎng.',
        vi: 'Buổi tối khách sạn có biểu diễn. Diễn viên biểu hiện rất tốt, Mary vỗ tay để biểu thị sự yêu thích. Cô chưa giỏi biểu đạt bằng tiếng Trung nhưng nét mặt biểu lộ rõ vẻ rất vui. Quản lý biểu dương các diễn viên, còn nói chương trình tháng sau sẽ để mọi người cùng biểu quyết. Mary vừa ăn táo vừa xem biểu diễn — cô bảo lớp vỏ (biểu bì) quả táo là bổ nhất.',
      },
    ],
  },

  23: {
    title: '年轻人得多运动运动',
    titleVi: 'Người trẻ phải vận động nhiều vào',
    note: 'Dùng đủ 39 từ vựng và 4 ngữ pháp của bài: 哪有时间, 不是A就是B, 再 (thời gian + 再 + động từ), 叫 (câu kiêm ngữ).',
    paragraphs: [
      {
        ko: '我{{老婆}}说："你太{{胖}}了，得多{{运动}}运动！"\n我说："我每天都上班，哪有时间运动？"\n"{{人家}}Li先生比你忙，每天早上都去{{跑步}}。"',
        py: 'Wǒ lǎopo shuō: "Nǐ tài pàng le, děi duō yùndòng yùndòng!"\nWǒ shuō: "Wǒ měi tiān dōu shàngbān, nǎ yǒu shíjiān yùndòng?"\n"Rénjia Li xiānsheng bǐ nǐ máng, měi tiān zǎoshang dōu qù pǎobù."',
        vi: 'Bà xã tôi nói: "Anh béo quá rồi, phải vận động nhiều vào!"\nTôi nói: "Ngày nào anh cũng đi làm, lấy đâu ra thời gian mà vận động?"\n"Người ta anh Li còn bận hơn anh, sáng nào cũng đi chạy bộ."',
      },
      {
        ko: '我们的{{儿子}}在{{学校}}也不爱运动。下个月他要{{考试}}了，{{整天}}在家{{复习}}{{英语}}，不是看书就是玩手机。',
        py: 'Wǒmen de érzi zài xuéxiào yě bú ài yùndòng. Xià ge yuè tā yào kǎoshì le, zhěngtiān zài jiā fùxí Yīngyǔ, bú shì kàn shū jiù shì wán shǒujī.',
        vi: 'Con trai chúng tôi ở trường cũng không thích vận động. Tháng sau nó phải thi rồi, cả ngày ở nhà ôn tiếng Anh, không đọc sách thì cũng chơi điện thoại.',
      },
      {
        ko: '老婆{{叫}}我们去{{外面}}运动。她说："你们还{{年轻}}，{{不如}}去{{试}}一下。"我{{觉得}}{{跑}}一千{{米}}太累了，儿子说："那我们去{{打篮球}}或者{{踢足球}}吧。"',
        py: 'Lǎopo jiào wǒmen qù wàimiàn yùndòng. Tā shuō: "Nǐmen hái niánqīng, bùrú qù shì yíxià." Wǒ juéde pǎo yìqiān mǐ tài lèi le, érzi shuō: "Nà wǒmen qù dǎ lánqiú huòzhě tī zúqiú ba."',
        vi: 'Vợ tôi bảo hai bố con ra ngoài vận động. Cô ấy nói: "Hai bố con còn trẻ, hay là cứ thử xem." Tôi thấy chạy một nghìn mét mệt quá, con trai nói: "Vậy mình đi đánh bóng rổ hoặc đá bóng đi bố."',
      },
      {
        ko: '体育馆里的运动真多：{{排球}}、{{羽毛球}}、{{乒乓球}}、{{网球}}、{{高尔夫球}}，还有{{瑜伽}}。周末我们还去{{爬山}}和{{划船}}。',
        py: 'Tǐyùguǎn li de yùndòng zhēn duō: páiqiú, yǔmáoqiú, pīngpāngqiú, wǎngqiú, gāo\'ěrfūqiú, hái yǒu yújiā. Zhōumò wǒmen hái qù páshān hé huáchuán.',
        vi: 'Trong nhà thi đấu có thật nhiều môn: bóng chuyền, cầu lông, bóng bàn, tennis, golf, còn có cả yoga. Cuối tuần chúng tôi còn đi leo núi và chèo thuyền.',
      },
      {
        ko: '运动完，儿子高兴地{{抱}}了我一下。我们说好了：吃完晚饭再去游泳。',
        py: 'Yùndòng wán, érzi gāoxìng de bào le wǒ yíxià. Wǒmen shuō hǎo le: chī wán wǎnfàn zài qù yóuyǒng.',
        vi: 'Vận động xong, con trai vui vẻ ôm tôi một cái. Hai bố con hẹn nhau: ăn tối xong rồi hẵng đi bơi.',
      },
      {
        ko: '现在我的{{身体}}好多了，{{体力}}也比以前好。儿子参加了学校的{{体育}}{{团体}}，很喜欢{{集体}}活动。老师说运动要有{{具体}}的计划，运动也{{体现}}了一个人的精神。穿上运动服，我觉得自己很{{体面}}。"{{体}}"就是"身体"的意思。',
        py: 'Xiànzài wǒ de shēntǐ hǎo duō le, tǐlì yě bǐ yǐqián hǎo. Érzi cānjiā le xuéxiào de tǐyù tuántǐ, hěn xǐhuan jítǐ huódòng. Lǎoshī shuō yùndòng yào yǒu jùtǐ de jìhuà, yùndòng yě tǐxiàn le yí ge rén de jīngshén. Chuān shàng yùndòngfú, wǒ juéde zìjǐ hěn tǐmiàn. "Tǐ" jiù shì "shēntǐ" de yìsi.',
        vi: 'Bây giờ cơ thể tôi khỏe hơn nhiều, thể lực cũng tốt hơn trước. Con trai tham gia đoàn thể thể dục thể thao của trường, rất thích hoạt động tập thể. Thầy giáo nói tập luyện phải có kế hoạch cụ thể, thể thao cũng thể hiện tinh thần của một người. Mặc đồ thể thao vào, tôi thấy mình rất thể diện (bảnh). "Thể" chính là "cơ thể".',
      },
    ],
  },

  24: {
    title: '她工作又认真又热情',
    titleVi: 'Cô ấy làm việc vừa chăm chỉ vừa nhiệt tình',
    note: 'Dùng đủ 38 từ vựng và 2 ngữ pháp của bài: 刚 / 刚才, 又……又…….',
    paragraphs: [
      {
        ko: '"{{刚才}}{{穿}}{{黑}}{{裙子}}、拿着{{白}}{{杯子}}的那位{{小姐}}是谁？"\n"她是我们公司的{{秘书}}，叫Lin。"',
        py: '"Gāngcái chuān hēi qúnzi, ná zhe bái bēizi de nà wèi xiǎojiě shì shéi?"\n"Tā shì wǒmen gōngsī de mìshū, jiào Lin."',
        vi: '"Cô gái mặc váy đen, cầm cốc trắng lúc nãy là ai vậy?"\n"Cô ấy là thư ký công ty mình, tên là Lin."',
      },
      {
        ko: '"我们{{刚}}在{{会议}}上{{见面}}，她{{笑}}着跟我{{说话}}，人很好。"\n"对，她{{又}}{{聪明}}又漂亮，工作又{{认真}}又{{热情}}。"',
        py: '"Wǒmen gāng zài huìyì shang jiànmiàn, tā xiào zhe gēn wǒ shuōhuà, rén hěn hǎo."\n"Duì, tā yòu cōngming yòu piàoliang, gōngzuò yòu rènzhēn yòu rèqíng."',
        vi: '"Bọn mình vừa gặp nhau trong cuộc họp, cô ấy cười nói chuyện với mình, người tốt lắm."\n"Đúng thế, cô ấy vừa thông minh vừa xinh đẹp, làm việc thì vừa chăm chỉ vừa nhiệt tình."',
      },
      {
        ko: '"她{{结婚}}了吗？"\n"还没有。她{{只是}}太忙了，下班以后还在读研究生，每天都要做{{作业}}。"',
        py: '"Tā jiéhūn le ma?"\n"Hái méiyǒu. Tā zhǐshì tài máng le, xiàbān yǐhòu hái zài dú yánjiūshēng, měi tiān dōu yào zuò zuòyè."',
        vi: '"Cô ấy kết hôn chưa?"\n"Chưa. Chỉ là cô ấy bận quá, tan làm xong còn đi học thạc sĩ, ngày nào cũng phải làm bài tập."',
      },
      {
        ko: '我是一个{{上班族}}。我们公司的{{董事长}}很少来，{{总经理}}每天都很早{{进}}办公室。我的{{经理}}是一位财务{{专家}}，他有一个{{助理}}，还有两个{{实习生}}。',
        py: 'Wǒ shì yí ge shàngbānzú. Wǒmen gōngsī de dǒngshìzhǎng hěn shǎo lái, zǒngjīnglǐ měi tiān dōu hěn zǎo jìn bàngōngshì. Wǒ de jīnglǐ shì yí wèi cáiwù zhuānjiā, tā yǒu yí ge zhùlǐ, hái yǒu liǎng ge shíxíshēng.',
        vi: 'Tôi là dân văn phòng. Chủ tịch hội đồng quản trị công ty tôi ít khi đến, còn tổng giám đốc ngày nào cũng vào văn phòng rất sớm. Trưởng phòng của tôi là một chuyên gia tài chính, anh ấy có một trợ lý và hai thực tập sinh.',
      },
      {
        ko: 'Lin喜欢看{{抒情}}电影。这种电影的{{情节}}很简单，可是{{情景}}很美，讲的都是{{爱情}}。她说，电影里的男人对女朋友很{{深情}}，也很有{{情义}}。',
        py: 'Lin xǐhuan kàn shūqíng diànyǐng. Zhè zhǒng diànyǐng de qíngjié hěn jiǎndān, kěshì qíngjǐng hěn měi, jiǎng de dōu shì àiqíng. Tā shuō, diànyǐng li de nánrén duì nǚpéngyou hěn shēnqíng, yě hěn yǒu qíngyì.',
        vi: 'Lin thích xem phim trữ tình. Tình tiết của loại phim này rất đơn giản, nhưng tình cảnh rất đẹp, toàn kể chuyện ái tình. Cô ấy nói đàn ông trong phim rất thâm tình với bạn gái, lại rất có tình nghĩa.',
      },
      {
        ko: '上个月Lin去拜访客户，客户{{盛情}}招待了她。回来以后，客户还写了一封信表达{{情意}}，问了公司最近的{{情况}}。"{{情}}"这个字真有意思。',
        py: 'Shàng ge yuè Lin qù bàifǎng kèhù, kèhù shèngqíng zhāodài le tā. Huílai yǐhòu, kèhù hái xiě le yì fēng xìn biǎodá qíngyì, wèn le gōngsī zuìjìn de qíngkuàng. "Qíng" zhège zì zhēn yǒu yìsi.',
        vi: 'Tháng trước Lin đi thăm khách hàng, khách hàng tiếp đãi cô ấy rất thịnh tình. Sau khi cô ấy về, khách hàng còn viết một lá thư bày tỏ tình ý và hỏi thăm tình huống (tình hình) gần đây của công ty. Chữ "tình" này thú vị thật.',
      },
    ],
  },

  25: {
    title: '时间过得真快',
    titleVi: 'Thời gian trôi thật nhanh',
    note: 'Dùng đủ 43 từ vựng và 3 ngữ pháp của bài: 快要 / 要 / 快 / 就要……了, 更 + tính từ, động từ + 来 + động từ + 去.',
    paragraphs: [
      {
        ko: '时间{{过}}得真快，{{春节}}{{快要}}到了！{{农历}}十二月二十三是越南的{{祭灶节}}，那天以后，家家户户都开始准备过年。',
        py: 'Shíjiān guò de zhēn kuài, Chūnjié kuàiyào dào le! Nónglì shí\'èr yuè èrshísān shì Yuènán de Jìzàojié, nà tiān yǐhòu, jiājiāhùhù dōu kāishǐ zhǔnbèi guònián.',
        vi: 'Thời gian trôi thật nhanh, Tết sắp đến rồi! Ngày hai mươi ba tháng chạp âm lịch là lễ cúng ông Táo của Việt Nam, từ hôm đó nhà nhà bắt đầu chuẩn bị đón Tết.',
      },
      {
        ko: '"{{大家}}春节有什么{{打算}}？"\n"我{{马上}}就回老家。"\n"你家的{{情况}}怎么样？"\n"我{{姐姐}}下个星期{{就要}}结婚了！我想回家帮忙。"',
        py: '"Dàjiā Chūnjié yǒu shénme dǎsuàn?"\n"Wǒ mǎshàng jiù huí lǎojiā."\n"Nǐ jiā de qíngkuàng zěnmeyàng?"\n"Wǒ jiějie xià ge xīngqī jiùyào jiéhūn le! Wǒ xiǎng huí jiā bāngmáng."',
        vi: '"Mọi người có dự định gì cho Tết không?"\n"Mình về quê ngay đây."\n"Tình hình nhà bạn thế nào?"\n"Tuần sau chị gái mình cưới rồi! Mình muốn về nhà phụ giúp."',
      },
      {
        ko: '我是一个{{工作狂}}，{{整}}天在{{办公室}}工作。同事说："{{甭}}工作了，快回家{{嘛}}！"我说："我还得{{努力}}一下。"最后我五点才{{离开}}办公室。',
        py: 'Wǒ shì yí ge gōngzuòkuáng, zhěngtiān zài bàngōngshì gōngzuò. Tóngshì shuō: "Béng gōngzuò le, kuài huí jiā ma!" Wǒ shuō: "Wǒ hái děi nǔlì yíxià." Zuìhòu wǒ wǔ diǎn cái líkāi bàngōngshì.',
        vi: 'Tôi là một người cuồng công việc, cả ngày ở văn phòng làm việc. Đồng nghiệp nói: "Thôi đừng làm nữa, về nhà nhanh đi mà!" Tôi nói: "Tôi vẫn phải cố gắng thêm chút nữa." Cuối cùng năm giờ tôi mới rời văn phòng.',
      },
      {
        ko: '天很{{阴}}，快下雨了。同事开了一{{辆}}车{{送}}我去火车{{站}}。下车的时候他说："{{路}}上{{小心}}！"',
        py: 'Tiān hěn yīn, kuài xià yǔ le. Tóngshì kāi le yí liàng chē sòng wǒ qù huǒchēzhàn. Xià chē de shíhou tā shuō: "Lù shang xiǎoxīn!"',
        vi: 'Trời rất âm u, sắp mưa rồi. Đồng nghiệp lái một chiếc xe tiễn tôi ra ga tàu. Lúc xuống xe anh ấy nói: "Đi đường cẩn thận nhé!"',
      },
      {
        ko: '春节的时候，我们包{{粽子}}、做{{春卷}}，家里摆着{{桃花}}。一家人一起吃{{年夜饭}}、{{过除夕}}、{{放烟花}}，孩子们收{{红包}}，在院子里跑来跑去。今年的春节比去年{{更}}热闹。',
        py: 'Chūnjié de shíhou, wǒmen bāo zòngzi, zuò chūnjuǎn, jiā li bǎi zhe táohuā. Yì jiā rén yìqǐ chī niányèfàn, guò chúxī, fàng yānhuā, háizimen shōu hóngbāo, zài yuànzi li pǎo lái pǎo qù. Jīnnián de Chūnjié bǐ qùnián gèng rènao.',
        vi: 'Dịp Tết, chúng tôi gói bánh chưng, làm nem rán, trong nhà cắm hoa đào. Cả nhà cùng ăn bữa cơm tất niên, đón giao thừa, bắn pháo hoa; bọn trẻ nhận lì xì rồi chạy tới chạy lui trong sân. Tết năm nay còn náo nhiệt hơn năm ngoái.',
      },
      {
        ko: '新的一年，我想少一点儿{{压力}}，多一点儿{{动力}}。我看电脑太久，{{视力}}不好了，{{精力}}也不够。我要靠{{毅力}}和{{自力}}，发挥自己的{{潜力}}，提高{{能力}}和{{实力}}。我不想要很大的{{权力}}，只想要一个幸福的家。"{{力}}"就是"力量"。',
        py: 'Xīn de yì nián, wǒ xiǎng shǎo yìdiǎnr yālì, duō yìdiǎnr dònglì. Wǒ kàn diànnǎo tài jiǔ, shìlì bù hǎo le, jīnglì yě bú gòu. Wǒ yào kào yìlì hé zìlì, fāhuī zìjǐ de qiánlì, tígāo nénglì hé shílì. Wǒ bù xiǎng yào hěn dà de quánlì, zhǐ xiǎng yào yí ge xìngfú de jiā. "Lì" jiù shì "lìliang".',
        vi: 'Năm mới, tôi muốn bớt áp lực, thêm động lực. Tôi nhìn máy tính lâu quá nên thị lực kém đi, tinh lực cũng không đủ. Tôi sẽ dựa vào nghị lực và tự lực, phát huy tiềm lực của bản thân, nâng cao năng lực và thực lực. Tôi không cần quyền lực lớn lao, chỉ muốn một gia đình hạnh phúc. "Lực" chính là "sức mạnh".',
      },
    ],
  },

  // ── HSK 3 (cuốn "Tăng tốc", lesson 26-50 = Bài 1-25) ──
  26: {
    title: '同学聚会',
    titleVi: 'Họp lớp',
    note: 'Dùng đủ 37 từ vựng và 4 ngữ pháp của bài: 越来越, 多(么)……啊！, 一定, 好不容易才 / 好容易才.',
    paragraphs: [
      {
        ko: '今天我们{{班}}的{{同学}}见面了，{{差不多}}来了二十个人。大家{{最近}}怎么样？每个人的{{变化}}都很大！',
        py: 'Jīntiān wǒmen bān de tóngxué jiànmiàn le, chàbuduō lái le èrshí ge rén. Dàjiā zuìjìn zěnmeyàng? Měi ge rén de biànhuà dōu hěn dà!',
        vi: 'Hôm nay lớp mình họp lớp, đến khoảng hai mươi người. Dạo này mọi người thế nào? Ai cũng thay đổi rất nhiều!',
      },
      {
        ko: 'Lan{{越来越}}漂亮了。她{{瘦}}了五{{公斤}}，现在非常{{苗条}}。我说："你{{多么}}漂亮{{啊}}！"她的男朋友是个{{高富帅}}，她自己也是个{{白富美}}。',
        py: 'Lan yuèláiyuè piàoliang le. Tā shòu le wǔ gōngjīn, xiànzài fēicháng miáotiao. Wǒ shuō: "Nǐ duōme piàoliang a!" Tā de nánpéngyou shì ge gāofùshuài, tā zìjǐ yě shì ge báifùměi.',
        vi: 'Lan ngày càng xinh. Bạn ấy gầy đi năm cân, giờ cực kỳ thon thả. Mình nói: "Cậu xinh biết bao!" Bạn trai cậu ấy là kiểu "cao phú soái", bản thân cậu ấy cũng là "bạch phú mỹ" (trắng, giàu, xinh).',
      },
      {
        ko: 'Ming在一个{{国际}}大{{城市}}工作，{{工资}}很高，{{收入}}也不错。他说："我{{好不容易}}才找到这个工作，这是个好{{机会}}，我{{一定}}要好好干。"',
        py: 'Ming zài yí ge guójì dà chéngshì gōngzuò, gōngzī hěn gāo, shōurù yě búcuò. Tā shuō: "Wǒ hǎobù róngyì cái zhǎodào zhège gōngzuò, zhè shì ge hǎo jīhuì, wǒ yídìng yào hǎohāo gàn."',
        vi: 'Ming làm việc ở một thành phố lớn mang tầm quốc tế, lương rất cao, thu nhập cũng khá. Cậu ấy nói: "Mình khó khăn lắm mới tìm được công việc này, đây là cơ hội tốt, mình nhất định phải làm cho tốt."',
      },
      {
        ko: 'Ming还是个{{单身狗}}。他笑着说："我是{{剩男}}，你们的{{闺蜜}}里有没有{{剩女}}？"他的{{哥们儿}}都笑他。他每天跟{{同事}}一起吃午饭，晚上回家跟他的{{狗}}玩儿，那只狗特别{{可爱}}。',
        py: 'Ming hái shì ge dānshēngǒu. Tā xiào zhe shuō: "Wǒ shì shèngnán, nǐmen de guīmì li yǒu méiyǒu shèngnǚ?" Tā de gēmenr dōu xiào tā. Tā měi tiān gēn tóngshì yìqǐ chī wǔfàn, wǎnshang huí jiā gēn tā de gǒu wánr, nà zhī gǒu tèbié kě\'ài.',
        vi: 'Ming vẫn là "chó độc thân" (FA). Cậu ấy cười nói: "Mình là trai ế, trong đám bạn thân của các cậu có cô gái ế nào không?" Mấy người anh em đều cười cậu ấy. Ngày nào cậu ấy cũng ăn trưa với đồng nghiệp, tối về nhà chơi với chú chó của mình, con chó đó cực kỳ đáng yêu.',
      },
      {
        ko: 'Ming的公司刚和一家越南公司签了{{合同}}。两家公司的想法{{相同}}，大家都{{同意}}，也很{{赞同}}这个计划。他{{同时}}负责两个项目，常常和越南{{同胞}}{{同行}}去出差。',
        py: 'Ming de gōngsī gāng hé yì jiā Yuènán gōngsī qiān le hétong. Liǎng jiā gōngsī de xiǎngfǎ xiāngtóng, dàjiā dōu tóngyì, yě hěn zàntóng zhège jìhuà. Tā tóngshí fùzé liǎng ge xiàngmù, chángcháng hé Yuènán tóngbāo tóngxíng qù chūchāi.',
        vi: 'Công ty của Ming vừa ký hợp đồng với một công ty Việt Nam. Ý tưởng hai bên tương đồng, mọi người đều đồng ý và rất tán đồng kế hoạch này. Cậu ấy đồng thời phụ trách hai dự án, thường đồng hành cùng các đồng bào Việt Nam đi công tác.',
      },
      {
        ko: '最后老师说："以前人们互相叫\'{{同志}}\'，现在叫\'同学\'、\'同事\'。\'{{同}}\'就是\'一样\'的意思。祝大家{{一切}}顺利！"',
        py: 'Zuìhòu lǎoshī shuō: "Yǐqián rénmen hùxiāng jiào \'tóngzhì\', xiànzài jiào \'tóngxué\', \'tóngshì\'. \'Tóng\' jiù shì \'yíyàng\' de yìsi. Zhù dàjiā yíqiè shùnlì!"',
        vi: 'Cuối buổi thầy giáo nói: "Ngày xưa người ta gọi nhau là \'đồng chí\', bây giờ gọi là \'bạn học\', \'đồng nghiệp\'. \'Đồng\' nghĩa là \'giống nhau\'. Chúc mọi người tất cả đều thuận lợi!"',
      },
    ],
  },

  27: {
    title: '我是来看房子的',
    titleVi: 'Tôi đến xem nhà',
    note: 'Dùng đủ 34 từ vựng và 4 ngữ pháp của bài: 谁 / 什么 / 哪儿 + 都, 不但……而且……, 如果……(的话)，就……, bổ ngữ xu hướng kép.',
    paragraphs: [
      {
        ko: '"{{叔叔}}好！我是来{{租}}房子的。"\n"欢迎！你是Wang{{先生}}吧？请进来。"',
        py: '"Shūshu hǎo! Wǒ shì lái zū fángzi de."\n"Huānyíng! Nǐ shì Wang xiānsheng ba? Qǐng jìnlai."',
        vi: '"Cháu chào chú! Cháu đến thuê nhà ạ."\n"Chào mừng! Cậu là anh Wang phải không? Mời vào."',
      },
      {
        ko: '{{房东}}带我走进{{客厅}}。这套房子有两个{{卧室}}、一个{{厨房}}、一个{{餐厅}}、一个{{浴室}}，还有一个{{阳台}}，一共八十{{平方米}}。',
        py: 'Fángdōng dài wǒ zǒu jìn kètīng. Zhè tào fángzi yǒu liǎng ge wòshì, yí ge chúfáng, yí ge cāntīng, yí ge yùshì, hái yǒu yí ge yángtái, yígòng bāshí píngfāngmǐ.',
        vi: 'Chủ nhà dẫn tôi vào phòng khách. Căn hộ có hai phòng ngủ, một bếp, một phòng ăn, một phòng tắm, còn có một ban công, tổng cộng tám mươi mét vuông.',
      },
      {
        ko: '房子{{不但}}很{{干净}}，{{而且}}很{{方便}}。{{冰箱}}是新的，{{洗手间}}也是新的。打开{{窗户}}，能看见外面的大{{树}}。',
        py: 'Fángzi búdàn hěn gānjìng, érqiě hěn fāngbiàn. Bīngxiāng shì xīn de, xǐshǒujiān yě shì xīn de. Dǎkāi chuānghu, néng kànjiàn wàimiàn de dà shù.',
        vi: 'Căn nhà không những sạch sẽ mà còn rất tiện. Tủ lạnh mới, nhà vệ sinh cũng mới. Mở cửa sổ ra là thấy cây lớn bên ngoài.',
      },
      {
        ko: '"{{房租}}多少钱？"\n"一个月三千块。{{如果}}你租一年的话，就便宜一点儿。"\n我想了想，{{决定}}租下来。',
        py: '"Fángzū duōshao qián?"\n"Yí ge yuè sānqiān kuài. Rúguǒ nǐ zū yì nián dehuà, jiù piányi yìdiǎnr."\nWǒ xiǎng le xiǎng, juédìng zū xiàlai.',
        vi: '"Tiền thuê nhà bao nhiêu ạ?"\n"Ba nghìn tệ một tháng. Nếu cậu thuê một năm thì rẻ hơn chút."\nTôi nghĩ một lúc rồi quyết định thuê luôn.',
      },
      {
        ko: '房东说他儿子在越南{{留学}}，我们{{谈}}了很久。他还{{告诉}}我，附近什么都有，去哪儿都很方便。',
        py: 'Fángdōng shuō tā érzi zài Yuènán liúxué, wǒmen tán le hěn jiǔ. Tā hái gàosu wǒ, fùjìn shénme dōu yǒu, qù nǎr dōu hěn fāngbiàn.',
        vi: 'Chủ nhà kể con trai chú đang du học ở Việt Nam, chúng tôi nói chuyện rất lâu. Chú còn bảo tôi gần đây cái gì cũng có, đi đâu cũng tiện.',
      },
      {
        ko: '房东很{{好客}}，常常请{{客人}}来家里吃饭。他说："你是{{贵客}}，别{{客气}}，也别说{{客套}}话。"这个城市{{游客}}和{{旅客}}很多，附近的饭馆总是坐满了{{食客}}。{{客观}}地说，这里住起来很舒服。"{{客}}"就是"客人"。',
        py: 'Fángdōng hěn hàokè, chángcháng qǐng kèrén lái jiā li chī fàn. Tā shuō: "Nǐ shì guìkè, bié kèqi, yě bié shuō kètào huà." Zhège chéngshì yóukè hé lǚkè hěn duō, fùjìn de fànguǎn zǒngshì zuò mǎn le shíkè. Kèguān de shuō, zhèlǐ zhù qǐlai hěn shūfu. "Kè" jiù shì "kèrén".',
        vi: 'Chủ nhà rất hiếu khách, hay mời khách đến nhà ăn cơm. Chú nói: "Cậu là quý khách, đừng khách khí, cũng đừng nói lời khách sáo." Thành phố này có rất nhiều du khách và lữ khách, quán ăn gần đây lúc nào cũng kín thực khách. Nói một cách khách quan, sống ở đây rất dễ chịu. "Khách" chính là "khách nhân".',
      },
    ],
  },

  28: {
    title: '房间都收拾好了',
    titleVi: 'Phòng đã dọn xong rồi',
    note: 'Dùng đủ 34 từ vựng và 4 ngữ pháp của bài: 一边……一边……, động từ + 得 / 不 + bổ ngữ, 挺, 还是.',
    paragraphs: [
      {
        ko: '今天我搬家，朋友Mei来帮我。我们一起把{{行李箱}}{{抬}}上三{{楼}}。Mei{{提}}着两个包，我{{推}}着自行车。',
        py: 'Jīntiān wǒ bānjiā, péngyou Mei lái bāng wǒ. Wǒmen yìqǐ bǎ xínglixiāng tái shàng sān lóu. Mei tí zhe liǎng ge bāo, wǒ tuī zhe zìxíngchē.',
        vi: 'Hôm nay tôi chuyển nhà, bạn tôi là Mei đến giúp. Chúng tôi cùng khiêng vali lên tầng ba. Mei xách hai cái túi, tôi đẩy xe đạp.',
      },
      {
        ko: '我们一边听{{音乐}}，一边{{收拾}}房间。我把衣服{{挂}}在{{衣柜}}里，Mei{{擦}}桌子，把垃圾都{{扔}}了。我从地上{{捡}}起一副{{眼镜}}："这是谁的？"Mei说："{{当然}}是你的！"',
        py: 'Wǒmen yìbiān tīng yīnyuè, yìbiān shōushi fángjiān. Wǒ bǎ yīfu guà zài yīguì li, Mei cā zhuōzi, bǎ lājī dōu rēng le. Wǒ cóng dì shang jiǎn qǐ yí fù yǎnjìng: "Zhè shì shéi de?" Mei shuō: "Dāngrán shì nǐ de!"',
        vi: 'Chúng tôi vừa nghe nhạc vừa dọn phòng. Tôi treo quần áo vào tủ, Mei lau bàn và vứt hết rác. Tôi nhặt từ dưới đất lên một cặp kính: "Cái này của ai đây?" Mei nói: "Đương nhiên là của cậu rồi!"',
      },
      {
        ko: '"{{卧室}}的窗帘{{拉}}得上吗？"\n"拉不上，有点儿紧。"\n"没关系，明天再弄吧。"',
        py: '"Wòshì de chuānglián lā de shàng ma?"\n"Lā bu shàng, yǒudiǎnr jǐn."\n"Méi guānxi, míngtiān zài nòng ba."',
        vi: '"Rèm phòng ngủ kéo vào được không?"\n"Không kéo được, hơi chặt."\n"Không sao, mai làm tiếp vậy."',
      },
      {
        ko: '这里的{{环境}}{{挺}}好的，{{附近}}有一个{{公园}}，晚上很{{安静}}，连鸟叫都听得很{{清楚}}。我想以后{{经常}}去公园跑步。Mei说："你的新家真{{有意思}}！"我说："今天{{麻烦}}你了，谢谢！"',
        py: 'Zhèlǐ de huánjìng tǐng hǎo de, fùjìn yǒu yí ge gōngyuán, wǎnshang hěn ānjìng, lián niǎo jiào dōu tīng de hěn qīngchu. Wǒ xiǎng yǐhòu jīngcháng qù gōngyuán pǎobù. Mei shuō: "Nǐ de xīn jiā zhēn yǒu yìsi!" Wǒ shuō: "Jīntiān máfan nǐ le, xièxie!"',
        vi: 'Môi trường ở đây khá tốt, gần đó có một công viên, buổi tối rất yên tĩnh, đến tiếng chim hót cũng nghe rõ. Tôi định sau này thường xuyên ra công viên chạy bộ. Mei nói: "Nhà mới của cậu thú vị thật!" Tôi nói: "Hôm nay làm phiền cậu rồi, cảm ơn nhé!"',
      },
      {
        ko: 'Mei说她最近{{心情}}不好，有一块{{心病}}。她是学{{心理}}的，常常写学习{{心得}}。她把很多{{心血}}花在工作上，工作是她生活的{{重心}}。我懂她的{{心思}}，就送了她一个小礼物，表示我的{{心意}}。"{{心}}"这个字真有意思。',
        py: 'Mei shuō tā zuìjìn xīnqíng bù hǎo, yǒu yí kuài xīnbìng. Tā shì xué xīnlǐ de, chángcháng xiě xuéxí xīndé. Tā bǎ hěn duō xīnxuè huā zài gōngzuò shang, gōngzuò shì tā shēnghuó de zhòngxīn. Wǒ dǒng tā de xīnsi, jiù sòng le tā yí ge xiǎo lǐwù, biǎoshì wǒ de xīnyì. "Xīn" zhège zì zhēn yǒu yìsi.',
        vi: 'Mei kể dạo này tâm tình (tâm trạng) không tốt, có một nỗi tâm bệnh. Cô ấy học tâm lý, hay viết tâm đắc (cảm nhận) về việc học. Cô ấy dồn rất nhiều tâm huyết vào công việc, công việc là trọng tâm cuộc sống của cô ấy. Tôi hiểu tâm tư của cô ấy nên tặng một món quà nhỏ để bày tỏ tâm ý. Chữ "tâm" này thật thú vị.',
      },
    ],
  },

  29: {
    title: '哪条裙子更适合我？',
    titleVi: 'Cái váy nào hợp với tớ hơn?',
    note: 'Dùng đủ 40 từ vựng và 3 ngữ pháp của bài: tính từ 是 tính từ，但是……, A 像 B 一样, 又 + động từ.',
    paragraphs: [
      {
        ko: '下个星期我要{{参加}}朋友的{{婚礼}}。我去商店买裙子，有两{{条}}都很漂亮，我不知道怎么{{选择}}。',
        py: 'Xià ge xīngqī wǒ yào cānjiā péngyou de hūnlǐ. Wǒ qù shāngdiàn mǎi qúnzi, yǒu liǎng tiáo dōu hěn piàoliang, wǒ bù zhīdào zěnme xuǎnzé.',
        vi: 'Tuần sau tôi đi dự đám cưới của bạn. Tôi đến cửa hàng mua váy, có hai chiếc đều rất đẹp, tôi không biết nên chọn thế nào.',
      },
      {
        ko: '"这条红的漂亮是漂亮，但是有点儿{{短}}。"\n"那条{{深}}蓝色的呢？"\n"那条更{{适合}}你。你有点儿{{矮}}，可是穿上它，你{{像}}模特{{一样}}！"',
        py: '"Zhè tiáo hóng de piàoliang shì piàoliang, dànshì yǒudiǎnr duǎn."\n"Nà tiáo shēn lánsè de ne?"\n"Nà tiáo gèng shìhé nǐ. Nǐ yǒudiǎnr ǎi, kěshì chuān shàng tā, nǐ xiàng mótè yíyàng!"',
        vi: '"Cái màu đỏ này đẹp thì đẹp thật, nhưng hơi ngắn."\n"Thế cái màu xanh đậm kia?"\n"Cái đó hợp với cậu hơn. Cậu hơi thấp, nhưng mặc vào trông cậu như người mẫu vậy!"',
      },
      {
        ko: '商店里{{挂}}着很多{{婚纱}}。我想，{{新娘}}穿上婚纱一定很美，{{新郎}}也一定很帅。新娘的{{戒指}}是新郎送的，非常漂亮。我又买了一条{{腰带}}、一副{{墨镜}}、一对{{耳环}}、一条{{项链}}和一个{{手镯}}。',
        py: 'Shāngdiàn li guà zhe hěn duō hūnshā. Wǒ xiǎng, xīnniáng chuān shàng hūnshā yídìng hěn měi, xīnláng yě yídìng hěn shuài. Xīnniáng de jièzhi shì xīnláng sòng de, fēicháng piàoliang. Wǒ yòu mǎi le yì tiáo yāodài, yí fù mòjìng, yí duì ěrhuán, yì tiáo xiàngliàn hé yí ge shǒuzhuó.',
        vi: 'Trong cửa hàng treo rất nhiều váy cưới. Tôi nghĩ cô dâu mặc váy cưới chắc chắn rất đẹp, chú rể cũng nhất định rất bảnh. Nhẫn của cô dâu là chú rể tặng, đẹp lắm. Tôi lại mua thêm một chiếc thắt lưng, một cặp kính râm, một đôi bông tai, một sợi dây chuyền và một chiếc vòng tay.',
      },
      {
        ko: '买完东西，商店快要{{结束}}营业了。我{{恐怕}}来不及做饭，就去了水果店。卖水果的{{阿姨}}说："这{{串}}{{香蕉}}又{{香}}又{{甜}}，很{{新鲜}}，十{{元}}一串。"我{{同意}}了，买了一串。',
        py: 'Mǎi wán dōngxi, shāngdiàn kuàiyào jiéshù yíngyè le. Wǒ kǒngpà láibují zuò fàn, jiù qù le shuǐguǒ diàn. Mài shuǐguǒ de āyí shuō: "Zhè chuàn xiāngjiāo yòu xiāng yòu tián, hěn xīnxiān, shí yuán yí chuàn." Wǒ tóngyì le, mǎi le yí chuàn.',
        vi: 'Mua đồ xong thì cửa hàng cũng sắp đóng cửa. Tôi sợ là không kịp nấu cơm nên ghé cửa hàng hoa quả. Cô bán hoa quả nói: "Nải chuối này vừa thơm vừa ngọt, tươi lắm, mười tệ một nải." Tôi đồng ý, mua một nải.',
      },
      {
        ko: '婚礼上，新郎说他已经{{成熟}}了，可以{{成}}家了。他工作很{{成功}}，{{成绩}}很好，有不少{{成就}}；新娘也{{完成}}了学业。大家都{{赞成}}这门婚事。新郎还说了一个{{成语}}："百年好合。"',
        py: 'Hūnlǐ shang, xīnláng shuō tā yǐjīng chéngshú le, kěyǐ chéng jiā le. Tā gōngzuò hěn chénggōng, chéngjì hěn hǎo, yǒu bù shǎo chéngjiù; xīnniáng yě wánchéng le xuéyè. Dàjiā dōu zànchéng zhè mén hūnshì. Xīnláng hái shuō le yí ge chéngyǔ: "Bǎinián hǎohé."',
        vi: 'Trong đám cưới, chú rể nói anh đã thành thục (trưởng thành), có thể thành gia lập thất rồi. Anh làm việc rất thành công, thành tích tốt, có không ít thành tựu; cô dâu cũng đã hoàn thành việc học. Mọi người đều tán thành cuộc hôn nhân này. Chú rể còn nói một câu thành ngữ: "Trăm năm hạnh phúc."',
      },
      {
        ko: '他说，一个好家庭是由爱和信任{{构成}}的。两个人{{合成}}一个家，慢慢就会{{形成}}自己的生活。',
        py: 'Tā shuō, yí ge hǎo jiātíng shì yóu ài hé xìnrèn gòuchéng de. Liǎng ge rén héchéng yí ge jiā, mànmàn jiù huì xíngchéng zìjǐ de shēnghuó.',
        vi: 'Anh nói, một gia đình tốt được cấu thành từ tình yêu và sự tin tưởng. Hai người hợp thành một gia đình, dần dần sẽ hình thành cuộc sống của riêng mình.',
      },
    ],
  },

  30: {
    title: '你有什么爱好？',
    titleVi: 'Bạn có sở thích gì?',
    note: 'Dùng đủ 40 từ vựng và 4 ngữ pháp của bài: 能……吗？, 越A越B, 把 (1), 除了……(以外)，…….',
    paragraphs: [
      {
        ko: '最近我{{发现}}{{自己}}越来越{{懒}}了：每天下班回家，不是{{追剧}}，就是看{{电视剧}}、玩{{游戏}}，或者看综艺{{节目}}。',
        py: 'Zuìjìn wǒ fāxiàn zìjǐ yuèláiyuè lǎn le: měi tiān xiàbān huí jiā, bú shì zhuījù, jiù shì kàn diànshìjù, wán yóuxì, huòzhě kàn zōngyì jiémù.',
        vi: 'Dạo này tôi phát hiện bản thân ngày càng lười: ngày nào đi làm về cũng không cày phim thì xem phim truyền hình, chơi game hoặc xem chương trình giải trí.',
      },
      {
        ko: '朋友说："你能把电视{{关}}了吗？出去走走吧！"她问我有什么{{爱好}}。我说："{{除了}}{{网上购物}}{{以外}}，我还喜欢{{逛街}}和{{做美容}}。"',
        py: 'Péngyou shuō: "Nǐ néng bǎ diànshì guān le ma? Chūqu zǒuzou ba!" Tā wèn wǒ yǒu shénme àihào. Wǒ shuō: "Chúle wǎngshàng gòuwù yǐwài, wǒ hái xǐhuan guàngjiē hé zuò měiróng."',
        vi: 'Bạn tôi nói: "Cậu tắt tivi đi được không? Ra ngoài đi dạo đi!" Cô ấy hỏi tôi có sở thích gì. Tôi nói: "Ngoài mua sắm online ra, tớ còn thích dạo phố và làm đẹp."',
      },
      {
        ko: '她的爱好很多：{{弹钢琴}}、{{弹吉他}}、{{做慈善}}，还喜欢{{爬山}}。爬山的时候，她常常{{停}}下来，用{{照相机}}给{{树木花草}}{{拍照}}。她说爬山既能{{锻炼}}身体，又能{{放松}}。',
        py: 'Tā de àihào hěn duō: tán gāngqín, tán jítā, zuò císhàn, hái xǐhuan páshān. Páshān de shíhou, tā chángcháng tíng xiàlai, yòng zhàoxiàngjī gěi shùmù huācǎo pāizhào. Tā shuō páshān jì néng duànliàn shēntǐ, yòu néng fàngsōng.',
        vi: 'Cô ấy có rất nhiều sở thích: chơi piano, chơi ghi-ta, làm từ thiện, còn thích leo núi. Lúc leo núi cô ấy hay dừng lại, dùng máy ảnh chụp cây cối hoa cỏ. Cô ấy bảo leo núi vừa rèn luyện sức khỏe vừa thư giãn được.',
      },
      {
        ko: '她还会{{画}}{{画儿}}，越画越好。周末我们去公园，一边{{聊天儿}}一边画画儿。{{其实}}，我也很喜欢画画儿。她把画室的{{地址}}{{发}}给了我。',
        py: 'Tā hái huì huà huàr, yuè huà yuè hǎo. Zhōumò wǒmen qù gōngyuán, yìbiān liáotiānr yìbiān huà huàr. Qíshí, wǒ yě hěn xǐhuan huà huàr. Tā bǎ huàshì de dìzhǐ fā gěi le wǒ.',
        vi: 'Cô ấy còn biết vẽ tranh, càng vẽ càng đẹp. Cuối tuần chúng tôi ra công viên, vừa tán gẫu vừa vẽ. Thực ra tôi cũng rất thích vẽ. Cô ấy gửi cho tôi địa chỉ của phòng tranh.',
      },
      {
        ko: '画室在银行{{对面}}。老师说，画画的时候要认真{{对待}}每一笔。他让我们先跟模特{{对话}}，一问一答地{{对答}}，再开始画。我画的{{对象}}是一位老人。我{{对}}画画越来越有兴趣了。',
        py: 'Huàshì zài yínháng duìmiàn. Lǎoshī shuō, huà huà de shíhou yào rènzhēn duìdài měi yì bǐ. Tā ràng wǒmen xiān gēn mótè duìhuà, yí wèn yì dá de duìdá, zài kāishǐ huà. Wǒ huà de duìxiàng shì yí wèi lǎorén. Wǒ duì huà huà yuèláiyuè yǒu xìngqù le.',
        vi: 'Phòng tranh ở đối diện ngân hàng. Thầy giáo nói khi vẽ phải đối đãi nghiêm túc với từng nét. Thầy bảo chúng tôi đối thoại với người mẫu trước, hỏi một câu đáp một câu (đối đáp), rồi mới bắt đầu vẽ. Đối tượng tôi vẽ là một cụ già. Tôi ngày càng hứng thú với vẽ tranh.',
      },
      {
        ko: '画室里有两个学生是比赛的{{对手}}，常常{{对抗}}，意见总是{{对立}}：一个说要画大的，{{对方}}就{{反对}}。老师笑着说："比赛可以，可是要做朋友。"',
        py: 'Huàshì li yǒu liǎng ge xuésheng shì bǐsài de duìshǒu, chángcháng duìkàng, yìjiàn zǒngshì duìlì: yí ge shuō yào huà dà de, duìfāng jiù fǎnduì. Lǎoshī xiào zhe shuō: "Bǐsài kěyǐ, kěshì yào zuò péngyou."',
        vi: 'Trong phòng tranh có hai học viên là đối thủ trong cuộc thi, hay đối kháng nhau, ý kiến lúc nào cũng đối lập: một người bảo vẽ khổ lớn thì đối phương liền phản đối. Thầy cười nói: "Thi đấu thì được, nhưng phải làm bạn với nhau."',
      },
    ],
  },

  31: {
    title: '很多汉字看起来很像',
    titleVi: 'Rất nhiều chữ Hán nhìn giống nhau',
    note: 'Dùng đủ 39 từ vựng và 3 ngữ pháp của bài: 好像, 把 (2), 下去 / 下来 (nghĩa mở rộng).',
    paragraphs: [
      {
        ko: '在{{教室}}里，老师在{{黑板}}上写了两个字："己"和"已"。这两个字{{好像}}一模一样，我常常写错。',
        py: 'Zài jiàoshì li, lǎoshī zài hēibǎn shang xiě le liǎng ge zì: "jǐ" hé "yǐ". Zhè liǎng ge zì hǎoxiàng yìmú yíyàng, wǒ chángcháng xiě cuò.',
        vi: 'Trong phòng học, cô giáo viết lên bảng đen hai chữ: "己" và "已". Hai chữ này trông như giống hệt nhau, tôi hay viết nhầm.',
      },
      {
        ko: '我学{{中文}}一年了。我{{一般}}每天{{花}}两个小时{{练习}}写汉字，{{可是}}还是常常{{忘记}}。我的汉字{{水平}}不高，学汉字比我{{想象}}的难多了。',
        py: 'Wǒ xué Zhōngwén yì nián le. Wǒ yìbān měi tiān huā liǎng ge xiǎoshí liànxí xiě Hànzì, kěshì háishi chángcháng wàngjì. Wǒ de Hànzì shuǐpíng bù gāo, xué Hànzì bǐ wǒ xiǎngxiàng de nán duō le.',
        vi: 'Tôi học tiếng Trung được một năm rồi. Thường thì mỗi ngày tôi dành hai tiếng luyện viết chữ Hán, nhưng vẫn hay quên. Trình độ chữ Hán của tôi chưa cao, học chữ Hán khó hơn tôi tưởng tượng nhiều.',
      },
      {
        ko: '老师说："这很{{正常}}。我有个{{办法}}：把汉字放在{{句子}}里记。"她说学汉字{{主要}}靠多写多读。我{{向}}老师点点头，{{相信}}只要{{继续}}学下去，水平就能{{提高}}。',
        py: 'Lǎoshī shuō: "Zhè hěn zhèngcháng. Wǒ yǒu ge bànfǎ: bǎ Hànzì fàng zài jùzi li jì." Tā shuō xué Hànzì zhǔyào kào duō xiě duō dú. Wǒ xiàng lǎoshī diǎndiǎn tóu, xiāngxìn zhǐyào jìxù xué xiàqu, shuǐpíng jiù néng tígāo.',
        vi: 'Cô giáo nói: "Chuyện này rất bình thường. Cô có một cách: đặt chữ Hán vào trong câu để nhớ." Cô nói học chữ Hán chủ yếu dựa vào viết nhiều đọc nhiều. Tôi gật đầu với cô, tin rằng chỉ cần tiếp tục học tiếp thì trình độ sẽ nâng cao.',
      },
      {
        ko: '晚上我做{{作业}}：{{数学}}、{{语文}}、{{科学}}、{{历史}}、{{地理}}、{{物理}}和{{化学}}，作业太多了！写到最后，我的手都{{动}}不了了。',
        py: 'Wǎnshang wǒ zuò zuòyè: shùxué, yǔwén, kēxué, lìshǐ, dìlǐ, wùlǐ hé huàxué, zuòyè tài duō le! Xiě dào zuìhòu, wǒ de shǒu dōu dòng bù liǎo le.',
        vi: 'Buổi tối tôi làm bài tập: toán, ngữ văn, khoa học, lịch sử, địa lý, vật lý và hóa học, nhiều bài tập quá! Viết đến cuối, tay tôi không động đậy nổi nữa.',
      },
      {
        ko: '周末学校组织{{活动}}，我们坐{{船}}去动物园看{{动物}}，下午还参加了{{劳动}}。我干活很{{主动}}，老师很{{感动}}。猴子的{{动作}}很有意思，听到一点儿{{动静}}就跑了。门口的{{自动}}售票机也很方便。',
        py: 'Zhōumò xuéxiào zǔzhī huódòng, wǒmen zuò chuán qù dòngwùyuán kàn dòngwù, xiàwǔ hái cānjiā le láodòng. Wǒ gàn huó hěn zhǔdòng, lǎoshī hěn gǎndòng. Hóuzi de dòngzuò hěn yǒu yìsi, tīngdào yìdiǎnr dòngjing jiù pǎo le. Ménkǒu de zìdòng shòupiàojī yě hěn fāngbiàn.',
        vi: 'Cuối tuần trường tổ chức hoạt động, chúng tôi đi thuyền đến sở thú xem động vật, buổi chiều còn tham gia lao động. Tôi làm việc rất chủ động, cô giáo rất cảm động. Động tác của mấy con khỉ rất buồn cười, nghe chút động tĩnh là chạy mất. Máy bán vé tự động ở cổng cũng rất tiện.',
      },
      {
        ko: '老师问我学中文的{{动机}}是什么。我说："我的中国朋友就是我的{{动力}}！"',
        py: 'Lǎoshī wèn wǒ xué Zhōngwén de dòngjī shì shénme. Wǒ shuō: "Wǒ de Zhōngguó péngyou jiù shì wǒ de dònglì!"',
        vi: 'Cô giáo hỏi động cơ học tiếng Trung của tôi là gì. Tôi nói: "Bạn bè người Trung Quốc chính là động lực của em!"',
      },
    ],
  },

  32: {
    title: '那儿的饭菜很新鲜',
    titleVi: 'Món ăn ở đó rất tươi ngon',
    note: 'Dùng đủ 41 từ vựng và 3 ngữ pháp của bài: 被, 只有……，才……, A 对 B 感兴趣.',
    paragraphs: [
      {
        ko: '这次考试我的{{成绩}}不好，{{被}}老师{{批评}}了，{{心情}}很差。朋友说："你{{需要}}吃点儿好吃的！"',
        py: 'Zhè cì kǎoshì wǒ de chéngjì bù hǎo, bèi lǎoshī pīpíng le, xīnqíng hěn chà. Péngyou shuō: "Nǐ xūyào chī diǎnr hǎochī de!"',
        vi: 'Kỳ thi lần này thành tích của tôi không tốt, bị thầy phê bình, tâm trạng rất tệ. Bạn tôi nói: "Cậu cần ăn món gì ngon ngon đấy!"',
      },
      {
        ko: '我们去了一家越南{{餐厅}}，那儿的饭菜很{{新鲜}}。我又{{饿}}又{{渴}}，可是只有等到{{座位}}才能吃饭，我们等了二十分钟。',
        py: 'Wǒmen qù le yì jiā Yuènán cāntīng, nàr de fàncài hěn xīnxiān. Wǒ yòu è yòu kě, kěshì zhǐyǒu děng dào zuòwèi cái néng chī fàn, wǒmen děng le èrshí fēnzhōng.',
        vi: 'Chúng tôi đến một nhà hàng Việt Nam, món ăn ở đó rất tươi ngon. Tôi vừa đói vừa khát, nhưng phải có chỗ ngồi mới được ăn, chúng tôi đợi mất hai mươi phút.',
      },
      {
        ko: '我点了{{羊肉}}和{{面包}}，朋友点了{{饮料}}。我{{尝}}了一{{口}}羊肉，太好吃了！桌子上有{{醋}}、{{盐}}、{{胡椒}}、{{辣椒}}、{{酱油}}和{{鱼露}}。朋友不会用{{筷子}}，服务员给他拿来了{{叉子}}和{{刀子}}。',
        py: 'Wǒ diǎn le yángròu hé miànbāo, péngyou diǎn le yǐnliào. Wǒ cháng le yì kǒu yángròu, tài hǎochī le! Zhuōzi shang yǒu cù, yán, hújiāo, làjiāo, jiàngyóu hé yúlù. Péngyou bú huì yòng kuàizi, fúwùyuán gěi tā ná lái le chāzi hé dāozi.',
        vi: 'Tôi gọi thịt dê và bánh mì, bạn tôi gọi đồ uống. Tôi nếm một miếng thịt dê, ngon quá! Trên bàn có giấm, muối, tiêu, ớt, xì dầu và nước mắm. Bạn tôi không biết dùng đũa, nhân viên mang cho cậu ấy dĩa và dao.',
      },
      {
        ko: '我们吃得很{{饱}}，{{盘子}}里还剩了很多，就{{打包}}带回家了。朋友对越南菜很{{感兴趣}}，他说他的{{兴趣}}是做饭。我们对这家餐厅很{{满意}}。',
        py: 'Wǒmen chī de hěn bǎo, pánzi li hái shèng le hěn duō, jiù dǎbāo dài huí jiā le. Péngyou duì Yuènán cài hěn gǎn xìngqù, tā shuō tā de xìngqù shì zuò fàn. Wǒmen duì zhè jiā cāntīng hěn mǎnyì.',
        vi: 'Chúng tôi ăn rất no, trong đĩa vẫn còn nhiều nên gói mang về. Bạn tôi rất hứng thú với món Việt, cậu ấy nói sở thích (hứng thú) của mình là nấu ăn. Chúng tôi rất hài lòng với nhà hàng này.',
      },
      {
        ko: '朋友出了个{{主意}}：以后每个周末都来这儿吃。我{{同意}}了。他说吃饭也有{{意义}}：要有健康{{意识}}，{{注意}}少放盐。',
        py: 'Péngyou chū le ge zhǔyi: yǐhòu měi ge zhōumò dōu lái zhèr chī. Wǒ tóngyì le. Tā shuō chī fàn yě yǒu yìyì: yào yǒu jiànkāng yìshí, zhùyì shǎo fàng yán.',
        vi: 'Bạn tôi đưa ra một chủ ý: từ giờ cuối tuần nào cũng đến đây ăn. Tôi đồng ý. Cậu ấy nói ăn uống cũng có ý nghĩa: phải có ý thức về sức khỏe, chú ý cho ít muối thôi.',
      },
      {
        ko: '我笑他："你是不是{{故意}}找机会请我吃饭？有什么{{意图}}？"他{{得意}}地说："你就是我的{{意中人}}！"看来他的{{意志}}很坚定。"{{意}}"就是"想法"的意思。',
        py: 'Wǒ xiào tā: "Nǐ shì bu shì gùyì zhǎo jīhuì qǐng wǒ chī fàn? Yǒu shénme yìtú?" Tā déyì de shuō: "Nǐ jiù shì wǒ de yìzhōngrén!" Kànlái tā de yìzhì hěn jiāndìng. "Yì" jiù shì "xiǎngfǎ" de yìsi.',
        vi: 'Tôi trêu cậu ấy: "Có phải cậu cố ý tìm cơ hội mời tớ ăn không? Có ý đồ gì đây?" Cậu ấy đắc ý nói: "Cậu chính là ý trung nhân của tớ!" Xem ra ý chí của cậu ấy rất kiên định. "Ý" nghĩa là "suy nghĩ".',
      },
    ],
  },

  33: {
    title: '春节是最重要的节日',
    titleVi: 'Tết là dịp lễ quan trọng nhất',
    note: 'Dùng đủ 40 từ vựng và 3 ngữ pháp của bài: 为 / 为了, 对……来说, lặp tính từ AA / AABB.',
    paragraphs: [
      {
        ko: '{{对}}越南人{{来说}}，春节是一年中最{{重要}}的{{节日}}。',
        py: 'Duì Yuènán rén láishuō, Chūnjié shì yì nián zhōng zuì zhòngyào de jiérì.',
        vi: 'Đối với người Việt Nam mà nói, Tết là ngày lễ quan trọng nhất trong năm.',
      },
      {
        ko: '{{为了}}过春节，大家把家里{{打扫}}得干干净净，把{{旧}}东西都扔掉。{{过去}}的一年不管好不好，新的一年大家都希望{{平安}}、{{健康}}。',
        py: 'Wèile guò Chūnjié, dàjiā bǎ jiā li dǎsǎo de gāngānjìngjìng, bǎ jiù dōngxi dōu rēng diào. Guòqù de yì nián bùguǎn hǎo bu hǎo, xīn de yì nián dàjiā dōu xīwàng píng\'ān, jiànkāng.',
        vi: 'Để đón Tết, mọi người dọn dẹp nhà cửa sạch sẽ tinh tươm, vứt hết đồ cũ đi. Năm qua dù tốt hay không, năm mới ai cũng mong bình an, mạnh khỏe.',
      },
      {
        ko: '我{{为}}家人准备了{{礼物}}：给爸爸买了一双{{皮鞋}}，给妈妈买了一块{{手表}}。我一个人在外面住，妈妈总是{{担心}}我，让我好好{{照顾}}自己。',
        py: 'Wǒ wèi jiārén zhǔnbèi le lǐwù: gěi bàba mǎi le yì shuāng píxié, gěi māma mǎi le yí kuài shǒubiǎo. Wǒ yí ge rén zài wàimiàn zhù, māma zǒngshì dānxīn wǒ, ràng wǒ hǎohāo zhàogù zìjǐ.',
        vi: 'Tôi chuẩn bị quà cho gia đình: mua cho bố một đôi giày da, mua cho mẹ một chiếc đồng hồ đeo tay. Tôi sống một mình xa nhà, mẹ lúc nào cũng lo cho tôi, dặn tôi phải chăm sóc bản thân thật tốt.',
      },
      {
        ko: '妹妹{{长大}}了，个子{{长}}高了很多。她养了一只{{猫}}，小猫的{{嘴}}小小的，特别爱吃{{蛋糕}}。一家人在一起，开开心心的，非常{{开心}}、{{快乐}}。爸爸妈妈说要{{一生一世}}在一起。',
        py: 'Mèimei zhǎngdà le, gèzi zhǎng gāo le hěn duō. Tā yǎng le yì zhī māo, xiǎo māo de zuǐ xiǎoxiǎo de, tèbié ài chī dàngāo. Yì jiā rén zài yìqǐ, kāikāixīnxīn de, fēicháng kāixīn, kuàilè. Bàba māma shuō yào yìshēng yíshì zài yìqǐ.',
        vi: 'Em gái đã lớn, cao lên rất nhiều. Em nuôi một con mèo, miệng mèo con nhỏ xíu, đặc biệt mê ăn bánh gato. Cả nhà ở bên nhau vui vui vẻ vẻ, cực kỳ vui vẻ hạnh phúc. Bố mẹ nói sẽ ở bên nhau trọn đời trọn kiếp.',
      },
      {
        ko: '除了春节，一年中还有很多节日：{{元宵节}}、{{端午节}}、{{儿童节}}、{{国庆节}}、{{中秋节}}、{{妇女节}}、{{教师节}}和{{圣诞节}}。',
        py: 'Chúle Chūnjié, yì nián zhōng hái yǒu hěn duō jiérì: Yuánxiāojié, Duānwǔjié, Értóngjié, Guóqìngjié, Zhōngqiūjié, Fùnǚjié, Jiàoshījié hé Shèngdànjié.',
        vi: 'Ngoài Tết, trong năm còn nhiều ngày lễ: Tết Nguyên tiêu, Tết Đoan ngọ, Tết Thiếu nhi, Lễ Quốc khánh, Tết Trung thu, Ngày Phụ nữ, Ngày Nhà giáo và Lễ Giáng sinh.',
      },
      {
        ko: '春节的时候，{{全}}家人都回来了。{{全国}}的人都在过年，{{全球}}的华人也一样。妈妈想得很{{周全}}，把{{全部}}事情都准备好了。她说过年要注意{{安全}}，孩子要{{全面}}发展，身心要{{健全}}。我{{完全}}同意。',
        py: 'Chūnjié de shíhou, quán jiārén dōu huílai le. Quánguó de rén dōu zài guònián, quánqiú de huárén yě yíyàng. Māma xiǎng de hěn zhōuquán, bǎ quánbù shìqing dōu zhǔnbèi hǎo le. Tā shuō guònián yào zhùyì ānquán, háizi yào quánmiàn fāzhǎn, shēnxīn yào jiànquán. Wǒ wánquán tóngyì.',
        vi: 'Dịp Tết, toàn bộ người nhà đều về. Người toàn quốc đều đón Tết, người Hoa trên toàn cầu cũng vậy. Mẹ lo liệu rất chu toàn, chuẩn bị xong toàn bộ mọi việc. Mẹ nói Tết phải chú ý an toàn, con cái phải phát triển toàn diện, thân tâm phải kiện toàn. Tôi hoàn toàn đồng ý.',
      },
    ],
  },

  34: {
    title: '你想要什么样的爱情？',
    titleVi: 'Cậu muốn có một tình yêu như thế nào?',
    note: 'Dùng đủ 46 từ vựng và 4 ngữ pháp của bài: 不是……，而是……, động từ + 上, động từ + 起来, 突然.',
    paragraphs: [
      {
        ko: '"你想要什么样的{{爱情}}？"{{奶奶}}问我。\n我说："我要的不是钱，{{而是}}一个{{关心}}我的人。"\n奶奶笑了，给我{{讲}}起了她年轻时的故事。',
        py: '"Nǐ xiǎng yào shénme yàng de àiqíng?" Nǎinai wèn wǒ.\nWǒ shuō: "Wǒ yào de bú shì qián, érshì yí ge guānxīn wǒ de rén."\nNǎinai xiào le, gěi wǒ jiǎng qǐ le tā niánqīng shí de gùshi.',
        vi: '"Cháu muốn có một tình yêu như thế nào?" Bà nội hỏi tôi.\nTôi nói: "Cái cháu cần không phải là tiền, mà là một người quan tâm đến cháu."\nBà cười, rồi bắt đầu kể cho tôi nghe chuyện hồi bà còn trẻ.',
      },
      {
        ko: '奶奶说，她还{{记得}}十六岁那年{{遇到}}了一个男孩子。他是她的{{邻居}}，{{高中}}二{{年级}}，{{个子}}高高的，{{头发}}黑黑的，{{鼻子}}很高，{{声音}}很好听。',
        py: 'Nǎinai shuō, tā hái jìde shíliù suì nà nián yùdào le yí ge nán háizi. Tā shì tā de línjū, gāozhōng èr niánjí, gèzi gāogāo de, tóufa hēihēi de, bízi hěn gāo, shēngyīn hěn hǎotīng.',
        vi: 'Bà kể, bà vẫn nhớ năm mười sáu tuổi bà gặp một chàng trai. Anh ấy là hàng xóm của bà, học lớp mười một (năm hai cấp ba), dáng người cao cao, tóc đen nhánh, mũi cao, giọng nói rất hay.',
      },
      {
        ko: '奶奶{{暗恋}}他，这是她的{{初恋}}。有一天，她{{突然}}向他{{表白}}了，可是男孩子{{拒绝}}了。她的{{脸}}红了，{{耳朵}}也红了，回家就{{哭}}了起来。那是她第一次{{失恋}}，原来只是一场{{单恋}}。',
        py: 'Nǎinai ànliàn tā, zhè shì tā de chūliàn. Yǒu yì tiān, tā tūrán xiàng tā biǎobái le, kěshì nán háizi jùjué le. Tā de liǎn hóng le, ěrduo yě hóng le, huí jiā jiù kū le qǐlai. Nà shì tā dì yī cì shīliàn, yuánlái zhǐ shì yì chǎng dānliàn.',
        vi: 'Bà yêu thầm anh ấy, đó là mối tình đầu của bà. Một hôm, bà đột nhiên tỏ tình với anh, nhưng anh từ chối. Mặt bà đỏ bừng, tai cũng đỏ, về đến nhà là bật khóc. Đó là lần đầu tiên bà thất tình, hóa ra chỉ là một mối tình đơn phương.',
      },
      {
        ko: '后来她爱上了爷爷，他们开始{{谈恋爱}}。爷爷比她小两岁，是{{姐弟恋}}；爷爷在外地工作，所以也是{{异地恋}}。奶奶说，跟{{前任}}还是可以做朋友的。她和爷爷的{{感情}}一直很好。',
        py: 'Hòulái tā ài shàng le yéye, tāmen kāishǐ tán liàn\'ài. Yéye bǐ tā xiǎo liǎng suì, shì jiědìliàn; yéye zài wàidì gōngzuò, suǒyǐ yě shì yìdìliàn. Nǎinai shuō, gēn qiánrèn háishi kěyǐ zuò péngyou de. Tā hé yéye de gǎnqíng yìzhí hěn hǎo.',
        vi: 'Sau này bà yêu ông, hai người bắt đầu yêu đương. Ông kém bà hai tuổi, là tình chị em; ông lại làm việc ở nơi khác nên cũng là yêu xa. Bà nói, với người cũ vẫn có thể làm bạn. Tình cảm của bà và ông lúc nào cũng rất tốt.',
      },
      {
        ko: '现在奶奶老了，常常这儿疼那儿疼：{{脖子}}、{{肩膀}}、{{肚子}}、{{膝盖}}、{{胸}}、{{腿}}和{{脚}}都不太舒服。可是她的{{嘴巴}}还是很甜，每天都笑眯眯的。',
        py: 'Xiànzài nǎinai lǎo le, chángcháng zhèr téng nàr téng: bózi, jiānbǎng, dùzi, xīgài, xiōng, tuǐ hé jiǎo dōu bú tài shūfu. Kěshì tā de zuǐba háishi hěn tián, měi tiān dōu xiàomīmī de.',
        vi: 'Bây giờ bà đã già, hay đau chỗ này chỗ kia: cổ, vai, bụng, đầu gối, ngực, đùi và chân đều không được khỏe lắm. Nhưng miệng bà vẫn ngọt ngào, ngày nào cũng cười tủm tỉm.',
      },
      {
        ko: '爷爷以前做{{行政}}工作，负责{{执行}}公司的计划，让公司正常{{运行}}。他写的书也{{发行}}了。他常说，爱不能只说，要有{{行动}}，还要去{{实行}}。爷爷七十岁那年说要带奶奶去{{旅行}}，奶奶马上收拾好{{行李}}，笑着说："{{行}}！"',
        py: 'Yéye yǐqián zuò xíngzhèng gōngzuò, fùzé zhíxíng gōngsī de jìhuà, ràng gōngsī zhèngcháng yùnxíng. Tā xiě de shū yě fāxíng le. Tā cháng shuō, ài bù néng zhǐ shuō, yào yǒu xíngdòng, hái yào qù shíxíng. Yéye qīshí suì nà nián shuō yào dài nǎinai qù lǚxíng, nǎinai mǎshàng shōushi hǎo xíngli, xiào zhe shuō: "Xíng!"',
        vi: 'Ông trước đây làm công việc hành chính, phụ trách chấp hành kế hoạch của công ty, giúp công ty vận hành bình thường. Sách ông viết cũng đã được phát hành. Ông hay nói, yêu không thể chỉ nói mà phải có hành động, còn phải thực hành nữa. Năm bảy mươi tuổi ông nói sẽ đưa bà đi lữ hành (du lịch), bà liền thu xếp hành lý ngay, cười nói: "Được!"',
      },
    ],
  },

  35: {
    title: '靠关系找工作是以前的事了',
    titleVi: 'Dựa vào quan hệ để tìm việc là chuyện của trước đây rồi',
    note: 'Dùng đủ 38 từ vựng và 3 ngữ pháp của bài: 认为, 根据, 把 (3).',
    paragraphs: [
      {
        ko: '上个星期我收到一封{{电子邮件}}，一家很{{有名}}的公司请我去{{面试}}。公司在城市的{{南}}边。我有点儿{{害怕}}。',
        py: 'Shàng ge xīngqī wǒ shōudào yì fēng diànzǐ yóujiàn, yì jiā hěn yǒumíng de gōngsī qǐng wǒ qù miànshì. Gōngsī zài chéngshì de nán bian. Wǒ yǒudiǎnr hàipà.',
        vi: 'Tuần trước tôi nhận được một email, một công ty rất nổi tiếng mời tôi đi phỏng vấn. Công ty ở phía nam thành phố. Tôi hơi sợ.',
      },
      {
        ko: '爸爸说："我认识那家公司的{{经理}}，可以帮你找找{{关系}}。"我说："我不{{愿意}}。我{{认为}}{{靠}}关系找工作是以前的事了。"朋友说："你真{{棒}}！{{加油}}！"',
        py: 'Bàba shuō: "Wǒ rènshi nà jiā gōngsī de jīnglǐ, kěyǐ bāng nǐ zhǎozhao guānxi." Wǒ shuō: "Wǒ bú yuànyì. Wǒ rènwéi kào guānxi zhǎo gōngzuò shì yǐqián de shì le." Péngyou shuō: "Nǐ zhēn bàng! Jiāyóu!"',
        vi: 'Bố tôi nói: "Bố quen giám đốc công ty đó, có thể giúp con nhờ vả quan hệ." Tôi nói: "Con không muốn. Con cho rằng dựa vào quan hệ để tìm việc là chuyện của trước đây rồi." Bạn tôi nói: "Cậu giỏi thật! Cố lên!"',
      },
      {
        ko: '面试的时候，经理问了很多问题，我都认真地{{回答}}了。他说，{{根据}}公司的{{要求}}，新员工要会{{打字}}、{{打印}}和{{复印}}，每天早上要{{打卡}}，有时候还要{{加班}}。我说我会好好{{考虑}}。',
        py: 'Miànshì de shíhou, jīnglǐ wèn le hěn duō wèntí, wǒ dōu rènzhēn de huídá le. Tā shuō, gēnjù gōngsī de yāoqiú, xīn yuángōng yào huì dǎzì, dǎyìn hé fùyìn, měi tiān zǎoshang yào dǎkǎ, yǒu shíhou hái yào jiābān. Wǒ shuō wǒ huì hǎohāo kǎolǜ.',
        vi: 'Lúc phỏng vấn, giám đốc hỏi rất nhiều câu, câu nào tôi cũng trả lời nghiêm túc. Ông nói, căn cứ theo yêu cầu của công ty, nhân viên mới phải biết đánh máy, in ấn và photocopy, sáng nào cũng phải chấm công, có lúc còn phải tăng ca. Tôi nói tôi sẽ suy nghĩ kỹ.',
      },
      {
        ko: '一个星期后，我被录用了！我每天{{开会}}，{{解决}}各种{{事情}}。经理把一个新{{项目}}交给了我。我要{{招待}}{{合作伙伴}}，还要研究{{竞争对手}}。三个月后，我{{完成}}了这个项目。',
        py: 'Yí ge xīngqī hòu, wǒ bèi lùyòng le! Wǒ měi tiān kāihuì, jiějué gè zhǒng shìqing. Jīnglǐ bǎ yí ge xīn xiàngmù jiāo gěi le wǒ. Wǒ yào zhāodài hézuò huǒbàn, hái yào yánjiū jìngzhēng duìshǒu. Sān ge yuè hòu, wǒ wánchéng le zhège xiàngmù.',
        vi: 'Một tuần sau, tôi được tuyển! Ngày nào tôi cũng họp, giải quyết đủ thứ việc. Giám đốc giao cho tôi một dự án mới. Tôi phải chiêu đãi đối tác, còn phải nghiên cứu đối thủ cạnh tranh. Ba tháng sau, tôi đã hoàn thành dự án này.',
      },
      {
        ko: '回到家，我{{回想}}这段经历，写了一篇{{感想}}。小时候我有很多{{幻想}}和{{假想}}，现在我有了真正的{{理想}}和{{梦想}}。看到公司的标志，我就会{{联想}}到自己的努力。经理说，年轻人的{{思想}}很重要。我{{想}}，只要努力，就一定会成功。',
        py: 'Huí dào jiā, wǒ huíxiǎng zhè duàn jīnglì, xiě le yì piān gǎnxiǎng. Xiǎo shíhou wǒ yǒu hěn duō huànxiǎng hé jiǎxiǎng, xiànzài wǒ yǒu le zhēnzhèng de lǐxiǎng hé mèngxiǎng. Kàndào gōngsī de biāozhì, wǒ jiù huì liánxiǎng dào zìjǐ de nǔlì. Jīnglǐ shuō, niánqīngrén de sīxiǎng hěn zhòngyào. Wǒ xiǎng, zhǐyào nǔlì, jiù yídìng huì chénggōng.',
        vi: 'Về đến nhà, tôi hồi tưởng lại quãng thời gian này, viết một bài cảm tưởng. Hồi nhỏ tôi có rất nhiều huyễn tưởng (ảo tưởng) và giả tưởng, bây giờ tôi đã có lý tưởng và mộng tưởng (ước mơ) thực sự. Nhìn thấy logo công ty, tôi lại liên tưởng đến sự cố gắng của mình. Giám đốc nói, tư tưởng của người trẻ rất quan trọng. Tôi nghĩ, chỉ cần cố gắng thì nhất định sẽ thành công.',
      },
    ],
  },

  36: {
    title: '想请几天假去旅游',
    titleVi: 'Muốn xin nghỉ mấy ngày đi du lịch',
    note: 'Dùng đủ 42 từ vựng và 4 ngữ pháp của bài: 终于, 必须, 千万, 在……下.',
    paragraphs: [
      {
        ko: '最近工作{{压力}}很大，我{{终于}}决定{{请假}}去旅游。我想去{{云南}}，朋友给我看了很多{{丽江}}的{{照片}}，那儿的{{空气}}特别好。',
        py: 'Zuìjìn gōngzuò yālì hěn dà, wǒ zhōngyú juédìng qǐngjià qù lǚyóu. Wǒ xiǎng qù Yúnnán, péngyou gěi wǒ kàn le hěn duō Lìjiāng de zhàopiàn, nàr de kōngqì tèbié hǎo.',
        vi: 'Dạo này áp lực công việc rất lớn, cuối cùng tôi quyết định xin nghỉ để đi du lịch. Tôi muốn đi Vân Nam, bạn tôi cho xem rất nhiều ảnh Lệ Giang, không khí ở đó cực kỳ trong lành.',
      },
      {
        ko: '经理说："你{{必须}}先把工作做完。"我说："好的，没问题！"同事提醒我："路上{{千万}}要注意安全！"我还向他{{借}}了一个大背包。',
        py: 'Jīnglǐ shuō: "Nǐ bìxū xiān bǎ gōngzuò zuò wán." Wǒ shuō: "Hǎo de, méi wèntí!" Tóngshì tíxǐng wǒ: "Lù shang qiānwàn yào zhùyì ānquán!" Wǒ hái xiàng tā jiè le yí ge dà bēibāo.',
        vi: 'Giám đốc nói: "Cậu bắt buộc phải làm xong việc trước đã." Tôi nói: "Vâng, không vấn đề gì!" Đồng nghiệp nhắc tôi: "Trên đường tuyệt đối phải chú ý an toàn đấy!" Tôi còn mượn anh ấy một cái ba lô to.',
      },
      {
        ko: '朋友说中国好玩的{{地方}}很多：{{南京}}、{{西安}}、{{成都}}、{{杭州}}、{{苏州}}，还有{{西藏}}和{{新疆}}。我决定先去北京，{{了解}}一下中国的{{历史}}和{{文化}}。',
        py: 'Péngyou shuō Zhōngguó hǎowán de dìfang hěn duō: Nánjīng, Xī\'ān, Chéngdū, Hángzhōu, Sūzhōu, hái yǒu Xīzàng hé Xīnjiāng. Wǒ juédìng xiān qù Běijīng, liǎojiě yíxià Zhōngguó de lìshǐ hé wénhuà.',
        vi: 'Bạn tôi nói Trung Quốc có rất nhiều nơi đáng đi: Nam Kinh, Tây An, Thành Đô, Hàng Châu, Tô Châu, còn có Tây Tạng và Tân Cương. Tôi quyết định đi Bắc Kinh trước để tìm hiểu lịch sử và văn hóa Trung Quốc.',
      },
      {
        ko: '在北京，我参观了一个{{四合院}}。导游在{{院子}}里给我们讲{{故事}}："四合院很{{简单}}：{{中间}}是院子，北边是{{正房}}，东西两边是{{厢房}}，南边是{{倒座}}，东南角是{{大门}}。"在导游的帮助下，我了解了很多。',
        py: 'Zài Běijīng, wǒ cānguān le yí ge sìhéyuàn. Dǎoyóu zài yuànzi li gěi wǒmen jiǎng gùshi: "Sìhéyuàn hěn jiǎndān: zhōngjiān shì yuànzi, běibian shì zhèngfáng, dōng xī liǎng biān shì xiāngfáng, nánbian shì dàozuò, dōngnán jiǎo shì dàmén." Zài dǎoyóu de bāngzhù xià, wǒ liǎojiě le hěn duō.',
        vi: 'Ở Bắc Kinh, tôi tham quan một căn tứ hợp viện. Hướng dẫn viên kể chuyện cho chúng tôi ngay trong sân: "Tứ hợp viện rất đơn giản: ở giữa là sân, phía bắc là nhà chính, hai bên đông tây là nhà ngang, phía nam là dãy nhà quay lưng ra phố, góc đông nam là cổng chính." Nhờ sự giúp đỡ của hướng dẫn viên, tôi hiểu thêm rất nhiều.',
      },
      {
        ko: '我{{站}}在院子里拍照，觉得四合院对中国建筑的{{影响}}很大，它是{{世界}}上很特别的房子。',
        py: 'Wǒ zhàn zài yuànzi li pāizhào, juéde sìhéyuàn duì Zhōngguó jiànzhù de yǐngxiǎng hěn dà, tā shì shìjiè shang hěn tèbié de fángzi.',
        vi: 'Tôi đứng trong sân chụp ảnh, cảm thấy tứ hợp viện có ảnh hưởng rất lớn đến kiến trúc Trung Quốc, đó là kiểu nhà rất đặc biệt trên thế giới.',
      },
      {
        ko: '导游说，以前这个四合院里住着一位{{才子}}。他很有{{才华}}，{{才能}}和{{才智}}都很高，{{多才}}多艺，会很多{{才艺}}，大家都叫他{{天才}}。他还教出了很多{{英才}}。"{{才}}"就是"能力"的意思。',
        py: 'Dǎoyóu shuō, yǐqián zhège sìhéyuàn li zhù zhe yí wèi cáizǐ. Tā hěn yǒu cáihuá, cáinéng hé cáizhì dōu hěn gāo, duōcái duōyì, huì hěn duō cáiyì, dàjiā dōu jiào tā tiāncái. Tā hái jiāo chū le hěn duō yīngcái. "Cái" jiù shì "nénglì" de yìsi.',
        vi: 'Hướng dẫn viên kể, ngày xưa trong tứ hợp viện này có một vị tài tử sống. Ông rất tài hoa, tài năng và tài trí đều cao, đa tài đa nghệ, biết rất nhiều tài nghệ, ai cũng gọi ông là thiên tài. Ông còn dạy ra rất nhiều bậc anh tài. "Tài" nghĩa là "năng lực".',
      },
    ],
  },

  37: {
    title: '师傅，我要去地铁站',
    titleVi: 'Bác tài ơi, cháu muốn đến bến tàu điện ngầm',
    note: 'Dùng đủ 41 từ vựng và 3 ngữ pháp của bài: 大约 / 左右, 比如, 从来.',
    paragraphs: [
      {
        ko: '"{{师傅}}，我要去{{地铁}}站，{{东}}门。"\n"好的，{{大约}}二十分钟就到。"',
        py: '"Shīfu, wǒ yào qù dìtiě zhàn, dōng mén."\n"Hǎo de, dàyuē èrshí fēnzhōng jiù dào."',
        vi: '"Bác tài ơi, cháu muốn đến ga tàu điện ngầm, cửa đông ạ."\n"Được, khoảng hai mươi phút là tới."',
      },
      {
        ko: '{{司机}}开得{{比较}}快。到了{{十字路口}}，{{红绿灯}}变红了，他马上停了车。一个{{交警}}站在路口。司机说："在这儿开车要{{注意}}{{速度}}。"',
        py: 'Sījī kāi de bǐjiào kuài. Dào le shízì lùkǒu, hónglǜdēng biàn hóng le, tā mǎshàng tíng le chē. Yí ge jiāojǐng zhàn zài lùkǒu. Sījī shuō: "Zài zhèr kāichē yào zhùyì sùdù."',
        vi: 'Tài xế lái khá nhanh. Đến ngã tư, đèn giao thông chuyển đỏ, bác ấy dừng xe ngay. Có một anh cảnh sát giao thông đứng ở ngã tư. Tài xế nói: "Lái xe ở đây phải chú ý tốc độ."',
      },
      {
        ko: '"师傅，前面是{{丁字路口}}吧？{{地图}}上是这样的。"\n"对，往左拐就到了。这条{{街道}}有很多{{小吃}}，可好吃了。"',
        py: '"Shīfu, qiánmiàn shì dīngzì lùkǒu ba? Dìtú shang shì zhèyàng de."\n"Duì, wǎng zuǒ guǎi jiù dào le. Zhè tiáo jiēdào yǒu hěn duō xiǎochī, kě hǎochī le."',
        vi: '"Bác ơi, phía trước là ngã ba phải không ạ? Trên bản đồ thấy vậy."\n"Đúng rồi, rẽ trái là tới. Con phố này có rất nhiều đồ ăn vặt, ngon lắm."',
      },
      {
        ko: '到了，车费三十块{{左右}}。"我没有{{现金}}，可以{{刷}}{{信用卡}}吗？"\n"不行，只能刷交通{{卡}}或者用{{微信}}。"\n我用微信付了钱，没有{{迟到}}。下车的时候我差点儿踩到师傅的{{脚}}，真不好意思。',
        py: 'Dào le, chēfèi sānshí kuài zuǒyòu. "Wǒ méiyǒu xiànjīn, kěyǐ shuā xìnyòngkǎ ma?"\n"Bù xíng, zhǐ néng shuā jiāotōng kǎ huòzhě yòng Wēixìn."\nWǒ yòng Wēixìn fù le qián, méiyǒu chídào. Xià chē de shíhou wǒ chàdiǎnr cǎi dào shīfu de jiǎo, zhēn bù hǎoyìsi.',
        vi: 'Tới nơi, tiền xe khoảng ba mươi tệ. "Cháu không có tiền mặt, quẹt thẻ tín dụng được không ạ?"\n"Không được, chỉ quẹt thẻ giao thông hoặc dùng WeChat thôi."\nTôi trả bằng WeChat, không bị muộn. Lúc xuống xe tôi suýt dẫm vào chân bác tài, ngại quá.',
      },
      {
        ko: '我坐地铁去动物园。路上看到了{{高速公路}}和{{高架铁路}}，还有一个很大的{{停车场}}。动物园里有很多{{动物}}，{{比如}}老虎、猴子，还有{{熊猫}}。我{{从来}}没{{亲眼}}看过熊猫，太可爱了！{{其他}}游客也都在拍照。',
        py: 'Wǒ zuò dìtiě qù dòngwùyuán. Lù shang kàndào le gāosù gōnglù hé gāojià tiělù, hái yǒu yí ge hěn dà de tíngchēchǎng. Dòngwùyuán li yǒu hěn duō dòngwù, bǐrú lǎohǔ, hóuzi, hái yǒu xióngmāo. Wǒ cónglái méi qīnyǎn kàn guo xióngmāo, tài kě\'ài le! Qítā yóukè yě dōu zài pāizhào.',
        vi: 'Tôi đi tàu điện ngầm đến sở thú. Trên đường thấy đường cao tốc và đường sắt trên cao, còn có một bãi đỗ xe rất lớn. Trong sở thú có rất nhiều động vật, ví dụ như hổ, khỉ, còn có cả gấu trúc. Từ trước đến nay tôi chưa từng tận mắt nhìn thấy gấu trúc, đáng yêu quá! Các du khách khác cũng đều đang chụp ảnh.',
      },
      {
        ko: '动物园旁边是博物馆，里面有很多{{文物}}和珍贵的{{植物}}标本。导游讲了很多历史{{人物}}的故事。我知道了很多新{{事物}}：古人的{{物质}}生活很简单，{{物资}}很少，{{物价}}却不便宜。还有一个展厅专门讲{{物理}}。"{{物}}"就是"东西"。',
        py: 'Dòngwùyuán pángbiān shì bówùguǎn, lǐmiàn yǒu hěn duō wénwù hé zhēnguì de zhíwù biāoběn. Dǎoyóu jiǎng le hěn duō lìshǐ rénwù de gùshi. Wǒ zhīdào le hěn duō xīn shìwù: gǔrén de wùzhì shēnghuó hěn jiǎndān, wùzī hěn shǎo, wùjià què bù piányi. Hái yǒu yí ge zhǎntīng zhuānmén jiǎng wùlǐ. "Wù" jiù shì "dōngxi".',
        vi: 'Cạnh sở thú là viện bảo tàng, bên trong có rất nhiều văn vật và mẫu thực vật quý. Hướng dẫn viên kể nhiều chuyện về các nhân vật lịch sử. Tôi biết thêm rất nhiều sự vật mới: đời sống vật chất của người xưa rất đơn giản, vật tư ít ỏi, vật giá lại không hề rẻ. Còn có một phòng trưng bày chuyên về vật lý. "Vật" chính là "đồ vật".',
      },
    ],
  },

  38: {
    title: '教室没有图书馆安静',
    titleVi: 'Phòng học không yên tĩnh bằng thư viện',
    note: 'Dùng đủ 39 từ vựng và 4 ngữ pháp của bài: 几乎, 后来, 最后, 肯定.',
    paragraphs: [
      {
        ko: '真{{奇怪}}，{{太阳}}从{{西}}边出来了吗？我的同屋Wang今天早上六点就去{{图书馆}}了！他说：{{教室}}没有图书馆安静。',
        py: 'Zhēn qíguài, tàiyáng cóng xībian chūlai le ma? Wǒ de tóngwū Wang jīntiān zǎoshang liù diǎn jiù qù túshūguǎn le! Tā shuō: jiàoshì méiyǒu túshūguǎn ānjìng.',
        vi: 'Lạ thật, mặt trời mọc đằng tây à? Bạn cùng phòng của tôi là Wang sáu giờ sáng nay đã lên thư viện rồi! Cậu ấy nói: phòng học không yên tĩnh bằng thư viện.',
      },
      {
        ko: 'Wang是我们{{班级}}的{{学霸}}。这个{{学期}}他{{几乎}}每天都在学习。{{课程表}}上的{{必修课}}和{{选修课}}他一节也不落，{{文学}}、{{数学}}都学得很好。',
        py: 'Wang shì wǒmen bānjí de xuébà. Zhège xuéqī tā jīhū měi tiān dōu zài xuéxí. Kèchéngbiǎo shang de bìxiūkè hé xuǎnxiūkè tā yì jié yě bú là, wénxué, shùxué dōu xué de hěn hǎo.',
        vi: 'Wang là "học bá" của lớp tôi. Học kỳ này hầu như ngày nào cậu ấy cũng học. Môn bắt buộc lẫn môn tự chọn trên thời khóa biểu cậu ấy không bỏ buổi nào, văn học hay toán đều học rất giỏi.',
      },
      {
        ko: '上个月学校有一个数学{{比赛}}，{{班主任}}让他参加。比赛的{{题}}很难，可是他{{最后}}{{获得}}了第一名，{{得}}了一千块奖金，正好用来交{{学费}}。{{校长}}也{{提}}到了他，学校的{{新闻}}上还有他的照片。',
        py: 'Shàng ge yuè xuéxiào yǒu yí ge shùxué bǐsài, bānzhǔrèn ràng tā cānjiā. Bǐsài de tí hěn nán, kěshì tā zuìhòu huòdé le dì yī míng, dé le yìqiān kuài jiǎngjīn, zhènghǎo yònglái jiāo xuéfèi. Xiàozhǎng yě tí dào le tā, xuéxiào de xīnwén shang hái yǒu tā de zhàopiàn.',
        vi: 'Tháng trước trường có một cuộc thi toán, giáo viên chủ nhiệm cho cậu ấy tham gia. Đề thi rất khó, nhưng cuối cùng cậu ấy giành giải nhất, đạt một nghìn tệ tiền thưởng, vừa đủ để đóng học phí. Hiệu trưởng cũng nhắc đến cậu ấy, trên bản tin của trường còn có ảnh cậu ấy.',
      },
      {
        ko: '其实以前他的成绩不好，{{后来}}才慢慢变好的。他说，不努力就会{{落后}}，{{后果}}很严重。他每天都在{{笔记本}}上写学习计划。',
        py: 'Qíshí yǐqián tā de chéngjì bù hǎo, hòulái cái mànmàn biàn hǎo de. Tā shuō, bù nǔlì jiù huì luòhòu, hòuguǒ hěn yánzhòng. Tā měi tiān dōu zài bǐjìběn shang xiě xuéxí jìhuà.',
        vi: 'Thật ra trước đây thành tích của cậu ấy không tốt, về sau mới dần tiến bộ. Cậu ấy nói không cố gắng thì sẽ bị lạc hậu (tụt lại), hậu quả rất nghiêm trọng. Ngày nào cậu ấy cũng viết kế hoạch học tập vào sổ.',
      },
      {
        ko: '我问他喜欢什么运动。他说："我{{体育}}不好，可是我{{肯定}}会坚持跑步。"他还{{教}}我做数学题。图书馆的{{灯}}晚上十点才关，他总是等大家都走了以{{后}}才离开。',
        py: 'Wǒ wèn tā xǐhuan shénme yùndòng. Tā shuō: "Wǒ tǐyù bù hǎo, kěshì wǒ kěndìng huì jiānchí pǎobù." Tā hái jiāo wǒ zuò shùxué tí. Túshūguǎn de dēng wǎnshang shí diǎn cái guān, tā zǒngshì děng dàjiā dōu zǒu le yǐhòu cái líkāi.',
        vi: 'Tôi hỏi cậu ấy thích môn thể thao nào. Cậu ấy nói: "Mình học thể dục kém, nhưng chắc chắn mình sẽ kiên trì chạy bộ." Cậu ấy còn dạy tôi làm bài toán. Đèn thư viện mười giờ tối mới tắt, lúc nào cậu ấy cũng đợi mọi người về hết rồi mới rời đi.',
      },
      {
        ko: 'Wang说，家人是他的{{后盾}}，也是他的{{后方}}。他的爸爸在学校做{{后勤}}工作。Wang喜欢看古装剧，里面有{{皇后}}和{{后宫}}的故事。他还笑着说，他家是一位古代名人的{{后裔}}！',
        py: 'Wang shuō, jiārén shì tā de hòudùn, yě shì tā de hòufāng. Tā de bàba zài xuéxiào zuò hòuqín gōngzuò. Wang xǐhuan kàn gǔzhuāngjù, lǐmiàn yǒu huánghòu hé hòugōng de gùshi. Tā hái xiào zhe shuō, tā jiā shì yí wèi gǔdài míngrén de hòuyì!',
        vi: 'Wang nói gia đình là hậu thuẫn, cũng là hậu phương của cậu ấy. Bố cậu ấy làm công việc hậu cần ở trường. Wang thích xem phim cổ trang, trong đó có chuyện về hoàng hậu và hậu cung. Cậu ấy còn cười bảo nhà mình là hậu duệ của một danh nhân thời xưa!',
      },
    ],
  },

  39: {
    title: '健康最重要',
    titleVi: 'Sức khỏe quan trọng nhất',
    note: 'Dùng đủ 35 từ vựng và 4 ngữ pháp của bài: 估计, 不仅, 尤其, 再说.',
    paragraphs: [
      {
        ko: '最近我咳嗽得很{{厉害}}，{{估计}}是感冒了。正好公司{{安排}}大家去{{体检}}，医生给我做了{{检查}}。',
        py: 'Zuìjìn wǒ késou de hěn lìhai, gūjì shì gǎnmào le. Zhènghǎo gōngsī ānpái dàjiā qù tǐjiǎn, yīshēng gěi wǒ zuò le jiǎnchá.',
        vi: 'Dạo này tôi ho rất dữ, đoán chừng là bị cảm. Vừa hay công ty sắp xếp cho mọi người đi khám sức khỏe, bác sĩ kiểm tra cho tôi.',
      },
      {
        ko: '医生说："你不是感冒，{{也许}}是{{空气}}不好。出门要戴{{口罩}}。"他给我开了药，说{{使用}}一个星期就好，{{药到病除}}。',
        py: 'Yīshēng shuō: "Nǐ bú shì gǎnmào, yěxǔ shì kōngqì bù hǎo. Chūmén yào dài kǒuzhào." Tā gěi wǒ kāi le yào, shuō shǐyòng yí ge xīngqī jiù hǎo, yào dào bìng chú.',
        vi: 'Bác sĩ nói: "Cậu không bị cảm đâu, có lẽ do không khí không tốt. Ra ngoài phải đeo khẩu trang." Ông kê thuốc cho tôi, nói dùng một tuần là khỏi, thuốc vào là hết bệnh.',
      },
      {
        ko: '医生还说，药{{不仅}}要按时吃，还要多休息。头疼的时候可以吃{{止痛药}}，平时可以吃点儿{{维生素}}。很多人喜欢买{{保健品}}和{{补药}}，可是{{效果}}不一定好。',
        py: 'Yīshēng hái shuō, yào bùjǐn yào ànshí chī, hái yào duō xiūxi. Tóu téng de shíhou kěyǐ chī zhǐtòngyào, píngshí kěyǐ chī diǎnr wéishēngsù. Hěn duō rén xǐhuan mǎi bǎojiànpǐn hé bǔyào, kěshì xiàoguǒ bù yídìng hǎo.',
        vi: 'Bác sĩ còn nói, không những phải uống thuốc đúng giờ mà còn phải nghỉ ngơi nhiều. Lúc đau đầu có thể uống thuốc giảm đau, bình thường có thể uống chút vitamin. Nhiều người thích mua thực phẩm chức năng và thuốc bổ, nhưng hiệu quả chưa chắc đã tốt.',
      },
      {
        ko: '我叔叔得了重病，正在医院{{治疗}}，还做了{{化疗}}。他现在没什么{{力气}}，说话的{{语气}}也很弱。可是他很有{{勇气}}，也很有{{志气}}。',
        py: 'Wǒ shūshu dé le zhòngbìng, zhèngzài yīyuàn zhìliáo, hái zuò le huàliáo. Tā xiànzài méi shénme lìqi, shuōhuà de yǔqì yě hěn ruò. Kěshì tā hěn yǒu yǒngqì, yě hěn yǒu zhìqì.',
        vi: 'Chú tôi bị bệnh nặng, đang chữa trị ở bệnh viện, còn phải hóa trị. Giờ chú không còn mấy sức lực, ngữ khí khi nói chuyện cũng yếu. Nhưng chú rất có dũng khí, cũng rất có chí khí.',
      },
      {
        ko: '叔叔以前是一位很有{{气质}}的老师，上课很有{{气势}}，说话的{{口气}}从来不急。他常说："人活着就要争一口{{气}}！"',
        py: 'Shūshu yǐqián shì yí wèi hěn yǒu qìzhì de lǎoshī, shàngkè hěn yǒu qìshì, shuōhuà de kǒuqì cónglái bù jí. Tā cháng shuō: "Rén huó zhe jiù yào zhēng yì kǒu qì!"',
        vi: 'Chú tôi trước đây là một thầy giáo rất có khí chất, giảng bài rất có khí thế, khẩu khí lúc nói chuyện chưa bao giờ nóng vội. Chú hay nói: "Người ta sống là phải giữ lấy một chữ khí (phải có chí)!"',
      },
      {
        ko: '为了健康，我想{{减肥}}，就每天{{坚持}}爬楼梯，从一{{层}}爬到十二层。{{再说}}，运动也让我的心情变好了。我家阳台上到{{处}}都是{{绿}}色{{植物}}，{{尤其}}是夏天，看起来特别舒服。这里的{{气候}}很好，植物长得很快。',
        py: 'Wèile jiànkāng, wǒ xiǎng jiǎnféi, jiù měi tiān jiānchí pá lóutī, cóng yī céng pá dào shí\'èr céng. Zàishuō, yùndòng yě ràng wǒ de xīnqíng biàn hǎo le. Wǒ jiā yángtái shang dàochù dōu shì lǜsè zhíwù, yóuqí shì xiàtiān, kàn qǐlái tèbié shūfu. Zhèlǐ de qìhòu hěn hǎo, zhíwù zhǎng de hěn kuài.',
        vi: 'Vì sức khỏe, tôi muốn giảm cân nên ngày nào cũng kiên trì leo cầu thang, từ tầng một lên tầng mười hai. Hơn nữa, vận động cũng khiến tâm trạng tôi tốt hơn. Ban công nhà tôi chỗ nào cũng có cây xanh, đặc biệt là vào mùa hè, nhìn rất dễ chịu. Khí hậu ở đây rất tốt, cây cối lớn rất nhanh.',
      },
    ],
  },

  40: {
    title: '欢迎参加今天的面试',
    titleVi: 'Chào mừng bạn đến tham gia buổi phỏng vấn hôm nay',
    note: 'Dùng đủ 39 từ vựng và 4 ngữ pháp của bài: 在……上, 本来, 要是……，就……, 关于.',
    paragraphs: [
      {
        ko: '我是{{经济}}{{专业}}的学生，今年{{毕业}}。一家公司在网上{{招聘}}，我给他们{{投简历}}，{{应聘}}市场{{部}}的工作。',
        py: 'Wǒ shì jīngjì zhuānyè de xuésheng, jīnnián bìyè. Yì jiā gōngsī zài wǎng shang zhāopìn, wǒ gěi tāmen tóu jiǎnlì, yìngpìn shìchǎng bù de gōngzuò.',
        vi: 'Tôi là sinh viên chuyên ngành kinh tế, năm nay tốt nghiệp. Một công ty tuyển dụng trên mạng, tôi gửi hồ sơ ứng tuyển vào phòng thị trường của họ.',
      },
      {
        ko: '我先参加了{{笔试}}，然后是面试。经理说："欢迎参加今天的面试。请{{主动}}介绍一下自己。你有什么{{缺点}}？"我说："我{{本来}}很害羞，可是现在在工作上很主动。"',
        py: 'Wǒ xiān cānjiā le bǐshì, ránhòu shì miànshì. Jīnglǐ shuō: "Huānyíng cānjiā jīntiān de miànshì. Qǐng zhǔdòng jièshào yíxià zìjǐ. Nǐ yǒu shénme quēdiǎn?" Wǒ shuō: "Wǒ běnlái hěn hàixiū, kěshì xiànzài zài gōngzuò shang hěn zhǔdòng."',
        vi: 'Tôi thi viết trước, sau đó là phỏng vấn. Giám đốc nói: "Chào mừng bạn đến buổi phỏng vấn hôm nay. Mời bạn chủ động giới thiệu bản thân. Bạn có khuyết điểm gì?" Tôi nói: "Vốn dĩ em rất nhút nhát, nhưng bây giờ trong công việc em rất chủ động."',
      },
      {
        ko: '经理问我有没有工作{{经验}}。我说我在大学{{当}}过{{研究员}}的助手，做过{{关于}}{{市场}}的{{研究}}，对这个行业很{{熟悉}}。经理说公司很{{重视}}年轻人，要是我愿意{{出差}}，就会有很多机会。',
        py: 'Jīnglǐ wèn wǒ yǒu méiyǒu gōngzuò jīngyàn. Wǒ shuō wǒ zài dàxué dāng guo yánjiūyuán de zhùshǒu, zuò guo guānyú shìchǎng de yánjiū, duì zhège hángyè hěn shúxī. Jīnglǐ shuō gōngsī hěn zhòngshì niánqīngrén, yàoshi wǒ yuànyì chūchāi, jiù huì yǒu hěn duō jīhuì.',
        vi: 'Giám đốc hỏi tôi có kinh nghiệm làm việc không. Tôi nói ở đại học tôi từng làm trợ lý cho một nghiên cứu viên, từng làm nghiên cứu về thị trường, nên rất quen thuộc với ngành này. Giám đốc nói công ty rất coi trọng người trẻ, nếu tôi sẵn sàng đi công tác thì sẽ có rất nhiều cơ hội.',
      },
      {
        ko: '{{经过}}一个星期，{{结果}}出来了：我被{{录取}}了！公司给我发了{{通知}}，还寄来了录取{{通知书}}。{{签合同}}的时候，经理说{{试用期}}三个月，{{月薪}}八千块，{{待遇}}很好。在这家公司工作有很多{{好处}}。',
        py: 'Jīngguò yí ge xīngqī, jiéguǒ chūlai le: wǒ bèi lùqǔ le! Gōngsī gěi wǒ fā le tōngzhī, hái jì lái le lùqǔ tōngzhīshū. Qiān hétong de shíhou, jīnglǐ shuō shìyòngqī sān ge yuè, yuèxīn bāqiān kuài, dàiyù hěn hǎo. Zài zhè jiā gōngsī gōngzuò yǒu hěn duō hǎochù.',
        vi: 'Sau một tuần, kết quả có rồi: tôi trúng tuyển! Công ty gửi thông báo cho tôi, còn gửi cả giấy báo trúng tuyển. Lúc ký hợp đồng, giám đốc nói thời gian thử việc ba tháng, lương tháng tám nghìn tệ, đãi ngộ rất tốt. Làm ở công ty này có rất nhiều điểm tốt.',
      },
      {
        ko: '第一天，公司开会的{{主题}}是"{{民主}}管理"。公司{{主席}}说，每个人都可以{{自主}}发表意见，但不要太{{主观}}；公司不搞形式{{主义}}。他还讲到了国家{{主权}}。最后他说："你们都是公司的{{主}}人！"',
        py: 'Dì yī tiān, gōngsī kāihuì de zhǔtí shì "mínzhǔ guǎnlǐ". Gōngsī zhǔxí shuō, měi ge rén dōu kěyǐ zìzhǔ fābiǎo yìjiàn, dàn búyào tài zhǔguān; gōngsī bù gǎo xíngshì zhǔyì. Tā hái jiǎng dào le guójiā zhǔquán. Zuìhòu tā shuō: "Nǐmen dōu shì gōngsī de zhǔrén!"',
        vi: 'Ngày đầu tiên, chủ đề cuộc họp của công ty là "quản lý dân chủ". Chủ tịch công ty nói, mỗi người đều có thể tự chủ phát biểu ý kiến nhưng đừng quá chủ quan; công ty không làm theo chủ nghĩa hình thức. Ông còn nhắc tới chủ quyền quốc gia. Cuối cùng ông nói: "Các bạn đều là chủ nhân của công ty!"',
      },
    ],
  },

  41: {
    title: '第一天上班',
    titleVi: 'Ngày đầu tiên đi làm',
    note: 'Dùng đủ 39 từ vựng và 5 ngữ pháp của bài: 原来, 以为, 并, 首先……，其次……, 不管……，还是 / 都…….',
    paragraphs: [
      {
        ko: '今天是我{{正式}}上班的第一天，我很{{兴奋}}。上大学的时候，我只做过{{兼职}}，在饭馆{{打工}}；现在我终于有了一份{{全职}}工作。',
        py: 'Jīntiān shì wǒ zhèngshì shàngbān de dì yī tiān, wǒ hěn xīngfèn. Shàng dàxué de shíhou, wǒ zhǐ zuò guo jiānzhí, zài fànguǎn dǎgōng; xiànzài wǒ zhōngyú yǒu le yí fèn quánzhí gōngzuò.',
        vi: 'Hôm nay là ngày đầu tiên tôi chính thức đi làm, tôi rất phấn khích. Hồi đại học tôi chỉ làm bán thời gian, làm thêm ở quán ăn; giờ cuối cùng tôi đã có một công việc toàn thời gian.',
      },
      {
        ko: '我{{原来}}{{以为}}上班很简单，其实{{并不}}容易。{{导师}}告诉我："{{首先}}，你要了解{{企业文化}}；{{其次}}，要遵守{{公司纪律}}，每天{{准时}}上班，一{{秒}}也不能晚。{{不管}}多忙，都要注意{{穿着}}。"',
        py: 'Wǒ yuánlái yǐwéi shàngbān hěn jiǎndān, qíshí bìng bù róngyì. Dǎoshī gàosu wǒ: "Shǒuxiān, nǐ yào liǎojiě qǐyè wénhuà; qícì, yào zūnshǒu gōngsī jìlǜ, měi tiān zhǔnshí shàngbān, yì miǎo yě bù néng wǎn. Bùguǎn duō máng, dōu yào zhùyì chuānzhuó."',
        vi: 'Ban đầu tôi tưởng đi làm rất đơn giản, thực ra không hề dễ. Người hướng dẫn bảo tôi: "Đầu tiên, em phải tìm hiểu văn hóa công ty; tiếp theo, phải tuân thủ nội quy, ngày nào cũng đi làm đúng giờ, muộn một giây cũng không được. Dù bận đến đâu cũng phải chú ý cách ăn mặc."',
      },
      {
        ko: '我的{{上级}}说："你现在{{缺少}}的是经验。工作要一{{步}}一步来，慢慢{{积累}}。好的{{态度}}比{{能力}}更重要，只想{{赚}}钱是不行的。"我{{明白}}了，把这些话都{{记住}}了。',
        py: 'Wǒ de shàngjí shuō: "Nǐ xiànzài quēshǎo de shì jīngyàn. Gōngzuò yào yí bù yí bù lái, mànmàn jīlěi. Hǎo de tàidu bǐ nénglì gèng zhòngyào, zhǐ xiǎng zhuàn qián shì bù xíng de." Wǒ míngbai le, bǎ zhèxiē huà dōu jì zhù le.',
        vi: 'Cấp trên của tôi nói: "Cái em đang thiếu là kinh nghiệm. Làm việc phải từng bước một, từ từ tích lũy. Thái độ tốt còn quan trọng hơn năng lực, chỉ nghĩ đến kiếm tiền là không được." Tôi đã hiểu, ghi nhớ hết những lời này.',
      },
      {
        ko: '下班的时候，经理说我给大家{{留下}}了很好的{{印象}}，还{{祝贺}}我第一天工作很{{顺利}}。',
        py: 'Xiàbān de shíhou, jīnglǐ shuō wǒ gěi dàjiā liúxià le hěn hǎo de yìnxiàng, hái zhùhè wǒ dì yī tiān gōngzuò hěn shùnlì.',
        vi: 'Lúc tan làm, giám đốc nói tôi đã để lại ấn tượng rất tốt với mọi người, còn chúc mừng ngày làm việc đầu tiên của tôi rất thuận lợi.',
      },
      {
        ko: '我们公司是做牛奶的，{{原料}}来自内蒙古的大{{草原}}。经理说做产品有一个{{原则}}：质量第一。产品出了问题，就要找{{原因}}，弄清楚{{原理}}。有一次，一位顾客做{{原告}}，跟公司打了官司。',
        py: 'Wǒmen gōngsī shì zuò niúnǎi de, yuánliào láizì Nèiměnggǔ de dà cǎoyuán. Jīnglǐ shuō zuò chǎnpǐn yǒu yí ge yuánzé: zhìliàng dì yī. Chǎnpǐn chū le wèntí, jiù yào zhǎo yuányīn, nòng qīngchu yuánlǐ. Yǒu yí cì, yí wèi gùkè zuò yuángào, gēn gōngsī dǎ le guānsi.',
        vi: 'Công ty tôi sản xuất sữa, nguyên liệu lấy từ thảo nguyên rộng lớn của Nội Mông. Giám đốc nói làm sản phẩm có một nguyên tắc: chất lượng là trên hết. Sản phẩm có vấn đề thì phải tìm nguyên nhân, làm rõ nguyên lý. Có lần một khách hàng làm nguyên cáo (bên khởi kiện), kiện công ty ra tòa.',
      },
      {
        ko: '经理大学学的是物理，研究过{{原子}}。他喜欢看小说的{{原作}}，不喜欢看改编的电视剧。"{{原}}"就是"最开始的"意思。',
        py: 'Jīnglǐ dàxué xué de shì wùlǐ, yánjiū guo yuánzǐ. Tā xǐhuan kàn xiǎoshuō de yuánzuò, bù xǐhuan kàn gǎibiān de diànshìjù. "Yuán" jiù shì "zuì kāishǐ de" yìsi.',
        vi: 'Hồi đại học giám đốc học vật lý, từng nghiên cứu nguyên tử. Ông thích đọc nguyên tác tiểu thuyết, không thích xem phim truyền hình chuyển thể. "Nguyên" nghĩa là "cái ban đầu nhất".',
      },
    ],
  },

  42: {
    title: '生意终于谈成了',
    titleVi: 'Việc kinh doanh cuối cùng đã đàm phán xong',
    note: 'Dùng đủ 37 từ vựng và 4 ngữ pháp của bài: 竟然, 尽管……，但是 / 还是……, 只要……，就……, 来不及.',
    paragraphs: [
      {
        ko: '好{{消息}}！这笔{{生意}}终于{{谈}}成了！',
        py: 'Hǎo xiāoxi! Zhè bǐ shēngyi zhōngyú tán chéng le!',
        vi: 'Tin vui! Thương vụ này cuối cùng cũng đàm phán xong rồi!',
      },
      {
        ko: '上个月经理给了我一个{{任务}}：跟一家越南公司做生意。这个任务很{{复杂}}，{{困难}}很多。我准备的{{材料}}不{{够}}，第一次谈判{{失败}}了，同事们都为我{{不平}}。',
        py: 'Shàng ge yuè jīnglǐ gěi le wǒ yí ge rènwu: gēn yì jiā Yuènán gōngsī zuò shēngyi. Zhège rènwu hěn fùzá, kùnnan hěn duō. Wǒ zhǔnbèi de cáiliào bú gòu, dì yī cì tánpàn shībài le, tóngshìmen dōu wèi wǒ bùpíng.',
        vi: 'Tháng trước giám đốc giao cho tôi một nhiệm vụ: làm ăn với một công ty Việt Nam. Nhiệm vụ này rất phức tạp, nhiều khó khăn. Tài liệu tôi chuẩn bị không đủ, lần đàm phán đầu tiên thất bại, các đồng nghiệp đều bất bình thay tôi.',
      },
      {
        ko: '{{尽管}}很难，但是我没有放弃。我每天跟客户{{联系}}，重新做了{{计划}}，还听了同事们的{{意见}}和{{建议}}。我相信只要努力，就能成功。',
        py: 'Jǐnguǎn hěn nán, dànshì wǒ méiyǒu fàngqì. Wǒ měi tiān gēn kèhù liánxì, chóngxīn zuò le jìhuà, hái tīng le tóngshìmen de yìjiàn hé jiànyì. Wǒ xiāngxìn zhǐyào nǔlì, jiù néng chénggōng.',
        vi: 'Dù rất khó nhưng tôi không bỏ cuộc. Ngày nào tôi cũng liên lạc với khách hàng, lập lại kế hoạch, còn lắng nghe ý kiến và đề xuất của đồng nghiệp. Tôi tin chỉ cần cố gắng là sẽ thành công.',
      },
      {
        ko: '公司各个部门都来帮忙：{{人事行政部}}、{{财务会计部}}、{{企划部}}、{{营销部}}、{{客服部}}、{{研发部}}、{{生产部}}和{{质控部}}。营销部还专门做了一个新{{广告}}。',
        py: 'Gōngsī gègè bùmén dōu lái bāngmáng: rénshì xíngzhèng bù, cáiwù kuàijì bù, qǐhuà bù, yíngxiāo bù, kèfú bù, yánfā bù, shēngchǎn bù hé zhìkòng bù. Yíngxiāo bù hái zhuānmén zuò le yí ge xīn guǎnggào.',
        vi: 'Các phòng ban trong công ty đều đến giúp: phòng hành chính nhân sự, phòng tài chính kế toán, phòng kế hoạch, phòng kinh doanh, phòng dịch vụ khách hàng, phòng nghiên cứu và phát triển, phòng sản xuất và phòng quản lý chất lượng. Phòng kinh doanh còn làm riêng một quảng cáo mới.',
      },
      {
        ko: '签合同那天，我{{提前}}一个小时到了公司，可是事情太多，差点儿{{来不及}}准备。没想到客户{{竟然}}马上就签了字！经理给了我一大笔{{奖金}}。回到家，我躺在{{沙发}}上，开心极了。',
        py: 'Qiān hétong nà tiān, wǒ tíqián yí ge xiǎoshí dào le gōngsī, kěshì shìqing tài duō, chàdiǎnr láibují zhǔnbèi. Méi xiǎngdào kèhù jìngrán mǎshàng jiù qiān le zì! Jīnglǐ gěi le wǒ yí dà bǐ jiǎngjīn. Huí dào jiā, wǒ tǎng zài shāfā shang, kāixīn jí le.',
        vi: 'Hôm ký hợp đồng, tôi đến công ty sớm một tiếng, nhưng việc nhiều quá, suýt nữa không kịp chuẩn bị. Không ngờ khách hàng lại ký ngay lập tức! Giám đốc thưởng cho tôi một khoản tiền thưởng lớn. Về đến nhà, tôi nằm dài trên sofa, vui không tả nổi.',
      },
      {
        ko: '"{{不}}"字有很多意思。谈判开始的时候，形势对我们很{{不利}}，双方意见{{不同}}，我心里很{{不安}}。客户觉得来我们公司{{不便}}，我们就去他们公司。尽管困难很多，我的决心{{不变}}，{{不动}}摇。妈妈说我太忙，很久不回家看她，有点儿{{不孝}}，我得多回家了。',
        py: '"Bù" zì yǒu hěn duō yìsi. Tánpàn kāishǐ de shíhou, xíngshì duì wǒmen hěn búlì, shuāngfāng yìjiàn bù tóng, wǒ xīnli hěn bù\'ān. Kèhù juéde lái wǒmen gōngsī búbiàn, wǒmen jiù qù tāmen gōngsī. Jǐnguǎn kùnnan hěn duō, wǒ de juéxīn búbiàn, bú dòngyáo. Māma shuō wǒ tài máng, hěn jiǔ bù huí jiā kàn tā, yǒudiǎnr búxiào, wǒ děi duō huí jiā le.',
        vi: 'Chữ "bất" có rất nhiều nghĩa. Lúc bắt đầu đàm phán, tình thế rất bất lợi cho chúng tôi, ý kiến hai bên bất đồng, trong lòng tôi rất bất an. Khách hàng thấy đến công ty chúng tôi bất tiện, chúng tôi bèn sang công ty họ. Dù nhiều khó khăn, quyết tâm của tôi vẫn bất biến, bất động (không lay chuyển). Mẹ nói tôi bận quá, lâu lắm không về thăm mẹ, hơi bất hiếu, tôi phải về nhà nhiều hơn mới được.',
      },
    ],
  },

  43: {
    title: '爸，我想换工作',
    titleVi: 'Bố, con muốn đổi công việc',
    note: 'Dùng đủ 38 từ vựng và 4 ngữ pháp của bài: động từ + 过来, 与, 可是, 反正.',
    paragraphs: [
      {
        ko: '"爸，我想换工作。"\n"为什么？"\n"现在的工作{{收入}}太{{低}}，我也{{完全}}不能{{适应}}。经理{{脾气}}不好，常常{{发脾气}}，我很{{讨厌}}他。"',
        py: '"Bà, wǒ xiǎng huàn gōngzuò."\n"Wèishénme?"\n"Xiànzài de gōngzuò shōurù tài dī, wǒ yě wánquán bù néng shìyìng. Jīnglǐ píqi bù hǎo, chángcháng fā píqi, wǒ hěn tǎoyàn tā."',
        vi: '"Bố ơi, con muốn đổi việc."\n"Tại sao?"\n"Thu nhập công việc bây giờ thấp quá, con cũng hoàn toàn không thích ứng được. Giám đốc tính khí không tốt, hay nổi nóng, con rất ghét ông ấy."',
      },
      {
        ko: '"你想{{跳槽}}，还是想{{转行}}？"\n"我想转行。我已经写好了{{辞职信}}，明天就{{交}}给经理。"',
        py: '"Nǐ xiǎng tiàocáo, háishi xiǎng zhuǎnháng?"\n"Wǒ xiǎng zhuǎnháng. Wǒ yǐjīng xiě hǎo le cízhíxìn, míngtiān jiù jiāo gěi jīnglǐ."',
        vi: '"Con muốn nhảy việc hay muốn chuyển ngành?"\n"Con muốn chuyển ngành. Con viết xong đơn từ chức rồi, mai nộp cho giám đốc."',
      },
      {
        ko: '爸爸说："先别急。年轻人工作都很{{苦}}，可是积累的经验很{{丰富}}，这是一笔财富。你要学会{{与}}同事{{交流}}，找到好的{{方法}}。做人要有{{责任心}}，要对自己的工作负{{责任}}。"',
        py: 'Bàba shuō: "Xiān bié jí. Niánqīngrén gōngzuò dōu hěn kǔ, kěshì jīlěi de jīngyàn hěn fēngfù, zhè shì yì bǐ cáifù. Nǐ yào xuéhuì yǔ tóngshì jiāoliú, zhǎodào hǎo de fāngfǎ. Zuò rén yào yǒu zérènxīn, yào duì zìjǐ de gōngzuò fù zérèn."',
        vi: 'Bố nói: "Đừng vội. Người trẻ đi làm ai cũng vất vả, nhưng kinh nghiệm tích lũy được rất phong phú, đó là một tài sản. Con phải học cách giao lưu với đồng nghiệp, tìm ra phương pháp tốt. Làm người phải có lòng trách nhiệm, phải chịu trách nhiệm với công việc của mình."',
      },
      {
        ko: '"{{可是}}我在这儿没有前途，不能{{升职}}，也不能{{调职}}到别的部门。去年公司还把我的朋友{{炒鱿鱼}}了。"\n"那{{年终奖}}呢？明年要不要{{续约}}？"\n"{{反正}}我不想续约了。"',
        py: '"Kěshì wǒ zài zhèr méiyǒu qiántú, bù néng shēngzhí, yě bù néng diàozhí dào bié de bùmén. Qùnián gōngsī hái bǎ wǒ de péngyou chǎo yóuyú le."\n"Nà niánzhōngjiǎng ne? Míngnián yào bu yào xùyuē?"\n"Fǎnzhèng wǒ bù xiǎng xùyuē le."',
        vi: '"Nhưng ở đây con không có tương lai, không được thăng chức, cũng không được điều chuyển sang phòng khác. Năm ngoái công ty còn sa thải bạn con nữa."\n"Thế còn thưởng cuối năm? Năm sau có ký tiếp hợp đồng không?"\n"Dù sao thì con cũng không muốn ký tiếp nữa."',
      },
      {
        ko: '爸爸笑了："工作就像吃饭，{{各}}有各的{{味道}}。你的{{性格}}我知道，一旦决定了就不会{{改变}}。好吧，我支持你。"我心里的结终于解开了，人也想明白过来了。',
        py: 'Bàba xiào le: "Gōngzuò jiù xiàng chī fàn, gè yǒu gè de wèidao. Nǐ de xìnggé wǒ zhīdào, yídàn juédìng le jiù bú huì gǎibiàn. Hǎo ba, wǒ zhīchí nǐ." Wǒ xīnli de jié zhōngyú jiě kāi le, rén yě xiǎng míngbai guòlai le.',
        vi: 'Bố cười: "Công việc cũng như ăn cơm, mỗi món một vị. Tính cách con bố biết, đã quyết rồi thì sẽ không thay đổi. Được rồi, bố ủng hộ con." Nút thắt trong lòng tôi cuối cùng cũng được gỡ, đầu óc cũng thông suốt trở lại.',
      },
      {
        ko: '那天晚上我们{{讨论}}了很久，还{{争论}}了好几次，像{{辩论}}一样。爸爸是大学老师，喜欢讲{{理论}}，他的{{论文}}发表在很多杂志上。他说，别在乎别人怎么{{议论}}，也别怕{{舆论}}。最后的{{结论}}是：做自己喜欢的事。"{{论}}"就是"讲道理"。',
        py: 'Nà tiān wǎnshang wǒmen tǎolùn le hěn jiǔ, hái zhēnglùn le hǎo jǐ cì, xiàng biànlùn yíyàng. Bàba shì dàxué lǎoshī, xǐhuan jiǎng lǐlùn, tā de lùnwén fābiǎo zài hěn duō zázhì shang. Tā shuō, bié zàihu biérén zěnme yìlùn, yě bié pà yúlùn. Zuìhòu de jiélùn shì: zuò zìjǐ xǐhuan de shì. "Lùn" jiù shì "jiǎng dàolǐ".',
        vi: 'Tối hôm đó hai bố con thảo luận rất lâu, còn tranh luận mấy lần, như biện luận vậy. Bố là giảng viên đại học, thích nói lý luận, luận văn của bố đăng trên rất nhiều tạp chí. Bố bảo đừng để ý người khác nghị luận thế nào, cũng đừng sợ dư luận. Kết luận cuối cùng là: làm việc mình thích. "Luận" nghĩa là "nói có lý lẽ".',
      },
    ],
  },

  44: {
    title: '节约小钱，却是浪费大钱',
    titleVi: 'Tiết kiệm khoản nhỏ lại là lãng phí món to',
    note: 'Dùng đủ 38 từ vựng và 4 ngữ pháp của bài: 从……来看, 另外, 是否, 却.',
    paragraphs: [
      {
        ko: '我妈妈很喜欢{{节约}}。上个月商场{{举行}}{{打折}}{{活动}}，她去{{逛}}了一整天，{{顺便}}买了很多便宜衣服。',
        py: 'Wǒ māma hěn xǐhuan jiéyuē. Shàng ge yuè shāngchǎng jǔxíng dǎzhé huódòng, tā qù guàng le yì zhěng tiān, shùnbiàn mǎi le hěn duō piányi yīfu.',
        vi: 'Mẹ tôi rất thích tiết kiệm. Tháng trước trung tâm thương mại tổ chức chương trình giảm giá, mẹ đi dạo cả ngày, tiện thể mua rất nhiều quần áo rẻ.',
      },
      {
        ko: '可是那些衣服{{质量}}不好，洗了一次就{{掉}}色了。她想{{退货}}，可是打折的衣服不能退。我说："节约小钱，{{却}}是{{浪费}}大钱啊！"',
        py: 'Kěshì nàxiē yīfu zhìliàng bù hǎo, xǐ le yí cì jiù diào sè le. Tā xiǎng tuìhuò, kěshì dǎzhé de yīfu bù néng tuì. Wǒ shuō: "Jiéyuē xiǎo qián, què shì làngfèi dà qián a!"',
        vi: 'Nhưng chất lượng mấy bộ quần áo đó không tốt, giặt một lần là phai màu. Mẹ muốn trả hàng, nhưng đồ giảm giá không được trả. Tôi nói: "Tiết kiệm khoản nhỏ, lại là lãng phí món to đấy mẹ ạ!"',
      },
      {
        ko: '我喜欢网上{{购物}}。买东西我先看{{品牌}}，不一定买{{名牌}}，但是要{{值得}}。从价格和质量两个{{方面}}来看，再决定买不买。我还会看{{尺码}}{{是否}}合适，有没有{{优惠价}}，是不是{{包邮}}。{{另外}}，如果{{运费}}太贵，我就不买了。',
        py: 'Wǒ xǐhuan wǎngshàng gòuwù. Mǎi dōngxi wǒ xiān kàn pǐnpái, bù yídìng mǎi míngpái, dànshì yào zhíde. Cóng jiàgé hé zhìliàng liǎng ge fāngmiàn lái kàn, zài juédìng mǎi bu mǎi. Wǒ hái huì kàn chǐmǎ shìfǒu héshì, yǒu méiyǒu yōuhuìjià, shì bu shì bāoyóu. Lìngwài, rúguǒ yùnfèi tài guì, wǒ jiù bù mǎi le.',
        vi: 'Tôi thích mua sắm online. Mua đồ tôi xem thương hiệu trước, không nhất thiết mua hàng hiệu nhưng phải đáng tiền. Xét từ hai phương diện giá cả và chất lượng rồi mới quyết định có mua hay không. Tôi còn xem kích cỡ có vừa không, có giá ưu đãi không, có miễn phí vận chuyển không. Ngoài ra, nếu phí ship đắt quá thì tôi không mua.',
      },
      {
        ko: '我买的东西都是{{快递}}{{寄}}到家的。上个星期我买了一套新{{家具}}，商家{{负责}}送货和{{修理}}，有{{任何}}问题都可以找他们。这种家具现在很{{流行}}。',
        py: 'Wǒ mǎi de dōngxi dōu shì kuàidì jì dào jiā de. Shàng ge xīngqī wǒ mǎi le yí tào xīn jiājù, shāngjiā fùzé sònghuò hé xiūlǐ, yǒu rènhé wèntí dōu kěyǐ zhǎo tāmen. Zhè zhǒng jiājù xiànzài hěn liúxíng.',
        vi: 'Đồ tôi mua đều được chuyển phát nhanh gửi đến tận nhà. Tuần trước tôi mua một bộ đồ gia dụng (nội thất) mới, cửa hàng phụ trách giao hàng và sửa chữa, có bất kỳ vấn đề gì cũng có thể tìm họ. Loại đồ này hiện đang rất thịnh hành.',
      },
      {
        ko: '买东西要看{{本质}}，不能只看外表。食品放久了会{{变质}}；衣服也有不同的{{性质}}和{{品质}}。我爸爸是学{{地质}}的，他说：人的{{素质}}和{{气质}}比{{物质}}更重要。"{{质}}"就是"东西本来的样子"。',
        py: 'Mǎi dōngxi yào kàn běnzhì, bù néng zhǐ kàn wàibiǎo. Shípǐn fàng jiǔ le huì biànzhì; yīfu yě yǒu bù tóng de xìngzhì hé pǐnzhì. Wǒ bàba shì xué dìzhì de, tā shuō: rén de sùzhì hé qìzhì bǐ wùzhì gèng zhòngyào. "Zhì" jiù shì "dōngxi běnlái de yàngzi".',
        vi: 'Mua đồ phải nhìn bản chất, không thể chỉ nhìn bề ngoài. Thực phẩm để lâu sẽ biến chất; quần áo cũng có tính chất và phẩm chất khác nhau. Bố tôi học ngành địa chất, bố nói: tố chất và khí chất của con người quan trọng hơn vật chất. "Chất" nghĩa là "dáng vẻ vốn có của sự vật".',
      },
    ],
  },

  45: {
    title: '工作再忙也坚持阅读习惯',
    titleVi: 'Bận đến đâu cũng giữ thói quen đọc sách',
    note: 'Dùng đủ 37 từ vựng và 3 ngữ pháp của bài: 无论, 除此以外, 连……都 / 也…….',
    paragraphs: [
      {
        ko: '我的书架上摆{{满}}了书。我有一个好{{习惯}}：工作再忙，每天也坚持{{阅读}}一个小时。',
        py: 'Wǒ de shūjià shang bǎi mǎn le shū. Wǒ yǒu yí ge hǎo xíguàn: gōngzuò zài máng, měi tiān yě jiānchí yuèdú yí ge xiǎoshí.',
        vi: 'Giá sách của tôi xếp đầy sách. Tôi có một thói quen tốt: công việc bận đến đâu, mỗi ngày cũng kiên trì đọc sách một tiếng.',
      },
      {
        ko: '我读的书很多：{{小说}}、{{杂志}}、{{漫画}}、{{经管书}}、{{常识书}}和{{自助书}}。小说里我最喜欢{{武侠}}、{{言情}}和{{青春校园}}，也喜欢看名人的{{回忆录}}。',
        py: 'Wǒ dú de shū hěn duō: xiǎoshuō, zázhì, mànhuà, jīngguǎnshū, chángshíshū hé zìzhùshū. Xiǎoshuō li wǒ zuì xǐhuan wǔxiá, yánqíng hé qīngchūn xiàoyuán, yě xǐhuan kàn míngrén de huíyìlù.',
        vi: 'Tôi đọc nhiều loại sách: tiểu thuyết, tạp chí, truyện tranh, sách quản trị, sách thường thức và sách self-help. Trong tiểu thuyết tôi thích nhất võ hiệp, ngôn tình và thanh xuân vườn trường, cũng thích đọc hồi ký của người nổi tiếng.',
      },
      {
        ko: '最近我在读一本很{{厚}}的书，是一位{{著名}}的{{法律}}{{教授}}写的。书的{{内容}}有点儿难，可是教授{{解释}}得很清楚，{{连}}{{普通}}人都能看懂。',
        py: 'Zuìjìn wǒ zài dú yì běn hěn hòu de shū, shì yí wèi zhùmíng de fǎlǜ jiàoshòu xiě de. Shū de nèiróng yǒudiǎnr nán, kěshì jiàoshòu jiěshì de hěn qīngchu, lián pǔtōng rén dōu néng kàn dǒng.',
        vi: 'Gần đây tôi đang đọc một cuốn sách rất dày do một giáo sư luật nổi tiếng viết. Nội dung sách hơi khó, nhưng giáo sư giải thích rất rõ, đến người bình thường cũng đọc hiểu được.',
      },
      {
        ko: '{{无论}}是文学书还是{{科学}}书，我都喜欢。读书让我{{增加}}了很多{{知识}}，也让我的{{生活}}更有意思。{{除此以外}}，读书还能让人放松。书里的一{{部分}}内容，我会抄在笔记本上。',
        py: 'Wúlùn shì wénxué shū háishi kēxué shū, wǒ dōu xǐhuan. Dú shū ràng wǒ zēngjiā le hěn duō zhīshi, yě ràng wǒ de shēnghuó gèng yǒu yìsi. Chú cǐ yǐwài, dú shū hái néng ràng rén fàngsōng. Shū li de yí bùfen nèiróng, wǒ huì chāo zài bǐjìběn shang.',
        vi: 'Dù là sách văn học hay sách khoa học tôi đều thích. Đọc sách giúp tôi tăng thêm nhiều kiến thức, cũng khiến cuộc sống thú vị hơn. Ngoài ra, đọc sách còn giúp người ta thư giãn. Một phần nội dung trong sách tôi sẽ chép vào sổ.',
      },
      {
        ko: '那本法律书讲了{{宪法}}、{{司法}}和{{法人}}，还告诉我们什么是{{合法}}，什么是{{非法}}。我爷爷喜欢{{书法}}，他说写字也要讲{{方法}}，就像学外语要学{{语法}}一样。"{{法}}"就是"规则、办法"。',
        py: 'Nà běn fǎlǜ shū jiǎng le xiànfǎ, sīfǎ hé fǎrén, hái gàosu wǒmen shénme shì héfǎ, shénme shì fēifǎ. Wǒ yéye xǐhuan shūfǎ, tā shuō xiě zì yě yào jiǎng fāngfǎ, jiù xiàng xué wàiyǔ yào xué yǔfǎ yíyàng. "Fǎ" jiù shì "guīzé, bànfǎ".',
        vi: 'Cuốn sách luật đó nói về hiến pháp, tư pháp và pháp nhân, còn cho chúng ta biết thế nào là hợp pháp, thế nào là phi pháp. Ông nội tôi thích thư pháp, ông nói viết chữ cũng phải có phương pháp, giống như học ngoại ngữ phải học ngữ pháp vậy. "Pháp" nghĩa là "quy tắc, cách làm".',
      },
    ],
  },

  46: {
    title: '你在看偶像的电视剧吧？',
    titleVi: 'Bạn đang xem phim của thần tượng à?',
    note: 'Dùng đủ 37 từ vựng và 4 ngữ pháp của bài: 不得不, 为……而……, 百分之 + số, 确实.',
    paragraphs: [
      {
        ko: '"你在看{{偶像}}的电视剧吧？"\n"对！他是我最喜欢的{{演员}}，现在可{{红}}了，很{{受}}{{观众}}{{喜爱}}。我是他的{{粉丝}}，还是个{{狂粉}}呢！"',
        py: '"Nǐ zài kàn ǒuxiàng de diànshìjù ba?"\n"Duì! Tā shì wǒ zuì xǐhuan de yǎnyuán, xiànzài kě hóng le, hěn shòu guānzhòng xǐ\'ài. Wǒ shì tā de fěnsī, hái shì ge kuángfěn ne!"',
        vi: '"Cậu đang xem phim của thần tượng à?"\n"Đúng! Anh ấy là diễn viên tớ thích nhất, giờ đang hot lắm, rất được khán giả yêu thích. Tớ là fan của anh ấy, còn là fan cuồng nữa cơ!"',
      },
      {
        ko: '我的偶像小时候家里很{{穷}}。他的{{父母}}不让他学{{艺术}}，他{{不得不}}一边打工一边学{{表演}}，可是他从来没想过{{放弃}}。',
        py: 'Wǒ de ǒuxiàng xiǎo shíhou jiā li hěn qióng. Tā de fùmǔ bú ràng tā xué yìshù, tā bùdébù yìbiān dǎgōng yìbiān xué biǎoyǎn, kěshì tā cónglái méi xiǎng guo fàngqì.',
        vi: 'Hồi nhỏ nhà thần tượng của tớ rất nghèo. Bố mẹ không cho anh ấy học nghệ thuật, anh ấy buộc phải vừa đi làm thêm vừa học diễn xuất, nhưng chưa bao giờ nghĩ đến chuyện bỏ cuộc.',
      },
      {
        ko: '他每天{{苦练}}，{{为}}{{理想}}{{而}}努力，最后{{成为}}了一名有名的{{艺人}}。很多人都{{羡慕}}他。他说，成功百分之九十靠努力，这话{{确实}}很有道理。',
        py: 'Tā měi tiān kǔliàn, wèi lǐxiǎng ér nǔlì, zuìhòu chéngwéi le yì míng yǒumíng de yìrén. Hěn duō rén dōu xiànmù tā. Tā shuō, chénggōng bǎi fēn zhī jiǔshí kào nǔlì, zhè huà quèshí hěn yǒu dàolǐ.',
        vi: 'Ngày nào anh ấy cũng khổ luyện, nỗ lực vì lý tưởng, cuối cùng trở thành một nghệ sĩ nổi tiếng. Rất nhiều người ngưỡng mộ anh ấy. Anh ấy nói thành công chín mươi phần trăm dựa vào nỗ lực, câu này thực sự rất có lý.',
      },
      {
        ko: '{{娱乐圈}}很复杂，{{绯闻}}很多，可是我的偶像很少有绯闻。上个月他开了{{记者发布会}}，说他要{{演}}一部新电视剧的{{主角}}。这部剧的{{编剧}}很有名，{{剧本}}也写得很好。',
        py: 'Yúlèquān hěn fùzá, fēiwén hěn duō, kěshì wǒ de ǒuxiàng hěn shǎo yǒu fēiwén. Shàng ge yuè tā kāi le jìzhě fābùhuì, shuō tā yào yǎn yí bù xīn diànshìjù de zhǔjué. Zhè bù jù de biānjù hěn yǒumíng, jùběn yě xiě de hěn hǎo.',
        vi: 'Showbiz rất phức tạp, nhiều scandal, nhưng thần tượng của tớ hiếm khi có scandal. Tháng trước anh ấy mở họp báo, nói sẽ đóng vai chính trong một bộ phim truyền hình mới. Biên kịch của phim rất nổi tiếng, kịch bản cũng viết rất hay.',
      },
      {
        ko: '这部剧的{{导演}}说，他把一个老故事重新{{演绎}}了一遍。剧里有很多精彩的场面：主角的{{演说}}、音乐家的{{演奏}}，还有军队的{{演习}}，故事的{{演变}}也很有意思。电视剧播完以后，演员们还要在剧院{{公演}}。我已经买好了票去看他们的{{演出}}，那天一定会很{{愉快}}。',
        py: 'Zhè bù jù de dǎoyǎn shuō, tā bǎ yí ge lǎo gùshi chóngxīn yǎnyì le yí biàn. Jù li yǒu hěn duō jīngcǎi de chǎngmiàn: zhǔjué de yǎnshuō, yīnyuèjiā de yǎnzòu, hái yǒu jūnduì de yǎnxí, gùshi de yǎnbiàn yě hěn yǒu yìsi. Diànshìjù bō wán yǐhòu, yǎnyuánmen hái yào zài jùyuàn gōngyǎn. Wǒ yǐjīng mǎi hǎo le piào qù kàn tāmen de yǎnchū, nà tiān yídìng huì hěn yúkuài.',
        vi: 'Đạo diễn phim nói ông đã diễn dịch (kể lại) một câu chuyện cũ theo cách mới. Trong phim có nhiều cảnh đặc sắc: bài diễn thuyết của nhân vật chính, màn diễn tấu của nhạc sĩ, còn có cuộc diễn tập của quân đội, diễn biến câu chuyện cũng rất thú vị. Phim chiếu xong, các diễn viên còn công diễn ở nhà hát. Tớ đã mua vé xem buổi diễn xuất của họ rồi, hôm đó chắc chắn sẽ rất vui.',
      },
    ],
  },

  47: {
    title: '其实教育孩子很简单',
    titleVi: 'Thực ra dạy con rất đơn giản',
    note: 'Dùng đủ 36 từ vựng và 3 ngữ pháp của bài: 不如, 什么的, 按照.',
    paragraphs: [
      {
        ko: '我女儿以前很{{害羞}}，现在很{{活泼}}，也很{{自信}}。很多朋友问我怎么{{教育}}孩子。我的{{看法}}是：其实教育孩子很简单。',
        py: 'Wǒ nǚ\'ér yǐqián hěn hàixiū, xiànzài hěn huópō, yě hěn zìxìn. Hěn duō péngyou wèn wǒ zěnme jiàoyù háizi. Wǒ de kànfǎ shì: qíshí jiàoyù háizi hěn jiǎndān.',
        vi: 'Con gái tôi trước đây rất nhút nhát, giờ rất hoạt bát, cũng rất tự tin. Nhiều bạn bè hỏi tôi dạy con thế nào. Nhận định của tôi là: thực ra dạy con rất đơn giản.',
      },
      {
        ko: '孩子做得好，要{{及时}}{{表扬}}；做得不好，也要{{鼓励}}，用{{正确}}的方法帮她。{{平时}}要帮孩子{{养成}}好习惯，比如早睡早起；孩子{{困}}了，就让她去睡觉。',
        py: 'Háizi zuò de hǎo, yào jíshí biǎoyáng; zuò de bù hǎo, yě yào gǔlì, yòng zhèngquè de fāngfǎ bāng tā. Píngshí yào bāng háizi yǎngchéng hǎo xíguàn, bǐrú zǎo shuì zǎo qǐ; háizi kùn le, jiù ràng tā qù shuìjiào.',
        vi: 'Con làm tốt thì phải biểu dương kịp thời; làm chưa tốt cũng phải khích lệ, dùng phương pháp đúng đắn để giúp con. Ngày thường phải giúp con nuôi dưỡng thói quen tốt, ví dụ ngủ sớm dậy sớm; con buồn ngủ thì cho con đi ngủ.',
      },
      {
        ko: '学校有很多活动，女儿都{{积极}}{{报名}}：{{拉小提琴}}、{{弹钢琴}}、{{跳芭蕾舞}}什么的。我觉得，与其让她只会读书，{{不如}}让她多学一些{{软技能}}，比如{{领导能力}}、{{时间管理}}、{{团队合作}}和{{演说技巧}}。',
        py: 'Xuéxiào yǒu hěn duō huódòng, nǚ\'ér dōu jījí bàomíng: lā xiǎotíqín, tán gāngqín, tiào bālěiwǔ shénmede. Wǒ juéde, yǔqí ràng tā zhǐ huì dú shū, bùrú ràng tā duō xué yìxiē ruǎn jìnéng, bǐrú lǐngdǎo nénglì, shíjiān guǎnlǐ, tuánduì hézuò hé yǎnshuō jìqiǎo.',
        vi: 'Trường có nhiều hoạt động, con gái tôi đều tích cực đăng ký: kéo violon, chơi piano, múa ballet các thứ. Tôi thấy, thay vì để con chỉ biết học sách, chẳng bằng cho con học thêm kỹ năng mềm, ví dụ năng lực lãnh đạo, quản lý thời gian, hợp tác đội nhóm và kỹ năng diễn thuyết.',
      },
      {
        ko: '{{按照}}孩子的{{年龄}}安排学习，学习就会变得很{{有趣}}。{{真正}}好的教育，是让孩子快乐地长大。',
        py: 'Ànzhào háizi de niánlíng ānpái xuéxí, xuéxí jiù huì biàn de hěn yǒuqù. Zhēnzhèng hǎo de jiàoyù, shì ràng háizi kuàilè de zhǎngdà.',
        vi: 'Sắp xếp việc học dựa theo tuổi của con thì việc học sẽ trở nên rất thú vị. Nền giáo dục thực sự tốt là để con lớn lên vui vẻ.',
      },
      {
        ko: '每个孩子都有{{优点}}和{{缺点}}，也有自己的{{特点}}和{{弱点}}。教育的{{重点}}是尊重孩子的{{观点}}。周末我们常常去公园，那是女儿最喜欢的{{地点}}，我们还会带上她爱吃的{{点心}}。我想多陪她一{{点}}时间。',
        py: 'Měi ge háizi dōu yǒu yōudiǎn hé quēdiǎn, yě yǒu zìjǐ de tèdiǎn hé ruòdiǎn. Jiàoyù de zhòngdiǎn shì zūnzhòng háizi de guāndiǎn. Zhōumò wǒmen chángcháng qù gōngyuán, nà shì nǚ\'ér zuì xǐhuan de dìdiǎn, wǒmen hái huì dài shàng tā ài chī de diǎnxin. Wǒ xiǎng duō péi tā yìdiǎn shíjiān.',
        vi: 'Đứa trẻ nào cũng có ưu điểm và khuyết điểm, cũng có đặc điểm và nhược điểm riêng. Trọng điểm của giáo dục là tôn trọng quan điểm của trẻ. Cuối tuần chúng tôi hay ra công viên, đó là địa điểm con gái thích nhất, còn mang theo điểm tâm con thích ăn. Tôi muốn dành cho con nhiều thời gian hơn một chút.',
      },
    ],
  },

  48: {
    title: '互联网的发展',
    titleVi: 'Sự phát triển của internet',
    note: 'Dùng đủ 36 từ vựng và 3 ngữ pháp của bài: 甚至, 叫 / 让 / 使 (câu kiêm ngữ), 既……又 / 也 / 还…….',
    paragraphs: [
      {
        ko: '在{{现代}}社会，{{互联网}}{{发展}}得很快，{{使}}{{人们}}的生活{{方式}}{{发生}}了很大的变化。',
        py: 'Zài xiàndài shèhuì, hùliánwǎng fāzhǎn de hěn kuài, shǐ rénmen de shēnghuó fāngshì fāshēng le hěn dà de biànhuà.',
        vi: 'Trong xã hội hiện đại, internet phát triển rất nhanh, khiến phương thức sinh hoạt của mọi người thay đổi rất lớn.',
      },
      {
        ko: '以前人们在{{纸}}上写{{日记}}，现在都在{{网站}}上写。上网{{交网友}}也很{{普遍}}，有的人{{甚至}}在网上认识以后就去{{约会}}。我和男朋友{{俩}}就是在网上认识的。',
        py: 'Yǐqián rénmen zài zhǐ shang xiě rìjì, xiànzài dōu zài wǎngzhàn shang xiě. Shàngwǎng jiāo wǎngyǒu yě hěn pǔbiàn, yǒu de rén shènzhì zài wǎng shang rènshi yǐhòu jiù qù yuēhuì. Wǒ hé nánpéngyou liǎ jiù shì zài wǎng shang rènshi de.',
        vi: 'Trước đây người ta viết nhật ký trên giấy, giờ đều viết trên các trang web. Kết bạn qua mạng cũng rất phổ biến, có người thậm chí quen nhau trên mạng xong là đi hẹn hò luôn. Hai đứa tôi với bạn trai cũng quen nhau trên mạng.',
      },
      {
        ko: '现在{{网购}}、{{网上支付}}、{{上网课}}都很方便。用一个新网站，要先{{注册}}一个{{账号}}，然后{{登录}}；用完了要记得{{退出}}。网上{{既}}方便又有危险，我们要{{保护}}好自己的信息。',
        py: 'Xiànzài wǎnggòu, wǎngshàng zhīfù, shàng wǎngkè dōu hěn fāngbiàn. Yòng yí ge xīn wǎngzhàn, yào xiān zhùcè yí ge zhànghào, ránhòu dēnglù; yòng wán le yào jìde tuìchū. Wǎng shang jì fāngbiàn yòu yǒu wēixiǎn, wǒmen yào bǎohù hǎo zìjǐ de xìnxī.',
        vi: 'Bây giờ mua sắm online, thanh toán online, học online đều rất tiện. Dùng một trang web mới thì trước tiên phải đăng ký tài khoản, rồi đăng nhập; dùng xong nhớ đăng xuất. Trên mạng vừa tiện lợi vừa có nguy hiểm, chúng ta phải bảo vệ thông tin của mình.',
      },
      {
        ko: '网上出现了很多新{{词语}}，比如"{{火}}"，意思是很红、很受欢迎。一篇文章的{{作者}}说，这个词去年特别火。',
        py: 'Wǎng shang chūxiàn le hěn duō xīn cíyǔ, bǐrú "huǒ", yìsi shì hěn hóng, hěn shòu huānyíng. Yì piān wénzhāng de zuòzhě shuō, zhège cí qùnián tèbié huǒ.',
        vi: 'Trên mạng xuất hiện nhiều từ ngữ mới, ví dụ "火" (lửa), nghĩa là rất hot, rất được ưa chuộng. Tác giả của một bài báo nói, từ này năm ngoái đặc biệt hot.',
      },
      {
        ko: '保护信息很重要：密码要{{保密}}，重要的文件要{{保存}}好，账号也要{{保管}}好。我奶奶比较{{保守}}，不相信网上支付。她请了一个{{保姆}}，还买了{{保险}}。她每天{{保养}}皮肤，{{保持}}好心情。"{{保}}"就是"守住"的意思。',
        py: 'Bǎohù xìnxī hěn zhòngyào: mìmǎ yào bǎomì, zhòngyào de wénjiàn yào bǎocún hǎo, zhànghào yě yào bǎoguǎn hǎo. Wǒ nǎinai bǐjiào bǎoshǒu, bù xiāngxìn wǎngshàng zhīfù. Tā qǐng le yí ge bǎomǔ, hái mǎi le bǎoxiǎn. Tā měi tiān bǎoyǎng pífū, bǎochí hǎo xīnqíng. "Bǎo" jiù shì "shǒu zhù" de yìsi.',
        vi: 'Bảo vệ thông tin rất quan trọng: mật khẩu phải bảo mật, tài liệu quan trọng phải bảo tồn (lưu giữ) cẩn thận, tài khoản cũng phải bảo quản kỹ. Bà tôi khá bảo thủ, không tin thanh toán online. Bà thuê một bảo mẫu (người giúp việc), còn mua bảo hiểm. Ngày nào bà cũng bảo dưỡng da, bảo trì (giữ) tâm trạng vui vẻ. "Bảo" nghĩa là "giữ gìn".',
      },
    ],
  },

  49: {
    title: '现代社会的压力挺大的',
    titleVi: 'Áp lực của xã hội hiện đại lớn quá',
    note: 'Dùng đủ 37 từ vựng và 5 ngữ pháp của bài: 随着, 拿……来说, 之一, 由, 所有.',
    paragraphs: [
      {
        ko: '{{随着}}{{技术}}的发展，生活越来越方便，可是现代{{社会}}的压力也挺大的。{{竞争}}很激烈，{{许多}}人都觉得活得不{{轻松}}。',
        py: 'Suízhe jìshù de fāzhǎn, shēnghuó yuèláiyuè fāngbiàn, kěshì xiàndài shèhuì de yālì yě tǐng dà de. Jìngzhēng hěn jīliè, xǔduō rén dōu juéde huó de bù qīngsōng.',
        vi: 'Cùng với sự phát triển của kỹ thuật, cuộc sống ngày càng tiện lợi, nhưng áp lực của xã hội hiện đại cũng lớn quá. Cạnh tranh rất khốc liệt, rất nhiều người thấy sống không hề thoải mái.',
      },
      {
        ko: '{{拿}}我{{来说}}，每天都要{{按时}}上班，工作做不好，老板就会{{失望}}。{{经济危机}}和{{疫情}}以后，{{房地产}}生意不好做，{{油价}}和{{物价}}都涨了，还有{{通胀}}。',
        py: 'Ná wǒ láishuō, měi tiān dōu yào ànshí shàngbān, gōngzuò zuò bù hǎo, lǎobǎn jiù huì shīwàng. Jīngjì wēijī hé yìqíng yǐhòu, fángdìchǎn shēngyi bù hǎo zuò, yóujià hé wùjià dōu zhǎng le, hái yǒu tōngzhàng.',
        vi: 'Lấy tôi mà nói, ngày nào cũng phải đi làm đúng giờ, làm việc không tốt là sếp sẽ thất vọng. Sau khủng hoảng kinh tế và dịch bệnh, làm ăn bất động sản khó khăn, giá dầu và vật giá đều tăng, lại còn lạm phát nữa.',
      },
      {
        ko: '环境问题也很多：{{气候}}变化，{{空气污染}}和{{噪声污染}}都很严重。用太多{{塑料袋}}是{{污染}}的{{原因}}{{之一}}，我们应该{{减少}}使用塑料袋。',
        py: 'Huánjìng wèntí yě hěn duō: qìhòu biànhuà, kōngqì wūrǎn hé zàoshēng wūrǎn dōu hěn yánzhòng. Yòng tài duō sùliàodài shì wūrǎn de yuányīn zhī yī, wǒmen yīnggāi jiǎnshǎo shǐyòng sùliàodài.',
        vi: 'Vấn đề môi trường cũng nhiều: khí hậu biến đổi, ô nhiễm không khí và ô nhiễm tiếng ồn đều rất nghiêm trọng. Dùng quá nhiều túi nilon là một trong những nguyên nhân gây ô nhiễm, chúng ta nên giảm bớt dùng túi nilon.',
      },
      {
        ko: '压力大的时候，我会吃一块{{巧克力}}。这个项目{{由}}我负责，我做得很好，为自己感到{{骄傲}}。我{{尊重}}{{所有}}努力工作的人。',
        py: 'Yālì dà de shíhou, wǒ huì chī yí kuài qiǎokèlì. Zhège xiàngmù yóu wǒ fùzé, wǒ zuò de hěn hǎo, wèi zìjǐ gǎndào jiāo\'ào. Wǒ zūnzhòng suǒyǒu nǔlì gōngzuò de rén.',
        vi: 'Lúc áp lực lớn, tôi sẽ ăn một miếng socola. Dự án này do tôi phụ trách, tôi làm rất tốt, cảm thấy tự hào về bản thân. Tôi tôn trọng tất cả những người làm việc chăm chỉ.',
      },
      {
        ko: '人们为了钱和权力{{争}}来争去：有的人{{争夺}}财产，发生{{争执}}，甚至要{{争讼}}；网上大家也常常{{争论}}、{{争辩}}。历史上的{{战争}}和{{斗争}}让很多人失去了家。我只想{{争取}}过一种简单的生活。',
        py: 'Rénmen wèile qián hé quánlì zhēng lái zhēng qù: yǒu de rén zhēngduó cáichǎn, fāshēng zhēngzhí, shènzhì yào zhēngsòng; wǎng shang dàjiā yě chángcháng zhēnglùn, zhēngbiàn. Lìshǐ shang de zhànzhēng hé dòuzhēng ràng hěn duō rén shīqù le jiā. Wǒ zhǐ xiǎng zhēngqǔ guò yì zhǒng jiǎndān de shēnghuó.',
        vi: 'Người ta vì tiền và quyền lực mà tranh tới tranh lui: có người tranh đoạt tài sản, xảy ra tranh chấp, thậm chí phải tranh tụng (kiện tụng); trên mạng mọi người cũng hay tranh luận, tranh biện. Chiến tranh và đấu tranh trong lịch sử đã khiến biết bao người mất nhà. Tôi chỉ muốn tranh thủ sống một cuộc sống đơn giản.',
      },
    ],
  },

  50: {
    title: '放弃一切，离开城市',
    titleVi: 'Từ bỏ tất cả, rời xa thành phố',
    note: 'Dùng đủ 36 từ vựng và 4 ngữ pháp của bài: 既然……，(就)……, 一天比一天, 其中, 仍然.',
    paragraphs: [
      {
        ko: '城市生活让我很{{烦恼}}，每天都很{{难受}}。有一天我做了一个{{梦}}，梦见自己在一片{{森林}}里，{{周围}}的{{景色}}非常{{美丽}}，{{叶子}}慢慢地{{降落}}下来。{{醒}}来以后我想：{{既然}}城市生活让我不开心，那就离开吧。',
        py: 'Chéngshì shēnghuó ràng wǒ hěn fánnǎo, měi tiān dōu hěn nánshòu. Yǒu yì tiān wǒ zuò le yí ge mèng, mèngjiàn zìjǐ zài yí piàn sēnlín li, zhōuwéi de jǐngsè fēicháng měilì, yèzi mànmàn de jiàngluò xiàlai. Xǐng lái yǐhòu wǒ xiǎng: jìrán chéngshì shēnghuó ràng wǒ bù kāixīn, nà jiù líkāi ba.',
        vi: 'Cuộc sống thành phố khiến tôi rất phiền muộn, ngày nào cũng khó chịu. Một hôm tôi nằm mơ, thấy mình ở giữa một khu rừng, cảnh sắc xung quanh vô cùng đẹp, lá cây từ từ rơi xuống. Tỉnh dậy tôi nghĩ: nếu đã sống ở thành phố không vui thì rời đi thôi.',
      },
      {
        ko: '朋友们说我疯了，可是我很{{冷静}}。我{{敢}}放弃一切，我觉得自己很{{勇敢}}。我回到了{{家乡}}，那是{{山区}}的一个小{{农村}}。',
        py: 'Péngyoumen shuō wǒ fēng le, kěshì wǒ hěn lěngjìng. Wǒ gǎn fàngqì yíqiè, wǒ juéde zìjǐ hěn yǒnggǎn. Wǒ huí dào le jiāxiāng, nà shì shānqū de yí ge xiǎo nóngcūn.',
        vi: 'Bạn bè bảo tôi điên rồi, nhưng tôi rất bình tĩnh. Tôi dám từ bỏ tất cả, tôi thấy mình rất dũng cảm. Tôi trở về quê hương, một ngôi làng nhỏ ở vùng núi.',
      },
      {
        ko: '我买了一个小{{农场}}，跟当地的{{农民}}学习{{种植}}和{{饲养}}。我种了很多{{庄稼}}，{{其中}}有玉米和水稻。我的日子一天比一天好。',
        py: 'Wǒ mǎi le yí ge xiǎo nóngchǎng, gēn dāngdì de nóngmín xuéxí zhòngzhí hé sìyǎng. Wǒ zhòng le hěn duō zhuāngjia, qízhōng yǒu yùmǐ hé shuǐdào. Wǒ de rìzi yì tiān bǐ yì tiān hǎo.',
        vi: 'Tôi mua một nông trường nhỏ, học trồng trọt và chăn nuôi với nông dân địa phương. Tôi trồng rất nhiều hoa màu, trong đó có ngô và lúa. Cuộc sống của tôi ngày một tốt hơn.',
      },
      {
        ko: '一年过去了，我{{仍然}}很喜欢这里的生活，一点儿也不{{后悔}}。对我来说，这种生活最{{合适}}。周末很多城里人也来{{郊区}}和农村玩儿。',
        py: 'Yì nián guòqù le, wǒ réngrán hěn xǐhuan zhèlǐ de shēnghuó, yìdiǎnr yě bú hòuhuǐ. Duì wǒ láishuō, zhè zhǒng shēnghuó zuì héshì. Zhōumò hěn duō chénglǐrén yě lái jiāoqū hé nóngcūn wánr.',
        vi: 'Một năm trôi qua, tôi vẫn rất thích cuộc sống ở đây, không hối hận chút nào. Với tôi, cuộc sống này là thích hợp nhất. Cuối tuần nhiều người thành phố cũng về ngoại ô và nông thôn chơi.',
      },
      {
        ko: '我来这里很{{偶然}}，可是这个选择{{显然}}是对的。这里的一切都是{{天然}}的，人回到{{自然}}，{{必然}}会更快乐。朋友来看我，说："你{{果然}}变了！"我{{坦然}}地笑了："{{当然}}！""{{然}}"就是"这样"的意思。',
        py: 'Wǒ lái zhèlǐ hěn ǒurán, kěshì zhège xuǎnzé xiǎnrán shì duì de. Zhèlǐ de yíqiè dōu shì tiānrán de, rén huí dào zìrán, bìrán huì gèng kuàilè. Péngyou lái kàn wǒ, shuō: "Nǐ guǒrán biàn le!" Wǒ tǎnrán de xiào le: "Dāngrán!" "Rán" jiù shì "zhèyàng" de yìsi.',
        vi: 'Tôi đến đây rất ngẫu nhiên, nhưng lựa chọn này hiển nhiên là đúng. Mọi thứ ở đây đều là thiên nhiên, con người trở về với tự nhiên tất nhiên sẽ vui vẻ hơn. Bạn đến thăm tôi, nói: "Cậu quả nhiên thay đổi rồi!" Tôi thản nhiên cười: "Đương nhiên!" "Nhiên" nghĩa là "như thế".',
      },
    ],
  },
}
