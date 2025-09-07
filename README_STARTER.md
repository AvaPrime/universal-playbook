# Universal Playbook Starter (Humans + Agents)

This starter codifies a shared ritual across repos *and* AI agents. It includes:
- A pro-grade PR template and reviewer checklist
- A Definition of Done
- OPA policy stubs for CI gating
- JSON Schemas for Task Cards and Results (agent handoffs)
- A DoD validator script
- TRAE agent manifests (Planner, Implementer, Critic, Verifier, Librarian, Governor, Conductor)
- CI workflow template

## Handling Dependency Conflicts & Deadlocks
- **WIP limits** prevent pile-ups (see `trae/agents/conductor.yaml`).
- **Task graph**: the Conductor builds a DAG from Task Cards; edges = file/path ownership. Cycles trigger automatic *backoff + reassign*.
- **Optimistic locking**: Implementer locks path globs (e.g., `/app/routes/**`) in PR title/description; Conductor denies new cards that overlap without an explicit dependency link.
- **Merge queue** with auto-rebase ensures sequencing; Governor blocks merges when lockfiles or migrations conflict.

## Adaptive Performance Budgets
- Track baselines per branch in CI (e.g., store `perf.json` as an artifact). Budgets are *baseline ± tolerance* (e.g., +10%). If baseline drifts for 3 consecutive merges, update the budget and require reviewer ack in PR.
- Perf gates run in Verifier. Human can override with a one-use label (e.g., `perf-waiver-1x`).

## Rollback Drills ("Break Glass")
- A scheduled CI job runs a **revert simulation** weekly: `git revert <last-release>` in a dry-run, compiles/tests, and reports status.
- PRs must include a concrete rollback command block. Governor checks presence; Verifier validates the dry-run path in CI on merge queue.

## Agent Health Checks
- Agents emit heartbeats each N minutes; Conductor kills/restarts on missed heartbeats.
- Hard caps: max run minutes, max retries, and *last-good-checkpoint* resumption.
- Self-audit: prior to handoff, agents must produce a short “assumptions + diffs touched” note; Critic verifies against Task Card.

## Context Preservation
- ADR index (`/docs/adr/*.md`) + semantic index; Planner must cite ADR IDs in task plans.
- Vector KB seeded with `docs/` and previous PRs; Planner/Implementer queries must include citations to proceed.
- Result objects include `artifact_refs` that link to ADRs and PRs for traceability.

## Learning Feedback Loop
- Reviewers use rubric labels (e.g., `rubric:naming`, `rubric:test-gaps`, `rubric:perf`).
- Nightly job mines labeled PR comments → updates agent prompts/playbooks and produces a rolling "Agent Coaching Report".
- Golden PR set: keep 5 exemplary PRs; new agents fine-tune prompts against these exemplars.

## Getting Started
1. Drop this folder into `.github/` + `docs/` roots of a repo (or keep as a template repo).
2. Wire OPA eval in CI (replace the stub step).
3. Connect TRAE agents with the included manifests and give them MCP access (GitHub, OPA, CI, Puppeteer, Vector KB).
4. Open a test PR using the provided template and watch the gates light up.

---

*This is the small grammar that keeps humans and very-motivated-interns aligned.*
