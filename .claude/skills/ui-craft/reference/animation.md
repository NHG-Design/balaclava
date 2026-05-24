# Animation Reference

## Decision Framework

Answer these in order before writing any animation code.

### 1. Should this animate at all?

| Frequency | Decision |
|---|---|
| 100+ times/day (keyboard shortcuts, command palette) | No animation. Ever. |
| Tens of times/day (hover effects, list navigation) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare / first-time (onboarding, celebrations) | Can add delight |

### 2. What is the purpose?

Every animation must answer "why does this animate?" Valid answers:
- **Spatial consistency** — toast enters and exits from the same edge; swipe-to-dismiss feels intuitive
- **State indication** — morphing feedback button shows the change happened
- **Feedback** — button scales down on press, confirming the interface heard the user
- **Preventing jarring changes** — elements appearing without transition feel broken
- **Explanation** — marketing animation showing how a feature works

"It looks cool" alone is not a valid answer if the user will see it often.

### 3. What easing?

```
Is the element entering or exiting?
  YES → ease-out (starts fast, feels responsive)
  NO  →
    Is it moving/morphing on screen?
      YES → ease-in-out (natural acceleration/deceleration)
    Is it a hover or color change?
      YES → ease
    Is it constant motion (marquee, progress)?
      YES → linear
    Default → ease-out
```

**Use custom easing curves. Built-in CSS easings are too weak.**

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* iOS-like */
```

Resources: [easing.dev](https://easing.dev/), [easings.co](https://easings.co/)

### 4. How fast?

| Element | Duration |
|---|---|
| Button press feedback | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modals, drawers | 200–500ms |
| Marketing / explanatory | Can be longer |

**UI animations stay under 300ms.** A fast-spinning spinner makes loading feel faster even when load time is identical. Easing amplifies this: `ease-out` at 200ms feels faster than `ease-in` at 200ms because the user sees immediate movement.

---

## Spring Animations

Springs feel more natural because they simulate real physics — no fixed duration, settled by parameters.

**When to use:**
- Drag interactions with momentum
- Elements that should feel "alive" (Dynamic Island-style)
- Gestures that can be interrupted mid-animation
- Decorative mouse-tracking

**Configuration:**

```js
// Apple's approach (easier to reason about)
{ type: "spring", duration: 0.5, bounce: 0.2 }

// Traditional physics (more control)
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }
```

Keep bounce subtle (0.1–0.3). Avoid bounce in most UI contexts. Springs maintain velocity when interrupted — CSS keyframes restart from zero.

---

## CSS Techniques

### CSS Transitions over Keyframes for dynamic UI

Transitions can be interrupted and retargeted mid-animation. Keyframes restart from zero. For any interaction triggered rapidly (toasts, toggles), transitions win.

### `@starting-style` for entry animation

```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;

  @starting-style {
    opacity: 0;
    transform: translateY(100%);
  }
}
```

Replaces the `useEffect(() => setMounted(true))` pattern. Use when browser support allows.

### `clip-path: inset()` for reveals

`inset(top right bottom left)` — each value eats into the element from that side.

```css
/* Reveal left to right */
.overlay { clip-path: inset(0 100% 0 0); }
.button:active .overlay { clip-path: inset(0 0 0 0); transition: clip-path 2s linear; }
.overlay { transition: clip-path 200ms ease-out; } /* fast release */

/* Tabs: duplicate list, clip to active tab only — perfect color transitions */
/* Image reveal on scroll: start inset(0 0 100% 0), animate to inset(0 0 0 0) */
```

### translateY percentages

`translateY(100%)` moves an element by its own height regardless of dimensions. Prefer over hardcoded px.

### Asymmetric enter/exit

Press: slow and deliberate. Release: always snappy.

```css
.overlay { transition: clip-path 200ms ease-out; }        /* release */
.button:active .overlay { transition: clip-path 2s linear; } /* hold */
```

### Stagger

30–80ms between items. Long stagger delays make the interface feel slow. Stagger is decorative — never block interaction while playing.

```css
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
```

### Blur for crossfade masking

When a crossfade feels off despite tuning, add `filter: blur(2px)` during transition. Blur bridges the visual gap between two overlapping states. Keep under 20px — heavy blur is expensive in Safari.

---

## Gesture and Drag

**Momentum-based dismissal:** Don't require dragging past a threshold. Calculate velocity: if `Math.abs(distance) / elapsedTime > 0.11`, dismiss regardless of distance.

**Damping at boundaries:** When dragging past a natural boundary, apply increasing resistance. Things in real life don't suddenly stop.

**Pointer capture:** Once dragging starts, capture all pointer events. Dragging continues even if the pointer leaves element bounds.

**Multi-touch protection:** Ignore additional touch points after drag begins. Switching fingers mid-drag causes jumps.

**Friction instead of hard stops:** Allow boundary overdrag with increasing friction — more natural than hitting an invisible wall.

---

## Performance

**Only animate `transform` and `opacity`.** These skip layout and paint and run on GPU.

**CSS variables on parents are expensive.** Changing `--swipe-amount` on a container recalculates styles for all children.

```js
// Bad: recalculates all children
element.style.setProperty('--swipe-amount', `${distance}px`);

// Good: only this element
element.style.transform = `translateY(${distance}px)`;
```

**WAAPI for programmatic CSS-performance animations:**

```js
element.animate(
  [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }],
  { duration: 1000, fill: 'forwards', easing: 'cubic-bezier(0.77, 0, 0.175, 1)' }
);
```

**CSS animations beat JS under load.** CSS runs off the main thread. Framer Motion's `requestAnimationFrame` drops frames when the browser is also loading content.

---

## Accessibility

**`prefers-reduced-motion`:** Reduced motion means fewer animations, not zero. Keep opacity/color transitions that aid comprehension. Remove movement.

```css
@media (prefers-reduced-motion: reduce) {
  .element { animation: fade 0.2s ease; }
}
```

**Touch hover states:** Gate hover animations behind `@media (hover: hover) and (pointer: fine)` — touch devices trigger hover on tap.

---

## Debugging

- **Slow motion:** Temporarily set duration 2–5× normal or use DevTools Animation inspector.
- **Frame-by-frame:** Chrome DevTools Animations panel. Reveals sync issues between `opacity`, `transform`, and `color`.
- **Real devices:** For gestures, test on physical hardware via USB + Safari remote devtools. Simulator is not enough.
