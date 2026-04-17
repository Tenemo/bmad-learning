# Product requirements document

## Executive summary

Build a complete full-stack todo application for a single user. The application must be simple to understand, fast to interact with, durable across sessions, and polished enough to feel finished even though the scope is deliberately narrow.

The product will use a React frontend and a Fastify backend backed by a SQLite database. It must support CRUD task management, responsive UI behavior, clear error/loading/empty states, automated testing, and Docker Compose deployment.

## Vision

Deliver the smallest possible task manager that still feels dependable and thoughtfully designed. The app should remove friction from capturing and completing tasks while keeping the technical foundation ready for later expansion.

## User success

- I can add a task quickly
- I can see my full list immediately
- I can mark work complete and understand the state at a glance
- I can remove tasks that are no longer relevant
- I do not lose my data after refresh or restart
- I get understandable feedback if something fails

## Business and training success

- Demonstrate BMAD-driven spec-first execution from planning through QA
- Produce the training deliverables required for submission
- Show disciplined use of AI and document its real strengths and limits

## User journey

1. The user opens the application and immediately sees either an existing todo list or an empty state.
2. The user enters a short description and submits a new todo.
3. The UI reflects the new item immediately and persists it through the API.
4. The user marks an item complete and sees the visual state change immediately.
5. The user deletes an item and sees the list update without a full page reload.
6. If the network or backend fails, the user sees a clear error state and can retry.

## Functional requirements

### FR1

The system shall display all existing todos on application load.

### FR2

The system shall allow a user to create a todo with a short text description.

### FR3

The system shall persist created todos in durable storage so they survive refreshes and restarts.

### FR4

The system shall allow the user to update a todo completion state.

### FR5

The system shall visually distinguish completed todos from active todos.

### FR6

The system shall allow the user to delete a todo.

### FR7

The system shall expose a backend API that supports listing, creating, updating, and deleting todos.

### FR8

The system shall validate incoming API data and return structured client-safe errors for invalid requests.

### FR9

The frontend shall show explicit empty, loading, and error states.

### FR10

The frontend shall support desktop and mobile layouts without loss of core functionality.

### FR11

The system shall expose a health endpoint for service checks.

### FR12

The project shall provide automated unit, component, integration, and E2E tests.

### FR13

The project shall run through Docker Compose with production-like frontend and backend containers.

## Non-functional requirements

### Performance

- Normal interactions should feel immediate
- The UI should update optimistically where appropriate
- The backend should keep the todo API lightweight and low-latency

### Reliability

- Data must remain durable across sessions
- Error states must be handled without blank screens or crashes
- Tests must be deterministic and free from flaky timing assumptions

### Maintainability

- The codebase shall be organized into clear frontend and backend boundaries
- TypeScript shall be used across the application
- The API and domain model shall remain simple and extensible

### Security

- API inputs shall be validated
- SQL access shall use parameterized statements
- User-provided todo text shall render safely
- CORS configuration shall be explicit

### Accessibility

- The application shall support keyboard navigation
- Interactive elements shall have accessible names
- The project shall target zero critical violations in automated accessibility checks

## MVP scope

- CRUD todo API
- responsive todo UI
- optimistic updates
- robust state handling
- SQLite persistence
- Docker Compose deployment
- QA evidence and AI integration documentation

## Future scope

- edit todo text inline
- authentication
- multi-user data isolation
- due dates and priorities
- task grouping and filtering
- reminders or notifications
