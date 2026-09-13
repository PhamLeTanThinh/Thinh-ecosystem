'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import './portfolio.css'

// Section ids in scroll order — used both for the nav's active-dot
// detection and as the anchor markers spaced through .story-pin.
const STORY_SECTIONS = ['about', 'projects', 'skills', 'mindset', 'contact']

export default function PortfolioPage() {
  useEffect(() => {
    /* ── GRAIN ── */
    const canvas = document.getElementById('grain') as HTMLCanvasElement
    const ctx = canvas?.getContext('2d')
    let W = 0, H = 0, rafId: number

    // Full resolution, single-pixel noise — matches the original fine-grain
    // look (a downscaled buffer stretched back up via CSS gets smoothed by
    // the browser into a soft blur, losing the actual "grain" texture).
    // Regeneration is still throttled to every 3rd frame below — that cuts
    // the per-frame Math.random() loop's cost by two-thirds without
    // changing what any single frame looks like, since grain flicker reads
    // fine well under 60fps.
    let grainTick = 0
    function resize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    function drawGrain() {
      if (!ctx) return
      if (++grainTick % 3 === 0) {
        const img = ctx.createImageData(W, H)
        const buf = new Uint32Array(img.data.buffer)
        for (let i = 0; i < buf.length; i++) {
          const n = (Math.random() * 255) | 0
          buf[i] = (255 << 24) | (n << 16) | (n << 8) | n
        }
        ctx.putImageData(img, 0, 0)
      }
      rafId = requestAnimationFrame(drawGrain)
    }
    if (canvas) {
      resize()
      window.addEventListener('resize', resize, { passive: true })
      drawGrain()
      let op = 0
      const fadeIn = () => {
        op = Math.min(op + 0.01, 0.14)
        canvas.style.opacity = String(op)
        if (op < 0.14) requestAnimationFrame(fadeIn)
      }
      fadeIn()
    }

    /* ── CURSOR ── */
    const dot = document.getElementById('cd')
    const ring = document.getElementById('cr')
    let mx = 0, my = 0, rx = 0, ry = 0
    const onMouseMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    document.querySelectorAll<HTMLElement>('a,button,.astat,.mv-chip,.pchip,.cbadge').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hl'))
      el.addEventListener('mouseleave', () => document.body.classList.remove('hl'))
    })

    let curRaf: number
    function cursorLoop() {
      rx += (mx - rx) * 0.11
      ry += (my - ry) * 0.11
      if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px' }
      if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px' }
      curRaf = requestAnimationFrame(cursorLoop)
    }
    cursorLoop()

    /* ── NAV: logo stays hidden at the very top, fading in over the first
       stretch of scroll ── */
    const logo = document.getElementById('logo')
    const onNavScroll = () => {
      if (logo) logo.style.opacity = `${Math.min(1, window.scrollY / 300)}`
    }
    window.addEventListener('scroll', onNavScroll, { passive: true })
    onNavScroll()

    /* ── SCROLL REVEAL ── */
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target) }
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.rv,.rl').forEach(el => io.observe(el))

    /* ── STAT TILT ── */
    document.querySelectorAll<HTMLElement>('.astat').forEach(el => {
      el.addEventListener('mousemove', (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        el.style.transform = `perspective(500px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.02)`
      })
      el.addEventListener('mouseleave', () => { el.style.transform = '' })
    })

    return () => {
      cancelAnimationFrame(rafId)
      cancelAnimationFrame(curRaf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onNavScroll)
      io.disconnect()
    }
  }, [])

  /* ── HERO → ABOUT PINNED REVEAL ──
     Modeled on forgeautomotive.co.uk's scroll-scrubbed image reveal: while
     .hero-pin holds the page (real scroll, .hero pinned via position:sticky
     — nothing is hijacked, this is the same trick GSAP's ScrollTrigger pin
     uses under the hood), the small blurred focus window grows to fill the
     screen and sharpens into focus (phase A), then settles down into the
     exact spot/size/crop of About's photo while an About-content preview
     blurs into focus beside it (phase B). The real About content (always
     visible, no .rv delay) is revealed the instant the pin releases. */
  useEffect(() => {
    const pin = document.getElementById('heroPin')
    const visual = document.getElementById('heroVisual')
    const heroBg = document.querySelector<HTMLElement>('.hero-bg')
    const heroScrim = document.querySelector<HTMLElement>('.hero-scrim')
    const focus = document.getElementById('heroFocus')
    const focusImg = document.getElementById('heroFocusImg')
    const heroContent = document.querySelector<HTMLElement>('.hero-content')
    const reveal = document.getElementById('heroAboutReveal')
    const aboutPhoto = document.querySelector<HTMLElement>('.story-photo-col')
    const aboutText = document.getElementById('aboutTextTarget')
    const story = document.querySelector<HTMLElement>('.story')
    if (!pin || !visual || !heroBg || !heroScrim || !focus || !focusImg || !heroContent || !reveal || !aboutPhoto || !aboutText || !story) return

    // Must mirror .hero-focus's default CSS rect (left/top/width/height).
    const START = { leftPct: 0.47, topPct: 0.11, widthPct: 0.33, heightPct: 0.74 }
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    let iw = 0, ih = 0
    let raf = 0
    let enabled = window.innerWidth > 860
    // Once fully settled at either end, every style below is already at its
    // resting value — skip the recompute so scrolling through the rest of
    // the page (which is most of it, and fires this same listener) doesn't
    // keep rewriting a dozen inline styles/filters every frame for nothing.
    // Without this, the expensive blurred background layer can't keep its
    // paint in sync with fast scrolling and visibly ghosts/stutters.
    let settled: 'top' | 'bottom' | null = null
    let m = {
      pinTop: 0, releaseY: 0, bgOx: 0, bgOy: 0, rw: 0, rh: 0,
      targetLeft: 0, targetTop: 0, targetW: 0, targetH: 0, targetRw: 0, targetRh: 0, targetOx: 0, targetOy: 0,
      revealLeft: 0, revealTop: 0, revealW: 0,
    }

    const docTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY

    function measure() {
      if (!iw || !ih) return
      const vw = window.innerWidth, vh = window.innerHeight
      const pinTop = docTop(pin!)
      const releaseY = pinTop + pin!.offsetHeight - vh

      const scale = Math.max(vw / iw, vh / ih)
      const rw = iw * scale, rh = ih * scale
      const bgOx = (vw - rw) / 2
      // Ảnh gốc có nhiều khoảng trắng phía trên đầu — dịch ảnh lên một chút để
      // khung nét lộ ra phần vai/thân thay vì dừng ngay dưới mắt.
      const bgOy = -(rh - vh) * 0.24

      const aRect = aboutPhoto!.getBoundingClientRect()
      const tRect = aboutText!.getBoundingClientRect()
      const targetW = Math.min(aRect.width, vw * 0.32)
      const targetH = Math.min(aRect.height, vh * 0.6)
      const targetLeft = vw * 0.05
      const targetTop = (vh - targetH) / 2
      const scale2 = Math.max(targetW / iw, targetH / ih)
      const targetRw = iw * scale2, targetRh = ih * scale2
      const targetOx = (targetW - targetRw) / 2
      const targetOy = -(targetRh - targetH) * 0.15
      // Use the real About text column's own measured box untouched (no
      // artificial width/height cap) so the clone wraps exactly like the
      // real thing — it previously clamped to vw*0.42 while the real
      // column (.story-text, the grid's 1fr track) is ~60%+ of the
      // viewport, so the clone wrapped onto extra lines the real layout
      // never does, then centered on that wrong height, producing a
      // visible mismatch (narrower text, an odd gap above the heading)
      // right at the handoff. Reading tRect.left too — rather than
      // reconstructing it from targetLeft/targetW and an assumed gap —
      // keeps it correct if the grid's own gap ever changes.
      const revealW = tRect.width
      const revealH = tRect.height

      m = {
        pinTop, releaseY, bgOx, bgOy, rw, rh,
        targetLeft, targetTop, targetW, targetH, targetRw, targetRh, targetOx, targetOy,
        revealLeft: tRect.left, revealTop: (vh - revealH) / 2, revealW,
      }
      visual!.style.setProperty('--bg-rw', `${rw}px`)
      visual!.style.setProperty('--bg-rh', `${rh}px`)
      visual!.style.setProperty('--bg-ox', `${bgOx}px`)
      visual!.style.setProperty('--bg-oy', `${bgOy}px`)
    }

    function apply() {
      raf = 0
      if (!enabled || !iw || !ih) return
      const rawProgress = (window.scrollY - m.pinTop) / Math.max(1, m.releaseY - m.pinTop)
      // Settling exactly at rawProgress===1 is fragile: real scroll events
      // aren't perfectly monotonic (trackpad/wheel deceleration can wobble
      // scrollY by a pixel right at the tail of a gesture), so a hard cutoff
      // right at the boundary could flip settled on/off — and with it the
      // reveal-clone/real-content swap below — several times in a row,
      // which reads as the whole About section flickering. Only settle once
      // safely past the small crossfade window (1.02) so it can't retrigger.
      if (rawProgress >= 1.02) {
        if (settled === 'bottom') return
        settled = 'bottom'
      } else if (rawProgress <= 0) {
        if (settled === 'top') return
        settled = 'top'
      } else {
        settled = null
      }
      const vw = window.innerWidth, vh = window.innerHeight
      const progress = Math.min(1, Math.max(0, rawProgress))
      // The clone (photo + text) hands off to the real .story content over
      // this tiny rawProgress 1 → 1.02 window instead of an instant swap —
      // see the reveal/story opacity comments below for why.
      const handoffT = Math.max(0, Math.min(1, (rawProgress - 1) / 0.02))

      const start = { left: vw * START.leftPct, top: vh * START.topPct, width: vw * START.widthPct, height: vh * START.heightPct }
      const full = { left: 0, top: 0, width: vw, height: vh }
      const target = { left: m.targetLeft, top: m.targetTop, width: m.targetW, height: m.targetH }

      let rect
      if (progress <= 0.5) {
        // Phase A — the window grows to fill the screen and sharpens into
        // focus, exactly like forgeautomotive's photo-reveal moment.
        const t = progress / 0.5
        const eased = t * t * (3 - 2 * t)
        rect = {
          left: lerp(start.left, full.left, eased), top: lerp(start.top, full.top, eased),
          width: lerp(start.width, full.width, eased), height: lerp(start.height, full.height, eased),
        }
        // Animating a blur radius is one of the most expensive things a
        // browser can repaint every frame — the whole blurred bitmap gets
        // regenerated each time the radius changes, and that cost scales
        // with the element's area. Clearing it early, while the window is
        // still small, means the rest of the (much larger) grow animation
        // runs at a constant blur(0) — no more per-frame blur recompute —
        // instead of blurring an increasingly large area the whole time,
        // which was the main source of the jitter during this transition.
        const blurT = Math.min(1, t / 0.25)
        const blurEased = blurT * blurT * (3 - 2 * blurT)
        focusImg!.style.filter = `grayscale(6%) contrast(1.05) blur(${lerp(5, 0, blurEased)}px)`
        focus!.style.setProperty('--win-rw', `${m.rw}px`)
        focus!.style.setProperty('--win-rh', `${m.rh}px`)
        focus!.style.setProperty('--win-ox', `${m.bgOx - rect.left}px`)
        focus!.style.setProperty('--win-oy', `${m.bgOy - rect.top}px`)
      } else {
        // Phase B — settles from fullscreen down into About's photo slot.
        const t = (progress - 0.5) / 0.5
        rect = {
          left: lerp(full.left, target.left, t), top: lerp(full.top, target.top, t),
          width: lerp(full.width, target.width, t), height: lerp(full.height, target.height, t),
        }
        focusImg!.style.filter = 'grayscale(6%) contrast(1.05)'
        const winRw = lerp(m.rw, m.targetRw, t)
        const winRh = lerp(m.rh, m.targetRh, t)
        const absOx = lerp(m.bgOx, m.targetLeft + m.targetOx, t)
        const absOy = lerp(m.bgOy, m.targetTop + m.targetOy, t)
        focus!.style.setProperty('--win-rw', `${winRw}px`)
        focus!.style.setProperty('--win-rh', `${winRh}px`)
        focus!.style.setProperty('--win-ox', `${absOx - rect.left}px`)
        focus!.style.setProperty('--win-oy', `${absOy - rect.top}px`)
      }

      focus!.style.left = `${rect.left}px`
      focus!.style.top = `${rect.top}px`
      focus!.style.width = `${rect.width}px`
      focus!.style.height = `${rect.height}px`

      const borderT = Math.max(0, 1 - (progress - 0.55) / 0.4)
      focus!.style.borderColor = `rgba(243,238,228,${0.85 * borderT})`
      focus!.style.boxShadow = `0 30px 80px rgba(0,0,0,${0.5 * borderT})`
      // The window (photo + border) stays fully sharp/visible all the way
      // through settling — it should look its clearest right as it reaches
      // the target slot, not fade away beforehand — and only fades out
      // during the same tiny handoff window as the real .story content
      // fading in below, so the swap is invisible instead of the photo
      // visibly dimming just before the real one would otherwise appear.
      focus!.style.opacity = `${1 - handoffT}`

      heroContent!.style.opacity = `${Math.max(0, 1 - progress / 0.3)}`
      heroContent!.style.filter = `blur(${Math.min(6, progress / 0.3 * 6)}px)`

      // Once the pin releases, .hero (still 100vh, now unstuck) needs a full
      // viewport height of ordinary scroll to clear before About is fully in
      // view — that's normal for any two stacked full-height sections. But
      // left alone, the ambient blurred backdrop (never faded elsewhere)
      // would sit there at full opacity the whole time, reading as if the
      // whole reveal were replaying. Fade it out just before release so that
      // dead zone shows plain dark background instead.
      const bgFade = Math.max(0, 1 - Math.max(0, (progress - 0.85) / 0.15))
      heroBg!.style.opacity = `${bgFade}`
      heroScrim!.style.opacity = `${bgFade}`

      // The About preview blurs into focus once the window has cleared the
      // space it needs (mirrors the reference's heading sharpening in), then
      // hands off to the real .story content over the same tiny handoff
      // window as the photo above (rawProgress 1 to 1.02, ~36px of scroll)
      // rather than an instant single-frame swap — real scroll events
      // aren't perfectly monotonic, so a hard swap right at rawProgress===1
      // could retrigger a few times from sub-pixel wobble and read as the
      // whole section flickering. Because the clone already looks like the
      // real thing, briefly overlapping them during this short fade is
      // imperceptible.
      const revealT = rawProgress < 1
        ? Math.max(0, Math.min(1, (progress - 0.62) / 0.3))
        : 1 - handoffT
      reveal!.style.left = `${m.revealLeft}px`
      reveal!.style.top = `${m.revealTop}px`
      reveal!.style.width = `${m.revealW}px`
      reveal!.style.opacity = `${revealT}`
      reveal!.style.filter = `blur(${lerp(10, 0, revealT)}px)`
      reveal!.style.transform = `translateY(${(1 - revealT) * 20}px) scale(${lerp(1.05, 1, revealT)})`

      // .story-pin is pulled up to overlap the dead scroll space after this
      // pin releases (see its CSS comment) so there's no black gap — but
      // that overlap also means .story's natural (pre-sticky) resting spot
      // physically intersects the viewport well before progress reaches 1,
      // starting around the halfway point of phase B. Left alone, the real
      // (already fully-formed) About layout would peek up from the bottom
      // while the settling window above it is still mid-transition — a
      // split-screen mismatch. Keeping .story fully hidden until this
      // reveal finishes avoids that: the clone hands off to it over the
      // same short crossfade as above.
      story!.style.opacity = `${handoffT}`
      story!.style.pointerEvents = handoffT > 0.5 ? 'auto' : 'none'
    }

    function requestApply() {
      if (!raf) raf = requestAnimationFrame(apply)
    }

    function onResize() {
      enabled = window.innerWidth > 860
      settled = null
      if (!enabled) {
        focus!.removeAttribute('style')
        focusImg!.style.filter = ''
        heroBg!.style.opacity = ''
        heroScrim!.style.opacity = ''
        heroContent!.style.opacity = ''
        heroContent!.style.filter = ''
        reveal!.style.opacity = '0'
        story!.style.opacity = ''
        story!.style.pointerEvents = ''
        return
      }
      measure()
      requestApply()
    }

    const img = new window.Image()
    img.onload = () => { iw = img.naturalWidth; ih = img.naturalHeight; measure(); requestApply() }
    img.src = '/avatar.png'

    window.addEventListener('scroll', requestApply, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', requestApply)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  /* ── STORY: ABOUT → PROJECTS → SKILLS → MINDSET → CONTACT ──
     Once the Hero → About reveal settles the photo into its slot, .story-pin
     keeps that same photo pinned (position:sticky, same trick as .hero-pin)
     for every section after it — scrolling only crossfades the text panel
     on the right between 5 "pages", one per section. Separate anchor marker
     elements (not the pages themselves, which never move once the sticky
     engages) carry the #about/#projects/... ids at each page's scroll
     offset, so hash links (e.g. the hero's "scroll to about" chevron)
     still land in the right place. */
  useEffect(() => {
    const pin = document.getElementById('storyPin')
    const pages = pin ? Array.from(pin.querySelectorAll<HTMLElement>('.story-page')) : []
    const bar = document.getElementById('storyProgressBar')
    if (!pin || !bar || pages.length < 2) return

    const transN = pages.length - 1
    let enabled = window.innerWidth > 860
    let raf = 0
    let pinTop = 0, releaseY = 0
    // Same idea as the Hero effect: once fully settled at page 0 (before the
    // pin) or the last page (after release), skip the recompute so this
    // listener isn't doing work on every scroll frame across the rest of
    // the page too.
    let settled: 'top' | 'bottom' | null = null

    const docTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY
    const smooth = (t: number) => t * t * (3 - 2 * t)

    function measure() {
      pinTop = docTop(pin!)
      releaseY = pinTop + pin!.offsetHeight - window.innerHeight
    }

    function apply() {
      raf = 0
      if (!enabled) return
      const rawOverall = (window.scrollY - pinTop) / Math.max(1, releaseY - pinTop)
      if (rawOverall >= 1) {
        if (settled === 'bottom') return
        settled = 'bottom'
      } else if (rawOverall <= 0) {
        if (settled === 'top') return
        settled = 'top'
      } else {
        settled = null
      }
      const overall = Math.min(1, Math.max(0, rawOverall))
      const stepFloat = Math.min(transN, overall * transN)
      const idx = Math.min(transN - 1, Math.floor(stepFloat))
      const localT = stepFloat - idx
      // Hold each page fully readable for the first 65% of its scroll
      // range, then crossfade sequentially (no simultaneous overlap) into
      // the next one over the remaining 35%.
      const t = smooth(Math.max(0, Math.min(1, (localT - 0.65) / 0.35)))

      pages.forEach((page, i) => {
        let o = 0, ty = 20
        if (i === idx) { o = Math.max(0, 1 - t / 0.5); ty = -Math.min(1, t / 0.5) * 20 }
        else if (i === idx + 1) { o = Math.max(0, (t - 0.5) / 0.5); ty = (1 - Math.max(0, Math.min(1, (t - 0.5) / 0.5))) * 20 }
        page.style.opacity = `${o}`
        page.style.transform = `translateY(${ty}px)`
        page.style.pointerEvents = o > 0.5 ? 'auto' : 'none'
      })

      bar!.style.width = `${overall * 100}%`
    }

    function requestApply() {
      if (!raf) raf = requestAnimationFrame(apply)
    }

    function onResize() {
      enabled = window.innerWidth > 860
      settled = null
      if (!enabled) {
        pages.forEach((page, i) => {
          page.style.opacity = i === 0 ? '1' : '0'
          page.style.transform = 'none'
        })
        bar!.style.width = '0%'
        return
      }
      measure()
      requestApply()
    }

    measure()
    requestApply()
    window.addEventListener('scroll', requestApply, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', requestApply)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <canvas id="grain" />
      <div className="cur" id="cd"><div className="cur-d" /></div>
      <div className="cur-r" id="cr" />

      {/* NAV */}
      <header className="nav" id="nav">
        <a href="#home" className="logo" id="logo">Thinh<b>Pham Le Tan</b></a>
      </header>

      {/* HERO — pinned while scrolling (see the HERO → ABOUT PINNED REVEAL
          effect above): the focus window grows fullscreen and sharpens into
          focus, then settles into the About photo's slot */}
      <div className="hero-pin" id="heroPin">
        <section className="hero" id="home">
          <div className="hero-visual" id="heroVisual">
            <div className="hero-bg" />
            <div className="hero-scrim" />
            <div className="hero-focus" id="heroFocus">
              <div className="hero-focus-clip">
                <div className="hero-focus-img" id="heroFocusImg" />
              </div>
            </div>
            <div className="hero-about-reveal" id="heroAboutReveal" aria-hidden="true">
              <p className="eyebrow">01 — About me</p>
              <h2 className="stitle">Seven years of<br /><em>deliberate</em> craft.</h2>
              <p className="about-body">I&apos;m <strong>Thinh</strong> — a Senior Frontend Engineer and Project Manager bridging <strong>design intent</strong> and <strong>engineering reality</strong>, from 3-person founding teams to orgs of 200+. Now moving deeper into <strong>Product Management</strong>.</p>
              <div className="about-stats">
                <div className="astat"><div className="astat-n">7+</div><div className="astat-l">Years in industry</div></div>
                <div className="astat"><div className="astat-n">32</div><div className="astat-l">Products shipped</div></div>
                <div className="astat"><div className="astat-n">4</div><div className="astat-l">Design systems</div></div>
                <div className="astat"><div className="astat-n">3+</div><div className="astat-l">Teams led</div></div>
              </div>
              <div className="about-now"><strong>Senior Frontend Engineer · PM</strong> at Axon Technologies (2022–present) · previously Teko, Fossil, KMS</div>
            </div>
          </div>
          <div className="hero-content">
            <p className="hero-eyebrow">Senior Frontend Engineer · Project Manager · Ho Chi Minh City</p>
            <blockquote className="hero-quote">&ldquo;I write software the way I&apos;d want to read it back in five years.&rdquo;</blockquote>
            <h1 className="hero-name">
              <span className="fn">Thinh</span>
              <span className="ln">Pham Le</span>
              <span className="ln2">Tan</span>
            </h1>
          </div>
        </section>
      </div>

      {/* STORY — once the Hero → About reveal settles the photo into place,
          it stays pinned (position:sticky, same trick as .hero-pin) through
          every section after it; scrolling only crossfades the text panel
          on the right (see the STORY effect above). Anchor markers below
          carry the real #about/#projects/... ids so hash links still land
          in the right place despite the pages themselves never moving once
          the sticky engages. */}
      <div className="story-pin" id="storyPin">
        {STORY_SECTIONS.map((id, i) => (
          <div key={id} id={id} className="story-anchor" style={{ top: `${i * 100}vh` }} />
        ))}
        <div className="story">
          <div className="story-photo-col">
            <div className="story-photo-bg" />
            <Image className="story-photo" src="/avatar.png" alt="Thinh Pham Le Tan" width={320} height={460} />
            <div className="story-photo-caption">Thinh Pham Le Tan · HCMC</div>
          </div>
          <div className="story-text">
            <div className="story-text-inner">
              {/* 01 — ABOUT */}
              <div className="story-page" id="aboutTextTarget">
                <p className="eyebrow">01 — About me</p>
                <h2 className="stitle">Seven years of<br /><em>deliberate</em> craft.</h2>
                <p className="about-body">I&apos;m <strong>Thinh</strong> — a Senior Frontend Engineer and Project Manager bridging <strong>design intent</strong> and <strong>engineering reality</strong>, from 3-person founding teams to orgs of 200+. Now moving deeper into <strong>Product Management</strong>.</p>
                <div className="about-stats">
                  <div className="astat"><div className="astat-n">7+</div><div className="astat-l">Years in industry</div></div>
                  <div className="astat"><div className="astat-n">32</div><div className="astat-l">Products shipped</div></div>
                  <div className="astat"><div className="astat-n">4</div><div className="astat-l">Design systems</div></div>
                  <div className="astat"><div className="astat-n">3+</div><div className="astat-l">Teams led</div></div>
                </div>
                <div className="about-now"><strong>Senior Frontend Engineer · PM</strong> at Axon Technologies (2022–present) · previously Teko, Fossil, KMS</div>
              </div>

              {/* 02 — PROJECTS */}
              <div className="story-page">
                <p className="eyebrow">02 — Selected work</p>
                <h2 className="stitle">Things I&apos;ve shipped<br />that <em>matter.</em></h2>
                <p className="pf-eyebrow">Case study · Axon Technologies</p>
                <h3 className="pf-name">Axon Design <em>System</em></h3>
                <p className="pf-desc">A headless component library powering 6 products. Reduced UI inconsistency by 80%.</p>
                <div className="pf-metrics">
                  <div className="pf-m"><span>140+</span><span>Components</span></div>
                  <div className="pf-m"><span>6</span><span>Products</span></div>
                  <div className="pf-m"><span>4.2k</span><span>Weekly devs</span></div>
                </div>
                <a className="pf-link" href="#">View case study ↗</a>
                <div className="proj-also">
                  <span className="proj-also-label">Also shipped</span>
                  {['Teko Commerce', 'AI Dashboard', 'Fossil SmartWatch', 'Dev Tooling', 'KMS Onboarding'].map(n => (
                    <span key={n} className="pchip">{n}</span>
                  ))}
                </div>
              </div>

              {/* 03 — SKILLS */}
              <div className="story-page">
                <p className="eyebrow">03 — Technical skills</p>
                <h2 className="stitle">Tools I trust to do<br /><em>serious</em> work.</h2>
                <div className="story-skills">
                  {[
                    { name: 'Frontend core', cnt: '12', core: ['React 18+', 'TypeScript', 'Next.js 14'] },
                    { name: 'Backend & infra', cnt: '8', core: ['Java 17+', 'Spring Boot 3', 'PostgreSQL'] },
                    { name: 'AI & emerging', cnt: '6', core: ['Prompt Engineering', 'OpenAI API', 'LangChain'] },
                    { name: 'Craft & process', cnt: '6', core: ['Figma', 'GitHub Actions', 'Linear'] },
                  ].map((g, i) => (
                    <div key={i} className="sg-row">
                      <div className="sg-head"><span className="sg-name">{g.name}</span><span className="sg-cnt">{g.cnt} tools</span></div>
                      <div className="pills">
                        {g.core.map((p, j) => <span key={j} className="pill core">{p}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 04 — MINDSET */}
              <div className="story-page">
                <p className="eyebrow">04 — Mindset</p>
                <h2 className="stitle">How I think<br />about <em>building.</em></h2>
                <blockquote className="big-q">&ldquo;I don&apos;t write code to impress engineers. I write it so the person using the product never has to think about the technology beneath it.&rdquo;</blockquote>
                <div className="mvs-row">
                  {['Accessibility is not optional', 'Performance is a design constraint', 'Design & engineering, one language', 'Ship, learn, iterate'].map((t, i) => (
                    <span key={i} className="mv-chip">{t}</span>
                  ))}
                </div>
                <div className="cert-row">
                  <span className="cert-t">7 certifications</span>
                  {['PSM1', 'AWS', 'CKAD', 'FEM', 'DL', 'OCA', 'WAS'].map((b, i) => (
                    <span key={i} className="cbadge">{b}</span>
                  ))}
                </div>
              </div>

              {/* 05 — CONTACT */}
              <div className="story-page">
                <p className="eyebrow">05 — Get in touch</p>
                <div className="cg-big">Let&apos;s <em>build</em> something <em>real.</em></div>
                <p className="cg-sub">Open to senior roles, contract work, and interesting problems. If what you&apos;re building matters, let&apos;s talk.</p>
                <div className="story-links">
                  {[
                    { l: 'Email', v: 'thinh.phamlt@gmail.com', href: 'mailto:thinh.phamlt@gmail.com' },
                    { l: 'LinkedIn', v: 'linkedin.com/in/thinhphamlt', href: '#' },
                    { l: 'GitHub', v: 'github.com/thinhphamlt', href: '#' },
                    { l: 'Blog', v: 'thinh.dev — frontend craft', href: '#' },
                    { l: 'Résumé', v: 'Download PDF — May 2025', href: '#' },
                  ].map((link, i) => (
                    <a key={i} className="cl" href={link.href}>
                      <div className="cl-fill" />
                      <div><span className="cl-l">{link.l}</span><span className="cl-v">{link.v}</span></div>
                      <span className="cl-a">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="story-progress"><div className="story-progress-bar" id="storyProgressBar" /></div>
        </div>
      </div>

      {/* Mobile-only fallback: the sticky-photo/crossfade mechanic needs real
          screen room, so under 860px this becomes one normal stacked column
          (photo once up top, then every section's content one after another). */}
      <div className="story-mobile">
        <div className="story-photo-col">
          <div className="story-photo-bg" />
          <Image className="story-photo" src="/avatar.png" alt="Thinh Pham Le Tan" width={320} height={460} />
          <div className="story-photo-caption">Thinh Pham Le Tan · HCMC</div>
        </div>

        <div className="story-page rv">
          <p className="eyebrow">01 — About me</p>
          <h2 className="stitle">Seven years of<br /><em>deliberate</em> craft.</h2>
          <p className="about-body">I&apos;m <strong>Thinh</strong> — a Senior Frontend Engineer and Project Manager bridging <strong>design intent</strong> and <strong>engineering reality</strong>, from 3-person founding teams to orgs of 200+. Now moving deeper into <strong>Product Management</strong>.</p>
          <div className="about-stats">
            <div className="astat"><div className="astat-n">7+</div><div className="astat-l">Years in industry</div></div>
            <div className="astat"><div className="astat-n">32</div><div className="astat-l">Products shipped</div></div>
            <div className="astat"><div className="astat-n">4</div><div className="astat-l">Design systems</div></div>
            <div className="astat"><div className="astat-n">3+</div><div className="astat-l">Teams led</div></div>
          </div>
          <div className="about-now"><strong>Senior Frontend Engineer · PM</strong> at Axon Technologies (2022–present) · previously Teko, Fossil, KMS</div>
        </div>

        <div className="story-page rv">
          <p className="eyebrow">02 — Selected work</p>
          <h2 className="stitle">Things I&apos;ve shipped<br />that <em>matter.</em></h2>
          <p className="pf-eyebrow">Case study · Axon Technologies</p>
          <h3 className="pf-name">Axon Design <em>System</em></h3>
          <p className="pf-desc">A headless component library powering 6 products. Reduced UI inconsistency by 80%.</p>
          <div className="pf-metrics">
            <div className="pf-m"><span>140+</span><span>Components</span></div>
            <div className="pf-m"><span>6</span><span>Products</span></div>
            <div className="pf-m"><span>4.2k</span><span>Weekly devs</span></div>
          </div>
          <a className="pf-link" href="#">View case study ↗</a>
          <div className="proj-also">
            <span className="proj-also-label">Also shipped</span>
            {['Teko Commerce', 'AI Dashboard', 'Fossil SmartWatch', 'Dev Tooling', 'KMS Onboarding'].map(n => (
              <span key={n} className="pchip">{n}</span>
            ))}
          </div>
        </div>

        <div className="story-page rv">
          <p className="eyebrow">03 — Technical skills</p>
          <h2 className="stitle">Tools I trust to do<br /><em>serious</em> work.</h2>
          <div className="story-skills">
            {[
              { name: 'Frontend core', cnt: '12', core: ['React 18+', 'TypeScript', 'Next.js 14'] },
              { name: 'Backend & infra', cnt: '8', core: ['Java 17+', 'Spring Boot 3', 'PostgreSQL'] },
              { name: 'AI & emerging', cnt: '6', core: ['Prompt Engineering', 'OpenAI API', 'LangChain'] },
              { name: 'Craft & process', cnt: '6', core: ['Figma', 'GitHub Actions', 'Linear'] },
            ].map((g, i) => (
              <div key={i} className="sg-row">
                <div className="sg-head"><span className="sg-name">{g.name}</span><span className="sg-cnt">{g.cnt} tools</span></div>
                <div className="pills">
                  {g.core.map((p, j) => <span key={j} className="pill core">{p}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="story-page rv">
          <p className="eyebrow">04 — Mindset</p>
          <h2 className="stitle">How I think<br />about <em>building.</em></h2>
          <blockquote className="big-q">&ldquo;I don&apos;t write code to impress engineers. I write it so the person using the product never has to think about the technology beneath it.&rdquo;</blockquote>
          <div className="mvs-row">
            {['Accessibility is not optional', 'Performance is a design constraint', 'Design & engineering, one language', 'Ship, learn, iterate'].map((t, i) => (
              <span key={i} className="mv-chip">{t}</span>
            ))}
          </div>
          <div className="cert-row">
            <span className="cert-t">7 certifications</span>
            {['PSM1', 'AWS', 'CKAD', 'FEM', 'DL', 'OCA', 'WAS'].map((b, i) => (
              <span key={i} className="cbadge">{b}</span>
            ))}
          </div>
        </div>

        <div className="story-page rv">
          <p className="eyebrow">05 — Get in touch</p>
          <div className="cg-big">Let&apos;s <em>build</em> something <em>real.</em></div>
          <p className="cg-sub">Open to senior roles, contract work, and interesting problems. If what you&apos;re building matters, let&apos;s talk.</p>
          <div className="story-links">
            {[
              { l: 'Email', v: 'thinh.phamlt@gmail.com', href: 'mailto:thinh.phamlt@gmail.com' },
              { l: 'LinkedIn', v: 'linkedin.com/in/thinhphamlt', href: '#' },
              { l: 'GitHub', v: 'github.com/thinhphamlt', href: '#' },
              { l: 'Blog', v: 'thinh.dev — frontend craft', href: '#' },
              { l: 'Résumé', v: 'Download PDF — May 2025', href: '#' },
            ].map((link, i) => (
              <a key={i} className="cl" href={link.href}>
                <div className="cl-fill" />
                <div><span className="cl-l">{link.l}</span><span className="cl-v">{link.v}</span></div>
                <span className="cl-a">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer>
        <span>© 2025 Thinh Pham Le Tan</span>
        <span>Designed & built with intention · HCMC</span>
      </footer>
    </>
  )
}
