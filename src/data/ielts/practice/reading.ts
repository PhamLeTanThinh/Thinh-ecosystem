import type { PracticeTest } from '@/lib/ielts/practice'
import { EXPLAIN } from './cinnamon-explain'
import { EXPLAIN as TRENDS_EXPLAIN } from './trends-explain'
import { EXPLAIN as VENUS_EXPLAIN } from './venus-explain'

// Mỗi đề = 1 phần tử; thêm đề mới chỉ cần thêm object vào mảng, danh sách / màn giới thiệu / trang từ vựng
// tự cập nhật.
//
// LƯU Ý về "Bringing Cinnamon To Europe": đề và câu hỏi lấy từ ảnh + bài đọc được cung cấp; ĐÁP ÁN, GIẢI THÍCH
// và Vocab set do tôi tự suy ra từ bài đọc (chưa có đáp án chính thức đi kèm) — cần đối chiếu với đáp án gốc
// trước khi dùng nghiêm túc, đặc biệt câu 10 (True/False/Not Given).
//
// LƯU Ý về "Making The Most Of Trends": tương tự — bài đọc + câu hỏi lấy từ ảnh được cung cấp; ĐÁP ÁN và
// GIẢI THÍCH do tôi tự suy luận từ bài đọc (chưa có đáp án gốc đối chiếu), NGOẠI TRỪ câu 1 đã khớp ảnh đáp
// án chính thức bạn cung cấp — câu 2 (Coach was anxious to...) có 2 phương án khá gần nhau (B và C), cần rà
// lại kỹ. Câu 6-11 dùng type "match" (ma trận A/B/C/D), câu 12-14 dùng type "bank" (chọn từ ngân hàng đáp án
// dùng chung, dropdown tại chỗ). Chưa có Vocab set cho đề này.
//
// LƯU Ý về "Venus in Transit": bài đọc + câu hỏi lấy từ ảnh được cung cấp. ĐÁP ÁN cả 13 câu đã được xác
// nhận khớp 100% với answer key chính thức (bạn gửi ảnh "Answer key" đối chiếu) — GIẢI THÍCH vẫn là do tôi
// tự soạn (không phải từ nguồn gốc), nhưng đáp án đã chắc chắn đúng. Câu 1-4 và 5-8 đều dùng type "match"
// (ma trận). Chưa có Vocab set cho đề này.
export const READING_TESTS: PracticeTest[] = [
  {
    id: 'reading-bringing-cinnamon-to-europe',
    skill: 'reading',
    title: 'Bringing Cinnamon To Europe',
    category: 'Practice test',
    part: 'Reading 5',
    durationMin: 20,
    passageTitle: 'Bringing Cinnamon To Europe',
    paragraphLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
    passage: [
      'Cinnamon is a sweet, fragrant spice produced from the inner bark of trees of the genus Cinnamomum, which is native to the Indian sub-continent. It was known in biblical times, and is mentioned in several books of the Bible, both as an ingredient that was mixed with oils for anointing people’s bodies, and also as a token indicating friendship among lovers and friends. In ancient Rome, mourners attending funerals burnt cinnamon to create a pleasant scent. Most often, however, the spice found its primary use as an additive to food and drink. In the Middle Ages, Europeans who could afford the spice used it to flavour food, particularly meat, and to impress those around them with their ability to purchase an expensive condiment from the ‘exotic’ East. At a banquet, a host would offer guests a plate with various spices piled upon it as a sign of the wealth at his or her disposal. Cinnamon was also reported to have health benefits, and was thought to cure various ailments, such as indigestion.',
      'Toward the end of the Middle Ages, the European middle classes began to desire the lifestyle of the elite, including their consumption of spices. This led to a growth in demand for cinnamon and other spices. At that time, cinnamon was transported by Arab merchants, who closely guarded the secret of the source of the spice from potential rivals. They took it from India, where it was grown, on camels via an overland route to the Mediterranean. Their journey ended when they reached Alexandria. European traders sailed there to purchase their supply of cinnamon, then brought it back to Venice. The spice then travelled from that great trading city to markets all around Europe. Because the overland trade route allowed for only small quantities of the spice to reach Europe, and because Venice had a virtual monopoly of the trade, the Venetians could set the price of cinnamon exorbitantly high. These prices, coupled with the increasing demand, spurred the search for new routes to Asia by Europeans eager to take part in the spice trade.',
      'Seeking the high profits promised by the cinnamon market, Portuguese traders arrived on the island of Ceylon in the Indian Ocean toward the end of the 15th century. Before Europeans arrived on the island, the state had organized the cultivation of cinnamon. People belonging to the ethnic group called the Salagama would peel the bark off young shoots of the cinnamon plant in the rainy season, when the wet bark was more pliable. During the peeling process, they curled the bark into the ‘stick’ shape still associated with the spice today. The Salagama then gave the finished product to the king as a form of tribute. When the Portuguese arrived, they needed to increase production significantly, and so enslaved many other members of the Ceylonese native population, forcing them to work in cinnamon harvesting. In 1518, the Portuguese built a fort on Ceylon, which enabled them to protect the island, so helping them to develop a monopoly in the cinnamon trade and generate very high profits. In the late 16th century, for example, they enjoyed a tenfold profit when shipping cinnamon over a journey of eight days from Ceylon to India.',
      'When the Dutch arrived off the coast of southern Asia at the very beginning of the 17th century, they set their sights on displacing the Portuguese as kings of cinnamon. The Dutch allied themselves with Kandy, an inland kingdom on Ceylon. In return for payments of elephants and cinnamon, they protected the native king from the Portuguese. By 1640, the Dutch broke the 150-year Portuguese monopoly when they overran and occupied their factories. By 1658, they had permanently expelled the Portuguese from the island, thereby gaining control of the lucrative cinnamon trade.',
      'In order to protect their hold on the market, the Dutch, like the Portuguese before them, treated the native inhabitants harshly. Because of the need to boost production and satisfy Europe’s ever-increasing appetite for cinnamon, the Dutch began to alter the harvesting practices of the Ceylonese. Over time, the supply of cinnamon trees on the island became nearly exhausted, due to systematic stripping of the bark. Eventually, the Dutch began cultivating their own cinnamon trees to supplement the diminishing number of wild trees available for use.',
      'Then, in 1796, the English arrived on Ceylon, thereby displacing the Dutch from their control of the cinnamon monopoly. By the middle of the 19th century, production of cinnamon reached 1,000 tons a year, after a lower grade quality of the spice became acceptable to European tastes. By that time, cinnamon was being grown in other parts of the Indian Ocean region and in the West Indies, Brazil, and Guyana. Not only was a monopoly of cinnamon becoming impossible, but the spice trade overall was diminishing in economic potential, and was eventually superseded by the rise of trade in coffee, tea, chocolate, and sugar.',
    ],
    groups: [
      {
        "id": "g1",
        "instruction": "Complete the table below. Choose **ONE WORD ONLY** from the passage for each answer.",
        "table": {
          "title": "The Early History of Cinnamon",
          "rows": [
            {
              "label": "Biblical times",
              "lines": [
                {
                  "q": "q1"
                },
                {
                  "q": "q2"
                }
              ]
            },
            {
              "label": "Ancient Rome",
              "lines": [
                {
                  "q": "q3"
                }
              ]
            },
            {
              "label": "Middle Ages:",
              "lines": [
                "added to food, especially meat",
                {
                  "q": "q4"
                },
                {
                  "q": "q5"
                },
                {
                  "q": "q6"
                },
                {
                  "q": "q7"
                },
                {
                  "q": "q8"
                },
                {
                  "q": "q9"
                }
              ]
            }
          ]
        },
        "questions": [
          {
            "id": "q1",
            "type": "table",
            "prompt": "added to ___",
            "answer": "oils",
            "alt": [
              "oil"
            ],
            "explanation": EXPLAIN.q1,
            "locate": [
              {
                "para": 0,
                "text": "mixed with oils for anointing people’s bodies"
              }
            ]
          },
          {
            "id": "q2",
            "type": "table",
            "prompt": "used to show ___ between people",
            "answer": "friendship",
            "explanation": EXPLAIN.q2,
            "locate": [
              {
                "para": 0,
                "text": "a token indicating friendship among lovers and friends"
              }
            ]
          },
          {
            "id": "q3",
            "type": "table",
            "prompt": "used for its sweet smell at ___",
            "answer": "funerals",
            "alt": [
              "funeral"
            ],
            "explanation": EXPLAIN.q3,
            "locate": [
              {
                "para": 0,
                "text": "mourners attending funerals burnt cinnamon to create a pleasant scent"
              }
            ]
          },
          {
            "id": "q4",
            "type": "table",
            "prompt": "was an indication of a person’s ___",
            "answer": "wealth",
            "explanation": EXPLAIN.q4,
            "locate": [
              {
                "para": 0,
                "text": "as a sign of the wealth at his or her disposal"
              }
            ]
          },
          {
            "id": "q5",
            "type": "table",
            "prompt": "known as a treatment for ___ and other health problems",
            "answer": "indigestion",
            "explanation": EXPLAIN.q5,
            "locate": [
              {
                "para": 0,
                "text": "thought to cure various ailments, such as indigestion"
              }
            ]
          },
          {
            "id": "q6",
            "type": "table",
            "prompt": "grown in ___",
            "answer": "India",
            "explanation": EXPLAIN.q6,
            "locate": [
              {
                "para": 1,
                "text": "They took it from India, where it was grown"
              }
            ]
          },
          {
            "id": "q7",
            "type": "table",
            "prompt": "merchants used ___ to bring it to the Mediterranean",
            "answer": "camels",
            "alt": [
              "camel"
            ],
            "explanation": EXPLAIN.q7,
            "locate": [
              {
                "para": 1,
                "text": "on camels via an overland route to the Mediterranean"
              }
            ]
          },
          {
            "id": "q8",
            "type": "table",
            "prompt": "arrived in the Mediterranean at ___",
            "answer": "Alexandria",
            "explanation": EXPLAIN.q8,
            "locate": [
              {
                "para": 1,
                "text": "Their journey ended when they reached Alexandria."
              }
            ]
          },
          {
            "id": "q9",
            "type": "table",
            "prompt": "traders took it to ___ and sold it to destinations around Europe.",
            "answer": "Venice",
            "explanation": EXPLAIN.q9,
            "locate": [
              {
                "para": 1,
                "text": "then brought it back to Venice. The spice then travelled from that great trading city to markets all around Europe."
              }
            ]
          }
        ]
      },
      {
        "id": "g2",
        "instruction": "Choose **TRUE/FALSE/NOT GIVEN**",
        "questions": [
          {
            "id": "q10",
            "type": "tfng",
            "prompt": "The Portuguese had control over the cinnamon trade in Ceylon throughout the 16th century.",
            "answer": "True",
            "explanation": EXPLAIN.q10,
            "locate": [
              {
                "para": 2,
                "text": "In 1518, the Portuguese built a fort on Ceylon"
              },
              {
                "para": 3,
                "text": "By 1640, the Dutch broke the 150-year Portuguese monopoly"
              }
            ]
          },
          {
            "id": "q11",
            "type": "tfng",
            "prompt": "The Dutch took over the cinnamon trade from the Portuguese as soon as they arrived in Ceylon.",
            "answer": "False",
            "explanation": EXPLAIN.q11,
            "locate": [
              {
                "para": 3,
                "text": "By 1640, the Dutch broke the 150-year Portuguese monopoly"
              },
              {
                "para": 3,
                "text": "By 1658, they had permanently expelled the Portuguese from the island"
              }
            ]
          },
          {
            "id": "q12",
            "type": "tfng",
            "prompt": "The trees planted by the Dutch produced larger quantities of cinnamon than the wild trees.",
            "answer": "Not Given",
            "explanation": EXPLAIN.q12,
            "locate": [
              {
                "para": 4,
                "text": "the Dutch began cultivating their own cinnamon trees to supplement the diminishing number of wild trees"
              }
            ]
          },
          {
            "id": "q13",
            "type": "tfng",
            "prompt": "The spice trade maintained its economic importance during the 19th century.",
            "answer": "False",
            "explanation": EXPLAIN.q13,
            "locate": [
              {
                "para": 5,
                "text": "the spice trade overall was diminishing in economic potential"
              }
            ]
          }
        ]
      }
    ],
    // Vocab set (bản nháp do tôi soạn từ bài đọc — nghĩa tiếng Việt cần bạn rà soát).
    vocab: [
      { word: 'cultivation', partOfSpeech: 'n', meaning: 'sự cày cấy / sự trồng trọt', example: 'The cultivation of wheat required the most fertile lands.', ipa: '/ˌkʌltɪˈveɪʃn/', definitionEn: 'the act of preparing land and growing crops on it, or the act of growing a particular crop', exampleVi: 'Sự trồng trọt lúa mì yêu cầu những vùng đất màu mỡ nhất.', image: '/ielts/images/vocab/cultivation.jpg' },
      { word: 'ethnic', partOfSpeech: 'adj', meaning: 'thuộc dân tộc thiểu số', example: 'They are the second largest ethnic group in Kenya.', ipa: '/ˈeθnɪk/', definitionEn: 'relating or belonging to a group of people who can be seen as distinct (= different) because they have a shared culture, tradition, language, history, etc.', exampleVi: 'Họ là dân tộc thiểu số lớn thứ nhì ở Kenya.', image: '/ielts/images/vocab/ethnic.avif' },
      { word: 'peel', partOfSpeech: 'v', meaning: 'lột', example: 'Carefully peel away the lining paper.', ipa: '/piːl/', definitionEn: 'to remove a layer, etc. from the surface of something; to come off the surface of something', exampleVi: 'Cẩn thận lột giấy dán tường.', image: '/ielts/images/vocab/peel.jpg' },
      { word: 'shoot', partOfSpeech: 'n', meaning: 'chồi (cây)', example: 'Two weeks after we\'d planted the seeds, little green shoots started to appear.', ipa: '/ʃuːt/', definitionEn: 'the part that grows up from the ground when a plant starts to grow', exampleVi: 'Hai tuần sau khi chúng tôi gieo hạt, những chồi non đã bắt đầu xuất hiện.', image: '/ielts/images/vocab/shoot.avif' },
      { word: 'pliable', partOfSpeech: 'adj', meaning: 'dễ uốn nắn, uốn cong', example: 'The plant has long pliable stems.', ipa: '/ˈplaɪəbl/', definitionEn: 'easy to bend without breaking', exampleVi: 'Cái cây có rễ dài dễ uốn.', image: '/ielts/images/vocab/pliable.jpg' },
      { word: 'curl', partOfSpeech: 'v', meaning: 'cuộn lại', example: 'A new baby will automatically curl its fingers round any object it touches.', ipa: '/kɜːrl/', definitionEn: 'to make something into the shape of a curl', exampleVi: 'Trẻ sơ sinh sẽ tự động cuộn ngón tay lại xung quanh bất cứ thứ nào nó chạm vào.', image: '/ielts/images/vocab/curl.jpg' },
      { word: 'tribute', partOfSpeech: 'n', meaning: 'cống phẩm', example: 'The king also often received tributes and offerings at these occasions.', ipa: '/ˈtrɪbjuːt/', definitionEn: 'money given by one country or political leader to another, especially in return for protection or for not being attacked', exampleVi: 'Vị vua cũng thường nhận cống phẩm và lễ vật trong những dịp này.', image: '/ielts/images/vocab/tribute.jpg' },
      { word: 'enslave', partOfSpeech: 'v', meaning: 'nô dịch', example: 'The early settlers enslaved or killed much of the native population.', ipa: '/ɪnˈsleɪv/', definitionEn: 'to make a slave of someone', exampleVi: 'Những kẻ khai hoang đã nô dịch hoặc giết hầu hết người dân bản địa.', image: '/ielts/images/vocab/enslave.jpg' },
      { word: 'fort', partOfSpeech: 'n', meaning: 'pháo đài', example: 'The remains of the Roman fort are well preserved.', ipa: '/fɔːrt/', definitionEn: 'a fortified building or position used by military troops for protection and defense.', exampleVi: 'Tàn tích của pháo đài La Mã được bảo quản kỹ lưỡng.', image: '/ielts/images/vocab/fort.jpg' },
      { word: 'monopoly', partOfSpeech: 'n', meaning: 'sự độc quyền', example: 'In the past central government had a monopoly on television broadcasting.', ipa: '/məˈnɑːpəli/', definitionEn: 'the complete control of trade in particular goods or the supply of a particular service', exampleVi: 'Trong quá khứ chính quyền trung ương độc quyền về đài truyền hình.', image: '/ielts/images/vocab/monopoly.jpg' },
      { word: 'generate', partOfSpeech: 'v', meaning: 'tạo ra', example: 'to generate revenue/income/profit', ipa: '/ˈdʒenəreɪt/', definitionEn: 'to produce or create something', exampleVi: 'tạo ra lợi nhuận / thu nhập', image: '/ielts/images/vocab/generate.jpg' },
      { word: 'ally', partOfSpeech: 'v', meaning: 'liên minh', example: 'The prince allied himself with the Scots.', ipa: '/əˈlaɪ/', definitionEn: 'to give your support to another group or country', exampleVi: 'Hoàng tử đã liên minh với người Scotlands.', image: '/ielts/images/vocab/ally.jpg' },
      { word: 'overrun', partOfSpeech: 'v', meaning: 'đánh bại hoặc áp đảo hoàn toàn một người hoặc thứ gì đó', example: 'The army was overrun by the enemy', ipa: '/ˌoʊvəˈrʌn/', definitionEn: 'to defeat or overwhelm someone or something completely', exampleVi: 'Quân đội bị kẻ thù đánh bại hoàn toàn', image: '/ielts/images/vocab/overrun.jpg' },
      { word: 'expell', partOfSpeech: 'v', meaning: 'trục xuất', example: 'Thousands of Jews had been expelled from the city.', ipa: '/ɪkˈspel/', definitionEn: 'to force somebody to leave a country', exampleVi: 'Hàng nghìn người Do Thái bị trục xuất khỏi thành phố', image: '/ielts/images/vocab/expell.jpg' },
      { word: 'lucrative', partOfSpeech: 'adj', meaning: 'có lời, sinh lời', example: 'The merger proved to be very lucrative for both companies.', ipa: '/ˈluːkrətɪv/', definitionEn: 'producing a large amount of money; making a large profit', exampleVi: 'Sự liên doanh đã chứng minh là có sinh lời cho cả 2 công ty.', image: '/ielts/images/vocab/lucrative.avif' },
      { word: 'appetite', partOfSpeech: 'n', meaning: 'sự thèm khát', example: 'The public have an insatiable appetite for scandal.', ipa: '/ˈæpɪtaɪt/', definitionEn: 'a strong desire for something', exampleVi: 'Công chúng có sự thèm khát xì-căng-đan vô độ', image: '/ielts/images/vocab/appetite.avif' },
      { word: 'supply', partOfSpeech: 'n', meaning: 'nguồn cung', example: 'Advances in agriculture increased the food supply.', ipa: '/səˈplaɪ/', definitionEn: 'an amount of something that is provided or available to be used', exampleVi: 'Những tiến bộ trong nông nghiệp đã tăng nguồn cung thực phẩm.', image: '/ielts/images/vocab/supply.avif' },
      { word: 'exhausted', partOfSpeech: 'adj', meaning: 'cạn kiệt', example: 'financially exhausted countries', ipa: '/ɪɡˈzɔːstɪd/', definitionEn: 'completely used or finished', exampleVi: 'những quốc gia kiệt quệ về tài chính.', image: '/ielts/images/vocab/exhausted.jpg' },
      { word: 'supplement', partOfSpeech: 'n', meaning: 'bổ sung', example: 'He supplements his income by giving private lessons.', ipa: '/ˈsʌplɪmənt/', definitionEn: 'to add something to something in order to improve it or make it more complete', exampleVi: 'Anh ta thêm vào thu nhập của mình bằng cách dạy thêm', image: '/ielts/images/vocab/supplement.jpg' },
      { word: 'diminish', partOfSpeech: 'v', meaning: 'giảm', example: 'The world\'s resources are rapidly diminishing.', ipa: '/dɪˈmɪnɪʃ/', definitionEn: 'to become smaller, weaker, etc.', exampleVi: 'Những nguồn lực trên thế giới đang giảm nhanh.', image: '/ielts/images/vocab/diminish.avif' },
      { word: 'displace', partOfSpeech: 'v', meaning: 'thay thế, chiếm chỗ', example: 'Gradually factory workers have been displaced by machines.', ipa: '/dɪsˈpleɪs/', definitionEn: 'to take the place of somebody/something', exampleVi: 'Công nhân nhà máy đã dần bị thay thế bởi máy móc', image: '/ielts/images/vocab/displace.jpg' },
      { word: 'economic potential', partOfSpeech: 'n', meaning: 'tiềm năng kinh tế', example: 'It also leaves the country\'s economic potential unfulfilled.', ipa: '/ˌiːkəˈnɑːmɪk pəˈtenʃl/', definitionEn: 'the potential of a region, nation, or corporation for economic development and growth.', exampleVi: 'Nó cũng khiến cho quốc gia không thể đạt được tiềm năng kinh tế của bản thân.', image: '/ielts/images/vocab/economic-potential.jpg' },
      { word: 'fragrant', partOfSpeech: 'adj', meaning: 'thơm, có hương thơm', example: 'Cinnamon is a sweet, fragrant spice.', ipa: '/ˈfreɪɡrənt/', definitionEn: 'having a pleasant smell', exampleVi: 'Quế là một loại gia vị ngọt, thơm.', image: '/ielts/images/vocab/fragrant.svg' },
      { word: 'anoint', partOfSpeech: 'v', meaning: 'xức dầu (làm phép)', example: 'It was mixed with oils for anointing people’s bodies.', ipa: '/əˈnɔɪnt/', definitionEn: 'to put oil or water on someone as part of a religious ceremony', exampleVi: 'Nó được trộn với dầu để xức lên người.', image: '/ielts/images/vocab/anoint.svg' },
      { word: 'token', partOfSpeech: 'n', meaning: 'vật tượng trưng, dấu hiệu', example: 'A token indicating friendship among lovers and friends.', ipa: '/ˈtoʊkən/', definitionEn: 'a thing that represents a feeling, fact or quality', exampleVi: 'Một vật tượng trưng cho tình bạn giữa những người yêu nhau và bạn bè.', image: '/ielts/images/vocab/token.svg' },
      { word: 'additive', partOfSpeech: 'n', meaning: 'chất phụ gia, thứ thêm vào', example: 'The spice was used as an additive to food and drink.', ipa: '/ˈædətɪv/', definitionEn: 'a substance added to food or drink to improve it or preserve it', exampleVi: 'Gia vị được dùng như chất phụ gia cho đồ ăn thức uống.', image: '/ielts/images/vocab/additive.svg' },
      { word: 'condiment', partOfSpeech: 'n', meaning: 'đồ gia vị (dùng nêm món ăn)', example: 'An expensive condiment from the ‘exotic’ East.', ipa: '/ˈkɑːndɪmənt/', definitionEn: 'a substance such as salt or a sauce that you add to food to give it more flavour', exampleVi: 'Một loại gia vị đắt đỏ từ phương Đông “kỳ lạ”.', image: '/ielts/images/vocab/condiment.svg' },
      { word: 'ailment', partOfSpeech: 'n', meaning: 'bệnh vặt, chứng bệnh nhẹ', example: 'It was thought to cure various ailments, such as indigestion.', ipa: '/ˈeɪlmənt/', definitionEn: 'an illness that is not very serious', exampleVi: 'Người ta tin nó chữa được nhiều chứng bệnh nhẹ, như khó tiêu.', image: '/ielts/images/vocab/ailment.svg' },
      { word: 'exorbitantly', partOfSpeech: 'adv', meaning: 'cắt cổ, quá đắt', example: 'The Venetians could set the price of cinnamon exorbitantly high.', ipa: '/ɪɡˈzɔːrbɪtəntli/', definitionEn: 'in a way that is much too high (of a price)', exampleVi: 'Người Venice có thể đẩy giá quế lên cực kỳ cao.', image: '/ielts/images/vocab/exorbitantly.svg' },
      { word: 'supersede', partOfSpeech: 'v', meaning: 'thay thế (cái cũ lỗi thời)', example: 'The spice trade was eventually superseded by trade in coffee, tea, chocolate and sugar.', ipa: '/ˌsuːpərˈsiːd/', definitionEn: 'to take the place of something that is older or no longer considered best', exampleVi: 'Thương mại gia vị dần bị thay thế bởi cà phê, trà, sô-cô-la và đường.', image: '/ielts/images/vocab/supersede.svg' },
    ],
  },
  {
    id: 'reading-making-the-most-of-trends',
    skill: 'reading',
    title: 'Making The Most Of Trends',
    category: 'Practice test',
    part: 'Reading 6',
    durationMin: 22,
    passageTitle: 'Making The Most Of Trends',
    paragraphLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    passage: [
      'Most managers can identify the major trends of the day. But in the course of conducting research in a number of industries and working directly with companies, we have discovered that managers often fail to recognize the less obvious but profound ways these trends are influencing consumers’ aspirations, attitudes, and behaviors. This is especially true of trends that managers view as peripheral to their core markets.',
      'Many ignore trends in their innovation strategies or adopt a wait-and-see approach and let competitors take the lead. At a minimum, such responses mean missed profit opportunities. At the extreme, they can jeopardize a company by ceding to rivals the opportunity to transform the industry. The purpose of this article is twofold: to spur managers to think more expansively about how trends could engender new value propositions in their core markets, and to provide some high-level advice on how to make market research and product development personnel more adept at analyzing and exploiting trends.',
      'One strategy, known as ‘infuse and augment’, is to design a product or service that retains most of the attributes and functions of existing products in the category but adds others that address the needs and desires unleashed by a major trend. A case in point is the Poppy range of handbags, which the firm Coach created in response to the economic downturn of 2008. The Coach brand had been a symbol of opulence and luxury for nearly 70 years, and the most obvious reaction to the downturn would have been to lower prices. However, that would have risked cheapening the brand’s image. Instead, they initiated a consumer-research project which revealed that customers were eager to lift themselves and the country out of tough times. Using these insights, Coach launched the lower-priced Poppy handbags, which were in vibrant colors, and looked more youthful and playful than conventional Coach products. Creating the sub-brand allowed Coach to avert an across-the-board price cut. In contrast to the many companies that responded to the recession by cutting prices, Coach saw the new consumer mindset as an opportunity for innovation and renewal.',
      'A further example of this strategy was supermarket Tesco’s response to consumers’ growing concerns about the environment. With that in mind, Tesco, one of the world’s top five retailers, introduced its Greener Living program, which demonstrates the company’s commitment to protecting the environment by involving consumers in ways that produce tangible results. For example, Tesco customers can accumulate points for such activities as reusing bags, recycling cans and printer cartridges, and buying home-insulation materials. Like points earned on regular purchases, these green points can be redeemed for cash. Tesco has not abandoned its traditional retail offerings but augmented its business with these innovations, thereby infusing its value proposition with a green streak.',
      'A more radical strategy is ‘combine and transcend’. This entails combining aspects of the product’s existing value proposition with attributes addressing changes arising from a trend, to create a novel experience – one that may land the company in an entirely new market space.',
      'At first glance, spending resources to incorporate elements of a seemingly irrelevant trend into one’s core offerings sounds like it’s hardly worthwhile. But consider Nike’s move to integrate the digital revolution into its reputation for high-performance athletic footwear. In 2006, they teamed up with technology company Apple to launch Nike+, a digital sports kit comprising a sensor that attaches to the running shoe and a wireless receiver that connects to the user’s iPod. By combining Nike’s original value proposition for amateur athletes with one for digital consumers, the Nike sports kit and web interface moved the company from a focus on athletic apparel to a new plane of engagement with its customers.',
      'A third approach, known as ‘counteract and reaffirm’, involves developing products or services that stress the values traditionally associated with the category in ways that allow consumers to oppose or at least temporarily escape from the aspects of trends they view as undesirable.',
      'A product that accomplished this is the ME2, a video game created by Canada’s iToys. By reaffirming the toy category’s association with physical play, the ME2 counteracted some of the widely perceived negative impacts of digital gaming devices. Like other handheld games, the device featured a host of exciting interactive games, a full-color LCD screen, and advanced 3D graphics. What set it apart was that it incorporated the traditional physical component of children’s play: it contained a pedometer, which tracked and awarded points for physical activity (walking, running, biking, skateboarding, climbing stairs). The child could use the points to enhance various virtual skills needed for the video game. The ME2, introduced in mid-2008, catered to kids’ huge desire to play video games while countering the negatives, such as associations with lack of exercise and obesity.',
      'Once you have gained perspective on how trend-related changes in consumer opinions and behaviors impact on your category, you can determine which of our three innovation strategies to pursue. When your category’s basic value proposition continues to be meaningful for consumers influenced by the trend, the infuse-and-augment strategy will allow you to reinvigorate the category. If analysis reveals an increasing disparity between your category and consumers’ new focus, your innovations need to transcend the category to integrate the two worlds. Finally, if aspects of the category clash with undesired outcomes of a trend, such as associations with unhealthy lifestyles, there is an opportunity to counteract those changes by reaffirming the core values of your category.',
      'Trends – technological, economic, environmental, social, or political – that affect how people perceive the world around them and shape what they expect from products and services present firms with unique opportunities for growth.',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Choose appropriate options **A, B, C** or **D**.',
        questions: [
          {
            id: 'q1',
            type: 'mcq',
            prompt: 'In the first paragraph, the writer says that most managers',
            options: [
              'fail to spot the key consumer trends of the moment.',
              'make the mistake of focusing only on the principal consumer trends.',
              'misinterpret market research data relating to current consumer trends.',
              'are unaware of the significant impact that trends have on consumers’ lives.',
            ],
            answer: 'are unaware of the significant impact that trends have on consumers’ lives.',
            explanation: TRENDS_EXPLAIN.q1,
            locate: [
              {
                para: 0,
                text: 'we have discovered that managers often fail to recognize the less obvious but profound ways these trends are influencing consumers’ aspirations, attitudes, and behaviors',
              },
            ],
          },
          {
            id: 'q2',
            type: 'mcq',
            prompt: 'According to the third paragraph, Coach was anxious to',
            options: [
              'follow what some of its competitors were doing.',
              'maintain its prices throughout its range.',
              'safeguard its reputation as a manufacturer of luxury goods.',
              'modify the entire look of its brand to suit the economic climate.',
            ],
            answer: 'safeguard its reputation as a manufacturer of luxury goods.',
            explanation: TRENDS_EXPLAIN.q2,
            locate: [{ para: 2, text: 'that would have risked cheapening the brand’s image' }],
          },
          {
            id: 'q3',
            type: 'mcq',
            prompt: 'What point is made about Tesco’s Greener Living programme?',
            options: [
              'It did not require Tesco to modify its core business activities.',
              'It succeeded in attracting a more eco-conscious clientele.',
              'Its main aim was to raise consumers’ awareness of environmental issues.',
              'It was not the first time that Tesco had implemented such an initiative.',
            ],
            answer: 'It did not require Tesco to modify its core business activities.',
            explanation: TRENDS_EXPLAIN.q3,
            locate: [
              {
                para: 3,
                text: 'Tesco has not abandoned its traditional retail offerings but augmented its business with these innovations',
              },
            ],
          },
          {
            id: 'q4',
            type: 'mcq',
            prompt: 'What does the writer suggest about Nike’s strategy?',
            options: [
              'It was an extremely risky strategy at the time.',
              'It was a strategy that only a major company could afford to follow.',
              'It was the type of strategy that would not have been possible in the past.',
              'It was the kind of strategy which might appear to have few obvious benefits.',
            ],
            answer: 'It was the kind of strategy which might appear to have few obvious benefits.',
            explanation: TRENDS_EXPLAIN.q4,
            locate: [
              {
                para: 5,
                text: 'spending resources to incorporate elements of a seemingly irrelevant trend into one’s core offerings sounds like it’s hardly worthwhile',
              },
            ],
          },
          {
            id: 'q5',
            type: 'mcq',
            prompt: 'What was original about the ME2?',
            options: [
              'It contained technology that had been developed for the sports industry.',
              'It appealed to young people who were keen to improve their physical fitness.',
              'It took advantage of a current trend for video games with colourful 3D graphics.',
              'It was a handheld game that addressed people’s concerns about unhealthy lifestyles.',
            ],
            answer: 'It was a handheld game that addressed people’s concerns about unhealthy lifestyles.',
            explanation: TRENDS_EXPLAIN.q5,
            locate: [
              {
                para: 7,
                text: 'catered to kids’ huge desire to play video games while countering the negatives, such as associations with lack of exercise and obesity',
              },
            ],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Match each statement with the correct company, **A, B, C** or **D**.',
        matchLegend: [
          { key: 'A', label: 'Coach' },
          { key: 'B', label: 'Tesco' },
          { key: 'C', label: 'Nike' },
          { key: 'D', label: 'iToys' },
        ],
        questions: [
          {
            id: 'q6',
            type: 'match',
            prompt: 'It turned the notion that its products could have harmful effects to its own advantage.',
            answer: 'D',
            explanation: TRENDS_EXPLAIN.q6,
            locate: [
              {
                para: 7,
                text: 'By reaffirming the toy category’s association with physical play, the ME2 counteracted some of the widely perceived negative impacts of digital gaming devices',
              },
            ],
          },
          {
            id: 'q7',
            type: 'match',
            prompt: 'It extended its offering by collaborating with another manufacturer.',
            answer: 'C',
            explanation: TRENDS_EXPLAIN.q7,
            locate: [{ para: 5, text: 'they teamed up with technology company Apple to launch Nike+' }],
          },
          {
            id: 'q8',
            type: 'match',
            prompt: 'It implemented an incentive scheme to demonstrate its corporate social responsibility.',
            answer: 'B',
            explanation: TRENDS_EXPLAIN.q8,
            locate: [
              {
                para: 3,
                text: 'Tesco customers can accumulate points for such activities as reusing bags, recycling cans and printer cartridges',
              },
            ],
          },
          {
            id: 'q9',
            type: 'match',
            prompt: 'It discovered that customers had a positive attitude towards dealing with difficult circumstances.',
            answer: 'A',
            explanation: TRENDS_EXPLAIN.q9,
            locate: [{ para: 2, text: 'customers were eager to lift themselves and the country out of tough times' }],
          },
          {
            id: 'q10',
            type: 'match',
            prompt: 'It responded to a growing lifestyle trend in an unrelated product sector.',
            answer: 'C',
            explanation: TRENDS_EXPLAIN.q10,
            locate: [
              {
                para: 5,
                text: 'consider Nike’s move to integrate the digital revolution into its reputation for high-performance athletic footwear',
              },
            ],
          },
          {
            id: 'q11',
            type: 'match',
            prompt: 'It successfully avoided having to charge its customers less for its core products.',
            answer: 'A',
            explanation: TRENDS_EXPLAIN.q11,
            locate: [{ para: 2, text: 'Creating the sub-brand allowed Coach to avert an across-the-board price cut' }],
          },
        ],
      },
      {
        id: 'g3',
        instruction: 'Complete each sentence with the correct ending, **A, B, C** or **D** below.',
        optionBank: [
          'employ a combination of strategies to maintain your consumer base.',
          'identify the most appropriate innovation strategy to use.',
          'emphasise your brand’s traditional values with the counteract-and-reaffirm strategy.',
          'use the combine-and-transcend strategy to integrate the two worlds.',
        ],
        questions: [
          {
            id: 'q12',
            type: 'bank',
            prompt: 'If there are any trend-related changes impacting on your category, you should',
            answer: 'identify the most appropriate innovation strategy to use.',
            explanation: TRENDS_EXPLAIN.q12,
            locate: [{ para: 8, text: 'you can determine which of our three innovation strategies to pursue' }],
          },
          {
            id: 'q13',
            type: 'bank',
            prompt: 'If a current trend highlights a negative aspect of your category, you should',
            answer: 'emphasise your brand’s traditional values with the counteract-and-reaffirm strategy.',
            explanation: TRENDS_EXPLAIN.q13,
            locate: [
              {
                para: 8,
                text: 'there is an opportunity to counteract those changes by reaffirming the core values of your category',
              },
            ],
          },
          {
            id: 'q14',
            type: 'bank',
            prompt: 'If the consumers’ new focus has an increasing lack of connection with your offering you should',
            answer: 'use the combine-and-transcend strategy to integrate the two worlds.',
            explanation: TRENDS_EXPLAIN.q14,
            locate: [
              {
                para: 8,
                text: 'your innovations need to transcend the category to integrate the two worlds',
              },
            ],
          },
        ],
      },
    ],
    vocab: [],
  },
  {
    id: 'reading-venus-in-transit',
    skill: 'reading',
    title: 'Venus in Transit',
    category: 'Practice test',
    part: 'Reading 7',
    durationMin: 20,
    passageTitle: 'Venus in Transit',
    paragraphLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    passage: [
      'On 8 June 2004, more than half the population of the world were treated to a rare astronomical event. For over six hours, the planet Venus steadily inched its way over the surface of the Sun. This ‘transit’ of Venus was the first since 6 December 1882. On that occasion, the American astronomer Professor Simon Newcomb led a party to South Africa to observe the event. They were based at a girls’ school, where - it is alleged - the combined forces of three schoolmistresses outperformed the professionals with the accuracy of their observations.',
      'For centuries, transits of Venus have drawn explorers and astronomers alike to the four corners of the globe. And you can put it all down to the extraordinary polymath Edmond Halley. In November 1677, Halley observed a transit of the innermost planet, Mercury, from the desolate island of St Helena in the South Pacific. He realised that, from different latitudes, the passage of the planet across the Sun’s disc would appear to differ. By timing the transit from two widely-separated locations, teams of astronomers could calculate the parallax angle - the apparent difference in position of an astronomical body due to a difference in the observer’s position. Calculating this angle would allow astronomers to measure what was then the ultimate goal: the distance of the Earth from the Sun. This distance is known as the ‘astronomical unit’ or AU.',
      'Halley was aware that the AU was one of the most fundamental of all astronomical measurements. Johannes Kepler, in the early 17th century, had shown that the distances of the planets from the Sun governed their orbital speeds, which were easily measurable. But no-one had found a way to calculate accurate distances to the planets from the Earth. The goal was to measure the AU; then, knowing the orbital speeds of all the other planets round the Sun, the scale of the Solar System would fall into place. However, Halley realised that Mercury was so far away that its parallax angle would be very difficult to determine. As Venus was closer to the Earth, its parallax angle would be larger, and Halley worked out that by using Venus it would be possible to measure the Sun’s distance to 1 part in 500. But there was a problem: transits of Venus, unlike those of Mercury, are rare, occurring in pairs roughly eight years apart every hundred or so years. Nevertheless, he accurately predicted that Venus would cross the face of the Sun in both 1761 and 1769 - though he didn’t survive to see either.',
      'Inspired by Halley’s suggestion of a way to pin down the scale of the Solar System, teams of British and French astronomers set out on expeditions to places as diverse as India and Siberia. But things weren’t helped by Britain and France being at war. The person who deserves most sympathy is the French astronomer Guillaume Le Gentil. He was thwarted by the fact that the British were besieging his observation site at Pondicherry in India. Fleeing on a French warship crossing the Indian Ocean, Le Gentil saw a wonderful transit - but the ship’s pitching and rolling ruled out any attempt at making accurate observations. Undaunted, he remained south of the equator, keeping himself busy by studying the islands of Mauritius and Madagascar before setting off to observe the next transit in the Philippines. Ironically, after travelling nearly 50,000 kilometres, his view was clouded out at the last moment, a very dispiriting experience.',
      'While the early transit timings were as precise as instruments would allow, the measurements were dogged by the ‘black drop’ effect. When Venus begins to cross the Sun’s disc, it looks smeared not circular - which makes it difficult to establish timings. This is due to diffraction of light. The second problem is that Venus exhibits a halo of light when it is seen just outside the Sun’s disc. While this showed astronomers that Venus was surrounded by a thick layer of gases refracting sunlight around it, both effects made it impossible to obtain accurate timings.',
      'But astronomers laboured hard to analyse the results of these expeditions to observe Venus transits. Johann Franz Encke, Director of the Berlin Observatory, finally determined a value for the AU based on all these parallax measurements: 153,340,000 km. Reasonably accurate for the time, that is quite close to today’s value of 149,597,870 km, determined by radar, which has now superseded transits and all other methods in accuracy. The AU is a cosmic measuring rod, and the basis of how we scale the Universe today. The parallax principle can be extended to measure the distances to the stars. If we look at a star in January - when Earth is at one point in its orbit - it will seem to be in a different position from where it appears six months later. Knowing the width of Earth’s orbit, the parallax shift lets astronomers calculate the distance.',
      'June 2004’s transit of Venus was thus more of an astronomical spectacle than a scientifically important event. But such transits have paved the way for what might prove to be one of the most vital breakthroughs in the cosmos - detecting Earth-sized planets orbiting other stars.',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Which paragraph contains the following information?',
        matchLegend: [
          { key: 'A', label: '' },
          { key: 'B', label: '' },
          { key: 'C', label: '' },
          { key: 'D', label: '' },
          { key: 'E', label: '' },
          { key: 'F', label: '' },
          { key: 'G', label: '' },
        ],
        questions: [
          {
            id: 'q1',
            type: 'match',
            prompt: 'examples of different ways in which the parallax principle has been applied',
            answer: 'F',
            explanation: VENUS_EXPLAIN.q1,
            locate: [
              { para: 5, text: 'finally determined a value for the AU based on all these parallax measurements' },
              { para: 5, text: 'The parallax principle can be extended to measure the distances to the stars' },
            ],
          },
          {
            id: 'q2',
            type: 'match',
            prompt: 'a description of an event which prevented a transit observation',
            answer: 'D',
            explanation: VENUS_EXPLAIN.q2,
            locate: [{ para: 3, text: 'He was thwarted by the fact that the British were besieging his observation site at Pondicherry in India' }],
          },
          {
            id: 'q3',
            type: 'match',
            prompt: 'a statement about potential future discoveries leading on from transit observations',
            answer: 'G',
            explanation: VENUS_EXPLAIN.q3,
            locate: [{ para: 6, text: 'such transits have paved the way for what might prove to be one of the most vital breakthroughs in the cosmos - detecting Earth-sized planets orbiting other stars' }],
          },
          {
            id: 'q4',
            type: 'match',
            prompt: 'a description of physical states connected with Venus which early astronomical instruments failed to overcome',
            answer: 'E',
            explanation: VENUS_EXPLAIN.q4,
            locate: [{ para: 4, text: 'both effects made it impossible to obtain accurate timings' }],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Match each statement with the correct person, **A, B, C** or **D**.',
        matchLegend: [
          { key: 'A', label: 'Edmond Halley' },
          { key: 'B', label: 'Johannes Kepler' },
          { key: 'C', label: 'Guillaume Le Gentil' },
          { key: 'D', label: 'Johann Franz Encke' },
        ],
        questions: [
          {
            id: 'q5',
            type: 'match',
            prompt: 'He calculated the distance of the Sun from the Earth based on observations of Venus with a fair degree of accuracy.',
            answer: 'D',
            explanation: VENUS_EXPLAIN.q5,
            locate: [{ para: 5, text: 'Johann Franz Encke, Director of the Berlin Observatory, finally determined a value for the AU based on all these parallax measurements: 153,340,000 km' }],
          },
          {
            id: 'q6',
            type: 'match',
            prompt: 'He understood that the distance of the Sun from the Earth could be worked out by comparing observations of a transit.',
            answer: 'A',
            explanation: VENUS_EXPLAIN.q6,
            locate: [{ para: 1, text: 'By timing the transit from two widely-separated locations, teams of astronomers could calculate the parallax angle' }],
          },
          {
            id: 'q7',
            type: 'match',
            prompt: 'He realised that the time taken by a planet to go round the Sun depends on its distance from the Sun.',
            answer: 'B',
            explanation: VENUS_EXPLAIN.q7,
            locate: [{ para: 2, text: 'Johannes Kepler, in the early 17th century, had shown that the distances of the planets from the Sun governed their orbital speeds' }],
          },
          {
            id: 'q8',
            type: 'match',
            prompt: 'He witnessed a Venus transit but was unable to make any calculations.',
            answer: 'C',
            explanation: VENUS_EXPLAIN.q8,
            locate: [{ para: 3, text: 'Le Gentil saw a wonderful transit - but the ship’s pitching and rolling ruled out any attempt at making accurate observations' }],
          },
        ],
      },
      {
        id: 'g3',
        instruction: 'Choose **TRUE/FALSE/NOT GIVEN**',
        questions: [
          {
            id: 'q9',
            type: 'tfng',
            prompt: 'Halley observed one transit of the planet Venus.',
            answer: 'False',
            explanation: VENUS_EXPLAIN.q9,
            locate: [
              { para: 1, text: 'Halley observed a transit of the innermost planet, Mercury' },
              { para: 2, text: 'he accurately predicted that Venus would cross the face of the Sun in both 1761 and 1769 - though he didn’t survive to see either' },
            ],
          },
          {
            id: 'q10',
            type: 'tfng',
            prompt: 'Le Gentil managed to observe a second Venus transit.',
            answer: 'False',
            explanation: VENUS_EXPLAIN.q10,
            locate: [{ para: 3, text: 'after travelling nearly 50,000 kilometres, his view was clouded out at the last moment' }],
          },
          {
            id: 'q11',
            type: 'tfng',
            prompt: 'The shape of Venus appears distorted when it starts to pass in front of the Sun.',
            answer: 'True',
            explanation: VENUS_EXPLAIN.q11,
            locate: [{ para: 4, text: 'When Venus begins to cross the Sun’s disc, it looks smeared not circular' }],
          },
          {
            id: 'q12',
            type: 'tfng',
            prompt: 'Early astronomers suspected that the atmosphere on Venus was toxic.',
            answer: 'Not Given',
            explanation: VENUS_EXPLAIN.q12,
            locate: [{ para: 4, text: 'Venus was surrounded by a thick layer of gases refracting sunlight around it' }],
          },
          {
            id: 'q13',
            type: 'tfng',
            prompt: 'The parallax principle allows astronomers to work out how far away distant stars are from the Earth.',
            answer: 'True',
            explanation: VENUS_EXPLAIN.q13,
            locate: [{ para: 5, text: 'The parallax principle can be extended to measure the distances to the stars' }],
          },
        ],
      },
    ],
    vocab: [
      {
        word: 'passage',
        partOfSpeech: 'n',
        meaning: 'sự đi qua',
        example: 'Large trees may obstruct the passage of light.',
        ipa: '/ˈpæsɪdʒ/',
        definitionEn: 'the action of going across, through or past something',
        exampleVi: 'Những cây lớn có thể gây cản trở đường đi của ánh sáng.',
        image: '/ielts/images/vocab/passage.jpg',
      },
      {
        word: 'astronomer',
        partOfSpeech: 'n',
        meaning: 'nhà thiên văn',
        example: 'Astronomers continue to discover new stars.',
        ipa: '/əˈstrɑːnəmər/',
        definitionEn: 'a person who studies astronomy or whose job is connected with astronomy',
        exampleVi: 'Những nhà thiên văn vẫn tiếp tục phát hiện những ngôi sao mới.',
        image: '/ielts/images/vocab/astronomer.jpg',
      },
      {
        word: 'ultimate',
        partOfSpeech: 'adj',
        meaning: 'sau cùng',
        example: 'The ultimate decision lies with the parents.',
        ipa: '/ˈʌltɪmət/',
        definitionEn: 'happening at the end of a long process',
        exampleVi: 'Quyết định sau cùng nằm ở phụ huynh.',
        image: '/ielts/images/vocab/ultimate.jpg',
      },
      {
        word: 'pin down',
        partOfSpeech: 'v',
        meaning: 'hiểu / phát hiện chính xác',
        example: 'We can’t pin down where the leak came from.',
        ipa: '/pɪn daʊn/',
        definitionEn: 'to discover exact details about something',
        exampleVi: 'Chúng tôi không thể phát hiện chính xác sự rò rỉ đến từ đâu.',
        image: '/ielts/images/vocab/pin-down.jpeg',
      },
      {
        word: 'scale',
        partOfSpeech: 'n',
        meaning: 'quy mô',
        example: 'Nuclear weapons cause destruction on a massive scale.',
        ipa: '/skeɪl/',
        definitionEn: 'the size or level of something, especially when this is large',
        exampleVi: 'Vũ khí hạt nhân có thể hủy diệt ở quy mô khổng lồ.',
        image: '/ielts/images/vocab/scale.jpg',
      },
      {
        word: 'rare',
        partOfSpeech: 'adj',
        meaning: 'hiếm',
        example: 'The museum is full of rare and precious treasures.',
        ipa: '/rer/',
        definitionEn: 'not common or frequent',
        exampleVi: 'Viện bảo tàng có đầy báu vật quý hiếm.',
        image: '/ielts/images/vocab/rare.jpg',
      },
      {
        word: 'besiege',
        partOfSpeech: 'v',
        meaning: 'vây hãm',
        example: 'The town had been besieged for two months but still resisted the aggressors.',
        ipa: '/bɪˈsiːdʒ/',
        definitionEn: 'to surround a place, especially with an army, to prevent people or supplies getting in or out',
        exampleVi: 'Thị trấn đã bị vây hãm trong 2 tháng nhưng vẫn chống trả kẻ xâm lược.',
        image: '/ielts/images/vocab/besiege.jpg',
      },
      {
        word: 'flee',
        partOfSpeech: 'v',
        meaning: 'bỏ trốn',
        example: 'In order to escape capture, he fled to the mountains.',
        ipa: '/fliː/',
        definitionEn: 'to escape by running away, especially because of danger or fear',
        exampleVi: 'Để tránh bị bắt, ông ta đã bỏ trốn lên núi.',
        image: '/ielts/images/vocab/flee.jpeg',
      },
      {
        word: 'rule out',
        partOfSpeech: 'v',
        meaning: 'loại trừ',
        example: 'The police have not ruled him out as a suspect.',
        ipa: '/ruːl aʊt/',
        definitionEn: 'to decide or say officially that something is impossible or will not happen',
        exampleVi: 'Lực lượng cảnh sát vẫn chưa loại anh ta khỏi diện tình nghi.',
        image: '/ielts/images/vocab/rule-out.jpg',
      },
      {
        word: 'cloud',
        partOfSpeech: 'v',
        meaning: 'bị che mờ',
        example: 'Her eyes clouded with tears.',
        ipa: '/klaʊd/',
        definitionEn: 'if glass, water, etc. clouds, or if something clouds it, it becomes less easy to see through',
        exampleVi: 'Mắt cô ấy nhòe đi bởi nước mắt.',
        image: '/ielts/images/vocab/cloud.jpg',
      },
      {
        word: 'diffraction',
        partOfSpeech: 'n',
        meaning: 'sự nhiễu xạ',
        example: 'The diffraction of light by a prism causes the formation of a rainbow.',
        ipa: '/dɪˈfrækʃən/',
        definitionEn: 'process of breaking up a stream of light into a series of dark or light bands or into the different colours of the spectrum',
        exampleVi: 'Sự tán xạ ánh sáng của một lăng kính tạo ra sự hình thành cầu vồng.',
        image: '/ielts/images/vocab/diffraction.jpeg',
      },
      {
        word: 'smear',
        partOfSpeech: 'v',
        meaning: 'làm mờ',
        example: 'His glasses were smeared.',
        ipa: '/smɪr/',
        definitionEn: 'to make something dirty or greasy',
        exampleVi: 'Mắt kính của anh ta bị mờ.',
        image: '/ielts/images/vocab/smear.jpg',
      },
      {
        // Lưu ý: thẻ nguồn để trống phần EN definition (chỗ đó lại chứa 1 câu ví dụ) — definitionEn dưới
        // đây là tôi tự viết, không lấy nguyên văn từ nguồn.
        word: 'refract',
        partOfSpeech: 'v',
        meaning: 'khúc xạ (ánh sáng)',
        example: 'The glass prism refracted the white light into the colours of the rainbow.',
        ipa: '/rɪˈfrækt/',
        definitionEn: 'if light refracts, or something refracts it, it changes direction slightly when it passes through the surface of something such as water or glass',
        exampleVi: 'Các tia sáng bị khúc xạ từ bề mặt nước làm cho đáy hồ dường như được nâng lên.',
        image: '/ielts/images/vocab/refract.jpg',
      },
      {
        word: 'exhibit',
        partOfSpeech: 'v',
        meaning: 'trưng bày, phô bày, cho thấy',
        example: 'They will be exhibiting their new designs at the trade fairs.',
        ipa: '/ɪɡˈzɪbɪt/',
        definitionEn: 'to show something',
        exampleVi: 'Họ sẽ trưng bày những thiết kế ở buổi hội chợ thương mại.',
        image: '/ielts/images/vocab/exhibit.jpg',
      },
      {
        word: 'halo',
        partOfSpeech: 'n',
        meaning: 'vầng hào quang',
        example: 'the halo around the moon',
        ipa: '/ˈheɪloʊ/',
        definitionEn: 'a bright circle of light around something, or something that looks like this',
        exampleVi: 'vầng sáng xung quanh mặt trăng',
        image: '/ielts/images/vocab/halo.jpg',
      },
      {
        word: 'determine',
        partOfSpeech: 'v',
        meaning: 'xác định',
        example: 'The police never actually determined the cause of death.',
        ipa: '/dɪˈtɜːrmɪn/',
        definitionEn: 'to discover the facts or truth about something',
        exampleVi: 'Lực lượng cảnh sát chưa bao giờ xác định được nguyên nhân cái chết.',
        image: '/ielts/images/vocab/determine.jpg',
      },
      {
        word: 'supersede',
        partOfSpeech: 'v',
        meaning: 'thay thế',
        example: 'Most of the old road has been superseded by the great interstate highways.',
        ipa: '/ˌsuːpərˈsiːd/',
        definitionEn: 'to replace something, especially something older or more old-fashioned',
        exampleVi: 'Hầu hết những con đường cũ đã bị thay thế bởi cao tốc liên bang.',
        image: '/ielts/images/vocab/supersede-vocab.jpg',
      },
      {
        word: 'thwart',
        partOfSpeech: 'v',
        meaning: 'cản trở, ngăn trở',
        example: 'Our holiday plans were thwarted by the airline pilots’ strike.',
        ipa: '/θwɔːrt/',
        definitionEn: 'to stop something from happening or someone from doing something',
        exampleVi: 'Kế hoạch nghỉ dưỡng của chúng tôi bị cản trở bởi cuộc đình công của phi công.',
        image: '/ielts/images/vocab/thwart.jpg',
      },
      {
        word: 'pair',
        partOfSpeech: 'n',
        meaning: 'theo cặp',
        example: 'The children work in pairs.',
        ipa: '/per/',
        definitionEn: 'in groups of two people or things',
        exampleVi: 'Những đứa trẻ làm việc theo cặp.',
        image: '/ielts/images/vocab/pair.jpg',
      },
      {
        word: 'accurately',
        partOfSpeech: 'adv',
        meaning: 'một cách chính xác',
        example: 'The plans should be drawn as accurately as possible.',
        ipa: '/ˈækjərətli/',
        definitionEn: 'in a way that is correct, exact, and without any mistakes',
        exampleVi: 'Kế hoạch phải được soạn kỹ lưỡng / chính xác nhất có thể.',
        image: '/ielts/images/vocab/accurately.jpg',
      },
    ],
  },
]
