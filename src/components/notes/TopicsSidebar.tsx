"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { canMoveTopic, useNotesStore, type TopicDropPos } from "@/lib/notes/store";
import { NOTE_COLOR_HEX, NOTE_COLORS, type NoteColor, type NoteTopic } from "@/lib/notes/types";
import { useNotesConfirm } from "./ConfirmDialog";

// renamingId marker for the Uncategorized row (not a real topic id).
const UNCATEGORIZED = "__uncategorized__";
// Nhớ folder nào đang thu gọn — chỉ là tiện ích riêng trên máy này, mất cũng không sao.
const COLLAPSED_KEY = "nt-topics-collapsed";

interface Props {
  activeTopicId: string | null;
  // Notes per topic id ('' key = Uncategorized, i.e. Overall notes with no topic).
  counts: Map<string, number>;
  onSelectTopic: (id: string | null) => void;
  // Thu gọn cột (mở lại bằng nút "Topics" trên thanh trên cùng — page.tsx)
  onClose: () => void;
}

// Right column of the Overall view — the user's own topics, each one a separate board (see
// StickyNote.topicId), optionally grouped into folders (right-click the column → New folder).
// Click a topic to open it, double-click to rename; drag any row to reorder it or move a topic
// into / out of a folder.
export function TopicsSidebar({ activeTopicId, counts, onSelectTopic, onClose }: Props) {
  const topics = useNotesStore((s) => s.topics);
  const addTopic = useNotesStore((s) => s.addTopic);
  const renameTopic = useNotesStore((s) => s.renameTopic);
  const setTopicColor = useNotesStore((s) => s.setTopicColor);
  const moveTopic = useNotesStore((s) => s.moveTopic);
  const claimUncategorized = useNotesStore((s) => s.claimUncategorized);
  const deleteTopic = useNotesStore((s) => s.deleteTopic);
  const confirm = useNotesConfirm();
  const setTopicParent = useNotesStore((s) => s.setTopicParent);
  const [draft, setDraft] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [colorPickerId, setColorPickerId] = useState<string | null>(null);
  // Menu chuột phải: targetId = hàng được bấm (null = chỗ trống trong cột)
  const [menu, setMenu] = useState<{ x: number; y: number; targetId: string | null } | null>(null);
  // Đang gõ tên topic mới ngay trong danh sách (từ menu chuột phải) — parentId = folder chứa nó
  const [creating, setCreating] = useState<{ parentId: string | null } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropHint, setDropHint] = useState<{ id: string; pos: TopicDropPos } | null>(null);
  // Đọc ngay lúc khởi tạo: topics chỉ có sau khi store tải xong ở client, nên lúc render trên server
  // chưa có hàng nào để lệch.
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(COLLAPSED_KEY) ?? "[]") as string[]);
    } catch {
      return new Set();
    }
  });
  const uncategorizedCount = counts.get("") ?? 0;

  function setCollapsedFor(id: string, value: boolean) {
    if (collapsed.has(id) === value) return;
    const next = new Set(collapsed);
    if (value) next.add(id);
    else next.delete(id);
    setCollapsed(next);
    try {
      localStorage.setItem(COLLAPSED_KEY, JSON.stringify([...next]));
    } catch {}
  }

  const roots = topics.filter((t) => !t.parentId);
  const childrenOf = (id: string) => topics.filter((t) => t.parentId === id);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    const topic = addTopic(draft.trim());
    setDraft("");
    onSelectTopic(topic.id);
  }

  function handleNewFolder() {
    setMenu(null);
    const folder = addTopic("New folder", "folder");
    setRenamingId(folder.id);
  }

  function startCreating(parentId: string | null) {
    setMenu(null);
    if (parentId) setCollapsedFor(parentId, false);
    setCreating({ parentId });
  }

  // Ô gõ tên topic mới, hiện ngay ở cuối folder (hoặc cuối danh sách) — Enter để tạo, Esc/để trống để huỷ
  function renderCreatingRow(parentId: string | null) {
    if (creating?.parentId !== parentId) return null;
    return (
      <div className={`nt-tree-day nt-topic-row${parentId ? " nt-topic-sub" : ""}`}>
        <TopicTitleInput
          title=""
          placeholder="Topic name..."
          onDone={(title) => {
            setCreating(null);
            if (title) onSelectTopic(addTopic(title, "topic", parentId).id);
          }}
        />
      </div>
    );
  }

  function openMenu(e: React.MouseEvent, targetId: string | null) {
    // Giữ menu mặc định của trình duyệt khi chuột phải trong ô nhập (copy/paste...)
    if ((e.target as HTMLElement).closest("input, textarea")) return;
    e.preventDefault();
    e.stopPropagation();
    setColorPickerId(null);
    setMenu({ x: e.clientX, y: e.clientY, targetId });
  }

  function renderMenuItems(target: NoteTopic | null) {
    if (!target) {
      return (
        <>
          <button type="button" role="menuitem" onClick={() => startCreating(null)}>
            <span className="nt-ctx-plus">+</span> New topic
          </button>
          <button type="button" role="menuitem" onClick={handleNewFolder}>
            <FolderIcon color={null} /> New folder
          </button>
        </>
      );
    }
    const isFolder = target.kind === "folder";
    // Chuột phải vào topic nằm trong folder → vẫn tạo được topic mới trong chính folder đó
    const folder = isFolder ? target : topics.find((t) => t.id === target.parentId && t.kind === "folder");
    const folders = topics.filter((t) => t.kind === "folder");
    const done = (fn: () => void) => () => {
      setMenu(null);
      fn();
    };
    return (
      <>
        {folder && (
          <button type="button" role="menuitem" onClick={() => startCreating(folder.id)}>
            <span className="nt-ctx-plus">+</span> New topic in &ldquo;{folder.title}&rdquo;
          </button>
        )}
        <button type="button" role="menuitem" onClick={done(() => setRenamingId(target.id))}>
          <span className="nt-ctx-plus">✎</span> Rename
        </button>
        <div className="nt-ctx-label">Color</div>
        <div className="nt-ctx-swatches">
          {NOTE_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              className={`nt-tb-swatch${target.color === c ? " active" : ""}`}
              style={{ backgroundColor: NOTE_COLOR_HEX[c] }}
              onClick={done(() => setTopicColor(target.id, c))}
            />
          ))}
          <button
            type="button"
            aria-label="No color"
            className={`nt-tb-swatch nt-topic-color-none${target.color === null ? " active" : ""}`}
            onClick={done(() => setTopicColor(target.id, null))}
          />
        </div>
        {!isFolder && folders.length > 0 && (
          <>
            <div className="nt-ctx-label">Move to folder</div>
            {folders.map((f) => (
              <button
                key={f.id}
                type="button"
                role="menuitem"
                disabled={target.parentId === f.id || !canMoveTopic(topics, target.id, f.id, "inside")}
                onClick={done(() => {
                  setTopicParent(target.id, f.id);
                  setCollapsedFor(f.id, false);
                })}
              >
                <FolderIcon color={f.color} /> {f.title}
              </button>
            ))}
            {target.parentId && (
              <button type="button" role="menuitem" onClick={done(() => setTopicParent(target.id, null))}>
                <span className="nt-ctx-plus">↑</span> No folder
              </button>
            )}
          </>
        )}
        <div className="nt-ctx-sep" />
        <button type="button" role="menuitem" className="nt-ctx-danger" onClick={done(() => handleDelete(target))}>
          <span className="nt-ctx-plus">×</span> Delete {isFolder ? "folder" : "topic"}
        </button>
      </>
    );
  }

  async function handleDelete(t: NoteTopic) {
    if (t.kind === "folder") {
      const n = childrenOf(t.id).length;
      const msg = n > 0
        ? `Delete folder "${t.title}"? Its ${n} topics stay, just moved out of the folder.`
        : `Delete folder "${t.title}"?`;
      if (await confirm(msg)) deleteTopic(t.id);
      return;
    }
    const subs = childrenOf(t.id);
    const n = [t, ...subs].reduce((sum, x) => sum + (counts.get(x.id) ?? 0), 0);
    const parts = [
      subs.length > 0 ? `${subs.length} sub-topics` : "",
      n > 0 ? `${n} notes` : "",
    ].filter(Boolean);
    const msg = parts.length
      ? `Delete topic "${t.title}" and its ${parts.join(" and ")}?`
      : `Delete topic "${t.title}"?`;
    if (!(await confirm(msg))) return;
    deleteTopic(t.id);
  }

  // Top/bottom quarter of a row = drop before/after it; the middle = drop inside it (folders only).
  function handleDragOver(e: React.DragEvent<HTMLElement>, target: NoteTopic) {
    if (!dragId) return;
    const r = e.currentTarget.getBoundingClientRect();
    const f = (e.clientY - r.top) / r.height;
    let pos: TopicDropPos = f < 0.5 ? "before" : "after";
    // Ngay dưới 1 folder đang mở là topic đầu tiên của nó — thả "sau" folder ở đó tức là vào trong folder
    const opensBelow = target.kind === "folder" && !collapsed.has(target.id) && childrenOf(target.id).length > 0;
    if ((f > 0.25 && (f < 0.75 || opensBelow)) && canMoveTopic(topics, dragId, target.id, "inside")) pos = "inside";
    if (!canMoveTopic(topics, dragId, target.id, pos)) {
      setDropHint(null);
      return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dropHint?.id !== target.id || dropHint.pos !== pos) setDropHint({ id: target.id, pos });
  }

  function handleDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    if (dragId && dropHint) {
      moveTopic(dragId, dropHint.id, dropHint.pos);
      // Thả vào 1 folder đang thu gọn → mở ra cho thấy chỗ vừa thả
      if (dropHint.pos === "inside") setCollapsedFor(dropHint.id, false);
    }
    setDragId(null);
    setDropHint(null);
  }

  function renderRow(t: NoteTopic, parent: NoteTopic | null) {
    const isFolder = t.kind === "folder";
    const isActive = t.id === activeTopicId;
    const subs = parent ? [] : childrenOf(t.id);
    const isCollapsed = collapsed.has(t.id);
    const own = counts.get(t.id) ?? 0;
    // Folder (hoặc nhóm đang thu gọn): đếm gộp note của các topic bên trong
    const shown = isFolder || isCollapsed ? subs.reduce((sum, s) => sum + (counts.get(s.id) ?? 0), own) : own;
    const color = t.color ?? parent?.color ?? null;
    const hint = dropHint?.id === t.id ? dropHint.pos : null;
    return (
      <div
        key={t.id}
        className={[
          "nt-tree-day",
          "nt-topic-row",
          isFolder ? "nt-topic-folder" : "",
          parent ? "nt-topic-sub" : "",
          isActive ? "active" : "",
          // Nền pastel sáng → chữ trắng khó đọc, đổi sang chữ tối
          isActive && color ? "nt-topic-active-light" : "",
          dragId === t.id ? "nt-topic-dragging" : "",
          hint ? `nt-topic-drop-${hint}` : "",
        ]
          .filter(Boolean)
          .join(" ")}
        // Hàng đang mở tô nền bằng bản pastel của chính màu topic (chưa có màu thì giữ nền đen mặc định)
        style={
          color
            ? {
                borderLeftColor: NOTE_COLOR_HEX[color],
                ...(isActive
                  ? {
                      backgroundColor: `color-mix(in srgb, ${NOTE_COLOR_HEX[color]} 28%, var(--color-nt-surface))`,
                      // Màu gốc cho điểm nhấn (số đếm dạng viên thuốc) — chữ vẫn giữ màu chữ thường
                      "--nt-topic-accent": NOTE_COLOR_HEX[color],
                    }
                  : {}),
              } as React.CSSProperties
            : undefined
        }
        draggable={renamingId !== t.id}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", t.id);
          setDragId(t.id);
          setColorPickerId(null);
        }}
        onDragEnd={() => {
          setDragId(null);
          setDropHint(null);
        }}
        onDragOver={(e) => handleDragOver(e, t)}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null) && dropHint?.id === t.id) setDropHint(null);
        }}
        onDrop={handleDrop}
        onContextMenu={(e) => openMenu(e, t.id)}
      >
        {!parent && (
          <button
            type="button"
            className="nt-tree-toggle"
            aria-label={isCollapsed ? `Expand ${t.title}` : `Collapse ${t.title}`}
            style={{ visibility: subs.length ? "visible" : "hidden" }}
            onClick={() => setCollapsedFor(t.id, !isCollapsed)}
          >
            {isCollapsed ? "▸" : "▾"}
          </button>
        )}
        {isFolder && <FolderIcon color={color} />}
        {renamingId === t.id ? (
          <TopicTitleInput
            title={t.title}
            onDone={(title) => {
              if (title && title !== t.title) renameTopic(t.id, title);
              setRenamingId(null);
            }}
          />
        ) : (
          <button
            type="button"
            className="nt-tree-day-btn"
            title="Double-click to rename · drag to move"
            // Folder không phải board — bấm vào thì mở/thu gọn
            onClick={() => (isFolder ? setCollapsedFor(t.id, !isCollapsed) : onSelectTopic(t.id))}
            onDoubleClick={() => setRenamingId(t.id)}
          >
            {t.title}
          </button>
        )}
        {shown > 0 && <span className="nt-tree-count">{shown}</span>}
        <span className="nt-topic-color-wrap">
          <button
            type="button"
            aria-label={`Color of ${t.title}`}
            className="nt-tree-delete nt-tree-edit nt-topic-color-btn"
            style={color ? { backgroundColor: NOTE_COLOR_HEX[color] } : undefined}
            onClick={() => setColorPickerId(colorPickerId === t.id ? null : t.id)}
          />
          {colorPickerId === t.id && (
            <ColorPicker
              value={t.color}
              onPick={(c) => {
                setTopicColor(t.id, c);
                setColorPickerId(null);
              }}
              onClose={() => setColorPickerId(null)}
            />
          )}
        </span>
        <button
          type="button"
          aria-label={`Rename ${t.title}`}
          className="nt-tree-delete nt-tree-edit"
          onClick={() => setRenamingId(t.id)}
        >
          ✎
        </button>
        <button
          type="button"
          aria-label={`Delete ${t.title}`}
          className="nt-tree-delete"
          onClick={() => handleDelete(t)}
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <aside className="nt-sidebar" onContextMenu={(e) => openMenu(e, null)}>
      <div className="nt-sidebar-header">
        <span>Topics</span>
        <button type="button" aria-label="Thu gọn danh sách chủ đề" title="Thu gọn" onClick={onClose}>
          ×
        </button>
      </div>

      <form className="nt-timeline-add" onSubmit={handleSubmit}>
        <div className="nt-timeline-add-text">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a topic..."
            aria-label="Topic title"
          />
          <button type="submit">+</button>
        </div>
      </form>

      {topics.length === 0 && uncategorizedCount === 0 && !creating ? (
        <p className="nt-tree-empty">
          No topics yet — add one above, each topic gets its own board. Right-click here to make a folder.
        </p>
      ) : (
        <div className="nt-tree">
          {roots.map((t) => (
            <div key={t.id} className="nt-topic-group">
              {renderRow(t, null)}
              {!collapsed.has(t.id) && childrenOf(t.id).map((s) => renderRow(s, t))}
              {renderCreatingRow(t.id)}
            </div>
          ))}
          {renderCreatingRow(null)}

          {uncategorizedCount > 0 && (
            <div
              className={`nt-tree-day${activeTopicId === null ? " active" : ""}`}
            >
              {renamingId === UNCATEGORIZED ? (
                <TopicTitleInput
                  title=""
                  onDone={(title) => {
                    if (title) onSelectTopic(claimUncategorized(title).id);
                    setRenamingId(null);
                  }}
                />
              ) : (
                <button
                  type="button"
                  className="nt-tree-day-btn"
                  title="Double-click to rename"
                  onClick={() => onSelectTopic(null)}
                  onDoubleClick={() => setRenamingId(UNCATEGORIZED)}
                >
                  <em>Uncategorized</em>
                </button>
              )}
              <span className="nt-tree-count">{uncategorizedCount}</span>
              <button
                type="button"
                aria-label="Rename Uncategorized"
                className="nt-tree-delete nt-tree-edit"
                onClick={() => setRenamingId(UNCATEGORIZED)}
              >
                ✎
              </button>
            </div>
          )}
        </div>
      )}

      {menu && (
        <ContextMenu at={menu} onClose={() => setMenu(null)}>
          {renderMenuItems(topics.find((t) => t.id === menu.targetId) ?? null)}
        </ContextMenu>
      )}
    </aside>
  );
}

function FolderIcon({ color }: { color: NoteColor | null }) {
  return (
    <svg className="nt-topic-folder-icon" width="14" height="12" viewBox="0 0 14 12" aria-hidden="true">
      <path
        d="M1 2.2C1 1.54 1.54 1 2.2 1h3.1l1.4 1.5h5.1c.66 0 1.2.54 1.2 1.2v6.1c0 .66-.54 1.2-1.2 1.2H2.2C1.54 11 1 10.46 1 9.8V2.2Z"
        fill={color ? NOTE_COLOR_HEX[color] : "none"}
        fillOpacity={color ? 0.85 : undefined}
        stroke={color ? NOTE_COLOR_HEX[color] : "currentColor"}
        strokeWidth="1.2"
      />
    </svg>
  );
}

// Menu chuột phải — đặt theo toạ độ chuột (fixed), đóng khi bấm ra ngoài, Escape, cuộn hoặc đổi cỡ cửa sổ.
function ContextMenu({
  at,
  onClose,
  children,
}: {
  at: { x: number; y: number };
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(at);
  useLayoutEffect(() => {
    // Không cho menu tràn ra khỏi mép phải/dưới màn hình
    const el = ref.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setPos({ x: Math.min(at.x, window.innerWidth - r.width - 8), y: Math.min(at.y, window.innerHeight - r.height - 8) });
    }
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e.type === "pointerdown" && el?.contains(e.target as Node)) return;
      onClose();
    };
    window.addEventListener("pointerdown", close, true);
    window.addEventListener("keydown", close);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("pointerdown", close, true);
      window.removeEventListener("keydown", close);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [at, onClose]);
  return (
    <div ref={ref} className="nt-ctx-menu" role="menu" style={{ left: pos.x, top: pos.y }}>
      {children}
    </div>
  );
}

// Small popover of the note colors + "none". Closes on pick, Escape, or focus leaving it.
function ColorPicker({
  value,
  onPick,
  onClose,
}: {
  value: NoteColor | null;
  onPick: (c: NoteColor | null) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, []);
  return (
    <div
      className="nt-topic-color-pop"
      ref={ref}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onClose();
      }}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      {NOTE_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          aria-label={c}
          className={`nt-tb-swatch${value === c ? " active" : ""}`}
          style={{ backgroundColor: NOTE_COLOR_HEX[c] }}
          onClick={() => onPick(c)}
        />
      ))}
      <button
        type="button"
        aria-label="No color"
        className={`nt-tb-swatch nt-topic-color-none${value === null ? " active" : ""}`}
        onClick={() => onPick(null)}
      />
    </div>
  );
}

// Inline rename — commits on blur/Enter, Escape cancels. Selects the current text on focus so a
// freshly created "New folder" can be typed over straight away.
function TopicTitleInput({
  title,
  placeholder,
  onDone,
}: {
  title: string;
  placeholder?: string;
  onDone: (title: string | null) => void;
}) {
  const [value, setValue] = useState(title);
  return (
    <input
      type="text"
      className="nt-topic-rename"
      autoFocus
      value={value}
      placeholder={placeholder}
      onFocus={(e) => e.currentTarget.select()}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onDone(value.trim() || null)}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") onDone(null);
      }}
      aria-label="Rename topic"
    />
  );
}
