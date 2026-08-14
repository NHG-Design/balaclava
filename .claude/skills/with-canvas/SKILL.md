---
name: with-canvas
description: "Canvas implementation and review guidance for vanilla JavaScript, TypeScript, Web APIs, OffscreenCanvas, Web Workers, CanvasRenderingContext2D, WebGL-backed canvas, and canvas libraries including p5.js, Paper.js, Pencil.js, Konva, ZIM, Three.js, and Babylon.js. Use when creating, editing, optimizing, debugging, or reviewing canvas animations, generative art, games, charts, particle systems, interactive drawing tools, layered scenes, high-DPI rendering, RAF loops, hit testing, memory lifecycle, or performance issues. Trigger phrases: canvas, HTML5 canvas, OffscreenCanvas, requestAnimationFrame, getContext('2d'), drawImage, ImageData, particles, retained mode canvas, Konva, p5, Paper.js."
---

# with-canvas

Canvas work fails in two different ways: visual code that is pretty but janky, and optimized code that is unmaintainable or inaccessible. Treat every task as a rendering architecture decision before writing draw calls. Load only the reference named by the current phase; do not preload all references.

## Phase 1 - Classify the Canvas Job

Identify the dominant workload before choosing APIs:

- **Reject canvas:** prefer DOM/CSS/SVG/video when the scene is mostly text, accessible controls, document layout, simple iconography, CSS animation, media playback, or a small number of scalable vector shapes.
- **Decorative animation:** non-interactive ambience, background particles, stars, birds, procedural loops.
- **Data rendering:** charts, maps, heatmaps, large point clouds, frequently updated measurements.
- **Generative art:** seeded/random drawing, creative sketches, procedural systems, exportable images.
- **Interactive tool:** pointer/keyboard input, selection, drag, editable objects, hit testing.
- **Game/simulation:** fixed update loop, dynamic entities, collision/physics, layered scene.
- **WebGL/engine canvas:** Three.js/Babylon.js/other renderer owning GPU resources.

MANDATORY READ: if the workload is decorative animation or generative art, read `references/visual-quality.md` — for those two jobs, looking good is the task, and perf/a11y hygiene alone ships generic output. Do NOT load it for data rendering, tools, games, or engine canvases.

Exit condition: state the workload, why canvas is the right primitive, target frame rate, expected object count, interaction model, and whether the canvas is decorative or semantically meaningful.

## Phase 2 - Pick the Rendering Model

Use raw Canvas 2D when the scene is mostly immediate-mode drawing, pixel work, sprites, simple animation, or bundle size matters.

Use a retained-mode library when the app needs editable objects, selection, drag/drop, layered scene graph, event delegation, or serialization.

Use p5.js for sketches, generative art, teaching/prototyping, or creative coding where setup/draw ergonomics matter more than framework integration.

Use Paper.js for vector-editing workflows: paths, segments, bezier geometry, hit testing, SVG import/export, layered vector documents.

Use Konva for app UI on canvas: React/Vue/Svelte integrations, draggable shapes, layers, cached shapes, event listening controls.

Use Pencil.js for lightweight scene/component abstractions when its component model fits and dependency freshness is acceptable for the project.

Use Three.js/Babylon.js or WebGL directly when the dominant cost is 3D/GPU rendering, shaders, cameras, materials, or large mesh/sprite workloads.

MANDATORY READ: if choosing a library or reviewing a library choice, read `references/library-selection.md`. Do NOT load performance or review references unless the task reaches those phases.

Before installing a canvas library or writing non-trivial library API code, verify current docs with Context7 when available; otherwise use official docs. Do not rely on remembered APIs for p5.js, Paper.js, Pencil.js, Konva, ZIM, Three.js, or Babylon.js.

Exit condition: name the model and rejected alternatives with one-line reasons.

## Phase 3 - Design the Loop and State

Separate canvas code into lifecycle, state update, render, input, resize, and teardown. For framework components, keep the imperative canvas engine behind one mount/init boundary.

Use `requestAnimationFrame` for visible animation. Track `delta` from the RAF timestamp when simulation speed must be stable across refresh rates. Cancel RAF on teardown, pause or reduce work when hidden, and respect `prefers-reduced-motion`.

Choose one of these redraw strategies:

- Full redraw: acceptable for small/decorative scenes where simplicity wins.
- Dirty rectangles: moving objects with small bounded changes and stable background.
- Layered canvases: static/slow background, dynamic entities, UI/interaction overlay.
- Sprite/cache blits: repeated expensive shapes, text, markers, scaled images, particles.
- Worker OffscreenCanvas: heavy drawing or simulation that competes with input/main thread.

MANDATORY READ: before optimizing animation, large scenes, particles, charts, image scaling, high-DPI output, or worker rendering, read `references/performance.md`. Do NOT load library-selection unless adding/replacing a library.

Exit condition: write the frame pipeline in order: input sampling -> update -> clear/redraw strategy -> draw -> schedule next frame.

## Phase 4 - Implement Canvas Hygiene

Size canvas by backing store, not CSS alone. For crisp output, set CSS size separately, set `canvas.width/height = cssSize * devicePixelRatio`, then normalize transforms with `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)`. Lower DPR intentionally for performance-heavy scenes.

Initialize context with options that match the scene. Use `{ alpha: false }` for opaque canvases. Use `willReadFrequently: true` only for frequent `getImageData` reads, because it can change backing strategy.

For input, convert pointer coordinates through `getBoundingClientRect()` and the canvas scale. Do not trust `clientX/clientY` as canvas coordinates.

For accessibility, decorative canvases get `aria-hidden="true"` and no interactive handlers. Meaningful canvas interactions need DOM controls, keyboard paths, focus management, labels, or an equivalent non-canvas representation.

Exit condition: resize, DPR, context options, event coordinate mapping, motion preference, and teardown are all explicit.

## Phase 5 - Review and Verify

Review canvas code as a hot loop plus a resource lifecycle. Do not stop at visual correctness.

MANDATORY READ: when reviewing existing canvas code or before finalizing a new implementation, read `references/review-checklist.md`. Do NOT load library-selection unless the review includes dependency fit.

Verify with at least one runtime signal appropriate to the task: Chrome Performance panel, FPS meter, memory snapshot, interaction latency, reduced-motion path, hidden-tab behavior, or low-end/mobile throttling.

## Examples

- User asks "make a particle background": classify as decorative animation, reject DOM/SVG only if particle count or procedural drawing justifies canvas, then read `references/visual-quality.md` for the look and `references/performance.md` for the loop.
- User asks "build draggable shapes with selection": classify as interactive tool, read `references/library-selection.md`, likely choose Konva/Paper.js/raw Canvas 2D based on object model.
- User asks "review this canvas loop": classify existing workload, read `references/review-checklist.md`, and read `references/performance.md` only if jank, high object count, or hot-path concerns appear.
- User asks "add p5 sketch": read `references/library-selection.md`, verify current p5 docs before API code, then keep framework lifecycle boundaries explicit.

## NEVER

- **NEVER resize only with CSS for a drawn canvas**
  **Instead:** set backing store dimensions and CSS dimensions deliberately; apply DPR transform once after resize.
  **Why:** CSS-only scaling blurs output and hides a backing-store mismatch that gets worse on retina displays.

- **NEVER start a RAF loop without a teardown path**
  **Instead:** store the frame id, cancel on unmount/dispose, and guard against double-starting after visibility or media-query changes.
  **Why:** orphaned loops keep drawing detached canvases and create memory/CPU leaks that snapshots often misattribute to browser internals.

- **NEVER redraw expensive static content every frame because it is visually part of the scene**
  **Instead:** cache it in an offscreen canvas, image bitmap, layer canvas, Path2D, or library shape cache.
  **Why:** canvas is immediate-mode; unchanged visuals still cost full draw time unless explicitly cached or layered.

- **NEVER use a canvas-only interaction as the only accessible control**
  **Instead:** provide DOM controls/semantics or a keyboard-operable retained object model with labels and focus behavior.
  **Why:** canvas pixels do not expose roles, names, state, or hit targets to assistive technology.

- **NEVER move canvas work to OffscreenCanvas just because performance is poor**
  **Instead:** first identify whether the bottleneck is draw calls, state churn, overdraw, image scaling, pixel reads, or simulation; use workers when main-thread contention is the problem.
  **Why:** workers add transfer, bundling, and DOM-access constraints; they do not fix bad draw architecture.

- **NEVER treat retained-mode library performance rules as optional**
  **Instead:** disable listening on inert layers, cache expensive shapes, minimize layer count, and destroy nodes/stages through the library lifecycle.
  **Why:** libraries add scene graph and event machinery; ignoring their switches can be slower than raw canvas.
