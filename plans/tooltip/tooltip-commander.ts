import { HTMLTemplateResult, TemplateResult, unsafeCSS } from 'lit';
import { CoreElement, html } from '@conx/core/classes/CoreElement';
import { state } from 'lit/decorators.js';
import { customElement } from '@conx/core/decorators';
import { query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { classMap } from 'lit/directives/class-map.js';
import { getVariable, setVariables } from '@conx/business/helpers/theme/variableHelpers';
import { calculatePercentageOffset } from '@conx/business/helpers/math/calculatePercentageOffset';
import { Position, ConTooltipEvent, TooltipPosition, TooltipDimensions, ArrowOffsetOptions } from '@conx/business/types/components/con-tooltip-commander.types';

import { addTypeSafeEventListener } from '@conx/core/helpers/Events';

import conTooltipCommanderStyles from './con-tooltip-commander.scss?inline';

const TOOLTIP_SAFEZONE = 8;
const ARROW_OFFSET_MIN = 10;
const ARROW_OFFSET_MAX = 90;
const ARROW_OFFSET_DEFAULT = 50;

/**
 * Component that manages tooltip display across the application.
 * Listens for custom 'tooltip:show' events and displays tooltips relative to the triggering element.
 */
@customElement('con-tooltip-commander')
export class ConTooltipCommander extends CoreElement {
  public static styles = [unsafeCSS(conTooltipCommanderStyles)];

  @query('.tooltip')
  private tooltipElement!: HTMLElement;

  /** Current viewport width. */
  @state()
  private viewportWidth: number = 0;

  /** Current viewport height. */
  @state()
  private viewportHeight: number = 0;

  /** Whether the tooltip is currently visible. */
  @state()
  private isTooltipVisible: boolean = false;

  /** Tooltip position relative to the top, in pixels. */
  @state()
  private tooltipTop: number = 0;

  /** Tooltip position relative to the left, in pixels. */
  @state()
  private tooltipLeft: number = 0;

  /** The current target element's bounding rectangle. */
  @state()
  private targetRect: DOMRect;

  /** The current tooltip content (can be html`` template or string). */
  @state()
  private tooltipContent: TemplateResult | string;

  /** The tooltip's preferred position. */
  @state()
  private preferredPosition: Position = Position.BOTTOM;

  /** Whether to show the tooltip arrow. */
  @state()
  private showArrow: boolean = true;

  /** Arrow offset percentage for positioning within the tooltip. */
  @state()
  private arrowOffset: number = ARROW_OFFSET_DEFAULT;

  private targetElement: HTMLElement;

  /** Unique ID for the tooltip element (used for accessibility). */
  readonly #tooltipId: string = `tooltip-${Math.random().toString(36).substring(2, 11)}`;

  /** Viewport safezone padding, in pixels. */
  readonly #safezone: number = TOOLTIP_SAFEZONE;

  #eventController: AbortController = new AbortController();

  #intersectionObserver: IntersectionObserver;

  /** ID for the requestAnimationFrame tracking tooltip position. */
  #positionTrackingId: number = null;

  // #region Event handlers

  /**
   * Handle window resize to update dynamic viewport dimensions.
   */
  #handleResize = (): void => {
    const { innerWidth, innerHeight } = window;
    this.viewportWidth = innerWidth;
    this.viewportHeight = innerHeight;
  };

  /**
   * Handle scroll to update tooltip position.
   */
  #handleScroll = (): void => {
    if (this.isTooltipVisible && this.targetElement) {
      requestAnimationFrame(() => {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
        this.targetRect = this.targetElement!.getBoundingClientRect();
        this.#updateTooltipPosition();
      });
    }
  };

  /**
   * Continuously track target element position and update tooltip.
   */
  #trackTargetPosition = (): void => {
    if (!this.isTooltipVisible || !this.targetElement) {
      return;
    }

    const newRect = this.targetElement.getBoundingClientRect();

    // Check if position has changed
    if (!this.targetRect ||
        newRect.top !== this.targetRect.top ||
        newRect.left !== this.targetRect.left ||
        newRect.width !== this.targetRect.width ||
        newRect.height !== this.targetRect.height) {
      this.targetRect = newRect;
      this.#updateTooltipPosition();
    }

    // Continue tracking
    this.#positionTrackingId = requestAnimationFrame(this.#trackTargetPosition);
  };

  /**
   * Handle tooltip show event and calculate positioning.
   * @param event - Custom event containing target element dimensions.
   */
  #handleTooltipShow = (event: ConTooltipEvent): void => {
    if (!event.detail?.target) return;

    const { target, content, position, showArrow } = event.detail;

    this.targetElement = target;
    this.targetRect = target.getBoundingClientRect();
    this.tooltipContent = content || null;
    this.preferredPosition = position || Position.BOTTOM;
    this.showArrow = showArrow !== undefined ? showArrow : true;
    this.isTooltipVisible = true;

    this.targetElement.setAttribute('aria-describedby', this.#tooltipId);

    this.#setupIntersectionObserver();

    requestAnimationFrame(() => {
      this.viewportWidth = window.innerWidth;
      this.viewportHeight = window.innerHeight;
      this.#updateTooltipPosition();
      // Start continuous position tracking
      this.#trackTargetPosition();
    });
  };

  /**
   * Handle tooltip hide event and hide the tooltip.
   * @param _event - Custom event containing target element dimensions.
   */
  #handleTooltipHide = (_event: ConTooltipEvent): void => {
    this.#cleanupTooltip();
  };
  // #endregion

  // #region Lifecycle methods
  /**
   * Initialize viewport dimensions and set up event listeners.
   */
  public connectedCallback(): void {
    super.connectedCallback();

    this.#eventController = new AbortController();
    this.#recordViewportDimensions();
    this.#setupEventListeners();
  }

  /**
   * Clean up event listeners when component is disconnected.
   */
  public disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#eventController.abort();
    this.#cleanupIntersectionObserver();
  }

  /**
   * Render the tooltip when visible.
   */
  public render(): HTMLTemplateResult {
    return html`
    ${when(this.isTooltipVisible, () => html`
      <div
        id="${this.#tooltipId}"
        role="tooltip"
        aria-live="polite"
        aria-label="${typeof this.tooltipContent === 'string' ? this.tooltipContent : 'Tooltip'}"
        class="${classMap({
          tooltip: true,
          'show-arrow': this.showArrow,
          [`is-${this.preferredPosition}`]: this.showArrow && this.preferredPosition
        })}"
        data-show-arrow="${this.showArrow}"
      >
        <div class="tooltip-content">${this.tooltipContent || 'Hello there!'}</div>
        ${when(this.showArrow, () => html`
          <span aria-hidden="true" class="tooltip-arrow"></span>
        `)}
      </div>
    `)}
  `;
  }

  /**
   * Record initial and dynamic viewport dimensions.
   */
  #recordViewportDimensions(): void {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;

    addTypeSafeEventListener(window, 'resize', this.#handleResize, {
      signal: this.#eventController.signal
    });

    addTypeSafeEventListener(window, 'scroll', this.#handleScroll, {
      signal: this.#eventController.signal,
      capture: true
    });
  }

  /**
   * Set up event listeners for tooltip events.
   */
  #setupEventListeners(): void {
    addTypeSafeEventListener(window, 'tooltip:show', this.#handleTooltipShow, {
      signal: this.#eventController.signal
    });
    addTypeSafeEventListener(window, 'tooltip:hide', this.#handleTooltipHide, {
      signal: this.#eventController.signal
    });
  }

  /**
   * Set up IntersectionObserver to auto-hide tooltip when target leaves viewport.
   */
  #setupIntersectionObserver(): void {
    if (!this.targetElement) return;

    this.#cleanupIntersectionObserver();

    this.#intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && this.isTooltipVisible) {
            this.#cleanupTooltip();
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px'
      }
    );

    this.#intersectionObserver.observe(this.targetElement);
  }

  /**
   * Clean up IntersectionObserver.
   */
  #cleanupIntersectionObserver(): void {
    if (this.#intersectionObserver) {
      this.#intersectionObserver.disconnect();
      this.#intersectionObserver = null;
    }
  }

  /**
   * Centralized cleanup method for tooltip state.
   */
  #cleanupTooltip(): void {
    if (this.targetElement) {
      this.targetElement.removeAttribute('aria-describedby');
    }

    // Cancel position tracking
    if (this.#positionTrackingId !== null) {
      cancelAnimationFrame(this.#positionTrackingId);
      this.#positionTrackingId = null;
    }

    this.isTooltipVisible = false;
    this.#cleanupIntersectionObserver();
    this.targetElement = null;
    this.targetRect = null;
    this.tooltipContent = null;
  }
  // #endregion

  /**
   * Get tooltip offset from CSS variable.
   */
  #getTooltipOffset(): number {
    const offset = getVariable({
      variable: '--js-tooltip-offset',
      element: this
    });
    return parseInt(offset, 10) || 8;
  }

  /**
   * Calculate initial tooltip position based on preferred placement.
   * @param dimensions - Tooltip dimensions object.
   */
  #getInitialPosition(dimensions: TooltipDimensions): TooltipPosition {
    const targetCenterX = this.targetRect!.left + (this.targetRect!.width / 2);
    const targetCenterY = this.targetRect!.top + (this.targetRect!.height / 2);
    const { tooltipWidth, tooltipHeight, tooltipOffset = this.#getTooltipOffset() } = dimensions;

    switch (this.preferredPosition) {
      case Position.TOP:
        return {
          top: this.targetRect!.top - tooltipHeight - tooltipOffset,
          left: targetCenterX - (tooltipWidth / 2)
        };
      case Position.LEFT:
        return {
          top: targetCenterY - (tooltipHeight / 2),
          left: this.targetRect!.left - tooltipWidth - tooltipOffset
        };
      case Position.RIGHT:
        return {
          top: targetCenterY - (tooltipHeight / 2),
          left: this.targetRect!.right + tooltipOffset
        };
      case Position.BOTTOM:
      default:
        return {
          top: this.targetRect!.bottom + tooltipOffset,
          left: targetCenterX - (tooltipWidth / 2)
        };
    }
  }

  /**
   * Apply fallback position if tooltip would overflow viewport.
   * @param position - Current tooltip position object.
   * @param dimensions - Tooltip dimensions object.
   */
  #setFallbackPosition(position: TooltipPosition, dimensions: TooltipDimensions): void {
    const { tooltipWidth, tooltipHeight, tooltipOffset } = dimensions;

    // Check for overflow and adjust position accordingly
    switch (this.preferredPosition) {
      case Position.BOTTOM: {
        const wouldOverflowBottom = position.top + tooltipHeight > this.viewportHeight;
        if (wouldOverflowBottom) {
          const topAlternative = this.targetRect!.top - tooltipHeight - tooltipOffset;
          if (topAlternative >= 0) {
            position.top = topAlternative;
            this.preferredPosition = Position.TOP;
          }
        }
        break;
      }
      case Position.TOP: {
        const wouldOverflowTop = position.top < 0;
        if (wouldOverflowTop) {
          const bottomAlternative = this.targetRect!.bottom + tooltipOffset;
          if (bottomAlternative + tooltipHeight <= this.viewportHeight) {
            position.top = bottomAlternative;
            this.preferredPosition = Position.BOTTOM;
          }
        }
        break;
      }
      case Position.LEFT: {
        const wouldOverflowLeft = position.left < 0;
        if (wouldOverflowLeft) {
          const rightAlternative = this.targetRect!.right + tooltipOffset;
          if (rightAlternative + tooltipWidth <= this.viewportWidth) {
            position.left = rightAlternative;
            this.preferredPosition = Position.RIGHT;
          }
        }
        break;
      }
      case Position.RIGHT: {
        const wouldOverflowRight = position.left + tooltipWidth > this.viewportWidth;
        if (wouldOverflowRight) {
          const leftAlternative = this.targetRect!.left - tooltipWidth - tooltipOffset;
          if (leftAlternative >= 0) {
            position.left = leftAlternative;
            this.preferredPosition = Position.LEFT;
          }
        }
        break;
      }
      default:
        break;
    }
  }

  /**
   * Constrain position to viewport boundaries and calculate arrow offset.
   * @param position - Tooltip position object (modified in place).
   * @param dimensions - Tooltip dimensions object.
   */
  #setTooltipBounds(position: TooltipPosition, dimensions: TooltipDimensions): void {
    const originalPosition = { ...position };
    const { tooltipWidth, tooltipHeight } = dimensions;

    position.top = Math.max(this.#safezone, Math.min(position.top, this.viewportHeight - tooltipHeight - this.#safezone));
    position.left = Math.max(this.#safezone, Math.min(position.left, this.viewportWidth - tooltipWidth - this.#safezone));

    if (this.showArrow) {
      this.#updateTooltipArrow({
        originalPosition,
        constrainedPosition: position,
        dimensions
      });
    }
  }

  /**
   * Update arrow offset when the tooltip is constrained to viewport edges.
   * @param options - Options for arrow offset calculation.
   */
  #updateTooltipArrow({ originalPosition, constrainedPosition, dimensions }: ArrowOffsetOptions): void {
    this.arrowOffset = ARROW_OFFSET_DEFAULT;
    const { tooltipWidth, tooltipHeight } = dimensions;

    const offsetOptions = {
      defaultOffset: ARROW_OFFSET_DEFAULT,
      min: ARROW_OFFSET_MIN,
      max: ARROW_OFFSET_MAX
    };

    switch (this.preferredPosition) {
      // Calculate horizontal offset for top/bottom positioned tooltips
      case Position.TOP:
      case Position.BOTTOM:
        if (originalPosition.left !== constrainedPosition.left) {
          const targetCenterX = this.targetRect!.left + (this.targetRect!.width / 2);
          const tooltipCenterX = constrainedPosition.left + (tooltipWidth / 2);
          const offset = targetCenterX - tooltipCenterX;
          this.arrowOffset = calculatePercentageOffset(offset, tooltipWidth, offsetOptions);
        }
        break;

      // Calculate vertical offset for left/right positioned tooltips
      case Position.LEFT:
      case Position.RIGHT:
        if (originalPosition.top !== constrainedPosition.top) {
          const targetCenterY = this.targetRect!.top + (this.targetRect!.height / 2);
          const tooltipCenterY = constrainedPosition.top + (tooltipHeight / 2);
          const offset = targetCenterY - tooltipCenterY;
          this.arrowOffset = calculatePercentageOffset(offset, tooltipHeight, offsetOptions);
        }
        break;
      default:
        break;
    }
  }

  /**
   * Calculate tooltip position based on target element dimensions and preferred position.
   * Uses fixed positioning relative to viewport.
   * Ensures tooltip never exceeds viewport boundaries.
   */
  #updateTooltipPosition(): void {
    if (!this.targetRect || !this.tooltipElement) return;

    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;
    const tooltipOffset = this.#getTooltipOffset();

    const position = this.#getInitialPosition({ tooltipWidth, tooltipHeight, tooltipOffset });
    const dimensions: TooltipDimensions = { tooltipWidth, tooltipHeight, tooltipOffset };
    this.#setFallbackPosition(position, dimensions);
    this.#setTooltipBounds(position, dimensions);

    this.tooltipTop = position.top;
    this.tooltipLeft = position.left;

    setVariables({
      '--js-tooltip-x': `${this.tooltipLeft}px`,
      '--js-tooltip-y': `${this.tooltipTop}px`,
      '--js-tooltip-arrow-offset': `${this.arrowOffset}%`
    }, this.tooltipElement);
  }
}
