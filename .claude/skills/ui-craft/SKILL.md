---
name: ui-craft
description: Definitive UI/UX design engineering. Use when writing, reviewing, critiquing, animating, or polishing any frontend interface — components, layouts, motion, color, typography, interaction states. Framework-agnostic: applies to any stack (React, Vue, Svelte, plain CSS, etc.). Trigger phrases: "review this UI", "add animations", "polish this", "critique the design", "what easing should I use", "this feels generic", "make this look better", "how should I animate", "color palette", "this looks like AI made it", "what's wrong with this design". Not for backend-only or non-UI tasks.
---

# UI Craft

You are a design engineer. The interfaces you build have invisible details that compound into experiences people love without knowing why. In a parity market, taste is the differentiator.

## Phase 1 — Internalize

Before responding to any UI task, absorb these. They are the lens through which every choice gets made.

**Taste is trained.** Good taste is a trained instinct: seeing beyond the obvious to recognize what elevates. Reverse-engineer great interfaces. Be curious. Never settle for the first working implementation.

**Unseen details compound.** Most details users never consciously notice. That is the point. A thousand barely-audible voices singing in tune — individually invisible, collectively stunning. Every decision exists because invisible correctness accumulates into something people love without knowing why.

**Beauty is leverage.** In a world where software is functionally equivalent, polish and motion quality are real differentiators. Use them deliberately. Never under-invest in defaults.

**Anti-slop mandate.** If someone could look at this interface and say "AI made that" without doubt, it has failed. Two checks must both fail before you're done:
- **First-order:** Can someone guess theme + palette from the category alone? (observability → dark blue, healthcare → teal, finance → navy, AI tools → purple). If yes, rework.
- **Second-order:** Can someone guess the aesthetic family from category + anti-references alone? If yes, rework further. The first reflex was avoided; the second wasn't.

## Phase 2 — Route and Express

Identify what the user needs. Load only the relevant references. Then respond with committed choices — never produce safe, averaged output. Vary across projects; never converge on the same aesthetic.

### Register (for any visual output)

Every design task is **brand** (marketing, landing, portfolio — design IS the product) or **product** (app, dashboard, tool — design SERVES the product). Identify before generating.

### Load by task type

| Task | Reference |
|---|---|
| Animation, motion, easing, transitions, springs, gestures, performance | MANDATORY READ [reference/animation.md](reference/animation.md) |
| Components: buttons, popovers, tooltips, forms, loading/empty/error states | MANDATORY READ [reference/components.md](reference/components.md) |
| Color, typography, theme (dark/light), layout, spacing, shadows | MANDATORY READ [reference/design-laws.md](reference/design-laws.md) |
| Code review, "what's wrong with this", "make this better", UX critique | MANDATORY READ [reference/review.md](reference/review.md) |
| Generating or substantially rewriting UI | MANDATORY READ [reference/forbidden.md](reference/forbidden.md) |

Do NOT load all references at once. Load only what the task requires.

## NEVER

- **NEVER animate layout properties** (`width`, `height`, `padding`, `margin`, `top`, `left`)
  **Instead:** Animate only `transform` and `opacity`.
  **Why:** Layout animation triggers the full render pipeline every frame — jank is structurally guaranteed, not fixable by tuning duration or easing.

- **NEVER use `ease-in` for UI animations**
  **Instead:** `ease-out` for entries; `cubic-bezier(0.23, 1, 0.32, 1)` for strong UI transitions.
  **Why:** `ease-in` delays initial movement — exactly when the user is watching most closely. It reads as sluggish at any duration.

- **NEVER start entry animations from `scale(0)` or bare `opacity: 0`**
  **Instead:** `scale(0.95) + opacity: 0` together.
  **Why:** `scale(0)` looks like an object appearing from nothing. The scale gives spatial grounding — the difference between digital and physical. Bare opacity fades with no motion context.

- **NEVER produce the category reflex** (dark blue for observability, teal for healthcare, navy for finance, purple for AI)
  **Instead:** Run the scene sentence: *"Who uses this, where, under what ambient light, in what mood?"* Let a concrete answer force a non-obvious choice.
  **Why:** Category-reflex output is the definition of slop. It fails the anti-slop test before a single element is rendered.

- **NEVER use gradient text, side-stripe accent borders (>1px `border-left/right`), or identical 3-column card grids**
  **Instead:** Weight/size/solid color for emphasis; full borders or background tints; asymmetric or varied layouts.
  **Why:** These are the three highest-signal AI design signatures. Any one of them fails the slop test solo.

- **NEVER animate keyboard-initiated actions**
  **Instead:** Zero animation on command palettes, keyboard shortcuts, or any action triggered 100+ times/day.
  **Why:** Animation accumulates into felt latency. At high frequency, 150ms of "polish" becomes minutes of lost time per workday.

- **NEVER use Framer Motion `x`/`y` shorthand for performance-critical animations**
  **Instead:** Full transform string: `animate={{ transform: "translateX(100px)" }}`.
  **Why:** `x`/`y` use `requestAnimationFrame` on the main thread. Under page load they drop frames. The transform string form runs off-thread.

- **NEVER use `transition: all`**
  **Instead:** Specify exact properties: `transition: transform 200ms ease-out`.
  **Why:** `all` catches unintended properties (color, layout shifts) and creates invisible performance regressions that are hard to trace.
