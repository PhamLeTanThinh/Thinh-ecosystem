'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getPartsByScene, getSceneBySlug, getWord } from '@/lib/vitrine/queries'
import { useVitrineStore } from '@/lib/vitrine/store'
import type { HotspotScreenPosition, ModelStatus } from '../Scene3DCanvas'
import { HotspotDot } from '../HotspotDot'
import { LeaderLine } from '../LeaderLine'
import { VocabLabel } from '../VocabLabel'
import { ExitButton } from '../ExitButton'
import { LanguageSwitcher } from '../LanguageSwitcher'

interface LearningSceneProps {
  topicSlug: string
  sceneSlug: string
}

const CHIP_WIDTH = 190
const SIDE_MARGIN = 100
const TOP_MARGIN = 200
const BOTTOM_MARGIN = 160

// three.js + GLTFLoader + OrbitControls là bundle nặng — tách khỏi chunk chính của
// route để nó không cạnh tranh main thread với animation chuyển trang (đây là một
// trong 2 nguyên nhân gây giật khi mới điều hướng vào; xem PageTransition.tsx cho
// nguyên nhân còn lại).
const Scene3DCanvas = dynamic(() => import('../Scene3DCanvas').then((m) => m.Scene3DCanvas), { ssr: false })

// Vị trí đặt nhãn ở mép màn hình — khác với `part.anchor` (vị trí hotspot TRÊN model,
// xem types.ts), đây chỉ là layout của thẻ từ vựng.
interface ChipAnchor {
  x: number
  y: number
  side: 'left' | 'right'
}

export function LearningSceneScreen({ topicSlug, sceneSlug }: LearningSceneProps) {
  // Tra dữ liệu trước, nhưng gọi notFound() SAU khi mọi hook đã chạy (bên dưới) — vì
  // notFound() throw, gọi sớm sẽ khiến số hook giữa các lần render không nhất quán.
  const scene = getSceneBySlug(topicSlug, sceneSlug)
  const parts = scene ? getPartsByScene(scene.id) : []
  const language = useVitrineStore((s) => s.language)
  const learnedPartIds = useVitrineStore((s) => s.learnedPartIds)
  const toggleLearned = useVitrineStore((s) => s.toggleLearned)

  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 1280, height: 800 })
  const [modelStatus, setModelStatus] = useState<ModelStatus>('loading')
  const [mountCanvas, setMountCanvas] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Dựng WebGLRenderer + camera + controls ngay khi mount làm tốn main-thread đúng lúc
  // PageTransition đang chạy fade-in (~280ms) -> giật khung hình. Đợi transition ổn định
  // rồi mới mount canvas — trong lúc đó vẫn hiện chữ "Đang tải mô hình…" nên không thấy trống.
  useEffect(() => {
    const t = window.setTimeout(() => setMountCanvas(true), 300)
    return () => window.clearTimeout(t)
  }, [])

  const half = Math.ceil(parts.length / 2)
  const leftParts = parts.slice(0, half)
  const rightParts = parts.slice(half)

  function slotY(index: number, count: number) {
    if (count <= 1) return size.height / 2
    const usable = Math.max(size.height - TOP_MARGIN - BOTTOM_MARGIN, 0)
    return TOP_MARGIN + (usable / (count - 1)) * index
  }

  // Toạ độ neo của nhãn (đầu ngoài của leader-line) — tính lại mỗi render theo `size`,
  // không cần giữ qua các frame nên không đưa vào ref như `refsRef` bên dưới.
  const chipAnchors = new Map<string, ChipAnchor>()
  leftParts.forEach((p, i) => chipAnchors.set(p.id, { x: SIDE_MARGIN + CHIP_WIDTH, y: slotY(i, leftParts.length), side: 'left' }))
  rightParts.forEach((p, i) => chipAnchors.set(p.id, { x: size.width - SIDE_MARGIN - CHIP_WIDTH, y: slotY(i, rightParts.length), side: 'right' }))

  const refsRef = useRef(new Map<string, { dot: SVGGElement | null; line: SVGLineElement | null }>())

  const handleHotspotUpdate = useCallback((positions: Map<string, HotspotScreenPosition>) => {
    for (const [partId, pos] of positions) {
      const entry = refsRef.current.get(partId)
      if (!entry) continue
      const opacity = pos.visible ? '1' : '0'
      if (entry.dot) {
        entry.dot.setAttribute('transform', `translate(${pos.x},${pos.y})`)
        entry.dot.style.opacity = opacity
      }
      if (entry.line) {
        entry.line.setAttribute('x1', String(pos.x))
        entry.line.setAttribute('y1', String(pos.y))
        entry.line.style.opacity = opacity
      }
    }
  }, [])

  if (!scene) notFound()

  const ready = modelStatus === 'ready'

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: 'var(--color-vt-bg)',
        backgroundImage:
          'radial-gradient(ellipse 920px 640px at 50% 56%, #FFFFFF 0%, var(--color-vt-bg) 55%, var(--color-vt-bg-deep) 100%),' +
          'radial-gradient(ellipse 700px 500px at 4% 100%, rgba(13,156,120,0.14), transparent 60%),' +
          'radial-gradient(ellipse 620px 460px at 98% 0%, rgba(201,162,39,0.13), transparent 60%)',
      }}
    >
      {mountCanvas && (
        <Scene3DCanvas key={scene.id} model={scene.model} parts={parts} onHotspotUpdate={handleHotspotUpdate} onStatusChange={setModelStatus} />
      )}

      {modelStatus === 'loading' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--color-vt-ink-soft)' }}>
          Đang tải mô hình…
        </div>
      )}

      {modelStatus === 'error' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 24,
          }}
        >
          <div style={{ fontSize: 14, color: 'var(--color-vt-ink-soft)' }}>Chưa có model 3D cho cảnh này.</div>
          <code style={{ fontSize: 12, color: 'var(--color-vt-ink-faint)', background: 'var(--color-vt-surface)', padding: '6px 12px', borderRadius: 8 }}>
            public{scene.model.url}
          </code>
        </div>
      )}

      {ready && (
        <>
          <svg width={size.width} height={size.height} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {parts.map((part) => {
              const chipAnchor = chipAnchors.get(part.id)
              if (!chipAnchor) return null
              return (
                <LeaderLine
                  key={part.id}
                  ref={(el) => {
                    const entry = refsRef.current.get(part.id) ?? { dot: null, line: null }
                    entry.line = el
                    refsRef.current.set(part.id, entry)
                  }}
                  toX={chipAnchor.x}
                  toY={chipAnchor.y}
                />
              )
            })}
            {parts.map((part) => (
              <HotspotDot
                key={part.id}
                ref={(el) => {
                  const entry = refsRef.current.get(part.id) ?? { dot: null, line: null }
                  entry.dot = el
                  refsRef.current.set(part.id, entry)
                }}
              />
            ))}
          </svg>

          {parts.map((part) => {
            const chipAnchor = chipAnchors.get(part.id)
            if (!chipAnchor) return null
            const style =
              chipAnchor.side === 'left'
                ? { left: SIDE_MARGIN, top: chipAnchor.y - 22 }
                : { right: SIDE_MARGIN, top: chipAnchor.y - 22 }
            return (
              <VocabLabel
                key={part.id}
                word={getWord(part.id, language)}
                language={language}
                side={chipAnchor.side}
                learned={learnedPartIds.has(part.id)}
                onClick={() => toggleLearned(part.id)}
                style={style}
              />
            )
          })}
        </>
      )}

      <ExitButton href={`/vitrine/topics/${topicSlug}`} />
      <LanguageSwitcher />
    </div>
  )
}
