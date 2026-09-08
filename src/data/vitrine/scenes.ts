import type { Scene } from '@/lib/vitrine/types'

// Model 3D thật (.glb, xuất từ Meshy) — thả file vào public/models/vitrine/<slug>.glb
// đúng tên bên dưới là chạy được ngay, không cần sửa code. GLTFLoader tự động
// center + scale theo bounding box của từng file (xem Scene3DCanvas).
export const scenes: Scene[] = [
  {
    id: 'scene-phong-khach',
    topicId: 'topic-nha-o',
    slug: 'phong-khach',
    name: 'Phòng khách',
    description: 'Ghế sofa và các bộ phận của nó.',
    model: { url: '/models/vitrine/phong-khach.glb', cameraDistance: 6 },
  },
  {
    id: 'scene-phong-ngu',
    topicId: 'topic-nha-o',
    slug: 'phong-ngu',
    name: 'Phòng ngủ',
    description: 'Giường ngủ và các vật dụng đi kèm.',
    model: { url: '/models/vitrine/phong-ngu.glb', cameraDistance: 7.5 },
  },
  {
    id: 'scene-phong-tam',
    topicId: 'topic-nha-o',
    slug: 'phong-tam',
    name: 'Phòng tắm',
    description: 'Bồn rửa, gương và vật dụng vệ sinh.',
    model: { url: '/models/vitrine/phong-tam.glb', cameraDistance: 6.5 },
  },
  {
    id: 'scene-bep-nau',
    topicId: 'topic-nha-bep',
    slug: 'bep-nau',
    name: 'Bếp nấu',
    description: 'Bếp, nồi, dao và thớt trên quầy bếp.',
    model: { url: '/models/vitrine/bep-nau.glb', cameraDistance: 6.5 },
  },
  // Mỗi scene = 1 object riêng (khớp cách Meshy text-to-3D sinh model: 1 prompt ra 1
  // vật thể) — "Góc thể thao" trước đây gộp 3 vật không liên quan vào 1 model là sai,
  // đã tách lại cho khớp thực tế khi thay bằng .glb thật.
  {
    id: 'scene-vot-cau-long',
    topicId: 'topic-the-thao',
    slug: 'vot-cau-long',
    name: 'Vợt cầu lông',
    description: 'Khung, lưới và cán vợt cầu lông.',
    model: { url: '/models/vitrine/vot-cau-long.glb', cameraDistance: 5 },
  },
  {
    id: 'scene-qua-bong',
    topicId: 'topic-the-thao',
    slug: 'qua-bong',
    name: 'Quả bóng',
    description: 'Quả bóng thể thao.',
    model: { url: '/models/vitrine/qua-bong.glb', cameraDistance: 4 },
  },
  {
    id: 'scene-giay-the-thao',
    topicId: 'topic-the-thao',
    slug: 'giay-the-thao',
    name: 'Giày thể thao',
    description: 'Mũi giày, đế giày và dây giày.',
    model: { url: '/models/vitrine/giay-the-thao.glb', cameraDistance: 5 },
  },
  {
    id: 'scene-meo-nha',
    topicId: 'topic-dong-vat',
    slug: 'meo-nha',
    name: 'Mèo nhà',
    description: 'Các bộ phận trên cơ thể mèo.',
    model: { url: '/models/vitrine/meo-nha.glb', cameraDistance: 6 },
  },
]
