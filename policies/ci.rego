package ci.policy

default allow = false

# Input contract example:
# input = {
#   "pr": { "body": "....", "changed_files": ["app/routes/x.py"] },
#   "ci": { "coverage": 82, "coverage_min": 80 },
#   "secrets_scan": { "found": false }
# }

missing_sections := sections {
  required := ["Summary","Scope / Branch","Backend (FastAPI)","Frontend (React + TS)","Metrics / KPIs","Tests","Ops / Migrations","Rollback Plan","Risks & Mitigations"]
  sections := [s | s := required[_]; not contains(lower(input.pr.body), lower(s))]
}

deny[msg] {
  count(missing_sections) > 0
  msg := sprintf("PR missing required sections: %v", [missing_sections])
}

deny[msg] {
  input.ci.coverage < input.ci.coverage_min
  msg := sprintf("Coverage %v%% is below minimum %v%%", [input.ci.coverage, input.ci.coverage_min])
}

deny[msg] {
  input.secrets_scan.found == true
  msg := "Secrets scanner found potential secrets in the diff"
}

allow {
  not deny[_]
}

# helper
contains(haystack, needle) {
  indexof(haystack, needle) >= 0
}
