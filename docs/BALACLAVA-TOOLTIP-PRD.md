# Balaclava Tooltip — Product Requirements Document

## Overview

A universal, self-contained tooltip system delivered as a Tampermonkey userscript. Designed to inject into any website (`@match *://*/*`) and provide tooltip functionality via both declarative data attributes and a programmatic JavaScript API.

**Architecture reference:** Based on `con-tooltip-commander` from the conx-configurator repository — a singleton tooltip manager that listens for custom events, calculates viewport-aware positioning with automatic fallback, and tracks target elements in real time.

---

## Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────┐
│  Host Page                                              │
│                                                         │
│  ┌─────────────────┐     ┌──────────────────────────┐  │
│  │ Consumer Script  │     │ MutationObserver         │  │
│  │ (via @require)   │     │ (watches data-balaclava- │  │
│  │                  │     │  tooltip attributes)     │  │
│  └───────┬──────────┘     └────────────┬─────────────┘  │
│          │                             │                │
│          ▼                             ▼                │
│  ┌──────────────────────────────────────────────────┐   │
│  │  unsafeWindow.BalaclavaTooltip                   │   │
│  │  .show(target, content, options)                  │   │
│  │  .hide()                                         │   │
│  │  .configure(config)                              │   │
│  │  .attach(element, content, options) → detachFn   │   │
│  │  .rescan()                                       │   │
│  └───────────────────────┬──────────────────────────┘   │
│                          │                              │
│                          ▼                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Tooltip Commander (singleton)                   │   │
│  │  ┌────────────────────────────────────────────┐  │   │
│  │  │ Shadow DOM Host (<div id="balaclava-root">)│  │   │
│  │  │                                            │  │   │
│  │  │  ┌─────────────────────────────────┐       │  │   │
│  │  │  │ .balaclava-tooltip (fixed pos)  │       │  │   │
│  │  │  │  ├─ .tooltip-content            │       │  │   │
│  │  │  │  └─ .tooltip-arrow              │       │  │   │
│  │  │  └─────────────────────────────────┘       │  │   │
│  │  └────────────────────────────────────────────┘  │   │
│  │                                                  │   │
│  │  Positioning Engine:                             │   │
│  │   • getInitialPosition()                         │   │
│  │   • setFallbackPosition() (single flip)          │   │
│  │   • setTooltipBounds() (clamp to viewport)       │   │
│  │   • updateArrowOffset()                          │   │
│  │                                                  │   │
│  │  Tracking:                                       │   │
│  │   • IntersectionObserver (auto-hide)             │   │
│  │   • requestAnimationFrame (position sync)        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| Shadow DOM for tooltip container | Full CSS isolation from host page; styles never bleed in or out |
| Singleton instance | One tooltip visible at a time; prevents visual chaos on unknown pages |
| `position: fixed` | Viewport-relative positioning; works regardless of scroll containers |
| rAF position tracking | Handles layout shifts, smooth scrolling, and dynamic content on arbitrary pages |
| IntersectionObserver | Auto-hides when target leaves viewport; no stale tooltips |
| Max z-index (`2147483647`) | Guarantees tooltip wins z-index battles on any page |
| IIFE module format | Self-contained, no build step, works as `@require` dependency |

---

## Tampermonkey Script Header

```javascript
// ==UserScript==
// @name        Balaclava Tooltip
// @namespace   https://github.com/balaclava
// @version     1.0.0
// @description Universal tooltip injection via Tampermonkey
// @author      TODO
// @match       *://*/*
// @grant       unsafeWindow
// @run-at      document-idle
// ==/UserScript==
```

### Consumer Script Header (using tooltip as dependency)

```javascript
// ==UserScript==
// @name        My Consumer Script
// @namespace   https://github.com/balaclava
// @version     1.0.0
// @description Uses Balaclava Tooltip
// @author      TODO
// @match       https://example.com/*
// @require     https://raw.githubusercontent.com/USER/balaclava-tooltip/main/dist/balaclava-tooltip.min.js
// @grant       unsafeWindow
// @run-at      document-idle
// ==/UserScript==

// unsafeWindow.BalaclavaTooltip is available here
```

---

## Public API

### `BalaclavaTooltip.show(target, content, options?)`

Show a tooltip anchored to an element.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `target` | `HTMLElement` | ✅ | Element the tooltip points to |
| `content` | `string \| Node` | ✅ | Tooltip content — plain text or DOM node |
| `options.position` | `'top' \| 'bottom' \| 'left' \| 'right'` | ❌ | Preferred position (default: `'bottom'`) |
| `options.showArrow` | `boolean` | ❌ | Show directional arrow (default: `true`) |

### `BalaclavaTooltip.hide()`

Immediately hide the active tooltip.

### `BalaclavaTooltip.configure(config)`

One-time configuration. Call before first use. Subsequent calls merge with existing config.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `bgColor` | `string` | `'#1a1a1a'` | Background color |
| `textColor` | `string` | `'#ffffff'` | Text color |
| `borderColor` | `string` | `'transparent'` | Border color |
| `borderRadius` | `string` | `'4px'` | Border radius |
| `padding` | `string` | `'8px 12px'` | Content padding |
| `maxWidth` | `string` | `'250px'` | Maximum tooltip width |
| `arrowSize` | `string` | `'6px'` | Arrow dimensions |
| `zIndex` | `number` | `2147483647` | Z-index value |
| `animationDuration` | `string` | `'150ms'` | Fade-in duration |
| `fontSize` | `string` | `'13px'` | Font size |
| `offset` | `number` | `8` | Gap between target and tooltip (px) |

### `BalaclavaTooltip.attach(element, content, options?) → detachFn`

Imperatively attach tooltip behavior to an element. Returns a cleanup function.

```javascript
const detach = BalaclavaTooltip.attach(
  document.querySelector('.my-btn'),
  'Click to save',
  { position: 'top' }
);

// Later:
detach(); // removes all listeners
```

### `BalaclavaTooltip.rescan()`

Re-scan the DOM for `data-balaclava-tooltip` attributes. Useful if MutationObserver missed elements (rare edge case).

---

## Declarative API (Data Attributes)

```html
<!-- Basic tooltip -->
<button data-balaclava-tooltip="Save your changes">Save</button>

<!-- With position -->
<button data-balaclava-tooltip="Settings" data-balaclava-tooltip-position="left">⚙</button>

<!-- Without arrow -->
<span data-balaclava-tooltip="Info" data-balaclava-tooltip-arrow="false">ℹ</span>
```

| Attribute | Required | Values | Default |
|-----------|----------|--------|---------|
| `data-balaclava-tooltip` | ✅ | Text content | — |
| `data-balaclava-tooltip-position` | ❌ | `top \| bottom \| left \| right` | `bottom` |
| `data-balaclava-tooltip-arrow` | ❌ | `true \| false` | `true` |

---

## Scaffolding Guide — Implementation Phases

### Phase 1: Script Shell & Shadow DOM Container

**Goal:** Create the Tampermonkey IIFE, inject a shadow host into the page, build the internal stylesheet.

**Reference:** `con-tooltip-commander.ts` lines 1–28 (class definition + styles), `con-tooltip-commander.scss` (full stylesheet).

```javascript
(function () {
  'use strict';

  // --- Config ---
  const DEFAULT_CONFIG = {
    bgColor: '#1a1a1a',
    textColor: '#ffffff',
    borderColor: 'transparent',
    borderRadius: '4px',
    padding: '8px 12px',
    maxWidth: '250px',
    arrowSize: '6px',
    zIndex: 2147483647,
    animationDuration: '150ms',
    fontSize: '13px',
    offset: 8
  };

  let config = { ...DEFAULT_CONFIG };

  // --- Shadow DOM Host ---
  const host = document.createElement('div');
  host.id = 'balaclava-tooltip-host';
  host.style.position = 'fixed';
  host.style.top = '0';
  host.style.left = '0';
  host.style.width = '0';
  host.style.height = '0';
  host.style.overflow = 'visible';
  host.style.pointerEvents = 'none';
  host.style.zIndex = String(config.zIndex);
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'closed' });

  // Inject styles (see Phase 2)
  // Inject tooltip DOM (see Phase 3)
})();
```

**Key differences from original:**
- Original uses Lit's `unsafeCSS()` + static `styles` property. Here, build a `<style>` element and append to shadow root.
- Original uses `:host { display: contents }`. Here, the host is a zero-size fixed element with `overflow: visible`.

---

### Phase 2: Stylesheet Construction

**Goal:** Translate the SCSS into a JS-generated CSS string that reads from the config object.

**Reference:** `con-tooltip-commander.scss` — all CSS custom properties and class definitions.

```javascript
function buildStylesheet() {
  return `
    .balaclava-tooltip {
      position: fixed;
      z-index: ${config.zIndex};
      max-width: ${config.maxWidth};
      color: ${config.textColor};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: ${config.fontSize};
      line-height: 1.4;
      pointer-events: none;
      opacity: 0;
      border: 1px solid ${config.borderColor};
      border-radius: ${config.borderRadius};
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      animation: balaclava-fade-in ${config.animationDuration} ease-out forwards;
    }

    .balaclava-tooltip-content {
      position: relative;
      z-index: 1;
      padding: ${config.padding};
      background-color: ${config.bgColor};
      border-radius: ${config.borderRadius};
    }

    .balaclava-tooltip-arrow {
      position: absolute;
      z-index: 0;
      width: ${config.arrowSize};
      height: ${config.arrowSize};
      background-color: ${config.bgColor};
      border-color: ${config.borderColor};
      border-style: solid;
      border-width: 1px;
      transform: rotate(45deg);
    }

    /* Arrow positions */
    .balaclava-tooltip.is-top .balaclava-tooltip-arrow {
      bottom: calc(${config.arrowSize} / -2);
      left: var(--arrow-offset, 50%);
      transform: translateX(-50%) rotate(45deg);
      border-top: none;
      border-left: none;
    }
    .balaclava-tooltip.is-bottom .balaclava-tooltip-arrow {
      top: calc(${config.arrowSize} / -2);
      left: var(--arrow-offset, 50%);
      transform: translateX(-50%) rotate(45deg);
      border-right: none;
      border-bottom: none;
    }
    .balaclava-tooltip.is-left .balaclava-tooltip-arrow {
      right: calc(${config.arrowSize} / -2);
      top: var(--arrow-offset, 50%);
      transform: translateY(-50%) rotate(45deg);
      border-bottom: none;
      border-left: none;
    }
    .balaclava-tooltip.is-right .balaclava-tooltip-arrow {
      left: calc(${config.arrowSize} / -2);
      top: var(--arrow-offset, 50%);
      transform: translateY(-50%) rotate(45deg);
      border-top: none;
      border-right: none;
    }

    @keyframes balaclava-fade-in {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
}
```

**Key differences from original:**
- Original uses SCSS `@use` imports for theme variables. Here, variables come from the JS `config` object.
- Original uses CSS custom properties set via `setVariables()` helper. Here, use `style.setProperty()` directly on the tooltip element.
- Arrow offset uses a CSS variable `--arrow-offset` set by JS during positioning.

---

### Phase 3: Tooltip DOM & Render Logic

**Goal:** Create and manage the tooltip element inside the shadow root.

**Reference:** `con-tooltip-commander.ts` lines 199–221 (`render()` method).

```javascript
// State
let tooltipEl = null;
let isVisible = false;
let targetElement = null;
let targetRect = null;
let preferredPosition = 'bottom';
let showArrow = true;
let arrowOffset = 50;
let positionTrackingId = null;
let intersectionObserver = null;
const tooltipId = `balaclava-tt-${Math.random().toString(36).slice(2, 11)}`;

// Style element
const styleEl = document.createElement('style');
styleEl.textContent = buildStylesheet();
shadow.appendChild(styleEl);

function renderTooltip(content) {
  // Remove existing
  if (tooltipEl) tooltipEl.remove();

  tooltipEl = document.createElement('div');
  tooltipEl.id = tooltipId;
  tooltipEl.className = `balaclava-tooltip is-${preferredPosition}`;
  tooltipEl.setAttribute('role', 'tooltip');
  tooltipEl.setAttribute('aria-live', 'polite');

  const contentEl = document.createElement('div');
  contentEl.className = 'balaclava-tooltip-content';

  if (typeof content === 'string') {
    contentEl.textContent = content;
    tooltipEl.setAttribute('aria-label', content);
  } else if (content instanceof Node) {
    contentEl.appendChild(content.cloneNode(true));
    tooltipEl.setAttribute('aria-label', content.textContent || 'Tooltip');
  }

  tooltipEl.appendChild(contentEl);

  if (showArrow) {
    const arrowEl = document.createElement('span');
    arrowEl.className = 'balaclava-tooltip-arrow';
    arrowEl.setAttribute('aria-hidden', 'true');
    tooltipEl.appendChild(arrowEl);
  }

  shadow.appendChild(tooltipEl);
}
```

**Key differences from original:**
- Original uses Lit's `html` tagged template + `when()` directive for conditional rendering. Here, imperative DOM creation.
- Original uses `@state()` decorator for reactivity (auto re-render). Here, manually call `renderTooltip()` / remove element.
- Original uses `classMap()` directive. Here, set `className` directly.

---

### Phase 4: Positioning Engine

**Goal:** Calculate tooltip position, handle fallback, constrain to viewport, adjust arrow offset.

**Reference:** `con-tooltip-commander.ts` lines 324–501 (`#getInitialPosition`, `#setFallbackPosition`, `#setTooltipBounds`, `#updateTooltipArrow`, `#updateTooltipPosition`).

```javascript
const SAFEZONE = 8;
const ARROW_OFFSET_MIN = 10;
const ARROW_OFFSET_MAX = 90;
const ARROW_OFFSET_DEFAULT = 50;

function getInitialPosition(tooltipWidth, tooltipHeight) {
  const targetCenterX = targetRect.left + (targetRect.width / 2);
  const targetCenterY = targetRect.top + (targetRect.height / 2);

  switch (preferredPosition) {
    case 'top':
      return {
        top: targetRect.top - tooltipHeight - config.offset,
        left: targetCenterX - (tooltipWidth / 2)
      };
    case 'left':
      return {
        top: targetCenterY - (tooltipHeight / 2),
        left: targetRect.left - tooltipWidth - config.offset
      };
    case 'right':
      return {
        top: targetCenterY - (tooltipHeight / 2),
        left: targetRect.right + config.offset
      };
    case 'bottom':
    default:
      return {
        top: targetRect.bottom + config.offset,
        left: targetCenterX - (tooltipWidth / 2)
      };
  }
}

function applyFallback(position, tooltipWidth, tooltipHeight) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  switch (preferredPosition) {
    case 'bottom':
      if (position.top + tooltipHeight > vh) {
        const alt = targetRect.top - tooltipHeight - config.offset;
        if (alt >= 0) { position.top = alt; preferredPosition = 'top'; }
      }
      break;
    case 'top':
      if (position.top < 0) {
        const alt = targetRect.bottom + config.offset;
        if (alt + tooltipHeight <= vh) { position.top = alt; preferredPosition = 'bottom'; }
      }
      break;
    case 'left':
      if (position.left < 0) {
        const alt = targetRect.right + config.offset;
        if (alt + tooltipWidth <= vw) { position.left = alt; preferredPosition = 'right'; }
      }
      break;
    case 'right':
      if (position.left + tooltipWidth > vw) {
        const alt = targetRect.left - tooltipWidth - config.offset;
        if (alt >= 0) { position.left = alt; preferredPosition = 'left'; }
      }
      break;
  }
}

function clampToViewport(position, tooltipWidth, tooltipHeight) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const original = { ...position };

  position.top = Math.max(SAFEZONE, Math.min(position.top, vh - tooltipHeight - SAFEZONE));
  position.left = Math.max(SAFEZONE, Math.min(position.left, vw - tooltipWidth - SAFEZONE));

  // Recalculate arrow offset if clamped
  if (showArrow) {
    updateArrowOffset(original, position, tooltipWidth, tooltipHeight);
  }
}

function updateArrowOffset(original, clamped, tooltipWidth, tooltipHeight) {
  arrowOffset = ARROW_OFFSET_DEFAULT;

  if (preferredPosition === 'top' || preferredPosition === 'bottom') {
    if (original.left !== clamped.left) {
      const targetCenterX = targetRect.left + (targetRect.width / 2);
      const tooltipCenterX = clamped.left + (tooltipWidth / 2);
      const offset = targetCenterX - tooltipCenterX;
      arrowOffset = calculatePercentageOffset(offset, tooltipWidth);
    }
  } else {
    if (original.top !== clamped.top) {
      const targetCenterY = targetRect.top + (targetRect.height / 2);
      const tooltipCenterY = clamped.top + (tooltipHeight / 2);
      const offset = targetCenterY - tooltipCenterY;
      arrowOffset = calculatePercentageOffset(offset, tooltipHeight);
    }
  }
}

function calculatePercentageOffset(offset, dimension) {
  const percentage = ARROW_OFFSET_DEFAULT + (offset / dimension) * 100;
  return Math.max(ARROW_OFFSET_MIN, Math.min(ARROW_OFFSET_MAX, percentage));
}

function updateTooltipPosition() {
  if (!targetRect || !tooltipEl) return;

  const rect = tooltipEl.getBoundingClientRect();
  const position = getInitialPosition(rect.width, rect.height);
  applyFallback(position, rect.width, rect.height);
  clampToViewport(position, rect.width, rect.height);

  tooltipEl.style.top = `${position.top}px`;
  tooltipEl.style.left = `${position.left}px`;
  tooltipEl.style.setProperty('--arrow-offset', `${arrowOffset}%`);
  tooltipEl.className = `balaclava-tooltip is-${preferredPosition}${showArrow ? '' : ' no-arrow'}`;
}
```

**Key differences from original:**
- Original uses `getVariable()` helper to read CSS custom property for offset. Here, read directly from `config.offset`.
- Original uses `setVariables()` helper to batch-set CSS vars. Here, use `style.top`/`style.left`/`style.setProperty()` directly.
- Original stores position in `@state()` properties triggering re-render. Here, directly mutate the DOM element.

---

### Phase 5: Event Listeners & Tracking

**Goal:** Listen for scroll/resize, track target position via rAF, auto-hide via IntersectionObserver.

**Reference:** `con-tooltip-commander.ts` lines 87–172 (event handlers), lines 255–306 (observers + cleanup).

```javascript
function setupGlobalListeners() {
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
}

function handleResize() {
  if (isVisible) updateTooltipPosition();
}

function handleScroll() {
  if (isVisible && targetElement) {
    requestAnimationFrame(() => {
      targetRect = targetElement.getBoundingClientRect();
      updateTooltipPosition();
    });
  }
}

function trackTargetPosition() {
  if (!isVisible || !targetElement) return;

  const newRect = targetElement.getBoundingClientRect();
  if (!targetRect ||
      newRect.top !== targetRect.top ||
      newRect.left !== targetRect.left ||
      newRect.width !== targetRect.width ||
      newRect.height !== targetRect.height) {
    targetRect = newRect;
    updateTooltipPosition();
  }

  positionTrackingId = requestAnimationFrame(trackTargetPosition);
}

function setupIntersectionObserver() {
  cleanupIntersectionObserver();

  intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting && isVisible) {
        hideTooltip();
      }
    });
  }, { threshold: 0, rootMargin: '0px' });

  intersectionObserver.observe(targetElement);
}

function cleanupIntersectionObserver() {
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }
}

function cleanupTooltip() {
  if (targetElement) {
    targetElement.removeAttribute('aria-describedby');
  }
  if (positionTrackingId !== null) {
    cancelAnimationFrame(positionTrackingId);
    positionTrackingId = null;
  }
  if (tooltipEl) {
    tooltipEl.remove();
    tooltipEl = null;
  }
  isVisible = false;
  cleanupIntersectionObserver();
  targetElement = null;
  targetRect = null;
}
```

**Key differences from original:**
- Original uses `AbortController` pattern for cleanup (Lit component lifecycle). Here, listeners are permanent (script lifetime = page lifetime), only per-tooltip observers need cleanup.
- Original uses `addTypeSafeEventListener` wrapper. Here, standard `addEventListener`.

---

### Phase 6: Public API & MutationObserver

**Goal:** Wire up the `unsafeWindow.BalaclavaTooltip` API and the declarative attribute scanner.

**Reference:** `tooltipHelpers.ts` (full file — `showTooltip`, `hideTooltip`, `createTooltipHandler`, `withTooltip`).

```javascript
// --- Core show/hide ---
function showTooltipFn(target, content, options = {}) {
  cleanupTooltip();

  targetElement = target;
  targetRect = target.getBoundingClientRect();
  preferredPosition = options.position || 'bottom';
  showArrow = options.showArrow !== undefined ? options.showArrow : true;
  isVisible = true;

  target.setAttribute('aria-describedby', tooltipId);

  renderTooltip(content);
  setupIntersectionObserver();

  requestAnimationFrame(() => {
    updateTooltipPosition();
    trackTargetPosition();
  });
}

function hideTooltip() {
  cleanupTooltip();
}

// --- Attach (imperative binding) ---
function attachTooltip(element, content, options = {}) {
  const onShow = () => showTooltipFn(element, content, options);
  const onHide = () => hideTooltip();

  element.addEventListener('mouseover', onShow);
  element.addEventListener('mouseout', onHide);
  element.addEventListener('focus', onShow);
  element.addEventListener('blur', onHide);

  return () => {
    element.removeEventListener('mouseover', onShow);
    element.removeEventListener('mouseout', onHide);
    element.removeEventListener('focus', onShow);
    element.removeEventListener('blur', onHide);
  };
}

// --- Declarative attribute scanning ---
const attachedElements = new WeakMap();

function scanElement(el) {
  if (attachedElements.has(el)) return;

  const text = el.getAttribute('data-balaclava-tooltip');
  if (!text) return;

  const position = el.getAttribute('data-balaclava-tooltip-position') || 'bottom';
  const arrow = el.getAttribute('data-balaclava-tooltip-arrow') !== 'false';

  const detach = attachTooltip(el, text, { position, showArrow: arrow });
  attachedElements.set(el, detach);
}

function scanAll() {
  document.querySelectorAll('[data-balaclava-tooltip]').forEach(scanElement);
}

function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // New nodes added
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (node.hasAttribute('data-balaclava-tooltip')) scanElement(node);
          node.querySelectorAll?.('[data-balaclava-tooltip]').forEach(scanElement);
        });
        // Removed nodes — cleanup
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          const detach = attachedElements.get(node);
          if (detach) { detach(); attachedElements.delete(node); }
        });
      }
      // Attribute changes
      if (mutation.type === 'attributes') {
        const el = mutation.target;
        const oldDetach = attachedElements.get(el);
        if (oldDetach) { oldDetach(); attachedElements.delete(el); }
        if (el.hasAttribute('data-balaclava-tooltip')) scanElement(el);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-balaclava-tooltip', 'data-balaclava-tooltip-position', 'data-balaclava-tooltip-arrow']
  });
}

// --- Configure ---
function configureFn(userConfig) {
  config = { ...config, ...userConfig };
  // Rebuild stylesheet
  styleEl.textContent = buildStylesheet();
  // Update host z-index
  host.style.zIndex = String(config.zIndex);
}

// --- Initialize ---
setupGlobalListeners();
scanAll();
setupMutationObserver();

// --- Expose API ---
unsafeWindow.BalaclavaTooltip = {
  show: showTooltipFn,
  hide: hideTooltip,
  configure: configureFn,
  attach: attachTooltip,
  rescan: scanAll
};
```

**Key differences from original:**
- Original dispatches custom events on `window` (`tooltip:show`/`tooltip:hide`) and the commander listens. Here, the API calls internal functions directly — no event indirection needed since it's a single script.
- Original's `createTooltipHandler()` returns `{ onShow, onHide }` for use in Lit templates. Here, `attach()` wires listeners directly and returns a detach function.
- Original uses `WeakMap`-equivalent via component lifecycle. Here, explicit `WeakMap` tracks attached elements for cleanup.

---

## Accessibility Requirements

| Feature | Implementation |
|---------|---------------|
| `role="tooltip"` | Set on tooltip element |
| `aria-describedby` | Set on target → links to tooltip's `id` |
| `aria-live="polite"` | On tooltip element for screen reader announcements |
| `aria-hidden="true"` | On arrow element (decorative) |
| `aria-label` | On tooltip element — mirrors text content |
| Focus triggers | `focus`/`blur` events trigger show/hide alongside mouse events |
| Unique ID | Random `balaclava-tt-*` ID per session |

---

## File Structure (Final)

```
balaclava-tooltip/
├── dist/
│   └── balaclava-tooltip.user.js    # Built IIFE (single file)
├── src/
│   ├── index.js                      # Entry — IIFE wrapper + init
│   ├── config.js                     # DEFAULT_CONFIG + configure()
│   ├── dom.js                        # Shadow host + style injection
│   ├── render.js                     # renderTooltip() + cleanup
│   ├── position.js                   # Positioning engine (4 functions)
│   ├── tracking.js                   # rAF + IntersectionObserver
│   ├── api.js                        # show/hide/attach/rescan
│   └── observer.js                   # MutationObserver + scanAll
├── README.md
└── package.json                      # Optional — for bundling with esbuild/rollup
```

> **Note:** For simplicity, you can keep everything in a single `balaclava-tooltip.user.js` file. The modular structure above is for maintainability if the project grows. Use `esbuild --bundle --format=iife` to combine.

---

## Mapping: Original → Balaclava

| Original (conx-configurator) | Balaclava Equivalent |
|------------------------------|---------------------|
| `ConTooltipCommander` class | IIFE module state + functions |
| `CoreElement` base class | Not needed — no framework |
| `@state()` decorator (Lit reactivity) | Plain variables + manual DOM updates |
| `@query('.tooltip')` | Direct reference to created element |
| `html\`...\`` templates | `document.createElement()` |
| `when()` / `classMap()` directives | `if` statements / `className =` |
| `unsafeCSS()` | `<style>` element in shadow root |
| `addTypeSafeEventListener()` | `addEventListener()` |
| `dispatchTypeSafeEvent()` | Direct function calls (no events needed) |
| `getVariable()` / `setVariables()` | `config.offset` / `el.style.setProperty()` |
| `calculatePercentageOffset()` | Inline function (same math) |
| `connectedCallback()` | IIFE execution (runs once at `document-idle`) |
| `disconnectedCallback()` | Not needed — script lives for page lifetime |
| `AbortController` cleanup | Not needed for global listeners; per-tooltip cleanup is manual |
| Custom events (`tooltip:show/hide`) | Direct API calls |
| `tooltipHelpers.ts` | `BalaclavaTooltip.show/hide/attach` |

---

## Testing Checklist

- [ ] Tooltip appears on hover of element with `data-balaclava-tooltip`
- [ ] Tooltip appears on focus of element with `data-balaclava-tooltip`
- [ ] Tooltip hides on mouseout / blur
- [ ] `BalaclavaTooltip.show()` works with string content
- [ ] `BalaclavaTooltip.show()` works with DOM node content
- [ ] `BalaclavaTooltip.hide()` immediately removes tooltip
- [ ] `BalaclavaTooltip.attach()` returns working detach function
- [ ] `BalaclavaTooltip.configure()` changes visual appearance
- [ ] `BalaclavaTooltip.rescan()` picks up new data attributes
- [ ] Position fallback: bottom → top when near viewport bottom
- [ ] Position fallback: top → bottom when near viewport top
- [ ] Position fallback: left → right when near viewport left
- [ ] Position fallback: right → left when near viewport right
- [ ] Tooltip clamps to viewport (never clips off-screen)
- [ ] Arrow offset adjusts when tooltip is clamped
- [ ] Tooltip auto-hides when target scrolls out of view
- [ ] Tooltip follows target during layout shifts (rAF tracking)
- [ ] Only one tooltip visible at a time (singleton)
- [ ] Styles don't leak into host page (Shadow DOM isolation)
- [ ] Host page styles don't affect tooltip appearance
- [ ] `aria-describedby` set/removed correctly on target
- [ ] Works as `@require` dependency in another userscript
- [ ] Dynamically added `data-balaclava-tooltip` elements are detected
- [ ] Removed elements get listeners cleaned up (WeakMap)
- [ ] No console errors on pages with strict CSP (inline styles in Shadow DOM are allowed)
