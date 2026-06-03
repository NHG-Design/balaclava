declare const unsafeWindow: (Window & Record<string, BalaclavaTooltipAPI | undefined>) | undefined;

const API_NAME = 'BalaclavaTooltip';
const HOST_ID = 'balaclava-tooltip-host';
const SAFEZONE = 8;
const ARROW_OFFSET_MIN = 10;
const ARROW_OFFSET_MAX = 90;
const ARROW_OFFSET_DEFAULT = 50;
const VERSION = '1.0.2';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type TooltipTheme = 'system' | 'dark' | 'light' | 'custom';
type TooltipContent = string | Node | null | undefined;
type TooltipContentResolver = TooltipContent | ((element: HTMLElement) => TooltipContent);

interface TooltipOptions {
    position?: TooltipPosition | string | null;
    theme?: TooltipTheme | string | null;
    showArrow?: boolean;
}

interface TooltipPoint {
    top: number;
    left: number;
}

interface TooltipThemeTokens {
    bgColor: string;
    textColor: string;
    borderColor: string;
    shadowColor: string;
}

interface TooltipConfig extends TooltipThemeTokens {
    theme: TooltipTheme;
    borderSize: string;
    borderRadius: string;
    padding: string;
    maxWidth: string;
    arrowSize: string;
    arrowBorderSize: string | null;
    arrowBorderColor: string | null;
    arrowBorderRadius: string | null;
    zIndex: number;
    animationDuration: string;
    fontSize: string;
    offset: number;
}

interface VisualTooltipConfig extends TooltipConfig {
    arrowBorderSize: string;
    arrowBorderColor: string;
    arrowBorderRadius: string;
}

interface BalaclavaTooltipAPI {
    version: string;
    show: (target: HTMLElement, content: TooltipContent, options?: TooltipOptions) => void;
    hide: () => void;
    configure: (userConfig?: Partial<TooltipConfig>) => void;
    attach: (element: HTMLElement, content: TooltipContentResolver, options?: TooltipOptions) => () => void;
    rescan: (root?: ParentNode) => void;
    destroy: () => void;
}

const VALID_POSITIONS = new Set<TooltipPosition>(['top', 'bottom', 'left', 'right']);
const VALID_THEMES = new Set<TooltipTheme>(['system', 'dark', 'light', 'custom']);
const CUSTOM_THEME_KEYS = new Set<keyof TooltipThemeTokens>(['bgColor', 'textColor', 'borderColor', 'shadowColor']);

const THEME_TOKENS: Readonly<Record<'dark' | 'light', Readonly<TooltipThemeTokens>>> = Object.freeze({
    dark: Object.freeze({
        bgColor: 'oklch(18% 0.012 260)',
        textColor: 'oklch(96% 0.012 95)',
        borderColor: 'oklch(96% 0.012 95 / 0.16)',
        shadowColor: 'oklch(12% 0.01 260 / 0.55)',
    }),
    light: Object.freeze({
        bgColor: 'oklch(98% 0.008 95)',
        textColor: 'oklch(24% 0.014 260)',
        borderColor: 'oklch(24% 0.014 260 / 0.14)',
        shadowColor: 'oklch(24% 0.014 260 / 0.3)',
    }),
});

const rootWindow = (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window) as Window & Record<
    string,
    BalaclavaTooltipAPI | undefined
>;

if (!rootWindow[API_NAME]?.version) {
    const DEFAULT_CONFIG: Readonly<TooltipConfig> = Object.freeze({
        theme: 'system',
        bgColor: THEME_TOKENS.dark.bgColor,
        textColor: THEME_TOKENS.dark.textColor,
        borderColor: THEME_TOKENS.dark.borderColor,
        shadowColor: THEME_TOKENS.dark.shadowColor,
        borderSize: '0',
        borderRadius: '8px',
        padding: '8px 12px',
        maxWidth: '250px',
        arrowSize: '12px',
        arrowBorderSize: null,
        arrowBorderColor: null,
        arrowBorderRadius: null,
        zIndex: 2147483647,
        animationDuration: '150ms',
        fontSize: '13px',
        offset: 8,
    });

    let config: TooltipConfig = { ...DEFAULT_CONFIG };
    let host: HTMLDivElement | null = null;
    let shadow: ShadowRoot | null = null;
    let styleEl: HTMLStyleElement | null = null;
    let tooltipEl: HTMLDivElement | null = null;
    let targetElement: HTMLElement | null = null;
    let targetRect: DOMRect | null = null;
    let preferredPosition: TooltipPosition = 'bottom';
    let requestedPosition: TooltipPosition = 'bottom';
    let activeTheme: TooltipTheme = DEFAULT_CONFIG.theme;
    let tooltipThemeOverride: TooltipTheme | null = null;
    let showArrow = true;
    let arrowOffset = ARROW_OFFSET_DEFAULT;
    let positionTrackingId: number | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let isVisible = false;
    let globalListenersController: AbortController | null = null;
    let readyController: AbortController | null = null;
    let tooltipCooldownEnd = 0;
    let nextShowInstant = false;

    const tooltipId = `balaclava-tt-${Math.random().toString(36).slice(2, 11)}`;
    let attachedElements = new WeakMap<HTMLElement, () => void>();
    const attachmentDetachers = new Set<() => void>();

    function init(): void {
        ensureHost();
        setupGlobalListeners();
        scanAll();
        setupMutationObserver();
    }

    function ensureHost(): void {
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

        shadow = host.attachShadow({ mode: 'closed' });
        styleEl = document.createElement('style');
        styleEl.textContent = buildStylesheet();
        shadow.appendChild(styleEl);
    }

    function buildStylesheet(): string {
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
        box-shadow: 0 2px 8px var(--balaclava-tooltip-shadow);
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

    function getVisualConfig(): VisualTooltipConfig {
        return {
            ...config,
            arrowBorderSize: config.arrowBorderSize ?? config.borderSize,
            arrowBorderColor: config.arrowBorderColor ?? 'var(--balaclava-tooltip-border)',
            arrowBorderRadius: config.arrowBorderRadius ?? '3px',
        };
    }

    function exposeApi(): void {
        const api: BalaclavaTooltipAPI = {
            version: VERSION,
            show: showTooltip,
            hide: hideTooltip,
            configure,
            attach: attachTooltip,
            rescan: scanAll,
            destroy,
        };

        rootWindow[API_NAME] = api;

        if ((window as unknown) !== (rootWindow as unknown)) {
            (window as object as Window & Record<string, BalaclavaTooltipAPI | undefined>)[API_NAME] = api;
        }
    }

    function setupGlobalListeners(): void {
        if (globalListenersController) return;

        globalListenersController = new AbortController();
        const { signal } = globalListenersController;

        window.addEventListener('resize', updateVisibleTooltip, { passive: true, signal });
        window.addEventListener('scroll', scheduleScrollUpdate, { capture: true, passive: true, signal });
        window.addEventListener('keydown', handleKeydown, { passive: true, signal });
    }

    function handleKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && isVisible) {
            hideTooltip();
        }
    }

    function scheduleScrollUpdate(): void {
        if (!isVisible) return;
        hideTooltip();
    }

    function updateVisibleTooltip(): void {
        if (!isVisible || !targetElement) return;

        if (!targetElement.isConnected) {
            hideTooltip();
            return;
        }

        targetRect = targetElement.getBoundingClientRect();
        updateTooltipPosition();
    }

    function showTooltip(target: HTMLElement, content: TooltipContent, options: TooltipOptions = {}): void {
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

    function hideTooltip(): void {
        tooltipCooldownEnd = Date.now() + 600;
        cleanupTooltip();
    }

    function configure(userConfig: Partial<TooltipConfig> = {}): void {
        const nextConfig: TooltipConfig = { ...config };
        let hasCustomThemeOverride = false;

        for (const [key, value] of Object.entries(userConfig)) {
            if (value === undefined || value === null) continue;

            if (key === 'theme') {
                nextConfig.theme = normalizeTheme(value, nextConfig.theme);
                continue;
            }

            if (isConfigKey(key)) {
                (nextConfig as unknown as Record<string, unknown>)[key] = value;
                hasCustomThemeOverride = hasCustomThemeOverride || CUSTOM_THEME_KEYS.has(key as keyof TooltipThemeTokens);
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

    function attachTooltip(element: HTMLElement, content: TooltipContentResolver, options: TooltipOptions = {}): () => void {
        if (!isElement(element)) {
            throw new TypeError('BalaclavaTooltip.attach element must be an HTMLElement.');
        }

        const controller = new AbortController();
        const { signal } = controller;
        let detached = false;
        let hoverTimer: ReturnType<typeof setTimeout> | null = null;

        const doShow = (): void => showTooltip(element, resolveContent(content, element), options);

        const onMouseEnter = (): void => {
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

        const onMouseLeave = (): void => {
            if (hoverTimer !== null) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
            if (targetElement === element) hideTooltip();
        };

        element.addEventListener('mouseenter', onMouseEnter, { signal });
        element.addEventListener('mouseleave', onMouseLeave, { signal });
        element.addEventListener('focus', doShow, { signal });
        element.addEventListener('blur', () => { if (targetElement === element) hideTooltip(); }, { signal });

        const detach = function detach(): void {
            if (detached) return;

            detached = true;
            if (hoverTimer !== null) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
            controller.abort();
            attachmentDetachers.delete(detach);

            if (targetElement === element) {
                hideTooltip();
            }
        };

        attachmentDetachers.add(detach);

        return detach;
    }

    function resolveContent(content: TooltipContentResolver, element: HTMLElement): TooltipContent {
        return typeof content === 'function' ? content(element) : content;
    }

    function scanAll(root: ParentNode = document): void {
        root.querySelectorAll?.('[data-balaclava-tooltip]').forEach(scanElement);
    }

    function scanElement(element: Element): void {
        if (!isElement(element) || attachedElements.has(element)) return;

        const text = element.getAttribute('data-balaclava-tooltip');
        if (!text) return;

        const position = normalizePosition(element.getAttribute('data-balaclava-tooltip-position'));
        const arrow = element.getAttribute('data-balaclava-tooltip-arrow') !== 'false';
        const theme = normalizeOptionalTheme(element.getAttribute('data-balaclava-tooltip-theme'));
        const options: TooltipOptions = { position, showArrow: arrow };

        if (theme) {
            options.theme = theme;
        }

        const detach = attachTooltip(element, text, options);

        attachedElements.set(element, detach);
    }

    function setupMutationObserver(): void {
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
                'data-balaclava-tooltip-theme',
            ],
        });
    }

    function scanAddedNode(node: Node): void {
        if (!isElement(node)) return;

        if (node.hasAttribute('data-balaclava-tooltip')) {
            scanElement(node);
        }

        scanAll(node);
    }

    function cleanupRemovedNode(node: Node): void {
        if (!isElement(node)) return;

        cleanupAttachedElement(node);
        node.querySelectorAll?.('[data-balaclava-tooltip]').forEach(cleanupAttachedElement);

        if (targetElement && (node === targetElement || node.contains(targetElement))) {
            hideTooltip();
        }
    }

    function cleanupAttachedElement(element: Element): void {
        if (!isElement(element)) return;

        const detach = attachedElements.get(element);

        if (detach) {
            detach();
            attachedElements.delete(element);
        }
    }

    function refreshElement(target: Node): void {
        if (!isElement(target)) return;

        cleanupAttachedElement(target);

        if (target.hasAttribute('data-balaclava-tooltip')) {
            scanElement(target);
        }
    }

    function renderTooltip(content: TooltipContent): void {
        if (!shadow) return;

        if (tooltipEl) {
            tooltipEl.remove();
        }

        tooltipEl = document.createElement('div');
        tooltipEl.id = tooltipId;
        tooltipEl.className = nextShowInstant ? getTooltipClassName() : `${getTooltipClassName()} is-entering`;
        if (nextShowInstant) tooltipEl.setAttribute('data-instant', '');
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

        if (!nextShowInstant) {
            requestAnimationFrame(() => {
                if (tooltipEl) {
                    tooltipEl.classList.remove('is-entering');
                }
            });
        }
    }

    function setupIntersectionObserver(): void {
        cleanupIntersectionObserver();

        if (!targetElement || typeof IntersectionObserver === 'undefined') return;

        intersectionObserver = new IntersectionObserver((entries) => {
            if (entries.some((entry) => !entry.isIntersecting)) {
                hideTooltip();
            }
        });

        intersectionObserver.observe(targetElement);
    }

    function cleanupIntersectionObserver(): void {
        if (intersectionObserver) {
            intersectionObserver.disconnect();
            intersectionObserver = null;
        }
    }

    function cleanupTooltip(): void {
        if (targetElement) {
            targetElement.removeAttribute('aria-describedby');
        }

        if (positionTrackingId !== null) {
            cancelAnimationFrame(positionTrackingId);
            positionTrackingId = null;
        }

        if (tooltipEl) {
            const exiting = tooltipEl;
            tooltipEl = null;
            exiting.removeAttribute('id');
            exiting.classList.add('is-exiting');
            const remove = () => { if (exiting.isConnected) exiting.remove(); };
            exiting.addEventListener('transitionend', remove, { once: true });
            setTimeout(remove, 200);
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

    function destroy(): void {
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

        if (rootWindow[API_NAME]?.version === VERSION) {
            try {
                delete rootWindow[API_NAME];
            } catch {
                rootWindow[API_NAME] = undefined;
            }
        }

        const pageWindow = window as object as Window & Record<string, BalaclavaTooltipAPI | undefined>;

        if ((window as unknown) !== (rootWindow as unknown) && pageWindow[API_NAME]?.version === VERSION) {
            try {
                delete pageWindow[API_NAME];
            } catch {
                pageWindow[API_NAME] = undefined;
            }
        }
    }

    function trackTargetPosition(): void {
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

    function updateTooltipPosition(): void {
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

    function getInitialPosition(tooltipWidth: number, tooltipHeight: number): TooltipPoint {
        if (!targetRect) return { top: SAFEZONE, left: SAFEZONE };

        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;

        switch (preferredPosition) {
            case 'top':
                return {
                    top: targetRect.top - tooltipHeight - config.offset,
                    left: targetCenterX - tooltipWidth / 2,
                };
            case 'left':
                return {
                    top: targetCenterY - tooltipHeight / 2,
                    left: targetRect.left - tooltipWidth - config.offset,
                };
            case 'right':
                return {
                    top: targetCenterY - tooltipHeight / 2,
                    left: targetRect.right + config.offset,
                };
            case 'bottom':
            default:
                return {
                    top: targetRect.bottom + config.offset,
                    left: targetCenterX - tooltipWidth / 2,
                };
        }
    }

    function applyFallback(position: TooltipPoint, tooltipWidth: number, tooltipHeight: number): void {
        if (!targetRect) return;

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

    function clampToViewport(position: TooltipPoint, tooltipWidth: number, tooltipHeight: number): void {
        const original = { top: position.top, left: position.left };
        const maxTop = Math.max(SAFEZONE, window.innerHeight - tooltipHeight - SAFEZONE);
        const maxLeft = Math.max(SAFEZONE, window.innerWidth - tooltipWidth - SAFEZONE);

        position.top = Math.max(SAFEZONE, Math.min(position.top, maxTop));
        position.left = Math.max(SAFEZONE, Math.min(position.left, maxLeft));

        if (showArrow) {
            updateArrowOffset(original, position, tooltipWidth, tooltipHeight);
        }
    }

    function updateArrowOffset(
        original: TooltipPoint,
        clamped: TooltipPoint,
        tooltipWidth: number,
        tooltipHeight: number
    ): void {
        if (!targetRect) return;

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

    function calculatePercentageOffset(offset: number, dimension: number): number {
        if (!dimension) return ARROW_OFFSET_DEFAULT;

        const percentage = (offset / dimension) * 100;
        return Math.max(ARROW_OFFSET_MIN, Math.min(ARROW_OFFSET_MAX, percentage));
    }

    function sameRect(left: DOMRect | null, right: DOMRect | null): boolean {
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

    function normalizePosition(value: unknown): TooltipPosition {
        return typeof value === 'string' && VALID_POSITIONS.has(value as TooltipPosition)
            ? (value as TooltipPosition)
            : 'bottom';
    }

    function normalizeTheme(value: unknown, fallback: TooltipTheme = 'system'): TooltipTheme {
        return normalizeOptionalTheme(value) || fallback;
    }

    function normalizeOptionalTheme(value: unknown): TooltipTheme | null {
        const theme = typeof value === 'string' ? value.toLowerCase() : value;
        return VALID_THEMES.has(theme as TooltipTheme) ? (theme as TooltipTheme) : null;
    }

    function getTooltipClassName(): string {
        return `balaclava-tooltip is-${preferredPosition} is-theme-${activeTheme}`;
    }

    function refreshTooltipClassName(): void {
        if (!tooltipEl) return;

        const isEntering = tooltipEl.classList.contains('is-entering');
        tooltipEl.className = `${getTooltipClassName()}${isEntering ? ' is-entering' : ''}`;
    }

    function isConfigKey(value: string): value is keyof TooltipConfig {
        return Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, value);
    }

    function isElement(value: unknown): value is HTMLElement {
        return Boolean(
            value &&
            typeof value === 'object' &&
            (value as Node).nodeType === Node.ELEMENT_NODE &&
            typeof (value as HTMLElement).getBoundingClientRect === 'function'
        );
    }

    function isNode(value: unknown): value is Node {
        return Boolean(
            value &&
            typeof value === 'object' &&
            typeof (value as Node).nodeType === 'number' &&
            typeof (value as Node).cloneNode === 'function'
        );
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
}

export {};
