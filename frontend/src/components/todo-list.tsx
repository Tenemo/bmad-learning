import type { Todo } from "../lib/types";
import { TodoItem } from "./todo-item";

interface TodoListProps {
  busyTodoId: string | null;
  onDelete: (todo: Todo) => Promise<void>;
  onToggle: (todo: Todo) => Promise<void>;
  todos: Todo[];
}

export function TodoList({ busyTodoId, onDelete, onToggle, todos }: TodoListProps) {
  return (
    <ul className="todo-list" aria-label="Todo items">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isBusy={busyTodoId === todo.id}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}
