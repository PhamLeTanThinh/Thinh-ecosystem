---
title: Neural Network — Mạng nơ-ron nhân tạo
short: Neural Network
icon: 🧠
summary: Khi một đường thẳng không đủ để mô tả dữ liệu, ta ghép thật nhiều "nơ-ron" nhỏ lại với nhau. Bài này giải thích một nơ-ron tính toán ra sao, activation function để làm gì, mạng nhiều lớp học bằng Backpropagation như thế nào, và các khái niệm batch, epoch, optimizer.
---

# Mục tiêu
- Hiểu vì sao cần Neural Network khi Linear/Logistic Regression không đủ
- Tính được đầu ra của một nơ-ron: y = f(W·x + b)
- Phân biệt các Activation Function: ReLU, Sigmoid, Tanh, Softmax
- Hiểu kiến trúc Deep Neural Network và quy trình học 5 bước
- Chọn đúng Loss Function cho regression và classification
- Phân biệt Batch, Epoch, Iteration và 3 kiểu Gradient Descent

# Vì sao cần Neural Network?

[[Linear Regression]] và [[Logistic Regression]] chỉ vẽ được **một** đường thẳng (hoặc mặt phẳng). Với dữ liệu phức tạp — ví dụ các điểm của hai lớp nằm xen kẽ theo hình xoắn ốc — **một hàm tuyến tính không thể phủ hết đặc điểm của dữ liệu**.

!viz[Hai lớp xếp thành vòng trong – vòng ngoài: một đường thẳng xoay thế nào cũng chỉ đúng được khoảng một nửa; ghép nhiều nơ-ron có activation thì vẽ được ranh giới cong tách hẳn hai lớp.](one-line-not-enough)

::: analogy Lấy cảm hứng từ não bộ
Não hoạt động nhờ hàng tỉ nơ-ron "bật" (firing) khi nhận đủ tín hiệu. Mỗi vùng não đảm nhận một chức năng khác nhau. Tương tự, mạng nơ-ron dùng **nhiều hàm nhỏ**, mỗi hàm "kích hoạt" khi gặp đúng kiểu đặc điểm mà nó phụ trách — ghép lại thì mô tả được dữ liệu đa dạng.
:::

[[Neural Network]] gồm các **nút** (nơ-ron) nối với nhau bằng các **liên kết**. Mỗi liên kết có một [[Weight]]. Mỗi nút làm hai việc:
1. **Tổng có trọng số** các đầu vào (một hàm tuyến tính).
2. Đưa kết quả qua một **[[Activation Function]]** để tạo đầu ra.

# Toán học của một nơ-ron

::: formula
y = f(W · xᵀ + b)
:::

- **x** = (x₀, x₁, x₂, …): vector dữ liệu đầu vào.
- **W** = (w₀, w₁, w₂, …): vector weight — mức quan trọng của từng đầu vào.
- **b**: **[[bias|Bias Term]]** (hệ số tự do).
- **f**: activation function.
- **y**: đầu ra.

!viz[Một nơ-ron đang tính: mỗi đầu vào x nhân với weight w (xanh = dương, đỏ = âm, càng đậm càng lớn), cộng lại cùng bias b rồi qua ReLU. Khi tổng âm, ReLU cho ra 0 — nơ-ron "tắt".](neuron)

::: example Tính tay một nơ-ron
Đầu vào x = (2, 3), weight W = (0.5, −1), bias b = 1, activation là ReLU:
- Tổng có trọng số: 0.5 × 2 + (−1) × 3 + 1 = 1 − 3 + 1 = **−1**
- ReLU(−1) = max(0, −1) = **0** → nơ-ron "không bật".

Nếu x = (6, 1): 0.5 × 6 − 1 + 1 = **3** → ReLU(3) = **3** → nơ-ron "bật".
:::

### Vì sao cần bias?

Không có bias, đường thẳng W·x luôn phải **đi qua gốc tọa độ**. Bias cho phép dịch đường lên xuống/sang ngang để **khớp dữ liệu tốt hơn** — giống hệ số chặn β₀ trong Linear Regression.

!viz[Không có bias, đường quyết định chỉ xoay được quanh gốc toạ độ nên luôn phân loại sai một số điểm; có bias, đường được "nhấc" lên đúng khoảng giữa hai nhóm.](bias-shift)

# Activation Function — tạo ra tính phi tuyến

Activation function có hai vai trò:
- **Bắt quan hệ phi tuyến** giữa đầu vào và đầu ra. Nếu bỏ đi, ghép bao nhiêu lớp tuyến tính lại thì kết quả vẫn chỉ là **một** hàm tuyến tính.
- **Đưa đầu ra về vùng giá trị hữu ích** (ví dụ xác suất 0–1).

| Hàm | Công thức | Đầu ra | Thường dùng ở |
|---|---|---|---|
| [[ReLU]] | max(0, z) | [0, +∞) | **Lớp ẩn** — mặc định phổ biến nhất, tính nhanh |
| [[Sigmoid]] | 1/(1 + e⁻ᶻ) | (0, 1) | Lớp ra của bài toán **2 lớp** |
| [[Tanh]] | (eᶻ − e⁻ᶻ)/(eᶻ + e⁻ᶻ) | (−1, 1) | Lớp ẩn (nhất là RNN) — đối xứng quanh 0 |
| [[Softmax]] | e^(zₖ)/Σe^(zⱼ) | K xác suất, tổng = 1 | Lớp ra của bài toán **nhiều lớp** |

!viz[Cùng một giá trị z chạy qua 4 activation function: Sigmoid ép về (0, 1), Tanh ép về (−1, 1), ReLU cắt phần âm về 0, Leaky ReLU giữ lại một chút phần âm.](activation-functions)

::: tip
Lớp ẩn: bắt đầu với ReLU. Lớp ra: regression → không dùng activation (linear); 2 lớp → sigmoid; nhiều lớp → softmax.
:::

# Từ một nơ-ron tới Deep Neural Network

- **Mạng đơn giản**: các đầu vào nối thẳng vào một lớp nơ-ron ra. Với nhiều mẫu cùng lúc, ta xếp chúng thành ma trận X và tính một lần: Y = f(W·Xᵀ + B).
- **[[Deep Neural Network]] (DNN)**: thêm **nhiều lớp ẩn** ([[Hidden Layer]]) giữa lớp vào ([[Input Layer]]) và lớp ra ([[Output Layer]]).

!viz[Forward pass: dữ liệu đi lần lượt qua lớp vào → các lớp ẩn → lớp ra.](forward-pass)

::: formula
Y = fₙ( Wₙ · fₙ₋₁( … f₂( W₂ · f₁( W₁·Xᵀ + B₁ ) + B₂ ) … ) + Bₙ )
:::

- f₁ … fₙ là activation function của từng lớp — **mỗi lớp có thể dùng hàm khác nhau** và có bias riêng.
- Kích thước của Wᵢ và Bᵢ phụ thuộc số nơ-ron ở mỗi lớp.
- Quyết định **có bao nhiêu lớp, mỗi lớp bao nhiêu nơ-ron** gọi là **thiết kế kiến trúc** (architecture) của DNN.

::: analogy Mỗi lớp học một mức trừu tượng
Với ảnh khuôn mặt: lớp đầu học **cạnh, nét**; lớp giữa ghép thành **mắt, mũi, miệng**; lớp sau ghép thành **khuôn mặt**. Càng sâu càng trừu tượng.
:::

# Mạng nơ-ron học như thế nào?

1. **Khởi tạo** các tham số (weight, bias) **ngẫu nhiên**.
2. **[[Forward Pass]]**: đưa dữ liệu đi qua mạng từ lớp vào tới lớp ra, được dự đoán.
3. **Tính lỗi**: so dự đoán với đáp án bằng [[Loss Function]].
4. **[[Backpropagation]]**: tính gradient của loss theo **mọi** tham số (đi ngược từ lớp ra về lớp vào nhờ [[Chain Rule]]), rồi cập nhật tham số bằng [[Gradient Descent]].
5. **Lặp lại** bước 2–4 tới khi model đủ tốt.

!viz[Một bước học: forward (xanh) tính dự đoán qua từng lớp → tính loss → backward (đỏ) lan truyền gradient ngược từ lớp ra về lớp vào để cập nhật weight.](forward-backward)

### Loss Function

Chọn loss phụ thuộc vào activation ở lớp ra. Hai loại điển hình:

- **[[MSE]]** — ½·Σ(y − ŷ)² — cho **regression**.
- **[[Cross-Entropy]]** — đo khoảng cách giữa hai phân phối xác suất — cho **classification** (đi với sigmoid hoặc softmax):

::: formula
loss = − Σᵢ tᵢ · log(pᵢ)
:::

với C lớp, tᵢ là đáp án dạng **[[One-hot Vector]]** (chỉ lớp đúng bằng 1, còn lại 0), pᵢ là xác suất model đoán.

### Cập nhật tham số

::: formula
Wᵢ(t+1) = Wᵢ(t) − α · ∂L/∂Wᵢ
:::

với i là lớp thứ i, t là lần lặp thứ t, α là [[Learning Rate]]. Đạo hàm ở lớp i được tính từ đạo hàm của lớp sau nó nhân với đạo hàm activation gᵢ của lớp đó — chính là chain rule được áp dụng lần lượt từ cuối về đầu.

# Batch, Epoch và Iteration

Dữ liệu train được chia thành một hoặc nhiều **[[Batch]]** (lô).

- **Batch size**: số mẫu model xử lý **trước mỗi lần cập nhật weight**. Nằm trong khoảng 1 đến kích thước tập train.
- **[[Epoch]]**: một lượt đi qua **toàn bộ** tập train. Số epoch có thể từ 1 tới rất nhiều.
- **[[Iteration]]**: một lần cập nhật weight (= xử lý một batch).

::: example
Tập train 1.000 mẫu, batch size 100 → mỗi epoch có 1.000 / 100 = **10 iteration**. Train 50 epoch = 500 lần cập nhật weight.
:::

### Ba kiểu Gradient Descent

| | Batch size | Ưu điểm | Nhược điểm |
|---|---|---|---|
| **[[Batch Gradient Descent]]** | = toàn bộ tập train | Ít lần cập nhật, gradient chính xác, hội tụ ổn định | Cập nhật chậm khi dữ liệu lớn; phải nạp hết dữ liệu vào bộ nhớ |
| **[[SGD]]** | = 1 | Học nhanh ở một số bài, học trực tuyến được; nhiễu giúp **thoát local minimum** | Tổng thời gian train lâu trên dữ liệu lớn; nhiễu làm khó ổn định ở điểm tối ưu |
| **[[Mini-batch Gradient Descent]]** | 1 < size < toàn bộ | Cập nhật thường xuyên giúp tránh local minimum; hiệu quả hơn SGD; không cần nạp hết dữ liệu | Phải chọn thêm hyperparameter "mini-batch size" |

!viz[Đường đi tới điểm tối ưu: Batch (xanh dương) mượt, Mini-batch (xanh lá) hơi lắc, SGD (tím) lắc mạnh nhất.](descent-paths)

# Optimizer — vượt qua những khó khăn của Gradient Descent

Gradient Descent cơ bản gặp hai vấn đề:
- Dễ **kẹt ở local optima** (điểm tối ưu cục bộ) hoặc vùng phẳng.
- **Chọn learning rate rất khó**: lớn thì dao động, nhỏ thì chậm; một learning rate chung cho mọi weight chưa chắc hợp lý.

Vì vậy có nhiều thuật toán tối ưu ([[Optimizer]]) cải tiến:

| Optimizer | Ý tưởng một câu |
|---|---|
| **[[Momentum]]** | Cộng dồn "quán tính" từ các bước trước — như hòn bi lăn xuống dốc, đi mượt hơn và vượt qua hố nhỏ |
| **Nesterov Accelerated Gradient** | Momentum nhưng "nhìn trước" vị trí sắp tới rồi mới tính gradient |
| **Adagrad** | Mỗi weight có learning rate riêng; weight được cập nhật nhiều thì bước nhỏ dần |
| **Adadelta** | Sửa Adagrad để learning rate không bị co về 0 quá sớm |
| **[[RMSprop]]** | Chia learning rate cho trung bình trượt của bình phương gradient — hợp với RNN |
| **[[Adam]]** | Kết hợp Momentum + RMSprop — **phổ biến nhất**, chọn mặc định |
| **AdaMax** | Biến thể của Adam dùng chuẩn vô cực |

Chi tiết cách dùng và tham số mặc định ở bài tiếp theo.

# Ghi nhớ nhanh
- Một nơ-ron: y = f(W·x + b) — tổng có trọng số + bias + activation.
- Không có activation phi tuyến thì xếp bao nhiêu lớp vẫn chỉ là một hàm tuyến tính.
- ReLU cho lớp ẩn; lớp ra: linear (regression), sigmoid (2 lớp), softmax (nhiều lớp).
- Học = Forward → tính Loss → Backpropagation → cập nhật weight → lặp lại.
- Batch size = số mẫu mỗi lần cập nhật; Epoch = một lượt qua toàn bộ dữ liệu.
- Adam là optimizer mặc định phổ biến nhất.

# Thuật ngữ
- **Activation Function**: Hàm kích hoạt — hàm phi tuyến áp lên đầu ra của mỗi nơ-ron sau phép tổng có trọng số. Nhờ nó mạng mới mô tả được quan hệ phức tạp; thiếu nó thì xếp bao nhiêu lớp cũng chỉ tương đương một hàm tuyến tính. Ví dụ: ReLU, Sigmoid, Tanh, Softmax.
- **Bias Term**: Hệ số tự do b cộng thêm vào tổng có trọng số của nơ-ron: y = f(W·x + b). Cho phép dịch đường quyết định lên/xuống, không bắt buộc đi qua gốc toạ độ — giống hệ số chặn β₀ trong Linear Regression. Khác hẳn khái niệm "Bias" trong Bias-Variance. Ví dụ: nơ-ron chỉ "bật" khi tổng đầu vào vượt 5 → bias = −5.
- **ReLU** (Rectified Linear Unit): Hàm max(0, z) — giữ nguyên số dương, biến số âm thành 0. Tính rất nhanh và giúp gradient lan truyền tốt qua mạng sâu, nên là activation mặc định cho lớp ẩn. Ví dụ: ReLU(3) = 3, ReLU(−2) = 0.
- **Tanh**: Hàm tang hyperbolic, đưa mọi giá trị về khoảng (−1, 1), hình chữ S đối xứng quanh 0. Hay dùng trong lớp ẩn của RNN. Ví dụ: tanh(0) = 0, tanh(2) ≈ 0,96, tanh(−2) ≈ −0,96.
- **Deep Neural Network**: Mạng nơ-ron sâu — mạng có từ hai lớp ẩn trở lên. Mỗi lớp học một mức trừu tượng cao hơn lớp trước, nên mô tả được quan hệ rất phức tạp, nhưng cần nhiều dữ liệu và sức tính toán. Ví dụ: lớp đầu học cạnh, lớp giữa học mắt mũi, lớp sau học khuôn mặt.
- **Hidden Layer**: Lớp ẩn — các lớp nằm giữa lớp vào và lớp ra; "ẩn" vì ta không trực tiếp thấy hay gán giá trị cho chúng. Đây là nơi mạng tự học các đặc trưng trung gian. Ví dụ: mạng 784 → 128 → 64 → 10 có hai lớp ẩn 128 và 64 nơ-ron.
- **Input Layer**: Lớp vào — nhận dữ liệu đầu vào, mỗi nơ-ron ứng với một feature; lớp này không tính toán gì. Ví dụ: ảnh 28×28 điểm ảnh → lớp vào có 784 nơ-ron.
- **Output Layer**: Lớp ra — trả ra dự đoán cuối cùng. Số nơ-ron và activation tuỳ bài toán: hồi quy thường 1 nơ-ron không activation; 2 lớp dùng 1 nơ-ron sigmoid; nhiều lớp dùng K nơ-ron softmax. Ví dụ: nhận diện chữ số 0–9 → 10 nơ-ron softmax.
- **Forward Pass**: Lan truyền xuôi — đưa dữ liệu đi qua lần lượt từng lớp, từ lớp vào tới lớp ra, để tính ra dự đoán (và loss khi train). Lúc inference chỉ cần forward pass. Ví dụ: ảnh đi qua các lớp và ra vector xác suất cho 10 chữ số.
- **One-hot Vector**: Vector toàn số 0, chỉ vị trí ứng với lớp đúng bằng 1. Dùng để biểu diễn nhãn khi tính Cross-Entropy cho bài toán nhiều lớp. Ví dụ: 4 lớp, đáp án là lớp thứ 2 → [0, 1, 0, 0].
- **Batch**: Một nhóm mẫu được đưa vào mạng cùng lúc; gradient được tính trung bình trên cả nhóm rồi mới cập nhật weight một lần. Batch size ảnh hưởng tốc độ, bộ nhớ GPU và độ ổn định khi train. Ví dụ: batch size 32 — mỗi lần đưa vào 32 ảnh.
- **Iteration**: Một lần cập nhật weight, tương ứng xử lý xong một batch. Số iteration mỗi epoch = số mẫu / batch size. Ví dụ: 1.000 mẫu, batch size 100 → mỗi epoch có 10 iteration.
- **Optimizer**: Thuật toán quyết định cách dùng gradient để cập nhật weight — bước dài bao nhiêu, có cộng dồn quán tính không, có điều chỉnh riêng cho từng weight không. Chọn optimizer tốt giúp train nhanh và ổn định hơn. Ví dụ: SGD, SGD + Momentum, RMSprop, Adam.
- **Momentum**: Kỹ thuật cộng dồn hướng di chuyển của các bước trước vào bước hiện tại, giống hòn bi lăn xuống dốc có đà. Giúp đi nhanh hơn theo hướng ổn định, bớt dao động và vượt qua các hố nhỏ. Ví dụ: SGD với momentum = 0,9 giữ lại 90% "đà" của bước trước.
- **RMSprop**: Optimizer điều chỉnh learning rate riêng cho từng weight: chia bước đi cho trung bình trượt của bình phương gradient gần đây. Weight có gradient lớn thì bước nhỏ lại, gradient nhỏ thì bước lớn hơn. Hay dùng cho RNN. Ví dụ: `tf.keras.optimizers.RMSprop(learning_rate=0.001)`.
- **Adam** (Adaptive Moment Estimation): Optimizer kết hợp Momentum (nhớ hướng đi trung bình) và RMSprop (learning rate riêng cho từng weight). Chạy tốt với hầu hết bài toán mà ít phải chỉnh, nên là lựa chọn mặc định phổ biến nhất. Ví dụ: `Adam(learning_rate=0.001)` là điểm khởi đầu tiêu chuẩn.
