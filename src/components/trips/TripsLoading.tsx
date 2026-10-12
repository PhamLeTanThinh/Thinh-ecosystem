'use client'

import { Suspense, useSyncExternalStore } from 'react'
import { NavigationWatcher } from '@/components/loading/NavigationWatcher'
import { createLoadingTracker } from '@/lib/loading/tracker'
import { TRIP_THEMES } from '@/lib/trips/themes'

// Tạo ở cấp module (không trong component) để patch fetch xong trước mọi effect — xem lib/loading/tracker.ts.
// Hiện khi trang chưa load xong, khi đang tải dữ liệu /api/trips, và khi chuyển trang trong app. Các thao tác ghi
// (lưu / xoá...) gửi kèm header X-Background (lib/trips/store.ts) nên KHÔNG bật overlay — chúng có spinner ngay
// trên nút bấm.
const tripsTracker = createLoadingTracker('/api/trips')

export function TripsLoading() {
  const visible = useSyncExternalStore(tripsTracker.subscribe, tripsTracker.getVisible, () => true)
  return (
    <>
      <Suspense fallback={null}>
        <NavigationWatcher tracker={tripsTracker} />
      </Suspense>
      <div className={`tp-loader${visible ? ' tp-loader--on' : ''}`} role="status" aria-label="Đang tải" aria-hidden={!visible}>
        <div className="tp-loader-card">
          <div className="tp-loader-globe" aria-hidden="true">
            <span className="tp-loader-earth">🌏</span>
            <span className="tp-loader-orbit">
              {TRIP_THEMES.map((t, i) => (
                <span key={t.key} className={`tp-loader-seat tp-loader-seat--${i + 1}`}>
                  <span className="tp-loader-ride">{t.vehicle}</span>
                </span>
              ))}
            </span>
          </div>
          <p className="tp-display mt-5 text-xl font-bold text-(--tp-ink)">Đang lên đường…</p>
          <p className="tp-label mt-1">Chuẩn bị hành trình của bạn</p>
        </div>
      </div>
    </>
  )
}
