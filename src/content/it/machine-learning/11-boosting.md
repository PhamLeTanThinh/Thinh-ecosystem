---
title: Ensemble (2) — Boosting: AdaBoost, Gradient Boosting, XGBoost
short: Boosting & XGBoost
icon: 🚀
summary: Nếu Bagging là "nhiều người đoán độc lập rồi bỏ phiếu" thì Boosting là "học từ lỗi sai": mỗi model mới tập trung sửa chỗ model trước làm sai. Bài này đi từ AdaBoost, Gradient Boosting tới XGBoost, LightGBM, CatBoost — những model thống trị dữ liệu dạng bảng.
---

# Mục tiêu
- Phân biệt Bagging và Boosting
- Hiểu AdaBoost: trọng số mẫu, trọng số model, Exponential Loss
- Hiểu Gradient Boosting: fit residual, pseudo-residual, learning rate
- Nắm những cải tiến của XGBoost và các hyperparameter chính
- Biết điểm khác biệt của LightGBM và CatBoost
- Chọn được thuật toán ensemble phù hợp cho bài toán

# Bagging vs Boosting

| Tiêu chí | Bagging | Boosting |
|---|---|---|
| Chiến lược | **Song song**, các model độc lập | **Nối tiếp**, model sau phụ thuộc model trước |
| Mục tiêu | Giảm **Variance** | Giảm **Bias** |
| Model nền | Cây sâu (bias thấp) | Cây nông / "stump" (variance thấp) |
| Trọng số các model | Ngang nhau | Khác nhau — model tốt có tiếng nói lớn hơn |
| Overfitting | Ít bị | Có thể bị nếu lặp quá nhiều vòng |
| Kết hợp kết quả | Bỏ phiếu / lấy trung bình | Tổng có trọng số |

```
Bagging:  Data → [Cây] [Cây] [Cây]  (song song)  → Bỏ phiếu / Trung bình
Boosting: Data → Model₁ → lỗi → Model₂ → lỗi → Model₃ → ...  → Tổng có trọng số
```

# Ý tưởng cốt lõi của Boosting

Năm 1988, Kearns và Valiant đặt câu hỏi: *"Gộp nhiều weak learner có tạo được một strong learner không?"* Năm 1990, Schapire chứng minh: **Có!**

- **[[Weak Learner]]**: chỉ cần tốt hơn đoán bừa (accuracy > 50% với bài toán 2 lớp). Ví dụ điển hình là **[[Decision Stump]]** — cây chỉ có **1 lần chia** (độ sâu 1), như "X > 5?".

Quy trình:
1. Train model đầu tiên trên toàn bộ dữ liệu.
2. Những mẫu bị **đoán sai** được "chú ý" nhiều hơn.
3. Model tiếp theo tập trung sửa các lỗi đó. Lặp lại, rồi kết hợp tất cả.

::: analogy Học sinh luyện đề
- Lần 1: làm sai 10 câu.
- Lần 2: chỉ ôn lại 10 câu sai → sửa được 7.
- Lần 3: ôn 3 câu còn sai → sửa hết.
→ Thành thạo toàn bộ. Boosting biến bài toán khó "tạo ngay 1 model mạnh" thành bài toán dễ "kết hợp nhiều model yếu".
:::

# AdaBoost — tăng trọng số cho mẫu khó

**[[AdaBoost]]** (Adaptive Boosting — Freund & Schapire, 1996, đoạt giải Gödel 2003): **tăng trọng số của mẫu bị phân loại sai** để model sau "chú ý" vào mẫu khó hơn.

### Thuật toán

**Khởi tạo**: mọi mẫu có trọng số bằng nhau $w_i = 1/n$.

**Lặp $t = 1, 2, \dots, T$:**

1. Train một weak learner $h_t$ trên dữ liệu có trọng số $w_i$ (mẫu trọng số cao được chú ý nhiều hơn).
2. Tính **lỗi có trọng số**: $\varepsilon_t = \dfrac{\sum_i w_i \cdot \mathbb{1}[h_t \text{ đoán sai mẫu } i]}{\sum_i w_i}$
3. Tính **trọng số của model**: $\alpha_t = \dfrac{1}{2}\ln\dfrac{1 - \varepsilon_t}{\varepsilon_t}$
4. Cập nhật trọng số mẫu:
   - Mẫu đoán **sai**: $w_i \leftarrow w_i \cdot e^{+\alpha_t}$ → **tăng**
   - Mẫu đoán **đúng**: $w_i \leftarrow w_i \cdot e^{-\alpha_t}$ → **giảm**
   - Chuẩn hóa để tổng trọng số bằng 1.

**Dự đoán cuối:**

::: formula
$$H(x) = \operatorname{sign}\!\left(\sum_{t=1}^{T} \alpha_t\, h_t(x)\right)$$
:::

Các weak learner cùng bỏ phiếu, model tốt ($\alpha$ lớn) có tiếng nói mạnh hơn; hàm sign (lấy dấu) quyết định lớp cuối cùng.

### Đọc ý nghĩa của $\alpha$

- $\varepsilon$ gần 0 (model rất tốt) → $\alpha$ rất lớn → đóng góp nhiều.
- $\varepsilon = 0.5$ (như đoán bừa) → $\alpha = 0$ → không đóng góp gì.
- $\varepsilon > 0.5$ (tệ hơn đoán bừa) → $\alpha < 0$ → **đảo ngược** dự đoán của nó.

AdaBoost tự đánh giá chất lượng từng weak learner và gán trọng số phù hợp.

!viz[Trọng số α của một weak learner thay đổi theo lỗi ε của nó: ε gần 0 → α rất lớn; ε = 0,5 → α = 0; ε > 0,5 → α âm (dự đoán bị đảo ngược).](adaboost-alpha)

::: example Minh họa 3 vòng với 10 mẫu
**Vòng 1**: 10 mẫu cùng trọng số 1/10. Stump chọn cách chia tốt nhất (ví dụ X > 3) → đúng 7, sai 3.
$\varepsilon = 3/10 = 0.3$ → $\alpha = \tfrac{1}{2}\ln\dfrac{0.7}{0.3} \approx$ **0.42**. 3 mẫu sai được tăng trọng số, 7 mẫu đúng giảm.

**Vòng 2**: 3 mẫu sai giờ "to" hơn → stump mới chia ở chỗ **khác**, ưu tiên làm đúng chúng. Sửa được phần lớn nhưng lại sai 2 mẫu khác → 2 mẫu này tăng trọng số.

**Vòng 3**: stump tập trung vào 2 mẫu đó…

Mỗi stump chỉ là một đường thẳng đơn giản, nhưng tổng có trọng số của nhiều stump tạo ra **đường ranh giới phi tuyến** phức tạp.
:::

### Góc nhìn hàm lỗi

AdaBoost thực chất đang tối thiểu hóa **[[Exponential Loss]]**:

::: formula
$$L = \exp\bigl(-y\,F(x)\bigr), \qquad F(x) = \sum_{t} \alpha_t\, h_t(x)$$
:::

Mỗi vòng lặp là một bước của **Forward Stagewise Additive Modeling** (xây model cộng dồn từng bước). Exponential loss phạt **cực nặng** mẫu bị sai — đây vừa là sức mạnh vừa là điểm yếu. AdaBoost là **trường hợp đặc biệt của Gradient Boosting** với exponential loss.

### Ưu và nhược

| Ưu điểm | Nhược điểm |
|---|---|
| Đơn giản, dễ cài đặt | **Rất nhạy với nhiễu và outlier** |
| Ít hyperparameter (chỉ T và loại weak learner) | Exponential loss không bền vững |
| Nền tảng lý thuyết vững (PAC learning) | Thiết kế chủ yếu cho classification |
| Có feature importance, không cần scaling | Chậm hơn Bagging vì phải chạy tuần tự |

::: warn Vì sao AdaBoost sợ outlier?
Một outlier (hoặc nhãn bị gán sai) **luôn bị đoán sai** → trọng số của nó tăng theo cấp số nhân qua mỗi vòng → các model sau dồn sức vào nó → đường ranh giới bị kéo lệch, hiệu năng giảm mạnh. Cách khắc phục: dùng Gradient Boosting với hàm loss bền hơn (Huber, MAE).
:::

# Gradient Boosting — học phần còn sai

**[[Gradient Boosting]]** (Jerome Friedman, 2001) là framework tổng quát hơn AdaBoost:

| AdaBoost | Gradient Boosting |
|---|---|
| Chỉ dùng exponential loss | **Bất kỳ** loss nào lấy đạo hàm được |
| Nhạy với nhiễu | Bền hơn (chọn loss phù hợp) |
| Tăng trọng số mẫu sai | Fit **pseudo-residual** (gradient âm) |
| Chủ yếu cho classification | Cả classification **và** regression |

### Ý tưởng: mỗi cây mới sửa "phần còn sai"

::: example Đoán con số 10
- Model 1 đoán **7** → còn thiếu (residual) 3.
- Model 2 học cách đoán phần thiếu đó, đoán được **2.5** → còn thiếu 0.5.
- Model 3 đoán được **0.4** → còn thiếu 0.1.
- Kết quả cuối = 7 + 2.5 + 0.4 = **9.9 ≈ 10**.

Mỗi model mới chỉ cần sửa phần còn sai ([[Residual]]); cộng dồn lại sẽ ngày càng chính xác.
:::

### Thuật toán (Regression)

1. **Khởi tạo**: $F_0(x)$ = một hằng số tốt nhất (với MSE chính là **trung bình của y**).
2. **Lặp $m = 1, 2, \dots, M$:**
   1. Tính **[[Pseudo-residual]]**: $r_i = -\dfrac{\partial L\bigl(y_i, F(x_i)\bigr)}{\partial F(x_i)}$ — gradient âm của loss.
   2. Fit một cây hồi quy $h_m$ lên dữ liệu $\{(x_i, r_i)\}$.
   3. Cập nhật: $F_m(x) = F_{m-1}(x) + \eta\, h_m(x)$, với $\eta$ là learning rate.

| Loss | Công thức | Pseudo-residual |
|---|---|---|
| MSE (L2) | $\tfrac{1}{2}(y - F)^2$ | **$y - F$** — chính là residual thông thường |
| MAE (L1) | $\lvert y - F \rvert$ | $\operatorname{sign}(y - F)$ — chỉ lấy dấu |
| Huber | Lai giữa L2 (sai số nhỏ) và L1 (sai số lớn) | $y - F$ nếu $\lvert y - F \rvert \le \delta$, ngược lại $\delta \cdot \operatorname{sign}(y - F)$ |
| Log Loss | $-\bigl[y \log p + (1 - y)\log(1 - p)\bigr]$ | $y - p$ (residual theo xác suất) |

→ Với MSE, "fit residual" đúng theo nghĩa đen. Với loss khác, pseudo-residual là khái niệm tổng quát hơn.

### Vì sao gọi là "Gradient"?

| Gradient Descent (không gian tham số) | Gradient Boosting (không gian hàm số) |
|---|---|
| $\theta \leftarrow \theta - \eta \dfrac{\partial L}{\partial \theta}$ | $F \leftarrow F + \eta\, h$, với $h \approx -\dfrac{\partial L}{\partial F}$ |
| Cập nhật **tham số** ngược hướng gradient | Cập nhật **cả hàm dự đoán** ngược hướng gradient |
| Dùng trong Neural Network, Linear Regression | Mỗi cây mới = một bước gradient descent |

::: example Tính tay một vòng
$y = [3, 5, 7, 9]$, learning rate $\eta = 0.5$, cây có 1 lần chia.

- **Vòng 0**: F₀ = trung bình = **6** cho tất cả → residual = [−3, −1, 1, 3].
- **Vòng 1**: cây chia thành nhóm {3, 5} và {7, 9}; giá trị lá = trung bình residual mỗi nhóm = **−2** và **+2**.
  F₁ = 6 + 0.5 × (−2) = **5** cho hai điểm đầu, 6 + 0.5 × 2 = **7** cho hai điểm sau.
  → dự đoán [5, 5, 7, 7], residual mới = [−2, 0, 0, 2]. Lỗi lớn nhất giảm từ 3 xuống 2.
- Các vòng sau tiếp tục fit residual còn lại → residual giảm dần qua mỗi vòng.

Với $\eta = 0.5$, mỗi cây chỉ đóng góp 50% — gọi là "học chậm" (slow learning).
:::

!viz[Gradient Boosting chạy thật trên 40 điểm: vòng 0 đoán bằng trung bình; mỗi vòng thêm một stump học phần còn sai (residual, vạch đỏ bên dưới) và cộng vào với learning rate 0,35. Đường dự đoán (cam) khớp dần, residual nhỏ dần.](gradient-boosting)

### Regularization cho Gradient Boosting

**[[Shrinkage]] — learning rate $\eta$:**

| $\eta$ nhỏ (0.01–0.1) | $\eta$ lớn (0.3–1.0) |
|---|---|
| Tổng quát hóa tốt hơn ("học chậm") | Cần ít cây, train nhanh |
| Cần nhiều cây hơn, train lâu hơn | Dễ overfit, kém ổn định |

**Quy tắc vàng: $\eta$ nhỏ + nhiều cây tốt hơn $\eta$ lớn + ít cây.**

**[[Stochastic Gradient Boosting]]** (Friedman): mỗi vòng chỉ dùng một phần dữ liệu (ví dụ 80%) → đưa ý tưởng của Bagging vào Boosting → giảm variance thêm, train nhanh hơn.

**Giới hạn cây**: `max_depth` 3–8 (nông hơn hẳn Random Forest), `min_samples_leaf`, `max_leaf_nodes`.

::: tip So sánh độ sâu cây
AdaBoost: depth = 1 (stump) · Gradient Boosting: depth = 3–8 · Random Forest: mọc tối đa.
:::

# XGBoost — eXtreme Gradient Boosting

**[[XGBoost]]** (Tianqi Chen, công bố tại KDD 2016) là bản cài đặt Gradient Boosting được tối ưu "cực độ": thắng phần lớn các cuộc thi Kaggle giai đoạn 2015–2020 và được dùng rộng rãi trong công nghiệp (phát hiện gian lận, gợi ý, định giá).

### Hàm mục tiêu có regularization sẵn

::: formula
$$\text{Obj} = \sum_{i} L(y_i, \hat{y}_i) + \sum_{k} \Omega(f_k), \qquad \Omega(f) = \gamma\,T + \frac{1}{2}\lambda \lVert w \rVert^2$$
:::

- Phần đầu: model khớp dữ liệu tới đâu (MSE, Log Loss…).
- **Ω(f)** — phạt độ phức tạp của mỗi cây:
  - **$T$** = số lá; **$\gamma$** (gamma) = phạt cho mỗi lá thêm vào → cắt tỉa sẵn.
  - **$w$** = giá trị ở các lá; **$\lambda$** = L2 regularization cho giá trị lá → chống overfit.

Gradient Boosting truyền thống **không** có phần regularization này trong hàm mục tiêu.

### Dùng cả đạo hàm bậc 2

XGBoost xấp xỉ loss bằng **khai triển Taylor bậc 2**, dùng cả:
- **$g_i$** = đạo hàm bậc 1 (gradient) — "dốc" tới đâu.
- **$h_i$** = đạo hàm bậc 2 ([[Hessian]]) — "cong" tới đâu.

Lợi ích: tìm được **giá trị lá tối ưu bằng công thức trực tiếp** $w^* = -\dfrac{G}{H + \lambda}$, tính được độ lợi khi chia bằng công thức chính xác, và hội tụ nhanh hơn.

::: analogy
Gradient Boosting thường giống người xuống núi chỉ biết **độ dốc**. XGBoost biết thêm **độ cong của địa hình** nên chọn bước đi thông minh hơn.
:::

### Công thức độ lợi khi chia nút

::: formula
$$\text{Gain} = \frac{1}{2}\left[\frac{G_L^2}{H_L + \lambda} + \frac{G_R^2}{H_R + \lambda} - \frac{(G_L + G_R)^2}{H_L + H_R + \lambda}\right] - \gamma$$
:::

- G_L, G_R: tổng gradient bên trái/phải; H_L, H_R: tổng hessian bên trái/phải.
- Hai số hạng đầu: "chất lượng" hai nhánh nếu chia; số hạng thứ ba: chất lượng nếu **không** chia.
- **$\gamma$** là ngưỡng độ lợi tối thiểu: Gain $\le 0$ thì **không chia** → cắt tỉa sẵn ngay khi mọc cây. $\gamma$ càng lớn cây càng đơn giản.

### 8 cải tiến kỹ thuật

1. **Regularized objective** — L1 ($\alpha$) + L2 ($\lambda$) trên giá trị lá.
2. **Shrinkage** — learning rate $\eta$.
3. **Column subsampling** — chọn ngẫu nhiên tập con feature theo cây / theo tầng / theo nút (giống ý tưởng Random Forest).
4. **Sparsity-aware** — **tự xử lý missing values**: học "hướng mặc định" tốt nhất cho giá trị thiếu ở mỗi nút, không cần điền trước.
5. **Weighted Quantile Sketch** — tìm điểm chia hiệu quả với dữ liệu lớn và train phân tán.
6. **Cache-aware access** — tổ chức bộ nhớ theo khối cột để giảm cache miss.
7. **Out-of-core** — xử lý dữ liệu lớn hơn RAM (nén khối + đọc trước).
8. **Built-in CV + Early Stopping** — `xgb.cv()`, dừng sớm khi điểm validation không còn cải thiện.

| Tiêu chí | GBM của scikit-learn | XGBoost |
|---|---|---|
| Tối ưu | Đạo hàm bậc 1 | Bậc 1 + bậc 2 (Hessian) |
| Regularization | Shrinkage, độ sâu | L1, L2, $\gamma$, shrinkage, subsample |
| Missing values | Cần điền trước | Tự xử lý |
| Column subsampling | Không | Có (cây/tầng/nút) |
| Cắt tỉa | Hậu kỳ (giới hạn `max_depth`) | Ngay khi mọc (theo Gain và $\gamma$) |
| Song song | Không | Có (ở mức feature) |
| Early stopping | Phải tự làm | Có sẵn |

### Hyperparameter của XGBoost

| Tham số | Ý nghĩa | Giá trị hay dùng |
|---|---|---|
| `n_estimators` | Số cây | 100–1000+ |
| `learning_rate` (eta) | Shrinkage | 0.01–0.3 (mặc định 0.3) |
| `early_stopping_rounds` | Dừng nếu validation không cải thiện sau N vòng | 20–50 |
| `max_depth` | Độ sâu cây | 3–10 (mặc định 6) |
| `min_child_weight` | Tổng hessian tối thiểu ở một lá — chống overfit | 1–10 |
| `gamma` (min_split_loss) | Độ lợi tối thiểu để chia | 0 (mặc định) – 5 |
| `subsample` | Tỉ lệ dòng mỗi cây | 0.5–1.0 |
| `colsample_bytree` / `bylevel` / `bynode` | Tỉ lệ cột | 0.5–1.0 |
| `reg_lambda` | L2 | mặc định 1 |
| `reg_alpha` | L1 | mặc định 0 |

**Chiến lược tune:**
1. Cố định learning rate thấp (0.01–0.05).
2. Tune `max_depth`, `min_child_weight`.
3. Tune `subsample`, `colsample_bytree`.
4. Tune `gamma`, `reg_lambda`, `reg_alpha`.
5. Giảm thêm learning rate, tăng `n_estimators` kèm early stopping.

# LightGBM và CatBoost — thế hệ tiếp theo

### LightGBM (Microsoft, 2017)

- **[[GOSS]]**: giữ lại các mẫu có gradient **lớn** (mẫu khó), chỉ lấy ngẫu nhiên một phần mẫu gradient **nhỏ** (mẫu dễ) → giảm lượng dữ liệu mà vẫn giữ độ chính xác.
- **[[EFB]]**: gộp những feature hiếm khi cùng khác 0 (ví dụ các cột one-hot) thành một "bó" → giảm số feature.
- **Mọc cây theo lá ([[Leaf-wise Growth]])**: mỗi bước chọn **lá giảm loss nhiều nhất** để chia tiếp → nhanh hơn, nhưng dễ overfit với dữ liệu nhỏ. XGBoost mặc định mọc **theo tầng** (level-wise): chia đều mọi nút cùng tầng → cân đối, an toàn hơn.

### CatBoost (Yandex, 2018)

- **Ordered Target Statistics**: xử lý **feature phân loại trực tiếp** (không cần one-hot), dùng thứ tự các mẫu để tránh [[Target Leakage]].
- **Ordered Boosting**: tính residual và train model trên các phần dữ liệu khác nhau → chống hiện tượng dự đoán bị lệch (prediction shift), giảm overfit.
- **Oblivious Trees**: mọi nút cùng một tầng dùng **chung một điều kiện chia** → cây đối xứng, dự đoán rất nhanh, tự có tính regularization.
- Dùng khi: nhiều feature phân loại, muốn hiệu năng tốt ngay mà ít phải tune.

| Tiêu chí | XGBoost | LightGBM | CatBoost |
|---|---|---|---|
| Cách mọc cây | Theo tầng | Theo lá | Đối xứng |
| Tốc độ | Trung bình | **Nhanh nhất** | Trung bình |
| Feature phân loại | Cần mã hóa | Cần mã hóa (có hỗ trợ một phần) | **Hỗ trợ sẵn** |
| Missing values | Tự xử lý | Tự xử lý | Tự xử lý |
| Hiệu năng mặc định | Tốt | Tốt | **Rất tốt (ít tune)** |
| Rủi ro overfit | Trung bình | Cao hơn với dữ liệu nhỏ | Thấp hơn |
| Hợp nhất với | Mục đích chung | Dữ liệu lớn, cần tốc độ | Nhiều cột phân loại |

# Tổng hợp và cách chọn

| | Random Forest | AdaBoost | GBM | XGBoost |
|---|---|---|---|---|
| Chiến lược | Song song | Nối tiếp | Nối tiếp | Nối tiếp |
| Mục tiêu | Giảm variance | Giảm bias | Giảm bias | Giảm bias + regularization |
| Model nền | Cây sâu | Stump | Cây nông (3–8) | Cây nông (3–10) |
| Học từ | Bootstrap | Trọng số mẫu | Pseudo-residual | Pseudo-residual (bậc 2) |
| Regularization | Lấy trung bình | Ít | Shrinkage, subsample | L1, L2, $\gamma$, shrinkage, subsample |
| Overfitting | Ít | Nhạy với nhiễu | Cần tune | Kiểm soát tốt |
| Tốc độ | Nhanh (song song) | Chậm | Chậm | Tối ưu |

**Dòng thời gian:** Bagging (1996) → AdaBoost (1996) → Gradient Boosting, Random Forest (2001) → XGBoost (2014) → LightGBM (2017) → CatBoost (2018). Xu hướng: ngày càng nhanh, regularize tốt hơn, xử lý dữ liệu khéo hơn.

**Chọn nhanh:**
- Cần baseline nhanh, ít tune → **Random Forest**
- Cần độ chính xác cao, sẵn sàng tune → **XGBoost**
- Dữ liệu rất lớn, cần tốc độ → **LightGBM**
- Nhiều feature phân loại → **CatBoost**
- Cần giải thích → **một cây đơn** hoặc ensemble + **[[SHAP]]**

# Thực hành

```python
import xgboost as xgb
import lightgbm as lgb
import catboost as cb
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score

# Tách thêm validation set để early stopping — KHÔNG dùng test set cho việc này
X_tr, X_val, y_tr, y_val = train_test_split(X_train, y_train, test_size=0.2, random_state=42)

# Lab 3 — XGBoost + Early Stopping
model = xgb.XGBClassifier(n_estimators=1000, learning_rate=0.05, max_depth=5,
                          early_stopping_rounds=20, eval_metric='logloss')
model.fit(X_tr, y_tr, eval_set=[(X_tr, y_tr), (X_val, y_val)], verbose=False)
results = model.evals_result()      # đường cong loss train/validation
print(model.best_iteration)

# Lab 4 — so sánh 4 ensemble (luôn truyền tham số theo tên)
models = {
    'RF':       RandomForestClassifier(n_estimators=100),
    'AdaBoost': AdaBoostClassifier(n_estimators=100),
    'GBM':      GradientBoostingClassifier(n_estimators=100),
    'XGBoost':  xgb.XGBClassifier(n_estimators=100),
}
for name, m in models.items():
    scores = cross_val_score(m, X_train, y_train, cv=5)
    print(name, scores.mean(), scores.std())

# Lab 6 — XGBoost vs LightGBM vs CatBoost
fast = {
    'XGBoost':  xgb.XGBClassifier(n_estimators=200, learning_rate=0.05),
    'LightGBM': lgb.LGBMClassifier(n_estimators=200, learning_rate=0.05),
    'CatBoost': cb.CatBoostClassifier(iterations=200, learning_rate=0.05, verbose=0),
}
```

Các lab khác nên thử: vẽ đường ranh giới AdaBoost với 1, 5, 10, 50 stump trên dữ liệu `make_moons` để thấy ranh giới phức tạp dần; vẽ GradientBoostingRegressor fit đường sin với 1, 5, 10, 50, 100 cây để thấy residual giảm dần.

::: warn Truyền tham số theo tên
Viết `GradientBoostingClassifier(100)` sẽ báo lỗi, vì nhiều estimator chỉ nhận tham số dạng `tên=giá trị`. Còn `AdaBoostClassifier(100)` không báo lỗi ngay nhưng hiểu nhầm số 100 là `estimator`. Luôn viết rõ `n_estimators=100`.
:::

# Ghi nhớ nhanh
- Boosting = nối tiếp, giảm bias; mỗi model sửa lỗi của model trước.
- AdaBoost: tăng trọng số mẫu sai, $\alpha = \tfrac{1}{2}\ln\frac{1 - \varepsilon}{\varepsilon}$, dự đoán $H(x) = \operatorname{sign}\bigl(\sum_t \alpha_t h_t(x)\bigr)$; nhạy với nhiễu.
- Gradient Boosting: fit pseudo-residual $= -\partial L / \partial F$; $F_m = F_{m-1} + \eta\, h_m$; $\eta$ nhỏ + nhiều cây là tốt hơn.
- XGBoost: Gradient Boosting + đạo hàm bậc 2 + regularization ($\gamma, \lambda, \alpha$) + tự xử lý missing + early stopping.
- LightGBM nhanh nhất (GOSS, EFB, leaf-wise); CatBoost mạnh với feature phân loại, ít phải tune.
- Early stopping phải dùng validation set, không dùng test set.

# Thuật ngữ
- **Decision Stump**: Cây quyết định chỉ có đúng một lần chia (độ sâu 1) — một câu hỏi duy nhất rồi ra kết luận. Rất yếu khi đứng một mình nhưng là weak learner điển hình của AdaBoost. Ví dụ: "X > 5? → lớp A, ngược lại → lớp B".
- **AdaBoost** (Adaptive Boosting): Thuật toán Boosting đầu tiên thành công: sau mỗi vòng tăng trọng số cho các mẫu bị phân loại sai để model vòng sau chú ý vào chúng; mỗi model được gán trọng số α theo độ chính xác, rồi cộng có trọng số lại. Đơn giản nhưng nhạy với nhiễu và outlier. Ví dụ: `AdaBoostClassifier(n_estimators=100)` với 100 stump.
- **Exponential Loss**: Hàm lỗi exp(−y·F(x)) mà AdaBoost tối thiểu hoá. Dự đoán càng sai thì lỗi tăng theo cấp số mũ — phạt cực nặng mẫu bị sai, nên một outlier có thể kéo lệch cả model. Ví dụ: một nhãn bị gán nhầm cứ sai mãi, trọng số của nó phình to qua mỗi vòng.
- **Gradient Boosting**: Boosting dạng tổng quát: mỗi cây mới học cách dự đoán phần "còn sai" (gradient âm của hàm loss) của tổng các cây trước, rồi được cộng thêm vào với một hệ số nhỏ. Dùng được với mọi hàm loss lấy đạo hàm được, cho cả phân loại lẫn hồi quy. Ví dụ: đoán 10 → cây 1 đoán 7, cây 2 đoán phần thiếu 2,5, cây 3 đoán 0,4 → tổng 9,9.
- **Pseudo-residual**: "Phần dư giả" — gradient âm của hàm loss theo dự đoán hiện tại, là mục tiêu mà cây tiếp theo trong Gradient Boosting học để đoán. Với MSE nó chính là residual y − F quen thuộc; với loss khác thì là dạng tổng quát hơn. Ví dụ: y = 9, dự đoán hiện tại 6 → với MSE pseudo-residual = 3.
- **Shrinkage**: Nhân đóng góp của mỗi cây với một learning rate nhỏ (ví dụ 0,05) để model "học chậm mà chắc". Cần nhiều cây hơn nhưng tổng quát hoá tốt hơn, bớt overfit. Quy tắc: learning rate nhỏ + nhiều cây tốt hơn learning rate lớn + ít cây. Ví dụ: `learning_rate=0.05, n_estimators=1000`.
- **Stochastic Gradient Boosting**: Gradient Boosting mà mỗi vòng chỉ dùng một phần dữ liệu chọn ngẫu nhiên (ví dụ 80%) để xây cây — đưa ý tưởng ngẫu nhiên của Bagging vào Boosting, vừa giảm variance vừa chạy nhanh hơn. Ví dụ: tham số `subsample=0.8`.
- **Hessian**: Đạo hàm bậc 2 — cho biết độ cong của hàm loss (gradient đang thay đổi nhanh hay chậm). XGBoost dùng cả gradient lẫn hessian nên tính được giá trị lá tối ưu trực tiếp và hội tụ nhanh hơn. Ví dụ: như người xuống núi biết cả độ dốc lẫn độ cong của sườn núi để chọn bước đi.
- **GOSS** (Gradient-based One-Side Sampling): Kỹ thuật của LightGBM: giữ lại toàn bộ mẫu có gradient lớn (mẫu khó, đang sai nhiều) và chỉ lấy ngẫu nhiên một phần mẫu gradient nhỏ (mẫu dễ). Giảm lượng dữ liệu cần xử lý mà gần như không mất độ chính xác. Ví dụ: giữ 20% mẫu khó nhất + 10% ngẫu nhiên từ phần còn lại.
- **EFB** (Exclusive Feature Bundling): Kỹ thuật của LightGBM: gộp những feature hiếm khi cùng khác 0 trên một dòng (thường gặp với dữ liệu thưa) thành một "bó" feature duy nhất. Giảm mạnh số feature cần xét mà không mất thông tin. Ví dụ: gộp hàng trăm cột one-hot thành vài cột.
- **Leaf-wise Growth**: Mọc cây theo lá — mỗi bước chỉ chia tiếp chiếc lá làm loss giảm nhiều nhất, thay vì chia đều cả tầng. Đạt độ chính xác cao với ít lá hơn nên nhanh, nhưng dễ tạo cây lệch sâu và overfit với dữ liệu nhỏ. Là cách mặc định của LightGBM. Ví dụ: giới hạn bằng `num_leaves` và `max_depth` để tránh overfit.
- **Target Leakage**: Rò rỉ nhãn — feature vô tình chứa thông tin của chính target (hoặc thông tin chỉ có sau khi biết target), khiến model "ăn gian" lúc train nhưng vô dụng khi chạy thật. CatBoost dùng ordered target statistics để tránh lỗi này khi mã hoá feature phân loại. Ví dụ: dùng "đã được bồi thường bảo hiểm" để dự đoán "có xảy ra tai nạn".
