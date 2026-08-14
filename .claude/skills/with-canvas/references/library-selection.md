# Canvas Library Selection

Use this before adding a dependency or reviewing whether a canvas library fits the workload.

## Raw Canvas 2D

Choose raw Canvas 2D for small bundles, custom render loops, particles, simple games, pixel effects, chart internals, or when the data model is already separate from rendering.

Cost: you own hit testing, scene ordering, invalidation, serialization, accessibility alternatives, resize, and lifecycle.

## p5.js

Choose p5.js for creative coding, generative art, education, sketches, and fast visual experimentation. Its `setup()`/`draw()` model is ideal when the output is a sketch rather than an app component.

Avoid as the default for production UI components inside a framework unless the team accepts p5's global-ish lifecycle, wrapper needs, and bundle/runtime model.

## Paper.js

Choose Paper.js for vector graphics tools: paths, segments, bezier editing, boolean-ish vector workflows, SVG import/export, project/layer hierarchy, mouse tools, and geometric manipulation.

Avoid for high-count sprite/particle rendering where object graph overhead beats vector ergonomics.

## Pencil.js

Choose Pencil.js when a lightweight scene/component abstraction fits and its modules cover the needed shapes/events. Its docs expose Scene, components, particles, offscreen canvas, events, gradients, patterns, and geometry helpers.

Before adopting, check package maintenance, TypeScript shape, framework integration, and browser/build compatibility. Do not choose it only because it wraps common canvas calls.

## Konva

Choose Konva for retained-mode 2D app surfaces: draggable/resizable objects, layer control, declarative framework bindings, event listening, shape caching, and selection/transform UI.

Performance rules are part of the architecture: disable listening for inert layers/shapes, cache complex shapes, minimize stage size and layer count, tune pixel ratio when needed, and destroy stages/nodes.

## ZIM and Similar Interaction Frameworks

Choose ZIM-style frameworks for canvas-first interactive media, component-like controls, stage updates, and education/prototyping where the framework's event model is the app model.

Avoid mixing them casually with DOM UI frameworks unless ownership boundaries are clear.

## Three.js / Babylon.js / WebGL

Choose WebGL or an engine when the problem is 3D, shaders, cameras, materials, lighting, GPU sprites, particle fields, or huge geometry. Do not force Canvas 2D to imitate a GPU pipeline.

Review resource disposal as seriously as JS cleanup: textures, buffers, materials, scenes, render targets, engine instances, and observers.

## Decision Table

| Requirement | Best first option |
|---|---|
| Decorative particles/background | Raw Canvas 2D, maybe OffscreenCanvas |
| Generative sketch | p5.js or raw Canvas 2D |
| Editable vector paths/SVG export | Paper.js |
| Drag/drop objects in app UI | Konva |
| Lightweight scene abstraction | Pencil.js |
| Canvas-native components/interactivity | ZIM-style framework |
| 3D/GPU/shaders | Three.js, Babylon.js, WebGL |
| 100k+ data markers | Raw Canvas 2D with batching/cache or WebGL |

## Adoption Gate

Before adding any library, answer:

- What library feature removes code we would otherwise maintain?
- What performance controls does the library expose?
- How does it mount/unmount inside the host framework?
- How are assets, DPR, resize, input, accessibility, and reduced motion handled?
- What is the escape hatch to raw context/WebGL if the abstraction is too slow?
