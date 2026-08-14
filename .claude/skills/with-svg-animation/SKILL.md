---
name: with-svg-animation
description: Expert guidance on performant SVG animation techniques. Use when animating SVGs, stroke draw effects, path morphing, clip-path animations, SVG motion, hover effects, or choosing between CSS/GSAP/anime.js for SVG animation. Not for raster/canvas animation or non-SVG DOM transitions — see with-canvas for those.
---

# SVG Animation — Expert Guidance

When animating SVGs, choose the right tool for the job and follow performance best practices. This skill helps you pick the approach, write performant code, and handle accessibility.

## Approach Selection

Pick based on what each tool can structurally do, not a feature checklist: CSS can't auto-match vertex counts or detect subpaths the way GSAP's DrawSVG/MorphSVG plugins do, which is why a stroke-draw or morph that works on a simple icon silently breaks on a multi-subpath one in CSS-only setups.

**Use CSS-only when:**

- Simple state transitions (hover, focus, active)
- Stroke draw effects on single paths
- Clip-path reveals with fixed shapes (polygon, circle, ellipse)
- Opacity/transform-based entrance animations
- You need zero JS dependencies

**Use GSAP when:**

- Complex timelines with sequenced/staggered animations
- ScrollTrigger integration needed
- DrawSVG plugin for stroke animation (handles subpaths)
- MorphSVG for path morphing (auto vertex matching)
- CustomEase/CustomBounce for advanced easing
- Cross-browser consistency is critical

**Use anime.js when:**

- Lightweight morphing (`d` attribute animation)
- Organic blob/shape transitions
- You want a smaller bundle than GSAP
- Timeline features without GSAP's full weight

**Use Web Animations API (WAAPI) when:**

- Modern browser targets only
- Transform/opacity animations
- You want native performance without libraries

## Performance Rules

1. **Only animate compositable properties**: `transform` and `opacity` run on the GPU compositor. Animating `width`, `height`, `top`, `left`, `d`, `points`, or `viewBox` triggers layout/paint — use sparingly.

2. **`will-change` usage**: Apply only to elements about to animate, remove after. Never blanket-apply `will-change: transform` to all SVG elements.

3. **Batch DOM reads/writes**: When using `getTotalLength()` or `getBBox()`, read all values first, then apply all changes. Interleaving reads/writes causes layout thrashing.

4. **Prefer `<use>` sparingly in animated SVGs**: Cloned elements with `<use>` can cause unexpected paint invalidation during animation.

5. **SVG vs CSS transforms**: SVG `transform` attribute uses a different coordinate system than CSS `transform`. For consistency, prefer CSS transforms with `transform-origin` set explicitly (SVG default origin is `0 0`, not center).

6. **Frame budget**: Keep animations under 16ms/frame. Complex path morphing on many elements simultaneously will drop frames — stagger or reduce element count.

## Stroke Animation (Draw Effect)

The classic "drawing" effect uses `stroke-dasharray` and `stroke-dashoffset`.

**Pattern:**

1. Get path length via `getTotalLength()`
2. Set `stroke-dasharray` to total length (one dash = full path)
3. Animate `stroke-dashoffset` from total length → 0 (draws on) or 0 → total length (erases)

**CSS-only approach** — set dasharray/dashoffset in CSS, animate with `@keyframes` or transition on class toggle. Works when path length is known or set via inline style from JS on load.

**GSAP approach** — use DrawSVG plugin for subpath control (`drawSVG: "20% 80%"`), auto-handles length calculation, supports reverse and partial draws.

**Multi-stroke / duotone** — layer two `<path>` copies with different colors and stagger their draw timing for a highlight-trail effect.

MANDATORY READ [`references/techniques.md`](references/techniques.md) before writing stroke-draw, clip-path, or morph code — full worked examples for every approach above. Do NOT load it for approach-selection questions; the tables above already answer those.

## Clip-Path Animation

Two approaches: CSS `clip-path` property or SVG `<clipPath>` element.

**CSS `clip-path`:**

- Animate between `polygon()`, `circle()`, `ellipse()`, or `inset()` shapes
- Shapes must have the same number of vertices for smooth interpolation
- Use `transition: clip-path 0.6s ease` for hover states
- Great for reveal/unreveal effects

**SVG `<clipPath>`:**

- Reference with `clip-path: url(#clipId)`
- Animate the shapes *inside* the `<clipPath>` element
- Can animate `<circle>`, `<rect>`, `<path>` within the clip
- Use `gradientTransform` on `<linearGradient>` inside clips for sweep effects

**Key gotcha**: CSS `clip-path` with `polygon()` doesn't interpolate to/from `none` — always transition between shapes with the same vertex count.

## Path Morphing

Morphing between two `<path>` `d` attributes requires matching vertex counts and winding order — manual and anime.js approaches need pre-matched point counts; GSAP MorphSVG handles mismatched vertex counts automatically and supports `shapeIndex` for controlling morph direction.

See [`references/techniques.md`](references/techniques.md) items 8–10 for worked code (anime.js morph, organic blob cycling, GSAP MorphSVG).

## Timing & Easing

- **Elastic easing** (`easeOutElastic`, `easeInOutElastic`) — organic, bouncy feel for blob morphs and playful UI
- **Bounce** — use GSAP's `CustomBounce` for squash-and-stretch; pairs well with `scaleY` compression at impact
- **Stagger** — `stagger: 0.05` (GSAP) or manual `animation-delay` for sequential element reveals
- **Timeline sequencing** — chain animations with labels/offsets; overlap slightly for fluid motion (`"-=0.2"` in GSAP)
- **Duration guidelines**: micro-interactions 150-300ms, state transitions 300-600ms, complex morphs 600-1200ms, decorative loops 2-6s

## Accessibility

**`prefers-reduced-motion`:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

In JS, check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before initializing animations. Provide instant state changes instead.

**Decorative SVGs**: Add `aria-hidden="true"` and `role="presentation"`. Don't animate SVGs that convey meaning without providing a static fallback.

**Flashing**: Never animate opacity or color faster than 3 flashes/second (WCAG 2.3.1).

## NEVER

- **NEVER blanket-apply `will-change: transform` to all SVG elements** — Instead: apply only to elements about to animate, remove after. Why: unused `will-change` hints waste GPU memory and can hurt performance instead of helping it.
- **NEVER expect CSS `clip-path` to interpolate to/from `none`** — Instead: always transition between shapes with the same vertex count (`polygon()` to `polygon()`, not `polygon()` to `none`). Why: browsers can't smoothly interpolate a shape that doesn't exist; the animation jumps instead of transitioning.
- **NEVER animate `width`, `height`, `d`, `points`, or `viewBox` for the main motion of a frequent/looping animation** — Instead: animate `transform` and `opacity`, which run on the GPU compositor. Why: the others trigger layout/paint on every frame and will drop frames under load.

## Quick Reference

| Technique | CSS-only | GSAP | anime.js |
|-----------|----------|------|----------|
| Stroke draw | ✅ (known length) | ✅ DrawSVG | ✅ strokeDashoffset |
| Clip-path reveal | ✅ polygon/circle | ✅ | ❌ |
| Path morph | ❌ | ✅ MorphSVG | ✅ (same vertices) |
| Squash & stretch | ✅ (basic) | ✅ CustomBounce | ✅ |
| Stagger | ✅ (delay) | ✅ stagger | ✅ stagger |
| Scroll-linked | ❌ | ✅ ScrollTrigger | ❌ |
