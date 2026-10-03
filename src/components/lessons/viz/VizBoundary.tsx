'use client'

import { Component, type ReactNode } from 'react'

// Một đồ thị động lỗi thì chỉ hiện thông báo tại chỗ, không làm sập cả bài học.
export class VizBoundary extends Component<{ name: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error(`Đồ thị "${this.props.name}" bị lỗi`, error)
  }

  render() {
    return this.state.failed ? <p className="la-viz-missing">Đồ thị “{this.props.name}” đang lỗi, tạm thời không hiển thị được.</p> : this.props.children
  }
}
