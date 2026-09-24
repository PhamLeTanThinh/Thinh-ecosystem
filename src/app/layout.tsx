import type { Metadata } from 'next'
import { Caveat, Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

// Heavy display sans for the portfolio's About → Contact headings (the same
// face haoqi.design uses). It has no italic, so the accent words in those
// headings are colored instead of slanted.
// Self-hosted (src/fonts/tiktok-sans): TikTok Sans isn't in next/font/google's font-metrics table, so the
// Google version logged "Failed to find font override values" on every build/dev start.
const tiktok = localFont({
  // next/font/local needs a static array literal (no .map) to analyse the files at build time.
  src: [
    { path: '../fonts/tiktok-sans/TikTokSans-400.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/tiktok-sans/TikTokSans-500.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/tiktok-sans/TikTokSans-600.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/tiktok-sans/TikTokSans-700.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/tiktok-sans/TikTokSans-800.ttf', weight: '800', style: 'normal' },
  ],
  variable: '--font-tiktok',
  display: 'swap',
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
