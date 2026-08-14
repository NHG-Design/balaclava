export type AnchorSide = "top" | "bottom" | "left" | "right";

export interface AnchorRect {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
}

export interface AnchorPoint {
    top: number;
    left: number;
}

export interface AnchorPositionResult extends AnchorPoint {
    /** May differ from the requested side if `applyFallback` flipped it to fit the viewport. */
    side: AnchorSide;
    /** Percentage (clamped between `arrowOffsetMin`/`arrowOffsetMax`) along the panel's
     *  cross-axis edge where the arrow should sit, so it still points at the target after clamping. */
    arrowOffsetPercent: number;
}

export interface AnchorPositionOptions {
    /** Gap in px between the target and the panel along the anchor axis. */
    offset?: number;
    /** Minimum px distance kept between the panel and the viewport edge. */
    safezone?: number;
    arrowOffsetMin?: number;
    arrowOffsetMax?: number;
    arrowOffsetDefault?: number;
    viewportWidth?: number;
    viewportHeight?: number;
}

const DEFAULTS: Required<AnchorPositionOptions> = {
    offset: 8,
    safezone: 8,
    arrowOffsetMin: 10,
    arrowOffsetMax: 90,
    arrowOffsetDefault: 50,
    viewportWidth: 0,
    viewportHeight: 0,
};

function initialPosition(
    targetRect: AnchorRect,
    side: AnchorSide,
    panelWidth: number,
    panelHeight: number,
    offset: number,
): AnchorPoint {
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

function applyFallback(
    position: AnchorPoint,
    side: AnchorSide,
    targetRect: AnchorRect,
    panelWidth: number,
    panelHeight: number,
    offset: number,
    safezone: number,
    viewportWidth: number,
    viewportHeight: number,
): AnchorSide {
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

function clampToViewport(
    position: AnchorPoint,
    panelWidth: number,
    panelHeight: number,
    safezone: number,
    viewportWidth: number,
    viewportHeight: number,
): AnchorPoint {
    const maxTop = Math.max(safezone, viewportHeight - panelHeight - safezone);
    const maxLeft = Math.max(safezone, viewportWidth - panelWidth - safezone);
    return {
        top: Math.max(safezone, Math.min(position.top, maxTop)),
        left: Math.max(safezone, Math.min(position.left, maxLeft)),
    };
}

function percentageOffset(offset: number, dimension: number, min: number, max: number, fallback: number): number {
    if (!dimension) return fallback;
    const percentage = (offset / dimension) * 100;
    return Math.max(min, Math.min(max, percentage));
}

/**
 * Computes a viewport-safe position for a panel anchored to `targetRect`: tries the requested
 * side, flips to the opposite side if it wouldn't fit, clamps into the viewport, and returns an
 * arrow offset percentage so an arrow element can still point at the target after clamping.
 */
export function computeAnchorPosition(
    targetRect: AnchorRect,
    panelWidth: number,
    panelHeight: number,
    requestedSide: AnchorSide,
    options: AnchorPositionOptions = {},
): AnchorPositionResult {
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
        viewportHeight,
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
                opts.arrowOffsetDefault,
            );
        }
    } else if (original.top !== clamped.top) {
        const targetCenterY = targetRect.top + targetRect.height / 2;
        arrowOffsetPercent = percentageOffset(
            targetCenterY - clamped.top,
            panelHeight,
            opts.arrowOffsetMin,
            opts.arrowOffsetMax,
            opts.arrowOffsetDefault,
        );
    }

    return { top: clamped.top, left: clamped.left, side, arrowOffsetPercent };
}
