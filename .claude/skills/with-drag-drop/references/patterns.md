# Drag and Drop — Worked Patterns

Table of contents: [The Core Engine](#engine) · [Keyboard Activator](#keyboard) · [Modifier Pipeline](#modifiers) · [Resize Extension](#resize) · [Sortable Extension](#sortable) · [Drop Zone Extension](#dropzone) · [Ghost Element / Overlay](#overlay) · [Inertia](#inertia) · [Accessibility Checklist](#accessibility)

One engine, extended per scenario — not several approaches to choose between. Every extension below plugs into the same base+offset position model and the same activator/modifier pipeline described in `SKILL.md`'s Core Engine section.

---

## The Core Engine {#engine}

The foundation every extension builds on. Two numbers represent the whole gesture: a **base** position (the resting spot, changed only at drag start/end) and an **offset** (the live delta, changed continuously during the drag and folded back to zero the instant the drag ends). A pointer **activator** drives it, gated by a distance threshold so a click doesn't misfire as a drag.

```js
const DRAG_THRESHOLD = 4; // px — below this, treat as a click, not a drag

let baseX = 0, baseY = 0;      // resting position
let offsetX = 0, offsetY = 0;  // live delta during an active drag
let activePointerId = -1;
let didDrag = false;
let startPx = 0, startPy = 0;

function onPointerDown(e) {
  if (activePointerId !== -1) return; // one gesture at a time
  activePointerId = e.pointerId;
  didDrag = false;
  startPx = e.clientX;
  startPy = e.clientY;
  el.setPointerCapture(e.pointerId); // guarantees move/up keep firing on `el`
                                      // even if the cursor leaves it — this
                                      // alone eliminates the classic "stuck
                                      // drag" bug that mouseleave hacks
                                      // otherwise work around.
}

function onPointerMove(e) {
  if (e.pointerId !== activePointerId) return;
  const dx = e.clientX - startPx;
  const dy = e.clientY - startPy;
  if (!didDrag && Math.hypot(dx, dy) > DRAG_THRESHOLD) didDrag = true;
  const adjusted = applyModifiers({ x: dx, y: dy }); // see Modifier Pipeline
  offsetX = adjusted.x;
  offsetY = adjusted.y;
  render(); // apply transform only — see below
}

function onPointerUp(e) { // also bind to pointercancel with the same handler
  if (e.pointerId !== activePointerId) return;
  activePointerId = -1;

  if (!didDrag) {
    onClick(); // it was a tap/click, not a drag
    return;
  }

  // Fold the offset into the base — net visual position is identical to a
  // moment ago, so this alone causes no jump. Only THEN animate the base
  // toward wherever it should settle (an edge snap, a grid cell, etc.) via
  // a left/top transition — never re-introduce a transform offset here, or
  // the two representations can race and flash (see Core Rules).
  baseX += offsetX;
  baseY += offsetY;
  offsetX = 0;
  offsetY = 0;
  render();

  const target = computeSnapTarget(baseX, baseY); // your own edge/grid logic
  animateSettleTo(target);
}

function applyModifiers(delta) {
  return delta; // identity by default — see Modifier Pipeline to add constraints
}

function render() {
  el.style.position = "fixed";
  el.style.left = `${baseX}px`;
  el.style.top = `${baseY}px`;
  el.style.right = "auto";   // cancel any CSS-class-based right/bottom —
  el.style.bottom = "auto";  // see Core Rules' over-constrained-box warning
  el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  el.style.transition = "none"; // never transition transform during live drag
}

function animateSettleTo({ x, y }) {
  el.style.transition = "left 300ms cubic-bezier(0.32,0.72,0,1), top 300ms cubic-bezier(0.32,0.72,0,1)";
  baseX = x; baseY = y;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  setTimeout(() => { el.style.transition = "none"; }, 300);
}

el.addEventListener("pointerdown", onPointerDown);
el.addEventListener("pointermove", onPointerMove);
el.addEventListener("pointerup", onPointerUp);
el.addEventListener("pointercancel", onPointerUp);
el.style.touchAction = "none"; // stops the browser's own scroll/pinch/long-
                                // press-menu gestures from fighting a touch
                                // drag — set once, it's static CSS, not part
                                // of the per-frame render()
```

**On unmount:** remove all four listeners. If `activePointerId !== -1` at unmount time, also call `el.releasePointerCapture(activePointerId)` first. Also listen for `window`'s `blur` event and force-end the gesture (alt-tab, a native dialog stealing focus mid-drag — pointer capture doesn't help here since the pointer never actually released).

**Coordinate-space variant (SVG/canvas):** if the draggable lives in its own coordinate system (not page pixels), normalize the pointer position through the container first: `(event.clientX - containerRect.left) / containerRect.width` gives a resolution-independent 0–1 fraction, then scale into the target coordinate space. Recompute `containerRect` on each move if the page can scroll/resize mid-drag — treat it as necessarily-fresh geometry, not a cacheable value.

---

## Keyboard Activator {#keyboard}

A second activator driving the *exact same* `onPointerDown`/`onPointerMove`/`onPointerUp` shape above — pick-up, move, and drop are the same three lifecycle stages, just triggered by keys instead of pointer events, so nothing downstream (modifiers, rendering, settle animation) needs to know which activator fired.

```js
const KEY_STEP = 25; // px per arrow-key press

let keyboardActive = false;

el.addEventListener("keydown", (e) => {
  if (!keyboardActive && (e.key === " " || e.key === "Enter")) {
    keyboardActive = true;
    baseX = el.getBoundingClientRect().left; // same "start" as onPointerDown
    baseY = el.getBoundingClientRect().top;
    announce(`Picked up. Use arrow keys to move, ${e.key === " " ? "space" : "enter"} to drop, escape to cancel.`);
    e.preventDefault();
    return;
  }
  if (!keyboardActive) return;

  if (e.key === "ArrowLeft") { offsetX -= KEY_STEP; render(); }
  else if (e.key === "ArrowRight") { offsetX += KEY_STEP; render(); }
  else if (e.key === "ArrowUp") { offsetY -= KEY_STEP; render(); }
  else if (e.key === "ArrowDown") { offsetY += KEY_STEP; render(); }
  else if (e.key === " " || e.key === "Enter") {
    keyboardActive = false;
    baseX += offsetX; baseY += offsetY; offsetX = 0; offsetY = 0;
    render();
    announce("Dropped.");
  } else if (e.key === "Escape") {
    keyboardActive = false;
    offsetX = 0; offsetY = 0;
    render(); // returns to the original base — nothing was committed
    announce("Cancelled.");
  } else {
    return;
  }
  e.preventDefault();
});

function announce(text) {
  liveRegion.textContent = text; // an aria-live="assertive" element, see Accessibility Checklist
}
```

Give the draggable element `role="button"`, `tabindex="0"`, `aria-roledescription="draggable"`, and `aria-pressed={keyboardActive}` so assistive tech reports the affordance and current state.

---

## Modifier Pipeline {#modifiers}

An ordered list of pure functions the delta passes through before rendering. Order matters: each modifier receives the *previous* modifier's already-adjusted values, not the raw pointer delta — restrict-then-snap and snap-then-restrict can yield different results at a boundary.

```js
function restrictToBounds(bounds) {
  return (delta, base) => ({
    x: Math.max(bounds.left - base.x, Math.min(bounds.right - base.x, delta.x)),
    y: Math.max(bounds.top - base.y, Math.min(bounds.bottom - base.y, delta.y)),
  });
}

function snapToGrid(cell) {
  return (delta) => ({
    x: Math.round(delta.x / cell.x) * cell.x,
    y: Math.round(delta.y / cell.y) * cell.y,
  });
}

function composeModifiers(...modifiers) {
  return (delta, base) => modifiers.reduce((d, m) => m(d, base), delta);
}

// Wire into the core engine's applyModifiers():
const applyModifiers = composeModifiers(
  restrictToBounds({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }),
  snapToGrid({ x: 20, y: 20 }),
);
```

Same shape covers aspect-ratio locking (adjust one axis to match the other times a ratio) and min/max size (clamp before returning) — write each constraint as one small function and compose them, rather than one large branching function that does everything.

---

## Resize Extension {#resize}

Same base+offset shape as free-drag, but the tracked "position" is `width`/`height` — a real layout change, since there's no transform-only substitute for "this box's size follows my pointer." Accept the reflow cost here; it's inherent to resizing, not a mistake.

```js
let baseWidth = el.offsetWidth;
let baseHeight = el.offsetHeight;
let startPx = 0, startPy = 0;
let activePointerId = -1;

function onHandlePointerDown(e) {
  if (activePointerId !== -1) return;
  activePointerId = e.pointerId;
  startPx = e.clientX;
  startPy = e.clientY;
  handle.setPointerCapture(e.pointerId);
}

function onHandlePointerMove(e) {
  if (e.pointerId !== activePointerId) return;
  const dx = e.clientX - startPx;
  const dy = e.clientY - startPy;
  el.style.width = `${Math.max(MIN_WIDTH, baseWidth + dx)}px`;
  el.style.height = `${Math.max(MIN_HEIGHT, baseHeight + dy)}px`;
}

function onHandlePointerUp(e) {
  if (e.pointerId !== activePointerId) return;
  activePointerId = -1;
  // Commit the new size as the base for the next resize gesture.
  baseWidth = el.offsetWidth;
  baseHeight = el.offsetHeight;
}

handle.addEventListener("pointerdown", onHandlePointerDown);
handle.addEventListener("pointermove", onHandlePointerMove);
handle.addEventListener("pointerup", onHandlePointerUp);
handle.addEventListener("pointercancel", onHandlePointerUp);
```

Resizing from a corner or an edge other than bottom-right needs the same math applied to `left`/`top` too (e.g. a top-left handle grows the box while also moving its origin) — clamp each axis to `MIN_WIDTH`/`MIN_HEIGHT` independently so the box can't invert.

---

## Sortable Extension {#sortable}

Add a **strategy function** that computes each non-dragged item's displacement from cached rects (no manual index math), and a plain array of ids as the source of truth for order:

```js
// Called once per frame for every item OTHER than the one being dragged.
function verticalListDisplacement(itemIndex, activeIndex, overIndex, activeHeight, gap) {
  if (activeIndex === overIndex) return 0;
  const movingDown = activeIndex < overIndex;
  const inRange = movingDown
    ? itemIndex > activeIndex && itemIndex <= overIndex
    : itemIndex >= overIndex && itemIndex < activeIndex;
  if (!inRange) return 0;
  return movingDown ? -(activeHeight + gap) : (activeHeight + gap);
}

function reorderArray(items, fromIndex, toIndex) {
  const next = items.slice();
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next; // commit this as the new source-of-truth order on drop
}
```

Apply `verticalListDisplacement`'s result as a `transform: translateY(...)` on each non-dragged item (never `top`/`margin`), and call `reorderArray` only once, on drop — don't mutate the DOM order imperatively mid-drag, let the array be the single source of truth and re-render from it.

**If the list scrolls:** dragging an item toward the top/bottom edge needs to auto-scroll the container. Track a "scroll intent" (which direction, how close to the edge) and step `scrollTop` on an interval or `requestAnimationFrame` loop while the pointer stays in the edge zone — don't scroll based on a single edge-crossing event, or it'll feel like a stutter instead of a continuous scroll.

---

## Drop Zone Extension {#dropzone}

Register candidate targets, then run a **collision-detection function** against them each move to find the single "winning" zone:

```js
function closestCenter(pointer, targets) {
  let winner = null, minDist = Infinity;
  for (const t of targets) {
    const cx = t.rect.left + t.rect.width / 2;
    const cy = t.rect.top + t.rect.height / 2;
    const dist = Math.hypot(pointer.x - cx, pointer.y - cy);
    if (dist < minDist) { minDist = dist; winner = t; }
  }
  return winner;
}

function rectIntersectionArea(a, b) {
  const overlapX = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const overlapY = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return overlapX * overlapY;
}
```

Pick the strategy by target shape and density: `closestCenter` for simple, sparse, similarly-sized targets; overlap-area scoring (`rectIntersectionArea`) when targets vary in size and real overlap should decide the winner; raw pointer-inside-rect when targets are small/precise and the cursor's exact position (not the whole dragged rect) should decide. Track the current winner across moves and only fire enter/leave when it actually changes — firing `drop` against every zone the pointer happens to be over (instead of the one winner) is the most common bug here.

---

## Ghost Element / Overlay {#overlay}

The engine above moves the *real* DOM node. That breaks down inside an `overflow:hidden`/`overflow:auto` ancestor (a scrollable list, a card, a modal) — the moving node gets visually clipped the moment it crosses the ancestor's edge, and its absence from the source position can shove sibling layout around awkwardly. When either applies, drag a **clone** instead:

1. On drag start, clone the source node, append it to `document.body` (or a dedicated portal root) with `position: fixed` and the same computed size, and hide or dim the source node in place.
2. Position the clone with the same base+offset `transform` as the core engine — it's the thing that visually follows the pointer now, unclipped by any ancestor.
3. On drop, animate the clone from its current screen position to the real target position (`element.animate([...], {duration: 200, easing: 'ease'})` reads well), then remove the clone and un-hide the source node once the animation resolves.

---

## Inertia {#inertia}

Optional post-release "throw," only worth adding when a physical/tactile feel is wanted (a canvas or board you fling around) — not a default. Track velocity during the drag (delta position / delta time over the last few move events), and on release:

```js
const MIN_THROW_SPEED = 0.3; // px/ms

function onGestureEnd(velocity) {
  const speed = Math.hypot(velocity.x, velocity.y);
  if (speed < MIN_THROW_SPEED) {
    animateSettleTo(computeSnapTarget(baseX, baseY)); // ordinary settle, see Core Engine
    return;
  }
  const DECAY = 0.998; // per-ms exponential decay
  const duration = Math.log(MIN_THROW_SPEED / speed) / Math.log(DECAY);
  const distance = speed * (1 - Math.pow(DECAY, duration)) / (1 - DECAY);
  const angle = Math.atan2(velocity.y, velocity.x);
  animateSettleTo({
    x: baseX + Math.cos(angle) * distance,
    y: baseY + Math.sin(angle) * distance,
  });
}
```

Below the minimum throw speed, fall back to the ordinary settle animation — don't apply inertia to every release, only to ones that were actually released with real velocity.

---

## Accessibility Checklist {#accessibility}

Port this regardless of scenario — it's part of the engine, not an add-on for one extension:

- Space/Enter picks up the currently-focused draggable; announce via `aria-live="assertive"` region ("Picked up item X").
- Arrow keys move the picked-up item (a fixed increment, e.g. 25px, or to the next/previous slot in a sortable list).
- Space/Enter drops; Escape cancels and returns the item to its original position. Announce the outcome.
- Return keyboard focus to the (possibly re-ordered) draggable node after drop — don't strand focus on a removed/moved element.
- `role="button"`, `tabindex="0"`, `aria-roledescription="draggable"`, `aria-pressed` (true while actively dragging via keyboard) on the draggable node; a visually-hidden instructions block (`aria-describedby`) explaining the key bindings once, near the first draggable.
