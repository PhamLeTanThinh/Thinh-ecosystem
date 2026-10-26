import { ago, formatAdminDate } from '@/components/admin/format'
import { CERT_SECTION_LABEL, type CertSection, type CertViewStat } from '@/lib/certs/viewTypes'

const sectionsText = (v: CertViewStat) =>
  (Object.keys(CERT_SECTION_LABEL) as CertSection[])
    .filter((k) => v.sections[k])
    .map((k) => `${CERT_SECTION_LABEL[k]} ${v.sections[k]}`)
    .join(' · ')

// Các cert 1 người xem đã mở (lib/certs/views.ts), dạng chip "CCAF · 5" — rê chuột xem từng phần và lần mở gần nhất.
// detailed = popup chi tiết: in luôn từng phần + thời gian ra chữ thay vì để trong tooltip.
export function CertViewsList({ views, detailed = false }: { views: CertViewStat[]; detailed?: boolean }) {
  if (views.length === 0) return <span className="adm-cell-sub">—</span>
  if (detailed) {
    return (
      <ul className="lad-kv">
        {views.map((v) => (
          <li key={v.cert}>
            <span>
              <b>{v.cert.toUpperCase()}</b> · {sectionsText(v)}
            </span>
            <b title={v.lastAt ? formatAdminDate(v.lastAt) : undefined}>
              {v.count} lần · {ago(v.lastAt)}
            </b>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <span className="lad-tags">
      {views.map((v) => (
        <span key={v.cert} className="adm-pill adm-pill-accent" title={`${sectionsText(v)}${v.lastAt ? ` — lần cuối ${formatAdminDate(v.lastAt)}` : ''}`}>
          {v.cert.toUpperCase()} · {v.count}
        </span>
      ))}
    </span>
  )
}
