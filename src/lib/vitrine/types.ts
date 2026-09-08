export type LanguageCode = 'vi' | 'en' | 'ja' | 'ko'

export type AccentColor = 'teal' | 'brass' | 'plum'

export type Vec3 = [number, number, number]

export interface SceneModel {
  // Đường dẫn public tới file .glb, ví dụ '/models/vitrine/phong-khach.glb'.
  // Load bằng GLTFLoader, tự động center + scale theo bounding box lúc runtime.
  url: string
  cameraDistance: number
}

export interface Topic {
  id: string
  slug: string
  name: string
  description: string
  accent: AccentColor
}

export interface Scene {
  id: string
  topicId: string
  slug: string
  name: string
  description: string
  model: SceneModel
}

export interface Part {
  id: string
  sceneId: string
  name: string
  // Neo hotspot theo toạ độ CHUẨN HOÁ [0,1] tương đối với bounding box của model
  // (0,0,0) = góc box.min, (1,1,1) = góc box.max — không phải toạ độ world tuyệt đối.
  // Nhờ vậy hotspot không phụ thuộc vào đơn vị/scale gốc của file .glb, cần hiệu
  // chỉnh lại bằng mắt sau khi có model thật.
  anchor: Vec3
}

export interface Translation {
  id: string
  partId: string
  languageCode: LanguageCode
  word: string
}
