import type { Metadata } from 'next'
import { Caveat, Cormorant_Garamond, DM_Sans, DM_Mono, TikTok_Sans } from 'next/font/google'
import './globals.css'

// Heavy display sans for the portfolio's About → Contact headings (the same
// face haoqi.design uses). It has no italic, so the accent words in those
// headings are colored instead of slanted.
const tiktok = TikTok_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-tiktok',
  display: 'swap',
  // TikTok Sans isn't in next/font's font-metrics table, so it can't build a size-adjusted fallback
  // font and would log "Failed to find font override values" on every build/dev start.
  adjustFontFallback: false,
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

// Handwritten face for the portfolio's Mindset quote. Not preloaded so the
// other apps sharing this root layout don't fetch it up front.
const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-caveat',
  display: 'swap',
  preload: false,
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Thinh Pham Le Tan — Senior Frontend Engineer',
  description: 'Portfolio & apps ecosystem. React · TypeScript · Java · AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable} ${tiktok.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  )
}
