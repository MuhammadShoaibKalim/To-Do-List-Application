import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onEdit, onDelete }) {
  return (
    <ul className="todo-list">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}
