---
name: ai-agents-dot-md
description: "Create or review AGENTS.md files for repositories. Use when user wants to generate agent documentation, scaffold AGENTS.md, review an existing AGENTS.md for quality, or make their repo agent-friendly. Triggers: AGENTS.md, agent docs, review agents file, create agents file, coding agent context, repository setup for AI."
---

# AI Create / Review AGENTS.md

Two modes: **create** a new AGENTS.md or **review** an existing one against research-backed quality standards.

## Mode Detection

- User provides an existing AGENTS.md or points to one → **Review mode**
- User asks to create/scaffold/generate → **Create mode**
- Ambiguous → ask: `(c)reate a new AGENTS.md or (r)eview an existing one?`

---

## Create Mode

### Step 1: Ask placement

```
Where should the AGENTS.md be placed?
(r)oot — repo-wide baseline
(p)ath — specific directory (provide path)
```

For monorepos: suggest root + per-package files. Closest AGENTS.md wins.

If AGENTS.md already exists at target path → ask: `File exists. (r)eview existing / (o)verwrite / (Q)uit?`

### Step 2: Expert thinking

Before writing, determine for THIS project:

- **What's undiscoverable?** What can't be inferred from package.json, configs, or directory structure?
- **What's dangerous?** What commands or patterns cause silent failures?
- **What's ambiguous?** Where are there two valid approaches and the agent would guess wrong?
- **What's non-standard?** What conventions differ from framework defaults?

If all answers are "nothing" — the project may not need an AGENTS.md. Say so.

For repos without package.json or build configs (docs-only, data repos, simple scripts): focus on Mission + Judgment boundaries only — toolchain and closure sections won't apply.

### Step 3: Write in priority order

Add sections ONLY if they pass the undiscoverable test, in this order:

1. **Mission** (2–4 sentences) — project purpose + core constraint the agent can't infer
2. **Toolchain registry** — commands as table, NOT what tools enforce
3. **Judgment boundaries** — NEVER / ASK / ALWAYS tiers
4. **Closure definition** — "Done" = specific exit codes
5. **Escalation rules** — what to do when blocked
6. **Task-organized sections** — "When writing… / When reviewing… / When releasing…"

### Step 4: Validate

- Total ≤ 150 lines (optimal: 60–100)
- Each section ≤ 50 lines
- Every instruction answers: "What command proves this was done?"
- Every "don't" is paired with a "do"
- No linter rules restated (toolchain first)
- No prose paragraphs without commands

**MANDATORY — READ [`references/knowledge-base.md`](references/knowledge-base.md)** for research-backed patterns and evidence.
**MANDATORY — READ [`references/template.md`](references/template.md)** for starter structure.
**Do NOT load** `references/knowledge-base.md` during Review mode if the target AGENTS.md is < 20 lines — the body checklist and anti-pattern list suffice for trivially short files.

---

## Review Mode

Evaluate the provided AGENTS.md against research-backed quality criteria.

### Scoring Dimensions

| Dimension | Weight | What to check |
|-----------|--------|---------------|
| Signal density | 25% | % of lines that are undiscoverable expert knowledge vs. generic/redundant |
| Command-first | 20% | Every instruction has a verifiable command or exit code |
| Closure definition | 15% | Explicit "done" criteria with specific checks |
| Boundary system | 15% | NEVER/ASK/ALWAYS tiers present and specific |
| Length discipline | 10% | ≤150 total, ≤50 per section, no bloat |
| Anti-pattern absence | 15% | Free of proven-to-fail patterns |

### Scoring Guidance

- Score **harshly on signal density** for mature repos with established toolchains — most content is likely redundant
- Score **leniently on closure/boundaries** for greenfield projects — they may not have CI gates yet
- Score **harshly on length** for monorepo root files — these get loaded on every session across all packages
- If total score < 40: recommend rewrite rather than incremental fixes

### Anti-Pattern Checklist

Flag any of these (empirically proven to hurt agent performance):

- [ ] Prose paragraphs without commands
- [ ] Ambiguous directives ("be careful", "where possible")
- [ ] Contradictory priorities without explicit ordering
- [ ] Style rules already enforced by linter config
- [ ] Architecture overviews (causes overexploration)
- [ ] 15+ warnings without paired alternatives
- [ ] LLM-generated boilerplate from `/init` commands
- [ ] Restating what the toolchain enforces
- [ ] Pink elephant violations (long "do not" lists keeping banned concepts active)

### Output Format

```
## AGENTS.md Review: <filename or path>

**Score**: X/100
**Verdict**: [Production-ready / Needs work / Rewrite recommended]

### Strengths
- ...

### Issues (by severity)
1. [CRITICAL] ...
2. [HIGH] ...
3. [LOW] ...

### Rewrite Suggestions
- ...
```

**MANDATORY — READ [`references/knowledge-base.md`](references/knowledge-base.md)** for the research evidence behind each criterion.

---

## NEVER

- **NEVER include content the agent can discover from repo structure** — package.json scripts, directory layout, and config files are self-documenting; restating them wastes tokens and creates maintenance drift. **INSTEAD:** reference the file (`see biome.json`) and move on.
- **NEVER restate linter/formatter rules** — the tool IS the constraint; duplication creates staleness and unnecessary requirements actively harm agent performance. **INSTEAD:** list only the run command (`Lint: \`pnpm lint\``).
- **NEVER write a "don't" without a paired "do"** — warning-only docs cause overexploration; 15+ don'ts without alternatives makes agents conservative and less productive. **INSTEAD:** pair every prohibition with the correct alternative.
- **NEVER exceed 150 lines** — beyond this threshold, gains reverse and the file actively hurts quality. **INSTEAD:** extract detail into referenced files or delete.
- **NEVER use LLM-generated content as final** — `/init` output is an inventory of what the agent already knows; it reduces performance and inflates cost. **INSTEAD:** treat as draft inventory, then strip everything the toolchain already enforces.
- **NEVER write prose paragraphs** — agents skip them; use commands, tables, and bullets with verifiable outcomes. **INSTEAD:** convert to command + exit code + one-line description.