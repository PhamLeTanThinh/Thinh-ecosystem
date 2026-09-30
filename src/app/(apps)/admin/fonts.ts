// Font riêng của /admin — chỉ 1 font trung tính (Inter) cho toàn trang, không dùng font chữ viết tay của IELTS
// nữa (trang quản trị cần đọc nhanh, chuyên nghiệp hơn là dễ thương). Popup xác nhận (AdminDialog) vẫn giữ
// nguyên mèo Diên, không liên quan tới font này.
//
// Tái dùng đúng instance Inter đã tạo ở ielts/fonts.ts (cùng subsets + weight) thay vì gọi Inter() lần nữa ở
// đây: next/font/google khuyến cáo chỉ gọi 1 lần cho mỗi cấu hình font rồi import lại (xem "Using a font
// definitions file" trong docs next/font) — gọi 2 lần với tham số giống hệt nhau (chỉ khác `variable`) khiến
// Turbopack (Next 16.2.5) crash lúc build với lỗi nội bộ "next/font/google queries have exactly one entry".
// Vì dùng lại instance, biến CSS vẫn là --font-ih-body (không phải --font-adm-body) — admin.css đã cập nhật theo.
export { bodyFont } from '@/app/(apps)/ielts/fonts'
