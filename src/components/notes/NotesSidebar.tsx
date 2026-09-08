'use client'

import { useState } from 'react'
import { getAncestorKeys, type TreeNode } from '@/lib/notes/dateTree'

interface Props {
  tree: TreeNode[]
  currentDate: string
  onSelectDay: (date: string) => void
  onDeleteGroup: (noteIds: string[], label: string) => void
  onClose: () => void
}

export function NotesSidebar({ tree, currentDate, onSelectDay, onDeleteGroup, onClose }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(getAncestorKeys(currentDate)))
  // Theo dõi ngày đang xem lúc render trước — khi đổi (qua nav ở topbar, không chỉ click trong cây),
  // mở rộng luôn nhánh dẫn tới ngày mới ngay trong render (không dùng effect để tránh 1 nhịp re-render
  // thừa) mà vẫn giữ các nhánh user đã tự mở/đóng trước đó.
  const [trackedDate, setTrackedDate] = useState(currentDate)
  if (currentDate !== trackedDate) {
    setTrackedDate(currentDate)
    setExpanded((prev) => new Set([...prev, ...getAncestorKeys(currentDate)]))
  }

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <aside className="nt-sidebar">
      <div className="nt-sidebar-header">
        <span>Ghi chú theo ngày</span>
        <button type="button" aria-label="Đóng danh sách" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="nt-tree">
        {tree.map((node) => (
          <TreeRow
            key={node.key}
            node={node}
            depth={0}
            currentDate={currentDate}
            expanded={expanded}
            onToggle={toggle}
            onSelectDay={onSelectDay}
            onDeleteGroup={onDeleteGroup}
          />
        ))}
      </div>
    </aside>
  )
}

interface RowProps {
  node: TreeNode
  depth: number
  currentDate: string
  expanded: Set<string>
  onToggle: (key: string) => void
  onSelectDay: (date: string) => void
  onDeleteGroup: (noteIds: string[], label: string) => void
}

function TreeRow({ node, depth, currentDate, expanded, onToggle, onSelectDay, onDeleteGroup }: RowProps) {
  if (node.isDay) {
    const isActive = node.date === currentDate
    return (
      <div
        className={`nt-tree-day${isActive ? ' active' : ''}`}
        style={{ paddingLeft: 12 + depth * 14, borderLeftColor: node.color }}
      >
        <button type="button" className="nt-tree-day-btn" onClick={() => onSelectDay(node.date!)}>
          {node.label}
        </button>
        {node.count > 0 && <span className="nt-tree-count">{node.count}</span>}
        {node.count > 0 && (
          <button
            type="button"
            aria-label={`Xoá ghi chú ngày ${node.label}`}
            className="nt-tree-delete"
            onClick={() => onDeleteGroup(node.noteIds, node.label)}
          >
            ×
          </button>
        )}
      </div>
    )
  }

  const isOpen = expanded.has(node.key)

  return (
    <div className="nt-tree-group">
      <div className="nt-tree-group-row" style={{ paddingLeft: depth * 14, borderLeftColor: node.color }}>
        <button
          type="button"
          className="nt-tree-toggle"
          aria-label={isOpen ? 'Thu gọn' : 'Mở rộng'}
          onClick={() => onToggle(node.key)}
        >
          {isOpen ? '▾' : '▸'}
        </button>
        <button type="button" className="nt-tree-group-label" onClick={() => onToggle(node.key)}>
          {node.label}
        </button>
        <span className="nt-tree-count">{node.count}</span>
        {node.count > 0 && (
          <button
            type="button"
            aria-label={`Xoá tất cả ghi chú trong ${node.label}`}
            className="nt-tree-delete"
            onClick={() => onDeleteGroup(node.noteIds, node.label)}
          >
            ×
          </button>
        )}
      </div>
      {isOpen &&
        node.children.map((child) => (
          <TreeRow
            key={child.key}
            node={child}
            depth={depth + 1}
            currentDate={currentDate}
            expanded={expanded}
            onToggle={onToggle}
            onSelectDay={onSelectDay}
            onDeleteGroup={onDeleteGroup}
          />
        ))}
    </div>
  )
}
