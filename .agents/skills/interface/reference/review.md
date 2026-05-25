# Review Reference

## Output Format (Non-Negotiable)

When reviewing UI code, output a single markdown table. Never use "Before:" / "After:" on separate lines.

```
| Before | After | Why |
| --- | --- | --- |
| `transition: all 300ms` | `transition: transform 200ms ease-out` | Specify exact properties; `all` catches layout and causes invisible regressions |
```

One row per issue found. The "Why" column states the non-obvious failure mode — not a restatement of what changed.

**Wrong format (never do this):**
```
Before: transition: all 300ms
After: transition: transform 200ms ease-out
──────────────────────────────────────────
Before: scale(0)
After: scale(0.95)
```

## Review Checklist

Scan for these in order. Each maps to a row in the output table.

| Issue | Fix |
|---|---|
| `transition: all` | `transition: transform 200ms ease-out` (specify exact properties) |
| Entry animation from `scale(0)` | Start from `scale(0.95)` with `opacity: 0` |
| `ease-in` on any UI element | Switch to `ease-out` or custom `cubic-bezier(0.23, 1, 0.32, 1)` |
| `transform-origin: center` on popover | Set to trigger location via component library CSS variable (modal: exempt) |
| Animation on keyboard-triggered action | Remove animation entirely |
| Duration >300ms on everyday UI | Reduce to 150–250ms |
| Hover animation without touch guard | Add `@media (hover: hover) and (pointer: fine)` |
| Keyframes on rapidly-triggered element | Replace with CSS transitions for interruptibility |
| Shorthand motion properties on GPU-critical path | Use full `transform` string for hardware acceleration |
| Same speed for enter and exit | Make exit faster (e.g., enter 2s deliberate, exit 200ms snap) |
| List items appearing simultaneously | Add stagger delay (30–80ms per item) |
| Gradient text | Replace with solid color + weight/size emphasis |
| Side-stripe border as accent | Full border, background tint, or icon instead |
| `border-left/right` >1px as card accent | Rewrite structure entirely |
| Pure `#000` or `#fff` | Tint neutrals toward brand hue (OKLCH chroma 0.005–0.01) |
| Identical repeating card grid | Asymmetric layout, bento, zig-zag, or vary size/proportion |
| Modal for simple confirmation | Inline action, slide-over, or progressive disclosure |
| Full-height section using `h-screen` | Replace with `min-height: 100dvh` |
| Generic placeholder names/avatars | Invent realistic names; use intentional placeholders |
| Em dash in copy | Comma, colon, semicolon, or parentheses |

## UX Critique vs. Code Review

**Code review:** User shares code. Output the Before/After/Why table targeting the file's actual issues.

**UX critique:** User shares a screenshot, description, or design. Output structured findings:
1. **Hierarchy:** Is the visual weight telling the right story?
2. **Flow:** Can a first-time user accomplish the primary task without reading instructions?
3. **Feedback:** Does every action have a visible response?
4. **Edge cases:** What happens when the list is empty? When the input errors? When the content is too long?
5. **Slop check:** Run the anti-slop test (first-order + second-order category reflex).

## Severity Framing

Lead with the highest-severity issues. Three tiers:

- **Structural** — Breaks at scale (layout collapse, `h-screen`, animating layout properties). Fix before anything else.
- **Experience** — Users will feel it (wrong easing, missing `:active` state, modal overuse). High priority.
- **Polish** — Invisible individually, visible in aggregate (transition timing, stagger, blur, transform-origin). Fix last.

## After Review

If generating the fixed version: load [reference/forbidden.md](reference/forbidden.md) and verify the output doesn't introduce new issues from that list. A review that fixes `ease-in` but adds gradient text has net-negative value.
