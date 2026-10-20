import { useState } from "react";
import { PlusIcon } from "./Icons";

export default function AddTodoForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const valid = title.trim().length > 0;

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    onAdd(title);
    setTitle("");
  };

  return (
    <form className="add" onSubmit={submit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        aria-label="New task"
        maxLength={140}
      />
      <button className="btn" type="submit" disabled={!valid}>
        <PlusIcon /> Add task
      </button>
    </form>
  );
}
