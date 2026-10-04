---
title: Ensemble (1) — Bagging & Random Forest
short: Bagging & Random Forest
icon: 🌲
summary: '"Nhiều người cùng đoán thì đúng hơn một người." Bài này giải thích Ensemble Learning, kỹ thuật Bootstrap, Bagging, cách đánh giá miễn phí bằng Out-of-Bag, và Random Forest — model "go-to" cho dữ liệu dạng bảng.'
---

# Mục tiêu
- Hiểu vì sao một cây quyết định đơn lẻ khó vừa ít bias vừa ít variance
- Nắm ý tưởng Ensemble và 3 họ: Bagging, Boosting, Stacking
- Hiểu Bootstrap Sampling và con số 63.2% / 36.8%
- Hiểu thuật toán Bagging và vì sao nó giảm variance
- Dùng OOB Evaluation thay cho validation set
- Hiểu Random Forest, đo Feature Importance (MDI vs Permutation) và tune hyperparameter

# Vấn đề của một cây quyết định đơn lẻ

[[Decision Tree]] rất dễ hiểu, nhưng gặp khó ở chỗ chọn độ sâu:

| Cây nông (shallow) | Cây vừa phải | Cây sâu (deep) |
|---|---|---|
| **High Bias** — bỏ sót quy luật | Bias thấp, variance thấp — lý tưởng | **High Variance** — học thuộc cả nhiễu |
| Underfitting | Good fit | Overfitting |

Trên thực tế, **một cây đơn lẻ rất khó đạt cùng lúc bias thấp và variance thấp**. Cây sâu thì bias thấp nhưng chỉ cần đổi vài dòng dữ liệu là cây mọc ra hoàn toàn khác (variance cao).

Ý tưởng của Ensemble: **giữ cây sâu (bias thấp), rồi kết hợp nhiều cây để triệt tiêu variance** — giảm variance mà không làm tăng bias.

# Ensemble — "trí tuệ đám đông"

**[[Ensemble Learning]]** kết hợp nhiều model "yếu" ([[Weak Learner]]) thành một model "mạnh" ([[Strong Learner]]).

::: analogy
- 7 bác sĩ cùng hội chẩn thì chẩn đoán chính xác hơn 1 bác sĩ.
- Ban giám khảo 7 người chấm thì công bằng hơn 1 người.
- Trung bình dự đoán của 100 người đoán số kẹo trong lọ thường sát số thật hơn dự đoán của từng người.
:::

| Họ Ensemble | Cách train | Mục tiêu chính | Ví dụ |
|---|---|---|---|
| **[[Bagging]]** | **Song song**, các model độc lập | Giảm **Variance** | Bagging, Random Forest |
| **[[Boosting]]** | **Nối tiếp**, model sau sửa lỗi model trước | Giảm **Bias** | AdaBoost, XGBoost (bài sau) |
| **[[Stacking]]** | Kết hợp đầu ra của nhiều model khác loại bằng một model "meta" | Tận dụng điểm mạnh từng model | Stacked Generalization |

# Bootstrap Sampling — nền tảng thống kê của Bagging

**[[Bootstrap]]** = lấy mẫu **có hoàn lại** (sampling with replacement) từ dữ liệu gốc, mỗi mẫu bootstrap có **cùng kích thước n** với dữ liệu gốc.

::: example
Dữ liệu gốc: **A B C D E**
- Bootstrap 1: A A C D E (A xuất hiện 2 lần, không có B)
- Bootstrap 2: B C C D A (C xuất hiện 2 lần, không có E)

"Có hoàn lại" nghĩa là rút xong lại bỏ vào, nên một mẫu có thể bị rút nhiều lần, có mẫu không được rút lần nào.
:::

### Con số 36.8% quan trọng

Xác suất một mẫu **không được chọn** lần nào sau n lần rút:

::: formula
$$P(\text{không được chọn}) = \left(1 - \frac{1}{n}\right)^{n} \approx \frac{1}{e} \approx 0{,}368$$
:::

Nghĩa là:
- Mỗi bootstrap chứa khoảng **63.2%** mẫu khác nhau của dữ liệu gốc.
- Khoảng **36.8%** còn lại không tham gia train — gọi là mẫu **[[OOB]] (Out-of-Bag)**.
- Các mẫu OOB dùng để **đánh giá model miễn phí** — không cần tách validation set riêng.

!viz[Rút ngẫu nhiên có hoàn lại 5 lần từ A–E để tạo mỗi bộ bootstrap: có mẫu bị rút nhiều lần (lặp), có mẫu không được rút lần nào — chính là các mẫu OOB.](bootstrap)

# Bagging — Bootstrap Aggregating

Thuật toán gồm 3 bước:

1. **Bootstrap**: tạo B bộ dữ liệu bootstrap từ tập train.
2. **Train**: với mỗi bộ, train một Decision Tree **mọc tối đa, không cắt tỉa** (không pruning) — các cây train **độc lập, song song**.
3. **Aggregate** (tổng hợp):
   - **Classification**: **bỏ phiếu đa số** ([[Majority Voting]]) — lớp nào được nhiều cây chọn nhất thì thắng.
   - **Regression**: **lấy trung bình** dự đoán của $B$ cây: $\hat{y} = \dfrac{1}{B}\sum_{b=1}^{B} T_b(x)$.

!viz[Bagging: dữ liệu train tạo ra nhiều bootstrap sample, mỗi sample train một cây độc lập, rồi các cây bỏ phiếu để ra kết quả cuối.](bagging-flow)

::: example Bỏ phiếu phân loại email
Cây 1: Spam · Cây 2: Không spam · Cây 3: Spam · Cây 4: Spam · Cây 5: Không spam
→ Spam 3 phiếu, Không spam 2 phiếu → **Kết quả: SPAM**.
:::

### Vì sao Bagging giảm variance?

Nếu B cây **hoàn toàn độc lập**, mỗi cây có variance $\sigma^2$, thì trung bình của chúng có variance $\sigma^2 / B$ — càng nhiều cây càng nhỏ. Nhưng thực tế các cây có **tương quan** với nhau (vì cùng học từ một dữ liệu gốc), với hệ số tương quan $\rho$ (đọc là "rho"):

::: formula
$$\operatorname{Var} = \rho\,\sigma^2 + \frac{1 - \rho}{B}\,\sigma^2$$
:::

- Tăng $B$ → phần $\dfrac{1 - \rho}{B}\,\sigma^2$ giảm dần về 0.
- Nhưng phần **$\rho\,\sigma^2$ không giảm** dù có thêm bao nhiêu cây!

→ Muốn giảm variance mạnh hơn phải **giảm tương quan $\rho$ giữa các cây**. Đó chính là ý tưởng của Random Forest.

### Điểm yếu: feature áp đảo

Nếu có một feature cực mạnh (gọi là $X_1$), **cây nào cũng chọn $X_1$ để chia ở gốc** → các cây na ná nhau → $\rho$ cao → variance giảm ít. Giải pháp: thêm ngẫu nhiên ở cấp feature → **Random Forest**.

# Out-of-Bag Evaluation — Cross-Validation miễn phí

Mỗi cây có ~36.8% dữ liệu là OOB (không dùng để train cây đó). Cách tính:

1. Với mỗi mẫu x: tìm tất cả những cây mà x là OOB.
2. Cho các cây đó dự đoán x rồi tổng hợp (bỏ phiếu/trung bình).
3. So với nhãn thật y.
4. **OOB Error** = tỉ lệ dự đoán sai trên toàn bộ tập train.

OOB Error xấp xỉ lỗi Cross-Validation mà **không cần tách validation set riêng**.

| Tiêu chí | OOB | K-Fold CV |
|---|---|---|
| Cần tách validation set? | Không | Có |
| Chi phí tính toán | Thấp (tận dụng sẵn) | Cao (train K lần) |
| Kết quả | Tương đương | Chuẩn hơn một chút |
| Khi nào dùng | Dữ liệu nhỏ, cần tiết kiệm | Cần đánh giá chặt chẽ |

Trong scikit-learn chỉ cần đặt `oob_score=True`.

# Random Forest — Bagging + Feature Randomness

**[[Random Forest]]** thêm **lớp ngẫu nhiên thứ hai**: tại **mỗi lần chia nút**, cây chỉ được xét một **tập con ngẫu nhiên m feature** (thay vì toàn bộ p feature).

Hai lớp ngẫu nhiên:
1. **Ngẫu nhiên về dữ liệu** — bootstrap sampling (giống Bagging).
2. **Ngẫu nhiên về feature** — tập con feature ngẫu nhiên ở mỗi lần chia (cái mới).

Nhờ đó feature áp đảo không phải lúc nào cũng có mặt → các cây đa dạng hơn → $\rho$ giảm → variance giảm mạnh hơn.

!viz[Random Forest: giống Bagging nhưng mỗi cây chỉ được xét một tập feature ngẫu nhiên (chữ cam) — nhờ vậy các cây khác nhau hơn.](random-forest-flow)

### Thuật toán chi tiết

```
Input: tập train D, số cây B, số feature m
Với b = 1..B:
    1. Tạo bootstrap Dᵦ từ D
    2. Train cây Tᵦ trên Dᵦ:
         Tại mỗi nút cần chia:
           - chọn ngẫu nhiên m feature trong p feature
           - tìm cách chia tốt nhất CHỈ trong m feature đó
           - chia nút
         Cho cây mọc tối đa (không pruning)
Dự đoán:
    Classification: bỏ phiếu đa số của T₁(x), ..., T_B(x)
    Regression:     trung bình (1/B) Σ Tᵦ(x)
```

### Chọn m (`max_features`)

| Giá trị | Ý nghĩa |
|---|---|
| $m = \sqrt{p}$ | Gợi ý kinh điển cho **classification** — mặc định của `RandomForestClassifier` (`'sqrt'`) |
| $m = p/3$ | Gợi ý kinh điển cho **regression** (lưu ý: `RandomForestRegressor` của scikit-learn hiện mặc định dùng **toàn bộ** feature, `max_features=1.0`) |
| $m = 1$ | Ngẫu nhiên cực đoan |
| $m = p$ | Xét tất cả feature → chính là **Bagging** |

Đánh đổi: m nhỏ → cây đa dạng, tương quan thấp, nhưng mỗi cây yếu hơn (bias tăng). m lớn → mỗi cây mạnh hơn nhưng các cây giống nhau hơn. → m là hyperparameter quan trọng, nên tune.

| Tiêu chí | Bagging | Random Forest |
|---|---|---|
| Model nền | Decision Tree | Decision Tree |
| Bootstrap | Có | Có |
| Feature khi chia nút | Tất cả p feature | m feature ngẫu nhiên |
| Tương quan giữa các cây | Cao | Thấp hơn |
| Giảm variance | Tốt | Tốt hơn |
| Bias | Thấp | Hơi cao hơn (đánh đổi) |

# Feature Importance — Random Forest còn giải thích được

### MDI — Gini Importance

**[[MDI]]**: mỗi lần một feature được dùng để chia nút, độ "lộn xộn" ([[Gini Impurity]]) giảm đi một lượng. Importance của feature = **tổng mức giảm đó trung bình trên mọi cây**.
- Tính nhanh, có sẵn: `model.feature_importances_`.
- Nhược: **thiên vị** feature có **nhiều giá trị khác nhau** (high cardinality — ví dụ cột ID, cột số liên tục).

### Permutation Importance

**[[Permutation Importance]]**:
1. Tính độ chính xác gốc trên tập test.
2. Với mỗi feature: **xáo trộn ngẫu nhiên** giá trị cột đó trên tập test (phá vỡ quan hệ của nó với target).
3. Tính lại độ chính xác — **mức giảm chính là độ quan trọng**.
4. Lặp lại vài lần rồi lấy trung bình.

- Ưu: không thiên vị, phản ánh đúng thực tế trên dữ liệu chưa thấy.
- Nhược: chậm hơn MDI; bị ảnh hưởng khi các feature tương quan với nhau (xáo một cột nhưng cột "song sinh" vẫn còn nguyên thông tin).

```python
from sklearn.inspection import permutation_importance
result = permutation_importance(rf, X_test, y_test, n_repeats=10)
result.importances_mean
```

![Theo MDI, cột phân loại nhiều giá trị (X₁ cat) đứng đầu với 45%…](/it/ml/mdi-importance.webp =810x576)

![…nhưng theo Permutation Importance nó chỉ còn 18% — MDI đã thiên vị feature có nhiều giá trị.](/it/ml/permutation-importance.webp =828x576)

::: tip
Nên xem cả hai rồi so sánh. Ví dụ một cột phân loại nhiều giá trị có thể đứng đầu theo MDI (45%) nhưng tụt xuống thứ 3 theo Permutation (18%). Khi nghi ngờ, **ưu tiên Permutation Importance**.
:::

# Hyperparameter quan trọng

| Tham số | Ý nghĩa | Gợi ý |
|---|---|---|
| `n_estimators` | Số cây | Mặc định 100; thường 100–500. Nhiều hơn thì tốt hơn nhưng lợi ích giảm dần |
| `max_features` | Số feature xét ở mỗi lần chia | `'sqrt'`, `'log2'`, số nguyên, hoặc tỉ lệ (0.3…) — **ảnh hưởng lớn nhất** |
| `max_depth` | Độ sâu tối đa | `None` = mọc tối đa; giảm để regularize |
| `min_samples_split` | Số mẫu tối thiểu để được chia nút | Mặc định 2; tăng → cây đơn giản hơn |
| `min_samples_leaf` | Số mẫu tối thiểu ở mỗi lá | Mặc định 1; tăng → dự đoán mượt hơn |
| `bootstrap` | Có dùng bootstrap không | True (mặc định) |
| `oob_score` | Bật đánh giá OOB | True để có "validation miễn phí" |
| `class_weight` | Xử lý lệch lớp | `'balanced'`, `'balanced_subsample'` |
| `n_jobs` | Số nhân CPU | −1 = dùng tất cả (chạy song song) |

**Chiến lược tune:**
1. Chạy mặc định để có baseline.
2. Tăng `n_estimators` (200, 500) tới khi OOB error ổn định.
3. Tune `max_features` (sqrt, log2, 0.3, 0.5).
4. Tune `max_depth` (10, 20, 30, None).
5. Tune `min_samples_split`, `min_samples_leaf`.

Dùng [[GridSearchCV]] (thử mọi tổ hợp, chắc chắn) hoặc [[RandomizedSearchCV]] (nhanh hơn khi nhiều tham số).

!viz[OOB error khi tăng dần số cây: giảm nhanh trong khoảng 100–200 cây đầu rồi gần như đi ngang — thêm cây không làm model tệ đi, chỉ tốn thời gian.](oob-curve)

::: tip Random Forest không overfit khi tăng số cây
OOB error giảm nhanh lúc đầu rồi gần như đi ngang sau khoảng 100–200 cây. Thêm cây chỉ tốn thêm thời gian, **không** làm model overfit.
:::

# Ưu, nhược điểm và khi nào dùng

**Ưu điểm:**
- Hiệu năng cao cho cả classification lẫn regression.
- Ít cần tiền xử lý: **không cần scaling**, xử lý được cả feature số lẫn phân loại.
- Khá bền với outlier và nhiễu.
- Có sẵn Feature Importance và OOB evaluation.
- Dễ chạy song song; ít hyperparameter cần tune hơn Gradient Boosting.

**Nhược điểm:**
- Chậm hơn một cây đơn khi train và dự đoán (phải đi qua B cây).
- Khó giải thích hơn một cây đơn (không vẽ được "một cây đại diện").
- Tốn bộ nhớ (lưu B cây).
- Trên dữ liệu bảng thường **thua XGBoost/LightGBM** một chút.
- **Không ngoại suy được** trong regression: không dự đoán được giá trị vượt ra ngoài khoảng đã thấy khi train.

| Nên dùng khi | Cân nhắc model khác khi |
|---|---|
| Cần baseline nhanh, mạnh, ít tune | Cần độ chính xác tối đa → XGBoost, LightGBM |
| Nhiều feature, cần biết feature nào quan trọng | Cần giải thích rõ ràng → một cây đơn, model tuyến tính |
| Dữ liệu nhiễu, có outlier | Cần dự đoán real-time cực nhanh → model nhỏ hơn |
| Dữ liệu nhỏ, muốn đánh giá bằng OOB | Regression cần ngoại suy → model tuyến tính |

**Random Forest là lựa chọn "go-to baseline" cho hầu hết bài toán dữ liệu dạng bảng.**

# Thực hành

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import BaggingClassifier, RandomForestClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, GridSearchCV

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Lab 1 — so sánh một cây, Bagging, Random Forest (xem accuracy và khoảng cách train/test)
dt  = DecisionTreeClassifier().fit(X_train, y_train)
bag = BaggingClassifier(n_estimators=100).fit(X_train, y_train)
rf  = RandomForestClassifier(n_estimators=100, oob_score=True).fit(X_train, y_train)
print(rf.oob_score_)                       # độ chính xác OOB

# Lab 2 — vẽ OOB error theo số cây
oob_errors = []
for n in range(10, 501, 10):
    m = RandomForestClassifier(n_estimators=n, oob_score=True).fit(X_train, y_train)
    oob_errors.append(1 - m.oob_score_)

# Lab 4 — tìm hyperparameter tốt nhất
grid = GridSearchCV(RandomForestClassifier(),
                    {'n_estimators': [100, 200, 500],
                     'max_features': ['sqrt', 'log2', 0.3],
                     'max_depth': [10, 20, None]},
                    cv=5, scoring='accuracy').fit(X_train, y_train)
print(grid.best_params_, grid.best_score_)

# Lab 5 — vẽ một cây trong rừng (3 tầng đầu)
from sklearn.tree import plot_tree
plot_tree(rf.estimators_[0], max_depth=3, filled=True, rounded=True)
```

# Ghi nhớ nhanh
- Bagging = Bootstrap + Aggregation → giảm variance bằng cách lấy trung bình nhiều cây sâu.
- Mỗi bootstrap chứa ~63.2% mẫu khác nhau; ~36.8% còn lại là OOB → đánh giá miễn phí.
- $\operatorname{Var} = \rho\,\sigma^2 + \dfrac{1 - \rho}{B}\,\sigma^2$ → phải giảm tương quan $\rho$ giữa các cây.
- Random Forest = Bagging + chọn ngẫu nhiên m feature ở mỗi lần chia ($\sqrt{p}$ cho classification).
- MDI nhanh nhưng thiên vị feature nhiều giá trị; Permutation Importance đáng tin hơn.
- Thêm cây không gây overfit, chỉ tốn thời gian.

# Thuật ngữ
- **Ensemble Learning**: Học kết hợp — dùng nhiều model cùng dự đoán rồi gộp kết quả (bỏ phiếu, lấy trung bình, cộng có trọng số), cho kết quả tốt và ổn định hơn từng model riêng lẻ. Ba họ chính: Bagging, Boosting, Stacking. Ví dụ: 100 cây quyết định cùng bỏ phiếu xem email có phải spam.
- **Weak Learner**: Model "yếu" — chỉ cần tốt hơn đoán bừa một chút (ví dụ accuracy trên 50% với bài 2 lớp). Đơn giản, nhanh, và là "viên gạch" để xây strong learner trong ensemble. Ví dụ: cây quyết định chỉ có một câu hỏi "tuổi > 30?".
- **Strong Learner**: Model "mạnh" — đạt độ chính xác cao, thường được tạo bằng cách kết hợp rất nhiều weak learner. Ví dụ: một model AdaBoost gồm 200 cây một tầng đạt accuracy 95%.
- **Bagging** (Bootstrap Aggregating): Tạo nhiều bộ dữ liệu bootstrap (lấy mẫu có hoàn lại), train một model trên mỗi bộ một cách độc lập, song song, rồi bỏ phiếu (phân loại) hoặc lấy trung bình (hồi quy). Chủ yếu giảm variance, giúp model ổn định hơn. Ví dụ: 100 cây sâu, mỗi cây học từ một bootstrap khác nhau.
- **Boosting**: Train các model nối tiếp nhau, mỗi model mới tập trung sửa những chỗ các model trước làm sai, rồi cộng tất cả lại có trọng số. Chủ yếu giảm bias; mạnh nhưng có thể overfit nếu lặp quá nhiều. Ví dụ: AdaBoost, Gradient Boosting, XGBoost, LightGBM, CatBoost.
- **Stacking**: Train nhiều model khác loại (ví dụ Random Forest, SVM, kNN), rồi dùng một model "meta" học cách kết hợp dự đoán của chúng thành dự đoán cuối. Tận dụng điểm mạnh riêng của từng model. Ví dụ: Logistic Regression nhận đầu ra của 3 model làm feature và học cách tin model nào hơn.
- **Bootstrap**: Lấy mẫu có hoàn lại — rút ngẫu nhiên n lần từ dữ liệu gốc n mẫu, mỗi lần rút xong lại "bỏ vào", nên có mẫu bị chọn nhiều lần, có mẫu không được chọn. Mỗi bộ bootstrap chứa khoảng 63,2% mẫu khác nhau. Ví dụ: từ A B C D E rút được A A C D E.
- **OOB** (Out-of-Bag): Các mẫu không được chọn vào một bộ bootstrap (khoảng 36,8%). Vì cây tương ứng chưa từng thấy chúng, có thể dùng chúng để đánh giá cây đó — gộp lại thành một kiểu cross-validation miễn phí. Ví dụ: `RandomForestClassifier(oob_score=True)` rồi xem `oob_score_`.
- **Majority Voting**: Bỏ phiếu đa số — mỗi model đưa ra một lớp, lớp nào được nhiều model chọn nhất là kết quả cuối. Cách tổng hợp chuẩn của Bagging và Random Forest cho bài toán phân loại. Ví dụ: 3 cây nói Spam, 2 cây nói Không spam → kết quả Spam.
- **MDI** (Mean Decrease in Impurity): Độ quan trọng của feature tính bằng tổng mức giảm "độ lộn xộn" (impurity) mỗi khi feature đó được dùng để chia nút, lấy trung bình trên mọi cây. Nhanh, có sẵn trong scikit-learn, nhưng thiên vị feature có nhiều giá trị khác nhau. Ví dụ: `model.feature_importances_` của Random Forest.
- **Gini Impurity**: Độ "không thuần" của một nút trong cây quyết định: xác suất gán nhãn sai nếu gán ngẫu nhiên theo tỉ lệ các lớp trong nút. Bằng 0 khi nút chỉ có một lớp (thuần nhất); lớn nhất khi các lớp chia đều. Cây chọn cách chia làm Gini giảm nhiều nhất. Ví dụ: nút 50% spam/50% không spam có Gini = 0,5; nút 100% spam có Gini = 0.
- **Permutation Importance**: Đo độ quan trọng của một feature bằng cách xáo trộn ngẫu nhiên các giá trị của cột đó trên tập test (phá vỡ quan hệ của nó với target) rồi xem độ chính xác giảm bao nhiêu. Giảm càng nhiều thì feature càng quan trọng. Không thiên vị như MDI nhưng chậm hơn. Ví dụ: xáo cột "thu nhập" làm accuracy giảm từ 90% xuống 72% → feature rất quan trọng.
- **GridSearchCV**: Công cụ của scikit-learn thử mọi tổ hợp hyperparameter trong một lưới cho trước, chấm điểm mỗi tổ hợp bằng cross-validation và trả về tổ hợp tốt nhất. Chắc chắn nhưng số lần thử tăng rất nhanh theo số tham số. Ví dụ: 3 giá trị × 3 giá trị × 3 giá trị = 27 tổ hợp, mỗi tổ hợp chạy 5-fold = 135 lần train.
- **RandomizedSearchCV**: Thay vì thử hết, chỉ thử ngẫu nhiên N tổ hợp hyperparameter lấy từ các khoảng/phân phối cho trước. Nhanh hơn nhiều khi có nhiều tham số mà kết quả thường gần bằng Grid Search. Ví dụ: `RandomizedSearchCV(model, params, n_iter=50, cv=5)`.
