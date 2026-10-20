import { memo, useEffect, useRef, useState } from "react";
import { CheckIcon, EditIcon, TrashIcon } from "./Icons";

function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const save = () => {
    const next = draft.trim();
    if (next && next !== todo.title) onEdit(todo.id, next);
    else setDraft(todo.title);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(todo.title);
    setEditing(false);
  };

  return (
    <li className={`todo${todo.completed ? " is-done" : ""}`}>
      <button
        className="check"
        role="checkbox"
        aria-checked={todo.completed}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? "not done" : "done"}`}
        onClick={() => onToggle(todo.id)}
      >
        <CheckIcon width={14} height={14} strokeWidth={3} />
      </button>

      {editing ? (
        <input
          ref={inputRef}
          className="todo__edit"
          value={draft}
          aria-label="Edit task title"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") cancel();
          }}
        />
      ) : (
        <span className="todo__title" onDoubleClick={() => setEditing(true)}>
          {todo.title}
        </span>
      )}

      <span className="avatar" title={`Assigned to User ${todo.userId}`}>
        U{todo.userId}
      </span>

      <div className="todo__actions">
        <button className="icon-btn" onClick={() => setEditing(true)} aria-label={`Edit "${todo.title}"`}>
          <EditIcon />
        </button>
        <button className="icon-btn icon-btn--danger" onClick={() => onDelete(todo.id)} aria-label={`Delete "${todo.title}"`}>
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}

export default memo(TodoItem);
