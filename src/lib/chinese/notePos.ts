// Ghi chú cũ của thẻ Chinese mở đầu bằng từ loại viết tắt ("đt. · Hán Việt: …") — từ loại đã có nhãn riêng (cột pos)
// nên khi hiển thị bỏ phần đó đi.
export const NOTE_POS_PREFIX = /^(?:(?:dt|đt|tt|phó|liên|lượng|đại|giới|trợ|cụm|đtnn|số|thán|trạng)\.(?:, )?)+(?: · |$)/

export const stripNotePos = (note: string) => note.replace(NOTE_POS_PREFIX, '')
