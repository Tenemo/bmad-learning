import { randomUUID } from "node:crypto";
import type Database from "better-sqlite3";

import type { Todo, TodoCreateInput, TodoUpdateInput } from "./types.js";

function mapTodo(row: {
  id: string;
  text: string;
  completed: number;
  created_at: string;
  updated_at: string;
}): Todo {
  return {
    id: row.id,
    text: row.text,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export class TodoRepository {
  constructor(private readonly db: Database.Database) {}

  list(): Todo[] {
    const rows = this.db
      .prepare(
        `
          SELECT id, text, completed, created_at, updated_at
          FROM todos
          ORDER BY datetime(created_at) DESC, id DESC
        `
      )
      .all() as Array<{
      id: string;
      text: string;
      completed: number;
      created_at: string;
      updated_at: string;
    }>;

    return rows.map(mapTodo);
  }

  create(input: TodoCreateInput): Todo {
    const timestamp = new Date().toISOString();
    const todo: Todo = {
      id: randomUUID(),
      text: input.text,
      completed: false,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.db
      .prepare(
        `
          INSERT INTO todos (id, text, completed, created_at, updated_at)
          VALUES (@id, @text, @completed, @createdAt, @updatedAt)
        `
      )
      .run({
        ...todo,
        completed: 0
      });

    return todo;
  }

  update(id: string, input: TodoUpdateInput): Todo | null {
    const existing = this.findById(id);

    if (!existing) {
      return null;
    }

    const updated: Todo = {
      ...existing,
      text: input.text ?? existing.text,
      completed: input.completed ?? existing.completed,
      updatedAt: new Date().toISOString()
    };

    this.db
      .prepare(
        `
          UPDATE todos
          SET text = @text,
              completed = @completed,
              updated_at = @updatedAt
          WHERE id = @id
        `
      )
      .run({
        ...updated,
        completed: updated.completed ? 1 : 0
      });

    return updated;
  }

  delete(id: string): boolean {
    const result = this.db.prepare("DELETE FROM todos WHERE id = ?").run(id);
    return result.changes > 0;
  }

  healthcheck(): { status: "ok"; db: "reachable" } {
    this.db.prepare("SELECT 1").get();
    return {
      status: "ok",
      db: "reachable"
    };
  }

  private findById(id: string): Todo | null {
    const row = this.db
      .prepare(
        `
          SELECT id, text, completed, created_at, updated_at
          FROM todos
          WHERE id = ?
        `
      )
      .get(id) as
      | {
          id: string;
          text: string;
          completed: number;
          created_at: string;
          updated_at: string;
        }
      | undefined;

    return row ? mapTodo(row) : null;
  }
}
