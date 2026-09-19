import { AppBreadcrumb } from '@/components/study/Breadcrumb'

// Skeleton — placeholder tên chứng chỉ, chưa có ngân hàng đề thi thật. Sửa/thêm bớt danh sách
// này khi biết rõ những chứng chỉ nào cần ôn.
const CERTS = [
  { title: 'AZ-900', description: 'Microsoft Azure Fundamentals.' },
  { title: 'AI-900', description: 'Microsoft Azure AI Fundamentals.' },
  { title: 'CCAF', description: 'Chứng chỉ đang ôn — điền lại tên đầy đủ khi có đề.' },
]

export default function CertsPage() {
  return (
    <div className="w-full px-6 py-8 md:px-10">
      <AppBreadcrumb app="/certs" className="mb-6" />

      <h1 className="text-2xl font-bold">Certs Hub</h1>
      <p className="mt-1 text-sm text-muted">Tổng hợp đề thi các chứng chỉ.</p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CERTS.map((cert) => (
          <div key={cert.title} className="rounded-card border border-border bg-card p-4">
            <h2 className="font-semibold">{cert.title}</h2>
            <p className="mt-1 text-sm text-muted">{cert.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
