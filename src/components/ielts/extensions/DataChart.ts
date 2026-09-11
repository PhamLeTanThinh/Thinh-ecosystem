import { Node, mergeAttributes } from '@tiptap/core'

// Biểu đồ tĩnh (line/bar/pie-đôi) vẽ bằng SVG thuần, dựng lại số liệu đọc từ ảnh chụp sách — không
// phải ảnh chụp, để co giãn đúng theo chiều rộng trang và giữ đúng màu hệ thống. Dữ liệu mã hoá
// base64(JSON) trong 1 attribute duy nhất để tránh escape dấu ngoặc kép trong thuộc tính HTML.
type Series = { name: string; color: string; values: number[] }
// yMin tuỳ chọn — cho các chart trục bị "cắt cụt" (không bắt đầu từ 0, vd trục 80–87%) để phóng to
// đúng chênh lệch nhỏ như sách in, thay vì ép về 0 khiến các cột gần như cao bằng nhau.
type LineBarData = { categories: string[]; series: Series[]; unit?: string; yMin?: number }
type PieSlice = { name: string; color: string; values: number[] }
type PieData = { labels: string[]; slices: PieSlice[] }
type DualSeries = { name: string; color: string; unit?: string; values: number[]; yMin?: number }
// Chart 2 trục Y độc lập (vd % thất nghiệp bên trái, số người bên phải) — vẽ chung 1 vùng plot,
// mỗi đường tự co giãn theo thang riêng của nó thay vì ép chung 1 thang (vô nghĩa vì đơn vị khác).
type DualAxisData = { categories: string[]; left: DualSeries; right: DualSeries }
type ProcessStep = { icon: string; label: string }
// Sơ đồ quy trình dạng zigzag (như sách in) — icon emoji thay cho hình vẽ tay minh hoạ (không khả
// thi vẽ lại chi tiết bằng SVG path), đánh số theo đúng thứ tự bước, mũi tên nối theo hình chữ Z.
type ProcessLinearData = { steps: ProcessStep[]; cols?: number }
// Sơ đồ vòng đời dạng tròn — các bước xếp đều quanh 1 vòng tròn, nối bằng cung mũi tên, có thể ghi
// thời lượng giữa các bước (durations[i] = thời gian từ bước i sang bước i+1).
type ProcessCircularData = { steps: ProcessStep[]; durations?: string[]; centerLabel?: string }
// Sơ đồ bản đồ (Lesson 14 — Map) — mỗi "panel" là 1 khung bản đồ con (vd "1980" / "Now", "Before" /
// "After"), vẽ dạng sơ đồ mặt bằng đơn giản: zone (vùng chức năng, hình chữ nhật có nhãn), path
// (đường/lối đi), icon (điểm đánh dấu nhỏ), la bàn, thanh tỉ lệ — không vẽ chi tiết như tranh minh
// hoạ gốc, chỉ giữ đúng cấu trúc/vị trí tương đối để đọc hiểu & làm bài luyện tập.
type MapZone = { x: number; y: number; w: number; h: number; label: string; color?: string }
// curve: true vẽ qua các điểm bằng đường cong mượt (đường/lối đi trong sách hầu như không thẳng
// tuyệt đối) thay vì polyline gãy khúc. style 'river' vẽ dải xanh dày để đọc rõ là dòng sông.
type MapPathSeg = { points: [number, number][]; style?: 'road' | 'track' | 'path' | 'river'; label?: string; curve?: boolean }
// Đường vành đai hình oval (vd ring road bao quanh khu trung tâm) — không biểu diễn được bằng dãy
// điểm thẳng nên tách riêng thành 1 loại path khác, vẽ bằng <ellipse>.
type MapRing = { cx: number; cy: number; rx: number; ry: number; label?: string }
type MapIcon = { x: number; y: number; icon: string; label?: string; scale?: number }
// panelShape thay panel nền hình chữ nhật mặc định bằng 1 polygon tuỳ ý (vd hình đảo bất định) —
// nền ngoài polygon vẫn là màu "biển" của rect gốc, polygon vẽ đè lên như 1 vùng đất riêng.
type MapPanel = {
  title: string
  w: number
  h: number
  zones: MapZone[]
  paths?: MapPathSeg[]
  rings?: MapRing[]
  icons?: MapIcon[]
  compass?: boolean
  scaleLabel?: string
  panelShape?: { points: [number, number][]; fill: string }
  bgColor?: string
}
type MapDiagramData = { panels: MapPanel[] }

// Sơ đồ luồng (box → mũi tên → box, có thể rẽ nhánh rồi hội tụ lại) — dùng cho các sơ đồ khái niệm
// (không phải số liệu) như "quy trình học kỹ năng mới", "cách phân loại câu hỏi rồi chọn cấu trúc
// trả lời". Nhiều "lane" (hàng) xếp chồng cho các sơ đồ có 2+ luồng song song (vd tiêu chí A ảnh
// hưởng tiêu chí B, và tiêu chí C ảnh hưởng tiêu chí D, vẽ thành 2 hàng riêng trong cùng 1 hình).
// "deepen" — triển khai CHIỀU DỌC: 1 box chính (cùng cỡ/màu box thường, thẳng hàng ngang với các
// box khác trong lane) + 1 box phụ nhỏ hơn nối bằng mũi tên DỌC nét liền ngay bên dưới — khác với
// "split" (nét đứt, các nhánh ngang hàng nhau, dùng cho lựa chọn/rẽ nhánh) vì đây là ĐÀO SÂU thêm ý
// của CÙNG 1 Linear Tool, không phải các lựa chọn khác nhau.
// highlights/subHighlights (tuỳ chọn) — tô đậm ĐÚNG cụm từ vừa thay/thêm ngay trong câu, giống cách
// sách tô đỏ (vd "many interesting forms" → "a whole lot of" khi so sánh 2 cách áp dụng idiomatic
// language) — dùng chung cơ chế tokenize/wrap/render với compareHighlight (xem bên dưới).
// tag (tuỳ chọn, box) — 1 badge xám nhỏ đè lên góc phải box (vd "suffixing" gắn thêm vào box
// "Expansion" cuối 1 chuỗi) — khác branchLabel/arrowLabel vì đây là thuộc tính CỦA box đó, không
// phải chú thích trên mũi tên.
type FlowNode =
  | { type: 'box'; text: string; arrowLabel?: string; belowLabel?: string; highlights?: string[]; tag?: string; pill?: string }
  | { type: 'split'; branches: string[]; arrowLabel?: string }
  | { type: 'deepen'; text: string; subText: string; arrowLabel?: string; highlights?: string[]; subHighlights?: string[] }
// laneLabels (tuỳ chọn, song song với lanes) — in 1 dòng tiêu đề (vd "Introduction"/"Main
// discussion") ngay TRÊN lane đó để phân nhóm — thêm dạng mảng riêng thay vì đổi hẳn cấu trúc lanes
// thành {label, nodes}[] để KHÔNG phá vỡ mọi chart flowChain cũ đã lưu (chỉ truyền lanes, không có
// laneLabels vẫn chạy y hệt trước đây).
// lanePills — bản thay thế "đậm" hơn cho laneLabels (pill nền hồng đặc + badge thời gian phía trên,
// giống đúng "(30s)"/"(45s)" trong sách Lesson 7 Part 2) — thêm mảng song song riêng thay vì đổi hẳn
// laneLabels để KHÔNG phá vỡ các chart cũ chỉ dùng laneLabels dạng chữ thường (Lesson 6/7 khác).
// dashedArrows (tuỳ chọn, áp dụng cho CẢ chart) — sách Lesson 7 Part 2 vẽ mũi tên nét đứt (khác mũi
// tên liền nét mặc định của Part 1 framework) nên thêm cờ bật riêng cho từng chart thay vì đổi mặc
// định chung, tránh ảnh hưởng các flowChain khác đã dùng mũi tên liền.
// laneTrailingNote (song song với lanes) — chú thích ngắn in THẲNG sau box cuối cùng của lane, không
// nối mũi tên (vd "X2 - X3" sau box "SV | SV" ở lane Short cues).
type FlowChainData = {
  lanes: FlowNode[][]
  laneLabels?: (string | undefined)[]
  lanePills?: ({ text: string; time?: string } | undefined)[]
  dashedArrows?: boolean
  laneTrailingNote?: (string | undefined)[]
}

// Sơ đồ "Direct Response" riêng cho Speaking Lesson 1 — sao lại ĐÚNG bảng màu + bố cục trong sách
// gốc (nền hồng, box "?" đen, pill đỏ mận, badge số viền đen) thay vì bảng màu xanh lá mặc định
// của flowChain, vì ảnh chụp sách có phong cách riêng cho đúng 2 sơ đồ này.
type DRStepsData = { qLabel: string; topLabels: [string, string]; answerLabel: string; elaborateLabel: string }
type DRRow =
  | { kind: 'desc'; text: string }
  | { kind: 'plain'; text: string }
  | { kind: 'labeled'; label: string; text: string }
  | { kind: 'icon'; icon: 'up' | 'down'; text: string }
type DRColumn = { title: string; rows: DRRow[] }
// headerLabel bỏ trống = không vẽ thanh tiêu đề đỏ phía trên (dùng cho biến thể không có header như
// "Level 3: Self — Facts and Habits", chỉ có box "A?" trỏ thẳng vào hàng tiêu đề cột).
type DRTypesData = { qLabel?: string; headerLabel?: string; columns: DRColumn[] }

// Mỗi hàng: [nhãn loại câu hỏi] [câu hỏi ví dụ] --(nhãn "Direct response")--> [box viền rose: câu
// trả lời] — dùng cho "Level 3: Self — Preferences".
type DRRowItem = { typeLabel: string; question: string; answer: string }
type DRRowsData = { rows: DRRowItem[] }

// Danh sách tầng nối bằng đường chấm dọc + chấm tròn đỏ (vd "4. Specific approach" — Level 1/2/3),
// mỗi tầng có nhãn in hoa + 1 hàng pill xám liệt kê các nhánh con.
type TierItem = { label: string; items: string[] }
type TierListData = { tiers: TierItem[] }

// Nhiều cột độc lập cạnh nhau, mỗi cột 1 tiêu đề pill + danh sách box xếp chồng, box có thể gắn
// badge tròn +/− (xanh lá = tán thành/mức độ cao, rose = phủ định/mức độ thấp) — vd "Level 1:
// Society — Opinion" (2 cột: DO YOU THINK A? / WHAT DO YOU THINK?, chỉ cột 2 có badge).
type BadgeColItem = { badge?: '+' | '-'; text: string }
type BadgeColumn = { header: string; items: BadgeColItem[] }
type BadgeColumnsData = { columns: BadgeColumn[] }

// Sơ đồ "cue card thật" (1 khung duy nhất, các dòng xếp chồng) + pill hồng đặc chú thích từng CỤM
// dòng bên phải (vd "Topic" / "3 short cues" / "1 main question") nối bằng dấu ngoặc vuông — khác
// hẳn badgeColumns (nhiều cột ngang bằng nhau) vì sách thật chỉ có 1 cue card, các nhãn chỉ TRỎ VÀO
// từng phần của cùng 1 khối chữ chứ không phải 3 cột độc lập.
type CueLine = { text: string; indent?: boolean }
type CueFormatGroup = { tag: string; lines: CueLine[] }
type CueFormatTableData = { groups: CueFormatGroup[] }

// Nhiều "row" xếp CHỒNG, mỗi row gồm 2+ CỘT cạnh nhau — mỗi cột là 1 pill nhãn màu (rose/green) +
// 1 khung nét đứt bên dưới chứa 1 mảnh câu — dùng để so sánh vài CÁCH DIỄN ĐẠT khác nhau cho cùng 1
// câu, đặt song song để thấy ngay điểm khác biệt (vd "Tư duy cũ vs Tư duy mới": mệnh đề phụ đứng
// trước hay câu chính đứng trước). Khác exampleWalk ở chỗ đây là so sánh NGANG (cột kề cột), không
// phải danh sách dọc theo chủ ngữ. verdict (tuỳ chọn) in dưới mỗi row — ✗/✓ kèm lý do ngắn.
type PairFlowItem = { header: string; text: string; color: 'rose' | 'green' }
// sectionLabel (tuỳ chọn) — in 1 dòng tiêu đề đậm ngay TRÊN row này, dùng để phân nhóm rõ ràng (vd
// "TƯ DUY CŨ" cho 2 row đầu, "TƯ DUY MỚI CỦA DOL" cho row cuối) — thiếu label này người xem không
// biết row nào thuộc nhóm nào (bug đã gặp: 3 row liền nhau trông như cùng 1 nhóm).
type PairFlowRow = { sectionLabel?: string; items: PairFlowItem[]; verdict?: string; verdictOk?: boolean }
type PairFlowData = { rows: PairFlowRow[] }

// Sơ đồ "phương pháp tổng quát" riêng cho 1 trang duy nhất (Speaking Lesson 5) — 1 chuỗi ngang N box
// (nối bằng đường thẳng, KHÔNG mũi tên, đúng kiểu sách vẽ khung công thức), 1 box trong chuỗi (thường
// là "connector") có nhánh đứt nét đi XUỐNG tới 1 box phụ ("relationships": liệt kê các loại quan hệ
// có thể chọn), rồi từ box phụ đó có nhánh đứt nét đi tiếp lên 1 box khác trong chuỗi (thường là
// "suffixing phrase") — thể hiện 1 lựa chọn (loại quan hệ) chi phối CẢ 2 điểm trong câu, không phải
// chuỗi tuyến tính đơn thuần nên không tái dùng được flowChain.
type MethodChainBox = { tag?: string; text: string }
type MethodBranchItem = { text: string; emphasis?: boolean }
type MethodDiagramData = {
  chain: MethodChainBox[]
  branchFromIndex: number
  branchLabel: string
  branchItems: MethodBranchItem[]
  branchToIndex: number
}

// Bảng lưới 3-4 CỘT (SV chính | connector | SV phụ | suffixing) đúng bố cục sách cho các trang liệt
// kê nhiều biến thể connector của CÙNG 1 câu chính (vd "Nhóm cấu trúc tăng/giảm Degree" — Contrast,
// Exception...) — cột "SV (chính)" GỘP thành 1 khung cao xuyên suốt mọi row (vì luôn cùng 1 câu),
// cột connector/SV phụ mỗi cái 1 khung riêng theo từng row, cột suffixing tự gộp thành 1 khung nếu
// mọi row cùng chung 1 giá trị (vd Exception: cả 2 row đều "though (of course)") hoặc tách riêng nếu
// khác nhau (vd Self-correction: mỗi row 1 suffixing khác nhau) — tự động theo dữ liệu, không cần cờ
// riêng. Cột suffixing cũng tự ẩn hẳn nếu group không có suffixing nào (Contrast/Concession/Outcome).
// Khác stemReference (label trái + box phải, 1 cột) ở chỗ đây là lưới nhiều cột song song thật sự,
// cần khi có ≥3 mảnh câu tương ứng theo hàng ngang, không gộp lại thành text 1 cột được vì sẽ mất hẳn
// cấu trúc "song song" mà sách cố tình trình bày.
type ConnectorGridRow = { connector: string; svPhu: string; suffixing?: string }
type ConnectorGridGroup = { title: string; svChinh: string; phuLabel?: string; rows: ConnectorGridRow[] }
type ConnectorGridData = { groups: ConnectorGridGroup[] }

// Chuỗi box ngang có "umbrella" (label chung, vd "SV chính"/"SV phụ") trùm lên 1 CỤM box liên tiếp,
// cộng thêm nhãn "CHUNKING" (tuỳ chọn từng box) nối bằng mũi tên đứt nét đi LÊN từ dưới box — đúng
// bố cục "LINH HOẠT LINEAR TOOLS THEO FRAMEWORK" (Speaking Lesson 6): direct response -- PAUSE -->
// [SV chính: marker/pattern/idea] --> [SV phụ: connector/SV/suffixing] -- PAUSE. Khác flowChain ở
// chỗ có thêm 1 tầng umbrella phía trên 1 nhóm box, và annotation CHUNKING phía dưới — flowChain
// (box/split/deepen) không có khái niệm "nhóm box dùng chung 1 nhãn trên đầu".
type GroupedChainBox = { text: string; chunking?: boolean; tag?: string }
type GroupedChainGroup = { label?: string; boxes: GroupedChainBox[]; pauseAfter?: boolean }
// band (tuỳ chọn) — nền hồng nhạt phủ phía sau 1 dải group liên tiếp (từ groupFrom tới hết) + 1 dòng
// ghi chú bên dưới cùng, giống sách hay đóng khung cả cụm Expansion trong 1 nền màu riêng kèm ghi
// chú "linh hoạt dùng các Linear Tools" — khác umbrella (chỉ viền, không nền) vì đây phủ nền LIÊN
// TỤC qua nhiều group cùng lúc, không phải 1 khung riêng cho từng group.
type GroupedChainData = { groups: GroupedChainGroup[]; band?: { fromGroupIndex: number; note: string } }

// Khung nhỏ liệt kê vài cặp [nhãn]: [giá trị] trên CÙNG 1 dòng, không header màu, không viền dày —
// dùng cho các bảng sự thật cực ngắn (vd "Cue card: Personal experiences") mà stemReference (luôn
// có header bar + padding lớn) vẽ ra to hơn hẳn so với lượng nội dung thật sự có.
// bullets (tuỳ chọn) — 1 vài hàng cần thêm vài dòng con thụt lề dưới giá trị chính (vd hàng
// "Questions:" ở Lesson 8 có 2 bullet "Follow up questions.../Clarify questions...") thay vì nhét
// hết vào 1 dòng value dài.
type MiniFactRow = { label: string; value: string; bullets?: string[] }
type MiniFactsData = { rows: MiniFactRow[] }

// N "thẻ" xếp lưới 2 cột (đúng bố cục sách cho cue card mẫu: PLACE/PERSON/OBJECT/EVENT) — mỗi thẻ
// có pill nhãn xám, đoạn giới thiệu, danh sách bullet, và đoạn kết — khác badgeColumns (mỗi cột 1
// danh sách item rời) vì đây mỗi Ô là 1 khối văn bản có cấu trúc riêng (intro + bullet + outro).
type CueCard = { header: string; intro: string; bullets: string[]; outro?: string }
type CardGridData = { cards: CueCard[]; columns?: number }

// Nhiều nhóm xếp CHỒNG, mỗi nhóm có 1 tab nhãn xám (vd FUTURE/PAST) rồi tới các item +/− — mỗi item
// có thể chứa NHIỀU dòng cách diễn đạt thay thế, ngăn cách bằng 1 gạch mảnh trong cùng 1 box (vd
// "Level 3: Self — Past and Future").
type BadgeGroupItem = { badge: '+' | '-'; lines: string[] }
type BadgeGroup = { label: string; items: BadgeGroupItem[] }
type BadgeGroupsData = { groups: BadgeGroup[] }

// 1 box duy nhất liệt kê nhiều cách diễn đạt thay thế, ngăn cách bằng gạch mảnh — dùng cho các mục
// chỉ có 1 danh sách công thức đơn giản, không cột/không badge (vd "Level 2: Familiar Subjects —
// Description", "Level 1: Society — Reasons"), để có cùng "sức nặng" hình ảnh (tiêu đề rose đậm +
// khung box) như những sơ đồ Level khác trong bài, thay vì chỉ là 1 đoạn ul chìm nghỉm.
// root có giá trị = trình bày kiểu phân cấp đi xuống như sách (root in đậm trên cùng, mỗi line
// dưới đó thụt vào + tiền tố "↳"), thay vì danh sách công thức ngang hàng đơn giản.
type FormulaBoxData = { root?: string; lines: string[] }

// 2 khung outline đặt cạnh nhau + 1 ký hiệu nhỏ ở giữa (mặc định "=") — dùng cho các công thức kiểu
// "Part 2 Question = Part 1 Question x 4" (Lesson 7), khác formulaBox (phân cấp 1 root nhiều dòng
// con) vì đây chỉ là 2 cụm ngang hàng nối bằng 1 dấu duy nhất.
type EquationBoxData = { left: string; right: string; symbol?: string }

// Chuỗi N khung outline nối bằng ký hiệu (mặc định "=" rồi "+" cho các khung sau) — tổng quát hoá
// equationBox (chỉ 2 khung) cho công thức 3 phần "Topic A = Topic A1 + Topic A2" (Lesson 8), có thể
// gắn thêm pill nhãn phía trên + ví dụ chữ nhỏ phía dưới mỗi khung (dùng lại 5 lần cho "Tư duy
// chung" + 4 kiểu specify: Noun/Aspect/Process/Perspectives).
type EquationChainPart = { text: string; label?: string; example?: string }
type EquationChainData = { parts: EquationChainPart[]; symbols?: string[] }

// Hàng các box ĐỘC LẬP (không có mũi tên ngang nối chúng — khác flowChain) mỗi box có 1 pill nhãn
// riêng phía trên (vd Response/Description/Cause/Opinion), 1 vài box có thể rẽ nhánh XUỐNG 1 box con
// bằng mũi tên nét đứt (vd Cause → Effect) — đúng bố cục "III. Problems in Part 3" (Lesson 8), tái
// dùng ý tưởng "deepen" của flowChain nhưng KHÔNG có chuỗi ngang nối các box cấp 1 với nhau.
// label/branchTo.label tuỳ chọn — 1 vài sơ đồ (vd "Tư duy idea" Lesson 9) chỉ có khung trơn, không
// pill nhãn xám phía trên (khác "Problems in Part 3" Lesson 8 luôn có pill Response/Cause/...).
type BranchRowItem = { label?: string; text: string; branchTo?: { label?: string; text: string } }
type BranchRowData = { items: BranchRowItem[] }

// Bảng kiểm tra "từ khoá trong câu hỏi có được trả lời trúng không" — câu hỏi có vài từ được tô đậm
// (highlights), mỗi hàng idea gắn 1 dấu ✓/✗ cho TỪNG từ tô đậm đó, theo đúng thứ tự — dùng cho ví dụ
// "Cách đánh giá chất lượng idea" (Lesson 8 IV.1).
type CheckMatrixData = { question: string; highlights: string[]; rows: { label: string; marks: boolean[] }[] }

// "Quy tắc" — 1 hàng nhãn đậm (topLabel) + N pill cột (columns), nối bằng đường chấm dọc xuống 1
// hàng nhãn đậm khác (bottomLabel) + N pill cột tương ứng có dấu ✓ — nền hồng nhạt bao quanh toàn bộ
// (Lesson 8 IV.1 "Quy tắc": Câu hỏi/Aspect 1-3 → Trả lời chất lượng/Aspect 1-3 ✓).
type SpecifyRuleData = { topLabel: string; bottomLabel: string; columns: string[] }

// Cây phân nhánh 2 tầng: 1 box câu hỏi gốc → nhãn "SPECIFY" → tách thành N nhánh (branches), MỖI
// nhánh lại có 1 mũi tên nét đứt xuống thêm 1 box con (child) — khác flowChain "split" (chỉ tách 1
// tầng, không có tầng con thứ 2) — dùng cho ví dụ "Cách generate ideas chất lượng" (Lesson 8 IV.2).
type SpecifyTreeData = { question: string; branches: { text: string; child: string }[] }

// Bảng dữ liệu N cột đơn giản (header + rows) — dùng cho các bảng tra cứu thẳng (vd TỪ VỰNG/IPA/Ý
// NGHĨA, QUESTION WORD/CHỨC NĂNG/NOUN CLAUSE, LOẠI IDEA/TIẾNG VIỆT/TIẾNG ANH ở Lesson 9) mà không
// cần header màu/badge như stemReference hay badgeColumns — chỉ là bảng tra cứu trung tính.
type SimpleTableData = { headers: string[]; rows: string[][] }

// Khung "Idea → Defining word → Detail" (cốt lõi tư duy Think in English, Lesson 9 mục III) — mỗi
// group có 1 Idea hiển thị 1 LẦN (dùng cho nhiều defining word khác nhau của cùng 1 idea, vd "cường
// độ tập" → how / how much / how), mỗi subrow có 1 Defining word (kèm tag đỏ nhỏ tuỳ chọn như
// "objects"/"mức độ") + 1-2 Detail cell đi kèm (đa số 1, riêng ví dụ "phối màu" ở mục III.1 có 2).
// definingWord ở CẤP GROUP (tuỳ chọn) — 1 số bảng (vd khung Verb/Adj tổng quát) có Defining word CỐ
// ĐỊNH giống hệt Idea cho mọi subrow (chỉ Detail mới khác nhau theo objects/manner/context/purpose),
// khi đó vẽ Defining word 1 LẦN duy nhất (giống idea) thay vì lặp lại ở từng subrow.
type ThinkCell = { lines: string[]; tag?: string }
type ThinkSubRow = { definingWord?: ThinkCell; detail: ThinkCell[] }
type ThinkGroup = { idea: ThinkCell; definingWord?: ThinkCell; rows: ThinkSubRow[] }
type ThinkTableData = { groups: ThinkGroup[] }

// "Walkthrough" 1 ví dụ áp General/Specific approach (Cause) từng bước — nhóm theo [chủ ngữ], mỗi
// nhóm có 1+ mẫu câu (stem, vẽ nét đứt vì là khuôn/template) và mỗi mẫu câu có 1+ câu trả lời hoàn
// chỉnh (vẽ nét liền) — đúng cấu trúc "EXAMPLE" trong sách (vd ví dụ "meditate", "Aodai").
type ExampleWalkItem = { stem: string; answers: string[] }
type ExampleWalkGroup = { category: 'self' | 'topic'; subject: string; items: ExampleWalkItem[] }
type ExampleWalkData = { quote?: string; groups: ExampleWalkGroup[] }

// Bảng tra cứu mẫu câu 1 CỘT duy nhất, mỗi hàng [nhãn bên trái] + [box mẫu câu bên phải] — đúng bố
// cục sách (không phải nhiều cột song song như drTypes), nhóm theo section có thanh tiêu đề riêng
// (vd "BẢN THÂN"/"ĐỀ TÀI" cho Specific approach — Cause).
type StemRow = { label: string; text: string }
type StemSection = { category: 'self' | 'topic'; header: string; rows: StemRow[] }
type StemReferenceData = { sections: StemSection[] }

// So sánh Trước/Sau (vd thêm idiomatic language vào 1 đoạn có sẵn) — khác stemReference ở chỗ box
// "Sau" cần bôi đậm/tô màu ĐÚNG những cụm từ vừa thêm vào (so khớp chuỗi con trong `highlights`),
// giống cách sách tô đỏ phần khác biệt, và có thêm 1 dòng giải thích ngắn bên dưới mỗi cặp. Riêng
// type này dùng box RỘNG hơn stemReference (label xếp TRÊN thay vì bên trái) vì đoạn Trước/Sau
// thường dài nhiều câu — xếp label bên trái như stemReference sẽ phí ngang, chữ bị wrap sớm dù còn
// dư chỗ trong box (bug từng gặp, ảnh chụp có khoảng trắng lớn bên phải mỗi dòng).
// beforeHighlights (tuỳ chọn) — 1 số so sánh cần tô đậm luôn cả cụm ở câu "Trước" (thành phần SẼ bị
// thay), không chỉ cụm mới ở câu "Sau" (vd "Two approaches to idiomatic language": tô "many
// interesting forms" ở câu gốc, "a whole lot of" ở câu đã sửa).
type CompareSection = { header: string; before: string; after: string; beforeHighlights?: string[]; highlights: string[]; explanation: string }
type CompareData = { sections: CompareSection[] }

// Tên/label tới từ dữ liệu tuỳ ý (vd "Food & Beverage") — SVG là XML nên "&"/"<"/">" chưa escape
// sẽ làm trình duyệt coi data:image/svg+xml là XML lỗi và không render (img.naturalWidth = 0),
// không báo lỗi console rõ ràng nào cả.
function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function base64Encode(str: string): string {
  if (typeof window === 'undefined') return Buffer.from(str, 'utf-8').toString('base64')
  return btoa(unescape(encodeURIComponent(str)))
}

function encodeData(obj: unknown): string {
  return base64Encode(JSON.stringify(obj))
}

function decodeData(b64: string): unknown {
  if (!b64) return null
  try {
    const json = typeof window === 'undefined' ? Buffer.from(b64, 'base64').toString('utf-8') : decodeURIComponent(escape(atob(b64)))
    return JSON.parse(json)
  } catch {
    return null
  }
}

// Chọn bước lưới "tròn" (2, 5, 10, 20…) theo khoảng giá trị — thay vì chia cứng thành 5 đoạn bằng
// nhau (dễ ra bước lẻ như 6, 6.6…), khớp đúng kiểu trục mà sách in (bước 10 cho thang 0-100, bước
// 5 cho thang 0-30, bước 2 cho thang 0-16).
function niceStep(maxVal: number, targetTicks = 10): number {
  if (maxVal <= 0) return 1
  const roughStep = maxVal / targetTicks
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)))
  const residual = roughStep / magnitude
  let niceResidual: number
  if (residual > 5) niceResidual = 10
  else if (residual > 2) niceResidual = 5
  else if (residual > 1) niceResidual = 2
  else niceResidual = 1
  return niceResidual * magnitude
}

function renderLineChart(data: LineBarData, title: string): string {
  const { categories, series, unit } = data
  const width = 640
  const height = 380
  const pad = { top: 16, right: 20, bottom: 64, left: 42 }
  const chartW = width - pad.left - pad.right
  const chartH = height - pad.top - pad.bottom
  const yMin = data.yMin ?? 0
  const maxVal = Math.max(...series.flatMap((s) => s.values), 0)
  const range = Math.max(maxVal - yMin, 0)
  const step = niceStep(range || 1)
  let gridN = Math.ceil(range / step) || 1
  if (data.yMin !== undefined) gridN += 1 // thêm 1 nấc rỗng phía trên cho trục bị cắt cụt, giống sách
  const yMax = yMin + gridN * step
  const xStep = categories.length > 1 ? chartW / (categories.length - 1) : chartW
  const xPos = (i: number) => pad.left + i * xStep
  const yPos = (v: number) => pad.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH

  let grid = ''
  for (let i = 0; i <= gridN; i++) {
    const v = yMin + step * i
    const y = yPos(v)
    grid += `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" stroke="#e6e2da" stroke-width="1"/>`
    grid += `<text x="${pad.left - 8}" y="${y + 3}" font-size="10" text-anchor="end" fill="#5b6884">${formatGridLabel(v, step)}</text>`
  }

  const xLabels = categories
    .map((c, i) => `<text x="${xPos(i)}" y="${height - pad.bottom + 18}" font-size="10" text-anchor="middle" fill="#5b6884">${escapeXml(c)}</text>`)
    .join('')

  const lines = series
    .map((s) => {
      const pts = s.values.map((v, i) => `${xPos(i)},${yPos(v)}`).join(' ')
      const dots = s.values.map((v, i) => `<circle cx="${xPos(i)}" cy="${yPos(v)}" r="3" fill="${s.color}"/>`).join('')
      return `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5"/>${dots}`
    })
    .join('')

  const legendY = height - 24
  const legend = series
    .map((s, i) => {
      const lx = pad.left + i * (chartW / series.length)
      return `<g transform="translate(${lx}, ${legendY})"><rect width="10" height="10" rx="2" fill="${s.color}"/><text x="14" y="9" font-size="10.5" fill="#2b3a55">${escapeXml(s.name)}</text></g>`
    })
    .join('')

  const unitLabel = unit ? `<text x="${pad.left}" y="${pad.top - 4}" font-size="10" fill="#5b6884">${escapeXml(unit)}</text>` : ''

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${grid}${unitLabel}<line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}" stroke="#2b3a55" stroke-width="1"/><line x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}" stroke="#2b3a55" stroke-width="1"/>${xLabels}${lines}${legend}</svg>`
}

function renderBarChart(data: LineBarData, title: string): string {
  const { categories, series, unit } = data
  const width = 640
  const height = 400
  const pad = { top: 16, right: 20, bottom: 84, left: 42 }
  const chartW = width - pad.left - pad.right
  const chartH = height - pad.top - pad.bottom
  const yMin = data.yMin ?? 0
  const maxVal = Math.max(...series.flatMap((s) => s.values), 0)
  const range = Math.max(maxVal - yMin, 0)
  const step = niceStep(range || 1)
  let gridN = Math.ceil(range / step) || 1
  if (data.yMin !== undefined) gridN += 1
  const yMax = yMin + gridN * step
  const groupW = chartW / categories.length
  const barW = (groupW * 0.72) / series.length
  const groupPad = groupW * 0.14
  const yPos = (v: number) => pad.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH

  let grid = ''
  for (let i = 0; i <= gridN; i++) {
    const v = yMin + step * i
    const y = yPos(v)
    grid += `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" stroke="#e6e2da" stroke-width="1"/>`
    grid += `<text x="${pad.left - 8}" y="${y + 3}" font-size="10" text-anchor="end" fill="#5b6884">${formatGridLabel(v, step)}</text>`
  }

  const bars = categories
    .map((cat, ci) => {
      const groupX = pad.left + ci * groupW + groupPad
      const catBars = series
        .map((s, si) => {
          const x = groupX + si * barW
          const v = s.values[ci] ?? 0
          const y = yPos(v)
          const h = height - pad.bottom - y
          return `<rect x="${x}" y="${y}" width="${Math.max(barW - 2, 1)}" height="${h}" fill="${s.color}"/>`
        })
        .join('')
      const label = `<text x="${pad.left + ci * groupW + groupW / 2}" y="${height - pad.bottom + 16}" font-size="10.5" text-anchor="middle" fill="#2b3a55" font-weight="600">${escapeXml(cat)}</text>`
      return catBars + label
    })
    .join('')

  const legendY = height - 24
  const legend = series
    .map((s, i) => {
      const lx = pad.left + i * (chartW / series.length)
      return `<g transform="translate(${lx}, ${legendY})"><rect width="10" height="10" rx="2" fill="${s.color}"/><text x="14" y="9" font-size="10.5" fill="#2b3a55">${escapeXml(s.name)}</text></g>`
    })
    .join('')

  const unitLabel = unit ? `<text x="${pad.left}" y="${pad.top - 4}" font-size="10" fill="#5b6884">${escapeXml(unit)}</text>` : ''

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${grid}${unitLabel}<line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}" stroke="#2b3a55" stroke-width="1"/><line x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}" stroke="#2b3a55" stroke-width="1"/>${bars}${legend}</svg>`
}

// Số thập phân trên nhãn gridline phải theo ĐÚNG bước lưới (step) — trước đây luôn Math.round(v),
// nên khi step lẻ (vd 0.5) hai nhãn liền kề (0.5 và 1) cùng làm tròn về "1", nhãn trùng nhau trông
// như trục chỉ có nấc nguyên (sai hẳn thang 0/0.5/1/1.5/... của sách).
function formatGridLabel(v: number, step: number): string {
  const decimals = Number.isInteger(step) ? 0 : 1
  const rounded = Math.round(v * 10 ** decimals) / 10 ** decimals
  const intPart = Math.trunc(rounded)
  const withComma = Math.abs(intPart) >= 1000 ? intPart.toLocaleString('en-US') : String(intPart)
  if (Number.isInteger(rounded)) return withComma
  const decPart = Math.abs(rounded - intPart).toFixed(decimals).split('.')[1]
  return `${withComma}.${decPart}`
}

// 2 đường số liệu đơn vị khác nhau (vd % và số người) trên CÙNG 1 chart — mỗi đường tự co giãn
// theo thang riêng (trục trái/phải độc lập), không ép chung 1 thang như renderLineChart (vô nghĩa
// vì đơn vị khác — xem ghi chú SP2 Lesson 10: không so sánh trực tiếp số liệu 2 trục khác nhau).
function renderDualLineChart(data: DualAxisData, title: string): string {
  const { categories, left, right } = data
  const width = 640
  const height = 380
  const pad = { top: 16, right: 58, bottom: 64, left: 46 }
  const chartW = width - pad.left - pad.right
  const chartH = height - pad.top - pad.bottom

  function axisScale(s: DualSeries) {
    const yMin = s.yMin ?? 0
    const maxVal = Math.max(...s.values, 0)
    const range = Math.max(maxVal - yMin, 0)
    const step = niceStep(range || 1)
    const gridN = Math.ceil(range / step) || 1
    return { yMin, yMax: yMin + gridN * step, step, gridN }
  }

  const leftScale = axisScale(left)
  const rightScale = axisScale(right)
  const xStep = categories.length > 1 ? chartW / (categories.length - 1) : chartW
  const xPos = (i: number) => pad.left + i * xStep
  const yPosOf = (scale: { yMin: number; yMax: number }) => (v: number) =>
    pad.top + chartH - ((v - scale.yMin) / (scale.yMax - scale.yMin)) * chartH
  const yPosLeft = yPosOf(leftScale)
  const yPosRight = yPosOf(rightScale)

  let grid = ''
  for (let i = 0; i <= leftScale.gridN; i++) {
    const v = leftScale.yMin + i * leftScale.step
    const y = yPosLeft(v)
    grid += `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" stroke="#e6e2da" stroke-width="1"/>`
    grid += `<text x="${pad.left - 8}" y="${y + 3}" font-size="10" text-anchor="end" fill="${left.color}">${formatGridLabel(v, leftScale.step)}</text>`
  }
  for (let i = 0; i <= rightScale.gridN; i++) {
    const v = rightScale.yMin + i * rightScale.step
    const y = yPosRight(v)
    grid += `<text x="${width - pad.right + 8}" y="${y + 3}" font-size="10" text-anchor="start" fill="${right.color}">${formatGridLabel(v, rightScale.step)}</text>`
  }

  const xLabels = categories
    .map((c, i) => `<text x="${xPos(i)}" y="${height - pad.bottom + 18}" font-size="10" text-anchor="middle" fill="#5b6884">${escapeXml(c)}</text>`)
    .join('')

  function lineFor(s: DualSeries, yPos: (v: number) => number, dashed: boolean) {
    const pts = s.values.map((v, i) => `${xPos(i)},${yPos(v)}`).join(' ')
    const dots = s.values.map((v, i) => `<circle cx="${xPos(i)}" cy="${yPos(v)}" r="3" fill="${s.color}"/>`).join('')
    const dash = dashed ? ' stroke-dasharray="6,4"' : ''
    return `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5"${dash}/>${dots}`
  }

  const lines = lineFor(left, yPosLeft, false) + lineFor(right, yPosRight, true)

  const legendY = height - 24
  const legend = [left, right]
    .map((s, i) => {
      const lx = pad.left + i * (chartW / 2)
      return `<g transform="translate(${lx}, ${legendY})"><rect width="10" height="10" rx="2" fill="${s.color}"/><text x="14" y="9" font-size="10.5" fill="#2b3a55">${escapeXml(s.name)}${s.unit ? ` (${escapeXml(s.unit)})` : ''}</text></g>`
    })
    .join('')

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${grid}<line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}" stroke="#2b3a55" stroke-width="1"/><line x1="${width - pad.right}" y1="${pad.top}" x2="${width - pad.right}" y2="${height - pad.bottom}" stroke="#2b3a55" stroke-width="1"/><line x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}" stroke="#2b3a55" stroke-width="1"/>${xLabels}${lines}${legend}</svg>`
}

function formatValue(v: number): string {
  const rounded = Math.round(v * 10) / 10
  const isInt = Number.isInteger(rounded)
  const [intPart, decPart] = (isInt ? String(rounded) : rounded.toFixed(1)).split('.')
  const withComma = Math.abs(Number(intPart)) >= 1000 ? Number(intPart).toLocaleString('en-US') : intPart
  return decPart ? `${withComma}.${decPart}` : withComma
}

// Bar chart NẰM NGANG — dùng cho bảng-kèm-thanh dạng "rank" (vd Combo 2C SP1: 10 nước × 2 chỉ số),
// nơi mỗi hàng in kèm con số chính xác ngay cạnh đầu thanh thay vì đọc theo trục X chung — giống hệt
// cách sách trình bày (không có gridline trục X, chỉ có số ở cuối mỗi thanh).
function renderHBarChart(data: LineBarData, title: string): string {
  const { categories, series } = data
  const width = 640
  const rowH = 32
  const barH = 11
  const pad = { top: 12, right: 78, bottom: 34, left: 118 }
  const chartW = width - pad.left - pad.right
  const height = pad.top + categories.length * rowH + pad.bottom
  const maxVal = Math.max(...series.flatMap((s) => s.values), 0) || 1
  const xScale = (v: number) => (v / maxVal) * chartW

  const rows = categories
    .map((cat, ci) => {
      const rowY = pad.top + ci * rowH
      const bars = series
        .map((s, si) => {
          const v = s.values[ci] ?? 0
          const w = Math.max(xScale(v), 1)
          const y = rowY + si * (barH + 3)
          return `<rect x="${pad.left}" y="${y}" width="${w}" height="${barH}" fill="${s.color}"/><text x="${pad.left + w + 6}" y="${y + barH - 2}" font-size="9.5" fill="#2b3a55">${formatValue(v)}</text>`
        })
        .join('')
      const label = `<text x="${pad.left - 8}" y="${rowY + barH + 3}" font-size="10.5" text-anchor="end" fill="#2b3a55" font-weight="600">${escapeXml(cat)}</text>`
      return bars + label
    })
    .join('')

  const legendY = height - 18
  const legend = series
    .map((s, i) => {
      const lx = pad.left + i * (chartW / series.length)
      return `<g transform="translate(${lx}, ${legendY})"><rect width="10" height="10" rx="2" fill="${s.color}"/><text x="14" y="9" font-size="10.5" fill="#2b3a55">${escapeXml(s.name)}</text></g>`
    })
    .join('')

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${rows}${legend}</svg>`
}

// N pie tròn cùng hàng (N = labels.length) — không chỉ 2, vì có bài (Graph 05, Lesson 10) so sánh 3
// pie (Sodium/Fat/Sugar) cùng lúc. Bán kính tự co theo N để N pie vẫn đọc được trên cùng 1 hàng.
function renderPieDouble(data: PieData, title: string): string {
  const { labels, slices } = data
  const n = labels.length
  const r = n <= 2 ? 84 : n === 3 ? 62 : 50
  const cy = r + 46
  const colW = n <= 2 ? 290 : 210
  const width = Math.max(640, n * colW)
  const centers = labels.map((_, i) => (i + 0.5) * (width / n))
  const legendTop = cy + r + 40
  const height = legendTop + slices.length * 18 + 10

  function piePaths(cx: number, values: number[]) {
    const total = values.reduce((a, b) => a + b, 0) || 1
    let angle = -90
    return values.map((v) => {
      const slice = (v / total) * 360
      const startAngle = angle
      const endAngle = angle + slice
      angle = endAngle
      const rad = (d: number) => (d * Math.PI) / 180
      const x1 = cx + r * Math.cos(rad(startAngle))
      const y1 = cy + r * Math.sin(rad(startAngle))
      const x2 = cx + r * Math.cos(rad(endAngle))
      const y2 = cy + r * Math.sin(rad(endAngle))
      const largeArc = slice > 180 ? 1 : 0
      const mid = rad((startAngle + endAngle) / 2)
      const lx = cx + r * 0.65 * Math.cos(mid)
      const ly = cy + r * 0.65 * Math.sin(mid)
      return { path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`, lx, ly, v }
    })
  }

  const drawPie = (paths: ReturnType<typeof piePaths>) =>
    paths
      .map(
        (p, i) =>
          `<path d="${p.path}" fill="${slices[i].color}" stroke="#fdfcfa" stroke-width="2"/><text x="${p.lx}" y="${p.ly}" font-size="${n <= 2 ? 11 : 9.5}" font-weight="700" text-anchor="middle" fill="#fff">${p.v}%</text>`,
      )
      .join('')

  const pies = centers
    .map((cx, i) => {
      const paths = piePaths(cx, slices.map((s) => s.values[i]))
      return `${drawPie(paths)}<text x="${cx}" y="${cy + r + 22}" font-size="12" font-weight="700" text-anchor="middle" fill="#2b3a55">${escapeXml(labels[i])}</text>`
    })
    .join('')

  const legend = slices
    .map((s, i) => `<g transform="translate(24, ${legendTop + i * 18})"><rect width="10" height="10" rx="2" fill="${s.color}"/><text x="14" y="9" font-size="10.5" fill="#2b3a55">${escapeXml(s.name)}</text></g>`)
    .join('')

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${pies}${legend}</svg>`
}

// Thư viện icon vẽ tay bằng SVG thuần (không dùng emoji) — mỗi icon là 1 nhóm hình khối đơn giản
// trong khung 64×64, tông màu trùng bảng màu hệ thống (xanh lá/cam), phong cách flat-icon tối giản
// nhưng vẫn là hình vẽ thật thay vì ký tự văn bản, khớp yêu cầu "vẽ lại như sách" cho sơ đồ Process.
const PROCESS_ICONS: Record<string, string> = {
  orangeTree: `<ellipse cx="32" cy="52" rx="15" ry="3" fill="#dce4d0"/><rect x="29" y="34" width="6" height="16" rx="1" fill="#8b6b47"/><circle cx="32" cy="22" r="17" fill="#63A375"/><circle cx="22" cy="18" r="3" fill="#E08D3C"/><circle cx="42" cy="16" r="3" fill="#E08D3C"/><circle cx="30" cy="30" r="3" fill="#E08D3C"/><circle cx="40" cy="28" r="3" fill="#E08D3C"/>`,
  truck: `<rect x="6" y="28" width="16" height="16" rx="1" fill="#fff" stroke="#178A5A" stroke-width="2"/><circle cx="10" cy="18" r="4" fill="#E08D3C"/><circle cx="18" cy="20" r="3" fill="#E08D3C"/><rect x="22" y="20" width="32" height="24" rx="1" fill="#fff" stroke="#178A5A" stroke-width="2"/><circle cx="16" cy="46" r="4" fill="#2b3a55"/><circle cx="44" cy="46" r="4" fill="#2b3a55"/><rect x="6" y="44" width="48" height="3" fill="#2b3a55" opacity="0.15"/>`,
  grading: `<rect x="6" y="40" width="52" height="7" rx="3" fill="#dce4d0"/><circle cx="16" cy="36" r="3" fill="#E08D3C"/><circle cx="26" cy="36" r="3" fill="#E08D3C"/><circle cx="36" cy="36" r="3" fill="#E08D3C"/><circle cx="46" cy="36" r="3" fill="#E08D3C"/><circle cx="18" cy="16" r="5" fill="#63A375"/><path d="M10,32 Q10,20 18,21 Q26,20 26,32 Z" fill="#63A375"/><circle cx="44" cy="16" r="5" fill="#178A5A"/><path d="M36,32 Q36,20 44,21 Q52,20 52,32 Z" fill="#178A5A"/>`,
  sortingCrate: `<rect x="8" y="12" width="48" height="34" rx="2" fill="#fff" stroke="#178A5A" stroke-width="2"/><line x1="8" y1="29" x2="56" y2="29" stroke="#178A5A" stroke-width="1.5" opacity="0.4"/><line x1="24" y1="12" x2="24" y2="46" stroke="#178A5A" stroke-width="1.5" opacity="0.4"/><line x1="40" y1="12" x2="40" y2="46" stroke="#178A5A" stroke-width="1.5" opacity="0.4"/><circle cx="16" cy="20" r="3" fill="#E08D3C"/><circle cx="32" cy="20" r="3" fill="#E08D3C"/><circle cx="48" cy="20" r="3" fill="#E08D3C"/><circle cx="16" cy="37" r="3" fill="#E08D3C"/><circle cx="48" cy="37" r="3" fill="#E08D3C"/>`,
  extractor: `<rect x="12" y="42" width="40" height="8" rx="1" fill="#178A5A"/><rect x="20" y="16" width="24" height="8" rx="1" fill="#63A375"/><rect x="26" y="24" width="12" height="18" fill="#fff" stroke="#178A5A" stroke-width="2"/><path d="M44,30 q6,0 6,4 t-6,4" fill="none" stroke="#63A375" stroke-width="2.5"/>`,
  evaporationCoils: `<path d="M14,14 v10 a6,6 0 0 0 12,0 v-4 a6,6 0 0 1 12,0 v4 a6,6 0 0 0 12,0 v-4 a6,6 0 0 1 12,0 v10" fill="none" stroke="#B45309" stroke-width="4" stroke-linecap="round"/><circle cx="14" cy="46" r="3" fill="#3E63DD"/><circle cx="50" cy="46" r="3" fill="#3E63DD"/>`,
  concentrateBox: `<path d="M12,26 L52,26 L47,48 L17,48 Z" fill="#F3C98B" stroke="#B45309" stroke-width="2"/><path d="M17,32 q5,-4 10,0 t10,0 t10,0" fill="none" stroke="#B45309" stroke-width="2"/><circle cx="24" cy="40" r="1.6" fill="#B45309"/><circle cx="34" cy="42" r="1.6" fill="#B45309"/>`,
  coldStorage: `<rect x="10" y="12" width="18" height="38" rx="2" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="36" y="12" width="18" height="38" rx="2" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="13" y="38" width="12" height="4" fill="#63A375"/><rect x="39" y="38" width="12" height="4" fill="#63A375"/><path d="M19,20 l0,8 M15,24 l8,0" stroke="#3E63DD" stroke-width="1.6"/><path d="M45,20 l0,8 M41,24 l8,0" stroke="#3E63DD" stroke-width="1.6"/>`,
  canningMachine: `<rect x="8" y="42" width="48" height="8" fill="#63A375"/><path d="M10,50 l4,-8 M18,50 l4,-8 M26,50 l4,-8 M34,50 l4,-8 M42,50 l4,-8 M50,50 l4,-8" stroke="#178A5A" stroke-width="1.2" opacity="0.5"/><rect x="16" y="24" width="10" height="18" rx="1" fill="#C9667A"/><rect x="27" y="18" width="10" height="24" rx="1" fill="#C9667A"/><rect x="38" y="24" width="10" height="18" rx="1" fill="#C9667A"/><rect x="30" y="12" width="4" height="6" fill="#63A375"/>`,
  ship: `<path d="M8,38 L56,38 L50,50 L14,50 Z" fill="#178A5A"/><rect x="18" y="26" width="10" height="12" fill="#63A375"/><rect x="30" y="26" width="10" height="12" fill="#E08D3C"/><line x1="44" y1="16" x2="44" y2="38" stroke="#2b3a55" stroke-width="2"/><path d="M4,46 q6,-4 12,0 t12,0 t12,0 t12,0" fill="none" stroke="#3E63DD" stroke-width="2"/>`,
  tap: `<rect x="29" y="8" width="6" height="18" rx="1" fill="#63A375"/><rect x="29" y="24" width="18" height="6" rx="1" fill="#63A375"/><rect x="21" y="20" width="6" height="12" rx="1" fill="#178A5A"/><path d="M40,32 q3,6 0,11" fill="none" stroke="#3E63DD" stroke-width="2.5"/><path d="M38,44 q2,-4 4,0 q2,4 -2,6 q-4,-2 -2,-6" fill="#3E63DD"/>`,
  juiceCarton: `<path d="M20,16 L32,8 L44,16 L44,52 L20,52 Z" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="24" y="26" width="16" height="4" fill="#63A375"/><rect x="24" y="34" width="16" height="4" fill="#E08D3C"/><circle cx="32" cy="44" r="4" fill="#E08D3C" opacity="0.6"/>`,
  beeAdult: `<ellipse cx="32" cy="32" rx="16" ry="11" fill="#F3C24A"/><path d="M18,26 a16,11 0 0 1 0,12 M26,22 a16,11 0 0 1 0,20 M34,21 a16,11 0 0 1 0,22" fill="none" stroke="#2b3a55" stroke-width="3"/><ellipse cx="20" cy="20" rx="7" ry="5" fill="#eaf1ff" opacity="0.8"/><ellipse cx="30" cy="16" rx="7" ry="5" fill="#eaf1ff" opacity="0.8"/><circle cx="46" cy="30" r="3" fill="#2b3a55"/>`,
  beeEgg: `<ellipse cx="32" cy="32" rx="6" ry="14" fill="#F3E9C9" stroke="#B45309" stroke-width="1.5"/>`,
  beeLarva: `<path d="M20,40 q0,-24 22,-24 q10,0 8,10 q-2,8 -12,8 q-8,0 -6,8 q1,6 8,6" fill="none" stroke="#B7C99A" stroke-width="8" stroke-linecap="round"/>`,
  beeNymph: `<path d="M18,36 q2,-22 26,-20" fill="none" stroke="#8FAE72" stroke-width="9" stroke-linecap="round"/><circle cx="20" cy="34" r="5" fill="#8FAE72"/><circle cx="44" cy="17" r="4" fill="#8FAE72"/>`,
  beeYoungAdult: `<ellipse cx="32" cy="32" rx="14" ry="10" fill="#D9E3A6"/><path d="M20,26 a14,10 0 0 1 0,12 M28,22 a14,10 0 0 1 0,20" fill="none" stroke="#5b6884" stroke-width="2.5"/><ellipse cx="22" cy="21" rx="6" ry="4" fill="#eaf1ff" opacity="0.7"/>`,
  storageSilos: `<rect x="10" y="18" width="12" height="26" rx="6" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="24" y="18" width="12" height="26" rx="6" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="13" y="34" width="6" height="8" fill="#63A375"/><rect x="27" y="34" width="6" height="8" fill="#63A375"/><rect x="38" y="34" width="18" height="10" rx="1" fill="#63A375"/><circle cx="42" cy="46" r="3" fill="#2b3a55"/><circle cx="52" cy="46" r="3" fill="#2b3a55"/>`,
  mixer: `<rect x="16" y="20" width="32" height="22" rx="10" fill="#63A375"/><path d="M24,26 q8,10 16,0 M24,34 q8,10 16,0" stroke="#fff" stroke-width="2" fill="none"/><rect x="28" y="42" width="8" height="8" fill="#178A5A"/>`,
  doughSheets: `<circle cx="16" cy="30" r="9" fill="#B45309"/><circle cx="48" cy="30" r="9" fill="#B45309"/><rect x="16" y="26" width="32" height="8" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.5"/>`,
  doughStrips: `<rect x="10" y="16" width="6" height="32" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.5"/><rect x="20" y="16" width="6" height="32" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.5"/><rect x="30" y="16" width="6" height="32" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.5"/><rect x="40" y="16" width="6" height="32" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.5"/><rect x="50" y="16" width="6" height="32" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.5"/>`,
  noodleDiscs: `<circle cx="32" cy="32" r="20" fill="none" stroke="#178A5A" stroke-width="2"/><path d="M16,26 q6,-6 10,0 t10,0 t10,0 M16,32 q6,-6 10,0 t10,0 t10,0 M16,38 q6,-6 10,0 t10,0 t10,0" stroke="#E08D3C" stroke-width="1.6" fill="none"/>`,
  cookingOil: `<path d="M10,26 L54,26 L48,48 L16,48 Z" fill="#F3C98B" stroke="#B45309" stroke-width="2"/><path d="M16,32 q6,-5 12,0 t12,0 t12,0" fill="none" stroke="#B45309" stroke-width="1.8"/><circle cx="22" cy="40" r="6" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.2"/><circle cx="36" cy="40" r="6" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.2"/>`,
  vegetables: `<circle cx="18" cy="34" r="6" fill="#63A375"/><circle cx="30" cy="30" r="5" fill="#B45309"/><path d="M40,20 L48,36 L32,36 Z" fill="#178A5A"/><circle cx="46" cy="42" r="5" fill="#E08D3C"/>`,
  labelling: `<rect x="18" y="14" width="28" height="36" rx="4" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="18" y="26" width="28" height="12" fill="#63A375"/><path d="M24,32 l4,4 l8,-8" stroke="#fff" stroke-width="2.4" fill="none"/>`,
  rain: `<ellipse cx="24" cy="20" rx="12" ry="9" fill="#dce8f2"/><ellipse cx="38" cy="18" rx="14" ry="10" fill="#dce8f2"/><ellipse cx="32" cy="24" rx="16" ry="10" fill="#dce8f2"/><line x1="20" y1="38" x2="16" y2="48" stroke="#3E63DD" stroke-width="2.4" stroke-linecap="round"/><line x1="32" y1="38" x2="28" y2="48" stroke="#3E63DD" stroke-width="2.4" stroke-linecap="round"/><line x1="44" y1="38" x2="40" y2="48" stroke="#3E63DD" stroke-width="2.4" stroke-linecap="round"/>`,
  houseDrain: `<path d="M18,30 L32,16 L46,30 L46,50 L18,50 Z" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="24" y="38" width="16" height="10" fill="#63A375"/><rect x="8" y="50" width="48" height="5" rx="1" fill="#8b95ab"/><line x1="12" y1="52.5" x2="52" y2="52.5" stroke="#5b6884" stroke-width="1" stroke-dasharray="2,2"/>`,
  recyclingPlant: `<rect x="8" y="22" width="48" height="20" rx="2" fill="#fff" stroke="#178A5A" stroke-width="2"/><line x1="20" y1="22" x2="20" y2="42" stroke="#178A5A" stroke-width="1.5"/><line x1="32" y1="22" x2="32" y2="42" stroke="#178A5A" stroke-width="1.5"/><line x1="44" y1="22" x2="44" y2="42" stroke="#178A5A" stroke-width="1.5"/><circle cx="14" cy="32" r="3" fill="#8b95ab"/><circle cx="26" cy="32" r="3" fill="#B45309"/><circle cx="38" cy="32" r="3" fill="#63A375"/><circle cx="50" cy="32" r="3" fill="#3E63DD"/>`,
  chlorineBottle: `<rect x="26" y="10" width="8" height="6" fill="#63A375"/><path d="M24,16 h12 l2,6 v26 a2,2 0 0 1 -2,2 h-12 a2,2 0 0 1 -2,-2 v-26 Z" fill="#178A5A"/><circle cx="20" cy="18" r="1.6" fill="#3E63DD"/><circle cx="44" cy="20" r="1.6" fill="#3E63DD"/><circle cx="18" cy="26" r="1.6" fill="#3E63DD"/>`,
  waterStorage: `<rect x="10" y="16" width="44" height="30" rx="3" fill="#63A375"/><circle cx="20" cy="26" r="2" fill="#dce4d0"/><circle cx="32" cy="30" r="2" fill="#dce4d0"/><circle cx="44" cy="24" r="2" fill="#dce4d0"/><circle cx="26" cy="38" r="2" fill="#dce4d0"/><circle cx="40" cy="36" r="2" fill="#dce4d0"/><path d="M10,42 q11,-4 22,0 t22,0" fill="none" stroke="#3E63DD" stroke-width="2"/>`,
  houseSunny: `<circle cx="48" cy="12" r="6" fill="#F3C24A"/><line x1="48" y1="2" x2="48" y2="0" stroke="#F3C24A" stroke-width="0"/><path d="M18,30 L32,16 L46,30 L46,50 L18,50 Z" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="28" y="40" width="8" height="10" fill="#63A375"/><line x1="32" y1="52" x2="32" y2="60" stroke="#3E63DD" stroke-width="2" marker-end="url(#pArrow)"/>`,
  car: `<path d="M10,38 L14,26 Q18,20 28,20 L38,20 Q46,20 50,26 L54,38 Z" fill="#3E63DD" stroke="#2b3a55" stroke-width="1.5"/><rect x="18" y="22" width="26" height="10" rx="2" fill="#dce8f2"/><circle cx="18" cy="40" r="5" fill="#2b3a55"/><circle cx="46" cy="40" r="5" fill="#2b3a55"/>`,
  coffeeCup: `<path d="M18,24 h24 v18 a12,12 0 0 1 -24,0 Z" fill="#8b6b47" stroke="#5a4429" stroke-width="1.5"/><path d="M42,28 q10,0 10,9 t-10,9" fill="none" stroke="#5a4429" stroke-width="2.5"/><path d="M22,16 q3,-4 0,-8 M30,16 q3,-4 0,-8 M38,16 q3,-4 0,-8" fill="none" stroke="#B45309" stroke-width="1.6" stroke-linecap="round"/>`,
  mountain: `<path d="M4,50 L22,18 L34,36 L44,20 L60,50 Z" fill="#8FAE9E" stroke="#5b6884" stroke-width="1.5"/><path d="M22,18 L27,26 L17,26 Z" fill="#fff"/><path d="M44,20 L48,27 L40,27 Z" fill="#fff"/>`,
  houseCluster: `<path d="M8,40 L18,28 L28,40 L28,52 L8,52 Z" fill="#fff" stroke="#178A5A" stroke-width="1.6"/><path d="M30,36 L40,22 L50,36 L50,52 L30,52 Z" fill="#fff" stroke="#178A5A" stroke-width="1.6"/><path d="M46,42 L54,32 L62,42 L62,52 L46,52 Z" fill="#fff" stroke="#178A5A" stroke-width="1.6"/>`,
}
function processIcon(name: string): string {
  return PROCESS_ICONS[name] ?? `<circle cx="32" cy="32" r="18" fill="#dce4d0"/>`
}

function wrapLabel(text: string, maxChars: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w
    if (test.length > maxChars && cur) {
      lines.push(cur)
      cur = w
    } else {
      cur = test
    }
  }
  if (cur) lines.push(cur)
  return lines
}

function renderProcessLinear(data: ProcessLinearData, title: string): string {
  const { steps } = data
  const cols = data.cols ?? 3
  const rows = Math.ceil(steps.length / cols)
  const cellW = 170
  const cellH = 138
  const pad = { top: 24, left: 20, right: 20, bottom: 24 }
  const width = pad.left + cols * cellW + pad.right
  const height = pad.top + rows * cellH + pad.bottom

  // Zigzag chữ Z: hàng chẵn đi trái→phải, hàng lẻ đi phải→trái — giống đúng cách sách trình bày.
  function posFor(i: number) {
    const row = Math.floor(i / cols)
    const posInRow = i % cols
    const col = row % 2 === 0 ? posInRow : cols - 1 - posInRow
    return { cx: pad.left + col * cellW + cellW / 2, cy: pad.top + row * cellH + cellH / 2, row }
  }

  let cards = ''
  let arrows = ''
  steps.forEach((s, i) => {
    const { cx, cy } = posFor(i)
    const lines = wrapLabel(s.label, 15)
    const labelSvg = lines.map((l, li) => `<tspan x="${cx}" dy="${li === 0 ? 0 : 12}">${escapeXml(l)}</tspan>`).join('')
    const scale = 0.62
    const iconX = cx - 32 * scale
    const iconY = cy - 6 - 32 * scale
    cards += `<g><circle cx="${cx - 40}" cy="${cy - 40}" r="12" fill="#178A5A"/><text x="${cx - 40}" y="${cy - 36}" font-size="11.5" font-weight="700" text-anchor="middle" fill="#fff">${i + 1}</text><g transform="translate(${iconX},${iconY}) scale(${scale})">${processIcon(s.icon)}</g><text x="${cx}" y="${cy + 28}" font-size="9.5" text-anchor="middle" fill="#2b3a55">${labelSvg}</text></g>`
  })

  for (let i = 0; i < steps.length - 1; i++) {
    const a = posFor(i)
    const b = posFor(i + 1)
    if (a.row === b.row) {
      const dir = b.cx > a.cx ? 1 : -1
      arrows += `<line x1="${a.cx + dir * 42}" y1="${a.cy}" x2="${b.cx - dir * 42}" y2="${a.cy}" stroke="#63A375" stroke-width="2.5" marker-end="url(#pArrow)"/>`
    } else {
      const midY = (a.cy + 44 + (b.cy - 44)) / 2
      const bend = b.cx > a.cx ? 34 : -34
      arrows += `<path d="M${a.cx},${a.cy + 44} Q${a.cx + bend},${midY} ${b.cx},${b.cy - 44}" fill="none" stroke="#63A375" stroke-width="2.5" marker-end="url(#pArrow)"/>`
    }
  }

  const defs = `<defs><marker id="pArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#63A375"/></marker></defs>`
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${arrows}${cards}</svg>`
}

function renderProcessCircular(data: ProcessCircularData, title: string): string {
  const { steps, durations, centerLabel } = data
  const n = steps.length
  const width = 560
  const height = 560
  const cx = width / 2
  const cy = height / 2
  const R = 200
  const arcR = R - 48

  function angleFor(i: number) {
    return -90 + (i * 360) / n
  }
  function ptOn(radius: number, angle: number) {
    const rad = (angle * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  let items = ''
  steps.forEach((s, i) => {
    const { x, y } = ptOn(R, angleFor(i))
    const lines = wrapLabel(s.label, 13)
    const labelSvg = lines.map((l, li) => `<tspan x="${x}" dy="${li === 0 ? 0 : 12}">${escapeXml(l)}</tspan>`).join('')
    const scale = 0.5
    const iconX = x - 32 * scale
    const iconY = y - 16 - 32 * scale
    items += `<g><g transform="translate(${iconX},${iconY}) scale(${scale})">${processIcon(s.icon)}</g><text x="${x}" y="${y + 16}" font-size="10" text-anchor="middle" fill="#2b3a55" font-weight="600">${labelSvg}</text></g>`
  })

  let arcs = ''
  for (let i = 0; i < n; i++) {
    const aAngle = angleFor(i)
    const bAngle = angleFor((i + 1) % n)
    const aa = ptOn(arcR, aAngle)
    const bb = ptOn(arcR, i === n - 1 ? bAngle + 360 : bAngle)
    arcs += `<path d="M${aa.x},${aa.y} A${arcR},${arcR} 0 0 1 ${bb.x},${bb.y}" fill="none" stroke="#63A375" stroke-width="2.5" marker-end="url(#pArrow2)"/>`
    if (durations?.[i]) {
      const midAngle = i === n - 1 ? (aAngle + bAngle + 360) / 2 : (aAngle + bAngle) / 2
      const mid = ptOn(arcR, midAngle)
      arcs += `<text x="${mid.x}" y="${mid.y}" font-size="9.5" text-anchor="middle" fill="#5b6884">${escapeXml(durations[i])}</text>`
    }
  }

  const defs = `<defs><marker id="pArrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#63A375"/></marker></defs>`
  const center = centerLabel
    ? wrapLabel(centerLabel, 18)
        .map((l, li) => `<tspan x="${cx}" dy="${li === 0 ? 0 : 13}">${escapeXml(l)}</tspan>`)
        .join('')
    : ''
  const centerText = centerLabel
    ? `<text x="${cx}" y="${cy - 6}" font-size="11.5" text-anchor="middle" fill="#2b3a55" font-weight="700">${center}</text>`
    : ''

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${arcs}${items}${centerText}</svg>`
}

function renderMapDiagram(data: MapDiagramData, title: string): string {
  const { panels } = data
  const gap = 28
  const padOuter = { top: 26, left: 10, right: 10, bottom: 10 }
  const totalW = panels.reduce((s, p) => s + p.w, 0) + gap * (panels.length - 1) + padOuter.left + padOuter.right
  const maxH = Math.max(...panels.map((p) => p.h))
  const totalH = maxH + padOuter.top + padOuter.bottom

  function zoneColor(c?: string) {
    return c ?? '#eef1e8'
  }

  // Đường cong mượt qua N điểm: nối từng cặp điểm bằng 1 quadratic bezier có điểm điều khiển là
  // điểm giữa 2 mốc kề nhau — không cần spline phức tạp, đủ để lối đi/con đường trông tự nhiên hơn.
  function smoothPath(points: [number, number][]): string {
    if (points.length < 2) return ''
    let d = `M${points[0][0]},${points[0][1]}`
    for (let i = 1; i < points.length; i++) {
      const [px, py] = points[i - 1]
      const [cx, cy] = points[i]
      const mx = (px + cx) / 2
      const my = (py + cy) / 2
      d += ` Q${px},${py} ${mx},${my}`
    }
    const last = points[points.length - 1]
    d += ` T${last[0]},${last[1]}`
    return d
  }

  function drawPanel(p: MapPanel, offsetX: number): string {
    let out = `<rect x="${offsetX}" y="${padOuter.top}" width="${p.w}" height="${p.h}" fill="${p.bgColor ?? '#fdfcfa'}" stroke="#2b3a55" stroke-width="1.5"/>`
    out += `<text x="${offsetX + p.w / 2}" y="${padOuter.top - 8}" font-size="12" font-weight="700" text-anchor="middle" fill="#2b3a55">${escapeXml(p.title)}</text>`

    if (p.panelShape) {
      const pts = p.panelShape.points.map(([px, py]) => `${offsetX + px},${padOuter.top + py}`).join(' ')
      out += `<polygon points="${pts}" fill="${p.panelShape.fill}" stroke="#178A5A" stroke-width="1.5"/>`
    }

    for (const z of p.zones) {
      const zx = offsetX + z.x
      const zy = padOuter.top + z.y
      out += `<rect x="${zx}" y="${zy}" width="${z.w}" height="${z.h}" fill="${zoneColor(z.color)}" stroke="#178A5A" stroke-width="1" opacity="0.9"/>`
      const lines = wrapLabel(z.label, Math.max(8, Math.floor(z.w / 6)))
      const lx = zx + z.w / 2
      const ly = zy + z.h / 2 - ((lines.length - 1) * 10) / 2 + 3
      lines.forEach((l, li) => {
        out += `<text x="${lx}" y="${ly + li * 10}" font-size="8.5" text-anchor="middle" fill="#2b3a55">${escapeXml(l)}</text>`
      })
    }

    for (const ring of p.rings ?? []) {
      const rcx = offsetX + ring.cx
      const rcy = padOuter.top + ring.cy
      out += `<ellipse cx="${rcx}" cy="${rcy}" rx="${ring.rx}" ry="${ring.ry}" fill="none" stroke="#B45309" stroke-width="3" stroke-dasharray="6,4"/>`
      if (ring.label) out += `<text x="${rcx}" y="${rcy - ring.ry - 4}" font-size="8" text-anchor="middle" fill="#5b6884">${escapeXml(ring.label)}</text>`
    }

    for (const seg of p.paths ?? []) {
      const shifted = seg.points.map(([px, py]) => [offsetX + px, padOuter.top + py] as [number, number])
      const isRiver = seg.style === 'river'
      const dash = seg.style === 'track' ? ' stroke-dasharray="5,3"' : seg.style === 'path' ? ' stroke-dasharray="2,3"' : ''
      const strokeW = seg.style === 'road' ? 4 : isRiver ? 6 : 2
      const strokeColor = seg.style === 'road' ? '#B45309' : isRiver ? '#7fb3e0' : '#5b6884'
      if (seg.curve) {
        out += `<path d="${smoothPath(shifted)}" fill="none" stroke="${strokeColor}" stroke-width="${strokeW}" stroke-linecap="round"${dash}/>`
      } else {
        const pts = shifted.map(([px, py]) => `${px},${py}`).join(' ')
        out += `<polyline points="${pts}" fill="none" stroke="${strokeColor}" stroke-width="${strokeW}" stroke-linecap="round"${dash}/>`
      }
      if (seg.label) {
        const first = seg.points[0]
        const last = seg.points[seg.points.length - 1]
        const mx = (first[0] + last[0]) / 2
        const my = (first[1] + last[1]) / 2
        out += `<text x="${offsetX + mx}" y="${padOuter.top + my - (isRiver ? 9 : 5)}" font-size="8" text-anchor="middle" fill="#5b6884">${escapeXml(seg.label)}</text>`
      }
    }

    for (const ic of p.icons ?? []) {
      const ix = offsetX + ic.x
      const iy = padOuter.top + ic.y
      const sc = ic.scale ?? 0.28
      out += `<g transform="translate(${ix - 9 * (sc / 0.28)},${iy - 9 * (sc / 0.28)}) scale(${sc})">${processIcon(ic.icon)}</g>`
      if (ic.label) out += `<text x="${ix}" y="${iy + 9 * (sc / 0.28) + 8}" font-size="7.5" text-anchor="middle" fill="#2b3a55">${escapeXml(ic.label)}</text>`
    }

    if (p.compass) {
      const cx = offsetX + p.w - 22
      const cy = padOuter.top + 20
      out += `<line x1="${cx}" y1="${cy + 10}" x2="${cx}" y2="${cy - 10}" stroke="#2b3a55" stroke-width="1.4"/><path d="M${cx},${cy - 12} l4,7 l-4,-2 l-4,2 Z" fill="#2b3a55"/><text x="${cx}" y="${cy + 20}" font-size="8" text-anchor="middle" fill="#2b3a55" font-weight="700">N</text>`
    }

    if (p.scaleLabel) {
      const sx = offsetX + 10
      const sy = padOuter.top + p.h - 10
      out += `<line x1="${sx}" y1="${sy}" x2="${sx + 40}" y2="${sy}" stroke="#2b3a55" stroke-width="2"/><line x1="${sx}" y1="${sy - 3}" x2="${sx}" y2="${sy + 3}" stroke="#2b3a55" stroke-width="1.4"/><line x1="${sx + 40}" y1="${sy - 3}" x2="${sx + 40}" y2="${sy + 3}" stroke="#2b3a55" stroke-width="1.4"/><text x="${sx + 20}" y="${sy - 5}" font-size="7" text-anchor="middle" fill="#5b6884">${escapeXml(p.scaleLabel)}</text>`
    }

    return out
  }

  let body = ''
  let cursorX = padOuter.left
  for (const p of panels) {
    body += drawPanel(p, cursorX)
    cursorX += p.w + gap
  }

  return `<svg viewBox="0 0 ${totalW} ${totalH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

function multilineWrap(text: string, maxChars: number): string[] {
  return text.split('\n').flatMap((line) => wrapLabel(line, maxChars))
}

function renderFlowChain(data: FlowChainData, title: string): string {
  const { lanes, laneLabels, lanePills, dashedArrows, laneTrailingNote } = data
  const arrowDash = dashedArrows ? ' stroke-dasharray="4,4"' : ''
  const boxW = 176
  const boxH = 52
  const gapX = 60
  const laneGap = 40
  const laneLabelH = 18
  const laneLabelGap = 6
  const pillH = 17
  const pillGap = 6
  const timeH = 12
  const timeGap = 3
  const miniGap = 10
  const miniLineH = 12
  const miniPadY = 12
  const miniWrapChars = 24
  const pad = { top: 22, left: 20, right: 20, bottom: 16 }

  // Chiều cao mỗi box nhánh phải theo ĐÚNG số dòng chữ của nhánh đó (không cố định) — nhánh dài
  // hơn thì box cao hơn, tránh chữ tràn ra ngoài đè lên nhánh kế bên (bug từng gặp khi 1 nhánh dài
  // 3 dòng nhưng box chỉ đủ chỗ cho 1 dòng).
  function branchLines(b: string): string[] {
    return wrapLabel(b, miniWrapChars)
  }
  function branchHeight(b: string): number {
    return Math.max(28, branchLines(b).length * miniLineH + miniPadY)
  }
  function splitTotalHeight(branches: string[]): number {
    return branches.reduce((sum, b) => sum + branchHeight(b), 0) + (branches.length - 1) * miniGap
  }
  const deepenGap = 16 // khoảng trống cho mũi tên dọc giữa box chính và box phụ bên dưới
  function deepenSubHeight(subText: string): number {
    return Math.max(28, branchLines(subText).length * miniLineH + miniPadY)
  }

  // Box chính ("box"/"deepen") cũng phải cao theo ĐÚNG số dòng chữ như branch/split — nhãn dạng
  // "Label:\ncâu dài" ở Lesson 3 dễ wrap ra 4-6 dòng, cao hơn nhiều so với boxH cố định 52, tràn chữ
  // ra ngoài khung nếu không tính động (bug tương tự split trước đây, nay lặp lại ở box thường).
  function boxLines(text: string): string[] {
    return multilineWrap(text, 20)
  }
  function boxNodeHeight(text: string): number {
    return Math.max(boxH, boxLines(text).length * 13 + 26)
  }

  // Box thường và split đối xứng quanh tâm lane (above = below); riêng "deepen" lệch hẳn xuống dưới
  // (box phụ chỉ nằm bên dưới box chính) nên phải tính above/below riêng cho từng lane thay vì 1 số
  // chiều cao duy nhất, để mạch ngang (các box "box" bình thường) luôn thẳng hàng nhau giữa các lane.
  // Box có `pill` (nhãn umbrella nền đặc, vd "Statement"/"Expansion 1") cần thêm khoảng trống PHÍA
  // TRÊN box cho pill đó — cộng vào nodeAbove riêng cho box này thay vì đổi boxH chung, vì chỉ 1 vài
  // box trong lane có pill (không phải tất cả).
  function nodeAbove(node: FlowNode): number {
    if (node.type === 'split') return splitTotalHeight(node.branches) / 2
    const base = boxNodeHeight(node.text) / 2
    if (node.type === 'box' && node.pill) return base + pillGap + pillH
    return base
  }
  function nodeBelow(node: FlowNode): number {
    if (node.type === 'split') return splitTotalHeight(node.branches) / 2
    const ownH = boxNodeHeight(node.text)
    if (node.type === 'deepen') return ownH / 2 + deepenGap + deepenSubHeight(node.subText)
    return ownH / 2
  }

  const maxNodes = Math.max(...lanes.map((l) => l.length), 1)
  // Mỗi box có tag cộng thêm tagExtra vào khoảng cách TỚI box kế tiếp (xem vòng lặp render bên dưới)
  // — bề rộng canvas phải cộng dồn ĐÚNG khoản này cho lane rộng nhất, dùng chung 1 giá trị cố định
  // (như trước: +50) không đủ khi 1 lane có NHIỀU box đều có tag (vd 3 tag "suffixing" liên tiếp).
  function laneTagExtra(lane: FlowNode[]): number {
    return lane.reduce((sum, n) => sum + (n.type === 'box' && n.tag ? Math.max(44, n.tag.length * 6 + 14) + 10 : 0), 0)
  }
  const maxTagExtra = Math.max(0, ...lanes.map(laneTagExtra))
  // arrowLabel/belowLabel dài mà KHÔNG có khoảng trắng để wrapLabel tách dòng (vd 1 từ liền
  // "DESCRIPTION"/"EFFECT") sẽ render nguyên 1 dòng dài hơn cả khoảng trống gapX=60 mặc định giữa 2
  // box, khiến chữ tràn đè lên mũi tên/box liền kề — phải nới rộng CHÍNH khoảng gap đó thay vì chỉ
  // ép cỡ chữ nhỏ lại (không giải quyết được vì wrapLabel không tách được từ liền không dấu cách).
  function labelGapExtra(node: FlowNode): number {
    if (node.type !== 'box') return 0
    const texts = [node.arrowLabel, node.belowLabel].filter((t): t is string => Boolean(t))
    if (texts.length === 0) return 0
    const maxTextW = Math.max(...texts.map((t) => t.length * 6.5))
    return Math.max(0, maxTextW - gapX)
  }
  function laneLabelGapExtra(lane: FlowNode[]): number {
    let sum = 0
    for (let i = 1; i < lane.length; i++) sum += labelGapExtra(lane[i])
    return sum
  }
  const maxLabelGapExtra = Math.max(0, ...lanes.map(laneLabelGapExtra))
  // laneTrailingNote (vd "X2 - X3") cần thêm chỗ trống ngang sau box cuối cùng của lane đó — tính
  // riêng thay vì gộp vào maxTagExtra vì đây là text tự do, không phải badge cỡ cố định.
  const maxTrailingNoteExtra = Math.max(
    0,
    ...(laneTrailingNote ?? []).map((n, li) => {
      if (!n) return 0
      const lastNode = lanes[li]?.[lanes[li].length - 1]
      const lastTagW = lastNode?.type === 'box' && lastNode.tag ? Math.max(44, lastNode.tag.length * 6 + 14) + 6 : 0
      return lastTagW + 18 + n.length * 6.5 + 20
    }),
  )
  const width = pad.left + maxNodes * boxW + (maxNodes - 1) * gapX + pad.right + maxTagExtra + maxTrailingNoteExtra + maxLabelGapExtra

  function laneAbove(lane: FlowNode[]): number {
    return Math.max(boxH / 2, ...lane.map(nodeAbove))
  }
  function laneBelow(lane: FlowNode[]): number {
    return Math.max(boxH / 2, ...lane.map(nodeBelow))
  }

  // Khối nhãn phía trên mỗi lane có 2 kiểu: chữ thường (laneLabels, cao cố định laneLabelH) hoặc
  // pill đặc + badge thời gian tuỳ chọn (lanePills, cao hơn vì có thêm dòng "(30s)/(45s)" phía trên
  // pill) — tính riêng theo từng lane vì không phải lane nào cũng dùng cùng 1 kiểu.
  function laneLabelBlockH(li: number): number {
    const p = lanePills?.[li]
    if (p) return (p.time ? timeH + timeGap : 0) + pillH
    if (laneLabels?.[li]) return laneLabelH
    return 0
  }
  const laneAboves = lanes.map(laneAbove)
  const laneBelows = lanes.map(laneBelow)
  const laneCenterYs: number[] = []
  const laneLabelTopYs: (number | null)[] = []
  let cursorY = pad.top
  for (let li = 0; li < lanes.length; li++) {
    const lbH = laneLabelBlockH(li)
    if (lbH > 0) {
      laneLabelTopYs.push(cursorY)
      cursorY += lbH + laneLabelGap
    } else {
      laneLabelTopYs.push(null)
    }
    laneCenterYs.push(cursorY + laneAboves[li])
    cursorY += laneAboves[li] + laneBelows[li] + laneGap
  }
  const height = cursorY - laneGap + pad.bottom

  // 2 layer riêng (arrow vẽ trước, box/tag/pill vẽ SAU đè lên) thay vì 1 chuỗi `body` duy nhất —
  // trong vòng lặp gốc, tag của box N (vẽ ở lượt N) từng bị mũi tên N→N+1 (vẽ ở lượt N+1, SAU đó)
  // đè lên vì cả hai đều nằm ở y=cy trong đúng khoảng trống giữa 2 box, khiến chữ tag mờ đi dưới nét
  // mũi tên xanh. Tách layer đảm bảo box/tag/pill luôn hiện rõ ràng phía trên mọi mũi tên.
  let arrowLayer = ''
  let boxLayer = ''
  lanes.forEach((lane, li) => {
    const cy = laneCenterYs[li]
    const topY = laneLabelTopYs[li]
    if (topY !== null) {
      const pill = lanePills?.[li]
      if (pill) {
        let py = topY
        if (pill.time) {
          boxLayer += `<text x="${pad.left}" y="${py + timeH - 2}" font-size="9.5" text-anchor="start" fill="${DR_INK_SOFT}" font-weight="700">${escapeXml(pill.time)}</text>`
          py += timeH + timeGap
        }
        const pillW = Math.max(56, pill.text.length * 6.2 + 20)
        boxLayer += `<rect x="${pad.left}" y="${py}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${DR_ROSE}"/>`
        boxLayer += `<text x="${pad.left + pillW / 2}" y="${py + pillH / 2 + 3.5}" font-size="9.5" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(pill.text)}</text>`
      } else if (laneLabels?.[li]) {
        boxLayer += `<text x="${pad.left}" y="${topY + laneLabelH - 5}" font-size="11" text-anchor="start" fill="${DR_ROSE}" font-weight="700">${escapeXml(laneLabels[li]!)}</text>`
      }
    }
    let x = pad.left
    let prevBoxRight = 0
    lane.forEach((node, ni) => {
      if (ni > 0) {
        // Dùng prevBoxRight ghi lại từ vòng lặp TRƯỚC thay vì suy ngược "x - gapX" — nếu box trước
        // có tag thì khoảng cách đã bị giãn thêm (xem tagExtra bên dưới), suy ngược theo gapX cố
        // định sẽ tính lố vào GIỮA thân box trước, khiến mũi tên vẽ lệch/không chạm box.
        const prevRight = prevBoxRight
        arrowLayer += `<line x1="${prevRight}" y1="${cy}" x2="${x}" y2="${cy}" stroke="#63A375" stroke-width="2.2" marker-end="url(#fArrow)"${arrowDash}/>`
        if (node.arrowLabel) {
          const midX = (prevRight + x) / 2
          const lines = wrapLabel(node.arrowLabel, 22)
          arrowLayer += lines
            .map((l, k) => `<text x="${midX}" y="${cy - 9 - (lines.length - 1 - k) * 11}" font-size="9.5" text-anchor="middle" fill="#5b6884">${escapeXml(l)}</text>`)
            .join('')
        }
        // belowLabel — chú thích IN ĐẬM đặt DƯỚI mũi tên (vd "CAUSE / DESCRIPTION"), khác với
        // arrowLabel luôn nằm TRÊN — sách Lesson 7 Part 2 in các nhãn này bằng chữ đỏ đậm ngay dưới
        // mũi tên nối Statement → Expansion 1 → Expansion 2.
        if (node.type === 'box' && node.belowLabel) {
          const midX = (prevRight + x) / 2
          const lines = wrapLabel(node.belowLabel, 22)
          arrowLayer += lines
            .map((l, k) => `<text x="${midX}" y="${cy + 18 + k * 11}" font-size="9.5" text-anchor="middle" fill="${DR_ROSE}" font-weight="700">${escapeXml(l)}</text>`)
            .join('')
        }
      }
      let ownBoxH = boxH
      if (node.type === 'box' || node.type === 'deepen') {
        ownBoxH = boxNodeHeight(node.text)
        boxLayer += `<rect x="${x}" y="${cy - ownBoxH / 2}" width="${boxW}" height="${ownBoxH}" rx="10" fill="#fff" stroke="#178A5A" stroke-width="2"/>`
        // highlights (tuỳ chọn) — tô đậm ĐÚNG cụm vừa thay/thêm trong câu, giống cách sách tô đỏ;
        // dùng chung tokenize/wrap greedy y hệt boxLines() nên số dòng/chiều cao không lệch giữa 2
        // nhánh render (có/không highlight).
        if (node.highlights && node.highlights.length > 0) {
          const hLines = wrapHighlightTokens(tokenizeWithHighlights(node.text, node.highlights), 20)
          const startY = cy - ((hLines.length - 1) * 13) / 2 + 4
          boxLayer += hLines
            .map((line, k) => `<text x="${x + boxW / 2}" y="${startY + k * 13}" font-size="11.5" text-anchor="middle" fill="#2b3a55" font-weight="600">${renderHighlightLine(line)}</text>`)
            .join('')
        } else {
          const lines = boxLines(node.text)
          const startY = cy - ((lines.length - 1) * 13) / 2 + 4
          boxLayer += lines
            .map((l, k) => `<text x="${x + boxW / 2}" y="${startY + k * 13}" font-size="11.5" text-anchor="middle" fill="#2b3a55" font-weight="600">${escapeXml(l)}</text>`)
            .join('')
        }
        if (node.type === 'box' && node.tag) {
          const tagW = Math.max(44, node.tag.length * 6 + 14)
          const tagH = 16
          const tagX = x + boxW - 6
          const tagY = cy - tagH / 2
          boxLayer += `<rect x="${tagX}" y="${tagY}" width="${tagW}" height="${tagH}" rx="8" fill="${DR_BOX}" stroke="${DR_BORDER}" stroke-width="1.2"/>`
          boxLayer += `<text x="${tagX + tagW / 2}" y="${tagY + tagH / 2 + 3}" font-size="8" text-anchor="middle" fill="${DR_INK_SOFT}" font-weight="600">${escapeXml(node.tag)}</text>`
        }
        // pill — nhãn umbrella nền hồng đặc phía TRÊN box (vd "Statement"/"Expansion 1"), khác `tag`
        // (badge xám nhỏ ở mép phải box) — không gian phía trên đã được nodeAbove() cấp riêng.
        if (node.type === 'box' && node.pill) {
          const pillW = Math.max(56, node.pill.length * 6.2 + 20)
          const pillX = x + boxW / 2 - pillW / 2
          const pillY = cy - ownBoxH / 2 - pillGap - pillH
          boxLayer += `<rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${DR_ROSE}"/>`
          boxLayer += `<text x="${x + boxW / 2}" y="${pillY + pillH / 2 + 3.5}" font-size="9.5" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(node.pill)}</text>`
        }
      }
      if (node.type === 'deepen') {
        const subH = deepenSubHeight(node.subText)
        const subW = boxW - 20
        const subX = x + 10
        const subY = cy + ownBoxH / 2 + deepenGap
        const cx = x + boxW / 2
        boxLayer += `<line x1="${cx}" y1="${cy + ownBoxH / 2}" x2="${cx}" y2="${subY - 2}" stroke="#B45309" stroke-width="1.8" marker-end="url(#dArrow)"/>`
        boxLayer += `<rect x="${subX}" y="${subY}" width="${subW}" height="${subH}" rx="8" fill="#f4f1ea" stroke="#B45309" stroke-width="1.6"/>`
        if (node.subHighlights && node.subHighlights.length > 0) {
          const hLines = wrapHighlightTokens(tokenizeWithHighlights(node.subText, node.subHighlights), miniWrapChars)
          const sy = subY + subH / 2 - ((hLines.length - 1) * miniLineH) / 2 + 4
          boxLayer += hLines
            .map((line, k) => `<text x="${cx}" y="${sy + k * miniLineH}" font-size="10" text-anchor="middle" fill="#2b3a55">${renderHighlightLine(line)}</text>`)
            .join('')
        } else {
          const lines = branchLines(node.subText)
          const sy = subY + subH / 2 - ((lines.length - 1) * miniLineH) / 2 + 4
          boxLayer += lines
            .map((l, k) => `<text x="${cx}" y="${sy + k * miniLineH}" font-size="10" text-anchor="middle" fill="#2b3a55">${escapeXml(l)}</text>`)
            .join('')
        }
      }
      if (node.type === 'split') {
        const heights = node.branches.map(branchHeight)
        const totalH = heights.reduce((s, h) => s + h, 0) + (node.branches.length - 1) * miniGap
        const stemX = x + 14
        boxLayer += `<line x1="${x}" y1="${cy}" x2="${stemX}" y2="${cy}" stroke="#63A375" stroke-width="1.6" stroke-dasharray="3,3"/>`
        let by = cy - totalH / 2
        node.branches.forEach((b, bi) => {
          const h = heights[bi]
          const boxCenterY = by + h / 2
          boxLayer += `<line x1="${stemX}" y1="${cy}" x2="${stemX}" y2="${boxCenterY}" stroke="#63A375" stroke-width="1.6" stroke-dasharray="3,3"/>`
          boxLayer += `<line x1="${stemX}" y1="${boxCenterY}" x2="${stemX + 10}" y2="${boxCenterY}" stroke="#63A375" stroke-width="1.6" stroke-dasharray="3,3"/>`
          boxLayer += `<rect x="${stemX + 10}" y="${by}" width="${boxW - 24}" height="${h}" rx="8" fill="#f4f1ea" stroke="#B45309" stroke-width="1.6"/>`
          const lines = branchLines(b)
          const sy = boxCenterY - ((lines.length - 1) * miniLineH) / 2 + 4
          boxLayer += lines
            .map((l, k) => `<text x="${stemX + 10 + (boxW - 24) / 2}" y="${sy + k * miniLineH}" font-size="10" text-anchor="middle" fill="#2b3a55">${escapeXml(l)}</text>`)
            .join('')
          by += h + miniGap
        })
      }
      prevBoxRight = x + boxW
      const tagExtra = node.type === 'box' && node.tag ? Math.max(44, node.tag.length * 6 + 14) + 10 : 0
      // Nới thêm gap TRƯỚC box kế tiếp nếu chính box đó có arrowLabel/belowLabel quá dài (xem
      // labelGapExtra ở trên) — phải nhìn TRƯỚC (lane[ni+1]) vì phần mở rộng phục vụ nhãn nằm TRÊN
      // MŨI TÊN dẫn vào box kế tiếp, không phải box hiện tại.
      const nextNode = lane[ni + 1]
      const nextLabelExtra = nextNode ? labelGapExtra(nextNode) : 0
      x += boxW + gapX + tagExtra + nextLabelExtra
    })
    const trailingNote = laneTrailingNote?.[li]
    if (trailingNote) {
      // Nếu box cuối cùng có tag (badge nhô ra khỏi mép phải box), phải cộng thêm bề rộng tag đó vào
      // điểm bắt đầu của trailing note — không thì note đè thẳng lên chữ trong tag (bug đã gặp: "X2 -
      // X3" chồng lên "suffixing" vì prevBoxRight chỉ là mép box, chưa tính phần tag nhô ra).
      const lastNode = lane[lane.length - 1]
      const lastTagW = lastNode?.type === 'box' && lastNode.tag ? Math.max(44, lastNode.tag.length * 6 + 14) : 0
      boxLayer += `<text x="${prevBoxRight + (lastTagW ? lastTagW + 6 : 0) + 18}" y="${cy + 4}" font-size="11.5" text-anchor="start" fill="${DR_INK}" font-weight="600">${escapeXml(trailingNote)}</text>`
    }
  })

  const body = arrowLayer + boxLayer
  const defs = `<defs><marker id="fArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#63A375"/></marker><marker id="dArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#B45309"/></marker></defs>`
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${body}</svg>`
}

// Bảng màu riêng cho 2 sơ đồ Direct Response (Speaking Lesson 1) — dùng lại đúng "rose" + "ink" đã
// có sẵn trong bảng màu app (ielts.css) để nhất quán, không tự chế màu mới, và KHÔNG sao chép màu
// đỏ mận/nền hồng của sách gốc (thiết kế riêng của NXB) — chỉ giữ đúng cấu trúc/bố cục/nội dung.
const DR_ROSE = '#c9667a'
const DR_INK = '#2b3a55'
const DR_INK_SOFT = '#5b6884'
const DR_BOX = '#f4f1ea'
const DR_BORDER = 'rgba(43,58,85,0.22)'
const DR_GREEN = '#178A5A' // badge "+" — mượn màu xanh lá đã có sẵn trong app (flowChain), báo hiệu tích cực/mức độ cao

function renderDRSteps(data: DRStepsData, title: string): string {
  const { qLabel, topLabels, answerLabel, elaborateLabel } = data
  const pad = 22
  const qW = 60
  const qH = 54
  const pillW = 150
  const pillH = 50
  const gap1 = 66
  const gap2 = 76
  const topBoxH = 44
  const topGapY = 30

  const qX = pad
  const pill1X = qX + qW + gap1
  const pill2X = pill1X + pillW + gap2
  const width = pill2X + pillW + pad
  const topY = pad
  const cy = topY + topBoxH + topGapY + qH / 2
  const height = cy + qH / 2 + pad

  const badge1X = qX + qW + gap1 / 2
  const badge2X = pill1X + pillW + gap2 / 2
  const box1W = 148
  const box2W = 190

  function topBox(cx: number, w: number, text: string): string {
    const x = cx - w / 2
    const lines = wrapLabel(text, 22)
    const lh = 13
    const startY = topY + topBoxH / 2 - ((lines.length - 1) * lh) / 2 + 4
    let s = `<rect x="${x}" y="${topY}" width="${w}" height="${topBoxH}" rx="9" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.5"/>`
    s += lines.map((l, k) => `<text x="${cx}" y="${startY + k * lh}" font-size="10.5" text-anchor="middle" fill="${DR_INK}" font-weight="600">${escapeXml(l)}</text>`).join('')
    return s
  }

  function pill(x: number, text: string): string {
    const lines = wrapLabel(text, 16)
    const lh = 14
    const startY = cy - ((lines.length - 1) * lh) / 2 + 4
    let s = `<rect x="${x}" y="${cy - pillH / 2}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${DR_ROSE}"/>`
    s += lines.map((l, k) => `<text x="${x + pillW / 2}" y="${startY + k * lh}" font-size="12.5" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(l)}</text>`).join('')
    return s
  }

  let body = ''
  body += topBox(badge1X, box1W, topLabels[0])
  body += topBox(badge2X, box2W, topLabels[1])

  // đường nét đứt: từ badge lên box chú thích phía trên
  body += `<line x1="${badge1X}" y1="${cy - 17}" x2="${badge1X}" y2="${topY + topBoxH + 3}" stroke="${DR_INK_SOFT}" stroke-width="1.4" stroke-dasharray="3,3" marker-end="url(#drArrowV)"/>`
  body += `<line x1="${badge2X}" y1="${cy - 33}" x2="${badge2X}" y2="${topY + topBoxH + 3}" stroke="${DR_INK_SOFT}" stroke-width="1.4" stroke-dasharray="3,3" marker-end="url(#drArrowV)"/>`

  // box "?"
  body += `<rect x="${qX}" y="${cy - qH / 2}" width="${qW}" height="${qH}" rx="12" fill="${DR_INK}"/>`
  body += `<text x="${qX + qW / 2}" y="${cy + 7}" font-size="20" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(qLabel)}</text>`

  // mũi tên "?" → pill 1, badge số 1 nằm ngay trên đường mũi tên
  body += `<line x1="${qX + qW}" y1="${cy}" x2="${pill1X}" y2="${cy}" stroke="${DR_ROSE}" stroke-width="2.2" marker-end="url(#drArrow)"/>`
  body += `<circle cx="${badge1X}" cy="${cy}" r="10" fill="#fff" stroke="${DR_INK}" stroke-width="1.6"/>`
  body += `<text x="${badge1X}" y="${cy + 4}" font-size="10.5" text-anchor="middle" fill="${DR_INK}" font-weight="700">1</text>`

  body += pill(pill1X, answerLabel)

  // mũi tên pill1 → pill2, badge số 2 nằm phía trên đường mũi tên (nối bằng 1 đoạn thẳng ngắn)
  body += `<line x1="${pill1X + pillW}" y1="${cy}" x2="${pill2X}" y2="${cy}" stroke="${DR_ROSE}" stroke-width="2.2" marker-end="url(#drArrow)"/>`
  body += `<line x1="${badge2X}" y1="${cy - 15}" x2="${badge2X}" y2="${cy - 2}" stroke="${DR_INK}" stroke-width="1.4"/>`
  body += `<circle cx="${badge2X}" cy="${cy - 25}" r="10" fill="#fff" stroke="${DR_INK}" stroke-width="1.6"/>`
  body += `<text x="${badge2X}" y="${cy - 21}" font-size="10.5" text-anchor="middle" fill="${DR_INK}" font-weight="700">2</text>`

  body += pill(pill2X, elaborateLabel)

  // Marker orient="auto" luôn xoay theo trục +x cục bộ của marker khớp với hướng thật của đường vẽ
  // — mũi tên phải được vẽ "chĩa theo +x" (giống drArrow) thì mới tự xoay đúng hướng bất kể ngang
  // hay dọc; vẽ mũi tên "chĩa lên" (theo -y) như trước sẽ bị lệch 90° sau khi auto-rotate.
  const defs = `<defs><marker id="drArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${DR_ROSE}"/></marker><marker id="drArrowV" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${DR_INK_SOFT}"/></marker></defs>`
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${body}</svg>`
}

function renderDRTypes(data: DRTypesData, title: string): string {
  const { qLabel, headerLabel, columns } = data
  const pad = 22
  const qW = 60
  const qH = 50
  const qGap = 34
  const colW = 202
  const colGap = 14
  const headerH = 36
  const titleH = 30
  const rowGap = 8

  const hasQ = Boolean(qLabel)
  const gridX = hasQ ? pad + qW + qGap : pad
  const width = gridX + columns.length * colW + (columns.length - 1) * colGap + pad

  function rowHeight(row: DRRow): number {
    if (row.kind === 'labeled') return multilineWrap(row.label, 20).length * 12 + 6 + multilineWrap(row.text, 20).length * 12 + 14
    const lines = multilineWrap(row.text, 20).length
    return Math.max(34, lines * 13 + 16)
  }
  function colHeight(col: DRColumn): number {
    return titleH + rowGap + col.rows.reduce((sum, r) => sum + rowHeight(r) + rowGap, 0)
  }
  const bodyH = Math.max(...columns.map(colHeight))
  const headerY = pad
  const hasHeader = Boolean(headerLabel)
  const gridY = hasHeader ? headerY + headerH + 14 : headerY
  const height = gridY + bodyH + pad

  let body = ''

  const headerX = gridX
  const headerW = columns.length * colW + (columns.length - 1) * colGap
  // box "?" bên trái — có header thì căn theo thanh đỏ, không thì căn thẳng theo hàng tiêu đề cột
  const qCenterY = hasHeader ? headerY + headerH / 2 : gridY + titleH / 2
  if (hasHeader) {
    // header đỏ (rose) trải hết chiều rộng khu 3 cột
    body += `<rect x="${headerX}" y="${headerY}" width="${headerW}" height="${headerH}" rx="10" fill="${DR_ROSE}"/>`
    body += `<text x="${headerX + headerW / 2}" y="${headerY + headerH / 2 + 5}" font-size="13" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(headerLabel!)}</text>`
  }
  if (hasQ) {
    const qY = qCenterY - qH / 2
    body += `<rect x="${pad}" y="${qY}" width="${qW}" height="${qH}" rx="12" fill="${DR_INK}"/>`
    body += `<text x="${pad + qW / 2}" y="${qY + qH / 2 + 6}" font-size="18" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(qLabel!)}</text>`
    body += `<line x1="${pad + qW}" y1="${qCenterY}" x2="${headerX}" y2="${qCenterY}" stroke="${DR_ROSE}" stroke-width="2.2" marker-end="url(#drArrow2)"/>`
  }

  columns.forEach((col, ci) => {
    const cx = gridX + ci * (colW + colGap)
    // tiêu đề cột: nền trắng, viền + chữ rose
    body += `<rect x="${cx}" y="${gridY}" width="${colW}" height="${titleH}" rx="${titleH / 2}" fill="#fff" stroke="${DR_ROSE}" stroke-width="1.8"/>`
    body += `<text x="${cx + colW / 2}" y="${gridY + titleH / 2 + 4}" font-size="11.5" text-anchor="middle" fill="${DR_ROSE}" font-weight="700">${escapeXml(col.title)}</text>`

    let ry = gridY + titleH + rowGap
    for (const row of col.rows) {
      const h = rowHeight(row)
      if (row.kind === 'desc' || row.kind === 'plain') {
        const lines = multilineWrap(row.text, 20)
        const lh = 12.5
        const startY = ry + h / 2 - ((lines.length - 1) * lh) / 2 + 4
        body += `<rect x="${cx}" y="${ry}" width="${colW}" height="${h}" rx="8" fill="${DR_BOX}"/>`
        body += lines
          .map((l, k) => `<text x="${cx + colW / 2}" y="${startY + k * lh}" font-size="10" text-anchor="middle" fill="${row.kind === 'desc' ? DR_INK_SOFT : DR_INK}">${escapeXml(l)}</text>`)
          .join('')
      } else if (row.kind === 'labeled') {
        const labelLines = multilineWrap(row.label, 20)
        const boxLines = multilineWrap(row.text, 20)
        const labelH = labelLines.length * 12 + 4
        const boxH = h - labelH - 6
        body += labelLines
          .map((l, k) => `<text x="${cx}" y="${ry + 10 + k * 12}" font-size="9.5" text-anchor="start" fill="${DR_INK}" font-weight="600">${escapeXml(l)}</text>`)
          .join('')
        const boxY = ry + labelH + 6
        const startY = boxY + boxH / 2 - ((boxLines.length - 1) * 12) / 2 + 4
        body += `<rect x="${cx}" y="${boxY}" width="${colW}" height="${boxH}" rx="8" fill="${DR_BOX}"/>`
        body += boxLines
          .map((l, k) => `<text x="${cx + colW / 2}" y="${startY + k * 12}" font-size="9.5" text-anchor="middle" fill="${DR_INK}">${escapeXml(l)}</text>`)
          .join('')
      } else {
        const icon = row.icon === 'up' ? '↑' : '↓'
        const iconColor = row.icon === 'up' ? DR_ROSE : DR_INK_SOFT
        const lines = wrapLabel(row.text, 17)
        const lh = 12.5
        const startY = ry + h / 2 - ((lines.length - 1) * lh) / 2 + 4
        body += `<rect x="${cx}" y="${ry}" width="${colW}" height="${h}" rx="8" fill="${DR_BOX}"/>`
        body += `<text x="${cx + 16}" y="${ry + h / 2 + 5}" font-size="14" text-anchor="middle" fill="${iconColor}" font-weight="700">${icon}</text>`
        body += lines
          .map((l, k) => `<text x="${cx + 16 + (colW - 16) / 2}" y="${startY + k * lh}" font-size="10" text-anchor="middle" fill="${DR_INK}">${escapeXml(l)}</text>`)
          .join('')
      }
      ry += h + rowGap
    }
  })

  const defs = `<defs><marker id="drArrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${DR_ROSE}"/></marker></defs>`
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${body}</svg>`
}

// "Level 3: Self — Preferences" — mỗi hàng: [loại câu hỏi] [câu hỏi ví dụ] --(nhãn "Direct
// response")--> [box viền rose: câu trả lời trực tiếp].
function renderDRRows(data: DRRowsData, title: string): string {
  const { rows } = data
  const pad = 20
  const typeW = 70
  const questionW = 208
  const arrowGap = 78
  const answerW = 224
  const rowGap = 18
  const boxMinH = 44

  const typeX = pad
  const questionX = typeX + typeW + 12
  const arrowX1 = questionX + questionW
  const arrowX2 = arrowX1 + arrowGap
  const answerX = arrowX2
  const width = answerX + answerW + pad

  function rowH(r: DRRowItem): number {
    const qLines = multilineWrap(r.question, 22).length
    const aLines = multilineWrap(r.answer, 24).length
    return Math.max(boxMinH, Math.max(qLines, aLines) * 13 + 20)
  }

  let y = pad
  let body = ''
  rows.forEach((r) => {
    const h = rowH(r)
    const cy = y + h / 2

    body += `<rect x="${typeX}" y="${y}" width="${typeW}" height="${h}" rx="9" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.5"/>`
    body += `<text x="${typeX + typeW / 2}" y="${cy + 5}" font-size="13" text-anchor="middle" fill="${DR_INK}" font-weight="700">${escapeXml(r.typeLabel)}</text>`

    const qLines = multilineWrap(r.question, 22)
    const qLh = 13
    const qStartY = cy - ((qLines.length - 1) * qLh) / 2 + 4
    body += `<rect x="${questionX}" y="${y}" width="${questionW}" height="${h}" rx="9" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.5"/>`
    body += qLines.map((l, k) => `<text x="${questionX + questionW / 2}" y="${qStartY + k * qLh}" font-size="11" text-anchor="middle" fill="${DR_INK}">${escapeXml(l)}</text>`).join('')

    body += `<line x1="${arrowX1}" y1="${cy}" x2="${arrowX2}" y2="${cy}" stroke="${DR_INK_SOFT}" stroke-width="1.4" stroke-dasharray="3,3" marker-end="url(#drArrowRow)"/>`
    const labelCx = (arrowX1 + arrowX2) / 2
    body += `<rect x="${labelCx - 36}" y="${cy - 22}" width="72" height="15" rx="7.5" fill="${DR_BOX}"/>`
    body += `<text x="${labelCx}" y="${cy - 11.5}" font-size="7.5" text-anchor="middle" fill="${DR_ROSE}" font-weight="700" letter-spacing="0.3">DIRECT RESPONSE</text>`

    const aLines = multilineWrap(r.answer, 24)
    const aLh = 13
    const aStartY = cy - ((aLines.length - 1) * aLh) / 2 + 4
    body += `<rect x="${answerX}" y="${y}" width="${answerW}" height="${h}" rx="9" fill="#fff" stroke="${DR_ROSE}" stroke-width="1.8"/>`
    body += aLines.map((l, k) => `<text x="${answerX + answerW / 2}" y="${aStartY + k * aLh}" font-size="11" text-anchor="middle" fill="${DR_INK}" font-weight="600">${escapeXml(l)}</text>`).join('')

    y += h + rowGap
  })
  const height = y - rowGap + pad

  const defs = `<defs><marker id="drArrowRow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${DR_INK_SOFT}"/></marker></defs>`
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${body}</svg>`
}

// "4. Specific approach" — các tầng (Level 1/2/3) nối bằng đường chấm dọc qua chấm tròn rose, mỗi
// tầng có 1 hàng pill xám liệt kê các nhánh con.
function renderTierList(data: TierListData, title: string): string {
  const { tiers } = data
  const pad = 20
  const dotR = 5
  const lineX = pad + dotR
  const labelX = lineX + 16
  const itemPillH = 34
  const itemGap = 10
  const tierGap = 20
  const labelH = 16

  function pillWidthFor(text: string): number {
    return Math.max(90, text.length * 6.4 + 28)
  }
  function rowWidth(items: string[]): number {
    return items.reduce((sum, it) => sum + pillWidthFor(it) + itemGap, -itemGap)
  }

  let y = pad
  const dotYs: number[] = []
  let itemsBody = ''
  tiers.forEach((t) => {
    dotYs.push(y + labelH / 2)
    itemsBody += `<text x="${labelX}" y="${y + labelH / 2 + 4}" font-size="11" fill="${DR_ROSE}" font-weight="700">${escapeXml(t.label)}</text>`
    y += labelH + 8

    let x = labelX
    t.items.forEach((it) => {
      const w = pillWidthFor(it)
      itemsBody += `<rect x="${x}" y="${y}" width="${w}" height="${itemPillH}" rx="8" fill="${DR_BOX}"/>`
      itemsBody += `<text x="${x + w / 2}" y="${y + itemPillH / 2 + 4}" font-size="10.5" text-anchor="middle" fill="${DR_INK}" font-weight="600">${escapeXml(it)}</text>`
      x += w + itemGap
    })
    y += itemPillH + tierGap
  })
  const height = y - tierGap + pad / 2
  const width = labelX + Math.max(...tiers.map((t) => rowWidth(t.items))) + pad

  let connector = ''
  for (let i = 0; i < dotYs.length - 1; i++) {
    connector += `<line x1="${lineX}" y1="${dotYs[i]}" x2="${lineX}" y2="${dotYs[i + 1]}" stroke="${DR_ROSE}" stroke-width="1.6" stroke-dasharray="3,3"/>`
  }
  const dots = dotYs.map((dy) => `<circle cx="${lineX}" cy="${dy}" r="${dotR}" fill="${DR_ROSE}"/>`).join('')

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${connector}${itemsBody}${dots}</svg>`
}

// Nhiều cột độc lập cạnh nhau (vd "Level 1: Society — Opinion") — mỗi cột 1 tiêu đề pill rose +
// danh sách box xếp chồng, box có thể gắn badge tròn +/− (chỉ cột nào có badge mới lùi text vào).
function renderBadgeColumns(data: BadgeColumnsData, title: string): string {
  const { columns } = data
  const pad = 20
  const colW = 226
  const colGap = 16
  const headerH = 28
  const itemGap = 8
  const badgeR = 8
  const badgeIndent = 24
  const textPad = 12

  // Nhóm theo dòng gốc (tách bởi \n) trước khi word-wrap từng dòng — để chỉ chấm bullet ở ĐẦU mỗi
  // dòng gốc (1 ý = 1 bullet), không phải mỗi dòng đã bị word-wrap xuống do quá dài.
  // wrapLabel dùng số ký tự cố định để tính xuống dòng — 22/26 từng để hụt khá xa so với colW thật
  // (item có badge chỉ lấp ~55% bề ngang box), verify trực quan qua nhiều mốc (22/30/34) trước khi
  // chốt 34/38, cùng nguyên nhân với bug từng gặp ở stemReference (label không wrap) và
  // compareHighlight (wrap quá hẹp cho box Trước/Sau).
  function groupedLines(it: BadgeColItem): string[][] {
    return it.text.split('\n').map((line) => wrapLabel(line, it.badge ? 34 : 38))
  }
  function itemHeight(it: BadgeColItem): number {
    const groups = groupedLines(it)
    const totalLines = groups.reduce((s, g) => s + g.length, 0)
    return Math.max(30, totalLines * 13 + 14)
  }
  function colHeight(col: BadgeColumn): number {
    return headerH + itemGap + col.items.reduce((s, it) => s + itemHeight(it) + itemGap, 0)
  }
  const bodyH = Math.max(...columns.map(colHeight))
  const width = pad * 2 + columns.length * colW + (columns.length - 1) * colGap
  const height = pad + bodyH + pad

  let body = ''
  columns.forEach((col, ci) => {
    const cx = pad + ci * (colW + colGap)
    let y = pad
    body += `<rect x="${cx}" y="${y}" width="${colW}" height="${headerH}" rx="${headerH / 2}" fill="${DR_ROSE}"/>`
    body += `<text x="${cx + colW / 2}" y="${y + headerH / 2 + 4}" font-size="10" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(col.header)}</text>`
    y += headerH + itemGap

    col.items.forEach((it) => {
      const h = itemHeight(it)
      const badgeColor = it.badge === '+' ? DR_GREEN : it.badge === '-' ? DR_ROSE : null
      const groups = groupedLines(it)
      const totalLines = groups.reduce((s, g) => s + g.length, 0)
      const bulleted = groups.length > 1
      const lh = 13
      const textX = (badgeColor ? cx + badgeIndent : cx) + textPad
      body += `<rect x="${cx}" y="${y}" width="${colW}" height="${h}" rx="9" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.4"/>`
      if (badgeColor) {
        body += `<circle cx="${cx + 15}" cy="${y + h / 2}" r="${badgeR}" fill="${badgeColor}"/>`
        body += `<text x="${cx + 15}" y="${y + h / 2 + 4}" font-size="10.5" text-anchor="middle" fill="#fff" font-weight="700">${it.badge}</text>`
      }
      let ly = y + h / 2 - ((totalLines - 1) * lh) / 2 + 4
      groups.forEach((subLines) => {
        subLines.forEach((l, k) => {
          const prefix = bulleted && k === 0 ? '• ' : ''
          const x = k === 0 ? textX : textX + 10
          body += `<text x="${x}" y="${ly}" font-size="10.5" text-anchor="start" fill="${DR_INK}">${escapeXml(prefix + l)}</text>`
          ly += lh
        })
      })
      y += h + itemGap
    })
  })

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

// "Cue card format" (Lesson 7 III) — 1 khung cue card thật duy nhất (các dòng xếp chồng, dòng bullet
// thụt lề) + pill hồng đặc chú thích từng CỤM dòng bên phải bằng dấu ngoặc vuông (vd "Topic" / "3
// short cues" / "1 main question") — trỏ ĐÚNG vào phần chữ tương ứng, khác hẳn bố cục 3-cột-ngang-
// bằng-nhau ban đầu (badgeColumns) vốn không khớp sách vì sách chỉ có 1 khối chữ duy nhất.
function renderCueFormatTable(data: CueFormatTableData, title: string): string {
  const { groups } = data
  const pad = 16
  const cardW = 300
  const lineH = 14
  const textPad = 12
  const indentPad = 14
  const wrapChars = 46

  type FlatLine = { text: string; indent?: boolean; groupIndex: number }
  const flat: FlatLine[] = []
  groups.forEach((g, gi) => {
    g.lines.forEach((ln) => {
      const wrapped = wrapLabel(ln.text, ln.indent ? wrapChars - 4 : wrapChars)
      wrapped.forEach((l) => flat.push({ text: l, indent: ln.indent, groupIndex: gi }))
    })
  })

  const innerH = flat.length * lineH
  const cardH = innerH + textPad
  const height = pad * 2 + cardH

  const groupSpanY: { y1: number; y2: number }[] = groups.map(() => ({ y1: Infinity, y2: -Infinity }))
  let body = ''
  body += `<rect x="${pad}" y="${pad}" width="${cardW}" height="${cardH}" rx="8" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.4"/>`
  let y = pad + textPad / 2 + lineH / 2 + 3.5
  flat.forEach((fl) => {
    const x = pad + textPad + (fl.indent ? indentPad : 0)
    const prefix = fl.indent ? '• ' : ''
    body += `<text x="${x}" y="${y}" font-size="9.5" text-anchor="start" fill="${DR_INK}">${escapeXml(prefix + fl.text)}</text>`
    const span = groupSpanY[fl.groupIndex]
    span.y1 = Math.min(span.y1, y - lineH / 2)
    span.y2 = Math.max(span.y2, y + lineH / 2)
    y += lineH
  })

  const brX = pad + cardW + 10
  const pillGapX = 12
  let maxPillRight = brX + pillGapX
  groups.forEach((g, gi) => {
    const { y1, y2 } = groupSpanY[gi]
    const cy = (y1 + y2) / 2
    body += `<line x1="${pad + cardW}" y1="${y1}" x2="${brX}" y2="${y1}" stroke="${DR_ROSE}" stroke-width="1.3"/>`
    body += `<line x1="${pad + cardW}" y1="${y2}" x2="${brX}" y2="${y2}" stroke="${DR_ROSE}" stroke-width="1.3"/>`
    body += `<line x1="${brX}" y1="${y1}" x2="${brX}" y2="${y2}" stroke="${DR_ROSE}" stroke-width="1.3"/>`
    body += `<line x1="${brX}" y1="${cy}" x2="${brX + pillGapX}" y2="${cy}" stroke="${DR_ROSE}" stroke-width="1.3"/>`
    const pillW = Math.max(70, g.tag.length * 6.2 + 20)
    const pillH = 18
    const pillX = brX + pillGapX
    const pillY = cy - pillH / 2
    body += `<rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${DR_ROSE}"/>`
    body += `<text x="${pillX + pillW / 2}" y="${pillY + pillH / 2 + 3.5}" font-size="9.5" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(g.tag)}</text>`
    maxPillRight = Math.max(maxPillRight, pillX + pillW)
  })

  const width = maxPillRight + pad
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

// So sánh NGANG vài cách diễn đạt cho cùng 1 câu — mỗi row là 2+ cột kề nhau, mỗi cột 1 pill nhãn
// màu + 1 khung nét đứt bên dưới chứa mảnh câu, verdict (✗/✓ + lý do ngắn) in dưới mỗi row — dựng
// lại đúng bố cục sách cho "Tư duy cũ vs Tư duy mới của DOL" (khác flowChain ở chỗ không có mũi tên
// nối, vì đây là 2 mảnh câu ĐỨNG CẠNH NHAU chứ không phải 1 chuỗi tiếp nối). colW=190/wrapChars=30
// đã verify trực quan (190/200/220) trước khi chốt — nhỏ gọn nhất mà vẫn đọc được.
function renderPairFlow(data: PairFlowData, title: string): string {
  const pad = 14
  const colW = 190
  const colGap = 14
  const headerH = 20
  const boxPadY = 6
  const lineH = 10.5
  const rowGap = 10
  const verdictGap = 4
  const wrapChars = 30

  const maxCols = Math.max(...data.rows.map((r) => r.items.length), 1)
  const width = pad * 2 + maxCols * colW + (maxCols - 1) * colGap

  function itemLines(item: PairFlowItem): string[] {
    return multilineWrap(item.text, wrapChars)
  }
  function itemBoxH(item: PairFlowItem): number {
    return Math.max(24, itemLines(item).length * lineH + boxPadY * 2)
  }
  function rowBoxH(row: PairFlowRow): number {
    return Math.max(...row.items.map(itemBoxH))
  }

  let y = pad
  let body = ''
  data.rows.forEach((row) => {
    if (row.sectionLabel) {
      body += `<text x="${pad}" y="${y + 9}" font-size="10.5" text-anchor="start" fill="${DR_INK}" font-weight="700">${escapeXml(row.sectionLabel)}</text>`
      y += 9 + 8
    }
    const boxH = rowBoxH(row)
    row.items.forEach((item, ci) => {
      const x = pad + ci * (colW + colGap)
      const color = item.color === 'rose' ? DR_ROSE : DR_GREEN
      body += `<rect x="${x}" y="${y}" width="${colW}" height="${headerH}" rx="${headerH / 2}" fill="${color}"/>`
      body += `<text x="${x + colW / 2}" y="${y + headerH / 2 + 3.5}" font-size="8.5" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(item.header)}</text>`
      const boxY = y + headerH + 6
      body += `<rect x="${x}" y="${boxY}" width="${colW}" height="${boxH}" rx="7" fill="${DR_BOX}" stroke="${DR_BORDER}" stroke-width="1.3" stroke-dasharray="4,3"/>`
      const lines = itemLines(item)
      const startY = boxY + boxH / 2 - ((lines.length - 1) * lineH) / 2 + 3
      body += lines
        .map((l, k) => `<text x="${x + colW / 2}" y="${startY + k * lineH}" font-size="8.5" text-anchor="middle" fill="${DR_INK}">${escapeXml(l)}</text>`)
        .join('')
    })
    y += headerH + 6 + boxH
    if (row.verdict) {
      const vLines = wrapLabel(row.verdict, 70)
      const icon = row.verdictOk ? '✓' : '✗'
      const vColor = row.verdictOk ? DR_GREEN : DR_ROSE
      y += verdictGap + 4
      body += vLines
        .map((l, k) => `<text x="${pad}" y="${y + k * 11}" font-size="8.5" text-anchor="start" fill="${vColor}" font-weight="700">${k === 0 ? icon + ' ' : ''}${escapeXml(l)}</text>`)
        .join('')
      y += (vLines.length - 1) * 11
    }
    y += rowGap
  })

  const height = y - rowGap + pad / 2
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

// Sơ đồ "phương pháp" (Speaking Lesson 5, mục 3) — chuỗi ngang N box nối bằng đường thẳng KHÔNG mũi
// tên (đúng kiểu khung công thức của sách), 1 box có nhánh đứt nét xuống box "relationships" rồi từ
// đó nối tiếp đứt nét lên 1 box khác trong chuỗi — 1 marker orient=auto duy nhất (vẽ theo +x) tự xoay
// đúng hướng cho cả 2 đoạn (xuống/lên), không cần 2 marker riêng.
function renderMethodDiagram(data: MethodDiagramData, title: string): string {
  const pad = 16
  const boxW = 108
  const gapX = 34
  const tagW = 42
  const tagH = 15
  const wrapChars = 14

  function boxLines(b: MethodChainBox): string[] {
    return wrapLabel(b.text, wrapChars)
  }
  const boxH = Math.max(30, Math.max(...data.chain.map((b) => boxLines(b).length)) * 12 + 12)
  const chainY = pad + tagH / 2 + 4

  const n = data.chain.length
  const boxXs = data.chain.map((_, i) => pad + i * (boxW + gapX))
  const chainWidth = n * boxW + (n - 1) * gapX

  let body = ''
  boxXs.forEach((x, i) => {
    if (i > 0) {
      const prevRight = boxXs[i - 1] + boxW
      body += `<line x1="${prevRight}" y1="${chainY + boxH / 2}" x2="${x}" y2="${chainY + boxH / 2}" stroke="${DR_INK_SOFT}" stroke-width="1.4"/>`
    }
  })
  data.chain.forEach((b, i) => {
    const x = boxXs[i]
    const lines = boxLines(b)
    body += `<rect x="${x}" y="${chainY}" width="${boxW}" height="${boxH}" rx="8" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.4"/>`
    const startY = chainY + boxH / 2 - ((lines.length - 1) * 12) / 2 + 4
    body += lines
      .map((l, k) => `<text x="${x + boxW / 2}" y="${startY + k * 12}" font-size="10" text-anchor="middle" fill="${DR_INK}" font-weight="600">${escapeXml(l)}</text>`)
      .join('')
    if (b.tag) {
      const tagX = x + 6
      const tagY = chainY - tagH / 2
      body += `<rect x="${tagX}" y="${tagY}" width="${tagW}" height="${tagH}" rx="${tagH / 2}" fill="${DR_ROSE}"/>`
      body += `<text x="${tagX + tagW / 2}" y="${tagY + tagH / 2 + 3}" font-size="7.5" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(b.tag)}</text>`
    }
  })

  const fromX = boxXs[data.branchFromIndex] + boxW / 2
  const branchY = chainY + boxH + 30
  const branchW = 160
  const branchX = Math.max(pad, fromX - branchW / 2)
  const itemLineH = 14
  const labelPillH = 15
  const itemPadTop = labelPillH + 14
  const branchH = itemPadTop + data.branchItems.length * itemLineH + 8

  body += `<line x1="${fromX}" y1="${chainY + boxH}" x2="${fromX}" y2="${branchY - 2}" stroke="${DR_INK_SOFT}" stroke-width="1.4" stroke-dasharray="3,3" marker-end="url(#mdArrow)"/>`

  body += `<rect x="${branchX}" y="${branchY}" width="${branchW}" height="${branchH}" rx="8" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.4" stroke-dasharray="4,3"/>`
  const labelPillW = Math.max(70, data.branchLabel.length * 6 + 20)
  body += `<rect x="${branchX + 10}" y="${branchY + 8}" width="${labelPillW}" height="${labelPillH}" rx="${labelPillH / 2}" fill="${DR_ROSE}"/>`
  body += `<text x="${branchX + 10 + labelPillW / 2}" y="${branchY + 8 + labelPillH / 2 + 3}" font-size="8" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(data.branchLabel)}</text>`
  data.branchItems.forEach((item, i) => {
    const iy = branchY + itemPadTop + i * itemLineH + 10
    if (item.emphasis) {
      const w = Math.max(50, item.text.length * 6 + 16)
      body += `<rect x="${branchX + 10}" y="${iy - 10}" width="${w}" height="14" rx="4" fill="rgba(23,138,90,0.14)" stroke="${DR_GREEN}" stroke-width="1"/>`
      body += `<text x="${branchX + 10 + w / 2}" y="${iy}" font-size="8.5" text-anchor="middle" fill="${DR_GREEN}" font-weight="700">${escapeXml(item.text)}</text>`
    } else {
      body += `<text x="${branchX + 10}" y="${iy}" font-size="8.5" text-anchor="start" fill="${DR_INK}">${escapeXml(item.text)}</text>`
    }
  })

  const toX = boxXs[data.branchToIndex] + boxW / 2
  const branchRightY = branchY + branchH / 2
  const branchRightX = branchX + branchW
  body += `<line x1="${branchRightX}" y1="${branchRightY}" x2="${toX}" y2="${branchRightY}" stroke="${DR_INK_SOFT}" stroke-width="1.4" stroke-dasharray="3,3"/>`
  body += `<line x1="${toX}" y1="${branchRightY}" x2="${toX}" y2="${chainY + boxH + 2}" stroke="${DR_INK_SOFT}" stroke-width="1.4" stroke-dasharray="3,3" marker-end="url(#mdArrow)"/>`

  const width = Math.max(chainWidth + pad * 2, branchRightX + pad, toX + pad)
  const height = branchY + branchH + pad
  const defs = `<defs><marker id="mdArrow" markerWidth="8" markerHeight="8" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${DR_INK_SOFT}"/></marker></defs>`
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${body}</svg>`
}

// colW=155/wrapChars=20 đã verify trực quan qua 3 mốc (140/155/170) trước khi chốt.
function renderConnectorGrid(data: ConnectorGridData, title: string): string {
  const pad = 14
  const colW = 155
  const colGap = 8
  const headerH = 20
  const boxPadY = 6
  const lineH = 11
  const rowGap = 6
  const groupGap = 16
  const titleH = 16
  const wrapChars = 20

  function cellLines(text: string): string[] {
    return wrapLabel(text, wrapChars)
  }
  function cellH(text: string): number {
    return Math.max(24, cellLines(text).length * lineH + boxPadY * 2)
  }

  let y = pad
  let body = ''
  let maxCols = 3
  data.groups.forEach((g) => {
    const hasSuffixing = g.rows.some((r) => r.suffixing)
    const suffixSet = new Set(g.rows.map((r) => r.suffixing || ''))
    const suffixMerged = hasSuffixing && suffixSet.size <= 1
    const nCols = hasSuffixing ? 4 : 3
    maxCols = Math.max(maxCols, nCols)

    body += `<text x="${pad}" y="${y + titleH - 4}" font-size="10.5" text-anchor="start" fill="${DR_ROSE}" font-weight="700">${escapeXml(g.title)}</text>`
    y += titleH + 4

    const colX = (i: number) => pad + i * (colW + colGap)
    const headers = hasSuffixing ? ['SV (chính)', 'connector', g.phuLabel ?? 'SV (phụ)', 'suffixing'] : ['SV (chính)', 'connector', g.phuLabel ?? 'SV (phụ)']
    headers.forEach((h, i) => {
      body += `<rect x="${colX(i)}" y="${y}" width="${colW}" height="${headerH}" rx="6" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.3"/>`
      body += `<text x="${colX(i) + colW / 2}" y="${y + headerH / 2 + 3.5}" font-size="8.5" text-anchor="middle" fill="${DR_INK}" font-weight="700">${escapeXml(h)}</text>`
    })
    y += headerH + 6

    const rowHeights = g.rows.map((r) => Math.max(cellH(r.connector), cellH(r.svPhu)))
    let totalRowsH = rowHeights.reduce((s, h) => s + h, 0) + (g.rows.length - 1) * rowGap
    // Cột SV (chính) gộp thành 1 khung cao = totalRowsH, nhưng totalRowsH trên chỉ tính theo
    // connector/SV phụ — nhóm chỉ có 1 row (Outcome, Exaggeration, Condition, Anti-outcome...) mà
    // câu SV chính lại dài (thường ~4 dòng) thì totalRowsH quá thấp so với nhu cầu thật của SV
    // chính, khiến chữ tràn ra ngoài khung (không có dấu hiệu lỗi nào khác ngoài nhìn bằng mắt).
    // Bù phần thiếu vào row CUỐI để cả box SV chính lẫn box connector/SV phụ của row đó cùng giãn ra
    // theo, tránh vừa tràn chữ vừa lệch đáy giữa các cột.
    const svChinhNeeded = cellH(g.svChinh)
    if (totalRowsH < svChinhNeeded) {
      rowHeights[rowHeights.length - 1] += svChinhNeeded - totalRowsH
      totalRowsH = svChinhNeeded
    }

    body += `<rect x="${colX(0)}" y="${y}" width="${colW}" height="${totalRowsH}" rx="7" fill="${DR_BOX}" stroke="${DR_BORDER}" stroke-width="1.3" stroke-dasharray="4,3"/>`
    const svLines = cellLines(g.svChinh)
    const svStartY = y + totalRowsH / 2 - ((svLines.length - 1) * lineH) / 2 + 3
    body += svLines.map((l, k) => `<text x="${colX(0) + colW / 2}" y="${svStartY + k * lineH}" font-size="8.5" text-anchor="middle" fill="${DR_INK}">${escapeXml(l)}</text>`).join('')

    // connector/suffixing tô đậm màu rose (đúng tinh thần sách tô đỏ 2 cột này — phần CÔNG THỨC cần
    // học) — dùng màu rose sẵn có của app thay vì sao chép đỏ của sách; SV (chính)/SV (phụ) giữ màu
    // mực thường vì chỉ là câu ví dụ minh hoạ, không phải phần cần nhớ.
    let ry = y
    g.rows.forEach((r, ri) => {
      const h = rowHeights[ri]
      ;[r.connector, r.svPhu].forEach((text, ci) => {
        const x = colX(ci + 1)
        const isConnector = ci === 0
        body += `<rect x="${x}" y="${ry}" width="${colW}" height="${h}" rx="7" fill="${DR_BOX}" stroke="${DR_BORDER}" stroke-width="1.3" stroke-dasharray="4,3"/>`
        const lines = cellLines(text)
        const sy = ry + h / 2 - ((lines.length - 1) * lineH) / 2 + 3
        body += lines
          .map(
            (l, k) =>
              `<text x="${x + colW / 2}" y="${sy + k * lineH}" font-size="8.5" text-anchor="middle" fill="${isConnector ? DR_ROSE : DR_INK}"${isConnector ? ' font-weight="700"' : ''}>${escapeXml(l)}</text>`,
          )
          .join('')
      })
      ry += h + rowGap
    })

    if (hasSuffixing) {
      const sx = colX(3)
      if (suffixMerged) {
        const val = [...suffixSet].find(Boolean) || ''
        body += `<rect x="${sx}" y="${y}" width="${colW}" height="${totalRowsH}" rx="7" fill="${DR_BOX}" stroke="${DR_BORDER}" stroke-width="1.3" stroke-dasharray="4,3"/>`
        const lines = cellLines(val)
        const sy = y + totalRowsH / 2 - ((lines.length - 1) * lineH) / 2 + 3
        body += lines.map((l, k) => `<text x="${sx + colW / 2}" y="${sy + k * lineH}" font-size="8.5" text-anchor="middle" fill="${DR_ROSE}" font-weight="700">${escapeXml(l)}</text>`).join('')
      } else {
        let sry = y
        g.rows.forEach((r, ri) => {
          const h = rowHeights[ri]
          body += `<rect x="${sx}" y="${sry}" width="${colW}" height="${h}" rx="7" fill="${DR_BOX}" stroke="${DR_BORDER}" stroke-width="1.3" stroke-dasharray="4,3"/>`
          const lines = cellLines(r.suffixing || '')
          const sy = sry + h / 2 - ((lines.length - 1) * lineH) / 2 + 3
          body += lines.map((l, k) => `<text x="${sx + colW / 2}" y="${sy + k * lineH}" font-size="8.5" text-anchor="middle" fill="${DR_ROSE}" font-weight="700">${escapeXml(l)}</text>`).join('')
          sry += h + rowGap
        })
      }
    }

    y += totalRowsH + groupGap
  })

  const width = pad * 2 + maxCols * colW + (maxCols - 1) * colGap
  const height = y - groupGap + pad / 2
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

function renderGroupedChain(data: GroupedChainData, title: string): string {
  const pad = 16
  const boxW = 82
  const boxH = 30
  const boxGap = 14
  const pauseGap = 34
  const umbrellaH = 22
  const umbrellaGap = 8
  const chunkGap = 14
  const chunkLineH = 10

  // Bước 1: tính x của từng box trước (đi 1 lượt ngang qua mọi group), ghi lại vị trí group để vẽ
  // umbrella + PAUSE sau — làm 2 lượt vì umbrella cần biết trước x đầu/cuối của cả group.
  // tagExtra — khoảng cách bù thêm sau 1 box có `tag` (badge nhô ra khỏi mép phải box) để box/group
  // KẾ TIẾP không đè lên badge đó — thiếu bù này thì mọi tag trừ tag ở box cuối cùng đều bị box sau
  // che mất nửa (bug đã gặp: chỉ tag "suffixing" ở Expansion cuối hiện được, 2 tag trước bị che).
  const tagExtra = 36
  let x = pad
  const boxXs: number[][] = []
  const groupSpans: { x1: number; x2: number }[] = []
  const pausePositions: number[] = []
  data.groups.forEach((group, gi) => {
    const xs: number[] = []
    group.boxes.forEach((box, bi) => {
      xs.push(x)
      x += boxW
      if (bi < group.boxes.length - 1) x += boxGap + (box.tag ? tagExtra : 0)
    })
    boxXs.push(xs)
    groupSpans.push({ x1: xs[0], x2: xs[xs.length - 1] + boxW })
    const isLast = gi === data.groups.length - 1
    const lastBoxTagExtra = group.boxes[group.boxes.length - 1]?.tag ? tagExtra : 0
    if (group.pauseAfter) {
      pausePositions.push(x + lastBoxTagExtra + (isLast ? boxGap : boxGap + pauseGap) / 2 + (isLast ? 10 : 0))
      x += lastBoxTagExtra + (isLast ? boxGap + 40 : boxGap + pauseGap)
    } else if (!isLast) {
      x += boxGap + lastBoxTagExtra
    }
  })
  const hasTag = data.groups.some((g) => g.boxes.some((b) => b.tag))
  const width = x + pad + (hasTag ? 40 : 0)

  const hasAnyLabel = data.groups.some((g) => g.label)
  const boxY = pad + (hasAnyLabel ? umbrellaH + umbrellaGap : 0)
  const hasAnyChunk = data.groups.some((g) => g.boxes.some((b) => b.chunking))

  const bandPad = 10
  let band: { x1: number; x2: number; y1: number; noteLines: string[] } | null = null
  let bandNoteH = 0
  if (data.band) {
    const fromSpan = groupSpans[data.band.fromGroupIndex]
    const bx1 = fromSpan.x1 - bandPad
    const bx2 = width - pad + bandPad
    const noteWrapChars = Math.max(20, Math.floor((bx2 - bx1 - 2 * bandPad) / 4.3))
    const noteLines = wrapLabel(data.band.note, noteWrapChars)
    bandNoteH = noteLines.length * 10 + 10
    band = { x1: bx1, x2: bx2, y1: pad - bandPad, noteLines }
  }

  const height = boxY + boxH + (hasAnyChunk ? chunkGap + chunkLineH + 4 : 0) + bandNoteH + pad

  let body = ''
  if (band) {
    body += `<rect x="${band.x1}" y="${band.y1}" width="${band.x2 - band.x1}" height="${height - pad - band.y1 + bandPad}" rx="10" fill="rgba(201,102,122,0.12)"/>`
  }
  // Umbrella boxes
  data.groups.forEach((group, gi) => {
    if (!group.label) return
    const { x1, x2 } = groupSpans[gi]
    body += `<rect x="${x1}" y="${pad}" width="${x2 - x1}" height="${umbrellaH}" rx="6" fill="#fff" stroke="${DR_ROSE}" stroke-width="1.4"/>`
    body += `<text x="${(x1 + x2) / 2}" y="${pad + umbrellaH / 2 + 3.5}" font-size="9.5" text-anchor="middle" fill="${DR_ROSE}" font-weight="700">${escapeXml(group.label)}</text>`
  })

  // Arrows connecting every box in reading order (within a group AND across groups) — 1 continuous
  // chain visually, chỉ khác nhau ở khoảng cách (rộng hơn khi có PAUSE ở giữa).
  const allBoxXs: number[] = ([] as number[]).concat(...boxXs)
  for (let i = 1; i < allBoxXs.length; i++) {
    const prevRight = allBoxXs[i - 1] + boxW
    const curX = allBoxXs[i]
    body += `<line x1="${prevRight}" y1="${boxY + boxH / 2}" x2="${curX}" y2="${boxY + boxH / 2}" stroke="#63A375" stroke-width="1.8" marker-end="url(#gcArrow)"/>`
  }
  // Mũi tên "đuôi" sau box cuối cùng nếu group cuối có pauseAfter (giống sách: mũi tên chạy tiếp
  // vào khoảng trống rồi mới tới chữ PAUSE).
  const lastGroup = data.groups[data.groups.length - 1]
  if (lastGroup?.pauseAfter) {
    const lastX = allBoxXs[allBoxXs.length - 1] + boxW
    body += `<line x1="${lastX}" y1="${boxY + boxH / 2}" x2="${lastX + boxGap + 16}" y2="${boxY + boxH / 2}" stroke="#63A375" stroke-width="1.8" marker-end="url(#gcArrow)"/>`
  }

  // PAUSE labels — đặt giữa khoảng trống ngay sau group có pauseAfter.
  let pauseIdx = 0
  data.groups.forEach((group) => {
    if (!group.pauseAfter) return
    const px = pausePositions[pauseIdx]
    pauseIdx += 1
    body += `<text x="${px}" y="${boxY + boxH / 2 - 8}" font-size="8" text-anchor="middle" fill="${DR_ROSE}" font-weight="700">PAUSE</text>`
  })

  // Boxes + CHUNKING annotations
  data.groups.forEach((group, gi) => {
    group.boxes.forEach((box, bi) => {
      const bx = boxXs[gi][bi]
      body += `<rect x="${bx}" y="${boxY}" width="${boxW}" height="${boxH}" rx="7" fill="#fff" stroke="#178A5A" stroke-width="1.6"/>`
      const lines = wrapLabel(box.text, 12)
      const startY = boxY + boxH / 2 - ((lines.length - 1) * 11) / 2 + 3.5
      body += lines
        .map((l, k) => `<text x="${bx + boxW / 2}" y="${startY + k * 11}" font-size="9" text-anchor="middle" fill="${DR_INK}" font-weight="600">${escapeXml(l)}</text>`)
        .join('')
      if (box.tag) {
        const tagW = Math.max(40, box.tag.length * 5.5 + 12)
        const tagH = 14
        const tagX = bx + boxW - 6
        const tagY = boxY + boxH / 2 - tagH / 2
        body += `<rect x="${tagX}" y="${tagY}" width="${tagW}" height="${tagH}" rx="7" fill="${DR_BOX}" stroke="${DR_BORDER}" stroke-width="1.2"/>`
        body += `<text x="${tagX + tagW / 2}" y="${tagY + tagH / 2 + 2.5}" font-size="7" text-anchor="middle" fill="${DR_INK_SOFT}" font-weight="600">${escapeXml(box.tag)}</text>`
      }
      if (box.chunking) {
        const cx = bx + boxW / 2
        const lineTopY = boxY + boxH + chunkGap
        body += `<line x1="${cx}" y1="${lineTopY}" x2="${cx}" y2="${boxY + boxH + 2}" stroke="${DR_ROSE}" stroke-width="1.4" stroke-dasharray="3,3" marker-end="url(#gcUpArrow)"/>`
        body += `<text x="${cx}" y="${lineTopY + chunkLineH}" font-size="7.5" text-anchor="middle" fill="${DR_ROSE}" font-weight="700">CHUNKING</text>`
      }
    })
  })

  if (band) {
    const noteY = boxY + boxH + bandPad + 8
    const noteCx = (band.x1 + band.x2) / 2
    body += band.noteLines
      .map((l, k) => `<text x="${noteCx}" y="${noteY + k * 10}" font-size="7.5" text-anchor="middle" fill="${DR_ROSE}" font-weight="700">${escapeXml(l)}</text>`)
      .join('')
  }

  const defs = `<defs>
    <marker id="gcArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#63A375"/></marker>
    <marker id="gcUpArrow" markerWidth="8" markerHeight="8" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${DR_ROSE}"/></marker>
  </defs>`
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${body}</svg>`
}

// Khung nhỏ — mỗi hàng 1 dòng "nhãn: giá trị" (bold + thường), không header/viền dày như
// stemReference, vì nội dung thực tế chỉ vài chữ (stemReference vẽ ra to hơn hẳn nhu cầu thật).
function renderMiniFacts(data: MiniFactsData, title: string): string {
  const pad = 12
  const lineH = 18
  const boxPadX = 12
  const fontSize = 10

  const bulletIndent = 14
  const bulletLineH = 14

  // width tối thiểu 380 (không chỉ đo khít theo chữ) — canvas quá hẹp so với chiều rộng cột đọc thật
  // (~500-900px) khiến CSS width:100% phải giãn tỉ lệ lớn, làm chữ/khoảng cách trông to bất thường
  // dù font-size khai báo nhỏ (bug tương tự đã gặp: canvas quá RỘNG so với chiều cao gây chữ bị ép
  // dẹt ở flowChain 1 lane 7 box — đây là chiều ngược lại, quá HẸP nên bị phóng to).
  const widestBullet = Math.max(0, ...data.rows.flatMap((r) => r.bullets?.map((b) => b.length + 3) ?? []))
  const width = Math.max(380, Math.max(widestBullet, ...data.rows.map((r) => r.label.length + r.value.length + 2)) * 5.4 + boxPadX * 2)
  const rowH = data.rows.map((r) => lineH + (r.bullets?.length ?? 0) * bulletLineH)
  const height = pad * 2 + rowH.reduce((s, h) => s + h, 0)

  let body = `<rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="8" fill="${DR_BOX}" stroke="${DR_BORDER}" stroke-width="1.3"/>`
  let y = pad
  data.rows.forEach((r) => {
    body += `<text x="${boxPadX}" y="${y + fontSize}" font-size="${fontSize}" text-anchor="start"><tspan fill="${DR_INK}" font-weight="700">${escapeXml(r.label)}:</tspan> <tspan fill="${DR_INK_SOFT}">${escapeXml(r.value)}</tspan></text>`
    y += lineH
    r.bullets?.forEach((b) => {
      body += `<text x="${boxPadX + bulletIndent}" y="${y + fontSize - 3}" font-size="${fontSize - 1}" text-anchor="start" fill="${DR_INK_SOFT}">• ${escapeXml(b)}</text>`
      y += bulletLineH
    })
  })

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

// Lưới N thẻ (mặc định 2 cột) — mỗi thẻ: pill nhãn xám + đoạn giới thiệu + bullet list + đoạn kết —
// đúng bố cục "sample cue cards" trong sách (PLACE/PERSON/OBJECT/EVENT xếp 2x2).
function renderCardGrid(data: CardGridData, title: string): string {
  const pad = 14
  const cols = data.columns ?? 2
  const colW = 260
  const colGap = 14
  const cardPad = 10
  const lineH = 11
  const headerH = 16
  const headerGap = 8
  const introWrap = 48
  const bulletWrap = 44

  function textLines(t: string): string[] {
    return wrapLabel(t, introWrap)
  }
  function bulletLines(b: string): string[] {
    return wrapLabel(b, bulletWrap)
  }
  function cardHeight(card: CueCard): number {
    let h = headerH + headerGap
    h += textLines(card.intro).length * lineH + 4
    card.bullets.forEach((b) => {
      h += bulletLines(b).length * lineH
    })
    if (card.outro) h += 4 + textLines(card.outro).length * lineH
    return h + cardPad * 2
  }

  const rows = Math.ceil(data.cards.length / cols)
  const rowHeights: number[] = []
  for (let r = 0; r < rows; r++) {
    const rowCards = data.cards.slice(r * cols, r * cols + cols)
    rowHeights.push(Math.max(...rowCards.map(cardHeight)))
  }

  let body = ''
  data.cards.forEach((card, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = pad + col * (colW + colGap)
    const cy = pad + rowHeights.slice(0, row).reduce((s, h) => s + h + colGap, 0)
    const h = rowHeights[row]
    body += `<rect x="${x}" y="${cy}" width="${colW}" height="${h}" rx="8" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.3"/>`

    let ty = cy + cardPad
    const headerW = Math.max(50, card.header.length * 6 + 16)
    body += `<rect x="${x + cardPad}" y="${ty}" width="${headerW}" height="${headerH}" rx="4" fill="${DR_BOX}"/>`
    body += `<text x="${x + cardPad + headerW / 2}" y="${ty + headerH / 2 + 3}" font-size="8" text-anchor="middle" fill="${DR_INK_SOFT}" font-weight="700">${escapeXml(card.header)}</text>`
    ty += headerH + headerGap

    const introLines = textLines(card.intro)
    body += introLines.map((l, k) => `<text x="${x + cardPad}" y="${ty + k * lineH + 8}" font-size="8.5" text-anchor="start" fill="${DR_INK}">${escapeXml(l)}</text>`).join('')
    ty += introLines.length * lineH + 4

    card.bullets.forEach((b) => {
      const bl = bulletLines(b)
      body += bl
        .map((l, k) => `<text x="${x + cardPad + 10}" y="${ty + k * lineH + 8}" font-size="8.5" text-anchor="start" fill="${DR_INK}">${k === 0 ? '• ' : ''}${escapeXml(l)}</text>`)
        .join('')
      ty += bl.length * lineH
    })

    if (card.outro) {
      ty += 4
      const outroLines = textLines(card.outro)
      body += outroLines
        .map((l, k) => `<text x="${x + cardPad}" y="${ty + k * lineH + 8}" font-size="8.5" text-anchor="start" fill="${DR_INK}" font-style="italic">${escapeXml(l)}</text>`)
        .join('')
    }
  })

  const width = pad * 2 + cols * colW + (cols - 1) * colGap
  const height = pad + rowHeights.reduce((s, h) => s + h, 0) + (rows - 1) * colGap + pad
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

// Nhóm xếp CHỒNG, mỗi nhóm 1 tab nhãn xám (vd FUTURE/PAST) rồi tới các item +/− — 1 item có thể
// gồm nhiều dòng cách diễn đạt thay thế, ngăn bởi 1 gạch mảnh trong cùng 1 box (vd "Level 3: Self
// — Past and Future").
function renderBadgeGroups(data: BadgeGroupsData, title: string): string {
  const { groups } = data
  const pad = 14
  const tabW = 60
  const tabH = 17
  const badgeR = 8
  const boxX0 = pad + badgeR * 2 + 6
  const boxW = 350
  const lineH = 11.5
  const boxPadY = 6
  const itemGap = 7
  const groupGap = 9

  function wrappedLinesFor(it: BadgeGroupItem): string[][] {
    return it.lines.map((ln) => wrapLabel(ln, 52))
  }
  function itemHeight(it: BadgeGroupItem): number {
    const wrapped = wrappedLinesFor(it)
    const totalLines = wrapped.reduce((s, ls) => s + ls.length, 0)
    return totalLines * lineH + boxPadY * 2 + (wrapped.length - 1) * 5
  }

  let y = pad
  let body = ''
  groups.forEach((g) => {
    body += `<rect x="${pad}" y="${y}" width="${tabW}" height="${tabH}" rx="5" fill="${DR_BOX}"/>`
    body += `<text x="${pad + tabW / 2}" y="${y + tabH / 2 + 3.5}" font-size="8.5" text-anchor="middle" fill="${DR_INK_SOFT}" font-weight="700" letter-spacing="0.4">${escapeXml(g.label)}</text>`
    y += tabH + 7

    g.items.forEach((it) => {
      const wrapped = wrappedLinesFor(it)
      const h = itemHeight(it)
      const badgeColor = it.badge === '+' ? DR_GREEN : DR_ROSE
      body += `<circle cx="${pad + badgeR}" cy="${y + h / 2}" r="${badgeR}" fill="${badgeColor}"/>`
      body += `<text x="${pad + badgeR}" y="${y + h / 2 + 3.5}" font-size="9.5" text-anchor="middle" fill="#fff" font-weight="700">${it.badge}</text>`
      body += `<rect x="${boxX0}" y="${y}" width="${boxW}" height="${h}" rx="8" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.3"/>`

      let ly = y + boxPadY
      wrapped.forEach((lines, li) => {
        lines.forEach((l, k) => {
          body += `<text x="${boxX0 + 12}" y="${ly + k * lineH + 9}" font-size="9" text-anchor="start" fill="${DR_INK}">${escapeXml(l)}</text>`
        })
        ly += lines.length * lineH
        if (li < wrapped.length - 1) {
          body += `<line x1="${boxX0 + 9}" y1="${ly + 2}" x2="${boxX0 + boxW - 9}" y2="${ly + 2}" stroke="${DR_BORDER}" stroke-width="1"/>`
          ly += 5
        }
      })

      y += h + itemGap
    })
    y += groupGap
  })
  const height = y - groupGap + pad / 2
  const width = boxX0 + boxW + pad

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

// 1 box duy nhất, nhiều dòng công thức ngăn cách bằng gạch mảnh — biến thể tối giản của
// badgeGroups (không tab, không badge) cho các mục chỉ có 1 danh sách công thức đơn giản.
function renderFormulaBox(data: FormulaBoxData, title: string): string {
  const pad = 16
  const hasRoot = Boolean(data.root)
  const boxW = hasRoot ? 440 : 360
  const lineH = 12
  const rootLineH = 14
  const boxPadY = 10
  const dividerGap = 6
  const arrowIndent = 14 // thụt vào cho các dòng "↳ …" bên dưới root, canh thẳng dưới chữ "I" của root

  // root (nếu có) là 1 nhóm riêng, in đậm, không tiền tố; mỗi cause line sau đó có tiền tố "↳ ".
  const rootWrapped = hasRoot ? wrapLabel(data.root!, hasRoot ? 66 : 54) : []
  const lineWrapped = data.lines.map((ln) => wrapLabel(hasRoot ? `↳ ${ln}` : ln, hasRoot ? 60 : 54))
  const groups = hasRoot ? [rootWrapped, ...lineWrapped] : lineWrapped

  const totalContentH = groups.reduce((s, lines, gi) => s + lines.length * (hasRoot && gi === 0 ? rootLineH : lineH), 0)
  const h = totalContentH + boxPadY * 2 + (groups.length - 1) * dividerGap

  let body = `<rect x="${pad}" y="${pad}" width="${boxW}" height="${h}" rx="9" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.4"/>`
  let ly = pad + boxPadY
  groups.forEach((lines, gi) => {
    const isRoot = hasRoot && gi === 0
    const rowLh = isRoot ? rootLineH : lineH
    lines.forEach((l, k) => {
      const x = pad + 16 + (!isRoot && k > 0 ? arrowIndent : 0)
      body += `<text x="${x}" y="${ly + k * rowLh + 9}" font-size="${isRoot ? 11.5 : 10}" font-weight="${isRoot ? 700 : 400}" text-anchor="start" fill="${DR_INK}">${escapeXml(l)}</text>`
    })
    ly += lines.length * rowLh
    if (gi < groups.length - 1) {
      body += `<line x1="${pad + 10}" y1="${ly + 2}" x2="${pad + boxW - 10}" y2="${ly + 2}" stroke="${DR_BORDER}" stroke-width="1"/>`
      ly += dividerGap
    }
  })

  const width = boxW + pad * 2
  const height = h + pad * 2
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

// "Part 2 Question = Part 1 Question x 4" — 2 khung outline cạnh nhau nối bằng 1 ký hiệu nhỏ ở giữa.
function renderEquationBox(data: EquationBoxData, title: string): string {
  const pad = 16
  const boxH = 44
  const padX = 18

  function boxWidthFor(text: string): number {
    return Math.max(140, text.length * 7.2 + padX * 2)
  }
  const leftW = boxWidthFor(data.left)
  const rightW = boxWidthFor(data.right)
  const symbol = data.symbol ?? '='
  // gap rộng theo ký hiệu — mặc định "=" chỉ cần 40, nhưng ký hiệu dài hơn (vd "Think in English"
  // dùng làm nhãn mũi tên) cần nhiều chỗ hơn để không đè lên 2 khung 2 bên.
  const gap = Math.max(40, symbol.length * 7.2 + 16)

  const leftX = pad
  const symX = leftX + leftW + gap / 2
  const rightX = leftX + leftW + gap
  const cy = pad + boxH / 2

  let body = ''
  body += `<rect x="${leftX}" y="${pad}" width="${leftW}" height="${boxH}" rx="8" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.4"/>`
  body += `<text x="${leftX + leftW / 2}" y="${cy + 4}" font-size="11.5" text-anchor="middle" fill="${DR_INK}" font-weight="600">${escapeXml(data.left)}</text>`
  body += `<text x="${symX}" y="${cy + 5}" font-size="15" text-anchor="middle" fill="${DR_ROSE}" font-weight="700">${escapeXml(symbol)}</text>`
  body += `<rect x="${rightX}" y="${pad}" width="${rightW}" height="${boxH}" rx="8" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.4"/>`
  body += `<text x="${rightX + rightW / 2}" y="${cy + 4}" font-size="11.5" text-anchor="middle" fill="${DR_INK}" font-weight="600">${escapeXml(data.right)}</text>`

  const width = rightX + rightW + pad
  const height = boxH + pad * 2
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

// Chuỗi N khung nối bằng ký hiệu, mỗi khung có thể có pill nhãn phía trên + ví dụ chữ nhỏ phía dưới.
function renderEquationChain(data: EquationChainData, title: string): string {
  const pad = 18
  const boxH = 40
  const gap = 34
  const padX = 16
  const pillH = 16
  const pillGap = 5
  const exampleGap = 6
  const exampleWrap = 22

  const hasAnyPill = data.parts.some((p) => p.label)
  const hasAnyExample = data.parts.some((p) => p.example)
  const topPad = hasAnyPill ? pillH + pillGap : 0

  function boxWidthFor(p: EquationChainPart): number {
    const exLines = p.example ? wrapLabel(p.example, exampleWrap) : []
    const exW = Math.max(0, ...exLines.map((l) => l.length * 5.6))
    const pillW = p.label ? p.label.length * 6.2 + 20 : 0
    return Math.max(120, p.text.length * 7 + padX * 2, exW, pillW)
  }
  const widths = data.parts.map(boxWidthFor)

  let x = pad
  const xs: number[] = []
  data.parts.forEach((_, i) => {
    xs.push(x)
    x += widths[i] + (i < data.parts.length - 1 ? gap : 0)
  })
  const boxTop = pad + topPad
  const cy = boxTop + boxH / 2

  let body = ''
  data.parts.forEach((p, i) => {
    const bx = xs[i]
    const bw = widths[i]
    if (p.label) {
      const pillW = Math.max(50, p.label.length * 6.2 + 16)
      const pillX = bx + bw / 2 - pillW / 2
      body += `<rect x="${pillX}" y="${pad}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${DR_ROSE}"/>`
      body += `<text x="${bx + bw / 2}" y="${pad + pillH / 2 + 3.5}" font-size="9" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(p.label)}</text>`
    }
    body += `<rect x="${bx}" y="${boxTop}" width="${bw}" height="${boxH}" rx="8" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.4"/>`
    body += `<text x="${bx + bw / 2}" y="${cy + 4}" font-size="11" text-anchor="middle" fill="${DR_INK}" font-weight="600">${escapeXml(p.text)}</text>`
    if (p.example) {
      const exLines = wrapLabel(p.example, exampleWrap)
      const exY = boxTop + boxH + exampleGap
      body += exLines
        .map((l, k) => `<text x="${bx + bw / 2}" y="${exY + k * 11 + 8}" font-size="9" text-anchor="middle" fill="${DR_INK_SOFT}" font-style="italic">${escapeXml(l)}</text>`)
        .join('')
    }
    if (i < data.parts.length - 1) {
      const symbol = data.symbols?.[i] ?? (i === 0 ? '=' : '+')
      const symX = bx + bw + gap / 2
      body += `<text x="${symX}" y="${cy + 5}" font-size="14" text-anchor="middle" fill="${DR_ROSE}" font-weight="700">${escapeXml(symbol)}</text>`
    }
  })

  const maxExampleLines = Math.max(0, ...data.parts.map((p) => (p.example ? wrapLabel(p.example, exampleWrap).length : 0)))
  const width = xs[xs.length - 1] + widths[widths.length - 1] + pad
  const height = boxTop + boxH + (hasAnyExample ? exampleGap + maxExampleLines * 11 + 6 : 0) + pad
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

// Hàng box độc lập (không mũi tên ngang), 1 vài box rẽ nhánh XUỐNG 1 box con bằng mũi tên nét đứt.
function renderBranchRow(data: BranchRowData, title: string): string {
  const pad = 18
  const boxW = 130
  const boxGap = 20
  const pillH = 16
  const pillGap = 6
  const branchGap = 18
  const wrapChars = 16

  function linesOf(t: string): string[] {
    return wrapLabel(t, wrapChars)
  }
  function boxHeightOf(t: string): number {
    return Math.max(40, linesOf(t).length * 13 + 16)
  }

  const topBoxH = Math.max(...data.items.map((it) => boxHeightOf(it.text)))
  const hasAnyBranch = data.items.some((it) => it.branchTo)
  const branchBoxH = hasAnyBranch ? Math.max(40, ...data.items.filter((it) => it.branchTo).map((it) => boxHeightOf(it.branchTo!.text))) : 0
  const hasAnyLabel = data.items.some((it) => it.label)
  const hasAnyBranchLabel = data.items.some((it) => it.branchTo?.label)

  const topY = pad + (hasAnyLabel ? pillH + pillGap : 0)
  const branchY = topY + topBoxH + branchGap + (hasAnyBranchLabel ? pillH + pillGap : 0)

  let body = ''
  data.items.forEach((it, i) => {
    const x = pad + i * (boxW + boxGap)
    if (it.label) {
      const pillW = Math.max(60, it.label.length * 6.4 + 16)
      body += `<rect x="${x + boxW / 2 - pillW / 2}" y="${pad}" width="${pillW}" height="${pillH}" rx="6" fill="${DR_BOX}" stroke="${DR_BORDER}" stroke-width="1.2"/>`
      body += `<text x="${x + boxW / 2}" y="${pad + pillH / 2 + 3.5}" font-size="9" text-anchor="middle" fill="${DR_INK_SOFT}" font-weight="700">${escapeXml(it.label.toUpperCase())}</text>`
    }
    body += `<rect x="${x}" y="${topY}" width="${boxW}" height="${topBoxH}" rx="8" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.4"/>`
    const lines = linesOf(it.text)
    const startY = topY + topBoxH / 2 - ((lines.length - 1) * 13) / 2 + 4
    body += lines.map((l, k) => `<text x="${x + boxW / 2}" y="${startY + k * 13}" font-size="10.5" text-anchor="middle" fill="${DR_INK}">${escapeXml(l)}</text>`).join('')

    if (it.branchTo) {
      const cx = x + boxW / 2
      const arrowY1 = topY + topBoxH + 3
      const arrowY2 = topY + topBoxH + branchGap - 3
      body += `<line x1="${cx}" y1="${arrowY1}" x2="${cx}" y2="${arrowY2}" stroke="${DR_ROSE}" stroke-width="1.6" stroke-dasharray="3,3" marker-end="url(#brArrow)"/>`
      if (it.branchTo.label) {
        const bPillW = Math.max(60, it.branchTo.label.length * 6.4 + 16)
        body += `<rect x="${cx - bPillW / 2}" y="${topY + topBoxH + branchGap}" width="${bPillW}" height="${pillH}" rx="6" fill="${DR_BOX}" stroke="${DR_BORDER}" stroke-width="1.2"/>`
        body += `<text x="${cx}" y="${topY + topBoxH + branchGap + pillH / 2 + 3.5}" font-size="9" text-anchor="middle" fill="${DR_INK_SOFT}" font-weight="700">${escapeXml(it.branchTo.label.toUpperCase())}</text>`
      }
      body += `<rect x="${x}" y="${branchY}" width="${boxW}" height="${branchBoxH}" rx="8" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.4"/>`
      const bLines = linesOf(it.branchTo.text)
      const bStartY = branchY + branchBoxH / 2 - ((bLines.length - 1) * 13) / 2 + 4
      body += bLines.map((l, k) => `<text x="${cx}" y="${bStartY + k * 13}" font-size="10.5" text-anchor="middle" fill="${DR_INK}">${escapeXml(l)}</text>`).join('')
    }
  })

  const width = pad + data.items.length * boxW + (data.items.length - 1) * boxGap + pad
  const height = (hasAnyBranch ? branchY + branchBoxH : topY + topBoxH) + pad
  const defs = `<defs><marker id="brArrow" markerWidth="8" markerHeight="8" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${DR_ROSE}"/></marker></defs>`
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${body}</svg>`
}

// Câu hỏi có vài từ tô đậm + lưới ✓/✗ theo từng idea cho từng từ đó.
// Sách vẽ mỗi từ tô đậm trong câu hỏi thành 1 PILL màu (không phải chữ tô màu đơn thuần), và mỗi
// idea có các pill ✓/✗ riêng (chứa lại đúng từ đó + icon) nằm NGAY BÊN PHẢI nhãn idea — khác thiết
// kế lưới ban đầu (header cột + hàng vòng tròn bên dưới), vốn tách rời quá xa so với bố cục sách.
function renderCheckMatrix(data: CheckMatrixData, title: string): string {
  const pad = 16
  const pillH = 20
  const pillGapX = 6
  const wordGapX = 5
  const lineH = 26
  const maxLineW = 460
  const labelW = 190
  const rowGap = 12

  const qPalette = [
    { bg: 'rgba(201,102,122,0.16)', fg: DR_ROSE },
    { bg: 'rgba(23,138,90,0.14)', fg: DR_GREEN },
    { bg: DR_BOX, fg: DR_INK_SOFT },
  ]

  // Tách câu hỏi thành các đoạn text thường / pill highlight theo ĐÚNG thứ tự xuất hiện của từng
  // cụm trong `highlights` — khác tokenizeWithHighlights (đánh dấu từng TỪ riêng lẻ, "public
  // transport" sẽ tách thành 2 pill "public" + "transport" thay vì 1 pill liền).
  type QSeg = { text: string; hi: boolean; hiIndex: number }
  const segments: QSeg[] = []
  let rest = data.question
  data.highlights.forEach((h, hi) => {
    const idx = rest.indexOf(h)
    if (idx === -1) return
    const before = rest.slice(0, idx)
    if (before) segments.push({ text: before, hi: false, hiIndex: -1 })
    segments.push({ text: h, hi: true, hiIndex: hi })
    rest = rest.slice(idx + h.length)
  })
  if (rest) segments.push({ text: rest, hi: false, hiIndex: -1 })

  type QTok = { text: string; hi: boolean; hiIndex: number; w: number }
  const qTokens: QTok[] = []
  segments.forEach((seg) => {
    if (seg.hi) {
      qTokens.push({ text: seg.text, hi: true, hiIndex: seg.hiIndex, w: seg.text.length * 6.4 + 18 })
    } else {
      seg.text
        .split(/\s+/)
        .filter(Boolean)
        .forEach((word) => qTokens.push({ text: word, hi: false, hiIndex: -1, w: word.length * 6.6 }))
    }
  })

  function wrapTokens(tokens: QTok[], maxW: number): QTok[][] {
    const lines: QTok[][] = []
    let cur: QTok[] = []
    let curW = 0
    tokens.forEach((tok) => {
      const gap = tok.hi ? pillGapX : wordGapX
      const add = (cur.length > 0 ? gap : 0) + tok.w
      if (curW + add > maxW && cur.length > 0) {
        lines.push(cur)
        cur = [tok]
        curW = tok.w
      } else {
        cur.push(tok)
        curW += add
      }
    })
    if (cur.length > 0) lines.push(cur)
    return lines
  }
  const qLines = wrapTokens(qTokens, maxLineW)

  let body = ''
  let y = pad
  let maxRight = 0
  qLines.forEach((line) => {
    let x = pad
    line.forEach((tok) => {
      if (tok.hi) {
        const col = qPalette[tok.hiIndex % qPalette.length]
        body += `<rect x="${x}" y="${y}" width="${tok.w}" height="${pillH}" rx="${pillH / 2}" fill="${col.bg}"/>`
        body += `<text x="${x + tok.w / 2}" y="${y + pillH / 2 + 4}" font-size="10.5" text-anchor="middle" fill="${col.fg}" font-weight="700">${escapeXml(tok.text)}</text>`
        x += tok.w + pillGapX
      } else {
        body += `<text x="${x}" y="${y + pillH / 2 + 4}" font-size="11" text-anchor="start" font-weight="600" fill="${DR_INK}">${escapeXml(tok.text)}</text>`
        x += tok.w + wordGapX
      }
    })
    maxRight = Math.max(maxRight, x - wordGapX)
    y += lineH
  })
  y += 8

  data.rows.forEach((row) => {
    const labelLines = wrapLabel(row.label, 28)
    const rowH = Math.max(pillH, labelLines.length * 13)
    const labelStartY = y + rowH / 2 - ((labelLines.length - 1) * 13) / 2 + 4
    body += labelLines
      .map((l, k) => `<text x="${pad}" y="${labelStartY + k * 13}" font-size="10.5" text-anchor="start" fill="${DR_INK}" font-weight="700">${escapeXml(l)}</text>`)
      .join('')

    let mx = pad + labelW
    row.marks.forEach((ok, ci) => {
      const word = data.highlights[ci]
      const col = ok ? { bg: 'rgba(23,138,90,0.14)', fg: DR_GREEN } : { bg: 'rgba(201,102,122,0.14)', fg: DR_ROSE }
      const pw = word.length * 6.2 + 34
      const py = y + rowH / 2 - pillH / 2
      body += `<rect x="${mx}" y="${py}" width="${pw}" height="${pillH}" rx="${pillH / 2}" fill="${col.bg}" stroke="${col.fg}" stroke-width="1.2"/>`
      body += `<text x="${mx + 9}" y="${y + rowH / 2 + 4}" font-size="9.5" text-anchor="start" fill="${col.fg}" font-weight="600">${escapeXml(word)}</text>`
      body += `<circle cx="${mx + pw - 13}" cy="${y + rowH / 2}" r="8" fill="${col.fg}"/>`
      body += `<text x="${mx + pw - 13}" y="${y + rowH / 2 + 3.5}" font-size="9" text-anchor="middle" fill="#fff" font-weight="700">${ok ? '✓' : '✗'}</text>`
      mx += pw + pillGapX
    })
    maxRight = Math.max(maxRight, mx - pillGapX)
    y += rowH + rowGap
  })

  const width = Math.max(maxRight, pad + labelW) + pad
  const height = y - rowGap + pad
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

// "Quy tắc" — hàng nhãn đậm + N pill cột, nối chấm dọc xuống hàng nhãn đậm khác + N pill cột ✓,
// nền hồng nhạt bao quanh.
function renderSpecifyRule(data: SpecifyRuleData, title: string): string {
  const pad = 16
  const labelW = 110
  const colW = 96
  const rowH = 30
  const rowGap = 40
  const bandPad = 10

  const totalW = labelW + data.columns.length * colW
  const topY = pad
  const bottomY = topY + rowH + rowGap

  let body = `<rect x="${pad - bandPad}" y="${pad - bandPad}" width="${totalW + bandPad * 2}" height="${bottomY + rowH - topY + bandPad * 2}" rx="10" fill="rgba(201,102,122,0.12)"/>`

  body += `<rect x="${pad}" y="${topY}" width="${labelW - 8}" height="${rowH}" rx="7" fill="${DR_INK}"/>`
  body += `<text x="${pad + (labelW - 8) / 2}" y="${topY + rowH / 2 + 4}" font-size="10" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(data.topLabel)}</text>`
  body += `<rect x="${pad}" y="${bottomY}" width="${labelW - 8}" height="${rowH}" rx="7" fill="${DR_ROSE}"/>`
  body += `<text x="${pad + (labelW - 8) / 2}" y="${bottomY + rowH / 2 + 4}" font-size="10" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(data.bottomLabel)}</text>`

  data.columns.forEach((col, ci) => {
    const cx = pad + labelW + ci * colW + (colW - 8) / 2
    const bx = pad + labelW + ci * colW
    body += `<rect x="${bx}" y="${topY}" width="${colW - 8}" height="${rowH}" rx="7" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.3"/>`
    body += `<text x="${cx}" y="${topY + rowH / 2 + 4}" font-size="9.5" text-anchor="middle" fill="${DR_INK}" font-weight="600">${escapeXml(col)}</text>`
    body += `<line x1="${cx}" y1="${topY + rowH + 4}" x2="${cx}" y2="${bottomY - 4}" stroke="${DR_ROSE}" stroke-width="1.4" stroke-dasharray="3,3" marker-end="url(#srArrow)"/>`
    body += `<rect x="${bx}" y="${bottomY}" width="${colW - 8}" height="${rowH}" rx="7" fill="#fff" stroke="${DR_GREEN}" stroke-width="1.4"/>`
    body += `<text x="${cx - 6}" y="${bottomY + rowH / 2 + 4}" font-size="9.5" text-anchor="middle" fill="${DR_INK}" font-weight="600">${escapeXml(col)}</text>`
    body += `<circle cx="${bx + colW - 8 - 10}" cy="${bottomY + rowH / 2}" r="7" fill="${DR_GREEN}"/>`
    body += `<text x="${bx + colW - 8 - 10}" y="${bottomY + rowH / 2 + 3.5}" font-size="9" text-anchor="middle" fill="#fff" font-weight="700">✓</text>`
  })

  const width = totalW + pad * 2 + bandPad
  const height = bottomY + rowH + pad + bandPad
  const defs = `<defs><marker id="srArrow" markerWidth="8" markerHeight="8" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${DR_ROSE}"/></marker></defs>`
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${body}</svg>`
}

// Cây 2 tầng: box câu hỏi gốc → "SPECIFY" → N nhánh (nét đứt xoè ra), mỗi nhánh có thêm 1 box con.
function renderSpecifyTree(data: SpecifyTreeData, title: string): string {
  const pad = 18
  const boxW = 170
  const boxGap = 30
  const rootBoxH = 40
  const childBoxH = 40
  const stemH = 26
  const childGap = 24
  const wrapChars = 24

  function linesOf(t: string): string[] {
    return wrapLabel(t, wrapChars)
  }
  const n = data.branches.length
  const rowW = n * boxW + (n - 1) * boxGap
  const rootW = Math.max(160, data.question.length * 6.4 + 32)
  // Câu hỏi gốc dài (rootW) có thể RỘNG HƠN cả hàng nhánh bên dưới (rowW) — nếu chỉ canh giữa theo
  // rowW như trước, box câu hỏi sẽ tràn ra ngoài viewBox 2 bên (bị cắt, chỉ còn thấy viền trên/dưới,
  // không thấy viền trái/phải). Phải lấy contentW = max(rowW, rootW) rồi canh giữa CẢ HAI theo đúng
  // 1 trục chung, dời cả hàng nhánh sang phải nếu rootW rộng hơn.
  const contentW = Math.max(rowW, rootW)
  const rootX = pad + (contentW - rootW) / 2
  const rowOffsetX = pad + (contentW - rowW) / 2
  const rootY = pad
  const stemY = rootY + rootBoxH
  const branchY = stemY + stemH
  const childY = branchY + childBoxH + childGap

  let body = ''
  body += `<rect x="${rootX}" y="${rootY}" width="${rootW}" height="${rootBoxH}" rx="8" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.4"/>`
  body += `<text x="${rootX + rootW / 2}" y="${rootY + rootBoxH / 2 + 4}" font-size="10.5" text-anchor="middle" fill="${DR_INK}" font-weight="600">${escapeXml(data.question)}</text>`

  const rootCx = rootX + rootW / 2
  const stemMidY = stemY + stemH / 2
  body += `<text x="${rootCx + 8}" y="${stemMidY - 4}" font-size="9" text-anchor="start" fill="${DR_ROSE}" font-weight="700">SPECIFY</text>`
  body += `<line x1="${rootCx}" y1="${stemY}" x2="${rootCx}" y2="${stemMidY}" stroke="${DR_ROSE}" stroke-width="1.6" stroke-dasharray="3,3"/>`

  data.branches.forEach((br, i) => {
    const x = rowOffsetX + i * (boxW + boxGap)
    const cx = x + boxW / 2
    body += `<line x1="${rootCx}" y1="${stemMidY}" x2="${cx}" y2="${stemMidY}" stroke="${DR_ROSE}" stroke-width="1.6" stroke-dasharray="3,3"/>`
    body += `<line x1="${cx}" y1="${stemMidY}" x2="${cx}" y2="${branchY}" stroke="${DR_ROSE}" stroke-width="1.6" stroke-dasharray="3,3" marker-end="url(#stArrow)"/>`

    body += `<rect x="${x}" y="${branchY}" width="${boxW}" height="${childBoxH}" rx="8" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.4"/>`
    const lines = linesOf(br.text)
    const startY = branchY + childBoxH / 2 - ((lines.length - 1) * 12) / 2 + 4
    body += lines.map((l, k) => `<text x="${cx}" y="${startY + k * 12}" font-size="10" text-anchor="middle" fill="${DR_INK}">${escapeXml(l)}</text>`).join('')

    body += `<line x1="${cx}" y1="${branchY + childBoxH + 3}" x2="${cx}" y2="${childY - 3}" stroke="${DR_ROSE}" stroke-width="1.6" stroke-dasharray="3,3" marker-end="url(#stArrow)"/>`
    body += `<rect x="${x}" y="${childY}" width="${boxW}" height="${childBoxH}" rx="8" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.4"/>`
    const cLines = linesOf(br.child)
    const cStartY = childY + childBoxH / 2 - ((cLines.length - 1) * 12) / 2 + 4
    body += cLines.map((l, k) => `<text x="${cx}" y="${cStartY + k * 12}" font-size="10" text-anchor="middle" fill="${DR_INK}">${escapeXml(l)}</text>`).join('')
  })

  const width = pad + contentW + pad
  const height = childY + childBoxH + pad
  const defs = `<defs><marker id="stArrow" markerWidth="8" markerHeight="8" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${DR_ROSE}"/></marker></defs>`
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${body}</svg>`
}

// Bảng tra cứu N cột trung tính (header xám đậm + rows).
function renderSimpleTable(data: SimpleTableData, title: string): string {
  const pad = 14
  const headerH = 24
  const rowPadY = 8
  const lineH = 12
  const colGap = 10
  const wrapChars = 26

  const cols = data.headers.length
  function cellLines(text: string): string[] {
    return wrapLabel(text, wrapChars)
  }
  const colWidths = data.headers.map((h, ci) => {
    const cellsInCol = data.rows.map((r) => r[ci] ?? '')
    const maxLen = Math.max(h.length, ...cellsInCol.map((c) => Math.max(...cellLines(c).map((l) => l.length), 0)))
    return Math.max(70, maxLen * 6.2 + 16)
  })
  const colXs: number[] = []
  let cx = pad
  colWidths.forEach((w) => {
    colXs.push(cx)
    cx += w + colGap
  })
  const totalW = cx - colGap

  const rowHeights = data.rows.map((r) => {
    const lineCounts = r.map((c) => cellLines(c).length)
    return Math.max(20, Math.max(...lineCounts, 1) * lineH + rowPadY)
  })

  let body = ''
  body += `<rect x="${pad}" y="${pad}" width="${totalW}" height="${headerH}" fill="${DR_INK_SOFT}"/>`
  data.headers.forEach((h, ci) => {
    body += `<text x="${colXs[ci] + 8}" y="${pad + headerH / 2 + 3.5}" font-size="9.5" text-anchor="start" fill="#fff" font-weight="700">${escapeXml(h.toUpperCase())}</text>`
  })

  let y = pad + headerH
  data.rows.forEach((row, ri) => {
    const h = rowHeights[ri]
    if (ri % 2 === 1) body += `<rect x="${pad}" y="${y}" width="${totalW}" height="${h}" fill="${DR_BOX}"/>`
    row.forEach((cellText, ci) => {
      const lines = cellLines(cellText)
      const startY = y + h / 2 - ((lines.length - 1) * lineH) / 2 + 4
      body += lines.map((l, k) => `<text x="${colXs[ci] + 8}" y="${startY + k * lineH}" font-size="9.5" text-anchor="start" fill="${DR_INK}">${escapeXml(l)}</text>`).join('')
    })
    y += h
    body += `<line x1="${pad}" y1="${y}" x2="${pad + totalW}" y2="${y}" stroke="${DR_BORDER}" stroke-width="1"/>`
  })

  const width = totalW + pad * 2
  const height = y + pad
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

// Khung "Idea → Defining word → Detail" (cốt lõi Think in English) — pill tiêu đề vẽ 1 LẦN phía
// trên, mỗi group có 1 Idea (khung nét đứt, hiển thị 1 lần, cao bằng TỔNG các subrow của nó) + N
// subrow Defining word/Detail xếp dọc bên phải.
function renderThinkTable(data: ThinkTableData, title: string): string {
  const pad = 16
  const headerH = 20
  const headerGap = 8
  const ideaW = 150
  const colGap = 14
  const lineH = 12
  const tagH = 14
  const tagGap = 3
  const cellPadY = 8
  const rowGap = 6
  const groupGap = 10
  const wrapChars = 20

  function cellHeight(cell: ThinkCell): number {
    return Math.max(28, cell.lines.length * lineH + cellPadY + (cell.tag ? tagH + tagGap : 0))
  }
  // subRowHeight KHÔNG tính definingWord riêng của subrow khi group đã có definingWord cố định (vẽ
  // 1 lần, cao ngang idea) — subrow lúc đó chỉ cần đủ cao cho các Detail cell của chính nó.
  function subRowHeight(row: ThinkSubRow): number {
    return Math.max(row.definingWord ? cellHeight(row.definingWord) : 0, ...row.detail.map(cellHeight))
  }
  function groupContentHeight(g: ThinkGroup): number {
    return g.rows.reduce((s, r) => s + subRowHeight(r), 0) + (g.rows.length - 1) * rowGap
  }
  function groupHeight(g: ThinkGroup): number {
    return Math.max(cellHeight(g.idea), g.definingWord ? cellHeight(g.definingWord) : 0, groupContentHeight(g))
  }

  const maxDetailCols = Math.max(1, ...data.groups.flatMap((g) => g.rows.map((r) => r.detail.length)))
  const definingW = 150
  const detailW = 220
  const totalW = ideaW + colGap + definingW + colGap + maxDetailCols * detailW + (maxDetailCols - 1) * colGap

  function drawCell(x: number, y: number, w: number, h: number, cell: ThinkCell, bold: boolean): string {
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.3" stroke-dasharray="4,3"/>`
    let ty = y + cellPadY / 2 + lineH - 2
    if (cell.tag) {
      const tagW = Math.max(40, cell.tag.length * 5.6 + 12)
      s += `<rect x="${x + 6}" y="${y + 5}" width="${tagW}" height="${tagH}" rx="4" fill="${DR_ROSE}"/>`
      s += `<text x="${x + 6 + tagW / 2}" y="${y + 5 + tagH / 2 + 3}" font-size="7.5" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(cell.tag)}</text>`
      ty += tagH + tagGap
    }
    const startY = cell.tag ? ty : y + h / 2 - ((cell.lines.length - 1) * lineH) / 2 + 4
    s += cell.lines
      .map((l, k) => `<text x="${x + w / 2}" y="${startY + k * lineH}" font-size="9.5" text-anchor="middle" fill="${DR_INK}" font-weight="${bold ? 700 : 400}">${escapeXml(l)}</text>`)
      .join('')
    return s
  }

  let body = ''
  // Header pills (Idea / Defining word / Detail) — vẽ 1 lần, outline đặc (không nét đứt) để phân
  // biệt với các cell dữ liệu bên dưới.
  const headerY = pad
  body += `<rect x="${pad}" y="${headerY}" width="${ideaW}" height="${headerH}" rx="${headerH / 2}" fill="#fff" stroke="${DR_ROSE}" stroke-width="1.4"/>`
  body += `<text x="${pad + ideaW / 2}" y="${headerY + headerH / 2 + 3.5}" font-size="9.5" text-anchor="middle" fill="${DR_ROSE}" font-weight="700">Idea</text>`
  const definingX = pad + ideaW + colGap
  body += `<rect x="${definingX}" y="${headerY}" width="${definingW}" height="${headerH}" rx="${headerH / 2}" fill="#fff" stroke="${DR_ROSE}" stroke-width="1.4"/>`
  body += `<text x="${definingX + definingW / 2}" y="${headerY + headerH / 2 + 3.5}" font-size="9.5" text-anchor="middle" fill="${DR_ROSE}" font-weight="700">Defining word</text>`
  for (let d = 0; d < maxDetailCols; d++) {
    const detailX = definingX + definingW + colGap + d * (detailW + colGap)
    body += `<rect x="${detailX}" y="${headerY}" width="${detailW}" height="${headerH}" rx="${headerH / 2}" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.4"/>`
    body += `<text x="${detailX + detailW / 2}" y="${headerY + headerH / 2 + 3.5}" font-size="9.5" text-anchor="middle" fill="${DR_INK_SOFT}" font-weight="700">Detail</text>`
  }

  let y = headerY + headerH + headerGap
  data.groups.forEach((g) => {
    const gh = groupHeight(g)
    body += drawCell(pad, y, ideaW, gh, g.idea, true)
    if (g.definingWord) {
      // Defining word CỐ ĐỊNH cho cả group — vẽ 1 lần, cao bằng idea, giống hệt cách vẽ idea, thay
      // vì lặp lại y hệt ở từng subrow (vd khung Verb/Adj: mọi subrow đều là "verb").
      body += drawCell(definingX, y, definingW, gh, g.definingWord, true)
    }
    let ry = y
    g.rows.forEach((row) => {
      const rh = subRowHeight(row)
      if (!g.definingWord && row.definingWord) {
        body += drawCell(definingX, ry, definingW, rh, row.definingWord, false)
      }
      row.detail.forEach((d, di) => {
        const detailX = definingX + definingW + colGap + di * (detailW + colGap)
        body += drawCell(detailX, ry, detailW, rh, d, false)
      })
      ry += rh + rowGap
    })
    y += gh + groupGap
  })

  const width = totalW + pad * 2
  const height = y - groupGap + pad
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

function renderExampleWalk(data: ExampleWalkData, title: string): string {
  const pad = 18
  const boxW = 420
  const pillH = 20
  const pillW = 82
  const lineH = 12
  const boxPadY = 8
  const rowGap = 6
  const groupGap = 14

  function wrapped(text: string, chars: number): string[] {
    return wrapLabel(text, chars)
  }
  function boxHeight(lines: string[]): number {
    return lines.length * lineH + boxPadY * 2
  }

  const quoteLines = data.quote ? wrapped(data.quote, 60) : []
  let y = pad
  let body = ''

  if (quoteLines.length) {
    quoteLines.forEach((l, k) => {
      body += `<text x="${pad}" y="${y + 10 + k * 13}" font-size="11" font-style="italic" text-anchor="start" fill="${DR_INK_SOFT}">${escapeXml(l)}</text>`
    })
    y += quoteLines.length * 13 + 12
  }

  data.groups.forEach((g) => {
    const pillColor = g.category === 'self' ? DR_ROSE : DR_GREEN
    const pillLabel = g.category === 'self' ? 'BẢN THÂN' : 'ĐỀ TÀI'
    body += `<rect x="${pad}" y="${y}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${pillColor}"/>`
    body += `<text x="${pad + pillW / 2}" y="${y + pillH / 2 + 3.5}" font-size="9" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(pillLabel)}</text>`
    body += `<text x="${pad + pillW + 10}" y="${y + pillH / 2 + 4}" font-size="11.5" font-weight="700" text-anchor="start" fill="${DR_INK}">${escapeXml(g.subject)}</text>`
    y += pillH + 8

    g.items.forEach((item) => {
      const stemLines = wrapped(item.stem, 52)
      const stemH = boxHeight(stemLines)
      body += `<rect x="${pad}" y="${y}" width="${boxW}" height="${stemH}" rx="7" fill="none" stroke="${DR_INK_SOFT}" stroke-width="1.2" stroke-dasharray="4,3"/>`
      const stemStartY = y + boxPadY + 9
      stemLines.forEach((l, k) => {
        body += `<text x="${pad + 12}" y="${stemStartY + k * lineH}" font-size="10" font-style="italic" text-anchor="start" fill="${DR_INK_SOFT}">${escapeXml(l)}</text>`
      })
      y += stemH + rowGap

      item.answers.forEach((a) => {
        const lines = wrapped(a, 50)
        const h = boxHeight(lines)
        body += `<rect x="${pad + 16}" y="${y}" width="${boxW - 16}" height="${h}" rx="7" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.3"/>`
        const sy = y + boxPadY + 9
        lines.forEach((l, k) => {
          body += `<text x="${pad + 28}" y="${sy + k * lineH}" font-size="10" text-anchor="start" fill="${DR_INK}">${escapeXml(l)}</text>`
        })
        y += h + rowGap
      })
    })
    y += groupGap - rowGap
  })

  const width = boxW + pad * 2 + 16
  const height = y - groupGap + rowGap + pad
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

// 1 cột, mỗi hàng [nhãn trái] + [box mẫu câu phải], nhóm theo section có thanh tiêu đề màu riêng —
// nhỏ gọn hơn drTypes (không cần title pill từng hàng), đúng bố cục sách cho bảng tra cứu dài.
function renderStemReference(data: StemReferenceData, title: string): string {
  const pad = 14
  const headerH = 20
  const labelW = 76
  const boxW = 260
  const gapLB = 8
  const lineH = 9.5
  const boxPadY = 5
  const rowGap = 5
  const sectionGap = 10
  const totalW = labelW + gapLB + boxW

  // Label bên trái CŨNG phải wrap giống box bên phải — ban đầu chỉ text (box phải) mới wrap vì mọi
  // label ở Lesson 2/3 đều ngắn (Thói quen, Cause, Effect...); sang Lesson 4 label là cả 1 cụm pattern
  // dài ("the definition of adj / NOUN / V", "doesn't even come close to being adj") nên bị tràn ra
  // ngoài cột 76px, chữ chồng lên box bên cạnh mà không có dấu hiệu lỗi rõ ràng nào (SVG không tự xén).
  function labelLinesOf(label: string): string[] {
    return multilineWrap(label, 13)
  }
  // row.text từng wrap ở 38 ký tự — hụt khá xa so với bề ngang box thật (boxW=260, ~240px khả dụng ở
  // font-size 8 đủ chỗ cho ~50+ ký tự/dòng), verify trực quan qua nhiều mốc (38/46/52/58) trước khi
  // chốt 52 — cùng nguyên nhân với bug từng gặp ở badgeColumns/compareHighlight.
  function rowHeight(row: StemRow): number {
    const textLines = multilineWrap(row.text, 52)
    const labelLines = labelLinesOf(row.label)
    return Math.max(18, Math.max(textLines.length, labelLines.length) * lineH + boxPadY * 2)
  }

  // Header cũng phải wrap phòng khi lỡ dài (đã gặp: nhét nguyên 1 câu ví dụ vào header thay vì để
  // trong đoạn văn phía trên chart) — header vốn chỉ để 1 nhãn ngắn nên headerH cố định trước đây
  // chưa từng lộ vấn đề, nhưng vẫn nên wrap để không âm thầm tràn chữ nếu có lần sau.
  function headerLinesOf(header: string): string[] {
    return multilineWrap(header, 60)
  }
  function headerHeightOf(section: StemSection): number {
    return Math.max(headerH, headerLinesOf(section.header).length * lineH + 8)
  }

  let y = pad
  let body = ''
  data.sections.forEach((section) => {
    const color = section.category === 'self' ? DR_ROSE : DR_GREEN
    const hh = headerHeightOf(section)
    const headerLines = headerLinesOf(section.header)
    body += `<rect x="${pad}" y="${y}" width="${totalW}" height="${hh}" rx="6" fill="${color}"/>`
    const headerStartY = y + hh / 2 - ((headerLines.length - 1) * lineH) / 2 + 3
    body += headerLines
      .map((l, k) => `<text x="${pad + 10}" y="${headerStartY + k * lineH}" font-size="8.5" text-anchor="start" fill="#fff" font-weight="700">${escapeXml(l)}</text>`)
      .join('')
    y += hh + rowGap

    section.rows.forEach((row) => {
      const h = rowHeight(row)
      const lines = multilineWrap(row.text, 52)
      const labelLines = labelLinesOf(row.label)
      const labelStartY = y + h / 2 - ((labelLines.length - 1) * lineH) / 2 + 3
      body += labelLines
        .map((l, k) => `<text x="${pad}" y="${labelStartY + k * lineH}" font-size="8.5" text-anchor="start" fill="${DR_INK}" font-weight="700">${escapeXml(l)}</text>`)
        .join('')
      body += `<rect x="${pad + labelW + gapLB}" y="${y}" width="${boxW}" height="${h}" rx="6" fill="${DR_BOX}"/>`
      const startY = y + h / 2 - ((lines.length - 1) * lineH) / 2 + 3
      body += lines
        .map((l, k) => `<text x="${pad + labelW + gapLB + 10}" y="${startY + k * lineH}" font-size="8" text-anchor="start" fill="${DR_INK}">${escapeXml(l)}</text>`)
        .join('')
      y += h + rowGap
    })
    y += sectionGap - rowGap
  })

  const width = totalW + pad * 2
  const height = y - sectionGap + pad
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

type HighlightToken = { text: string; hi: boolean }

// Đánh dấu index nào thuộc 1 cụm highlight trước, rồi mới tách từ theo index đó — tránh so khớp lại
// bằng cách split-rồi-tìm-lại (dễ lệch khi 1 từ lặp lại nhiều lần trong đoạn văn).
function tokenizeWithHighlights(text: string, highlights: string[]): HighlightToken[] {
  const marks = new Array(text.length).fill(false)
  highlights.forEach((h) => {
    if (!h) return
    let from = 0
    for (;;) {
      const idx = text.indexOf(h, from)
      if (idx === -1) break
      for (let i = idx; i < idx + h.length; i++) marks[i] = true
      from = idx + h.length
    }
  })
  const tokens: HighlightToken[] = []
  let i = 0
  while (i < text.length) {
    if (/\s/.test(text[i])) {
      i += 1
      continue
    }
    let j = i
    while (j < text.length && !/\s/.test(text[j])) j += 1
    tokens.push({ text: text.slice(i, j), hi: marks.slice(i, j).some(Boolean) })
    i = j
  }
  return tokens
}

function wrapHighlightTokens(tokens: HighlightToken[], maxChars: number): HighlightToken[][] {
  const lines: HighlightToken[][] = []
  let cur: HighlightToken[] = []
  let curLen = 0
  tokens.forEach((tok) => {
    const addLen = (curLen > 0 ? 1 : 0) + tok.text.length
    if (curLen + addLen > maxChars && cur.length > 0) {
      lines.push(cur)
      cur = [tok]
      curLen = tok.text.length
    } else {
      cur.push(tok)
      curLen += addLen
    }
  })
  if (cur.length > 0) lines.push(cur)
  return lines
}

function renderHighlightLine(line: HighlightToken[]): string {
  return line
    .map((tok, idx) => {
      const content = escapeXml(tok.text) + (idx < line.length - 1 ? ' ' : '')
      return tok.hi ? `<tspan fill="${DR_ROSE}" font-weight="700">${content}</tspan>` : `<tspan>${content}</tspan>`
    })
    .join('')
}

// So sánh Trước/Sau với highlight — khác stemReference ở chỗ label xếp TRÊN box (không xếp bên
// trái) vì đoạn Trước/Sau thường dài nhiều câu, xếp bên trái sẽ phí ngang khiến chữ wrap sớm dù còn
// dư chỗ (bug đã gặp: khoảng trắng lớn bên phải mỗi dòng dù box đã kéo full width). wrapChars=88 đã
// verify trực quan qua nhiều mốc (62/80/95) trước khi chốt — 62 để trắng ~30% bề ngang box.
function renderCompareHighlight(data: CompareData, title: string): string {
  const pad = 14
  const headerH = 20
  const boxW = 500
  const lineH = 12
  const boxPadY = 8
  const boxPadX = 12
  const rowGap = 8
  const sectionGap = 14
  const labelH = 14
  const explLineH = 11
  const wrapChars = 88
  const fontSize = 8.5

  let y = pad
  let body = ''
  data.sections.forEach((section, si) => {
    const color = si % 2 === 0 ? DR_ROSE : DR_GREEN
    body += `<rect x="${pad}" y="${y}" width="${boxW}" height="${headerH}" rx="6" fill="${color}"/>`
    body += `<text x="${pad + 10}" y="${y + headerH / 2 + 3}" font-size="9" text-anchor="start" fill="#fff" font-weight="700">${escapeXml(section.header)}</text>`
    y += headerH + rowGap

    function row(label: string, text: string, highlights: string[]) {
      body += `<text x="${pad}" y="${y + labelH - 3}" font-size="8.5" text-anchor="start" fill="${DR_INK}" font-weight="700" font-style="italic">${escapeXml(label)}</text>`
      y += labelH + 3
      const lines = wrapHighlightTokens(tokenizeWithHighlights(text, highlights), wrapChars)
      const h = Math.max(24, lines.length * lineH + boxPadY * 2)
      body += `<rect x="${pad}" y="${y}" width="${boxW}" height="${h}" rx="6" fill="${DR_BOX}"/>`
      const startY = y + boxPadY + 8
      lines.forEach((line, k) => {
        body += `<text x="${pad + boxPadX}" y="${startY + k * lineH}" font-size="${fontSize}" text-anchor="start" fill="${DR_INK}">${renderHighlightLine(line)}</text>`
      })
      y += h + rowGap
    }

    row('Trước', section.before, section.beforeHighlights ?? [])
    row('Sau', section.after, section.highlights)

    const explLines = multilineWrap(section.explanation, 78)
    body += explLines
      .map((l, k) => `<text x="${pad}" y="${y + k * explLineH + 8}" font-size="7.8" text-anchor="start" fill="${DR_INK_SOFT}" font-style="italic">${escapeXml(l)}</text>`)
      .join('')
    y += explLines.length * explLineH + sectionGap
  })

  const width = boxW + pad * 2
  const height = y - sectionGap + pad / 2
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

export const DataChart = Node.create({
  name: 'dataChart',
  group: 'block',
  atom: true,

  addAttributes() {
    // rendered: false — renderHTML() bên dưới TỰ đổ 3 attr này thành data-chart-type/data-title/
    // data-payload; không tắt auto-render mặc định của TipTap thì mergeAttributes() sẽ chèn THÊM
    // 1 bộ attr trùng lặp (charttype="…" title="…" data="…") mỗi khi editor.getHTML() chạy lại
    // (vd bấm "Chỉnh sửa" rồi "Xong" dù không sửa gì) — từng gặp bug này trên trang thật.
    return {
      chartType: { default: 'line', rendered: false },
      title: { default: '', rendered: false },
      data: { default: '', rendered: false },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-chart]',
        getAttrs: (el) => {
          const e = el as HTMLElement
          return {
            chartType: e.getAttribute('data-chart-type') || 'line',
            title: e.getAttribute('data-title') || '',
            data: e.getAttribute('data-payload') || '',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const { chartType, title, data } = node.attrs
    const parsed = decodeData(data)
    let svg = ''
    if (parsed) {
      if (chartType === 'bar') svg = renderBarChart(parsed as LineBarData, title)
      else if (chartType === 'barH') svg = renderHBarChart(parsed as LineBarData, title)
      else if (chartType === 'pieDouble') svg = renderPieDouble(parsed as PieData, title)
      else if (chartType === 'lineDual') svg = renderDualLineChart(parsed as DualAxisData, title)
      else if (chartType === 'processLinear') svg = renderProcessLinear(parsed as ProcessLinearData, title)
      else if (chartType === 'processCircular') svg = renderProcessCircular(parsed as ProcessCircularData, title)
      else if (chartType === 'mapDiagram') svg = renderMapDiagram(parsed as MapDiagramData, title)
      else if (chartType === 'flowChain') svg = renderFlowChain(parsed as FlowChainData, title)
      else if (chartType === 'drSteps') svg = renderDRSteps(parsed as DRStepsData, title)
      else if (chartType === 'drTypes') svg = renderDRTypes(parsed as DRTypesData, title)
      else if (chartType === 'drRows') svg = renderDRRows(parsed as DRRowsData, title)
      else if (chartType === 'tierList') svg = renderTierList(parsed as TierListData, title)
      else if (chartType === 'badgeColumns') svg = renderBadgeColumns(parsed as BadgeColumnsData, title)
      else if (chartType === 'cueFormatTable') svg = renderCueFormatTable(parsed as CueFormatTableData, title)
      else if (chartType === 'pairFlow') svg = renderPairFlow(parsed as PairFlowData, title)
      else if (chartType === 'methodDiagram') svg = renderMethodDiagram(parsed as MethodDiagramData, title)
      else if (chartType === 'connectorGrid') svg = renderConnectorGrid(parsed as ConnectorGridData, title)
      else if (chartType === 'groupedChain') svg = renderGroupedChain(parsed as GroupedChainData, title)
      else if (chartType === 'miniFacts') svg = renderMiniFacts(parsed as MiniFactsData, title)
      else if (chartType === 'cardGrid') svg = renderCardGrid(parsed as CardGridData, title)
      else if (chartType === 'badgeGroups') svg = renderBadgeGroups(parsed as BadgeGroupsData, title)
      else if (chartType === 'formulaBox') svg = renderFormulaBox(parsed as FormulaBoxData, title)
      else if (chartType === 'equationBox') svg = renderEquationBox(parsed as EquationBoxData, title)
      else if (chartType === 'equationChain') svg = renderEquationChain(parsed as EquationChainData, title)
      else if (chartType === 'branchRow') svg = renderBranchRow(parsed as BranchRowData, title)
      else if (chartType === 'checkMatrix') svg = renderCheckMatrix(parsed as CheckMatrixData, title)
      else if (chartType === 'specifyRule') svg = renderSpecifyRule(parsed as SpecifyRuleData, title)
      else if (chartType === 'specifyTree') svg = renderSpecifyTree(parsed as SpecifyTreeData, title)
      else if (chartType === 'simpleTable') svg = renderSimpleTable(parsed as SimpleTableData, title)
      else if (chartType === 'thinkTable') svg = renderThinkTable(parsed as ThinkTableData, title)
      else if (chartType === 'exampleWalk') svg = renderExampleWalk(parsed as ExampleWalkData, title)
      else if (chartType === 'stemReference') svg = renderStemReference(parsed as StemReferenceData, title)
      else if (chartType === 'compareHighlight') svg = renderCompareHighlight(parsed as CompareData, title)
      else svg = renderLineChart(parsed as LineBarData, title)
    }
    // renderHTML's array format chỉ chèn được text (bị escape) hoặc node con, không chèn được HTML
    // thô — nên nhúng SVG dưới dạng data URI trong <img>, trình duyệt tự vẽ ra, không cần NodeView.
    const src = svg ? `data:image/svg+xml;base64,${base64Encode(svg)}` : ''

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'ih-chart',
        'data-chart': '',
        'data-chart-type': chartType,
        'data-title': title,
        'data-payload': data,
      }),
      ['p', { class: 'ih-chart-title' }, title],
      ['img', { class: 'ih-chart-svg', src, alt: title }],
    ]
  },
})

export { encodeData }
