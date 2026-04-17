# Coverage report

## Command

```bash
npm run coverage
```

## Results

Backend coverage from Vitest:

- statements: `80.49%`
- branches: `74.41%`
- functions: `94.11%`
- lines: `80.49%`

Frontend coverage from Vitest:

- statements: `88.34%`
- branches: `83.13%`
- functions: `89.47%`
- lines: `88.34%`

## Assessment

Both application layers exceed the submission target of 70 percent meaningful coverage. The remaining uncovered code is mostly thin bootstrap code such as `backend/src/server.ts` and `frontend/src/main.tsx`, while the exercised paths focus on application behavior:

- API validation, not-found handling, and persistence-backed CRUD flows
- optimistic UI updates and rollback behavior
- empty, loading, and error rendering

## Artifacts

- backend HTML report: `backend/coverage/index.html`
- frontend HTML report: `frontend/coverage/index.html`
