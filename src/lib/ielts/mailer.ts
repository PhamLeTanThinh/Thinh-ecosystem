import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import { MAGIC_LINK_SUBJECT, type MagicLinkKind } from '@/lib/ielts/mailSubjects'

// Gửi email magic link mời xem /ielts (và báo chủ có người xin quyền). Cách gửi được chọn theo biến môi trường —
// xem pickProvider() bên dưới; chưa cấu hình gì thì chỉ log ra console (tiện dev local).
// Email người xin quyền là chuỗi do người lạ tự nhập — phải escape trước khi nhét vào HTML mail.
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Màu và giọng văn lấy theo popup đăng nhập của trang (components/ielts/AccessGate.tsx): nền be, chữ xanh
// ink, nút hồng rose, con mèo Diên trong bong bóng hội thoại. Email không dùng được font web/CSS biến nên
// mọi thứ là inline style + bảng (table) cho chắc chắn hiển thị đúng ở Gmail/Outlook.
const INK = '#2b3a55'
const INK_SOFT = '#5b6884'
const ROSE = '#c9667a'
const BG = '#f5f4f0'
const FUR = '#8a6d58' // màu chữ nhấn theo màu lông em mèo, giống chữ "Diên" ở popup
const FONT = "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

// Ảnh mèo (bản 440px của public/preloader/image/happy.png, ~135KB thay vì 1,5MB; PNG để nền trắng đúng 255, JPEG
// bị lệch màu nền). Ảnh được NHÚNG THẲNG vào thư dưới dạng đính kèm nội tuyến (cid:) thay vì trỏ tới URL: chạy
// local thì NEXT_PUBLIC_APP_URL là localhost nên Gmail không tải được ảnh qua URL, còn cid: không phụ thuộc
// chỗ host. Chỉ khi không lấy được ảnh (lỗi mạng...) mới rơi về URL tuyệt đối.
const MASCOT_IMAGE_PATH = '/preloader/image/happy-mail.png'
const MASCOT_CID = 'diennie-mascot'

interface InlineAttachment {
  filename: string
  content: string // base64 (Resend nhận Buffer hoặc chuỗi base64; dùng base64 cho chắc khi SDK tự JSON.stringify)
  contentType: string
  contentId: string
}

// Tải ảnh mèo từ chính site (public/ không chắc có sẵn trong filesystem của hàm serverless nên không đọc bằng
// fs). Lỗi thì trả null — thư vẫn gửi được, chỉ mất ảnh.
export async function loadMascotAttachment(origin: string): Promise<InlineAttachment | null> {
  try {
    const res = await fetch(`${origin}${MASCOT_IMAGE_PATH}`, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    return { filename: 'dien.png', content: Buffer.from(await res.arrayBuffer()).toString('base64'), contentType: 'image/png', contentId: MASCOT_CID }
  } catch (err) {
    console.error('[ielts mailer] không tải được ảnh mèo để nhúng vào thư:', err)
    return null
  }
}

interface MailLayout {
  preheader: string // dòng xem trước hiện cạnh tiêu đề ở hộp thư, không hiện trong thân thư
  bubbleHtml: string // câu của con mèo, đã escape
  bodyHtml: string // đoạn giải thích dưới con mèo, đã escape
  ctaLabel: string
  ctaUrl: string
  footerHtml: string
  fallbackUrl?: string // in thẳng URL dưới nút để dán tay được khi nút không bấm
  inlineMascot: boolean // true: ảnh mèo là đính kèm cid: (xem loadMascotAttachment); false: trỏ URL tuyệt đối
}

function renderMail(l: MailLayout): string {
  const cta = escapeHtml(l.ctaUrl)
  const mascotSrc = l.inlineMascot ? `cid:${MASCOT_CID}` : `${new URL(l.ctaUrl).origin}${MASCOT_IMAGE_PATH}`
  return `<!doctype html>
<html lang="vi">
  <body style="margin:0;padding:0;background:${BG};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${l.preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid rgba(43,58,85,0.14);border-radius:24px;">
            <tr>
              <td align="center" style="padding:28px 28px 8px;font-family:${FONT};">
                <div style="display:inline-block;max-width:340px;background:${BG};border-radius:18px;padding:12px 20px;color:${INK};font-size:15px;line-height:1.5;font-weight:600;">
                  ${l.bubbleHtml}
                </div>
                <div style="width:0;height:0;margin:0 auto;border-left:8px solid transparent;border-right:8px solid transparent;border-top:9px solid ${BG};"></div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:4px 28px 0;">
                <img src="${mascotSrc}" width="220" alt="Diên — chú mèo linh vật đang vui mừng" style="display:block;width:220px;max-width:100%;height:auto;border:0;">
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 32px 0;font-family:${FONT};color:${INK};font-size:15px;line-height:1.6;">
                ${l.bodyHtml}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:22px 32px 6px;font-family:${FONT};">
                <a href="${cta}" style="display:inline-block;background:${ROSE};color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:14px 34px;border-radius:999px;">${l.ctaLabel}</a>
              </td>
            </tr>
            ${
              l.fallbackUrl
                ? `<tr>
              <td align="center" style="padding:10px 32px 0;font-family:${FONT};color:${INK_SOFT};font-size:12px;line-height:1.5;">
                Nút không bấm được? Dán link này vào trình duyệt nhé:<br>
                <a href="${cta}" style="color:${INK_SOFT};word-break:break-all;">${cta}</a>
              </td>
            </tr>`
                : ''
            }
            <tr>
              <td align="center" style="padding:20px 32px 28px;font-family:${FONT};color:${INK_SOFT};font-size:13px;line-height:1.6;">
                ${l.footerHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

const em = (s: string) => `<span style="color:${FUR};font-weight:700;">${s}</span>`

export function renderMagicLinkHtml(link: string, inlineMascot = false, kind: MagicLinkKind = 'ielts'): string {
  const admin = kind === 'admin'
  return renderMail({
    inlineMascot,
    preheader: admin ? 'Bấm vào link để vào trang Admin — link có hiệu lực trong 30 phút nha!' : 'Bấm vào link để vào IELTS Hub — link có hiệu lực trong 30 phút nha!',
    bubbleHtml: admin ? 'Ông chủ ơi!<br>Link vào trang Admin đây nè!' : `Xin chào, em là ${em('Diên')}!<br>Link đăng nhập của anh chị đây nè!`,
    bodyHtml: admin
      ? 'Ông chủ bấm nút bên dưới để vào trang <strong>Admin</strong> duyệt yêu cầu và quản lý hồ sơ học nha. Vào xong em nhớ ông chủ 30 ngày, mỗi lần ghé lại em gia hạn thêm!'
      : 'Anh chị bấm nút bên dưới để vào <strong>IELTS Hub</strong> nha. Vào xong em nhớ anh chị 30 ngày, mỗi lần ghé lại em gia hạn thêm, nên lần sau cứ vào thẳng trang là được!',
    ctaLabel: admin ? 'Vào trang Admin nè' : 'Vào IELTS Hub nè',
    ctaUrl: link,
    fallbackUrl: link,
    footerHtml: admin
      ? 'Link có hiệu lực trong <strong>30 phút</strong>, hết hạn thì ông chủ xin link mới nhé.<br>Nếu không phải ông chủ yêu cầu thì cứ bỏ qua nha 🐾'
      : 'Link có hiệu lực trong <strong>30 phút</strong>, hết hạn thì anh chị xin link mới nhé.<br>Nếu anh chị không yêu cầu email này thì cứ bỏ qua, em không giận đâu 🐾',
  })
}

export function renderAccessRequestHtml(requesterEmail: string, adminUrl: string, inlineMascot = false): string {
  return renderMail({
    inlineMascot,
    preheader: `${escapeHtml(requesterEmail)} vừa xin quyền xem IELTS Hub`,
    bubbleHtml: 'Ông chủ ơi!<br>Có người xin quyền xem trang nè!',
    bodyHtml: `<strong style="color:${ROSE};">${escapeHtml(requesterEmail)}</strong> vừa xin quyền xem <strong>IELTS Hub</strong>. Ông chủ duyệt giúp em nha, duyệt xong em gửi link đăng nhập cho bạn ấy liền!`,
    ctaLabel: 'Xem &amp; duyệt yêu cầu',
    ctaUrl: adminUrl,
    footerHtml: 'Không quen người này thì cứ bỏ qua, hoặc bấm Từ chối trong trang admin nhé 🐾',
  })
}

// ── Chọn cách gửi ─────────────────────────────────────────────────────────────────────────────────────────────
// Thứ tự ưu tiên:
//   1. 'resend'         — có RESEND_API_KEY và RESEND_FROM_EMAIL trỏ tới địa chỉ của domain riêng đã xác minh trên Resend
//                          (gửi được tới mọi người, nhìn chuyên nghiệp nhất).
//   2. 'gmail'          — có GMAIL_USER + GMAIL_APP_PASSWORD: gửi qua SMTP của Gmail, KHÔNG cần tên miền, gửi được tới mọi
//                          người (giới hạn ~500 thư/ngày của Gmail). Có thể trỏ sang SMTP khác bằng SMTP_HOST/SMTP_PORT.
//   3. 'resend-sandbox' — chỉ có RESEND_API_KEY (địa chỉ onboarding@resend.dev): Resend CHỈ cho gửi tới chính email chủ
//                          tài khoản Resend, người khác sẽ không nhận được gì. Chỉ để chạy thử.
//   4. không cấu hình gì → log ra console.
type Provider = 'resend' | 'gmail' | 'resend-sandbox'

const DEFAULT_RESEND_FROM = 'IELTS Knowledge Hub <onboarding@resend.dev>'
const DEFAULT_FROM_NAME = 'Diên · IELTS Hub'

function smtpConfig() {
  const user = process.env.GMAIL_USER?.trim()
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '') // Google hiển thị mật khẩu ứng dụng kèm dấu cách
  if (!user || !pass) return null
  const port = Number(process.env.SMTP_PORT) || 465
  return { host: process.env.SMTP_HOST?.trim() || 'smtp.gmail.com', port, secure: port === 465, auth: { user, pass } }
}

export function pickProvider(): Provider | null {
  const resendKey = process.env.RESEND_API_KEY
  const resendFrom = process.env.RESEND_FROM_EMAIL?.trim()
  if (resendKey && resendFrom && !/@resend\.dev\b/i.test(resendFrom)) return 'resend'
  if (smtpConfig()) return 'gmail'
  if (resendKey) return 'resend-sandbox'
  return null
}

interface OutMail {
  kind: string // nhãn để ghi log
  to: string
  subject: string
  html: string
  mascot: InlineAttachment | null
  // In ra console khi chưa cấu hình cách gửi nào — dev local vẫn thấy link để bấm tay.
  offlineNote: string
}

// Gửi 1 thư, trả true nếu nhà cung cấp đã nhận thư, false nếu thất bại hoặc chưa cấu hình. KHÔNG ném lỗi: request-link
// cố ý trả 1 thông báo chung cho mọi email, ném lỗi ở đây sẽ làm lộ email nào đã được mời (đường có gửi thư) qua mã
// lỗi 500. Lỗi được ghi vào log máy chủ, và kết quả true/false được trả lên để trang admin báo cho chủ biết.
// (resend.emails.send() cũng KHÔNG ném lỗi khi bị từ chối mà trả về { error } — nên phải đọc, không thì thư mất im lặng.)
async function deliver(m: OutMail): Promise<boolean> {
  const provider = pickProvider()
  if (!provider) {
    console.warn(`[ielts mailer] chưa cấu hình cách gửi mail (GMAIL_USER + GMAIL_APP_PASSWORD, hoặc RESEND_API_KEY) — ${m.offlineNote}`)
    return false
  }

  try {
    if (provider === 'gmail') {
      const cfg = smtpConfig()!
      const transporter = nodemailer.createTransport({ host: cfg.host, port: cfg.port, secure: cfg.secure, auth: cfg.auth })
      await transporter.sendMail({
        from: { name: process.env.MAIL_FROM_NAME?.trim() || DEFAULT_FROM_NAME, address: cfg.auth.user },
        to: m.to,
        subject: m.subject,
        html: m.html,
        attachments: m.mascot
          ? [{ filename: m.mascot.filename, content: m.mascot.content, encoding: 'base64', contentType: m.mascot.contentType, cid: m.mascot.contentId }]
          : undefined,
      })
      return true
    }

    const resend = new Resend(process.env.RESEND_API_KEY!)
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_RESEND_FROM,
      to: m.to,
      subject: m.subject,
      html: m.html,
      attachments: m.mascot ? [m.mascot] : undefined,
    })
    if (error) {
      const hint =
        provider === 'resend-sandbox'
          ? ' — đang dùng địa chỉ thử nghiệm onboarding@resend.dev, chỉ gửi được tới email chủ tài khoản Resend; cấu hình GMAIL_USER + GMAIL_APP_PASSWORD hoặc xác minh domain để gửi cho người khác'
          : ''
      console.error(`[ielts mailer] Resend từ chối thư "${m.kind}" gửi tới ${m.to}: ${error.name ?? 'error'} — ${error.message}${hint}`)
      return false
    }
    return true
  } catch (err) {
    console.error(`[ielts mailer] gửi thư "${m.kind}" tới ${m.to} thất bại (${provider}):`, err)
    return false
  }
}

// Báo cho chủ có người lạ vừa xin quyền xem /ielts, kèm link tới trang admin để duyệt.
export async function sendAccessRequestNotice(to: string, requesterEmail: string, adminUrl: string): Promise<boolean> {
  const mascot = await loadMascotAttachment(new URL(adminUrl).origin)
  return deliver({
    kind: 'báo yêu cầu truy cập',
    to,
    subject: 'Có người xin quyền truy cập IELTS Knowledge Hub',
    html: renderAccessRequestHtml(requesterEmail, adminUrl, mascot !== null),
    mascot,
    offlineNote: `${requesterEmail} xin quyền truy cập, duyệt tại: ${adminUrl}`,
  })
}

// Tiêu đề thư (MAGIC_LINK_SUBJECT) được nhắc nguyên văn trong các popup đăng nhập (components/ielts/AccessGate.tsx
// và components/admin/AdminGate.tsx) để người dùng tìm đúng thư — các popup import thẳng hằng số này nên luôn khớp.
export async function sendMagicLinkEmail(to: string, link: string, kind: MagicLinkKind = 'ielts'): Promise<boolean> {
  const mascot = await loadMascotAttachment(new URL(link).origin)
  return deliver({
    kind: 'link đăng nhập',
    to,
    subject: MAGIC_LINK_SUBJECT[kind],
    html: renderMagicLinkHtml(link, mascot !== null, kind),
    mascot,
    offlineNote: `link đăng nhập cho ${to}: ${link}`,
  })
}
