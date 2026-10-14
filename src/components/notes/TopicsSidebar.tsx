"use client";

import { useState } from "react";
import { useNotesStore } from "@/lib/notes/store";
import { useNotesConfirm } from "./ConfirmDialog";

// renamingId marker for the Uncategorized row (not a real topic id).
const UNCATEGORIZED = "__uncategorized__";

interface Props {
  activeTopicId: string | null;
  // Notes per topic id ('' key = Uncategorized, i.e. Overall notes with no topic).
  counts: Map<string, number>;
  onSelectTopic: (id: string | null) => void;
}

// Right column of the Overall view — the user's own topics, each one a separate board (see
// StickyNote.topicId). Click to open, double-click to rename.
export function TopicsSidebar({ activeTopicId, counts, onSelectTopic }: Props) {
  const topics = useNotesStore((s) => s.topics);
  const addTopic = useNotesStore((s) => s.addTopic);
  const renameTopic = useNotesStore((s) => s.renameTopic);
  const claimUncategorized = useNotesStore((s) => s.claimUncategorized);
  const deleteTopic = useNotesStore((s) => s.deleteTopic);
  const confirm = useNotesConfirm();
  const [draft, setDraft] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const uncategorizedCount = counts.get("") ?? 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    const topic = addTopic(draft.trim());
    setDraft("");
    onSelectTopic(topic.id);
  }

  async function handleDelete(id: string, title: string) {
    const n = counts.get(id) ?? 0;
    const msg =
      n > 0
        ? `Delete topic "${title}" and its ${n} notes?`
        : `Delete topic "${title}"?`;
    if (!(await confirm(msg))) return;
    deleteTopic(id);
  }

  return (
    <aside className="nt-sidebar">
      <div className="nt-sidebar-header">
        <span>Topics</span>
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

      {topics.length === 0 && uncategorizedCount === 0 ? (
        <p className="nt-tree-empty">
          No topics yet — add one above, each topic gets its own board.
        </p>
      ) : (
        <div className="nt-tree">
          {topics.map((t) => {
            const isActive = t.id === activeTopicId;
            const n = counts.get(t.id) ?? 0;
            return (
              <div
                key={t.id}
                className={`nt-tree-day${isActive ? " active" : ""}`}
              >
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
                    title="Double-click to rename"
                    onClick={() => onSelectTopic(t.id)}
                    onDoubleClick={() => setRenamingId(t.id)}
                  >
                    {t.title}
                  </button>
                )}
                {n > 0 && <span className="nt-tree-count">{n}</span>}
                <button
                  type="button"
                  aria-label={`Rename topic ${t.title}`}
                  className="nt-tree-delete nt-tree-edit"
                  onClick={() => setRenamingId(t.id)}
                >
                  ✎
                </button>
                <button
                  type="button"
                  aria-label={`Delete topic ${t.title}`}
                  className="nt-tree-delete"
                  onClick={() => handleDelete(t.id, t.title)}
                >
                  ×
                </button>
              </div>
            );
          })}

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
    </aside>
  );
}

// Inline rename — commits on blur/Enter, Escape cancels.
function TopicTitleInput({
  title,
  onDone,
}: {
  title: string;
  onDone: (title: string | null) => void;
}) {
  const [value, setValue] = useState(title);
  return (
    <input
      type="text"
      className="nt-topic-rename"
      autoFocus
      value={value}
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
