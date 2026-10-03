---
title: Xác suất & Thống kê cho ML
short: Xác suất & Thống kê
icon: 🎲
summary: Machine Learning sống nhờ dữ liệu, mà dữ liệu thì luôn có yếu tố ngẫu nhiên. Bài này đi qua những công cụ thống kê dùng nhiều nhất — Bayes, phân phối, trung bình/độ lệch chuẩn, covariance, correlation, entropy, kiểm định giả thuyết và p-value.
---

# Mục tiêu
- Hiểu định lý Bayes và áp dụng vào bài toán lọc spam
- Phân biệt phân phối rời rạc và liên tục (Binomial, Gaussian)
- Biết Population/Sample, các cách lấy mẫu và các loại biến
- Mô tả dữ liệu bằng trung tâm, độ phân tán và hình dạng
- Tính và diễn giải Covariance, Correlation, Entropy, Information Gain
- Hiểu kiểm định giả thuyết và đọc đúng p-value

# Xác suất cơ bản

- **[[Random Variable]]** (biến ngẫu nhiên): một đại lượng mà giá trị phụ thuộc vào may rủi — ví dụ kết quả tung xúc xắc, số khách vào cửa hàng hôm nay.
- **[[Probability Distribution]]** (phân phối xác suất): bảng/hàm cho biết mỗi kết quả có xác suất xảy ra bao nhiêu.

Có hai nhóm phân phối:

| | Rời rạc (Discrete) | Liên tục (Continuous) |
|---|---|---|
| Giá trị | Đếm được: 0, 1, 2, … | Bất kỳ số nào trong một khoảng |
| Ví dụ tiêu biểu | [[Binomial Distribution]] — số lần thành công trong n lần thử | [[Gaussian Distribution]] — hình chuông, như chiều cao, điểm thi |
| Dùng trong ML | Bài toán phân loại, A/B testing | Rất nhiều model giả định dữ liệu có dạng Gaussian; chuẩn hóa feature; Gaussian Mixture Model |

::: example Gaussian và Binomial trong thực tế
**Điểm thi** có trung bình 75, độ lệch chuẩn 10 (dạng hình chuông). Có bao nhiêu % học sinh trên 90 điểm?
```python
import scipy.stats as stats
prob_above_90 = 1 - stats.norm.cdf(90, 75, 10)
print(f'{prob_above_90:.1%}')   # 6.7%
```
**A/B testing**: 1.000 người xem quảng cáo, mỗi người có 5% khả năng bấm vào. Số lượt bấm theo phân phối Binomial:
```python
clicks = stats.binom(n=1000, p=0.05)
print(clicks.mean(), clicks.std())   # 50.0  6.89
```
Trung bình kỳ vọng 50 lượt bấm, dao động khoảng ±6.89 — dùng để biết một kết quả "khác thường" tới mức nào.
:::

# Định lý Bayes — cập nhật niềm tin khi có bằng chứng

::: formula
P(h | d) = P(d | h) × P(h) / P(d)
:::

Với **h** là giả thuyết (hypothesis), **d** là dữ liệu quan sát được (data):

- **P(h)** — [[Prior]]: niềm tin ban đầu về giả thuyết, **trước khi** thấy dữ liệu.
- **P(d | h)** — [[Likelihood]]: nếu giả thuyết đúng thì khả năng thấy được dữ liệu này là bao nhiêu.
- **P(d)** — Evidence: xác suất thấy dữ liệu này nói chung.
- **P(h | d)** — [[Posterior]]: niềm tin **sau khi** đã thấy dữ liệu.

::: example Một email chứa chữ "free" có phải spam?
- 30% email là spam → P(Spam) = 0.30
- 80% email spam có chữ "free" → P(free | Spam) = 0.80
- 40% tất cả email có chữ "free" → P(free) = 0.40

P(Spam | free) = 0.80 × 0.30 / 0.40 = **0.60**

Thấy chữ "free", khả năng là spam tăng từ 30% lên **60%**.
:::

Đây chính là nguyên lý của bộ phân loại [[Naive Bayes]]:

```python
from sklearn.naive_bayes import MultinomialNB
model = MultinomialNB()
model.fit(X_train_counts, y_train)    # X = số lần xuất hiện của từng từ
predictions = model.predict(X_test_counts)
```

Bayes còn là nền tảng của [[Bayesian Network]] — mô hình suy luận xác suất giữa nhiều biến.

# Thống kê — những khái niệm nền

**Statistics** (thống kê) là ngành thu thập, phân tích, diễn giải và trình bày dữ liệu. Chỉ nhìn bảng số thô thì khó rút ra điều gì; thống kê cho ta cái nhìn nhanh bằng con số và biểu đồ.

### Population và Sample

- **[[Population]]** (tổng thể): toàn bộ nhóm ta muốn tìm hiểu.
- **[[Sample]]** (mẫu): một phần nhỏ được chọn ra để nghiên cứu, vì khảo sát hết tổng thể thường không làm nổi.

![Population là cả "hồ cá", sample là vài con được vớt lên để nghiên cứu — đặc điểm của sample được dùng để suy ra cả hồ.](/it/ml/population-sample.webp =1223x542)

::: example
Muốn biết GPA của sinh viên IT Việt Nam (khoảng 500.000 người ở hơn 200 trường) — không thể hỏi hết. Chọn ngẫu nhiên 200 sinh viên ở 5 trường làm sample, đo được GPA trung bình 7.2 với sai số ±0.3 (độ tin cậy 95%) → suy ra GPA của cả tổng thể vào khoảng 7.2 ± 0.3.

**Liên hệ ML**: tập train chính là một sample. Tập test dùng để ước lượng model sẽ làm tốt tới đâu trên "tổng thể" — tức dữ liệu thật ngoài kia.
:::

### Các cách lấy mẫu

- **Lấy mẫu xác suất** (mỗi phần tử đều có cơ hội được chọn):
  - **Random** — ngẫu nhiên đơn giản, ai cũng có cơ hội như nhau.
  - **Systematic** — chọn đều đặn, ví dụ cứ 2 bản ghi lấy 1.
  - **[[Stratified Sampling]]** — chia tổng thể thành các nhóm con theo một đặc điểm chung (giới tính, khu vực…) rồi lấy ngẫu nhiên trong **từng** nhóm, đảm bảo nhóm nào cũng có mặt.
- **Lấy mẫu phi xác suất**: theo hạn ngạch (Quota), theo đánh giá của chuyên gia (Judgment), hoặc lấy ai tiện thì lấy (Convenience) — dễ làm nhưng dễ bị lệch.

### Các loại biến

- **Biến định lượng** (Quantitative — là con số):
  - Liên tục: độ pH, chỉ số cholesterol.
  - Rời rạc: số khuẩn lạc trong đĩa nuôi cấy.
- **Biến định tính** (Categorical — là nhóm):
  - **Nominal** — không có thứ tự: giới tính, nhóm máu.
  - **Ordinal** — có thứ tự: bệnh nhẹ < vừa < nặng. Thường được đổi thành số 1, 2, 3 để dùng như biến định lượng.

# Mô tả dữ liệu (Descriptive Statistics)

Thống kê chia hai loại:
- **Descriptive** (mô tả): tóm tắt dữ liệu đang có.
- **Inferential** (suy luận): từ sample suy ra kết luận về population, dựa trên xác suất.

Một cột số được mô tả bằng 3 góc nhìn:

| Góc nhìn | Đại lượng | Ý nghĩa |
|---|---|---|
| **Trung tâm** | [[Mean]], [[Median]], [[Mode]] | Dữ liệu "thường" nằm ở đâu |
| **Độ phân tán** | [[Standard Deviation]], [[Variance]], Range (max − min) | Dữ liệu trải rộng cỡ nào |
| **Hình dạng** | [[Skewness]], [[Kurtosis]] | Lệch về bên nào, đuôi dày hay mỏng |

Với cột định tính thì mô tả bằng **tần suất**, **phần trăm** của từng nhóm.

::: tip Mean hay Median?
Mean bị kéo lệch mạnh bởi giá trị cực đoan. Lương của 9 nhân viên 10 triệu + 1 sếp 500 triệu: mean = 59 triệu (chẳng ai có mức lương này), median = 10 triệu (phản ánh đúng hơn). Dữ liệu có [[Outlier]] thì nên xem median.
:::

# Covariance và Correlation — hai biến có "đi cùng nhau"?

### Covariance

**[[Covariance]]** đo xu hướng hai biến **cùng tăng cùng giảm**:
- Cov > 0: X tăng thì Y thường tăng (học nhiều → điểm cao).
- Cov < 0: X tăng thì Y thường giảm (học nhiều → thời gian chơi game ít).
- Cov ≈ 0: không có quan hệ tuyến tính.

::: example Tính Covariance
Giờ học X = [2, 4, 6, 8], điểm thi Y = [50, 65, 75, 90].

- Trung bình: X̄ = 5, Ȳ = 70
- Độ lệch so với trung bình: X → [−3, −1, 1, 3]; Y → [−20, −5, 5, 20]
- Nhân từng cặp rồi cộng: 60 + 5 + 5 + 60 = 130
- Chia cho (n − 1) = 3: **Cov(X, Y) ≈ 43.33** → dương, học nhiều thì điểm cao.

```python
np.cov(X, Y)[0, 1]    # 43.33
```
:::

Nhược điểm: độ lớn của covariance phụ thuộc đơn vị đo (đổi điểm thang 10 sang thang 100 là covariance đổi theo), nên khó so sánh.

**Liên hệ ML**: hai feature có |covariance| cao nghĩa là chúng gần như mang cùng thông tin — hiện tượng [[Multicollinearity]]. Bỏ bớt một feature giúp model ổn định và dễ giải thích hơn.

### Correlation

**[[Correlation]]** là covariance đã được "chuẩn hóa" về khoảng **−1 đến 1**, không phụ thuộc đơn vị:

::: formula
r = Cov(X, Y) / (σX × σY)
:::

- r = 1: tương quan thuận hoàn hảo; r = −1: tương quan nghịch hoàn hảo; r = 0: không tương quan tuyến tính.
- Cách đọc độ mạnh (giá trị tuyệt đối): 0.9–1.0 rất mạnh · 0.7–0.9 mạnh · 0.5–0.7 vừa · dưới 0.5 yếu (ví dụ 0.25 là tương quan thuận khá yếu).

!viz[Cùng một đám điểm, hệ số tương quan r chạy từ +1 về −1 rồi quay lại: r gần ±1 thì các điểm xếp gần thành một đường thẳng, r gần 0 thì tản mát không theo hướng nào.](correlation)

![Mỗi đám điểm kèm hệ số tương quan: càng giống một đường thẳng thì |r| càng gần 1. Hàng dưới: quan hệ rõ ràng nhưng không tuyến tính vẫn cho r = 0.](/it/ml/correlation-examples.webp =1600x747)

::: example Pearson Correlation
```python
hours  = np.array([2, 4, 6, 8, 10])
scores = np.array([50, 65, 75, 88, 95])
r, p_value = stats.pearsonr(hours, scores)
# r ≈ 0.994 (rất mạnh),  p_value ≈ 0.0006
```
p-value rất nhỏ → mối tương quan này gần như chắc chắn không phải do ngẫu nhiên (xem phần kiểm định bên dưới).
:::

::: warn Tương quan không phải nhân quả
Doanh số kem và số vụ đuối nước tương quan thuận — nhưng ăn kem không gây đuối nước; cả hai cùng tăng vì trời nóng.
:::

# Entropy — đo mức "hỗn loạn"

**[[Entropy]]** đo **mức độ không chắc chắn** (hay độ "lộn xộn") của dữ liệu:

::: formula
H = − Σ pᵢ × log₂(pᵢ)
:::

với pᵢ là xác suất của từng khả năng. Đơn vị là **bit**.

::: example Câu trắc nghiệm 4 đáp án — học sinh chắc chắn tới đâu?
| Tình huống | Xác suất chọn A, B, C, D | Entropy |
|---|---|---|
| Biết chắc đáp án | 0.97 / 0.01 / 0.01 / 0.01 | ≈ 0.24 bit (rất thấp) |
| Loại được 2 đáp án sai | 0.5 / 0.5 / 0 / 0 | 1.0 bit |
| Đoán bừa | 0.25 / 0.25 / 0.25 / 0.25 | 2.0 bit (cao nhất) |

- Entropy = 0 → hoàn toàn chắc chắn (chỉ một khả năng).
- Entropy lớn nhất = log₂(n) khi mọi khả năng bằng nhau — 4 lựa chọn thì tối đa là log₂(4) = 2 bit.
- Entropy cao = cần thêm thông tin mới quyết định được; entropy thấp = đã đủ thông tin.
:::

### Information Gain — Decision Tree dùng entropy để chọn câu hỏi

**[[Information Gain]]** = entropy trước khi chia − entropy (trung bình có trọng số) sau khi chia. Câu hỏi nào làm dữ liệu "bớt lộn xộn" nhiều nhất thì được chọn.

::: example Chia email theo từ "discount"
- Nút gốc: 10 spam, 10 không spam → H = 1.0 bit (50/50, lộn xộn nhất).
- Chia theo "có chữ discount không?":
  - Có: 8 spam, 2 không → H ≈ 0.722 bit
  - Không: 2 spam, 8 không → H ≈ 0.722 bit
- Entropy trung bình sau khi chia = 0.722
- **Information Gain = 1.0 − 0.722 = 0.278 bit**

[[Decision Tree]] thử mọi câu hỏi có thể, ở mỗi nút chọn câu hỏi có Information Gain cao nhất.
:::

# Kiểm định giả thuyết (Hypothesis Testing)

Ta muốn chứng minh một điều gì đó — ví dụ "model A tốt hơn model B". Chứng minh trực tiếp thì khó, nên ta làm ngược lại: giả sử điều ngược lại là đúng, rồi xem dữ liệu có **mâu thuẫn quá mức** với giả sử đó không.

- **[[Null Hypothesis]] (H0)** — giả thuyết "không có gì xảy ra": đồng xu cân bằng, hai nhóm giống nhau, hai model ngang nhau.
- **[[Alternative Hypothesis]] (H1)** — điều ta muốn chứng minh: đồng xu bị lệch, hai nhóm khác nhau.
- **[[p-value]]**: nếu H0 đúng thì xác suất thấy được kết quả "lệch" như dữ liệu này (hoặc lệch hơn) là bao nhiêu.
- **[[Significance Level]] α**: ngưỡng chọn trước, thường là 0.05 (cũng hay dùng 0.01, 0.001…).

**Quy tắc**: p-value < α → **bác bỏ H0**, chấp nhận H1. p-value ≥ α → **chưa đủ bằng chứng** bác bỏ H0 (không có nghĩa là H0 chắc chắn đúng). α chính là tỉ lệ "báo động nhầm" mà ta chấp nhận.

!viz[Thống kê kiểm định z chạy qua lại: phần tô màu ở hai đuôi (ngoài |z|) chính là p-value. Khi z lọt vào vùng bác bỏ (ngoài ±1,96) thì p < 0,05 và ta bác bỏ H0.](two-tailed-test)

::: example So sánh 2 model bằng kiểm định
Test trên 1.000 mẫu: model A đúng 850 (85%), model B đúng 820 (82%). A có thật sự tốt hơn?

- H0: hai model chính xác ngang nhau. H1: khác nhau.
- Kiểm định tỉ lệ cho ra **p-value ≈ 0.07**.
- 0.07 > 0.05 → **chưa bác bỏ được H0**. Chênh 3% nhìn thì có vẻ hơn, nhưng với 1.000 mẫu, mức chênh này vẫn có thể do may rủi.

Muốn kết luận chắc hơn: test trên nhiều dữ liệu hơn. Ngoài ra vì hai model cùng chấm trên **một** bộ test, cách chuẩn là dùng kiểm định ghép cặp như **McNemar test** thay vì coi như hai nhóm độc lập.
:::

### Một số kiểm định thường gặp

| Kiểm định | Dùng để | Hàm trong `scipy.stats` |
|---|---|---|
| **Pearson correlation test** | Hai biến số có tương quan không? H0: **không** tương quan | `pearsonr(x, y)` |
| **One-sample [[T-Test]]** | Trung bình của dữ liệu có bằng một giá trị cho trước? | `ttest_1samp(X, given_mean)` |
| **Two-sample T-Test** | Trung bình của hai nhóm có bằng nhau? | `ttest_ind(x, y)` |
| **One-way [[ANOVA]]** (F-test) | Trung bình của **2 nhóm trở lên** có bằng nhau? | `f_oneway(x, y, z)` |

::: tip Đọc kết quả Pearson cho đúng
Với Pearson, H0 là "hai biến **không** tương quan". Hai biến càng tương quan mạnh thì p-value càng **gần 0** (bằng chứng chống H0 càng mạnh). p-value nhỏ hơn 0.05 → kết luận hai biến tương quan có ý nghĩa thống kê.
:::

# Ước lượng tham số (Parameter Estimation)

Thống kê suy luận còn dùng sample để **ước lượng** những con số chưa biết của population (gọi là tham số — parameter), ví dụ trung bình thật của cả tổng thể:

- **Method of Moments**: cho các "moment" của sample (trung bình, phương sai…) bằng các moment tương ứng của population rồi giải ra tham số.
- **[[MLE]]**: chọn giá trị tham số làm cho dữ liệu quan sát được **có khả năng xảy ra cao nhất**. Rất nhiều model ML được huấn luyện theo đúng tinh thần này.
- **[[MAP]]**: giống MLE nhưng có thêm niềm tin ban đầu (prior) theo kiểu Bayes.
- **Unbiased estimator**: bộ ước lượng mà trung bình trên nhiều lần lấy mẫu thì trúng giá trị thật — không bị lệch có hệ thống.

# Ghi nhớ nhanh
- Bayes: Posterior = Likelihood × Prior / Evidence — cập nhật niềm tin khi có bằng chứng mới.
- Train set là một sample; mục tiêu là làm tốt trên population (dữ liệu thật).
- Dữ liệu có outlier thì median đáng tin hơn mean.
- Covariance cho biết chiều quan hệ; Correlation (−1 đến 1) cho biết cả chiều lẫn độ mạnh. Tương quan ≠ nhân quả.
- Entropy đo độ lộn xộn; Decision Tree chọn câu hỏi có Information Gain cao nhất.
- p-value < α (thường 0.05) → bác bỏ H0. p-value lớn không chứng minh H0 đúng.

# Thuật ngữ
- **Random Variable**: Biến ngẫu nhiên — đại lượng mà giá trị phụ thuộc vào kết quả của một hiện tượng may rủi. Có loại rời rạc (đếm được) và liên tục (đo được). Ví dụ: số chấm khi tung xúc xắc (1–6); chiều cao của một người được chọn ngẫu nhiên.
- **Probability Distribution**: Phân phối xác suất — mô tả mỗi giá trị có thể xảy ra của biến ngẫu nhiên đi kèm xác suất bao nhiêu (tổng xác suất bằng 1). Biết phân phối là biết "hình dạng" của sự ngẫu nhiên. Ví dụ: xúc xắc cân bằng có phân phối đều, mỗi mặt 1/6.
- **Binomial Distribution**: Phân phối nhị thức — đếm số lần "thành công" trong n lần thử độc lập, mỗi lần có cùng xác suất thành công p. Trung bình bằng n×p. Ví dụ: 1.000 người xem quảng cáo, mỗi người có 5% khả năng bấm → số lượt bấm theo phân phối Binomial, trung bình 50.
- **Gaussian Distribution**: Phân phối chuẩn (Normal) — dạng hình chuông đối xứng quanh giá trị trung bình, xác định bởi trung bình và độ lệch chuẩn. Khoảng 68% dữ liệu nằm trong ±1 độ lệch chuẩn, 95% trong ±2, 99,7% trong ±3. Rất nhiều hiện tượng tự nhiên có dạng này. Ví dụ: chiều cao người trưởng thành, điểm thi của một lớp đông.
- **Prior**: Xác suất tiên nghiệm — niềm tin ban đầu về một giả thuyết trước khi thấy bằng chứng mới. Trong định lý Bayes, prior được cập nhật thành posterior khi có dữ liệu. Ví dụ: biết 30% email là spam → prior P(spam) = 0,3.
- **Likelihood**: Khả năng — nếu giả thuyết đúng thì xác suất quan sát được dữ liệu này là bao nhiêu. Đo mức dữ liệu "ủng hộ" giả thuyết. Ví dụ: nếu email là spam thì có 80% khả năng chứa chữ "free" → P(free | spam) = 0,8.
- **Posterior**: Xác suất hậu nghiệm — niềm tin về giả thuyết sau khi đã thấy dữ liệu, tính bằng định lý Bayes: Posterior = Likelihood × Prior / Evidence. Ví dụ: thấy chữ "free" thì xác suất email là spam tăng từ 30% (prior) lên 60% (posterior).
- **Bayesian Network**: Mạng Bayes — mô hình dạng đồ thị: mỗi nút là một biến, mũi tên thể hiện biến này ảnh hưởng xác suất của biến kia. Dùng để suy luận nguyên nhân – kết quả khi không chắc chắn. Ví dụ: mạng nối "hút thuốc" → "ung thư phổi" → "ho", để từ triệu chứng ho suy ngược khả năng mắc bệnh.
- **Population**: Tổng thể — toàn bộ nhóm đối tượng mà ta muốn tìm hiểu. Thường quá lớn để khảo sát hết, nên ta chỉ nghiên cứu một phần (sample) rồi suy rộng. Ví dụ: tất cả sinh viên IT ở Việt Nam.
- **Sample**: Mẫu — một phần nhỏ được chọn ra từ tổng thể để nghiên cứu. Mẫu phải chọn sao cho đại diện được tổng thể, nếu không kết luận sẽ bị lệch. Trong ML, tập train chính là một sample. Ví dụ: 200 sinh viên chọn ngẫu nhiên từ 5 trường.
- **Stratified Sampling**: Lấy mẫu phân tầng — chia tổng thể thành các nhóm con theo một đặc điểm (giới tính, vùng miền, lớp nhãn…) rồi lấy ngẫu nhiên trong từng nhóm theo đúng tỉ lệ. Đảm bảo nhóm nhỏ không bị bỏ sót. Ví dụ: dữ liệu có 10% gian lận thì cả tập train lẫn tập test đều giữ đúng 10% gian lận.
- **Mean**: Trung bình cộng — tổng các giá trị chia cho số lượng. Dễ tính nhưng bị kéo lệch mạnh bởi giá trị cực đoan. Ví dụ: lương [10, 10, 10, 500] triệu có mean 132,5 triệu — không phản ánh đúng người nào.
- **Median**: Trung vị — giá trị nằm chính giữa khi xếp dữ liệu từ nhỏ tới lớn (một nửa nhỏ hơn, một nửa lớn hơn). Ít bị ảnh hưởng bởi giá trị cực đoan nên đáng tin hơn mean khi có outlier. Ví dụ: lương [10, 10, 10, 500] triệu có median 10 triệu.
- **Mode**: Yếu vị — giá trị xuất hiện nhiều lần nhất. Dùng được cả cho dữ liệu dạng chữ (nhóm phổ biến nhất). Ví dụ: size áo bán chạy nhất là M; trong [2, 3, 3, 5] mode là 3.
- **Standard Deviation**: Độ lệch chuẩn — căn bậc hai của phương sai; cho biết các giá trị thường cách trung bình bao xa, và có cùng đơn vị với dữ liệu nên dễ hiểu hơn variance. Ví dụ: điểm thi trung bình 75, độ lệch chuẩn 10 → phần lớn học sinh được 65–85 điểm.
- **Skewness**: Độ lệch — cho biết phân phối bị "kéo đuôi" về một bên thay vì đối xứng. Lệch phải (dương) là có đuôi dài về phía giá trị lớn; lệch trái (âm) là ngược lại. Ví dụ: thu nhập thường lệch phải — đa số thu nhập vừa phải, một số ít rất cao.
- **Kurtosis**: Độ nhọn — đo "độ dày đuôi" của phân phối, tức các giá trị cực đoan xuất hiện thường hay hiếm so với phân phối chuẩn. Kurtosis cao là hay có giá trị bất thường lớn. Ví dụ: lợi nhuận cổ phiếu có kurtosis cao — thỉnh thoảng có ngày tăng/giảm cực mạnh.
- **Outlier**: Điểm ngoại lai — giá trị khác thường, nằm xa hẳn phần lớn dữ liệu. Có thể là lỗi (nhập sai, cảm biến hỏng) hoặc sự kiện hiếm có thật (gian lận). Outlier làm lệch mean và nhiều model, nên cần phát hiện rồi quyết định xử lý. Ví dụ: tuổi khách hàng ghi 999; một giao dịch 5 tỉ trong khi trung bình 500 nghìn.
- **Covariance**: Hiệp phương sai — đo xu hướng hai biến cùng tăng cùng giảm. Dương: một biến tăng thì biến kia thường tăng; âm: ngược chiều; gần 0: không có quan hệ tuyến tính. Độ lớn phụ thuộc đơn vị đo nên khó so sánh. Ví dụ: số giờ học và điểm thi có covariance dương.
- **Multicollinearity**: Đa cộng tuyến — hai hay nhiều feature tương quan rất mạnh với nhau, mang gần như cùng một thông tin. Làm model tuyến tính không ổn định: hệ số dao động mạnh và khó diễn giải. Cách xử lý: bỏ bớt feature hoặc dùng regularization. Ví dụ: "diện tích tính bằng m²" và "diện tích tính bằng feet²" trong cùng bộ dữ liệu.
- **Correlation**: Hệ số tương quan — covariance đã chuẩn hoá về khoảng −1 đến 1, không phụ thuộc đơn vị. 1: tương quan thuận hoàn hảo; −1: nghịch hoàn hảo; 0: không có quan hệ tuyến tính. Hệ số Pearson là loại phổ biến nhất. Ví dụ: chiều cao và cân nặng có r khoảng 0,7 — tương quan thuận khá mạnh.
- **Entropy**: Đo mức độ không chắc chắn hay "lộn xộn" của dữ liệu, tính bằng −Σ p·log₂(p), đơn vị bit. Bằng 0 khi hoàn toàn chắc chắn (chỉ một khả năng), lớn nhất khi mọi khả năng ngang nhau. Ví dụ: tung đồng xu cân bằng có entropy 1 bit; đồng xu hai mặt ngửa có entropy 0.
- **Information Gain**: Lượng thông tin thu được — mức giảm entropy sau khi chia dữ liệu theo một câu hỏi. Câu hỏi nào làm dữ liệu "gọn gàng" hơn nhiều nhất thì Information Gain cao nhất và được Decision Tree chọn. Ví dụ: chia email theo "có chữ discount?" làm entropy giảm từ 1,0 xuống 0,722 → gain 0,278 bit.
- **Null Hypothesis**: Giả thuyết không (H0) — giả định mặc định "không có gì đặc biệt": không có khác biệt, không có hiệu ứng. Kiểm định tìm bằng chứng để bác bỏ H0 chứ không chứng minh H0 đúng. Ví dụ: H0 = "hai model có độ chính xác như nhau".
- **Alternative Hypothesis**: Giả thuyết đối (H1) — điều ta muốn chứng minh, ngược với H0. Chỉ chấp nhận H1 khi dữ liệu đủ mạnh để bác bỏ H0. Ví dụ: H1 = "model A chính xác hơn model B".
- **p-value**: Nếu H0 đúng thì xác suất thấy được kết quả lệch như dữ liệu (hoặc lệch hơn) là bao nhiêu. p-value càng nhỏ thì dữ liệu càng khó xảy ra dưới H0, tức bằng chứng chống H0 càng mạnh. p-value không phải xác suất H0 đúng. Ví dụ: p = 0,003 < 0,05 → bác bỏ H0; p = 0,07 → chưa đủ bằng chứng.
- **Significance Level**: Mức ý nghĩa α — ngưỡng chọn trước khi kiểm định (thường 0,05); p-value nhỏ hơn α thì bác bỏ H0. α cũng chính là tỉ lệ "báo động nhầm" ta chấp nhận được: bác bỏ H0 trong khi H0 thật ra đúng. Ví dụ: α = 0,05 nghĩa là chấp nhận 5% rủi ro kết luận sai rằng có khác biệt.
- **T-Test**: Kiểm định t — so sánh giá trị trung bình: one-sample so trung bình của một nhóm với một con số cho trước; two-sample so trung bình của hai nhóm. Hợp với dữ liệu xấp xỉ phân phối chuẩn. Ví dụ: điểm trung bình lớp học online và lớp học offline có khác nhau thật không?
- **ANOVA** (Analysis of Variance): Phân tích phương sai — kiểm định xem trung bình của ba nhóm trở lên có bằng nhau không, dựa trên thống kê F (so độ biến động giữa các nhóm với độ biến động bên trong nhóm). Ví dụ: ba phương pháp dạy có cho điểm trung bình khác nhau không?
- **MLE** (Maximum Likelihood Estimation): Ước lượng hợp lý cực đại — chọn giá trị tham số sao cho dữ liệu ta đã quan sát được có khả năng xảy ra cao nhất. Rất nhiều model ML (như Logistic Regression) được train theo đúng nguyên tắc này. Ví dụ: tung đồng xu 100 lần được 60 lần ngửa → MLE ước lượng xác suất ngửa là 0,6.
- **MAP** (Maximum A Posteriori): Ước lượng hậu nghiệm cực đại — giống MLE nhưng cộng thêm niềm tin ban đầu (prior) về tham số, theo tinh thần Bayes. Khi dữ liệu ít, prior giúp ước lượng bớt cực đoan; regularization trong ML có thể hiểu theo cách này. Ví dụ: tung 3 lần đều ngửa, MLE nói xác suất ngửa = 1, còn MAP với prior "đồng xu thường cân bằng" cho con số hợp lý hơn.
