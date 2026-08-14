# Canvas Review Checklist

Use this for code review and final verification of new canvas work.

## Architecture

- Workload is named: decorative, data, generative, interactive, game/simulation, or engine/WebGL.
- Rendering model fits workload: raw immediate mode, retained scene graph, sketch framework, or WebGL engine.
- Canvas imperative code is isolated from framework rendering. Framework state updates do not happen per entity per frame unless deliberate.
- State update and render are separate enough to test or reason about independently.

## Size and Resolution

- CSS size and backing-store size are both controlled.
- Device pixel ratio is handled explicitly and can be capped for performance.
- Resize path recomputes dimensions, transform, cached assets, hit-test scale, and visible bounds.
- Resize path resets transforms with `setTransform` instead of accumulating `scale()` calls across repeated resizes.
- No resize loop continuously reallocates large canvases during drag/viewport changes without debounce or observation discipline.

## Loop Lifecycle

- RAF id is stored and canceled on teardown.
- Loop cannot double-start after visibility changes, reduced-motion changes, route remounts, or prop changes.
- Timers, intervals, observers, event listeners, workers, media-query listeners, and library stages are disposed.
- Hidden tab behavior is intentional.
- Reduced-motion behavior is present for non-essential animation.

## Hot Path

- Inner loops avoid allocations where object count is high.
- Draw calls are batched or cached when repeated primitives dominate.
- Context state changes are grouped outside entity loops where possible.
- `save()`/`restore()` are not used per object unless transforms/state are complex enough to justify them.
- Static or slow-changing content is cached, layered, or redrawn at a lower cadence.
- Expensive features are justified: shadows, filters, gradients per frame, text per frame, image scaling, `getImageData`, `putImageData`.

## Interaction

- Pointer coordinates are mapped through element bounds and canvas scale/DPR.
- Hit testing matches the rendering model: geometry math, spatial index, color picking, Path2D, or library hit graph.
- Pointer capture, touch-action, keyboard equivalents, focus, and cancellation paths are handled for interactive tools.
- Canvas does not swallow page scroll/zoom gestures accidentally on mobile.

## Accessibility

- Decorative canvas is hidden from assistive tech and not focusable.
- Meaningful visual information has text/DOM equivalent, labels, summaries, or export.
- Interactive canvas controls have keyboard path and announced state outside raw pixels.
- Flashing/flicker remains under WCAG risk thresholds.

## Memory and Assets

- Image assets are decoded/loaded before draw or guarded against missing dimensions.
- Repeated scaled images/text/paths are cached when needed.
- Offscreen canvases are snug, not full viewport by habit.
- Workers are terminated; transferred objects and message protocols are documented.
- WebGL/engine resources are explicitly disposed.

## Verification

Pick signals that match the risk:

- Chrome Performance: frame time, scripting, rendering, long tasks.
- Memory snapshot or allocation timeline after route changes/unmount/remount.
- Low-end/mobile throttling and DPR stress test.
- Hidden-tab and visibility restore.
- Reduced-motion mode.
- Interaction latency and pointer accuracy after resize/zoom.
- Visual regression or deterministic seed for generative output when stability matters.
