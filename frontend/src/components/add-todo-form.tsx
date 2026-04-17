import { useState, type FormEvent } from "react";

interface AddTodoFormProps {
  isPending: boolean;
  onSubmit: (text: string) => Promise<void>;
}

export function AddTodoForm({ isPending, onSubmit }: AddTodoFormProps) {
  const [text, setText] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    await onSubmit(trimmed);
    setText("");
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <label className="todo-form__label" htmlFor="todo-text">
        Add a task
      </label>
      <div className="todo-form__controls">
        <input
          id="todo-text"
          name="todo-text"
          className="todo-form__input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write a focused next step"
          autoComplete="off"
        />
        <button className="todo-form__button" type="submit" disabled={isPending || !text.trim()}>
          {isPending ? "Saving..." : "Add todo"}
        </button>
      </div>
    </form>
  );
}
