import type { Todo } from "../lib/types";

interface TodoItemProps {
  isBusy: boolean;
  onDelete: (todo: Todo) => Promise<void>;
  onToggle: (todo: Todo) => Promise<void>;
  todo: Todo;
}

export function TodoItem({ isBusy, onDelete, onToggle, todo }: TodoItemProps) {
  return (
    <li className={`todo-item${todo.completed ? " todo-item--completed" : ""}`}>
      <label className="todo-item__toggle">
        <input
          type="checkbox"
          checked={todo.completed}
          disabled={isBusy}
          aria-label={todo.completed ? `Mark "${todo.text}" as active` : `Mark "${todo.text}" as complete`}
          onChange={() => onToggle(todo)}
        />
        <span className="todo-item__text">{todo.text}</span>
      </label>
      <button
        className="todo-item__delete"
        type="button"
        disabled={isBusy}
        aria-label={`Delete "${todo.text}"`}
        onClick={() => onDelete(todo)}
      >
        Delete
      </button>
    </li>
  );
}
