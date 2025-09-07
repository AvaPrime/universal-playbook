# Definition of Done (Org-wide)

A change is done when:
1. PR template sections are filled (or “N/A by design”).
2. CI is green: lint, type-check, tests, coverage >= repo threshold, OPA policy passes.
3. Rollback plan is present and believable.
4. Metrics/KPIs for the change are reported in the PR (or explicitly deferred).
5. Docs updated (README/CHANGELOG/API docs) when behavior changes.
6. Feature flags guard risky UX/traffic-facing changes.
7. At least one human approval in CODEOWNERS path.
