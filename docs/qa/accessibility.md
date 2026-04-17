# Accessibility report

## Commands

```bash
npm run qa:a11y
npm run qa:perf
```

## Results

- Playwright plus axe found `0` critical violations on the main application view
- Lighthouse accessibility score: `100`

## Notes

The automated accessibility check covers the rendered todo flow after seeding a real todo item. The UI uses semantic controls and explicit labels for the important interactions:

- the add form input uses a visible label
- the complete toggle exposes task-specific accessible names
- the delete action exposes task-specific accessible names
- the error banner is rendered with an alert role

## Residual risks

Automated auditing is strong for critical issues but does not replace keyboard-only or screen-reader exploratory review. The current evidence meets the course target of zero critical WCAG violations.
