// Font riêng của /admin — chỉ 1 font trung tính (Inter) cho toàn trang, không dùng font chữ viết tay của IELTS
// nữa (trang quản trị cần đọc nhanh, chuyên nghiệp hơn là dễ thương). Popup xác nhận (AdminDialog) vẫn giữ
// nguyên mèo Diên, không liên quan tới font này.
//
// Tái dùng đúng instance Inter đã tạo ở ielts/fonts.ts thay vì khai báo lần nữa ở đây (docs next/font: "Using a
// font definitions file" — mỗi cấu hình font chỉ khai báo 1 lần rồi import lại). Font giờ tự host
// (src/fonts/inter, next/font/local) — xem ghi chú ở app/layout.tsx.
// Vì dùng lại instance, biến CSS vẫn là --font-ih-body (không phải --font-adm-body) — admin.css đã cập nhật theo.
export { bodyFont } from '@/app/(apps)/ielts/fonts'
