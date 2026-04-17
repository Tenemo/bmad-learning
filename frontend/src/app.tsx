import { useState } from "react";

import { AddTodoForm } from "./components/add-todo-form";
import { EmptyState } from "./components/empty-state";
import { ErrorBanner } from "./components/error-banner";
import { TodoList } from "./components/todo-list";
import { useCreateTodoMutation, useDeleteTodoMutation, useTodosQuery, useUpdateTodoMutation } from "./hooks/use-todos";
import type { Todo } from "./lib/types";
import "./app.css";

export default function App() {
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const todosQuery = useTodosQuery();
  const createMutation = useCreateTodoMutation(setBannerMessage);
  const updateMutation = useUpdateTodoMutation(setBannerMessage);
  const deleteMutation = useDeleteTodoMutation(setBannerMessage);

  const todos = todosQuery.data ?? [];
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;
  const busyTodoId = updateMutation.isPending
    ? updateMutation.variables.id
    : deleteMutation.isPending
      ? deleteMutation.variables
      : null;

  async function handleAddTodo(text: string) {
    setBannerMessage(null);
    try {
      await createMutation.mutateAsync({ text });
    } catch {
      return;
    }
  }

  async function handleToggleTodo(todo: Todo) {
    setBannerMessage(null);
    try {
      await updateMutation.mutateAsync({
        id: todo.id,
        changes: {
          completed: !todo.completed
        }
      });
    } catch {
      return;
    }
  }

  async function handleDeleteTodo(todo: Todo) {
    setBannerMessage(null);
    try {
      await deleteMutation.mutateAsync(todo.id);
    } catch {
      return;
    }
  }

  const loadErrorMessage = todosQuery.isError ? "Could not load your todos. Please retry." : null;
  const visibleError = bannerMessage ?? loadErrorMessage;

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="hero-card__eyebrow">Single-user task flow</p>
        <div className="hero-card__content">
          <div>
            <h1 className="hero-card__title">Keep the next thing obvious.</h1>
            <p className="hero-card__body">
              Add work, finish it quickly, and keep the list durable across refreshes without extra ceremony.
            </p>
          </div>
          <dl className="hero-card__stats">
            <div>
              <dt>Active</dt>
              <dd>{activeCount}</dd>
            </div>
            <div>
              <dt>Completed</dt>
              <dd>{completedCount}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="surface-card">
        <AddTodoForm isPending={createMutation.isPending} onSubmit={handleAddTodo} />

        {visibleError ? (
          <ErrorBanner
            message={visibleError}
            onDismiss={() => setBannerMessage(null)}
            onRetry={todosQuery.refetch}
          />
        ) : null}

        {todosQuery.isPending ? (
          <section className="loading-state" aria-live="polite">
            <p className="loading-state__eyebrow">Syncing</p>
            <p className="loading-state__body">Loading your list...</p>
          </section>
        ) : todos.length === 0 ? (
          <EmptyState />
        ) : (
          <TodoList busyTodoId={busyTodoId} onDelete={handleDeleteTodo} onToggle={handleToggleTodo} todos={todos} />
        )}
      </section>
    </main>
  );
}
