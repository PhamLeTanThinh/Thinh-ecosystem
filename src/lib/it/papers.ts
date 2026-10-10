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
  {
    slug: 'assistive-robot-drug-identification-machine-vision',
    title: 'Assistive Robot Capable of Drug Identification Based on Machine Vision',
    authors: 'Atienza DJ, Cacanindin MEC, Yumang AN',
    year: 2025,
    venue: 'Imaging, Signal Processing and Communications — Advances in Transdisciplinary Engineering vol. 78 (IOS Press), pp. 75–86',
    fields: ['Computer Vision', 'Healthcare AI', 'Robotics', 'Deep Learning'],
    doi: '10.3233/ATDE251132',
    sourceUrl: 'https://doi.org/10.3233/ATDE251132',
    // Open access (CC BY-NC 4.0), host local giống paper DLDI.
    pdfUrl: '/api/papers/assistive-robot-drug-identification-machine-vision',
    summary:
      'Robot hỗ trợ (assistive robot) gồm cánh tay JetMax + NVIDIA Jetson Nano + camera HD góc rộng, chạy YOLOv5s (TensorRT) để nhận diện 20 loại thuốc trong vỉ đã cắt rời (trimmed blister pack) qua ảnh mặt sau, rồi dùng giác hút gắp thuốc bỏ vào 1 trong 4 hộp theo nhóm công dụng. Machine vision đạt accuracy 90.67% (630 lượt test thời gian thực, gồm cả lớp "No Object"); cả hệ thống nhận diện + gắp-thả thành công 83.17% (499/600) — lỗi chủ yếu do cơ khí (vỉ nhỏ, hình dạng khác nhau khiến giác hút gắp trượt) chứ không phải do nhận diện.',
    highlights: [
      {
        heading: 'Bối cảnh — Vì sao cần robot phân loại thuốc',
        page: 1,
        explanation:
          'Động lực xuất phát từ dân số Philippines: tỉ lệ người từ 60 tuổi trở lên tăng từ 6.7% (2010) lên 11.4% (2030), trong khi nhóm 0–14 tuổi chiếm 26.8% — tức cả 2 nhóm cần chăm sóc nhiều đều lớn, gây áp lực lên nguồn lực y tế vốn hạn chế. Machine vision là "mắt" của robot: chụp ảnh rồi trích thông tin (màu, hình học, độ sâu, vật thể 3D) để robot hành động. Nhóm tác giả đặt bài toán trong mảng Assistive Robot — robot hỗ trợ con người (đặc biệt người già) trong sinh hoạt và chăm sóc y tế. Hiện người chăm sóc và bệnh nhân vẫn chủ yếu chia thuốc bằng tay; máy chia thuốc tự động (Automatic Tablet Dispensing Machine) có giảm lỗi nhưng vẫn còn lỗi khi nạp thuốc và lỗi do con người.',
        terms: [
          { term: 'Machine Vision', explain: 'Hệ thống thị giác cho máy: camera chụp ảnh + thuật toán xử lý để trích thông tin (màu, hình dạng, vị trí, độ sâu) phục vụ một tác vụ cụ thể — ở đây là cho robot biết thuốc gì và nằm ở đâu.' },
          { term: 'Assistive Robot (robot hỗ trợ)', explain: 'Robot được thiết kế để giúp con người làm các việc hằng ngày hoặc chăm sóc sức khoẻ — ví dụ chia thuốc, nhắc uống thuốc, hỗ trợ người già/người khuyết tật.' },
          { term: 'Socially Assistive Robot', explain: 'Nhánh của assistive robot tập trung vào tương tác xã hội (trò chuyện, nhắc nhở, đồng hành) — được nhắc đến như hướng đang nghiên cứu nhiều trong chăm sóc người già.' },
        ],
      },
      {
        heading: 'Related work & khoảng trống nghiên cứu',
        page: 2,
        explanation:
          'Phần tổng quan điểm qua rất nhiều ứng dụng machine vision (phân loại hạt cà phê lỗi, độ chín cà chua, ấu trùng muỗi, nhận diện cá, OCR nhãn ổ cứng...) và kết luận rằng các detector deep learning như YOLO và RetinaNet nhận diện thuốc tốt, nhanh và chính xác hơn SSD. Từ đó, bài báo chỉ ra 3 khoảng trống mà nghiên cứu này muốn lấp: (1) hệ thống robot + vision hiện có kém linh hoạt, chỉ lọc theo ít tiêu chí; (2) đa số dùng góc khớp cố định (preset joint angles) cho cánh tay — vật phải nằm ĐÚNG vị trí định sẵn thì mới gắp được; (3) các model YOLO nhận diện thuốc trước đây chỉ dựa vào chữ khắc trên viên, hình dạng, màu, hoặc nguyên cả vỉ — chưa ai xử lý vỉ đã bị CẮT RỜI (trimmed), vốn là dạng rất phổ biến khi chia thuốc lẻ cho người bệnh. Lưu ý khi đọc: phần này khá dàn trải (nhiều ví dụ không liên quan trực tiếp tới thuốc) và có chỗ số trích dẫn không khớp danh mục tài liệu — ví dụ so sánh RetinaNet/SSD/YOLOv3 thực ra là tài liệu [10] (Tan et al.) chứ không phải [27][28].',
        terms: [
          { term: 'Preset joint angles', explain: 'Cách điều khiển cánh tay robot bằng các góc khớp đã lập trình sẵn — đơn giản nhưng cứng nhắc, vật phải đặt đúng chỗ. Bài này thay bằng cách tính toạ độ từ ảnh để gắp được vật ở vị trí bất kỳ trong vùng làm việc.' },
          { term: 'RetinaNet / SSD', explain: 'Hai kiến trúc object detection một giai đoạn (one-stage) giống YOLO. RetinaNet nổi tiếng với Focal Loss xử lý mất cân bằng lớp; SSD (Single Shot Detector) nhanh nhưng thường kém chính xác hơn với vật nhỏ.' },
          { term: 'Trimmed blister pack (vỉ cắt rời)', explain: 'Vỉ thuốc đã bị cắt nhỏ thành từng ô/viên — mất phần lớn thông tin in trên vỉ nguyên (tên đầy đủ, logo), nên khó nhận diện hơn vỉ nguyên. Đây chính là hạn chế mà paper DLDI (Taiwan) thừa nhận chưa xử lý được.' },
        ],
      },
      {
        heading: 'Mục tiêu & phạm vi nghiên cứu',
        page: 3,
        explanation:
          'Ba mục tiêu cụ thể: (1) dùng cánh tay JetMax + camera HD góc rộng tích hợp sẵn + Jetson Nano để đưa viên thuốc đã nhận diện tới đúng vị trí; (2) dùng YOLO để phát hiện và nhận diện thuốc trong vỉ cắt rời; (3) đánh giá hệ thống vision bằng confusion matrix. Phạm vi: 20 loại thuốc phổ biến ở Philippines (Biogesic, Neozep, Advil, Buscopan, Bioflu...), mỗi lần chỉ gắp và giao 1 viên, chỉ dùng đúng bộ phần cứng nói trên, không xử lý các dạng đóng gói khác (chai, gói bột...). Điểm cần để ý khi đọc kĩ: danh sách 20 thuốc ở phần phạm vi có Rosuvastatin và Cetirizine, nhưng ở phần thí nghiệm/kết quả lại là Rosucol (một biệt dược của rosuvastatin) và Askey thay cho Cetirizine — paper không giải thích sự thay đổi này.',
        terms: [
          { term: 'Scope & limitation', explain: 'Phần khoanh vùng những gì nghiên cứu làm và KHÔNG làm — đọc kĩ phần này để biết kết quả áp dụng được tới đâu (ở đây: chỉ vỉ cắt rời, 20 loại, 1 viên/lần).' },
        ],
      },
      {
        heading: 'Conceptual framework & phần cứng',
        page: 4,
        explanation:
          'Khung khái niệm theo mô hình Input → Process → Output. Input là ảnh thời gian thực của vỉ thuốc cắt rời. Process gồm 3 bước nối tiếp: (1) Drug identification — object detection nhận ra loại thuốc; (2) Image-to-arm position mapping — đổi vị trí thuốc trong ảnh (pixel) sang toạ độ thật mà cánh tay hiểu được; (3) Robotic arm control — ra lệnh gắp và thả. Output là thuốc được nhận diện, gắp và đưa vào đúng khu phân loại. Phần cứng: Jetson Nano (CPU ARMv8, RAM 4GB, GPU NVIDIA Tegra X1, CUDA 10.2, Ubuntu 18.04), camera HD tích hợp trên cánh tay, nguồn, màn hình LCD hiển thị kết quả. Phần mềm: Python 3.8 + PyTorch 1.8 để chạy YOLOv5. Điểm đáng chú ý là toàn bộ suy luận chạy ngay trên thiết bị (edge) chứ không gửi ảnh lên server — rẻ, không cần mạng, phù hợp đặt ở nhà hoặc nhà thuốc nhỏ.',
        terms: [
          { term: 'NVIDIA Jetson Nano', explain: 'Máy tính nhúng nhỏ, giá rẻ có GPU (128 nhân Maxwell, Tegra X1) chuyên chạy model AI tại chỗ — đủ mạnh cho YOLO cỡ nhỏ nhưng bộ nhớ chỉ 4GB dùng chung CPU/GPU.' },
          { term: 'Edge AI / edge inference', explain: 'Chạy model ngay trên thiết bị ở hiện trường thay vì trên cloud — giảm độ trễ, không phụ thuộc mạng, bảo mật dữ liệu hơn, nhưng bị giới hạn tài nguyên tính toán.' },
          { term: 'JetMax', explain: 'Cánh tay robot dạng đồ chơi/giáo dục (của Hiwonder) thiết kế sẵn cho Jetson Nano, có camera gắn trên đầu và đầu hút chân không (suction cup).' },
          { term: 'Image-to-world mapping', explain: 'Chuyển toạ độ pixel trong ảnh sang toạ độ thực (mm) trong không gian làm việc của robot — thường cần hiệu chỉnh camera (camera calibration). Paper không mô tả chi tiết cách làm bước này.' },
        ],
      },
      {
        heading: 'System flowchart — Vòng lặp nhận diện → gắp → thả',
        page: 5,
        explanation:
          'Mỗi chu kì gồm các bước: chạy YOLOv5 trên khung hình → lọc bỏ các phát hiện có confidence thấp → tính tâm (x, y) của bounding box → multiple-frame confirmation: chỉ chấp nhận khi cùng 1 loại thuốc xuất hiện ổn định qua nhiều khung hình liên tiếp (tránh hành động theo 1 khung nhận nhầm thoáng qua) → đổi (x, y) sang toạ độ thật → cánh tay di chuyển tới, bật bơm hút để nhấc vỉ → mang tới hộp tương ứng, tắt hút để thả → quay về vị trí mặc định, chờ viên tiếp theo. Đây là phần "kĩ thuật hệ thống" đáng học nhất của bài: 2 lớp lọc (confidence threshold + xác nhận nhiều khung) là cách rẻ mà hiệu quả để biến một detector không hoàn hảo thành hành động vật lý an toàn hơn — vì với robot, 1 lần gắp sai tốn kém hơn nhiều so với 1 khung hình đoán sai.',
        terms: [
          { term: 'Confidence threshold', explain: 'Ngưỡng độ tin cậy: YOLO trả về kèm mỗi box một điểm 0–1; box dưới ngưỡng bị bỏ. Ngưỡng cao → ít nhầm nhưng dễ bỏ sót; ngưỡng thấp → ngược lại.' },
          { term: 'Bounding box', explain: 'Hình chữ nhật bao quanh vật thể mà detector dự đoán, mô tả bằng toạ độ + kích thước. Tâm của box được dùng làm điểm gắp.' },
          { term: 'Multiple-frame confirmation (temporal voting)', explain: 'Chỉ tin kết quả khi nó lặp lại qua N khung hình liên tiếp — một dạng làm mượt theo thời gian để loại nhiễu, rất hay dùng khi detector điều khiển hành động thật.' },
          { term: 'Suction gripper (đầu hút chân không)', explain: 'Bộ gắp dùng lực hút — hợp với vật phẳng nhẹ như vỉ thuốc, nhưng cần bề mặt đủ phẳng và đủ rộng để bám; vỉ cắt quá nhỏ hoặc gồ ghề sẽ dễ trượt (nguyên nhân chính của lỗi cơ khí ở phần kết quả).' },
        ],
      },
      {
        heading: 'Experimental set-up — 4 hộp phân loại theo nhóm công dụng',
        page: 6,
        explanation:
          'Vỉ thuốc đặt trên mặt phẳng nền trắng, camera trên cánh tay quan sát, màn hình cảm ứng hiển thị kết quả nhận diện và trạng thái. Robot không chỉ "nhận ra tên thuốc" mà còn phân loại vào 4 hộp theo nhóm dược lý: Hộp 1 — tim mạch & chuyển hoá (Amlothix, Rosucol, Avator, Glycemet); Hộp 2 — giảm đau, hạ sốt (Biogesic, Mefenamic Acid, Advil, Buscopan, Bioflu); Hộp 3 — ho, cảm, dị ứng (Ascof Forte, Loviscol, Mucosolvan, Neozep, Decolgen Forte, Askey); Hộp 4 — vitamin & thực phẩm bổ sung (Poten-Cee, Fern-C, Xtracee, Vit-Eye, C-Lium Fibre). Nghĩa là model phân 20 lớp, rồi một bảng tra cứu (lookup) map 20 lớp → 4 hộp. Hệ quả thú vị: nhầm 2 thuốc CÙNG hộp (vd Rosucol ↔ Glycemet) không làm sai kết quả phân loại cuối, còn nhầm KHÁC hộp (vd Amlothix ở hộp 1 ↔ Xtracee ở hộp 4) mới thật sự nguy hiểm — paper không phân tích theo góc này.',
        terms: [
          { term: 'Nền trắng cố định (controlled background)', explain: 'Điều kiện chụp được kiểm soát: nền đồng màu, ánh sáng ổn định — giúp model dễ học nhưng làm kết quả lạc quan hơn so với môi trường thật (bàn lộn xộn, ánh sáng thay đổi).' },
        ],
      },
      {
        heading: 'Cấu hình huấn luyện (Table 1)',
        page: 7,
        explanation:
          'Siêu tham số: 100 epoch, batch size 4 (chọn để vừa 4GB RAM của Jetson Nano), ảnh 160×160 px (cân bằng giữa độ chính xác và tốc độ). Model xuất phát từ trọng số pre-trained yolov5s.pt (transfer learning), sau đó được chuyển sang TensorRT engine (last.trt) để chạy thời gian thực trên Jetson. So sánh nhanh: 160×160 là rất nhỏ (YOLOv5 mặc định 640×640) — giúp chạy nhanh trên phần cứng yếu nhưng chi tiết chữ in nhỏ trên mặt sau vỉ dễ bị mất, có thể là một lý do khiến vài thuốc có chữ/màu gần nhau bị nhầm. Paper nói "real-time" nhưng không báo cáo FPS hay độ trễ suy luận — một số liệu quan trọng còn thiếu.',
        terms: [
          { term: 'YOLOv5s', explain: 'Bản "small" của YOLOv5 (Ultralytics, PyTorch) — ít tham số (~7M), nhanh, phù hợp thiết bị nhúng; đánh đổi một chút độ chính xác so với bản m/l/x.' },
          { term: 'Pre-trained model / Transfer learning', explain: 'Bắt đầu từ trọng số đã học trên tập lớn (COCO) rồi fine-tune trên dữ liệu thuốc — cần ít dữ liệu và ít thời gian train hơn train từ đầu. Khác với paper DLDI (Taiwan) vốn KHÔNG pre-train.' },
          { term: 'TensorRT', explain: 'Bộ tối ưu suy luận của NVIDIA: gộp layer, giảm độ chính xác số (FP16/INT8), chọn kernel tối ưu cho đúng GPU — giúp model chạy nhanh hơn nhiều lần trên Jetson so với PyTorch thuần.' },
          { term: 'Batch size', explain: 'Số ảnh xử lý trong 1 lần cập nhật trọng số. Batch nhỏ (4) tốn ít bộ nhớ nhưng gradient nhiễu hơn, train chậm/kém ổn định hơn.' },
        ],
      },
      {
        heading: 'Dataset — 5.760 ảnh mặt sau vỉ cắt rời',
        page: 7,
        explanation:
          'Bộ dữ liệu tự xây: 20 lớp × 288 ảnh MẶT SAU (back model) = 5.760 ảnh, gán nhãn bằng LabelImg. Vì dữ liệu ít, nhóm dùng offline augmentation (scale, lật, chỉnh contrast) để tăng đa dạng và giảm overfitting, rồi chia train/validation 80/20. Việc chọn mặt sau khớp với kết luận của paper DLDI (Taiwan): mặt sau có chữ in/logo nên phân biệt tốt hơn mặt trước. Hai điểm cần đọc phản biện: (1) paper không nói rõ 5.760 là số ảnh TRƯỚC hay SAU augmentation; (2) nếu augmentation offline được làm TRƯỚC khi chia 80/20, các bản biến đổi của cùng 1 ảnh gốc có thể rơi vào cả train lẫn validation → data leakage, khiến chỉ số validation đẹp hơn thực tế. May là đánh giá chính của bài dùng test thời gian thực riêng (không phải tập validation), nên kết quả cuối ít bị ảnh hưởng hơn.',
        terms: [
          { term: 'LabelImg', explain: 'Công cụ mã nguồn mở để vẽ bounding box và gán nhãn ảnh, xuất ra định dạng YOLO/Pascal VOC — công cụ gán nhãn phổ biến cho các dự án detection nhỏ.' },
          { term: 'Offline vs online augmentation', explain: 'Offline: tạo sẵn ảnh biến đổi, lưu thành file và thêm vào dataset. Online: biến đổi ngẫu nhiên mỗi lần nạp ảnh khi train (YOLOv5 mặc định đã có mosaic, HSV, flip...). Offline dễ gây leakage nếu chia tập sau khi augment.' },
          { term: 'Overfitting', explain: 'Model học thuộc dữ liệu train (kể cả nhiễu) nên đạt điểm cao trên train nhưng kém trên dữ liệu mới. Augmentation và pre-training là 2 cách giảm overfitting khi dữ liệu ít.' },
          { term: 'Data leakage', explain: 'Thông tin của tập đánh giá "lọt" vào tập train (vd ảnh gần như trùng nhau ở cả hai bên), khiến chỉ số đánh giá cao giả tạo.' },
        ],
      },
      {
        heading: 'Kết quả 1 — Machine vision: 90.67% accuracy',
        page: 8,
        explanation:
          'Test thời gian thực: mỗi lớp 30 lượt, thêm lớp "No Object" (không có thuốc) → 21 × 30 = 630 lượt. 7 lớp đạt 100% (Avator, Bioflu, Ascof Forte, Mucosolvan, Neozep, Decolgen Forte, Fern-C). Yếu nhất: Amlothix 60% (18/30 — nhầm chủ yếu với Xtracee và Mefenamic Acid), Advil 73.33%, Vit-Eye 76.67%, Xtracee 80% (nhầm ngược lại với Amlothix) — cặp Amlothix ↔ Xtracee nhầm 2 chiều, giống hiện tượng "cặp LASA" trong paper DLDI. Rosucol và Glycemet mỗi loại sai 5 lượt (83.33%). "No Object" đúng 28/30 (93.33%) — tức 2 lần model "thấy" thuốc trong khi không có gì, với robot đây là lỗi đáng lo vì sẽ khiến cánh tay gắp vào khoảng trống. Tự kiểm lại: tổng số dự đoán đúng là 571/630 = 90.63% (hoặc 543/600 = 90.5% nếu bỏ lớp No Object), hơi lệch so với con số 90.67% công bố — chênh nhỏ, có thể do làm tròn, nhưng là ví dụ cho thấy nên luôn tự cộng lại bảng số liệu khi đọc paper.',
        terms: [
          { term: 'Accuracy (độ chính xác)', explain: 'Số dự đoán đúng / tổng số lượt. Dễ hiểu nhưng che mất kiểu lỗi — paper chỉ báo accuracy, không báo precision/recall/F1 hay mAP như các paper detection thường làm.' },
          { term: 'Multi-class confusion matrix', explain: 'Ma trận 21×21 (20 thuốc + No Object): hàng là nhãn thật, cột là nhãn dự đoán. Đọc các ô ngoài đường chéo để biết cặp thuốc nào hay bị lẫn.' },
          { term: 'Negative class ("No Object")', explain: 'Lớp "không có gì" để kiểm tra model có ảo giác thấy vật thể khi khung hình trống không — rất quan trọng với hệ thống điều khiển robot.' },
          { term: 'mAP (mean Average Precision)', explain: 'Thước đo chuẩn của object detection, xét cả độ đúng nhãn lẫn độ khớp vị trí box (IoU). Paper không báo mAP nên khó so sánh trực tiếp với các nghiên cứu detection khác.' },
        ],
      },
      {
        heading: 'Kết quả 2 — Robot + vision: 83.17% thành công trọn vẹn',
        page: 10,
        explanation:
          'Đánh giá cả hệ thống trên 600 lượt có thuốc, chia 4 kết quả: gắp thành công + nhận diện đúng 499 (83.17%); gắp được nhưng nhận diện sai 34 (5.67%); nhận diện đúng nhưng gắp trượt 44 (7.33%); cả gắp lẫn nhận diện đều hỏng 23 (3.83%) — cộng lại đúng 600. Thêm 30 lượt "No Operation" (không có thuốc, robot đúng là không làm gì) đều đúng; paper ghi 5% vì chia cho 600, thực chất là 30/30 = 100%. Tách riêng 2 thành phần cho dễ hiểu: độ chính xác nhận diện trong bài test này = (499 + 44)/600 = 90.5% (khớp với kết quả 1); tỉ lệ gắp thành công = (499 + 34)/600 = 88.83%. Nghĩa là gần 1/9 lần gắp thất bại — lỗi cơ khí là nút thắt lớn ngang lỗi vision. Nguyên nhân tác giả nêu: kích thước và hình dạng vỉ cắt rời không đồng đều nên đầu hút không bám chắc. Đáng tiếc là paper không phân tích lỗi gắp theo từng loại thuốc (vỉ nào nhỏ/gồ ghề) để chứng minh nhận định này.',
        terms: [
          { term: 'Pick-and-place', explain: 'Tác vụ robot cơ bản: tới vị trí vật → gắp → di chuyển → thả ở vị trí đích. Thành công phụ thuộc cả độ chính xác toạ độ (vision + calibration) lẫn cơ cấu gắp.' },
          { term: 'End-to-end system accuracy', explain: 'Độ chính xác khi tính cả chuỗi (nhận diện ĐÚNG và gắp-thả ĐÚNG) — luôn thấp hơn hoặc bằng độ chính xác của từng khâu, vì lỗi các khâu cộng dồn.' },
          { term: 'Failure mode analysis', explain: 'Tách lỗi theo nguyên nhân (vision sai / cơ khí sai / cả hai) để biết nên cải tiến khâu nào trước — Table 3 của bài là một dạng phân tích này.' },
        ],
      },
      {
        heading: 'Kết luận & hướng phát triển',
        page: 11,
        explanation:
          'Tác giả kết luận đã đạt cả 3 mục tiêu: robot nhận diện (90.67%) và phân loại vỉ thuốc cắt rời (83.17% trọn vẹn), cho thấy tiềm năng tự động hoá việc phân loại/cấp phát thuốc. Hạn chế thừa nhận: lỗi cơ khí do kích thước và đặc điểm vỉ cắt rời khác nhau. Ba hướng tương lai: (1) mở rộng dataset với nhiều điều kiện ánh sáng, che khuất (occlusion), biến thể vật thể để tăng độ bền vững (robustness); (2) thử các model deep learning mạnh hơn hoặc phương pháp lai (hybrid) để tăng độ chính xác; (3) đánh giá trong môi trường lâm sàng thật để tìm vấn đề khi triển khai.',
        terms: [
          { term: 'Robustness (độ bền vững)', explain: 'Khả năng model giữ hiệu năng khi điều kiện thay đổi (ánh sáng, góc chụp, nền, vật bị che) — điểm yếu thường gặp của model chỉ train/test trong phòng thí nghiệm.' },
          { term: 'Occlusion (che khuất)', explain: 'Vật thể bị vật khác che một phần — vd nhiều vỉ chồng lên nhau hoặc tay người che. Bài chỉ test 1 vỉ/lần trên nền trống nên chưa gặp trường hợp này.' },
        ],
      },
      {
        heading: 'Đọc phản biện — Điểm mạnh, điểm yếu',
        page: 11,
        explanation:
          'Điểm mạnh: (1) một hệ thống HOÀN CHỈNH từ nhận diện tới hành động vật lý, chạy hoàn toàn trên thiết bị nhúng giá rẻ — vượt khỏi mức "chỉ phân loại ảnh" của nhiều paper khác; (2) giải quyết đúng ca khó là vỉ cắt rời; (3) có lớp No Object và bảng tách lỗi vision/cơ khí — cách đánh giá hợp lí cho robot. Điểm yếu: (1) quy mô nhỏ — 20 lớp, so với 250 lớp của paper DLDI; (2) chỉ báo accuracy, thiếu precision/recall/F1/mAP và không có baseline để so sánh (vd YOLOv8, SSD, hay chính YOLOv5 ở 640px); (3) không báo FPS/độ trễ dù nhấn mạnh "real-time"; (4) môi trường test được kiểm soát (nền trắng, 1 vỉ/lần) nên 90% có thể giảm khi ra thực tế; (5) không mô tả cách hiệu chỉnh pixel → toạ độ thật, ngưỡng confidence hay số khung hình xác nhận — khó tái lập (reproducibility); (6) vài chỗ thiếu nhất quán: abstract ghi 600 lượt nhưng phần kết quả là 630, danh sách thuốc ở phạm vi khác danh sách thí nghiệm, số trích dẫn lệch. Bài học khi đọc: một paper hội nghị ứng dụng có giá trị ở ý tưởng tích hợp hệ thống, nhưng con số cần được đọc kèm điều kiện thí nghiệm.',
        terms: [
          { term: 'Baseline', explain: 'Phương pháp đối chứng để so sánh — không có baseline thì khó biết 90.67% là tốt hay chỉ bình thường với bài toán này.' },
          { term: 'Reproducibility (khả năng tái lập)', explain: 'Người khác đọc paper có làm lại được và ra kết quả tương tự không — cần đủ chi tiết về dữ liệu, siêu tham số, quy trình hiệu chỉnh.' },
          { term: 'Controlled vs in-the-wild evaluation', explain: 'Test trong điều kiện được kiểm soát (phòng lab) vs test ở môi trường thực tế đa dạng — kết quả lab thường cao hơn thực tế.' },
        ],
      },
      {
        heading: 'So sánh với paper DLDI (Taiwan, 2020)',
        page: 11,
        explanation:
          'Hai paper bổ sung cho nhau trong cùng bài toán nhận diện thuốc vỉ. DLDI: YOLOv2, 250 lớp, 36.000 ảnh (cả mặt trước lẫn mặt sau, vỉ NGUYÊN), không pre-train, không augmentation, train trên GPU desktop GTX 1080, chỉ nhận diện; F1 mặt sau 95.99%. Paper này: YOLOv5s pre-trained, 20 lớp, 5.760 ảnh mặt sau vỉ CẮT RỜI, có augmentation, chạy TensorRT trên Jetson Nano, và gắn thêm cánh tay robot để hành động; accuracy 90.67% (thước đo khác F1 nên không so trực tiếp được). Điểm nối: (1) cả hai đều cho thấy mặt sau (chữ in, logo) là nguồn thông tin tốt để phân biệt thuốc; (2) DLDI nêu hạn chế "không nhận diện được vỉ đã cắt rời" và đề xuất tích hợp vào ADC/robot — paper này đi đúng hướng đó, đổi lại phải thu hẹp còn 20 loại thuốc và chấp nhận phần cứng yếu hơn; (3) cả hai đều quan sát thấy có những cặp thuốc bị nhầm 2 chiều — hiện tượng giống lỗi LASA của con người.',
        terms: [
          { term: 'YOLOv2 vs YOLOv5', explain: 'YOLOv2 (2016, Darknet) là thế hệ đầu với anchor box; YOLOv5 (2020, Ultralytics, PyTorch) có backbone CSP, augmentation mosaic, nhiều kích cỡ model và công cụ xuất sang TensorRT/ONNX tiện cho triển khai thiết bị nhúng.' },
          { term: 'Accuracy vs F1', explain: 'Accuracy tính trên toàn bộ lượt test; F1 cân bằng precision và recall cho từng lớp. Hai paper dùng thước đo khác nhau nên con số 90.67% và 95.99% không so sánh trực tiếp được.' },
        ],
      },
    ],
  },
]

export function getResearchPaper(slug: string): ResearchPaper | undefined {
  return RESEARCH_PAPERS.find((p) => p.slug === slug)
}
