// Tranh phong cảnh hoàng hôn ở hero trang /trips — gói cả 4 kiểu đi trong 1 cảnh: máy bay trên trời (Bay), đồi thông
// + lều (Trekking), đường nhựa có xe (Phượt xe), biển có thuyền (Biển). Chỉ trang trí; màu nằm trong SVG.
export function HeroScene() {
  return (
    <svg
      className="tp-hero-scene pointer-events-none absolute inset-y-0 right-0 h-full w-full md:w-[72%]"
      viewBox="0 0 900 300"
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
    >
      {/* Mặt trời + quầng sáng */}
      <circle cx="660" cy="118" r="92" fill="#ffd2a6" opacity=".45" />
      <circle cx="660" cy="118" r="50" fill="#ffb987" />

      {/* Mây */}
      <g fill="#fff" opacity=".75">
        <rect x="430" y="58" width="96" height="20" rx="10" />
        <rect x="452" y="46" width="48" height="22" rx="11" />
        <rect x="760" y="80" width="80" height="16" rx="8" />
      </g>

      {/* Máy bay kéo vệt khói */}
      <path d="M150 128 C 250 80, 330 70, 404 72" fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="7 8" opacity=".9" />
      <g className="tp-scene-plane">
        <text x="404" y="84" fontSize="30" transform="rotate(8 420 74)">
          ✈️
        </text>
      </g>

      {/* Núi xa → đồi gần */}
      <path d="M0 214 L110 136 L200 192 L310 104 L420 188 L520 128 L640 206 L740 150 L900 200 V300 H0Z" fill="#cbd9c6" />
      <path d="M0 240 C 140 196, 250 232, 370 210 S 560 180, 690 220 S 850 236, 900 228 V300 H0Z" fill="#8fb58c" />

      {/* Rừng thông + lều trại */}
      <g fill="#4f7d5a">
        <path d="M60 232l13-28 13 28z" />
        <path d="M80 236l11-24 11 24z" />
        <path d="M232 222l13-28 13 28z" />
        <path d="M252 226l10-22 10 22z" />
        <path d="M470 210l12-26 12 26z" />
      </g>
      <text x="348" y="214" fontSize="24">
        ⛺
      </text>

      {/* Biển + thuyền */}
      <path d="M560 252 C 660 240, 780 246, 900 238 V300 H560Z" fill="#6cc3cf" />
      <g fill="none" stroke="#fff" strokeWidth="2" opacity=".7">
        <path d="M600 266q10-6 20 0t20 0" />
        <path d="M720 258q10-6 20 0t20 0" />
        <path d="M820 274q10-6 20 0t20 0" />
      </g>
      <g className="tp-scene-boat">
        <text x="770" y="254" fontSize="28">
          ⛵
        </text>
      </g>

      {/* Bãi cát + đường nhựa uốn lượn có xe */}
      <path d="M470 300 C 560 268, 700 286, 900 276 V300Z" fill="#f2d6a2" />
      <path d="M90 300 C 170 270, 250 260, 330 252 S 470 238, 540 232" fill="none" stroke="#3b4049" strokeWidth="16" strokeLinecap="round" />
      <path d="M90 300 C 170 270, 250 260, 330 252 S 470 238, 540 232" fill="none" stroke="#ffd65a" strokeWidth="2" strokeDasharray="10 10" />
      {/* Emoji 🚗 quay đầu sang trái → lật ngang cho chạy về phía biển */}
      <text x="-296" y="252" fontSize="26" transform="scale(-1 1)">
        🚗
      </text>
    </svg>
  )
}
