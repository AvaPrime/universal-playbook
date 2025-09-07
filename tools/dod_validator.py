#!/usr/bin/env python3
import os, sys, re, json

REQUIRED = [
  "Summary","Scope / Branch","Backend (FastAPI)","Frontend (React + TS)",
  "Metrics / KPIs","Tests","Ops / Migrations","Rollback Plan","Risks & Mitigations"
]

body = os.environ.get("PR_BODY","")
missing = [s for s in REQUIRED if s.lower() not in body.lower()]

if missing:
    print("PR missing sections:", ", ".join(missing))
    sys.exit(2)
print("DOD validator: OK")
