---
title: Chuẩn bị dữ liệu — Missing, Outlier, Scaling, Encoding, Imbalanced
short: Chuẩn bị dữ liệu
icon: 🧹
summary: '"Garbage in, garbage out" — dữ liệu bẩn thì model xịn cũng vô dụng. Bài này là cẩm nang làm sạch dữ liệu: xử lý giá trị thiếu, phát hiện điểm ngoại lai, đưa feature về cùng thang đo, mã hóa cột chữ thành số và xử lý dữ liệu lệch lớp.'
---

# Mục tiêu
- Chọn được cách xử lý Missing Values phù hợp (xóa, điền trung bình, KNN, MICE, nội suy chuỗi thời gian)
- Phát hiện Outlier bằng Boxplot, Z-Score, DBSCAN, Isolation Forest, LOF
- Phân biệt Normalization và Standardization
- Mã hóa dữ liệu dạng chữ: One-Hot, Label, Ordinal Encoder
- Xử lý Imbalanced Data bằng Under-sampling, SMOTE, class_weight
- Tránh Data Leakage khi tiền xử lý

# Vì sao phải chuẩn bị dữ liệu?

Trong một dự án ML thật, phần lớn thời gian dành cho dữ liệu chứ không phải cho model. Dữ liệu thực tế thường:
- **Thiếu** — ô trống do người dùng không điền, cảm biến hỏng.
- **Có giá trị lạ** — tuổi 999, lương âm.
- **Lệch thang đo** — một cột tính bằng triệu, cột khác từ 0 đến 1.
- **Là chữ** — "Hà Nội", "TP.HCM" mà model chỉ hiểu số.
- **Lệch lớp** — 99.9% giao dịch bình thường, 0.1% gian lận.

![Bốn nhóm việc tiền xử lý: làm sạch (Data Cleaning), biến đổi (Data Transformation), rút gọn (Data Reduction) và tích hợp nhiều nguồn (Data Integration).](/it/ml/data-preprocessing-tasks.webp =1124x735)

Công cụ thường dùng: **[[Pandas]]** để xử lý bảng dữ liệu; khi dữ liệu quá lớn cho một máy thì dùng xử lý phân tán như **[[Spark]]**, MapReduce.

# Xử lý Missing Values (giá trị thiếu)

### Xóa dòng/cột

- Chỉ nên xóa khi giá trị bị thiếu **hoàn toàn ngẫu nhiên** ([[MCAR]]) và số lượng thiếu ít, hoặc khi còn đủ dữ liệu sau khi xóa.
- Cột thiếu quá nhiều (ví dụ **trên 40%**) thường mang ít thông tin → cân nhắc bỏ cả cột.

```python
df.dropna(subset=['Solar.R'], how='any', inplace=True)   # bỏ các dòng thiếu cột Solar.R
```

### Điền giá trị đơn giản (Simple Imputation)

**[[Imputation]]** là điền giá trị vào chỗ trống. Cách đơn giản nhất:
- Một hằng số (ví dụ 0).
- **Mean** (trung bình) — nhanh, hợp với dữ liệu số phân phối đều quanh trung bình.
- **Median** (trung vị) — tốt hơn khi dữ liệu có outlier.
- **Mode / most frequent** (giá trị hay gặp nhất) — dùng được cả cho cột chữ.

```python
from sklearn.impute import SimpleImputer
imputer = SimpleImputer(strategy='mean')   # hoặc 'median', 'most_frequent', 'constant'
df.iloc[:, :] = imputer.fit_transform(df)
```

### KNN Imputation — hỏi "hàng xóm"

Tìm **K dòng giống nhất** (dựa trên các cột không bị thiếu), rồi lấy trung bình giá trị của chúng để điền vào ô trống.

```python
from sklearn.impute import KNNImputer
df.iloc[:, :] = KNNImputer(n_neighbors=5).fit_transform(df)
```

### MICE — điền bằng cách dự đoán

**[[MICE]]** coi việc điền giá trị thiếu là một bài toán dự đoán:

1. Tạm điền mọi ô trống bằng median của cột.
2. Với từng cột bị thiếu: train một model hồi quy dùng **các cột khác** để dự đoán cột này, rồi điền lại bằng giá trị dự đoán.
3. Lặp lại tới khi các giá trị điền ổn định (thường 5–10 vòng).

Kết quả giữ được quan hệ giữa các cột, sát phân phối thật hơn nhiều so với điền một giá trị cố định.

```python
from sklearn.experimental import enable_iterative_imputer   # bắt buộc import trước
from sklearn.impute import IterativeImputer
X_imputed = IterativeImputer(max_iter=10, random_state=42).fit_transform(X)
```

Thư viện hữu ích: `sklearn.impute`, `fancyimpute`, và `missingno` để **vẽ biểu đồ** xem dữ liệu thiếu ở đâu.

### Cột dạng chữ (categorical)

Thường phải **mã hóa chữ thành số** trước (xem phần Encoding bên dưới), rồi mới điền giá trị thiếu (thường dùng mode).

### Chuỗi thời gian (time series)

Dữ liệu theo thời gian có thứ tự, nên tận dụng giá trị kề bên:

- **Forward fill** — lấy giá trị **liền trước** điền vào.
- **Backward fill** — lấy giá trị **liền sau** điền vào.
- **[[Interpolation]]** — nội suy, "nối" các điểm hai bên chỗ trống bằng đường thẳng (`linear`), đường cong bậc 2 (`quadratic`), giá trị gần nhất (`nearest`), đa thức (`polynomial`)…

!viz[Chuỗi đo nồng độ Ozone có nhiều đoạn bị thiếu (cột xám); lần lượt điền bằng forward fill, backward fill, nội suy linear, quadratic và nearest để thấy mỗi cách cho kết quả khác nhau thế nào.](timeseries-fill)

```python
df_ffill  = df.ffill()                          # forward fill
df_bfill  = df.bfill()                          # backward fill
df_linear = df.interpolate(method='linear')     # nội suy tuyến tính
df_quad   = df.interpolate(method='quadratic')
```

::: tip
Phiên bản pandas cũ viết `df.fillna(method='ffill')`; cách viết này đã bị loại bỏ dần, nên dùng `df.ffill()` / `df.bfill()`.
:::

# Phát hiện Outlier (điểm ngoại lai)

[[Outlier]] là điểm nằm xa hẳn phần lớn dữ liệu — có thể là lỗi nhập liệu, cũng có thể là sự kiện hiếm có thật (gian lận!). Phát hiện xong mới quyết định xóa, sửa hay giữ lại.

### Nhìn bằng mắt — Boxplot

**[[Boxplot]]** vẽ hộp từ phân vị 25% (Q1) đến 75% (Q3). Khoảng **IQR** $= Q_3 - Q_1$. Điểm nằm ngoài $[\,Q_1 - 1.5 \cdot \text{IQR},\ Q_3 + 1.5 \cdot \text{IQR}\,]$ được vẽ riêng như các chấm — đó là ứng viên outlier.

!viz[Dựng boxplot từng bước: xếp dữ liệu lên một trục → median → hộp từ Q1 tới Q3 → râu kéo tới giá trị bình thường xa nhất → điểm nằm ngoài khoảng 1,5·IQR được đánh dấu outlier.](boxplot)

### Z-Score

**[[Z-Score]]** cho biết một điểm cách trung bình bao nhiêu lần độ lệch chuẩn:

::: formula
$$z = \frac{x - \text{mean}}{\text{std}}$$
:::

Thường coi |z| > 3 là outlier (với dữ liệu gần dạng hình chuông).

!viz[Một người có chiều cao thay đổi chạy dọc phân phối chuẩn (trung bình 165 cm, độ lệch chuẩn 10 cm). Khi cách trung bình hơn 3 độ lệch chuẩn (|z| > 3) thì bị coi là outlier.](zscore-bell)

```python
from scipy import stats
z = stats.zscore(a)
```

### Dựa trên phân cụm — DBSCAN

[[DBSCAN]] gom các điểm nằm ở vùng **dày đặc** thành cụm; điểm nằm lẻ loi, không thuộc cụm nào được gắn nhãn **nhiễu** — chính là outlier.

!viz[DBSCAN lan cụm dần từ các điểm lõi (có đủ hàng xóm trong bán kính eps). Cuối cùng các điểm lẻ loi không thuộc cụm nào được đánh dấu đỏ — đó là nhiễu/outlier.](dbscan)

### Isolation Forest

Ý tưởng: chia dữ liệu bằng những đường cắt ngẫu nhiên. Điểm bất thường nằm xa đám đông nên **chỉ cần vài nhát cắt là bị cô lập**, còn điểm bình thường nằm giữa đám đông thì cần rất nhiều nhát.

!viz[Cùng một chuỗi nhát cắt ngẫu nhiên: outlier (đỏ) bị cô lập chỉ sau vài nhát, còn điểm nằm giữa đám đông (xanh) cần rất nhiều nhát. Càng ít nhát cắt thì càng bất thường.](isolation-forest)

```python
from sklearn.ensemble import IsolationForest
labels = IsolationForest(random_state=0).fit_predict(X)   # -1 = outlier, 1 = bình thường
```

### Local Outlier Factor — outlier "cục bộ"

- **Global outlier**: lạ so với **toàn bộ** dữ liệu.
- **Local outlier**: trông bình thường nếu nhìn tổng thể, nhưng lạ so với **khu vực xung quanh** nó (ví dụ một điểm thưa thớt nằm sát một cụm rất dày).

![Global outlier nằm xa mọi cụm; local outlier chỉ lạ so với cụm ngay cạnh nó.](/it/ml/local-global-outliers.webp =1072x674)

**[[LOF]]** so sánh mật độ quanh một điểm với mật độ quanh các hàng xóm của nó để tìm loại outlier cục bộ này.

```python
from sklearn.neighbors import LocalOutlierFactor
labels = LocalOutlierFactor(n_neighbors=5).fit_predict(X)
```

### Cách khác

- **Phương pháp chiếu** ([[giảm chiều|Dimensionality Reduction]]): nén dữ liệu xuống 2 chiều (PCA, t-SNE), vẽ ra rồi nhìn bằng mắt.
- **[[One-Class SVM]]**: học "đường bao" quanh dữ liệu bình thường; điểm rơi ra ngoài là bất thường.

# Feature Scaling — đưa về cùng thang đo

Nếu cột "lương" tính bằng triệu (10–100) còn cột "tuổi" từ 18–60, nhiều thuật toán (kNN, SVM, Neural Network, các model có regularization) sẽ bị cột số lớn **lấn át**. [[Feature Scaling]] đưa các cột về cùng thang:

| | **[[Normalization]]** (Min-Max Scaling) | **[[Standardization]]** (Z-score Scaling) |
|---|---|---|
| Công thức | (x − min) / (max − min) | (x − mean) / std |
| Kết quả | Giá trị nằm trong **[0, 1]** | Trung bình **0**, độ lệch chuẩn **1** |
| Nhạy với outlier | Có — một điểm cực trị làm co hết các điểm khác | Ít hơn |
| scikit-learn | `MinMaxScaler` | `StandardScaler` |

!viz[Standardization gồm 2 bước: trừ trung bình (cả đám điểm dời về quanh 0) rồi chia độ lệch chuẩn (co giãn để độ lệch chuẩn bằng 1). Hình dạng phân phối giữ nguyên.](standardization)

::: tip
Các model dạng cây (Decision Tree, Random Forest, XGBoost) chỉ so sánh lớn/nhỏ nên **không cần** scaling.
:::

# Encoding — đổi chữ thành số

| Encoder | Cách làm | Dùng cho |
|---|---|---|
| **[[One-Hot Encoding]]** | Mỗi giá trị thành một cột 0/1. "Màu" = {Đỏ, Xanh, Vàng} → 3 cột `Màu_Đỏ`, `Màu_Xanh`, `Màu_Vàng` | Feature **không có thứ tự** (nominal) |
| **[[Label Encoding]]** | Đánh số 0 … n_classes − 1 | **Cột target** (nhãn cần dự đoán) |
| **[[Ordinal Encoding]]** | Đổi feature thành số nguyên theo thứ tự | Feature **có thứ tự**: nhẹ = 0 < vừa = 1 < nặng = 2 |

![Cùng cột Color: One-Hot tách thành 3 cột 0/1, còn Ordinal đổi thành một cột số 0, 1, 2.](/it/ml/encoders.webp =1381x764)

::: warn Đừng Label-encode feature không có thứ tự
Nếu mã hóa Hà Nội = 0, Đà Nẵng = 1, TP.HCM = 2 rồi đưa vào Linear Regression, model sẽ hiểu sai rằng "TP.HCM lớn gấp đôi Đà Nẵng". Feature không thứ tự thì dùng One-Hot.
:::

# Imbalanced Data — dữ liệu lệch lớp

Ví dụ phát hiện gian lận: 0.1% gian lận, 99.9% bình thường. Model đoán "bình thường" cho tất cả vẫn đạt Accuracy 99.9% — nhưng vô dụng. Các cách xử lý:

### Under-sampling — bớt lớp đông

- **Random Under-Sampling**: xóa ngẫu nhiên bớt mẫu lớp đông → dễ mất thông tin.
- **[[Tomek Links]]**: chỉ xóa những mẫu lớp đông nằm **sát ranh giới**, ngay cạnh một mẫu lớp hiếm → an toàn hơn, còn làm ranh giới rõ ràng hơn.

### Over-sampling — thêm lớp hiếm

- **[[SMOTE]]**: tạo mẫu **giả lập** cho lớp hiếm: chọn ngẫu nhiên một mẫu lớp hiếm, chọn một trong các hàng xóm gần nhất (cũng thuộc lớp hiếm), rồi tạo một điểm mới **nằm trên đoạn thẳng nối hai điểm đó**.
- **[[ADASYN]]**: giống SMOTE nhưng tập trung sinh mẫu ở những vùng **khó phân loại**.

```python
from imblearn.over_sampling import SMOTE
X_res, y_res = SMOTE(random_state=42).fit_resample(X_train, y_train)   # chỉ áp dụng trên TRAIN
```

### Cách khác

- **`class_weight='balanced'`** trong scikit-learn: phạt nặng hơn khi đoán sai lớp hiếm — nhanh, hiệu quả, không cần tạo hay xóa dữ liệu.
- **Ensemble chuyên cho dữ liệu lệch**: `BalancedBaggingClassifier`, `EasyEnsemble` (thư viện imbalanced-learn).
- Luôn đánh giá bằng Precision/Recall/F1/AUC thay vì Accuracy.

# Data Leakage — lỗi âm thầm nguy hiểm nhất

**[[Data Leakage]]** xảy ra khi thông tin từ tập test/validation "rò" vào quá trình train, làm điểm số đẹp giả tạo rồi khi chạy thật thì sập. Ví dụ hay gặp:

- Tính mean/std để scaling trên **toàn bộ** dữ liệu rồi mới chia train/test.
- Chạy SMOTE **trước** khi chia → mẫu giả lập được tạo từ dữ liệu test.

Nguyên tắc: **mọi bước "học" từ dữ liệu (fit) chỉ được làm trên tập train**, rồi áp dụng (transform) lên test. Cách an toàn nhất là gói tất cả vào một **[[Pipeline]]**:

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

model = make_pipeline(SimpleImputer(strategy='median'), StandardScaler(), LogisticRegression())
model.fit(X_train, y_train)      # imputer & scaler chỉ "học" từ train
model.score(X_test, y_test)
```

Khi chạy cross-validation với Pipeline, các bước tiền xử lý được fit lại riêng trên từng fold, không rò rỉ.

# Ghi nhớ nhanh
- Missing: ít & ngẫu nhiên → xóa; số → mean/median; quan hệ phức tạp → KNN hoặc MICE; chuỗi thời gian → ffill/bfill/interpolate.
- Outlier: Boxplot/IQR, Z-score (|z| > 3), DBSCAN, Isolation Forest, LOF (outlier cục bộ).
- Normalization → [0, 1]; Standardization → mean 0, std 1. Model dạng cây không cần scaling.
- One-Hot cho feature không thứ tự, Ordinal cho feature có thứ tự, Label Encoder cho target.
- Imbalanced: Tomek Links, SMOTE/ADASYN (chỉ trên train), class_weight='balanced'.
- Chống Data Leakage: chỉ fit trên train, dùng Pipeline.

# Thuật ngữ
- **Pandas**: Thư viện Python phổ biến nhất để làm việc với dữ liệu dạng bảng (DataFrame): đọc file CSV/Excel, lọc, gộp, nhóm, xử lý giá trị thiếu, tính thống kê. Gần như mọi dự án ML bằng Python đều bắt đầu từ Pandas. Ví dụ: `df = pd.read_csv('data.csv')` rồi `df.isna().sum()` để đếm ô trống mỗi cột.
- **Spark**: Nền tảng xử lý dữ liệu lớn phân tán — chia dữ liệu ra nhiều máy để xử lý song song khi một máy không kham nổi. Có API Python (PySpark) với cách viết khá giống Pandas. Ví dụ: xử lý vài trăm GB log truy cập website mỗi ngày.
- **MCAR** (Missing Completely At Random): Dữ liệu thiếu hoàn toàn ngẫu nhiên — việc một ô bị trống không liên quan tới bất kỳ giá trị nào (kể cả chính giá trị bị thiếu). Chỉ trong trường hợp này xoá dòng thiếu mới không làm lệch dữ liệu. Ví dụ: một số phiếu khảo sát bị mất do lỗi máy chủ ngẫu nhiên.
- **Imputation**: Điền giá trị vào các ô bị thiếu thay vì xoá dòng/cột. Có nhiều mức: hằng số, mean/median/mode, KNN, MICE… Cách điền ảnh hưởng tới kết quả model nên phải chọn hợp lý và chỉ "học" từ tập train. Ví dụ: điền tuổi thiếu bằng tuổi trung vị của các khách hàng còn lại.
- **MICE** (Multiple Imputation by Chained Equations): Điền giá trị thiếu bằng cách coi mỗi cột thiếu là một bài toán dự đoán: tạm điền bằng median, rồi lần lượt train model dự đoán từng cột từ các cột còn lại, điền lại, lặp nhiều vòng tới khi ổn định. Giữ được quan hệ giữa các cột tốt hơn hẳn điền một giá trị cố định. Ví dụ: `IterativeImputer` trong scikit-learn.
- **Interpolation**: Nội suy — ước lượng giá trị còn thiếu từ các giá trị hai bên, thường dùng cho chuỗi thời gian có thứ tự. Có thể nối thẳng (linear), nối cong (quadratic, polynomial) hoặc lấy giá trị gần nhất (nearest). Ví dụ: nhiệt độ 10 giờ là 28°C, 12 giờ là 32°C, thiếu 11 giờ → nội suy tuyến tính được 30°C.
- **Boxplot**: Biểu đồ hộp — vẽ hộp từ phân vị 25% (Q1) tới 75% (Q3) với vạch median ở giữa, "râu" kéo tới giá trị bình thường xa nhất, còn các điểm vượt quá 1,5 × IQR được vẽ riêng như outlier. Nhìn nhanh được trung tâm, độ trải và điểm lạ. Ví dụ: boxplot lương theo phòng ban để so sánh và phát hiện mức lương bất thường.
- **Z-Score**: Số lần độ lệch chuẩn mà một giá trị cách trung bình: z = (x − mean)/std. |z| lớn là giá trị hiếm gặp; thường coi |z| > 3 là outlier với dữ liệu gần phân phối chuẩn. Cũng chính là công thức của Standardization. Ví dụ: chiều cao trung bình 165 cm, std 7 cm → người cao 186 cm có z = 3.
- **LOF** (Local Outlier Factor): Thuật toán phát hiện outlier cục bộ: so mật độ điểm quanh một điểm với mật độ quanh các hàng xóm của nó. Điểm nằm ở vùng thưa hơn hẳn hàng xóm thì bị coi là bất thường, kể cả khi nhìn tổng thể nó không xa lắm. Ví dụ: một điểm lơ lửng ngay sát một cụm rất dày đặc.
- **One-Class SVM**: Biến thể SVM chỉ học từ dữ liệu bình thường: vẽ một "đường bao" ôm lấy vùng dữ liệu bình thường; điểm nào rơi ra ngoài đường bao bị coi là bất thường. Hữu ích khi hầu như không có mẫu bất thường để học. Ví dụ: chỉ có dữ liệu máy chạy tốt, cần phát hiện khi máy bắt đầu hỏng.
- **Feature Scaling**: Đưa các feature về cùng thang đo để không cột nào lấn át cột nào chỉ vì có số lớn hơn. Rất quan trọng với các thuật toán dựa vào khoảng cách hoặc gradient (kNN, SVM, mạng nơ-ron, model có regularization); model dạng cây thì không cần. Ví dụ: "lương" (10–100 triệu) và "tuổi" (18–60) được đưa về cùng khoảng giá trị.
- **Normalization**: Min-Max Scaling — đưa giá trị về khoảng [0, 1] bằng công thức (x − min)/(max − min). Đơn giản nhưng nhạy với outlier: một giá trị cực lớn sẽ ép mọi giá trị khác dồn sát về 0. Ví dụ: điểm ảnh 0–255 chia cho 255 để thành 0–1 trước khi đưa vào mạng nơ-ron.
- **Standardization**: Đưa dữ liệu về trung bình 0 và độ lệch chuẩn 1 bằng công thức (x − mean)/std. Ít nhạy với outlier hơn Normalization và là lựa chọn mặc định cho nhiều thuật toán. Ví dụ: `StandardScaler()` trong scikit-learn.
- **One-Hot Encoding**: Biến một cột chữ có n giá trị thành n cột 0/1, mỗi dòng chỉ có đúng một cột bằng 1. Không tạo ra thứ tự giả nên hợp với feature không có thứ tự; nhược điểm là sinh nhiều cột khi có nhiều giá trị. Ví dụ: Màu = {Đỏ, Xanh, Vàng} → 3 cột; "Xanh" thành [0, 1, 0].
- **Label Encoding**: Gán số nguyên 0, 1, 2… cho từng nhãn. Thường dùng cho cột target của bài toán phân loại; không nên dùng cho feature không có thứ tự vì model sẽ hiểu nhầm có quan hệ lớn/nhỏ. Ví dụ: target {chó, mèo, chim} → {0, 1, 2}.
- **Ordinal Encoding**: Gán số nguyên cho feature có thứ tự tự nhiên, giữ đúng thứ tự đó. Model nhờ vậy hiểu được "mức sau cao hơn mức trước". Ví dụ: mức độ bệnh nhẹ = 0, vừa = 1, nặng = 2; trình độ cử nhân < thạc sĩ < tiến sĩ.
- **Tomek Links**: Cặp hai điểm khác lớp nằm sát nhau nhất (mỗi điểm là hàng xóm gần nhất của điểm kia). Xoá điểm thuộc lớp đông trong mỗi cặp giúp ranh giới giữa hai lớp rõ ràng hơn — một cách under-sampling an toàn. Ví dụ: xoá vài giao dịch bình thường nằm lẫn sát các giao dịch gian lận.
- **SMOTE** (Synthetic Minority Over-sampling Technique): Tạo mẫu giả cho lớp hiếm: chọn một mẫu lớp hiếm, chọn một hàng xóm gần nó (cùng lớp), rồi sinh điểm mới nằm ngẫu nhiên trên đoạn nối hai điểm. Tốt hơn sao chép y nguyên vì tạo ra mẫu đa dạng. Chỉ áp dụng trên tập train. Ví dụ: từ 100 giao dịch gian lận thật sinh thêm 900 giao dịch gian lận "na ná".
- **ADASYN** (Adaptive Synthetic Sampling): Biến thể của SMOTE: sinh nhiều mẫu giả hơn ở những vùng mà lớp hiếm khó phân loại (bị lớp đông vây quanh), ít mẫu hơn ở vùng dễ. Giúp model tập trung vào chỗ khó. Ví dụ: sinh thêm mẫu gian lận ở vùng có hành vi gần giống giao dịch bình thường.
- **Data Leakage**: Rò rỉ dữ liệu — thông tin từ tập test hoặc từ "tương lai" vô tình lọt vào quá trình train, làm điểm đánh giá đẹp giả tạo rồi khi chạy thật thì sụp đổ. Đây là lỗi rất phổ biến và khó phát hiện. Ví dụ: tính mean/std để scaling trên toàn bộ dữ liệu trước khi chia train/test; dùng cột "ngày hoàn tiền" để dự đoán gian lận.
- **Pipeline**: Chuỗi các bước tiền xử lý và model được gói thành một khối duy nhất: fit thì cả chuỗi chỉ học từ train, predict thì dữ liệu mới đi qua đúng các bước đó. Giúp chống Data Leakage, code gọn và dễ đưa vào production. Ví dụ: `make_pipeline(SimpleImputer(), StandardScaler(), LogisticRegression())`.
