import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";

const apps: Array<ReturnType<typeof createApp>> = [];

function createDbPath() {
  const directory = mkdtempSync(join(tmpdir(), "todo-backend-"));
  return join(directory, "todos.sqlite");
}

async function buildApp(dbPath = createDbPath()) {
  const app = createApp({ dbPath });
  apps.push(app);
  await app.ready();
  return { app, dbPath };
}

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe("todo api", () => {
  it("returns a healthy status response", async () => {
    const { app } = await buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/health"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: "ok",
      db: "reachable"
    });
  });

  it("creates and lists todos", async () => {
    const { app } = await buildApp();

    const createResponse = await app.inject({
      method: "POST",
      url: "/api/todos",
      payload: {
        text: "Ship the BMAD todo app"
      }
    });

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.json()).toMatchObject({
      text: "Ship the BMAD todo app",
      completed: false
    });

    const listResponse = await app.inject({
      method: "GET",
      url: "/api/todos"
    });

    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.json().items).toHaveLength(1);
    expect(listResponse.json().items[0]).toMatchObject({
      text: "Ship the BMAD todo app",
      completed: false
    });
  });

  it("persists data across application restarts", async () => {
    const dbPath = createDbPath();
    const firstApp = createApp({ dbPath });
    apps.push(firstApp);
    await firstApp.ready();

    const createResponse = await firstApp.inject({
      method: "POST",
      url: "/api/todos",
      payload: {
        text: "Persist me"
      }
    });

    const createdTodo = createResponse.json();
    await firstApp.close();
    apps.pop();

    const secondApp = createApp({ dbPath });
    apps.push(secondApp);
    await secondApp.ready();

    const listResponse = await secondApp.inject({
      method: "GET",
      url: "/api/todos"
    });

    expect(listResponse.json().items).toContainEqual(
      expect.objectContaining({
        id: createdTodo.id,
        text: "Persist me"
      })
    );
  });

  it("updates todo text and completion state", async () => {
    const { app } = await buildApp();

    const createResponse = await app.inject({
      method: "POST",
      url: "/api/todos",
      payload: {
        text: "Review coverage"
      }
    });

    const createdTodo = createResponse.json();

    const updateResponse = await app.inject({
      method: "PATCH",
      url: `/api/todos/${createdTodo.id}`,
      payload: {
        text: "Review coverage report",
        completed: true
      }
    });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.json()).toMatchObject({
      id: createdTodo.id,
      text: "Review coverage report",
      completed: true
    });
  });

  it("rejects invalid create payloads", async () => {
    const { app } = await buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/api/todos",
      payload: {
        text: "   "
      }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      message: "The request payload is invalid.",
      issues: ["Todo text is required"]
    });
  });

  it("returns not found for missing todos and deletes existing ones", async () => {
    const { app } = await buildApp();

    const missingUpdate = await app.inject({
      method: "PATCH",
      url: "/api/todos/missing-id",
      payload: {
        completed: true
      }
    });

    expect(missingUpdate.statusCode).toBe(404);

    const createResponse = await app.inject({
      method: "POST",
      url: "/api/todos",
      payload: {
        text: "Remove me"
      }
    });

    const createdTodo = createResponse.json();

    const deleteResponse = await app.inject({
      method: "DELETE",
      url: `/api/todos/${createdTodo.id}`
    });

    expect(deleteResponse.statusCode).toBe(204);

    const listResponse = await app.inject({
      method: "GET",
      url: "/api/todos"
    });

    expect(listResponse.json().items).toHaveLength(0);
  });
});
