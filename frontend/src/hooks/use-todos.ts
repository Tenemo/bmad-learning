import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createTodo, deleteTodo, getTodos, updateTodo } from "../lib/api";
import type { Todo, TodoCreateInput, TodoUpdateInput } from "../lib/types";

type ErrorReporter = (message: string) => void;

export const todoQueryKey = ["todos"] as const;

function createOptimisticTodo(text: string): Todo {
  const timestamp = new Date().toISOString();

  return {
    id: `optimistic-${crypto.randomUUID()}`,
    text,
    completed: false,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function useTodosQuery() {
  return useQuery({
    queryKey: todoQueryKey,
    queryFn: getTodos
  });
}

export function useCreateTodoMutation(reportError: ErrorReporter) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onMutate: async (input: TodoCreateInput) => {
      await queryClient.cancelQueries({ queryKey: todoQueryKey });

      const previousTodos = queryClient.getQueryData<Todo[]>(todoQueryKey) ?? [];
      const optimisticTodo = createOptimisticTodo(input.text);

      queryClient.setQueryData<Todo[]>(todoQueryKey, [optimisticTodo, ...previousTodos]);

      return { previousTodos, optimisticTodoId: optimisticTodo.id };
    },
    onError: (_error, _input, context) => {
      if (context) {
        queryClient.setQueryData(todoQueryKey, context.previousTodos);
      }

      reportError("Could not save the todo. Please try again.");
    },
    onSuccess: (savedTodo, _input, context) => {
      queryClient.setQueryData<Todo[]>(todoQueryKey, (current = []) =>
        current.map((todo) => (todo.id === context?.optimisticTodoId ? savedTodo : todo))
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: todoQueryKey });
    }
  });
}

export function useUpdateTodoMutation(reportError: ErrorReporter) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: TodoUpdateInput }) => updateTodo(id, changes),
    onMutate: async ({ id, changes }) => {
      await queryClient.cancelQueries({ queryKey: todoQueryKey });

      const previousTodos = queryClient.getQueryData<Todo[]>(todoQueryKey) ?? [];

      queryClient.setQueryData<Todo[]>(
        todoQueryKey,
        previousTodos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                ...changes,
                updatedAt: new Date().toISOString()
              }
            : todo
        )
      );

      return { previousTodos };
    },
    onError: (_error, _input, context) => {
      if (context) {
        queryClient.setQueryData(todoQueryKey, context.previousTodos);
      }

      reportError("Could not update the todo. Please try again.");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: todoQueryKey });
    }
  });
}

export function useDeleteTodoMutation(reportError: ErrorReporter) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: todoQueryKey });

      const previousTodos = queryClient.getQueryData<Todo[]>(todoQueryKey) ?? [];

      queryClient.setQueryData<Todo[]>(
        todoQueryKey,
        previousTodos.filter((todo) => todo.id !== id)
      );

      return { previousTodos };
    },
    onError: (_error, _input, context) => {
      if (context) {
        queryClient.setQueryData(todoQueryKey, context.previousTodos);
      }

      reportError("Could not delete the todo. Please try again.");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: todoQueryKey });
    }
  });
}
