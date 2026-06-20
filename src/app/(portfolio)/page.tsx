'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import './portfolio.css'

export default function PortfolioPage() {
  useEffect(() => {
    /* ── GRAIN ── */
    const canvas = document.getElementById('grain') as HTMLCanvasElement
    const ctx = canvas?.getContext('2d')
    let W = 0, H = 0, rafId: number

    function resize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    function drawGrain() {
      if (!ctx) return
      const img = ctx.createImageData(W, H)
      const buf = new Uint32Array(img.data.buffer)
      for (let i = 0; i < buf.length; i++) {
        const n = (((Math.random() + Math.random()) * 0.5) * 255) | 0
        buf[i] = (255 << 24) | (n << 16) | (n << 8) | n
      }
      ctx.putImageData(img, 0, 0)
      rafId = requestAnimationFrame(drawGrain)
    }
    if (canvas) {
      resize()
      window.addEventListener('resize', resize, { passive: true })
      drawGrain()
      let op = 0
      const fadeIn = () => {
        op = Math.min(op + 0.004, 0.05)
        canvas.style.opacity = String(op)
        if (op < 0.05) requestAnimationFrame(fadeIn)
      }
      fadeIn()
    }

    /* ── CURSOR ── */
    const dot = document.getElementById('cd')
    const ring = document.getElementById('cr')
    let mx = 0, my = 0, rx = 0, ry = 0
    const onMouseMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    document.querySelectorAll<HTMLElement>('a,button,.pcard,.pcard2,.astat,.crow,.mv').forEach(el => {
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

    /* ── NAV + PARALLAX ── */
    const nav = document.getElementById('nav')
    const ghost = document.getElementById('hg')
    const secs = ['home', 'about', 'projects', 'skills', 'mindset', 'contact']
    const dots = document.querySelectorAll('.ndot')

    const onScroll = () => {
      const sy = window.scrollY
      nav?.classList.toggle('s', sy > 40)
      if (ghost) ghost.style.transform = `translate(-50%,calc(-46% + ${sy * 0.15}px))`
      let cur = 0
      secs.forEach((id, i) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.55) cur = i
      })
      dots.forEach((d, i) => d.classList.toggle('a', i === cur))
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    /* ── SCROLL REVEAL ── */
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target) }
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.rv,.rl').forEach(el => io.observe(el))

    /* ── SCATTERED PARALLAX ── */
    const boxes = document.querySelectorAll<HTMLElement>('.sc-box')
    const offsets = [-0.06, -0.03, 0.04, 0.07]
    const onScrollScatter = () => {
      const sy = window.scrollY
      boxes.forEach((b, i) => { b.style.transform = `translateY(${sy * offsets[i]}px)` })
    }
    window.addEventListener('scroll', onScrollScatter, { passive: true })

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
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onScrollScatter)
      io.disconnect()
    }
  }, [])

  return (
    <>
      <canvas id="grain" />
      <div className="cur" id="cd"><div className="cur-d" /></div>
      <div className="cur-r" id="cr" />

      {/* NAV */}
      <header className="nav" id="nav">
        <a href="#home" className="logo">Thinh<b>Pham Le Tan</b></a>
        <div className="nav-r">
          <nav className="nav-dot-wrap" id="ndots">
            <a href="#home" className="ndot a" title="Home" />
            <a href="#about" className="ndot" title="About" />
            <a href="#projects" className="ndot" title="Projects" />
            <a href="#skills" className="ndot" title="Skills" />
            <a href="#mindset" className="ndot" title="Mindset" />
            <a href="#contact" className="ndot" title="Contact" />
          </nav>
          <div className="status"><span className="pulse" />Open to work</div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-ghost" id="hg">Engineer</div>
        <div className="hero-img-frame">
          <Image
            className="hero-img"
            src="/avatar.png"
            alt="Thinh Pham Le Tan"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            priority
          />
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow">Senior Frontend Engineer · Project Manager · Ho Chi Minh City</p>
          <h1 className="hero-name">
            <span className="fn">Thinh</span>
            <span className="ln">Pham Le</span>
            <span className="ln2">Tan</span>
          </h1>
        </div>
      </section>

      {/* SCATTERED */}
      <div className="scattered" id="scattered">
        <div className="sc-box"><div className="sc-box-inner">Work</div></div>
        <div className="sc-box"><div className="sc-box-inner">Code</div></div>
        <div className="sc-box"><div className="sc-box-inner">Design</div></div>
        <div className="sc-box"><div className="sc-box-inner">Ship</div></div>
        <div className="sc-label">In Good<br /><em>Company.</em></div>
      </div>

      {/* ABOUT */}
      <section id="about" style={{ paddingTop: '10rem' }}>
        <p className="eyebrow">01 — About me</p>
        <div className="rv"><h2 className="stitle">Seven years of<br /><em>deliberate</em> craft.</h2></div>
        <div className="rl" style={{ marginTop: '1.5rem' }} />
        <div className="about-layout">
          <div className="about-photo-col rv" style={{ transitionDelay: '.08s' }}>
            <div className="about-photo-bg" />
            <Image className="about-photo" src="/avatar.png" alt="Thinh Pham Le Tan" width={400} height={533} />
            <div className="about-photo-caption">Thinh Pham Le Tan · HCMC</div>
          </div>
          <div className="rv" style={{ transitionDelay: '.16s' }}>
            <div className="about-body">
              <p>I&apos;m <strong>Thinh</strong> — a Senior Frontend Engineer and Project Manager who has spent seven years bridging the gap between <strong>design intent</strong> and <strong>engineering reality</strong>. From 3-person founding teams to orgs of 200+.</p>
              <p>My edge is building <strong>design systems and component libraries</strong> that scale across products — while keeping teams aligned, roadmaps clear, and delivery predictable.</p>
              <p>Now transitioning deeper into <strong>Product Management</strong> — combining hands-on technical depth with strategic thinking to own outcomes, not just outputs.</p>
            </div>
            <div className="about-stats">
              <div className="astat"><div className="astat-n">7+</div><div className="astat-l">Years in industry</div></div>
              <div className="astat"><div className="astat-n">32</div><div className="astat-l">Products shipped</div></div>
              <div className="astat"><div className="astat-n">4</div><div className="astat-l">Design systems</div></div>
              <div className="astat"><div className="astat-n">3+</div><div className="astat-l">Teams led</div></div>
            </div>
            <div className="tl">
              <div className="tl-item"><span className="tl-year">2022–</span><div><div className="tl-role">Senior Frontend Engineer · Project Manager</div><div className="tl-co">Axon Technologies · HCMC</div></div></div>
              <div className="tl-item"><span className="tl-year">2020</span><div><div className="tl-role">Frontend Engineer II</div><div className="tl-co">Teko Vietnam · Remote</div></div></div>
              <div className="tl-item"><span className="tl-year">2018</span><div><div className="tl-role">UI Engineer</div><div className="tl-co">Fossil Group · Da Nang</div></div></div>
              <div className="tl-item"><span className="tl-year">2017</span><div><div className="tl-role">Junior Frontend Dev</div><div className="tl-co">KMS Technology · HCMC</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="proj-header">
          <div className="rv"><h2 className="stitle">Things I&apos;ve shipped<br />that <em>matter.</em></h2></div>
          <div className="rv" style={{ transitionDelay: '.1s' }}>
            <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>02 — Selected work</p>
            <p className="proj-intro">From design systems powering millions to AI dashboards cutting load times by 10×. Each project started with a hard problem and ended with something real.</p>
          </div>
        </div>
        <div className="proj-featured rv">
          <div className="pf-visual">
            <div className="pf-visual-text">Axon DS</div>
            <div className="pf-visual-tag">Featured · Design System · 2022–present</div>
          </div>
          <div className="pf-body">
            <div>
              <p className="pf-eyebrow">Case study · Axon Technologies</p>
              <h3 className="pf-name">Axon Design<br /><em>System</em></h3>
              <p className="pf-desc">A headless component library powering 6 products. Token-based theming, zero-dependency core, accessibility-first. Reduced UI inconsistency by 80%.</p>
              <div className="pf-metrics">
                <div className="pf-m"><span>140+</span><span>Components</span></div>
                <div className="pf-m"><span>6</span><span>Products</span></div>
                <div className="pf-m"><span>4.2k</span><span>Weekly devs</span></div>
              </div>
            </div>
            <a className="pf-link" href="#">View case study ↗</a>
          </div>
        </div>
        <div className="proj-pastel-grid">
          {[
            { num: '01', name: 'Teko Commerce', desc: 'B2B e-commerce for 3,000+ retailers · MFE', chips: ['React', 'GraphQL', 'MFE'] },
            { num: '02', name: 'AI Dashboard', desc: 'GPT-4 insights · 50k MAU · 3s→0.4s load', chips: ['Next.js', 'OpenAI', 'D3'] },
            { num: '03', name: 'Fossil SmartWatch', desc: 'Companion PWA · 2M+ downloads ecosystem', chips: ['React', 'Web BLE', 'PWA'] },
          ].map((p, i) => (
            <div key={i} className="pcard rv" style={{ transitionDelay: `${0.05 + i * 0.05}s` }}>
              <span className="pcard-arr">↗</span>
              <div className="pcard-num">{p.num}</div>
              <div>
                <div className="pcard-name">{p.name}</div>
                <div className="pcard-desc">{p.desc}</div>
                <div className="pcard-chips">{p.chips.map((c, j) => <span key={j} className="pchip">{c}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="proj-pastel-2">
          <div className="pcard2 rv" style={{ transitionDelay: '.2s' }}>
            <span className="pcard2-arr">↗</span>
            <div className="pcard2-num">04</div>
            <div>
              <div className="pcard2-name">Internal Dev Tooling</div>
              <div className="pcard2-desc">CLI + VS Code extension · 60+ devs daily</div>
              <div className="pcard-chips" style={{ marginTop: '.5rem' }}><span className="pchip">Node.js</span><span className="pchip">VSCode API</span></div>
            </div>
          </div>
          <div className="pcard2 rv" style={{ transitionDelay: '.25s' }}>
            <span className="pcard2-arr">↗</span>
            <div className="pcard2-num">05</div>
            <div>
              <div className="pcard2-name">KMS Onboarding Flow</div>
              <div className="pcard2-desc">Drop-off reduced 34% · A/B tested · WCAG 2.1</div>
              <div className="pcard-chips" style={{ marginTop: '.5rem' }}><span className="pchip">React</span><span className="pchip">Analytics</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <p className="eyebrow">03 — Technical skills</p>
        <div className="rv"><h2 className="stitle">Tools I trust to do<br /><em>serious</em> work.</h2></div>
        <div className="skills-layout">
          <div className="rv" style={{ transitionDelay: '.08s' }}>
            <div className="skills-intro">
              <p>I go deep on tools that matter — and know when to stop adding complexity.</p>
              <p>Core in <strong>React ecosystem</strong> and <strong>Java backend</strong>. Strong views on TypeScript, performance, and accessibility.</p>
              <p>Expanding into <strong>LLM integration</strong> and AI-powered UI patterns.</p>
            </div>
          </div>
          <div className="rv" style={{ transitionDelay: '.14s' }}>
            {[
              { name: 'Frontend core', cnt: '12', pills: ['React 18+', 'TypeScript', 'Next.js 14', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'React Query', 'Radix UI', 'Storybook', 'Playwright', 'CSS Modules'], core: ['React 18+', 'TypeScript', 'Next.js 14'] },
              { name: 'Backend & infra', cnt: '8', pills: ['Java 17+', 'Spring Boot 3', 'JPA / Hibernate', 'REST / OpenAPI', 'GraphQL', 'PostgreSQL', 'Redis', 'Docker'], core: ['Java 17+', 'Spring Boot 3'] },
              { name: 'AI & emerging', cnt: '6', pills: ['Prompt Engineering', 'OpenAI API', 'LangChain', 'Vercel AI SDK', 'Pinecone', 'Claude API'], core: ['Prompt Engineering', 'OpenAI API'] },
              { name: 'Craft & process', cnt: '6', pills: ['Figma', 'GitHub Actions', 'DataDog', 'Sentry', 'Linear', 'Notion'], core: [] },
            ].map((g, i) => (
              <div key={i} className="sg">
                <div className="sg-head"><span className="sg-name">{g.name}</span><span className="sg-cnt">{g.cnt} tools</span></div>
                <div className="pills">
                  {g.pills.map((p, j) => <span key={j} className={`pill${g.core.includes(p) ? ' core' : ''}`}>{p}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MINDSET */}
      <section id="mindset">
        <p className="eyebrow">04 — Mindset & Credentials</p>
        <div className="rv"><h2 className="stitle">How I think<br />about <em>building.</em></h2></div>
        <div className="mind-layout">
          <div className="rv" style={{ transitionDelay: '.08s' }}>
            <blockquote className="big-q">&ldquo;I don&apos;t write code to impress engineers. I write it so the person using the product never has to think about the technology beneath it.&rdquo;</blockquote>
            <div className="mvs">
              {[
                { t: 'Accessibility is not optional', d: 'Every component ships with ARIA, keyboard nav, and screen-reader testing. Baseline, not feature.' },
                { t: 'Performance is a design constraint', d: 'Bundle size, Core Web Vitals, and perceived performance tracked from day one.' },
                { t: 'Design and engineering speak one language', d: 'I work deep in Figma alongside designers before code is written.' },
                { t: 'Ship, learn, iterate', d: 'A well-observed 70% shipped today beats a theoretical 100% that never ships.' },
              ].map((m, i) => (
                <div key={i} className="mv"><div className="mv-t">{m.t}</div><div className="mv-d">{m.d}</div></div>
              ))}
            </div>
          </div>
          <div className="rv" style={{ transitionDelay: '.16s' }}>
            <p className="cert-t">Certifications & Learning</p>
            {[
              { badge: 'PSM1', name: 'Professional Scrum Master I', by: 'Scrum.org', yr: '2024' },
              { badge: 'AWS', name: 'AWS Certified Developer – Associate', by: 'Amazon Web Services', yr: '2024' },
              { badge: 'CKAD', name: 'Certified Kubernetes App Developer', by: 'CNCF', yr: '2023' },
              { badge: 'FEM', name: 'Complete React v18 — Advanced Patterns', by: 'Frontend Masters', yr: '2023' },
              { badge: 'DL', name: 'AI Engineering for Developers', by: 'DeepLearning.AI', yr: '2024' },
              { badge: 'OCA', name: 'Oracle Certified Associate Java SE 17', by: 'Oracle', yr: '2022' },
              { badge: 'WAS', name: 'Web Accessibility Specialist', by: 'IAAP', yr: '2023' },
            ].map((c, i) => (
              <div key={i} className="crow">
                <div className="cbadge">{c.badge}</div>
                <div><div className="cname">{c.name}</div><div className="cby">{c.by}</div></div>
                <div className="cyr">{c.yr}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <p className="eyebrow">05 — Get in touch</p>
        <div className="contact-layout">
          <div className="rv">
            <div className="cg-big">Let&apos;s<br /><em>build</em><br />something<br /><em>real.</em></div>
            <p className="cg-sub">Open to senior roles, contract work, and interesting problems. If what you&apos;re building matters, let&apos;s talk.</p>
          </div>
          <div className="rv" style={{ transitionDelay: '.14s' }}>
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
      </section>

      <footer>
        <span>© 2025 Thinh Pham Le Tan</span>
        <span>Designed & built with intention · HCMC</span>
      </footer>
    </>
  )
}
