---
title: Logistic Regression — Phân loại bằng xác suất
short: Logistic Regression
icon: 🚦
summary: Tên có chữ "Regression" nhưng thật ra là thuật toán phân loại. Logistic Regression lấy một đường thẳng, đưa qua hàm sigmoid để biến thành xác suất 0–1, rồi chọn ngưỡng để ra quyết định. Đây là nền móng của phân loại và cũng là "một nơ-ron" trong mạng nơ-ron.
---

# Mục tiêu
- Hiểu vì sao cần thuật toán phân loại riêng thay vì dùng Linear Regression
- Nắm hàm Sigmoid, xác suất và ngưỡng quyết định
- Hiểu vì sao dùng Log Loss (Binary Cross-Entropy) thay vì MSE
- Tính tay được một bước cập nhật Gradient Descent
- Mở rộng sang nhiều lớp với Softmax
- Biết quy trình thực hành với scikit-learn

# Vì sao cần Logistic Regression?

Rất nhiều bài toán thực tế cần **xếp vào nhóm** chứ không cần đoán một con số:

- **Phát hiện spam** — email này spam hay không?
- **Chẩn đoán bệnh** — bệnh nhân có mắc bệnh không?
- **Phát hiện gian lận** — giao dịch này gian lận hay hợp lệ?
- **Dự đoán rời bỏ** ([[Churn]]) — khách hàng này sẽ ở lại hay bỏ đi?

[[Logistic Regression]] là thuật toán nền tảng cho bài toán phân loại:
- **Binary Logistic Regression** — đầu ra có **2 lớp** (có/không).
- **Multinomial Logistic Regression** — đầu ra có **nhiều hơn 2 lớp** (chó/mèo/chim).

::: tip Đừng để cái tên đánh lừa
Logistic **Regression** dùng để **phân loại** (Classification), không phải để hồi quy ra con số. Chữ "Regression" có vì bên trong nó vẫn tính một tổ hợp tuyến tính giống Linear Regression.
:::

# Từ đường thẳng tới xác suất — hàm Sigmoid

Nếu dùng thẳng Linear Regression để phân loại, đầu ra có thể là −3 hay 7.5 — không thể hiểu là xác suất. Logistic Regression giải quyết bằng 2 bước:

1. Tính tổ hợp tuyến tính như Linear Regression: **z = b₀ + b₁x₁ + … + bₚxₚ** (viết gọn z = bᵀx).
2. Đưa z qua hàm **[[Sigmoid]]** để "ép" về khoảng (0, 1):

::: formula
σ(z) = 1 / (1 + e⁻ᶻ)
:::

Hàm sigmoid có hình chữ S:
- z rất lớn → σ(z) gần 1
- z = 0 → σ(z) = 0.5
- z rất âm → σ(z) gần 0

Kết quả σ(z) được hiểu là **xác suất mẫu thuộc lớp 1**. Cuối cùng so với một [[Threshold]] (thường 0.5): lớn hơn ngưỡng → lớp 1, nhỏ hơn → lớp 0. Tập hợp những điểm có xác suất đúng bằng ngưỡng chính là [[Decision Boundary]].

!viz[Con trỏ chạy dọc trục "giờ học": z = −7 + 2·x đi qua sigmoid thành xác suất đậu; vượt 0,5 thì dự đoán ĐẬU. Đường nét đứt xanh là Linear Regression trên cùng dữ liệu — cho ra số nhỏ hơn 0 hoặc lớn hơn 1, không đọc được như xác suất.](logistic-sigmoid)

# Hàm lỗi — vì sao Log Loss chứ không phải MSE?

Nếu dùng [[MSE]] kết hợp với sigmoid:
- Bề mặt hàm lỗi trở nên **không lồi** (non-convex) — nhấp nhô với nhiều hố [[Local Minimum]].
- Gradient Descent dễ bị kẹt, không tìm được điểm tốt nhất.
- Học rất chậm khi xác suất dự đoán gần 0 hoặc 1 (gradient gần như bằng 0).

Vì vậy Logistic Regression dùng **Binary Cross-Entropy** — còn gọi là [[Log Loss]]:

::: formula
L = − y·log(h(x)) − (1 − y)·log(1 − h(x))
:::

với h(x) = σ(bᵀx) là xác suất model đoán, y là đáp án thật (0 hoặc 1). Đọc công thức theo từng trường hợp:

- **y = 1**: L = −log(h(x)). Đoán h(x) gần 1 → loss gần 0; đoán gần 0 → loss rất lớn.
- **y = 0**: L = −log(1 − h(x)). Đoán h(x) gần 0 → loss gần 0; đoán gần 1 → loss rất lớn.

Ưu điểm:
- Hàm lỗi **lồi** ([[Convex]]) → Gradient Descent hội tụ về điểm tốt nhất (khi dữ liệu tách bạch hoàn toàn, nên thêm [[Regularization]] để các hệ số không tăng vô hạn).
- **Phạt rất nặng dự đoán sai mà tự tin**.

# Huấn luyện bằng Gradient Descent

Nhờ [[Chain Rule]], gradient của Log Loss theo từng hệ số có dạng rất gọn:

::: formula
∂L/∂bⱼ = (σ(bᵀx) − y) · xⱼ
:::

Tức là: **(xác suất dự đoán − đáp án thật) × giá trị feature**. Cập nhật: bⱼ := bⱼ − α · (σ − y) · xⱼ, với α là [[Learning Rate]].

::: example Đậu hay rớt?
Dữ liệu: số giờ học x và kết quả y (0 = rớt, 1 = đậu):
x = 1, 2, 3 → rớt; x = 4, 5, 6 → đậu.

1. Khởi tạo b₀ = 0, b₁ = 0, learning rate = 0.1.
2. Với mẫu x = 1: z = 0 + 0 × 1 = 0 → σ(0) = **0.5**.
3. Sai số = dự đoán − thật = 0.5 − 0 = **0.5**.
4. Cập nhật: b₁ = 0 − 0.1 × 0.5 × 1 = **−0.05** (b₀ cũng giảm: 0 − 0.1 × 0.5 = −0.05).
5. Lặp lại cho mọi mẫu qua nhiều [[Epoch]].

Sau khi học xong, model tìm ra ranh giới quyết định quanh **x ≈ 3.5 giờ**: học trên 3.5 giờ thì dự đoán đậu.
:::

# Nhiều hơn 2 lớp — Softmax

Với K lớp (K > 2), model tính K điểm số z₁…z_K (mỗi lớp một điểm), rồi dùng hàm **[[Softmax]]** biến chúng thành K xác suất **cộng lại bằng 1**:

::: formula
P(lớp k) = e^(zₖ) / Σⱼ e^(zⱼ)
:::

::: example
Ảnh động vật, điểm số: chó = 2.0, mèo = 1.0, chim = 0.1
→ Softmax ≈ chó 0.66, mèo 0.24, chim 0.10 → dự đoán **chó**.
:::

!viz[Điểm số (logits) của 3 lớp thay đổi liên tục; softmax biến chúng thành xác suất luôn dương và cộng lại đúng 100%. Lớp có điểm cao nhất có xác suất cao nhất, nhưng các lớp khác vẫn có phần.](softmax)

![Trên: Logistic Regression 2 lớp — một nơ-ron + sigmoid. Dưới: nhiều lớp — mỗi lớp một nơ-ron, gom lại bằng softmax.](/it/ml/binary-vs-multiclass.webp =830x682)

![Toàn bộ quy trình: đầu vào X → tổ hợp tuyến tính (logits) → Softmax ra xác suất → so với nhãn one-hot bằng Cross-Entropy.](/it/ml/multinomial-classifier.webp =1600x859)

Softmax chính là phiên bản tổng quát của sigmoid cho nhiều lớp. Hàm lỗi tương ứng là **Categorical Cross-Entropy**.

# Đánh giá model phân loại

Dùng đúng các metric đã học ở bài 4:
- **Precision** ưu tiên khi báo nhầm tốn kém (lọc spam).
- **Recall** ưu tiên khi bỏ sót nguy hiểm (tầm soát ung thư).
- **F1** khi cần cân bằng (phát hiện gian lận: vừa bắt được gian lận, vừa không chặn nhầm quá nhiều giao dịch hợp lệ).
- **AUC-ROC** để so sánh model mà không phụ thuộc ngưỡng.
- **Accuracy** chỉ khi dữ liệu cân bằng.

# Thực hành

**Phần 1 — tự cài đặt bằng NumPy:** viết hàm sigmoid, hàm lỗi, vòng lặp gradient descent; train trên bộ Iris (lấy 2 lớp) rồi vẽ đường ranh giới quyết định.

**Phần 2 — dùng scikit-learn:**

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, classification_report, roc_auc_score

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = LogisticRegression(max_iter=1000).fit(X_train, y_train)   # 3 lớp → tự dùng softmax
y_pred = clf.predict(X_test)
print(confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred))    # precision, recall, f1 cho từng lớp
proba = clf.predict_proba(X_test)               # xác suất từng lớp
```

[[Iris Dataset]] có 3 loài hoa, nên đây cũng là ví dụ Multinomial Logistic Regression.

# Ghi nhớ nhanh
- Logistic Regression là thuật toán **phân loại**: z = bᵀx → sigmoid → xác suất → so ngưỡng.
- Dùng Log Loss (Binary Cross-Entropy) vì nó lồi và phạt nặng dự đoán sai mà tự tin; MSE + sigmoid thì không lồi.
- Gradient gọn: (σ − y) · x.
- Nhiều lớp → Softmax, K xác suất cộng lại bằng 1.

# Thuật ngữ
- **Churn**: Khách hàng rời bỏ — ngừng dùng dịch vụ hoặc chuyển sang đối thủ. Dự đoán churn (sẽ ở lại hay bỏ đi) là bài toán phân loại phổ biến vì giữ khách cũ rẻ hơn tìm khách mới. Ví dụ: nhà mạng dự đoán thuê bao nào sắp chuyển mạng để gửi ưu đãi giữ chân.
- **Sigmoid**: Hàm hình chữ S, σ(z) = 1/(1 + e⁻ᶻ), biến mọi số thực thành một giá trị trong khoảng (0, 1) nên đọc được như xác suất. z rất lớn → gần 1; z = 0 → 0,5; z rất âm → gần 0. Dùng ở lớp ra của bài toán 2 lớp. Ví dụ: z = 2 → σ ≈ 0,88, tức 88% khả năng thuộc lớp 1.
- **Softmax**: Hàm biến K điểm số thành K xác suất dương có tổng bằng 1: lấy mũ e của từng điểm rồi chia cho tổng. Điểm cao nhất được xác suất lớn nhất, nhưng các lớp khác vẫn có xác suất nhỏ. Là phiên bản nhiều lớp của sigmoid. Ví dụ: điểm [2,0; 1,0; 0,1] cho chó/mèo/chim → xác suất ≈ [0,66; 0,24; 0,10].
- **Epoch**: Một lượt model đi qua toàn bộ dữ liệu train đúng một lần. Train thường cần nhiều epoch; quá ít thì chưa học xong, quá nhiều thì dễ overfit. Ví dụ: 10.000 mẫu, train 20 epoch nghĩa là mỗi mẫu được model "xem" 20 lần.
- **Iris Dataset**: Bộ dữ liệu kinh điển gồm 150 bông hoa thuộc 3 loài Iris (setosa, versicolor, virginica), mỗi bông có 4 số đo: chiều dài và chiều rộng của đài hoa, cánh hoa. Nhỏ, sạch, có sẵn trong scikit-learn nên rất hay dùng để tập phân loại. Ví dụ: `load_iris()` rồi train Logistic Regression phân biệt 3 loài.
