---
title: Machine Learning là gì?
short: Machine Learning là gì?
icon: 🤖
summary: Bức tranh tổng quan — AI, Machine Learning và Deep Learning khác nhau thế nào, máy "học" theo những kiểu nào, và một model đi từ lúc học tới lúc dùng thật ra sao.
---

# Mục tiêu
- Phân biệt được AI, Machine Learning và Deep Learning
- Hiểu 4 kiểu học: Supervised, Unsupervised, Semi-supervised, Reinforcement
- Phân biệt bài toán Classification và Regression, biết Feature và Target là gì
- Hiểu 2 giai đoạn Training và Inference của một model
- Biết các thuật toán phổ biến và cách chọn thuật toán cho một bài toán

# AI, Machine Learning và Deep Learning

Ba khái niệm này lồng vào nhau như ba vòng tròn, vòng sau nằm trong vòng trước:

- **AI (Artificial Intelligence – trí tuệ nhân tạo)** là vòng lớn nhất: mọi kỹ thuật giúp máy tính làm được việc "có vẻ thông minh" như con người — chơi cờ, hiểu tiếng nói, nhận ra khuôn mặt…
- **[[Machine Learning]]** là một nhánh của AI: thay vì lập trình viên viết sẵn từng luật "nếu… thì…", ta đưa cho máy thật nhiều dữ liệu và để máy **tự rút ra quy luật**. Câu định nghĩa kinh điển: Machine Learning *cho máy tính khả năng học mà không cần được lập trình tường minh*.
- **[[Deep Learning]]** là một nhánh của Machine Learning, dùng [[Neural Network]] nhiều lớp (mạng nơ-ron "sâu"). Deep Learning đặc biệt mạnh với dữ liệu phức tạp như ảnh, âm thanh, văn bản.

![AI bao trùm Machine Learning, Machine Learning bao trùm Deep Learning — mỗi vòng ra đời sau và chuyên sâu hơn vòng ngoài.](/it/ml/ai-ml-dl-timeline.webp =1504x986)

::: analogy Lập trình truyền thống vs Machine Learning
Muốn làm bộ lọc thư rác theo kiểu truyền thống, bạn phải tự viết luật: "nếu thư có chữ *trúng thưởng* thì là spam". Nhưng kẻ gửi spam đổi chữ liên tục, bạn viết luật không kịp.

Với Machine Learning, bạn đưa cho máy 100.000 email đã được đánh dấu sẵn "spam" hoặc "không spam". Máy tự tìm ra dấu hiệu nào hay đi kèm thư rác. Khi có kiểu spam mới, chỉ cần cho máy học thêm dữ liệu mới.
:::

# 4 kiểu học của Machine Learning

Cách phân loại quan trọng nhất là dựa vào **dữ liệu có đáp án sẵn hay không**.

| Kiểu học | Dữ liệu | Giống như… | Ví dụ thực tế |
|---|---|---|---|
| [[Supervised Learning]] | Có đáp án ([[Label]]) cho mọi mẫu | Học sinh học kèm sách có lời giải | Lọc spam, đoán giá nhà, phát hiện ung thư |
| [[Unsupervised Learning]] | Không có đáp án | Tự xếp một đống đồ lộn xộn thành nhóm, không ai hướng dẫn | Chia nhóm khách hàng, phát hiện bất thường |
| [[Semi-supervised Learning]] | Một ít có đáp án + rất nhiều không có | Học ngoại ngữ với 10 câu có bản dịch + 10.000 câu không có | Google Photos gom ảnh theo khuôn mặt |
| [[Reinforcement Learning]] | Không có đáp án, chỉ có **thưởng/phạt** sau mỗi hành động | Dạy chó: làm đúng cho bánh, làm sai thì nhắc | AlphaGo, robot tập đi, xe tự lái |

### Supervised Learning — học có đáp án

Mỗi mẫu dữ liệu gồm 2 phần: **đầu vào X** và **đáp án Y**. Máy học cách đi từ X ra Y, để sau này gặp X mới thì tự đoán được Y.

- **[[Feature]]** (đặc trưng): các cột thông tin dùng để dự đoán — ví dụ với email: nội dung, tiêu đề, giờ gửi.
- **[[Target]]** (mục tiêu): cột cần dự đoán — ví dụ: "spam" hay "không spam".

Supervised Learning chia thành 2 loại bài toán, phân biệt bằng **kiểu của đáp án**:

| | [[Classification]] (phân loại) | [[Regression]] (hồi quy) |
|---|---|---|
| Đáp án là | Một **nhóm/nhãn** trong danh sách có hạn | Một **con số** bất kỳ |
| Câu hỏi | "Cái này thuộc loại nào?" | "Bao nhiêu?" |
| Ví dụ | Email → spam / không spam; ảnh X-quang → ung thư / khỏe mạnh; ảnh → chó / mèo / chim | Diện tích nhà → giá 250.000 USD; số giờ học → điểm GPA 3.7; nhiệt độ hôm nay → nhiệt độ ngày mai 34.5°C |
| Ý tưởng | Vẽ một **đường ranh giới** ([[Decision Boundary]]) ngăn cách các nhóm | Vẽ một **đường/đường cong** đi xuyên qua dữ liệu |

::: tip Mẹo phân biệt nhanh
Đáp án nằm trong một danh sách hữu hạn → Classification. Đáp án có thể là bất kỳ con số nào → Regression.
:::

Một ví dụ khác của Supervised: dự đoán vị trí khung chữ nhật ([[Bounding Box]]) bao quanh một vật trong ảnh — Feature là các điểm ảnh (pixel), Target là tọa độ 4 góc của khung.

![Khung xanh lá là đáp án thật (ground-truth), khung đỏ là khung model dự đoán — model học cách đưa khung dự đoán khớp với đáp án.](/it/ml/bounding-box.webp =751x570)

### Unsupervised Learning — tự tìm ra cấu trúc

Dữ liệu chỉ có X, không có Y. Máy tự tìm ra cấu trúc ẩn bên trong. Các việc thường làm:

- **[[Clustering]]** (phân cụm): gom những mẫu giống nhau vào chung nhóm.
- **[[Anomaly Detection]]** (phát hiện bất thường): tìm những mẫu "lạc loài".
- **[[Dimensionality Reduction]]** (giảm chiều): nén nhiều cột thông tin thành ít cột hơn mà không mất nhiều ý nghĩa.

::: example Chia nhóm khách hàng cho một shop online
Shop có dữ liệu lịch sử mua hàng: tần suất mua, số tiền trung bình… nhưng **không ai gắn nhãn** khách nào thuộc loại gì. Thuật toán [[K-Means]] tự tìm ra 3 nhóm:

- **Nhóm A** — chi nhiều, ít mua → khách VIP → gửi ưu đãi độc quyền, được mua sớm.
- **Nhóm B** — chi ít, mua thường xuyên → khách săn sale trung thành → gửi mã giảm giá hằng tuần.
- **Nhóm C** — chi vừa, lâu lâu mới ghé → khách sắp rời bỏ → gửi email kéo khách quay lại.

Điểm hay: không ai nói cho model biết có những nhóm nào — nó tự khám phá ra.
:::

### Semi-supervised Learning — vừa có vừa không

Gán nhãn dữ liệu rất tốn công (ví dụ cần bác sĩ đọc từng ảnh y khoa). Semi-supervised tận dụng **một ít dữ liệu có nhãn** cùng **rất nhiều dữ liệu chưa có nhãn** để học.

### Reinforcement Learning — học bằng thưởng và phạt

Có một **[[Agent]]** (tác tử — "bộ não" đang học) sống trong một **môi trường**. Ở mỗi bước:

1. Agent nhìn **trạng thái** ([[State]]) hiện tại.
2. Agent chọn một **hành động** ([[Action]]).
3. Môi trường trả về **phần thưởng** ([[Reward]]) và trạng thái mới.
4. Lặp lại tới khi kết thúc.

::: example Dạy AI chơi Pac-Man
- State: vị trí hiện tại trên bàn chơi.
- Action: đi lên / xuống / trái / phải.
- Reward: ăn được chấm +10, đụng ma −100, đi an toàn 0.

Mục tiêu của agent là **tối đa tổng phần thưởng về lâu dài**, không chỉ của bước kế tiếp. Có khi phải chịu thiệt trước mắt (đi gần con ma) để được lợi lớn hơn (ăn viên năng lượng).
:::

Ứng dụng thật: AlphaGo, cánh tay robot, hệ thống làm mát trung tâm dữ liệu của Google DeepMind.

# Training và Inference — hai giai đoạn của một model

Một **[[Model]]** là "sản phẩm" sau khi máy học xong — có thể hình dung như một hàm số nhận đầu vào và trả ra dự đoán. Bên trong model có rất nhiều con số gọi là **[[Weight]]** (trọng số), quyết định model dự đoán ra sao.

- **[[Training]]** (huấn luyện): cho model xem dữ liệu có đáp án. Model đoán → so với đáp án → tính xem sai bao nhiêu (dùng một [[Evaluation Metric]] hoặc hàm lỗi) → chỉnh lại weight cho bớt sai. Lặp lại rất nhiều lần.
- **[[Inference]]** (suy luận/dùng thật): model đã học xong, đưa dữ liệu **mới chưa từng thấy** vào để nhận dự đoán.

::: analogy
Training giống quá trình ôn thi, Inference giống lúc đi thi thật. Mục tiêu cuối cùng không phải là thuộc lòng bài ôn, mà là **làm tốt đề thi mới** — trong ML gọi là khả năng [[Generalization]] (tổng quát hóa).
:::

# Các thuật toán phổ biến và cách chọn

### Thuật toán cho Supervised Learning

| Thuật toán | Hình dung như… | Dùng tốt khi… |
|---|---|---|
| [[Linear Regression]] | Vẽ một đường thẳng qua dữ liệu | Đầu ra là con số liên tục |
| [[Logistic Regression]] | Xem điểm nằm bên nào của một đường ranh giới | Phân loại có/không |
| [[Decision Tree]] | Trò chơi "20 câu hỏi" có/không | Cần giải thích được vì sao ra quyết định |
| [[SVM]] | Tìm "con đường" rộng nhất ngăn cách hai nhóm | Dữ liệu nhỏ, nhiều chiều |
| [[Naive Bayes]] | Đếm tần suất từ xuất hiện | Phân loại văn bản, lọc spam |
| [[kNN]] | "Hãy cho tôi biết bạn của bạn là ai…" | Dữ liệu nhỏ, quan hệ cục bộ |
| [[Random Forest]] | 100 cây quyết định cùng bỏ phiếu | Đa năng, chịu được nhiễu |
| [[XGBoost]] | Mỗi model mới sửa lỗi của model trước | Dữ liệu dạng bảng, thi Kaggle |

### Thuật toán cho Unsupervised Learning

- **Clustering**: K-Means, MeanShift, Hierarchical (phân cụm phân cấp), [[DBSCAN]].
- **Giảm chiều**: [[PCA]].

### Chọn thuật toán thế nào?

Khi chọn model, cân nhắc: thời gian train, tốc độ dự đoán, lượng dữ liệu cần có, kiểu dữ liệu, độ phức tạp của bài toán — model mạnh giải được bài khó nhưng cũng dễ "làm phức tạp hóa" một bài dễ.

Sơ đồ chọn nhanh:

- **Có dữ liệu có đáp án?**
  - Đáp án là **nhãn** (spam/không, có/không):
    - Cần giải thích quyết định → Decision Tree hoặc Logistic Regression
    - Cần độ chính xác cao nhất → Random Forest hoặc XGBoost
  - Đáp án là **con số** (giá, nhiệt độ, điểm):
    - Quan hệ gần tuyến tính → Linear Regression, Ridge Regression
    - Phức tạp, phi tuyến → Gradient Boosting, Neural Network
- **Không có đáp án?**
  - Muốn tìm nhóm → K-Means
  - Muốn tìm điểm bất thường → [[Isolation Forest]]
  - Có quá nhiều cột → PCA

::: tip Không có thuật toán nào tốt nhất cho mọi bài toán
Lựa chọn tùy vào kích thước dữ liệu, mức cần giải thích và loại bài toán. Nguyên tắc vàng: **bắt đầu từ model đơn giản** (ví dụ Logistic Regression), chỉ chuyển sang model phức tạp khi thực sự cần.
:::

# Ghi nhớ nhanh
- AI ⊃ Machine Learning ⊃ Deep Learning.
- Machine Learning = máy tự rút quy luật từ dữ liệu thay vì được lập trình sẵn từng luật.
- Supervised (có đáp án), Unsupervised (không đáp án), Semi-supervised (ít đáp án), Reinforcement (thưởng/phạt).
- Classification đoán **nhãn**, Regression đoán **con số**.
- Feature = thông tin đầu vào; Target = thứ cần đoán.
- Training = học từ dữ liệu cũ; Inference = dự đoán trên dữ liệu mới. Mục tiêu là làm tốt trên dữ liệu mới.

# Thuật ngữ
- **Machine Learning**: Một nhánh của AI, trong đó máy tính tự tìm ra quy luật từ dữ liệu thay vì được con người viết sẵn từng luật "nếu… thì…". Ta cho máy xem thật nhiều ví dụ, máy rút ra cách làm, rồi áp dụng cho trường hợp mới. Ví dụ: cho máy xem 100.000 email đã đánh dấu spam/không spam, máy tự học ra dấu hiệu của thư rác mà không ai phải liệt kê từ khoá.
- **Deep Learning**: Một nhánh của Machine Learning dùng mạng nơ-ron có rất nhiều lớp ("sâu"). Mỗi lớp học một mức độ trừu tượng khác nhau, nên mạng tự học được đặc trưng mà không cần con người thiết kế. Đặc biệt mạnh với ảnh, âm thanh, văn bản và cần nhiều dữ liệu. Ví dụ: nhận diện khuôn mặt để mở khoá điện thoại, dịch tự động, chatbot.
- **Neural Network**: Mạng nơ-ron nhân tạo — một mô hình gồm rất nhiều "nơ-ron" nhỏ xếp thành các lớp và nối với nhau, lấy cảm hứng từ não người. Mỗi nơ-ron chỉ làm phép tính đơn giản (nhân, cộng, rồi qua một hàm), nhưng ghép nhiều nơ-ron lại thì mô tả được quan hệ rất phức tạp. Ví dụ: một mạng nhận ảnh chữ số viết tay ở lớp đầu và trả ra "đây là số 7" ở lớp cuối.
- **Supervised Learning**: Học có giám sát — mỗi mẫu dữ liệu train đều đi kèm đáp án đúng (nhãn), máy học cách đi từ đầu vào ra đáp án. Giống học sinh luyện đề có lời giải: làm xong so với đáp án để sửa. Đây là kiểu học phổ biến nhất trong thực tế. Ví dụ: dữ liệu nhà có kèm giá bán → học cách đoán giá nhà mới.
- **Unsupervised Learning**: Học không giám sát — dữ liệu chỉ có đầu vào, không có đáp án; máy tự tìm cấu trúc ẩn bên trong như các nhóm tương tự hay điểm bất thường. Dùng khi không có (hoặc không đủ tiền để có) nhãn. Ví dụ: tự chia khách hàng thành nhóm "VIP", "săn sale", "sắp rời bỏ" dựa trên lịch sử mua mà không ai đặt tên nhóm trước.
- **Semi-supervised Learning**: Học bán giám sát — kết hợp một ít dữ liệu có nhãn với rất nhiều dữ liệu chưa có nhãn. Hữu ích khi gán nhãn đắt đỏ (cần chuyên gia). Phần có nhãn chỉ hướng, phần không nhãn giúp model hiểu rõ hơn hình dạng dữ liệu. Ví dụ: chỉ vài trăm ảnh y khoa được bác sĩ chẩn đoán, cùng hàng chục nghìn ảnh chưa ai đọc.
- **Reinforcement Learning**: Học tăng cường — máy (agent) học qua thử và sai: làm một hành động, nhận phần thưởng hoặc hình phạt, rồi điều chỉnh để tối đa tổng phần thưởng về lâu dài. Không có đáp án đúng cho từng bước, chỉ có tín hiệu tốt/xấu. Ví dụ: AlphaGo tự chơi cờ hàng triệu ván, thắng thì được thưởng, thua thì bị phạt.
- **Label**: Nhãn — đáp án đúng gắn với một mẫu dữ liệu, chính là thứ model cần học cách đoán ra. Thường do con người gán, nên tốn công và có thể bị gán sai. Ví dụ: ảnh con mèo kèm nhãn "mèo"; email kèm nhãn "spam".
- **Feature**: Đặc trưng — một cột thông tin mô tả mẫu dữ liệu, được dùng làm đầu vào để model dự đoán. Chọn và tạo feature tốt ảnh hưởng rất lớn tới chất lượng model. Ví dụ: với bài toán đoán giá nhà, các feature là diện tích, số phòng ngủ, khoảng cách tới trung tâm.
- **Target**: Cột mục tiêu — giá trị mà model cần dự đoán, còn gọi là biến phụ thuộc hay nhãn. Trong dữ liệu train ta biết target; khi dùng thật thì target là thứ chưa biết. Ví dụ: cột "giá bán" trong bảng dữ liệu nhà đất.
- **Classification**: Bài toán phân loại — đáp án là một nhóm/nhãn nằm trong một danh sách có hạn. Model trả lời câu hỏi "cái này thuộc loại nào?", thường kèm xác suất cho từng loại. Ví dụ: email → spam hoặc không spam; ảnh → chó, mèo hoặc chim.
- **Regression**: Bài toán hồi quy — đáp án là một con số liên tục, có thể nhận bất kỳ giá trị nào trong một khoảng. Model trả lời câu hỏi "bao nhiêu?". Ví dụ: đoán giá nhà 2,35 tỉ đồng; dự báo nhiệt độ ngày mai 34,5°C.
- **Decision Boundary**: Đường ranh giới quyết định — đường (hoặc mặt) mà model phân loại vẽ ra để chia không gian dữ liệu thành các vùng; điểm rơi vào vùng nào thì được gán lớp đó. Ranh giới có thể là đường thẳng (model đơn giản) hoặc cong ngoằn ngoèo (model phức tạp). Ví dụ: một đường thẳng chia mặt phẳng "số giờ học – số giờ ngủ" thành vùng "đậu" và vùng "rớt".
- **Bounding Box**: Khung chữ nhật bao quanh một vật thể trong ảnh, được xác định bằng toạ độ các góc (hoặc góc trên trái + chiều rộng, chiều cao). Bài toán phát hiện vật thể (object detection) phải đoán cả khung lẫn nhãn của vật. Ví dụ: khung bao quanh biển báo STOP trong ảnh chụp đường phố.
- **Clustering**: Phân cụm — gom các mẫu giống nhau vào cùng một nhóm mà không cần biết trước nhãn; mẫu trong cùng cụm gần nhau, khác cụm thì xa nhau. Là kỹ thuật Unsupervised phổ biến nhất. Ví dụ: gom bài báo thành các chủ đề, gom khách hàng theo hành vi mua sắm.
- **Anomaly Detection**: Phát hiện bất thường — tìm những mẫu khác hẳn phần đông dữ liệu. Thường dùng khi trường hợp bất thường rất hiếm và khó thu thập nhãn. Ví dụ: giao dịch thẻ tín dụng lạ lúc 3 giờ sáng ở nước ngoài, cảm biến máy móc đột ngột báo nhiệt độ vọt cao.
- **Dimensionality Reduction**: Giảm chiều — nén dữ liệu có nhiều cột thành ít cột hơn nhưng vẫn giữ được phần lớn thông tin. Giúp model chạy nhanh hơn, bớt overfitting và cho phép vẽ dữ liệu lên hình 2D/3D để nhìn. Ví dụ: nén 784 điểm ảnh của một chữ số viết tay xuống 2 con số để vẽ lên mặt phẳng.
- **K-Means**: Thuật toán phân cụm chia dữ liệu thành K nhóm. Cách làm: chọn K "tâm" ban đầu, gán mỗi điểm vào tâm gần nhất, dời mỗi tâm về trung bình các điểm của nó, lặp lại tới khi ổn định. Phải chọn trước số cụm K. Ví dụ: K = 3 để chia khách hàng thành 3 phân khúc.
- **Agent**: Tác tử — "bộ não" ra quyết định trong Reinforcement Learning. Agent quan sát trạng thái, chọn hành động và học từ phần thưởng nhận về. Ví dụ: chương trình điều khiển nhân vật Pac-Man, phần mềm lái xe tự động.
- **State**: Trạng thái — toàn bộ thông tin mà agent quan sát được về tình huống hiện tại, làm căn cứ để chọn hành động tiếp theo. Ví dụ: vị trí Pac-Man, vị trí các con ma và các chấm còn lại trên bàn chơi.
- **Action**: Hành động — lựa chọn mà agent thực hiện ở mỗi bước, làm thay đổi trạng thái của môi trường. Tập hành động có thể rời rạc hoặc liên tục. Ví dụ: đi lên/xuống/trái/phải trong Pac-Man; góc đánh lái trong xe tự lái.
- **Reward**: Phần thưởng — con số môi trường trả về sau mỗi hành động để báo hành động đó tốt hay xấu (số âm là hình phạt). Agent cố gắng tối đa tổng phần thưởng về lâu dài, không chỉ phần thưởng trước mắt. Ví dụ: +10 khi ăn được chấm, −100 khi đụng ma.
- **Model**: Sản phẩm thu được sau khi máy học xong — có thể hình dung như một hàm số nhận đầu vào và trả ra dự đoán. Bên trong model là các con số (weight) đã được điều chỉnh từ dữ liệu. Ví dụ: một model nhận diện tích, số phòng và trả ra giá nhà dự đoán.
- **Weight**: Trọng số — các con số bên trong model quyết định mỗi đầu vào ảnh hưởng tới kết quả nhiều hay ít. "Học" thực chất là tìm ra bộ weight tốt nhất. Một model lớn có thể có hàng triệu tới hàng tỉ weight. Ví dụ: giá = 50 + 0,8 × diện tích — số 0,8 là weight của feature diện tích.
- **Training**: Huấn luyện — quá trình cho model xem dữ liệu có đáp án; model đoán, so với đáp án để biết sai bao nhiêu, rồi chỉnh weight cho bớt sai; lặp lại rất nhiều lần. Đây là giai đoạn tốn thời gian và tài nguyên nhất. Ví dụ: train model nhận diện ảnh trên GPU suốt vài giờ với hàng chục nghìn ảnh.
- **Inference**: Suy luận — giai đoạn dùng model đã học xong để dự đoán trên dữ liệu mới; weight không thay đổi nữa. Thường cần nhanh vì phục vụ người dùng thật. Ví dụ: khi bạn chụp ảnh, điện thoại chạy model để nhận diện khuôn mặt trong vài mili giây.
- **Evaluation Metric**: Thước đo đánh giá — con số cho biết model làm tốt tới đâu, dùng để so sánh các model với nhau. Chọn sai metric có thể khiến một model tệ trông như tốt. Ví dụ: Accuracy (tỉ lệ đoán đúng) cho bài phân loại; sai số trung bình cho bài đoán giá.
- **Generalization**: Khả năng tổng quát hoá — model làm tốt cả trên dữ liệu mới chưa từng thấy, chứ không chỉ trên dữ liệu đã học. Đây mới là mục tiêu thật sự của Machine Learning. Ví dụ: học sinh hiểu bản chất thì làm được đề mới; học vẹt thì chỉ làm được đề đã ôn.
- **Linear Regression**: Hồi quy tuyến tính — thuật toán dự đoán một con số bằng cách vẽ đường thẳng (hoặc mặt phẳng nếu nhiều feature) đi gần các điểm dữ liệu nhất. Đơn giản, nhanh, dễ giải thích; là điểm khởi đầu kinh điển. Ví dụ: lương = 8 triệu + 1,5 triệu × số năm kinh nghiệm.
- **Logistic Regression**: Thuật toán phân loại (dù tên có chữ Regression): tính một tổng có trọng số như Linear Regression rồi đưa qua hàm sigmoid để ra xác suất từ 0 đến 1, sau đó so với ngưỡng để quyết định lớp. Ví dụ: xác suất email là spam = 0,92 → lớn hơn 0,5 nên xếp vào spam.
- **Decision Tree**: Cây quyết định — model đưa ra kết luận bằng một chuỗi câu hỏi có/không, giống trò chơi "20 câu hỏi". Rất dễ hiểu và giải thích được, nhưng một cây đơn lẻ dễ overfitting. Ví dụ: "Thu nhập > 20 triệu?" → có → "Đã có nợ xấu?" → không → duyệt cho vay.
- **SVM** (Support Vector Machine): Thuật toán phân loại tìm đường ranh giới sao cho "khoảng trống" (margin) giữa hai nhóm là rộng nhất — giống kẻ một con đường rộng nhất có thể giữa hai khu dân cư. Hoạt động tốt với dữ liệu nhỏ, nhiều chiều. Ví dụ: phân loại văn bản, nhận dạng chữ viết tay.
- **Naive Bayes**: Thuật toán phân loại dựa trên định lý Bayes, với giả định "ngây thơ" rằng các feature độc lập với nhau. Giả định này hiếm khi đúng hẳn nhưng model vẫn chạy rất tốt, nhanh và cần ít dữ liệu. Ví dụ: lọc spam dựa trên tần suất các từ như "miễn phí", "trúng thưởng".
- **kNN** (k-Nearest Neighbors): Thuật toán dự đoán một điểm mới bằng cách nhìn k điểm gần nó nhất trong dữ liệu train rồi bỏ phiếu (phân loại) hoặc lấy trung bình (hồi quy). Không có bước train thật sự, nhưng dự đoán chậm khi dữ liệu lớn. Ví dụ: k = 5, trong 5 căn nhà gần nhất có 4 căn giá cao → đoán căn mới giá cao.
- **Random Forest**: Rừng ngẫu nhiên — tập hợp rất nhiều cây quyết định, mỗi cây học trên một phần dữ liệu và một phần feature được chọn ngẫu nhiên, rồi cùng bỏ phiếu. Nhờ "trí tuệ đám đông" nên chính xác và ổn định hơn một cây đơn. Ví dụ: 300 cây cùng bỏ phiếu xem một giao dịch có gian lận không.
- **XGBoost** (eXtreme Gradient Boosting): Thư viện Boosting rất mạnh: các cây được xây nối tiếp nhau, cây sau tập trung sửa lỗi của các cây trước, kèm nhiều kỹ thuật chống overfitting và tối ưu tốc độ. Thường cho kết quả tốt nhất với dữ liệu dạng bảng. Ví dụ: chấm điểm tín dụng, dự đoán khách hàng rời bỏ, các cuộc thi Kaggle.
- **DBSCAN**: Thuật toán phân cụm dựa trên mật độ: vùng nào có nhiều điểm sát nhau thì thành một cụm; điểm nằm lẻ loi ở vùng thưa bị đánh dấu là nhiễu. Không cần chọn trước số cụm và tìm được cụm hình dạng bất kỳ. Ví dụ: tìm các khu vực tập trung nhiều cửa hàng trên bản đồ, loại các điểm lẻ.
- **PCA** (Principal Component Analysis): Kỹ thuật giảm chiều tìm ra vài "hướng chính" mà dữ liệu trải rộng nhiều nhất, rồi chiếu dữ liệu lên các hướng đó. Giữ vài hướng đầu là giữ được phần lớn thông tin với ít cột hơn hẳn. Ví dụ: nén 100 chỉ số tài chính của doanh nghiệp xuống 5 thành phần chính.
- **Isolation Forest**: Thuật toán phát hiện bất thường dựa trên ý tưởng: điểm bất thường nằm lẻ loi nên chỉ cần vài nhát cắt ngẫu nhiên là bị tách riêng, còn điểm bình thường nằm giữa đám đông cần rất nhiều nhát. Nhanh và hiệu quả với dữ liệu lớn. Ví dụ: phát hiện giao dịch gian lận, lỗi trong log hệ thống.
