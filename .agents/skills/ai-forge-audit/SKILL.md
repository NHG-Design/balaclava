---
name: ai-forge-audit
description: "Batch-evaluate all skills and agents in the repo with ai-forge-judge and render a single consolidated grade report sorted by grade (worst first) so effort is directed correctly. Use when reviewing overall skill/agent quality, finding where to invest improvement effort, or after bulk changes. Triggers: audit all skills, grade report, skill health check, where should I focus, audit agents."
---

# AI Forge Audit

Batch-run ai-forge-judge across every skill and agent in the repo. One consolidated report — grades, top issues, priority order. Read-only: no fixes applied.

Requires `ai-forge-judge` to be installed. If not found at `.github/skills/ai-forge-judge/SKILL.md`, stop: "ai-forge-judge skill not found — install it before running audit."

---

## Workflow

### Phase 1 — Discover

Scan for all evaluatable artifacts:

**Skills**: Glob for all SKILL.md files under `.github/skills/`:
```
pattern: .github/skills/*/SKILL.md
```

**Agents**: Glob for all agent definitions:
```
pattern: .github/agents/*.agent.md
```

Collect the directory/file name of each match — that's the artifact name.

If zero artifacts found: output "No skills or agents found." and stop.

### Phase 2 — Evaluate

For each discovered artifact, sequentially (do not parallelize — parallel evaluation risks context overflow and makes progress unreadable):

1. Invoke `ai-forge-judge` on it.
2. From the judge output, extract and record:
   - Artifact name
   - Type (Skill / Agent)
   - Grade (A/B/C/D/F)
   - Score (X/Y, Z%)
   - Numbered Improvements: up to 5 items (prefer compounding improvements — fixing X enables Y to score higher; deprioritize cosmetic when structural issues exist)

Emit a one-line status per artifact as each evaluation completes:
```
✓ ai-forge-create     B  (87/120, 73%)  [Skill]
✓ writer              A  (108/120, 90%)  [Agent]
✓ ai-forge-apply      C  (74/120, 62%)  [Skill]
```

If N > 10: output "About to run N evaluations — this may take several minutes. Proceed? (y/n)" and stop if denied.

If an artifact's judge run errors: record `ERR` and the error message; continue to the next. Do not abort.

### Phase 3 — Render Report

Sort results by grade ascending: F → D → C → B → A. Worst grades appear first.

Split artifacts into two groups:
- **Needs Work**: grade below B (< 80%)
- **Passing**: grade B or above (≥ 80%)

Output a single markdown report:

````markdown
# AI Forge Audit
_<YYYY-MM-DD> — <N> artifacts evaluated (<S> skills, <A> agents)_

## Grade Summary

| Artifact | Type | Grade | Score |
|----------|------|-------|-------|
| ai-forge-X | Skill | F | 55/120 (46%) |
| writer | Agent | C | 78/120 (65%) |
| ai-forge-Z | Skill | B | 98/120 (82%) |

## Needs Work

### ai-forge-X — F (55/120, 46%) [Skill]

1. <improvement 1 from judge>
2. <improvement 2>
3. <improvement 3>

### writer — C (78/120, 65%) [Agent]

1. <improvement 1>
2. <improvement 2>

## Passing (B+)

| Artifact | Type | Grade | Score |
|----------|------|-------|-------|
| ai-forge-Z | Skill | B | 98/120 (82%) |

## Skipped

| Artifact | Reason |
|----------|--------|
| some-dir | No SKILL.md found |
````

If all artifacts pass: omit the "Needs Work" section.
If no artifacts pass: omit the "Passing" section.
If nothing was skipped: omit the "Skipped" section.

---

## NEVER

- **NEVER display full judge reports inline for each artifact**
  **Instead:** Extract only grade, score, and top 1–5 numbered improvements per artifact.
  **Why:** Unfiltered judge output for 6+ artifacts floods the context window.

- **NEVER apply any fixes during an audit run**
  **Instead:** Output the report only. Direct the user to `ai-forge-apply` or `ai-forge-update` for remediation.
  **Why:** Mixing diagnosis with treatment makes it impossible to know what the baseline was.

- **NEVER sort by name or alphabetically**
  **Instead:** Sort by grade ascending (F first, A last) within each section.
  **Why:** Alphabetical sort buries the worst artifacts; the report's job is to surface where effort is needed most.

- **NEVER abort the audit when a single artifact errors**
  **Instead:** Record `ERR` for that artifact and continue to the next.
  **Why:** A failed judge run on one artifact should not discard results already collected for others.
