---
title: Deployment, MLOps & Explainable AI
short: Deployment, MLOps & XAI
icon: 🚢
summary: Model chạy tốt trong notebook mới đi được nửa đường. Bài này nói về chặng còn lại — đóng gói model thành API, container hóa bằng Docker, tự động hóa bằng ML Pipeline và CI/CD, giám sát Data Drift, quản lý phiên bản bằng MLflow — và cách "mở hộp đen" model bằng SHAP.
---

# Mục tiêu
- Biết hành trình đưa model từ notebook ra production
- Hiểu Training-Serving Skew và cách tránh
- Phân biệt các kiểu inference: Online, Batch, Edge
- Phục vụ model bằng FastAPI và đóng gói bằng Docker
- Hiểu ML Pipeline, CI/CD, Data Drift, Concept Drift, Model Registry
- Biết các mức trưởng thành MLOps
- Hiểu vì sao cần Explainable AI và cách SHAP giải thích dự đoán

# Từ notebook đến production

1. **Notebook (Jupyter)**: nghiên cứu, EDA, thử nghiệm nhanh.
2. **Python script**: tách thành code sạch, chia module, có unit test.
3. **REST API**: bọc model thành một dịch vụ web bằng FastAPI hoặc Flask.
4. **Container (Docker)**: đóng gói model cùng toàn bộ môi trường chạy để mang đi đâu cũng chạy được.
5. **Cloud / Edge**: triển khai lên AWS, GCP, Azure, máy chủ nội bộ hoặc thiết bị.

### Training-Serving Skew — lỗi production phổ biến nhất

**[[Training-Serving Skew]]**: lúc train và lúc chạy thật, dữ liệu được **xử lý feature theo hai cách khác nhau** → model nhận đầu vào lạ → dự đoán sai mà không hề báo lỗi.

::: example
Lúc train, cột "thu nhập" được chuẩn hóa bằng mean/std của tập train. Đội backend viết lại bước này trong API nhưng quên chuẩn hóa → model nhận số lớn gấp hàng triệu lần → kết quả vô nghĩa.
:::

**Cách tránh**: dùng **chung một đoạn code** tiền xử lý cho cả train và serving — ví dụ lưu nguyên [[Pipeline]] của scikit-learn, hoặc dùng [[Feature Store]].

### Ba kiểu inference

| Kiểu | Cách chạy | Ví dụ |
|---|---|---|
| **Online (real-time)** | Mỗi request gọi API, cần phản hồi nhanh (< 100 ms) | Gợi ý sản phẩm khi người dùng đang lướt |
| **Batch** | Chạy hàng loạt hàng triệu bản ghi theo lịch | Chấm điểm toàn bộ khách hàng mỗi đêm |
| **Edge / on-device** | Model nhẹ chạy ngay trên điện thoại, thiết bị IoT | Xuất model sang **[[ONNX]]** để chạy trên thiết bị |

# Phục vụ model bằng API

**[[FastAPI]]** — framework Python hiện đại, nhanh, tự sinh trang tài liệu API (Swagger):

```python
from fastapi import FastAPI
import joblib, numpy as np

app = FastAPI()
model = joblib.load('model.pkl')          # model đã train và lưu trước đó

@app.post('/predict')
async def predict(data: dict):
    X = np.array(data['features']).reshape(1, -1)
    return {'prediction': int(model.predict(X)[0])}
```

**Framework chuyên phục vụ model:**
- **BentoML** — đóng gói model + logic phục vụ; hỗ trợ scikit-learn, PyTorch, TensorFlow.
- **TorchServe** — dành cho PyTorch, hỗ trợ A/B testing và canary rollout.
- **TF Serving** — thông lượng cao, có sẵn quản lý phiên bản và gộp request.
- **Triton Inference Server** (NVIDIA) — tối ưu cho GPU, phục vụ nhiều model cùng lúc.

# Container hóa với Docker

**Vì sao cần [[Docker]] cho ML?**
- **Tái lập được**: "chạy được trên máy em" thành "chạy được ở mọi nơi".
- **Cô lập**: không xung đột thư viện hay phiên bản Python giữa các dự án.
- **Di động**: triển khai giống hệt nhau lên bất kỳ cloud, server hay máy local nào.

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY model.pkl app.py .
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Từ Docker tới Kubernetes:**
- **Docker** — chạy một container trên một máy.
- **Docker Compose** — phối hợp nhiều dịch vụ (model + database + cache).
- **[[Kubernetes]]** (K8s) — quản lý hàng trăm container: tự co giãn theo tải, kiểm tra sức khỏe, cập nhật cuốn chiếu không gián đoạn.

# MLOps — vận hành Machine Learning

**[[MLOps]]** là tập hợp quy trình và công cụ để xây hệ thống ML **đáng tin cậy, tự động và được giám sát liên tục** — giống DevOps nhưng cho ML (vì ngoài code còn phải quản lý cả dữ liệu và model).

### ML Pipeline và CI/CD

**[[ML Pipeline]]**: chuỗi tự động từ đầu tới cuối — Thu thập dữ liệu → Tiền xử lý → Train → Đánh giá → Triển khai. Chạy lại cùng pipeline thì ra cùng kết quả (tái lập được).

**[[CI/CD]] cho ML:**
- **CI (Continuous Integration)** — tự động chạy kiểm thử mỗi khi code thay đổi:
  - Unit test cho từng hàm xử lý dữ liệu, tạo feature.
  - Model test: khẳng định độ chính xác trên validation **đạt ngưỡng tối thiểu**.
- **CD (Continuous Delivery)** — tự động triển khai khi mọi kiểm thử đạt:
  - Triển khai lên môi trường **Staging** trước, chạy [[A/B Testing]] rồi mới đưa lên Production.

**Công cụ phổ biến:**
- **DVC** (Data Version Control) — quản lý phiên bản dữ liệu và model giống Git.
- **[[MLflow]]** — theo dõi thí nghiệm, đăng ký model, phục vụ model bằng một lệnh.
- **Kubeflow / Vertex AI Pipelines** — điều phối pipeline trên Kubernetes.
- **GitHub Actions / GitLab CI** — kích hoạt toàn bộ pipeline mỗi lần push code.

### Giám sát model — Data Drift và Concept Drift

Model **xuống cấp dần theo thời gian** vì thế giới thay đổi — gọi là **Model Decay**.

| | **[[Data Drift]]** (Covariate Shift) | **[[Concept Drift]]** |
|---|---|---|
| Cái gì thay đổi | **Phân phối đầu vào X** thay đổi; quan hệ X → Y giữ nguyên | **Chính quan hệ X → Y** thay đổi |
| Ví dụ | Sau chiến dịch marketing, độ tuổi khách hàng trẻ hẳn đi | Kẻ gian đổi thủ đoạn mỗi tháng; COVID-19 làm đảo lộn thị trường nhà đất |
| Phát hiện | So sánh phân phối: PSI (Population Stability Index), kiểm định KS, Jensen-Shannon divergence | Theo dõi hiệu năng (Accuracy, F1) trên dữ liệu mới có nhãn |

**Phản ứng:**
- **Cảnh báo** khi hiệu năng tụt dưới ngưỡng (ví dụ F1 < 0.80).
- **Train lại** theo lịch (hằng tuần) hoặc khi phát hiện drift.
- Công cụ: Evidently AI, WhyLogs, Arize AI, Prometheus + Grafana.

### Theo dõi thí nghiệm và Model Registry với MLflow

Mỗi lần train là một **thí nghiệm**: tham số khác nhau cho kết quả khác nhau. Cần ghi lại: hyperparameter, metric, file model, phiên bản dữ liệu, môi trường.

```python
import mlflow
with mlflow.start_run():
    mlflow.log_param('n_estimators', 100)
    mlflow.log_param('max_depth', 5)
    mlflow.log_metric('f1_score', 0.87)
    mlflow.sklearn.log_model(model, 'random_forest')
```

**[[Model Registry]]** — quản lý vòng đời model:
- **Staging** — model mới train, chờ duyệt và A/B test.
- **Production** — model đang phục vụ người dùng thật.
- **Archived** — model đã nghỉ hưu, giữ lại để kiểm toán, tuân thủ và quay lui.

Lợi ích: so sánh thí nghiệm một cách khoa học; **quay lui về model cũ trong vài phút** nếu model mới gây sự cố.

### Các mức trưởng thành MLOps

| Mức | Đặc điểm |
|---|---|
| **Level 0 — Thủ công** (phổ biến nhất) | Train bằng tay trong notebook, triển khai bằng cách copy file lên server; không quản lý phiên bản dữ liệu/model; khó tái lập thí nghiệm |
| **Level 1 — Tự động hóa ML Pipeline** | Pipeline dữ liệu → train → đánh giá → triển khai chạy theo lịch; có MLflow, quản lý phiên bản model, giám sát cơ bản; tự train lại khi có dữ liệu mới |
| **Level 2 — Tự động hóa CI/CD** (trưởng thành) | Mọi thay đổi code, dữ liệu, cấu hình đều kích hoạt toàn bộ pipeline; A/B testing, canary deployment, tự quay lui khi bất thường; Feature Store tập trung, dữ liệu quản lý bằng DVC, đầy đủ nhật ký kiểm toán |

::: tip Gợi ý cho nhóm nhỏ (dưới 5 kỹ sư)
Bắt đầu ở "Level 0.5": **Git + DVC + MLflow + Docker + GitHub Actions**. Chưa cần Kubernetes — dùng dịch vụ cloud có sẵn (Vertex AI, SageMaker).
:::

# Explainable AI — mở "hộp đen"

Nhiều model mạnh (ensemble, deep learning) là **hộp đen**: đưa dữ liệu vào, nhận kết quả ra, nhưng **không biết vì sao**.

::: example Ngân hàng xét hạn mức tín dụng
Khách xin tăng hạn mức → hệ thống AI chấm điểm 0.3 → **Từ chối**. Lúc này ai cũng có câu hỏi:
- **Khách hàng**: "Sao tôi bị từ chối? Làm sao để được duyệt?"
- **Chủ doanh nghiệp**: "Có tin được quyết định của AI không?"
- **Bộ phận hỗ trợ**: "Trả lời khiếu nại của khách thế nào?"
- **IT & vận hành**: "Giám sát và gỡ lỗi model ra sao?"
- **Data scientist**: "Đây đã là model tốt nhất chưa?"
- **Kiểm toán, cơ quan quản lý**: "Quyết định có công bằng không?"
:::

[[XAI]] giúp: gỡ lỗi dự đoán của model, giải thích cho người dùng cuối, phân tích độ bền vững của model, rút ra luật từ model.

### Shapley Value

**[[Shapley Value]]** là kết quả kinh điển của **lý thuyết trò chơi**: chia "tổng phần thưởng" của một trò chơi hợp tác cho từng người chơi **một cách công bằng**, dựa trên đóng góp trung bình của mỗi người khi tham gia vào mọi nhóm có thể. Do Lloyd Shapley đưa ra năm 1953 (ông nhận giải Nobel Kinh tế năm 2012). Ứng dụng: chia sẻ chi phí, phân tích thị trường, sức mạnh bỏ phiếu — và gần đây là giải thích model ML.

::: analogy
Ba người cùng làm dự án được thưởng 30 triệu. Chia thế nào cho công bằng? Shapley xét mọi thứ tự người tham gia, đo xem mỗi người "thêm vào" bao nhiêu giá trị, rồi lấy trung bình. Trong ML: **"người chơi" là các feature**, **"phần thưởng" là dự đoán** của model.
:::

### SHAP

**[[SHAP]]** áp dụng Shapley Value để giải thích đầu ra của **bất kỳ** model ML nào: với mỗi dự đoán, SHAP cho biết **mỗi feature đẩy kết quả lên hay kéo xuống bao nhiêu** so với mức trung bình.

```python
import shap
explainer = shap.Explainer(model, background_data)   # dữ liệu nền làm mốc so sánh
shap_values = explainer(X)
shap.plots.waterfall(shap_values[0], max_display=14) # giải thích dự đoán của mẫu đầu tiên
shap.plots.bar(shap_values)                           # độ quan trọng trung bình của các feature
```

Biểu đồ **waterfall** đọc như sau: bắt đầu từ giá trị dự đoán trung bình, mỗi thanh là một feature đẩy kết quả lên (đỏ) hoặc kéo xuống (xanh), cộng dồn lại ra đúng dự đoán của mẫu đó. Ví dụ: "thu nhập thấp −0.15, nợ cao −0.10, lịch sử trả nợ tốt +0.05 → điểm 0.3".

!viz[SHAP waterfall cho một căn nhà: bắt đầu từ giá trị dự đoán trung bình, mỗi feature lần lượt đẩy dự đoán lên (đỏ) hoặc kéo xuống (xanh), cộng dồn đúng bằng dự đoán cuối cùng f(x).](shap-waterfall)

Ngoài SHAP còn có **LIME** — giải thích một dự đoán bằng cách xấp xỉ model quanh điểm đó bằng một model đơn giản.

### Vòng đời XAI

XAI không chỉ dùng một lần mà đi theo cả vòng đời model:
- **Train**: gỡ lỗi model, trực quan hóa, chẩn đoán.
- **QA**: đánh giá model, kiểm thử tuân thủ, phân tích nguyên nhân gốc.
- **Triển khai**: duyệt ra mắt, quản lý phát hành, A/B test.
- **Dự đoán**: quyết định có giải thích, hỗ trợ qua API.
- **Giám sát**: theo dõi hiệu năng và **công bằng**, so sánh model, phân tích theo nhóm người dùng → phản hồi ngược lại vòng train.

### Thách thức

- Chưa có giao diện chuẩn chung cho mọi loại model → khó "cắm" bộ giải thích vào mọi nơi.
- Mỗi đối tượng cần kiểu giải thích khác nhau (khách hàng khác kỹ sư khác kiểm toán viên).
- Thuật toán giải thích phụ thuộc vào bài toán, loại model, định dạng dữ liệu.
- Luôn có đánh đổi giữa **khả năng giải thích, hiệu năng, công bằng và quyền riêng tư**.

# Ghi nhớ nhanh
- Notebook → Script → API → Docker → Cloud/Edge.
- Training-Serving Skew: dùng chung code tiền xử lý (Pipeline/Feature Store).
- Online (< 100 ms), Batch (hàng loạt theo lịch), Edge (ONNX trên thiết bị).
- Data Drift: X thay đổi; Concept Drift: quan hệ X → Y thay đổi → giám sát và train lại.
- MLflow: theo dõi thí nghiệm + Model Registry (Staging → Production → Archived).
- SHAP dùng Shapley Value để chia "công lao" dự đoán cho từng feature.

# Thuật ngữ
- **Training-Serving Skew**: Sự lệch giữa cách dữ liệu được xử lý lúc train và lúc chạy thật (serving) — ví dụ hai đoạn code tiền xử lý viết riêng, khác nhau một chút. Model nhận đầu vào "lạ" nên dự đoán sai mà không báo lỗi gì. Cách tránh: dùng chung một pipeline cho cả hai. Ví dụ: lúc train cột thu nhập được chuẩn hoá, còn API khi chạy thật quên chuẩn hoá.
- **Feature Store**: Kho feature dùng chung — nơi định nghĩa, tính toán và lưu feature một lần, rồi cả quá trình train lẫn hệ thống chạy thật cùng lấy từ đó. Đảm bảo nhất quán, tránh Training-Serving Skew và cho các đội tái sử dụng feature. Ví dụ: feature "số giao dịch 24 giờ qua của khách" được tính sẵn và tra cứu trong vài mili giây.
- **ONNX** (Open Neural Network Exchange): Định dạng chuẩn mở để lưu model, giúp xuất model từ nhiều framework (PyTorch, TensorFlow, scikit-learn) và chạy hiệu quả trên nhiều nền tảng, thiết bị mà không cần framework gốc. Ví dụ: train bằng PyTorch, xuất ONNX rồi chạy trên điện thoại hoặc thiết bị IoT.
- **FastAPI**: Framework Python hiện đại để xây REST API: nhanh, viết gọn, tự kiểm tra kiểu dữ liệu đầu vào và tự sinh trang tài liệu API (Swagger). Rất hay dùng để bọc model ML thành dịch vụ web. Ví dụ: endpoint `POST /predict` nhận feature dạng JSON và trả về dự đoán.
- **Docker**: Công cụ đóng gói ứng dụng cùng toàn bộ môi trường chạy (phiên bản Python, thư viện, file model) vào một container, chạy giống hệt nhau trên mọi máy. Giải quyết vấn đề "chạy được trên máy em mà không chạy trên server". Ví dụ: `docker build` tạo image chứa API + model, rồi `docker run` ở bất kỳ đâu.
- **Kubernetes**: Hệ thống điều phối container (K8s) — quản lý hàng trăm container trên nhiều máy: tự tăng/giảm số bản chạy theo tải, tự khởi động lại container lỗi, cập nhật phiên bản mới mà không gián đoạn dịch vụ. Ví dụ: giờ cao điểm tự chạy thêm 10 bản API dự đoán, đêm khuya giảm về 2.
- **MLOps** (Machine Learning Operations): Tập hợp quy trình và công cụ để đưa model ML vào vận hành một cách đáng tin cậy: tự động hoá train và triển khai, quản lý phiên bản dữ liệu và model, giám sát chất lượng liên tục, train lại khi cần. Giống DevOps nhưng thêm phần dữ liệu và model. Ví dụ: mỗi tuần pipeline tự train lại model với dữ liệu mới, kiểm thử rồi triển khai nếu đạt chuẩn.
- **ML Pipeline**: Chuỗi các bước được tự động hoá từ đầu tới cuối: thu thập dữ liệu → tiền xử lý → train → đánh giá → triển khai. Chạy lại cùng pipeline thì ra cùng kết quả (tái lập được), không phụ thuộc thao tác tay. Ví dụ: một pipeline Kubeflow chạy mỗi đêm để cập nhật model gợi ý sản phẩm.
- **CI/CD**: Tích hợp liên tục / Triển khai liên tục — mỗi khi có thay đổi (code, dữ liệu, cấu hình) hệ thống tự chạy kiểm thử (CI), đạt thì tự triển khai (CD). Với ML, kiểm thử gồm cả kiểm tra độ chính xác model không tụt dưới ngưỡng. Ví dụ: push code lên GitHub → GitHub Actions tự train, kiểm tra F1 ≥ 0,85 rồi mới triển khai lên staging.
- **A/B Testing**: Thử nghiệm A/B — chia người dùng thật thành hai nhóm, mỗi nhóm dùng một phiên bản (model cũ và model mới), rồi so sánh kết quả kinh doanh thực tế để quyết định có triển khai rộng không. Ví dụ: 10% người dùng nhận gợi ý từ model mới; nếu tỉ lệ bấm mua cao hơn có ý nghĩa thống kê thì chuyển toàn bộ sang model mới.
- **MLflow**: Nền tảng mã nguồn mở quản lý vòng đời ML: ghi lại mỗi lần train (tham số, metric, file model) để so sánh, đăng ký model vào registry và phục vụ model bằng một lệnh. Ví dụ: xem lại vì sao lần train tuần trước đạt F1 0,87 còn tuần này chỉ 0,82.
- **Data Drift**: Trôi dữ liệu — phân phối dữ liệu đầu vào khi chạy thật thay đổi so với lúc train, dù quy luật X → Y vẫn như cũ; model dần gặp những trường hợp ít được học. Phát hiện bằng cách so sánh phân phối (PSI, kiểm định KS). Ví dụ: sau chiến dịch quảng cáo trên mạng xã hội, khách hàng mới trẻ hơn hẳn trước.
- **Concept Drift**: Trôi khái niệm — chính quy luật giữa đầu vào và đầu ra thay đổi theo thời gian, khiến điều model đã học không còn đúng. Phát hiện bằng cách theo dõi độ chính xác trên dữ liệu mới có nhãn, rồi train lại. Ví dụ: kẻ gian đổi thủ đoạn mỗi tháng; đại dịch làm thói quen mua sắm thay đổi hẳn.
- **Model Registry**: Kho quản lý các phiên bản model và trạng thái vòng đời của chúng: Staging (chờ duyệt), Production (đang phục vụ), Archived (đã nghỉ hưu). Cho biết model nào đang chạy, train từ dữ liệu nào, và quay lui về phiên bản cũ trong vài phút khi có sự cố. Ví dụ: Model Registry của MLflow.
- **Shapley Value**: Giá trị Shapley — cách chia "phần thưởng" của một trò chơi hợp tác cho từng người chơi một cách công bằng: tính đóng góp thêm của mỗi người khi gia nhập vào mọi nhóm có thể, rồi lấy trung bình. Do Lloyd Shapley đưa ra năm 1953. Ví dụ: ba người cùng làm dự án được thưởng 30 triệu, Shapley cho biết mỗi người xứng đáng nhận bao nhiêu.
- **SHAP** (SHapley Additive exPlanations): Phương pháp giải thích dự đoán của bất kỳ model nào bằng Shapley Value: coi mỗi feature là một "người chơi", tính xem feature đó đẩy dự đoán lên hay kéo xuống bao nhiêu so với mức trung bình. Giải thích được từng dự đoán lẫn độ quan trọng chung. Ví dụ: "thu nhập thấp −0,15, nợ cao −0,10, lịch sử trả nợ tốt +0,05 → điểm tín dụng 0,3".
