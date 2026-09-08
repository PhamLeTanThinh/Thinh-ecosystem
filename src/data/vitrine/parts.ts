import type { Part } from '@/lib/vitrine/types'

// `anchor` là toạ độ chuẩn hoá [0,1] theo bounding box của model (xem Part trong
// types.ts) — đặt tạm theo trực giác "trên/dưới/trái/phải", cần chỉnh lại bằng mắt
// (kéo thử trong Scene3DCanvas) sau khi có file .glb thật thay cho placeholder.
export const parts: Part[] = [
  // Phòng khách — sofa
  { id: 'part-sofa-backrest', sceneId: 'scene-phong-khach', name: 'backrest', anchor: [0.5, 0.9, 0.15] },
  { id: 'part-sofa-armrest', sceneId: 'scene-phong-khach', name: 'armrest', anchor: [0.08, 0.55, 0.6] },
  { id: 'part-sofa-cushion', sceneId: 'scene-phong-khach', name: 'cushion', anchor: [0.55, 0.4, 0.75] },
  { id: 'part-sofa-leg', sceneId: 'scene-phong-khach', name: 'leg', anchor: [0.15, 0.04, 0.85] },
  { id: 'part-sofa-object', sceneId: 'scene-phong-khach', name: 'sofa', anchor: [0.9, 0.85, 0.2] },

  // Phòng ngủ — giường
  { id: 'part-bed-mattress', sceneId: 'scene-phong-ngu', name: 'mattress', anchor: [0.55, 0.35, 0.55] },
  { id: 'part-bed-pillow', sceneId: 'scene-phong-ngu', name: 'pillow', anchor: [0.25, 0.55, 0.15] },
  { id: 'part-bed-headboard', sceneId: 'scene-phong-ngu', name: 'headboard', anchor: [0.5, 0.85, 0.03] },
  { id: 'part-bed-blanket', sceneId: 'scene-phong-ngu', name: 'blanket', anchor: [0.5, 0.4, 0.75] },
  { id: 'part-bed-lamp', sceneId: 'scene-phong-ngu', name: 'lamp', anchor: [0.92, 0.6, 0.1] },

  // Phòng tắm — bồn rửa
  { id: 'part-bath-basin', sceneId: 'scene-phong-tam', name: 'basin', anchor: [0.55, 0.45, 0.6] },
  { id: 'part-bath-faucet', sceneId: 'scene-phong-tam', name: 'faucet', anchor: [0.5, 0.65, 0.35] },
  { id: 'part-bath-mirror', sceneId: 'scene-phong-tam', name: 'mirror', anchor: [0.55, 0.9, 0.05] },
  { id: 'part-bath-towel', sceneId: 'scene-phong-tam', name: 'towel', anchor: [0.08, 0.4, 0.7] },

  // Bếp nấu
  { id: 'part-kitchen-stove', sceneId: 'scene-bep-nau', name: 'stove', anchor: [0.35, 0.55, 0.3] },
  { id: 'part-kitchen-pot', sceneId: 'scene-bep-nau', name: 'pot', anchor: [0.25, 0.65, 0.35] },
  { id: 'part-kitchen-knife', sceneId: 'scene-bep-nau', name: 'knife', anchor: [0.85, 0.5, 0.75] },
  { id: 'part-kitchen-cutting-board', sceneId: 'scene-bep-nau', name: 'cutting-board', anchor: [0.8, 0.45, 0.6] },

  // Vợt cầu lông
  { id: 'part-racket-frame', sceneId: 'scene-vot-cau-long', name: 'racket-frame', anchor: [0.5, 0.85, 0.5] },
  { id: 'part-racket-strings', sceneId: 'scene-vot-cau-long', name: 'racket-strings', anchor: [0.5, 0.7, 0.5] },
  { id: 'part-racket-handle', sceneId: 'scene-vot-cau-long', name: 'racket-handle', anchor: [0.5, 0.1, 0.5] },

  // Quả bóng
  { id: 'part-ball-object', sceneId: 'scene-qua-bong', name: 'ball', anchor: [0.5, 0.5, 0.5] },

  // Giày thể thao
  { id: 'part-shoe-toe', sceneId: 'scene-giay-the-thao', name: 'shoe-toe', anchor: [0.5, 0.4, 0.85] },
  { id: 'part-shoe-sole', sceneId: 'scene-giay-the-thao', name: 'shoe-sole', anchor: [0.5, 0.05, 0.5] },
  { id: 'part-shoe-laces', sceneId: 'scene-giay-the-thao', name: 'shoe-laces', anchor: [0.5, 0.55, 0.6] },

  // Mèo nhà
  { id: 'part-cat-head', sceneId: 'scene-meo-nha', name: 'head', anchor: [0.5, 0.85, 0.75] },
  { id: 'part-cat-ear', sceneId: 'scene-meo-nha', name: 'ear', anchor: [0.6, 0.95, 0.7] },
  { id: 'part-cat-tail', sceneId: 'scene-meo-nha', name: 'tail', anchor: [0.5, 0.55, 0.05] },
  { id: 'part-cat-paw', sceneId: 'scene-meo-nha', name: 'paw', anchor: [0.65, 0.05, 0.7] },
]
