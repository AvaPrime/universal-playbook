# Reviewer Checklist

- [ ] **Backend**: 404/409 guards work; `workflow.resumed` emitted; `completed/failed` sent on finish
- [ ] **Frontend**: Resume button **only** in paused; clicking resumes and Agora shows `workflow.resumed`
- [ ] **SSE**: Force a server restart mid-run; stream reconnects and messages continue
- [ ] **Fitness**: v1 vs v2 velocity deltas visible; improvement ≥ demo threshold
- [ ] **Hotspots**: overlays derive from recall (not hardcoded lines)
- [ ] **Env**: App respects `VITE_API_URL`
- [ ] **Code hygiene**: no duplicate `/fitness/samples` route; status naming consistent; imports clean
- [ ] **Performance**: page interactive <2s on localhost; SSE reconnect <1s median
- [ ] **UX polish**: Resume button disabled while loading; empty-state messages visible when no fitness data yet
