"use strict";
(() => {
  // src/lib/shared-ui/theme-bridge.ts
  var TORN_THEME_VAR_NAMES = [
    "--crimes-crimeOption-bgColor",
    "--crimes-outcomeDivider-color",
    "--crimes-baseText-color",
    "--crimes-subtleSubText-color",
    "--crimes-stats-successes-color",
    "--crimes-stats-criticalFails-color",
    "--tooltip-bg-color",
    "--mini-profile-border",
    "--mini-profile-box-shadow"
  ];
  function syncTornThemeVars(target, sourceSelector = ".crimes-app") {
    const source = document.querySelector(sourceSelector);
    if (!source) return;
    const computed = getComputedStyle(source);
    for (const name of TORN_THEME_VAR_NAMES) {
      const value = computed.getPropertyValue(name).trim();
      if (value) target.style.setProperty(name, value);
    }
  }

  // src/lib/shared-ui/anchor-position.ts
  var DEFAULTS = {
    offset: 8,
    safezone: 8,
    arrowOffsetMin: 10,
    arrowOffsetMax: 90,
    arrowOffsetDefault: 50,
    viewportWidth: 0,
    viewportHeight: 0
  };
  function initialPosition(targetRect, side, panelWidth, panelHeight, offset) {
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    switch (side) {
      case "top":
        return { top: targetRect.top - panelHeight - offset, left: targetCenterX - panelWidth / 2 };
      case "left":
        return { top: targetCenterY - panelHeight / 2, left: targetRect.left - panelWidth - offset };
      case "right":
        return { top: targetCenterY - panelHeight / 2, left: targetRect.right + offset };
      case "bottom":
      default:
        return { top: targetRect.bottom + offset, left: targetCenterX - panelWidth / 2 };
    }
  }
  function applyFallback(position, side, targetRect, panelWidth, panelHeight, offset, safezone, viewportWidth, viewportHeight) {
    switch (side) {
      case "bottom": {
        const alternateTop = targetRect.top - panelHeight - offset;
        if (position.top + panelHeight > viewportHeight - safezone && alternateTop >= safezone) {
          position.top = alternateTop;
          return "top";
        }
        break;
      }
      case "top": {
        const alternateTop = targetRect.bottom + offset;
        if (position.top < safezone && alternateTop + panelHeight <= viewportHeight - safezone) {
          position.top = alternateTop;
          return "bottom";
        }
        break;
      }
      case "left": {
        const alternateLeft = targetRect.right + offset;
        if (position.left < safezone && alternateLeft + panelWidth <= viewportWidth - safezone) {
          position.left = alternateLeft;
          return "right";
        }
        break;
      }
      case "right": {
        const alternateLeft = targetRect.left - panelWidth - offset;
        if (position.left + panelWidth > viewportWidth - safezone && alternateLeft >= safezone) {
          position.left = alternateLeft;
          return "left";
        }
        break;
      }
    }
    return side;
  }
  function clampToViewport(position, panelWidth, panelHeight, safezone, viewportWidth, viewportHeight) {
    const maxTop = Math.max(safezone, viewportHeight - panelHeight - safezone);
    const maxLeft = Math.max(safezone, viewportWidth - panelWidth - safezone);
    return {
      top: Math.max(safezone, Math.min(position.top, maxTop)),
      left: Math.max(safezone, Math.min(position.left, maxLeft))
    };
  }
  function percentageOffset(offset, dimension, min, max, fallback) {
    if (!dimension) return fallback;
    const percentage = offset / dimension * 100;
    return Math.max(min, Math.min(max, percentage));
  }
  function computeAnchorPosition(targetRect, panelWidth, panelHeight, requestedSide, options = {}) {
    const opts = { ...DEFAULTS, ...options };
    const viewportWidth = opts.viewportWidth || window.innerWidth;
    const viewportHeight = opts.viewportHeight || window.innerHeight;
    const position = initialPosition(targetRect, requestedSide, panelWidth, panelHeight, opts.offset);
    const side = applyFallback(
      position,
      requestedSide,
      targetRect,
      panelWidth,
      panelHeight,
      opts.offset,
      opts.safezone,
      viewportWidth,
      viewportHeight
    );
    const original = { ...position };
    const clamped = clampToViewport(position, panelWidth, panelHeight, opts.safezone, viewportWidth, viewportHeight);
    let arrowOffsetPercent = opts.arrowOffsetDefault;
    if (side === "top" || side === "bottom") {
      if (original.left !== clamped.left) {
        const targetCenterX = targetRect.left + targetRect.width / 2;
        arrowOffsetPercent = percentageOffset(
          targetCenterX - clamped.left,
          panelWidth,
          opts.arrowOffsetMin,
          opts.arrowOffsetMax,
          opts.arrowOffsetDefault
        );
      }
    } else if (original.top !== clamped.top) {
      const targetCenterY = targetRect.top + targetRect.height / 2;
      arrowOffsetPercent = percentageOffset(
        targetCenterY - clamped.top,
        panelHeight,
        opts.arrowOffsetMin,
        opts.arrowOffsetMax,
        opts.arrowOffsetDefault
      );
    }
    return { top: clamped.top, left: clamped.left, side, arrowOffsetPercent };
  }

  // src/userscripts/balaclava-tooltip/index.ts
  var API_NAME = "BalaclavaTooltip";
  var HOST_ID = "balaclava-tooltip-host";
  var SAFEZONE = 8;
  var ARROW_OFFSET_MIN = 10;
  var ARROW_OFFSET_MAX = 90;
  var ARROW_OFFSET_DEFAULT = 50;
  var VERSION = "1.0.2";
  var VALID_POSITIONS = /* @__PURE__ */ new Set([
    "top",
    "bottom",
    "left",
    "right"
  ]);
  var VALID_THEMES = /* @__PURE__ */ new Set([
    "system",
    "dark",
    "light",
    "custom"
  ]);
  var CUSTOM_THEME_KEYS = /* @__PURE__ */ new Set([
    "bgColor",
    "textColor",
    "borderColor",
    "shadowColor"
  ]);
  var THEME_TOKENS = Object.freeze({
    dark: Object.freeze({
      bgColor: "oklch(24% 0 0)",
      textColor: "oklch(96% 0.012 95)",
      borderColor: "oklch(30% 0 0)",
      shadowColor: "oklch(12% 0.01 260 / 0.55)"
    }),
    light: Object.freeze({
      bgColor: "oklch(98% 0.008 95)",
      textColor: "oklch(24% 0.014 260)",
      borderColor: "oklch(24% 0.014 260 / 0.14)",
      shadowColor: "oklch(24% 0.014 260 / 0.3)"
    })
  });
  var rootWindow = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  if (!rootWindow[API_NAME]?.version) {
    let init2 = function() {
      ensureHost2();
      setupGlobalListeners2();
      scanAll2();
      setupMutationObserver2();
    }, syncTornThemeVars3 = function() {
      if (!host) return;
      syncTornThemeVars(host);
    }, ensureHost2 = function() {
      if (host) {
        syncTornThemeVars3();
        return;
      }
      host = document.createElement("div");
      host.id = HOST_ID;
      host.style.position = "fixed";
      host.style.top = "0";
      host.style.left = "0";
      host.style.width = "0";
      host.style.height = "0";
      host.style.overflow = "visible";
      host.style.pointerEvents = "none";
      host.style.zIndex = String(config.zIndex);
      if (!host.isConnected) {
        (document.body || document.documentElement).appendChild(host);
      }
      shadow = host.attachShadow({ mode: "closed" });
      styleEl = document.createElement("style");
      styleEl.textContent = buildStylesheet2();
      shadow.appendChild(styleEl);
      syncTornThemeVars3();
    }, buildStylesheet2 = function() {
      const visualConfig = getVisualConfig2();
      return `
      .balaclava-tooltip {
        --balaclava-tooltip-bg: var(--tooltip-bg-color, ${THEME_TOKENS.dark.bgColor});
        --balaclava-tooltip-text: var(--crimes-baseText-color, ${THEME_TOKENS.dark.textColor});
        --balaclava-tooltip-border: color-mix(in oklch, var(--crimes-outcomeDivider-color, ${THEME_TOKENS.dark.borderColor}) 75%, black 25%);
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
        font-family: "Fjalla One", sans-serif;
        font-size: ${visualConfig.fontSize};
        line-height: 1.5;
        letter-spacing: 0;
        overflow-wrap: anywhere;
        pointer-events: none;
        opacity: 1;
        border: var(--balaclava-tooltip-border-size) solid var(--balaclava-tooltip-border);
        border-radius: var(--balaclava-tooltip-border-radius);
        box-shadow: 0 2px 8px var(--balaclava-tooltip-shadow);
        box-shadow: var(--mini-profile-box-shadow);
        transition:
          opacity ${visualConfig.animationDuration} ease-out;
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
      }

      .balaclava-tooltip.is-bottom {
      }

      .balaclava-tooltip.is-left {
      }

      .balaclava-tooltip.is-right {
      }

      .balaclava-tooltip.is-entering {
        opacity: 0;
      }

      .balaclava-tooltip.is-exiting {
        opacity: 0;
      }

      @media (prefers-reduced-motion: reduce) {
        .balaclava-tooltip {
          transition-duration: 1ms;
        }
      }
    `;
    }, getVisualConfig2 = function() {
      return {
        ...config,
        arrowBorderSize: config.arrowBorderSize ?? config.borderSize,
        arrowBorderColor: config.arrowBorderColor ?? "var(--balaclava-tooltip-border)",
        arrowBorderRadius: config.arrowBorderRadius ?? "3px"
      };
    }, exposeApi2 = function() {
      const api = {
        version: VERSION,
        show: showTooltip2,
        hide: hideTooltip2,
        configure: configure2,
        attach: attachTooltip2,
        rescan: scanAll2,
        destroy: destroy2
      };
      rootWindow[API_NAME] = api;
      if (window !== rootWindow) {
        window[API_NAME] = api;
      }
    }, setupGlobalListeners2 = function() {
      if (globalListenersController) return;
      globalListenersController = new AbortController();
      const { signal } = globalListenersController;
      window.addEventListener("resize", updateVisibleTooltip2, {
        passive: true,
        signal
      });
      window.addEventListener("scroll", scheduleScrollUpdate2, {
        capture: true,
        passive: true,
        signal
      });
      window.addEventListener("keydown", handleKeydown2, {
        passive: true,
        signal
      });
    }, handleKeydown2 = function(event) {
      if (event.key === "Escape" && isVisible) {
        hideTooltip2();
      }
    }, scheduleScrollUpdate2 = function() {
      if (!isVisible) return;
      updateVisibleTooltip2();
    }, updateVisibleTooltip2 = function() {
      if (!isVisible || !targetElement) return;
      if (!targetElement.isConnected) {
        hideTooltip2();
        return;
      }
      targetRect = targetElement.getBoundingClientRect();
      updateTooltipPosition2();
    }, showTooltip2 = function(target, content, options = {}) {
      if (!isElement2(target)) {
        throw new TypeError(
          "BalaclavaTooltip.show target must be an HTMLElement."
        );
      }
      ensureHost2();
      cleanupTooltip2();
      targetElement = target;
      targetRect = target.getBoundingClientRect();
      requestedPosition = normalizePosition2(options.position);
      preferredPosition = requestedPosition;
      tooltipThemeOverride = normalizeOptionalTheme2(options.theme);
      activeTheme = tooltipThemeOverride || config.theme;
      showArrow = options.showArrow !== false;
      arrowOffset = ARROW_OFFSET_DEFAULT;
      isVisible = true;
      target.setAttribute("aria-describedby", tooltipId);
      renderTooltip2(content);
      setupIntersectionObserver2();
      requestAnimationFrame(() => {
        updateVisibleTooltip2();
        trackTargetPosition2();
      });
    }, hideTooltip2 = function() {
      tooltipCooldownEnd = Date.now() + 600;
      cleanupTooltip2();
    }, configure2 = function(userConfig = {}) {
      const nextConfig = { ...config };
      let hasCustomThemeOverride = false;
      for (const [key, value] of Object.entries(userConfig)) {
        if (value === void 0 || value === null) continue;
        if (key === "theme") {
          nextConfig.theme = normalizeTheme2(value, nextConfig.theme);
          continue;
        }
        if (isConfigKey2(key)) {
          nextConfig[key] = value;
          hasCustomThemeOverride = hasCustomThemeOverride || CUSTOM_THEME_KEYS.has(key);
        }
      }
      if (hasCustomThemeOverride && userConfig.theme === void 0) {
        nextConfig.theme = "custom";
      }
      config = nextConfig;
      if (styleEl) {
        styleEl.textContent = buildStylesheet2();
      }
      if (host) {
        host.style.zIndex = String(config.zIndex);
      }
      if (isVisible && !tooltipThemeOverride) {
        activeTheme = config.theme;
        refreshTooltipClassName2();
      }
      updateVisibleTooltip2();
    }, attachTooltip2 = function(element, content, options = {}) {
      if (!isElement2(element)) {
        throw new TypeError(
          "BalaclavaTooltip.attach element must be an HTMLElement."
        );
      }
      const controller = new AbortController();
      const { signal } = controller;
      let detached = false;
      let hoverTimer = null;
      const doShow = () => showTooltip2(element, resolveContent2(content, element), options);
      const onMouseEnter = () => {
        if (Date.now() < tooltipCooldownEnd) {
          nextShowInstant = true;
          doShow();
          nextShowInstant = false;
        } else {
          hoverTimer = setTimeout(() => {
            hoverTimer = null;
            doShow();
          }, 200);
        }
      };
      const onMouseLeave = () => {
        if (hoverTimer !== null) {
          clearTimeout(hoverTimer);
          hoverTimer = null;
        }
        if (targetElement === element) hideTooltip2();
      };
      element.addEventListener("mouseenter", onMouseEnter, { signal });
      element.addEventListener("mouseleave", onMouseLeave, { signal });
      element.addEventListener("focus", doShow, { signal });
      element.addEventListener(
        "blur",
        () => {
          if (targetElement === element) hideTooltip2();
        },
        { signal }
      );
      const detach = function detach2() {
        if (detached) return;
        detached = true;
        if (hoverTimer !== null) {
          clearTimeout(hoverTimer);
          hoverTimer = null;
        }
        controller.abort();
        attachmentDetachers.delete(detach2);
        if (targetElement === element) {
          hideTooltip2();
        }
      };
      attachmentDetachers.add(detach);
      return detach;
    }, resolveContent2 = function(content, element) {
      return typeof content === "function" ? content(element) : content;
    }, scanAll2 = function(root = document) {
      root.querySelectorAll?.("[data-balaclava-tooltip]").forEach(scanElement2);
    }, scanElement2 = function(element) {
      if (!isElement2(element) || attachedElements.has(element)) return;
      const text = element.getAttribute("data-balaclava-tooltip");
      if (!text) return;
      const position = normalizePosition2(
        element.getAttribute("data-balaclava-tooltip-position")
      );
      const arrow = element.getAttribute("data-balaclava-tooltip-arrow") !== "false";
      const theme = normalizeOptionalTheme2(
        element.getAttribute("data-balaclava-tooltip-theme")
      );
      const options = { position, showArrow: arrow };
      if (theme) {
        options.theme = theme;
      }
      const detach = attachTooltip2(element, text, options);
      attachedElements.set(element, detach);
    }, setupMutationObserver2 = function() {
      const observerRoot = document.body || document.documentElement;
      if (mutationObserver || !observerRoot) return;
      mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach(scanAddedNode2);
            mutation.removedNodes.forEach(cleanupRemovedNode2);
          }
          if (mutation.type === "attributes") {
            refreshElement2(mutation.target);
          }
        }
      });
      mutationObserver.observe(observerRoot, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [
          "data-balaclava-tooltip",
          "data-balaclava-tooltip-position",
          "data-balaclava-tooltip-arrow",
          "data-balaclava-tooltip-theme"
        ]
      });
    }, scanAddedNode2 = function(node) {
      if (!isElement2(node)) return;
      if (node.hasAttribute("data-balaclava-tooltip")) {
        scanElement2(node);
      }
      scanAll2(node);
    }, cleanupRemovedNode2 = function(node) {
      if (!isElement2(node)) return;
      cleanupAttachedElement2(node);
      node.querySelectorAll?.("[data-balaclava-tooltip]").forEach(cleanupAttachedElement2);
      if (targetElement && (node === targetElement || node.contains(targetElement))) {
        hideTooltip2();
      }
    }, cleanupAttachedElement2 = function(element) {
      if (!isElement2(element)) return;
      const detach = attachedElements.get(element);
      if (detach) {
        detach();
        attachedElements.delete(element);
      }
    }, refreshElement2 = function(target) {
      if (!isElement2(target)) return;
      cleanupAttachedElement2(target);
      if (target.hasAttribute("data-balaclava-tooltip")) {
        scanElement2(target);
      }
    }, renderTooltip2 = function(content) {
      if (!shadow) return;
      if (tooltipEl) {
        tooltipEl.remove();
      }
      tooltipEl = document.createElement("div");
      tooltipEl.id = tooltipId;
      tooltipEl.className = nextShowInstant ? getTooltipClassName2() : `${getTooltipClassName2()} is-entering`;
      if (nextShowInstant) tooltipEl.setAttribute("data-instant", "");
      tooltipEl.setAttribute("role", "tooltip");
      tooltipEl.setAttribute("aria-live", "polite");
      tooltipEl.style.setProperty("--arrow-offset", `${arrowOffset}%`);
      const contentEl = document.createElement("div");
      contentEl.className = "balaclava-tooltip-content";
      if (isNode2(content)) {
        const clone = content.cloneNode(true);
        contentEl.appendChild(clone);
        tooltipEl.setAttribute(
          "aria-label",
          clone.textContent?.trim() || "Tooltip"
        );
      } else {
        const text = content == null ? "" : String(content);
        contentEl.textContent = text;
        tooltipEl.setAttribute("aria-label", text);
      }
      tooltipEl.appendChild(contentEl);
      if (showArrow) {
        const arrowEl = document.createElement("span");
        arrowEl.className = "balaclava-tooltip-arrow";
        arrowEl.setAttribute("aria-hidden", "true");
        tooltipEl.appendChild(arrowEl);
      }
      shadow.appendChild(tooltipEl);
      if (!nextShowInstant) {
        requestAnimationFrame(() => {
          if (tooltipEl) {
            tooltipEl.classList.remove("is-entering");
          }
        });
      }
    }, setupIntersectionObserver2 = function() {
      cleanupIntersectionObserver2();
      if (!targetElement || typeof IntersectionObserver === "undefined") return;
      intersectionObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => !entry.isIntersecting)) {
          hideTooltip2();
        }
      });
      intersectionObserver.observe(targetElement);
    }, cleanupIntersectionObserver2 = function() {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
        intersectionObserver = null;
      }
    }, cleanupTooltip2 = function() {
      if (targetElement) {
        targetElement.removeAttribute("aria-describedby");
      }
      if (positionTrackingId !== null) {
        cancelAnimationFrame(positionTrackingId);
        positionTrackingId = null;
      }
      if (tooltipEl) {
        const exiting = tooltipEl;
        tooltipEl = null;
        exiting.removeAttribute("id");
        exiting.classList.add("is-exiting");
        const remove = () => {
          if (exiting.isConnected) exiting.remove();
        };
        exiting.addEventListener("transitionend", remove, { once: true });
        setTimeout(remove, 200);
      }
      cleanupIntersectionObserver2();
      isVisible = false;
      targetElement = null;
      targetRect = null;
      preferredPosition = requestedPosition;
      tooltipThemeOverride = null;
      activeTheme = config.theme;
      arrowOffset = ARROW_OFFSET_DEFAULT;
    }, destroy2 = function() {
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
      attachedElements = /* @__PURE__ */ new WeakMap();
      cleanupTooltip2();
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
      if (rootWindow[API_NAME]?.version === VERSION) {
        try {
          delete rootWindow[API_NAME];
        } catch {
          rootWindow[API_NAME] = void 0;
        }
      }
      const pageWindow = window;
      if (window !== rootWindow && pageWindow[API_NAME]?.version === VERSION) {
        try {
          delete pageWindow[API_NAME];
        } catch {
          pageWindow[API_NAME] = void 0;
        }
      }
    }, trackTargetPosition2 = function() {
      if (!isVisible || !targetElement) return;
      if (!targetElement.isConnected) {
        hideTooltip2();
        return;
      }
      const newRect = targetElement.getBoundingClientRect();
      if (!sameRect2(targetRect, newRect)) {
        targetRect = newRect;
        updateTooltipPosition2();
      }
      positionTrackingId = requestAnimationFrame(trackTargetPosition2);
    }, updateTooltipPosition2 = function() {
      if (!targetRect || !tooltipEl) return;
      const rect = tooltipEl.getBoundingClientRect();
      const result = computeAnchorPosition(
        targetRect,
        rect.width,
        rect.height,
        requestedPosition,
        {
          offset: config.offset,
          safezone: SAFEZONE,
          arrowOffsetMin: ARROW_OFFSET_MIN,
          arrowOffsetMax: ARROW_OFFSET_MAX,
          arrowOffsetDefault: ARROW_OFFSET_DEFAULT
        }
      );
      preferredPosition = result.side;
      arrowOffset = showArrow ? result.arrowOffsetPercent : ARROW_OFFSET_DEFAULT;
      tooltipEl.style.top = `${Math.round(result.top)}px`;
      tooltipEl.style.left = `${Math.round(result.left)}px`;
      tooltipEl.style.setProperty("--arrow-offset", `${arrowOffset}%`);
      refreshTooltipClassName2();
    }, sameRect2 = function(left, right) {
      if (!left || !right) return false;
      return left.top === right.top && left.right === right.right && left.bottom === right.bottom && left.left === right.left && left.width === right.width && left.height === right.height;
    }, normalizePosition2 = function(value) {
      return typeof value === "string" && VALID_POSITIONS.has(value) ? value : "bottom";
    }, normalizeTheme2 = function(value, fallback = "system") {
      return normalizeOptionalTheme2(value) || fallback;
    }, normalizeOptionalTheme2 = function(value) {
      const theme = typeof value === "string" ? value.toLowerCase() : value;
      return VALID_THEMES.has(theme) ? theme : null;
    }, getTooltipClassName2 = function() {
      return `balaclava-tooltip is-${preferredPosition} is-theme-${activeTheme}`;
    }, refreshTooltipClassName2 = function() {
      if (!tooltipEl) return;
      const isEntering = tooltipEl.classList.contains("is-entering");
      tooltipEl.className = `${getTooltipClassName2()}${isEntering ? " is-entering" : ""}`;
    }, isConfigKey2 = function(value) {
      return Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, value);
    }, isElement2 = function(value) {
      return Boolean(
        value && typeof value === "object" && value.nodeType === Node.ELEMENT_NODE && typeof value.getBoundingClientRect === "function"
      );
    }, isNode2 = function(value) {
      return Boolean(
        value && typeof value === "object" && typeof value.nodeType === "number" && typeof value.cloneNode === "function"
      );
    };
    init = init2, syncTornThemeVars2 = syncTornThemeVars3, ensureHost = ensureHost2, buildStylesheet = buildStylesheet2, getVisualConfig = getVisualConfig2, exposeApi = exposeApi2, setupGlobalListeners = setupGlobalListeners2, handleKeydown = handleKeydown2, scheduleScrollUpdate = scheduleScrollUpdate2, updateVisibleTooltip = updateVisibleTooltip2, showTooltip = showTooltip2, hideTooltip = hideTooltip2, configure = configure2, attachTooltip = attachTooltip2, resolveContent = resolveContent2, scanAll = scanAll2, scanElement = scanElement2, setupMutationObserver = setupMutationObserver2, scanAddedNode = scanAddedNode2, cleanupRemovedNode = cleanupRemovedNode2, cleanupAttachedElement = cleanupAttachedElement2, refreshElement = refreshElement2, renderTooltip = renderTooltip2, setupIntersectionObserver = setupIntersectionObserver2, cleanupIntersectionObserver = cleanupIntersectionObserver2, cleanupTooltip = cleanupTooltip2, destroy = destroy2, trackTargetPosition = trackTargetPosition2, updateTooltipPosition = updateTooltipPosition2, sameRect = sameRect2, normalizePosition = normalizePosition2, normalizeTheme = normalizeTheme2, normalizeOptionalTheme = normalizeOptionalTheme2, getTooltipClassName = getTooltipClassName2, refreshTooltipClassName = refreshTooltipClassName2, isConfigKey = isConfigKey2, isElement = isElement2, isNode = isNode2;
    const DEFAULT_CONFIG = Object.freeze({
      theme: "dark",
      bgColor: THEME_TOKENS.dark.bgColor,
      textColor: THEME_TOKENS.dark.textColor,
      borderColor: THEME_TOKENS.dark.borderColor,
      shadowColor: THEME_TOKENS.dark.shadowColor,
      borderSize: "1px",
      borderRadius: "8px",
      padding: "8px 12px",
      maxWidth: "335px",
      arrowSize: "12px",
      arrowBorderSize: null,
      arrowBorderColor: null,
      arrowBorderRadius: null,
      zIndex: 2147483647,
      animationDuration: "150ms",
      fontSize: "12px",
      offset: 8
    });
    let config = { ...DEFAULT_CONFIG };
    let host = null;
    let shadow = null;
    let styleEl = null;
    let tooltipEl = null;
    let targetElement = null;
    let targetRect = null;
    let preferredPosition = "bottom";
    let requestedPosition = "bottom";
    let activeTheme = DEFAULT_CONFIG.theme;
    let tooltipThemeOverride = null;
    let showArrow = true;
    let arrowOffset = ARROW_OFFSET_DEFAULT;
    let positionTrackingId = null;
    let intersectionObserver = null;
    let mutationObserver = null;
    let isVisible = false;
    let globalListenersController = null;
    let readyController = null;
    let tooltipCooldownEnd = 0;
    let nextShowInstant = false;
    const tooltipId = `balaclava-tt-${Math.random().toString(36).slice(2, 11)}`;
    let attachedElements = /* @__PURE__ */ new WeakMap();
    const attachmentDetachers = /* @__PURE__ */ new Set();
    exposeApi2();
    if (document.readyState === "loading") {
      readyController = new AbortController();
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          readyController = null;
          init2();
        },
        { once: true, signal: readyController.signal }
      );
    } else {
      init2();
    }
  }
  var init;
  var syncTornThemeVars2;
  var ensureHost;
  var buildStylesheet;
  var getVisualConfig;
  var exposeApi;
  var setupGlobalListeners;
  var handleKeydown;
  var scheduleScrollUpdate;
  var updateVisibleTooltip;
  var showTooltip;
  var hideTooltip;
  var configure;
  var attachTooltip;
  var resolveContent;
  var scanAll;
  var scanElement;
  var setupMutationObserver;
  var scanAddedNode;
  var cleanupRemovedNode;
  var cleanupAttachedElement;
  var refreshElement;
  var renderTooltip;
  var setupIntersectionObserver;
  var cleanupIntersectionObserver;
  var cleanupTooltip;
  var destroy;
  var trackTargetPosition;
  var updateTooltipPosition;
  var sameRect;
  var normalizePosition;
  var normalizeTheme;
  var normalizeOptionalTheme;
  var getTooltipClassName;
  var refreshTooltipClassName;
  var isConfigKey;
  var isElement;
  var isNode;
})();
