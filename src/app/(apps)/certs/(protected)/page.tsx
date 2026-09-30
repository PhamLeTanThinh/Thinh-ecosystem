import type { CSSProperties } from 'react'
import Link from 'next/link'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { assertCertsAccess } from '@/lib/certs/access'
import { CERT_CATALOG } from '@/lib/certs/catalog'
import questions from '@/lib/certs/ccaf-questions.json'
import { CCAF_TOPICS } from '@/lib/certs/ccaf-theory'

// Màu nhấn lần lượt cho các cert trong catalog (sau CCAF) — lấy từ bảng Midnight Velvet của certs.css cho đồng bộ.
const CATALOG_ACCENTS = ['#1f2a5c', '#2f6b57', '#4a143b', '#9a7433', '#3b5bdb']

// Mỗi chứng chỉ 1 card, các chế độ học là các nút bên trong. Cert mới thì thêm vào lib/certs/catalog.ts.
const CERTS = [
  {
    title: 'CCAF',
    accent: '#b4532a',
    subtitle: 'Claude Certified Architect — Foundations',
    description: `Chứng chỉ nền tảng dành cho kiến trúc sư xây dựng ứng dụng với Claude: thiết kế agent nhiều tầng, tích hợp tool và MCP, cấu hình Claude Code, prompt & đầu ra có cấu trúc, quản lý ngữ cảnh. Đọc lý thuyết theo 5 domain rồi luyện ${questions.length} câu có giải thích song ngữ.`,
    tags: ['5 domain', 'Song ngữ', 'Bẫy & mẹo', 'Ôn câu sai'],
    actions: [
      { href: '/certs/ccaf/theory', icon: '📖', label: 'Lý thuyết', meta: `${CCAF_TOPICS.length} chủ đề`, primary: false },
      { href: '/certs/ccaf', icon: '📝', label: 'Luyện đề', meta: `${questions.length} câu`, primary: true },
    ],
  },
  ...CERT_CATALOG.map((c, i) => ({
    title: c.code,
    accent: CATALOG_ACCENTS[i % CATALOG_ACCENTS.length],
    subtitle: `Microsoft ${c.code} — ${c.title}`,
    description: c.description,
    tags: [...c.tags, c.questions.some((q) => q.vn.question) ? 'Song ngữ' : 'Giải thích tiếng Việt'],
    actions: [
      ...(c.theory
        ? [{ href: `/certs/${c.id}/theory`, icon: '📖', label: 'Lý thuyết', meta: `${c.theory.reduce((n, d) => n + d.topics.length, 0)} chủ đề`, primary: false }]
        : []),
      { href: `/certs/${c.id}`, icon: '📝', label: 'Luyện đề', meta: `${c.questions.length} câu`, primary: true },
    ],
  })),
]

export default async function CertsPage() {
  await assertCertsAccess()
  return (
    <div className="w-full px-6 py-8 md:px-10">
      <AppBreadcrumb app="/certs" className="mb-6" />

      <h1 className="text-2xl font-bold">Certs Hub</h1>
      <p className="mt-1 text-sm text-muted">Tổng hợp đề thi các chứng chỉ.</p>

      <div className="ct-grid mt-8">
        {CERTS.map((cert, i) => (
          <div key={cert.title} className="ct-card" style={{ '--acc': cert.accent, '--i': i } as CSSProperties}>
            <span className="ct-card-glyph" aria-hidden>
              {cert.title}
            </span>

            <span className="ct-card-code">{cert.title}</span>
            <h2 className="ct-card-title">{cert.subtitle}</h2>
            <p className="ct-card-desc">{cert.description}</p>

            <div className="ct-card-tags">
              {cert.tags.map((t) => (
                <span key={t} className="ct-card-tag">
                  {t}
                </span>
              ))}
            </div>

            <div className={`ct-card-actions${cert.actions.length > 1 ? ' ct-card-actions--2' : ''}`}>
              {cert.actions.map((a) => (
                <Link key={a.href} href={a.href} className={`ct-action${a.primary ? ' ct-action--primary' : ''}`}>
                  <span className="ct-action-icon">{a.icon}</span>
                  <span className="ct-action-label">{a.label}</span>
                  <span className="ct-action-meta">{a.meta}</span>
                  <span className="ct-action-go">
                    Vào học <span aria-hidden>→</span>
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
