'use client'

import { useEffect, useRef, useState } from 'react'
import type { PDFDocumentProxy, TextLayer } from 'pdfjs-dist'
import type { ResearchPaper } from '@/lib/it/papers'
import './paper-reader.css'

// Đọc paper 2 cột: trái là PDF render bằng pdf.js (để JS điều khiển được scroll theo trang —
// iframe PDF viewer gốc của trình duyệt không cho làm việc này), phải là highlight/thuật ngữ.
// Hover 1 mục bên phải => cuộn PDF tới đúng trang (section.page). Cuộn PDF tự nhiên => mục bên
// phải tương ứng cũng tự sáng lên, để biết đang đọc tới phần nào.
// Ghi chú quan trọng: paper.pdfUrl phải trỏ tới route API dạng "/api/papers/<slug>" (KHÔNG có
// đuôi .pdf trong URL) — một số trình quản lý tải xuống (IDM, Free Download Manager...) chộp
// request theo đuôi file trong URL, bất kể request đó do JS tự fetch ngầm hay do người dùng bấm.
// Xem thêm src/app/api/papers/[slug]/route.ts.
async function fetchPdfBytes(url: string, attempts = 3): Promise<ArrayBuffer> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { cache: 'force-cache' })
      if (res.status !== 200) throw new Error(`Server trả về HTTP ${res.status}`)
      const data = await res.arrayBuffer()
      if (data.byteLength === 0) throw new Error('Nhận về file rỗng')
      return data
    } catch (err) {
      lastErr = err
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 400 * (i + 1)))
    }
  }
  throw lastErr
}

export function PaperReader({ paper }: { paper: ResearchPaper }) {
  const sections = paper.highlights ?? []
  const hasHighlights = sections.length > 0
  const hasPdf = !!paper.pdfUrl

  const scrollRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef(new Map<number, HTMLDivElement>())
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [activePage, setActivePage] = useState(1)
  // Mục highlight đang active — set trực tiếp khi bấm 1 card (không suy ra lại từ trang), vì 2 phần
  // có thể trỏ cùng 1 trang (vd "Methods" và "Outcome measurement" cùng ở trang 4) — nếu chỉ dựa vào
  // "trang hiện tại" thì sẽ luôn active nhầm sang mục đứng sau trong danh sách.
  const [activeIdx, setActiveIdx] = useState(-1)
  const [pdfError, setPdfError] = useState<string | null>(null)
  // Chặn fetch trùng file PDF (4.7MB) khi React Strict Mode chạy effect 2 lần ở dev.
  const loadedUrl = useRef<string | null>(null)
  // scrollTo({behavior:'smooth'}) bắn nhiều sự kiện 'scroll' suốt lúc đang cuộn — nếu để listener
  // cuộn-tự-nhiên suy ra lại activeIdx theo trang NGAY trong lúc đó, nó sẽ ghi đè mất lựa chọn vừa
  // bấm khi cuộn ngang qua 1 trang có 2 mục highlight trùng nhau. 2 ref này dùng để chặn việc suy
  // luận lại trong ít lâu sau khi bấm, xem scrollToPage() bên dưới.
  const suppressScrollSync = useRef(false)
  const suppressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // 1) Load file PDF — chỉ fetch đúng 1 lần, dùng chung cho cả việc lấy numPages lẫn render.
  useEffect(() => {
    if (!hasPdf || loadedUrl.current === paper.pdfUrl) return
    loadedUrl.current = paper.pdfUrl!
    let cancelled = false

    ;(async () => {
      try {
        // Tự fetch nguyên file (có retry) rồi đưa data cho pdf.js, thay vì để pdf.js tự fetch
        // theo URL — pdf.js tự làm range-request trong Worker riêng, khó retry khi mạng chập chờn.
        const data = await fetchPdfBytes(paper.pdfUrl!)
        if (cancelled) return

        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
        const doc = await pdfjsLib.getDocument({ data }).promise
        if (cancelled) {
          doc.destroy()
          return
        }
        setPdfDoc(doc)
        setNumPages(doc.numPages)
      } catch (err) {
        console.error('Không tải được PDF', err)
        if (!cancelled) setPdfError('Không tải được PDF để hiển thị tại đây.')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [hasPdf, paper.pdfUrl])

  // 2) Đã có doc + đã render đủ khung <canvas> (theo numPages) => vẽ từng trang vào canvas tương ứng.
  // Vẽ lại mỗi khi khung nhìn đổi kích thước (bật/tắt chế độ tập trung, resize cửa sổ...) để canvas
  // luôn khớp scale mới — không thì trang PDF bị trống/lệch cỡ khi cột PDF đổi bề rộng.
  useEffect(() => {
    if (!pdfDoc || numPages === 0) return
    const container = scrollRef.current
    if (!container) return

    let cancelled = false
    // pdf.js không cho render() 2 lần chồng nhau lên cùng 1 canvas — theo dõi task đang chạy của
    // từng trang để huỷ (cancel) trước khi render lại với scale mới.
    const activeTasks = new Map<number, { cancel: () => void }>()
    const activeTextLayers = new Map<number, TextLayer>()

    const renderAll = async () => {
      const containerWidth = container.clientWidth
      const dpr = window.devicePixelRatio || 1
      const pdfjsLib = await import('pdfjs-dist')

      for (let n = 1; n <= numPages; n++) {
        if (cancelled) return
        const wrapper = pageRefs.current.get(n)
        const canvas = wrapper?.querySelector('canvas')
        const textLayerDiv = wrapper?.querySelector<HTMLDivElement>('.textLayer')
        if (!wrapper || !canvas) continue

        activeTasks.get(n)?.cancel()
        activeTextLayers.get(n)?.cancel()

        const page = await pdfDoc.getPage(n)
        const baseViewport = page.getViewport({ scale: 1 })
        const scale = (containerWidth - 32) / baseViewport.width
        const viewport = page.getViewport({ scale })

        canvas.width = Math.floor(viewport.width * dpr)
        canvas.height = Math.floor(viewport.height * dpr)
        canvas.style.width = `${viewport.width}px`
        canvas.style.height = `${viewport.height}px`

        const ctx = canvas.getContext('2d')
        if (!ctx) continue
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        if (cancelled) return

        const task = page.render({ canvasContext: ctx, viewport })
        activeTasks.set(n, task)
        try {
          await task.promise
        } catch {
          // Bị cancel bởi 1 lượt render mới hơn (resize dồn dập) — bỏ qua.
        }

        // Text layer — lớp text trong suốt đè khớp lên canvas, để bôi đen/copy được chữ thật của
        // PDF (canvas chỉ là ảnh pixel, tự nó không có text để chọn).
        if (textLayerDiv && !cancelled) {
          textLayerDiv.replaceChildren()
          textLayerDiv.style.setProperty('--scale-factor', String(viewport.scale))
          const textLayer = new pdfjsLib.TextLayer({ textContentSource: page.streamTextContent(), container: textLayerDiv, viewport })
          activeTextLayers.set(n, textLayer)
          try {
            await textLayer.render()
          } catch {
            // Bị cancel bởi 1 lượt render mới hơn — bỏ qua.
          }
        }
      }
    }

    // ResizeObserver tự bắn 1 lần ngay khi observe() (theo spec) — dùng chính lần đó để render lần
    // đầu, tránh gọi renderAll() 2 lần gần như đồng thời (gây race, canvas bị trống).
    let isFirstFire = true
    let resizeTimer: ReturnType<typeof setTimeout>
    const observer = new ResizeObserver(() => {
      if (isFirstFire) {
        isFirstFire = false
        renderAll()
        return
      }
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(renderAll, 150)
    })
    observer.observe(container)

    return () => {
      cancelled = true
      clearTimeout(resizeTimer)
      observer.disconnect()
      for (const task of activeTasks.values()) task.cancel()
      for (const textLayer of activeTextLayers.values()) textLayer.cancel()
    }
  }, [pdfDoc, numPages])

  // Luôn trỏ tới doc mới nhất, để cleanup lúc unmount thật sự giải phóng đúng document.
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null)
  useEffect(() => {
    pdfDocRef.current = pdfDoc
  }, [pdfDoc])

  useEffect(() => {
    return () => {
      pdfDocRef.current?.destroy()
      clearTimeout(suppressTimer.current)
    }
  }, [])

  // 3) Cuộn PDF tự nhiên => cập nhật activePage + suy ra mục highlight tương ứng (bám theo trang,
  // chấp nhận có thể lệch nếu 2 mục trùng trang — đây chỉ là fallback cho việc tự cuộn PDF).
  useEffect(() => {
    const container = scrollRef.current
    if (!container || numPages === 0) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const top = container.scrollTop + 24
        let current = 1
        for (const [n, el] of pageRefs.current) {
          if (el.offsetTop <= top) current = Math.max(current, n)
        }
        setActivePage(current)
        if (!suppressScrollSync.current) {
          setActiveIdx(sections.reduce((acc, s, i) => (typeof s.page === 'number' && s.page <= current ? i : acc), -1))
        }
      })
    }

    container.addEventListener('scroll', onScroll)
    return () => {
      container.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numPages])

  // Bấm 1 card => cuộn PDF tới đúng trang VÀ active đúng card đó (không suy luận lại từ trang, tránh
  // active nhầm sang mục khác cùng trang). Chặn suy luận lại tới khi animation scroll DỪNG HẲN
  // (sự kiện 'scrollend') — dùng timeout cố định dễ bị hết hạn sớm hơn animation thực tế khi cuộn xa
  // (vd từ trang 1 nhảy tới trang 6), khiến sự kiện scroll cuối của animation ghi đè nhầm lựa chọn.
  const scrollToPage = (page: number, idx: number) => {
    const el = pageRefs.current.get(page)
    const container = scrollRef.current
    if (!el || !container) return

    suppressScrollSync.current = true
    clearTimeout(suppressTimer.current)
    let released = false
    const release = () => {
      if (released) return
      released = true
      suppressScrollSync.current = false
      container.removeEventListener('scrollend', release)
    }
    container.addEventListener('scrollend', release, { once: true })
    // Lưới an toàn nếu trình duyệt không hỗ trợ 'scrollend' (hoặc nó không bắn vì lý do gì đó).
    suppressTimer.current = setTimeout(release, 1800)

    container.scrollTo({ top: el.offsetTop - 12, behavior: 'smooth' })
    setActivePage(page)
    setActiveIdx(idx)
  }

  // Chế độ tập trung — 2 cột chiếm toàn màn hình, ẩn hết phần khác của trang (header, tóm tắt...).
  const [isFocus, setIsFocus] = useState(false)
  useEffect(() => {
    if (!isFocus) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isFocus])
  useEffect(() => {
    if (!isFocus) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFocus(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isFocus])


  if (!hasHighlights && !hasPdf) return null

  // Focus mode: <section> chỉ cần h-full vì <div className="grid"> cha đã bị ép chiều cao qua
  // flex-1 + min-h-0 trong 1 container flex-col full màn hình. Chế độ thường: dùng calc cố định
  // (trừ khoảng breadcrumb/header phía trên) + sticky để cột PDF luôn theo kịp khi cuộn trang.
  const paneHeightClass = isFocus ? 'h-full' : 'lg:h-[calc(100vh-8rem)]'

  const grid = (
    <div className={`grid gap-6 lg:grid-cols-2 lg:items-start ${isFocus ? 'h-full min-h-0 flex-1' : 'mt-4 flex-1'}`}>
      {/* Cột trái — đọc full PDF */}
      <section className={`flex min-h-[70vh] flex-col overflow-hidden rounded-card border border-border bg-card ${isFocus ? paneHeightClass : `lg:sticky lg:top-6 ${paneHeightClass}`}`}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-bold">
            📄 Đọc PDF {numPages > 0 && <span className="font-normal text-muted">· trang {activePage}/{numPages}</span>}
          </span>
          {paper.pdfUrl && (
            <a href={paper.pdfUrl} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
              Mở tab mới ↗
            </a>
          )}
        </div>

        {!hasPdf ? (
          <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted">Chưa có link PDF cho paper này.</div>
        ) : pdfError ? (
          <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted">{pdfError}</div>
        ) : (
          <div ref={scrollRef} className="reader-scroll flex-1 overflow-y-auto bg-neutral-100 p-4">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
              <div
                key={n}
                ref={(el) => {
                  if (el) pageRefs.current.set(n, el)
                  else pageRefs.current.delete(n)
                }}
                data-page={n}
                className={`mx-auto mb-4 flex justify-center overflow-hidden rounded-lg shadow-sm transition-shadow last:mb-0 ${
                  n === activePage ? 'ring-2 ring-accent' : ''
                }`}
              >
                <div className="relative">
                  <canvas className="block" />
                  <div className="textLayer" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cột phải — highlight kĩ thuật, thuật ngữ, ý nghĩa từng phần. Bấm 1 mục để cuộn PDF tới trang tương ứng. */}
      <section className={`reader-scroll flex flex-col gap-4 overflow-y-auto pr-1 ${paneHeightClass}`}>
        {hasHighlights ? (
          sections.map((section, i) => (
            <button
              key={section.heading}
              type="button"
              onClick={() => typeof section.page === 'number' && scrollToPage(section.page, i)}
              className={`select-text rounded-card border-2 bg-card p-4 text-left transition-all ${
                typeof section.page === 'number' ? 'cursor-pointer hover:border-accent/60' : 'cursor-default'
              } ${i === activeIdx ? 'border-accent shadow-[0_0_16px_-4px_var(--color-accent)]' : 'border-border'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className={`text-sm font-bold ${i === activeIdx ? 'text-accent' : 'text-accent/80'}`}>{section.heading}</h2>
                {typeof section.page === 'number' && (
                  <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted">Trang {section.page}</span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{section.explanation}</p>
              {section.terms?.length ? (
                <dl className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                  {section.terms.map((t) => (
                    <div key={t.term}>
                      <dt className="text-sm font-semibold">{t.term}</dt>
                      <dd className="mt-0.5 text-xs leading-relaxed text-muted">{t.explain}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </button>
          ))
        ) : (
          <div className="rounded-card border border-border bg-card p-6 text-center text-sm text-muted">Chưa có ghi chú highlight cho paper này.</div>
        )}
      </section>
    </div>
  )

  // Dùng display:contents khi KHÔNG ở focus mode để wrapper này không ảnh hưởng layout của trang
  // cha, nhưng vẫn giữ nguyên vị trí cây DOM của {grid} — nếu return 2 nhánh JSX với cấu trúc cha
  // khác nhau (fixed overlay vs Fragment), React sẽ unmount rồi mount lại canvas, làm mất nội dung
  // đã vẽ (và effect gắn ResizeObserver theo scrollRef cũ cũng không còn tác dụng trên node mới).
  return (
    <div className={isFocus ? 'fixed inset-0 z-50 flex flex-col bg-bg p-4 md:p-6' : 'contents'}>
      <div className={isFocus ? 'mb-3 flex items-center justify-between' : 'mt-6 flex items-center justify-between'}>
        {isFocus ? (
          <span className="truncate rounded-full bg-card px-3.5 py-1.5 text-sm font-bold">{paper.title}</span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => setIsFocus((v) => !v)}
          className="shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        >
          {isFocus ? '✕ Thoát chế độ tập trung' : '⛶ Chế độ tập trung'}
        </button>
      </div>
      {grid}
    </div>
  )
}
