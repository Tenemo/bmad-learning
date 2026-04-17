import { resolve } from "node:path";

import cors from "@fastify/cors";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";

import { openDatabase, resolvePath } from "./database.js";
import { TodoRepository } from "./todo-repository.js";
import { createTodoSchema, formatValidationError, updateTodoSchema } from "./validation.js";

const defaultOrigins = [
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://127.0.0.1:4173",
  "http://localhost:4173"
];

export interface AppOptions {
  dbPath?: string;
  logger?: boolean;
  staticRoot?: string;
  corsOrigin?: string;
}

function getAllowedOrigins(originValue?: string): string[] {
  if (!originValue) {
    return defaultOrigins;
  }

  return originValue
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function createApp(options: AppOptions = {}) {
  const dbPath = options.dbPath ?? process.env.TODO_DB_PATH ?? "./data/todos.sqlite";
  const staticRoot = options.staticRoot ?? process.env.STATIC_ROOT;
  const allowedOrigins = getAllowedOrigins(options.corsOrigin ?? process.env.CORS_ORIGIN);

  const app = fastify({
    logger: options.logger ?? false
  });

  const db = openDatabase(dbPath);
  const repository = new TodoRepository(db);

  app.addHook("onClose", async () => {
    db.close();
  });

  app.register(cors, {
    origin: allowedOrigins
  });

  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);
    reply.code(500).send({
      message: "An unexpected server error occurred."
    });
  });

  app.get("/health", async () => repository.healthcheck());

  app.get("/api/todos", async () => ({
    items: repository.list()
  }));

  app.post("/api/todos", async (request, reply) => {
    const parsed = createTodoSchema.safeParse(request.body);

    if (!parsed.success) {
      reply.code(400).send(formatValidationError(parsed.error));
      return;
    }

    const todo = repository.create(parsed.data);
    reply.code(201).send(todo);
  });

  app.patch<{ Params: { id: string } }>("/api/todos/:id", async (request, reply) => {
    const parsed = updateTodoSchema.safeParse(request.body);

    if (!parsed.success) {
      reply.code(400).send(formatValidationError(parsed.error));
      return;
    }

    const changes: { text?: string; completed?: boolean } = {};

    if (parsed.data.text !== undefined) {
      changes.text = parsed.data.text;
    }

    if (parsed.data.completed !== undefined) {
      changes.completed = parsed.data.completed;
    }

    const todo = repository.update(request.params.id, changes);

    if (!todo) {
      reply.code(404).send({
        message: "Todo not found."
      });
      return;
    }

    reply.send(todo);
  });

  app.delete<{ Params: { id: string } }>("/api/todos/:id", async (request, reply) => {
    const deleted = repository.delete(request.params.id);

    if (!deleted) {
      reply.code(404).send({
        message: "Todo not found."
      });
      return;
    }

    reply.code(204).send();
  });

  if (staticRoot) {
    app.register(fastifyStatic, {
      root: resolve(resolvePath(staticRoot))
    });

    app.get("/", async (_request, reply) => reply.sendFile("index.html"));

    app.setNotFoundHandler(async (request, reply) => {
      if (request.method !== "GET" || request.url.startsWith("/api") || request.url === "/health") {
        reply.code(404).send({
          message: "Route not found."
        });
        return;
      }

      return reply.type("text/html").sendFile("index.html");
    });
  } else {
    app.setNotFoundHandler(async (_request, reply) => {
      reply.code(404).send({
        message: "Route not found."
      });
    });
  }

  return app;
}
