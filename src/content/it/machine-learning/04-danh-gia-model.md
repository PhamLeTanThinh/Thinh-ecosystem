---
title: Đánh giá model — Train/Test, Cross-Validation & Metrics
short: Đánh giá model
icon: 🎯
summary: Làm sao biết model "tốt"? Bài này giải thích vì sao phải tách dữ liệu train/test, Overfitting và Underfitting là gì, Cross-Validation hoạt động ra sao, và cách chọn đúng thước đo — Accuracy, Precision, Recall, F1, AUC, MAE, RMSE, R².
---

# Mục tiêu
- Hiểu vì sao không được đánh giá model trên chính dữ liệu đã dùng để train
- Nhận biết Overfitting và Underfitting
- Biết cách làm Train-Test Split và K-Fold Cross-Validation
- Đọc được Confusion Matrix và tính Accuracy, Precision, Recall, F1
- Biết khi nào ưu tiên Precision, khi nào ưu tiên Recall
- Nắm các metric cho bài toán Regression

# Overfitting và Underfitting

Mục tiêu của model là làm tốt trên **dữ liệu mới chưa từng thấy**. Thử tưởng tượng ta cần vẽ một đường cong đi qua các điểm dữ liệu:

- **[[Underfitting]]** — đường quá đơn giản (ví dụ một đường thẳng cho dữ liệu cong). Model bỏ sót xu hướng chính: **sai nhiều cả trên dữ liệu train lẫn dữ liệu mới**.
- **Vừa khít** — đường nắm được xu hướng chung mà không bám vào từng điểm.
- **[[Overfitting]]** — đường uốn éo đi qua **từng điểm một**, kể cả những điểm nhiễu. **Train gần như hoàn hảo, nhưng dữ liệu mới thì sai nhiều** vì model đã học thuộc cả nhiễu ([[Noise]]).

!viz[Fit đa thức với bậc tăng dần trên cùng 11 điểm train (xanh). Bậc 1 quá đơn giản; bậc 2–3 vừa khít; bậc càng cao càng uốn qua đúng từng điểm: lỗi train giảm về gần 0 nhưng lỗi trên dữ liệu mới (điểm xám) tăng vọt — đó là overfitting.](poly-fit-error)

::: analogy Ba kiểu học sinh đi thi
| Underfitting | Vừa khít | Overfitting |
|---|---|---|
| Gần như không học, "cứ chọn B hết" | Học hiểu bản chất | Học thuộc lòng từng câu "trang 47 dòng 3" |
| Làm bài ôn: kém | Làm bài ôn: tốt | Làm bài ôn: điểm tuyệt đối |
| Thi đề mới: kém | Thi đề mới: tốt | Thi đề mới: kém |
:::

**Cách khắc phục:**
- Underfitting → dùng model phức tạp hơn, thêm feature.
- Overfitting → thêm dữ liệu train, dùng [[Regularization]] (L1/L2), [[Dropout]], [[Early Stopping]] (sẽ học ở các bài sau).

# Train-Test Split — giữ lại "đề thi" chưa ai thấy

Vấn đề: lúc train ta chưa có dữ liệu tương lai. Còn nếu chấm điểm model trên chính dữ liệu đã dùng để train, kết quả sẽ **đẹp giả tạo** (giống cho học sinh thi đúng đề đã ôn).

Giải pháp: chia dữ liệu thành 2 phần.
- **[[Training Set]]** (ví dụ 70–80%): dùng để model học.
- **[[Test Set]]** (20–30%): **cất đi, không dùng gì trong lúc train**, chỉ lấy ra để chấm điểm cuối cùng — mô phỏng dữ liệu mới ngoài đời thật.

![Một phần dữ liệu (màu xanh) được cất riêng làm test set, không dùng gì trong lúc train.](/it/ml/train-test-split.webp =977x513)

Thực tế còn hay tách thêm **[[Validation Set]]** (tập kiểm định) để chọn model và chỉnh [[Hyperparameter]] trong quá trình phát triển. Test set chỉ dùng **một lần** ở cuối.

```python
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

# Cross-Validation — chấm điểm công bằng hơn

Chia train/test **một lần** thì điểm số có thể "hên" hoặc "xui" tùy phần dữ liệu rơi vào test.

**[[K-Fold Cross-Validation]]** giải quyết bằng cách chia dữ liệu thành K phần bằng nhau, rồi chạy K vòng — mỗi vòng lấy **một phần khác nhau** làm test, K−1 phần còn lại để train:

```
K = 5:
Vòng 1: [Test ][Train][Train][Train][Train]
Vòng 2: [Train][Test ][Train][Train][Train]
Vòng 3: [Train][Train][Test ][Train][Train]
Vòng 4: [Train][Train][Train][Test ][Train]
Vòng 5: [Train][Train][Train][Train][Test ]
```

!viz[5-Fold: mỗi lượt một phần khác nhau (màu cam) làm test, bốn phần còn lại để train; điểm cuối cùng là trung bình của 5 lượt.](k-fold)

Kết quả là K điểm số, ví dụ [91%, 89%, 93%, 88%, 90%] → báo cáo **trung bình 90.2% ± 1.7%**. Mỗi mẫu dữ liệu đều được làm test đúng một lần, nên ước lượng đáng tin hơn hẳn. Trong thực tế thường chọn **K = 5 hoặc 10**.

```python
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5)
print(scores.mean(), scores.std())
```

# Cost Function — model "sai bao nhiêu"?

Trong lúc học, model cần một con số để biết mình đang sai bao nhiêu, gọi là [[Loss Function]] (hay Cost Function). Mục tiêu train là **làm con số này nhỏ nhất**.

### MSE cho Regression

**[[MSE]]** — lấy từng sai số, bình phương, rồi tính trung bình:

::: example
Đáp án thật [3.0, 5.0, 7.0], model đoán [2.8, 5.2, 6.5].
Bình phương sai số: 0.04, 0.04, 0.25 → $\text{MSE} = 0.33 / 3 =$ **0.11** (nhỏ → model tốt).
:::

Bình phương làm sai số lớn bị phạt nặng hơn nhiều so với sai số nhỏ.

### Cross-Entropy cho Classification

**[[Cross-Entropy]]** (hay [[Log Loss]]) đo khoảng cách giữa xác suất model đoán và đáp án thật:

::: example
Ảnh là con mèo ($y = 1$):
- Model đoán "mèo" với xác suất 0.9 → loss $= -\log(0.9) =$ **0.105** (nhỏ)
- Model đoán "mèo" với xác suất 0.1 → loss $= -\log(0.1) =$ **2.303** (lớn!)
:::

Cross-Entropy **phạt rất nặng những dự đoán sai mà lại tự tin**. Nhờ vậy model vừa phải đoán đúng, vừa phải có mức tự tin hợp lý.

# Confusion Matrix — nền tảng của mọi metric phân loại

Với bài toán phân loại 2 lớp (Positive/Negative), mỗi dự đoán rơi vào 1 trong 4 ô của **[[Confusion Matrix]]**:

| | Model đoán **Positive** | Model đoán **Negative** |
|---|---|---|
| **Thực tế Positive** | [[TP]] — đoán đúng là có | [[FN]] — bỏ sót |
| **Thực tế Negative** | [[FP]] — báo động nhầm | [[TN]] — đoán đúng là không |

- **FP** còn gọi là **lỗi loại I** (Type I Error): "kêu có mà thật ra không".
- **FN** còn gọi là **lỗi loại II** (Type II Error): "kêu không mà thật ra có".

::: example Model lọc spam test trên 1.000 email
| | Đoán SPAM | Đoán KHÔNG SPAM |
|---|---|---|
| Thật là SPAM | TP = 90 (bắt được) | FN = 10 (lọt vào hộp thư) |
| Thật KHÔNG SPAM | FP = 5 (chặn nhầm) | TN = 895 (cho qua đúng) |

- **Accuracy** $= \dfrac{90 + 895}{1000} =$ **98.5%** — nghe rất đẹp
- **Precision** $= \dfrac{90}{90 + 5} =$ **94.7%** — trong những thư bị chặn, bao nhiêu là spam thật?
- **Recall** $= \dfrac{90}{90 + 10} =$ **90.0%** — trong spam thật, bắt được bao nhiêu?
- **F1** $= \dfrac{2 \times 0.947 \times 0.90}{0.947 + 0.90} \approx$ **92.3%**

Accuracy 98.5% nghe hoàn hảo, nhưng vẫn có 10 email spam lọt vào hộp thư.
:::

# Các metric phân loại và khi nào dùng

### Accuracy

::: formula
$$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$$
:::

Tỉ lệ đoán đúng trên tổng số. Chỉ đáng tin khi dữ liệu **cân bằng** giữa các lớp.

::: warn Cái bẫy của Accuracy
Bài toán phát hiện gian lận: 99.9% giao dịch bình thường, 0.1% gian lận. Một model "lười" luôn đoán *bình thường* đạt Accuracy **99.9%** — nhưng không bắt được vụ gian lận nào. Dữ liệu lệch như vậy gọi là [[Imbalanced Data]].
:::

### Precision và Recall

::: formula
$$\text{Precision} = \frac{TP}{TP + FP} \qquad\qquad \text{Recall} = \frac{TP}{TP + FN}$$
:::

- **[[Precision]]** — "Khi model nói CÓ, nó đúng bao nhiêu %?" Ưu tiên khi **báo động nhầm (FP) rất tốn kém**.
- **[[Recall]]** — "Trong các trường hợp CÓ thật, model bắt được bao nhiêu %?" Ưu tiên khi **bỏ sót (FN) rất nguy hiểm**.

Hai chỉ số này thường **giằng co nhau**: cố tăng cái này thì cái kia giảm.

### F1-Score

::: formula
$$F_1 = \frac{2 \times \text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$$
:::

**[[F1-Score]]** là trung bình điều hòa của Precision và Recall — chỉ cao khi **cả hai cùng cao**, và bị kéo xuống mạnh nếu một trong hai thấp.

### Chọn metric theo tình huống

| Tình huống | Lỗi nào đáng sợ hơn | Ưu tiên |
|---|---|---|
| Tầm soát ung thư | Bỏ sót người bệnh (FN) — nguy hiểm tính mạng | **Recall cao** — "thà báo nhầm còn hơn bỏ sót" |
| Lọc thư rác | Chặn nhầm email quan trọng (FP) | **Precision cao** — "chỉ chặn khi thật chắc" |
| Phát hiện gian lận, gợi ý sản phẩm, tìm kiếm | Cả hai đều quan trọng | **F1** |
| So sánh nhiều model, không muốn phụ thuộc ngưỡng | — | **AUC-ROC** |
| Dữ liệu cân bằng | — | Accuracy dùng được |

### ROC Curve và AUC

Model phân loại thường trả ra **xác suất** (ví dụ 0.73), rồi so với một **[[Threshold]]** (ngưỡng, thường là 0.5) để quyết định Positive hay Negative. Đổi ngưỡng thì TP/FP thay đổi theo.

**[[ROC Curve]]** vẽ, với **mọi ngưỡng có thể**, hai đại lượng:
- Trục tung: **TPR** (True Positive Rate) = Recall = TP / (TP + FN), còn gọi là **Sensitivity**.
- Trục hoành: **FPR** (False Positive Rate) = FP / (FP + TN) = 1 − **Specificity**.

!viz[Trái: điểm số model chấm cho hai lớp, kéo ngưỡng chạy qua lại. Phải: mỗi vị trí ngưỡng cho một cặp (FPR, TPR) — một điểm trên đường ROC. Ngưỡng càng dễ dãi càng bắt được nhiều Positive nhưng cũng báo nhầm nhiều hơn.](roc-threshold)

**[[AUC]]** là diện tích dưới đường ROC, từ 0 đến 1:

| AUC | Đánh giá |
|---|---|
| 0.9 – 1.0 | Xuất sắc |
| 0.8 – 0.9 | Tốt |
| 0.7 – 0.8 | Tạm được |
| 0.5 | Như đoán bừa (tung đồng xu) |

AUC **không phụ thuộc ngưỡng**, nên rất hợp để so sánh nhiều model với nhau.

# Metric cho bài toán Regression

| Metric | Ý nghĩa | Đặc điểm |
|---|---|---|
| [[MAE]] | Trung bình độ lớn sai số | Dễ hiểu (cùng đơn vị với dữ liệu), ít bị outlier kéo |
| [[MSE]] | Trung bình bình phương sai số | Phạt nặng sai số lớn; hay dùng làm loss khi train |
| [[RMSE]] | Căn bậc hai của MSE | Cùng đơn vị với dữ liệu, vẫn phạt nặng sai số lớn — hay dùng trong tài chính, dự báo thời tiết |
| [[MAPE]] | Sai số tính theo % | So sánh được giữa các bài toán khác thang đo |
| [[R²]] | Model giải thích được bao nhiêu % biến động của dữ liệu | 1 = hoàn hảo, 0 = không hơn gì đoán bằng giá trị trung bình |

::: tip Gắn metric với mục tiêu kinh doanh
Metric tốt nhất là metric nói được bằng tiền hoặc tác động thật — ví dụ "giảm 10% số ca bỏ sót giúp tiết kiệm 200.000 USD/năm". Và luôn báo cáo kết quả cuối cùng trên **test set**, không phải validation set.
:::

# Ghi nhớ nhanh
- Underfitting: kém cả train lẫn test. Overfitting: train rất tốt, test kém.
- Không bao giờ chấm điểm model trên dữ liệu đã dùng để train; test set chỉ dùng một lần ở cuối.
- K-Fold Cross-Validation (K = 5 hoặc 10) cho kết quả trung bình ± độ lệch, đáng tin hơn một lần chia.
- Precision = đúng bao nhiêu khi nói CÓ; Recall = bắt được bao nhiêu trong số CÓ thật.
- Dữ liệu lệch lớp → đừng tin Accuracy, xem Precision/Recall/F1/AUC.
- Regression: MAE dễ hiểu, RMSE phạt nặng sai số lớn, R² cho biết tỉ lệ biến động được giải thích.

# Thuật ngữ
- **Underfitting**: Model quá đơn giản nên không nắm được xu hướng chính của dữ liệu — làm kém cả trên dữ liệu train lẫn dữ liệu mới (high bias). Khắc phục: dùng model phức tạp hơn, thêm feature, giảm regularization. Ví dụ: dùng một đường thẳng cho dữ liệu có hình chữ U.
- **Overfitting**: Model học thuộc lòng cả nhiễu trong dữ liệu train — điểm train rất cao nhưng gặp dữ liệu mới thì sai nhiều (high variance). Khắc phục: thêm dữ liệu, regularization, dropout, early stopping, đơn giản hoá model. Ví dụ: đa thức bậc 15 uốn éo đi qua đúng từng điểm train nhưng dự đoán điểm mới rất tệ.
- **Noise**: Nhiễu — phần ngẫu nhiên, vô nghĩa lẫn trong dữ liệu, không phản ánh quy luật thật. Model tốt phải bỏ qua nhiễu; model overfit thì học luôn cả nhiễu. Ví dụ: sai số khi đo, nhập liệu nhầm, nhãn bị gán sai.
- **Regularization**: Kỹ thuật "phạt" model khi nó quá phức tạp (thường là phạt weight lớn) để model đơn giản hơn và bớt overfitting. Mức phạt điều chỉnh bằng một hyperparameter. Ví dụ: L2 regularization cộng thêm λ × tổng bình phương các weight vào hàm lỗi.
- **Dropout**: Kỹ thuật regularization cho mạng nơ-ron: mỗi bước train tắt ngẫu nhiên một tỉ lệ nơ-ron (cho đầu ra bằng 0). Mạng buộc phải học đặc trưng bền vững, không ỷ lại vài nơ-ron cụ thể. Khi dự đoán thì dùng đủ mọi nơ-ron. Ví dụ: Dropout(0,5) tắt ngẫu nhiên một nửa số nơ-ron ở mỗi bước train.
- **Early Stopping**: Dừng train sớm khi kết quả trên validation set không còn cải thiện sau một số epoch, rồi lấy lại weight của epoch tốt nhất. Tránh việc model tiếp tục học vẹt khi đã đạt điểm tốt nhất. Ví dụ: val_loss không giảm suốt 10 epoch liên tiếp → dừng.
- **Training Set**: Tập huấn luyện — phần dữ liệu (thường 60–80%) dùng để model học, tức để điều chỉnh weight. Điểm số trên tập này luôn lạc quan hơn thực tế. Ví dụ: 8.000 trong 10.000 email dùng để train bộ lọc spam.
- **Test Set**: Tập kiểm tra — phần dữ liệu được cất riêng, không dùng trong bất kỳ bước train hay chỉnh model nào, chỉ dùng một lần ở cuối để đánh giá model trên dữ liệu "mới". Ví dụ: 2.000 email còn lại, chỉ mở ra chấm điểm khi model đã chốt.
- **Validation Set**: Tập kiểm định — phần dữ liệu dùng trong quá trình phát triển để so sánh các model, chọn hyperparameter, quyết định khi nào dừng train. Tách riêng với test set để test set vẫn "chưa ai thấy". Ví dụ: chia 70% train, 15% validation, 15% test.
- **Hyperparameter**: Siêu tham số — các thiết lập do con người chọn trước khi train, model không tự học ra được (khác với weight). Phải thử nhiều giá trị và chọn bằng validation hoặc cross-validation. Ví dụ: learning rate, số cây trong Random Forest, độ sâu tối đa của cây, k trong kNN.
- **K-Fold Cross-Validation**: Chia dữ liệu thành K phần bằng nhau, chạy K lượt: mỗi lượt lấy một phần khác nhau làm test, K−1 phần còn lại để train; kết quả là trung bình (± độ lệch) của K lần. Đáng tin hơn chia train/test một lần vì mọi mẫu đều được làm test đúng một lần. Ví dụ: 5-fold cho 5 điểm [91, 89, 93, 88, 90]% → báo cáo 90,2% ± 1,7%.
- **MSE** (Mean Squared Error): Trung bình bình phương sai số — lấy (dự đoán − thật)², cộng hết rồi chia cho số mẫu. Bình phương khiến sai số lớn bị phạt nặng hơn nhiều. Vừa là loss phổ biến khi train, vừa là metric cho bài toán hồi quy. Ví dụ: sai số [0,2; −0,2; 0,5] → MSE = (0,04 + 0,04 + 0,25)/3 = 0,11.
- **Cross-Entropy**: Hàm lỗi cho bài toán phân loại — đo khoảng cách giữa xác suất model đoán và đáp án thật. Đoán đúng mà tự tin thì loss gần 0; đoán sai mà tự tin thì loss rất lớn. Ví dụ: ảnh là mèo, model nói 90% mèo → loss 0,105; model nói 10% mèo → loss 2,303.
- **Log Loss**: Tên gọi khác của Binary Cross-Entropy — Cross-Entropy cho bài toán 2 lớp: L = −[y·log(p) + (1−y)·log(1−p)]. Là hàm lỗi chuẩn của Logistic Regression. Ví dụ: đáp án y = 1, dự đoán p = 0,8 → loss = −log(0,8) ≈ 0,22.
- **Confusion Matrix**: Ma trận nhầm lẫn — bảng đếm số dự đoán đúng/sai theo từng lớp: hàng là thực tế, cột là dự đoán. Với 2 lớp có 4 ô TP, FP, FN, TN; mọi metric phân loại đều tính từ bảng này. Ví dụ: 90 spam bắt đúng, 10 spam lọt, 5 thư thường bị chặn nhầm, 895 thư thường cho qua đúng.
- **TP** (True Positive): Thực tế là Positive và model cũng đoán Positive — trường hợp "bắt đúng". Ví dụ: email spam bị bộ lọc chặn đúng.
- **TN** (True Negative): Thực tế là Negative và model cũng đoán Negative — trường hợp "cho qua đúng". Ví dụ: email bình thường được đưa vào hộp thư như bình thường.
- **FP** (False Positive): Thực tế là Negative nhưng model đoán Positive — "báo động nhầm", còn gọi là lỗi loại I. Tốn kém khi việc báo nhầm gây hậu quả. Ví dụ: email quan trọng của sếp bị đưa nhầm vào thư rác.
- **FN** (False Negative): Thực tế là Positive nhưng model đoán Negative — "bỏ sót", còn gọi là lỗi loại II. Nguy hiểm khi bỏ sót gây hậu quả nghiêm trọng. Ví dụ: bệnh nhân bị ung thư nhưng model kết luận khỏe mạnh.
- **Imbalanced Data**: Dữ liệu mất cân bằng — một lớp chiếm áp đảo, lớp kia rất hiếm. Model dễ "lười" đoán toàn lớp đông mà vẫn được Accuracy rất cao. Cần dùng Precision/Recall/F1/AUC và các kỹ thuật cân bằng lại dữ liệu. Ví dụ: 99,9% giao dịch bình thường, chỉ 0,1% gian lận.
- **Precision**: Độ chuẩn xác — trong những trường hợp model nói "có", bao nhiêu phần trăm là đúng: TP / (TP + FP). Ưu tiên khi báo nhầm gây tốn kém. Ví dụ: chặn 95 email, trong đó 90 email là spam thật → Precision = 94,7%.
- **Recall**: Độ phủ (còn gọi Sensitivity, TPR) — trong những trường hợp "có" thật, model bắt được bao nhiêu phần trăm: TP / (TP + FN). Ưu tiên khi bỏ sót nguy hiểm. Ví dụ: có 100 email spam, bắt được 90 → Recall = 90%.
- **F1-Score**: Trung bình điều hoà của Precision và Recall: 2 × P × R / (P + R). Chỉ cao khi cả hai cùng cao, và bị kéo xuống mạnh nếu một trong hai thấp — hợp với dữ liệu lệch lớp. Ví dụ: P = 94,7%, R = 90% → F1 ≈ 92,3%; còn P = 100%, R = 10% thì F1 chỉ khoảng 18%.
- **Threshold**: Ngưỡng — mức xác suất để quyết định một mẫu là Positive (thường mặc định 0,5). Hạ ngưỡng thì bắt được nhiều hơn (Recall tăng) nhưng báo nhầm nhiều hơn (Precision giảm), và ngược lại. Ví dụ: tầm soát ung thư hạ ngưỡng xuống 0,2 để ít bỏ sót.
- **ROC Curve**: Đường cong vẽ tỉ lệ bắt đúng (TPR) theo tỉ lệ báo nhầm (FPR) khi thay đổi ngưỡng từ 0 tới 1. Đường càng ôm sát góc trên bên trái thì model càng tốt; đường chéo là đoán bừa. Ví dụ: dùng để chọn ngưỡng cân bằng giữa bắt đúng và báo nhầm.
- **AUC** (Area Under the Curve): Diện tích dưới đường ROC, từ 0 đến 1: 1 là hoàn hảo, 0,5 là như tung đồng xu. Có thể hiểu là xác suất model chấm điểm một mẫu Positive ngẫu nhiên cao hơn một mẫu Negative ngẫu nhiên. Không phụ thuộc ngưỡng nên tiện so sánh model. Ví dụ: AUC 0,92 → model phân biệt hai lớp rất tốt.
- **MAE** (Mean Absolute Error): Trung bình giá trị tuyệt đối của sai số. Cùng đơn vị với dữ liệu nên dễ hiểu, và ít bị outlier kéo hơn MSE. Ví dụ: MAE = 50 triệu nghĩa là trung bình model đoán giá nhà lệch khoảng 50 triệu.
- **RMSE** (Root Mean Squared Error): Căn bậc hai của MSE — đưa về cùng đơn vị với dữ liệu nhưng vẫn phạt nặng sai số lớn. Luôn ≥ MAE; chênh lệch càng nhiều nghĩa là có vài sai số rất lớn. Ví dụ: hay dùng trong dự báo thời tiết, tài chính, nơi sai lớn một lần gây hậu quả nặng.
- **MAPE** (Mean Absolute Percentage Error): Sai số tuyệt đối trung bình tính theo phần trăm giá trị thật. Dễ so sánh giữa các bài toán khác thang đo, nhưng không dùng được khi giá trị thật gần 0. Ví dụ: MAPE 8% nghĩa là trung bình dự báo doanh số lệch 8% so với thực tế.
- **R²**: Hệ số xác định — tỉ lệ biến động của dữ liệu mà model giải thích được: 1 là hoàn hảo, 0 là không hơn việc luôn đoán bằng giá trị trung bình (có thể âm nếu còn tệ hơn thế). Ví dụ: R² = 0,85 → model giải thích được 85% sự khác nhau về giá giữa các căn nhà.
