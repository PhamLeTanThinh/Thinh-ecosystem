export interface ResearchPaper {
  slug: string
  title: string
  authors: string
  year: number
  venue: string
  // Ghi chú/tóm tắt — đặt chỗ, điền khi đọc xong.
  summary: string
}

// Skeleton — paper đặt chỗ, chưa có ghi chú thật. Thêm paper mới bằng cách khai báo thêm 1 mục ở đây.
export const RESEARCH_PAPERS: ResearchPaper[] = [
  { slug: 'attention-is-all-you-need', title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, venue: 'NeurIPS', summary: 'Ghi chú đang cập nhật.' },
  { slug: 'bert', title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2018, venue: 'NAACL', summary: 'Ghi chú đang cập nhật.' },
]

export function getResearchPaper(slug: string): ResearchPaper | undefined {
  return RESEARCH_PAPERS.find((p) => p.slug === slug)
}
