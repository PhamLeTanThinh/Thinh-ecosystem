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
  {
    slug: 'blister-package-identification-induced-deep-learning',
    title: 'Pharmaceutical Blister Package Identification Based on Induced Deep Learning',
    authors: 'Han Y, Chung SL, Xiao Q, Wang JS, Su SF',
    year: 2021,
    venue: 'IEEE Access, vol. 9, pp. 101344–101356',
    fields: ['Computer Vision', 'Healthcare AI', 'Deep Learning'],
    doi: '10.1109/ACCESS.2021.3097181',
    sourceUrl: 'https://doi.org/10.1109/ACCESS.2021.3097181',
    // Open access (CC BY 4.0), host local giống các paper khác.
    pdfUrl: '/api/papers/blister-package-identification-induced-deep-learning',
    summary:
      'Đề xuất Induced Deep Learning (IDL): thay vì đưa ảnh thô cho mạng tự học, dùng xử lý ảnh truyền thống (xoá nền → tìm 4 góc vỉ bằng Hough transform → nắn phối cảnh) để tạo ảnh chuẩn RTI 448×448 ghép mặt trước + mặt sau của vỉ thuốc, rồi mới đưa vào CNN. Trên cùng bộ 250 loại thuốc của bệnh viện MacKay (như paper DLDI), RTI đẩy F1 của YOLO v2 / ResNet-101 / SE-ResNet-101 từ 65–96% (ảnh 1 mặt) lên 99.78% / 99.79% / 99.97%. Hệ thống thật gồm hộp gỗ 2 camera chụp 2 mặt qua tấm kính + Jetson TX2 chạy Tiny YOLO tối ưu, đạt 6.23 FPS, nhận diện đúng 100% và chạy ổn định gần 2 năm tại bệnh viện.',
    highlights: [
      {
        heading: 'Bối cảnh — Lỗi phát thuốc & 4 khó khăn của bài toán',
        page: 1,
        explanation:
          'Lỗi phát thuốc gây thiệt hại rất lớn: riêng ở Mỹ khoảng 8.000 người chết mỗi năm, thiệt hại ~20 tỉ USD; nguyên nhân chính là khối lượng công việc — giờ cao điểm ở bệnh viện MacKay (Đài Bắc), dược sĩ phải phát trung bình 2 thuốc/phút, gần như không còn thời gian kiểm tra lại. Cách nhận diện thông thường là OCR chữ in mặt sau vỉ, nhưng chữ thường rất nhỏ, méo, loá sáng hoặc in màu nhạt nên OCR hay thất bại. Nhóm tác giả nêu 4 khó khăn đặc thù: (1) ít mẫu — chỉ chụp được 72 ảnh mỗi mặt cho mỗi loại thuốc; (2) vỉ trông rất giống nhau — đa số bọc nhôm bạc, thuốc cùng hãng/cùng công dụng chỉ khác chút chữ và logo; (3) số lượng lớp lớn — hàng trăm loại thuốc vỉ; (4) yêu cầu độ chính xác gần 100%, cao hơn hẳn bài toán nhận diện vật thể thông thường.',
        terms: [
          { term: 'Dispensing error (lỗi phát thuốc)', explain: 'Dược sĩ đưa sai thuốc, sai liều hoặc sai người so với toa — loại lỗi y khoa có thể gây hậu quả nghiêm trọng, thường do mệt mỏi, áp lực và thiếu bước kiểm tra lại.' },
          { term: 'OCR (Optical Character Recognition)', explain: 'Nhận dạng chữ trong ảnh. Cách hiển nhiên để đọc tên thuốc ở mặt sau vỉ, nhưng kém bền với chữ nhỏ, bị loá, bị cong theo bề mặt vỉ.' },
          { term: 'Fine-grained classification', explain: 'Phân loại các lớp rất giống nhau, chỉ khác ở chi tiết nhỏ (như các vỉ nhôm bạc chỉ khác dòng chữ) — khó hơn nhiều so với phân biệt chó/mèo.' },
        ],
      },
      {
        heading: 'Ý tưởng cốt lõi — Induced Deep Learning (IDL)',
        page: 2,
        explanation:
          '"Induction" (dẫn dắt) nghĩa là đưa kinh nghiệm của con người vào để hướng deep learning học đúng đặc trưng quan trọng, thay vì để mạng tự mò từ thật nhiều dữ liệu. Tác giả ví như giáo viên khoanh vùng trước kì thi: học sinh đỡ tốn công mà vẫn đạt điểm tốt. Cụ thể với vỉ thuốc: con người biết thông tin phân biệt nằm ở CHÍNH tấm vỉ (không phải nền), ở CẢ 2 mặt, và không phụ thuộc vỉ nằm ở đâu, xoay góc nào, to hay nhỏ. Vì vậy trước khi vào CNN, ảnh được cắt đúng vỉ, nắn thẳng về kích thước cố định 448×224, rồi ghép mặt trước + mặt sau thành 1 ảnh duy nhất gọi là RTI. Mạng không phải tốn "sức học" để bỏ qua nền, xoay, co giãn nữa — chỉ còn tập trung phân biệt chữ, logo, hình viên thuốc. Đây thực chất là một kĩ thuật feature engineering ở tầng đầu vào; cái tên "induced deep learning" là cách nhóm tác giả đặt, không phải thuật ngữ chuẩn trong ngành.',
        terms: [
          { term: 'Induction (dẫn dắt)', explain: 'Mượn từ sinh học: dùng hiểu biết của con người (chọn nguồn thông tin, tiền xử lý, trích đặc trưng) để định hướng mạng học — một chiến lược tối ưu theo ứng dụng, không phải kiến trúc mạng mới.' },
          { term: 'RTI (Re-oriented Two-sided Image)', explain: 'Ảnh 448×448 gồm ảnh mặt trước và mặt sau của cùng 1 vỉ, mỗi mặt đã được nắn thẳng về 448×224 rồi ghép cạnh nhau theo cạnh dài. Đây là đầu vào duy nhất mà mạng nhìn thấy.' },
          { term: 'Inductive bias', explain: 'Thuật ngữ chuẩn trong ML cho "giả định có sẵn" mà ta cài vào mô hình (vd CNN giả định đặc trưng cục bộ, bất biến vị trí). IDL là cách đưa thêm inductive bias ở tầng dữ liệu đầu vào.' },
        ],
      },
      {
        heading: 'Related work — 3 dòng nhận diện thuốc',
        page: 3,
        explanation:
          'Giải pháp phần cứng hiện có: mã vạch (phải quét và đối chiếu thủ công từng túi thuốc, chậm), tủ thuốc RFID (phải sửa lại tủ thuốc cũ), tủ phát thuốc tự động (đắt, chỉ bệnh viện lớn mua nổi) — nên bệnh viện vừa và nhỏ cần một giải pháp rẻ, tự động. Về nhận diện bằng ảnh có 3 dòng: (1) viên thuốc rời (tablet) — dựa vào màu, hình, chữ khắc (CoforDes, MobileDeepPill, MedGlasses...); (2) hộp thuốc (drug package) — cho máy bán thuốc hoặc người khiếm thị; (3) vỉ thuốc (blister package) — dựa vào hoa văn mặt trước và chữ mặt sau, trước dùng template matching, gần đây dùng deep learning, chủ yếu từ chính nhóm của Chung: RIN (vỉ bị che khuất), Fast ROR (vỉ cầm trên tay, chỉ 1 mặt). Phần tổng quan về CNN điểm qua VGG → ResNet (shortcut chống mất gradient) → SENet (đánh trọng số kênh đặc trưng), và các detector R-CNN → YOLO → SSD → YOLO v2/v3/v4.',
        terms: [
          { term: 'ResNet (Residual Network)', explain: 'CNN có "shortcut connection" cộng thẳng đầu vào vào đầu ra của mỗi khối, giúp gradient truyền ngược tốt nên train được mạng rất sâu (101 layer ở bài này).' },
          { term: 'SENet (Squeeze-and-Excitation)', explain: 'Khối gắn thêm vào CNN: "nén" mỗi kênh đặc trưng thành 1 số, rồi học trọng số để khuếch đại kênh quan trọng và làm yếu kênh vô ích — một dạng channel attention. SE-ResNet-101 là ResNet-101 gắn khối SE.' },
          { term: 'Object detection vs classification', explain: 'Detection (YOLO) vừa tìm vị trí vừa gán nhãn vật thể trong ảnh; classification (ResNet, SENet) chỉ gán 1 nhãn cho cả ảnh. Bài này thử cả 2 loại.' },
          { term: 'Template matching', explain: 'Kĩ thuật cổ điển: trượt một ảnh mẫu trên ảnh cần tìm và đo độ khớp — đơn giản nhưng nhạy với xoay, co giãn, ánh sáng.' },
        ],
      },
      {
        heading: 'Khung hệ thống phát thuốc & vai trò của nhận diện',
        page: 4,
        explanation:
          'Hệ thống phát thuốc của bệnh viện có 6 đầu: bác sĩ (kê toa), thu ngân (đăng kí, thanh toán), bệnh nhân (nhận thông báo, hướng dẫn uống), cloud server (trung tâm trao đổi dữ liệu), quản lý (giám sát, phân tích) và quầy phát thuốc — phần cốt lõi, nơi đối chiếu toa và xác nhận thuốc. BPIS được đặt ở quầy phát thuốc: dược sĩ đặt vỉ vừa lấy vào máy, máy nhận ra tên thuốc để so với toa. Điểm thực tế: hệ thống chỉ kiểm tra, không thay đổi quy trình hay tủ thuốc hiện có — khác với RFID hay tủ tự động.',
        terms: [
          { term: 'Drug verification (xác minh thuốc)', explain: 'Bước kiểm tra thuốc dược sĩ đã lấy có khớp đúng với toa không, trước khi giao cho bệnh nhân — đây là chỗ BPIS can thiệp.' },
          { term: 'Human-in-the-loop', explain: 'Máy hỗ trợ nhưng con người vẫn ra quyết định cuối cùng — BPIS đóng vai "người kiểm tra thứ hai" chứ không thay dược sĩ.' },
        ],
      },
      {
        heading: 'Bước 1 — Xoá nền & tìm đúng tấm vỉ',
        page: 5,
        explanation:
          'Bốn yếu tố gây nhiễu được nhắm tới: nền và ánh sáng, kích thước vỉ khác nhau, góc nhìn camera thay đổi, và thông tin trên mỗi mặt vỉ có hạn. Bước xoá nền: chuyển ảnh BGR sang ảnh xám → lọc trung vị (median blur) để khử nhiễu → dò cạnh và đường viền (contour) → lấy bao lồi (convex hull) của các đường viền → chọn bao lồi LỚN NHẤT làm tấm vỉ. Toàn bộ là xử lý ảnh cổ điển kiểu OpenCV, không dùng deep learning — chạy nhanh, dễ hiểu, và hoạt động tốt vì nền trong hộp chụp được làm tối hẳn (dán vải nhung đen).',
        terms: [
          { term: 'Median blur (lọc trung vị)', explain: 'Thay mỗi điểm ảnh bằng giá trị trung vị của vùng lân cận — khử nhiễu hạt tốt mà vẫn giữ được cạnh sắc.' },
          { term: 'Contour (đường viền)', explain: 'Đường cong nối các điểm biên của một vùng ảnh — dùng để tách hình dạng tấm vỉ khỏi nền.' },
          { term: 'Convex hull (bao lồi)', explain: 'Đa giác lồi nhỏ nhất bao trọn một tập điểm, như căng sợi dây thun quanh vật. Giúp lấp các chỗ lõm/khuyết trên đường viền vỉ để có hình bao gọn gàng.' },
        ],
      },
      {
        heading: 'Bước 2 & 3 — Tìm 4 góc bằng Hough transform & nắn thẳng',
        page: 6,
        explanation:
          'Vỉ thường hình chữ nhật hoặc tứ giác có 1 cạnh cong, nên chỉ cần tìm 3 cạnh thẳng. Algorithm 1: Hough transform cho ra mọi đường thẳng ứng viên, mỗi đường mô tả bằng (ρ, θ), xếp theo số phiếu bầu; lấy đường mạnh nhất làm mốc, rồi nhận thêm đường mới chỉ khi nó cách các đường đã chọn hơn 50 px (theo ρ) hoặc lệch hơn 0.5 rad (theo θ) — tránh lấy trùng 1 cạnh nhiều lần — tới khi đủ 3 đường. Algorithm 2: giao điểm của 3 đường cho 2 góc P1, P4; lấy trung điểm M của P1P4 và trọng tâm B của đường viền vỉ, vector v = B − M; 2 góc còn lại là P2 = P1 + 2v, P3 = P4 + 2v (đối xứng qua tâm — mẹo hình học rất gọn, nhưng ngầm giả định vỉ gần như hình bình hành). Bước 3: sắp thứ tự góc sao cho bắt đầu từ cạnh NGẮN (nếu P1P2 dài hơn P2P3 thì xoay vòng thứ tự), tính ma trận phối cảnh từ 4 góc tới khuôn 448×224, nắn từng mặt, rồi ghép 2 mặt theo cạnh dài thành RTI 448×448.',
        terms: [
          { term: 'Hough transform', explain: 'Kĩ thuật tìm đường thẳng: mỗi điểm cạnh "bỏ phiếu" cho mọi đường có thể đi qua nó trong không gian tham số (ρ, θ); đường nào nhiều phiếu nhất là đường thật trong ảnh.' },
          { term: 'ρ (rho) và θ (theta)', explain: 'Hai tham số mô tả 1 đường thẳng: ρ là khoảng cách ngắn nhất từ gốc toạ độ tới đường, θ là góc giữa đường và trục x.' },
          { term: 'Barycenter (trọng tâm)', explain: 'Tâm khối lượng của vùng đường viền — với hình đối xứng, đây chính là tâm hình, nên đối xứng 2 góc đã biết qua tâm sẽ ra 2 góc còn lại.' },
          { term: 'Perspective transform (biến đổi phối cảnh)', explain: 'Ma trận 3×3 (homography) ánh xạ 4 góc của tứ giác méo sang 4 góc hình chữ nhật chuẩn — "trải phẳng" vỉ chụp nghiêng về dạng nhìn thẳng.' },
        ],
      },
      {
        heading: 'Phần cứng — Hộp chụp 2 mặt & Jetson TX2',
        page: 7,
        explanation:
          'Hộp gỗ khoảng 40×40×40 cm, giữa có tấm kính trong; 2 camera Logitech BRIO đặt đối diện nhau (1 trên nóc, 1 dưới đáy) cùng nhìn vào tấm kính, nên đặt vỉ lên là chụp được cả 2 mặt CÙNG LÚC. Dải đèn LED quanh thành hộp, cách kính 2 cm phía trên và dưới, cho ánh sáng ổn định; bên trong dán vải nhung đen chống loá, chỉ chừa vùng kính 30×25 cm đúng bằng vùng chụp. Huấn luyện trên PC có GPU GTX 1080 (Ti), sau đó chép file trọng số sang Jetson TX2 (256 CUDA core, RAM 8GB) đặt ở từng quầy phát thuốc. Nhận xét: phần cứng "kiểm soát môi trường" này là nửa còn lại của thành công — nền đen, đèn cố định khiến bước xoá nền gần như luôn đúng. Đây cũng là "induction" nhưng ở tầng phần cứng.',
        terms: [
          { term: 'NVIDIA Jetson TX2', explain: 'Máy tính nhúng có GPU 256 nhân Pascal, RAM 8GB — mạnh hơn Jetson Nano, đủ chạy nhận diện thời gian thực, nhỏ gọn và rẻ hơn PC để đặt ở quầy.' },
          { term: 'Train on PC, deploy on edge', explain: 'Mô hình train trên máy mạnh (GPU desktop), rồi chỉ chép trọng số xuống thiết bị nhúng để suy luận — cách triển khai phổ biến cho AI tại hiện trường.' },
          { term: 'Controlled acquisition (chụp có kiểm soát)', explain: 'Cố định nền, ánh sáng, khoảng cách chụp để ảnh ít biến động — làm bài toán dễ hơn hẳn, đổi lại hệ thống chỉ đúng trong chiếc hộp đó.' },
        ],
      },
      {
        heading: 'Tối ưu Tiny YOLO cho thiết bị nhúng (Table 1)',
        page: 8,
        explanation:
          'Trên Jetson dùng Tiny YOLO (bản rút gọn YOLO v2, chỉ 9 lớp tích chập, viết bằng C nên nhanh, nhận diện > 200 FPS). Các chỉnh sửa: ảnh vào giảm từ 416×416 xuống 224×224 (RTI đã đủ thông tin); tăng biến đổi ngẫu nhiên độ bão hoà (saturation) và phơi sáng (exposure) từ 50% lên 100% để chịu được thay đổi ánh sáng; lưới dự đoán đổi từ 13×13 xuống 7×7 (224/32); số anchor từ 5 xuống 1, với kích thước anchor 7×7 — tức là phủ TOÀN BỘ ảnh; tắt jitter (cắt ngẫu nhiên khung 20%) và multi-scale training (320–608) vì RTI luôn cố định kích thước và vỉ luôn chiếm trọn ảnh. Hiểu đúng bản chất: sau IDL thì không còn gì để "phát hiện vị trí" nữa — YOLO được biến thành một bộ PHÂN LOẠI cả ảnh, mọi phần định vị bị vô hiệu hoá có chủ đích.',
        terms: [
          { term: 'Tiny YOLO', explain: 'Phiên bản thu nhỏ của YOLO v2 với ít lớp và ít tham số, đánh đổi độ chính xác lấy tốc độ — hợp với thiết bị nhúng.' },
          { term: 'Anchor box', explain: 'Các khung mẫu với kích thước định sẵn mà YOLO dùng làm điểm xuất phát để dự đoán bounding box. Chỉ còn 1 anchor phủ cả ảnh = chỉ dự đoán "cả ảnh là loại thuốc gì".' },
          { term: 'Grid cell (ô lưới)', explain: 'YOLO chia ảnh thành lưới S×S, mỗi ô chịu trách nhiệm dự đoán vật thể có tâm nằm trong ô đó. Lưới 7×7 với ảnh 224 vì mạng giảm kích thước 32 lần.' },
          { term: 'Jitter', explain: 'Augmentation cắt/dịch khung ảnh ngẫu nhiên khi train để mô hình chịu được vật lệch vị trí — vô ích khi vỉ đã được nắn chuẩn nên bị tắt.' },
        ],
      },
      {
        heading: 'Dataset & thiết kế thí nghiệm',
        page: 9,
        explanation:
          'Dữ liệu từ khu thuốc viên người lớn của bệnh viện MacKay Đài Bắc: 250 loại thuốc × 72 ảnh mỗi mặt = 36.000 ảnh gốc — trùng khớp với bộ dữ liệu của paper DLDI (cùng nhóm tác giả Chung SL). Sau xử lý có tổng 90.000 ảnh gồm 3 loại: ảnh gốc (36.000, cho YOLO), ảnh đã cắt vỉ (36.000, cho ResNet/SENet) và RTI (18.000). Thuật toán chưa phân biệt được vỉ xuôi hay lộn ngược, nên mỗi vỉ được tạo 4 RTI cho đủ 4 tổ hợp xuôi/ngược của 2 mặt. Thiết kế 3 thí nghiệm trên 3 mạng (YOLO v2, ResNet-101, SE-ResNet-101): (1) chỉ ảnh mặt trước; (2) chỉ ảnh mặt sau — 2 thí nghiệm này là deep learning thông thường; (3) RTI — tức IDL. Luật train thống nhất: ảnh 224×224, KHÔNG augmentation, KHÔNG pre-train, batch size 8, tối đa 100 epoch, lưu trọng số mỗi epoch.',
        terms: [
          { term: 'Ablation / controlled comparison', explain: 'So sánh mà chỉ thay đúng 1 yếu tố (ở đây là loại ảnh đầu vào: trước / sau / RTI), giữ nguyên mọi thứ khác — để chứng minh cải thiện đến từ đúng yếu tố đó.' },
          { term: 'Benchmark algorithm', explain: 'Các mạng phổ biến được dùng làm chuẩn đối chứng. Việc IDL cải thiện cả 3 mạng khác nhau cho thấy hiệu quả không phụ thuộc kiến trúc cụ thể.' },
          { term: 'Training from scratch', explain: 'Train từ trọng số ngẫu nhiên, không dùng pre-trained model — làm việc so sánh công bằng giữa các mạng nhưng tốn thời gian hơn (SE-ResNet mất tới ~40 giờ).' },
        ],
      },
      {
        heading: 'Kết quả — RTI đẩy mọi mạng lên ~99.8%',
        page: 10,
        explanation:
          'Chia 54 ảnh train / 18 ảnh test mỗi loại (13.500 / 4.500), lặp 4 lần lấy trung bình, đo bằng Precision, Recall, F1. F1 theo từng thí nghiệm (trước → sau → RTI): YOLO v2 65.39% → 86.48% → 99.78%; ResNet-101 85.25% → 86.68% → 99.79%; SE-ResNet-101 90.90% → 96.23% → 99.97%. Ba quan sát: (1) mặt sau luôn tốt hơn mặt trước vì có chữ, liều lượng, logo — khớp kết luận của DLDI; (2) với ảnh 1 mặt, mạng mạnh hơn giúp rõ rệt (YOLO < ResNet < SENet), nhưng với RTI thì cả 3 mạng gần như ngang nhau ở ~99.8% — tức là CHẤT LƯỢNG ĐẦU VÀO quan trọng hơn kiến trúc mạng; (3) RTI còn train nhanh hơn và ít epoch hơn: YOLO 7h42 → 4h33, ResNet 29h35 → 16h15, SE-ResNet 40h12 → 28h48.',
        terms: [
          { term: 'Precision / Recall / F1-score', explain: 'Precision: trong các lần đoán là thuốc X, bao nhiêu % đúng. Recall: trong các thuốc X thật, nhận ra bao nhiêu %. F1: trung bình điều hoà của hai chỉ số, dùng làm thước đo chính.' },
          { term: 'Data-centric AI', explain: 'Hướng tiếp cận cải thiện mô hình bằng cách làm dữ liệu tốt hơn (sạch, chuẩn hoá, đúng thông tin) thay vì đổi kiến trúc — kết quả "mọi mạng đều lên 99.8% với RTI" là ví dụ điển hình.' },
        ],
      },
      {
        heading: 'So sánh SOTA & hệ thống thời gian thực',
        page: 11,
        explanation:
          'Table 7 so sánh: YOLO v2 89.39%, ResNet-101 92.68%, SE-ResNet-101 97.32%, RIN 95.30%, Fast ROR 95.6%, IDL 99.98%. Lưu ý: 3 con số đầu chính là Precision của thí nghiệm ảnh mặt sau ở Table 4–6, cột trong bảng ghi "Precision" dù phần text gọi là "recognition rate"; RIN và Fast ROR là số từ paper gốc, giải bài khác (vỉ bị che khuất, vỉ cầm tay 1 mặt) nên đặt cạnh nhau không hẳn công bằng. Hệ thống nhúng: Tiny YOLO tối ưu đạt F1 100% trên 4.500 RTI test sau 2h34 phút (epoch 40). Trên Jetson TX2, khâu tạo RTI mất ~0.12 giây (~8.33 FPS) — đây là nút thắt cổ chai, vì riêng mạng nhận diện chạy được ~200 FPS; cả chuỗi đạt ~6.23 FPS với độ chính xác 100% (Table 8). Gần 2 năm chạy thực tế tại bệnh viện, tác giả báo chưa phát hiện lỗi nhận diện nào do hệ thống.',
        terms: [
          { term: 'Bottleneck (nút thắt cổ chai)', explain: 'Khâu chậm nhất quyết định tốc độ cả hệ thống. Ở đây là bước xử lý ảnh cổ điển tạo RTI (0.12s), không phải mạng nơ-ron (~0.005s).' },
          { term: 'FPS (frames per second)', explain: 'Số khung hình xử lý được mỗi giây. 6.23 FPS là đủ cho tình huống dược sĩ đặt vỉ vào và chờ kết quả trong chưa tới 1 giây.' },
          { term: 'SOTA (State of the art)', explain: 'Phương pháp tốt nhất hiện có được công bố. So với SOTA chỉ có ý nghĩa khi cùng dữ liệu và cùng cách đo.' },
        ],
      },
      {
        heading: 'Đọc phản biện — Vì sao 99.98% cần đọc cẩn thận',
        page: 11,
        explanation:
          'Điểm mạnh: ý tưởng đơn giản mà hiệu quả (chuẩn hoá đầu vào bằng kiến thức miền), được chứng minh trên 3 kiến trúc khác nhau, có hệ thống phần cứng hoàn chỉnh, rẻ, triển khai thật 2 năm — hiếm thấy ở paper ứng dụng. Điểm cần cảnh giác: (1) KHÔNG có tập validation — tác giả thừa nhận và chọn model tốt nhất theo F1 ngay trên tập test, nên con số test bị lạc quan (optimistic bias); (2) chia ngẫu nhiên 54/18 ảnh của CÙNG 1 vỉ vật lý chụp nhiều góc — ảnh test rất giống ảnh train, và sau khi nắn thẳng thì RTI gần như trùng nhau; 99.98% đo khả năng "nhận lại đúng vỉ đã thấy", chưa phải vỉ mới cùng loại (khác lô, khác hạn dùng, vỉ nhàu); (3) mâu thuẫn với paper DLDI cùng nhóm: cùng dữ liệu, cùng YOLO v2, cùng cách chia, nhưng DLDI báo F1 mặt trước 93.72% / mặt sau 95.99%, còn bài này chỉ 65.39% / 86.48% — baseline thấp làm mức cải thiện của IDL trông lớn hơn; (4) chưa giải được vỉ xuôi/ngược, phải nhân 4 RTI; con số 18.000 RTI cũng không khớp rõ với việc tạo 4 RTI mỗi vỉ; (5) "100% thời gian thực" và "2 năm không lỗi" không kèm số lượt kiểm tra hay quy trình ghi nhận lỗi; (6) hệ thống phụ thuộc hộp chụp kiểm soát và vỉ còn đủ 3 cạnh thẳng — vỉ bị cắt rời, cầm tay hoặc chồng nhau nằm ngoài phạm vi; (7) chi tiết nhỏ: phần cứng train khi ghi GTX 1080, khi ghi GTX 1080 Ti.',
        terms: [
          { term: 'Optimistic bias', explain: 'Kết quả bị đánh giá cao hơn thực tế vì tập test đã được dùng để chọn model — test không còn "chưa từng thấy" theo đúng nghĩa.' },
          { term: 'Near-duplicate leakage', explain: 'Ảnh test gần như trùng ảnh train (cùng vật thể, chỉ khác góc chụp nhẹ) — mô hình có thể "nhớ" thay vì tổng quát hoá. Cách chia đúng hơn là theo vỉ/lô thuốc (group split).' },
          { term: 'Generalization (khả năng tổng quát hoá)', explain: 'Mô hình còn đúng với dữ liệu thật sự mới (vỉ mới, lô mới, điều kiện mới) hay không — điều mà con số trên tập test ngẫu nhiên chưa chứng minh được.' },
        ],
      },
      {
        heading: 'Kết luận & liên hệ với 2 paper trước',
        page: 12,
        explanation:
          'Tác giả kết luận: IDL (xoá nền, nắn thẳng, ghép 2 mặt) giải quyết các khó khăn chính của bài toán vỉ thuốc — nhiều loại, rất giống nhau, ít mẫu — và hệ thống BPIS chạy nhanh, chính xác, ổn định, không cần sửa đổi gì ở nhà thuốc, phù hợp cơ sở y tế vừa và nhỏ. Đặt cạnh 2 paper đã đọc: (1) DLDI (2020, cùng nhóm, cùng dữ liệu) — train 2 model riêng cho mặt trước và mặt sau, kết luận mặt sau tốt hơn; bài này tiến 1 bước: dùng CẢ 2 mặt trong 1 ảnh và chuẩn hoá trước, chính là hướng "kết hợp 2 mặt vào 1 model" mà DLDI đề xuất cho tương lai; (2) Assistive Robot (2025, Philippines) — dùng YOLOv5 trên ảnh thô mặt sau của vỉ cắt rời, chỉ 20 lớp, đạt ~90%: cho thấy khi không chuẩn hoá đầu vào và không có môi trường chụp kiểm soát, độ chính xác giảm rõ dù mạng mới hơn. Bài học chung: với bài toán hẹp, yêu cầu gần 100%, kiến thức miền + kiểm soát dữ liệu đầu vào thường đáng giá hơn đổi sang mạng mạnh hơn.',
        terms: [
          { term: 'Domain knowledge (kiến thức miền)', explain: 'Hiểu biết đặc thù của lĩnh vực (ở đây: thông tin nằm trên tấm vỉ, ở cả 2 mặt, hình dạng vỉ gần chữ nhật) — được mã hoá thành bước tiền xử lý.' },
          { term: 'Hybrid pipeline', explain: 'Kết hợp xử lý ảnh cổ điển (Hough, convex hull, phối cảnh) với deep learning — mỗi bên làm phần mình mạnh nhất.' },
        ],
      },
    ],
  },
  {
    slug: 'visionlan-scene-text-recognition',
    title: 'From Two to One: A New Scene Text Recognizer with Visual Language Modeling Network',
    authors: 'Wang Y, Xie H, Fang S, Wang J, Zhu S, Zhang Y',
    year: 2021,
    venue: 'ICCV 2021 (arXiv:2108.09661)',
    fields: ['Computer Vision', 'NLP', 'Deep Learning'],
    sourceUrl: 'https://arxiv.org/abs/2108.09661',
    pdfUrl: '/api/papers/visionlan-scene-text-recognition',
    summary:
      'VisionLAN bỏ hẳn language model riêng trong bài toán đọc chữ trong ảnh (Scene Text Recognition): khi train, module MLM tự tìm và che (mask) đặc trưng của 1 kí tự ngẫu nhiên, buộc mô hình thị giác phải đoán kí tự bị che từ các kí tự xung quanh — tức là tự học "ngữ pháp" của từ ngay trong không gian ảnh. Khi test bỏ MLM, chỉ còn 1 mô hình vision duy nhất ("from two to one"): không tốn thêm tham số nào cho phần ngôn ngữ, nhanh hơn SRN 39% (11.5ms vs 19ms), đạt SOTA trên 6 benchmark (IIIT5K 95.8%, IC15 83.7%...), dataset chữ Trung dài TRW15 (88.7%) và dataset chữ bị che OST mới đề xuất (60.3%).',
    highlights: [
      {
        heading: 'Bài toán — Đọc chữ trong ảnh & 2 vấn đề của kiến trúc 2 bước',
        page: 1,
        explanation:
          'Scene Text Recognition (STR) là đọc chuỗi chữ từ ảnh tự nhiên đã được cắt sẵn vùng chữ (biển hiệu, nhãn hàng, bao bì...). Chỉ nhìn hình dạng kí tự thì sẽ bó tay khi chữ bị che, mờ, nhiễu — nên các phương pháp gần đây dùng kiến trúc 2 BƯỚC: mô hình thị giác (vision model) đọc từng kí tự, rồi mô hình ngôn ngữ (language model — RNN, CNN hoặc Transformer) sửa lại dựa trên quan hệ giữa các kí tự, giống như ta đoán "h_use" là "house". Tác giả chỉ ra 2 vấn đề: (1) chi phí tính toán thêm rất lớn và tăng theo độ dài từ — tuyến tính với RNN/CNN, bậc 2 với Transformer, và còn gấp đôi nếu suy luận 2 chiều; (2) khó kết hợp hai nguồn thông tin đến từ 2 cấu trúc tách rời. Gốc rễ theo tác giả: bản thân vision model không có năng lực ngôn ngữ.',
        terms: [
          { term: 'Scene Text Recognition (STR)', explain: 'Nhận dạng chữ trong ảnh chụp tự nhiên (khác OCR tài liệu scan): chữ có thể cong, nghiêng, mờ, bị che, nền phức tạp. Đầu vào là ảnh đã cắt vùng chữ, đầu ra là chuỗi kí tự.' },
          { term: 'Vision model vs Language model', explain: 'Vision model đoán kí tự dựa trên hình ảnh (nét chữ). Language model đoán dựa trên ngữ cảnh chuỗi (kí tự nào hay đi cùng kí tự nào) — bù lại khi hình ảnh không rõ.' },
          { term: 'Linguistic information', explain: 'Thông tin "ngôn ngữ" trong 1 từ: quy luật chính tả, các tổ hợp chữ thường gặp. Ví dụ thấy "bette_" thì kí tự cuối nhiều khả năng là "r".' },
        ],
      },
      {
        heading: 'Ý tưởng — Cho vision model tự có năng lực ngôn ngữ',
        page: 2,
        explanation:
          'Lấy cảm hứng từ cách con người học ngôn ngữ, tác giả không gắn thêm language model mà HUẤN LUYỆN vision model đoán kí tự bị che. VisionLAN có 3 phần: backbone (trích đặc trưng ảnh V), Masked Language-aware Module — MLM (chỉ dùng lúc train, tạo mặt nạ che đúng 1 kí tự trên bản đồ đặc trưng) và Visual Reasoning Module — VRM (đọc từ trên đặc trưng đã bị che). Vì kí tự bị che không còn tín hiệu hình ảnh, VRM buộc phải học cách suy ra nó từ các kí tự xung quanh — tức là tự học thông tin ngôn ngữ ngay trong không gian thị giác. Khi test bỏ MLM đi, VRM vẫn giữ được năng lực đó và tự động dùng ngữ cảnh khi chữ khó nhìn. Kết quả: phần ngôn ngữ có chi phí bằng 0 khi suy luận, nhanh hơn 39%. Ba đóng góp: kiến trúc mới 1 bước; Weakly-supervised Complementary Learning (WCL) để tạo mặt nạ từng kí tự chỉ từ nhãn cấp từ; dataset Occlusion Scene Text (OST).',
        terms: [
          { term: 'VisionLAN (Visual Language Modeling Network)', explain: 'Mạng đọc chữ coi thông tin hình ảnh và ngôn ngữ là một khối thống nhất trong 1 mô hình duy nhất, thay vì 2 mô hình nối tiếp.' },
          { term: 'Training-only module', explain: 'Module chỉ tồn tại lúc train để định hướng việc học (như MLM ở đây), bị bỏ đi khi suy luận nên không làm chậm mô hình triển khai.' },
          { term: 'Zero extra inference cost', explain: 'Năng lực ngôn ngữ được "nhúng" vào trọng số của vision model, nên lúc chạy thật không cần thêm tham số hay phép tính nào cho phần ngôn ngữ.' },
        ],
      },
      {
        heading: 'Related work — Language-free vs Language-aware & ý tưởng masking',
        page: 2,
        explanation:
          'Language-free coi STR là bài toán phân loại thị giác thuần: CRNN (CNN + RNN + CTC), coi là bài toán so khớp với bảng chữ cái, phân loại từng pixel (TextScanner)... — hay sai khi chữ mờ, bị che. Language-aware dùng quy luật ngôn ngữ: ASTER nắn thẳng chữ rồi dùng RNN giải mã từng bước (chậm vì tuần tự); SRN dùng Transformer làm language model toàn cục nhận đầu ra của vision model để sửa; ABINet-kiểu (Fang et al.) làm cả vision lẫn language bằng CNN. Ý tưởng che-rồi-đoán bắt nguồn từ BERT (masked language modeling — che token trong câu) và các mô hình vision-language như ViLBERT. Khác biệt: dữ liệu STR chỉ có nhãn cấp TỪ (không biết từng kí tự nằm ở đâu), nên không thể che theo token hay pixel như BERT; VisionLAN tự học vị trí cần che ở mức đặc trưng.',
        terms: [
          { term: 'CTC (Connectionist Temporal Classification)', explain: 'Hàm loss/giải mã cho phép học chuỗi kí tự từ chuỗi đặc trưng mà không cần biết trước kí tự nào ứng với vị trí nào — nền tảng của CRNN.' },
          { term: 'BERT & Masked Language Modeling', explain: 'BERT che ngẫu nhiên một số từ trong câu và bắt mô hình đoán lại từ ngữ cảnh 2 phía — cách học biểu diễn ngôn ngữ rất mạnh. VisionLAN mượn ý tưởng này nhưng che trên bản đồ đặc trưng ảnh.' },
          { term: 'Rectification (nắn chữ)', explain: 'Bước biến đổi ảnh chữ cong/nghiêng thành chữ thẳng trước khi đọc (như ASTER dùng TPS) — VisionLAN không cần bước này mà vẫn tốt hơn trên chữ méo.' },
          { term: 'Weak supervision (giám sát yếu)', explain: 'Huấn luyện chỉ với nhãn thô hơn cái cần học — ở đây chỉ biết cả từ là "house" mà phải tự học vị trí từng kí tự.' },
        ],
      },
      {
        heading: 'MLM — Tự che đúng 1 kí tự chỉ với nhãn cấp từ (WCL)',
        page: 4,
        explanation:
          'MLM nhận đặc trưng V và chỉ số kí tự P (chọn ngẫu nhiên từ 1 tới độ dài từ), qua 1 transformer unit, kết hợp thông tin vị trí P, rồi qua sigmoid để ra mặt nạ Mask_c. Làm sao để mặt nạ che ĐÚNG kí tự thứ P khi không có nhãn vị trí? Weakly-supervised Complementary Learning dùng 2 nhánh song song chia sẻ trọng số: nhánh 1 lấy V × Mask_c (phần bị che) và phải đọc ra đúng kí tự bị che; nhánh 2 lấy V × (1 − Mask_c) (phần còn lại) và phải đọc ra chuỗi còn lại. Ví dụ từ "burns", P = 1: nhánh 1 phải ra "b", nhánh 2 phải ra "urns". Hai ràng buộc bù trừ nhau ép mặt nạ phủ trọn kí tự "b" mà không lấn sang kí tự khác. Nhãn cho 2 nhánh được sinh tự động từ nhãn từ gốc (vd "house", P = 4 → "s" và "houe"), nên không cần gán nhãn thêm. Lớp dự đoán dùng attention theo vị trí: Att = Softmax(W1·tanh(W2·O_c + W3·V)), rồi kí tự thứ t là tổng có trọng số của V theo Att_t; N = 25 bước tối đa, c = 512 kênh.',
        terms: [
          { term: 'Mask_c (character mask map)', explain: 'Bản đồ giá trị 0–1 cùng kích thước đặc trưng, cao ở vùng của kí tự cần che. Nhân V với (1 − Mask_c) sẽ xoá thông tin hình ảnh của kí tự đó.' },
          { term: 'Complementary learning (học bù trừ)', explain: 'Hai nhánh với 2 mục tiêu đối nghịch (phần bị che vs phần còn lại) cùng ràng buộc một mặt nạ, khiến nó phải tách bạch chính xác — không che thiếu, không che lấn.' },
          { term: 'Attention-based parallel decoding', explain: 'Mỗi vị trí kí tự t có một bản đồ attention riêng chọn vùng ảnh tương ứng, và cả N kí tự được dự đoán cùng lúc (song song) chứ không tuần tự như RNN.' },
          { term: 'Positional encoding', explain: 'Vector mã hoá vị trí (thứ tự kí tự, toạ độ pixel) cộng vào đặc trưng để Transformer — vốn không phân biệt thứ tự — biết "kí tự thứ mấy" và "ở đâu".' },
        ],
      },
      {
        heading: 'VRM — Suy luận từ trên đặc trưng bị che',
        page: 5,
        explanation:
          'VRM gồm Visual Semantic Reasoning (VSR) layer — một chồng transformer unit có positional encoding để nắm quan hệ xa (long-range dependency) giữa các vùng ảnh — và Parallel Prediction layer dự đoán mọi kí tự song song (cùng công thức attention như MLM). Khi kí tự thứ i bị MLM che, VSR chỉ còn cách dựa vào đặc trưng của các kí tự khác để đoán nó — đúng dạng language modeling y_i = f(các kí tự còn lại), nhưng diễn ra trong không gian ảnh. Khác với SRN dùng Transformer cho mô hình ngôn ngữ thuần (đầu vào là chuỗi kí tự đã đoán), Transformer ở đây làm việc trên đặc trưng ảnh nên chi phí không phụ thuộc độ dài từ. Hình 5 minh hoạ: không có MLM thì mô hình đọc "bettep" và "rrans"; có MLM thì đọc đúng "better" và "trans" — VSR đã bù đặc trưng cho kí tự "r" bị che và làm nổi nét phân biệt của "t". Loss tổng: L = L_rec + 0.5·L_mas + 0.5·L_rem, đều là cross-entropy.',
        terms: [
          { term: 'Transformer unit', explain: 'Khối self-attention + feed-forward: mỗi vị trí "nhìn" mọi vị trí khác để tổng hợp thông tin, nên nắm được quan hệ xa tốt hơn CNN/RNN.' },
          { term: 'Long-range dependency', explain: 'Quan hệ giữa các phần xa nhau trong chuỗi/ảnh — ví dụ kí tự đầu và cuối của từ — cần thiết để suy ra kí tự bị che từ ngữ cảnh.' },
          { term: 'Cross-entropy loss', explain: 'Hàm mất mát chuẩn cho phân loại: phạt nặng khi mô hình gán xác suất thấp cho nhãn đúng. Ở đây tính trung bình trên N vị trí kí tự.' },
        ],
      },
      {
        heading: 'Thiết lập thí nghiệm & dataset OST',
        page: 5,
        explanation:
          'Train trên 2 bộ dữ liệu TỔNG HỢP (synthetic): SynthText và Synth90K; đánh giá trên 6 benchmark thật — 3 bộ "regular" (chữ thẳng: IIIT5K, IC13, SVT) và 3 bộ "irregular" (chữ cong, nghiêng, mờ: IC15, SVTP, CUTE80). Dataset mới OST gồm 4.832 ảnh lấy từ 6 benchmark, mỗi ảnh bị che thủ công ĐÚNG 1 kí tự bằng 1 nét (weak) hoặc 2 nét (heavy). Cấu hình: backbone ResNet45, ảnh 256×64, augmentation xoay/đổi màu/biến dạng phối cảnh, 4 GPU V100, batch 384, Adam lr 1e-4, 37 lớp (a–z, 0–9, kí hiệu kết thúc). Train 2 giai đoạn: Language-Free (ngắt MLM khỏi VRM, VRM học thuần thị giác cho ổn định) rồi Language-Aware (dùng Mask_c che đặc trưng, chỉ che một tỉ lệ mẫu trong batch).',
        terms: [
          { term: 'Synthetic data (dữ liệu tổng hợp)', explain: 'Ảnh chữ do máy sinh ra (render font lên nền thật) — rẻ, có nhãn tự động, hàng triệu mẫu. Chuẩn chung của STR: train trên synthetic, test trên ảnh thật.' },
          { term: 'Regular vs Irregular text', explain: 'Regular: chữ ngang, rõ. Irregular: chữ cong, nghiêng, phối cảnh, mờ — khó hơn và là nơi language info giúp nhiều nhất.' },
          { term: 'Two-stage training (LF → LA)', explain: 'Học thị giác ổn định trước, rồi mới bật cơ chế che để học ngôn ngữ — tránh việc 2 module chưa học được gì đã ràng buộc lẫn nhau.' },
        ],
      },
      {
        heading: 'Ablation — Che bao nhiêu, nhánh nào, so với Dropout/Cutout',
        page: 6,
        explanation:
          'Baseline ở các bảng ablation là VRM với 2 transformer unit, không có MLM. (1) Tỉ lệ mẫu bị che trong batch (Table 1): tỉ lệ 1:1 tốt nhất — IIIT5K 94.5 → 95.4, IC15 79.8 → 81.8, SVTP 81.1 → 83.7, CUTE 85.8 → 88.2; tăng lên 2:1 thì giảm nhẹ vì mất cân bằng giữa mẫu đủ và thiếu thông tin hình ảnh. Bộ irregular lợi ít nhất ~2%, đúng như kì vọng. (2) WCL (Table 2): dùng cả 2 nhánh tốt hơn chỉ dùng 1 nhánh (Mas only hoặc Rem only) trên mọi bộ. (3) So với che ngẫu nhiên (Table 3, accuracy trung bình): Dropout 89.0, Cutout 89.0 (chỉ +0.2) so với MLM 90.2 (+1.4 so với baseline 88.8) — chứng tỏ cái lợi không đến từ "che ngẫu nhiên để regularize" mà từ việc che ĐÚNG một kí tự để buộc suy luận ngôn ngữ. (4) VRM 3 unit tốt hơn 2 unit (Table 4) — năng lực ngôn ngữ mạnh hơn; bản cuối dùng 3 unit.',
        terms: [
          { term: 'Ablation study', explain: 'Bỏ/đổi từng thành phần để đo đóng góp riêng của nó — ở đây chứng minh lần lượt MLM, WCL, cách che và số transformer unit đều có ích.' },
          { term: 'Dropout', explain: 'Ngẫu nhiên tắt một phần neuron khi train để chống overfitting — che ngẫu nhiên, không có chủ đích theo kí tự.' },
          { term: 'Cutout', explain: 'Augmentation xoá một ô vuông ngẫu nhiên trên ảnh/đặc trưng — cũng là che, nhưng không đảm bảo che đúng trọn 1 kí tự.' },
        ],
      },
      {
        heading: 'Kết quả — SOTA trên 6 benchmark, nhanh hơn 39%',
        page: 7,
        explanation:
          'Table 5 (không dùng từ điển — none lexicon): VisionLAN đạt IIIT5K 95.8, IC13 95.7, SVT 91.7, IC15 83.7, SVTP 86.0, CUTE 88.5 — vượt SRN (phương pháp mạnh nhất trước đó) lần lượt 1.0 / 0.2 / 0.2 / 1.0 / 0.9 / 0.7 điểm (mình đã tự trừ lại, khớp với text). So với ASTER và ESIR — 2 phương pháp phải nắn chữ trước — VisionLAN hơn 5–9 điểm trên các bộ irregular dù không nắn, vì xử lý trực tiếp trên không gian 2D. Tốc độ (Table 6, IC15): baseline 11.5ms; gắn RNN của ASTER 43.2ms (+3M tham số); gắn Transformer của SRN 19ms (+12.6M tham số); VisionLAN 11.5ms, 0 tham số thêm → nhanh hơn ít nhất 39% (11.5 so với 19). Nói cách khác: VisionLAN có cùng tốc độ và kích thước với mô hình thị giác thuần, nhưng chính xác hơn cả mô hình 2 bước.',
        terms: [
          { term: 'Lexicon-free (none lexicon)', explain: 'Đánh giá không cho mô hình dùng danh sách từ có sẵn để sửa kết quả — đo đúng năng lực đọc thật, khó hơn so với có lexicon.' },
          { term: 'EIPs (Extra Introduced Parameters)', explain: 'Số tham số thêm vào chỉ để mô hình hoá ngôn ngữ. VisionLAN = 0M vì phần ngôn ngữ nằm sẵn trong vision model.' },
          { term: 'Latency (độ trễ)', explain: 'Thời gian xử lý 1 ảnh (ms). Quan trọng khi triển khai thời gian thực hoặc trên thiết bị yếu.' },
        ],
      },
      {
        heading: 'OST, chữ Trung dài & phân tích định tính',
        page: 7,
        explanation:
          'Trên OST (chữ bị che 1 kí tự, Table 7): baseline 53.0%, +RNN của ASTER 53.9%, +Transformer của SRN 58.2%, VisionLAN 60.3% (weak 70.3%, heavy 50.3%) — hơn baseline 7.3 điểm, cho thấy năng lực "đoán chữ bị mất" mạnh hơn language model gắn rời. Trên TRW15 (2.997 ảnh chữ Trung dài, N = 50, Table 8): VisionLAN 88.7% so với SRN 85.5%, CTC 73.8%, 2D-Attention 72.2% — chứng tỏ cách làm không chỉ đúng với chữ Latin. Định tính (Fig. 7–8): mặt nạ MLM định vị đúng kí tự kể cả với chữ cong ("nothing") hay kí tự lặp ("confabbing", P = 6 che đúng chữ "b" thứ hai); VisionLAN sửa được các lỗi kí tự dễ lẫn ("before": e/f), bị nền nhiễu che và chữ mờ.',
        terms: [
          { term: 'OST (Occlusion Scene Text)', explain: 'Dataset mới của bài: ảnh benchmark bị vẽ đè 1–2 nét lên đúng 1 kí tự, để đo khả năng đọc khi thiếu tín hiệu hình ảnh của kí tự đó.' },
          { term: 'Generalization to non-Latin', explain: 'Kiểm tra trên chữ Trung — bảng chữ lớn hơn rất nhiều, từ dài hơn — để chứng minh phương pháp không chỉ "học thuộc" quy luật tiếng Anh.' },
          { term: 'Qualitative analysis', explain: 'Phân tích bằng hình ảnh minh hoạ (mặt nạ, kết quả đọc) để hiểu mô hình làm gì, bổ sung cho các con số.' },
        ],
      },
      {
        heading: 'Đọc phản biện',
        page: 8,
        explanation:
          'Điểm mạnh: ý tưởng gọn và đẹp — dùng module chỉ-khi-train để "nhúng" năng lực ngôn ngữ vào vision model, có lợi cả về độ chính xác lẫn tốc độ; ablation đầy đủ, đặc biệt phép so với Dropout/Cutout loại trừ được giả thuyết "chỉ là regularization"; có code và dataset công khai. Điểm cần lưu ý: (1) mức vượt SRN trên các bộ regular chỉ 0.2 điểm — nằm trong khoảng dao động giữa các lần train, paper không báo độ lệch chuẩn; (2) OST được tạo bằng cách che ĐÚNG 1 kí tự — rất giống cơ chế che lúc train của MLM, nên benchmark này có lợi thế tự nhiên cho VisionLAN; (3) khi so tốc độ và trên OST, SRN chỉ được cài 1 transformer unit trong GSRM, nên language model đối chứng yếu hơn bản gốc; (4) baseline lệch giữa các bảng — Table 1 dùng VRM 2 unit (IIIT5K 94.5), Table 5 dùng 3 unit (94.6) — và accuracy trung bình ở Table 3 (88.8 / 90.2) không bằng trung bình cộng 6 cột của Table 1 (~87.5 / ~89.2), có thể là trung bình theo số ảnh nhưng paper không nói rõ; (5) text ví dụ tỉ lệ 1:3 nhưng bảng không có dòng 1:3. Hạn chế tự nhiên: chỉ đọc được từ đã cắt sẵn, tối đa 25 kí tự, 37 lớp (không phân biệt hoa/thường, không có dấu câu).',
        terms: [
          { term: 'Statistical significance', explain: 'Chênh lệch có thật hay chỉ do may rủi giữa các lần train. Cần báo trung bình ± độ lệch chuẩn qua nhiều lần chạy — thứ mà nhiều paper CV bỏ qua.' },
          { term: 'Benchmark bias', explain: 'Benchmark được thiết kế giống cách huấn luyện của chính phương pháp đề xuất, nên dễ làm phương pháp đó trông vượt trội hơn thực tế.' },
        ],
      },
      {
        heading: 'Liên hệ với bài toán nhận diện vỉ thuốc',
        page: 8,
        explanation:
          'Paper vỉ thuốc của Han et al. (IDL) nói rằng OCR thường thất bại với chữ in mặt sau vỉ — chữ nhỏ, méo, loá sáng, in màu nhạt — đúng những trường hợp "visual cue bị nhiễu" mà VisionLAN nhắm tới, nên đây là một hướng khả thi để đọc thẳng tên thuốc thay vì phân loại theo ảnh. Ưu điểm so với cách phân loại 250 lớp như DLDI/IDL: OCR không cần train lại khi thêm thuốc mới (đúng hạn chế "phải train lại toàn bộ" mà DLDI nêu). Nhưng có rủi ro riêng: năng lực ngôn ngữ học từ từ tiếng Anh thông thường có thể "tự sửa" tên thuốc lạ hoặc hàm lượng (vd "300/12.5 mg") thành chuỗi quen thuộc hơn — trong y tế, đoán sai một chữ số còn nguy hiểm hơn không đọc được. Muốn áp dụng cần fine-tune trên tên thuốc, mở rộng bộ kí tự (chữ hoa, "/", ".", "-") và so khớp kết quả với danh mục thuốc của bệnh viện (lexicon) để chặn lỗi.',
        terms: [
          { term: 'Closed-set classification vs open-vocabulary OCR', explain: 'Phân loại chỉ nhận ra các lớp đã train (250 thuốc); OCR đọc được chuỗi bất kì nên mở rộng sang thuốc mới mà không cần train lại, nhưng phải tự xử lý lỗi đọc.' },
          { term: 'Lexicon matching', explain: 'Đối chiếu chuỗi OCR đọc được với danh sách từ hợp lệ (vd danh mục thuốc), chọn mục gần nhất — cách đơn giản để tăng độ an toàn khi áp dụng OCR vào y tế.' },
          { term: 'Fine-tuning', explain: 'Train tiếp mô hình đã học trên dữ liệu lớn bằng dữ liệu của miền mới (ảnh vỉ thuốc) để thích nghi với font, kiểu chữ và từ vựng đặc thù.' },
        ],
      },
    ],
  },
]

export function getResearchPaper(slug: string): ResearchPaper | undefined {
  return RESEARCH_PAPERS.find((p) => p.slug === slug)
}
