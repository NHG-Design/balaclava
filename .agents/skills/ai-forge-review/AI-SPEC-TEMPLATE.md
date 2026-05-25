# AI Definition Spec: [Name]

This is an **optional** reference for thinking through agent design before or after a review.
You do not need to fill this out to use `ai-forge-review` — just say "review my agent"
and the skill will walk you through everything interactively.

Use this template if you prefer to think on paper first, or keep a filled-out copy as
documentation after the review is complete.

**Type:** Agent _(this template is for agents only — skills don't need this level of documentation)_

---

## Purpose

**What it does (one sentence):**

> _e.g. "Validates all mandator JSON files against schema and reports violations."_

**What it must never do:**

> _e.g. "Never auto-fix or overwrite files without explicit user confirmation."_

---

## Model Configuration

| Setting     | Value | Justification                                                     |
| ----------- | ----- | ----------------------------------------------------------------- |
| Model       |       | _e.g. Claude Sonnet 4.6 — balanced cost/quality for coding tasks_ |

Refer to this guide:

| Tier         | Model             | Best for                                           |
| ------------ | ----------------- | -------------------------------------------------- |
| Fast/cheap   | Claude Haiku 4.5  | Routing, classification, simple extraction         |
| Balanced     | Claude Sonnet 4.6 | Most coding tasks, analysis, general-purpose       |
| Powerful     | Claude Opus 4.6   | Complex reasoning, nuanced judgment, costly errors |

---

## Tools & Permissions

| Tool / Permission | Why it is needed | What could go wrong | Mitigation |
| ----------------- | ---------------- | ------------------- | ---------- |
|                   |                  |                     |            |

---

## Instructions Review Checklist

- [ ] Another person interpreted the instructions the same way I intended
- [ ] No weasel words ("appropriately", "as needed", "ensure quality")
- [ ] Output format is explicitly defined
- [ ] If AI-assisted: I verified all referenced tools/APIs actually exist
- [ ] Instruction files loaded lazily, not all at once
- [ ] Output format is compatible with downstream agents (if pipeline)
- [ ] Tested with a representative mandator/market scenario (if touching settings/locales)

---

## Failure Modes

**If the model hallucinates, what happens?**

**If a tool call fails, what happens?**

**Is there an iteration/cost limit?**

**Who gets notified on failure?**

---

## Context Window Strategy

**Must this agent run in its own chat session?** (Yes for pipeline agents)

**Which `.github/instructions/` files does it load?**

| Instruction file                  | Load strategy | When needed                      |
| --------------------------------- | ------------- | -------------------------------- |
| _e.g. typescript.instructions.md_ | _Lazy_        | _During TS implementation phase_ |

---

## Pipeline Integration

**Is this agent part of the spec-driven pipeline?** (Yes / No / Standalone)

**Input contract** — what does it receive?
> _e.g. "An approved spec file at `specs/ONECON-XXXXX.md`"_

**Output contract** — what does it produce?
> _e.g. "Code changes committed to a feature branch, spec status updated to `done`"_

**Handoff mechanism:** (spec file / git history / other)

---

## Mandator / Market Impact

**Does this agent touch settings, locales, or market config?** (Yes / No)

If yes:
- Does it understand the merge hierarchy? (`markets → _brand → _user → _preset → _feature → _env → _backend`)
- Which brands are affected? (BMW / MINI / Rolls-Royce / BMW Motorrad / All)
- Does it reference `MandatorSettings.ts` for type safety?

---

## Blast Radius

**If this agent goes completely wrong, what is the worst realistic outcome?**

**Is that outcome reversible?**

**Does it overlap with an existing agent?** Check `.github/agents/` for:
- `writer.agent.md` (Opus — researches codebase, generates specs or PRDs)
- `implementer.agent.md` (Sonnet — implements from specs/PRDs)
- `bug-fixer.agent.md` (Sonnet — diagnoses and fixes defects)
- `accessibility.agent.md` (Sonnet — WCAG review)
- `reviewer.agent.md` (Opus — validates implementation against spec criteria)
