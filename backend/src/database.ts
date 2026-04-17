import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";

const schema = `
  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

export function resolvePath(pathValue: string): string {
  return pathValue.startsWith(".") || !pathValue.includes(":")
    ? resolve(process.cwd(), pathValue)
    : pathValue;
}

export function openDatabase(pathValue: string): Database.Database {
  const dbPath = resolvePath(pathValue);
  mkdirSync(dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(schema);

  return db;
}
