// ==UserScript==
// @name        Balaclava Tooltip
// @namespace   https://github.com/NHG-Design/balaclava
// @version     1.0.1
// @description Universal tooltip injection via Tampermonkey
// @author      Balaclava
// @match       *://*/*
// @grant       unsafeWindow
// @run-at      document-idle
// ==/UserScript==

(function () {
  'use strict';

  const API_NAME = 'BalaclavaTooltip';
  const HOST_ID = 'balaclava-tooltip-host';
  const SAFEZONE = 8;
  const ARROW_OFFSET_MIN = 10;
  const ARROW_OFFSET_MAX = 90;
  const ARROW_OFFSET_DEFAULT = 50;
  const VALID_POSITIONS = new Set(['top', 'bottom', 'left', 'right']);
  const VALID_THEMES = new Set(['system', 'dark', 'light', 'custom']);
  const CUSTOM_THEME_KEYS = new Set(['bgColor', 'textColor', 'borderColor', 'shadowColor']);

  const THEME_TOKENS = Object.freeze({
    dark: Object.freeze({
      bgColor: 'oklch(18% 0.012 260)',
      textColor: 'oklch(96% 0.012 95)',
      borderColor: 'oklch(96% 0.012 95 / 0.16)',
      shadowColor: 'oklch(12% 0.01 260 / 0.36)'
    }),
    light: Object.freeze({
      bgColor: 'oklch(98% 0.008 95)',
      textColor: 'oklch(24% 0.014 260)',
      borderColor: 'oklch(24% 0.014 260 / 0.14)',
      shadowColor: 'oklch(24% 0.014 260 / 0.16)'
    })
  });

  const rootWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  if (rootWindow[API_NAME]?.version) {
    return;
  }

  const DEFAULT_CONFIG = Object.freeze({
    theme: 'system',
    bgColor: THEME_TOKENS.dark.bgColor,
    textColor: THEME_TOKENS.dark.textColor,
    borderColor: THEME_TOKENS.dark.borderColor,
    shadowColor: THEME_TOKENS.dark.shadowColor,
    borderSize: '1px',
    borderRadius: '4px',
    padding: '8px 12px',
    maxWidth: '250px',
    arrowSize: '6px',
    arrowBorderSize: null,
    arrowBorderColor: null,
    arrowBorderRadius: null,
    zIndex: 2147483647,
    animationDuration: '150ms',
    fontSize: '13px',
    offset: 8
  });

  let config = { ...DEFAULT_CONFIG };
  let host = null;
  let shadow = null;
  let styleEl = null;
  let tooltipEl = null;
  let targetElement = null;
  let targetRect = null;
  let preferredPosition = 'bottom';
  let requestedPosition = 'bottom';
  let activeTheme = DEFAULT_CONFIG.theme;
  let tooltipThemeOverride = null;
  let showArrow = true;
  let arrowOffset = ARROW_OFFSET_DEFAULT;
  let positionTrackingId = null;
  let intersectionObserver = null;
  let mutationObserver = null;
  let scrollFrameId = null;
  let isVisible = false;
  let globalListenersController = null;
  let readyController = null;

  const tooltipId = `balaclava-tt-${Math.random().toString(36).slice(2, 11)}`;
  let attachedElements = new WeakMap();
  const attachmentDetachers = new Set();

  function init() {
    ensureHost();
    setupGlobalListeners();
    scanAll();
    setupMutationObserver();
  }

  function ensureHost() {
    if (host) return;

    host = document.createElement('div');
    host.id = HOST_ID;
    host.style.position = 'fixed';
    host.style.top = '0';
    host.style.left = '0';
    host.style.width = '0';
    host.style.height = '0';
    host.style.overflow = 'visible';
    host.style.pointerEvents = 'none';
    host.style.zIndex = String(config.zIndex);

    if (!host.isConnected) {
      (document.body || document.documentElement).appendChild(host);
    }

    shadow = host.shadowRoot || host.attachShadow({ mode: 'closed' });
    styleEl = document.createElement('style');
    styleEl.textContent = buildStylesheet();
    shadow.appendChild(styleEl);
  }

  function buildStylesheet() {
    const visualConfig = getVisualConfig();

    return `
      .balaclava-tooltip {
        --balaclava-tooltip-bg: ${THEME_TOKENS.dark.bgColor};
        --balaclava-tooltip-text: ${THEME_TOKENS.dark.textColor};
        --balaclava-tooltip-border: ${THEME_TOKENS.dark.borderColor};
        --balaclava-tooltip-shadow: ${THEME_TOKENS.dark.shadowColor};
        --balaclava-tooltip-border-size: ${visualConfig.borderSize};
        --balaclava-tooltip-border-radius: ${visualConfig.borderRadius};
        --balaclava-tooltip-arrow-size: ${visualConfig.arrowSize};
        --balaclava-tooltip-arrow-border-size: ${visualConfig.arrowBorderSize};
        --balaclava-tooltip-arrow-border-color: ${visualConfig.arrowBorderColor};
        --balaclava-tooltip-arrow-border-radius: ${visualConfig.arrowBorderRadius};
        position: fixed;
        top: 0;
        left: 0;
        z-index: ${config.zIndex};
        box-sizing: border-box;
        max-width: ${visualConfig.maxWidth};
        color: var(--balaclava-tooltip-text);
        color-scheme: dark;
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: ${visualConfig.fontSize};
        line-height: 1.4;
        letter-spacing: 0;
        overflow-wrap: anywhere;
        pointer-events: none;
        opacity: 1;
        border: var(--balaclava-tooltip-border-size) solid var(--balaclava-tooltip-border);
        border-radius: var(--balaclava-tooltip-border-radius);
        filter: drop-shadow(0 10px 18px var(--balaclava-tooltip-shadow));
        transform: scale(1);
        transition:
          opacity ${visualConfig.animationDuration} ease-out,
          transform ${visualConfig.animationDuration} ease-out;
      }

      .balaclava-tooltip-content {
        position: relative;
        z-index: 1;
        box-sizing: border-box;
        padding: ${visualConfig.padding};
        color: var(--balaclava-tooltip-text);
        background: var(--balaclava-tooltip-bg);
        border-radius: var(--balaclava-tooltip-border-radius);
      }

      .balaclava-tooltip-arrow {
        position: absolute;
        z-index: 0;
        box-sizing: border-box;
        width: var(--balaclava-tooltip-arrow-size);
        height: var(--balaclava-tooltip-arrow-size);
        background: var(--balaclava-tooltip-bg);
        border-color: var(--balaclava-tooltip-arrow-border-color);
        border-style: solid;
        border-width: var(--balaclava-tooltip-arrow-border-size);
        border-radius: var(--balaclava-tooltip-arrow-border-radius);
      }

      .balaclava-tooltip.is-theme-system,
      .balaclava-tooltip.is-theme-dark {
        --balaclava-tooltip-bg: ${THEME_TOKENS.dark.bgColor};
        --balaclava-tooltip-text: ${THEME_TOKENS.dark.textColor};
        --balaclava-tooltip-border: ${THEME_TOKENS.dark.borderColor};
        --balaclava-tooltip-shadow: ${THEME_TOKENS.dark.shadowColor};
        color-scheme: dark;
      }

      .balaclava-tooltip.is-theme-light {
        --balaclava-tooltip-bg: ${THEME_TOKENS.light.bgColor};
        --balaclava-tooltip-text: ${THEME_TOKENS.light.textColor};
        --balaclava-tooltip-border: ${THEME_TOKENS.light.borderColor};
        --balaclava-tooltip-shadow: ${THEME_TOKENS.light.shadowColor};
        color-scheme: light;
      }

      .balaclava-tooltip.is-theme-custom {
        --balaclava-tooltip-bg: ${config.bgColor};
        --balaclava-tooltip-text: ${config.textColor};
        --balaclava-tooltip-border: ${config.borderColor};
        --balaclava-tooltip-shadow: ${config.shadowColor};
      }

      .balaclava-tooltip.is-top .balaclava-tooltip-arrow {
        bottom: calc(var(--balaclava-tooltip-arrow-size) / -2);
        left: var(--arrow-offset, 50%);
        transform: translateX(-50%) rotate(45deg);
        border-top: none;
        border-left: none;
      }

      .balaclava-tooltip.is-bottom .balaclava-tooltip-arrow {
        top: calc(var(--balaclava-tooltip-arrow-size) / -2);
        left: var(--arrow-offset, 50%);
        transform: translateX(-50%) rotate(45deg);
        border-right: none;
        border-bottom: none;
      }

      .balaclava-tooltip.is-left .balaclava-tooltip-arrow {
        right: calc(var(--balaclava-tooltip-arrow-size) / -2);
        top: var(--arrow-offset, 50%);
        transform: translateY(-50%) rotate(45deg);
        border-bottom: none;
        border-left: none;
      }

      .balaclava-tooltip.is-right .balaclava-tooltip-arrow {
        left: calc(var(--balaclava-tooltip-arrow-size) / -2);
        top: var(--arrow-offset, 50%);
        transform: translateY(-50%) rotate(45deg);
        border-top: none;
        border-right: none;
      }

      .balaclava-tooltip.is-top {
        transform-origin: var(--arrow-offset, 50%) calc(100% + var(--balaclava-tooltip-arrow-size));
      }

      .balaclava-tooltip.is-bottom {
        transform-origin: var(--arrow-offset, 50%) calc(0px - var(--balaclava-tooltip-arrow-size));
      }

      .balaclava-tooltip.is-left {
        transform-origin: calc(100% + var(--balaclava-tooltip-arrow-size)) var(--arrow-offset, 50%);
      }

      .balaclava-tooltip.is-right {
        transform-origin: calc(0px - var(--balaclava-tooltip-arrow-size)) var(--arrow-offset, 50%);
      }

      .balaclava-tooltip.is-entering {
        opacity: 0;
        transform: scale(0.97);
      }

      @media (prefers-color-scheme: light) {
        .balaclava-tooltip.is-theme-system {
          --balaclava-tooltip-bg: ${THEME_TOKENS.light.bgColor};
          --balaclava-tooltip-text: ${THEME_TOKENS.light.textColor};
          --balaclava-tooltip-border: ${THEME_TOKENS.light.borderColor};
          --balaclava-tooltip-shadow: ${THEME_TOKENS.light.shadowColor};
          color-scheme: light;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .balaclava-tooltip {
          transition-duration: 1ms;
        }
      }
    `;
  }

  function getVisualConfig() {
    return {
      ...config,
      arrowBorderSize: config.arrowBorderSize ?? config.borderSize,
      arrowBorderColor: config.arrowBorderColor ?? 'var(--balaclava-tooltip-border)',
      arrowBorderRadius: config.arrowBorderRadius ?? config.borderRadius
    };
  }

  function exposeApi() {
    const api = {
      version: '1.0.1',
      show: showTooltip,
      hide: hideTooltip,
      configure: configure,
      attach: attachTooltip,
      rescan: scanAll,
      destroy: destroy
    };

    rootWindow[API_NAME] = api;

    if (window !== rootWindow) {
      window[API_NAME] = api;
    }
  }

  function setupGlobalListeners() {
    if (globalListenersController) return;

    globalListenersController = new AbortController();
    const { signal } = globalListenersController;

    window.addEventListener('resize', updateVisibleTooltip, { passive: true, signal });
    window.addEventListener('scroll', scheduleScrollUpdate, { capture: true, passive: true, signal });
    window.addEventListener('keydown', handleKeydown, { passive: true, signal });
  }

  function handleKeydown(event) {
    if (event.key === 'Escape' && isVisible) {
      hideTooltip();
    }
  }

  function scheduleScrollUpdate() {
    if (!isVisible || !targetElement || scrollFrameId !== null) return;

    scrollFrameId = requestAnimationFrame(() => {
      scrollFrameId = null;
      updateVisibleTooltip();
    });
  }

  function updateVisibleTooltip() {
    if (!isVisible || !targetElement) return;

    if (!targetElement.isConnected) {
      hideTooltip();
      return;
    }

    targetRect = targetElement.getBoundingClientRect();
    updateTooltipPosition();
  }

  function showTooltip(target, content, options = {}) {
    if (!isElement(target)) {
      throw new TypeError('BalaclavaTooltip.show target must be an HTMLElement.');
    }

    ensureHost();
    cleanupTooltip();

    targetElement = target;
    targetRect = target.getBoundingClientRect();
    requestedPosition = normalizePosition(options.position);
    preferredPosition = requestedPosition;
    tooltipThemeOverride = normalizeOptionalTheme(options.theme);
    activeTheme = tooltipThemeOverride || config.theme;
    showArrow = options.showArrow !== false;
    arrowOffset = ARROW_OFFSET_DEFAULT;
    isVisible = true;

    target.setAttribute('aria-describedby', tooltipId);

    renderTooltip(content);
    setupIntersectionObserver();

    requestAnimationFrame(() => {
      updateVisibleTooltip();
      trackTargetPosition();
    });
  }

  function hideTooltip() {
    cleanupTooltip();
  }

  function configure(userConfig = {}) {
    const nextConfig = { ...config };
    let hasCustomThemeOverride = false;

    for (const [key, value] of Object.entries(userConfig)) {
      if (value === undefined || value === null) continue;

      if (key === 'theme') {
        nextConfig.theme = normalizeTheme(value, nextConfig.theme);
        continue;
      }

      if (Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, key)) {
        nextConfig[key] = value;
        hasCustomThemeOverride = hasCustomThemeOverride || CUSTOM_THEME_KEYS.has(key);
      }
    }

    if (hasCustomThemeOverride && userConfig.theme === undefined) {
      nextConfig.theme = 'custom';
    }

    config = nextConfig;

    if (styleEl) {
      styleEl.textContent = buildStylesheet();
    }

    if (host) {
      host.style.zIndex = String(config.zIndex);
    }

    if (isVisible && !tooltipThemeOverride) {
      activeTheme = config.theme;
      refreshTooltipClassName();
    }

    updateVisibleTooltip();
  }

  function attachTooltip(element, content, options = {}) {
    if (!isElement(element)) {
      throw new TypeError('BalaclavaTooltip.attach element must be an HTMLElement.');
    }

    const controller = new AbortController();
    const { signal } = controller;
    let detached = false;

    const onShow = () => showTooltip(element, resolveContent(content, element), options);
    const onHide = () => {
      if (targetElement === element) hideTooltip();
    };

    element.addEventListener('mouseenter', onShow, { signal });
    element.addEventListener('mouseleave', onHide, { signal });
    element.addEventListener('focus', onShow, { signal });
    element.addEventListener('blur', onHide, { signal });

    const detach = function detach() {
      if (detached) return;

      detached = true;
      controller.abort();
      attachmentDetachers.delete(detach);

      if (targetElement === element) {
        hideTooltip();
      }
    };

    attachmentDetachers.add(detach);

    return detach;
  }

  function resolveContent(content, element) {
    return typeof content === 'function' ? content(element) : content;
  }

  function scanAll(root = document) {
    root.querySelectorAll?.('[data-balaclava-tooltip]').forEach(scanElement);
  }

  function scanElement(element) {
    if (!isElement(element) || attachedElements.has(element)) return;

    const text = element.getAttribute('data-balaclava-tooltip');
    if (!text) return;

    const position = normalizePosition(element.getAttribute('data-balaclava-tooltip-position'));
    const arrow = element.getAttribute('data-balaclava-tooltip-arrow') !== 'false';
    const theme = normalizeOptionalTheme(element.getAttribute('data-balaclava-tooltip-theme'));
    const options = { position, showArrow: arrow };

    if (theme) {
      options.theme = theme;
    }

    const detach = attachTooltip(element, text, options);

    attachedElements.set(element, detach);
  }

  function setupMutationObserver() {
    const observerRoot = document.body || document.documentElement;

    if (mutationObserver || !observerRoot) return;

    mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(scanAddedNode);
          mutation.removedNodes.forEach(cleanupRemovedNode);
        }

        if (mutation.type === 'attributes') {
          refreshElement(mutation.target);
        }
      }
    });

    mutationObserver.observe(observerRoot, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        'data-balaclava-tooltip',
        'data-balaclava-tooltip-position',
        'data-balaclava-tooltip-arrow',
        'data-balaclava-tooltip-theme'
      ]
    });
  }

  function scanAddedNode(node) {
    if (!isElement(node)) return;

    if (node.hasAttribute('data-balaclava-tooltip')) {
      scanElement(node);
    }

    scanAll(node);
  }

  function cleanupRemovedNode(node) {
    if (!isElement(node)) return;

    cleanupAttachedElement(node);
    node.querySelectorAll?.('[data-balaclava-tooltip]').forEach(cleanupAttachedElement);

    if (targetElement && (node === targetElement || node.contains(targetElement))) {
      hideTooltip();
    }
  }

  function cleanupAttachedElement(element) {
    const detach = attachedElements.get(element);

    if (detach) {
      detach();
      attachedElements.delete(element);
    }
  }

  function refreshElement(target) {
    if (!isElement(target)) return;

    cleanupAttachedElement(target);

    if (target.hasAttribute('data-balaclava-tooltip')) {
      scanElement(target);
    }
  }

  function renderTooltip(content) {
    if (tooltipEl) {
      tooltipEl.remove();
    }

    tooltipEl = document.createElement('div');
    tooltipEl.id = tooltipId;
    tooltipEl.className = `${getTooltipClassName()} is-entering`;
    tooltipEl.setAttribute('role', 'tooltip');
    tooltipEl.setAttribute('aria-live', 'polite');
    tooltipEl.style.setProperty('--arrow-offset', `${arrowOffset}%`);

    const contentEl = document.createElement('div');
    contentEl.className = 'balaclava-tooltip-content';

    if (isNode(content)) {
      const clone = content.cloneNode(true);
      contentEl.appendChild(clone);
      tooltipEl.setAttribute('aria-label', clone.textContent?.trim() || 'Tooltip');
    } else {
      const text = content == null ? '' : String(content);
      contentEl.textContent = text;
      tooltipEl.setAttribute('aria-label', text);
    }

    tooltipEl.appendChild(contentEl);

    if (showArrow) {
      const arrowEl = document.createElement('span');
      arrowEl.className = 'balaclava-tooltip-arrow';
      arrowEl.setAttribute('aria-hidden', 'true');
      tooltipEl.appendChild(arrowEl);
    }

    shadow.appendChild(tooltipEl);

    requestAnimationFrame(() => {
      if (tooltipEl) {
        tooltipEl.classList.remove('is-entering');
      }
    });
  }

  function setupIntersectionObserver() {
    cleanupIntersectionObserver();

    if (!targetElement || typeof IntersectionObserver === 'undefined') return;

    intersectionObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => !entry.isIntersecting)) {
        hideTooltip();
      }
    });

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

    if (scrollFrameId !== null) {
      cancelAnimationFrame(scrollFrameId);
      scrollFrameId = null;
    }

    if (tooltipEl) {
      tooltipEl.remove();
      tooltipEl = null;
    }

    cleanupIntersectionObserver();
    isVisible = false;
    targetElement = null;
    targetRect = null;
    preferredPosition = requestedPosition;
    tooltipThemeOverride = null;
    activeTheme = config.theme;
    arrowOffset = ARROW_OFFSET_DEFAULT;
  }

  function destroy() {
    if (readyController) {
      readyController.abort();
      readyController = null;
    }

    if (globalListenersController) {
      globalListenersController.abort();
      globalListenersController = null;
    }

    Array.from(attachmentDetachers).forEach((detach) => detach());
    attachmentDetachers.clear();
    attachedElements = new WeakMap();

    cleanupTooltip();

    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }

    if (host) {
      host.remove();
    }

    host = null;
    shadow = null;
    styleEl = null;

    if (rootWindow[API_NAME]?.version === '1.0.1') {
      try {
        delete rootWindow[API_NAME];
      } catch {
        rootWindow[API_NAME] = undefined;
      }
    }

    if (window !== rootWindow && window[API_NAME]?.version === '1.0.1') {
      try {
        delete window[API_NAME];
      } catch {
        window[API_NAME] = undefined;
      }
    }
  }

  function trackTargetPosition() {
    if (!isVisible || !targetElement) return;

    if (!targetElement.isConnected) {
      hideTooltip();
      return;
    }

    const newRect = targetElement.getBoundingClientRect();

    if (!sameRect(targetRect, newRect)) {
      targetRect = newRect;
      updateTooltipPosition();
    }

    positionTrackingId = requestAnimationFrame(trackTargetPosition);
  }

  function updateTooltipPosition() {
    if (!targetRect || !tooltipEl) return;

    preferredPosition = requestedPosition;
    arrowOffset = ARROW_OFFSET_DEFAULT;

    const rect = tooltipEl.getBoundingClientRect();
    const tooltipWidth = rect.width;
    const tooltipHeight = rect.height;
    const position = getInitialPosition(tooltipWidth, tooltipHeight);

    applyFallback(position, tooltipWidth, tooltipHeight);
    clampToViewport(position, tooltipWidth, tooltipHeight);

    tooltipEl.style.top = `${Math.round(position.top)}px`;
    tooltipEl.style.left = `${Math.round(position.left)}px`;
    tooltipEl.style.setProperty('--arrow-offset', `${arrowOffset}%`);
    refreshTooltipClassName();
  }

  function getInitialPosition(tooltipWidth, tooltipHeight) {
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    switch (preferredPosition) {
      case 'top':
        return {
          top: targetRect.top - tooltipHeight - config.offset,
          left: targetCenterX - tooltipWidth / 2
        };
      case 'left':
        return {
          top: targetCenterY - tooltipHeight / 2,
          left: targetRect.left - tooltipWidth - config.offset
        };
      case 'right':
        return {
          top: targetCenterY - tooltipHeight / 2,
          left: targetRect.right + config.offset
        };
      case 'bottom':
      default:
        return {
          top: targetRect.bottom + config.offset,
          left: targetCenterX - tooltipWidth / 2
        };
    }
  }

  function applyFallback(position, tooltipWidth, tooltipHeight) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    switch (preferredPosition) {
      case 'bottom': {
        const alternateTop = targetRect.top - tooltipHeight - config.offset;
        if (position.top + tooltipHeight > viewportHeight - SAFEZONE && alternateTop >= SAFEZONE) {
          position.top = alternateTop;
          preferredPosition = 'top';
        }
        break;
      }
      case 'top': {
        const alternateTop = targetRect.bottom + config.offset;
        if (position.top < SAFEZONE && alternateTop + tooltipHeight <= viewportHeight - SAFEZONE) {
          position.top = alternateTop;
          preferredPosition = 'bottom';
        }
        break;
      }
      case 'left': {
        const alternateLeft = targetRect.right + config.offset;
        if (position.left < SAFEZONE && alternateLeft + tooltipWidth <= viewportWidth - SAFEZONE) {
          position.left = alternateLeft;
          preferredPosition = 'right';
        }
        break;
      }
      case 'right': {
        const alternateLeft = targetRect.left - tooltipWidth - config.offset;
        if (position.left + tooltipWidth > viewportWidth - SAFEZONE && alternateLeft >= SAFEZONE) {
          position.left = alternateLeft;
          preferredPosition = 'left';
        }
        break;
      }
    }
  }

  function clampToViewport(position, tooltipWidth, tooltipHeight) {
    const original = { top: position.top, left: position.left };
    const maxTop = Math.max(SAFEZONE, window.innerHeight - tooltipHeight - SAFEZONE);
    const maxLeft = Math.max(SAFEZONE, window.innerWidth - tooltipWidth - SAFEZONE);

    position.top = Math.max(SAFEZONE, Math.min(position.top, maxTop));
    position.left = Math.max(SAFEZONE, Math.min(position.left, maxLeft));

    if (showArrow) {
      updateArrowOffset(original, position, tooltipWidth, tooltipHeight);
    }
  }

  function updateArrowOffset(original, clamped, tooltipWidth, tooltipHeight) {
    arrowOffset = ARROW_OFFSET_DEFAULT;

    if (preferredPosition === 'top' || preferredPosition === 'bottom') {
      if (original.left !== clamped.left) {
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const offset = targetCenterX - clamped.left;
        arrowOffset = calculatePercentageOffset(offset, tooltipWidth);
      }
      return;
    }

    if (original.top !== clamped.top) {
      const targetCenterY = targetRect.top + targetRect.height / 2;
      const offset = targetCenterY - clamped.top;
      arrowOffset = calculatePercentageOffset(offset, tooltipHeight);
    }
  }

  function calculatePercentageOffset(offset, dimension) {
    if (!dimension) return ARROW_OFFSET_DEFAULT;

    const percentage = (offset / dimension) * 100;
    return Math.max(ARROW_OFFSET_MIN, Math.min(ARROW_OFFSET_MAX, percentage));
  }

  function sameRect(left, right) {
    if (!left || !right) return false;

    return (
      left.top === right.top &&
      left.right === right.right &&
      left.bottom === right.bottom &&
      left.left === right.left &&
      left.width === right.width &&
      left.height === right.height
    );
  }

  function normalizePosition(value) {
    return VALID_POSITIONS.has(value) ? value : 'bottom';
  }

  function normalizeTheme(value, fallback = 'system') {
    return normalizeOptionalTheme(value) || fallback;
  }

  function normalizeOptionalTheme(value) {
    const theme = typeof value === 'string' ? value.toLowerCase() : value;
    return VALID_THEMES.has(theme) ? theme : null;
  }

  function getTooltipClassName() {
    return `balaclava-tooltip is-${preferredPosition} is-theme-${activeTheme}`;
  }

  function refreshTooltipClassName() {
    if (!tooltipEl) return;

    const isEntering = tooltipEl.classList.contains('is-entering');
    tooltipEl.className = `${getTooltipClassName()}${isEntering ? ' is-entering' : ''}`;
  }

  function isElement(value) {
    return value && value.nodeType === Node.ELEMENT_NODE && typeof value.getBoundingClientRect === 'function';
  }

  function isNode(value) {
    return value && typeof value === 'object' && typeof value.nodeType === 'number' && typeof value.cloneNode === 'function';
  }

  exposeApi();

  if (document.readyState === 'loading') {
    readyController = new AbortController();
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        readyController = null;
        init();
      },
      { once: true, signal: readyController.signal }
    );
  } else {
    init();
  }
})();
