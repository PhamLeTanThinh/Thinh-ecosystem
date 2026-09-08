'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { Part, SceneModel } from '@/lib/vitrine/types'

export interface HotspotScreenPosition {
  x: number
  y: number
  visible: boolean
}

export type ModelStatus = 'loading' | 'ready' | 'error'

interface Scene3DCanvasProps {
  model: SceneModel
  parts: Part[]
  // Gọi mỗi frame với toạ độ màn hình đã chiếu của từng hotspot — component cha tự
  // cập nhật DOM (SVG line/dot) một cách imperative để tránh setState 60 lần/giây.
  onHotspotUpdate: (positions: Map<string, HotspotScreenPosition>) => void
  onStatusChange: (status: ModelStatus) => void
}

const HOTSPOT_COLOR = '#B9873C'
const SHADOW_COLOR = '#17241F'
const TARGET_SIZE = 3

export function Scene3DCanvas({ model, parts, onHotspotUpdate, onStatusChange }: Scene3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let cancelled = false
    let frameId = 0

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // three.js r155+ dùng đơn vị ánh sáng physically-correct (lux) — cường độ phải cao
    // hơn hẳn so với "unit" cũ để vật liệu sáng màu không bị xám xịt.
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e7da, 2.0)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2)
    keyLight.position.set(3, 5, 4)
    const fillLight = new THREE.DirectionalLight(0xdceae3, 0.5)
    fillLight.position.set(-4, 2, -3)
    scene.add(hemiLight, keyLight, fillLight)

    function resize() {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.rotateSpeed = 0.55
    controls.minPolarAngle = Math.PI * 0.18
    controls.maxPolarAngle = Math.PI * 0.78
    controls.target.set(0, 0, 0)

    const hotspotObjects = new Map<string, THREE.Object3D>()
    const projected = new THREE.Vector3()
    const positions = new Map<string, HotspotScreenPosition>()

    function animate() {
      frameId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)

      if (hotspotObjects.size > 0) {
        const rect = renderer.domElement.getBoundingClientRect()
        for (const [partId, object] of hotspotObjects) {
          object.getWorldPosition(projected)
          projected.project(camera)
          positions.set(partId, {
            x: (projected.x * 0.5 + 0.5) * rect.width,
            y: (1 - (projected.y * 0.5 + 0.5)) * rect.height,
            visible: projected.z < 1,
          })
        }
        onHotspotUpdate(positions)
      }
    }
    animate()

    onStatusChange('loading')
    const loader = new GLTFLoader()
    loader.load(
      model.url,
      (gltf) => {
        if (cancelled) return
        const modelRoot = gltf.scene

        const box = new THREE.Box3().setFromObject(modelRoot)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        const normalizedScale = TARGET_SIZE / maxDim

        const shadow = new THREE.Mesh(
          new THREE.CircleGeometry(Math.max(size.x, size.z) * 0.62 || 1, 40),
          new THREE.MeshBasicMaterial({ color: new THREE.Color(SHADOW_COLOR), transparent: true, opacity: 0.16 })
        )
        shadow.rotation.x = -Math.PI / 2
        shadow.position.set(center.x, box.min.y + 0.001, center.z)

        // Hotspot đặt theo `part.anchor` chuẩn hoá [0,1] trong bounding box — bán kính
        // marker cũng tỉ lệ theo maxDim nên kích thước hiển thị luôn nhất quán dù file
        // .glb dùng đơn vị/scale gốc nào.
        const markersGroup = new THREE.Group()
        for (const part of parts) {
          const marker = new THREE.Mesh(
            new THREE.SphereGeometry(0.045 * maxDim, 16, 16),
            new THREE.MeshBasicMaterial({ color: new THREE.Color(HOTSPOT_COLOR) })
          )
          marker.position.set(
            box.min.x + part.anchor[0] * size.x,
            box.min.y + part.anchor[1] * size.y,
            box.min.z + part.anchor[2] * size.z
          )
          markersGroup.add(marker)
          hotspotObjects.set(part.id, marker)
        }

        const root = new THREE.Group()
        root.scale.setScalar(normalizedScale)
        root.position.set(-center.x * normalizedScale, -center.y * normalizedScale, -center.z * normalizedScale)
        root.add(modelRoot, shadow, markersGroup)
        scene.add(root)

        const distanceFactor = model.cameraDistance / 6
        camera.position.set(3.1 * distanceFactor, 2.0 * distanceFactor, 4.3 * distanceFactor)
        camera.lookAt(0, 0, 0)

        onStatusChange('ready')
      },
      undefined,
      (error) => {
        if (cancelled) return
        console.error(`[vitrine] Không tải được model 3D tại ${model.url}`, error)
        onStatusChange('error')
      }
    )

    return () => {
      cancelled = true
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      controls.dispose()
      renderer.dispose()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
      })
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement)
    }
    // model/parts đến từ props ổn định theo scene hiện tại — component cha remount bằng
    // `key={scene.id}` khi đổi cảnh nên effect này chỉ cần chạy lại nếu identity đổi.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
}
