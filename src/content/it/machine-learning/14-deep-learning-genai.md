---
title: Deep Learning & Generative AI — Tổng quan
short: Deep Learning & GenAI
icon: ✨
summary: Một vòng tham quan thế giới Deep Learning — CNN nhìn ảnh, RNN đọc chuỗi, Transformer với cơ chế Attention — rồi đến Generative AI: GAN, VAE, Diffusion và Large Language Model.
---

# Mục tiêu
- Hiểu vì sao Deep Learning vượt Machine Learning truyền thống khi có nhiều dữ liệu
- Nắm cách CNN nhận diện ảnh và RNN xử lý chuỗi
- Hiểu Self-Attention của Transformer bằng ví dụ đời thường
- Phân biệt AI truyền thống và Generative AI
- So sánh GAN, VAE, Diffusion, Transformer
- Hiểu quy trình Pretraining → Fine-tuning → Prompting của LLM và các vấn đề đạo đức

# Vì sao Deep Learning bùng nổ?

Với Machine Learning truyền thống, khi có thêm dữ liệu thì hiệu năng tăng một chút rồi **chững lại**. Deep Learning thì **tiếp tục tăng** khi dữ liệu và mô hình càng lớn.

!viz[Khi có thêm dữ liệu, thuật toán ML truyền thống chững lại sớm, còn mạng nơ-ron càng lớn càng tiếp tục giỏi lên.](dl-performance)

Một khác biệt quan trọng: ML truyền thống cần con người **tự thiết kế feature** ([[Feature Engineering]]) rồi mới phân loại. Deep Learning **tự học cả feature lẫn việc phân loại** trong cùng một mạng.

![Machine Learning: con người thiết kế feature, model chỉ phân loại. Deep Learning: một mạng làm cả trích feature lẫn phân loại.](/it/ml/ml-vs-dl-pipeline.webp =1600x794)

Ba yếu tố tạo nên bùng nổ: **dữ liệu khổng lồ + sức mạnh tính toán GPU + kiến trúc Transformer**.

| Ứng dụng | Kỹ thuật | Sản phẩm thực tế |
|---|---|---|
| Nhận diện khuôn mặt | CNN | Mở khóa bằng khuôn mặt trên điện thoại, gom ảnh theo người |
| Trợ lý giọng nói | RNN / Transformer | Siri, Google Assistant, Alexa |
| Phụ đề tự động | CNN + Seq2Seq | Phụ đề tự động trên YouTube |
| Chẩn đoán y tế | CNN | Phát hiện bệnh mắt từ ảnh võng mạc |
| Phát hiện gian lận | LSTM | Cảnh báo giao dịch theo thời gian thực |
| Gợi ý | Deep Neural Network | Netflix, Spotify, TikTok |
| Dịch máy | Transformer | Google Translate, DeepL |
| Gợi ý code | LLM | Các trợ lý lập trình AI |
| Sinh ảnh | Diffusion | DALL-E, Midjourney, Stable Diffusion |

# CNN — mạng nơ-ron "nhìn" ảnh

**[[CNN]]** là loại mạng chuyên cho dữ liệu dạng lưới như ảnh. Đầu vào là ảnh (ví dụ ảnh 32×32 điểm, 3 kênh màu), đầu ra là nhãn: máy bay, ô tô, chim, mèo, hươu, chó, ếch, ngựa, tàu, xe tải…

![Ảnh đầu vào thuộc các lớp: máy bay, ô tô, chim, mèo, hươu, chó, ếch, ngựa, tàu, xe tải.](/it/ml/cifar10.webp =716x330)

Đặc điểm:
- Các nơ-ron ẩn được sắp xếp thành **lưới**, giống ảnh đầu vào.
- Lớp này nối sang lớp kia bằng phép **[[Convolution]]** (tích chập): một bộ lọc nhỏ ([[Filter]], ví dụ 3×3) **trượt** khắp ảnh và tính toán ở từng vị trí.

!viz[Bộ lọc 3×3 (phát hiện cạnh dọc) trượt qua từng vị trí trên ảnh 8×8; mỗi vị trí cho ra một ô trong bản đồ đặc trưng. Ô có giá trị lớn nằm đúng chỗ ảnh có nét dọc.](convolution)

- **Xử lý cục bộ**: mỗi nơ-ron chỉ nhìn một vùng nhỏ của ảnh.
- **Dùng chung weight**: cùng một bộ lọc dùng cho mọi vị trí → số tham số **không phụ thuộc kích thước ảnh**, và cùng một mạng xử lý được ảnh nhiều kích thước.
- **[[Translation Invariance]]**: con mèo ở góc ảnh hay ở giữa ảnh thì vẫn là con mèo — bộ lọc phát hiện cạnh ở đâu cũng nhận ra.

![Kiến trúc CNN: các lớp tích chập + ReLU + pooling học đặc trưng (feature learning), cuối cùng là lớp Dense + softmax để phân loại.](/it/ml/cnn-architecture.webp =1347x456)

::: analogy CNN như thám tử ghép manh mối
Ảnh con mèo đi vào:
- **Lớp tích chập 1** → phát hiện **cạnh, đường nét** ( / \ — | )
- **Lớp tích chập 2** → ghép cạnh thành **hình dạng** (vòng tròn, cung, tam giác)
- **Lớp tích chập 3** → ghép hình thành **bộ phận** (mắt, tai, ria, lông)
- **Lớp Dense** → ghép bộ phận thành **khái niệm**
- Đầu ra: **"MÈO"** với độ tin cậy 94%
:::

# RNN — mạng nơ-ron "đọc" chuỗi

Nhiều loại dữ liệu là **chuỗi phụ thuộc nhau** với độ dài thay đổi: câu văn (mô hình ngôn ngữ), chuỗi thời gian (giá cổ phiếu), âm thanh. Thứ tự rất quan trọng: "chó cắn người" khác hẳn "người cắn chó".

**[[RNN]]** đọc chuỗi **từng bước một** và mang theo một "bộ nhớ" (hidden state) từ bước trước sang bước sau.

- **3 loại nút**: nút vào xₜ, nút ẩn hồi quy sₜ (giữ trạng thái — "bộ nhớ" theo thứ tự), nút ra ŷₜ.
- **Weight dùng chung qua mọi bước thời gian**: weight đầu vào W_in, weight hồi quy W_rec, weight đầu ra U.

![RNN "trải" theo thời gian: cùng một khối (cùng weight) lặp lại ở mỗi bước, trạng thái ẩn truyền từ bước trước sang bước sau.](/it/ml/rnn-unfold.webp =1367x385)

::: example "Cà phê nóng quá nên chưa ___ được"
- Mạng thường: nhìn mọi từ cùng lúc, **không có khái niệm thứ tự** → bối rối không biết điền gì.
- RNN: đọc lần lượt "cà phê" → "nóng" → "quá" → "nên chưa"…, bộ nhớ mang theo ý "cà phê" + "nóng" → đoán "**uống**".
:::

!viz[RNN đọc lần lượt từng từ; ở mỗi bước, trạng thái ẩn (các cột tím) được cập nhật từ từ hiện tại và trạng thái trước, rồi truyền sang bước sau — nhờ vậy cuối câu vẫn "nhớ" cà phê và nóng.](rnn)

Ứng dụng: phân tích cảm xúc ("Phim không tệ chút nào" → tích cực), dịch máy, dự đoán chuỗi giá, nhận dạng giọng nói.

**Hạn chế**: RNN hay **quên thông tin ở đầu** khi chuỗi rất dài (gradient bị triệt tiêu dần khi lan ngược qua quá nhiều bước). Các phiên bản cải tiến có "cổng" điều khiển việc nhớ/quên: **[[LSTM]]** và **[[GRU]]**. Về sau, **Transformer** giải quyết triệt để hơn.

# Transformer và Self-Attention

**[[Transformer]]** (bài báo "Attention Is All You Need", Google, 2017) là kiến trúc nền tảng của hầu hết AI hiện đại. Các thành phần chính:

1. **Encoder–Decoder**: encoder đọc hiểu chuỗi đầu vào, decoder sinh chuỗi đầu ra.
2. **[[Self-Attention]]**: cho phép model **nhìn mọi vị trí trong câu cùng một lúc** và quyết định nên "chú ý" vào từ nào.
3. **[[Positional Encoding]]**: vì nhìn mọi từ cùng lúc nên phải cộng thêm thông tin **vị trí** của từng từ.
4. **Feedforward Network**: các lớp Dense biến đổi phi tuyến sau mỗi khối attention.

::: example "it" chỉ cái gì?
Câu: *"The trophy did not fit in the suitcase because **it** was too big."* — "it" là chiếc cúp hay cái vali?

Khi xử lý từ "it", self-attention chấm điểm mọi từ khác:
- trophy: **0.72** ← chú ý nhiều nhất
- suitcase: 0.15
- fit: 0.08
- big: 0.05

→ "it" = **trophy** (chiếc cúp quá to nên không vừa vali).
:::

**Vì sao thắng RNN?** RNN phải "nhớ" qua rất nhiều bước nên hay quên ngữ cảnh xa. Transformer nhìn mọi từ cùng lúc — **khoảng cách giữa các từ không còn là vấn đề** — và tính toán **song song** được nên train nhanh trên GPU. **Multi-head attention** chạy nhiều "đầu" attention song song, mỗi đầu nắm một kiểu quan hệ khác nhau.

Ứng dụng: xử lý ngôn ngữ tự nhiên (GPT, BERT, T5), dịch máy, sinh văn bản, và cả ảnh (Vision Transformer).

# Generative AI — từ phân loại tới sáng tạo

**[[Generative AI]]** là các hệ thống AI **tạo ra dữ liệu mới** giống với dữ liệu đã học: ảnh, văn bản, nhạc, code, video.

| AI truyền thống (Discriminative) | Generative AI |
|---|---|
| Phân loại / dự đoán | **Tạo nội dung mới** |
| "Email này có phải spam?" → Có/Không | "Viết giúp một email trả lời lịch sự" → nội dung email |
| "Con chó này giống gì?" → Labrador | "Vẽ chú golden retriever kiểu hoạt hình" → bức tranh |
| Học P(nhãn \| dữ liệu) | Học P(dữ liệu) → **lấy mẫu** ra dữ liệu mới |

Cách hoạt động: đưa dữ liệu train (ảnh, văn bản…) → model học quy luật, cấu trúc → sinh nội dung mới tương tự → tinh chỉnh dựa trên phản hồi người dùng.

**Các mốc quan trọng:**
- **2014** — GAN ra đời (Ian Goodfellow): generator đấu với discriminator.
- **2017** — Kiến trúc Transformer.
- **2020** — GPT-3 với 175 tỉ tham số, viết văn trôi chảy.
- **2021** — DALL-E, GitHub Copilot: AI sinh ảnh và code.
- **2022** — Stable Diffusion (mã nguồn mở), ChatGPT ra mắt.
- **2023–2024** — Các model đa phương thức (multimodal), sinh video từ văn bản, model mở như LLaMA.

**Ứng dụng:** sáng tạo nội dung (tranh, nhạc, văn), **[[Data Augmentation]]** (làm giàu dữ liệu train), **dữ liệu tổng hợp** (synthetic data), thiết kế sản phẩm 3D, marketing cá nhân hóa, gợi ý sản phẩm, mô phỏng kịch bản gian lận để huấn luyện hệ thống phát hiện, dự báo tài chính, chatbot và trợ lý ảo.

# 4 kỹ thuật GenAI chủ chốt

- **[[GAN]]**: hai mạng **đấu nhau** — **Generator** tạo đồ giả, **Discriminator** cố phân biệt đồ thật và đồ giả. Cả hai cùng giỏi lên. Ứng dụng: sinh ảnh, deepfake. Khó khăn: train kém ổn định, **mode collapse** (chỉ sinh ra vài kiểu na ná nhau).

![GAN: Generator biến nhiễu ngẫu nhiên thành ảnh giả; Discriminator so với ảnh thật trong tập train để phân biệt Real/Fake.](/it/ml/gan.webp =1600x698)

!viz[Phiên bản 1 chiều cho dễ nhìn: phân phối dữ liệu giả của Generator (đỏ) dần dịch về khớp với dữ liệu thật (xanh lá); Discriminator (nét đứt) lúc đầu phân biệt dễ, cuối cùng chỉ còn đoán 50/50.](gan)

- **[[VAE]]**: **Encoder** nén dữ liệu vào một không gian ẩn ([[Latent Space]]), **Decoder** giải nén ra lại; lấy mẫu trong không gian ẩn để sinh dữ liệu mới. Ứng dụng: nén dữ liệu, phát hiện bất thường. Khó khăn: ảnh sinh ra hơi mờ. Họ hàng gần là **[[Autoencoder]]**.

![Autoencoder: Encoder nén ảnh thành mã (code) nhỏ gọn, Decoder dựng lại ảnh từ mã đó.](/it/ml/autoencoder.webp =1600x838)

- **[[Diffusion Model]]**: học cách **khử nhiễu dần dần** — bắt đầu từ nhiễu ngẫu nhiên, gỡ nhiễu từng bước cho tới khi thành ảnh rõ ràng. Ứng dụng: ảnh độ phân giải cao, text-to-image. Khó khăn: tốn tính toán.

![Diffusion: quá trình thuận thêm nhiễu dần cho tới khi ảnh thành nhiễu hoàn toàn; model học quá trình ngược để khử nhiễu từng bước.](/it/ml/diffusion.webp =1600x624)

!viz[Quá trình thuận thêm nhiễu từng bước tới khi ảnh mặt cười thành nhiễu hoàn toàn; model học quá trình ngược để khử nhiễu dần và dựng lại ảnh.](diffusion)

- **Transformer**: dùng attention để xử lý chuỗi. Ứng dụng: sinh văn bản (GPT), hiểu văn bản (BERT), đa phương thức. Khó khăn: model rất lớn, chi phí train cao.

| | GAN | VAE | Diffusion | Transformer |
|---|---|---|---|---|
| Ví von | Kẻ làm giả vs thám tử | Nén rồi dựng lại | Nhà điêu khắc gọt dần khối đá | Phiên dịch viên nhớ hoàn hảo |
| Cơ chế | 2 mạng cạnh tranh | Mã hóa vào latent space rồi giải mã | Thêm nhiễu rồi học gỡ nhiễu | Chú ý tới mọi phần của đầu vào cùng lúc |
| Chất lượng | Sắc nét, chân thực | Hơi mờ | Rất cao | Xuất sắc với văn bản |
| Huấn luyện | Bất ổn định | Ổn định | Chậm | Tốn nhiều bộ nhớ |
| Nổi tiếng với | StyleGAN, deepfake | Phát hiện bất thường | DALL-E 3, Midjourney | GPT, Gemini, Claude, BERT |

**Hiện nay: Diffusion thống trị mảng ảnh; Transformer thống trị văn bản và AI đa phương thức.** Các hệ thống **text-to-image** (DALL-E, Stable Diffusion) kết hợp cả hai: Transformer hiểu câu mô tả, Diffusion vẽ ảnh.

![DALL-E 2: câu mô tả được mã hoá thành embedding, rồi bộ giải mã diffusion vẽ ra ảnh.](/it/ml/dalle2.webp =1200x545)

![Stable Diffusion: text encoder hiểu câu lệnh, quá trình khử nhiễu diễn ra trong latent space, cuối cùng image decoder dựng ra ảnh.](/it/ml/stable-diffusion.webp =1600x486)

# Large Language Model (LLM)

**[[LLM]]** là các model ngôn ngữ cực lớn dựa trên Transformer:
- **Self-attention** để nắm quan hệ giữa các từ; **multi-head attention** để xử lý song song.
- **Encoder** trích xuất ý nghĩa theo ngữ cảnh ([[Embedding]]); **Decoder** sinh ra chuỗi văn bản mạch lạc. (BERT chỉ dùng encoder; GPT chỉ dùng decoder.)

::: analogy Xây một LLM giống đào tạo một bác sĩ
| [[Pretraining]] | [[Fine-tuning]] | [[Prompting]] |
|---|---|---|
| Trường y | Nội trú | Khám bệnh hằng ngày |
| Nhiều năm, rất tốn kém | Vài tuần, chuyên sâu | Vài giây, gần như miễn phí |
| Đọc mọi sách vở từng được viết | Thực hành ca bệnh thật | Trả lời câu hỏi cụ thể của bệnh nhân |
| → Kiến thức tổng quát | → Chuyên môn một lĩnh vực | → Hoàn thành tác vụ |
:::

Có hai nhóm LLM: **model đóng** (chỉ dùng qua API — dòng GPT, Gemini, Claude) và **model mở** (tải về dùng và tinh chỉnh tự do — dòng LLaMA, Qwen…). Mỗi model mạnh ở mặt khác nhau: đa năng/đa phương thức, ngữ cảnh dài, suy luận, an toàn, đa ngôn ngữ, lập trình.

**Ứng dụng của LLM và hệ thống nhiều [[agent|AI Agent]]:**
- Sinh văn bản: viết bài, blog, kịch bản, truyện.
- AI hội thoại: chatbot, trợ lý ảo, chăm sóc khách hàng, tương tác cá nhân hóa.
- Phân tích dữ liệu và NLP: phân tích cảm xúc, trích xuất chủ đề, tóm tắt, dịch thuật.
- Hỗ trợ lập trình: sinh code, gợi ý sửa lỗi, viết tài liệu và giải thích code.
- Đa phương thức: kết hợp văn bản với ảnh/âm thanh, sinh ảnh từ văn bản, viết kịch bản video.

# Đạo đức và xu hướng

**Vấn đề đạo đức:**
- **Deepfake** — dùng để lan truyền tin giả.
- **Quyền riêng tư** — khai thác dữ liệu người dùng.
- **Thiên lệch và công bằng** — model học cả định kiến có sẵn trong dữ liệu.
- **Minh bạch** — khó hiểu vì sao AI ra quyết định.
- **Sở hữu trí tuệ** — nội dung AI tạo ra thuộc về ai?

**Xu hướng:**
- **Model đa phương thức** (multimodal): văn bản, ảnh, âm thanh, video trong cùng một model → tìm kiếm chéo, nội dung tương tác. Thách thức: căn chỉnh dữ liệu giữa các dạng, độ phức tạp.
- **AI đồng sáng tác**: AI là cộng sự trong nghệ thuật, âm nhạc, sản xuất nội dung → đặt lại câu hỏi về quyền tác giả.
- **Ứng dụng thời gian thực**: NPC trong game biết hội thoại, thế giới ảo tự sinh.
- **Khung đạo đức AI**: nghiên cứu an toàn AI, công cụ kiểm toán AI, giảm thiên lệch, minh bạch, trách nhiệm giải trình.

# Ghi nhớ nhanh
- Deep Learning tự học feature và tiếp tục giỏi lên khi có thêm dữ liệu.
- CNN: bộ lọc trượt trên ảnh, học từ cạnh → hình → bộ phận → vật thể.
- RNN: đọc chuỗi từng bước, có bộ nhớ, nhưng hay quên chuỗi dài → LSTM/GRU → Transformer.
- Transformer: Self-Attention nhìn mọi từ cùng lúc + Positional Encoding.
- GAN (2 mạng đấu nhau), VAE (nén–giải nén), Diffusion (khử nhiễu dần), Transformer (attention).
- LLM: Pretraining (kiến thức chung) → Fine-tuning (chuyên môn) → Prompting (dùng).

# Thuật ngữ
- **CNN** (Convolutional Neural Network): Mạng nơ-ron tích chập — chuyên xử lý dữ liệu dạng lưới như ảnh. Dùng các bộ lọc nhỏ trượt khắp ảnh để học đặc trưng từ đơn giản (cạnh, nét) tới phức tạp (mắt, mặt), với ít tham số hơn nhiều so với mạng thường. Ví dụ: nhận diện khuôn mặt, đọc biển số xe, phát hiện khối u trên ảnh X-quang.
- **Convolution**: Tích chập — phép trượt một bộ lọc nhỏ (ví dụ 3×3) qua từng vị trí trên ảnh; ở mỗi vị trí nhân từng ô của bộ lọc với điểm ảnh tương ứng rồi cộng lại, tạo ra một "bản đồ đặc trưng" cho biết chỗ nào trong ảnh có đặc điểm mà bộ lọc tìm. Ví dụ: bộ lọc phát hiện cạnh dọc cho giá trị cao ở những chỗ có đường thẳng đứng.
- **Filter**: Bộ lọc (kernel) — ma trận weight nhỏ trong CNN, mỗi bộ lọc học cách phát hiện một kiểu đặc trưng; một lớp tích chập thường có hàng chục tới hàng trăm bộ lọc. Weight của bộ lọc được học từ dữ liệu, không do người đặt. Ví dụ: lớp đầu có bộ lọc phát hiện cạnh ngang, cạnh dọc, vùng màu đỏ…
- **Translation Invariance**: Bất biến tịnh tiến — khả năng nhận ra cùng một vật dù nó xuất hiện ở vị trí nào trong ảnh. CNN có được tính chất này nhờ dùng cùng một bộ lọc cho mọi vị trí. Ví dụ: con mèo ở góc trái hay ở chính giữa ảnh đều được nhận là mèo.
- **RNN** (Recurrent Neural Network): Mạng nơ-ron hồi quy — xử lý dữ liệu dạng chuỗi từng bước một, mỗi bước nhận đầu vào mới cùng "bộ nhớ" (trạng thái ẩn) từ bước trước, dùng chung weight cho mọi bước. Nhờ vậy nắm được thứ tự, nhưng hay quên thông tin ở xa. Ví dụ: đọc câu từng từ để đoán từ tiếp theo, dự báo chuỗi giá theo ngày.
- **LSTM** (Long Short-Term Memory): Biến thể của RNN có các "cổng" (quên, nhập, xuất) quyết định thông tin nào cần giữ lâu, thông tin nào bỏ đi, nên nhớ được phụ thuộc xa hơn hẳn RNN thường. Từng là kiến trúc chuẩn cho chuỗi trước khi Transformer phổ biến. Ví dụ: phát hiện giao dịch gian lận dựa trên chuỗi hành vi dài của khách.
- **GRU** (Gated Recurrent Unit): Biến thể RNN có cổng, đơn giản hơn LSTM (ít cổng, ít tham số) nên train nhanh hơn mà hiệu quả thường tương đương. Ví dụ: dự đoán từ tiếp theo trên bàn phím điện thoại.
- **Transformer**: Kiến trúc mạng (2017) dựa hoàn toàn vào cơ chế attention thay vì đọc tuần tự như RNN: nhìn mọi phần tử của chuỗi cùng lúc, nên nắm được quan hệ xa và train song song rất nhanh trên GPU. Là nền tảng của hầu hết AI hiện đại. Ví dụ: GPT, BERT, Google Translate, Vision Transformer.
- **Self-Attention**: Cơ chế cho mỗi từ trong câu "nhìn" mọi từ khác và chấm điểm mức liên quan, rồi tổng hợp thông tin theo các điểm đó để hiểu từ đang xét trong ngữ cảnh. Ví dụ: trong "The trophy did not fit in the suitcase because it was too big", khi xử lý "it" mô hình chú ý nhiều nhất vào "trophy".
- **Positional Encoding**: Thông tin vị trí được cộng thêm vào biểu diễn của từng từ. Vì Transformer xử lý mọi từ cùng lúc nên không tự biết thứ tự; thiếu thông tin này thì "chó cắn người" và "người cắn chó" trông như nhau. Ví dụ: cộng một vector đặc trưng cho "vị trí thứ 3" vào embedding của từ thứ 3.
- **Generative AI**: AI tạo sinh — hệ thống tạo ra nội dung mới (văn bản, ảnh, âm thanh, video, code) giống với dữ liệu đã học, thay vì chỉ phân loại hay dự đoán một con số. Học phân phối của dữ liệu rồi lấy mẫu từ đó. Ví dụ: ChatGPT viết email, Midjourney vẽ tranh từ câu mô tả.
- **Data Augmentation**: Tăng cường dữ liệu — tạo thêm mẫu train bằng cách biến đổi dữ liệu sẵn có (xoay, lật, cắt, đổi màu ảnh; thay từ đồng nghĩa trong câu) hoặc sinh dữ liệu mới. Giúp model gặp đa dạng hơn và bớt overfitting khi dữ liệu ít. Ví dụ: từ 1 ảnh mèo tạo thêm 10 ảnh xoay và lật khác nhau.
- **GAN** (Generative Adversarial Network): Mạng đối kháng tạo sinh — hai mạng thi đấu: Generator cố tạo dữ liệu giả thật giống, Discriminator cố phân biệt thật/giả. Cả hai cùng giỏi lên tới khi đồ giả khó phân biệt. Ảnh sắc nét nhưng train khó ổn định. Ví dụ: StyleGAN tạo ảnh khuôn mặt người không có thật.
- **VAE** (Variational Autoencoder): Model sinh dữ liệu: Encoder nén dữ liệu vào một không gian ẩn có dạng phân phối xác suất, Decoder giải nén ngược lại; lấy một điểm ngẫu nhiên trong không gian ẩn rồi giải mã là ra dữ liệu mới. Train ổn định nhưng ảnh sinh ra hơi mờ. Ví dụ: sinh chữ số viết tay mới, phát hiện bất thường.
- **Latent Space**: Không gian ẩn — không gian ít chiều chứa biểu diễn nén của dữ liệu, nơi những thứ giống nhau nằm gần nhau. Di chuyển trong không gian này làm dữ liệu sinh ra thay đổi dần dần. Ví dụ: đi dần từ điểm "mặt cười" sang điểm "mặt nghiêm" trong latent space của ảnh khuôn mặt.
- **Autoencoder**: Mạng nơ-ron học nén dữ liệu thành một mã nhỏ (encoder) rồi tái tạo lại gần đúng bản gốc (decoder). Phần mã ở giữa buộc phải giữ thông tin quan trọng nhất. Dùng để giảm chiều, khử nhiễu, phát hiện bất thường (mẫu lạ thì tái tạo kém). Ví dụ: nén ảnh 784 điểm xuống mã 32 số rồi dựng lại.
- **Diffusion Model**: Model sinh dữ liệu bằng cách học đảo ngược quá trình thêm nhiễu: lúc train, ảnh bị thêm nhiễu dần tới khi thành nhiễu hoàn toàn và model học cách gỡ từng bước; lúc sinh thì bắt đầu từ nhiễu ngẫu nhiên và khử nhiễu dần thành ảnh. Chất lượng rất cao nhưng chậm. Ví dụ: Stable Diffusion, DALL-E 3, Midjourney.
- **LLM** (Large Language Model): Mô hình ngôn ngữ cực lớn dựa trên Transformer, có hàng tỉ tham số, được train trên lượng văn bản khổng lồ để đoán từ tiếp theo; nhờ quy mô đó mà biết trả lời câu hỏi, viết, dịch, tóm tắt, lập trình. Ví dụ: GPT, Gemini, Claude, LLaMA.
- **Embedding**: Vector số biểu diễn ý nghĩa của một từ, câu, ảnh hay đối tượng bất kỳ, sao cho những thứ có nghĩa gần nhau thì vector gần nhau. Là cách để máy "hiểu" dữ liệu không phải số. Ví dụ: embedding của "vua" − "đàn ông" + "phụ nữ" gần với embedding của "nữ hoàng".
- **Pretraining**: Huấn luyện trước — train model trên lượng dữ liệu khổng lồ và đa dạng (thường không cần nhãn, ví dụ đoán từ tiếp theo) để có kiến thức tổng quát. Rất tốn kém, thường chỉ các công ty lớn làm. Ví dụ: train LLM trên hàng nghìn tỉ từ văn bản từ internet và sách.
- **Fine-tuning**: Tinh chỉnh — train tiếp một model đã pretrain trên lượng dữ liệu nhỏ hơn, chuyên ngành hơn, để nó giỏi một việc cụ thể. Rẻ và nhanh hơn rất nhiều so với train từ đầu. Ví dụ: fine-tune một LLM trên hồ sơ y khoa để trả lời câu hỏi chuyên ngành.
- **Prompting**: Viết câu lệnh đầu vào (prompt) để điều khiển LLM làm đúng việc mong muốn, không cần train thêm. Cách viết prompt (giao vai trò, đưa ví dụ mẫu, mô tả rõ định dạng đầu ra) ảnh hưởng lớn tới chất lượng câu trả lời. Ví dụ: "Bạn là giáo viên. Giải thích overfitting cho học sinh lớp 10 trong 3 câu."
- **AI Agent**: Hệ thống AI (thường dựa trên LLM) tự lập kế hoạch, gọi công cụ (tìm kiếm, chạy code, gọi API) và thực hiện nhiều bước để hoàn thành một nhiệm vụ, thay vì chỉ trả lời một câu. Nhiều agent có thể phối hợp, mỗi agent lo một phần việc. Ví dụ: agent đặt vé tự tìm chuyến bay, so giá rồi điền thông tin đặt chỗ.
