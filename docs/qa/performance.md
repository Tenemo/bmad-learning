# Performance report

## Command

```bash
npm run qa:perf
```

## Measurement context

- audit tool: Lighthouse CLI
- preset: desktop
- served build: production frontend bundle served through the Fastify preview server
- report artifact: `docs/qa/lighthouse-report.json`

## Key metrics

- performance score: `96`
- accessibility score: `100`
- best practices score: `100`
- first contentful paint: `2.1 s`
- largest contentful paint: `2.4 s`
- speed index: `2.1 s`
- total blocking time: `0 ms`
- cumulative layout shift: `0`
- time to interactive: `2.4 s`

## Assessment

The application is well within the expected performance range for this scope. The build is small, interaction logic is client-side, and the API round trips are short because the backend uses a local SQLite file and a minimal JSON surface.

## Follow-up opportunities

- reduce the main JavaScript bundle if the app grows past the current single-screen scope
- keep performance measurements on the production container path if the deployment target changes
