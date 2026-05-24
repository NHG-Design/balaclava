---
name: ai-context-dot-md
description: "Create or review CONTEXT.md files — hierarchical, LLM-optimized repository documentation describing what a codebase IS (architecture, domain model, conventions). Dual mode: creates new CONTEXT.md at user-specified path, or reviews existing file for completeness and anti-patterns. Use when user wants to add CONTEXT.md, document codebase architecture for agents, define domain language, or says 'create context', 'review context', 'document this codebase'. Triggers: CONTEXT.md, context file, document architecture, domain model, codebase context."
---

# AI Context Dot MD

Create or review CONTEXT.md files that give agents the factual substrate needed to reason correctly about code.

---

## Mode Detection

- User provides a **path to an existing CONTEXT.md** → **Review Mode**
- User asks to **create/generate/add** a CONTEXT.md → **Create Mode**
- Ambiguous → ask: `(c)reate a new CONTEXT.md or (r)eview an existing one?`

---

## Create Mode

### Step 1 — Placement

Ask the user: "Where should the CONTEXT.md live?"

```
(r)oot — broad architecture overview
(p)ath — specific directory (provide path)
(m)ultiple — hierarchical (start with root, then children)
```

If a CONTEXT.md already exists at the chosen path, ask: `File exists. (o)verwrite from scratch / (r)eview and update / (Q)uit?` If review-and-update, switch to Review Mode first, then apply improvements.

If the scope has fewer than 5 files or a single obvious purpose, suggest: `This scope may be too small for a standalone CONTEXT.md — a section in the parent might suffice. (p)roceed anyway / (Q)uit?`

### Step 2 — Analyze

**MANDATORY READ** [`references/knowledge-base.md`](references/knowledge-base.md) for principles and patterns.

Before investigating, ask yourself:
- What would confuse a new agent about this scope?
- What terms mean something different HERE than in general usage?
- What implicit relationships aren't visible from file names alone?

Investigate the target scope:
- Read directory structure, key files, existing docs (README, AGENTS.md)
- Identify the domain model (entities, relationships, naming conventions in code)
- Map architecture (boundaries, data flow, abstractions)
- Note conventions that aren't obvious from code alone
- Find gotchas and known gaps

### Step 3 — Draft

**MANDATORY READ** [`references/template.md`](references/template.md) for structure.

Write sections in priority order:
1. **Overview** — one paragraph, what this scope IS
2. **Language** — domain terms with _Avoid_ alternatives (highest ROI section)
3. **Architecture** — boundaries and data flow
4. **Directory Structure** — purpose map (table format)
5. **Key Patterns** — how things work HERE (not general advice)
6. **Known Gaps** — things that will confuse without warning
7. **Children** — links to nested CONTEXT.md (if hierarchical)

Skip sections that add no value for the specific scope. A 3-section file is fine if those 3 sections are high-signal.

### Step 4 — Validate

Before presenting to user, verify:
- [ ] Every term in Language section appears in actual code (no invented abstractions)
- [ ] No section duplicates what's already in AGENTS.md or README
- [ ] Under 200 lines (if over → split into child CONTEXT.md files)
- [ ] No agent instructions (those belong in AGENTS.md)
- [ ] No setup/install steps (those belong in README)
- [ ] Relationships in Language section match actual code relationships

---

## Review Mode

### Verification Strategy

To verify Freshness and accuracy, load `codebase-map` (or `codebase-investigation` for deeper tracing). Confirm file paths, symbol names, and architectural claims mentioned in the CONTEXT.md still exist and are current.

### Scoring Dimensions

Evaluate the existing CONTEXT.md on 5 dimensions (1–5 scale):

| Dimension | 5 (Excellent) | 1 (Poor) |
|-----------|---------------|----------|
| **Domain Model** | All key terms defined with Avoid lists; relationships explicit | No Language section or vague definitions |
| **Architecture Signal** | Clear boundaries, data flow, abstractions named | Missing or just lists directory names |
| **Locality** | Scoped to its directory; links to children | Dumps entire project in one file |
| **Freshness** | Matches current code; no stale references | References removed files/patterns |
| **Separation** | Pure facts — no agent rules or setup instructions | Mixed with AGENTS.md/README concerns |

### Anti-Pattern Checklist

Flag if present:
- [ ] README-as-CONTEXT (setup instructions in CONTEXT.md)
- [ ] Tutorial style ("First do X, then Y...")
- [ ] Mixing concerns (agent behavior rules here)
- [ ] Stale references (files/patterns that no longer exist)
- [ ] Flat dump (>200 lines, no hierarchy)
- [ ] Missing Language section (most common gap)
- [ ] API documentation (endpoint details that belong in OpenAPI/JSDoc)

### Output Format

```
## CONTEXT.md Review: [path]

**Score:** [X/25] ([grade])
| Dimension | Score | Note |
|-----------|-------|------|
| Domain Model | X/5 | ... |
| Architecture Signal | X/5 | ... |
| Locality | X/5 | ... |
| Freshness | X/5 | ... |
| Separation | X/5 | ... |

**Anti-patterns found:** [list or "none"]

**Improvements:**
1. [specific, actionable improvement]
2. ...
```

Grade scale: A (22-25), B (18-21), C (14-17), D (10-13), F (<10)

---

## Hierarchical Guidance

When a project warrants multiple CONTEXT.md files:
- Root = architecture overview + domain model + child links
- Children = focused scope (one package, one domain, one layer)
- Never repeat child content in parent — link with one-line summary
- Suggest hierarchy only when project has 3+ distinct domains or packages

---

## NEVER

- **NEVER include agent behavior instructions in CONTEXT.md**
  **Instead:** Move rules/commands to AGENTS.md; keep CONTEXT purely factual.
  **Why:** Mixing concerns means agents load behavioral rules when they only need facts, causing instruction conflicts.

- **NEVER write tutorial-style prose ("First you...", "To do X, run...")**
  **Instead:** State facts: "X calls Y via Z" or "Authentication uses JWT with 24h expiry."
  **Why:** Tutorial style signals README/AGENTS.md content; agents can't extract architecture facts from procedural text.

- **NEVER invent domain terms not found in actual code**
  **Instead:** Grep the codebase for entity names before defining Language section.
  **Why:** Invented abstractions cause agents to generate code using names that don't exist, creating confusion.

- **NEVER exceed 200 lines in a single CONTEXT.md**
  **Instead:** Split into child CONTEXT.md files linked from a parent.
  **Why:** LLMs load entire files — bloated context wastes tokens and dilutes signal.

- **NEVER duplicate README content (setup, install, contributing)**
  **Instead:** Reference README for those concerns; CONTEXT.md covers what IS, not how to START.
  **Why:** Duplication drifts — one gets updated, the other becomes a lie.

- **NEVER create CONTEXT.md without noting the maintenance obligation**
  **Instead:** End create mode with: "Update this file in the same PR that changes architecture."
  **Why:** Stale CONTEXT.md is worse than no CONTEXT.md — agents trust it and make wrong decisions.

---

## Do NOT Load

- `references/knowledge-base.md` — only needed during Create Mode Step 2
- `references/template.md` — only needed during Create Mode Step 3
- `references/example.md` — load ONLY if user asks for an example or you need inspiration for a specific section
- In Review Mode, load `references/knowledge-base.md` only if you need to verify anti-patterns or compare against best practices — not for every review
