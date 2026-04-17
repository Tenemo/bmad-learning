# bmad learning todo app

## Overview

This repository contains a BMAD-driven full-stack todo application. The project follows a greenfield BMAD flow from product brief and PRD through architecture, story planning, implementation, QA, and Docker packaging.

The delivered application supports:

- creating todos
- listing persisted todos
- marking todos complete or active
- deleting todos
- showing empty, loading, and error states
- running unit, integration, accessibility, and end-to-end checks

## Stack

- frontend: React 19, Vite, TanStack Query
- backend: Fastify, SQLite, Zod
- testing: Vitest, Playwright, axe, Lighthouse CLI
- packaging: Docker, Docker Compose
- BMAD modules: `bmm`, `bmb`, `cis`, `tea`

## Repository structure

- `frontend/` contains the React application
- `backend/` contains the Fastify API and SQLite persistence layer
- `tests/e2e/` contains Playwright end-to-end and accessibility tests
- `_bmad-output/` contains BMAD planning and implementation artifacts
- `docs/qa/` contains the QA evidence generated for submission
- `ai-log.md` records how AI and BMAD guided the work

## API summary

- `GET /health` returns `{ "status": "ok", "db": "reachable" }`
- `GET /api/todos` returns `{ "items": Todo[] }`
- `POST /api/todos` creates a todo
- `PATCH /api/todos/:id` updates `text` and or `completed`
- `DELETE /api/todos/:id` deletes a todo

Each todo contains:

- `id`
- `text`
- `completed`
- `createdAt`
- `updatedAt`

## BMAD artifacts

The implementation was planned and tracked with BMAD stable `v6.3.0`. The main generated artifacts live under `_bmad-output/`:

- `planning-artifacts/product-brief.md`
- `planning-artifacts/prd.md`
- `planning-artifacts/prd-validation-report.md`
- `planning-artifacts/ux-design.md`
- `planning-artifacts/architecture.md`
- `planning-artifacts/epics_and_stories.md`
- `planning-artifacts/implementation-readiness-report.md`
- `implementation-artifacts/sprint_board_phase1.md`
- `implementation-artifacts/sprint-status.yaml`
- `implementation-artifacts/story-*.md`
- `skills/test-artifacts/test-design.md`

## Run locally

Install dependencies from the repository root:

```bash
npm install
```

Start the local development servers:

```bash
npm run dev
```

The frontend runs on `http://127.0.0.1:5173` and the backend runs on `http://127.0.0.1:3001`.

## Run with Docker Compose

Build and start the packaged application:

```bash
docker compose up --build
```

The packaged stack exposes:

- frontend: `http://127.0.0.1:8080`
- backend: `http://127.0.0.1:3001`

SQLite data is stored in the named volume `todo_data`.

## Verification commands

Run the core verification steps from the repository root:

```bash
npm run tsc
npm run lint
npm run test
npm run build
npm run coverage
npm run test:e2e
npm run qa:a11y
npm run qa:perf
```

The generated QA summaries are stored in:

- `docs/qa/coverage.md`
- `docs/qa/accessibility.md`
- `docs/qa/performance.md`
- `docs/qa/security.md`

## BMAD guidance and framework comparison

Compared with ad hoc prompting, BMAD made the front-loaded planning much stricter. The main gain was earlier convergence on API shape, test scope, and delivery slices before code existed. The tradeoff was extra overhead and some manual correction when current BMAD stable behavior did not line up perfectly with older course notes. For this project, that tradeoff was worth it because the grading criteria are artifact-heavy and BMAD keeps those artifacts explicit instead of implied.
