# Architecture

## Architecture summary

The system is a two-tier web application with a React frontend and a Fastify backend. SQLite provides durable local persistence. The frontend communicates with the backend over a small REST API and uses optimistic updates for task mutations. Docker Compose orchestrates the frontend and backend containers for local deployment.

## Technology decisions

- Frontend: React, Vite, TypeScript, TanStack Query
- Backend: Fastify, TypeScript
- Persistence: SQLite via `better-sqlite3`
- Validation: Zod on the backend
- Testing: Vitest, Testing Library, Playwright, axe, Lighthouse CLI
- Deployment: Docker multi-stage builds and Docker Compose

## System components

### Frontend

- Renders the todo interface
- Fetches todos from `/api/todos`
- Performs optimistic create, update, and delete flows
- Displays loading, empty, and error states

### Backend

- Exposes `/health` and `/api/todos` endpoints
- Validates request parameters and bodies
- Initializes the SQLite schema on startup
- Persists and retrieves todos through a small repository layer

### Database

- Single SQLite file stored on disk
- Mounted into the backend container through a named volume
- Schema consists of one `todos` table with timestamps

## Data model

### Todo

- `id`: string UUID
- `text`: string, trimmed, non-empty
- `completed`: boolean
- `createdAt`: ISO timestamp
- `updatedAt`: ISO timestamp

## API design

### `GET /health`

- Returns service and database health

### `GET /api/todos`

- Returns all todos sorted by creation time descending

### `POST /api/todos`

- Accepts `{ text: string }`
- Returns the created todo

### `PATCH /api/todos/:id`

- Accepts partial updates for `text` and `completed`
- Returns the updated todo

### `DELETE /api/todos/:id`

- Deletes the todo if present
- Returns `204` on success

## Error handling

- Validation failures return `400` with a structured error body
- Missing records return `404`
- Unexpected failures return `500` with a generic safe message
- The frontend converts failed reads and writes into user-visible error banners

## Deployment model

### Local development

- frontend dev server runs separately from backend
- Vite proxies `/api` and `/health` to the backend

### Local automated QA

- backend serves the built frontend static assets when `STATIC_ROOT` is configured
- one local HTTP origin is used for Playwright and Lighthouse to avoid proxy drift

### Docker

- backend container runs the compiled Fastify server as a non-root user
- frontend container serves the Vite build through `nginx:alpine`
- nginx proxies `/api` and `/health` to the backend container

## Architectural constraints

- keep the API intentionally small
- do not add authentication or multi-user logic
- prefer clear boundaries over premature abstraction
- keep tests deterministic and free from arbitrary sleeps
