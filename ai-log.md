# AI integration log

## Project context

- Project: full-stack todo app for the BMAD training activity
- Repo: `bmad-learning`
- Date started: 2026-04-17
- Execution mode: BMAD stable `v6.3.0` with Codex skills

## Setup and orchestration

### BMAD installation

- Installed BMAD with modules `bmm`, `bmb`, `cis`, and `tea`
- Installed Codex skill output into `.agents/skills`
- Installed `uv` because it is listed as a current BMAD prerequisite
- Confirmed BMAD status after installation to make sure the right modules and Codex integration were active

### Agent usage

- John was used for the product brief, PRD refinement, PRD validation intent, and epic/story decomposition
- Winston was used for architecture decisions, data flow, API shape, and Docker deployment choices
- the UX workflow was used to lock layout, empty/error/loading states, and accessibility expectations before implementation
- Amelia was used for implementation sequencing, story slices, code review checkpoints, and coding tasks
- Murat was used for the system-level risk-based test strategy and the later QA evidence pass

## Tasks completed with AI assistance

- BMAD installation and workspace setup
- planning artifact generation under `_bmad-output/`
- backend API and SQLite persistence implementation
- frontend component and optimistic state flow implementation
- API integration tests, component tests, and Playwright scenarios
- Dockerfiles, Compose orchestration, and health checks
- QA report drafting from actual command outputs

## Prompts and instructions that worked best

- highly constrained stack decisions up front prevented generic architecture drift
- story slices framed around one behavior at a time produced better code and tests than larger backlog chunks
- explicit verification commands in the prompt made it easier to keep the implementation aligned with the grading rubric
- giving the todo CRUD, empty state, and error handling flows as hard requirements led to stronger E2E coverage

## What AI did well

- Quickly turned the supplied PRD into a structured implementation backlog
- Helped lock the simplest viable stack without drifting into unnecessary platform complexity
- Kept planning artifacts aligned with the actual success criteria from the course
- Generated a solid first pass of tests that covered real behavior instead of only trivial assertions

## What needed correction

- The first BMAD install attempt failed because PowerShell split the comma-separated module list
- A partial install caused BMAD to fall back to quick-update instead of a full install
- The plan had to be adjusted to current BMAD stable behavior because the training material still references older personas and flows
- The first Lighthouse script used the Node API incorrectly and assumed Chrome would be launched automatically

## MCP and tooling notes

- No browser MCP servers were available in this Codex session
- The project therefore uses CLI Playwright, axe, and Lighthouse instead of Playwright MCP or Chrome DevTools MCP
- This limitation is documented rather than hidden
- No Postman MCP or browser DevTools MCP was used in this environment

## Test generation notes

- AI generated API integration tests for create, list, update, delete, validation errors, and not-found responses
- AI generated component tests for empty, loading, optimistic, and error behavior
- AI generated six Playwright checks covering empty state, create and reload, complete, delete, backend-read failure, and accessibility
- The main misses were around cleanup and isolation rather than test intent

## Debugging with AI

- The Fastify delete path initially failed in the browser because the fetch helper always set `Content-Type: application/json`, even when there was no request body
- The Playwright suite initially used parallel execution against shared SQLite state, which caused nondeterministic interference between tests; constraining workers to one fixed the real root cause
- The Lighthouse audit initially failed because Chrome was not being launched for the programmatic run, and then failed again on Windows-specific temporary profile cleanup; the script now launches Chrome explicitly and cleans up a managed profile directory after process exit

## Human judgment points

- The implementation stack was locked deliberately instead of leaving it open-ended
- Docker architecture was simplified to frontend and backend containers with SQLite stored in a named volume
- Browser automation was kept CLI-based because no MCP browser tools were available in this environment
- The API list response was kept as `{ items: Todo[] }` so the contract stays extensible without changing the route shape later

## Limitations encountered

- BMAD helped structure the process but still required manual correction when generated guidance drifted from the current stable release behavior
- AI was weaker at platform-specific operational details such as PowerShell quoting and Windows Chrome cleanup behavior
- The environment had no live browser MCP support, so interactive debugging stayed CLI-driven

## Framework comparison

Compared with ad hoc AI-assisted development, BMAD was slower at the beginning but more reliable for this training format because it forced explicit artifacts, acceptance criteria, and test intent before implementation. The extra ceremony would feel heavy for a tiny throwaway prototype, but for a graded deliverable with planning and QA evidence requirements it reduced ambiguity and made the final submission easier to defend.
