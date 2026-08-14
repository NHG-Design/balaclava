# Canvas Performance

Use this when creating or optimizing animation, large scenes, charts, particle systems, image rendering, pixel work, high-DPI drawing, or OffscreenCanvas workers.

## Budget First

Frame budgets are hard limits: 60 FPS is 16.7ms total for script, rendering, input, and browser work; 120 FPS is 8.3ms. Treat canvas code inside RAF as a hot path.

Measure before and after non-trivial optimization. Use Chrome Performance for main-thread tasks, memory snapshots for lifecycle leaks, and throttled/mobile runs when touch devices matter.

## Draw Less

Prefer the least redraw scope that preserves correctness:

- Static CSS background instead of drawing large static backgrounds each frame.
- Separate canvas layers for background, world, effects, and UI when layers update at different rates.
- Dirty rectangles when moving objects occupy small predictable bounds.
- Sprite/offscreen caches for repeated markers, text, particles, shadows, gradients, scaled images, and complex paths.
- Lower internal resolution or DPR for effects where crispness is not worth the fill-rate cost.

Do not over-layer. Each canvas consumes memory and compositing work; layers pay off only when they avoid more redraw than they add.

## Reduce Draw Calls and State Churn

Batch by path/style when shapes can visually merge without artifacts. For many circles/markers, one path with one fill/stroke can be much faster than per-shape `beginPath`/`fill`/`stroke`, but overlapping shapes may blob together.

Group drawing by state: fillStyle, strokeStyle, globalAlpha, lineWidth, shadow, transform, composite operation. Changing the context state machine inside an entity loop is a common hidden cost.

Avoid repeated `save()`/`restore()` in inner loops. Use explicit `setTransform`/style assignment when only a few state fields change.

Use `Path2D` or cached geometry for complex repeated vector shapes. Use a snug offscreen canvas for bitmap caches; copying a large mostly-empty offscreen buffer can erase the win.

## Image and Pixel Work

Avoid scaling inside `drawImage` every frame. Precompute needed sizes into offscreen canvases or image bitmaps.

Round image destination coordinates when subpixel smoothing is not desired. Fractional coordinates can add anti-aliasing work and soften pixel art/sprites.

Minimize `getImageData`/`putImageData`; they are bandwidth-heavy and can force synchronization. If the workload is truly pixel-based, write contiguous arrays, avoid per-pixel allocations, and request `willReadFrequently` only when readback dominates.

For high particle counts, consider direct `ImageData` writes, batched sprite blits, spatial partitioning, or WebGL points before per-particle arc paths.

## RAF, Visibility, and Motion

Use RAF timestamp deltas for time-based movement. Clamp large deltas after tab sleep to avoid simulation explosions.

Pause or degrade decorative animation on `document.hidden`. Browsers throttle RAF, but explicit pause avoids timers, workers, and library loops continuing work.

Respect `prefers-reduced-motion`: render a static frame, slower cadence, or simpler effect. This is a correctness requirement, not an optional polish pass.

## OffscreenCanvas and Workers

Use OffscreenCanvas when heavy rendering/simulation blocks input or competes with framework rendering. Transfer the canvas with `transferControlToOffscreen()` and pass it as a transferable in `postMessage`.

Worker rendering cannot directly use DOM APIs, layout, CSS computed values, regular image loading patterns, or framework state. Send plain messages: size, DPR, theme, input samples, assets, and commands.

Use progressive enhancement. Feature-detect OffscreenCanvas and keep a main-thread fallback unless target browsers are controlled.

## WebGL/Engine Canvas Memory

Engine canvases own GPU resources outside normal DOM-looking memory. Review disposal paths for scenes, textures, geometries, materials, render targets, event listeners, observables, and engine instances.

If multiple engine canvases crash or leak, suspect GPU resource lifetime and context count before blaming JS heap alone. Verify with engine inspectors, browser task manager/GPU memory, and explicit `dispose()` calls.

## Source Basis

Derived from MDN canvas optimization guidance, web.dev canvas performance and OffscreenCanvas articles, Konva performance docs, AG Grid canvas rendering writeup, Soulwire particle example, Jared Willi canvas notes, and Babylon.js canvas memory discussion.
