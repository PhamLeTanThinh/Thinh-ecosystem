'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Lenis from 'lenis'
import './portfolio.css'
import { Preloader } from './Preloader'

// A project worked on within a job. Every project listed under a job's
// `projects` becomes its own scroll page right after that job's page (see
// EXPERIENCE_PAGES below), so adding another project later is just appending
// one object here — the pin height, anchors and headings all recompute.
// Brand colours taken from each company's own logo / site (see BRANDS below).
type Brand = { c1: string; c2: string; c3: string }

type ExpProject = {
  brand: Brand
  name: string
  tagline: string
  role: string
  dates: string
  teamSize?: string
  summary: string
  responsibilities: { title: string; text: string }[]
  tech: string[]
}

type ExpJob = {
  brand: Brand
  role: string; company: string; type: string
  dates: string; duration: string; location: string
  desc: string
  skills: string[]
  projects: ExpProject[]
}

// One scroll-revealed milestone per real job/role, in chronological-current
// order (current role first, matching the LinkedIn Experience layout this
// was modeled on) — each becomes its own page in the STORY pin, so scrolling
// through "03 — Experience" steps through them one at a time. A job with
// projects is followed by one page per project.
const BRANDS = {
  // FPT: orange / blue / green of the FPT mark (fptsoftware.com, FPT Software logo SVG)
  fpt: { c1: '#f37021', c2: '#0e69af', c3: '#0db04b' },
  // CapitaStar app: blues + cyan (CapitaStar brand)
  capitastar: { c1: '#114d8d', c2: '#2474e1', c3: '#00becf' },
  // MindX: red + navy (mindx.edu.vn)
  mindx: { c1: '#e31f26', c2: '#000056', c3: '#ff6066' },
  // Blackbook.ai: teal, lime and forest green (blackbookai.com)
  blackbook: { c1: '#0f6b7a', c2: '#8ae372', c3: '#0f1f16' },
  // FPTU Event Club: purple, black and red (colours given by the owner)
  fptu: { c1: '#6a3fb5', c2: '#111111', c3: '#d62839' },
} satisfies Record<string, Brand>

const brandStyle = (b: Brand) => ({ '--b1': b.c1, '--b2': b.c2, '--b3': b.c3 }) as React.CSSProperties

const EXPERIENCE: ExpJob[] = [
  {
    brand: BRANDS.fpt,
    role: 'Software Engineer', company: 'FPT Software', type: 'Full-time',
    dates: 'Nov 2022 – Present', duration: '3+ yrs', location: 'Vietnam',
    desc: 'Full-stack engineering on large-scale web platforms for outsourcing clients in Singapore.',
    skills: ['JavaScript', 'React.js', 'Java (Spring Boot)', 'MySQL', 'Microsoft Azure', 'GitHub Copilot'],
    projects: [
      {
        brand: BRANDS.capitastar,
        name: 'CapitaStar',
        tagline: 'Loyalty system for CapitaLand',
        role: 'Senior Full-stack Developer',
        dates: 'Oct 2022 – Present',
        teamSize: '35 members',
        summary: 'A large-scale loyalty system for CapitaLand, one of the largest diversified real estate groups in Asia, serving 1.5 million users.',
        responsibilities: [
          { title: 'Full-stack delivery', text: 'Work on full-stack development, including backend logic (Java Spring) and frontend integration (ReactJS).' },
          { title: 'Integration', text: 'Collaborate with cross-functional teams to integrate with third-party services & internal microservices.' },
          { title: 'Analysis & estimation', text: 'Analyze requirements, estimate effort, & propose technical solutions to clients and stakeholders.' },
          { title: 'Mentoring & reviews', text: 'Break down tasks, conduct code reviews, & mentor fresher developers, fostering a high-performance team culture.' },
          { title: 'Applying AI', text: 'Share AI knowledge with the team & use AI to build tools that support day-to-day project work.' },
        ],
        tech: ['Java', 'Spring Framework', 'MySQL', 'JavaScript', 'ReactJS'],
      },
    ],
  },
  {
    brand: BRANDS.mindx,
    role: 'Teacher', company: 'MindX Technology School', type: 'Part-time',
    dates: 'Sep 2022 – Jan 2023', duration: '5 mos', location: '',
    desc: 'Taught Python, Scratch and front-end development to children at a technology-focused school, alongside full-time engineering work.',
    skills: ['Python', 'Scratch', 'Front-end'],
    projects: [],
  },
  {
    brand: BRANDS.blackbook,
    role: 'Full-stack Developer', company: 'Blackbook.ai', type: 'Full-time',
    dates: 'May 2022 – Nov 2022', duration: '5 mos', location: '',
    desc: 'Built the HR Compliance Portal for an Australian HR services provider — DWKit low-code forms and workflows on a C#/.NET and SQL Server stack — before moving to FPT Software.',
    skills: ['C#', '.NET', 'DWKit', 'JavaScript', 'SQL Server', 'HTML5', 'CSS3'],
    projects: [
      {
        brand: BRANDS.blackbook,
        name: 'HR Compliance Portal',
        tagline: 'Australian HR services provider',
        role: 'Software Developer',
        dates: 'May 2022 – Nov 2022',
        summary: 'An HR Compliance Portal for an Australian HR services provider, built on DWKit, a low-code BPM platform, with an onsite development team in Ho Chi Minh City.',
        responsibilities: [
          { title: 'Low-code forms', text: 'Built and configured dynamic forms in DWKit using drag-and-drop components.' },
          { title: 'HR workflows', text: 'Supported HR workflow configuration, data binding, and business process customization.' },
          { title: 'Custom logic', text: 'Wrote custom application logic and data handling in C#/.NET, JavaScript, and SQL Server.' },
          { title: 'Delivery', text: 'Took part in feature development, issue fixing, and project onboarding within the onsite team.' },
        ],
        tech: ['C#', '.NET', 'DWKit', 'JavaScript', 'SQL Server'],
      },
    ],
  },
  {
    brand: BRANDS.fptu,
    role: 'President', company: 'FPTU Event Club', type: '',
    dates: 'May 2019 – Apr 2020', duration: '1 yr', location: 'Ho Chi Minh City, Vietnam',
    desc: 'Enhanced leadership skills and gained experience in event planning and organizing through more than 20 projects.',
    skills: [],
    projects: [],
  },
]

// EXPERIENCE flattened into the actual scroll pages: each job, then its
// projects. Everything that depends on how many Experience pages there are
// (STORY_SECTIONS' page indices, the pin's height, the shared-heading zones
// in the STORY effect) derives from this instead of a hand-counted number.
type ExpPage =
  | { kind: 'job'; job: ExpJob; jobIndex: number }
  | { kind: 'project'; job: ExpJob; jobIndex: number; project: ExpProject; projectIndex: number }

const EXPERIENCE_PAGES: ExpPage[] = EXPERIENCE.flatMap((job, jobIndex): ExpPage[] => [
  { kind: 'job', job, jobIndex },
  ...job.projects.map((project, projectIndex): ExpPage => ({ kind: 'project', job, jobIndex, project, projectIndex })),
])

const pad2 = (n: number) => String(n).padStart(2, '0')

// A job that has projects gets ONE persistent header (role · company · dates)
// that is shared by the job's own page and all of its project pages, so the
// projects read as children of the job. It is big on the job's page and
// collapses into a compact bar when scrolling into the first project (the
// .is-compact state — see the EXPERIENCE block in portfolio.css). Every page
// of the job also renders an invisible copy of this header in the matching
// size purely to reserve the space, exactly like the shared section heading.
function JobHead({ job, jobIndex, compact }: { job: ExpJob; jobIndex: number; compact?: boolean }) {
  return (
    <div className={`exp-jobhead${compact ? ' is-compact' : ''}`}>
      <div className="jh-count">{pad2(jobIndex + 1)}<span>/{pad2(EXPERIENCE.length)}</span></div>
      <h3 className="jh-role">{job.role}</h3>
      <p className="jh-company">{job.company}{job.type && ` · ${job.type}`}</p>
      <p className="jh-dates">{job.dates} · {job.duration}{job.location && ` · ${job.location}`}</p>
    </div>
  )
}

// The part of an Experience page below its heading — shared between the
// desktop pinned pages (which reserve the heading's space invisibly) and the
// mobile stacked fallback (which shows it). `mobile` shows the job header
// inline instead of reserving its space for the shared overlay.
function ExpBody({ page, mobile = false }: { page: ExpPage; mobile?: boolean }) {
  const pad = pad2
  const headWrap = (job: ExpJob, jobIndex: number, compact: boolean) => (
    <div style={mobile ? brandStyle(job.brand) : { visibility: 'hidden' }} aria-hidden={mobile ? undefined : true}>
      <JobHead job={job} jobIndex={jobIndex} compact={compact} />
    </div>
  )
  if (page.kind === 'job') {
    const { job, jobIndex } = page
    const nested = job.projects.length > 0
    return (
      <>
        {nested ? headWrap(job, jobIndex, false) : (
          <>
            <div className="story-count">{pad(jobIndex + 1)}<span>/{pad(EXPERIENCE.length)}</span></div>
            <h3 className="exp-role">{job.role}</h3>
            <p className="exp-company">{job.company}{job.type && ` · ${job.type}`}</p>
            <p className="exp-dates">{job.dates} · {job.duration}{job.location && ` · ${job.location}`}</p>
          </>
        )}
        <p className="exp-desc">{job.desc}</p>
        {job.skills.length > 0 && (
          <div className="exp-skills">
            {job.skills.map(s => <span key={s} className="pchip">{s}</span>)}
          </div>
        )}
        {nested && (
          <p className="exp-hint">{job.projects.length === 1 ? '1 project' : `${job.projects.length} projects`} · keep scrolling ↓</p>
        )}
      </>
    )
  }
  const { job, jobIndex, project, projectIndex } = page
  return (
    <>
      {headWrap(job, jobIndex, true)}
      <div className="exp-child">
      {job.projects.length > 1 && (
        <div className="story-count">Project {pad(projectIndex + 1)}<span>/{pad(job.projects.length)}</span></div>
      )}
      <h3 className="exp-role">{project.name}</h3>
      <p className="exp-company">{project.tagline} · {project.role}</p>
      <p className="exp-dates">{project.dates}{project.teamSize && ` · Team of ${project.teamSize}`}</p>
      <p className="exp-desc">{project.summary}</p>
      <ul className={`proj-resp${project.responsibilities.length > 4 ? ' proj-resp-3' : ''}`}>
        {project.responsibilities.map((r, i) => (
          <li key={r.title} style={{ '--k': i } as React.CSSProperties}>
            <span className="proj-resp-n">{pad(i + 1)}</span>
            <h4 className="proj-resp-t">{r.title}</h4>
            <p className="proj-resp-d">{r.text}</p>
          </li>
        ))}
      </ul>
      <div className="exp-skills">
        {project.tech.map(s => <span key={s} className="pchip">{s}</span>)}
      </div>
      </div>
    </>
  )
}

// logo: an svg under /public/logos (real brand mark, recolored via
// currentColor to fit the site's palette) — omitted where no authentic logo
// was available (Scrum.org's own mark, for the PSM certs, isn't in any brand
// icon set I could pull from) rather than substituting a different org's.
// Grouped by category — Language is left empty until a real cert (IELTS/
// HSK/TOPIK/...) is provided, rather than inventing a score.
const CERTIFICATIONS = [
  {
    category: 'Technical',
    items: [
      { issuer: 'Microsoft', name: 'Azure AI Engineer Associate', issued: 'Issued 2026', credentialId: '', href: '#', logo: '/logos/microsoft.svg' },
      { issuer: 'GitHub', name: 'GitHub Copilot Certification', issued: '', credentialId: '', href: '#', logo: '/logos/github.svg' },
      { issuer: 'Google', name: 'Google AI Professional Certificate', issued: '', credentialId: '', href: '#', logo: '/logos/google.svg' },
    ],
  },
  {
    category: 'Management',
    items: [
      { issuer: 'Scrum.org', name: 'Professional Scrum Master I (PSM I)', issued: '', credentialId: '', href: '#', logo: '' },
      { issuer: 'Scrum.org', name: 'Professional Scrum Master II (PSM II)', issued: '', credentialId: '', href: '#', logo: '' },
    ],
  },
  {
    category: 'Language',
    items: [],
  },
]

const CONTACT_LINKS = [
  { l: 'Email', v: 'phamletanthinh.bob.work@gmail.com', href: 'mailto:phamletanthinh.bob.work@gmail.com' },
  { l: 'LinkedIn', v: 'linkedin.com/in/phamletanthinh', href: 'https://www.linkedin.com/in/phamletanthinh/' },
  { l: 'GitHub', v: 'github.com/PhamLeTanThinh', href: 'https://github.com/PhamLeTanThinh' },
  { l: 'Résumé', v: 'Download PDF — May 2025', href: '#' },
]

// Personal side project shown on the Mindset page — links to the /study hub.
function OwnBuild() {
  return (
    <p className="own-build">
      <span className="ob-label">Something I built for myself</span>
      <Link href="/study" className="ob-link">My Study Hub <span className="ob-arrow">↗</span></Link>
    </p>
  )
}

const SKILL_GROUPS = [
  { name: 'Frontend core', core: ['ReactJS', 'JavaScript (ES6+)', 'HTML5 & CSS3', 'Ant Design', 'MUI', 'React Admin', 'UmiJS'] },
  { name: 'Backend & Data', core: ['Java (Spring Boot)', 'MySQL'] },
  { name: 'AI core', core: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Natural Language Processing'] },
  { name: 'Cloud & AI tooling', core: ['Microsoft Azure', 'GitHub Copilot', 'Claude'] },
  { name: 'Craft & process', core: ['Full SDLC', 'Production support', 'Automation tooling'] },
]

const EDUCATION = [
  { school: 'FPT School of Business & Technology', degree: 'Master of Software Engineering (MSE) — Artificial Intelligence Specialization', dates: 'September 2025 – Now' },
  { school: 'FPT University', degree: 'Software Engineering', dates: 'Sep 2017 – Sep 2021' },
  { school: 'KDU Penang University College - Malaysia', degree: 'English Enhancement Programme', dates: 'Jan 2018 – May 2018' },
]

// Page layout of the STORY pin, all derived from the data above:
// About, the Education page, every Experience page (jobs + their projects),
// then the 3 single pages Skills/Mindset/Highlights, every
// Certifications category page, and finally Contact. The anchor markers
// spaced through .story-pin need each section's actual page index, not its
// position in this list.
const EDU_PAGE = 1
const EXP_START = EDU_PAGE + 1
const SKILLS_PAGE = EXP_START + EXPERIENCE_PAGES.length
const CERT_START = SKILLS_PAGE + 3
const CONTACT_PAGE = CERT_START + CERTIFICATIONS.length
const TOTAL_PAGES = CONTACT_PAGE + 1

// Jobs that have projects, with the first/last story-page index they span (the
// job's own page, then one per project) — the shared header overlay for each
// is faded/compacted by the STORY effect using these indices.
const JOB_HEADS = EXPERIENCE.flatMap((job, jobIndex) => {
  if (job.projects.length === 0) return []
  const first = EXP_START + EXPERIENCE_PAGES.findIndex(p => p.kind === 'job' && p.jobIndex === jobIndex)
  return [{ job, jobIndex, first, last: first + job.projects.length }]
})

const STORY_SECTIONS = [
  { id: 'about', page: 0 },
  { id: 'education', page: EDU_PAGE },
  { id: 'projects', page: EXP_START },
  { id: 'skills', page: SKILLS_PAGE },
  { id: 'mindset', page: SKILLS_PAGE + 1 },
  { id: 'proud', page: SKILLS_PAGE + 2 },
  { id: 'certifications', page: CERT_START },
  { id: 'contact', page: CONTACT_PAGE },
]

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

    document.querySelectorAll<HTMLElement>('a,button,.astat,.mv-chip,.pchip').forEach(el => {
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

  /* ── SMOOTH SCROLL ──
     Lenis (same library, and the same lerp:0.1 feel, as haoqi.design): wheel
     input is eased toward its target instead of jumping a notch per event.
     It drives ordinary window scroll underneath, so position:sticky, every
     other scroll listener here and hash-link anchors keep working untouched.
     wheelMultiplier < 1 slows it down a touch. Touch keeps native momentum,
     and reduced-motion opts out entirely. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.8, smoothWheel: true, anchors: true, autoRaf: true })
    return () => lenis.destroy()
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
    const smooth = (t: number) => t * t * (3 - 2 * t)
    const hero = pin.querySelector<HTMLElement>('.hero')

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
      const targetH = Math.min(aRect.height, vh * 0.8)
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
      // The real About text sits at the top of .story-text-inner (a min-height box the grid centres
      // vertically), not centred on its own height — so land the clone at that same spot.
      const iRect = aboutText!.parentElement!.getBoundingClientRect()
      const revealTop = (vh - iRect.height) / 2 + (tRect.top - iRect.top)

      m = {
        pinTop, releaseY, bgOx, bgOy, rw, rh,
        targetLeft, targetTop, targetW, targetH, targetRw, targetRh, targetOx, targetOy,
        revealLeft: tRect.left, revealTop, revealW,
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

      // Light theme: dark while the window is growing to fullscreen (phase
      // A), then the frame around it fades to white across phase B as it
      // settles into About's slot, and the whole page stays light from there
      // on (body.theme-light re-points every palette variable — see the CSS).
      // lightT is 0 through phase A and 1 by the time the window has
      // settled, so the surrounding frame is already fully white before the
      // About clone finishes blurring in.
      const lightT = smooth(Math.max(0, Math.min(1, (progress - 0.5) / 0.3)))
      document.body.classList.toggle('theme-light', progress > 0.5)
      const bgC = lerp(16, 247, lightT), bgG = lerp(26, 248, lightT), bgB = lerp(44, 250, lightT)
      hero!.style.background = `rgb(${bgC | 0},${bgG | 0},${bgB | 0})`

      // The window's border/shadow are hardcoded (not palette variables), so
      // they'd vanish against white — cream-on-white border, black shadow
      // that reads as a smudge — without lerping them to their light values.
      const borderT = Math.max(0, 1 - (progress - 0.55) / 0.4)
      const borderRgb = `${lerp(244, 16, lightT) | 0},${lerp(239, 26, lightT) | 0},${lerp(223, 44, lightT) | 0}`
      focus!.style.borderColor = `rgba(${borderRgb},${lerp(0.85, 0.5, lightT) * borderT})`
      focus!.style.boxShadow = `0 30px 80px rgba(0,0,0,${lerp(0.5, 0.18, lightT) * borderT})`
      // The window (photo + border) stays fully sharp/visible all the way
      // through settling — it should look its clearest right as it reaches
      // the target slot, not fade away beforehand — and only fades out
      // during the same tiny handoff window as the real .story content
      // fading in below, so the swap is invisible instead of the photo
      // visibly dimming just before the real one would otherwise appear.
      focus!.style.opacity = `${1 - handoffT}`

      heroContent!.style.opacity = `${Math.max(0, 1 - progress / 0.3)}`
      heroContent!.style.filter = `blur(${Math.min(6, progress / 0.3 * 6)}px)`

      // The ambient blurred backdrop is dark photo-tinted, so it has to be
      // gone for the frame around the settling window to read as white — it
      // fades out over the same stretch (progress 0.5 → 0.8) as .hero's own
      // background lerps to white above. That also covers the dead scroll
      // zone after the pin releases (.hero, still 100vh, needs a full
      // viewport of ordinary scroll to clear): it now shows plain white
      // instead of replaying the blurred backdrop.
      const bgFade = Math.max(0, 1 - (progress - 0.5) / 0.3)
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
        ? Math.max(0, Math.min(1, (progress - 0.68) / 0.27))
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
        // Mobile has no pinned transition — its dark hero / light content
        // split comes purely from CSS (.story-mobile), not this class.
        document.body.classList.remove('theme-light')
        hero!.style.background = ''
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
    img.src = '/avatar-cool.jpg'

    window.addEventListener('scroll', requestApply, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', requestApply)
      window.removeEventListener('resize', onResize)
      document.body.classList.remove('theme-light')
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
    const expHeading = document.getElementById('expHeading')
    const certHeading = document.getElementById('certHeading')
    const jobSlots = Array.from(document.querySelectorAll<HTMLElement>('.jh-slot'))
    if (!pin || !bar || pages.length < 2) return

    // The Experience block spans one page per job plus one per project
    // (EXPERIENCE_PAGES), and CERTIFICATIONS.length pages start after Skills/
    // Mindset/Highlights are the Certifications block's own
    // category pages (see the JSX for both). Each shared heading should hold
    // rock-solid through every transition *within* its own block and only
    // fade on the way out to whatever comes next.
    const expStart = EXP_START, expEnd = SKILLS_PAGE - 1
    const certStart = CERT_START, certEnd = CONTACT_PAGE - 1

    const transN = pages.length - 1
    let enabled = window.innerWidth > 860
    let raf = 0
    let pinTop = 0, releaseY = 0
    // Same idea as the Hero effect: once fully settled at page 0 (before the
    // pin) or the last page (after release), skip the recompute so this
    // listener isn't doing work on every scroll frame across the rest of
    // the page too.
    let settled: 'top' | 'bottom' | null = null
    // One-shot "shine" sweep on each page's own heading, replayed every
    // time it comes back to full opacity (scrolling past it and back up
    // resets the flag, so it isn't just a first-arrival thing).
    const shineFired = pages.map(() => false)
    let expShineFired = false, certShineFired = false
    function triggerShine(el: Element | null) {
      if (!el) return
      el.classList.remove('shine')
      void (el as HTMLElement).offsetWidth // force reflow so the animation restarts
      el.classList.add('shine')
    }

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
      // Hold each page fully readable for the first 50% of its scroll
      // range, then crossfade sequentially (no simultaneous overlap) into
      // the next one over the remaining 50% — a longer, gentler handoff than
      // before (was 65/35) so pages dissolve rather than snap.
      const t = smooth(Math.max(0, Math.min(1, (localT - 0.5) / 0.5)))

      const pageO: number[] = []
      pages.forEach((page, i) => {
        let o = 0, ty = 20
        if (i === idx) { o = Math.max(0, 1 - t / 0.5); ty = -Math.min(1, t / 0.5) * 20 }
        else if (i === idx + 1) { o = Math.max(0, (t - 0.5) / 0.5); ty = (1 - Math.max(0, Math.min(1, (t - 0.5) / 0.5))) * 20 }
        pageO[i] = o
        page.style.opacity = `${o}`
        page.style.transform = `translateY(${ty}px)`
        page.style.pointerEvents = o > 0.5 ? 'auto' : 'none'
        // whileInView-style entrance: the page's direct children stagger in
        // (see .story-page.in in the CSS) as soon as the page starts fading
        // up, and reset once it has faded back out.
        page.classList.toggle('in', o > 0.05)
        if (o >= 0.99) {
          if (!shineFired[i]) { triggerShine(page.querySelector('.stitle, .cg-big')); shineFired[i] = true }
        } else {
          shineFired[i] = false
        }
      })

      // Adjacent pages' opacity above is sequential, not simultaneous — it
      // briefly dips to 0 at the midpoint of *every* transition (including
      // ones entirely within a block), so simply summing per-page opacity
      // made a shared heading flicker there too. Handle each zone
      // explicitly instead: no fade at all entering the block (snap
      // straight to visible), rock-solid through every transition inside
      // it, and only fade — in sync with the last page's own fade-out — on
      // the way out to whatever comes next.
      const zoneHeadingT = (start: number, end: number) => {
        if (idx < start - 1) return 0
        if (idx === start - 1) return t > 0 ? 1 : 0
        if (idx < end) return 1
        if (idx === end) return Math.max(0, 1 - t / 0.5)
        return 0
      }
      const expHeadingT = zoneHeadingT(expStart, expEnd)
      if (expHeading) {
        expHeading.style.opacity = `${expHeadingT}`
        if (expHeadingT >= 0.99) {
          if (!expShineFired) { triggerShine(expHeading.querySelector('.stitle')); expShineFired = true }
        } else {
          expShineFired = false
        }
      }
      // Per-job header: stays fully visible through every transition between
      // the job's own page and its projects, and fades only with the outgoing/
      // incoming page at the job's edges. It collapses into its compact bar as
      // soon as the job page starts handing over to the first project page,
      // and expands again if the user scrolls back.
      jobSlots.forEach(slot => {
        const first = Number(slot.dataset.first), last = Number(slot.dataset.last)
        let o = 0
        if (idx >= first && idx + 1 <= last) o = 1
        else if (idx === last) o = pageO[idx]
        else if (idx + 1 === first) o = pageO[idx + 1]
        slot.style.opacity = `${o}`
        const compact = (idx > first && idx <= last) || (idx === first && t > 0)
        slot.firstElementChild?.classList.toggle('is-compact', compact)
      })

      const certHeadingT = zoneHeadingT(certStart, certEnd)
      if (certHeading) {
        certHeading.style.opacity = `${certHeadingT}`
        if (certHeadingT >= 0.99) {
          if (!certShineFired) { triggerShine(certHeading.querySelector('.stitle')); certShineFired = true }
        } else {
          certShineFired = false
        }
      }

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
        if (expHeading) expHeading.style.opacity = '0'
        if (certHeading) certHeading.style.opacity = '0'
        jobSlots.forEach(slot => { slot.style.opacity = '0' })
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
      <Preloader />
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
              <h2 className="stitle">3+ years of<br /><em>deliberate</em> craft.</h2>
              <p className="about-body">I&apos;m <strong>Thinh</strong> <span className="nick-in">(Bob)</span> — a Software Engineer with a strong <strong>React</strong> and <strong>Java</strong> foundation, building web platforms for outsourcing clients in <strong>Singapore</strong> for 3+ years. I care about clear communication and close teamwork to ship a premium product.</p>
              <div className="about-stats">
                <div className="astat"><div className="astat-n">3+</div><div className="astat-l">Years in industry</div></div>
                <div className="astat"><div className="astat-n">1.5M+</div><div className="astat-l">Users served</div></div>
                <div className="astat"><div className="astat-n">3</div><div className="astat-l">Companies</div></div>
                <div className="astat"><div className="astat-n">20+</div><div className="astat-l">Events led</div></div>
              </div>
              <div className="about-now"><strong>Software Engineer</strong> at FPT Software (2022–present) · previously Full-stack Developer at Blackbook.ai · Teacher at MindX Technology School</div>
            </div>
          </div>
          <div className="hero-content">
            <p className="hero-eyebrow"><span><span className="nw">Software Engineer ·</span> <span className="nw">Full-Stack Developer ·</span> <span className="nw">Ho Chi Minh City</span></span></p>
            <blockquote className="hero-quote">&ldquo;There is always enough time to become<br />who I want to be.&rdquo;</blockquote>
            <h1 className="hero-name">
              <span className="fn">Thinh<span className="nick">&ldquo;Bob&rdquo;</span></span>
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
      <div className="story-pin" id="storyPin" style={{ height: `${TOTAL_PAGES * 100}vh` }}>
        {STORY_SECTIONS.map(({ id, page }) => (
          <div key={id} id={id} className="story-anchor" style={{ top: `${page * 100}vh` }} />
        ))}
        <div className="story">
          <div className="story-photo-col">
            <div className="story-photo-bg" />
            <Image className="story-photo" src="/avatar-cool.jpg" alt="Thinh (Bob) Pham Le Tan" width={320} height={460} />
            <div className="story-photo-caption">Thinh &ldquo;Bob&rdquo; Pham Le Tan · HCMC</div>
          </div>
          <div className="story-text">
            <div className="story-text-inner">
              {/* 01 — ABOUT */}
              <div className="story-page" id="aboutTextTarget">
                <p className="eyebrow">01 — About me</p>
                <h2 className="stitle">3+ years of<br /><em>deliberate</em> craft.</h2>
                <p className="about-body">I&apos;m <strong>Thinh</strong> <span className="nick-in">(Bob)</span> — a Software Engineer with a strong <strong>React</strong> and <strong>Java</strong> foundation, building web platforms for outsourcing clients in <strong>Singapore</strong> for 3+ years. I care about clear communication and close teamwork to ship a premium product.</p>
                <div className="about-stats">
                  <div className="astat"><div className="astat-n">3+</div><div className="astat-l">Years in industry</div></div>
                  <div className="astat"><div className="astat-n">1.5M+</div><div className="astat-l">Users served</div></div>
                  <div className="astat"><div className="astat-n">3</div><div className="astat-l">Companies</div></div>
                  <div className="astat"><div className="astat-n">20+</div><div className="astat-l">Events led</div></div>
                </div>
                <div className="about-now"><strong>Software Engineer</strong> at FPT Software (2022–present) · previously Full-stack Developer at Blackbook.ai · Teacher at MindX Technology School</div>
              </div>

              {/* 02 — EDUCATION */}
              <div className="story-page">
                <p className="eyebrow">02 — Academic Journey</p>
                <h2 className="stitle">Still learning.<br />Still <em>growing.</em></h2>
                <div className="edu-list">
                  {EDUCATION.map(e => (
                    <div key={e.school} className="edu-item">
                      <h3 className="edu-school">{e.school}</h3>
                      <p className="edu-degree">{e.degree}</p>
                      <p className="edu-dates">{e.dates}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 03 — EXPERIENCE. The heading is shared (id="expHeading" below,
                  a separate overlay the STORY effect fades in/out only when
                  entering/leaving this block, never in between) so it holds
                  still while scrolling from one job to the next — each page
                  here keeps its own copy for layout spacing only (invisible,
                  reserves the same height so the real content below lines up
                  with every other section's heading position). */}
              <div className="story-page-heading" id="expHeading">
                <p className="eyebrow">03 — Experience</p>
                <h2 className="stitle">Where <em>experience</em><br />took shape.</h2>
                {/* Persistent per-job headers (see JobHead / JOB_HEADS): zero-height stack
                    so each slot lands exactly where its pages reserve the header space. */}
                <div className="jh-stack">
                  {JOB_HEADS.map(({ job, jobIndex, first, last }) => (
                    <div key={job.company} className="jh-slot" data-first={first} data-last={last} style={brandStyle(job.brand)}>
                      <JobHead job={job} jobIndex={jobIndex} />
                    </div>
                  ))}
                </div>
              </div>
              {EXPERIENCE_PAGES.map(page => (
                <div key={page.kind === 'job' ? page.job.company : `${page.job.company}/${page.project.name}`} className="story-page" style={brandStyle(page.kind === 'job' ? page.job.brand : page.project.brand)}>
                  <p className="eyebrow" style={{ visibility: 'hidden' }}>03 — Experience</p>
                  <h2 className="stitle" style={{ visibility: 'hidden' }}>Where <em>experience</em><br />took shape.</h2>
                  <ExpBody page={page} />
                </div>
              ))}

              {/* 04 — SKILLS */}
              <div className="story-page">
                <p className="eyebrow">04 — Expertise</p>
                <h2 className="stitle">What I bring<br />to the <em>table.</em></h2>
                <div className="story-skills">
                  {SKILL_GROUPS.map((g, i) => (
                    <div key={i} className="sg-row">
                      <div className="sg-head"><span className="sg-name">{g.name}</span></div>
                      <div className="pills">
                        {g.core.map((p, j) => <span key={j} className="pill core">{p}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 05 — MINDSET */}
              <div className="story-page">
                <p className="eyebrow">05 — Mindset</p>
                <h2 className="stitle"><em>Never</em> quite<br /><em>satisfied.</em></h2>
                <blockquote className="big-q">&ldquo;Not because what I&apos;ve done isn&apos;t enough, <br />but because I know there&apos;s always more I can&nbsp;become.&rdquo;</blockquote>
                <div className="mvs-row">
                  {['Learn fast, adapt under pressure', 'Automate the repetitive stuff', 'Clear communication, always', 'Teamwork over solo heroics'].map((t, i) => (
                    <span key={i} className="mv-chip">{t}</span>
                  ))}
                </div>
                <OwnBuild />
              </div>

              {/* 06 — PROUD OF (placeholder, content pending) */}
              <div className="story-page">
                <p className="eyebrow">06 — Highlights</p>
                <h2 className="stitle">A few things<br />I&apos;m <em>proud of.</em></h2>
                <p className="story-placeholder">Coming soon.</p>
              </div>

              {/* 07 — CERTIFICATIONS. Same shared-heading trick as Experience
                  (id="certHeading" below) so it holds still while scrolling
                  from one category to the next, and each category gets its
                  own page instead of all being crammed onto one screen —
                  scales cleanly no matter how many certs get added later. */}
              <div className="story-page-heading" id="certHeading">
                <p className="eyebrow">07 — Certifications</p>
                <h2 className="stitle">Learning, <em>validated.</em></h2>
              </div>
              {CERTIFICATIONS.map((group, i) => (
                <div key={group.category} className="story-page">
                  <p className="eyebrow" style={{ visibility: 'hidden' }}>07 — Certifications</p>
                  <h2 className="stitle" style={{ visibility: 'hidden' }}>Learning, <em>validated.</em></h2>
                  <div className="story-count">{String(i + 1).padStart(2, '0')}<span>/{String(CERTIFICATIONS.length).padStart(2, '0')}</span></div>
                  <div className="cert-group-label">{group.category}</div>
                  {group.items.length > 0 ? (
                    <div className="cert-grid">
                      {group.items.map(cert => (
                        <div key={cert.name} className="cert-card">
                          <div className="cert-head">
                            {cert.logo
                              ? <img className="cert-logo" src={cert.logo} alt="" />
                              : <div className="cert-logo cert-logo-text">{cert.issuer[0]}</div>}
                            <div className="cert-issuer">{cert.issuer}</div>
                          </div>
                          <h3 className="cert-name">{cert.name}</h3>
                          {(cert.issued || cert.credentialId) && (
                            <p className="cert-meta">{cert.issued}{cert.credentialId && ` · Credential ID ${cert.credentialId}`}</p>
                          )}
                          <a className="cert-link" href={cert.href}>View credential ↗</a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="story-placeholder">Coming soon.</p>
                  )}
                </div>
              ))}

              {/* 08 — CONTACT */}
              <div className="story-page">
                <p className="eyebrow">08 — Get in touch</p>
                <div className="cg-big">Let&apos;s <em>build</em> something <em>real.</em></div>
                <p className="cg-sub">Open to contract work and interesting problems. If what you&apos;re building matters, let&apos;s talk.</p>
                <div className="story-links">
                  {CONTACT_LINKS.map((link, i) => (
                    <a key={i} className="cl" href={link.href} {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
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
          <Image className="story-photo" src="/avatar-cool.jpg" alt="Thinh (Bob) Pham Le Tan" width={320} height={460} />
          <div className="story-photo-caption">Thinh &ldquo;Bob&rdquo; Pham Le Tan · HCMC</div>
        </div>

        <div className="story-page rv">
          <p className="eyebrow">01 — About me</p>
          <h2 className="stitle">3+ years of<br /><em>deliberate</em> craft.</h2>
          <p className="about-body">I&apos;m <strong>Thinh</strong> <span className="nick-in">(Bob)</span> — a Software Engineer with a strong <strong>React</strong> and <strong>Java</strong> foundation, building web platforms for outsourcing clients in <strong>Singapore</strong> for 3+ years. I care about clear communication and close teamwork to ship a premium product.</p>
          <div className="about-stats">
            <div className="astat"><div className="astat-n">3+</div><div className="astat-l">Years in industry</div></div>
            <div className="astat"><div className="astat-n">1.5M+</div><div className="astat-l">Users served</div></div>
            <div className="astat"><div className="astat-n">3</div><div className="astat-l">Companies</div></div>
            <div className="astat"><div className="astat-n">20+</div><div className="astat-l">Events led</div></div>
          </div>
          <div className="about-now"><strong>Software Engineer</strong> at FPT Software (2022–present) · previously Full-stack Developer at Blackbook.ai · Teacher at MindX Technology School</div>
        </div>

        <div className="story-page rv">
          <p className="eyebrow">02 — Academic Journey</p>
          <h2 className="stitle">Still learning.<br />Still <em>growing.</em></h2>
          <div className="edu-list">
            {EDUCATION.map(e => (
              <div key={e.school} className="edu-item">
                <h3 className="edu-school">{e.school}</h3>
                <p className="edu-degree">{e.degree}</p>
                <p className="edu-dates">{e.dates}</p>
              </div>
            ))}
          </div>
        </div>

        {EXPERIENCE_PAGES.map(page => (
          <div key={page.kind === 'job' ? page.job.company : `${page.job.company}/${page.project.name}`} className="story-page rv" style={brandStyle(page.kind === 'job' ? page.job.brand : page.project.brand)}>
            <p className="eyebrow">03 — Experience</p>
            <h2 className="stitle">Where <em>experience</em><br />took shape.</h2>
            <ExpBody page={page} mobile />
          </div>
        ))}

        <div className="story-page rv">
          <p className="eyebrow">04 — Expertise</p>
          <h2 className="stitle">What I bring<br />to the <em>table.</em></h2>
          <div className="story-skills">
            {SKILL_GROUPS.map((g, i) => (
              <div key={i} className="sg-row">
                <div className="sg-head"><span className="sg-name">{g.name}</span></div>
                <div className="pills">
                  {g.core.map((p, j) => <span key={j} className="pill core">{p}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="story-page rv">
          <p className="eyebrow">05 — Mindset</p>
          <h2 className="stitle"><em>Never</em> quite<br /><em>satisfied.</em></h2>
          <blockquote className="big-q">&ldquo;Not because what I&apos;ve done isn&apos;t enough, <br />but because I know there&apos;s always more I can&nbsp;become.&rdquo;</blockquote>
          <div className="mvs-row">
            {['Learn fast, adapt under pressure', 'Automate the repetitive stuff', 'Clear communication, always', 'Teamwork over solo heroics'].map((t, i) => (
              <span key={i} className="mv-chip">{t}</span>
            ))}
          </div>
          <OwnBuild />
        </div>

        <div className="story-page rv">
          <p className="eyebrow">06 — Highlights</p>
          <h2 className="stitle">A few things<br />I&apos;m <em>proud of.</em></h2>
          <p className="story-placeholder">Coming soon.</p>
        </div>

        <div className="story-page rv">
          <p className="eyebrow">07 — Certifications</p>
          <h2 className="stitle">Learning, <em>validated.</em></h2>
          {CERTIFICATIONS.map(group => (
            <div key={group.category} className="cert-group">
              <div className="cert-group-label">{group.category}</div>
              {group.items.length > 0 ? (
                <div className="cert-grid">
                  {group.items.map(cert => (
                    <div key={cert.name} className="cert-card">
                      <div className="cert-head">
                        {cert.logo
                          ? <img className="cert-logo" src={cert.logo} alt="" />
                          : <div className="cert-logo cert-logo-text">{cert.issuer[0]}</div>}
                        <div className="cert-issuer">{cert.issuer}</div>
                      </div>
                      <h3 className="cert-name">{cert.name}</h3>
                      {(cert.issued || cert.credentialId) && (
                        <p className="cert-meta">{cert.issued}{cert.credentialId && ` · Credential ID ${cert.credentialId}`}</p>
                      )}
                      <a className="cert-link" href={cert.href}>View credential ↗</a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="story-placeholder">Coming soon.</p>
              )}
            </div>
          ))}
        </div>

        <div className="story-page rv">
          <p className="eyebrow">08 — Get in touch</p>
          <div className="cg-big">Let&apos;s <em>build</em> something <em>real.</em></div>
          <p className="cg-sub">Open to contract work and interesting problems. If what you&apos;re building matters, let&apos;s talk.</p>
          <div className="story-links">
            {CONTACT_LINKS.map((link, i) => (
              <a key={i} className="cl" href={link.href} {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <div className="cl-fill" />
                <div><span className="cl-l">{link.l}</span><span className="cl-v">{link.v}</span></div>
                <span className="cl-a">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>

    </>
  )
}
