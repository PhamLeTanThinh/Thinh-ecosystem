// Một thuật ngữ/kĩ thuật được highlight trong 1 phần của paper, kèm giải thích.
export interface PaperTerm {
  term: string
  explain: string
}

// Một phần nội dung của paper (Background, Methods, Results, ...) kèm giải thích + thuật ngữ.
export interface PaperHighlightSection {
  heading: string
  explanation: string
  terms?: PaperTerm[]
  // Trang PDF (1-based) tương ứng với phần này — dùng để đồng bộ scroll PDF khi hover mục này.
  page?: number
}

export interface ResearchPaper {
  slug: string
  title: string
  authors: string
  year: number
  venue: string
  // Lĩnh vực của paper — dùng để lọc ở trang danh sách. 1 paper có thể thuộc nhiều lĩnh vực.
  fields: string[]
  // Ghi chú/tóm tắt — đặt chỗ, điền khi đọc xong.
  summary: string
  // DOI của paper, dùng để build link nguồn/pdf nếu không khai báo riêng.
  doi?: string
  // Link trang bài báo gốc (nơi công bố).
  sourceUrl?: string
  // Link tải/xem PDF trực tiếp — dùng để nhúng ở cột đọc PDF.
  pdfUrl?: string
  // Số lượt trích dẫn, lấy từ Google Scholar/nguồn khác — kèm thời điểm đo để biết là số cũ.
  citationCount?: number
  citationAsOf?: string
  citationSource?: string
  // Highlight kĩ thuật/thuật ngữ theo từng phần — chỉ điền khi đã đọc kĩ, không tạo rỗng.
  highlights?: PaperHighlightSection[]
}

// Skeleton — paper đặt chỗ, chưa có ghi chú thật. Thêm paper mới bằng cách khai báo thêm 1 mục ở đây.
export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    slug: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    authors: 'Vaswani et al.',
    year: 2017,
    venue: 'NeurIPS',
    fields: ['NLP', 'Deep Learning'],
    summary: 'Ghi chú đang cập nhật.',
  },
  {
    slug: 'bert',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    authors: 'Devlin et al.',
    year: 2018,
    venue: 'NAACL',
    fields: ['NLP', 'Deep Learning'],
    summary: 'Ghi chú đang cập nhật.',
  },
  {
    slug: 'drug-identification-deep-learning-taiwan',
    title: 'A drug identification model developed using deep learning technologies: experience of a medical center in Taiwan',
    authors: 'Ting HW, Chung SL, Chen CF, Chiu HY, Hsieh YW',
    year: 2020,
    venue: 'BMC Health Services Research 20:312',
    fields: ['Computer Vision', 'Healthcare AI', 'Deep Learning'],
    doi: '10.1186/s12913-020-05166-w',
    sourceUrl: 'https://doi.org/10.1186/s12913-020-05166-w',
    // File PDF gốc (open access, CC BY 4.0), host local (src/data/papers/) và serve qua API route
    // (/api/papers/<slug> — không đuôi .pdf) để tránh bị trình quản lý tải xuống chộp request ngầm.
    pdfUrl: '/api/papers/drug-identification-deep-learning-taiwan',
    citationCount: 96,
    citationAsOf: '2026-09-20',
    citationSource: 'Google Scholar',
    summary:
      'Xây dựng mô hình DLDI (Deep Learning Drug Identification) dùng YOLO v2 để nhận diện 250 loại thuốc vỉ (blister package) qua ảnh mặt trước/mặt sau, nhằm ngăn lỗi phát thuốc do "look-alike and sound-alike" (LASA). Mô hình mặt sau đạt F1 95.99%, tốt hơn mặt trước (93.72%) vì mặt sau có chữ/logo phân biệt rõ hơn màu-hình viên thuốc.',
    highlights: [
      {
        heading: 'Background — Vấn đề LASA và các giải pháp hiện có',
        page: 2,
        explanation:
          'Lỗi phát thuốc là một trong những vấn đề an toàn y tế quan trọng nhất, mà nguyên nhân phổ biến nhất là yếu tố con người (mệt mỏi, thiếu kiến thức) — trong đó "trông giống nhau, đọc giống nhau" (LASA) là lỗi hàng đầu. Một chính sách hay được dùng để ngăn LASA là đổi tên thuốc/bao bì; cũng có nghiên cứu dùng chart review + phương pháp toán học để tự động phát hiện các cặp tên thuốc dễ gây nhầm lẫn. Các giải pháp phần cứng hiện có (ADC, RFID, mã vạch, robot) tốn không gian, cần thiết bị phụ trợ, hoặc chưa đủ chính xác — đặc biệt các bệnh viện dưới 100 giường thường không đủ robot. Vì vậy nhóm tác giả chọn hướng tiếp cận thuần ảnh (image-based): không xâm lấn, không cần gắn thêm thiết bị lên từng vỉ thuốc hay tốn không gian kho dược.',
        terms: [
          { term: 'LASA (Look-Alike Sound-Alike)', explain: 'Hai loại thuốc có bao bì/tên gọi dễ nhầm lẫn với nhau — nguyên nhân hàng đầu gây lỗi phát thuốc ở dược sĩ/bác sĩ.' },
          { term: 'ADC (Automated Dispensing Cabinet)', explain: 'Tủ thuốc tự động phát thuốc theo toa, một giải pháp phần cứng để giảm lỗi con người khi lấy thuốc.' },
          { term: 'RFID', explain: 'Công nghệ nhận diện qua sóng vô tuyến, dùng để định vị/xác nhận vị trí thuốc trong một số hệ thống ADC.' },
        ],
      },
      {
        heading: 'Related work — Từ thị giác máy tính truyền thống tới Deep Learning',
        page: 2,
        explanation:
          'Trước deep learning, các nghiên cứu nhận diện vỉ thuốc dựa vào đặc trưng thủ công (hand-crafted feature): Lee et al. mã hoá màu/hình dạng thành histogram 3D + ma trận hình học, còn chữ khắc trên viên thuốc thì mã hoá qua SIFT + MLBP; Taran et al. kết hợp nhiều loại đặc trưng thủ công khác nhau để nhận diện bao bì dược phẩm; Saitoh dùng local feature + nearest-neighbor rồi xếp hạng theo voting score. Điểm chung: đặc trưng phải do con người tự định nghĩa trước (subjective), và các nghiên cứu này chỉ đạt dưới 80% độ chính xác với dưới 50 loại thuốc — giới hạn rõ khi mở rộng quy mô. Deep learning tạo ra bước ngoặt vì mạng tự học đặc trưng phân biệt trực tiếp từ dữ liệu, không cần con người định nghĩa trước, và quá trình học này khá giống cách não người nhận diện — đây cũng là lý do nhóm tác giả dùng chính mô hình để giải thích vì sao con người hay nhầm lẫn 1 số cặp thuốc.',
        terms: [
          { term: 'Hand-crafted feature (đặc trưng thủ công)', explain: 'Đặc trưng ảnh do con người tự định nghĩa và lập trình (màu, cạnh, hình dạng...) trước khi đưa vào bộ phân loại — khác với deep learning, nơi mạng tự học đặc trưng từ dữ liệu.' },
          { term: 'SIFT (Scale Invariant Feature Transform)', explain: 'Thuật toán trích đặc trưng ảnh không đổi khi ảnh bị xoay/co giãn/đổi góc nhìn — dùng để mã hoá chữ khắc trên viên thuốc trong các nghiên cứu trước deep learning.' },
          { term: 'MLBP (Multi-scale Local Binary Pattern)', explain: 'Biến thể của Local Binary Pattern trích đặc trưng texture (vân bề mặt) ở nhiều tỉ lệ khác nhau — kết hợp với SIFT để mô tả chữ khắc trên thuốc.' },
        ],
      },
      {
        heading: 'Methods — Thu thập dữ liệu ảnh',
        page: 3,
        explanation:
          'Ban đầu có 272 loại thuốc từ khoa Ngoại trú (OPD), nhưng 6 kiểu đóng gói không phải vỉ (túi zip, gói bột, túi giấy bạc, túi trong suốt, gói giấy, chai — tổng 32 loại) bị loại vì nghiên cứu chỉ tập trung vào vỉ thuốc (blister package), còn lại đúng 250 loại. Với mỗi loại, camera chụp cố định từ 9 góc khác nhau, mỗi góc xoay vỉ thuốc theo 8 hướng → 72 ảnh/mặt, nhân cho cả mặt trước và mặt sau → tổng 36.000 ảnh làm dữ liệu train cho deep learning. Ảnh mặt trước thể hiện hình dạng/màu viên thuốc (thấy được qua vỉ nhựa trong), ảnh mặt sau thể hiện chữ in/logo công ty dược (in trên lớp nhôm) — đây là 2 nguồn thông tin bản chất khác nhau, nên nhóm tác giả train thành 2 model hoàn toàn riêng biệt để so sánh xem nguồn nào phân biệt thuốc tốt hơn.',
        terms: [
          { term: 'Blister package (vỉ thuốc)', explain: 'Dạng đóng gói thuốc phổ biến nhất trong nghiên cứu — vỉ nhôm/nhựa chứa các viên thuốc, có cả mặt trước (thấy viên thuốc) và mặt sau (thấy chữ in, logo).' },
        ],
      },
      {
        heading: 'Methods — Kiến trúc CNN & YOLO',
        page: 4,
        explanation:
          'Dùng YOLO v2 (You Only Look Once) — một kiến trúc CNN gộp chung việc "định vị vùng chứa vật thể" (detection) và "phân loại" (classification) vào một mạng duy nhất, nên tốc độ nhanh hơn nhiều so với R-CNN/Fast R-CNN (vốn tách rời 2 bước này). YOLO v2 cải tiến so với YOLO gốc nhờ 5 kỹ thuật: batch normalization (chuẩn hoá theo batch giúp mạng hội tụ nhanh hơn), passthrough (giữ lại đặc trưng chi tiết từ layer nông hơn để nhận diện vật thể nhỏ tốt hơn), hi-res classifier (tăng độ phân giải ảnh huấn luyện để tăng độ chính xác), direct location prediction (dự đoán toạ độ bounding box trực tiếp, ổn định hơn cách cũ) và multi-scale training (train xen kẽ nhiều kích thước ảnh để vừa nhanh vừa chính xác). Trong nghiên cứu này: ảnh resize về 224×224, KHÔNG dùng data augmentation, KHÔNG pre-train, batch size 8, train tối đa 100 epoch, lưu trọng số sau mỗi epoch — chạy trên Darknet (trong cấu trúc Caffe) với GPU NVIDIA GTX 1080 + CPU Intel i7-6770 8 nhân + 16GB RAM.',
        terms: [
          { term: 'CNN (Convolutional Neural Network)', explain: 'Mạng nơ-ron dùng lớp tích chập (convolution) + gộp (pooling) để tự học đặc trưng ảnh, thay vì phải định nghĩa đặc trưng thủ công như thị giác máy tính truyền thống.' },
          { term: 'YOLO (You Only Look Once)', explain: 'Framework object detection "một lượt duy nhất": dự đoán vị trí (bounding box) và nhãn lớp cùng lúc trong một forward pass, nên nhanh và phù hợp ứng dụng thời gian thực như camera tại tủ thuốc.' },
          { term: 'R-CNN / Fast / Faster R-CNN', explain: 'Dòng kiến trúc object detection ra đời trước YOLO, tách rời bước đề xuất vùng (region proposal) và bước phân loại nên chậm hơn YOLO dù độ chính xác tương đương.' },
          { term: 'Batch normalization', explain: 'Kỹ thuật chuẩn hoá đầu ra của mỗi lớp theo từng batch dữ liệu, giúp mạng huấn luyện ổn định và hội tụ nhanh hơn — một trong 5 cải tiến của YOLO v2 so với bản gốc.' },
          { term: 'Passthrough layer', explain: 'Kỹ thuật nối đặc trưng từ một layer nông (còn giữ chi tiết nhỏ) sang layer sâu hơn, giúp YOLO v2 nhận diện tốt hơn các vật thể/chi tiết kích thước nhỏ.' },
          { term: 'Multi-scale training', explain: 'Huấn luyện xen kẽ với nhiều kích thước ảnh đầu vào khác nhau trong cùng 1 quá trình train, giúp mô hình vừa nhanh vừa chính xác ở nhiều độ phân giải.' },
          { term: 'Epoch', explain: 'Một lượt mạng học đi qua toàn bộ tập dữ liệu train một lần. Bài báo train tối đa 100 epoch và chọn model tốt nhất theo F1 score kèm ít epoch nhất.' },
          { term: 'Data augmentation', explain: 'Kỹ thuật tạo thêm ảnh train (xoay, crop, đổi màu...) để tăng dữ liệu. Nghiên cứu này KHÔNG dùng augmentation, nghĩa là kết quả hoàn toàn dựa trên dữ liệu ảnh thật đã chụp.' },
          { term: 'Darknet / Caffe', explain: 'Framework deep learning được dùng để cài đặt và huấn luyện YOLO v2 trong nghiên cứu, chạy trên GPU NVIDIA GTX 1080.' },
        ],
      },
      {
        heading: 'Experimental design — Chia tập train/test',
        page: 4,
        explanation:
          'Với MỖI model (mặt trước hoặc mặt sau riêng biệt), 3/4 số ảnh mỗi loại thuốc (54/72 ảnh) được đưa vào tập train, 1/4 còn lại (18/72 ảnh) vào tập test — ngẫu nhiên, không lặp lại. Kết quả: 13.500 ảnh train và 4.500 ảnh test cho mỗi model. Toàn bộ ảnh chuẩn hoá theo cùng 1 giao thức YOLO v2: kích thước 224×224px, batch size 8 (cập nhật trọng số mỗi 8 ảnh), train tối đa 100 epoch tương đương 168.800 iteration, lưu file trọng số sau mỗi epoch (1.688 iteration) để có thể chọn lại checkpoint tốt nhất thay vì chỉ giữ epoch cuối cùng.',
        terms: [
          { term: 'Train/test split', explain: 'Cách chia dữ liệu thành tập huấn luyện (để mạng học) và tập kiểm tra (để đánh giá, mạng chưa từng thấy) — ở đây tỉ lệ là 75%/25% cho mỗi loại thuốc.' },
          { term: 'Iteration', explain: 'Một lần cập nhật trọng số mạng dựa trên 1 batch dữ liệu (ở đây batch size = 8 ảnh). 1 epoch = số iteration đủ để duyệt hết tập train 1 lần.' },
        ],
      },
      {
        heading: 'Outcome measurement — Cách đánh giá mô hình',
        page: 5,
        explanation:
          'Dùng ma trận nhầm lẫn (confusion matrix) để xem thuốc nào hay bị đoán nhầm thành thuốc nào — đường chéo là số lần đoán đúng, các ô ngoài đường chéo là các cặp thuốc bị nhầm. Ví dụ minh hoạ trong bài: giả sử có 28 thuốc gồm 9 thuốc A, 6 thuốc B, 13 thuốc C — trong 9 thuốc A thực tế, có 3 lần bị đoán nhầm thành B; trong 6 thuốc B, có 2 lần nhầm thành A và 1 lần nhầm thành C; còn 13 thuốc C thì đoán đúng gần như tuyệt đối (chỉ 1 lần bị đoán thành B). Kết luận từ ví dụ: A và B rất dễ nhầm lẫn với nhau (nhầm 2 chiều), trong khi C dễ phân biệt với cả A lẫn B. Từ ma trận này tính ra Precision, Recall và F1 score làm tiêu chí chính để so sánh 2 mô hình (mặt trước vs mặt sau).',
        terms: [
          { term: 'Confusion matrix', explain: 'Bảng đối chiếu nhãn thật vs nhãn dự đoán; đường chéo là đoán đúng, các ô ngoài đường chéo là các cặp thuốc dễ bị nhầm lẫn với nhau.' },
          { term: 'Precision', explain: 'Trong số các lần mô hình nói "đây là thuốc X", bao nhiêu % thực sự đúng là thuốc X. Precision = TP / (TP + FP).' },
          { term: 'Recall (Sensitivity)', explain: 'Trong số các lần thuốc X thực sự xuất hiện, mô hình nhận ra được bao nhiêu %. Recall = TP / (TP + FN).' },
          { term: 'F1 score', explain: 'Trung bình điều hoà (harmonic mean) của Precision và Recall — cân bằng cả hai chỉ số, dùng làm thước đo chính để chọn model tốt nhất trong bài.' },
        ],
      },
      {
        heading: 'Results — Mặt sau thắng mặt trước',
        page: 5,
        explanation:
          'Model mặt sau (texture + logo công ty dược) đạt Precision 96.26%, Recall 96.63%, F1 95.99%, train trong 7h42p / 65 epoch. Model mặt trước (hình dạng + màu viên thuốc) chỉ đạt F1 93.72%, train nhanh hơn (5h34p / 60 epoch) nhưng kém chính xác hơn vì nhiều viên thuốc trùng màu/hình dạng. F1 tăng nhanh rồi bão hoà (plateau) sau khoảng epoch 8-10, cho cả 2 model. So với các nghiên cứu trước dùng thị giác máy tính truyền thống (thường dưới 80% độ chính xác và chỉ thử nghiệm với dưới 50 loại thuốc), kết quả trên 90% với tận 250 loại thuốc là một bước tiến đáng kể — cho thấy deep learning không chỉ chính xác hơn mà còn mở rộng quy mô tốt hơn nhiều so với cách tiếp cận đặc trưng thủ công.',
        terms: [{ term: 'Plateau (bão hoà)', explain: 'Giai đoạn F1 score không tăng thêm dù train thêm epoch — dấu hiệu mô hình đã học gần hết thông tin phân biệt được từ dữ liệu hiện có.' }],
      },
      {
        heading: 'Discussion — Những cặp thuốc bị nhầm cụ thể',
        page: 6,
        explanation:
          'Từ ma trận nhầm lẫn thực tế, nhóm tác giả liệt kê 4 cặp thuốc hay bị model nhận nhầm nhất — và điều thú vị là đây cũng chính là những cặp mà DƯỢC SĨ/CON NGƯỜI cũng hay nhầm, cho thấy CNN "nhìn nhầm" theo cách khá giống mắt người. Ở model mặt trước: RITALIN (Methylphenidate) bị nhầm với amBROXOL (MUSCO), và ATENOLOL (Urosin) bị nhầm với Dihydroergotoxine — cả 2 cặp đều do viên thuốc trên mặt trước có cùng màu và hình dạng. Ở model mặt sau: Ciprofloxacin bị nhầm với URSOdeoxycholic acid, và Alprazolam bị nhầm với Rivotril (Clonazepam) — nguyên nhân khác hẳn: mặt sau của các vỉ này đều bọc nhôm cùng màu và chữ in không đủ khác biệt để phân biệt.',
        terms: [
          { term: 'RITALIN vs amBROXOL', explain: 'Cặp thuốc bị nhầm ở model mặt trước — Methylphenidate (RITALIN) và amBROXOL (MUSCO) có viên thuốc cùng màu/hình dạng khi nhìn qua vỉ nhựa trong.' },
          { term: 'Ciprofloxacin vs URSOdeoxycholic acid', explain: 'Cặp thuốc bị nhầm ở model mặt sau — do mặt sau 2 vỉ này đều bọc nhôm cùng tông màu, chữ in không đủ tương phản để phân biệt.' },
        ],
      },
      {
        heading: 'Hạn chế & hướng phát triển',
        page: 7,
        explanation:
          'Nhóm tác giả nêu 3 hạn chế chính. Thứ nhất, mô hình chỉ nhận diện được vỉ thuốc CÒN NGUYÊN VẸN — không dùng được khi vỉ bị cầm trên tay hoặc đã bị cắt rời từng viên, và một số thuốc có kích thước/hình dạng quá giống nhau nên vẫn khó nhận diện. Thứ hai, thời gian train còn khá dài (hơn 5 tiếng cho mỗi model), và sẽ còn lâu hơn nữa nếu sau này dùng thêm nhiều loại phổ ảnh khác nhau. Thứ ba, mỗi khi bệnh viện thêm hoặc đổi 1 loại thuốc mới, hệ thống phải TRAIN LẠI TOÀN BỘ 250 lớp thay vì chỉ học riêng phần mới — nhóm tác giả đề xuất hướng tương lai là "partial training" (chỉ huấn luyện lại phần mạng liên quan tới thuốc thay đổi). Hướng phát triển khác được đề cập: kết hợp cả 2 mặt (trước + sau) vào cùng 1 model duy nhất thay vì tách riêng, dùng ảnh 3D hoặc đa phổ (multi-spectrum) để tăng độ chính xác, và tích hợp mô hình vào tủ thuốc tự động (ADC) hoặc robot dược — chỉ cần 1-2 camera là có thể áp dụng vào thực tế để ngăn lỗi phát thuốc.',
        terms: [
          { term: 'Partial training', explain: 'Ý tưởng tương lai: chỉ huấn luyện lại phần mạng liên quan đến thuốc mới thêm/đổi, thay vì phải train lại từ đầu toàn bộ 250 lớp khi danh mục thuốc thay đổi.' },
          { term: 'Multi-spectrum imaging (ảnh đa phổ)', explain: 'Chụp ảnh ở nhiều dải bước sóng ánh sáng khác nhau (không chỉ ánh sáng thường) để thu thêm thông tin phân biệt — một hướng cải tiến độ chính xác được đề xuất cho tương lai.' },
        ],
      },
    ],
  },
]

export function getResearchPaper(slug: string): ResearchPaper | undefined {
  return RESEARCH_PAPERS.find((p) => p.slug === slug)
}
