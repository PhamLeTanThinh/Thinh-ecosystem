---
title: Quy trình làm dự án ML & Chiến lược tối ưu
short: Quy trình & chiến lược ML
icon: 🧭
summary: Biết thuật toán thôi chưa đủ — làm dự án ML thật cần một quy trình. Bài này đi qua các bước từ hiểu vấn đề tới đưa model vào dùng, cách tune hyperparameter, chẩn đoán Bias/Variance, phân tích lỗi có hệ thống, chọn model theo kích thước dữ liệu, và khi nào KHÔNG nên dùng ML.
---

# Mục tiêu
- Nắm 6 bước của một dự án Machine Learning
- Biết EDA cần trả lời những câu hỏi gì
- Phân biệt Parameter và Hyperparameter; dùng Grid Search, Random Search, Bayesian Optimization
- Chẩn đoán High Bias / High Variance từ lỗi train và lỗi validation
- Làm Error Analysis để biết nên sửa gì trước
- Biết chọn model theo dữ liệu, và khi nào nên dùng luật thay vì ML

# Quy trình 6 bước

| Bước | Câu hỏi cần trả lời |
|---|---|
| 1. **Xác định bài toán** (Problem Statement) | Ta đang giải quyết vấn đề gì? Cần dữ liệu gì? |
| 2. **Thu thập dữ liệu** (Data Collection) | Lấy dữ liệu từ đâu? |
| 3. **Khám phá & tiền xử lý** (Exploration & Pre-processing) | Làm sạch dữ liệu thế nào để model dùng được? |
| 4. **Xây model** (Modelling) | Model nào giải được bài toán? |
| 5. **Đánh giá** (Validation) | Model đã giải được bài toán chưa? |
| 6. **Ra quyết định & triển khai** (Decision Making & Deployment) | Báo cáo cho các bên liên quan hay đưa vào chạy thật? |

### Bước 1 — Hiểu vấn đề

Phải hiểu **mô hình kinh doanh** đằng sau bài toán: dự đoán đúng thì được gì, sai thì mất gì, ai dùng kết quả. Đây là bước quyết định cả dự án đi đúng hướng hay không.

### Bước 2 — Thu thập dữ liệu

Xác định mọi nguồn dữ liệu hữu ích (cơ sở dữ liệu nội bộ, bên ngoài, internet), trích xuất và chuyển về dạng dùng được. Kỹ năng cần: quản trị và truy vấn cơ sở dữ liệu; lấy dữ liệu phi cấu trúc (văn bản, ảnh, video, tài liệu); lưu trữ phân tán (HDFS).

### Bước 3 — Khám phá và tiền xử lý

- **Tiền xử lý**: xử lý missing, outlier, scaling, encoding, lệch lớp (xem bài Chuẩn bị dữ liệu). Công cụ: [[Pandas]]; dữ liệu lớn thì [[Spark]], MapReduce.
- **[[EDA]]** — phân tích khám phá, để dữ liệu "tự kể chuyện":
  - Biết kiểu dữ liệu của từng cột, trả lời các câu hỏi bằng dữ liệu.
  - Hiểu dữ liệu phân phối ra sao (histogram, boxplot).
  - Tìm outlier.
  - Tìm các quy luật, mối tương quan (scatter plot, heatmap tương quan).

![Hai công cụ EDA cơ bản: histogram (xem phân phối) và biểu đồ xu hướng (xem quan hệ, biến động).](/it/ml/eda-plots.webp =1600x727)

- Xác định/chọn các biến quan trọng, làm [[Feature Engineering]].
- Chia dữ liệu: ví dụ **75% train, 25% test**.

# Xây model — quy trình chuẩn

1. **Chọn thuật toán** theo kích thước dữ liệu, kiểu feature và mức cần giải thích.
2. **Train một [[Baseline]]** với hyperparameter mặc định để có mốc so sánh.
3. **Tune hyperparameter** một cách có hệ thống để cải thiện.

![Dùng cross-validation trên tập train để chọn tham số tốt nhất, train lại model với tham số đó, rồi đánh giá lần cuối trên test set.](/it/ml/model-building-flow.webp =1328x891)

::: tip Luôn có baseline đơn giản
So sánh với một model rất đơn giản (Logistic Regression, hoặc model luôn đoán giá trị trung bình). Model phức tạp không thắng được baseline rõ rệt thì không đáng dùng.
:::

# Tune hyperparameter

### Parameter khác Hyperparameter thế nào?

- **Parameter** (tham số) — model **tự học** từ dữ liệu: hệ số của Linear Regression, vị trí tâm cụm của K-Means, weight của mạng nơ-ron.
- **[[Hyperparameter]]** (siêu tham số) — **con người đặt trước** khi train: mức regularization $\lambda$ (Lasso/Ridge), số hàng xóm $k$ (kNN), số chiều giữ lại (PCA), learning rate, số cây…

### Grid Search — thử hết mọi tổ hợp

Cách thủ công: tạo từng model với từng giá trị k rồi so điểm cross-validation:

```python
from sklearn import neighbors, model_selection
ks = [3, 4, 5, 10, 50]
weights = ['uniform', 'distance']
models = [neighbors.KNeighborsClassifier(k, weights=w) for k in ks for w in weights]
scores = [model_selection.cross_val_score(m, X, y) for m in models]
```

Duyệt có hệ thống mọi tổ hợp (hình dung như một lưới ô vuông) gọi là **Grid Search**. scikit-learn tự động hóa bằng [[GridSearchCV]], kết hợp được với [[Pipeline]]:

```python
from sklearn import pipeline, preprocessing, model_selection, neighbors

parameters = {'kneighborsclassifier__n_neighbors': [3, 4, 5, 10, 50],
              'kneighborsclassifier__weights': ['uniform', 'distance']}
model = pipeline.make_pipeline(preprocessing.StandardScaler(), neighbors.KNeighborsClassifier())
gscv = model_selection.GridSearchCV(model, parameters, cv=5).fit(X, y)
print(gscv.best_params_, gscv.best_score_)
```

Tên tham số trong Pipeline có dạng `tênbước__tênthamsố`. Nếu một số tham số chỉ có nghĩa khi tham số khác mang giá trị nhất định, có thể truyền **danh sách nhiều lưới** cho GridSearchCV.

### Các cách tìm khác

| Công cụ | Cách làm | Khi nào dùng |
|---|---|---|
| `GridSearchCV` | Thử **toàn bộ** tổ hợp | Ít tham số, muốn chắc chắn |
| `RandomizedSearchCV` | Thử **N tổ hợp ngẫu nhiên** từ các phân phối | Nhiều tham số — rẻ hơn nhiều mà kết quả thường gần bằng |
| `HalvingGridSearchCV` / `HalvingRandomSearchCV` | **Successive halving**: thử nhiều ứng viên với ít tài nguyên, loại dần nửa kém, dồn tài nguyên cho nửa tốt | Không gian lớn, muốn tiết kiệm thời gian |
| `ParameterGrid` / `ParameterSampler` | Sinh ra lưới / mẫu tham số để tự viết vòng lặp | Cần kiểm soát thủ công |
| **[[Optuna]]** (Bayesian Optimization) | Học từ các lần thử trước để chọn lần thử tiếp | Hiệu quả nhất về số lần thử |

```python
RandomizedSearchCV(model, param_distributions, n_iter=100, cv=5)
GridSearchCV(model, param_grid, cv=5, scoring='f1')
```

::: tip Vì sao Random Search hiệu quả?
Thường chỉ vài hyperparameter thật sự quan trọng. Thử ngẫu nhiên giúp mỗi tham số quan trọng được thử ở nhiều giá trị khác nhau hơn Grid Search với cùng số lần thử. Thực nghiệm cho thấy khoảng 60 lần thử ngẫu nhiên đã có xác suất cao tìm được cấu hình nằm trong nhóm 5% tốt nhất.
:::

Với XGBoost, các tham số đáng tune: `n_estimators` (100–1000), `learning_rate` (0.01–0.3), `max_depth` (3–10), `subsample` và `colsample_bytree` (0.6–1.0), `reg_alpha`/`reg_lambda` (L1/L2) — xem bài Boosting.

::: warn
Luôn dùng **Pipeline** để tiền xử lý được fit lại riêng trong từng fold — tránh [[Data Leakage]] giữa tập train và tập validation.
:::

# Chẩn đoán Bias – Variance

::: formula
$$\text{Tổng lỗi dự đoán} = \text{Bias}^2 + \text{Variance} + \text{Nhiễu không thể giảm}$$
:::

| | High Bias — Underfitting | High Variance — Overfitting |
|---|---|---|
| Hiện tượng | Model quá đơn giản, bỏ sót quy luật | Model học thuộc dữ liệu train, không tổng quát hóa |
| Triệu chứng | Lỗi train **cao**, lỗi dev **cao** | Lỗi train **thấp**, lỗi dev **cao** (khoảng cách lớn) |
| Cách sửa | Thêm feature, model phức tạp hơn, giảm regularization | Thêm dữ liệu, tăng regularization, Dropout, Early Stopping |

("Dev set" = [[Validation Set]].) Điểm cân bằng: độ phức tạp của model phải tương xứng với **lượng và chất lượng** dữ liệu. Dùng [[K-Fold Cross-Validation]] để ước lượng lỗi tổng quát hóa thật.

# Error Analysis — phân tích lỗi có hệ thống

**Quy trình:**
1. **Đặt mốc**: hiệu năng của con người, hoặc của một model đơn giản.
2. **So sánh**: lỗi train vs lỗi dev vs lỗi test.
3. **Tìm nút thắt**: do High Bias? High Variance? Hay dữ liệu train và dữ liệu thật **không khớp nhau** (data mismatch)?

::: example Bộ lọc spam
Lấy ngẫu nhiên **100 email bị phân loại sai**, đọc từng cái rồi xếp nhóm:
- **40%** — tiếng Việt viết tắt, teencode → **ưu tiên sửa nhất**.
- **30%** — email chỉ có ảnh, không có chữ → thêm OCR hoặc model hiểu ảnh.
- **20%** — tên miền lạ chưa có trong dữ liệu train → làm giàu dữ liệu (data augmentation).
- **10%** — nhãn bị gán sai sẵn → gán nhãn lại.

Ma trận **Tác động × Công sức**: ưu tiên việc **tác động lớn** (chiếm nhiều lỗi) mà **công sức nhỏ**.

Công cụ: `classification_report`, Confusion Matrix, script lấy mẫu lỗi.
:::

# Chọn model

| Model | Hợp với |
|---|---|
| Linear / Logistic Regression | Dữ liệu gần tuyến tính, cần giải thích cao |
| Decision Tree / Random Forest | Feature lẫn lộn số và phân loại, cần độ quan trọng của feature |
| Gradient Boosting (XGBoost, LightGBM) | Dữ liệu bảng, cần độ chính xác cao nhất |
| SVM | Dữ liệu vừa (< 100 nghìn dòng), nhiều chiều (văn bản, đặc trưng ảnh) |
| Deep Learning (MLP, CNN, RNN/Transformer) | Ảnh, văn bản, âm thanh, dữ liệu rất lớn |

**Theo kích thước dữ liệu:**
- **< 10 nghìn dòng**: bắt đầu với Logistic/Linear Regression, Decision Tree.
- **10 nghìn – 1 triệu dòng**: Random Forest, XGBoost/LightGBM (baseline chuẩn trên Kaggle).
- **> 1 triệu dòng + dữ liệu phi cấu trúc**: Deep Learning, tận dụng [[Transfer Learning]] từ model đã pretrain.

::: tip No Free Lunch
**[[No Free Lunch Theorem]]**: không có model nào tốt nhất cho mọi bài toán → luôn thử và so sánh nhiều thuật toán. Bắt đầu đơn giản, chỉ tăng độ phức tạp khi thật sự cần.
:::

**Chọn metric**: xem lại bài Đánh giá model — Precision cho bài toán sợ báo nhầm (lọc spam, quảng cáo), Recall cho bài toán sợ bỏ sót (ung thư, gian lận), F1 cho dữ liệu lệch lớp, AUC để so sánh độc lập ngưỡng; MAE, RMSE, MAPE cho regression. Gắn metric với KPI kinh doanh, và chỉ báo cáo kết quả cuối trên **test set**.

# Khi nào KHÔNG nên dùng Machine Learning?

**Dùng hệ thống luật (rule-based) khi:**
- Logic viết ra được rõ ràng — vài câu if/else rõ ràng tốt hơn một model.
- Dữ liệu quá ít — ML cần ít nhất hàng nghìn mẫu có nhãn mỗi lớp.
- Không chấp nhận lỗi không giải thích được — y tế, hàng không, pháp lý.
- Chi phí dự đoán cao hơn giá trị mang lại — hệ thống nhúng thời gian thực, thiết bị biên yếu.

**Lượng dữ liệu tối thiểu (kinh nghiệm thực tế):**
- Phân loại đơn giản trên dữ liệu bảng: **≥ 1.000 mẫu mỗi lớp**, cân bằng.
- NLP / Computer Vision: **10.000 – 100.000+** mẫu có nhãn.
- Deep Learning từ đầu: **100.000+** mẫu — hoặc dùng Transfer Learning.

**Ràng buộc pháp lý và khả năng giải thích:**
- Tài chính (chấm điểm tín dụng): quy định như GDPR Điều 22 yêu cầu quyết định tự động phải giải thích được.
- Y tế: cơ quan quản lý (như FDA) yêu cầu kiểm chứng lâm sàng và minh bạch.
- Giải pháp: dùng model dễ giải thích (Logistic Regression, Decision Tree) hoặc thêm lớp giải thích [[XAI]] (SHAP, LIME).

# Ghi nhớ nhanh
- 6 bước: Bài toán → Dữ liệu → Khám phá & tiền xử lý → Model → Đánh giá → Triển khai.
- Parameter do model học; Hyperparameter do người đặt và tune bằng Grid/Random Search/Optuna + cross-validation.
- Lỗi train cao → High Bias; train thấp mà dev cao → High Variance.
- Error Analysis: đọc ~100 lỗi, nhóm lại, sửa nhóm tác động lớn mà công sức nhỏ trước.
- No Free Lunch: luôn so sánh nhiều model, bắt đầu từ baseline đơn giản.
- Logic rõ ràng, dữ liệu ít, cần giải thích tuyệt đối → cân nhắc luật thay vì ML.

# Thuật ngữ
- **EDA** (Exploratory Data Analysis): Phân tích khám phá dữ liệu — dùng thống kê mô tả và biểu đồ (histogram, boxplot, scatter, heatmap tương quan) để hiểu dữ liệu trước khi xây model: kiểu dữ liệu, phân phối, giá trị thiếu, outlier, quan hệ giữa các cột. Ví dụ: vẽ histogram giá nhà thấy lệch phải mạnh → cân nhắc lấy log trước khi train.
- **Baseline**: Model mốc — một model rất đơn giản dùng làm chuẩn so sánh; model phức tạp phải thắng baseline rõ rệt mới đáng dùng. Giúp phát hiện sớm khi model "xịn" thật ra chẳng hơn gì. Ví dụ: luôn đoán giá nhà bằng giá trung bình; hoặc Logistic Regression với tham số mặc định.
- **Optuna**: Thư viện Python mã nguồn mở để tune hyperparameter tự động theo hướng Bayesian Optimization: học từ các lần thử trước để chọn lần thử tiếp, và tự dừng sớm các lần thử kém. Ví dụ: tìm learning_rate, max_depth, subsample tốt nhất cho XGBoost sau 100 lần thử.
- **Transfer Learning**: Học chuyển giao — lấy một model đã được train trên dữ liệu lớn cho bài toán chung, rồi tận dụng phần kiến thức đó cho bài toán mới (giữ nguyên hoặc train tiếp một phần). Cần ít dữ liệu và thời gian hơn rất nhiều so với train từ đầu. Ví dụ: dùng model đã học trên hàng triệu ảnh ImageNet, chỉ train lại lớp cuối để phân loại 5 loại bệnh lá cây với vài trăm ảnh.
- **No Free Lunch Theorem**: Định lý "không có bữa trưa miễn phí" — không có thuật toán nào tốt nhất cho mọi bài toán; thuật toán thắng ở bài này có thể thua ở bài khác. Vì vậy luôn phải thử và so sánh nhiều model trên chính dữ liệu của mình. Ví dụ: XGBoost thắng trên dữ liệu bảng nhưng thua CNN trên ảnh.
- **XAI** (Explainable AI): AI có thể giải thích — các kỹ thuật giúp con người hiểu vì sao model đưa ra một quyết định: feature nào ảnh hưởng, ảnh hưởng theo chiều nào và bao nhiêu. Cần cho việc gỡ lỗi, tạo niềm tin và đáp ứng quy định pháp lý. Ví dụ: SHAP, LIME giải thích vì sao một hồ sơ vay bị từ chối.
