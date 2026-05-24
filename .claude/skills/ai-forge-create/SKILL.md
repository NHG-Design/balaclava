---
name: ai-forge-create
description: "Create a new skill (SKILL.md), agent definition (.agent.md), or instruction file via discovery recap, pattern selection, knowledge delta discipline, ai-forge-judge + ai-forge-apply quality gate. Use when converting ad-hoc knowledge into a reusable skill, scaffolding an agent for a new VS Code workflow, or creating instruction files for glob-pattern matching. Triggers: create a skill, write a skill, new skill, SKILL.md, build a skill, create an agent, new agent, scaffold an agent."
---

# AI Forge Create

Write skills and agents that score ≥B on ai-forge-judge out of the box. Every section must earn its tokens.

---

## Phase 1 — Discovery

Build understanding through a running recap. Ask questions to fill gaps; after each exchange, show the current recap:

```
## Discovery Recap

**Domain:** [what the skill/agent covers, or "unknown"]
**Artifact type:** [Skill / Agent / Instruction file]
**Decisions:** [non-obvious choices the agent must make, or "unknown"]
**Failure modes:** [what breaks without this artifact, or "unknown"]
**Audience:** [fragile/creative output, or "inferred: ..."]
**Size:** [reference files needed, or "inferred: self-contained"]
```

Then ask: `(a)ccept / (r)evise / (q)uit`

- `a` — recap is complete; proceed to Phase 2
- `r` — user adds or corrects; update recap and loop
- `q` — abort

Do not proceed to Phase 2 until the user accepts the recap. Domain, artifact type, decisions, and failure modes must be filled before accepting.

---

## Phase 2 — Pattern Selection

**For Skills**: MANDATORY — READ [`references/skill-patterns.md`](references/skill-patterns.md) before selecting a pattern. Do NOT load this file for agents.

**For Agents**: MANDATORY — READ [`references/agent-patterns.md`](references/agent-patterns.md) before selecting a pattern. Do NOT load this file for skills.

Select one pattern. State your choice and the one-line reason before drafting. If no pattern clearly fits, default to Process and note: "Pattern: Process (closest fit — no exact match for this domain)."

---

## Phase 3 — Draft

Write the description before the body. Draft the body around what the description promises.

Write to earn tokens. For every paragraph, ask: **"Does Claude already know this?"**

- If yes → delete it
- If "it's a useful reminder" → one line max, then move on
- If no → expand it; this is the value

Before writing each section, ask: **"What failure mode does this prevent?"** If you can't answer, you haven't earned the paragraph.

### Description requirements (THE most critical field)

- Answers WHAT (what does it do?)
- Answers WHEN (trigger scenarios — "Use when...", "Trigger phrases:")
- Contains searchable KEYWORDS (domain terms, file extensions, action verbs)
- Max 1024 chars for skills; concise and actionable for agents

### Line limits

| Artifact | Body limit | Overflow strategy |
|----------|-----------|-------------------|
| Skill SKILL.md | 200 lines | Split to `references/` with MANDATORY READ triggers |
| Agent .agent.md | 300 lines | No overflow — must be self-contained |
| Instruction file | 150 lines | Keep lean — loads eagerly on glob match |

### NEVER rules format — every NEVER must have:
```
- **NEVER [specific construct/pattern]**
  **Instead:** [concrete alternative]
  **Why:** [non-obvious failure mode this avoids]
```

Vague warnings ("be careful", "avoid errors") are prohibited.

### Progressive disclosure (skills only)

- Body > 200 lines → move heavy content to `references/`
- Any section with a decision tree of 4+ branches → extract to `references/`
- Add MANDATORY READ triggers at the exact workflow step that needs it
- Add "Do NOT load" guidance for files irrelevant to the current scenario

### Agent frontmatter (VS Code .agent.md format)

```yaml
---
name: agent-name
description: What the agent does and when to use it
model: [Claude Sonnet 4.6 / Claude Opus 4.6 / Claude Haiku 4.5]
tools: ['tool1', 'tool2']
---
```

Optional fields: `user-invocable`, `disable-model-invocation`, `agents` (restrict subagents).

---

## Phase 4 — Self-Evaluate

Invoke `ai-forge-judge` on the draft. Target: ≥B (80%+).

If judge returns zero improvements (grade A, empty list), skip ai-forge-apply and proceed to Phase 5: "Judge returned A with no improvements — proceeding to review offer."

Otherwise, invoke `ai-forge-apply` on the numbered improvements list. Do not apply fixes manually.

If ai-forge-apply stalls on a dimension (same item rejected after 3 revisions), surface it to the user: "Stuck on [dimension] — here's what I tried. Options: accept the current draft, revise the scope, or skip."

---

## Phase 5 — Review Offer

After Phase 4 completes, offer the interactive design review:

> "Want me to stress-test this design? Say 'review this' to run `ai-forge-review`."

This is optional but recommended for agents and complex skills.

---

## Review Checklist (before finalizing)

Re-read Phase 3 requirements. Verify the draft satisfies description requirements (WHAT/WHEN/KEYWORDS) and line limits. If anything fails, fix before submitting to ai-forge-judge.

---

## NEVER

- **NEVER write a section that restates Claude defaults** ("write clean code", "handle errors", "be helpful")
  **Instead:** Ask: "Would Claude do this without being told?" If yes, delete it.
  **Why:** Default restatements dilute expert signal and train authors that padding is acceptable.

- **NEVER add a NEVER rule without WHY and INSTEAD**
  **Instead:** Complete the three-part format before moving on.
  **Why:** A prohibition without an alternative gets violated when the obvious path is blocked.

- **NEVER dump all content in a single file**
  **Instead:** Keep skill body under 200 lines; move detail to `references/` with MANDATORY READ triggers.
  **Why:** A bloated body loads all at once on every invocation — drowns agent in irrelevant content.

- **NEVER skip Phase 4** (ai-forge-judge self-eval)
  **Instead:** Run it even if the draft feels good.
  **Why:** Skills that skip self-eval consistently have U1 or U3 gaps that aren't obvious to the author.

- **NEVER manually apply ai-forge-judge findings one-by-one**
  **Instead:** Invoke `ai-forge-apply` on the numbered improvements list.
  **Why:** Manual application skips the approval loop and defeats the purpose of the numbered format.

- **NEVER add README.md, CHANGELOG.md, or documentation about the artifact itself**
  **Instead:** Include only what the agent needs to perform the task.
  **Why:** Meta-documentation is never loaded during execution — it wastes directory space.

- **NEVER write a vague description without explicit WHEN triggers and searchable keywords**
  **Instead:** Include "Use when...", specific scenarios, and domain-specific terms.
  **Why:** The description is the only thing the agent sees when deciding which skill to load — poor description = skill never activates.
