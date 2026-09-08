import { Resend } from 'resend'

// Gửi email magic link mời xem /ielts. Cần RESEND_API_KEY trong .env — chưa đặt thì chỉ log ra
// console (hữu ích khi dev local mà không muốn cấu hình Resend thật).
export async function sendMagicLinkEmail(to: string, link: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn(`[ielts mailer] RESEND_API_KEY chưa được đặt — link đăng nhập cho ${to}: ${link}`)
    return
  }

  const resend = new Resend(apiKey)
  const from = process.env.RESEND_FROM_EMAIL || 'IELTS Knowledge Hub <onboarding@resend.dev>'

  await resend.emails.send({
    from,
    to,
    subject: 'Link đăng nhập IELTS Knowledge Hub',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #178A5A;">IELTS Knowledge Hub</h2>
        <p>Bạn được mời xem trang kiến thức IELTS. Bấm nút bên dưới để đăng nhập:</p>
        <p style="margin: 24px 0;">
          <a href="${link}" style="background: #178A5A; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
            Đăng nhập xem trang
          </a>
        </p>
        <p style="color: #5b6884; font-size: 13px;">Link có hiệu lực trong 30 phút. Nếu bạn không yêu cầu email này, có thể bỏ qua.</p>
      </div>
    `,
  })
}
