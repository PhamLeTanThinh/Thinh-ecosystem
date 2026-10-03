---
title: Huấn luyện Deep Neural Network với TensorFlow/Keras
short: Train DNN với TensorFlow
icon: 🛠️
summary: 'Từ lý thuyết sang thực hành: TensorFlow/Keras là gì, 3 cách xây model, 2 cách train, và "bộ đồ nghề" giúp mạng sâu học tốt — Batch Normalization, Dropout, Early Stopping, Optimizer, Loss, Metrics, TensorBoard và tune hyperparameter.'
---

# Mục tiêu
- Hiểu TensorFlow làm gì và Tensor là gì
- Xây model theo 3 kiểu: Sequential, Functional, Subclassing
- Train bằng `fit()` hoặc tự viết vòng lặp với GradientTape
- Hiểu và dùng đúng Batch Normalization, Dropout, Early Stopping
- Chọn Optimizer, Learning Rate Schedule, Loss Function, Metric phù hợp
- Theo dõi quá trình train bằng TensorBoard và tune bằng Keras Tuner

# TensorFlow là gì?

**[[TensorFlow]]** là thư viện Deep Learning mã nguồn mở của Google. Nói ngắn gọn, nó làm hai việc chính:
1. Cung cấp công cụ để **định nghĩa các phép tính trên tensor**.
2. **Tự động tính đạo hàm** ([[Automatic Differentiation]]) của các phép tính đó — đây chính là thứ Backpropagation cần.

**[[Keras]]** là API cấp cao nằm trong TensorFlow (`tf.keras`), giúp xây và train model chỉ với vài dòng code.

### Tensor là gì?

**[[Tensor]]** là mảng nhiều chiều — cách tổng quát hóa của số, vector, ma trận:

| Số chiều | Tên gọi | Ví dụ |
|---|---|---|
| 0 | Scalar | Nhiệt độ: `25` |
| 1 | Vector | Một mẫu dữ liệu: `[80, 3, 5]` |
| 2 | Matrix | Bảng dữ liệu, ảnh xám |
| 3 | Tensor 3D | Ảnh màu: cao × rộng × 3 kênh màu |
| 4 | Tensor 4D | Một batch ảnh màu: số ảnh × cao × rộng × 3 |

### TensorFlow vs NumPy

Cả hai đều là thư viện mảng N chiều và có cú pháp khá giống nhau. Nhưng NumPy **không tự tính đạo hàm** và **không chạy trên GPU**, còn TensorFlow làm được cả hai — nên train mạng lớn nhanh hơn hàng chục lần.

```python
import numpy as np, tensorflow as tf
a = np.zeros((2, 2));  b = tf.zeros((2, 2))
np.sum(a, axis=1);     tf.reduce_sum(b, axis=1)
a @ a;                 tf.matmul(b, b)
```

# 3 cách xây model

### 1. Sequential — xếp lớp như xếp gạch

Dùng khi các lớp nối **thẳng hàng**, lớp này nối tiếp lớp kia.

```python
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(784,)),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(10, activation='softmax'),
])
```

### 2. Functional — nối lớp như vẽ sơ đồ

Dùng khi kiến trúc **phân nhánh**: nhiều đầu vào, nhiều đầu ra, hoặc có đường tắt (skip connection).

```python
inputs = tf.keras.Input(shape=(784,))
x = tf.keras.layers.Dense(128, activation='relu')(inputs)
x = tf.keras.layers.Dropout(0.3)(x)
outputs = tf.keras.layers.Dense(10, activation='softmax')(x)
model = tf.keras.Model(inputs, outputs)
```

### 3. Subclassing — tự viết class

Linh hoạt nhất: tự định nghĩa cách dữ liệu chạy trong hàm `call()` — dùng cho nghiên cứu, kiến trúc lạ.

```python
class MyModel(tf.keras.Model):
    def __init__(self):
        super().__init__()
        self.d1 = tf.keras.layers.Dense(128, activation='relu')
        self.drop = tf.keras.layers.Dropout(0.3)
        self.d2 = tf.keras.layers.Dense(10, activation='softmax')

    def call(self, x, training=False):
        x = self.d1(x)
        x = self.drop(x, training=training)   # Dropout chỉ bật khi training=True
        return self.d2(x)
```

# 2 cách train

### Cách 1 — dùng sẵn `compile()` + `fit()`

```python
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
history = model.fit(X_train, y_train, epochs=20, batch_size=32, validation_split=0.2)
model.evaluate(X_test, y_test)
```

### Cách 2 — tự viết vòng lặp train

Khi cần kiểm soát chi tiết (loss tự chế, GAN…), dùng **[[GradientTape]]** để "ghi lại" phép tính rồi lấy gradient:

```python
optimizer = tf.keras.optimizers.Adam(1e-3)
loss_fn = tf.keras.losses.SparseCategoricalCrossentropy()

for epoch in range(20):
    for x_batch, y_batch in train_dataset:
        with tf.GradientTape() as tape:
            preds = model(x_batch, training=True)        # forward
            loss = loss_fn(y_batch, preds)               # tính loss
        grads = tape.gradient(loss, model.trainable_variables)                 # backprop
        optimizer.apply_gradients(zip(grads, model.trainable_variables))       # cập nhật
```

# Batch Normalization

**Ý tưởng**: chuẩn hóa đầu vào của mỗi lớp về **trung bình 0, phương sai 1** trong từng mini-batch.

**Vấn đề nó giải quyết** — **[[Internal Covariate Shift]]**: trong lúc train, weight của các lớp trước liên tục thay đổi, nên phân phối dữ liệu đi vào lớp sau cũng thay đổi theo, khiến lớp sau phải liên tục "học lại từ đầu".

**Lợi ích của [[Batch Normalization]]** (Ioffe & Szegedy, 2015):
- Gradient lan truyền tốt hơn qua mạng sâu.
- Cho phép dùng learning rate lớn hơn → hội tụ nhanh hơn.
- Bớt phụ thuộc vào cách khởi tạo weight.
- Có tác dụng regularization nhẹ (do thống kê trên mini-batch có chút nhiễu).

### Thuật toán

1. Tính trung bình của mini-batch: μ_B = (1/m) Σ xᵢ
2. Tính phương sai: σ²_B = (1/m) Σ (xᵢ − μ_B)²
3. Chuẩn hóa: x̂ᵢ = (xᵢ − μ_B) / √(σ²_B + ε)
4. Co giãn và dịch: yᵢ = γ·x̂ᵢ + β

- **γ** (gamma) và **β** (beta) là tham số **học được**, cho phép mạng "hoàn tác" việc chuẩn hóa nếu cần.
- **ε** là hằng số rất nhỏ (ví dụ 1e-5) để tránh chia cho 0.
- **Vị trí**: thường đặt **trước** activation (Dense/Conv → BN → ReLU). Một số người đặt sau activation — cả hai đều chạy được.

### Train khác Inference

- **Khi train**: dùng trung bình/phương sai của **mini-batch hiện tại**, đồng thời cập nhật **trung bình trượt** ([[Moving Average]]): running = momentum × running + (1 − momentum) × batch.
- **Khi inference**: dùng **trung bình trượt đã lưu**, không dùng thống kê của batch → kết quả ổn định kể cả khi dự đoán một mẫu đơn lẻ. Lúc này BN chỉ còn là một phép biến đổi tuyến tính cố định.

```python
tf.keras.layers.BatchNormalization(momentum=0.99, epsilon=1e-3)
```

::: warn
Khi tự gọi `model(x)` trong vòng lặp tự viết, phải truyền đúng `training=True` (lúc train) / `training=False` (lúc đánh giá). Truyền sai thì BN và Dropout hoạt động sai chế độ.
:::

# Dropout

**[[Dropout]]** (Srivastava và cộng sự, 2014) là kỹ thuật regularization: trong lúc train, **ngẫu nhiên "tắt" một tỉ lệ p nơ-ron** (cho đầu ra bằng 0) ở mỗi bước.

!viz[Mỗi bước train, Dropout tắt ngẫu nhiên khoảng 40% nơ-ron ở các lớp ẩn (dấu ✕) — bước sau lại tắt một nhóm khác, nên mạng không thể ỷ lại vào vài nơ-ron cụ thể.](dropout)

**Vì sao hiệu quả?**
- Nơ-ron không thể ỷ lại vào một vài nơ-ron "đồng đội" cụ thể (gọi là co-adaptation) → buộc mỗi nơ-ron phải tự học đặc trưng hữu ích → mạng học được biểu diễn **bền vững và dư thừa**.
- **Hiệu ứng ensemble**: mỗi bước train là một mạng con khác nhau. Với n nơ-ron có tới 2ⁿ mạng con khả dĩ — dropout giống như train và lấy trung bình rất nhiều mạng con cùng lúc.

**Thông số:**
- Lớp ẩn: p = **0.2–0.5**. **Không bao giờ** áp dụng ở lớp ra.
- Lớp vào: p = 0.1–0.2 (tác dụng gần giống data augmentation).
- **Khi test**: tắt dropout. Bản gốc nhân weight với (1 − p) để bù. Cách cài đặt hiện đại (**Inverted Dropout**) thì nhân activation với 1/(1 − p) **ngay lúc train**, nên lúc test không cần làm gì thêm.

```python
tf.keras.layers.Dropout(rate=0.5)   # rate = tỉ lệ nơ-ron bị TẮT
```

**Kinh nghiệm:**
- Đặt sau activation của các lớp Dense lớn (thường gặp nhất: sau Dense + ReLU).
- Ít dùng trong lớp tích chập — thay bằng `SpatialDropout2D` (tắt cả bản đồ đặc trưng).
- Bắt đầu với 0.5 cho lớp ẩn rồi điều chỉnh theo kết quả validation. Dropout cao → regularize mạnh → có thể cần mạng lớn hơn hoặc nhiều epoch hơn. Mạng nhỏ thì dùng dropout thấp để tránh underfit.
- Biến thể: **DropConnect** (tắt từng weight thay vì nơ-ron), **SpatialDropout** (cho CNN), **Monte Carlo Dropout** (giữ dropout cả lúc inference để ước lượng độ không chắc chắn).

# Early Stopping

**[[Early Stopping]]**: theo dõi một chỉ số trên validation sau mỗi epoch; nếu **không cải thiện sau `patience` epoch liên tiếp thì dừng train** — tránh việc model tiếp tục học vẹt.

| Tham số | Ý nghĩa |
|---|---|
| `monitor` | Chỉ số cần theo dõi — `"val_loss"` hoặc `"val_accuracy"` |
| `patience` | Số epoch chờ trước khi dừng (ví dụ 5–20) |
| `min_delta` | Mức thay đổi tối thiểu mới tính là "cải thiện" (ví dụ 0.001) |
| `restore_best_weights` | `True` → khôi phục weight ở epoch tốt nhất |

```python
callback = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
model.fit(X, y, validation_split=0.2, epochs=200, callbacks=[callback])
```

# Optimizer và Learning Rate Schedule

| Optimizer | Đặc điểm |
|---|---|
| **SGD** | Cơ bản; nên thêm momentum (0.9) và Nesterov |
| **SGD + Momentum** | Cộng dồn gradient quá khứ → mượt hơn, thoát hố nhỏ |
| **[[RMSprop]]** | Learning rate riêng cho từng tham số theo trung bình trượt của bình phương gradient; tốt cho RNN |
| **[[Adam]]** | Momentum + RMSprop; **mặc định phổ biến nhất**. Tham số chuẩn: lr = 0.001, beta_1 = 0.9, beta_2 = 0.999, epsilon = 1e-7 |
| **[[AdamW]]** | Adam với weight decay tách riêng; tổng quát hóa tốt hơn "Adam + L2" |

**[[Learning Rate Schedule]]** — giảm learning rate dần trong lúc train:
- **ExponentialDecay**: lr = lr_ban_đầu × decay_rate^(step / decay_steps).
- **CosineDecay**: giảm mượt theo đường cosin về 0.
- **ReduceLROnPlateau**: giảm learning rate khi chỉ số validation ngừng cải thiện.

::: tip Kinh nghiệm
Bắt đầu với **Adam (lr = 1e-3)**. Muốn vắt thêm hiệu năng thì thử SGD + momentum để tinh chỉnh.
:::

# Loss Function — chọn theo bài toán

| Bài toán | Loss | Ghi chú |
|---|---|---|
| Regression | **MSE** | Mặc định; nhạy với outlier |
| Regression | **MAE** | Bền với outlier; gradient kém mượt |
| Regression | **[[Huber Loss]]** | Như MSE khi sai số nhỏ, như MAE khi sai số lớn |
| 2 lớp | **BinaryCrossentropy** | Lớp ra dùng sigmoid |
| Nhiều lớp, nhãn one-hot | **CategoricalCrossentropy** | Lớp ra dùng softmax |
| Nhiều lớp, nhãn số nguyên | **SparseCategoricalCrossentropy** | Softmax — tiện nhất, không cần one-hot |
| Lệch lớp | **[[Focal Loss]]** | Giảm trọng số mẫu dễ, tập trung mẫu khó |
| So sánh 2 phân phối | **[[KL Divergence]]** | Dùng trong VAE |

::: tip
Luôn ghép đúng loss với activation lớp ra: sigmoid ↔ BinaryCrossentropy, softmax ↔ CategoricalCrossentropy.
:::

# Metric để theo dõi

- **Classification**: Accuracy (dễ gây hiểu lầm khi lệch lớp), Precision, Recall, F1, AUC-ROC.
- **Regression**: MAE (dễ hiểu), RMSE (phạt sai số lớn), R² (1.0 = hoàn hảo).

```python
model.compile(optimizer='adam', loss='binary_crossentropy',
              metrics=['accuracy', tf.keras.metrics.AUC()])
```

Cần metric riêng cho nghiệp vụ thì kế thừa `tf.keras.metrics.Metric`.

# TensorBoard — xem model học theo thời gian thực

**[[TensorBoard]]** là công cụ trực quan hóa của TensorFlow:
- **Scalars**: đường cong loss, accuracy, learning rate theo epoch.
- **Graphs**: sơ đồ kiến trúc model.
- **Histograms**: phân phối weight và gradient qua thời gian.
- **Images**: ảnh đầu vào, ảnh augmentation, bản đồ đặc trưng.
- **Profiler**: tìm điểm nghẽn hiệu năng CPU/GPU.

```python
from datetime import datetime
log_dir = 'logs/fit/' + datetime.now().strftime('%Y%m%d-%H%M%S')
tb_callback = tf.keras.callbacks.TensorBoard(log_dir=log_dir, histogram_freq=1)
model.fit(X, y, epochs=20, callbacks=[tb_callback])
# Terminal: tensorboard --logdir logs/fit   → mở http://localhost:6006
```

# Tune hyperparameter cho mạng nơ-ron

**Cần tune**: learning rate, batch size, số lớp/số nơ-ron, tỉ lệ dropout, optimizer, activation function.

**Phương pháp:**
- **Grid Search** — thử mọi tổ hợp trong lưới: kỹ nhưng tốn kém.
- **Random Search** — thử ngẫu nhiên: thường hiệu quả hơn Grid Search.
- **[[Bayesian Optimization]]** — dùng kết quả các lần thử trước để đoán vùng nên thử tiếp.

**Keras Tuner** (`pip install keras-tuner`) hỗ trợ RandomSearch, Hyperband, BayesianOptimization:

```python
import keras_tuner as kt

def build_model(hp):
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(hp.Int('units', 32, 512, step=32), activation='relu'),
        tf.keras.layers.Dense(10, activation='softmax'),
    ])
    model.compile(optimizer=tf.keras.optimizers.Adam(hp.Choice('lr', [1e-2, 1e-3, 1e-4])),
                  loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    return model

tuner = kt.RandomSearch(build_model, objective='val_accuracy', max_trials=20)
tuner.search(X_train, y_train, validation_split=0.2, epochs=10)
```

**Nguyên tắc:**
- Luôn tune trên **validation set**, không bao giờ trên test set.
- Tìm thô trên khoảng rộng trước, rồi tinh chỉnh quanh giá trị tốt nhất.
- **Learning rate** thường là hyperparameter ảnh hưởng nhất — tune nó đầu tiên.

# Ghi nhớ nhanh
- TensorFlow = tensor + tự tính đạo hàm + GPU; Keras là API cấp cao.
- Sequential (thẳng hàng) · Functional (phân nhánh) · Subclassing (tự do nhất).
- BatchNorm: chuẩn hóa theo mini-batch, γ/β học được; inference dùng trung bình trượt.
- Dropout 0.2–0.5 ở lớp ẩn, không dùng ở lớp ra, tự tắt khi inference.
- Early Stopping: monitor val_loss, patience, restore_best_weights=True.
- Mặc định: Adam lr = 1e-3; ghép đúng loss với activation lớp ra.

# Thuật ngữ
- **TensorFlow**: Thư viện Deep Learning mã nguồn mở của Google: định nghĩa các phép tính trên tensor, tự động tính đạo hàm và chạy được trên GPU/TPU, kèm công cụ để triển khai model lên server, điện thoại, trình duyệt. Ví dụ: train một mạng nhận diện ảnh bằng `tf.keras` rồi xuất ra để chạy trên điện thoại.
- **Automatic Differentiation**: Tự động tính đạo hàm — thư viện ghi lại các phép tính đã thực hiện rồi tự áp dụng chain rule để tính gradient chính xác cho mọi tham số, không cần viết công thức đạo hàm bằng tay. Đây là thứ làm cho việc train mạng sâu trở nên khả thi. Ví dụ: `tape.gradient(loss, model.trainable_variables)` trả về gradient của hàng triệu weight.
- **Keras**: API cấp cao nằm trong TensorFlow (`tf.keras`) để xây và train mạng nơ-ron chỉ với vài dòng code: khai báo các lớp, `compile()` rồi `fit()`. Dễ học, hợp cho phần lớn bài toán. Ví dụ: `Sequential([Dense(128, activation='relu'), Dense(10, activation='softmax')])`.
- **Tensor**: Mảng số nhiều chiều — dạng tổng quát của scalar (0 chiều), vector (1 chiều), ma trận (2 chiều) lên nhiều chiều hơn. Mọi dữ liệu và weight trong Deep Learning đều được lưu dưới dạng tensor. Ví dụ: một batch 32 ảnh màu 224×224 là tensor kích thước (32, 224, 224, 3).
- **GradientTape**: Công cụ của TensorFlow "ghi băng" các phép tính trong một khối `with`, rồi dùng bản ghi đó để tính gradient. Cần khi tự viết vòng lặp train thay vì dùng `fit()`. Ví dụ: tính loss trong `with tf.GradientTape() as tape:` rồi gọi `tape.gradient(loss, weights)`.
- **Internal Covariate Shift**: Hiện tượng phân phối dữ liệu đi vào một lớp liên tục thay đổi trong lúc train, vì weight của các lớp phía trước liên tục được cập nhật — lớp sau như phải học trên "mặt đất đang trôi". Batch Normalization ra đời để giảm vấn đề này. Ví dụ: lớp thứ 5 hôm trước nhận giá trị quanh 0, hôm sau quanh 50 vì các lớp trước đã thay đổi.
- **Batch Normalization**: Chuẩn hoá đầu vào của mỗi lớp về trung bình 0, phương sai 1 theo từng mini-batch, rồi co giãn và dịch lại bằng hai tham số học được γ, β. Giúp train nhanh và ổn định hơn, dùng được learning rate lớn hơn. Khi inference dùng trung bình trượt đã lưu thay vì thống kê của batch. Ví dụ: `Dense → BatchNormalization → ReLU`.
- **Moving Average**: Trung bình trượt — trung bình được cập nhật dần theo thời gian, giá trị gần đây có trọng số lớn hơn: mới = momentum × cũ + (1 − momentum) × giá trị hiện tại. Batch Normalization dùng nó để lưu mean/variance cho lúc inference. Ví dụ: momentum 0,99 → mỗi batch mới chỉ làm thay đổi 1% giá trị đang lưu.
- **AdamW**: Biến thể của Adam tách riêng weight decay ra khỏi bước cập nhật theo gradient. Với Adam thường, cộng L2 vào loss bị "pha loãng" bởi cơ chế learning rate riêng; AdamW sửa điều đó nên thường tổng quát hoá tốt hơn. Là optimizer phổ biến khi train Transformer. Ví dụ: `AdamW(learning_rate=1e-3, weight_decay=1e-4)`.
- **Learning Rate Schedule**: Lịch thay đổi learning rate trong lúc train, thường là giảm dần: đầu train bước lớn để tiến nhanh, cuối train bước nhỏ để tinh chỉnh quanh điểm tốt. Ví dụ: ExponentialDecay giảm 4% sau mỗi 1.000 bước; ReduceLROnPlateau giảm một nửa khi val_loss ngừng cải thiện.
- **Huber Loss**: Hàm loss lai cho bài toán hồi quy: với sai số nhỏ thì tính bình phương như MSE (mượt), với sai số lớn thì tính tuyến tính như MAE (không bị outlier kéo quá mạnh). Có tham số δ quyết định ranh giới "nhỏ" và "lớn". Ví dụ: dự báo giá có lẫn vài giao dịch bất thường.
- **Focal Loss**: Hàm loss cho dữ liệu lệch lớp: giảm trọng số của những mẫu model đã đoán đúng dễ dàng, để model tập trung vào các mẫu khó và mẫu thuộc lớp hiếm. Ví dụ: phát hiện vật thể, nơi phần nền (dễ) nhiều gấp hàng nghìn lần vật thể cần tìm.
- **KL Divergence** (Kullback–Leibler): Đo mức khác nhau giữa hai phân phối xác suất: bằng 0 khi giống hệt, càng lớn càng khác. Không đối xứng (KL của P so với Q khác KL của Q so với P). Dùng trong VAE, t-SNE và nén model. Ví dụ: trong VAE, KL ép phân phối của latent space giống phân phối chuẩn.
- **TensorBoard**: Công cụ trực quan hoá đi kèm TensorFlow, xem trên trình duyệt: đường cong loss/accuracy theo epoch, sơ đồ kiến trúc model, phân phối weight và gradient, ảnh đầu vào, thông tin hiệu năng CPU/GPU. Ví dụ: chạy `tensorboard --logdir logs` rồi mở localhost:6006 để so sánh nhiều lần train.
- **Bayesian Optimization**: Phương pháp tune hyperparameter thông minh: xây một mô hình xác suất dự đoán "tổ hợp nào có khả năng cho kết quả tốt" dựa trên các lần thử trước, rồi chọn lần thử tiếp theo theo mô hình đó. Cần ít lần thử hơn Grid/Random Search. Ví dụ: thư viện Optuna, `BayesianOptimization` trong Keras Tuner.
