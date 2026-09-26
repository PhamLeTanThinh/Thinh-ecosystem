import Link from 'next/link'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { assertCertsAccess } from '@/lib/certs/access'
import { CERT_CATALOG } from '@/lib/certs/catalog'
import questions from '@/lib/certs/ccaf-questions.json'
import { CCAF_TOPICS } from '@/lib/certs/ccaf-theory'

// Mỗi chứng chỉ 1 card, các chế độ học là các nút bên trong. Cert chỉ có luyện đề thì thêm vào lib/certs/catalog.ts.
const CERTS = [
  {
    title: 'CCAF',
    subtitle: 'Claude Certified Architect — Foundations',
    description: `Chứng chỉ nền tảng dành cho kiến trúc sư xây dựng ứng dụng với Claude: thiết kế agent nhiều tầng, tích hợp tool và MCP, cấu hình Claude Code, prompt & đầu ra có cấu trúc, quản lý ngữ cảnh. Đọc lý thuyết theo 5 domain rồi luyện ${questions.length} câu có giải thích song ngữ.`,
    tags: ['5 domain', 'Song ngữ', 'Bẫy & mẹo', 'Ôn câu sai'],
    actions: [
      { href: '/certs/ccaf/theory', icon: '📖', label: 'Lý thuyết', meta: `${CCAF_TOPICS.length} chủ đề`, primary: false },
      { href: '/certs/ccaf', icon: '📝', label: 'Luyện đề', meta: `${questions.length} câu`, primary: true },
    ],
  },
  ...CERT_CATALOG.map((c) => ({
    title: c.code,
    subtitle: `Microsoft ${c.code} — ${c.title}`,
    description: c.description,
    tags: [...c.tags, 'Giải thích tiếng Việt'],
    actions: [{ href: `/certs/${c.id}`, icon: '📝', label: 'Luyện đề', meta: `${c.questions.length} câu`, primary: true }],
  })),
]

export default async function CertsPage() {
  await assertCertsAccess()
  return (
    <div className="w-full px-6 py-8 md:px-10">
      <AppBreadcrumb app="/certs" className="mb-6" />

      <h1 className="text-2xl font-bold">Certs Hub</h1>
      <p className="mt-1 text-sm text-muted">Tổng hợp đề thi các chứng chỉ.</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CERTS.map((cert) => (
          <div key={cert.title} className="relative flex flex-col overflow-hidden rounded-card border border-border bg-card p-6 shadow-sm">
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-plum-soft opacity-90 blur-xl" />

            <div className="relative">
              <span className="rounded-pill border border-gold/40 bg-accent px-3 py-1 text-lg font-extrabold tracking-wide text-gold-light">{cert.title}</span>
            </div>

            <h2 className="relative mt-5 text-base font-bold leading-snug">{cert.subtitle}</h2>
            <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted">{cert.description}</p>

            <div className="relative mt-4 flex flex-wrap gap-1.5">
              {cert.tags.map((t) => (
                <span key={t} className="rounded-pill border border-border px-2.5 py-0.5 text-xs text-muted">
                  {t}
                </span>
              ))}
            </div>

            <div className={`relative mt-6 grid gap-3 ${cert.actions.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {cert.actions.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className={`group flex flex-col items-start gap-1 rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${
                    a.primary ? 'border-accent/40 bg-accent-soft' : 'border-border bg-card hover:border-accent'
                  }`}
                >
                  <span className="text-xl">{a.icon}</span>
                  <span className="font-bold">{a.label}</span>
                  <span className="text-xs text-muted">{a.meta}</span>
                  <span className="mt-1 text-sm font-semibold text-accent">
                    Vào học <span className="inline-block transition group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
