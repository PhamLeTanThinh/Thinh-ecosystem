import { STUDY_TOOLS } from '@/lib/apps/tools'
import { StudyCardLink } from '@/components/study/StudyCardLink'
import { CardFx } from '@/components/study/CardFx'
import { RevealGrid } from '@/components/study/RevealGrid'
import { MascotSpeech } from '@/components/study/MascotSpeech'
import { DonateWidget } from '@/components/study/DonateWidget'
import { ShieldedVideo } from '@/components/media/ShieldedVideo'

// Nền trắng sáng (xem study.css). Mỗi thẻ dáng ngang, video linh vật của app đó phủ kín cả thẻ (không
// khung, không viền). Lúc nghỉ, đáy thẻ có 1 dải mờ trắng phủ hạt phim (noise/grain giống trang chủ) để
// tên app (font bình thường, nét) luôn đọc rõ — chấp nhận che bớt chi tiết video ở đó. Rê chuột / focus
// thì dải mờ + hạt tan đi, khung bọc tên app hiện ra thành 1 khung kính tối phát sáng theo màu app (kiểu
// tham khảo codepen.io/HejChristian/pen/VYYwqza — Bioluminescence: box-shadow glow + blur thường, không
// filter SVG nặng), cả thẻ cũng phát sáng viền quanh; mô tả mở ra bên dưới tên. Thiết bị cảm ứng (không
// có hover) thì luôn ở trạng thái nghỉ, mô tả luôn hiện. Cả thẻ là 1 đường dẫn nên không cần nút "Mở app".
export default function StudyPage() {
  return (
    <div className="sd-root">
      <div className="sd-content">
        <header className="sd-head">
          <div>
            <p className="sd-kicker">Study</p>
            <h1 className="sd-title">
              <span className="sd-title-em">Diennie</span> thích học
            </h1>
            <p className="sd-subtitle">Học đi, không phải do ai ép, mà vì tương lai của bạn xứng đáng tốt hơn.</p>
          </div>

          <MascotSpeech />
        </header>

        <RevealGrid className="sd-grid">
          {STUDY_TOOLS.map((tool) => (
            <StudyCardLink key={tool.href} href={tool.href} accent={tool.accent} className="sd-card">
              <span className="sd-card-stage">
                {tool.videoKey && <ShieldedVideo className="sd-card-video" mediaKey={tool.videoKey} lazy />}
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
        </RevealGrid>
      </div>

      <DonateWidget />
    </div>
  )
}
