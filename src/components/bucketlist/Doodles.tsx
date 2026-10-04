// Hình vẽ nguệch ngoạc trang trí tờ bucket list — nét sáp màu (filter #bl-crayon khai báo trong CrayonFilter).
// Thuần trang trí, ẩn với trình đọc màn hình. Doodles = các hình nổi ở góc/hai bên tiêu đề; DoodleStrip = dải
// hình cuối tờ giấy (nằm trong luồng, tự xuống dòng trên màn hình hẹp nên không đè lên chữ).

export function CrayonFilter() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <filter id="bl-crayon" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}

// Làm tròn toạ độ tính bằng sin/cos — số lẻ cuối có thể khác giữa server và trình duyệt, gây lệch hydration
const r2 = (n: number) => Math.round(n * 100) / 100

const stroke = { fill: 'none', stroke: '#222', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const fill = (color: string) => ({ ...stroke, style: { fill: color } })

function Laptop({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 120 80">
      <rect x="16" y="6" width="88" height="58" rx="5" {...fill('#7fb2ff')} />
      <rect x="23" y="13" width="74" height="44" rx="2" {...fill('#e8f3ff')} />
      <path d="M30 23 H56 M30 31 H70 M38 39 H64 M30 47 H50" {...stroke} stroke="#9b5de5" strokeWidth={2.6} />
      <path d="M4 66 H116 L108 76 H12 Z" {...fill('#d4d4d8')} />
    </svg>
  )
}

function Airplane({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 140 70">
      <path d="M66 30 L56 10 H67 L86 30 Z" {...fill('#a9d4ff')} />
      <path d="M18 32 L10 10 H22 L38 30 Z" {...fill('#e63946')} />
      <path d="M10 38 C10 31 20 29 40 29 H112 C126 29 134 33 134 38 C134 43 126 46 112 46 H40 C20 46 10 44 10 38 Z" {...fill('#ffffff')} />
      <path d="M118 33 C124 33 128 35 129 38 H118 Z" {...fill('#3a86ff')} />
      {[50, 60, 70, 80, 90, 100].map((x) => (
        <circle key={x} cx={x} cy="36" r="2.4" {...fill('#3a86ff')} strokeWidth={1.2} />
      ))}
      <path d="M58 40 L42 64 H57 L84 40 Z" {...fill('#3a86ff')} />
    </svg>
  )
}

export function Doodles() {
  return (
    <div className="bl-doodles" aria-hidden="true">
      {/* mặt trời */}
      <svg className="bl-doodle bl-doodle--sun" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="16" {...fill('#ffd23f')} />
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2
          return (
            <line
              key={i}
              x1={r2(40 + Math.cos(a) * 23)}
              y1={r2(40 + Math.sin(a) * 23)}
              x2={r2(40 + Math.cos(a) * 33)}
              y2={r2(40 + Math.sin(a) * 33)}
              {...stroke}
              stroke="#f59e0b"
            />
          )
        })}
      </svg>

      {/* bóng bay */}
      <svg className="bl-doodle bl-doodle--balloons" viewBox="0 0 90 120">
        <path d="M30 70 C28 85 38 95 34 118" {...stroke} strokeWidth={1.4} />
        <path d="M60 64 C62 82 52 96 56 118" {...stroke} strokeWidth={1.4} />
        <ellipse cx="30" cy="42" rx="20" ry="26" {...fill('#ff8fb1')} />
        <ellipse cx="60" cy="38" rx="19" ry="25" {...fill('#ffb347')} />
      </svg>

      {/* hai bên tiêu đề — chỉ hiện khi màn hình đủ rộng (hẹp hơn thì chuyển xuống dải cuối trang) */}
      <Laptop className="bl-doodle bl-doodle--laptop" />
      <Airplane className="bl-doodle bl-doodle--airplane" />

      {/* bông hoa */}
      <svg className="bl-doodle bl-doodle--flower" viewBox="0 0 70 100">
        <path d="M35 50 C34 70 38 82 35 98" {...stroke} stroke="#22a45d" />
        <path d="M36 78 C46 70 54 72 58 66 C48 64 40 68 36 78 Z" {...fill('#86e0a5')} stroke="#22a45d" />
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2
          return <circle key={i} cx={r2(35 + Math.cos(a) * 13)} cy={r2(30 + Math.sin(a) * 13)} r="9" {...fill('#c084fc')} />
        })}
        <circle cx="35" cy="30" r="8" {...fill('#ffd23f')} />
      </svg>

      {/* ngôi sao */}
      <svg className="bl-doodle bl-doodle--star" viewBox="0 0 70 70">
        <path d="M35 5 L43 26 L66 27 L48 41 L55 64 L35 51 L15 64 L22 41 L4 27 L27 26 Z" {...fill('#ffe066')} />
      </svg>
    </div>
  )
}

export function DoodleStrip() {
  return (
    <div className="bl-doodle-strip" aria-hidden="true">
      <Laptop className="bl-strip-narrow" />

      {/* ô tô */}
      <svg viewBox="0 0 130 72">
        <path
          d="M8 52 V40 C8 35 12 33 16 33 L30 31 L44 15 C46 13 48 12 52 12 H86 C90 12 92 13 95 16 L108 31 L118 33 C122 34 124 37 124 41 V52 Z"
          {...fill('#ff5d73')}
        />
        <path d="M50 17 H68 V31 H37 Z" {...fill('#cfe8ff')} />
        <path d="M73 17 H88 L100 31 H73 Z" {...fill('#cfe8ff')} />
        <path d="M112 38 H120" {...stroke} stroke="#ffd23f" strokeWidth={4} />
        <circle cx="34" cy="54" r="11" {...fill('#3a3a3a')} />
        <circle cx="34" cy="54" r="4" {...fill('#e5e5e5')} />
        <circle cx="98" cy="54" r="11" {...fill('#3a3a3a')} />
        <circle cx="98" cy="54" r="4" {...fill('#e5e5e5')} />
      </svg>

      {/* balo */}
      <svg viewBox="0 0 90 100">
        <path d="M34 18 C34 6 56 6 56 18" {...stroke} strokeWidth={3} />
        <path d="M16 30 C16 20 24 16 45 16 C66 16 74 20 74 30 V88 C74 93 70 96 65 96 H25 C20 96 16 93 16 88 Z" {...fill('#7ac74f')} />
        <path d="M16 36 C30 46 60 46 74 36" {...stroke} />
        <rect x="27" y="56" width="36" height="28" rx="6" {...fill('#b5e48c')} />
        <path d="M27 64 H63" {...stroke} />
        <rect x="40" y="38" width="10" height="9" rx="2" {...fill('#ffd23f')} />
      </svg>

      {/* piano */}
      <svg viewBox="0 0 140 76">
        <rect x="4" y="8" width="132" height="62" rx="6" {...fill('#9b5de5')} />
        <rect x="10" y="22" width="120" height="42" rx="2" {...fill('#ffffff')} />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={r2(10 + (i + 1) * 12)} y1="22" x2={r2(10 + (i + 1) * 12)} y2="64" {...stroke} strokeWidth={1.4} />
        ))}
        {[0, 1, 3, 4, 5, 7, 8].map((k) => (
          <rect key={k} x={r2(10 + (k + 1) * 12 - 3.5)} y="22" width="7" height="24" {...fill('#222')} strokeWidth={1} />
        ))}
      </svg>

      {/* máy ảnh */}
      <svg viewBox="0 0 100 76">
        <path d="M30 22 L36 10 H60 L66 22" {...fill('#ffb347')} />
        <rect x="6" y="20" width="88" height="50" rx="8" {...fill('#ffb347')} />
        <circle cx="50" cy="45" r="17" {...fill('#444')} />
        <circle cx="50" cy="45" r="9" {...fill('#8ec5ff')} />
        <rect x="74" y="27" width="12" height="7" rx="1" {...fill('#ffffff')} />
      </svg>

      {/* xe đạp */}
      <svg viewBox="0 0 130 80">
        <circle cx="28" cy="54" r="21" {...stroke} strokeWidth={3} />
        <circle cx="102" cy="54" r="21" {...stroke} strokeWidth={3} />
        <path d="M28 54 L50 26 H84 L102 54 M50 26 L66 54 L84 26 M28 54 H66" {...stroke} stroke="#3a86ff" strokeWidth={3.4} />
        <path d="M43 19 H58" {...stroke} strokeWidth={4} />
        <path d="M50 26 L48 19" {...stroke} />
        <path d="M84 26 L80 13 H92" {...stroke} strokeWidth={3} />
      </svg>

      <Airplane className="bl-strip-narrow" />

      {/* quả địa cầu */}
      <svg viewBox="0 0 80 100">
        <path d="M14 22 C4 42 12 68 40 74" {...stroke} strokeWidth={3} />
        <circle cx="42" cy="40" r="28" {...fill('#8ec5ff')} />
        <path d="M26 24 C32 17 42 20 43 28 C44 35 35 37 33 44 C31 50 23 47 21 40 C19 33 22 28 26 24 Z" {...fill('#7ac74f')} />
        <path d="M50 50 C55 44 65 46 66 54 C64 61 56 64 51 60 C47 57 47 54 50 50 Z" {...fill('#7ac74f')} />
        <path d="M40 74 V88 M26 92 H54" {...stroke} strokeWidth={3} />
      </svg>

      {/* guitar */}
      <svg viewBox="0 0 60 130">
        <rect x="24" y="2" width="12" height="13" rx="2" {...fill('#6b4423')} />
        <rect x="27" y="12" width="6" height="62" {...fill('#a0522d')} />
        <path
          d="M30 128 C12 128 6 116 10 104 C13 96 18 94 16 86 C14 76 20 68 30 68 C40 68 46 76 44 86 C42 94 47 96 50 104 C54 116 48 128 30 128 Z"
          {...fill('#ffa53b')}
        />
        <circle cx="30" cy="100" r="7" {...fill('#6b4423')} />
        <path d="M22 116 H38" {...stroke} strokeWidth={3} />
      </svg>

      {/* máy bay giấy */}
      <svg viewBox="0 0 130 70">
        <path d="M4 60 C30 40 40 66 62 46" {...stroke} strokeDasharray="4 6" stroke="#3b82f6" />
        <path d="M70 40 L124 10 L96 58 L88 42 Z" {...fill('#cfe8ff')} />
        <path d="M88 42 L124 10" {...stroke} />
      </svg>

      {/* trái tim */}
      <svg viewBox="0 0 80 72">
        <path d="M40 66 C10 46 4 30 10 18 C17 5 34 7 40 20 C46 7 63 5 70 18 C76 30 70 46 40 66 Z" {...fill('#ff5d73')} />
      </svg>
    </div>
  )
}
