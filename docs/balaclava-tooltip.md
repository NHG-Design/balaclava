# Balaclava Tooltip

Balaclava Tooltip is a dependency-free Tampermonkey helper that exposes one global API:

```javascript
unsafeWindow.BalaclavaTooltip
```

It is intended to be used by external userscripts via `@require`. The lowest-cost hosting option is GitHub raw content, because it does not depend on this SvelteKit app or Cloudflare Pages bandwidth.

```javascript
// @require https://raw.githubusercontent.com/nhg-design/balaclava/v1.0.1/dist/balaclava-tooltip.user.js
// @grant   unsafeWindow
```

Prefer a version tag or release branch instead of `main` for user-facing scripts so a tooltip change cannot silently break installed scripts.

## API

```javascript
const tooltip = unsafeWindow.BalaclavaTooltip;

tooltip.show(element, 'Tooltip text', { position: 'top', theme: 'dark' });
tooltip.hide();

const detach = tooltip.attach(element, 'Tooltip text', { position: 'bottom', theme: 'light' });
detach();

tooltip.configure({
  theme: 'system',
  borderRadius: '4px',
  padding: '8px 12px',
  maxWidth: '250px',
  arrowSize: '6px',
  zIndex: 2147483647,
  animationDuration: '150ms',
  fontSize: '13px',
  offset: 8
});

tooltip.rescan();

tooltip.destroy(); // Removes listeners, observers, and the Shadow DOM host
```

`show()` accepts string content or a DOM node. String content is rendered with `textContent`.

## Themes

Supported themes are `system`, `dark`, `light`, and `custom`. The default is `system`, which follows the browser's `prefers-color-scheme` setting. Global configuration applies to new tooltips unless a specific tooltip overrides it.

```javascript
tooltip.configure({ theme: 'dark' });
tooltip.show(element, 'Light one-off', { theme: 'light' });
tooltip.attach(element, 'System-aware', { theme: 'system' });
```

`custom` uses the legacy color configuration keys. Passing any custom color without an explicit `theme` switches the global theme to `custom`.

```javascript
tooltip.configure({
  bgColor: 'oklch(18% 0.012 260)',
  textColor: 'oklch(96% 0.012 95)',
  borderColor: 'oklch(96% 0.012 95 / 0.16)',
  shadowColor: 'oklch(12% 0.01 260 / 0.36)'
});
```

## Declarative Tooltips

```html
<button data-balaclava-tooltip="Save your changes">Save</button>

<button
  data-balaclava-tooltip="Settings"
  data-balaclava-tooltip-position="left"
  data-balaclava-tooltip-arrow="false"
  data-balaclava-tooltip-theme="light"
>
  Settings
</button>
```

Supported positions are `top`, `bottom`, `left`, and `right`. Invalid positions fall back to `bottom`.
Supported declarative themes are `system`, `dark`, `light`, and `custom`. Invalid themes use the current global theme.

## Behavior

- Uses a closed Shadow DOM host for CSS isolation.
- Keeps only one tooltip visible at a time.
- Flips once when the preferred side does not fit.
- Clamps to the viewport and shifts the arrow toward the target.
- Tracks target movement with `requestAnimationFrame`.
- Hides when the target leaves the viewport or is removed from the DOM.
- Adds and removes `aria-describedby` on the target.
- Uses `AbortController` for event listener teardown.
