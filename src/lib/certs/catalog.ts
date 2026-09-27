import type { CertContext, CertQuestion } from '@/components/certs/CertQuiz'
import ab100 from './questions/ab-100.json'
import ab731 from './questions/ab-731.json'
import ai103 from './questions/ai-103.json'
import ai200 from './questions/ai-200.json'
import { AI200_ANSWER_GROUPS } from './ai-200/answer-groups'
import ai200Contexts from './ai-200/contexts.json'
import { AI200_DOMAINS } from './ai-200/theory'
import type { AnswerGroup } from './ccaf-answer-groups'
import type { TheoryDomain } from './ccaf-theory/types'

// Các chứng chỉ dùng chung trang /certs/[cert]. CCAF có trang riêng (/certs/ccaf) vì làm trước.
// Cert nào khai báo thêm `theory` / `answerGroups` / `tip` trong từng câu thì tự có thêm các chế độ học giống CCAF:
// /certs/[cert]/theory, /certs/[cert]/answers, /certs/[cert]/tips.
// Đề lấy từ study-certificate (huyentran1306.github.io/study-certificate, đã được đồng ý); giải thích bằng tiếng Việt.
export interface CertInfo {
  id: string
  code: string
  title: string
  description: string
  tags: string[]
  questions: CertQuestion[]
  // Lý thuyết theo domain, mỗi chủ đề trỏ về các câu liên quan (cùng kiểu với CCAF).
  theory?: TheoryDomain[]
  // Nhóm câu có đáp án đúng cùng một kỹ thuật (cùng kiểu với ccaf-answer-groups.ts).
  answerGroups?: AnswerGroup[]
  // Bối cảnh case study / scenario dùng chung, câu hỏi trỏ tới bằng `context`.
  contexts?: Record<string, CertContext>
}

export const CERT_CATALOG: CertInfo[] = [
  {
    id: 'ai-103',
    code: 'AI-103',
    title: 'Developing AI Apps and Agents on Azure',
    description: 'Xây dựng và vận hành ứng dụng AI, agent trên Microsoft Foundry: generative AI, agentic solution, computer vision, phân tích văn bản và trích xuất thông tin.',
    tags: ['Microsoft Foundry', 'Agent', 'Computer Vision'],
    questions: ai103 as unknown as CertQuestion[],
  },
  {
    id: 'ai-200',
    code: 'AI-200',
    title: 'Developing AI Cloud Solutions on Azure',
    description: 'Phát triển giải pháp AI trên cloud Azure: container, kết nối và dùng dịch vụ Azure, quản trị dữ liệu cho AI, bảo mật và giám sát.',
    tags: ['Container', 'Azure services', 'Bảo mật'],
    questions: ai200 as unknown as CertQuestion[],
    theory: AI200_DOMAINS,
    answerGroups: AI200_ANSWER_GROUPS,
    contexts: ai200Contexts as Record<string, CertContext>,
  },
  {
    id: 'ab-100',
    code: 'AB-100',
    title: 'Agentic AI Business Solutions Architect',
    description: 'Lập kế hoạch, thiết kế và triển khai giải pháp AI agentic cho doanh nghiệp với Copilot Studio, Microsoft Foundry và Azure AI.',
    tags: ['Copilot Studio', 'Agentic AI', 'Kiến trúc'],
    questions: ab100 as unknown as CertQuestion[],
  },
  {
    id: 'ab-731',
    code: 'AB-731',
    title: 'AI Transformation Leader',
    description: 'Chiến lược chuyển đổi AI, Responsible AI và quản trị, Microsoft 365 Copilot, Copilot Studio, Microsoft Foundry, chi phí và cấp phép.',
    tags: ['Chiến lược AI', 'Responsible AI', 'Copilot'],
    questions: ab731 as unknown as CertQuestion[],
  },
]

export function findCert(id: string): CertInfo | undefined {
  return CERT_CATALOG.find((c) => c.id === id)
}
