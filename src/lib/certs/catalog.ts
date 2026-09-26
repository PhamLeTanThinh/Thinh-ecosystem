import type { CertQuestion } from '@/components/certs/CertQuiz'
import ab100 from './questions/ab-100.json'
import ab731 from './questions/ab-731.json'
import ai103 from './questions/ai-103.json'
import ai200 from './questions/ai-200.json'

// Các chứng chỉ chỉ có phần luyện đề, dùng chung trang /certs/[cert]. CCAF có trang riêng (/certs/ccaf) vì còn phần lý thuyết.
// Đề lấy từ study-certificate (huyentran1306.github.io/study-certificate, đã được đồng ý); giải thích bằng tiếng Việt.
export interface CertInfo {
  id: string
  code: string
  title: string
  description: string
  tags: string[]
  questions: CertQuestion[]
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
