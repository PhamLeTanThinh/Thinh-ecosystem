import { STUDY_TOOLS } from '@/lib/apps/tools'
import { StudyCardLink } from '@/components/study/StudyCardLink'
import { CardFx } from '@/components/study/CardFx'
import { MascotSpeech } from '@/components/study/MascotSpeech'

// Nền trắng sáng (xem study.css). Mỗi thẻ dáng ngang, video linh vật của app đó phủ kín cả thẻ (không
// khung, không viền). Lúc nghỉ, đáy thẻ có 1 dải mờ trắng phủ hạt phim (noise/grain giống trang chủ) để
// tên app (font bình thường, nét) luôn đọc rõ — chấp nhận che bớt chi tiết video ở đó. Rê chuột / focus
// thì dải mờ + hạt tan đi, khung bọc tên app hiện ra thành 1 tấm nước trong rồi loang ra phủ kín cả thẻ
// (video bên dưới khúc xạ méo chảy), mô tả mở ra bên dưới tên. Thiết bị cảm ứng (không có hover) thì
// luôn ở trạng thái nghỉ, mô tả luôn hiện. Cả thẻ là 1 đường dẫn nên không cần nút "Mở app".
export default function StudyPage() {
  return (
    <div className="sd-root">
      {/* Bộ lọc khúc xạ "chất lỏng" cho backdrop-filter: url(#…) trong study.css: nhiễu fractal (làm mịn bằng
          Gaussian để ra những mảng cong mềm chứ không lấm tấm) làm bản đồ dịch chuyển điểm ảnh, còn tần số
          nhiễu được animate (SMIL) nên hình méo luôn trôi chảy. Dùng cho khung nước của thẻ (khi rê chuột);
          chỉ tốn công vẽ khi khung đang hiện. */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        <defs>
          <filter id="sd-water" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.005 0.009" numOctaves="1" seed="4" result="noise">
              <animate attributeName="baseFrequency" dur="8s" values="0.005 0.009;0.008 0.006;0.005 0.009" repeatCount="indefinite" />
            </feTurbulence>
            <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
            <feDisplacementMap in="SourceGraphic" in2="soft" scale="70" xChannelSelector="R" yChannelSelector="G" result="warped" />
            <feGaussianBlur in="warped" stdDeviation="0.4" />
          </filter>
        </defs>
      </svg>

      <div className="sd-content">
        <header className="sd-head">
          <div>
            <p className="sd-kicker">Study</p>
            <h1 className="sd-title">Diennie thích học</h1>
            <p className="sd-subtitle">Chọn một thẻ để mở app tương ứng.</p>
          </div>

          <MascotSpeech />
        </header>

        <div className="sd-grid">
          {STUDY_TOOLS.map((tool) => (
            <StudyCardLink key={tool.href} href={tool.href} accent={tool.accent} className="sd-card">
              <span className="sd-card-stage">
                {tool.video && (
                  <video className="sd-card-video" src={tool.video} autoPlay muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1} />
                )}
                <span className="sd-card-shade" />
                {tool.effect && <CardFx effect={tool.effect} />}
                <span className="sd-card-band" />
                <span className="sd-card-grain" />
                <span className="sd-card-copy">
                  <span className="sd-card-name">{tool.title}</span>
                  <span className="sd-card-more">
                    <span className="sd-card-desc">{tool.description}</span>
                  </span>
                </span>
              </span>
            </StudyCardLink>
          ))}
        </div>
      </div>
    </div>
  )
}
