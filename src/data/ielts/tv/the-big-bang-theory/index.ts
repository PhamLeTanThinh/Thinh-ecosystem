import type { TvShow } from '@/lib/ielts/tv'
import { S01E08 } from './s01e08'

// The Big Bang Theory — mỗi tập đã học là 1 file sXXeYY.ts trong thư mục này, thêm tập mới thì import và đưa vào
// `episodes` (thứ tự không quan trọng, trang tự sắp theo mùa / tập).
export const THE_BIG_BANG_THEORY: TvShow = {
  id: 'the-big-bang-theory',
  title: 'The Big Bang Theory',
  poster: '/ielts/tv/the-big-bang-theory.webp',
  description:
    'Sitcom về hai nhà vật lý thiên tài nhưng vụng về giao tiếp, Leonard và Sheldon, cô hàng xóm Penny và hội bạn "mọt sách". Nhiều tiếng Anh giao tiếp đời thường, thành ngữ, câu đùa chơi chữ — xen lẫn từ vựng khoa học.',
  episodes: [S01E08],
}
