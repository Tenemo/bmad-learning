import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "./app";
import type { Todo } from "./lib/types";

function buildTodo(text: string): Todo {
  const timestamp = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function createResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

function mockTodoApi(options: { failCreate?: boolean; failLoad?: boolean; initialTodos?: Todo[] } = {}) {
  const todos = [...(options.initialTodos ?? [])];

  return vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const requestUrl = typeof input === "string" ? input : input.toString();
    const method = init?.method ?? "GET";

    if (!requestUrl.endsWith("/api/todos") && !requestUrl.includes("/api/todos/")) {
      return createResponse({}, 404);
    }

    if (method === "GET") {
      if (options.failLoad) {
        return createResponse({ message: "Backend unavailable" }, 500);
      }

      return createResponse({ items: todos });
    }

    if (method === "POST") {
      if (options.failCreate) {
        return createResponse({ message: "Write failed" }, 500);
      }

      const body = JSON.parse(String(init?.body ?? "{}")) as { text: string };
      const todo = buildTodo(body.text);
      todos.unshift(todo);
      return createResponse(todo, 201);
    }

    if (method === "PATCH") {
      const body = JSON.parse(String(init?.body ?? "{}")) as { completed?: boolean };
      const id = requestUrl.split("/").at(-1);
      const todo = todos.find((entry) => entry.id === id);

      if (!todo) {
        return createResponse({ message: "Todo not found." }, 404);
      }

      todo.completed = body.completed ?? todo.completed;
      todo.updatedAt = new Date().toISOString();
      return createResponse(todo);
    }

    if (method === "DELETE") {
      const id = requestUrl.split("/").at(-1);
      const index = todos.findIndex((entry) => entry.id === id);

      if (index === -1) {
        return createResponse({ message: "Todo not found." }, 404);
      }

      todos.splice(index, 1);
      return new Response(null, { status: 204 });
    }

    return createResponse({}, 405);
  });
}

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      },
      mutations: {
        retry: false
      }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("todo app", () => {
  it("shows the empty state after loading an empty list", async () => {
    mockTodoApi();
    renderApp();

    expect(screen.getByText("Loading your list...")).toBeInTheDocument();
    expect(await screen.findByText("Your list is clear.")).toBeInTheDocument();
  });

  it("creates, completes, and deletes a todo", async () => {
    mockTodoApi();
    renderApp();

    const user = userEvent.setup();

    await screen.findByText("Your list is clear.");
    await user.type(screen.getByLabelText("Add a task"), "Pack the Docker setup");
    await user.click(screen.getByRole("button", { name: "Add todo" }));

    expect(await screen.findByText("Pack the Docker setup")).toBeInTheDocument();

    await user.click(screen.getByLabelText('Mark "Pack the Docker setup" as complete'));
    await waitFor(() => expect(screen.getByLabelText('Mark "Pack the Docker setup" as active')).toBeChecked());

    await user.click(screen.getByRole("button", { name: 'Delete "Pack the Docker setup"' }));
    expect(await screen.findByText("Your list is clear.")).toBeInTheDocument();
  });

  it("shows a load error banner when the API read fails", async () => {
    mockTodoApi({ failLoad: true });
    renderApp();

    expect(await screen.findByRole("alert")).toHaveTextContent("Could not load your todos. Please retry.");
  });

  it("rolls back an optimistic create when the API write fails", async () => {
    mockTodoApi({ failCreate: true });
    renderApp();

    const user = userEvent.setup();

    await screen.findByText("Your list is clear.");
    await user.type(screen.getByLabelText("Add a task"), "Broken write");
    await user.click(screen.getByRole("button", { name: "Add todo" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Could not save the todo. Please try again.");
    expect(screen.queryByText("Broken write")).not.toBeInTheDocument();
    expect(screen.getByText("Your list is clear.")).toBeInTheDocument();
  });
});
