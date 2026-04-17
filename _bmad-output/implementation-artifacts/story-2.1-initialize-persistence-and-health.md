# Story 2.1: initialize persistence and health

## Goal

Create the SQLite persistence layer and `/health` endpoint.

## Acceptance criteria

- SQLite schema initializes automatically
- backend can connect to the configured database path
- `/health` returns `{ status: "ok", db: "reachable" }`
- errors are surfaced cleanly

## Status

ready-for-dev
