// Tự chèn tên nốt (Đồ Rê Mi Fa Sol La Si) vào MusicXML dưới dạng <lyric> — cách này để OSMD tự vẽ và
// tự tránh chồng chữ (đúng vị trí, đúng theo hệ thống/khuông nhạc, tự co giãn theo zoom) thay vì tự
// tính toạ độ pixel từng đầu nốt rồi tự vẽ đè lên, vốn dễ vỡ khi cuộn/co giãn màn hình.
const SOLFEGE: Record<string, string> = {
  C: 'Đô',
  D: 'Rê',
  E: 'Mi',
  F: 'Fa',
  G: 'Sol',
  A: 'La',
  B: 'Si',
}

function alterSuffix(alter: number): string {
  if (alter === 1) return '#'
  if (alter === -1) return 'b'
  if (alter === 2) return '𝄪'
  if (alter === -2) return 'bb'
  return ''
}

// Nhận nội dung file .musicxml, trả về Document đã có thêm <lyric> tên nốt cho từng <note> có cao độ
// thật (bỏ qua dấu lặng). Với hợp âm (note có thẻ <chord/>) chỉ ghi tên ở nốt đầu tiên của hợp âm —
// OSMD vẽ lyric ngay dưới khuông theo từng phách, ghi tên cho cả các nốt cùng hợp âm sẽ chồng chữ lên
// nhau ở cùng 1 vị trí, không đọc được.
export function injectSolfegeLyrics(xmlText: string): Document {
  const doc = new DOMParser().parseFromString(xmlText, 'application/xml')
  const notes = Array.from(doc.getElementsByTagName('note'))

  for (const note of notes) {
    if (note.getElementsByTagName('rest').length > 0) continue
    if (note.getElementsByTagName('chord').length > 0) continue

    const pitchEl = note.getElementsByTagName('pitch')[0]
    if (!pitchEl) continue
    const step = pitchEl.getElementsByTagName('step')[0]?.textContent
    if (!step || !SOLFEGE[step]) continue
    const alterText = pitchEl.getElementsByTagName('alter')[0]?.textContent
    const alter = alterText ? Number(alterText) : 0

    const lyric = doc.createElement('lyric')
    const syllabic = doc.createElement('syllabic')
    syllabic.textContent = 'single'
    const text = doc.createElement('text')
    text.textContent = SOLFEGE[step] + alterSuffix(alter)
    lyric.appendChild(syllabic)
    lyric.appendChild(text)
    note.appendChild(lyric) // <lyric> đứng cuối cùng trong thứ tự phần tử con hợp lệ của <note>
  }

  return doc
}
