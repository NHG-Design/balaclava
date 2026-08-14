# Canvas Visual Quality

Use this for decorative animation and generative art, where the output's job is to look good. Performance and a11y hygiene still apply; this covers the aesthetic bar those two workloads live or die by. Skip it for data rendering, tools, games, and engine canvases, where correctness dominates.

## Decide the Look Before the Loop

Name the intended feel in one line before writing draw calls: calm/ambient, energetic, dense/organic, minimal/geometric. Every later choice (palette, count, motion, scale) serves that line. An unnamed aesthetic defaults to generic noise.

State the reference if there is one — aurora, ink, constellation, flow field, confetti — but keep it subtle in the output, not literal.

## Palette Restraint

Pick a small deliberate palette: 2-4 hues plus tints, not per-particle random RGB. Random hues read as noise; a constrained palette reads as intent.

Prefer HSL for coherent variation: fix or narrow hue, vary lightness/alpha for depth. Add subtle hue drift within a range rather than jumping across the wheel.

Respect the host theme. On a dark ground use luminous accents at low alpha; on light, use denser saturated marks. Never emit pure `#000`/`#fff` fills where a slightly tinted tone reads as considered.

## Composition and Density

Aim for intentional distribution, not uniform scatter. Vary size, position, and opacity so the eye finds structure. Golden-ratio or Poisson-disc spacing beats pure `Math.random()` for organic-but-not-clumpy layouts.

Leave negative space. Fewer, better-placed elements beat a full field. Tune density until it feels composed, not maximal.

Build depth with layering: slower/larger/dimmer marks behind, faster/smaller/brighter in front. Parallax and alpha falloff sell 3D from 2D primitives.

## Motion Intent

Motion should have a character, not just movement. Choose eased, organic paths — sine drift, noise fields, spring settle — over linear constant velocity. Vary per-element speed and phase so nothing marches in lockstep.

Keep it calm by default. Slow, subtle motion reads as premium; fast jitter reads as cheap. Fade elements in/out at lifecycle edges instead of popping.

`prefers-reduced-motion` gets a composed static frame, not a blank canvas — the still image should stand on its own.

## Craft Details

Soft edges where the look calls for it: low-alpha layering, additive blending (`globalCompositeOperation = 'lighter'`) for glow, subtle blur for atmosphere. Use sparingly; overdraw kills both frame budget and taste.

Avoid the AI-generated tells: uniform grids, pure-random confetti, harsh full-saturation primaries, hard 1px edges everywhere, and motion with no easing. If it looks like the default example, change one deliberate thing.

Ship a tuned result. Iterate on count, palette, speed, and scale until it reads as composed — the same "labored-over" bar a designer would hold, not the first parameter set that runs.

## Source Basis

Adapted from Anthropic's canvas-design craft principles (design-philosophy-first, deliberate composition, restraint) into HTML5 canvas terms, plus generative-art conventions: constrained palettes, noise/flow fields, layered depth, and eased organic motion.
