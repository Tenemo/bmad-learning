import type { APIRequestContext } from "@playwright/test";

export async function clearTodos(request: APIRequestContext, baseUrl: string) {
  const response = await request.get(`${baseUrl}/api/todos`);
  const data = (await response.json()) as { items: Array<{ id: string }> };

  await Promise.all(data.items.map((todo) => request.delete(`${baseUrl}/api/todos/${todo.id}`)));
}
