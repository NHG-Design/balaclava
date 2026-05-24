// ==UserScript==
// @name        Balaclava Tooltip
// @namespace   https://github.com/balaclava
// @version     1.0.0
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

  const rootWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  if (rootWindow[API_NAME]?.version) {
    return;
  }

  const DEFAULT_CONFIG = Object.freeze({
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

  let config = { ...DEFAULT_CONFIG };
  let host = null;
  let shadow = null;
  let styleEl = null;
  let tooltipEl = null;
  let targetElement = null;
  let targetRect = null;
  let preferredPosition = 'bottom';
  let requestedPosition = 'bottom';
  let showArrow = true;
  let arrowOffset = ARROW_OFFSET_DEFAULT;
  let positionTrackingId = null;
  let intersectionObserver = null;
  let mutationObserver = null;
  let scrollFrameId = null;
  let isVisible = false;

  const tooltipId = `balaclava-tt-${Math.random().toString(36).slice(2, 11)}`;
  const attachedElements = new WeakMap();

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
    return `
      .balaclava-tooltip {
        position: fixed;
        top: 0;
        left: 0;
        z-index: ${config.zIndex};
        box-sizing: border-box;
        max-width: ${config.maxWidth};
        color: ${config.textColor};
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: ${config.fontSize};
        line-height: 1.4;
        letter-spacing: 0;
        overflow-wrap: anywhere;
        pointer-events: none;
        opacity: 0;
        border: 1px solid ${config.borderColor};
        border-radius: ${config.borderRadius};
        filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.28));
        animation: balaclava-fade-in ${config.animationDuration} ease-out forwards;
      }

      .balaclava-tooltip-content {
        position: relative;
        z-index: 1;
        box-sizing: border-box;
        padding: ${config.padding};
        color: ${config.textColor};
        background: ${config.bgColor};
        border-radius: ${config.borderRadius};
      }

      .balaclava-tooltip-arrow {
        position: absolute;
        z-index: 0;
        box-sizing: border-box;
        width: ${config.arrowSize};
        height: ${config.arrowSize};
        background: ${config.bgColor};
        border-color: ${config.borderColor};
        border-style: solid;
        border-width: 1px;
      }

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
        from {
          opacity: 0;
          transform: translateY(4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .balaclava-tooltip {
          animation-duration: 1ms;
        }
      }
    `;
  }

  function exposeApi() {
    const api = {
      version: '1.0.0',
      show: showTooltip,
      hide: hideTooltip,
      configure: configure,
      attach: attachTooltip,
      rescan: scanAll
    };

    rootWindow[API_NAME] = api;

    if (window !== rootWindow) {
      window[API_NAME] = api;
    }
  }

  function setupGlobalListeners() {
    window.addEventListener('resize', updateVisibleTooltip, { passive: true });
    window.addEventListener('scroll', scheduleScrollUpdate, { capture: true, passive: true });
    window.addEventListener('keydown', handleKeydown, { passive: true });
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

    for (const [key, value] of Object.entries(userConfig)) {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, key) && value !== undefined && value !== null) {
        nextConfig[key] = value;
      }
    }

    config = nextConfig;

    if (styleEl) {
      styleEl.textContent = buildStylesheet();
    }

    if (host) {
      host.style.zIndex = String(config.zIndex);
    }

    updateVisibleTooltip();
  }

  function attachTooltip(element, content, options = {}) {
    if (!isElement(element)) {
      throw new TypeError('BalaclavaTooltip.attach element must be an HTMLElement.');
    }

    const onShow = () => showTooltip(element, resolveContent(content, element), options);
    const onHide = () => {
      if (targetElement === element) hideTooltip();
    };

    element.addEventListener('mouseenter', onShow);
    element.addEventListener('mouseleave', onHide);
    element.addEventListener('focus', onShow);
    element.addEventListener('blur', onHide);

    return function detach() {
      element.removeEventListener('mouseenter', onShow);
      element.removeEventListener('mouseleave', onHide);
      element.removeEventListener('focus', onShow);
      element.removeEventListener('blur', onHide);

      if (targetElement === element) {
        hideTooltip();
      }
    };
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
    const detach = attachTooltip(element, text, { position, showArrow: arrow });

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
        'data-balaclava-tooltip-arrow'
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
    tooltipEl.className = `balaclava-tooltip is-${preferredPosition}`;
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
    arrowOffset = ARROW_OFFSET_DEFAULT;
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
    tooltipEl.className = `balaclava-tooltip is-${preferredPosition}`;
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

  function isElement(value) {
    return value && value.nodeType === Node.ELEMENT_NODE && typeof value.getBoundingClientRect === 'function';
  }

  function isNode(value) {
    return value && typeof value === 'object' && typeof value.nodeType === 'number' && typeof value.cloneNode === 'function';
  }

  exposeApi();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
