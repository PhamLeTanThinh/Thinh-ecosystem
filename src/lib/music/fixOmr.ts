// Sửa vài lỗi hay gặp của MusicXML nhận diện từ PDF bằng OMR (Audiveris) trước khi đưa cho OSMD.

function staffOf(el: Element): string {
  return el.getElementsByTagName('staff')[0]?.textContent?.trim() || '1'
}

// Audiveris hay nhận ra ký hiệu "8va" nhưng KHÔNG nhận ra dấu kết thúc của nó (octave-shift type="stop"),
// nhất là kiểu ngoặc ngắn chỉ phủ 1 nốt (vd. tay trái bài Flower Dance). Ngoặc không đóng thì OSMD vẽ
// đường gạch "8va" kéo tới tận cuối bài, mỗi ngoặc thêm 1 tầng — chồng nhiều tầng đẩy khuông Fa ra rất xa
// khuông Sol, khung xem không chứa nổi cả 2 tay. Ở đây đóng mỗi ngoặc bị bỏ dở ngay sau nốt (hoặc hợp âm)
// đầu tiên nó phủ — đúng kiểu ngoặc ngắn trong bản gốc. Chỉ đổi cách vẽ ngoặc, không đổi cao độ nốt.
export function closeDanglingOctaveShifts(doc: Document): void {
  for (const part of Array.from(doc.getElementsByTagName('part'))) {
    // Duyệt mọi direction/note theo đúng thứ tự trong bài (measure → phần tử con).
    const events = Array.from(part.getElementsByTagName('measure')).flatMap((m) =>
      Array.from(m.children).filter((c) => c.tagName === 'direction' || c.tagName === 'note'),
    )

    // key "staff:number" → ngoặc đang mở + nốt đầu tiên nó phủ (nếu đã gặp)
    const open = new Map<string, { firstNote: Element | null }>()
    const dangling: { staff: string; number: string; firstNote: Element }[] = []

    const closeIfDangling = (key: string) => {
      const entry = open.get(key)
      if (entry?.firstNote) {
        const [staff, number] = key.split(':')
        dangling.push({ staff, number, firstNote: entry.firstNote })
      }
      open.delete(key)
    }

    for (const el of events) {
      if (el.tagName === 'direction') {
        const shift = el.getElementsByTagName('octave-shift')[0]
        if (!shift) continue
        const key = `${staffOf(el)}:${shift.getAttribute('number') || '1'}`
        if (shift.getAttribute('type') === 'stop') {
          open.delete(key)
        } else {
          closeIfDangling(key) // mở ngoặc mới cùng số khi ngoặc cũ chưa đóng → ngoặc cũ bị bỏ dở
          open.set(key, { firstNote: null })
        }
      } else {
        if (el.getElementsByTagName('chord').length > 0) continue
        const staff = staffOf(el)
        for (const [key, entry] of open) {
          if (!entry.firstNote && key.startsWith(`${staff}:`)) entry.firstNote = el
        }
      }
    }
    for (const key of [...open.keys()]) closeIfDangling(key)

    for (const { staff, number, firstNote } of dangling) {
      // Chèn sau nốt đầu tiên + các nốt <chord/> đi liền sau nó (cùng hợp âm).
      let anchor = firstNote
      while (anchor.nextElementSibling?.tagName === 'note' && anchor.nextElementSibling.getElementsByTagName('chord').length > 0) {
        anchor = anchor.nextElementSibling
      }
      const direction = doc.createElement('direction')
      const directionType = doc.createElement('direction-type')
      const stop = doc.createElement('octave-shift')
      stop.setAttribute('type', 'stop')
      stop.setAttribute('number', number)
      stop.setAttribute('size', '8')
      const staffEl = doc.createElement('staff')
      staffEl.textContent = staff
      directionType.appendChild(stop)
      direction.appendChild(directionType)
      direction.appendChild(staffEl)
      anchor.after(direction)
    }
  }
}
