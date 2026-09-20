'use client'

import { useEffect, useRef, useState } from 'react'
import { ShieldedVideo } from '@/components/media/ShieldedVideo'
import './portfolio.css'

// Module-scoped, not sessionStorage: resets on a real page load/refresh (the
// module re-evaluates from scratch) but stays put across client-side
// navigation away from "/" and back — so it plays once per visit, not once
// per SPA route change.
let hasPlayed = false

// The 0→99 crawl is built from bands rather than one flat easing curve, so
// it can match the brief's explicit "fast, then progressively slower" feel:
// each band's `weight` is time-per-point-of-progress, so a bigger weight
// relative to its percent span means that stretch crawls more slowly.
const BANDS: { to: number; weight: number }[] = [
  { to: 30, weight: 1.0 }, // 0  -> 30 : fast
  { to: 70, weight: 1.6 }, // 30 -> 70 : slightly slower
  { to: 90, weight: 1.4 }, // 70 -> 90 : slower
  { to: 99, weight: 1.8 }, // 90 -> 99 : noticeably slower
]
const TOTAL_WEIGHT = BANDS.reduce((sum, band) => sum + band.weight, 0)
const CURVE_MS = 2200 // virtual duration for the 0 -> 99 crawl
const HOLD_MS = 320 // pause at 100% before the exit starts
const EXIT_MS = 1000 // slide-up duration, kept in sync with the CSS transition
const VIDEO_FALLBACK_MS = 4000 // don't block forever if the video never fires loadeddata

function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}

function percentAtElapsed(elapsed: number) {
  let from = 0
  let acc = 0
  for (const band of BANDS) {
    const bandMs = (band.weight / TOTAL_WEIGHT) * CURVE_MS
    if (elapsed <= acc + bandMs) {
      const localT = bandMs === 0 ? 1 : (elapsed - acc) / bandMs
      return from + smoothstep(Math.max(0, Math.min(1, localT))) * (band.to - from)
    }
    acc += bandMs
    from = band.to
  }
  return 99
}

export function Preloader() {
  const [mounted, setMounted] = useState(() => !hasPlayed)
  const [percent, setPercent] = useState(0)
  const [exiting, setExiting] = useState(false)
  // Set by the ShieldedVideo below once its first frame has decoded (the clip is fetched as a blob, see there).
  const videoReadyRef = useRef(false)

  useEffect(() => {
    if (!mounted) return
    hasPlayed = true

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    let raf = 0
    let done = false
    let pageReady = document.readyState === 'complete'
    const start = performance.now()

    const onWindowLoad = () => { pageReady = true }
    window.addEventListener('load', onWindowLoad)

    const videoFallback = window.setTimeout(() => { videoReadyRef.current = true }, VIDEO_FALLBACK_MS)

    function finish() {
      if (done) return
      done = true
      setPercent(100)
      window.setTimeout(() => {
        document.body.style.overflow = previousOverflow
        setExiting(true)
        window.setTimeout(() => setMounted(false), EXIT_MS)
      }, HOLD_MS)
    }

    function tick() {
      const elapsed = performance.now() - start
      const curvePercent = Math.min(99, Math.round(percentAtElapsed(elapsed)))
      setPercent(prev => (curvePercent > prev ? curvePercent : prev))
      if (elapsed >= CURVE_MS && pageReady && videoReadyRef.current) {
        finish()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', onWindowLoad)
      window.clearTimeout(videoFallback)
      document.body.style.overflow = previousOverflow
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className={`preloader${exiting ? ' preloader--exit' : ''}`} aria-hidden="true">
      <div className="preloader-cat">
        <ShieldedVideo className="preloader-video" mediaKey="preloader" onReady={() => { videoReadyRef.current = true }} />
        <div className="preloader-scrim" />
      </div>
      <div className="preloader-counter">
        <span className="preloader-label">Loading</span>
        <span className="preloader-num">{percent}<span className="preloader-pct">%</span></span>
      </div>
    </div>
  )
}
