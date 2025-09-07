# PR: Workflow Pause/Resume + Fitness Read + UI Affordances (Walking Skeleton)

## Summary
Implements pause→resume for orchestration workflows and exposes read-only fitness metrics. Frontend wires Agora SSE with reconnect, renders **Resume** only when paused, and shows **before/after** velocity deltas (v1 vs v2 motifs).

**Why:** Enables the Act II → Act IV evolution beat: failed fix → learned motif with measurable improvement.

---

## Scope / Branch
- Branch: `feat/workflow-pause-resume+fitness`
- Components:
  - Backend (FastAPI): routes, events, state checks
  - Frontend (React): SSE backoff, ResumeButton, FitnessDashboard
  - Data layer: env-aware base URL, typed models

---

## Backend (FastAPI)

### Routes Added
- `GET /fitness/samples?project_id={id}&since={iso?}`
  - Returns: `{ items: FitnessSample[] }`
  - Use: chart “before/after” KPIs; optional `since` filter
- `PATCH /orchestrate/{workflow_id}/resume`
  - Validates: 404 if missing, 409 if not paused
  - Emits: `workflow.resumed` event

### Event Types (emitted)
- `workflow.paused` (existing)
- `workflow.resumed` (new)
- `workflow.completed` / `workflow.failed` (terminal; ensure consistency)

### State Machine
- Allowed: `paused → running` (resume)
- Disallowed: any other transitions (guarded by 409)

### Example cURL
```bash
# Resume a paused workflow
curl -X PATCH "$API/orchestrate/$WORKFLOW_ID/resume" -H "Content-Type: application/json" -d '{"action":"resume"}'

# Read fitness samples (since is optional)
curl "$API/fitness/samples?project_id=demo-project-uuid&since=2025-09-01T00:00:00Z"
```

---

## Frontend (React + TS)

### Data Layer
- `VITE_API_URL ?? "http://localhost:8000"` base URL
- SSE with exponential backoff (recovers after server restarts)
- `fetchFitness(projectId, since?)` returns `{ items }`

### UI Changes
- **AgoraThread**
  - Shows workflow state pill: `running / paused / completed`
  - Conditionally renders `<ResumeButton />` when `state === "paused"`
  - Pretty-prints `workflow.resumed` and terminal states
- **ResumeButton**
  - Calls `PATCH /orchestrate/{id}/resume`
  - Graceful error handling (toast/alert + console)
- **EditorWithMemory**
  - Dynamic hotspot lines inferred from recall results (no magic numbers)
- **FitnessDashboard**
  - Pulls `GET /fitness/samples`
  - Buckets velocity by motif suffix: `@v1` vs `@v2`
  - Displays v1 avg, v2 avg, and % improvement (down is better)

### Developer Notes
- Guard evidence chips with `Array.isArray(..)` before `.join()`
- Import and use `useMemo` where applicable
- Normalize status labels in display (`done → completed`)

---

## Metrics / KPIs
- **Velocity** (time-to-fix): expect ≥30% improvement v1 → v2 in demo seed
- **Attempts**: v1 ≥ 2; v2 == 1 (validator-failure counts only)
- **Trust** (accept ratio) and **Cost** (optional, follow-up)

**Baseline demo thresholds (enforced in code/tests where applicable):**
- Attempts: v1 ≥ 2, v2 = 1
- Velocity: ≥30% improvement

---

## Tests

### Backend Unit
- `PATCH /orchestrate/{id}/resume`:
  - 404 when workflow not found
  - 409 when state != paused
  - State transition `paused → running`
  - Emits `workflow.resumed`
- `GET /fitness/samples`:
  - Filters by `project_id`
  - Respects `since` boundary

### Frontend
- **Component**
  - `ResumeButton` calls PATCH and disables while loading
  - `FitnessDashboard` buckets v1/v2 and computes improvement
- **Integration**
  - Stub `EventSource`: simulate `workflow.paused` → click **Resume** → observe `workflow.resumed` → `workflow.completed`
  - SSE reconnect: simulate error; ensure stream resumes

**Dev commands (example):**
```bash
# Backend
pytest -q
uvicorn app.main:app --reload

# Frontend
pnpm test
pnpm dev
```

---

## Ops / Migrations
- **Env:** set `VITE_API_URL` for non-local deployments
- **SSE:** consider Last-Event-ID support later (optional)
- **Routes:** ensure only one GET handler remains for `/fitness/samples` (no duplicates)

---

## Rollback Plan
- Revert branch via “Revert” PR; migrations are non-destructive
- Feature-gate Resume button via env flag if needed
- Disable SSE auto-reconnect by setting `RECONNECT_MAX_ATTEMPTS=0` (optional hook)

---

## Screenshots / GIFs
- [ ] v1 run showing paused state + Resume button
- [ ] v2 run completing on first attempt
- [ ] Fitness dashboard with v1/v2 deltas visible
- [ ] SSE reconnect (backend restart → stream recovers)

---

## Risks & Mitigations
- **Recall quality** (Archivist): demo-seeded MemoryItems + two-stage recall (rerank)
- **Event flakiness**: UI also polls `/orchestrate/status/{id}` (belt + suspenders)
- **State divergence**: backend emits consistent terminal events; UI normalizes labels

---

## Out of Scope
- Promotion banner (governance UI)
- Provenance chips with rich hover cards
- Last-Event-ID resume
