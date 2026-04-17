# Test design

## Test strategy summary

- Author: Murat
- Mode: system-level design
- Risk model: prioritize the primary CRUD loop and persistence guarantees

## Priority areas

### P0

- create todo
- list persisted todos
- complete todo
- delete todo
- application availability and database reachability

### P1

- invalid input handling
- optimistic update rollback behavior
- loading and empty state rendering
- user-visible error recovery

### P2

- responsive layout checks
- non-critical visual regressions

## Test layers

### Unit and component

- validation helpers
- repository edge cases
- React state rendering for empty, loading, and error conditions

### Integration

- API endpoint behavior through Fastify request injection
- SQLite-backed persistence behavior

### E2E

- create
- complete
- delete
- empty state
- error handling

## Quality constraints

- no flaky sleeps
- isolate state through API cleanup or test-specific data
- treat accessibility as part of the main path, not a separate afterthought
