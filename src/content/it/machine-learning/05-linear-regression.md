---
title: Linear Regression — Dự đoán con số bằng một đường thẳng
short: Linear Regression
icon: 📈
summary: Thuật toán "vỡ lòng" của Machine Learning. Hiểu Linear Regression là hiểu cách một model học — có giả định, có hàm lỗi, có Gradient Descent. Bài này đi từ một biến tới nhiều biến, cách đo độ tốt (R²) và cách mở rộng sang đường cong bằng Polynomial Regression.
---

# Mục tiêu
- Hiểu mô hình $Y = \beta_0 + \beta_1 X + \varepsilon$ và ý nghĩa từng thành phần
- Biết Residual, RSS và phương pháp Least Squares
- Đọc được R² và RSE
- Mở rộng sang Multiple Linear Regression
- Hiểu cách Gradient Descent / SGD / Mini-batch tìm ra hệ số
- Dùng Linear Regression và Polynomial Regression bằng scikit-learn

# Regression là gì?

**[[Regression]]** là quá trình tìm hiểu mối quan hệ giữa **một biến phụ thuộc** (thứ cần dự đoán, ký hiệu **Y**) và **các biến độc lập** (thông tin đầu vào, ký hiệu **X**).

**[[Linear Regression]]** giả định quan hệ đó là **tuyến tính** — tức có thể vẽ bằng một đường thẳng (hoặc mặt phẳng nếu nhiều biến). Đời thực hiếm khi tuyến tính hoàn toàn, nhưng đường thẳng thường là một xấp xỉ đủ tốt, dễ hiểu và là điểm khởi đầu tuyệt vời.

Ví dụ thực tế:
- Dự đoán **giá nhà** (Y) từ diện tích, số phòng ngủ, vị trí (X).
- Ước lượng **lương** (Y) từ số năm kinh nghiệm (X).
- Dự báo **doanh số** (Y) từ ngân sách quảng cáo (X).

::: example Không phải feature nào cũng hữu ích
Với dữ liệu quảng cáo: ngân sách **TV** có quan hệ tuyến tính rất rõ với doanh số, **Radio** ở mức vừa, còn **báo giấy** gần như không liên quan. Bài học: trước khi xây model, nên xem từng feature có thật sự giúp dự đoán không.

![Doanh số theo ngân sách TV, Radio và báo giấy — đường xanh là đường hồi quy của từng feature.](/it/ml/advertising-scatter.webp =1600x742)

:::

# Mô hình một biến

::: formula
$$Y = \beta_0 + \beta_1 X + \varepsilon$$
:::

- **$\beta_0$** ([[Intercept]] — hệ số chặn): giá trị của $Y$ khi $X = 0$, chỗ đường thẳng cắt trục tung.
- **$\beta_1$** ([[Slope]] — độ dốc): $X$ tăng 1 đơn vị thì $Y$ tăng thêm $\beta_1$.
- **$\varepsilon$** (epsilon): sai số — phần mà đường thẳng không giải thích được (nhiễu, các yếu tố chưa đưa vào).

$\beta_0$ và $\beta_1$ gọi chung là **hệ số** ([[Coefficient]]) hay **tham số** của model. "Train" Linear Regression nghĩa là **tìm $\beta_0$ và $\beta_1$ phù hợp nhất với dữ liệu**, rồi dùng chúng để dự đoán Y trong tương lai.

::: example
Model học được: $\text{Giá} = 50 + 0.8 \times \text{Diện tích}$ (đơn vị triệu đồng, m²).
Căn nhà 100 m² → giá dự đoán $= 50 + 0.8 \times 100 =$ **130 triệu**.
:::

# Tìm đường thẳng "tốt nhất" — Least Squares

Với mỗi điểm dữ liệu thứ i:
- Giá trị dự đoán: $\hat{y}_i = \beta_0 + \beta_1 x_i$ (ký hiệu $\hat{y}$ đọc là "y mũ")
- **[[Residual]]** (phần dư): $e_i = y_i - \hat{y}_i$ — khoảng cách giữa giá trị thật và dự đoán.

!viz[Linear Regression học bằng Gradient Descent: đường thẳng xuất phát sai hoàn toàn rồi xoay và dịch dần vào đúng chỗ. Các đoạn đỏ là residual; RSS (tổng bình phương residual) giảm dần qua mỗi vòng lặp.](regression-fit)

Gộp tất cả phần dư lại bằng **[[RSS]]**:

::: formula
$$\text{RSS} = e_1^2 + e_2^2 + \dots + e_n^2 = \sum_{i=1}^{n} \left(y_i - \hat{y}_i\right)^2$$
:::

Phương pháp **[[Least Squares]]** (bình phương nhỏ nhất) chọn $\beta_0, \beta_1$ sao cho **RSS nhỏ nhất**. RSS (hoặc RSS/2, RSS/n) chính là **[[cost function|Loss Function]]** của Linear Regression.

::: example Tính RSS
Giá trị thật $y = [3, 5, 7]$, dự đoán $\hat{y} = [2.8, 5.1, 7.3]$.
$\text{RSS} = 0.2^2 + 0.1^2 + 0.3^2 = 0.04 + 0.01 + 0.09 =$ **0.14**
:::

Vì sao bình phương? Để sai số âm và dương không triệt tiêu nhau, và để phạt nặng các điểm sai nhiều.

**Cách tìm cực tiểu**: cost function đạt nhỏ nhất ở chỗ đạo hàm bằng 0. Lấy [[Partial Derivative]] theo $\beta_0$ và $\beta_1$, cho bằng 0 rồi giải ra là có ngay công thức tính $\beta_0, \beta_1$ (gọi là **nghiệm dạng đóng**, closed-form).

# Model tốt tới đâu? — RSE và R²

- **[[RSE]]** (Residual Standard Error): trung bình, dự đoán lệch khỏi giá trị thật khoảng bao nhiêu — cùng đơn vị với Y.
- **[[R²]]**: tỉ lệ biến động của Y mà model giải thích được.

::: formula
$$R^2 = 1 - \frac{\text{RSS}}{\text{TSS}}$$
:::

với **TSS** (Total Sum of Squares) $= \sum_i (y_i - \bar{y})^2$ — tổng biến động của $Y$ quanh giá trị trung bình $\bar{y}$.

- $R^2 = 0$: model không giải thích được gì (chẳng hơn việc luôn đoán bằng trung bình).
- $R^2 = 1$: khớp hoàn hảo.
- $R^2 = 0.85$: model giải thích được **85%** biến động của Y.

# Nhiều biến — Multiple Linear Regression

Thực tế giá nhà phụ thuộc nhiều thứ cùng lúc:

::: formula
$$Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \dots + \beta_p X_p + \varepsilon$$
:::

Với **p** feature và **m** mẫu, ta viết gọn bằng ma trận: Y là vector m giá trị, $\beta$ là vector $p + 1$ hệ số, $X$ là ma trận dữ liệu có thêm một cột toàn số 1 (để nhân với $\beta_0$). Nhờ [[Matrix]], máy tính xử lý hàng triệu mẫu cùng lúc. Mỗi $\beta_j$ cho biết: **giữ nguyên các feature khác**, $X_j$ tăng 1 thì $Y$ thay đổi $\beta_j$.

!viz[Với 2 feature, Linear Regression là một mặt phẳng trong không gian 3 chiều (xoay để nhìn từ nhiều phía). Đoạn đỏ là residual: khoảng cách từ mỗi điểm tới mặt phẳng.](regression-plane-3d)

# Tìm hệ số bằng Gradient Descent

Khi có rất nhiều feature hoặc dữ liệu cực lớn, giải công thức dạng đóng tốn kém. Thay vào đó dùng [[Gradient Descent]] (đã học ở bài 2): lặp lại việc chỉnh mỗi hệ số một bước nhỏ ngược hướng gradient của cost function:

::: formula
$$\beta_j := \beta_j - \alpha\,\frac{\partial J}{\partial \beta_j}$$
:::

với $\alpha$ là [[Learning Rate]], $J$ là cost function.

::: warn Learning rate và local minimum
- $\alpha$ quá nhỏ: hội tụ rất chậm.
- $\alpha$ quá lớn: nhảy qua lại quanh đáy, thậm chí đi xa dần (phân kỳ).
- Với hàm lỗi không lồi, Gradient Descent có thể dừng ở [[Local Minimum]]. May mắn là cost function của Linear Regression là hàm [[Convex]] nên không gặp vấn đề này.
:::

### Tối ưu trong ML — vì sao lại "ngẫu nhiên"?

Cost function trong ML thường là **tổng lỗi trên từng mẫu train**. Về lý thuyết, ta muốn giảm lỗi trung bình trên **toàn bộ dữ liệu có thể có ngoài đời** — nhưng phân phối đó ta không biết, chỉ có trong tay một mẫu. Vì bản thân bài toán đã mang tính ngẫu nhiên, ta cũng có thể cho thuật toán ngẫu nhiên: mỗi bước chỉ nhìn một phần dữ liệu → đó là [[SGD]].

| | Gradient Descent (toàn bộ dữ liệu) | SGD / Mini-batch |
|---|---|---|
| Mỗi bước | Chậm (xem hết N mẫu) | Rất nhanh (xem 1 hoặc B mẫu, B ≪ N) |
| Dữ liệu lớn | Hội tụ chậm | Hội tụ nhanh hơn cả về số epoch lẫn thời gian |
| Học trực tuyến ([[Online Learning]]) | Không | Có — cập nhật ngay khi dữ liệu mới tới |
| Nhược điểm | — | Gradient nhiễu; dao động quanh điểm tối ưu; phải chỉnh learning rate cẩn thận (hoặc giảm dần theo lịch) |

!viz[Cost theo số epoch: Gradient Descent giảm đều đặn; SGD giảm nhanh hơn ở đầu nhưng dao động lên xuống.](cost-curves)

!viz[Đường đi tới điểm tối ưu: Gradient Descent đi thẳng một mạch; SGD đi zích zắc vì mỗi bước chỉ nhìn một mẫu nên gradient bị nhiễu.](descent-paths-two)

[[Mini-batch Gradient Descent]] với batch 32, 64, 128 là lựa chọn dung hòa phổ biến nhất. Các thuật toán tối ưu nâng cao (Momentum, Adam…) sẽ gặp lại ở bài Neural Network.

# Thực hành với scikit-learn

```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

reg = LinearRegression().fit(X_train, y_train)
print(reg.coef_, reg.intercept_)     # các hệ số β1..βp và β0
print(reg.score(X_test, y_test))     # R² trên test set

y_pred = reg.predict(X_test)         # dự đoán giá trị mới
mse = mean_squared_error(y_test, y_pred)
```

# Polynomial Regression — khi dữ liệu là đường cong

Nhiều quan hệ không thẳng: doanh số tăng nhanh lúc đầu rồi chững lại khi chi quảng cáo nhiều (hiệu ứng "lợi ích giảm dần"), đường tăng trưởng hình chữ S…

**[[Polynomial Regression]]** thêm các feature lũy thừa $X^2, X^3, \dots$ rồi vẫn dùng Linear Regression trên các feature mới:

::: formula
$$Y = b_0 + b_1 X + b_2 X^2 + b_3 X^3 \qquad \text{(đa thức bậc 3)}$$
:::

Model vẫn "tuyến tính" theo các hệ số b, chỉ là feature đã được biến đổi — nên vẫn giải được bằng Least Squares.

!viz[Cùng một tập điểm, đa thức bậc 1, 2, 3 cho ra các đường khác nhau — bậc càng cao càng uốn theo dữ liệu được nhiều hơn.](poly-fit-degrees)

```python
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

# degree=2: biến X thành [1, X, X²] rồi chạy Linear Regression
model = make_pipeline(PolynomialFeatures(degree=2), LinearRegression())
model.fit(X_train, y_train)
model.score(X_test, y_test)
```

::: warn Bậc càng cao càng dễ Overfitting
Đa thức bậc quá cao sẽ uốn éo đi qua mọi điểm train — đúng hiện tượng [[Overfitting]]. Hãy dùng [[K-Fold Cross-Validation]] để chọn bậc phù hợp.
:::

# Ghi nhớ nhanh
- Linear Regression: $Y = \beta_0 + \beta_1 X + \varepsilon$; $\beta_0$ là hệ số chặn, $\beta_1$ là độ dốc.
- Least Squares chọn hệ số làm RSS (tổng bình phương phần dư) nhỏ nhất.
- $R^2 = 1 - \dfrac{\text{RSS}}{\text{TSS}}$: tỉ lệ biến động được giải thích; càng gần 1 càng tốt.
- Dữ liệu lớn → dùng Gradient Descent/SGD/Mini-batch thay vì công thức dạng đóng.
- Polynomial Regression = thêm $X^2, X^3, \dots$ rồi chạy Linear Regression; chọn bậc bằng cross-validation.

# Thuật ngữ
- **Intercept**: Hệ số chặn β₀ — giá trị dự đoán khi mọi feature bằng 0, tức chỗ đường hồi quy cắt trục tung. Đôi khi không có ý nghĩa thực tế (nhà 0 m²) nhưng vẫn cần để đường thẳng đặt đúng vị trí. Ví dụ: giá = 50 + 0,8 × diện tích → intercept là 50 triệu.
- **Slope**: Độ dốc β₁ — mức thay đổi của Y khi X tăng thêm 1 đơn vị. Dương là X tăng thì Y tăng; âm là ngược lại. Ví dụ: slope 0,8 nghĩa là mỗi m² tăng thêm làm giá dự đoán tăng 0,8 triệu.
- **Coefficient**: Hệ số — các con số β mà Linear Regression học được, mỗi feature một hệ số, cho biết feature đó ảnh hưởng tới kết quả bao nhiêu khi giữ nguyên các feature khác. Ví dụ: hệ số của "số phòng ngủ" là 120 → thêm một phòng (cùng diện tích) thì giá dự đoán tăng 120 triệu.
- **Residual**: Phần dư — chênh lệch giữa giá trị thật và giá trị model dự đoán cho một điểm: e = y − ŷ. Residual dương là model đoán thấp hơn thật, âm là đoán cao hơn. Xem residual giúp phát hiện model còn sót quy luật gì. Ví dụ: nhà bán thật 3 tỉ, model đoán 2,8 tỉ → residual = 0,2 tỉ.
- **RSS** (Residual Sum of Squares): Tổng bình phương các phần dư — thước đo tổng lỗi của đường hồi quy trên toàn bộ dữ liệu. Bình phương để sai số âm và dương không triệt tiêu nhau và để phạt nặng điểm sai nhiều. Ví dụ: residual [0,2; 0,1; 0,3] → RSS = 0,04 + 0,01 + 0,09 = 0,14.
- **Least Squares**: Phương pháp bình phương nhỏ nhất — chọn các hệ số sao cho RSS nhỏ nhất. Với Linear Regression có công thức tính trực tiếp (lấy đạo hàm bằng 0 rồi giải). Đây là cách "fit" đường thẳng kinh điển. Ví dụ: trong mọi đường thẳng có thể vẽ qua đám điểm, chọn đường có tổng bình phương khoảng cách dọc nhỏ nhất.
- **RSE** (Residual Standard Error): Sai số chuẩn của phần dư — cho biết trung bình dự đoán lệch khỏi giá trị thật khoảng bao nhiêu, cùng đơn vị với Y. Ví dụ: RSE = 3,2 (đơn vị nghìn sản phẩm) nghĩa là dự báo doanh số thường lệch khoảng 3.200 sản phẩm.
- **Online Learning**: Học trực tuyến — model được cập nhật liên tục mỗi khi có dữ liệu mới tới (từng mẫu hoặc từng nhóm nhỏ), thay vì train lại từ đầu trên toàn bộ dữ liệu. SGD rất hợp với cách học này. Ví dụ: hệ thống gợi ý tin tức cập nhật model ngay khi người dùng bấm đọc bài.
- **Polynomial Regression**: Hồi quy đa thức — thêm các lũy thừa của feature (X², X³…) làm feature mới rồi chạy Linear Regression như bình thường, nhờ vậy vẽ được đường cong. Bậc càng cao càng uốn được nhiều nhưng càng dễ overfitting; chọn bậc bằng cross-validation. Ví dụ: doanh số tăng nhanh lúc đầu rồi chững lại khi chi quảng cáo nhiều — dùng đa thức bậc 2.
