---
name: ai-forge-update
description: "Guided update for an existing SKILL.md or agent definition: structured recap, drift detection, change elicitation with conflict checking, per-item application with approval, and post-change quality gate. Use when an existing skill or agent needs revision, modification, or improvement. Triggers: update/modify/revise/change this skill, edit SKILL.md, improve a skill, update this agent."
---

# AI Forge Update

Understand before touching. Confirm before applying. Judge what you've done.

---

## Phase 0 — Load & Recap

**Skip condition**: If an `ai-forge-recap` result for the same artifact is already in the conversation context, verify the name matches, skip Phase 0 entirely, and proceed to Phase 1 using that recap.

**MANDATORY — Before reading the artifact, fetch current platform docs:**
- **WebFetch `https://code.visualstudio.com/raw/docs/copilot/customization/agent-skills.md`** — VS Code-specific constraints (file naming, pattern types, line limits)

For skills only, also reference the bundled spec at `ai-forge-judge/references/agentskills-spec.md` for frontmatter validation.

If fetch fails, proceed with knowledge already in context; note "docs unavailable — using cached knowledge" in the drift check output.

Identify the target artifact. The user may name it, paste a path, or point to it in context.

If no artifact is identified, ask once: "Which skill or agent do you want to update? (name or path)"

If the named file does not exist, stop: "Can't find [name] — check the path and re-invoke."

Read the artifact completely. Produce a structured recap:

```
## [Name] — Recap

**Does:** [1–2 sentences: core task and when it fires]
**Type:** [Skill / Agent]
**Pattern:** [Tool / Process / Navigation / Mindset / Philosophy] (skills only)
**Workflow:** [numbered phases or key steps, one line each]
**NEVER rules:** [count] covering [topics]
**References:** [list references/ files, or "none"]
```

**Drift check**: compare the frontmatter `description` field against the actual implementation. If they diverge, surface the discrepancy:

```
Drift detected: [what the description says] vs [what the artifact actually does]
(s)uggest fixes / (i)gnore and continue
```

On `(s)`: produce a corrected description and add it to the Phase 1 change list as item 0. On `(i)`: proceed without changing the description.

Confirm with user: `Does this match your understanding? (y)es / (n)o`

---

## Phase 1 — Change Elicitation Loop

**Goal**: A numbered change list that is specific, unambiguous, and consistent with the existing artifact. Do not touch the file until the list is confirmed.

### Loop

Elicit changes, paraphrase back with the updated change list and consistency check, then ask:

```
(c)ontinue / (r)evise
```

On `(r)`: collect more input, update the change list, loop again.
On `(c)`: lock the numbered list and proceed to Phase 2.

After each response, produce:

```
## Proposed changes

1. [Change — specific enough to apply unambiguously]
2. ...

## Consistency check

[ ] Rule conflict: [conflicting rule text, or "none"]
[ ] Duplicate guidance: [overlapping section, or "none"]
[ ] Principles violation: [issue, or "none"]
[ ] Scope unclear: [vague term that needs scoping, or "none"]
```

### What triggers each consistency flag

**Rule conflict**: New NEVER contradicts an existing NEVER; new step breaks existing flow order.

**Duplicate guidance**: New section covers the same ground as an existing one — flag and ask: "merge or replace?"

**Principles violation**: NEVER missing WHY or INSTEAD. Request for generic advice ("write clean code", "be thorough"). Any rule that restates what Claude does by default.

**Scope unclear**: "Make it shorter" without specifying what to cut; "improve it" without specifying how. Resolve to specific sections or criteria before adding to the list.

Loop does not advance on ambiguity. Every item in the confirmed list must be independently actionable.

---

## Phase 2 — Apply Changes

Invoke `ai-forge-apply` on the confirmed change list from Phase 1. Apply each item the user approves; skip declined items. After apply completes, show a concise diff summary:

```
## Changes applied

- [file]:[lines] — [one-line description]
```

If any change affects the artifact's structure or pattern type, verify the pattern still matches:

**Skill line limits**: Body ≤ 200 lines (overflow → `references/`).
**Agent line limits**: Body ≤ 300 lines.

---

## Phase 3 — Judge & Apply

Invoke `ai-forge-judge` on the modified artifact. Always invoke `ai-forge-apply` on the findings it produces. After apply completes, proceed to Phase 4.

If apply applied zero findings (every item skipped or marked obsolete), surface:

```
No judge findings applied — (a)ccept current grade / (r)evise scope / (q)uit without saving
```

On `(r)`, return to Phase 1 with the judge report's improvement list pre-loaded as draft.

If apply stalls on an item (same rejection after 3 revisions), surface:

```
Stuck on [item] — (a)ccept current state / (r)evise scope / (s)kip
```

---

## Phase 4 — Save & Close

Write the updated artifact to the path it was read from.

Print a one-block close-out:

```
## ai-forge-update — done

**File:** [path] ([N] lines, pattern: [Tool/Process/...])
**Applied:** [count] / [total] proposed changes
**Judge:** [grade] — [N applied / M reviewed-not-applied from Phase 3]
```

---

## NEVER

- **NEVER apply changes before Phase 1 produces a confirmed change list**
  **Instead:** Run the elicitation loop until the user responds `(c)ontinue`.
  **Why:** Applying ambiguous changes produces a result the user didn't want.

- **NEVER skip the four-point consistency check on each proposed change**
  **Instead:** Run all four checks every iteration, even for simple-sounding requests.
  **Why:** "Add a NEVER rule" sounds trivial but frequently introduces rule conflicts.

- **NEVER use ai-forge-apply in Phase 1**
  **Instead:** Phase 1 is elicitation only. Use ai-forge-apply in Phase 2 for application.
  **Why:** Mixing elicitation and application in the same phase confuses which loop the user is in.

- **NEVER skip Phase 3 (ai-forge-judge) after applying changes**
  **Instead:** Always judge the modified artifact before presenting for final approval.
  **Why:** A change that looks correct can silently drop quality below grade.

- **NEVER proceed to Phase 3 if apply applied zero changes**
  **Instead:** Show the final board and offer `(r)evise change list / (q)uit without saving`.
  **Why:** Judging an unchanged file produces the same grade as before.

- **NEVER apply Phase 2 changes outside ai-forge-apply**
  **Instead:** Always hand the confirmed change list to `ai-forge-apply`.
  **Why:** Per-item approval is the user's only veto point before the file is written.
