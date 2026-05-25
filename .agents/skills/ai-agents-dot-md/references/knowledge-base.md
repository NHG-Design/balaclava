# AGENTS.md Knowledge Base

---

## Empirical Facts

- **Optimal size**: 100–150 line AGENTS.md + focused reference docs = 10–15% cross-metric improvement in mid-size modules (~100 core files)
- **Diminishing returns**: Beyond 150 lines, gains reverse — longer files actively hurt
- **Progressive disclosure**: Top performer pattern. Keep common workflows high-level in AGENTS.md, push details into reference files
- **Procedural workflows**: Strongest single pattern measured. Correctness +25%, completeness +20%. Numbered multi-step workflows move agents from "unable to complete" to "correct on first try"
- **Decision tables**: 25% improvement on `best_practices` metric. Resolve ambiguity before the agent writes code
- **Real code examples**: 3–10 lines from actual production code improve reuse. More than that → agent pattern-matches on the wrong thing
- **"Don't" + "Do" pairing**: Warning-only docs consistently underperform. 15+ sequential "don'ts" with no "dos" → overexploration, conservative behavior, less work done
- **Discovery rates**: AGENTS.md = 100% discovery. References from AGENTS.md = 90%+. Directory README = 80%+. Nested READMs = 40%. Orphan docs = <10%
- **Module-level > repo-root**: Module-specific AGENTS.md outperforms cross-cutting repo-root files
- **Overexploration trap**: Too much architecture overview or excessive warnings → agent reads dozens of docs, loads 100K+ tokens, output quality drops
- LLM-generated context files **reduce** agent task success rates and increase inference cost by 20%+
- Developer-written files: marginal +4% improvement, only when minimal and precise
- **Unnecessary requirements actively harm agent performance** because agents follow them faithfully, broadening exploration
- Agents "default to non-interactive behavior without explicit encouragement"
- Contradictory priorities without explicit ordering → agent skips verification and rushes

---

## Core Principles

### 1. Minimal by Design
If a constraint can be expressed elsewhere (linter, type checker, CI gate), it must NOT live in AGENTS.md. The tool IS the constraint.

### 2. Toolchain First
Correct: `Lint: \`pnpm lint\` (Biome — see biome.json)`
Wrong: A list of what Biome enforces.

### 3. Pink Elephant Problem (Context Anchoring)
Telling an agent what NOT to do keeps the concept active in attention. Saying "do not use tRPC" makes tRPC highly active. Better: fix the underlying ambiguity (delete the legacy code, add a linter rule) and then delete the instruction.

### 4. Command-First
Instructions without verification commands are suggestions, not rules. Every instruction should answer: "What command proves this was done correctly?"

### 5. Closure Definitions
Define "done" as specific exit codes, not feelings. Without explicit closure, "done" means "I think I'm done."

### 6. Task-Organized Sections
"When Writing Code / When Reviewing / When Releasing" > flat categorized lists. The "When…" prefix maps to how agents reason about task context.

---

## What Gets Ignored (Empirically Proven)

| Pattern | Why It Fails |
|---------|-------------|
| Prose paragraphs without commands | No actionable instruction, no verification mechanism |
| Ambiguous directives ("be careful", "optimize where possible") | Not a constraint, not a trigger condition, not a behavior spec |
| Contradictory priorities without ordering | Agent can't satisfy all simultaneously → skips verification |
| Style guides without enforcement commands | No mechanism to verify compliance = suggestion, not rule |
| Architecture overviews | Pulls agent into reading dozens of docs (overexploration) |
| 15+ warnings without alternatives | Agent over-explores, stays conservative, does less work |

---

## What Works (Empirically Proven)

| Pattern | Effect | Example |
|---------|--------|---------|
| Command-first instructions | Unambiguous, verifiable by exit code | `Test: \`pytest -v --tb=short\`` |
| Closure definitions | Eliminates false "done" reports | "Task complete when ALL exit 0: lint, test, typecheck" |
| Procedural workflows (numbered steps) | +25% correctness, +20% completeness | 6-step deploy workflow |
| Decision tables | +25% best_practices | "Server-only data? → React Query. Multi-path mutations? → Zustand" |
| Real code examples (3–10 lines) | Improves pattern adherence | Snippet from production code |
| "Don't" paired with "Do" | Prevents overexploration | "Don't instantiate HTTP clients → Use shared apiClient from lib/http" |
| Task-organized sections | Agent selects relevant subset | "When Writing Code / When Reviewing / When Releasing" |
| Escalation rules | Prevents destructive workarounds | "If tests fail after 3 attempts: stop and report" |
| Progressive disclosure | Controls context budget | Main file concise, reference files for details |

---

## Three-Tier Boundary System (ASDLC)

```
NEVER (Hard judgment limits):
- Never commit secrets, tokens, or .env files
- Never add external dependencies without discussion

ASK (Human-in-the-loop triggers):
- Ask before running database migrations
- Ask before deleting files

ALWAYS (Proactive judgment):
- Explain plan before writing code
- Handle all errors explicitly
```

---

## Optimal Structure (Priority Order)

Add sections in this order. Each layer builds on the previous:

1. **Build and test commands** — agent needs these before anything useful
2. **Definition of done** — prevents false completions
3. **Escalation rules** — prevents destructive workarounds
4. **Task-organized sections** — reduces irrelevant parsing
5. **Directory scoping** (monorepos only) — isolates service instructions

Skip style preferences until the first four work.

---

## Cross-Tool Compatibility

| Tool | Native File | Reads AGENTS.md? |
|------|-------------|-----------------|
| Codex CLI | AGENTS.md | Yes (native, full hierarchy + override) |
| Cursor | `.cursor/rules` | Yes (auto-discovered) |
| GitHub Copilot | `.github/copilot-instructions.md` | Yes (native) |
| Amp | AGENTS.md | Yes (co-creator of standard) |
| Windsurf | `.windsurfrules` | Yes (auto-discovered) |
| Gemini CLI | `GEMINI.md` | Configurable |
| Claude Code | CLAUDE.md | No (symlink recommended) |
| Aider | `CONVENTIONS.md` | Manual (`--read AGENTS.md`) |

---

## Monorepo Strategy

- Root-level: broad baseline (stack, global conventions, CI)
- Module/service-level: specific commands, testing patterns, domain context
- Closest AGENTS.md wins — deeper files take precedence
- OpenAI's Codex repo uses 88 separate AGENTS.md files
- Codex supports `AGENTS.override.md` to replace (not extend) parent instructions

---

## Auditing Checklist

Periodically remove:
- Style rules that a linter now enforces
- Library restrictions that tsconfig/ESLint enforces
- Persona definitions moved to skill files
- Codebase overviews copied from README
- LLM-generated sections from `/init` commands (treat as draft)
- Instructions where the underlying friction has been fixed (deleted legacy code, added linter rule)

---

## The Acid Test

> Ask the agent to explain your build commands. If it can't reproduce them verbatim, the instructions aren't being read or are too verbose to retain in context.
