---
title: Toán nền tảng — Đại số tuyến tính & Giải tích
short: Toán nền tảng
icon: 📐
summary: Không cần giỏi toán mới học được ML, nhưng cần hiểu "toán đang làm gì". Bài này giải thích bằng lời thường: vector, ma trận, eigenvector, SVD, đạo hàm, gradient và thuật toán Gradient Descent — trái tim của việc "học".
---

# Mục tiêu
- Hiểu vì sao dữ liệu trong ML được biểu diễn bằng vector và ma trận
- Nắm ý nghĩa trực quan của Eigenvalue/Eigenvector và SVD
- Hiểu đạo hàm, đạo hàm riêng và gradient cho biết điều gì
- Tự tay tính được một bước Gradient Descent
- Phân biệt Batch, Stochastic và Mini-batch Gradient Descent

# Vì sao ML cần toán?

Một hệ thống AI về bản chất là một cỗ máy biến đổi con số. Bốn mảng toán xuất hiện nhiều nhất:

| Mảng toán | Dùng để làm gì trong ML |
|---|---|
| **Đại số tuyến tính** (Linear Algebra) | Biểu diễn dữ liệu và weight dưới dạng bảng số, tính toán hàng loạt |
| **Giải tích** (Calculus) | Tính xem nên chỉnh weight theo hướng nào để model bớt sai |
| **Xác suất – Thống kê** | Đo độ chắc chắn của dự đoán, mô tả dữ liệu (xem bài 3) |
| **Tối ưu hóa** (Optimization) | Tìm bộ weight "tốt nhất" — model học chính là đang giải bài toán tối ưu |

Ví dụ: một [[Neural Network]] dùng đại số tuyến tính để nhân ma trận, giải tích để tính gradient khi học, và xác suất để đưa ra dự đoán kèm độ tin cậy. [[SVM]] thì dựa trên tối ưu hóa và hình học.

# Vector và Matrix — cách máy "nhìn" dữ liệu

- **[[Vector]]**: một dãy số xếp thành hàng. Mỗi mẫu dữ liệu thường là một vector. Ví dụ một căn nhà: `[diện tích 80, 3 phòng ngủ, cách trung tâm 5 km]`.
- **[[Matrix]]** (ma trận): một bảng số có hàng và cột. Cả bộ dữ liệu là một ma trận — mỗi hàng là một mẫu, mỗi cột là một [[Feature]].

Các phép toán cơ bản: cộng vector/ma trận, nhân với một số ([[Scalar]]), [[Dot Product]] (tích vô hướng), nhân ma trận.

::: example Một bức ảnh chính là một ma trận
Ảnh xám 3×3 điểm ảnh là ma trận 3×3, mỗi ô là độ sáng từ 0 (đen) tới 255 (trắng). Để đưa vào một lớp mạng nơ-ron, ta "duỗi" ma trận thành vector 9 số, rồi nhân với ma trận weight:

```python
import numpy as np
image = np.array([[255,   0, 128],
                  [ 64,  32, 200],
                  [ 10,  90, 170]])   # ảnh xám 3x3
W = np.random.randn(2, 9)   # 2 nơ-ron, mỗi nơ-ron nhận 9 đầu vào
x = image.flatten()         # duỗi thành vector 9 số
output = W @ x              # nhân ma trận-vector → 2 con số
```

Một chữ số viết tay 28×28 điểm ảnh (bộ dữ liệu [[MNIST]]) = một vector 784 chiều. Phép `W @ x` chính là **một lớp** của mạng nơ-ron đang tính toán.
:::

# Eigenvalue và Eigenvector — "hướng chính" của dữ liệu

Với một ma trận A, nếu có vector v sao cho nhân A với v chỉ làm v **dài ra hoặc ngắn lại** (không đổi hướng), thì:

::: formula
$$A\,\mathbf{v} = \lambda\,\mathbf{v}$$
:::

- $\mathbf{v}$ gọi là **[[Eigenvector]]** (vector riêng) — một **hướng** đặc biệt.
- $\lambda$ (đọc là "lambda") gọi là **[[Eigenvalue]]** (trị riêng) — cho biết theo hướng đó dữ liệu bị kéo giãn bao nhiêu.

Ý nghĩa trong ML: với ma trận mô tả độ phân tán của dữ liệu, eigenvector chỉ ra **những hướng mà dữ liệu trải rộng nhất**, còn eigenvalue cho biết **hướng đó quan trọng tới đâu** (chứa bao nhiêu phần biến động — [[Variance]]).

Ứng dụng: giảm chiều dữ liệu bằng [[PCA]], [[Spectral Clustering]].

::: example PCA nén dữ liệu 2 chiều xuống 1 chiều
```python
from sklearn.decomposition import PCA
import numpy as np
X = np.array([[2.5, 2.4], [0.5, 0.7], [2.2, 2.9], [1.9, 2.2], [3.1, 3.0]])
pca = PCA(n_components=1)          # chỉ giữ 1 hướng chính
X_reduced = pca.fit_transform(X)
print(pca.explained_variance_ratio_)   # khoảng [0.96] → giữ ~96% thông tin
```
Hai cột ban đầu tăng giảm gần như cùng nhau, nên chỉ một "hướng chính" đã giữ được gần hết thông tin. PCA giữ lại các eigenvector có eigenvalue lớn nhất và bỏ những hướng ít quan trọng.
:::

# SVD — tách ma trận thành 3 mảnh

**[[SVD]]** tách một ma trận A bất kỳ thành tích của 3 ma trận:

::: formula
$$A = U\,\Sigma\,V^{\top}$$
:::

Ma trận $\Sigma$ (sigma) ở giữa chứa các **singular value** xếp từ lớn đến nhỏ — mỗi giá trị cho biết một "thành phần" quan trọng cỡ nào. Giữ lại vài thành phần lớn nhất là đã tái tạo được gần đúng ma trận gốc với ít số hơn rất nhiều.

Ứng dụng:
- **Nén dữ liệu**, nén ảnh.
- **[[LSA]]** trong xử lý ngôn ngữ: tìm các "chủ đề ẩn" trong văn bản.
- **Hệ thống gợi ý**: Netflix từng dùng SVD trên ma trận "người dùng × phim" để đoán điểm cho những phim người dùng chưa xem.

::: example Nén ảnh bằng SVD
```python
A = np.random.rand(100, 100)            # "ảnh" 100x100 = 10.000 số
U, S, Vt = np.linalg.svd(A, full_matrices=False)
k = 10                                   # chỉ giữ 10 thành phần lớn nhất
A_compressed = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
```
Lưu bản nén chỉ cần 10 × (100 + 1 + 100) = **2.010 số** thay vì 10.000 — tiết kiệm khoảng **80%** dung lượng.
:::

# Đạo hàm và Gradient — "độ dốc" chỉ đường

- **[[Derivative]]** (đạo hàm): đo xem khi đầu vào thay đổi một chút xíu thì đầu ra thay đổi bao nhiêu — chính là **độ dốc** của đồ thị tại điểm đó.
- **[[Partial Derivative]]** (đạo hàm riêng): khi hàm có nhiều biến, ta xét từng biến một và **giữ nguyên các biến còn lại**. Nó cho biết từng biến ảnh hưởng tới kết quả ra sao.
- **[[Gradient]]**: gom tất cả đạo hàm riêng lại thành một vector. Gradient chỉ về **hướng làm hàm tăng nhanh nhất**.

Vì sao ML quan tâm? Model có một [[Loss Function]] đo xem nó đang sai bao nhiêu. Muốn bớt sai thì phải biết **chỉnh weight theo hướng nào** — gradient trả lời câu hỏi đó. Trong mạng nơ-ron, thuật toán [[Backpropagation]] dùng [[Chain Rule]] để tính gradient cho hàng triệu weight cùng lúc.

::: example Đạo hàm riêng trong một bài hồi quy nhỏ
Model có 2 feature, hàm lỗi $f(w_1, w_2) = (w_1 x_1 + w_2 x_2 - y)^2$. Đạo hàm riêng:

- $\dfrac{\partial f}{\partial w_1} = 2\,(w_1 x_1 + w_2 x_2 - y)\,x_1$
- $\dfrac{\partial f}{\partial w_2} = 2\,(w_1 x_1 + w_2 x_2 - y)\,x_2$

Cho $x_1 = 2$, $x_2 = 3$, $y = 10$, đang có $w_1 = 1$, $w_2 = 1$:

- Dự đoán $= 1 \cdot 2 + 1 \cdot 3 = 5$ → sai số $= 5 - 10 = -5$
- $\dfrac{\partial f}{\partial w_1} = 2 \cdot (-5) \cdot 2 =$ **−20**
- $\dfrac{\partial f}{\partial w_2} = 2 \cdot (-5) \cdot 3 =$ **−30**

Đọc kết quả: đạo hàm âm nghĩa là **tăng** weight thì lỗi **giảm**. Lỗi giảm nhanh hơn khi tăng w2 (−30) vì x2 lớn hơn, tức feature thứ hai ảnh hưởng mạnh hơn.
:::

# Gradient Descent — thuật toán "xuống dốc"

**[[Gradient Descent]]** là cách phổ biến nhất để model học: lặp đi lặp lại việc **bước một bước nhỏ ngược hướng gradient** (vì gradient chỉ hướng đi lên, ta muốn đi xuống chỗ lỗi thấp nhất).

::: formula Quy tắc cập nhật
$$w_{\text{mới}} = w_{\text{cũ}} - \underbrace{\eta}_{\text{learning rate}} \cdot \underbrace{\frac{\partial L}{\partial w}}_{\text{gradient}}$$
:::

**[[Learning Rate]]** (tốc độ học) là độ dài mỗi bước. Quá nhỏ thì học rất chậm, quá lớn thì "nhảy qua" luôn điểm thấp nhất và có thể không bao giờ hội tụ.

!viz[Trái: learning rate vừa phải — mỗi bước đi một đoạn vừa đủ, tiến dần xuống đáy. Phải: learning rate quá lớn — mỗi bước vọt qua đáy sang phía bên kia, nhảy qua nhảy lại mãi. Đường nét đứt là tiếp tuyến (gradient) tại vị trí hiện tại.](gd-learning-rate)

::: analogy Xuống núi trong sương mù
Bạn đứng trên sườn núi, sương dày không thấy gì. Cách xuống chân núi: dò dưới chân xem hướng nào dốc xuống nhất, bước một bước theo hướng đó, rồi lặp lại. Độ dài mỗi bước chính là learning rate.
:::

::: example Tính tay một bước Gradient Descent
Hàm lỗi $L(w) = (2w - 4)^2$, nhỏ nhất tại $w = 2$. Đạo hàm: $\dfrac{dL}{dw} = 4\,(2w - 4)$.

- Bắt đầu $w = 0$, learning rate $\eta = 0.1$
- Gradient tại $w = 0$: $4 \cdot (0 - 4) =$ **−16**
- $w_{\text{mới}} = 0 - 0.1 \times (-16) =$ **1.6**

Chỉ sau một bước, w đã đi từ 0 tới 1.6, tiến sát đáp án 2.
:::

### Ba biến thể Gradient Descent

Khác nhau ở chỗ **mỗi lần cập nhật weight thì nhìn bao nhiêu dữ liệu**:

| Biến thể | Mỗi lần cập nhật dùng | Ưu điểm | Nhược điểm |
|---|---|---|---|
| [[Batch Gradient Descent]] | Toàn bộ N mẫu | Ổn định, gradient chính xác | Chậm, tốn bộ nhớ khi dữ liệu lớn |
| [[SGD]] | 1 mẫu | Nhanh, cập nhật liên tục | Rất "lắc", nhiễu |
| [[Mini-batch Gradient Descent]] | Một nhóm nhỏ 32–256 mẫu | Cân bằng hai bên — **mặc định trong thực tế** | Phải chọn kích thước batch |

!viz[Ba biến thể cùng đi tới điểm tối ưu (tâm các đường đồng mức): Batch đi mượt nhất, Mini-batch hơi lắc, SGD lắc mạnh nhất vì mỗi bước chỉ nhìn một mẫu.](descent-paths)

```python
# Mini-batch Gradient Descent với PyTorch
for epoch in range(100):
    for X_batch, y_batch in DataLoader(ds, batch_size=32):
        optimizer.zero_grad()                       # xóa gradient cũ
        loss = criterion(model(X_batch), y_batch)   # tính lỗi
        loss.backward()                             # tính gradient
        optimizer.step()                            # cập nhật weight
```

::: tip Kinh nghiệm chọn batch size
Bắt đầu với 32 hoặc 64. Batch lớn thì chạy nhanh hơn trên GPU nhưng đôi khi model hội tụ về vùng "nhọn", kém tổng quát hơn.
:::

# Convex — khi nào chắc chắn tìm được điểm tốt nhất?

Một hàm **[[Convex]]** (lồi) có đồ thị hình cái bát: đoạn thẳng nối hai điểm bất kỳ trên đồ thị luôn nằm **phía trên** đồ thị. Hàm lồi có tính chất quý: **mọi điểm thấp cục bộ đều là điểm thấp nhất toàn cục** ([[Global Minimum]]), nên Gradient Descent không bị "kẹt" ở hố phụ ([[Local Minimum]]).

!viz[Hai quả bóng cùng learning rate nhưng xuất phát ở hai chỗ khác nhau: bóng đỏ trượt vào hố phụ (local minimum) rồi kẹt lại vì xung quanh đều dốc lên; bóng xanh tới được đáy sâu nhất (global minimum).](local-minimum)

Nhiều model cổ điển (Linear Regression, Logistic Regression, SVM) có hàm lỗi lồi nên dễ tối ưu. Mạng nơ-ron thì không lồi — đó là lý do huấn luyện chúng khó hơn.

# Ghi nhớ nhanh
- Dữ liệu = ma trận (hàng là mẫu, cột là feature); một mẫu = một vector.
- Eigenvector = hướng dữ liệu trải rộng; eigenvalue = mức quan trọng của hướng đó → nền tảng của PCA.
- SVD tách ma trận thành $U \Sigma V^{\top}$; giữ vài thành phần lớn nhất để nén dữ liệu.
- Gradient chỉ hướng hàm tăng nhanh nhất → đi **ngược** gradient để giảm lỗi.
- $w_{\text{mới}} = w_{\text{cũ}} - \eta \times \text{gradient}$.
- Mini-batch (32–256 mẫu) là lựa chọn mặc định trong thực tế.

# Thuật ngữ
- **Vector**: Một dãy số có thứ tự, thường dùng để biểu diễn một mẫu dữ liệu: mỗi vị trí trong dãy là một đặc trưng. Số phần tử gọi là số chiều của vector. Về hình học, vector là một mũi tên có hướng và độ dài. Ví dụ: một căn nhà = [80 m², 3 phòng ngủ, 5 km tới trung tâm] là vector 3 chiều.
- **Matrix**: Ma trận — bảng số gồm hàng và cột. Cả bộ dữ liệu là một ma trận (mỗi hàng một mẫu, mỗi cột một feature), và bộ weight của một lớp mạng nơ-ron cũng là ma trận. Nhân ma trận cho phép tính toán hàng loạt rất nhanh trên GPU. Ví dụ: 1.000 căn nhà × 3 feature = ma trận 1.000 hàng, 3 cột.
- **Scalar**: Một con số đơn lẻ, không phải vector hay ma trận. Nhân một vector với scalar là phóng to/thu nhỏ vector đó. Ví dụ: learning rate 0,01 là một scalar.
- **Dot Product**: Tích vô hướng — nhân từng cặp phần tử tương ứng của hai vector rồi cộng lại, ra một con số. Đo mức hai vector "cùng hướng": càng lớn càng giống nhau. Đây là phép tính cốt lõi trong mỗi nơ-ron. Ví dụ: [1, 2, 3] · [4, 5, 6] = 1×4 + 2×5 + 3×6 = 32.
- **MNIST**: Bộ dữ liệu kinh điển gồm 70.000 ảnh chữ số viết tay (0–9), mỗi ảnh xám 28×28 điểm ảnh. Thường được dùng làm "bài tập đầu tiên" khi học Deep Learning vì nhỏ gọn và dễ đạt kết quả tốt. Ví dụ: train một mạng nhận ảnh 28×28 và trả ra chữ số tương ứng.
- **Eigenvector**: Vector riêng của một ma trận — một hướng đặc biệt mà khi nhân ma trận với nó, vector chỉ bị kéo dài hoặc co lại chứ không đổi hướng. Trong dữ liệu, eigenvector chỉ ra các hướng dữ liệu trải rộng nhất — nền tảng của PCA. Ví dụ: với dữ liệu chiều cao – cân nặng, eigenvector chính chỉ theo hướng "người to – người nhỏ".
- **Eigenvalue**: Trị riêng — hệ số co giãn đi kèm mỗi eigenvector, cho biết theo hướng đó dữ liệu bị kéo giãn bao nhiêu. Eigenvalue càng lớn thì hướng đó chứa càng nhiều thông tin (variance). Ví dụ: hướng có eigenvalue chiếm 96% tổng là hướng gần như mô tả hết dữ liệu.
- **Variance**: Phương sai — đo mức độ dữ liệu phân tán quanh giá trị trung bình: trung bình của bình phương khoảng cách tới trung bình. Variance lớn là dữ liệu trải rộng, nhỏ là dữ liệu tụ sát nhau. Trong cụm "Bias-Variance", variance lại chỉ mức độ model thay đổi khi đổi sang bộ dữ liệu train khác. Ví dụ: điểm thi [5, 5, 5] có variance 0; [1, 5, 9] có variance lớn.
- **Spectral Clustering**: Phương pháp phân cụm dựa trên eigenvector của ma trận mô tả độ giống nhau giữa các điểm. Nó tìm được cả những cụm có hình dạng phức tạp (vòng tròn lồng nhau, hình cong) mà K-Means bó tay. Ví dụ: tách hai vòng tròn đồng tâm thành hai cụm.
- **SVD** (Singular Value Decomposition): Phân rã giá trị suy biến — tách một ma trận bất kỳ thành tích ba ma trận U·Σ·Vᵀ, trong đó Σ chứa các "singular value" xếp từ quan trọng nhất đến ít quan trọng. Giữ vài giá trị lớn nhất là xấp xỉ được ma trận gốc với ít số hơn hẳn. Ví dụ: nén ảnh, tìm chủ đề ẩn trong văn bản, gợi ý phim từ ma trận người dùng × phim.
- **LSA** (Latent Semantic Analysis): Phân tích ngữ nghĩa ẩn — dùng SVD trên ma trận "từ × văn bản" để tìm ra các chủ đề ẩn. Nhờ vậy hai văn bản dùng từ khác nhau nhưng cùng chủ đề vẫn được nhận ra là gần nhau. Ví dụ: bài viết về "ô tô" và bài về "xe hơi" được xếp chung chủ đề giao thông.
- **Derivative**: Đạo hàm — tốc độ thay đổi của đầu ra khi đầu vào thay đổi một chút xíu; về hình học là độ dốc của đồ thị tại một điểm. Đạo hàm dương: hàm đang đi lên; âm: đang đi xuống; bằng 0: đang ở đỉnh hoặc đáy. Ví dụ: f(x) = x² có đạo hàm 2x; tại x = 3 độ dốc là 6.
- **Partial Derivative**: Đạo hàm riêng — đạo hàm của hàm nhiều biến theo một biến, trong khi giữ nguyên các biến còn lại. Cho biết riêng biến đó ảnh hưởng tới kết quả thế nào. Ví dụ: lỗi của model phụ thuộc w1 và w2; ∂L/∂w1 cho biết nếu chỉ tăng w1 một chút thì lỗi tăng hay giảm bao nhiêu.
- **Gradient**: Vector gồm tất cả các đạo hàm riêng của một hàm. Gradient chỉ về hướng làm hàm tăng nhanh nhất, độ dài của nó cho biết dốc cỡ nào. Muốn giảm lỗi thì đi ngược hướng gradient. Ví dụ: gradient (−20, −30) nghĩa là tăng w1 và w2 sẽ làm lỗi giảm, và w2 ảnh hưởng mạnh hơn.
- **Loss Function**: Hàm lỗi (còn gọi Cost Function) — công thức tính ra một con số đo dự đoán của model sai lệch so với đáp án bao nhiêu. Toàn bộ quá trình train là tìm weight làm con số này nhỏ nhất. Chọn loss phù hợp với bài toán rất quan trọng. Ví dụ: MSE cho bài đoán giá nhà; Cross-Entropy cho bài phân loại ảnh.
- **Backpropagation**: Lan truyền ngược — thuật toán tính gradient của loss theo mọi weight trong mạng nơ-ron, bắt đầu từ lớp ra rồi đi ngược dần về lớp vào, mỗi lớp tái sử dụng kết quả của lớp sau. Nhờ vậy tính được gradient cho hàng triệu weight một cách hiệu quả. Ví dụ: sau khi mạng đoán sai "mèo" thành "chó", backprop chỉ ra từng weight cần chỉnh theo hướng nào.
- **Chain Rule**: Quy tắc đạo hàm hàm hợp — khi một hàm lồng trong hàm khác, đạo hàm tổng bằng tích các đạo hàm từng tầng. Đây là nền toán học của Backpropagation. Ví dụ: y = (3x + 1)²: đặt u = 3x + 1 thì dy/dx = dy/du × du/dx = 2u × 3.
- **Gradient Descent**: Thuật toán tối ưu lặp lại việc chỉnh weight một bước nhỏ ngược hướng gradient: w_mới = w_cũ − learning_rate × gradient, cho tới khi lỗi không giảm thêm. Là cách học phổ biến nhất của các model ML hiện đại. Ví dụ: như xuống núi trong sương mù — mỗi bước dò hướng dốc xuống nhất rồi bước theo.
- **Learning Rate**: Tốc độ học — độ dài mỗi bước cập nhật weight trong Gradient Descent. Quá lớn thì "vọt" qua điểm tối ưu và có thể không bao giờ hội tụ; quá nhỏ thì học rất chậm. Thường là hyperparameter quan trọng nhất cần tune. Ví dụ: các giá trị hay thử: 0,1; 0,01; 0,001.
- **Batch Gradient Descent**: Gradient Descent dùng toàn bộ dữ liệu train để tính gradient cho mỗi lần cập nhật weight. Gradient chính xác và đường đi ổn định, nhưng mỗi bước rất chậm và tốn bộ nhớ khi dữ liệu lớn. Ví dụ: 1 triệu mẫu thì phải tính qua cả 1 triệu mẫu mới được cập nhật weight một lần.
- **SGD** (Stochastic Gradient Descent): Gradient Descent ngẫu nhiên — mỗi lần cập nhật weight chỉ dùng 1 mẫu chọn ngẫu nhiên. Rất nhanh và cập nhật liên tục, nhưng đường đi "lắc" mạnh vì gradient từ 1 mẫu nhiễu. Chút nhiễu đó đôi khi lại giúp thoát hố phụ. Ví dụ: mỗi email mới tới là cập nhật ngay model lọc spam.
- **Mini-batch Gradient Descent**: Gradient Descent dùng một nhóm nhỏ mẫu (thường 32–256) cho mỗi lần cập nhật — dung hoà giữa độ ổn định của Batch và tốc độ của SGD, lại tận dụng tốt GPU. Là cách mặc định khi train mạng nơ-ron. Ví dụ: batch size 64 — mỗi bước lấy 64 ảnh, tính gradient trung bình rồi cập nhật.
- **Convex**: Hàm lồi — đồ thị có dạng cái bát: đoạn thẳng nối hai điểm bất kỳ trên đồ thị luôn nằm phía trên đồ thị. Hàm lồi chỉ có một đáy, nên Gradient Descent chắc chắn tìm tới điểm tốt nhất mà không bị kẹt. Ví dụ: hàm lỗi của Linear Regression và Logistic Regression là hàm lồi; của mạng nơ-ron thì không.
- **Global Minimum**: Cực tiểu toàn cục — điểm thấp nhất trên toàn bộ hàm lỗi, tức bộ weight tốt nhất có thể. Ví dụ: đáy sâu nhất của cả dãy núi.
- **Local Minimum**: Cực tiểu cục bộ — điểm thấp hơn mọi điểm xung quanh nhưng chưa chắc là thấp nhất toàn cục. Gradient Descent có thể dừng ở đây vì xung quanh đều dốc lên. Ví dụ: một thung lũng nhỏ trên sườn núi — đứng ở đó tưởng là đáy nhưng thật ra còn thung lũng sâu hơn ở xa.
