import type { PracticeTest } from '@/lib/ielts/practice'
import { EXPLAIN } from './cinnamon-explain'
import { EXPLAIN as TRENDS_EXPLAIN } from './trends-explain'
import { EXPLAIN as VENUS_EXPLAIN } from './venus-explain'
import { EXPLAIN as SETI_EXPLAIN } from './seti-explain'
import { EXPLAIN as NUTMEG_EXPLAIN } from './nutmeg-explain'
import { EXPLAIN as BOARDS_EXPLAIN } from './boards-explain'
import { EXPLAIN as THYLACINE_EXPLAIN } from './thylacine-explain'
import { EXPLAIN as BILINGUAL_EXPLAIN } from './bilingual-explain'
import { EXPLAIN as PLAGUE_EXPLAIN } from './plague-explain'
import { EXPLAIN as EXPLORATION_EXPLAIN } from './exploration-explain'
import { EXPLAIN as DISORDER_EXPLAIN } from './disorder-explain'
import { EXPLAIN as ARTISTS_EXPLAIN } from './artists-explain'
import { EXPLAIN as DEEXTINCTION_EXPLAIN } from './deextinction-explain'
import { EXPLAIN as GIFTED_EXPLAIN } from './gifted-explain'
import { EXPLAIN as OXYTOCIN_EXPLAIN } from './oxytocin-explain'
import { EXPLAIN as BUGS_EXPLAIN } from './bugs-explain'

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
//
// LƯU Ý về "The Search for Extra-terrestrial Intelligence": bài đọc + câu hỏi lấy từ ảnh được cung cấp. ĐÁP ÁN
// cả 13 câu đã đối chiếu với answer key chính thức (bạn gửi ảnh) — 12/13 khớp ngay, câu 6 sửa từ "radio signals"
// thành "radio" theo key (vẫn chấm đúng "radio signals"). GIẢI THÍCH do tôi tự soạn. Đoạn mở đầu không có nhãn, các
// đoạn sau là A-E; câu 1-4 (chọn heading cho đoạn B-E) dùng type "bank", câu 8-13 dùng type "ynng"
// (Yes/No/Not Given). Chưa có Vocab set cho đề này.
//
// LƯU Ý về "Nutmeg — a valuable spice": bài đọc + câu hỏi lấy từ ảnh được cung cấp. ĐÁP ÁN cả 13 câu đã đối
// chiếu khớp 100% answer key chính thức (bạn gửi ảnh); GIẢI THÍCH do tôi tự soạn. Bài không chia đoạn theo chữ cái nên không có
// paragraphLabels. Câu 1-4 là Note Completion (table.bullets = true), câu 8-13 là Table Completion không có
// tiêu đề bảng. Chưa có Vocab set cho đề này.
//
// LƯU Ý về "UK Companies Need More Effective Boards of Directors": bài đọc + câu hỏi lấy từ ảnh được cung cấp;
// ĐÁP ÁN và GIẢI THÍCH do tôi tự suy luận từ bài đọc (chưa có đáp án gốc đối chiếu). Câu 1-7 (heading, mỗi đoạn
// A-G 1 câu, 8 heading → thừa 1) dùng type "bank", câu 8-11 type "ynng". Chưa có Vocab set cho đề này.
//
// LƯU Ý về "The thylacine": bài đọc + câu hỏi lấy từ ảnh được cung cấp. ĐÁP ÁN cả 13 câu đã đối chiếu với answer
// key chính thức (bạn gửi ảnh) — 12/13 khớp ngay, câu 13 sửa từ False thành Not Given theo key. GIẢI THÍCH do tôi
// tự soạn. Câu 1-5 là Note
// Completion có tiêu đề phụ (table.bullets + label mỗi hàng). Không có paragraphLabels. Chưa có Vocab set.
//
// LƯU Ý về "The Benefits of Being Bilingual": bài đọc + câu hỏi lấy từ ảnh được cung cấp. ĐÁP ÁN cả 14 câu đã đối
// chiếu khớp 100% answer key chính thức (bạn gửi ảnh); GIẢI THÍCH do tôi tự soạn. Câu 1-5 là bảng 2 cột có hàng tiêu đề (table.headers)
// và chỗ trống ở cột trái (row.labelLines); câu 6-10 type "ynng" (giải thích theo linear()); câu 11-14 type "match"
// (đoạn A-G). Chưa có Vocab set cho đề này.
//
// LƯU Ý về "Measures to combat infectious disease in tsarist Russia": bài đọc + câu hỏi lấy từ ảnh được cung cấp.
// ĐÁP ÁN cả 13 câu đã đối chiếu khớp 100% answer key chính thức; GIẢI THÍCH do tôi tự soạn, riêng câu 9-10 theo mẫu
// giải thích bạn cung cấp. Câu 7-8 và 9-10 type "multi" (Choose TWO letters). Chưa có Vocab set cho đề này.
//
// LƯU Ý về "What is exploration?": bài đọc + câu hỏi lấy từ ảnh được cung cấp. ĐÁP ÁN cả 14 câu đã đối chiếu với
// answer key chính thức — 13/14 khớp ngay, câu 14 sửa "land surface" → "surface" theo key (vẫn chấm đúng "land
// surface"). GIẢI THÍCH do tôi tự soạn. Không có paragraphLabels (câu hỏi gọi "second/fourth paragraph").
// Câu 1-6 mcq, 7-11 match (người A-E, dùng lại chữ cái được), 12-14 Summary Completion (table.summary).
//
// LƯU Ý về "Why companies should welcome disorder": bài đọc + câu hỏi lấy từ ảnh được cung cấp. ĐÁP ÁN cả 14 câu
// đã đối chiếu khớp 100% answer key chính thức; GIẢI THÍCH do tôi tự soạn. Câu 1-8 heading (section A-H, 9 heading → thừa 1), câu 9-11 điền
// từ, câu 12-14 T/F/NG (linear()). Chưa có Vocab set cho đề này.
//
// LƯU Ý về "Artificial Artists": bài đọc + câu hỏi lấy từ ảnh được cung cấp. ĐÁP ÁN cả 14 câu đã đối chiếu answer
// key chính thức — 13/14 khớp ngay, câu 5 sửa từ B thành A theo key. GIẢI THÍCH do tôi tự soạn. Ảnh đề ghi "David Moat" ở câu
// 11/13 là lỗi OCR của "David Moffat" (tên trong bài) — đã sửa. Chưa có Vocab set cho đề này.
//
// LƯU Ý về "Should we try to bring extinct species back to life?": bài đọc + câu hỏi lấy từ ảnh được cung cấp. ĐÁP ÁN
// cả 13 câu đã đối chiếu khớp 100% answer key chính thức; GIẢI THÍCH do tôi tự soạn. Câu 1-4 match đoạn A-F, câu 5-9 Summary Completion 3 đoạn
// (table.summary, mỗi hàng 1 đoạn), câu 10-13 match người A-C. Chưa có Vocab set cho đề này.
//
// LƯU Ý về "Gifted children and learning": bài đọc + câu hỏi lấy từ ảnh được cung cấp. ĐÁP ÁN cả 13 câu đã đối chiếu
// khớp 100% answer key chính thức; GIẢI THÍCH do tôi tự soạn. Câu 1-4 match đoạn A-F, câu 5-9 match người A-E, câu 10-13 điền từ (≤3 từ).
// Chưa có Vocab set cho đề này.
//
// LƯU Ý về "Oxytocin": bài đọc + câu hỏi lấy từ ảnh được cung cấp. ĐÁP ÁN cả 13 câu đã đối chiếu khớp 100% answer
// key chính thức; GIẢI THÍCH do tôi tự soạn. Câu 1-4 match đoạn A-F, 5-7 match nhà nghiên cứu A-F, 8-13 Summary Completion 2 đoạn. (File
// src/data/ielts/reading-lesson-5.html có dùng câu 8-13 làm ví dụ bài giảng — không phải đề luyện, không trùng.)
//
// LƯU Ý về "Saving bugs to find new drugs": bài đọc + câu hỏi lấy từ ảnh được cung cấp. ĐÁP ÁN cả 13 câu đã đối chiếu
// khớp 100% answer key chính thức; GIẢI THÍCH do tôi tự soạn. Câu 1-7 match đoạn A-I, câu 8-9 type "multi" (Choose
// TWO), câu 10-13 Summary Completion.
export const READING_TESTS: PracticeTest[] = [
  {
    id: 'reading-bringing-cinnamon-to-europe',
    skill: 'reading',
    title: 'Bringing Cinnamon To Europe',
    category: 'Practice test',
    part: 'Reading 5',
    durationMin: 20,
    difficulty: 'easy',
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
    difficulty: 'hard',
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
    difficulty: 'medium',
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
  {
    id: 'reading-the-search-for-extra-terrestrial-intelligence',
    skill: 'reading',
    title: 'The Search for Extra-terrestrial Intelligence',
    category: 'Practice test',
    part: 'Reading 8',
    durationMin: 20,
    difficulty: 'medium',
    passageTitle: 'The Search for Extra-terrestrial Intelligence',
    // Đoạn mở đầu không có nhãn (giống đề gốc) — chuỗi rỗng thì TestRunner không hiện nhãn.
    paragraphLabels: ['', 'A', 'B', 'C', 'D', 'E'],
    passage: [
      'The question of whether we are alone in the Universe has haunted humanity for centuries, but we may now stand poised on the brink of the answer to that question, as we search for radio signals from other intelligent civilisations. This search, often known by the acronym SETI (search for extra-terrestrial intelligence), is a difficult one. Although groups around the world have been searching intermittently for three decades, it is only now that we have reached the level of technology where we can make a determined attempt to search all nearby stars for any sign of life.',
      'The primary reason for the search is basic curiosity - the same curiosity about the natural world that drives all pure science. We want to know whether we are alone in the Universe. We want to know whether life evolves naturally if given the right conditions, or whether there is something very special about the Earth to have fostered the variety of life forms that we see around us on the planet. The simple detection of a radio signal will be sufficient to answer this most basic of all questions. In this sense, SETI is another cog in the machinery of pure science which is continually pushing out the horizon of our knowledge. However, there are other reasons for being interested in whether life exists elsewhere. For example, we have had civilisation on Earth for perhaps only a few thousand years, and the threats of nuclear war and pollution over the last few decades have told us that our survival may be tenuous. Will we last another two thousand years or will we wipe ourselves out? Since the lifetime of a planet like ours is several billion years, we can expect that, if other civilisations do survive in our galaxy, their ages will range from zero to several billion years. Thus any other civilisation that we hear from is likely to be far older, on average, than ourselves. The mere existence of such a civilisation will tell us that long-term survival is possible, and gives us some cause for optimism. It is even possible that the older civilisation may pass on the benefits of their experience in dealing with threats to survival such as nuclear war and global pollution, and other threats that we haven’t yet discovered.',
      'In discussing whether we are alone, most SETI scientists adopt two ground rules. First, UFOs (Unidentified Flying Objects) are generally ignored since most scientists don’t consider the evidence for them to be strong enough to bear serious consideration (although it is also important to keep an open mind in case any really convincing evidence emerges in the future). Second, we make a very conservative assumption that we are looking for a life form that is pretty well like us, since if it differs radically from us we may well not recognise it as a life form, quite apart from whether we are able to communicate with it. In other words, the life form we are looking for may well have two green heads and seven fingers, but it will nevertheless resemble us in that it should communicate with its fellows, be interested in the Universe, live on a planet orbiting a star like our Sun, and perhaps most restrictively, have a chemistry, like us, based on carbon and water.',
      'Even when we make these assumptions, our understanding of other life forms is still severely limited. We do not even know, for example, how many stars have planets, and we certainly do not know how likely it is that life will arise naturally, given the right conditions. However, when we look at the 100 billion stars in our galaxy (the Milky Way), and 100 billion galaxies in the observable Universe, it seems inconceivable that at least one of these planets does not have a life form on it; in fact, the best educated guess we can make, using the little that we do know about the conditions for carbon-based life, leads us to estimate that perhaps one in 100,000 stars might have a life-bearing planet orbiting it. That means that our nearest neighbours are perhaps 100 light years away, which is almost next door in astronomical terms.',
      'An alien civilisation could choose many different ways of sending information across the galaxy, but many of these either require too much energy, or else are severely attenuated while traversing the vast distances across the galaxy. It turns out that, for a given amount of transmitted power, radio waves in the frequency range 1000 to 3000 MHz travel the greatest distance, and so all searches to date have concentrated on looking for radio waves in this frequency range. So far there have been a number of searches by various groups around the world, including Australian searches using the radio telescope at Parkes, New South Wales. Until now there have not been any detections from the few hundred stars which have been searched. The scale of the searches has been increased dramatically since 1992, when the US Congress voted NASA $10 million per year for ten years to conduct a thorough search for extra-terrestrial life. Much of the money in this project is being spent on developing the special hardware needed to search many frequencies at once. The project has two parts. One part is a targeted search using the world’s largest radio telescopes, the American-operated telescope in Arecibo, Puerto Rico and the French telescope in Nancy in France. This part of the project is searching the nearest 1000 likely stars with high sensitivity for signals in the frequency range 1000 to 3000 MHz. The other part of the project is an undirected search which is monitoring all of space with a lower sensitivity, using the smaller antennas of NASA’s Deep Space Network.',
      'There is considerable debate over how we should react if we detect a signal from an alien civilisation. Everybody agrees that we should not reply immediately. Quite apart from the impracticality of sending a reply over such large distances at short notice, it raises a host of ethical questions that would have to be addressed by the global community before any reply could be sent. Would the human race face the culture shock if faced with a superior and much older civilisation? Luckily, there is no urgency about this. The stars being searched are hundreds of light years away, so it takes hundreds of years for their signal to reach us, and a further few hundred years for our reply to reach them. It’s not important, then, if there’s a delay of a few years, or decades, while the human race debates the question of whether to reply, and perhaps carefully drafts a reply.',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Choose the correct heading for paragraphs **B-E** from the list of headings below.',
        optionBank: [
          'Seeking the transmission of radio signals from planets',
          'Appropriate responses to signals from other civilisations',
          'Vast distances to Earth’s closest neighbours',
          'Assumptions underlying the search for extra-terrestrial intelligence',
          'Reasons for the search for extra-terrestrial intelligence',
          'Knowledge of extra-terrestrial life forms',
          'Likelihood of life on other planets',
        ],
        questions: [
          {
            id: 'q1',
            type: 'bank',
            prompt: 'Paragraph B',
            answer: 'Assumptions underlying the search for extra-terrestrial intelligence',
            explanation: SETI_EXPLAIN.q1,
            locate: [
              { para: 2, text: 'most SETI scientists adopt two ground rules' },
              { para: 2, text: 'we make a very conservative assumption that we are looking for a life form that is pretty well like us' },
            ],
          },
          {
            id: 'q2',
            type: 'bank',
            prompt: 'Paragraph C',
            answer: 'Likelihood of life on other planets',
            explanation: SETI_EXPLAIN.q2,
            locate: [
              { para: 3, text: 'it seems inconceivable that at least one of these planets does not have a life form on it' },
              { para: 3, text: 'perhaps one in 100,000 stars might have a life-bearing planet orbiting it' },
            ],
          },
          {
            id: 'q3',
            type: 'bank',
            prompt: 'Paragraph D',
            answer: 'Seeking the transmission of radio signals from planets',
            explanation: SETI_EXPLAIN.q3,
            locate: [{ para: 4, text: 'all searches to date have concentrated on looking for radio waves in this frequency range' }],
          },
          {
            id: 'q4',
            type: 'bank',
            prompt: 'Paragraph E',
            answer: 'Appropriate responses to signals from other civilisations',
            explanation: SETI_EXPLAIN.q4,
            locate: [{ para: 5, text: 'There is considerable debate over how we should react if we detect a signal from an alien civilisation' }],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Answer the questions below. Choose **NO MORE THAN THREE WORDS AND/OR A NUMBER** from the passage for each answer.',
        questions: [
          {
            id: 'q5',
            type: 'gap-fill',
            prompt: 'What is the life expectancy of Earth? ___',
            answer: 'several billion years',
            explanation: SETI_EXPLAIN.q5,
            locate: [{ para: 1, text: 'the lifetime of a planet like ours is several billion years' }],
          },
          {
            id: 'q6',
            type: 'gap-fill',
            prompt: 'What kind of signals from other intelligent civilisations are SETI scientists searching for? ___',
            // Answer key chính thức ghi "radio" — câu hỏi đã có sẵn "signals" nên chỉ cần điền LOẠI tín hiệu;
            // "radio signals" vẫn đúng nghĩa và trong giới hạn 3 từ nên vẫn chấm đúng.
            answer: 'radio',
            alt: ['radio signals'],
            explanation: SETI_EXPLAIN.q6,
            locate: [{ para: 0, text: 'we search for radio signals from other intelligent civilisations' }],
          },
          {
            id: 'q7',
            type: 'gap-fill',
            prompt: 'How many stars are the world’s most powerful radio telescopes searching? ___',
            answer: '1000',
            alt: ['1,000', '1000 stars', '1000 likely stars'],
            explanation: SETI_EXPLAIN.q7,
            locate: [
              { para: 4, text: 'One part is a targeted search using the world’s largest radio telescopes' },
              { para: 4, text: 'This part of the project is searching the nearest 1000 likely stars' },
            ],
          },
        ],
      },
      {
        id: 'g3',
        instruction: 'Choose **YES/NO/NOT GIVEN**',
        questions: [
          {
            id: 'q8',
            type: 'ynng',
            prompt: 'Alien civilisations may be able to help the human race to overcome serious problems.',
            answer: 'Yes',
            explanation: SETI_EXPLAIN.q8,
            locate: [{ para: 1, text: 'It is even possible that the older civilisation may pass on the benefits of their experience in dealing with threats to survival such as nuclear war and global pollution' }],
          },
          {
            id: 'q9',
            type: 'ynng',
            prompt: 'SETI scientists are trying to find a life form that resembles humans in many ways.',
            answer: 'Yes',
            explanation: SETI_EXPLAIN.q9,
            locate: [
              { para: 2, text: 'we are looking for a life form that is pretty well like us' },
              { para: 2, text: 'it will nevertheless resemble us' },
            ],
          },
          {
            id: 'q10',
            type: 'ynng',
            prompt: 'The Americans and Australians have co-operated on joint research projects.',
            answer: 'Not Given',
            explanation: SETI_EXPLAIN.q10,
            locate: [
              { para: 4, text: 'including Australian searches using the radio telescope at Parkes, New South Wales' },
              { para: 4, text: 'the American-operated telescope in Arecibo, Puerto Rico' },
            ],
          },
          {
            id: 'q11',
            type: 'ynng',
            prompt: 'So far SETI scientists have picked up radio signals from several stars.',
            answer: 'No',
            explanation: SETI_EXPLAIN.q11,
            locate: [{ para: 4, text: 'Until now there have not been any detections from the few hundred stars which have been searched' }],
          },
          {
            id: 'q12',
            type: 'ynng',
            prompt: 'The NASA project attracted criticism from some members of Congress.',
            answer: 'Not Given',
            explanation: SETI_EXPLAIN.q12,
            locate: [{ para: 4, text: 'the US Congress voted NASA $10 million per year for ten years to conduct a thorough search for extra-terrestrial life' }],
          },
          {
            id: 'q13',
            type: 'ynng',
            prompt: 'If a signal from outer space is received, it will be important to respond promptly.',
            answer: 'No',
            explanation: SETI_EXPLAIN.q13,
            locate: [
              { para: 5, text: 'Everybody agrees that we should not reply immediately' },
              { para: 5, text: 'Luckily, there is no urgency about this' },
            ],
          },
        ],
      },
    ],
    vocab: [],
  },
  {
    id: 'reading-nutmeg-a-valuable-spice',
    skill: 'reading',
    title: 'Nutmeg — a valuable spice',
    category: 'Practice test',
    part: 'Reading 9',
    durationMin: 20,
    difficulty: 'easy',
    passageTitle: 'Nutmeg — a valuable spice',
    passage: [
      'The nutmeg tree, Myristica fragrans, is a large evergreen tree native to Southeast Asia. Until the late 18th century, it only grew in one place in the world: a small group of islands in the Banda Sea, part of the Moluccas — or Spice Islands — in northeastern Indonesia. The tree is thickly branched with dense foliage of tough, dark green oval leaves, and produces small, yellow, bell-shaped flowers and pale yellow pear-shaped fruits. The fruit is encased in a fleshy husk. When the fruit is ripe, this husk splits into two halves along a ridge running the length of the fruit. Inside is a purple-brown shiny seed, 2-3 cm long by about 2 cm across, surrounded by a lacy red or crimson covering called an ‘aril’. These are the sources of the two spices nutmeg and mace, the former being produced from the dried seed and the latter from the aril.',
      'Nutmeg was a highly prized and costly ingredient in European cuisine in the Middle Ages, and was used as a flavouring, medicinal, and preservative agent. Throughout this period, the Arabs were the exclusive importers of the spice to Europe. They sold nutmeg for high prices to merchants based in Venice, but they never revealed the exact location of the source of this extremely valuable commodity. The Arab-Venetian dominance of the trade finally ended in 1512, when the Portuguese reached the Banda Islands and began exploiting its precious resources.',
      'Always in danger of competition from neighbouring Spain, the Portuguese began subcontracting their spice distribution to Dutch traders. Profits began to flow into the Netherlands, and the Dutch commercial fleet swiftly grew into one of the largest in the world. The Dutch quietly gained control of most of the shipping and trading of spices in Northern Europe. Then, in 1580, Portugal fell under Spanish rule, and by the end of the 16th century the Dutch found themselves locked out of the market. As prices for pepper, nutmeg, and other spices soared across Europe, they decided to fight back.',
      'In 1602, Dutch merchants founded the VOC, a trading corporation better known as the Dutch East India Company. By 1617, the VOC was the richest commercial operation in the world. The company had 50,000 employees worldwide, with a private army of 30,000 men and a fleet of 200 ships. At the same time, thousands of people across Europe were dying of the plague, a highly contagious and deadly disease. Doctors were desperate for a way to stop the spread of this disease, and they decided nutmeg held the cure. Everybody wanted nutmeg, and many were willing to spare no expense to have it. Nutmeg bought for a few pennies in Indonesia could be sold for 68,000 times its original cost on the streets of London. The only problem was the short supply. And that’s where the Dutch found their opportunity.',
      'The Banda Islands were ruled by local sultans who insisted on maintaining a neutral trading policy towards foreign powers. This allowed them to avoid the presence of Portuguese or Spanish troops on their soil, but it also left them unprotected from other invaders. In 1621, the Dutch arrived and took over. Once securely in control of the Bandas, the Dutch went to work protecting their new investment. They concentrated all nutmeg production into a few easily guarded areas, uprooting and destroying any trees outside the plantation zones. Anyone caught growing a nutmeg seedling or carrying seeds without the proper authority was severely punished. In addition, all exported nutmeg was covered with lime to make sure there was no chance a fertile seed which could be grown elsewhere would leave the islands. There was only one obstacle to Dutch domination. One of the Banda Islands, a sliver of land called Run, only 3 km long by less than 1 km wide, was under the control of the British. After decades of fighting for control of this tiny island, the Dutch and British arrived at a compromise settlement, the Treaty of Breda, in 1667. Intent on securing their hold over every nutmeg-producing island, the Dutch offered a trade: if the British would give them the island of Run, they would in turn give Britain a distant and much less valuable island in North America. The British agreed. That other island was Manhattan, which is how New Amsterdam became New York. The Dutch now had a monopoly over the nutmeg trade which would last for another century.',
      'Then, in 1770, a Frenchman named Pierre Poivre successfully smuggled nutmeg plants to safety in Mauritius, an island off the coast of Africa. Some of these were later exported to the Caribbean where they thrived, especially on the island of Grenada. Next, in 1778, a volcanic eruption in the Banda region caused a tsunami that wiped out half the nutmeg groves. Finally, in 1809, the British returned to Indonesia and seized the Banda Islands by force. They returned the islands to the Dutch in 1817, but not before transplanting hundreds of nutmeg seedlings to plantations in several locations across southern Asia. The Dutch nutmeg monopoly was over.',
      'Today, nutmeg is grown in Indonesia, the Caribbean, India, Malaysia, Papua New Guinea and Sri Lanka, and world nutmeg production is estimated to average between 10,000 and 12,000 tonnes per year.',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Choose **ONE WORD ONLY** from the passage for each answer.',
        // Note Completion: tiêu đề + gạch đầu dòng (bullets), dòng cuối là thông tin có sẵn, không phải câu hỏi.
        table: {
          title: 'The nutmeg tree and fruit',
          bullets: true,
          rows: [{ label: '', lines: [{ q: 'q1' }, { q: 'q2' }, { q: 'q3' }, { q: 'q4' }, 'The tree has yellow flowers and fruit'] }],
        },
        questions: [
          {
            id: 'q1',
            type: 'gap-fill',
            prompt: 'The leaves of the tree are ___ in shape',
            answer: 'oval',
            explanation: NUTMEG_EXPLAIN.q1,
            locate: [{ para: 0, text: 'dense foliage of tough, dark green oval leaves' }],
          },
          {
            id: 'q2',
            type: 'gap-fill',
            prompt: 'The ___ surrounds the fruit and breaks open when the fruit is ripe',
            answer: 'husk',
            explanation: NUTMEG_EXPLAIN.q2,
            locate: [
              { para: 0, text: 'The fruit is encased in a fleshy husk' },
              { para: 0, text: 'When the fruit is ripe, this husk splits into two halves' },
            ],
          },
          {
            id: 'q3',
            type: 'gap-fill',
            prompt: 'The ___ is used to produce the spice nutmeg',
            answer: 'seed',
            explanation: NUTMEG_EXPLAIN.q3,
            locate: [{ para: 0, text: 'the former being produced from the dried seed' }],
          },
          {
            id: 'q4',
            type: 'gap-fill',
            prompt: 'The covering known as the aril is used to produce ___',
            answer: 'mace',
            explanation: NUTMEG_EXPLAIN.q4,
            locate: [{ para: 0, text: 'the two spices nutmeg and mace, the former being produced from the dried seed and the latter from the aril' }],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Choose **TRUE/FALSE/NOT GIVEN**',
        questions: [
          {
            id: 'q5',
            type: 'tfng',
            prompt: 'In the Middle Ages, most Europeans knew where nutmeg was grown.',
            answer: 'False',
            explanation: NUTMEG_EXPLAIN.q5,
            locate: [
              { para: 1, text: 'the Arabs were the exclusive importers of the spice to Europe' },
              { para: 1, text: 'they never revealed the exact location of the source of this extremely valuable commodity' },
            ],
          },
          {
            id: 'q6',
            type: 'tfng',
            prompt: 'The VOC was the world’s first major trading company.',
            answer: 'Not Given',
            explanation: NUTMEG_EXPLAIN.q6,
            locate: [{ para: 3, text: 'By 1617, the VOC was the richest commercial operation in the world' }],
          },
          {
            id: 'q7',
            type: 'tfng',
            prompt: 'Following the Treaty of Breda, the Dutch had control of all the islands where nutmeg grew.',
            answer: 'True',
            explanation: NUTMEG_EXPLAIN.q7,
            locate: [
              { para: 4, text: 'Intent on securing their hold over every nutmeg-producing island' },
              { para: 4, text: 'The Dutch now had a monopoly over the nutmeg trade' },
            ],
          },
        ],
      },
      {
        id: 'g3',
        instruction: 'Choose **ONE WORD ONLY** from the passage for each answer.',
        table: {
          title: '',
          rows: [
            { label: 'Middle Ages', lines: [{ q: 'q8' }] },
            { label: '16th century', lines: ['European nations took control of the nutmeg trade'] },
            {
              label: '17th century',
              lines: [
                { q: 'q9' },
                'The Dutch',
                '– took control of the Banda Islands',
                '– restricted nutmeg production to a few areas',
                { q: 'q10' },
                { q: 'q11' },
              ],
            },
            { label: 'Late 18th century', lines: [{ q: 'q12' }, { q: 'q13' }] },
          ],
        },
        questions: [
          {
            id: 'q8',
            type: 'table',
            prompt: 'Nutmeg was brought to Europe by the ___',
            answer: 'Arabs',
            explanation: NUTMEG_EXPLAIN.q8,
            locate: [{ para: 1, text: 'the Arabs were the exclusive importers of the spice to Europe' }],
          },
          {
            id: 'q9',
            type: 'table',
            prompt: 'Demand for nutmeg grew, as it was believed to be effective against the disease known as the ___',
            answer: 'plague',
            explanation: NUTMEG_EXPLAIN.q9,
            locate: [
              { para: 3, text: 'thousands of people across Europe were dying of the plague, a highly contagious and deadly disease' },
              { para: 3, text: 'they decided nutmeg held the cure' },
            ],
          },
          {
            id: 'q10',
            type: 'table',
            prompt: '– put ___ on nutmeg to avoid it being cultivated outside the islands',
            answer: 'lime',
            explanation: NUTMEG_EXPLAIN.q10,
            locate: [{ para: 4, text: 'all exported nutmeg was covered with lime' }],
          },
          {
            id: 'q11',
            type: 'table',
            prompt: '– finally obtained the island of ___ from the British',
            answer: 'Run',
            explanation: NUTMEG_EXPLAIN.q11,
            locate: [
              { para: 4, text: 'a sliver of land called Run' },
              { para: 4, text: 'if the British would give them the island of Run' },
            ],
          },
          {
            id: 'q12',
            type: 'table',
            prompt: '1770 – nutmeg plants were secretly taken to ___',
            answer: 'Mauritius',
            explanation: NUTMEG_EXPLAIN.q12,
            locate: [{ para: 5, text: 'successfully smuggled nutmeg plants to safety in Mauritius' }],
          },
          {
            id: 'q13',
            type: 'table',
            prompt: '1778 – half the Banda Islands’ nutmeg plantations were destroyed by a ___',
            answer: 'tsunami',
            explanation: NUTMEG_EXPLAIN.q13,
            locate: [{ para: 5, text: 'caused a tsunami that wiped out half the nutmeg groves' }],
          },
        ],
      },
    ],
    vocab: [],
  },
  {
    id: 'reading-uk-companies-need-more-effective-boards-of-directors',
    skill: 'reading',
    title: 'UK Companies Need More Effective Boards of Directors',
    category: 'Practice test',
    part: 'Reading 10',
    durationMin: 20,
    difficulty: 'hard',
    passageTitle: 'UK Companies Need More Effective Boards of Directors',
    paragraphLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    passage: [
      'After a number of serious failures of governance (that is, how they are managed at the highest level), companies in Britain, as well as elsewhere, should consider radical changes to their directors’ roles. It is clear that the role of a board director today is not an easy one. Following the 2008 financial meltdown, which resulted in a deeper and more prolonged period of economic downturn than anyone expected, the search for explanations in the many post-mortems of the crisis has meant blame has been spread far and wide. Governments, regulators, central banks and auditors have all been in the frame. The role of bank directors and management and their widely publicised failures have been extensively picked over and examined in reports, inquiries and commentaries.',
      'The knock-on effect of this scrutiny has been to make the governance of companies in general an issue of intense public debate and has significantly increased the pressures on, and the responsibilities of, directors. At the simplest and most practical level, the time involved in fulfilling the demands of a board directorship has increased significantly, calling into question the effectiveness of the classic model of corporate governance by part-time, independent non-executive directors. Where once a board schedule may have consisted of between eight and ten meetings a year, in many companies the number of events requiring board input and decisions has dramatically risen. Furthermore, the amount of reading and preparation required for each meeting is increasing. Agendas can become overloaded and this can mean the time for constructive debate must necessarily be restricted in favour of getting through the business.',
      'Often, board business is devolved to committees in order to cope with the workload, which may be more efficient but can mean that the board as a whole is less involved in fully addressing some of the most important issues. It is not uncommon for the audit committee meeting to last longer than the main board meeting itself. Process may take the place of discussion and be at the expense of real collaboration, so that boxes are ticked rather than issues tackled.',
      'A radical solution, which may work for some very large companies whose businesses are extensive and complex, is the professional board, whose members would work up to three or four days a week, supported by their own dedicated staff and advisers. There are obvious risks to this and it would be important to establish clear guidelines for such a board to ensure that it did not step on the toes of management by becoming too engaged in the day-to-day running of the company. Problems of recruitment, remuneration and independence could also arise and this structure would not be appropriate for all companies. However, more professional and better-informed boards would have been particularly appropriate for banks where the executives had access to information that part-time non-executive directors lacked, leaving the latter unable to comprehend or anticipate the 2008 crash.',
      'One of the main criticisms of boards and their directors is that they do not focus sufficiently on longer-term matters of strategy, sustainability and governance, but instead concentrate too much on short-term financial metrics. Regulatory requirements and the structure of the market encourage this behaviour. The tyranny of quarterly reporting can distort board decision-making, as directors have to ‘make the numbers’ every four months to meet the insatiable appetite of the market for more data. This serves to encourage the trading methodology of a certain kind of investor who moves in and out of a stock without engaging in constructive dialogue with the company about strategy or performance, and is simply seeking a short-term financial gain. This effect has been made worse by the changing profile of investors due to the globalisation of capital and the increasing use of automated trading systems. Corporate culture adapts and management teams are largely incentivised to meet financial goals.',
      'Compensation for chief executives has become a combat zone where pitched battles between investors, management and board members are fought, often behind closed doors but increasingly frequently in the full glare of press attention. Many would argue that this is in the interest of transparency and good governance as shareholders use their muscle in the area of pay to pressure boards to remove underperforming chief executives. Their powers to vote down executive remuneration policies increased when binding votes came into force. The chair of the remuneration committee can be an exposed and lonely role, as Alison Carnwath, chair of Barclays Bank’s remuneration committee, found when she had to resign, having been roundly criticised for trying to defend the enormous bonus to be paid to the chief executive; the irony being that she was widely understood to have spoken out against it in the privacy of the committee.',
      'The financial crisis stimulated a debate about the role and purpose of the company and a heightened awareness of corporate ethics. Trust in the corporation has been eroded and academics such as Michael Sandel, in his thoughtful and bestselling book What Money Can’t Buy, are questioning the morality of capitalism and the market economy. Boards of companies in all sectors will need to widen their perspective to encompass these issues and this may involve a realignment of corporate goals. We live in challenging times.',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Choose the correct heading for each paragraph from the list of headings below. Write the correct number, **i-viii**.',
        optionBank: [
          'Disputes over financial arrangements regarding senior managers',
          'The impact on companies of being subjected to close examination',
          'The possible need for fundamental change in every area of business',
          'Many external bodies being held responsible for problems',
          'The falling number of board members with broad enough experience',
          'A risk that not all directors take part in solving major problems',
          'Boards not looking far enough ahead',
          'A proposal to change the way the board operates',
        ],
        questions: [
          {
            id: 'q1',
            type: 'bank',
            prompt: 'Paragraph A',
            answer: 'Many external bodies being held responsible for problems',
            explanation: BOARDS_EXPLAIN.q1,
            locate: [
              { para: 0, text: 'blame has been spread far and wide' },
              { para: 0, text: 'Governments, regulators, central banks and auditors have all been in the frame' },
            ],
          },
          {
            id: 'q2',
            type: 'bank',
            prompt: 'Paragraph B',
            answer: 'The impact on companies of being subjected to close examination',
            explanation: BOARDS_EXPLAIN.q2,
            locate: [{ para: 1, text: 'The knock-on effect of this scrutiny has been to make the governance of companies in general an issue of intense public debate' }],
          },
          {
            id: 'q3',
            type: 'bank',
            prompt: 'Paragraph C',
            answer: 'A risk that not all directors take part in solving major problems',
            explanation: BOARDS_EXPLAIN.q3,
            locate: [{ para: 2, text: 'can mean that the board as a whole is less involved in fully addressing some of the most important issues' }],
          },
          {
            id: 'q4',
            type: 'bank',
            prompt: 'Paragraph D',
            answer: 'A proposal to change the way the board operates',
            explanation: BOARDS_EXPLAIN.q4,
            locate: [{ para: 3, text: 'A radical solution, which may work for some very large companies whose businesses are extensive and complex, is the professional board' }],
          },
          {
            id: 'q5',
            type: 'bank',
            prompt: 'Paragraph E',
            answer: 'Boards not looking far enough ahead',
            explanation: BOARDS_EXPLAIN.q5,
            locate: [{ para: 4, text: 'they do not focus sufficiently on longer-term matters of strategy, sustainability and governance' }],
          },
          {
            id: 'q6',
            type: 'bank',
            prompt: 'Paragraph F',
            answer: 'Disputes over financial arrangements regarding senior managers',
            explanation: BOARDS_EXPLAIN.q6,
            locate: [{ para: 5, text: 'Compensation for chief executives has become a combat zone where pitched battles between investors, management and board members are fought' }],
          },
          {
            id: 'q7',
            type: 'bank',
            prompt: 'Paragraph G',
            answer: 'The possible need for fundamental change in every area of business',
            explanation: BOARDS_EXPLAIN.q7,
            locate: [{ para: 6, text: 'Boards of companies in all sectors will need to widen their perspective to encompass these issues and this may involve a realignment of corporate goals' }],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Choose **YES/NO/NOT GIVEN**',
        questions: [
          {
            id: 'q8',
            type: 'ynng',
            prompt: 'Close scrutiny of the behaviour of boards has increased since the economic downturn.',
            answer: 'Yes',
            explanation: BOARDS_EXPLAIN.q8,
            locate: [
              { para: 0, text: 'have been extensively picked over and examined in reports, inquiries and commentaries' },
              { para: 1, text: 'The knock-on effect of this scrutiny has been to make the governance of companies in general an issue of intense public debate' },
            ],
          },
          {
            id: 'q9',
            type: 'ynng',
            prompt: 'Banks have been mismanaged to a greater extent than other businesses.',
            answer: 'Not Given',
            explanation: BOARDS_EXPLAIN.q9,
            locate: [{ para: 0, text: 'The role of bank directors and management and their widely publicised failures' }],
          },
          {
            id: 'q10',
            type: 'ynng',
            prompt: 'Board meetings normally continue for as long as necessary to debate matters in full.',
            answer: 'No',
            explanation: BOARDS_EXPLAIN.q10,
            locate: [{ para: 1, text: 'Agendas can become overloaded and this can mean the time for constructive debate must necessarily be restricted in favour of getting through the business' }],
          },
          {
            id: 'q11',
            type: 'ynng',
            prompt: 'Using a committee structure would ensure that board members are fully informed about significant issues.',
            answer: 'No',
            explanation: BOARDS_EXPLAIN.q11,
            locate: [{ para: 2, text: 'which may be more efficient but can mean that the board as a whole is less involved in fully addressing some of the most important issues' }],
          },
        ],
      },
      {
        id: 'g3',
        instruction: 'Choose **ONE WORD ONLY** from the passage for each answer.',
        questions: [
          {
            id: 'q12',
            type: 'gap-fill',
            prompt: 'Before 2008, non-executive directors were at a disadvantage because of their lack of ___',
            answer: 'information',
            explanation: BOARDS_EXPLAIN.q12,
            locate: [{ para: 3, text: 'the executives had access to information that part-time non-executive directors lacked, leaving the latter unable to comprehend or anticipate the 2008 crash' }],
          },
          {
            id: 'q13',
            type: 'gap-fill',
            prompt: 'Boards tend to place too much emphasis on ___ considerations that are only of short-term relevance.',
            answer: 'financial',
            explanation: BOARDS_EXPLAIN.q13,
            locate: [{ para: 4, text: 'concentrate too much on short-term financial metrics' }],
          },
          {
            id: 'q14',
            type: 'gap-fill',
            prompt: 'On certain matters, such as pay, the board may have to accept the views of ___',
            answer: 'shareholders',
            explanation: BOARDS_EXPLAIN.q14,
            locate: [
              { para: 5, text: 'shareholders use their muscle in the area of pay to pressure boards' },
              { para: 5, text: 'Their powers to vote down executive remuneration policies increased when binding votes came into force' },
            ],
          },
        ],
      },
    ],
    vocab: [],
  },
  {
    id: 'reading-the-thylacine',
    skill: 'reading',
    title: 'The thylacine',
    category: 'Practice test',
    part: 'Reading 11',
    durationMin: 20,
    difficulty: 'easy',
    passageTitle: 'The thylacine',
    passage: [
      'The extinct thylacine, also known as the Tasmanian tiger, was a marsupial* that bore a superficial resemblance to a dog. Its most distinguishing feature was the 13-19 dark brown stripes over its back, beginning at the rear of the body and extending onto the tail. The thylacine’s average nose-to-tail length for adult males was 162.6 cm, compared to 153.7 cm for females.',
      'The thylacine appeared to occupy most types of terrain except dense rainforest, with open eucalyptus forest thought to be its prime habitat. In terms of feeding, it was exclusively carnivorous, and its stomach was muscular with an ability to distend so that it could eat large amounts of food at one time, probably an adaptation to compensate for long periods when hunting was unsuccessful and food scarce. The thylacine was not a fast runner and probably caught its prey by exhausting it during a long pursuit. During long-distance chases, thylacines were likely to have relied more on scent than any other sense. They emerged to hunt during the evening, night and early morning and tended to retreat to the hills and forest for shelter during the day. Despite the common name ‘tiger’, the thylacine had a shy, nervous temperament. Although mainly nocturnal, it was sighted moving during the day and some individuals were even recorded basking in the sun.',
      'The thylacine had an extended breeding season from winter to spring, with indications that some breeding took place throughout the year. The thylacine, like all marsupials, was tiny and hairless when born. Newborns crawled into the pouch on the belly of their mother, and attached themselves to one of the four teats, remaining there for up to three months. When old enough to leave the pouch, the young stayed in a lair such as a deep rocky cave, well-hidden nest or hollow log, whilst the mother hunted.',
      'Approximately 4,000 years ago, the thylacine was widespread throughout New Guinea and most of mainland Australia, as well as the island of Tasmania. The most recent, well-dated occurrence of a thylacine on the mainland is a carbon-dated fossil from Murray Cave in Western Australia, which is around 3,100 years old. Its extinction coincided closely with the arrival of wild dogs called dingoes in Australia and a similar predator in New Guinea. Dingoes never reached Tasmania, and most scientists see this as the main reason for the thylacine’s survival there.',
      'The dramatic decline of the thylacine in Tasmania, which began in the 1830s and continued for a century, is generally attributed to the relentless efforts of sheep farmers and bounty hunters** with shotguns. While this determined campaign undoubtedly played a large part, it is likely that various other factors also contributed to the decline and eventual extinction of the species. These include competition with wild dogs introduced by European settlers, loss of habitat along with the disappearance of prey species, and a distemper-like disease which may also have affected the thylacine.',
      'There was only one successful attempt to breed a thylacine in captivity, at Melbourne Zoo in 1899. This was despite the large numbers that went through some zoos, particularly London Zoo and Tasmania’s Hobart Zoo. The famous naturalist John Gould foresaw the thylacine’s demise when he published his Mammals of Australia between 1848 and 1863, writing, ‘The numbers of this singular animal will speedily diminish, extermination will have its full sway, and it will then, like the wolf of England and Scotland, be recorded as an animal of the past.’',
      'However, there seems to have been little public pressure to preserve the thylacine, nor was much concern expressed by scientists at the decline of this species in the decades that followed. A notable exception was T.T. Flynn, Professor of Biology at the University of Tasmania. In 1914, he was sufficiently concerned about the scarcity of the thylacine to suggest that some should be captured and placed on a small island. But it was not until 1929, with the species on the very edge of extinction, that Tasmania’s Animals and Birds Protection Board passed a motion protecting thylacines only for the month of December, which was thought to be their prime breeding season. The last known wild thylacine to be killed was shot by a farmer in the north-east of Tasmania in 1930, leaving just captive specimens. Official protection of the species by the Tasmanian government was introduced in July 1936, 59 days before the last known individual died in Hobart Zoo on 7th September, 1936.',
      'There have been numerous expeditions and searches for the thylacine over the years, none of which has produced definitive evidence that thylacines still exist. The species was declared extinct by the Tasmanian government in 1986.',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Complete the notes below. Write **ONE WORD ONLY** from the passage for each answer.',
        // Note Completion có tiêu đề phụ: label của mỗi hàng hiện làm tiêu đề phụ gạch chân (table.bullets).
        table: {
          title: 'The thylacine',
          bullets: true,
          rows: [
            {
              label: 'Appearance and behaviour',
              lines: ['looked rather like a dog', 'had a series of stripes along its body and tail', { q: 'q1' }, { q: 'q2' }, { q: 'q3' }],
            },
            {
              label: 'Decline and extinction',
              lines: [{ q: 'q4' }, 'probably went extinct in mainland Australia due to animals known as dingoes', { q: 'q5' }],
            },
          ],
        },
        questions: [
          {
            id: 'q1',
            type: 'gap-fill',
            prompt: 'ate an entirely ___ diet',
            answer: 'carnivorous',
            explanation: THYLACINE_EXPLAIN.q1,
            locate: [{ para: 1, text: 'In terms of feeding, it was exclusively carnivorous' }],
          },
          {
            id: 'q2',
            type: 'gap-fill',
            prompt: 'probably depended mainly on ___ when hunting',
            answer: 'scent',
            explanation: THYLACINE_EXPLAIN.q2,
            locate: [{ para: 1, text: 'During long-distance chases, thylacines were likely to have relied more on scent than any other sense' }],
          },
          {
            id: 'q3',
            type: 'gap-fill',
            prompt: 'young spent first months of life inside its mother’s ___',
            answer: 'pouch',
            explanation: THYLACINE_EXPLAIN.q3,
            locate: [{ para: 2, text: 'Newborns crawled into the pouch on the belly of their mother, and attached themselves to one of the four teats, remaining there for up to three months' }],
          },
          {
            id: 'q4',
            type: 'gap-fill',
            prompt: 'last evidence in mainland Australia is a 3,100-year-old ___',
            answer: 'fossil',
            explanation: THYLACINE_EXPLAIN.q4,
            locate: [{ para: 3, text: 'The most recent, well-dated occurrence of a thylacine on the mainland is a carbon-dated fossil from Murray Cave in Western Australia, which is around 3,100 years old' }],
          },
          {
            id: 'q5',
            type: 'gap-fill',
            prompt: 'reduction in ___ and available sources of food were partly responsible for decline in Tasmania',
            answer: 'habitat',
            explanation: THYLACINE_EXPLAIN.q5,
            locate: [
              { para: 4, text: 'it is likely that various other factors also contributed to the decline' },
              { para: 4, text: 'loss of habitat along with the disappearance of prey species' },
            ],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Choose **TRUE/FALSE/NOT GIVEN**',
        questions: [
          {
            id: 'q6',
            type: 'tfng',
            prompt: 'Significant numbers of thylacines were killed by humans from the 1830s onwards.',
            answer: 'True',
            explanation: THYLACINE_EXPLAIN.q6,
            locate: [{ para: 4, text: 'which began in the 1830s and continued for a century, is generally attributed to the relentless efforts of sheep farmers and bounty hunters** with shotguns' }],
          },
          {
            id: 'q7',
            type: 'tfng',
            prompt: 'Several thylacines were born in zoos during the late 1800s.',
            answer: 'False',
            explanation: THYLACINE_EXPLAIN.q7,
            locate: [{ para: 5, text: 'There was only one successful attempt to breed a thylacine in captivity, at Melbourne Zoo in 1899' }],
          },
          {
            id: 'q8',
            type: 'tfng',
            prompt: 'John Gould’s prediction about the thylacine surprised some biologists.',
            answer: 'Not Given',
            explanation: THYLACINE_EXPLAIN.q8,
            locate: [{ para: 5, text: 'The famous naturalist John Gould foresaw the thylacine’s demise' }],
          },
          {
            id: 'q9',
            type: 'tfng',
            prompt: 'In the early 1900s, many scientists became worried about the possible extinction of the thylacine.',
            answer: 'False',
            explanation: THYLACINE_EXPLAIN.q9,
            locate: [
              { para: 6, text: 'nor was much concern expressed by scientists at the decline of this species in the decades that followed' },
              { para: 6, text: 'A notable exception was T.T. Flynn' },
            ],
          },
          {
            id: 'q10',
            type: 'tfng',
            prompt: 'T. T. Flynn’s proposal to rehome captive thylacines on an island proved to be impractical.',
            answer: 'Not Given',
            explanation: THYLACINE_EXPLAIN.q10,
            locate: [{ para: 6, text: 'to suggest that some should be captured and placed on a small island' }],
          },
          {
            id: 'q11',
            type: 'tfng',
            prompt: 'There were still reasonable numbers of thylacines in existence when a piece of legislation protecting the species during their breeding season was passed.',
            answer: 'False',
            explanation: THYLACINE_EXPLAIN.q11,
            locate: [{ para: 6, text: 'with the species on the very edge of extinction, that Tasmania’s Animals and Birds Protection Board passed a motion protecting thylacines only for the month of December' }],
          },
          {
            id: 'q12',
            type: 'tfng',
            prompt: 'From 1930 to 1936, the only known living thylacines were all in captivity.',
            answer: 'True',
            explanation: THYLACINE_EXPLAIN.q12,
            locate: [
              { para: 6, text: 'The last known wild thylacine to be killed was shot by a farmer in the north-east of Tasmania in 1930, leaving just captive specimens' },
              { para: 6, text: 'the last known individual died in Hobart Zoo on 7th September, 1936' },
            ],
          },
          {
            id: 'q13',
            type: 'tfng',
            prompt: 'Attempts to find living thylacines are now rarely made.',
            answer: 'Not Given',
            explanation: THYLACINE_EXPLAIN.q13,
            locate: [{ para: 7, text: 'There have been numerous expeditions and searches for the thylacine over the years' }],
          },
        ],
      },
    ],
    vocab: [],
  },
  {
    id: 'reading-the-benefits-of-being-bilingual',
    skill: 'reading',
    title: 'The Benefits of Being Bilingual',
    category: 'Practice test',
    part: 'Reading 12',
    durationMin: 20,
    difficulty: 'medium',
    passageTitle: 'The Benefits of Being Bilingual',
    paragraphLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    passage: [
      'According to the latest figures, the majority of the world’s population is now bilingual or multilingual, having grown up speaking two or more languages. In the past, such children were considered to be at a disadvantage compared with their monolingual peers. Over the past few decades, however, technological advances have allowed researchers to look more deeply at how bilingualism interacts with and changes the cognitive and neurological systems, thereby identifying several clear benefits of being bilingual.',
      'Research shows that when a bilingual person uses one language, the other is active at the same time. When we hear a word, we don’t hear the entire word all at once: the sounds arrive in sequential order. Long before the word is finished, the brain’s language system begins to guess what that word might be. If you hear ‘can’, you will likely activate words like ‘candy’ and ‘candle’ as well, at least during the earlier stages of word recognition. For bilingual people, this activation is not limited to a single language; auditory input activates corresponding words regardless of the language to which they belong. Some of the most compelling evidence for this phenomenon, called ‘language co-activation’, comes from studying eye movements. A Russian-English bilingual asked to ‘pick up a marker’ from a set of objects would look more at a stamp than someone who doesn’t know Russian, because the Russian word for ‘stamp’, marka, sounds like the English word he or she heard, ‘marker’. In cases like this, language co-activation occurs because what the listener hears could map onto words in either language.',
      'Having to deal with this persistent linguistic competition can result in difficulties, however. For instance, knowing more than one language can cause speakers to name pictures more slowly, and can increase ‘tip-of-the-tongue states’, when you can almost, but not quite, bring a word to mind. As a result, the constant juggling of two languages creates a need to control how much a person accesses a language at any given time. For this reason, bilingual people often perform better on tasks that require conflict management. In the classic Stroop Task, people see a word and are asked to name the colour of the word’s font. When the colour and the word match (i.e., the word ‘red’ printed in red), people correctly name the colour more quickly than when the colour and the word don’t match (i.e., the word ‘red’ printed in blue). This occurs because the word itself (‘red’) and its font colour (blue) conflict. Bilingual people often excel at tasks such as this, which tap into the ability to ignore competing perceptual information and focus on the relevant aspects of the input. Bilinguals are also better at switching between two tasks; for example, when bilinguals have to switch from categorizing objects by colour (red or green) to categorizing them by shape (circle or triangle), they do so more quickly than monolingual people, reflecting better cognitive control when having to make rapid changes of strategy.',
      'It also seems that the neurological roots of the bilingual advantage extend to brain areas more traditionally associated with sensory processing. When monolingual and bilingual adolescents listen to simple speech sounds without any intervening background noise, they show highly similar brain stem responses. When researchers play the same sound to both groups in the presence of background noise, however, the bilingual listeners’ neural response is considerably larger, reflecting better encoding of the sound’s fundamental frequency, a feature of sound closely related to pitch perception.',
      'Such improvements in cognitive and sensory processing may help a bilingual person to process information in the environment, and help explain why bilingual adults acquire a third language better than monolingual adults master a second language. This advantage may be rooted in the skill of focussing on information about the new language while reducing interference from the languages they already know.',
      'Research also indicates that bilingual experience may help to keep the cognitive mechanisms sharp by recruiting alternate brain networks to compensate for those that become damaged during aging. Older bilinguals enjoy improved memory relative to monolingual people, which can lead to real-world health benefits. In a study of over 200 patients with Alzheimer’s disease, a degenerative brain disease, bilingual patients reported showing initial symptoms of the disease an average of five years later than monolingual patients. In a follow-up study, researchers compared the brains of bilingual and monolingual patients matched on the severity of Alzheimer’s symptoms. Surprisingly, the bilinguals’ brains had more physical signs of disease than their monolingual counterparts, even though their outward behaviour and abilities were the same. If the brain is an engine, bilingualism may help it to go farther on the same amount of fuel.',
      'Furthermore, the benefits associated with bilingual experience seem to start very early. In one study, researchers taught seven-month-old babies growing up in monolingual or bilingual homes that when they heard a tinkling sound, a puppet appeared on one side of a screen. Halfway through the study, the puppet began appearing on the opposite side of the screen. In order to get a reward, the infants had to adjust the rule they’d learned; only the bilingual babies were able to successfully learn the new rule. This suggests that for very young children, as well as for older people, navigating a multilingual environment imparts advantages that transfer far beyond language.',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Choose **NO MORE THAN TWO WORDS** from the passage for each answer.',
        // Bảng 2 cột có hàng tiêu đề (headers) và chỗ trống nằm ngay ở cột trái (labelLines) — câu 1, 3.
        table: {
          title: '',
          headers: ['TEST', 'FINDINGS'],
          rows: [
            { label: '', labelLines: [{ q: 'q1' }], lines: [{ q: 'q2' }] },
            { label: '', labelLines: [{ q: 'q3' }], lines: [{ q: 'q4' }] },
            { label: 'A test involving switching between tasks', lines: [{ q: 'q5' }] },
          ],
        },
        questions: [
          {
            id: 'q1',
            type: 'table',
            prompt: 'Observing the ___ of Russian-English bilingual people when asked to select certain objects',
            answer: 'eye movements',
            explanation: BILINGUAL_EXPLAIN.q1,
            locate: [
              { para: 1, text: 'comes from studying eye movements' },
              { para: 1, text: 'A Russian-English bilingual asked to ‘pick up a marker’ from a set of objects' },
            ],
          },
          {
            id: 'q2',
            type: 'table',
            prompt: 'Bilingual people engage both languages simultaneously: a mechanism known as ___',
            answer: 'language co-activation',
            alt: ['co-activation'],
            explanation: BILINGUAL_EXPLAIN.q2,
            locate: [
              { para: 1, text: 'when a bilingual person uses one language, the other is active at the same time' },
              { para: 1, text: 'this phenomenon, called ‘language co-activation’' },
            ],
          },
          {
            id: 'q3',
            type: 'table',
            prompt: 'A test called the ___, focusing on naming colours',
            answer: 'Stroop Task',
            explanation: BILINGUAL_EXPLAIN.q3,
            locate: [{ para: 2, text: 'In the classic Stroop Task, people see a word and are asked to name the colour of the word’s font' }],
          },
          {
            id: 'q4',
            type: 'table',
            prompt: 'Bilingual people are more able to handle tasks involving a skill called ___',
            answer: 'conflict management',
            explanation: BILINGUAL_EXPLAIN.q4,
            locate: [{ para: 2, text: 'bilingual people often perform better on tasks that require conflict management' }],
          },
          {
            id: 'q5',
            type: 'table',
            prompt: 'When changing strategies, bilingual people have superior ___',
            answer: 'cognitive control',
            explanation: BILINGUAL_EXPLAIN.q5,
            locate: [{ para: 2, text: 'reflecting better cognitive control when having to make rapid changes of strategy' }],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Choose **YES/NO/NOT GIVEN**',
        questions: [
          {
            id: 'q6',
            type: 'ynng',
            prompt: 'Attitudes towards bilingualism have changed in recent years.',
            answer: 'Yes',
            explanation: BILINGUAL_EXPLAIN.q6,
            locate: [
              { para: 0, text: 'In the past, such children were considered to be at a disadvantage compared with their monolingual peers' },
              { para: 0, text: 'thereby identifying several clear benefits of being bilingual' },
            ],
          },
          {
            id: 'q7',
            type: 'ynng',
            prompt: 'Bilingual people are better than monolingual people at guessing correctly what words are before they are finished.',
            answer: 'Not Given',
            explanation: BILINGUAL_EXPLAIN.q7,
            locate: [
              { para: 1, text: 'Long before the word is finished, the brain’s language system begins to guess what that word might be' },
              { para: 1, text: 'For bilingual people, this activation is not limited to a single language' },
            ],
          },
          {
            id: 'q8',
            type: 'ynng',
            prompt: 'Bilingual people consistently name images faster than monolingual people.',
            answer: 'No',
            explanation: BILINGUAL_EXPLAIN.q8,
            locate: [{ para: 2, text: 'knowing more than one language can cause speakers to name pictures more slowly' }],
          },
          {
            id: 'q9',
            type: 'ynng',
            prompt: 'Bilingual people’s brains process single sounds more efficiently than monolingual people in all situations.',
            answer: 'No',
            explanation: BILINGUAL_EXPLAIN.q9,
            locate: [
              { para: 3, text: 'without any intervening background noise, they show highly similar brain stem responses' },
              { para: 3, text: 'in the presence of background noise, however, the bilingual listeners’ neural response is considerably larger' },
            ],
          },
          {
            id: 'q10',
            type: 'ynng',
            prompt: 'Fewer bilingual people than monolingual people suffer from brain disease in old age.',
            answer: 'Not Given',
            explanation: BILINGUAL_EXPLAIN.q10,
            locate: [
              { para: 5, text: 'bilingual patients reported showing initial symptoms of the disease an average of five years later than monolingual patients' },
              { para: 5, text: 'the bilinguals’ brains had more physical signs of disease than their monolingual counterparts' },
            ],
          },
        ],
      },
      {
        id: 'g3',
        instruction: 'Which paragraph contains the following information? Write the correct letter, **A-G**.',
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
            id: 'q11',
            type: 'match',
            prompt: 'an example of how bilingual and monolingual people’s brains respond differently to a certain type of non-verbal auditory input',
            answer: 'D',
            explanation: BILINGUAL_EXPLAIN.q11,
            locate: [{ para: 3, text: 'in the presence of background noise, however, the bilingual listeners’ neural response is considerably larger' }],
          },
          {
            id: 'q12',
            type: 'match',
            prompt: 'a demonstration of how a bilingual upbringing has benefits even before we learn to speak',
            answer: 'G',
            explanation: BILINGUAL_EXPLAIN.q12,
            locate: [
              { para: 6, text: 'researchers taught seven-month-old babies growing up in monolingual or bilingual homes' },
              { para: 6, text: 'only the bilingual babies were able to successfully learn the new rule' },
            ],
          },
          {
            id: 'q13',
            type: 'match',
            prompt: 'a description of the process by which people identify words that they hear',
            answer: 'B',
            explanation: BILINGUAL_EXPLAIN.q13,
            locate: [
              { para: 1, text: 'When we hear a word, we don’t hear the entire word all at once: the sounds arrive in sequential order' },
              { para: 1, text: 'Long before the word is finished, the brain’s language system begins to guess what that word might be' },
            ],
          },
          {
            id: 'q14',
            type: 'match',
            prompt: 'reference to some negative consequences of being bilingual',
            answer: 'C',
            explanation: BILINGUAL_EXPLAIN.q14,
            locate: [
              { para: 2, text: 'Having to deal with this persistent linguistic competition can result in difficulties, however' },
              { para: 2, text: 'knowing more than one language can cause speakers to name pictures more slowly' },
            ],
          },
        ],
      },
    ],
    vocab: [],
  },
  {
    id: 'reading-measures-to-combat-infectious-disease-in-tsarist-russia',
    skill: 'reading',
    title: 'Measures to combat infectious disease in tsarist Russia',
    category: 'Practice test',
    part: 'Reading 13',
    durationMin: 20,
    difficulty: 'medium',
    passageTitle: 'Measures to combat infectious disease in tsarist Russia',
    // Section D và F gồm nhiều đoạn con — chỉ đoạn đầu mang nhãn. Đoạn G (kết) không có câu heading.
    paragraphLabels: ['A', 'B', 'C', 'D', '', 'E', 'F', '', '', 'G'],
    passage: [
      'In the second half of the seventeenth century, Russian authorities began implementing controls at the borders of their empire to prevent the importation of plague, a highly infectious and dangerous disease. Information on disease outbreak occurring abroad was regularly reported to the tsar’s court through various means, including commercial channels (travelling merchants), military personnel deployed abroad, undercover agents, the network of Imperial Foreign Office embassies and representations abroad, and the customs offices. For instance, the heads of customs offices were instructed to question foreigners entering Russia about possible epidemics of dangerous diseases in their respective countries.',
      'If news of an outbreak came from abroad, relations with the affected country were suspended. For instance, foreign vessels were not allowed to dock in Russian ports if there was credible information about the existence of epidemics in countries from whence they had departed. In addition, all foreigners entering Russia from those countries had to undergo quarantine. In 1665, after receiving news about a plague epidemic in England, Tsar Alexei wrote a letter to King Charles II in which he announced the cessation of Russian trade relations with England and other foreign states. These protective measures appeared to have been effective, as the country did not record any cases of plague during that year and in the next three decades. It was not until 1692 that another plague outbreak was recorded in the Russian province of Astrakhan. This epidemic continued for five months and killed 10,383 people, or about 65 percent of the city’s population. By the end of the seventeenth century, preventative measures had been widely introduced in Russia, including the isolation of persons ill with plague, the imposition of quarantines, and the distribution of explanatory public health notices about plague outbreaks.',
      'During the eighteenth century, although none of the occurrences was of the same scale as in the past, plague appeared in Russia several times. For instance, from 1703 to 1705, a plague outbreak that had ravaged Istanbul spread to the Podolsk and Kiev provinces in Russia, and then to Poland and Hungary. After defeating the Swedes in the battle of Poltava in 1709, Tsar Peter I (Peter the Great) dispatched part of his army to Poland, where plague had been raging for two years. Despite preventive measures, the disease spread among the Russian troops. In 1710, the plague reached Riga (then part of Sweden, now the capital of Latvia), where it was active until 1711 and claimed 60,000 lives. During this period, the Russians besieged Riga and, after the Swedes had surrendered the city in 1710, the Russian army lost 9,800 soldiers to the plague. Russian military chronicles of the time note that more soldiers died of the disease after the capture of Riga than from enemy fire during the siege of that city.',
      'Tsar Peter I imposed strict measures to prevent the spread of plague during these conflicts. Soldiers suspected of being infected were isolated and taken to areas far from military camps. In addition, camps were designed to separate divisions, detachments, and smaller units of soldiers. When plague reached Narva (located in present-day Estonia) and threatened to spread to St. Petersburg, the newly built capital of Russia, Tsar Peter I ordered the army to cordon off the entire boundary along the Luga River, including temporarily halting all activity on the river.',
      'In order to prevent the movement of people and goods from Narva to St Petersburg and Novgorod, roadblocks and checkpoints were set up on all roads. The tsar’s orders were rigorously enforced, and those who disobeyed were hung.',
      'However, although the Russian authorities applied such methods to contain the spread of the disease and limit the number of victims, all of the measures had a provisional character: they were intended to respond to a specific outbreak, and were not designed as a coherent set of measures to be implemented systematically at the first sign of plague. The advent of such a standard response system came a few years later.',
      'The first attempts to organise procedures and carry out proactive steps to control plague date to the aftermath of the 1727-1728 epidemic in Astrakhan. In response to this, the Russian imperial authorities issued several decrees aimed at controlling the future spread of plague. Among these decrees, the ‘Instructions for Governors and Heads of Townships’ required that all governors immediately inform the Senate - a government body created by Tsar Peter I in 1711 to advise the monarch - if plague cases were detected in their respective provinces.',
      'Furthermore, the decree required that governors ensure the physical examination of all persons suspected of carrying the disease and their subsequent isolation. In addition, it was ordered that sites where plague victims were found had to be encircled by checkpoints and isolated for the duration of the outbreak. These checkpoints were to remain operational for at least six weeks.',
      'The houses of infected persons were to be burned along with all of the personal property they contained, including farm animals and cattle. The governors were instructed to inform the neighbouring provinces and cities about every plague case occurring on their territories. Finally, letters brought by couriers were heated above a fire before being copied.',
      'The implementation by the authorities of these combined measures demonstrates their intuitive understanding of the importance of the timely isolation of infected people to limit the spread of plague.',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Choose the correct heading for sections **A-F** from the list of headings below. Write the correct number, **i-viii**.',
        optionBank: [
          'Outbreaks of plague as a result of military campaigns.',
          'Systematic intelligence-gathering about external cases of plague.',
          'Early forms of treatment for plague victims.',
          'The general limitations of early Russian anti-plague measures.',
          'Partly successful bans against foreign states affected by plague.',
          'Hostile reactions from foreign states to Russian anti-plague measures.',
          'Various measures to limit outbreaks of plague associated with war.',
          'The formulation and publication of preventive strategies.',
        ],
        questions: [
          {
            id: 'q1',
            type: 'bank',
            prompt: 'Section A',
            answer: 'Systematic intelligence-gathering about external cases of plague.',
            explanation: PLAGUE_EXPLAIN.q1,
            locate: [{ para: 0, text: 'Information on disease outbreak occurring abroad was regularly reported to the tsar’s court through various means' }],
          },
          {
            id: 'q2',
            type: 'bank',
            prompt: 'Section B',
            answer: 'Partly successful bans against foreign states affected by plague.',
            explanation: PLAGUE_EXPLAIN.q2,
            locate: [
              { para: 1, text: 'relations with the affected country were suspended' },
              { para: 1, text: 'These protective measures appeared to have been effective' },
              { para: 1, text: 'It was not until 1692 that another plague outbreak was recorded' },
            ],
          },
          {
            id: 'q3',
            type: 'bank',
            prompt: 'Section C',
            answer: 'Outbreaks of plague as a result of military campaigns.',
            explanation: PLAGUE_EXPLAIN.q3,
            locate: [
              { para: 2, text: 'Despite preventive measures, the disease spread among the Russian troops' },
              { para: 2, text: 'the Russian army lost 9,800 soldiers to the plague' },
            ],
          },
          {
            id: 'q4',
            type: 'bank',
            prompt: 'Section D',
            answer: 'Various measures to limit outbreaks of plague associated with war.',
            explanation: PLAGUE_EXPLAIN.q4,
            locate: [{ para: 3, text: 'Tsar Peter I imposed strict measures to prevent the spread of plague during these conflicts' }],
          },
          {
            id: 'q5',
            type: 'bank',
            prompt: 'Section E',
            answer: 'The general limitations of early Russian anti-plague measures.',
            explanation: PLAGUE_EXPLAIN.q5,
            locate: [{ para: 5, text: 'all of the measures had a provisional character' }],
          },
          {
            id: 'q6',
            type: 'bank',
            prompt: 'Section F',
            answer: 'The formulation and publication of preventive strategies.',
            explanation: PLAGUE_EXPLAIN.q6,
            locate: [
              { para: 6, text: 'The first attempts to organise procedures and carry out proactive steps to control plague' },
              { para: 6, text: 'the Russian imperial authorities issued several decrees aimed at controlling the future spread of plague' },
            ],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Choose **TWO** letters, **A-E**.',
        // "Choose TWO": 2 câu cùng prompt + options; mỗi câu nhận cả 2 đáp án đúng (answer + alt) → chấm theo tập hợp.
        questions: [
          {
            id: 'q7',
            type: 'multi',
            prompt: 'Which TWO measures did Russia take in the seventeenth century to avoid plague outbreaks?',
            options: [
              'Cooperation with foreign leaders',
              'Spying',
              'Military campaigns',
              'Restrictions on access to its ports',
              'Expulsion of foreigners',
            ],
            answer: 'Spying',
            alt: ['Restrictions on access to its ports'],
            explanation: PLAGUE_EXPLAIN.q7,
            locate: [
              { para: 0, text: 'undercover agents' },
              { para: 1, text: 'foreign vessels were not allowed to dock in Russian ports' },
            ],
          },
          {
            id: 'q8',
            type: 'multi',
            prompt: 'Which TWO measures did Russia take in the seventeenth century to avoid plague outbreaks?',
            options: [
              'Cooperation with foreign leaders',
              'Spying',
              'Military campaigns',
              'Restrictions on access to its ports',
              'Expulsion of foreigners',
            ],
            answer: 'Restrictions on access to its ports',
            alt: ['Spying'],
            explanation: PLAGUE_EXPLAIN.q8,
            locate: [
              { para: 0, text: 'undercover agents' },
              { para: 1, text: 'foreign vessels were not allowed to dock in Russian ports' },
            ],
          },
        ],
      },
      {
        id: 'g3',
        instruction: 'Choose **TWO** letters, **A-E**.',
        questions: [
          {
            id: 'q9',
            type: 'multi',
            prompt: 'Which TWO statements are made about Russia in the early eighteenth century?',
            options: [
              'Plague outbreaks were consistently smaller than before.',
              'Military casualties at Riga exceeded the number of plague victims.',
              'The design of military camps allowed plague to spread quickly.',
              'The tsar’s plan to protect St Petersburg from plague was not strictly implemented.',
              'Anti-plague measures were generally reactive rather than strategic.',
            ],
            answer: 'Plague outbreaks were consistently smaller than before.',
            alt: ['Anti-plague measures were generally reactive rather than strategic.'],
            explanation: PLAGUE_EXPLAIN.q9,
            locate: [{ para: 2, text: 'although none of the occurrences was of the same scale as in the past' }],
          },
          {
            id: 'q10',
            type: 'multi',
            prompt: 'Which TWO statements are made about Russia in the early eighteenth century?',
            options: [
              'Plague outbreaks were consistently smaller than before.',
              'Military casualties at Riga exceeded the number of plague victims.',
              'The design of military camps allowed plague to spread quickly.',
              'The tsar’s plan to protect St Petersburg from plague was not strictly implemented.',
              'Anti-plague measures were generally reactive rather than strategic.',
            ],
            answer: 'Anti-plague measures were generally reactive rather than strategic.',
            alt: ['Plague outbreaks were consistently smaller than before.'],
            explanation: PLAGUE_EXPLAIN.q10,
            locate: [{ para: 5, text: 'all of the measures had a provisional character: they were intended to respond to a specific outbreak, and were not designed as a coherent set of measures to be implemented systematically at the first sign of plague' }],
          },
        ],
      },
      {
        id: 'g4',
        instruction: 'Choose **ONE WORD ONLY** from the passage for each answer.',
        questions: [
          {
            id: 'q11',
            type: 'gap-fill',
            prompt: 'An outbreak of plague in ___ prompted the publication of a coherent preventative strategy.',
            answer: 'Astrakhan',
            explanation: PLAGUE_EXPLAIN.q11,
            locate: [{ para: 6, text: 'date to the aftermath of the 1727-1728 epidemic in Astrakhan' }],
          },
          {
            id: 'q12',
            type: 'gap-fill',
            prompt: 'Provincial governors were ordered to burn the ___ and possessions of plague victims.',
            answer: 'houses',
            explanation: PLAGUE_EXPLAIN.q12,
            locate: [{ para: 8, text: 'The houses of infected persons were to be burned along with all of the personal property they contained' }],
          },
          {
            id: 'q13',
            type: 'gap-fill',
            prompt: 'Correspondence was held over a ___ prior to copying it.',
            answer: 'fire',
            explanation: PLAGUE_EXPLAIN.q13,
            locate: [{ para: 8, text: 'letters brought by couriers were heated above a fire before being copied' }],
          },
        ],
      },
    ],
    vocab: [],
  },
  {
    id: 'reading-what-is-exploration',
    skill: 'reading',
    title: 'What is exploration?',
    category: 'Practice test',
    part: 'Reading 14',
    durationMin: 20,
    difficulty: 'hard',
    passageTitle: 'What is exploration?',
    passage: [
      'We are all explorers. Our desire to discover, and then share that new-found knowledge, is part of what makes us human — indeed, this has played an important part in our success as a species. Long before the first caveman slumped down beside the fire and grunted news that there were plenty of wildebeest over yonder, our ancestors had learnt the value of sending out scouts to investigate the unknown. This questing nature of ours undoubtedly helped our species spread around the globe, just as it nowadays no doubt helps the last nomadic Penan maintain their existence in the depleted forests of Borneo, and a visitor negotiate the subways of New York.',
      'Over the years, we’ve come to think of explorers as a peculiar breed — different from the rest of us, different from those of us who are merely ‘well travelled’, even; and perhaps there is a type of person more suited to seeking out the new, a type of caveman more inclined to risk venturing out. That, however, doesn’t take away from the fact that we all have this enquiring instinct, even today; and that in all sorts of professions — whether artist, marine biologist or astronomer — borders of the unknown are being tested each day.',
      'Thomas Hardy set some of his novels in Egdon Heath, a fictional area of uncultivated land, and used the landscape to suggest the desires and fears of his characters. He is delving into matters we all recognise because they are common to humanity. This is surely an act of exploration, and into a world as remote as the author chooses. Explorer and travel writer Peter Fleming talks of the moment when the explorer returns to the existence he has left behind with his loved ones. The traveller ‘who has for weeks or months seen himself only as a puny and irrelevant alien crawling laboriously over a country in which he has no roots and no background, suddenly encounters his other self, a relatively solid figure, with a place in the minds of certain people’.',
      'In this book about the exploration of the earth’s surface, I have confined myself to those whose travels were real and who also aimed at more than personal discovery. But that still left me with another problem: the word ‘explorer’ has become associated with a past era. We think back to a golden age, as if exploration peaked somehow in the 19th century — as if the process of discovery is now on the decline, though the truth is that we have named only one and a half million of this planet’s species, and there may be more than 10 million — and that’s not including bacteria. We have studied only 5 per cent of the species we know. We have scarcely mapped the ocean floors, and know even less about ourselves; we fully understand the workings of only 10 per cent of our brains.',
      'Here is how some of today’s ‘explorers’ define the word. Ran Fiennes, dubbed the ‘greatest living explorer’, said, ‘An explorer is someone who has done something that no human has done before — and also done something scientifically useful.’ Chris Bonington, a leading mountaineer, felt exploration was to be found in the act of physically touching the unknown: ‘You have to have gone somewhere new.’ Then Robin Hanbury-Tenison, a campaigner on behalf of remote so-called ‘tribal’ peoples, said, ‘A traveller simply records information about some far-off world, and reports back; but an explorer changes the world.’ Wilfred Thesiger, who crossed Arabia’s Empty Quarter in 1946, and belongs to an era of unmechanised travel now lost to the rest of us, told me, ‘If I’d gone across by camel when I could have gone by car, it would have been a stunt.’ To him, exploration meant bringing back information from a remote place regardless of any great self-discovery.',
      'Each definition is slightly different — and tends to reflect the field of endeavour of each pioneer. It was the same whoever I asked: the prominent historian would say exploration was a thing of the past, the cutting-edge scientist would say it was of the present. And so on. They each set their own particular criteria; the common factor in their approach being that they all had, unlike many of us who simply enjoy travel or discovering new things, both a very definite objective from the outset and also a desire to record their findings.',
      'I’d best declare my own bias. As a writer, I’m interested in the exploration of ideas. I’ve done a great many expeditions and each one was unique. I’ve lived for months alone with isolated groups of people all around the world, even two ‘uncontacted tribes’. But none of these things is of the slightest interest to anyone unless, through my books, I’ve found a new slant, explored a new idea. Why? Because the world has moved on. The time has long passed for the great continental voyages — another walk to the poles, another crossing of the Empty Quarter. We know how the land surface of our planet lies; exploration of it is now down to the details — the habits of microbes, say, or the grazing behaviour of buffalo. Aside from the deep sea and deep underground, it’s the era of specialists. However, this is to disregard the role the human mind has in conveying remote places; and this is what interests me: how a fresh interpretation, even of a well-travelled route, can give its readers new insights.',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Choose appropriate options **A, B, C** or **D**.',
        questions: [
          {
            id: 'q1',
            type: 'mcq',
            prompt: 'The writer refers to visitors to New York to illustrate the point that',
            options: [
              'exploration is an intrinsic element of being human.',
              'most people are enthusiastic about exploring.',
              'exploration can lead to surprising results.',
              'most people find exploration daunting.',
            ],
            answer: 'exploration is an intrinsic element of being human.',
            explanation: EXPLORATION_EXPLAIN.q1,
            locate: [
              { para: 0, text: 'is part of what makes us human' },
              { para: 0, text: 'This questing nature of ours undoubtedly helped our species spread around the globe' },
            ],
          },
          {
            id: 'q2',
            type: 'mcq',
            prompt: 'According to the second paragraph, what is the writer’s view of explorers?',
            options: [
              'Their discoveries have brought both benefits and disadvantages.',
              'Their main value is in teaching others.',
              'They act on an urge that is common to everyone.',
              'They tend to be more attracted to certain professions than to others.',
            ],
            answer: 'They act on an urge that is common to everyone.',
            explanation: EXPLORATION_EXPLAIN.q2,
            locate: [{ para: 1, text: 'That, however, doesn’t take away from the fact that we all have this enquiring instinct, even today' }],
          },
          {
            id: 'q3',
            type: 'mcq',
            prompt: 'The writer refers to a description of Egdon Heath to suggest that',
            options: [
              'Hardy was writing about his own experience of exploration.',
              'Hardy was mistaken about the nature of exploration.',
              'Hardy’s aim was to investigate people’s emotional states.',
              'Hardy’s aim was to show the attraction of isolation.',
            ],
            answer: 'Hardy’s aim was to investigate people’s emotional states.',
            explanation: EXPLORATION_EXPLAIN.q3,
            locate: [
              { para: 2, text: 'used the landscape to suggest the desires and fears of his characters' },
              { para: 2, text: 'He is delving into matters we all recognise because they are common to humanity' },
            ],
          },
          {
            id: 'q4',
            type: 'mcq',
            prompt: 'In the fourth paragraph, the writer refers to ‘a golden age’ to suggest that',
            options: [
              'the amount of useful information produced by exploration has decreased.',
              'fewer people are interested in exploring than in the 19th century.',
              'recent developments have made exploration less exciting.',
              'we are wrong to think that exploration is no longer necessary.',
            ],
            answer: 'we are wrong to think that exploration is no longer necessary.',
            explanation: EXPLORATION_EXPLAIN.q4,
            locate: [
              { para: 3, text: 'We think back to a golden age, as if exploration peaked somehow in the 19th century' },
              { para: 3, text: 'though the truth is that we have named only one and a half million of this planet’s species' },
            ],
          },
          {
            id: 'q5',
            type: 'mcq',
            prompt: 'In the sixth paragraph, when discussing the definition of exploration, the writer argues that',
            options: [
              'people tend to relate exploration to their own professional interests.',
              'certain people are likely to misunderstand the nature of exploration.',
              'the generally accepted definition has changed over time.',
              'historians and scientists have more valid definitions than the general public.',
            ],
            answer: 'people tend to relate exploration to their own professional interests.',
            explanation: EXPLORATION_EXPLAIN.q5,
            locate: [{ para: 5, text: 'Each definition is slightly different — and tends to reflect the field of endeavour of each pioneer' }],
          },
          {
            id: 'q6',
            type: 'mcq',
            prompt: 'In the last paragraph, the writer explains that he is interested in',
            options: [
              'how someone’s personality is reflected in their choice of places to visit.',
              'the human ability to cast new light on places that may be familiar.',
              'how travel writing has evolved to meet changing demands.',
              'the feelings that writers develop about the places that they explore.',
            ],
            answer: 'the human ability to cast new light on places that may be familiar.',
            explanation: EXPLORATION_EXPLAIN.q6,
            locate: [{ para: 6, text: 'how a fresh interpretation, even of a well-travelled route, can give its readers new insights' }],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Write the correct letter, **A-E**. **NB** You may use any letter more than once.',
        matchLegend: [
          { key: 'A', label: 'Peter Fleming' },
          { key: 'B', label: 'Ran Fiennes' },
          { key: 'C', label: 'Chris Bonington' },
          { key: 'D', label: 'Robin Hanbury-Tenison' },
          { key: 'E', label: 'Wilfred Thesiger' },
        ],
        questions: [
          {
            id: 'q7',
            type: 'match',
            prompt: 'He referred to the relevance of the form of transport used.',
            answer: 'E',
            explanation: EXPLORATION_EXPLAIN.q7,
            locate: [{ para: 4, text: 'If I’d gone across by camel when I could have gone by car, it would have been a stunt' }],
          },
          {
            id: 'q8',
            type: 'match',
            prompt: 'He described feelings on coming back home after a long journey.',
            answer: 'A',
            explanation: EXPLORATION_EXPLAIN.q8,
            locate: [{ para: 2, text: 'Peter Fleming talks of the moment when the explorer returns to the existence he has left behind with his loved ones' }],
          },
          {
            id: 'q9',
            type: 'match',
            prompt: 'He worked for the benefit of specific groups of people.',
            answer: 'D',
            explanation: EXPLORATION_EXPLAIN.q9,
            locate: [{ para: 4, text: 'Robin Hanbury-Tenison, a campaigner on behalf of remote so-called ‘tribal’ peoples' }],
          },
          {
            id: 'q10',
            type: 'match',
            prompt: 'He did not consider learning about oneself an essential part of the exploration.',
            answer: 'E',
            explanation: EXPLORATION_EXPLAIN.q10,
            locate: [{ para: 4, text: 'exploration meant bringing back information from a remote place regardless of any great self-discovery' }],
          },
          {
            id: 'q11',
            type: 'match',
            prompt: 'He defined exploration as being both unique and of value to others.',
            answer: 'B',
            explanation: EXPLORATION_EXPLAIN.q11,
            locate: [{ para: 4, text: 'An explorer is someone who has done something that no human has done before — and also done something scientifically useful' }],
          },
        ],
      },
      {
        id: 'g3',
        instruction: 'Choose **NO MORE THAN TWO WORDS** from the passage for each answer.',
        // Summary Completion: 3 câu là 3 khúc của 1 đoạn văn liền mạch (table.summary).
        table: {
          title: 'The writer’s own bias',
          summary: true,
          rows: [{ label: '', lines: [{ q: 'q12' }, { q: 'q13' }, { q: 'q14' }] }],
        },
        questions: [
          {
            id: 'q12',
            type: 'gap-fill',
            prompt: 'The writer has experience of a large number of ___,',
            answer: 'expeditions',
            explanation: EXPLORATION_EXPLAIN.q12,
            locate: [{ para: 6, text: 'I’ve done a great many expeditions' }],
          },
          {
            id: 'q13',
            type: 'gap-fill',
            prompt: 'and was the first stranger that certain previously ___ people had encountered.',
            answer: 'uncontacted',
            explanation: EXPLORATION_EXPLAIN.q13,
            locate: [{ para: 6, text: 'even two ‘uncontacted tribes’' }],
          },
          {
            id: 'q14',
            type: 'gap-fill',
            prompt: 'He believes there is no need for further exploration of Earth’s ___, except to answer specific questions such as how buffalo eat.',
            // Answer key chính thức ghi "surface"; "land surface" vẫn trong giới hạn 2 từ và đúng nghĩa nên vẫn chấm đúng.
            answer: 'surface',
            alt: ['land surface'],
            explanation: EXPLORATION_EXPLAIN.q14,
            locate: [
              { para: 6, text: 'We know how the land surface of our planet lies' },
              { para: 6, text: 'the grazing behaviour of buffalo' },
            ],
          },
        ],
      },
    ],
    vocab: [],
  },
  {
    id: 'reading-why-companies-should-welcome-disorder',
    skill: 'reading',
    title: 'Why companies should welcome disorder',
    category: 'Practice test',
    part: 'Reading 15',
    durationMin: 20,
    difficulty: 'medium',
    passageTitle: 'Why companies should welcome disorder',
    // Section A, B, G gồm nhiều đoạn con — chỉ đoạn đầu mang nhãn.
    paragraphLabels: ['A', '', 'B', '', 'C', 'D', 'E', 'F', 'G', '', '', 'H'],
    passage: [
      'Organisation is big business. Whether it is of our lives - all those inboxes and calendars - or how companies are structured, a multi-billion dollar industry helps to meet this need. We have more strategies for time management, project management and self-organisation than at any other time in human history. We are told that we ought to organise our company, our home life, our week, our day and even our sleep, all as a means to becoming more productive. Every week, countless seminars and workshops take place around the world to tell a paying public that they ought to structure their lives in order to achieve this.',
      'This rhetoric has also crept into the thinking of business leaders and entrepreneurs, much to the delight of self-proclaimed perfectionists with the need to get everything right. The number of business schools and graduates has massively increased over the past 50 years, essentially teaching people how to organise well.',
      'Ironically, however, the number of businesses that fail has also steadily increased. Work-related stress has increased. A large proportion of workers from all demographics claim to be dissatisfied with the way their work is structured and the way they are managed.',
      'This begs the question: what has gone wrong? Why is it that on paper the drive for organisation seems a sure shot for increasing productivity, but in reality falls well short of what is expected?',
      'This has been a problem for a while now. Frederick Taylor was one of the forefathers of scientific management. Writing in the first half of the 20th century, he designed a number of principles to improve the efficiency of the work process, which have since become widespread in modern companies. So the approach has been around for a while.',
      'New research suggests that this obsession with efficiency is misguided. The problem is not necessarily the management theories or strategies we use to organise our work; it’s the basic assumptions we hold in approaching how we work. Here it’s the assumption that order is a necessary condition for productivity. This assumption has also fostered the idea that disorder must be detrimental to organisational productivity. The result is that businesses and people spend time and money organising themselves for the sake of organising, rather than actually looking at the end goal and usefulness of such an effort.',
      'What’s more, recent studies show that order actually has diminishing returns. Order does increase productivity to a certain extent, but eventually the usefulness of the process of organisation, and the benefit it yields, reduce until the point where any further increase in order reduces productivity. Some argue that in a business, if the cost of formally structuring something outweighs the benefit of doing it, then that thing ought not to be formally structured. Instead, the resources involved can be better used elsewhere.',
      'In fact, research shows that, when innovating, the best approach is to create an environment devoid of structure and hierarchy and enable everyone involved to engage as one organic group. These environments can lead to new solutions that, under conventionally structured environments (filled with bottlenecks in terms of information flow, power structures, rules, and routines) would never be reached.',
      'In recent times companies have slowly started to embrace this disorganisation. Many of them embrace it in terms of perception (embracing the idea of disorder, as opposed to fearing it) and in terms of process (putting mechanisms in place to reduce structure).',
      'For example, Oticon, a large Danish manufacturer of hearing aids, used what it called a ‘spaghetti’ structure in order to reduce the organisation’s rigid hierarchies. This involved scrapping formal job titles and giving staff huge amounts of ownership over their own time and projects. This approach proved to be highly successful initially, with clear improvements in worker productivity in all facets of the business.',
      'In similar fashion, the former chairman of General Electric embraced disorganisation, putting forward the idea of the ‘boundaryless’ organisation. Again, it involves breaking down the barriers between different parts of a company and encouraging virtual collaboration and flexible working. Google and a number of other tech companies have embraced (at least in part) these kinds of flexible structures, facilitated by technology and strong company values which glue people together.',
      'A word of warning to others thinking of jumping on this bandwagon: the evidence so far suggests disorder, much like order, also seems to have diminishing utility, and can also have detrimental effects on performance if overused. Like order, disorder should be embraced only so far as it is useful. But we should not fear it - nor venerate one over the other. This research also shows that we should continually question whether or not our existing assumptions work.',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Choose the correct heading for sections **A-H**. Write the correct number, **i-ix**.',
        optionBank: [
          'Complaints about the impact of a certain approach',
          'Fundamental beliefs that are in fact incorrect',
          'Early recommendations concerning business activities',
          'Organisations that put a new approach into practice',
          'Companies that have suffered from changing their approach',
          'What people are increasingly expected to do',
          'How to achieve outcomes that are currently impossible',
          'Neither approach guarantees continuous improvement',
          'Evidence that a certain approach can have more disadvantages than advantages',
        ],
        questions: [
          {
            id: 'q1',
            type: 'bank',
            prompt: 'Section A',
            answer: 'What people are increasingly expected to do',
            explanation: DISORDER_EXPLAIN.q1,
            locate: [{ para: 0, text: 'We are told that we ought to organise our company, our home life, our week, our day and even our sleep' }],
          },
          {
            id: 'q2',
            type: 'bank',
            prompt: 'Section B',
            answer: 'Complaints about the impact of a certain approach',
            explanation: DISORDER_EXPLAIN.q2,
            locate: [{ para: 2, text: 'A large proportion of workers from all demographics claim to be dissatisfied with the way their work is structured and the way they are managed' }],
          },
          {
            id: 'q3',
            type: 'bank',
            prompt: 'Section C',
            answer: 'Early recommendations concerning business activities',
            explanation: DISORDER_EXPLAIN.q3,
            locate: [{ para: 4, text: 'Writing in the first half of the 20th century, he designed a number of principles to improve the efficiency of the work process' }],
          },
          {
            id: 'q4',
            type: 'bank',
            prompt: 'Section D',
            answer: 'Fundamental beliefs that are in fact incorrect',
            explanation: DISORDER_EXPLAIN.q4,
            locate: [
              { para: 5, text: 'this obsession with efficiency is misguided' },
              { para: 5, text: 'it’s the basic assumptions we hold in approaching how we work' },
            ],
          },
          {
            id: 'q5',
            type: 'bank',
            prompt: 'Section E',
            answer: 'Evidence that a certain approach can have more disadvantages than advantages',
            explanation: DISORDER_EXPLAIN.q5,
            locate: [
              { para: 6, text: 'recent studies show that order actually has diminishing returns' },
              { para: 6, text: 'if the cost of formally structuring something outweighs the benefit of doing it' },
            ],
          },
          {
            id: 'q6',
            type: 'bank',
            prompt: 'Section F',
            answer: 'How to achieve outcomes that are currently impossible',
            explanation: DISORDER_EXPLAIN.q6,
            locate: [{ para: 7, text: 'These environments can lead to new solutions that, under conventionally structured environments' }],
          },
          {
            id: 'q7',
            type: 'bank',
            prompt: 'Section G',
            answer: 'Organisations that put a new approach into practice',
            explanation: DISORDER_EXPLAIN.q7,
            locate: [{ para: 8, text: 'In recent times companies have slowly started to embrace this disorganisation' }],
          },
          {
            id: 'q8',
            type: 'bank',
            prompt: 'Section H',
            answer: 'Neither approach guarantees continuous improvement',
            explanation: DISORDER_EXPLAIN.q8,
            locate: [{ para: 11, text: 'disorder, much like order, also seems to have diminishing utility' }],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Choose **ONE WORD ONLY** from the passage for each answer.',
        questions: [
          {
            id: 'q9',
            type: 'gap-fill',
            prompt: 'Numerous training sessions are aimed at people who feel they are not ___ enough.',
            answer: 'productive',
            explanation: DISORDER_EXPLAIN.q9,
            locate: [
              { para: 0, text: 'all as a means to becoming more productive' },
              { para: 0, text: 'countless seminars and workshops take place around the world to tell a paying public' },
            ],
          },
          {
            id: 'q10',
            type: 'gap-fill',
            prompt: 'Being organised appeals to people who regard themselves as ___.',
            answer: 'perfectionists',
            explanation: DISORDER_EXPLAIN.q10,
            locate: [{ para: 1, text: 'much to the delight of self-proclaimed perfectionists' }],
          },
          {
            id: 'q11',
            type: 'gap-fill',
            prompt: 'Many people feel ___ with aspects of their work.',
            answer: 'dissatisfied',
            explanation: DISORDER_EXPLAIN.q11,
            locate: [{ para: 2, text: 'claim to be dissatisfied with the way their work is structured' }],
          },
        ],
      },
      {
        id: 'g3',
        instruction: 'Choose **TRUE/FALSE/NOT GIVEN**',
        questions: [
          {
            id: 'q12',
            type: 'tfng',
            prompt: 'Both businesses and people aim at order without really considering its value.',
            answer: 'True',
            explanation: DISORDER_EXPLAIN.q12,
            locate: [{ para: 5, text: 'businesses and people spend time and money organising themselves for the sake of organising, rather than actually looking at the end goal and usefulness of such an effort' }],
          },
          {
            id: 'q13',
            type: 'tfng',
            prompt: 'Innovation is most successful if the people involved have distinct roles.',
            answer: 'False',
            explanation: DISORDER_EXPLAIN.q13,
            locate: [{ para: 7, text: 'when innovating, the best approach is to create an environment devoid of structure and hierarchy and enable everyone involved to engage as one organic group' }],
          },
          {
            id: 'q14',
            type: 'tfng',
            prompt: 'Google was inspired to adopt flexibility by the success of General Electric.',
            answer: 'Not Given',
            explanation: DISORDER_EXPLAIN.q14,
            locate: [{ para: 10, text: 'Google and a number of other tech companies have embraced (at least in part) these kinds of flexible structures' }],
          },
        ],
      },
    ],
    vocab: [],
  },
  {
    id: 'reading-artificial-artists',
    skill: 'reading',
    title: 'Artificial Artists',
    category: 'Practice test',
    part: 'Reading 16',
    durationMin: 20,
    difficulty: 'hard',
    passageTitle: 'Artificial Artists',
    paragraphLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    passage: [
      'The Painting Fool is one of a growing number of computer programs which, so their makers claim, possess creative talents. Classical music by an artificial composer has had audiences enraptured, and even tricked them into believing a human was behind the score. Artworks painted by a robot have sold for thousands of dollars and been hung in prestigious galleries. And software has been built which creates art that could not have been imagined by the programmer.',
      'Human beings are the only species to perform sophisticated creative acts regularly. If we can break this process down into computer code, where does that leave human creativity? ‘This is a question at the very core of humanity,’ says Geraint Wiggins, a computational creativity researcher at Goldsmiths, University of London. ‘It scares a lot of people. They are worried that it is taking something special away from what it means to be human.’',
      'To some extent, we are all familiar with computerised art. The question is: where does the work of the artist stop and the creativity of the computer begin? Consider one of the oldest machine artists, Aaron, a robot that has had paintings exhibited in London’s Tate Modern and the San Francisco Museum of Modern Art. Aaron can pick up a paintbrush and paint on canvas on its own. Impressive perhaps, but it is still little more than a tool to realise the programmer’s own creative ideas.',
      'Simon Colton, the designer of the Painting Fool, is keen to make sure his creation doesn’t attract the same criticism. Unlike earlier ‘artists’ such as Aaron, the Painting Fool only needs minimal direction and can come up with its own concepts by going online for material. The software runs its own web searches and trawls through social media sites. It is now beginning to display a kind of imagination too, creating pictures from scratch. One of its original works is a series of fuzzy landscapes, depicting trees and sky. While some might say they have a mechanical look, Colton argues that such reactions arise from people’s double standards towards software-produced and human-produced art. After all, he says, consider that the Painting Fool painted the landscapes without referring to a photo. ‘If a child painted a new scene from its head, you’d say it has a certain level of imagination,’ he points out. ‘The same should be true of a machine.’ Software bugs can also lead to unexpected results. Some of the Painting Fool’s paintings of a chair came out in black and white, thanks to a technical glitch. This gives the work an eerie, ghostlike quality. Human artists like the renowned Ellsworth Kelly are lauded for limiting their colour palette – so why should computers be any different?',
      'Researchers like Colton don’t believe it is right to measure machine creativity directly to that of humans who ‘have had millennia to develop our skills’. Others, though, are fascinated by the prospect that a computer might create something as original and subtle as our best artists. So far, only one has come close. Composer David Cope invented a program called Experiments in Musical Intelligence, or EMI. Not only did EMI create compositions in Cope’s style, but also that of the most revered classical composers, including Bach, Chopin and Mozart. Audiences were moved to tears, and EMI even fooled classical music experts into thinking they were hearing genuine Bach. Not everyone was impressed however. Some, such as Wiggins, have blasted Cope’s work as pseudoscience, and condemned him for his deliberately vague explanation of how the software worked. Meanwhile, Douglas Hofstadter of Indiana University said EMI created replicas which still rely completely on the original artist’s creative impulses. When audiences found out the truth they were often outraged with Cope, and one music lover even tried to punch him. Amid such controversy, Cope destroyed EMI’s vital databases.',
      'But why did so many people love the music, yet recoil when they discovered how it was composed? A study by computer scientist David Moffat of Glasgow Caledonian University provides a clue. He asked both expert musicians and non-experts to assess six compositions. The participants weren’t told beforehand whether the tunes were composed by humans or computers, but were asked to guess, and then rate how much they liked each one. People who thought the composer was a computer tended to dislike the piece more than those who believed it was human. This was true even among the experts, who might have been expected to be more objective in their analyses.',
      'Where does this prejudice come from? Paul Bloom of Yale University has a suggestion: he reckons part of the pleasure we get from art stems from the creative process behind the work. This can give it an ‘irresistible essence’, says Bloom. Meanwhile, experiments by Justin Kruger of New York University have shown that people’s enjoyment of an artwork increases if they think more time and effort was needed to create it. Similarly, Colton thinks that when people experience art, they wonder what the artist might have been thinking or what the artist is trying to tell them. It seems obvious, therefore, that with computers producing art, this speculation is cut short – there’s nothing to explore. But as technology becomes increasingly complex, finding those greater depths in computer art could become possible. This is precisely why Colton asks the Painting Fool to tap into online social networks for its inspiration: hopefully this way it will choose themes that will already be meaningful to us.',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Choose appropriate options **A, B, C** or **D**.',
        questions: [
          {
            id: 'q1',
            type: 'mcq',
            prompt: 'What is the writer suggesting about computer-produced works in the first paragraph?',
            options: [
              'People’s acceptance of them can vary considerably.',
              'A great deal of progress has already been attained in this field.',
              'They have had more success in some artistic genres than in others.',
              'The advances are not as significant as the public believes them to be.',
            ],
            answer: 'A great deal of progress has already been attained in this field.',
            explanation: ARTISTS_EXPLAIN.q1,
            locate: [
              { para: 0, text: 'Classical music by an artificial composer has had audiences enraptured' },
              { para: 0, text: 'software has been built which creates art that could not have been imagined by the programmer' },
            ],
          },
          {
            id: 'q2',
            type: 'mcq',
            prompt: 'According to Geraint Wiggins, why are many people worried by computer art?',
            options: [
              'It is aesthetically inferior to human art.',
              'It may ultimately supersede human art.',
              'It undermines a fundamental human quality.',
              'It will lead to a deterioration in human ability.',
            ],
            answer: 'It undermines a fundamental human quality.',
            explanation: ARTISTS_EXPLAIN.q2,
            locate: [{ para: 1, text: 'They are worried that it is taking something special away from what it means to be human' }],
          },
          {
            id: 'q3',
            type: 'mcq',
            prompt: 'What is a key difference between Aaron and the Painting Fool?',
            options: ['Its programmer’s background', 'Public response to its work', 'The source of its subject matter', 'The technical standard of its output'],
            answer: 'The source of its subject matter',
            explanation: ARTISTS_EXPLAIN.q3,
            locate: [
              { para: 2, text: 'it is still little more than a tool to realise the programmer’s own creative ideas' },
              { para: 3, text: 'can come up with its own concepts by going online for material' },
            ],
          },
          {
            id: 'q4',
            type: 'mcq',
            prompt: 'What point does Simon Colton make in the fourth paragraph?',
            options: [
              'Software-produced art is often dismissed as childish and simplistic.',
              'The same concepts of creativity should not be applied to all forms of art.',
              'It is unreasonable to expect a machine to be as imaginative as a human being.',
              'People tend to judge computer art and human art according to different criteria.',
            ],
            answer: 'People tend to judge computer art and human art according to different criteria.',
            explanation: ARTISTS_EXPLAIN.q4,
            locate: [{ para: 3, text: 'such reactions arise from people’s double standards towards software-produced and human-produced art' }],
          },
          {
            id: 'q5',
            type: 'mcq',
            prompt: 'The writer refers to the paintings of a chair as an example of computer art which …',
            options: [
              'achieves a particularly striking effect.',
              'exhibits a certain level of genuine artistic skill.',
              'closely resembles that of a well-known artist.',
              'highlights the technical limitations of the software.',
            ],
            answer: 'achieves a particularly striking effect.',
            explanation: ARTISTS_EXPLAIN.q5,
            locate: [
              { para: 3, text: 'Some of the Painting Fool’s paintings of a chair came out in black and white' },
              { para: 3, text: 'Human artists like the renowned Ellsworth Kelly are lauded for limiting their colour palette – so why should computers be any different?' },
            ],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Complete each sentence with the correct ending, **A-G**.',
        matchLegend: [
          { key: 'A', label: 'generating work that was virtually indistinguishable from that of humans.' },
          { key: 'B', label: 'knowing whether it was the work of humans or software.' },
          { key: 'C', label: 'producing work entirely dependent on the imagination of its creator.' },
          { key: 'D', label: 'comparing the artistic achievements of humans and computers.' },
          { key: 'E', label: 'revealing the technical details of his program.' },
          { key: 'F', label: 'persuading the public to appreciate computer art.' },
          { key: 'G', label: 'discovering that it was the product of a computer program.' },
        ],
        questions: [
          {
            id: 'q6',
            type: 'match',
            prompt: 'Simon Colton says it is important to consider the long-term view when',
            answer: 'D',
            explanation: ARTISTS_EXPLAIN.q6,
            locate: [{ para: 4, text: 'Researchers like Colton don’t believe it is right to measure machine creativity directly to that of humans' }],
          },
          {
            id: 'q7',
            type: 'match',
            prompt: 'David Cope’s EMI software surprised people by',
            answer: 'A',
            explanation: ARTISTS_EXPLAIN.q7,
            locate: [{ para: 4, text: 'EMI even fooled classical music experts into thinking they were hearing genuine Bach' }],
          },
          {
            id: 'q8',
            type: 'match',
            prompt: 'Geraint Wiggins criticized Cope for not',
            answer: 'E',
            explanation: ARTISTS_EXPLAIN.q8,
            locate: [{ para: 4, text: 'condemned him for his deliberately vague explanation of how the software worked' }],
          },
          {
            id: 'q9',
            type: 'match',
            prompt: 'Douglas Hofstadter claimed that EMI was',
            answer: 'C',
            explanation: ARTISTS_EXPLAIN.q9,
            locate: [{ para: 4, text: 'EMI created replicas which still rely completely on the original artist’s creative impulses' }],
          },
          {
            id: 'q10',
            type: 'match',
            prompt: 'Audiences who had listened to EMI’s music became angry after',
            answer: 'G',
            explanation: ARTISTS_EXPLAIN.q10,
            locate: [{ para: 4, text: 'When audiences found out the truth they were often outraged with Cope' }],
          },
          {
            id: 'q11',
            type: 'match',
            prompt: 'The participants in David Moffat’s study had to assess music without',
            answer: 'B',
            explanation: ARTISTS_EXPLAIN.q11,
            locate: [{ para: 5, text: 'The participants weren’t told beforehand whether the tunes were composed by humans or computers' }],
          },
        ],
      },
      {
        id: 'g3',
        instruction: 'Choose **YES/NO/NOT GIVEN**',
        questions: [
          {
            id: 'q12',
            type: 'ynng',
            prompt: 'Moffat’s research may help explain people’s reactions to EMI.',
            answer: 'Yes',
            explanation: ARTISTS_EXPLAIN.q12,
            locate: [{ para: 5, text: 'A study by computer scientist David Moffat of Glasgow Caledonian University provides a clue' }],
          },
          {
            id: 'q13',
            type: 'ynng',
            prompt: 'The non-experts in Moffat’s study all responded in a predictable way.',
            answer: 'Not Given',
            explanation: ARTISTS_EXPLAIN.q13,
            locate: [{ para: 5, text: 'This was true even among the experts, who might have been expected to be more objective in their analyses' }],
          },
          {
            id: 'q14',
            type: 'ynng',
            prompt: 'Justin Kruger’s findings cast doubt on Paul Bloom’s theory about people’s prejudice towards computer art.',
            answer: 'No',
            explanation: ARTISTS_EXPLAIN.q14,
            locate: [
              { para: 6, text: 'part of the pleasure we get from art stems from the creative process behind the work' },
              { para: 6, text: 'people’s enjoyment of an artwork increases if they think more time and effort was needed to create it' },
            ],
          },
        ],
      },
    ],
    vocab: [],
  },
  {
    id: 'reading-should-we-try-to-bring-extinct-species-back-to-life',
    skill: 'reading',
    title: 'Should we try to bring extinct species back to life?',
    category: 'Practice test',
    part: 'Reading 17',
    durationMin: 20,
    difficulty: 'medium',
    passageTitle: 'Should we try to bring extinct species back to life?',
    paragraphLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
    passage: [
      'The passenger pigeon was a legendary species. Flying in vast numbers across North America, with potentially many millions within a single flock, their migration was once one of nature’s great spectacles. Sadly, the passenger pigeon’s existence came to an end on 1 September 1914, when the last living specimen died at Cincinnati Zoo. Geneticist Ben Novak is lead researcher on an ambitious project which now aims to bring the bird back to life through a process known as ‘de-extinction’. The basic premise involves using cloning technology to turn the DNA of extinct animals into a fertilised embryo, which is carried by the nearest relative still in existence — in this case, the abundant band-tailed pigeon — before being born as a living, breathing animal. Passenger pigeons are one of the pioneering species in this field, but they are far from the only ones on which this cutting-edge technology is being trialled.',
      'In Australia, the thylacine, more commonly known as the Tasmanian tiger, is another extinct creature which genetic scientists are striving to bring back to life. ‘There is no carnivore now in Tasmania that fills the niche which thylacines once occupied,’ explains Michael Archer of the University of New South Wales. He points out that in the decades since the thylacine went extinct, there has been a spread in a ‘dangerously debilitating’ facial tumour syndrome which threatens the existence of the Tasmanian devils, the island’s other notorious resident. Thylacines would have prevented this spread because they would have killed significant numbers of Tasmanian devils. ‘If that contagious cancer had popped up previously, it would have burned out in whatever region it started. The return of thylacines to Tasmania could help to ensure that devils are never again subjected to risks of this kind.’',
      'If extinct species can be brought back to life, can humanity begin to correct the damage it has caused to the natural world over the past few millennia? ‘The idea of de-extinction is that we can reverse this process, bringing species that no longer exist back to life,’ says Beth Shapiro of University of California Santa Cruz’s Genomics Institute. ‘I don’t think that we can do this. There is no way to bring back something that is 100 per cent identical to a species that went extinct a long time ago.’ A more practical approach for long-extinct species is to take the DNA of existing species as a template, ready for the insertion of strands of extinct animal DNA to create something new; a hybrid, based on the living species, but which looks and/or acts like the animal which died out.',
      'This complicated process and questionable outcome begs the question: what is the actual point of this technology? ‘For us, the goal has always been replacing the extinct species with a suitable replacement,’ explains Novak. ‘When it comes to breeding, band-tailed pigeons scatter and make maybe one or two nests per hectare, whereas passenger pigeons were very social and would make 10,000 or more nests in one hectare.’ Since the disappearance of this key species, ecosystems in the eastern US have suffered, as the lack of disturbance caused by thousands of passenger pigeons wrecking trees and branches means there has been minimal need for regrowth. This has left forests stagnant and therefore unwelcoming to the plants and animals which evolved to help regenerate the forest after a disturbance. According to Novak, a hybridised band-tailed pigeon, with the added nesting habits of a passenger pigeon, could, in theory, re-establish that forest disturbance, thereby creating a habitat necessary for a great many other native species to thrive.',
      'Another popular candidate for this technology is the woolly mammoth. George Church, professor at Harvard Medical School and leader of the Woolly Mammoth Revival Project, has been focusing on cold resistance, the main way in which the extinct woolly mammoth and its nearest living relative, the Asian elephant, differ. By pinpointing which genetic traits made it possible for mammoths to survive the icy climate of the tundra, the project’s goal is to return mammoths, or a mammoth-like species, to the area. ‘My highest priority would be preserving the endangered Asian elephant,’ says Church, ‘expanding their range to the huge ecosystem of the tundra. Necessary adaptations would include smaller ears, thicker hair, and extra insulating fat, all for the purpose of reducing heat loss in the tundra, and all traits found in the now extinct woolly mammoth.’ This repopulation of the tundra and boreal forests of Eurasia and North America with large mammals could also be a useful factor in reducing carbon emissions — elephants punch holes through snow and knock down trees, which encourages grass growth. This grass growth would reduce temperatures, and mitigate emissions from melting permafrost.',
      'While the prospect of bringing extinct animals back to life might capture imaginations, it is, of course, far easier to try to save an existing species which is merely threatened with extinction. ‘Many of the technologies that people have in mind when they think about de-extinction can be used as a form of “genetic rescue”,’ explains Shapiro. She prefers to focus the debate on how this emerging technology could be used to fully understand why various species went extinct in the first place, and therefore how we could use it to make genetic modifications which could prevent mass extinctions in the future. ‘I would also say there’s an incredible moral hazard to not do anything at all,’ she continues. ‘We know that what we are doing today is not enough, and we have to be willing to take some calculated and measured risks.’',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Which paragraph contains the following information? Write the correct letter, **A-F**. **NB** You may use any letter more than once.',
        matchLegend: [
          { key: 'A', label: '' },
          { key: 'B', label: '' },
          { key: 'C', label: '' },
          { key: 'D', label: '' },
          { key: 'E', label: '' },
          { key: 'F', label: '' },
        ],
        questions: [
          {
            id: 'q1',
            type: 'match',
            prompt: 'a reference to how further disappearance of multiple species could be avoided',
            answer: 'F',
            explanation: DEEXTINCTION_EXPLAIN.q1,
            locate: [{ para: 5, text: 'how we could use it to make genetic modifications which could prevent mass extinctions in the future' }],
          },
          {
            id: 'q2',
            type: 'match',
            prompt: 'explanation of a way of reproducing an extinct animal using the DNA of only that species',
            answer: 'A',
            explanation: DEEXTINCTION_EXPLAIN.q2,
            locate: [{ para: 0, text: 'The basic premise involves using cloning technology to turn the DNA of extinct animals into a fertilised embryo' }],
          },
          {
            id: 'q3',
            type: 'match',
            prompt: 'reference to a habitat which has suffered following the extinction of a species',
            answer: 'D',
            explanation: DEEXTINCTION_EXPLAIN.q3,
            locate: [
              { para: 3, text: 'Since the disappearance of this key species, ecosystems in the eastern US have suffered' },
              { para: 3, text: 'This has left forests stagnant' },
            ],
          },
          {
            id: 'q4',
            type: 'match',
            prompt: 'mention of the exact point at which a particular species became extinct',
            answer: 'A',
            explanation: DEEXTINCTION_EXPLAIN.q4,
            locate: [{ para: 0, text: 'the passenger pigeon’s existence came to an end on 1 September 1914, when the last living specimen died at Cincinnati Zoo' }],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Choose **NO MORE THAN TWO WORDS** from the passage for each answer.',
        // Summary Completion 3 đoạn: mỗi hàng = 1 đoạn văn (table.summary).
        table: {
          title: 'The woolly mammoth revival project',
          summary: true,
          rows: [
            { label: '', lines: [{ q: 'q5' }, 'The findings could help preserve the mammoth’s close relative, the endangered Asian elephant.'] },
            { label: '', lines: [{ q: 'q6' }, { q: 'q7' }, { q: 'q8' }] },
            { label: '', lines: [{ q: 'q9' }] },
          ],
        },
        questions: [
          {
            id: 'q5',
            type: 'gap-fill',
            prompt: 'Professor George Church and his team are trying to identify the ___ which enabled mammoths to live in the tundra.',
            answer: 'genetic traits',
            explanation: DEEXTINCTION_EXPLAIN.q5,
            locate: [{ para: 4, text: 'By pinpointing which genetic traits made it possible for mammoths to survive the icy climate of the tundra' }],
          },
          {
            id: 'q6',
            type: 'gap-fill',
            prompt: 'According to Church, introducing Asian elephants to the tundra would involve certain physical adaptations to minimise ___.',
            answer: 'heat loss',
            explanation: DEEXTINCTION_EXPLAIN.q6,
            locate: [{ para: 4, text: 'all for the purpose of reducing heat loss in the tundra' }],
          },
          {
            id: 'q7',
            type: 'gap-fill',
            prompt: 'To survive in the tundra, the species would need to have the mammoth-like features of thicker hair, ___ of a reduced size',
            answer: 'ears',
            explanation: DEEXTINCTION_EXPLAIN.q7,
            locate: [{ para: 4, text: 'Necessary adaptations would include smaller ears, thicker hair, and extra insulating fat' }],
          },
          {
            id: 'q8',
            type: 'gap-fill',
            prompt: 'and more ___.',
            answer: 'insulating fat',
            alt: ['fat'],
            explanation: DEEXTINCTION_EXPLAIN.q8,
            locate: [{ para: 4, text: 'extra insulating fat' }],
          },
          {
            id: 'q9',
            type: 'gap-fill',
            prompt: 'Repopulating the tundra with mammoths or Asian elephant/mammoth hybrids would also have an impact on the environment, which could help to reduce temperatures and decrease ___.',
            answer: 'carbon emissions',
            alt: ['emissions'],
            explanation: DEEXTINCTION_EXPLAIN.q9,
            locate: [
              { para: 4, text: 'could also be a useful factor in reducing carbon emissions' },
              { para: 4, text: 'This grass growth would reduce temperatures, and mitigate emissions from melting permafrost' },
            ],
          },
        ],
      },
      {
        id: 'g3',
        instruction: 'Match each statement with the correct person, **A, B** or **C**. **NB** You may use any letter more than once.',
        matchLegend: [
          { key: 'A', label: 'Ben Novak' },
          { key: 'B', label: 'Michael Archer' },
          { key: 'C', label: 'Beth Shapiro' },
        ],
        questions: [
          {
            id: 'q10',
            type: 'match',
            prompt: 'Reintroducing an extinct species to its original habitat could improve the health of a particular species living there.',
            answer: 'B',
            explanation: DEEXTINCTION_EXPLAIN.q10,
            locate: [{ para: 1, text: 'The return of thylacines to Tasmania could help to ensure that devils are never again subjected to risks of this kind' }],
          },
          {
            id: 'q11',
            type: 'match',
            prompt: 'It is important to concentrate on the causes of an animal’s extinction.',
            answer: 'C',
            explanation: DEEXTINCTION_EXPLAIN.q11,
            locate: [{ para: 5, text: 'She prefers to focus the debate on how this emerging technology could be used to fully understand why various species went extinct in the first place' }],
          },
          {
            id: 'q12',
            type: 'match',
            prompt: 'A species brought back from extinction could have an important beneficial impact on the vegetation of its habitat.',
            answer: 'A',
            explanation: DEEXTINCTION_EXPLAIN.q12,
            locate: [{ para: 3, text: 'could, in theory, re-establish that forest disturbance, thereby creating a habitat necessary for a great many other native species to thrive' }],
          },
          {
            id: 'q13',
            type: 'match',
            prompt: 'Our current efforts at preserving biodiversity are insufficient.',
            answer: 'C',
            explanation: DEEXTINCTION_EXPLAIN.q13,
            locate: [{ para: 5, text: 'We know that what we are doing today is not enough' }],
          },
        ],
      },
    ],
    vocab: [],
  },
  {
    id: 'reading-gifted-children-and-learning',
    skill: 'reading',
    title: 'Gifted children and learning',
    category: 'Practice test',
    part: 'Reading 18',
    durationMin: 20,
    difficulty: 'hard',
    passageTitle: 'Gifted children and learning',
    paragraphLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
    passage: [
      'Internationally, ‘giftedness’ is most frequently determined by a score on a general intelligence test, known as an IQ test, which is above a chosen cutoff point, usually at around the top 2-5%. Children’s educational environment contributes to the IQ score and the way intelligence is used. For example, a very close positive relationship was found when children’s IQ scores were compared with their home educational provision (Freeman, 2010). The higher the children’s IQ scores, especially over IQ 130, the better the quality of their educational backup, measured in terms of reported verbal interactions with parents, number of books and activities in their home etc. Because IQ tests are decidedly influenced by what the child has learned, they are to some extent measures of current achievement based on age-norms; that is, how well the children have learned to manipulate their knowledge and know-how within the terms of the test. The vocabulary aspect, for example, is dependent on having heard those words. But IQ tests can neither identify the processes of learning and thinking nor predict creativity.',
      'Excellence does not emerge without appropriate help. To reach an exceptionally high standard in any area very able children need the means to learn, which includes material to work with and focused challenging tuition – and the encouragement to follow their dream. There appears to be a qualitative difference in the way the intellectually highly able think, compared with more average-ability or older pupils, for whom external regulation by the teacher often compensates for lack of internal regulation. To be at their most effective in their self-regulation, all children can be helped to identify their own ways of learning – metacognition – which will include strategies of planning, monitoring, evaluation, and choice of what to learn. Emotional awareness is also part of metacognition, so children should be helped to be aware of their feelings around the area to be learned, feelings of curiosity or confidence, for example.',
      'High achievers have been found to use self-regulatory learning strategies more often and more effectively than lower achievers, and are better able to transfer these strategies to deal with unfamiliar tasks. This happens to such a high degree in some children that they appear to be demonstrating talent in particular areas. Overviewing research on the thinking process of highly able children, (Shore and Kanevsky, 1993) put the instructor’s problem succinctly: ‘If they [the gifted] merely think more quickly, then we need only teach more quickly. If they merely make fewer errors, then we can shorten the practice’. But of course, this is not entirely the case; adjustments have to be made in methods of learning and teaching, to take account of the many ways individuals think.',
      'Yet in order to learn by themselves, the gifted do need some support from their teachers. Conversely, teachers who have a tendency to ‘overdirect’ can diminish their gifted pupils’ learning autonomy. Although ‘spoon-feeding’ can produce extremely high examination results, these are not always followed by equally impressive life successes. Too much dependence on the teachers risks loss of autonomy and motivation to discover. However, when teachers help pupils to reflect on their own learning and thinking activities, they increase their pupils’ self-regulation. For a young child, it may be just the simple question ‘What have you learned today?’ which helps them to recognise what they are doing. Given that a fundamental goal of education is to transfer the control of learning from teachers to pupils, improving pupils’ learning to learn techniques should be a major outcome of the school experience, especially for the highly competent. There are quite a number of new methods which can help, such as child-initiated learning, ability-peer tutoring, etc. Such practices have been found to be particularly useful for bright children from deprived areas.',
      'But scientific progress is not all theoretical, knowledge is also vital to outstanding performance: individuals who know a great deal about a specific domain will achieve at a higher level than those who do not (Elshout, 1995). Research with creative scientists by Simonton (1988) brought him to the conclusion that above a certain high level, characteristics such as independence seemed to contribute more to reaching the highest levels of expertise than intellectual skills, due to the great demands of effort and time needed for learning and practice. Creativity in all forms can be seen as expertise mixed with a high level of motivation (Weisberg, 1993).',
      'To sum up, learning is affected by emotions of both the individual and significant others. Positive emotions facilitate the creative aspects of learning and negative emotions inhibit it. Fear, for example, can limit the development of curiosity, which is a strong force in scientific advance, because it motivates problem-solving behaviour. In Boekaerts’ (1991) review of emotion in the learning of very high IQ and highly achieving children, she found emotional forces in harness. They were not only curious, but often had a strong desire to control their environment, improve their learning efficiency and increase their own learning resources.',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Which paragraph contains the following information? Write the correct letter, **A-F**.',
        matchLegend: [
          { key: 'A', label: '' },
          { key: 'B', label: '' },
          { key: 'C', label: '' },
          { key: 'D', label: '' },
          { key: 'E', label: '' },
          { key: 'F', label: '' },
        ],
        questions: [
          {
            id: 'q1',
            type: 'match',
            prompt: 'a reference to the influence of the domestic background on the gifted child',
            answer: 'A',
            explanation: GIFTED_EXPLAIN.q1,
            locate: [{ para: 0, text: 'a very close positive relationship was found when children’s IQ scores were compared with their home educational provision' }],
          },
          {
            id: 'q2',
            type: 'match',
            prompt: 'reference to what can be lost if learners are given too much guidance',
            answer: 'D',
            explanation: GIFTED_EXPLAIN.q2,
            locate: [{ para: 3, text: 'Too much dependence on the teachers risks loss of autonomy and motivation to discover' }],
          },
          {
            id: 'q3',
            type: 'match',
            prompt: 'a reference to the damaging effects of anxiety',
            answer: 'F',
            explanation: GIFTED_EXPLAIN.q3,
            locate: [{ para: 5, text: 'Fear, for example, can limit the development of curiosity' }],
          },
          {
            id: 'q4',
            type: 'match',
            prompt: 'examples of classroom techniques which favour socially-disadvantaged children',
            answer: 'D',
            explanation: GIFTED_EXPLAIN.q4,
            locate: [
              { para: 3, text: 'such as child-initiated learning, ability-peer tutoring' },
              { para: 3, text: 'Such practices have been found to be particularly useful for bright children from deprived areas' },
            ],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Match each statement with the correct person or people, **A-E**.',
        matchLegend: [
          { key: 'A', label: 'Freeman' },
          { key: 'B', label: 'Shore and Kanevsky' },
          { key: 'C', label: 'Elshout' },
          { key: 'D', label: 'Simonton' },
          { key: 'E', label: 'Boekaerts' },
        ],
        questions: [
          {
            id: 'q5',
            type: 'match',
            prompt: 'Less time can be spent on exercises with gifted pupils who produce accurate work.',
            answer: 'B',
            explanation: GIFTED_EXPLAIN.q5,
            locate: [{ para: 2, text: 'If they merely make fewer errors, then we can shorten the practice' }],
          },
          {
            id: 'q6',
            type: 'match',
            prompt: 'Self-reliance is a valuable tool that helps gifted students reach their goals.',
            answer: 'D',
            explanation: GIFTED_EXPLAIN.q6,
            locate: [{ para: 4, text: 'characteristics such as independence seemed to contribute more to reaching the highest levels of expertise than intellectual skills' }],
          },
          {
            id: 'q7',
            type: 'match',
            prompt: 'Gifted children know how to channel their feelings to assist their learning.',
            answer: 'E',
            explanation: GIFTED_EXPLAIN.q7,
            locate: [{ para: 5, text: 'she found emotional forces in harness' }],
          },
          {
            id: 'q8',
            type: 'match',
            prompt: 'The very gifted child benefits from appropriate support from close relatives.',
            answer: 'A',
            explanation: GIFTED_EXPLAIN.q8,
            locate: [{ para: 0, text: 'The higher the children’s IQ scores, especially over IQ 130, the better the quality of their educational backup' }],
          },
          {
            id: 'q9',
            type: 'match',
            prompt: 'Really successful students have learnt a considerable amount about their subject.',
            answer: 'C',
            explanation: GIFTED_EXPLAIN.q9,
            locate: [{ para: 4, text: 'individuals who know a great deal about a specific domain will achieve at a higher level than those who do not' }],
          },
        ],
      },
      {
        id: 'g3',
        instruction: 'Choose **NO MORE THAN THREE WORDS** from the passage for each answer.',
        questions: [
          {
            id: 'q10',
            type: 'gap-fill',
            prompt: 'One study found a strong connection between children’s IQ and the availability of ___ at home.',
            answer: 'books and activities',
            explanation: GIFTED_EXPLAIN.q10,
            locate: [{ para: 0, text: 'number of books and activities in their home' }],
          },
          {
            id: 'q11',
            type: 'gap-fill',
            prompt: 'Children of average ability seem to need more direction from teachers because they do not have ___.',
            answer: 'internal regulation',
            explanation: GIFTED_EXPLAIN.q11,
            locate: [{ para: 1, text: 'for whom external regulation by the teacher often compensates for lack of internal regulation' }],
          },
          {
            id: 'q12',
            type: 'gap-fill',
            prompt: 'Meta-cognition involves children understanding their own learning strategies, as well as developing ___.',
            answer: 'emotional awareness',
            explanation: GIFTED_EXPLAIN.q12,
            locate: [{ para: 1, text: 'Emotional awareness is also part of metacognition' }],
          },
          {
            id: 'q13',
            type: 'gap-fill',
            prompt: 'Teachers who rely on what is known as ___ often produce sets of impressive grades in class tests.',
            answer: 'spoon-feeding',
            explanation: GIFTED_EXPLAIN.q13,
            locate: [{ para: 3, text: 'Although ‘spoon-feeding’ can produce extremely high examination results' }],
          },
        ],
      },
    ],
    vocab: [],
  },
  {
    id: 'reading-oxytocin',
    skill: 'reading',
    title: 'Oxytocin',
    category: 'Practice test',
    part: 'Reading 19',
    durationMin: 20,
    difficulty: 'medium',
    passageTitle: 'Oxytocin — The positive and negative effects of the chemical known as the ‘love hormone’',
    paragraphLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
    passage: [
      'Oxytocin is a chemical, a hormone produced in the pituitary gland in the brain. It was through various studies focusing on animals that scientists first became aware of the influence of oxytocin. They discovered that it helps reinforce the bonds between prairie voles, which mate for life, and triggers the motherly behaviour that sheep show towards their newborn lambs. It is also released by women in childbirth, strengthening the attachment between mother and baby. Few chemicals have as positive a reputation as oxytocin, which is sometimes referred to as the ‘love hormone’. One sniff of it can, it is claimed, make a person more trusting, empathetic, generous and cooperative. It is time, however, to revise this wholly optimistic view. A new wave of studies has shown that its effects vary greatly depending on the person and the circumstances, and it can impact on our social interactions for worse as well as for better.',
      'Oxytocin’s role in human behaviour first emerged in 2005. In a groundbreaking experiment, Markus Heinrichs and his colleagues at the University of Freiburg, Germany, asked volunteers to do an activity in which they could invest money with an anonymous person who was not guaranteed to be honest. The team found that participants who had sniffed oxytocin via a nasal spray beforehand invested more money than those who received a placebo instead. The study was the start of research into the effects of oxytocin on human interactions. ‘For eight years, it was quite a lonesome field,’ Heinrichs recalls. ‘Now, everyone is interested.’ These follow-up studies have shown that after a sniff of the hormone, people become more charitable, better at reading emotions on others’ faces and at communicating constructively in arguments. Together, the results fuelled the view that oxytocin universally enhanced the positive aspects of our social nature.',
      'Then, after a few years, contrasting findings began to emerge. Simone Shamay-Tsoory at the University of Haifa, Israel, found that when volunteers played a competitive game, those who inhaled the hormone showed more pleasure when they beat other players, and felt more envy when others won. What’s more, administering oxytocin also has sharply contrasting outcomes depending on a person’s disposition. Jennifer Bartz from Mount Sinai School of Medicine, New York, found that it improves people’s ability to read emotions, but only if they are not very socially adept to begin with. Her research also shows that oxytocin in fact reduces cooperation in subjects who are particularly anxious or sensitive to rejection.',
      'Another discovery is that oxytocin’s effects vary depending on who we are interacting with. Studies conducted by Carolyn DeClerck of the University of Antwerp, Belgium, revealed that people who had received a dose of oxytocin actually became less cooperative when dealing with complete strangers. Meanwhile, Carsten De Dreu at the University of Amsterdam in the Netherlands discovered that volunteers given oxytocin showed favouritism: Dutchmen became quicker to associate positive words with Dutch names than with foreign ones, for example. According to De Dreu, oxytocin drives people to care for those in their social circles and defend them from outside dangers. So, it appears that oxytocin strengthens biases, rather than promoting general goodwill, as was previously thought.',
      'There were signs of these subtleties from the start. Bartz has recently shown that in almost half of the existing research results, oxytocin influenced only certain individuals or in certain circumstances. Where once researchers took no notice of such findings, now a more nuanced understanding of oxytocin’s effects is propelling investigations down new lines. To Bartz, the key to understanding what the hormone does lies in pinpointing its core function rather than in cataloguing its seemingly endless effects. There are several hypotheses which are not mutually exclusive. Oxytocin could help to reduce anxiety and fear. Or it could simply motivate people to seek out social connections. She believes that oxytocin acts as a chemical spotlight that shines on social clues – a shift in posture, a flicker of the eyes, a dip in the voice – making people more attuned to their social environment. This would explain why it makes us more likely to look others in the eye and improves our ability to identify emotions. But it could also make things worse for people who are overly sensitive or prone to interpreting social cues in the worst light.',
      'Perhaps we should not be surprised that the oxytocin story has become more perplexing. The hormone is found in everything from octopuses to sheep, and its evolutionary roots stretch back half a billion years. ‘It’s a very simple and ancient molecule that has been co-opted for many different functions,’ says Sue Carter at the University of Illinois, Chicago, USA. ‘It affects primitive parts of the brain like the amygdala, so it’s going to have many effects on just about everything.’ Bartz agrees. ‘Oxytocin probably does some very basic things, but once you add our higher-order thinking and social situations, these basic processes could manifest in different ways depending on individual differences and context.’',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Which paragraph contains the following information? Write the correct letter, **A-F**. **NB** You may use any letter more than once.',
        matchLegend: [
          { key: 'A', label: '' },
          { key: 'B', label: '' },
          { key: 'C', label: '' },
          { key: 'D', label: '' },
          { key: 'E', label: '' },
          { key: 'F', label: '' },
        ],
        questions: [
          {
            id: 'q1',
            type: 'match',
            prompt: 'reference to research showing the beneficial effects of oxytocin on people',
            answer: 'B',
            explanation: OXYTOCIN_EXPLAIN.q1,
            locate: [{ para: 1, text: 'people become more charitable, better at reading emotions on others’ faces and at communicating constructively in arguments' }],
          },
          {
            id: 'q2',
            type: 'match',
            prompt: 'reasons why the effects of oxytocin are complex',
            answer: 'F',
            explanation: OXYTOCIN_EXPLAIN.q2,
            locate: [
              { para: 5, text: 'Perhaps we should not be surprised that the oxytocin story has become more perplexing' },
              { para: 5, text: 'It’s a very simple and ancient molecule that has been co-opted for many different functions' },
            ],
          },
          {
            id: 'q3',
            type: 'match',
            prompt: 'mention of a period in which oxytocin attracted little scientific attention',
            answer: 'B',
            explanation: OXYTOCIN_EXPLAIN.q3,
            locate: [{ para: 1, text: 'For eight years, it was quite a lonesome field' }],
          },
          {
            id: 'q4',
            type: 'match',
            prompt: 'reference to people ignoring certain aspects of their research data',
            answer: 'E',
            explanation: OXYTOCIN_EXPLAIN.q4,
            locate: [{ para: 4, text: 'Where once researchers took no notice of such findings' }],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Match each research finding with the correct researcher, **A-F**.',
        matchLegend: [
          { key: 'A', label: 'Markus Heinrichs' },
          { key: 'B', label: 'Simone Shamay-Tsoory' },
          { key: 'C', label: 'Jennifer Bartz' },
          { key: 'D', label: 'Carolyn DeClerck' },
          { key: 'E', label: 'Carsten De Dreu' },
          { key: 'F', label: 'Sue Carter' },
        ],
        questions: [
          {
            id: 'q5',
            type: 'match',
            prompt: 'People are more trusting when affected by oxytocin.',
            answer: 'A',
            explanation: OXYTOCIN_EXPLAIN.q5,
            locate: [{ para: 1, text: 'participants who had sniffed oxytocin via a nasal spray beforehand invested more money than those who received a placebo instead' }],
          },
          {
            id: 'q6',
            type: 'match',
            prompt: 'Oxytocin increases people’s feelings of jealousy.',
            answer: 'B',
            explanation: OXYTOCIN_EXPLAIN.q6,
            locate: [{ para: 2, text: 'felt more envy when others won' }],
          },
          {
            id: 'q7',
            type: 'match',
            prompt: 'The effect of oxytocin varies from one type of person to another.',
            answer: 'C',
            explanation: OXYTOCIN_EXPLAIN.q7,
            locate: [
              { para: 2, text: 'administering oxytocin also has sharply contrasting outcomes depending on a person’s disposition' },
              { para: 2, text: 'but only if they are not very socially adept to begin with' },
            ],
          },
        ],
      },
      {
        id: 'g3',
        instruction: 'Choose **ONE WORD ONLY** from the passage for each answer.',
        // Summary Completion 2 đoạn (table.summary, mỗi hàng 1 đoạn).
        table: {
          title: 'Oxytocin research',
          summary: true,
          rows: [
            { label: '', lines: [{ q: 'q8' }, { q: 'q9' }, { q: 'q10' }] },
            { label: '', lines: ['However, later research suggests that this is not always the case.', { q: 'q11' }, { q: 'q12' }, { q: 'q13' }] },
          ],
        },
        questions: [
          {
            id: 'q8',
            type: 'gap-fill',
            prompt: 'The earliest findings about oxytocin and bonding came from research involving ___.',
            answer: 'animals',
            explanation: OXYTOCIN_EXPLAIN.q8,
            locate: [{ para: 0, text: 'It was through various studies focusing on animals that scientists first became aware of the influence of oxytocin' }],
          },
          {
            id: 'q9',
            type: 'gap-fill',
            prompt: 'It was also discovered that humans produce oxytocin during ___.',
            answer: 'childbirth',
            explanation: OXYTOCIN_EXPLAIN.q9,
            locate: [{ para: 0, text: 'It is also released by women in childbirth' }],
          },
          {
            id: 'q10',
            type: 'gap-fill',
            prompt: 'An experiment in 2005, in which participants were given either oxytocin or a ___, reinforced the belief that the hormone had a positive effect.',
            answer: 'placebo',
            explanation: OXYTOCIN_EXPLAIN.q10,
            locate: [{ para: 1, text: 'invested more money than those who received a placebo instead' }],
          },
          {
            id: 'q11',
            type: 'gap-fill',
            prompt: 'A study at the University of Haifa where participants took part in a ___ revealed the negative emotions which oxytocin can trigger.',
            answer: 'game',
            explanation: OXYTOCIN_EXPLAIN.q11,
            locate: [{ para: 2, text: 'when volunteers played a competitive game' }],
          },
          {
            id: 'q12',
            type: 'gap-fill',
            prompt: 'A study at the University of Antwerp showed people’s lack of willingness to help ___ while under the influence of oxytocin.',
            answer: 'strangers',
            explanation: OXYTOCIN_EXPLAIN.q12,
            locate: [{ para: 3, text: 'actually became less cooperative when dealing with complete strangers' }],
          },
          {
            id: 'q13',
            type: 'gap-fill',
            prompt: 'Meanwhile, research at the University of Amsterdam revealed that people who have been given oxytocin consider ___ that are familiar to them in their own country to have more positive associations than those from other cultures.',
            answer: 'names',
            explanation: OXYTOCIN_EXPLAIN.q13,
            locate: [{ para: 3, text: 'Dutchmen became quicker to associate positive words with Dutch names than with foreign ones' }],
          },
        ],
      },
    ],
    vocab: [],
  },
  {
    id: 'reading-saving-bugs-to-find-new-drugs',
    skill: 'reading',
    title: 'Saving bugs to find new drugs',
    category: 'Practice test',
    part: 'Reading 20',
    durationMin: 20,
    difficulty: 'medium',
    passageTitle: 'Saving bugs to find new drugs — Zoologist Ross Piper looks at the potential of insects in pharmaceutical research',
    paragraphLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    passage: [
      'More drugs than you might think are derived from, or inspired by, compounds found in living things. Looking to nature for the soothing and curing of our ailments is nothing new - we have been doing it for tens of thousands of years. You only have to look at other primates - such as the capuchin monkeys who rub themselves with toxin-oozing millipedes to deter mosquitoes, or the chimpanzees who use noxious forest plants to rid themselves of intestinal parasites - to realise that our ancient ancestors too probably had a basic grasp of medicine.',
      'Pharmaceutical science and chemistry built on these ancient foundations and perfected the extraction, characterisation, modification and testing of these natural products. Then, for a while, modern pharmaceutical science moved its focus away from nature and into the laboratory, designing chemical compounds from scratch. The main cause of this shift is that although there are plenty of promising chemical compounds in nature, finding them is far from easy. Securing sufficient numbers of the organism in question, isolating and characterising the compounds of interest, and producing large quantities of these compounds are all significant hurdles.',
      'Laboratory-based drug discovery has achieved varying levels of success, something which has now prompted the development of new approaches focusing once again on natural products. With the ability to mine genomes for useful compounds, it is now evident that we have barely scratched the surface of nature’s molecular diversity. This realisation, together with several looming health crises, such as antibiotic resistance, has put bioprospecting - the search for useful compounds in nature - firmly back on the map.',
      'Insects are the undisputed masters of the terrestrial domain, where they occupy every possible niche. Consequently, they have a bewildering array of interactions with other organisms, something which has driven the evolution of an enormous range of very interesting compounds for defensive and offensive purposes. Their remarkable diversity exceeds that of every other group of animals on the planet combined. Yet even though insects are far and away the most diverse animals in existence, their potential as sources of therapeutic compounds is yet to be realised.',
      'From the tiny proportion of insects that have been investigated, several promising compounds have been identified. For example, alloferon, an antimicrobial compound produced by blow fly larvae, is used as an antiviral and antitumor agent in South Korea and Russia. The larvae of a few other insect species are being investigated for the potent antimicrobial compounds they produce. Meanwhile, a compound from the venom of the wasp Polybia paulista has potential in cancer treatment.',
      'Why is it that insects have received relatively little attention in bioprospecting? Firstly, there are so many insects that, without some manner of targeted approach, investigating this huge variety of species is a daunting task. Secondly, insects are generally very small, and the glands inside them that secrete potentially useful compounds are smaller still. This can make it difficult to obtain sufficient quantities of the compound for subsequent testing. Thirdly, although we consider insects to be everywhere, the reality of this ubiquity is vast numbers of a few extremely common species. Many insect species are infrequently encountered and very difficult to rear in captivity, which, again, can leave us with insufficient material to work with.',
      'My colleagues and I at Aberystwyth University in the UK have developed an approach in which we use our knowledge of ecology as a guide to target our efforts. The creatures that particularly interest us are the many insects that secrete powerful poison for subduing prey and keeping it fresh for future consumption. There are even more insects that are masters of exploiting filthy habitats, such as faeces and carcasses, where they are regularly challenged by thousands of microorganisms. These insects have many antimicrobial compounds for dealing with pathogenic bacteria and fungi, suggesting that there is certainly potential to find many compounds that can serve as or inspire new antibiotics.',
      'Although natural history knowledge points us in the right direction, it doesn’t solve the problems associated with obtaining useful compounds from insects. Fortunately, it is now possible to snip out the stretches of the insect’s DNA that carry the codes for the interesting compounds and insert them into cell lines that allow larger quantities to be produced. And although the road from isolating and characterising compounds with desirable qualities to developing a commercial product is very long and full of pitfalls, the variety of successful animal-derived pharmaceuticals on the market demonstrates there is a precedent here that is worth exploring.',
      'With every bit of wilderness that disappears, we deprive ourselves of potential medicines. As much as I’d love to help develop a groundbreaking insect-derived medicine, my main motivation for looking at insects in this way is conservation. I sincerely believe that all species, however small and seemingly insignificant, have a right to exist for their own sake. If we can shine a light on the darker recesses of nature’s medicine cabinet, exploring the useful chemistry of the most diverse animals on the planet, I believe we can make people think differently about the value of nature.',
    ],
    groups: [
      {
        id: 'g1',
        instruction: 'Which paragraph contains the following information? Write the correct letter, **A-I**.',
        matchLegend: [
          { key: 'A', label: '' },
          { key: 'B', label: '' },
          { key: 'C', label: '' },
          { key: 'D', label: '' },
          { key: 'E', label: '' },
          { key: 'F', label: '' },
          { key: 'G', label: '' },
          { key: 'H', label: '' },
          { key: 'I', label: '' },
        ],
        questions: [
          {
            id: 'q1',
            type: 'match',
            prompt: 'mention of factors driving a renewed interest in natural medicinal compounds',
            answer: 'C',
            explanation: BUGS_EXPLAIN.q1,
            locate: [
              { para: 2, text: 'something which has now prompted the development of new approaches focusing once again on natural products' },
              { para: 2, text: 'together with several looming health crises, such as antibiotic resistance' },
            ],
          },
          {
            id: 'q2',
            type: 'match',
            prompt: 'how recent technological advances have made insect research easier',
            answer: 'H',
            explanation: BUGS_EXPLAIN.q2,
            locate: [{ para: 7, text: 'it is now possible to snip out the stretches of the insect’s DNA that carry the codes for the interesting compounds and insert them into cell lines that allow larger quantities to be produced' }],
          },
          {
            id: 'q3',
            type: 'match',
            prompt: 'examples of animals which use medicinal substances from nature',
            answer: 'A',
            explanation: BUGS_EXPLAIN.q3,
            locate: [{ para: 0, text: 'such as the capuchin monkeys who rub themselves with toxin-oozing millipedes to deter mosquitoes, or the chimpanzees who use noxious forest plants to rid themselves of intestinal parasites' }],
          },
          {
            id: 'q4',
            type: 'match',
            prompt: 'reasons why it is challenging to use insects in drug research',
            answer: 'F',
            explanation: BUGS_EXPLAIN.q4,
            locate: [{ para: 5, text: 'Why is it that insects have received relatively little attention in bioprospecting?' }],
          },
          {
            id: 'q5',
            type: 'match',
            prompt: 'reference to how interest in drug research may benefit wildlife',
            answer: 'I',
            explanation: BUGS_EXPLAIN.q5,
            locate: [
              { para: 8, text: 'my main motivation for looking at insects in this way is conservation' },
              { para: 8, text: 'I believe we can make people think differently about the value of nature' },
            ],
          },
          {
            id: 'q6',
            type: 'match',
            prompt: 'a reason why nature-based medicines fell out of favour for a period',
            answer: 'B',
            explanation: BUGS_EXPLAIN.q6,
            locate: [{ para: 1, text: 'The main cause of this shift is that although there are plenty of promising chemical compounds in nature, finding them is far from easy' }],
          },
          {
            id: 'q7',
            type: 'match',
            prompt: 'an example of an insect-derived medicine in use at the moment',
            answer: 'E',
            explanation: BUGS_EXPLAIN.q7,
            locate: [{ para: 4, text: 'alloferon, an antimicrobial compound produced by blow fly larvae, is used as an antiviral and antitumor agent in South Korea and Russia' }],
          },
        ],
      },
      {
        id: 'g2',
        instruction: 'Choose **TWO** letters, **A-E**.',
        questions: [
          {
            id: 'q8',
            type: 'multi',
            prompt: 'Which TWO of the following make insects interesting for drug research?',
            options: [
              'the huge number of individual insects in the world',
              'the variety of substances insects have developed to protect themselves',
              'the potential to extract and make use of insects’ genetic codes',
              'the similarities between different species of insect',
              'the manageable size of most insects',
            ],
            answer: 'the variety of substances insects have developed to protect themselves',
            alt: ['the potential to extract and make use of insects’ genetic codes'],
            explanation: BUGS_EXPLAIN.q8,
            locate: [
              { para: 3, text: 'driven the evolution of an enormous range of very interesting compounds for defensive and offensive purposes' },
              { para: 7, text: 'snip out the stretches of the insect’s DNA that carry the codes for the interesting compounds' },
            ],
          },
          {
            id: 'q9',
            type: 'multi',
            prompt: 'Which TWO of the following make insects interesting for drug research?',
            options: [
              'the huge number of individual insects in the world',
              'the variety of substances insects have developed to protect themselves',
              'the potential to extract and make use of insects’ genetic codes',
              'the similarities between different species of insect',
              'the manageable size of most insects',
            ],
            answer: 'the potential to extract and make use of insects’ genetic codes',
            alt: ['the variety of substances insects have developed to protect themselves'],
            explanation: BUGS_EXPLAIN.q9,
            locate: [
              { para: 3, text: 'driven the evolution of an enormous range of very interesting compounds for defensive and offensive purposes' },
              { para: 7, text: 'snip out the stretches of the insect’s DNA that carry the codes for the interesting compounds' },
            ],
          },
        ],
      },
      {
        id: 'g3',
        instruction: 'Choose **ONE WORD ONLY** from the passage for each answer.',
        table: {
          title: 'Research at Aberystwyth University',
          summary: true,
          rows: [{ label: '', lines: [{ q: 'q10' }, { q: 'q11' }, { q: 'q12' }, { q: 'q13' }] }],
        },
        questions: [
          {
            id: 'q10',
            type: 'gap-fill',
            prompt: 'Ross Piper and fellow zoologists at Aberystwyth University are using their expertise in ___ when undertaking bioprospecting with insects.',
            answer: 'ecology',
            explanation: BUGS_EXPLAIN.q10,
            locate: [{ para: 6, text: 'we use our knowledge of ecology as a guide to target our efforts' }],
          },
          {
            id: 'q11',
            type: 'gap-fill',
            prompt: 'They are especially interested in the compounds that insects produce to overpower and preserve their ___.',
            answer: 'prey',
            explanation: BUGS_EXPLAIN.q11,
            locate: [{ para: 6, text: 'secrete powerful poison for subduing prey and keeping it fresh for future consumption' }],
          },
          {
            id: 'q12',
            type: 'gap-fill',
            prompt: 'They are also interested in compounds which insects use to protect themselves from pathogenic bacteria and fungi found in their ___.',
            answer: 'habitats',
            explanation: BUGS_EXPLAIN.q12,
            locate: [
              { para: 6, text: 'masters of exploiting filthy habitats, such as faeces and carcasses' },
              { para: 6, text: 'These insects have many antimicrobial compounds for dealing with pathogenic bacteria and fungi' },
            ],
          },
          {
            id: 'q13',
            type: 'gap-fill',
            prompt: 'Piper hopes that these substances will be useful in the development of drugs such as ___.',
            answer: 'antibiotics',
            explanation: BUGS_EXPLAIN.q13,
            locate: [{ para: 6, text: 'compounds that can serve as or inspire new antibiotics' }],
          },
        ],
      },
    ],
    vocab: [],
  },
]
