---
title: Bias-Variance & Regularization — Chống Overfitting
short: Regularization
icon: 🧲
summary: Vì sao model phức tạp lại hay "học vẹt"? Bài này giải thích sự giằng co giữa Bias và Variance, rồi đến Regularization — kỹ thuật "phạt" weight lớn để model đơn giản hơn: Ridge (L2), Lasso (L1) và Elastic Net.
---

# Mục tiêu
- Giải thích được Bias, Variance và sự đánh đổi giữa chúng
- Biết hai hướng xử lý Overfitting: giảm feature và Regularization
- Hiểu cost function có thêm "khoản phạt" và vai trò của λ
- Hiểu "weight decay" trong Gradient Descent có regularization
- Phân biệt L1 (Lasso), L2 (Ridge) và Elastic Net, biết khi nào dùng cái nào

# Nhắc lại Overfitting qua ví dụ giá nhà

Dự đoán giá nhà từ diện tích, thử 3 model:

| Model | Công thức | Kết quả |
|---|---|---|
| Bậc 1 | θ₀ + θ₁x | Đường thẳng, không bắt được độ cong → **Underfitting** (High Bias) |
| Bậc 2 | θ₀ + θ₁x + θ₂x² | Đường cong nhẹ, vừa khít → **Just right** |
| Bậc 4 | θ₀ + θ₁x + θ₂x² + θ₃x³ + θ₄x⁴ | Uốn lượn qua từng điểm → **Overfitting** (High Variance) |

!viz[Dự đoán giá nhà theo diện tích với đa thức bậc 1 → 2 → 4 → 8: bậc 1 underfitting (high bias), bậc 2 vừa khít, bậc càng cao càng uốn éo qua từng điểm — overfitting (high variance).](poly-fit-house)

(Ở bài này hệ số được ký hiệu θ — đọc là "theta" — thay cho β ở bài trước; cùng một ý nghĩa.)

Khi có **quá nhiều feature** (model quá phức tạp), model có thể khớp tập train gần như hoàn hảo (lỗi train ≈ 0) nhưng **không tổng quát hóa** được cho căn nhà mới. Chuyện tương tự xảy ra với phân loại: Logistic Regression với rất nhiều số hạng bậc cao (x₁², x₁x₂, x₁²x₂…) sẽ vẽ ra đường ranh giới ngoằn ngoèo để "ôm" từng điểm dữ liệu.

!viz[Tương tự với phân loại (minh hoạ bằng kNN): k lớn → ranh giới quá đơn giản (underfit); k vừa → ranh giới hợp lý; k = 1 → ranh giới ngoằn ngoèo ôm từng điểm, kể cả điểm nhiễu (overfit).](knn-boundary)

# Bias và Variance

::: analogy Bắn cung
- **[[Bias]]** thấp = các mũi tên trung bình rơi **đúng tâm**. Bias cao = trung bình **lệch hẳn sang một bên**.
- **Variance** thấp = các mũi tên **chụm lại**. Variance cao = **tản mát** mỗi mũi một nơi.

Lý tưởng là bias thấp + variance thấp: chụm và trúng tâm.
:::

!viz[Mỗi phát bắn là một model train trên một bộ dữ liệu khác nhau. Bias thấp = trung bình các phát rơi đúng tâm; variance thấp = các phát chụm lại.](bias-variance-targets)

- **Bias** = chênh lệch giữa *cái model kỳ vọng học được* và *sự thật*. Đo khả năng model **biểu diễn được** lời giải đúng. Model càng phức tạp → bias càng **giảm**.
- **[[Variance]]** (trong bối cảnh này) = chênh lệch giữa *cái model kỳ vọng học được* và *cái nó học được từ một bộ dữ liệu cụ thể*. Đo mức model **nhạy cảm** với việc đổi dữ liệu train. Model càng phức tạp → variance càng **tăng**.

### Phân rã lỗi

::: formula
Lỗi dự đoán kỳ vọng = Bias² + Variance + Nhiễu không thể giảm
:::

Phần nhiễu ([[Irreducible Error]]) nằm sẵn trong dữ liệu, model nào cũng chịu. Hai phần còn lại **kéo co** với nhau: giảm cái này thường làm tăng cái kia → gọi là **[[Bias-Variance Tradeoff]]**. Mục tiêu là tìm điểm cân bằng.

| | High Bias (Underfitting) | High Variance (Overfitting) |
|---|---|---|
| Triệu chứng | Lỗi train **cao**, lỗi validation/test **cao** | Lỗi train **thấp**, lỗi validation **cao** (khoảng cách lớn) |
| Nguyên nhân | Model quá đơn giản | Model quá phức tạp so với lượng dữ liệu |
| Cách sửa | Thêm feature, dùng model phức tạp hơn, **giảm** regularization | Thêm dữ liệu, **tăng** regularization, Dropout, Early Stopping |

# Hai cách xử lý Overfitting

Giả sử có 100 feature: diện tích, số phòng, số tầng, tuổi nhà, thu nhập trung bình khu vực, diện tích bếp… mà dữ liệu thì ít.

1. **Giảm số feature**
   - Tự chọn tay những feature nên giữ.
   - Dùng thuật toán chọn feature (xem bài Feature Selection).
   - Nhược điểm: bỏ feature là bỏ luôn thông tin.
2. **[[Regularization]]**
   - **Giữ tất cả feature**, nhưng **ép các hệ số θ nhỏ lại**.
   - Hiệu quả khi có nhiều feature, mỗi cái đóng góp một chút vào dự đoán.

# Regularization hoạt động thế nào?

### Trực giác

Với model bậc 4 bị overfitting, giả sử ta sửa cost function thành:

::: formula
min  (1/2m) Σ (hθ(x) − y)²  +  1000·θ₃²  +  1000·θ₄²
:::

Để cost nhỏ, model buộc phải cho θ₃ và θ₄ **gần bằng 0** → hai số hạng x³, x⁴ gần như biến mất → model quay về gần dạng bậc 2, mượt mà.

**Hệ số nhỏ → model "đơn giản" hơn → ít overfitting hơn.**

### Cost function có regularization

Thực tế ta không biết nên phạt hệ số nào, nên **phạt tất cả** (trừ θ₀):

::: formula
J(θ) = (1/2m) [ Σᵢ (hθ(xᵢ) − yᵢ)²  +  λ Σⱼ θⱼ² ]
:::

- Phần đầu: model khớp dữ liệu tới đâu.
- Phần sau: **khoản phạt** cho hệ số lớn.
- **λ** (lambda) — [[Regularization Parameter]]: quyết định phạt nặng hay nhẹ. Trong scikit-learn tham số này tên là `alpha`.
- θ₀ (hệ số chặn) **không bị phạt** vì nó chỉ dịch đường lên xuống, không làm model phức tạp thêm.

::: warn Nếu λ quá lớn (ví dụ 10¹⁰) thì sao?
Mọi θ₁, θ₂, … bị ép về gần 0 → model chỉ còn hθ(x) ≈ θ₀ — **một đường nằm ngang**. Model **underfitting**: khớp dữ liệu train cũng không nổi.

- λ = 0: không regularization → dễ overfitting.
- λ quá lớn: underfitting.
- λ vừa phải: cân bằng — thường chọn bằng [[K-Fold Cross-Validation]].
:::

# Regularized Linear Regression

Gradient Descent bình thường cập nhật:

::: formula
θⱼ := θⱼ − α · (1/m) Σ (hθ(xᵢ) − yᵢ)·xᵢⱼ
:::

Có regularization (với j = 1, 2, …, n; riêng θ₀ giữ như cũ):

::: formula
θⱼ := θⱼ · (1 − α·λ/m)  −  α · (1/m) Σ (hθ(xᵢ) − yᵢ)·xᵢⱼ
:::

Vì (1 − αλ/m) **nhỏ hơn 1 một chút** (ví dụ 0.99), mỗi bước cập nhật đều **co hệ số lại một chút** trước khi trừ gradient như thường. Hiện tượng này gọi là **[[Weight Decay]]** — "trọng số phân rã dần".

# Regularized Logistic Regression

Ý tưởng y hệt: lấy [[Log Loss]] rồi cộng thêm khoản phạt:

::: formula
J(θ) = −(1/m) Σ [ y·log hθ(x) + (1−y)·log(1 − hθ(x)) ]  +  (λ/2m) Σⱼ θⱼ²
:::

Kết quả: đường ranh giới quyết định mượt hơn, bớt ngoằn ngoèo. Công thức cập nhật Gradient Descent giống hệt bản Linear Regression, chỉ khác hθ(x) là sigmoid.

# L1, L2 và Elastic Net

Khoản phạt ở trên dùng **bình phương** hệ số — gọi là L2. Còn một cách phạt khác dùng **trị tuyệt đối** — L1.

| | **L2 — [[Ridge Regression]]** | **L1 — [[Lasso Regression]]** | **[[Elastic Net]]** |
|---|---|---|---|
| Khoản phạt | λ · Σ θⱼ² | λ · Σ \|θⱼ\| | Kết hợp: α·Σ\|θⱼ\| + (1−α)·Σθⱼ² |
| Tác dụng | Co **đều** mọi hệ số, nhỏ nhưng **khác 0** | Đẩy nhiều hệ số về **đúng bằng 0** | Vừa chọn feature vừa co hệ số |
| Hợp khi | Mọi feature đều đóng góp một ít | Nhiều feature vô dụng — muốn **tự động chọn feature** | Nhiều feature tương quan với nhau |
| Tên gọi khác | Tikhonov regularization | LASSO = Least Absolute Shrinkage and Selection Operator | — |
| Cách giải | Có công thức dạng đóng | Proximal gradient descent, Least Angle Regression | Proximal gradient descent |

::: analogy Vì sao L1 tạo ra số 0 còn L2 thì không?
Vẽ trên mặt phẳng 2 hệ số: vùng ràng buộc của L2 là **hình tròn**, của L1 là **hình thoi** có các góc nhọn nằm ngay trên trục. Các đường đồng mức của hàm lỗi (hình elip) thường chạm hình thoi đúng tại **góc** — nơi một hệ số bằng 0. Còn hình tròn thì trơn, điểm chạm hiếm khi rơi đúng lên trục.
:::

!viz[Đường đồng mức của hàm lỗi (elip đỏ) nở dần từ nghiệm không phạt β̂ cho tới khi chạm vùng ràng buộc. Với Lasso, điểm chạm rơi đúng góc hình thoi nên β₂ = 0; với Ridge, điểm chạm trên hình tròn nên cả hai hệ số đều khác 0.](l1-l2-balls)

!viz[Khi λ tăng giảm: trục ngang là hệ số không phạt, trục dọc là hệ số sau khi phạt (đường chéo nét đứt = không đổi). Best subset giữ nguyên hoặc bỏ hẳn; Ridge co đều theo tỉ lệ; Lasso trừ bớt λ và đưa các hệ số nhỏ về đúng 0.](shrinkage-functions)

::: example So sánh Lasso và Ridge
```python
from sklearn.linear_model import Lasso, Ridge, ElasticNet

lasso = Lasso(alpha=0.1).fit(X_train, y_train)
print(lasso.coef_)   # vd [1.2, 0.0, 0.0, 3.4, 0.0] ← nhiều số 0 = tự loại feature

ridge = Ridge(alpha=0.1).fit(X_train, y_train)
print(ridge.coef_)   # vd [1.1, 0.2, 0.3, 3.2, 0.1] ← tất cả nhỏ nhưng khác 0

enet = ElasticNet(alpha=0.1, l1_ratio=0.5).fit(X_train, y_train)   # nửa L1, nửa L2
```
:::

::: tip Nhớ chuẩn hóa dữ liệu trước khi regularize
Khoản phạt tính trên độ lớn hệ số, mà độ lớn hệ số phụ thuộc thang đo của feature (mét hay centimet). Hãy đưa các feature về cùng thang (ví dụ dùng `StandardScaler`) để việc phạt được công bằng.
:::

# Ghi nhớ nhanh
- Tổng lỗi = Bias² + Variance + Nhiễu. Model phức tạp: bias ↓, variance ↑.
- Train tốt mà validation kém → High Variance (overfitting). Cả hai đều kém → High Bias (underfitting).
- Regularization: cộng thêm khoản phạt λ·(độ lớn hệ số) vào cost function; không phạt θ₀.
- λ = 0 → dễ overfit; λ quá lớn → underfit; chọn λ bằng cross-validation.
- L2 (Ridge) co đều mọi hệ số; L1 (Lasso) đưa nhiều hệ số về 0 → tự chọn feature; Elastic Net kết hợp cả hai.

# Thuật ngữ
- **Bias**: Độ chệch — mức sai lệch có hệ thống giữa những gì model học được (tính trung bình qua nhiều lần train) và sự thật. Bias cao khi model quá đơn giản, giả định sai về dữ liệu, nên dù có bao nhiêu dữ liệu vẫn sai. Ví dụ: dùng đường thẳng cho quan hệ hình chữ U luôn đoán sai ở hai đầu.
- **Irreducible Error**: Lỗi không thể giảm — phần nhiễu có sẵn trong bản thân dữ liệu (đo sai, yếu tố ngẫu nhiên chưa ghi nhận), model nào dù tốt tới đâu cũng không loại bỏ được. Ví dụ: hai căn nhà giống hệt nhau vẫn bán giá khác nhau do người mua trả giá khác nhau.
- **Bias-Variance Tradeoff**: Sự đánh đổi giữa bias và variance: model đơn giản thì bias cao nhưng variance thấp; model phức tạp thì bias thấp nhưng variance cao. Tổng lỗi = Bias² + Variance + Nhiễu, nên cần tìm độ phức tạp vừa phải để tổng nhỏ nhất. Ví dụ: đa thức bậc 1 underfit, bậc 15 overfit, bậc 2–3 thường là điểm cân bằng.
- **Regularization Parameter**: Tham số λ (trong scikit-learn tên là `alpha`) điều chỉnh mức phạt hệ số lớn trong regularization. λ = 0 là không phạt (dễ overfit); λ quá lớn là ép mọi hệ số về 0 (underfit). Thường chọn bằng cross-validation. Ví dụ: thử λ = 0,01; 0,1; 1; 10 rồi chọn giá trị cho lỗi validation thấp nhất.
- **Weight Decay**: "Phân rã trọng số" — mỗi bước cập nhật đều nhân weight với một số nhỏ hơn 1 (ví dụ 0,99) trước khi trừ gradient, làm weight co dần về 0 nếu không được dữ liệu "níu" lại. Tương đương L2 regularization trong Gradient Descent thông thường. Ví dụ: tham số `weight_decay=1e-4` khi khai báo optimizer trong PyTorch.
- **Ridge Regression**: Linear Regression có thêm khoản phạt L2 — tổng bình phương các hệ số. Co mọi hệ số nhỏ lại đều đều nhưng không đưa về đúng 0. Hợp khi mọi feature đều đóng góp một ít, hoặc các feature tương quan với nhau. Ví dụ: `Ridge(alpha=1.0)` trong scikit-learn.
- **Lasso Regression**: Linear Regression có thêm khoản phạt L1 — tổng trị tuyệt đối các hệ số. Đặc điểm nổi bật: đẩy hệ số của feature ít hữu ích về đúng 0, tức tự động loại feature. Hợp khi có nhiều feature vô dụng. Ví dụ: 100 feature đầu vào, Lasso chỉ giữ lại 12 feature có hệ số khác 0.
- **Elastic Net**: Regularization kết hợp cả L1 và L2 theo một tỉ lệ (tham số `l1_ratio`). Vừa loại bớt feature như Lasso, vừa ổn định như Ridge khi các feature tương quan mạnh với nhau. Ví dụ: `ElasticNet(alpha=0.1, l1_ratio=0.5)` — nửa L1, nửa L2.
