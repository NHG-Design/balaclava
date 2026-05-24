# Balaclava Tooltip

Balaclava Tooltip is a dependency-free Tampermonkey helper that exposes one global API:

```javascript
unsafeWindow.BalaclavaTooltip
```

It is intended to be used by external userscripts via `@require`. The lowest-cost hosting option is GitHub raw content, because it does not depend on this SvelteKit app or Cloudflare Pages bandwidth.

```javascript
// @require https://raw.githubusercontent.com/robcsaszar/balaclava/v1.0.0/dist/balaclava-tooltip.user.js
// @grant   unsafeWindow
```

Prefer a version tag or release branch instead of `main` for user-facing scripts so a tooltip change cannot silently break installed scripts.

## API

```javascript
const tooltip = unsafeWindow.BalaclavaTooltip;

tooltip.show(element, 'Tooltip text', { position: 'top' });
tooltip.hide();

const detach = tooltip.attach(element, 'Tooltip text', { position: 'bottom' });
detach();

tooltip.configure({
  bgColor: '#111318',
  textColor: '#f7f3e8',
  borderColor: 'rgba(247, 243, 232, 0.18)',
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
```

`show()` accepts string content or a DOM node. String content is rendered with `textContent`.

## Declarative Tooltips

```html
<button data-balaclava-tooltip="Save your changes">Save</button>

<button
  data-balaclava-tooltip="Settings"
  data-balaclava-tooltip-position="left"
  data-balaclava-tooltip-arrow="false"
>
  Settings
</button>
```

Supported positions are `top`, `bottom`, `left`, and `right`. Invalid positions fall back to `bottom`.

## Behavior

- Uses a closed Shadow DOM host for CSS isolation.
- Keeps only one tooltip visible at a time.
- Flips once when the preferred side does not fit.
- Clamps to the viewport and shifts the arrow toward the target.
- Tracks target movement with `requestAnimationFrame`.
- Hides when the target leaves the viewport or is removed from the DOM.
- Adds and removes `aria-describedby` on the target.
