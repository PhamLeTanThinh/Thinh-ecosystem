import type { ExChip, ExSentence } from '@/lib/ielts/practice'

type Row = (ExChip | string)[]

export interface LinearSpec {
  // true = Yes / No / Not Given (quan điểm tác giả), mặc định True / False / Not Given.
  yn?: boolean
  // Step 01 — câu hỏi rút gọn thành cụm (thường: S xanh lá + phần cần kiểm chứng đỏ).
  question: Row
  // Step 02 — từ khoá (vd '"Attempts", "rarely made"') + vị trí (vd 'đoạn 8') + đoạn đó nói về gì.
  keywords: string
  where: string
  topic: string
  // Step 03 — trích dẫn nguyên văn; **đậm** phần quan trọng (phần còn lại tự in nghiêng).
  quote: string
  evidence: Row[] // các dòng rút gọn chứng cứ
  result?: Row // dòng "→ Result:" (nếu có)
  mainIdea: string
  // Step 04 — so sánh nghĩa.
  inPassage: string
  inQuestion: string
  conclusion: string
  answer: 'TRUE' | 'FALSE' | 'YES' | 'NO' | 'NOT GIVEN'
  // Vì sao 2 đáp án còn lại sai: [đáp án, lý do].
  others: [string, string][]
}

// Trích dẫn in nghiêng, riêng phần **đậm** giữ đậm — inline() không lồng đậm trong nghiêng nên tách thành các
// đoạn nghiêng / đậm liền nhau.
function quoteLine(quote: string, where: string): string {
  const parts = `"${quote}"`
    .split('**')
    .map((p, i) => (i % 2 ? `**${p.trim()}**` : p.trim() ? `*${p.trim()}*` : ''))
    .filter(Boolean)
  return `📌 **Trích dẫn:** ${parts.join(' ')} (${where[0].toUpperCase()}${where.slice(1)})`
}

// Giải thích True/False/Not Given & Yes/No/Not Given theo khuôn "Linear thinking" 4 bước (Explanation.detail).
export function linear(sp: LinearSpec): (string | ExSentence)[] {
  const kind = sp.yn ? 'Yes / No / Not Given' : 'True / False / Not Given'
  return [
    `😊 **Ứng dụng Linear thinking để giải quyết dạng bài ${kind}**`,
    '**Step 01: Read the question to understand (main idea + detail)**',
    { prefix: '• **Simplified:**', chips: sp.question },
    '---',
    '**Step 02: Locate relevant information**',
    `🔍 **Từ khoá**: ${sp.keywords}`,
    `→ Dựa vào các từ khoá trên, ta tìm được **${sp.where}** ${sp.topic}.`,
    '---',
    '**Step 03: Read relevant information to understand (main + detail)**',
    quoteLine(sp.quote, sp.where),
    '• **Simplified:**',
    ...sp.evidence.map((chips) => ({ chips })),
    ...(sp.result ? [{ prefix: '**→ Result:**', chips: sp.result }] : []),
    `• **Main idea:** ${sp.mainIdea}`,
    '---',
    '**Step 04: Compare meaning with meaning**',
    `• **Trong bài đọc:** ${sp.inPassage}`,
    `• **Trong câu hỏi:** ${sp.inQuestion}`,
    `→ ${sp.conclusion}`,
    { prefix: '⇒ ✅ **Chọn:**', chips: [{ text: sp.answer, color: 'orange' }] },
    '---',
    '**Giải thích vì sao đáp án khác sai:**',
    ...sp.others.map(([label, why]) => `• **${label}**: ${why}`),
  ]
}
