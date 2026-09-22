import Image from 'next/image'

interface Props {
  // Tiêu đề trang (chữ tay, giống banner của trang Kiến thức).
  heading: string
  // Câu tổng kết tiến độ + câu động viên bên dưới.
  title: string
  sub: string
  done: number
  doing: number
  total: number
}

// Banner đầu trang Làm đề / Vocab — cùng khung (.ih-les-hero) với banner trang Kiến thức, thêm mèo bên trái và
// thanh tiến độ: xanh lá = đã xong, xanh dương = đang làm, xám = chưa làm, kèm "đã chạm / tổng". Chỉ hiển thị.
export function ProgressBanner({ heading, title, sub, done, doing, total }: Props) {
  const pct = (n: number) => (total > 0 ? `${(n / total) * 100}%` : '0%')
  return (
    <header className="ih-les-hero">
      <Image src="/ielts/images/cat.png" alt="" width={120} height={120} className="ih-pr-banner-mascot" />
      <div className="ih-les-hero-body">
        <h1 className="ih-font-hand ih-les-hero-title">{heading}</h1>
        <p className="ih-les-hero-msg">{title}</p>
        <p className="ih-les-hero-sub">{sub}</p>
        <div className="ih-pr-progress">
          <div
            className="ih-pr-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done + doing}
            aria-label={`${done} xong, ${doing} đang làm, trên tổng ${total}`}
          >
            <span className="ih-pr-seg ih-pr-seg-done" style={{ width: pct(done) }} />
            <span className="ih-pr-seg ih-pr-seg-doing" style={{ width: pct(doing) }} />
          </div>
          <span className="ih-pr-progress-num">
            {done + doing} / {total}
          </span>
        </div>
      </div>
    </header>
  )
}
