---
title: Feature Engineering, Feature Selection & Giảm chiều
short: Feature Selection & giảm chiều
icon: 🔎
summary: Không phải cứ nhiều cột là tốt. Bài này nói về cách tạo feature hữu ích, cách loại bớt feature thừa (Filter, Wrapper, Embedded) và cách nén dữ liệu nhiều chiều bằng PCA, Factor Analysis, ICA, t-SNE.
---

# Mục tiêu
- Hiểu Feature Engineering và vì sao nó quan trọng
- Hiểu "lời nguyền số chiều" — vì sao nhiều feature có thể làm model tệ đi
- Dùng được 3 nhóm Feature Selection: Filter, Wrapper, Embedded
- Phân biệt các kỹ thuật giảm chiều: PCA, Factor Analysis, ICA, t-SNE, UMAP

# Feature Engineering — tạo feature tốt

**[[Feature Engineering]]** là việc biến dữ liệu thô thành những feature giúp model dự đoán tốt hơn, dựa trên hiểu biết về bài toán.

::: example Từ giao dịch thô tới feature tổng hợp
Dữ liệu thô: mỗi dòng là một giao dịch thẻ (thời gian, số tiền, cửa hàng). Model chống gian lận sẽ học tốt hơn nhiều nếu có thêm các **feature tổng hợp** (aggregated feature) cho từng khách hàng:
- Số giao dịch trong 1 giờ qua.
- Số tiền trung bình 30 ngày qua.
- Giao dịch này lớn gấp bao nhiêu lần mức trung bình thường ngày.
- Có phải lần đầu mua ở quốc gia này?
:::

![Trái: giao dịch thô. Phải: feature tổng hợp tính cho từng khách hàng (số giao dịch, tổng tiền trong 24 giờ qua…).](/it/ml/raw-vs-aggregated.webp =1214x536)

Một feature được thiết kế khéo thường giúp model nhiều hơn là đổi sang thuật toán phức tạp hơn.

# Lời nguyền số chiều (Curse of Dimensionality)

Theo lý thuyết, càng nhiều feature thì model càng có nhiều thông tin. Nhưng thực tế, **quá nhiều feature lại làm model tệ đi**.

::: analogy Không gian phình to theo cấp số nhân
Chia mỗi chiều thành 10 ô:
- 1 chiều → 10 ô
- 2 chiều → 100 ô
- 3 chiều → 1.000 ô
- 10 chiều → 10 tỉ ô!

Muốn mỗi ô có ít nhất vài mẫu dữ liệu thì **lượng dữ liệu cần thiết tăng theo cấp số nhân** với số chiều. Dữ liệu có hạn nên càng nhiều chiều thì dữ liệu càng "thưa", model càng dễ học nhầm nhiễu → overfitting.
:::

Hiện tượng này gọi là **[[Curse of Dimensionality]]**. Hai hướng giải quyết:
1. **[[Feature Selection]]** — giữ lại một tập con các feature tốt nhất (feature gốc giữ nguyên ý nghĩa).
2. **[[Giảm chiều|Dimensionality Reduction]] bằng biến đổi** — tạo ra ít feature mới bằng cách kết hợp các feature cũ (ví dụ chiều cao và chiều rộng luôn tăng cùng nhau → gộp thành một feature "kích thước").

![Bản đồ các kỹ thuật: nhánh Feature Selection (chọn bớt feature) và nhánh Dimensionality Reduction (tạo feature mới — tuyến tính như PCA, phi tuyến như t-SNE, UMAP).](/it/ml/dim-reduction-techniques.webp =1043x742)

# Feature Selection — 3 nhóm phương pháp

| Nhóm | Cách làm | Ưu | Nhược |
|---|---|---|---|
| **[[Filter Method]]** | Chấm điểm từng feature bằng thống kê, **không cần model** | Nhanh | Bỏ qua tương tác giữa các feature |
| **[[Wrapper Method]]** | Thử nhiều tập feature, train model để đánh giá từng tập | Chính xác | Rất tốn thời gian |
| **[[Embedded Method]]** | Việc chọn feature diễn ra **ngay trong lúc train** | Cân bằng | Phụ thuộc loại model |

### Filter — lọc nhanh bằng thống kê

- **Missing Value Ratio**: cột thiếu quá nhiều (vượt một ngưỡng chọn trước) mang ít thông tin → bỏ. Thiếu ít thì điền vào (xem bài Chuẩn bị dữ liệu).
- **Low Variance Filter**: cột mà gần như mọi dòng **có cùng giá trị** thì không giúp phân biệt được gì → bỏ.
- **High Correlation Filter**: hai feature tương quan rất mạnh (ví dụ |r| > 0.9) mang thông tin gần như trùng nhau → giữ một. Dùng [[Correlation]] Pearson cho cột số, kiểm định **[[Chi-Square Test]]** cho cột phân loại. Vẽ **heatmap** ma trận tương quan để nhìn nhanh.
- **SelectKBest**: chấm điểm mức liên quan giữa từng feature với target (chi2, f_classif, mutual information) rồi giữ K feature điểm cao nhất.

```python
from sklearn.feature_selection import SelectKBest, chi2
X_new = SelectKBest(chi2, k=20).fit_transform(X, y)   # giữ 20 feature tốt nhất
```

### Wrapper — thử và đánh giá

**Backward Feature Elimination** (loại dần từ trên xuống):
1. Train model với **tất cả n feature**, ghi lại hiệu năng.
2. Lần lượt bỏ từng feature (n lần, mỗi lần train trên n − 1 feature còn lại).
3. Feature nào bỏ đi mà hiệu năng **gần như không đổi** → loại hẳn.
4. Lặp lại tới khi không loại thêm được feature nào.

**Forward Feature Selection** (thêm dần từ dưới lên) — làm ngược lại:
1. Train n model, mỗi model chỉ dùng **một** feature → chọn feature tốt nhất.
2. Lần lượt thử thêm từng feature còn lại, giữ feature làm hiệu năng **tăng nhiều nhất**.
3. Dừng khi thêm vào không còn cải thiện đáng kể.

**[[RFE]]** trong scikit-learn tự động hóa kiểu loại dần này:

```python
from sklearn.feature_selection import RFE
from sklearn.svm import SVR

selector = RFE(SVR(kernel='linear'), n_features_to_select=5, step=1).fit(X, y)
selector.support_   # [True, True, True, True, True, False, False, ...] — feature được giữ
selector.ranking_   # thứ hạng: 1 = được chọn
```

::: warn
Cả Backward lẫn Forward đều phải train model **rất nhiều lần** → chậm với dữ liệu lớn hoặc nhiều feature.
:::

### Embedded — chọn ngay khi train

- **[[L1 Regularization (Lasso)|Lasso Regression]]**: đẩy hệ số của feature vô ích về đúng 0 → tự loại feature.
- **Độ quan trọng từ model cây**: Decision Tree, [[Random Forest]], ExtraTrees có sẵn thuộc tính `feature_importances_` xếp hạng feature.

```python
from sklearn.ensemble import RandomForestRegressor
model = RandomForestRegressor(random_state=1, max_depth=10).fit(X, y)
importances = model.feature_importances_
indices = np.argsort(importances)
plt.barh(range(len(indices)), importances[indices])
plt.yticks(range(len(indices)), [features[i] for i in indices])
plt.xlabel('Relative Importance')
```

![Feature importance từ Random Forest: một feature quan trọng vượt trội so với phần còn lại.](/it/ml/rf-feature-importance.webp =977x552)

- **[[SHAP]]**: đo đóng góp của từng feature vào từng dự đoán (chi tiết ở bài Deployment & XAI).

```python
import shap
explainer = shap.Explainer(model.predict, X)
shap_values = explainer(X)          # trả về đối tượng Explanation
shap.plots.bar(shap_values)         # xếp hạng độ quan trọng trung bình
```

![SHAP bar plot: độ lớn trung bình mà mỗi feature đóng góp vào dự đoán giá nhà.](/it/ml/shap-bar.webp =1004x657)

# Giảm chiều bằng biến đổi

### PCA — tìm các "hướng chính"

[[PCA]] tạo ra các trục mới gọi là **[[Principal Component]]** (thành phần chính):
- Trục thứ nhất đi theo hướng dữ liệu **trải rộng nhất** (variance lớn nhất).
- Trục thứ hai **vuông góc** với trục thứ nhất, theo hướng trải rộng nhiều thứ hai…
- Giữ vài trục đầu là giữ được phần lớn thông tin.

!viz[Một trục xoay quanh tâm dữ liệu; mỗi điểm được chiếu xuống trục (chấm đen). Variance của các điểm chiếu lớn nhất khi trục nằm dọc theo hướng dữ liệu trải rộng nhất — đó là PC1; PC2 vuông góc với nó.](pca)

::: example Chiều cao và chiều rộng
Hai feature "chiều cao" và "chiều rộng" của một vật luôn tăng cùng nhau (tương quan mạnh). PCA tìm ra một trục chéo kiểu "kích thước tổng thể" giữ gần hết thông tin → giảm từ 2 feature xuống 1.
:::

```python
from sklearn.decomposition import PCA
pca = PCA(n_components=2).fit(X)
print(pca.explained_variance_ratio_)   # vd [0.9924, 0.0075] → trục 1 giữ 99.24% thông tin
print(pca.singular_values_)
```

Mẹo: thường chọn số thành phần sao cho giữ được khoảng **95% variance** — `PCA(n_components=0.95)`. PCA đặc biệt hữu ích với dữ liệu rất nhiều chiều như TF-IDF của văn bản hay ảnh.

PCA là phương pháp **tuyến tính**. Muốn bắt quan hệ phi tuyến có thể dùng **Kernel PCA** (`sklearn.decomposition.KernelPCA`).

![Dữ liệu nằm trên các mặt cong (cuộn, xoắn ốc…) — cần phương pháp phi tuyến mới "trải phẳng" ra được.](/it/ml/nonlinear-manifolds.webp =908x820)

### Factor Analysis — gom các feature "cùng nhóm"

**[[Factor Analysis]]** gom các feature thành nhóm: trong cùng một nhóm các feature tương quan mạnh với nhau, còn giữa các nhóm thì tương quan yếu. Mỗi nhóm được đại diện bởi một **nhân tố ẩn** (factor). Ví dụ điểm Toán, Lý, Hóa cùng phản ánh một nhân tố "năng lực tự nhiên".

```python
from sklearn.decomposition import FactorAnalysis
X_transformed = FactorAnalysis(n_components=7, random_state=0).fit_transform(X)
```

### ICA — tách các nguồn độc lập

**[[ICA]]** giống PCA nhưng khác ở mục tiêu: **PCA tìm các thành phần không tương quan**, còn **ICA tìm các thành phần độc lập** thống kê — một điều kiện chặt hơn. Ứng dụng kinh điển là "bài toán bữa tiệc cocktail": tách tiếng của từng người nói từ bản ghi âm có nhiều người nói cùng lúc.

```python
from sklearn.decomposition import FastICA
X_transformed = FastICA(n_components=7, random_state=0, whiten='unit-variance').fit_transform(X)
```

### t-SNE và UMAP — để nhìn dữ liệu

**[[t-SNE]]** là kỹ thuật giảm chiều **phi tuyến**, sinh ra chủ yếu để **trực quan hóa**: nén dữ liệu nhiều chiều xuống 2–3 chiều mà vẫn giữ các điểm "gần nhau" ở không gian gốc thì vẫn gần nhau trên hình. Cách làm: đo độ giống nhau giữa từng cặp điểm ở không gian nhiều chiều và ở không gian ít chiều, rồi chỉnh vị trí các điểm cho hai bên khớp nhau nhất.

!viz[Minh hoạ t-SNE qua các vòng lặp: các điểm bắt đầu ở vị trí ngẫu nhiên rồi dần được kéo lại gần những điểm giống chúng, tạo thành các cụm rõ ràng trên 2D.](tsne)

```python
from sklearn.manifold import TSNE
X_embedded = TSNE(n_components=2, learning_rate='auto', init='random', perplexity=3).fit_transform(X)
```

**[[UMAP]]** có cùng mục đích nhưng thường nhanh hơn và giữ cấu trúc tổng thể tốt hơn.

::: warn
t-SNE/UMAP dùng để **nhìn** cấu trúc cụm, không phải để tạo feature cho model. Khoảng cách giữa các cụm trên hình t-SNE không mang ý nghĩa chính xác.
:::

# Ghi nhớ nhanh
- Feature Engineering tốt thường đáng giá hơn thuật toán phức tạp.
- Quá nhiều feature → dữ liệu thưa → dễ overfitting (Curse of Dimensionality).
- Filter (nhanh, dùng thống kê) · Wrapper (chính xác, chậm: RFE, Forward/Backward) · Embedded (Lasso, feature_importances_).
- PCA: các trục không tương quan, giữ variance lớn nhất (thường giữ ~95%). ICA: các thành phần độc lập. Factor Analysis: gom feature theo nhân tố ẩn.
- t-SNE/UMAP: chỉ để trực quan hóa.

# Thuật ngữ
- **Feature Engineering**: Tạo mới hoặc biến đổi feature từ dữ liệu thô, dựa trên hiểu biết về bài toán, để model dễ học hơn. Một feature thiết kế khéo thường giúp nhiều hơn đổi sang thuật toán phức tạp. Ví dụ: từ cột "ngày giờ giao dịch" tạo ra "giờ trong ngày", "có phải cuối tuần", "số giao dịch trong 1 giờ qua".
- **Curse of Dimensionality**: Lời nguyền số chiều — khi số feature tăng, không gian dữ liệu phình to theo cấp số nhân nên dữ liệu trở nên rất thưa; các điểm đều "xa nhau", khoảng cách mất ý nghĩa và model dễ học nhầm nhiễu. Lượng dữ liệu cần có cũng tăng theo cấp số nhân. Ví dụ: chia mỗi chiều thành 10 ô thì 1 chiều có 10 ô, 10 chiều có 10 tỉ ô cần lấp dữ liệu.
- **Feature Selection**: Chọn ra một tập con các feature hữu ích nhất và bỏ phần còn lại; feature giữ lại vẫn nguyên ý nghĩa gốc nên dễ giải thích. Giúp model nhanh hơn, bớt overfitting. Ví dụ: từ 200 cột thông tin khách hàng chỉ giữ 20 cột ảnh hưởng nhiều nhất tới việc rời bỏ.
- **Filter Method**: Nhóm phương pháp chọn feature bằng điểm thống kê (tương quan, chi-square, mutual information…) mà không cần train model. Rất nhanh nhưng xét từng feature riêng lẻ nên bỏ qua tương tác giữa các feature. Ví dụ: bỏ mọi feature có |tương quan| với target dưới 0,05.
- **Wrapper Method**: Nhóm phương pháp chọn feature bằng cách train model trên nhiều tập feature khác nhau rồi so sánh kết quả. Chính xác vì đánh giá đúng bằng model thật, nhưng rất tốn thời gian. Ví dụ: RFE, Forward Selection, Backward Elimination.
- **Embedded Method**: Nhóm phương pháp mà việc chọn feature diễn ra ngay trong lúc train model, không cần vòng lặp riêng. Cân bằng giữa tốc độ và độ chính xác. Ví dụ: Lasso đẩy hệ số feature vô ích về 0; Random Forest có sẵn `feature_importances_`.
- **Chi-Square Test**: Kiểm định Chi bình phương — kiểm tra hai biến phân loại có liên quan tới nhau không, bằng cách so số lượng quan sát được với số lượng kỳ vọng nếu chúng độc lập. Dùng để chọn feature phân loại liên quan tới target. Ví dụ: "khu vực sinh sống" có liên quan tới "có mua bảo hiểm hay không"?
- **RFE** (Recursive Feature Elimination): Loại feature đệ quy — train model với tất cả feature, bỏ feature kém quan trọng nhất, train lại, lặp tới khi còn đúng số feature mong muốn. Một dạng Wrapper Method có sẵn trong scikit-learn. Ví dụ: `RFE(LogisticRegression(), n_features_to_select=10)`.
- **Principal Component**: Thành phần chính — trục mới do PCA tạo ra, là tổ hợp tuyến tính của các feature gốc. Thành phần thứ nhất theo hướng dữ liệu trải rộng nhất, các thành phần sau vuông góc với nhau và giữ lượng thông tin giảm dần. Ví dụ: "kích thước tổng thể" = 0,7 × chiều cao + 0,7 × chiều rộng.
- **Factor Analysis**: Phân tích nhân tố — giả định các feature quan sát được đều do một số ít "nhân tố ẩn" gây ra, rồi gom những feature tương quan mạnh với nhau vào cùng một nhân tố. Hay dùng trong khảo sát, tâm lý học. Ví dụ: điểm Toán, Lý, Hoá cùng phản ánh một nhân tố ẩn "năng lực tự nhiên".
- **ICA** (Independent Component Analysis): Phân tích thành phần độc lập — tách tín hiệu hỗn hợp thành các nguồn độc lập thống kê với nhau (điều kiện chặt hơn "không tương quan" của PCA). Ví dụ: bài toán bữa tiệc cocktail — từ bản ghi âm nhiều người nói cùng lúc, tách riêng tiếng từng người.
- **t-SNE** (t-distributed Stochastic Neighbor Embedding): Kỹ thuật giảm chiều phi tuyến dùng để trực quan hoá: đặt các điểm dữ liệu nhiều chiều xuống mặt phẳng 2D sao cho điểm nào gần nhau ở không gian gốc thì vẫn gần nhau trên hình. Chỉ dùng để nhìn cụm, không dùng làm feature cho model. Ví dụ: vẽ 70.000 ảnh chữ số MNIST lên 2D thấy rõ 10 cụm số 0–9.
- **UMAP** (Uniform Manifold Approximation and Projection): Kỹ thuật giảm chiều phi tuyến tương tự t-SNE nhưng thường nhanh hơn với dữ liệu lớn và giữ cấu trúc tổng thể (khoảng cách giữa các cụm) tốt hơn. Ví dụ: trực quan hoá hàng triệu tế bào trong dữ liệu sinh học để thấy các nhóm tế bào.
