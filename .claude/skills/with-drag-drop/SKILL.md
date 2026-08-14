---
name: with-drag-drop
description: Expert guidance for implementing drag-and-drop in JavaScript from scratch — free-dragging elements, sortable lists, resizable panels, drop zones. Use when making an element draggable, adding pointer-based dragging, building a sortable or reorderable list, or implementing resize handles, without reaching for a third-party dependency. Covers a single reusable drag engine (activators, modifiers, base+offset tracking), click-vs-drag disambiguation, transform-based live tracking, pointer capture, touch support, cleanup, and keyboard accessibility. Don't use for native OS file drag-and-drop (dataTransfer, File API) or HTML5 draggable-attribute-only reordering.
---

# Drag and Drop — Implementation Guidance

Custom pointer-driven dragging, built directly (not native HTML5 `draggable`/`dataTransfer` — that's a separate, OS-integrated mechanism this skill does not cover, and no third-party dependency is required for anything below). One core engine, extended per scenario — not several competing approaches to pick between. Apply **Core Rules** to everything you build; **The Core Engine** describes the shared shape; **Extending the Engine** covers each scenario.

## The Core Engine

Every scenario below is the same three-part shape, just configured differently:

1. **Activators** — whatever starts/moves/ends the gesture. A pointer activator (pointerdown/move/up, gated by a distance or delay threshold) is the default; a keyboard activator (Space/Enter to pick up, arrow keys to move, Escape to cancel) drives the *same* start/move/end lifecycle so keyboard operability is architected in, not bolted on afterward.
2. **Modifiers** — an ordered pipeline of pure functions the raw delta passes through before it's applied: restrict-to-bounds, snap-to-grid, aspect-ratio lock, min/max size. Order matters — each modifier sees the *previous* modifier's already-adjusted values, not the raw pointer position.
3. **Position model** — a `base` (the resting value, changed only at gesture start/end) and an `offset` (the live delta, changed continuously during the gesture, folded back to zero the instant it ends). See Core Rules for why these stay separate.

A free-drag element is this engine with no modifiers. A resize handle is this engine tracking `width`/`height` instead of `x`/`y`. A sortable list is this engine plus a swap/shift strategy function. A drop zone is this engine plus a collision-detection function against registered targets. Build the engine once; each scenario in **Extending the Engine** is a small addition to it, not a separate system.

## Core Rules

These apply everywhere in the engine — a naive implementation of any one of these has broken working code in production, including this exact project's own feedback-widget FAB earlier the same day.

- **NEVER animate `top`/`left`/`width`/`height` on every frame of a live drag**
  **Instead:** Track the drag delta in a `transform: translate3d(x, y, 0)` on top of a stable base position. A single one-shot CSS transition on `left`/`top` *after* the drag ends (e.g. snapping to an edge) is fine — that's one style recalculation, not one per `pointermove`.
  **Why:** `transform` is compositor-only (GPU, no layout/paint); animating box-model properties on every pointer-move event forces layout every frame and janks under load.

- **NEVER set both `top`+`bottom` (or `left`+`right`) while height/width is `auto`**
  **Instead:** When switching a live-tracked element to an absolute resting position (e.g. after a drag snaps to an edge), explicitly cancel the unused pair (`bottom: auto; right: auto;`).
  **Why:** CSS resolves this as over-constrained by *solving for the missing dimension* — the box stretches to fill the gap between the two anchors instead of sizing to content. A leftover `bottom` class combined with a newly-set `top` will silently stretch the element to fill the viewport.

- **NEVER represent "resting position" and "live drag delta" with the same property**
  **Instead:** Keep them as two separate values — a base position (`left`/`top`, updated only at drag start/end) and a transform delta (updated continuously during the drag, reset to zero when folded into the base). Change only one of the two in any given reactive update.
  **Why:** Updating both in the same tick to represent one animated transition (e.g. "jump the base and compensate with an equal-and-opposite transform offset, then animate the offset back to zero") is fragile — if the two values ever commit to the DOM in separate paints, the element visibly flashes to the un-compensated position for a frame.

- **NEVER use `event.offsetX`/`event.offsetY` as the drag reference point**
  **Instead:** Compute deltas from `event.clientX`/`clientY` relative to the pointer's own position at drag start, or relative to a fixed container's `getBoundingClientRect()`.
  **Why:** `offsetX`/`offsetY` are relative to whichever element is currently under the cursor — as the pointer crosses child elements mid-drag, the reference frame silently changes underneath you, corrupting the computed delta.

- **NEVER treat any pointer movement as the start of a drag**
  **Instead:** Require a distance threshold (typically 1–10px of movement, or a short delay for long-press activation) before calling it a drag. Below threshold, let the native `click` fire normally.
  **Why:** Without a threshold, the sub-pixel movement inherent in any real click misfires as a drag, and legitimate click handlers on the same element never fire.

- **NEVER rely only on `mouseleave` or a same-element `mouseup` to end a drag**
  **Instead:** Use the Pointer Events API and call `element.setPointerCapture(event.pointerId)` on drag start; handle `pointercancel` identically to `pointerup`. Also end the drag on the window's `blur` event (alt-tab, a native file picker or dialog stealing focus mid-drag) — capture doesn't help here since the pointer never actually released.
  **Why:** Without capture, releasing the pointer outside the original element never fires that element's `mouseup`/`pointerup` — the drag gets stuck "on" until the cursor re-enters, then resumes unexpectedly. `mouseleave`-as-cancel is a symptom fix; pointer capture removes the underlying problem, but neither one fires on a focus-stealing interrupt — that needs its own `blur` handler.

- **NEVER wire mouse events only**
  **Instead:** Use Pointer Events (`pointerdown`/`pointermove`/`pointerup`/`pointercancel`) — one API unifies mouse, touch, and pen. If Pointer Events aren't available, wire mouse *and* touch event pairs explicitly, and filter the synthetic mouse events browsers fire ~300–500ms after a touch (check `event.timeStamp` deltas) so touch drags don't double-fire. Set `touch-action: none` on the draggable element so the browser's own scroll/pinch/long-press gestures don't fight the drag.
  **Why:** Mouse-only handlers are silently broken on every touchscreen — no error, the element just doesn't drag.

- **NEVER leave listeners or timers attached past the component's lifetime**
  **Instead:** Track every `addEventListener` (especially `window`/`document`-level ones added during drag start) and remove them on drag end *and* on unmount; clear any `setTimeout`/`requestAnimationFrame` handles the same way.
  **Why:** Leaked document-level listeners keep firing after the component is gone, causing phantom state updates or drags on unrelated later interactions.

- **NEVER ship a pointer-only activator for content reordering**
  **Instead:** Give the engine a second activator — keyboard (Space/Enter to pick up, arrow keys to move, Space/Enter to drop, Escape to cancel) — sharing the exact same start/move/end lifecycle as the pointer activator, plus an `aria-live` region announcing state changes.
  **Why:** Pointer-only dragging is unusable for keyboard and screen-reader users. This is the gap that's easiest to skip because the pointer path alone looks "done."

## Extending the Engine

MANDATORY READ before implementing any of these — [`references/patterns.md`](references/patterns.md) has the full worked engine plus every extension below.

| Need | Add to the core engine |
|---|---|
| Free-floating element (FAB, floating panel, canvas object) | Nothing extra — the base engine alone, with an optional edge/grid snap on release. `references/patterns.md#engine` |
| Resize handle / panel | Track `width`/`height` instead of `x`/`y`; add a min-size modifier. Resize is legitimately layout-affecting — accept the reflow cost, there's no compositor-only substitute for "this box's size follows my pointer." `references/patterns.md#resize` |
| Sortable/reorderable list | Add a swap/shift strategy function (computes each non-dragged item's displacement from cached rects) and a plain index array as the source of truth — don't hand-roll splice/insert math, off-by-one errors on boundary items are the most common bug. If the list scrolls, dragging near an edge needs to auto-scroll the container (track scroll direction/intent, step `scrollTop`). `references/patterns.md#sortable` |
| Drop zone | Add a collision-detection function against registered targets. Pick the strategy by target shape and density: closest-center for simple, sparse, similarly-sized targets; rect-intersection when targets vary in size and real overlap area should decide the winner; pointer-within when targets are small/precise. Fire enter/leave/drop against exactly one "winning" zone when zones overlap. `references/patterns.md#dropzone` |
| Snap-to-grid / restrict-to-bounds / aspect-ratio lock | Add a modifier function to the pipeline — keep the order deliberate, each modifier sees the previous one's adjusted values. `references/patterns.md#modifiers` |
| Physical "throw" on release | Add an inertia calculation: above a minimum release speed, glide on an exponentially-decaying velocity to an analytically-solved stop point; below it, do a short eased "smooth end." Only add this when a tactile/physical feel is wanted (a canvas or board), not by default. `references/patterns.md#inertia` |
| Element must render above a scrollable/`overflow:hidden` ancestor | Drag a fixed-position clone instead of moving the source node in place, then animate the clone to the final position on drop and swap back. `references/patterns.md#overlay` |
| Smooth performance in long lists | Isolate per-frame position state to the dragged item's own subscriber — don't broadcast it through state that re-renders every item in the list on every pointer move. |
