---
name: meridian
description: "Plans a body of work into a durable decision map and an executable route. Use whenever the user wants to plan something out — a feature or bug that needs scoping before code, an idea too vague to act on, a wish to brainstorm directions or concepts, or a feeling of being stuck in obvious ideas — even if they don't ask for a formal plan. Also use to resume or update an existing plan (a plans/ file or a tracker map item). Trigger phrases — plan this out, help planning, let's brainstorm, scope this, break this down, turn this idea into a plan, roadmap this. Don't use for naming or wording brainstorms, personal or event logistics, tasks the user mainly wants done now where a plan is incidental, a quick implementation sketch of a small in-session change, auditing existing code (run-crucible), or interrogating shipped work (apply-zetetic)."
---

# Meridian

The plan is the meridian — the fixed line the whole body of work steers by. Take bearings → diverge if fogbound → converge decision by decision → chart the route.

## The map

One artifact holds everything, and it outlives the session. Choose its home once, in this order:

1. **Tracker** — if the repo's instruction files (AGENTS.md, CLAUDE.md) name an approved issue tracker, or the user names one: a single map item holding the sections below, with linked sub-items for frontier decisions and route work, blocking relations wired — or recorded in the item body when the tracker has no relation feature. Confirm with the user before the first tracker write; planning writes into a shared system. Sub-items of killed or fog-bound decisions are closed with a one-line reason, never left orphaned. Reference items by name, never bare number — a wall of #42 #43 is illegible.
2. **File** — otherwise `plans/<slug>.md`, started from `assets/PLAN.template.md`.
3. **Directory** — escalate to `plans/<slug>/` only when the work genuinely needs multiple documents (spec, PRD, ADRs); the map file remains the index.

The map's sections, always all seven: **Destination** (one sentence the user would sign) · **Bearings** (context, constraints, appetite, who it's for) · **Decision log** (resolved, one line each) · **Frontier** (open decisions, typed, dependency-ordered) · **Fog** (too unclear to frame as a decision yet — with what would clarify each) · **Ruled out** (killed paths with kill reasons) · **Route** (the work breakdown).

**Resume first.** Before creating a map, look for one — glob `plans/*.md`, search the tracker for a map item matching the topic. If found, load it, restate Destination and the current frontier in two lines, and continue from there. If several maps plausibly match, list them and ask which to resume — never guess. Resuming a route-ready map re-opens it: new or reopened decisions go back on the Frontier and status returns to charting; a changed Destination instead marks the map superseded and starts a successor that links back to it.

**Subagents scout; you write** — the map is the cross-session handoff; subagent memory is not.

## Phase 1 — Take bearings

Name what the user brought — idea, feature, bug, or an itch to brainstorm — and try to state the Destination in one sentence they would sign. Then diagnose:

- Destination statable, and the user confirms it → create/resume the map, fill Destination and Bearings, go to Phase 3.
- Destination vague, candidate directions missing or all feel obvious, or the user signals stuckness → fill Bearings with what is known, go to Phase 2.
- The user rejects the candidate Destination without naming what's wrong → the rejection itself is fog; go to Phase 2.

Ask at most two orienting questions here; deeper questions belong to the frontier where they are tracked. Appetite (how much effort this is worth) is a Bearings entry — ask for it, never assume it.

Completion criterion: the map exists (or is resumed) with Bearings filled and either a signed Destination or a named fog symptom.

## Phase 2 — Diverge (only when fogbound)

MANDATORY READ [`references/divergence.md`](references/divergence.md) before running any move. Do NOT load it when Phase 1 routed straight to Phase 3.

**Degraded mode.** If `references/divergence.md` is missing or unreadable, do not block Phase 2 — fall back to this condensed core loop per move, run it inline, and tell the user the full reference was unavailable:

| Move | Symptom | Mechanic | Kill rule |
|---|---|---|---|
| Forced stimulus | No ideas, or every idea feels the same | Anchor on something unrelated to the domain; force a bridge from each of its properties | Kill bridges that needed the property redefined into vagueness; expect most to die |
| Purpose climb | Suspicion of solving the wrong problem | Climb "what is this in service of?" 2–3 levels; at each, generate 2–3 sibling problems that would also serve it | Kill strawman siblings; expect at least one real sibling to die on inspection |
| Provocation | A constraint everyone treats as unbreakable | State the impossible version as fact; extract the real mechanism from each consequence | Drop consequences with no extractable mechanism; if none yield one, the constraint is load-bearing — record that as a finding |
| Flip hunt | The current approach feels inevitable | Flip each load-bearing assumption to its strongest plausible opposite; hunt a real place where the flip already holds | No real "where" found kills the flip; expect at least one flip to die and at least one assumption to survive |

Match the symptom to one move — one move per pass, never two:

| Symptom | Move |
|---|---|
| No ideas, or every idea feels the same | Forced stimulus |
| Suspicion of solving the wrong problem | Purpose climb |
| A constraint everyone treats as unbreakable | Provocation |
| The current approach feels inevitable | Flip hunt |

Run the move's full loop from the reference, including its kill rule. Then close the pass with the meta-pattern scan and record everything on the map: survivors as candidate directions, dead ideas in Ruled out with kill reasons. Present survivors to the user and let them pick the direction — divergence never converges on their behalf. A second pass with a different move is allowed if the user asks or nothing survived; otherwise proceed to Phase 3.

Completion criterion: the user has picked a direction, the Destination is written from it, and Ruled out is non-empty or the barren pass is recorded — control passes to Phase 3 with that Destination.

## Phase 3 — Converge (the frontier loop)

Populate the Frontier breadth-first: sweep the whole body of work — scope, users, data, interfaces, sequencing, risks, quality bar — and write every open decision as its own entry before resolving any. Type each by what unblocks it:

- **J (judgment)** — only the user can answer.
- **R (research)** — evidence from the codebase or the world can answer it.
- **E (experiment)** — talking cannot settle it; only a small spike can.

Wire dependencies (a decision blocked by another waits). What cannot yet be framed as a decision goes to Fog with a note on what would clarify it.

Then loop until the frontier is empty — always the unblocked decision that unblocks the most:

- **J** — interview the user **one question at a time**; multiple questions at once is bewildering. Each question carries 2–4 concrete options, a recommended answer marked as such, and the recommendation's main weakness named. Wait for the answer before the next question.
- **R** — send a scout subagent for evidence; it returns findings with citations (file, line, URL). Present findings plus a recommendation for the user's sign-off — evidence gathering is delegable, judgment is not.
- **E** — write the spike into the Route as a work item whose stated outcome resolves the decision; the decision stays on the Frontier marked `deferred → route #n`, and whoever runs the spike records its outcome in the Decision log. Do not argue it to a fake resolution.

After each resolution: one line in the Decision log; options killed for cause go to Ruled out with their kill reasons — an option merely not chosen is not a killed path, so record it only when the reason it lost would matter later; graduated Fog and newly discovered decisions onto the Frontier. Update the map after every resolution, not in a batch at the end — the session may not outlive the batch.

Completion criterion: no unblocked, undeferred entries remain on the Frontier — every decision is resolved in the log, deferred on the Frontier to a Route spike, or moved to Fog with a named trigger for revisiting.

## Phase 4 — Chart the route

Distill the Decision log into the Route: ordered work items, each with acceptance criteria and a reference to the decision(s) that shaped it — a route item no decision demanded is scope creep; flag it or cut it. Spikes from Phase 3 keep their place in the order. Write route items as tracker sub-items or in the Route section; escalate to `plans/<slug>/` documents only if Bearings demanded specs or ADRs.

End by naming the first move — the smallest route item that unblocks the most — and stop. Implementation is a different job; hand the route to it, and begin it only if the user explicitly says go after seeing the finished route.

Completion criterion: every log entry is reflected in the Route or explicitly needs no work; the first move is named; the map's status is set to route-ready; nothing has been implemented without an explicit go.

## Rules

- Ruled out stays on the chart — every killed path keeps its name and kill reason; visible dead ends are what make the surviving plan credible.
- A barren move says so — "this produced nothing" is a valid result, recorded as such. A session where every technique works was faked.
- Every recommendation names its main weakness; a recommendation without one is advertising.
- A finished map with an empty Ruled out section and no weighed alternatives in the Decision log is flagged to the user as untested — nothing was weighed, so nothing was chosen.
- Research answers cite their evidence; an uncited claim is speculation and is marked as such.

## NEVER

- **NEVER resolve a judgment decision without the user, then list "open questions" at the end**
  **Instead:** Ask before deciding — one question at a time through the frontier, recommendation attached.
  **Why:** A plan whose design was fixed before its questions were asked is a monologue; the answers that would change the design arrive after the design is done, and get ignored.

- **NEVER invent timelines or effort estimates**
  **Instead:** Record the user's appetite in Bearings; give the Route order and acceptance criteria only.
  **Why:** A confident "~4.5 weeks" nobody asked for anchors every later scoping conversation to a number with no evidence behind it.

- **NEVER ask a subagent to write the map**
  **Instead:** Scouts return text; the orchestrator writes every artifact.
  **Why:** The map is the only state that survives the session — an agent writing it directly leaves the orchestrator unable to reconcile what the map claims with what was actually decided.

- **NEVER start implementing route items on your own initiative**
  **Instead:** End by naming the first move and stop; implement only when the user explicitly says go after seeing the finished route.
  **Why:** Planning and doing in one sitting bends the plan toward whatever is easiest to execute right now — the route stops serving the destination and starts serving momentum. An explicit go after the route is charted carries no such pull.
