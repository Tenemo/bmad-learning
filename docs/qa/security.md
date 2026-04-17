# Security review

## Scope

This review covered the todo API, frontend rendering path, persistence layer, and Docker-facing runtime configuration for the delivered single-user application.

## Findings

No critical security issue was found in the shipped scope.

Current mitigations:

- request payloads are validated with Zod and reject empty or oversized todo text
- SQLite operations use prepared statements and bound parameters rather than string-built SQL
- todo text is rendered through React without `dangerouslySetInnerHTML`, which avoids a direct XSS sink in normal rendering
- CORS is allowlist-based and configurable through environment variables instead of using a wildcard
- the runtime containers use non-root users

## Residual risks

- there is no authentication or authorization because the project is intentionally single-user and local-first
- there is no rate limiting yet, so a public internet deployment should add it before exposure
- SQLite is appropriate for this scope, but not a substitute for a hardened multi-user data tier
- server errors are intentionally generic, but logs should still be handled carefully in shared environments

## Recommended next steps

- add rate limiting before any public deployment
- add authentication and per-user data isolation before introducing multi-user access
- pin and periodically review transitive dependencies as part of ongoing maintenance
